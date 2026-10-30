const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { loadAllCodeFiles } = require('./content_vione_code_loader');

async function test() {
  console.log('Testing code loader...');
  const files = loadAllCodeFiles();
  console.log(`Loaded ${files.length} code files.`);
  let totalLines = 0;
  files.forEach(f => {
    totalLines += f.linesCount;
    console.log(` - Tệp ${f.order}: ${f.path} (${f.linesCount} dòng)`);
  });
  console.log(`Total lines: ${totalLines}`);
}

test();

