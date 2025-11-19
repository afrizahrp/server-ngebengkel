import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UAParser } from 'ua-parser-js';

export interface CreateAnonymousSessionData {
  anonymousId: string; // UUID v4 dari client
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  source?: string; // web, app, mobile
  expiresAt?: Date; // Optional: default 90 hari
}

@Injectable()
export class AnonymousSessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Parse user agent untuk mendapatkan informasi device
   */
  private parseUserAgent(userAgent?: string) {
    if (!userAgent) {
      return {
        browser: null,
        os: null,
        deviceType: null,
      };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      browser: result.browser.name
        ? `${result.browser.name} ${result.browser.version || ''}`
        : null,
      os: result.os.name
        ? `${result.os.name} ${result.os.version || ''}`
        : null,
      deviceType:
        result.device.type ||
        (result.os.name === 'Android' || result.os.name === 'iOS'
          ? 'mobile'
          : 'desktop'),
    };
  }

  /**
   * Buat atau get anonymous session
   * Jika sudah ada, update lastActivityAt
   */
  async createOrGetSession(data: CreateAnonymousSessionData) {
    const {
      anonymousId,
      deviceName,
      ipAddress,
      userAgent,
      source = 'web',
      expiresAt,
    } = data;

    // Parse user agent
    const { browser, os, deviceType } = this.parseUserAgent(userAgent);

    // Default expiresAt: 90 hari dari sekarang
    const defaultExpiresAt = expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    // Cek apakah anonymous session sudah ada
    const existing = await this.prisma.sys_AnonymousSession.findUnique({
      where: { anonymous_id: anonymousId },
    });

    if (existing) {
      // Jika sudah merged, throw error
      if (existing.isMerged) {
        throw new UnauthorizedException(
          'Anonymous session sudah di-merge ke user account',
        );
      }

      // Update last activity
      return await this.prisma.sys_AnonymousSession.update({
        where: { anonymous_id: anonymousId },
        data: {
          lastActivityAt: new Date(),
          // Update device info jika berubah
          deviceName: deviceName || existing.deviceName,
          deviceType: deviceType || existing.deviceType,
          browser: browser || existing.browser,
          os: os || existing.os,
          ipAddress: ipAddress || existing.ipAddress,
          userAgent: userAgent || existing.userAgent,
        },
      });
    }

    // Buat session baru
    const session = await this.prisma.sys_AnonymousSession.create({
      data: {
        anonymous_id: anonymousId,
        deviceName: deviceName || `${deviceType || 'Unknown'} Device`,
        deviceType,
        browser,
        os,
        ipAddress,
        userAgent,
        source,
        expiresAt: defaultExpiresAt,
        isMerged: false,
        iStatus: 'Active',
      },
    });

    return session;
  }

  /**
   * Get anonymous session by anonymous_id
   */
  async getSessionByAnonymousId(anonymousId: string) {
    const session = await this.prisma.sys_AnonymousSession.findUnique({
      where: { anonymous_id: anonymousId },
    });

    if (!session) {
      throw new NotFoundException('Anonymous session tidak ditemukan');
    }

    return session;
  }

  /**
   * Validate anonymous session
   */
  async validateSession(anonymousId: string) {
    const session = await this.getSessionByAnonymousId(anonymousId);

    if (session.isMerged) {
      throw new UnauthorizedException(
        'Anonymous session sudah di-merge ke user account',
      );
    }

    if (session.iStatus !== 'Active') {
      throw new UnauthorizedException('Anonymous session tidak aktif');
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      throw new UnauthorizedException('Anonymous session sudah expired');
    }

    // Update last activity
    await this.prisma.sys_AnonymousSession.update({
      where: { anonymous_id: anonymousId },
      data: {
        lastActivityAt: new Date(),
      },
    });

    return session;
  }

  /**
   * Merge anonymous session ke user account
   * Setelah user login, pindahkan semua data terkait anonymous_id ke user_id
   */
  async mergeToUser(anonymousId: string, userId: number) {
    const session = await this.getSessionByAnonymousId(anonymousId);

    if (session.isMerged) {
      throw new UnauthorizedException(
        'Anonymous session sudah di-merge sebelumnya',
      );
    }

    // Update session: mark as merged
    return await this.prisma.sys_AnonymousSession.update({
      where: { anonymous_id: anonymousId },
      data: {
        mergedToUserId: userId,
        mergedAt: new Date(),
        isMerged: true,
      },
    });
  }

  /**
   * Get semua anonymous session yang sudah di-merge ke user
   */
  async getMergedSessions(userId: number) {
    return await this.prisma.sys_AnonymousSession.findMany({
      where: {
        mergedToUserId: userId,
        isMerged: true,
      },
      orderBy: {
        mergedAt: 'desc',
      },
    });
  }

  /**
   * Cleanup expired anonymous sessions (untuk cron job)
   */
  async cleanupExpiredSessions() {
    return await this.prisma.sys_AnonymousSession.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isMerged: false,
        iStatus: 'Active',
      },
      data: {
        iStatus: 'InActive',
      },
    });
  }

  /**
   * Cleanup old merged sessions (untuk cron job)
   * Hapus sessions yang sudah di-merge lebih dari 1 tahun
   */
  async cleanupOldMergedSessions() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return await this.prisma.sys_AnonymousSession.updateMany({
      where: {
        isMerged: true,
        mergedAt: {
          lt: oneYearAgo,
        },
        iStatus: 'Active',
      },
      data: {
        iStatus: 'InActive',
      },
    });
  }

  /**
   * Get statistics untuk anonymous sessions
   */
  async getStats() {
    const [total, active, merged, expired] = await Promise.all([
      this.prisma.sys_AnonymousSession.count({
        where: { iStatus: 'Active' },
      }),
      this.prisma.sys_AnonymousSession.count({
        where: {
          iStatus: 'Active',
          isMerged: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
      this.prisma.sys_AnonymousSession.count({
        where: {
          iStatus: 'Active',
          isMerged: true,
        },
      }),
      this.prisma.sys_AnonymousSession.count({
        where: {
          iStatus: 'Active',
          expiresAt: {
            lt: new Date(),
          },
        },
      }),
    ]);

    return {
      total,
      active,
      merged,
      expired,
    };
  }
}

