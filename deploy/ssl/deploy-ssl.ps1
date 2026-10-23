param (
    [string]$ServerIp = "14.225.217.232",
    [string]$ServerUser = "root",
    [string]$RemotePath = "~/vione-ssl-proxy"
)

$ErrorActionPreference = "Stop"
$DEPLOY_DIR = $PSScriptRoot

Write-Host "=================================================================" -ForegroundColor Magenta
Write-Host "TRIEN KHAI VIONE NGINX SSL PROXY DOC LAP LEN SERVER..." -ForegroundColor Magenta
Write-Host "=================================================================" -ForegroundColor Magenta

# 1. Tao thu muc tren server
Write-Host "`n[1/3] Tao thu muc $RemotePath tren may chu $ServerIp..." -ForegroundColor Cyan
ssh "${ServerUser}@${ServerIp}" "mkdir -p $RemotePath"

# 2. Dong bo cac tep tin cau hinh, chung chi SSL va kich ban thuc thi
Write-Host "`n[2/3] Dong bo cau hinh SSL cho ViOne App (5445) va ViOne CRM (5446)..." -ForegroundColor Cyan
$files = @(
    (Resolve-Path "$DEPLOY_DIR/nginx.conf").Path,
    (Resolve-Path "$DEPLOY_DIR/server.crt").Path,
    (Resolve-Path "$DEPLOY_DIR/server.key").Path,
    (Resolve-Path "$DEPLOY_DIR/docker-compose.ssl.yml").Path,
    (Resolve-Path "$DEPLOY_DIR/setup-ssl.sh").Path
)
$scpArgs = $files + "${ServerUser}@${ServerIp}:${RemotePath}/"
scp @scpArgs

# 3. Kich hoat Nginx SSL proxy va mo firewall cong 5445, 5446 qua SSH
Write-Host "`n[3/3] Kich hoat vione-ssl-proxy va mo tuong lua cong 5445, 5446..." -ForegroundColor Cyan
$cmd = 'sed -i "s/\r$//" ~/vione-ssl-proxy/setup-ssl.sh; bash ~/vione-ssl-proxy/setup-ssl.sh'
ssh "${ServerUser}@${ServerIp}" $cmd

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host "KICH HOAT HTTPS DOC LAP CHO VIONE HOAN TAT!" -ForegroundColor Green
Write-Host "1. ViOne Connect App PWA (HTTPS) : https://${ServerIp}:5445 (Domain: https://dev-vione.14-225-217-232.sslip.io:5445)" -ForegroundColor Yellow
Write-Host "2. ViOne Enterprise CRM (HTTPS)  : https://${ServerIp}:5446 (Domain: https://dev-vione-crm.14-225-217-232.sslip.io:5446)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Green
