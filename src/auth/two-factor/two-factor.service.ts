import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EmailService } from '../../email/email.service';
import { randomInt } from 'crypto';

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generate 6-digit OTP code
   */
  private generateOtpCode(): string {
    // Generate random 6-digit number (100000 - 999999)
    return randomInt(100000, 1000000).toString();
  }

  /**
   * Generate dan kirim OTP ke user email
   */
  async generateAndSendOtp(userId: number): Promise<void> {
    // Get user info
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate OTP code
    const otpCode = this.generateOtpCode();

    // Set expiry time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing unused OTP tokens for this user
    await this.prisma.sys_TwoFactorToken.deleteMany({
      where: {
        user_id: userId,
        used: false,
      },
    });

    // Save OTP to database
    await this.prisma.sys_TwoFactorToken.create({
      data: {
        user_id: userId,
        code: otpCode,
        expiresAt,
        used: false,
      },
    });

    // Send OTP via email
    await this.emailService.sendTwoFactorOtp(user.email, user.name, otpCode);
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(userId: number, otpCode: string): Promise<boolean> {
    // Find OTP token
    const token = await this.prisma.sys_TwoFactorToken.findFirst({
      where: {
        user_id: userId,
        code: otpCode,
        used: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!token) {
      return false;
    }

    // Check if expired
    if (new Date() > token.expiresAt) {
      // Delete expired token
      await this.prisma.sys_TwoFactorToken.delete({
        where: { id: token.id },
      });
      return false;
    }

    // Mark token as used
    await this.prisma.sys_TwoFactorToken.update({
      where: { id: token.id },
      data: { used: true },
    });

    return true;
  }

  /**
   * Enable 2FA for user
   */
  async enableTwoFactor(userId: number): Promise<void> {
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
  }

  /**
   * Disable 2FA for user
   */
  async disableTwoFactor(userId: number): Promise<void> {
    // Delete all unused OTP tokens
    await this.prisma.sys_TwoFactorToken.deleteMany({
      where: {
        user_id: userId,
        used: false,
      },
    });

    // Disable 2FA
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { twoFactorEnabled: false },
    });
  }

  /**
   * Check if user has 2FA enabled
   */
  async isTwoFactorEnabled(userId: number): Promise<boolean> {
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    return user?.twoFactorEnabled || false;
  }

  /**
   * Clean up expired OTP tokens (untuk cron job atau maintenance)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.sys_TwoFactorToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
