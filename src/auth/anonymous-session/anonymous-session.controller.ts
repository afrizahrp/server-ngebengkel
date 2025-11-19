import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  BadRequestException,
} from '@nestjs/common';
import { AnonymousSessionService } from './anonymous-session.service';
import { Public } from '../decorators/public.decorator';
import { AuthRequest } from '../types/auth-request.interface';
import { CreateAnonymousSessionDto } from '../dto/create-anonymous-session.dto';
import { MergeAnonymousSessionDto } from '../dto/merge-anonymous-session.dto';

@Controller('anonymous-sessions')
export class AnonymousSessionController {
  constructor(
    private readonly anonymousSessionService: AnonymousSessionService,
  ) {}

  /**
   * Create atau get anonymous session
   * Public endpoint - tidak perlu authentication
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async createOrGetSession(
    @Body() body: CreateAnonymousSessionDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    if (!body || !body.anonymousId) {
      throw new BadRequestException('anonymousId is required');
    }

    const session = await this.anonymousSessionService.createOrGetSession({
      anonymousId: body.anonymousId,
      deviceName: undefined, // Akan di-parse dari userAgent
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      source: body.source || 'web',
    });

    return {
      message: 'Anonymous session created/retrieved successfully',
      data: {
        anonymousId: session.anonymous_id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      },
    };
  }

  /**
   * Validate anonymous session
   * Public endpoint - untuk check apakah anonymous_id valid
   */
  @Public()
  @Get('validate/:anonymousId')
  async validateSession(@Request() req: any) {
    const anonymousId = req.params?.anonymousId;
    
    if (!anonymousId) {
      return {
        valid: false,
        message: 'anonymousId is required',
      };
    }

    try {
      const session = await this.anonymousSessionService.validateSession(anonymousId);
      return {
        valid: true,
        data: {
          anonymousId: session.anonymous_id,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          isMerged: session.isMerged,
        },
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message || 'Invalid anonymous session',
      };
    }
  }

  /**
   * Merge anonymous session ke user account
   * Setelah user login, panggil endpoint ini untuk merge
   */
  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async mergeToUser(
    @Request() req: AuthRequest,
    @Body() body: MergeAnonymousSessionDto,
  ) {
    if (!body || !body.anonymousId) {
      throw new BadRequestException('anonymousId is required');
    }

    const session = await this.anonymousSessionService.mergeToUser(
      body.anonymousId,
      req.user.id,
    );

    return {
      message: 'Anonymous session merged successfully',
      data: {
        anonymousId: session.anonymous_id,
        mergedAt: session.mergedAt,
      },
    };
  }

  /**
   * Get merged sessions untuk user yang sedang login
   */
  @Get('merged')
  async getMergedSessions(@Request() req: AuthRequest) {
    const sessions = await this.anonymousSessionService.getMergedSessions(
      req.user.id,
    );

    return {
      message: 'Merged sessions retrieved successfully',
      data: sessions,
      total: sessions.length,
    };
  }

  /**
   * Get statistics (admin only - bisa ditambahkan guard)
   */
  @Get('stats')
  async getStats() {
    const stats = await this.anonymousSessionService.getStats();
    return {
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  }
}

