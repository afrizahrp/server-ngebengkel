# Verifikasi Refresh Token Implementation

Dokumen ini menjelaskan cara memverifikasi bahwa refresh token bekerja dengan benar di server-ngebengkel.

## Checklist Implementasi

### ✅ 1. Konfigurasi

- [x] `REFRESH_JWT_SECRET` sudah di-set di `.env`
- [x] `REFRESH_JWT_EXPIRES` sudah di-set (default: 7d)
- [x] `refresh.config.ts` sudah ter-register di module
- [x] `BetterRefreshGuard` menggunakan config yang benar

### ✅ 2. Endpoint Refresh

**Endpoint:** `POST /api/auth/refresh`

**Guard:** `BetterRefreshGuard`
****
**Request Headers:**
- `X-Refresh-Token: <refresh_token>` (preferred)
- `Cookie: refreshToken=<refresh_token>` (alternative)
- `Authorization: Bearer <refresh_token>` (alternative)

**Response:**
```json
{
  "accessToken": "new_access_token...",
  "refreshToken": "new_refresh_token...",
  "sessionId": "session_id..."
}
```

### ✅ 3. Token Rotation

- [x] Refresh token di-rotate setiap kali refresh
- [x] Token lama tidak bisa digunakan lagi setelah refresh
- [x] Token baru disimpan di database (hashed)

### ✅ 4. Security Features

- [x] Refresh token di-hash sebelum disimpan di database
- [x] Refresh token di-verify menggunakan JWT secret
- [x] Session validation sebelum refresh
- [x] Token expiry validation

## Test Scenarios

### Test 1: Basic Refresh Flow

```bash
# 1. Login untuk dapat tokens
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Response: { "accessToken": "...", "refreshToken": "...", "sessionId": "..." }

# 2. Refresh token
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: <refresh_token_from_step_1>"

# Expected: New access token dan refresh token
```

### Test 2: Token Rotation

```bash
# 1. Refresh pertama kali
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: <old_refresh_token>"

# Response: { "accessToken": "...", "refreshToken": "<new_refresh_token>", ... }

# 2. Coba gunakan refresh token lama
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: <old_refresh_token>"

# Expected: 401 Unauthorized - "Invalid refresh token"
```

### Test 3: Expired Refresh Token

```bash
# Gunakan refresh token yang sudah expired
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: <expired_refresh_token>"

# Expected: 401 Unauthorized - "Invalid refresh token"
```

### Test 4: Missing Refresh Token

```bash
# Request tanpa refresh token
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized - "No refresh token provided"
```

### Test 5: Invalid Refresh Token

```bash
# Request dengan invalid token
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: invalid_token_here"

# Expected: 401 Unauthorized - "Invalid refresh token"
```

## Verification Steps

### Step 1: Check Configuration

```typescript
// Verify refresh config ter-load dengan benar
// Check di better-auth.module.ts bahwa refreshConfig sudah di-import
```

### Step 2: Check Guard Implementation

```typescript
// Verify BetterRefreshGuard menggunakan refreshTokenConfig.secret
// Bukan langsung dari process.env
```

### Step 3: Check Service Implementation

```typescript
// Verify BetterAuthService.refreshToken():
// 1. Validates session dengan refresh token
// 2. Generates new tokens
// 3. Rotates refresh token (update di database)
// 4. Returns new tokens
```

### Step 4: Check Database

```sql
-- Check session table setelah refresh
SELECT id, user_id, hasRefreshedToken, lastActivityAt, expiresAt
FROM sys_Session
WHERE user_id = <user_id>
ORDER BY lastActivityAt DESC;

-- Verify:
-- - hasRefreshedToken = true setelah refresh
-- - refreshToken sudah di-update (hashed)
-- - lastActivityAt sudah di-update
```

## Integration Test dengan Listing

### Test Service Account Refresh

1. **Setup:**
   ```env
   SERVICE_EMAIL=service@example.com
   SERVICE_PASSWORD=service_password
   ```

2. **Test di listing-ngebengkel:**
   - Panggil `getServiceTokenWithRefresh()`
   - Verify token di-cache
   - Expire access token (tunggu atau manual)
   - Verify auto-refresh bekerja
   - Check logs di console

3. **Verify di server:**
   - Check session di database
   - Verify refresh token di-rotate
   - Check logs di server

## Common Issues & Solutions

### Issue 1: "No refresh token provided"

**Cause:** Refresh token tidak terkirim di request

**Solution:**
- Check apakah header `X-Refresh-Token` terkirim
- Check apakah cookie `refreshToken` ter-set
- Verify request format

### Issue 2: "Invalid refresh token"

**Cause:** 
- Refresh token sudah expired
- Refresh token sudah di-rotate
- Refresh token tidak valid

**Solution:**
- Check token expiry
- Gunakan refresh token terbaru
- Verify token format (JWT)

### Issue 3: Config mismatch

**Cause:** Guard menggunakan `REFRESH_SECRET` tapi config menggunakan `REFRESH_JWT_SECRET`

**Solution:** ✅ Sudah diperbaiki - guard sekarang menggunakan `refreshTokenConfig.secret`

### Issue 4: Token tidak di-rotate

**Cause:** Service tidak update refresh token di database

**Solution:**
- Check `BetterAuthService.refreshToken()` method
- Verify `rotateRefreshTokenAndFlag()` dipanggil
- Check database update

## Monitoring

### Logs to Monitor

1. **Server logs:**
   - Refresh token requests
   - Token validation errors
   - Database update errors

2. **Client logs (listing):**
   - `[ServiceToken]` logs
   - Refresh attempts
   - Re-login triggers

### Metrics to Track

- Refresh token success rate
- Refresh token failure rate
- Average time between refreshes
- Re-login frequency

## Security Considerations

1. ✅ Refresh token di-hash sebelum disimpan
2. ✅ Token rotation mencegah reuse
3. ✅ Expiry validation
4. ✅ Session validation
5. ⚠️ Consider: Rate limiting untuk refresh endpoint
6. ⚠️ Consider: Refresh token revocation

