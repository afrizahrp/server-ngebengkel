# 🎨 Email Logo Setup Guide

Panduan untuk setup logo di email verification dan 2FA email.

## ✅ Yang Sudah Diupdate

### Branding Color: `#00b055` (Green)

- ✅ Header background: `#00b055`
- ✅ Button background: `#00b055`
- ✅ OTP code color: `#00b055`

### Logo Implementation

- ✅ Email verification template
- ✅ 2FA OTP template
- ✅ Fallback text jika logo tidak load

---

## 🌐 Setup Logo URL

Template saat ini menggunakan **placeholder URL**. Anda perlu ganti dengan **URL actual logo**.

### Option 1: Host di Server (Recommended)

#### Step 1: Upload Logo ke Public Folder

**Untuk NestJS:**

```bash
# Create public folder jika belum ada
mkdir -p public/images

# Copy logo.webp ke public folder
cp path/to/logo.webp public/images/logo.webp
```

#### Step 2: Serve Static Files

Update `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  await app.listen(4000);
}
bootstrap();
```

#### Step 3: Update Email Template

Edit `src/email/templates/simple-verification.template.ts`:

```typescript
// Ganti URL ini:
<img src="https://yourdomain.com/logo.webp" ... />

// Dengan:
<img src="http://localhost:4000/public/images/logo.webp" ... />

// Untuk production:
<img src="https://api.ngebengkel.com/public/images/logo.webp" ... />
```

#### Step 4: Update via Environment Variable (Best Practice)

`.env`:

```env
LOGO_URL=http://localhost:4000/public/images/logo.webp
# Production:
# LOGO_URL=https://api.ngebengkel.com/public/images/logo.webp
```

`src/email/config/email.config.ts`:

```typescript
export default registerAs('email', () => ({
  // ... existing config
  logoUrl: process.env.LOGO_URL || 'https://yourdomain.com/logo.webp',
}));
```

Update template:

```typescript
export function getSimpleVerificationTemplate(
  name: string,
  verificationUrl: string,
  logoUrl?: string, // Add parameter
): string {
  const logo = logoUrl || 'https://yourdomain.com/logo.webp';

  return `
    ...
    <img src="${logo}" alt="Ngebengkel" style="height: 40px; width: auto;" />
    ...
  `;
}
```

---

### Option 2: Host di CDN/Cloud Storage

#### Cloudinary (Free tier available):

```
https://res.cloudinary.com/your-account/image/upload/v1234567/logo.webp
```

#### AWS S3:

```
https://your-bucket.s3.amazonaws.com/logo.webp
```

#### Google Cloud Storage:

```
https://storage.googleapis.com/your-bucket/logo.webp
```

#### imgbb (Simple & Free):

1. Upload ke https://imgbb.com/
2. Copy direct link
3. Update template dengan URL

---

### Option 3: Use Text-Only (No Image)

Jika Anda belum punya hosted logo, gunakan text-only version:

Edit `src/email/templates/simple-verification.template.ts`:

```typescript
<!-- Header -->
<tr>
  <td style="background-color: #00b055; padding: 30px 20px; text-align: center;">
    <div style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
      NGEBENGKEL
    </div>
  </td>
</tr>
```

Atau dengan emoji:

```typescript
<div style="color: #ffffff; font-size: 24px; font-weight: bold;">
  🔧 Ngebengkel
</div>
```

---

## 🔄 Quick Update Script

Saya buatkan helper untuk update logo URL di semua templates:

**File:** `update-logo-url.js`

```javascript
const fs = require('fs');
const path = require('path');

const LOGO_URL = 'http://localhost:4000/public/images/logo.webp';

const templates = [
  'src/email/templates/simple-verification.template.ts',
  'src/email/templates/two-factor-otp.template.ts',
];

templates.forEach((file) => {
  const filepath = path.join(__dirname, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace placeholder URL
  content = content.replace(/https:\/\/yourdomain\.com\/logo\.webp/g, LOGO_URL);

  fs.writeFileSync(filepath, content);
  console.log(`✅ Updated ${file}`);
});

console.log('\n✅ All templates updated!');
console.log(`Logo URL: ${LOGO_URL}`);
```

