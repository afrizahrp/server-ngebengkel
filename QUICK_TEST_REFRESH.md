# Quick Test: Refresh Token Update

## Problem
`hashedRefreshToken` di `sys_User` tidak berubah setelah refresh token dipanggil.

## Quick Test Steps

### 1. Check Current State
```sql
SELECT 
  id, 
  name, 
  "hashedRefreshToken", 
  "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

**Note:** Simpan nilai `hashedRefreshToken` dan `updatedAt` untuk comparison.

### 2. Get Refresh Token (Login)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }' | jq
```

**Simpan `refreshToken` dari response.**

### 3. Call Refresh Endpoint
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: YOUR_REFRESH_TOKEN_HERE" \
  -v
```

**Check:**
- Response status harus `200 OK`
- Response body harus berisi `accessToken` dan `refreshToken` baru
- Check server console logs untuk melihat:
  - `[RefreshToken] Refresh endpoint called for user: 2`
  - `[RefreshToken] Updating session: ...`
  - `[RefreshToken] Session updated successfully`
  - `[RefreshToken] Updating user hashedRefreshToken for user: 2`
  - `[RefreshToken] User updated successfully. UpdatedAt: ...`

### 4. Verify Update
```sql
SELECT 
  id, 
  name, 
  "hashedRefreshToken", 
  "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

**Verify:**
- ✅ `hashedRefreshToken` harus berbeda dari step 1
- ✅ `updatedAt` harus lebih baru dari step 1

### 5. Check Session
```sql
SELECT 
  id,
  user_id,
  "hasRefreshedToken",
  "lastActivityAt",
  "expiresAt"
FROM "sys_Session"
WHERE user_id = 2
ORDER BY "lastActivityAt" DESC
LIMIT 1;
```

**Verify:**
- ✅ `hasRefreshedToken` harus `true`
- ✅ `lastActivityAt` harus update

## Troubleshooting

### Jika hashedRefreshToken tidak berubah:

1. **Check server logs:**
   - Apakah endpoint dipanggil?
   - Apakah ada error?
   - Apakah log `[RefreshToken] User updated successfully` muncul?

2. **Check database transaction:**
   - Apakah update benar-benar terjadi?
   - Apakah ada rollback?

3. **Check apakah menggunakan user yang benar:**
   - Verify `req.user.id` di logs
   - Verify user_id di session

4. **Check apakah ada multiple sessions:**
   - Mungkin refresh menggunakan session yang berbeda
   - Check semua sessions untuk user_id = 2

5. **Manual test update:**
```sql
-- Test apakah update bisa dilakukan
UPDATE "sys_User"
SET "hashedRefreshToken" = 'test_manual_update_' || NOW()::text
WHERE id = 2;

-- Check
SELECT "hashedRefreshToken" FROM "sys_User" WHERE id = 2;
```

## Expected Logs

Setelah refresh, harus ada logs seperti ini:
```
[RefreshToken] Refresh endpoint called for user: 2
[RefreshToken] Refresh token received (first 30 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
[RefreshToken] Starting refresh for user: 2
[RefreshToken] Session found: <session_id>
[RefreshToken] New tokens generated
[RefreshToken] Updating session: <session_id>
[RefreshToken] New refresh token hash (first 30 chars): $argon2id$v=19$m=65536,t=3,p=4
[RefreshToken] Session updated successfully
[RefreshToken] Updating user hashedRefreshToken for user: 2
[RefreshToken] User updated successfully. UpdatedAt: 2024-01-XX XX:XX:XX
[RefreshToken] New hashedRefreshToken (first 30 chars): $argon2id$v=19$m=65536,t=3,p=4
[RefreshToken] Refresh successful. New tokens generated.
```

## Common Issues

### Issue 1: No logs muncul
**Cause:** Endpoint tidak dipanggil atau error sebelum logging
**Solution:** Check apakah request benar-benar sampai ke server

### Issue 2: Logs muncul tapi database tidak update
**Cause:** Transaction rollback atau constraint violation
**Solution:** Check database logs dan constraints

### Issue 3: Update terjadi tapi tidak terlihat
**Cause:** Query menggunakan cache atau melihat data lama
**Solution:** 
- Use `SELECT ... FOR UPDATE` untuk lock row
- Check `updatedAt` timestamp
- Refresh connection

