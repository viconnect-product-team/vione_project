const fs = require('fs');
const JSZip = require('jszip');

(async () => {
  const baseDocx = fs.readFileSync('scratch/docx_9aff451.docx');
  const zip = await JSZip.loadAsync(baseDocx);

  const portraitSect = '<w:pPr><w:sectPr><w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417"/></w:sectPr></w:pPr>';
  const landscapeSect = '<w:pPr><w:sectPr><w:type w:val="nextPage"/><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:pPr>';

  let body = '';
  body += '<w:p><w:r><w:t>Trang 1: Portrait Text</w:t></w:r></w:p>';
  body += `<w:p>${portraitSect}<w:r><w:t>Trang 1 End</w:t></w:r></w:p>`;
  body += '<w:p><w:r><w:t>Trang 2: Landscape Diagram Here</w:t></w:r></w:p>';
  body += `<w:p>${landscapeSect}<w:r><w:t>Trang 2 End Landscape</w:t></w:r></w:p>`;
  body += '<w:p><w:r><w:t>Trang 3: Back to Portrait Text</w:t></w:r></w:p>';

  const finalXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417"/></w:sectPr></w:body></w:document>`;
  
  zip.file('word/document.xml', finalXml);
  const outBuf = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('scratch/test_land.docx', outBuf);
  console.log('Saved scratch/test_land.docx');
})();

