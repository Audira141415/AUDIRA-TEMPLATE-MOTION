@echo off
setlocal
chcp 65001 >nul
title AUDIRA MOTION - BUILD PRODUCTION
cd /d "%~dp0"

echo ========================================================
echo   🔨 AUDIRA MOTION - PRODUCTION BUILDER
echo   Founder: Agus Dwi Rianto (AUDIRA)
echo ========================================================
echo.
echo [*] Memulai proses kompilasi production Next.js...
echo.

call pnpm build

if errorlevel 1 (
    echo.
    echo ========================================================
    echo   [X] BUILD GAGAL! Periksa log kesalahan di atas.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [V] PRODUCTION BUILD BERHASIL! (.next/BUILD_ID siap)
    echo   Anda sekarang dapat menjalankan: start_web.bat
    echo ========================================================
)

echo.
pause
