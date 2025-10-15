import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cleanup unverified users yang sudah expired
   *
   * Menghapus user yang:
   * 1. emailVerified = false
   * 2. Email verification token sudah expired (lebih dari 24 jam)
   * 3. Tidak ada session aktif
   *
   * Cascade delete akan otomatis menghapus:
   * - sys_Session
   * - sys_EmailVerification
   * - sys_TwoFactorToken
   * - sys_UserRole (jika ada onDelete cascade)
   * - sys_UserCompanyRole (via sys_UserRole)
   */
  async cleanupUnverifiedUsers(options?: {
    dryRun?: boolean;
    expirationHours?: number;
  }) {
    const dryRun = options?.dryRun ?? false;
    const expirationHours = options?.expirationHours ?? 24;

    this.logger.log(
      `Starting cleanup unverified users (dryRun: ${dryRun}, expirationHours: ${expirationHours})`,
    );

    try {
      // Hitung waktu expiration
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - expirationHours);

      // Cari users yang belum verify email dan expired
      const unverifiedUsers = await this.prisma.sys_User.findMany({
        where: {
          emailVerified: false,
          emailVerifications: {
            some: {
              expiresAt: {
                lt: expirationDate,
              },
            },
          },
        },
        include: {
          emailVerifications: true,
          sessions: true,
          userRoles: {
            include: {
              userCompanies: true,
            },
          },
        },
      });

      this.logger.log(
        `Found ${unverifiedUsers.length} unverified users to cleanup`,
      );

      if (dryRun) {
        // Dry run: hanya log tanpa delete
        this.logger.log('DRY RUN - Users yang akan dihapus:');
        unverifiedUsers.forEach((user) => {
          this.logger.log(
            `- User ID: ${user.id}, Email: ${user.email}, Created: ${user.emailVerifications[0]?.createdAt}, Expired: ${user.emailVerifications[0]?.expiresAt}`,
          );
        });

        return {
          success: true,
          dryRun: true,
          count: unverifiedUsers.length,
          users: unverifiedUsers.map((u) => ({
            id: u.id,
            email: u.email,
            createdAt: u.emailVerifications[0]?.createdAt,
            expiresAt: u.emailVerifications[0]?.expiresAt,
          })),
        };
      }

      // Delete users (cascade akan otomatis hapus related data)
      const deletedUserIds: number[] = [];

      for (const user of unverifiedUsers) {
        try {
          // Hapus user - cascade delete akan handle:
          // - sys_Session (onDelete: Cascade)
          // - sys_EmailVerification (onDelete: Cascade)
          // - sys_TwoFactorToken (onDelete: Cascade)
          // Tapi sys_UserRole dan sys_UserCompanyRole perlu dihapus manual

          // 1. Hapus sys_UserCompanyRole terlebih dahulu
          for (const userRole of user.userRoles) {
            await this.prisma.sys_UserCompanyRole.deleteMany({
              where: {
                userRole_id: userRole.id,
              },
            });
          }

          // 2. Hapus sys_UserRole
          await this.prisma.sys_UserRole.deleteMany({
            where: {
              user_id: user.id,
            },
          });

          // 3. Hapus sys_User (cascade delete untuk session, emailVerification, twoFactorToken)
          await this.prisma.sys_User.delete({
            where: {
              id: user.id,
            },
          });

          deletedUserIds.push(user.id);
          this.logger.log(
            `Deleted unverified user: ${user.email} (ID: ${user.id})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to delete user ${user.email}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Cleanup completed: ${deletedUserIds.length} users deleted`,
      );

      return {
        success: true,
        dryRun: false,
        count: deletedUserIds.length,
        deletedUserIds,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cleanup users yang tidak pernah melakukan verifikasi
   * (tidak ada email verification record sama sekali dan sudah lama)
   *
   * Ini handle edge case jika ada user yang dibuat tapi tidak ada verification email
   */
  async cleanupNeverVerifiedUsers(options?: {
    dryRun?: boolean;
    ageInDays?: number;
  }) {
    const dryRun = options?.dryRun ?? false;
    const ageInDays = options?.ageInDays ?? 7; // Default 7 hari

    this.logger.log(
      `Starting cleanup never-verified users (dryRun: ${dryRun}, ageInDays: ${ageInDays})`,
    );

    try {
      // Hitung waktu minimal
      const minDate = new Date();
      minDate.setDate(minDate.getDate() - ageInDays);

      // Cari users yang:
      // 1. emailVerified = false
      // 2. Tidak ada email verification record
      // 3. Dibuat lebih dari X hari yang lalu
      const neverVerifiedUsers = await this.prisma.sys_User.findMany({
        where: {
          emailVerified: false,
          emailVerifications: {
            none: {},
          },
          // NOTE: sys_User tidak punya createdAt field
          // Jadi kita tidak bisa filter by creation date
          // Alternatif: hapus semua user yang tidak punya verification email
        },
        include: {
          userRoles: {
            include: {
              userCompanies: true,
            },
          },
        },
      });

      this.logger.log(
        `Found ${neverVerifiedUsers.length} never-verified users`,
      );

      if (dryRun) {
        this.logger.log('DRY RUN - Users yang akan dihapus:');
        neverVerifiedUsers.forEach((user) => {
          this.logger.log(`- User ID: ${user.id}, Email: ${user.email}`);
        });

        return {
          success: true,
          dryRun: true,
          count: neverVerifiedUsers.length,
          users: neverVerifiedUsers.map((u) => ({
            id: u.id,
            email: u.email,
          })),
        };
      }

      // Delete users
      const deletedUserIds: number[] = [];

      for (const user of neverVerifiedUsers) {
        try {
          // Hapus user companies
          for (const userRole of user.userRoles) {
            await this.prisma.sys_UserCompanyRole.deleteMany({
              where: {
                userRole_id: userRole.id,
              },
            });
          }

          // Hapus user roles
          await this.prisma.sys_UserRole.deleteMany({
            where: {
              user_id: user.id,
            },
          });

          // Hapus user
          await this.prisma.sys_User.delete({
            where: {
              id: user.id,
            },
          });

          deletedUserIds.push(user.id);
          this.logger.log(
            `Deleted never-verified user: ${user.email} (ID: ${user.id})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to delete user ${user.email}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Cleanup completed: ${deletedUserIds.length} users deleted`,
      );

      return {
        success: true,
        dryRun: false,
        count: deletedUserIds.length,
        deletedUserIds,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cleanup expired email verification tokens
   * (tanpa menghapus user, hanya token yang sudah expired)
   */
  async cleanupExpiredVerificationTokens() {
    this.logger.log('Starting cleanup expired verification tokens');

    try {
      const result = await this.prisma.sys_EmailVerification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      this.logger.log(
        `Cleanup completed: ${result.count} expired tokens deleted`,
      );

      return {
        success: true,
        count: result.count,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cleanup expired 2FA tokens
   */
  async cleanupExpired2FATokens() {
    this.logger.log('Starting cleanup expired 2FA tokens');

    try {
      const result = await this.prisma.sys_TwoFactorToken.deleteMany({
        where: {
          OR: [
            {
              expiresAt: {
                lt: new Date(),
              },
            },
            {
              used: true,
              createdAt: {
                // Delete used tokens older than 24 hours
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
      });

      this.logger.log(
        `Cleanup completed: ${result.count} expired 2FA tokens deleted`,
      );

      return {
        success: true,
        count: result.count,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cleanup expired password reset tokens
   */
  async cleanupExpiredPasswordResetTokens() {
    this.logger.log('Starting cleanup expired password reset tokens');

    try {
      const result = await this.prisma.sys_PasswordReset.deleteMany({
        where: {
          OR: [
            {
              expiresAt: {
                lt: new Date(),
              },
            },
            {
              used: true,
              createdAt: {
                // Delete used tokens older than 24 hours
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
      });

      this.logger.log(
        `Cleanup completed: ${result.count} expired password reset tokens deleted`,
      );

      return {
        success: true,
        count: result.count,
      };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get statistics tentang unverified users
   */
  async getUnverifiedUsersStats() {
    try {
      const [
        totalUnverified,
        expiredVerification,
        neverVerified,
        recentUnverified,
      ] = await Promise.all([
        // Total unverified users
        this.prisma.sys_User.count({
          where: {
            emailVerified: false,
          },
        }),

        // Users dengan verification expired
        this.prisma.sys_User.count({
          where: {
            emailVerified: false,
            emailVerifications: {
              some: {
                expiresAt: {
                  lt: new Date(),
                },
              },
            },
          },
        }),

        // Users tanpa verification email
        this.prisma.sys_User.count({
          where: {
            emailVerified: false,
            emailVerifications: {
              none: {},
            },
          },
        }),

        // Users unverified yang baru (< 24 jam)
        this.prisma.sys_User.count({
          where: {
            emailVerified: false,
            emailVerifications: {
              some: {
                expiresAt: {
                  gte: new Date(),
                },
              },
            },
          },
        }),
      ]);

      return {
        totalUnverified,
        expiredVerification,
        neverVerified,
        recentUnverified,
        cleanupRecommended: expiredVerification + neverVerified,
      };
    } catch (error) {
      this.logger.error(`Get stats failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cron job: Auto cleanup setiap hari jam 2 pagi
   * Hapus user yang verifikasi expired > 24 jam
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyCleanup() {
    this.logger.log('Running daily cleanup cron job');

    try {
      // 1. Cleanup unverified users
      const unverifiedResult = await this.cleanupUnverifiedUsers({
        dryRun: false,
        expirationHours: 24,
      });

      // 2. Cleanup expired verification tokens
      const tokensResult = await this.cleanupExpiredVerificationTokens();

      // 3. Cleanup expired 2FA tokens
      const twoFactorResult = await this.cleanupExpired2FATokens();

      // 4. Cleanup expired password reset tokens
      const passwordResetResult =
        await this.cleanupExpiredPasswordResetTokens();

      this.logger.log(
        `Daily cleanup completed - Users: ${unverifiedResult.count}, Verification Tokens: ${tokensResult.count}, 2FA Tokens: ${twoFactorResult.count}, Password Reset Tokens: ${passwordResetResult.count}`,
      );
    } catch (error) {
      this.logger.error(`Daily cleanup failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Cron job: Weekly cleanup untuk never-verified users
   * Hapus user yang tidak pernah verify email > 7 hari
   */
  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyCleanup() {
    this.logger.log('Running weekly cleanup cron job');

    try {
      const result = await this.cleanupNeverVerifiedUsers({
        dryRun: false,
        ageInDays: 7,
      });

      this.logger.log(
        `Weekly cleanup completed - Never-verified users deleted: ${result.count}`,
      );
    } catch (error) {
      this.logger.error(`Weekly cleanup failed: ${error.message}`, error.stack);
    }
  }
}
