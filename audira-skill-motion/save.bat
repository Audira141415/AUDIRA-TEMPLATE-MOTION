@echo off
setlocal enabledelayedexpansion
title AUDIRA SKILL MOTION - GitHub Auto Push

cd /d "%~dp0"

echo ========================================================================
echo   AUDIRA SKILL MOTION 3D - AUTO SAVE ^& GITHUB SYNC
echo   Target Repo: https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git
echo ========================================================================
echo.

:: 1. Verifikasi instalasi Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak ditemukan di sistem Anda!
    echo Silakan install Git terlebih dahulu dari https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: 2. Cek apakah folder repository git sudah diinisialisasi
if not exist ".git" (
    echo [*] Menginisialisasi Git Repository lokal...
    git init
    git branch -M main
    git remote add origin https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git
    echo [OK] Git initialized dan remote origin ditambahkan.
) else (
    echo [*] Git repository lokal sudah terpasang.
    git remote set-url origin https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git 2>nul || git remote add origin https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git
    git branch -M main
)
echo.

:: 3. Input pesan commit
set "default_msg=AUDIRA SKILL MOTION update: %date% %time%"
echo Masukkan pesan commit Anda (atau langsung tekan ENTER untuk default):
set /p commit_msg="> "

if "%commit_msg%"=="" (
    set "commit_msg=%default_msg%"
)

echo.
echo [*] Melakukan git add semua perubahan...
git add -A

:: 4. Cek apakah ada perubahan untuk dicommit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] Tidak ada perubahan baru yang perlu dicommit.
) else (
    echo [*] Melakukan git commit...
    git commit -m "%commit_msg%"
)

echo.
echo [*] Menghubungkan dan melakukan push ke GitHub (main)...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================================
    echo [PERINGATAN] Push gagal atau ditolak oleh GitHub!
    echo Kemungkinan penyebab:
    echo 1. Ada file di GitHub (misal README/License bawaan) yang belum ada di lokal.
    echo 2. Belum login / otentikasi GitHub di Git Credential Manager.
    echo ========================================================================
    echo.
    set /p choice="Ingin mencoba pull rebase otomatis lalu push ulang? (Y/N): "
    if /i "!choice!"=="Y" (
        echo [*] Menjalankan git pull --rebase origin main...
        git pull --rebase origin main --allow-unrelated-histories
        echo [*] Mencoba push ulang ke main...
        git push -u origin main
    )
)

echo.
echo ========================================================================
echo   Proses Selesai!
echo ========================================================================
echo.
pause

