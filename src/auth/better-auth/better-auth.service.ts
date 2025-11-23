import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { hash } from 'argon2';
import { generateIncrementId } from '../../utils/generateIncrementId';
import { SessionService } from '../session/session.service';

// Import new services
import { AuthTokenService } from './services/auth-token.service';
import { PasswordService } from './services/password.service';
import { EmailVerificationService } from './services/email-verification.service';
import { OAuthProviderService } from './services/oauth-provider.service';
import { UserCompanyService } from './services/user-company.service';

// Import strategies
import {
  EmailLoginStrategy,
  OAuthLoginStrategy,
  TwoFactorLoginStrategy,
} from './strategies';

// Import types
import { UserPayload, DeviceInfo, RegisterData, GoogleUserData } from './types';

@Injectable()
export class BetterAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    // New services
    private readonly authTokenService: AuthTokenService,
    private readonly passwordService: PasswordService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly oauthProviderService: OAuthProviderService,
    private readonly userCompanyService: UserCompanyService,
    // Strategies
    private readonly emailLoginStrategy: EmailLoginStrategy,
    private readonly oauthLoginStrategy: OAuthLoginStrategy,
    private readonly twoFactorLoginStrategy: TwoFactorLoginStrategy,
  ) {}

  /**
   * Register user baru
   */
  async register(data: RegisterData) {
    console.log('=== REGISTER SERVICE ===');
    console.log('Data received in service:', data);
    console.log('company_id:', data.company_id);
    console.log('branch_id:', data.branch_id);

    // Cek apakah user sudah ada
    const existingUser = await this.prisma.sys_User.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Validasi role USER exists
    await this.validateUserRoleExists();

    // Validasi company exists
    await this.validateActiveCompanyExists();

    // Create user
    console.log('Creating user with data:', {
      name: data.name,
      email: data.email,
      company_id: data.company_id,
      branch_id: data.branch_id,
    });
    const newUser = await this.createUser(data);
    console.log('User created:', {
      id: newUser.id,
      company_id: newUser.company_id,
      branch_id: newUser.branch_id,
    });

    // Assign default company & role
    await this.userCompanyService.assignDefaultCompanyRole(newUser.id);

    // Generate dan kirim verification email
    await this.emailVerificationService.sendVerificationEmail(
      newUser.id,
      newUser.email,
      newUser.name,
    );

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      company_id: newUser.company_id,
      branch_id: newUser.branch_id,
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Login dengan email & password
   */
  async login(email: string, password: string, deviceInfo?: DeviceInfo) {
    return this.emailLoginStrategy.execute({ email, password }, deviceInfo);
  }

  /**
   * Verify OTP dan complete login (untuk 2FA)
   */
  async verifyOtpAndLogin(
    userId: number,
    otpCode: string,
    deviceInfo?: DeviceInfo,
  ) {
    return this.twoFactorLoginStrategy.execute({ userId, otpCode }, deviceInfo);
  }

  /**
   * Login dengan Google OAuth
   */
  async loginWithGoogle(googleUser: GoogleUserData, deviceInfo?: DeviceInfo) {
    return this.oauthLoginStrategy.execute(googleUser, deviceInfo);
  }

  /**
   * Refresh access token
   */
  async refreshToken(userId: number, refreshToken: string) {
    // Validate session
    const session = await this.sessionService.getSessionByRefreshToken(
      userId,
      refreshToken,
    );

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user role
    const userCompanies =
      await this.userCompanyService.getUserCompaniesWithRoles(userId);
    const selectedCompany = userCompanies[0];

    // Generate new tokens
    const tokens = await this.authTokenService.generateTokens(
      userId,
      selectedCompany?.userRole?.role_id || 'USER',
      selectedCompany?.company_id || '',
      selectedCompany?.branch_id || '',
    );

    // Update session dengan refresh token baru
    const hashedRefreshToken = await hash(tokens.refreshToken);
    
    console.log('[RefreshToken] Updating session:', session.id);
    console.log('[RefreshToken] New refresh token hash (first 30 chars):', hashedRefreshToken.substring(0, 30));
    
    await this.prisma.sys_Session.update({
      where: { id: session.id },
      data: {
        refreshToken: hashedRefreshToken,
        hasRefreshedToken: true,
        lastActivityAt: new Date(),
      },
    });
    console.log('[RefreshToken] Session updated successfully');

    // Update hashed refresh token di user (backward compatibility)
    console.log('[RefreshToken] Updating user hashedRefreshToken for user:', userId);
    console.log('[RefreshToken] New hash to save (first 30 chars):', hashedRefreshToken.substring(0, 30));
    
    // Check current state before update
    const userBefore = await this.prisma.sys_User.findUnique({
      where: { id: userId },
      select: { hashedRefreshToken: true, updatedAt: true },
    });
    console.log('[RefreshToken] Before update - hash:', userBefore?.hashedRefreshToken?.substring(0, 30));
    console.log('[RefreshToken] Before update - updatedAt:', userBefore?.updatedAt);
    
    const now = new Date();
    console.log('[RefreshToken] About to update user with updatedAt:', now);
    
    const updatedUser = await this.prisma.sys_User.update({
      where: { id: userId },
      data: { 
        hashedRefreshToken,
        updatedAt: now, // Explicitly update updatedAt
      },
    });
    
    console.log('[RefreshToken] User updated successfully. UpdatedAt from response:', updatedUser.updatedAt);
    console.log('[RefreshToken] UpdatedAt is null?', updatedUser.updatedAt === null);
    console.log('[RefreshToken] UpdatedAt type:', typeof updatedUser.updatedAt);
    console.log('[RefreshToken] After update - hash (first 30 chars):', updatedUser.hashedRefreshToken?.substring(0, 30));
    
    // Verify update dengan query langsung
    const userAfter = await this.prisma.sys_User.findUnique({
      where: { id: userId },
      select: { hashedRefreshToken: true, updatedAt: true },
    });
    console.log('[RefreshToken] Verification query - hash:', userAfter?.hashedRefreshToken?.substring(0, 30));
    console.log('[RefreshToken] Verification query - updatedAt:', userAfter?.updatedAt);
    
    if (userAfter?.hashedRefreshToken !== hashedRefreshToken) {
      console.error('[RefreshToken] ⚠️ WARNING: Hash mismatch after update!');
      console.error('[RefreshToken] Expected:', hashedRefreshToken.substring(0, 30));
      console.error('[RefreshToken] Got:', userAfter?.hashedRefreshToken?.substring(0, 30));
    } else {
      console.log('[RefreshToken] ✅ Hash match confirmed');
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
    };
  }

  /**
   * Logout
   */
  async logout(userId: number, sessionId?: string) {
    if (sessionId) {
      // Revoke specific session
      await this.sessionService.revokeSession(
        sessionId,
        'User logged out from this device',
      );
    } else {
      // Revoke all sessions (fallback untuk backward compatibility)
      await this.sessionService.revokeAllSessions(userId);
    }

    // Clear refresh token di user (backward compatibility)
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    return { message: 'Logout successful' };
  }

  /**
   * Forgot Password - Step 1: Request password reset
   * Generate token dan kirim email
   */
  async forgotPassword(email: string) {
    return this.passwordService.requestPasswordReset(email);
  }

  /**
   * Reset Password - Step 2: Verify token dan update password
   */
  async resetPasswordWithToken(token: string, newPassword: string) {
    return this.passwordService.resetPasswordWithToken(token, newPassword);
  }

  /**
   * @deprecated Use forgotPassword() and resetPasswordWithToken() instead
   * Reset password (INSECURE - for backward compatibility only)
   * WARNING: This allows anyone to reset password with just email!
   */
  async resetPassword(email: string, newPassword: string) {
    return this.passwordService.resetPasswordInsecure(email, newPassword);
  }

  /**
   * Verify JWT token dan return user
   */
  async verifyToken(token: string): Promise<UserPayload> {
    return this.authTokenService.verifyAccessToken(token);
  }

  /**
   * Get user by ID dengan role info
   */
  async getUserById(userId: number) {
    const userWithCompanies =
      await this.userCompanyService.getUserWithCompanies(userId);

    if (!userWithCompanies) {
      throw new UnauthorizedException('User not found');
    }

    return userWithCompanies;
  }

  // ============== OAUTH METHODS ==============

  /**
   * Exchange Google authorization code untuk access token
   */
  async exchangeGoogleCode(code: string): Promise<string> {
    return this.oauthProviderService.exchangeGoogleCode(code);
  }

  /**
   * Get user info dari Google menggunakan access token
   */
  async getGoogleUserInfo(accessToken: string) {
    return this.oauthProviderService.getGoogleUserInfo(accessToken);
  }

  // ============== EMAIL VERIFICATION METHODS ==============

  /**
   * Generate verification token dan kirim email
   */
  async sendVerificationEmail(
    userId: number,
    email: string,
    name: string,
  ): Promise<void> {
    return this.emailVerificationService.sendVerificationEmail(
      userId,
      email,
      name,
    );
  }

  /**
   * Verify email dengan token
   */
  async verifyEmail(token: string) {
    return this.emailVerificationService.verifyEmail(token);
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    return this.emailVerificationService.resendVerificationEmail(email);
  }

  // ============== PRIVATE HELPER METHODS ==============

  /**
   * Create user dengan hashed password
   */
  private async createUser(data: RegisterData) {
    const hashedPassword = await hash(data.password);
    const newId = await generateIncrementId(this.prisma, 'sys_User');

    return await this.prisma.sys_User.create({
      data: {
        id: newId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        image: data.image,
        company_id: data.company_id,
        branch_id: data.branch_id,
        iStatus: 'Active',
        isAdmin: false,
        emailVerified: false,
      },
    });
  }

  /**
   * Validate USER role exists
   */
  private async validateUserRoleExists() {
    const defaultRole = await this.prisma.sys_Role.findFirst({
      where: {
        iStatus: 'Active',
        id: 'USER',
      },
    });

    if (!defaultRole) {
      throw new ConflictException(
        'USER role not found. Please create USER role first.',
      );
    }
  }

  /**
   * Validate active company exists
   */
  private async validateActiveCompanyExists() {
    const defaultCompany = await this.prisma.sys_Company.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultCompany) {
      throw new ConflictException('No active company found');
    }
  }
}
