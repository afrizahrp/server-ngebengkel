-- ============================================================================
-- Full-Text Search Index untuk Pain Point
-- ============================================================================
-- Script ini menambahkan full-text search index untuk kolom "title" dan "keywords"
-- di tabel "wks_PainPoint" untuk mempercepat pencarian

-- Step 1: Buat generated column untuk tsvector dari "title"
-- (PostgreSQL akan otomatis update tsvector saat "title" berubah)
ALTER TABLE "public"."wks_PainPoint" 
ADD COLUMN IF NOT EXISTS "title_tsvector" tsvector 
GENERATED ALWAYS AS (to_tsvector('indonesian', COALESCE("title", ''))) STORED;

-- Step 2: Buat function untuk extract keywords dari JSON array
-- Function ini akan digunakan untuk generate tsvector dari keywords
CREATE OR REPLACE FUNCTION extract_keywords_text(keywords_json jsonb)
RETURNS text AS $$
BEGIN
  IF keywords_json IS NULL OR keywords_json = 'null'::jsonb THEN
    RETURN '';
  END IF;
  
  RETURN (
    SELECT string_agg(value::text, ' ')
    FROM jsonb_array_elements_text(keywords_json)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 3: Buat generated column untuk tsvector dari "keywords" (JSON array)
-- Menggunakan function yang sudah dibuat
ALTER TABLE "public"."wks_PainPoint" 
ADD COLUMN IF NOT EXISTS "keywords_tsvector" tsvector 
GENERATED ALWAYS AS (
  to_tsvector('indonesian', COALESCE(extract_keywords_text("keywords"::jsonb), ''))
) STORED;

-- Step 4: Buat combined tsvector untuk search di "title" + "keywords"
ALTER TABLE "public"."wks_PainPoint" 
ADD COLUMN IF NOT EXISTS "search_tsvector" tsvector 
GENERATED ALWAYS AS (
  to_tsvector('indonesian', COALESCE("title", '')) ||
  to_tsvector('indonesian', COALESCE(extract_keywords_text("keywords"::jsonb), ''))
) STORED;

-- Step 5: Buat GIN index untuk "title_tsvector" (untuk search di title saja)
CREATE INDEX IF NOT EXISTS "idx_painpoint_title_fulltext" 
ON "public"."wks_PainPoint" 
USING GIN ("title_tsvector");

-- Step 6: Buat GIN index untuk "keywords_tsvector" (untuk search di keywords saja)
CREATE INDEX IF NOT EXISTS "idx_painpoint_keywords_fulltext" 
ON "public"."wks_PainPoint" 
USING GIN ("keywords_tsvector");

-- Step 7: Buat GIN index untuk "search_tsvector" (untuk search di title + keywords)
-- INI YANG PALING PENTING - digunakan untuk general search
CREATE INDEX IF NOT EXISTS "idx_painpoint_search_fulltext" 
ON "public"."wks_PainPoint" 
USING GIN ("search_tsvector");

-- ============================================================================
-- Contoh penggunaan full-text search (dengan style project):
-- ============================================================================
-- 
-- 1. Search di "title" + "keywords":
--    SELECT "id", "title", "slug", "category", "isActive"
--    FROM "wks_PainPoint" 
--    WHERE "search_tsvector" @@ to_tsquery('indonesian', 'bunyi & gludak')
--    ORDER BY "createdAt" DESC;
--
-- 2. Search di "title" saja:
--    SELECT "id", "title", "slug"
--    FROM "wks_PainPoint" 
--    WHERE "title_tsvector" @@ to_tsquery('indonesian', 'AC & tidak & dingin')
--    ORDER BY "createdAt" DESC;
--
-- 3. Search dengan ranking (relevance):
--    SELECT 
--      "id", 
--      "title", 
--      "slug",
--      ts_rank("search_tsvector", to_tsquery('indonesian', 'bunyi & gludak')) as "rank"
--    FROM "wks_PainPoint" 
--    WHERE "search_tsvector" @@ to_tsquery('indonesian', 'bunyi & gludak')
--    ORDER BY "rank" DESC, "createdAt" DESC;
--
-- 4. Search dengan phrase matching:
--    SELECT "id", "title", "slug"
--    FROM "wks_PainPoint" 
--    WHERE "search_tsvector" @@ phraseto_tsquery('indonesian', 'bunyi gludak gluduk')
--    ORDER BY "createdAt" DESC;
--
-- 5. Search dengan filter "isActive" dan "isDeleted":
--    SELECT "id", "title", "slug", "category", "isPopular"
--    FROM "wks_PainPoint" 
--    WHERE "search_tsvector" @@ to_tsquery('indonesian', 'bunyi & gludak')
--      AND "isActive" = true
--      AND "isDeleted" = false
--    ORDER BY "isPopular" DESC, "popularityScore" DESC, "createdAt" DESC;
--
-- ============================================================================
-- Catatan:
-- ============================================================================
-- - 'indonesian' adalah text search configuration untuk bahasa Indonesia
-- - Jika tidak tersedia, bisa ganti dengan 'simple' atau 'english'
-- - Generated columns akan otomatis update saat data berubah
-- - GIN index sangat cepat untuk full-text search tapi butuh storage lebih
-- - Index ini akan mempercepat query search di pain points
-- - Semua identifier menggunakan double quotes sesuai style project

