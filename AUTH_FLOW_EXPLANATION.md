# Penjelasan Auth Flow untuk Endpoint Promo

## Situasi Saat Ini

### 1. Endpoint Backend
```typescript
@Get(':id/promo')
@Roles('ADMIN','READ')  // ⚠️ Require JWT Token dengan role ADMIN atau READ
async getPromos(@Param('id') id: string) {
  // Return full promo details
}
```

### 2. API Route Next.js
```typescript
// app/api/waiting-list/[id]/promo/route.ts
// Masih menggunakan service token (hardcoded)
const token = await getServiceToken(); // ⚠️ Butuh SERVICE_USERNAME/PASSWORD
```

### 3. Service Token di .env (Sudah di-comment)
```env
# SERVICE_USERNAME=listing-user
# SERVICE_EMAIL=info@ngebengkel.com
# SERVICE_PASSWORD=Lisin@
# LISTING_SERVICE_TOKEN=eyJhbGciOiJI
```

## Masalah

**Jika service token di-comment:**
- ❌ API route `/api/waiting-list/[id]/promo` akan gagal (500 error)
- ❌ Tidak ada token untuk mengakses endpoint backend
- ❌ Frontend tidak bisa fetch promo data

## Proses Auth yang Digunakan

### Untuk Endpoint yang Require Auth:

1. **Backend Guard**: `BetterJwtAuthGuard`
   - Check `@Public()` decorator
   - Jika tidak `@Public()`, require JWT token di header `Authorization: Bearer <token>`
   - Validate token dan check role (`ADMIN` atau `READ`)

2. **Token Source**:
   - **Option A**: Service Token (hardcoded di .env) - untuk server-to-server
   - **Option B**: User JWT Token (dari login) - untuk user yang login
   - **Option C**: Anonymous ID (tidak bisa untuk endpoint yang require auth)

## Solusi

### **Option 1: Buat Endpoint Promo Public (Recommended untuk Listing)**

Jika promo perlu ditampilkan di public listing:

```typescript
// Backend: Buat endpoint public dengan data terbatas
@Public()
@Get(':id/promo')
async getPromosPublic(@Param('id') id: string) {
  // Return limited data (tanpa valuePercent/valueNominal)
  const promos = await this.waitingListService.findPromosByWaitingList(id);
  return promos.map(promo => ({
    id: promo.id,
    title: promo.title,
    description: promo.description,
    promoType: promo.promoType,
    checklist: promo.checklist,
    // valuePercent & valueNominal di-hide
  }));
}

// Tetap ada endpoint protected untuk internal use
@Roles('ADMIN','READ')
@Get(':id/promo/full')
async getPromosFull(@Param('id') id: string) {
  // Return full data dengan valuePercent/valueNominal
}
```

```typescript
// Frontend: Update API route untuk pakai getApiHeaders
import { getApiHeaders } from '@/lib/utils/get-api-headers';

export async function GET(request: Request, context: { params: { id: string } }) {
  const headers = await getApiHeaders(request); // Pakai anonymous_id
  // ...
}
```

### **Option 2: Tetap Require Auth (Jika untuk Internal Use)**

Jika promo hanya untuk internal/admin:

```typescript
// Frontend: Update API route untuk tetap pakai service token
// Tapi uncomment service token di .env
SERVICE_USERNAME=listing-user
SERVICE_EMAIL=info@ngebengkel.com
SERVICE_PASSWORD=Lisin@
```

### **Option 3: Hybrid - Public untuk Preview, Protected untuk Detail**

```typescript
// Public endpoint - preview only
@Public()
@Get(':id/promo')
async getPromosPreview(@Param('id') id: string) {
  // Return: title, description, promoType (tanpa value)
}

// Protected endpoint - full details
@Roles('ADMIN','READ')
@Get(':id/promo/details')
async getPromosDetails(@Param('id') id: string) {
  // Return: full data dengan valuePercent/valueNominal
}
```

## Rekomendasi

**Untuk Listing Website (Public):**
- ✅ **Option 1**: Buat endpoint promo public dengan data terbatas
- ✅ Update API route untuk pakai `getApiHeaders()` (anonymous_id)
- ✅ Hide valuePercent/valueNominal dari public

**Alasan:**
- Listing website perlu tampilkan promo ke public
- Detail value tidak perlu di-expose (business-sensitive)
- Tetap ada endpoint protected untuk internal use

## Implementasi

Mau saya implementasikan **Option 1** (Public endpoint dengan data terbatas)?

