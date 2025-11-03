# 🛠️ Service Order MVP - Dokumentasi

## 📋 Overview

MVP (Minimum Viable Product) untuk modul **Service Order** dalam aplikasi ngeBengkel. Implementasi ini mencakup backend API, frontend UI, dan sistem booking sederhana.

## ✨ Fitur yang Diimplementasi

### 1. ✅ Backend API

- **CRUD Service Order** - Create, Read, Update, Delete
- **Service Order Details** - Multiple items per order (services & parts)
- **Auto-generate Order Number** - Format: `SO/YYYY/MM/XXXXX`
- **Integration dengan Prisma Schema** - Full database integration
- **JWT Authentication** - Protected endpoints

### 2. ✅ Frontend UI

- **Service Orders List** - Table view dengan filters
- **Create/Edit Dialog** - Form untuk create & update
- **Status Badges** - Visual status indicators
- **Responsive Design** - Mobile-friendly
- **Real-time Updates** - TanStack Query integration

### 3. ✅ Booking System

- **Calendar View** - Date picker dengan react-day-picker
- **Time Slots** - Available/unavailable time slots
- **Booking Indicators** - Visual feedback untuk existing bookings
- **Dummy Data** - Ready untuk testing

### 4. ✅ Data Seeder

- **Dummy Service Order** - Complete sample data
- **Customer & Vehicle** - Test data creation
- **Service Order Details** - Multiple items example

## 📁 Struktur Files

### Backend (`ngebengkel-server/src/wks/service-order/`)

```
service-order/
├── dto/
│   ├── create-service-order.dto.ts
│   ├── update-service-order.dto.ts
│   └── response-service-order.dto.ts
├── service-order.service.ts
├── service-order.controller.ts
└── service-order.module.ts
```

### Frontend (`ngebengkel-client/`)

```
├── app/
│   └── service-orders/
│       ├── page.tsx (List page)
│       └── booking/
│           └── page.tsx (Booking calendar)
├── components/
│   └── service-orders/
│       ├── service-orders-table.tsx
│       ├── service-order-dialog.tsx
│       └── service-booking-calendar.tsx
├── hooks/
│   └── useServiceOrder.ts
└── prisma/
    └── seed-service-order.ts
```

## 🚀 Cara Menggunakan

### 1. Setup Database

```bash
# Generate Prisma Client
cd ngebengkel-server
npx prisma generate

# Push schema changes
npx prisma db push

# Run service order seeder
npx tsx prisma/seed-service-order.ts
```

### 2. Start Backend Server

```bash
cd ngebengkel-server
npm run start:dev
```

Server akan berjalan di `http://localhost:8000`

### 3. Start Frontend

```bash
cd ngebengkel-client
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

- **Service Orders List**: `http://localhost:3000/service-orders`
- **Booking Calendar**: `http://localhost:3000/service-orders/booking`

## 📝 API Endpoints

### Service Orders

| Method | Endpoint                             | Description      |
| ------ | ------------------------------------ | ---------------- |
| GET    | `/api/service-orders?company_id=XXX` | List all orders  |
| GET    | `/api/service-orders/:id`            | Get single order |
| POST   | `/api/service-orders`                | Create new order |
| PATCH  | `/api/service-orders/:id`            | Update order     |
| DELETE | `/api/service-orders/:id`            | Delete order     |

### Query Parameters (GET /api/service-orders)

- `company_id` (required) - Company ID
- `branch_id` (optional) - Filter by branch
- `status` (optional) - Filter by status (DRAFT, CONFIRMED, etc.)
- `customer_id` (optional) - Filter by customer

## 🎨 UI Components

### Service Orders List Page

- Search & filter functionality
- Status badges (Draft, Confirmed, In Progress, Completed, etc.)
- Priority indicators
- Actions menu (Edit, View, Delete)
- Responsive table

### Create/Edit Dialog

- Customer & Vehicle selection
- Service Bay & Mechanic assignment
- Vehicle condition notes
- Odometer & Fuel level tracking
- Service request & complaint fields
- Priority selection
- Auto-calculate totals

### Booking Calendar

- Month/year navigation
- Available time slots
- Visual booking indicators
- Daily booking list
- Stats cards (Total, This Month, Today)

## 🔑 Alternatif Booking Calendar

Sistem ini menggunakan **react-day-picker** karena:

1. ✅ **Lightweight** - No additional dependencies needed
2. ✅ **Already Installed** - Part of shadcn/ui
3. ✅ **Customizable** - Easy to style and extend
4. ✅ **Accessible** - Built-in accessibility features

### Alternatif Lain (jika ingin upgrade):

**A. react-big-calendar** (Scheduler-style)

