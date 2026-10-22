# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - PHÂN HỆ APP VIONE
## SOFTWARE REQUIREMENTS SPECIFICATION — USE CASES & SYSTEM BEHAVIOR (APP VIONE)

> **Mã tài liệu:** `VIONE-SRS-APP-02`  
> **Phiên bản:** `6.0.0 (Cập nhật Tháng 10/2026)`  
> **Phân hệ:** App Doanh Nhân ViOne (PWA Responsive Web & React Native Native Mobile)  
> **Nguyên tắc tài liệu:** KHÔNG CLEAR TEXT CŨ. Khi có thay đổi luồng hoặc yêu cầu bổ sung chức năng, Agent phải tìm đúng Use Case (UC-APP-xxx) tương ứng để cập nhật, đánh dấu phiên bản và ghi nhận chi tiết.

---

## 1. DANH MỤC USE CASES (USE CASE MATRIX)

| Mã Use Case | Tên Chức Năng | Tác Nhân (Actors) | Mức Ưu Tiên | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- |
| **UC-APP-01** | Đăng nhập đa kênh (Google, Apple, OTP, Email) | Doanh nhân, Khách mời | P0 - Bắt buộc | Hoạt động |
| **UC-APP-02** | Xem & Cập nhật Hồ sơ Doanh nhân & Kéo căn chỉnh Avatar/Cover | Doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-03** | Hiển thị Thẻ Danh thiếp VIP & Chạm 1-Tap NFC | Doanh nhân, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-04** | Xem Trang Hồ sơ Số Công khai (`/p/:identifier`) | Khách vãng lai, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-05** | Quét mã QR đối tác (Live Camera Zalo-Style) | Doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-06** | Chụp Danh thiếp Giấy AI OCR & Chuyển Khách hàng Lead CRM | Doanh nhân, Trợ lý | P0 - Bắt buộc | Hoạt động |
| **UC-APP-07** | Nhắn tin Trực tiếp 1-1 (Direct Message Thread) | Hai doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-08** | Đăng & Xem Khoảnh khắc Doanh nhân 24h (Stories) | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-09** | Lên lịch hẹn & Điều phối Cuộc gặp 1-on-1 | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-10** | Quản lý & Chăm sóc Khách hàng Tiềm năng (Leads Pipeline) | Doanh nhân, Kinh doanh | P1 - Cao | Hoạt động |
| **UC-APP-11** | Tham gia Cộng đồng, Bầu Ban điều hành & Mời kết nối | Doanh nhân, Trưởng nhóm | P1 - Cao | Hoạt động |
| **UC-APP-12** | Đăng tin & Tìm kiếm Cơ hội Kinh doanh B2B | Doanh nhân, Chủ DN | P1 - Cao | Hoạt động |
| **UC-APP-13** | Đăng ký & Điểm danh Vé Sự kiện B2B (Dynamic QR) | Doanh nhân, BTC | P1 - Cao | Hoạt động |
| **UC-APP-14** | Ra lệnh Giọng nói Trợ lý Doanh nhân AI (Floating Orb) | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-15** | Giám sát Hoạt động Nhân sự trong ngày dành cho Giám đốc | Ban Giám Đốc | P1 - Cao | Hoạt động |

---

## 2. CHI TIẾT CÁC USE CASE

### UC-APP-01: Đăng nhập đa kênh (Google SSO, Apple ID, Phone/OTP, Email)
* **Tác nhân:** Doanh nhân, Thành viên mới.
* **Tiền điều kiện:** Ứng dụng đã khởi động trên PWA hoặc Native Mobile.
* **Luồng sự kiện chính:**
  1. Người dùng mở màn hình đăng nhập (`ConnectAppSignIn.tsx` trên PWA hoặc `LoginScreen.tsx` trên Native).
  2. Người dùng chọn phương thức đăng nhập:
     - Bấm nút Google hoặc Apple (mở popup/SSO native).
     - Nhập Email / Mật khẩu hoặc Số điện thoại.
  3. Bấm nút **"Đăng nhập"** (Bắt buộc dùng nút Gradient Vàng Hoàng Gia Champagne Gold).
  4. Hệ thống xác thực qua API `POST /connect-app/auth/login`.
  5. Nếu thành công, lưu token vào SecureStore / LocalStorage, điều hướng vào Trang chủ (`/connect-app`).
