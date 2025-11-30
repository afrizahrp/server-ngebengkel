# Pain Point Query Flow - Tanpa OpenAI di Runtime

## Flow Query User → Bengkel

```
User Query: "bunyi gludak-gluduk pada saat mobil jalan"
    ↓
[Step 1: FTS Search]
    ↓
Match Pain Point: "Masalah Suspensi" (via FTS di keywords + title)
    ↓
[Step 2: Database Query - NO OpenAI needed]
    ↓
Get Service Types dari junction table:
  - wks_PainPointServiceType WHERE painPoint_id = "suspensi"
  - Service Types: ["Perbaikan Suspensi", "Ganti Shock Absorber", ...]
    ↓
[Step 3: Get Bengkel]
    ↓
Query bengkel yang punya service types tersebut:
  - JOIN wks_ServiceType dengan bengkel
  - Filter: serviceType.name IN (matched service types)
    ↓
Results: List bengkel yang bisa handle masalah suspensi
```

## Kapan OpenAI Diperlukan?

### ✅ PERLU OpenAI (Step 3 - Seed Data):
1. **Generate Pain Points** - Buat pain points baru dengan keywords
2. **Mapping Pain Point → Service Types** - Tentukan service types yang relevan
3. **Calculate Relevance Score** - Beri score 1-10 untuk setiap mapping

**Contoh:**
```javascript
// OpenAI generate:
{
  painPoint: "Masalah Suspensi",
  keywords: ["bunyi", "gludak", "gluduk", "suspensi", "shock"],
  serviceTypes: [
    { name: "Perbaikan Suspensi", relevance: 10 },
    { name: "Ganti Shock Absorber", relevance: 9 },
    { name: "Service Suspensi", relevance: 8 }
  ]
}
```

### ❌ TIDAK PERLU OpenAI (Runtime Query):
1. **User Search** - FTS sudah cukup untuk match pain point
2. **Get Service Types** - Query database langsung
3. **Get Bengkel** - Query database langsung

**Alasan:**
- Relasi sudah ada di database (pain point → service types → bengkel)
- Query database lebih cepat dan murah
- Tidak perlu API call ke OpenAI setiap query

## Skenario Khusus: Kapan Mungkin Perlu OpenAI di Runtime?

### Opsi 1: Novel Query (Query Baru yang Belum Ada di Database)
**Masalah:** User query tidak match dengan pain point yang ada

**Solusi A (Recommended):** Fallback ke regular search
```sql
-- Jika FTS tidak match, fallback ke search biasa
SELECT * FROM "wks_waitingList" 
WHERE "name" ILIKE '%bunyi%' 
  OR "description" ILIKE '%bunyi%'
```

**Solusi B (Advanced):** OpenAI untuk dynamic matching
```javascript
// Jika FTS tidak match, gunakan OpenAI untuk:
// 1. Extract keywords dari query
// 2. Suggest pain point yang mirip
// 3. Atau langsung map ke service types
```

**Trade-off:**
- ✅ Lebih akurat untuk query baru
- ❌ Lebih lambat (API call)
- ❌ Lebih mahal (OpenAI cost)
- ❌ Perlu error handling

### Opsi 2: Semantic Understanding (Pemahaman Konteks)
**Masalah:** User query ambigu atau kompleks

**Contoh:**
- "Mobil saya berisik" → bisa AC, suspensi, atau mesin
- "Perlu perawatan" → bisa service berkala atau perbaikan

**Solusi:** OpenAI untuk disambiguasi
```javascript
// OpenAI analyze query dan return:
{
  possiblePainPoints: [
    { id: "ac", confidence: 0.3 },
    { id: "suspensi", confidence: 0.5 },
    { id: "mesin", confidence: 0.2 }
  ]
}
```

**Trade-off:**
- ✅ Lebih pintar
- ❌ Lebih kompleks
- ❌ Perlu caching untuk performance

## Rekomendasi Implementasi

### MVP (Minimum Viable Product) - TANPA OpenAI di Runtime:
```
1. Seed data dengan OpenAI (Step 3) ✅
2. FTS untuk match pain point ✅
3. Database query untuk service types & bengkel ✅
4. Fallback ke regular search jika tidak match ✅
```

**Keuntungan:**
- ✅ Cepat (no API call)
- ✅ Murah (no OpenAI cost per query)
- ✅ Reliable (no external dependency)
- ✅ Scalable (database query bisa di-cache)

### Advanced (Future Enhancement) - DENGAN OpenAI di Runtime:
```
1. FTS untuk match pain point
2. Jika tidak match → OpenAI untuk:
   - Suggest similar pain points
   - Atau langsung map ke service types
3. Cache hasil OpenAI untuk query yang sama
```

**Kapan upgrade ke Advanced:**
- Jika banyak query yang tidak match dengan pain points
- Jika perlu semantic understanding yang lebih dalam
- Jika budget OpenAI sudah tersedia

## Kesimpulan

**Untuk MVP: TIDAK PERLU OpenAI di runtime**

Alasan:
1. ✅ FTS sudah cukup untuk match pain point
2. ✅ Relasi database sudah ada (pain point → service types → bengkel)
3. ✅ Query database lebih cepat dan murah
4. ✅ OpenAI hanya perlu untuk seed data (Step 3)

**OpenAI di runtime hanya perlu jika:**
- Banyak query novel yang tidak match
- Perlu semantic understanding yang lebih dalam
- Budget dan latency bukan masalah




