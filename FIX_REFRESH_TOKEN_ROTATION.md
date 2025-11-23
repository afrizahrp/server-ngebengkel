# Fix: Refresh Token Rotation Issue

## Masalah

Error "Invalid refresh token" terjadi karena:
1. ✅ Refresh token **berhasil di-rotate** (hash di database berubah)
2. ❌ Listing masih menggunakan **refresh token lama** yang sudah tidak valid
3. ❌ Guard reject token lama karena sudah di-rotate

## Root Cause

**Token Rotation:**
- Setiap refresh, server generate refresh token **baru**
- Refresh token **lama** di-invalidate (tidak bisa digunakan lagi)
- Listing harus menggunakan refresh token **baru** dari response

**Masalah di Listing:**
- Jika response tidak mengembalikan `refreshToken` baru, listing fallback ke token lama
- Token lama sudah invalid, jadi refresh berikutnya gagal

## Solusi

### 1. Server: Pastikan Return Refresh Token Baru

Di `better-auth.service.ts`, refresh endpoint sudah return refresh token baru:
```typescript
return {
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken, // ✅ New refresh token
  sessionId: session.id,
};
```

### 2. Listing: Always Use New Refresh Token

Di `service-token-manager.ts`, sudah diperbaiki untuk:
- ✅ Prioritize refresh token baru dari response
- ✅ Log warning jika server tidak return refresh token baru
- ✅ Handle case dimana token sudah di-rotate

### 3. Guard: Better Error Messages

Di `better-refresh.guard.ts`, sudah ditambahkan:
- ✅ Logging untuk debug
- ✅ Specific error messages (expired vs invalid)
- ✅ Better error handling

## Expected Behavior

### Successful Refresh Flow:

1. **Listing calls refresh:**
   ```
   [ServiceToken] 🔄 Calling refresh endpoint: http://localhost:4000/api/auth/refresh
   ```

2. **Server validates token:**
   ```
   [RefreshGuard] ✅ Refresh token valid for user: 2
   [RefreshToken] Updating user hashedRefreshToken for user: 2
   [RefreshToken] ✅ User updated successfully. UpdatedAt: ...
   ```

3. **Server returns new tokens:**
   ```json
   {
     "accessToken": "new_access_token...",
     "refreshToken": "new_refresh_token...", // ✅ NEW TOKEN
     "sessionId": "..."
   }
   ```

4. **Listing updates cache:**
   ```
   [ServiceToken] ✅ Using new refresh token from response
   [ServiceToken] ✅ Token refreshed successfully!
   ```

### Failed Refresh (Token Already Rotated):

1. **Listing uses old token:**
   ```
   [ServiceToken] 🔄 Calling refresh endpoint...
   ```

2. **Server rejects old token:**
   ```
   [RefreshGuard] ❌ Refresh token verification failed
   [RefreshGuard] Error name: JsonWebTokenError
   [RefreshGuard] 🔒 Invalid refresh token format or signature
   ```

3. **Listing handles error:**
   ```
   [ServiceToken] ⚠️ Refresh failed with status 401: Invalid refresh token
   [ServiceToken] ⚠️ Refresh returned null, will re-login
   [ServiceToken] 🔐 Logging in service account...
   ```

## Testing

### Test 1: Normal Refresh

```bash
# 1. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq

# Simpan refreshToken

# 2. Refresh (harus dapat refreshToken baru)
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: OLD_REFRESH_TOKEN" | jq

# Response harus berisi refreshToken baru
# OLD_REFRESH_TOKEN tidak bisa digunakan lagi
```

### Test 2: Use Old Token (Should Fail)

```bash
# 1. Refresh pertama kali
RESPONSE1=$(curl -s -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: TOKEN_1")

NEW_TOKEN=$(echo $RESPONSE1 | jq -r '.refreshToken')

# 2. Coba gunakan TOKEN_1 lagi (harus fail)
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: TOKEN_1"

# Expected: 401 Invalid refresh token

# 3. Gunakan NEW_TOKEN (harus success)
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: $NEW_TOKEN"

# Expected: 200 dengan refreshToken baru lagi
```

## Warnings yang Muncul

### Warning 1: "Invalid refresh token" (Normal)

Ini terjadi jika:
- Refresh token sudah di-rotate (normal behavior)
- Listing menggunakan token lama (akan trigger re-login)
- **Action:** Listing akan re-login otomatis

### Warning 2: "Server did not return new refresh token"

Ini terjadi jika:
- Server tidak return `refreshToken` di response
- **Action:** Check server code, pastikan return refresh token baru

## Best Practices

1. **Always use new refresh token from response**
2. **Never reuse old refresh token after refresh**
3. **Handle 401 gracefully** - trigger re-login
4. **Log refresh token rotation** for debugging

## Summary

✅ **Refresh token rotation bekerja dengan benar**
- Token di-rotate setiap refresh
- Token lama tidak bisa digunakan lagi
- Database update terjadi

✅ **Listing handle rotation dengan benar**
- Menggunakan refresh token baru dari response
- Re-login jika token invalid
- Error handling yang baik

⚠️ **Warnings adalah normal**
- "Invalid refresh token" = token sudah di-rotate (expected)
- Listing akan re-login otomatis
- Tidak perlu khawatir dengan warnings ini

