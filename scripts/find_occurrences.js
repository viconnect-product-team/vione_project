const fs = require('fs');
const JSZip = require('jszip');

async function findOccurrences() {
  const filePath = 'D:/download/VICONNECT/CEO_VIONE_PROJECT/Trình bày tác phẩm Uniwork.docx';
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');

  ['1. Giới thiệu', '2. Yêu cầu kỹ thuật', 'PHỤ LỤC I', 'PHỤ LỤC II', 'PHỤ LỤC III'].forEach(term => {
    let pos = 0;
    console.log(`\n=== Occurrences of "${term}" ===`);
    while (true) {
      const idx = xml.indexOf(term, pos);
      if (idx === -1) break;
      const snippet = xml.substring(Math.max(0, idx - 50), Math.min(xml.length, idx + 100)).replace(/<[^>]+>/g, ' ');
      console.log(`Pos ${idx}: ${snippet.trim()}`);
      pos = idx + term.length + 1;
    }
  });
}

findOccurrences().catch(console.error);

