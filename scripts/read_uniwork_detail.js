const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'uniwork_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let match;
let capturing = false;
let capturedLines = [];

while ((match = pRegex.exec(xml)) !== null) {
  const pContent = match[1];
  const styleMatch = pContent.match(/<w:pStyle\s+w:val="([^"]+)"/);
  const style = styleMatch ? styleMatch[1] : '';

  if (style.startsWith('TOC') || style.startsWith('toc')) continue;

  const textMatches = pContent.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
  if (!textMatches) continue;

  const fullText = textMatches
    .map(t => t.replace(/<w:t\b[^>]*>/, '').replace(/<\/w:t>/, ''))
    .join('')
    .trim();

  if (!fullText) continue;

  if (fullText.includes('2.3.2') && fullText.includes('Chức năng chi tiết')) {
    capturing = true;
  }
  if (fullText.includes('2.4') && fullText.includes('Các yêu cầu phi chức năng')) {
    if (capturing) {
      capturedLines.push(`[END AT: ${fullText}]`);
      break;
    }
  }

  if (capturing) {
    capturedLines.push(`[${style}] ${fullText}`);
  }
}

console.log(`Captured ${capturedLines.length} lines from 2.3.2 in UNIWORK:`);
console.log(capturedLines.slice(0, 100).join('\n'));
if (capturedLines.length > 100) {
  console.log('\n--- NEXT 100 ---');
  console.log(capturedLines.slice(100, 200).join('\n'));
}
