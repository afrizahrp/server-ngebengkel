# 🔑 Environment Variables Setup Guide

## Environment Variables yang Diperlukan

Untuk menjalankan aplikasi dengan Better Auth, Anda **WAJIB** mengatur environment variables berikut:

### File: `.env`

Buat atau update file `.env` di root project dengan isi sebagai berikut:

```env
# ============================================================================
# BETTER AUTH CONFIGURATION
# ============================================================================
# Secret key untuk Better Auth (WAJIB - minimal 32 karakter)
# Generate dengan: openssl rand -base64 32
BETTER_AUTH_SECRET=your-better-auth-secret-key-min-32-characters-here

# ============================================================================
# JWT CONFIGURATION
# ============================================================================
# Secret key untuk JWT Access Token
# Generate dengan: openssl rand -base64 32
JWT_SECRET=your-jwt-secret-key-here

# JWT Access Token TTL (Time To Live) dalam detik
# 3600 = 1 jam
JWT_ACCESS_TOKEN_TTL=3600

# JWT Audience (siapa yang boleh menggunakan token)
JWT_AUDIENCE=localhost:3001

# JWT Issuer (siapa yang mengeluarkan token)
JWT_ISSUER=localhost:3001

# ============================================================================
# REFRESH TOKEN CONFIGURATION
# ============================================================================
# Secret key untuk Refresh Token
# Generate dengan: openssl rand -base64 32
REFRESH_SECRET=your-refresh-secret-key-here

# Refresh Token TTL (Time To Live) dalam detik
# 604800 = 7 hari
REFRESH_TOKEN_TTL=604800

# ============================================================================
# GOOGLE OAUTH CONFIGURATION (Optional)
# ============================================================================
# Dapatkan dari: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# ============================================================================
# FRONTEND & CORS CONFIGURATION
# ============================================================================
# URL Frontend untuk redirect setelah OAuth
FRONTEND_URL=http://localhost:3000

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
# PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# ============================================================================
# SERVER CONFIGURATION
# ============================================================================
PORT=3001
NODE_ENV=development
```

## 🔐 Cara Generate Secret Keys

### Menggunakan OpenSSL (Recommended)

```bash
# Generate Better Auth Secret
openssl rand -base64 32

# Generate JWT Secret
openssl rand -base64 32

# Generate Refresh Secret
openssl rand -base64 32
```

### Menggunakan Node.js

```javascript
// Jalankan di Node.js REPL atau file
require('crypto').randomBytes(32).toString('base64');
```

### Menggunakan Online Tool

- https://generate-secret.vercel.app/32
- https://www.uuidgenerator.net/

⚠️ **PENTING**: Jangan pernah share atau commit secret keys ke Git!

## 📋 Checklist Setup

Sebelum menjalankan aplikasi, pastikan:

- [ ] File `.env` sudah dibuat di root project
- [ ] `BETTER_AUTH_SECRET` sudah di-set (minimal 32 karakter)
- [ ] `JWT_SECRET` sudah di-set
- [ ] `REFRESH_SECRET` sudah di-set
- [ ] `DATABASE_URL` sudah di-set dengan benar
- [ ] `JWT_ACCESS_TOKEN_TTL` dan `REFRESH_TOKEN_TTL` sudah di-set
- [ ] `FRONTEND_URL` sudah di-set (untuk OAuth redirect)
- [ ] File `.env` **TIDAK** di-commit ke Git (pastikan ada di `.gitignore`)

## 🔒 Security Best Practices

### 1. Secret Key Requirements

- **Minimal 32 karakter** untuk semua secret keys
- Gunakan karakter random yang kuat
- Berbeda untuk setiap environment (development, staging, production)

### 2. Environment-Specific Configuration

**Development:**

```env
BETTER_AUTH_SECRET=dev-secret-min-32-chars-abc123...
JWT_SECRET=dev-jwt-secret-min-32-chars-xyz789...
```

**Production:**

```env
BETTER_AUTH_SECRET=prod-secret-COMPLETELY-DIFFERENT-KEY...
JWT_SECRET=prod-jwt-COMPLETELY-DIFFERENT-KEY...
```

### 3. Token Expiration

**Recommended Values:**

- **Access Token (JWT_ACCESS_TOKEN_TTL)**:

  - Development: 3600 (1 jam)
  - Production: 900-1800 (15-30 menit)

- **Refresh Token (REFRESH_TOKEN_TTL)**:
  - Development: 604800 (7 hari)
  - Production: 2592000 (30 hari)

### 4. Git Security

Pastikan `.env` ada di `.gitignore`:

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

## 🧪 Verifikasi Setup

Setelah setup, verifikasi dengan:

1. **Start server:**

   ```bash
   npm run start:dev
   ```

2. **Check logs:**

   - Tidak ada error "environment variable not found"
   - Server start di port yang benar

3. **Test endpoint:**

   ```bash
   curl http://localhost:3001/auth/protected
   ```

   Should return: `401 Unauthorized` (ini benar, karena butuh token)

## ❓ Troubleshooting

### Error: "secret is required"

**Solusi:**

- Pastikan `BETTER_AUTH_SECRET` sudah di-set di `.env`
- Minimal 32 karakter
- Restart server setelah update `.env`

### Error: "Invalid token"

**Solusi:**

- Pastikan `JWT_SECRET` sama dengan yang digunakan saat generate token
- Jika baru ganti secret, user perlu login ulang

### Server tidak bisa connect ke database

**Solusi:**

- Pastikan `DATABASE_URL` format benar
- Check apakah PostgreSQL sudah running
- Verifikasi username, password, dan database name

### Environment variables tidak terbaca

**Solusi:**

- Pastikan file bernama `.env` (bukan `.env.txt` atau lainnya)
- File `.env` harus di root project (sejajar dengan `package.json`)
- Restart server setelah update `.env`
- Check apakah ada typo di nama variable

## 📚 Referensi

- Better Auth Docs: https://www.better-auth.com/docs
- NestJS Config Module: https://docs.nestjs.com/techniques/configuration
- JWT Best Practices: https://tools.ietf.org/html/rfc8725


