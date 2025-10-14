# Better Auth Implementation

Dokumentasi implementasi Better Auth untuk menggantikan Passport.js

## Fitur

- ✅ Email & Password Authentication
- ✅ JWT Access & Refresh Tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ Google OAuth (struktur dasar)
- ✅ Password Reset
- ✅ User Registration dengan auto-assign company & role

## Struktur

```
src/auth/better-auth/
├── auth.config.ts              # Konfigurasi Better Auth
├── better-auth.service.ts      # Service untuk auth logic
├── better-auth.controller.ts   # Controller untuk auth endpoints
├── better-auth.module.ts       # Module Better Auth
├── guards/
│   ├── better-jwt-auth.guard.ts    # JWT Guard
│   ├── better-roles.guard.ts       # Roles Guard
│   └── better-refresh.guard.ts     # Refresh Token Guard
└── README.md                   # Dokumentasi ini
```

## Environment Variables

Pastikan file `.env` memiliki variabel berikut:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-better-auth-secret-key-min-32-characters

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_TTL=3600        # 1 hour in seconds
JWT_AUDIENCE=localhost:3001
JWT_ISSUER=localhost:3001

# Refresh Token Configuration
REFRESH_SECRET=your-refresh-secret-key-here
REFRESH_TOKEN_TTL=604800         # 7 days in seconds

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## API Endpoints

### Authentication

#### 1. Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "image": "https://example.com/avatar.jpg" // optional
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/avatar.jpg"
}
```

#### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/avatar.jpg",
    "company": {
      "company_id": "C001",
      "branch_id": "MAIN",
      "role_id": "MANAGER",
      "role_name": "Manager"
    },
    "companies": [...]
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### 3. Refresh Token

```http
POST /auth/refresh
Authorization: Bearer <refresh-token>
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Logout

```http
POST /auth/logout
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

#### 5. Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newSecurePassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successful"
}
```

#### 6. Get Current User

```http
GET /auth/me
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/avatar.jpg",
  "companies": [...]
}
```

### Protected Routes

#### Test Protected Route

```http
GET /auth/protected
Authorization: Bearer <access-token>
```

Endpoint ini dilindungi dengan `@Roles('ADMIN', 'MANAGER', 'USER')` decorator.

## Decorators

### @Public()

Mengizinkan endpoint diakses tanpa autentikasi:

```typescript
@Public()
@Post('login')
async login() {
  // ...
}
```

### @Roles(...roles)

Membatasi akses berdasarkan role:

```typescript
@Roles('ADMIN', 'MANAGER')
@Get('admin-only')
async adminOnly() {
  // ...
}
```

## Guards

### BetterJwtAuthGuard

Guard global yang melindungi semua routes kecuali yang ditandai `@Public()`.

### BetterRolesGuard

Guard yang mengecek apakah user memiliki role yang sesuai.

### BetterRefreshGuard

Guard khusus untuk endpoint refresh token.

## Migration dari Passport

File-file Passport lama sudah di-backup dengan extension `.old`:

- `auth.module.ts.old`
- `auth.controller.ts.old`
- `auth.service.ts.old`

Strategi dan guards lama masih ada di folder `strategies/` dan `guards/` jika diperlukan sebagai referensi.

## Keamanan

- Password di-hash menggunakan **argon2** (lebih aman dari bcrypt)
- JWT access token expire dalam **1 jam**
- Refresh token expire dalam **7 hari**
- Refresh token di-hash sebelum disimpan di database
- Semua endpoint protected by default kecuali yang ditandai `@Public()`

## Todo / Improvement

- [ ] Implementasi lengkap Google OAuth dengan token exchange
- [ ] Email verification untuk registrasi
- [ ] Password reset via email
- [ ] Rate limiting untuk login attempts
- [ ] Two-factor authentication (2FA)
- [ ] Session management & device tracking
- [ ] Audit log untuk auth events

## Troubleshooting

### Error: "No token provided"

Pastikan header Authorization sudah di-set:

```
Authorization: Bearer <your-access-token>
```

### Error: "Invalid token"

Token mungkin sudah expired atau invalid. Gunakan refresh token untuk mendapatkan token baru.

### Error: "Invalid refresh token"

Refresh token expired atau invalid. User harus login ulang.

## Testing

Untuk testing endpoints, gunakan tools seperti:

- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

Contoh cURL:

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Access protected route
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer <your-access-token>"
```
