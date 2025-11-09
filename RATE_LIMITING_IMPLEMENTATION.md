# Rate Limiting & Throttling Implementation

## ✅ Implementasi Selesai

Rate limiting telah diimplementasikan untuk semua PUBLIC() endpoints menggunakan `@nestjs/throttler`.

## 📦 Package yang Digunakan

- `@nestjs/throttler` - Package resmi NestJS untuk rate limiting

## 🔧 Konfigurasi

### Global Rate Limiting (AppModule)

Rate limiting dikonfigurasi di `src/app.module.ts` dengan beberapa preset:

1. **default**: 100 requests per minute
2. **strict**: 10 requests per minute
3. **auth**: 10 requests per 15 minutes
4. **auth-strict**: 5 requests per hour
5. **auth-very-strict**: 3 requests per hour
6. **form-submission**: 10 requests per hour
7. **get-endpoints**: 100 requests per minute

### Custom Decorators

Custom decorators dibuat di `src/auth/decorators/throttle.decorator.ts`:

- `@ThrottleAuthVeryStrict()` - 3 requests/hour
- `@ThrottleAuthStrict()` - 5 requests/hour
- `@ThrottleAuth()` - 10 requests/15 minutes
- `@ThrottleFormSubmission()` - 10 requests/hour
- `@ThrottleCheckAvailability()` - 30 requests/minute
- `@ThrottleGetEndpoints()` - 100 requests/minute
- `@ThrottleStrict()` - 10 requests/minute

## 📍 Endpoint yang Sudah Diterapkan Rate Limiting

### Authentication Endpoints (`auth/better-auth`)

| Endpoint | Method | Rate Limit | Decorator |
|----------|--------|------------|-----------|
| `/auth/register` | POST | 5 requests/hour | `@ThrottleAuthStrict()` |
| `/auth/login` | POST | 10 requests/15 minutes | `@ThrottleAuth()` |
| `/auth/refresh` | POST | 10 requests/15 minutes | `@ThrottleAuth()` |
| `/auth/forgot-password` | POST | 3 requests/hour | `@ThrottleAuthVeryStrict()` |
| `/auth/reset-password` | POST | 5 requests/hour | `@ThrottleAuthStrict()` |
| `/auth/resend-verification-email` | POST | 3 requests/hour | `@ThrottleAuthVeryStrict()` |
| `/auth/verify-2fa` | POST | 10 requests/15 minutes | `@ThrottleAuth()` |

### Waiting List Endpoints (`wks/waiting-list`)

| Endpoint | Method | Rate Limit | Decorator |
|----------|--------|------------|-----------|
| `/waiting-list` | POST | 10 requests/hour | `@ThrottleFormSubmission()` |
| `/waiting-list/categories` | GET | 100 requests/minute | `@ThrottleGetEndpoints()` |
| `/waiting-list/check-availability` | POST | 30 requests/minute | `@ThrottleCheckAvailability()` |

### Location Endpoints

#### Province (`sys/sys_province`)
- `GET /sys_province` - 100 requests/minute
- `GET /sys_province/:id` - 100 requests/minute

#### City (`sys/sys_city`)
- `GET /sys_city` - 100 requests/minute
- `GET /sys_city/province/:province_id` - 100 requests/minute
- `GET /sys_city/:id` - 100 requests/minute

#### District (`sys/sys_district`)
- `GET /sys_district` - 100 requests/minute
- `GET /sys_district/city/:city_id` - 100 requests/minute
- `GET /sys_district/:id` - 100 requests/minute

#### SubDistrict (`sys/sys_subdistrict`)
- `GET /sys_subdistrict` - 100 requests/minute
- `GET /sys_subdistrict/district/:district_id` - 100 requests/minute
- `GET /sys_subdistrict/city/:city_id` - 100 requests/minute
- `GET /sys_subdistrict/:id` - 100 requests/minute

### System Endpoints

#### Company (`sys/sys_company`)
- `GET /sys_company` - 100 requests/minute
- `GET /sys_company/:id/with-branches` - 100 requests/minute

#### Branch (`sys/sys_branch`)
- `GET /sys_branch` - 100 requests/minute
- `GET /sys_branch/company/:company_id` - 100 requests/minute

#### Menu (`sys/sys_menu`)
- `GET /sys_menu` - 100 requests/minute
- `GET /sys_menu/permissions/:userCompanyRole_id` - 100 requests/minute

#### Menu Permission (`sys/sys_menu_permission`)
- `GET /sys_menu_permission` - 100 requests/minute

#### User Role (`sys/sys_userRole`)
- `GET /sys_user_role` - 100 requests/minute

#### User Company Role (`sys/sys_userCompanyRole`)
- `GET /:company_id/sys_user_company_role` - 100 requests/minute
- `GET /:company_id/sys_user_company_role/available-user-roles` - 100 requests/minute

## 🔒 Rate Limiting Behavior

### Default Behavior
- Rate limiting diterapkan berdasarkan **IP address** dari request
- Setiap endpoint memiliki rate limit sendiri-sendiri
- Rate limit dihitung per IP address

### Response Headers
Ketika rate limit tercapai, response akan mengembalikan:
- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)
- `Retry-After`: Seconds until the rate limit resets

### Error Response
Ketika rate limit terlampaui, API akan mengembalikan:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## 🧪 Testing

Untuk test rate limiting, gunakan tools seperti:
- Postman (dengan Collection Runner)
- Apache Bench (`ab`)
- `curl` dengan loop
- Custom script

### Contoh Test dengan curl:
```bash
# Test rate limiting untuk login endpoint (10 requests per 15 minutes)
for i in {1..15}; do
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  echo ""
done
```

## 📝 Catatan Penting

1. **Rate limiting berdasarkan IP**: Rate limiting menggunakan IP address dari request. Jika menggunakan proxy/load balancer, pastikan `X-Forwarded-For` header dikonfigurasi dengan benar.

2. **In-memory storage**: Default storage menggunakan in-memory. Untuk production dengan multiple instances, pertimbangkan menggunakan Redis storage (`@nestjs/throttler-storage-redis`).

3. **Rate limit headers**: Headers akan otomatis ditambahkan ke response oleh ThrottlerGuard.

4. **Public endpoints**: Rate limiting tetap berlaku untuk endpoints yang menggunakan `@Public()` decorator.

## 🚀 Next Steps (Optional)

Untuk production dengan multiple instances, pertimbangkan:

1. **Redis Storage**:
   ```bash
   npm install @nestjs/throttler-storage-redis
   ```
   Kemudian konfigurasi di `app.module.ts`:
   ```typescript
   ThrottlerModule.forRoot({
     storage: new ThrottlerStorageRedisService(),
     // ... other config
   })
   ```

2. **Environment Variables**: Pindahkan rate limit configuration ke environment variables untuk fleksibilitas.

3. **Monitoring**: Setup monitoring untuk track rate limit violations dan patterns.

4. **Whitelist IP**: Implement IP whitelist untuk trusted IPs (opsional).

## 📚 Referensi

- [NestJS Throttler Documentation](https://docs.nestjs.com/security/rate-limiting)
- [@nestjs/throttler GitHub](https://github.com/nestjs/throttler)

