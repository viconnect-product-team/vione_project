const fs = require('fs');
const path = require('path');

const tempDir = process.env.TEMP || process.env.TMP;
const xmlPath = path.join(tempDir, 'uniwork_extracted', 'word', 'document.xml');

if (!fs.existsSync(xmlPath)) {
  console.error('File does not exist:', xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// Match paragraphs
const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let match;
const outline = [];

while ((match = pRegex.exec(xml)) !== null) {
  const pContent = match[1];
  const styleMatch = pContent.match(/<w:pStyle\s+w:val="([^"]+)"/);
  const style = styleMatch ? styleMatch[1] : '';

  const textMatches = pContent.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
  if (!textMatches) continue;

  const fullText = textMatches
    .map(t => t.replace(/<w:t\b[^>]*>/, '').replace(/<\/w:t>/, ''))
    .join('')
    .trim();

  if (!fullText) continue;

  if (
    style.toLowerCase().includes('heading') ||
    style.toLowerCase().includes('title') ||
    style.toLowerCase().includes('toc') ||
    /^(phần|chương|mục|[0-9]+\.|\b[ivxlcdm]+\.)/i.test(fullText)
  ) {
    outline.push({ style, text: fullText });
  }
}

console.log('Total outline items:', outline.length);
outline.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.style}] ${item.text}`);
});

