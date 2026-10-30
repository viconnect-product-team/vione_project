$f = Get-ChildItem -Path "C:\Users\vumik\Downloads" -Filter "*VIONE*cop*.docx" | Select-Object -First 1
Write-Host "File found: $($f.FullName) - Size: $($f.Length)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)
Write-Host "WORD RESULT: SUCCESS! Document loaded without any XML/schema errors."
$pages = $doc.ComputeStatistics(2)
Write-Host "Page Count computed by Word: $pages pages"
$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()

