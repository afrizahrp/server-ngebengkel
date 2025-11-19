# Konfigurasi JWT Expires Time

## Environment Variables

### Backend (.env)

```env
# JWT Access Token Expires (default: 1d)
# Format: number + unit (s, m, h, d)
# Examples:
#   - 15m = 15 menit
#   - 1h = 1 jam
#   - 1d = 1 hari
#   - 7d = 7 hari
JWT_EXPIRES=15m

# JWT Secret (required)
JWT_SECRET=your-secret-key

# Refresh Token Expires (default: 7d)
# Format: number + unit (s, m, h, d)
REFRESH_JWT_EXPIRES=7d

# Refresh Token Secret (required)
REFRESH_JWT_SECRET=your-refresh-secret-key
```

## Testing Auto-Refresh

### Setup untuk Testing (15 menit):

1. **Set JWT expires di backend .env:**
```env
JWT_EXPIRES=15m
REFRESH_JWT_EXPIRES=1h  # Optional: 1 jam untuk testing (default: 7d)
```

2. **Restart backend server:**
```bash
npm run start:dev
```

3. **Uncomment service credentials di frontend .env.local:**
```env
SERVICE_USERNAME=listing-user
SERVICE_EMAIL=info@ngebengkel.com
SERVICE_PASSWORD=Lisin@
```

4. **Restart Next.js server:**
```bash
npm run dev
```

### Expected Logs:

**First Request:**
```
[ServiceToken] Logging in service account...
[ServiceToken] ✅ Login successful! Access token expires in 15 minutes, refresh token expires in 10080 minutes
```

**Subsequent Requests (Token Valid):**
```
[ServiceToken] Using cached token (expires in 14 minutes)
[ServiceToken] Using cached token (expires in 13 minutes)
...
```

**Token Expired (Auto-Refresh):**
```
[ServiceToken] Access token expired, refreshing... (refresh token expires in 10079 minutes)
[ServiceToken] ✅ Token refreshed successfully (new token expires in 15 minutes)
```

**Refresh Token Expired (Re-Login):**
```
[ServiceToken] ⚠️ Failed to refresh service token, will re-login: ...
[ServiceToken] Logging in service account...
[ServiceToken] ✅ Login successful! Access token expires in 15 minutes, refresh token expires in 10080 minutes
```

## Format Expires Time

JWT library menggunakan format:
- `s` = seconds (e.g., `30s` = 30 detik)
- `m` = minutes (e.g., `15m` = 15 menit)
- `h` = hours (e.g., `1h` = 1 jam)
- `d` = days (e.g., `1d` = 1 hari)

## Recommended Values

### Development/Testing:
```env
JWT_EXPIRES=15m           # 15 menit untuk testing auto-refresh
REFRESH_JWT_EXPIRES=1h    # 1 jam untuk testing
```

### Production:
```env
JWT_EXPIRES=1d            # 1 hari
REFRESH_JWT_EXPIRES=7d    # 7 hari
```

## Notes

- Set `JWT_EXPIRES=15m` untuk testing auto-refresh mechanism
- Logs akan muncul di Next.js server console (bukan browser console)
- Token akan otomatis di-refresh saat expired
- Refresh token expires lebih lama untuk prevent frequent re-login

