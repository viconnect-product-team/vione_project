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
| **UC-APP-16** | Trải Nghiệm Cài Đặt PWA 1-Chạm (Home Install Banner Card) | Người dùng PWA | P1 - Cao | Hoạt động |
| **UC-APP-17** | Quét Mã QR Cá Nhân & Trải Nghiệm Profile 5.0 Chuẩn Doanh Nhân Hiện Đại | Doanh nhân, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-18** | Kích Hoạt Dùng Thử Miễn Phí 30 Ngày Cộng Đồng ViOne Platform | Người dùng App ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-APP-19** | Đăng Ký Gói ViOne Platform, Thanh Toán VietQR & Kiểm Soát Hạn Mức Slots | Chủ doanh nghiệp | P0 - Bắt buộc | Hoạt động |
| **UC-APP-20** | Xoá Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v) | Người dùng App ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-APP-21** | Đồng Bộ Dữ Liệu Thực Mạng Lưới B2B & Giao Diện EmptyState Luxury | Doanh nhân, Hội viên | P0 - Bắt buộc | Hoạt động |

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
* **Cập nhật Phiên bản v6.1.0 (Tháng 10/2026 - Tối giản Thẻ & Đa dạng Hồ sơ):**
  - **Quy tắc Thẻ vật lý tối giản:** Trên bề mặt thẻ VIP (Thẻ Vàng Hoàng Gia / Thẻ Bạc Bạch Kim), hệ thống STRICTLY chỉ hiển thị 3 trường: **Họ và tên**, **Công ty**, và **Số điện thoại** ("chỉ thế thôi"). Loại bỏ chức danh và email khỏi mặt thẻ để tránh rối mắt, giữ trọn vẻ tinh tế sang trọng của thẻ kim loại.
  - **Khu vực Hồ sơ Số bên dưới Thẻ:** Bên dưới thẻ là khu vực hiển thị Profile với bộ chuyển đổi linh hoạt:
    + `Hồ sơ cá nhân`: Giới thiệu bản thân (Bio), Sứ mệnh, Email, Website, Địa chỉ và Mã định danh doanh nhân.
    + `Hồ sơ doanh nghiệp`: Tên công ty, Lĩnh vực hoạt động, Năng lực hợp tác B2B, Trụ sở và Website.
  - **Mẫu Bố cục Nền Đa dạng (Interactive Background Patterns):** Dựng sẵn 3 mẫu nền hình học tinh tế cho người dùng lựa chọn:
    + `■ Vuông`: Bố cục lưới khối hình vuông chuẩn mực, thể hiện sự vững chắc, kỷ luật và minh bạch tư pháp.
    + `▲ Tam giác`: Bố cục lưới đa diện hình tam giác, biểu trưng cho tăng trưởng, bứt phá và hợp tác đa chiều.
    + `◆ Tinh thể`: Bố cục đa diện Obsidian sắc nét, tượng trưng cho vị thế C-Level và đẳng cấp thương hiệu.
  - **Cụm nút Hành động Chuẩn Gradient (Rule 8):**
    + Nút Gọi điện: Gradient Ngọc Lục Bảo (`linear-gradient(135deg,#059669_0%,#10B981_50%,#047857_100%)`).
    + Nút Chat Zalo: Gradient Xanh Zalo Blue (`linear-gradient(135deg,#0088FF_0%,#0066CC_50%,#0052A3_100%)`).
    + Nút Mã QR: Gradient Vàng Hoàng Gia (`linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)`).
    + Nút Chia sẻ: Gradient Đen Thạch Anh Mạ Vàng (`linear-gradient(135deg,#1E293B_0%,#0F172A_100%)`).
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

---

