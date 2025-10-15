# 🧹 Panduan User Cleanup & Data Retention

Sistem otomatis untuk membersihkan **unverified users** dan data yang sudah expired dari database.

---

## 🎯 Tujuan

1. ✅ **Mencegah Spam Registration**: Hapus user yang tidak pernah verifikasi email
2. ✅ **Data Hygiene**: Jaga database tetap bersih dan terorganisir
3. ✅ **Storage Optimization**: Hemat space database
4. ✅ **Compliance**: Memenuhi data retention policy
5. ✅ **Security**: Kurangi attack surface dengan hapus unused accounts

---

## 📋 Apa Yang Akan Dihapus?

### **1. Unverified Users (Email Verification Expired)**

User yang:

- `emailVerified = false`
- Token verifikasi sudah **expired** (> 24 jam)
- Tidak ada session aktif

**Cascade Delete Otomatis:**

```
sys_User (deleted)
  └── sys_UserRole (deleted manually)
      └── sys_UserCompanyRole (deleted manually)
  └── sys_Session (cascade delete)
  └── sys_EmailVerification (cascade delete)
  └── sys_TwoFactorToken (cascade delete)
```

### **2. Never-Verified Users**

User yang:

- `emailVerified = false`
- **Tidak ada** email verification record sama sekali
- Sudah lama (default: > 7 hari)

### **3. Expired Tokens**

- Email verification tokens yang expired
- 2FA tokens yang expired atau sudah digunakan

---

## 🚀 Setup

### **1. Install Dependencies**

```bash
npm install @nestjs/schedule
```

### **2. File Structure**

```
src/
├── auth/
│   └── cleanup/
│       ├── cleanup.service.ts      # Service untuk cleanup logic
│       ├── cleanup.controller.ts   # API endpoints
│       └── cleanup.module.ts       # Module definition
│
└── app.module.ts                   # Import CleanupModule & ScheduleModule
```

### **3. Update app.module.ts**

File sudah diupdate dengan:

- ✅ `ScheduleModule.forRoot()` untuk cron jobs
- ✅ `CleanupModule` import

---

## 🤖 Automatic Cleanup (Cron Jobs)

### **Daily Cleanup** (Setiap Hari Jam 2 Pagi)

Otomatis menjalankan:

1. Cleanup unverified users (expired > 24 jam)
2. Cleanup expired verification tokens
3. Cleanup expired 2FA tokens

```typescript
@Cron(CronExpression.EVERY_DAY_AT_2AM)
async handleDailyCleanup() {
  // Auto cleanup setiap hari
}
```

### **Weekly Cleanup** (Setiap Minggu)

Otomatis menjalankan:

1. Cleanup never-verified users (> 7 hari)

```typescript
@Cron(CronExpression.EVERY_WEEK)
async handleWeeklyCleanup() {
  // Auto cleanup setiap minggu
}
```

### **Custom Cron Schedule (Optional)**

Jika ingin ubah jadwal:

```typescript
// Setiap 6 jam
@Cron('0 */6 * * *')

// Setiap hari jam 3 pagi
@Cron('0 3 * * *')

// Setiap Senin jam 1 pagi
@Cron('0 1 * * 1')
```

---

## 🔌 API Endpoints

### **1. Cleanup Unverified Users**

**Endpoint**: `POST /cleanup/unverified-users`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Query Parameters**:

- `dryRun`: boolean (default: false) - Jika true, hanya preview tanpa delete
- `expirationHours`: number (default: 24) - Minimal berapa jam expired

**Request**:

```bash
# Dry run - preview saja
curl -X POST "http://localhost:3001/cleanup/unverified-users?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"

# Actual cleanup - hapus yang expired > 48 jam
curl -X POST "http://localhost:3001/cleanup/unverified-users?expirationHours=48" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "Successfully deleted 5 unverified users",
  "success": true,
  "dryRun": false,
  "count": 5,
  "deletedUserIds": [101, 102, 103, 104, 105]
}
```

**Dry Run Response**:

