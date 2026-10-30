const fs = require('fs');
const path = require('path');
const xmlPath = path.join(__dirname, 'uniwork_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let match;
while ((match = pRegex.exec(xml)) !== null) {
  const pContent = match[1];
  const styleMatch = pContent.match(/<w:pStyle\s+w:val="([^"]+)"/);
  const style = styleMatch ? styleMatch[1] : '';
  const textMatches = pContent.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g);
  if (!textMatches) continue;
  const fullText = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
  if (style.includes('Heading1') || style.includes('heading 1')) {
    console.log(`[${style}] (pos: ${match.index}) ${fullText}`);
  }
}