**Usage:**

```bash
# Edit LOGO_URL di script
# Then run:
node update-logo-url.js
```

---

## 📊 Current Template Structure

### Email Verification Template:

```html
<td style="background-color: #00b055; ...">
  <img src="https://yourdomain.com/logo.webp" alt="Ngebengkel" ... />
  <div style="display: none; ...">Ngebengkel</div>
  <!-- Fallback -->
</td>
```

### 2FA OTP Template:

```html
<td style="background-color: #00b055; ...">
  <img src="https://yourdomain.com/logo.webp" alt="Ngebengkel" ... />
  <div style="display: none; ...">🔒 Ngebengkel</div>
  <!-- Fallback -->
</td>
```

**Features:**

- ✅ **Fallback text** jika image gagal load
- ✅ **Responsive** - Logo auto-resize
- ✅ **Alt text** untuk accessibility

---

## 🧪 Testing Email dengan Logo

### Step 1: Update Logo URL

Pilih salah satu opsi di atas dan update URL.

### Step 2: Restart Server

```bash
npm run start:dev
```

### Step 3: Test Email

```bash
# Register user baru
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Logo",
    "email": "test@example.com",
    "password": "test123"
  }'

# Check email untuk melihat logo
```

### Step 4: Verify di Email Client

- ✅ Logo tampil dengan benar
- ✅ Background color #00b055 (green)
- ✅ Button color #00b055
- ✅ Jika logo gagal load → text "Ngebengkel" muncul

---

## 🎨 Logo Specifications

### Recommended Logo Specs:

- **Format:** WebP, PNG, atau SVG
- **Dimensions:** 200x60px atau similar (will be scaled to 40px height)
- **File Size:** < 50KB
- **Background:** Transparent (agar cocok dengan header hijau)

### Logo Colors:

- **Primary:** White/Light color (untuk kontras dengan background #00b055)
- **Or:** Full color logo (jika punya transparent background)

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Logo uploaded ke CDN/cloud storage
- [ ] Logo URL updated di template atau .env
- [ ] Logo accessible via HTTPS (not HTTP)
- [ ] Logo file optimized (< 50KB)
- [ ] Test email di berbagai email clients (Gmail, Outlook, etc)
- [ ] Verify fallback text works jika logo gagal load

---

## 🔧 Troubleshooting

### Logo tidak muncul di email

**Check:**

1. ✅ URL logo accessible secara public
2. ✅ URL menggunakan **absolute URL** (bukan relative)
3. ✅ File logo accessible via browser (test buka URL)
4. ✅ CORS enabled jika hosted di different domain

**Solution:**

- Test URL di browser: buka `http://your-logo-url.webp`
- Check server logs untuk 404 errors
- Use online tools: https://www.mail-tester.com/

### Logo tampil di Gmail tapi tidak di Outlook

**Issue:** Outlook kadang block external images by default

**Solution:**

- User harus enable images di Outlook settings
- Or use base64 inline image (lebih reliable tapi email size lebih besar)

---

## 💡 Alternative: Base64 Inline Logo

Jika mau embed logo langsung di email (tidak perlu hosting):

```bash
# Convert logo to base64
base64 logo.webp > logo-base64.txt
```

Update template:

```html
<img
  src="data:image/webp;base64,YOUR_BASE64_STRING_HERE"
  alt="Ngebengkel"
  style="height: 40px; width: auto;"
/>
```

**Pros:**

- ✅ Tidak perlu hosting
- ✅ Logo selalu tampil

**Cons:**

- ❌ Email size lebih besar
- ❌ Base64 string sangat panjang

---

**Need Help?** Update logo URL dan restart server, lalu test dengan register user baru!
