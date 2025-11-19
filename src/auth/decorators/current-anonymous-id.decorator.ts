import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator untuk extract anonymous_id dari request
 * Priority: header X-Anonymous-Id > cookie anonymous_id
 */
export const CurrentAnonymousId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    
    // Priority 1: Header X-Anonymous-Id
    const headerId = request.headers?.['x-anonymous-id'] || 
                     request.headers?.['X-Anonymous-Id'];
    
    if (headerId) {
      return headerId;
    }
    
    // Priority 2: Cookie anonymous_id
    const cookieId = request.cookies?.['anonymous_id'];
    
    if (cookieId) {
      return cookieId;
    }
    
    // Return undefined jika tidak ada
    return undefined;
  },
);

