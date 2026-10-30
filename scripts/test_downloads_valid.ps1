$f = Get-ChildItem "C:\Users\vumik\Downloads" -Filter "*[VIONE] 06. Tr*" | Select-Object -First 1
Write-Host "Found file in Downloads: $($f.FullName) ($($f.Length) bytes)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)
$pages = $doc.ComputeStatistics(2)
Write-Host "DOCX IN DOWNLOADS - TOTAL PAGES: $pages"
$doc.Close([ref]0)
$word.Quit()

