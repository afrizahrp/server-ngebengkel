# Session Management Testing Script untuk Windows PowerShell
# Cara menggunakan: .\test-session.ps1

$baseUrl = "http://localhost:3000"
$email = "test@example.com"
$password = "password123"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Session Management Testing Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function untuk HTTP Request
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body,
        [string]$Token
    )
    
    $uri = "$baseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        return $null
    }
}

# Test 1: Register User (Optional)
Write-Host "Test 1: Register User" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = $email
    password = $password
}
$registerResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/register" -Body $registerBody
if ($registerResponse) {
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.id)" -ForegroundColor Gray
} else {
    Write-Host "! User might already exist (skip to login)" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Login Device 1
Write-Host "Test 2: Login from Device 1 (MacBook Pro)" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
$loginBody1 = @{
    email = $email
    password = $password
    deviceName = "MacBook Pro - Chrome"
}
$login1 = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginBody1
if ($login1) {
    $accessToken1 = $login1.accessToken
    $sessionId1 = $login1.sessionId
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Session ID 1: $sessionId1" -ForegroundColor Gray
    Write-Host "Access Token 1: $($accessToken1.Substring(0,20))..." -ForegroundColor Gray
} else {
    Write-Host "✗ Login failed" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 3: Login Device 2
Write-Host "Test 3: Login from Device 2 (iPhone 14 Pro)" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
$loginBody2 = @{
    email = $email
    password = $password
    deviceName = "iPhone 14 Pro - Safari"
}
$login2 = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginBody2
if ($login2) {
    $accessToken2 = $login2.accessToken
    $sessionId2 = $login2.sessionId
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Session ID 2: $sessionId2" -ForegroundColor Gray
    Write-Host "Access Token 2: $($accessToken2.Substring(0,20))..." -ForegroundColor Gray
} else {
    Write-Host "✗ Login failed" -ForegroundColor Red
}
Write-Host ""

# Test 4: Login Device 3
Write-Host "Test 4: Login from Device 3 (Windows Desktop)" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Yellow
$loginBody3 = @{
    email = $email
    password = $password
    deviceName = "Windows Desktop - Firefox"
}
$login3 = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginBody3
if ($login3) {
    $accessToken3 = $login3.accessToken
    $sessionId3 = $login3.sessionId
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Session ID 3: $sessionId3" -ForegroundColor Gray
} else {
    Write-Host "✗ Login failed" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get All Sessions
Write-Host "Test 5: Get All Active Sessions" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
$sessions = Invoke-ApiRequest -Method "GET" -Endpoint "/sessions?onlyActive=true" -Token $accessToken1
if ($sessions) {
    Write-Host "✓ Sessions retrieved successfully" -ForegroundColor Green
    Write-Host "Total Active Sessions: $($sessions.total)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Sessions List:" -ForegroundColor White
    foreach ($session in $sessions.data) {
        Write-Host "  • Device: $($session.deviceName)" -ForegroundColor White
        Write-Host "    Type: $($session.deviceType) | Browser: $($session.browser)" -ForegroundColor Gray
        Write-Host "    OS: $($session.os) | IP: $($session.ipAddress)" -ForegroundColor Gray
        Write-Host "    Active: $($session.isActive) | Last Activity: $($session.lastActivityAt)" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "✗ Failed to retrieve sessions" -ForegroundColor Red
}

# Test 6: Get Session Statistics
Write-Host "Test 6: Get Session Statistics" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow
$stats = Invoke-ApiRequest -Method "GET" -Endpoint "/sessions/stats/me" -Token $accessToken1
if ($stats) {
    Write-Host "✓ Statistics retrieved successfully" -ForegroundColor Green
    Write-Host "Total Sessions: $($stats.data.totalSessions)" -ForegroundColor Cyan
    Write-Host "Active Sessions: $($stats.data.activeSessions)" -ForegroundColor Cyan
    Write-Host "Device Types:" -ForegroundColor White
    foreach ($deviceType in $stats.data.deviceTypes) {
        Write-Host "  • $($deviceType.type): $($deviceType.count)" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ Failed to retrieve statistics" -ForegroundColor Red
}
Write-Host ""

# Test 7: Logout Device 2 (iPhone)
Write-Host "Test 7: Logout from Device 2 (iPhone)" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
$deleteBody = @{
    reason = "Testing logout from specific device"
}
$deleteUrl = "/sessions/$sessionId2"
$uri = "$baseUrl$deleteUrl"
$headers = @{
    "Authorization" = "Bearer $accessToken1"
    "Content-Type" = "application/json"
}
try {
    $revokeResponse = Invoke-RestMethod -Uri $uri -Method "DELETE" -Headers $headers -Body ($deleteBody | ConvertTo-Json)
    Write-Host "✓ Device 2 logged out successfully" -ForegroundColor Green
    Write-Host "Session revoked at: $($revokeResponse.data.revokedAt)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to logout device 2" -ForegroundColor Red
}
Write-Host ""

# Test 8: Verify Sessions After Logout
Write-Host "Test 8: Verify Sessions After Device 2 Logout" -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Yellow
$sessionsAfter = Invoke-ApiRequest -Method "GET" -Endpoint "/sessions?onlyActive=true" -Token $accessToken1
if ($sessionsAfter) {
    Write-Host "✓ Sessions retrieved successfully" -ForegroundColor Green
    Write-Host "Total Active Sessions: $($sessionsAfter.total)" -ForegroundColor Cyan
    Write-Host "(Should be 2 now - MacBook and Windows)" -ForegroundColor Gray
} else {
    Write-Host "✗ Failed to retrieve sessions" -ForegroundColor Red
}
Write-Host ""

# Test 9: Logout Other Devices
Write-Host "Test 9: Logout from Other Devices (Keep Device 1 only)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Yellow
$revokeOthers = Invoke-ApiRequest -Method "POST" -Endpoint "/sessions/revoke-others" -Token $accessToken1
if ($revokeOthers) {
    Write-Host "✓ Other devices logged out successfully" -ForegroundColor Green
    Write-Host "Sessions revoked: $($revokeOthers.count)" -ForegroundColor Cyan
} else {
    Write-Host "✗ Failed to logout other devices" -ForegroundColor Red
}
Write-Host ""

# Test 10: Final Session Check
Write-Host "Test 10: Final Session Check" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
$finalSessions = Invoke-ApiRequest -Method "GET" -Endpoint "/sessions?onlyActive=true" -Token $accessToken1
if ($finalSessions) {
    Write-Host "✓ Sessions retrieved successfully" -ForegroundColor Green
    Write-Host "Total Active Sessions: $($finalSessions.total)" -ForegroundColor Cyan
    Write-Host "(Should be 1 now - Only MacBook)" -ForegroundColor Gray
    Write-Host ""
    if ($finalSessions.total -eq 1) {
        Write-Host "✓✓✓ ALL TESTS PASSED! ✓✓✓" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: Expected 1 session but got $($finalSessions.total)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Failed to retrieve sessions" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "• Logged in from 3 devices" -ForegroundColor Gray
Write-Host "• Retrieved all sessions" -ForegroundColor Gray
Write-Host "• Logged out device 2 (iPhone)" -ForegroundColor Gray
Write-Host "• Logged out all other devices" -ForegroundColor Gray
Write-Host "• Only device 1 (MacBook) remains active" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check database to verify session data" -ForegroundColor Gray
Write-Host "2. Test refresh token flow" -ForegroundColor Gray
Write-Host "3. Test session expiry" -ForegroundColor Gray
Write-Host "4. Implement UI for session management" -ForegroundColor Gray
Write-Host ""

# Optional: Logout All to Clean Up
Write-Host "Press any key to logout all devices and clean up..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""
Write-Host "Cleaning up: Logout all devices..." -ForegroundColor Yellow
$logoutAll = Invoke-ApiRequest -Method "POST" -Endpoint "/sessions/revoke-all" -Token $accessToken1
if ($logoutAll) {
    Write-Host "✓ All devices logged out" -ForegroundColor Green
    Write-Host "Sessions revoked: $($logoutAll.count)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Testing script completed!" -ForegroundColor Green

