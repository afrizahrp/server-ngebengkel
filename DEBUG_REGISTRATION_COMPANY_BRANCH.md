# Debug: Registration Company & Branch ID Issue

## Masalah

`company_id` dan `branch_id` masih NULL di tabel `sys_User` setelah registrasi.

## Langkah-Langkah Debugging

### 1. Periksa Console Log Backend

Setelah menjalankan registrasi, periksa console backend Anda. Harusnya ada log seperti ini:

```
=== REGISTER CONTROLLER ===
Received data: { name: 'John Doe', email: 'john@example.com', password: '...', company_id: 'COMP1', branch_id: 'BR001' }
company_id: COMP1
branch_id: BR001

=== REGISTER SERVICE ===
Data received in service: { name: 'John Doe', email: 'john@example.com', password: '...', company_id: 'COMP1', branch_id: 'BR001' }
company_id: COMP1
branch_id: BR001

Creating user with data: { name: 'John Doe', email: 'john@example.com', company_id: 'COMP1', branch_id: 'BR001' }
User created: { id: 1, company_id: 'COMP1', branch_id: 'BR001' }
```

#### Jika `company_id` dan `branch_id` adalah `undefined`:

**Problem**: Data tidak dikirim dari frontend.

**Solution**:

1. Periksa browser console
2. Periksa localStorage: `company-info-store` dan `branch-store`
3. Pastikan ada company aktif dan branch dipilih

#### Jika data diterima tapi user created menunjukkan NULL:

**Problem**: Prisma client belum di-regenerate atau ada issue dengan database.

**Solution**: Lanjut ke langkah 2.

### 2. Regenerate Prisma Client

```bash
cd j:\saas\ngebengkel-server
npx prisma generate
```

### 3. Periksa Database Schema

Pastikan kolom `company_id` dan `branch_id` ada di tabel `sys_User`:

```sql
-- SQL Server / PostgreSQL
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'sys_User'
AND COLUMN_NAME IN ('company_id', 'branch_id');

-- MySQL
DESCRIBE sys_User;
```

### 4. Periksa Data di Frontend

#### A. Periksa Company Store

Buka browser console dan jalankan:

```javascript
// Periksa localStorage
console.log('Company Store:', localStorage.getItem('company-info-store'));
```

Output yang diharapkan:

```json
{
  "state": {
    "company": {
      "companyName": "PT. Test",
      "companyLogo": "...",
      "companyId": "COMP1",
      "branchId": "BR001"
    }
  }
}
```

#### B. Periksa Branch Store

```javascript
console.log('Branch Store:', localStorage.getItem('branch-store'));
```

#### C. Periksa Network Request

1. Buka DevTools → Network tab
2. Submit form registrasi
3. Cari request ke `/auth/register`
4. Periksa Request Payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "company_id": "COMP1", // ← Harus ada
  "branch_id": "BR001", // ← Harus ada (atau undefined jika tidak dipilih)
  "iStatus": "Active"
}
```

### 5. Test Manual dengan cURL

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "company_id": "COMP1",
    "branch_id": "BR001"
  }'
```

Kemudian cek database:

```sql
SELECT id, name, email, company_id, branch_id
FROM sys_User
WHERE email = 'test@example.com';
```

### 6. Setup Company dan Branch yang Valid

Pastikan ada data company dan branch di database:

```sql
-- Cek company
SELECT * FROM sys_Company WHERE id = 'COMP1';

-- Cek branch
SELECT * FROM sys_Branch WHERE company_id = 'COMP1';
```

Jika tidak ada, buat dulu:

```sql
-- Insert company
INSERT INTO sys_Company (id, seq_no, name, iStatus, createdAt, updatedAt)
VALUES ('COMP1', 1, 'PT. Test Company', 'Active', GETDATE(), GETDATE());

-- Insert branch
INSERT INTO sys_Branch (id, name, company_id, iStatus)
VALUES ('BR001', 'Cabang Jakarta', 'COMP1', 'Active');
```

## Solusi Berdasarkan Skenario

### Skenario 1: Frontend Tidak Mengirim Data

**Penyebab**:

- Company store kosong
- Branch store kosong
- User tidak login/tidak ada session

**Solusi**:

1. Set company info di localStorage:

```javascript
// Di browser console
localStorage.setItem(
  'company-info-store',
  JSON.stringify({
    state: {
      company: {
        companyName: 'PT. Test',
        companyLogo: '',
        companyId: 'COMP1',
      },
    },
  }),
);
```

2. Refresh halaman dan coba lagi

### Skenario 2: Backend Tidak Menyimpan Data

**Penyebab**:

- Prisma client outdated
- Schema tidak sync dengan database

**Solusi**:

```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Restart server
npm run start:dev

# 3. Test lagi
```

### Skenario 3: Database Column Tidak Ada

**Penyebab**:

- Migration belum dijalankan
- Schema belum di-push ke database

**Solusi**:

```bash
# Push schema ke database
npx prisma db push

# Atau run migration
npx prisma migrate dev --name add_company_branch_to_user
```

## Quick Fix

Jika masalah masih ada, coba langkah berikut secara berurutan:

```bash
# 1. Stop server (Ctrl+C)

# 2. Regenerate Prisma
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Restart server
npm run start:dev
```

## Verifikasi Berhasil

### 1. Cek Console Backend

Saat registrasi, harusnya muncul log dengan data lengkap.

### 2. Cek Database

```sql
SELECT id, name, email, company_id, branch_id
FROM sys_User
ORDER BY id DESC;
```

### 3. Cek Response API

Response dari `/auth/register` harusnya include:

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "company_id": "COMP1",
  "branch_id": "BR001",
  "message": "Registration successful..."
}
```

## Catatan Penting

1. **Branch Optional**: `branch_id` boleh NULL jika user tidak memilih branch
2. **Company Required**: `company_id` seharusnya selalu terisi dari company store
3. **Frontend State**: Pastikan company store terisi sebelum registrasi
4. **Database Relations**: Pastikan company_id yang dikirim valid/exists di tabel sys_Company

## File-File Yang Sudah Dimodifikasi

### Backend:

- ✅ `src/auth/better-auth/types/auth.types.ts` - RegisterData interface
- ✅ `src/auth/better-auth/better-auth.controller.ts` - Register endpoint dengan logging
- ✅ `src/auth/better-auth/better-auth.service.ts` - Register service dengan logging
- ✅ `src/auth/better-auth/better-auth.service.ts` - createUser method

### Frontend:

- ✅ `hooks/useRegistration.ts` - Mengirim company_id & branch_id
- ✅ `hooks/useAuth.ts` - Register function
- ✅ `lib/actions/auth.actions.ts` - registerAction
- ✅ `app/auth/(register)/register/register-form.tsx` - Form dengan branch selection

## Kontak Debug

Jika masalah masih berlanjut setelah semua langkah di atas:

1. Screenshot console log backend
2. Screenshot network request dari browser DevTools
3. Screenshot localStorage company-info-store
4. Query result dari database
