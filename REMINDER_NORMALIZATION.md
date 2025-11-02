# Reminder Normalization - Tabel Terpusat untuk Reminder

## Overview

Reminder telah dinormalisasi ke tabel terpusat `sys_Reminder` yang reusable untuk berbagai entity types. Ini membuat sistem reminder lebih maintainable, extensible, dan bisa di-track dengan lebih baik.

## Masalah Sebelumnya

Sebelum normalisasi, reminder data tersebar di beberapa tabel:

- `wks_ServiceBooking.reminderSent` - hanya boolean, tidak ada detail
- `cmf_CustomerVehicle.nextServiceDate`, `nextServiceOdometer` - tidak bisa track pengiriman
- `wks_ServiceHistory.nextServiceDate`, `nextServiceOdometer` - tidak bisa track pengiriman

**Masalah:**

- Tidak ada history tracking pengiriman reminder
- Tidak bisa track multiple channels (WhatsApp, Email, SMS)
- Tidak bisa retry jika gagal
- Tidak reusable untuk entity types lainnya
- Sulit maintain dan extend

## Solusi: Tabel Terpusat `sys_Reminder`

### Struktur Tabel

#### `sys_Reminder` - Tabel utama reminder

- **Polymorphic relation** via `entityType` + `entity_id` - support berbagai entity types
- **Multiple channels** - WhatsApp, Email, SMS (bisa multiple)
- **Scheduling** - dengan `scheduledDate`, `scheduledTime`, `sendBeforeDays`, `sendBeforeHours`
- **Status tracking** - PENDING, SCHEDULED, SENT, FAILED, CANCELLED
- **Retry mechanism** - dengan `maxRetries`, `retryCount`
- **Response tracking** - `isRead`, `actionTaken`
- **Recurring support** - `isRecurring`, `recurringInterval`
- **Metadata** - JSON field untuk data tambahan yang flexible

#### `sys_ReminderLog` - History semua pengiriman

- Track setiap attempt pengiriman
- Response dari provider (WhatsApp API, Email service, dll)
- Error message jika gagal
- External ID dari provider

### Entity Types yang Didukung

- `SERVICE_ORDER` - Reminder untuk service order
- `BOOKING` - Reminder untuk booking
- `SERVICE_HISTORY` - Reminder service berikutnya berdasarkan history
- `VEHICLE_MAINTENANCE` - Reminder maintenance kendaraan
- `SUBSCRIPTION` - Reminder subscription expiry
- `PAYMENT` - Reminder payment due
- `CUSTOM` - Custom reminder

### Reminder Types

- `SCHEDULED_SERVICE` - Reminder service yang dijadwalkan
- `SERVICE_DUE` - Reminder service sudah due
- `APPOINTMENT` - Reminder appointment/booking
- `PAYMENT_DUE` - Reminder payment due
- `SUBSCRIPTION_EXPIRY` - Reminder subscription akan expired
- `FOLLOW_UP` - Follow-up reminder
- `CUSTOM` - Custom reminder

### Channels

- `WHATSAPP` - Via WhatsApp
- `EMAIL` - Via Email
- `SMS` - Via SMS

## Cara Menggunakan

### 1. Membuat Reminder untuk Service Order

```typescript
const reminder = await prisma.sys_Reminder.create({
  data: {
    id: generateReminderId(),
    reminderNumber: generateReminderNumber(),
    entityType: 'SERVICE_ORDER',
    entity_id: serviceOrderId,
    reminderType: 'SCHEDULED_SERVICE',
    title: 'Reminder Service Order',
    message: 'Pengingat jadwal service...',
    scheduledDate: serviceOrder.scheduledStartDate,
    sendBeforeHours: 24, // Kirim 24 jam sebelum
    customer_id: serviceOrder.customer_id,
    recipientPhone: customer.mobile1,
    recipientEmail: customer.email,
    channel: ['WHATSAPP', 'EMAIL'], // Multiple channels
    status: 'PENDING',
    company_id: companyId,
    branch_id: branchId,
    metadata: {
      orderNumber: serviceOrder.orderNumber,
      vehiclePlate: vehicle.licensePlate,
    },
  },
});
```

### 2. Mengirim Reminder

