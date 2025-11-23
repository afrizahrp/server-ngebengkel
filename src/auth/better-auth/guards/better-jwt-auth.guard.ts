import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthTokenService } from '../services/auth-token.service';
import { SessionService } from '../../session/session.service';
import { PrismaService } from '../../../prisma.service';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class BetterJwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly authTokenService: AuthTokenService,
    private readonly sessionService: SessionService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const request = http.getRequest();
    const response: Response = http.getResponse();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Attach user to request
      request.user = {
        id: payload.sub,
        role_id: payload.role_id,
        company_id: payload.company_id,
        branch_id: payload.branch_id,
      };

      return true;
    } catch (error) {
      // Jika token expired, coba auto-refresh menggunakan refresh token
      const expiredByName =
        error && (error as any).name === 'TokenExpiredError';
      const expiredByMessage =
        error &&
        typeof (error as any).message === 'string' &&
        (error as any).message.includes('expired');
      const isExpired = Boolean(expiredByName || expiredByMessage);
      
      console.log('[JwtAuthGuard] Token verification failed. Is expired?', isExpired);
      console.log('[JwtAuthGuard] Error name:', (error as any)?.name);
      console.log('[JwtAuthGuard] Error message:', (error as any)?.message);
      
      if (!isExpired) {
        throw new UnauthorizedException('Invalid token');
      }

      console.log('[JwtAuthGuard] ⏰ Access token expired, attempting auto-refresh...');

      // Ambil refresh token dari cookie (httpOnly) atau header
      // Priority: cookie > header (untuk security)
      const refreshToken =
        request.cookies?.refreshToken ||
        request.headers['x-refresh-token'] ||
        this.extractTokenFromHeader(request);

      console.log('[JwtAuthGuard] Refresh token from cookie:', request.cookies?.refreshToken ? 'EXISTS' : 'NOT FOUND');
      console.log('[JwtAuthGuard] Refresh token from header:', request.headers['x-refresh-token'] ? 'EXISTS' : 'NOT FOUND');

      if (!refreshToken || typeof refreshToken !== 'string') {
        console.error('[JwtAuthGuard] ❌ No refresh token available for auto-refresh');
        throw new UnauthorizedException(
          'Access token expired and no refresh token available',
        );
      }

      console.log('[JwtAuthGuard] ✅ Refresh token found, proceeding with auto-refresh...');

      // Verify refresh token dan rotasi token
      const refreshPayload =
        await this.authTokenService.verifyRefreshToken(refreshToken);

      // Validasi session berdasarkan refresh token
      const session = await this.sessionService.getSessionByRefreshToken(
        refreshPayload.sub,
        refreshToken,
      );

      // Generate token baru
      const tokens = await this.authTokenService.generateTokens(
        refreshPayload.sub,
        refreshPayload.role_id,
        refreshPayload.company_id,
        refreshPayload.branch_id,
      );

      // Update session: hash refresh token baru, set hasRefreshedToken = true
      const { hash } = await import('argon2');
      const hashedRefreshToken = await hash(tokens.refreshToken);
      
      console.log('[JwtAuthGuard] 🔄 Rotating refresh token in session...');
      await this.sessionService.rotateRefreshTokenAndFlag(
        session.id,
        hashedRefreshToken,
        true,
      );
      console.log('[JwtAuthGuard] ✅ Session refresh token rotated');

      // Update hashed refresh token di user (backward compatibility)
      console.log('[JwtAuthGuard] 🔄 Updating user hashedRefreshToken for user:', refreshPayload.sub);
      const now = new Date();
      console.log('[JwtAuthGuard] About to update user with updatedAt:', now);
      
      const updatedUser = await this.prisma.sys_User.update({
        where: { id: refreshPayload.sub },
        data: { 
          hashedRefreshToken,
          updatedAt: now, // Explicitly update updatedAt
        },
      });
      
      console.log('[JwtAuthGuard] ✅ User hashedRefreshToken updated. UpdatedAt from response:', updatedUser.updatedAt);
      console.log('[JwtAuthGuard] UpdatedAt is null?', updatedUser.updatedAt === null);
      
      // Verify dengan query langsung
      const verifyUser = await this.prisma.sys_User.findUnique({
        where: { id: refreshPayload.sub },
        select: { updatedAt: true },
      });
      console.log('[JwtAuthGuard] Verification query - updatedAt:', verifyUser?.updatedAt);

      // Set header untuk mengembalikan token baru ke client
      response.setHeader('x-access-token', tokens.accessToken);
      response.setHeader('x-refresh-token', tokens.refreshToken);
      response.setHeader('x-token-refreshed', 'true');
      console.log('[JwtAuthGuard] ✅ Auto-refresh successful. New tokens attached to response headers');

      // Attach user baru ke request
      request.user = {
        id: refreshPayload.sub,
        role_id: refreshPayload.role_id,
        company_id: refreshPayload.company_id,
        branch_id: refreshPayload.branch_id,
      };

      return true;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