### UC-APP-11: Tham gia Cộng đồng, Quyền Hạn Người Sáng Lập & Thao Tác Tối Giản
* **Tác nhân:** Doanh nhân sáng lập cộng đồng (Owner/Creator), Thành viên ban điều hành, Hội viên.
* **Luồng sự kiện chính:**
  1. Người sáng lập tạo cộng đồng mới qua form `CreateCommunityModal.tsx`.
  2. Backend lưu thông tin vào `public.associations`, ghi nhận chính xác `creator_id = userId`, đồng thời tạo bản ghi hội viên quản trị trong `public.memberships` và `public.members`.
  3. Khi truy cập màn hình chi tiết cộng đồng (`CommunityDetail.tsx` / `CommunityDetailView.tsx`):
     - Hệ thống kiểm tra đa tầng quyền sáng lập: cột `creator_id` trong `public.associations`, đăng ký trong `public.vione_community_subscriptions`, và `localStorage.vione_created_community`.
     - Nếu nhận diện là Người sáng lập (`isCommunityCreator`), Backend & Client tự động cấp quyền Quản trị viên (`viewerRole: 'admin'`), `canEdit: true`, `isMember: true` và tự động kích hoạt cơ chế tự phục hồi (auto-repair) bản ghi hội viên nếu bị khuyết.
     - Người sáng lập luôn thấy nút **"Chỉnh sửa cộng đồng"** (chuẩn Gradient Vàng Hoàng Gia) và các công cụ quản trị.
  4. **Tối giản nút bấm (UI Minimalism):**
     - Loại bỏ nút thừa `+ Đăng cơ hội` khỏi header chi tiết cộng đồng nhằm tập trung vào các hành động giao thương cốt lõi.
     - Chỉ giữ 2 nút hành động tối giản: `Đăng bài viết` (Gradient Vàng Hoàng Gia) và `Chia sẻ sự kiện` (Gradient Đen Thạch Anh Mạ Vàng).
* **Quy chuẩn Giao diện Bắt buộc:**
  - Tuyệt đối không dùng nút màu trơn xám/xanh/đen phẳng. 100% nút bấm phải sử dụng Gradient chuẩn ViOne.

---

### UC-APP-16: Trải Nghiệm Cài Đặt PWA 1-Chạm (Home Install Banner Card Placement)
* **Tác nhân:** Người dùng PWA ViOne trên trình duyệt Web/Mobile.
* **Luồng sự kiện chính:**
  1. Loại bỏ nút cài đặt khỏi thanh Header cố định trên Trang chủ (`ExecutiveHome.tsx`) để thanh tiêu đề giữ vẻ sang trọng, không che khuất các thông tin thương hiệu.
  2. Khối thẻ **"Cài Đặt App ViOne (1-Chạm)"** (`HomeInstallBannerCard`) được di chuyển xuống vị trí dưới cùng của Trang chủ, trước các modal và thanh điều hướng đáy.
  3. Người dùng cuộn xuống đáy trang chủ sẽ thấy thẻ kêu gọi cài đặt PWA viền mạ vàng, tích hợp nút "Cài Đặt Ngay" chuẩn Gradient Vàng Hoàng Gia với đầy đủ hướng dẫn thêm vào màn hình chính (Add to Home Screen).


---

