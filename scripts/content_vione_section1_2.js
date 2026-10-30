// scripts/content_vione_section1_2.js
// Nội dung chuyên sâu Chương 1 (Giới thiệu) & Chương 2 (Kiến trúc, Công nghệ, Yêu cầu phi chức năng)

const SECTION_1 = {
  mucTieu: `Phần mềm ViOne Platform (bao gồm Cổng Web Quản Trị ViOne Platform và Ứng dụng Di động ViOne / ViOne Connect trên hai nền tảng iOS & Android) được thiết kế và xây dựng như một nền tảng chuyển đổi số toàn diện cho cộng đồng doanh nghiệp và văn hóa di sản. Hệ thống hợp nhất ba trụ cột chiến lược:
1. Quản trị điều hành doanh nghiệp C-Level (Enterprise CRM & Operations): Số hóa toàn diện bảng điều khiển KPI dòng tiền, quản trị khách hàng B2B, cơ hội kinh doanh (Deals), quy trình vận hành BPMN 2.0, bảng việc Kanban và quản trị tài chính thu - chi minh bạch.
2. Mạng lưới định danh số & kết nối thương mại B2B thời gian thực: Cung cấp danh thiếp thông minh vCard chuẩn quốc tế, công nghệ trao đổi không chạm 1-Tap NFC, quét danh thiếp tự động AI OCR, ví vé điện tử sự kiện có mã QR động chống gian lận và sàn giao dịch sản phẩm liên kết.
3. Số hóa thể thao phong trào cộng đồng & di sản văn hóa dân tộc: Nền tảng điều phối giải đấu thể thao ViOne Sport (bốc thăm tự động Tournament Bracket), giải chạy bộ marathon ViOne Run (đo đạc thành tích bằng thảm Chip Timing RFID UHF), bảo tàng số 3D Photogrammetry/GLTF 360 độ kèm thuyết minh 1-chạm NFC ViOne Museum và kho số hóa di sản sắc phong triều Nguyễn kết hợp định vị GPS Geofencing ViOne Heritage.`,
  phamVi: `Phạm vi giải pháp của phần mềm ViOne Platform bao phủ toàn bộ các quy trình nghiệp vụ số hóa từ trung tâm máy chủ đám mây đến thiết bị cầm tay của người dùng cuối:
- Cổng Web Quản Trị ViOne Platform (https://crm_vione.viconnect.vn): Dành cho Ban Lãnh đạo, Hội đồng Quản trị, Quản trị viên chi hội, Kế toán trưởng, Ban trọng tài thể thao và Cán bộ bảo tàng điều hành toàn bộ dữ liệu, phân quyền ma trận vai trò RBAC, phát hành vé, duyệt chi ngân sách và giám sát hệ thống thời gian thực.
- Ứng dụng Di động ViOne / ViOne Connect (iOS & Android): Dành cho các chủ doanh nghiệp, hội viên doanh nhân, vận động viên và khách tham quan trải nghiệm giao diện thượng lưu Obsidian Gold; thực hiện giao lưu danh thiếp số, quét AI OCR, nhận thông báo Zalo OA, tham gia giải chạy marathon, trải nghiệm bảo tàng số 3D và check-in sự kiện offline không cần Internet.`,
  doiTuong: `Hệ thống phục vụ đa dạng các nhóm người dùng trong và ngoài tổ chức, được phân định rõ ràng thông qua bảng danh mục 10 mã tác nhân (Actors) chuẩn mực từ A01 đến A10.`
};

