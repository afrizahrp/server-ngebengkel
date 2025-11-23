import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from '../../config/refresh.config';

@Injectable()
export class BetterRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Ambil refresh token dari cookie (httpOnly) atau header
    // Priority: cookie > header (untuk security)
    const token =
      request.cookies?.refreshToken ||
      request.headers['x-refresh-token'] ||
      this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      console.log('[RefreshGuard] Verifying refresh token (first 30 chars):', token.substring(0, 30));
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenConfig.secret,
      });

      console.log('[RefreshGuard] ✅ Refresh token valid for user:', payload.sub);

      // Attach user info & refresh token to request
      request.user = {
        id: payload.sub,
        role_id: payload.role_id,
        company_id: payload.company_id,
        branch_id: payload.branch_id,
      };
      request.refreshToken = token;

      return true;
    } catch (error) {
      const errorName = (error as any)?.name;
      const errorMessage = (error as any)?.message;
      
      console.error('[RefreshGuard] ❌ Refresh token verification failed');
      console.error('[RefreshGuard] Error name:', errorName);
      console.error('[RefreshGuard] Error message:', errorMessage);
      
      if (errorName === 'TokenExpiredError') {
        console.error('[RefreshGuard] ⏰ Refresh token expired');
        throw new UnauthorizedException('Refresh token expired');
      } else if (errorName === 'JsonWebTokenError') {
        console.error('[RefreshGuard] 🔒 Invalid refresh token format or signature');
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        console.error('[RefreshGuard] ⚠️ Unknown error:', error);
        throw new UnauthorizedException('Invalid refresh token');
      }
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
