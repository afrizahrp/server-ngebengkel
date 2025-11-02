-- ============================================================
-- BULK INSERT TEST DATA FOR PAGINATION, SORTING, SEARCH, FILTER
-- ============================================================
-- Data yang di-seed: 5 Customers, 10 Bookings, 10 Service Orders, 10 Reminders
-- Company & Branch assumed to exist: Company='00001', Branch='BR001'

-- ============================================================
-- 1. INSERT 5 CUSTOMERS
-- ============================================================

-- Delete existing test customers first (optional)
-- DELETE FROM "cmf_Customer" WHERE "company_id" = '00001' AND "id" LIKE 'CUST-00%';

INSERT INTO "cmf_Customer" (
  "company_id", "branch_id", "id", "name", "mobile1", "email", 
  "province", "city", "address1", "customerSince", "iStatus", 
  "createdAt", "updatedAt", "customerType"
) VALUES
  ('00001', 'BR001', 'CUST-001', 'Budi Santoso', '081234567890', 'budi.santoso@test.com', 'DKI Jakarta', 'Jakarta Selatan', 'Jl. Sudirman No. 123', NOW(), '1', NOW(), NOW(), 'I'),
  ('00001', 'BR001', 'CUST-002', 'Siti Nurhaliza', '081234567891', 'siti.nurhaliza@test.com', 'Jawa Barat', 'Bandung', 'Jl. Gatot Subroto No. 456', NOW(), '1', NOW(), NOW(), 'I'),
  ('00001', 'BR001', 'CUST-003', 'Ahmad Dahlan', '081234567892', 'ahmad.dahlan@test.com', 'DKI Jakarta', 'Jakarta Pusat', 'Jl. Thamrin No. 789', NOW(), '1', NOW(), NOW(), 'I'),
  ('00001', 'BR001', 'CUST-004', 'Rahma Widya', '081234567893', 'rahma.widya@test.com', 'Jawa Timur', 'Surabaya', 'Jl. Pemuda No. 321', NOW(), '1', NOW(), NOW(), 'I'),
  ('00001', 'BR001', 'CUST-005', 'PT Maju Bersama', '081234567894', 'info@majubersama.com', 'DKI Jakarta', 'Jakarta Barat', 'Jl. Kebon Jeruk No. 654', NOW(), '1', NOW(), NOW(), 'C');

-- ============================================================
-- 2. INSERT VEHICLE TYPE, BRAND, MODEL (if not exist)
-- ============================================================

