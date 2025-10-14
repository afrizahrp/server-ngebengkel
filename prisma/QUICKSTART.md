# 🚀 Quick Start - Bengkel ERP

## 📋 **Setup Database & Seed**

### **Step 1: Install Dependencies**

```bash
npm install
```

Ini akan install:

- Prisma Client
- tsx (untuk run TypeScript seed)
- All dependencies

---

### **Step 2: Setup Environment Variable**

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ngebengkel_db"
```

**Contoh untuk berbagai provider:**

**Local PostgreSQL:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ngebengkel_db"
```

**Supabase:**

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Neon:**

```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

---

### **Step 3: Generate Prisma Client**

```bash
npm run db:generate
```

Atau:

```bash
npx prisma generate
```

Ini akan generate Prisma Client di `lib/generated/prisma`

---

### **Step 4: Push Schema ke Database**

```bash
npm run db:push
```

Atau:

```bash
npx prisma db push
```

⚠️ **Warning:** `db push` akan **overwrite** database. Untuk production, gunakan migrations.

---

### **Step 5: Run Seed**

```bash
npm run db:seed
```

Atau:

```bash
npx prisma db seed
```

Atau langsung:

```bash
npx tsx prisma/seed.ts
```

---

## ✅ **Expected Output:**

```
🌱 Starting seed...
📍 Seeding Company...
✅ Company created: Bengkel Inovasi Prima
👥 Seeding Roles...
✅ Roles created
👤 Seeding Users...
✅ Users created
🏭 Seeding Warehouse...
✅ Warehouse → Floor → Shelf → Row created
📏 Seeding UOM...
✅ UOM created
📦 Seeding Category & Brand...
✅ Category & Brand created
🛒 Seeding Products...
✅ Products created
📊 Seeding Product Stock...
✅ Product Stock created
🚗 Seeding Vehicle Master...
✅ Vehicle Master created
👨 Seeding Customer...
✅ Customer created: Budi Santoso
🚙 Seeding Customer Vehicle...
✅ Customer Vehicle created: B1234XYZ
🔧 Seeding Mechanic...
✅ Mechanic created: Andi Wijaya
🏗️ Seeding Service Bay...
✅ Service Bay created
⚙️ Seeding Service Type...
✅ Service Types created
💳 Seeding Payment Method...
✅ Payment Methods created
💰 Seeding Tax Scheme...
✅ Tax Scheme created
📚 Seeding Chart of Account...
✅ Chart of Account created
📋 Seeding Service Order...
✅ Service Order created: SO/2025/10/00001
📝 Seeding Service Order Details...
✅ Service Order Details created (5 items)
🧾 Seeding Invoice...
✅ Invoice created: INV/2025/10/00001
📄 Seeding Invoice Details...
✅ Invoice Details created (5 items)

🎉 Seed completed successfully!

📊 Summary:
- Company: Bengkel Inovasi Prima
- Customer: Budi Santoso
- Vehicle: Toyota Avanza 2020 (B 1234 XYZ)
- Mechanic: Andi Wijaya (SENIOR)
- Service Order: SO/2025/10/00001
- Invoice: INV/2025/10/00001
- Total Amount: Rp 1,570,650
  • Service: Rp 350,000
  • Parts: Rp 1,065,000
  • PPN 11%: Rp 155,650
```

---

## 🧪 **Verify Seed Data:**

### **Via Prisma Studio:**

```bash
npx prisma studio
```

Browse semua data yang sudah di-seed di http://localhost:5555

---

### **Via Query:**

```typescript
import { PrismaClient } from './lib/generated/prisma';

const prisma = new PrismaClient();

// Test query
const customer = await prisma.cmf_Customer.findUnique({
  where: {
    company_id_id: {
      company_id: 'BIP',
      id: 'CUST-001',
    },
  },
  include: {
    vehicles: true,
    serviceOrders: {
      include: {
        orderDetails: true,
      },
    },
    invoices: true,
  },
});

console.log(customer);
```

---

## 📝 **Data Seed Include:**

### **Master Data:**

- [x] 1 Company (Bengkel Inovasi Prima)
- [x] 2 Roles (Admin, Mekanik)
- [x] 2 Users (Admin Budi, Andi Mekanik)
- [x] 1 Warehouse + Floor + Shelf + Row
- [x] 2 UOM (PCS, LITER)
- [x] 1 Category + SubCategory
- [x] 1 Brand (Shell)
- [x] 3 Products (Oli, Filter, Kampas Rem)
- [x] 3 Product Stocks
- [x] 1 Vehicle Type (Mobil)
- [x] 1 Vehicle Brand (Toyota)
- [x] 1 Vehicle Model (Avanza)
- [x] 1 Mechanic (Andi - SENIOR)
- [x] 1 Service Bay (Bay 1)
- [x] 2 Service Types (Ganti Oli, Ganti Kampas Rem)
- [x] 3 Payment Methods (Cash, Transfer, QRIS)
- [x] 1 Tax Scheme (PPN 11%)
- [x] 5 COA Accounts

### **Transaction Data:**

- [x] 1 Customer (Budi Santoso)
- [x] 1 Customer Vehicle (Toyota Avanza B 1234 XYZ)
- [x] 1 Service Order (SO/2025/10/00001)
- [x] 5 Service Order Details
- [x] 1 Invoice (INV/2025/10/00001)
- [x] 5 Invoice Details

**Total: Rp 1,570,650**

---

## 🎯 **Ready untuk Development!**

Setelah seed selesai, Anda bisa mulai develop:

1. **Service Management** hooks
2. **Invoice & Payment** hooks
3. **Inventory** management
4. **Reporting** features

Happy coding! 🚀

