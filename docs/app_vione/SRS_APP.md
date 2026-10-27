# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - PHÂN HỆ ỨNG DỤNG DI ĐỘNG NATIVE VIONE
## SOFTWARE REQUIREMENTS SPECIFICATION — USE CASES & SYSTEM BEHAVIOR (VIONE NATIVE MOBILE APP)

> **Mã tài liệu:** `VIONE-SRS-APP-02`  
> **Phiên bản:** `7.0.0 (Cập nhật Toàn diện Chuẩn Native Mobile - Tháng 10/2026)`  
> **Phân hệ:** Ứng dụng Di Động Thuần Native ViOne Doanh Nhân (`apps/mobile_vione` — React Native / Expo Native Engine cho Google Play Store & Apple App Store)  
> **Phạm vi nền tảng (Platform Scope):** Ứng dụng di động thuần Native (iOS & Android). Toàn bộ định danh PWA trước đây chỉ là bản web dựng tạm trong giai đoạn sơ khởi của dự án và KHÔNG thuộc phạm vi đặc tả này. Tài liệu này đóng vai trò là quy chuẩn kỹ thuật chính thức và duy nhất để thẩm định, phát triển, kiểm thử và phát hành ứng dụng lên CH-PLAY và APP STORE.  
> **Nguyên tắc tài liệu:** KHÔNG XÓA NỘI DUNG CŨ. Luôn bổ sung chi tiết vào Use Case (UC-APP-xxx) tương ứng, mô tả đầy đủ 100% các trường dữ liệu, validation, placeholder, vị trí hiển thị bản ghi mới trên App và cơ chế đồng bộ / đẩy dữ liệu từ hệ thống về.

---

## 1. DANH MỤC USE CASES NATIVE MOBILE (USE CASE MATRIX)

| Mã Use Case | Tên Chức Năng Trên App Native | Tác Nhân (Actors) | Mức Ưu Tiên | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- |
| **UC-APP-01** | Đăng nhập đa kênh (Google Sign-In, Apple Sign-In native, Email, OTP SĐT) | Doanh nhân, Khách mời | P0 - Bắt buộc | Hoạt động |
| **UC-APP-02** | Xem & Cập nhật Hồ sơ Doanh nhân, Kéo căn chỉnh Avatar/Cover | Doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-03** | Hiển thị Thẻ Danh thiếp VIP & Chạm 1-Tap NFC Vật Lý | Doanh nhân, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-04** | Xem Hồ sơ Số Cá nhân & Quản lý Mã QR Chia sẻ Đối tác | Khách vãng lai, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-05** | Quét mã QR đối tác (Live Camera Native Zalo-Style Scanner) | Doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-06** | Chụp Danh thiếp Giấy AI OCR & Chuyển Khách hàng Lead CRM | Doanh nhân, Trợ lý | P0 - Bắt buộc | Hoạt động |
| **UC-APP-07** | Nhắn tin Trực tiếp 1-1 Thời Gian Thực (Direct Message Realtime Thread) | Hai doanh nhân | P0 - Bắt buộc | Hoạt động |
| **UC-APP-08** | Đăng & Xem Khoảnh khắc Doanh nhân 24h (Stories Video/Image) | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-09** | Lên lịch hẹn & Điều phối Cuộc gặp 1-on-1 (Appointments) | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-10** | Quản lý & Chăm sóc Khách hàng Tiềm năng (Leads CRM Mobile) | Doanh nhân, Kinh doanh | P1 - Cao | Hoạt động |
| **UC-APP-11** | Khởi tạo, Tham gia & Quản trị Cộng đồng Doanh nghiệp (Community Hub) | Doanh nhân, Trưởng nhóm | P1 - Cao | Hoạt động |
| **UC-APP-12** | Đăng tin & Tìm kiếm Cơ hội Kinh doanh B2B (Opportunities) | Doanh nhân, Chủ DN | P1 - Cao | Hoạt động |
| **UC-APP-13** | Đăng ký & Điểm danh Vé Sự kiện B2B (Dynamic QR Ticket) | Doanh nhân, BTC | P1 - Cao | Hoạt động |
| **UC-APP-14** | Ra lệnh Giọng nói Trợ lý Doanh nhân AI (Floating Orb Voice AI) | Doanh nhân | P1 - Cao | Hoạt động |
| **UC-APP-15** | Giám sát Hoạt động Nhân sự trong ngày dành cho Giám đốc | Ban Giám Đốc | P1 - Cao | Hoạt động |
| **UC-APP-16** | Điểm Danh & Chấm Công GPS/FaceID Khu Vực Làm Việc (Check-in Mobile) | Nhân sự doanh nghiệp | P0 - Bắt buộc | Hoạt động |
| **UC-APP-17** | Quét Mã QR Cá Nhân & Trải Nghiệm Profile 5.0 Executive Luxury | Doanh nhân, Đối tác | P0 - Bắt buộc | Hoạt động |
| **UC-APP-18** | Kích Hoạt Dùng Thử Miễn Phí 30 Ngày & Phân Quyền Quản Trị ViConnect | Người dùng App ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-APP-19** | Đăng Ký Gói ViOne Platform, Thanh Toán VietQR & Kiểm Soát Hạn Mức Slots | Chủ doanh nghiệp | P0 - Bắt buộc | Hoạt động |
| **UC-APP-20** | Xoá Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v) | Người dùng App ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-APP-21** | Đồng Bộ Dữ Liệu Thực Mạng Lưới B2B & Giao Diện EmptyState Luxury | Doanh nhân, Hội viên | P0 - Bắt buộc | Hoạt động |
| **UC-APP-22** | Nhận Việc, Cập Nhật Tiến Độ Checklist & Báo Cáo Nhiệm Vụ Mobile | Nhân sự doanh nghiệp | P0 - Bắt buộc | Hoạt động |
| **UC-APP-23** | Không Gian Cộng Đồng Doanh Nghiệp Riêng Biệt (Dedicated Corporate Workspace) | Lãnh đạo & Nhân sự DN | P0 - Bắt buộc | Hoạt động |
| **UC-APP-24** | Đăng Ký & Kích Hoạt Gói Doanh Nghiệp In-App Qua VietQR Napas 24/7 | Chủ Doanh nghiệp | P0 - Bắt buộc | Hoạt động |
| **UC-APP-25** | Khám Phá & Số Hóa Di Sản Văn Hóa Quốc Gia, VR360 & Geo Audio Guide (ViOne Heritage) | Công dân, Du khách, ViConnect Admin | P0 - Bắt buộc | Mới phát triển |
| **UC-APP-26** | Trải Nghiệm Bảo Tàng Số, Hiện Vật 3D AR & Thuyết Minh 1-Chạm NFC (ViOne Museum) | Khách tham quan, ViConnect Curator | P0 - Bắt buộc | Mới phát triển |
| **UC-APP-27** | Quản Trị Giải Đấu Thể Thao Đa Môn, Sơ Đồ Bracket & Hộ Chiếu VĐV (ViOne Sport) | Vận động viên, Trọng tài, ViConnect Admin | P0 - Bắt buộc | Mới phát triển |
| **UC-APP-28** | Giải Chạy Marathon/Trail, Cấp BIB Tự Động, Timing RFID & Live Leaderboard (ViOne Run) | Runner, Race Director, ViConnect Admin | P0 - Bắt buộc | Mới phát triển |
| **UC-APP-29** | Giải Chạy Di Sản (Heritage Run) & Cổng Dịch Vụ Văn Hóa - Thể Thao ViConnect | Runner, Khách du lịch, ViConnect Master | P0 - Bắt buộc | Mới phát triển |

---

## 2. CHI TIẾT CÁC USE CASE & ĐẶC TẢ TRƯỜNG DỮ LIỆU CHUẨN NATIVE MOBILE

