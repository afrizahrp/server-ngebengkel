# 🏢 Setup Company Email untuk Email Verification

Panduan lengkap untuk menggunakan company email (custom domain) seperti `afriza@bumiindah.co.id` untuk fitur email verification.

## 📋 Daftar Isi

- [Mengetahui Email Provider](#mengetahui-email-provider)
- [Konfigurasi Berdasarkan Provider](#konfigurasi-berdasarkan-provider)
- [Testing SMTP Connection](#testing-smtp-connection)
- [Troubleshooting](#troubleshooting)

---

## 🔍 Mengetahui Email Provider

SMTP port dan konfigurasi **TIDAK bergantung pada domain email**, tetapi pada **email provider/server** yang digunakan company.

### Cara 1: Tanya IT Department/Admin

Hubungi IT department dan tanyakan:

```
☑️ SMTP Host (contoh: smtp.bumiindah.co.id atau smtp.gmail.com)
☑️ SMTP Port (25, 465, 587, 2525)
☑️ SSL/TLS requirement
☑️ Username format
☑️ Password atau App Password
```

### Cara 2: Check Email Client Settings

**Microsoft Outlook:**

1. File → Account Settings → Account Settings
2. Double-click pada email account
3. Klik "More Settings" → Tab "Outgoing Server"
4. Lihat server name dan port

**Mozilla Thunderbird:**

1. Tools → Account Settings
2. Pilih account → Server Settings
3. Lihat "Outgoing Server (SMTP)"

**macOS Mail:**

1. Mail → Preferences → Accounts
2. Pilih account → Server Settings
3. Lihat "Outgoing Mail Server (SMTP)"

### Cara 3: Check MX Records

```bash
# Windows
nslookup -type=mx bumiindah.co.id

# Linux/Mac
dig bumiindah.co.id MX
```

MX records bisa memberikan petunjuk tentang email provider yang digunakan:

- `aspmx.l.google.com` → Google Workspace
- `*.mail.protection.outlook.com` → Microsoft 365
- `mx1.yourdomain.com` → Self-hosted

---

## ⚙️ Konfigurasi Berdasarkan Provider

### 1. Google Workspace (G Suite) ⭐ Recommended

Jika company menggunakan Google Workspace (email custom domain via Google):

```env
# .env configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-app-password

EMAIL_FROM_NAME=PT Bumi Indah
EMAIL_FROM_ADDRESS=afriza@bumiindah.co.id
```

**Setup App Password:**

1. Login ke [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable jika belum)
3. Security → App passwords
4. Generate password untuk "Mail"
5. Copy 16-digit password

**Alternative Port:**

```env
SMTP_PORT=465
SMTP_SECURE=true  # true untuk SSL
```

---

### 2. Microsoft 365 / Office 365 ⭐ Recommended

Jika company menggunakan Microsoft 365:

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-email-password

EMAIL_FROM_NAME=PT Bumi Indah
EMAIL_FROM_ADDRESS=afriza@bumiindah.co.id
```

**Important Notes:**

- Microsoft 365 memerlukan Modern Authentication
- Pastikan SMTP AUTH enabled di admin center
- Gunakan password email langsung (bukan App Password)

**Jika menggunakan Shared Mailbox:**

```env
SMTP_USER=shared-mailbox@bumiindah.co.id
# Login dengan user yang punya akses ke shared mailbox
```

---

### 3. cPanel / WHM Hosting

Jika company menggunakan shared hosting dengan cPanel:

```env
SMTP_HOST=mail.bumiindah.co.id
# atau
# SMTP_HOST=smtp.bumiindah.co.id
# atau
# SMTP_HOST=server123.hostingprovider.com

SMTP_PORT=587  # atau 465, 25, 2525
SMTP_SECURE=false  # false untuk 587, true untuk 465
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-email-password

EMAIL_FROM_NAME=PT Bumi Indah
EMAIL_FROM_ADDRESS=afriza@bumiindah.co.id
```

**Cara dapat SMTP Host:**

1. Login ke cPanel
2. Email Accounts → Configure Email Client
3. Copy "Mail Server" atau "Outgoing Server"

**Port Options:**

- **587** (TLS) - Recommended
- **465** (SSL) - Alternative
- **2525** (TLS) - Jika 587 diblock
- **25** (No encryption) - Not recommended

---

### 4. Zimbra Mail Server

```env
SMTP_HOST=mail.bumiindah.co.id
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-password

EMAIL_FROM_NAME=PT Bumi Indah
EMAIL_FROM_ADDRESS=afriza@bumiindah.co.id
```

---

### 5. AWS WorkMail

```env
SMTP_HOST=smtp.mail.us-east-1.awsapps.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-password
```

---

### 6. Zoho Mail

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-password
```

---

### 7. Custom Mail Server

Jika company punya mail server sendiri:

```env
SMTP_HOST=mail.bumiindah.co.id  # atau IP address
SMTP_PORT=25  # atau port custom
SMTP_SECURE=false
SMTP_USER=afriza@bumiindah.co.id
SMTP_PASSWORD=your-password
```

**Note:** Port 25 sering diblock oleh ISP/cloud provider untuk mencegah spam.

---

## 🧪 Testing SMTP Connection

Gunakan script `test-smtp-connection.js` yang sudah disediakan:

### Step 1: Update Konfigurasi

Edit file `test-smtp-connection.js`:

```javascript
const SMTP_CONFIG = {
  host: 'mail.bumiindah.co.id', // Ganti dengan SMTP host company
  port: 587, // Ganti dengan port yang benar
  secure: false, // true untuk 465, false untuk 587
  auth: {
    user: 'afriza@bumiindah.co.id', // Email company
    pass: 'your-password', // Password email
  },
};

const TEST_EMAIL = {
  to: 'your-test@email.com', // Email tujuan untuk testing
};
```

### Step 2: Run Test

```bash
node test-smtp-connection.js
```

### Expected Output (Success):

```
🔧 Testing SMTP Connection...

Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Host:    mail.bumiindah.co.id
Port:    587
Secure:  false
User:    afriza@bumiindah.co.id
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Creating transporter...
🔍 Verifying SMTP connection...
✅ SMTP connection verified successfully!

📧 Sending test email...
✅ Test email sent successfully!

🎉 SMTP Test Completed Successfully!
```

---

## 🐛 Troubleshooting

### Error: EAUTH - Authentication Failed

**Penyebab:**

- Username atau password salah
- Gmail: Belum menggunakan App Password

**Solusi:**

```bash
# Cek credentials
1. Pastikan email dan password benar
2. Gmail: Gunakan App Password (bukan password biasa)
3. Microsoft 365: Pastikan SMTP AUTH enabled
4. cPanel: Login ke webmail untuk verify password
```

---

### Error: ETIMEDOUT - Connection Timeout

**Penyebab:**

- SMTP host salah
- Firewall blocking port
- Port salah

**Solusi:**

```env
# Try alternative ports
SMTP_PORT=587  # TLS
# atau
SMTP_PORT=465  # SSL (set SMTP_SECURE=true)
# atau
SMTP_PORT=2525  # Alternative TLS
```

```bash
# Check firewall
# Windows
Test-NetConnection -ComputerName mail.bumiindah.co.id -Port 587

# Linux/Mac
telnet mail.bumiindah.co.id 587
# atau
nc -zv mail.bumiindah.co.id 587
```

---

### Error: ECONNREFUSED - Connection Refused

**Penyebab:**

- SMTP host salah
- SMTP service tidak running
- Port salah

**Solusi:**

1. Verify SMTP host dengan IT department
2. Coba berbagai kombinasi host:
   ```
   mail.bumiindah.co.id
   smtp.bumiindah.co.id
   server.hostingprovider.com
   ```
3. Coba berbagai port: 587, 465, 25, 2525

---

### Error: ESOCKET - Socket Error

**Penyebab:**

- Secure setting salah

**Solusi:**

```env
# Untuk port 587
SMTP_PORT=587
SMTP_SECURE=false

# Untuk port 465
SMTP_PORT=465
SMTP_SECURE=true
```

---

### Email Masuk Spam

**Solusi:**

1. **SPF Record**: Tambahkan di DNS

   ```
   v=spf1 a mx include:_spf.google.com ~all
   ```

2. **DKIM**: Setup di email provider

3. **DMARC**: Tambahkan policy

   ```
   _dmarc.bumiindah.co.id TXT "v=DMARC1; p=quarantine; rua=mailto:admin@bumiindah.co.id"
   ```

4. **Reverse DNS**: Pastikan IP server punya PTR record

5. **Email Warmup**: Jangan langsung kirim banyak email

---

## 📊 Quick Reference Table

| Provider         | Host                         | Port | Secure | Notes              |
| ---------------- | ---------------------------- | ---- | ------ | ------------------ |
| Google Workspace | smtp.gmail.com               | 587  | false  | Perlu App Password |
| Google Workspace | smtp.gmail.com               | 465  | true   | Alternative        |
| Microsoft 365    | smtp.office365.com           | 587  | false  | Modern Auth        |
| cPanel Hosting   | mail.yourdomain.com          | 587  | false  | Most common        |
| cPanel Hosting   | mail.yourdomain.com          | 465  | true   | Alternative        |
| Zimbra           | mail.yourdomain.com          | 587  | false  | -                  |
| AWS WorkMail     | smtp.mail.region.awsapps.com | 587  | false  | -                  |
| Zoho Mail        | smtp.zoho.com                | 587  | false  | -                  |

---

## ✅ Checklist Setup

Sebelum go live, pastikan:

- [ ] SMTP credentials sudah ditest dan berhasil
- [ ] Email berhasil terkirim ke inbox (bukan spam)
- [ ] Token verification berfungsi dengan baik
- [ ] Email template tampil dengan benar
- [ ] Error handling sudah proper
- [ ] Environment variables di production sudah benar
- [ ] SPF/DKIM/DMARC sudah disetup (production)
- [ ] Email monitoring sudah disetup

---

## 🚀 Production Tips

1. **Use Professional Email Service**

   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Monitoring**

   - Track delivery rate
   - Monitor bounce rate
   - Setup alerts untuk failed emails

3. **Rate Limiting**

   - Limit email sending per hour
   - Implement queue system

4. **Email Queue**

   - Gunakan Bull, BullMQ, atau RabbitMQ
   - Jangan block HTTP request

5. **Backup SMTP**
   - Setup fallback SMTP provider
   - Automatic retry pada failure

---

## 📞 Need Help?

Jika masih ada masalah:

1. Hubungi IT department untuk SMTP credentials
2. Test menggunakan `test-smtp-connection.js`
3. Check logs di server untuk error details
4. Baca troubleshooting guide di atas

---

**Last Updated:** October 15, 2025
