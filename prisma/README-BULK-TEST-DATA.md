# 🌱 Bulk Test Data untuk Pagination, Sorting, Search, Filter

## 📋 Deskripsi

Script SQL ini akan menambahkan **bulk test data** untuk keperluan testing fungsi:
- ✅ Pagination
- ✅ Sorting (sortfieldby)
- ✅ Search (searchcondition)
- ✅ Filtered Parameters (filteredparams)
- ✅ Numbering

## 📦 Data yang Di-seed

### 1. **5 Customers** (Individual & Corporate)
- CUST-001: Budi Santoso (Individual)
- CUST-002: Siti Nurhaliza (Individual)
- CUST-003: Ahmad Dahlan (Individual)
- CUST-004: Rahma Widya (Individual)
- CUST-005: PT Maju Bersama (Corporate)

### 2. **5 Customer Vehicles** (1 per customer)
- VEH-001: Toyota Avanza 2020 - B 1234 ABC
- VEH-002: Honda Jazz 2021 - D 5678 DEF
- VEH-003: Toyota Innova 2019 - B 9012 GHI
- VEH-004: Honda CRV 2022 - L 3456 JKL
- VEH-005: Toyota Fortuner 2021 - B 7890 MNO

### 3. **10 Service Bookings** (Spread across different dates & statuses)
- BKG-001: PENDING - Booking 10 hari lalu
- BKG-002: CONFIRMED - Booking 9 hari lalu
- BKG-003: CHECKED_IN - Booking 8 hari lalu
- BKG-004: CONFIRMED - Booking 7 hari lalu
- BKG-005: PENDING - Booking 6 hari lalu
- BKG-006: CONFIRMED - Booking 5 hari lalu
- BKG-007: CHECKED_IN - Booking 4 hari lalu
- BKG-008: CONFIRMED - Booking 3 hari lalu
- BKG-009: PENDING - Booking 2 hari lalu
- BKG-010: CONFIRMED - Booking 1 hari lalu

### 4. **10 Service Orders** (Spread across different statuses & customers)
- SO-001: COMPLETED, PAID - Order 10 hari lalu
- SO-002: QC_CHECK, PARTIAL - Order 9 hari lalu
- SO-003: COMPLETED, PAID - Order 8 hari lalu
- SO-004: CONFIRMED, UNPAID - Order 7 hari lalu
- SO-005: COMPLETED, PAID - Order 6 hari lalu
- SO-006: IN_PROGRESS, UNPAID - Order 5 hari lalu
- SO-007: ON_HOLD, UNPAID - Order 4 hari lalu
- SO-008: IN_PROGRESS, UNPAID - Order 3 hari lalu
- SO-009: COMPLETED, PAID - Order 2 hari lalu
- SO-010: DRAFT, UNPAID - Order 1 hari lalu

### 5. **10 Reminders** (Various types & statuses)
- REM-001: PENDING - Reminder untuk SO-001
- REM-002: SCHEDULED - Reminder untuk Booking BKG-002
- REM-003: SENT - Reminder untuk SO-003 (Due)
- REM-004: PENDING - Reminder untuk Booking BKG-004
- REM-005: PENDING - Reminder untuk SO-005
- REM-006: PENDING - Reminder Payment Due
- REM-007: SCHEDULED - Reminder untuk Booking BKG-007
- REM-008: PENDING - Reminder Follow Up SO-008
- REM-009: PENDING - Reminder Vehicle Maintenance
- REM-010: PENDING - Custom Reminder

## 🚀 Cara Menjalankan

### **Prerequisite**
Pastikan database sudah ada dan company/branch sudah di-seed:
- Company ID: `00001`
- Branch ID: `BR001`

### **Option 1: Via PostgreSQL Client (psql)**

```bash
# Login ke PostgreSQL
psql -U postgres -d ngebengkel_db

# Jalankan script
\i prisma/seed-bulk-test-data.sql
```

### **Option 2: Via DBeaver/DataGrip/Adminer**

1. Buka tool database client
2. Connect ke database
3. Buka file `seed-bulk-test-data.sql`
4. Execute script

### **Option 3: Via Prisma CLI (direct SQL)**

```bash
# Set DATABASE_URL dulu
export DATABASE_URL="postgresql://user:password@localhost:5432/ngebengkel_db"

# Execute SQL script via Prisma
npx prisma db execute --file ./prisma/seed-bulk-test-data.sql --schema ./prisma/schema.prisma
```

### **Option 4: Via Node.js (custom script)**

