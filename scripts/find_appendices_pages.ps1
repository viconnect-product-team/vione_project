$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

$terms = [ordered]@{
    "app1" = "Cơ Sở Dữ Liệu PostgreSQL";
    "app2" = "23 PHÂN HỆ";
    "app3" = "20 PHÂN HỆ MOCKUP";
    "app4" = "apps/vione_app_be/src/auth/auth.service.ts"
}

foreach ($k in $terms.Keys) {
    $term = $terms[$k]
    $rng = $doc.Content
    $find = $rng.Find
    $find.Text = $term
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $pNum = $rng.Information(3)
        Write-Host "$k ($term) -> Page $pNum"
    } else {
        Write-Host "NOT FOUND: $k ($term)"
    }
}

# Also find where each of the 23 CRM modules in Phụ lục II starts
for ($i = 1; $i -le 23; $i++) {
    $term = "crm_$i.png"
    # Actually let's search for "Hình 2.$i –"
    # Or in Phụ lục II, caption is "Hình 2.$i –"
    $rng = $doc.Content
    $find = $rng.Find
    $find.Text = "Hình 2.$i"
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $pNum = $rng.Information(3)
        Write-Host "app2_crm_$i -> Page $pNum"
    }
}

# And for the 20 Mobile modules in Phụ lục III
for ($i = 1; $i -le 20; $i++) {
    $rng = $doc.Content
    $find = $rng.Find
    $find.Text = "Hình 3.$i –"
    $find.Forward = $true
    $find.Wrap = 0
    if ($find.Execute()) {
        $pNum = $rng.Information(3)
        Write-Host "app3_mob_$i -> Page $pNum"
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

