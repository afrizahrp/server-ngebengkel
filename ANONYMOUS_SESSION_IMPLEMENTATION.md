# Anonymous Session Implementation

## Overview

Implementasi Anonymous Session (Device-Based ID) untuk mendukung user experience tanpa login untuk read operations, sambil tetap mempertahankan kemampuan untuk tracking dan rate limiting.

## Fitur

1. **Anonymous Session (Device-Based ID)**
   - Generate `anonymous_id` (UUID v4) saat user pertama kali buka aplikasi/web
   - Simpan ke cookie (HTTP-only preferred) atau localStorage (fallback)
   - Digunakan untuk tracking interaksi, draft, rate limiting, dan anti-spam sebelum login

2. **Read Operations = Bebas Tanpa Login**
   - Semua halaman "lihat-lihat" tidak perlu login
   - Daftar bengkel, detail bengkel, jam buka, promo, foto, rating summary

3. **Write Operations = Wajib Login**
   - Aksi yang mengubah data wajib login
   - Jika masih anonim, simpan ke draft dengan `anonymous_id`
   - Saat submit, prompt login, lalu merge draft ke akun user

4. **Merge Anonymous → Authenticated User**
   - Setelah login, merge semua data terkait `anonymous_id` ke `user_id`
   - Tandai anonymous session sebagai merged

## Database Schema

### Model: `sys_AnonymousSession`

```prisma
model sys_AnonymousSession {
  id                String                 @id @default(uuid()) @db.Uuid
  anonymous_id      String                 @unique @db.Uuid // UUID v4 untuk client-side
  deviceName        String?                 @db.VarChar(255)
  deviceType        String?                 @db.VarChar(50) // mobile, desktop, tablet
  browser           String?                 @db.VarChar(100)
  os                String?                 @db.VarChar(100)
  ipAddress         String?                 @db.VarChar(45) // IPv6 support
  userAgent         String?                 @db.Text
  source            String?                 @db.VarChar(20) // web, app, mobile
  // Merge tracking
  mergedToUserId    Int?                   @db.Integer
  mergedAt          DateTime?
  isMerged          Boolean                @default(false)
  // Activity tracking
  lastActivityAt    DateTime               @default(now())
  createdAt         DateTime               @default(now())
  expiresAt         DateTime?             // Optional: default 90 hari
  iStatus           MasterRecordStatusEnum @default(Active)
  // Relations
  mergedToUser     sys_User?               @relation(fields: [mergedToUserId], references: [id], onDelete: SetNull)

  @@index([anonymous_id])
  @@index([mergedToUserId])
  @@index([isMerged])
  @@index([iStatus])
  @@index([createdAt])
}
```

## Backend API Endpoints

### 1. Create/Get Anonymous Session
```
POST /api/anonymous-sessions
Body: {
  anonymousId: string (UUID v4),
  source?: 'web' | 'app' | 'mobile'
}
Response: {
  message: string,
  data: {
    anonymousId: string,
    createdAt: Date,
    expiresAt: Date
  }
}
```

### 2. Validate Anonymous Session
```
GET /api/anonymous-sessions/validate/:anonymousId
Response: {
  valid: boolean,
  data?: {
    anonymousId: string,
    createdAt: Date,
    expiresAt: Date,
    isMerged: boolean
  },
  message?: string
}
```

### 3. Merge Anonymous Session to User
```
POST /api/anonymous-sessions/merge
Headers: Authorization: Bearer <user_token>
Body: {
  anonymousId: string
}
Response: {
  message: string,
  data: {
    anonymousId: string,
    mergedAt: Date
  }
}
```

### 4. Get Merged Sessions
```
GET /api/anonymous-sessions/merged
Headers: Authorization: Bearer <user_token>
Response: {
  message: string,
  data: Array<sys_AnonymousSession>,
  total: number
}
```

## Frontend Implementation

### Utility Functions

**File**: `lib/utils/anonymous-id.ts`

- `getOrCreateAnonymousId()`: Get atau generate anonymous_id
- `initializeAnonymousSession(source)`: Initialize session dengan backend
- `getAnonymousId()`: Get current anonymous_id
- `clearAnonymousId()`: Clear anonymous_id (untuk testing)

### Hook

**File**: `hooks/useAnonymousId.ts`

```typescript
const { anonymousId, isInitialized, getCurrentId } = useAnonymousId();
```

### API Integration

**File**: `config/api.ts`

Axios interceptor otomatis menambahkan header `X-Anonymous-Id` ke setiap request.

### Component

**File**: `components/anonymous-session/AnonymousSessionInitializer.tsx`

Auto-initialize anonymous session saat app load.

## Usage Flow

### 1. User Buka Website/App
```
1. Frontend generate anonymous_id (UUID v4)
2. Simpan ke localStorage
3. Call POST /api/anonymous-sessions untuk register ke backend
4. Backend set cookie (jika bisa)
```

### 2. Read Operations (Bebas)
```
1. Frontend include anonymous_id di header X-Anonymous-Id
2. Backend validate anonymous_id (optional)
3. Return data tanpa perlu authentication
```

### 3. Write Operations (Wajib Login)
```
1. User klik aksi write (favorit, review, upload foto)
2. Jika masih anonim:
   - Simpan ke draft table dengan anonymous_id
3. Saat klik submit:
   - Prompt login
   - Setelah login, call POST /api/anonymous-sessions/merge
   - Merge draft ke user_id
```

### 4. Merge Anonymous → User
```
1. User login sukses
2. Frontend call POST /api/anonymous-sessions/merge dengan anonymous_id
3. Backend:
   - Update anonymous session: isMerged = true, mergedToUserId = user_id
   - Migrate semua draft/data terkait anonymous_id ke user_id
   - Return success
```

## Migration Steps

1. **Run Prisma Migration**
```bash
cd server-ngebengkel
npx prisma migrate dev --name add_anonymous_session
```

2. **Generate Prisma Client**
```bash
npx prisma generate
```

3. **Test Backend**
```bash
# Test create anonymous session
curl -X POST http://localhost:4000/api/anonymous-sessions \
  -H "Content-Type: application/json" \
  -d '{"anonymousId": "550e8400-e29b-41d4-a716-446655440000", "source": "web"}'
```

4. **Test Frontend**
- Buka browser
- Check localStorage untuk `anonymous_id`
- Check Network tab untuk header `X-Anonymous-Id` di setiap request

## Rate Limiting & Anti-spam

Anonymous session digunakan untuk:
- Rate limiting berdasarkan `anonymous_id` + IP + device fingerprint
- Limit: review 2-3/hari, foto 3-5/jam, claim 1 per usaha
- Tracking interaksi untuk anti-spam scoring

## Cleanup

Cron job untuk cleanup:
- Expired anonymous sessions (setelah expiresAt)
- Old merged sessions (lebih dari 1 tahun)

## Notes

- Anonymous session tidak menggantikan user authentication untuk write operations
- Service token (`LISTING_SERVICE_TOKEN`) masih bisa digunakan untuk internal operations
- Anonymous_id digunakan untuk read operations yang sebelumnya pakai service token

