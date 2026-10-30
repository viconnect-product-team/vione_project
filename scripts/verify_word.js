// scripts/verify_word.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const targetFile = process.argv[2] || 'scratch/test_land.docx';
const absPath = path.resolve(targetFile);

console.log('Testing file:', absPath);

const psFile = path.join(__dirname, '../scratch/check_tmp.ps1');
const psContent = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $file = [System.IO.Path]::GetFullPath('${absPath.replace(/'/g, "''")}')
  $doc = $word.Documents.Open($file)
  Write-Host "DOCX opened successfully!"
  Write-Host "Sections: $($doc.Sections.Count)"
  Write-Host "Pages: $($doc.ComputeStatistics(2))"
  $doc.Close([ref]$false)
} catch {
  Write-Host "Error: $($_.Exception.Message)"
} finally {
  $word.Quit()
}
`;

// Write with UTF-8 BOM for Windows PowerShell 5.1 compatibility
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const buf = Buffer.concat([bom, Buffer.from(psContent, 'utf-8')]);
fs.writeFileSync(psFile, buf);

try {
  const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psFile}"`, { encoding: 'utf-8' });
  console.log(out);
} catch (e) {
  console.error('Exec failed:', e.message);
}
