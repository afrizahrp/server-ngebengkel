# 🔐 Forgot Password Implementation Guide

Implementasi lengkap **Forgot Password** dengan **Email Verification** mengikuti security best practices.

---

## ✅ Apa Yang Sudah Diimplementasikan

### **1. Database Schema** ✅

Tabel `sys_PasswordReset` untuk menyimpan reset tokens:

```prisma
model sys_PasswordReset {
  id        Int      @id @default(autoincrement())
  user_id   Int      @db.SmallInt
  token     String   @unique @db.VarChar(255)
  expiresAt DateTime
  createdAt DateTime @default(now())
  used      Boolean  @default(false)
  user      sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([user_id])
}
```

**Features:**

- ✅ Token unik (64 character hex string)
- ✅ Expiration time (1 jam)
- ✅ One-time use (flag `used`)
- ✅ Cascade delete jika user dihapus
- ✅ Indexed untuk performa

---

### **2. Backend Endpoints** ✅

#### **A. Forgot Password (Step 1)**

```typescript
POST /auth/forgot-password

Body:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Jika email terdaftar, link reset password akan dikirim ke email Anda."
}
```

**Alur:**

1. Cari user by email
2. Generate random token (32 bytes = 64 hex chars)
3. Set expiry 1 jam dari sekarang
4. Hapus old reset tokens untuk user ini
5. Simpan token baru ke database
6. Kirim email dengan reset link
7. Return generic message (tidak reveal apakah email exist)

**Security:**

- ✅ Generic response message (tidak expose apakah email terdaftar)
- ✅ Token cryptographically secure (randomBytes)
- ✅ Auto delete old tokens (prevent abuse)

---

#### **B. Reset Password (Step 2)**

```typescript
POST /auth/reset-password

Body:
{
  "token": "abc123xyz...",
  "password": "newpassword123"
}

Response:
{
  "message": "Password berhasil direset. Silakan login dengan password baru Anda."
}
```

**Alur:**

1. Cari token di database
2. Validate token tidak expired
3. Validate token belum digunakan
4. Hash password baru
5. Update password user
6. Mark token sebagai `used`
7. Revoke semua session user (force logout everywhere)
8. Return success message

**Security:**

- ✅ Token validation (exist, not expired, not used)
- ✅ Password di-hash dengan Argon2
- ✅ One-time use token
- ✅ Auto revoke all sessions (security measure)

---

#### **C. Legacy Endpoint (Deprecated)**

```typescript
POST /auth/reset-password-legacy

Body:
{
  "email": "user@example.com",
  "password": "newpassword"
}
```

⚠️ **WARNING:** Endpoint lama yang **TIDAK AMAN** (untuk backward compatibility saja)

- ❌ Tidak ada email verification
- ❌ Siapa saja bisa reset password dengan hanya tahu email
- ⚠️ **JANGAN gunakan di production!**

---

### **3. Email Template** ✅

Template email sudah ada di `src/email/email.service.ts`:

```typescript
async sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
): Promise<void>
```

**Email Content:**

- 🎨 Beautiful HTML template dengan gradient
- 🔗 Reset password button/link
- ⏰ Warning: Link expired dalam 1 jam
- 📧 Professional design

**Example Email:**

```
Subject: Reset Password - Ngebengkel

Halo, John Doe!

Kami menerima permintaan untuk mereset password akun Anda di Ngebengkel.

Klik tombol di bawah ini untuk mereset password Anda:

[Reset Password Button]

⏱️ Link reset password ini akan kedaluwarsa dalam 1 jam.

Jika Anda tidak meminta reset password, silakan abaikan email ini
dan password Anda akan tetap aman.
```

---

### **4. Auto Cleanup** ✅

Expired tokens otomatis dihapus:

```typescript
// Di CleanupService
async cleanupExpiredPasswordResetTokens() {
  // Hapus token yang:
  // 1. Sudah expired (> 1 jam)
  // 2. Sudah used dan > 24 jam lalu
}

// Cron job: Setiap hari jam 2 pagi
@Cron(CronExpression.EVERY_DAY_AT_2AM)
async handleDailyCleanup() {
  // Auto cleanup expired password reset tokens
}
```

**Benefits:**

- ✅ Database tetap bersih
- ✅ Old tokens dihapus otomatis
- ✅ No manual intervention needed

---

## 🔄 Complete User Flow

### **Frontend Flow:**

