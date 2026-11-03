@echo off
setlocal
chcp 65001 >nul
title AUDIRA MOTION (PRODUCTION PORT 3788)
cd /d "%~dp0"

echo ========================================================
echo   🚀 AUDIRA MOTION - PRODUCTION LAUNCHER (PORT 3788)
echo   Founder: Agus Dwi Rianto (AUDIRA)
echo ========================================================
echo.

:: 1. Hentikan instans lama jika ada di port 3788
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop_web.ps1" >nul 2>&1

:: 2. Pastikan build ada
if not exist "%~dp0.next\BUILD_ID" (
    echo [!] Production build belum ditemukan. Membangun aplikasi terlebih dahulu...
    call pnpm build
)

:: 3. Jalankan server produksi
echo [*] Menjalankan server Next.js Production di Port 3788...
start "AUDIRA MOTION PROD [PORT 3788]" cmd /k "cd /d ""%~dp0"" && pnpm start"

:: 4. Buka browser
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $port = 3788; Start-Sleep -Seconds 2; Start-Process ('http://localhost:' + $port + '/studio') }"

exit /b 0
