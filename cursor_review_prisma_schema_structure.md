# Review prisma schema structure
_Exported on 10/31/2025 at 11:40:11 GMT+7 from Cursor (1.7.54)_

---

**User**

Hai, bisakah kamu baca dan pelajari struktur schema prisma saya?

apa yang kurang?

---

**Cursor**


Membaca dan menganalisis struktur schema Prisma untuk mengidentifikasi yang kurang.


Membaca file secara bertahap untuk memahami strukturnya:


Menganalisis beberapa bagian penting untuk memahami struktur lengkapnya:


Memeriksa bagian lain untuk memahami struktur lengkap:


Menyusun analisis terstruktur tentang apa yang kurang. Memeriksa beberapa model tambahan:


Menulis analisis terstruktur tentang yang kurang dalam schema:


```markdown
# Analisis Schema Prisma - Yang Kurang dan Rekomendasi

## 📊 Ringkasan Schema Saat Ini

### Statistik
- **Total Models**: 88 models
- **Total Enums**: 57 enums
- **Scope**: Sistem SaaS Bengkel Management yang sangat komprehensif

### Kategori Models yang Ada:
1. ✅ **SaaS Management** - Subscription plans, billing, usage tracking, addons
2. ✅ **Authentication & Authorization** - User, session, role, permissions, 2FA
3. ✅ **System Management** - Company, branch, menu, document numbering
4. ✅ **Inventory Management** - Warehouse, products, stock, variants
5. ✅ **Customer Management** - Customers, vehicles, employees
6. ✅ **Service Management** - Service orders, history, complaints, rework
7. ✅ **Procurement** - Purchase orders, receives, returns, suppliers
8. ✅ **Accounting** - GL, invoices, payments, COA, bank accounts
9. ✅ **Accounts Receivable** - AR invoices, payments, cash receipts, credit notes
10. ✅ **Accounts Payable** - AP invoices, payments

---

## 🔍 Yang Kurang (Missing Models)

### 1. **Audit Log / Activity Log** ⚠️ PRIORITAS TINGGI
**Deskripsi**: Model untuk tracking semua perubahan data di sistem (create, update, delete)
**Kegunaan**: Compliance, debugging, security audit, data recovery

**Model yang Direkomendasikan**:
```prisma
model sys_AuditLog {
  id            String   @id @default(cuid()) @db.VarChar(50)
  user_id       Int?     @db.SmallInt // User yang melakukan action
  company_id    String?  @db.Char(5)
  branch_id     String?  @db.Char(10)
  // Action Details
  action        String   @db.VarChar(20) // CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT
  entityType    String   @db.VarChar(50) // sys_User, imc_Product, wks_ServiceOrder
  entityId      String?  @db.VarChar(50) // ID dari entity yang diubah
  // Changes
  oldValues     Json?    // Data sebelum perubahan
  newValues     Json?    // Data setelah perubahan
  // Context
  ipAddress     String?  @db.VarChar(45)
  userAgent     String?  @db.Text
  requestMethod String?  @db.VarChar(10) // GET, POST, PUT, DELETE
  requestUrl    String?  @db.VarChar(500)
  // Timestamp
  createdAt     DateTime @default(now())
  // Relations
  user          sys_User? @relation(fields: [user_id], references: [id])
  
  @@index([user_id])
  @@index([company_id])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@index([action])
}
```

---

### 2. **System Notifications** ⚠️ PRIORITAS TINGGI
**Deskripsi**: In-app notification system untuk user
**Kegunaan**: Alert user tentang events penting (payment due, order status, dll)

**Model yang Direkomendasikan**:
```prisma
model sys_Notification {
  id              String                    @id @default(cuid()) @db.VarChar(50)
  user_id         Int                       @db.SmallInt
  company_id      String?                   @db.Char(5)
  branch_id       String?                   @db.Char(10)
  // Notification Details
  title           String                    @db.VarChar(255)
  message         String                    @db.Text
  type            NotificationTypeEnum      @default(INFO) // INFO, WARNING, ERROR, SUCCESS
  category        String?                   @db.VarChar(50) // BILLING, ORDER, SYSTEM, SECURITY
  // Target Entity (optional link to related record)
  entityType      String?                   @db.VarChar(50)
  entityId        String?                   @db.VarChar(50)
  // Status
  isRead          Boolean                   @default(false)
  readAt          DateTime?
  isPinned        Boolean                   @default(false)
  // Action (optional)
  actionUrl       String?                   @db.VarChar(500)
  actionLabel     String?                   @db.VarChar(100)
  // Timestamp
  createdAt       DateTime                  @default(now())
  expiresAt       DateTime?
  // Relations
  user            sys_User                  @relation(fields: [user_id], references: [id])
  
  @@index([user_id, isRead])
  @@index([company_id])
  @@index([createdAt])
}

enum NotificationTypeEnum {
  INFO      @map("INFO")
  WARNING   @map("WARN")
  ERROR     @map("ERROR")
  SUCCESS   @map("SUCCESS")
}
```

---

### 3. **Email Queue / Email Logs** ⚠️ PRIORITAS TINGGI
**Deskripsi**: Tracking email yang dikirim sistem (verification, billing, notifications)
**Kegunaan**: Debug email issues, compliance, audit trail

**Model yang Direkomendasikan**:
```prisma
model sys_EmailLog {
  id              String                @id @default(cuid()) @db.VarChar(50)
  user_id         Int?                  @db.SmallInt
  company_id      String?               @db.Char(5)
  branch_id       String?               @db.Char(10)
  // Email Details
  to              String                @db.VarChar(255)
  cc              String?               @db.VarChar(255)
  bcc             String?               @db.VarChar(255)
  subject         String                @db.VarChar(500)
  body            String?               @db.Text
  htmlBody        String?               @db.Text
  // Email Type
  emailType       String                @db.VarChar(50) // VERIFICATION, BILLING, PASSWORD_RESET, NOTIFICATION
  templateId      String?               @db.VarChar(100)
  // Status
  status          EmailStatusEnum       @default(PENDING) // PENDING, SENT, FAILED, BOUNCED
  sentAt          DateTime?
  failedAt        DateTime?
  errorMessage    String?               @db.Text
  // Provider Info
  provider        String?               @db.VarChar(50) // SMTP, SES, SendGrid
  providerMessageId String?             @db.VarChar(255)
  // Retry
  retryCount      Int                   @default(0)
  maxRetries      Int                   @default(3)
  // Timestamp
  createdAt       DateTime              @default(now())
  // Relations
  user            sys_User?             @relation(fields: [user_id], references: [id])
  
  @@index([user_id])
  @@index([company_id])
  @@index([status])
  @@index([emailType])
  @@index([createdAt])
}

enum EmailStatusEnum {
  PENDING   @map("PENDING")
  SENT      @map("SENT")
  FAILED    @map("FAILED")
  BOUNCED   @map("BOUNCED")
}
```

---

### 4. **File Uploads / Attachments** ⚠️ PRIORITAS SEDANG
**Deskripsi**: Generic file storage untuk attachments (invoice PDF, product images, documents)
**Kegunaan**: Centralized file management, tracking storage usage

**Model yang Direkomendasikan**:
```prisma
model sys_FileAttachment {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  company_id      String                  @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // File Info
  fileName        String                  @db.VarChar(255)
  originalName    String                  @db.VarChar(255)
  mimeType        String                  @db.VarChar(100)
  fileSize        Int                     @db.Integer // bytes
  fileExtension   String?                 @db.VarChar(10)
  // Storage
  storageType     StorageTypeEnum         @default(LOCAL) // LOCAL, S3, GCS, CLOUDINARY
  storagePath     String                  @db.VarChar(500) // Path di storage
  storageUrl      String?                 @db.VarChar(500) // Public URL (jika ada)
  // Entity Reference (file bisa attached ke berbagai entity)
  entityType      String                  @db.VarChar(50) // imc_Product, arm_Invoice, wks_ServiceOrder
  entityId        String                  @db.VarChar(50)
  // Category
  category        String?                 @db.VarChar(50) // INVOICE, PRODUCT_IMAGE, DOCUMENT, LOGO
  description     String?                @db.VarChar(255)
  // Access Control
  isPublic        Boolean                 @default(false)
  accessToken     String?                 @db.VarChar(100) // Untuk private files
  expiresAt       DateTime?
  // Metadata
  uploadedBy      Int?                    @db.SmallInt
  iStatus         MasterRecordStatusEnum  @default(Active)
  createdAt       DateTime                @default(now())
  // Relations
  company         sys_Company             @relation(fields: [company_id], references: [id])
  uploader        sys_User?               @relation(fields: [uploadedBy], references: [id])
  
  @@index([company_id])
  @@index([entityType, entityId])
  @@index([category])
  @@index([storageType])
}

enum StorageTypeEnum {
  LOCAL       @map("LOCAL")
  S3          @map("S3")
  GCS         @map("GCS")
  CLOUDINARY  @map("CLOUDINARY")
  IMAGEKIT    @map("IMAGEKIT")
}
```

**Catatan**: Saat ini sudah ada `imc_ProductImage`, tapi ini spesifik untuk product. Model di atas lebih generic.

---

### 5. **System Settings / Configuration** ⚠️ PRIORITAS TINGGI
**Deskripsi**: Key-value settings untuk system-wide dan per-company configuration
**Kegunaan**: Customizable behavior tanpa code changes

**Model yang Direkomendasikan**:
```prisma
model sys_SystemSetting {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  company_id      String?                 @db.Char(5) // NULL = global setting
  branch_id       String?                 @db.Char(10) // NULL = company-wide, ada = branch-specific
  // Setting Details
  settingKey      String                  @db.VarChar(100)
  settingValue    String?                 @db.Text // JSON string jika kompleks
  settingType     SettingTypeEnum         @default(STRING) // STRING, NUMBER, BOOLEAN, JSON
  // Category
  category        String                  @db.VarChar(50) // GENERAL, BILLING, NOTIFICATION, INTEGRATION
  description     String?                 @db.VarChar(255)
  defaultValue    String?                 @db.Text
  // Validation
  isRequired      Boolean                 @default(false)
  validationRule  String?                 @db.VarChar(255) // Regex atau rule
  // Metadata
  updatedBy       String?                 @db.Char(10)
  updatedAt       DateTime                @default(now())
  
  @@unique([company_id, branch_id, settingKey], map: "unique_setting_key")
  @@index([category])
  @@index([company_id])
}

enum SettingTypeEnum {
  STRING    @map("STRING")
  NUMBER    @map("NUMBER")
  BOOLEAN   @map("BOOLEAN")
  JSON      @map("JSON")
  DATE      @map("DATE")
}
```

**Contoh Settings**:
- `email.from_address` - Email pengirim default
- `billing.due_date_days` - Jumlah hari sebelum due date
- `notification.enable_email` - Enable/disable email notifications
- `integration.payment_gateway` - Payment gateway yang digunakan

---

### 6. **API Access Logs** ⚠️ PRIORITAS SEDANG
**Deskripsi**: Logging semua API requests untuk monitoring dan security
**Kegunaan**: Performance monitoring, security audit, rate limiting

**Model yang Direkomendasikan**:
```prisma
model sys_ApiAccessLog {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  user_id         Int?                    @db.SmallInt
  company_id      String?                 @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // Request Details
  method          String                  @db.VarChar(10) // GET, POST, PUT, DELETE
  path            String                  @db.VarChar(500)
  queryString     String?                 @db.Text
  // Response Details
  statusCode      Int                     @db.SmallInt
  responseTime    Int?                    @db.Integer // milliseconds
  responseSize    Int?                    @db.Integer // bytes
  // Context
  ipAddress       String?                 @db.VarChar(45)
  userAgent       String?                 @db.Text
  referer         String?                 @db.VarChar(500)
  // Request Body (optional, untuk debugging)
  requestBody     String?                 @db.Text
  // Status
  isError         Boolean                 @default(false)
  errorMessage    String?                 @db.Text
  // Timestamp
  createdAt       DateTime                @default(now())
  // Relations
  user            sys_User?               @relation(fields: [user_id], references: [id])
  
  @@index([user_id])
  @@index([company_id])
  @@index([method, path])
  @@index([statusCode])
  @@index([createdAt])
  @@index([isError])
}
```

**Note**: Untuk production, mungkin perlu data retention policy (auto delete logs > 90 days)

---

### 7. **Error Logs** ⚠️ PRIORITAS SEDANG
**Deskripsi**: Tracking application errors dan exceptions
**Kegunaan**: Debugging, monitoring application health

**Model yang Direkomendasikan**:
```prisma
model sys_ErrorLog {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  user_id         Int?                    @db.SmallInt
  company_id      String?                 @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // Error Details
  errorType       String                  @db.VarChar(50) // APPLICATION, DATABASE, VALIDATION, EXTERNAL_API
  errorCode       String?                 @db.VarChar(50)
  errorMessage    String                  @db.Text
  stackTrace      String?                 @db.Text
  // Context
  requestMethod   String?                 @db.VarChar(10)
  requestUrl      String?                 @db.VarChar(500)
  requestBody     String?                 @db.Text
  ipAddress       String?                 @db.VarChar(45)
  userAgent       String?                 @db.Text
  // Severity
  severity        ErrorSeverityEnum       @default(MEDIUM) // LOW, MEDIUM, HIGH, CRITICAL
  // Resolution
  isResolved      Boolean                 @default(false)
  resolvedAt      DateTime?
  resolvedBy      String?                 @db.Char(10)
  resolutionNote  String?                 @db.Text
  // Timestamp
  createdAt       DateTime                @default(now())
  // Relations
  user            sys_User?               @relation(fields: [user_id], references: [id])
  
  @@index([user_id])
  @@index([company_id])
  @@index([errorType])
  @@index([severity])
  @@index([isResolved])
  @@index([createdAt])
}

enum ErrorSeverityEnum {
  LOW       @map("LOW")
  MEDIUM    @map("MEDIUM")
  HIGH      @map("HIGH")
  CRITICAL  @map("CRITICAL")
}
```

---

### 8. **User Preferences** ⚠️ PRIORITAS RENDAH
**Deskripsi**: User-specific settings untuk UI dan behavior preferences
**Kegunaan**: Personalized experience per user

**Model yang Direkomendasikan**:
```prisma
model sys_UserPreference {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  user_id         Int                     @db.SmallInt
  company_id      String?                 @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // Preference Details
  preferenceKey   String                  @db.VarChar(100)
  preferenceValue String?                 @db.Text // JSON jika kompleks
  preferenceType  SettingTypeEnum         @default(STRING)
  // Timestamp
  updatedAt       DateTime                @default(now())
  // Relations
  user            sys_User                @relation(fields: [user_id], references: [id])
  
  @@unique([user_id, company_id, branch_id, preferenceKey], map: "unique_user_preference")
  @@index([user_id])
}

// Contoh preferences:
// - language: "id" atau "en"
// - theme: "light" atau "dark"
// - dateFormat: "DD/MM/YYYY" atau "MM/DD/YYYY"
// - timezone: "Asia/Jakarta"
// - dashboard.widgets: JSON array of widget configs
```

---

### 9. **Integration / Webhook Logs** ⚠️ PRIORITAS RENDAH (Jika ada integrasi eksternal)
**Deskripsi**: Tracking webhooks dan API integrations dengan external systems
**Kegunaan**: Monitoring integrations, debugging webhook issues

**Model yang Direkomendasikan**:
```prisma
model sys_WebhookLog {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  company_id      String?                 @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // Webhook Details
  webhookUrl      String                  @db.VarChar(500)
  eventType       String                  @db.VarChar(50) // ORDER_CREATED, PAYMENT_RECEIVED
  payload         String?                 @db.Text // JSON payload
  headers         String?                 @db.Text // JSON headers
  // Response
  statusCode      Int?                    @db.SmallInt
  responseBody    String?                 @db.Text
  responseTime    Int?                    @db.Integer // milliseconds
  // Status
  status          WebhookStatusEnum       @default(PENDING)
  retryCount      Int                     @default(0)
  maxRetries      Int                     @default(3)
  errorMessage    String?                 @db.Text
  // Timestamp
  createdAt       DateTime                @default(now())
  sentAt          DateTime?
  
  @@index([company_id])
  @@index([eventType])
  @@index([status])
  @@index([createdAt])
}

enum WebhookStatusEnum {
  PENDING   @map("PENDING")
  SENT      @map("SENT")
  FAILED    @map("FAILED")
  RETRYING  @map("RETRYING")
}
```

---

### 10. **Data Archive / Backup Records** ⚠️ PRIORITAS RENDAH
**Deskripsi**: Tracking data yang sudah di-archive atau di-backup
**Kegunaan**: Data retention compliance, recovery tracking

**Model yang Direkomendasikan**:
```prisma
model sys_DataArchive {
  id              String                  @id @default(cuid()) @db.VarChar(50)
  company_id      String                  @db.Char(5)
  branch_id       String?                 @db.Char(10)
  // Archive Details
  entityType      String                  @db.VarChar(50)
  entityId        String                  @db.VarChar(50)
  archivedData    Json                    // Full snapshot data
  // Reason
  archiveReason   String?                 @db.VarChar(255)
  archiveType     ArchiveTypeEnum         @default(SOFT_DELETE) // SOFT_DELETE, BACKUP, RETENTION
  // Metadata
  archivedBy      String?                 @db.Char(10)
  archivedAt      DateTime                @default(now())
  restoreBy       String?                 @db.Char(10)
  restoredAt      DateTime?
  
  @@index([company_id])
  @@index([entityType, entityId])
  @@index([archiveType])
  @@index([archivedAt])
}

enum ArchiveTypeEnum {
  SOFT_DELETE  @map("SOFT_DELETE")
  BACKUP       @map("BACKUP")
  RETENTION    @map("RETENTION")
  MIGRATION    @map("MIGRATION")
}
```

---

## 📋 Prioritas Implementasi

### ⚠️ PRIORITAS TINGGI (Implementasikan segera)
1. **sys_AuditLog** - Penting untuk compliance dan security
2. **sys_SystemSetting** - Fleksibilitas configuration tanpa code changes
3. **sys_Notification** - User experience yang lebih baik
4. **sys_EmailLog** - Debugging dan audit trail

### ⚠️ PRIORITAS SEDANG (Implementasikan setelah prioritas tinggi)
5. **sys_ApiAccessLog** - Monitoring dan security
6. **sys_ErrorLog** - Application health monitoring
7. **sys_FileAttachment** - Centralized file management (jika perlu)

### ⚠️ PRIORITAS RENDAH (Nice to have)
8. **sys_UserPreference** - Personalized experience
9. **sys_WebhookLog** - Jika ada integrasi eksternal
10. **sys_DataArchive** - Jika ada requirement data retention

---

## 🔧 Catatan Tambahan

### Yang Sudah Ada dan Bagus:
1. ✅ **sys_Session** - Sudah bagus untuk session management
2. ✅ **sys_EmailVerification**, **sys_PasswordReset**, **sys_TwoFactorToken** - Auth sudah lengkap
3. ✅ **sys_DocumentNumber** - Document numbering system sudah ada
4. ✅ Domain-specific logs sudah ada: **wks_ServiceHistory**, **wks_ComplaintLog**

### Rekomendasi Enhancement Model Existing:
1. **sys_User** - Bisa tambah field `lastLoginAt`, `lastLoginIp` untuk security tracking
2. **sys_Company** - Bisa tambah field `settings` (JSON) untuk quick company-specific configs
3. **saas_UsageTracking** - Sudah bagus, mungkin bisa tambah more granular metrics

---

## 📝 Kesimpulan

Schema Prisma Anda sudah **sangat komprehensif** dengan 88 models yang mencakup seluruh business logic bengkel management. Yang paling kurang adalah:

1. **Audit Logging** - Untuk compliance dan security
2. **System Settings** - Untuk flexibility configuration
3. **Notifications** - Untuk user engagement
4. **Email Logs** - Untuk debugging dan audit

Model-model lainnya (API logs, error logs, dll) adalah nice-to-have yang bisa ditambahkan sesuai kebutuhan.

**Overall Score**: 9/10 - Schema sangat solid, hanya perlu beberapa operational models untuk completeness! 🎉

```

Saya sudah membaca dan menganalisis schema Prisma Anda. Ringkasan temuan:

## Ringkasan analisis

### Yang sudah ada
- 88 models — sangat komprehensif
- 57 enums — type safety bagus
- Coverage: SaaS, authentication, inventory, services, accounting, dll

### Yang kurang (yang penting)

1. Audit Log / Activity Log — prioritas tinggi
   - Tracking perubahan data (create, update, delete)
   - Penting untuk compliance dan security

2. System Notifications — prioritas tinggi
   - In-app notifications untuk user
   - Alert payment due, order status, dll

3. Email Queue/Logs — prioritas tinggi
   - Tracking email yang dikirim
   - Debug email issues dan audit trail

4. System Settings/Configuration — prioritas tinggi
   - Key-value settings untuk system-wide dan per-company
   - Customizable behavior tanpa code changes

5. File Attachments — prioritas sedang
   - Generic file storage (saat ini hanya `imc_ProductImage` yang spesifik)

6. API Access Logs — prioritas sedang
   - Monitoring API requests untuk performance dan security

7. Error Logs — prioritas sedang
   - Tracking application errors dan exceptions

## Rekomendasi lengkap

Saya telah membuat dokumen analisis lengkap di:
`prisma/SCHEMA_ANALYSIS_AND_RECOMMENDATIONS.md`

Dokumen tersebut mencakup:
- Model-model yang direkomendasikan (dengan definisi Prisma)
- Enums yang diperlukan
- Prioritas implementasi
- Contoh penggunaan

## Kesimpulan

Schema Anda sudah solid (9/10). Yang paling penting ditambahkan:
1. Audit Log — compliance dan security
2. System Settings — fleksibilitas configuration
3. Notifications — user experience
4. Email Logs — debugging

Yang lain bisa ditambahkan sesuai kebutuhan.

Ingin saya implementasikan model-model prioritas tinggi langsung di schema Anda?

---

**User**

Oke good tapi ini yg lebih penting, booking service.

---

**Cursor**

Saya akan menambahkan model dan enum untuk fitur booking service di `prisma/schema.prisma`, diletakkan dalam modul Service sebelum `wks_ServiceOrder`.

Saya akan menyisipkan enum dan model booking tepat sebelum `wks_ServiceOrder` di modul Service.

---

**User**

Wait, gimana dengan jadwalnya?

---

**Cursor**

I’m going to open the `cmf_Customer` and `cmf_CustomerVehicle` model definitions to ensure the correct composite keys for relations in the booking models, then I’ll insert the booking scheduling models and enums before `wks_ServiceOrder`.

I found the `cmf_Customer` and `cmf_CustomerVehicle` composite keys. I’ll insert booking and scheduling models (including enums) before `wks_ServiceOrder`, covering working hours, holidays, mechanic availability, bay blocking, and the core `wks_ServiceBooking` with scheduled start/end.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// ============================================================================
/// SAAS SUBSCRIPTION MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage subscription plans, billing, dan feature access
/// Plans: Lite, Professional, Enterprise

// Subscription Plans (Paket Berlangganan)
model saas_SubscriptionPlan {
  id                   String                     @db.Char(10) // LITE, PRO, ENTERPRISE
  planCode             String                     @db.VarChar(20)
  name                 String                     @db.VarChar(50) // Lite, Professional, Enterprise
  description          String?                    @db.Text
  description_en       String?                    @db.Text
  // Pricing (Real prices)
  monthlyPrice         Decimal                    @db.Decimal(21, 4) // Lite: 65000, Pro: 85000, Enterprise: 115000
  yearlyPrice          Decimal                    @db.Decimal(21, 4) // Lite: 624000, Pro: 816000, Enterprise: 1104000
  yearlyMonthlyEquiv   Decimal?                   @db.Decimal(21, 4) // Lite: 52000/bln, Pro: 68000/bln, Enterprise: 92000/bln
  discountYearly       Decimal?                   @db.Decimal(5, 2) // Diskon yearly (20%)
  currency             String                     @default("IDR") @db.Char(3)
  // Limits
  maxUsers             Int? // Max user yang bisa dibuat
  maxBranches          Int? // Max cabang
  maxProducts          Int? // Max produk
  maxCustomers         Int? // Max customer
  maxVehicles          Int? // Max kendaraan
  maxTransactions      Int? // Max transaksi per bulan
  storageLimit         Int? // Storage limit (GB)
  // Features (JSON bisa digunakan untuk flexible features)
  features             Json? // List fitur yang aktif
  // Display
  displayOrder         Int?                       @default(0)
  isPopular            Boolean?                   @default(false)
  highlightText        String?                    @db.VarChar(100) // "Most Popular", "Best Value"
  // Status
  isActive             Boolean                    @default(true)
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  // Relations
  companySubscriptions saas_CompanySubscription[]
  planFeatures         saas_PlanFeature[]

  @@id([id], map: "pk_saas_SubscriptionPlan")
  @@unique([planCode], map: "unique_plan_code")
}

// Company Subscription (Langganan Company)
model saas_CompanySubscription {
  id                   String                     @db.Char(30) // Manual: SUB/2025/10/00001
  subscriptionNumber   String                     @db.VarChar(30)
  company_id           String                     @db.Char(5)
  branch_id            String                     @db.Char(10)
  plan_id              String                     @db.Char(10)
  // Subscription Period
  startDate            DateTime                   @db.Date
  endDate              DateTime                   @db.Date
  billingCycle         BillingCycleEnum // MONTHLY, YEARLY
  // Pricing
  monthlyPrice         Decimal                    @db.Decimal(21, 4)
  yearlyPrice          Decimal?                   @db.Decimal(21, 4)
  discountPercent      Decimal?                   @default(0) @db.Decimal(5, 2)
  discountAmount       Decimal?                   @default(0) @db.Decimal(21, 4)
  finalPrice           Decimal                    @db.Decimal(21, 4)
  // Auto Renewal
  autoRenewal          Boolean                    @default(true)
  renewalDate          DateTime?                  @db.Date
  // Trial
  isTrialPeriod        Boolean?                   @default(false)
  trialEndDate         DateTime?                  @db.Date
  // Status
  subscriptionStatus   SubscriptionStatusEnum     @default(ACTIVE)
  isCancelled          Boolean?                   @default(false)
  cancelledDate        DateTime?
  cancelReason         String?                    @db.Text
  // Notifications
  notifyBeforeExpiry   Int?                       @default(7) @db.SmallInt // Notify X days before
  lastNotificationDate DateTime?
  // Metadata
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  // Relations
  company              sys_Company                @relation(fields: [company_id], references: [id], onUpdate: NoAction)
  plan                 saas_SubscriptionPlan      @relation(fields: [plan_id], references: [id], onUpdate: NoAction)
  billingHistory       saas_SubscriptionBilling[]
  usageRecords         saas_UsageTracking[]
  companyAddons        saas_CompanyAddon[]

  @@id([id], map: "pk_saas_CompanySubscription")
  @@unique([subscriptionNumber], map: "unique_subscription_number")
  @@index([company_id], map: "idx_subscription_company")
  @@index([plan_id], map: "idx_subscription_plan")
  @@index([subscriptionStatus], map: "idx_subscription_status")
}

// Plan Features (Fitur per Plan)
model saas_PlanFeature {
  id             String                 @db.Char(20)
  plan_id        String                 @db.Char(10)
  featureCode    String                 @db.VarChar(30) // MULTI_BRANCH, INVENTORY, ACCOUNTING, dll
  featureName    String                 @db.VarChar(100)
  featureName_en String?                @db.VarChar(100)
  category       String?                @db.VarChar(30) // CORE, SALES, INVENTORY, ACCOUNTING, dll
  isEnabled      Boolean                @default(true)
  customLimit    Int? // Custom limit untuk fitur ini
  description    String?                @db.Text
  seq            Int?                   @default(0)
  iStatus        MasterRecordStatusEnum @default(Active)
  createdAt      DateTime               @default(now())
  // Relations
  plan           saas_SubscriptionPlan  @relation(fields: [plan_id], references: [id], onUpdate: NoAction)

  @@id([plan_id, id], map: "pk_saas_PlanFeature")
  @@index([plan_id], map: "idx_plan_feature")
}

// Subscription Billing (Tagihan Langganan)
model saas_SubscriptionBilling {
  id                String                   @db.Char(30) // Manual: SBIL/2025/10/00001
  billingNumber     String                   @db.VarChar(30)
  billingDate       DateTime                 @default(now())
  dueDate           DateTime                 @db.Date
  subscription_id   String                   @db.Char(30)
  company_id        String                   @db.Char(5)
  branch_id         String                   @db.Char(10)
  // Billing Period
  periodStart       DateTime                 @db.Date
  periodEnd         DateTime                 @db.Date
  billingCycle      BillingCycleEnum
  // Amount
  baseAmount        Decimal                  @db.Decimal(21, 4)
  additionalCharges Decimal?                 @default(0) @db.Decimal(21, 4)
  discountAmount    Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount       Decimal                  @db.Decimal(21, 4)
  paidAmount        Decimal?                 @default(0) @db.Decimal(21, 4)
  outstandingAmount Decimal?                 @db.Decimal(21, 4)
  // Payment Info
  paymentMethod     String?                  @db.VarChar(30)
  paymentDate       DateTime?
  paymentReference  String?                  @db.VarChar(50)
  // Status
  billingStatus     BillingStatusEnum        @default(UNPAID)
  isPosted          Boolean?                 @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                  @db.Text
  // Metadata
  iStatus           MasterRecordStatusEnum   @default(Active)
  remarks           String?                  @db.VarChar(250)
  createdBy         String?                  @db.Char(10)
  createdAt         DateTime                 @default(now())
  updatedBy         String?                  @db.Char(10)
  updatedAt         DateTime
  // Relations
  subscription      saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company           sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_SubscriptionBilling")
  @@unique([billingNumber], map: "unique_billing_number")
  @@index([subscription_id], map: "idx_billing_subscription")
  @@index([company_id], map: "idx_billing_company")
}

// Usage Tracking (Monitoring Usage per Company)
model saas_UsageTracking {
  id                    String                   @db.Char(30)
  subscription_id       String                   @db.Char(30)
  company_id            String                   @db.Char(5)
  branch_id             String                   @db.Char(10)
  trackingDate          DateTime                 @default(now()) @db.Date
  // Usage Metrics
  totalUsers            Int?                     @default(0)
  totalBranches         Int?                     @default(0)
  totalProducts         Int?                     @default(0)
  totalCustomers        Int?                     @default(0)
  totalVehicles         Int?                     @default(0)
  totalTransactions     Int?                     @default(0)
  storageUsed           Decimal?                 @default(0) @db.Decimal(10, 2) // GB
  // Monthly Counters
  monthlyServiceOrders  Int?                     @default(0)
  monthlyInvoices       Int?                     @default(0)
  monthlyPurchaseOrders Int?                     @default(0)
  // Alert
  isOverLimit           Boolean?                 @default(false)
  alertSent             Boolean?                 @default(false)
  // Metadata
  createdAt             DateTime                 @default(now())
  // Relations
  subscription          saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company               sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_UsageTracking")
  @@index([subscription_id], map: "idx_usage_subscription")
  @@index([company_id], map: "idx_usage_company")
  @@index([trackingDate], map: "idx_usage_date")
}

// Add-on Features (Fitur Tambahan yang bisa dibeli terpisah)
model saas_AddonFeature {
  id                     String                 @db.Char(10)
  addonCode              String                 @db.VarChar(30) // HISTORY, ANALYTICS, API_ACCESS, dll
  name                   String                 @db.VarChar(100)
  category               String?                @db.VarChar(30) // REPORTING, ANALYTICS, INTEGRATION, STORAGE
  description            String?                @db.Text
  description_en         String?                @db.Text
  // Pricing
  monthlyPrice           Decimal                @db.Decimal(21, 4) // Misal: 10000
  yearlyPrice            Decimal?               @db.Decimal(21, 4) // Misal: 96000 (diskon 20%)
  currency               String                 @default("IDR") @db.Char(3)
  // Limits (jika add-on punya limit sendiri)
  additionalLimit        Int? // Misal: +1000 transactions, +10GB storage
  limitType              String?                @db.VarChar(20) // TRANSACTIONS, STORAGE, USERS, dll
  // Availability (add-on bisa dibeli untuk plan tertentu saja)
  availableForLite       Boolean                @default(true)
  availableForPro        Boolean                @default(true)
  availableForEnterprise Boolean                @default(true)
  // Display
  displayOrder           Int?                   @default(0)
  isPopular              Boolean?               @default(false)
  iconName               String?                @db.VarChar(50)
  // Status
  isActive               Boolean                @default(true)
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  // Relations
  companyAddons          saas_CompanyAddon[]

  @@id([id], map: "pk_saas_AddonFeature")
  @@unique([addonCode], map: "unique_addon_code")
}

// Company Addons (Add-on yang diaktifkan per company)
model saas_CompanyAddon {
  id              String                   @db.Char(30)
  subscription_id String                   @db.Char(30)
  company_id      String                   @db.Char(5)
  branch_id       String                   @db.Char(10)
  addon_id        String                   @db.Char(10)
  // Activation
  activatedDate   DateTime                 @default(now())
  expiryDate      DateTime?                @db.Date
  isActive        Boolean                  @default(true)
  // Pricing (bisa custom per company)
  monthlyPrice    Decimal                  @db.Decimal(21, 4)
  yearlyPrice     Decimal?                 @db.Decimal(21, 4)
  // Billing
  lastBilledDate  DateTime?
  nextBillingDate DateTime?
  // Status
  addonStatus     AddonStatusEnum          @default(ACTIVE)
  // Metadata
  iStatus         MasterRecordStatusEnum   @default(Active)
  remarks         String?                  @db.VarChar(250)
  createdBy       String?                  @db.Char(10)
  createdAt       DateTime                 @default(now())
  updatedBy       String?                  @db.Char(10)
  updatedAt       DateTime
  // Relations
  subscription    saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company         sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)
  addon           saas_AddonFeature        @relation(fields: [addon_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_CompanyAddon")
  @@index([subscription_id], map: "idx_company_addon_subscription")
  @@index([company_id], map: "idx_company_addon_company")
  @@index([addon_id], map: "idx_company_addon_addon")
}

/// ============================================================================
/// SYSTEM & USER MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage company, user, role, menu, dan permissions

model sys_Company {
  seq_no  Int                    @db.SmallInt
  id      String                 @id @db.Char(5)
  name    String?                @db.VarChar(50)
  iStatus MasterRecordStatusEnum @default(Active)
  isMain  Boolean?               @default(false)

  province         String?                    @db.VarChar(50)
  district         String?                    @db.VarChar(50)
  city             String?                    @db.VarChar(50)
  address1         String?                    @db.VarChar(250)
  address2         String?                    @db.VarChar(250)
  address3         String?                    @db.VarChar(250)
  postalCode       String?                    @db.Char(6)
  phone1           String?                    @db.VarChar(20)
  phone2           String?                    @db.VarChar(20)
  phone3           String?                    @db.VarChar(20)
  mobile1          String?                    @db.VarChar(20)
  mobile2          String?                    @db.VarChar(20)
  mobile3          String?                    @db.VarChar(20)
  email1           String?                    @db.VarChar(100)
  email2           String?                    @db.VarChar(100)
  email3           String?                    @db.VarChar(100)
  officialWebsite  String?                    @db.VarChar(100)
  companyLogo      String?                    @db.VarChar(255)
  createdBy        String?                    @db.Char(10)
  createdAt        DateTime
  updatedBy        String?                    @db.Char(10)
  updatedAt        DateTime
  userCompanyRoles sys_UserCompanyRole[]
  subscriptions    saas_CompanySubscription[]
  billingHistory   saas_SubscriptionBilling[]
  usageTracking    saas_UsageTracking[]
  companyAddons    saas_CompanyAddon[]
  branches         sys_Branch[]

  @@index([seq_no], map: "idx_sys_Company_seq_no")
}

model sys_Branch {
  id         String                 @id @db.Char(10)
  name       String                 @db.VarChar(50)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(255)
  company_id String                 @db.Char(5)
  company    sys_Company            @relation(fields: [company_id], references: [id])

  @@index([company_id], map: "idx_sys_Branch_company_id")
}

model sys_Role {
  id         String                 @id @db.Char(20)
  name       String                 @db.VarChar(20)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(255)
  company_id String?                @db.Char(5)
  branch_id  String?                @db.Char(10)
  userRoles  sys_UserRole[]
}

model sys_WhiteListEmail {
  id        Int      @id @db.SmallInt
  name      String   @db.VarChar(50)
  email     String   @unique @db.VarChar(100)
  createdAt DateTime @default(now())
}

model sys_User {
  id                 Int                     @id @db.SmallInt
  name               String                  @db.VarChar(50)
  email              String                  @unique @db.VarChar(100)
  emailVerified      Boolean                 @default(false)
  emailVerifiedAt    DateTime?
  isAdmin            Boolean                 @default(false)
  iStatus            MasterRecordStatusEnum  @default(Active)
  image              String?                 @db.VarChar(255)
  password           String                  @db.VarChar(255)
  hashedRefreshToken String?                 @db.VarChar(255)
  // Two-Factor Authentication
  twoFactorEnabled   Boolean                 @default(false)
  // Employee Reference (setiap user harus terdaftar sebagai employee)
  employee_id        String?                 @db.Char(20)
  company_id         String?                 @db.Char(5)
  branch_id          String?                 @db.Char(10)
  // Relations
  employee           cmf_Employee?           @relation(fields: [company_id, employee_id], references: [company_id, id], onUpdate: NoAction)
  userRoles          sys_UserRole[]
  sessions           sys_Session[]
  emailVerifications sys_EmailVerification[]
  twoFactorTokens    sys_TwoFactorToken[]
  passwordResets     sys_PasswordReset[]

  @@unique([company_id, employee_id], map: "unique_user_employee")
}

model sys_EmailVerification {
  id         String   @id @default(cuid()) @db.VarChar(50)
  user_id    Int      @db.SmallInt
  token      String   @unique @db.VarChar(255)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model sys_TwoFactorToken {
  id         String   @id @default(cuid()) @db.VarChar(50)
  user_id    Int      @db.SmallInt
  code       String   @db.VarChar(6) // 6-digit OTP
  expiresAt  DateTime
  used       Boolean  @default(false)
  createdAt  DateTime @default(now())
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([code])
}

model sys_PasswordReset {
  id         Int      @id @default(autoincrement())
  user_id    Int      @db.SmallInt
  token      String   @unique @db.VarChar(255)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  used       Boolean  @default(false)
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([user_id])
}

model sys_Session {
  id             String                 @id @default(cuid()) @db.VarChar(50)
  user_id        Int                    @db.Integer
  refreshToken   String                 @unique @db.VarChar(500)
  deviceName     String?                @db.VarChar(255)
  deviceType     String?                @db.VarChar(50) // mobile, desktop, tablet
  browser        String?                @db.VarChar(100)
  os             String?                @db.VarChar(100)
  ipAddress      String?                @db.VarChar(45) // IPv6 support
  userAgent      String?                @db.Text
  isActive       Boolean                @default(true)
  lastActivityAt DateTime               @default(now())
  expiresAt      DateTime
  createdAt      DateTime               @default(now())
  revokedAt      DateTime?
  revokedReason  String?                @db.VarChar(255)
  iStatus        MasterRecordStatusEnum @default(Active)
  company_id     String?                @db.Char(5)
  branch_id      String?                @db.Char(10)
  // Relations
  user           sys_User               @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([refreshToken])
  @@index([isActive])
}

model sys_UserRole {
  id            Int                    @id @db.SmallInt
  user_id       Int                    @db.SmallInt
  role_id       String                 @db.Char(20)
  iStatus       MasterRecordStatusEnum @default(Active)
  isDefault     Boolean?               @default(false)
  company_id    String?                @db.Char(5)
  branch_id     String?                @db.Char(10)
  role          sys_Role               @relation(fields: [role_id], references: [id])
  user          sys_User               @relation(fields: [user_id], references: [id])
  userCompanies sys_UserCompanyRole[]

  @@unique([user_id, role_id], map: "unique_user_role")
}

model sys_UserCompanyRole {
  id          Int                    @id @db.SmallInt
  userRole_id Int                    @db.SmallInt
  company_id  String                 @db.Char(5)
  branch_id   String                 @db.Char(10)
  iStatus     MasterRecordStatusEnum @default(Active)
  isDefault   Boolean?               @default(false)

  permissions sys_Menu_Permission[]
  userRole    sys_UserRole          @relation(fields: [userRole_id], references: [id], onDelete: NoAction)
  company     sys_Company           @relation(fields: [company_id], references: [id])

  @@unique([userRole_id, company_id], map: "unique_userRole_company")
}

model sys_Menu {
  id               Int                   @id @db.SmallInt
  parent_id        Int?                  @db.SmallInt
  menu_description String                @db.VarChar(255)
  href             String?               @db.VarChar(255)
  module_id        String                @db.Char(3)
  menu_type        String?               @db.VarChar(50)
  has_child        Boolean               @default(false)
  icon             String?               @db.VarChar(50)
  iStatus          String                @default("1")
  createdBy        String?               @db.Char(10)
  createdAt        DateTime              @default(now())
  updatedBy        String?               @db.Char(10)
  updatedAt        DateTime?
  parent           sys_Menu?             @relation("SubMenu", fields: [parent_id], references: [id], onDelete: NoAction)
  child            sys_Menu[]            @relation("SubMenu")
  permissions      sys_Menu_Permission[] @relation("MenuPermissions")
}

model sys_Menu_Permission {
  id                 Int                    @id @db.Integer
  userCompanyRole_id Int
  menu_id            Int
  can_view           Boolean                @default(false)
  can_create         Boolean                @default(false)
  can_edit           Boolean                @default(false)
  can_delete         Boolean                @default(false)
  can_print          Boolean                @default(false)
  can_approve        Boolean                @default(false)
  iStatus            MasterRecordStatusEnum @default(Active)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime?
  menu               sys_Menu               @relation("MenuPermissions", fields: [menu_id], references: [id], onDelete: NoAction)
  userCompanyRole    sys_UserCompanyRole    @relation(fields: [userCompanyRole_id], references: [id], onDelete: NoAction)

  @@unique([userCompanyRole_id, menu_id])
}

model sys_Migration_log {
  id             Int      @id @default(autoincrement())
  from_tableName String
  to_tableName   String
  migratedAt     DateTime
  status         String
}

// Document Numbering Configuration
model sys_DocumentNumber {
  counterCode    String                 @db.VarChar(10) // PCO, PCR, SO, INV, CR, CP, dll
  description    String?                @db.VarChar(100) // Purchase Order, Service Order, dll
  module         String?                @db.VarChar(20) // PROCUREMENT, SERVICE, ACCOUNTING, dll
  prefix         String?                @db.VarChar(10) // Prefix tambahan (opsional)
  delimiter      String                 @default("/") @db.VarChar(5) // Pemisah: / atau -
  includeYear    Boolean                @default(true) // Include tahun di format
  includeMonth   Boolean                @default(true) // Include bulan di format
  startNumber    Int                    @default(1) // Nomor awal
  currentNumber  Int                    @default(0) // Nomor terakhir yang digunakan
  sequenceLength Int                    @default(5) // Panjang sequence (5 = 00001)
  resetAt        DocumentResetEnum      @default(MONTH) // NEVER, YEAR, MONTH, DAY
  format         String                 @db.VarChar(50) // Template format: {CODE}/{YYYY}/{MM}/{SEQ}
  // Sample Output
  sampleOutput   String?                @db.VarChar(50) // Contoh: PCO/2025/10/00001
  // Status & Metadata
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)

  @@id([company_id, counterCode], map: "pk_sys_DocumentNumber")
  @@unique([company_id, counterCode], map: "unique_counter_code")
  @@index([company_id, module], map: "idx_doc_number_module")
}

/// ============================================================================
/// INVENTORY & WAREHOUSE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage warehouse, lokasi penyimpanan, dan inventory
/// Struktur: Warehouse → Floor → Shelf → Row

model imc_Warehouse {
  id               String                 @id @db.Char(4)
  name             String?                @db.Char(60)
  iMain            Int?
  iStatus          MasterRecordStatusEnum @default(Active)
  address          String?                @db.VarChar(250)
  postalCode       String?                @db.Char(6)
  phone            String?                @db.Char(12)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  floor            imc_Floor[]
  purchaseOrders   prc_PurchaseOrder[]
  purchaseReceives prc_PurchaseReceive[]
  purchaseReturns  prc_PurchaseReturn[]
  sourceMovements  inv_InternalMovement[] @relation("SourceWarehouse")
  destMovements    inv_InternalMovement[] @relation("DestWarehouse")
}

model imc_Floor {
  warehouse_id String                 @db.Char(4)
  id           String                 @id(map: "pk_ic_floor") @db.Char(5)
  name         String?                @db.Char(35)
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  warehouse    imc_Warehouse          @relation(fields: [warehouse_id], references: [id], onDelete: NoAction)
  row          imc_Row[]
  shelf        imc_Shelf[]
}

model imc_Shelf {
  floor_id   String                 @db.Char(5)
  id         String                 @db.Char(15)
  name       String?                @db.Char(35)
  iStatus    MasterRecordStatusEnum @default(Active)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  imc_row    imc_Row[]
  imc_floor  imc_Floor              @relation(fields: [floor_id], references: [id], onDelete: NoAction)

  @@id([floor_id, id], map: "pk_ic_shelf")
  @@unique([floor_id, id], map: "unique_floor_id_shelf_id")
}

model imc_Row {
  floor_id   String                 @db.Char(5)
  shelf_id   String                 @db.Char(15)
  id         String                 @db.Char(15)
  name       String?                @db.Char(35)
  iStatus    MasterRecordStatusEnum @default(Active)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  storages   String?                @db.Char(15)
  floor      imc_Floor              @relation(fields: [floor_id], references: [id], onDelete: NoAction)
  shelf      imc_Shelf              @relation(fields: [floor_id, shelf_id], references: [floor_id, id], onDelete: NoAction)

  @@id([floor_id, shelf_id, id], map: "pk_ic_row")
  @@unique([floor_id, shelf_id, id], map: "unique_floor_id_shelf_id_row_id")
}

/// ============================================================================
/// PRODUCT CATEGORY & UOM MODULE
/// ============================================================================
/// Module untuk manage kategori produk, sub-kategori, brand, dan UOM

model imc_Uom {
  id         String                 @db.Char(10)
  name       String?                @db.VarChar(50)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(250)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime               @default(now())
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  products   imc_Product[]

  @@id([company_id, id], map: "pk_imc_Uoms")
}

model imc_CategoryType {
  id           Int                    @id @default(autoincrement()) @db.SmallInt
  name         String?                @db.VarChar(20)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  stock_acct   String?                @db.Char(10)
  sales_acct   String?                @db.Char(10)
  cogs_acct    String?                @db.Char(10)
  expense_acct String?                @db.Char(10)
  asset_acct   String?                @db.Char(10)
  company_id   String                 @db.Char(5)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime?              @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime?
  branch_id    String?                @db.Char(10)
  categories   imc_Category[]
}

model imc_Category {
  type          Int                    @db.SmallInt
  id            String                 @db.Char(10)
  name          String?                @db.VarChar(80)
  seq           Int?                   @default(0)
  remarks       String?                @db.VarChar(250)
  iStatus       MasterRecordStatusEnum @default(Active)
  imageURL      String?                @db.VarChar(250)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  href          String?                @db.VarChar(150)
  icon          String?                @db.VarChar(50)
  categoryType  imc_CategoryType       @relation(fields: [type], references: [id], onUpdate: NoAction)
  products      imc_Product[]
  subCategories imc_SubCategory[]
  // keywords      cms_subCategoriesKeywords[]

  @@id([company_id, id], map: "pk_imc_Categories")
  @@unique([company_id, id], map: "company_id_id")
}

model imc_SubCategory {
  id           String                 @db.Char(10)
  seq          Int?                   @default(0)
  imageURL     String?                @db.VarChar(250)
  category_id  String                 @db.Char(10)
  name         String                 @db.VarChar(80)
  descriptions String?                @db.VarChar(250)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  category     imc_Category           @relation(fields: [company_id, category_id], references: [company_id, id])
  products     imc_Product[]

  @@id([company_id, category_id, id], map: "pk_imc_SubCategories")
}

model imc_Brand {
  id           String                 @db.Char(10)
  name         String                 @db.VarChar(50)
  slug         String?                @db.VarChar(50)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  imc_Products imc_Product[]

  @@id([company_id, id], map: "pk_imc_Brands")
}

model imc_Product {
  id                      String                       @db.Char(20)
  register_id             String?                      @db.Char(20)
  catalog_id              String?                      @db.Char(20)
  name                    String                       @db.VarChar(250)
  category_id             String                       @db.Char(10)
  subCategory_id          String                       @db.Char(10)
  brand_id                String                       @db.Char(10)
  uom_id                  String                       @db.Char(10)
  eCatalogURL             String?                      @db.VarChar(250)
  remarks                 String?                      @db.VarChar(250)
  iStatus                 MasterRecordStatusEnum       @default(Active)
  isMaterial              Boolean                      @default(false)
  isService               Boolean                      @default(false)
  isFeatured              Boolean?                     @default(false)
  isFinishing             Boolean                      @default(false)
  isAccessories           Boolean                      @default(false)
  createdBy               String?                      @db.Char(50)
  createdAt               DateTime                     @default(now())
  updatedBy               String?                      @db.Char(50)
  updatedAt               DateTime
  company_id              String                       @db.Char(5)
  branch_id               String                       @db.Char(10)
  category                imc_Category                 @relation(fields: [company_id, category_id], references: [company_id, id], onUpdate: NoAction)
  subCategory             imc_SubCategory              @relation(fields: [company_id, category_id, subCategory_id], references: [company_id, category_id, id], onUpdate: NoAction)
  uom                     imc_Uom                      @relation(fields: [company_id, uom_id], references: [company_id, id], onUpdate: NoAction)
  brand                   imc_Brand                    @relation(fields: [company_id, brand_id], references: [company_id, id], onUpdate: NoAction)
  images                  imc_ProductImage[]
  productStock            imc_ProductStock[]
  productVariants         imc_ProductVariant[]
  productVariantTypes     imc_ProductVariantType[]
  serviceOrderDetails     wks_ServiceOrderDetail[]
  purchaseOrderDetails    prc_PurchaseOrderDetail[]
  purchaseReceiveDetails  prc_PurchaseReceiveDetail[]
  internalMovementDetails inv_InternalMovementDetail[]
  apInvoiceDetails        apm_InvoiceDetail[]
  purchaseReturnDetails   prc_PurchaseReturnDetail[]

  @@id([company_id, id], map: "pk_imc_Products")
  @@unique([company_id, id], map: "unique_company_id_id")
}

model imc_ProductStock {
  id                 String                 @db.Char(20)
  iStatus            MasterRecordStatusEnum @default(Active)
  warehouse_id       String                 @db.Char(4)
  floor_id           String                 @db.Char(5)
  shelf_id           String                 @db.Char(15)
  row_id             String                 @db.Char(15)
  batch_no           String?                @db.Char(20)
  mExpired_dt        String                 @db.Char(10)
  yExpired_dt        String                 @db.Char(4)
  product_cd         String?                @db.Char(20)
  i_month_expired    Int?
  i_year_expired     Int?
  req_qty            Decimal?               @db.Decimal(12, 4)
  po_qty             Decimal?               @db.Decimal(12, 4)
  grn_qty            Decimal?               @db.Decimal(12, 4)
  so_qty             Decimal?               @db.Decimal(12, 4)
  spk_qty            Decimal?               @db.Decimal(12, 4)
  sj_qty             Decimal?               @db.Decimal(12, 4)
  sl_invoice_qty     Decimal?               @db.Decimal(12, 4)
  sl_return_qty      Decimal?               @db.Decimal(12, 4)
  po_return_qty      Decimal?               @db.Decimal(12, 4)
  stock_opname_qty   Decimal?               @db.Decimal(12, 4)
  intern_receive_qty Decimal?               @db.Decimal(12, 4)
  intern_issue_qty   Decimal?               @db.Decimal(12, 4)
  onhand_qty         Decimal?               @db.Decimal(22, 4)
  unit_cost          Decimal?               @db.Decimal(21, 4)
  selling_price      Decimal?               @db.Decimal(21, 4)
  createdBy          String?                @db.Char(50)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(50)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  products           imc_Product            @relation(fields: [id, company_id], references: [id, company_id], onUpdate: NoAction)

  @@id([id, floor_id, shelf_id, row_id, mExpired_dt, yExpired_dt, warehouse_id, company_id])
}

model imc_ProductStockCard {
  customer_or_supplier_id String                 @db.Char(20)
  trx_id                  String                 @db.Char(2)
  trx_class               String                 @db.Char(2)
  module_id               String                 @db.Char(2)
  is_in_or_out            String                 @db.Char(1)
  doc_year                Int                    @db.SmallInt
  doc_month               Int                    @db.SmallInt
  doc_date                DateTime
  doc_id                  String                 @db.Char(20)
  descs                   String?                @db.VarChar(250)
  mutation_id             String                 @db.Char(20)
  mutation_date           DateTime
  ref_id                  String                 @db.Char(20)
  ref_date                DateTime
  iStatus                 MasterRecordStatusEnum @default(Active)
  warehouse_id            String                 @db.Char(4)
  to_warehouse_id         String                 @db.Char(4)
  srn_seq                 Int                    @db.SmallInt
  product_id              String                 @db.Char(20)
  qty                     Decimal                @db.Decimal(12, 4)
  mutation_qty            Decimal                @db.Decimal(12, 4)
  unit_cost               Decimal?               @db.Decimal(21, 4)
  mutation_cost           Decimal?               @db.Decimal(21, 4)
  floor_id                String                 @db.Char(5)
  shelf_id                String                 @db.Char(15)
  row_id                  String                 @db.Char(15)
  batch_no_item           String                 @db.Char(20)
  mExpired_dt             String                 @db.Char(10)
  yExpired_dt             String                 @db.Char(4)
  product_cd              String?                @db.Char(20)
  i_month_expired         Int?                   @db.SmallInt
  i_year_expired          Int?
  selling_price           Decimal?               @db.Decimal(21, 4)
  createdBy               String?                @db.Char(50)
  createdAt               DateTime               @default(now())
  updatedBy               String?                @db.Char(50)
  updatedAt               DateTime
  company_id              String                 @db.Char(5)
  branch_id               String                 @db.Char(10)

  @@id([product_id, floor_id, shelf_id, row_id, mExpired_dt, yExpired_dt, doc_id, mutation_id, srn_seq, batch_no_item, warehouse_id, company_id])
}

model imc_ProductImage {
  id         String      @db.Char(150)
  product_id String      @db.Char(20)
  imageURL   String      @db.VarChar(250)
  isPrimary  Boolean
  isBrochure Boolean?
  seq        Int?
  isVideo    Boolean?    @default(false)
  // iStatus     MasterRecordStatusEnum @default(Active)
  createdBy  String?     @db.Char(10)
  createdAt  DateTime    @default(now())
  updatedBy  String      @db.Char(10)
  updatedAt  DateTime
  company_id String      @db.Char(5)
  branch_id  String      @db.Char(10)
  products   imc_Product @relation(fields: [product_id, company_id], references: [id, company_id], onUpdate: NoAction)
  // cms_Product cms_Product[]

  @@id([product_id, company_id, id], map: "pk_imc_ProductImages")
}

/// ============================================================================
/// PRODUCT VARIANT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage variant produk bengkel otomotif
/// Menangani variant seperti: warna, ukuran, model, spesifikasi, dll
/// Struktur: VariantType → VariantOption → ProductVariant → ProductVariantOption

// Master Tipe Variant (Warna, Ukuran, Model, dll)
model imc_VariantType {
  id                  String                   @db.Char(10)
  name                String                   @db.VarChar(50) // Warna, Ukuran, Model, Tahun, Spesifikasi
  iStatus             MasterRecordStatusEnum   @default(Active)
  remarks             String?                  @db.VarChar(250)
  seq                 Int?                     @default(0) // urutan tampilan
  createdBy           String?                  @db.Char(10)
  createdAt           DateTime                 @default(now())
  updatedBy           String?                  @db.Char(10)
  updatedAt           DateTime
  company_id          String                   @db.Char(5)
  branch_id           String                   @db.Char(10)
  variantOptions      imc_VariantOption[]
  productVariantTypes imc_ProductVariantType[]

  @@id([company_id, id], map: "pk_imc_VariantType")
}

// Master Opsi Variant (Merah, Biru, S, M, L, dll)
model imc_VariantOption {
  id                    String                     @db.Char(15)
  variantType_id        String                     @db.Char(10)
  name                  String                     @db.VarChar(100) // Merah, Biru, 15 inch, Model X, 2024, dll
  code                  String?                    @db.Char(20) // kode untuk referensi, misal: RED, BLU, SIZE-15
  hexColorCode          String?                    @db.Char(7) // untuk warna: #FF0000
  imageURL              String?                    @db.VarChar(250) // gambar sample variant
  iStatus               MasterRecordStatusEnum     @default(Active)
  remarks               String?                    @db.VarChar(250)
  seq                   Int?                       @default(0)
  createdBy             String?                    @db.Char(10)
  createdAt             DateTime                   @default(now())
  updatedBy             String?                    @db.Char(10)
  updatedAt             DateTime
  company_id            String                     @db.Char(5)
  branch_id             String                     @db.Char(10)
  variantType           imc_VariantType            @relation(fields: [company_id, variantType_id], references: [company_id, id], onUpdate: NoAction)
  productVariantOptions imc_ProductVariantOption[]

  @@id([company_id, variantType_id, id], map: "pk_imc_VariantOption")
}

// Definisi tipe variant apa saja yang dimiliki suatu produk
model imc_ProductVariantType {
  product_id     String                 @db.Char(20)
  variantType_id String                 @db.Char(10)
  isRequired     Boolean                @default(true) // apakah variant ini wajib dipilih
  seq            Int?                   @default(0) // urutan tampilan variant
  iStatus        MasterRecordStatusEnum @default(Active)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  product        imc_Product            @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  variantType    imc_VariantType        @relation(fields: [company_id, variantType_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, variantType_id], map: "pk_imc_ProductVariantType")
}

// SKU Variant Produk (kombinasi produk dengan variant options)
model imc_ProductVariant {
  id              String                     @db.Char(30) // SKU unique identifier
  product_id      String                     @db.Char(20)
  sku             String                     @db.VarChar(50) // SKU code, misal: PROD-001-RED-M
  barcode         String?                    @db.VarChar(50) // barcode untuk variant ini
  name            String?                    @db.VarChar(250) // nama variant, misal: "Product A - Merah - Size M"
  additionalPrice Decimal?                   @db.Decimal(21, 4) // harga tambahan untuk variant ini
  stockQty        Decimal?                   @db.Decimal(12, 4) // stock khusus variant ini
  weight          Decimal?                   @db.Decimal(10, 2) // berat (kg)
  length          Decimal?                   @db.Decimal(10, 2) // panjang (cm)
  width           Decimal?                   @db.Decimal(10, 2) // lebar (cm)
  height          Decimal?                   @db.Decimal(10, 2) // tinggi (cm)
  imageURL        String?                    @db.VarChar(250) // gambar utama variant
  iStatus         MasterRecordStatusEnum     @default(Active)
  isDefault       Boolean?                   @default(false) // variant default
  remarks         String?                    @db.VarChar(250)
  createdBy       String?                    @db.Char(10)
  createdAt       DateTime                   @default(now())
  updatedBy       String?                    @db.Char(10)
  updatedAt       DateTime
  company_id      String                     @db.Char(5)
  branch_id       String                     @db.Char(10)
  product         imc_Product                @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  variantOptions  imc_ProductVariantOption[]
  variantImages   imc_ProductVariantImage[]

  @@id([company_id, product_id, id], map: "pk_imc_ProductVariant")
  @@unique([company_id, sku], map: "unique_sku")
}

// Relasi antara Product Variant dengan Variant Options yang dipilih
model imc_ProductVariantOption {
  productVariant_id String             @db.Char(30)
  product_id        String             @db.Char(20)
  variantType_id    String             @db.Char(10)
  variantOption_id  String             @db.Char(15)
  company_id        String             @db.Char(5)
  branch_id         String             @db.Char(10)
  productVariant    imc_ProductVariant @relation(fields: [company_id, product_id, productVariant_id], references: [company_id, product_id, id], onUpdate: NoAction)
  variantOption     imc_VariantOption  @relation(fields: [company_id, variantType_id, variantOption_id], references: [company_id, variantType_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, productVariant_id, variantType_id, variantOption_id], map: "pk_imc_ProductVariantOption")
}

// Gambar-gambar untuk Product Variant
model imc_ProductVariantImage {
  id                String                 @db.Char(150)
  productVariant_id String                 @db.Char(30)
  product_id        String                 @db.Char(20)
  imageURL          String                 @db.VarChar(250)
  isPrimary         Boolean                @default(false)
  seq               Int?                   @default(0)
  isVideo           Boolean?               @default(false)
  iStatus           MasterRecordStatusEnum @default(Active)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  updatedBy         String?                @db.Char(10)
  updatedAt         DateTime
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  productVariant    imc_ProductVariant     @relation(fields: [company_id, product_id, productVariant_id], references: [company_id, product_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, productVariant_id, id], map: "pk_imc_ProductVariantImage")
}

/// ============================================================================
/// CUSTOMER & VEHICLE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage customer (Individual & Corporate) dan kendaraan
/// Support multi-vehicle per customer dan fleet management
/// Struktur: VehicleType → VehicleBrand → VehicleModel → CustomerVehicle

// Master Employee - Semua person di bengkel
// Digunakan untuk: User Login, Mechanic, Payroll, Attendance
model cmf_Employee {
  id               String                 @db.Char(20) // Manual: EMP-001, EMP-002, dst
  employeeCode     String                 @db.VarChar(20) // Kode pegawai internal
  name             String                 @db.VarChar(100)
  nickname         String?                @db.VarChar(50)
  email            String?                @unique @db.VarChar(100)
  mobile           String?                @db.VarChar(20)
  phone            String?                @db.VarChar(20)
  // Personal Info
  birthDate        DateTime?              @db.Date
  gender           String?                @db.Char(1) // M/F
  identityNumber   String?                @db.VarChar(30) // KTP/Passport
  taxNumber        String?                @db.VarChar(30) // NPWP
  // Address
  address          String?                @db.VarChar(250)
  city             String?                @db.VarChar(50)
  province         String?                @db.VarChar(50)
  postalCode       String?                @db.Char(6)
  // Employment Info
  joinDate         DateTime?              @db.Date
  resignDate       DateTime?              @db.Date
  employmentStatus String?                @db.VarChar(20) // Permanent, Contract, Freelance
  department       String?                @db.VarChar(50) // Service, Sales, Admin, Finance
  position         String?                @db.VarChar(50) // Mechanic, Admin, Manager, Cashier
  // Bank Info (untuk payroll)
  bankName         String?                @db.VarChar(50)
  bankAccountNo    String?                @db.VarChar(30)
  bankAccountName  String?                @db.VarChar(100)
  // Photo
  photoURL         String?                @db.VarChar(250)
  // Status
  iStatus          MasterRecordStatusEnum @default(Active)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  user             sys_User?
  mechanic         cmf_Mechanic?

  @@id([company_id, id], map: "pk_cmf_Employee")
  @@unique([company_id, employeeCode], map: "unique_employee_code")
  @@index([company_id, name], map: "idx_employee_name")
  @@index([company_id, department], map: "idx_employee_department")
}

// Master Tipe Kendaraan (Mobil, Motor, Truk, dll)
model wks_VehicleType {
  id        String                 @db.Char(5)
  name      String                 @db.VarChar(50) // Mobil, Motor, Truk, Bus, dll
  iStatus   MasterRecordStatusEnum @default(Active)
  remarks   String?                @db.VarChar(250)
  seq       Int?                   @default(0)
  createdBy String?                @db.Char(10)
  createdAt DateTime               @default(now())
  updatedBy String?                @db.Char(10)
  updatedAt DateTime
  brands    wks_VehicleBrand[]

  @@id([id], map: "pk_wks_VehicleType")
}

// Master Merk Kendaraan (Toyota, Honda, Yamaha, dll)
model wks_VehicleBrand {
  id             String                 @db.Char(10)
  vehicleType_id String                 @db.Char(5)
  name           String                 @db.VarChar(50) // Toyota, Honda, Suzuki, Yamaha, dll
  slug           String?                @db.VarChar(50)
  logoURL        String?                @db.VarChar(250)
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  seq            Int?                   @default(0)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  vehicleType    wks_VehicleType        @relation(fields: [vehicleType_id], references: [id], onUpdate: NoAction)
  models         wks_VehicleModel[]
  vehicles       cmf_CustomerVehicle[]

  @@id([vehicleType_id, id], map: "pk_wks_VehicleBrand")
}

// Master Model Kendaraan (Avanza, Xenia, Vario, Beat, dll)
model wks_VehicleModel {
  id             String                 @db.Char(15)
  vehicleType_id String                 @db.Char(5)
  brand_id       String                 @db.Char(10)
  name           String                 @db.VarChar(100) // Avanza, Xenia, Vario 125, Beat, Innova, dll
  slug           String?                @db.VarChar(100)
  imageURL       String?                @db.VarChar(250)
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  seq            Int?                   @default(0)
  // Spesifikasi umum (opsional)
  engineType     String?                @db.VarChar(50) // Bensin, Diesel, Elektrik, Hybrid
  transmission   String?                @db.VarChar(30) // Manual, Automatic, CVT
  fuelType       String?                @db.VarChar(30) // Premium, Pertalite, Pertamax, Solar
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime

  brand    wks_VehicleBrand      @relation(fields: [vehicleType_id, brand_id], references: [vehicleType_id, id], onUpdate: NoAction)
  vehicles cmf_CustomerVehicle[]

  @@id([vehicleType_id, brand_id, id], map: "pk_wks_VehicleModel")
}

// Master Customer
model cmf_Customer {
  id                        String                      @db.Char(20)
  customerType              CustomerTypeEnum            @default(INDIVIDUAL) // Individual atau Corporate
  // Data Personal/Corporate
  name                      String                      @db.VarChar(100) // Nama lengkap atau nama perusahaan
  legalName                 String?                     @db.VarChar(150) // Nama legal perusahaan (untuk corporate)
  nickname                  String?                     @db.VarChar(50)
  email                     String?                     @db.VarChar(100)
  phone1                    String?                     @db.VarChar(20)
  phone2                    String?                     @db.VarChar(20)
  mobile1                   String                      @db.VarChar(20)
  mobile2                   String?                     @db.VarChar(20)
  website                   String?                     @db.VarChar(100)
  // Corporate Specific
  companyRegistrationNumber String?                     @db.VarChar(50) // SIUP, TDP, NIB
  businessType              String?                     @db.VarChar(50) // PT, CV, Firma, Yayasan, Pemerintah
  industryType              String?                     @db.VarChar(50) // Manufacturing, Service, Retail, Automotive
  companySize               String?                     @db.VarChar(20) // Small, Medium, Large, Enterprise
  numberOfEmployees         Int?                        @db.SmallInt
  numberOfVehicles          Int?                        @db.SmallInt // Jumlah armada (untuk fleet)
  // Alamat
  province                  String?                     @db.VarChar(50)
  district                  String?                     @db.VarChar(50)
  city                      String?                     @db.VarChar(50)
  subDistrict               String?                     @db.VarChar(50)
  address1                  String?                     @db.VarChar(250)
  address2                  String?                     @db.VarChar(250)
  postalCode                String?                     @db.Char(6)
  // Billing Address (untuk corporate - bisa beda dengan alamat utama)
  billingProvince           String?                     @db.VarChar(50)
  billingDistrict           String?                     @db.VarChar(50)
  billingCity               String?                     @db.VarChar(50)
  billingSubDistrict        String?                     @db.VarChar(50)
  billingAddress1           String?                     @db.VarChar(250)
  billingAddress2           String?                     @db.VarChar(250)
  billingPostalCode         String?                     @db.Char(6)
  // Data Identitas
  idCardType                String?                     @db.VarChar(20) // KTP, SIM, Passport (untuk individual)
  idCardNumber              String?                     @db.VarChar(30)
  taxNumber                 String?                     @db.VarChar(30) // NPWP
  taxName                   String?                     @db.VarChar(150) // Nama di NPWP (bisa beda)
  taxAddress                String?                     @db.VarChar(250) // Alamat di NPWP
  // Data Lainnya
  birthDate                 DateTime?                   @db.Date
  gender                    GenderEnum?
  occupation                String?                     @db.VarChar(50)
  customerSince             DateTime?                   @default(now())
  // Membership/Loyalty
  membershipLevel           String?                     @db.VarChar(20) // Regular, Silver, Gold, Platinum
  loyaltyPoints             Int?                        @default(0)
  totalTransaction          Decimal?                    @default(0) @db.Decimal(21, 4)
  lastVisitDate             DateTime?
  // Credit & Payment Terms (untuk corporate)
  paymentTermDays           Int?                        @db.SmallInt // NET 30, NET 60, dll
  creditLimit               Decimal?                    @db.Decimal(21, 4)
  currentDebt               Decimal?                    @default(0) @db.Decimal(21, 4)
  isCOD                     Boolean?                    @default(true) // Cash on Delivery
  // Status & Metadata
  iStatus                   MasterRecordStatusEnum      @default(Active)
  isBlacklisted             Boolean?                    @default(false)
  blacklistReason           String?                     @db.VarChar(250)
  remarks                   String?                     @db.VarChar(250)
  profileImageURL           String?                     @db.VarChar(250)
  createdBy                 String?                     @db.Char(10)
  createdAt                 DateTime                    @default(now())
  updatedBy                 String?                     @db.Char(10)
  updatedAt                 DateTime
  company_id                String                      @db.Char(5)
  branch_id                 String                      @db.Char(10)
  // Relations
  vehicles                  cmf_CustomerVehicle[]
  serviceOrders             wks_ServiceOrder[]
  serviceHistory            wks_ServiceHistory[]
  complaints                wks_CustomerComplaint[]
  invoices                  arm_Invoice[]
  payments                  arm_Payment[]
  contactPersons            cmf_CustomerContactPerson[]
  serviceReworks            wks_ServiceRework[]
  creditNotes               arm_CreditNote[]

  @@id([company_id, id], map: "pk_cmf_Customer")
  @@unique([company_id, mobile1], map: "unique_customer_mobile")
  @@index([company_id, name], map: "idx_customer_name")
  @@index([company_id, email], map: "idx_customer_email")
}

// Contact Person untuk Corporate Customer
model cmf_CustomerContactPerson {
  id            String                 @db.Char(20)
  customer_id   String                 @db.Char(20)
  // Personal Info
  name          String                 @db.VarChar(100)
  position      String?                @db.VarChar(50) // Purchasing Manager, Fleet Manager, Finance, dll
  department    String?                @db.VarChar(50) // Purchasing, Finance, Operasional, dll
  // Contact Info
  email         String?                @db.VarChar(100)
  phone         String?                @db.VarChar(20)
  mobile        String?                @db.VarChar(20)
  whatsapp      String?                @db.VarChar(20)
  // Authority
  isPrimary     Boolean?               @default(false) // Kontak utama
  canApprove    Boolean?               @default(false) // Bisa approve PO/invoice
  canOrder      Boolean?               @default(false) // Bisa order service
  approvalLimit Decimal?               @db.Decimal(21, 4) // Limit approval
  // Status & Metadata
  iStatus       MasterRecordStatusEnum @default(Active)
  remarks       String?                @db.VarChar(250)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  // Relations
  customer      cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, customer_id, id], map: "pk_cmf_CustomerContactPerson")
  @@index([company_id, customer_id], map: "idx_contact_person")
}

// Kendaraan yang dimiliki Customer
model cmf_CustomerVehicle {
  id                  String                  @db.Char(20)
  customer_id         String                  @db.Char(20)
  vehicleType_id      String                  @db.Char(5)
  brand_id            String                  @db.Char(10)
  model_id            String                  @db.Char(15)
  // Data Kendaraan
  licensePlate        String                  @db.VarChar(15) // Nomor Polisi (PLAT)
  vehicleYear         Int?                    @db.SmallInt // Tahun Kendaraan
  color               String?                 @db.VarChar(30)
  chassisNumber       String?                 @db.VarChar(30) // Nomor Rangka
  engineNumber        String?                 @db.VarChar(30) // Nomor Mesin
  // Informasi STNK/BPKB
  registrationNumber  String?                 @db.VarChar(30) // Nomor STNK
  ownershipDocument   String?                 @db.VarChar(30) // Nomor BPKB
  registrationExpiry  DateTime?               @db.Date // Tanggal habis STNK
  // Spesifikasi Teknis
  transmission        String?                 @db.VarChar(30) // Manual, Automatic, CVT
  fuelType            String?                 @db.VarChar(30) // Premium, Pertalite, Pertamax, Solar, Elektrik
  engineCapacity      String?                 @db.VarChar(20) // cc (misal: 1500cc, 150cc)
  // Odometer & Service
  currentOdometer     Int?                    @default(0) // Kilometer terakhir
  lastServiceDate     DateTime?
  lastServiceOdometer Int?
  nextServiceOdometer Int? // Reminder service berikutnya
  nextServiceDate     DateTime? // Reminder service berikutnya
  // Data Lainnya
  purchaseDate        DateTime?               @db.Date // Tanggal beli kendaraan
  insuranceProvider   String?                 @db.VarChar(50) // Asuransi
  insurancePolicyNo   String?                 @db.VarChar(30)
  insuranceExpiry     DateTime?               @db.Date
  // Status & Metadata
  iStatus             MasterRecordStatusEnum  @default(Active)
  isPrimary           Boolean?                @default(false) // Kendaraan utama customer
  remarks             String?                 @db.VarChar(250)
  vehicleImageURL     String?                 @db.VarChar(250)
  createdBy           String?                 @db.Char(10)
  createdAt           DateTime                @default(now())
  updatedBy           String?                 @db.Char(10)
  updatedAt           DateTime
  company_id          String                  @db.Char(5)
  branch_id           String                  @db.Char(10)
  // Relations
  customer            cmf_Customer            @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  brand               wks_VehicleBrand        @relation(fields: [vehicleType_id, brand_id], references: [vehicleType_id, id], onUpdate: NoAction)
  model               wks_VehicleModel        @relation(fields: [vehicleType_id, brand_id, model_id], references: [vehicleType_id, brand_id, id], onUpdate: NoAction)
  serviceOrders       wks_ServiceOrder[]
  serviceHistory      wks_ServiceHistory[]
  complaints          wks_CustomerComplaint[]
  invoices            arm_Invoice[]
  serviceReworks      wks_ServiceRework[]
  creditNotes         arm_CreditNote[]

  @@id([company_id, customer_id, id], map: "pk_cmf_CustomerVehicle")
  @@unique([company_id, licensePlate], map: "unique_license_plate")
  @@index([company_id, customer_id], map: "idx_customer_vehicles")
  @@index([company_id, licensePlate], map: "idx_license_plate")
}

/// ============================================================================
/// SERVICE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage service order, mekanik, service bay, dan history
/// Flow: ServiceOrder → ServiceOrderDetail → ServiceHistory
/// Support: QC check, customer rating, mechanic assignment

// Master Tipe Service (Service Rutin, Ganti Oli, Tune Up, dll)
model wks_ServiceType {
  id                  String                   @db.Char(10)
  name                String                   @db.VarChar(100) // Service Rutin, Ganti Oli, Tune Up, Body Repair, dll
  category            ServiceCategoryEnum? // MAINTENANCE, REPAIR, BODYWORK, WASH, INSPECTION
  description         String?                  @db.VarChar(250)
  estimatedTime       Int? // Estimasi waktu dalam menit
  defaultPrice        Decimal?                 @db.Decimal(21, 4) // Harga standar
  iStatus             MasterRecordStatusEnum   @default(Active)
  remarks             String?                  @db.VarChar(250)
  seq                 Int?                     @default(0)
  createdBy           String?                  @db.Char(10)
  createdAt           DateTime                 @default(now())
  updatedBy           String?                  @db.Char(10)
  updatedAt           DateTime
  company_id          String                   @db.Char(5)
  branch_id           String                   @db.Char(10)
  serviceOrderDetails wks_ServiceOrderDetail[]

  @@id([company_id, id], map: "pk_wks_ServiceType")
}

// Master Mekanik/Teknisi
// Mechanic Profile - Extended dari cmf_Employee
model cmf_Mechanic {
  id                  String                   @db.Char(10)
  employee_id         String                   @db.Char(20) // Reference ke cmf_Employee
  specialization      String?                  @db.VarChar(100) // Mesin, Body, Elektrik, AC, dll
  level               MechanicLevelEnum?       @default(JUNIOR) // JUNIOR, SENIOR, MASTER, FOREMAN
  // Performance Tracking
  totalJobs           Int?                     @default(0)
  averageRating       Decimal?                 @db.Decimal(3, 2) // Rating 0.00 - 5.00
  // Status
  iStatus             MasterRecordStatusEnum   @default(Active)
  isAvailable         Boolean?                 @default(true)
  remarks             String?                  @db.VarChar(250)
  createdBy           String?                  @db.Char(10)
  createdAt           DateTime                 @default(now())
  updatedBy           String?                  @db.Char(10)
  updatedAt           DateTime
  company_id          String                   @db.Char(5)
  branch_id           String                   @db.Char(10)
  // Relations
  employee            cmf_Employee             @relation(fields: [company_id, employee_id], references: [company_id, id], onUpdate: NoAction)
  serviceOrders       wks_ServiceOrder[]
  serviceOrderDetails wks_ServiceOrderDetail[]
  serviceReworks      wks_ServiceRework[]

  @@id([company_id, id], map: "pk_cmf_Mechanic")
  @@unique([company_id, employee_id], map: "unique_mechanic_employee")
  @@index([company_id, specialization], map: "idx_mechanic_specialization")
}

// Master Service Bay/Stall (Tempat Service)
model wks_ServiceBay {
  id             String                 @db.Char(10)
  name           String                 @db.VarChar(50) // Bay 1, Bay 2, Stall A, dll
  bayType        ServiceBayTypeEnum? // GENERAL, HEAVY_DUTY, QUICK_SERVICE, BODYWORK, WASH
  capacity       Int?                   @default(1) // Jumlah kendaraan yang muat
  iStatus        MasterRecordStatusEnum @default(Active)
  isOccupied     Boolean?               @default(false)
  remarks        String?                @db.VarChar(250)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  serviceOrders  wks_ServiceOrder[]
  serviceReworks wks_ServiceRework[]

  @@id([company_id, id], map: "pk_wks_ServiceBay")
}

// ============================================================================
// SERVICE BOOKING & SCHEDULING
// ============================================================================

enum BookingStatusEnum {
  PENDING    @map("0")   // Baru dibuat, menunggu konfirmasi
  CONFIRMED  @map("1")   // Sudah dikonfirmasi dan terjadwal
  CHECKED_IN @map("2")   // Customer sudah datang
  IN_SERVICE @map("3")   // Sedang dikerjakan
  COMPLETED  @map("4")   // Selesai (biasanya lanjut ke Service Order)
  NO_SHOW    @map("5")   // Customer tidak datang
  CANCELLED  @map("9")   // Dibatalkan
}

enum BookingSourceEnum {
  WEB     @map("WEB")
  APP     @map("APP")
  PHONE   @map("PHONE")
  WALKIN  @map("WALKIN")
}

enum SlotStatusEnum {
  OPEN    @map("OPEN")   // Slot tersedia
  BLOCKED @map("BLOCKED") // Ditutup (maintenance/libur)
  FULL    @map("FULL")    // Penuh (kapasitas terpenuhi)
}

// Jam kerja per hari (per branch)
model wks_BranchWorkingHour {
  company_id String  @db.Char(5)
  branch_id  String  @db.Char(10)
  weekday    Int     @db.SmallInt // 0=Sun, 1=Mon, ... 6=Sat
  isOpen     Boolean @default(true)
  openTime   String? @db.Char(5) // "08:00"
  closeTime  String? @db.Char(5) // "17:00"
  remarks    String? @db.VarChar(250)

  @@id([company_id, branch_id, weekday], map: "pk_wks_BranchWorkingHour")
  @@index([company_id, branch_id], map: "idx_branch_workinghour_branch")
}

// Hari libur/pengecualian jadwal (per branch)
model wks_BranchHoliday {
  id         String   @db.Char(20)
  company_id String   @db.Char(5)
  branch_id  String?  @db.Char(10)
  date       DateTime @db.Date
  name       String?  @db.VarChar(100)
  isClosed   Boolean  @default(true)
  remarks    String?  @db.VarChar(250)
  createdAt  DateTime @default(now())

  @@id([company_id, id], map: "pk_wks_BranchHoliday")
  @@index([company_id, branch_id, date], map: "idx_branch_holiday_date")
}

// Ketersediaan mekanik per tanggal (override jam kerja umum)
model wks_MechanicAvailability {
  id           String  @db.Char(20)
  company_id   String  @db.Char(5)
  mechanic_id  String  @db.Char(10)
  date         DateTime @db.Date
  availableStart String? @db.Char(5) // "09:00"
  availableEnd   String? @db.Char(5) // "16:00"
  isAvailable    Boolean @default(true)
  reason         String? @db.VarChar(100) // Cuti, Training, Sakit, dll
  remarks        String? @db.VarChar(250)
  createdAt      DateTime @default(now())

  mechanic     cmf_Mechanic @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_MechanicAvailability")
  @@index([company_id, mechanic_id, date], map: "idx_mechanic_availability_date")
}

// Blokir bay (maintenance, cleaning, dipakai internal, dll)
model wks_BayBlock {
  id          String   @db.Char(20)
  company_id  String   @db.Char(5)
  branch_id   String   @db.Char(10)
  bay_id      String   @db.Char(10)
  startTime   DateTime
  endTime     DateTime
  reason      String?  @db.VarChar(100)
  remarks     String?  @db.VarChar(250)
  createdAt   DateTime @default(now())

  bay         wks_ServiceBay @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_BayBlock")
  @@index([company_id, branch_id, bay_id, startTime, endTime], map: "idx_bayblock_range")
}

// Slot jadwal opsional (untuk pre-generate time slots per cabang/bay)
model wks_BookingSlot {
  id          String    @db.Char(20)
  company_id  String    @db.Char(5)
  branch_id   String    @db.Char(10)
  bay_id      String?   @db.Char(10)
  date        DateTime  @db.Date
  startTime   DateTime
  endTime     DateTime
  capacity    Int       @default(1)
  bookedCount Int       @default(0)
  slotStatus  SlotStatusEnum @default(OPEN)
  remarks     String?   @db.VarChar(250)
  createdAt   DateTime  @default(now())

  bay         wks_ServiceBay? @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_BookingSlot")
  @@index([company_id, branch_id, date], map: "idx_bookingslot_date")
  @@index([company_id, bay_id, startTime, endTime], map: "idx_bookingslot_bay_range")
}

// Inti booking service oleh customer
model wks_ServiceBooking {
  id                   String                 @db.Char(20)
  bookingNumber        String                 @db.VarChar(30) // BKG-2025-00001
  bookingDate          DateTime               @default(now())
  company_id           String                 @db.Char(5)
  branch_id            String                 @db.Char(10)
  // Customer & Vehicle
  customer_id          String                 @db.Char(20)
  customerVehicle_id   String                 @db.Char(20)
  vehicle_customer_id  String                 @db.Char(20) // FK untuk composite key
  // Preferensi waktu dari customer
  preferredDate        DateTime?              @db.Date
  preferredStartTime   String?                @db.Char(5) // "10:00"
  preferredEndTime     String?                @db.Char(5) // "11:00"
  // Jadwal terkonfirmasi (akan dipakai saat CONFIRMED)
  scheduledStart       DateTime?
  scheduledEnd         DateTime?
  // Alokasi resource (opsional saat booking)
  bay_id               String?                @db.Char(10)
  mechanic_id          String?                @db.Char(10)
  // Informasi layanan
  serviceType_id       String?                @db.Char(10)
  complaintNotes       String?                @db.Text
  additionalRequest    String?                @db.Text
  // Status & Sumber
  status               BookingStatusEnum      @default(PENDING)
  source               BookingSourceEnum      @default(WEB)
  // Reminder & kehadiran
  reminderSent         Boolean?               @default(false)
  checkInAt            DateTime?
  cancelledAt          DateTime?
  cancelReason         String?                @db.VarChar(250)
  // Metadata
  iStatus              MasterRecordStatusEnum @default(Active)
  remarks              String?                @db.VarChar(250)
  createdBy            String?                @db.Char(10)
  createdAt            DateTime               @default(now())
  updatedBy            String?                @db.Char(10)
  updatedAt            DateTime
  // Relations
  customer             cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  customerVehicle      cmf_CustomerVehicle    @relation(fields: [company_id, customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic             cmf_Mechanic?          @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  bay                  wks_ServiceBay?        @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)
  serviceType          wks_ServiceType?       @relation(fields: [company_id, serviceType_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceBooking")
  @@unique([company_id, bookingNumber], map: "unique_booking_number")
  @@index([company_id, branch_id, bookingDate], map: "idx_booking_date")
  @@index([company_id, status], map: "idx_booking_status")
  @@index([company_id, scheduledStart], map: "idx_booking_scheduled_start")
}

// Service Order / Work Order
model wks_ServiceOrder {
  id                     String                   @db.Char(20)
  orderNumber            String                   @db.VarChar(30) // SO-2024-0001
  orderDate              DateTime                 @default(now())
  customer_id            String                   @db.Char(20)
  customerVehicle_id     String                   @db.Char(20)
  vehicle_customer_id    String                   @db.Char(20) // FK untuk composite key
  // Informasi Kendaraan saat masuk
  odometerIn             Int? // KM saat masuk
  fuelLevel              FuelLevelEnum?           @default(EMPTY) // Level BBM saat masuk
  vehicleConditionNotes  String?                  @db.Text // Catatan kondisi kendaraan
  // Assignment
  mechanic_id            String?                  @db.Char(10)
  serviceBay_id          String?                  @db.Char(10)
  // Jadwal & Waktu
  scheduledStartDate     DateTime? // Jadwal mulai service
  scheduledEndDate       DateTime? // Estimasi selesai
  actualStartDate        DateTime? // Actual mulai service
  actualEndDate          DateTime? // Actual selesai
  estimatedDuration      Int? // Estimasi durasi (menit)
  actualDuration         Int? // Actual durasi (menit)
  // Keluhan & Permintaan Customer
  customerComplaint      String?                  @db.Text // Keluhan customer
  serviceRequest         String?                  @db.Text // Permintaan service
  // Diagnosa & Rekomendasi Mekanik
  mechanicDiagnosis      String?                  @db.Text // Hasil diagnosa
  mechanicRecommendation String?                  @db.Text // Rekomendasi mekanik
  // Biaya
  serviceCost            Decimal?                 @default(0) @db.Decimal(21, 4) // Total biaya jasa
  partsCost              Decimal?                 @default(0) @db.Decimal(21, 4) // Total biaya parts
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount            Decimal?                 @default(0) @db.Decimal(21, 4)
  // Status
  orderStatus            ServiceOrderStatusEnum   @default(DRAFT)
  paymentStatus          PaymentStatusEnum?       @default(UNPAID)
  priority               PriorityEnum?            @default(NORMAL) // LOW, NORMAL, HIGH, URGENT
  // Quality Control
  qcCheckedBy            String?                  @db.Char(10) // User ID QC
  qcCheckedDate          DateTime?
  qcNotes                String?                  @db.Text
  qcApproved             Boolean?                 @default(false)
  // Customer Feedback
  customerRating         Int?                     @db.SmallInt // Rating 1-5
  customerFeedback       String?                  @db.Text
  customerSignature      String?                  @db.VarChar(250) // URL signature image
  // Metadata
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  customer               cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle      @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic               cmf_Mechanic?            @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  serviceBay             wks_ServiceBay?          @relation(fields: [company_id, serviceBay_id], references: [company_id, id], onUpdate: NoAction)
  orderDetails           wks_ServiceOrderDetail[]
  histories              wks_ServiceHistory[]
  complaints             wks_CustomerComplaint[]
  invoices               arm_Invoice[]
  serviceReworks         wks_ServiceRework[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_wks_ServiceOrder")
  @@unique([company_id, orderNumber], map: "unique_order_number")
  @@index([company_id, customer_id], map: "idx_service_order_customer")
  @@index([company_id, orderDate], map: "idx_service_order_date")
  @@index([company_id, orderStatus], map: "idx_service_order_status")
}

// Detail Service Order (Pekerjaan & Parts yang digunakan)
model wks_ServiceOrderDetail {
  id                 String                 @db.Char(30) // Manual: SOD/2025/10/00001
  serviceOrder_id    String                 @db.Char(20)
  lineNumber         Int                    @db.SmallInt // Nomor urut item
  detailType         DetailTypeEnum // SERVICE atau PART
  // Untuk Service
  serviceType_id     String?                @db.Char(10)
  serviceName        String?                @db.VarChar(100) // Nama pekerjaan
  serviceDescription String?                @db.Text
  // Untuk Parts
  product_id         String?                @db.Char(20)
  productVariant_id  String?                @db.Char(30)
  partName           String?                @db.VarChar(250)
  partNumber         String?                @db.VarChar(50)
  // Mekanik yang mengerjakan
  mechanic_id        String?                @db.Char(10)
  // Quantity & Harga
  quantity           Decimal                @default(1) @db.Decimal(12, 4)
  unitPrice          Decimal                @db.Decimal(21, 4)
  discountPercent    Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount     Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent         Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount          Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal           Decimal                @db.Decimal(21, 4)
  // Waktu Pengerjaan
  startTime          DateTime?
  endTime            DateTime?
  duration           Int? // Durasi dalam menit
  // Status
  detailStatus       DetailStatusEnum?      @default(PENDING) // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  serviceOrder       wks_ServiceOrder       @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  serviceType        wks_ServiceType?       @relation(fields: [company_id, serviceType_id], references: [company_id, id], onUpdate: NoAction)
  mechanic           cmf_Mechanic?          @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  product            imc_Product?           @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceOrderDetail")
  @@index([company_id, serviceOrder_id], map: "idx_service_order_detail")
}

// Service History - History lengkap semua service kendaraan
model wks_ServiceHistory {
  id                  String                 @db.Char(30)
  serviceOrder_id     String                 @db.Char(20)
  customer_id         String                 @db.Char(20)
  customerVehicle_id  String                 @db.Char(20)
  vehicle_customer_id String                 @db.Char(20)
  // Informasi Service
  serviceDate         DateTime // Tanggal service
  orderNumber         String                 @db.VarChar(30)
  serviceSummary      String?                @db.Text // Ringkasan pekerjaan
  partsReplaced       String?                @db.Text // Parts yang diganti
  odometerReading     Int? // Odometer saat service
  // Biaya
  totalServiceCost    Decimal?               @db.Decimal(21, 4)
  totalPartsCost      Decimal?               @db.Decimal(21, 4)
  totalAmount         Decimal?               @db.Decimal(21, 4)
  // Next Service Reminder
  nextServiceDate     DateTime? // Reminder service berikutnya
  nextServiceOdometer Int? // KM untuk service berikutnya
  // Mekanik & Quality
  mechanicName        String?                @db.VarChar(100)
  customerRating      Int?                   @db.SmallInt
  customerFeedback    String?                @db.Text
  // Metadata
  iStatus             MasterRecordStatusEnum @default(Active)
  remarks             String?                @db.VarChar(250)
  createdBy           String?                @db.Char(10)
  createdAt           DateTime               @default(now())
  updatedBy           String?                @db.Char(10)
  updatedAt           DateTime
  company_id          String                 @db.Char(5)
  branch_id           String                 @db.Char(10)
  // Relations
  serviceOrder        wks_ServiceOrder       @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  customer            cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle             cmf_CustomerVehicle    @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceHistory")
  @@index([company_id, customer_id], map: "idx_service_history_customer")
  @@index([company_id, customerVehicle_id], map: "idx_service_history_vehicle")
  @@index([company_id, serviceDate], map: "idx_service_history_date")
}

/// ============================================================================
/// COMPLAINT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk handle customer complaint dengan tracking lengkap
/// Flow: Complaint → Investigation → Resolution → Follow Up
/// Support: Escalation, SLA tracking, preventive action

// Customer Complaint - Keluhan customer terhadap service
model wks_CustomerComplaint {
  id                     String                 @db.Char(30) // Manual: CMP/2025/10/00001
  complaintNumber        String                 @db.VarChar(30)
  complaintDate          DateTime               @default(now())
  serviceOrder_id        String?                @db.Char(20) // Service yang dikomplain
  customer_id            String                 @db.Char(20)
  customerVehicle_id     String?                @db.Char(20)
  vehicle_customer_id    String?                @db.Char(20) // FK untuk composite key
  // Complaint Info
  complaintType          ComplaintTypeEnum? // SERVICE_QUALITY, PARTS_QUALITY, PRICING, DELAY, STAFF_BEHAVIOR, OTHER
  complaintCategory      String?                @db.VarChar(50) // Mekanik tidak profesional, Hasil tidak memuaskan, dll
  subject                String                 @db.VarChar(250) // Judul complaint
  description            String                 @db.Text // Deskripsi detail complaint
  severity               SeverityEnum?          @default(MEDIUM) // LOW, MEDIUM, HIGH, CRITICAL
  // Customer Contact
  customerName           String?                @db.VarChar(100)
  customerPhone          String?                @db.VarChar(20)
  customerEmail          String?                @db.VarChar(100)
  preferredContactMethod String?                @db.VarChar(20) // Phone, Email, WhatsApp
  // Complaint Details
  complaintSource        ComplaintSourceEnum? // PHONE, EMAIL, WHATSAPP, IN_PERSON, SOCIAL_MEDIA, WEBSITE
  occurredDate           DateTime? // Kapan kejadian yang dikomplain
  reportedBy             String?                @db.VarChar(100) // Nama yang melaporkan (bisa beda dengan customer)
  // Evidence
  attachments            String?                @db.Text // JSON array URLs foto/dokumen bukti
  witnessName            String?                @db.VarChar(100)
  witnessContact         String?                @db.VarChar(50)
  // Assignment & Response
  assignedTo             String?                @db.Char(10) // User yang handle complaint
  assignedDate           DateTime?
  department             String?                @db.VarChar(50) // Service, Parts, Management, dll
  // Investigation
  investigationNotes     String?                @db.Text
  rootCause              String?                @db.Text // Akar masalah
  // Resolution
  resolutionDescription  String?                @db.Text // Penjelasan solusi
  resolutionDate         DateTime?
  resolvedBy             String?                @db.Char(10)
  compensationType       String?                @db.VarChar(50) // Free Service, Discount, Refund, Replacement, dll
  compensationAmount     Decimal?               @db.Decimal(21, 4)
  compensationNotes      String?                @db.Text
  // Follow Up
  followUpRequired       Boolean?               @default(false)
  followUpDate           DateTime?
  followUpBy             String?                @db.Char(10)
  followUpNotes          String?                @db.Text
  // Customer Satisfaction
  resolutionRating       Int?                   @db.SmallInt // Rating 1-5 setelah complaint resolved
  customerFeedback       String?                @db.Text // Feedback customer setelah penanganan
  isSatisfied            Boolean?
  // Status
  complaintStatus        ComplaintStatusEnum    @default(OPEN)
  priority               PriorityEnum?          @default(NORMAL)
  // SLA (Service Level Agreement)
  targetResolutionDate   DateTime? // Target tanggal selesai
  isOverdue              Boolean?               @default(false)
  // Escalation
  isEscalated            Boolean?               @default(false)
  escalatedTo            String?                @db.Char(10) // User/Manager yang di-escalate
  escalatedDate          DateTime?
  escalationReason       String?                @db.VarChar(250)
  // Preventive Action
  preventiveAction       String?                @db.Text // Tindakan pencegahan kedepan
  implementedBy          String?                @db.Char(10)
  implementedDate        DateTime?
  // Metadata
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  company_id             String                 @db.Char(5)
  branch_id              String                 @db.Char(10)
  // Relations
  serviceOrder           wks_ServiceOrder?      @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  customer               cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle?   @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  complaintLogs          wks_ComplaintLog[]
  serviceReworks         wks_ServiceRework[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_cmf_CustomerComplaint")
  @@unique([company_id, complaintNumber], map: "unique_complaint_number")
  @@index([company_id, customer_id], map: "idx_complaint_customer")
  @@index([company_id, serviceOrder_id], map: "idx_complaint_service")
  @@index([company_id, complaintDate], map: "idx_complaint_date")
  @@index([company_id, complaintStatus], map: "idx_complaint_status")
}

// Complaint Activity Log - History semua aktivitas complaint
model wks_ComplaintLog {
  id           String                 @db.Char(30) // Manual: CML/2025/10/00001
  complaint_id String                 @db.Char(30)
  logDate      DateTime               @default(now())
  logType      ComplaintLogTypeEnum // STATUS_CHANGE, ASSIGNMENT, RESPONSE, ESCALATION, RESOLUTION, FOLLOW_UP, NOTE
  oldStatus    ComplaintStatusEnum?
  newStatus    ComplaintStatusEnum?
  action       String?                @db.VarChar(100) // Assigned to John, Status changed, Called customer, dll
  description  String?                @db.Text
  actionBy     String?                @db.Char(10) // User yang melakukan action
  isInternal   Boolean?               @default(false) // Internal note atau visible ke customer
  attachments  String?                @db.Text // JSON array URLs
  // Metadata
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  // Relations
  complaint    wks_CustomerComplaint  @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ComplaintLog")
  @@index([company_id, complaint_id], map: "idx_complaint_log")
}

/// ============================================================================
/// SERVICE RETURN & REWORK MODULE
/// ============================================================================
/// Module untuk handle service rework dan credit note
/// Flow: Complaint → ServiceRework → CreditNote → GL
/// Support: Free rework, refund, voucher, dan compensation tracking

// Service Rework (Service Ulang/Redo)
model wks_ServiceRework {
  id                      String                  @db.Char(30) // Manual: SRW/2025/10/00001
  reworkNumber            String                  @db.VarChar(30)
  reworkDate              DateTime                @default(now())
  transaction_type        String                  @db.Char(5) // "SRW"
  transaction_class       String                  @db.Char(10) // "SERVICE"
  // Original Service Info
  originalServiceOrder_id String                  @db.Char(20)
  originalOrderNumber     String?                 @db.VarChar(30)
  complaint_id            String?                 @db.Char(30) // Link ke complaint
  // Customer & Vehicle
  customer_id             String                  @db.Char(20)
  customerVehicle_id      String                  @db.Char(20)
  vehicle_customer_id     String                  @db.Char(20)
  // Rework Reason
  reworkReason            ReworkReasonEnum? // POOR_QUALITY, INCOMPLETE, WRONG_PART, MALFUNCTION, OTHER
  reworkReasonDesc        String?                 @db.Text
  issueDescription        String?                 @db.Text // Deskripsi masalah
  // Assignment
  mechanic_id             String?                 @db.Char(10)
  serviceBay_id           String?                 @db.Char(10)
  // Schedule
  scheduledDate           DateTime?
  actualStartDate         DateTime?
  actualEndDate           DateTime?
  // Rework Type
  isWarrantyWork          Boolean?                @default(true) // Garansi atau bayar
  isFreeService           Boolean?                @default(true) // Gratis atau tidak
  chargeToCustomer        Boolean?                @default(false) // Dikenakan biaya atau tidak
  // Cost (jika ada biaya tambahan)
  additionalCost          Decimal?                @default(0) @db.Decimal(21, 4)
  // Quality Check
  qcCheckedBy             String?                 @db.Char(10)
  qcCheckedDate           DateTime?
  qcApproved              Boolean?                @default(false)
  // Customer Satisfaction
  customerRating          Int?                    @db.SmallInt
  customerFeedback        String?                 @db.Text
  isSatisfied             Boolean?
  // Status
  reworkStatus            ReworkStatusEnum        @default(SCHEDULED)
  // Notes
  notes                   String?                 @db.Text
  internalNotes           String?                 @db.Text
  // Metadata
  iStatus                 MasterRecordStatusEnum  @default(Active)
  remarks                 String?                 @db.VarChar(250)
  createdBy               String?                 @db.Char(10)
  createdAt               DateTime                @default(now())
  updatedBy               String?                 @db.Char(10)
  updatedAt               DateTime
  company_id              String                  @db.Char(5)
  branch_id               String                  @db.Char(10)
  // Relations
  originalServiceOrder    wks_ServiceOrder        @relation(fields: [company_id, originalServiceOrder_id], references: [company_id, id], onUpdate: NoAction)
  complaint               wks_CustomerComplaint?  @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)
  customer                cmf_Customer            @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                 cmf_CustomerVehicle     @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic                cmf_Mechanic?           @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  serviceBay              wks_ServiceBay?         @relation(fields: [company_id, serviceBay_id], references: [company_id, id], onUpdate: NoAction)
  reworkItems             wks_ServiceReworkItem[]
  creditNotes             arm_CreditNote[]

  @@id([company_id, id], map: "pk_wks_ServiceRework")
  @@unique([company_id, reworkNumber], map: "unique_rework_number")
  @@index([company_id, originalServiceOrder_id], map: "idx_rework_service")
  @@index([company_id, customer_id], map: "idx_rework_customer")
}

// Service Rework Items (Pekerjaan ulang & Parts)
model wks_ServiceReworkItem {
  id                 String                 @db.Char(30) // Manual: SRWI/2025/10/00001
  serviceRework_id   String                 @db.Char(30)
  lineNumber         Int                    @db.SmallInt
  itemType           DetailTypeEnum // SERVICE atau PART
  // Original Item (yang bermasalah)
  originalItem_id    String?                @db.Char(30) // Original ServiceOrderDetail ID
  // Service Info
  serviceType_id     String?                @db.Char(10)
  serviceName        String?                @db.VarChar(100)
  serviceDescription String?                @db.Text
  // Part Info
  product_id         String?                @db.Char(20)
  productVariant_id  String?                @db.Char(30)
  partName           String?                @db.VarChar(250)
  // Action
  reworkAction       ReworkActionEnum? // REDO, REPLACE, ADJUST, REFUND
  actionDescription  String?                @db.Text
  // Quantity (untuk parts)
  quantity           Decimal?               @default(0) @db.Decimal(12, 4)
  // Cost
  originalCost       Decimal?               @default(0) @db.Decimal(21, 4)
  additionalCost     Decimal?               @default(0) @db.Decimal(21, 4)
  // Status
  itemStatus         DetailStatusEnum?      @default(PENDING)
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  serviceRework      wks_ServiceRework      @relation(fields: [company_id, serviceRework_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceReworkItem")
  @@index([company_id, serviceRework_id], map: "idx_rework_item")
}

// Credit Note (Nota Kredit - Refund/Discount untuk Customer)
model arm_CreditNote {
  id                    String                 @db.Char(30) // Manual: CN/2025/10/00001
  creditNoteNumber      String                 @db.VarChar(30)
  creditNoteDate        DateTime               @default(now())
  transaction_type      String                 @db.Char(5) // "CN"
  transaction_class     String                 @db.Char(10) // "SALES"
  // Source Document
  source_module         String?                @db.VarChar(20) // "SERVICE"
  invoice_id            String?                @db.Char(30) // Invoice yang di-credit
  invoiceNumber         String?                @db.VarChar(30)
  serviceOrder_id       String?                @db.Char(20) // Service order terkait
  complaint_id          String?                @db.Char(30) // Complaint terkait
  serviceRework_id      String?                @db.Char(30) // Rework terkait
  // Customer Info
  customer_id           String                 @db.Char(20)
  customerName          String                 @db.VarChar(100)
  customerVehicle_id    String?                @db.Char(20)
  vehicle_customer_id   String?                @db.Char(20)
  vehicleInfo           String?                @db.VarChar(250)
  // Credit Reason
  creditReason          CreditReasonEnum? // SERVICE_ISSUE, OVERCHARGE, GOODWILL, RETURN, OTHER
  creditReasonDesc      String?                @db.Text
  // Amount
  originalAmount        Decimal?               @db.Decimal(21, 4)
  creditAmount          Decimal                @db.Decimal(21, 4) // Jumlah kredit
  taxAmount             Decimal?               @default(0) @db.Decimal(21, 4)
  totalCreditAmount     Decimal                @db.Decimal(21, 4)
  // Refund Method
  refundMethod          RefundMethodEnum? // CASH, BANK_TRANSFER, CREDIT_TO_ACCOUNT, VOUCHER
  refundBankAccount_id  String?                @db.Char(10)
  refundReferenceNumber String?                @db.VarChar(50)
  refundDate            DateTime?
  // Approval
  approvedBy            String?                @db.Char(10)
  approvedDate          DateTime?
  approvalNotes         String?                @db.Text
  // Status
  creditNoteStatus      CreditNoteStatusEnum   @default(DRAFT)
  isPosted              Boolean?               @default(false)
  postedDate            DateTime?
  isRefunded            Boolean?               @default(false)
  // Notes
  notes                 String?                @db.Text
  internalNotes         String?                @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum @default(Active)
  remarks               String?                @db.VarChar(250)
  createdBy             String?                @db.Char(10)
  createdAt             DateTime               @default(now())
  updatedBy             String?                @db.Char(10)
  updatedAt             DateTime
  company_id            String                 @db.Char(5)
  branch_id             String                 @db.Char(10)
  // Relations
  invoice               arm_Invoice?           @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  serviceOrder          wks_ServiceOrder?      @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  complaint             wks_CustomerComplaint? @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)
  serviceRework         wks_ServiceRework?     @relation(fields: [company_id, serviceRework_id], references: [company_id, id], onUpdate: NoAction)
  customer              cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle               cmf_CustomerVehicle?   @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  bankAccount           acc_BankAccount?       @relation(fields: [company_id, refundBankAccount_id], references: [company_id, id], onUpdate: NoAction)
  creditNoteDetails     arm_CreditNoteDetail[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_CreditNote")
  @@unique([company_id, creditNoteNumber], map: "unique_credit_note_number")
  @@index([company_id, customer_id], map: "idx_credit_note_customer")
  @@index([company_id, invoice_id], map: "idx_credit_note_invoice")
}

// Credit Note Detail
model arm_CreditNoteDetail {
  id                String                 @db.Char(30) // Manual: CND/2025/10/00001
  creditNote_id     String                 @db.Char(30)
  lineNumber        Int                    @db.SmallInt
  itemType          InvoiceItemTypeEnum // SERVICE, PART, OTHER
  // Item Info
  item_id           String?                @db.Char(30)
  itemCode          String?                @db.VarChar(50)
  itemName          String                 @db.VarChar(250)
  description       String?                @db.Text
  // Original Amount
  originalQuantity  Decimal?               @db.Decimal(12, 4)
  originalUnitPrice Decimal?               @db.Decimal(21, 4)
  originalAmount    Decimal?               @db.Decimal(21, 4)
  // Credit Amount
  creditQuantity    Decimal?               @db.Decimal(12, 4)
  creditUnitPrice   Decimal?               @db.Decimal(21, 4)
  creditAmount      Decimal                @db.Decimal(21, 4)
  taxAmount         Decimal?               @default(0) @db.Decimal(21, 4)
  totalCredit       Decimal                @db.Decimal(21, 4)
  // Reason
  creditReason      String?                @db.VarChar(250)
  // Status
  iStatus           MasterRecordStatusEnum @default(Active)
  remarks           String?                @db.VarChar(250)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  // Relations
  creditNote        arm_CreditNote         @relation(fields: [company_id, creditNote_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_CreditNoteDetail")
  @@index([company_id, creditNote_id], map: "idx_credit_note_detail")
}

/// ============================================================================
/// PROCUREMENT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage supplier, purchase order, dan penerimaan barang
/// Flow: PO → PurchaseReceive → A/P Invoice → Payment → GL
/// Support: Multi-warehouse, quality inspection, partial receive, purchase return

// Master Supplier
model prc_Supplier {
  id               String                 @db.Char(20)
  supplierCode     String?                @db.Char(20)
  supplierType     SupplierTypeEnum       @default(VENDOR) // VENDOR, DISTRIBUTOR, MANUFACTURER
  // Data Supplier
  name             String                 @db.VarChar(150)
  legalName        String?                @db.VarChar(150) // Nama legal perusahaan
  nickname         String?                @db.VarChar(50)
  // Contact Person
  contactPerson    String?                @db.VarChar(100)
  contactPosition  String?                @db.VarChar(50)
  phone1           String?                @db.VarChar(20)
  phone2           String?                @db.VarChar(20)
  mobile1          String?                @db.VarChar(20)
  mobile2          String?                @db.VarChar(20)
  email            String?                @db.VarChar(100)
  website          String?                @db.VarChar(100)
  // Alamat
  province         String?                @db.VarChar(50)
  district         String?                @db.VarChar(50)
  city             String?                @db.VarChar(50)
  subDistrict      String?                @db.VarChar(50)
  address1         String?                @db.VarChar(250)
  address2         String?                @db.VarChar(250)
  postalCode       String?                @db.Char(6)
  // Tax & Legal
  taxNumber        String?                @db.VarChar(30) // NPWP
  taxName          String?                @db.VarChar(150) // Nama di NPWP
  taxAddress       String?                @db.VarChar(250) // Alamat di NPWP
  // Banking
  bankName         String?                @db.VarChar(50)
  bankBranch       String?                @db.VarChar(50)
  accountNumber    String?                @db.VarChar(30)
  accountName      String?                @db.VarChar(100)
  // Payment Terms
  paymentTermDays  Int?                   @default(30) @db.SmallInt // Termin pembayaran (hari)
  creditLimit      Decimal?               @db.Decimal(21, 4)
  currentDebt      Decimal?               @default(0) @db.Decimal(21, 4)
  // Performance & Rating
  supplierRating   Decimal?               @db.Decimal(3, 2) // Rating 0.00 - 5.00
  totalPurchase    Decimal?               @default(0) @db.Decimal(21, 4)
  totalTransaction Int?                   @default(0)
  lastPurchaseDate DateTime?
  // Status & Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  isPreferred      Boolean?               @default(false) // Supplier preferensi
  isBlacklisted    Boolean?               @default(false)
  blacklistReason  String?                @db.VarChar(250)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  purchaseOrders   prc_PurchaseOrder[]
  purchaseReceives prc_PurchaseReceive[]
  apInvoices       apm_Invoice[]
  apPayments       apm_Payment[]
  purchaseReturns  prc_PurchaseReturn[]

  @@id([company_id, id], map: "pk_prc_Supplier")
  @@unique([company_id, supplierCode], map: "unique_supplier_code")
  @@index([company_id, name], map: "idx_supplier_name")
  @@index([company_id, supplierType], map: "idx_supplier_type")
}

// Purchase Order Header
model prc_PurchaseOrder {
  id                    String                    @db.Char(20)
  poNumber              String                    @db.VarChar(30) // PO-2024-12-0001
  poDate                DateTime                  @default(now())
  supplier_id           String                    @db.Char(20)
  // Reference
  requisitionNumber     String?                   @db.VarChar(30) // Nomor permintaan barang
  quotationNumber       String?                   @db.VarChar(30) // Nomor quotation dari supplier
  // Delivery Info
  requestedDeliveryDate DateTime?                 @db.Date
  expectedDeliveryDate  DateTime?                 @db.Date
  warehouse_id          String?                   @db.Char(4)
  deliveryAddress       String?                   @db.VarChar(250)
  // Contact Person
  buyerName             String?                   @db.VarChar(100) // Nama pembeli/buyer
  supplierContactPerson String?                   @db.VarChar(100)
  supplierPhone         String?                   @db.VarChar(20)
  // Payment Terms
  paymentTermDays       Int?                      @db.SmallInt // NET 30, NET 60, dll
  paymentMethod         String?                   @db.VarChar(30) // Transfer, Cash, Giro
  downPaymentPercent    Decimal?                  @default(0) @db.Decimal(5, 2)
  downPaymentAmount     Decimal?                  @default(0) @db.Decimal(21, 4)
  // Amounts
  subtotalAmount        Decimal?                  @default(0) @db.Decimal(21, 4)
  discountPercent       Decimal?                  @default(0) @db.Decimal(5, 2)
  discountAmount        Decimal?                  @default(0) @db.Decimal(21, 4)
  taxPercent            Decimal?                  @default(0) @db.Decimal(5, 2) // PPN 11%
  taxAmount             Decimal?                  @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?                  @default(0) @db.Decimal(21, 4)
  otherCost             Decimal?                  @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal?                  @default(0) @db.Decimal(21, 4)
  // Status Tracking
  poStatus              PurchaseOrderStatusEnum   @default(DRAFT)
  approvalStatus        ApprovalStatusEnum?       @default(PENDING)
  receiveStatus         ReceiveStatusEnum?        @default(NOT_RECEIVED)
  paymentStatus         PaymentStatusEnum?        @default(UNPAID)
  // Approval
  approvedBy            String?                   @db.Char(10)
  approvedDate          DateTime?
  approvalNotes         String?                   @db.Text
  // Cancel Info
  cancelledBy           String?                   @db.Char(10)
  cancelledDate         DateTime?
  cancelReason          String?                   @db.VarChar(250)
  // Notes
  notes                 String?                   @db.Text
  internalNotes         String?                   @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum    @default(Active)
  remarks               String?                   @db.VarChar(250)
  createdBy             String?                   @db.Char(10)
  createdAt             DateTime                  @default(now())
  updatedBy             String?                   @db.Char(10)
  updatedAt             DateTime
  company_id            String                    @db.Char(5)
  branch_id             String                    @db.Char(10)
  // Relations
  supplier              prc_Supplier              @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse             imc_Warehouse?            @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  orderDetails          prc_PurchaseOrderDetail[]
  purchaseReceives      prc_PurchaseReceive[]
  apInvoices            apm_Invoice[]
  purchaseReturns       prc_PurchaseReturn[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_prc_PurchaseOrder")
  @@unique([company_id, poNumber], map: "unique_po_number")
  @@index([company_id, supplier_id], map: "idx_po_supplier")
  @@index([company_id, poDate], map: "idx_po_date")
  @@index([company_id, poStatus], map: "idx_po_status")
}

// Purchase Order Detail
model prc_PurchaseOrderDetail {
  id                  String                      @db.Char(30) // Manual: POD/2025/10/00001
  purchaseOrder_id    String                      @db.Char(20)
  lineNumber          Int                         @db.SmallInt // Nomor urut baris
  // Product Info
  product_id          String                      @db.Char(20)
  productVariant_id   String?                     @db.Char(30)
  productName         String                      @db.VarChar(250)
  productCode         String?                     @db.VarChar(50)
  productDescription  String?                     @db.Text
  // Supplier Product Info
  supplierPartNumber  String?                     @db.VarChar(50) // Part number dari supplier
  supplierProductName String?                     @db.VarChar(250)
  // Quantity & UOM
  orderedQty          Decimal                     @db.Decimal(12, 4)
  receivedQty         Decimal?                    @default(0) @db.Decimal(12, 4)
  outstandingQty      Decimal?                    @db.Decimal(12, 4) // Sisa yang belum diterima
  uom                 String                      @db.VarChar(10) // PCS, BOX, KG, dll
  // Pricing
  unitPrice           Decimal                     @db.Decimal(21, 4)
  discountPercent     Decimal?                    @default(0) @db.Decimal(5, 2)
  discountAmount      Decimal?                    @default(0) @db.Decimal(21, 4)
  taxPercent          Decimal?                    @default(0) @db.Decimal(5, 2)
  taxAmount           Decimal?                    @default(0) @db.Decimal(21, 4)
  subtotal            Decimal                     @db.Decimal(21, 4)
  // Delivery
  requestedDate       DateTime?                   @db.Date
  expectedDate        DateTime?                   @db.Date
  // Status
  lineStatus          PODetailStatusEnum?         @default(OPEN) // OPEN, PARTIAL, FULLY_RECEIVED, CANCELLED
  iStatus             MasterRecordStatusEnum      @default(Active)
  remarks             String?                     @db.VarChar(250)
  createdBy           String?                     @db.Char(10)
  createdAt           DateTime                    @default(now())
  updatedBy           String?                     @db.Char(10)
  updatedAt           DateTime
  company_id          String                      @db.Char(5)
  branch_id           String                      @db.Char(10)
  // Relations
  purchaseOrder       prc_PurchaseOrder           @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  product             imc_Product                 @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  receiveDetails      prc_PurchaseReceiveDetail[]

  @@id([company_id, id], map: "pk_prc_PurchaseOrderDetail")
  @@index([company_id, purchaseOrder_id], map: "idx_po_detail")
}

// Purchase Receive Header (GRN - Goods Receipt Note)
model prc_PurchaseReceive {
  id                    String                      @db.Char(20)
  receiveNumber         String                      @db.VarChar(30) // GRN-2024-12-0001
  receiveDate           DateTime                    @default(now())
  purchaseOrder_id      String                      @db.Char(20)
  supplier_id           String                      @db.Char(20)
  // Reference
  supplierInvoiceNumber String?                     @db.VarChar(30) // Nomor invoice/surat jalan supplier
  supplierInvoiceDate   DateTime?                   @db.Date
  deliveryNoteNumber    String?                     @db.VarChar(30) // Nomor surat jalan
  // Delivery Info
  warehouse_id          String?                     @db.Char(4)
  receivedBy            String?                     @db.Char(10) // User yang terima barang
  vehicleNumber         String?                     @db.VarChar(15) // Plat kendaraan pengiriman
  driverName            String?                     @db.VarChar(100)
  driverPhone           String?                     @db.VarChar(20)
  // Inspection
  inspectedBy           String?                     @db.Char(10) // User yang inspeksi
  inspectionDate        DateTime?
  inspectionNotes       String?                     @db.Text
  qualityStatus         QualityStatusEnum?          @default(PENDING) // PENDING, APPROVED, REJECTED, PARTIAL
  // Amounts
  subtotalAmount        Decimal?                    @default(0) @db.Decimal(21, 4)
  discountAmount        Decimal?                    @default(0) @db.Decimal(21, 4)
  taxAmount             Decimal?                    @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?                    @default(0) @db.Decimal(21, 4)
  otherCost             Decimal?                    @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal?                    @default(0) @db.Decimal(21, 4)
  // Status
  receiveStatus         ReceiveStatusEnum           @default(DRAFT)
  postingStatus         PostingStatusEnum?          @default(NOT_POSTED) // NOT_POSTED, POSTED
  postedBy              String?                     @db.Char(10)
  postedDate            DateTime?
  // Return Info
  hasReturn             Boolean?                    @default(false)
  returnReason          String?                     @db.VarChar(250)
  // Notes
  notes                 String?                     @db.Text
  internalNotes         String?                     @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum      @default(Active)
  remarks               String?                     @db.VarChar(250)
  createdBy             String?                     @db.Char(10)
  createdAt             DateTime                    @default(now())
  updatedBy             String?                     @db.Char(10)
  updatedAt             DateTime
  company_id            String                      @db.Char(5)
  branch_id             String                      @db.Char(10)
  // Relations
  purchaseOrder         prc_PurchaseOrder           @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  supplier              prc_Supplier                @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse             imc_Warehouse?              @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  receiveDetails        prc_PurchaseReceiveDetail[]
  apInvoices            apm_Invoice[]
  purchaseReturns       prc_PurchaseReturn[]

  @@id([company_id, id], map: "pk_prc_PurchaseReceive")
  @@unique([company_id, receiveNumber], map: "unique_receive_number")
  @@index([company_id, purchaseOrder_id], map: "idx_receive_po")
  @@index([company_id, supplier_id], map: "idx_receive_supplier")
  @@index([company_id, receiveDate], map: "idx_receive_date")
}

// Purchase Receive Detail
model prc_PurchaseReceiveDetail {
  id                     String                   @db.Char(30) // Manual: RCD/2025/10/00001
  purchaseReceive_id     String                   @db.Char(20)
  purchaseOrderDetail_id String                   @db.Char(30)
  lineNumber             Int                      @db.SmallInt
  // Product Info
  product_id             String                   @db.Char(20)
  productVariant_id      String?                  @db.Char(30)
  productName            String                   @db.VarChar(250)
  productCode            String?                  @db.VarChar(50)
  // Quantity
  orderedQty             Decimal                  @db.Decimal(12, 4) // Qty di PO
  receivedQty            Decimal                  @db.Decimal(12, 4) // Qty yang diterima
  acceptedQty            Decimal?                 @db.Decimal(12, 4) // Qty yang diterima (lolos QC)
  rejectedQty            Decimal?                 @default(0) @db.Decimal(12, 4) // Qty yang ditolak
  damagedQty             Decimal?                 @default(0) @db.Decimal(12, 4) // Qty yang rusak
  uom                    String                   @db.VarChar(10)
  // Storage Location
  warehouse_id           String?                  @db.Char(4)
  floor_id               String?                  @db.Char(5)
  shelf_id               String?                  @db.Char(15)
  row_id                 String?                  @db.Char(15)
  // Batch & Expiry
  batchNumber            String?                  @db.VarChar(30)
  manufactureDate        DateTime?                @db.Date
  expiryDate             DateTime?                @db.Date
  // Pricing
  unitPrice              Decimal                  @db.Decimal(21, 4)
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  subtotal               Decimal                  @db.Decimal(21, 4)
  // Quality Check
  qualityStatus          QualityStatusEnum?       @default(PENDING)
  rejectionReason        String?                  @db.VarChar(250)
  qualityNotes           String?                  @db.Text
  // Status
  lineStatus             ReceiveDetailStatusEnum? @default(RECEIVED)
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  purchaseReceive        prc_PurchaseReceive      @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrderDetail    prc_PurchaseOrderDetail  @relation(fields: [company_id, purchaseOrderDetail_id], references: [company_id, id], onUpdate: NoAction)
  product                imc_Product              @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_prc_PurchaseReceiveDetail")
  @@index([company_id, purchaseReceive_id], map: "idx_receive_detail")
}

/// ============================================================================
/// INVENTORY MOVEMENT MODULE
/// ============================================================================
/// Module untuk internal inventory movement (transfer, adjustment, allocation)
/// Flow: Request → Approval → Execution → Posting
/// Support: Inter-warehouse transfer, stock adjustment, return, scrap, allocation

// Inventory Internal Movement Header
model inv_InternalMovement {
  id                 String                       @db.Char(30) // Manual: INV-IN/2025/10/00001 atau INV-OUT/2025/10/00001
  movementNumber     String                       @db.VarChar(30)
  movementDate       DateTime                     @default(now())
  movementType       InternalMovementTypeEnum // TRANSFER, ADJUSTMENT, RETURN, SCRAP, ASSEMBLY, DISASSEMBLY
  transactionType    TransactionTypeEnum // IN atau OUT
  // Source & Destination
  sourceWarehouse_id String?                      @db.Char(4) // Dari warehouse mana
  destWarehouse_id   String?                      @db.Char(4) // Ke warehouse mana
  sourceLocation     String?                      @db.VarChar(100) // Floor/Shelf/Row asal
  destLocation       String?                      @db.VarChar(100) // Floor/Shelf/Row tujuan
  // Reference
  referenceNumber    String?                      @db.VarChar(30) // Nomor referensi (PO, SO, dll)
  referenceType      String?                      @db.VarChar(20) // PO, SO, SERVICE, RETURN, dll
  // Request Info
  requestedBy        String?                      @db.Char(10) // User yang request
  requestDate        DateTime?
  approvedBy         String?                      @db.Char(10) // User yang approve
  approvedDate       DateTime?
  // Execution Info
  executedBy         String?                      @db.Char(10) // User yang eksekusi movement
  executedDate       DateTime?
  vehicleNumber      String?                      @db.VarChar(15) // Plat kendaraan (jika transfer antar gudang)
  driverName         String?                      @db.VarChar(100)
  // Status
  movementStatus     MovementStatusEnum           @default(DRAFT) // DRAFT, APPROVED, IN_TRANSIT, COMPLETED, CANCELLED
  postingStatus      PostingStatusEnum?           @default(NOT_POSTED)
  postedBy           String?                      @db.Char(10)
  postedDate         DateTime?
  // Notes
  reason             String?                      @db.Text // Alasan movement
  notes              String?                      @db.Text
  internalNotes      String?                      @db.Text
  // Metadata
  iStatus            MasterRecordStatusEnum       @default(Active)
  remarks            String?                      @db.VarChar(250)
  createdBy          String?                      @db.Char(10)
  createdAt          DateTime                     @default(now())
  updatedBy          String?                      @db.Char(10)
  updatedAt          DateTime
  company_id         String                       @db.Char(5)
  branch_id          String                       @db.Char(10)
  // Relations
  sourceWarehouse    imc_Warehouse?               @relation("SourceWarehouse", fields: [sourceWarehouse_id], references: [id], onUpdate: NoAction)
  destWarehouse      imc_Warehouse?               @relation("DestWarehouse", fields: [destWarehouse_id], references: [id], onUpdate: NoAction)
  movementDetails    inv_InternalMovementDetail[]

  @@id([company_id, id], map: "pk_inv_InternalMovement")
  @@unique([company_id, movementNumber], map: "unique_movement_number")
  @@index([company_id, movementDate], map: "idx_movement_date")
  @@index([company_id, movementType], map: "idx_movement_type")
  @@index([company_id, movementStatus], map: "idx_movement_status")
}

// Inventory Internal Movement Detail
model inv_InternalMovementDetail {
  id                  String                    @db.Char(30) // Manual: IMD/2025/10/00001
  internalMovement_id String                    @db.Char(30)
  lineNumber          Int                       @db.SmallInt
  // Product Info
  product_id          String                    @db.Char(20)
  productVariant_id   String?                   @db.Char(30)
  productName         String                    @db.VarChar(250)
  productCode         String?                   @db.VarChar(50)
  // Quantity
  requestedQty        Decimal                   @db.Decimal(12, 4) // Qty yang diminta
  movedQty            Decimal                   @db.Decimal(12, 4) // Qty yang actual dipindahkan
  receivedQty         Decimal?                  @default(0) @db.Decimal(12, 4) // Qty yang diterima (untuk transfer)
  uom                 String                    @db.VarChar(10)
  // Source Location Detail
  sourceWarehouse_id  String?                   @db.Char(4)
  sourceFloor_id      String?                   @db.Char(5)
  sourceShelf_id      String?                   @db.Char(15)
  sourceRow_id        String?                   @db.Char(15)
  // Destination Location Detail
  destWarehouse_id    String?                   @db.Char(4)
  destFloor_id        String?                   @db.Char(5)
  destShelf_id        String?                   @db.Char(15)
  destRow_id          String?                   @db.Char(15)
  // Batch & Tracking
  batchNumber         String?                   @db.VarChar(30)
  serialNumber        String?                   @db.VarChar(50)
  expiryDate          DateTime?                 @db.Date
  // Cost (untuk adjustment)
  unitCost            Decimal?                  @db.Decimal(21, 4)
  totalCost           Decimal?                  @db.Decimal(21, 4)
  adjustmentValue     Decimal?                  @db.Decimal(21, 4) // Nilai adjustment (+ atau -)
  // Status
  lineStatus          MovementDetailStatusEnum? @default(PENDING)
  iStatus             MasterRecordStatusEnum    @default(Active)
  remarks             String?                   @db.VarChar(250)
  createdBy           String?                   @db.Char(10)
  createdAt           DateTime                  @default(now())
  updatedBy           String?                   @db.Char(10)
  updatedAt           DateTime
  company_id          String                    @db.Char(5)
  branch_id           String                    @db.Char(10)
  // Relations
  internalMovement    inv_InternalMovement      @relation(fields: [company_id, internalMovement_id], references: [company_id, id], onUpdate: NoAction)
  product             imc_Product               @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_inv_InternalMovementDetail")
  @@index([company_id, internalMovement_id], map: "idx_movement_detail")
}

/// ============================================================================
/// ACCOUNTING CORE MODULE
/// ============================================================================
/// Module untuk Chart of Account, Bank Account, Tax, Payment Method
/// Foundation untuk semua transaksi keuangan

// Master Transaction Type (Tipe Transaksi)
model cmf_TransactionType {
  id              String                 @db.Char(5) // SO, PO, INV, CR, CP, JV, dll
  name            String                 @db.VarChar(50) // Service Order, Purchase Order, dll
  category        String?                @db.VarChar(20) // SALES, PURCHASE, CASH, BANK, JOURNAL
  module          String?                @db.VarChar(20) // SERVICE, PROCUREMENT, ACCOUNTING
  affectGL        Boolean                @default(true) // Apakah affect GL
  requireApproval Boolean                @default(false)
  seq             Int?                   @default(0)
  iStatus         MasterRecordStatusEnum @default(Active)
  remarks         String?                @db.VarChar(250)
  createdBy       String?                @db.Char(10)
  createdAt       DateTime               @default(now())
  updatedBy       String?                @db.Char(10)
  updatedAt       DateTime

  @@id([id], map: "pk_cmf_TransactionType")
}

// Master Transaction Class (Kelas Transaksi)
model cmf_TransactionClass {
  id        String                 @db.Char(10) // SALES, PURCHASE, CASH, BANK, INVENTORY, JOURNAL
  name      String                 @db.VarChar(50)
  seq       Int?                   @default(0)
  iStatus   MasterRecordStatusEnum @default(Active)
  remarks   String?                @db.VarChar(250)
  createdBy String?                @db.Char(10)
  createdAt DateTime               @default(now())
  updatedBy String?                @db.Char(10)
  updatedAt DateTime

  @@id([id], map: "pk_cmf_TransactionClass")
}

// Master Payment Method (Metode Pembayaran)
model cmf_PaymentMethod {
  id                 String                 @db.Char(10) // CASH, TRANSFER, QRIS, DEBIT, CREDIT, dll
  name               String                 @db.VarChar(50) // Tunai, Transfer Bank, QRIS, dll
  methodType         PaymentMethodTypeEnum? // CASH, BANK, CARD, EWALLET, QRIS
  requireBankAccount Boolean                @default(false) // Perlu bank account
  requireReference   Boolean                @default(false) // Perlu nomor referensi
  processingFee      Decimal?               @db.Decimal(5, 2) // Fee dalam persen
  fixedFee           Decimal?               @db.Decimal(21, 4) // Fee tetap
  seq                Int?                   @default(0)
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  payments           arm_Payment[]
  paymentDetails     arm_PaymentDetail[]
  apPayments         apm_Payment[]
  apPaymentDetails   apm_PaymentDetail[]

  @@id([id], map: "pk_cmf_PaymentMethod")
}

// Chart of Account (COA)
model acc_COA {
  id                 String                 @db.Char(15) // 1-1000, 2-1000, dll (flexible)
  accountCode        String                 @db.VarChar(20) // Kode akun alternatif
  accountName        String                 @db.VarChar(150)
  accountName_en     String?                @db.VarChar(150)
  accountType        COATypeEnum // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  accountGroup       String?                @db.VarChar(50) // Current Asset, Fixed Asset, dll
  normalBalance      BalanceTypeEnum // DEBIT, CREDIT
  parent_id          String?                @db.Char(15) // Parent account (untuk hierarchy)
  level              Int                    @db.SmallInt // Level hierarchy (1, 2, 3, dll)
  isHeader           Boolean                @default(false) // Header account atau detail
  isActive           Boolean                @default(true)
  isCash             Boolean                @default(false) // Akun kas
  isBank             Boolean                @default(false) // Akun bank
  isAP               Boolean                @default(false) // Account Payable
  isAR               Boolean                @default(false) // Account Receivable
  isInventory        Boolean                @default(false) // Inventory
  // Opening Balance
  openingBalance     Decimal?               @default(0) @db.Decimal(21, 4)
  openingBalanceDate DateTime?              @db.Date
  // Current Balance
  currentDebit       Decimal?               @default(0) @db.Decimal(21, 4)
  currentCredit      Decimal?               @default(0) @db.Decimal(21, 4)
  currentBalance     Decimal?               @default(0) @db.Decimal(21, 4)
  // Status & Metadata
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  parent             acc_COA?               @relation("COAHierarchy", fields: [company_id, parent_id], references: [company_id, id], onUpdate: NoAction)
  children           acc_COA[]              @relation("COAHierarchy")
  bankAccounts       acc_BankAccount[]
  glTransDetails     acc_GLTransDetail[]
  taxSchemes         cmf_TaxScheme[]
  taxSchemeDetails   cmf_TaxSchemeDetail[]

  @@id([company_id, id], map: "pk_acc_COA")
  @@unique([company_id, accountCode], map: "unique_account_code")
  @@index([company_id, accountType], map: "idx_coa_type")
  @@index([company_id, parent_id], map: "idx_coa_parent")
}

// Bank Account (Rekening Bank)
model acc_BankAccount {
  id             String                 @db.Char(10)
  coa_id         String                 @db.Char(15) // Link ke COA
  bankName       String                 @db.VarChar(100) // BCA, Mandiri, BNI, dll
  branchName     String?                @db.VarChar(100)
  accountNumber  String                 @db.VarChar(30)
  accountName    String                 @db.VarChar(100)
  currency       String                 @default("IDR") @db.Char(3)
  swiftCode      String?                @db.VarChar(20)
  // Balance
  openingBalance Decimal?               @default(0) @db.Decimal(21, 4)
  currentBalance Decimal?               @default(0) @db.Decimal(21, 4)
  // Status
  isDefault      Boolean?               @default(false) // Bank account default
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  // Relations
  coa            acc_COA                @relation(fields: [company_id, coa_id], references: [company_id, id], onUpdate: NoAction)
  payments       arm_Payment[]
  apPayments     apm_Payment[]
  creditNotes    arm_CreditNote[]

  @@id([company_id, id], map: "pk_acc_BankAccount")
  @@unique([company_id, accountNumber], map: "unique_bank_account")
}

// Tax Scheme Configuration (Konfigurasi Pajak)
model cmf_TaxScheme {
  id            String                 @db.Char(5) // T1, T2, T3, V1, V2, V3
  schemeCode    String                 @db.VarChar(10) // T1, V1, dll
  name          String                 @db.VarChar(100) // PPN 11%, PPN 12%, PPh 23, dll
  taxType       TaxTypeEnum // SALES (output), PURCHASE (input)
  category      String?                @db.VarChar(50) // VAT, WHT, SALES_TAX, LUXURY_TAX
  // Tax Calculation
  isInclusive   Boolean                @default(false) // Tax included in price atau tidak
  defaultRate   Decimal                @db.Decimal(5, 2) // Rate default (misal: 11.00)
  isCompound    Boolean                @default(false) // Pajak bertingkat
  // COA Mapping
  taxAccount_id String?                @db.Char(15) // Link ke COA untuk tax payable/receivable
  // Applicability
  isDefault     Boolean?               @default(false) // Tax scheme default
  effectiveFrom DateTime?              @db.Date // Berlaku mulai tanggal
  effectiveTo   DateTime?              @db.Date // Berlaku sampai tanggal
  // Status & Metadata
  iStatus       MasterRecordStatusEnum @default(Active)
  remarks       String?                @db.VarChar(250)
  seq           Int?                   @default(0)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  // Relations
  taxAccount    acc_COA?               @relation(fields: [company_id, taxAccount_id], references: [company_id, id], onUpdate: NoAction)
  taxDetails    cmf_TaxSchemeDetail[]
  arInvoices    arm_Invoice[]
  apInvoices    apm_Invoice[]

  @@id([company_id, id], map: "pk_cmf_TaxScheme")
  @@unique([company_id, schemeCode], map: "unique_tax_scheme_code")
  @@index([company_id, taxType], map: "idx_tax_scheme_type")
}

// Tax Scheme Detail (Detail komponenRpajak - untuk pajak bertingkat atau multi-component)
model cmf_TaxSchemeDetail {
  id               String                 @db.Char(10)
  taxScheme_id     String                 @db.Char(5)
  lineNumber       Int                    @db.SmallInt
  componentName    String                 @db.VarChar(100) // PPN, PPh 22, PPh 23, Luxury Tax, dll
  componentName_en String?                @db.VarChar(100)
  taxRate          Decimal                @db.Decimal(5, 2) // Rate pajak (%)
  taxAccount_id    String                 @db.Char(15) // COA untuk komponen ini
  calculationBase  String?                @db.VarChar(20) // SUBTOTAL, GROSS, NETT
  isAdditive       Boolean                @default(true) // Ditambahkan atau dikurangi
  // Calculation Order
  seq              Int                    @db.SmallInt // Urutan kalkulasi
  // Status
  iStatus          MasterRecordStatusEnum @default(Active)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  taxScheme        cmf_TaxScheme          @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  taxAccount       acc_COA                @relation(fields: [company_id, taxAccount_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, taxScheme_id, id], map: "pk_cmf_TaxSchemeDetail")
  @@index([company_id, taxScheme_id], map: "idx_tax_detail")
}

/// ============================================================================
/// ACCOUNT RECEIVABLE MANAGEMENT (ARM) MODULE
/// ============================================================================
/// Module untuk manage piutang, invoice penjualan, dan penerimaan pembayaran
/// Flow: ServiceOrder → Invoice → Payment → CashReceipt → GL
/// Support: Credit terms, partial payment, credit note/refund

// A/R Invoice (dari Service Order atau Sales) - Account Receivable Management
model arm_Invoice {
  id                     String                   @db.Char(30) // Manual: INV/2025/10/00001
  invoiceNumber          String                   @db.VarChar(30)
  invoiceDate            DateTime                 @default(now())
  dueDate                DateTime?                @db.Date
  transaction_type       String                   @db.Char(5) // "INV"
  transaction_class      String                   @db.Char(10) // "SALES"
  // Tax Configuration
  taxScheme_id           String?                  @db.Char(5) // T1, T2, T3
  // Source Document
  source_module          String?                  @db.VarChar(20) // "SERVICE", "SALES"
  source_document_id     String?                  @db.Char(30) // Service Order ID
  source_document_number String?                  @db.VarChar(30) // SO-2025-10-00001
  // Customer Info
  customer_id            String                   @db.Char(20)
  customerName           String                   @db.VarChar(100)
  customerAddress        String?                  @db.Text
  customerPhone          String?                  @db.VarChar(20)
  customerEmail          String?                  @db.VarChar(100)
  // Vehicle Info (untuk service)
  customerVehicle_id     String?                  @db.Char(20)
  vehicle_customer_id    String?                  @db.Char(20)
  vehicleInfo            String?                  @db.VarChar(250) // Toyota Avanza B 1234 XYZ
  // Amount
  subtotalAmount         Decimal                  @default(0) @db.Decimal(21, 4)
  discountPercent        Decimal?                 @default(0) @db.Decimal(5, 2)
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxPercent             Decimal?                 @default(0) @db.Decimal(5, 2)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  otherCharges           Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount            Decimal                  @db.Decimal(21, 4)
  paidAmount             Decimal?                 @default(0) @db.Decimal(21, 4)
  outstandingAmount      Decimal?                 @db.Decimal(21, 4)
  // Payment Terms
  paymentTermDays        Int?                     @db.SmallInt
  // Status
  invoiceStatus          InvoiceStatusEnum        @default(DRAFT)
  paymentStatus          InvoicePaymentStatusEnum @default(UNPAID)
  isPosted               Boolean?                 @default(false)
  postedDate             DateTime?
  // Notes
  notes                  String?                  @db.Text
  internalNotes          String?                  @db.Text
  // Metadata
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  customer               cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle?     @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  serviceOrder           wks_ServiceOrder?        @relation(fields: [company_id, source_document_id], references: [company_id, id], onUpdate: NoAction)
  taxScheme              cmf_TaxScheme?           @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  invoiceDetails         arm_InvoiceDetail[]
  payments               arm_Payment[]
  glTrans                acc_GLTrans[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_arm_Invoice")
  @@unique([company_id, invoiceNumber], map: "unique_invoice_number")
  @@index([company_id, customer_id], map: "idx_invoice_customer")
  @@index([company_id, invoiceDate], map: "idx_invoice_date")
  @@index([company_id, invoiceStatus], map: "idx_invoice_status")
}

// Invoice Detail
model arm_InvoiceDetail {
  id              String                 @db.Char(30) // Manual: IND/2025/10/00001
  invoice_id      String                 @db.Char(30)
  lineNumber      Int                    @db.SmallInt
  itemType        InvoiceItemTypeEnum // SERVICE, PART, OTHER
  // Item Info
  item_id         String?                @db.Char(30) // Service Type ID atau Product ID
  itemCode        String?                @db.VarChar(50)
  itemName        String                 @db.VarChar(250)
  itemDescription String?                @db.Text
  // Quantity & Price
  quantity        Decimal                @db.Decimal(12, 4)
  uom             String?                @db.VarChar(10)
  unitPrice       Decimal                @db.Decimal(21, 4)
  discountPercent Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount  Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent      Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount       Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal        Decimal                @db.Decimal(21, 4)
  // COA Mapping
  revenue_coa_id  String?                @db.Char(15) // Revenue account
  // Status
  iStatus         MasterRecordStatusEnum @default(Active)
  remarks         String?                @db.VarChar(250)
  createdBy       String?                @db.Char(10)
  createdAt       DateTime               @default(now())
  updatedBy       String?                @db.Char(10)
  updatedAt       DateTime
  company_id      String                 @db.Char(5)
  branch_id       String                 @db.Char(10)
  // Relations
  invoice         arm_Invoice            @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_InvoiceDetail")
  @@index([company_id, invoice_id], map: "idx_invoice_detail")
}

// Payment (Pembayaran Invoice)
model arm_Payment {
  id                String                   @db.Char(30) // Manual: PAY/2025/10/00001
  paymentNumber     String                   @db.VarChar(30)
  paymentDate       DateTime                 @default(now())
  transaction_type  String                   @db.Char(5) // "PAY"
  transaction_class String                   @db.Char(10) // "SALES"
  // Invoice Info
  invoice_id        String                   @db.Char(30)
  invoiceNumber     String?                  @db.VarChar(30)
  // Customer Info
  customer_id       String                   @db.Char(20)
  customerName      String?                  @db.VarChar(100)
  // Payment Info
  paymentMethod_id  String                   @db.Char(10)
  bankAccount_id    String?                  @db.Char(10) // Jika payment via bank
  referenceNumber   String?                  @db.VarChar(50) // Nomor transfer/QRIS/dll
  // Amount
  paymentAmount     Decimal                  @db.Decimal(21, 4)
  processingFee     Decimal?                 @default(0) @db.Decimal(21, 4)
  netAmount         Decimal                  @db.Decimal(21, 4) // Payment - Fee
  // Status
  paymentStatus     PaymentConfirmStatusEnum @default(PENDING)
  verifiedBy        String?                  @db.Char(10)
  verifiedDate      DateTime?
  isPosted          Boolean?                 @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                  @db.Text
  internalNotes     String?                  @db.Text
  // Proof
  proofImageURL     String?                  @db.VarChar(250) // Bukti transfer
  // Metadata
  iStatus           MasterRecordStatusEnum   @default(Active)
  remarks           String?                  @db.VarChar(250)
  createdBy         String?                  @db.Char(10)
  createdAt         DateTime                 @default(now())
  updatedBy         String?                  @db.Char(10)
  updatedAt         DateTime
  company_id        String                   @db.Char(5)
  branch_id         String                   @db.Char(10)
  // Relations
  invoice           arm_Invoice              @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  customer          cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod     cmf_PaymentMethod        @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)
  bankAccount       acc_BankAccount?         @relation(fields: [company_id, bankAccount_id], references: [company_id, id], onUpdate: NoAction)
  paymentDetails    arm_PaymentDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_Payment")
  @@unique([company_id, paymentNumber], map: "unique_payment_number")
  @@index([company_id, invoice_id], map: "idx_payment_invoice")
  @@index([company_id, customer_id], map: "idx_payment_customer")
}

// Payment Detail (jika 1 payment untuk multiple invoice atau alokasi)
model arm_PaymentDetail {
  id               String                 @db.Char(30) // Manual: PYD/2025/10/00001
  payment_id       String                 @db.Char(30)
  lineNumber       Int                    @db.SmallInt
  description      String?                @db.VarChar(250)
  paymentMethod_id String                 @db.Char(10)
  amount           Decimal                @db.Decimal(21, 4)
  referenceNumber  String?                @db.VarChar(50)
  // Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  payment          arm_Payment            @relation(fields: [company_id, payment_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod    cmf_PaymentMethod      @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_PaymentDetail")
  @@index([company_id, payment_id], map: "idx_payment_detail")
}

// Cash Receipt (Penerimaan Kas)
model arm_CashReceipt {
  id                String                  @db.Char(30) // Manual: CR/2025/10/00001
  receiptNumber     String                  @db.VarChar(30)
  receiptDate       DateTime                @default(now())
  transaction_type  String                  @db.Char(5) // "CR"
  transaction_class String                  @db.Char(10) // "CASH"
  // Payer Info
  receivedFrom      String                  @db.VarChar(150) // Nama pembayar
  receivedFromType  String?                 @db.VarChar(20) // CUSTOMER, SUPPLIER, OTHER
  receivedFrom_id   String?                 @db.Char(20)
  // Amount
  totalAmount       Decimal                 @db.Decimal(21, 4)
  // Status
  receiptStatus     CashReceiptStatusEnum   @default(DRAFT)
  isPosted          Boolean?                @default(false)
  postedDate        DateTime?
  // Notes
  description       String?                 @db.Text
  notes             String?                 @db.Text
  // Metadata
  iStatus           MasterRecordStatusEnum  @default(Active)
  remarks           String?                 @db.VarChar(250)
  createdBy         String?                 @db.Char(10)
  createdAt         DateTime                @default(now())
  updatedBy         String?                 @db.Char(10)
  updatedAt         DateTime
  company_id        String                  @db.Char(5)
  branch_id         String                  @db.Char(10)
  // Relations
  receiptDetails    arm_CashReceiptDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_CashReceipt")
  @@unique([company_id, receiptNumber], map: "unique_receipt_number")
}

// Cash Receipt Detail
model arm_CashReceiptDetail {
  id             String                 @db.Char(30) // Manual: CRD/2025/10/00001
  cashReceipt_id String                 @db.Char(30)
  lineNumber     Int                    @db.SmallInt
  coa_id         String                 @db.Char(15) // COA untuk debit
  description    String?                @db.VarChar(250)
  amount         Decimal                @db.Decimal(21, 4)
  // Metadata
  iStatus        MasterRecordStatusEnum @default(Active)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  // Relations
  cashReceipt    arm_CashReceipt        @relation(fields: [company_id, cashReceipt_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_CashReceiptDetail")
  @@index([company_id, cashReceipt_id], map: "idx_cash_receipt_detail")
}

/// ============================================================================
/// ACCOUNT PAYABLE MANAGEMENT (APM) MODULE
/// ============================================================================
/// Module untuk manage hutang pembelian dan pembayaran ke supplier
/// Flow: PurchaseReceive → A/P Invoice → Payment → PurchaseReturn → GL
/// Support: Payment terms, withholding tax, partial payment, debit note

// A/P Invoice (Invoice dari Supplier) - Hutang
model apm_Invoice {
  id                    String                 @db.Char(30) // Manual: APINV/2025/10/00001
  invoiceNumber         String                 @db.VarChar(30)
  invoiceDate           DateTime               @default(now())
  dueDate               DateTime?              @db.Date
  transaction_type      String                 @db.Char(5) // "APINV"
  transaction_class     String                 @db.Char(10) // "PURCHASE"
  // Tax Configuration
  taxScheme_id          String?                @db.Char(5) // V1, V2, V3
  // Source Document
  source_module         String?                @db.VarChar(20) // "PROCUREMENT"
  purchaseReceive_id    String?                @db.Char(20) // Link ke Purchase Receive
  purchaseOrder_id      String?                @db.Char(20) // Link ke PO
  receiveNumber         String?                @db.VarChar(30)
  poNumber              String?                @db.VarChar(30)
  // Supplier Info
  supplier_id           String                 @db.Char(20)
  supplierName          String                 @db.VarChar(150)
  supplierAddress       String?                @db.Text
  supplierPhone         String?                @db.VarChar(20)
  supplierEmail         String?                @db.VarChar(100)
  // Supplier Invoice Info
  supplierInvoiceNumber String?                @db.VarChar(30)
  supplierInvoiceDate   DateTime?              @db.Date
  taxInvoiceNumber      String?                @db.VarChar(30) // Faktur Pajak
  // Amount
  subtotalAmount        Decimal                @default(0) @db.Decimal(21, 4)
  discountPercent       Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount        Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent            Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount             Decimal?               @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?               @default(0) @db.Decimal(21, 4)
  otherCharges          Decimal?               @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal                @db.Decimal(21, 4)
  paidAmount            Decimal?               @default(0) @db.Decimal(21, 4)
  outstandingAmount     Decimal?               @db.Decimal(21, 4)
  // Payment Terms
  paymentTermDays       Int?                   @db.SmallInt
  paymentDueDate        DateTime?              @db.Date
  // Status
  invoiceStatus         APInvoiceStatusEnum    @default(DRAFT)
  paymentStatus         APPaymentStatusEnum    @default(UNPAID)
  isPosted              Boolean?               @default(false)
  postedDate            DateTime?
  // Notes
  notes                 String?                @db.Text
  internalNotes         String?                @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum @default(Active)
  remarks               String?                @db.VarChar(250)
  createdBy             String?                @db.Char(10)
  createdAt             DateTime               @default(now())
  updatedBy             String?                @db.Char(10)
  updatedAt             DateTime
  company_id            String                 @db.Char(5)
  branch_id             String                 @db.Char(10)
  // Relations
  supplier              prc_Supplier           @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  purchaseReceive       prc_PurchaseReceive?   @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder         prc_PurchaseOrder?     @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  taxScheme             cmf_TaxScheme?         @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  invoiceDetails        apm_InvoiceDetail[]
  payments              apm_Payment[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_apm_Invoice")
  @@unique([company_id, invoiceNumber], map: "unique_ap_invoice_number")
  @@index([company_id, supplier_id], map: "idx_ap_invoice_supplier")
  @@index([company_id, invoiceDate], map: "idx_ap_invoice_date")
  @@index([company_id, invoiceStatus], map: "idx_ap_invoice_status")
}

// A/P Invoice Detail
model apm_InvoiceDetail {
  id                String                 @db.Char(30) // Manual: APID/2025/10/00001
  apInvoice_id      String                 @db.Char(30)
  lineNumber        Int                    @db.SmallInt
  // Product Info
  product_id        String?                @db.Char(20)
  productVariant_id String?                @db.Char(30)
  productName       String                 @db.VarChar(250)
  productCode       String?                @db.VarChar(50)
  description       String?                @db.Text
  // Quantity & Price
  quantity          Decimal                @db.Decimal(12, 4)
  uom               String?                @db.VarChar(10)
  unitPrice         Decimal                @db.Decimal(21, 4)
  discountPercent   Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount    Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent        Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount         Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal          Decimal                @db.Decimal(21, 4)
  // COA Mapping
  expense_coa_id    String?                @db.Char(15) // Expense/Inventory account
  // Status
  iStatus           MasterRecordStatusEnum @default(Active)
  remarks           String?                @db.VarChar(250)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  updatedBy         String?                @db.Char(10)
  updatedAt         DateTime
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  // Relations
  apInvoice         apm_Invoice            @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  product           imc_Product?           @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_apm_InvoiceDetail")
  @@index([company_id, apInvoice_id], map: "idx_ap_invoice_detail")
}

// A/P Payment (Pembayaran ke Supplier)
model apm_Payment {
  id                String                     @db.Char(30) // Manual: APPAY/2025/10/00001
  paymentNumber     String                     @db.VarChar(30)
  paymentDate       DateTime                   @default(now())
  transaction_type  String                     @db.Char(5) // "APPAY"
  transaction_class String                     @db.Char(10) // "PURCHASE"
  // Invoice Info
  apInvoice_id      String                     @db.Char(30)
  invoiceNumber     String?                    @db.VarChar(30)
  // Supplier Info
  supplier_id       String                     @db.Char(20)
  supplierName      String?                    @db.VarChar(150)
  // Payment Info
  paymentMethod_id  String                     @db.Char(10)
  bankAccount_id    String?                    @db.Char(10) // Bank account yang digunakan
  referenceNumber   String?                    @db.VarChar(50) // Nomor transfer/giro/dll
  // Amount
  paymentAmount     Decimal                    @db.Decimal(21, 4)
  processingFee     Decimal?                   @default(0) @db.Decimal(21, 4)
  netAmount         Decimal                    @db.Decimal(21, 4) // Payment + Fee
  // Status
  paymentStatus     APPaymentConfirmStatusEnum @default(PENDING)
  verifiedBy        String?                    @db.Char(10)
  verifiedDate      DateTime?
  isPosted          Boolean?                   @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                    @db.Text
  internalNotes     String?                    @db.Text
  // Proof
  proofImageURL     String?                    @db.VarChar(250) // Bukti transfer
  // Metadata
  iStatus           MasterRecordStatusEnum     @default(Active)
  remarks           String?                    @db.VarChar(250)
  createdBy         String?                    @db.Char(10)
  createdAt         DateTime                   @default(now())
  updatedBy         String?                    @db.Char(10)
  updatedAt         DateTime
  company_id        String                     @db.Char(5)
  branch_id         String                     @db.Char(10)
  // Relations
  apInvoice         apm_Invoice                @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  supplier          prc_Supplier               @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod     cmf_PaymentMethod          @relation(fields: [id], onUpdate: NoAction, references: [id])
  bankAccount       acc_BankAccount?           @relation(fields: [company_id, bankAccount_id], references: [company_id, id], onUpdate: NoAction)
  paymentDetails    apm_PaymentDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_apm_Payment")
  @@unique([company_id, paymentNumber], map: "unique_ap_payment_number")
  @@index([company_id, apInvoice_id], map: "idx_ap_payment_invoice")
  @@index([company_id, supplier_id], map: "idx_ap_payment_supplier")
}

// A/P Payment Detail (jika 1 payment untuk multiple invoice)
model apm_PaymentDetail {
  id               String                 @db.Char(30) // Manual: APPD/2025/10/00001
  apPayment_id     String                 @db.Char(30)
  lineNumber       Int                    @db.SmallInt
  description      String?                @db.VarChar(250)
  paymentMethod_id String                 @db.Char(10)
  amount           Decimal                @db.Decimal(21, 4)
  referenceNumber  String?                @db.VarChar(50)
  // Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  apPayment        apm_Payment            @relation(fields: [company_id, apPayment_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod    cmf_PaymentMethod      @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_apm_PaymentDetail")
  @@index([company_id, apPayment_id], map: "idx_ap_payment_detail")
}

// Purchase Return (Return barang ke Supplier)
model prc_PurchaseReturn {
  id                   String                     @db.Char(30) // Manual: PRET/2025/10/00001
  returnNumber         String                     @db.VarChar(30)
  returnDate           DateTime                   @default(now())
  transaction_type     String                     @db.Char(5) // "PRET"
  transaction_class    String                     @db.Char(10) // "PURCHASE"
  // Source Document
  purchaseReceive_id   String                     @db.Char(20)
  purchaseOrder_id     String?                    @db.Char(20)
  supplier_id          String                     @db.Char(20)
  // Reference
  receiveNumber        String?                    @db.VarChar(30)
  poNumber             String?                    @db.VarChar(30)
  supplierReturnNumber String?                    @db.VarChar(30) // Nomor retur dari supplier
  // Return Info
  returnReason         ReturnReasonEnum? // DAMAGED, DEFECTIVE, WRONG_ITEM, EXCESS, OTHER
  returnReasonDesc     String?                    @db.Text
  warehouse_id         String?                    @db.Char(4)
  // Amount
  subtotalAmount       Decimal                    @default(0) @db.Decimal(21, 4)
  taxAmount            Decimal?                   @default(0) @db.Decimal(21, 4)
  totalAmount          Decimal                    @db.Decimal(21, 4)
  // Status
  returnStatus         ReturnStatusEnum           @default(DRAFT)
  approvalStatus       ApprovalStatusEnum?        @default(PENDING)
  approvedBy           String?                    @db.Char(10)
  approvedDate         DateTime?
  isPosted             Boolean?                   @default(false)
  postedDate           DateTime?
  // Notes
  notes                String?                    @db.Text
  internalNotes        String?                    @db.Text
  // Metadata
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  company_id           String                     @db.Char(5)
  branch_id            String                     @db.Char(10)
  // Relations
  purchaseReceive      prc_PurchaseReceive        @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder        prc_PurchaseOrder?         @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  supplier             prc_Supplier               @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse            imc_Warehouse?             @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  returnDetails        prc_PurchaseReturnDetail[]
  glTrans              acc_GLTrans[]

  @@id([company_id, id], map: "pk_prc_PurchaseReturn")
  @@unique([company_id, returnNumber], map: "unique_return_number")
  @@index([company_id, supplier_id], map: "idx_return_supplier")
  @@index([company_id, returnDate], map: "idx_return_date")
}

// Purchase Return Detail
model prc_PurchaseReturnDetail {
  id                String                  @db.Char(30) // Manual: PRTD/2025/10/00001
  purchaseReturn_id String                  @db.Char(30)
  lineNumber        Int                     @db.SmallInt
  // Product Info
  product_id        String                  @db.Char(20)
  productVariant_id String?                 @db.Char(30)
  productName       String                  @db.VarChar(250)
  productCode       String?                 @db.VarChar(50)
  // Quantity
  returnedQty       Decimal                 @db.Decimal(12, 4)
  acceptedQty       Decimal?                @db.Decimal(12, 4) // Qty yang diterima supplier
  rejectedQty       Decimal?                @default(0) @db.Decimal(12, 4)
  uom               String                  @db.VarChar(10)
  // Pricing
  unitPrice         Decimal                 @db.Decimal(21, 4)
  discountAmount    Decimal?                @default(0) @db.Decimal(21, 4)
  taxAmount         Decimal?                @default(0) @db.Decimal(21, 4)
  subtotal          Decimal                 @db.Decimal(21, 4)
  // Return Reason
  returnReason      String?                 @db.VarChar(250)
  // Storage Location
  warehouse_id      String?                 @db.Char(4)
  floor_id          String?                 @db.Char(5)
  shelf_id          String?                 @db.Char(15)
  row_id            String?                 @db.Char(15)
  batchNumber       String?                 @db.VarChar(30)
  // Status
  lineStatus        ReturnDetailStatusEnum? @default(PENDING)
  iStatus           MasterRecordStatusEnum  @default(Active)
  remarks           String?                 @db.VarChar(250)
  createdBy         String?                 @db.Char(10)
  createdAt         DateTime                @default(now())
  updatedBy         String?                 @db.Char(10)
  updatedAt         DateTime
  company_id        String                  @db.Char(5)
  branch_id         String                  @db.Char(10)
  // Relations
  purchaseReturn    prc_PurchaseReturn      @relation(fields: [company_id, purchaseReturn_id], references: [company_id, id], onUpdate: NoAction)
  product           imc_Product             @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_prc_PurchaseReturnDetail")
  @@index([company_id, purchaseReturn_id], map: "idx_return_detail")
}

/// ============================================================================
/// GENERAL LEDGER MODULE
/// ============================================================================
/// Module untuk General Ledger - Semua transaksi uang bermuara ke sini
/// Flow: Any Transaction → acc_GLTrans → acc_GLTransDetail
/// Support: Multi-source posting, reversal, drill-down ke source document

// GL Transaction (Journal Entry Header) - Semua transaksi uang bermuara ke sini
model acc_GLTrans {
  id                     String                 @db.Char(30) // Manual: JV/2025/10/00001
  journalNumber          String                 @db.VarChar(30)
  journalDate            DateTime               @default(now())
  transaction_type       String                 @db.Char(5) // JV, INV, PAY, PO, GRN, dll
  transaction_class      String                 @db.Char(10) // SALES, PURCHASE, CASH, BANK, JOURNAL
  // Source Document
  source_module          String?                @db.VarChar(20) // SERVICE, PROCUREMENT, ACCOUNTING, INVENTORY
  source_document_id     String?                @db.Char(30)
  source_document_number String?                @db.VarChar(30)
  // References
  invoice_id             String?                @db.Char(30) // A/R Invoice
  payment_id             String?                @db.Char(30) // A/R Payment
  cashReceipt_id         String?                @db.Char(30) // Cash Receipt
  apInvoice_id           String?                @db.Char(30) // A/P Invoice
  apPayment_id           String?                @db.Char(30) // A/P Payment
  purchaseOrder_id       String?                @db.Char(20) // Purchase Order
  purchaseReturn_id      String?                @db.Char(30) // Purchase Return
  creditNote_id          String?                @db.Char(30) // Credit Note
  // Description
  description            String                 @db.VarChar(250)
  notes                  String?                @db.Text
  // Total Amount
  totalDebit             Decimal                @default(0) @db.Decimal(21, 4)
  totalCredit            Decimal                @default(0) @db.Decimal(21, 4)
  // Status
  journalStatus          JournalStatusEnum      @default(DRAFT)
  isPosted               Boolean?               @default(false)
  postedBy               String?                @db.Char(10)
  postedDate             DateTime?
  isReversed             Boolean?               @default(false)
  reversedBy             String?                @db.Char(10)
  reversedDate           DateTime?
  reversalJournal_id     String?                @db.Char(30) // Link ke reversal journal
  // Metadata
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  company_id             String                 @db.Char(5)
  branch_id              String                 @db.Char(10)
  // Relations
  invoice                arm_Invoice?           @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  payment                arm_Payment?           @relation(fields: [company_id, payment_id], references: [company_id, id], onUpdate: NoAction)
  cashReceipt            arm_CashReceipt?       @relation(fields: [company_id, cashReceipt_id], references: [company_id, id], onUpdate: NoAction)
  apInvoice              apm_Invoice?           @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  apPayment              apm_Payment?           @relation(fields: [company_id, apPayment_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder          prc_PurchaseOrder?     @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  purchaseReturn         prc_PurchaseReturn?    @relation(fields: [company_id, purchaseReturn_id], references: [company_id, id], onUpdate: NoAction)
  creditNote             arm_CreditNote?        @relation(fields: [company_id, creditNote_id], references: [company_id, id], onUpdate: NoAction)
  glTransDetails         acc_GLTransDetail[]

  @@id([company_id, id], map: "pk_acc_GLTrans")
  @@unique([company_id, journalNumber], map: "unique_journal_number")
  @@index([company_id, journalDate], map: "idx_gl_date")
  @@index([company_id, transaction_type], map: "idx_gl_trx_type")
}

// GL Transaction Detail (Journal Entry Detail) - Detail transaksi GL
model acc_GLTransDetail {
  id           String                 @db.Char(30) // Manual: GLD/2025/10/00001
  glTrans_id   String                 @db.Char(30)
  lineNumber   Int                    @db.SmallInt
  coa_id       String                 @db.Char(15)
  description  String?                @db.VarChar(250)
  debitAmount  Decimal?               @default(0) @db.Decimal(21, 4)
  creditAmount Decimal?               @default(0) @db.Decimal(21, 4)
  // Additional Info
  costCenter   String?                @db.VarChar(20)
  department   String?                @db.VarChar(20)
  project      String?                @db.VarChar(20)
  // Metadata
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  // Relations
  glTrans      acc_GLTrans            @relation(fields: [company_id, glTrans_id], references: [company_id, id], onUpdate: NoAction)
  coa          acc_COA                @relation(fields: [company_id, coa_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_acc_GLTransDetail")
  @@index([company_id, glTrans_id], map: "idx_gl_detail")
  @@index([company_id, coa_id], map: "idx_gl_detail_coa")
}

/// ============================================================================
/// ENUMS - All System Enumerations
/// ============================================================================
/// Semua enum yang digunakan di seluruh sistem
/// Grouped by: General Status, SAAS, Service, Procurement, Accounting, etc.

// ============================================================================
// GENERAL STATUS ENUMS
// ============================================================================

enum MasterRecordStatusEnum {
  InActive @map("0")
  Active   @map("1")
}

enum TransactionRecordStatusEnum {
  DRAFT    @map("0")
  APPROVED @map("1")
  PENDING  @map("2")
  CANCEL   @map("3")
}

enum ApprovalStatusEnum {
  PENDING  @map("0")
  APPROVED @map("1")
  REJECTED @map("2")
}

enum PostingStatusEnum {
  NOT_POSTED @map("0")
  POSTED     @map("1")
}

enum PriorityEnum {
  LOW    @map("L")
  NORMAL @map("N")
  HIGH   @map("H")
  URGENT @map("U")
}

// ============================================================================
// SAAS SUBSCRIPTION ENUMS
// ============================================================================

enum BillingCycleEnum {
  MONTHLY @map("M") // Bulanan
  YEARLY  @map("Y") // Tahunan
}

enum SubscriptionStatusEnum {
  TRIAL     @map("T") // Trial period
  ACTIVE    @map("A") // Active/running
  EXPIRED   @map("E") // Expired
  SUSPENDED @map("S") // Suspended
  CANCELLED @map("C") // Cancelled
}

enum BillingStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  OVERDUE @map("3") // Overdue
  WAIVED  @map("9") // Dibebaskan
}

enum AddonStatusEnum {
  ACTIVE    @map("A") // Active
  SUSPENDED @map("S") // Suspended
  EXPIRED   @map("E") // Expired
  CANCELLED @map("C") // Cancelled
}

// ============================================================================
// CUSTOMER & VEHICLE ENUMS
// ============================================================================

enum CustomerTypeEnum {
  INDIVIDUAL @map("I")
  CORPORATE  @map("C")
}

enum GenderEnum {
  MALE   @map("M")
  FEMALE @map("F")
}

enum FuelLevelEnum {
  EMPTY   @map("E")
  QUARTER @map("Q")
  HALF    @map("H")
  FULL    @map("F")
}

// ============================================================================
// SERVICE MANAGEMENT ENUMS
// ============================================================================

enum ServiceCategoryEnum {
  MAINTENANCE @map("MAINT")
  REPAIR      @map("REPAIR")
  BODYWORK    @map("BODY")
  WASH        @map("WASH")
  INSPECTION  @map("INSP")
  TUNEUP      @map("TUNE")
  EMERGENCY   @map("EMERG")
}

enum MechanicLevelEnum {
  JUNIOR  @map("JR")
  SENIOR  @map("SR")
  MASTER  @map("MT")
  FOREMAN @map("FM")
}

enum ServiceBayTypeEnum {
  GENERAL       @map("GEN")
  HEAVY_DUTY    @map("HEAVY")
  QUICK_SERVICE @map("QUICK")
  BODYWORK      @map("BODY")
  WASH          @map("WASH")
}

enum ServiceOrderStatusEnum {
  DRAFT       @map("0")
  CONFIRMED   @map("1")
  IN_PROGRESS @map("2")
  ON_HOLD     @map("3")
  QC_CHECK    @map("4")
  COMPLETED   @map("5")
  DELIVERED   @map("6")
  CANCELLED   @map("9")
}

enum PaymentStatusEnum {
  UNPAID   @map("0")
  PARTIAL  @map("1")
  PAID     @map("2")
  REFUNDED @map("3")
}

enum DetailTypeEnum {
  SERVICE @map("S")
  PART    @map("P")
}

enum DetailStatusEnum {
  PENDING     @map("0")
  IN_PROGRESS @map("1")
  COMPLETED   @map("2")
  CANCELLED   @map("9")
}

// ============================================================================
// PROCUREMENT MANAGEMENT ENUMS
// ============================================================================

enum SupplierTypeEnum {
  VENDOR       @map("V")
  DISTRIBUTOR  @map("D")
  MANUFACTURER @map("M")
  AGENT        @map("A")
}

enum PurchaseOrderStatusEnum {
  DRAFT     @map("0")
  SUBMITTED @map("1")
  APPROVED  @map("2")
  CONFIRMED @map("3")
  PARTIAL   @map("4")
  COMPLETED @map("5")
  CANCELLED @map("9")
}

enum ReceiveStatusEnum {
  NOT_RECEIVED @map("0")
  DRAFT        @map("1")
  PARTIAL      @map("2")
  RECEIVED     @map("3")
  COMPLETED    @map("5")
}

enum PODetailStatusEnum {
  OPEN           @map("0")
  PARTIAL        @map("1")
  FULLY_RECEIVED @map("2")
  CANCELLED      @map("9")
}

enum QualityStatusEnum {
  PENDING  @map("0")
  APPROVED @map("1")
  REJECTED @map("2")
  PARTIAL  @map("3")
}

enum ReceiveDetailStatusEnum {
  RECEIVED @map("0")
  ACCEPTED @map("1")
  REJECTED @map("2")
  DAMAGED  @map("3")
}

// ============================================================================
// INVENTORY MOVEMENT ENUMS
// ============================================================================

enum InternalMovementTypeEnum {
  TRANSFER    @map("TRF") // Transfer antar warehouse
  ADJUSTMENT  @map("ADJ") // Adjustment stock (tambah/kurang)
  RETURN      @map("RET") // Return dari customer/service
  SCRAP       @map("SCP") // Barang rusak/scrap
  ASSEMBLY    @map("ASM") // Assembly/rakit produk
  DISASSEMBLY @map("DIS") // Disassembly/bongkar produk
  ALLOCATION  @map("ALC") // Alokasi untuk service/project
  CONSUMPTION @map("CSM") // Konsumsi internal
}

enum TransactionTypeEnum {
  IN  @map("I") // Inventory IN
  OUT @map("O") // Inventory OUT
}

enum MovementStatusEnum {
  DRAFT      @map("0")
  REQUESTED  @map("1")
  APPROVED   @map("2")
  IN_TRANSIT @map("3")
  COMPLETED  @map("5")
  CANCELLED  @map("9")
}

enum MovementDetailStatusEnum {
  PENDING   @map("0")
  MOVED     @map("1")
  RECEIVED  @map("2")
  PARTIAL   @map("3")
  CANCELLED @map("9")
}

// ============================================================================
// COMPLAINT MANAGEMENT ENUMS
// ============================================================================

enum ComplaintTypeEnum {
  SERVICE_QUALITY @map("SQ") // Kualitas service
  PARTS_QUALITY   @map("PQ") // Kualitas parts
  PRICING         @map("PR") // Masalah harga
  DELAY           @map("DL") // Keterlambatan
  STAFF_BEHAVIOR  @map("SB") // Perilaku staff
  FACILITY        @map("FC") // Fasilitas
  WARRANTY        @map("WR") // Garansi
  OTHER           @map("OT") // Lainnya
}

enum SeverityEnum {
  LOW      @map("L") // Rendah
  MEDIUM   @map("M") // Sedang
  HIGH     @map("H") // Tinggi
  CRITICAL @map("C") // Kritis
}

enum ComplaintSourceEnum {
  PHONE        @map("PH") // Telepon
  EMAIL        @map("EM") // Email
  WHATSAPP     @map("WA") // WhatsApp
  IN_PERSON    @map("IP") // Langsung
  SOCIAL_MEDIA @map("SM") // Social media
  WEBSITE      @map("WB") // Website
  SURVEY       @map("SV") // Survey
}

enum ComplaintStatusEnum {
  OPEN          @map("0") // Baru dibuka
  ASSIGNED      @map("1") // Sudah di-assign
  INVESTIGATING @map("2") // Sedang investigasi
  IN_PROGRESS   @map("3") // Sedang ditangani
  RESOLVED      @map("4") // Sudah resolved
  CLOSED        @map("5") // Ditutup
  REOPENED      @map("6") // Dibuka kembali
  REJECTED      @map("9") // Ditolak
}

enum ComplaintLogTypeEnum {
  STATUS_CHANGE @map("SC") // Perubahan status
  ASSIGNMENT    @map("AS") // Assignment
  RESPONSE      @map("RS") // Response/jawaban
  ESCALATION    @map("ES") // Escalation
  RESOLUTION    @map("RE") // Resolution
  FOLLOW_UP     @map("FU") // Follow up
  NOTE          @map("NT") // Catatan
  CALL          @map("CL") // Telepon
  EMAIL_SENT    @map("EM") // Email terkirim
  COMPENSATION  @map("CP") // Kompensasi diberikan
}

// ============================================================================
// SERVICE RETURN & REWORK ENUMS
// ============================================================================

enum ReworkReasonEnum {
  POOR_QUALITY @map("PQ") // Kualitas service buruk
  INCOMPLETE   @map("IC") // Service tidak lengkap
  WRONG_PART   @map("WP") // Part yang dipasang salah
  MALFUNCTION  @map("MF") // Masih bermasalah setelah service
  DAMAGE       @map("DM") // Rusak karena kesalahan mekanik
  OTHER        @map("OT") // Lainnya
}

enum ReworkStatusEnum {
  SCHEDULED   @map("0") // Dijadwalkan
  IN_PROGRESS @map("1") // Sedang dikerjakan
  QC_CHECK    @map("2") // QC check
  COMPLETED   @map("3") // Selesai
  CANCELLED   @map("9") // Dibatalkan
}

enum ReworkActionEnum {
  REDO    @map("RD") // Kerjakan ulang
  REPLACE @map("RP") // Ganti part
  ADJUST  @map("AD") // Adjust/penyesuaian
  REFUND  @map("RF") // Refund uang
  VOUCHER @map("VC") // Voucher
}

enum CreditReasonEnum {
  SERVICE_ISSUE @map("SI") // Masalah service
  OVERCHARGE    @map("OC") // Overcharge/salah harga
  GOODWILL      @map("GW") // Goodwill/kompensasi
  RETURN        @map("RT") // Return service/parts
  COMPLAINT     @map("CP") // Complaint settlement
  OTHER         @map("OT") // Lainnya
}

enum RefundMethodEnum {
  CASH              @map("CSH") // Cash/tunai
  BANK_TRANSFER     @map("TRF") // Transfer bank
  CREDIT_TO_ACCOUNT @map("CTA") // Credit ke akun (piutang)
  VOUCHER           @map("VCH") // Voucher/credit note
  OFFSET            @map("OFF") // Offset dengan invoice lain
}

enum CreditNoteStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("3") // Posted ke GL
  REFUNDED  @map("4") // Sudah direfund
  CANCELLED @map("9") // Cancelled
}

// ============================================================================
// ACCOUNTING & GL ENUMS
// ============================================================================

enum DocumentResetEnum {
  NEVER @map("N") // Tidak pernah reset
  YEAR  @map("Y") // Reset per tahun
  MONTH @map("M") // Reset per bulan
  DAY   @map("D") // Reset per hari
}

enum PaymentMethodTypeEnum {
  CASH    @map("CASH") // Tunai
  BANK    @map("BANK") // Transfer bank
  CARD    @map("CARD") // Kartu debit/credit
  EWALLET @map("EWLT") // E-wallet (GoPay, OVO, dll)
  QRIS    @map("QRIS") // QRIS
  GIRO    @map("GIRO") // Giro/Cheque
}

enum COATypeEnum {
  ASSET     @map("A") // Harta/Aset
  LIABILITY @map("L") // Kewajiban/Hutang
  EQUITY    @map("E") // Modal
  REVENUE   @map("R") // Pendapatan
  EXPENSE   @map("X") // Beban/Biaya
}

enum BalanceTypeEnum {
  DEBIT  @map("D") // Normal balance Debit
  CREDIT @map("C") // Normal balance Credit
}

enum InvoiceStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  SENT      @map("3") // Sent to customer
  OVERDUE   @map("4") // Overdue
  PAID      @map("5") // Paid
  CANCELLED @map("9") // Cancelled
}

enum InvoicePaymentStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  REFUND  @map("3") // Refund
}

enum InvoiceItemTypeEnum {
  SERVICE @map("S") // Jasa service
  PART    @map("P") // Spare part
  OTHER   @map("O") // Lainnya
}

enum PaymentConfirmStatusEnum {
  PENDING   @map("0") // Pending verification
  VERIFIED  @map("1") // Verified/confirmed
  REJECTED  @map("2") // Rejected
  CANCELLED @map("9") // Cancelled
}

enum CashReceiptStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("5") // Posted ke GL
  CANCELLED @map("9") // Cancelled
}

enum JournalStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("5") // Posted
  REVERSED  @map("8") // Reversed
  CANCELLED @map("9") // Cancelled
}

enum APInvoiceStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  RECEIVED  @map("3") // Invoice received
  OVERDUE   @map("4") // Overdue
  PAID      @map("5") // Paid
  CANCELLED @map("9") // Cancelled
}

enum APPaymentStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  VOID    @map("9") // Void
}

enum APPaymentConfirmStatusEnum {
  PENDING   @map("0") // Pending verification
  VERIFIED  @map("1") // Verified/confirmed
  REJECTED  @map("2") // Rejected
  CANCELLED @map("9") // Cancelled
}

enum ReturnReasonEnum {
  DAMAGED    @map("DMG") // Barang rusak
  DEFECTIVE  @map("DEF") // Cacat/defect
  WRONG_ITEM @map("WRG") // Barang salah
  EXCESS     @map("EXC") // Kelebihan
  EXPIRED    @map("EXP") // Kadaluarsa
  OTHER      @map("OTH") // Lainnya
}

enum ReturnStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  SHIPPED   @map("3") // Dikirim ke supplier
  ACCEPTED  @map("4") // Diterima supplier
  COMPLETED @map("5") // Selesai
  REJECTED  @map("8") // Ditolak supplier
  CANCELLED @map("9") // Cancelled
}

enum ReturnDetailStatusEnum {
  PENDING   @map("0") // Pending
  SHIPPED   @map("1") // Dikirim
  ACCEPTED  @map("2") // Diterima supplier
  REJECTED  @map("3") // Ditolak
  CANCELLED @map("9") // Cancelled
}

enum TaxTypeEnum {
  SALES    @map("S") // Tax untuk Sales (Output Tax / PPN Keluaran)
  PURCHASE @map("P") // Tax untuk Purchase (Input Tax / PPN Masukan)
  WHT      @map("W") // Withholding Tax (PPh Potong)
  OTHER    @map("O") // Tax lainnya
}

```

- Saya sudah menambahkan struktur jadwal lengkap untuk booking.

### Yang saya tambahkan untuk jadwal
- wks_BranchWorkingHour: jam operasional per branch per weekday.
- wks_BranchHoliday: hari libur/exception per branch.
- wks_MechanicAvailability: ketersediaan mekanik per tanggal (override jam operasional).
- wks_BayBlock: blokir bay pada rentang waktu (maintenance/cleaning).
- wks_BookingSlot: opsional, slot waktu pre-generated per bay dengan kapasitas dan status.
- wks_ServiceBooking: booking inti dengan preferred time, scheduledStart/End, bay/mechanic opsional, dan status booking.

### Enums
- BookingStatusEnum: PENDING, CONFIRMED, CHECKED_IN, IN_SERVICE, COMPLETED, NO_SHOW, CANCELLED
- BookingSourceEnum: WEB, APP, PHONE, WALKIN
- SlotStatusEnum: OPEN, BLOCKED, FULL

Letak edits: sebelum `wks_ServiceOrder` di modul Service. Sekarang booking bisa:
- membaca jam kerja/holiday untuk validasi slot,
- cek ketersediaan mekanik/bay,
- set `scheduledStart`/`scheduledEnd` saat CONFIRMED,
- opsi gunakan `wks_BookingSlot` jika mau time-slotting.

Ingin saya tambahkan constraint/validator di service layer untuk mencegah overlap jadwal dan auto-pick bay/mechanic dari availability?

---

**User**

Ingin saya tambahkan constraint/validator di service layer untuk mencegah overlap jadwal dan auto-pick bay/mechanic dari availability? Kalau tanpa ini, efek kedepannya gimana, minor atau major?

---

**Cursor**

- **Jawaban singkat**: Dampaknya major. Tanpa validator/constraint anti-overlap dan auto-pick resource, sistem rawan double-booking bay/mekanik, chaos operasional, dan komplain pelanggan.

### Risiko jika tidak ada anti-overlap dan auto-pick
- **Double-booking**: Bay atau mekanik bisa terjadwal ganda pada slot yang sama.
- **Utilization bias**: Mekanik/bay favorit kepenuhan, yang lain idle.
- **SLA/lead time**: Keterlambatan dan antrian tidak terprediksi.
- **CX**: Pelanggan datang tapi harus menunggu lama atau dibatalkan.
- **Data & KPI**: Reporting false (utilization >100%, throughput salah).
- **Operasi**: Banyak manual reschedule, eskalasi, dan refund.

Kesimpulan: ini bukan kosmetik; untuk produksi, kontrol jadwal wajib. 

### Rekomendasi implementasi minimal-wajib (service layer)
- **Cek overlap atomik** saat create/confirm booking:
  - Validasi `scheduledStart/End` terhadap:
    - `wks_BranchWorkingHour` + `wks_BranchHoliday`
    - `wks_BayBlock` + booking lain pada bay yang sama
    - `wks_MechanicAvailability` + booking lain pada mekanik yang sama
  - Jalankan dalam satu transaksi dengan locking (mis. SELECT … FOR UPDATE) agar race condition tidak lolos.
- **Buffer time**: dukung buffer antar booking per branch (mis. 10–15 menit).
- **Capacity**: hormati `wks_BookingSlot.capacity` bila slotting dipakai.
- **Fallback**: jika resource dipilih manual tapi bentrok, berikan rekomendasi slot alternatif.

### Auto-pick bay/mekanik (disarankan)
- Kriteria:
  - Cocok jam kerja, bukan hari libur, tidak diblokir.
  - Sesuai `ServiceBayTypeEnum` dan `ServiceType` (jika ada preferensi).
  - Mekanik available dan skill cocok (opsional via `specialization`).
- Heuristik:
  - Pilih bay/mekanik dengan beban terendah di hari itu.
  - Hormati default di `branch` bila ada; gunakan tie-breaker by `seq`/`id`.
- Output:
  - Isi `scheduledStart/End`, `bay_id`, `mechanic_id` saat status -> CONFIRMED.

### Hardening tambahan
- **Preventive recheck** saat status berubah ke CONFIRMED/IN_SERVICE.
- **Reconciliation job** (cron) untuk mendeteksi overlap yang masuk lewat edge case.
- **Graceful conflict resolution**: usulkan 2–3 slot alternatif terdekat.

Ingin saya implementasikan validator anti-overlap + auto-pick dasar sekarang di service layer (dengan transaksi/locking) dan menambahkan pengaturan buffer per branch?

---

**User**

Ingin saya implementasikan validator anti-overlap + auto-pick dasar sekarang di service layer (dengan transaksi/locking) dan menambahkan pengaturan buffer per branch? Sip, setuju daripada nanti mesti bongkar (major) schema lagi.

---

**Cursor**

I'll scan the backend src to locate the service layer structure and booking-related modules, then add a buffer setting in the schema and scaffold a booking service with anti-overlap checks and auto-pick logic.

I'll add a booking buffer setting to `wks_BranchWorkingHour` and then scaffold a `BookingModule` with a `BookingService` that enforces anti-overlap validation and basic auto-pick of bay/mechanic using Prisma transactions.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// ============================================================================
/// SAAS SUBSCRIPTION MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage subscription plans, billing, dan feature access
/// Plans: Lite, Professional, Enterprise

// Subscription Plans (Paket Berlangganan)
model saas_SubscriptionPlan {
  id                   String                     @db.Char(10) // LITE, PRO, ENTERPRISE
  planCode             String                     @db.VarChar(20)
  name                 String                     @db.VarChar(50) // Lite, Professional, Enterprise
  description          String?                    @db.Text
  description_en       String?                    @db.Text
  // Pricing (Real prices)
  monthlyPrice         Decimal                    @db.Decimal(21, 4) // Lite: 65000, Pro: 85000, Enterprise: 115000
  yearlyPrice          Decimal                    @db.Decimal(21, 4) // Lite: 624000, Pro: 816000, Enterprise: 1104000
  yearlyMonthlyEquiv   Decimal?                   @db.Decimal(21, 4) // Lite: 52000/bln, Pro: 68000/bln, Enterprise: 92000/bln
  discountYearly       Decimal?                   @db.Decimal(5, 2) // Diskon yearly (20%)
  currency             String                     @default("IDR") @db.Char(3)
  // Limits
  maxUsers             Int? // Max user yang bisa dibuat
  maxBranches          Int? // Max cabang
  maxProducts          Int? // Max produk
  maxCustomers         Int? // Max customer
  maxVehicles          Int? // Max kendaraan
  maxTransactions      Int? // Max transaksi per bulan
  storageLimit         Int? // Storage limit (GB)
  // Features (JSON bisa digunakan untuk flexible features)
  features             Json? // List fitur yang aktif
  // Display
  displayOrder         Int?                       @default(0)
  isPopular            Boolean?                   @default(false)
  highlightText        String?                    @db.VarChar(100) // "Most Popular", "Best Value"
  // Status
  isActive             Boolean                    @default(true)
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  // Relations
  companySubscriptions saas_CompanySubscription[]
  planFeatures         saas_PlanFeature[]

  @@id([id], map: "pk_saas_SubscriptionPlan")
  @@unique([planCode], map: "unique_plan_code")
}

// Company Subscription (Langganan Company)
model saas_CompanySubscription {
  id                   String                     @db.Char(30) // Manual: SUB/2025/10/00001
  subscriptionNumber   String                     @db.VarChar(30)
  company_id           String                     @db.Char(5)
  branch_id            String                     @db.Char(10)
  plan_id              String                     @db.Char(10)
  // Subscription Period
  startDate            DateTime                   @db.Date
  endDate              DateTime                   @db.Date
  billingCycle         BillingCycleEnum // MONTHLY, YEARLY
  // Pricing
  monthlyPrice         Decimal                    @db.Decimal(21, 4)
  yearlyPrice          Decimal?                   @db.Decimal(21, 4)
  discountPercent      Decimal?                   @default(0) @db.Decimal(5, 2)
  discountAmount       Decimal?                   @default(0) @db.Decimal(21, 4)
  finalPrice           Decimal                    @db.Decimal(21, 4)
  // Auto Renewal
  autoRenewal          Boolean                    @default(true)
  renewalDate          DateTime?                  @db.Date
  // Trial
  isTrialPeriod        Boolean?                   @default(false)
  trialEndDate         DateTime?                  @db.Date
  // Status
  subscriptionStatus   SubscriptionStatusEnum     @default(ACTIVE)
  isCancelled          Boolean?                   @default(false)
  cancelledDate        DateTime?
  cancelReason         String?                    @db.Text
  // Notifications
  notifyBeforeExpiry   Int?                       @default(7) @db.SmallInt // Notify X days before
  lastNotificationDate DateTime?
  // Metadata
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  // Relations
  company              sys_Company                @relation(fields: [company_id], references: [id], onUpdate: NoAction)
  plan                 saas_SubscriptionPlan      @relation(fields: [plan_id], references: [id], onUpdate: NoAction)
  billingHistory       saas_SubscriptionBilling[]
  usageRecords         saas_UsageTracking[]
  companyAddons        saas_CompanyAddon[]

  @@id([id], map: "pk_saas_CompanySubscription")
  @@unique([subscriptionNumber], map: "unique_subscription_number")
  @@index([company_id], map: "idx_subscription_company")
  @@index([plan_id], map: "idx_subscription_plan")
  @@index([subscriptionStatus], map: "idx_subscription_status")
}

// Plan Features (Fitur per Plan)
model saas_PlanFeature {
  id             String                 @db.Char(20)
  plan_id        String                 @db.Char(10)
  featureCode    String                 @db.VarChar(30) // MULTI_BRANCH, INVENTORY, ACCOUNTING, dll
  featureName    String                 @db.VarChar(100)
  featureName_en String?                @db.VarChar(100)
  category       String?                @db.VarChar(30) // CORE, SALES, INVENTORY, ACCOUNTING, dll
  isEnabled      Boolean                @default(true)
  customLimit    Int? // Custom limit untuk fitur ini
  description    String?                @db.Text
  seq            Int?                   @default(0)
  iStatus        MasterRecordStatusEnum @default(Active)
  createdAt      DateTime               @default(now())
  // Relations
  plan           saas_SubscriptionPlan  @relation(fields: [plan_id], references: [id], onUpdate: NoAction)

  @@id([plan_id, id], map: "pk_saas_PlanFeature")
  @@index([plan_id], map: "idx_plan_feature")
}

// Subscription Billing (Tagihan Langganan)
model saas_SubscriptionBilling {
  id                String                   @db.Char(30) // Manual: SBIL/2025/10/00001
  billingNumber     String                   @db.VarChar(30)
  billingDate       DateTime                 @default(now())
  dueDate           DateTime                 @db.Date
  subscription_id   String                   @db.Char(30)
  company_id        String                   @db.Char(5)
  branch_id         String                   @db.Char(10)
  // Billing Period
  periodStart       DateTime                 @db.Date
  periodEnd         DateTime                 @db.Date
  billingCycle      BillingCycleEnum
  // Amount
  baseAmount        Decimal                  @db.Decimal(21, 4)
  additionalCharges Decimal?                 @default(0) @db.Decimal(21, 4)
  discountAmount    Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount       Decimal                  @db.Decimal(21, 4)
  paidAmount        Decimal?                 @default(0) @db.Decimal(21, 4)
  outstandingAmount Decimal?                 @db.Decimal(21, 4)
  // Payment Info
  paymentMethod     String?                  @db.VarChar(30)
  paymentDate       DateTime?
  paymentReference  String?                  @db.VarChar(50)
  // Status
  billingStatus     BillingStatusEnum        @default(UNPAID)
  isPosted          Boolean?                 @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                  @db.Text
  // Metadata
  iStatus           MasterRecordStatusEnum   @default(Active)
  remarks           String?                  @db.VarChar(250)
  createdBy         String?                  @db.Char(10)
  createdAt         DateTime                 @default(now())
  updatedBy         String?                  @db.Char(10)
  updatedAt         DateTime
  // Relations
  subscription      saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company           sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_SubscriptionBilling")
  @@unique([billingNumber], map: "unique_billing_number")
  @@index([subscription_id], map: "idx_billing_subscription")
  @@index([company_id], map: "idx_billing_company")
}

// Usage Tracking (Monitoring Usage per Company)
model saas_UsageTracking {
  id                    String                   @db.Char(30)
  subscription_id       String                   @db.Char(30)
  company_id            String                   @db.Char(5)
  branch_id             String                   @db.Char(10)
  trackingDate          DateTime                 @default(now()) @db.Date
  // Usage Metrics
  totalUsers            Int?                     @default(0)
  totalBranches         Int?                     @default(0)
  totalProducts         Int?                     @default(0)
  totalCustomers        Int?                     @default(0)
  totalVehicles         Int?                     @default(0)
  totalTransactions     Int?                     @default(0)
  storageUsed           Decimal?                 @default(0) @db.Decimal(10, 2) // GB
  // Monthly Counters
  monthlyServiceOrders  Int?                     @default(0)
  monthlyInvoices       Int?                     @default(0)
  monthlyPurchaseOrders Int?                     @default(0)
  // Alert
  isOverLimit           Boolean?                 @default(false)
  alertSent             Boolean?                 @default(false)
  // Metadata
  createdAt             DateTime                 @default(now())
  // Relations
  subscription          saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company               sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_UsageTracking")
  @@index([subscription_id], map: "idx_usage_subscription")
  @@index([company_id], map: "idx_usage_company")
  @@index([trackingDate], map: "idx_usage_date")
}

// Add-on Features (Fitur Tambahan yang bisa dibeli terpisah)
model saas_AddonFeature {
  id                     String                 @db.Char(10)
  addonCode              String                 @db.VarChar(30) // HISTORY, ANALYTICS, API_ACCESS, dll
  name                   String                 @db.VarChar(100)
  category               String?                @db.VarChar(30) // REPORTING, ANALYTICS, INTEGRATION, STORAGE
  description            String?                @db.Text
  description_en         String?                @db.Text
  // Pricing
  monthlyPrice           Decimal                @db.Decimal(21, 4) // Misal: 10000
  yearlyPrice            Decimal?               @db.Decimal(21, 4) // Misal: 96000 (diskon 20%)
  currency               String                 @default("IDR") @db.Char(3)
  // Limits (jika add-on punya limit sendiri)
  additionalLimit        Int? // Misal: +1000 transactions, +10GB storage
  limitType              String?                @db.VarChar(20) // TRANSACTIONS, STORAGE, USERS, dll
  // Availability (add-on bisa dibeli untuk plan tertentu saja)
  availableForLite       Boolean                @default(true)
  availableForPro        Boolean                @default(true)
  availableForEnterprise Boolean                @default(true)
  // Display
  displayOrder           Int?                   @default(0)
  isPopular              Boolean?               @default(false)
  iconName               String?                @db.VarChar(50)
  // Status
  isActive               Boolean                @default(true)
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  // Relations
  companyAddons          saas_CompanyAddon[]

  @@id([id], map: "pk_saas_AddonFeature")
  @@unique([addonCode], map: "unique_addon_code")
}

// Company Addons (Add-on yang diaktifkan per company)
model saas_CompanyAddon {
  id              String                   @db.Char(30)
  subscription_id String                   @db.Char(30)
  company_id      String                   @db.Char(5)
  branch_id       String                   @db.Char(10)
  addon_id        String                   @db.Char(10)
  // Activation
  activatedDate   DateTime                 @default(now())
  expiryDate      DateTime?                @db.Date
  isActive        Boolean                  @default(true)
  // Pricing (bisa custom per company)
  monthlyPrice    Decimal                  @db.Decimal(21, 4)
  yearlyPrice     Decimal?                 @db.Decimal(21, 4)
  // Billing
  lastBilledDate  DateTime?
  nextBillingDate DateTime?
  // Status
  addonStatus     AddonStatusEnum          @default(ACTIVE)
  // Metadata
  iStatus         MasterRecordStatusEnum   @default(Active)
  remarks         String?                  @db.VarChar(250)
  createdBy       String?                  @db.Char(10)
  createdAt       DateTime                 @default(now())
  updatedBy       String?                  @db.Char(10)
  updatedAt       DateTime
  // Relations
  subscription    saas_CompanySubscription @relation(fields: [subscription_id], references: [id], onUpdate: NoAction)
  company         sys_Company              @relation(fields: [company_id], references: [id], onUpdate: NoAction)
  addon           saas_AddonFeature        @relation(fields: [addon_id], references: [id], onUpdate: NoAction)

  @@id([id], map: "pk_saas_CompanyAddon")
  @@index([subscription_id], map: "idx_company_addon_subscription")
  @@index([company_id], map: "idx_company_addon_company")
  @@index([addon_id], map: "idx_company_addon_addon")
}

/// ============================================================================
/// SYSTEM & USER MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage company, user, role, menu, dan permissions

model sys_Company {
  seq_no  Int                    @db.SmallInt
  id      String                 @id @db.Char(5)
  name    String?                @db.VarChar(50)
  iStatus MasterRecordStatusEnum @default(Active)
  isMain  Boolean?               @default(false)

  province         String?                    @db.VarChar(50)
  district         String?                    @db.VarChar(50)
  city             String?                    @db.VarChar(50)
  address1         String?                    @db.VarChar(250)
  address2         String?                    @db.VarChar(250)
  address3         String?                    @db.VarChar(250)
  postalCode       String?                    @db.Char(6)
  phone1           String?                    @db.VarChar(20)
  phone2           String?                    @db.VarChar(20)
  phone3           String?                    @db.VarChar(20)
  mobile1          String?                    @db.VarChar(20)
  mobile2          String?                    @db.VarChar(20)
  mobile3          String?                    @db.VarChar(20)
  email1           String?                    @db.VarChar(100)
  email2           String?                    @db.VarChar(100)
  email3           String?                    @db.VarChar(100)
  officialWebsite  String?                    @db.VarChar(100)
  companyLogo      String?                    @db.VarChar(255)
  createdBy        String?                    @db.Char(10)
  createdAt        DateTime
  updatedBy        String?                    @db.Char(10)
  updatedAt        DateTime
  userCompanyRoles sys_UserCompanyRole[]
  subscriptions    saas_CompanySubscription[]
  billingHistory   saas_SubscriptionBilling[]
  usageTracking    saas_UsageTracking[]
  companyAddons    saas_CompanyAddon[]
  branches         sys_Branch[]

  @@index([seq_no], map: "idx_sys_Company_seq_no")
}

model sys_Branch {
  id         String                 @id @db.Char(10)
  name       String                 @db.VarChar(50)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(255)
  company_id String                 @db.Char(5)
  company    sys_Company            @relation(fields: [company_id], references: [id])

  @@index([company_id], map: "idx_sys_Branch_company_id")
}

model sys_Role {
  id         String                 @id @db.Char(20)
  name       String                 @db.VarChar(20)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(255)
  company_id String?                @db.Char(5)
  branch_id  String?                @db.Char(10)
  userRoles  sys_UserRole[]
}

model sys_WhiteListEmail {
  id        Int      @id @db.SmallInt
  name      String   @db.VarChar(50)
  email     String   @unique @db.VarChar(100)
  createdAt DateTime @default(now())
}

model sys_User {
  id                 Int                     @id @db.SmallInt
  name               String                  @db.VarChar(50)
  email              String                  @unique @db.VarChar(100)
  emailVerified      Boolean                 @default(false)
  emailVerifiedAt    DateTime?
  isAdmin            Boolean                 @default(false)
  iStatus            MasterRecordStatusEnum  @default(Active)
  image              String?                 @db.VarChar(255)
  password           String                  @db.VarChar(255)
  hashedRefreshToken String?                 @db.VarChar(255)
  // Two-Factor Authentication
  twoFactorEnabled   Boolean                 @default(false)
  // Employee Reference (setiap user harus terdaftar sebagai employee)
  employee_id        String?                 @db.Char(20)
  company_id         String?                 @db.Char(5)
  branch_id          String?                 @db.Char(10)
  // Relations
  employee           cmf_Employee?           @relation(fields: [company_id, employee_id], references: [company_id, id], onUpdate: NoAction)
  userRoles          sys_UserRole[]
  sessions           sys_Session[]
  emailVerifications sys_EmailVerification[]
  twoFactorTokens    sys_TwoFactorToken[]
  passwordResets     sys_PasswordReset[]

  @@unique([company_id, employee_id], map: "unique_user_employee")
}

model sys_EmailVerification {
  id         String   @id @default(cuid()) @db.VarChar(50)
  user_id    Int      @db.SmallInt
  token      String   @unique @db.VarChar(255)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model sys_TwoFactorToken {
  id         String   @id @default(cuid()) @db.VarChar(50)
  user_id    Int      @db.SmallInt
  code       String   @db.VarChar(6) // 6-digit OTP
  expiresAt  DateTime
  used       Boolean  @default(false)
  createdAt  DateTime @default(now())
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([code])
}

model sys_PasswordReset {
  id         Int      @id @default(autoincrement())
  user_id    Int      @db.SmallInt
  token      String   @unique @db.VarChar(255)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  used       Boolean  @default(false)
  company_id String?  @db.Char(5)
  branch_id  String?  @db.Char(10)
  // Relations
  user       sys_User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([user_id])
}

model sys_Session {
  id             String                 @id @default(cuid()) @db.VarChar(50)
  user_id        Int                    @db.Integer
  refreshToken   String                 @unique @db.VarChar(500)
  deviceName     String?                @db.VarChar(255)
  deviceType     String?                @db.VarChar(50) // mobile, desktop, tablet
  browser        String?                @db.VarChar(100)
  os             String?                @db.VarChar(100)
  ipAddress      String?                @db.VarChar(45) // IPv6 support
  userAgent      String?                @db.Text
  isActive       Boolean                @default(true)
  lastActivityAt DateTime               @default(now())
  expiresAt      DateTime
  createdAt      DateTime               @default(now())
  revokedAt      DateTime?
  revokedReason  String?                @db.VarChar(255)
  iStatus        MasterRecordStatusEnum @default(Active)
  company_id     String?                @db.Char(5)
  branch_id      String?                @db.Char(10)
  // Relations
  user           sys_User               @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([refreshToken])
  @@index([isActive])
}

model sys_UserRole {
  id            Int                    @id @db.SmallInt
  user_id       Int                    @db.SmallInt
  role_id       String                 @db.Char(20)
  iStatus       MasterRecordStatusEnum @default(Active)
  isDefault     Boolean?               @default(false)
  company_id    String?                @db.Char(5)
  branch_id     String?                @db.Char(10)
  role          sys_Role               @relation(fields: [role_id], references: [id])
  user          sys_User               @relation(fields: [user_id], references: [id])
  userCompanies sys_UserCompanyRole[]

  @@unique([user_id, role_id], map: "unique_user_role")
}

model sys_UserCompanyRole {
  id          Int                    @id @db.SmallInt
  userRole_id Int                    @db.SmallInt
  company_id  String                 @db.Char(5)
  branch_id   String                 @db.Char(10)
  iStatus     MasterRecordStatusEnum @default(Active)
  isDefault   Boolean?               @default(false)

  permissions sys_Menu_Permission[]
  userRole    sys_UserRole          @relation(fields: [userRole_id], references: [id], onDelete: NoAction)
  company     sys_Company           @relation(fields: [company_id], references: [id])

  @@unique([userRole_id, company_id], map: "unique_userRole_company")
}

model sys_Menu {
  id               Int                   @id @db.SmallInt
  parent_id        Int?                  @db.SmallInt
  menu_description String                @db.VarChar(255)
  href             String?               @db.VarChar(255)
  module_id        String                @db.Char(3)
  menu_type        String?               @db.VarChar(50)
  has_child        Boolean               @default(false)
  icon             String?               @db.VarChar(50)
  iStatus          String                @default("1")
  createdBy        String?               @db.Char(10)
  createdAt        DateTime              @default(now())
  updatedBy        String?               @db.Char(10)
  updatedAt        DateTime?
  parent           sys_Menu?             @relation("SubMenu", fields: [parent_id], references: [id], onDelete: NoAction)
  child            sys_Menu[]            @relation("SubMenu")
  permissions      sys_Menu_Permission[] @relation("MenuPermissions")
}

model sys_Menu_Permission {
  id                 Int                    @id @db.Integer
  userCompanyRole_id Int
  menu_id            Int
  can_view           Boolean                @default(false)
  can_create         Boolean                @default(false)
  can_edit           Boolean                @default(false)
  can_delete         Boolean                @default(false)
  can_print          Boolean                @default(false)
  can_approve        Boolean                @default(false)
  iStatus            MasterRecordStatusEnum @default(Active)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime?
  menu               sys_Menu               @relation("MenuPermissions", fields: [menu_id], references: [id], onDelete: NoAction)
  userCompanyRole    sys_UserCompanyRole    @relation(fields: [userCompanyRole_id], references: [id], onDelete: NoAction)

  @@unique([userCompanyRole_id, menu_id])
}

model sys_Migration_log {
  id             Int      @id @default(autoincrement())
  from_tableName String
  to_tableName   String
  migratedAt     DateTime
  status         String
}

// Document Numbering Configuration
model sys_DocumentNumber {
  counterCode    String                 @db.VarChar(10) // PCO, PCR, SO, INV, CR, CP, dll
  description    String?                @db.VarChar(100) // Purchase Order, Service Order, dll
  module         String?                @db.VarChar(20) // PROCUREMENT, SERVICE, ACCOUNTING, dll
  prefix         String?                @db.VarChar(10) // Prefix tambahan (opsional)
  delimiter      String                 @default("/") @db.VarChar(5) // Pemisah: / atau -
  includeYear    Boolean                @default(true) // Include tahun di format
  includeMonth   Boolean                @default(true) // Include bulan di format
  startNumber    Int                    @default(1) // Nomor awal
  currentNumber  Int                    @default(0) // Nomor terakhir yang digunakan
  sequenceLength Int                    @default(5) // Panjang sequence (5 = 00001)
  resetAt        DocumentResetEnum      @default(MONTH) // NEVER, YEAR, MONTH, DAY
  format         String                 @db.VarChar(50) // Template format: {CODE}/{YYYY}/{MM}/{SEQ}
  // Sample Output
  sampleOutput   String?                @db.VarChar(50) // Contoh: PCO/2025/10/00001
  // Status & Metadata
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)

  @@id([company_id, counterCode], map: "pk_sys_DocumentNumber")
  @@unique([company_id, counterCode], map: "unique_counter_code")
  @@index([company_id, module], map: "idx_doc_number_module")
}

/// ============================================================================
/// INVENTORY & WAREHOUSE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage warehouse, lokasi penyimpanan, dan inventory
/// Struktur: Warehouse → Floor → Shelf → Row

model imc_Warehouse {
  id               String                 @id @db.Char(4)
  name             String?                @db.Char(60)
  iMain            Int?
  iStatus          MasterRecordStatusEnum @default(Active)
  address          String?                @db.VarChar(250)
  postalCode       String?                @db.Char(6)
  phone            String?                @db.Char(12)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  floor            imc_Floor[]
  purchaseOrders   prc_PurchaseOrder[]
  purchaseReceives prc_PurchaseReceive[]
  purchaseReturns  prc_PurchaseReturn[]
  sourceMovements  inv_InternalMovement[] @relation("SourceWarehouse")
  destMovements    inv_InternalMovement[] @relation("DestWarehouse")
}

model imc_Floor {
  warehouse_id String                 @db.Char(4)
  id           String                 @id(map: "pk_ic_floor") @db.Char(5)
  name         String?                @db.Char(35)
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  warehouse    imc_Warehouse          @relation(fields: [warehouse_id], references: [id], onDelete: NoAction)
  row          imc_Row[]
  shelf        imc_Shelf[]
}

model imc_Shelf {
  floor_id   String                 @db.Char(5)
  id         String                 @db.Char(15)
  name       String?                @db.Char(35)
  iStatus    MasterRecordStatusEnum @default(Active)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  imc_row    imc_Row[]
  imc_floor  imc_Floor              @relation(fields: [floor_id], references: [id], onDelete: NoAction)

  @@id([floor_id, id], map: "pk_ic_shelf")
  @@unique([floor_id, id], map: "unique_floor_id_shelf_id")
}

model imc_Row {
  floor_id   String                 @db.Char(5)
  shelf_id   String                 @db.Char(15)
  id         String                 @db.Char(15)
  name       String?                @db.Char(35)
  iStatus    MasterRecordStatusEnum @default(Active)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  storages   String?                @db.Char(15)
  floor      imc_Floor              @relation(fields: [floor_id], references: [id], onDelete: NoAction)
  shelf      imc_Shelf              @relation(fields: [floor_id, shelf_id], references: [floor_id, id], onDelete: NoAction)

  @@id([floor_id, shelf_id, id], map: "pk_ic_row")
  @@unique([floor_id, shelf_id, id], map: "unique_floor_id_shelf_id_row_id")
}

/// ============================================================================
/// PRODUCT CATEGORY & UOM MODULE
/// ============================================================================
/// Module untuk manage kategori produk, sub-kategori, brand, dan UOM

model imc_Uom {
  id         String                 @db.Char(10)
  name       String?                @db.VarChar(50)
  iStatus    MasterRecordStatusEnum @default(Active)
  remarks    String?                @db.VarChar(250)
  createdBy  String?                @db.Char(10)
  createdAt  DateTime               @default(now())
  updatedBy  String?                @db.Char(10)
  updatedAt  DateTime
  company_id String                 @db.Char(5)
  branch_id  String                 @db.Char(10)
  products   imc_Product[]

  @@id([company_id, id], map: "pk_imc_Uoms")
}

model imc_CategoryType {
  id           Int                    @id @default(autoincrement()) @db.SmallInt
  name         String?                @db.VarChar(20)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  stock_acct   String?                @db.Char(10)
  sales_acct   String?                @db.Char(10)
  cogs_acct    String?                @db.Char(10)
  expense_acct String?                @db.Char(10)
  asset_acct   String?                @db.Char(10)
  company_id   String                 @db.Char(5)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime?              @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime?
  branch_id    String?                @db.Char(10)
  categories   imc_Category[]
}

model imc_Category {
  type          Int                    @db.SmallInt
  id            String                 @db.Char(10)
  name          String?                @db.VarChar(80)
  seq           Int?                   @default(0)
  remarks       String?                @db.VarChar(250)
  iStatus       MasterRecordStatusEnum @default(Active)
  imageURL      String?                @db.VarChar(250)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  href          String?                @db.VarChar(150)
  icon          String?                @db.VarChar(50)
  categoryType  imc_CategoryType       @relation(fields: [type], references: [id], onUpdate: NoAction)
  products      imc_Product[]
  subCategories imc_SubCategory[]
  // keywords      cms_subCategoriesKeywords[]

  @@id([company_id, id], map: "pk_imc_Categories")
  @@unique([company_id, id], map: "company_id_id")
}

model imc_SubCategory {
  id           String                 @db.Char(10)
  seq          Int?                   @default(0)
  imageURL     String?                @db.VarChar(250)
  category_id  String                 @db.Char(10)
  name         String                 @db.VarChar(80)
  descriptions String?                @db.VarChar(250)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  category     imc_Category           @relation(fields: [company_id, category_id], references: [company_id, id])
  products     imc_Product[]

  @@id([company_id, category_id, id], map: "pk_imc_SubCategories")
}

model imc_Brand {
  id           String                 @db.Char(10)
  name         String                 @db.VarChar(50)
  slug         String?                @db.VarChar(50)
  iStatus      MasterRecordStatusEnum @default(Active)
  remarks      String?                @db.VarChar(250)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  updatedBy    String?                @db.Char(10)
  updatedAt    DateTime
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  imc_Products imc_Product[]

  @@id([company_id, id], map: "pk_imc_Brands")
}

model imc_Product {
  id                      String                       @db.Char(20)
  register_id             String?                      @db.Char(20)
  catalog_id              String?                      @db.Char(20)
  name                    String                       @db.VarChar(250)
  category_id             String                       @db.Char(10)
  subCategory_id          String                       @db.Char(10)
  brand_id                String                       @db.Char(10)
  uom_id                  String                       @db.Char(10)
  eCatalogURL             String?                      @db.VarChar(250)
  remarks                 String?                      @db.VarChar(250)
  iStatus                 MasterRecordStatusEnum       @default(Active)
  isMaterial              Boolean                      @default(false)
  isService               Boolean                      @default(false)
  isFeatured              Boolean?                     @default(false)
  isFinishing             Boolean                      @default(false)
  isAccessories           Boolean                      @default(false)
  createdBy               String?                      @db.Char(50)
  createdAt               DateTime                     @default(now())
  updatedBy               String?                      @db.Char(50)
  updatedAt               DateTime
  company_id              String                       @db.Char(5)
  branch_id               String                       @db.Char(10)
  category                imc_Category                 @relation(fields: [company_id, category_id], references: [company_id, id], onUpdate: NoAction)
  subCategory             imc_SubCategory              @relation(fields: [company_id, category_id, subCategory_id], references: [company_id, category_id, id], onUpdate: NoAction)
  uom                     imc_Uom                      @relation(fields: [company_id, uom_id], references: [company_id, id], onUpdate: NoAction)
  brand                   imc_Brand                    @relation(fields: [company_id, brand_id], references: [company_id, id], onUpdate: NoAction)
  images                  imc_ProductImage[]
  productStock            imc_ProductStock[]
  productVariants         imc_ProductVariant[]
  productVariantTypes     imc_ProductVariantType[]
  serviceOrderDetails     wks_ServiceOrderDetail[]
  purchaseOrderDetails    prc_PurchaseOrderDetail[]
  purchaseReceiveDetails  prc_PurchaseReceiveDetail[]
  internalMovementDetails inv_InternalMovementDetail[]
  apInvoiceDetails        apm_InvoiceDetail[]
  purchaseReturnDetails   prc_PurchaseReturnDetail[]

  @@id([company_id, id], map: "pk_imc_Products")
  @@unique([company_id, id], map: "unique_company_id_id")
}

model imc_ProductStock {
  id                 String                 @db.Char(20)
  iStatus            MasterRecordStatusEnum @default(Active)
  warehouse_id       String                 @db.Char(4)
  floor_id           String                 @db.Char(5)
  shelf_id           String                 @db.Char(15)
  row_id             String                 @db.Char(15)
  batch_no           String?                @db.Char(20)
  mExpired_dt        String                 @db.Char(10)
  yExpired_dt        String                 @db.Char(4)
  product_cd         String?                @db.Char(20)
  i_month_expired    Int?
  i_year_expired     Int?
  req_qty            Decimal?               @db.Decimal(12, 4)
  po_qty             Decimal?               @db.Decimal(12, 4)
  grn_qty            Decimal?               @db.Decimal(12, 4)
  so_qty             Decimal?               @db.Decimal(12, 4)
  spk_qty            Decimal?               @db.Decimal(12, 4)
  sj_qty             Decimal?               @db.Decimal(12, 4)
  sl_invoice_qty     Decimal?               @db.Decimal(12, 4)
  sl_return_qty      Decimal?               @db.Decimal(12, 4)
  po_return_qty      Decimal?               @db.Decimal(12, 4)
  stock_opname_qty   Decimal?               @db.Decimal(12, 4)
  intern_receive_qty Decimal?               @db.Decimal(12, 4)
  intern_issue_qty   Decimal?               @db.Decimal(12, 4)
  onhand_qty         Decimal?               @db.Decimal(22, 4)
  unit_cost          Decimal?               @db.Decimal(21, 4)
  selling_price      Decimal?               @db.Decimal(21, 4)
  createdBy          String?                @db.Char(50)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(50)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  products           imc_Product            @relation(fields: [id, company_id], references: [id, company_id], onUpdate: NoAction)

  @@id([id, floor_id, shelf_id, row_id, mExpired_dt, yExpired_dt, warehouse_id, company_id])
}

model imc_ProductStockCard {
  customer_or_supplier_id String                 @db.Char(20)
  trx_id                  String                 @db.Char(2)
  trx_class               String                 @db.Char(2)
  module_id               String                 @db.Char(2)
  is_in_or_out            String                 @db.Char(1)
  doc_year                Int                    @db.SmallInt
  doc_month               Int                    @db.SmallInt
  doc_date                DateTime
  doc_id                  String                 @db.Char(20)
  descs                   String?                @db.VarChar(250)
  mutation_id             String                 @db.Char(20)
  mutation_date           DateTime
  ref_id                  String                 @db.Char(20)
  ref_date                DateTime
  iStatus                 MasterRecordStatusEnum @default(Active)
  warehouse_id            String                 @db.Char(4)
  to_warehouse_id         String                 @db.Char(4)
  srn_seq                 Int                    @db.SmallInt
  product_id              String                 @db.Char(20)
  qty                     Decimal                @db.Decimal(12, 4)
  mutation_qty            Decimal                @db.Decimal(12, 4)
  unit_cost               Decimal?               @db.Decimal(21, 4)
  mutation_cost           Decimal?               @db.Decimal(21, 4)
  floor_id                String                 @db.Char(5)
  shelf_id                String                 @db.Char(15)
  row_id                  String                 @db.Char(15)
  batch_no_item           String                 @db.Char(20)
  mExpired_dt             String                 @db.Char(10)
  yExpired_dt             String                 @db.Char(4)
  product_cd              String?                @db.Char(20)
  i_month_expired         Int?                   @db.SmallInt
  i_year_expired          Int?
  selling_price           Decimal?               @db.Decimal(21, 4)
  createdBy               String?                @db.Char(50)
  createdAt               DateTime               @default(now())
  updatedBy               String?                @db.Char(50)
  updatedAt               DateTime
  company_id              String                 @db.Char(5)
  branch_id               String                 @db.Char(10)

  @@id([product_id, floor_id, shelf_id, row_id, mExpired_dt, yExpired_dt, doc_id, mutation_id, srn_seq, batch_no_item, warehouse_id, company_id])
}

model imc_ProductImage {
  id         String      @db.Char(150)
  product_id String      @db.Char(20)
  imageURL   String      @db.VarChar(250)
  isPrimary  Boolean
  isBrochure Boolean?
  seq        Int?
  isVideo    Boolean?    @default(false)
  // iStatus     MasterRecordStatusEnum @default(Active)
  createdBy  String?     @db.Char(10)
  createdAt  DateTime    @default(now())
  updatedBy  String      @db.Char(10)
  updatedAt  DateTime
  company_id String      @db.Char(5)
  branch_id  String      @db.Char(10)
  products   imc_Product @relation(fields: [product_id, company_id], references: [id, company_id], onUpdate: NoAction)
  // cms_Product cms_Product[]

  @@id([product_id, company_id, id], map: "pk_imc_ProductImages")
}

/// ============================================================================
/// PRODUCT VARIANT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage variant produk bengkel otomotif
/// Menangani variant seperti: warna, ukuran, model, spesifikasi, dll
/// Struktur: VariantType → VariantOption → ProductVariant → ProductVariantOption

// Master Tipe Variant (Warna, Ukuran, Model, dll)
model imc_VariantType {
  id                  String                   @db.Char(10)
  name                String                   @db.VarChar(50) // Warna, Ukuran, Model, Tahun, Spesifikasi
  iStatus             MasterRecordStatusEnum   @default(Active)
  remarks             String?                  @db.VarChar(250)
  seq                 Int?                     @default(0) // urutan tampilan
  createdBy           String?                  @db.Char(10)
  createdAt           DateTime                 @default(now())
  updatedBy           String?                  @db.Char(10)
  updatedAt           DateTime
  company_id          String                   @db.Char(5)
  branch_id           String                   @db.Char(10)
  variantOptions      imc_VariantOption[]
  productVariantTypes imc_ProductVariantType[]

  @@id([company_id, id], map: "pk_imc_VariantType")
}

// Master Opsi Variant (Merah, Biru, S, M, L, dll)
model imc_VariantOption {
  id                    String                     @db.Char(15)
  variantType_id        String                     @db.Char(10)
  name                  String                     @db.VarChar(100) // Merah, Biru, 15 inch, Model X, 2024, dll
  code                  String?                    @db.Char(20) // kode untuk referensi, misal: RED, BLU, SIZE-15
  hexColorCode          String?                    @db.Char(7) // untuk warna: #FF0000
  imageURL              String?                    @db.VarChar(250) // gambar sample variant
  iStatus               MasterRecordStatusEnum     @default(Active)
  remarks               String?                    @db.VarChar(250)
  seq                   Int?                       @default(0)
  createdBy             String?                    @db.Char(10)
  createdAt             DateTime                   @default(now())
  updatedBy             String?                    @db.Char(10)
  updatedAt             DateTime
  company_id            String                     @db.Char(5)
  branch_id             String                     @db.Char(10)
  variantType           imc_VariantType            @relation(fields: [company_id, variantType_id], references: [company_id, id], onUpdate: NoAction)
  productVariantOptions imc_ProductVariantOption[]

  @@id([company_id, variantType_id, id], map: "pk_imc_VariantOption")
}

// Definisi tipe variant apa saja yang dimiliki suatu produk
model imc_ProductVariantType {
  product_id     String                 @db.Char(20)
  variantType_id String                 @db.Char(10)
  isRequired     Boolean                @default(true) // apakah variant ini wajib dipilih
  seq            Int?                   @default(0) // urutan tampilan variant
  iStatus        MasterRecordStatusEnum @default(Active)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  product        imc_Product            @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  variantType    imc_VariantType        @relation(fields: [company_id, variantType_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, variantType_id], map: "pk_imc_ProductVariantType")
}

// SKU Variant Produk (kombinasi produk dengan variant options)
model imc_ProductVariant {
  id              String                     @db.Char(30) // SKU unique identifier
  product_id      String                     @db.Char(20)
  sku             String                     @db.VarChar(50) // SKU code, misal: PROD-001-RED-M
  barcode         String?                    @db.VarChar(50) // barcode untuk variant ini
  name            String?                    @db.VarChar(250) // nama variant, misal: "Product A - Merah - Size M"
  additionalPrice Decimal?                   @db.Decimal(21, 4) // harga tambahan untuk variant ini
  stockQty        Decimal?                   @db.Decimal(12, 4) // stock khusus variant ini
  weight          Decimal?                   @db.Decimal(10, 2) // berat (kg)
  length          Decimal?                   @db.Decimal(10, 2) // panjang (cm)
  width           Decimal?                   @db.Decimal(10, 2) // lebar (cm)
  height          Decimal?                   @db.Decimal(10, 2) // tinggi (cm)
  imageURL        String?                    @db.VarChar(250) // gambar utama variant
  iStatus         MasterRecordStatusEnum     @default(Active)
  isDefault       Boolean?                   @default(false) // variant default
  remarks         String?                    @db.VarChar(250)
  createdBy       String?                    @db.Char(10)
  createdAt       DateTime                   @default(now())
  updatedBy       String?                    @db.Char(10)
  updatedAt       DateTime
  company_id      String                     @db.Char(5)
  branch_id       String                     @db.Char(10)
  product         imc_Product                @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  variantOptions  imc_ProductVariantOption[]
  variantImages   imc_ProductVariantImage[]

  @@id([company_id, product_id, id], map: "pk_imc_ProductVariant")
  @@unique([company_id, sku], map: "unique_sku")
}

// Relasi antara Product Variant dengan Variant Options yang dipilih
model imc_ProductVariantOption {
  productVariant_id String             @db.Char(30)
  product_id        String             @db.Char(20)
  variantType_id    String             @db.Char(10)
  variantOption_id  String             @db.Char(15)
  company_id        String             @db.Char(5)
  branch_id         String             @db.Char(10)
  productVariant    imc_ProductVariant @relation(fields: [company_id, product_id, productVariant_id], references: [company_id, product_id, id], onUpdate: NoAction)
  variantOption     imc_VariantOption  @relation(fields: [company_id, variantType_id, variantOption_id], references: [company_id, variantType_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, productVariant_id, variantType_id, variantOption_id], map: "pk_imc_ProductVariantOption")
}

// Gambar-gambar untuk Product Variant
model imc_ProductVariantImage {
  id                String                 @db.Char(150)
  productVariant_id String                 @db.Char(30)
  product_id        String                 @db.Char(20)
  imageURL          String                 @db.VarChar(250)
  isPrimary         Boolean                @default(false)
  seq               Int?                   @default(0)
  isVideo           Boolean?               @default(false)
  iStatus           MasterRecordStatusEnum @default(Active)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  updatedBy         String?                @db.Char(10)
  updatedAt         DateTime
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  productVariant    imc_ProductVariant     @relation(fields: [company_id, product_id, productVariant_id], references: [company_id, product_id, id], onUpdate: NoAction)

  @@id([company_id, product_id, productVariant_id, id], map: "pk_imc_ProductVariantImage")
}

/// ============================================================================
/// CUSTOMER & VEHICLE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage customer (Individual & Corporate) dan kendaraan
/// Support multi-vehicle per customer dan fleet management
/// Struktur: VehicleType → VehicleBrand → VehicleModel → CustomerVehicle

// Master Employee - Semua person di bengkel
// Digunakan untuk: User Login, Mechanic, Payroll, Attendance
model cmf_Employee {
  id               String                 @db.Char(20) // Manual: EMP-001, EMP-002, dst
  employeeCode     String                 @db.VarChar(20) // Kode pegawai internal
  name             String                 @db.VarChar(100)
  nickname         String?                @db.VarChar(50)
  email            String?                @unique @db.VarChar(100)
  mobile           String?                @db.VarChar(20)
  phone            String?                @db.VarChar(20)
  // Personal Info
  birthDate        DateTime?              @db.Date
  gender           String?                @db.Char(1) // M/F
  identityNumber   String?                @db.VarChar(30) // KTP/Passport
  taxNumber        String?                @db.VarChar(30) // NPWP
  // Address
  address          String?                @db.VarChar(250)
  city             String?                @db.VarChar(50)
  province         String?                @db.VarChar(50)
  postalCode       String?                @db.Char(6)
  // Employment Info
  joinDate         DateTime?              @db.Date
  resignDate       DateTime?              @db.Date
  employmentStatus String?                @db.VarChar(20) // Permanent, Contract, Freelance
  department       String?                @db.VarChar(50) // Service, Sales, Admin, Finance
  position         String?                @db.VarChar(50) // Mechanic, Admin, Manager, Cashier
  // Bank Info (untuk payroll)
  bankName         String?                @db.VarChar(50)
  bankAccountNo    String?                @db.VarChar(30)
  bankAccountName  String?                @db.VarChar(100)
  // Photo
  photoURL         String?                @db.VarChar(250)
  // Status
  iStatus          MasterRecordStatusEnum @default(Active)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  user             sys_User?
  mechanic         cmf_Mechanic?

  @@id([company_id, id], map: "pk_cmf_Employee")
  @@unique([company_id, employeeCode], map: "unique_employee_code")
  @@index([company_id, name], map: "idx_employee_name")
  @@index([company_id, department], map: "idx_employee_department")
}

// Master Tipe Kendaraan (Mobil, Motor, Truk, dll)
model wks_VehicleType {
  id        String                 @db.Char(5)
  name      String                 @db.VarChar(50) // Mobil, Motor, Truk, Bus, dll
  iStatus   MasterRecordStatusEnum @default(Active)
  remarks   String?                @db.VarChar(250)
  seq       Int?                   @default(0)
  createdBy String?                @db.Char(10)
  createdAt DateTime               @default(now())
  updatedBy String?                @db.Char(10)
  updatedAt DateTime
  brands    wks_VehicleBrand[]

  @@id([id], map: "pk_wks_VehicleType")
}

// Master Merk Kendaraan (Toyota, Honda, Yamaha, dll)
model wks_VehicleBrand {
  id             String                 @db.Char(10)
  vehicleType_id String                 @db.Char(5)
  name           String                 @db.VarChar(50) // Toyota, Honda, Suzuki, Yamaha, dll
  slug           String?                @db.VarChar(50)
  logoURL        String?                @db.VarChar(250)
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  seq            Int?                   @default(0)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  vehicleType    wks_VehicleType        @relation(fields: [vehicleType_id], references: [id], onUpdate: NoAction)
  models         wks_VehicleModel[]
  vehicles       cmf_CustomerVehicle[]

  @@id([vehicleType_id, id], map: "pk_wks_VehicleBrand")
}

// Master Model Kendaraan (Avanza, Xenia, Vario, Beat, dll)
model wks_VehicleModel {
  id             String                 @db.Char(15)
  vehicleType_id String                 @db.Char(5)
  brand_id       String                 @db.Char(10)
  name           String                 @db.VarChar(100) // Avanza, Xenia, Vario 125, Beat, Innova, dll
  slug           String?                @db.VarChar(100)
  imageURL       String?                @db.VarChar(250)
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  seq            Int?                   @default(0)
  // Spesifikasi umum (opsional)
  engineType     String?                @db.VarChar(50) // Bensin, Diesel, Elektrik, Hybrid
  transmission   String?                @db.VarChar(30) // Manual, Automatic, CVT
  fuelType       String?                @db.VarChar(30) // Premium, Pertalite, Pertamax, Solar
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime

  brand    wks_VehicleBrand      @relation(fields: [vehicleType_id, brand_id], references: [vehicleType_id, id], onUpdate: NoAction)
  vehicles cmf_CustomerVehicle[]

  @@id([vehicleType_id, brand_id, id], map: "pk_wks_VehicleModel")
}

// Master Customer
model cmf_Customer {
  id                        String                      @db.Char(20)
  customerType              CustomerTypeEnum            @default(INDIVIDUAL) // Individual atau Corporate
  // Data Personal/Corporate
  name                      String                      @db.VarChar(100) // Nama lengkap atau nama perusahaan
  legalName                 String?                     @db.VarChar(150) // Nama legal perusahaan (untuk corporate)
  nickname                  String?                     @db.VarChar(50)
  email                     String?                     @db.VarChar(100)
  phone1                    String?                     @db.VarChar(20)
  phone2                    String?                     @db.VarChar(20)
  mobile1                   String                      @db.VarChar(20)
  mobile2                   String?                     @db.VarChar(20)
  website                   String?                     @db.VarChar(100)
  // Corporate Specific
  companyRegistrationNumber String?                     @db.VarChar(50) // SIUP, TDP, NIB
  businessType              String?                     @db.VarChar(50) // PT, CV, Firma, Yayasan, Pemerintah
  industryType              String?                     @db.VarChar(50) // Manufacturing, Service, Retail, Automotive
  companySize               String?                     @db.VarChar(20) // Small, Medium, Large, Enterprise
  numberOfEmployees         Int?                        @db.SmallInt
  numberOfVehicles          Int?                        @db.SmallInt // Jumlah armada (untuk fleet)
  // Alamat
  province                  String?                     @db.VarChar(50)
  district                  String?                     @db.VarChar(50)
  city                      String?                     @db.VarChar(50)
  subDistrict               String?                     @db.VarChar(50)
  address1                  String?                     @db.VarChar(250)
  address2                  String?                     @db.VarChar(250)
  postalCode                String?                     @db.Char(6)
  // Billing Address (untuk corporate - bisa beda dengan alamat utama)
  billingProvince           String?                     @db.VarChar(50)
  billingDistrict           String?                     @db.VarChar(50)
  billingCity               String?                     @db.VarChar(50)
  billingSubDistrict        String?                     @db.VarChar(50)
  billingAddress1           String?                     @db.VarChar(250)
  billingAddress2           String?                     @db.VarChar(250)
  billingPostalCode         String?                     @db.Char(6)
  // Data Identitas
  idCardType                String?                     @db.VarChar(20) // KTP, SIM, Passport (untuk individual)
  idCardNumber              String?                     @db.VarChar(30)
  taxNumber                 String?                     @db.VarChar(30) // NPWP
  taxName                   String?                     @db.VarChar(150) // Nama di NPWP (bisa beda)
  taxAddress                String?                     @db.VarChar(250) // Alamat di NPWP
  // Data Lainnya
  birthDate                 DateTime?                   @db.Date
  gender                    GenderEnum?
  occupation                String?                     @db.VarChar(50)
  customerSince             DateTime?                   @default(now())
  // Membership/Loyalty
  membershipLevel           String?                     @db.VarChar(20) // Regular, Silver, Gold, Platinum
  loyaltyPoints             Int?                        @default(0)
  totalTransaction          Decimal?                    @default(0) @db.Decimal(21, 4)
  lastVisitDate             DateTime?
  // Credit & Payment Terms (untuk corporate)
  paymentTermDays           Int?                        @db.SmallInt // NET 30, NET 60, dll
  creditLimit               Decimal?                    @db.Decimal(21, 4)
  currentDebt               Decimal?                    @default(0) @db.Decimal(21, 4)
  isCOD                     Boolean?                    @default(true) // Cash on Delivery
  // Status & Metadata
  iStatus                   MasterRecordStatusEnum      @default(Active)
  isBlacklisted             Boolean?                    @default(false)
  blacklistReason           String?                     @db.VarChar(250)
  remarks                   String?                     @db.VarChar(250)
  profileImageURL           String?                     @db.VarChar(250)
  createdBy                 String?                     @db.Char(10)
  createdAt                 DateTime                    @default(now())
  updatedBy                 String?                     @db.Char(10)
  updatedAt                 DateTime
  company_id                String                      @db.Char(5)
  branch_id                 String                      @db.Char(10)
  // Relations
  vehicles                  cmf_CustomerVehicle[]
  serviceOrders             wks_ServiceOrder[]
  serviceHistory            wks_ServiceHistory[]
  complaints                wks_CustomerComplaint[]
  invoices                  arm_Invoice[]
  payments                  arm_Payment[]
  contactPersons            cmf_CustomerContactPerson[]
  serviceReworks            wks_ServiceRework[]
  creditNotes               arm_CreditNote[]
  wks_ServiceBooking        wks_ServiceBooking[]

  @@id([company_id, id], map: "pk_cmf_Customer")
  @@unique([company_id, mobile1], map: "unique_customer_mobile")
  @@index([company_id, name], map: "idx_customer_name")
  @@index([company_id, email], map: "idx_customer_email")
}

// Contact Person untuk Corporate Customer
model cmf_CustomerContactPerson {
  id            String                 @db.Char(20)
  customer_id   String                 @db.Char(20)
  // Personal Info
  name          String                 @db.VarChar(100)
  position      String?                @db.VarChar(50) // Purchasing Manager, Fleet Manager, Finance, dll
  department    String?                @db.VarChar(50) // Purchasing, Finance, Operasional, dll
  // Contact Info
  email         String?                @db.VarChar(100)
  phone         String?                @db.VarChar(20)
  mobile        String?                @db.VarChar(20)
  whatsapp      String?                @db.VarChar(20)
  // Authority
  isPrimary     Boolean?               @default(false) // Kontak utama
  canApprove    Boolean?               @default(false) // Bisa approve PO/invoice
  canOrder      Boolean?               @default(false) // Bisa order service
  approvalLimit Decimal?               @db.Decimal(21, 4) // Limit approval
  // Status & Metadata
  iStatus       MasterRecordStatusEnum @default(Active)
  remarks       String?                @db.VarChar(250)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  // Relations
  customer      cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, customer_id, id], map: "pk_cmf_CustomerContactPerson")
  @@index([company_id, customer_id], map: "idx_contact_person")
}

// Kendaraan yang dimiliki Customer
model cmf_CustomerVehicle {
  id                  String                  @db.Char(20)
  customer_id         String                  @db.Char(20)
  vehicleType_id      String                  @db.Char(5)
  brand_id            String                  @db.Char(10)
  model_id            String                  @db.Char(15)
  // Data Kendaraan
  licensePlate        String                  @db.VarChar(15) // Nomor Polisi (PLAT)
  vehicleYear         Int?                    @db.SmallInt // Tahun Kendaraan
  color               String?                 @db.VarChar(30)
  chassisNumber       String?                 @db.VarChar(30) // Nomor Rangka
  engineNumber        String?                 @db.VarChar(30) // Nomor Mesin
  // Informasi STNK/BPKB
  registrationNumber  String?                 @db.VarChar(30) // Nomor STNK
  ownershipDocument   String?                 @db.VarChar(30) // Nomor BPKB
  registrationExpiry  DateTime?               @db.Date // Tanggal habis STNK
  // Spesifikasi Teknis
  transmission        String?                 @db.VarChar(30) // Manual, Automatic, CVT
  fuelType            String?                 @db.VarChar(30) // Premium, Pertalite, Pertamax, Solar, Elektrik
  engineCapacity      String?                 @db.VarChar(20) // cc (misal: 1500cc, 150cc)
  // Odometer & Service
  currentOdometer     Int?                    @default(0) // Kilometer terakhir
  lastServiceDate     DateTime?
  lastServiceOdometer Int?
  nextServiceOdometer Int? // Reminder service berikutnya
  nextServiceDate     DateTime? // Reminder service berikutnya
  // Data Lainnya
  purchaseDate        DateTime?               @db.Date // Tanggal beli kendaraan
  insuranceProvider   String?                 @db.VarChar(50) // Asuransi
  insurancePolicyNo   String?                 @db.VarChar(30)
  insuranceExpiry     DateTime?               @db.Date
  // Status & Metadata
  iStatus             MasterRecordStatusEnum  @default(Active)
  isPrimary           Boolean?                @default(false) // Kendaraan utama customer
  remarks             String?                 @db.VarChar(250)
  vehicleImageURL     String?                 @db.VarChar(250)
  createdBy           String?                 @db.Char(10)
  createdAt           DateTime                @default(now())
  updatedBy           String?                 @db.Char(10)
  updatedAt           DateTime
  company_id          String                  @db.Char(5)
  branch_id           String                  @db.Char(10)
  // Relations
  customer            cmf_Customer            @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  brand               wks_VehicleBrand        @relation(fields: [vehicleType_id, brand_id], references: [vehicleType_id, id], onUpdate: NoAction)
  model               wks_VehicleModel        @relation(fields: [vehicleType_id, brand_id, model_id], references: [vehicleType_id, brand_id, id], onUpdate: NoAction)
  serviceOrders       wks_ServiceOrder[]
  serviceHistory      wks_ServiceHistory[]
  complaints          wks_CustomerComplaint[]
  invoices            arm_Invoice[]
  serviceReworks      wks_ServiceRework[]
  creditNotes         arm_CreditNote[]
  wks_ServiceBooking  wks_ServiceBooking[]

  @@id([company_id, customer_id, id], map: "pk_cmf_CustomerVehicle")
  @@unique([company_id, licensePlate], map: "unique_license_plate")
  @@index([company_id, customer_id], map: "idx_customer_vehicles")
  @@index([company_id, licensePlate], map: "idx_license_plate")
}

/// ============================================================================
/// SERVICE MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage service order, mekanik, service bay, dan history
/// Flow: ServiceOrder → ServiceOrderDetail → ServiceHistory
/// Support: QC check, customer rating, mechanic assignment

// Master Tipe Service (Service Rutin, Ganti Oli, Tune Up, dll)
model wks_ServiceType {
  id                  String                   @db.Char(10)
  name                String                   @db.VarChar(100) // Service Rutin, Ganti Oli, Tune Up, Body Repair, dll
  category            ServiceCategoryEnum? // MAINTENANCE, REPAIR, BODYWORK, WASH, INSPECTION
  description         String?                  @db.VarChar(250)
  estimatedTime       Int? // Estimasi waktu dalam menit
  defaultPrice        Decimal?                 @db.Decimal(21, 4) // Harga standar
  iStatus             MasterRecordStatusEnum   @default(Active)
  remarks             String?                  @db.VarChar(250)
  seq                 Int?                     @default(0)
  createdBy           String?                  @db.Char(10)
  createdAt           DateTime                 @default(now())
  updatedBy           String?                  @db.Char(10)
  updatedAt           DateTime
  company_id          String                   @db.Char(5)
  branch_id           String                   @db.Char(10)
  serviceOrderDetails wks_ServiceOrderDetail[]
  wks_ServiceBooking  wks_ServiceBooking[]

  @@id([company_id, id], map: "pk_wks_ServiceType")
}

// Master Mekanik/Teknisi
// Mechanic Profile - Extended dari cmf_Employee
model cmf_Mechanic {
  id                       String                     @db.Char(10)
  employee_id              String                     @db.Char(20) // Reference ke cmf_Employee
  specialization           String?                    @db.VarChar(100) // Mesin, Body, Elektrik, AC, dll
  level                    MechanicLevelEnum?         @default(JUNIOR) // JUNIOR, SENIOR, MASTER, FOREMAN
  // Performance Tracking
  totalJobs                Int?                       @default(0)
  averageRating            Decimal?                   @db.Decimal(3, 2) // Rating 0.00 - 5.00
  // Status
  iStatus                  MasterRecordStatusEnum     @default(Active)
  isAvailable              Boolean?                   @default(true)
  remarks                  String?                    @db.VarChar(250)
  createdBy                String?                    @db.Char(10)
  createdAt                DateTime                   @default(now())
  updatedBy                String?                    @db.Char(10)
  updatedAt                DateTime
  company_id               String                     @db.Char(5)
  branch_id                String                     @db.Char(10)
  // Relations
  employee                 cmf_Employee               @relation(fields: [company_id, employee_id], references: [company_id, id], onUpdate: NoAction)
  serviceOrders            wks_ServiceOrder[]
  serviceOrderDetails      wks_ServiceOrderDetail[]
  serviceReworks           wks_ServiceRework[]
  wks_MechanicAvailability wks_MechanicAvailability[]
  wks_ServiceBooking       wks_ServiceBooking[]

  @@id([company_id, id], map: "pk_cmf_Mechanic")
  @@unique([company_id, employee_id], map: "unique_mechanic_employee")
  @@index([company_id, specialization], map: "idx_mechanic_specialization")
}

// Master Service Bay/Stall (Tempat Service)
model wks_ServiceBay {
  id                 String                 @db.Char(10)
  name               String                 @db.VarChar(50) // Bay 1, Bay 2, Stall A, dll
  bayType            ServiceBayTypeEnum? // GENERAL, HEAVY_DUTY, QUICK_SERVICE, BODYWORK, WASH
  capacity           Int?                   @default(1) // Jumlah kendaraan yang muat
  iStatus            MasterRecordStatusEnum @default(Active)
  isOccupied         Boolean?               @default(false)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  serviceOrders      wks_ServiceOrder[]
  serviceReworks     wks_ServiceRework[]
  wks_BayBlock       wks_BayBlock[]
  wks_BookingSlot    wks_BookingSlot[]
  wks_ServiceBooking wks_ServiceBooking[]

  @@id([company_id, id], map: "pk_wks_ServiceBay")
}

// ============================================================================
// SERVICE BOOKING & SCHEDULING
// ============================================================================

enum BookingStatusEnum {
  PENDING    @map("0") // Baru dibuat, menunggu konfirmasi
  CONFIRMED  @map("1") // Sudah dikonfirmasi dan terjadwal
  CHECKED_IN @map("2") // Customer sudah datang
  IN_SERVICE @map("3") // Sedang dikerjakan
  COMPLETED  @map("4") // Selesai (biasanya lanjut ke Service Order)
  NO_SHOW    @map("5") // Customer tidak datang
  CANCELLED  @map("9") // Dibatalkan
}

enum BookingSourceEnum {
  WEB    @map("WEB")
  APP    @map("APP")
  PHONE  @map("PHONE")
  WALKIN @map("WALKIN")
}

enum SlotStatusEnum {
  OPEN    @map("OPEN") // Slot tersedia
  BLOCKED @map("BLOCKED") // Ditutup (maintenance/libur)
  FULL    @map("FULL") // Penuh (kapasitas terpenuhi)
}

// Jam kerja per hari (per branch)
model wks_BranchWorkingHour {
  company_id String  @db.Char(5)
  branch_id  String  @db.Char(10)
  weekday    Int     @db.SmallInt // 0=Sun, 1=Mon, ... 6=Sat
  isOpen     Boolean @default(true)
  openTime   String? @db.Char(5) // "08:00"
  closeTime  String? @db.Char(5) // "17:00"
  bookingBufferMinutes Int? @default(0) // buffer antar booking dalam menit
  remarks    String? @db.VarChar(250)

  @@id([company_id, branch_id, weekday], map: "pk_wks_BranchWorkingHour")
  @@index([company_id, branch_id], map: "idx_branch_workinghour_branch")
}

// Hari libur/pengecualian jadwal (per branch)
model wks_BranchHoliday {
  id         String   @db.Char(20)
  company_id String   @db.Char(5)
  branch_id  String?  @db.Char(10)
  date       DateTime @db.Date
  name       String?  @db.VarChar(100)
  isClosed   Boolean  @default(true)
  remarks    String?  @db.VarChar(250)
  createdAt  DateTime @default(now())

  @@id([company_id, id], map: "pk_wks_BranchHoliday")
  @@index([company_id, branch_id, date], map: "idx_branch_holiday_date")
}

// Ketersediaan mekanik per tanggal (override jam kerja umum)
model wks_MechanicAvailability {
  id             String   @db.Char(20)
  company_id     String   @db.Char(5)
  mechanic_id    String   @db.Char(10)
  date           DateTime @db.Date
  availableStart String?  @db.Char(5) // "09:00"
  availableEnd   String?  @db.Char(5) // "16:00"
  isAvailable    Boolean  @default(true)
  reason         String?  @db.VarChar(100) // Cuti, Training, Sakit, dll
  remarks        String?  @db.VarChar(250)
  createdAt      DateTime @default(now())

  mechanic cmf_Mechanic @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_MechanicAvailability")
  @@index([company_id, mechanic_id, date], map: "idx_mechanic_availability_date")
}

// Blokir bay (maintenance, cleaning, dipakai internal, dll)
model wks_BayBlock {
  id         String   @db.Char(20)
  company_id String   @db.Char(5)
  branch_id  String   @db.Char(10)
  bay_id     String   @db.Char(10)
  startTime  DateTime
  endTime    DateTime
  reason     String?  @db.VarChar(100)
  remarks    String?  @db.VarChar(250)
  createdAt  DateTime @default(now())

  bay wks_ServiceBay @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_BayBlock")
  @@index([company_id, branch_id, bay_id, startTime, endTime], map: "idx_bayblock_range")
}

// Slot jadwal opsional (untuk pre-generate time slots per cabang/bay)
model wks_BookingSlot {
  id          String         @db.Char(20)
  company_id  String         @db.Char(5)
  branch_id   String         @db.Char(10)
  bay_id      String?        @db.Char(10)
  date        DateTime       @db.Date
  startTime   DateTime
  endTime     DateTime
  capacity    Int            @default(1)
  bookedCount Int            @default(0)
  slotStatus  SlotStatusEnum @default(OPEN)
  remarks     String?        @db.VarChar(250)
  createdAt   DateTime       @default(now())

  bay wks_ServiceBay? @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_BookingSlot")
  @@index([company_id, branch_id, date], map: "idx_bookingslot_date")
  @@index([company_id, bay_id, startTime, endTime], map: "idx_bookingslot_bay_range")
}

// Inti booking service oleh customer
model wks_ServiceBooking {
  id                  String                 @db.Char(20)
  bookingNumber       String                 @db.VarChar(30) // BKG-2025-00001
  bookingDate         DateTime               @default(now())
  company_id          String                 @db.Char(5)
  branch_id           String                 @db.Char(10)
  // Customer & Vehicle
  customer_id         String                 @db.Char(20)
  customerVehicle_id  String                 @db.Char(20)
  vehicle_customer_id String                 @db.Char(20) // FK untuk composite key
  // Preferensi waktu dari customer
  preferredDate       DateTime?              @db.Date
  preferredStartTime  String?                @db.Char(5) // "10:00"
  preferredEndTime    String?                @db.Char(5) // "11:00"
  // Jadwal terkonfirmasi (akan dipakai saat CONFIRMED)
  scheduledStart      DateTime?
  scheduledEnd        DateTime?
  // Alokasi resource (opsional saat booking)
  bay_id              String?                @db.Char(10)
  mechanic_id         String?                @db.Char(10)
  // Informasi layanan
  serviceType_id      String?                @db.Char(10)
  complaintNotes      String?                @db.Text
  additionalRequest   String?                @db.Text
  // Status & Sumber
  status              BookingStatusEnum      @default(PENDING)
  source              BookingSourceEnum      @default(WEB)
  // Reminder & kehadiran
  reminderSent        Boolean?               @default(false)
  checkInAt           DateTime?
  cancelledAt         DateTime?
  cancelReason        String?                @db.VarChar(250)
  // Metadata
  iStatus             MasterRecordStatusEnum @default(Active)
  remarks             String?                @db.VarChar(250)
  createdBy           String?                @db.Char(10)
  createdAt           DateTime               @default(now())
  updatedBy           String?                @db.Char(10)
  updatedAt           DateTime
  // Relations
  customer            cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  customerVehicle     cmf_CustomerVehicle    @relation(fields: [company_id, customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic            cmf_Mechanic?          @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  bay                 wks_ServiceBay?        @relation(fields: [company_id, bay_id], references: [company_id, id], onUpdate: NoAction)
  serviceType         wks_ServiceType?       @relation(fields: [company_id, serviceType_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceBooking")
  @@unique([company_id, bookingNumber], map: "unique_booking_number")
  @@index([company_id, branch_id, bookingDate], map: "idx_booking_date")
  @@index([company_id, status], map: "idx_booking_status")
  @@index([company_id, scheduledStart], map: "idx_booking_scheduled_start")
}

// Service Order / Work Order
model wks_ServiceOrder {
  id                     String                   @db.Char(20)
  orderNumber            String                   @db.VarChar(30) // SO-2024-0001
  orderDate              DateTime                 @default(now())
  customer_id            String                   @db.Char(20)
  customerVehicle_id     String                   @db.Char(20)
  vehicle_customer_id    String                   @db.Char(20) // FK untuk composite key
  // Informasi Kendaraan saat masuk
  odometerIn             Int? // KM saat masuk
  fuelLevel              FuelLevelEnum?           @default(EMPTY) // Level BBM saat masuk
  vehicleConditionNotes  String?                  @db.Text // Catatan kondisi kendaraan
  // Assignment
  mechanic_id            String?                  @db.Char(10)
  serviceBay_id          String?                  @db.Char(10)
  // Jadwal & Waktu
  scheduledStartDate     DateTime? // Jadwal mulai service
  scheduledEndDate       DateTime? // Estimasi selesai
  actualStartDate        DateTime? // Actual mulai service
  actualEndDate          DateTime? // Actual selesai
  estimatedDuration      Int? // Estimasi durasi (menit)
  actualDuration         Int? // Actual durasi (menit)
  // Keluhan & Permintaan Customer
  customerComplaint      String?                  @db.Text // Keluhan customer
  serviceRequest         String?                  @db.Text // Permintaan service
  // Diagnosa & Rekomendasi Mekanik
  mechanicDiagnosis      String?                  @db.Text // Hasil diagnosa
  mechanicRecommendation String?                  @db.Text // Rekomendasi mekanik
  // Biaya
  serviceCost            Decimal?                 @default(0) @db.Decimal(21, 4) // Total biaya jasa
  partsCost              Decimal?                 @default(0) @db.Decimal(21, 4) // Total biaya parts
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount            Decimal?                 @default(0) @db.Decimal(21, 4)
  // Status
  orderStatus            ServiceOrderStatusEnum   @default(DRAFT)
  paymentStatus          PaymentStatusEnum?       @default(UNPAID)
  priority               PriorityEnum?            @default(NORMAL) // LOW, NORMAL, HIGH, URGENT
  // Quality Control
  qcCheckedBy            String?                  @db.Char(10) // User ID QC
  qcCheckedDate          DateTime?
  qcNotes                String?                  @db.Text
  qcApproved             Boolean?                 @default(false)
  // Customer Feedback
  customerRating         Int?                     @db.SmallInt // Rating 1-5
  customerFeedback       String?                  @db.Text
  customerSignature      String?                  @db.VarChar(250) // URL signature image
  // Metadata
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  customer               cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle      @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic               cmf_Mechanic?            @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  serviceBay             wks_ServiceBay?          @relation(fields: [company_id, serviceBay_id], references: [company_id, id], onUpdate: NoAction)
  orderDetails           wks_ServiceOrderDetail[]
  histories              wks_ServiceHistory[]
  complaints             wks_CustomerComplaint[]
  invoices               arm_Invoice[]
  serviceReworks         wks_ServiceRework[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_wks_ServiceOrder")
  @@unique([company_id, orderNumber], map: "unique_order_number")
  @@index([company_id, customer_id], map: "idx_service_order_customer")
  @@index([company_id, orderDate], map: "idx_service_order_date")
  @@index([company_id, orderStatus], map: "idx_service_order_status")
}

// Detail Service Order (Pekerjaan & Parts yang digunakan)
model wks_ServiceOrderDetail {
  id                 String                 @db.Char(30) // Manual: SOD/2025/10/00001
  serviceOrder_id    String                 @db.Char(20)
  lineNumber         Int                    @db.SmallInt // Nomor urut item
  detailType         DetailTypeEnum // SERVICE atau PART
  // Untuk Service
  serviceType_id     String?                @db.Char(10)
  serviceName        String?                @db.VarChar(100) // Nama pekerjaan
  serviceDescription String?                @db.Text
  // Untuk Parts
  product_id         String?                @db.Char(20)
  productVariant_id  String?                @db.Char(30)
  partName           String?                @db.VarChar(250)
  partNumber         String?                @db.VarChar(50)
  // Mekanik yang mengerjakan
  mechanic_id        String?                @db.Char(10)
  // Quantity & Harga
  quantity           Decimal                @default(1) @db.Decimal(12, 4)
  unitPrice          Decimal                @db.Decimal(21, 4)
  discountPercent    Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount     Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent         Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount          Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal           Decimal                @db.Decimal(21, 4)
  // Waktu Pengerjaan
  startTime          DateTime?
  endTime            DateTime?
  duration           Int? // Durasi dalam menit
  // Status
  detailStatus       DetailStatusEnum?      @default(PENDING) // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  serviceOrder       wks_ServiceOrder       @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  serviceType        wks_ServiceType?       @relation(fields: [company_id, serviceType_id], references: [company_id, id], onUpdate: NoAction)
  mechanic           cmf_Mechanic?          @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  product            imc_Product?           @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceOrderDetail")
  @@index([company_id, serviceOrder_id], map: "idx_service_order_detail")
}

// Service History - History lengkap semua service kendaraan
model wks_ServiceHistory {
  id                  String                 @db.Char(30)
  serviceOrder_id     String                 @db.Char(20)
  customer_id         String                 @db.Char(20)
  customerVehicle_id  String                 @db.Char(20)
  vehicle_customer_id String                 @db.Char(20)
  // Informasi Service
  serviceDate         DateTime // Tanggal service
  orderNumber         String                 @db.VarChar(30)
  serviceSummary      String?                @db.Text // Ringkasan pekerjaan
  partsReplaced       String?                @db.Text // Parts yang diganti
  odometerReading     Int? // Odometer saat service
  // Biaya
  totalServiceCost    Decimal?               @db.Decimal(21, 4)
  totalPartsCost      Decimal?               @db.Decimal(21, 4)
  totalAmount         Decimal?               @db.Decimal(21, 4)
  // Next Service Reminder
  nextServiceDate     DateTime? // Reminder service berikutnya
  nextServiceOdometer Int? // KM untuk service berikutnya
  // Mekanik & Quality
  mechanicName        String?                @db.VarChar(100)
  customerRating      Int?                   @db.SmallInt
  customerFeedback    String?                @db.Text
  // Metadata
  iStatus             MasterRecordStatusEnum @default(Active)
  remarks             String?                @db.VarChar(250)
  createdBy           String?                @db.Char(10)
  createdAt           DateTime               @default(now())
  updatedBy           String?                @db.Char(10)
  updatedAt           DateTime
  company_id          String                 @db.Char(5)
  branch_id           String                 @db.Char(10)
  // Relations
  serviceOrder        wks_ServiceOrder       @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  customer            cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle             cmf_CustomerVehicle    @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceHistory")
  @@index([company_id, customer_id], map: "idx_service_history_customer")
  @@index([company_id, customerVehicle_id], map: "idx_service_history_vehicle")
  @@index([company_id, serviceDate], map: "idx_service_history_date")
}

/// ============================================================================
/// COMPLAINT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk handle customer complaint dengan tracking lengkap
/// Flow: Complaint → Investigation → Resolution → Follow Up
/// Support: Escalation, SLA tracking, preventive action

// Customer Complaint - Keluhan customer terhadap service
model wks_CustomerComplaint {
  id                     String                 @db.Char(30) // Manual: CMP/2025/10/00001
  complaintNumber        String                 @db.VarChar(30)
  complaintDate          DateTime               @default(now())
  serviceOrder_id        String?                @db.Char(20) // Service yang dikomplain
  customer_id            String                 @db.Char(20)
  customerVehicle_id     String?                @db.Char(20)
  vehicle_customer_id    String?                @db.Char(20) // FK untuk composite key
  // Complaint Info
  complaintType          ComplaintTypeEnum? // SERVICE_QUALITY, PARTS_QUALITY, PRICING, DELAY, STAFF_BEHAVIOR, OTHER
  complaintCategory      String?                @db.VarChar(50) // Mekanik tidak profesional, Hasil tidak memuaskan, dll
  subject                String                 @db.VarChar(250) // Judul complaint
  description            String                 @db.Text // Deskripsi detail complaint
  severity               SeverityEnum?          @default(MEDIUM) // LOW, MEDIUM, HIGH, CRITICAL
  // Customer Contact
  customerName           String?                @db.VarChar(100)
  customerPhone          String?                @db.VarChar(20)
  customerEmail          String?                @db.VarChar(100)
  preferredContactMethod String?                @db.VarChar(20) // Phone, Email, WhatsApp
  // Complaint Details
  complaintSource        ComplaintSourceEnum? // PHONE, EMAIL, WHATSAPP, IN_PERSON, SOCIAL_MEDIA, WEBSITE
  occurredDate           DateTime? // Kapan kejadian yang dikomplain
  reportedBy             String?                @db.VarChar(100) // Nama yang melaporkan (bisa beda dengan customer)
  // Evidence
  attachments            String?                @db.Text // JSON array URLs foto/dokumen bukti
  witnessName            String?                @db.VarChar(100)
  witnessContact         String?                @db.VarChar(50)
  // Assignment & Response
  assignedTo             String?                @db.Char(10) // User yang handle complaint
  assignedDate           DateTime?
  department             String?                @db.VarChar(50) // Service, Parts, Management, dll
  // Investigation
  investigationNotes     String?                @db.Text
  rootCause              String?                @db.Text // Akar masalah
  // Resolution
  resolutionDescription  String?                @db.Text // Penjelasan solusi
  resolutionDate         DateTime?
  resolvedBy             String?                @db.Char(10)
  compensationType       String?                @db.VarChar(50) // Free Service, Discount, Refund, Replacement, dll
  compensationAmount     Decimal?               @db.Decimal(21, 4)
  compensationNotes      String?                @db.Text
  // Follow Up
  followUpRequired       Boolean?               @default(false)
  followUpDate           DateTime?
  followUpBy             String?                @db.Char(10)
  followUpNotes          String?                @db.Text
  // Customer Satisfaction
  resolutionRating       Int?                   @db.SmallInt // Rating 1-5 setelah complaint resolved
  customerFeedback       String?                @db.Text // Feedback customer setelah penanganan
  isSatisfied            Boolean?
  // Status
  complaintStatus        ComplaintStatusEnum    @default(OPEN)
  priority               PriorityEnum?          @default(NORMAL)
  // SLA (Service Level Agreement)
  targetResolutionDate   DateTime? // Target tanggal selesai
  isOverdue              Boolean?               @default(false)
  // Escalation
  isEscalated            Boolean?               @default(false)
  escalatedTo            String?                @db.Char(10) // User/Manager yang di-escalate
  escalatedDate          DateTime?
  escalationReason       String?                @db.VarChar(250)
  // Preventive Action
  preventiveAction       String?                @db.Text // Tindakan pencegahan kedepan
  implementedBy          String?                @db.Char(10)
  implementedDate        DateTime?
  // Metadata
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  company_id             String                 @db.Char(5)
  branch_id              String                 @db.Char(10)
  // Relations
  serviceOrder           wks_ServiceOrder?      @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  customer               cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle?   @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  complaintLogs          wks_ComplaintLog[]
  serviceReworks         wks_ServiceRework[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_cmf_CustomerComplaint")
  @@unique([company_id, complaintNumber], map: "unique_complaint_number")
  @@index([company_id, customer_id], map: "idx_complaint_customer")
  @@index([company_id, serviceOrder_id], map: "idx_complaint_service")
  @@index([company_id, complaintDate], map: "idx_complaint_date")
  @@index([company_id, complaintStatus], map: "idx_complaint_status")
}

// Complaint Activity Log - History semua aktivitas complaint
model wks_ComplaintLog {
  id           String                 @db.Char(30) // Manual: CML/2025/10/00001
  complaint_id String                 @db.Char(30)
  logDate      DateTime               @default(now())
  logType      ComplaintLogTypeEnum // STATUS_CHANGE, ASSIGNMENT, RESPONSE, ESCALATION, RESOLUTION, FOLLOW_UP, NOTE
  oldStatus    ComplaintStatusEnum?
  newStatus    ComplaintStatusEnum?
  action       String?                @db.VarChar(100) // Assigned to John, Status changed, Called customer, dll
  description  String?                @db.Text
  actionBy     String?                @db.Char(10) // User yang melakukan action
  isInternal   Boolean?               @default(false) // Internal note atau visible ke customer
  attachments  String?                @db.Text // JSON array URLs
  // Metadata
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  // Relations
  complaint    wks_CustomerComplaint  @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ComplaintLog")
  @@index([company_id, complaint_id], map: "idx_complaint_log")
}

/// ============================================================================
/// SERVICE RETURN & REWORK MODULE
/// ============================================================================
/// Module untuk handle service rework dan credit note
/// Flow: Complaint → ServiceRework → CreditNote → GL
/// Support: Free rework, refund, voucher, dan compensation tracking

// Service Rework (Service Ulang/Redo)
model wks_ServiceRework {
  id                      String                  @db.Char(30) // Manual: SRW/2025/10/00001
  reworkNumber            String                  @db.VarChar(30)
  reworkDate              DateTime                @default(now())
  transaction_type        String                  @db.Char(5) // "SRW"
  transaction_class       String                  @db.Char(10) // "SERVICE"
  // Original Service Info
  originalServiceOrder_id String                  @db.Char(20)
  originalOrderNumber     String?                 @db.VarChar(30)
  complaint_id            String?                 @db.Char(30) // Link ke complaint
  // Customer & Vehicle
  customer_id             String                  @db.Char(20)
  customerVehicle_id      String                  @db.Char(20)
  vehicle_customer_id     String                  @db.Char(20)
  // Rework Reason
  reworkReason            ReworkReasonEnum? // POOR_QUALITY, INCOMPLETE, WRONG_PART, MALFUNCTION, OTHER
  reworkReasonDesc        String?                 @db.Text
  issueDescription        String?                 @db.Text // Deskripsi masalah
  // Assignment
  mechanic_id             String?                 @db.Char(10)
  serviceBay_id           String?                 @db.Char(10)
  // Schedule
  scheduledDate           DateTime?
  actualStartDate         DateTime?
  actualEndDate           DateTime?
  // Rework Type
  isWarrantyWork          Boolean?                @default(true) // Garansi atau bayar
  isFreeService           Boolean?                @default(true) // Gratis atau tidak
  chargeToCustomer        Boolean?                @default(false) // Dikenakan biaya atau tidak
  // Cost (jika ada biaya tambahan)
  additionalCost          Decimal?                @default(0) @db.Decimal(21, 4)
  // Quality Check
  qcCheckedBy             String?                 @db.Char(10)
  qcCheckedDate           DateTime?
  qcApproved              Boolean?                @default(false)
  // Customer Satisfaction
  customerRating          Int?                    @db.SmallInt
  customerFeedback        String?                 @db.Text
  isSatisfied             Boolean?
  // Status
  reworkStatus            ReworkStatusEnum        @default(SCHEDULED)
  // Notes
  notes                   String?                 @db.Text
  internalNotes           String?                 @db.Text
  // Metadata
  iStatus                 MasterRecordStatusEnum  @default(Active)
  remarks                 String?                 @db.VarChar(250)
  createdBy               String?                 @db.Char(10)
  createdAt               DateTime                @default(now())
  updatedBy               String?                 @db.Char(10)
  updatedAt               DateTime
  company_id              String                  @db.Char(5)
  branch_id               String                  @db.Char(10)
  // Relations
  originalServiceOrder    wks_ServiceOrder        @relation(fields: [company_id, originalServiceOrder_id], references: [company_id, id], onUpdate: NoAction)
  complaint               wks_CustomerComplaint?  @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)
  customer                cmf_Customer            @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                 cmf_CustomerVehicle     @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  mechanic                cmf_Mechanic?           @relation(fields: [company_id, mechanic_id], references: [company_id, id], onUpdate: NoAction)
  serviceBay              wks_ServiceBay?         @relation(fields: [company_id, serviceBay_id], references: [company_id, id], onUpdate: NoAction)
  reworkItems             wks_ServiceReworkItem[]
  creditNotes             arm_CreditNote[]

  @@id([company_id, id], map: "pk_wks_ServiceRework")
  @@unique([company_id, reworkNumber], map: "unique_rework_number")
  @@index([company_id, originalServiceOrder_id], map: "idx_rework_service")
  @@index([company_id, customer_id], map: "idx_rework_customer")
}

// Service Rework Items (Pekerjaan ulang & Parts)
model wks_ServiceReworkItem {
  id                 String                 @db.Char(30) // Manual: SRWI/2025/10/00001
  serviceRework_id   String                 @db.Char(30)
  lineNumber         Int                    @db.SmallInt
  itemType           DetailTypeEnum // SERVICE atau PART
  // Original Item (yang bermasalah)
  originalItem_id    String?                @db.Char(30) // Original ServiceOrderDetail ID
  // Service Info
  serviceType_id     String?                @db.Char(10)
  serviceName        String?                @db.VarChar(100)
  serviceDescription String?                @db.Text
  // Part Info
  product_id         String?                @db.Char(20)
  productVariant_id  String?                @db.Char(30)
  partName           String?                @db.VarChar(250)
  // Action
  reworkAction       ReworkActionEnum? // REDO, REPLACE, ADJUST, REFUND
  actionDescription  String?                @db.Text
  // Quantity (untuk parts)
  quantity           Decimal?               @default(0) @db.Decimal(12, 4)
  // Cost
  originalCost       Decimal?               @default(0) @db.Decimal(21, 4)
  additionalCost     Decimal?               @default(0) @db.Decimal(21, 4)
  // Status
  itemStatus         DetailStatusEnum?      @default(PENDING)
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  serviceRework      wks_ServiceRework      @relation(fields: [company_id, serviceRework_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_wks_ServiceReworkItem")
  @@index([company_id, serviceRework_id], map: "idx_rework_item")
}

// Credit Note (Nota Kredit - Refund/Discount untuk Customer)
model arm_CreditNote {
  id                    String                 @db.Char(30) // Manual: CN/2025/10/00001
  creditNoteNumber      String                 @db.VarChar(30)
  creditNoteDate        DateTime               @default(now())
  transaction_type      String                 @db.Char(5) // "CN"
  transaction_class     String                 @db.Char(10) // "SALES"
  // Source Document
  source_module         String?                @db.VarChar(20) // "SERVICE"
  invoice_id            String?                @db.Char(30) // Invoice yang di-credit
  invoiceNumber         String?                @db.VarChar(30)
  serviceOrder_id       String?                @db.Char(20) // Service order terkait
  complaint_id          String?                @db.Char(30) // Complaint terkait
  serviceRework_id      String?                @db.Char(30) // Rework terkait
  // Customer Info
  customer_id           String                 @db.Char(20)
  customerName          String                 @db.VarChar(100)
  customerVehicle_id    String?                @db.Char(20)
  vehicle_customer_id   String?                @db.Char(20)
  vehicleInfo           String?                @db.VarChar(250)
  // Credit Reason
  creditReason          CreditReasonEnum? // SERVICE_ISSUE, OVERCHARGE, GOODWILL, RETURN, OTHER
  creditReasonDesc      String?                @db.Text
  // Amount
  originalAmount        Decimal?               @db.Decimal(21, 4)
  creditAmount          Decimal                @db.Decimal(21, 4) // Jumlah kredit
  taxAmount             Decimal?               @default(0) @db.Decimal(21, 4)
  totalCreditAmount     Decimal                @db.Decimal(21, 4)
  // Refund Method
  refundMethod          RefundMethodEnum? // CASH, BANK_TRANSFER, CREDIT_TO_ACCOUNT, VOUCHER
  refundBankAccount_id  String?                @db.Char(10)
  refundReferenceNumber String?                @db.VarChar(50)
  refundDate            DateTime?
  // Approval
  approvedBy            String?                @db.Char(10)
  approvedDate          DateTime?
  approvalNotes         String?                @db.Text
  // Status
  creditNoteStatus      CreditNoteStatusEnum   @default(DRAFT)
  isPosted              Boolean?               @default(false)
  postedDate            DateTime?
  isRefunded            Boolean?               @default(false)
  // Notes
  notes                 String?                @db.Text
  internalNotes         String?                @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum @default(Active)
  remarks               String?                @db.VarChar(250)
  createdBy             String?                @db.Char(10)
  createdAt             DateTime               @default(now())
  updatedBy             String?                @db.Char(10)
  updatedAt             DateTime
  company_id            String                 @db.Char(5)
  branch_id             String                 @db.Char(10)
  // Relations
  invoice               arm_Invoice?           @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  serviceOrder          wks_ServiceOrder?      @relation(fields: [company_id, serviceOrder_id], references: [company_id, id], onUpdate: NoAction)
  complaint             wks_CustomerComplaint? @relation(fields: [company_id, complaint_id], references: [company_id, id], onUpdate: NoAction)
  serviceRework         wks_ServiceRework?     @relation(fields: [company_id, serviceRework_id], references: [company_id, id], onUpdate: NoAction)
  customer              cmf_Customer           @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle               cmf_CustomerVehicle?   @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  bankAccount           acc_BankAccount?       @relation(fields: [company_id, refundBankAccount_id], references: [company_id, id], onUpdate: NoAction)
  creditNoteDetails     arm_CreditNoteDetail[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_CreditNote")
  @@unique([company_id, creditNoteNumber], map: "unique_credit_note_number")
  @@index([company_id, customer_id], map: "idx_credit_note_customer")
  @@index([company_id, invoice_id], map: "idx_credit_note_invoice")
}

// Credit Note Detail
model arm_CreditNoteDetail {
  id                String                 @db.Char(30) // Manual: CND/2025/10/00001
  creditNote_id     String                 @db.Char(30)
  lineNumber        Int                    @db.SmallInt
  itemType          InvoiceItemTypeEnum // SERVICE, PART, OTHER
  // Item Info
  item_id           String?                @db.Char(30)
  itemCode          String?                @db.VarChar(50)
  itemName          String                 @db.VarChar(250)
  description       String?                @db.Text
  // Original Amount
  originalQuantity  Decimal?               @db.Decimal(12, 4)
  originalUnitPrice Decimal?               @db.Decimal(21, 4)
  originalAmount    Decimal?               @db.Decimal(21, 4)
  // Credit Amount
  creditQuantity    Decimal?               @db.Decimal(12, 4)
  creditUnitPrice   Decimal?               @db.Decimal(21, 4)
  creditAmount      Decimal                @db.Decimal(21, 4)
  taxAmount         Decimal?               @default(0) @db.Decimal(21, 4)
  totalCredit       Decimal                @db.Decimal(21, 4)
  // Reason
  creditReason      String?                @db.VarChar(250)
  // Status
  iStatus           MasterRecordStatusEnum @default(Active)
  remarks           String?                @db.VarChar(250)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  // Relations
  creditNote        arm_CreditNote         @relation(fields: [company_id, creditNote_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_CreditNoteDetail")
  @@index([company_id, creditNote_id], map: "idx_credit_note_detail")
}

/// ============================================================================
/// PROCUREMENT MANAGEMENT MODULE
/// ============================================================================
/// Module untuk manage supplier, purchase order, dan penerimaan barang
/// Flow: PO → PurchaseReceive → A/P Invoice → Payment → GL
/// Support: Multi-warehouse, quality inspection, partial receive, purchase return

// Master Supplier
model prc_Supplier {
  id               String                 @db.Char(20)
  supplierCode     String?                @db.Char(20)
  supplierType     SupplierTypeEnum       @default(VENDOR) // VENDOR, DISTRIBUTOR, MANUFACTURER
  // Data Supplier
  name             String                 @db.VarChar(150)
  legalName        String?                @db.VarChar(150) // Nama legal perusahaan
  nickname         String?                @db.VarChar(50)
  // Contact Person
  contactPerson    String?                @db.VarChar(100)
  contactPosition  String?                @db.VarChar(50)
  phone1           String?                @db.VarChar(20)
  phone2           String?                @db.VarChar(20)
  mobile1          String?                @db.VarChar(20)
  mobile2          String?                @db.VarChar(20)
  email            String?                @db.VarChar(100)
  website          String?                @db.VarChar(100)
  // Alamat
  province         String?                @db.VarChar(50)
  district         String?                @db.VarChar(50)
  city             String?                @db.VarChar(50)
  subDistrict      String?                @db.VarChar(50)
  address1         String?                @db.VarChar(250)
  address2         String?                @db.VarChar(250)
  postalCode       String?                @db.Char(6)
  // Tax & Legal
  taxNumber        String?                @db.VarChar(30) // NPWP
  taxName          String?                @db.VarChar(150) // Nama di NPWP
  taxAddress       String?                @db.VarChar(250) // Alamat di NPWP
  // Banking
  bankName         String?                @db.VarChar(50)
  bankBranch       String?                @db.VarChar(50)
  accountNumber    String?                @db.VarChar(30)
  accountName      String?                @db.VarChar(100)
  // Payment Terms
  paymentTermDays  Int?                   @default(30) @db.SmallInt // Termin pembayaran (hari)
  creditLimit      Decimal?               @db.Decimal(21, 4)
  currentDebt      Decimal?               @default(0) @db.Decimal(21, 4)
  // Performance & Rating
  supplierRating   Decimal?               @db.Decimal(3, 2) // Rating 0.00 - 5.00
  totalPurchase    Decimal?               @default(0) @db.Decimal(21, 4)
  totalTransaction Int?                   @default(0)
  lastPurchaseDate DateTime?
  // Status & Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  isPreferred      Boolean?               @default(false) // Supplier preferensi
  isBlacklisted    Boolean?               @default(false)
  blacklistReason  String?                @db.VarChar(250)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  purchaseOrders   prc_PurchaseOrder[]
  purchaseReceives prc_PurchaseReceive[]
  apInvoices       apm_Invoice[]
  apPayments       apm_Payment[]
  purchaseReturns  prc_PurchaseReturn[]

  @@id([company_id, id], map: "pk_prc_Supplier")
  @@unique([company_id, supplierCode], map: "unique_supplier_code")
  @@index([company_id, name], map: "idx_supplier_name")
  @@index([company_id, supplierType], map: "idx_supplier_type")
}

// Purchase Order Header
model prc_PurchaseOrder {
  id                    String                    @db.Char(20)
  poNumber              String                    @db.VarChar(30) // PO-2024-12-0001
  poDate                DateTime                  @default(now())
  supplier_id           String                    @db.Char(20)
  // Reference
  requisitionNumber     String?                   @db.VarChar(30) // Nomor permintaan barang
  quotationNumber       String?                   @db.VarChar(30) // Nomor quotation dari supplier
  // Delivery Info
  requestedDeliveryDate DateTime?                 @db.Date
  expectedDeliveryDate  DateTime?                 @db.Date
  warehouse_id          String?                   @db.Char(4)
  deliveryAddress       String?                   @db.VarChar(250)
  // Contact Person
  buyerName             String?                   @db.VarChar(100) // Nama pembeli/buyer
  supplierContactPerson String?                   @db.VarChar(100)
  supplierPhone         String?                   @db.VarChar(20)
  // Payment Terms
  paymentTermDays       Int?                      @db.SmallInt // NET 30, NET 60, dll
  paymentMethod         String?                   @db.VarChar(30) // Transfer, Cash, Giro
  downPaymentPercent    Decimal?                  @default(0) @db.Decimal(5, 2)
  downPaymentAmount     Decimal?                  @default(0) @db.Decimal(21, 4)
  // Amounts
  subtotalAmount        Decimal?                  @default(0) @db.Decimal(21, 4)
  discountPercent       Decimal?                  @default(0) @db.Decimal(5, 2)
  discountAmount        Decimal?                  @default(0) @db.Decimal(21, 4)
  taxPercent            Decimal?                  @default(0) @db.Decimal(5, 2) // PPN 11%
  taxAmount             Decimal?                  @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?                  @default(0) @db.Decimal(21, 4)
  otherCost             Decimal?                  @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal?                  @default(0) @db.Decimal(21, 4)
  // Status Tracking
  poStatus              PurchaseOrderStatusEnum   @default(DRAFT)
  approvalStatus        ApprovalStatusEnum?       @default(PENDING)
  receiveStatus         ReceiveStatusEnum?        @default(NOT_RECEIVED)
  paymentStatus         PaymentStatusEnum?        @default(UNPAID)
  // Approval
  approvedBy            String?                   @db.Char(10)
  approvedDate          DateTime?
  approvalNotes         String?                   @db.Text
  // Cancel Info
  cancelledBy           String?                   @db.Char(10)
  cancelledDate         DateTime?
  cancelReason          String?                   @db.VarChar(250)
  // Notes
  notes                 String?                   @db.Text
  internalNotes         String?                   @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum    @default(Active)
  remarks               String?                   @db.VarChar(250)
  createdBy             String?                   @db.Char(10)
  createdAt             DateTime                  @default(now())
  updatedBy             String?                   @db.Char(10)
  updatedAt             DateTime
  company_id            String                    @db.Char(5)
  branch_id             String                    @db.Char(10)
  // Relations
  supplier              prc_Supplier              @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse             imc_Warehouse?            @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  orderDetails          prc_PurchaseOrderDetail[]
  purchaseReceives      prc_PurchaseReceive[]
  apInvoices            apm_Invoice[]
  purchaseReturns       prc_PurchaseReturn[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_prc_PurchaseOrder")
  @@unique([company_id, poNumber], map: "unique_po_number")
  @@index([company_id, supplier_id], map: "idx_po_supplier")
  @@index([company_id, poDate], map: "idx_po_date")
  @@index([company_id, poStatus], map: "idx_po_status")
}

// Purchase Order Detail
model prc_PurchaseOrderDetail {
  id                  String                      @db.Char(30) // Manual: POD/2025/10/00001
  purchaseOrder_id    String                      @db.Char(20)
  lineNumber          Int                         @db.SmallInt // Nomor urut baris
  // Product Info
  product_id          String                      @db.Char(20)
  productVariant_id   String?                     @db.Char(30)
  productName         String                      @db.VarChar(250)
  productCode         String?                     @db.VarChar(50)
  productDescription  String?                     @db.Text
  // Supplier Product Info
  supplierPartNumber  String?                     @db.VarChar(50) // Part number dari supplier
  supplierProductName String?                     @db.VarChar(250)
  // Quantity & UOM
  orderedQty          Decimal                     @db.Decimal(12, 4)
  receivedQty         Decimal?                    @default(0) @db.Decimal(12, 4)
  outstandingQty      Decimal?                    @db.Decimal(12, 4) // Sisa yang belum diterima
  uom                 String                      @db.VarChar(10) // PCS, BOX, KG, dll
  // Pricing
  unitPrice           Decimal                     @db.Decimal(21, 4)
  discountPercent     Decimal?                    @default(0) @db.Decimal(5, 2)
  discountAmount      Decimal?                    @default(0) @db.Decimal(21, 4)
  taxPercent          Decimal?                    @default(0) @db.Decimal(5, 2)
  taxAmount           Decimal?                    @default(0) @db.Decimal(21, 4)
  subtotal            Decimal                     @db.Decimal(21, 4)
  // Delivery
  requestedDate       DateTime?                   @db.Date
  expectedDate        DateTime?                   @db.Date
  // Status
  lineStatus          PODetailStatusEnum?         @default(OPEN) // OPEN, PARTIAL, FULLY_RECEIVED, CANCELLED
  iStatus             MasterRecordStatusEnum      @default(Active)
  remarks             String?                     @db.VarChar(250)
  createdBy           String?                     @db.Char(10)
  createdAt           DateTime                    @default(now())
  updatedBy           String?                     @db.Char(10)
  updatedAt           DateTime
  company_id          String                      @db.Char(5)
  branch_id           String                      @db.Char(10)
  // Relations
  purchaseOrder       prc_PurchaseOrder           @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  product             imc_Product                 @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)
  receiveDetails      prc_PurchaseReceiveDetail[]

  @@id([company_id, id], map: "pk_prc_PurchaseOrderDetail")
  @@index([company_id, purchaseOrder_id], map: "idx_po_detail")
}

// Purchase Receive Header (GRN - Goods Receipt Note)
model prc_PurchaseReceive {
  id                    String                      @db.Char(20)
  receiveNumber         String                      @db.VarChar(30) // GRN-2024-12-0001
  receiveDate           DateTime                    @default(now())
  purchaseOrder_id      String                      @db.Char(20)
  supplier_id           String                      @db.Char(20)
  // Reference
  supplierInvoiceNumber String?                     @db.VarChar(30) // Nomor invoice/surat jalan supplier
  supplierInvoiceDate   DateTime?                   @db.Date
  deliveryNoteNumber    String?                     @db.VarChar(30) // Nomor surat jalan
  // Delivery Info
  warehouse_id          String?                     @db.Char(4)
  receivedBy            String?                     @db.Char(10) // User yang terima barang
  vehicleNumber         String?                     @db.VarChar(15) // Plat kendaraan pengiriman
  driverName            String?                     @db.VarChar(100)
  driverPhone           String?                     @db.VarChar(20)
  // Inspection
  inspectedBy           String?                     @db.Char(10) // User yang inspeksi
  inspectionDate        DateTime?
  inspectionNotes       String?                     @db.Text
  qualityStatus         QualityStatusEnum?          @default(PENDING) // PENDING, APPROVED, REJECTED, PARTIAL
  // Amounts
  subtotalAmount        Decimal?                    @default(0) @db.Decimal(21, 4)
  discountAmount        Decimal?                    @default(0) @db.Decimal(21, 4)
  taxAmount             Decimal?                    @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?                    @default(0) @db.Decimal(21, 4)
  otherCost             Decimal?                    @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal?                    @default(0) @db.Decimal(21, 4)
  // Status
  receiveStatus         ReceiveStatusEnum           @default(DRAFT)
  postingStatus         PostingStatusEnum?          @default(NOT_POSTED) // NOT_POSTED, POSTED
  postedBy              String?                     @db.Char(10)
  postedDate            DateTime?
  // Return Info
  hasReturn             Boolean?                    @default(false)
  returnReason          String?                     @db.VarChar(250)
  // Notes
  notes                 String?                     @db.Text
  internalNotes         String?                     @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum      @default(Active)
  remarks               String?                     @db.VarChar(250)
  createdBy             String?                     @db.Char(10)
  createdAt             DateTime                    @default(now())
  updatedBy             String?                     @db.Char(10)
  updatedAt             DateTime
  company_id            String                      @db.Char(5)
  branch_id             String                      @db.Char(10)
  // Relations
  purchaseOrder         prc_PurchaseOrder           @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  supplier              prc_Supplier                @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse             imc_Warehouse?              @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  receiveDetails        prc_PurchaseReceiveDetail[]
  apInvoices            apm_Invoice[]
  purchaseReturns       prc_PurchaseReturn[]

  @@id([company_id, id], map: "pk_prc_PurchaseReceive")
  @@unique([company_id, receiveNumber], map: "unique_receive_number")
  @@index([company_id, purchaseOrder_id], map: "idx_receive_po")
  @@index([company_id, supplier_id], map: "idx_receive_supplier")
  @@index([company_id, receiveDate], map: "idx_receive_date")
}

// Purchase Receive Detail
model prc_PurchaseReceiveDetail {
  id                     String                   @db.Char(30) // Manual: RCD/2025/10/00001
  purchaseReceive_id     String                   @db.Char(20)
  purchaseOrderDetail_id String                   @db.Char(30)
  lineNumber             Int                      @db.SmallInt
  // Product Info
  product_id             String                   @db.Char(20)
  productVariant_id      String?                  @db.Char(30)
  productName            String                   @db.VarChar(250)
  productCode            String?                  @db.VarChar(50)
  // Quantity
  orderedQty             Decimal                  @db.Decimal(12, 4) // Qty di PO
  receivedQty            Decimal                  @db.Decimal(12, 4) // Qty yang diterima
  acceptedQty            Decimal?                 @db.Decimal(12, 4) // Qty yang diterima (lolos QC)
  rejectedQty            Decimal?                 @default(0) @db.Decimal(12, 4) // Qty yang ditolak
  damagedQty             Decimal?                 @default(0) @db.Decimal(12, 4) // Qty yang rusak
  uom                    String                   @db.VarChar(10)
  // Storage Location
  warehouse_id           String?                  @db.Char(4)
  floor_id               String?                  @db.Char(5)
  shelf_id               String?                  @db.Char(15)
  row_id                 String?                  @db.Char(15)
  // Batch & Expiry
  batchNumber            String?                  @db.VarChar(30)
  manufactureDate        DateTime?                @db.Date
  expiryDate             DateTime?                @db.Date
  // Pricing
  unitPrice              Decimal                  @db.Decimal(21, 4)
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  subtotal               Decimal                  @db.Decimal(21, 4)
  // Quality Check
  qualityStatus          QualityStatusEnum?       @default(PENDING)
  rejectionReason        String?                  @db.VarChar(250)
  qualityNotes           String?                  @db.Text
  // Status
  lineStatus             ReceiveDetailStatusEnum? @default(RECEIVED)
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  purchaseReceive        prc_PurchaseReceive      @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrderDetail    prc_PurchaseOrderDetail  @relation(fields: [company_id, purchaseOrderDetail_id], references: [company_id, id], onUpdate: NoAction)
  product                imc_Product              @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_prc_PurchaseReceiveDetail")
  @@index([company_id, purchaseReceive_id], map: "idx_receive_detail")
}

/// ============================================================================
/// INVENTORY MOVEMENT MODULE
/// ============================================================================
/// Module untuk internal inventory movement (transfer, adjustment, allocation)
/// Flow: Request → Approval → Execution → Posting
/// Support: Inter-warehouse transfer, stock adjustment, return, scrap, allocation

// Inventory Internal Movement Header
model inv_InternalMovement {
  id                 String                       @db.Char(30) // Manual: INV-IN/2025/10/00001 atau INV-OUT/2025/10/00001
  movementNumber     String                       @db.VarChar(30)
  movementDate       DateTime                     @default(now())
  movementType       InternalMovementTypeEnum // TRANSFER, ADJUSTMENT, RETURN, SCRAP, ASSEMBLY, DISASSEMBLY
  transactionType    TransactionTypeEnum // IN atau OUT
  // Source & Destination
  sourceWarehouse_id String?                      @db.Char(4) // Dari warehouse mana
  destWarehouse_id   String?                      @db.Char(4) // Ke warehouse mana
  sourceLocation     String?                      @db.VarChar(100) // Floor/Shelf/Row asal
  destLocation       String?                      @db.VarChar(100) // Floor/Shelf/Row tujuan
  // Reference
  referenceNumber    String?                      @db.VarChar(30) // Nomor referensi (PO, SO, dll)
  referenceType      String?                      @db.VarChar(20) // PO, SO, SERVICE, RETURN, dll
  // Request Info
  requestedBy        String?                      @db.Char(10) // User yang request
  requestDate        DateTime?
  approvedBy         String?                      @db.Char(10) // User yang approve
  approvedDate       DateTime?
  // Execution Info
  executedBy         String?                      @db.Char(10) // User yang eksekusi movement
  executedDate       DateTime?
  vehicleNumber      String?                      @db.VarChar(15) // Plat kendaraan (jika transfer antar gudang)
  driverName         String?                      @db.VarChar(100)
  // Status
  movementStatus     MovementStatusEnum           @default(DRAFT) // DRAFT, APPROVED, IN_TRANSIT, COMPLETED, CANCELLED
  postingStatus      PostingStatusEnum?           @default(NOT_POSTED)
  postedBy           String?                      @db.Char(10)
  postedDate         DateTime?
  // Notes
  reason             String?                      @db.Text // Alasan movement
  notes              String?                      @db.Text
  internalNotes      String?                      @db.Text
  // Metadata
  iStatus            MasterRecordStatusEnum       @default(Active)
  remarks            String?                      @db.VarChar(250)
  createdBy          String?                      @db.Char(10)
  createdAt          DateTime                     @default(now())
  updatedBy          String?                      @db.Char(10)
  updatedAt          DateTime
  company_id         String                       @db.Char(5)
  branch_id          String                       @db.Char(10)
  // Relations
  sourceWarehouse    imc_Warehouse?               @relation("SourceWarehouse", fields: [sourceWarehouse_id], references: [id], onUpdate: NoAction)
  destWarehouse      imc_Warehouse?               @relation("DestWarehouse", fields: [destWarehouse_id], references: [id], onUpdate: NoAction)
  movementDetails    inv_InternalMovementDetail[]

  @@id([company_id, id], map: "pk_inv_InternalMovement")
  @@unique([company_id, movementNumber], map: "unique_movement_number")
  @@index([company_id, movementDate], map: "idx_movement_date")
  @@index([company_id, movementType], map: "idx_movement_type")
  @@index([company_id, movementStatus], map: "idx_movement_status")
}

// Inventory Internal Movement Detail
model inv_InternalMovementDetail {
  id                  String                    @db.Char(30) // Manual: IMD/2025/10/00001
  internalMovement_id String                    @db.Char(30)
  lineNumber          Int                       @db.SmallInt
  // Product Info
  product_id          String                    @db.Char(20)
  productVariant_id   String?                   @db.Char(30)
  productName         String                    @db.VarChar(250)
  productCode         String?                   @db.VarChar(50)
  // Quantity
  requestedQty        Decimal                   @db.Decimal(12, 4) // Qty yang diminta
  movedQty            Decimal                   @db.Decimal(12, 4) // Qty yang actual dipindahkan
  receivedQty         Decimal?                  @default(0) @db.Decimal(12, 4) // Qty yang diterima (untuk transfer)
  uom                 String                    @db.VarChar(10)
  // Source Location Detail
  sourceWarehouse_id  String?                   @db.Char(4)
  sourceFloor_id      String?                   @db.Char(5)
  sourceShelf_id      String?                   @db.Char(15)
  sourceRow_id        String?                   @db.Char(15)
  // Destination Location Detail
  destWarehouse_id    String?                   @db.Char(4)
  destFloor_id        String?                   @db.Char(5)
  destShelf_id        String?                   @db.Char(15)
  destRow_id          String?                   @db.Char(15)
  // Batch & Tracking
  batchNumber         String?                   @db.VarChar(30)
  serialNumber        String?                   @db.VarChar(50)
  expiryDate          DateTime?                 @db.Date
  // Cost (untuk adjustment)
  unitCost            Decimal?                  @db.Decimal(21, 4)
  totalCost           Decimal?                  @db.Decimal(21, 4)
  adjustmentValue     Decimal?                  @db.Decimal(21, 4) // Nilai adjustment (+ atau -)
  // Status
  lineStatus          MovementDetailStatusEnum? @default(PENDING)
  iStatus             MasterRecordStatusEnum    @default(Active)
  remarks             String?                   @db.VarChar(250)
  createdBy           String?                   @db.Char(10)
  createdAt           DateTime                  @default(now())
  updatedBy           String?                   @db.Char(10)
  updatedAt           DateTime
  company_id          String                    @db.Char(5)
  branch_id           String                    @db.Char(10)
  // Relations
  internalMovement    inv_InternalMovement      @relation(fields: [company_id, internalMovement_id], references: [company_id, id], onUpdate: NoAction)
  product             imc_Product               @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_inv_InternalMovementDetail")
  @@index([company_id, internalMovement_id], map: "idx_movement_detail")
}

/// ============================================================================
/// ACCOUNTING CORE MODULE
/// ============================================================================
/// Module untuk Chart of Account, Bank Account, Tax, Payment Method
/// Foundation untuk semua transaksi keuangan

// Master Transaction Type (Tipe Transaksi)
model cmf_TransactionType {
  id              String                 @db.Char(5) // SO, PO, INV, CR, CP, JV, dll
  name            String                 @db.VarChar(50) // Service Order, Purchase Order, dll
  category        String?                @db.VarChar(20) // SALES, PURCHASE, CASH, BANK, JOURNAL
  module          String?                @db.VarChar(20) // SERVICE, PROCUREMENT, ACCOUNTING
  affectGL        Boolean                @default(true) // Apakah affect GL
  requireApproval Boolean                @default(false)
  seq             Int?                   @default(0)
  iStatus         MasterRecordStatusEnum @default(Active)
  remarks         String?                @db.VarChar(250)
  createdBy       String?                @db.Char(10)
  createdAt       DateTime               @default(now())
  updatedBy       String?                @db.Char(10)
  updatedAt       DateTime

  @@id([id], map: "pk_cmf_TransactionType")
}

// Master Transaction Class (Kelas Transaksi)
model cmf_TransactionClass {
  id        String                 @db.Char(10) // SALES, PURCHASE, CASH, BANK, INVENTORY, JOURNAL
  name      String                 @db.VarChar(50)
  seq       Int?                   @default(0)
  iStatus   MasterRecordStatusEnum @default(Active)
  remarks   String?                @db.VarChar(250)
  createdBy String?                @db.Char(10)
  createdAt DateTime               @default(now())
  updatedBy String?                @db.Char(10)
  updatedAt DateTime

  @@id([id], map: "pk_cmf_TransactionClass")
}

// Master Payment Method (Metode Pembayaran)
model cmf_PaymentMethod {
  id                 String                 @db.Char(10) // CASH, TRANSFER, QRIS, DEBIT, CREDIT, dll
  name               String                 @db.VarChar(50) // Tunai, Transfer Bank, QRIS, dll
  methodType         PaymentMethodTypeEnum? // CASH, BANK, CARD, EWALLET, QRIS
  requireBankAccount Boolean                @default(false) // Perlu bank account
  requireReference   Boolean                @default(false) // Perlu nomor referensi
  processingFee      Decimal?               @db.Decimal(5, 2) // Fee dalam persen
  fixedFee           Decimal?               @db.Decimal(21, 4) // Fee tetap
  seq                Int?                   @default(0)
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  payments           arm_Payment[]
  paymentDetails     arm_PaymentDetail[]
  apPayments         apm_Payment[]
  apPaymentDetails   apm_PaymentDetail[]

  @@id([id], map: "pk_cmf_PaymentMethod")
}

// Chart of Account (COA)
model acc_COA {
  id                 String                 @db.Char(15) // 1-1000, 2-1000, dll (flexible)
  accountCode        String                 @db.VarChar(20) // Kode akun alternatif
  accountName        String                 @db.VarChar(150)
  accountName_en     String?                @db.VarChar(150)
  accountType        COATypeEnum // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  accountGroup       String?                @db.VarChar(50) // Current Asset, Fixed Asset, dll
  normalBalance      BalanceTypeEnum // DEBIT, CREDIT
  parent_id          String?                @db.Char(15) // Parent account (untuk hierarchy)
  level              Int                    @db.SmallInt // Level hierarchy (1, 2, 3, dll)
  isHeader           Boolean                @default(false) // Header account atau detail
  isActive           Boolean                @default(true)
  isCash             Boolean                @default(false) // Akun kas
  isBank             Boolean                @default(false) // Akun bank
  isAP               Boolean                @default(false) // Account Payable
  isAR               Boolean                @default(false) // Account Receivable
  isInventory        Boolean                @default(false) // Inventory
  // Opening Balance
  openingBalance     Decimal?               @default(0) @db.Decimal(21, 4)
  openingBalanceDate DateTime?              @db.Date
  // Current Balance
  currentDebit       Decimal?               @default(0) @db.Decimal(21, 4)
  currentCredit      Decimal?               @default(0) @db.Decimal(21, 4)
  currentBalance     Decimal?               @default(0) @db.Decimal(21, 4)
  // Status & Metadata
  iStatus            MasterRecordStatusEnum @default(Active)
  remarks            String?                @db.VarChar(250)
  createdBy          String?                @db.Char(10)
  createdAt          DateTime               @default(now())
  updatedBy          String?                @db.Char(10)
  updatedAt          DateTime
  company_id         String                 @db.Char(5)
  branch_id          String                 @db.Char(10)
  // Relations
  parent             acc_COA?               @relation("COAHierarchy", fields: [company_id, parent_id], references: [company_id, id], onUpdate: NoAction)
  children           acc_COA[]              @relation("COAHierarchy")
  bankAccounts       acc_BankAccount[]
  glTransDetails     acc_GLTransDetail[]
  taxSchemes         cmf_TaxScheme[]
  taxSchemeDetails   cmf_TaxSchemeDetail[]

  @@id([company_id, id], map: "pk_acc_COA")
  @@unique([company_id, accountCode], map: "unique_account_code")
  @@index([company_id, accountType], map: "idx_coa_type")
  @@index([company_id, parent_id], map: "idx_coa_parent")
}

// Bank Account (Rekening Bank)
model acc_BankAccount {
  id             String                 @db.Char(10)
  coa_id         String                 @db.Char(15) // Link ke COA
  bankName       String                 @db.VarChar(100) // BCA, Mandiri, BNI, dll
  branchName     String?                @db.VarChar(100)
  accountNumber  String                 @db.VarChar(30)
  accountName    String                 @db.VarChar(100)
  currency       String                 @default("IDR") @db.Char(3)
  swiftCode      String?                @db.VarChar(20)
  // Balance
  openingBalance Decimal?               @default(0) @db.Decimal(21, 4)
  currentBalance Decimal?               @default(0) @db.Decimal(21, 4)
  // Status
  isDefault      Boolean?               @default(false) // Bank account default
  iStatus        MasterRecordStatusEnum @default(Active)
  remarks        String?                @db.VarChar(250)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  updatedBy      String?                @db.Char(10)
  updatedAt      DateTime
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  // Relations
  coa            acc_COA                @relation(fields: [company_id, coa_id], references: [company_id, id], onUpdate: NoAction)
  payments       arm_Payment[]
  apPayments     apm_Payment[]
  creditNotes    arm_CreditNote[]

  @@id([company_id, id], map: "pk_acc_BankAccount")
  @@unique([company_id, accountNumber], map: "unique_bank_account")
}

// Tax Scheme Configuration (Konfigurasi Pajak)
model cmf_TaxScheme {
  id            String                 @db.Char(5) // T1, T2, T3, V1, V2, V3
  schemeCode    String                 @db.VarChar(10) // T1, V1, dll
  name          String                 @db.VarChar(100) // PPN 11%, PPN 12%, PPh 23, dll
  taxType       TaxTypeEnum // SALES (output), PURCHASE (input)
  category      String?                @db.VarChar(50) // VAT, WHT, SALES_TAX, LUXURY_TAX
  // Tax Calculation
  isInclusive   Boolean                @default(false) // Tax included in price atau tidak
  defaultRate   Decimal                @db.Decimal(5, 2) // Rate default (misal: 11.00)
  isCompound    Boolean                @default(false) // Pajak bertingkat
  // COA Mapping
  taxAccount_id String?                @db.Char(15) // Link ke COA untuk tax payable/receivable
  // Applicability
  isDefault     Boolean?               @default(false) // Tax scheme default
  effectiveFrom DateTime?              @db.Date // Berlaku mulai tanggal
  effectiveTo   DateTime?              @db.Date // Berlaku sampai tanggal
  // Status & Metadata
  iStatus       MasterRecordStatusEnum @default(Active)
  remarks       String?                @db.VarChar(250)
  seq           Int?                   @default(0)
  createdBy     String?                @db.Char(10)
  createdAt     DateTime               @default(now())
  updatedBy     String?                @db.Char(10)
  updatedAt     DateTime
  company_id    String                 @db.Char(5)
  branch_id     String                 @db.Char(10)
  // Relations
  taxAccount    acc_COA?               @relation(fields: [company_id, taxAccount_id], references: [company_id, id], onUpdate: NoAction)
  taxDetails    cmf_TaxSchemeDetail[]
  arInvoices    arm_Invoice[]
  apInvoices    apm_Invoice[]

  @@id([company_id, id], map: "pk_cmf_TaxScheme")
  @@unique([company_id, schemeCode], map: "unique_tax_scheme_code")
  @@index([company_id, taxType], map: "idx_tax_scheme_type")
}

// Tax Scheme Detail (Detail komponenRpajak - untuk pajak bertingkat atau multi-component)
model cmf_TaxSchemeDetail {
  id               String                 @db.Char(10)
  taxScheme_id     String                 @db.Char(5)
  lineNumber       Int                    @db.SmallInt
  componentName    String                 @db.VarChar(100) // PPN, PPh 22, PPh 23, Luxury Tax, dll
  componentName_en String?                @db.VarChar(100)
  taxRate          Decimal                @db.Decimal(5, 2) // Rate pajak (%)
  taxAccount_id    String                 @db.Char(15) // COA untuk komponen ini
  calculationBase  String?                @db.VarChar(20) // SUBTOTAL, GROSS, NETT
  isAdditive       Boolean                @default(true) // Ditambahkan atau dikurangi
  // Calculation Order
  seq              Int                    @db.SmallInt // Urutan kalkulasi
  // Status
  iStatus          MasterRecordStatusEnum @default(Active)
  remarks          String?                @db.VarChar(250)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  updatedBy        String?                @db.Char(10)
  updatedAt        DateTime
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  taxScheme        cmf_TaxScheme          @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  taxAccount       acc_COA                @relation(fields: [company_id, taxAccount_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, taxScheme_id, id], map: "pk_cmf_TaxSchemeDetail")
  @@index([company_id, taxScheme_id], map: "idx_tax_detail")
}

/// ============================================================================
/// ACCOUNT RECEIVABLE MANAGEMENT (ARM) MODULE
/// ============================================================================
/// Module untuk manage piutang, invoice penjualan, dan penerimaan pembayaran
/// Flow: ServiceOrder → Invoice → Payment → CashReceipt → GL
/// Support: Credit terms, partial payment, credit note/refund

// A/R Invoice (dari Service Order atau Sales) - Account Receivable Management
model arm_Invoice {
  id                     String                   @db.Char(30) // Manual: INV/2025/10/00001
  invoiceNumber          String                   @db.VarChar(30)
  invoiceDate            DateTime                 @default(now())
  dueDate                DateTime?                @db.Date
  transaction_type       String                   @db.Char(5) // "INV"
  transaction_class      String                   @db.Char(10) // "SALES"
  // Tax Configuration
  taxScheme_id           String?                  @db.Char(5) // T1, T2, T3
  // Source Document
  source_module          String?                  @db.VarChar(20) // "SERVICE", "SALES"
  source_document_id     String?                  @db.Char(30) // Service Order ID
  source_document_number String?                  @db.VarChar(30) // SO-2025-10-00001
  // Customer Info
  customer_id            String                   @db.Char(20)
  customerName           String                   @db.VarChar(100)
  customerAddress        String?                  @db.Text
  customerPhone          String?                  @db.VarChar(20)
  customerEmail          String?                  @db.VarChar(100)
  // Vehicle Info (untuk service)
  customerVehicle_id     String?                  @db.Char(20)
  vehicle_customer_id    String?                  @db.Char(20)
  vehicleInfo            String?                  @db.VarChar(250) // Toyota Avanza B 1234 XYZ
  // Amount
  subtotalAmount         Decimal                  @default(0) @db.Decimal(21, 4)
  discountPercent        Decimal?                 @default(0) @db.Decimal(5, 2)
  discountAmount         Decimal?                 @default(0) @db.Decimal(21, 4)
  taxPercent             Decimal?                 @default(0) @db.Decimal(5, 2)
  taxAmount              Decimal?                 @default(0) @db.Decimal(21, 4)
  otherCharges           Decimal?                 @default(0) @db.Decimal(21, 4)
  totalAmount            Decimal                  @db.Decimal(21, 4)
  paidAmount             Decimal?                 @default(0) @db.Decimal(21, 4)
  outstandingAmount      Decimal?                 @db.Decimal(21, 4)
  // Payment Terms
  paymentTermDays        Int?                     @db.SmallInt
  // Status
  invoiceStatus          InvoiceStatusEnum        @default(DRAFT)
  paymentStatus          InvoicePaymentStatusEnum @default(UNPAID)
  isPosted               Boolean?                 @default(false)
  postedDate             DateTime?
  // Notes
  notes                  String?                  @db.Text
  internalNotes          String?                  @db.Text
  // Metadata
  iStatus                MasterRecordStatusEnum   @default(Active)
  remarks                String?                  @db.VarChar(250)
  createdBy              String?                  @db.Char(10)
  createdAt              DateTime                 @default(now())
  updatedBy              String?                  @db.Char(10)
  updatedAt              DateTime
  company_id             String                   @db.Char(5)
  branch_id              String                   @db.Char(10)
  // Relations
  customer               cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  vehicle                cmf_CustomerVehicle?     @relation(fields: [company_id, vehicle_customer_id, customerVehicle_id], references: [company_id, customer_id, id], onUpdate: NoAction)
  serviceOrder           wks_ServiceOrder?        @relation(fields: [company_id, source_document_id], references: [company_id, id], onUpdate: NoAction)
  taxScheme              cmf_TaxScheme?           @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  invoiceDetails         arm_InvoiceDetail[]
  payments               arm_Payment[]
  glTrans                acc_GLTrans[]
  creditNotes            arm_CreditNote[]

  @@id([company_id, id], map: "pk_arm_Invoice")
  @@unique([company_id, invoiceNumber], map: "unique_invoice_number")
  @@index([company_id, customer_id], map: "idx_invoice_customer")
  @@index([company_id, invoiceDate], map: "idx_invoice_date")
  @@index([company_id, invoiceStatus], map: "idx_invoice_status")
}

// Invoice Detail
model arm_InvoiceDetail {
  id              String                 @db.Char(30) // Manual: IND/2025/10/00001
  invoice_id      String                 @db.Char(30)
  lineNumber      Int                    @db.SmallInt
  itemType        InvoiceItemTypeEnum // SERVICE, PART, OTHER
  // Item Info
  item_id         String?                @db.Char(30) // Service Type ID atau Product ID
  itemCode        String?                @db.VarChar(50)
  itemName        String                 @db.VarChar(250)
  itemDescription String?                @db.Text
  // Quantity & Price
  quantity        Decimal                @db.Decimal(12, 4)
  uom             String?                @db.VarChar(10)
  unitPrice       Decimal                @db.Decimal(21, 4)
  discountPercent Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount  Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent      Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount       Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal        Decimal                @db.Decimal(21, 4)
  // COA Mapping
  revenue_coa_id  String?                @db.Char(15) // Revenue account
  // Status
  iStatus         MasterRecordStatusEnum @default(Active)
  remarks         String?                @db.VarChar(250)
  createdBy       String?                @db.Char(10)
  createdAt       DateTime               @default(now())
  updatedBy       String?                @db.Char(10)
  updatedAt       DateTime
  company_id      String                 @db.Char(5)
  branch_id       String                 @db.Char(10)
  // Relations
  invoice         arm_Invoice            @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_InvoiceDetail")
  @@index([company_id, invoice_id], map: "idx_invoice_detail")
}

// Payment (Pembayaran Invoice)
model arm_Payment {
  id                String                   @db.Char(30) // Manual: PAY/2025/10/00001
  paymentNumber     String                   @db.VarChar(30)
  paymentDate       DateTime                 @default(now())
  transaction_type  String                   @db.Char(5) // "PAY"
  transaction_class String                   @db.Char(10) // "SALES"
  // Invoice Info
  invoice_id        String                   @db.Char(30)
  invoiceNumber     String?                  @db.VarChar(30)
  // Customer Info
  customer_id       String                   @db.Char(20)
  customerName      String?                  @db.VarChar(100)
  // Payment Info
  paymentMethod_id  String                   @db.Char(10)
  bankAccount_id    String?                  @db.Char(10) // Jika payment via bank
  referenceNumber   String?                  @db.VarChar(50) // Nomor transfer/QRIS/dll
  // Amount
  paymentAmount     Decimal                  @db.Decimal(21, 4)
  processingFee     Decimal?                 @default(0) @db.Decimal(21, 4)
  netAmount         Decimal                  @db.Decimal(21, 4) // Payment - Fee
  // Status
  paymentStatus     PaymentConfirmStatusEnum @default(PENDING)
  verifiedBy        String?                  @db.Char(10)
  verifiedDate      DateTime?
  isPosted          Boolean?                 @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                  @db.Text
  internalNotes     String?                  @db.Text
  // Proof
  proofImageURL     String?                  @db.VarChar(250) // Bukti transfer
  // Metadata
  iStatus           MasterRecordStatusEnum   @default(Active)
  remarks           String?                  @db.VarChar(250)
  createdBy         String?                  @db.Char(10)
  createdAt         DateTime                 @default(now())
  updatedBy         String?                  @db.Char(10)
  updatedAt         DateTime
  company_id        String                   @db.Char(5)
  branch_id         String                   @db.Char(10)
  // Relations
  invoice           arm_Invoice              @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  customer          cmf_Customer             @relation(fields: [company_id, customer_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod     cmf_PaymentMethod        @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)
  bankAccount       acc_BankAccount?         @relation(fields: [company_id, bankAccount_id], references: [company_id, id], onUpdate: NoAction)
  paymentDetails    arm_PaymentDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_Payment")
  @@unique([company_id, paymentNumber], map: "unique_payment_number")
  @@index([company_id, invoice_id], map: "idx_payment_invoice")
  @@index([company_id, customer_id], map: "idx_payment_customer")
}

// Payment Detail (jika 1 payment untuk multiple invoice atau alokasi)
model arm_PaymentDetail {
  id               String                 @db.Char(30) // Manual: PYD/2025/10/00001
  payment_id       String                 @db.Char(30)
  lineNumber       Int                    @db.SmallInt
  description      String?                @db.VarChar(250)
  paymentMethod_id String                 @db.Char(10)
  amount           Decimal                @db.Decimal(21, 4)
  referenceNumber  String?                @db.VarChar(50)
  // Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  payment          arm_Payment            @relation(fields: [company_id, payment_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod    cmf_PaymentMethod      @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_PaymentDetail")
  @@index([company_id, payment_id], map: "idx_payment_detail")
}

// Cash Receipt (Penerimaan Kas)
model arm_CashReceipt {
  id                String                  @db.Char(30) // Manual: CR/2025/10/00001
  receiptNumber     String                  @db.VarChar(30)
  receiptDate       DateTime                @default(now())
  transaction_type  String                  @db.Char(5) // "CR"
  transaction_class String                  @db.Char(10) // "CASH"
  // Payer Info
  receivedFrom      String                  @db.VarChar(150) // Nama pembayar
  receivedFromType  String?                 @db.VarChar(20) // CUSTOMER, SUPPLIER, OTHER
  receivedFrom_id   String?                 @db.Char(20)
  // Amount
  totalAmount       Decimal                 @db.Decimal(21, 4)
  // Status
  receiptStatus     CashReceiptStatusEnum   @default(DRAFT)
  isPosted          Boolean?                @default(false)
  postedDate        DateTime?
  // Notes
  description       String?                 @db.Text
  notes             String?                 @db.Text
  // Metadata
  iStatus           MasterRecordStatusEnum  @default(Active)
  remarks           String?                 @db.VarChar(250)
  createdBy         String?                 @db.Char(10)
  createdAt         DateTime                @default(now())
  updatedBy         String?                 @db.Char(10)
  updatedAt         DateTime
  company_id        String                  @db.Char(5)
  branch_id         String                  @db.Char(10)
  // Relations
  receiptDetails    arm_CashReceiptDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_arm_CashReceipt")
  @@unique([company_id, receiptNumber], map: "unique_receipt_number")
}

// Cash Receipt Detail
model arm_CashReceiptDetail {
  id             String                 @db.Char(30) // Manual: CRD/2025/10/00001
  cashReceipt_id String                 @db.Char(30)
  lineNumber     Int                    @db.SmallInt
  coa_id         String                 @db.Char(15) // COA untuk debit
  description    String?                @db.VarChar(250)
  amount         Decimal                @db.Decimal(21, 4)
  // Metadata
  iStatus        MasterRecordStatusEnum @default(Active)
  createdBy      String?                @db.Char(10)
  createdAt      DateTime               @default(now())
  company_id     String                 @db.Char(5)
  branch_id      String                 @db.Char(10)
  // Relations
  cashReceipt    arm_CashReceipt        @relation(fields: [company_id, cashReceipt_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_arm_CashReceiptDetail")
  @@index([company_id, cashReceipt_id], map: "idx_cash_receipt_detail")
}

/// ============================================================================
/// ACCOUNT PAYABLE MANAGEMENT (APM) MODULE
/// ============================================================================
/// Module untuk manage hutang pembelian dan pembayaran ke supplier
/// Flow: PurchaseReceive → A/P Invoice → Payment → PurchaseReturn → GL
/// Support: Payment terms, withholding tax, partial payment, debit note

// A/P Invoice (Invoice dari Supplier) - Hutang
model apm_Invoice {
  id                    String                 @db.Char(30) // Manual: APINV/2025/10/00001
  invoiceNumber         String                 @db.VarChar(30)
  invoiceDate           DateTime               @default(now())
  dueDate               DateTime?              @db.Date
  transaction_type      String                 @db.Char(5) // "APINV"
  transaction_class     String                 @db.Char(10) // "PURCHASE"
  // Tax Configuration
  taxScheme_id          String?                @db.Char(5) // V1, V2, V3
  // Source Document
  source_module         String?                @db.VarChar(20) // "PROCUREMENT"
  purchaseReceive_id    String?                @db.Char(20) // Link ke Purchase Receive
  purchaseOrder_id      String?                @db.Char(20) // Link ke PO
  receiveNumber         String?                @db.VarChar(30)
  poNumber              String?                @db.VarChar(30)
  // Supplier Info
  supplier_id           String                 @db.Char(20)
  supplierName          String                 @db.VarChar(150)
  supplierAddress       String?                @db.Text
  supplierPhone         String?                @db.VarChar(20)
  supplierEmail         String?                @db.VarChar(100)
  // Supplier Invoice Info
  supplierInvoiceNumber String?                @db.VarChar(30)
  supplierInvoiceDate   DateTime?              @db.Date
  taxInvoiceNumber      String?                @db.VarChar(30) // Faktur Pajak
  // Amount
  subtotalAmount        Decimal                @default(0) @db.Decimal(21, 4)
  discountPercent       Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount        Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent            Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount             Decimal?               @default(0) @db.Decimal(21, 4)
  shippingCost          Decimal?               @default(0) @db.Decimal(21, 4)
  otherCharges          Decimal?               @default(0) @db.Decimal(21, 4)
  totalAmount           Decimal                @db.Decimal(21, 4)
  paidAmount            Decimal?               @default(0) @db.Decimal(21, 4)
  outstandingAmount     Decimal?               @db.Decimal(21, 4)
  // Payment Terms
  paymentTermDays       Int?                   @db.SmallInt
  paymentDueDate        DateTime?              @db.Date
  // Status
  invoiceStatus         APInvoiceStatusEnum    @default(DRAFT)
  paymentStatus         APPaymentStatusEnum    @default(UNPAID)
  isPosted              Boolean?               @default(false)
  postedDate            DateTime?
  // Notes
  notes                 String?                @db.Text
  internalNotes         String?                @db.Text
  // Metadata
  iStatus               MasterRecordStatusEnum @default(Active)
  remarks               String?                @db.VarChar(250)
  createdBy             String?                @db.Char(10)
  createdAt             DateTime               @default(now())
  updatedBy             String?                @db.Char(10)
  updatedAt             DateTime
  company_id            String                 @db.Char(5)
  branch_id             String                 @db.Char(10)
  // Relations
  supplier              prc_Supplier           @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  purchaseReceive       prc_PurchaseReceive?   @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder         prc_PurchaseOrder?     @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  taxScheme             cmf_TaxScheme?         @relation(fields: [company_id, taxScheme_id], references: [company_id, id], onUpdate: NoAction)
  invoiceDetails        apm_InvoiceDetail[]
  payments              apm_Payment[]
  glTrans               acc_GLTrans[]

  @@id([company_id, id], map: "pk_apm_Invoice")
  @@unique([company_id, invoiceNumber], map: "unique_ap_invoice_number")
  @@index([company_id, supplier_id], map: "idx_ap_invoice_supplier")
  @@index([company_id, invoiceDate], map: "idx_ap_invoice_date")
  @@index([company_id, invoiceStatus], map: "idx_ap_invoice_status")
}

// A/P Invoice Detail
model apm_InvoiceDetail {
  id                String                 @db.Char(30) // Manual: APID/2025/10/00001
  apInvoice_id      String                 @db.Char(30)
  lineNumber        Int                    @db.SmallInt
  // Product Info
  product_id        String?                @db.Char(20)
  productVariant_id String?                @db.Char(30)
  productName       String                 @db.VarChar(250)
  productCode       String?                @db.VarChar(50)
  description       String?                @db.Text
  // Quantity & Price
  quantity          Decimal                @db.Decimal(12, 4)
  uom               String?                @db.VarChar(10)
  unitPrice         Decimal                @db.Decimal(21, 4)
  discountPercent   Decimal?               @default(0) @db.Decimal(5, 2)
  discountAmount    Decimal?               @default(0) @db.Decimal(21, 4)
  taxPercent        Decimal?               @default(0) @db.Decimal(5, 2)
  taxAmount         Decimal?               @default(0) @db.Decimal(21, 4)
  subtotal          Decimal                @db.Decimal(21, 4)
  // COA Mapping
  expense_coa_id    String?                @db.Char(15) // Expense/Inventory account
  // Status
  iStatus           MasterRecordStatusEnum @default(Active)
  remarks           String?                @db.VarChar(250)
  createdBy         String?                @db.Char(10)
  createdAt         DateTime               @default(now())
  updatedBy         String?                @db.Char(10)
  updatedAt         DateTime
  company_id        String                 @db.Char(5)
  branch_id         String                 @db.Char(10)
  // Relations
  apInvoice         apm_Invoice            @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  product           imc_Product?           @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_apm_InvoiceDetail")
  @@index([company_id, apInvoice_id], map: "idx_ap_invoice_detail")
}

// A/P Payment (Pembayaran ke Supplier)
model apm_Payment {
  id                String                     @db.Char(30) // Manual: APPAY/2025/10/00001
  paymentNumber     String                     @db.VarChar(30)
  paymentDate       DateTime                   @default(now())
  transaction_type  String                     @db.Char(5) // "APPAY"
  transaction_class String                     @db.Char(10) // "PURCHASE"
  // Invoice Info
  apInvoice_id      String                     @db.Char(30)
  invoiceNumber     String?                    @db.VarChar(30)
  // Supplier Info
  supplier_id       String                     @db.Char(20)
  supplierName      String?                    @db.VarChar(150)
  // Payment Info
  paymentMethod_id  String                     @db.Char(10)
  bankAccount_id    String?                    @db.Char(10) // Bank account yang digunakan
  referenceNumber   String?                    @db.VarChar(50) // Nomor transfer/giro/dll
  // Amount
  paymentAmount     Decimal                    @db.Decimal(21, 4)
  processingFee     Decimal?                   @default(0) @db.Decimal(21, 4)
  netAmount         Decimal                    @db.Decimal(21, 4) // Payment + Fee
  // Status
  paymentStatus     APPaymentConfirmStatusEnum @default(PENDING)
  verifiedBy        String?                    @db.Char(10)
  verifiedDate      DateTime?
  isPosted          Boolean?                   @default(false)
  postedDate        DateTime?
  // Notes
  notes             String?                    @db.Text
  internalNotes     String?                    @db.Text
  // Proof
  proofImageURL     String?                    @db.VarChar(250) // Bukti transfer
  // Metadata
  iStatus           MasterRecordStatusEnum     @default(Active)
  remarks           String?                    @db.VarChar(250)
  createdBy         String?                    @db.Char(10)
  createdAt         DateTime                   @default(now())
  updatedBy         String?                    @db.Char(10)
  updatedAt         DateTime
  company_id        String                     @db.Char(5)
  branch_id         String                     @db.Char(10)
  // Relations
  apInvoice         apm_Invoice                @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  supplier          prc_Supplier               @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod     cmf_PaymentMethod          @relation(fields: [id], onUpdate: NoAction, references: [id])
  bankAccount       acc_BankAccount?           @relation(fields: [company_id, bankAccount_id], references: [company_id, id], onUpdate: NoAction)
  paymentDetails    apm_PaymentDetail[]
  glTrans           acc_GLTrans[]

  @@id([company_id, id], map: "pk_apm_Payment")
  @@unique([company_id, paymentNumber], map: "unique_ap_payment_number")
  @@index([company_id, apInvoice_id], map: "idx_ap_payment_invoice")
  @@index([company_id, supplier_id], map: "idx_ap_payment_supplier")
}

// A/P Payment Detail (jika 1 payment untuk multiple invoice)
model apm_PaymentDetail {
  id               String                 @db.Char(30) // Manual: APPD/2025/10/00001
  apPayment_id     String                 @db.Char(30)
  lineNumber       Int                    @db.SmallInt
  description      String?                @db.VarChar(250)
  paymentMethod_id String                 @db.Char(10)
  amount           Decimal                @db.Decimal(21, 4)
  referenceNumber  String?                @db.VarChar(50)
  // Metadata
  iStatus          MasterRecordStatusEnum @default(Active)
  createdBy        String?                @db.Char(10)
  createdAt        DateTime               @default(now())
  company_id       String                 @db.Char(5)
  branch_id        String                 @db.Char(10)
  // Relations
  apPayment        apm_Payment            @relation(fields: [company_id, apPayment_id], references: [company_id, id], onUpdate: NoAction)
  paymentMethod    cmf_PaymentMethod      @relation(fields: [paymentMethod_id], references: [id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_apm_PaymentDetail")
  @@index([company_id, apPayment_id], map: "idx_ap_payment_detail")
}

// Purchase Return (Return barang ke Supplier)
model prc_PurchaseReturn {
  id                   String                     @db.Char(30) // Manual: PRET/2025/10/00001
  returnNumber         String                     @db.VarChar(30)
  returnDate           DateTime                   @default(now())
  transaction_type     String                     @db.Char(5) // "PRET"
  transaction_class    String                     @db.Char(10) // "PURCHASE"
  // Source Document
  purchaseReceive_id   String                     @db.Char(20)
  purchaseOrder_id     String?                    @db.Char(20)
  supplier_id          String                     @db.Char(20)
  // Reference
  receiveNumber        String?                    @db.VarChar(30)
  poNumber             String?                    @db.VarChar(30)
  supplierReturnNumber String?                    @db.VarChar(30) // Nomor retur dari supplier
  // Return Info
  returnReason         ReturnReasonEnum? // DAMAGED, DEFECTIVE, WRONG_ITEM, EXCESS, OTHER
  returnReasonDesc     String?                    @db.Text
  warehouse_id         String?                    @db.Char(4)
  // Amount
  subtotalAmount       Decimal                    @default(0) @db.Decimal(21, 4)
  taxAmount            Decimal?                   @default(0) @db.Decimal(21, 4)
  totalAmount          Decimal                    @db.Decimal(21, 4)
  // Status
  returnStatus         ReturnStatusEnum           @default(DRAFT)
  approvalStatus       ApprovalStatusEnum?        @default(PENDING)
  approvedBy           String?                    @db.Char(10)
  approvedDate         DateTime?
  isPosted             Boolean?                   @default(false)
  postedDate           DateTime?
  // Notes
  notes                String?                    @db.Text
  internalNotes        String?                    @db.Text
  // Metadata
  iStatus              MasterRecordStatusEnum     @default(Active)
  remarks              String?                    @db.VarChar(250)
  createdBy            String?                    @db.Char(10)
  createdAt            DateTime                   @default(now())
  updatedBy            String?                    @db.Char(10)
  updatedAt            DateTime
  company_id           String                     @db.Char(5)
  branch_id            String                     @db.Char(10)
  // Relations
  purchaseReceive      prc_PurchaseReceive        @relation(fields: [company_id, purchaseReceive_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder        prc_PurchaseOrder?         @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  supplier             prc_Supplier               @relation(fields: [company_id, supplier_id], references: [company_id, id], onUpdate: NoAction)
  warehouse            imc_Warehouse?             @relation(fields: [warehouse_id], references: [id], onUpdate: NoAction)
  returnDetails        prc_PurchaseReturnDetail[]
  glTrans              acc_GLTrans[]

  @@id([company_id, id], map: "pk_prc_PurchaseReturn")
  @@unique([company_id, returnNumber], map: "unique_return_number")
  @@index([company_id, supplier_id], map: "idx_return_supplier")
  @@index([company_id, returnDate], map: "idx_return_date")
}

// Purchase Return Detail
model prc_PurchaseReturnDetail {
  id                String                  @db.Char(30) // Manual: PRTD/2025/10/00001
  purchaseReturn_id String                  @db.Char(30)
  lineNumber        Int                     @db.SmallInt
  // Product Info
  product_id        String                  @db.Char(20)
  productVariant_id String?                 @db.Char(30)
  productName       String                  @db.VarChar(250)
  productCode       String?                 @db.VarChar(50)
  // Quantity
  returnedQty       Decimal                 @db.Decimal(12, 4)
  acceptedQty       Decimal?                @db.Decimal(12, 4) // Qty yang diterima supplier
  rejectedQty       Decimal?                @default(0) @db.Decimal(12, 4)
  uom               String                  @db.VarChar(10)
  // Pricing
  unitPrice         Decimal                 @db.Decimal(21, 4)
  discountAmount    Decimal?                @default(0) @db.Decimal(21, 4)
  taxAmount         Decimal?                @default(0) @db.Decimal(21, 4)
  subtotal          Decimal                 @db.Decimal(21, 4)
  // Return Reason
  returnReason      String?                 @db.VarChar(250)
  // Storage Location
  warehouse_id      String?                 @db.Char(4)
  floor_id          String?                 @db.Char(5)
  shelf_id          String?                 @db.Char(15)
  row_id            String?                 @db.Char(15)
  batchNumber       String?                 @db.VarChar(30)
  // Status
  lineStatus        ReturnDetailStatusEnum? @default(PENDING)
  iStatus           MasterRecordStatusEnum  @default(Active)
  remarks           String?                 @db.VarChar(250)
  createdBy         String?                 @db.Char(10)
  createdAt         DateTime                @default(now())
  updatedBy         String?                 @db.Char(10)
  updatedAt         DateTime
  company_id        String                  @db.Char(5)
  branch_id         String                  @db.Char(10)
  // Relations
  purchaseReturn    prc_PurchaseReturn      @relation(fields: [company_id, purchaseReturn_id], references: [company_id, id], onUpdate: NoAction)
  product           imc_Product             @relation(fields: [company_id, product_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_prc_PurchaseReturnDetail")
  @@index([company_id, purchaseReturn_id], map: "idx_return_detail")
}

/// ============================================================================
/// GENERAL LEDGER MODULE
/// ============================================================================
/// Module untuk General Ledger - Semua transaksi uang bermuara ke sini
/// Flow: Any Transaction → acc_GLTrans → acc_GLTransDetail
/// Support: Multi-source posting, reversal, drill-down ke source document

// GL Transaction (Journal Entry Header) - Semua transaksi uang bermuara ke sini
model acc_GLTrans {
  id                     String                 @db.Char(30) // Manual: JV/2025/10/00001
  journalNumber          String                 @db.VarChar(30)
  journalDate            DateTime               @default(now())
  transaction_type       String                 @db.Char(5) // JV, INV, PAY, PO, GRN, dll
  transaction_class      String                 @db.Char(10) // SALES, PURCHASE, CASH, BANK, JOURNAL
  // Source Document
  source_module          String?                @db.VarChar(20) // SERVICE, PROCUREMENT, ACCOUNTING, INVENTORY
  source_document_id     String?                @db.Char(30)
  source_document_number String?                @db.VarChar(30)
  // References
  invoice_id             String?                @db.Char(30) // A/R Invoice
  payment_id             String?                @db.Char(30) // A/R Payment
  cashReceipt_id         String?                @db.Char(30) // Cash Receipt
  apInvoice_id           String?                @db.Char(30) // A/P Invoice
  apPayment_id           String?                @db.Char(30) // A/P Payment
  purchaseOrder_id       String?                @db.Char(20) // Purchase Order
  purchaseReturn_id      String?                @db.Char(30) // Purchase Return
  creditNote_id          String?                @db.Char(30) // Credit Note
  // Description
  description            String                 @db.VarChar(250)
  notes                  String?                @db.Text
  // Total Amount
  totalDebit             Decimal                @default(0) @db.Decimal(21, 4)
  totalCredit            Decimal                @default(0) @db.Decimal(21, 4)
  // Status
  journalStatus          JournalStatusEnum      @default(DRAFT)
  isPosted               Boolean?               @default(false)
  postedBy               String?                @db.Char(10)
  postedDate             DateTime?
  isReversed             Boolean?               @default(false)
  reversedBy             String?                @db.Char(10)
  reversedDate           DateTime?
  reversalJournal_id     String?                @db.Char(30) // Link ke reversal journal
  // Metadata
  iStatus                MasterRecordStatusEnum @default(Active)
  remarks                String?                @db.VarChar(250)
  createdBy              String?                @db.Char(10)
  createdAt              DateTime               @default(now())
  updatedBy              String?                @db.Char(10)
  updatedAt              DateTime
  company_id             String                 @db.Char(5)
  branch_id              String                 @db.Char(10)
  // Relations
  invoice                arm_Invoice?           @relation(fields: [company_id, invoice_id], references: [company_id, id], onUpdate: NoAction)
  payment                arm_Payment?           @relation(fields: [company_id, payment_id], references: [company_id, id], onUpdate: NoAction)
  cashReceipt            arm_CashReceipt?       @relation(fields: [company_id, cashReceipt_id], references: [company_id, id], onUpdate: NoAction)
  apInvoice              apm_Invoice?           @relation(fields: [company_id, apInvoice_id], references: [company_id, id], onUpdate: NoAction)
  apPayment              apm_Payment?           @relation(fields: [company_id, apPayment_id], references: [company_id, id], onUpdate: NoAction)
  purchaseOrder          prc_PurchaseOrder?     @relation(fields: [company_id, purchaseOrder_id], references: [company_id, id], onUpdate: NoAction)
  purchaseReturn         prc_PurchaseReturn?    @relation(fields: [company_id, purchaseReturn_id], references: [company_id, id], onUpdate: NoAction)
  creditNote             arm_CreditNote?        @relation(fields: [company_id, creditNote_id], references: [company_id, id], onUpdate: NoAction)
  glTransDetails         acc_GLTransDetail[]

  @@id([company_id, id], map: "pk_acc_GLTrans")
  @@unique([company_id, journalNumber], map: "unique_journal_number")
  @@index([company_id, journalDate], map: "idx_gl_date")
  @@index([company_id, transaction_type], map: "idx_gl_trx_type")
}

// GL Transaction Detail (Journal Entry Detail) - Detail transaksi GL
model acc_GLTransDetail {
  id           String                 @db.Char(30) // Manual: GLD/2025/10/00001
  glTrans_id   String                 @db.Char(30)
  lineNumber   Int                    @db.SmallInt
  coa_id       String                 @db.Char(15)
  description  String?                @db.VarChar(250)
  debitAmount  Decimal?               @default(0) @db.Decimal(21, 4)
  creditAmount Decimal?               @default(0) @db.Decimal(21, 4)
  // Additional Info
  costCenter   String?                @db.VarChar(20)
  department   String?                @db.VarChar(20)
  project      String?                @db.VarChar(20)
  // Metadata
  iStatus      MasterRecordStatusEnum @default(Active)
  createdBy    String?                @db.Char(10)
  createdAt    DateTime               @default(now())
  company_id   String                 @db.Char(5)
  branch_id    String                 @db.Char(10)
  // Relations
  glTrans      acc_GLTrans            @relation(fields: [company_id, glTrans_id], references: [company_id, id], onUpdate: NoAction)
  coa          acc_COA                @relation(fields: [company_id, coa_id], references: [company_id, id], onUpdate: NoAction)

  @@id([company_id, id], map: "pk_acc_GLTransDetail")
  @@index([company_id, glTrans_id], map: "idx_gl_detail")
  @@index([company_id, coa_id], map: "idx_gl_detail_coa")
}

/// ============================================================================
/// ENUMS - All System Enumerations
/// ============================================================================
/// Semua enum yang digunakan di seluruh sistem
/// Grouped by: General Status, SAAS, Service, Procurement, Accounting, etc.

// ============================================================================
// GENERAL STATUS ENUMS
// ============================================================================

enum MasterRecordStatusEnum {
  InActive @map("0")
  Active   @map("1")
}

enum TransactionRecordStatusEnum {
  DRAFT    @map("0")
  APPROVED @map("1")
  PENDING  @map("2")
  CANCEL   @map("3")
}

enum ApprovalStatusEnum {
  PENDING  @map("0")
  APPROVED @map("1")
  REJECTED @map("2")
}

enum PostingStatusEnum {
  NOT_POSTED @map("0")
  POSTED     @map("1")
}

enum PriorityEnum {
  LOW    @map("L")
  NORMAL @map("N")
  HIGH   @map("H")
  URGENT @map("U")
}

// ============================================================================
// SAAS SUBSCRIPTION ENUMS
// ============================================================================

enum BillingCycleEnum {
  MONTHLY @map("M") // Bulanan
  YEARLY  @map("Y") // Tahunan
}

enum SubscriptionStatusEnum {
  TRIAL     @map("T") // Trial period
  ACTIVE    @map("A") // Active/running
  EXPIRED   @map("E") // Expired
  SUSPENDED @map("S") // Suspended
  CANCELLED @map("C") // Cancelled
}

enum BillingStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  OVERDUE @map("3") // Overdue
  WAIVED  @map("9") // Dibebaskan
}

enum AddonStatusEnum {
  ACTIVE    @map("A") // Active
  SUSPENDED @map("S") // Suspended
  EXPIRED   @map("E") // Expired
  CANCELLED @map("C") // Cancelled
}

// ============================================================================
// CUSTOMER & VEHICLE ENUMS
// ============================================================================

enum CustomerTypeEnum {
  INDIVIDUAL @map("I")
  CORPORATE  @map("C")
}

enum GenderEnum {
  MALE   @map("M")
  FEMALE @map("F")
}

enum FuelLevelEnum {
  EMPTY   @map("E")
  QUARTER @map("Q")
  HALF    @map("H")
  FULL    @map("F")
}

// ============================================================================
// SERVICE MANAGEMENT ENUMS
// ============================================================================

enum ServiceCategoryEnum {
  MAINTENANCE @map("MAINT")
  REPAIR      @map("REPAIR")
  BODYWORK    @map("BODY")
  WASH        @map("WASH")
  INSPECTION  @map("INSP")
  TUNEUP      @map("TUNE")
  EMERGENCY   @map("EMERG")
}

enum MechanicLevelEnum {
  JUNIOR  @map("JR")
  SENIOR  @map("SR")
  MASTER  @map("MT")
  FOREMAN @map("FM")
}

enum ServiceBayTypeEnum {
  GENERAL       @map("GEN")
  HEAVY_DUTY    @map("HEAVY")
  QUICK_SERVICE @map("QUICK")
  BODYWORK      @map("BODY")
  WASH          @map("WASH")
}

enum ServiceOrderStatusEnum {
  DRAFT       @map("0")
  CONFIRMED   @map("1")
  IN_PROGRESS @map("2")
  ON_HOLD     @map("3")
  QC_CHECK    @map("4")
  COMPLETED   @map("5")
  DELIVERED   @map("6")
  CANCELLED   @map("9")
}

enum PaymentStatusEnum {
  UNPAID   @map("0")
  PARTIAL  @map("1")
  PAID     @map("2")
  REFUNDED @map("3")
}

enum DetailTypeEnum {
  SERVICE @map("S")
  PART    @map("P")
}

enum DetailStatusEnum {
  PENDING     @map("0")
  IN_PROGRESS @map("1")
  COMPLETED   @map("2")
  CANCELLED   @map("9")
}

// ============================================================================
// PROCUREMENT MANAGEMENT ENUMS
// ============================================================================

enum SupplierTypeEnum {
  VENDOR       @map("V")
  DISTRIBUTOR  @map("D")
  MANUFACTURER @map("M")
  AGENT        @map("A")
}

enum PurchaseOrderStatusEnum {
  DRAFT     @map("0")
  SUBMITTED @map("1")
  APPROVED  @map("2")
  CONFIRMED @map("3")
  PARTIAL   @map("4")
  COMPLETED @map("5")
  CANCELLED @map("9")
}

enum ReceiveStatusEnum {
  NOT_RECEIVED @map("0")
  DRAFT        @map("1")
  PARTIAL      @map("2")
  RECEIVED     @map("3")
  COMPLETED    @map("5")
}

enum PODetailStatusEnum {
  OPEN           @map("0")
  PARTIAL        @map("1")
  FULLY_RECEIVED @map("2")
  CANCELLED      @map("9")
}

enum QualityStatusEnum {
  PENDING  @map("0")
  APPROVED @map("1")
  REJECTED @map("2")
  PARTIAL  @map("3")
}

enum ReceiveDetailStatusEnum {
  RECEIVED @map("0")
  ACCEPTED @map("1")
  REJECTED @map("2")
  DAMAGED  @map("3")
}

// ============================================================================
// INVENTORY MOVEMENT ENUMS
// ============================================================================

enum InternalMovementTypeEnum {
  TRANSFER    @map("TRF") // Transfer antar warehouse
  ADJUSTMENT  @map("ADJ") // Adjustment stock (tambah/kurang)
  RETURN      @map("RET") // Return dari customer/service
  SCRAP       @map("SCP") // Barang rusak/scrap
  ASSEMBLY    @map("ASM") // Assembly/rakit produk
  DISASSEMBLY @map("DIS") // Disassembly/bongkar produk
  ALLOCATION  @map("ALC") // Alokasi untuk service/project
  CONSUMPTION @map("CSM") // Konsumsi internal
}

enum TransactionTypeEnum {
  IN  @map("I") // Inventory IN
  OUT @map("O") // Inventory OUT
}

enum MovementStatusEnum {
  DRAFT      @map("0")
  REQUESTED  @map("1")
  APPROVED   @map("2")
  IN_TRANSIT @map("3")
  COMPLETED  @map("5")
  CANCELLED  @map("9")
}

enum MovementDetailStatusEnum {
  PENDING   @map("0")
  MOVED     @map("1")
  RECEIVED  @map("2")
  PARTIAL   @map("3")
  CANCELLED @map("9")
}

// ============================================================================
// COMPLAINT MANAGEMENT ENUMS
// ============================================================================

enum ComplaintTypeEnum {
  SERVICE_QUALITY @map("SQ") // Kualitas service
  PARTS_QUALITY   @map("PQ") // Kualitas parts
  PRICING         @map("PR") // Masalah harga
  DELAY           @map("DL") // Keterlambatan
  STAFF_BEHAVIOR  @map("SB") // Perilaku staff
  FACILITY        @map("FC") // Fasilitas
  WARRANTY        @map("WR") // Garansi
  OTHER           @map("OT") // Lainnya
}

enum SeverityEnum {
  LOW      @map("L") // Rendah
  MEDIUM   @map("M") // Sedang
  HIGH     @map("H") // Tinggi
  CRITICAL @map("C") // Kritis
}

enum ComplaintSourceEnum {
  PHONE        @map("PH") // Telepon
  EMAIL        @map("EM") // Email
  WHATSAPP     @map("WA") // WhatsApp
  IN_PERSON    @map("IP") // Langsung
  SOCIAL_MEDIA @map("SM") // Social media
  WEBSITE      @map("WB") // Website
  SURVEY       @map("SV") // Survey
}

enum ComplaintStatusEnum {
  OPEN          @map("0") // Baru dibuka
  ASSIGNED      @map("1") // Sudah di-assign
  INVESTIGATING @map("2") // Sedang investigasi
  IN_PROGRESS   @map("3") // Sedang ditangani
  RESOLVED      @map("4") // Sudah resolved
  CLOSED        @map("5") // Ditutup
  REOPENED      @map("6") // Dibuka kembali
  REJECTED      @map("9") // Ditolak
}

enum ComplaintLogTypeEnum {
  STATUS_CHANGE @map("SC") // Perubahan status
  ASSIGNMENT    @map("AS") // Assignment
  RESPONSE      @map("RS") // Response/jawaban
  ESCALATION    @map("ES") // Escalation
  RESOLUTION    @map("RE") // Resolution
  FOLLOW_UP     @map("FU") // Follow up
  NOTE          @map("NT") // Catatan
  CALL          @map("CL") // Telepon
  EMAIL_SENT    @map("EM") // Email terkirim
  COMPENSATION  @map("CP") // Kompensasi diberikan
}

// ============================================================================
// SERVICE RETURN & REWORK ENUMS
// ============================================================================

enum ReworkReasonEnum {
  POOR_QUALITY @map("PQ") // Kualitas service buruk
  INCOMPLETE   @map("IC") // Service tidak lengkap
  WRONG_PART   @map("WP") // Part yang dipasang salah
  MALFUNCTION  @map("MF") // Masih bermasalah setelah service
  DAMAGE       @map("DM") // Rusak karena kesalahan mekanik
  OTHER        @map("OT") // Lainnya
}

enum ReworkStatusEnum {
  SCHEDULED   @map("0") // Dijadwalkan
  IN_PROGRESS @map("1") // Sedang dikerjakan
  QC_CHECK    @map("2") // QC check
  COMPLETED   @map("3") // Selesai
  CANCELLED   @map("9") // Dibatalkan
}

enum ReworkActionEnum {
  REDO    @map("RD") // Kerjakan ulang
  REPLACE @map("RP") // Ganti part
  ADJUST  @map("AD") // Adjust/penyesuaian
  REFUND  @map("RF") // Refund uang
  VOUCHER @map("VC") // Voucher
}

enum CreditReasonEnum {
  SERVICE_ISSUE @map("SI") // Masalah service
  OVERCHARGE    @map("OC") // Overcharge/salah harga
  GOODWILL      @map("GW") // Goodwill/kompensasi
  RETURN        @map("RT") // Return service/parts
  COMPLAINT     @map("CP") // Complaint settlement
  OTHER         @map("OT") // Lainnya
}

enum RefundMethodEnum {
  CASH              @map("CSH") // Cash/tunai
  BANK_TRANSFER     @map("TRF") // Transfer bank
  CREDIT_TO_ACCOUNT @map("CTA") // Credit ke akun (piutang)
  VOUCHER           @map("VCH") // Voucher/credit note
  OFFSET            @map("OFF") // Offset dengan invoice lain
}

enum CreditNoteStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("3") // Posted ke GL
  REFUNDED  @map("4") // Sudah direfund
  CANCELLED @map("9") // Cancelled
}

// ============================================================================
// ACCOUNTING & GL ENUMS
// ============================================================================

enum DocumentResetEnum {
  NEVER @map("N") // Tidak pernah reset
  YEAR  @map("Y") // Reset per tahun
  MONTH @map("M") // Reset per bulan
  DAY   @map("D") // Reset per hari
}

enum PaymentMethodTypeEnum {
  CASH    @map("CASH") // Tunai
  BANK    @map("BANK") // Transfer bank
  CARD    @map("CARD") // Kartu debit/credit
  EWALLET @map("EWLT") // E-wallet (GoPay, OVO, dll)
  QRIS    @map("QRIS") // QRIS
  GIRO    @map("GIRO") // Giro/Cheque
}

enum COATypeEnum {
  ASSET     @map("A") // Harta/Aset
  LIABILITY @map("L") // Kewajiban/Hutang
  EQUITY    @map("E") // Modal
  REVENUE   @map("R") // Pendapatan
  EXPENSE   @map("X") // Beban/Biaya
}

enum BalanceTypeEnum {
  DEBIT  @map("D") // Normal balance Debit
  CREDIT @map("C") // Normal balance Credit
}

enum InvoiceStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  SENT      @map("3") // Sent to customer
  OVERDUE   @map("4") // Overdue
  PAID      @map("5") // Paid
  CANCELLED @map("9") // Cancelled
}

enum InvoicePaymentStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  REFUND  @map("3") // Refund
}

enum InvoiceItemTypeEnum {
  SERVICE @map("S") // Jasa service
  PART    @map("P") // Spare part
  OTHER   @map("O") // Lainnya
}

enum PaymentConfirmStatusEnum {
  PENDING   @map("0") // Pending verification
  VERIFIED  @map("1") // Verified/confirmed
  REJECTED  @map("2") // Rejected
  CANCELLED @map("9") // Cancelled
}

enum CashReceiptStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("5") // Posted ke GL
  CANCELLED @map("9") // Cancelled
}

enum JournalStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  POSTED    @map("5") // Posted
  REVERSED  @map("8") // Reversed
  CANCELLED @map("9") // Cancelled
}

enum APInvoiceStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  RECEIVED  @map("3") // Invoice received
  OVERDUE   @map("4") // Overdue
  PAID      @map("5") // Paid
  CANCELLED @map("9") // Cancelled
}

enum APPaymentStatusEnum {
  UNPAID  @map("0") // Belum dibayar
  PARTIAL @map("1") // Dibayar sebagian
  PAID    @map("2") // Lunas
  VOID    @map("9") // Void
}

enum APPaymentConfirmStatusEnum {
  PENDING   @map("0") // Pending verification
  VERIFIED  @map("1") // Verified/confirmed
  REJECTED  @map("2") // Rejected
  CANCELLED @map("9") // Cancelled
}

enum ReturnReasonEnum {
  DAMAGED    @map("DMG") // Barang rusak
  DEFECTIVE  @map("DEF") // Cacat/defect
  WRONG_ITEM @map("WRG") // Barang salah
  EXCESS     @map("EXC") // Kelebihan
  EXPIRED    @map("EXP") // Kadaluarsa
  OTHER      @map("OTH") // Lainnya
}

enum ReturnStatusEnum {
  DRAFT     @map("0") // Draft
  SUBMITTED @map("1") // Submitted
  APPROVED  @map("2") // Approved
  SHIPPED   @map("3") // Dikirim ke supplier
  ACCEPTED  @map("4") // Diterima supplier
  COMPLETED @map("5") // Selesai
  REJECTED  @map("8") // Ditolak supplier
  CANCELLED @map("9") // Cancelled
}

enum ReturnDetailStatusEnum {
  PENDING   @map("0") // Pending
  SHIPPED   @map("1") // Dikirim
  ACCEPTED  @map("2") // Diterima supplier
  REJECTED  @map("3") // Ditolak
  CANCELLED @map("9") // Cancelled
}

enum TaxTypeEnum {
  SALES    @map("S") // Tax untuk Sales (Output Tax / PPN Keluaran)
  PURCHASE @map("P") // Tax untuk Purchase (Input Tax / PPN Masukan)
  WHT      @map("W") // Withholding Tax (PPh Potong)
  OTHER    @map("O") // Tax lainnya
}

```

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookingService } from './booking.service';

@Module({
  imports: [PrismaModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}


```

```typescript
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

type DateRange = { start: Date; end: Date };

function rangesOverlap(a: DateRange, b: DateRange, bufferMinutes = 0): boolean {
  const bufferMs = bufferMinutes * 60_000;
  const aStart = a.start.getTime();
  const aEnd = a.end.getTime();
  const bStart = b.start.getTime();
  const bEnd = b.end.getTime();
  return aStart < (bEnd + bufferMs) && bStart < (aEnd + bufferMs);
}

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBranchBufferMinutes(companyId: string, branchId: string, when: Date): Promise<number> {
    const weekday = when.getDay(); // 0..6
    const wh = await this.prisma.wks_BranchWorkingHour.findUnique({
      where: { company_id_branch_id_weekday: { company_id: companyId, branch_id: branchId, weekday } },
      select: { bookingBufferMinutes: true },
    });
    return wh?.bookingBufferMinutes ?? 0;
  }

  async isHoliday(companyId: string, branchId: string, date: Date): Promise<boolean> {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    const count = await this.prisma.wks_BranchHoliday.count({
      where: {
        company_id: companyId,
        date: { gte: start, lte: end },
        OR: [{ branch_id: branchId }, { branch_id: null }],
        isClosed: true,
      },
    });
    return count > 0;
  }

  async isWithinWorkingHours(companyId: string, branchId: string, range: DateRange): Promise<boolean> {
    const weekday = range.start.getDay();
    const wh = await this.prisma.wks_BranchWorkingHour.findUnique({
      where: { company_id_branch_id_weekday: { company_id: companyId, branch_id: branchId, weekday } },
    });
    if (!wh || !wh.isOpen || !wh.openTime || !wh.closeTime) return false;
    const [oH, oM] = wh.openTime.split(':').map(Number);
    const [cH, cM] = wh.closeTime.split(':').map(Number);
    const open = new Date(range.start);
    open.setHours(oH, oM, 0, 0);
    const close = new Date(range.start);
    close.setHours(cH, cM, 0, 0);
    return range.start >= open && range.end <= close;
  }

  async hasBayConflict(companyId: string, branchId: string, bayId: string, range: DateRange, bufferMinutes: number): Promise<boolean> {
    if (!bayId) return false;
    const [bookings, blocks] = await Promise.all([
      this.prisma.wks_ServiceBooking.findMany({
        where: {
          company_id: companyId,
          branch_id: branchId,
          bay_id: bayId,
          status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_SERVICE'] as any },
        },
        select: { scheduledStart: true, scheduledEnd: true },
      }),
      this.prisma.wks_BayBlock.findMany({
        where: {
          company_id: companyId,
          branch_id: branchId,
          bay_id: bayId,
        },
        select: { startTime: true, endTime: true },
      }),
    ]);

    return (
      bookings.some(b => b.scheduledStart && b.scheduledEnd && rangesOverlap({ start: b.scheduledStart, end: b.scheduledEnd }, range, bufferMinutes)) ||
      blocks.some(b => rangesOverlap({ start: b.startTime, end: b.endTime }, range, bufferMinutes))
    );
  }

  async hasMechanicConflict(companyId: string, branchId: string, mechanicId: string, range: DateRange, bufferMinutes: number): Promise<boolean> {
    if (!mechanicId) return false;
    const bookings = await this.prisma.wks_ServiceBooking.findMany({
      where: {
        company_id: companyId,
        branch_id: branchId,
        mechanic_id: mechanicId,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_SERVICE'] as any },
      },
      select: { scheduledStart: true, scheduledEnd: true },
    });
    return bookings.some(b => b.scheduledStart && b.scheduledEnd && rangesOverlap({ start: b.scheduledStart, end: b.scheduledEnd }, range, bufferMinutes));
  }

  async autoPickBay(companyId: string, branchId: string, range: DateRange, bufferMinutes: number): Promise<string | null> {
    const bays = await this.prisma.wks_ServiceBay.findMany({
      where: { company_id: companyId, branch_id: branchId, iStatus: 'Active' as any },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    for (const bay of bays) {
      const conflict = await this.hasBayConflict(companyId, branchId, bay.id, range, bufferMinutes);
      if (!conflict) return bay.id;
    }
    return null;
  }

  async autoPickMechanic(companyId: string, branchId: string, range: DateRange, bufferMinutes: number): Promise<string | null> {
    const mechanics = await this.prisma.cmf_Mechanic.findMany({
      where: { company_id: companyId, branch_id: branchId, iStatus: 'Active' as any, isAvailable: true },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    for (const m of mechanics) {
      const conflict = await this.hasMechanicConflict(companyId, branchId, m.id, range, bufferMinutes);
      if (!conflict) return m.id;
    }
    return null;
  }

  // Validate and optionally assign bay/mechanic, returning the chosen plan
  async validateAndPlan(
    companyId: string,
    branchId: string,
    desiredStart: Date,
    durationMinutes: number,
    bayId?: string | null,
    mechanicId?: string | null,
  ): Promise<{ scheduledStart: Date; scheduledEnd: Date; bayId: string | null; mechanicId: string | null }> {
    const scheduledStart = desiredStart;
    const scheduledEnd = new Date(scheduledStart.getTime() + durationMinutes * 60_000);
    const range = { start: scheduledStart, end: scheduledEnd };

    if (await this.isHoliday(companyId, branchId, scheduledStart)) {
      throw new Error('Selected date is a holiday/closed for this branch');
    }
    if (!(await this.isWithinWorkingHours(companyId, branchId, range))) {
      throw new Error('Requested time is outside branch working hours');
    }
    const buffer = await this.getBranchBufferMinutes(companyId, branchId, scheduledStart);

    // Validate or auto-pick bay
    let finalBayId = bayId ?? null;
    if (finalBayId) {
      const conflict = await this.hasBayConflict(companyId, branchId, finalBayId, range, buffer);
      if (conflict) throw new Error('Selected bay has a conflicting schedule');
    } else {
      finalBayId = await this.autoPickBay(companyId, branchId, range, buffer);
    }

    // Validate or auto-pick mechanic
    let finalMechanicId = mechanicId ?? null;
    if (finalMechanicId) {
      const conflict = await this.hasMechanicConflict(companyId, branchId, finalMechanicId, range, buffer);
      if (conflict) throw new Error('Selected mechanic has a conflicting schedule');
    } else {
      finalMechanicId = await this.autoPickMechanic(companyId, branchId, range, buffer);
    }

    return { scheduledStart, scheduledEnd, bayId: finalBayId, mechanicId: finalMechanicId };
  }

  // Confirm a booking: set scheduledStart/End, assign bay/mechanic, move status to CONFIRMED
  async confirmBooking(bookingId: string, durationMinutes: number): Promise<void> {
    await this.prisma.$transaction(async (tx: PrismaClient) => {
      const booking = await tx.wks_ServiceBooking.findUnique({
        where: { id: bookingId },
      });
      if (!booking) throw new Error('Booking not found');
      if (booking.status !== 'PENDING') throw new Error('Only PENDING bookings can be confirmed');
      const desiredStart = booking.scheduledStart ?? new Date();
      const plan = await this.validateAndPlan(
        booking.company_id,
        booking.branch_id,
        desiredStart,
        durationMinutes,
        booking.bay_id,
        booking.mechanic_id,
      );

      await tx.wks_ServiceBooking.update({
        where: { id: bookingId },
        data: {
          scheduledStart: plan.scheduledStart,
          scheduledEnd: plan.scheduledEnd,
          bay_id: plan.bayId ?? undefined,
          mechanic_id: plan.mechanicId ?? undefined,
          status: 'CONFIRMED' as any,
        },
      });
    });
  }
}


```

```typescript
*** Begin Patch
*** Update File: j:\saas\ngebengkel-server\src\app.module.ts
@@
-import { Module } from '@nestjs/common';
+import { Module } from '@nestjs/common';
 import { AppController } from './app.controller';
 import { AppService } from './app.service';
 import { AuthModule } from './auth/better-auth/better-auth.module';
 import { PrismaModule } from './prisma/prisma.module';
+import { BookingModule } from './wks/booking/booking.module';
@@
-  imports: [AuthModule, PrismaModule],
+  imports: [AuthModule, PrismaModule, BookingModule],
*** End Patch
```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { sys_UserModule } from './sys/sys_user/sys_User.module';
import { Sys_UserRoleModule } from './sys/sys_userRole/sys_UserRole.module';
import { Sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompanyRole.module';

import { BetterAuthModule } from './auth/better-auth/better-auth.module';
import { PrismaService } from './prisma.service';

import { sys_CompanyModule } from './sys/sys_company/sys_Company.module';
import { sys_BranchModule } from './sys/sys_branch/sys_Branch.module';
import { sys_MenuModule } from './sys/sys_menu/sys_Menu.module';
import { sys_MenuPermissionModule } from './sys/sys_menu_permission/sys_Menu_Permission.module';
import { EmailModule } from './email/email.module';
import { CleanupModule } from './auth/cleanup/cleanup.module';
import { BookingModule } from './wks/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    BetterAuthModule,
    CleanupModule,
    sys_CompanyModule,
    sys_BranchModule,
    sys_UserModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

```

- Saya sudah menambahkan buffer booking per branch di `wks_BranchWorkingHour.bookingBufferMinutes` dan membuat `BookingModule` + `BookingService` yang:
  - Validasi waktu terhadap jam kerja dan hari libur.
  - Cek overlap dengan booking lain, blokir bay, dan jadwal mekanik.
  - Auto-pick bay/mechanic jika tidak ditentukan.
  - Konfirmasi booking secara transaksional via `confirmBooking(bookingId, durationMinutes)`.

### Perubahan penting
- Schema
  - `wks_BranchWorkingHour`: tambah `bookingBufferMinutes Int? @default(0)`.
- Service layer
  - `src/wks/booking/booking.module.ts`
  - `src/wks/booking/booking.service.ts`
  - `AppModule` import `BookingModule`.

### Cara pakai singkat
- Anti-overlap + auto-pick (langsung confirm booking):
```ts
await bookingService.confirmBooking(bookingId, /* durationMinutes */ 60);
```
- Atau rencanakan dulu tanpa commit:
```ts
const plan = await bookingService.validateAndPlan(companyId, branchId, desiredStart, 60, bayId, mechanicId);
```

Jika mau, saya bisa tambahkan endpoint REST untuk:
- create booking (PENDING),
- validate & suggest slot alternatif,
- confirm booking (CONFIRMED),
- cancel/no-show.

```typescript
await bookingService.confirmBooking(bookingId, /* durationMinutes */ 60);
```

```typescript
const plan = await bookingService.validateAndPlan(companyId, branchId, desiredStart, 60, bayId, mechanicId);
```

