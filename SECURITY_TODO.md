# Security TODO untuk PUBLIC() Endpoints

## 📋 Daftar PUBLIC() Endpoints yang Ditemukan

### Authentication Endpoints (`auth/better-auth`)
- ✅ `POST /auth/register` - Registrasi user baru
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `POST /auth/logout` - Logout (perlu verifikasi)
- ✅ `POST /auth/forgot-password` - Request reset password
- ✅ `POST /auth/reset-password` - Reset password
- ✅ `GET /auth/google/login` - Google OAuth login
- ✅ `GET /auth/google/callback` - Google OAuth callback
- ✅ `GET /auth/verify-email` - Verifikasi email
- ✅ `POST /auth/resend-verification-email` - Resend verification
- ✅ `POST /auth/verify-2fa` - Verifikasi 2FA

### Waiting List Endpoints (`wks/waiting-list`)
- ⚠️ `POST /waiting-list` - Registrasi waiting list
- ✅ `GET /waiting-list/categories` - Get kategori bengkel
- ⚠️ `POST /waiting-list/check-availability` - Check availability

### Location Endpoints (Public GET untuk dropdown)
- ✅ `GET /sys_province` - List provinsi
- ✅ `GET /sys_province/:id` - Detail provinsi
- ✅ `GET /sys_city` - List kota
- ✅ `GET /sys_city/province/:province_id` - Kota by provinsi
- ✅ `GET /sys_city/:id` - Detail kota
- ✅ `GET /sys_district` - List kecamatan
- ✅ `GET /sys_district/city/:city_id` - Kecamatan by kota
- ✅ `GET /sys_district/:id` - Detail kecamatan
- ✅ `GET /sys_subdistrict` - List kelurahan
- ✅ `GET /sys_subdistrict/district/:district_id` - Kelurahan by kecamatan
- ✅ `GET /sys_subdistrict/city/:city_id` - Kelurahan by kota
- ✅ `GET /sys_subdistrict/:id` - Detail kelurahan

### System Endpoints
- ⚠️ `GET /sys_company` - List semua company (perlu review)
- ⚠️ `GET /sys_company/:id/with-branches` - Company dengan branches (untuk login flow)
- ⚠️ `GET /sys_branch` - List semua branch (perlu review)
- ⚠️ `GET /sys_branch/company/:company_id` - Branch by company
- ⚠️ `GET /sys_menu` - List menu (perlu review)
- ⚠️ `GET /sys_menu/permissions/:userCompanyRole_id` - Menu permissions
- ⚠️ `GET /sys_menu_permission` - List menu permissions (perlu review)
- ⚠️ `GET /sys_userRole` - List user roles (perlu review)
- ⚠️ `GET /sys_userCompanyRole/available-user-roles` - Available user roles

---

## 🔒 Security TODO List

### 1. Rate Limiting & Throttling ⚠️ HIGH PRIORITY

#### 1.1 Install Rate Limiting Package
- [ ] Install `@nestjs/throttler` package
- [ ] Install `@nestjs/throttler-storage-redis` (optional, untuk production)

#### 1.2 Implement Rate Limiting
- [ ] Setup global rate limiting (default: 100 requests/minute per IP)
- [ ] Rate limiting khusus untuk auth endpoints:
  - [ ] `POST /auth/register` - 5 requests/hour per IP
  - [ ] `POST /auth/login` - 10 requests/15 minutes per IP
  - [ ] `POST /auth/forgot-password` - 3 requests/hour per IP
  - [ ] `POST /auth/reset-password` - 5 requests/hour per IP
  - [ ] `POST /auth/resend-verification-email` - 3 requests/hour per IP
- [ ] Rate limiting untuk form submission:
  - [ ] `POST /waiting-list` - 10 requests/hour per IP
  - [ ] `POST /waiting-list/check-availability` - 30 requests/minute per IP
- [ ] Rate limiting untuk GET endpoints:
  - [ ] Location endpoints (province, city, dll) - 100 requests/minute per IP
  - [ ] System endpoints - 50 requests/minute per IP

