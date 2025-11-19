# Penjelasan Endpoint sys_province, sys_city, sys_district, sys_subdistrict

## Struktur Endpoint

### 1. **POST `/api/sys_province`** (Tanpa `/batch`)
**Fungsi:** CREATE - Membuat province baru
**Auth:** ✅ Require Auth (ADMIN/READ role)
**Use Case:** Admin/internal untuk manage master data

```typescript
@Post()  // POST /api/sys_province
async create(@Body() dto: Sys_CreateProvinceDto) {
  // Create new province
}
```

**Tidak digunakan di listing-ngebengkel** karena:
- Listing website hanya read-only
- Create/Update/Delete untuk admin panel/internal system

---

### 2. **POST `/api/sys_province/batch`** (Dengan `/batch`)
**Fungsi:** BATCH READ - Fetch multiple provinces sekaligus
**Auth:** ✅ Public (support anonymous_id)
**Use Case:** Listing website untuk optimasi performance

```typescript
@Post('batch')  // POST /api/sys_province/batch
@Public()
async findManyByIds(@Body() body: { ids: string[] }) {
  // Return multiple provinces berdasarkan IDs
}
```

**Digunakan di listing-ngebengkel** untuk:
- Fetch multiple cities/provinces sekaligus
- Optimasi: 1 request instead of N requests

---

### 3. **PUT `/api/sys_province/:id`**
**Fungsi:** UPDATE - Update province
**Auth:** ✅ Require Auth (ADMIN/READ role)
**Use Case:** Admin/internal untuk manage master data

**Tidak digunakan di listing-ngebengkel**

---

### 4. **DELETE `/api/sys_province/:id`**
**Fungsi:** DELETE - Hapus province
**Auth:** ✅ Require Auth (ADMIN/READ role)
**Use Case:** Admin/internal untuk manage master data

**Tidak digunakan di listing-ngebengkel**

---

## Summary

### Endpoint yang Digunakan di Listing Website:
- ✅ `GET /api/sys_province` - List semua province
- ✅ `GET /api/sys_province/:id` - Detail province
- ✅ `POST /api/sys_province/batch` - Batch fetch provinces
- ✅ `GET /api/sys_city` - List semua city
- ✅ `GET /api/sys_city/:id` - Detail city
- ✅ `POST /api/sys_city/batch` - Batch fetch cities
- ✅ (sama untuk district & subdistrict)

**Semua endpoint di atas:** Public, support anonymous_id

---

### Endpoint yang TIDAK Digunakan di Listing Website:
- ❌ `POST /api/sys_province` (create) - Untuk admin
- ❌ `PUT /api/sys_province/:id` (update) - Untuk admin
- ❌ `DELETE /api/sys_province/:id` (delete) - Untuk admin

**Semua endpoint di atas:** Require Auth, untuk admin/internal use

---

## Kenapa POST untuk Batch Read?

**Alasan Teknis:**
1. **GET dengan body tidak standard** - Beberapa proxy/cache tidak support GET dengan body
2. **URL length limit** - Array of IDs bisa panjang, tidak cocok untuk query string
3. **Best Practice** - POST untuk complex queries dengan body

**Alternatif (tidak recommended):**
```typescript
// Bisa pakai GET dengan query string, tapi:
GET /api/sys_city/batch?ids=ID1&ids=ID2&ids=ID3...
// ❌ URL bisa terlalu panjang
// ❌ Tidak semua server support multiple query params dengan nama sama
```

**Current (recommended):**
```typescript
POST /api/sys_city/batch
Body: { ids: ["ID1", "ID2", "ID3", ...] }
// ✅ No URL length limit
// ✅ Standard HTTP POST dengan body
// ✅ Clear dan explicit
```

---

## Kesimpulan

**POST `/batch`** = Read operation (optimasi untuk fetch multiple records)
- Public, support anonymous_id
- Digunakan di listing website

**POST `/`** (tanpa batch) = Create operation
- Require auth
- Untuk admin/internal
- Tidak digunakan di listing website

**PUT & DELETE** = Update & Delete operations
- Require auth
- Untuk admin/internal
- Tidak digunakan di listing website

