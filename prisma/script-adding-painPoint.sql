-- ============================================================================
-- Seed Data untuk Pain Point
-- ============================================================================
-- Script ini menambahkan data pain point (masalah kendaraan) ke tabel "wks_PainPoint"
-- Format mengikuti pattern dari migration script dan schema Prisma
--
-- Catatan:
-- - ID menggunakan left(replace(gen_random_uuid()::text, '-', ''), 21) untuk menghasilkan 21 karakter
--   (sesuai dengan @db.Char(21) di schema Prisma)
-- - Keywords menggunakan JSONB cast untuk tipe data Json di Prisma
-- - Semua identifier menggunakan double quotes sesuai style project
-- - Timestamp menggunakan NOW() untuk konsistensi
-- - Menggunakan ON CONFLICT untuk menghindari error duplicate key pada slug
-- ============================================================================

INSERT INTO "public"."wks_PainPoint" 
(
  "id",
  "slug",
  "title",
  "description",
  "category",
  "keywords",
  "iconName",
  "imageUrl",
  "popularityScore",
  "viewCount",
  "searchCount",
  "isUrgent",
  "priority",
  "isActive",
  "isPopular",
  "isDeleted",
  "isDraft",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt"
)
SELECT * FROM (VALUES
-- 1. Mesin Overheat
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'overheat',
  'Mesin Overheat',
  'Suhu mesin terlalu panas, biasanya disebabkan oleh masalah pendinginan atau kekurangan coolant.',
  'URGENT'::"PainPointCategoryEnum",
  '["mesin overheat","suhu mesin panas","coolant habis","kipas radiator rusak","thermostat rusak"]'::jsonb,
  'Flame',
  NULL,
  0,
  0,
  0,
  true,
  10,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 2. Kendaraan Mogok
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'mogok',
  'Kendaraan Mogok',
  'Kendaraan tiba-tiba tidak dapat berjalan / berhenti beroperasi di tengah perjalanan.',
  'URGENT'::"PainPointCategoryEnum",
  '["mobil mogok","motor mogok","kendaraan tidak jalan","mogok di jalan","mogok mendadak"]'::jsonb,
  'Wrench',
  NULL,
  0,
  0,
  0,
  true,
  10,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 3. Bensin Boros
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'bensin-boros',
  'Bensin Boros',
  'Kendaraan mengalami konsumsi bahan bakar berlebih dari kondisi normal.',
  'GENERAL'::"PainPointCategoryEnum",
  '["bensin boros","bbm boros","mobil boros","motor boros","konsumsi bbm tinggi"]'::jsonb,
  'Gauge',
  NULL,
  0,
  0,
  0,
  false,
  7,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 4. Mesin Susah Hidup
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'mesin-susah-hidup',
  'Mesin Susah Hidup',
  'Mesin sulit dinyalakan baik saat kondisi dingin maupun panas.',
  'ELECTRICAL'::"PainPointCategoryEnum",
  '["starter susah","dinamo starter","busi lemah","kelistrikan pengapian","mesin tidak mau nyala"]'::jsonb,
  'Zap',
  NULL,
  0,
  0,
  0,
  false,
  9,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 5. Getar Berlebih
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'getar-berlebih',
  'Getar Berlebih Saat Jalan',
  'Kendaraan terasa bergetar tidak wajar saat melaju.',
  'GENERAL'::"PainPointCategoryEnum",
  '["mobil bergetar","motor bergetar","getaran tidak normal","stir getar","body getar"]'::jsonb,
  'Vibrate',
  NULL,
  0,
  0,
  0,
  false,
  6,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 6. Stir Berat
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'stir-berat',
  'Stir Terasa Berat',
  'Stir atau handlebar terasa berat dan sulit dikendalikan.',
  'STEERING'::"PainPointCategoryEnum",
  '["stir berat","power steering rusak","setang berat motor","steering keras","pompa steering"]'::jsonb,
  'ArrowRight',
  NULL,
  0,
  0,
  0,
  false,
  8,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 7. Kopling Selip
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'kopling-selip',
  'Kopling Selip',
  'Tenaga mesin tidak tersalurkan optimum ke roda akibat kopling aus atau bermasalah.',
  'GENERAL'::"PainPointCategoryEnum",
  '["kopling mobil selip","kopling motor selip","kopling aus","kampas kopling","tenaga hilang"]'::jsonb,
  'Layers',
  NULL,
  0,
  0,
  0,
  false,
  9,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 8. Asap Knalpot Tidak Normal
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'asap-knalpot',
  'Asap Knalpot Tidak Normal',
  'Kendaraan mengeluarkan asap knalpot yang pekat / berwarna tidak wajar.',
  'URGENT'::"PainPointCategoryEnum",
  '["asap hitam","asap putih","asap biru","oli terbakar","mesin makan oli"]'::jsonb,
  'Smoke',
  NULL,
  0,
  0,
  0,
  true,
  10,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 9. Starter Bunyi Tek-Tek
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'starter-berbunyi',
  'Starter Bunyi Tek-Tek',
  'Starter mengeluarkan bunyi tek-tek namun mesin tidak mau menyala.',
  'ELECTRICAL'::"PainPointCategoryEnum",
  '["starter bunyi","solenoid starter","mobil tidak mau nyala","aki drop","relay starter"]'::jsonb,
  'BatteryWarning',
  NULL,
  0,
  0,
  0,
  false,
  10,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 10. Lampu Redup
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'lampu-redup',
  'Lampu Redup / Kurang Terang',
  'Lampu kendaraan menyala tapi intensitas cahaya lemah / redup.',
  'GENERAL'::"PainPointCategoryEnum",
  '["lampu redup mobil","lampu redup motor","alternator lemah","lampu redup","kelistrikan lampu"]'::jsonb,
  'LightbulbOff',
  NULL,
  0,
  0,
  0,
  false,
  6,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 11. Klakson Mati
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'klakson-mati',
  'Klakson Mati',
  'Klakson tidak berbunyi / tidak merespon saat ditekan.',
  'GENERAL'::"PainPointCategoryEnum",
  '["klakson mobil mati","klakson motor mati","horn relay","sekring klakson","tombol klakson"]'::jsonb,
  'BellOff',
  NULL,
  0,
  0,
  0,
  false,
  7,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
),

-- 12. Mesin Ngelitik
(
  left(replace(gen_random_uuid()::text, '-', ''), 21),
  'mesin-ngelitik',
  'Suara Mesin Ngelitik',
  'Terdengar bunyi ketukan halus seperti logam beradu, sering dipicu oktan BBM terlalu rendah, carbon deposit, atau pengapian tidak presisi.',
  'GENERAL'::"PainPointCategoryEnum",
  '["mesin ngelitik","suara ketukan mesin","knocking halus","carbon deposit","bensin oktan rendah","timing pengapian"]'::jsonb,
  'Car',
  NULL,
  0,
  0,
  0,
  false,
  8,
  true,
  true,
  false,
  false,
  'system',
  NOW(),
  'system',
  NOW()
)) AS t(
  "id", "slug", "title", "description", "category", "keywords", "iconName", "imageUrl",
  "popularityScore", "viewCount", "searchCount", "isUrgent", "priority", 
  "isActive", "isPopular", "isDeleted", "isDraft", "createdBy", "createdAt", "updatedBy", "updatedAt"
)
WHERE NOT EXISTS (
  SELECT 1 FROM "public"."wks_PainPoint" WHERE "slug" = t."slug"
);
