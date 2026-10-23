param (
    [ValidateSet("subdomain-vione", "subdomain-crm", "subdomain-all", "dev-vione", "dev-crm", "dev-all", "all", "vione", "crm", "mobile-apk", "mobile-ipa", "apk", "ipa")]
    [string]$Target = "subdomain-vione",
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
# VIONE MASTER DEPLOYMENT HUB (ĐIỀU PHỐI TRIỂN KHAI TOÀN DIỆN)
# Phân tách rõ ràng giữa MÔI TRƯỜNG DEV (Port 5445/5446) và SUB DOMAIN (Port 80/443)
# Đóng gói Mobile Native riêng (deploy/mobile)
# =========================================================================

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ">>> VIONE MASTER DEPLOYMENT HUB <<<" -ForegroundColor Magenta
Write-Host "Mục tiêu lựa chọn : $Target" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Magenta

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("Target")
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps

switch ($Target) {
    { $_ -in @("subdomain-vione", "vione") } {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Subdomain PWA (https://vione.viconnect.vn)..." -ForegroundColor Yellow
        $bound["Subdomain"] = "vione"
        & "$PSScriptRoot/deploy-subdomain.ps1" @bound
    }
    { $_ -in @("subdomain-crm") } {
        Write-Host ">>> ĐIỀU PHỐI: ViOne CRM chưa khai báo Subdomain chính thức. Tự động điều hướng sang Server Dev (Port 5446)..." -ForegroundColor Cyan
        & "$PSScriptRoot/deploy-crm.ps1" @bound
    }
    "subdomain-all" {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Cả 2 Subdomain (vione & crm)..." -ForegroundColor Magenta
        $bound["Subdomain"] = "all"
        & "$PSScriptRoot/deploy-subdomain.ps1" @bound
    }
    "dev-vione" {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Server DEV ViOne App (Port 5445)..." -ForegroundColor Yellow
        & "$PSScriptRoot/deploy-vione.ps1" @bound
    }
    { $_ -in @("dev-crm", "crm") } {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Server DEV ViOne CRM (Port 5446)..." -ForegroundColor Cyan
        & "$PSScriptRoot/deploy-crm.ps1" @bound
    }
    "dev-all" {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Toàn Bộ Server DEV (Port 5445 & 5446)..." -ForegroundColor Magenta
        & "$PSScriptRoot/deploy-vione.ps1" @bound
        & "$PSScriptRoot/deploy-crm.ps1" @bound
    }
    { $_ -in @("mobile-apk", "apk") } {
        Write-Host ">>> ĐIỀU PHỐI: Biên dịch Android APK (deploy/mobile/build-apk.ps1)..." -ForegroundColor Cyan
        & "$PSScriptRoot/deploy/mobile/build-apk.ps1"
    }
    { $_ -in @("mobile-ipa", "ipa") } {
        Write-Host ">>> ĐIỀU PHỐI: Biên dịch iOS IPA (deploy/mobile/build-ipa.ps1)..." -ForegroundColor Cyan
        & "$PSScriptRoot/deploy/mobile/build-ipa.ps1"
    }
    "all" {
        Write-Host ">>> ĐIỀU PHỐI: Triển khai Toàn Diện (Cả Subdomain lẫn Server Dev)..." -ForegroundColor Magenta
        $bound["Subdomain"] = "all"
        & "$PSScriptRoot/deploy-subdomain.ps1" @bound
        & "$PSScriptRoot/deploy-vione.ps1" @bound
        & "$PSScriptRoot/deploy-crm.ps1" @bound
    }
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "DANH SÁCH LỆNH TRIỂN KHAI PHÂN TÁCH SẴN CÓ:" -ForegroundColor Cyan
Write-Host "1. Subdomain PWA (https://vione.viconnect.vn) : .\deploy-subdomain-vione.ps1 (hoặc .\deploy.ps1 -Target subdomain-vione)" -ForegroundColor Yellow
Write-Host "2. Server DEV ViOne App (cổng 5445)          : .\deploy-vione.ps1" -ForegroundColor Yellow
Write-Host "3. Server DEV ViOne CRM (cổng 5446)          : .\deploy-crm.ps1" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Green
