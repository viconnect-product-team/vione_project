# TÀI LIỆU YÊU CẦU NGHIỆP VỤ DOANH NGHIỆP TOÀN DIỆN (BRD MASTER 7.0)
## HỆ ĐIỀU HÀNH DOANH NGHIỆP TOÀN DIỆN VIONE & MẠNG XÃ HỘI GIAO THƯƠNG DOANH NHÂN VIONE CONNECT
### PHIÊN BẢN HỢP NHẤT TOÀN DIỆN 7.0 (ĐỒNG BỘ 100% TÍNH NĂNG VIONE PWA VÀ VIONE NATIVE APP, CHUẨN HÓA CÂN ĐỐI UI/UX TEXT & ICON, PHÂN QUYỀN PHÒNG BAN DEPARTMENT RBAC, BÀN GIAO TỰ ĐỘNG, HỌP BAN 1-CHẠM & IMPORT/EXPORT EXCEL/WORD)

---

### THÔNG TIN KIỂM SOÁT TÀI LIỆU (DOCUMENT CONTROL)
* **Tên dự án:** Hệ Sinh Thái Quản Trị Doanh Nghiệp Toàn Diện ViOne & Mạng Xã Hội Giao Thương Doanh Nhân ViOne Connect
* **Đơn vị phát triển:** Ban Công Nghệ & Chuyển Đổi Số — Tập Đoàn Công Nghệ VioConnect
* **Mã tài liệu:** `BRD-VIONE-ENTERPRISE-CONNECT-MASTER-V7.0`
* **Phiên bản:** `7.0 Master Enterprise Release` (Thẩm định khớp 100% mã nguồn Backend NestJS, Frontend Web CRM, Database PostgreSQL, PWA Web Mobile `/connect-app` và Native App `apps/mobile_vione`)
* **Ngày phát hành:** 12/10/2026
* **Cấp độ bảo mật:** TÀI LIỆU BẢO MẬT NỘI BỘ — LƯU HÀNH GIỚI HẠN
* **Trạng thái thẩm định:** Đã kiểm thử thực tế trên Web CRM (Port 5446/5445), PWA Web Mobile (`/connect-app`), và Mobile Native App (`apps/mobile_vione` - Expo SDK 52 / React Native)

---

## MỤC LỤC TỔNG QUAN

1. **BÁO CÁO THẨM ĐỊNH HIỆN TRẠNG & TUYÊN NGÔN 6 NGUYÊN TẮC BẤT BIẾN**
2. **BỐI CẢNH CHIẾN LƯỢC, TẦM NHÌN & MỤC TIÊU KINH DOANH SMART**
3. **PHÂN TÍCH 2 ROLE NGƯỜI DÙNG CỐT LÕI (C-LEVEL EXECUTIVE VS NHÂN VIÊN/ĐỐI TÁC)**
4. **MÔ TẢ CHI TIẾT 25 MODULES HỆ THỐNG WEB CRM VIONE (DOANH NGHIỆP)**
5. **MÔ TẢ CHI TIẾT ĐỒNG BỘ 100% ỨNG DỤNG DI ĐỘNG APP VIONE (NATIVE & PWA)**
   - *5.1. Tab 1: Trang Chủ Executive Home & Bàn Làm Việc Lãnh Đạo*
   - *5.2. Tab 2: Mạng Lưới Giao Thương B2B & Hộp Thư Messenger*
   - *5.3. Nút V Trung Tâm 3D & Bảng Hành Động VActionSheet*
   - *5.4. Tab 3: Mô Hình Cộng Đồng Hợp Nhất & Gói Dùng Thử 30 Ngày*
   - *5.5. Tab 4: Trang Cá Nhân "Tôi" - Danh Tính Số Thượng Lưu*
   - *5.6. Siêu Trợ Lý Điều Khiển Bằng Giọng Nói AI Copilot 6.0*
6. **QUY CHUẨN CÂN ĐỐI GIAO DIỆN (UI/UX, TEXT, ICON & SAFE AREA) TRÊN VIONE NATIVE APP**
7. **HỆ THỐNG 99 QUY TẮC NGHIỆP VỤ CỐT LÕI (BUSINESS RULES - 6 NHÓM)**
8. **MA TRẬN PHÂN QUYỀN RBAC ĐA TẦNG (ROLE x DEPARTMENT) & CƠ CHẾ AUTO-HANDOVER**
9. **YÊU CẦU PHI CHỨC NĂNG (ENTERPRISE NFR) & KIẾN TRÚC DỮ LIỆU THỰC TẾ**
10. **KẾ HOẠCH TRIỂN KHAI, ĐỐI SOÁT & TIÊU CHUẨN NGHIỆM THU**

---

## 1. BÁO CÁO THẨM ĐỊNH HIỆN TRẠNG & TUYÊN NGÔN 6 NGUYÊN TẮC BẤT BIẾN

### 1.1. Báo cáo thẩm định hiện trạng mã nguồn
Toàn bộ tài liệu BRD Master 7.0 được thẩm định chéo trực tiếp trên mã nguồn thực tế của hệ sinh thái ViOne:
- **Backend NestJS (`apps/vione_app_be`):** 19 modules nghiệp vụ, tầng Repository Pattern chuẩn Enterprise bóc tách 100% raw SQL khỏi Domain Services, hệ thống DTOs độc lập (Single Responsibility Principle) tích hợp `class-validator`, `VietnameseValidationPipe`, bộ lọc bắt lỗi `AllExceptionsFilter` trả về JSON envelope đồng bộ, kết nối CSDL PostgreSQL độc lập qua Prisma ORM, phân quyền phòng ban Department RBAC Guard, dịch vụ lưu trữ MinIO S3 Object Storage, và Socket.IO WebSockets Gateway.
- **Frontend Web CRM & PWA (`apps/vione_app_fe`):** TanStack React Start, Vite, React 19, TailwindCSS 4, hỗ trợ chế độ kép Web CRM Doanh nghiệp và PWA Mobile App (`/connect-app`). Màn đăng nhập CRM tĩnh C-Level sang trọng loại bỏ 100% animation, Bảng điều hành C-Level Dashboard tích hợp bộ lọc trạng thái đa chiều, và Sàn giao dịch Marketplace chuẩn hóa responsive chống tràn viền.
- **Mobile Native App (`apps/mobile_vione`):** Ứng dụng thuần Native React Native (Expo SDK 52) với Hermes JS Engine, đóng gói sẵn bytecode ngoại tuyến, tích hợp `expo-camera`, `StickyBrandHeader`, Logo vector mạ vàng `ViOneLogo.tsx` 53x20, thanh điều hướng `CustomBottomTabBar` tính toán chuẩn xác `useSafeAreaInsets` cho cả iOS (Dynamic Island / Home Indicator) và Android (Gesture Navigation), hơn 40 modals nghiệp vụ chuyên sâu và đồng bộ 100% tính năng với bản PWA.

### 1.2. Tuyên ngôn 6 Nguyên Tắc Kỹ Thuật Bất Biến (Strict Engineering & Product Principles)
1. **100% CSDL Thực Tế PostgreSQL - Tuyệt Đối Không Mock Data / Fake Data:**
   - Nghiêm cấm mọi hình thức hardcode dữ liệu tĩnh, tạo mảng giả lập (`INITIAL_*`, `MOCK_*`, `fallbackList`, `dummyFallback`) ở tất cả các component Frontend khi hiển thị sản phẩm chính thức.
   - Nghiêm cấm sử dụng các hàm giả lập chỉ số (`Math.max(dbValue, 33)`, `Math.max(..., 475000000)`) để "làm đẹp" số liệu KPI khi CSDL chưa có dữ liệu. Mọi chỉ số KPI, biểu đồ, bảng danh sách phản ánh 100% bản ghi thực từ PostgreSQL; nếu CSDL trống thì hiển thị giá trị 0 hoặc giao diện **EmptyState** chuẩn mực.
2. **Nhận Diện Thương Hiệu Champagne Gold Thượng Lưu (Nghiêm Cấm Màu Cam & Xanh Hiệp Hội):**
   - Bộ nhận diện độc quyền của ViOne là **Vàng Đồng Champagne Gold** (`#DFB76C`, `#D4AF37`, `#F5C542`, `#B8860B`, `#D8B282`) phối hợp cùng nền **Đen Thạch Anh Obsidian Navy** (`#0B0F17`, `#0E1522`) hoặc **Trắng Ngọc Trai Tinh Tế** (`#FFFFFF`, `#FAF8F5`).
   - Nghiêm cấm tuyệt đối việc sử dụng màu cam (`orange-*`, `amber-600/700`) hoặc màu xanh blue hiệp hội cũ (`#0052CC`, `#003B95`).
