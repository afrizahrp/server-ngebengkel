-- ============================================================================
-- INSERT MENU UNTUK ADMIN PANEL (admin-ngebengkel)
-- ============================================================================
-- Script ini untuk membuat menu di admin panel yang terpisah dari client-ngebengkel
-- Admin panel digunakan untuk mengatur seluruh workshop dan waiting list
-- 
-- Cara menjalankan:
-- 1. Buka database client (pgAdmin, DBeaver, atau psql)
-- 2. Connect ke database ngebengkel
-- 3. Copy paste dan jalankan script ini
-- 4. Setelah menu ter-insert, set permission untuk admin roles
-- ============================================================================

-- ============================================================================
-- PART 1: INSERT MENU ITEMS
-- ============================================================================

-- 1. Insert parent menu "Admin Panel" atau "Workshop Management"
-- ID 18 digunakan (cek dulu apakah sudah terpakai, adjust jika perlu)
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  18,  -- ID baru (adjust jika sudah terpakai)
  NULL,  -- Parent menu (tidak ada parent)
  'Admin Panel',  -- Judul menu (bisa diganti: "Workshop Management", "System Admin", dll)
  NULL,  -- Tidak ada href untuk parent menu
  'SYS',  -- Module System (atau bisa 'WKS' jika lebih sesuai)
  'menu',  -- Tipe menu
  true,  -- Memiliki child
  'Settings',  -- Icon (bisa diganti: "Shield", "Cog", "Wrench", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 18
);

-- 2. Insert submenu "Manage Workshops" (untuk mengatur seluruh workshop)
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  19,  -- ID baru
  18,  -- Parent ID (Admin Panel menu)
  'Manage Workshops',  -- Judul submenu
  '/admin/workshops',  -- Path ke halaman (adjust sesuai routing admin-ngebengkel)
  'SYS',  -- Module System
  'submenu',  -- Tipe submenu
  false,  -- Tidak memiliki child
  'Building',  -- Icon (bisa diganti: "Store", "Building2", "Factory", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 19
);

-- 3. Insert submenu "Manage Waiting List" (untuk mengatur seluruh waiting list)
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  20,  -- ID baru
  18,  -- Parent ID (Admin Panel menu)
  'Manage Waiting List',  -- Judul submenu
  '/admin/waiting-list',  -- Path ke halaman (adjust sesuai routing admin-ngebengkel)
  'SYS',  -- Module System
  'submenu',  -- Tipe submenu
  false,  -- Tidak memiliki child
  'List',  -- Icon (bisa diganti: "FileText", "ClipboardList", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 20
);

-- 4. (Optional) Insert submenu "Workshop Analytics" atau menu lain yang diperlukan
INSERT INTO "sys_Menu" ("id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon", "iStatus", "createdBy", "createdAt", "updatedAt")
SELECT 
  21,  -- ID baru
  18,  -- Parent ID (Admin Panel menu)
  'Workshop Analytics',  -- Judul submenu
  '/admin/analytics',  -- Path ke halaman
  'SYS',  -- Module System
  'submenu',  -- Tipe submenu
  false,  -- Tidak memiliki child
  'BarChart',  -- Icon (bisa diganti: "TrendingUp", "Activity", dll)
  '1',  -- Status aktif
  'system',  -- Created by
  NOW(),  -- Created at
  NOW()  -- Updated at
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu" WHERE "id" = 21
);

-- ============================================================================
-- PART 2: INSERT MENU PERMISSIONS
-- ============================================================================
-- Setelah menu ter-insert, set permission untuk admin/super admin roles
-- 
-- CATATAN PENTING:
-- 1. Cari dulu userCompanyRole_id yang perlu akses (biasanya admin/super admin)
--    Query: SELECT id, company_id, branch_id, userRole_id, role_id 
--           FROM sys_UserCompanyRole ucr
--           JOIN sys_UserRole ur ON ucr.userRole_id = ur.id
--           WHERE ur.role_id IN ('ADMIN', 'SUPER_ADMIN', 'OWNER');
-- 
-- 2. Ganti userCompanyRole_id di bawah dengan ID yang sesuai
-- 3. Atau gunakan query dinamis untuk set permission ke semua admin roles
-- ============================================================================

-- ============================================================================
-- OPTION A: Set Permission untuk Specific userCompanyRole_id
-- ============================================================================
-- Ganti <userCompanyRole_id> dengan ID yang sesuai
-- Uncomment dan sesuaikan ID-nya

/*
-- Permission untuk parent menu "Admin Panel" (id=18)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + 1,  -- Generate ID otomatis (untuk single insert)
  <userCompanyRole_id>,  -- GANTI dengan userCompanyRole_id yang sesuai
  18,  -- menu_id (Admin Panel)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu_Permission" 
  WHERE "userCompanyRole_id" = <userCompanyRole_id> AND "menu_id" = 18
);

-- Permission untuk "Manage Workshops" (id=19)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + 1,  -- Generate ID otomatis (untuk single insert)
  <userCompanyRole_id>,  -- GANTI dengan userCompanyRole_id yang sesuai
  19,  -- menu_id (Manage Workshops)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu_Permission" 
  WHERE "userCompanyRole_id" = <userCompanyRole_id> AND "menu_id" = 19
);

-- Permission untuk "Manage Waiting List" (id=20)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + 1,  -- Generate ID otomatis (untuk single insert)
  <userCompanyRole_id>,  -- GANTI dengan userCompanyRole_id yang sesuai
  20,  -- menu_id (Manage Waiting List)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu_Permission" 
  WHERE "userCompanyRole_id" = <userCompanyRole_id> AND "menu_id" = 20
);

-- Permission untuk "Workshop Analytics" (id=21) - Optional
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + 1,  -- Generate ID otomatis (untuk single insert)
  <userCompanyRole_id>,  -- GANTI dengan userCompanyRole_id yang sesuai
  21,  -- menu_id (Workshop Analytics)
  true,  -- can_view
  false,  -- can_create (analytics biasanya read-only)
  false,  -- can_edit
  false,  -- can_delete
  true,  -- can_print
  false,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
WHERE NOT EXISTS (
  SELECT 1 FROM "sys_Menu_Permission" 
  WHERE "userCompanyRole_id" = <userCompanyRole_id> AND "menu_id" = 21
);
*/

