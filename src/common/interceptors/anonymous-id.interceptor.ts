import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AnonymousSessionService } from '../../auth/anonymous-session/anonymous-session.service';

/**
 * Interceptor untuk extract dan validate anonymous_id dari request
 * 
 * Purpose:
 * - Extract anonymous_id dari header/cookie
 * - Validate anonymous session (optional, tidak block jika invalid)
 * - Attach anonymous_id ke request untuk tracking/rate limiting
 * 
 * Note: Ini BUKAN untuk authentication/authorization
 * - Guard tetap handle authentication
 * - Interceptor hanya untuk tracking/analytics/rate limiting
 */
@Injectable()
export class AnonymousIdInterceptor implements NestInterceptor {
  constructor(
    private readonly anonymousSessionService: AnonymousSessionService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Extract anonymous_id dari header atau cookie
    const anonymousId =
      request.headers['x-anonymous-id'] ||
      request.headers['X-Anonymous-Id'] ||
      request.cookies?.['anonymous_id'];

    if (anonymousId) {
      try {
        // Validate anonymous session (optional - tidak block jika invalid)
        // Hanya untuk memastikan anonymous_id valid dan belum expired
        const session =
          await this.anonymousSessionService.validateSession(anonymousId);

        // Attach ke request untuk digunakan di controller/service
        request.anonymousId = anonymousId;
        request.anonymousSession = session;
      } catch (error) {
        // Silent fail - tidak block request
        // Invalid anonymous_id tidak menghalangi read operations
        // Hanya tidak attach anonymous_id ke request
        // Log untuk monitoring (optional)
        // console.warn('Invalid anonymous_id:', anonymousId, error.message);
      }
    }

    return next.handle();
  }
}

