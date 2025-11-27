# 🎛️ Admin Panel Menu Setup Guide

## 📋 Overview

Script ini untuk membuat menu di **admin-ngebengkel** (admin panel terpisah dari client-ngebengkel) yang digunakan untuk mengatur seluruh workshop dan waiting list.

## 🗂️ Struktur Menu yang Akan Dibuat

```
Admin Panel (id: 18)
├── Manage Workshops (id: 19) → /admin/workshops
├── Manage Waiting List (id: 20) → /admin/waiting-list
└── Workshop Analytics (id: 21) → /admin/analytics (Optional)
```

## 🚀 Cara Setup

### Step 1: Cek ID Menu yang Tersedia

Sebelum menjalankan script, pastikan ID menu (18, 19, 20, 21) belum terpakai:

```sql
SELECT id, menu_description, href 
FROM sys_Menu 
WHERE id IN (18, 19, 20, 21);
```

Jika ada yang sudah terpakai, adjust ID di script.

### Step 2: Cek Role yang Ada

Cek role yang ada di sistem untuk permission:

```sql
SELECT id, role_id, role_name 
FROM sys_UserRole 
WHERE role_id IN ('ADMIN', 'SUPER_ADMIN', 'OWNER');
```

Sesuaikan role_id di script jika berbeda.

### Step 3: Jalankan Script

1. Buka database client (pgAdmin, DBeaver, atau psql)
2. Connect ke database ngebengkel
3. Jalankan script dari file:
   ```
   server-ngebengkel/prisma/seed-admin-panel-menu.sql
   ```

### Step 4: Verifikasi

Jalankan query verifikasi:

```sql
-- Cek menu yang sudah ter-insert
SELECT id, parent_id, menu_description, href, module_id, icon 
FROM sys_Menu 
WHERE id IN (18, 19, 20, 21)
ORDER BY id;

-- Cek permission yang sudah ter-insert
SELECT 
  mp.menu_id,
  m.menu_description,
  COUNT(mp.userCompanyRole_id) as total_permissions
FROM sys_Menu_Permission mp
JOIN sys_Menu m ON mp.menu_id = m.id
WHERE mp.menu_id IN (18, 19, 20, 21)
GROUP BY mp.menu_id, m.menu_description
ORDER BY mp.menu_id;
```

## ⚙️ Konfigurasi

### Menu Items

| ID | Menu | Path | Icon | Module |
|----|------|------|------|--------|
| 18 | Admin Panel | - | Settings | SYS |
| 19 | Manage Workshops | /admin/workshops | Building | SYS |
| 20 | Manage Waiting List | /admin/waiting-list | List | SYS |
| 21 | Workshop Analytics | /admin/analytics | BarChart | SYS |

### Permission Settings

- **Parent Menu (Admin Panel)**: Full access (view, create, edit, delete, approve)
- **Manage Workshops**: Full access (view, create, edit, delete, approve)
- **Manage Waiting List**: Full access (view, create, edit, delete, approve)
- **Workshop Analytics**: Read-only (view, print only)

### Roles yang Mendapat Akses

Default: `ADMIN`, `SUPER_ADMIN`, `OWNER`

Sesuaikan di script jika role berbeda.

## 🔧 Customization

### Mengubah Path Menu

Edit bagian `href` di script:

```sql
-- Contoh: ubah path untuk Manage Workshops
href = '/admin/workshops',  -- Ganti dengan path yang sesuai
```

### Mengubah Icon

Edit bagian `icon` di script. Icon harus sesuai dengan icon library yang digunakan:

- **Lucide React**: `Settings`, `Building`, `List`, `BarChart`, dll
- **Heroicons**: `CogIcon`, `BuildingOfficeIcon`, dll

### Mengubah Module ID

Edit bagian `module_id` di script:

```sql
module_id = 'SYS',  -- atau 'WKS' jika lebih sesuai
```

### Menambah Menu Baru

Copy template dari menu yang ada dan sesuaikan:

```sql
INSERT INTO sys_Menu (id, parent_id, menu_description, href, module_id, menu_type, has_child, icon, iStatus, createdBy, createdAt, updatedAt)
SELECT 
  22,  -- ID baru
  18,  -- Parent ID (Admin Panel)
  'Menu Baru',  -- Judul
  '/admin/new-menu',  -- Path
  'SYS',  -- Module
  'submenu',
  false,
  'IconName',
  '1',
  'system',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM sys_Menu WHERE id = 22);
```

## 📍 Routing di admin-ngebengkel

Pastikan routing di Next.js sesuai dengan path menu:

```
admin-ngebengkel/
├── app/
│   └── admin/
│       ├── workshops/
│       │   └── page.tsx          # /admin/workshops
│       ├── waiting-list/
│       │   └── page.tsx          # /admin/waiting-list
│       └── analytics/
│           └── page.tsx          # /admin/analytics
```

## 🐛 Troubleshooting

### Menu tidak muncul di sidebar?

1. ✅ Pastikan menu sudah ter-insert (cek dengan query verifikasi)
2. ✅ Pastikan permission sudah di-set untuk user role
3. ✅ Pastikan user login dengan role yang memiliki permission
4. ✅ Refresh browser atau clear cache
5. ✅ Cek console untuk error

### Permission tidak ter-insert?

1. ✅ Cek apakah role_id yang digunakan sudah benar
2. ✅ Cek apakah userCompanyRole dengan role tersebut ada
3. ✅ Cek apakah ada constraint violation (unique constraint)
4. ✅ Jalankan query verifikasi untuk melihat detail error

### Path tidak sesuai?

1. ✅ Pastikan path di database sesuai dengan routing Next.js
2. ✅ Pastikan route group `(dashboard)` atau `(admin)` tidak mempengaruhi path
3. ✅ Cek Next.js routing di `app/` directory

## 📝 Notes

- Script menggunakan `WHERE NOT EXISTS` untuk prevent duplicate
- ID menu bisa di-adjust jika sudah terpakai
- Permission otomatis di-set untuk semua admin roles (Option B recommended)
- Script aman untuk dijalankan multiple times (idempotent)

---

**Done!** 🎉

