# Fitur Branch pada User Registration

## Overview

Implementasi branch selection pada user registration yang mengikuti `company_id` yang sedang aktif.

## Cara Kerja

### 1. Branch Tampil Otomatis

Branch yang ditampilkan pada form registrasi **otomatis difilter berdasarkan `company_id` yang aktif**.

```typescript
// Frontend: Fetch branches berdasarkan company yang aktif
useEffect(() => {
  if (company?.companyId) {
    fetchBranchesByCompany(company.companyId);
  }
}, [company?.companyId]);
```

### 2. Flow Registrasi

```
1. User mengakses form registrasi
2. Sistem mendeteksi company_id yang aktif dari company-store
3. Sistem fetch branches yang terkait dengan company_id tersebut
4. User mengisi form (name, email, password)
5. User bisa memilih branch (opsional) dari dropdown
   - Dropdown hanya menampilkan branches dari company aktif
6. User submit form
7. Backend menyimpan user dengan company_id dan branch_id
```

### 3. Data yang Disimpan

Saat registrasi, data berikut disimpan ke tabel `sys_User`:

```typescript
{
  id: number,              // Auto-increment
  name: string,            // Dari form
  email: string,           // Dari form
  password: string,        // Hashed
  image?: string,          // Optional
  company_id?: string,     // Dari company store (company yang aktif)
  branch_id?: string,      // Dari dropdown (opsional)
  iStatus: 'Active',
  isAdmin: false,
  emailVerified: false
}
```

## API Endpoints

### Get Branches by Company ID

```
GET /sys_branch/company/:company_id
```

**Response:**

```json
[
  {
    "id": "BRANCH0001",
    "name": "Cabang Jakarta Pusat",
    "company_id": "COMP1",
    "iStatus": "Active",
    "remarks": "Kantor pusat",
    "company": {
      "id": "COMP1",
      "name": "PT. Contoh Perusahaan"
    }
  }
]
```

### Register User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "company_id": "COMP1",
  "branch_id": "BRANCH0001" // Optional
}
```

**Response:**

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "image": null,
  "company_id": "COMP1",
  "branch_id": "BRANCH0001",
  "message": "Registration successful. Please check your email to verify your account."
}
```

## File yang Dimodifikasi

### Backend

1. **`src/auth/better-auth/types/auth.types.ts`**

   - Menambahkan `company_id` dan `branch_id` ke interface `RegisterData`

2. **`src/auth/better-auth/better-auth.service.ts`**

   - Update method `createUser` untuk menyimpan `company_id` dan `branch_id`

3. **`src/sys/sys_branch/`** (NEW)
   - Controller, Service, dan DTOs untuk mengelola branch

### Frontend

1. **`app/auth/(register)/register/register-form.tsx`**

   - Fetch branches berdasarkan company_id yang aktif
   - Conditional rendering: dropdown hanya tampil jika ada company_id
   - Update placeholder messages

2. **`lib/client-api.ts`**

   - Perbaiki endpoint `getBranchesByCompanyId` untuk menggunakan route parameter

3. **`store/branch-store.ts`**

   - Update interface `Branch` untuk match dengan response backend

4. **`hooks/useBranch.ts`**
   - Update reference dari `branch_id` ke `id`

## UI Behavior

### Jika Ada Company Aktif

- Dropdown branch akan tampil
- Hanya menampilkan branches dari company yang aktif
- User bisa memilih branch (opsional)

### Jika Tidak Ada Company Aktif

- Dropdown branch tidak tampil
- User tetap bisa registrasi tanpa branch

### Jika Company Tidak Punya Branch

- Dropdown tetap tampil
- Menampilkan pesan: "Tidak ada cabang untuk [Nama Company]"

## Testing

### 1. Setup Data

```sql
-- Pastikan ada company
INSERT INTO sys_Company (id, name, ...) VALUES ('COMP1', 'PT. Test', ...);

-- Buat beberapa branch
INSERT INTO sys_Branch (id, name, company_id) VALUES
  ('BR001', 'Cabang Jakarta', 'COMP1'),
  ('BR002', 'Cabang Bandung', 'COMP1');
```

### 2. Test Scenarios

**Scenario 1: Registrasi dengan Branch**

1. Akses form registrasi
2. Pilih branch dari dropdown
3. Submit form
4. Cek database: `company_id` dan `branch_id` tersimpan

**Scenario 2: Registrasi tanpa Branch**

1. Akses form registrasi
2. Tidak pilih branch (kosongkan)
3. Submit form
4. Cek database: `company_id` tersimpan, `branch_id` NULL

**Scenario 3: Company Tanpa Branch**

1. Set company yang tidak punya branch
2. Akses form registrasi
3. Dropdown menampilkan pesan "Tidak ada cabang"
4. User tetap bisa registrasi

## Notes

1. **Branch Selection Optional**: User tidak wajib memilih branch saat registrasi
2. **Auto-filter by Company**: Branches otomatis difilter berdasarkan company yang aktif
3. **Company Required**: `company_id` diambil dari company store dan otomatis disimpan
4. **Data Integrity**: Backend menyimpan relasi antara user, company, dan branch

## Future Enhancements

1. **Multi-branch Support**: User bisa terdaftar di multiple branches
2. **Branch Switching**: User bisa switch branch setelah login
3. **Branch Permissions**: Permission berbeda untuk setiap branch
4. **Branch Manager**: Role khusus untuk mengelola branch tertentu