-- ============================================================================
-- OPTION B: Set Permission untuk Semua Admin Roles (Recommended)
-- ============================================================================
-- Script ini akan otomatis set permission untuk semua userCompanyRole yang memiliki
-- role_id = 'ADMIN', 'SUPER_ADMIN', atau 'OWNER'
-- Sesuaikan role_id sesuai dengan role yang ada di sistem Anda

-- Permission untuk parent menu "Admin Panel" (id=18)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + ROW_NUMBER() OVER (ORDER BY ucr."id"),  -- Generate ID otomatis
  ucr."id",  -- userCompanyRole_id
  18,  -- menu_id (Admin Panel)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" IN ('ADMIN', 'SUPER_ADMIN', 'OWNER')  -- Sesuaikan dengan role yang ada
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 18
  );

-- Permission untuk "Manage Workshops" (id=19)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + ROW_NUMBER() OVER (ORDER BY ucr."id"),  -- Generate ID otomatis
  ucr."id",  -- userCompanyRole_id
  19,  -- menu_id (Manage Workshops)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" IN ('ADMIN', 'SUPER_ADMIN', 'OWNER')  -- Sesuaikan dengan role yang ada
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 19
  );

-- Permission untuk "Manage Waiting List" (id=20)
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + ROW_NUMBER() OVER (ORDER BY ucr."id"),  -- Generate ID otomatis
  ucr."id",  -- userCompanyRole_id
  20,  -- menu_id (Manage Waiting List)
  true,  -- can_view
  true,  -- can_create
  true,  -- can_edit
  true,  -- can_delete
  false,  -- can_print
  true,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" IN ('ADMIN', 'SUPER_ADMIN', 'OWNER')  -- Sesuaikan dengan role yang ada
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 20
  );

-- Permission untuk "Workshop Analytics" (id=21) - Optional
INSERT INTO "sys_Menu_Permission" ("id", "userCompanyRole_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete", "can_print", "can_approve", "iStatus", "createdBy", "createdAt")
SELECT 
  (SELECT COALESCE(MAX("id"), 0) FROM "sys_Menu_Permission") + ROW_NUMBER() OVER (ORDER BY ucr."id"),  -- Generate ID otomatis
  ucr."id",  -- userCompanyRole_id
  21,  -- menu_id (Workshop Analytics)
  true,  -- can_view
  false,  -- can_create (analytics biasanya read-only)
  false,  -- can_edit
  false,  -- can_delete
  true,  -- can_print
  false,  -- can_approve
  'Active',  -- iStatus
  'system',  -- createdBy
  NOW()  -- createdAt
FROM "sys_UserCompanyRole" ucr
JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
WHERE ur."role_id" IN ('ADMIN', 'SUPER_ADMIN', 'OWNER')  -- Sesuaikan dengan role yang ada
  AND ucr."iStatus" = 'Active'
  AND NOT EXISTS (
    SELECT 1 FROM "sys_Menu_Permission" 
    WHERE "userCompanyRole_id" = ucr."id" AND "menu_id" = 21
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Jalankan query ini untuk verifikasi menu dan permission sudah ter-insert

-- 1. Cek menu yang sudah ter-insert
-- SELECT "id", "parent_id", "menu_description", "href", "module_id", "menu_type", "has_child", "icon" 
-- FROM "sys_Menu" 
-- WHERE "id" IN (18, 19, 20, 21)
-- ORDER BY "id";

-- 2. Cek permission yang sudah ter-insert
-- SELECT 
--   mp."id",
--   mp."userCompanyRole_id",
--   mp."menu_id",
--   m."menu_description",
--   mp."can_view",
--   mp."can_create",
--   mp."can_edit",
--   mp."can_delete"
-- FROM "sys_Menu_Permission" mp
-- JOIN "sys_Menu" m ON mp."menu_id" = m."id"
-- WHERE mp."menu_id" IN (18, 19, 20, 21)
-- ORDER BY mp."menu_id", mp."userCompanyRole_id";

-- 3. Cek userCompanyRole yang memiliki akses
-- SELECT 
--   ucr."id",
--   ucr."company_id",
--   ucr."branch_id",
--   ur."role_id",
--   ur."role_name"
-- FROM "sys_UserCompanyRole" ucr
-- JOIN "sys_UserRole" ur ON ucr."userRole_id" = ur."id"
-- WHERE ur."role_id" IN ('ADMIN', 'SUPER_ADMIN', 'OWNER')
--   AND ucr."iStatus" = 'Active';

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. ID menu (18, 19, 20, 21) bisa di-adjust jika sudah terpakai
-- 2. Path href (/admin/workshops, /admin/waiting-list) sesuaikan dengan routing di admin-ngebengkel
-- 3. Module_id bisa 'SYS' atau 'WKS' tergantung kebutuhan
-- 4. Icon bisa diganti sesuai dengan icon library yang digunakan (lucide-react, heroicons, dll)
-- 5. Role_id ('ADMIN', 'SUPER_ADMIN', 'OWNER') sesuaikan dengan role yang ada di sys_UserRole
-- 6. Permission bisa di-adjust sesuai kebutuhan (misalnya analytics read-only)
-- ============================================================================

