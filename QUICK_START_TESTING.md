# 🚀 Quick Start: Testing Session Management

Panduan cepat untuk mulai testing dalam 5 menit!

## 📦 Prerequisites

1. ✅ Database sudah running
2. ✅ Migration sudah dijalankan (`npx prisma migrate dev`)
3. ✅ Server sudah running (`npm run start:dev`)

## 🎯 Cara Cepat Testing

### Metode 1: Menggunakan REST Client (Recommended untuk VS Code)

1. **Install REST Client Extension**

   - Buka VS Code
   - Pergi ke Extensions (Ctrl+Shift+X)
   - Search "REST Client"
   - Install extension oleh Huachao Mao

2. **Buka File Test**
   - Buka file `test-session.http`
3. **Jalankan Test**

   - Klik "Send Request" di atas setiap HTTP request
   - Atau gunakan shortcut: `Ctrl+Alt+R` (Windows) / `Cmd+Alt+R` (Mac)

4. **Flow Testing:**
   ```
   a. Register user baru (atau skip jika sudah ada)
   b. Login dari device 1 -> Copy accessToken & sessionId
   c. Login dari device 2 -> Copy accessToken2 & sessionId2
   d. Get all sessions -> Harus tampil 2 sessions
   e. Logout device 2 -> Verify berkurang jadi 1
   f. Get sessions lagi -> Verify hanya 1 session
   ```

---

### Metode 2: Menggunakan Thunder Client (VS Code)

1. **Install Thunder Client**

   - Extensions -> Search "Thunder Client"
   - Install

2. **Import Collection**

   - Buka Thunder Client
   - Import -> From File
   - Pilih `test-session.http` (atau buat manual)

3. **Jalankan Requests**
   - Klik request yang ingin dijalankan
   - Click "Send"

---

### Metode 3: Menggunakan Postman

1. **Import Collection**

   - Buka Postman
   - Import -> Raw Text
   - Copy isi dari `test-session.http`

2. **Setup Environment Variables**

   ```
   baseUrl: http://localhost:3000
   email: test@example.com
   password: password123
   accessToken: (akan di-set setelah login)
   sessionId: (akan di-set setelah login)
   ```

3. **Jalankan Collection**

---

### Metode 4: Menggunakan cURL (Command Line)

#### Step 1: Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Step 2: Login Device 1

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "deviceName": "MacBook Pro"
  }'
```

**Copy accessToken dan sessionId dari response!**

#### Step 3: Login Device 2

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "deviceName": "iPhone 14"
  }'
```

#### Step 4: Get All Sessions

```bash
curl -X GET "http://localhost:3000/sessions?onlyActive=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 5: Get Session Stats

```bash
curl -X GET "http://localhost:3000/sessions/stats/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 6: Logout Device 2

```bash
curl -X DELETE "http://localhost:3000/sessions/YOUR_SESSION_ID_2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test logout"}'
```

#### Step 7: Logout Other Devices

```bash
curl -X POST "http://localhost:3000/sessions/revoke-others" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔍 Verifikasi di Database

### Check Active Sessions

```sql
SELECT
  s.id,
  u.email,
  s."deviceName",
  s."deviceType",
  s."browser",
  s."os",
  s."ipAddress",
  s."isActive",
  s."lastActivityAt"
FROM "sys_Session" s
JOIN "sys_User" u ON s.user_id = u.id
WHERE s."isActive" = true
ORDER BY s."createdAt" DESC;
```

### Count Sessions Per User

```sql
SELECT
  u.email,
  COUNT(*) FILTER (WHERE s."isActive" = true) as active_sessions,
  COUNT(*) as total_sessions
