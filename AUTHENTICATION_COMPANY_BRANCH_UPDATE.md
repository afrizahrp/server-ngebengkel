# Update Autentikasi & Otorisasi: Company ID & Branch ID

## Ringkasan Perubahan

Telah dilakukan update pada sistem autentikasi dan otorisasi untuk memastikan `company_id` dan `branch_id` selalu terisi dan tersedia pada JWT token serta request context.

## Perubahan yang Dilakukan

### 1. **JWT Payload Enhancement**

File: `src/auth/types/auth-jwtPayload.ts`

JWT payload sekarang mencakup `company_id` dan `branch_id`:

```typescript
export type AuthJwtPayload = {
  sub: number; // User ID
  role_id: string; // Role ID
  company_id: string; // Company ID (NEW)
  branch_id: string; // Branch ID (NEW)
};
```

### 2. **Token Generation Update**

File: `src/auth/better-auth/better-auth.service.ts`

Method `generateTokens()` telah diupdate untuk menerima dan menyertakan `company_id` dan `branch_id`:

```typescript
private async generateTokens(
  userId: number,
  roleId: string,
  companyId: string,    // NEW
  branchId: string,     // NEW
) {
  const payload: UserPayload = {
    sub: userId,
    role_id: roleId,
    company_id: companyId,
    branch_id: branchId,
  };
  // ... token signing logic
}
```

Semua pemanggilan `generateTokens()` telah diupdate di:

- ✅ Login normal
- ✅ Login dengan 2FA (OTP)
- ✅ Google OAuth login
- ✅ Refresh token

### 3. **Guards Update**

#### BetterJwtAuthGuard

File: `src/auth/better-auth/guards/better-jwt-auth.guard.ts`

Guard ini sekarang mengekstrak dan menyertakan `company_id` dan `branch_id` dari JWT token ke `request.user`:

```typescript
request.user = {
  id: payload.sub,
  role_id: payload.role_id,
  company_id: payload.company_id, // NEW
  branch_id: payload.branch_id, // NEW
};
```

#### BetterRefreshGuard

File: `src/auth/better-auth/guards/better-refresh.guard.ts`

Guard untuk refresh token juga diupdate untuk menyertakan field yang sama.

### 4. **Type Definitions**

File: `src/auth/types/auth-request.interface.ts` (BARU)

Interface baru untuk type-safety di seluruh aplikasi:

```typescript
export interface AuthenticatedUser {
  id: number;
  role_id: string;
  company_id: string;
  branch_id: string;
}

export interface AuthRequest {
  user: AuthenticatedUser;
  refreshToken?: string;
  sessionId?: string;
}
```

### 5. **Custom Decorator**

File: `src/auth/decorators/current-user.decorator.ts` (BARU)

Decorator baru untuk mengakses user yang sedang login dengan mudah:

```typescript
@CurrentUser() user: AuthenticatedUser
// atau
@CurrentUser('company_id') companyId: string
```

## Cara Menggunakan

### 1. Mendapatkan User dari Request (Cara Lama)

```typescript
@Get('example')
async example(@Request() req: AuthRequest) {
  const userId = req.user.id;
  const companyId = req.user.company_id;
  const branchId = req.user.branch_id;
  // ...
}
```

### 2. Menggunakan Custom Decorator (Cara Baru - RECOMMENDED)

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/auth-request.interface';