```
1. Login Page
   ↓ User klik "Lupa Password?"

2. Forgot Password Page (/auth/forgot-password)
   ├─ Input: Email only
   └─ Submit → POST /auth/forgot-password
   ↓

3. Success Message
   └─ "Cek email Anda untuk link reset password"
   ↓

4. User Cek Email
   └─ Klik link: /auth/reset-password?token=abc123...
   ↓

5. Reset Password Page (/auth/reset-password)
   ├─ Token auto-loaded dari URL
   ├─ Input: New password only
   └─ Submit → POST /auth/reset-password
   ↓

6. Success Message
   └─ "Password berhasil direset!"
   ↓

7. Redirect to Login Page
   └─ User login dengan password baru ✅
```

### **Backend Flow:**

```
┌─────────────────────────────────────────────────┐
│ 1. POST /auth/forgot-password                   │
│    Body: { email }                              │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. Service: forgotPassword()                    │
│    ├─ Find user by email                        │
│    ├─ Generate secure token                     │
│    ├─ Set expiry (1 hour)                       │
│    ├─ Delete old tokens                         │
│    ├─ Save new token                            │
│    └─ Send email                                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. Email: sendPasswordResetEmail()              │
│    └─ Send HTML email dengan reset link         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ User klik link
                 │
┌─────────────────────────────────────────────────┐
│ 4. POST /auth/reset-password                    │
│    Body: { token, password }                    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. Service: resetPasswordWithToken()            │
│    ├─ Validate token (exist, not expired, used) │
│    ├─ Hash new password                         │
│    ├─ Update user password                      │
│    ├─ Mark token as used                        │
│    └─ Revoke all sessions                       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. Success Response                             │
│    User dapat login dengan password baru ✅      │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Setup & Migration

### **1. Run Database Migration**

```bash
# Generate Prisma client dengan schema baru
npx prisma generate

# Run migration
npx prisma migrate deploy

# Atau untuk development:
npx prisma migrate dev --name add_password_reset
```

### **2. Verify Migration**

```bash
# Check tabel sys_PasswordReset sudah terbuat
npx prisma studio

# Atau via SQL:
# SELECT * FROM sys_PasswordReset;
```

### **3. Test Endpoints**

```bash
# Build project
npm run build

# Start server
npm run start:dev

# Test endpoints (lihat test-forgot-password.http)
```

---

## 🧪 Testing

### **Manual Testing**

```bash
# 1. Request forgot password
curl -X POST http://localhost:3001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check email untuk token
# URL: http://localhost:3000/auth/reset-password?token=abc123...

# 3. Reset password dengan token
curl -X POST http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"PASTE_TOKEN_HERE",
    "password":"newpassword123"
  }'

# 4. Test login dengan password baru
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"newpassword123"
  }'
```

### **Automated Testing**

Gunakan file `test-forgot-password.http` di VS Code dengan REST Client extension.

---

## 🔒 Security Features

### **1. Token Security**

```typescript
// Cryptographically secure random token
const token = randomBytes(32).toString('hex'); // 64 characters
```

- ✅ 32 bytes = 256 bits entropy
- ✅ Hex encoding = 64 characters
- ✅ Practically impossible to guess

### **2. Time-Limited**

```typescript
// Token expires after 1 hour
const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 1);
```

- ✅ Limited time window for attack
- ✅ Old tokens auto-deleted

### **3. One-Time Use**

```typescript
// Token can only be used once
if (resetToken.used) {
  throw new UnauthorizedException('Reset token already used');
}

// Mark as used after successful reset
await prisma.sys_PasswordReset.update({
  where: { id: resetToken.id },
  data: { used: true },
});
```

- ✅ Prevent replay attacks
- ✅ Token invalid setelah digunakan

### **4. No Email Enumeration**

```typescript
// Always return generic message
if (!user) {
  return {
    message: 'Jika email terdaftar, link reset password akan dikirim...',
  };
}
```

- ✅ Attacker tidak tahu apakah email exist
- ✅ Prevent user enumeration attacks

### **5. Session Revocation**

```typescript
// Force logout from all devices after password reset
await this.sessionService.revokeAllSessions(resetToken.user_id);
```

- ✅ Invalidate all existing sessions
- ✅ Prevent unauthorized access with old sessions

---

## 📋 API Reference

### **Forgot Password**

**Endpoint:** `POST /auth/forgot-password`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "message": "Jika email terdaftar, link reset password akan dikirim ke email Anda."
}
```

**Errors:**

- `401 Unauthorized` - Email is required

---

### **Reset Password**

**Endpoint:** `POST /auth/reset-password`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "token": "abc123xyz...",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password berhasil direset. Silakan login dengan password baru Anda."
}
```

**Errors:**

- `401 Unauthorized` - Token and password are required
- `401 Unauthorized` - Invalid or expired reset token
- `401 Unauthorized` - Reset token has expired
- `401 Unauthorized` - Reset token already used

---

## 🎨 Frontend Implementation

### **Server Action (Next.js)**

```typescript
// lib/actions/auth.actions.ts
'use server';

