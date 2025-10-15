import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { hash } from 'argon2';
import { UAParser } from 'ua-parser-js';

export interface CreateSessionData {
  userId: number;
  refreshToken: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

@Injectable()
export class SessionService {
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
   * Buat session baru
   */
  async createSession(data: CreateSessionData) {
    const {
      userId,
      refreshToken,
      deviceName,
      ipAddress,
      userAgent,
      expiresAt,
    } = data;

    // Parse user agent
    const { browser, os, deviceType } = this.parseUserAgent(userAgent);

    // Hash refresh token sebelum disimpan
    const hashedRefreshToken = await hash(refreshToken);

    // Buat session baru
    const session = await this.prisma.sys_Session.create({
      data: {
        user_id: userId,
        refreshToken: hashedRefreshToken,
        deviceName: deviceName || `${deviceType || 'Unknown'} Device`,
        deviceType,
        browser,
        os,
        ipAddress,
        userAgent,
        expiresAt,
        isActive: true,
        iStatus: 'Active',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return session;
  }

  /**
   * Get semua session user
   */
  async getUserSessions(userId: number, onlyActive = true) {
    const where: any = {
      user_id: userId,
      iStatus: 'Active',
    };

    if (onlyActive) {
      where.isActive = true;
      where.expiresAt = {
        gt: new Date(),
      };
    }

    const sessions = await this.prisma.sys_Session.findMany({
      where,
      orderBy: {
        lastActivityAt: 'desc',
      },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        browser: true,
        os: true,
        ipAddress: true,
        isActive: true,
        lastActivityAt: true,
        expiresAt: true,
        createdAt: true,
        revokedAt: true,
        revokedReason: true,
      },
    });

    return sessions;
  }

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string) {
    const session = await this.prisma.sys_Session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session tidak ditemukan');
    }

    return session;
  }

  /**
   * Get session by refresh token (untuk validasi)
   */
  async getSessionByRefreshToken(userId: number, refreshToken: string) {
    const sessions = await this.prisma.sys_Session.findMany({
      where: {
        user_id: userId,
        isActive: true,
        iStatus: 'Active',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    // Verify refresh token hash
    const { verify } = await import('argon2');
    for (const session of sessions) {
      const isValid = await verify(session.refreshToken, refreshToken);
      if (isValid) {
        return session;
      }
    }

    throw new UnauthorizedException('Session tidak valid');
  }

  /**
   * Update last activity session
   */
  async updateLastActivity(sessionId: string) {
    return await this.prisma.sys_Session.update({
      where: { id: sessionId },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Revoke session spesifik
   */
  async revokeSession(sessionId: string, reason?: string) {
    const session = await this.getSessionById(sessionId);

    if (!session.isActive) {
      throw new UnauthorizedException('Session sudah tidak aktif');
    }

    return await this.prisma.sys_Session.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: reason || 'Revoked by user',
      },
    });
  }

  /**
   * Revoke semua session user kecuali session saat ini
   */
  async revokeOtherSessions(userId: number, currentSessionId: string) {
    return await this.prisma.sys_Session.updateMany({
      where: {
        user_id: userId,
        id: {
          not: currentSessionId,
        },
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: 'Revoked by user (logout other devices)',
      },
    });
  }

  /**
   * Revoke semua session user
   */
  async revokeAllSessions(userId: number) {
    return await this.prisma.sys_Session.updateMany({
      where: {
        user_id: userId,
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: 'Revoked by user (logout all devices)',
      },
    });
  }

  /**
   * Cleanup expired sessions (untuk cron job)
   */
  async cleanupExpiredSessions() {
    return await this.prisma.sys_Session.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: 'Session expired',
      },
    });
  }

  /**
   * Get session statistics untuk user
   */
  async getSessionStats(userId: number) {
    const [totalSessions, activeSessions, deviceTypes] = await Promise.all([
      this.prisma.sys_Session.count({
        where: {
          user_id: userId,
          iStatus: 'Active',
        },
      }),
      this.prisma.sys_Session.count({
        where: {
          user_id: userId,
          isActive: true,
          iStatus: 'Active',
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
      this.prisma.sys_Session.groupBy({
        by: ['deviceType'],
        where: {
          user_id: userId,
          isActive: true,
          iStatus: 'Active',
        },
        _count: true,
      }),
    ]);

    return {
      totalSessions,
      activeSessions,
      deviceTypes: deviceTypes.map((dt) => ({
        type: dt.deviceType,
        count: dt._count,
      })),
    };
  }

  /**
   * Validate session untuk request
   */
  async validateSession(sessionId: string) {
    const session = await this.prisma.sys_Session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new UnauthorizedException('Session tidak ditemukan');
    }

    if (!session.isActive) {
      throw new UnauthorizedException('Session tidak aktif');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session sudah expired');
    }

    // Update last activity
    await this.updateLastActivity(sessionId);

    return session;
  }
}
