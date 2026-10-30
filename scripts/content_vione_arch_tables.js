// scripts/content_vione_arch_tables.js
// Đặc tả 4 Bảng Kiến Trúc Nền Tảng Trực Tiếp ("Vẽ trực tiếp sơ đồ ra")
// Cung cấp dữ liệu chi tiết cho DOCX và Markdown

const ARCH_TABLE_01 = {
  title: 'Bảng 2.1: Đặc tả các phân tầng & khối chức năng kiến trúc tổng thể ViOne Platform (Hợp nhất Web CRM & App Mobile)',
  headers: ['STT', 'Phân Tầng / Khối Hệ Thống', 'Thành Phần Cốt Lõi & Giao Thức', 'Mô Tả Kỹ Thuật & Quy Chuẩn Công Nghệ'],
  widths: [600, 2200, 3200, 3200],
  rows: [
    [
      '1',
      'Hiện Trường & Thiết Bị Ngoại Vi (Field Devices)',
      '• Thẻ chip 1-Chạm NFC (NTAG213/215)\n• Mã QR Động & Vé Điện Tử VNPay\n• Chip Timing RFID & Cổng Đọc Giải Chạy\n• Thiết Bị Di Động Thông Minh (iOS / Android)',
      'Tiếp nhận tương tác vật lý trực tiếp: đọc thẻ danh thiếp số vCard trong 0.2s, quét mã check-in vé QR, định danh đại biểu hội trường, thu nhận tín hiệu chip timing RFID cho giải chạy ViOne Run và kích hoạt audio guide bảo tàng số.'
    ],
    [
      '2',
      'Kênh Người Dùng (Presentation Tier)',
      '• Ứng Dụng Di Động ViOne (ViOne Connect)\n• Cổng Web Quản Trị ViOne Platform (CRM)\n• Quầy Bán Vé & Điểm Check-in POS',
      'Cung cấp trải nghiệm đa kênh: App di động (Flutter / React Native, offline SQLite/WatermelonDB, FaceID, NFC); Web CRM (React 19, TypeScript, Tailwind CSS, TanStack Table); Web POS hỗ trợ máy in nhiệt và máy quét laser.'
    ],
    [
      '3',
      'Lớp Biên & Kiểm Soát Truy Cập (Edge & Ingress)',
      '• Cụm Ingress / Reverse Proxy (vione-ssl-proxy / Nginx)\n• Cổng Bảo Mật HTTPS/TLS 1.3\n• Rate Limiter & Bộ Lọc Tấn Công DDoS',
      'Phân luồng định tuyến thông minh: cân bằng tải tới cụm backend, nén gzip tĩnh, xác thực chứng chỉ SSL tự động qua Let\'s Encrypt, giới hạn tần suất 100 req/60s, CORS Whitelist nghiêm ngặt.'
    ],
    [
      '4',
      'Tầng Ứng Dụng Máy Chủ (Application Tier - NestJS API)',
      '• Xác Thực & Phân Quyền (JWT, RoleGuard, RBAC)\n• Phân Hệ Giao Thương B2B, Deals & Matching\n• Quản Trị Hội Viên Doanh Nghiệp & Thẻ VIP\n• Quản Lý Vé, Giải Đấu Sport/Run & Di Sản 3D\n• Dịch Vụ Dùng Chung & BullMQ Background Queue',
      'Xử lý logic nghiệp vụ phân rã theo Domain-Driven Design (DDD): kiểm tra token kép (Access/Refresh), điều phối luồng giao dịch tài chính, phát sóng Socket.IO realtime <50ms, ghi log Winston tập trung.'
    ],
    [
      '5',
      'Tầng Cơ Sở Dữ Liệu & Lưu Trữ (Data Tier)',
      '• Hệ Quản Trị CSDL PostgreSQL 16 (vione_app)\n• Kho Lưu Trữ Đối Tượng MinIO / S3 Storage\n• Bộ Đệm Tốc Độ Cao Redis 7 In-Memory Cache',
      'Lưu trữ dữ liệu quan hệ ACID hỗ trợ đa tổ chức (Multi-tenant), chỉ mục tối ưu truy vấn B-tree; MinIO lưu trữ ảnh hiện vật, mô hình GLTF 3D, audio guide; Redis lưu phiên đăng nhập và Pub/Sub socket.'
    ],
    [
      '6',
      'Dịch Vụ Tích Hợp Ngoại Vi (External Gateways)',
      '• Cổng Thanh Toán Trực Tuyến VNPay & ZaloPay\n• Cổng Zalo OpenAPI v3 & Tin Nhắn Tự Động ZNS\n• Dịch Vụ AI OCR & Vision Trích Xuất Danh Thiếp\n• Nền Tảng Phân Phối Apple App Store & Google Play',
      'Kết nối cổng thanh toán an toàn chuẩn PCI-DSS (HMAC-SHA512), gửi tin nhắn ZNS xác nhận vé tức thời, nhận diện AI OCR thẻ danh thiếp tiếng Việt tự động, phân phối ứng dụng di động bảo mật.'
    ]
  ]
};