### UC-APP-17: Quét Mã QR Cá Nhân & Trải Nghiệm Profile 5.0 Chuẩn Doanh Nhân Hiện Đại (Modern Profile 5.0 Modal & QR Scanner Integration)
* **Tác nhân:** Doanh nhân, Khách đối tác, Người dùng App ViOne (Native Mobile & PWA).
* **Mục tiêu:** Nâng tầm trải nghiệm khi quét mã QR cá nhân của tài khoản trong ViOne. Thay vì mở màn hình phẳng thông thường, hệ thống bung Modal/BottomSheet Profile 5.0 siêu sang trọng, mang phong cách Executive Luxury (Đen Thạch Anh Obsidian `#050C15` & Vàng Hoàng Gia Champagne Gold `#D8B282`), hiệu ứng Holographic Glow huyền ảo, tích hợp đầy đủ các tương tác 1-chạm thông minh.
* **Luồng sự kiện chính:**
  1. **Quét Mã QR Cá Nhân:**
     - Người dùng mở trình quét mã QR trong App ViOne (`ScanQrModal.tsx` trên Native Mobile hoặc Camera QR Scanner trên PWA).
     - Đưa khung ngắm vào mã QR cá nhân của doanh nhân khác (chứa link dạng `https://vione.viconnect.vn/p/:identifier` hoặc `/public/p/:id`).
  2. **Giải Mã & Hiển Thị Modal Profile 5.0 Hiện Đại (`Profile5ModernModal.tsx`):**
     - Hệ thống tự động nhận diện mã định danh doanh nhân, gọi API `GET /api/public/profile/:identifier` hoặc `GET /connect-app/profile/:id` để lấy hồ sơ thực tế từ PostgreSQL.
     - Bung Modal toàn màn hình với thiết kế tương tác 5.0:
       * **Avatar Vòng Halo Phát Sáng:** Khung tròn avatar với dải viền Vàng Champagne chuyển động xoay nhẹ, hiệu ứng Glow 3D sang trọng.
       * **Huy hiệu Xác Thực 5.0 (Verified Shield 5.0):** Huy hiệu mạ vàng xác minh danh tính doanh nhân chính thức.
       * **Thẻ VIP Thông Minh Holographic:** Nền Đen Thạch Anh Obsidian chìm vân tinh thể, hiển thị Họ tên, Chức vụ, Tên Doanh nghiệp, Mã hội viên VIONE.
  3. **Bộ Nút Hành Động Nhanh Chuẩn Gradient (Rule 8):**
     - **Nút "Kết Nối 5.0" (Connect):** Gradient Ngọc Lục Bảo (`linear-gradient(135deg, #059669, #10B981, #047857)`), gửi yêu cầu kết nối giao thương tức thì.
     - **Nút "Nhắn Tin":** Gradient Vàng Hoàng Gia (`linear-gradient(135deg, #F6E1C3, #D8B282, #C29B69, #8C653B)`), khởi tạo thread chat 1-1 với đối tác.
     - **Nút "Lưu Danh Bạ":** Gradient Đen Thạch Anh Mạ Vàng viền vàng, xuất tệp vCard trực tiếp nạp vào danh bạ điện thoại 1-chạm.
     - **Nút "Gọi Điện":** Gradient Ngọc Lục Bảo kích hoạt cuộc gọi điện thoại trực tiếp.
     - **Nút "Chia Sẻ":** Gradient Thạch Anh kích hoạt chia sẻ hồ sơ số qua mạng xã hội hoặc sao chép liên kết.
  4. **Hệ Thống 3 Tab Tương Tác Chuyên Sâu:**
     - **Tab 1: Hồ Sơ Doanh Nhân:** Giới thiệu bản thân (Bio), Lĩnh vực chuyên môn, Sứ mệnh phát triển, Email, Số điện thoại và Địa chỉ.
     - **Tab 2: Hợp Tác B2B:** Năng lực cung ứng sản phẩm/dịch vụ, Nhu cầu kết nối giao thương, Danh mục sản phẩm thế mạnh và Lợi thế cạnh tranh.
     - **Tab 3: Mã QR Đối Ứng:** Hiển thị mã QR danh thiếp số của đối tác kèm nút tải ảnh QR chất lượng cao về máy.

---

