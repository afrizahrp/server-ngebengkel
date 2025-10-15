# 🔒 Proper Reset Password Flow - Security Best Practice

## ⚠️ Current Implementation Issue

**Current backend endpoint:**

```typescript
POST / auth / reset - password;
Body: {
  (email, password);
}
```

**Problem:** ❌ **TIDAK AMAN!**

- Siapa saja bisa reset password dengan hanya tahu email
- Tidak ada email verification
- Tidak ada token validation
- Melanggar security best practice

---

## ✅ Proper 2-Step Flow (Recommended)

### **Standard Industry Practice:**

```
Step 1: Forgot Password (Request Reset)
├─ User input EMAIL only
├─ Backend generate reset TOKEN
├─ Backend send TOKEN via email
└─ Show "Cek email Anda"

Step 2: Reset Password (Set New Password)
├─ User klik link dari email dengan TOKEN
├─ URL: /auth/reset-password?token=xxx
├─ User input NEW PASSWORD only
├─ Backend verify TOKEN
├─ Backend update password
└─ Success → redirect to login
```

---

## 🏗️ Required Backend Implementation

### **1. Database Schema:**

```prisma
// prisma/schema.prisma
model sys_PasswordReset {
  id        Int      @id @default(autoincrement())
  user_id   Int
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  used      Boolean  @default(false)

  user      sys_User @relation(fields: [user_id], references: [id])

  @@index([token])
  @@index([user_id])
}
```

### **2. Backend Endpoints:**

#### **A. Forgot Password (Step 1):**

```typescript
// POST /auth/forgot-password
@Public()
@Post('forgot-password')
async forgotPassword(@Body() body: { email: string }) {
  // 1. Find user by email
  const user = await this.prisma.sys_User.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    // Don't reveal if email exists or not (security)
    return {
      message: 'Jika email terdaftar, link reset password akan dikirim.'
    };
  }

  // 2. Generate reset token (32 bytes)
  const token = randomBytes(32).toString('hex');

  // 3. Set expiry (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // 4. Delete old reset tokens for this user
  await this.prisma.sys_PasswordReset.deleteMany({
    where: { user_id: user.id },
  });

  // 5. Save new token
  await this.prisma.sys_PasswordReset.create({
    data: {
      user_id: user.id,
      token,
      expiresAt,
    },
  });

  // 6. Send email dengan reset link
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
  await this.emailService.sendPasswordResetEmail(
    user.email,
    user.name,
    resetUrl,
  );

  return {
    message: 'Jika email terdaftar, link reset password akan dikirim.',
  };
}
```

#### **B. Reset Password (Step 2):**

```typescript
// POST /auth/reset-password
@Public()
@Post('reset-password')
async resetPassword(@Body() body: { token: string; password: string }) {
  // 1. Find valid reset token
  const resetToken = await this.prisma.sys_PasswordReset.findUnique({
    where: { token: body.token },
    include: { user: true },
  });

  if (!resetToken) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // 2. Check if token expired
  if (new Date() > resetToken.expiresAt) {
    throw new UnauthorizedException('Reset token has expired');
  }

  // 3. Check if already used
  if (resetToken.used) {
    throw new UnauthorizedException('Reset token already used');
  }

  // 4. Hash new password
  const hashedPassword = await hash(body.password);

  // 5. Update password
  await this.prisma.sys_User.update({
    where: { id: resetToken.user_id },
    data: { password: hashedPassword },
  });

  // 6. Mark token as used
  await this.prisma.sys_PasswordReset.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  // 7. Optional: Revoke all sessions untuk security
  await this.sessionService.revokeAllSessions(resetToken.user_id);

  return {
    message: 'Password berhasil direset. Silakan login dengan password baru.',
  };
}
```

#### **C. Email Template:**

```typescript
// email/email.service.ts
async sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string,
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Password - Ngebengkel',
    html: `
      <h2>Halo ${name},</h2>
      <p>Anda menerima email ini karena ada permintaan untuk reset password akun Anda.</p>
      <p>Klik tombol di bawah untuk reset password:</p>
      <a href="${resetUrl}" style="...">Reset Password</a>
      <p>Link ini akan kadaluwarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `,
  };

  await this.transporter.sendMail(mailOptions);
}
```

---

## 📁 Frontend Implementation

### **1. Folder Structure:**

```
app/auth/
├── forgot-password/              ✅ NEW - Step 1
│   ├── page.tsx
│   └── forgot-password-form.tsx
│
└── reset-password/               ✅ REFACTOR - Step 2
    ├── page.tsx
    └── reset-password-form.tsx   (update to use token)
```

### **2. Server Actions:**

```typescript
// lib/actions/auth.actions.ts

/**
 * Step 1: Request password reset
 */
export async function forgotPasswordAction(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
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
    message: result.message || 'Email reset password telah dikirim',
  };
}

/**
 * Step 2: Reset password dengan token
 */
export async function resetPasswordAction(
  token: string,
  password: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
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
    message: result.message || 'Password berhasil direset',
  };
}
```

### **3. Forgot Password Schema:**

```typescript
// schema/auth/forgot-password.schema.ts
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email tidak boleh kosong' })
    .email({ message: 'Email tidak valid' }),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
```

### **4. Forgot Password Form:**