#### 1.3 Implement Throttling Guard
- [ ] Buat custom throttler guard untuk endpoint spesifik
- [ ] Implement sliding window rate limiting
- [ ] Add rate limit headers ke response (`X-RateLimit-*`)

---

### 2. Input Validation & Sanitization ⚠️ HIGH PRIORITY

#### 2.1 Strengthen Validation
- [ ] Review semua DTO untuk validation rules
- [ ] Tambahkan `@IsEmail()`, `@IsStrongPassword()` untuk auth endpoints
- [ ] Tambahkan `@Length()`, `@Matches()` untuk string inputs
- [ ] Tambahkan `@IsUUID()` untuk ID parameters
- [ ] Tambahkan `@IsOptional()` dengan default values yang aman

#### 2.2 Input Sanitization
- [ ] Install `class-sanitizer` atau `sanitize-html`
- [ ] Sanitize semua string inputs (remove HTML tags, scripts)
- [ ] Sanitize email inputs (lowercase, trim)
- [ ] Sanitize phone number inputs (format standardization)
- [ ] Validate file uploads (jika ada) - type, size, content

#### 2.3 SQL Injection Prevention
- [ ] Pastikan semua queries menggunakan Prisma (sudah aman)
- [ ] Review raw queries (jika ada) untuk parameterized queries
- [ ] Add input validation untuk ID parameters (UUID format)

---

### 3. CORS & Security Headers ⚠️ HIGH PRIORITY

#### 3.1 Strengthen CORS Configuration
- [ ] Review CORS origin whitelist di `main.ts`
- [ ] Tambahkan environment variable untuk allowed origins
- [ ] Implement CORS untuk production vs development
- [ ] Add `credentials: true` hanya untuk trusted origins
- [ ] Limit allowed methods per endpoint

#### 3.2 Security Headers (Helmet)
- [ ] Install `helmet` package
- [ ] Implement Helmet middleware:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Strict-Transport-Security` (HSTS) untuk HTTPS
  - [ ] `Content-Security-Policy` (CSP)
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy` headers

---

### 4. CSRF Protection ⚠️ MEDIUM PRIORITY

#### 4.1 CSRF Token Implementation
- [ ] Install `csurf` atau implement custom CSRF protection
- [ ] Generate CSRF token untuk form submissions
- [ ] Validate CSRF token di POST/PUT/DELETE endpoints
- [ ] Exclude GET endpoints dari CSRF (safe methods)
- [ ] Implement double-submit cookie pattern

#### 4.2 CSRF untuk Public Endpoints
- [ ] `POST /waiting-list` - Require CSRF token
- [ ] `POST /auth/register` - Require CSRF token
- [ ] `POST /auth/login` - Consider CSRF (atau use SameSite cookies)
- [ ] `POST /auth/forgot-password` - Require CSRF token
- [ ] `POST /auth/reset-password` - Require CSRF token

---

### 5. CAPTCHA Protection ⚠️ MEDIUM PRIORITY

#### 5.1 Implement CAPTCHA
- [ ] Install Google reCAPTCHA v3 atau hCaptcha
- [ ] Add CAPTCHA verification untuk:
  - [ ] `POST /auth/register` - Require CAPTCHA
  - [ ] `POST /auth/login` - Require CAPTCHA setelah 3 failed attempts
  - [ ] `POST /waiting-list` - Require CAPTCHA
  - [ ] `POST /auth/forgot-password` - Require CAPTCHA
  - [ ] `POST /auth/resend-verification-email` - Require CAPTCHA

#### 5.2 CAPTCHA Configuration
- [ ] Setup reCAPTCHA site key & secret key
- [ ] Implement server-side CAPTCHA verification
- [ ] Add CAPTCHA score threshold (0.5 untuk reCAPTCHA v3)
- [ ] Log failed CAPTCHA attempts

---

### 6. Request Size Limits ⚠️ MEDIUM PRIORITY

#### 6.1 Body Parser Limits
- [ ] Set `bodyParser.json({ limit: '10mb' })` di main.ts
- [ ] Set `bodyParser.urlencoded({ limit: '10mb', extended: true })`
- [ ] Review dan limit sesuai kebutuhan per endpoint

