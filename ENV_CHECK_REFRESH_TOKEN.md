# Environment Variables Check untuk Refresh Token

## ✅ Konfigurasi Anda (Sudah Benar)

```env
JWT_SECRET=c8FZzkImTp4JZlC01j 
JWT_EXPIRES=5m
REFRESH_JWT_SECRET=oa2CrumCxV 
REFRESH_JWT_EXPIRES=3d
```

## Verifikasi

### ✅ 1. JWT_SECRET
- **Required:** ✅ Ya
- **Digunakan di:** `jwt.config.ts`
- **Status:** ✅ Sudah di-set
- **Note:** Secret key untuk access token

### ✅ 2. JWT_EXPIRES
- **Required:** ✅ Ya (dengan default '1d')
- **Digunakan di:** `jwt.config.ts`
- **Status:** ✅ Sudah di-set (`5m` = 5 menit)
- **Note:** 
  - ✅ **Bagus untuk testing** - access token akan expire cepat, jadi bisa test auto-refresh
  - ⚠️ **Production:** Biasanya lebih lama (1d, 7d, atau 30d)

### ✅ 3. REFRESH_JWT_SECRET
- **Required:** ✅ Ya
- **Digunakan di:** `refresh.config.ts`
- **Status:** ✅ Sudah di-set
- **Note:** Secret key untuk refresh token (harus berbeda dari JWT_SECRET)

### ✅ 4. REFRESH_JWT_EXPIRES
- **Required:** ✅ Ya (dengan default '7d')
- **Digunakan di:** `refresh.config.ts`
- **Status:** ✅ Sudah di-set (`3d` = 3 hari)
- **Note:** 
  - ✅ **Bagus untuk testing** - refresh token bertahan 3 hari
  - ✅ **Production:** Biasanya 7-30 hari

## Konfigurasi Lengkap untuk Testing

### Minimal (Sudah Anda Miliki)
```env
# Access Token
JWT_SECRET=c8FZzkImTp4JZlC01j 
JWT_EXPIRES=5m

# Refresh Token
REFRESH_JWT_SECRET=oa2CrumCxV 
REFRESH_JWT_EXPIRES=3d
```

### Recommended untuk Testing
```env
# Access Token (expire cepat untuk test refresh)
JWT_SECRET=c8FZzkImTp4JZlC01j 
JWT_EXPIRES=5m                    # 5 menit - bagus untuk test auto-refresh

# Refresh Token (lebih lama)
REFRESH_JWT_SECRET=oa2CrumCxV 
REFRESH_JWT_EXPIRES=3d            # 3 hari - cukup untuk testing

# Database (jika belum ada)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Server
PORT=4000
NODE_ENV=development
```

## Testing Scenarios dengan Konfigurasi Ini

### ✅ Scenario 1: Test Access Token Expiry
- **Access token expires:** 5 menit
- **Action:** Tunggu 5 menit, lalu panggil protected endpoint
- **Expected:** Auto-refresh menggunakan refresh token

### ✅ Scenario 2: Test Refresh Token
- **Refresh token expires:** 3 hari
- **Action:** Panggil `/api/auth/refresh` dengan refresh token
- **Expected:** Dapat access token + refresh token baru

### ✅ Scenario 3: Test Refresh Token Expiry
- **Action:** Tunggu 3 hari (atau set expired manual), lalu refresh
- **Expected:** Error "Invalid refresh token", harus login ulang

## ⚠️ Catatan Penting

### 1. Secret Keys
- ✅ `JWT_SECRET` dan `REFRESH_JWT_SECRET` harus **berbeda**
- ✅ Harus **strong** (minimal 32 karakter untuk production)
- ⚠️ **Jangan commit** ke git (gunakan `.env.example`)

### 2. Expiry Times
- ✅ `JWT_EXPIRES=5m` bagus untuk testing (bisa cepat test expiry)
- ⚠️ Untuk production, biasanya lebih lama (1d, 7d, atau 30d)
- ✅ `REFRESH_JWT_EXPIRES=3d` reasonable untuk testing

### 3. Format Expiry
Format yang didukung:
- `5m` = 5 menit ✅
- `1h` = 1 jam
- `1d` = 1 hari ✅
- `7d` = 7 hari
- `30d` = 30 hari
- Atau dalam seconds: `300` = 300 detik

## Checklist

- [x] `JWT_SECRET` sudah di-set
- [x] `JWT_EXPIRES` sudah di-set (5m - bagus untuk testing)
- [x] `REFRESH_JWT_SECRET` sudah di-set
- [x] `REFRESH_JWT_EXPIRES` sudah di-set (3d - reasonable)
- [x] Secret keys berbeda (JWT_SECRET ≠ REFRESH_JWT_SECRET)
- [ ] Database connection sudah di-set (jika belum)
- [ ] Server port sudah di-set (default 4000)

## Quick Test

Setelah set .env, test dengan:

```bash
# 1. Restart server
npm run start:dev

# 2. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 3. Check token expiry
# Decode JWT di jwt.io atau:
echo "YOUR_ACCESS_TOKEN" | cut -d. -f2 | base64 -d | jq .exp
# Compare dengan: date +%s (current timestamp)

# 4. Test refresh
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "X-Refresh-Token: YOUR_REFRESH_TOKEN"
```

## Troubleshooting

### Issue: "Invalid refresh token"
**Possible causes:**
- `REFRESH_JWT_SECRET` salah atau tidak match
- Refresh token sudah expired
- Refresh token sudah di-rotate

**Solution:**
- Verify `REFRESH_JWT_SECRET` di .env sama dengan yang digunakan saat generate token
- Check token expiry: `jwt.io` atau decode JWT

### Issue: Access token tidak expire
**Possible causes:**
- `JWT_EXPIRES` tidak ter-load
- Server tidak restart setelah update .env

**Solution:**
- Restart server
- Verify `.env` file ter-load (check logs)
- Verify format `JWT_EXPIRES` benar (5m, 1d, dll)

### Issue: "Secret key is missing"
**Possible causes:**
- Env variable tidak ter-load
- Typo di nama variable

**Solution:**
- Check `.env` file ada di root project
- Verify nama variable exact match (case-sensitive)
- Restart server setelah update .env

## Kesimpulan

✅ **Konfigurasi Anda sudah benar untuk testing refresh token!**

- Access token expire dalam 5 menit (bagus untuk test expiry)
- Refresh token expire dalam 3 hari (reasonable untuk testing)
- Secret keys sudah di-set dan berbeda

**Siap untuk testing!** 🚀

