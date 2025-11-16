# CAPTCHA Protection Implementation

## ✅ Implementasi Selesai

CAPTCHA protection telah diimplementasikan untuk melindungi form submissions dari spam dan bot attacks menggunakan Google reCAPTCHA.

## 📦 Packages yang Digunakan

- `axios` - Sudah terinstall (untuk HTTP requests ke Google reCAPTCHA API)

## 🔧 Konfigurasi

### Environment Variables

Tambahkan ke `.env` file:

```env
# Google reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your-secret-key-here

# Optional: reCAPTCHA Site Key (untuk frontend)
RECAPTCHA_SITE_KEY=your-site-key-here
```

### Mendapatkan reCAPTCHA Keys

1. Daftar di [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Buat site baru:
   - **Label**: Ngebengkel.com
   - **reCAPTCHA type**: reCAPTCHA v3 (recommended) atau v2
   - **Domains**: ngebengkel.com, www.ngebengkel.com
3. Copy **Site Key** dan **Secret Key**
4. Set `RECAPTCHA_SECRET_KEY` di backend `.env`
5. Set `RECAPTCHA_SITE_KEY` di frontend environment variables

## 🏗️ Arsitektur

### 1. RecaptchaService (`common/services/recaptcha.service.ts`)

Service untuk verify reCAPTCHA tokens dengan Google API.

**Features:**
- Support untuk reCAPTCHA v2 dan v3
- Score validation untuk reCAPTCHA v3 (minimum score: 0.5)
- Action validation untuk reCAPTCHA v3
- IP address tracking
- Error handling dan logging
- Graceful degradation jika secret key tidak di-set (untuk development)

**Methods:**
- `verifyToken(token, remoteIp?, expectedAction?)` - Verify CAPTCHA token
- `isEnabled()` - Check if CAPTCHA is enabled
- `getMinScore()` - Get minimum score untuk v3

### 2. RecaptchaGuard (`common/guards/recaptcha.guard.ts`)

Guard untuk protect endpoints dengan CAPTCHA verification.

**Features:**
- Extract CAPTCHA token dari request body atau headers
- Automatic IP detection
- Skip verification jika CAPTCHA tidak enabled
- Throw BadRequestException jika verification gagal

**Token Sources:**
- `body.recaptchaToken`
- `body.captchaToken`
- `body.recaptcha`
- `headers['x-recaptcha-token']`
- `headers['x-captcha-token']`

### 3. CommonModule (`common/common.module.ts`)

Global module untuk export RecaptchaService dan RecaptchaGuard.

## 📍 Endpoints yang Sudah Dilindungi

### Waiting List Endpoints

| Endpoint | Method | CAPTCHA | Status |
|----------|--------|---------|--------|
| `POST /waiting-list` | POST | ✅ Required | Implemented |

### Auth Endpoints (Optional - bisa ditambahkan)

| Endpoint | Method | CAPTCHA | Status |
|----------|--------|---------|--------|
| `POST /auth/register` | POST | ⚠️ Optional | Not implemented |
| `POST /auth/login` | POST | ⚠️ Optional | Not implemented |
| `POST /auth/forgot-password` | POST | ⚠️ Optional | Not implemented |

## 🔒 Security Features

### 1. Bot Protection
- reCAPTCHA v3: Invisible verification dengan score-based system
- reCAPTCHA v2: Challenge-based verification (jika menggunakan v2)
- Prevents automated form submissions

### 2. Score-Based Verification (v3)
- Minimum score: 0.5 (0.0 = bot, 1.0 = human)
- Action validation untuk ensure token dari action yang benar
- IP address tracking untuk additional security

### 3. Error Handling
- Detailed error logging untuk monitoring
- Generic error messages untuk clients
- Graceful degradation jika CAPTCHA tidak configured

### 4. Development Mode
- Skip verification jika `RECAPTCHA_SECRET_KEY` tidak di-set
- Allows development tanpa CAPTCHA keys

## 📝 DTO Updates

### CreateWaitingListDto

Added fields:
- `recaptchaToken?: string` - reCAPTCHA token dari frontend
- `recaptchaAction?: string` - Action untuk reCAPTCHA v3 (default: 'submit')

**Note:** Token di-remove dari DTO sebelum save ke database.

## 🧪 Testing

### Test dengan Valid Token

```bash
# 1. Get token dari frontend (setelah user complete reCAPTCHA)
# 2. Send request dengan token
curl -X POST http://localhost:4000/api/waiting-list \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workshop",
    "email": "test@example.com",
    "address": "Test Address",
    "city": "Jakarta",
    "district": "Test District",
    "province": "DKI01",
    "subdistrict": "Test Subdistrict",
    "categoryId": "CAT01",
    "workshopTypeIds": ["TYPE01"],
    "recaptchaToken": "VALID_TOKEN_HERE",
    "recaptchaAction": "submit"
  }'
```

### Test tanpa Token (Should Fail)

```bash
curl -X POST http://localhost:4000/api/waiting-list \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workshop",
    "email": "test@example.com",
    ...
  }'
# Expected: 400 Bad Request - CAPTCHA token is required
```

### Test dengan Invalid Token (Should Fail)

```bash
curl -X POST http://localhost:4000/api/waiting-list \
  -H "Content-Type: application/json" \
  -d '{
    ...
    "recaptchaToken": "invalid_token"
  }'
# Expected: 400 Bad Request - CAPTCHA verification failed
```

## 🎨 Frontend Integration

### reCAPTCHA v3 (Recommended)

```typescript
// Install: npm install react-google-recaptcha-v3

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function WaitingListForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (data) => {
    // Execute reCAPTCHA
    const token = await executeRecaptcha('submit');
    
    // Send form data dengan token
    const response = await fetch('/api/waiting-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        recaptchaToken: token,
        recaptchaAction: 'submit',
      }),
    });
  };
}
```

### reCAPTCHA v2

```typescript
import ReCAPTCHA from 'react-google-recaptcha';

function WaitingListForm() {
  const [captchaToken, setCaptchaToken] = useState('');

  const handleSubmit = async (data) => {
    if (!captchaToken) {
      alert('Please complete CAPTCHA');
      return;
    }

    const response = await fetch('/api/waiting-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        recaptchaToken: captchaToken,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={setCaptchaToken}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 📊 Monitoring

### Logging

CAPTCHA verification events di-log dengan level:
- **Debug**: Successful verifications dengan score/action
- **Warn**: Failed verifications dengan error codes
- **Error**: Network errors atau unexpected failures

### Metrics to Monitor

1. **CAPTCHA Success Rate**: Percentage of successful verifications
2. **CAPTCHA Failure Reasons**: Error codes distribution
3. **Average Score (v3)**: Average reCAPTCHA score
4. **Failed Attempts**: Number of failed CAPTCHA attempts

## 🔍 Troubleshooting

### CAPTCHA verification selalu gagal

1. Check `RECAPTCHA_SECRET_KEY` di `.env`
2. Verify secret key matches dengan site key
3. Check domain whitelist di Google reCAPTCHA console
4. Check IP address (jika menggunakan IP restrictions)

### CAPTCHA tidak required di development

- Ini adalah expected behavior jika `RECAPTCHA_SECRET_KEY` tidak di-set
- Set `RECAPTCHA_SECRET_KEY` untuk enable verification

### Score terlalu rendah (v3)

- Adjust `minScore` di `RecaptchaService` jika perlu
- Default: 0.5 (bisa diubah ke 0.3 untuk lebih lenient atau 0.7 untuk lebih strict)

## 📚 Best Practices

1. **Always verify server-side**: Jangan hanya verify di frontend
2. **Use reCAPTCHA v3**: Lebih user-friendly (invisible)
3. **Set appropriate score threshold**: Balance antara security dan UX
4. **Monitor CAPTCHA metrics**: Track success rates dan failures
5. **Handle errors gracefully**: Provide user-friendly error messages
6. **Test thoroughly**: Test dengan valid dan invalid tokens

## 🚀 Production Checklist

Sebelum deploy ke production:
- [ ] Set `RECAPTCHA_SECRET_KEY` di production environment
- [ ] Verify domain whitelist di Google reCAPTCHA console
- [ ] Test CAPTCHA verification dari production domain
- [ ] Monitor CAPTCHA success rates
- [ ] Setup alerts untuk high failure rates
- [ ] Document CAPTCHA configuration untuk team

## 📚 Referensi

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA v3 Guide](https://developers.google.com/recaptcha/docs/v3)
- [NestJS Guards](https://docs.nestjs.com/guards)









