# Debug: Auto-Refresh Tidak Berjalan

## Masalah

Setelah 5 menit (access token expired), `hashedRefreshToken` tidak berubah dan tidak ada log refresh token.

## Analisis

Dari logs yang Anda berikan:
- ✅ Server running
- ✅ Ada request ke berbagai endpoint
- ✅ Ada login request
- ❌ **TIDAK ada log refresh token**
- ❌ **TIDAK ada log auto-refresh**

Ini berarti:
1. **Refresh endpoint (`/api/auth/refresh`) tidak dipanggil**
2. **Auto-refresh di `BetterJwtAuthGuard` tidak trigger**

## Kemungkinan Penyebab

### 1. Client Tidak Mengirim Refresh Token

Auto-refresh di guard memerlukan refresh token di:
- Cookie: `refreshToken` (httpOnly)
- Header: `X-Refresh-Token`
- Authorization: `Bearer <refresh_token>`

**Check:**
- Apakah client mengirim refresh token saat request?
- Apakah refresh token disimpan di cookie?

### 2. Tidak Ada Request Setelah Token Expired

Auto-refresh hanya trigger saat:
- Ada request dengan expired access token
- Request tersebut punya refresh token

**Check:**
- Apakah ada request setelah 5 menit (setelah token expired)?
- Atau client hanya melakukan request sekali di awal?

### 3. Guard Tidak Trigger Auto-Refresh

Auto-refresh di `BetterJwtAuthGuard` hanya trigger jika:
- Access token expired (bukan invalid)
- Ada refresh token di request

**Check logs:**
Setelah update, harus ada logs:
```
[JwtAuthGuard] Token verification failed. Is expired? true
[JwtAuthGuard] ⏰ Access token expired, attempting auto-refresh...
[JwtAuthGuard] Refresh token from cookie: EXISTS/NOT FOUND
[JwtAuthGuard] ✅ Refresh token found, proceeding with auto-refresh...
[JwtAuthGuard] ✅ Auto-refresh successful. New tokens attached to response headers
```

## Test Steps

### Step 1: Test Manual Refresh Endpoint

```bash
# 1. Login untuk dapat tokens
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"password"}' | jq

# Simpan refreshToken dari response

# 2. Call refresh endpoint manual
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: YOUR_REFRESH_TOKEN" \
  -v

# Check:
# - HTTP status harus 200
# - Response harus berisi accessToken dan refreshToken baru
# - Check server logs untuk:
#   [RefreshToken] Refresh endpoint called for user: ...
#   [RefreshToken] User updated successfully. UpdatedAt: ...
```

### Step 2: Test Auto-Refresh (Guard)

```bash
# 1. Login dan dapat access token
ACCESS_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"password"}' | jq -r '.accessToken')

# 2. Simpan refresh token di cookie (simulasi)
REFRESH_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"password"}' | jq -r '.refreshToken')

# 3. Tunggu 5 menit (atau decode JWT dan set expired manual)

# 4. Panggil protected endpoint dengan expired access token
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Refresh-Token: $REFRESH_TOKEN" \
  -v

# Check server logs untuk:
# [JwtAuthGuard] ⏰ Access token expired, attempting auto-refresh...
# [JwtAuthGuard] ✅ Auto-refresh successful...
```

### Step 3: Check Database

```sql
-- Check sebelum test
SELECT id, name, "hashedRefreshToken", "updatedAt"
FROM "sys_User" 
WHERE id = 2;

-- Setelah test refresh (manual atau auto)
-- Run query yang sama lagi
SELECT id, name, "hashedRefreshToken", "updatedAt"
FROM "sys_User" 
WHERE id = 2;

-- Compare:
-- - hashedRefreshToken harus berbeda
-- - updatedAt harus lebih baru
```

## Expected Logs Setelah Update

### Manual Refresh Endpoint:
```
[RefreshToken] Refresh endpoint called for user: 2
[RefreshToken] Refresh token received (first 30 chars): ...
[RefreshToken] Updating user hashedRefreshToken for user: 2
[RefreshToken] User updated successfully. UpdatedAt: ...
[RefreshToken] ✅ Hash match confirmed
```

### Auto-Refresh (Guard):
```
[JwtAuthGuard] Token verification failed. Is expired? true
[JwtAuthGuard] ⏰ Access token expired, attempting auto-refresh...
[JwtAuthGuard] Refresh token from cookie: EXISTS
[JwtAuthGuard] ✅ Refresh token found, proceeding with auto-refresh...
[JwtAuthGuard] 🔄 Rotating refresh token in session...
[JwtAuthGuard] ✅ Session refresh token rotated
[JwtAuthGuard] 🔄 Updating user hashedRefreshToken for user: 2
[JwtAuthGuard] ✅ User hashedRefreshToken updated. UpdatedAt: ...
[JwtAuthGuard] ✅ Auto-refresh successful. New tokens attached to response headers
```

## Troubleshooting

### Issue 1: Tidak Ada Log Auto-Refresh

**Possible causes:**
- Tidak ada request setelah token expired
- Request tidak punya refresh token
- Token tidak expired (masih valid)

**Solution:**
- Pastikan ada request setelah 5 menit
- Pastikan request membawa refresh token (cookie atau header)
- Verify token benar-benar expired (decode JWT)

### Issue 2: "No refresh token available"

**Possible causes:**
- Refresh token tidak dikirim di request
- Cookie tidak ter-set
- Header tidak ter-set

**Solution:**
- Check apakah client mengirim refresh token
- Check cookie `refreshToken` di browser
- Check header `X-Refresh-Token` di request

### Issue 3: Auto-Refresh Tidak Update Database

**Possible causes:**
- Update terjadi tapi tidak terlihat
- Transaction rollback
- Field name mismatch

**Solution:**
- Check logs untuk confirm update
- Check `updatedAt` timestamp
- Verify field name di Prisma schema

## Next Steps

1. **Restart server** dengan logging baru
2. **Test manual refresh endpoint** untuk verify endpoint bekerja
3. **Test auto-refresh** dengan request setelah token expired
4. **Check logs** untuk melihat flow
5. **Check database** untuk verify update

Jika masih tidak ada log, berarti:
- Client tidak melakukan request setelah token expired
- Atau request tidak membawa refresh token