@Controller('products')
export class ProductsController {
  // Mendapatkan seluruh user object
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    console.log(user.id); // User ID
    console.log(user.company_id); // Company ID
    console.log(user.branch_id); // Branch ID
    console.log(user.role_id); // Role ID
  }

  // Mendapatkan hanya company_id
  @Get('by-company')
  async findByCompany(@CurrentUser('company_id') companyId: string) {
    return this.productsService.findByCompany(companyId);
  }

  // Mendapatkan hanya branch_id
  @Get('by-branch')
  async findByBranch(@CurrentUser('branch_id') branchId: string) {
    return this.productsService.findByBranch(branchId);
  }
}
```

### 3. Menggunakan di Service

```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findByCompany(companyId: string) {
    return this.prisma.products.findMany({
      where: { company_id: companyId },
    });
  }

  async createProduct(data: CreateProductDto, user: AuthenticatedUser) {
    return this.prisma.products.create({
      data: {
        ...data,
        company_id: user.company_id,
        branch_id: user.branch_id,
        created_by: user.id,
      },
    });
  }
}
```

## Validasi Data

`company_id` dan `branch_id` diambil dari tabel:

- **sys_Company**: Tabel company yang berisi informasi perusahaan
- **sys_Branch**: Tabel branch yang berisi informasi cabang perusahaan
- **sys_UserCompanyRole**: Tabel relasi antara user, company, branch, dan role

Data ini dijamin terisi karena:

1. Saat register, user otomatis di-assign ke company dan branch default
2. Saat login, system mengambil data dari `sys_UserCompanyRole`
3. JWT token selalu berisi `company_id` dan `branch_id`
4. Guards memvalidasi dan mengekstrak data dari token

## Testing

Untuk memverifikasi bahwa `company_id` dan `branch_id` sudah tersedia:

### 1. Login dan Periksa Response

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

Response akan berisi:

```json
{
  "user": {
    "id": 1,
    "company": {
      "company_id": "COMP1",
      "branch_id": "BR001",
      "role_id": "ADMIN"
    }
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. Decode JWT Token

Gunakan [jwt.io](https://jwt.io) untuk decode token, payload akan berisi:

```json
{
  "sub": 1,
  "role_id": "ADMIN",
  "company_id": "COMP1",
  "branch_id": "BR001",
  "iat": 1697461234,
  "exp": 1697547634
}
```

### 3. Test di Protected Endpoint

```typescript
@Get('test-auth')
async testAuth(@CurrentUser() user: AuthenticatedUser) {
  return {
    message: 'Authentication successful',
    user: {
      id: user.id,
      company_id: user.company_id,
      branch_id: user.branch_id,
      role_id: user.role_id,
    }
  };
}
```

## Catatan Penting

1. ✅ Semua token (access & refresh) sekarang berisi `company_id` dan `branch_id`
2. ✅ Data dijamin tersedia di setiap protected endpoint
3. ✅ Tidak perlu query database lagi untuk mendapatkan company/branch user
4. ✅ Type-safe dengan TypeScript
5. ✅ Backward compatible dengan code yang menggunakan `req.user.id` dan `req.user.role_id`

## Migration untuk Existing Code

Jika ada code yang perlu mengakses `company_id` atau `branch_id`, sekarang bisa langsung mengakses dari `request.user`:

```typescript
// ❌ BEFORE (perlu query database)
const user = await this.prisma.sys_User.findUnique({
  where: { id: req.user.id },
  include: {
    userCompanyRoles: true,
  },
});
const companyId = user.userCompanyRoles[0].company_id;

// ✅ AFTER (langsung dari JWT)
const companyId = req.user.company_id;
// atau
const companyId = user.company_id; // dengan @CurrentUser()
```

## Files Modified

1. `src/auth/types/auth-jwtPayload.ts` - Updated JWT payload type
2. `src/auth/better-auth/better-auth.service.ts` - Updated token generation
3. `src/auth/better-auth/guards/better-jwt-auth.guard.ts` - Updated guard
4. `src/auth/better-auth/guards/better-refresh.guard.ts` - Updated guard
5. `src/auth/better-auth/better-auth.controller.ts` - Updated interface import
6. `src/auth/session/session.controller.ts` - Updated interface import

## Files Created

1. `src/auth/types/auth-request.interface.ts` - New shared interface
2. `src/auth/decorators/current-user.decorator.ts` - New custom decorator
3. `AUTHENTICATION_COMPANY_BRANCH_UPDATE.md` - Documentation

---

**Dibuat pada:** 16 Oktober 2025  
**Status:** ✅ Completed

