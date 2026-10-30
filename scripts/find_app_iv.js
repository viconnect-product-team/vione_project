const fs = require('fs');

const xml = fs.readFileSync('scripts/uniwork_extracted/word/document.xml', 'utf-8');

// Find all occurrences of PHỤ LỤC IV
let pos = 0;
while ((pos = xml.indexOf('PHỤ LỤC IV', pos)) !== -1) {
  console.log('Found PHỤ LỤC IV at pos:', pos);
  console.log(xml.substring(pos, pos + 400));
  pos += 10;
}

