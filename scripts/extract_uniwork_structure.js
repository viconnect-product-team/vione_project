const fs = require('fs');

const xml = fs.readFileSync('scripts/uniwork_extracted/word/document.xml', 'utf-8');
const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let match;
const structure = [];

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

  if (style.startsWith('Heading') || fullText.startsWith('PHỤ LỤC') || fullText.startsWith('Phụ lục')) {
    structure.push({ style, text: fullText });
  }
}

fs.writeFileSync('scripts/uniwork_full_structure.json', JSON.stringify(structure, null, 2), 'utf-8');
console.log('Structure extracted, count:', structure.length);
structure.forEach((s, i) => console.log(`${i+1}. [${s.style}] ${s.text}`));

