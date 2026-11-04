@echo off
setlocal enabledelayedexpansion
title AUDIRA SKILL MOTION - Setup Environment

cd /d "%~dp0"

echo ========================================================================
echo   AUDIRA SKILL MOTION 3D - SETUP DEPENDENCIES ^& ENVIRONMENT
echo   Created by: Agus Dwi Rianto (AUDIRA MDA)
echo ========================================================================
echo.

:: 1. Cek Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terinstall!
    echo Silakan unduh dan install Node.js versi 22 LTS dari https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js terdeteksi: %NODE_VER%

:: 2. Cek npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm tidak ditemukan!
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK] npm terdeteksi: %NPM_VER%

:: 3. Cek FFmpeg
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] ffmpeg belum terpasang di PATH sistem.
    echo Sangat disarankan menginstall ffmpeg untuk analisis audio dan normalisasi LUFS:
    echo Jalankan di PowerShell: winget install ffmpeg
) else (
    echo [OK] ffmpeg terdeteksi di sistem.
)

echo.
echo ========================================================================
echo   Menginstall dependensi (Remotion, React 19, Three.js, R3F)...
echo ========================================================================
echo.

call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menginstall dependensi root!
    pause
    exit /b 1
)

echo.
echo [*] Menginstall dependensi di folder starter...
cd starter
call npm install
cd ..

echo.
echo ========================================================================
echo   Memeriksa Akselerasi GPU ^& WebGL...
echo ========================================================================
node starter/scripts/check-env.mjs

echo.
echo ========================================================================
echo   Instalasi Selesai! Siap Digunakan.
echo   - Buka Studio Visual: npm run dev
echo   - Jalankan Smoke Test: npm run smoke
echo   - Push ke GitHub: klik ganda save.bat
echo ========================================================================
echo.
pause