3. **Phân Quyền Realtime UI & Phân Quyền Sở Hữu Dữ Liệu Chặt Chẽ (Data Ownership):**
   - **Chỉ có 2 vai trò to nhất hệ thống:** Role **Quản Trị (`quan_tri`)** (to nhất toàn hệ thống) và Role **Admin (`admin`)** (to thứ hai). Tuyệt đối không tồn tại role "Platform Admin".
   - **Quy tắc sở hữu dữ liệu:** Không tài khoản nào được phép chỉnh sửa bản ghi do tài khoản khác tạo ra (`canEditRecord(user, recordCreatorId)`), **TRỪ KHI** tài khoản đó mang role Quản Trị hoặc Admin.
   - **Realtime UI Sync:** Khi phân quyền thay đổi, giao diện tự động ẩn ngay các nút bấm, tabs mà không cần người dùng reload trang.
4. **Phân Lập Tuyệt Đối Giao Việc vs Nhận Việc:**
   - Chức năng Giao việc chỉ hiển thị cho Role Quản Trị, Role Admin và người thiết lập công ty tại cộng đồng (`isAssigner`).
   - Các tài khoản role nhân viên/thành viên thường bị ẩn hoàn toàn tab Giao việc & nút Giao việc mới; chỉ thấy tab "⚡ Nhận việc (Việc của tôi)" để tiếp nhận task qua nút **`[⚡ TIẾN HÀNH NHẬN VIỆC]`**, cập nhật tiến độ % (0-100%) và gửi báo cáo.
5. **Hệ Sinh Thái Phân Phối Đa Nền Tảng (Dual APK & iOS WebClip):**
   - Bản **PWA APK Siêu Tốc (~3.18 MB)** đóng gói qua Capacitor Android (`release_apk/ViOne-PWA-latest.apk`).
   - Bản **Native Standalone APK (~81.59 MB)** đóng gói qua React Native Gradle Release (`release_apk/ViOne-Connect-latest.apk`) chạy độc lập offline không phụ thuộc Metro server.
   - Bản **iOS Safari WebClip Profile (`.mobileconfig`)** cho phép người dùng iPhone cài đặt ứng dụng 1-chạm ra Màn hình chính tương tự file APK trên Android.
6. **Thiết Kế Màn Đăng Nhập CRM Tĩnh C-Level (Bỏ Hoàn Toàn Animation) & Bắt Buộc Bộ Lọc Trạng Thái Toàn Diện (Dashboard & Marketplace):**
   - **Màn đăng nhập CRM (`/auth`):** Triệt tiêu 100% các animation xoay vòng (`@keyframes`), hạt bụi lơ lửng, hào quang rung lắc. Áp dụng kiến trúc tĩnh 2 cột chuẩn C-Level: Cột trái ảnh kiến trúc skyline `/skyline_perspective_light.jpg` kết hợp biểu đồ PR hiệu năng (+168% hiệu suất điều hành, < 30 giây duyệt chi VietQR 3 cấp, 100% Department RBAC & Audit Trail) và 4 thẻ điểm lợi cốt lõi; Cột phải chuẩn hóa form đăng nhập CRM Champagne Gold.
   - **Bảng điều hành C-Level Dashboard (`ExecutiveDashboard.tsx`):** Bắt buộc 100% khối dữ liệu (Công việc khẩn cấp, Thành viên mới gia nhập, Sản phẩm Marketplace, Cơ hội kinh doanh B2B, Hóa đơn tài chính) đều phải trang bị bộ lọc trạng thái (Status Filter Tabs/Pills) trực quan kèm badge đếm số lượng thời gian thực.

---

## 2. BỐI CẢNH CHIẾN LƯỢC, TẦM NHÌN & MỤC TIÊU KINH DOANH SMART

### 2.1. Bối cảnh thị trường & Nỗi đau doanh nghiệp (Problem Statements)
Các doanh nghiệp Việt Nam và khu vực đang đối mặt với 4 rào cản quản trị lớn:
1. **Phân mảnh công cụ điều hành:** Lãnh đạo phải sử dụng rời rạc Zalo để nhắn tin, Trello/Jira để giao việc, Excel để chấm công và quản lý tài chính, gây thất thoát dữ liệu và nghẽn luồng thông tin.
2. **Thiếu tính năng kết nối B2B tin cậy:** Giao thương doanh nhân còn dựa nhiều vào namecard giấy dễ thất lạc, hội nhóm tự phát thiếu kiểm chứng tư cách pháp nhân và năng lực tài chính.
3. **Phân quyền lỏng lẻo & Rủi ro bàn giao:** Khi nhân sự nghỉ việc hoặc đổi phòng ban, dữ liệu khách hàng, tiến độ công việc và tài liệu mật bị gián đoạn, không có vết kiểm toán (Audit Trail) rõ ràng.
4. **Trải nghiệm di động thiếu chuyên nghiệp:** Các ứng dụng doanh nghiệp hiện nay thường cồng kềnh, giao diện nghèo nàn, bố trí text và icon lệch lạc, không tối ưu cho thao tác 1-chạm của lãnh đạo bận rộn.

### 2.2. Mục tiêu chiến lược SMART
- **S (Specific):** Xây dựng hệ điều hành doanh nghiệp all-in-one tích hợp Mạng xã hội kết nối giao thương B2B, số hóa 100% quy trình từ Giao việc, Chấm công GPS, Duyệt chi 3 cấp đến Họp ban trực tuyến và Danh thiếp số Titanium.
- **M (Measurable):** Cắt giảm 60% thời gian phê duyệt nội bộ, tăng 168% hiệu suất điều hành của CEO, đạt 100% độ chính xác đối soát ngân hàng VietQR.
- **A (Achievable):** Triển khai trên nền tảng công nghệ hiện đại (NestJS, React 19, Expo React Native SDK 52, PostgreSQL, MinIO S3, Socket.IO WebSockets).
- **R (Relevant):** Phù hợp hoàn hảo với chiến lược chuyển đổi số quốc gia và nhu cầu kết nối chuỗi cung ứng thực tế của cộng đồng doanh nhân.
- **T (Time-bound):** Hoàn thành bàn giao toàn diện phiên bản Master 7.0 trong Quý IV/2026.

---

## 3. PHÂN TÍCH 2 ROLE NGƯỜI DÙNG CỐT LÕI (TWO CORE ROLES ARCHITECTURE)

Ứng dụng di động ViOne Connect được thiết kế tối ưu hóa theo 2 nhóm người dùng chính:

```
+-----------------------------------------------------------------------------------+
|                        KIẾN TRÚC 2 ROLE NGƯỜI DÙNG CỐT LÕI                        |
+-----------------------------------------+-----------------------------------------+
| ROLE 1: LÃNH ĐẠO, GIÁM ĐỐC, CEO         | ROLE 2: NHÂN VIÊN & ĐỐI TÁC B2B         |
+-----------------------------------------+-----------------------------------------+
| - Điều hành toàn diện trên di động      | - Nhận việc 1-chạm: [⚡ TIẾN HÀNH        |
| - Giám sát giờ giấc/chuyên cần nhân sự  |   NHẬN VIỆC]                            |
| - Phê duyệt chi 3 cấp VietQR            | - Cập nhật tiến độ % (0-100%)           |
| - Giao việc thông minh qua AI giọng nói | - Nộp báo cáo đính kèm file Word/Excel  |
| - Họp ban trực tuyến C-Level 1-chạm     | - Chuyển giao việc nội bộ có lý do      |
| - Quản trị cơ cấu phòng ban & RBAC      | - Trao đổi danh thiếp số Titanium NFC/QR|
| - Phân tích cơ hội đối tác B2B cấp cao  | - Lên lịch hẹn kết nối 1-on-1           |
+-----------------------------------------+-----------------------------------------+
```

### 3.1. Role 1: Lãnh Đạo, Giám Đốc, CEO (Executive User)
- **Đặc trưng:** Thời gian hạn hẹp, thường xuyên di chuyển, cần nắm bắt bức tranh toàn cảnh và xử lý quyết sách nhanh trong 5–10 giây.
- **Quy chuẩn Chấm công Lãnh đạo:** Tuyệt đối không để tính năng tự chấm công cá nhân cho CEO. Thay vào đó là khối **Giám Sát Giờ Giấc & Chuyên Cần Nhân Sự Doanh Nghiệp**: Thống kê tỷ lệ có mặt thời gian thực (ví dụ: `42/45 nhân sự có mặt - 93.3%`), cảnh báo đi muộn/vắng mặt. Khối này chỉ hiển thị khi tài khoản sở hữu cộng đồng doanh nghiệp có nhân viên trực thuộc (`hasCompanyWithStaff === true`).
- **Thư ký riêng toàn năng AI Copilot 6.0:** Ra lệnh bằng giọng nói tiếng Việt để tạo việc, duyệt chi, xem báo cáo doanh thu, ghim lịch họp mà không cần bấm phím.