Buat file `run-bulk-seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  const sql = readFileSync(
    join(__dirname, 'seed-bulk-test-data.sql'),
    'utf-8'
  );
  
  await prisma.$executeRawUnsafe(sql);
  console.log('✅ Bulk test data seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Kemudian jalankan:
```bash
npx tsx prisma/run-bulk-seed.ts
```

## 🧪 Testing Pagination, Sorting, Search, Filter

Setelah data di-seed, Anda bisa test dengan:

### **1. Test Pagination**
```bash
# Test dengan limit=5
GET /api/service-orders?page=1&limit=5

# Test dengan limit=10
GET /api/service-orders?page=1&limit=10
```

### **2. Test Sorting**
```bash
# Sort by orderNumber ascending
GET /api/service-orders?orderBy=orderNumber&orderDir=ASC

# Sort by orderDate descending
GET /api/service-orders?orderBy=orderDate&orderDir=DESC

# Sort by totalAmount descending
GET /api/service-orders?orderBy=totalAmount&orderDir=DESC
```

### **3. Test Search**
```bash
# Search by customer name
GET /api/service-orders?searchBy=customerName&searchTerm=Budi

# Search by order number
GET /api/service-orders?searchBy=orderNumber&searchTerm=SO-2025

# Search by complaint notes
GET /api/bookings?searchBy=complaintNotes&searchTerm=rem
```

### **4. Test Filtered Parameters**
```bash
# Filter by status
GET /api/service-orders?filteredparams={"status":["COMPLETED","CONFIRMED"]}

# Filter by customer
GET /api/service-orders?filteredparams={"customer_id":["CUST-001","CUST-002"]}

# Filter by date range
GET /api/bookings?filteredparams={"start_date":"2025-01-01","end_date":"2025-01-31"}

# Combined filters
GET /api/service-orders?filteredparams={"status":["COMPLETED"],"customer_id":["CUST-001"],"start_date":"2025-01-01","end_date":"2025-01-31"}
```

### **5. Test Reminders**
```bash
# Get all reminders with pagination
GET /api/reminders?page=1&limit=10

# Filter by entity type
GET /api/reminders?filteredparams={"entityType":["SO","BK"]}

# Filter by status
GET /api/reminders?filteredparams={"status":["PENDING","SCHEDULED"]}

# Search by customer name
GET /api/reminders?searchBy=customerName&searchTerm=Budi
```

## 🗑️ Clean Up (Optional)

Jika ingin menghapus data test:

```sql
-- Hapus reminders
DELETE FROM "sys_Reminder" WHERE "company_id" = '00001' AND "id" LIKE 'REM-%';

-- Hapus service orders
DELETE FROM "wks_ServiceOrder" WHERE "company_id" = '00001' AND "id" LIKE 'SO-%';

-- Hapus bookings
DELETE FROM "wks_ServiceBooking" WHERE "company_id" = '00001' AND "id" LIKE 'BKG-%';

-- Hapus customer vehicles
DELETE FROM "cmf_CustomerVehicle" WHERE "company_id" = '00001' AND "id" LIKE 'VEH-%';

-- Hapus customers
DELETE FROM "cmf_Customer" WHERE "company_id" = '00001' AND "id" LIKE 'CUST-00%';
```

## ✅ Expected Result

Setelah seed berhasil, Anda akan punya:

- ✅ **5 customers** dengan data lengkap (nama, email, mobile, address)
- ✅ **5 customer vehicles** dengan berbagai merk & model
- ✅ **10 bookings** dengan status berbeda-beda dan tanggal bervariasi
- ✅ **10 service orders** dengan status payment dan order yang bervariasi
- ✅ **10 reminders** dengan berbagai entity type dan reminder type

**Siap untuk testing pagination, sorting, search, dan filter!** 🚀

## 📝 Notes

1. **ON CONFLICT DO NOTHING**: Master data (vehicle types, brands, models) menggunakan `ON CONFLICT DO NOTHING` agar aman dijalankan berulang kali
2. **Unique Constraints**: Pastikan tidak ada duplicate ID untuk customers, bookings, orders, dan reminders
3. **Foreign Keys**: Semua foreign key relationships sudah terpenuhi (customer → vehicle → booking/order)
4. **Dates**: Menggunakan `NOW()` dan interval untuk variasi tanggal
5. **Status Enum**: Menggunakan nilai enum yang sesuai dengan schema (0, 1, 2, 5, 9 untuk booking/service order status)





