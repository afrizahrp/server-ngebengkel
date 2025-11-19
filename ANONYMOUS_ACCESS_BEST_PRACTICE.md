# Best Practice: Anonymous Access untuk Read Operations

## Analisis Opsi

### ❌ **Option 1: Guard Baru yang Accept Anonymous_ID**
**Tidak Recommended** karena:
- Guard seharusnya untuk **authentication/authorization**, bukan tracking
- Anonymous_id bukan credentials, hanya identifier untuk tracking
- Menambah kompleksitas guard yang tidak perlu
- Mixing concerns: auth guard dengan tracking logic

### ✅ **Option 2: @Public() + Interceptor untuk Extract Anonymous_ID** (RECOMMENDED)
**Best Practice** karena:
- ✅ Separation of concerns: Guard untuk auth, Interceptor untuk tracking
- ✅ Read operations tetap public (tidak perlu auth)
- ✅ Anonymous_id digunakan untuk tracking/rate limiting, bukan auth
- ✅ Clean architecture: setiap layer punya tanggung jawab jelas

### ⚠️ **Option 3: Hybrid Guard (Accept Anonymous_ID OR JWT)**
**Bisa digunakan** tapi:
- Lebih kompleks
- Hanya perlu jika ada endpoint yang perlu hybrid access
- Untuk read operations murni, tidak perlu

## Rekomendasi: Option 2 (Interceptor)

### Arsitektur:
```
Request → Guard (Check @Public) → Interceptor (Extract anonymous_id) → Controller
```

### Keuntungan:
1. **Separation of Concerns**
   - Guard: Authentication/Authorization
   - Interceptor: Tracking, Rate Limiting, Analytics
   - Controller: Business Logic

2. **Flexibility**
   - Read operations: @Public() + Interceptor extract anonymous_id
   - Write operations: JWT Guard (require auth)
   - Hybrid: Bisa combine jika perlu

3. **Security**
   - Anonymous_id tidak digunakan untuk authorization
   - Hanya untuk tracking/rate limiting
   - Authorization tetap pakai JWT

4. **Maintainability**
   - Logic terpisah, mudah di-test
   - Mudah di-extend (tambah tracking lain)
   - Tidak mengubah existing guard logic

## Implementasi

### 1. Interceptor untuk Extract Anonymous_ID

```typescript
// src/common/interceptors/anonymous-id.interceptor.ts
@Injectable()
export class AnonymousIdInterceptor implements NestInterceptor {
  constructor(
    private readonly anonymousSessionService: AnonymousSessionService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    
    // Extract anonymous_id dari header atau cookie
    const anonymousId = 
      request.headers['x-anonymous-id'] || 
      request.cookies?.['anonymous_id'];
    
    if (anonymousId) {
      // Validate dan attach ke request
      try {
        const session = await this.anonymousSessionService.validateSession(anonymousId);
        request.anonymousId = anonymousId;
        request.anonymousSession = session;
      } catch (error) {
        // Silent fail - tidak block request
        // Hanya tidak attach anonymous_id
      }
    }
    
    return next.handle();
  }
}
```

### 2. Apply Interceptor ke Read Operations

```typescript
// src/sys/sys_province/sys_Province.controller.ts
@Controller('sys_province')
@UseInterceptors(AnonymousIdInterceptor) // Apply interceptor
export class sys_ProvinceController {
  @Public() // Public endpoint
  @Get()
  async findAll(@Request() req) {
    // req.anonymousId tersedia jika ada
    // req.anonymousSession tersedia jika valid
    return this.provinceService.findAll();
  }
}
```

### 3. Rate Limiting Berdasarkan Anonymous_ID

```typescript
// Di service atau guard rate limiting
if (request.anonymousId) {
  // Rate limit berdasarkan anonymous_id
  await rateLimitService.checkLimit(request.anonymousId, 'read');
}
```

## Kesimpulan

**✅ Best Practice: Pakai @Public() + Interceptor**

- Read operations: `@Public()` (tidak perlu auth)
- Tracking: Interceptor extract `anonymous_id`
- Rate Limiting: Berdasarkan `anonymous_id` (bukan auth)
- Write operations: Tetap pakai JWT Guard

**❌ Tidak Recommended: Guard Baru untuk Anonymous_ID**

- Mixing concerns
- Tidak sesuai dengan purpose guard
- Lebih kompleks tanpa benefit

