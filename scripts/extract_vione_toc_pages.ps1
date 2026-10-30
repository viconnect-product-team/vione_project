$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
Write-Host "Opening: $($f.FullName)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

$results = [ordered]@{}

for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
    $p = $doc.Paragraphs.Item($i)
    $t = $p.Range.Text.Trim()
    if ($t.Length -gt 2) {
        # Check standard sections
        if ($t -match '^1\.\s+M' -and -not $results['sec1']) { $results['sec1'] = $p.Range.Information(3) }
        if ($t -match '^1\.1\s+' -and -not $results['sec1_1']) { $results['sec1_1'] = $p.Range.Information(3) }
        if ($t -match '^1\.2\s+' -and -not $results['sec1_2']) { $results['sec1_2'] = $p.Range.Information(3) }
        if ($t -match '^1\.3\s+' -and -not $results['sec1_3']) { $results['sec1_3'] = $p.Range.Information(3) }
        if ($t -match '^2\.\s+Y' -and -not $results['sec2']) { $results['sec2'] = $p.Range.Information(3) }
        if ($t -match '^2\.1\s+K' -and -not $results['sec2_1']) { $results['sec2_1'] = $p.Range.Information(3) }
        if ($t -match '^2\.1\.1\s+' -and -not $results['sec2_1_1']) { $results['sec2_1_1'] = $p.Range.Information(3) }
        if ($t -match '^2\.1\.2\s+' -and -not $results['sec2_1_2']) { $results['sec2_1_2'] = $p.Range.Information(3) }
        if ($t -match '^2\.1\.3\s+' -and -not $results['sec2_1_3']) { $results['sec2_1_3'] = $p.Range.Information(3) }
        if ($t -match '^2\.2\s+C' -and -not $results['sec2_2']) { $results['sec2_2'] = $p.Range.Information(3) }
        if ($t -match '^2\.3\s+Y' -and -not $results['sec2_3']) { $results['sec2_3'] = $p.Range.Information(3) }
        if ($t -match '^2\.3\.1\s+' -and -not $results['sec2_3_1']) { $results['sec2_3_1'] = $p.Range.Information(3) }
        if ($t -match '^2\.3\.2\s+' -and -not $results['sec2_3_2']) { $results['sec2_3_2'] = $p.Range.Information(3) }
        if ($t -match '^2\.3\.3\s+' -and -not $results['sec2_3_3']) { $results['sec2_3_3'] = $p.Range.Information(3) }
        if ($t -match '^2\.4\s+C' -and -not $results['sec2_4']) { $results['sec2_4'] = $p.Range.Information(3) }
        if ($t -match '^2\.4\.1\s+' -and -not $results['sec2_4_1']) { $results['sec2_4_1'] = $p.Range.Information(3) }
        if ($t -match '^2\.4\.2\s+' -and -not $results['sec2_4_2']) { $results['sec2_4_2'] = $p.Range.Information(3) }
        if ($t -match '^2\.4\.3\s+' -and -not $results['sec2_4_3']) { $results['sec2_4_3'] = $p.Range.Information(3) }

        # CRM modules 2.3.2.1 -> 2.3.2.23
        for ($c = 1; $c -le 23; $c++) {
            $key = "crm_$c"
            $regex = "^2\.3\.2\.$c\b"
            if ($t -match $regex -and -not $results[$key]) {
                $results[$key] = $p.Range.Information(3)
            }
        }

        # Mobile modules 2.3.3.1 -> 2.3.3.20
        for ($m = 1; $m -le 20; $m++) {
            $key = "mob_$m"
            $regex = "^2\.3\.3\.$m\b"
            if ($t -match $regex -and -not $results[$key]) {
                $results[$key] = $p.Range.Information(3)
            }
        }

        # Appendices
        if ($t -match '^PH.*L.*C I\b' -and -not $results['app1']) { $results['app1'] = $p.Range.Information(3) }
        if ($t -match '^PH.*L.*C II\b' -and -not $results['app2']) { $results['app2'] = $p.Range.Information(3) }
        if ($t -match '^PH.*L.*C III\b' -and -not $results['app3']) { $results['app3'] = $p.Range.Information(3) }
        if ($t -match '^PH.*L.*C IV\b' -and -not $results['app4']) { $results['app4'] = $p.Range.Information(3) }
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

$results.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key): $($_.Value)" }

$json = $results | ConvertTo-Json
[System.IO.File]::WriteAllText("scripts/exact_pages.json", $json)
Write-Host "Done! Saved to scripts/exact_pages.json"
