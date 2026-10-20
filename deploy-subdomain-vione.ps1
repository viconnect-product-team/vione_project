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

# =========================================================================
# LỆNH ĐỘC LẬP: TRIỂN KHAI TRỰC TIẾP SUBDOMAIN VIONE PWA
# URL: https://vione.viconnect.vn (Cổng 80 & 443 SSL)
# =========================================================================

$bound = [System.Collections.Generic.Dictionary[string, object]]::new($PSBoundParameters)
[void]$bound.Remove("NoHttps")
$bound["EnableHttps"] = $EnableHttps
$bound["Subdomain"] = "vione"

& "$PSScriptRoot/deploy-subdomain.ps1" @bound
