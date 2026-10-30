// scripts/content_vione_meta.js
// Metadata, Overview, Architecture, Tech Stack, Non-functional, Appendix I, Appendix IV

const EXACT_TITLE_UPPER = 'PHẦN MỀM VIONE PLATFORM– NỀN TẢNG ĐỊNH DANH SỐ, KẾT NỐI KINH DOANH, QUẢN TRỊ CỘNG ĐỒNG, SỰ KIỆN VÀ SỐ HÓA DI SẢN VĂN HÓA';
const EXACT_TITLE = 'Phần mềm ViOne Platform– Nền tảng định danh số, kết nối kinh doanh, quản trị cộng đồng, sự kiện và số hóa di sản văn hóa';

const META_INFO = {
  titleUpper: EXACT_TITLE_UPPER,
  title: EXACT_TITLE,
  subtitle: '(CỔNG WEB QUẢN TRỊ VIONE PLATFORM & ỨNG DỤNG DI ĐỘNG VIONE / VIONE CONNECT)',
  deployEnv: [
    '1. CỔNG WEB QUẢN TRỊ VIONE PLATFORM (WEB QUẢN TRỊ): https://crm_vione.viconnect.vn (Phần mềm quản trị điều hành doanh nghiệp C-Level, bán vé sự kiện, giải đấu thể thao và số hóa di sản văn hóa)',
    '2. ỨNG DỤNG DI ĐỘNG VIONE (VIONE CONNECT): Cài đặt trên Apple App Store (iOS), Google Play Store (Android) và PWA Web https://vione.viconnect.vn (Ứng dụng di động danh thiếp số vCard, chạm 1-Tap NFC, quét AI OCR, ví vé QR VNPay, giải chạy ViOne Run, bảo tàng số 3D và di sản văn hóa)'
  ],
  owner: {
    name: '........................................................................................................................',
    taxCode: '.................................................................................................................................',
    address: '...................................................................................................................................',
    phone: '............................................................',
    email: '....................................................................'
  },
  author: {
    name: '.......................................................................................................................................'
  },
  locationDate: 'Hà Nội, Năm 2026'
};

const ACTORS = [
  { code: 'A01', name: 'Khách truy cập vãng lai (Guest)', desc: 'Người dùng chưa đăng nhập, chỉ có thể xem các trang giới thiệu công khai, bảng giá dịch vụ, tìm hiểu thông tin sự kiện hoặc quét mã QR vCard để xem hồ sơ doanh nghiệp rút gọn.' },
  { code: 'A02', name: 'Hội viên doanh nghiệp / Lãnh đạo C-Level (Executive Member)', desc: 'Chủ doanh nghiệp, Tổng Giám đốc, Lãnh đạo cấp cao sử dụng Ứng dụng Di động ViOne và Web để trao đổi danh thiếp số vCard, kết nối giao thương B2B, đăng ký tham dự sự kiện, mua vé, nhận phòng chat và quản lý hồ sơ cá nhân VIP.' },
  { code: 'A03', name: 'Quản trị viên phân hệ nghiệp vụ / Ban tổ chức sự kiện (Operator)', desc: 'Cán bộ điều hành chi hội doanh nghiệp, ban tổ chức sự kiện có quyền tạo và phát hành vé sự kiện, quản lý đăng ký, vận hành cổng soát vé check-in QR, điều phối bảng tin và duyệt sản phẩm giao thương.' },
  { code: 'A04', name: 'Ban trọng tài & Điều phối viên thể thao ViOne Sport/Run (Referee / Coordinator)', desc: 'Cán bộ phụ trách quản lý giải đấu bóng đá mini, golf, tennis, pickleball và giải chạy marathon: bốc thăm sơ đồ cây Tournament Bracket, ghi nhận điểm số realtime, tiếp nhận dữ liệu chip timing RFID.' },
  { code: 'A05', name: 'Thuyết minh viên & Cán bộ bảo tàng ViOne Museum / Heritage (Curator)', desc: 'Cán bộ chuyên môn số hóa hiện vật bảo tàng 3D, tải lên mô hình GLTF xoay 360 độ, biên tập bài thuyết minh âm thanh audio guide đa ngôn ngữ, số hóa sắc phong cổ và khoanh vùng bản đồ di tích GIS.' },
  { code: 'A06', name: 'Kế toán trưởng & Quản trị tài chính (Finance Admin)', desc: 'Cán bộ phụ trách dòng tiền, đối soát giao dịch thanh toán trực tuyến qua cổng VNPay, theo dõi công nợ hội viên, lập báo cáo thu chi tài chính và xuất hóa đơn điện tử.' },
  { code: 'A07', name: 'Quản trị viên Cổng Web Quản trị (Portal Admin)', desc: 'Quản trị viên cấp cao của tổ chức doanh nghiệp, quản lý danh sách hội viên, cấu hình phân quyền vai trò RBAC, duyệt cơ hội giao thương B2B, cấu hình thông số kết nối Zalo OA và cổng VNPay.' },
  { code: 'A08', name: 'Quản trị viên hệ thống nền tảng (Super Admin)', desc: 'Đội ngũ kỹ thuật vận hành toàn diện hạ tầng ViOne Platform, giám sát cụm máy chủ, quản lý phiên bản cơ sở dữ liệu, theo dõi nhật ký kiểm toán (Audit Logs) và khắc phục sự cố.' },
  { code: 'A09', name: 'Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA (External Integration Gateways)', desc: 'Hệ thống đối tác thanh toán VNPay tiếp nhận xử lý giao dịch tài chính an toàn chuẩn PCI-DSS; hệ thống Zalo Official Account gửi thông báo tin nhắn chăm sóc khách hàng tự động ZNS.' },
  { code: 'A10', name: 'Động cơ nền tảng tự động & Tiến trình ngầm (System Engine & Background Workers)', desc: 'Tiến trình máy chủ Node.js chạy ngầm: điều phối hàng đợi sự kiện realtime, gửi thông báo đẩy (Push Notification), quét cron job đối soát giao dịch, đồng bộ dữ liệu thời gian thực qua Socket.IO.' }
];

module.exports = {
  EXACT_TITLE_UPPER,
  EXACT_TITLE,
  META_INFO,
  ACTORS
};
