$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
Write-Host "Opening: $($f.FullName)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

$keys = [ordered]@{}
$keys["sec1"] = "1. M"
$keys["sec1_1"] = "1.1 M"
$keys["sec1_2"] = "1.2 Ph"
$keys["sec1_3"] = "1.3 "
$keys["sec2"] = "2. Y"
$keys["sec2_1"] = "2.1 K"
$keys["sec2_1_1"] = "2.1.1"
$keys["sec2_1_2"] = "2.1.2"
$keys["sec2_1_3"] = "2.1.3"
$keys["sec2_2"] = "2.2 C"
$keys["sec2_3"] = "2.3 Y"
$keys["sec2_3_1"] = "2.3.1"
$keys["sec2_3_2"] = "2.3.2 C"
$keys["sec2_3_3"] = "2.3.3 C"
$keys["sec2_4"] = "2.4 C"
$keys["sec2_4_1"] = "2.4.1"
$keys["sec2_4_2"] = "2.4.2"
$keys["sec2_4_3"] = "2.4.3"

for ($i = 1; $i -le 23; $i++) {
    $keys["crm_$i"] = "2.3.2.$i."
}
for ($i = 1; $i -le 20; $i++) {
    $keys["mob_$i"] = "2.3.3.$i."
}

$keys["app1"] = "LUC I -"
$keys["app2"] = "LUC II"
$keys["app3"] = "LUC III"
$keys["app4"] = "LUC IV"

$results = [ordered]@{}

foreach ($k in $keys.Keys) {
    $findText = $keys[$k]
    $rng = $doc.Content
    $find = $rng.Find
    $find.Text = $findText
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $pNum = $rng.Information(3)
        $results[$k] = $pNum
        Write-Host "$k ($findText) -> Page $pNum"
    } else {
        Write-Host "NOT FOUND: $k ($findText)"
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

$json = $results | ConvertTo-Json
[System.IO.File]::WriteAllText("scripts/exact_pages.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Completed! Saved to scripts/exact_pages.json"