### 3.2. Role 2: Nhân Viên Nội Bộ & Đối Tác Giao Thương B2B
- **Nhân viên nội bộ:**
  - Nhận thông báo giao việc qua chuông và Push Notification.
  - Thao tác 1-chạm qua nút vàng nổi bật **`[⚡ TIẾN HÀNH NHẬN VIỆC]`** để chuyển trạng thái từ `assigned` sang `in_progress`.
  - Cập nhật tiến độ % linh hoạt, báo cáo giải trình kèm tệp đính kèm Word (`.docx`) và bảng tính Excel (`.xlsx`).
  - Nút **`[🔄 Chuyển việc]`** cho phép bàn giao công việc sang nhân sự khác khi có lý do chính đáng, lưu vết lịch sử `handover_history`.
- **Đối tác Giao thương B2B:**
  - Trao đổi danh thiếp điện tử thông minh qua chạm NFC hoặc quét mã QR trong 1 giây.
  - Xem danh bạ đối tác, khám phá cơ hội cung cầu, gửi đề xuất hẹn gặp 1-1 ghim thẳng vào lịch trình lãnh đạo.

---

## 4. MÔ TẢ CHI TIẾT 25 MODULES HỆ THỐNG WEB CRM VIONE (DOANH NGHIỆP)

Hệ thống Web CRM ViOne bao gồm 25 modules hoàn chỉnh, liên kết chặt chẽ với CSDL PostgreSQL:
1. **Module 01: Bảng Điều Hành C-Level Dashboard:** Bắt buộc 100% khối dữ liệu có bộ lọc trạng thái đa chiều, KPI tài chính thực, đối soát dòng tiền VietQR.
2. **Module 02: Quản Lý Khách Hàng CRM (B2B Accounts & Contacts):** Phân hạng doanh nghiệp, mã số thuế, hồ sơ C-Level, lịch sử tương tác đa kênh.
3. **Module 03: Phễu Bán Hàng & Cơ Hội Giao Thương (Deals Pipeline):** Bảng Kanban kéo thả, tỷ lệ chốt deal, dự báo doanh thu.
4. **Module 04: Quản Trị Quy Trình Công Việc Doanh Nghiệp (Workflow BPMN 2.0):** Sơ đồ quy trình động, checklist nghiệm thu 100%, tự động kích hoạt bước kế tiếp.
5. **Module 05: Phân Bổ Khối Lượng Công Việc (Workload Heatmap):** Ma trận tải công việc, cảnh báo đỏ khi nhân sự vượt quá 45 giờ/tuần.
6. **Module 06: Chấm Công Định Vị GPS & AI FaceID:** Bán kính hợp lệ $\le 50\text{m}$, nhận diện khuôn mặt chống gian lận, báo cáo chuyên cần tự động.
7. **Module 07: Quy Trình Phê Duyệt Tài Chính 3 Cấp (Approvals):** Phê duyệt 3 bước (Trưởng phòng $\rightarrow$ Kế toán trưởng $\rightarrow$ CEO), gạch nợ tự động VietQR trong 1 giây.
8. **Module 08: Quản Lý Thu & Quản Trị Công Nợ (Income & Invoices):** Theo dõi hóa đơn, đối soát biên lai, gạch nợ tự động qua Webhook PayOS/VietQR.
9. **Module 09: Quản Lý Chi Phí & Quỹ Doanh Nghiệp (Expenses):** Phân loại danh mục chi, hạch toán ngân sách, cảnh báo vượt hạn mức.
10. **Module 10: Báo Cáo Tài Chính & Dòng Tiền Thời Gian Thực (Financial Analytics):** P&L, dòng tiền thuần, biểu đồ tăng trưởng doanh thu.
11. **Module 11: Quản Trị Sự Kiện & Hội Nghị B2B (Events & Check-in):** Sơ đồ chỗ ngồi VIP, check-in QR code tại cửa, đo lường tỷ lệ tham dự.
12. **Module 12: Quản Lý Thành Viên & Hồ Sơ Pháp Nhân Doanh Nghiệp (Members & Companies):** Quản trị pháp nhân đa ngành, thẩm định tư cách hội viên.
13. **Module 13: Sàn Thương Mại Điện Tử B2B (Marketplace):** Gian hàng số doanh nghiệp, chào giá B2B, bộ lọc danh mục chống tràn viền.
14. **Module 14: Quản Lý Tài Liệu & Kho Tri Thức Số (Documents & Cloud Storage):** Lưu trữ bền vững trên MinIO S3, phân quyền xem/tải theo cấp bậc.
15. **Module 15: Hộp Thư Đàm Thoại Nội Bộ & Giao Tiếp B2B (Messages):** Chat bảo mật thời gian thực Socket.IO, gửi file hợp đồng, lưu trữ lịch sử trao đổi.
16. **Module 16: Biểu Quyết & Bầu Cử Kỹ Thuật Số (Digital Voting):** Cơ chế bỏ phiếu kín/công khai, kiểm phiếu tự động, chống sửa đổi kết quả.
17. **Module 17: Bản Tin & Truyền Thông Nội Bộ (News & Announcements):** Đăng tải thông báo, chỉ thị điều hành, đo lường lượt đọc của nhân viên.
18. **Module 18: Quản Trị Gói Tài Trợ & Quyền Lợi Doanh Nghiệp (Sponsors & Perks):** Quản trị gói tài trợ Kim Cương, Vàng, Bạc và đối soát quyền lợi.
19. **Module 19: Tiếp Thị Kỹ Thuật Số Đa Kênh (Email & Broadcast Marketing):** Gửi thông điệp tự động, cá nhân hóa nội dung theo phân khúc khách hàng.
20. **Module 20: Phân Khúc Thị Trường & Khách Hàng Mục Tiêu (Segments):** Phân nhóm thông minh theo ngành nghề, quy mô doanh thu, hành vi giao dịch.
21. **Module 21: Danh Mục Ưu Đãi Độc Quyền (Exclusive Member Perks):** Voucher chiết khấu nội bộ giữa các doanh nghiệp trong hệ sinh thái.
22. **Module 22: Phân Quyền Nền Tảng RBAC Ma Trận Thực Tế (Permissions Matrix):** 7 nhóm vai trò x 6 thao tác, cơ chế bảo vệ quyền sở hữu dữ liệu `canEditRecord`.
23. **Module 23: Cài Đặt Hệ Thống & Cổng Thanh Toán (System Settings):** Cấu hình thương hiệu, hotline, logo động phát sự kiện thời gian thực.
24. **Module 24: Báo Cáo Lưu Lượng & Nhật Ký Kiểm Toán (Audit Logs):** Báo cáo traffic, ghi vết bất biến 100% hành vi người dùng và lệnh AI Copilot.
25. **Module 25: Quản Trị Cơ Cấu Phòng Ban (Department RBAC) & Bàn Giao Tự Động (Auto-Handover):** Phân cấp Khối $\rightarrow$ Phòng ban $\rightarrow$ Nhóm chuyên trách, kiểm soát 5 cờ quyền, gom và chuyển giao việc hàng loạt khi nhân sự biến động.

---

## 5. MÔ TẢ CHI TIẾT ĐỒNG BỘ 100% ỨNG DỤNG DI ĐỘNG APP VIONE (NATIVE & PWA)

Ứng dụng di động ViOne Connect được cung cấp đồng thời trên hai phiên bản: **Bản Native React Native (`apps/mobile_vione`)** và **Bản PWA Web Mobile (`/connect-app`)**, đảm bảo tính tương đồng 100% (Design & Feature Parity) về giao diện, tính năng và luồng xử lý:

```
+-----------------------------------------------------------------------------------+
|               KIẾN TRÚC ĐỒNG BỘ 100% VIONE NATIVE APP & VIONE PWA                 |
+-----------------------------------------------------------------------------------+
|  [Tab 1: Trang Chủ]  |  [Tab 2: Mạng Lưới]  |  (V) NÚT V 3D  |  [Tab 3: Cộng Đồng] |  [Tab 4: Tôi]  |
|  - Sticky Header     |  - Đối tác / CRM     |  - Đưa mã QR   |  - Gói 30 ngày free |  - Danh thiếp  |
|  - Thẻ Doanh Nhân    |  - Pipeline Deals    |  - Chạm NFC    |  - 6 Phân hệ All-in1|  - Showcase    |
|  - Bàn Điều Hành CEO |  - Stories 24h       |  - Quét QR     |  - Phân quyền Ban   |  - Ví vCard    |
|  - Lịch Trình Hôm Nay|  - Chat 0ms & Call   |  - Quét Namecard| - Auto-Handover    |  - Bảo mật 2FA |
|  - Giám Sát Nhân Sự  |  - Hẹn 1-1 ghim lịch |  - Ghi chú cuộc|  - Họp ban 1-chạm   |  - 8 Ngôn ngữ  |
|  - Gợi Ý AI Matcher  |  - Danh bạ Zalo style|    gặp (Moment)|  - Import Excel/Word|  - Quả cầu AI  |
+-----------------------------------------------------------------------------------+
```

