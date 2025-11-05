import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BetterRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
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
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });

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
      throw new UnauthorizedException('Invalid refresh token');
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
