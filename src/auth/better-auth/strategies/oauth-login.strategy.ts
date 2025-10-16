import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { hash } from 'argon2';
import { SessionService } from '../../session/session.service';
import { AuthTokenService } from '../services/auth-token.service';
import { UserCompanyService } from '../services/user-company.service';
import { generateIncrementId } from '../../../utils/generateIncrementId';
import {
  LoginStrategy,
  GoogleUserData,
  DeviceInfo,
  LoginResponse,
} from '../types';

@Injectable()
export class OAuthLoginStrategy implements LoginStrategy<GoogleUserData> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: AuthTokenService,
    private readonly sessionService: SessionService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  async execute(
    googleUser: GoogleUserData,
    deviceInfo?: DeviceInfo,
  ): Promise<LoginResponse> {
    // Find or create user
    let user = await this.prisma.sys_User.findUnique({
      where: { email: googleUser.email },
    });

    // Jika user belum ada, buat baru
    if (!user) {
      user = await this.createGoogleUser(googleUser);
      await this.userCompanyService.assignDefaultCompanyRole(user.id);
    }

    // Get companies & roles
    const userCompanies =
      await this.userCompanyService.getOrAssignDefaultCompanies(user.id);
    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.tokenService.generateTokens(
      user.id,
      selectedCompany?.userRole?.role_id || 'USER',
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
        company: {
          company_id: selectedCompany?.company_id.trim() || '',
          branch_id: selectedCompany?.branch_id.trim() || '',
          role_id: selectedCompany?.userRole?.role_id.trim() || '',
          role_name: selectedCompany?.userRole?.role.name || '',
        },
        companies: this.userCompanyService.formatCompanies(userCompanies),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id,
      message: 'Login with Google successful',
    };
  }

  /**
   * Create new user from Google OAuth
   */
  private async createGoogleUser(googleUser: GoogleUserData) {
    const newId = await generateIncrementId(this.prisma, 'sys_User');

    return await this.prisma.sys_User.create({
      data: {
        id: newId,
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.image,
        password: '', // Google user tidak perlu password
        iStatus: 'Active',
        isAdmin: false,
        emailVerified: true, // Google OAuth already verified
      },
    });
  }
}
