@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title AUDIRA TEMPLATE MOTION - Git Save & Push Hub

cd /d "%~dp0"

echo ================================================================
echo           AUDIRA TEMPLATE MOTION - GIT AUTO-SAVE ^& PUSH
echo ================================================================
echo.

:: 1. Verifikasi / Set Remote GitHub
set REPO_URL=https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [*] Menambahkan remote origin: %REPO_URL%
    git remote add origin %REPO_URL%
) else (
    echo [*] Memastikan URL remote origin: %REPO_URL%
    git remote set-url origin %REPO_URL%
)

:: 2. Dapatkan nama branch aktif
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%b
if "%CURRENT_BRANCH%"=="" set CURRENT_BRANCH=master
echo [*] Branch aktif: %CURRENT_BRANCH%
echo.

:: 3. Status Perubahan
echo [1/4] Memeriksa status file yang berubah...
git status --short
echo.

:: 4. Input Pesan Commit
set USER_MSG=%*
if "%USER_MSG%"=="" (
    set /p USER_MSG="[2/4] Masukkan pesan commit (Tekan ENTER untuk pesan default): "
)

if "%USER_MSG%"=="" (
    set USER_MSG=feat(audira): update motion studio v2.0 - %date% %time%
)

echo.
echo [*] Pesan Commit: "%USER_MSG%"
echo.

:: 5. Git Add & Commit
echo [3/4] Menyiapkan seluruh perubahan (git add ^& commit)...
git add .
git commit -m "%USER_MSG%"

if errorlevel 1 (
    echo.
    echo [i] Tidak ada perubahan baru untuk di-commit atau commit sudah bersih.
)

:: 6. Git Push ke GitHub
echo.
echo [4/4] Mengunggah (git push) ke %REPO_URL% (branch: %CURRENT_BRANCH%)...
git push -u origin %CURRENT_BRANCH%

if errorlevel 1 (
    echo.
    echo ================================================================
    echo [!] PERINGATAN: Push pertama mungkin perlu sinkronisasi branch.
    echo     Mencoba pull rebase terlebih dahulu...
    echo ================================================================
    git pull origin %CURRENT_BRANCH% --rebase --allow-unrelated-histories
    echo [*] Mengulang push...
    git push -u origin %CURRENT_BRANCH%
)

if errorlevel 1 (
    echo.
    echo [X] GAGAL PUSH: Silakan periksa koneksi internet atau hak akses GitHub Anda.
) else (
    echo.
    echo ================================================================
    echo [V] SUKSES! Seluruh kode AUDIRA TEMPLATE MOTION berhasil disimpan
    echo     dan di-push ke GitHub:
    echo     %REPO_URL%
    echo ================================================================
)

echo.
pause

