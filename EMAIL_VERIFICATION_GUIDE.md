# 📧 Email Verification Guide

Panduan lengkap untuk menggunakan fitur Email Verification pada sistem Ngebengkel.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Konfigurasi](#konfigurasi)
- [Setup SMTP](#setup-smtp)
- [Flow Diagram](#flow-diagram)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Fitur

Email verification system ini menyediakan:

1. **Automatic Email Sending**: Email verifikasi dikirim otomatis saat registrasi
2. **Secure Token**: Token verifikasi yang aman dengan expiry time 1 jam
3. **Beautiful Email Template**: Template HTML yang modern dan responsive
4. **Resend Functionality**: User dapat request resend jika email tidak diterima
5. **Login Protection**: User harus verify email sebelum bisa login
6. **Token Expiry**: Token akan expired setelah 1 jam untuk keamanan

---

## ⚙️ Konfigurasi

### 1. Environment Variables

Tambahkan konfigurasi berikut ke file `.env`:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Email Sender Information
EMAIL_FROM_NAME=Ngebengkel
EMAIL_FROM_ADDRESS=your-email@gmail.com

# Email Verification Configuration
EMAIL_VERIFICATION_URL=http://localhost:3000/auth/verify-email
EMAIL_VERIFICATION_EXPIRY=3600000  # 1 hour in milliseconds
```

### 2. Database Migration

Migration sudah dibuat otomatis. Pastikan Anda sudah menjalankan:

```bash
npx prisma migrate dev
```

Migration ini menambahkan:

- Field `emailVerified` dan `emailVerifiedAt` pada tabel `sys_User`
- Tabel baru `sys_EmailVerification` untuk menyimpan token verifikasi

---

## 📧 Setup SMTP

### Menggunakan Gmail

1. **Enable 2-Factor Authentication** pada akun Google Anda
2. **Generate App Password**:

   - Buka [Google Account Security](https://myaccount.google.com/security)
   - Pilih "2-Step Verification"
   - Scroll ke bawah dan pilih "App passwords"
   - Pilih "Mail" dan device "Other"
   - Copy password yang di-generate

3. **Update .env**:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
```

### Menggunakan SMTP Lain

Untuk provider lain (Outlook, Yahoo, SendGrid, dll), sesuaikan konfigurasi:

**Outlook/Hotmail:**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**SendGrid:**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      EMAIL VERIFICATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ┌──────────────┐
   │ POST /auth/  │
   │  register    │──┐
   └──────────────┘  │
                     │
   ┌─────────────────▼──────────────────┐
   │ 1. Create user (emailVerified=false)│
   │ 2. Generate verification token      │
   │ 3. Save token to DB (expires 1h)   │
   │ 4. Send verification email          │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ User receives email with link:     │
   │ /auth/verify-email?token=xxx       │
   └─────────────────┬──────────────────┘
                     │
2. EMAIL VERIFICATION                    │
   ┌─────────────────▼──────────────────┐
   │ GET /auth/verify-email?token=xxx   │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ 1. Validate token                  │
   │ 2. Check expiry                    │
   │ 3. Update user.emailVerified=true  │
   │ 4. Delete verification token       │
   └─────────────────┬──────────────────┘
                     │
3. LOGIN              ▼
   ┌──────────────────────────────────┐
   │ POST /auth/login                 │
   └──────────┬───────────────────────┘
              │
   ┌──────────▼───────────────────────┐
   │ Check if emailVerified == true   │
   │ ✓ Yes → Allow login              │
   │ ✗ No  → Return 401 error         │
   └──────────────────────────────────┘

4. RESEND (if needed)
   ┌──────────────────────────────────┐
   │ POST /auth/resend-verification   │
   │ { "email": "user@example.com" }  │
   └──────────┬───────────────────────┘
              │
   ┌──────────▼───────────────────────┐
   │ 1. Find user                     │
   │ 2. Delete old tokens             │
   │ 3. Generate new token            │
   │ 4. Send new email                │
   └──────────────────────────────────┘
```

---

## 🌐 API Endpoints

### 1. Register (Modified)

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "image": null,
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Yang Terjadi:**

1. User dibuat dengan `emailVerified = false`
2. Token verifikasi di-generate dan disimpan ke database
3. Email verifikasi dikirim ke user

---

### 2. Verify Email

**Endpoint:** `GET /auth/verify-email?token={verification_token}`

**Query Params:**

- `token` (required): Verification token dari email

**Response Success:**

```json
{
  "message": "Email verified successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error - Invalid Token:**

```json
{
  "statusCode": 401,
  "message": "Invalid or expired verification token"
}
```

**Response Error - Token Expired:**

```json
{
  "statusCode": 401,
  "message": "Verification token has expired"
}
```

---

### 3. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification-email`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

**Response Error - Already Verified:**

```json
{
  "statusCode": 409,
  "message": "Email already verified"
}
```

**Response Error - User Not Found:**

```json
{
  "statusCode": 401,
  "message": "User not found"
}
```

---

### 4. Login (Modified)

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response Error - Email Not Verified:**

```json
{
  "statusCode": 401,
  "message": "Please verify your email before logging in. Check your inbox for the verification link."
}
```

**Response Success:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "image": null,
    "company": { ... }
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "sessionId": "ckm1x...",
  "message": "Login successful"
}
```

---

## 🧪 Testing

### 1. Test Registration dengan Email

```bash
# Register user baru
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected:**

- Response berisi user info dan message untuk check email
- Email dikirim ke test@example.com
- Token disimpan di database

### 2. Check Email

Buka inbox email Anda dan cari email dari "Ngebengkel" dengan subject "Verifikasi Email Anda - Ngebengkel"

### 3. Verify Email

```bash
# Copy token dari email dan verify
curl -X GET "http://localhost:4000/auth/verify-email?token=YOUR_TOKEN_HERE"
```

**Expected:**

- Response: "Email verified successfully"
- Database: `sys_User.emailVerified` = true

### 4. Test Login Before Verification

```bash
# Coba login sebelum verify (akan gagal)
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected:**

- Error 401: "Please verify your email before logging in..."

### 5. Test Login After Verification

```bash
# Login setelah verify (akan berhasil)
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected:**

- Response berisi accessToken dan refreshToken

### 6. Test Resend Verification

```bash
# Resend verification email
curl -X POST http://localhost:4000/auth/resend-verification-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

---

## 🐛 Troubleshooting

### Email Tidak Terkirim

**Problem:** Email verification tidak terkirim setelah registrasi

**Solutions:**

1. **Check SMTP Configuration**

   ```bash
   # Pastikan environment variables sudah benar
   echo $SMTP_USER
   echo $SMTP_HOST
   ```

2. **Check Console Logs**

   ```
   # Cari error di console:
   Error configuring email transporter: ...
   Error sending verification email: ...
   ```

3. **Gmail App Password**

   - Pastikan Anda menggunakan App Password, bukan password akun biasa
   - Enable 2-Factor Authentication terlebih dahulu
   - Generate App Password baru

4. **Test SMTP Connection**
   - Saat aplikasi start, Anda harus melihat log:
   ```
   Email server is ready to send messages
   ```

### Token Expired

**Problem:** Token sudah expired saat user klik link

**Solution:**

```bash
# User dapat request resend
curl -X POST http://localhost:4000/auth/resend-verification-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Link Verification Tidak Bekerja

**Problem:** Link di email mengarah ke URL yang salah

**Solution:**

- Update `EMAIL_VERIFICATION_URL` di .env
- Untuk development: `http://localhost:3000/auth/verify-email`
- Untuk production: `https://yourdomain.com/auth/verify-email`

### Email Masuk Spam

**Problem:** Email verification masuk ke folder spam

**Solutions:**

1. **Whitelist Email Sender** pada email client
2. **Use Custom Domain** untuk production (bukan Gmail)
3. **Setup SPF/DKIM Records** pada domain Anda
4. **Gunakan Email Service Provider** seperti SendGrid, AWS SES, Mailgun

---

## 📁 File Structure

```
src/
├── email/
│   ├── config/
│   │   └── email.config.ts          # Email configuration
│   ├── email.service.ts             # Email sending logic + templates
│   └── email.module.ts              # Email module
│
├── auth/
│   ├── better-auth/
│   │   ├── better-auth.service.ts   # Added email verification methods
│   │   ├── better-auth.controller.ts # Added verify & resend endpoints
│   │   └── better-auth.module.ts    # Import EmailModule
│
prisma/
├── schema.prisma                    # Updated with email verification models
└── migrations/
    └── xxx_add_email_verification/  # Migration files
```

---

## 🔒 Security Notes

1. **Token Expiry**: Token expired setelah 1 jam untuk security
2. **One-Time Use**: Token dihapus setelah digunakan
3. **Secure Generation**: Token di-generate menggunakan `crypto.randomBytes(32)`
4. **No Plain Text**: Password tidak pernah dikirim via email
5. **HTTPS Recommended**: Gunakan HTTPS di production untuk keamanan

---

## 🚀 Production Recommendations

1. **Use Email Service Provider**

   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Custom Domain Email**

   - Lebih professional
   - Mengurangi risk masuk spam
   - Contoh: noreply@ngebengkel.com

3. **Email Analytics**

   - Track email delivery rate
   - Monitor bounce rate
   - Track open rate

4. **Rate Limiting**

   - Limit resend verification (contoh: max 3x per jam)
   - Prevent spam

5. **Email Queue**
   - Gunakan queue system (Bull, RabbitMQ) untuk production
   - Prevent blocking request

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan contact developer atau buat issue di repository.

---

**Last Updated:** October 15, 2025
