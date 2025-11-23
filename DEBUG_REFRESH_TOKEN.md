# Debug: hashedRefreshToken Tidak Berubah

## Masalah
Setelah memanggil refresh endpoint, `hashedRefreshToken` di `sys_User` tidak berubah.

## Step-by-Step Debug

### 1. Pastikan Refresh Endpoint Dipanggil

**Check server console logs** - harus ada:
```
[RefreshToken] Refresh endpoint called for user: 2
[RefreshToken] Refresh token received (first 30 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**Jika tidak ada logs ini:**
- ❌ Refresh endpoint tidak dipanggil
- Check apakah request benar-benar sampai ke server
- Check apakah guard block request

### 2. Test Manual dengan curl

```bash
# 1. Login dulu
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}' \
  | jq

# Simpan refreshToken dari response

# 2. Call refresh endpoint
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: YOUR_REFRESH_TOKEN_HERE" \
  -v

# Check:
# - HTTP status harus 200
# - Response harus berisi accessToken dan refreshToken baru
# - Check server console untuk logs
```

### 3. Check Database Sebelum dan Sesudah

**Sebelum refresh:**
```sql
SELECT 
  id, 
  name, 
  "hashedRefreshToken", 
  "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

**Sesudah refresh (langsung setelah call endpoint):**
```sql
-- Run query yang sama lagi
SELECT 
  id, 
  name, 
  "hashedRefreshToken", 
  "updatedAt"
FROM "sys_User" 
WHERE id = 2;
```

**Compare:**
- `hashedRefreshToken` harus berbeda
- `updatedAt` harus lebih baru

### 4. Check Server Logs

Setelah refresh, harus ada logs ini di server console:

```
[RefreshToken] Refresh endpoint called for user: 2
[RefreshToken] Refresh token received (first 30 chars): ...
[RefreshToken] Starting refresh for user: 2
[RefreshToken] Session found: <session_id>
[RefreshToken] New tokens generated
[RefreshToken] Updating session: <session_id>
[RefreshToken] New refresh token hash (first 30 chars): ...
[RefreshToken] Session updated successfully
[RefreshToken] Updating user hashedRefreshToken for user: 2
[RefreshToken] User updated successfully. UpdatedAt: <timestamp>
[RefreshToken] New hashedRefreshToken (first 30 chars): ...
[RefreshToken] Refresh successful. New tokens generated.
```

**Jika ada error di logs:**
- Copy error message
- Check apakah ada exception yang di-swallow

### 5. Check Session Update

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
- `hasRefreshedToken` harus `true` setelah refresh
- `lastActivityAt` harus update

### 6. Manual Test Update

Test apakah update bisa dilakukan manual:

```sql
-- Test update manual
UPDATE "sys_User"
SET "hashedRefreshToken" = 'test_manual_' || NOW()::text
WHERE id = 2;

-- Check hasil
SELECT "hashedRefreshToken" FROM "sys_User" WHERE id = 2;

-- Rollback (optional)
-- UPDATE "sys_User" SET "hashedRefreshToken" = 'old_value' WHERE id = 2;
```

**Jika manual update tidak bekerja:**
- Ada masalah dengan database permissions
- Ada constraint atau trigger yang block update

### 7. Check Prisma Schema

Verify field name di schema:

```prisma
model sys_User {
  id                Int       @id @default(autoincrement())
  hashedRefreshToken String?  @db.VarChar(255)
  updatedAt         DateTime  @updatedAt
  // ...
}
```

**Verify:**
- Field name: `hashedRefreshToken` (camelCase) atau `hashed_refresh_token` (snake_case)?
- Check apakah Prisma menggunakan nama yang benar

### 8. Check Case Sensitivity

PostgreSQL case-sensitive untuk quoted identifiers:

```sql
-- Coba dengan quote
SELECT "hashedRefreshToken" FROM "sys_User" WHERE id = 2;

-- Coba tanpa quote (lowercase)
SELECT hashedrefreshtoken FROM sys_user WHERE id = 2;
```

### 9. Check Transaction

Mungkin update terjadi tapi di-rollback:

```sql
-- Check transaction logs (jika ada)
-- Atau check apakah ada trigger yang rollback
```

### 10. Add More Logging

Jika masih tidak jelas, tambahkan logging lebih detail:

```typescript
// Di better-auth.service.ts, sebelum update:
console.log('[RefreshToken] About to update user:', userId);
console.log('[RefreshToken] New hash:', hashedRefreshToken);

// Setelah update:
const checkUser = await this.prisma.sys_User.findUnique({
  where: { id: userId },
  select: { hashedRefreshToken: true, updatedAt: true }
});
console.log('[RefreshToken] After update - hash:', checkUser.hashedRefreshToken);
console.log('[RefreshToken] After update - updatedAt:', checkUser.updatedAt);
```

## Kemungkinan Masalah

### 1. Refresh Endpoint Tidak Dipanggil
**Symptoms:** Tidak ada logs di server
**Solution:** 
- Verify request benar-benar terkirim
- Check network tab di browser
- Check apakah guard block request

### 2. Update Terjadi Tapi Tidak Terlihat
**Symptoms:** Logs muncul tapi query tidak update
**Solution:**
- Check apakah menggunakan connection yang berbeda
- Check apakah ada transaction isolation issue
- Try `SELECT ... FOR UPDATE` untuk lock row

### 3. Field Name Mismatch
**Symptoms:** Update tidak error tapi tidak terjadi
**Solution:**
- Check Prisma schema
- Check database schema
- Verify field name exact match

### 4. Transaction Rollback
**Symptoms:** Update terjadi tapi di-rollback
**Solution:**
- Check error logs
- Check database constraints
- Check triggers

### 5. Multiple Sessions
**Symptoms:** Update terjadi di session lain
**Solution:**
- Check semua sessions untuk user_id = 2
- Verify session yang digunakan

## Next Steps

1. **Run test script** dan check semua logs
2. **Check database** sebelum dan sesudah refresh
3. **Verify field name** di Prisma schema
4. **Check server logs** untuk error
5. **Test manual update** di database

Jika masih tidak berubah setelah semua ini, kemungkinan:
- Update terjadi di user/session yang berbeda
- Ada masalah dengan Prisma client
- Ada trigger atau constraint yang block update

