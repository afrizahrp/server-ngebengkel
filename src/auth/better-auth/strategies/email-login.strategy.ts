import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { verify, hash } from 'argon2';
import { TwoFactorService } from '../../two-factor/two-factor.service';
import { SessionService } from '../../session/session.service';
import { AuthTokenService } from '../services/auth-token.service';
import { UserCompanyService } from '../services/user-company.service';
import {
  LoginStrategy,
  EmailLoginCredentials,
  DeviceInfo,
  LoginResponse,
  TwoFactorLoginResponse,
} from '../types';

@Injectable()
export class EmailLoginStrategy
  implements LoginStrategy<EmailLoginCredentials>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: AuthTokenService,
    private readonly sessionService: SessionService,
    private readonly twoFactorService: TwoFactorService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  async execute(
    credentials: EmailLoginCredentials,
    deviceInfo?: DeviceInfo,
  ): Promise<LoginResponse | TwoFactorLoginResponse> {
    // Validate credentials
    const user = await this.validateCredentials(credentials);

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for the verification link.',
      );
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return this.handle2FA(user);
    }

    // Continue with normal login flow
    return this.completeLogin(user, deviceInfo);
  }

  /**
   * Validate email & password
   */
  private async validateCredentials(credentials: EmailLoginCredentials) {
    const user = await this.prisma.sys_User.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verify(user.password, credentials.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Handle 2FA flow
   */
  private async handle2FA(user: any): Promise<TwoFactorLoginResponse> {
    await this.twoFactorService.generateAndSendOtp(user.id);

    return {
      requires2FA: true,
      userId: user.id,
      message:
        'Two-factor authentication required. Please check your email for the OTP code.',
    };
  }

  /**
   * Complete login flow (no 2FA)
   */
  private async completeLogin(
    user: any,
    deviceInfo?: DeviceInfo,
  ): Promise<LoginResponse> {
    // Get user companies & roles
    const userCompanies =
      await this.userCompanyService.getOrAssignDefaultCompanies(user.id);
    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.tokenService.generateTokens(
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
        companies: this.userCompanyService.formatCompanies(userCompanies),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
      message: 'Login successful',
    };
  }
}



