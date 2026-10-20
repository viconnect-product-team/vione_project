param (
    [ValidateSet("all", "vione", "crm")]
    [string]$Subdomain = "all",
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
# KỊCH BẢN CHUYÊN BIỆT: TRIỂN KHAI CHO CÁC SUB DOMAIN CHÍNH THỨC
# - Subdomain ViOne PWA : https://vione.viconnect.vn  (Cổng 80 & 443 SSL)
# - Subdomain ViOne CRM : https://crm.viconnect.vn    (Cổng 80 & 443 SSL)
# TÁCH BIỆT HOÀN TOÀN KHỎI MÔI TRƯỜNG DEV SERVER (Cổng 5445 & 5446)
# =========================================================================

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ">>> BẮT ĐẦU TRIỂN KHAI PHÂN TÁCH CHO CÁC SUB DOMAIN VIONE <<<" -ForegroundColor Magenta
Write-Host "Mục tiêu lựa chọn : $Subdomain (vione = PWA, crm = CRM Enterprise, all = Cả 2)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Magenta

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("Subdomain")
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps
$bound["TargetEnv"] = "prod"

$ROOT_DIR = $PSScriptRoot

if ($Subdomain -in @("vione", "all")) {
    Write-Host ""
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Yellow
    Write-Host ">>> [1/2] TRIỂN KHAI SUBDOMAIN PWA: https://vione.viconnect.vn <<<" -ForegroundColor Yellow
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Yellow
    & "$ROOT_DIR/deploy/vione/fast-deploy.ps1" @bound
}

if ($Subdomain -in @("crm", "all")) {
    Write-Host ""
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Cyan
    Write-Host ">>> [2/2] TRIỂN KHAI SUBDOMAIN CRM: https://crm.viconnect.vn <<<" -ForegroundColor Cyan
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Cyan
    & "$ROOT_DIR/deploy/crm/fast-deploy.ps1" @bound
}

if ($EnableHttps) {
    Write-Host ""
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Magenta
    Write-Host ">>> ĐỒNG BỘ HẠ TẦNG NGINX SSL CHO CẢ 2 SUBDOMAIN TRÊN CỔNG 80/443 <<<" -ForegroundColor Magenta
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Magenta
    & "$ROOT_DIR/deploy/ssl/deploy-ssl.ps1"
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "TRIỂN KHAI HOÀN TẤT CHO CÁC SUB DOMAIN VIONE CHÍNH THỨC!" -ForegroundColor Green
Write-Host "1. Subdomain ViOne PWA (HTTPS)   : https://vione.viconnect.vn" -ForegroundColor Yellow
Write-Host "   -> Tuyến đường chính          : /connect-app (hoặc /p/:identifier)" -ForegroundColor Yellow
Write-Host "2. Subdomain ViOne CRM (HTTPS)   : https://crm.viconnect.vn" -ForegroundColor Cyan
Write-Host "   -> Tuyến đường chính          : / (Quản trị doanh nghiệp & B2B)" -ForegroundColor Cyan
Write-Host "-----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "LƯU Ý PHÂN TÁCH MÔI TRƯỜNG:" -ForegroundColor White
Write-Host "• Muốn deploy lên SERVER DEV (port 5445/5446) : Chạy .\deploy-vione.ps1 hoặc .\deploy-crm.ps1" -ForegroundColor DarkYellow
Write-Host "• Muốn deploy lên SUB DOMAIN (port 80/443)    : Chạy .\deploy-subdomain.ps1 -Subdomain vione|crm|all" -ForegroundColor DarkYellow
Write-Host "=================================================================" -ForegroundColor Green
