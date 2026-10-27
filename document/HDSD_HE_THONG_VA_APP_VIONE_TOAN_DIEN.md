# TÀI LIỆU HƯỚNG DẪN SỬ DỤNG HỆ THỐNG VÀ ỨNG DỤNG VIONE TOÀN DIỆN
## CẨM NANG VẬN HÀNH DÀNH CHO LÃNH ĐẠO C-LEVEL VÀ CÁN BỘ NHÂN VIÊN DOANH NGHIỆP
**Mã tài liệu:** `HDSD-VIONE-MASTER-8.0` | **Ngày ban hành:** 27/10/2026 | **Phiên bản:** `8.0 Enterprise Master Release`  
**Hệ thống:** Nền Tảng Web CRM ViOne Enterprise & Ứng Dụng Di Động ViOne Connect (iOS & Android)  
**Đơn vị thực hiện:** Ban Công Nghệ & Chuyển Đổi Số — Tập Đoàn Công Nghệ VioConnect  

---

## MỤC LỤC TỔNG QUAN

1. [CHƯƠNG 1: TỔNG QUAN HỆ SINH THÁI QUẢN TRỊ & MẠNG XÃ HỘI DOANH NGHIỆP VIONE](#chương-1-tổng-quan-hệ-sinh-thái-quản-trị--mạng-xã-hội-doanh-nghiệp-vione)
2. [CHƯƠNG 2: HƯỚNG DẪN CÀI ĐẶT & XÁC THỰC ĐA NỀN TẢNG](#chương-2-hướng-dẫn-cài-đặt--xác-thực-đa-nền-tảng)
   - 2.1 Cài đặt App Native ViOne trên iOS (App Store / .mobileconfig) và Android (Google Play / APK)
   - 2.2 Đăng nhập bằng Sinh trắc học FaceID/Vân tay, OTP SMS và Mật khẩu Quản trị
   - 2.3 Phân định quyền hạn người dùng (Lãnh đạo C-Level vs Nhân viên thực thi)
3. [CHƯƠNG 3: CẨM NANG VẬN HÀNH NỀN TẢNG WEB CRM VIONE (20 PHÂN HỆ CỐT LÕI)](#chương-3-cẩm-nang-vận-hành-nền-tảng-web-crm-vione-20-phân-hệ-cốt-lõi)
   - 3.1 Bàn Điều Hành Lãnh Đạo & Báo Cáo Realtime Multi-Tenant (`/dashboard`)
   - 3.2 Quản Lý Khách Hàng B2B & Phễu Cơ Hội Bán Hàng Kanban Deals (`/members`, `/pipeline`)
   - 3.3 Danh Thiếp Số Titanium & Quản Lý Hội Viên Doanh Nghiệp (`/cards`, `/companies`)
   - 3.4 Sàn Giao Thương Sản Phẩm & Sự Kiện Check-in QR Tự Động (`/marketplace`, `/events`)
   - 3.5 Quản Trị Quy Trình Công Việc BPMN 2.0 & Kanban Tasks (`/workflow`)
   - 3.6 Giám Sát Chấm Công GPS & Tờ Trình Chi 3 Cấp Kèm VietQR 24/7 (`/attendance`, `/payment-approvals`)
   - 3.7 Quản Trị Sổ Quỹ Thu Chi & Họp Trực Tuyến 1-Chạm (`/finance`, `/meetings`)
   - 3.8 Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp Chuẩn Google Drive (`/documents`)
   - 3.9 Bầu Cử Biểu Quyết Số & Phân Quyền Biệt Lập Doanh Nghiệp Multi-tenant RBAC (`/voting`, `CompanyPermissionsTab`)
   - 3.10 Cài Đặt Hệ Thống & Cấu Hình Doanh Nghiệp Thực Tế 100% CSDL PostgreSQL (`/settings`)
   - 3.11 Tinh Gọn Sidebar & Tooltip Đa Điểm Viền Vàng Chống Tràn Chữ
4. [CHƯƠNG 4: CẨM NANG KHAI THÁC ỨNG DỤNG DI ĐỘNG NATIVE VIONE CONNECT](#chương-4-cẩm-nang-khai-thác-ứng-dụng-di-động-native-vione-connect)
   - 4.1 Tab 1 - Trang Chủ Executive Home: Bàn Làm Việc 5 Tabs Lịch Trình Hôm Nay
   - 4.2 Thẻ Doanh Nhân Mạ Vàng & Bottom Sheet Vuốt Tay Danh Tính Số
   - 4.3 Tab 2 - Mạng Lưới Giao Thương B2B & Hộp Thư Messenger 0ms Gửi Thẻ Hẹn 1-1
   - 4.4 Nút V Trung Tâm 3D & Bảng Điều Khiển Nhanh VActionSheet 5 Tác Vụ
   - 4.5 Tab 3 - Cộng Đồng: Không Gian Doanh Nghiệp Biệt Lập & Bảng Tin Nội Bộ
   - 4.6 Tab 4 - Trang Cá Nhân "Tôi": Danh Tính Titanium NFC, Showcase & 8 Ngôn Ngữ
   - 4.7 Máy Quét Danh Thiếp AI OCR & Đồng Bộ Danh Bạ Điện Thoại vCard
   - 4.8 Đăng Ký & Nâng Cấp Gói Doanh Nghiệp In-App Qua VietQR Napas 24/7 (`PackageRegistrationModal`)
   - 4.9 Trung Tâm Bảo Mật, Sinh Trắc Học & Xóa Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v)
5. [CHƯƠNG 5: HƯỚNG DẪN KHAI THÁC TRỢ LÝ GIỌNG NÓI VIONE AI 6.0 (OPENROUTER AI GATEWAY)](#chương-5-hướng-dẫn-khai-thác-trợ-lý-giọng-nói-vione-ai-60-openrouter-ai-gateway)
   - 5.1 Kích hoạt và tương tác giọng nói tự nhiên tiếng Việt
   - 5.2 Ra lệnh giao việc tự động và tạo thẻ Kanban tức thì
   - 5.3 Truy vấn báo cáo tài chính và tổng hợp tiến độ công việc bằng khẩu lệnh
6. [CHƯƠNG 6: QUY TRÌNH XỬ LÝ SỰ CỐ & GIẢI ĐÁP CÁC TÌNH HUỐNG THƯỜNG GẶP (FAQ)](#chương-6-quy-trình-xử-lý-sự-cố--giải-đáp-các-tình-huống-thường-gặp-faq)
7. [CHƯƠNG 7: THÔNG TIN HỖ TRỢ KỸ THUẬT & LIÊN HỆ BÀN GIAO](#chương-7-thông-tin-hỗ-trợ-kỹ-thuật--liên-hệ-bàn-giao)

---

### CHƯƠNG 1: TỔNG QUAN HỆ SINH THÁI QUẢN TRỊ & MẠNG XÃ HỘI DOANH NGHIỆP VIONE

ViOne là hệ sinh thái chuyển đổi số hợp nhất toàn diện dành riêng cho cộng đồng doanh nghiệp và doanh nhân, kết hợp hài hòa giữa 2 trụ cột công nghệ cốt lõi:
1. **Nền Tảng Quản Trị Web CRM ViOne Enterprise:** Vận hành trên máy tính và trình duyệt web, cung cấp toàn bộ công cụ quản trị B2B từ quan hệ khách hàng, cơ hội bán hàng Kanban, chấm công GPS, phê duyệt tờ trình chi 3 cấp bằng VietQR, kho lưu trữ tài liệu chuẩn Google Drive, phân quyền độc lập Multi-tenant RBAC theo từng doanh nghiệp và cấu hình hệ thống lưu trữ bền vững 100% vào PostgreSQL.
2. **Ứng Dụng Di Động ViOne Connect (iOS & Android):** Ứng dụng di động cao cấp với thiết kế Executive Luxury (Đen Thạch Anh Obsidian `#050C15` & Vàng Hoàng Gia Champagne Gold `#D8B282`), tích hợp Danh thiếp số Titanium NFC 1-chạm, Bàn điều hành C-Level 5 tabs, Hộp thư Messenger 0ms gửi thẻ hẹn gặp 1-1, Không gian cộng đồng nội bộ doanh nghiệp riêng biệt, Đăng ký gói cước in-app tức thì và Trung tâm bảo mật tuân thủ 100% chuẩn Apple App Store Guideline 5.1.1(v).

---

### CHƯƠNG 2: HƯỚNG DẪN CÀI ĐẶT & XÁC THỰC ĐA NỀN TẢNG

#### 2.1 Cài Đặt Ứng Dụng Di Động ViOne Connect
* **Trên iPhone / iPad (iOS):**
  - **Cách 1 (Bản chính thức App Store):** Tìm kiếm từ khóa `ViOne Connect` trên Apple App Store -> Nhấn nút **Nhận (Get)** -> Xác nhận FaceID để tải và cài đặt.
  - **Cách 2 (Cài đặt cấu hình nhanh qua .mobileconfig):** Mở trình duyệt Safari -> Truy cập link cài đặt của hệ thống -> Bấm **Cho phép** tải hồ sơ cấu hình -> Mở **Cài đặt (Settings)** trên iPhone -> Chọn **Đã tải về hồ sơ** -> Nhấn **Cài đặt** -> Ứng dụng xuất hiện trên màn hình chính với đầy đủ biểu tượng mạ vàng sang trọng.
* **Trên điện thoại Android (Samsung, Xiaomi, Oppo...):**
  - Mở Google Play Store tìm kiếm `ViOne Connect` hoặc quét mã QR tải tệp APK Release chính thức -> Nhấn Cài đặt -> Mở ứng dụng và cấp quyền Thông báo, Định vị GPS và Camera.

#### 2.2 Đăng Nhập & Xác Thực Đa Phương Thức
* **Đăng nhập nhanh Apple Sign-In / Google OAuth:** Chạm vào nút `[Tiếp tục với Apple]` hoặc `[Tiếp tục với Google]` để đăng nhập 1-chạm không cần nhớ mật khẩu.
* **Đăng nhập bằng Số điện thoại & Mã OTP:** Nhập số điện thoại -> Hệ thống gửi mã OTP 6 số qua tin nhắn SMS -> Nhập mã để vào màn hình chính.
* **Đăng nhập Quản trị viên (Email & Password):** Dành cho Quản trị viên truy cập Web CRM (`https://dev-vione-crm.14-225-217-232.sslip.io:5446/auth?portal=crm`), nhập tài khoản quản trị tiêu chuẩn `admin@connect.vn` / `123456` để truy cập toàn bộ quyền hạn.

---

### CHƯƠNG 3: CẨM NANG VẬN HÀNH NỀN TẢNG WEB CRM VIONE (20 PHÂN HỆ CỐT LÕI)

#### 3.1 Bàn Điều Hành Lãnh Đạo & Báo Cáo Realtime Multi-Tenant (`/dashboard`)
- **Mục đích:** Cung cấp bức tranh toàn cảnh về hoạt động kinh doanh, dòng tiền, nhân sự và tiến độ công việc của công ty theo thời gian thực.
- **Thao tác vận hành:**
  1. Sau khi đăng nhập, hệ thống tự động đưa người dùng vào Bàn Điều Hành Lãnh Đạo.
  2. Quan sát các thẻ chỉ số KPI chính: Tổng số hội viên, Cơ hội bán hàng đang mở, Dòng tiền thu chi tháng này và Tỷ lệ hoàn thành công việc.
  3. Sử dụng bộ lọc doanh nghiệp trên thanh tiêu đề để chuyển đổi giữa các công ty thành viên nếu đang quản trị tập đoàn đa doanh nghiệp.

#### 3.2 Quản Lý Khách Hàng B2B & Phễu Cơ Hội Kanban Deals (`/members`, `/pipeline`)
- **Quản lý khách hàng (`/members`):**
  1. Nhấn menu **Khách hàng** trên Sidebar.
  2. Bấm nút `[+ Thêm khách hàng mới]` -> Điền Tên công ty, Người liên hệ, Số điện thoại, Email, Mã số thuế.
  3. Bấm `[Lưu khách hàng]` -> Bản ghi mới xuất hiện ngay tại dòng 1 của danh sách.
- **Phễu bán hàng Kanban Deals (`/pipeline`):**
  1. Nhấn menu **Phễu bán hàng**.
  2. Giao diện hiển thị các cột trạng thái: *Tiếp cận -> Báo giá -> Thương thảo -> Ký hợp đồng -> Thành công / Thất bại*.
  3. Thao tác kéo thả (Drag & Drop) thẻ Deal giữa các cột để cập nhật giai đoạn; Giá trị dự kiến và tổng doanh thu phễu tự động nhảy số theo thời gian thực.

#### 3.3 Quản Lý Kho Lưu Trữ Tài Liệu Phân Cấp Chuẩn Google Drive (`/documents`)
- **Mục đích:** Hệ thống quản lý tài liệu số doanh nghiệp trực quan, tổ chức thư mục đa tầng, lưu trữ an toàn trên MinIO S3 mã hóa AES-256.
- **Thao tác chi tiết:**
  1. Nhấn menu **Tài liệu** (`/documents`) trên Sidebar Web CRM.
  2. **Thanh định vị Breadcrumbs:** Quan sát đường dẫn thư mục hiện hành: `Gốc / Phòng Kinh Doanh / 2026 / Hợp Đồng`. Nhấn vào bất kỳ cấp thư mục nào để quay ngược lại nhanh chóng.
  3. **Tạo thư mục mới:** Nhấn nút `[+ Tạo thư mục]` -> Nhập tên thư mục -> Nhấn `[Tạo]` -> Thư mục mới xuất hiện ngay với icon folder mạ vàng.
  4. **Tải lên tài liệu:** Nhấn nút `[Tải tệp lên]` -> Chọn một hoặc nhiều tệp từ máy tính (PDF, Word, Excel, Hình ảnh) -> Hệ thống hiển thị thanh tiến độ tải lên thời gian thực.
  5. **Ghim tài liệu quan trọng:** Di chuột vào tệp tài liệu -> Nhấn biểu tượng Ghim (Pin) màu vàng để đưa tài liệu lên vị trí ưu tiên hàng đầu.
  6. **Liên kết thực thể (Entity Binding):** Chọn tài liệu -> Chọn mục `[Liên kết]` -> Chọn gắn vào Khách hàng hoặc Hợp đồng cụ thể để tiện tra cứu chéo.

#### 3.4 Phân Hệ Phân Quyền Biệt Lập Doanh Nghiệp Multi-tenant RBAC (`CompanyPermissionsTab`)
- **Mục đích:** Cho phép Quản trị viên của từng công ty tự do thiết lập quyền hạn cho các vai trò và nhân viên nội bộ mà không ảnh hưởng tới các công ty khác trong hệ sinh thái.
- **Thao tác chi tiết:**
  1. Nhấn menu **Doanh nghiệp** -> Chọn công ty cần cấu hình -> Nhấn tab **Phân quyền**.
  2. Danh sách vai trò nội bộ hiển thị: *Giám đốc điều hành, Trưởng phòng kinh doanh, Kế toán trưởng, Chuyên viên*.
  3. Tích chọn các cờ quyền hạn chi tiết cho từng phân hệ: *Xem (Read), Thêm mới (Create), Chỉnh sửa (Update), Xóa (Delete), Phê duyệt (Approve), Xuất file Excel/Word (Export)*.
  4. Nhấn `[Lưu cấu hình phân quyền]` -> Hệ thống lưu vĩnh viễn vào CSDL PostgreSQL và áp dụng tức thời cho nhân sự thuộc vai trò đó.

#### 3.5 Cài Đặt Hệ Thống & Cấu Hình Doanh Nghiệp Thực Tế 100% CSDL PostgreSQL (`/settings`)
- **Mục đích:** Cấu hình thông tin pháp lý doanh nghiệp, tài khoản ngân hàng thụ hưởng VietQR và bán kính chấm công GPS.
- **Thao tác chi tiết:**
  1. Nhấn menu **Cài đặt** (`/settings`) ở dưới cùng Sidebar Web CRM.
  2. **Tab Thông tin doanh nghiệp:** Cập nhật Tên công ty, Mã số thuế, Địa chỉ trụ sở, Đại diện pháp luật, Tải lên Logo mạ vàng thương hiệu.
  3. **Tab Cấu hình VietQR:** Chọn Ngân hàng thụ hưởng (MBBank, Vietcombank, Techcombank...), nhập Số tài khoản nhận tiền và Tên chủ tài khoản -> Nhấn `[Kiểm tra & Lưu]` -> Hệ thống kích hoạt cổng nhận tiền tự động.
  4. **Tab Chấm công GPS:** Nhập Tọa độ Vĩ độ (Lat) và Kinh độ (Lng) của văn phòng công ty; Thiết lập bán kính chấm công cho phép (mặc định 50 mét) -> Bấm `[Lưu cấu hình]`.

#### 3.6 Tinh Gọn Sidebar & Tooltip Đa Điểm Viền Vàng Chống Tràn Chữ
- **Thao tác thu gọn Sidebar:**
  1. Nhấn nút mũi tên thu gọn ở góc dưới Sidebar.
  2. Sidebar thu nhỏ thành thanh icon gọn gàng, giúp mở rộng 100% không gian cho bảng biểu dữ liệu.
  3. **Tooltip viền vàng:** Rê chuột vào từng biểu tượng menu -> Một khung Tooltip màu Đen Thạch Anh Obsidian với viền Vàng Hoàng Gia Champagne Gold lập tức nổi lên hiển thị tên đầy đủ của phân hệ (ví dụ: *"Quản Lý Kho Tài Liệu"*, *"Phân Quyền Doanh Nghiệp"*), tuyệt đối không bị tràn chữ hay che khuất nội dung.

---

### CHƯƠNG 4: CẨM NANG KHAI THÁC ỨNG DỤNG DI ĐỘNG NATIVE VIONE CONNECT

#### 4.1 Tab 1 - Trang Chủ Executive Home & Bàn Làm Việc Hôm Nay 5 Tabs
- **Sticky Brand Header:** Logo vector mạ vàng 53x20, lời chào cá nhân hóa theo buổi (Chào buổi sáng, Buổi chiều...), nút chuyển đổi Theme Sáng/Tối và chuông thông báo có badge đỏ đếm tin chưa đọc.
- **Thẻ Doanh Nhân & GPS:** Hiển thị thẻ danh tính sang trọng kèm vị trí địa lý; Chạm vào thẻ để mở Bottom Sheet vuốt tay chứa mã QR cá nhân và nút chạm thẻ NFC.
- **Lịch trình Hôm Nay 5 Tabs:**
  - Tab 1 `[Tất cả]`: Tổng hợp toàn bộ sự kiện và đầu việc trong ngày.
  - Tab 2 `[Lịch hẹn 1-1]`: Các cuộc hẹn giao thương đã được xác nhận.
  - Tab 3 `[Hồ sơ duyệt]`: Các tờ trình chi và đề xuất đang chờ CEO phê duyệt.
  - Tab 4 `[Việc cần làm]`: Danh sách nhiệm vụ được giao kèm hạn chót.
  - Tab 5 `[Sự kiện]`: Các hội thảo, đại hội doanh nhân sắp diễn ra.

#### 4.2 Nút V Trung Tâm 3D & Bảng Điều Khiển VActionSheet 5 Hành Động Nhanh
- Nhấn vào **Nút V mạ vàng nổi 3D** ở chính giữa thanh điều hướng để mở bảng điều khiển nhanh:
  1. `[Giao việc mới]`: Nhập tiêu đề, chọn nhân sự, hạn chót và đẩy việc ngay trong 5 giây.
  2. `[Ký duyệt chi]`: Xem nhanh tờ trình chi và quét mã VietQR duyệt tiền.
  3. `[Quét danh thiếp AI]`: Bật camera bóc tách visit card bằng AI OCR tiếng Việt.
  4. `[Chấm công GPS]`: Xác thực vị trí <= 50m và quét khuôn mặt FaceID vào ca.
  5. `[Họp trực tuyến 1-chạm]`: Mở ngay phòng họp video an toàn gửi link cho đối tác.

#### 4.3 Tab 3 - Cộng Đồng: Không Gian Doanh Nghiệp Biệt Lập & Bảng Tin Nội Bộ
- Chuyển sang Tab **Cộng đồng** -> Chọn tab con **[Không Gian Doanh Nghiệp]**.
- Cán bộ nhân viên công ty có thể:
  - Đọc các thông báo, quyết định chính sách mới nhất từ Ban Giám Đốc.
  - Xem danh bạ phòng ban, sơ đồ tổ chức nội bộ và liên hệ nhanh với đồng nghiệp.
  - Gửi phản hồi, chúc mừng sinh nhật, vinh danh cá nhân xuất sắc.
  - Hoàn toàn biệt lập và bảo mật, người ngoài công ty không thể truy cập.

#### 4.4 Đăng Ký & Nâng Cấp Gói Doanh Nghiệp In-App Qua VietQR Napas 24/7
- **Mục tiêu:** Nâng cấp gói cước phần mềm ngay trên điện thoại không cần thao tác thủ công.
- **Thao tác chi tiết:**
  1. Mở menu Tài khoản -> Chọn `[Nâng cấp gói doanh nghiệp]`.
  2. Màn hình `PackageRegistrationModal` hiển thị các gói: *Khởi sự (Starter), Tăng trưởng (Growth), Doanh nghiệp Vàng (Enterprise)*.
  3. Chọn chu kỳ thanh toán: 1 tháng hoặc 1 năm (tặng thêm 2 tháng sử dụng).
  4. Bấm `[Thanh toán ngay]` -> Mã VietQR Napas 24/7 tự động sinh ra kèm số tiền chuẩn xác và mã đơn hàng.
  5. Nhấn `[Mở ứng dụng Ngân hàng]` hoặc chụp màn hình để thanh toán bằng Mobile Banking.
  6. Sau khi chuyển khoản thành công, hệ thống tự động gạch nợ trong 1 giây, phát hiệu ứng chúc mừng mạ vàng và nâng hạn mức tức thì.

#### 4.5 Trung Tâm Bảo Mật & Xóa Tài Khoản Vĩnh Viễn Chuẩn Apple App Store Guideline 5.1.1(v)
- **Kích hoạt FaceID / TouchID:** Mở màn hình Bảo mật -> Bật công tắc `[Xác thực sinh trắc học]` để mở khóa ứng dụng bằng khuôn mặt hoặc vân tay.
- **Quy trình Xóa tài khoản vĩnh viễn (Apple Guideline 5.1.1(v)):**
  1. Trong màn hình Cài đặt Bảo mật, cuộn xuống mục dưới cùng và nhấn nút màu đỏ `[Xóa tài khoản vĩnh viễn]`.
  2. Hệ thống hiển thị bảng cảnh báo chi tiết về việc xóa toàn bộ dữ liệu, danh thiếp số và lịch sử hoạt động.
  3. Nhập mật khẩu hiện tại để xác nhận bảo mật 2 bước.
  4. Nhấn nút xác nhận `[Tôi hiểu rủi ro và muốn xóa tài khoản]` -> Hệ thống hủy toàn bộ phiên làm việc, xóa sạch dữ liệu cá nhân trong PostgreSQL và đưa người dùng về màn hình Đăng nhập ban đầu.

---

### CHƯƠNG 5: HƯỚNG DẪN KHAI THÁC TRỢ LÝ GIỌNG NÓI VIONE AI 6.0 (OPENROUTER AI GATEWAY)

ViOne AI 6.0 được vận hành bởi OpenRouter AI Gateway thế hệ mới, tích hợp mô hình ngôn ngữ lớn DeepSeek-V3 và Meta Llama 3.3, tối ưu hóa đặc biệt cho ngữ cảnh điều hành doanh nghiệp tiếng Việt:
1. **Kích hoạt:** Nhấn giữ biểu tượng Micro mạ vàng trên Header hoặc mở modal `ViOne AI Assistant`.
2. **Khẩu lệnh giao việc:** Nói câu lệnh tự nhiên: *"Giao việc cho anh Hùng phòng Kỹ thuật kiểm tra tiến độ dự án KĐT mới trước 5h chiều nay"* -> AI tự động bóc tách: Người nhận (Anh Hùng), Tiêu đề (Kiểm tra tiến độ dự án), Hạn chót (17:00 hôm nay) và tạo ngay thẻ việc trên Kanban.
3. **Khẩu lệnh truy vấn báo cáo:** Nói: *"Báo cáo doanh thu và chi phí tuần này của công ty"* -> AI phân tích số liệu CSDL và trả về biểu đồ tóm tắt kèm giọng đọc tự nhiên.

---

### CHƯƠNG 6: QUY TRÌNH XỬ LÝ SỰ CỐ & GIẢI ĐÁP CÁC TÌNH HUỐNG THƯỜNG GẶP (FAQ)

* **Câu hỏi 1: Tôi bị báo lỗi 'Nằm ngoài bán kính chấm công GPS'?**
  - *Giải thích:* Doanh nghiệp cấu hình bán kính cho phép là 50m quanh trụ sở. Hãy kiểm tra lại kết nối Wifi văn phòng, bật chế độ định vị GPS chính xác cao trên điện thoại và đứng trong phạm vi văn phòng công ty.
* **Câu hỏi 2: Quét mã VietQR thanh toán xong nhưng màn hình chưa cập nhật ngay?**
  - *Giải thích:* Webhook ngân hàng thường xử lý trong 1-3 giây. Nếu mạng chập chờn, nhấn nút `[Kiểm tra trạng thái]` trên màn hình để hệ thống đối soát trực tiếp.
* **Câu hỏi 3: Làm sao để tải lên tài liệu dung lượng lớn trong Kho Google Drive?**
  - *Giải thích:* Kho tài liệu hỗ trợ tải lên đa tệp với dung lượng tối đa 50MB mỗi tệp. Với tài liệu lớn hơn, hãy nén dạng .zip trước khi tải lên.

---

### CHƯƠNG 7: THÔNG TIN HỖ TRỢ KỸ THUẬT & LIÊN HỆ BÀN GIAO

* **Đơn vị phát triển:** Ban Công Nghệ & Chuyển Đổi Số — Tập Đoàn Công Nghệ VioConnect
* **Cổng hỗ trợ kỹ thuật 24/7:** `support@viconnect.vn`
* **Hotline hỗ trợ khẩn cấp:** 1900 6868 (Phím 1 cho CRM, Phím 2 cho Mobile App)
* **Địa chỉ cổng thông tin:** `https://vione.viconnect.vn`

---
*Bản quyền tài liệu thuộc về Tập Đoàn Công Nghệ VioConnect. Nghiêm cấm sao chép khi chưa có sự đồng ý bằng văn bản.*
