# 🔐 Setup Google OAuth2 untuk Better Auth

Panduan lengkap untuk mengimplementasikan Google OAuth2 di aplikasi NestJS dengan Better Auth.

---

## 📋 Prerequisites

- Akun Google (Gmail)
- Project NestJS sudah berjalan
- Database Prisma sudah tersetup

---

## 🚀 Step 1: Setup Google Cloud Console

### 1.1 Buat Project Baru

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a Project** → **New Project**
3. Nama project: `ngebengkel-oauth` (atau nama lain)
4. Klik **Create**

### 1.2 Enable Google+ API

1. Di sidebar, pilih **APIs & Services** → **Library**
2. Search: `Google+ API`
3. Klik **Google+ API**
4. Klik **Enable**

### 1.3 Configure OAuth Consent Screen

1. Di sidebar, pilih **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk testing)
3. Klik **Create**

**Isi form:**

- **App name**: `NgebEngkel`
- **User support email**: email Anda
- **Developer contact**: email Anda
- Klik **Save and Continue**

**Scopes:**

- Klik **Add or Remove Scopes**
- Pilih:
  - `userinfo.email`
  - `userinfo.profile`
- Klik **Update** → **Save and Continue**

**Test users** (untuk development):

- Klik **Add Users**
- Tambahkan email yang akan digunakan untuk testing
- Klik **Save and Continue**

### 1.4 Create OAuth Credentials

1. Di sidebar, pilih **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. **Application type**: `Web application`
4. **Name**: `NgebEngkel Web Client`

**Authorized JavaScript origins:**

```
http://localhost:3001
http://localhost:3000
```

**Authorized redirect URIs:**

```
http://localhost:3001/auth/google/callback
```

5. Klik **Create**
6. **SIMPAN** `Client ID` dan `Client Secret` yang muncul

---

## ⚙️ Step 2: Konfigurasi Environment Variables

Buat file `.env` di root project (jika belum ada) dan tambahkan:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ngebengkel?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES="1h"

# Refresh Token Configuration
REFRESH_JWT_SECRET="your-super-secret-refresh-token-key-change-this-in-production"
REFRESH_JWT_EXPIRES="7d"

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID="123456789-xxxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=3001
NODE_ENV="development"
```

**⚠️ PENTING:**

- Ganti `GOOGLE_CLIENT_ID` dengan Client ID dari Google Console
- Ganti `GOOGLE_CLIENT_SECRET` dengan Client Secret dari Google Console
- Pastikan `GOOGLE_CALLBACK_URL` sama dengan yang didaftarkan di Google Console

---

## 🧪 Step 3: Testing OAuth Flow

### 3.1 Flow OAuth2

```
┌─────────────────────────────────────────────────────┐
│ 1. User klik "Login with Google"                    │
│    Frontend redirect ke: /auth/google/login         │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 2. Backend redirect ke Google OAuth URL             │
│    User login di halaman Google                     │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 3. Google redirect kembali dengan authorization code│
│    ke: /auth/google/callback?code=xxx               │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 4. Backend exchange code → access token             │
│    Ambil user info dari Google                      │
│    Login/Register user di database                  │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 5. Redirect ke frontend dengan JWT tokens           │
│    Frontend simpan tokens & redirect ke dashboard   │
└─────────────────────────────────────────────────────┘
```

### 3.2 Test dengan Browser

**Method 1: Direct Browser Test**

1. Start server:

```bash
npm run start:dev
```

2. Buka browser dan akses:

```
http://localhost:3001/auth/google/login
```

3. Login dengan Google account (pastikan email sudah ada di Test Users)

4. Setelah berhasil, Anda akan di-redirect ke:

```
http://localhost:3000/auth/google/callback?accessToken=xxx&refreshToken=yyy
```

5. Simpan `accessToken` untuk testing API

**Method 2: Postman/Thunder Client**

Tidak bisa digunakan langsung karena OAuth memerlukan browser flow. Tapi Anda bisa:

1. Dapatkan token dari Method 1
2. Gunakan token tersebut untuk test protected routes

### 3.3 Test Protected Routes dengan Token

Setelah mendapat `accessToken` dari OAuth:

```bash
# Test Get Profile
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test Protected Route
curl -X GET http://localhost:3001/auth/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎨 Step 4: Implementasi di Frontend

### React/Next.js Example

