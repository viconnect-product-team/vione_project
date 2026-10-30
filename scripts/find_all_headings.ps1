$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)

Write-Host "Scanning headings..."
$headings = @()

# Table of Contents ends around character 6000
foreach ($p in $doc.Paragraphs) {
    if ($p.Range.Start -gt 7000) {
        $lvl = $p.OutlineLevel
        if ($lvl -ge 1 -and $lvl -le 4) {
            $t = $p.Range.Text.Trim()
            if ($t.Length -gt 2) {
                $pg = $p.Range.Information(3)
                $headings += [PSCustomObject]@{
                    Level = $lvl
                    Text = $t
                    Page = $pg
                }
            }
        }
    }
}

$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

Write-Host "Found $($headings.Count) headings!"
$headings | Select-Object -First 40 | Format-Table -AutoSize
$headings | Select-Object -Last 40 | Format-Table -AutoSize

$headings | Export-Clixml -Path "scripts/doc_headings.xml"