export async function forgotPasswordAction(email: string) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: result.message || 'Gagal mengirim email reset password',
    };
  }

  return {
    success: true,
    message: result.message,
  };
}

export async function resetPasswordAction(token: string, password: string) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: result.message || 'Gagal reset password',
    };
  }

  return {
    success: true,
    message: result.message,
  };
}
```

### **Forgot Password Form**

```typescript
// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/lib/actions/auth.actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await forgotPasswordAction(email);

    if (result.success) {
      setSuccess(true);
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Cek Email Anda</h2>
        <p>
          Jika email terdaftar, kami telah mengirim link reset password ke{' '}
          <strong>{email}</strong>
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Link akan kedaluwarsa dalam 1 jam.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lupa Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset Password'}
        </button>
      </form>
    </div>
  );
}
```

### **Reset Password Form**

```typescript
// app/auth/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '@/lib/actions/auth.actions';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Token Invalid</h2>
        <p>Link reset password tidak valid atau sudah kedaluwarsa.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await resetPasswordAction(token, password);

    if (result.success) {
      alert('Password berhasil direset!');
      router.push('/auth/login');
    } else {
      setError(result.error || 'Gagal reset password');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Password Baru
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Mereset...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
```

---

## ⚙️ Configuration

### **Environment Variables**

```env
# .env
FRONTEND_URL=http://localhost:3000

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Ngebengkel
EMAIL_FROM_ADDRESS=noreply@ngebengkel.com
```

### **Customization**

**Ubah expiration time:**

```typescript
// Di better-auth.service.ts - forgotPassword()
const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 2); // 2 jam instead of 1
```

**Ubah frontend URL:**

```typescript
// Di better-auth.service.ts - forgotPassword()
const frontendUrl = process.env.FRONTEND_URL || 'https://your-domain.com';
```

---

## 🐛 Troubleshooting

### **Email tidak terkirim**

1. Check email configuration di `.env`
2. Verify email service running: Check logs
3. Test email service:
   ```bash
   curl -X POST http://localhost:3001/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@gmail.com"}'
   ```
4. Check spam folder

### **Token invalid**

1. Check token di database:
   ```sql
   SELECT * FROM sys_PasswordReset WHERE token = 'your-token';
   ```
2. Verify token tidak expired
3. Verify token belum used

### **Migration gagal**

```bash
# Reset database (development only!)
npx prisma migrate reset

# Run migration ulang
npx prisma migrate dev
```

---

## 📊 Database Queries

### **Check active reset tokens**

```sql
SELECT
  pr.id,
  pr.token,
  pr.expiresAt,
  pr.used,
  u.email,
  u.name
FROM sys_PasswordReset pr
JOIN sys_User u ON pr.user_id = u.id
WHERE pr.used = false
  AND pr.expiresAt > NOW()
ORDER BY pr.createdAt DESC;
```

### **Check expired tokens**

```sql
SELECT COUNT(*) as expired_count
FROM sys_PasswordReset
WHERE expiresAt < NOW();
```

### **Manual cleanup**

```sql
-- Delete expired tokens
DELETE FROM sys_PasswordReset
WHERE expiresAt < NOW();

-- Delete used tokens older than 24 hours
DELETE FROM sys_PasswordReset
WHERE used = true
  AND createdAt < NOW() - INTERVAL '24 hours';
```

---

## ✅ Summary

| Feature                   | Status  |
| ------------------------- | ------- |
| Database Schema           | ✅ Done |
| Forgot Password Endpoint  | ✅ Done |
| Reset Password Endpoint   | ✅ Done |
| Email Template            | ✅ Done |
| Token Validation          | ✅ Done |
| One-Time Use Token        | ✅ Done |
| Token Expiration (1 hour) | ✅ Done |
| Session Revocation        | ✅ Done |
| Auto Cleanup              | ✅ Done |
| Security Best Practices   | ✅ Done |
| Testing File              | ✅ Done |
| Documentation             | ✅ Done |

---

## 🚀 Next Steps

1. ✅ **Migration**: Run `npx prisma migrate dev`
2. ✅ **Test**: Use `test-forgot-password.http`
3. ✅ **Frontend**: Implement forgot password pages
4. ✅ **Production**: Update FRONTEND_URL in env
5. ✅ **Monitor**: Check email delivery logs

---

**Selamat! Forgot Password dengan Email Verification sudah siap digunakan! 🎉**