const SECTION_2_TECH = {
  kientrucTongThe: `Hệ thống ViOne Platform được xây dựng theo mô hình kiến trúc doanh nghiệp 4 tầng phân lập nghiêm ngặt (4-Tier Enterprise Tiered Architecture), đảm bảo tính sẵn sàng cao, khả năng mở rộng quy mô linh hoạt và an toàn thông tin tối đa:
1. Tầng Trình diễn (Presentation Layer):
   - Cổng Web Quản Trị: Xây dựng trên nền tảng React 18, Vite, TypeScript, Tailwind CSS và bộ thư viện giao diện chuẩn Enterprise shadcn/ui.
   - Ứng dụng Di động ViOne: Xây dựng trên nền tảng React Native / Capacitor / Expo Native Modules, biên dịch mã nguồn nhị phân tối ưu cho iOS và Android, tận dụng tối đa phần cứng camera AI OCR, chip đọc thẻ NFC NDEF và định vị vệ tinh GPS.
2. Tầng Cổng Gateway & Proxy (Gateway Layer):
   - Máy chủ Nginx Reverse Proxy độc lập (vione-ssl-proxy) điều phối toàn bộ lưu lượng qua cổng bảo mật 5445 (App) và 5446 (CRM).
   - Thiết lập chứng chỉ số SSL/TLS 1.3 Let's Encrypt 2048-bit mã hóa đầu cuối, bộ lọc chống tấn công từ chối dịch vụ (Rate Limiting 100 req/min) và định tuyến giao thức WebSocket nâng cao.
3. Tầng Dịch vụ Ứng dụng (Application Services Layer):
   - Cụm máy chủ Node.js Express / NestJS viết bằng TypeScript hiện đại, phân tách micro-services chuyên biệt: Dịch vụ xác thực danh tính JWT, Dịch vụ điều phối sự kiện thời gian thực Socket.IO, Dịch vụ kết nối cổng thanh toán VNPay, Dịch vụ chăm sóc khách hàng tự động Zalo OA, Động cơ bóc tách danh thiếp AI OCR và Động cơ giải mã thảm đo RFID Chip Timing.
4. Tầng Dữ liệu & Lưu trữ (Data & Storage Layer):
   - Hệ quản trị cơ sở dữ liệu quan hệ PostgreSQL 16 hỗ trợ multi-tenancy, lưu trữ cấu trúc JSONB linh hoạt và phần mở rộng PostGIS tính toán tọa độ địa lý không gian.
   - Cụm máy chủ bộ đệm Redis 7 hỗ trợ cơ chế bộ nhớ đệm (In-memory Caching), quản lý hàng đợi sự kiện bất đồng bộ và làm Message Broker cho Socket.IO.
   - Hệ thống lưu trữ đối tượng tương thích S3 MinIO Object Storage lưu trữ ảnh đại diện, tệp hợp đồng PDF, video tư liệu và các tệp mô hình hiện vật 3D GLTF dung lượng lớn.`,

  kientrucChiTiet: `Kiến trúc chi tiết phân bổ các luồng xử lý dữ liệu trọng yếu của phần mềm:
1. Luồng Xác thực & Phân quyền bảo mật:
   - Sử dụng cơ chế token kép: Access Token có thời hạn ngắn (15 phút) mang thông tin định danh và ma trận quyền RBAC, kết hợp Refresh Token có thời hạn 7 ngày lưu trữ trong phần cứng an toàn (Keystore/Keychain).
   - Mỗi yêu cầu HTTP gửi đến đều được kiểm tra chữ ký điện tử qua Middleware JwtAuthGuard và đối soát ma trận quyền RoleGuard trước khi cấp quyền can thiệp CSDL.
2. Luồng Xử lý Giao dịch Cổng Thanh toán VNPay & Zalo OA:
   - Khi hội viên chọn mua vé sự kiện hoặc đóng hội phí, máy chủ sinh mã đơn hàng duy nhất và tạo URL thanh toán có chữ ký băm bảo mật HMAC-SHA512.
   - Người dùng quét mã VNPay-QR trên ứng dụng ngân hàng; cổng VNPay gửi gói tin IPN (Instant Payment Notification) về webhook hệ thống.
   - Hệ thống đối soát chữ ký số, cập nhật trạng thái đơn hàng thành "ĐÃ THANH TOÁN" trong một Transaction cơ sở dữ liệu duy nhất, phát sinh mã vé điện tử QR động và tự động phát lệnh qua Zalo OpenAPI v3 gửi tin nhắn ZNS xác nhận kèm mã QR về máy người dùng.
3. Luồng Đồng bộ Thời gian thực Socket.IO Realtime:
   - Duy trì các kênh kết nối WebSocket thường trực giữa Web/Mobile và máy chủ.
   - Khi có thay đổi về điểm số trận đấu ViOne Sport, lượt VĐV qua vạch đích ViOne Run hoặc đại biểu quét vé check-in tại cửa hội trường, tín hiệu được đẩy qua Redis Pub/Sub và phát sóng đồng loạt tới các máy trạm chỉ trong dưới 50ms.
4. Luồng Phần cứng 1-Chạm NFC & Định vị GPS Geofencing:
   - Ứng dụng di động kích hoạt bộ lắng nghe NFC NDEF theo chuẩn ISO/IEC 14443 Type A, đọc chuỗi mã định danh thẻ NTAG213/215 gắn trên quầy hiện vật bảo tàng hoặc danh thiếp vật lý để mở dữ liệu audio guide tương ứng.
   - Bộ dịch vụ vị trí ngầm theo dõi tọa độ GPS thiết bị với thuật toán Haversine; khi khoảng cách giữa người dùng và di tích lịch sử nhỏ hơn bán kính thiết lập (20m), hệ thống tự động phát bài thuyết minh văn hóa đa ngữ.`,

  kientrucTrienKhai: `Kiến trúc triển khai phân lập và quy trình vận hành an toàn:
- Toàn bộ hệ thống được container hóa thông qua Docker và điều phối bằng kịch bản Docker Compose độc lập cho từng phân hệ (deploy/crm và deploy/vione).
- Cơ chế phân tách tuyệt đối giữa môi trường Dev và Subdomain Production; cụm proxy vione-ssl-proxy độc lập hoàn toàn với các hệ thống proxy khác trên cùng máy chủ.
- Chính sách dự phòng và khôi phục sau thảm họa (Disaster Recovery): Cơ sở dữ liệu PostgreSQL được sao lưu tự động (Automated Backup) mỗi 6 giờ/lần với chính sách lưu trữ nén mã hóa 3 bản sao tại các ổ đĩa độc lập; thời gian khôi phục dịch vụ mục tiêu (RTO) dưới 15 phút và mức độ mất mát dữ liệu tối đa chấp nhận (RPO) dưới 1 giờ.
- Giám sát sức khỏe hạ tầng liên tục (Health Check Monitoring) đo lường mức tiêu thụ CPU, RAM, dung lượng ổ đĩa và tỷ lệ lỗi HTTP 5xx; tự động khởi động lại container khi phát hiện dấu hiệu treo tiến trình.`,

  congNghe: [
    { stt: 1, linhVuc: 'Giao diện Cổng Web Quản Trị', congNghe: 'React 18, Vite, TypeScript, Tailwind CSS, Lucide React, shadcn/ui, TanStack Table, Recharts' },
    { stt: 2, linhVuc: 'Ứng dụng Di động ViOne', congNghe: 'React Native, Expo Native Modules, Capacitor, Expo Linear Gradient, React Navigation v6, Reanimated 3' },
    { stt: 3, linhVuc: 'Máy chủ Ứng dụng Backend', congNghe: 'Node.js LTS, Express / NestJS Framework, TypeScript, Socket.IO Server, JWT RS256, Zod Validation' },
    { stt: 4, linhVuc: 'Cơ sở Dữ liệu Quan hệ', congNghe: 'PostgreSQL 16, PostGIS Extension, UUID v4, ACID Transactions, Connection Pooling (pg-pool)' },
    { stt: 5, linhVuc: 'Bộ đệm & Message Broker', congNghe: 'Redis 7 In-Memory Cache, Redis Pub/Sub, Redis Streams cho xử lý sự kiện realtime' },
    { stt: 6, linhVuc: 'Lưu trữ Đối tượng Tệp tin', congNghe: 'MinIO S3 Compatible Object Storage, Presigned URLs, Local Disk Storage Backup' },
    { stt: 7, linhVuc: 'Cổng Thanh toán Trực tuyến', congNghe: 'VNPay Payment Gateway SDK, VNPay-QR, HMAC-SHA512 Checksum, IPN Webhook Receiver' },
    { stt: 8, linhVuc: 'Tin nhắn & Thông báo Khách hàng', congNghe: 'Zalo Official Account (Zalo OA) OpenAPI v3, Zalo Notification Service (ZNS), Apple APNs, Firebase Cloud Messaging (FCM)' },
    { stt: 9, linhVuc: 'Trí tuệ Nhân tạo & Thị giác Máy tính', congNghe: 'Tesseract OCR Engine, OpenCV xử lý ảnh danh thiếp, Thuật toán so khớp AI Matching' },
    { stt: 10, linhVuc: 'Phần cứng & Công nghệ Không dây', congNghe: 'NFC NDEF (ISO 14443 Type A, NTAG213/215/424 DNA), RFID UHF 860-960MHz Chip Timing, GPS Geofencing' },
    { stt: 11, linhVuc: 'Mô hình Không gian 3D', congNghe: 'Three.js / WebGL, GLTF / GLB Loader, 3D Photogrammetry siêu thực xoay 360 độ' },
    { stt: 12, linhVuc: 'Hạ tầng & An ninh Mạng', congNghe: 'Docker Compose, Nginx Reverse Proxy (vione-ssl-proxy), Let\'s Encrypt SSL/TLS 1.3, Argon2, AES-256' }
  ],

  chucNangChung: `Hệ thống ViOne Platform cung cấp bộ khung chức năng nền tảng chung xuyên suốt toàn bộ Cổng Web Quản Trị và Ứng dụng Di động ViOne:
1. Xác thực tập trung và Quản lý phiên làm việc: Hỗ trợ đăng nhập bằng Email/Mật khẩu băm an toàn, đăng nhập số điện thoại OTP, đăng nhập sinh trắc học FaceID/TouchID trên di động; tự động làm mới Access Token và hủy phiên khi người dùng đăng xuất.
2. Kiểm soát truy cập dựa trên vai trò (RBAC): Toàn bộ các tài nguyên, màn hình và API đều được kiểm soát bởi ma trận vai trò người dùng (Super Admin, Portal Admin, Event Operator, Referee, Curator, Finance Admin, Member); tuyệt đối không cho phép tài khoản thông thường truy cập dữ liệu quản trị.
3. Ngôn ngữ thiết kế thương hiệu thống nhất (Obsidian & Champagne Gold): Màu chủ đạo là Vàng Hoàng Gia Champagne Gold (#D8B282 / #F6E1C3) kết hợp nền Đen Thạch Anh Obsidian (#050C15 / #0B0F17), mang đến cảm xúc sang trọng, tôn vinh đẳng cấp lãnh đạo và tăng cường khả năng tập trung.
4. Trung tâm thông báo đa kênh thời gian thực: Đồng bộ hóa toàn bộ các tin nhắn, lời mời sự kiện, cảnh báo tài chính và lịch thi đấu giữa máy chủ, ứng dụng di động và kênh Zalo OA chính thức.
5. Thanh tìm kiếm toàn cục (Global Command Palette): Cho phép người dùng nhấn tổ hợp phím tắt (Ctrl+K / Cmd+K trên web) hoặc ô tìm kiếm nhanh trên app để tra cứu tức thì bất kỳ hội viên, sự kiện, tệp tài liệu hay bảo vật nào.`,

  yeuCauPhiChucNang: {
    hieuNang: `1. Thời gian phản hồi của các yêu cầu API RESTful đạt dưới 150ms đối với 95% các truy vấn cơ bản.
2. Tốc độ quét và xác thực vé QR tại cổng kiểm soát check-in đạt dưới 100ms/lần quét, đảm bảo thông quan 30 đại biểu/phút/cổng soát vé.
3. Thời gian truyền phát và hiển thị tin nhắn chat realtime, điểm số thể thao qua Socket.IO đạt dưới 50ms.
4. Thời gian tải trang ban đầu của Cổng Web Quản Trị và Ứng dụng Di động dưới 1.2 giây trong điều kiện mạng 4G/Wi-Fi tiêu chuẩn.
5. Hệ thống chịu tải đồng thời tối thiểu 10.000 người dùng hoạt động (Concurrent Users) mà không suy giảm hiệu năng.`,
    baoMat: `1. Toàn bộ thông tin nhạy cảm của người dùng (mật khẩu, khóa riêng tư, token định danh) được mã hóa bằng thuật toán băm Argon2/Bcrypt hoặc mã hóa đối xứng AES-256 trước khi lưu vào CSDL.
2. Đường truyền mạng được bảo vệ tuyệt đối bằng giao thức mã hóa HTTPS với chuẩn TLS 1.3 và chứng chỉ số 2048-bit.
3. Ngăn chặn triệt để các lỗ hổng an ninh mạng phổ biến theo chuẩn OWASP Top 10: Chống SQL Injection bằng cơ chế Parameterized Queries, chống Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF) và tấn công DDoS bằng Rate Limiting.
4. Hệ thống ghi nhật ký kiểm toán (Audit Logs) bất biến lưu trữ tối thiểu 365 ngày cho toàn bộ các hành động thêm, sửa, xóa, xuất dữ liệu và đăng nhập quản trị.`,
    tuanThu: `1. Tuân thủ đầy đủ các quy định của Nghị định số 13/2023/NĐ-CP của Chính phủ về bảo vệ dữ liệu cá nhân, đảm bảo quyền được biết, đồng ý và yêu cầu xóa bỏ dữ liệu của người dùng.
2. Tuân thủ tiêu chuẩn an toàn thanh toán trực tuyến của Ngân hàng Nhà nước Việt Nam đối với các giao dịch tài chính qua cổng VNPay.
3. Thiết kế giao diện tuân thủ hướng dẫn trợ năng nội dung web W3C Web Content Accessibility Guidelines (WCAG 2.1) cấp độ AA về độ tương phản màu sắc và khả năng điều hướng.
4. Tuân thủ tiêu chuẩn bản quyền tác giả đối với chương trình máy tính theo Luật Sở hữu trí tuệ Việt Nam.`
  }
};

module.exports = {
  SECTION_1,
  SECTION_2_TECH
};

