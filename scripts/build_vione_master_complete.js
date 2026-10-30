// scripts/build_vione_master_complete.js
// Kịch bản xây dựng toàn diện Hồ sơ Đăng ký Bản quyền Tác giả ViOne Platform & ViPlus Mobile
// Tạo đồng bộ cả file .docx (OpenXML chuẩn Uniwork) và file .md (Markdown)

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const { EXACT_TITLE_UPPER, EXACT_TITLE, META_INFO, ACTORS } = require('./content_vione_meta');
const { SECTION_1, SECTION_2_TECH } = require('./content_vione_section1_2');
const { CRM_MODULES } = require('./content_vione_crm');
const { MOBILE_MODULES } = require('./content_vione_mobile');
const { APPENDIX_I, APPENDIX_IV_CODE } = require('./content_vione_appendices');

function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function makeP(text, opts = {}) {
  const {
    bold = false,
    italic = false,
    size = 24, // 12pt default in half-points
    color = '000000',
    align = 'left',
    before = 0,
    after = 100,
    line = 240,
    pageBreak = false,
    pStyle = null
  } = opts;

  let pPr = '<w:pPr>';
  if (pStyle) pPr += `<w:pStyle w:val="${pStyle}"/>`;
  if (pageBreak) pPr += '<w:pageBreakBefore/>';
  if (align !== 'left') pPr += `<w:jc w:val="${align}"/>`;
  pPr += `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;
  pPr += '</w:pPr>';

  const rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${bold ? '<w:b/><w:bCs/>' : ''}${italic ? '<w:i/><w:iCs/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`;

  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function makeHeading(text, level = 1, pageBreak = false) {
  const configs = {
    1: { style: 'Heading1', size: 30, color: '1F4E79', before: 260, after: 120, bold: true }, // 15pt
    2: { style: 'Heading2', size: 26, color: '2E75B6', before: 200, after: 100, bold: true }, // 13pt
    3: { style: 'Heading3', size: 24, color: '1F4E79', before: 160, after: 80, bold: true },  // 12pt
    4: { style: 'Heading4', size: 24, color: '2E75B6', before: 140, after: 60, bold: true }   // 12pt
  };
  const cfg = configs[level] || configs[1];
  return makeP(text, {
    pStyle: cfg.style,
    bold: cfg.bold,
    size: cfg.size,
    color: cfg.color,
    before: cfg.before,
    after: cfg.after,
    pageBreak
  });
}

function makeBullet(text, boldPrefix = '') {
  let pPr = '<w:pPr><w:pStyle w:val="ListParagraph"/><w:ind w:left="480" w:hanging="240"/><w:spacing w:before="40" w:after="60"/></w:pPr>';
  let rContent = '';
  const rPr = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>';
  const rPrBold = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>';

  rContent += `<w:r>${rPr}<w:t xml:space="preserve">• </w:t></w:r>`;
  if (boldPrefix) {
    rContent += `<w:r>${rPrBold}<w:t xml:space="preserve">${escapeXml(boldPrefix)} </w:t></w:r>`;
  }
  rContent += `<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;

  return `<w:p>${pPr}${rContent}</w:p>`;
}

function makeTable(headers, rows, colWidths = []) {
  let xml = '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9200" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/><w:left w:val="none"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/><w:right w:val="none"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr>';

  if (colWidths.length > 0) {
    xml += '<w:tblGrid>';
    colWidths.forEach(w => {
      xml += `<w:gridCol w:w="${w}"/>`;
    });
    xml += '</w:tblGrid>';
  }

  // Header Row
  xml += '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>';
  headers.forEach((h, idx) => {
    const w = colWidths[idx] || 2000;
    xml += `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F2F4F7"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:before="60" w:after="60"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="22"/><w:color w:val="1F4E79"/></w:rPr><w:t xml:space="preserve">${escapeXml(h)}</w:t></w:r></w:p></w:tc>`;
  });
  xml += '</w:tr>';

  // Data Rows
  rows.forEach((row, rIdx) => {
    const bgFill = rIdx % 2 === 1 ? 'FAFAFA' : 'FFFFFF';
    xml += '<w:tr><w:trPr><w:cantSplit/></w:trPr>';
    row.forEach((cell, cIdx) => {
      const w = colWidths[cIdx] || 2000;
      const align = cIdx === 0 ? 'center' : (cIdx === 1 && row.length > 3 ? 'center' : 'left');
      xml += `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${bgFill}"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:before="50" w:after="50"/><w:jc w:val="${align}"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/></w:rPr><w:t xml:space="preserve">${escapeXml(cell)}</w:t></w:r></w:p></w:tc>`;
    });
    xml += '</w:tr>';
  });

  xml += '</w:tbl>';
  return xml;
}