---

### UC-APP-01: Đăng nhập đa kênh (Google Sign-In, Apple Sign-In Native, Email, OTP SĐT)
* **Tác nhân:** Doanh nhân, Hội viên doanh nghiệp, Khách mời mới.
* **Màn hình thực hiện trên App Native:** `LoginScreen.tsx`, `OtpVerificationModal.tsx`.
* **Tiền điều kiện:** Ứng dụng ViOne Native đã được cài đặt trên thiết bị iOS (từ App Store) hoặc Android (từ CH-Play), thiết bị có kết nối mạng Internet.
* **Hậu điều kiện:** Người dùng được cấp Token định danh JWT (Access Token & Refresh Token) lưu an toàn trong `expo-secure-store`, điều hướng thẳng vào Trang Chủ (`HomeScreen.tsx`).

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Đăng Nhập
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `email` | Email doanh nghiệp | `TextInput` (email-address) | `nhap_email@doanhnghiep.vn` | Bắt buộc nếu đăng nhập bằng Email. Định dạng RFC 5322 regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `Email không đúng định dạng!` / `Vui lòng nhập email!` |
| `password` | Mật khẩu bảo mật | `TextInput` (password, secureTextEntry) | `••••••••` | Bắt buộc nếu đăng nhập bằng Email. Độ dài tối thiểu 6 ký tự. | `Mật khẩu phải có ít nhất 6 ký tự!` |
| `phone` | Số điện thoại | `TextInput` (phone-pad) | `0912 345 678` | Bắt buộc nếu chọn nhận OTP. Định dạng SĐT Việt Nam: Bắt đầu bằng 03, 05, 07, 08, 09, đúng 10 chữ số: `^(0[3\|5\|7\|8\|9])[0-9]{8}$` | `Số điện thoại Việt Nam không hợp lệ (10 số)!` |
| `otp_code` | Mã xác thực OTP | `TextInput` (number-pad, 6 ô) | `_ _ _ _ _ _` | Bắt buộc khi vào màn hình OTP. Đúng 6 chữ số: `^[0-9]{6}$`. Hết hạn sau 120 giây. | `Mã OTP gồm 6 chữ số không hợp lệ hoặc đã hết hạn!` |
| `id_token` | Apple / Google Token | `Hidden Native Payload` | N/A | Được sinh tự động bởi Apple Authentication Framework (iOS) hoặc Google Play Services Auth (Android). | `Xác thực Apple/Google thất bại. Vui lòng thử lại!` |

#### 2. Luồng sự kiện chính
1. Người dùng mở App ViOne Native trên điện thoại.
2. Chọn phương thức xác thực:
   - **Bấm "Tiếp tục với Apple"**: Native iOS gọi `AppleAuthentication.signInAsync()`, mở hộp thoại FaceID / TouchID của Apple.
   - **Bấm "Tiếp tục với Google"**: Gọi Google Play Services SDK trên Android hoặc Google SignIn trên iOS.
   - **Nhập Email & Mật khẩu**: Điền thông tin vào form, bấm nút Gradient Vàng Hoàng Gia **"Đăng Nhập"**.
   - **Đăng nhập bằng OTP**: Nhập SĐT, bấm "Nhận mã OTP", hệ thống gửi SMS Brandname ViOne, người dùng nhập 6 số xác nhận.
3. Backend NestJS thẩm định thông tin qua `POST /connect-app/auth/login`.
4. Nếu thành công, lưu token vào SecureStore, cập nhật State `isAuthenticated = true`.

#### 3. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Điều hướng tức thì vào `HomeScreen.tsx`. Tên doanh nhân, Avatar viền vàng và mã VIP xuất hiện ngay trên Header trang chủ.
* **Cơ chế đẩy dữ liệu từ hệ thống về:** Hệ thống tự động đẩy gói thông tin hồ sơ `GET /api/me/profile`, quyền hạn doanh nghiệp `GET /api/roles/my-permissions` và danh sách thông báo chưa đọc `GET /api/notifications/unread-count`. Đồng thời thiết lập kết nối WebSocket với máy chủ thông báo để nhận Push Notifications (APNs / FCM) khi có người kết nối hoặc giao việc mới.

---

### UC-APP-02: Xem & Cập nhật Hồ sơ Doanh nhân & Căn chỉnh Avatar/Cover
* **Tác nhân:** Doanh nhân, Chủ doanh nghiệp.
* **Màn hình thực hiện trên App Native:** `ProfileScreen.tsx`, `EditProfileModal.tsx`.
* **Tiền điều kiện:** Đã đăng nhập vào App ViOne Native.
* **Hậu điều kiện:** Thông tin hồ sơ được cập nhật vào bảng `public.vione_users`, `user_profiles` và phản ánh tức thì trên toàn bộ danh thiếp số công khai.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Cập Nhật Hồ Sơ
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Họ và tên | `TextInput` (default) | `VD: Nguyễn Văn An` | Bắt buộc. Độ dài từ 2 đến 60 ký tự. Không chứa ký tự đặc biệt độc hại. | `Họ và tên không được để trống (2-60 ký tự)!` |
| `title` | Chức danh / Vị trí | `TextInput` (default) | `VD: Tổng Giám Đốc` | Tùy chọn. Tối đa 80 ký tự. | `Chức danh không vượt quá 80 ký tự!` |
| `company` | Tên doanh nghiệp | `TextInput` (default) | `VD: Công ty Cổ phần Công nghệ ViConnect` | Tùy chọn. Tối đa 120 ký tự. | `Tên công ty không vượt quá 120 ký tự!` |
| `phone` | Số điện thoại liên hệ | `TextInput` (phone-pad) | `0912 345 678` | Bắt buộc. Định dạng 10 số di động VN: `^(0[3\|5\|7\|8\|9])[0-9]{8}$`. | `Số điện thoại liên hệ không hợp lệ!` |
| `bio` | Giới thiệu bản thân | `TextInput` (multiline, 4 dòng) | `Chia sẻ ngắn gọn về sứ mệnh, triết lý kinh doanh và mục tiêu kết nối của bạn...` | Tùy chọn. Tối đa 500 ký tự. | `Nội dung giới thiệu không vượt quá 500 ký tự!` |
| `industry` | Lĩnh vực hoạt động | `SelectPicker` / Modal chọn | `Chọn ngành nghề kinh doanh` | Bắt buộc. Chọn từ danh mục 25 ngành nghề chuẩn VCCI. | `Vui lòng chọn lĩnh vực hoạt động!` |
| `avatar_file` | Ảnh đại diện (Avatar) | `ImagePicker` Native | N/A | Tùy chọn. Định dạng JPG, PNG, WEBP. Tự động crop vuông 1:1, nén tối đa 1.5MB. | `Ảnh đại diện phải ở định dạng JPG/PNG và dung lượng < 5MB!` |
| `cover_file` | Ảnh bìa (Cover) | `ImagePicker` Native | N/A | Tùy chọn. Định dạng JPG, PNG. Tỉ lệ 16:9, nén tối đa 2MB. | `Ảnh bìa vượt quá dung lượng cho phép!` |
| `zalo_phone` | Số Zalo kết nối | `TextInput` (phone-pad) | `0912 345 678` | Tùy chọn. Định dạng 10 số. | `Số Zalo không hợp lệ!` |
| `website` | Website công ty | `TextInput` (url) | `https://viconnect.vn` | Tùy chọn. URL hợp lệ regex `^https?:\/\/.+`. | `Địa chỉ website phải bắt đầu bằng http:// hoặc https://` |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Ngay khi bấm "Lưu thay đổi" (Gradient Vàng Hoàng Gia), modal đóng lại, màn hình `ProfileScreen.tsx` cập nhật tức thì (Optimistic Update) với Avatar mới, họ tên, chức danh và tiểu sử mới.
* **Cơ chế đẩy dữ liệu từ hệ thống về:** Backend ghi nhận vào PostgreSQL, trả về JSON Profile mới nhất. Ứng dụng phát thông điệp đồng bộ cục bộ để cập nhật Thẻ VIP ở Tab "Tôi" và thẻ danh thiếp trên Trang chủ mà không cần tải lại app.