```json
{
  "message": "Dry run completed - No users were deleted",
  "success": true,
  "dryRun": true,
  "count": 5,
  "users": [
    {
      "id": 101,
      "email": "user1@example.com",
      "createdAt": "2025-10-14T10:00:00Z",
      "expiresAt": "2025-10-15T10:00:00Z"
    }
  ]
}
```

---

### **2. Cleanup Never-Verified Users**

**Endpoint**: `POST /cleanup/never-verified-users`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Query Parameters**:

- `dryRun`: boolean (default: false)
- `ageInDays`: number (default: 7) - Minimal berapa hari lalu dibuat

**Request**:

```bash
# Hapus user yang tidak pernah verify > 7 hari
curl -X POST "http://localhost:3001/cleanup/never-verified-users" \
  -H "Authorization: Bearer {adminToken}"

# Dry run
curl -X POST "http://localhost:3001/cleanup/never-verified-users?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "Successfully deleted 3 never-verified users",
  "success": true,
  "dryRun": false,
  "count": 3,
  "deletedUserIds": [201, 202, 203]
}
```

---

### **3. Cleanup Expired Verification Tokens**

**Endpoint**: `POST /cleanup/expired-verification-tokens`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Request**:

```bash
curl -X POST "http://localhost:3001/cleanup/expired-verification-tokens" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "Successfully deleted 15 expired verification tokens",
  "success": true,
  "count": 15
}
```

---

### **4. Cleanup Expired 2FA Tokens**

**Endpoint**: `POST /cleanup/expired-2fa-tokens`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Request**:

```bash
curl -X POST "http://localhost:3001/cleanup/expired-2fa-tokens" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "Successfully deleted 8 expired 2FA tokens",
  "success": true,
  "count": 8
}
```

---

### **5. Get Cleanup Statistics**

**Endpoint**: `GET /cleanup/stats`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Request**:

```bash
curl -X GET "http://localhost:3001/cleanup/stats" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "totalUnverified": 25,
    "expiredVerification": 15,
    "neverVerified": 5,
    "recentUnverified": 5,
    "cleanupRecommended": 20
  }
}
```

**Penjelasan:**

- `totalUnverified`: Total user yang belum verify email
- `expiredVerification`: User dengan verification expired
- `neverVerified`: User tanpa verification email sama sekali
- `recentUnverified`: User unverified yang masih baru (< 24 jam)
- `cleanupRecommended`: Total yang disarankan untuk di-cleanup

---

### **6. Run All Cleanup Tasks**

**Endpoint**: `POST /cleanup/run-all`

**Headers**:

```
Authorization: Bearer {adminToken}
```

**Query Parameters**:

- `dryRun`: boolean (default: false)

**Request**:

```bash
# Jalankan semua cleanup sekaligus
curl -X POST "http://localhost:3001/cleanup/run-all" \
  -H "Authorization: Bearer {adminToken}"

# Dry run
curl -X POST "http://localhost:3001/cleanup/run-all?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"
```

**Response**:

```json
{
  "message": "All cleanup tasks completed successfully",
  "dryRun": false,
  "results": {
    "unverifiedUsers": {
      "count": 15,
      "success": true
    },
    "expiredVerificationTokens": {
      "count": 20,
      "success": true
    },
    "expired2FATokens": {
      "count": 8,
      "success": true
    }
  },
  "totalDeleted": 43
}
```

---

## 🔒 Security & Permissions

### **Admin Only Access**

Semua cleanup endpoints **HANYA bisa diakses oleh ADMIN**:

```typescript
@Roles('ADMIN')
@Post('unverified-users')
async cleanupUnverifiedUsers() {
  // Only admin can execute
}
```

### **Audit Logging**

Service mencatat semua cleanup operations:

```typescript
this.logger.log(`Deleted unverified user: user@example.com (ID: 123)`);
this.logger.log(`Cleanup completed: 5 users deleted`);
```

Check logs untuk audit trail:

```bash
# Development
npm run start:dev

# Production
tail -f /var/log/app/cleanup.log
```

---

## 📊 Monitoring & Alerts

