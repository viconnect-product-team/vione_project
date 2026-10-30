// scripts/build_vione_super_master_uniwork.js
// Kịch bản tối thượng xây dựng Hồ sơ Đăng ký Bản quyền Tác giả ViOne Platform & ViOne App
// Chuẩn mực 100% theo phong cách tài liệu tham chiếu Uniwork (221 trang) và mở rộng đạt >400 trang
// Màu chuẩn thương hiệu: Vàng Hoàng Gia Champagne Gold & Đen Thạch Anh Obsidian
// Khắc phục triệt để lỗi không xuống dòng và nhúng 4 sơ đồ kiến trúc & luồng xử lý chuyên sâu

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');


const TOC_ITEMS = [
  {
    "id": "sec1",
    "title": "1. Giới thiệu",
    "page": 4,
    "level": 1
  },
  {
    "id": "sec1_1",
    "title": "  1.1 Mục tiêu",
    "page": 4,
    "level": 2
  },
  {
    "id": "sec1_2",
    "title": "  1.2 Phạm vi của dự án",
    "page": 4,
    "level": 2
  },
  {
    "id": "sec1_2_1",
    "title": "    1.2.1. Phạm vi",
    "page": 4,
    "level": 3
  },
  {
    "id": "sec1_2_2",
    "title": "    1.2.2. Đối tượng sử dụng",
    "page": 4,
    "level": 3
  },
  {
    "id": "sec2",
    "title": "2. Yêu cầu kỹ thuật",
    "page": 6,
    "level": 1
  },
  {
    "id": "sec2_1",
    "title": "  2.1 Kiến trúc hạ tầng",
    "page": 6,
    "level": 2
  },
  {
    "id": "sec2_1_1",
    "title": "    2.1.1 Kiến trúc tổng thể",
    "page": 6,
    "level": 3
  },
  {
    "id": "sec2_1_2",
    "title": "    2.1.2 Kiến trúc chi tiết",
    "page": 9,
    "level": 3
  },
  {
    "id": "sec2_1_3",
    "title": "    2.1.3 Kiến trúc triển khai, dự phòng và an toàn",
    "page": 14,
    "level": 3
  },
  {
    "id": "sec2_2",
    "title": "  2.2 Công nghệ sử dụng",
    "page": 17,
    "level": 2
  },
  {
    "id": "sec2_3",
    "title": "  2.3 Yêu cầu chức năng",
    "page": 18,
    "level": 2
  },
  {
    "id": "sec2_3_1",
    "title": "    2.3.1 Các chức năng chung",
    "page": 18,
    "level": 3
  },
  {
    "id": "sec2_3_2",
    "title": "    2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)",
    "page": 19,
    "level": 3
  },
  {
    "id": "sec2_3_3",
    "title": "    2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViOne (20 Phân hệ)",
    "page": 31,
    "level": 3
  },
  {
    "id": "sec2_4",
    "title": "  2.4 Các yêu cầu phi chức năng khác",
    "page": 43,
    "level": 2
  },
  {
    "id": "sec2_4_1",
    "title": "    2.4.1 Yêu cầu về hiệu năng (Performance Requirements)",
    "page": 43,
    "level": 3
  },
  {
    "id": "sec2_4_2",
    "title": "    2.4.2 Yêu cầu về bảo mật (Security Requirements)",
    "page": 43,
    "level": 3
  },
  {
    "id": "sec2_4_3",
    "title": "    2.4.3 Yêu cầu tuân thủ (Compliance Requirements)",
    "page": 43,
    "level": 3
  },
  {
    "id": "app1",
    "title": "PHỤ LỤC I - Yêu cầu kỹ thuật của phần mềm (Đặc tả CSDL, API, Socket.IO)",
    "page": 44,
    "level": 1
  },
  {
    "id": "app2",
    "title": "PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)",
    "page": 48,
    "level": 1
  },
  {
    "id": "app2_crm_1",
    "title": "  1. Phân hệ Đăng nhập Quản trị & Xác thực Đa tầng",
    "page": 48,
    "level": 2
  },
  {
    "id": "app2_crm_2",
    "title": "  2. Phân hệ Bảng Điều Hành C-Level Dashboard & KPI Dòng Tiền Realtime",
    "page": 49,
    "level": 2
  },
  {
    "id": "app2_crm_3",
    "title": "  3. Phân hệ Quản Trị Danh Sách Doanh Nghiệp & Hồ Sơ Doanh Nhân 360",
    "page": 50,
    "level": 2
  },
  {
    "id": "app2_crm_4",
    "title": "  4. Phân hệ Quản Trị Cơ Hội Kinh Doanh & Phễu Bán Hàng B2B Deals",
    "page": 51,
    "level": 2
  },
  {
    "id": "app2_crm_5",
    "title": "  5. Phân hệ Quản Trị Danh Thiếp Thông Minh VIP vCard & Mã QR Động",
    "page": 52,
    "level": 2
  },
  {
    "id": "app2_crm_6",
    "title": "  6. Phân hệ Quản Trị Sàn Giao Thương B2B & Gian Hàng Sản Phẩm Doanh Nghiệp",
    "page": 53,
    "level": 2
  },
  {
    "id": "app2_crm_7",
    "title": "  7. Phân hệ Quản Trị Sự Kiện Doanh Nhân & Phân Hạng Vé Bán Qua VNPay",
    "page": 54,
    "level": 2
  },
  {
    "id": "app2_crm_8",
    "title": "  8. Phân hệ Quản Trị Cổng Soát Vé Điện Tử & Check-in QR Siêu Tốc <100ms",
    "page": 55,
    "level": 2
  },
  {
    "id": "app2_crm_9",
    "title": "  9. Phân hệ Quản Trị Quy Trình Vận Hành BPMN 2.0 & Bảng Việc Kanban",
    "page": 56,
    "level": 2
  },
  {
    "id": "app2_crm_10",
    "title": "  10. Phân hệ Quản Trị Chấm Công Định Vị AI GPS & Chuyên Cần Doanh Nghiệp",
    "page": 57,
    "level": 2
  },
  {
    "id": "app2_crm_11",
    "title": "  11. Phân hệ Quản Trị Dòng Tiền Thu & Báo Cáo Doanh Thu Bán Vé VNPay",
    "page": 58,
    "level": 2
  },
  {
    "id": "app2_crm_12",
    "title": "  12. Phân hệ Quản Trị Phê Duyệt Chi Tiền 3 Cấp & Ngân Sách Dự Án",
    "page": 59,
    "level": 2
  },
  {
    "id": "app2_crm_13",
    "title": "  13. Phân hệ Quản Trị Phí Thường Niên Định Kỳ & Công Nợ Doanh Nghiệp",
    "page": 60,
    "level": 2
  },
  {
    "id": "app2_crm_14",
    "title": "  14. Phân hệ Quản Trị Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport",
    "page": 61,
    "level": 2
  },
  {
    "id": "app2_crm_15",
    "title": "  15. Phân hệ Quản Trị Giải Chạy Bộ ViOne Run Marathon & Chip Timing RFID UHF",
    "page": 62,
    "level": 2
  },
  {
    "id": "app2_crm_16",
    "title": "  16. Phân hệ Quản Trị Không Gian Trưng Bày Bảo Tàng Số 3D & Hiện Vật NFC ViOne Museum",
    "page": 63,
    "level": 2
  },
  {
    "id": "app2_crm_17",
    "title": "  17. Phân hệ Quản Trị & Số Hóa Di Sản Văn Hóa ViOne Heritage",
    "page": 64,
    "level": 2
  },
  {
    "id": "app2_crm_18",
    "title": "  18. Phân hệ Quản Trị Vé Sự Kiện Điện Tử & Mã Hóa Chống Giả ViOne Tickets",
    "page": 65,
    "level": 2
  },
  {
    "id": "app2_crm_19",
    "title": "  19. Phân hệ Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp Đa Tầng ViOne Archive (/documents)",
    "page": 66,
    "level": 2
  },
  {
    "id": "app2_crm_20",
    "title": "  20. Phân hệ Quản Trị Biểu Quyết, Khảo Sát & Bỏ Phiếu Tín Nhiệm Số",
    "page": 67,
    "level": 2
  },
  {
    "id": "app2_crm_21",
    "title": "  21. Phân hệ Cấu Hình Phân Quyền RBAC Ma Trận Vai Trò & Nhật Ký Kiểm Toán Audit Log",
    "page": 68,
    "level": 2
  },
  {
    "id": "app2_crm_22",
    "title": "  22. Phân hệ Trợ Lý Trí Tuệ Nhân Tạo & Bóc Tách Dữ Liệu AI OCR ViOne AI",
    "page": 69,
    "level": 2
  },
  {
    "id": "app2_crm_23",
    "title": "  23. Phân hệ Cấu Hình Nền Tảng, Tích Hợp Zalo OA & Cổng Thanh Toán VNPay",
    "page": 70,
    "level": 2
  },
  {
    "id": "app3",
    "title": "PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIONE (20 PHÂN HỆ MOCKUP)",
    "page": 71,
    "level": 1
  },
  {
    "id": "app3_mob_1",
    "title": "  1. Phân hệ Màn hình Đăng nhập Di động Chuẩn Obsidian Luxury & Sinh trắc học Biometrics",
    "page": 71,
    "level": 2
  },
  {
    "id": "app3_mob_2",
    "title": "  2. Phân hệ Trang chủ Điều hành C-Level Executive Home & Widget Chỉ số Realtime",
    "page": 72,
    "level": 2
  },
  {
    "id": "app3_mob_3",
    "title": "  3. Phân hệ Danh thiếp Số vCard & Chạm 1-Tap NFC Vật lý Độc quyền",
    "page": 73,
    "level": 2
  },
  {
    "id": "app3_mob_4",
    "title": "  4. Phân hệ Menu Điều phối Nổi Độc Quyền VActionSheet 3D Dập Nổi Vàng Hoàng Gia",
    "page": 74,
    "level": 2
  },
  {
    "id": "app3_mob_5",
    "title": "  5. Phân hệ Quét Thẻ Thông Minh & Bóc Tách Danh Thiếp Tự Động AI OCR",
    "page": 75,
    "level": 2
  },
  {
    "id": "app3_mob_6",
    "title": "  6. Phân hệ Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS Geolocation",
    "page": 76,
    "level": 2
  },
  {
    "id": "app3_mob_7",
    "title": "  7. Phân hệ Khoảnh Khắc Doanh Nhân & Bảng Tin Tương Tác Doanh Nghiệp",
    "page": 77,
    "level": 2
  },
  {
    "id": "app3_mob_8",
    "title": "  8. Phân hệ Hộp Thư Tin Nhắn Trực Tiếp & Phòng Trò Chuyện Nhóm Socket.IO",
    "page": 78,
    "level": 2
  },
  {
    "id": "app3_mob_9",
    "title": "  9. Phân hệ Không Gian Cộng Đồng & Diễn Đàn Kết Nối Thương Mại",
    "page": 79,
    "level": 2
  },
  {
    "id": "app3_mob_10",
    "title": "  10. Phân hệ Bàn Làm Việc Cá Nhân, Nhiệm Vụ Hôm Nay & Tiến Độ Kanban Mobile",
    "page": 80,
    "level": 2
  },
  {
    "id": "app3_mob_11",
    "title": "  11. Phân hệ Hồ Sơ Cá Nhân VIP, Quản Trị Danh Mục Yêu Thích & Cài Đặt Ứng Dụng",
    "page": 81,
    "level": 2
  },
  {
    "id": "app3_mob_12",
    "title": "  12. Phân hệ Quản Trị & Xuất Bản Danh Thiếp Số Cá Nhân Hóa (Custom vCard QR)",
    "page": 82,
    "level": 2
  },
  {
    "id": "app3_mob_13",
    "title": "  13. Phân hệ Máy Quét Thông Minh Toàn Năng (Smart Scanner: QR / Barcode / NFC / OCR)",
    "page": 83,
    "level": 2
  },
  {
    "id": "app3_mob_14",
    "title": "  14. Phân hệ Trung Tâm Bảo Mật Cá Nhân, Đổi Mật Khẩu & Xác Thực Hai Lớp (2FA)",
    "page": 84,
    "level": 2
  },
  {
    "id": "app3_mob_15",
    "title": "  15. Phân hệ Trung Tâm Thông Báo Đa Kênh & Đồng Bộ Lịch Sự Kiện Cá Nhân",
    "page": 85,
    "level": 2
  },
  {
    "id": "app3_mob_16",
    "title": "  16. Phân hệ Ví Vé Sự Kiện Điện Tử Thông Minh & Check-in Offline Mã QR",
    "page": 86,
    "level": 2
  },
  {
    "id": "app3_mob_17",
    "title": "  17. Phân hệ Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport Trên Di Động",
    "page": 88,
    "level": 2
  },
  {
    "id": "app3_mob_18",
    "title": "  18. Phân hệ Giải Chạy Bộ ViOne Run Marathon & Chip Timing RFID Di Động",
    "page": 92,
    "level": 2
  },
  {
    "id": "app3_mob_19",
    "title": "  19. Phân hệ Khám Phá Bảo Tàng Số 3D & Thuyết Minh 1-Chạm NFC ViOne Museum",
    "page": 96,
    "level": 2
  },
  {
    "id": "app3_mob_20",
    "title": "  20. Phân hệ Khám Phá Di Sản Văn Hóa & Bản Đồ Số Di Tích Lịch Sử ViOne Heritage",
    "page": 100,
    "level": 2
  },
  {
    "id": "app4",
    "title": "PHỤ LỤC IV - Mã nguồn phần mềm (18 Mô-đun Hệ thống Cốt lõi)",
    "page": 106,
    "level": 1
  },
  {
    "id": "app4_file_1",
    "title": "  1. Mã Nguồn Cổng Web Quản Trị ViOne Platform (CRM)",
    "page": 106,
    "level": 2
  },
  {
    "id": "app4_file_7",
    "title": "  2. Mã Nguồn Máy Chủ Xử Lý Nghiệp Vụ Trung Tâm (Backend Core)",
    "page": 165,
    "level": 2
  },
  {
    "id": "app4_file_11",
    "title": "  3. Mã Nguồn Giao Diện Điều Hành & Dashboard ViOne",
    "page": 271,
    "level": 2
  },
  {
    "id": "app4_file_18",
    "title": "  4. Mã Nguồn Ứng Dụng Di Động ViOne Native Mobile App",
    "page": 433,
    "level": 2
  }
];