---

### UC-APP-03: Hiển thị Thẻ Danh thiếp VIP & Chạm 1-Tap NFC Vật Lý
* **Tác nhân:** Doanh nhân, Đối tác đối diện có điện thoại hỗ trợ NFC.
* **Màn hình thực hiện trên App Native:** `VipCardViewScreen.tsx`, `MyQrModal.tsx`.
* **Tiền điều kiện:** Doanh nhân sở hữu thẻ kim loại ViOne NFC hoặc kích hoạt danh thiếp điện tử.
* **Luồng sự kiện & Quy tắc hiển thị tối giản:**
  1. Người dùng bấm biểu tượng chữ **V** trung tâm thanh điều hướng hoặc vào tab "Tôi" chọn **"Thẻ VIP của tôi"**.
  2. Hệ thống kết xuất đồ họa Thẻ kim loại 3D chuẩn Executive Luxury (Đen Thạch Anh Obsidian mạ Vàng Hoàng Gia Champagne Gold `#D8B282` hoặc Bạc Bạch Kim Platinum):
     - Hiệu ứng ánh kim chuyển động theo con quay hồi chuyển thiết bị (Gyroscope tilt effect).
     - **Quy tắc Thẻ vật lý tối giản:** Trên bề mặt thẻ VIP STRICTLY chỉ hiển thị đúng 3 trường: **Họ và tên**, **Công ty**, và **Số điện thoại** ("chỉ thế thôi").
     - Chip kim loại 3D nguyên khối, biểu tượng sóng NFC và mã số doanh nhân định danh duy nhất (VD: `VIONE-8888`).
  3. **Chạm 1-Tap NFC Vật Lý:**
     - Doanh nhân chạm thẻ kim loại hoặc mặt lưng điện thoại vào máy đối tác.
     - Chip NFC phát sóng NDEF chứa liên kết rút gọn mã hóa `https://vione.viconnect.vn/p/:identifier`.
     - Điện thoại đối tác (iOS / Android) tự động bật thông báo mở Profile doanh nhân trong 0.5 giây mà không cần cài app trước.
  4. **Khu vực Hồ sơ Số bên dưới Thẻ:**
     - Bộ chuyển đổi 2 chế độ: `Hồ sơ cá nhân` (Bio, Email, Mã hội viên) và `Hồ sơ doanh nghiệp` (Lĩnh vực, Năng lực B2B, Địa chỉ).
     - Chọn 3 mẫu lưới nền hình học tinh tế: `■ Vuông` (Kỷ luật, vững chắc), `▲ Tam giác` (Tăng trưởng bứt phá), `◆ Tinh thể` (Đẳng cấp Obsidian).
     - Cụm 4 nút bấm hành động chuẩn Gradient: Gọi điện (Ngọc Lục Bảo), Chat Zalo (Zalo Blue), Mã QR (Vàng Hoàng Gia), Chia sẻ (Đen Thạch Anh Mạ Vàng).

---

### UC-APP-06: Chụp Danh thiếp Giấy AI OCR & Chuyển Thành Khách Hàng Lead CRM
* **Tác nhân:** Doanh nhân, Trợ lý Giám đốc.
* **Màn hình thực hiện trên App Native:** `CardScanCameraScreen.tsx`, `BusinessCardReviewModal.tsx`.
* **Tiền điều kiện:** Thiết bị đã cấp quyền Camera (`expo-camera` / `react-native-vision-camera`).
* **Hậu điều kiện:** Danh thiếp được số hóa lưu vào danh bạ, đồng thời tạo mới 1 bản ghi Khách hàng tiềm năng (Lead) trong CSDL CRM.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Thẩm Định Sau Khi OCR
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `card_image` | Ảnh chụp danh thiếp | `CameraSnapshot` | N/A | Bắt buộc. Ảnh được nén tự động $< 450\text{KB}$, độ tương phản cao. | `Vui lòng chụp lại ảnh danh thiếp rõ nét!` |
| `extracted_name` | Họ và tên đối tác | `TextInput` | `Họ tên trên danh thiếp` | Bắt buộc. AI tự động điền, người dùng có thể sửa. Độ dài 2-60 ký tự. | `Tên đối tác không được để trống!` |
| `extracted_phone` | Số điện thoại đối tác | `TextInput` (phone-pad) | `Số điện thoại` | Bắt buộc. Tự động chuẩn hóa về định dạng 10 số. | `Số điện thoại không hợp lệ!` |
| `extracted_email` | Email đối tác | `TextInput` (email-address) | `Email liên hệ` | Tùy chọn. Định dạng email hợp lệ. | `Email không đúng định dạng!` |
| `extracted_company`| Công ty đối tác | `TextInput` | `Tên doanh nghiệp` | Tùy chọn. Tối đa 120 ký tự. | `Tên công ty quá dài!` |
| `extracted_title` | Chức vụ | `TextInput` | `Chức danh trên thẻ` | Tùy chọn. Tối đa 80 ký tự. | N/A |
| `save_as_lead` | Lưu thành Khách hàng CRM | `Switch` (Toggle) | `Bật/Tắt` | Mặc định: `BẬT` (True). | N/A |
| `lead_tier` | Hạng tiềm năng (Tier) | `SelectPicker` | `Chọn phân khúc Lead` | Bắt buộc nếu bật `save_as_lead`. Các giá trị: ⭐ `Hot Lead`, 💎 `VIP C-Level`, 🎯 `Cần care 24h`, 🌟 `Nổi bật`. | `Vui lòng chọn phân khúc khách hàng!` |
| `deal_value` | Giá trị thương vụ dự kiến | `NumberInput` (currency) | `VD: 50,000,000` | Tùy chọn. Số nguyên dương $> 0$ (VND). | `Giá trị thương vụ phải là số dương!` |
| `assigned_pic` | Nhân sự phụ trách (PIC) | `SelectPicker` | `Chọn nhân sự chăm sóc` | Tùy chọn. Danh sách nhân sự trong công ty của người quét. | N/A |
| `notes` | Ghi chú cuộc gặp | `TextInput` (multiline) | `Bối cảnh gặp gỡ, nhu cầu hợp tác...` | Tùy chọn. Tối đa 300 ký tự. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** 
  1. Thẻ danh thiếp mới xuất hiện ngay tại vị trí **ĐẦU TIÊN** của Tab *"Thẻ Đã Lưu"* trên màn hình Mạng Lưới (`NetworkScreen.tsx`).
  2. Khách hàng mới lập tức xuất hiện tại vị trí **ĐẦU TIÊN** của Tab *"Khách Hàng CRM"* (`customerApi.getCustomers()`) kèm badge phân hạng (Hot Lead / VIP C-Level).
* **Cơ chế đẩy dữ liệu về CRM:** Dữ liệu được backend ghi vào PostgreSQL (`public.crm_leads`), đẩy tín hiệu qua WebSocket về hệ thống Web CRM. Trên màn hình CRM của công ty, danh sách Khách hàng (`/members`) tự động nhảy thêm 1 bản ghi mới ở dòng 1 mà nhân viên kinh doanh không cần F5 trình duyệt.

---

