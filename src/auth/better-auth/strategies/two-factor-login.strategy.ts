import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { hash } from 'argon2';
import { TwoFactorService } from '../../two-factor/two-factor.service';
import { SessionService } from '../../session/session.service';
import { AuthTokenService } from '../services/auth-token.service';
import { UserCompanyService } from '../services/user-company.service';
import {
  LoginStrategy,
  TwoFactorCredentials,
  DeviceInfo,
  LoginResponse,
} from '../types';

@Injectable()
export class TwoFactorLoginStrategy
  implements LoginStrategy<TwoFactorCredentials>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: AuthTokenService,
    private readonly sessionService: SessionService,
    private readonly twoFactorService: TwoFactorService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  async execute(
    credentials: TwoFactorCredentials,
    deviceInfo?: DeviceInfo,
  ): Promise<LoginResponse> {
    // Verify OTP
    const isValid = await this.twoFactorService.verifyOtp(
      credentials.userId,
      credentials.otpCode,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    // Get user
    const user = await this.prisma.sys_User.findUnique({
      where: { id: credentials.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Complete login
    return this.completeLogin(user, deviceInfo);
  }

  /**
   * Complete login after OTP verification
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
      message: 'Login successful with 2FA',
    };
  }
}