### 5.1. Tab 1: Trang Chủ Executive Home & Bàn Làm Việc Lãnh Đạo
- **Thanh Header Thương Hiệu Dính (`StickyBrandHeader`):**
  - Cố định trên đỉnh màn hình với logo vector mạ vàng `ViOneLogo.tsx` tỷ lệ chuẩn 53x20.
  - Lời chào năng động theo giờ Việt Nam: `Chào buổi sáng, HH:mm`, `Chào buổi chiều, HH:mm`, `Chào buổi tối, HH:mm`.
  - Nút chuyển đổi Theme Sáng/Tối vuông bo góc 32x32 mạ vàng champagne, nút micro kích hoạt Trợ lý AI và chuông thông báo có badge đỏ đếm số thông báo chưa đọc.
  - Nền mờ kính thạch anh `rgba(11, 15, 23, 0.95)` (Dark mode) hoặc `rgba(255, 255, 255, 0.95)` (Light mode).
- **Thẻ Doanh Nhân ViOne (EntrepreneurCard):**
  - Ảnh bìa sang trọng tỷ lệ 16:9 (`coverBannerImg`) phủ gradient chống lóa.
  - Ảnh đại diện tròn viền vàng đôi sắc nét (60x60px), huy hiệu `DOANH NHÂN VIONE` mạ vàng, hiển thị Họ tên, Chức danh, Số điện thoại.
  - Chạm vào thẻ mở Bottom Sheet danh thiếp cá nhân dạng thẻ VIP mạ vàng.
- **Thanh Định Vị AI GPS (Location Banner):**
  - Đèn tín hiệu xanh ngọc (Đang chia sẻ vị trí) hoặc vàng hổ phách (Chưa bật vị trí).
  - Nút `[Bật vị trí]` kích hoạt xin quyền GPS native thời gian thực để AI quét đối tác quanh bán kính 5km–20km.
- **Phân Hệ HÔM NAY (Editorial Schedule) & Tùy Chỉnh Briefing:**
  - Tiêu đề ngày tháng định dạng chuẩn tiếng Việt: `Thứ Hai, 12 tháng 10`. Nút `Xem lịch >` mở lịch tháng B2B (`ScheduleCalendarModal`).
  - 5 Tabs phân đoạn mượt mà:
    1. `Tất cả`: Tổng hợp mọi sự kiện, cuộc hẹn, cơ hội và công việc trong ngày.
    2. `Hôm nay (N)`: Lọc các đầu việc và lịch hẹn diễn ra đúng ngày hiện tại.
    3. `Sắp tới (N)`: Lịch trình đối tác và sự kiện hiệp hội trong 7 ngày tới. **Quy tắc toàn vẹn dữ liệu**: Khi không có sự kiện sắp tới, hệ thống hiển thị Empty State sang trọng ("Chưa có sự kiện nào sắp diễn ra"), TUYỆT ĐỐI KHÔNG fallback lấy sự kiện cũ trong quá khứ.
    4. `Nhắc lịch (N)`: Các cảnh báo quan trọng, gia hạn hội viên, hẹn gặp khách VIP.
    5. `🎙️ Ghi âm (N)`: Danh sách ghi âm giọng nói khoảnh khắc kèm trình phát sóng âm inline wave player (`handleTogglePlayVoice`).
  - Modal Tùy chỉnh Briefing Hôm Nay (`TodayCustomizeSheet`): Đồng bộ 100% với PWA, cho phép lãnh đạo bật/tắt hiển thị từng nhóm thông tin, sắp xếp thứ tự và giới hạn số mục hiển thị.
- **Thẻ Giám Sát Vận Hành & Nhân Sự C-Level (Enterprise Operations Card):**
  - **Điều kiện hiển thị:** Chỉ tài khoản có cộng đồng doanh nghiệp và có nhân sự trực thuộc (`hasCompanyWithStaff === true`) mới hiển thị thẻ này. Nếu tài khoản cá nhân độc lập, tự động ẩn để tránh gây rối mắt cho CEO.
  - Đèn xanh nhấp nháy `TRỰC TUYẾN` kèm 3 ô chỉ số tương tác:
    1. *Giờ giấc nhân sự:* Hiển thị `42/45 có mặt - 93.3%` $\rightarrow$ Chạm mở `AttendanceModal`.
    2. *Tiến độ nhân sự:* Hiển thị `12 việc - 2 việc trễ` $\rightarrow$ Chạm mở `WorkflowModal`.
    3. *Duyệt chi 3 cấp:* Hiển thị `3 chờ ký - 48.5 tr` $\rightarrow$ Chạm mở `ApprovalsModal`.
- **Thẻ Cơ Hội Kết Nối Tiềm Năng (Insight Card):**
  - Báo cáo số lượng: `BẠN CÓ 15 CƠ HỘI KẾT NỐI TIỀM NĂNG CAO`.
  - Phân tích trí tuệ nhân tạo tìm thấy các CEO cùng chuỗi cung ứng kèm nút CTA `[Khám phá ngay ->]` chuyển sang Tab Mạng lưới.
- **Bộ 3 Phím Tắt Tác Vụ Nhanh (Quick Actions Grid):**
  - `Lên lịch` (icon `CalendarDays`): Mở modal đặt lịch hẹn B2B (`ScheduleMeetingModal`).
  - `Quét & Kết nối` (icon `QuickScanIcon`): Mở máy ảnh quét danh thiếp OCR AI (`CardScanReviewModal`).
  - `Danh thiếp của tôi` (icon `QuickCardIcon`): Mở Bottom Sheet danh thiếp số cá nhân.
- **Khối Gợi Ý Đối Tác Hôm Nay (AI Partner Matcher):**
  - Tiêu đề `V · GỢI Ý HÔM NAY (AI)` với biểu tượng Sparkles mạ vàng.
  - 2 Dải Filter Chips ngang: Lọc theo không gian (Tất cả, Gần tôi, Cùng TP, Toàn quốc) & Lọc theo ngành nghề (Công nghệ, BĐS, Tài chính, Y tế...).
  - Thẻ đối tác: Avatar thật, Họ tên, Chức danh, Tên công ty, Điểm tương thích `Match Score: 98%`, Lý do kết nối AI phân tích, nút `[Đặt lịch]` và `[Kết nối ngay]`.

---

### 5.2. Tab 2: Mạng Lưới Giao Thương B2B & Hộp Thư Messenger
- **Dải Khoảnh Khắc 24h (Stories Strip) & Mạng Khoảnh Khắc Doanh Nhân (Moments Feed):**
  - **Phân định độc lập 100%**: Hệ thống phân tách rạch ròi giữa Tin 24h (Stories 24h) và Mạng Khoảnh khắc Doanh nhân (Moments Feed). Nút "Đăng story" mở luồng tạo story 24h. Nút "Chia sẻ khoảnh khắc" / `PostMomentModal` đăng bài viết vào Moments Feed với đầy đủ tương tác xã hội (Thả tim, Bình luận qua `MomentCommentModal`, Chia sẻ), tuyệt đối không bị đưa nhầm vào Story.
  - **Dải Story 24h**: Cuộn ngang mượt mà, thẻ đầu tiên `Tạo tin 24h` với avatar thật của tài khoản và nút dấu cộng mạ vàng. Danh sách tin 24h của mạng lưới đối tác với viền vàng gradient, hiển thị Họ tên, Tiêu đề thương vụ. Chạm vào mở trình xem story toàn màn hình `StoryViewerModal` tự động chuyển cảnh sau 5 giây.
  - **Bảo toàn ảnh chụp trực tiếp từ Camera**: Hàm chuẩn hóa URL hình ảnh (`resolveMediaUrl`) giữ nguyên các giao thức local/data/blob (`file://`, `content://`, `ph://`, `blob:`, `data:`). Không nối base URL máy chủ vào ảnh chụp camera, đảm bảo hiển thị đúng ảnh vừa chụp 100%, không bị lỗi 404 hay nhảy sang ảnh mẫu khác.