```bash
npm install react-big-calendar
```

- ✅ Week/Month/Agenda views
- ✅ Drag & drop
- ✅ Resource view
- ❌ Heavier bundle size

**B. FullCalendar** (Enterprise-grade)

```bash
npm install @fullcalendar/react @fullcalendar/daygrid
```

- ✅ Advanced features
- ✅ Resource timeline
- ✅ Google Calendar sync
- ❌ Requires license for commercial use
- ❌ Complex setup

**C. Google Calendar API** (External)

- ✅ Real calendar sync
- ✅ Mobile app integration
- ❌ Requires OAuth setup
- ❌ API quotas
- ❌ External dependency

## 📊 Data Model

### Service Order

```typescript
{
  id: string;
  orderNumber: string; // SO/2025/10/00001
  orderDate: Date;
  customer_id: string;
  customerVehicle_id: string;
  orderStatus: 'DRAFT' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | ...
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  totalAmount: number;
  // ... more fields
}
```

### Service Order Detail

```typescript
{
  id: string;
  serviceOrder_id: string;
  lineNumber: number;
  detailType: 'SERVICE' | 'PART';
  serviceName?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

## 🧪 Testing dengan Dummy Data

Seeder akan membuat:

- ✅ 1 Customer: Test Customer
- ✅ 1 Vehicle: B 1234 XYZ (Toyota Avanza)
- ✅ 1 Service Order dengan 5 items:
  1. Ganti Oli Mesin (Service)
  2. Shell Helix HX7 (Part)
  3. Filter Oli (Part)
  4. Ganti Kampas Rem (Service)
  5. Kampas Rem Depan (Part)

### Test Credentials

Untuk testing, gunakan:

- **Customer ID**: `CUST-001`
- **Vehicle ID**: `VEH-001`

## 🔗 Integrasi dengan Modul Lain

### Sudah Terhubung:

- ✅ **Customer Management** (`cmf_Customer`)
- ✅ **Vehicle Management** (`cmf_CustomerVehicle`)
- ✅ **Mechanic Management** (`cmf_Mechanic`)
- ✅ **Service Bay** (`wks_ServiceBay`)
- ✅ **Document Numbering** (`sys_DocumentNumber`)

### Akan Terhubung (Next Phase):

- 🔄 **Inventory** - Update stock saat parts digunakan
- 🔄 **Invoice** - Generate invoice otomatis
- 🔄 **Payment** - Link payment ke service order
- 🔄 **GL Posting** - Auto journal entries
- 🔄 **Service History** - Track service records

## 🎯 Next Steps / Future Enhancements

### Priority High:

1. **Notification System** - Email/SMS reminders untuk booking
2. **QR Code Integration** - QR code untuk check-in customer
3. **Mobile App** - React Native for field mechanics
4. **Photo Upload** - Before/after service photos
5. **Signature Capture** - Digital signature untuk approval

### Priority Medium:

1. **Service Templates** - Quick create dari template
2. **Parts Suggestions** - AI-suggested parts based on complaint
3. **Warranty Tracking** - Track service warranty periods
4. **Recurring Maintenance** - Setup recurring services
5. **Customer Portal** - Self-service booking

### Priority Low:

1. **Advanced Analytics** - Revenue per service type
2. **Mechanic Performance** - Track efficiency & quality
3. **Inventory Alerts** - Low stock notifications
4. **Integration Hub** - Connect dengan external apps
5. **Multi-currency** - Support different currencies

## 🐛 Known Issues / Limitations

### Current:

- ⚠️ Booking system masih menggunakan dummy data
- ⚠️ Tidak ada real-time sync untuk multi-user
- ⚠️ Belum ada print/PDF export
- ⚠️ Belum ada email notifications

### To Fix:

- [ ] Implement actual booking API
- [ ] Add WebSocket for real-time updates
- [ ] Generate PDF reports
- [ ] Setup email templates

## 📚 Resources

- **Prisma Schema**: `ngebengkel-server/prisma/schema.prisma`
- **API Docs**: Swagger/Postman collection (TODO)
- **Component Library**: shadcn/ui
- **Query Library**: TanStack Query v5
- **Date Library**: date-fns

## 👥 Contributing

Ketika menambahkan fitur baru:

1. Update Prisma schema jika perlu
2. Run migration: `npx prisma db push`
3. Generate client: `npx prisma generate`
4. Update seeder jika perlu
5. Write tests
6. Update documentation

## 📞 Support

Untuk pertanyaan atau issues:

- Create GitHub issue
- Contact development team
- Check documentation wiki

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0-MVP
**Status**: ✅ Production Ready (Basic Features)