* **Quy tắc Nghiệp vụ & Dữ liệu Thực:**
  - CẤM TỰ Ý MOCK DỮ LIỆU đăng nhập thành công nếu API trả về lỗi.
  - Phải hiển thị toast lỗi cụ thể nếu sai thông tin hoặc tài khoản chưa kích hoạt.

---

### UC-APP-03: Hiển thị Thẻ Danh thiếp VIP & Chạm 1-Tap NFC
* **Tác nhân:** Doanh nhân sở hữu tài khoản ViOne.
* **Luồng sự kiện chính:**
  1. Người dùng vào tab "Tôi" hoặc bấm nút V trung tâm chọn "Thẻ của tôi".
  2. Hệ thống tải thông tin từ bảng `public.vione_users`, `user_profiles`, `business_identities`.
  3. Hiển thị thẻ VIP mạ vàng hoặc mạ bạc Platinum:
     - Avatar viền vàng, Họ tên, Chức vụ, Công ty.
     - Chip kim loại 3D, sóng NFC, mã doanh nhân `VIONE-XXXX`.
  4. Người dùng bấm "Mã QR của tôi": Bung modal hiển thị mã QR kèm logo vương miện mạ vàng ở giữa.
  5. Đối tác quét mã QR hoặc chạm thẻ NFC vật lý vào mặt lưng điện thoại.
* **Quy chuẩn Giao diện Bắt buộc:**
  - Nút đóng, nút chuyển đổi màu thẻ hoặc chia sẻ bắt buộc sử dụng chuẩn nút Gradient.

---

### UC-APP-04: Xem Trang Hồ sơ Số Công khai (`/p/:identifier`)
* **Tác nhân:** Đối tác quét mã QR từ bên ngoài (Camera iOS, Android, Zalo), Khách vãng lai.
* **Tiền điều kiện:** Không yêu cầu đăng nhập.
* **Luồng sự kiện chính:**
  1. Người dùng quét mã QR của doanh nhân hoặc nhấp vào đường link chia sẻ dạng `https://vione.viconnect.vn/p/le-hoang-nam`.
  2. Hệ thống nhận diện route `/p/` thuộc danh sách `isPublic` tại `__root.tsx`, bỏ qua AuthGate.
  3. Client gọi API `GET /api/public/profile/:identifier` lấy thông tin công khai.
  4. Giao diện hiển thị trang Profile công khai sang trọng chuẩn Executive Obsidian:
     - Ảnh bìa, Avatar viền vàng, Tên doanh nhân, Chức vụ, Công ty, Mã hội viên.
     - Bộ nút tương tác nhanh: Nút "Gọi điện", nút "Nhắn Zalo", nút "Gửi Email", nút "Lưu Danh Bạ 1-Chạm".
  5. Người dùng bấm "Lưu Danh Bạ": Hệ thống kích hoạt Web Share API hoặc tải tệp vCard trực tiếp nạp vào danh bạ điện thoại, tuyệt đối không mở PDF.
* **Quy chuẩn UI/UX:**
  - Tất cả các nút hành động (Gọi điện, Nhắn tin, Lưu danh bạ) đều sử dụng Gradient Vàng Hoàng Gia hoặc Gradient Đen Thạch Anh Mạ Vàng.

---

