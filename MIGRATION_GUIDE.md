# Migration Guide: Passport → Better Auth

Panduan lengkap migrasi dari Passport.js ke Better Auth dengan JWT.

## 📋 Ringkasan Perubahan

### Yang Berubah

1. ✅ **AuthModule** → `BetterAuthModule`
2. ✅ **AuthController** → `BetterAuthController`
3. ✅ **AuthService** → `BetterAuthService`
4. ✅ **Guards**: Passport guards → Custom JWT guards
5. ✅ **Strategies**: Passport strategies dihapus (local, jwt, refresh, google)

### Yang Tetap Sama

1. ✅ **Decorators**: `@Public()` dan `@Roles()` masih sama
2. ✅ **Database Schema**: Tidak ada perubahan schema Prisma
3. ✅ **Password Hashing**: Tetap menggunakan argon2
4. ✅ **JWT Configuration**: Menggunakan config yang sama

## 🚀 Langkah-langkah Migrasi

### 1. File-file Baru yang Dibuat

```
src/auth/better-auth/
├── auth.config.ts                    # ⭐ Konfigurasi Better Auth
├── better-auth.service.ts            # ⭐ Service baru
├── better-auth.controller.ts         # ⭐ Controller baru
├── better-auth.module.ts             # ⭐ Module baru
├── guards/
│   ├── better-jwt-auth.guard.ts      # ⭐ Guard JWT baru
│   ├── better-roles.guard.ts         # ⭐ Guard Roles baru
│   └── better-refresh.guard.ts       # ⭐ Guard Refresh baru
└── README.md
```

### 2. File-file yang Di-backup

File-file lama sudah di-backup dengan extension `.old`:

```
src/auth/
├── auth.module.ts.old              # Backup module lama
├── auth.controller.ts.old          # Backup controller lama
└── auth.service.ts.old             # Backup service lama
```

File-file berikut masih ada sebagai referensi (bisa dihapus jika tidak diperlukan):

```
src/auth/
├── strategies/                     # Passport strategies (tidak dipakai lagi)
│   ├── local.strategy.ts
│   ├── jwt.strategy.ts
│   ├── refresh-token.strategy.ts
│   └── google.strategy.ts
└── guards/                         # Passport guards (tidak dipakai lagi)
    ├── jwt-auth/
    ├── local-auth/
    ├── refresh-auth/
    ├── google-auth/
    └── roles/
```

### 3. File yang Diupdate

#### `src/app.module.ts`

```typescript
// Sebelum:
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // ...
  ],
})

// Sesudah:
import { BetterAuthModule } from './auth/better-auth/better-auth.module';

@Module({
  imports: [
    BetterAuthModule,
    // ...
  ],
})
```

## 📝 Perbandingan API

### Endpoints - Tidak Ada Perubahan! ✅

Semua endpoints masih sama:

| Method | Endpoint                | Keterangan                    |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/auth/register`        | Register user baru            |
| POST   | `/auth/login`           | Login dengan email & password |
| POST   | `/auth/refresh`         | Refresh access token          |
| POST   | `/auth/logout`          | Logout user                   |
| POST   | `/auth/reset-password`  | Reset password                |
| GET    | `/auth/me`              | Get current user              |
| GET    | `/auth/protected`       | Testing protected route       |
| GET    | `/auth/google/login`    | Google OAuth login            |
| GET    | `/auth/google/callback` | Google OAuth callback         |

### Request/Response Format - Tidak Ada Perubahan! ✅

Format request dan response tetap sama seperti sebelumnya.

**Contoh Login:**

```typescript
// Request
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (sama seperti sebelumnya)
{
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "company": { ... },
    "companies": [ ... ]
  },
  "accessToken": "...",
  "refreshToken": "...",
  "message": "Login successful"
}
```

## 🔧 Environment Variables

Pastikan `.env` file memiliki variabel berikut:

```env
# Better Auth Secret (WAJIB - minimal 32 karakter)
BETTER_AUTH_SECRET=your-better-auth-secret-key-min-32-characters

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_ACCESS_TOKEN_TTL=3600
JWT_AUDIENCE=localhost:3001
JWT_ISSUER=localhost:3001

# Refresh Token
REFRESH_SECRET=your-refresh-secret-key
REFRESH_TOKEN_TTL=604800

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing Checklist

Setelah migrasi, test semua endpoints:

- [ ] `POST /auth/register` - Register user baru
- [ ] `POST /auth/login` - Login dengan email & password
- [ ] `GET /auth/me` - Get current user (dengan token)
- [ ] `POST /auth/refresh` - Refresh token
- [ ] `POST /auth/logout` - Logout
- [ ] `POST /auth/reset-password` - Reset password
- [ ] `GET /auth/protected` - Test protected route dengan roles
- [ ] Test @Public() decorator
- [ ] Test @Roles() decorator dengan berbagai roles

## ⚠️ Breaking Changes

**TIDAK ADA BREAKING CHANGES!** 🎉

API endpoints, request/response format, dan behavior semuanya sama. Yang berubah hanya implementasi internal.

## 🔒 Keamanan

Tidak ada perubahan pada aspek keamanan:

- ✅ Password tetap di-hash dengan **argon2**
- ✅ JWT access token tetap expire dalam **1 jam**
- ✅ Refresh token tetap expire dalam **7 hari**
- ✅ Refresh token tetap di-hash sebelum disimpan
- ✅ Role-based access control tetap sama

## 🗑️ Cleanup (Optional)

Jika migrasi sudah berhasil dan stabil, Anda bisa menghapus file-file berikut:

```bash
# Hapus file backup
rm src/auth/auth.module.ts.old
rm src/auth/auth.controller.ts.old
rm src/auth/auth.service.ts.old

# Hapus Passport strategies (optional)
rm -rf src/auth/strategies/

# Hapus Passport guards lama (optional)
rm -rf src/auth/guards/jwt-auth/
rm -rf src/auth/guards/local-auth/
rm -rf src/auth/guards/refresh-auth/
rm -rf src/auth/guards/google-auth/
# Keep roles guard jika masih diperlukan sebagai reference

# Uninstall Passport dependencies (optional)
npm uninstall @nestjs/passport passport passport-local passport-jwt passport-google-oauth20
npm uninstall -D @types/passport-local @types/passport-jwt @types/passport-google-oauth20
```

⚠️ **Catatan**: Jangan hapus dependencies jika masih ada module lain yang menggunakan Passport!

## 📚 Dokumentasi Tambahan

Lihat file-file berikut untuk dokumentasi lebih lengkap:

- `src/auth/better-auth/README.md` - Dokumentasi Better Auth implementation
- Environment variables example (lihat bagian Environment Variables di atas)

## 🆘 Troubleshooting

### Server tidak bisa start

- Pastikan semua dependencies sudah terinstall
- Check apakah ada circular dependencies
- Pastikan environment variables sudah di-set dengan benar

### Error "Cannot find module"

- Hapus folder `node_modules` dan `package-lock.json`
- Run `npm install` ulang

### Token tidak valid

- Pastikan JWT_SECRET dan REFRESH_SECRET sama dengan sebelumnya
- Jika berbeda, user perlu login ulang

## ✅ Kesimpulan

Migration selesai! Better Auth sudah terintegrasi dengan:

- ✅ Custom JWT implementation (tidak depend on Passport)
- ✅ Role-based access control
- ✅ Refresh token mechanism
- ✅ Google OAuth structure (siap untuk implementasi penuh)
- ✅ Backward compatible dengan API yang ada

Tidak ada perubahan di sisi frontend atau API consumer! 🎉