### UC-APP-07: Nhắn Tin Trực Tiếp 1-1 Thời Gian Thực (Direct Message Realtime Thread)
* **Tác nhân:** Hai doanh nhân đã kết nối trên mạng lưới ViOne.
* **Màn hình thực hiện trên App Native:** `ChatThreadModal.tsx`, `ChatMessagesScreen.tsx`.
* **Tiền điều kiện:** Hai bên đã quét thẻ hoặc chấp nhận kết nối.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Khung Soạn Thảo Tin Nhắn
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `message_text` | Nội dung tin nhắn | `TextInput` (multiline) | `Nhập tin nhắn trao đổi...` | Bắt buộc khi bấm gửi. Tối thiểu 1 ký tự, tối đa 2000 ký tự. Cắt khoảng trắng đầu cuối (trim). | `Tin nhắn không được để trống!` |
| `attached_image` | Ảnh đính kèm | `ImagePicker` Native | N/A | Tùy chọn. Tối đa 5 ảnh/lần gửi. Dung lượng tối đa 10MB/ảnh. | `Ảnh đính kèm vượt quá dung lượng!` |
| `thread_id` | Định danh hội thoại | `Hidden UUID` | N/A | Bắt buộc. Phải là UUID chuẩn `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` lưu trong `public.dm_threads`. Tuyệt đối không dùng ID giả lập `th-...`. | `Cuộc hội thoại không hợp lệ!` |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App người gửi:** Tin nhắn xuất hiện tức thì ở cuối danh sách bong bóng chat với hiệu ứng Optimistic UI (Bong bóng Vàng Champagne mạ đen viền vàng), trạng thái hiển thị tích xám "Đang gửi" -> chuyển sang tích đôi vàng "Đã chuyển".
* **Cơ chế đẩy dữ liệu về máy người nhận:** 
  - Máy chủ Backend phát sự kiện WebSocket `new_message` tới kênh cá nhân của người nhận.
  - Nếu đối tác đang mở màn hình chat, tin nhắn trượt lên ngay tức khắc ($< 200\text{ms}$).
  - Nếu đối tác đang tắt app hoặc ở màn hình khác, máy chủ kích hoạt dịch vụ **Push Notification Apple (APNs) / Google (FCM)** gửi thông báo biểu ngữ trên màn hình khóa: *"Doanh nhân [Tên đối tác] vừa gửi tin nhắn mới cho bạn"*. Chạm vào thông báo sẽ mở thẳng vào thread chat này.

---

### UC-APP-11: Khởi Tạo, Tham Gia & Quản Trị Cộng Đồng Doanh Nghiệp (Community Hub)
* **Tác nhân:** Doanh nhân sáng lập (Owner / Creator), Ban Điều Hành, Hội viên cộng đồng.
* **Màn hình thực hiện trên App Native:** `CommunityScreen.tsx`, `CreateCommunityModal.tsx`, `CommunityDetailView.tsx`.
* **Tiền điều kiện:** Người dùng đã đăng nhập.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Khởi Tạo Cộng Đồng
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Tên cộng đồng / Hiệp hội | `TextInput` | `VD: Hiệp hội Doanh nhân Trẻ ViOne Hà Nội` | Bắt buộc. Độ dài từ 5 đến 120 ký tự. | `Tên cộng đồng phải từ 5 đến 120 ký tự!` |
| `short_description`| Mô tả ngắn gọn | `TextInput` (multiline, 2 dòng) | `Sứ mệnh, tiêu chí giao thương và đối tượng tham gia...` | Bắt buộc. Từ 20 đến 250 ký tự. | `Mô tả ngắn phải từ 20 đến 250 ký tự!` |
| `industry` | Ngành nghề trọng tâm | `SelectPicker` | `Chọn lĩnh vực liên minh` | Bắt buộc. Chọn từ danh mục ngành nghề. | `Vui lòng chọn ngành nghề trọng tâm!` |
| `city` | Tỉnh / Thành phố | `SelectPicker` | `Chọn tỉnh/thành hoạt động` | Bắt buộc. Chọn trong 63 tỉnh thành Việt Nam. | `Vui lòng chọn tỉnh thành!` |
| `logo_file` | Biểu trưng (Logo) | `ImagePicker` Native | N/A | Tùy chọn. Ảnh tròn 1:1, tối đa 2MB. | `Logo vượt quá 2MB!` |
| `banner_file` | Ảnh bìa cộng đồng | `ImagePicker` Native | N/A | Tùy chọn. Ảnh tỉ lệ 16:9, tối đa 3MB. | `Ảnh bìa vượt quá 3MB!` |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Sau khi bấm nút Gradient Vàng Hoàng Gia **"Tạo Cộng Đồng"**, modal đóng lại. Cộng đồng mới lập tức hiển thị ở vị trí **ĐẦU TIÊN** của Tab *"Cộng đồng của tôi"* trên màn hình `CommunityHomeScreen.tsx`. Đồng thời app tự động chuyển người dùng vào thẳng màn hình chi tiết cộng đồng (`CommunityDetailView.tsx`) với đầy đủ quyền Admin.
* **Cơ chế đẩy dữ liệu từ hệ thống về:** Backend lưu vào `public.associations`, tự động gán `creator_id = userId`, tạo bản ghi thành viên sáng lập trong `public.members`. Dữ liệu được đồng bộ ngay về CRM Nền Tảng để Ban Quản Trị ViConnect theo dõi và hỗ trợ.

---

### UC-APP-16: Điểm Danh & Chấm Công GPS/FaceID Khu Vực Làm Việc (Check-in Mobile)
* **Tác nhân:** Nhân sự thuộc doanh nghiệp sở hữu gói ViOne Platform.
* **Màn hình thực hiện trên App Native:** `AttendanceCheckInModal.tsx`, `AttendanceHistoryScreen.tsx`.
* **Tiền điều kiện:** Doanh nghiệp đã thiết lập tọa độ văn phòng (Kinh độ/Vĩ độ, Bán kính cho phép) trên Web CRM; thiết bị di động đã cấp quyền Vị trí (GPS) và Camera.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Chấm Công Mobile
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `latitude` | Vĩ độ thực tế thiết bị | `GPS Sensor Read` | N/A | Bắt buộc. Tọa độ thực tế lấy từ `expo-location` với độ chính xác cao (`Accuracy.High`). | `Không lấy được tọa độ GPS. Vui lòng bật vị trí!` |
| `longitude` | Kinh độ thực tế thiết bị | `GPS Sensor Read` | N/A | Bắt buộc. Tọa độ thực tế. | N/A |
| `distance_meters`| Khoảng cách tới công ty | `System Calculated` | N/A | Tự động tính theo công thức Haversine. Phải $\le \text{radius}$ quy định của công ty (VD: 200m). | `Bạn đang cách văn phòng X mét (vượt bán kính cho phép 200m)!` |
| `face_snapshot` | Ảnh chụp xác thực gương mặt | `Camera Selfie Live` | N/A | Bắt buộc. Chụp trực tiếp từ camera trước, chống gian lận ảnh chụp lại (liveness check). | `Chụp ảnh gương mặt thất bại!` |
| `check_in_note` | Ghi chú chấm công | `TextInput` | `VD: Check-in ca sáng, đi công tác...` | Tùy chọn. Tối đa 150 ký tự. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Ngay khi xác thực thành công, màn hình bung thông báo thành công viền mạ vàng: *"Điểm danh thành công lúc HH:mm:ss - Trạng thái: Đúng giờ"*. Bản ghi mới nhất xuất hiện ở dòng 1 trong danh sách *"Lịch sử chấm công của tôi"*.
* **Cơ chế đẩy dữ liệu về CRM:** Backend lưu bản ghi vào `public.attendance_records`, phát tín hiệu tức thời qua WebSocket về Web CRM. Màn hình Giám sát Chấm công của Giám đốc/HR (`/attendance`) trên Web CRM tự động nhảy trạng thái nhân sự từ "Chưa đến" sang "Có mặt" và cập nhật chỉ số chuyên cần trong thời gian thực.

---