- **Bộ Chuyển Đổi 5 Tabs Mạng Lưới Cân Đối:**
  1. `Mạng lưới`: Danh bạ đối tác B2B đã kết nối, phân loại: Tất cả, Đã kết nối, Chờ duyệt, Gợi ý. Ô tìm kiếm thời gian thực theo tên, công ty, ngành nghề.
  2. `Khách hàng (CRM B2B)`:
     - 4 Thẻ chỉ số Pipeline: Quy mô cơ hội, Đang đàm phán, Tỷ lệ chốt, Lịch chăm sóc tuần.
     - Thanh lọc giai đoạn: Tất cả, Tiếp cận, Tư vấn & Báo giá, Đàm phán HĐ, Ký kết thành công.
     - Stepper tiến trình thương lượng 4 bước tương tác (1-chạm chuyển giai đoạn).
     - Chỉ báo sức khỏe thương vụ (Deal Health): Nóng (90%), Ổn định (70%), Cần chăm sóc (40%).
     - Dòng thời gian Touchpoint Logs kèm 4 phím tắt: `+ Cuộc gọi`, `+ Hẹn 1-1`, `+ Báo giá`, `+ Tin nhắn`.
  3. `Gợi ý AI`: Danh sách đối tác cần giữ kết nối (Nurture List) kèm phân tích lý do cần chăm sóc.
  4. `Tin nhắn (Messenger)`:
     - 4 Danh mục chuẩn: `Tất cả` (chứa toàn bộ hội thoại đã gửi/nhận), `Chưa đọc`, `Nhóm`, `Tin nhắn chờ`.
     - Quy tắc sắp xếp: Tin mới nhất luôn ở vị trí trên cùng (`lastMessageAt DESC`).
     - Bấm vào avatar đối phương mở ngay Bottom Sheet danh thiếp cá nhân.
     - Khung chat `ChatThreadModal`: Phản hồi 0ms, bong bóng chat Amber Gold (tin của mình) vs Slate Grey (đối tác), tick trạng thái 2 chiều.
     - Thẻ đề xuất hẹn gặp 1-1 tương tác (`OpportunityMeetingProposalCard`): Nút **`[⚡ ĐỒNG Ý HẸN]`** (tự động ghim lịch vào Trang chủ và gửi thông báo 2 bên).
     - Cuộc gọi thoại & video call WebRTC bảo mật cao, khử tiếng vọng.
  5. `Lời mời`: Quản lý danh sách lời mời kết nối đến và đi, nút Chấp thuận / Từ chối tức thì.
- **Banner Đề Xuất Kết Bạn Qua Danh Bạ Điện Thoại (`ContactsDiscoveryModal`):**
  - Quét danh bạ thiết bị (khi người dùng cấp quyền), so khớp số điện thoại trên CSDL PostgreSQL và gợi ý danh sách bạn bè/đối tác đã có tài khoản ViOne (tương tự trải nghiệm Zalo).

---

### 5.3. Nút V Trung Tâm 3D & Bảng Hành Động VActionSheet
- **Thiết Kế Nút V Trung Tâm:**
  - Hình tròn đường kính 58px nổi bật ở chính giữa thanh điều hướng, dập nổi 3D vector `VIconMark.tsx`.
  - Hiệu ứng ánh kim Champagne Gold phản chiếu đa tầng, bóng đổ lan tỏa `shadowColor: #D8B282, shadowOpacity: 0.55`.
- **Bảng Điều Khiển Nổi 1-Chạm (`VActionSheet`):**
  - Bấm nút V mở Drawer sang trọng từ dưới lên, chiếm 85% chiều cao màn hình:
  - **Thẻ Danh Tính Doanh Nghiệp Thượng Lưu (Identity Card):** Avatar, Tên, Chức vụ, Công ty, huy hiệu xác thực, watermark chữ V chìm mạ vàng.
  - **5 Hành Động Cốt Lõi (Core Capabilities):**
    1. *Đưa mã QR của bạn:* Mở thẻ QR cá nhân mạ vàng mờ để đối tác quét (`MyQrModal`).
    2. *Chạm thẻ NFC:* Kích hoạt radar đọc/ghi chip NFC danh thiếp thông minh.
    3. *Quét mã QR:* Mở máy ảnh quét mã kết nối của đối tác (`ScanQrModal`).
    4. *Quét danh thiếp:* Chụp ảnh danh thiếp giấy để AI OCR đa nhà cung cấp (Gemini Vision / OpenAI / Lovable) trích xuất tối thiểu: Họ tên, Số điện thoại và Chức danh (`CardScanReviewModal` / `CardScanFlow`). Tự động làm sạch số điện thoại và gắn liên kết Zalo trực tiếp (`https://zalo.me/${cleanPhone}`) kèm nút "Mở Zalo" ngay trong bước Review và sau khi lưu thành công danh bạ ViOne / CRM Lead. Tích hợp máy quét mã QR vCard trực tiếp trên camera để nhận diện và bóc tách ngay tức thì.
    5. *Ghi chú cuộc gặp / Đăng khoảnh khắc:* Chụp ảnh thực tế bằng Camera trực tiếp (Native CameraView / PWA WebRTC), tự động upload ảnh thật lên máy chủ ViOne (MinIO) qua multipart/form-data, ghi nhận thỏa thuận hợp tác và đăng vào dòng thời gian Moments Feed (`PostMomentModal`) hoặc Tin 24h (`CreateStoryModal`). Lưu trữ bài đăng bền vững vào `AsyncStorage` / `localStorage` để bài viết với ảnh thật của người dùng luôn đứng đầu bảng tin, tuyệt đối không bị ảnh mẫu từ code thay thế.
  - **3 Ô Lối Tắt Nhanh (Quick Tiles):** `Danh thiếp số`, `Ví thẻ`, `Bảo mật riêng tư`.
  - **Bàn Làm Việc Lãnh Đạo (CEO Executive Suite):**
    - `Giao việc nhân sự`: Mở modal phân công nhiệm vụ (`AssignTaskModal`).
    - `Tiến độ nhân viên`: Mở modal giám sát quá trình làm việc của cấp dưới (`StaffDailyActivityModal`).
    - `Theo dõi giờ giấc`: Mở modal điểm danh chấm công (`AttendanceModal`).
    - `Quy trình doanh nghiệp`: Mở modal quy trình phê duyệt (`WorkflowModal`).
    - `Ký duyệt văn bản`: Mở modal duyệt chi 3 cấp (`ApprovalsModal`).

---

### 5.4. Tab 3: Mô Hình Cộng Đồng Hợp Nhất & Gói Dùng Thử 30 Ngày
Theo định hướng kiến trúc bản quyền ViOne mới:
1. **Mô Hình Cộng Đồng Toàn Năng Hợp Nhất (All-in-One Community):**
   - Hợp nhất hoàn toàn 2 mô hình cũ (`company_internal` và `b2b_networking`) thành 1 mô hình Cộng Đồng Doanh Nghiệp ViOne duy nhất.
   - Mỗi cộng đồng sở hữu trọn vẹn cả 6 phân hệ cốt lõi:
     1. `Công việc (tasks)`: Giao việc, nhận việc, phân quyền phòng ban, import Excel/Word.
     2. `Giám sát (supervision)`: Báo cáo chuyên cần, quy trình công việc, tiến độ nhân sự.
     3. `Cơ hội B2B (opportunities)`: Đăng bài kết nối cung cầu, đề xuất hợp tác.
     4. `Bản tin (news)`: Thông báo, bài viết chia sẻ, chỉ thị điều hành.
     5. `Sự kiện (events)`: Lịch họp, hội thảo, đăng ký tham dự, chia sẻ sự kiện.
     6. `Thành viên (members)`: Danh bạ hội viên, phân cấp chức danh, mời vào nhóm.
   - 3 Nút hành động chuẩn trên Header: `+ Đăng cơ hội`, `+ Đăng bài`, `+ Chia sẻ SK`.
2. **Cơ Chế Gói Bản Quyền & Gating Phân Hệ Giao Việc Tại Trang Chủ:**
   - Phân hệ giao việc tại Trang chủ (`HomeScreen` / `ExecutiveHome`) **CHỈ HIỂN THỊ** khi tài khoản đã mua gói cộng đồng hoặc đang trong thời hạn dùng thử 30 ngày miễn phí (`hasCommunityPlan === true`).
   - Nếu chưa đăng ký gói, trang chủ hiển thị thẻ CTA Luxury Champagne Gold: `[+ Tạo cộng đồng & Dùng thử 30 ngày free]`.
   - Form khởi tạo cộng đồng 1-chạm (`CreateCommunityGroupModal`): Nhập Tên cộng đồng, Lĩnh vực, Slogan $\rightarrow$ Tự động kích hoạt quyền Quản trị viên và thời hạn 30 ngày dùng thử lưu vào CSDL `vione_community_subscriptions`.