### UC-APP-06: Chụp Danh thiếp Giấy AI OCR & Chuyển Khách hàng Lead CRM
* **Tác nhân:** Doanh nhân, Trợ lý giám đốc.
* **Luồng sự kiện chính:**
  1. Người dùng bấm nút V chọn "Quét danh thiếp AI".
  2. Camera mở lên, người dùng căn chỉnh danh thiếp giấy vào khung ngắm và bấm chụp (dung lượng ảnh được nén $< 450\text{KB}$).
  3. Client quét nhanh mã QR vCard trên ảnh trước (nếu có); nếu không có, gửi ảnh lên Backend OCR Vision (`POST /connect-app/card-scan`).
  4. AI bóc tách các trường: Họ và tên, Chức danh, Công ty, SĐT, Email, Website, Địa chỉ. Bộ lọc loại bỏ hoàn toàn các chuỗi dummy (`Thông tin danh thiếp`, `0900000000`).
  5. Màn hình xác nhận hiển thị Form kết quả (`CardScanReviewModal.tsx` / `BusinessCardReviewForm.tsx`):
     - Người dùng kiểm tra và điều chỉnh thông tin nếu cần.
     - Bật Switch: *"Lưu thành Khách Hàng Tiềm Năng (Lead)"*.
     - Chọn Tier khách hàng: ⭐ `Hot Lead`, 💎 `VIP C-Level`, 🎯 `Cần care 24h`, 🌟 `Nổi bật`.
     - Nhập Giá trị thương vụ (Deal Value VND) và Nhân sự phụ trách (PIC).
  6. Bấm nút **"Lưu thẻ & Khách hàng"** (Gradient Vàng Hoàng Gia).
  7. Dữ liệu được ghi nhận đồng thời vào Danh bạ đối tác và CRM Lead Pipeline thực tế của doanh nghiệp.

---

### UC-APP-07: Nhắn tin Trực tiếp 1-1 (Direct Message Thread)
* **Tác nhân:** Hai doanh nhân đã kết nối.
* **Luồng sự kiện chính:**
  1. Người dùng bấm nút "Nhắn tin" từ danh thiếp hoặc danh sách kết nối.
  2. Client gọi API `POST /connect-app/dm/threads` với `targetUserId` để lấy UUID cuộc hội thoại chuẩn từ CSDL PostgreSQL (bảng `public.dm_threads`).
  3. Mở giao diện chat realtime (`ChatThreadModal.tsx` / `ChatThreadView.tsx`):
     - Header hiển thị tên đối tác, avatar viền vàng, chức vụ và công ty thực tế từ CSDL.
     - Danh sách tin nhắn tải từ `GET /connect-app/dm/threads/:threadId/messages`.
     - Kết nối WebSocket nhận tin nhắn realtime.
  4. Người dùng nhập nội dung và bấm gửi: tin nhắn xuất hiện tức thì với bong bóng chat sang trọng.
* **Quy tắc Cấm Fake:**
  - CẤM tự sinh thread ID giả lập prefix `th-...` hoặc hardcode tin nhắn mẫu.

---

### UC-APP-15: Giám sát Hoạt động Nhân sự trong ngày dành cho Giám đốc
* **Tác nhân:** Giám đốc / Lãnh đạo C-Level.
* **Luồng sự kiện chính:**
  1. Tại Trang chủ, Giám đốc bấm thẻ *"Giám sát hoạt động nhân sự trong ngày"*.
  2. Mở modal chi tiết `StaffDailyActivityModal.tsx` (hoặc `StaffDailyActivitySheet.tsx` trên PWA).
  3. Hệ thống tải dữ liệu thực từ module HRM & Operations:
     - Header KPI: Tổng nhân sự, Số người có mặt, Đang gặp khách hàng, Tại văn phòng, Tỷ lệ hoàn thành công việc.
     - Tab phân loại: [Tất cả] [Tại văn phòng] [Đang gặp đối tác].
     - Danh sách nhân sự kèm thông tin đối tác đang tiếp xúc, địa điểm, tiến độ BPMN và nhật ký check-in GPS.
  4. Giám đốc có thể bấm nút "Gọi trực tiếp" hoặc "Nhắc việc" 1-chạm.
* **Quy tắc Giao diện:**
  - Toàn bộ các nút gọi, nhắc việc, bộ lọc đều tuân thủ nghiêm ngặt quy định Gradient của ViOne App.