### UC-APP-18: Kích Hoạt Dùng Thử Miễn Phí 30 Ngày Cộng Đồng ViOne Platform (30-Day Free Trial Community Hub)
* **Tác nhân:** Người dùng App ViOne thông thường (Cá nhân, Doanh nhân tự do, Doanh nghiệp mới).
* **Mục tiêu:** Cung cấp cơ chế mở khóa dùng thử toàn diện 30 ngày cho phân hệ Cộng đồng trên App ViOne (đồng bộ 100% giữa Native Mobile và PWA Web).
* **Luồng sự kiện chính:**
  1. Người dùng bấm vào Tab "Cộng đồng" trên thanh điều hướng App ViOne.
  2. Hệ thống kiểm tra trạng thái thuê bao qua API `GET /api/companies/subscription-status`.
  3. Nếu người dùng chưa kích hoạt gói:
     - Hiển thị Banner Hoàng Gia: **"FREE 30 NGÀY DÙNG THỬ CỘNG ĐỒNG VIONE PLATFORM"**.
     - Thuyết minh đặc quyền: Quản trị thành viên, Giao việc & Nhận việc Kanban, Chấm công thông minh, và Chăm sóc khách hàng CRM.
     - Nút bấm Gradient Vàng Hoàng Gia: **"Kích Hoạt 30 Ngày Dùng Thử Miễn Phí"**.
  4. Người dùng bấm kích hoạt:
     - Client gửi request `POST /api/companies/subscribe-package` với `packageType = 'trial_30_days'`.
     - Backend cập nhật trạng thái `active`, hạn dùng thử `trial_ends_at = NOW() + 30 ngày`.
     - Kích hoạt gửi email chào mừng và hướng dẫn truy cập Web CRM Quản trị.
  5. Màn hình Cộng đồng mở khóa ngay lập tức:
     - Hiển thị Huy hiệu Đếm ngược: `Dùng Thử ViOne Platform 5.0 - Còn X ngày`.
     - Cho phép khởi tạo cộng đồng mới hoặc truy cập các công cụ vận hành số (Tasks, Attendance, CRM) trực tiếp trên App.

---

### UC-APP-19: Đăng Ký Gói ViOne Platform Theo Số Lượng Tài Khoản, Thanh Toán VietQR & Kiểm Soát Giới Hạn Tạo Tài Khoản (Slot Limit Enforcement)
* **Tác nhân:** Người dùng App ViOne (Đồng bộ 100% Dual-App giữa Native Mobile và PWA Web).
* **Mục tiêu:** Cung cấp giao diện đăng ký gói ViOne Platform trực quan: nhập thông tin doanh nghiệp, chọn gói theo nhu cầu số lượng tài khoản (slots), thanh toán VietQR Napas 24/7 và đẩy hồ sơ về CRM ViConnect duyệt. Đồng thời kích hoạt cơ chế kiểm soát nghiêm ngặt hạn mức tài khoản theo gói cước.
* **Luồng sự kiện chính:**
  1. **Khởi Động Đăng Ký Gói (PackageRegistrationModal):**
     - Người dùng bấm nút **"Đăng Ký Gói ViOne"** hoặc **"Đăng Ký Gói Cụ Thể (QR)"** tại màn hình Cộng đồng.
     - Bung Modal đăng ký phong cách Đen Thạch Anh Obsidian & Vàng Champagne Gold.
  2. **Nhập Thông Tin Doanh Nghiệp & Chọn Gói:**
     - Người dùng điền thông tin: Tên doanh nghiệp (bắt buộc), Mã số thuế, Người đại diện (bắt buộc), Số điện thoại (bắt buộc), Email nhận gói (bắt buộc), Lĩnh vực kinh doanh, Địa chỉ.
     - Chọn gói cước từ danh mục nạp trực tiếp qua API `GET /api/companies/packages`:
       * Gói Dùng thử Free 30 ngày (0đ, 30 slots).
       * Gói Chuẩn (1.500.000đ, 30 slots).
       * Gói Tăng Trưởng (2.500.000đ, 50 slots).
       * Gói Doanh Nghiệp (4.500.000đ, 100 slots).
  3. **Thanh Toán VietQR Napas 24/7 Tự Động:**
     - Đối với các gói có phí, hệ thống sinh mã VietQR Napas 24/7 tự động chuẩn xác theo số tiền gói, số tài khoản, chủ tài khoản và cú pháp chuyển tiền `VIONE {packageCode} {phone}`.
     - Hỗ trợ nút sao chép 1-chạm (Copy to clipboard) cho số tài khoản và nội dung chuyển khoản.
  4. **Gửi Hồ Sơ Đăng Ký Về ViConnect CRM:**
     - Người dùng bấm nút Gradient Vàng Hoàng Gia: **"Gửi Đăng Ký Về ViConnect CRM"**.
     - Gọi API `POST /api/companies/package-orders`. Hồ sơ được lưu vào CSDL PostgreSQL và xuất hiện ngay tại tab Duyệt Đơn trên ViConnect CRM.
     - Hiển thị màn hình thông báo gửi thành công và thông tin email nhận kết quả kích hoạt.
  5. **Kiểm Soát Giới Hạn Tạo Tài Khoản (Slot Limit Enforcement):**
     - Tại màn hình Quản lý Đội ngũ & Phân quyền Nhân sự (`CompanyEmployeesTab.tsx`):
       * Hệ thống hiển thị thanh tiến trình sử dụng tài khoản: `{usedSlots} / {maxSlots} slots đã dùng`.
       * **Kiểm tra biên giới hạn (Boundary Guard):** Khi doanh nghiệp đã sử dụng hết hạn mức (ví dụ gói chỉ tạo được 10 hoặc 30 tài khoản mà người dùng cố tạo thêm 1 tài khoản mới), hệ thống chặn lại ngay lập tức và bắn thông báo chính xác:
         `"Gói của bạn chỉ có thể tạo được ${maxSlots} tài khoản"`.
       * Backend API `POST /api/companies/:id/employees` đồng thời kiểm tra lại hạn mức trong CSDL, nếu `currentCount >= maxSlots` thì trả về lỗi HTTP 400 Bad Request kèm thông điệp cảnh báo trên.

