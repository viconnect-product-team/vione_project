$f = Get-Item -LiteralPath "C:\Users\vumik\Downloads\[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx"
Write-Host "Downloads file size: $($f.Length) bytes"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($f.FullName)
$pages = $doc.ComputeStatistics(2)
Write-Host "Downloads DOCX PAGES: $pages"
$doc.Close([ref]0)
$word.Quit()

