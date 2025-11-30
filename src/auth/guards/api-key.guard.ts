import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * API Key Guard untuk internal endpoints
 * 
 * Purpose:
 * - Authenticate service-to-service requests
 * - Tidak perlu user login
 * - Check X-API-Key header
 * 
 * Use case:
 * - Internal endpoints (seed data, admin tools)
 * - Service-to-service communication
 * - Cron jobs yang call internal API
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required. Provide X-API-Key header.');
    }

    const validApiKey = this.configService.get<string>('INTERNAL_API_KEY');
    
    if (!validApiKey) {
      throw new UnauthorizedException('API key validation is not configured');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private extractApiKeyFromHeader(request: any): string | undefined {
    return (
      request.headers['x-api-key'] ||
      request.headers['X-API-Key'] ||
      request.headers['X-API-KEY']
    );
  }
}




