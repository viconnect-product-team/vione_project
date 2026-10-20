# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) TOÀN DIỆN HỆ THỐNG VÀ APP VIONE
## CHUẨN QUỐC TẾ IEEE 830 - PHÂN RÃ MECE CHI TIẾT KHÔNG BỎ SÓT CHỨC NĂNG
**Dự án:** Hệ Thống Quản Trị Doanh Nghiệp Toàn Diện ViOne & Mạng Xã Hội Giao Thương Doanh Nhân B2B ViOne Connect  
**Mã tài liệu:** `SRS-VIONE-MASTER-7.0` | **Ngày ban hành:** 12/10/2026 | **Phiên bản:** `7.0 Enterprise Master Release`  
*(Đồng Bộ 100% Tính Năng Giữa ViOne PWA và ViOne Native App, Chuẩn Hóa Cân Đối Giao Diện UI/UX Text & Icon, Phân Quyền Phòng Ban Department RBAC, Bàn Giao Tự Động, Họp Ban 1-Chạm & Import/Export Excel/Word)*  
**Đơn vị thực hiện:** Senior Business Analyst & Solution Architect Team — Tập Đoàn VioConnect

---

## MỤC LỤC TỔNG QUAN

1. [PHẦN 1: GIỚI THIỆU CHUNG (INTRODUCTION)](#phần-1-giới-thiệu-chung-introduction)
   - 1.1 Mục Đích Tài Liệu
   - 1.2 Phạm Vi Dự Án
   - 1.3 Thuật Ngữ Và Viết Tắt (Definitions & Acronyms)
   - 1.4 Tiêu Chuẩn Tham Chiếu Quốc Tế IEEE 830-1998
2. [PHẦN 2: MÔ TẢ TỔNG QUAN HỆ THỐNG (OVERALL DESCRIPTION)](#phần-2-mô-tả-tổng-quan-hệ-thống-overall-description)
   - 2.1 Cấu Trúc 2 Role Người Dùng Cốt Lõi (Executive C-Level vs Staff/Partner)
   - 2.2 Kiến Trúc Đồng Bộ 100% ViOne PWA (`/connect-app`) và ViOne Native App (`apps/mobile_vione`)
   - 2.3 Môi Trường Hoạt Động & Yêu Cầu Hạ Tầng (Operating Environment)
3. [PHẦN 3: ĐẶC TẢ YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)](#phần-3-đặc-tả-yêu-cầu-chức-năng-chi-tiết-functional-requirements)
   - *Phân hệ I: Web CRM ViOne Platform (25 Modules Doanh Nghiệp)*
   - *Phân hệ II: Ứng Dụng Di Động ViOne Connect (Native & PWA) (13 Phân Hệ Toàn Năng)*
     * FR-APP-01: Header Thương Hiệu Dính & Lời Chào Năng Động (`StickyBrandHeader`)
     * FR-APP-02: Thẻ Doanh Nhân ViOne & Trạng Thái Định Vị GPS (`EntrepreneurCard`, `LocationBanner`)
     * FR-APP-03: Bàn Điều Hành Lãnh Đạo & Lịch Trình Hôm Nay 5 Tabs (`TodayEditorialSection`)
     * FR-APP-04: Thẻ Giám Sát Vận Hành & Chuyên Cần Nhân Sự C-Level (`ExecutiveCenterSection`)
     * FR-APP-05: Khối Gợi Ý Đối Tác AI Matcher Đa Chiều (`AiPartnersSection`)
     * FR-APP-06: Mạng Lưới Đối Tác & Khách Hàng CRM B2B 5 Tabs (`NetworkScreen`)
     * FR-APP-07: Hộp Thư Messenger 0ms & Thẻ Đề Xuất Hẹn 1-1 Ghim Lịch (`ChatThreadModal`)
     * FR-APP-08: Nút V Trung Tâm 3D & Bảng Điều Khiển VActionSheet 5 Hành Động (`VActionSheet`)
     * FR-APP-09: Mô Hình Cộng Đồng Hợp Nhất All-in-One & Gói Dùng Thử 30 Ngày (`CommunityScreen`)
     * FR-APP-10: Phân Quyền Phòng Ban Chuyên Trách 5 Cờ Quyền (`DepartmentPermissionsModal`)
     * FR-APP-11: Cơ Chế Bàn Giao Tự Động (Auto-Handover Engine & Bulk Reassignment)
     * FR-APP-12: Họp Ban Trực Tuyến 1-Chạm & Import/Export Excel/Word (`InstantMeetingModal`)
     * FR-APP-13: Trang Cá Nhân "Tôi" - Danh Tính Số Titanium, Showcase & 8 Ngôn Ngữ (`ProfileScreen`)
     * FR-APP-14: Siêu Trợ Lý Điều Khiển Giọng Nói AI Copilot 6.0 (`ViOneVoiceAssistantModal`)
4. [PHẦN 4: QUY CHUẨN KỸ THUẬT CÂN ĐỐI UI/UX, TEXT, ICON & SAFE AREA INSETS TRÊN MOBILE NATIVE APP](#phần-4-quy-chuẩn-kỹ-thuật-cân-đối-uiux-text-icon--safe-area-insets-trên-mobile-native-app)
5. [PHẦN 5: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)](#phần-5-yêu-cầu-phi-chức-năng-non-functional-requirements---nfr)
   - 5.1 Hiệu Năng Hệ Thống (Performance)
   - 5.2 An Toàn Thông Tin & Bảo Mật (Security & Compliance)
   - 5.3 Tính Khả Dụng & Trải Nghiệm Thượng Lưu (Usability)
   - 5.4 Độ Tin Cậy & Khôi Phục Thảm Họa (Reliability & DR)
6. [PHẦN 6: GIAO TIẾP VÀ TÍCH HỢP HỆ THỐNG (SYSTEM INTERFACES & APIS)](#phần-6-giao-tiếp-và-tích-hợp-hệ-thống-system-interfaces--apis)
7. [PHẦN 7: MA TRẬN TRUY XUẤT NGUỒN GỐC (TRACEABILITY MATRIX) & TIÊU CHUẨN NGHIỆM THU](#phần-7-ma-trận-truy-xuất-nguồn-gốc-traceability-matrix--tiêu-chuẩn-nghiệm-thu)

---

### PHẦN 1: GIỚI THIỆU CHUNG (INTRODUCTION)

#### 1.1 Mục Đích Tài Liệu
Tài liệu Software Requirements Specification (SRS) này được biên soạn bởi Senior Business Analyst và System Architect theo chuẩn quốc tế **IEEE 830-1998 (Recommended Practice for Software Requirements Specifications)**. Tài liệu đặc tả chi tiết, toàn diện và đầy đủ 100% tất cả các yêu cầu chức năng (FR) và phi chức năng (NFR) cho Hệ thống Quản trị Doanh nghiệp ViOne CRM và Ứng dụng Di động ViOne Connect. Đây là căn cứ kỹ thuật duy nhất phục vụ công tác phát triển mã nguồn, kiểm thử chấp nhận (UAT), nghiệm thu và bàn giao hệ thống cho Chủ đầu tư.

#### 1.2 Phạm Vi Dự Án
Phạm vi dự án bao gồm hai trụ cột công nghệ hợp nhất:
1. **Nền Tảng Quản Trị Doanh Nghiệp ViOne CRM (Web Portal):** Bộ công cụ quản trị B2B toàn diện gồm Quản lý quan hệ khách hàng, Phễu bán hàng Kanban Deals, Quản trị quy trình tự động, Chấm công định vị GPS & FaceID, Phê duyệt tài chính 3 cấp, Đối soát ngân hàng VietQR, Sàn giao thương B2B, Trí tuệ nhân tạo AI Copilot 6.0, và Ma trận phân quyền 7x6 theo kiến trúc Multi-Tenant (25 Phân hệ).
2. **Ứng Dụng Di Động ViOne Connect (Mobile App Native & PWA):** Ứng dụng di động cao cấp dành cho lãnh đạo C-Level và nhân sự/đối tác B2B, tích hợp danh thiếp số NFC, Thẻ doanh nhân mở Bottom Sheet vuốt tay xuống, Sàn kết nối cung cầu B2B, Kênh chat trực tiếp gửi thẻ đề xuất hẹn gặp ghim lịch điều hành, Phân hệ cộng đồng hợp nhất All-in-One, Phân quyền phòng ban Department RBAC, Bàn giao công việc tự động Auto-Handover, Họp ban trực tuyến 1-chạm, Import/Export Word/Excel, Nhật ký ghi âm khoảnh khắc điều hành, Trợ lý AI Copilot 6.0 đa tác vụ tìm kiếm bằng giọng nói và quét đối tác quanh đây, Trung tâm duyệt hồ sơ 1-chạm di động và giải pháp cài đặt 1-chạm độc quyền cho iOS (.mobileconfig) (13 Phân hệ).

#### 1.3 Thuật Ngữ Và Viết Tắt
- **CRM:** Customer Relationship Management (Quản lý quan hệ khách hàng).
- **ERP:** Enterprise Resource Planning (Hoạch định tài nguyên doanh nghiệp).
- **RBAC:** Role-Based Access Control (Kiểm soát truy cập dựa trên vai trò).
- **NFC:** Near Field Communication (Giao tiếp trường gần - Chạm truyền dữ liệu).
- **OCR:** Optical Character Recognition (Nhận dạng ký tự quang học).
- **MECE:** Mutually Exclusive, Collectively Exhaustive (Không trùng lặp, Không bỏ sót).
- **PWA:** Progressive Web App (Ứng dụng web tiến bộ).
- **JWT:** JSON Web Token (Chuẩn xác thực phân tán an toàn).
- **WebRTC:** Web Real-Time Communication (Giao thức truyền âm thanh & video thời gian thực).

---

### PHẦN 2: MÔ TẢ TỔNG QUAN HỆ THỐNG (OVERALL DESCRIPTION)

#### 2.1 Cấu Trúc 2 Role Người Dùng Cốt Lõi
Hệ thống chuẩn hóa cấp bậc quyền lực và phân quyền dữ liệu chặt chẽ theo 2 nhóm người dùng:
1. **Role 1 (Lãnh Đạo, Giám Đốc, CEO):**
   - ViOne gói gọn toàn bộ công việc điều hành vào một ứng dụng di động tinh gọn.
   - Trí tuệ nhân tạo AI Copilot 6.0 đóng vai trò như **Thư ký riêng toàn năng**: (a) Giao việc thông minh cho nhân sự bằng giọng nói hoặc chat lệnh ngắn, (b) Giám sát quá trình và tiến độ công việc của toàn bộ nhân viên công ty, (c) Quản trị và tối ưu hóa lịch trình, cảnh báo xung đột và bảo vệ sức khỏe CEO, (d) Mở rộng mạng lưới kết nối đối tác B2B cấp cao.
   - **Quy chuẩn Chấm công Lãnh đạo:** Tuyệt đối không để tính năng tự chấm công cá nhân cho CEO. Chức năng chuyển thành chế độ **Theo Dõi Giờ Giấc & Chuyên Cần Nhân Sự Doanh Nghiệp**: Thống kê tỷ lệ có mặt thời gian thực, chỉ hiển thị khi có cộng đồng công ty và có nhân viên trực thuộc.
2. **Role 2 (Nhân Viên Nội Bộ / Bạn Bè, Đối Tác):**
   - **Nhân viên:** Nhận việc do sếp giao qua thông báo chuông, bấm nút **`[⚡ TIẾN HÀNH NHẬN VIỆC]`** để tiếp nhận, cập nhật thanh tiến độ % (0-100%) kèm báo cáo giải trình, nộp tài liệu nghiệm thu Word/Excel, chuyển giao việc có lý do.
   - **Bạn bè, Đối tác B2B:** Lưu và đồng bộ danh bạ điện thoại, trao đổi Danh thiếp số Titanium NFC / QR Code, lên lịch hẹn giao thương 1-on-1.

#### 2.2 Kiến Trúc Đồng Bộ 100% ViOne PWA (`/connect-app`) và ViOne Native App (`apps/mobile_vione`)
Cả hai ứng dụng chia sẻ chung 100% hợp đồng API Backend NestJS (`apps/vione_app_be`), kiến trúc dữ liệu PostgreSQL và luồng nghiệp vụ:
- Tab 1: Trang Chủ (Executive Home) $\rightarrow$ Khớp 100% dữ liệu briefing hôm nay, lịch trình, bàn điều hành C-Level, insight kết nối, AI partner recommendations.
- Tab 2: Mạng Lưới (Network & B2B CRM) $\rightarrow$ Khớp 100% pipeline khách hàng, stories 24h, messenger chat 0ms, đề xuất hẹn 1-1, đồng bộ danh bạ Zalo style.
- Nút V Trung Tâm (VActionSheet) $\rightarrow$ Khớp 100% 5 hành động cốt lõi (Đưa mã QR, Chạm thẻ NFC, Quét mã QR, Quét danh thiếp OCR, Ghi chú cuộc gặp) và bộ phím tắt điều hành C-Level.
- Tab 3: Cộng Đồng Hợp Nhất (All-in-One Community) $\rightarrow$ Khớp 100% 6 phân hệ (Tasks, Supervision, Opportunities, News, Events, Members), phân quyền phòng ban Department RBAC, tự động bàn giao Auto-Handover, họp ban 1-chạm WebRTC, import/export Word/Excel.
- Tab 4: Trang Cá Nhân "Tôi" $\rightarrow$ Khớp 100% danh thiếp số Titanium, Showcase doanh nghiệp, 8 ngôn ngữ quốc tế, trung tâm bảo mật 2FA, ví thẻ vCard.

---

### PHẦN 3: ĐẶC TẢ YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)

#### Phân Hệ I: Web CRM ViOne Platform (25 Modules Doanh Nghiệp)
1. **FR-CRM-01: Bảng Điều Hành C-Level Dashboard:**
   - Bộ lọc trạng thái đa chiều (All, Active, Pending, Overdue) trên toàn bộ các widget.
   - Biểu đồ dòng tiền thực tế từ bảng `crm_invoices` và `crm_expenses`.
2. **FR-CRM-02: Quản Lý Khách Hàng CRM B2B:**
   - Quản trị pháp nhân, mã số thuế, hồ sơ người đại diện pháp luật, sơ đồ tổ chức khách hàng.
3. **FR-CRM-03: Phễu Bán Hàng Kanban Deals:**
   - Bảng Kanban kéo thả mượt mà, tính toán tổng giá trị phễu tự động, tỷ lệ chuyển đổi từng giai đoạn.
4. **FR-CRM-04: Quản Trị Quy Trình Doanh Nghiệp BPMN 2.0:**
   - Thiết kế luồng phê duyệt, phân công nhiệm vụ tự động, kích hoạt webhook khi hoàn thành bước.
5. **FR-CRM-05: Bản Đồ Nhiệt Tải Công Việc (Workload Heatmap):**
   - Theo dõi số giờ làm việc thực tế, cảnh báo nguy cơ kiệt sức (burnout) khi vượt quá 45h/tuần.
6. **FR-CRM-06: Chấm Công GPS $\le 50\text{m}$ & AI FaceID:**
   - Tính toán bán kính tọa độ Haversine $\le 50\text{m}$, so khớp khuôn mặt qua model ONNX MobileNet.
7. **FR-CRM-07: Phê Duyệt Chi 3 Cấp & VietQR 24/7:**
   - Cấp 1 (Trưởng phòng) $\rightarrow$ Cấp 2 (Kế toán trưởng) $\rightarrow$ Cấp 3 (CEO). Sinh mã VietQR động, gạch nợ trong 1s.
8. **FR-CRM-08: Quản Lý Thu & Hóa Đơn Doanh Nghiệp:**
   - Xuất hóa đơn VAT, theo dõi công nợ quá hạn, đối soát sao kê ngân hàng tự động.
9. **FR-CRM-09: Quản Lý Chi Phí & Định Mức Ngân Sách:**
   - Kiểm soát hạn mức chi tiêu từng phòng ban, chặn tạo phiếu chi khi vượt ngân sách năm.
10. **FR-CRM-10: Báo Cáo Tài Chính Thời Gian Thực:**
    - Báo cáo kết quả hoạt động kinh doanh (P&L), lưu chuyển tiền tệ (Cashflow), bảng cân đối kế toán.
11. **FR-CRM-11: Quản Trị Sự Kiện & Hội Nghị B2B:**
    - Thiết lập sơ đồ chỗ ngồi VIP (Cinema Map), quét vé QR Code cổng ra vào, phát thông báo nhắc lịch.
12. **FR-CRM-12: Quản Lý Thành Viên & Pháp Nhân:**
    - Thẩm định hồ sơ hội viên doanh nghiệp, cấp tích xanh xác thực danh tính C-Level.
13. **FR-CRM-13: Sàn Thương Mại Điện Tử B2B Marketplace:**
    - Gian hàng số doanh nghiệp, đăng tải hồ sơ năng lực (Capability Deck), nhận báo giá B2B.
14. **FR-CRM-14: Quản Lý Tài Liệu & Kho Tri Thức Số:**
    - Lưu trữ bảo mật trên MinIO S3, mã hóa AES-256, phân quyền đọc/sửa theo chức danh.
15. **FR-CRM-15: Hộp Thư Messenger Doanh Nghiệp:**
    - Chat thời gian thực Socket.IO, lưu trữ vĩnh viễn trên PostgreSQL, chia sẻ tài liệu mật.
16. **FR-CRM-16: Biểu Quyết & Bầu Cử Kỹ Thuật Số:**
    - Cơ chế bỏ phiếu phân tán, kiểm phiếu tức thời, lưu chữ ký số chống gian lận.
17. **FR-CRM-17: Bản Tin & Truyền Thông Nội Bộ:**
    - Soạn thảo WYSIWYG, ghim thông báo khẩn, đo lường tỷ lệ đọc của cán bộ nhân viên.
18. **FR-CRM-18: Quản Trị Gói Tài Trợ & Quyền Lợi:**
    - Theo dõi tiến độ giải ngân tài trợ, đối soát quyền lợi banner, diễn giả, truyền thông.
19. **FR-CRM-19: Tiếp Thị Kỹ Thuật Số Đa Kênh:**
    - Chiến dịch Email Marketing tự động, đo lường tỷ lệ mở (Open Rate) và click (CTR).
20. **FR-CRM-20: Phân Khúc Khách Hàng Mục Tiêu:**
    - Phân loại dữ liệu khách hàng theo ngành nghề, doanh thu, tần suất tương tác.
21. **FR-CRM-21: Danh Mục Ưu Đãi Độc Quyền (Perks):**
    - Cổng đổi điểm thưởng, cấp voucher chiết khấu giữa các đối tác trong mạng lưới.
22. **FR-CRM-22: Ma Trận Phân Quyền RBAC 7x6:**
    - 7 nhóm quyền x 6 hành động, cơ chế bảo vệ quyền sở hữu dữ liệu `canEditRecord`.
23. **FR-CRM-23: Cài Đặt Hệ Thống & Nhận Diện Thương Hiệu:**
    - Cấu hình hotline, tên miền, logo động phát sự kiện cập nhật thời gian thực.
24. **FR-CRM-24: Báo Cáo Lưu Lượng & Nhật Ký Kiểm Toán:**
    - Ghi nhận 100% lịch sử truy cập, thao tác phân quyền, thay đổi số liệu tài chính.
25. **FR-CRM-25: Quản Trị Cơ Cấu Phòng Ban & Bàn Giao Tự Động:**
    - Khối $\rightarrow$ Phòng ban $\rightarrow$ Nhóm chuyên trách, gom và chuyển việc hàng loạt khi nhân sự chuyển công tác.

---

#### Phân Hệ II: Ứng Dụng Di Động ViOne Connect (Native & PWA) (13 Phân Hệ Toàn Năng)

##### FR-APP-01: Header Thương Hiệu Dính (`StickyBrandHeader`)
- **Mô tả:** Cố định trên đỉnh tất cả các màn hình, hiển thị nhận diện thương hiệu mạ vàng đẳng cấp.
- **Thành phần:**
  - Logo vector mạ vàng `ViOneLogo.tsx` tỷ lệ chuẩn 53x20 (không bị méo hình).
  - Lời chào theo thời gian thực: `Chào buổi sáng, HH:mm`, `Chào buổi chiều, HH:mm`, `Chào buổi tối, HH:mm`.
  - Nút chuyển đổi Theme Sáng/Tối vuông 32x32 mạ vàng champagne.
  - Nút micro kích hoạt Trợ lý giọng nói AI.
  - Chuông thông báo đính kèm badge đỏ đếm số lượng thông báo chưa đọc.
- **Tiêu chuẩn UI:** Nền thạch anh mờ `rgba(11, 15, 23, 0.95)` (Dark mode), viền dưới tinh tế `rgba(255, 255, 255, 0.08)`.

##### FR-APP-02: Thẻ Doanh Nhân ViOne & Trạng Thái Định Vị GPS
- **Mô tả:** Thẻ định danh số của người dùng tại đỉnh trang chủ.
- **Thành phần:**
  - Ảnh bìa tỷ lệ 16:9 (`coverBannerImg`) phủ gradient chống chói.
  - Avatar tròn viền vàng đôi 60x60px, huy hiệu mạ vàng `DOANH NHÂN VIONE`.
  - Hiển thị Họ tên, Chức danh, Số điện thoại. Chạm vào thẻ mở Bottom Sheet danh thiếp cá nhân.
  - Thanh định vị GPS (Location Banner): Báo trạng thái chia sẻ vị trí AI, nút `[Bật vị trí]` xin quyền định vị native để AI tìm kiếm đối tác lân cận trong bán kính 5km–20km.

##### FR-APP-03: Bàn Điều Hành Lãnh Đạo & Lịch Trình Hôm Nay 5 Tabs
- **Mô tả:** Trung tâm điều hành thời gian và lịch biểu làm việc của lãnh đạo.
- **Thành phần:**
  - Tiêu đề ngày tháng định dạng chuẩn tiếng Việt: `Thứ Hai, 12 tháng 10`. Nút `Xem lịch >` mở lịch tháng B2B (`ScheduleCalendarModal`).
  - 5 Tabs phân đoạn:
    1. `Tất cả`: Tổng hợp mọi sự kiện, cuộc hẹn, cơ hội và công việc trong ngày.
    2. `Hôm nay (N)`: Lọc các đầu việc và lịch hẹn diễn ra đúng ngày hiện tại.
    3. `Sắp tới (N)`: Lịch trình đối tác và sự kiện hiệp hội trong 7 ngày tới. Khi không có sự kiện sắp tới, hệ thống hiển thị Empty State sang trọng ("Chưa có sự kiện nào sắp diễn ra"), tuyệt đối không fallback lấy sự kiện cũ trong quá khứ.
    4. `Nhắc lịch (N)`: Các cảnh báo quan trọng, gia hạn hội viên, hẹn gặp khách VIP.
    5. `🎙️ Ghi âm (N)`: Danh sách ghi âm giọng nói khoảnh khắc kèm trình phát sóng âm inline wave player (`handleTogglePlayVoice`).
  - Modal Tùy chỉnh Briefing Hôm Nay (`TodayCustomizeSheet`): Đồng bộ 100% với PWA, cho phép lãnh đạo bật/tắt hiển thị từng nhóm thông tin, sắp xếp thứ tự và giới hạn số mục hiển thị.

##### FR-APP-04: Thẻ Giám Sát Vận Hành & Chuyên Cần Nhân Sự C-Level
- **Mô tả:** Trung tâm giám sát kỷ luật và tài chính doanh nghiệp dành riêng cho CEO.
- **Điều kiện hiển thị:** Chỉ tài khoản có cộng đồng doanh nghiệp và có nhân sự trực thuộc (`hasCompanyWithStaff === true`) mới hiển thị thẻ này. Nếu tài khoản cá nhân độc lập, tự động ẩn để tránh gây rối mắt cho CEO.
- **Thành phần:**
  - Đèn xanh nhấp nháy `TRỰC TUYẾN`.
  - Ô 1: *Giờ giấc nhân sự:* Hiển thị `42/45 có mặt - 93.3%` $\rightarrow$ Chạm mở `AttendanceModal`.
  - Ô 2: *Tiến độ nhân sự:* Hiển thị `12 việc - 2 việc trễ` $\rightarrow$ Chạm mở `WorkflowModal`.
  - Ô 3: *Duyệt chi 3 cấp:* Hiển thị `3 chờ ký - 48.5 tr` $\rightarrow$ Chạm mở `ApprovalsModal`.

##### FR-APP-05: Khối Gợi Ý Đối Tác AI Matcher Đa Chiều
- **Mô tả:** Hệ thống trí tuệ nhân tạo phân tích chuỗi cung ứng và đề xuất đối tác B2B.
- **Thành phần:**
  - Tiêu đề `V · GỢI Ý HÔM NAY (AI)` với biểu tượng Sparkles mạ vàng.
  - 2 Dải Filter Chips ngang: Lọc theo không gian (Tất cả, Gần tôi, Cùng TP, Toàn quốc) & Lọc theo ngành nghề (Công nghệ, BĐS, Tài chính, Y tế...).
  - Thẻ đối tác: Avatar thật, Họ tên, Chức danh, Tên công ty, Điểm tương thích `Match Score: 98%`, Lý do kết nối AI phân tích, nút `[Đặt lịch]` và `[Kết nối ngay]`.

##### FR-APP-06: Mạng Lưới Đối Tác, Moments Feed & Khách Hàng CRM B2B 5 Tabs
- **Mô tả:** Quản trị toàn bộ quan hệ thương mại, mạng xã hội khoảnh khắc và phễu khách hàng của doanh nghiệp.
- **Thành phần:**
  - Nút hành động nổi bật `+ Đăng khoảnh khắc` (Vàng Champagne Gold `.bc-cta-gold`) trên đầu màn Mạng lưới mở modal đăng bài tức thì.
  - Dải khoảnh khắc 24h (Stories Strip): Loại bỏ 100% dữ liệu mock tĩnh, chỉ hiển thị khoảnh khắc do chính mình đăng hoặc khoảnh khắc của các đối tác đã kết nối thành công (`accepted` / `connected`). Khi chưa có khoảnh khắc từ bạn bè, hiển thị Empty State sang trọng: *"Khoảnh khắc 24h chỉ hiển thị cho đối tác đã kết nối. Hãy kết nối thêm doanh nhân để xem khoảnh khắc mới!"*.
  - Mạng khoảnh khắc B2B (Moments Feed): Độc lập hoàn toàn với Stories 24h, có thanh soạn thảo "Bạn đang nghĩ gì? Chia sẻ khoảnh khắc...", danh sách bài viết hỗ trợ tương tác Thả tim, Bình luận (`MomentCommentModal`), Chia sẻ. Ảnh chụp trực tiếp từ camera được bảo toàn nguyên vẹn URI gốc (`file://`, `data:`, `blob:`), không revoke blob URL sớm trong quá trình chọn/xem trước để chống lỗi rơi vào placeholder hoặc bị ghi đè bởi ảnh khác.
  - 5 Tabs danh mục chuẩn:
    1. `Mạng lưới`: Danh bạ đối tác B2B đã kết nối, phân loại: Tất cả, Đã kết nối, Chờ duyệt, Gợi ý. Ô tìm kiếm thời gian thực theo tên, công ty, ngành nghề. Hỗ trợ thao tác 1-chạm: Chọn 1 người đã kết nối đánh dấu chuyển thành Khách hàng CRM (`POST /connect-app/customer` tự động map UUID và liên kết thông tin).
    2. `Khách hàng (CRM B2B)`: Pipeline khách hàng 4 bước (Tiếp cận $\rightarrow$ Tư vấn $\rightarrow$ Đàm phán $\rightarrow$ Ký kết), thẻ chỉ số doanh thu, stepper chuyển giai đoạn 1-chạm, chỉ báo sức khỏe deal, touchpoint logs.
    3. `Gợi ý AI`: Danh sách đối tác cần giữ kết nối (Nurture List) kèm phân tích lý do cần chăm sóc.
    4. `Tin nhắn (Messenger)`: Danh mục chat thời gian thực.
    5. `Lời mời`: Quản lý lời mời kết nối đến và đi.
  - Máy quét danh thiếp OCR AI (`CardScanReviewModal` trên Native & `CardScanFlow` trên PWA): Chụp ảnh danh thiếp visit card, AI kết hợp OCR.space Engine 2 và bộ trích xuất biểu thức chính quy tiếng Việt chuyên sâu `extractVietnameseCardEntities`, bóc tách đầy đủ và chuẩn xác: Họ tên, Số điện thoại, Chức danh, Tên công ty, Email, Website và Địa chỉ; Triệt tiêu hoàn toàn mã fallback dummy hardcode (`0900000000` / `Thông tin danh thiếp`); tự động làm sạch số điện thoại và cung cấp liên kết Zalo trực tiếp (`https://zalo.me/${cleanPhone}`) với nút Zalo vàng Champagne Gold (`#D8B282`) chữ đen đậm (`text-slate-950 font-bold`); Lưu vào danh bạ ứng dụng ở mục Danh thiếp đã quét; Xuất file vCard `.vcf` lưu trực tiếp xuống danh bạ điện thoại thu gọn strictly chỉ gồm: Họ và tên (`FN`, `N`), Chức danh (`TITLE`), và Số điện thoại (`TEL;TYPE=CELL,VOICE`); Trang bị nút điều khiển camera và chip trạng thái phủ màu Obsidian Quartz (`#141C2B` / `#1A2234`) phối hợp viền và chữ vàng Champagne Gold, loại bỏ hoàn toàn nút trạng thái màu đen và lỗi chữ trắng trên nền sáng.
  - Banner quét danh bạ điện thoại tìm bạn bè kiểu Zalo (`ContactsDiscoveryModal`).

##### FR-APP-07: Hộp Thư Messenger 0ms & Thẻ Đề Xuất Hẹn 1-1 Ghim Lịch
- **Mô tả:** Kênh giao tiếp tức thời bảo mật cao chuẩn C-Level.
- **Thành phần:**
  - 4 Danh mục hội thoại: `Tất cả` (chứa toàn bộ hội thoại đã gửi/nhận), `Chưa đọc`, `Nhóm`, `Tin nhắn chờ`.
  - Khởi tạo và đồng bộ hội thoại chuẩn CSDL: Khi mở chat từ danh bạ/đối tác, hệ thống tự động gọi API `POST /connect-app/dm/threads` để nhận UUID thread thật từ PostgreSQL. Truy vấn trực tiếp `public.vione_users`, `public.user_profiles` và `public.business_identities` hiển thị đầy đủ Họ tên thật, Avatar thật, Chức danh và Tên công ty đối tác.
  - Sắp xếp tin nhắn mới nhất lên đầu (`lastMessageAt DESC`).
  - Khung chat `ChatThreadModal`: Phản hồi tức thì 0ms, tải toàn bộ lịch sử tin nhắn cũ qua `GET /connect-app/dm/threads/:threadId/messages`, bong bóng chat Amber Gold (cá nhân) vs Slate Grey (đối tác), tick trạng thái 2 chiều.
  - Thẻ đề xuất hẹn gặp 1-1 tương tác (`OpportunityMeetingProposalCard`): Nút **`[⚡ ĐỒNG Ý HẸN]`** (tự động ghim lịch vào Trang chủ và gửi thông báo 2 bên).
  - Cuộc gọi thoại & video call WebRTC bảo mật cao, khử tiếng vọng.

##### FR-APP-08: Nút V Trung Tâm 3D & Bảng Điều Khiển VActionSheet
- **Mô tả:** Nút hành động trung tâm 1-chạm kích hoạt toàn bộ tính năng cốt lõi.
- **Thành phần:**
  - Nút V dập nổi 3D vector `VIconMark.tsx` đường kính 58px, viền kim loại kép mạ vàng champagne, bóng đổ phát quang.
  - Bảng điều khiển nổi (`VActionSheet`) chiếm 85% chiều cao màn hình:
    * Thẻ danh tính doanh nhân thượng lưu với chữ ký chìm V.
    * 5 Hành động cốt lõi: Đưa mã QR, Chạm thẻ NFC, Quét mã QR, Quét danh thiếp OCR (bóc tách tối thiểu: Họ tên, Số điện thoại, Chức danh & liên kết Zalo), Ghi chú cuộc gặp đăng bài Moments Feed (`PostMomentModal`).
    * 3 Ô lối tắt: Danh thiếp số, Ví thẻ, Bảo mật riêng tư.
    * Bàn làm việc lãnh đạo: Giao việc nhân sự (`AssignTaskModal`), Tiến độ nhân viên (`StaffDailyActivityModal`), Điểm danh chấm công (`AttendanceModal`), Quy trình doanh nghiệp (`WorkflowModal`), Ký duyệt văn bản (`ApprovalsModal`).

##### FR-APP-09: Mô Hình Cộng Đồng Hợp Nhất All-in-One & Mời Thành Viên Kết Nối Chuẩn API
- **Mô tả:** Mô hình hợp nhất toàn diện quản trị nội bộ và giao thương B2B với chính sách bảo mật thành viên chặt chẽ.
- **Thành phần:**
  - Hợp nhất 2 mô hình cũ thành 1 mô hình toàn năng duy nhất với 6 phân hệ: Công việc, Giám sát, Cơ hội B2B, Bản tin, Sự kiện, Thành viên.
  - Xóa sạch cộng đồng cũ, nghiêm cấm tuyệt đối hardcode tự động thêm thành viên khi tạo mới cộng đồng.
  - Quy chuẩn mời thành viên (`CommunityInviteSheet` trên PWA & `CommunityInviteModal` trên Native): Chỉ cho phép mời những người đã kết nối trong mạng lưới thông qua API `POST /connect-app/community/:communityId/invites`.
  - Thông báo phê duyệt thời gian thực: Tài khoản được mời nhận thông báo chuông (`business_notifications`) kèm quyền lựa chọn "Đồng ý tham gia" (`POST /connect-app/community/invites/:inviteRef/accept`) hoặc "Từ chối" (`POST /connect-app/community/invites/:inviteRef/decline`).
  - Gói bản quyền cộng đồng: Người dùng đăng ký gói hoặc dùng thử 30 ngày free được quyền tạo 1 cộng đồng của riêng mình.
  - Gating phân hệ giao việc tại Trang chủ: Chỉ hiển thị khi có gói cộng đồng hoặc dùng thử 30 ngày.
  - Quy trình nhận việc 1-chạm: Nút vàng nổi bật **`[⚡ TIẾN HÀNH NHẬN VIỆC]`** chuyển trạng thái từ `assigned` sang `in_progress`, gửi thông báo đến Giám đốc.

##### FR-APP-10: Phân Quyền Phòng Ban Chuyên Trách 5 Cờ Quyền
- **Mô tả:** Phân quyền dữ liệu và nghiệp vụ chặt chẽ theo cơ cấu tổ chức.
- **Thành phần:**
  - Khối $\rightarrow$ Phòng ban $\rightarrow$ Nhóm chuyên trách (`vione_community_departments`).
  - Kiểm soát 5 cờ quyền cho từng nhân sự:
    1. `canAssign`: Quyền giao việc mới trong phòng ban.
    2. `canAccept`: Quyền nhận việc được giao (`[⚡ TIẾN HÀNH NHẬN VIỆC]`).
    3. `canReport`: Quyền nộp báo cáo nghiệm thu kèm file Word/Excel.
    4. `canHandover`: Quyền điều phối, chuyển giao việc sang nhân sự khác.
    5. `canMeet`: Quyền khởi tạo và tham gia phòng họp trực tuyến của ban.
  - Banner cảnh báo khi xem phòng ban ngoài thẩm quyền: `🔒 Chế độ chỉ xem - Bạn không thuộc phòng ban này` và ẩn các nút thao tác.

##### FR-APP-11: Cơ Chế Bàn Giao Tự Động (Auto-Handover Engine)
- **Mô tả:** Chuyển giao công việc tức thì khi nhân sự thay đổi vị trí hoặc thôi việc.
- **Thành phần:**
  - Nút **`[🔄 Chuyển việc]`** trực tiếp trên thẻ công việc cho phép chọn nhân sự tiếp nhận và nhập lý do bàn giao.
  - Lưu vết kiểm toán bất biến trong mảng `handover_history` (ai chuyển, chuyển cho ai, thời gian, lý do).
  - Tự động đẩy thông báo thời gian thực qua WebSocket và Push Notification đến nhân sự mới.

##### FR-APP-12: Họp Ban Trực Tuyến 1-Chạm & Import/Export Excel/Word
- **Mô tả:** Tích hợp phòng họp video tức thì và công cụ xử lý tệp văn phòng.
- **Thành phần:**
  - Nút **`[📹 Họp ban 1-chạm]`** mạ vàng trên thanh công cụ điều hành công việc, kích hoạt phòng họp C-Level WebRTC và gửi thông báo triệu tập khẩn cấp.
  - Người giao việc: Nút `[📊 Excel]` nạp công việc hàng loạt từ tệp `.xlsx`, `.csv`; Nút `[📄 Word]` nạp đề án nhiệm vụ từ `.docx`.
  - Người nhận việc: Nút `[Nộp báo cáo]` cho phép đính kèm song song cả tệp thuyết minh Word (`.docx`) và tệp bảng tính số liệu Excel (`.xlsx`).

##### FR-APP-13: Trang Cá Nhân "Tôi" - Danh Tính Số Titanium, Showcase & 8 Ngôn Ngữ
- **Mô tả:** Hồ sơ doanh nhân thượng lưu và trung tâm thiết lập tài khoản.
- **Thành phần:**
  - Thẻ định danh số Titanium 3D: Nút `[Mã QR của tôi]` và `[Chạm thẻ NFC]`.
  - Card liên hệ nhanh 5 kênh: Điện thoại, Email, Viber, WhatsApp, Telegram.
  - Khối trưng bày năng lực doanh nghiệp (Showcase): Lĩnh vực kinh doanh & Khách hàng tiêu biểu.
  - Bộ chuyển đổi 8 ngôn ngữ quốc tế (VI, EN, KM, MY, LO, JA, KO, ZH).
  - Trung tâm bảo mật tài khoản 2FA, Quản lý thẻ thông minh NFC, Ví thẻ lưu vCard, Cài đặt quyền riêng tư.

##### FR-APP-14: Siêu Trợ Lý Điều Khiển Giọng Nói AI Copilot 6.0
- **Mô tả:** Trợ lý điều khiển bằng giọng nói tự nhiên 100%.
- **Thành phần:**
  - Dải sóng âm 16-Bar Holographic kết hợp vòng hào quang thở Breathing Aura Champagne Gold.
  - Bóc tách lệnh thoại tiếng Việt tự động: Chấm công, Duyệt chi, Giao việc, Xem tiến độ, Xem lịch trình, Mở mã QR cá nhân, Quét mã QR, Chuyển tab.
  - Tự động tạo và xuất báo cáo tài chính, tiến độ ra các tệp Excel (`.xlsx`), Word (`.docx`), PDF (`.pdf`).

---

### PHẦN 4: QUY CHUẨN KỸ THUẬT CÂN ĐỐI UI/UX, TEXT, ICON & SAFE AREA INSETS TRÊN MOBILE NATIVE APP

1. **Chuẩn Hóa Safe Area Insets (Gesture Nav & Dynamic Island):**
   - Thanh điều hướng `CustomBottomTabBar` bắt buộc sử dụng `useSafeAreaInsets()` từ `react-native-safe-area-context`.
   - Tính toán động: `bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 8)`.
   - Chiều cao thanh điều hướng: `barHeight = 58 + bottomInset`.
   - Nút V trung tâm nổi cân xứng tuyệt đối, không bị lệch hoặc đè lên Home Indicator trên iPhone hay vạch điều hướng cử chỉ trên Android.
2. **Quy Chuẩn Phân Cấp Typography & Text Balance:**
   - Tiêu đề chính (Page Title): `fontSize: 20`, `fontWeight: "700"`, `lineHeight: 26`.
   - Tiêu đề phụ (Card Headline): `fontSize: 16-18`, `fontWeight: "700"`, `lineHeight: 22`.
   - Nhãn danh mục (Section Label): `fontSize: 11-12`, `fontWeight: "800"`, `letterSpacing: 0.8`, `textTransform: "uppercase"`.
   - Nội dung mô tả (Body Text): `fontSize: 12.5-13.5`, `color: #94A3B8`, `lineHeight: 18`.
   - Nhãn phụ tab điều hướng: `fontSize: 10.5`, `fontWeight: "500"` (thường) / `"700"` (active), `letterSpacing: 0.1`, căn giữa tuyệt đối.
3. **Quy Chuẩn Kích Thước & Tỷ Lệ Icon:**
   - Tab Bar Icons: `size: 20`, căn giữa trong hộp chứa `minHeight: 28`.
   - Quick Action Icons: `size: 17-18`.
   - Inline Meta Icons (MapPin, Phone, Clock): `size: 12-13`.
   - Nút V Vector Svg: `size: 32` căn giữa trong vòng tròn đường kính 58px.

---

### PHẦN 5: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

#### 5.1 Hiệu Năng Hệ Thống (Performance)
- Thời gian phản hồi API: $\le 200\text{ms}$ đối với 95% request.
- Tốc độ tải màn hình khởi động (Cold Start) $\le 1.8$ giây trên điện thoại Android và iOS.
- FPS cuộn danh sách (FlatList/ScrollView) duy trì ổn định $\ge 58$ FPS.

#### 5.2 An Toàn Thông Tin & Bảo Mật (Security & Compliance)
- Xác thực qua JWT Access Token (15 phút) kết hợp Refresh Token (7 ngày) lưu trong AsyncStorage/SecureStore.
- Băm mật khẩu bằng Argon2id/Bcrypt 12 vòng lặp, mã hóa AES-256 đối với tài liệu nhạy cảm.
- Kiểm soát phân quyền nghiêm ngặt tại Backend NestJS Guard, không phụ thuộc vào ẩn/hiện phía client.
- Quản trị tài khoản cốt lõi: Làm sạch toàn bộ tài khoản thử nghiệm trên CSDL PostgreSQL, chỉ duy trì 2 tài khoản quản trị tiêu chuẩn: `admin@connect.vn` (Quản trị viên ViOne Connect) và `crm@vione.vn` (Quản trị viên CRM ViOne).

#### 5.3 Tính Khả Dụng & Trải Nghiệm Thượng Lưu (Usability)
- Giao diện 2 chế độ: Dark Luxury Obsidian (`#0B0F17`) và Light Pearl (`#FFFFFF`), tông màu điểm xuyết Champagne Gold (`#D8B282`).
- 100% các nút bấm quan trọng có kích thước vùng chạm tối thiểu $44\text{px} \times 44\text{px}$ theo tiêu chuẩn Apple HIG và Google Material Design.

#### 5.4 Độ Tin Cậy & Khôi Phục Thảm Họa (Reliability & DR)
- Uptime mục tiêu: $99.9\%$.
- Sao lưu CSDL PostgreSQL định kỳ 6 tiếng/lần, lưu trữ đa vùng tại MinIO S3.

---

### PHẦN 6: GIAO TIẾP VÀ TÍCH HỢP HỆ THỐNG (SYSTEM INTERFACES & APIS)

1. **Cổng Thanh Toán VietQR / PayOS:** Tích hợp Webhook nhận thông báo biến động số dư tức thời, tự động gạch nợ hóa đơn trong 1 giây.
2. **Hệ Thống Lưu Trữ MinIO S3:** Cung cấp Pre-signed URL cho các tác vụ tải lên ảnh bìa, avatar, tài liệu Word/Excel, video họp ban.
3. **Hạ Tầng Giao Tiếp WebRTC & Socket.IO:** Máy chủ phân tán truyền tín hiệu thoại, video cuộc gọi P2P và thông báo đẩy (Push Notifications).
4. **Hệ Thống Trí Tuệ Nhân Tạo AI Copilot:** Kết nối API phân tích ngôn ngữ tự nhiên, OCR bóc tách danh thiếp và thuật toán ghép cặp đối tác B2B Matcher.
5. **Hệ Thống Email Chào Mừng Kích Hoạt (SMTP Google):** Gửi email thông báo tạo tài khoản thành công tự động từ `vumikasa6@gmail.com` qua Google SMTP SSL (`smtp.gmail.com:465`) khi người dùng đăng ký có email.

---

### PHẦN 7: MA TRẬN TRUY XUẤT NGUỒN GỐC (TRACEABILITY MATRIX) & TIÊU CHUẨN NGHIỆM THU

| Mã Yêu Cầu (FR) | Tên Phân Hệ | Tệp Mã Nguồn Triển Khai | API Backend Tương Ứng | Trạng Thái Thẩm Định |
|---|---|---|---|:---:|
| FR-APP-01 | Sticky Brand Header | `StickyBrandHeader.tsx` | N/A (Client Component) | Đạt 100% |
| FR-APP-02 | Thẻ Doanh Nhân & GPS | `EntrepreneurCard.tsx` | `GET /connect-app/me/card` | Đạt 100% |
| FR-APP-03 | Lịch Trình Hôm Nay 5 Tabs | `TodayEditorialSection.tsx`| `GET /connect-app/home` | Đạt 100% |
| FR-APP-04 | Giám Sát Vận Hành C-Level | `ExecutiveCenterSection.tsx`| `GET /connect-app/community/company-staff-status` | Đạt 100% |
| FR-APP-05 | Gợi Ý Đối Tác AI Matcher | `AiPartnersSection.tsx` | `GET /relationship-intelligence/recommendations` | Đạt 100% |
| FR-APP-06 | Mạng Lưới Đối Tác & CRM | `NetworkScreen.tsx` | `GET /connect-app/network` | Đạt 100% |
| FR-APP-07 | Messenger 0ms & Hẹn 1-1 | `ChatThreadModal.tsx` | `POST /chat/threads/:id/messages` | Đạt 100% |
| FR-APP-08 | Nút V & VActionSheet | `VActionSheet.tsx` | Multiple REST APIs | Đạt 100% |
| FR-APP-09 | Cộng Đồng Hợp Nhất & Gói 30d | `CommunityScreen.tsx` | `POST /community/subscription/trial` | Đạt 100% |
| FR-APP-10 | Phân Quyền Phòng Ban RBAC | `DepartmentPermissionsModal.tsx`| `POST /department-members/assign` | Đạt 100% |
| FR-APP-11 | Cơ Chế Bàn Giao Tự Động | `WorkflowModal.tsx` | `POST /tasks/:id/handover` | Đạt 100% |
| FR-APP-12 | Họp Ban 1-Chạm & Excel/Word | `WorkflowModal.tsx` | `POST /meetings/instant-room` | Đạt 100% |
| FR-APP-13 | Trang Cá Nhân "Tôi" | `ProfileScreen.tsx` | `GET /connect-app/me` | Đạt 100% |
| FR-APP-14 | Trợ Lý Giọng Nói AI Copilot| `ViOneVoiceAssistantModal.tsx` | `POST /api/ai/chat` | Đạt 100% |
| FR-APP-15 | Kéo Thả Di Chuyển & Cắt Ảnh | `ImagePanCropModal.tsx` | N/A (Client Pan/Zoom/Crop) | Đạt 100% |
| FR-APP-16 | Trang Profile Công Khai Khi Quét QR | `p.$identifier.tsx` | `GET /connect-app/public/profile/:id` | Đạt 100% |
| FR-APP-17 | Phân Lập Cổng 5445 (PWA) & 5446 (CRM) | `nginx.conf` & `__root.tsx` | N/A (Subdomain https://vione.viconnect.vn) | Đạt 100% |

---
*Tài liệu SRS Master 7.1 được chuẩn hóa và phê duyệt bởi Ban Kiến Trúc Công Nghệ VioConnect.*
