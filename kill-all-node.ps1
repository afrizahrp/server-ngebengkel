# Script PowerShell untuk kill semua process Node.js
Write-Host "Killing all Node.js processes..." -ForegroundColor Yellow

# Kill all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Done! All Node.js processes have been terminated." -ForegroundColor Green
Write-Host "You can now start your application." -ForegroundColor Cyan