const { EXACT_TITLE_UPPER, EXACT_TITLE, META_INFO, ACTORS } = require('./content_vione_meta');
const { SECTION_1, SECTION_2_TECH } = require('./content_vione_section1_2');
const { ARCH_TABLE_01, ARCH_TABLE_02, ARCH_TABLE_03, ARCH_TABLE_04 } = require('./content_vione_arch_tables');
const { CRM_MODULES } = require('./content_vione_crm');
const { MOBILE_MODULES } = require('./content_vione_mobile');
const { APPENDIX_I } = require('./content_vione_appendices');
const { loadAllCodeFiles } = require('./content_vione_code_loader');

// MÀU SẮC CHUẨN THƯƠNG HIỆU VIONE (CHAMPAGNE GOLD & OBSIDIAN LUXURY)
const VIONE_COLORS = {
  goldRoyalDark: '8C653B',   // Vàng hoàng gia đậm cổ điển (Title, Heading 1, Heading 4, Borders)
  goldMetallic: 'B38646',    // Vàng kim champagne kim loại (Heading 2)
  goldLight: 'F6E1C3',       // Vàng champagne sáng (Table header text)
  goldBorder: 'D8B282',      // Viền mạ vàng
  goldRowBg: 'FCFAF6',       // Nền vàng kem siêu nhẹ cho bảng
  obsidianDeep: '050C15',    // Đen thạch anh obsidian sâu thẳm
  obsidianTableBg: '0E1724', // Đen thạch anh xanh obsidian cho header bảng
  obsidianText: '1A2332',    // Đen obsidian đậm (Heading 3)
  textNormal: '000000'
};

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
    size = 24, // 12pt default (half-points)
    color = VIONE_COLORS.textNormal,
    align = 'both',
    before = 0,
    after = 100,
    line = 240,
    pageBreak = false,
    keepNext = false,
    pStyle = null
  } = opts;

  let pPr = '<w:pPr>';
  if (pStyle) pPr += `<w:pStyle w:val="${pStyle}"/>`;
  if (pageBreak) pPr += '<w:pageBreakBefore/>';
  if (keepNext) pPr += '<w:keepNext w:val="1"/>';
  if (align) pPr += `<w:jc w:val="${align}"/>`;
  pPr += `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;
  pPr += '</w:pPr>';

  const rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${bold ? '<w:b/><w:bCs/>' : ''}${italic ? '<w:i/><w:iCs/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`;

  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function makeHeading(text, level = 1, pageBreak = false) {
  const configs = {
    1: { style: 'Heading1', size: 30, color: VIONE_COLORS.goldRoyalDark, before: 260, after: 120, bold: true }, // 15pt Vàng Hoàng Gia
    2: { style: 'Heading2', size: 26, color: VIONE_COLORS.goldMetallic, before: 200, after: 100, bold: true },  // 13pt Vàng Kim
    3: { style: 'Heading3', size: 24, color: VIONE_COLORS.obsidianText, before: 160, after: 80, bold: true },   // 12pt Đen Obsidian
    4: { style: 'Heading4', size: 24, color: VIONE_COLORS.goldRoyalDark, before: 140, after: 60, bold: true }   // 12pt Vàng Hoàng Gia
  };
  const cfg = configs[level] || configs[1];
  return makeP(text, {
    pStyle: cfg.style,
    bold: cfg.bold,
    size: cfg.size,
    color: cfg.color,
    before: cfg.before,
    after: cfg.after,
    align: 'left',
    keepNext: true,
    pageBreak
  });
}