function makeImageDrawing(rId, docPrId, isMobile = false) {
  const cx = isMobile ? 3017520 : 5669280; // 3.3 in vs 6.2 in
  const cy = isMobile ? 5943600 : 3337560; // 6.5 in vs 3.65 in
  return `<w:p><w:pPr><w:spacing w:before="120" w:after="80"/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${docPrId}" name="Picture ${docPrId}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${docPrId}" name="Picture ${docPrId}"/><pic:cNvPicPr><a:picLocks noChangeAspect="1"/></pic:cNvPicPr></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}

function makeFigureCaption(captionText) {
  return `<w:p><w:pPr><w:spacing w:before="40" w:after="160"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="595959"/></w:rPr><w:t xml:space="preserve">${escapeXml(captionText)}</w:t></w:r></w:p>`;
}

async function buildMasterDocx() {
  console.log('=== BẮT ĐẦU XÂY DỰNG MASTER TÀI LIỆU VIONE PLATFORM (UNIWORK PARITY) ===');

  const baseDocxPath = 'scratch/docx_9aff451.docx';
  const baseBuf = fs.readFileSync(baseDocxPath);
  const zip = await JSZip.loadAsync(baseBuf);

  // 1. Nhúng toàn bộ 43 ảnh live vào ZIP và cập nhật rels
  const relsXmlPath = 'word/_rels/document.xml.rels';
  let relsXml = await zip.file(relsXmlPath).async('string');

  const allImages = [];
  let nextRId = 500;
  let nextDocPrId = 5000;

  // 23 CRM Images
  for (const mod of CRM_MODULES) {
    const imgPath = path.join('document/images/evidence_v9', mod.imgFile);
    if (!fs.existsSync(imgPath)) {
      console.error(`Không tìm thấy ảnh CRM: ${imgPath}`);
      continue;
    }
    const imgBuf = fs.readFileSync(imgPath);
    const mediaName = `media/vione_crm_${mod.id}.png`;
    zip.file(`word/${mediaName}`, imgBuf);

    const rId = `rIdCRM${nextRId++}`;
    const docPrId = nextDocPrId++;

    const relEntry = `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${mediaName}"/>`;
    relsXml = relsXml.replace('</Relationships>', `${relEntry}</Relationships>`);

    mod.rId = rId;
    mod.docPrId = docPrId;
  }

  // 20 Mobile Images
  for (const mod of MOBILE_MODULES) {
    const imgPath = path.join('document/images/evidence_v9', mod.imgFile);
    if (!fs.existsSync(imgPath)) {
      console.error(`Không tìm thấy ảnh Mobile: ${imgPath}`);
      continue;
    }
    const imgBuf = fs.readFileSync(imgPath);
    const mediaName = `media/vione_app_${mod.id}.png`;
    zip.file(`word/${mediaName}`, imgBuf);

    const rId = `rIdAPP${nextRId++}`;
    const docPrId = nextDocPrId++;

    const relEntry = `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${mediaName}"/>`;
    relsXml = relsXml.replace('</Relationships>', `${relEntry}</Relationships>`);

    mod.rId = rId;
    mod.docPrId = docPrId;
  }

  zip.file(relsXmlPath, relsXml);
  console.log('1. Đã nhúng 43 ảnh live vào ZIP và cập nhật relationships thành công!');

  // 2. Xây dựng toàn bộ các phần nội dung XML
  let bodyXml = '';

  // COVER PAGE
  bodyXml += makeP('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 28, align: 'center', after: 40 });
  bodyXml += makeP('Độc lập – Tự do – Hạnh phúc', { bold: true, size: 26, align: 'center', after: 100 });
  bodyXml += makeP('-------------------***-------------------', { align: 'center', after: 200 });
  bodyXml += makeP('TÀI LIỆU KỸ THUẬT & TRÌNH BÀY TÁC PHẨM', { bold: true, size: 26, align: 'center', after: 40 });
  bodyXml += makeP('ĐĂNG KÝ QUYỀN TÁC GIẢ ĐỐI VỚI CHƯƠNG TRÌNH MÁY TÍNH', { bold: true, size: 24, align: 'center', after: 200 });
  bodyXml += makeP('CHƯƠNG TRÌNH MÁY TÍNH:', { bold: true, size: 26, align: 'center', after: 40 });
  bodyXml += makeP(EXACT_TITLE_UPPER, { bold: true, size: 30, color: '1F4E79', align: 'center', after: 80 });
  bodyXml += makeP(META_INFO.subtitle, { bold: true, size: 24, color: '2E75B6', align: 'center', after: 160 });
  bodyXml += makeP('(Không bao gồm dữ liệu)', { italic: true, size: 22, align: 'center', after: 240 });

  bodyXml += makeP('MÔI TRƯỜNG TRIỂN KHAI VẬN HÀNH HỆ THỐNG:', { bold: true, size: 24, color: '1F4E79', after: 80 });
  META_INFO.deployEnv.forEach(env => {
    bodyXml += makeBullet(env);
  });

  bodyXml += makeP('CHỦ SỞ HỮU QUYỀN TÁC GIẢ:', { bold: true, size: 24, color: '1F4E79', before: 160, after: 60 });
  bodyXml += makeBullet(`Tên tổ chức / doanh nghiệp: ${META_INFO.owner.name}`);
  bodyXml += makeBullet(`Mã số doanh nghiệp: ${META_INFO.owner.taxCode}`);
  bodyXml += makeBullet(`Địa chỉ trụ sở chính: ${META_INFO.owner.address}`);
  bodyXml += makeBullet(`Số điện thoại: ${META_INFO.owner.phone} | Email: ${META_INFO.owner.email}`);

  bodyXml += makeP('TÁC GIẢ TẠO RA TÁC PHẨM:', { bold: true, size: 24, color: '1F4E79', before: 140, after: 60 });
  bodyXml += makeBullet(`Họ và tên tác giả: ${META_INFO.author.name} (Bút danh: ${META_INFO.author.penName})`);
  bodyXml += makeBullet(`Sinh ngày: ${META_INFO.author.birth} | Quốc tịch: ${META_INFO.author.nationality}`);
  bodyXml += makeBullet(`Số Thẻ Căn cước công dân: ${META_INFO.author.idCard} - Cấp ngày: ${META_INFO.author.issueDate} tại ${META_INFO.author.issuePlace}`);
  bodyXml += makeBullet(`Địa chỉ thường trú: ${META_INFO.author.address}`);
  bodyXml += makeBullet(`Số điện thoại: ${META_INFO.author.phone} | Email: ${META_INFO.author.email}`);

  bodyXml += makeP(META_INFO.locationDate, { italic: true, size: 24, align: 'center', before: 240, after: 120 });

  // TABLE OF CONTENTS (MỤC LỤC)
  bodyXml += makeHeading('MỤC LỤC TỔNG THỂ', 1, true);

  // Helper cho dòng TOC
  function makeTocLine(title, page = '', level = 1) {
    const leftIndent = level === 1 ? 0 : (level === 2 ? 360 : 720);
    const bold = level === 1;
    const size = level === 1 ? 22 : (level === 2 ? 21 : 20);
    const color = level === 1 ? '1F4E79' : '000000';
    return `<w:p><w:pPr><w:spacing w:before="30" w:after="30"/><w:ind w:left="${leftIndent}"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${size}"/><w:color w:val="${color}"/>${bold ? '<w:b/><w:bCs/>' : ''}</w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${size}"/><w:color w:val="${color}"/>${bold ? '<w:b/><w:bCs/>' : ''}</w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t></w:r></w:p>`;
  }

  bodyXml += makeTocLine('1. Giới thiệu', '1', 1);
  bodyXml += makeTocLine('1.1 Mục tiêu', '1', 2);
  bodyXml += makeTocLine('1.2 Phạm vi của dự án', '2', 2);
  bodyXml += makeTocLine('1.2.1 Phạm vi', '2', 3);
  bodyXml += makeTocLine('1.2.2 Đối tượng sử dụng (Bảng mã tác nhân A01 – A10)', '3', 3);
  bodyXml += makeTocLine('2. Yêu cầu kỹ thuật', '5', 1);
  bodyXml += makeTocLine('2.1 Kiến trúc hạ tầng', '5', 2);
  bodyXml += makeTocLine('2.1.1 Kiến trúc tổng thể 4 tầng', '5', 3);
  bodyXml += makeTocLine('2.1.2 Kiến trúc chi tiết các luồng xử lý', '7', 3);
  bodyXml += makeTocLine('2.1.3 Kiến trúc triển khai, dự phòng và an toàn', '10', 3);
  bodyXml += makeTocLine('2.2 Công nghệ sử dụng', '12', 2);
  bodyXml += makeTocLine('2.3 Yêu cầu chức năng hệ thống', '14', 2);
  bodyXml += makeTocLine('2.3.1 Các chức năng nền tảng chung', '14', 3);
  bodyXml += makeTocLine('2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)', '15', 3);

  CRM_MODULES.forEach(mod => {
    bodyXml += makeTocLine(`${mod.subCode}. ${mod.shortTitle}`, '', 3);
  });

  bodyXml += makeTocLine('2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViPlus (20 Phân hệ)', '32', 3);
  MOBILE_MODULES.forEach(mod => {
    bodyXml += makeTocLine(`${mod.subCode}. ${mod.shortTitle}`, '', 3);
  });

  bodyXml += makeTocLine('2.4 Các yêu cầu phi chức năng khác', '48', 2);
  bodyXml += makeTocLine('2.4.1 Yêu cầu về hiệu năng (Performance Requirements)', '48', 3);
  bodyXml += makeTocLine('2.4.2 Yêu cầu về bảo mật (Security Requirements)', '49', 3);
  bodyXml += makeTocLine('2.4.3 Yêu cầu tuân thủ (Compliance Requirements)', '50', 3);
  bodyXml += makeTocLine('PHỤ LỤC I - Yêu cầu kỹ thuật của phần mềm (Đặc tả CSDL, API, Socket.IO)', '51', 1);
  bodyXml += makeTocLine('PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)', '56', 1);
  CRM_MODULES.forEach((mod, idx) => {
    bodyXml += makeTocLine(`${idx + 1}. ${mod.name}`, '', 2);
  });

  bodyXml += makeTocLine('PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIPLUS (20 PHÂN HỆ MOCKUP)', '82', 1);
  MOBILE_MODULES.forEach((mod, idx) => {
    bodyXml += makeTocLine(`${idx + 1}. ${mod.name}`, '', 2);
  });

  bodyXml += makeTocLine('PHỤ LỤC IV - Mã nguồn phần mềm', '104', 1);

  // CHƯƠNG 1: GIỚI THIỆU
  bodyXml += makeHeading('1. Giới thiệu', 1, true);
  bodyXml += makeHeading('1.1 Mục tiêu', 2);
  bodyXml += makeP(SECTION_1.mucTieu, { after: 120 });

  bodyXml += makeHeading('1.2 Phạm vi của dự án', 2);
  bodyXml += makeHeading('1.2.1. Phạm vi', 3);
  bodyXml += makeP(SECTION_1.phamVi, { after: 120 });

  bodyXml += makeHeading('1.2.2. Đối tượng sử dụng', 3);
  bodyXml += makeP(SECTION_1.doiTuong, { after: 100 });

  // Bảng đối tượng sử dụng (Actors)
  const actorHeaders = ['STT', 'Mã Tác Nhân', 'Tên Tác Nhân & Phân Vai', 'Mô Tả Nhiệm Vụ & Quyền Hạn Trong Hệ Thống'];
  const actorRows = ACTORS.map((act, idx) => [
    String(idx + 1),
    act.code,
    act.name,
    act.desc
  ]);
  bodyXml += makeTable(actorHeaders, actorRows, [800, 1400, 2800, 4200]);

  // CHƯƠNG 2: YÊU CẦU KỸ THUẬT
  bodyXml += makeHeading('2. Yêu cầu kỹ thuật', 1, true);

  bodyXml += makeHeading('2.1 Kiến trúc hạ tầng', 2);
  bodyXml += makeHeading('2.1.1 Kiến trúc tổng thể', 3);
  bodyXml += makeP(SECTION_2_TECH.kientrucTongThe, { after: 120 });

  bodyXml += makeHeading('2.1.2 Kiến trúc chi tiết', 3);
  bodyXml += makeP(SECTION_2_TECH.kientrucChiTiet, { after: 120 });

  bodyXml += makeHeading('2.1.3 Kiến trúc triển khai, dự phòng và an toàn', 3);
  bodyXml += makeP(SECTION_2_TECH.kientrucTrienKhai, { after: 120 });

  bodyXml += makeHeading('2.2 Công nghệ sử dụng', 2);
  bodyXml += makeP('Hệ thống được phát triển trên nền tảng các công nghệ mã nguồn mở hiện đại, đảm bảo tính độc lập tự chủ công nghệ và tương thích hoàn toàn với hạ tầng máy chủ đám mây:', { after: 80 });

  const techHeaders = ['STT', 'Lĩnh Vực Công Nghệ', 'Nền Tảng / Thư Viện Sử Dụng & Chuẩn Kỹ Thuật'];
  const techRows = SECTION_2_TECH.congNghe.map(t => [
    String(t.stt),
    t.linhVuc,
    t.congNghe
  ]);
  bodyXml += makeTable(techHeaders, techRows, [800, 2800, 5600]);

  bodyXml += makeHeading('2.3 Yêu cầu chức năng', 2);
  bodyXml += makeHeading('2.3.1 Các chức năng chung', 3);
  bodyXml += makeP(SECTION_2_TECH.chucNangChung, { after: 140 });

  // 2.3.2 CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ CHI TIẾT)
  bodyXml += makeHeading('2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)', 3);
  bodyXml += makeP('Cổng Web Quản Trị ViOne Platform cung cấp bộ công cụ điều hành chuyên sâu cho cấp quản lý, kế toán, ban trọng tài và cán bộ bảo tàng với 23 phân hệ nghiệp vụ hoàn chỉnh:', { after: 100 });

  CRM_MODULES.forEach(mod => {
    bodyXml += makeHeading(`${mod.subCode}. ${mod.name}`, 4);
    bodyXml += makeP(`Mô tả chung: ${mod.generalDesc}`, { italic: true, after: 60 });
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `Tác nhân: ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `Tác nhân: ${f.actorMain}`;
      bodyXml += makeBullet(`${f.desc} ${actorTag}.`, `${f.name}:`);
    });
  });

  // 2.3.3 ỨNG DỤNG DI ĐỘNG VIPLUS / VIONE CONNECT (20 PHÂN HỆ CHI TIẾT)
  bodyXml += makeHeading('2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViPlus (20 Phân hệ)', 3, true);
  bodyXml += makeP('Ứng dụng di động ViPlus (ViOne Connect) trên hệ điều hành iOS và Android mang lại trải nghiệm định danh số và kết nối kinh doanh thượng lưu với 20 phân hệ tính năng native sâu:', { after: 100 });

  MOBILE_MODULES.forEach(mod => {
    bodyXml += makeHeading(`${mod.subCode}. ${mod.name}`, 4);
    bodyXml += makeP(`Mô tả chung: ${mod.generalDesc}`, { italic: true, after: 60 });
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `Tác nhân: ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `Tác nhân: ${f.actorMain}`;
      bodyXml += makeBullet(`${f.desc} ${actorTag}.`, `${f.name}:`);
    });
  });

  // 2.4 CÁC YÊU CẦU PHI CHỨC NĂNG KHÁC
  bodyXml += makeHeading('2.4 Các yêu cầu phi chức năng khác', 2, true);
  bodyXml += makeHeading('2.4.1 Yêu cầu về hiệu năng (Performance Requirements)', 3);
  bodyXml += makeP(SECTION_2_TECH.yeuCauPhiChucNang.hieuNang, { after: 120 });

  bodyXml += makeHeading('2.4.2 Yêu cầu về bảo mật (Security Requirements)', 3);
  bodyXml += makeP(SECTION_2_TECH.yeuCauPhiChucNang.baoMat, { after: 120 });

  bodyXml += makeHeading('2.4.3 Yêu cầu tuân thủ (Compliance Requirements)', 3);
  bodyXml += makeP(SECTION_2_TECH.yeuCauPhiChucNang.tuanThu, { after: 140 });

  // PHỤ LỤC I - YÊU CẦU KỸ THUẬT CỦA PHẦN MỀM
  bodyXml += makeHeading('PHỤ LỤC I - Yêu cầu kỹ thuật của phần mềm', 1, true);
  bodyXml += makeHeading('1. Bảng Cấu Trúc Cơ Sở Dữ Liệu PostgreSQL Nền Tảng (Core Schema)', 2);
  bodyXml += makeP('Danh mục 18 thực thể bảng dữ liệu cốt lõi phục vụ lưu trữ đa tổ chức (Multi-Tenant) trên hệ quản trị CSDL PostgreSQL 16:', { after: 80 });

  const dbHeaders = ['STT', 'Tên Bảng (Table)', 'Khóa Chính (PK)', 'Mô Tả Nghiệp Vụ & Dữ Liệu Lưu Trữ'];
  const dbRows = APPENDIX_I.dbTables.map(t => [
    String(t.stt),
    t.table,
    t.pk,
    t.desc
  ]);
  bodyXml += makeTable(dbHeaders, dbRows, [800, 2200, 1800, 4400]);

  bodyXml += makeHeading('2. Bảng Danh Mục API RESTful Cốt Lõi', 2);
  bodyXml += makeP('Danh mục các API RESTful phục vụ kết nối bảo mật giữa Cổng Web Quản Trị, Ứng dụng Di động ViPlus và các dịch vụ bên ngoài:', { after: 80 });

  const apiHeaders = ['STT', 'Phương Thức', 'Đường Dẫn Endpoint', 'Mô Tả Chức Năng', 'Phân Quyền RBAC', 'Tác Nhân'];
  const apiRows = APPENDIX_I.apiEndpoints.map(a => [
    String(a.stt),
    a.method,
    a.endpoint,
    a.desc,
    a.role,
    a.actor
  ]);
  bodyXml += makeTable(apiHeaders, apiRows, [600, 1100, 2400, 2700, 1200, 1200]);

  bodyXml += makeHeading('3. Bảng Danh Mục Sự Kiện Thời Gian Thực Socket.IO Gateway', 2);
  const socketHeaders = ['STT', 'Tên Sự Kiện (Event Name)', 'Chiều Truyền Tin', 'Mô Tả Hành Động Thời Gian Thực'];
  const socketRows = APPENDIX_I.socketEvents.map(s => [
    String(s.stt),
    s.event,
    s.type,
    s.desc
  ]);
  bodyXml += makeTable(socketHeaders, socketRows, [800, 2600, 1800, 4000]);

  bodyXml += makeHeading('4. Bảng Yêu Cầu Cấu Hình Phần Cứng Hệ Thống', 2);
  const hwHeaders = ['STT', 'Thành Phần Hệ Thống', 'Cấu Hình Tối Thiểu (Minimum)', 'Cấu Hình Đề Nghị (Recommended)'];
  const hwRows = [
    ['1', 'Máy chủ triển khai (Server Production)', APPENDIX_I.hardwareSpecs.server.min, APPENDIX_I.hardwareSpecs.server.rec],
    ['2', 'Máy trạm Web Quản trị (Desktop / Laptop)', APPENDIX_I.hardwareSpecs.clientWeb.min, APPENDIX_I.hardwareSpecs.clientWeb.rec],
    ['3', 'Thiết bị Di động ViPlus (iOS / Android)', APPENDIX_I.hardwareSpecs.mobile.min, APPENDIX_I.hardwareSpecs.mobile.rec]
  ];
  bodyXml += makeTable(hwHeaders, hwRows, [600, 2400, 3100, 3100]);

  // PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG CỔNG WEB QUẢN TRỊ (23 PHÂN HỆ LIVE)
  bodyXml += makeHeading('PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)', 1, true);
  bodyXml += makeP('Cổng Web Quản Trị ViOne Platform (https://crm_vione.viconnect.vn) cung cấp bộ công cụ điều hành trực quan trên màn hình máy tính desktop (độ phân giải chuẩn 1440x900). Dưới đây là hướng dẫn sử dụng chi tiết từng phân hệ nghiệp vụ:', { after: 120 });

  CRM_MODULES.forEach((mod, idx) => {
    bodyXml += makeHeading(`${idx + 1}. ${mod.name}`, 3);
    bodyXml += makeP(`Mục đích: ${mod.generalDesc}`, { after: 60 });
    bodyXml += makeP('Các bước thực hiện:', { bold: true, after: 40 });
    mod.steps.forEach(step => {
      bodyXml += makeBullet(step);
    });
    bodyXml += makeImageDrawing(mod.rId, mod.docPrId, false);
    bodyXml += makeFigureCaption(mod.figTitle);
  });

  // PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG DI ĐỘNG VIPLUS (20 PHÂN HỆ MOCKUP)
  bodyXml += makeHeading('PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIPLUS (20 PHÂN HỆ MOCKUP)', 1, true);
  bodyXml += makeP('Ứng dụng di động ViPlus (ViOne Connect) mang lại trải nghiệm điều hành và kết nối giao thương thượng lưu. Toàn bộ 20 màn hình dưới đây được trình bày chuẩn mực trong khung điện thoại thông minh Obsidian Luxury sang trọng:', { after: 120 });

  MOBILE_MODULES.forEach((mod, idx) => {
    bodyXml += makeHeading(`${idx + 1}. ${mod.name}`, 3);
    bodyXml += makeP(`Mục đích: ${mod.generalDesc}`, { after: 60 });
    bodyXml += makeP('Các bước thực hiện:', { bold: true, after: 40 });
    mod.steps.forEach(step => {
      bodyXml += makeBullet(step);
    });
    bodyXml += makeImageDrawing(mod.rId, mod.docPrId, true);
    bodyXml += makeFigureCaption(mod.figTitle);
  });

  // PHỤ LỤC IV - MÃ NGUỒN PHẦN MỀM
  bodyXml += makeHeading('PHỤ LỤC IV - Mã nguồn phần mềm', 1, true);
  bodyXml += makeP('Trích đoạn 4 tệp mã nguồn tiêu biểu đại diện cho kiến trúc Backend, Realtime Gateway, Giao diện Di động Native và Cơ sở dữ liệu của phần mềm ViOne Platform:', { after: 120 });

  const codeFiles = [
    APPENDIX_IV_CODE.file1,
    APPENDIX_IV_CODE.file2,
    APPENDIX_IV_CODE.file3,
    APPENDIX_IV_CODE.file4
  ];

  codeFiles.forEach((cf, idx) => {
    bodyXml += makeP('========================================================================================', { size: 18, color: '7F7F7F', before: 120, after: 20 });
    bodyXml += makeP(`Tệp ${idx + 1}/4: ${cf.name}  (${cf.lines} dòng)`, { bold: true, size: 22, color: '1F4E79', before: 20, after: 20 });
    bodyXml += makeP('========================================================================================', { size: 18, color: '7F7F7F', before: 20, after: 80 });

    const codeLines = cf.code.split('\n');
    codeLines.forEach(cl => {
      bodyXml += `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="220" w:lineRule="auto"/><w:ind w:left="240"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="262626"/></w:rPr><w:t xml:space="preserve">${escapeXml(cl)}</w:t></w:r></w:p>`;
    });
  });

  // Đóng thân tài liệu OpenXML
  const finalDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body>${bodyXml}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`;

  zip.file('word/document.xml', finalDocXml);

  console.log('3. Đang nén tệp DOCX với chuẩn DEFLATE level 9 ...');
  const outBuf = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const docxDst1 = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx';
  const docxDst2 = 'C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx';

  fs.writeFileSync(docxDst1, outBuf);
  console.log(`  Đã lưu docxDst1: ${docxDst1} (${(outBuf.length / (1024*1024)).toFixed(2)} MB)`);

  fs.writeFileSync(docxDst2, outBuf);
  console.log(`  Đã lưu docxDst2: ${docxDst2} (${(outBuf.length / (1024*1024)).toFixed(2)} MB)`);

  // 4. Sinh file Markdown .md đồng bộ 100% nội dung
  console.log('4. Đang sinh file Markdown .md tương ứng ...');
  let md = '';
  md += `# CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n**Độc lập – Tự do – Hạnh phúc**\n\n-------------------***-------------------\n\n`;
  md += `# TÀI LIỆU KỸ THUẬT & TRÌNH BÀY TÁC PHẨM\n## ĐĂNG KÝ QUYỀN TÁC GIẢ ĐỐI VỚI CHƯƠNG TRÌNH MÁY TÍNH\n\n`;
  md += `### TÊN TÁC PHẨM:\n# ${EXACT_TITLE_UPPER}\n### ${META_INFO.subtitle}\n*(Không bao gồm dữ liệu)*\n\n---\n\n`;

  md += `### MÔI TRƯỜNG TRIỂN KHAI VẬN HÀNH HỆ THỐNG:\n`;
  META_INFO.deployEnv.forEach(env => {
    md += `- ${env}\n`;
  });
  md += `\n### CHỦ SỞ HỮU QUYỀN TÁC GIẢ:\n`;
  md += `- **Tên tổ chức / doanh nghiệp đăng ký:** ${META_INFO.owner.name}\n`;
  md += `- **Mã số doanh nghiệp:** ${META_INFO.owner.taxCode}\n`;
  md += `- **Địa chỉ trụ sở chính:** ${META_INFO.owner.address}\n`;
  md += `- **Số điện thoại:** ${META_INFO.owner.phone} | **Email:** ${META_INFO.owner.email}\n\n`;

  md += `### TÁC GIẢ TẠO RA TÁC PHẨM:\n`;
  md += `- **Họ và tên tác giả:** ${META_INFO.author.name} (Bút danh: ${META_INFO.author.penName})\n`;
  md += `- **Sinh ngày:** ${META_INFO.author.birth} | **Quốc tịch:** ${META_INFO.author.nationality}\n`;
  md += `- **Số Thẻ Căn cước công dân:** ${META_INFO.author.idCard} - Cấp ngày: ${META_INFO.author.issueDate} tại ${META_INFO.author.issuePlace}\n`;
  md += `- **Địa chỉ thường trú:** ${META_INFO.author.address}\n`;
  md += `- **Số điện thoại:** ${META_INFO.author.phone} | **Email:** ${META_INFO.author.email}\n\n`;
  md += `*${META_INFO.locationDate}*\n\n---\n\n`;

  // TOC MD
  md += `## MỤC LỤC TỔNG THỂ\n\n`;
  md += `1. [1. Giới thiệu](#1-giới-thiệu)\n`;
  md += `   - 1.1 [Mục tiêu](#11-mục-tiêu)\n`;
  md += `   - 1.2 [Phạm vi của dự án](#12-phạm-vi-của-dự-án)\n`;
  md += `     - 1.2.1 [Phạm vi](#121-phạm-vi)\n`;
  md += `     - 1.2.2 [Đối tượng sử dụng](#122-đối-tượng-sử-dụng)\n`;
  md += `2. [2. Yêu cầu kỹ thuật](#2-yêu-cầu-kỹ-thuật)\n`;
  md += `   - 2.1 [Kiến trúc hạ tầng](#21-kiến-trúc-hạ-tầng)\n`;
  md += `     - 2.1.1 [Kiến trúc tổng thể 4 tầng](#211-kiến-trúc-tổng-thể)\n`;
  md += `     - 2.1.2 [Kiến trúc chi tiết các luồng xử lý](#212-kiến-trúc-chi-tiết)\n`;
  md += `     - 2.1.3 [Kiến trúc triển khai, dự phòng và an toàn](#213-kiến-trúc-triển-khai-dự-phòng-và-an-toàn)\n`;
  md += `   - 2.2 [Công nghệ sử dụng](#22-công-nghệ-sử-dụng)\n`;
  md += `   - 2.3 [Yêu cầu chức năng hệ thống](#23-yêu-cầu-chức-năng)\n`;
  md += `     - 2.3.1 [Các chức năng nền tảng chung](#231-các-chức-năng-chung)\n`;
  md += `     - 2.3.2 [Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)](#232-chức-năng-chi-tiết-cổng-web-quản-trị-vione-platform-23-phân-hệ)\n`;
  CRM_MODULES.forEach(mod => {
    md += `       - ${mod.subCode} [${mod.name}](#${mod.subCode.replace(/\./g, '')}-${encodeURIComponent(mod.shortTitle.toLowerCase().replace(/\s+/g, '-'))})\n`;
  });
  md += `     - 2.3.3 [Chức năng chi tiết Phân hệ Ứng dụng Di động ViPlus (20 Phân hệ)](#233-chức-năng-chi-tiết-phân-hệ-ứng-dụng-di-động-viplus-20-phân-hệ)\n`;
  MOBILE_MODULES.forEach(mod => {
    md += `       - ${mod.subCode} [${mod.name}](#${mod.subCode.replace(/\./g, '')}-${encodeURIComponent(mod.shortTitle.toLowerCase().replace(/\s+/g, '-'))})\n`;
  });
  md += `   - 2.4 [Các yêu cầu phi chức năng khác](#24-các-yêu-cầu-phi-chức-năng-khác)\n`;
  md += `     - 2.4.1 [Yêu cầu về hiệu năng](#241-yêu-cầu-về-hiệu-năng-performance-requirements)\n`;
  md += `     - 2.4.2 [Yêu cầu về bảo mật](#242-yêu-cầu-về-bảo-mật-security-requirements)\n`;
  md += `     - 2.4.3 [Yêu cầu tuân thủ](#243-yêu-cầu-tuân-thủ-compliance-requirements)\n`;
  md += `3. [PHỤ LỤC I - Yêu cầu kỹ thuật của phần mềm](#phụ-lục-i---yêu-cầu-kỹ-thuật-của-phần-mềm)\n`;
  md += `4. [PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)](#phụ-lục-ii--hướng-dẫn-sử-dụng-phần-mềm---cổng-web-quản-trị-vione-platform-23-phân-hệ)\n`;
  md += `5. [PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIPLUS (20 PHÂN HỆ MOCKUP)](#phụ-lục-iii--hướng-dẫn-sử-dụng-phần-mềm---ứng-dụng-di-động-viplus-20-phân-hệ-mockup)\n`;
  md += `6. [PHỤ LỤC IV - Mã nguồn phần mềm](#phụ-lục-iv---mã-nguồn-phần-mềm)\n\n---\n\n`;

  // CHƯƠNG 1
  md += `# 1. Giới thiệu\n\n## 1.1 Mục tiêu\n\n${SECTION_1.mucTieu}\n\n`;
  md += `## 1.2 Phạm vi của dự án\n\n### 1.2.1. Phạm vi\n\n${SECTION_1.phamVi}\n\n`;
  md += `### 1.2.2. Đối tượng sử dụng\n\n${SECTION_1.doiTuong}\n\n`;
  md += `| STT | Mã Tác Nhân | Tên Tác Nhân & Phân Vai | Mô Tả Nhiệm Vụ & Quyền Hạn Trong Hệ Thống |\n`;
  md += `| :---: | :---: | :--- | :--- |\n`;
  ACTORS.forEach((act, idx) => {
    md += `| ${idx + 1} | **${act.code}** | ${act.name} | ${act.desc} |\n`;
  });
  md += `\n---\n\n`;

  // CHƯƠNG 2
  md += `# 2. Yêu cầu kỹ thuật\n\n`;
  md += `## 2.1 Kiến trúc hạ tầng\n\n### 2.1.1 Kiến trúc tổng thể\n\n${SECTION_2_TECH.kientrucTongThe}\n\n`;
  md += `### 2.1.2 Kiến trúc chi tiết\n\n${SECTION_2_TECH.kientrucChiTiet}\n\n`;
  md += `### 2.1.3 Kiến trúc triển khai, dự phòng và an toàn\n\n${SECTION_2_TECH.kientrucTrienKhai}\n\n`;
  md += `## 2.2 Công nghệ sử dụng\n\n`;
  md += `| STT | Lĩnh Vực Công Nghệ | Nền Tảng / Thư Viện Sử Dụng & Chuẩn Kỹ Thuật |\n`;
  md += `| :---: | :--- | :--- |\n`;
  SECTION_2_TECH.congNghe.forEach(t => {
    md += `| ${t.stt} | **${t.linhVuc}** | ${t.congNghe} |\n`;
  });
  md += `\n## 2.3 Yêu cầu chức năng\n\n### 2.3.1 Các chức năng chung\n\n${SECTION_2_TECH.chucNangChung}\n\n`;

  // 2.3.2 CRM
  md += `### 2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)\n\n`;
  CRM_MODULES.forEach(mod => {
    md += `#### ${mod.subCode}. ${mod.name}\n\n`;
    md += `*Mô tả chung:* ${mod.generalDesc}\n\n`;
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `**Tác nhân:** ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `**Tác nhân:** ${f.actorMain}`;
      md += `- **${f.name}:** ${f.desc} (${actorTag})\n`;
    });
    md += `\n`;
  });

  // 2.3.3 MOBILE
  md += `### 2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViPlus (20 Phân hệ)\n\n`;
  MOBILE_MODULES.forEach(mod => {
    md += `#### ${mod.subCode}. ${mod.name}\n\n`;
    md += `*Mô tả chung:* ${mod.generalDesc}\n\n`;
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `**Tác nhân:** ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `**Tác nhân:** ${f.actorMain}`;
      md += `- **${f.name}:** ${f.desc} (${actorTag})\n`;
    });
    md += `\n`;
  });

  // 2.4
  md += `## 2.4 Các yêu cầu phi chức năng khác\n\n`;
  md += `### 2.4.1 Yêu cầu về hiệu năng (Performance Requirements)\n\n${SECTION_2_TECH.yeuCauPhiChucNang.hieuNang}\n\n`;
  md += `### 2.4.2 Yêu cầu về bảo mật (Security Requirements)\n\n${SECTION_2_TECH.yeuCauPhiChucNang.baoMat}\n\n`;
  md += `### 2.4.3 Yêu cầu tuân thủ (Compliance Requirements)\n\n${SECTION_2_TECH.yeuCauPhiChucNang.tuanThu}\n\n---\n\n`;

  // PHỤ LỤC I
  md += `# PHỤ LỤC I - Yêu cầu kỹ thuật của phần mềm\n\n`;
  md += `## 1. Bảng Cấu Trúc Cơ Sở Dữ Liệu PostgreSQL Nền Tảng (Core Schema)\n\n`;
  md += `| STT | Tên Bảng (Table) | Khóa Chính (PK) | Mô Tả Nghiệp Vụ & Dữ Liệu Lưu Trữ |\n`;
  md += `| :---: | :--- | :--- | :--- |\n`;
  APPENDIX_I.dbTables.forEach(t => {
    md += `| ${t.stt} | \`${t.table}\` | \`${t.pk}\` | ${t.desc} |\n`;
  });
  md += `\n## 2. Bảng Danh Mục API RESTful Cốt Lõi\n\n`;
  md += `| STT | Phương Thức | Đường Dẫn Endpoint | Mô Tả Chức Năng | Phân Quyền RBAC | Tác Nhân |\n`;
  md += `| :---: | :---: | :--- | :--- | :--- | :--- |\n`;
  APPENDIX_I.apiEndpoints.forEach(a => {
    md += `| ${a.stt} | **${a.method}** | \`${a.endpoint}\` | ${a.desc} | ${a.role} | ${a.actor} |\n`;
  });
  md += `\n## 3. Bảng Danh Mục Sự Kiện Thời Gian Thực Socket.IO Gateway\n\n`;
  md += `| STT | Tên Sự Kiện | Chiều Truyền Tin | Mô Tả Hành Động Thời Gian Thực |\n`;
  md += `| :---: | :--- | :---: | :--- |\n`;
  APPENDIX_I.socketEvents.forEach(s => {
    md += `| ${s.stt} | \`${s.event}\` | ${s.type} | ${s.desc} |\n`;
  });
  md += `\n## 4. Bảng Yêu Cầu Cấu Hình Phần Cứng Hệ Thống\n\n`;
  md += `| STT | Thành Phần Hệ Thống | Cấu Hình Tối Thiểu (Minimum) | Cấu Hình Đề Nghị (Recommended) |\n`;
  md += `| :---: | :--- | :--- | :--- |\n`;
  hwRows.forEach(r => {
    md += `| ${r[0]} | **${r[1]}** | ${r[2]} | ${r[3]} |\n`;
  });
  md += `\n---\n\n`;

  // PHỤ LỤC II
  md += `# PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)\n\n`;
  CRM_MODULES.forEach((mod, idx) => {
    md += `### ${idx + 1}. ${mod.name}\n\n`;
    md += `**Mục đích:** ${mod.generalDesc}\n\n`;
    md += `**Các bước thực hiện:**\n`;
    mod.steps.forEach(step => {
      md += `- ${step}\n`;
    });
    md += `\n![${mod.figTitle}](images/evidence_v9/${mod.imgFile})\n\n`;
    md += `*${mod.figTitle}*\n\n`;
  });

  // PHỤ LỤC III
  md += `# PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIPLUS (20 PHÂN HỆ MOCKUP)\n\n`;
  MOBILE_MODULES.forEach((mod, idx) => {
    md += `### ${idx + 1}. ${mod.name}\n\n`;
    md += `**Mục đích:** ${mod.generalDesc}\n\n`;
    md += `**Các bước thực hiện:**\n`;
    mod.steps.forEach(step => {
      md += `- ${step}\n`;
    });
    md += `\n![${mod.figTitle}](images/evidence_v9/${mod.imgFile})\n\n`;
    md += `*${mod.figTitle}*\n\n`;
  });

  // PHỤ LỤC IV
  md += `# PHỤ LỤC IV - Mã nguồn phần mềm\n\n`;
  codeFiles.forEach((cf, idx) => {
    md += `========================================================================================\n`;
    md += `Tệp ${idx + 1}/4: ${cf.name}  (${cf.lines} dòng)\n`;
    md += `========================================================================================\n\n`;
    const lang = cf.name.endsWith('.sql') ? 'sql' : 'typescript';
    md += `\`\`\`${lang}\n${cf.code}\n\`\`\`\n\n`;
  });

  const mdDst1 = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md';
  const mdDst2 = 'C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md';

  fs.writeFileSync(mdDst1, md, 'utf8');
  console.log(`  Đã lưu mdDst1: ${mdDst1} (${(Buffer.byteLength(md) / 1024).toFixed(1)} KB)`);

  fs.writeFileSync(mdDst2, md, 'utf8');
  console.log(`  Đã lưu mdDst2: ${mdDst2} (${(Buffer.byteLength(md) / 1024).toFixed(1)} KB)`);

  console.log('=== HOÀN TẤT BUILD MASTER TÀI LIỆU VIONE PLATFORM (DOCX & MD) ===');
}

buildMasterDocx().catch(err => {
  console.error('LỖI KHI BUILD MASTER TÀI LIỆU:', err);
  process.exit(1);
});