```typescript
// app/auth/forgot-password/forgot-password-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema } from '@/app/utils/schema/auth';
import { forgotPasswordAction } from '@/lib/actions/auth.actions';
import toast from 'react-hot-toast';

export const ForgotPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    const result = await forgotPasswordAction(data.email);

    if (result.success) {
      toast.success(result.message);
      // Show success view
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Form>
      {/* Email input only */}
      <FormField name="email" />
      <Button type="submit">Kirim Link Reset</Button>
    </Form>
  );
};
```

### **5. Reset Password Form (Refactored):**

```typescript
// app/auth/reset-password/reset-password-form.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { NewPasswordSchema } from '@/app/utils/schema/auth';
import { resetPasswordAction } from '@/lib/actions/auth.actions';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Token tidak valid');
      return;
    }

    const result = await resetPasswordAction(token, data.password);

    if (result.success) {
      toast.success('Password berhasil direset!');
      router.push('/auth/login');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Form>
      {/* Password input only (token from URL) */}
      <FormField name="password" />
      <Button type="submit">Reset Password</Button>
    </Form>
  );
};
```

---

## 🔄 Complete User Flow

### **Scenario: User Lupa Password**

```
1. Login page → Klik "Lupa Password?"
   ↓
2. Forgot Password page (/auth/forgot-password)
   ├─ Input: Email only
   └─ Submit
   ↓
3. Backend:
   ├─ Generate random token
   ├─ Save token dengan expiry 1 jam
   └─ Send email dengan link
   ↓
4. Frontend success:
   └─ "Cek email Anda untuk link reset password"
   ↓
5. User cek email:
   └─ Klik link: /auth/reset-password?token=abc123xyz
   ↓
6. Reset Password page
   ├─ Token auto-loaded dari URL
   ├─ Input: New password only
   └─ Submit
   ↓
7. Backend:
   ├─ Verify token valid & not expired
   ├─ Update password
   ├─ Mark token as used
   └─ Revoke all sessions (optional)
   ↓
8. Frontend success:
   └─ Redirect to login ✅
```

---

## 🔐 Security Benefits

| Feature                | Current (Insecure) | Proper Flow (Secure) |
| ---------------------- | ------------------ | -------------------- |
| **Email Verification** | ❌ No              | ✅ Yes (via token)   |
| **Token Validation**   | ❌ No              | ✅ Yes               |
| **Expiry**             | ❌ No              | ✅ Yes (1 hour)      |
| **One-time Use**       | ❌ No              | ✅ Yes               |
| **Session Revoke**     | ❌ No              | ✅ Yes (optional)    |
| **Security Level**     | 🔴 Low             | 🟢 High              |

---

## 🚨 Security Risks (Current Implementation)

### **Attack Scenario:**

```
Attacker tahu email korban
     ↓
POST /auth/reset-password
{
  "email": "victim@example.com",
  "password": "hacked123"
}
     ↓
Password berhasil diubah! 😱
Attacker bisa login sebagai korban
```

**No verification needed!** ❌

---

## 📋 Action Items

### **For Now (Temporary):**

1. ✅ Keep current implementation (mark as deprecated)
2. ✅ Add warning message
3. ✅ Document proper flow
4. ✅ Restrict to internal use only (@bumiindah.co.id)

### **For Production (Required):**

1. ⚠️ **MUST implement proper forgot-password endpoint di backend**
2. ⚠️ **MUST add token-based verification**
3. ⚠️ **MUST send email dengan reset link**
4. ⚠️ **MUST implement token expiry**

---

## 🔧 Recommended Backend Changes

**Priority: HIGH 🔴**

### **Files to Create/Update:**

```
backend/
├── prisma/schema.prisma
│   └─ Add: sys_PasswordReset model
│
├── src/auth/better-auth/
│   ├── better-auth.controller.ts
│   │   ├─ Add: POST /auth/forgot-password
│   │   └─ Update: POST /auth/reset-password (verify token)
│   │
│   └── better-auth.service.ts
│       ├─ Add: forgotPassword()
│       ├─ Add: generateResetToken()
│       ├─ Update: resetPassword() (accept token)
│       └─ Add: verifyResetToken()
│
└── src/email/email.service.ts
    └─ Add: sendPasswordResetEmail()
```

### **Implementation Estimate:**

- Database migration: 5 minutes
- Backend endpoints: 30 minutes
- Email template: 15 minutes
- **Total: ~1 hour** 🕐

---

## 💡 Alternative (If Backend Cannot Change)

### **Workaround menggunakan existing email verification:**

Bisa memanfaatkan pattern email verification yang sudah ada:

```typescript
// Reuse email verification system untuk reset password
1. User request reset → Send "verification" email
2. User verify email → Show reset password form
3. User set new password
```

**But this is NOT recommended** - better to implement proper flow.

---

## 📚 References

- [OWASP - Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Auth0 - Password Reset Best Practices](https://auth0.com/docs/authenticate/passwords/password-reset)

---

## ✅ Summary

**Current State:** ❌ Insecure reset-password implementation  
**Recommended:** ✅ Implement 2-step forgot → reset flow  
**Priority:** 🔴 HIGH (security issue)  
**Effort:** ~1 hour backend work

**Do NOT use current implementation in production!** ⚠️

---

Last Updated: October 15, 2025
