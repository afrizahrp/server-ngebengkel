# Sys Branch API Guide

## Overview

Endpoint API untuk mengelola data cabang (branch) yang terkait dengan perusahaan (company). Setiap branch harus mereferensikan satu company melalui `company_id`.

## Endpoints

### 1. Create Branch

**POST** `/sys_branch`

Membuat branch baru untuk sebuah company.

**Request Body:**

```json
{
  "id": "BRANCH0001",
  "name": "Cabang Jakarta Pusat",
  "iStatus": "Active",
  "remarks": "Kantor pusat Jakarta",
  "company_id": "COMP1"
}
```

**Response:**

```json
{
  "id": "BRANCH0001",
  "name": "Cabang Jakarta Pusat",
  "iStatus": "Active",
  "remarks": "Kantor pusat Jakarta",
  "company_id": "COMP1",
  "company": {
    "id": "COMP1",
    "name": "PT. Contoh Perusahaan"
  }
}
```

### 2. Get All Branches

**GET** `/sys_branch`

Mengambil semua data branch.

**Response:**

```json
[
  {
    "id": "BRANCH0001",
    "name": "Cabang Jakarta Pusat",
    "iStatus": "Active",
    "remarks": "Kantor pusat Jakarta",
    "company_id": "COMP1",
    "company": {
      "id": "COMP1",
      "name": "PT. Contoh Perusahaan"
    }
  }
]
```

### 3. Get Branches by Company ID

**GET** `/sys_branch/company/:company_id`

Mengambil semua branch yang terkait dengan company tertentu.

**Parameters:**

- `company_id` (string): ID dari company

**Example:**

```
GET /sys_branch/company/COMP1
```

**Response:**

```json
[
  {
    "id": "BRANCH0001",
    "name": "Cabang Jakarta Pusat",
    "iStatus": "Active",
    "remarks": "Kantor pusat Jakarta",
    "company_id": "COMP1",
    "company": {
      "id": "COMP1",
      "name": "PT. Contoh Perusahaan"
    }
  },
  {
    "id": "BRANCH0002",
    "name": "Cabang Jakarta Selatan",
    "iStatus": "Active",
    "remarks": "Cabang Jakarta Selatan",
    "company_id": "COMP1",
    "company": {
      "id": "COMP1",
      "name": "PT. Contoh Perusahaan"
    }
  }
]
```

### 4. Get Branch by ID

**GET** `/sys_branch/:id`

Mengambil detail satu branch berdasarkan ID.

**Parameters:**

- `id` (string): ID dari branch

**Example:**

```
GET /sys_branch/BRANCH0001
```

**Response:**

```json
{
  "id": "BRANCH0001",
  "name": "Cabang Jakarta Pusat",
  "iStatus": "Active",
  "remarks": "Kantor pusat Jakarta",
  "company_id": "COMP1",
  "company": {
    "id": "COMP1",
    "name": "PT. Contoh Perusahaan"
  }
}
```

### 5. Update Branch

**PUT** `/sys_branch/:id`

Mengupdate data branch.

**Parameters:**

- `id` (string): ID dari branch

**Request Body:**

```json
{
  "name": "Cabang Jakarta Pusat - Updated",
  "remarks": "Kantor pusat Jakarta - diperbarui"
}
```

**Response:**

```json
{
  "id": "BRANCH0001",
  "name": "Cabang Jakarta Pusat - Updated",
  "iStatus": "Active",
  "remarks": "Kantor pusat Jakarta - diperbarui",
  "company_id": "COMP1",
  "company": {
    "id": "COMP1",
    "name": "PT. Contoh Perusahaan"
  }
}
```

### 6. Delete Branch

**DELETE** `/sys_branch/:id`

Menghapus branch berdasarkan ID.

**Parameters:**

- `id` (string): ID dari branch

**Example:**

```
DELETE /sys_branch/BRANCH0001
```

**Response:**

```
Status: 200 OK
```

## Data Models

### Sys_CreateBranchDto

```typescript
{
  id: string;          // Required, max 10 characters
  name: string;        // Required, max 50 characters
  iStatus?: MasterRecordStatusEnum; // Optional, default: "Active"
  remarks?: string;    // Optional, max 255 characters
  company_id: string;  // Required, max 5 characters
}
```

### Sys_UpdateBranchDto

```typescript
{
  name?: string;       // Optional
  iStatus?: MasterRecordStatusEnum; // Optional
  remarks?: string;    // Optional
  company_id?: string; // Optional
}
```

### Sys_ResponseBranchDto

```typescript
{
  id: string;
  name: string;
  iStatus: MasterRecordStatusEnum;
  remarks?: string;
  company_id: string;
  company?: {
    id: string;
    name: string;
  };
}
```

### MasterRecordStatusEnum

- `Active`
- `Inactive`

## Error Handling

### 404 Not Found

Ketika branch dengan ID tertentu tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Branch with ID BRANCH0001 not found",
  "error": "Not Found"
}
```

## Testing

Gunakan file `test-sys-branch.http` untuk testing endpoint:

```bash
# Pastikan server berjalan di port 3003
npm run start:dev

# Buka file test-sys-branch.http di VS Code
# Gunakan REST Client extension untuk menjalankan requests
```

## Notes

1. **Company Reference**: Setiap branch harus mereferensikan company yang valid melalui `company_id`.
2. **Auto-include Company**: Semua endpoint otomatis menyertakan informasi company dalam response.
3. **Filtering by Company**: Gunakan endpoint `/sys_branch/company/:company_id` untuk mendapatkan semua branch dari satu company.
4. **Ordering**: Branches diurutkan berdasarkan nama secara ascending.
5. **Trimming**: Semua string data otomatis di-trim untuk menghilangkan whitespace di awal dan akhir.
