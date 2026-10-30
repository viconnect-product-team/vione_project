const fs = require('fs');
const outline = JSON.parse(fs.readFileSync('scripts/uniwork_new_outline.json', 'utf8'));

console.log('--- ALL HEADINGS IN NEW UNIWORK ---');
outline.forEach((h, idx) => {
  console.log(`${idx + 1}. [${h.style}] ${h.text}`);
});