FROM "sys_User" u
LEFT JOIN "sys_Session" s ON s.user_id = u.id
GROUP BY u.id, u.email;
```

---

## 📋 5-Minute Test Checklist

```
□ 1. Server running
□ 2. Register/Login user pertama
□ 3. Copy accessToken & sessionId
□ 4. Login dari device kedua
□ 5. GET /sessions -> Verify 2 sessions muncul
□ 6. GET /sessions/stats/me -> Verify count = 2
□ 7. DELETE /sessions/:id -> Logout device 2
□ 8. GET /sessions -> Verify hanya 1 session
□ 9. POST /sessions/revoke-all -> Logout semua
□ 10. GET /sessions -> Verify empty atau error 401
```

**✅ Jika semua test pass, sistem bekerja dengan baik!**

---

## 🎬 Video Demo Flow

### Flow 1: Multi-Device Detection

```
1. Login dari Chrome (MacBook)    -> Session 1 created ✓
2. Login dari Safari (iPhone)     -> Session 2 created ✓
3. Login dari Firefox (Windows)   -> Session 3 created ✓
4. GET /sessions                  -> Shows 3 active sessions ✓
```

### Flow 2: Device-Specific Logout

```
1. GET /sessions                  -> 3 sessions
2. DELETE /sessions/{iPhone-id}   -> iPhone logged out ✓
3. GET /sessions                  -> 2 sessions (MacBook & Windows) ✓
4. iPhone tries to access         -> 401 Unauthorized ✓
```

### Flow 3: Logout Other Devices

```
1. Currently on MacBook           -> Session 1
2. POST /sessions/revoke-others   -> Logout iPhone & Windows ✓
3. GET /sessions                  -> Only MacBook session ✓
4. iPhone & Windows access        -> 401 Unauthorized ✓
```

### Flow 4: Logout All Devices

```
1. Currently logged in 3 devices  -> 3 sessions
2. POST /sessions/revoke-all      -> All logged out ✓
3. GET /sessions                  -> 401 or empty ✓
4. Any device tries to access     -> 401 Unauthorized ✓
```

---

## 🐛 Troubleshooting

### Server tidak running

```bash
# Check if server is running
curl http://localhost:3000

# Start server
npm run start:dev
```

### Database connection error

```bash
# Check database
npx prisma studio

# Run migration
npx prisma migrate dev
```

### 401 Unauthorized

- Token expired? Login ulang
- Token salah? Copy ulang dari response
- Session revoked? Login lagi

### Session tidak terbuat

```bash
# Check if SessionModule imported
# Restart server
npm run start:dev
```

---

## 📊 Expected Results

### Login Response

```json
{
  "user": { ... },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "sessionId": "clx...",  // ← Harus ada!
  "message": "Login successful"
}
```

### Get Sessions Response

```json
{
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id": "clx...",
      "deviceName": "MacBook Pro",  // ← Device name
      "deviceType": "desktop",      // ← Auto-detected
      "browser": "Chrome 118.0",    // ← Auto-detected
      "os": "Windows 10",           // ← Auto-detected
      "ipAddress": "::1",           // ← Client IP
      "isActive": true,
      "lastActivityAt": "2025-10-15T10:30:00Z",
      ...
    }
  ],
  "total": 1
}
```

---

## 🎯 Next Steps

Setelah basic testing berhasil:

1. ✅ Test dengan real devices (phone, tablet, desktop)
2. ✅ Test refresh token flow
3. ✅ Test session expiry
4. ✅ Test concurrent access
5. ✅ Implement UI di frontend
6. ✅ Add email notification untuk login baru
7. ✅ Add session activity logging

---

## 💡 Tips

1. **Gunakan Different Browsers** untuk simulasi multi-device
2. **Device Name** bisa custom untuk identifikasi lebih mudah
3. **Simpan accessToken** di variable untuk reuse
4. **Check Database** untuk verifikasi data tersimpan benar
5. **Monitor Console** untuk error messages

---

## ✅ Success Criteria

- [x] Login membuat session baru
- [x] SessionId returned di response
- [x] Device info ter-parse otomatis
- [x] Multi-device detection works
- [x] Logout per device works
- [x] Logout other devices works
- [x] Logout all devices works
- [x] Session data tersimpan di database
- [x] Revoked session tidak bisa digunakan
- [x] Statistics menampilkan data akurat

**🎉 Jika semua checklist di atas pass, sistem session management Anda sudah siap production!**
