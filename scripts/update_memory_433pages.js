const fs = require('fs');

const memoryPath = 'MEMORY.md';
let memoryContent = fs.readFileSync(memoryPath, 'utf8');

const newEntry = `## 0.0000000000.25. TÁI CẤU TRÚC VÀ XUẤT BẢN TOÀN DIỆN MASTER [VIONE] 06 CHUẨN BỐ CỤC UNIWORK ĐẠT 433 TRANG (30/10/2026)

### 1. Bối cảnh & Yêu Cầu Cốt Lõi Từ Người Dùng
- **Người dùng phản ánh**: Bản trình bày tác phẩm ViOne trước đó thiếu nội dung, chưa giống bố cục chuẩn mực của tệp tham chiếu \`Trình bày tác phẩm Uniwork.docx\` (221 trang).
- **Yêu cầu cụ thể**:
  1. Tuân thủ 100% bố cục và các đầu mục của Uniwork nhưng biến tấu nội dung nghiệp vụ cho ViOne Platform.
  2. Bổ sung rất chi tiết về Cổng Web Quản trị (CRM Enterprise) đan xen với Ứng dụng di động ViPlus Mobile (bản di động).
  3. **Quy chuẩn pháp lý nghiêm ngặt**: TUYỆT ĐỐI KHÔNG ĐƯỢC xóa các trường thông tin tác giả, công ty... đã để trống dưới dạng dấu chấm dài (\`....................................................................\`) như bản ViOne cũ; không được tự điền thông tin giả lập để người dùng chủ động điền pháp lý khi nộp Cục Bản quyền tác giả.
  4. Đạt quy mô chuẩn mực: Dự kiến dài gần 400 trang tính cả mã nguồn (Phụ lục IV).
  5. Tuyệt đối không tự ý \`git commit\` hay \`git push\`.

### 2. Quá Trình Thực Hiện & Thiết Kế Kiến Trúc
1. **Phân Tích Chi Tiết Tệp Nguồn Tham Chiếu \`Trình bày tác phẩm Uniwork.docx\`**:
   - Trích xuất toàn bộ cấu trúc từ \`D:\\download\\VICONNECT\\CEO_VIONE_PROJECT\\Trình bày tác phẩm Uniwork.docx\` (23.28 MB).
   - Xác định rõ khung mục lục:
     * **Trang bìa**: Quốc hiệu, Tên tác phẩm, Bảng trường thông tin chủ sở hữu và tác giả để trống (\`...................................................\`).
     * **Mục lục tổng thể**: Word Field TOC tự động kết hợp bảng text tĩnh cho các trình đọc bên ngoài.
     * **Chương 1**: 1.1 Mục tiêu, 1.2 Phạm vi của dự án (1.2.1 Phạm vi, 1.2.2 Đối tượng sử dụng kèm bảng 10 tác nhân A01-A10).
     * **Chương 2**: 2.1 Kiến trúc hạ tầng (2.1.1 Kiến trúc tổng thể 4 tầng, 2.1.2 Kiến trúc chi tiết các luồng xử lý JWT/VNPay/QR/Socket.IO/NFC/GIS, 2.1.3 Triển khai & an toàn), 2.2 Công nghệ sử dụng (Bảng 20+ nền tảng/thư viện), 2.3 Yêu cầu chức năng (2.3.1 Chung, 2.3.2 Chi tiết 23 phân hệ Cổng Web Quản trị CRM, 2.3.3 Chi tiết 20 phân hệ App Di động ViPlus), 2.4 Phi chức năng (Hiệu năng, Bảo mật, Tuân thủ).
     * **Phụ lục I**: Yêu cầu kỹ thuật phần mềm (Bảng CSDL PostgreSQL 18 thực thể, Bảng 20 API RESTful cốt lõi, Bảng Socket.IO Realtime Gateway, Bảng cấu hình phần cứng).
     * **Phụ lục II**: Hướng dẫn sử dụng Cổng Web Quản trị ViOne Platform (23 phân hệ, 5 nhóm nghiệp vụ, cấu trúc Mục đích, Các bước thực hiện 1-2-3-4, Kết quả, 23 ảnh Desktop screenshot 1440x900 sắc nét).
     * **Phụ lục III**: Hướng dẫn sử dụng Ứng dụng Di động ViPlus (20 phân hệ màn hình Mobile, cấu trúc Mục đích, Thao tác vuốt chạm / camera / NFC, Kết quả, 20 ảnh Mobile Mockup iPhone Obsidian sang trọng không lỗi header/something went wrong).
     * **Phụ lục IV**: Mã nguồn phần mềm (Trích xuất 18 mô-đun mã nguồn cốt lõi từ backend, frontend và mobile với hơn 21,523 dòng mã nguồn thực tế).

2. **Xây Dựng Script Master Builder \`scripts/build_vione_super_master_uniwork.js\`**:
   - Tích hợp \`content_vione_code_loader.js\` nạp 18 tệp nguồn:
     * \`apps/vione_app_be/src/auth/auth.service.ts\` & \`auth.controller.ts\`
     * \`apps/vione_app_be/src/platform-hub/platform-hub.service.ts\` & \`platform-hub.controller.ts\`
     * \`apps/vione_app_be/src/events/events.service.ts\` & \`events.controller.ts\`
     * \`apps/vione_app_be/src/members/members.service.ts\`
     * \`apps/vione_app_be/src/companies/companies.service.ts\`
     * \`apps/vione_app_be/src/admin/admin.service.ts\`
     * \`apps/vione_app_be/src/operations/operations.service.ts\`
     * \`apps/vione_app_fe/src/components/dashboard/ExecutiveDashboard.tsx\`
     * \`apps/vione_app_fe/src/components/business-connect/mobile/ExecutiveHome.tsx\`
     * \`apps/vione_app_fe/src/components/platform-app/SportTournamentHub.tsx\`
     * \`apps/vione_app_fe/src/components/platform-app/RunRaceHub.tsx\`
     * \`apps/vione_app_fe/src/components/platform-app/MuseumExplorer.tsx\`
     * \`apps/vione_app_fe/src/components/platform-app/HeritageExplorer.tsx\`
     * \`apps/vione_app_fe/src/components/platform-app/TicketWallet.tsx\`
     * \`apps/mobile_vione/src/screens/platform/PlatformAppScreen.tsx\`
   - Khởi tạo cấu trúc OpenXML hoàn chỉnh với font Times New Roman cho văn bản và Consolas cho mã nguồn, ngắt dòng chính xác.

### 3. Kết Quả Kiểm Định Toàn Diện Qua Microsoft Word COM
- **Độ Dày & Quy Mô Tài Liệu**:
  * **Tổng số trang thực tế đo bởi Microsoft Word Engine**: **433 TRANG** (Đạt chuẩn mong muốn của người dùng: "dài gần 400 trang tính cả code").
  * **Tổng số từ (Words)**: **109,844 TỪ**.
  * **Dung lượng file DOCX**: **35.19 MB (35,191,113 bytes)**.
  * **Dung lượng file Markdown**: **1.06 MB (1,116,207 bytes)**.
  * **Tình trạng kiểm tra**: 0 lỗi cú pháp XML, Microsoft Word mở tệp mượt mà và hiển thị trọn vẹn 100%.
- **Bàn Giao Đồng Bộ Tại 2 Vị Trí**:
  * \`document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx\` & \`document/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md\`
  * \`C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.docx\` & \`C:/Users/vumik/Downloads/[VIONE] 06. Trình bày tác phẩm.cop đĩa.md\`
- **Cam kết**: Tuyệt đối KHÔNG tự ý thực hiện \`git commit\` hay \`git push\`.

---

`;

// Chèn ngay sau dòng tiêu đề '# System Memory & Architecture\n\n'
const marker = '# System Memory & Architecture\n\n';
if (memoryContent.startsWith(marker)) {
  memoryContent = marker + newEntry + memoryContent.slice(marker.length);
} else {
  memoryContent = newEntry + memoryContent;
}

fs.writeFileSync(memoryPath, memoryContent, 'utf8');
console.log('Đã cập nhật MEMORY.md thành công!');