const ARCH_TABLE_02 = {
  title: 'Bảng 2.2: Đặc tả quy trình luồng nghiệp vụ và xử lý dữ liệu Cổng Web Quản Trị ViOne CRM',
  headers: ['Bước', 'Giai Đoạn Nghiệp Vụ', 'Tác Nhân Tham Gia', 'Luồng Dữ Liệu & Cơ Chế Xử Lý Kỹ Thuật'],
  widths: [600, 2000, 2200, 4400],
  rows: [
    [
      '01',
      'Tiếp Nhận & Định Danh',
      'Khách hàng, Hội viên C-Level',
      'Hội viên đăng ký tài khoản hoặc gửi yêu cầu kết nối giao thương B2B; hệ thống cấp Access Token (15p) + Refresh Token (7 ngày); mã hóa mật khẩu qua Argon2id; ghi nhận log truy cập vào Audit Trail.'
    ],
    [
      '02',
      'Thẩm Định & Điều Phối B2B',
      'Quản trị viên Chi hội, Portal Admin',
      'Hồ sơ doanh nghiệp và sản phẩm chào hàng được kiểm duyệt; thuật toán matching tự động gợi ý đối tác tiềm năng theo ngành nghề; tạo lịch hẹn kết nối B2B và thông báo đẩy qua WebSocket.'
    ],
    [
      '03',
      'Bán Vé Sự Kiện & Thanh Toán',
      'Hội viên, Cổng VNPay, Kế toán',
      'Hội viên chọn mua vé sự kiện hoặc đóng hội phí; hệ thống tạo URL thanh toán VNPay có chữ ký băm HMAC-SHA512; tiếp nhận gói tin IPN Webhook, cập nhật trạng thái đơn hàng trong 1 Database Transaction duy nhất.'
    ],
    [
      '04',
      'Phát Hành Vé QR & Thông Báo ZNS',
      'Hệ thống tự động, Zalo OpenAPI',
      'Hệ thống sinh chuỗi mã vé điện tử QR động (chống chụp màn hình gian lận); đồng thời tự động phát lệnh qua Zalo OpenAPI v3 gửi tin nhắn ZNS xác nhận kèm mã vé QR về ứng dụng Zalo của người dùng.'
    ],
    [
      '05',
      'Soát Vé Check-in & Realtime',
      'Điều phối viên POS, Ban Tổ Chức',
      'Tại cửa sự kiện, cán bộ quét mã vé QR bằng camera hoặc máy quét laser; tín hiệu hợp lệ được đẩy qua Redis Pub/Sub và phát sóng realtime dưới 50ms về màn hình Dashboard điều hành trung tâm.'
    ]
  ]
};

const ARCH_TABLE_03 = {
  title: 'Bảng 2.3: Đặc tả luồng tương tác phần cứng và kiến trúc ứng dụng di động ViOne (ViOne Connect)',
  headers: ['STT', 'Phân Hệ Kỹ Thuật Mobile', 'Công Nghệ & Giao Thức', 'Cơ Chế Tương Tác & Trải Nghiệm Hội Viên'],
  widths: [600, 2200, 2800, 3600],
  rows: [
    [
      '1',
      'Mô-đun 1-Chạm NFC & Sinh Trắc Học',
      '• NDEF ISO/IEC 14443 Type A\n• Chip NTAG213 / NTAG215\n• FaceID / TouchID / Biometrics',
      'Người dùng chạm thiết bị di động vào thẻ danh thiếp thông minh hoặc quầy hiện vật bảo tàng; ứng dụng đọc mã định danh trong 0.2s để mở hồ sơ điện tử; xác thực sinh trắc học mở khóa ví vé an toàn.'
    ],
    [
      '2',
      'Bộ Quét Mã AI OCR & Camera Vision',
      '• Google ML Kit / Tesseract OCR\n• ZXing QR Scanner\n• Vision Preprocessing',
      'Quét danh thiếp giấy truyền thống, tự động nhận diện và trích xuất họ tên, chức vụ, công ty, email, số điện thoại tiếng Việt với độ chính xác >96%; hỗ trợ quét mã QR sự kiện và QR thanh toán ngân hàng.'
    ],
    [
      '3',
      'Trình Diễn Hiện Vật 3D & Audio Guide Đa Ngữ',
      '• Three.js / WebGL / OpenGL ES\n• GLTF / GLB 3D Format\n• Native Audio Streaming Exoplayer',
      'Tải và render mô hình hiện vật bảo tàng 3D cho phép chạm xoay 360 độ, phóng to thu nhỏ chi tiết; phát bài thuyết minh văn hóa đa ngữ (Việt - Anh - Nhật) tự động khi vào vùng Geofencing GPS di tích (bán kính 20m).'
    ],
    [
      '4',
      'Ví Vé Điện Tử & CSDL Ngoại Tuyến (Offline)',
      '• SQLite / WatermelonDB Offline\n• AES-256 Encrypted Storage\n• Background Sync Delta-Worker',
      'Lưu trữ cục bộ danh sách vé sự kiện, danh bạ hội viên và mã QR động; cho phép hiển thị vé và quét check-in ngay cả khi mất sóng Internet hoàn toàn; tự động đồng bộ 2 chiều (Delta Sync) khi có mạng trở lại.'
    ],
    [
      '5',
      'Kênh Kết Nối Realtime & Thông Báo Đẩy',
      '• WebSocket Socket.IO Client\n• Firebase Cloud Messaging (FCM)\n• Apple APNs Gateway',
      'Duy trì kết nối thường trực cập nhật tức thời điểm số giải chạy ViOne Run, kết quả thi đấu thể thao ViOne Sport; tiếp nhận thông báo đẩy khi có tin nhắn B2B mới hoặc lịch họp kết nối doanh nghiệp.'
    ]
  ]
};

