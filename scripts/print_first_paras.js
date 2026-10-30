const fs = require('fs');
const JSZip = require('jszip');

async function printFirstParas() {
  const filePath = 'D:/download/VICONNECT/CEO_VIONE_PROJECT/Trình bày tác phẩm Uniwork.docx';
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');

  const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let match;
  let count = 0;
  while ((match = pRegex.exec(xml)) !== null && count < 60) {
    const textMatches = match[1].match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const text = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
    if (text) {
      console.log(`${++count}. ${text}`);
    }
  }
}

printFirstParas().catch(console.error);

