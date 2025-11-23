# Debug Refresh Token Rotation

## Masalah: hashedRefreshToken tidak berubah setelah refresh

### Test Steps

1. **Check current state:**
```sql
SELECT id, name, "hashedRefreshToken", "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

2. **Login untuk dapat refresh token:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}' \
  -v
```

**Simpan refreshToken dari response**

3. **Check session sebelum refresh:**
```sql
SELECT id, user_id, "hasRefreshedToken", "lastActivityAt", "expiresAt"
FROM "sys_Session"
WHERE user_id = 2
ORDER BY "lastActivityAt" DESC
LIMIT 1;
```

**Simpan session id dan hasRefreshedToken value**

4. **Call refresh endpoint:**
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: YOUR_REFRESH_TOKEN_HERE" \
  -v
```

**Check response - harus dapat accessToken dan refreshToken baru**

5. **Check session setelah refresh:**
```sql
SELECT id, user_id, "hasRefreshedToken", "lastActivityAt", "expiresAt"
FROM "sys_Session"
WHERE user_id = 2
ORDER BY "lastActivityAt" DESC
LIMIT 1;
```

**Verify:**
- `hasRefreshedToken` harus berubah menjadi `true`
- `lastActivityAt` harus berubah

6. **Check user hashedRefreshToken:**
```sql
SELECT id, name, "hashedRefreshToken", "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

**Verify:**
- `hashedRefreshToken` harus berubah (hash baru)
- `updatedAt` harus berubah

## Troubleshooting

### Jika hashedRefreshToken tidak berubah:

1. **Check apakah refresh endpoint benar-benar dipanggil:**
   - Check server logs
   - Verify response status (harus 200)
   - Check apakah ada error di console

2. **Check apakah update terjadi tapi rollback:**
   - Check database transaction logs
   - Verify tidak ada constraint violation

3. **Check apakah menggunakan session yang berbeda:**
   - Verify session id yang digunakan
   - Check apakah ada multiple sessions

4. **Check apakah ada error yang di-swallow:**
   - Add logging di `better-auth.service.ts`
   - Check error handling

5. **Manual test update:**
```sql
-- Test apakah update bisa dilakukan manual
UPDATE "sys_User"
SET "hashedRefreshToken" = 'test_hash_manual'
WHERE id = 2;

-- Check hasil
SELECT "hashedRefreshToken" FROM "sys_User" WHERE id = 2;

-- Rollback
UPDATE "sys_User"
SET "hashedRefreshToken" = (SELECT "hashedRefreshToken" FROM "sys_User" WHERE id = 2 LIMIT 1)
WHERE id = 2;
```

## Expected Behavior

Setelah refresh token:
1. ✅ Session.refreshToken harus berubah (hashed)
2. ✅ Session.hasRefreshedToken harus menjadi `true`
3. ✅ Session.lastActivityAt harus update
4. ✅ User.hashedRefreshToken harus berubah (hashed)
5. ✅ User.updatedAt harus update

## Debug Code

Tambahkan logging di `better-auth.service.ts`:

```typescript
async refreshToken(userId: number, refreshToken: string) {
  console.log('[RefreshToken] Starting refresh for user:', userId);
  
  const session = await this.sessionService.getSessionByRefreshToken(
    userId,
    refreshToken,
  );
  console.log('[RefreshToken] Session found:', session.id);

  const tokens = await this.authTokenService.generateTokens(...);
  console.log('[RefreshToken] New tokens generated');

  const hashedRefreshToken = await hash(tokens.refreshToken);
  console.log('[RefreshToken] New hash:', hashedRefreshToken.substring(0, 20) + '...');

  await this.prisma.sys_Session.update({
    where: { id: session.id },
    data: {
      refreshToken: hashedRefreshToken,
      hasRefreshedToken: true,
      lastActivityAt: new Date(),
    },
  });
  console.log('[RefreshToken] Session updated');

  const userUpdate = await this.prisma.sys_User.update({
    where: { id: userId },
    data: { hashedRefreshToken },
  });
  console.log('[RefreshToken] User updated:', userUpdate.updatedAt);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    sessionId: session.id,
  };
}
```