```typescript
// components/GoogleLoginButton.tsx
export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect ke backend OAuth endpoint
    window.location.href = 'http://localhost:3001/auth/google/login';
  };

  return (
    <button onClick={handleGoogleLogin}>
      🔐 Login with Google
    </button>
  );
};
```

```typescript
// pages/auth/google/callback.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const { accessToken, refreshToken } = router.query;

    if (accessToken && refreshToken) {
      // Simpan tokens
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);

      // Redirect ke dashboard
      router.push('/dashboard');
    }
  }, [router.query]);

  return <div>Loading...</div>;
}
```

```typescript
// pages/auth/error.tsx
import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{message || 'Unknown error occurred'}</p>
      <button onClick={() => router.push('/login')}>
        Back to Login
      </button>
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

- **JANGAN** commit `.env` ke Git
- Gunakan `.env.example` sebagai template
- Di production, gunakan secret manager (AWS Secrets Manager, Google Secret Manager, dll)

### 2. HTTPS di Production

```env
# Production .env
GOOGLE_CALLBACK_URL="https://yourdomain.com/auth/google/callback"
FRONTEND_URL="https://yourdomain.com"
```

Update Authorized redirect URIs di Google Console:

```
https://yourdomain.com/auth/google/callback
```

### 3. State Parameter (Optional - Advanced)

Untuk mencegah CSRF attacks, tambahkan state parameter:

```typescript
// controller
const state = randomBytes(16).toString('hex');
// Simpan state di session/cache
const url = `...&state=${state}`;

// Pada callback, verify state
if (req.query.state !== storedState) {
  throw new UnauthorizedException('Invalid state');
}
```

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Penyebab**: URL callback tidak sesuai dengan yang didaftarkan di Google Console

**Solusi**:

1. Cek `.env` → `GOOGLE_CALLBACK_URL`
2. Cek Google Console → Authorized redirect URIs
3. Pastikan keduanya **SAMA PERSIS** (termasuk http/https, port, path)

### Error: "invalid_client"

**Penyebab**: Client ID atau Client Secret salah

**Solusi**:

1. Cek kembali `.env` → `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`
2. Copy ulang dari Google Console

### Error: "access_denied"

**Penyebab**: User tidak ada di Test Users (saat app masih External)

**Solusi**:

1. Tambahkan email user ke Test Users di OAuth consent screen
2. Atau publish app (hati-hati, butuh verifikasi Google)

### Error: "Failed to exchange authorization code"

**Penyebab**: Authorization code sudah expired atau sudah digunakan

**Solusi**:

- Authorization code hanya bisa digunakan 1x
- Jangan refresh halaman callback
- Ulangi login dari awal

---

## 📚 API Endpoints

| Method | Endpoint                | Deskripsi              | Auth Required |
| ------ | ----------------------- | ---------------------- | ------------- |
| GET    | `/auth/google/login`    | Initiate Google OAuth  | No            |
| GET    | `/auth/google/callback` | OAuth callback handler | No            |
| GET    | `/auth/google/logout`   | Logout dari Google     | Yes           |
| GET    | `/auth/me`              | Get current user       | Yes           |
| GET    | `/auth/protected`       | Test protected route   | Yes           |

---

## ✅ Checklist Setup

- [ ] Buat project di Google Cloud Console
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth credentials
- [ ] Simpan Client ID & Secret
- [ ] Update `.env` dengan credentials
- [ ] Tambahkan test users
- [ ] Test login flow di browser
- [ ] Implementasi frontend callback handler
- [ ] Test protected routes dengan token
- [ ] Update redirect URIs untuk production

---

## 🎯 Next Steps

1. **Implementasi Logout**

   - Clear tokens dari localStorage
   - Call `/auth/logout` endpoint
   - Redirect ke login page

2. **Auto Refresh Token**

   - Implementasi axios interceptor
   - Auto refresh saat access token expired

3. **User Profile Management**

   - Update profile (nama, foto)
   - Change password (untuk non-OAuth users)

4. **Multi-Provider OAuth**
   - GitHub OAuth
   - Facebook OAuth
   - Microsoft OAuth

---

## 📞 Support

Jika ada pertanyaan atau issues:

1. Check dokumentasi NestJS: https://docs.nestjs.com
2. Check Google OAuth docs: https://developers.google.com/identity/protocols/oauth2

---

**Happy Coding! 🚀**
