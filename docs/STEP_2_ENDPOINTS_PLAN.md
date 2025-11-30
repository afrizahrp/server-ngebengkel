# STEP 2: Endpoints - Implementation Plan

## Overview
Membuat API endpoints untuk pain points sesuai dengan keputusan yang sudah disetujui.

## Struktur yang Akan Dibuat

```
src/wks/pain-point/
├── pain-point.controller.ts      # Controller dengan semua endpoints
├── pain-point.service.ts          # Business logic
├── pain-point.module.ts          # NestJS module
├── dto/
│   ├── query-pain-point.dto.ts   # Query params untuk GET /api/pain-points
│   ├── search-pain-point.dto.ts  # Query untuk GET /api/pain-points/search
│   ├── match-pain-point.dto.ts   # Body untuk POST /api/pain-points/match
│   └── response-pain-point.dto.ts # Response DTO
└── helper/
    └── pain-point-where-condition.ts # Helper untuk Prisma where clause
```

---

## Endpoints yang Akan Dibuat

### 1. GET /api/pain-points (Public)
**Query Params:**
- `category` (optional): URGENT | GENERAL | MAINTENANCE | BODYWORK | ELECTRICAL
- `isPopular` (optional): boolean
- `isActive` (optional): boolean (default: true)
- `search` (optional): string (untuk search di title/keywords)
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 12)
- `orderBy` (optional): 'popularity' | 'name' (default: 'popularity')
- `orderDir` (optional): 'asc' | 'desc' (default: 'desc')

**Response:**
```typescript
{
  data: PainPointResponseDto[],
  totalRecords: number,
  total: number,
  page: number,
  limit: number
}
```

**Features:**
- Pagination
- Filtering (category, isPopular, isActive)
- Sorting (popularity, name)
- Search (jika ada search param, gunakan FTS)
- **TIDAK include related data** (list harus ringan)

---

### 2. GET /api/pain-points/:id (Public)
**Response:**
```typescript
{
  id: string,
  slug: string,
  title: string,
  description: string,
  category: string,
  keywords: string[],
  iconName: string,
  imageUrl: string,
  popularityScore: number,
  viewCount: number,
  searchCount: number,
  isUrgent: boolean,
  priority: number,
  isActive: boolean,
  isPopular: boolean,
  // Related data
  serviceTypes: Array<{
    id: string,
    name: string,
    relevance: number
  }>,
  branchCount: number, // Berapa bengkel yang bisa handle
  relatedPainPoints: Array<{
    id: string,
    title: string,
    slug: string
  }> // Pain points dengan category yang sama
}
```

**Features:**
- Include semua related data
- Include count statistics (berapa bengkel handle ini)
- Include related pain points (rekomendasi)

---

### 3. GET /api/pain-points/search (Public)
**Query Params:**
- `q` (required): string (search query)

**Response:**
```typescript
{
  data: Array<{
    painPoint: PainPointResponseDto,
    confidence: number, // 0-1
    matchedKeywords: string[]
  }>,
  total: number
}
```

**Features:**
- Multiple matches dengan confidence score
- Limit results (top 10)
- **TIDAK include serviceTypes & branches** (berat)

**Logic:**
- Gunakan FTS untuk match
- Calculate confidence berdasarkan:
  - Exact keyword match
  - Partial match
  - Phrase match
  - Ranking dari ts_rank

---

### 4. POST /api/pain-points/match (Internal - API Key Required)
**Headers:**
- `X-API-Key`: string (required)

**Body:**
```typescript
{
  query: string
}
```

**Response:**
```typescript
{
  data: Array<{
    painPoint: PainPointResponseDto,
    confidence: number,
    matchedKeywords: string[],
    serviceTypes: Array<{
      id: string,
      name: string,
      relevance: number
    }>
  }>,
  total: number
}
```

**Features:**
- Multiple matches ranked
- Include service types
- **TIDAK include branches** (nanti)
- Caching dengan TTL 1 hour

---

## Implementation Details

### Caching Strategy
- **Cache Key:** `pain-point:search:{query_hash}`
- **TTL:** 1 hour (3600 seconds)
- **Cache Invalidation:** Saat pain point di-update
- **Storage:** Redis (jika ada) atau in-memory cache

### Full-Text Search Implementation
- Gunakan `search_tsvector` column untuk FTS
- Query: `"search_tsvector" @@ to_tsquery('indonesian', :query)`
- Ranking: `ts_rank("search_tsvector", to_tsquery(...))`

### Error Handling
- Standard error format sesuai project
- Logging untuk monitoring
- Validation untuk semua input

---

## Dependencies

### Prisma Queries
```typescript
// Get pain points dengan filters
prisma.wks_PainPoint.findMany({
  where: { /* conditions */ },
  include: { /* relations */ },
  orderBy: { /* sorting */ },
  skip: (page - 1) * limit,
  take: limit
})

// FTS Search
prisma.$queryRaw`
  SELECT "id", "title", "slug", 
         ts_rank("search_tsvector", to_tsquery('indonesian', ${query})) as "rank"
  FROM "wks_PainPoint"
  WHERE "search_tsvector" @@ to_tsquery('indonesian', ${query})
    AND "isActive" = true
    AND "isDeleted" = false
  ORDER BY "rank" DESC
  LIMIT 10
`
```

---

## Next Steps After Step 2

1. ✅ Step 2: Endpoints (Current)
2. ⏳ Step 3: Internal Seed Endpoint dengan OpenAI
3. ⏳ Step 4: React Query Hooks
4. ⏳ Step 5: UI/UX Implementation

---

## Testing Checklist

- [ ] GET /api/pain-points dengan berbagai filter
- [ ] GET /api/pain-points/:id dengan related data
- [ ] GET /api/pain-points/search dengan berbagai query
- [ ] POST /api/pain-points/match dengan API key
- [ ] Caching bekerja dengan baik
- [ ] FTS search akurat
- [ ] Error handling proper
- [ ] Pagination bekerja
- [ ] Sorting bekerja




