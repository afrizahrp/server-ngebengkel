# 📱 Panduan Session Management

Sistem session management untuk mendeteksi login multi-device, mengatur logout per device, revoke session spesifik, dan audit login.

## 🎯 Fitur-Fitur

1. **Multi-Device Detection**: Deteksi dan track semua device yang login
2. **Device-Specific Logout**: Logout dari device tertentu tanpa logout dari device lain
3. **Session Revocation**: Revoke atau invalidate session spesifik
4. **Login Audit**: Track device info, IP address, browser, OS, dan timestamp

## 📋 Database Schema

Tabel `sys_Session` sudah ditambahkan dengan struktur:

```prisma
model sys_Session {
  id              String                 @id @default(cuid())
  user_id         Int
  refreshToken    String                 @unique
  deviceName      String?                // Nama device
  deviceType      String?                // mobile, desktop, tablet
  browser         String?                // Browser info
  os              String?                // Operating System
  ipAddress       String?                // IP Address
  userAgent       String?                // Full user agent string
  isActive        Boolean                @default(true)
  lastActivityAt  DateTime               @default(now())
  expiresAt       DateTime
  createdAt       DateTime               @default(now())
  revokedAt       DateTime?
  revokedReason   String?
  iStatus         MasterRecordStatusEnum @default(Active)
  user            sys_User               @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

## 🔌 API Endpoints

### 1. **Login** (Otomatis membuat session)

**Endpoint**: `POST /auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceName": "iPhone 14 Pro" // Optional
}
```

**Response**:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "clx1234567890abcdef",
  "message": "Login successful"
}
```

### 2. **Get All Sessions** (Daftar semua device yang login)

**Endpoint**: `GET /sessions?onlyActive=true`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Query Parameters**:

- `onlyActive`: boolean (default: true) - Hanya tampilkan session aktif

**Response**:

```json
{
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id": "clx1234567890abcdef",
      "deviceName": "iPhone 14 Pro",
      "deviceType": "mobile",
      "browser": "Safari 16.0",
      "os": "iOS 16.0",
      "ipAddress": "192.168.1.100",
      "isActive": true,
      "lastActivityAt": "2025-10-15T10:30:00Z",
      "expiresAt": "2025-10-22T10:00:00Z",
      "createdAt": "2025-10-15T10:00:00Z",
      "revokedAt": null,
      "revokedReason": null
    },
    {
      "id": "clx0987654321fedcba",
      "deviceName": "MacBook Pro",
      "deviceType": "desktop",
      "browser": "Chrome 118.0",
      "os": "macOS 14.0",
      "ipAddress": "192.168.1.101",
      "isActive": true,
      "lastActivityAt": "2025-10-15T09:45:00Z",
      "expiresAt": "2025-10-22T09:30:00Z",
      "createdAt": "2025-10-15T09:30:00Z",
      "revokedAt": null,
      "revokedReason": null
    }
  ],
  "total": 2
}
```

### 3. **Get Session Statistics**

**Endpoint**: `GET /sessions/stats/me`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Response**:

```json
{
  "message": "Session statistics retrieved successfully",
  "data": {
    "totalSessions": 5,
    "activeSessions": 2,
    "deviceTypes": [
      {
        "type": "mobile",
        "count": 1
      },
      {
        "type": "desktop",
        "count": 1
      }
    ]
  }
}
```

### 4. **Logout dari Device Tertentu**

**Endpoint**: `DELETE /sessions/{sessionId}`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Request Body** (Optional):

```json
{
  "reason": "Logout from this device"
}
```

**Response**:

```json
{
  "message": "Session revoked successfully",
  "data": {
    "id": "clx1234567890abcdef",
    "isActive": false,
    "revokedAt": "2025-10-15T11:00:00Z",
    "revokedReason": "Logout from this device"
  }
}
```

### 5. **Logout dari Semua Device Kecuali Device Saat Ini**

**Endpoint**: `POST /sessions/revoke-others`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Response**:

```json
{
  "message": "Other sessions revoked successfully",
  "count": 3
}
```

### 6. **Logout dari Semua Device**

**Endpoint**: `POST /sessions/revoke-all`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Response**:

```json
{
  "message": "All sessions revoked successfully",
  "count": 4
}
```

### 7. **Logout Normal** (Logout dari device saat ini)

**Endpoint**: `POST /auth/logout`

**Headers**:

```
Authorization: Bearer {accessToken}
```

**Request Body** (Optional):

```json
{
  "sessionId": "clx1234567890abcdef"
}
```

**Response**:

```json
{
  "message": "Logout successful"
}
```

## 💻 Contoh Penggunaan di Frontend

### React/Next.js Example