---

### UC-APP-20: Xoá Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v) (Account Deletion & Data Purge)
* **Tác nhân:** Người dùng App ViOne (Cá nhân, Doanh nhân, Thành viên doanh nghiệp).
* **Mục tiêu:** Tuân thủ 100% điều khoản Apple App Store Review Guideline 5.1.1(v) — cho phép người dùng tự khởi tạo và hoàn tất xoá tài khoản vĩnh viễn trực tiếp trong ứng dụng di động mà không cần liên hệ hỗ trợ hoặc mở web ngoài.
* **Luồng sự kiện chính:**
  1. Người dùng mở màn hình **"Thiết lập & Bảo mật tài khoản"** (`AccountSecurityModal.tsx`) từ Tab "Tôi" hoặc thanh cài đặt.
  2. Tại phần đáy màn hình, hệ thống hiển thị khối nguy hiểm: **"Vùng Nguy Hiểm — Xoá Tài Khoản Vĩnh Viễn"**.
  3. Thuyết minh rõ ràng hệ quả không thể đảo ngược: Xoá sạch toàn bộ danh thiếp số cá nhân, danh bạ kết nối, lịch hẹn, bài đăng và dữ liệu liên quan.
  4. Người dùng bấm nút **"Xoá Tài Khoản Vĩnh Viễn"** (Nút Gradient Đỏ Ruby `gradient-destructive`).
  5. Hệ thống hiển thị hộp thoại xác thực 2 bước (Two-step confirmation Alert):
     - Tiêu đề: `"Xác nhận xoá tài khoản vĩnh viễn"`.
     - Thông điệp: `"Hành động này không thể hoàn tác. Toàn bộ danh thiếp số, dữ liệu đối tác và lịch sử kết nối của bạn sẽ bị xoá vĩnh viễn khỏi hệ thống ViOne."`.
     - Nút Hủy và Nút xác nhận `"Xoá Vĩnh Viễn"` (destructive).
  6. Khi người dùng xác nhận:
     - Client gửi request `DELETE /api/me/account` (hoặc `POST /api/auth/account/delete`).
     - Backend thực thi purge dữ liệu tài khoản, vô hiệu hóa token và khóa tài khoản vĩnh viễn.
     - Ứng dụng dọn sạch bộ nhớ cache cục bộ: `AsyncStorage.clear()`.
     - Tự động gọi `logout()` và điều hướng người dùng về màn hình đăng nhập công khai.

