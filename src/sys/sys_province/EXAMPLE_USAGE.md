# Contoh Penggunaan AnonymousIdInterceptor

## Cara 1: Apply ke Controller (Semua Endpoint)

```typescript
import { UseInterceptors } from '@nestjs/common';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('sys_province')
@UseInterceptors(AnonymousIdInterceptor) // Apply ke semua endpoint
export class sys_ProvinceController {
  @Public() // Read operations: public
  @Get()
  async findAll(@Request() req) {
    // req.anonymousId tersedia jika ada
    // req.anonymousSession tersedia jika valid
    console.log('Anonymous ID:', req.anonymousId);
    return this.provinceService.findAll();
  }
}
```

## Cara 2: Apply ke Specific Endpoint

```typescript
@Controller('sys_province')
export class sys_ProvinceController {
  @Public()
  @UseInterceptors(AnonymousIdInterceptor) // Hanya endpoint ini
  @Get()
  async findAll(@Request() req) {
    if (req.anonymousId) {
      // Track anonymous access
      await this.analyticsService.track('province_list_view', {
        anonymousId: req.anonymousId,
      });
    }
    return this.provinceService.findAll();
  }
}
```

## Cara 3: Global Interceptor (Semua Endpoint Otomatis)

Di `main.ts` atau `app.module.ts`:

```typescript
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AnonymousIdInterceptor } from './common/interceptors/anonymous-id.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AnonymousIdInterceptor,
    },
  ],
})
export class AppModule {}
```

## Akses Anonymous_ID di Controller

```typescript
@Get()
async findAll(@Request() req) {
  const anonymousId = req.anonymousId; // string | undefined
  const anonymousSession = req.anonymousSession; // sys_AnonymousSession | undefined
  
  // Gunakan untuk tracking/rate limiting
  if (anonymousId) {
    await this.rateLimitService.checkLimit(anonymousId, 'read');
  }
  
  return this.provinceService.findAll();
}
```

## Rate Limiting Berdasarkan Anonymous_ID

```typescript
// Di service atau guard
async checkRateLimit(request: any, action: string) {
  const identifier = request.user?.id || request.anonymousId;
  
  if (!identifier) {
    throw new UnauthorizedException('No identifier found');
  }
  
  // Rate limit berdasarkan identifier
  const limit = await this.redis.get(`rate_limit:${identifier}:${action}`);
  // ... rate limiting logic
}
```

