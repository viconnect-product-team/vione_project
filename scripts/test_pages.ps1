$f = Get-ChildItem document -Filter "*06. Tr*" | Select-Object -First 1
Write-Host "Found file: $($f.FullName)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)
$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)
Write-Host "PAGES: $pages"
Write-Host "WORDS: $words"
$doc.Close([ref]0)
$word.Quit()

