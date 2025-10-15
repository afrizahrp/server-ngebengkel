# 📬 Mencegah Email Masuk Spam Folder

Panduan lengkap untuk mengatasi masalah email verification masuk spam folder.

## 🔍 Kenapa Email Masuk Spam?

Email dari `afriza@bumiindah.co.id` masuk spam karena:

1. **SPF Record** tidak ada atau salah configured
2. **DKIM Signature** tidak ada
3. **DMARC Policy** tidak ada
4. **Domain Reputation** baru atau belum terbentuk
5. **IP Reputation** belum baik
6. **Reverse DNS** tidak match

---

## ✅ Solusi Jangka Pendek (Untuk Testing)

### 1. Whitelist Email di Gmail

**Manual:**

1. Buka email yang ada di Spam folder
2. Klik "Not Spam" atau "Report Not Spam"
3. Add sender ke Contacts

**Via Filter:**

1. Gmail → Settings (⚙️) → "See all settings"
2. Tab "Filters and Blocked Addresses"
3. Create a new filter:
   - **From:** `afriza@bumiindah.co.id` atau `*@bumiindah.co.id`
   - Click "Create filter"
   - ☑️ "Never send it to Spam"
   - ☑️ "Also apply filter to matching conversations"
   - Click "Create filter"

### 2. Add to Safe Senders (Outlook)

1. Right-click email → Junk → Never Block Sender
2. Atau: Settings → Junk email → Safe senders → Add `@bumiindah.co.id`

---

## 🔧 Solusi Jangka Panjang (Production Ready)

### 1. Setup SPF Record

**Apa itu SPF?**
SPF (Sender Policy Framework) memberi tahu email servers mana yang authorized untuk kirim email dari domain Anda.

**Cara Setup:**
Hubungi **IT Department** atau person yang manage DNS untuk domain `bumiindah.co.id` dan minta tambahkan **TXT record** berikut:

```dns
Type: TXT
Name: @ atau bumiindah.co.id
Value: v=spf1 mx a ip4:YOUR_SERVER_IP ~all
TTL: 3600
```

**Contoh untuk berbagai mail server:**

**cPanel/WHM Hosting:**

```
v=spf1 a mx ip4:123.456.789.0 ~all
```

**Google Workspace:**

```
v=spf1 include:_spf.google.com ~all
```

**Microsoft 365:**

```
v=spf1 include:spf.protection.outlook.com ~all
```

**Multiple servers:**

```
v=spf1 a mx include:_spf.google.com ip4:123.456.789.0 ~all
```

**Check SPF:**

```bash
# Windows
nslookup -type=txt bumiindah.co.id

# Linux/Mac
dig bumiindah.co.id TXT
```

---

### 2. Setup DKIM

**Apa itu DKIM?**
DKIM (DomainKeys Identified Mail) menambahkan digital signature pada email untuk verify authenticity.

**Cara Setup:**

#### Untuk cPanel:

1. Login ke cPanel
2. Email → Email Deliverability
3. Click "Manage" untuk domain
4. Enable DKIM
5. Copy DKIM record dan tambahkan ke DNS

#### Manual Setup:

1. Generate DKIM keys (minta ke IT atau hosting provider)
2. Tambahkan TXT record ke DNS:

```dns
Type: TXT
Name: default._domainkey.bumiindah.co.id
Value: v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE
TTL: 3600
```

**Check DKIM:**

```bash
nslookup -type=txt default._domainkey.bumiindah.co.id
```

---

### 3. Setup DMARC

**Apa itu DMARC?**
DMARC (Domain-based Message Authentication, Reporting & Conformance) memberi tahu email provider apa yang harus dilakukan jika SPF/DKIM check gagal.

**Cara Setup:**
Tambahkan TXT record berikut ke DNS:

```dns
Type: TXT
Name: _dmarc.bumiindah.co.id
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@bumiindah.co.id; pct=100; adkim=s; aspf=s
TTL: 3600
```

**DMARC Policy Options:**

- `p=none` → Monitor only (recommended untuk start)
- `p=quarantine` → Kirim ke spam jika fail
- `p=reject` → Reject email jika fail (strict)

**Start dengan policy `none`:**

```
v=DMARC1; p=none; rua=mailto:dmarc@bumiindah.co.id
```

**Check DMARC:**

```bash
nslookup -type=txt _dmarc.bumiindah.co.id
```

---

### 4. Setup Reverse DNS (PTR Record)

**Apa itu rDNS?**
Reverse DNS memastikan IP address server Anda match dengan domain name.

**Cara Setup:**
Hubungi **hosting provider** atau **ISP** untuk setup PTR record:

```
IP: 123.456.789.0 → mail.bumiindah.co.id
```

**Check rDNS:**

```bash
# Windows
nslookup 123.456.789.0

# Linux/Mac
dig -x 123.456.789.0
```

---

### 5. Check Email Deliverability

**Tools untuk Check:**

1. **Mail Tester**

   - https://www.mail-tester.com/
   - Kirim test email ke alamat yang diberikan
   - Lihat spam score dan recommendations

2. **MXToolbox**

   - https://mxtoolbox.com/SuperTool.aspx
   - Check SPF, DKIM, DMARC, Blacklist

