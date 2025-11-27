-- ============================================================================
-- INSERT MENU UNTUK WAITING LIST MANAGEMENT
-- ============================================================================
-- Menu ini untuk admin upload images/videos untuk waiting list
-- Path: /waiting-list (di app/(dashboard)/waiting-list/page.tsx)
--
-- Cara menjalankan:
-- 1. Buka database client (pgAdmin, DBeaver, atau psql)
-- 2. Connect ke database ngebengkel
-- 3. Copy paste dan jalankan script ini
-- 4. Setelah menu ter-insert, set permission untuk user roles yang perlu akses
-- ============================================================================

-- 1. Insert parent menu "Waiting List" (jika belum ada)
-- ID 16 digunakan (cek dulu apakah sudah terpakai)
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  16,  -- ID baru
  NULL,  -- Parent menu (tidak ada parent)
  'Waiting List',  -- Judul menu
  NULL,  -- Tidak ada href untuk parent menu
  'WKS',  -- Module Workshop
  'menu',  -- Tipe menu
  true,  -- Memiliki child
  'List',  -- Icon (bisa diganti: "FileText", "Upload", "FileImage", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 16
);

-- 2. Insert submenu "/waiting-list" untuk upload management
-- ID 17 digunakan (cek dulu apakah sudah terpakai)
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  17,  -- ID baru
  16,  -- Parent ID (Waiting List menu)
  'Manage Waiting List',  -- Judul submenu
  '/waiting-list',  -- Path ke halaman upload (app/(dashboard)/waiting-list/page.tsx)
  'WKS',  -- Module Workshop
  'submenu',  -- Tipe submenu
  false,  -- Tidak memiliki child
  'Upload',  -- Icon (bisa diganti: "Image", "FileImage", "CloudUpload", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 17
);

-- ============================================================================
-- SET PERMISSION UNTUK MENU WAITING LIST
-- ============================================================================
-- Setelah menu ter-insert, perlu set permission untuk user roles
-- 
-- Cara set permission:
-- 1. Cari userCompanyRole_id yang perlu akses (biasanya admin/owner)
--    Query: SELECT id, role_id FROM sys_UserCompanyRole WHERE role_id = 'ADMIN' (atau role lain)
-- 2. Insert permission untuk menu parent (id=16) dan submenu (id=17)
-- 3. Atau bisa copy permission dari menu lain yang sudah ada
-- ============================================================================

-- Contoh: Set permission untuk semua admin roles
-- Ganti userCompanyRole_id dengan ID yang sesuai
/*
INSERT INTO "sys_Menu_Permission" ("userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  ucr."id",  -- userCompanyRole_id
  16,  -- menu_id (parent menu Waiting List)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  false,  -- can_delete
  false,  -- can_print
  false,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" = 'ADMIN'  -- Ganti dengan role yang sesuai
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 16
  );

-- Set permission untuk submenu (id=17)
INSERT INTO "sys_Menu_Permission" ("userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  ucr."id",  -- userCompanyRole_id
  17,  -- menu_id (submenu Manage Waiting List)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  false,  -- can_delete
  false,  -- can_print
  false,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" = 'ADMIN'  -- Ganti dengan role yang sesuai
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 17
  );
*/

