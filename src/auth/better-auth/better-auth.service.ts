import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import refreshConfig from '../config/refresh.config';
import googleOAuthConfig from '../config/google-oauth.config';
import { generateIncrementId } from '../../utils/generateIncrementId';
import axios from 'axios';
import { SessionService } from '../session/session.service';
import { EmailService } from '../../email/email.service';
import { TwoFactorService } from '../two-factor/two-factor.service';
import { randomBytes } from 'crypto';

interface UserPayload {
  sub: number;
  role_id: string;
  company_id: string;
  branch_id: string;
}

@Injectable()
export class BetterAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    @Inject(googleOAuthConfig.KEY)
    private googleOAuthConfiguration: ConfigType<typeof googleOAuthConfig>,
  ) {}

  /**
   * Register user baru
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    image?: string;
  }) {
    // Cek apakah user sudah ada
    const existingUser = await this.prisma.sys_User.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(data.password);

    // Generate manual ID untuk sys_User
    const newId = await generateIncrementId(this.prisma, 'sys_User');

    // Buat user baru dengan emailVerified = false
    const newUser = await this.prisma.sys_User.create({
      data: {
        id: newId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        image: data.image,
        iStatus: 'Active',
        isAdmin: false,
        emailVerified: false,
      },
    });

    // Assign default company & role
    await this.assignDefaultCompanyRole(newUser.id);

    // Generate dan kirim verification email
    await this.sendVerificationEmail(newUser.id, newUser.email, newUser.name);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Login dengan email & password
   */
  async login(
    email: string,
    password: string,
    deviceInfo?: {
      deviceName?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    // Cari user
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for the verification link.',
      );
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate and send OTP
      await this.twoFactorService.generateAndSendOtp(user.id);

      // Return response indicating 2FA is required
      return {
        requires2FA: true,
        userId: user.id,
        message:
          'Two-factor authentication required. Please check your email for the OTP code.',
      };
    }

    // Continue with normal login flow (no 2FA)
    // Get user companies & roles
    const userCompanies = await this.getUserCompaniesWithRoles(user.id);

    if (userCompanies.length === 0) {
      // Assign default jika belum ada
      await this.assignDefaultCompanyRole(user.id);
      const refreshedCompanies = await this.getUserCompaniesWithRoles(user.id);
      if (refreshedCompanies.length > 0) {
        userCompanies.push(refreshedCompanies[0]);
      }
    }

    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      selectedCompany.userRole.role_id,
      selectedCompany.company_id,
      selectedCompany.branch_id,
    );

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session
    const session = await this.sessionService.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      deviceName: deviceInfo?.deviceName,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      expiresAt,
    });

    // Save hashed refresh token (backward compatibility)
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        company: {
          company_id: selectedCompany.company_id.trim(),
          branch_id: selectedCompany.branch_id.trim(),
          role_id: selectedCompany.userRole.role_id.trim(),
          role_name: selectedCompany.userRole.role.name,
        },
        companies: userCompanies.map((c) => ({
          company_id: c.company_id.trim(),
          branch_id: c.branch_id.trim(),
          role_id: c.userRole.role_id.trim(),
          role_name: c.userRole.role.name,
        })),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
      message: 'Login successful',
    };
  }

  /**
   * Verify OTP dan complete login (untuk 2FA)
   */
  async verifyOtpAndLogin(
    userId: number,
    otpCode: string,
    deviceInfo?: {
      deviceName?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    // Verify OTP
    const isValid = await this.twoFactorService.verifyOtp(userId, otpCode);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    // Get user
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get user companies & roles
    const userCompanies = await this.getUserCompaniesWithRoles(user.id);

    if (userCompanies.length === 0) {
      // Assign default jika belum ada
      await this.assignDefaultCompanyRole(user.id);
      const refreshedCompanies = await this.getUserCompaniesWithRoles(user.id);
      if (refreshedCompanies.length > 0) {
        userCompanies.push(refreshedCompanies[0]);
      }
    }

    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      selectedCompany.userRole.role_id,
      selectedCompany.company_id,
      selectedCompany.branch_id,
    );

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session
    const session = await this.sessionService.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      deviceName: deviceInfo?.deviceName,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      expiresAt,
    });

    // Save hashed refresh token (backward compatibility)
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        company: {
          company_id: selectedCompany.company_id.trim(),
          branch_id: selectedCompany.branch_id.trim(),
          role_id: selectedCompany.userRole.role_id.trim(),
          role_name: selectedCompany.userRole.role.name,
        },
        companies: userCompanies.map((c) => ({
          company_id: c.company_id.trim(),
          branch_id: c.branch_id.trim(),
          role_id: c.userRole.role_id.trim(),
          role_name: c.userRole.role.name,
        })),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
      message: 'Login successful with 2FA',
    };
  }

  /**
   * Login dengan Google OAuth
   */
  async loginWithGoogle(
    googleUser: {
      email: string;
      name: string;
      image?: string;
    },
    deviceInfo?: {
      deviceName?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    let user = await this.prisma.sys_User.findUnique({
      where: { email: googleUser.email },
    });

    // Jika user belum ada, buat baru
    if (!user) {
      const newId = await generateIncrementId(this.prisma, 'sys_User');

      user = await this.prisma.sys_User.create({
        data: {
          id: newId,
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.image,
          password: '', // Google user tidak perlu password
          iStatus: 'Active',
          isAdmin: false,
        },
      });

      await this.assignDefaultCompanyRole(user.id);
    }

    // Get companies & roles
    const userCompanies = await this.getUserCompaniesWithRoles(user.id);
    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      selectedCompany?.userRole?.role_id || 'ADMIN',
      selectedCompany?.company_id || '',
      selectedCompany?.branch_id || '',
    );

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session
    const session = await this.sessionService.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      deviceName: deviceInfo?.deviceName || 'Google OAuth Device',
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      expiresAt,
    });

    // Save hashed refresh token (backward compatibility)
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        company: selectedCompany
          ? {
              company_id: selectedCompany.company_id.trim(),
              branch_id: selectedCompany.branch_id.trim(),
              role_id: selectedCompany.userRole.role_id.trim(),
              role_name: selectedCompany.userRole.role.name,
            }
          : null,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
    };
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
    const userCompanies = await this.getUserCompaniesWithRoles(userId);
    const selectedCompany = userCompanies[0];

    // Generate new tokens
    const tokens = await this.generateTokens(
      userId,
      selectedCompany?.userRole?.role_id || 'USER',
      selectedCompany?.company_id || '',
      selectedCompany?.branch_id || '',
    );

    // Update session dengan refresh token baru
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_Session.update({
      where: { id: session.id },
      data: {
        refreshToken: hashedRefreshToken,
        lastActivityAt: new Date(),
      },
    });

    // Update hashed refresh token di user (backward compatibility)
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });

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
    // 1. Find user by email
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    // Don't reveal if email exists or not (security best practice)
    if (!user) {
      return {
        message:
          'Jika email terdaftar, link reset password akan dikirim ke email Anda.',
      };
    }

    // 2. Generate reset token (32 bytes = 64 hex characters)
    const token = randomBytes(32).toString('hex');

    // 3. Set expiry (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // 4. Delete old reset tokens for this user
    await this.prisma.sys_PasswordReset.deleteMany({
      where: { user_id: user.id },
    });

    // 5. Save new token
    await this.prisma.sys_PasswordReset.create({
      data: {
        user_id: user.id,
        token,
        expiresAt,
      },
    });

    // 6. Send email dengan reset link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetUrl,
    );

    return {
      message:
        'Jika email terdaftar, link reset password akan dikirim ke email Anda.',
    };
  }

  /**
   * Reset Password - Step 2: Verify token dan update password
   */
  async resetPasswordWithToken(token: string, newPassword: string) {
    // 1. Find valid reset token
    const resetToken = await this.prisma.sys_PasswordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // 2. Check if token expired
    if (new Date() > resetToken.expiresAt) {
      throw new UnauthorizedException('Reset token has expired');
    }

    // 3. Check if already used
    if (resetToken.used) {
      throw new UnauthorizedException('Reset token already used');
    }

    // 4. Hash new password
    const hashedPassword = await hash(newPassword);

    // 5. Update password
    await this.prisma.sys_User.update({
      where: { id: resetToken.user_id },
      data: { password: hashedPassword },
    });

    // 6. Mark token as used
    await this.prisma.sys_PasswordReset.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    // 7. Revoke all sessions untuk security
    await this.sessionService.revokeAllSessions(resetToken.user_id);

    return {
      message:
        'Password berhasil direset. Silakan login dengan password baru Anda.',
    };
  }

  /**
   * @deprecated Use forgotPassword() and resetPasswordWithToken() instead
   * Reset password (INSECURE - for backward compatibility only)
   * WARNING: This allows anyone to reset password with just email!
   */
  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await hash(newPassword);

    await this.prisma.sys_User.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successful' };
  }

  /**
   * Verify JWT token dan return user
   */
  async verifyToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Get user by ID dengan role info
   */
  async getUserById(userId: number) {
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userCompanies = await this.getUserCompaniesWithRoles(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      companies: userCompanies.map((c) => ({
        company_id: c.company_id.trim(),
        branch_id: c.branch_id.trim(),
        role_id: c.userRole.role_id.trim(),
        role_name: c.userRole.role.name,
      })),
    };
  }

  // ============== PRIVATE HELPER METHODS ==============

  /**
   * Generate JWT access & refresh tokens
   */
  private async generateTokens(
    userId: number,
    roleId: string,
    companyId: string,
    branchId: string,
  ) {
    const payload: UserPayload = {
      sub: userId,
      role_id: roleId,
      company_id: companyId,
      branch_id: branchId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.signOptions?.expiresIn || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Get user companies dengan role info
   */
  private async getUserCompaniesWithRoles(userId: number) {
    return await this.prisma.sys_UserCompanyRole.findMany({
      where: {
        userRole: {
          user_id: userId,
        },
      },
      include: {
        userRole: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Assign default company & role ke user baru
   */
  private async assignDefaultCompanyRole(userId: number) {
    // Get default company
    const defaultCompany = await this.prisma.sys_Company.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultCompany) {
      throw new ConflictException('No active company found');
    }

    // Get default role (USER untuk Google OAuth)
    const defaultRole = await this.prisma.sys_Role.findFirst({
      where: {
        iStatus: 'Active',
        name: 'USER',
      },
    });

    if (!defaultRole) {
      throw new ConflictException(
        'USER role not found. Please create USER role first.',
      );
    }

    // Create or get user role
    let userRole = await this.prisma.sys_UserRole.findFirst({
      where: {
        user_id: userId,
        role_id: defaultRole.id.trim(),
      },
    });

    if (!userRole) {
      userRole = await this.prisma.sys_UserRole.create({
        data: {
          user_id: userId,
          role_id: defaultRole.id.trim(),
          iStatus: 'Active',
          isDefault: true,
        },
      });
    }

    // Assign to default company
    const userCompanyRoleId = await generateIncrementId(
      this.prisma,
      'sys_UserCompanyRole',
    );

    await this.prisma.sys_UserCompanyRole.create({
      data: {
        id: userCompanyRoleId,
        userRole_id: userRole.id,
        company_id: defaultCompany.id,
        branch_id: 'MAIN',
        iStatus: 'Active',
        isDefault: true,
      },
    });
  }

  /**
   * Exchange Google authorization code untuk access token
   */
  async exchangeGoogleCode(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: this.googleOAuthConfiguration.clientID,
          client_secret: this.googleOAuthConfiguration.clientSecret,
          redirect_uri: this.googleOAuthConfiguration.callbackURL,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch {
      throw new UnauthorizedException('Failed to exchange authorization code');
    }
  }

  /**
   * Get user info dari Google menggunakan access token
   */
  async getGoogleUserInfo(accessToken: string): Promise<{
    email: string;
    name: string;
    picture?: string;
    email_verified: boolean;
  }> {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
        email_verified: response.data.verified_email,
      };
    } catch {
      throw new UnauthorizedException('Failed to get Google user info');
    }
  }

  /**
   * Generate verification token dan kirim email
   */
  async sendVerificationEmail(
    userId: number,
    email: string,
    name: string,
  ): Promise<void> {
    // Generate token
    const token = this.generateVerificationToken();

    // Set expiry time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any existing verification tokens for this user
    await this.prisma.sys_EmailVerification.deleteMany({
      where: { user_id: userId },
    });

    // Save token to database
    await this.prisma.sys_EmailVerification.create({
      data: {
        user_id: userId,
        token,
        expiresAt,
      },
    });

    // Send email
    await this.emailService.sendVerificationEmail(email, name, token);
  }

  /**
   * Verify email dengan token
   */
  async verifyEmail(token: string) {
    // Find verification record
    const verification = await this.prisma.sys_EmailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verification) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Check if token expired
    if (new Date() > verification.expiresAt) {
      throw new UnauthorizedException('Verification token has expired');
    }

    // Check if email already verified
    if (verification.user.emailVerified) {
      return {
        message: 'Email already verified',
        user: {
          id: verification.user.id,
          name: verification.user.name,
          email: verification.user.email,
        },
      };
    }

    // Update user email verification status
    await this.prisma.sys_User.update({
      where: { id: verification.user_id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete verification token
    await this.prisma.sys_EmailVerification.delete({
      where: { id: verification.id },
    });

    return {
      message: 'Email verified successfully',
      user: {
        id: verification.user.id,
        name: verification.user.name,
        email: verification.user.email,
      },
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    // Find user
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new ConflictException('Email already verified');
    }

    // Send new verification email
    await this.sendVerificationEmail(user.id, user.email, user.name);

    return {
      message: 'Verification email sent. Please check your inbox.',
    };
  }

  /**
   * Generate random verification token
   */
  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