3. **Google Postmaster Tools**

   - https://postmaster.google.com/
   - Monitor email reputation untuk Gmail

4. **DMARC Analyzer**
   - https://www.dmarcanalyzer.com/
   - Monitor DMARC reports

---

## 📋 Checklist untuk IT Department

Berikan checklist ini ke IT department yang manage domain `bumiindah.co.id`:

```
☐ Setup SPF Record
  Type: TXT
  Name: @
  Value: v=spf1 mx a ip4:SERVER_IP ~all

☐ Setup DKIM
  - Enable di email server/cPanel
  - Add DKIM TXT record ke DNS

☐ Setup DMARC
  Type: TXT
  Name: _dmarc
  Value: v=DMARC1; p=none; rua=mailto:admin@bumiindah.co.id

☐ Setup Reverse DNS (PTR Record)
  - Contact hosting provider
  - Set PTR: IP → mail.bumiindah.co.id

☐ Check Blacklist Status
  - Visit: https://mxtoolbox.com/blacklists.aspx
  - Check if IP is blacklisted
  - Request removal if needed
```

---

## 🎯 Quick Test Script

Saya buatkan script untuk test email deliverability:

```bash
# Test SPF
nslookup -type=txt bumiindah.co.id

# Test DKIM
nslookup -type=txt default._domainkey.bumiindah.co.id

# Test DMARC
nslookup -type=txt _dmarc.bumiindah.co.id

# Test MX Records
nslookup -type=mx bumiindah.co.id

# Test Reverse DNS (ganti dengan IP server)
nslookup YOUR_SERVER_IP
```

---

## 📊 Email Reputation Building

Setelah DNS records di-setup, email reputation perlu waktu untuk build:

### Tips:

1. **Start Small**: Jangan langsung kirim banyak email
2. **Consistent Volume**: Kirim email dengan volume yang consistent
3. **Monitor Bounce Rate**: Keep bounce rate < 5%
4. **Monitor Spam Complaints**: Keep complaint rate < 0.1%
5. **Engagement**: Email yang dibuka/diklik meningkatkan reputation
6. **Avoid Spam Triggers**: Jangan gunakan ALL CAPS, excessive !!!

### Timeline:

- **Week 1-2**: Kirim 10-50 emails/hari
- **Week 3-4**: Increase ke 100-200 emails/hari
- **Month 2+**: Normal volume

---

## 🚀 Alternative: Use Email Service Provider

Untuk production, pertimbangkan menggunakan professional email service:

### Recommended Services:

1. **SendGrid**

   - Setup otomatis SPF/DKIM/DMARC
   - High deliverability
   - Free tier: 100 emails/hari
   - Paid: $19.95/bulan untuk 50K emails

2. **AWS SES**

   - Murah: $0.10 per 1000 emails
   - Reliable infrastructure
   - Perlu setup SPF/DKIM manual

3. **Mailgun**

   - Developer-friendly
   - Good analytics
   - Free tier: 5000 emails/bulan

4. **Postmark**
   - Focus on transactional emails
   - Excellent deliverability
   - $15/bulan untuk 10K emails

### Setup SendGrid (Example):

```env
# .env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=YOUR_SENDGRID_API_KEY

EMAIL_FROM_ADDRESS=noreply@bumiindah.co.id
```

**Advantage:**

- ✅ Instant high deliverability
- ✅ No DNS configuration needed
- ✅ Built-in analytics
- ✅ Bounce/spam handling

---

## 🎓 Email Template Best Practices

Untuk mengurangi spam score:

### Do's:

- ✅ Use plain text version alongside HTML
- ✅ Include unsubscribe link
- ✅ Use professional "From" name
- ✅ Clear subject line
- ✅ Balance text vs images ratio
- ✅ Valid HTML structure

### Don'ts:

- ❌ ALL CAPS in subject
- ❌ Excessive exclamation marks!!!
- ❌ Red text or large fonts
- ❌ Too many links
- ❌ Attachments (untuk verification emails)
- ❌ Spam trigger words: "FREE!!!", "ACT NOW", "LIMITED TIME"

---

## 📞 Next Steps

### Immediate (Testing):

1. ✅ Whitelist `afriza@bumiindah.co.id` di Gmail
2. ✅ Mark email dari spam sebagai "Not Spam"
3. ✅ Continue testing - email akan masuk inbox setelah di-whitelist

### Short Term (1-2 Weeks):

1. Hubungi IT department
2. Setup SPF, DKIM, DMARC records
3. Test dengan https://www.mail-tester.com/
4. Monitor deliverability

### Long Term (Production):

1. Consider email service provider (SendGrid/AWS SES)
2. Monitor email analytics
3. Build domain reputation
4. Setup email authentication

---

## 🎉 Good News

**Email verification sudah berfungsi dengan baik!** ✅

Email masuk spam adalah issue umum yang **TIDAK mengganggu functionality** untuk testing. User masih bisa:

- ✅ Menerima email verification
- ✅ Klik link verification
- ✅ Verify email berhasil
- ✅ Login dengan sukses

Untuk production, ikuti panduan DNS setup di atas atau gunakan email service provider.

---

**Butuh bantuan?** Konsultasikan dengan IT department menggunakan checklist di atas!
