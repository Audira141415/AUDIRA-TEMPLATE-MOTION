# AUDIRA MOTION - Stop Web Engine Script (Dedicated Port 3788)
# Author: Agus Dwi Rianto (AUDIRA)

$ErrorActionPreference = "SilentlyContinue"
$Port = 3788

Write-Host "========================================================" -ForegroundColor Red
Write-Host "   🛑 AUDIRA MOTION - STOPPER (PORT $Port)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Red
Write-Host ""

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if (-not $connections) {
    Write-Host "[i] Tidak ada proses yang sedang berjalan di port $Port." -ForegroundColor Green
    exit 0
}

$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($procId in $pids) {
    if ($procId -gt 0) {
        $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
        $pName = if ($p) { $p.ProcessName } else { "Unknown" }
        Write-Host "[*] Menghentikan Process ID: $procId ($pName)..." -ForegroundColor Yellow
        taskkill /F /PID $procId /T > $null 2>&1
    }
}

Start-Sleep -Milliseconds 600

# Verify
$check = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $check) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "   [V] SELURUH PROSES WEB DI PORT $Port BERHASIL DIHENTIKAN!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "[!] Peringatan: Masih ada koneksi menggantung di port $Port." -ForegroundColor Red
}

