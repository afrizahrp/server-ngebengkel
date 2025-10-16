import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionQueryDto } from '../dto/session-query.dto';
import { RevokeSessionDto } from '../dto/revoke-session.dto';
import { AuthRequest } from '../types/auth-request.interface';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * Get semua session user yang sedang login
   */
  @Get()
  async getMySessions(
    @Request() req: AuthRequest,
    @Query() query: SessionQueryDto,
  ) {
    const sessions = await this.sessionService.getUserSessions(
      req.user.id,
      query.onlyActive ?? true,
    );

    return {
      message: 'Sessions retrieved successfully',
      data: sessions,
      total: sessions.length,
    };
  }

  /**
   * Get session detail by ID
   */
  @Get(':id')
  async getSessionById(@Param('id') sessionId: string) {
    const session = await this.sessionService.getSessionById(sessionId);

    return {
      message: 'Session retrieved successfully',
      data: session,
    };
  }

  /**
   * Get session statistics
   */
  @Get('stats/me')
  async getMySessionStats(@Request() req: AuthRequest) {
    const stats = await this.sessionService.getSessionStats(req.user.id);

    return {
      message: 'Session statistics retrieved successfully',
      data: stats,
    };
  }

  /**
   * Revoke session spesifik
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Param('id') sessionId: string,
    @Body() body: { reason?: string },
  ) {
    const session = await this.sessionService.revokeSession(
      sessionId,
      body.reason,
    );

    return {
      message: 'Session revoked successfully',
      data: session,
    };
  }

  /**
   * Logout dari device lain (revoke semua session kecuali yang sekarang)
   */
  @Post('revoke-others')
  @HttpCode(HttpStatus.OK)
  async revokeOtherSessions(@Request() req: AuthRequest) {
    if (!req.sessionId) {
      // Jika tidak ada sessionId, revoke semua
      await this.sessionService.revokeAllSessions(req.user.id);
      return {
        message: 'All sessions revoked successfully',
      };
    }

    const result = await this.sessionService.revokeOtherSessions(
      req.user.id,
      req.sessionId,
    );

    return {
      message: 'Other sessions revoked successfully',
      count: result.count,
    };
  }

  /**
   * Logout dari semua device
   */
  @Post('revoke-all')
  @HttpCode(HttpStatus.OK)
  async revokeAllSessions(@Request() req: AuthRequest) {
    const result = await this.sessionService.revokeAllSessions(req.user.id);

    return {
      message: 'All sessions revoked successfully',
      count: result.count,
    };
  }

  /**
   * Cleanup expired sessions (admin only / cron job)
   */
  @Post('cleanup-expired')
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredSessions() {
    const result = await this.sessionService.cleanupExpiredSessions();

    return {
      message: 'Expired sessions cleaned up successfully',
      count: result.count,
    };
  }
}