3. **Quy Trình Nhận Việc 1-Chạm:**
   - Khi Giám đốc giao việc, nhân viên thấy công việc ở trạng thái `assigned` có nút vàng nổi bật **`[⚡ TIẾN HÀNH NHẬN VIỆC]`**.
   - Bấm nút $\rightarrow$ chuyển trạng thái sang `in_progress`, ghi nhận thời gian nhận việc `acceptedAt` và gửi thông báo đến Giám đốc.
   - Nút `Cập nhật tiến độ`: Chọn thanh trượt % (0-100%) và nhập ghi chú thực tế.
4. **Phân Quyền Phòng Ban Chuyên Trách (Department-based RBAC):**
   - Thiết lập danh mục Khối $\rightarrow$ Phòng ban $\rightarrow$ Nhóm chuyên trách (`vione_community_departments`).
   - Kiểm soát chặt chẽ 5 cờ quyền cho từng nhân sự:
     * `canAssign`: Quyền giao việc mới cho thành viên trong phòng ban.
     * `canAccept`: Quyền nhận việc được giao (`[⚡ TIẾN HÀNH NHẬN VIỆC]`).
     * `canReport`: Quyền nộp báo cáo nghiệm thu đính kèm file Word/Excel.
     * `canHandover`: Quyền điều phối, chuyển giao việc sang nhân sự khác.
     * `canMeet`: Quyền tham gia và khởi tạo phòng họp ban trực tuyến.
   - Nhân sự không thuộc phòng ban sẽ bị hiển thị banner cảnh báo: `🔒 Chế độ chỉ xem - Bạn không thuộc phòng ban này` và ẩn các nút thao tác.
5. **Cơ Chế Bàn Giao Tự Động (Auto-Handover Engine):**
   - Nút **`[🔄 Chuyển việc]`** trực tiếp trên thẻ công việc cho phép chuyển giao task sang nhân sự khác kèm lý do bàn giao chi tiết.
   - Lưu vết bất biến trong `handover_history` (người chuyển, người nhận, thời gian, lý do), đồng thời đẩy thông báo thời gian thực qua WebSocket.
6. **Họp Ban Trực Tuyến 1-Chạm (Instant Department Meeting - C-Level Room):**
   - Nút **`[📹 Họp ban 1-chạm]`** mạ vàng trên thanh điều hành công việc.
   - Khởi tạo phòng họp video WebRTC bảo mật cao, tự động gửi thông báo triệu tập khẩn cấp (Push Notification & In-app) đến toàn thể nhân sự trong phòng ban.
7. **Import & Bóc Tách Tự Động Đa Định Dạng (Word, Excel & PDF):**
   - **Tích Hợp Bên Trong Popup Giao Việc:** Tính năng Import file Word, Excel, PDF được tích hợp trực tiếp bên trong Popup Giao Việc (`createModalOpen` trên PWA và `AssignTaskModal` trên Native), không để lộ ra ngoài thanh công cụ nhằm bảo đảm giao diện gọn gàng, tinh tế.
   - **Bóc Tách Tự Động & Nhận Diện Phòng Ban:** Người giao việc nạp hoặc dán nội dung từ các file `.docx`, `.xlsx`, `.csv`, `.pdf`, hệ thống tự động bóc tách từng đầu việc, nhận diện phòng ban theo từ khóa nghiệp vụ (Sales, IT, Marketing, Kế toán, Nhân sự, Ban Giám Đốc) và tự động tìm kiếm, phân công thành viên phù hợp từ danh sách nhân sự thực tế trong CSDL.
   - **Thẻ Nhiệm Vụ Tự Động Sinh Ra:** Tự động sinh ra giao diện các thẻ công việc trực quan cho phép xem trước, tinh chỉnh tiêu đề, phòng ban, người phụ trách, mức độ ưu tiên và hạn chót trước khi thực hiện giao việc hàng loạt qua API `POST /connect-app/community/:communityId/tasks/import-excel`.
   - **Quy Chuẩn Nút Chức Năng Gọn Gàng:** Tuyệt đối không thêm tiền tố `+` thừa vào nhãn các nút chức năng (`Đăng cơ hội`, `Đăng bài`, `Chia sẻ SK`, `Giao việc`, `Tạo phòng ban`) và không lặp icon/emoji (`⚙️ Chỉnh sửa cộng đồng`).
   - **Dữ Liệu Hội Viên Thật:** Danh bạ thành viên trong cộng đồng được đồng bộ 100% từ bảng `public.members` của CSDL PostgreSQL (12 hội viên chính thức).
   - **Người nhận việc:** Khi bấm `[Nộp báo cáo]`, cho phép đính kèm song song cả tệp thuyết minh Word (`.docx`) và tệp bảng tính số liệu Excel (`.xlsx`).

---

### 5.5. Tab 4: Trang Cá Nhân "Tôi" - Danh Tính Số Thượng Lưu
- **Thẻ Định Danh Doanh Nhân Titanium 3D:**
  - Thiết kế sang trọng với avatar lãnh đạo, họ tên, chức danh, công ty, chữ ký mạ vàng V chìm.
  - 2 Nút hành động nhanh: `[Mã QR của tôi]` (mở `MyQrModal`) & `[Chạm thẻ NFC]`.
- **Card Liên Hệ Nhanh (Quick Contact):** Lưới 5 kênh kết nối trực tiếp qua `Linking`: Gọi điện thoại, Email, Viber, WhatsApp, Telegram.
- **Khối Trưng Bày Năng Lực Doanh Nghiệp (Showcase):**
  - Danh mục Lĩnh vực kinh doanh & Dự án trọng điểm.
  - Danh sách Khách hàng & Đối tác chiến lược có logo chuẩn mạ vàng.
- **Bộ Chuyển Đổi 8 Ngôn Ngữ Quốc Tế:**
  - Hỗ trợ 8 ngôn ngữ: Tiếng Việt (🇻🇳), English (🇬🇧), ភាសាខ្មែរ (🇰🇭), မြန်မာဘာသာ (🇲🇲), ພາສາລາວ (🇱🇦), 日本語 (🇯🇵), 한국어 (🇰🇷), 中文 (🇨🇳).
  - Lưu trạng thái bền vững vào `AsyncStorage` key `@vione_language_preference`.
- **Trung Tâm Bảo Mật & Phiên Đăng Nhập (`AccountSecurityModal`):**
  - Đổi mật khẩu tài khoản, kích hoạt xác thực 2 lớp (2FA).
  - Danh sách thiết bị và phiên làm việc đang hoạt động, nút đăng xuất thiết bị từ xa.
- **Quản Lý Thẻ Thông Minh NFC (`NfcTagsModal`):** Danh sách thẻ NFC vật lý đã liên kết, số lượt chạm thực tế, đổi tên thẻ và nút thu hồi thẻ khi thất lạc.
- **Ví Lưu Danh Thiếp vCard (`CardVaultModal`):** Quản lý toàn bộ danh thiếp đối tác đã lưu, tìm kiếm thông minh và xuất tệp danh bạ `.vcf` về điện thoại.
- **Cài Đặt Quyền Riêng Tư (`IdentityPrivacyModal`):** Tùy chọn ẩn/hiện SĐT, Email với người lạ, chặn tin nhắn rác, đóng dấu watermark bản quyền danh thiếp.

---

### 5.6. Siêu Trợ Lý Điều Khiển Bằng Giọng Nói AI Copilot 6.0
- **Dải Sóng Âm 16-Bar Holographic & Breathing Aura:**
  - Dải sóng âm động chuyển động nhịp nhàng theo tần số giọng nói khi AI lắng nghe hoặc đàm thoại.
  - Vòng hào quang thở (Breathing Aura) tông màu Champagne Gold `#DFB76C`.
- **Điều Khiển Ứng Dụng Bằng Giọng Nói 100% (Voice Action Automation):**
  - Nhận diện khẩu lệnh tiếng Việt tự nhiên và kích hoạt trực tiếp các modal trong app:
    * *"Chấm công / Điểm danh"* $\rightarrow$ Kích hoạt `onOpenAttendance()`.
    * *"Ký duyệt / Phê duyệt chi"* $\rightarrow$ Kích hoạt `onOpenApprovals()`.
    * *"Giao việc / Tạo công việc mới"* $\rightarrow$ Kích hoạt `onOpenAssignTask()`.
    * *"Tiến độ công việc / Quy trình"* $\rightarrow$ Kích hoạt `onOpenWorkflow()`.
    * *"Lịch hôm nay / Lịch trình B2B"* $\rightarrow$ Kích hoạt `onOpenCalendar()`.
    * *"Mã cá nhân / QR của tôi"* $\rightarrow$ Kích hoạt `onOpenMyQr()`.
    * *"Quét mã QR đối tác"* $\rightarrow$ Kích hoạt `onOpenScanQr()`.
    * *"Nhắn tin / Mạng lưới đối tác"* $\rightarrow$ Chuyển sang Tab `Network`.
