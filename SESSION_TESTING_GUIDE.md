# 🧪 Panduan Testing Session Management

Panduan lengkap untuk menguji semua fitur session management system.

## 🛠️ Tools yang Dibutuhkan

Pilih salah satu:

1. **Postman** - GUI-based API testing
2. **Thunder Client** (VS Code Extension) - Recommended untuk VS Code users
3. **cURL** - Command line
4. **REST Client** (VS Code Extension) - File-based testing

## 📋 Test Scenarios

### Scenario 1: Basic Login & Session Creation

#### Test 1.1: Login dari Device Pertama

**Request:**

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "deviceName": "MacBook Pro - Chrome"
}
```

**Expected Response:**

```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "company": { ... }
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "clx1234567890abcdef",
  "message": "Login successful"
}
```

**✅ Verification:**

- Response status: 200
- Response memiliki `sessionId`
- `accessToken` dan `refreshToken` ada
- Simpan `accessToken` dan `sessionId` untuk test berikutnya

**Database Check:**

```sql
SELECT * FROM "sys_Session" WHERE user_id = 1;
```

Harus ada 1 session baru.

---

#### Test 1.2: Login dari Device Kedua (Simulasi Multi-Device)

**Request:**

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "deviceName": "iPhone 14 Pro - Safari"
}
```

**✅ Verification:**

- Response status: 200
- Response memiliki `sessionId` yang BERBEDA dari test 1.1
- Simpan `accessToken2` dan `sessionId2`

**Database Check:**

```sql
SELECT * FROM "sys_Session" WHERE user_id = 1 AND "isActive" = true;
```

Harus ada 2 active sessions sekarang.

---

### Scenario 2: Get Active Sessions

#### Test 2.1: Get All Active Sessions

**Request:**

```http
GET http://localhost:3000/sessions?onlyActive=true
Authorization: Bearer {accessToken dari test 1.1}
```

**Expected Response:**

```json
{
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id": "clx1234567890abcdef",
      "deviceName": "MacBook Pro - Chrome",
      "deviceType": "desktop",
      "browser": "Chrome 118.0",
      "os": "Windows 10",
      "ipAddress": "::1",
      "isActive": true,
      "lastActivityAt": "2025-10-15T10:30:00Z",
      "expiresAt": "2025-10-22T10:00:00Z",
      "createdAt": "2025-10-15T10:00:00Z",
      "revokedAt": null,
      "revokedReason": null
    },
    {
      "id": "clx0987654321fedcba",
      "deviceName": "iPhone 14 Pro - Safari",
      "deviceType": "mobile",
      "browser": "Safari 16.0",
      "os": "iOS 16.0",
      "ipAddress": "::1",
      "isActive": true,
      "lastActivityAt": "2025-10-15T10:35:00Z",
      "expiresAt": "2025-10-22T10:30:00Z",
      "createdAt": "2025-10-15T10:30:00Z",
      "revokedAt": null,
      "revokedReason": null
    }
  ],
  "total": 2
}
```

**✅ Verification:**

- Response status: 200
- `total` harus 2
- Kedua session memiliki `isActive: true`
- Device info ter-parse dengan benar (browser, os, deviceType)

---

#### Test 2.2: Get Session Statistics

**Request:**

```http
GET http://localhost:3000/sessions/stats/me
Authorization: Bearer {accessToken}
```

**Expected Response:**

```json
{
  "message": "Session statistics retrieved successfully",
  "data": {
    "totalSessions": 2,
    "activeSessions": 2,
    "deviceTypes": [
      { "type": "desktop", "count": 1 },
      { "type": "mobile", "count": 1 }
    ]
  }
}
```

**✅ Verification:**

- `totalSessions` = 2
- `activeSessions` = 2
- Device types sesuai dengan login sebelumnya

---

### Scenario 3: Logout Per Device

#### Test 3.1: Login dari Device Ketiga

**Request:**

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "deviceName": "Windows Desktop - Firefox"
}
```

**✅ Verification:**

- Sekarang ada 3 active sessions

---

#### Test 3.2: Logout dari Device Kedua (iPhone)

**Request:**

```http
DELETE http://localhost:3000/sessions/{sessionId2 dari test 1.2}
Authorization: Bearer {accessToken dari test 1.1}
Content-Type: application/json

