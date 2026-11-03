@echo off
setlocal
chcp 65001 >nul
title AUDIRA MOTION (PORT 3788)
cd /d "%~dp0"

echo ========================================================
echo   🎬 AUDIRA MOTION - WEB LAUNCHER (PORT 3788)
echo   Founder: Agus Dwi Rianto (AUDIRA)
echo ========================================================
echo.

:: 1. Hentikan instans lama jika ada di port 3788
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop_web.ps1" >nul 2>&1

:: 2. Buka jendela server di latar belakang (Mode Dev - Hot Reload & Bebas Error Build)
echo [*] Menjalankan server Next.js di Port 3788 (Hot Reload Aktif)...
start "AUDIRA MOTION SERVER [PORT 3788]" cmd /k "cd /d ""%~dp0"" && pnpm dev"

:: 3. Jalankan script pengecekan kesiapan dan buka browser
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $port = 3788; Write-Host '[*] Menunggu server siap...' -NoNewline; $ready = $false; for ($i = 0; $i -lt 15; $i++) { Start-Sleep -Milliseconds 600; Write-Host '.' -NoNewline; $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue; if ($conn) { $ready = $true; break } }; Write-Host ''; if ($ready) { $url = 'http://localhost:' + $port; Write-Host ''; Write-Host '========================================================' -ForegroundColor Green; Write-Host '   [V] AUDIRA MOTION BERHASIL DIAKTIFKAN!' -ForegroundColor Green; Write-Host ('   URL Beranda: ' + $url) -ForegroundColor Cyan; Write-Host ('   URL Studio:  ' + $url + '/studio') -ForegroundColor Yellow; Write-Host ('   Port Khusus: ' + $port) -ForegroundColor White; Write-Host '========================================================' -ForegroundColor Green; Write-Host ''; Write-Host '[*] Membuka browser ke ' + $url + '/studio...' -ForegroundColor DarkGray; Start-Process ($url + '/studio') } else { Write-Host '[!] Server memerlukan waktu lebih lama untuk warm-up. Akses manual: http://localhost:3788/studio' -ForegroundColor Yellow } }"

exit /b 0