function makeBullet(text, boldPrefix = '') {
  let pPr = '<w:pPr><w:pStyle w:val="ListParagraph"/><w:ind w:left="480" w:hanging="240"/><w:spacing w:before="40" w:after="60"/><w:jc w:val="both"/></w:pPr>';
  let rContent = '';
  const rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="${VIONE_COLORS.textNormal}"/></w:rPr>`;
  const rPrBold = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="${VIONE_COLORS.goldRoyalDark}"/></w:rPr>`;

  rContent += `<w:r>${rPr}<w:t xml:space="preserve">• </w:t></w:r>`;
  if (boldPrefix) {
    rContent += `<w:r>${rPrBold}<w:t xml:space="preserve">${escapeXml(boldPrefix)} </w:t></w:r>`;
  }
  rContent += `<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;

  return `<w:p>${pPr}${rContent}</w:p>`;
}

function makePWithBoldPrefix(prefix, body, opts = {}) {
  const {
    before = 60,
    after = 60,
    line = 240,
    prefixColor = VIONE_COLORS.goldRoyalDark,
    textColor = VIONE_COLORS.textNormal,
    size = 24
  } = opts;
  let pPr = `<w:pPr><w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr>`;
  let rContent = `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:b/><w:bCs/><w:color w:val="${prefixColor}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escapeXml(prefix)} </w:t></w:r>`;
  if (body) {
    rContent += `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:color w:val="${textColor}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escapeXml(body)}</w:t></w:r>`;
  }
  return `<w:p>${pPr}${rContent}</w:p>`;
}

// BỘ GIẢI MÃ ĐA ĐOẠN ĐẢM BẢO XUỐNG DÒNG, THỤT LỀ VÀ ĐỊNH DẠNG BULLET CHUẨN XÁC
function renderFormattedTextBlock(text) {
  if (!text) return '';
  let xml = '';
  const lines = text.split('\n');

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check if line is a numbered item: "1. Tiêu đề..."
    const numMatch = line.match(/^(\d+\.)\s+(.*)/);
    if (numMatch) {
      const numPrefix = numMatch[1];
      const rest = numMatch[2];
      const colonIdx = rest.indexOf(':');
      if (colonIdx !== -1 && colonIdx < 80) {
        const title = rest.substring(0, colonIdx + 1);
        const body = rest.substring(colonIdx + 1).trim();
        xml += makePWithBoldPrefix(numPrefix + ' ' + title, body, {
          before: 80,
          after: 50,
          prefixColor: VIONE_COLORS.goldRoyalDark
        });
      } else {
        xml += makePWithBoldPrefix(numPrefix, rest, {
          before: 80,
          after: 50,
          prefixColor: VIONE_COLORS.goldRoyalDark
        });
      }
      continue;
    }

    // Check if line is a bullet item: "- ..." or "• ..."
    const bulletMatch = line.match(/^[-•*]\s+(.*)/);
    if (bulletMatch) {
      const rest = bulletMatch[1];
      const colonIdx = rest.indexOf(':');
      if (colonIdx !== -1 && colonIdx < 60) {
        const title = rest.substring(0, colonIdx + 1);
        const body = rest.substring(colonIdx + 1).trim();
        xml += makeBullet(body, title);
      } else {
        xml += makeBullet(rest);
      }
      continue;
    }

    // Normal prose paragraph
    xml += makeP(line, { before: 40, after: 80, align: 'both' });
  }
  return xml;
}

