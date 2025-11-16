# CORS & Security Headers Implementation

## ✅ Implementasi Selesai

CORS configuration dan Security Headers telah diimplementasikan menggunakan `helmet` dan konfigurasi CORS yang diperkuat.

## 📦 Packages yang Digunakan

- `helmet` - Package untuk security headers

## 🔧 Konfigurasi

### Security Headers (Helmet)

Helmet dikonfigurasi dengan security headers berikut:

#### 1. Content Security Policy (CSP)
- `defaultSrc: ['self']` - Only allow resources from same origin
- `styleSrc: ['self', 'unsafe-inline']` - Allow inline styles (untuk compatibility)
- `scriptSrc: ['self']` - Only allow scripts from same origin
- `imgSrc: ['self', 'data:', 'https:']` - Allow images from same origin, data URIs, dan HTTPS
- `connectSrc: ['self']` - Only allow connections to same origin
- `fontSrc: ['self']` - Only allow fonts from same origin
- `objectSrc: ['none']` - Block all object/embed/applet elements
- `mediaSrc: ['self']` - Only allow media from same origin
- `frameSrc: ['none']` - Block all frames/iframes

#### 2. Cross-Origin Policies
- `crossOriginEmbedderPolicy: false` - Disabled untuk compatibility
- `crossOriginResourcePolicy: { policy: 'cross-origin' }` - Allow cross-origin resources

#### 3. HTTP Strict Transport Security (HSTS)
- `maxAge: 31536000` - 1 year
- `includeSubDomains: true` - Apply to all subdomains
- `preload: true` - Enable HSTS preload

#### 4. Default Helmet Headers
Helmet juga otomatis menambahkan:
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - Enable XSS filter
- `Referrer-Policy: no-referrer` - Control referrer information
- `Permissions-Policy` - Control browser features

### CORS Configuration

#### Environment-Based Configuration
CORS configuration menggunakan environment variables:

**Development:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `https://ngebengkel.com`
- `https://www.ngebengkel.com`

**Production:**
- `https://ngebengkel.com`
- `https://www.ngebengkel.com`

**Custom (via environment variable):**
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

#### CORS Settings
- **Origin**: Dynamic validation berdasarkan allowed origins list
- **Methods**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- **Allowed Headers**: 
  - `Content-Type`
  - `Authorization`
  - `X-Requested-With`
  - `Accept`
  - `Origin`
- **Exposed Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- **Credentials**: `true` - Allow cookies and credentials
- **Max Age**: `86400` seconds (24 hours)
- **Preflight Continue**: `false`
- **Options Success Status**: `204`

## 🔒 Security Features

### 1. XSS Protection
- `X-XSS-Protection: 1; mode=block` - Enable browser XSS filter
- Content Security Policy mencegah inline scripts berbahaya

### 2. Clickjacking Protection
- `X-Frame-Options: DENY` - Block all framing
- CSP `frameSrc: ['none']` - Additional protection

### 3. MIME Type Sniffing Prevention
- `X-Content-Type-Options: nosniff` - Prevent browser from guessing content types

### 4. HTTPS Enforcement
- HSTS dengan max age 1 year
- Include subdomains
- Preload enabled

### 5. CORS Protection
- Whitelist-based origin validation
- Credentials hanya untuk trusted origins
- Exposed headers terbatas

### 6. Referrer Policy
- Control referrer information yang dikirim

### 7. Permissions Policy
- Control browser features (camera, microphone, geolocation, dll)

## 📝 Environment Variables

### Required
Tidak ada environment variables yang required, tapi disarankan untuk set:

```env
# Node Environment
NODE_ENV=production

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://ngebengkel.com,https://www.ngebengkel.com
```

### Example .env file
```env
# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://ngebengkel.com,https://www.ngebengkel.com,https://admin.ngebengkel.com

# Database
DATABASE_URL=postgresql://...

# Other configurations...
```

## 🧪 Testing

### Test CORS
```bash
# Test dari allowed origin (should work)
curl -X GET http://localhost:4000/api/auth/me \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test dari disallowed origin (should fail)
curl -X GET http://localhost:4000/api/auth/me \
  -H "Origin: https://evil.com" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Security Headers
```bash
# Check security headers
curl -I http://localhost:4000/api/auth/me

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; ...
# Referrer-Policy: no-referrer
```

### Test CSP
CSP dapat di-test dengan browser DevTools:
1. Open browser DevTools
2. Check Console untuk CSP violations
3. CSP violations akan muncul jika ada resource yang diblokir

## 🔍 Troubleshooting

### CORS Errors
Jika mendapat CORS error:
1. Check `ALLOWED_ORIGINS` environment variable
2. Pastikan origin yang digunakan ada di allowed list
3. Check browser console untuk detail error

### CSP Violations
Jika mendapat CSP violations:
1. Check browser console untuk detail violation
2. Update CSP directives di `main.ts` jika perlu
3. Pastikan semua resources (CSS, JS, images) dari allowed sources

### HSTS Issues
- HSTS hanya berlaku untuk HTTPS
- Setelah di-set, browser akan force HTTPS untuk domain tersebut
- Untuk development, gunakan HTTP atau disable HSTS

## 📚 Best Practices

1. **Always use HTTPS in production**: HSTS hanya bekerja dengan HTTPS
2. **Whitelist origins**: Jangan gunakan wildcard untuk production
3. **Review CSP regularly**: Update CSP directives sesuai kebutuhan
4. **Test CORS**: Test dari berbagai origins sebelum deploy
5. **Monitor CSP violations**: Setup monitoring untuk CSP violations
6. **Keep Helmet updated**: Update Helmet package secara berkala

## 🚀 Production Checklist

Sebelum deploy ke production:
- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOWED_ORIGINS` dengan production domains
- [ ] Test CORS dari production frontend
- [ ] Verify security headers dengan security scanner
- [ ] Test CSP tidak memblokir resources yang diperlukan
- [ ] Verify HSTS bekerja dengan HTTPS
- [ ] Monitor CSP violations di production

## 📚 Referensi

- [Helmet Documentation](https://helmetjs.github.io/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)









