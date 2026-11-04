@echo off
setlocal
chcp 65001 >nul
title AUDIRA SKILL MOTION 3D - REMOTION STUDIO
cd /d "%~dp0"

echo ========================================================
echo   🎬 AUDIRA SKILL MOTION 3D - REMOTION STUDIO
echo   20 Signature 3D Styles (Remotion + React Three Fiber)
echo   Creator: Agus Dwi Rianto (AUDIRA MDA)
echo ========================================================
echo.

if not exist "%~dp0audira-skill-motion\starter\node_modules" (
    echo [*] Menginstall dependensi starter terlebih dahulu...
    cd /d "%~dp0audira-skill-motion"
    call npm install
    cd starter
    call npm install
    cd /d "%~dp0"
)

echo [*] Menjalankan Remotion Studio 3D...
cd /d "%~dp0audira-skill-motion\starter"
call npm run dev
