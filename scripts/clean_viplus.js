const fs = require('fs');

const files = [
  'scripts/content_vione_section1_2.js',
  'scripts/content_vione_crm.js',
  'scripts/content_vione_mobile.js',
  'scripts/content_vione_code_loader.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  content = content.replace(/Ứng dụng Di động ViPlus/g, 'Ứng dụng Di động ViOne');
  content = content.replace(/App ViPlus/g, 'App ViOne');
  content = content.replace(/ứng dụng di động ViPlus/g, 'ứng dụng di động ViOne');
  content = content.replace(/ViPlus Mobile/g, 'ViOne Mobile');
  content = content.replace(/VIPLUS/g, 'VIONE');
  content = content.replace(/ViPlus/g, 'ViOne');
  content = content.replace(/viplus/g, 'vione');
  fs.writeFileSync(f, content, 'utf-8');
  console.log(`Updated ${f}`);
});

