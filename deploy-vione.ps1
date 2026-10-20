param (
    [switch]$SkipBuild,
    [switch]$SkipWebBuild,
    [switch]$FrontendOnly,
    [switch]$BackendOnly,
    [switch]$InstallDeps,
    [switch]$EnableHttps = $true,
    [switch]$NoHttps
)

if ($NoHttps) { $EnableHttps = $false }

# Thiet lap ma hoa UTF-8 cho console de khong bi loi font tieng Viet tren PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null

# =========================================================================
# LỆNH ĐỘC LẬP: TRIỂN KHAI VIONE APP LÊN SERVER DEV (PORT 5445)
# TÁCH BIỆT HOÀN TOÀN KHỎI HỆ THỐNG WEB CRM QUẢN TRỊ
# =========================================================================

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ">>> BẮT ĐẦU TRIỂN KHAI VIONE APP LÊN SERVER DEV (PORT 5445) <<<" -ForegroundColor Magenta
Write-Host "=================================================================" -ForegroundColor Magenta

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps
$bound["TargetEnv"] = "dev"

# 1. Gọi trực tiếp bộ deploy của ViOne App lên server dev
& "$PSScriptRoot/deploy/vione/fast-deploy.ps1" @bound

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host "TRIỂN KHAI VIONE APP LÊN SERVER DEV THÀNH CÔNG!" -ForegroundColor Green
Write-Host "1. ViOne App Dev (HTTPS)      : https://dev-vione.14-225-217-232.sslip.io:5445 (hoặc https://14.225.217.232:5445)" -ForegroundColor Yellow
Write-Host "   -> Tuyến đường chính       : /connect-app" -ForegroundColor Yellow
Write-Host "2. ViOne App Dev (HTTP)       : http://14.225.217.232:5010" -ForegroundColor DarkGray
Write-Host "3. ViOne Backend API Dev      : http://14.225.217.232:5011" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "GHI CHÚ QUY TRÌNH DEPLOY:" -ForegroundColor Cyan
Write-Host "• Chạy .\deploy-vione.ps1    : Triển khai nhanh trực tiếp lên Server DEV (port 5445)." -ForegroundColor White
Write-Host "• Push code lên Git (main)   : GitHub Actions tự động cập nhật giao diện mới cho PWA Subdomain (https://vione.viconnect.vn/)." -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Green
