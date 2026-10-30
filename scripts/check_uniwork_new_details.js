const fs = require('fs');
const JSZip = require('jszip');

async function checkDocDetails() {
  const filePath = 'D:/download/VICONNECT/CEO_VIONE_PROJECT/Trình bày tác phẩm Uniwork.docx';
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');

  const pl4Idx = xml.indexOf('PHỤ LỤC IV');
  console.log('PHỤ LỤC IV index:', pl4Idx);
  if (pl4Idx !== -1) {
    console.log('Snippet of PHỤ LỤC IV:', xml.substring(pl4Idx, pl4Idx + 500));
  } else {
    console.log('No PHỤ LỤC IV in Trình bày tác phẩm Uniwork.docx');
  }

  // Check Cover page of this document
  const first1000 = xml.substring(0, 2000);
  const textMatches = first1000.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  console.log('Cover text:');
  console.log(textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('\n'));
}

checkDocDetails().catch(console.error);

