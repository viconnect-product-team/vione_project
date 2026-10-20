param (
    [ValidateSet("all", "vione", "crm", "subdomain")]
    [string]$Target = "all",
    [switch]$SkipBuild,
    [switch]$SkipWebBuild,
    [switch]$FrontendOnly,
    [switch]$BackendOnly,
    [switch]$InstallDeps,
    [switch]$EnableHttps = $true,
    [switch]$NoHttps
)

if ($NoHttps) { $EnableHttps = $false }

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null

# =========================================================================
# Kịch bản triển khai nhanh linh hoạt (ViOne Monorepo Fast Deploy)
# - Triển khai ViOne App Dev (Port 5445): .\fast-deploy.ps1 -Target vione
# - Triển khai ViOne CRM Dev (Port 5446): .\fast-deploy.ps1 -Target crm
# - Triển khai Cả 2 Server Dev:          .\fast-deploy.ps1 -Target all
# - Triển khai Subdomain Production:     .\fast-deploy.ps1 -Target subdomain
# =========================================================================

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("Target")
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps

if ($Target -eq "subdomain") {
    & "$PSScriptRoot/deploy-subdomain.ps1" @bound
} elseif ($Target -eq "vione") {
    & "$PSScriptRoot/deploy/vione/fast-deploy.ps1" @bound
    if ($EnableHttps) { & "$PSScriptRoot/deploy/ssl/deploy-ssl.ps1" }
} elseif ($Target -eq "crm") {
    & "$PSScriptRoot/deploy/crm/fast-deploy.ps1" @bound
    if ($EnableHttps) { & "$PSScriptRoot/deploy/ssl/deploy-ssl.ps1" }
} else {
    Write-Host '=================================================================' -ForegroundColor Magenta
    Write-Host '[BƯỚC 1/2] BẮT ĐẦU TRIỂN KHAI VIONE APP (PORT 5445/5010)...' -ForegroundColor Magenta
    Write-Host '=================================================================' -ForegroundColor Magenta
    & "$PSScriptRoot/deploy/vione/fast-deploy.ps1" @bound

    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Magenta
    Write-Host '[BƯỚC 2/2] BẮT ĐẦU TRIỂN KHAI VIONE CRM ENTERPRISE (PORT 5446/5006)...' -ForegroundColor Magenta
    Write-Host '=================================================================' -ForegroundColor Magenta
    & "$PSScriptRoot/deploy/crm/fast-deploy.ps1" @bound

    if ($EnableHttps) {
        Write-Host ""
        Write-Host "=================================================================" -ForegroundColor Magenta
        Write-Host '[BƯỚC BỔ SUNG] ĐỒNG BỘ NGINX REVERSE PROXY HTTPS / SSL TOÀN DIỆN...' -ForegroundColor Magenta
        Write-Host '=================================================================' -ForegroundColor Magenta
        & "$PSScriptRoot/deploy/ssl/deploy-ssl.ps1"
    }

    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host 'HOÀN TẤT TRIỂN KHAI TOÀN DIỆN CẢ 2 PHÂN HỆ VIONE LÊN SERVER DEV THÀNH CÔNG!' -ForegroundColor Green
    Write-Host '1. ViOne Connect App (HTTPS)    : https://dev-vione.14-225-217-232.sslip.io:5445 (hoặc :5445)' -ForegroundColor Yellow
    Write-Host '2. ViOne Enterprise CRM (HTTPS) : https://dev-vione-crm.14-225-217-232.sslip.io:5446 (hoặc :5446)' -ForegroundColor Yellow
    Write-Host '3. Subdomain PWA Chính thức     : https://vione.viconnect.vn' -ForegroundColor Cyan
    Write-Host '4. Subdomain CRM Chính thức     : https://crm.viconnect.vn' -ForegroundColor Cyan
    Write-Host '=================================================================' -ForegroundColor Green
}