```typescript
// 1. Login dan simpan sessionId
const login = async (email: string, password: string, deviceName?: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, deviceName }),
  });

  const data = await response.json();

  // Simpan tokens dan sessionId
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('sessionId', data.sessionId);

  return data;
};

// 2. Get semua sessions (daftar device)
const getSessions = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/sessions?onlyActive=true', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// 3. Logout dari device tertentu
const logoutFromDevice = async (sessionId: string) => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Logged out by user' }),
  });

  return await response.json();
};

// 4. Logout dari semua device lain
const logoutOtherDevices = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/sessions/revoke-others', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// 5. Logout dari semua device
const logoutAllDevices = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/sessions/revoke-all', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### UI Component Example (React)

```typescript
import { useState, useEffect } from 'react';

interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  isActive: boolean;
  lastActivityAt: string;
  createdAt: string;
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const currentSessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data.data);
  };

  const handleLogoutDevice = async (sessionId: string) => {
    await logoutFromDevice(sessionId);
    loadSessions(); // Reload list
  };

  const handleLogoutOthers = async () => {
    await logoutOtherDevices();
    loadSessions(); // Reload list
  };

  return (
    <div className="active-sessions">
      <h2>Device yang Aktif</h2>

      <button onClick={handleLogoutOthers}>
        Logout dari Semua Device Lain
      </button>

      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-card">
            <div className="session-icon">
              {session.deviceType === 'mobile' ? '📱' : '💻'}
            </div>

            <div className="session-info">
              <h3>{session.deviceName}</h3>
              <p>{session.browser} on {session.os}</p>
              <p>IP: {session.ipAddress}</p>
              <p className="text-sm">
                Last active: {new Date(session.lastActivityAt).toLocaleString()}
              </p>

              {session.id === currentSessionId && (
                <span className="badge">Device Saat Ini</span>
              )}
            </div>

            {session.id !== currentSessionId && (
              <button
                onClick={() => handleLogoutDevice(session.id)}
                className="btn-danger"
              >
                Logout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔐 Security Features

1. **Refresh Token Hashing**: Semua refresh token di-hash menggunakan Argon2 sebelum disimpan
2. **Auto Expiry**: Session otomatis expired setelah 7 hari
3. **IP & User Agent Tracking**: Track IP address dan user agent untuk audit
4. **Cascade Delete**: Session otomatis dihapus jika user dihapus
5. **Active Session Validation**: Setiap request memvalidasi apakah session masih aktif

## 📊 Audit & Monitoring

Session tracking mencakup:

- **Device Information**: Type, name, browser, OS
- **Network Information**: IP address
- **Activity Tracking**: Last activity timestamp
- **Login History**: Created at timestamp
- **Logout Tracking**: Revoked at, revoked reason

## 🔄 Backward Compatibility

Implementasi ini tetap mempertahankan field `hashedRefreshToken` di tabel `sys_User` untuk backward compatibility dengan sistem yang sudah ada.

## 🛠️ Maintenance

### Cleanup Expired Sessions (Cron Job)

Endpoint untuk cleanup session yang sudah expired:

**Endpoint**: `POST /sessions/cleanup-expired`

**Headers**:

```
Authorization: Bearer {adminAccessToken}
```

**Response**:

```json
{
  "message": "Expired sessions cleaned up successfully",
  "count": 15
}
```

Anda bisa setup cron job untuk menjalankan endpoint ini secara periodik.

## 🎨 Best Practices

1. **Device Naming**: Minta user memberikan nama device saat login untuk identifikasi lebih mudah
2. **Session Limit**: Consider membatasi jumlah active sessions per user
3. **Suspicious Activity**: Monitor login dari IP address atau location yang tidak biasa
4. **Email Notification**: Kirim email saat ada login dari device baru
5. **Session Expiry Warning**: Beri warning ke user sebelum session expired

## 🐛 Troubleshooting

### Session tidak terbuat saat login

- Pastikan `SessionModule` sudah di-import di `BetterAuthModule`
- Check apakah database migration sudah dijalankan
- Verify bahwa package `ua-parser-js` sudah terinstall

### Session tidak ter-revoke

- Pastikan sessionId yang dikirim valid
- Check apakah user memiliki permission untuk revoke session tersebut

### Device info tidak muncul

- Pastikan client mengirim `User-Agent` header
- Check apakah package `ua-parser-js` sudah terinstall dengan benar

## 📝 Notes

- Session ID menggunakan CUID untuk uniqueness
- Refresh token di-hash dengan Argon2 untuk security
- Last activity otomatis di-update setiap kali session divalidasi
- Session expired otomatis setelah 7 hari dari login

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan di masa depan:

1. Email notification untuk login baru
2. Suspicious activity detection
3. Session limit per user
4. Geographic location tracking
5. Device fingerprinting
6. Two-factor authentication integration
