# 🔐 Two-Factor Authentication (2FA) Guide

Panduan lengkap untuk menggunakan fitur Two-Factor Authentication Email-based OTP pada sistem Ngebengkel.

## 📋 Daftar Isi

- [Apa itu 2FA?](#apa-itu-2fa)
- [Cara Kerja](#cara-kerja)
- [API Endpoints](#api-endpoints)
- [Testing Flow](#testing-flow)
- [Frontend Integration](#frontend-integration)
- [Security Best Practices](#security-best-practices)

---

## 🔒 Apa itu 2FA?

**Two-Factor Authentication (2FA)** adalah security layer tambahan yang memerlukan **dua langkah verifikasi** saat login:

1. **Something you know** → Email + Password
2. **Something you have** → OTP Code dari email

### Perbedaan dengan Email Verification

| Feature       | Email Verification     | 2FA                         |
| ------------- | ---------------------- | --------------------------- |
| **Tujuan**    | Verify email valid     | Extra security layer        |
| **Frekuensi** | Sekali (saat register) | Setiap login (jika enabled) |
| **Mandatory** | Ya (required)          | Tidak (optional)            |
| **Kode**      | Link verification      | 6-digit OTP                 |
| **Expiry**    | 1 jam                  | 10 menit                    |

### Fitur 2FA di Ngebengkel

- ✅ **Optional Feature** - User bisa enable/disable kapan saja
- ✅ **Email-based OTP** - Menggunakan infrastruktur email yang sudah ada
- ✅ **6-digit Code** - Easy to type, secure enough
- ✅ **10 minutes expiry** - Balance antara security dan UX
- ✅ **One-time use** - Token langsung expired setelah digunakan
- ✅ **Auto cleanup** - Expired tokens otomatis dihapus

---

## 🔄 Cara Kerja

### Normal Login (tanpa 2FA):

```
1. User input email + password
2. System validate credentials
3. Return accessToken
4. User logged in ✅
```

### Login dengan 2FA Enabled:

```
1. User input email + password
2. System validate credentials
3. System check: 2FA enabled?
   └─ Yes → Generate & kirim OTP ke email
4. Return: requires2FA=true, userId
5. User check email → dapat 6-digit OTP
6. User input OTP code
7. System validate OTP
8. Return accessToken
9. User logged in ✅
```

---

## 🌐 API Endpoints

### 1. Enable 2FA

**Endpoint:** `POST /auth/enable-2fa`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "message": "Two-factor authentication enabled successfully",
  "twoFactorEnabled": true
}
```

**Notes:**

- ✅ User harus **login** dulu
- ✅ Protected endpoint (perlu accessToken)
- ✅ Setelah enabled, login berikutnya akan memerlukan OTP

---

### 2. Disable 2FA

**Endpoint:** `POST /auth/disable-2fa`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "message": "Two-factor authentication disabled successfully",
  "twoFactorEnabled": false
}
```

**Notes:**

- ✅ User harus **login** dulu
- ✅ Semua unused OTP tokens akan dihapus
- ✅ Login berikutnya akan normal (tidak perlu OTP)

---

### 3. Check 2FA Status

**Endpoint:** `GET /auth/2fa-status`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "userId": 123,
  "email": "user@example.com",
  "twoFactorEnabled": true
}
```

**Notes:**

- ✅ Untuk check apakah user punya 2FA enabled
- ✅ Useful untuk Frontend conditional rendering

---

### 4. Login (Modified untuk 2FA)

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceName": "Chrome Desktop"
}
```

**Response A - 2FA TIDAK Enabled** (Normal Login):

```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "user@example.com",
    "company": { ... }
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "sessionId": "ckm1x...",
  "message": "Login successful"
}
```

**Response B - 2FA Enabled** (Requires OTP):

```json
{
  "requires2FA": true,
  "userId": 123,
  "message": "Two-factor authentication required. Please check your email for the OTP code."
}
```

**Notes:**

- ✅ System akan **otomatis detect** apakah user punya 2FA enabled
- ✅ Jika 2FA enabled → kirim OTP ke email + return requires2FA=true
- ✅ Frontend harus handle 2 jenis response berbeda

---

### 5. Verify OTP (Complete Login)

**Endpoint:** `POST /auth/verify-2fa`

**Request:**

```json
{
  "userId": 123,
  "otpCode": "123456",
  "deviceName": "Chrome Desktop"
}
```

**Success Response:**

```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "user@example.com",
    "company": { ... }
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "sessionId": "ckm1x...",
  "message": "Login successful with 2FA"
}
```

**Error Responses:**

**Invalid OTP:**

```json
{
  "statusCode": 401,
  "message": "Invalid or expired OTP code"
}
```

**Missing Fields:**

```json
{
  "statusCode": 401,
  "message": "User ID and OTP code are required"
}
```

---

## 🧪 Testing Flow

### Test 1: Enable 2FA

```bash
# Step 1: Login normal
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: Copy accessToken

# Step 2: Enable 2FA
curl -X POST http://localhost:4000/auth/enable-2fa \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Response:
# { "message": "Two-factor authentication enabled successfully", "twoFactorEnabled": true }
```

---

### Test 2: Login dengan 2FA

```bash
# Step 1: Login (akan dapat requires2FA=true)
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "requires2FA": true,
#   "userId": 123,
#   "message": "Two-factor authentication required..."
# }

# Step 2: Check email untuk OTP code (6-digit)

# Step 3: Verify OTP
curl -X POST http://localhost:4000/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "otpCode": "123456"
  }'

# Response: accessToken + user info
```

---

### Test 3: Disable 2FA

```bash
# Disable 2FA
curl -X POST http://localhost:4000/auth/disable-2fa \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Response:
# { "message": "Two-factor authentication disabled successfully", "twoFactorEnabled": false }

# Login lagi - sekarang normal (tanpa OTP)
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: Langsung dapat accessToken
```

---

## 💻 Frontend Integration

### React/Next.js Example

```typescript
// 1. Login Handler
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check if 2FA required
    if (data.requires2FA) {
      // Redirect ke OTP page
      router.push(`/auth/verify-otp?userId=${data.userId}`);
    } else {
      // Normal login - save token
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// 2. OTP Verification Handler
const handleVerifyOTP = async (userId: number, otpCode: string) => {
  try {
    const response = await fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otpCode }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token dan redirect
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/dashboard');
    } else {
      setError('Invalid OTP code');
    }
  } catch (error) {
    console.error('OTP verification failed:', error);
  }
};

// 3. Enable/Disable 2FA Handler
const handleToggle2FA = async (enable: boolean) => {
  const endpoint = enable ? '/api/auth/enable-2fa' : '/api/auth/disable-2fa';
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setTwoFactorEnabled(data.twoFactorEnabled);
    toast.success(data.message);
  } catch (error) {
    console.error('Failed to toggle 2FA:', error);
  }
};
```

### UI Components

**Login Page:**

```tsx
// pages/login.tsx
<form onSubmit={handleLogin}>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button>Login</button>
</form>
```

**OTP Verification Page:**

```tsx
// pages/verify-otp.tsx
<div>
  <h1>Enter OTP Code</h1>
  <p>We sent a 6-digit code to your email</p>
  <input
    type="text"
    maxLength={6}
    placeholder="000000"
    onChange={(e) => setOtpCode(e.target.value)}
  />
  <button onClick={() => handleVerifyOTP(userId, otpCode)}>Verify</button>
  <p>Code expires in 10 minutes</p>
</div>
```

**Settings Page (Enable/Disable 2FA):**

```tsx
// pages/settings/security.tsx
<div>
  <h2>Two-Factor Authentication</h2>
  <p>Add an extra layer of security to your account</p>

  <label>
    <input
      type="checkbox"
      checked={twoFactorEnabled}
      onChange={(e) => handleToggle2FA(e.target.checked)}
    />
    Enable 2FA via Email
  </label>

  {twoFactorEnabled && (
    <p className="success">
      ✅ 2FA is enabled. You'll receive an OTP code when logging in.
    </p>
  )}
</div>
```

---

## 🔒 Security Best Practices

### 1. OTP Code Generation

- ✅ **6 digits** - Balance security dan UX
- ✅ **Cryptographically secure** - Menggunakan `crypto.randomInt()`
- ✅ **No patterns** - Fully random numbers

### 2. Token Expiry

- ✅ **10 minutes** - Cukup waktu untuk user, tapi tidak terlalu lama
- ✅ **One-time use** - Token langsung di-mark sebagai `used`
- ✅ **Auto cleanup** - Expired tokens dihapus otomatis

### 3. Rate Limiting (Recommended untuk Production)

```typescript
// Example menggunakan express-rate-limit
import rateLimit from 'express-rate-limit';

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit 5 attempts per 15 minutes
  message: 'Too many OTP attempts, please try again later',
});

app.post('/auth/verify-2fa', otpLimiter, verifyOtpHandler);
```

### 4. Monitoring & Logging

- ✅ Log setiap OTP generation
- ✅ Log setiap verification attempt (success/fail)
- ✅ Alert jika ada unusual activity (multiple failed attempts)

### 5. User Experience

- ✅ **Clear messaging** - "Check your email for OTP code"
- ✅ **Countdown timer** - Show expiry countdown di frontend
- ✅ **Resend option** - Allow user request new OTP (dengan rate limiting)
- ✅ **Remember device** - Optional feature untuk trust devices

---

## 📊 Database Schema

```prisma
model sys_User {
  // ... existing fields
  twoFactorEnabled   Boolean  @default(false)
  twoFactorTokens    sys_TwoFactorToken[]
}

model sys_TwoFactorToken {
  id        String   @id @default(cuid())
  user_id   Int      @db.SmallInt
  code      String   @db.VarChar(6)      // 6-digit OTP
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      sys_User @relation(...)

  @@index([user_id])
  @@index([code])
}
```

---

## 🐛 Troubleshooting

### Email OTP tidak diterima

**Check:**

1. Email masuk spam folder
2. SMTP configuration benar
3. Email service working (check server logs)

**Solution:**

- Whitelist sender email
- Check console logs untuk error
- Verify email deliverability

---

### OTP Code Invalid

**Kemungkinan:**

- OTP sudah expired (> 10 menit)
- OTP sudah digunakan
- User salah ketik code

**Solution:**

- Request new OTP (implement resend feature)
- Check expiry time di frontend
- Add input validation di frontend

---

### 2FA Status tidak update

**Check:**

- accessToken masih valid
- Request header benar
- Database update berhasil

---

## 🚀 Production Recommendations

### 1. Add Resend OTP Feature

```typescript
@Public()
@Post('resend-2fa-otp')
async resendOtp(@Body() body: { userId: number }) {
  await this.twoFactorService.generateAndSendOtp(body.userId);
  return { message: 'New OTP sent to your email' };
}
```

### 2. Add Rate Limiting

- Limit OTP generation: 3 per hour per user
- Limit verification attempts: 5 per OTP

### 3. Add Analytics

- Track 2FA adoption rate
- Monitor failed OTP attempts
- Alert pada suspicious activity

### 4. Consider Alternative Methods

- **Authenticator App (TOTP)** - More secure, no email needed
- **SMS OTP** - More reliable delivery
- **Backup Codes** - For emergency access

---

## ✅ Checklist untuk Testing

- [ ] Enable 2FA berhasil
- [ ] Login dengan 2FA → dapat OTP di email
- [ ] OTP code valid → login berhasil
- [ ] OTP code invalid → error message
- [ ] OTP expired → error message
- [ ] Disable 2FA berhasil
- [ ] Login setelah disable → normal (no OTP)
- [ ] Check 2FA status endpoint working
- [ ] Email template tampil dengan baik
- [ ] OTP masuk inbox (bukan spam)

---

**Need Help?** Check `test-2fa.http` untuk contoh request lengkap!

---

**Last Updated:** October 15, 2025