function makeTable(headers, rows, colWidths = []) {
  let xml = `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9200" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders><w:top w:val="single" w:sz="6" w:space="0" w:color="${VIONE_COLORS.goldBorder}"/><w:left w:val="none"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="${VIONE_COLORS.goldBorder}"/><w:right w:val="none"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="EAE3D9"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr>`;

  if (colWidths.length > 0) {
    xml += '<w:tblGrid>';
    colWidths.forEach(w => {
      xml += `<w:gridCol w:w="${w}"/>`;
    });
    xml += '</w:tblGrid>';
  }

  // Header Row - NỀN ĐEN THẠCH ANH OBSIDIAN & CHỮ VÀNG CHAMPAGNE GOLD
  xml += '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>';
  headers.forEach((h, idx) => {
    const w = colWidths[idx] || 2000;
    xml += `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${VIONE_COLORS.obsidianTableBg}"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:before="70" w:after="70"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="22"/><w:color w:val="${VIONE_COLORS.goldLight}"/></w:rPr><w:t xml:space="preserve">${escapeXml(h)}</w:t></w:r></w:p></w:tc>`;
  });
  xml += '</w:tr>';

  // Data Rows - XEN KẼ TRẮNG VÀ VÀNG KEM SIÊU NHẸ
  rows.forEach((row, rIdx) => {
    const bgFill = rIdx % 2 === 1 ? VIONE_COLORS.goldRowBg : 'FFFFFF';
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


function makeTocLine(title, pageNum, level = 1) {
  const indent = level === 1 ? 0 : (level === 2 ? 280 : 560);
  const bold = level === 1;
  const color = bold ? VIONE_COLORS.goldRoyalDark : VIONE_COLORS.obsidianText;
  const size = 24;
  return `<w:p><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9061"/></w:tabs><w:spacing w:before="24" w:after="24" w:line="240" w:lineRule="auto"/><w:ind w:left="${indent}" w:right="0" w:firstLine="0"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${bold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="${color}"/></w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t><w:tab/><w:t xml:space="preserve">${pageNum}</w:t></w:r></w:p>`;
}

function makeImageDrawing(rId, docPrId, type = 'desktop') {
  let cx, cy;
  if (type === 'mobile') {
    cx = 3017520; // 3.3 in
    cy = 5943600; // 6.5 in
  } else if (type === 'diagram' || type === 'diagram_landscape') {
    // Kích thước chuẩn tài liệu Uniwork trên trang nằm ngang (Landscape):
    // Rộng 8.9 inch (8166666 EMU), Cao 5.35 inch (4900000 EMU), cực kỳ to rõ ràng, không bị che khuất
    cx = 8166666;
    cy = 4900000;
  } else {
    // desktop
    cx = 5669280; // 6.2 in
    cy = 3337560; // 3.65 in
  }
  return `<w:p><w:pPr><w:spacing w:before="120" w:after="80"/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${docPrId}" name="Picture ${docPrId}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${docPrId}" name="Picture ${docPrId}"/><pic:cNvPicPr><a:picLocks noChangeAspect="1"/></pic:cNvPicPr></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}


// CÁC ĐỊNH NGHĨA SECTION BREAK PORTRAIT / LANDSCAPE CHUẨN UNIWORK
const sectPrPortrait = (rIdHdr, rIdFtr) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:sectPr><w:type w:val="nextPage"/><w:headerReference w:type="default" r:id="${rIdHdr}"/><w:footerReference w:type="default" r:id="${rIdFtr}"/><w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="720" w:footer="720" w:gutter="0"/><w:docGrid w:linePitch="360"/></w:sectPr></w:pPr></w:p>`;

const sectPrLandscape = (rIdHdr, rIdFtr) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:sectPr><w:type w:val="nextPage"/><w:headerReference w:type="default" r:id="${rIdHdr}"/><w:footerReference w:type="default" r:id="${rIdFtr}"/><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:pPr></w:p>`;

function makeFigureCaption(captionText) {
  return `<w:p><w:pPr><w:spacing w:before="40" w:after="160"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="21"/><w:szCs w:val="21"/><w:color w:val="${VIONE_COLORS.goldRoyalDark}"/></w:rPr><w:t xml:space="preserve">${escapeXml(captionText)}</w:t></w:r></w:p>`;
}

function makeCodeLine(line) {
  const safe = escapeXml(line);
  return `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="200" w:lineRule="exact"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="24292E"/></w:rPr><w:t xml:space="preserve">${safe || ' '}</w:t></w:r></w:p>`;
}

async function buildMasterDocxAndMd() {
  console.log('========================================================================');
  console.log('=== KHỞI CHẠY TẠO MASTER TÀI LIỆU VIONE PLATFORM (BẢN QUYỀN TÁC GIẢ) ===');
  console.log('=== CHUẨN THƯƠNG HIỆU VÀNG CHAMPAGNE GOLD & ĐEN THẠCH ANH OBSIDIAN   ===');
  console.log('========================================================================');

  const baseDocxPath = 'scratch/docx_9aff451.docx';
  if (!fs.existsSync(baseDocxPath)) {
    throw new Error(`Không tìm thấy file base: ${baseDocxPath}`);
  }

  const baseBuf = fs.readFileSync(baseDocxPath);
  const zip = await JSZip.loadAsync(baseBuf);

  // 1. Nhúng toàn bộ 47 ảnh (4 Sơ đồ + 23 CRM Desktop + 20 Mobile App) vào ZIP
  const relsXmlPath = 'word/_rels/document.xml.rels';
  let relsXml = await zip.file(relsXmlPath).async('string');

  let nextRId = 600;
  let nextDocPrId = 6000;

  // 4 Architecture Diagrams
  const DIAGRAM_FILES = [
    { id: 1, file: 'diagram_01_overall_architecture.png', title: 'Hình 2.1 – Sơ Đồ Kiến Trúc Tổng Thể Nền Tảng ViOne Platform (Hợp Nhất Web CRM & App Mobile)' },
    { id: 2, file: 'diagram_02_crm_workflow.png', title: 'Hình 2.2 – Sơ Đồ Luồng Nghiệp Vụ & Dữ Liệu Cổng Web Quản Trị ViOne Platform (CRM Enterprise)' },
    { id: 3, file: 'diagram_03_mobile_app_architecture.png', title: 'Hình 2.3 – Sơ Đồ Kiến Trúc Xử Lý & Luồng Trải Nghiệm Ứng Dụng Di Động ViOne (Mobile App)' },
    { id: 4, file: 'diagram_04_deployment_topology.png', title: 'Hình 2.4 – Sơ Đồ Kiến Trúc Triển Khai Phân Lập, An Toàn & Dự Phòng Hạ Tầng ViOne Platform' }
  ];

  for (const diag of DIAGRAM_FILES) {
    const imgPath = path.join('document/images/evidence_v9', diag.file);
    if (!fs.existsSync(imgPath)) {
      console.error(`Không tìm thấy sơ đồ: ${imgPath}`);
      continue;
    }
    const imgBuf = fs.readFileSync(imgPath);
    const mediaName = `media/vione_diag_${diag.id}.png`;
    zip.file(`word/${mediaName}`, imgBuf);

    const rId = `rIdDiag${nextRId++}`;
    const docPrId = nextDocPrId++;

    const relEntry = `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${mediaName}"/>`;
    relsXml = relsXml.replace('</Relationships>', `${relEntry}</Relationships>`);

    diag.rId = rId;
    diag.docPrId = docPrId;
  }

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

  // 20 Mobile Images & Sub-screens
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

    if (mod.subScreens && mod.subScreens.length > 0) {
      for (const sub of mod.subScreens) {
        const subImgPath = path.join('document/images/evidence_v9', sub.imgFile);
        if (fs.existsSync(subImgPath)) {
          const subImgBuf = fs.readFileSync(subImgPath);
          const subMediaName = `media/vione_sub_${sub.imgFile}`;
          zip.file(`word/${subMediaName}`, subImgBuf);

          const subRId = `rIdAPP${nextRId++}`;
          const subDocPrId = nextDocPrId++;

          const subRelEntry = `<Relationship Id="${subRId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${subMediaName}"/>`;
          relsXml = relsXml.replace('</Relationships>', `${subRelEntry}</Relationships>`);

          sub.rId = subRId;
          sub.docPrId = subDocPrId;
        } else {
          console.warn(`Không tìm thấy ảnh subScreen: ${subImgPath}`);
        }
      }
    }
  }

  zip.file(relsXmlPath, relsXml);

  // Cập nhật Header: Loại bỏ 100% cụm từ "Hệ Sinh Thái" theo yêu cầu người dùng
  for (const fname in zip.files) {
    if (fname.startsWith('word/header') && fname.endsWith('.xml')) {
      let hdrXml = await zip.file(fname).async('string');
      hdrXml = hdrXml.replace(/Hệ Sinh Thái ViOne:?/g, 'ViOne Platform:');
      hdrXml = hdrXml.replace(/Hệ Sinh Thái\s*:?/g, '');
      zip.file(fname, hdrXml);
    }
  }

  console.log('1. Đã nhúng 47 ảnh (4 Sơ đồ nền trắng + 43 Giao diện live) vào DOCX và cập nhật relationships & header thành công!');

  // 2. XÂY DỰNG TOÀN BỘ NỘI DUNG OPENXML
  let bodyXml = '';

  // TRANG BÌA - GIỮ NGUYÊN CÁC TRƯỜNG THÔNG TIN TÁC GIẢ, CÔNG TY ĐỂ TRỐNG DƯỚI DẠNG DẤU CHẤM DÀI
  // TRANG BÌA - GIỮ NGUYÊN CÁC TRƯỜNG THÔNG TIN TÁC GIẢ, CÔNG TY ĐỂ TRỐNG DƯỚI DẠNG DẤU CHẤM DÀI (CĂN TRÁI CHUẨN XÁC, KHÔNG GIÃN DÒNG)
  bodyXml += makeP('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 28, align: 'center', after: 40 });
  bodyXml += makeP('Độc lập – Tự do – Hạnh phúc', { bold: true, size: 26, align: 'center', after: 100 });
  bodyXml += makeP('-------------------***-------------------', { align: 'center', after: 200 });
  bodyXml += makeP('TÀI LIỆU KỸ THUẬT & TRÌNH BÀY TÁC PHẨM', { bold: true, size: 26, align: 'center', after: 40 });
  bodyXml += makeP('ĐĂNG KÝ QUYỀN TÁC GIẢ ĐỐI VỚI CHƯƠNG TRÌNH MÁY TÍNH', { bold: true, size: 24, align: 'center', after: 200 });
  bodyXml += makeP('CHƯƠNG TRÌNH MÁY TÍNH:', { bold: true, size: 26, align: 'center', after: 40 });
  bodyXml += makeP(EXACT_TITLE_UPPER, { bold: true, size: 30, color: VIONE_COLORS.goldRoyalDark, align: 'center', after: 80 });
  bodyXml += makeP(META_INFO.subtitle, { bold: true, size: 24, color: VIONE_COLORS.goldMetallic, align: 'center', after: 160 });
  bodyXml += makeP('(Không bao gồm dữ liệu)', { italic: true, size: 22, align: 'center', after: 240 });

  bodyXml += makeP('MÔI TRƯỜNG TRIỂN KHAI VẬN HÀNH HỆ THỐNG:', { bold: true, size: 24, color: VIONE_COLORS.goldRoyalDark, align: 'left', before: 100, after: 60 });
  META_INFO.deployEnv.forEach(env => {
    bodyXml += makeP(env, { align: 'left', after: 40 });
  });

  bodyXml += makeP('Chủ sở hữu quyền tác giả:', { bold: true, size: 24, color: VIONE_COLORS.goldRoyalDark, align: 'left', before: 140, after: 60 });
  bodyXml += makeP('- Tên tổ chức / doanh nghiệp: ..........................................................................................................', { size: 24, align: 'left', after: 60 });
  bodyXml += makeP('- Mã số doanh nghiệp: ...................................................................................................................', { size: 24, align: 'left', after: 60 });
  bodyXml += makeP('- Địa chỉ trụ sở chính: .....................................................................................................................', { size: 24, align: 'left', after: 60 });
  bodyXml += makeP('- Số điện thoại: ............................................................ Email: ......................................................', { size: 24, align: 'left', after: 60 });
  bodyXml += makeP('- Tác giả: .........................................................................................................................................', { bold: true, size: 24, align: 'left', after: 120 });

  bodyXml += makeP(META_INFO.locationDate, { italic: true, size: 24, align: 'center', before: 160, after: 200 });

  // Page break để bắt đầu Mục lục từ trang 2 riêng biệt
  bodyXml += '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';

  // MỤC LỤC TỔNG THỂ (CÓ ĐÁNH SỐ THỨ TỰ, DẤU CHẤM DẪN ĐƯỜNG VÀ SỐ TRANG CHUẨN XÁC)
  bodyXml += makeHeading('MỤC LỤC TỔNG THỂ', 1);
  bodyXml += '<w:p><w:pPr><w:spacing w:before="40" w:after="100"/></w:pPr><w:fldSimple w:instr="TOC \\o &quot;1-3&quot; \\h \\z \\u"/></w:p>';

  // Render danh sách mục lục tĩnh chuẩn Word với tab leader dot
  TOC_ITEMS.forEach(item => {
    bodyXml += makeTocLine(item.title, item.page, item.level);
  });

  // Page break để bắt đầu Chương 1 từ trang mới
  bodyXml += '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';

  // CHƯƠNG 1: GIỚI THIỆU
  bodyXml += makeHeading('1. Giới thiệu', 1, true);
  bodyXml += makeHeading('1.1 Mục tiêu', 2);
  bodyXml += renderFormattedTextBlock(SECTION_1.mucTieu);

  bodyXml += makeHeading('1.2 Phạm vi của dự án', 2);
  bodyXml += makeHeading('1.2.1. Phạm vi', 3);
  bodyXml += renderFormattedTextBlock(SECTION_1.phamVi);

  bodyXml += makeHeading('1.2.2. Đối tượng sử dụng', 3);
  bodyXml += renderFormattedTextBlock(SECTION_1.doiTuong);

  const actorHeaders = ['STT', 'Mã Tác Nhân', 'Tên Tác Nhân & Phân Vai', 'Mô Tả Nhiệm Vụ & Quyền Hạn Trong Hệ Thống'];
  const actorRows = ACTORS.map((act, idx) => [
    String(idx + 1),
    act.code,
    act.name,
    act.desc
  ]);
  bodyXml += makeTable(actorHeaders, actorRows, [600, 1400, 2800, 4400]);

  // CHƯƠNG 2: YÊU CẦU KỸ THUẬT
  bodyXml += makeHeading('2. Yêu cầu kỹ thuật', 1, true);
  bodyXml += makeHeading('2.1 Kiến trúc hạ tầng', 2);

  // 2.1.1 Kiến trúc tổng thể + SƠ ĐỒ HÌNH 2.1 (LANDSCAPE)
  bodyXml += makeHeading('2.1.1 Kiến trúc tổng thể', 3);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.kientrucTongThe);

  // TRANSITION SANG TRANG NẰM NGANG (LANDSCAPE) CHO SƠ ĐỒ HÌNH 2.1
  bodyXml += sectPrPortrait('rId6', 'rId7');
  bodyXml += makeImageDrawing(DIAGRAM_FILES[0].rId, DIAGRAM_FILES[0].docPrId, 'diagram_landscape');
  bodyXml += makeFigureCaption(DIAGRAM_FILES[0].title);

  // TRANSITION TRỞ LẠI TRANG ĐỨNG (PORTRAIT) CHO BẢNG ARCH_TABLE_01
  bodyXml += sectPrLandscape('rId6', 'rId7');
  bodyXml += makeP('Để làm rõ các luồng trao đổi dữ liệu và tương tác kỹ thuật giữa các tầng phân lớp trong Hình 2.1, bảng kiến trúc tổng thể dưới đây trình bày chi tiết các khối chức năng cốt lõi của nền tảng ViOne Platform:', { after: 80 });
  bodyXml += makeTable(ARCH_TABLE_01.headers, ARCH_TABLE_01.rows, ARCH_TABLE_01.widths);

  // 2.1.2 Kiến trúc chi tiết + SƠ ĐỒ HÌNH 2.2 & HÌNH 2.3 (LANDSCAPE)
  bodyXml += makeHeading('2.1.2 Kiến trúc chi tiết', 3, true);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.kientrucChiTiet);

  // TRANSITION SANG TRANG NẰM NGANG (LANDSCAPE) CHO SƠ ĐỒ HÌNH 2.2 & 2.3
  bodyXml += sectPrPortrait('rId6', 'rId7');
  bodyXml += makeImageDrawing(DIAGRAM_FILES[1].rId, DIAGRAM_FILES[1].docPrId, 'diagram_landscape');
  bodyXml += makeFigureCaption(DIAGRAM_FILES[1].title);

  bodyXml += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  bodyXml += makeImageDrawing(DIAGRAM_FILES[2].rId, DIAGRAM_FILES[2].docPrId, 'diagram_landscape');
  bodyXml += makeFigureCaption(DIAGRAM_FILES[2].title);

  // TRANSITION TRỞ LẠI TRANG ĐỨNG (PORTRAIT) CHO BẢNG ARCH_TABLE_02 & 03
  bodyXml += sectPrLandscape('rId6', 'rId7');
  bodyXml += makeP('Quy trình điều phối và luồng luân chuyển dữ liệu nghiệp vụ trọng yếu của Cổng Web Quản Trị ViOne CRM được chuẩn hóa theo bảng sau:', { after: 80 });
  bodyXml += makeTable(ARCH_TABLE_02.headers, ARCH_TABLE_02.rows, ARCH_TABLE_02.widths);

  bodyXml += makeP('Kiến trúc phân rã các mô-đun phần cứng và trải nghiệm tương tác trên Ứng dụng Di động ViOne (ViOne Connect) được mô tả chi tiết tại bảng sau:', { before: 100, after: 80 });
  bodyXml += makeTable(ARCH_TABLE_03.headers, ARCH_TABLE_03.rows, ARCH_TABLE_03.widths);

  // 2.1.3 Kiến trúc triển khai, dự phòng và an toàn + SƠ ĐỒ HÌNH 2.4 (LANDSCAPE)
  bodyXml += makeHeading('2.1.3 Kiến trúc triển khai, dự phòng và an toàn', 3, true);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.kientrucTrienKhai);

  // TRANSITION SANG TRANG NẰM NGANG (LANDSCAPE) CHO SƠ ĐỒ HÌNH 2.4
  bodyXml += sectPrPortrait('rId6', 'rId7');
  bodyXml += makeImageDrawing(DIAGRAM_FILES[3].rId, DIAGRAM_FILES[3].docPrId, 'diagram_landscape');
  bodyXml += makeFigureCaption(DIAGRAM_FILES[3].title);

  // TRANSITION TRỞ LẠI TRANG ĐỨNG (PORTRAIT) CHO BẢNG ARCH_TABLE_04 VÀ TOÀN BỘ PHẦN CÒN LẠI
  bodyXml += sectPrLandscape('rId6', 'rId7');
  bodyXml += makeP('Thông số cấu hình môi trường, cụm proxy độc lập và cơ chế an ninh, sao lưu dự phòng của hệ thống ViOne Platform được tổng hợp chi tiết theo bảng sau:', { after: 80 });
  bodyXml += makeTable(ARCH_TABLE_04.headers, ARCH_TABLE_04.rows, ARCH_TABLE_04.widths);

  // 2.2 Công nghệ sử dụng
  bodyXml += makeHeading('2.2 Công nghệ sử dụng', 2, true);
  bodyXml += makeP('Bảng tổng hợp các công nghệ nền tảng, framework và thư viện được sử dụng trong toàn bộ nền tảng ViOne Platform:', { after: 80 });

  const techHeaders = ['STT', 'Lĩnh Vực Công Nghệ', 'Nền Tảng / Thư Viện Sử Dụng & Chuẩn Kỹ Thuật'];
  const techRows = SECTION_2_TECH.congNghe.map(t => [
    String(t.stt),
    t.linhVuc,
    t.congNghe
  ]);
  bodyXml += makeTable(techHeaders, techRows, [800, 2800, 5600]);

  // 2.3 Yêu cầu chức năng
  bodyXml += makeHeading('2.3 Yêu cầu chức năng', 2, true);
  bodyXml += makeHeading('2.3.1 Các chức năng chung', 3);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.chucNangChung);

  // 2.3.2 CRM Modules
  bodyXml += makeHeading('2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)', 3, true);
  bodyXml += makeP('Cổng Web Quản Trị ViOne Platform (https://crm_vione.viconnect.vn) bao gồm 23 phân hệ nghiệp vụ hoàn chỉnh phục vụ quản trị và điều hành toàn diện tổ chức doanh nghiệp:', { after: 100 });

  CRM_MODULES.forEach(mod => {
    bodyXml += makeHeading(`${mod.subCode}. ${mod.name}`, 4);
    bodyXml += makeP(mod.generalDesc, { after: 80 });
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `Tác nhân: ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `Tác nhân: ${f.actorMain}`;
      bodyXml += makeBullet(`${f.desc} (${actorTag})`, `${f.name}:`);
    });
  });

  // 2.3.3 Mobile Modules
  bodyXml += makeHeading('2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViOne (20 Phân hệ)', 3, true);
  bodyXml += makeP('Ứng dụng Di động ViOne (ViOne Connect) bao gồm 20 phân hệ màn hình chức năng chuyên sâu phục vụ doanh nhân doanh nghiệp, vận động viên và khách tham quan:', { after: 100 });

  MOBILE_MODULES.forEach(mod => {
    bodyXml += makeHeading(`${mod.subCode}. ${mod.name}`, 4);
    bodyXml += makeP(mod.generalDesc, { after: 80 });
    mod.features.forEach(f => {
      const actorTag = f.actorSub ? `Tác nhân: ${f.actorMain} (tác nhân chính); ${f.actorSub}` : `Tác nhân: ${f.actorMain}`;
      bodyXml += makeBullet(`${f.desc} (${actorTag})`, `${f.name}:`);
    });
  });

  // 2.4 CÁC YÊU CẦU PHI CHỨC NĂNG KHÁC
  bodyXml += makeHeading('2.4 Các yêu cầu phi chức năng khác', 2, true);
  bodyXml += makeHeading('2.4.1 Yêu cầu về hiệu năng (Performance Requirements)', 3);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.yeuCauPhiChucNang.hieuNang);

  bodyXml += makeHeading('2.4.2 Yêu cầu về bảo mật (Security Requirements)', 3);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.yeuCauPhiChucNang.baoMat);

  bodyXml += makeHeading('2.4.3 Yêu cầu tuân thủ (Compliance Requirements)', 3);
  bodyXml += renderFormattedTextBlock(SECTION_2_TECH.yeuCauPhiChucNang.tuanThu);

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
  bodyXml += makeP('Danh mục các API RESTful phục vụ kết nối bảo mật giữa Cổng Web Quản Trị, Ứng dụng Di động ViOne và các dịch vụ bên ngoài:', { after: 80 });

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
    ['3', 'Thiết bị Di động ViOne (iOS / Android)', APPENDIX_I.hardwareSpecs.mobile.min, APPENDIX_I.hardwareSpecs.mobile.rec]
  ];
  bodyXml += makeTable(hwHeaders, hwRows, [600, 2400, 3100, 3100]);

  // PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG CỔNG WEB QUẢN TRỊ (23 PHÂN HỆ LIVE)
  bodyXml += makeHeading('PHỤ LỤC II – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - CỔNG WEB QUẢN TRỊ VIONE PLATFORM (23 PHÂN HỆ)', 1, true);
  bodyXml += makeP('Cổng Web Quản Trị ViOne Platform (https://crm_vione.viconnect.vn) cung cấp bộ công cụ điều hành trực quan trên màn hình máy tính desktop (độ phân giải chuẩn 1440x900). Dưới đây là hướng dẫn sử dụng chi tiết từng phân hệ nghiệp vụ:', { after: 120 });

  CRM_MODULES.forEach((mod, idx) => {
    bodyXml += makeHeading(`${idx + 1}. ${mod.name}`, 3);
    bodyXml += makeP(`Mục đích: ${mod.generalDesc}`, { after: 60 });
    bodyXml += makeP('Các bước thực hiện:', { bold: true, color: VIONE_COLORS.goldRoyalDark, after: 40 });
    mod.steps.forEach(step => {
      bodyXml += makeBullet(step);
    });
    bodyXml += makeImageDrawing(mod.rId, mod.docPrId, 'desktop');
    bodyXml += makeFigureCaption(mod.figTitle);
  });

  // PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG DI ĐỘNG VIONE (20 PHÂN HỆ MOCKUP)
  bodyXml += makeHeading('PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIONE (20 PHÂN HỆ MOCKUP)', 1, true);
  bodyXml += makeP('Ứng dụng di động ViOne (ViOne Connect) mang lại trải nghiệm điều hành và kết nối giao thương thượng lưu. Toàn bộ 20 màn hình dưới đây được trình bày chuẩn mực trong khung điện thoại thông minh Obsidian Luxury sang trọng:', { after: 120 });

  MOBILE_MODULES.forEach((mod, idx) => {
    bodyXml += makeHeading(`${idx + 1}. ${mod.name}`, 3);
    bodyXml += makeP(`Mục đích: ${mod.generalDesc}`, { after: 60 });
    bodyXml += makeP('Các bước thực hiện:', { bold: true, color: VIONE_COLORS.goldRoyalDark, after: 40 });
    mod.steps.forEach(step => {
      bodyXml += makeBullet(step);
    });
    bodyXml += makeImageDrawing(mod.rId, mod.docPrId, 'mobile');
    bodyXml += makeFigureCaption(mod.figTitle);

    if (mod.subScreens && mod.subScreens.length > 0) {
      mod.subScreens.forEach((sub, sIdx) => {
        bodyXml += makeHeading(`${idx + 1}.${sIdx + 1}. Giao diện mở rộng: ${sub.title}`, 4);
        bodyXml += makeP(sub.desc, { after: 60 });
        if (sub.rId) {
          bodyXml += makeImageDrawing(sub.rId, sub.docPrId, 'mobile');
          bodyXml += makeFigureCaption(sub.figTitle);
        }
      });
    }
  });

  // PHỤ LỤC IV - MÃ NGUỒN PHẦN MỀM (18 CORE MODULES, ~21,523 DÒNG MÃ NGUỒN THỰC TẾ)
  bodyXml += makeHeading('PHỤ LỤC IV - Mã nguồn phần mềm', 1, true);
  bodyXml += makeP('Dưới đây là 18 mô-đun mã nguồn cốt lõi đại diện toàn diện cho các phân hệ Backend Controller, Service xử lý nghiệp vụ, Cổng thời gian thực Socket Gateway, Thành phần giao diện Web Quản trị và Màn hình Ứng dụng Di động Native của phần mềm ViOne Platform:', { after: 120 });

  console.log('2. Đang nạp và định dạng 18 tệp mã nguồn cho Phụ lục IV...');
  const allCodeFiles = loadAllCodeFiles();
  let totalCodeLinesRendered = 0;

  allCodeFiles.forEach((cf, idx) => {
    console.log(`   - Nạp tệp ${idx + 1}/${allCodeFiles.length}: ${cf.path} (${cf.linesCount} dòng)`);
    bodyXml += makeHeading(`Tệp ${idx + 1}/${allCodeFiles.length}: ${cf.path} (${cf.linesCount} dòng)`, 2, true);
    bodyXml += makeP(`Mô tả: ${cf.desc}`, { italic: true, after: 60 });
    bodyXml += makeP('========================================================================================', { size: 18, color: VIONE_COLORS.goldRoyalDark, after: 40 });

    cf.codeLines.forEach(line => {
      bodyXml += makeCodeLine(line);
      totalCodeLinesRendered++;
    });

    bodyXml += makeP('========================================================================================', { size: 18, color: VIONE_COLORS.goldRoyalDark, before: 40, after: 100 });
  });

  console.log(`2. Đã định dạng thành công ${totalCodeLinesRendered} dòng mã nguồn vào XML!`);

  // 3. Đóng gói vào template DOCX
  const origDocXml = await zip.file('word/document.xml').async('string');
  const sectPrMatch = origDocXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
  const sectPr = sectPrMatch ? sectPrMatch[0] : '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417"/></w:sectPr>';

  const finalDocumentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">\n<w:body>\n${bodyXml}\n${sectPr}\n</w:body>\n</w:document>`;

  zip.file('word/document.xml', finalDocumentXml);

  const docxDst1 = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx';
  const docxDst2 = 'C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx';

  console.log('3. Đang nén file DOCX...');
  const outBuf = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  fs.writeFileSync(docxDst1, outBuf);
  console.log(`  Đã lưu docxDst1: ${docxDst1} (${(outBuf.length / 1024 / 1024).toFixed(2)} MB)`);

  try {
    fs.writeFileSync(docxDst2, outBuf);
    console.log(`  Đã lưu docxDst2: ${docxDst2} (${(outBuf.length / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    console.warn(`  Không thể lưu sang Downloads: ${err.message}`);
  }

  // 4. XÂY DỰNG FILE MARKDOWN ĐỒNG BỘ 100%
  console.log('4. Đang tạo tệp Markdown đồng bộ...');
  let md = '';

  md += `# CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n**Độc lập – Tự do – Hạnh phúc**\n\n-------------------***-------------------\n\n`;
  md += `# TÀI LIỆU KỸ THUẬT & TRÌNH BÀY TÁC PHẨM\n## ĐĂNG KÝ QUYỀN TÁC GIẢ ĐỐI VỚI CHƯƠNG TRÌNH MÁY TÍNH\n\n`;
  md += `### CHƯƠNG TRÌNH MÁY TÍNH:\n# ${EXACT_TITLE_UPPER}\n### ${META_INFO.subtitle}\n*(Không bao gồm dữ liệu)*\n\n---\n\n`;

  md += `### MÔI TRƯỜNG TRIỂN KHAI VẬN HÀNH HỆ THỐNG:\n`;
  META_INFO.deployEnv.forEach(env => {
    md += `- ${env}\n\n`;
  });

  md += `### Chủ sở hữu quyền tác giả:\n`;
  md += `- **Tên tổ chức / doanh nghiệp:** ..........................................................................................................\n`;
  md += `- **Mã số doanh nghiệp:** ...................................................................................................................\n`;
  md += `- **Địa chỉ trụ sở chính:** .....................................................................................................................\n`;
  md += `- **Số điện thoại:** ............................................................ **Email:** ......................................................\n`;
  md += `- **Tác giả:** .........................................................................................................................................\n\n`;
  md += `*${META_INFO.locationDate}*\n\n---\n\n`;

  // TOC MD (ĐỒNG BỘ 100% VỚI BẢN WORD: CÓ SỐ THỨ TỰ, DẤU CHẤM VÀ SỐ TRANG CHUẨN XÁC)
  md += `## MỤC LỤC TỔNG THỂ\n\n`;
  TOC_ITEMS.forEach(item => {
    const rawTitle = item.title.trim();
    const dotsCount = Math.max(8, 86 - rawTitle.length);
    const dots = '.'.repeat(dotsCount);
    if (item.level === 1) {
      md += `- **${rawTitle}** ${dots} **Trang ${item.page}**\n`;
    } else if (item.level === 2) {
      md += `  - **${rawTitle}** ${dots} Trang ${item.page}\n`;
    } else {
      md += `    - ${rawTitle} ${dots} Trang ${item.page}\n`;
    }
  });
  md += `\n---\n\n`;

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

  function formatMdTable(tbl) {
    let res = `#### ${tbl.title}\n\n`;
    res += '| ' + tbl.headers.join(' | ') + ' |\n';
    res += '| ' + tbl.headers.map((_, idx) => idx === 0 ? ':---:' : ':---').join(' | ') + ' |\n';
    tbl.rows.forEach(r => {
      res += '| ' + r.map(c => String(c).replace(/\n/g, '<br>')).join(' | ') + ' |\n';
    });
    return res + '\n\n';
  }

  // CHƯƠNG 2
  md += `# 2. Yêu cầu kỹ thuật\n\n`;
  md += `## 2.1 Kiến trúc hạ tầng\n\n### 2.1.1 Kiến trúc tổng thể\n\n${SECTION_2_TECH.kientrucTongThe}\n\n`;
  md += `![${DIAGRAM_FILES[0].title}](images/evidence_v9/${DIAGRAM_FILES[0].file})\n\n*${DIAGRAM_FILES[0].title}*\n\n`;
  md += formatMdTable(ARCH_TABLE_01);

  md += `### 2.1.2 Kiến trúc chi tiết\n\n${SECTION_2_TECH.kientrucChiTiet}\n\n`;
  md += `![${DIAGRAM_FILES[1].title}](images/evidence_v9/${DIAGRAM_FILES[1].file})\n\n*${DIAGRAM_FILES[1].title}*\n\n`;
  md += formatMdTable(ARCH_TABLE_02);
  md += `![${DIAGRAM_FILES[2].title}](images/evidence_v9/${DIAGRAM_FILES[2].file})\n\n*${DIAGRAM_FILES[2].title}*\n\n`;
  md += formatMdTable(ARCH_TABLE_03);

  md += `### 2.1.3 Kiến trúc triển khai, dự phòng và an toàn\n\n${SECTION_2_TECH.kientrucTrienKhai}\n\n`;
  md += `![${DIAGRAM_FILES[3].title}](images/evidence_v9/${DIAGRAM_FILES[3].file})\n\n*${DIAGRAM_FILES[3].title}*\n\n`;
  md += formatMdTable(ARCH_TABLE_04);

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
  md += `### 2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViOne (20 Phân hệ)\n\n`;
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
  md += `# PHỤ LỤC III – HƯỚNG DẪN SỬ DỤNG PHẦN MỀM - ỨNG DỤNG DI ĐỘNG VIONE (20 PHÂN HỆ MOCKUP)\n\n`;
  MOBILE_MODULES.forEach((mod, idx) => {
    md += `### ${idx + 1}. ${mod.name}\n\n`;
    md += `**Mục đích:** ${mod.generalDesc}\n\n`;
    md += `**Các bước thực hiện:**\n`;
    mod.steps.forEach(step => {
      md += `- ${step}\n`;
    });
    md += `\n![${mod.figTitle}](images/evidence_v9/${mod.imgFile})\n\n`;
    md += `*${mod.figTitle}*\n\n`;

    if (mod.subScreens && mod.subScreens.length > 0) {
      mod.subScreens.forEach((sub, sIdx) => {
        md += `#### ${idx + 1}.${sIdx + 1}. Giao diện mở rộng: ${sub.title}\n\n`;
        md += `${sub.desc}\n\n`;
        md += `![${sub.figTitle}](images/evidence_v9/${sub.imgFile})\n\n`;
        md += `*${sub.figTitle}*\n\n`;
      });
    }
  });

  // PHỤ LỤC IV
  md += `# PHỤ LỤC IV - Mã nguồn phần mềm\n\n`;
  allCodeFiles.forEach((cf, idx) => {
    md += `========================================================================================\n`;
    md += `Tệp ${idx + 1}/${allCodeFiles.length}: ${cf.path}  (${cf.linesCount} dòng)\n`;
    md += `========================================================================================\n\n`;
    md += `*Mô tả:* ${cf.desc}\n\n`;
    md += `\`\`\`${cf.lang}\n${cf.codeLines.join('\n')}\n\`\`\`\n\n`;
  });

  const mdDst1 = 'document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md';
  const mdDst2 = 'C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md';

  fs.writeFileSync(mdDst1, md, 'utf8');
  console.log(`  Đã lưu mdDst1: ${mdDst1} (${(Buffer.byteLength(md) / 1024 / 1024).toFixed(2)} MB)`);

  try {
    fs.writeFileSync(mdDst2, md, 'utf8');
    console.log(`  Đã lưu mdDst2: ${mdDst2} (${(Buffer.byteLength(md) / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    console.warn(`  Không thể lưu sang Downloads: ${err.message}`);
  }

  console.log('========================================================================');
  console.log('=== HOÀN TẤT BUILD MASTER TÀI LIỆU VIONE PLATFORM (DOCX & MD) ===');
  console.log('========================================================================');
}

buildMasterDocxAndMd().catch(err => {
  console.error('LỖI KHI BUILD MASTER TÀI LIỆU:', err);
  process.exit(1);
});
