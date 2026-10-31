# AUDIRA MOTION - Start Web Engine Script (Dedicated Port 3788)
# Author: Agus Dwi Rianto (AUDIRA)

$ErrorActionPreference = "SilentlyContinue"
$Port = 3788
$ProjectDir = Split-Path -Parent $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   🎬 AUDIRA MOTION - WEB LAUNCHER (PORT $Port)" -ForegroundColor Yellow
Write-Host "   BanterReels-Caliber Motion Generator SaaS" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $ProjectDir

# 1. Check if port 3788 is already in use
$existing = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "[!] Port $Port sudah digunakan oleh Process ID: $($existing.OwningProcess)" -ForegroundColor Yellow
    Write-Host "[*] Menghentikan instans lama terlebih dahulu..." -ForegroundColor DarkGray
    & "$PSScriptRoot\stop_web.ps1"
    Start-Sleep -Seconds 1
}

# 2. Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[!] node_modules belum ada. Menjalankan pnpm install..." -ForegroundColor Yellow
    pnpm install
}

# 3. Determine start mode (production start if .next exists, else dev)
$useProd = Test-Path ".next"
$nextBin = Join-Path $ProjectDir "node_modules\.bin\next.cmd"
$startCmd = if (Test-Path $nextBin) {
    if ($useProd) { "`"$nextBin`" start -p $Port" } else { "`"$nextBin`" dev -p $Port" }
} else {
    if ($useProd) { "pnpm start" } else { "pnpm dev" }
}
$modeLabel = if ($useProd) { "Production Server" } else { "Development Server" }

Write-Host "[*] Menjalankan $modeLabel pada port $Port..." -ForegroundColor Cyan

# 4. Start process in a new window with title
$startProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
$startProcessInfo.FileName = "cmd.exe"
$startProcessInfo.Arguments = "/k title AUDIRA-MOTION-PORT-$Port && $startCmd"
$startProcessInfo.WorkingDirectory = $ProjectDir
$startProcessInfo.UseShellExecute = $true

$process = [System.Diagnostics.Process]::Start($startProcessInfo)

# 5. Wait and Health Check
Write-Host "[*] Menunggu server siap..." -NoNewline
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Milliseconds 800
    Write-Host "." -NoNewline
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $ready = $true
        break
    }
}
Write-Host ""

if ($ready) {
    $url = "http://localhost:$Port/studio"
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "   [V] AUDIRA MOTION BERHASIL DIAKTIFKAN!" -ForegroundColor Green
    Write-Host "   URL Studio:  $url" -ForegroundColor Cyan
    Write-Host "   URL Beranda: http://localhost:$Port" -ForegroundColor White
    Write-Host "   Port Aktif:  $Port" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "[*] Membuka browser ke $url..." -ForegroundColor DarkGray
    Start-Process $url
} else {
    Write-Host "[!] Server membutuhkan waktu lebih lama untuk warm-up." -ForegroundColor Yellow
    Write-Host "    Silakan buka manual: http://localhost:$Port/studio" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Untuk menghentikan web, jalankan stop_web.bat" -ForegroundColor Gray

