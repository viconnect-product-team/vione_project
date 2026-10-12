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

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host ">>> TRIEN KHAI DOC LAP: VIONE ENTERPRISE CRM PLATFORM (PORT 5446) <<<" -ForegroundColor Magenta
Write-Host "=================================================================" -ForegroundColor Magenta

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps

# Goi bo deploy rieng cua ViOne CRM
& "$PSScriptRoot/deploy/crm/fast-deploy.ps1" @bound

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host "TRIEN KHAI VIONE ENTERPRISE CRM THANH CONG!" -ForegroundColor Green
Write-Host "1. Web CRM Quan tri Dang Hoat Dong (PORT 5443):" -ForegroundColor Green
Write-Host "   -> URL truc tiep (HTTPS)      : https://14.225.217.232:5443" -ForegroundColor Yellow
Write-Host "   -> Mien sslip.io (PWA/SSL)    : https://dev-crm.14-225-217-232.sslip.io:5443" -ForegroundColor Yellow
Write-Host "2. ViOne Connect App & CRM Portal (PORT 5445):" -ForegroundColor Cyan
Write-Host "   -> ViOne Connect App (HTTPS)  : https://14.225.217.232:5445" -ForegroundColor Cyan
Write-Host "   -> ViOne CRM Portal (HTTPS)   : https://14.225.217.232:5445/?portal=crm" -ForegroundColor Cyan
Write-Host "3. ViOne Standalone CRM (PORT 5446):" -ForegroundColor Magenta
Write-Host "   -> URL truc tiep (HTTPS)      : https://14.225.217.232:5446" -ForegroundColor Magenta
Write-Host "   -> Mien sslip.io              : https://dev-vione-crm.14-225-217-232.sslip.io:5446" -ForegroundColor Magenta
Write-Host "   [Luu y]: Neu cong 5446 bi ERR_CONNECTION_REFUSED, hay mo Port 5446 (TCP Inbound)" -ForegroundColor DarkYellow
Write-Host "            tren Viettel Cloud Console -> Security Group. Trong khi cho mo, hay dung cong 5443 hoac 5445." -ForegroundColor DarkYellow
Write-Host "=================================================================" -ForegroundColor Green
