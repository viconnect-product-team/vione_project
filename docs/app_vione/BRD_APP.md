# YÊU CẦU NGHIỆP VỤ (BRD) - ỨNG DỤNG DOANH NHÂN VIONE (VIONE CONNECT)
## VIONE BUSINESS CONNECT ECOSYSTEM — BUSINESS REQUIREMENTS DOCUMENT (APP VIONE)

> **Mã tài liệu:** `VIONE-BRD-APP-01`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Phân hệ:** App Doanh Nhân ViOne Connect (PWA `apps/vione_app_fe` & Native `apps/mobile_vione`)  
> **Đối tượng sử dụng:** Lãnh đạo C-Level, CEO, Chủ tịch tập đoàn, Thành viên Hiệp hội, Doanh nhân B2B.

---

## 1. TỔNG QUAN & TẦM NHÌN SẢN PHẨM

App ViOne Connect là giải pháp danh tính số và mạng lưới giao thương thế hệ mới, tích hợp công nghệ AI và NFC, trao quyền cho Doanh nhân:
1. **Thiết lập Danh tính Doanh nhân Đẳng cấp**: Danh thiếp số VIP mạ vàng/bạc, công nghệ NFC 1 chạm và mã QR Profile công khai xem trực tiếp không cần đăng nhập.
2. **Quét Danh Thiếp Giấy AI OCR & Chuyển Thành Khách Hàng Tiềm Năng (Lead)**: Chụp danh thiếp giấy, AI bóc tách tức thì thông tin vào danh bạ và lưu thẳng vào CRM Pipeline với phân hạng Tier (Hot Lead, VIP C-Level, Cần care 24h).
3. **Mạng Lưới Giao Thương B2B Đỉnh Cao**: Cơ hội kinh doanh quy mô lớn, khớp lệnh cung - cầu thông minh qua AI Copilot, lên lịch hẹn 1-on-1 trực tiếp hoặc Google Meet.
4. **Giám Sát Hoạt Động Nhân Sự Trong Ngày Dành Cho Giám Đốc**: Xem nhanh ai đang gặp khách hàng ngoài thị trường, ai làm tại văn phòng, tiến độ checklist BPMN và chấm công GPS thời gian thực.
5. **Đồng Bộ Hoàn Toàn Giữa Hai Bản (Dual-App Parity)**: Đảm bảo trải nghiệm đồng nhất 100% giữa PWA Responsive Web và React Native Native Mobile App.

---

## 2. DANH MỤC CÁC PHÂN HỆ NGHIỆP VỤ CHÍNH

### 2.1. Phân hệ Danh Tính Số & Thẻ Doanh Nhân VIP (Module Identity)
- **BR-APP-ID-01 (Thẻ VIP Titanium Mạ Vàng/Bạc)**: Mỗi doanh nhân sở hữu danh thiếp số 3D kèm chip thông minh, chỉ báo sóng NFC và mã định danh duy nhất `VIONE-XXXX`.
- **BR-APP-ID-02 (Trang Hồ Sơ Công Khai `/p/:id`)**: Cho phép khách vãng lai bên ngoài quét QR từ Camera iOS/Android hoặc Zalo xem ngay hồ sơ cá nhân đầy đủ (Ảnh đại diện viền vàng, ảnh bìa, công ty, chức vụ, hotline, nút gọi điện, nút Zalo, nút lưu danh bạ 1-chạm) mà **KHÔNG CẦN ĐĂNG NHẬP**.
- **BR-APP-ID-03 (Lưu Danh Bạ 1-Chạm Chuẩn vCard)**: Bấm lưu danh bạ mở trực tiếp ứng dụng Contacts của điện thoại, không mở trình đọc file hay PDF.

### 2.2. Phân hệ Quét QR & AI OCR Danh Thiếp Giấy (Module Scanner)
- **BR-APP-SC-01 (Quét QR Live Camera Zalo-Style)**: Khung ngắm viewfinder với tia laser quét chuyển động, tự động nhận diện QR trong 0.3 giây, hỗ trợ bật/tắt đèn Flash.
- **BR-APP-SC-02 (AI OCR Danh Thiếp & Chuyển Lead CRM)**: Chụp danh thiếp giấy, phân tích qua OCR Vision, trích xuất chính xác Họ tên, SĐT, Email, Công ty, Chức vụ. Cho phép bật Switch lưu thành Khách Hàng Tiềm Năng (Lead) với Tier (Hot Lead, VIP C-Level, Nổi bật, Cần care 24h), Deal Value và gán nhân sự phụ trách (PIC).

### 2.3. Phân hệ Mạng Lưới & Kết Nối Giao Thương (Module Network)
- **BR-APP-NET-01 (Dải Khoảnh Khắc 24h Stories)**: Đăng tin nhanh 24h chia sẻ ký kết, sự kiện, cơ hội kèm hashtag B2B. Chỉ hiển thị tin của bản thân và bạn bè đã kết nối.
- **BR-APP-NET-02 (Khách Hàng & Đối Tác Cần Chăm Sóc)**: Cảnh báo thông minh đối tác 14 ngày chưa tương tác hoặc đang chờ duyệt hợp đồng, kèm phím tắt gọi điện, nhắn tin, hẹn 1-1.
- **BR-APP-NET-03 (Tin Nhắn Trực Tiếp DM)**: Trò chuyện 1-1 realtime qua WebSocket, mã hóa tin nhắn, gửi danh thiếp và tài liệu dự án.

### 2.4. Phân hệ Cộng Đồng & Sàn Giao Thương B2B (Module Community & B2B)
- **BR-APP-COM-01 (Tạo Nhóm & Liên Minh Doanh Nghiệp)**: Khởi tạo liên minh kinh doanh, phân loại ngành nghề, bầu Ban Điều Hành và công bố cơ hội nội khối.
- **BR-APP-COM-02 (Sàn Cơ Hội Kinh Doanh B2B)**: Đăng tải nhu cầu mua sắm/chào bán dự án quy mô lớn, tiếp nhận hồ sơ năng lực và báo giá trực tiếp.
- **BR-APP-COM-03 (Sự Kiện & Vé Điện Tử Dynamic QR)**: Đăng ký vé tham dự sự kiện B2B, nhận vé QR điện tử có hạn dùng và check-in 1-chạm tại cổng sự kiện.

### 2.5. Phân hệ Trợ Lý Doanh Nhân AI & Giám Sát Vận Hành (Module AI & Ops)
- **BR-APP-AI-01 (Quả Cầu Trợ Lý Giọng Nói AI - Floating Orb)**: Ra lệnh bằng giọng nói tiếng Việt chuẩn hóa (chấm công, duyệt chi, xem lịch, gửi tin nhắn). Khi người dùng tắt quả cầu, hệ thống ẩn hoàn toàn 100%, không để lại tab thừa.
- **BR-APP-OPS-01 (Giám Sát Hoạt Động Nhân Sự Trong Ngày)**: C-Level theo dõi số nhân sự đi gặp đối tác, nhân sự tại văn phòng, checklist BPMN và chấm công GPS thời gian thực.
