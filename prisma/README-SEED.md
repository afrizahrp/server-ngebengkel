# 🌱 Database Seed - Bengkel ERP

## 📋 **Deskripsi**

Seed data untuk **1 siklus sederhana** service bengkel:

### **Flow:**

```
1. Customer (Pak Budi) datang ke bengkel
   └─ Kendaraan: Toyota Avanza 2020 (B 1234 XYZ)
   └─ Odometer: 45,123 KM
   └─ Keluhan: "Mesin agak kasar, rem bunyi"

2. Montir (Andi) periksa kendaraan
   └─ Diagnosa: Perlu ganti oli + kampas rem

3. Komunikasi dengan customer
   └─ Parts yang perlu diganti:
      • Oli Shell Helix HX7 5W-30 = Rp 350,000
      • Filter Oli = Rp 65,000
      • Kampas Rem Depan = Rp 650,000
   └─ Jasa service:
      • Ganti Oli = Rp 150,000
      • Ganti Kampas Rem = Rp 200,000

4. Customer setuju ✅

5. Admin keluarkan parts dari stock
   └─ Update inventory

6. Montir kerjakan service
   └─ Status: PENDING → IN_PROGRESS → COMPLETED

7. Konfirmasi final dengan customer

8. Admin cetak invoice
   └─ Invoice: INV/2025/10/00001
   └─ Total: Rp 1,570,650 (termasuk PPN 11%)
```

---

## 📦 **Data yang Di-seed:**

### **1. Master Data:**

- ✅ Company: **Bengkel Inovasi Prima**
- ✅ Users: Admin Budi, Mekanik Andi
- ✅ Roles: Administrator, Mekanik
- ✅ Warehouse: WH01 (Warehouse Utama)
  - Floor: FL01 (Lantai 1)
  - Shelf: SH01 (Rak A)
  - Row: RW01 (Baris 1)

### **2. Product Master:**

- ✅ UOM: PCS, LITER
- ✅ Category: Oil & Lubricants
- ✅ Brand: Shell
- ✅ Products:
  1. Shell Helix HX7 5W-30 4L (Stock: 50, Price: Rp 350,000)
  2. Filter Oli Toyota (Stock: 100, Price: Rp 65,000)
  3. Kampas Rem Depan Avanza (Stock: 30, Price: Rp 650,000)

### **3. Vehicle Master:**

- ✅ Vehicle Type: Mobil
- ✅ Vehicle Brand: Toyota
- ✅ Vehicle Model: Avanza

### **4. Customer:**

- ✅ Customer: **Budi Santoso**
  - Mobile: 081234567890
  - Email: budi.santoso@email.com
  - Address: Jl. Sudirman No. 456, Jakarta

- ✅ Vehicle: **Toyota Avanza 2020**
  - Plat: B 1234 XYZ
  - Color: Silver
  - Odometer: 45,000 KM

### **5. Workshop:**

- ✅ Employee: **Andi Wijaya** (EMP-001)
  - Department: Service
  - Position: Mechanic
  - Employment Status: Permanent
  - Email: andi.wijaya@ngebengkel.com
  - Join Date: 01 Jan 2020
- ✅ Mechanic Profile: **Andi Wijaya** (SENIOR)
  - Specialization: Mesin & Elektrik
  - Level: SENIOR
  - Total Jobs: 0 (baru mulai tracking)
- ✅ Service Bay: Bay 1
- ✅ Service Types:
  - Ganti Oli Mesin (Rp 150,000)
  - Ganti Kampas Rem (Rp 200,000)

### **6. Payment & Tax:**

- ✅ Payment Methods: CASH, TRANSFER, QRIS
- ✅ Tax Scheme: T1 (PPN 11%)

### **7. COA (Chart of Account):**

- ✅ 1-1100: Kas
- ✅ 1-1200: Piutang Usaha
- ✅ 2-3000: PPN Keluaran
- ✅ 4-1000: Pendapatan Jasa Service
- ✅ 4-2000: Pendapatan Penjualan Spare Parts

