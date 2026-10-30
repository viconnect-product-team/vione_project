const fs = require('fs');
const JSZip = require('jszip');

async function verifyGeneratedDocx() {
  const docxPath = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx';
  const buf = fs.readFileSync(docxPath);
  const zip = await JSZip.loadAsync(buf);

  const docXml = await zip.file('word/document.xml').async('string');
  console.log(`Document.xml length: ${docXml.length} characters`);

  // Check forbidden keywords
  const forbidden = [
    'Something went wrong',
    'vietqr',
    'Napas',
    'hệ sinh thái',
    '6 ban chuyên môn'
  ];

  forbidden.forEach(kw => {
    const regex = new RegExp(kw, 'gi');
    const matches = docXml.match(regex);
    if (matches) {
      console.warn(`[CẢNH BÁO] Tìm thấy từ cấm '${kw}': ${matches.length} lần`);
    } else {
      console.log(`[PASS] Không có từ cấm '${kw}'`);
    }
  });

  // Check required titles & terms
  const required = [
    'PHẦN MỀM VIONE PLATFORM– NỀN TẢNG ĐỊNH DANH SỐ, KẾT NỐI KINH DOANH, QUẢN TRỊ CỘNG ĐỒNG, SỰ KIỆN VÀ SỐ HÓA DI SẢN VĂN HÓA',
    'CỔNG WEB QUẢN TRỊ VIONE PLATFORM',
    'ỨNG DỤNG DI ĐỘNG VIPLUS',
    'VNPay',
    'Zalo OA',
    'ViOne Sport',
    'ViOne Run',
    'ViOne Museum',
    'ViOne Heritage',
    'PHỤ LỤC I',
    'PHỤ LỤC II',
    'PHỤ LỤC III',
    'PHỤ LỤC IV'
  ];

  required.forEach(kw => {
    if (docXml.includes(kw)) {
      console.log(`[PASS] Có chứa nội dung bắt buộc: '${kw}'`);
    } else {
      console.error(`[FAIL] Thiếu nội dung bắt buộc: '${kw}'`);
    }
  });

  // Count embedded images
  const mediaFiles = Object.keys(zip.files).filter(f => f.startsWith('word/media/'));
  console.log(`[MEDIA] Tổng số tệp ảnh nhúng trong DOCX: ${mediaFiles.length} tệp`);

  // Check Markdown file
  const mdPath = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md';
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  console.log(`[MD] Markdown length: ${mdContent.length} ký tự, ${mdContent.split('\n').length} dòng`);
}

verifyGeneratedDocx().catch(console.error);