### UC-APP-19: Đăng Ký Gói ViOne Platform Theo Hạn Mức Slots & Thanh Toán VietQR
* **Tác nhân:** Chủ doanh nghiệp, Doanh nhân muốn mở rộng quy mô tổ chức.
* **Màn hình thực hiện trên App Native:** `PackageRegistrationModal.tsx`.
* **Tiền điều kiện:** Tài khoản cá nhân hoặc doanh nghiệp chưa đăng ký gói hoặc có nhu cầu nâng cấp hạn mức tài khoản.
* **Hậu điều kiện:** Đơn hàng được tạo trong `public.vione_package_orders`, mã VietQR Napas 24/7 được sinh tự động, hồ sơ được đẩy về CRM ViConnect xét duyệt.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Đăng Ký Gói
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `company_name` | Tên doanh nghiệp | `TextInput` | `Công ty Cổ phần / TNHH...` | Bắt buộc. Từ 5 đến 150 ký tự. | `Vui lòng nhập tên công ty!` |
| `tax_code` | Mã số thuế (MST) | `TextInput` (number-pad) | `0101234567` | Tùy chọn. Từ 10 đến 13 chữ số: `^[0-9]{10}(-[0-9]{3})?$`. | `Mã số thuế gồm 10 hoặc 13 chữ số!` |
| `representative`| Người đại diện pháp luật | `TextInput` | `Họ và tên người đại diện` | Bắt buộc. Từ 2 đến 60 ký tự. | `Vui lòng nhập người đại diện!` |
| `phone` | Số điện thoại nhận gói | `TextInput` (phone-pad) | `0912 345 678` | Bắt buộc. 10 số di động VN. | `Số điện thoại không hợp lệ!` |
| `email` | Email nhận thông tin CRM | `TextInput` (email-address) | `admin@congty.com` | Bắt buộc. Định dạng email hợp lệ. | `Email nhận kích hoạt không hợp lệ!` |
| `package_id` | Gói cước giải pháp | `CardSelectionGroup` | N/A | Bắt buộc chọn 1 gói: Free 30D (0đ/30 slots), Gói Chuẩn (1.5tr/30 slots), Gói Tăng Trưởng (2.5tr/50 slots), Gói Doanh Nghiệp (4.5tr/100 slots). | `Vui lòng chọn một gói cước!` |
| `transfer_proof`| Ảnh biên lai chuyển khoản | `ImagePicker` Native | N/A | Tùy chọn với gói trả phí. Định dạng ảnh JPG/PNG. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Sau khi gửi đăng ký, modal chuyển sang màn hình thành công hiển thị mã đơn hàng `ORD-XXXX`, kèm mã VietQR Napas 24/7 (với gói có phí) chứa sẵn số tiền và cú pháp chuyển khoản `VIONE {packageCode} {phone}`.
* **Cơ chế đẩy dữ liệu về CRM:** Hồ sơ đơn hàng được đẩy tức thời vào bảng `public.vione_package_orders` trên CSDL PostgreSQL. Tại Web CRM ViConnect (`/segments` - Tab "Duyệt Đơn Hàng"), đơn hàng mới lập tức xuất hiện ở dòng đầu tiên của bảng duyệt đơn để nhân sự tài chính ViConnect đối soát và kích hoạt gói.

---

### UC-APP-20: Xoá Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v)
* **Tác nhân:** Người dùng App ViOne Native.
* **Màn hình thực hiện trên App Native:** `AccountSecurityModal.tsx`.
* **Mục tiêu:** Tuân thủ 100% điều khoản nghiêm ngặt của Apple App Store (Guideline 5.1.1(v)) — bắt buộc cho phép người dùng tự xóa tài khoản vĩnh viễn trực tiếp từ bên trong ứng dụng.
* **Luồng sự kiện:**
  1. Người dùng vào tab "Tôi" -> chọn "Bảo mật tài khoản" (`AccountSecurityModal.tsx`).
  2. Cuộn xuống đáy màn hình đến khối nguy hiểm màu Đỏ Ruby: **"VÙNG NGUY HIỂM — XOÁ TÀI KHOẢN VĨNH VIỄN"**.
  3. Bấm nút Gradient Đỏ Ruby: **"Xoá Tài Khoản Vĩnh Viễn"**.
  4. Hộp thoại Native Alert 2 bước xác nhận:
     - *"Hành động này không thể hoàn tác. Toàn bộ danh thiếp số, dữ liệu đối tác, tin nhắn và lịch sử kết nối của bạn sẽ bị xoá vĩnh viễn khỏi hệ thống ViOne."*
     - Bấm nút đỏ: *"Xoá Vĩnh Viễn"*.
  5. Client gọi API `DELETE /connect-app/me/account`.
  6. Backend xóa/vô hiệu hóa tài khoản trong `auth.users` và `public.vione_users`.
  7. Client xóa toàn bộ cache `AsyncStorage.clear()`, gọi `logout()`, đưa người dùng về màn hình đăng nhập.

---

### UC-APP-22: Nhận Việc, Cập Nhật Tiến Độ Checklist & Báo Cáo Nhiệm Vụ Mobile
* **Tác nhân:** Nhân sự doanh nghiệp.
* **Màn hình thực hiện trên App Native:** `CommunityDetailView.tsx` (Tab Nhiệm vụ), `TaskDetailModal.tsx`.
* **Tiền điều kiện:** Nhân sự đã được công ty giao việc trên Web CRM hoặc trên App.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Cập Nhật Tiến Độ Công Việc
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `task_status` | Trạng thái nhiệm vụ | `SelectChips` | N/A | Bắt buộc. Các giá trị: `todo` (Cần làm), `in_progress` (Đang làm), `review` (Chờ duyệt), `done` (Hoàn thành). | N/A |
| `checklist_item` | Đầu việc con (Checklist) | `Checkbox` (Toggle done) | N/A | Đánh dấu hoàn thành từng tiêu chí con. Bắt buộc hoàn thành 100% checklist trước khi chuyển sang `done` (Quy tắc BR-WRK-07). | `Bắt buộc hoàn thành 100% Checklist trước khi nghiệm thu Done!` |
| `progress_pct` | Tỷ lệ hoàn thành (%) | `Slider` (0% - 100%) | N/A | Tự động tính theo tỷ lệ checklist hoàn thành hoặc kéo tay từ 0 đến 100. | `Tiến độ phải từ 0% đến 100%!` |
| `report_note` | Báo cáo kết quả | `TextInput` (multiline) | `Báo cáo vướng mắc hoặc kết quả đạt được...` | Tùy chọn. Tối đa 500 ký tự. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu từ hệ thống về
* **Vị trí hiển thị trên App:** Khi nhân sự bấm "Đánh dấu đang làm" hoặc tích checklist, thẻ công việc cập nhật màu sắc và thanh tiến trình tức thì trên màn hình di động.
* **Cơ chế đẩy dữ liệu về CRM:** Trạng thái được gửi qua API `PATCH /companies/:companyId/tasks/:taskId/status`. Trên Web CRM của Giám đốc (`/workflow` và `/companies/:id?tab=tasks`), cột thẻ Kanban tự động dịch chuyển tương ứng trong thời gian thực, đảm bảo Giám đốc luôn nắm bắt tiến độ chính xác của nhân viên.

---

### UC-APP-23: Không Gian Cộng Đồng Doanh Nghiệp Biệt Lập (Dedicated Corporate Workspace)
* **Tác nhân:** Ban Lãnh đạo, Cán bộ nhân viên Doanh nghiệp (Minh họa: VIASIA TECH JSC), Super Admin Nền tảng (ViConnect).
* **Màn hình thực hiện trên App Native:** `CommunityScreen.tsx`, `CommunityHomeScreen.tsx`, `CommunityDetailView.tsx`.
* **Tiền điều kiện:** Đã đăng nhập vào App ViOne Native và doanh nghiệp đã kích hoạt Gói ViOne Platform.
* **Mục tiêu:** Cung cấp không gian làm việc số và mạng xã hội nội bộ chuyên biệt cho từng doanh nghiệp, phân định rõ giữa góc nhìn Chủ quản nền tảng (Host Master ViConnect) và Doanh nghiệp khách hàng mua gói (Tenant Client - VIASIA TECH JSC).

