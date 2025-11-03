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





