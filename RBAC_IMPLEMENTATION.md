# RBAC Implementation Guide

## Overview
Sistem RBAC (Role-Based Access Control) berbasis menu permission telah diimplementasikan untuk mengontrol akses user ke endpoint berdasarkan permission yang dimiliki di `sys_Menu_Permission`.

## Struktur Database

### Tabel yang Terlibat:
1. **sys_Role** - Master role (SUPER_ADMIN, ADMIN, dll)
2. **sys_UserRole** - Hubungan user dengan role
3. **sys_UserCompanyRole** - Hubungan user role dengan company (dengan permission)
4. **sys_Menu** - Master menu (id: 18, 19, 20, 21, dll)
5. **sys_Menu_Permission** - Permission per menu untuk setiap UserCompanyRole

### Permission Types:
- `can_view` - View/Read access
- `can_create` - Create access
- `can_edit` - Update access
- `can_delete` - Delete access
- `can_print` - Print access
- `can_approve` - Approve access

## Setup Role SUPER_ADMIN

### 1. Pastikan Role dan UserCompanyRole sudah ada:
```sql
-- Cek role SUPER_ADMIN
SELECT * FROM sys_Role WHERE id = 'SUPER_ADMIN';

-- Cek UserCompanyRole dengan id = 3
SELECT * FROM sys_UserCompanyRole WHERE id = 3;
```

### 2. Setup Permission untuk Menu 18, 19, 20, 21:
```sql
-- Insert permission untuk menu 18, 19, 20, 21 dengan UserCompanyRole_id = 3
-- Berikan semua permission (view, create, edit, delete, print, approve)

INSERT INTO sys_Menu_Permission (
  userCompanyRole_id,
  menu_id,
  can_view,
  can_create,
  can_edit,
  can_delete,
  can_print,
  can_approve,
  iStatus,
  createdBy,
  createdAt
) VALUES
  (3, 18, true, true, true, true, true, true, 'Active', 'system', NOW()),
  (3, 19, true, true, true, true, true, true, 'Active', 'system', NOW()),
  (3, 20, true, true, true, true, true, true, 'Active', 'system', NOW()),
  (3, 21, true, true, true, true, true, true, 'Active', 'system', NOW())
ON CONFLICT (userCompanyRole_id, menu_id) 
DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete,
  can_print = EXCLUDED.can_print,
  can_approve = EXCLUDED.can_approve,
  iStatus = EXCLUDED.iStatus,
  updatedBy = 'system',
  updatedAt = NOW();
```

## Implementasi di Backend

### 1. Guard: `MenuPermissionGuard`
Guard ini mengecek apakah user memiliki permission yang diperlukan untuk mengakses endpoint.

**Lokasi:** `src/auth/better-auth/guards/menu-permission.guard.ts`

### 2. Decorator: `@MenuPermission`
Decorator untuk menentukan menu dan permission yang diperlukan.

**Lokasi:** `src/auth/better-auth/decorators/menu-permission.decorator.ts`

**Contoh Penggunaan:**
```typescript
// User harus punya permission 'create' untuk menu 18, 19, 20, atau 21 (salah satu cukup)
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })

// User harus punya permission 'edit' untuk menu 18 DAN 19 (semua harus ada)
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19], requireAll: true, permission: 'edit' })

// User harus punya permission 'view' untuk menu 20 atau 21
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [20, 21], permission: 'view' })
```

### 3. Contoh Implementasi di Controller

#### Images Controller:
```typescript
@Post('admin')
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })
@ThrottleFormSubmission()
async createAdmin(@Body() createImageDto: CreateImageDto) {
  // Endpoint hanya bisa diakses jika user punya permission 'create' 
  // untuk menu 18, 19, 20, atau 21
}
```

#### Videos Controller:
```typescript
@Post('admin')
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })
@ThrottleFormSubmission()
async createAdmin(@Body() createVideoDto: CreateVideoDto) {
  // Endpoint hanya bisa diakses jika user punya permission 'create'
}
```

