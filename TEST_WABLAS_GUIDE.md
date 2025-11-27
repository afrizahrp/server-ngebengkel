# 🧪 Panduan Test Endpoint Wablas

## 📋 Prerequisites

Pastikan Anda sudah:
- ✅ File `.env` sudah dikonfigurasi dengan benar
- ✅ Nomor test sudah diupdate di `test-wablas-endpoint.ts` (sudah: `628139225637`)

## 🚀 Cara 1: Menggunakan Script Test (Recommended)

### Step 1: Install Dependencies (jika belum)

```bash
cd server-ngebengkel
npm install
```

Atau install secara spesifik:
```bash
npm install ts-node typescript @types/node
```

### Step 2: Pastikan .env Sudah Benar

Pastikan file `.env` di folder `server-ngebengkel` berisi:
```env
WABLAS_API_URL=https://bdg.wablas.com/
WABLAS_API_KEY=aPeNTR5mlzU0FldXT7ZyNXKAIiHsn
WABLAS_SENDER_NAME=Ngebengkel
WABLAS_ENABLED=true
```

### Step 3: Jalankan Test Script

```bash
npx ts-node test-wablas-endpoint.ts
```

Atau jika menggunakan tsx (lebih cepat):
```bash
npx tsx test-wablas-endpoint.ts
```

### Step 4: Lihat Hasil

Script akan mencoba 3 kemungkinan endpoint:

1. **Test 1**: `https://bdg.wablas.com/send-message`
2. **Test 2**: `https://bdg.wablas.com/api/v2/send-message` (jika Test 1 gagal)
3. **Test 3**: `https://bdg.wablas.com/api/send-message` (jika Test 1 & 2 gagal)

**Output yang diharapkan:**

✅ **Jika berhasil:**
```
🧪 Testing Wablas Endpoint...

Configuration:
  API URL: https://bdg.wablas.com/
  API Key: aPeNTR5mlz...
  Test Phone: 628139225637

📤 Test 1: https://bdg.wablas.com/send-message
✅ SUCCESS - Endpoint 1 berhasil!
Response: {
  "status": true,
  "message": "...",
  "data": {...}
}

✅ Endpoint Wablas sudah benar!
```

❌ **Jika gagal:**
```
❌ FAILED - Endpoint 1 gagal
Error: Request failed with status code 404
Status: 404
Response: {...}
```

## 🚀 Cara 2: Menggunakan cURL (Manual Test)

### Test Endpoint 1: `/send-message`

```bash
curl -X POST "https://bdg.wablas.com/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "628139225637",
    "message": "Test verifikasi endpoint Wablas"
  }'
```

### Test Endpoint 2: `/api/v2/send-message` (jika endpoint 1 gagal)

```bash
curl -X POST "https://bdg.wablas.com/api/v2/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "628139225637",
    "message": "Test verifikasi endpoint Wablas"
  }'
```

### Test Endpoint 3: `/api/send-message` (alternatif)

```bash
curl -X POST "https://bdg.wablas.com/api/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "628139225637",
    "message": "Test verifikasi endpoint Wablas"
  }'
```

## 📱 Cara 3: Menggunakan Postman

1. **Buat New Request**
   - Method: `POST`
   - URL: `https://bdg.wablas.com/send-message`

2. **Set Headers**:
   - `Authorization`: `aPeNTR5mlzU0FldXT7ZyNXKAIiHsn`
   - `Content-Type`: `application/json`

3. **Set Body** (raw JSON):
```json
{
  "phone": "628139225637",
  "message": "Test verifikasi endpoint Wablas"
}
```

4. **Click Send** dan lihat response

## ✅ Interpretasi Hasil

### Success Response
```json
{
  "status": true,
  "message": "Message sent successfully",
  "data": {
    // Response dari Wablas
  }
}
```
**Artinya**: ✅ Endpoint sudah benar! Anda akan menerima WhatsApp message di nomor `628139225637`

### Error 404 Not Found
```json
{
  "status": 404,
  "message": "Not Found"
}
```
**Artinya**: ❌ Endpoint salah, coba endpoint lain (Test 2 atau Test 3)

### Error 401 Unauthorized
```json
{
  "status": 401,
  "message": "Unauthorized"
}
```
**Artinya**: ❌ API Key tidak valid atau expired

### Error 400 Bad Request
```json
{
  "status": 400,
  "message": "Bad Request"
}
```
**Artinya**: ❌ Format request salah (cek format nomor telepon)

## 🔧 Troubleshooting

### Error: "Cannot find module 'ts-node'"
**Solusi**:
```bash
npm install -D ts-node typescript @types/node
```

### Error: "Cannot find module 'dotenv'"
**Solusi**:
```bash
npm install dotenv
```

### Error: "ENOENT: no such file or directory, open '.env'"
**Solusi**: Pastikan file `.env` ada di folder `server-ngebengkel`

### Error: "Request timeout"
**Solusi**: 
- Cek koneksi internet
- Cek apakah URL benar
- Cek firewall/proxy

## 📝 Update Konfigurasi Setelah Test

Setelah menemukan endpoint yang benar, update `.env`:

### Jika Test 1 berhasil:
```env
WABLAS_API_URL=https://bdg.wablas.com
```

### Jika Test 2 berhasil:
```env
WABLAS_API_URL=https://bdg.wablas.com/api/v2
```

### Jika Test 3 berhasil:
```env
WABLAS_API_URL=https://bdg.wablas.com/api
```

**Catatan**: Hapus trailing slash (`/`) di akhir URL

## 🎯 Next Steps

Setelah endpoint sudah benar:
1. ✅ Update `.env` dengan base URL yang benar
2. ✅ Restart server jika sedang running
3. ✅ Lanjut implementasi ClaimService untuk OTP

---

**Last Updated**: 2025-01-31

