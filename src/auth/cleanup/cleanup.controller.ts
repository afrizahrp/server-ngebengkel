import {
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { Roles } from '../decorators/roles.decorator';

@Controller('cleanup')
export class CleanupController {
  constructor(private readonly cleanupService: CleanupService) {}

  /**
   * Manual cleanup unverified users
   * Admin only
   */
  @Roles('ADMIN')
  @Post('unverified-users')
  @HttpCode(HttpStatus.OK)
  async cleanupUnverifiedUsers(
    @Query('dryRun') dryRun?: string,
    @Query('expirationHours') expirationHours?: string,
  ) {
    const result = await this.cleanupService.cleanupUnverifiedUsers({
      dryRun: dryRun === 'true',
      expirationHours: expirationHours ? parseInt(expirationHours) : 24,
    });

    return {
      message: result.dryRun
        ? 'Dry run completed - No users were deleted'
        : `Successfully deleted ${result.count} unverified users`,
      ...result,
    };
  }

  /**
   * Cleanup users yang tidak pernah verifikasi
   * Admin only
   */
  @Roles('ADMIN')
  @Post('never-verified-users')
  @HttpCode(HttpStatus.OK)
  async cleanupNeverVerifiedUsers(
    @Query('dryRun') dryRun?: string,
    @Query('ageInDays') ageInDays?: string,
  ) {
    const result = await this.cleanupService.cleanupNeverVerifiedUsers({
      dryRun: dryRun === 'true',
      ageInDays: ageInDays ? parseInt(ageInDays) : 7,
    });

    return {
      message: result.dryRun
        ? 'Dry run completed - No users were deleted'
        : `Successfully deleted ${result.count} never-verified users`,
      ...result,
    };
  }

  /**
   * Cleanup expired verification tokens
   * Admin only
   */
  @Roles('ADMIN')
  @Post('expired-verification-tokens')
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredVerificationTokens() {
    const result = await this.cleanupService.cleanupExpiredVerificationTokens();

    return {
      message: `Successfully deleted ${result.count} expired verification tokens`,
      ...result,
    };
  }

  /**
   * Cleanup expired 2FA tokens
   * Admin only
   */
  @Roles('ADMIN')
  @Post('expired-2fa-tokens')
  @HttpCode(HttpStatus.OK)
  async cleanupExpired2FATokens() {
    const result = await this.cleanupService.cleanupExpired2FATokens();

    return {
      message: `Successfully deleted ${result.count} expired 2FA tokens`,
      ...result,
    };
  }

  /**
   * Cleanup expired password reset tokens
   * Admin only
   */
  @Roles('ADMIN')
  @Post('expired-password-reset-tokens')
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredPasswordResetTokens() {
    const result =
      await this.cleanupService.cleanupExpiredPasswordResetTokens();

    return {
      message: `Successfully deleted ${result.count} expired password reset tokens`,
      ...result,
    };
  }

  /**
   * Get statistics tentang unverified users
   * Admin only
   */
  @Roles('ADMIN')
  @Get('stats')
  async getStats() {
    const stats = await this.cleanupService.getUnverifiedUsersStats();

    return {
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  }

  /**
   * Run all cleanup tasks
   * Admin only
   */
  @Roles('ADMIN')
  @Post('run-all')
  @HttpCode(HttpStatus.OK)
  async runAllCleanup(@Query('dryRun') dryRun?: string) {
    const isDryRun = dryRun === 'true';

    const [
      unverifiedResult,
      tokensResult,
      twoFactorResult,
      passwordResetResult,
    ] = await Promise.all([
      this.cleanupService.cleanupUnverifiedUsers({
        dryRun: isDryRun,
        expirationHours: 24,
      }),
      isDryRun
        ? { success: true, count: 0 }
        : this.cleanupService.cleanupExpiredVerificationTokens(),
      isDryRun
        ? { success: true, count: 0 }
        : this.cleanupService.cleanupExpired2FATokens(),
      isDryRun
        ? { success: true, count: 0 }
        : this.cleanupService.cleanupExpiredPasswordResetTokens(),
    ]);

    return {
      message: isDryRun
        ? 'Dry run completed - No data was deleted'
        : 'All cleanup tasks completed successfully',
      dryRun: isDryRun,
      results: {
        unverifiedUsers: {
          count: unverifiedResult.count,
          success: unverifiedResult.success,
        },
        expiredVerificationTokens: {
          count: tokensResult.count,
          success: tokensResult.success,
        },
        expired2FATokens: {
          count: twoFactorResult.count,
          success: twoFactorResult.success,
        },
        expiredPasswordResetTokens: {
          count: passwordResetResult.count,
          success: passwordResetResult.success,
        },
      },
      totalDeleted:
        unverifiedResult.count +
        tokensResult.count +
        twoFactorResult.count +
        passwordResetResult.count,
    };
  }
}
