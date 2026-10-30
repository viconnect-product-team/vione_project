const fs = require('fs');
const JSZip = require('jszip');

async function extractAllHeadings() {
  const filePath = 'D:/download/VICONNECT/CEO_VIONE_PROJECT/Trình bày tác phẩm Uniwork.docx';
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');

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
      .map(t => t.replace(/<[^>]+>/g, ''))
      .join('')
      .trim();

    if (!fullText) continue;

    if (style.startsWith('Heading') || style.startsWith('heading') || style.startsWith('Title') || style.startsWith('TOC')) {
      outline.push({ style, text: fullText });
    }
  }

  console.log(`Total headings extracted: ${outline.length}`);
  fs.writeFileSync('scripts/uniwork_new_outline.json', JSON.stringify(outline, null, 2), 'utf8');
  console.log('Saved to scripts/uniwork_new_outline.json');
}

extractAllHeadings().catch(console.error);

