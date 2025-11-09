# Input Validation & Sanitization Implementation

## ✅ Implementasi Selesai

Input validation dan sanitization telah diimplementasikan untuk semua PUBLIC() endpoints menggunakan `class-validator` dan `class-sanitizer`.

## 📦 Packages yang Digunakan

- `class-validator` - Sudah terinstall (untuk validation)
- `class-sanitizer` - Baru diinstall (untuk sanitization)

## 🔧 Konfigurasi

### Global Validation Pipe (main.ts)

ValidationPipe dikonfigurasi dengan:
- `whitelist: true` - Strip properties yang tidak punya decorators
- `forbidNonWhitelisted: true` - Throw error jika ada non-whitelisted properties
- `transform: true` - Automatically transform payloads ke DTO instances
- `validateCustomDecorators: true` - Enable validation untuk custom decorators
- `stopAtFirstError: false` - Collect semua validation errors

## 📍 DTOs yang Sudah Diperkuat

### Authentication DTOs (`auth/dto`)

#### 1. RegisterDto (`register.dto.ts`)
**Validasi:**
- `name`: String, required, min 2 chars, max 100 chars, trimmed & sanitized
- `email`: Valid email, required, max 255 chars, lowercase & sanitized
- `password`: String, required, min 8 chars, max 128 chars, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)
- `image`: Optional string, max 500 chars, trimmed & sanitized
- `company_id`: Optional UUID v4
- `branch_id`: Optional UUID v4

#### 2. LoginDto (`login.dto.ts`)
**Validasi:**
- `email`: Valid email, required, max 255 chars, lowercase & sanitized
- `password`: String, required, max 128 chars
- `deviceName`: Optional string, max 100 chars, trimmed & sanitized

#### 3. ForgotPasswordDto (`forgot-password.dto.ts`)
**Validasi:**
- `email`: Valid email, required, max 255 chars, lowercase & sanitized

#### 4. ResetPasswordDto (`reset-password.dto.ts`)
**Validasi:**
- `token`: String, required, length 32-255 chars
- `password`: String, required, min 8 chars, max 128 chars, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

#### 5. ResendVerificationEmailDto (`resend-verification-email.dto.ts`)
**Validasi:**
- `email`: Valid email, required, max 255 chars, lowercase & sanitized

#### 6. Verify2FaDto (`verify-2fa.dto.ts`)
**Validasi:**
- `userId`: Integer, required, min 1
- `otpCode`: String, required, exactly 6 characters, trimmed
- `deviceName`: Optional string, trimmed & sanitized

### Waiting List DTOs (`wks/waiting-list/dto`)

#### 1. CreateWaitingListDto
**Sudah memiliki validasi yang kuat:**
- Semua fields menggunakan `@Transform()` untuk trim
- Email menggunakan lowercase transform
- Array fields menggunakan `@ArrayUnique()` dan `@ArrayMaxSize()`

#### 2. CheckWaitingListAvailabilityDto
**Diperkuat dengan:**
- `name`: Min length 2 chars, sanitized
- `email`: Valid email dengan sanitization

## 🔒 Sanitization Features

### Automatic Sanitization
- **HTML Tags Removal**: Semua HTML tags dihapus dari string inputs
- **Script Removal**: Script tags dan JavaScript code dihapus
- **Trim**: Whitespace dihapus dari awal dan akhir string
- **Email Normalization**: Email diubah ke lowercase dan di-trim

### Sanitization Decorators
- `@Sanitize()` - Remove HTML tags dan scripts
- `@Trim()` - Remove leading/trailing whitespace

### Transform Decorators
- `@Transform()` - Custom transformation (trim, lowercase, uppercase, dll)

## 📝 Validation Rules Summary

### String Validation
- `@IsString()` - Must be a string
- `@IsNotEmpty()` - Cannot be empty
- `@MinLength(n)` - Minimum length
- `@MaxLength(n)` - Maximum length
- `@Length(min, max)` - Exact length range
- `@Matches(regex)` - Must match regex pattern

### Email Validation
- `@IsEmail()` - Must be valid email format
- Automatic lowercase transformation
- Automatic trim

### Password Validation
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Maximum 128 characters

### UUID Validation
- `@IsUUID('4')` - Must be valid UUID v4 format

### Number Validation
- `@IsInt()` - Must be integer
- `@Min(n)` - Minimum value
- `@Max(n)` - Maximum value

### Optional Fields
- `@IsOptional()` - Field is optional
- Default values yang aman digunakan

## 🛡️ Security Benefits

1. **SQL Injection Prevention**: 
   - Semua queries menggunakan Prisma (parameterized queries)
   - Input validation mencegah malicious input
   - UUID validation untuk ID parameters

2. **XSS Prevention**:
   - HTML tags dan scripts dihapus dari semua string inputs
   - Sanitization otomatis untuk semua user inputs

3. **Data Integrity**:
   - Email normalization (lowercase, trim)
   - Phone number standardization (jika diperlukan)
   - String trimming untuk menghindari whitespace issues

4. **Strong Password Policy**:
   - Enforce strong password requirements
   - Prevent weak passwords

5. **Input Length Limits**:
   - Prevent buffer overflow attacks
   - Limit input size untuk performance

## 🧪 Testing

### Test Validation Errors
```bash
# Test register dengan password lemah
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }'

# Expected: 400 Bad Request dengan validation errors
```

### Test Sanitization
```bash
# Test dengan HTML tags
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>Test User",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Expected: HTML tags dihapus, hanya "Test User" yang tersimpan
```

## 📚 Best Practices

1. **Selalu gunakan DTOs**: Jangan gunakan inline types untuk request bodies
2. **Gunakan decorators**: Tambahkan validation decorators untuk semua fields
3. **Sanitize inputs**: Gunakan `@Sanitize()` dan `@Trim()` untuk string inputs
4. **Validate IDs**: Gunakan `@IsUUID()` untuk UUID parameters
5. **Strong passwords**: Enforce strong password policy
6. **Email normalization**: Always lowercase dan trim email inputs
7. **Length limits**: Set max length untuk semua string inputs

## 🚀 Next Steps (Optional)

1. **Custom Validators**: Buat custom validators untuk business logic
2. **Phone Number Validation**: Tambahkan phone number format validation
3. **File Upload Validation**: Jika ada file upload, tambahkan validation
4. **Async Validation**: Implement async validation untuk check uniqueness (email, dll)

## 📚 Referensi

- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-sanitizer Documentation](https://github.com/typestack/class-sanitizer)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)

