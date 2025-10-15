# 📧 Environment Variables Setup untuk Email Verification

Panduan untuk setup environment variables yang diperlukan untuk fitur Email Verification.

## Required Environment Variables

Tambahkan variabel berikut ke file `.env` Anda:

```env
# ============================================================================
# SMTP EMAIL CONFIGURATION
# ============================================================================
# Host SMTP server (contoh: smtp.gmail.com, smtp-mail.outlook.com)
SMTP_HOST=smtp.gmail.com

# Port SMTP (587 untuk TLS, 465 untuk SSL)
SMTP_PORT=587

# SSL/TLS secure connection (true untuk port 465, false untuk port 587)
SMTP_SECURE=false

# Email account untuk mengirim email
SMTP_USER=your-email@gmail.com

# Password atau App Password untuk email account
# PENTING: Untuk Gmail, gunakan App Password bukan password biasa!
SMTP_PASSWORD=your-app-password

# ============================================================================
# EMAIL SENDER INFORMATION
# ============================================================================
# Nama pengirim yang akan muncul di email
EMAIL_FROM_NAME=Ngebengkel

# Email address pengirim
EMAIL_FROM_ADDRESS=your-email@gmail.com

# ============================================================================
# EMAIL VERIFICATION CONFIGURATION
# ============================================================================
# URL frontend untuk verify email (user akan diredirect ke URL ini)
# Development:
EMAIL_VERIFICATION_URL=http://localhost:3000/auth/verify-email
# Production:
# EMAIL_VERIFICATION_URL=https://yourdomain.com/auth/verify-email

# Token expiry time dalam milliseconds (default: 1 hour = 3600000)
EMAIL_VERIFICATION_EXPIRY=3600000
```

---

## 🔐 Setup Gmail App Password

Jika Anda menggunakan Gmail, ikuti langkah berikut:

### Step 1: Enable 2-Factor Authentication

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Klik "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password

1. Tetap di halaman Security, scroll ke bawah
2. Klik "App passwords" (hanya muncul setelah 2FA enabled)
3. Pilih app: **Mail**
4. Pilih device: **Other (Custom name)**
5. Beri nama: "Ngebengkel Server"
6. Klik **Generate**
7. Copy 16-digit password yang muncul (contoh: `abcd efgh ijkl mnop`)

### Step 3: Update .env

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop  # tanpa spasi
EMAIL_FROM_ADDRESS=your-email@gmail.com
```

---

## 🌐 Alternative SMTP Providers

### Microsoft Outlook / Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
EMAIL_FROM_ADDRESS=your-email@outlook.com
```

### Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password  # Generate dari Yahoo App Password
EMAIL_FROM_ADDRESS=your-email@yahoo.com
```

### SendGrid (Recommended for Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### AWS SES (Recommended for Production)

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-ses-smtp-username
SMTP_PASSWORD=your-aws-ses-smtp-password
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Mailgun (Recommended for Production)

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-smtp-password
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

---

## ✅ Verify Setup

Setelah setup environment variables, test dengan:

1. **Start server:**

```bash
npm run start:dev
```

2. **Check console untuk message:**

```
Email server is ready to send messages
```

3. **Test registration:**

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@example.com",
    "password": "TestPassword123"
  }'
```

4. **Check inbox** untuk email verification

---

## 🐛 Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Gmail:**

- Pastikan 2FA sudah enabled
- Generate App Password baru
- Gunakan App Password, bukan password akun

**Outlook:**

- Enable "Allow less secure apps" di account settings
- Atau gunakan app-specific password

### Error: "connect ETIMEDOUT"

**Possible Causes:**

- Firewall blocking port 587/465
- Wrong SMTP host
- Network issue

**Solutions:**

- Test dengan port 465 (SSL) atau 587 (TLS)
- Check firewall settings
- Try alternative SMTP provider

### Email masuk ke Spam

**Solutions:**

- Whitelist sender email
- Use professional email service (SendGrid, AWS SES)
- Setup SPF/DKIM records untuk custom domain

---

## 📝 Complete .env Example

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ngebengkeldb?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password

# Email Config
EMAIL_FROM_NAME=Ngebengkel
EMAIL_FROM_ADDRESS=your-email@gmail.com
EMAIL_VERIFICATION_URL=http://localhost:3000/auth/verify-email
EMAIL_VERIFICATION_EXPIRY=3600000

# Server
PORT=4000
NODE_ENV=development
```

---

## 🚀 Production Best Practices

1. **Use Environment Service**: Gunakan AWS Secrets Manager, Google Secret Manager, atau Azure Key Vault
2. **Never Commit .env**: Pastikan .env ada di .gitignore
3. **Use Email Service**: SendGrid, AWS SES, atau Mailgun lebih reliable untuk production
4. **Custom Domain**: Gunakan email dari domain sendiri (noreply@yourdomain.com)
5. **Monitor Email**: Setup monitoring untuk delivery rate dan bounce rate

---

**Need Help?** Check [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md) untuk panduan lengkap.