#### 6.2 Query Parameter Limits
- [ ] Limit query parameter length
- [ ] Limit number of query parameters
- [ ] Validate pagination limits (max page size)

---

### 7. IP Whitelist/Blacklist ⚠️ LOW PRIORITY

#### 7.1 IP Management
- [ ] Implement IP blacklist untuk blocked IPs
- [ ] Implement IP whitelist untuk trusted IPs (opsional)
- [ ] Store blacklist di database atau Redis
- [ ] Add middleware untuk check IP blacklist
- [ ] Auto-blacklist setelah X failed login attempts

#### 7.2 IP Rate Limiting per Endpoint
- [ ] Different rate limits untuk different IP ranges
- [ ] Stricter limits untuk suspicious IPs
- [ ] Geo-blocking untuk specific countries (jika diperlukan)

---

### 8. Logging & Monitoring ⚠️ HIGH PRIORITY

#### 8.1 Security Event Logging
- [ ] Log semua failed login attempts
- [ ] Log semua failed registration attempts
- [ ] Log rate limit violations
- [ ] Log CSRF token failures
- [ ] Log CAPTCHA failures
- [ ] Log suspicious activities (multiple failed attempts)
- [ ] Log IP addresses untuk audit trail

#### 8.2 Request Logging
- [ ] Log semua requests ke public endpoints (method, path, IP, timestamp)
- [ ] Log request body untuk POST/PUT (sanitize sensitive data)
- [ ] Implement structured logging (JSON format)
- [ ] Add correlation ID untuk request tracking

#### 8.3 Monitoring & Alerts
- [ ] Setup monitoring untuk rate limit violations
- [ ] Alert untuk multiple failed login attempts dari same IP
- [ ] Alert untuk suspicious patterns (brute force, DDoS)
- [ ] Dashboard untuk security metrics

---

### 9. Data Exposure Prevention ⚠️ HIGH PRIORITY

#### 9.1 Review Public GET Endpoints
- [ ] `GET /sys_company` - Review apakah perlu expose semua company
- [ ] `GET /sys_branch` - Review apakah perlu expose semua branch
- [ ] `GET /sys_menu` - Review apakah perlu expose semua menu
- [ ] `GET /sys_userRole` - Review apakah perlu expose semua roles
- [ ] Consider pagination untuk large datasets
- [ ] Consider filtering untuk sensitive data

#### 9.2 Response Sanitization
- [ ] Remove sensitive fields dari public responses
- [ ] Sanitize error messages (jangan expose internal details)
- [ ] Standardize error responses (generic messages untuk public)
- [ ] Review DTO responses untuk data leakage

---

### 10. Authentication & Authorization ⚠️ HIGH PRIORITY

