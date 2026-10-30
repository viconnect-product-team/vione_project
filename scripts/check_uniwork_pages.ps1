$item = Get-ChildItem -Path "D:\download\VICONNECT\CEO_VIONE_PROJECT" -Filter "*Uniwork*.docx" | Select-Object -First 1
Write-Host "Found file: $($item.FullName)"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($item.FullName)
$pages = $doc.ComputeStatistics(2)
Write-Host "Page Count: $pages pages"
$saveChanges = 0
$doc.Close([ref]$saveChanges)
$word.Quit()
