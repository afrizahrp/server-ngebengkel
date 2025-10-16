import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EmailService } from '../../../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generate verification token dan kirim email
   */
  async sendVerificationEmail(
    userId: number,
    email: string,
    name: string,
  ): Promise<void> {
    // Generate token
    const token = this.generateToken();

    // Set expiry time (1 hour from now)
    const expiresAt = this.getTokenExpiry(1);

    // Delete any existing verification tokens for this user
    await this.deleteExistingTokens(userId);

    // Save token to database
    await this.saveToken(userId, token, expiresAt);

    // Send email
    await this.emailService.sendVerificationEmail(email, name, token);
  }

  /**
   * Verify email dengan token
   */
  async verifyEmail(token: string) {
    // Find verification record
    const verification = await this.findVerificationByToken(token);

    if (!verification) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Check if token expired
    if (this.isTokenExpired(verification.expiresAt)) {
      throw new UnauthorizedException('Verification token has expired');
    }

    // Check if email already verified
    if (verification.user.emailVerified) {
      return this.alreadyVerifiedResponse(verification.user);
    }

    // Update user email verification status
    await this.markAsVerified(verification.user_id);

    // Delete verification token
    await this.deleteToken(verification.id);

    return this.successResponse(verification.user);
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

  // ============== PRIVATE HELPER METHODS ==============

  /**
   * Generate random verification token
   */
  private generateToken(): string {
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
   * Delete existing verification tokens for user
   */
  private async deleteExistingTokens(userId: number): Promise<void> {
    await this.prisma.sys_EmailVerification.deleteMany({
      where: { user_id: userId },
    });
  }

  /**
   * Save verification token to database
   */
  private async saveToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.sys_EmailVerification.create({
      data: {
        user_id: userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Find verification by token
   */
  private async findVerificationByToken(token: string) {
    return await this.prisma.sys_EmailVerification.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Mark user email as verified
   */
  private async markAsVerified(userId: number): Promise<void> {
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  }

  /**
   * Delete verification token
   */
  private async deleteToken(tokenId: string): Promise<void> {
    await this.prisma.sys_EmailVerification.delete({
      where: { id: tokenId },
    });
  }

  /**
   * Response when email already verified
   */
  private alreadyVerifiedResponse(user: any) {
    return {
      message: 'Email already verified',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Success verification response
   */
  private successResponse(user: any) {
    return {
      message: 'Email verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