#### 10.1 Password Security
- [ ] Enforce strong password policy (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Implement password strength meter
- [ ] Hash passwords dengan Argon2 (sudah ada, verify configuration)
- [ ] Implement password history (prevent reuse)
- [ ] Add password expiration (opsional)

#### 10.2 Session Management
- [ ] Review session timeout configuration
- [ ] Implement session invalidation on logout
- [ ] Implement concurrent session limits
- [ ] Add device fingerprinting untuk session security
- [ ] Implement "Remember Me" dengan secure token

#### 10.3 Token Security
- [ ] Review JWT token expiration times
- [ ] Implement token rotation untuk refresh tokens
- [ ] Add token blacklist untuk revoked tokens
- [ ] Secure token storage (httpOnly cookies untuk refresh token)

---

### 11. Email Security ⚠️ MEDIUM PRIORITY

#### 11.1 Email Verification
- [ ] Verify email domain validity
- [ ] Implement email rate limiting (prevent email bombing)
- [ ] Add email verification token expiration
- [ ] Implement email verification token one-time use

#### 11.2 Email Content Security
- [ ] Sanitize email content (prevent email injection)
- [ ] Validate email addresses dengan regex + DNS check
- [ ] Implement email bounce handling

---

### 12. API Key Protection (Optional) ⚠️ LOW PRIORITY

#### 12.1 API Key untuk Sensitive Endpoints
- [ ] Consider API key untuk:
  - [ ] `GET /sys_company` (jika perlu tetap public)
  - [ ] `GET /sys_branch` (jika perlu tetap public)
- [ ] Implement API key validation middleware
- [ ] Store API keys securely (hashed)
- [ ] Implement API key rotation

---

### 13. DDoS Protection ⚠️ MEDIUM PRIORITY

#### 13.1 Application Level
- [ ] Implement request queuing untuk high traffic
- [ ] Add timeout untuk slow requests
- [ ] Implement circuit breaker pattern
- [ ] Add health check endpoints

#### 13.2 Infrastructure Level (Recommendations)
- [ ] Setup Cloudflare atau AWS WAF
- [ ] Implement CDN untuk static assets
- [ ] Setup load balancer dengan rate limiting
- [ ] Consider DDoS protection service

---

### 14. Data Validation & Type Safety ⚠️ HIGH PRIORITY

#### 14.1 Type Validation
- [ ] Ensure semua DTO menggunakan class-validator
- [ ] Add custom validators untuk business logic
- [ ] Validate UUID format untuk ID parameters
- [ ] Validate date formats
- [ ] Validate enum values

#### 14.2 Business Logic Validation
- [ ] Validate email uniqueness sebelum register
- [ ] Validate company_id existence sebelum create branch
- [ ] Validate location hierarchy (province → city → district → subdistrict)
- [ ] Add transaction validation untuk data consistency

---

### 15. Error Handling ⚠️ MEDIUM PRIORITY

#### 15.1 Secure Error Messages
- [ ] Generic error messages untuk public endpoints
- [ ] Jangan expose stack traces di production
- [ ] Jangan expose database errors
- [ ] Standardize error response format
- [ ] Log detailed errors server-side only

#### 15.2 Error Response Format
- [ ] Consistent error response structure
- [ ] Include error codes (bukan internal details)
- [ ] User-friendly error messages
- [ ] Add request ID untuk error tracking

---

## 🎯 Priority Summary

### 🔴 CRITICAL (Do First)
1. Rate Limiting & Throttling
2. Input Validation & Sanitization
3. Security Headers (Helmet)
4. Data Exposure Prevention
5. Logging & Monitoring

### 🟡 HIGH PRIORITY (Do Next)
6. CORS Strengthening
7. CSRF Protection
8. CAPTCHA Protection
9. Authentication & Authorization Review
10. Data Validation & Type Safety

### 🟢 MEDIUM PRIORITY (Do Later)
11. Request Size Limits
12. Email Security
13. DDoS Protection
14. Error Handling

### ⚪ LOW PRIORITY (Optional)
15. IP Whitelist/Blacklist
16. API Key Protection

---

## 📝 Implementation Notes

### Dependencies yang Perlu Ditambahkan
```json
{
  "@nestjs/throttler": "^5.0.0",
  "helmet": "^7.1.0",
  "class-sanitizer": "^0.1.0",
  "express-rate-limit": "^7.1.0",
  "csurf": "^1.11.0",
  "express-validator": "^7.0.0"
}
```

### Environment Variables yang Perlu Ditambahkan
```env
# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
ALLOWED_ORIGINS=https://ngebengkel.com,https://www.ngebengkel.com

# CAPTCHA
RECAPTCHA_SECRET_KEY=your-secret-key
RECAPTCHA_SITE_KEY=your-site-key

# Security
NODE_ENV=production
TRUST_PROXY=true
```

---

## 🔍 Review Checklist

Sebelum deploy ke production, pastikan:
- [ ] Semua rate limiting sudah diimplementasi
- [ ] Security headers sudah dikonfigurasi
- [ ] Input validation sudah lengkap
- [ ] Error handling sudah secure
- [ ] Logging sudah comprehensive
- [ ] CORS sudah dikonfigurasi dengan benar
- [ ] CAPTCHA sudah diimplementasi untuk form submissions
- [ ] Monitoring & alerts sudah setup
- [ ] Security testing sudah dilakukan
- [ ] Penetration testing sudah dilakukan (opsional)

