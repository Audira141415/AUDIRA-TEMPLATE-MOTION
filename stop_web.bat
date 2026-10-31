@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo Menghentikan AUDIRA MOTION Web di Port 3788...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop_web.ps1"

exit /b 0