### **8. Transaksi:**

- ✅ **Service Order:** SO/2025/10/00001
  - Status: CONFIRMED
  - Mechanic: Andi
  - Bay: Bay 1
- ✅ **Service Order Details (5 items):**
  1. Ganti Oli Mesin (SERVICE) - Rp 150,000
  2. Shell Helix HX7 (PART) - Rp 350,000
  3. Filter Oli (PART) - Rp 65,000
  4. Ganti Kampas Rem (SERVICE) - Rp 200,000
  5. Kampas Rem Depan (PART) - Rp 650,000

- ✅ **Invoice:** INV/2025/10/00001
  - Subtotal: Rp 1,415,000
  - PPN 11%: Rp 155,650
  - **Total: Rp 1,570,650**
  - Status: SENT (belum dibayar)

---

## 🚀 **Cara Menjalankan Seed:**

### **Prerequisite:**

```bash
# 1. Generate Prisma Client dulu
npx prisma generate

# 2. Buat database (jika belum ada)
npx prisma db push
```

### **Run Seed:**

```bash
# Option 1: Via Prisma CLI
npx prisma db seed

# Option 2: Via ts-node
npx ts-node prisma/seed.ts

# Option 3: Via tsx (lebih cepat)
npx tsx prisma/seed.ts
```

---

## 📝 **Catatan:**

1. **Upsert Strategy**: Menggunakan `upsert` agar bisa dijalankan multiple kali tanpa error duplikat
2. **Composite Keys**: Hati-hati dengan composite primary keys (company_id + id)
3. **Foreign Keys**: Data di-seed dengan urutan yang benar (parent dulu, child kemudian)
4. **Status**: Semua data dibuat dengan status 'Active'
5. **Timestamps**: Menggunakan `new Date()` untuk createdAt/updatedAt

---

## 🎯 **Next Steps Setelah Seed:**

### **1. Update Service Order Status:**

```typescript
// Montir mulai kerja
await prisma.wks_ServiceOrder.update({
  where: { ... },
  data: {
    orderStatus: 'IN_PROGRESS',
    actualStartDate: new Date()
  }
})
```

### **2. Update Stock setelah Parts diambil:**

```typescript
// Kurangi stock oli
await prisma.imc_ProductStock.update({
  where: { ... },
  data: {
    onhand_qty: { decrement: 1 }
  }
})
```

### **3. Complete Service:**

```typescript
// Service selesai
await prisma.wks_ServiceOrder.update({
  where: { ... },
  data: {
    orderStatus: 'COMPLETED',
    actualEndDate: new Date(),
    customerRating: 5
  }
})
```

### **4. Payment:**

```typescript
// Customer bayar via QRIS
await prisma.arm_Payment.create({
  data: {
    // ... payment data
    paymentMethod_id: 'QRIS',
  },
});
```

### **5. Post ke GL:**

```typescript
// Auto-posting ke General Ledger
await prisma.acc_GLTrans.create({
  data: {
    // ... journal entry
    // Debit: Account Receivable
    // Credit: Service Revenue
    // Credit: PPN Keluaran
  },
});
```

---

## 🧪 **Testing:**

Setelah seed, coba query:

```typescript
// List semua service orders
const orders = await prisma.wks_ServiceOrder.findMany({
  include: {
    customer: true,
    vehicle: true,
    mechanic: true,
    orderDetails: true,
  },
});

// List invoice yang outstanding
const invoices = await prisma.arm_Invoice.findMany({
  where: {
    paymentStatus: 'UNPAID',
  },
});
```

---

## ✅ **Expected Result:**

Setelah seed berhasil, Anda akan punya:

- 1 Company
- 2 Users (Admin + Mekanik)
- 1 Employee (Andi Wijaya)
- 1 Mechanic profile (untuk Andi)
- 1 Customer dengan 1 kendaraan
- 3 Products dengan stock
- 1 Service Order dengan 5 detail items
- 1 Invoice siap untuk dibayar

**Ready untuk implementasi hooks!** 🚀