---

### UC-APP-21: Đồng Bộ Dữ Liệu Thực Mạng Lưới B2B & Giao Diện EmptyState Luxury (Zero-Mock Data Rule)
* **Tác nhân:** Doanh nhân, Thành viên kết nối B2B trên App ViOne.
* **Mục tiêu:** Thực hiện nghiêm ngặt quy tắc **Zero-Mock Data Rule (Rule 7)** và **Dual-App Parity (Rule 4)** trên toàn bộ phân hệ Mạng lưới (`NetworkScreen.tsx`), Trang chủ (`HomeScreen.tsx`), và Cộng đồng (`CommunityHomeScreen.tsx`, `CommunityDetailView.tsx`). 100% dữ liệu hiển thị phải phản ánh trung thực từ RESTful API / PostgreSQL backend.
* **Luồng sự kiện chính:**
  1. **Nạp Dữ Liệu Thực Đồng Bộ (Real Backend Data Hydration):**
     - Tại `NetworkScreen.tsx`: Nạp song song qua `Promise.allSettled` danh bạ đối tác (`networkApi.getConnections()`), thẻ đã lưu (`networkApi.getSavedCards()`), đối tác gợi ý AI (`networkApi.getTodayRecommendations()`), khách hàng CRM (`customerApi.getCustomers()`), tin nhắn (`/connect-app/dm/threads`), và lời mời kết nối (`/connect-app/network/requests/incoming`).
     - Tab Khách hàng CRM: Tính toán các chỉ số pipeline tự động từ danh sách thật; nút "Thêm khách hàng" gọi `customerApi.createCustomer` lưu thực tế vào PostgreSQL.
     - Tab Lời mời kết nối: Hiển thị lời mời thật gửi đến; nút "Chấp nhận" gọi `networkApi.updateConnection(id, 'accepted')`, nút "Bỏ qua" gọi `updateConnection(id, 'declined')`.
  2. **Xử Lý Trạng Thái Dữ Liệu Trống Chuẩn Luxury (`EmptyState` Component):**
     - Khi CSDL trống hoặc chưa có dữ liệu ở bất kỳ màn hình nào:
       * TUYỆT ĐỐI KHÔNG hiển thị dữ liệu giả lập (mock placeholder) hoặc mảng hardcode.
       * BẮT BUỘC hiển thị component `EmptyState` sang trọng Đen Thạch Anh Obsidian `#050C15` kết hợp Vàng Champagne Gold `#D8B282`.
       * Icon Lucide đặt trong vòng tròn Gradient viền mạ vàng tinh xảo.
       * Tiêu đề và mô tả giải thích trung thực lý do danh sách trống, kèm nút hành động kêu gọi (CTA) nếu người dùng có quyền (ví dụ: "Tạo cộng đồng ngay", "Giao việc mới", "Đăng bài viết", "Chia sẻ sự kiện", "Mời thành viên").
  3. **Đồng Bộ Nút Bấm Gradient Thương Hiệu (Gradient-Only Button Rule):**
     - 100% tất cả các nút bấm CTAs trên ViOne App (cả PWA và Native) sử dụng `LinearGradient` theo đúng bảng quy chuẩn thương hiệu:
       * Primary Action: Gradient Vàng Hoàng Gia Champagne Gold (`["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]`), chữ Đen Obsidian `#050C15` font-bold.
       * Secondary Action: Gradient Đen Thạch Anh Mạ Vàng viền mạ vàng `border-[#D8B282]/40`, chữ Vàng `#F6E1C3`.
       * Destructive Action: Gradient Đỏ Ruby (`["#EF4444", "#DC2626", "#991B1B"]`), chữ Trắng.
       * Success Action: Gradient Ngọc Lục Bảo (`["#34D399", "#10B981", "#059669"]`), chữ Đen/Trắng font-bold.