#### Waiting List Controller:
```typescript
@Patch(':id')
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'edit' })
async update(@Param('id') id: string, @Body() dto: UpdateWaitingListDto) {
  // Endpoint hanya bisa diakses jika user punya permission 'edit'
}

@Delete(':id')
@UseGuards(MenuPermissionGuard)
@MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'delete' })
async remove(@Param('id') id: string) {
  // Endpoint hanya bisa diakses jika user punya permission 'delete'
}
```

## Cara Kerja

1. **User Login** → JWT token berisi `user_id`, `role_id`, `company_id`, `branch_id`
2. **Request ke Endpoint** → `BetterJwtAuthGuard` memverifikasi token dan attach user ke request
3. **MenuPermissionGuard Check**:
   - Ambil `UserCompanyRole` berdasarkan `user_id` dan `company_id`
   - Ambil `MenuPermission` untuk menu yang diperlukan
   - Cek apakah user punya permission yang sesuai (view/create/edit/delete/print/approve)
4. **Allow/Deny** → Jika permission ada, allow. Jika tidak, throw `ForbiddenException`

## Error Handling

Jika user tidak punya permission, akan mendapat error:
```json
{
  "statusCode": 403,
  "message": "Access denied. Required create permission for menu(s): 18, 19, 20, 21",
  "error": "Forbidden"
}
```

## Testing

### 1. Test dengan User yang Punya Permission:
- Login dengan user yang memiliki `UserCompanyRole_id = 3`
- Pastikan permission sudah di-set di database
- Request ke endpoint yang protected → Should return 200 OK

### 2. Test dengan User yang Tidak Punya Permission:
- Login dengan user yang tidak memiliki permission
- Request ke endpoint yang protected → Should return 403 Forbidden

## Filter Menu Berdasarkan Role

### Menu Visibility Rules:
1. **SUPER_ADMIN (role_id = 'SUPER_ADMIN')**:
   - Hanya melihat menu dengan ID: **18, 19, 20, 21**
   - Menu lainnya **TIDAK** ditampilkan
   - Child menu dari menu 18-21 juga akan ditampilkan

2. **Client (role_id bukan 'SUPER_ADMIN')**:
   - Melihat **SEMUA menu KECUALI** menu dengan ID: **18, 19, 20, 21**
   - Menu 18-21 **TIDAK** ditampilkan
   - Child menu dari menu 18-21 juga **TIDAK** ditampilkan

### Implementasi:
Filter ini diimplementasikan di method `findMenusWithPermissions()` di `sys_MenuService`:
- Service akan mengambil `role_id` dari `UserCompanyRole`
- Jika `role_id = 'SUPER_ADMIN'`, filter menu hanya menampilkan ID 18, 19, 20, 21
- Jika `role_id` bukan `'SUPER_ADMIN'`, filter menu mengecualikan ID 18, 19, 20, 21

### Contoh:
```typescript
// SUPER_ADMIN akan melihat:
// - Menu 18 (Manage Waiting List)
// - Menu 19
// - Menu 20
// - Menu 21
// - Child menu dari menu 18-21 (jika ada)

// Client akan melihat:
// - Semua menu lainnya (1-17, 22+, dll)
// - TIDAK melihat menu 18, 19, 20, 21
```

## Catatan Penting

1. **Guard harus digunakan setelah JWT Auth Guard** - Pastikan `BetterJwtAuthGuard` sudah di-apply (biasanya di level global atau controller)
2. **Permission check berdasarkan company_id** - Guard akan mencari `UserCompanyRole` berdasarkan `user.company_id` dari JWT token
3. **Menu IDs harus valid** - Pastikan menu_id yang digunakan ada di tabel `sys_Menu`
4. **Permission harus Active** - Hanya permission dengan `iStatus = 'Active'` yang akan di-check
5. **Menu Filter berdasarkan Role** - Menu yang ditampilkan sudah otomatis di-filter berdasarkan role (SUPER_ADMIN vs Client)