### **1. Check Statistics Reguler**

```bash
# Check berapa user yang perlu di-cleanup
curl -X GET "http://localhost:3001/cleanup/stats" \
  -H "Authorization: Bearer {adminToken}"
```

### **2. Dry Run Sebelum Cleanup**

**SELALU** jalankan dry run terlebih dahulu:

```bash
# Preview dulu apa yang akan dihapus
curl -X POST "http://localhost:3001/cleanup/unverified-users?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"

# Jika OK, baru jalankan actual cleanup
curl -X POST "http://localhost:3001/cleanup/unverified-users" \
  -H "Authorization: Bearer {adminToken}"
```

### **3. Setup Alerts (Optional)**

Buat alert jika ada banyak unverified users:

```typescript
// Di cleanup.service.ts
const stats = await this.getUnverifiedUsersStats();

if (stats.expiredVerification > 100) {
  // Send alert ke admin
  await this.emailService.sendAdminAlert({
    subject: 'High number of unverified users',
    message: `${stats.expiredVerification} users need cleanup`,
  });
}
```

---

## ⚙️ Configuration

### **Custom Expiration Time**

Ubah waktu expiration di cleanup call:

```typescript
// 48 jam sebelum cleanup
await cleanupService.cleanupUnverifiedUsers({
  expirationHours: 48,
});

// 14 hari sebelum cleanup
await cleanupService.cleanupNeverVerifiedUsers({
  ageInDays: 14,
});
```

### **Custom Cron Schedule**

Edit di `cleanup.service.ts`:

```typescript
// Dari:
@Cron(CronExpression.EVERY_DAY_AT_2AM)

// Ke:
@Cron('0 3 * * *') // Setiap hari jam 3 pagi
```

### **Disable Auto Cleanup**

Jika ingin disable cron jobs, comment out decorator:

```typescript
// @Cron(CronExpression.EVERY_DAY_AT_2AM)
async handleDailyCleanup() {
  // Won't run automatically
}
```

---

## 🧪 Testing

### **1. Test Dry Run**

```bash
# Test cleanup tanpa actually delete
curl -X POST "http://localhost:3001/cleanup/unverified-users?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"
```

### **2. Test Manual Cleanup**

```bash
# Create test user
curl -X POST "http://localhost:3001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Wait for verification to expire (24 hours)
# Or manually update database:
# UPDATE sys_EmailVerification
# SET expiresAt = NOW() - INTERVAL '25 hours'
# WHERE user_id = {test_user_id};

# Run cleanup
curl -X POST "http://localhost:3001/cleanup/unverified-users" \
  -H "Authorization: Bearer {adminToken}"

# Verify user is deleted
curl -X GET "http://localhost:3001/users/{test_user_id}" \
  -H "Authorization: Bearer {adminToken}"
# Should return 404
```

### **3. Test Cron Job**

```typescript
// Di cleanup.service.ts
// Ubah untuk testing:
@Cron('*/5 * * * *') // Run every 5 minutes
async handleDailyCleanup() {
  // Test cron execution
}
```

---

## 📝 Best Practices

### **1. Always Dry Run First**

```bash
# ✅ GOOD
curl -X POST ".../cleanup?dryRun=true"  # Preview
curl -X POST ".../cleanup"               # Execute

# ❌ BAD
curl -X POST ".../cleanup"  # Langsung execute
```

### **2. Schedule Cleanup Di Off-Peak Hours**

```typescript
// ✅ GOOD - Jam 2-4 pagi
@Cron('0 2 * * *')

// ❌ BAD - Jam sibuk
@Cron('0 14 * * *')
```

### **3. Monitor Cleanup Results**

```typescript
const result = await cleanupService.cleanupUnverifiedUsers();

if (result.count > 50) {
  // Alert admin jika banyak yang dihapus
  logger.warn(`High cleanup count: ${result.count} users deleted`);
}
```

### **4. Backup Before Major Cleanup**

