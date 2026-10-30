$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

$terms = [ordered]@{
    "app4" = "apps/vione_app_be/src/auth/auth.service.ts";
    "app4_file_7" = "apps/vione_app_be/src/members/members.service.ts";
    "app4_file_11" = "apps/vione_app_fe/src/components/dashboard/ExecutiveDashboard.tsx";
    "app4_file_18" = "apps/mobile_vione/src/screens/platform/PlatformAppScreen.tsx"
}

foreach ($k in $terms.Keys) {
    $term = $terms[$k]
    $rng = $doc.Range(10000, $doc.Content.End)
    $find = $rng.Find
    $find.Text = $term
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $p = $rng.Information(3)
        Write-Host "$k -> Page $p"
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