#### 1. Bảng Đặc Tả Trường Dữ Liệu Bài Đăng & Tương Tác Nội Bộ
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `content` | Nội dung thông cáo / bài viết | `TextInput` (multiline) | `Chia sẻ thông báo hoặc thảo luận với đồng nghiệp...` | Bắt buộc. Từ 2 đến 3000 ký tự. | `Nội dung bài viết không được để trống!` |
| `media_files` | Hình ảnh / Tài liệu đính kèm | `ImagePicker` / `DocumentPicker` | N/A | Tối đa 5 ảnh hoặc 2 tệp PDF đính kèm. Kích thước < 10MB/tệp. | `Tệp đính kèm vượt quá dung lượng cho phép!` |
| `scope` | Phạm vi thông báo | `SelectPicker` | `Toàn công ty / Phòng ban cụ thể` | Bắt buộc. Lựa chọn phạm vi hiển thị cho nhân viên. | N/A |

#### 2. Vị Trí Hiển Thị & Phân Định Hai Góc Nhìn
* **Góc nhìn Chủ quản Nền tảng (Platform Host - ViConnect):** Hiển thị huy hiệu Lãnh Đạo VIP Host Master, bảng tin điều hành vĩ mô, danh mục các liên minh và trung tâm quản trị phê duyệt đăng ký gói.
* **Góc nhìn Doanh nghiệp Mua gói (Tenant Client - VIASIA TECH JSC):** Không gian cộng đồng hiển thị logo công ty VIASIA, bảng tin thông cáo nội bộ, danh sách nhân viên công ty, tab việc làm nội bộ và tính năng chấm công GPS văn phòng.

---

### UC-APP-24: Đăng Ký & Kích Hoạt Gói Doanh Nghiệp In-App Qua VietQR Napas 24/7
* **Tác nhân:** Chủ doanh nghiệp, Giám đốc, Người đại diện pháp luật.
* **Màn hình thực hiện trên App Native:** `PackageRegistrationModal.tsx`.
* **Tiền điều kiện:** Người dùng có tài khoản trên App ViOne Native và có nhu cầu mua gói cước quản trị doanh nghiệp.
* **Mục tiêu:** Cho phép người dùng trực tiếp lựa chọn gói dịch vụ (30 slots, 50 slots, 100 slots), nhập thông tin pháp lý doanh nghiệp và thanh toán tức thời qua mã VietQR Napas 24/7 mà không cần qua website CRM.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Đăng Ký Gói Cước In-App
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `package_code` | Gói cước đăng ký | `PackageSelectCard` | `30 slots / 50 slots / 100 slots` | Bắt buộc. Nạp từ danh mục gói `VIONE_STARTUP_30`, `VIONE_STANDARD_50`, `VIONE_ENTERPRISE_100`. | `Vui lòng chọn gói cước phù hợp!` |
| `company_name` | Tên doanh nghiệp đầy đủ | `TextInput` | `VD: CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG TOÀN CẦU VIASIA` | Bắt buộc. Từ 5 đến 150 ký tự. | `Tên công ty không được để trống (5-150 ký tự)!` |
| `tax_code` | Mã số thuế doanh nghiệp | `TextInput` (number-pad) | `0110826492` | Bắt buộc. Chuỗi 10 hoặc 13 chữ số MST Việt Nam: `^[0-9]{10}(-[0-9]{3})?$`. | `Mã số thuế không đúng định dạng!` |
| `billing_cycle` | Chu kỳ thanh toán | `SelectPills` | `Hàng tháng / Hàng năm (Giảm 20%)` | Bắt buộc. Mặc định `yearly`. | N/A |

#### 2. Luồng Sinh Mã VietQR Napas 24/7 & Kích Hoạt Tức Thời
1. Người dùng chọn gói `VIONE_ENTERPRISE_100` (100 tài khoản) và điền thông tin doanh nghiệp.
2. Bấm nút Gradient Vàng Hoàng Gia **"TIẾP TỤC THANH TOÁN"**.
3. Hệ thống sinh mã VietQR động tiêu chuẩn EMVCo hiển thị ngay trên popup với đúng số tiền và nội dung chuyển khoản mã hóa `VIONE-[OrderCode]`.
4. Sau khi người dùng chuyển khoản thành công, hệ thống Webhook Napas tự động xác nhận đơn hàng, gửi email kích hoạt và mở khóa toàn bộ quyền năng quản trị doanh nghiệp trên Web CRM và Mobile App.

---

### UC-APP-25: Khám Phá & Số Hóa Di Sản Văn Hóa Quốc Gia, VR360 & Geo Audio Guide (ViOne Heritage)
* **Tác nhân:** Công dân, Khách du lịch trong nước & quốc tế, Ban Quản Lý Di Tích, ViConnect Super Admin.
* **Màn hình thực hiện trên App Native & PWA:** `HeritageListScreen.tsx`, `HeritageDetailScreen.tsx`, `platform.heritage.tsx`.
* **Cơ quan chủ quản & Bản quyền:** **ViConnect Central Platform** trực tiếp quản lý & vận hành; hoàn toàn KHÔNG thuộc về bất kỳ doanh nghiệp riêng lẻ nào. Doanh nghiệp chỉ tham gia với tư cách nhà tài trợ hoặc bảo trợ bảo tồn (CSR).
* **Tiền điều kiện:** Người dùng đã cài App ViOne hoặc truy cập Cổng ViOne Web Portal.
* **Mục tiêu:** Cung cấp giải pháp số hóa toàn diện di sản văn hóa vật thể, phi vật thể, danh thắng quốc gia và UNESCO; tích hợp tour 3D VR360 độ phân giải cao và hướng dẫn viên âm thanh (Audio Guide) tự động theo tọa độ GPS.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Hồ Sơ Di Sản Số
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Tên di sản văn hóa | `TextInput` | `VD: Quần thể Di tích Cố đô Huế` | Bắt buộc. Từ 5 đến 200 ký tự. | `Tên di sản không được để trống!` |
| `category` | Phân loại di sản | `SelectPicker` | `Di tích lịch sử / Kiến trúc nghệ thuật / Danh lam thắng cảnh / Di sản phi vật thể` | Bắt buộc. Chuẩn hóa theo Luật Di sản văn hóa Việt Nam. | `Vui lòng chọn phân loại di sản!` |
| `unesco_status` | Danh hiệu UNESCO | `SelectPills` | `Di sản Thế giới / Quốc gia đặc biệt / Cấp Quốc gia / Cấp Tỉnh` | Bắt buộc. Mặc định `Cấp Quốc gia`. | N/A |
| `geo_coordinates` | Tọa độ GPS & Ranh giới | `MapPinInput` | `16.4698, 107.5796` | Bắt buộc. Vĩ độ [-90, 90], Kinh độ [-180, 180]. | `Tọa độ GPS không hợp lệ!` |
| `audio_guide_url` | Tệp âm thanh thuyết minh | `AudioUpload` / URL | `https://cdn.viconnect.vn/audio/hue-imperial.mp3` | Bắt buộc định dạng MP3, AAC chất lượng cao 320kbps. Hỗ trợ đa ngôn ngữ (VN, EN, FR, JA, KO, ZH). | `Tệp âm thanh không hợp lệ!` |
| `vr360_scene_url` | Liên kết Tour Ảo 3D/VR | `UrlInput` | `https://vr.viconnect.vn/scene/hue-citadel` | URL hợp lệ, định dạng WebGL/WebXR hoặc ảnh Panorama 8K. | `Đường dẫn VR360 không hợp lệ!` |
| `is_platform_managed` | Cờ quản trị nền tảng | `Boolean` (True) | N/A | Luôn cố định là `true`. Hệ thống tự động khóa không cho doanh nghiệp sửa đổi. | N/A |