```bash
# Backup database sebelum cleanup
pg_dump -U postgres ngebengkel > backup_before_cleanup.sql

# Run cleanup
curl -X POST ".../cleanup/run-all"

# Verify results
curl -X GET ".../cleanup/stats"
```

### **5. Grace Period**

Berikan grace period sebelum delete:

```typescript
// ✅ GOOD - 24 jam grace period
expirationHours: 24;

// ❌ TOO AGGRESSIVE - 1 jam
expirationHours: 1;
```

---

## ⚠️ Important Notes

### **1. Cascade Delete**

Relasi yang **OTOMATIS** terhapus (onDelete: Cascade):

- ✅ `sys_Session`
- ✅ `sys_EmailVerification`
- ✅ `sys_TwoFactorToken`

Relasi yang **MANUAL** dihapus di service:

- ⚠️ `sys_UserRole`
- ⚠️ `sys_UserCompanyRole`

### **2. Data Recovery**

**User yang sudah dihapus TIDAK BISA di-recover!**

- ✅ Selalu dry run dulu
- ✅ Backup database regular
- ✅ Monitor cleanup logs

### **3. Production Considerations**

```typescript
// Set proper expiration time
if (process.env.NODE_ENV === 'production') {
  expirationHours = 48; // Lebih lama di production
} else {
  expirationHours = 1; // Cepat di development
}
```

---

## 🐛 Troubleshooting

### **Error: Foreign Key Constraint**

```
ERROR: update or delete on table "sys_UserRole" violates foreign key constraint
```

**Solution**: Service sudah handle ini dengan delete sys_UserCompanyRole terlebih dahulu.

### **Cron Job Tidak Jalan**

1. Check ScheduleModule sudah di-import:

```typescript
@Module({
  imports: [
    ScheduleModule.forRoot(), // ✅
  ],
})
```

2. Check logs untuk cron execution:

```bash
grep "Running daily cleanup" logs/app.log
```

3. Verify cron expression:

```typescript
// Test dengan interval pendek
@Cron('*/5 * * * *') // Every 5 minutes
```

### **Too Many Users Deleted**

Jika terlalu banyak user terhapus:

1. Check dry run hasil dulu
2. Increase expiration time
3. Review grace period
4. Check apakah ada bug di registration flow

---

## 📈 Statistics & Reports

### **Weekly Cleanup Report**

```bash
# Get stats sebelum cleanup
BEFORE=$(curl -s -X GET ".../cleanup/stats" -H "Authorization: Bearer $TOKEN")

# Run cleanup
RESULT=$(curl -s -X POST ".../cleanup/run-all" -H "Authorization: Bearer $TOKEN")

# Get stats sesudah cleanup
AFTER=$(curl -s -X GET ".../cleanup/stats" -H "Authorization: Bearer $TOKEN")

# Generate report
echo "Cleanup Report:"
echo "Before: $BEFORE"
echo "Deleted: $RESULT"
echo "After: $AFTER"
```

---

## 🚀 Quick Start

### **Minimal Setup**

1. **Install dependency**:

```bash
npm install @nestjs/schedule
```

2. **Import modules** (sudah done di app.module.ts)

3. **Test cleanup**:

```bash
# Check stats
curl -X GET "http://localhost:3001/cleanup/stats" \
  -H "Authorization: Bearer {adminToken}"

# Dry run
curl -X POST "http://localhost:3001/cleanup/run-all?dryRun=true" \
  -H "Authorization: Bearer {adminToken}"
```

4. **Setup complete! Cron will run automatically** ✅

---

## 📚 Summary

### **Automatic Cleanup**

- ✅ Daily: Unverified users (expired > 24 jam)
- ✅ Daily: Expired tokens
- ✅ Weekly: Never-verified users (> 7 hari)

### **Manual Cleanup**

- ✅ Via API endpoints
- ✅ Dry run support
- ✅ Custom expiration time
- ✅ Admin only

### **Safety Features**

- ✅ Dry run mode
- ✅ Detailed logging
- ✅ Statistics endpoint
- ✅ Cascade delete handling

---

**Happy Cleaning! 🧹✨**
