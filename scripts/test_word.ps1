try {
  $path = Resolve-Path "document\[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx"
  $file = Get-Item -LiteralPath $path
  Write-Host "Found file: $($file.FullName) ($($file.Length) bytes)"
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $doc = $word.Documents.Open($file.FullName)
  Write-Host "SUCCESS: Microsoft Word opened cleanly!"
  $pages = $doc.ComputeStatistics(2)
  $words = $doc.ComputeStatistics(0)
  Write-Host "Total Pages: $pages, Total Words: $words"
  $doc.Close([ref]0)
  $word.Quit()
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
}
