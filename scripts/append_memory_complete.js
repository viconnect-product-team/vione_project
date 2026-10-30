const fs = require('fs');

const memoryEntry = `
| 30/10/2026 | **Tái Cấu Trúc Toàn Diện & Nâng Cấp Hồ Sơ Đăng Ký Bản Quyền Tác Giả ViOne Platform Đạt Chuẩn Uniwork Parity 100% (Chi Tiết Hóa 23 Phân Hệ Web Quản Trị, Đan Xen 20 Phân Hệ App ViPlus, Nhúng 43 Ảnh Live Không Lỗi)**:
1) **Chuẩn Hóa Pháp Lý Tên Tác Phẩm & Quy Chuẩn Thuật Ngữ**:
   - Tên tác phẩm chuẩn xác 100%: *"Phần mềm ViOne Platform– Nền tảng định danh số, kết nối kinh doanh, quản trị cộng đồng, sự kiện và số hóa di sản văn hóa"*.
   - Khử hoàn toàn từ "hệ sinh thái" và "CRM", thay thế bằng *"Cổng Web Quản Trị ViOne Platform"* / *"Web Quản trị"*.
   - Mô hình phân quyền chuẩn RBAC (Role-Based Access Control) ma trận vai trò độc lập, không dùng khái niệm "các ban".
   - Tích hợp cổng thanh toán trực tuyến quốc gia *"VNPay"* (VNPay-QR) và kênh thông báo khách hàng *"Zalo OA"* (thay thế triệt để VietQR/Napas).
2) **Tái Cấu Trúc Đạt Chuẩn 100% Cấu Trúc Tệp Mẫu Uniwork**:
   - **Chương 1: Giới thiệu**: 1.1 Mục tiêu nền tảng hợp nhất 3 trụ cột (Quản trị C-Level, Định danh số B2B, Thể thao & Di sản văn hóa); 1.2 Phạm vi dự án; 1.2.2 Đối tượng sử dụng kèm **Bảng ma trận 10 mã tác nhân (Actors A01 – A10)**.
   - **Chương 2: Yêu cầu kỹ thuật**:
     * 2.1 Kiến trúc hạ tầng 4 tầng phân lập (Presentation, Gateway Nginx vione-ssl-proxy 5445/5446, Application Services, Data & Storage PostgreSQL/Redis/MinIO).
     * 2.2 Công nghệ sử dụng: Bảng 12 lĩnh vực công nghệ mã nguồn mở hiện đại.
     * 2.3.1 Các chức năng nền tảng chung: JWT RS256 kép, RBAC, theme Obsidian & Vàng Champagne Gold (#D8B282), Socket.IO, Command Palette.
     * **2.3.2 Chức năng chi tiết Cổng Web Quản Trị ViOne Platform (23 Phân hệ)**: Trình bày chi tiết từng phân hệ chuẩn Uniwork gồm Mô tả chung, danh sách tính năng có bullet, quy trình xử lý, kiểm tra dữ liệu và gán mã Tác nhân chính / phụ.
     * **2.3.3 Chức năng chi tiết Phân hệ Ứng dụng Di động ViPlus (20 Phân hệ)**: Đan xen trình bày chi tiết tuyệt đối từng màn hình di động chuẩn Uniwork gồm Mô tả chung, tính năng native, sensor, camera OCR, chip NFC, GPS Geofencing và gán mã Tác nhân.
     * 2.4 Các yêu cầu phi chức năng: Hiệu năng (API < 150ms, QR checkin < 100ms, Socket < 50ms, 10.000 users), Bảo mật (AES-256, TLS 1.3, Audit Logs 365 ngày), Tuân thủ (Nghị định 13/2023/NĐ-CP, W3C WCAG 2.1).
   - **Phụ Lục I - Yêu cầu kỹ thuật của phần mềm**: Bảng 18 bảng CSDL PostgreSQL cốt lõi, Bảng 15 API RESTful, Bảng 6 sự kiện Socket.IO Realtime, Bảng cấu hình phần cứng (Server, Web Client, Mobile App).
   - **Phụ Lục II – Hướng dẫn sử dụng Cổng Web Quản Trị (23 Phân hệ)**: Mục đích, 4 bước thực hiện, ảnh desktop 1440x900 chụp live từ server và chú thích hình ảnh.
   - **Phụ Lục III – Hướng dẫn sử dụng Ứng dụng Di động ViPlus (20 Phân hệ)**: Mục đích, 4 bước thực hiện, ảnh di động bọc khung mockup iPhone Obsidian sang trọng (100% không có lỗi Something went wrong, không cắt header) và chú thích hình ảnh.
   - **Phụ Lục IV - Mã nguồn phần mềm**: Trích đoạn 4 tệp mã nguồn tiêu biểu: Backend Controller, Realtime Gateway, Mobile VIP Component, PostgreSQL Schema DDL.
3) **Kiểm Định Chất Lượng & Lưu Trữ Đích**:
   - File DOCX: \`document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx\` (33.27 MB) & \`C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx\`.
   - File MD: \`document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md\` (201.1 KB) & \`C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md\`.
   - Kiểm tra mở tự động qua Microsoft Word COM: **80 trang chuẩn in ấn, 0 lỗi cú pháp XML, 0 cảnh báo**.
   - Tuân thủ nghiêm ngặt Strict Rule 1: Tuyệt đối không tự ý chạy git commit/push. |
`;

fs.appendFileSync('MEMORY.md', memoryEntry, 'utf8');
console.log('Đã cập nhật MEMORY.md thành công!');