#### 2. Vị Trí Hiển Thị & Luồng Trải Nghiệm Công Dân
* **Vị trí hiển thị trên App:** Xuất hiện tại mục **"VĂN HÓA & DI SẢN"** trên Cổng Nền Tảng ViConnect.
* **Luồng Geo-Audio Guide:** Khi du khách bật định vị GPS và bước vào bán kính 100m của di sản, App ViOne gửi Push Notification: *"Chào mừng bạn đến với Cố Đô Huế. Chạm để nghe thuyết minh tự động"*. Bấm nút Gradient Vàng Hoàng Gia **"NGHE THUYẾT MINH"** để phát giọng đọc truyền cảm.
* **Hộ chiếu Di sản Số (Digital Heritage Passport):** Du khách bấm "Lưu Dấu Ấn Di Sản", hệ thống đóng 1 con dấu số có mã định danh gắn với tài khoản ViOne ID cá nhân.

---

### UC-APP-26: Trải Nghiệm Bảo Tàng Số, Hiện Vật 3D AR & Thuyết Minh 1-Chạm NFC (ViOne Museum)
* **Tác nhân:** Khách tham quan, Chuyên gia giám định, Ban Giám Đốc Bảo Tàng, ViConnect Curator.
* **Màn hình thực hiện trên App Native & PWA:** `MuseumExplorerScreen.tsx`, `ArtifactDetailScreen.tsx`, `platform.museum.tsx`.
* **Cơ quan chủ quản:** ViConnect Central Platform bảo trợ công nghệ & số hóa; thuộc quyền quản trị của ViConnect.
* **Mục tiêu:** Trưng bày không gian bảo tàng số chuyên đề, tương tác hiện vật cổ vật 3D Photogrammetry/AR xoay 360 độ, chạm NFC nghe thuyết minh hiện vật tại kệ trưng bày thực tế, liên thông đặt vé tham quan qua ViOne Ticket.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Hiện Vật Bảo Tàng Số
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `artifact_code` | Mã định danh cổ vật | `TextInput` | `VD: BVQG-NGOC-LU-01` | Bắt buộc. Chuỗi mã hóa độc nhất của bảo tàng. | `Mã cổ vật không được để trống!` |
| `name` | Tên hiện vật / Bảo vật | `TextInput` | `VD: Trống đồng Ngọc Lũ (Bảo vật Quốc gia)` | Bắt buộc. Từ 3 đến 150 ký tự. | `Tên hiện vật không được để trống!` |
| `historical_period` | Niên đại / Thời kỳ | `TextInput` | `VD: Văn hóa Đông Sơn (Thế kỷ II-III TCN)` | Bắt buộc. Xác định rõ thời kỳ lịch sử. | `Niên đại không được để trống!` |
| `model_3d_glb` | Tệp mô hình 3D Scan | `FileUpload` (.glb / .gltf) | `artifact_ngoclu_3d.glb` | Định dạng 3D chuẩn web, tối ưu dung lượng < 25MB, chứa đầy đủ Texture hoa văn chi tiết. | `Tệp 3D không đúng định dạng GLB!` |
| `nfc_uid` | Mã chip NFC gắn kệ hiện vật | `TextInput` | `04:A2:3B:5C:8D:1E:80` | Chuỗi Hex định danh chip NFC NTAG213/215 gắn tại tủ kính bảo tàng. | `Mã NFC không hợp lệ!` |
| `ticket_price` | Giá vé tham quan (nếu có) | `NumberInput` | `50,000 VNĐ` | Số nguyên không âm. Tích hợp thanh toán qua VietQR Napas 24/7. | `Giá vé không hợp lệ!` |

#### 2. Luồng Tương Tác 1-Chạm NFC & Thực Tế Tăng Cường (AR)
1. Du khách tham quan bảo tàng vật lý, cầm điện thoại cài App ViOne chạm nhẹ vào thẻ NFC gắn trên bệ trưng bày.
2. App ViOne lập tức mở trang chi tiết hiện vật với mô hình 3D tự xoay, phát đoạn thuyết minh âm thanh 2 phút và video phục dựng bối cảnh lịch sử.
3. Bấm nút **"Xem trong không gian thực (AR)"**: Camera mở ra, chiếu tia laser quét mặt sàn và đặt trống đồng ảo 1:1 ngay trước mắt du khách để chụp ảnh kỷ niệm.
4. Tích hợp phân hệ **ViOne Archive**: Du khách có thể bấm "Tra cứu tài liệu gốc" để xem các văn bản khảo cổ học, hình ảnh khai quật lưu trữ trên kho số.

---

