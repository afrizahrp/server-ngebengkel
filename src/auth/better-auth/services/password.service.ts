import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EmailService } from '../../../email/email.service';
import { SessionService } from '../../session/session.service';
import { hash } from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Forgot Password - Step 1: Request password reset
   * Generate token dan kirim email
   */
  async requestPasswordReset(email: string) {
    // Find user by email
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    // Don't reveal if email exists or not (security best practice)
    if (!user) {
      return this.getGenericResponse();
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const token = this.generateResetToken();

    // Set expiry (1 hour from now)
    const expiresAt = this.getTokenExpiry(1);

    // Delete old reset tokens for this user
    await this.deleteOldResetTokens(user.id);

    // Save new token
    await this.saveResetToken(user.id, token, expiresAt);

    // Send email dengan reset link
    await this.sendResetEmail(user, token);

    return this.getGenericResponse();
  }

  /**
   * Reset Password - Step 2: Verify token dan update password
   */
  async resetPasswordWithToken(token: string, newPassword: string) {
    // Find valid reset token
    const resetToken = await this.validateResetToken(token);

    // Hash new password
    const hashedPassword = await hash(newPassword);

    // Update password
    await this.updateUserPassword(resetToken.user_id, hashedPassword);

    // Mark token as used
    await this.markTokenAsUsed(resetToken.id);

    // Revoke all sessions untuk security
    await this.sessionService.revokeAllSessions(resetToken.user_id);

    return {
      message:
        'Password berhasil direset. Silakan login dengan password baru Anda.',
    };
  }

  /**
   * @deprecated Use requestPasswordReset() and resetPasswordWithToken() instead
   * Reset password (INSECURE - for backward compatibility only)
   */
  async resetPasswordInsecure(email: string, newPassword: string) {
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

  // ============== PRIVATE HELPER METHODS ==============

  /**
   * Generate random reset token
   */
  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Get token expiry time
   */
  private getTokenExpiry(hours: number): Date {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    return expiresAt;
  }

  /**
   * Delete old reset tokens for user
   */
  private async deleteOldResetTokens(userId: number): Promise<void> {
    await this.prisma.sys_PasswordReset.deleteMany({
      where: { user_id: userId },
    });
  }

  /**
   * Save reset token to database
   */
  private async saveResetToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.sys_PasswordReset.create({
      data: {
        user_id: userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Send password reset email
   */
  private async sendResetEmail(user: any, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetUrl,
    );
  }

  /**
   * Validate reset token
   */
  private async validateResetToken(token: string) {
    const resetToken = await this.prisma.sys_PasswordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Check if token expired
    if (new Date() > resetToken.expiresAt) {
      throw new UnauthorizedException('Reset token has expired');
    }

    // Check if already used
    if (resetToken.used) {
      throw new UnauthorizedException('Reset token already used');
    }

    return resetToken;
  }

  /**
   * Update user password
   */
  private async updateUserPassword(
    userId: number,
    hashedPassword: string,
  ): Promise<void> {
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * Mark reset token as used
   */
  private async markTokenAsUsed(tokenId: number): Promise<void> {
    await this.prisma.sys_PasswordReset.update({
      where: { id: tokenId },
      data: { used: true },
    });
  }

  /**
   * Get generic response (security)
   */
  private getGenericResponse() {
    return {
      message:
        'Jika email terdaftar, link reset password akan dikirim ke email Anda.',
    };
  }
}



