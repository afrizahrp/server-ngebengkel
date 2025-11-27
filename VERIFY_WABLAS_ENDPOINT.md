# 🔍 Cara Memastikan Endpoint Wablas Benar

## 📋 Overview

Dari konfigurasi Anda:
- `WABLAS_API_URL=https://bdg.wablas.com/`
- `WABLAS_API_KEY=aPeNTR5mlzU0FldXT7ZyNXKAIiHsn`

Service akan mencoba endpoint: `https://bdg.wablas.com/send-message`

## 🧪 Cara Test Endpoint

### Metode 1: Menggunakan Script Test (Recommended)

1. **Install dependencies** (jika belum):
```bash
cd server-ngebengkel
npm install axios dotenv
```

2. **Update nomor test** di file `test-wablas-endpoint.ts`:
```typescript
const TEST_PHONE = '6281234567890'; // Ganti dengan nomor WhatsApp Anda
```

3. **Run script**:
```bash
npx ts-node test-wablas-endpoint.ts
```

Script akan mencoba 3 kemungkinan endpoint:
- `https://bdg.wablas.com/send-message`
- `https://bdg.wablas.com/api/v2/send-message`
- `https://bdg.wablas.com/api/send-message`

### Metode 2: Menggunakan cURL (Manual Test)

#### Test Endpoint 1: `/send-message`
```bash
curl -X POST "https://bdg.wablas.com/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "6281234567890",
    "message": "Test message untuk verifikasi endpoint"
  }'
```

#### Test Endpoint 2: `/api/v2/send-message` (jika endpoint 1 gagal)
```bash
curl -X POST "https://bdg.wablas.com/api/v2/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "6281234567890",
    "message": "Test message untuk verifikasi endpoint"
  }'
```

#### Test Endpoint 3: `/api/send-message` (alternatif)
```bash
curl -X POST "https://bdg.wablas.com/api/send-message" \
  -H "Authorization: aPeNTR5mlzU0FldXT7ZyNXKAIiHsn" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "6281234567890",
    "message": "Test message untuk verifikasi endpoint"
  }'
```

### Metode 3: Menggunakan Postman

1. **Buat request baru**:
   - Method: `POST`
   - URL: `https://bdg.wablas.com/send-message`

2. **Set Headers**:
   - `Authorization`: `aPeNTR5mlzU0FldXT7ZyNXKAIiHsn`
   - `Content-Type`: `application/json`

3. **Set Body** (raw JSON):
```json
{
  "phone": "6281234567890",
  "message": "Test message untuk verifikasi endpoint"
}
```

4. **Send request** dan lihat response

## ✅ Response yang Diharapkan

### Success Response
```json
{
  "status": true,
  "message": "Message sent successfully",
  "data": {
    // Response dari Wablas API
  }
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message",
  "error": "Detail error"
}
```

## 🔍 Troubleshooting

### Error: 404 Not Found
**Masalah**: Endpoint tidak ditemukan
**Solusi**: 
- Cek apakah endpoint perlu path tambahan (`/api/v2` atau `/api`)
- Hubungi support Wablas untuk konfirmasi endpoint yang benar

### Error: 401 Unauthorized
**Masalah**: API Key tidak valid
**Solusi**:
- Pastikan API Key benar
- Cek apakah API Key masih aktif di dashboard Wablas

### Error: 400 Bad Request
**Masalah**: Format request tidak sesuai
**Solusi**:
- Pastikan format nomor telepon benar (62xxxxxxxxxxx)
- Pastikan body request sesuai format Wablas

### Error: Connection Timeout
**Masalah**: Tidak bisa connect ke server
**Solusi**:
- Cek koneksi internet
- Cek apakah URL benar
- Cek firewall/proxy settings

## 📚 Sumber Informasi

1. **Dashboard Wablas**: Login ke dashboard dan cek dokumentasi API
2. **Dokumentasi Wablas**: https://doc.wablas.com
3. **Support Wablas**: Hubungi support untuk konfirmasi endpoint

## 💡 Catatan Penting

1. **Format Nomor Telepon**: 
   - Harus format internasional: `62xxxxxxxxxxx`
   - Contoh: `081234567890` → `6281234567890`

2. **API Key**:
   - Jangan commit API key ke repository
   - Simpan di `.env` file

3. **Endpoint Path**:
   - WablasService menggunakan path `/send-message`
   - Base URL dari `WABLAS_API_URL`
   - Jadi endpoint lengkap: `{WABLAS_API_URL}/send-message`

## 🔄 Update Konfigurasi

Setelah menemukan endpoint yang benar, update `.env`:

```env
# Jika endpoint yang benar adalah: https://bdg.wablas.com/api/v2/send-message
# Maka base URL harus: https://bdg.wablas.com/api/v2
WABLAS_API_URL=https://bdg.wablas.com/api/v2

# Atau jika endpoint yang benar adalah: https://bdg.wablas.com/send-message
# Maka base URL tetap: https://bdg.wablas.com
WABLAS_API_URL=https://bdg.wablas.com
```

---

**Last Updated**: 2025-01-31