```typescript
async function sendReminder(reminderId: string) {
  const reminder = await prisma.sys_Reminder.findUnique({
    where: { company_id_id: { company_id, id: reminderId } },
    include: { customer: true },
  });

  const channels = reminder.channel;

  for (const channel of channels) {
    try {
      let result;
      if (channel === 'WHATSAPP') {
        result = await wablasService.sendTextMessage(
          reminder.recipientPhone,
          reminder.message,
        );
      } else if (channel === 'EMAIL') {
        result = await emailService.sendEmail(
          reminder.recipientEmail,
          reminder.title,
          reminder.message,
        );
      }
      // ... SMS handling

      // Log pengiriman
      await prisma.sys_ReminderLog.create({
        data: {
          id: generateLogId(),
          reminder_id: reminderId,
          logType: result.success ? 'SENT' : 'FAILED',
          channel: channel,
          sentAt: new Date(),
          message: reminder.message,
          recipient:
            channel === 'WHATSAPP'
              ? reminder.recipientPhone
              : reminder.recipientEmail,
          status: result.success ? 'Success' : 'Failed',
          responseCode: result.code,
          responseMessage: result.message,
          externalId: result.externalId,
          company_id: reminder.company_id,
          branch_id: reminder.branch_id,
        },
      });

      // Update reminder status
      await prisma.sys_Reminder.update({
        where: { company_id_id: { company_id, id: reminderId } },
        data: {
          status: result.success ? 'SENT' : 'FAILED',
          lastSentAt: result.success ? new Date() : undefined,
          lastAttemptAt: new Date(),
          sentCount: { increment: 1 },
          failureReason: result.success ? null : result.message,
        },
      });
    } catch (error) {
      // Handle error
    }
  }
}
```

### 3. Scheduled Job untuk Reminder Otomatis

```typescript
async function processPendingReminders() {
  const now = new Date();

  // Cari reminder yang sudah waktunya dikirim
  const pendingReminders = await prisma.sys_Reminder.findMany({
    where: {
      status: { in: ['PENDING', 'SCHEDULED'] },
      scheduledDate: { lte: now },
      OR: [
        { lastSentAt: null }, // Belum pernah dikirim
        {
          retryCount: { lt: prisma.sys_Reminder.fields.maxRetries },
          status: 'FAILED',
        },
      ],
    },
  });

  for (const reminder of pendingReminders) {
    await sendReminder(reminder.id);
  }
}
```

### 4. Query Reminder untuk Entity Tertentu

```typescript
// Get semua reminder untuk service order
const serviceOrderReminders = await prisma.sys_Reminder.findMany({
  where: {
    entityType: 'SERVICE_ORDER',
    entity_id: serviceOrderId,
    company_id: companyId,
  },
  include: {
    reminderLogs: {
      orderBy: { sentAt: 'desc' },
    },
  },
});
```

## Migration Strategy

### Step 1: Backup Data Existing

Sebelum migrate, backup data reminder yang ada di:

- `wks_ServiceBooking.reminderSent`
- `cmf_CustomerVehicle.nextServiceDate`, `nextServiceOdometer`
- `wks_ServiceHistory.nextServiceDate`, `nextServiceOdometer`

### Step 2: Migrate Existing Data

Buat script migration untuk memindahkan data existing ke `sys_Reminder`:

```typescript
// Migrate ServiceBooking reminders
const bookings = await prisma.wks_ServiceBooking.findMany({
  where: { reminderSent: true },
});

for (const booking of bookings) {
  await prisma.sys_Reminder.create({
    data: {
      // ... map dari booking ke reminder
      entityType: 'BOOKING',
      entity_id: booking.id,
      status: 'SENT', // Karena sudah dikirim sebelumnya
      // ...
    },
  });
}

// Similar untuk CustomerVehicle dan ServiceHistory
```

### Step 3: Update Service Code

- Update `ReminderService` untuk menggunakan `sys_Reminder`
- Update semua query yang menggunakan reminder fields lama
- Update UI untuk show reminder dari `sys_Reminder`

### Step 4: Deprecate Old Fields

Setelah migration selesai:

- Fields lama bisa di-soft deprecate (tidak digunakan tapi tetap ada untuk backward compatibility)
- Atau bisa dihapus setelah yakin tidak ada yang menggunakan

## Benefits

✅ **Reusable** - Bisa digunakan untuk berbagai entity types
✅ **Maintainable** - Semua logic reminder di satu tempat
✅ **Extensible** - Mudah tambah entity types atau reminder types baru
✅ **Trackable** - Full history tracking dengan `sys_ReminderLog`
✅ **Multiple Channels** - Support WhatsApp, Email, SMS
✅ **Retry Mechanism** - Auto retry jika gagal
✅ **Response Tracking** - Track apakah sudah dibaca atau action sudah dilakukan
✅ **Recurring Support** - Support recurring reminders

## Next Steps

1. ✅ Schema sudah dibuat
2. ⏳ Buat migration script untuk data existing
3. ⏳ Update `ReminderService` untuk menggunakan `sys_Reminder`
4. ⏳ Update UI untuk menampilkan reminder dari tabel baru
5. ⏳ Create scheduled job untuk process pending reminders
6. ⏳ Testing