const ARCH_TABLE_04 = {
  title: 'Bảng 2.4: Đặc tả phân định môi trường triển khai Subdomain Production và Dev Server ViOne',
  headers: ['STT', 'Tiêu Chí Phân Định', 'Môi Trường Dev Server', 'Môi Trường Subdomain Production'],
  widths: [600, 2200, 3200, 3200],
  rows: [
    [
      '1',
      'Tên Miền & Cổng Truy Cập (Domain & Port)',
      '• App ViOne: dev-vione.14-225-217-232.sslip.io (Cổng 5445 HTTPS / 5010 HTTP)\n• CRM ViOne: dev-vione-crm.14-225-217-232.sslip.io (Cổng 5446 HTTPS / 5006 HTTP)',
      '• App ViOne: https://vione.viconnect.vn/ (Cổng chuẩn 443 HTTPS)\n• CRM ViOne: https://crm_vione.viconnect.vn/ (Cổng chuẩn 443 HTTPS)'
    ],
    [
      '2',
      'Cụm Proxy Điều Phối (Reverse Proxy)',
      'Khai thác cụm proxy phát triển; cấu hình chuyển tiếp linh hoạt theo cổng port chuyên biệt; log chi tiết hỗ trợ gỡ lỗi kỹ thuật.',
      'Cụm vione-ssl-proxy độc lập (tách biệt hoàn toàn với ceo1983-ssl-proxy); quản lý cổng chuẩn 80 & 443; chứng chỉ SSL Let\'s Encrypt tự động.'
    ],
    [
      '3',
      'Cơ Sở Dữ Liệu & Cách Ly Môi Trường',
      'CSDL Sandbox độc lập; cho phép thực thi Prisma Migrate thử nghiệm, nạp dữ liệu test tự do mà không ảnh hưởng tới dữ liệu thực.',
      'CSDL PostgreSQL 16 Production bảo mật cao; phân quyền truy cập nghiêm ngặt; chỉ lưu trữ dữ liệu thực từ RESTful API / CSDL.'
    ],
    [
      '4',
      'Kịch Bản Triển Khai (Deploy Script)',
      'Triển khai nhanh bằng ./deploy-vione.ps1 và ./deploy-crm.ps1; cờ tham số TargetEnv="dev".',
      'Triển khai qua GitHub Actions CI/CD (.github/workflows/) hoặc kịch bản ./deploy-subdomain-vione.ps1 và ./deploy-subdomain-crm.ps1; cờ TargetEnv="prod".'
    ],
    [
      '5',
      'Chiến Lược Dự Phòng & An Ninh (Security & Backup)',
      'Kiểm thử an ninh ứng dụng; giám sát lỗi console; cấu hình CORS nội bộ.',
      'Sao lưu định kỳ tự động pg_dump mỗi 6 giờ; mã hóa AES-256; lưu trữ 30 ngày an toàn; cam kết RTO < 15 phút, RPO < 6 giờ.'
    ]
  ]
};

module.exports = {
  ARCH_TABLE_01,
  ARCH_TABLE_02,
  ARCH_TABLE_03,
  ARCH_TABLE_04
};

