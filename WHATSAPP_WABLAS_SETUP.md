# 📱 WhatsApp Integration dengan Wablas - Setup Guide

## 📋 Overview

Fitur integrasi WhatsApp menggunakan **Wablas API** untuk:

1. ✅ **Reminder Notification** - Kirim reminder untuk service order yang akan datang
2. ✅ **Invoice & Struk** - Kirim invoice dan struk via WhatsApp

## 🚀 Setup

### 1. Daftar Wablas Account

1. Kunjungi [https://www.wablas.com](https://www.wablas.com)
2. Daftar akun dan pilih paket yang sesuai
3. Dapatkan **API Key** dari dashboard Wablas

### 2. Konfigurasi Environment Variables

Tambahkan ke file `.env`:

```env
# Wablas Configuration
WABLAS_API_URL=https://api.wablas.com/api/v2
WABLAS_API_KEY=your_wablas_api_key_here
WABLAS_SENDER_NAME=Ngebengkel
WABLAS_ENABLED=true
```

### 3. Cara Menggunakan

#### A. Kirim Reminder Service Order

**Endpoint:**

```
POST /api/service-orders/:id/send-reminder?company_id=XXX
```

**Contoh Request:**

```bash
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-reminder?company_id=COMP01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Reminder berhasil dikirim"
}
```

#### B. Kirim Invoice via WhatsApp

**Endpoint:**

```
POST /api/service-orders/:id/send-invoice?company_id=XXX&type=invoice
```

**Query Parameters:**

- `company_id` (required) - Company ID
- `type` (optional) - `invoice` atau `struk` (default: `invoice`)

**Contoh Request:**

```bash
# Kirim Invoice
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-invoice?company_id=COMP01&type=invoice" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Kirim Struk
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-invoice?company_id=COMP01&type=struk" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Invoice berhasil dikirim via WhatsApp",
  "phone": "6281234567890"
}
```

## 📱 Format Pesan

### Reminder Message Format

```
╔══════════════════════════════════╗
║    🔔 REMINDER SERVICE ORDER     ║
╚══════════════════════════════════╝

Halo *Nama Customer* 👋

Kami ingin mengingatkan Anda tentang service order:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 No. Order: *SO/2025/10/00001*
🚗 Kendaraan: *B 1234 XYZ*
📅 Jadwal Service: *15 Januari 2025* pukul *10:00*

📝 Keluhan:
Mesin agak kasar, rem bunyi

🔧 Service Request:
Perlu ganti oli dan kampas rem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mohon datang tepat waktu ya! 🙏

Jika ada perubahan jadwal, silakan hubungi kami.

Terima kasih!

---
🔧 Ngebengkel
```

### Invoice Format

Invoice dikirim dalam format text yang sudah diformat dengan baik, termasuk:

- Informasi order (nomor, tanggal, waktu)
- Data customer
- Data kendaraan
- Detail service & part
- Ringkasan pembayaran

### Struk Format

Struk adalah versi sederhana dari invoice, cocok untuk pengiriman cepat.

## 🔧 Technical Details

### File Structure

```
src/
├── whatsapp/
│   ├── config/
│   │   └── wablas.config.ts       # Config untuk Wablas
│   ├── wablas.service.ts          # Service untuk API Wablas
│   └── whatsapp.module.ts         # WhatsApp Module
└── wks/
    └── service-order/
        ├── services/
        │   ├── reminder.service.ts           # Reminder service
        │   └── invoice-generator.service.ts   # Invoice generator
        └── service-order.service.ts          # Updated dengan fungsi WA
```

### Services

#### WablasService

- `sendTextMessage(phone, message)` - Kirim pesan teks
- `sendImageMessage(phone, message, imageUrl)` - Kirim gambar
- `sendDocumentMessage(phone, message, documentUrl, fileName)` - Kirim dokumen
- `formatPhoneNumber(phone)` - Format nomor ke format internasional (62xxx)

#### ReminderService

- `sendServiceOrderReminder(serviceOrderId, companyId)` - Kirim reminder
- `sendUpcomingServiceReminders(hoursBefore)` - Kirim reminder untuk semua order yang akan datang

#### InvoiceGeneratorService

- `generateInvoiceText(serviceOrder)` - Generate invoice text
- `generateStrukText(serviceOrder)` - Generate struk text

## 📞 Format Nomor Telepon

Service ini otomatis memformat nomor telepon ke format internasional:

- `081234567890` → `6281234567890`
- `+6281234567890` → `6281234567890`
- `81234567890` → `6281234567890`

## ⚠️ Important Notes

1. **Wablas API Key**: Pastikan API key valid dan aktif
2. **Phone Number**: Customer harus memiliki nomor telepon (`mobile1`) di database
3. **Rate Limiting**: Wablas memiliki rate limit, gunakan delay jika mengirim banyak pesan
4. **Disabled Mode**: Set `WABLAS_ENABLED=false` untuk disable (untuk development)

## 🧪 Testing

### Test dengan Dummy Data

1. Pastikan service order sudah dibuat dengan customer yang punya nomor telepon
2. Test kirim reminder:

```bash
POST /api/service-orders/{orderId}/send-reminder?company_id={companyId}
```

3. Test kirim invoice:

```bash
POST /api/service-orders/{orderId}/send-invoice?company_id={companyId}&type=invoice
```

### Error Handling

Service akan return error jika:

- Wablas tidak dikonfigurasi dengan benar
- Customer tidak memiliki nomor telepon
- Service order tidak ditemukan
- API Wablas mengembalikan error

## 🔐 Security

- ✅ Semua endpoint protected dengan JWT authentication
- ✅ API key disimpan di environment variables
- ✅ Validasi nomor telepon
- ✅ Error logging untuk debugging

## 📊 Scheduled Reminders (Future Enhancement)

Untuk mengirim reminder otomatis, bisa menggunakan NestJS Schedule:

```typescript
@Cron('0 9 * * *') // Setiap hari jam 9 pagi
async sendDailyReminders() {
  await this.reminderService.sendUpcomingServiceReminders(24);
}
```

## 🐛 Troubleshooting

### Error: "Wablas API key is not configured"

- Pastikan `WABLAS_API_KEY` sudah di-set di `.env`
- Restart server setelah update `.env`

### Error: "Customer tidak memiliki nomor telepon"

- Pastikan customer memiliki field `mobile1` yang terisi
- Update customer data jika perlu

### Error: "Failed to send WhatsApp message"

- Cek koneksi internet
- Verifikasi API key masih valid
- Cek dashboard Wablas untuk status akun

## 📚 Resources

- [Wablas Documentation](https://doc.wablas.com)
- [Wablas Dashboard](https://www.wablas.com/dashboard)
- [NestJS Documentation](https://docs.nestjs.com)

---

**Last Updated**: 2025-01-31
**Version**: 1.0.0-MVP