{
  "reason": "Testing logout from specific device"
}
```

**Expected Response:**

```json
{
  "message": "Session revoked successfully",
  "data": {
    "id": "clx0987654321fedcba",
    "isActive": false,
    "revokedAt": "2025-10-15T11:00:00Z",
    "revokedReason": "Testing logout from specific device"
  }
}
```

**✅ Verification:**

- Response status: 200
- Session ter-revoke dengan benar
- `isActive` sekarang `false`

**Database Check:**

```sql
SELECT * FROM "sys_Session"
WHERE id = 'clx0987654321fedcba';
```

- `isActive` harus `false`
- `revokedAt` harus terisi
- `revokedReason` sesuai request

---

#### Test 3.3: Verify Active Sessions Berkurang

**Request:**

```http
GET http://localhost:3000/sessions?onlyActive=true
Authorization: Bearer {accessToken}
```

**✅ Verification:**

- `total` sekarang harus 2 (bukan 3)
- Session iPhone tidak muncul dalam list

---

### Scenario 4: Logout Other Devices

#### Test 4.1: Logout dari Semua Device Kecuali Device Saat Ini

**Request:**

```http
POST http://localhost:3000/sessions/revoke-others
Authorization: Bearer {accessToken dari device 1}
```

**Expected Response:**

```json
{
  "message": "Other sessions revoked successfully",
  "count": 1
}
```

**✅ Verification:**

- Response `count` = 1 (device ketiga)
- Status: 200

---

#### Test 4.2: Verify Hanya Tersisa 1 Active Session

**Request:**

```http
GET http://localhost:3000/sessions?onlyActive=true
Authorization: Bearer {accessToken dari device 1}
```

**✅ Verification:**

- `total` = 1
- Hanya device pertama yang masih aktif

---

### Scenario 5: Logout All Devices

#### Test 5.1: Login Beberapa Device

Login dari 3 device berbeda untuk setup test.

---

#### Test 5.2: Logout dari Semua Device

**Request:**

```http
POST http://localhost:3000/sessions/revoke-all
Authorization: Bearer {accessToken}
```

**Expected Response:**

```json
{
  "message": "All sessions revoked successfully",
  "count": 3
}
```

**✅ Verification:**

- Semua session ter-revoke
- `count` sesuai dengan jumlah active sessions

---

#### Test 5.3: Verify Tidak Ada Active Sessions

**Request:**

```http
GET http://localhost:3000/sessions?onlyActive=true
Authorization: Bearer {accessToken}
```

**Expected:**

- Bisa jadi endpoint return 401 Unauthorized karena session sudah di-revoke
- Atau return empty array jika masih bisa akses

---

### Scenario 6: Session Expiry & Cleanup

#### Test 6.1: Manual Cleanup Expired Sessions

**Setup:**
Ubah `expiresAt` di database untuk simulasi expired session:

```sql
UPDATE "sys_Session"
SET "expiresAt" = NOW() - INTERVAL '1 day'
WHERE id = 'session_id_tertentu';
```

**Request:**

```http
POST http://localhost:3000/sessions/cleanup-expired
Authorization: Bearer {adminAccessToken}
```

**Expected Response:**

```json
{
  "message": "Expired sessions cleaned up successfully",
  "count": 1
}
```

---

### Scenario 7: Refresh Token with Session

#### Test 7.1: Refresh Access Token

**Request:**

```http
POST http://localhost:3000/auth/refresh
Authorization: Bearer {refreshToken}
```

**Expected Response:**

```json
{
  "accessToken": "new_access_token...",
  "refreshToken": "new_refresh_token...",
  "sessionId": "same_session_id"
}
```

**✅ Verification:**

- New tokens diterima
- `sessionId` tetap sama
- `lastActivityAt` di database ter-update

---

### Scenario 8: Invalid Session Handling

#### Test 8.1: Akses dengan Revoked Session

**Setup:** Revoke session terlebih dahulu

**Request:**

```http
GET http://localhost:3000/sessions
Authorization: Bearer {accessToken dari revoked session}
```

**Expected:**

- Status: 401 Unauthorized
- Error message tentang invalid session

---

#### Test 8.2: Akses dengan Expired Session

**Setup:** Ubah `expiresAt` menjadi past date

**Request:**

```http
GET http://localhost:3000/sessions
Authorization: Bearer {accessToken dari expired session}
```

**Expected:**

- Status: 401 Unauthorized
- Error message tentang expired session

---

## 🔧 cURL Commands (Quick Copy-Paste)

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "deviceName": "Test Device"
  }'
```