-- Vehicle Type
INSERT INTO "wks_VehicleType" ("id", "name", "iStatus", "createdAt", "updatedAt") 
VALUES ('VT001', 'Mobil', '1', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Vehicle Brand
INSERT INTO "wks_VehicleBrand" ("vehicleType_id", "id", "name", "iStatus", "createdAt", "updatedAt")
VALUES 
  ('VT001', 'VB001', 'Toyota', '1', NOW(), NOW()),
  ('VT001', 'VB002', 'Honda', '1', NOW(), NOW())
ON CONFLICT ("vehicleType_id", "id") DO NOTHING;

-- Vehicle Model
INSERT INTO "wks_VehicleModel" ("vehicleType_id", "brand_id", "id", "name", "iStatus", "createdAt", "updatedAt")
VALUES 
  ('VT001', 'VB001', 'VM001', 'Avanza', '1', NOW(), NOW()),
  ('VT001', 'VB001', 'VM002', 'Innova', '1', NOW(), NOW()),
  ('VT001', 'VB002', 'VM003', 'Jazz', '1', NOW(), NOW()),
  ('VT001', 'VB002', 'VM004', 'CRV', '1', NOW(), NOW()),
  ('VT001', 'VB001', 'VM005', 'Fortuner', '1', NOW(), NOW())
ON CONFLICT ("vehicleType_id", "brand_id", "id") DO NOTHING;

-- ============================================================
-- 3. INSERT 5 CUSTOMER VEHICLES (1 per customer)
-- ============================================================

INSERT INTO "cmf_CustomerVehicle" (
  "company_id", "branch_id", "customer_id", "id", "vehicleType_id", "brand_id", "model_id",
  "licensePlate", "vehicleYear", "color", "currentOdometer", "iStatus", "createdAt", "updatedAt"
) VALUES
  ('00001', 'BR001', 'CUST-001', 'VEH-001', 'VT001', 'VB001', 'VM001', 'B 1234 ABC', 2020, 'Silver', 45000, '1', NOW(), NOW()),
  ('00001', 'BR001', 'CUST-002', 'VEH-002', 'VT001', 'VB002', 'VM003', 'D 5678 DEF', 2021, 'White', 30000, '1', NOW(), NOW()),
  ('00001', 'BR001', 'CUST-003', 'VEH-003', 'VT001', 'VB001', 'VM002', 'B 9012 GHI', 2019, 'Black', 60000, '1', NOW(), NOW()),
  ('00001', 'BR001', 'CUST-004', 'VEH-004', 'VT001', 'VB002', 'VM004', 'L 3456 JKL', 2022, 'Red', 25000, '1', NOW(), NOW()),
  ('00001', 'BR001', 'CUST-005', 'VEH-005', 'VT001', 'VB001', 'VM005', 'B 7890 MNO', 2021, 'White', 35000, '1', NOW(), NOW());

-- ============================================================
-- 4. INSERT 10 SERVICE BOOKINGS
-- ============================================================

INSERT INTO "wks_ServiceBooking" (
  "company_id", "branch_id", "id", "bookingNumber", "bookingDate",
  "customer_id", "customerVehicle_id", "vehicle_customer_id",
  "preferredDate", "preferredStartTime", "preferredEndTime",
  "complaintNotes", "status", "source", "transactionStatus", "isDeleted",
  "createdAt", "updatedAt", "serviceType_id"
) VALUES
  ('00001', 'BR001', 'BKG-001', 'BKG-2025-00001', NOW() - INTERVAL '10 days', 'CUST-001', 'VEH-001', 'CUST-001', CURRENT_DATE + 1, '09:00', '11:00', 'Mesin kasar, perlu service berkala', '0', 'WEB', 'E', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NULL),
  ('00001', 'BR001', 'BKG-002', 'BKG-2025-00002', NOW() - INTERVAL '9 days', 'CUST-002', 'VEH-002', 'CUST-002', CURRENT_DATE + 2, '10:00', '12:00', 'Rem bunyi, perlu cek', '1', 'APP', 'E', false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', NULL),
  ('00001', 'BR001', 'BKG-003', 'BKG-2025-00003', NOW() - INTERVAL '8 days', 'CUST-003', 'VEH-003', 'CUST-003', CURRENT_DATE + 3, '13:00', '15:00', 'AC kurang dingin', '2', 'PHONE', 'E', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NULL),
  ('00001', 'BR001', 'BKG-004', 'BKG-2025-00004', NOW() - INTERVAL '7 days', 'CUST-001', 'VEH-001', 'CUST-001', CURRENT_DATE + 4, '14:00', '16:00', 'Ganti oli rutin', '1', 'WEB', 'E', false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NULL),
  ('00001', 'BR001', 'BKG-005', 'BKG-2025-00005', NOW() - INTERVAL '6 days', 'CUST-004', 'VEH-004', 'CUST-004', CURRENT_DATE + 5, '08:00', '10:00', 'Ban bocor, perlu perbaikan', '0', 'WALKIN', 'E', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NULL),
  ('00001', 'BR001', 'BKG-006', 'BKG-2025-00006', NOW() - INTERVAL '5 days', 'CUST-005', 'VEH-005', 'CUST-005', CURRENT_DATE + 6, '09:00', '11:00', 'Service 40rb km', '1', 'APP', 'E', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NULL),
  ('00001', 'BR001', 'BKG-007', 'BKG-2025-00007', NOW() - INTERVAL '4 days', 'CUST-002', 'VEH-002', 'CUST-002', CURRENT_DATE + 7, '10:00', '12:00', 'Ganti kampas rem', '2', 'WEB', 'E', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NULL),
  ('00001', 'BR001', 'BKG-008', 'BKG-2025-00008', NOW() - INTERVAL '3 days', 'CUST-003', 'VEH-003', 'CUST-003', CURRENT_DATE + 8, '13:00', '15:00', 'Tune up mesin', '1', 'PHONE', 'E', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NULL),
  ('00001', 'BR001', 'BKG-009', 'BKG-2025-00009', NOW() - INTERVAL '2 days', 'CUST-001', 'VEH-001', 'CUST-001', CURRENT_DATE + 9, '14:00', '16:00', 'Ganti baterai', '0', 'WALKIN', 'E', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL),
  ('00001', 'BR001', 'BKG-010', 'BKG-2025-00010', NOW() - INTERVAL '1 days', 'CUST-004', 'VEH-004', 'CUST-004', CURRENT_DATE + 10, '08:00', '10:00', 'Inspection service', '1', 'APP', 'E', false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NULL);

-- ============================================================
-- 5. INSERT 10 SERVICE ORDERS
-- ============================================================

INSERT INTO "wks_ServiceOrder" (
  "company_id", "branch_id", "id", "orderNumber", "orderDate",
  "customer_id", "customerVehicle_id", "vehicle_customer_id",
  "odometerIn", "fuelLevel", "vehicleConditionNotes",
  "customerComplaint", "serviceRequest",
  "serviceCost", "partsCost", "totalAmount",
  "orderStatus", "paymentStatus", "priority", "transactionStatus", "isDeleted",
  "createdAt", "updatedAt"
) VALUES
  ('00001', 'BR001', 'SO-001', 'SO-2025-00001', NOW() - INTERVAL '10 days', 'CUST-001', 'VEH-001', 'CUST-001', 45000, 'H', 'Kendaraan bersih, tidak ada goresan', 'Mesin kasar', 'Ganti oli dan filter', 350000, 500000, 850000, '5', '2', 'N', 'E', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('00001', 'BR001', 'SO-002', 'SO-2025-00002', NOW() - INTERVAL '9 days', 'CUST-002', 'VEH-002', 'CUST-002', 30000, 'Q', 'Ada goresan kecil di bumper', 'Rem bunyi', 'Cek kampas rem', 200000, 300000, 500000, '4', '1', 'N', 'E', false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('00001', 'BR001', 'SO-003', 'SO-2025-00003', NOW() - INTERVAL '8 days', 'CUST-003', 'VEH-003', 'CUST-003', 60000, 'F', 'Kondisi baik', 'AC kurang dingin', 'Service AC', 400000, 450000, 850000, '5', '2', 'N', 'E', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  ('00001', 'BR001', 'SO-004', 'SO-2025-00004', NOW() - INTERVAL '7 days', 'CUST-001', 'VEH-001', 'CUST-001', 46000, 'H', 'Tidak ada masalah', 'Ganti oli rutin', 'Service berkala', 250000, 350000, 600000, '1', '0', 'L', 'E', false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('00001', 'BR001', 'SO-005', 'SO-2025-00005', NOW() - INTERVAL '6 days', 'CUST-004', 'VEH-004', 'CUST-004', 25000, 'E', 'Ban bocor sudah diperbaiki', 'Ban bocor', 'Perbaikan ban', 150000, 200000, 350000, '5', '2', 'H', 'E', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('00001', 'BR001', 'SO-006', 'SO-2025-00006', NOW() - INTERVAL '5 days', 'CUST-005', 'VEH-005', 'CUST-005', 35000, 'Q', 'Kondisi prima', 'Service 40rb km', 'Service berkala lengkap', 750000, 800000, 1550000, '2', '0', 'N', 'E', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('00001', 'BR001', 'SO-007', 'SO-2025-00007', NOW() - INTERVAL '4 days', 'CUST-002', 'VEH-002', 'CUST-002', 32000, 'H', 'Tidak ada catatan', 'Ganti kampas rem', 'Service rem depan belakang', 300000, 400000, 700000, '3', '0', 'N', 'E', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('00001', 'BR001', 'SO-008', 'SO-2025-00008', NOW() - INTERVAL '3 days', 'CUST-003', 'VEH-003', 'CUST-003', 61000, 'F', 'Kondisi baik', 'Tune up mesin', 'Tune up lengkap', 500000, 600000, 1100000, '2', '0', 'H', 'E', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('00001', 'BR001', 'SO-009', 'SO-2025-00009', NOW() - INTERVAL '2 days', 'CUST-001', 'VEH-001', 'CUST-001', 47000, 'Q', 'Ban aus', 'Ganti baterai', 'Ganti baterai AGM', 300000, 250000, 550000, '5', '2', 'N', 'E', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('00001', 'BR001', 'SO-010', 'SO-2025-00010', NOW() - INTERVAL '1 days', 'CUST-004', 'VEH-004', 'CUST-004', 26000, 'H', 'Kondisi baik', 'Inspection service', 'Pemeriksaan lengkap', 200000, 100000, 300000, '0', '0', 'L', 'E', false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days');

-- ============================================================
-- 6. INSERT 10 REMINDERS
-- ============================================================

INSERT INTO "sys_Reminder" (
  "company_id", "branch_id", "id", "reminderNumber",
  "entityType", "entity_id",
  "reminderType", "title", "message",
  "scheduledDate", "scheduledTime",
  "sendBeforeDays", "sendBeforeHours",
  "customer_id",
  "recipientPhone", "recipientEmail",
  "channels", "status",
  "sentCount", "maxRetries", "retryCount",
  "transactionStatus", "isDeleted",
  "createdAt", "updatedAt"
) VALUES
  ('00001', 'BR001', 'REM-001', 'REM-2025-00001', 'SO', 'SO-001', 'SCH', 'Reminder Service Order SO-001', 'Jangan lupa follow up service order SO-001', CURRENT_DATE + 5, '09:00', 1, 24, 'CUST-001', '081234567890', 'budi.santoso@test.com', 'WA,EM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('00001', 'BR001', 'REM-002', 'REM-2025-00002', 'BK', 'BKG-002', 'APT', 'Reminder Appointment Booking BKG-002', 'Customer appointment akan datang besok', CURRENT_DATE + 1, '10:00', 1, 2, 'CUST-002', '081234567891', 'siti.nurhaliza@test.com', 'WA,EM,SM', 'S', 1, 3, 0, 'E', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('00001', 'BR001', 'REM-003', 'REM-2025-00003', 'SO', 'SO-003', 'DUE', 'Reminder Service Order Due SO-003', 'Service order sudah due dan perlu segera diselesaikan', CURRENT_DATE - 1, NULL, NULL, NULL, 'CUST-003', '081234567892', 'ahmad.dahlan@test.com', 'WA', 'T', 1, 3, 0, 'E', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('00001', 'BR001', 'REM-004', 'REM-2025-00004', 'BK', 'BKG-004', 'APT', 'Reminder Booking Follow Up BKG-004', 'Konfirmasi ulang booking dengan customer', CURRENT_DATE + 3, '14:00', 2, 24, 'CUST-001', '081234567890', 'budi.santoso@test.com', 'WA,EM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('00001', 'BR001', 'REM-005', 'REM-2025-00005', 'SO', 'SO-005', 'SCH', 'Reminder Next Service SO-005', 'Infromasi next service untuk kendaraan customer', CURRENT_DATE + 10, '08:00', 7, NULL, 'CUST-004', '081234567893', 'rahma.widya@test.com', 'EM,SM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('00001', 'BR001', 'REM-006', 'REM-2025-00006', 'PAY', 'SO-006', 'PAY', 'Reminder Payment Due SO-006', 'Pembayaran service order sudah jatuh tempo', CURRENT_DATE + 3, NULL, 3, NULL, 'CUST-005', '081234567894', 'info@majubersama.com', 'WA,EM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('00001', 'BR001', 'REM-007', 'REM-2025-00007', 'BK', 'BKG-007', 'APT', 'Reminder Booking Appointment BKG-007', 'Customer akan datang untuk service rem', CURRENT_DATE + 2, '10:00', 1, 24, 'CUST-002', '081234567891', 'siti.nurhaliza@test.com', 'WA', 'S', 1, 3, 0, 'E', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('00001', 'BR001', 'REM-008', 'REM-2025-00008', 'SO', 'SO-008', 'FUP', 'Reminder Follow Up SO-008', 'Follow up progress service order', CURRENT_DATE + 1, '15:00', 1, NULL, 'CUST-003', '081234567892', 'ahmad.dahlan@test.com', 'WA,EM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('00001', 'BR001', 'REM-009', 'REM-2025-00009', 'VM', 'VEH-001', 'SCH', 'Reminder Service Berkala Kendaraan', 'Kendaraan perlu service rutin 50rb km', CURRENT_DATE + 5, NULL, 7, NULL, 'CUST-001', '081234567890', 'budi.santoso@test.com', 'WA,EM,SM', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('00001', 'BR001', 'REM-010', 'REM-2025-00010', 'CUS', 'BKG-010', 'CUS', 'Custom Reminder untuk Booking', 'Custom reminder untuk customer VIP', CURRENT_DATE + 7, '09:00', 1, 24, 'CUST-004', '081234567893', 'rahma.widya@test.com', 'WA', 'P', 0, 3, 0, 'E', false, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days');

-- ============================================================
-- SUMMARY
-- ============================================================

SELECT '✅ Seed completed successfully!' as message;
SELECT COUNT(*) as customer_count FROM "cmf_Customer" WHERE "company_id" = '00001' AND "id" LIKE 'CUST-00%';
SELECT COUNT(*) as booking_count FROM "wks_ServiceBooking" WHERE "company_id" = '00001' AND "id" LIKE 'BKG-%';
SELECT COUNT(*) as service_order_count FROM "wks_ServiceOrder" WHERE "company_id" = '00001' AND "id" LIKE 'SO-%';
SELECT COUNT(*) as reminder_count FROM "sys_Reminder" WHERE "company_id" = '00001' AND "id" LIKE 'REM-%';