### UC-APP-27: Quản Trị Giải Đấu Thể Thao Đa Môn, Sơ Đồ Bracket & Hộ Chiếu VĐV (ViOne Sport)
* **Tác nhân:** Vận động viên, Ban Trọng tài, Đội trưởng, Ban Tổ Chức ViConnect, Khán giả.
* **Màn hình thực hiện trên App Native & PWA:** `SportHubScreen.tsx`, `TournamentDetailScreen.tsx`, `TournamentBracketView.tsx`.
* **Cơ quan chủ quản:** ViConnect Central Sports Federation; ViConnect chủ quản nền tảng, các công ty doanh nghiệp chỉ cử đội thi đấu hoặc tài trợ.
* **Mục tiêu:** Cung cấp nền tảng quản trị giải đấu thể thao đa môn (Bóng đá, Pickleball, Tennis, Golf, Cầu lông), tự động tạo sơ đồ nhánh thi đấu (Bracket), cập nhật tỷ số trực tiếp (Live Score) và cấp Hộ chiếu Vận động viên số.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Giải Đấu Thể Thao
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tournament_name` | Tên giải đấu | `TextInput` | `VD: Giải Pickleball Doanh Nhân ViConnect Toàn Quốc 2026` | Bắt buộc. Từ 5 đến 200 ký tự. | `Tên giải đấu không được để trống!` |
| `sport_type` | Bộ môn thi đấu | `SelectPicker` | `Pickleball / Bóng đá / Tennis / Golf / Cầu lông` | Bắt buộc. | `Vui lòng chọn bộ môn thi đấu!` |
| `format` | Thể thức thi đấu | `SelectPills` | `Loại trực tiếp (Knockout) / Vòng tròn (Round-Robin) / Vòng bảng + Bán kết/Chung kết` | Bắt buộc. Hệ thống căn cứ để tự sinh sơ đồ Bracket. | `Vui lòng chọn thể thức thi đấu!` |
| `max_teams` | Số lượng đội/VĐV tối đa | `NumberInput` | `32` | Lũy thừa của 2 cho thể thức Knockout (8, 16, 32, 64). | `Số đội phải là bội số hợp lệ!` |
| `referee_ids` | Danh sách tổ trọng tài | `MultiSelect` | `Chọn trọng tài có chứng chỉ từ CSDL` | Tối thiểu 1 trọng tài chính cho mỗi trận đấu. | `Chưa chỉ định tổ trọng tài!` |

#### 2. Luồng Sinh Sơ Đồ Bảng Đấu & Cập Nhật Tỷ Số Trực Tiếp
1. Ban tổ chức ViConnect bấm nút **"BỐC THĂM & SINH BẢNG ĐẤU"** (Gradient Vàng Hoàng Gia), hệ thống tự động sinh cây Bracket tương tác trực quan 2 nhánh Trái - Phải dẫn về trận Chung Kết.
2. Trọng tài trận đấu sử dụng App ViOne, mở biên bản điện tử, bấm nút cộng điểm theo từng set. Tỷ số được phát trực tiếp qua WebSocket đến toàn bộ khán giả đang theo dõi trên App với độ trễ < 500ms.
3. Khi trận đấu kết thúc, trọng tài và 2 đội trưởng ký số xác nhận trên màn hình cảm ứng, hệ thống tự động đẩy đội thắng vào nhánh tiếp theo của Bracket.
4. **Hộ Chiếu Vận Động Viên Số (Digital Athlete Passport):** Toàn bộ số trận thắng, điểm số, cúp vô địch và huy chương được lưu vĩnh viễn vào hồ sơ thi đấu của VĐV trên ViOne.

---

### UC-APP-28: Giải Chạy Marathon/Trail, Cấp BIB Tự Động, Timing RFID & Live Leaderboard (ViOne Run)
* **Tác nhân:** Vận động viên chạy bộ (Runners), Giám đốc đường chạy (Race Director - RD), Đội ngũ kỹ thuật Timing RFID, Ban Tổ Chức ViConnect.
* **Màn hình thực hiện trên App Native & PWA:** `RunHubScreen.tsx`, `RaceDetailScreen.tsx`, `MyBibPassScreen.tsx`, `platform.run.tsx`.
* **Cơ quan chủ quản:** ViConnect Central Platform phối hợp Liên đoàn Điền kinh; hoàn toàn do ViConnect chủ trì.
* **Mục tiêu:** Quản trị các giải chạy quy mô từ 1.000 đến 30.000 vận động viên; tự động hóa đăng ký, phân bổ số BIB thông minh, đồng bộ thảm chíp Timing RFID dọc đường chạy, bảng xếp hạng trực tiếp và xuất Chứng nhận Finish điện tử (e-Certificate) chuẩn quốc tế.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Giải Chạy & Cấp BIB
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `race_name` | Tên giải chạy | `TextInput` | `VD: ViOne Heritage Marathon Cố Đô 2026` | Bắt buộc. Từ 5 đến 200 ký tự. | `Tên giải chạy không được để trống!` |
| `distance` | Cự ly thi đấu | `SelectPills` | `5KM / 10KM / 21KM (Half Marathon) / 42KM (Full Marathon) / Ultra 70KM` | Bắt buộc. | `Vui lòng chọn cự ly!` |
| `bib_number` | Số BIB VĐV | `TextInput` (readonly khi sinh tự động) | `42195` | Tự động sinh theo cự ly (Đầu 4 cho 42K, Đầu 2 cho 21K, Đầu 1 cho 10K, Đầu 5 cho 5K). | `Số BIB đã tồn tại trong hệ thống!` |
| `cutoff_time` | Giới hạn thời gian (COT) | `TimeInput` | `06:30:00 (6 tiếng 30 phút cho 42KM)` | Bắt buộc. Định dạng HH:MM:SS. | `Thời gian COT không hợp lệ!` |
| `gpx_file` | Tệp cung đường & Cao độ GPX | `FileUpload` (.gpx) | `route_marathon_42k.gpx` | Tệp GPX chuẩn chứa tọa độ kinh/vĩ độ và độ cao từng mét (Elevation Gain). | `Tệp GPX không hợp lệ!` |
| `rfid_chip_code` | Mã chíp RFID dán sau BIB | `TextInput` | `E28011606000020478` | Chuỗi Hex UHF RFID EPC Gen2 96-bit dán mặt sau số BIB của VĐV. | `Mã chip RFID không hợp lệ!` |

#### 2. Luồng Tích Hợp Thảm Timing RFID & Xuất Finisher e-Certificate
1. VĐV đăng ký cự ly, thanh toán qua VietQR Napas 24/7, hệ thống cấp ngay Thẻ BIB điện tử có mã QR nhận RaceKit tại ngày Expo.
2. Vào ngày thi đấu, VĐV đeo BIB gắn chip RFID chạy qua thảm sensor:
   - **Thảm Xuất Phát (Start Line Mat):** Ghi nhận thời điểm Net Time (Chip Time) bắt đầu đếm.
   - **Thảm Split Checkpoints (5K, 10K, 21K, 32K):** Cập nhật Pace trung bình, split time từng chặng, kiểm tra gian lận đường chạy.
   - **Thảm Về Đích (Finish Line Mat):** Ghi nhận thành tích chung cuộc, thứ hạng Overall, thứ hạng Giới tính và thứ hạng Lứa tuổi.
3. Người thân theo dõi trên App ViOne xem chấm vị trí di chuyển mô phỏng của VĐV trên bản đồ GPX theo thời gian thực.
4. Vừa qua vạch đích trong 1 giây, App ViOne gửi thông báo đẩy kèm **Finisher e-Certificate** mạ vàng sắc nét, có mã QR tra cứu minh bạch và nút chia sẻ lên mạng xã hội hoặc Khoảnh khắc ViOne chỉ với 1 chạm.

---

### UC-APP-29: Giải Chạy Di Sản (Heritage Run) & Cổng Dịch Vụ Văn Hóa - Thể Thao ViConnect
* **Tác nhân:** Toàn bộ công dân, Doanh nhân, Khách du lịch quốc tế, Runner, ViConnect Master Hub.
* **Màn hình thực hiện trên App Native & PWA:** `EcosystemHubScreen.tsx`, `HeritageRunPortal.tsx`.
* **Cơ quan chủ quản:** **ViConnect Central Platform**.
* **Mục tiêu:** Tạo nên sự tương thích và giao thoa hoàn mỹ giữa **Văn Hóa & Di Sản** (Heritage + Museum) và **Cộng Đồng & Thể Thao** (Sport + Run).

#### 1. Ma Trận Tương Thích & Tính Năng Hiệp Đồng (Cross-Synergy Features)
1. **Mô hình "Giải Chạy Di Sản" (Heritage Run Experience):**
   - Cung đường chạy marathon được thiết kế chạy qua quần thể các di tích lịch sử và các bảo tàng lớn.
   - Tại mỗi trạm Checkpoint đặt tại di tích, VĐV chạy qua vừa kích hoạt thảm RFID ghi nhận thành tích, vừa được hệ thống ViOne tự động đóng **Con Dấu Di Sản Số** (Digital Heritage Stamp) vào Hộ chiếu số của VĐV.
2. **Hệ Thống Vé & Soát Vé Điện Tử Đồng Nhất (Unified ViOne Ticket & Gate):**
   - Khách mua vé tham quan bảo tàng, vé xem chung kết thể thao hoặc vé đăng ký BIB giải chạy đều sử dụng chung một chuẩn QR vé động chống chụp màn hình.
   - Cổng soát vé tại bảo tàng và cổng vào vạch xuất phát giải chạy dùng chung thiết bị quét QR / chạm thẻ NFC của ViOne.
3. **Thanh Toán Gạch Nợ Tự Động VietQR Napas 24/7:**
   - Dùng chung hạ tầng VietQR Napas đã chuẩn hóa: Mua vé bảo tàng, mua BIB, mua đồ lưu niệm di sản đều gạch nợ tự động trong 1 giây, xuất biên lai điện tử lưu trong mục Ví của tôi.
4. **Trợ Lý Giọng Nói AI ViOne Thuyết Minh & Tư Vấn Toàn Năng:**
   - Người dùng có thể hỏi Trợ lý AI ViOne: *"Hãy kể cho tôi nghe lịch sử Hoàng Thành Thăng Long"* hoặc *"Hãy xem lịch xuất phát cự ly 21K ngày mai và tốc độ Pace mục tiêu của tôi"*. AI tự động phân luồng dữ liệu chính xác từ cơ sở dữ liệu ViConnect.