### Get Sessions

```bash
curl -X GET "http://localhost:3000/sessions?onlyActive=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Stats

```bash
curl -X GET http://localhost:3000/sessions/stats/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Logout Specific Device

```bash
curl -X DELETE http://localhost:3000/sessions/SESSION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test logout"}'
```

### Logout Other Devices

```bash
curl -X POST http://localhost:3000/sessions/revoke-others \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Logout All Devices

```bash
curl -X POST http://localhost:3000/sessions/revoke-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Testing Checklist

### ✅ Functional Tests

- [ ] Login membuat session baru
- [ ] Multi-device login membuat multiple sessions
- [ ] Get sessions menampilkan semua active sessions
- [ ] Device info ter-parse dengan benar
- [ ] Session statistics akurat
- [ ] Logout per device berfungsi
- [ ] Logout other devices berfungsi
- [ ] Logout all devices berfungsi
- [ ] Session cleanup berfungsi
- [ ] Refresh token update session

### ✅ Security Tests

- [ ] Refresh token ter-hash di database
- [ ] Revoked session tidak bisa digunakan
- [ ] Expired session tidak bisa digunakan
- [ ] User hanya bisa akses session miliknya sendiri

### ✅ Data Validation Tests

- [ ] IP address terekam
- [ ] User agent terekam
- [ ] Browser info ter-parse
- [ ] OS info ter-parse
- [ ] Device type ter-detect
- [ ] Timestamps akurat

---

## 🎯 Expected Test Results Summary

| Test                   | Expected Result          | Actual Result | Status |
| ---------------------- | ------------------------ | ------------- | ------ |
| Login creates session  | sessionId returned       |               | ⏳     |
| Multi-device detection | Multiple active sessions |               | ⏳     |
| Get all sessions       | List of 2+ sessions      |               | ⏳     |
| Session statistics     | Correct counts           |               | ⏳     |
| Logout specific device | 1 session revoked        |               | ⏳     |
| Logout other devices   | N-1 sessions revoked     |               | ⏳     |
| Logout all devices     | All sessions revoked     |               | ⏳     |
| Session cleanup        | Expired sessions removed |               | ⏳     |
| Refresh token          | New tokens, same session |               | ⏳     |

---

## 🐛 Common Issues & Solutions

### Issue 1: Device info tidak muncul

**Solution:**

- Pastikan request mengirim `User-Agent` header
- Check package `ua-parser-js` terinstall

### Issue 2: IP address selalu `::1`

**Reason:** Localhost menggunakan IPv6 loopback
**Solution:** Normal untuk testing di localhost

### Issue 3: Session tidak ter-revoke

**Check:**

1. SessionId valid?
2. User punya permission?
3. Session masih aktif?

### Issue 4: 401 Unauthorized

**Check:**

1. Access token masih valid?
2. Session belum expired?
3. Session belum di-revoke?

---

## 📊 Database Monitoring Queries

### Check Active Sessions

```sql
SELECT
  u.name,
  u.email,
  s.id as session_id,
  s."deviceName",
  s."deviceType",
  s."ipAddress",
  s."isActive",
  s."lastActivityAt",
  s."expiresAt"
FROM "sys_Session" s
JOIN "sys_User" u ON s.user_id = u.id
WHERE s."isActive" = true
ORDER BY s."lastActivityAt" DESC;
```

### Count Sessions Per User

```sql
SELECT
  u.name,
  COUNT(*) as total_sessions,
  SUM(CASE WHEN s."isActive" = true THEN 1 ELSE 0 END) as active_sessions
FROM "sys_User" u
LEFT JOIN "sys_Session" s ON s.user_id = u.id
GROUP BY u.id, u.name;
```

### Recent Logins

```sql
SELECT
  u.name,
  s."deviceName",
  s."ipAddress",
  s."createdAt"
FROM "sys_Session" s
JOIN "sys_User" u ON s.user_id = u.id
ORDER BY s."createdAt" DESC
LIMIT 10;
```

### Sessions by Device Type

```sql
SELECT
  "deviceType",
  COUNT(*) as count
FROM "sys_Session"
WHERE "isActive" = true
GROUP BY "deviceType";
```

