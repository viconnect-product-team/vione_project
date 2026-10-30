$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

$items = [ordered]@{
    "sec1" = "1. M";
    "sec1_1" = "1.1 M";
    "sec1_2" = "1.2 Ph";
    "sec1_3" = "1.3 ";
    "sec2" = "2. Y";
    "sec2_1" = "2.1 K";
    "sec2_1_1" = "2.1.1";
    "sec2_1_2" = "2.1.2";
    "sec2_1_3" = "2.1.3";
    "sec2_2" = "2.2 C";
    "sec2_3" = "2.3 Y";
    "sec2_3_1" = "2.3.1";
    "sec2_3_2" = "2.3.2 C";
    "sec2_3_3" = "2.3.3 C";
    "sec2_4" = "2.4 C";
    "sec2_4_1" = "2.4.1";
    "sec2_4_2" = "2.4.2";
    "sec2_4_3" = "2.4.3";
    "app1" = "B?ng C?u Trc C? S? D? Li?u";
    "app2" = "C?NG WEB QU?N TR?";
    "app3" = "?NG D?NG DI ??NG";
    "app4" = "apps/vione_app_be/src/auth/auth.service.ts"
}

# 23 CRM in Phụ lục II
for ($i = 1; $i -le 23; $i++) {
    $items["app2_crm_$i"] = "Hnh 2.$i "
}
# 20 Mobile in Phụ lục III
for ($i = 1; $i -le 20; $i++) {
    $items["app3_mob_$i"] = "Hnh 3.$i "
}

$results = [ordered]@{}

foreach ($k in $items.Keys) {
    $rng = $doc.Range(10000, $doc.Content.End)
    $find = $rng.Find
    $find.Text = $items[$k]
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $p = $rng.Information(3)
        $results[$k] = $p
        Write-Host "$k -> Page $p"
    } else {
        # Fallback without diacritics
        $find.Text = ($items[$k] -replace '[^a-zA-Z0-9\.\s/]', '?')
        $find.MatchWildcards = $true
        if ($find.Execute()) {
            $p = $rng.Information(3)
            $results[$k] = $p
            Write-Host "$k (wildcard) -> Page $p"
        }
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

$results | ConvertTo-Json | Out-File -FilePath "scripts/exact_pages_clean.json" -Encoding UTF8
Write-Host "Done!"