- **Xuất File Báo Cáo Tự Động:** Tự động tổng hợp số liệu và sinh thẻ tải trực tiếp các tệp Excel (`.xlsx`), Word (`.docx`), PDF (`.pdf`) từ CSDL PostgreSQL.

---

## 6. QUY CHUẨN CÂN ĐỐI GIAO DIỆN (UI/UX, TEXT, ICON & SAFE AREA) TRÊN VIONE NATIVE APP

Để mang lại trải nghiệm thượng lưu, tinh tế và hoàn mỹ nhất cho người dùng trên mọi thiết bị di động (iPhone Dynamic Island, tai thỏ, Android nốt ruồi, cử chỉ vuốt toàn màn hình), ViOne Native App tuân thủ nghiêm ngặt các quy chuẩn cân đối giao diện sau:

```
+-----------------------------------------------------------------------------------+
|               QUY CHUẨN CÂN ĐỐI GIAO DIỆN (UI/UX VISUAL BALANCE)                  |
+-----------------------------------+-----------------------------------------------+
| YẾU TỐ THIẾT KẾ                   | QUY CHUẨN ÁP DỤNG TRÊN VIONE NATIVE APP       |
+-----------------------------------+-----------------------------------------------+
| 1. Safe Area Insets               | - Sử dụng `useSafeAreaInsets()` tính toán:    |
|                                   |   `bottomInset = Math.max(insets.bottom, 8)`  |
|                                   | - Chiều cao thanh điều hướng: 58px + insets   |
|                                   | - Nút V trung tâm nổi cân xứng tuyệt đối      |
+-----------------------------------+-----------------------------------------------+
| 2. Phân Cấp Typography            | - Tiêu đề lớn (Headline): 18-20px, Bold (700) |
|                                   | - Nhãn danh mục (Section): 11-12px, Uppercase |
|                                   | - Nội dung thân (Body): 13-14px, Regular (400)|
|                                   | - Nhãn phụ (Caption/Label): 10.5-11px, Med    |
|                                   | - Khoảng cách dòng (lineHeight) = 1.3 - 1.4em |
|                                   | - Khoảng cách chữ (letterSpacing) = 0.1-0.5px |
+-----------------------------------+-----------------------------------------------+
| 3. Kích Thước & Tỷ Lệ Icon        | - Tab Navigation Bar: 20px x 20px             |
|                                   | - Quick Action Buttons: 17-18px               |
|                                   | - Inline Meta Chips (MapPin, Phone): 12-13px  |
|                                   | - Nút V Trung Tâm 3D: 32px x 32px vector Svg  |
|                                   | - Icon luôn căn giữa hoàn hảo trong hộp chứa  |
+-----------------------------------+-----------------------------------------------+
| 4. Bán Kính Bo Góc (BorderRadius) | - Identity Card / Card lớn: 22px              |
|                                   | - Container / Box nghiệp vụ: 18-20px          |
|                                   | - Filter Pills / Buttons: 10-12px             |
|                                   | - Avatar / Nút V: Tròn hoàn hảo (50%)         |
+-----------------------------------+-----------------------------------------------+
| 5. Bảng Màu Thượng Lưu (Palette)  | - Nền tối chính: `#0B0F17`, Thạch anh `#0E1522`|
|                                   | - Nền sáng chính: `#FFFFFF`, Ngà ngọc `#FAF8F5`|
|                                   | - Vàng Champagne Gold: `#DFB76C`, `#D8B282`   |
|                                   | - Viền ánh kim: `rgba(216, 178, 130, 0.18)`   |
|                                   | - Trạng thái thành công: Xanh ngọc `#10B981`  |
|                                   | - Cảnh báo khẩn: Vàng cam `#F59E0B`, Đỏ `#EF4444`|
+-----------------------------------+-----------------------------------------------+
```

---

## 7. HỆ THỐNG 99 QUY TẮC NGHIỆP VỤ CỐT LÕI (BUSINESS RULES - 6 NHÓM)

### Nhóm I: Quy Tắc Định Danh & Tài Khoản (Rules 01 – 15)
- **BR-01:** Mỗi số điện thoại hoặc email chỉ được liên kết với duy nhất 1 tài khoản doanh nhân trong toàn hệ thống.
- **BR-02:** Tài khoản doanh nhân có thể tham gia hoặc điều hành nhiều pháp nhân công ty nhưng chỉ có 1 danh thiếp số chính (`primary_identity`).
- **BR-03:** Thay đổi mật khẩu hoặc thông tin nhạy cảm bắt buộc phải xác thực mã OTP gửi về SĐT/Email đã đăng ký.
- **BR-04:** Đăng nhập sai quá 5 lần liên tiếp sẽ tự động khóa tài khoản tạm thời trong 15 phút để phòng chống tấn công brute-force.

### Nhóm II: Quy Tắc Phân Quyền & Sở Hữu Dữ Liệu (Rules 16 – 32)
- **BR-16:** Quyền tối cao thuộc về Role Quản Trị (`quan_tri`), tiếp theo là Role Admin (`admin`).
- **BR-17:** Người dùng thông thường chỉ được sửa bản ghi do chính mình tạo ra (`canEditRecord`). Nghiêm cấm can thiệp bản ghi của người khác.
- **BR-18:** Khi phân quyền thay đổi tại backend, giao diện frontend và mobile phải phản ứng tức thì (Realtime Reactive) ẩn/hiện chức năng tương ứng.
- **BR-19:** Phân lập giao diện Giao việc (chỉ cấp quản lý) vs Nhận việc (dành cho nhân viên).

### Nhóm III: Quy Tắc Chấm Công & Vận Hành (Rules 33 – 50)
- **BR-33:** Chấm công GPS chỉ hợp lệ khi khoảng cách từ thiết bị đến tọa độ văn phòng công ty $\le 50\text{m}$.
- **BR-34:** Chấm công bắt buộc kết hợp nhận diện khuôn mặt AI FaceID, so khớp độ tương đồng $\ge 85\%$.
- **BR-35:** Nghiêm cấm hiển thị tính năng tự chấm công cá nhân cho Giám đốc/CEO; chuyển đổi sang chế độ giám sát giờ giấc chuyên cần nhân sự.

### Nhóm IV: Quy Tắc Phê Duyệt & Tài Chính (Rules 51 – 68)
- **BR-51:** Quy trình duyệt chi thực thi theo cơ chế 3 cấp tuần tự: Trưởng bộ phận $\rightarrow$ Kế toán trưởng $\rightarrow$ Ban Giám Đốc.
- **BR-52:** Khoản chi vượt hạn mức ngân sách phòng ban bắt buộc phải có giải trình bổ sung đính kèm tệp chứng từ.
- **BR-53:** Thanh toán chuyển khoản tự động qua VietQR 24/7, gạch nợ tức thời qua Webhook ngân hàng trong vòng 1 giây, khử trùng biên lai trùng lặp.

### Nhóm V: Quy Tắc Cộng Đồng & Phân Quyền Phòng Ban (Rules 69 – 85)
- **BR-69:** Phân hệ giao việc tại Trang chủ chỉ hiển thị khi tài khoản có gói bản quyền cộng đồng hoặc đang trong thời hạn dùng thử 30 ngày free.
- **BR-70:** Người dùng mua hoặc dùng thử gói cộng đồng được quyền tạo 1 cộng đồng toàn năng all-in-one của riêng mình.
- **BR-71:** Nhân sự thuộc phòng ban nào chỉ được thực hiện các quyền hạn đã được cấp (`canAssign`, `canAccept`, `canReport`, `canHandover`, `canMeet`) trong phòng ban đó.
- **BR-72:** Bàn giao công việc (Auto-Handover) bắt buộc phải nhập lý do, tự động gửi thông báo đến người nhận và lưu vết kiểm toán bất biến `handover_history`.

### Nhóm VI: Quy Tắc Bảo Mật & AI Copilot (Rules 86 – 99)
- **BR-86:** Toàn bộ lệnh thoại và thao tác tự động của AI Copilot phải được ghi nhật ký kiểm toán (AI Audit Trail).
- **BR-87:** Danh thiếp số chia sẻ qua NFC/QR chỉ hiển thị các trường dữ liệu mà chủ sở hữu cho phép công khai tại cài đặt quyền riêng tư.
- **BR-88:** Dữ liệu tài liệu tải lên hệ thống được lưu trữ mã hóa trên MinIO S3, chỉ truy cập qua Pre-signed URL có thời hạn tối đa 60 phút.

---

## 8. MA TRẬN PHÂN QUYỀN RBAC ĐA TẦNG (ROLE x DEPARTMENT) & CƠ CHẾ AUTO-HANDOVER

### 8.1. Ma trận phân quyền 7 nhóm vai trò x 6 quyền hạn
| Vai Trò (Role) | Xem (Read) | Tạo (Create) | Sửa (Update) | Xóa (Delete) | Duyệt (Approve) | Xuất Dữ Liệu (Export) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Quản Trị (`quan_tri`)** | Toàn quyền (*) | Toàn quyền (*) | Toàn quyền (*) | Toàn quyền (*) | Toàn quyền (*) | Toàn quyền (*) |
| **Admin (`admin`)** | Toàn quyền (*) | Toàn quyền (*) | Toàn quyền (*) | Giới hạn | Toàn quyền (*) | Toàn quyền (*) |
| **Tổng Giám Đốc (CEO)** | Toàn quyền | Toàn quyền | Bản ghi của mình | Không | Duyệt Cấp 3 (Tối cao)| Toàn quyền |
| **Giám Đốc Vận Hành (COO)** | Toàn quyền | Phân hệ vận hành| Bản ghi của mình | Không | Duyệt Cấp 2 | Báo cáo vận hành |
| **Giám Đốc Tài Chính (CFO)** | Phân hệ tài chính| Kế hoạch thu chi | Bản ghi của mình | Không | Duyệt Cấp 2 | Báo cáo tài chính |
| **Trưởng Phòng (Department Head)**| Trong phòng ban | Giao việc phòng ban| Bản ghi của mình | Không | Duyệt Cấp 1 | Báo cáo phòng ban |
| **Nhân Viên (Staff)** | Việc được giao | Báo cáo tiến độ | Bản ghi của mình | Không | Không | Tải file việc của mình |

### 8.2. Cơ chế phân quyền phòng ban chi tiết (5 Cờ Quyền)
Mỗi nhân sự khi được thêm vào phòng ban (`vione_community_department_members`) được cấu hình 5 cờ quyền độc lập:
1. `canAssign` (Quyền Giao Việc): Chỉ Trưởng phòng hoặc quản lý mới có quyền này.
2. `canAccept` (Quyền Nhận Việc): Cho phép bấm nút `[⚡ TIẾN HÀNH NHẬN VIỆC]` và tiếp nhận task.
3. `canReport` (Quyền Báo Cáo): Cho phép cập nhật % tiến độ và nộp tài liệu nghiệm thu Word/Excel.
4. `canHandover` (Quyền Chuyển Việc): Cho phép điều phối bàn giao công việc sang nhân sự khác.
5. `canMeet` (Quyền Họp Ban): Cho phép khởi tạo và tham gia phòng họp trực tuyến tức thì 1-chạm của ban.

### 8.3. Luồng tự động hóa bàn giao (Auto-Handover Flow)
Khi nhân sự chuyển phòng ban hoặc thôi việc:
1. Quản lý hoặc nhân sự kích hoạt tính năng **Bàn Giao Công Việc**.
2. Hệ thống quét toàn bộ các thực thể thuộc quyền sở hữu của nhân sự:
   - Danh sách công việc đang xử lý (`todo`, `in_progress`, `review`).
   - Danh sách khách hàng CRM đang phụ trách chăm sóc.
   - Các cơ hội kinh doanh B2B đang thương lượng.
3. Người dùng chọn Nhân sự tiếp nhận mới và nhập lý do bàn giao.
4. Hệ thống thực thi trong một Database Transaction duy nhất:
   - Cập nhật trường `assignee_id` sang nhân sự mới.
   - Ghi bản ghi vào mảng `handover_history` gồm: `from_user_id`, `to_user_id`, `timestamp`, `reason`.
   - Sinh biên bản bàn giao điện tử dạng PDF.
   - Gửi Push Notification và WebSocket thông báo cho cả 2 bên.

---

## 9. YÊU CẦU PHI CHỨC NĂNG (ENTERPRISE NFR) & KIẾN TRÚC DỮ LIỆU THỰC TẾ

### 9.1. Hiệu năng & Khả năng mở rộng (Performance & Scalability)
- **Thời gian phản hồi API:** $\le 200\text{ms}$ đối với 95% các yêu cầu truy vấn chuẩn.
- **Tải đồng thời:** Hỗ trợ tối thiểu 10,000 người dùng trực tuyến đồng thời (CCU) không suy giảm hiệu năng.
- **Khởi động ứng dụng di động:** Thời gian tải màn hình đầu tiên (Cold Start) $\le 1.8$ giây trên các thiết bị di động tầm trung.

### 9.2. An toàn thông tin & Bảo mật (Security & Compliance)
- **Mã hóa truyền tải:** 100% kết nối qua giao thức TLS 1.3 với chuẩn bảo mật HSTS.
- **Mã hóa lưu trữ:** Mật khẩu băm qua thuật toán Argon2id / Bcrypt 12 rounds; dữ liệu nhạy cảm mã hóa AES-256.
- **Xác thực phiên:** JSON Web Token (JWT) có thời hạn sống ngắn (15 phút) kết hợp Refresh Token lưu trữ an toàn trong SecureStore/AsyncStorage.

### 9.3. Kiến trúc CSDL PostgreSQL thực tế
Hệ thống vận hành trên 163 bảng CSDL chuẩn hóa 3NF, phân tách rõ ràng các schema:
- `core_*`: Người dùng, vai trò, phiên làm việc, thiết bị di động, nhật ký kiểm toán.
- `crm_*`: Khách hàng, liên hệ, cơ hội bán hàng, lịch sử tương tác.
- `ops_*`: Quy trình BPMN, chấm công GPS, phân công công việc, phê duyệt chi.
- `community_*`: Cộng đồng, phòng ban, phân quyền thành viên, bản quyền dùng thử 30 ngày.
- `connect_*`: Danh thiếp số, liên kết đối tác, hộp thư chat, cuộc gọi WebRTC.

---

## 10. KẾ HOẠCH TRIỂN KHAI, ĐỐI SOÁT & TIÊU CHUẨN NGHIỆM THU

### 10.1. Kế hoạch triển khai WBS 5 Giai Đoạn
1. **Giai đoạn 1 (01/08 – 25/08/2026):** Khởi tạo kiến trúc hạ tầng Monorepo, CSDL PostgreSQL 163 bảng và phân quyền RBAC đa tầng.
2. **Giai đoạn 2 (26/08 – 25/09/2026):** Phát triển bộ API nghiệp vụ vận hành C-Level, chấm công GPS, duyệt chi VietQR và hộp thư Messenger Socket.IO.
3. **Giai đoạn 3 (26/09 – 02/10/2026):** Đại tu giao diện Dark Luxury Obsidian & Champagne Gold, đóng gói Standalone Release APK và cấu hình iOS WebClip.
4. **Giai đoạn 4 (03/10 – 11/10/2026):** Tích hợp phân quyền phòng ban Department RBAC, cơ chế bàn giao tự động Auto-Handover, họp ban 1-chạm và import/export Word/Excel.
5. **Giai đoạn 5 (12/10/2026):** Đồng bộ hoàn toàn tính năng giữa ViOne PWA và ViOne Native App, chuẩn hóa cân đối UI/UX, kiểm thử 0 lỗi typecheck và phát hành chính thức bộ tài liệu BRD / SRS Master 7.0.

### 10.2. Tiêu chuẩn nghiệm thu bàn giao (Acceptance Criteria)
- 100% chức năng mô tả trong tài liệu phải hoạt động ổn định trên CSDL thực tế PostgreSQL (0% mock data).
- Lệnh kiểm tra type check (`tsc --noEmit`) trên toàn bộ các ứng dụng (`apps/mobile_vione`, `apps/vione_app_fe`, `apps/vione_app_be`) trả về **exit code 0 (0 errors)**.
- Giao diện trên thiết bị di động Native cân đối hoàn hảo, không bị đè vạch điều hướng hệ thống (Safe Area Insets), text và icon thẳng hàng, bố cục mạch lạc.
- Bộ tài liệu kỹ thuật BRD, SRS, WBS Excel đồng bộ nhất quán 100% với mã nguồn hiện hành.

---
*Tài liệu BRD Master 7.0 được lập và phê duyệt bởi Ban Công Nghệ VioConnect.*
