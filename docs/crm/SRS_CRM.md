# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - PHÂN HỆ WEB CRM VIONE ENTERPRISE
## SOFTWARE REQUIREMENTS SPECIFICATION — USE CASES & SYSTEM BEHAVIOR (CRM PLATFORM)

> **Mã tài liệu:** `VIONE-SRS-CRM-02`  
> **Phiên bản:** `6.0.0 (Cập nhật Tháng 10/2026)`  
> **Phân hệ:** Quản trị Doanh nghiệp, Hiệp hội & Vận hành Web CRM (`apps/vione_app_fe` build crm_platform)  
> **Nguyên tắc tài liệu:** KHÔNG CLEAR TEXT CŨ. Khi có thay đổi luồng hoặc yêu cầu sửa chức năng, Agent phải tìm đúng Use Case (UC-CRM-xxx) tương ứng để cập nhật, đánh dấu phiên bản và ghi nhận chi tiết.

---

## 1. DANH MỤC USE CASES (USE CASE MATRIX)

| Mã Use Case | Tên Chức Năng | Tác Nhân (Actors) | Mức Ưu Tiên | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- |
| **UC-CRM-01** | Đăng nhập Quản trị viên & Phân quyền RBAC | Super Admin, Manager, Staff | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-02** | Quản lý Danh sách & Hồ sơ Hội viên Doanh nhân | Quản trị viên CRM | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-03** | Thẩm định & Phê duyệt Đơn gia nhập Hiệp hội | Ban Thẩm định, Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-04** | Quản trị Quy trình BPMN 2.0 & Kanban Công việc (`/workflow`) | Quản lý dự án, Nhân sự | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-05** | Giám sát Tải Làm Việc & Bản đồ nhiệt Nhân sự (`/workload`) | Giám đốc, HR Manager | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-06** | Giám sát Bảng Chấm Công Thời Gian Thực (`/attendance`) | Quản trị nhân sự | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-07** | Quản lý Đơn Xin Nghỉ Phép & Phê duyệt OT | Trưởng phòng, Nhân viên | P1 - Cao | Hoạt động |
| **UC-CRM-08** | Khởi tạo & Phê duyệt Tờ trình Chi 3 cấp (`/payment-approvals`)| Maker, Checker, Approver | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-09** | Sinh mã VietQR Napas 24/7 Gạch nợ Tự động | Kế toán trưởng, CEO | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-10** | Quản trị Pipeline Khách hàng Tiềm năng (Leads CRM) | Trưởng phòng Kinh doanh | P1 - Cao | Hoạt động |
| **UC-CRM-11** | Quản trị Doanh nghiệp Số, Tree Menu Sidebar, Quản lý Nhân sự & Giao việc | Chủ Doanh nghiệp, Ban Giám Đốc | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-12** | Quản trị Giới hạn Nhân sự & Gói Cước Doanh nghiệp (Slot Control) | Super Admin, Community Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-13** | Ma trận Phân quyền Động 4 cấp Nền tảng (Granular RBAC System) | Super Admin, Community Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-14** | Trung tâm Thống kê Toàn diện 5 Phân hệ & Giao việc Đồng loạt | Ban Lãnh đạo, Quản lý, Super Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-15** | Tự Động Gửi Email Thông Tin Lợi Ích Gói & Link Truy Cập CRM Khi Mua Gói | Khách hàng Doanh nghiệp, Hệ thống Mail | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-16** | Phân Định Giao Diện CRM Chuẩn Theo Role Quyền (Super Admin vs Doanh Nghiệp Mua Gói) | Doanh nghiệp mua gói, Ban Quản trị | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-17** | Giám Sát Chi Tiết Mức Độ Hoạt Động Doanh Nghiệp ViOne Platform & Quản Lý Khách Hàng Nền Tảng | Super Admin Nền tảng | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-18** | Phân Quyền Hai Tầng Hệ Sinh Thái ViOne (Tenant Internal RBAC & Platform Departments) | Chủ Doanh nghiệp, Nhân sự, Super Admin & Bộ phận ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-19** | Cấp Tài Khoản Nhân Viên Nội Bộ ViOne, Phân Quyền Đa Nhóm & Phản Ứng Rerender Tức Thì | Quản Trị Viên ViOne, Nhân Viên ViOne | P0 - Bắt buộc | Hoạt động |

---

## 2. CHI TIẾT CÁC USE CASE CỐT LÕI

### UC-CRM-01: Đăng nhập Quản trị viên & Phân quyền RBAC
* **Tác nhân:** Super Admin, Quản lý bộ phận, Kế toán, Nhân sự.
* **Tiền điều kiện:** Người dùng truy cập subdomain `https://crm.viconnect.vn/` hoặc cổng 5446.
* **Luồng sự kiện chính:**
  1. Người dùng mở trang đăng nhập quản trị CRM.
  2. Nhập Email/Tên đăng nhập và Mật khẩu quản trị.
  3. Hệ thống gọi API `POST /api/auth/crm/login`.
  4. Backend kiểm tra quyền (Roles: `SUPER_ADMIN`, `DEPT_HEAD`, `ACCOUNTANT`, `HR_MANAGER`).
  5. Cấp Access Token JWT kèm danh sách permissions, điều hướng vào Dashboard điều hành CRM tương ứng.
* **Ràng buộc:** CẤM tuyệt đối truy cập `/connect-app` trên domain CRM, hệ thống tự động 301 Redirect sang `https://vione.viconnect.vn/connect-app`.

---

### UC-CRM-04: Quản trị Quy trình BPMN 2.0 & Kanban Công việc (`/workflow`)
* **Tác nhân:** Quản lý dự án, Trưởng bộ phận, Nhân viên.
* **Luồng sự kiện chính:**
  1. Người dùng truy cập màn hình `/workflow`.
  2. Hệ thống tải danh sách nhiệm vụ từ API `GET /api/operations/workflow/tasks`.
  3. Hiển thị bảng Kanban 4 cột: [Cần làm / Backlog] [Đang làm / In Progress] [Đang nghiệm thu / In Review] [Hoàn thành / Done].
  4. Thao tác Tạo việc mới:
     - Bắt buộc điền Tên công việc, Người phụ trách (Assignee), Hạn chót (Deadline) theo quy tắc **BR-WRK-01**.
     - Bắt buộc kiểm tra giới hạn WIP Limit: Nếu nhân sự đã có 5 việc đang làm trên cột In Progress, hệ thống chặn tạo mới hoặc kéo thả và cảnh báo quá tải theo **BR-WRK-06**.
  5. Thao tác Cập nhật tiến độ:
     - Người phụ trách cập nhật checklist các đầu việc con.
     - Hệ thống chặn chuyển sang Done nếu checklist $< 100\%$ theo **BR-WRK-07**.
  6. Xử lý Quá hạn:
     - Nếu ngày hiện tại vượt quá Deadline, thẻ công việc tự động phát xung viền đỏ phát sáng (Glowing Red Pulse) theo **BR-WRK-02**.
* **Dữ liệu thực:** 100% dữ liệu nhiệm vụ lấy từ CSDL PostgreSQL qua NestJS, tuyệt đối không hardcode mảng tasks giả lập.

---

### UC-CRM-05: Giám sát Tải Làm Việc & Bản đồ nhiệt Nhân sự (`/workload`)
* **Tác nhân:** Giám đốc (CEO), Trưởng phòng Nhân sự (HR).
* **Luồng sự kiện chính:**
  1. Người dùng truy cập màn hình `/workload`.
  2. Client gọi API `GET /api/operations/workload`.
  3. Hệ thống kết xuất Bản đồ nhiệt khối lượng công việc (Workload Heatmap):
     - Ma trận 2 chiều: Trục dọc là danh sách nhân sự theo phòng ban; trục ngang là các ngày trong tuần.
     - Tính tổng giờ làm việc lũy kế trong tuần của từng cá nhân.
     - Nếu tổng giờ $> 45\text{h/tuần}$, hệ thống tự động đổi màu ô thành đỏ rực và kích hoạt nhãn cảnh báo **"Quá tải"** theo **BR-WRK-14**.
  4. Hệ thống đề xuất gợi ý: Chạm vào nhân sự quá tải, hệ thống gợi ý danh sách các nhân viên cùng chuyên môn đang có khối lượng giờ $< 30\text{h/tuần}$ để phân bổ lại nhiệm vụ.

---

### UC-CRM-08: Khởi tạo & Phê duyệt Tờ trình Chi 3 cấp (`/payment-approvals`)
* **Tác nhân:** Maker (Nhân viên), Checker (Kế toán trưởng), Approver (CFO / CEO).
* **Luồng sự kiện chính:**
  1. Người dùng Maker bấm "+ Tạo tờ trình chi mới":
     - Điền nội dung chi phí, số tiền, đính kèm hóa đơn chứng từ, thông tin thụ hưởng (Số tài khoản, Ngân hàng).
     - Hệ thống tự động kiểm tra khử trùng hóa đơn theo **BR-FIN-07** (số hóa đơn, ngày phát hành, MST).
  2. Phân luồng thẩm quyền tự động theo **BR-FIN-02**:
     - Số tiền $< 5.000.000$ đ: Trưởng bộ phận duyệt.
     - Số tiền $5.000.000 - 20.000.000$ đ: Giám đốc Tài chính (CFO) duyệt.
     - Số tiền $> 20.000.000$ đ: Tổng Giám Đốc (CEO) duyệt.
  3. Kế toán trưởng (Checker) kiểm tra chứng từ và bấm "Soát xét hợp lệ".
  4. Lãnh đạo cấp thẩm quyền (Approver) kiểm tra và bấm "Ký số & Phê duyệt".
  5. Sau khi ký duyệt, hệ thống kích hoạt tức thì API `GET /api/operations/finance/approvals/:id/qr` sinh mã VietQR Napas 24/7 gạch nợ tự động trong vòng 1 giây theo **BR-FIN-06**.

---

### UC-CRM-11: Quản trị Doanh nghiệp Số, Tree Menu Sidebar, Quản lý Nhân sự & Giao việc
* **Tác nhân:** Chủ Doanh Nghiệp (Owner), Ban Giám Đốc, Quản trị viên Doanh nghiệp.
* **Mã Use Case:** `UC-CRM-11` (Bổ sung Tháng 10/2026 theo yêu cầu vận hành thực tế).
* **Tiền điều kiện:** 
  - Người dùng truy cập hệ thống CRM ViOne (`apps/vione_app_fe`).
  - **Quy tắc điều kiện hiển thị Doanh nghiệp (STRICT RULE)**: CHỈ KHI NÀO người dùng đã đăng ký mua gói giải pháp **ViOne Platform** (tồn tại bản ghi hoạt động trong `public.vione_community_subscriptions` với `status = 'active'` và `expires_at > now()`) thì chức năng doanh nghiệp mới có dữ liệu.
* **Luồng sự kiện chính:**
  1. **Kiểm tra trạng thái gói ViOne Platform**:
     - Client truy cập `/companies` hoặc nạp Sidebar: Gọi API `GET /api/companies/subscription-status`.
     - Nếu chưa mua gói (`hasSubscription = false`):
       * Trên Sidebar (`EnterpriseTreeMenu.tsx`): Nhánh Doanh nghiệp hiển thị huy hiệu "Khóa" màu hổ phách và thẻ cảnh báo "Yêu cầu gói ViOne Platform" kèm nút bấm "Đăng ký gói ngay".
       * Trên trang danh bạ `/companies`: Hiển thị Empty State sang trọng với thông báo trung thực từ CSDL và nút CTA "Đăng Ký Gói ViOne Platform Ngay".
       * Bấm nút sẽ mở `SubscribePackageModal.tsx` cho phép chọn gói Dùng thử 30 ngày hoặc Gói năm. Gọi `POST /api/companies/subscribe-package` để ghi nhận vào `public.vione_community_subscriptions`.
     - Nếu đã mua gói (`hasSubscription = true`):
       * Hiển thị danh sách doanh nghiệp thực tế từ bảng `public.companies`.
  2. **Cấu trúc Tree Menu Sidebar Doanh nghiệp (`EnterpriseTreeMenu.tsx`)**:
     - Các doanh nghiệp của người dùng được nhóm chung lại theo dạng cây (Tree View) trên Sidebar.
     - Mỗi doanh nghiệp gồm 3 nhánh con:
       * **Quản lý nhân viên** (`/companies/:companyId?tab=employees`): Quản lý đội ngũ nhân sự thực tế.
       * **Giao việc** (`/companies/:companyId?tab=tasks`): Phân công và theo dõi tiến độ công việc.
       * **Hồ sơ & Giới thiệu** (`/companies/:companyId?tab=overview`): Thông tin pháp lý, MST, lĩnh vực.
  3. **Phân hệ Quản lý Nhân sự thực (`CompanyEmployeesTab.tsx`)**:
     - Tải danh sách nhân sự từ `GET /api/companies/:companyId/employees` (truy vấn `public.company_employees`).
     - Hiển thị Họ tên, Chức vụ, Phòng ban, Email, Số điện thoại, Số đầu việc đang phụ trách.
     - Thêm mới nhân sự: Gọi `POST /api/companies/:companyId/employees` lưu vào PostgreSQL.
     - Xóa nhân sự: Gọi `DELETE /api/companies/:companyId/employees/:employeeId`.
     - Chuyển nhanh sang giao việc: Nút "Giao việc" tự động chuyển sang tab Giao việc và điền sẵn nhân sự này.
  4. **Phân hệ Giao việc & Phân công nhiệm vụ (`CompanyTasksTab.tsx`)**:
     - Tải danh sách công việc từ `GET /api/companies/:companyId/tasks` (truy vấn `public.company_tasks`).
     - Thống kê thời gian thực: Tổng đầu việc, Chờ nhận việc, Đang triển khai, Đã hoàn thành.
     - Bộ lọc tìm kiếm và trạng thái (`assigned`, `in_progress`, `completed`, `cancelled`).
     - Giao việc mới: Gọi `POST /api/companies/:companyId/tasks` (tiêu đề, mô tả, nhân viên phụ trách, độ ưu tiên, hạn hoàn thành, thông tin khách hàng liên quan).
     - Cập nhật tiến độ tức thì: Nút nhanh đổi trạng thái sang "Đang làm" hoặc "Hoàn thành" gọi `PATCH /api/companies/:companyId/tasks/:taskId/status`.
* **Quy chuẩn dữ liệu:** Tuyệt đối không mock hay fake dữ liệu. 100% dữ liệu nhân sự, công việc và gói cước đồng bộ trung thực từ PostgreSQL.

---

### UC-CRM-12: Quản trị Giới hạn Nhân sự & Gói Cước Doanh nghiệp (License & Slot Control)
* **Tác nhân:** Super Admin (Tầng 1), Community Admin / Chủ Doanh nghiệp (Tầng 2).
* **Mục tiêu:** Kiểm soát số lượng nhân sự tối đa được phép thêm vào cộng đồng/doanh nghiệp dựa trên gói cước đã thanh toán.
* **Quy tắc nghiệp vụ:**
  1. Super Admin cấu hình danh mục gói cước trong bảng `public.vione_subscription_packages`:
     - Free Starter: Giới hạn tối đa 10 slots nhân sự.
     - Business Pro: Giới hạn tối đa 50 slots nhân sự.
     - Enterprise VIP: Giới hạn tối đa 200 slots nhân sự.
  2. Khi cộng đồng đăng ký hoặc gia hạn gói, `max_slots` được cập nhật đồng bộ vào `public.vione_community_subscriptions`.
  3. Khi Community Admin thêm mới nhân sự (`POST /api/companies/:id/employees`), Backend kiểm tra `currentCount >= maxSlots`:
     - Nếu đã đạt hoặc vượt ngưỡng: Backend từ chối với mã lỗi 400 Bad Request kèm thông điệp: *"Đã đạt giới hạn tối đa X nhân sự của gói dịch vụ hiện tại. Vui lòng nâng cấp gói để thêm thành viên!"*.
     - Nếu còn slot: Ghi nhận nhân sự vào `public.company_employees`.
  4. Giao diện `CompanyEmployeesTab.tsx`: Hiển thị thanh tiến trình trực quan (Thước đo Slot sử dụng), tỷ lệ %, số slot còn lại và cảnh báo nâng cấp gói khi đạt trên 80% dung lượng.

---

### UC-CRM-13: Ma trận Phân quyền Động 4 cấp Nền tảng (Granular Dynamic RBAC System)
* **Tác nhân:** Super Admin (Quản trị toàn hệ thống), Community Admin (Quản trị doanh nghiệp nội bộ).
* **Mục tiêu:** Thay thế toàn bộ dữ liệu mock/hardcode bằng hệ thống quyền và vai trò động lưu trữ 100% trong PostgreSQL.
* **Cấu trúc dữ liệu:**
  - Bảng vai trò: `public.platform_roles` (Hệ thống định nghĩa sẵn 4 vai trò: `super_admin`, `community_admin`, `manager`, `staff`; hỗ trợ tạo vai trò tùy chỉnh).
  - Bảng quyền hạn: `public.platform_permissions` (27 quyền hạt nhân chia theo 8 nhóm chức năng: `tasks`, `attendance`, `employees`, `roles`, `finance`, `statistics`, `subscriptions`, `settings`).
  - Bảng liên kết ma trận: `public.platform_role_permissions`.
* **Luồng xử lý:**
  1. Quản trị viên truy cập màn hình `/platform/permissions`.
  2. Giao diện tải ma trận quyền từ API `GET /api/roles/permissions-matrix`.
  3. Quản trị viên có thể bật/tắt (toggle) từng quyền cụ thể cho từng vai trò trên ma trận lưới trực quan.
  4. Bấm "Lưu thay đổi ma trận": Giao diện gọi API `PUT /api/roles/:id/permissions` cập nhật tức thì vào CSDL.
  5. Hỗ trợ tạo Role mới: Gọi `POST /api/roles` và gán quyền hạt nhân ngay trên giao diện.

---

### UC-CRM-14: Trung tâm Thống kê Toàn diện 5 Phân hệ & Giao việc Đồng loạt
* **Tác nhân:** Ban Lãnh đạo, Trưởng bộ phận, Super Admin.
* **Mục tiêu:** Cung cấp bức tranh toàn cảnh về hiệu suất vận hành, nhân sự, tài chính, cơ hội kinh doanh và tăng trưởng nền tảng.
* **5 Miền thống kê chuyên sâu (`/statistics`):**
  1. **Vận hành & Công việc (`/analytics/operations`):** Tổng nhiệm vụ, tỷ lệ hoàn thành, việc quá hạn, phân bổ theo mức độ ưu tiên (Bình thường, Ưu tiên cao, Khẩn cấp).
  2. **Nhân sự & Chấm công (`/analytics/attendance`):** Quân số nhân sự thực tế, tỷ lệ đúng giờ, tỷ lệ đi muộn, tỷ lệ vắng mặt.
  3. **Tài chính & Dòng tiền (`/analytics/finance`):** Tổng doanh thu phát sinh, các khoản thu/chi thực tế, số lượng tờ trình chi đang chờ phê duyệt 3 cấp.
  4. **CRM & Cơ hội Kinh doanh (`/analytics/crm`):** Khách hàng tiềm năng mới, các cuộc gặp đối tác B2B, tỷ lệ chuyển đổi chốt hợp đồng.
  5. **Nền tảng ViOne (Dành riêng cho Super Admin - `/analytics/platform`):** Tổng số cộng đồng trên toàn hệ sinh thái, số doanh nghiệp đang hoạt động, tỷ lệ kích hoạt gói cước và doanh thu SaaS tổng thể.
* **Giao việc Đa đối tượng (Bulk Task Assignment):**
  - Component `UserMultiSelect.tsx` hỗ trợ tìm kiếm nhân sự theo tên/email, chọn 1 hoặc nhiều người đồng thời, hỗ trợ chọn tất cả (Select All).
  - API `POST /api/companies/:id/tasks/bulk` tự động khởi tạo nhiệm vụ riêng lẻ đồng loạt cho tất cả các nhân sự được chọn, đảm bảo tính phân định trách nhiệm minh bạch.

---

### UC-CRM-15: Tự Động Gửi Email Thông Tin Lợi Ích Gói & Link Truy Cập CRM Khi Mua Gói ViOne Platform
* **Tác nhân:** Khách hàng Doanh nghiệp mua gói ViOne Platform, Hệ thống Mail Service (`apps/vione_app_be`).
* **Mục tiêu:** Khi khách hàng mua gói ViOne Platform, tự động gửi email chào mừng và giới thiệu toàn diện lợi ích của gói dịch vụ, cung cấp link trực tiếp truy cập phân hệ CRM để quản trị doanh nghiệp.
* **Luồng sự kiện chính:**
  1. Người dùng thực hiện đăng ký gói ViOne Platform trong `SubscribePackageModal.tsx` hoặc Super Admin phê duyệt kích hoạt gói.
  2. Backend NestJS (`CompaniesService.subscribePlatformPackage`) lưu bản ghi vào `public.vione_community_subscriptions`.
  3. Hệ thống kích hoạt `MailService.sendPackageSubscriptionEmail`:
     - Thiết lập template email thương hiệu chuẩn phong cách Luxury Obsidian & Gold (`#D8B282`, `#0B0F17`).
     - Nội dung thư liệt kê chi tiết các lợi ích vượt trội mở khóa:
       * Hạn mức nhân sự & thành viên doanh nghiệp được cấp phép.
       * Quản lý tài liệu số hóa bảo mật cao.
       * Quản trị quy trình & công việc Kanban.
       * Chấm công thông minh & quản lý ca làm việc.
       * Phê duyệt chi tiền 3 cấp tích hợp VietQR.
       * Quản lý chăm sóc khách hàng (CRM Leads & Clients).
       * Báo cáo thống kê doanh thu và phân tích chuyên sâu.
       * Trợ lý trí tuệ nhân tạo AI hỗ trợ vận hành.
       * Mạng lưới kết nối giao thương B2B toàn quốc.
     - Cung cấp nút CTA dẫn trực tiếp đến ViOne CRM (`https://vione.viconnect.vn/` hoặc URL dev server).
     - Ghi nhận nhật ký gửi email (Audit logs) và SMTP fallback.
  4. Khách hàng nhận email, bấm liên kết để đăng nhập và bắt đầu quản trị doanh nghiệp trên CRM.

---

### UC-CRM-16: Phân Định Giao Diện CRM Chuẩn Theo Role Quyền (Super Admin vs Doanh Nghiệp Mua Gói)
* **Tác nhân:** Tài khoản Doanh nghiệp mua gói và được mở khóa CRM, Nhân viên công ty, Super Admin Nền tảng.
* **Mục tiêu:** Thiết kế lại toàn bộ luồng hiển thị và điều hướng của CRM ViOne, phân định rạch ròi giữa quyền quản trị nền tảng tổng và quyền của doanh nghiệp thuê gói (Tenant), gói gọn các chức năng vận hành nội bộ vào một nhóm quy trình khoa học.
* **Cấu trúc nhóm chức năng dành cho Doanh nghiệp Mua Gói & Mở Khóa CRM:**
  1. **Bảng Điều Khiển Doanh Nghiệp (`/`):** Dashboard KPI thời gian thực của công ty.
  2. **Menu Cây Tổ Chức Doanh Nghiệp (`EnterpriseTreeMenu.tsx`):** Quản lý nhân viên, giao việc, hồ sơ công ty.
  3. **Nhóm 1: QUY TRÌNH & VẬN HÀNH (Gói gọn toàn bộ vận hành doanh nghiệp theo BRD):**
     - Quản lý Thành viên & Nhân sự (`/companies`): Thêm mới nhân viên, phân bổ phòng ban/chức vụ.
     - Quản lý Tài liệu Số hóa (`/documents`): Lưu trữ, phân quyền đọc/ghi hồ sơ tài liệu.
     - Quy trình & Công việc (`/workflow`): Bảng Kanban tiến độ, hạn chót, checklist nghiệm thu.
     - Chấm công & Ca làm việc (`/attendance`): Điểm danh thực tế, theo dõi chuyên cần.
     - Phê duyệt Chi tiền (`/payment-approvals`): Quy trình duyệt chi Maker-Checker-Approver.
  4. **Nhóm 2: CHĂM SÓC KHÁCH HÀNG & DOANH THU:**
     - Chăm sóc Khách hàng CRM (`/members`): Danh bạ khách hàng/leads, lịch sử tiếp cận.
     - Thống kê Doanh thu Công ty (`/fees`): Dòng tiền, hóa đơn, doanh số.
     - Trợ lý Trí tuệ Nhân tạo AI (`/ai`): Phân tích dữ liệu và gợi ý quyết định.
  5. **Nhóm 3: KẾT NỐI & TRUYỀN THÔNG:**
     - Đăng tin & Khoảnh khắc (`/news`): Đăng tin nội bộ và tin tức truyền thông.
     - Kết nối Đối tác B2B (`/business-connect/connections`): Mạng lưới giao thương liên doanh nghiệp.
     - Thẻ Thông minh NFC & QR (`/admin/business-cards`): Danh thiếp điện tử số hóa.
     - Sàn Sản phẩm & Dịch vụ (`/marketplace`): Gian hàng giới thiệu giải pháp sản phẩm.
  6. **Nhóm 4: HỒ SƠ DOANH NGHIỆP:**
     - Hồ sơ & Cài đặt Doanh nghiệp (`/settings`): Thông tin pháp nhân, thương hiệu, cấu hình.

---

### UC-CRM-17: Giám Sát Chi Tiết Mức Độ Hoạt Động Doanh Nghiệp ViOne Platform & Quản Lý Khách Hàng Nền Tảng
* **Tác nhân:** Super Admin (Ban Quản trị Nền tảng ViOne).
* **Mục tiêu:** Cung cấp bức tranh tổng thể về sức khỏe hệ thống, quản lý danh sách khách hàng doanh nghiệp, theo dõi số lượng người dùng mới và giám sát chi tiết mức độ hoạt động của các công ty sở hữu gói ViOne Platform.
* **Luồng xử lý chính:**
  1. Super Admin có quyền chuyển đổi chế độ xem Sidebar (`Nền Tảng` vs `Doanh Nghiệp`).
  2. Tại giao diện Nền tảng (`/platform`), Super Admin quản lý 2 phân hệ qua tab điều hướng:
     - **Tab 1: Giám Sát Doanh Nghiệp & Tăng Trưởng (`PlatformActivityMonitoring.tsx`):**
       * 4 Thẻ KPI: Tổng số doanh nghiệp trên hệ thống, Số gói đang kích hoạt (Active Subscriptions), Người dùng mới tham gia tháng này, Số gói hết hạn/chờ gia hạn.
       * Biểu đồ diện tích tăng trưởng người dùng 6 tháng liên tiếp (6-Month User Growth Trend Area Chart).
       * Bảng theo dõi chi tiết mức độ hoạt động từng công ty: Tên doanh nghiệp, Trạng thái gói cước, Hạn sử dụng, Thước đo sức khỏe (Health Score: Cực tốt, Tích cực, Cần cải thiện, Nguy cơ), Số nhân sự, Số đầu việc (Tasks), Số tài liệu (Docs), Số khách hàng (CRM Clients).
       * Modal quản trị gói cước trực tiếp: Cho phép gia hạn ngày hết hạn, đổi gói cước, điều chỉnh giới hạn slot nhân sự (`max_slots`), mở khóa/tạm khóa quyền truy cập CRM (`PATCH /api/companies/:id/subscription`).
     - **Tab 2: Danh Mục Chức Năng Nền Tảng & RBAC (`platform.index.tsx`):**
       * Ma trận phân quyền 27 quyền hạt nhân động và quản lý vai trò nền tảng.
  3. Quản trị Khách hàng Nền tảng (`/members`): Tra cứu, phân loại và hỗ trợ khách hàng toàn hệ sinh thái.

---

### UC-CRM-18: Phân Quyền Hai Tầng Hệ Sinh Thái ViOne (Two-Tier RBAC: Tenant Internal Roles & Platform Department RBAC)
* **Tác nhân:** Chủ Doanh nghiệp (Company Owner), Quản trị viên/Trưởng bộ phận Doanh nghiệp (Manager), Nhân viên (Staff), Ban Quản Trị Hệ Thống (Super Admin), Các bộ phận nghiệp vụ Nền tảng ViOne (Executive, Operations, Finance).
* **Mục tiêu:** 
  1. Đáp ứng phân quyền chặt chẽ nội bộ cho khách hàng khi mua gói ViOne Platform: Khi cả công ty vào dùng ViOne, phân biệt rõ người là nhân viên thực thi chỉ nhận việc và người có quyền quản trị, giao việc, phân quyền phòng ban, xem tài chính, quản lý tài liệu.
  2. Phân định rõ ràng quyền hạn giữa các bộ phận nội bộ của ViOne Platform (Quản trị hệ thống, Ban lãnh đạo điều hành, Bộ phận Vận hành & CSKH, Bộ phận Kế toán & Tài chính nền tảng) qua ma trận phân quyền RBAC thời gian thực.
* **Cấu trúc phân quyền:**
  1. **Tầng 1: Phân quyền nội bộ công ty của khách hàng (Tenant Internal RBAC):**
     - **Chủ Doanh Nghiệp (Company Owner / CEO)**:
       * Nắm giữ tài khoản đăng ký gói cước, toàn quyền tối cao trong công ty.
       * Quản lý thành viên, thêm mới nhân viên, thiết lập phòng ban, cấu hình hồ sơ công ty.
       * Xem báo cáo doanh thu tài chính, phê duyệt các tờ trình chi tiền.
       * Phân quyền quản trị cho các nhân sự cấp quản lý.
     - **Quản Trị Viên / Trưởng Bộ Phận (Company Admin / Manager)**:
       * Vai trò `role = 'manager'`.
       * Được cấp các quyền quản trị: Giao việc cho nhân viên (`can_assign_tasks = true`), quản lý & phân công nhiệm vụ Kanban, quản lý thành viên phòng ban (`can_manage_members = true`), quản lý tài liệu số hóa (`can_manage_docs = true`), quản lý khách hàng CRM (`can_manage_crm = true`).
       * Hiển thị nút `+ Giao Việc Mới` trên màn hình Công việc và nút `Giao việc` trên từng nhân sự.
     - **Nhân Viên Thực Thi (Staff / Employee)**:
       * Vai trò `role = 'staff'`.
       * Nhận và thực hiện các nhiệm vụ được giao, cập nhật checklist tiến độ công việc, chấm công hàng ngày, xem tài liệu dùng chung.
       * Mặc định **KHÔNG CÓ QUYỀN** giao việc cho nhân viên khác (`can_assign_tasks = false` -> ẩn nút `+ Giao Việc Mới`).
       * Mặc định **KHÔNG CÓ QUYỀN** xem doanh thu, duyệt chi hay quản lý nhân sự khác trừ khi được Chủ doanh nghiệp tích chọn cấp quyền riêng lẻ.
     - **Cơ chế cấp quyền linh hoạt cho từng nhân viên (`CompanyEmployeesTab.tsx`)**:
       * Modal thêm nhân viên mới và Modal chỉnh sửa vai trò: Cung cấp 5 cờ quyền hạt nhân độc lập:
         - `canAssignTasks`: Quyền giao việc cho nhân sự khác.
         - `canManageMembers`: Quyền thêm và quản lý nhân viên công ty.
         - `canManageFinance`: Quyền xem tài chính, doanh thu và duyệt chi tiền.
         - `canManageDocs`: Quyền quản lý tài liệu số hóa.
         - `canManageCrm`: Quyền quản lý danh bạ khách hàng CRM.
       * Backend lưu trữ trong bảng `public.company_employees` và đồng bộ vào API quyền hiệu lực `GET /api/roles/my-permissions`.
  2. **Tầng 2: Phân quyền các bộ phận nội bộ ViOne Platform (Platform Department RBAC):**
     - **Ban Quản Trị Hệ Thống (`super_admin` - Level 1)**: Toàn quyền điều hành toàn hệ sinh thái ViOne, quản trị ma trận RBAC, cấu hình giá và slots gói cước, theo dõi audit logs kiểm toán.
     - **Ban Lãnh Đạo & Điều Hành (`platform_executive` - Level 2)**: Giám sát toàn diện báo cáo thống kê tăng trưởng, biểu đồ người dùng mới, theo dõi chi tiết mức độ hoạt động và điểm sức khỏe của tất cả các công ty sở hữu gói ViOne Platform, giám sát doanh thu tổng thể.
     - **Bộ Phận Vận Hành & CSKH (`platform_operations` - Level 3)**: Quản lý danh mục khách hàng, doanh nghiệp (`/companies`), hỗ trợ mở khóa CRM, kích hoạt dùng thử, tiếp nhận và hỗ trợ kỹ thuật khách hàng toàn hệ thống.
     - **Bộ Phận Kế Toán & Tài Chính Nền Tảng (`platform_finance` - Level 3)**: Quản lý danh mục gói cước (`/segments`), phê duyệt đơn hàng đăng ký/gia hạn gói ViOne Platform (`/payment-approvals`), đối soát dòng tiền thanh toán và báo cáo doanh thu tài chính platform (`/finance-report`).
     - **Ma trận phân quyền RBAC thời gian thực (`/platform/permissions`)**:
       * Lưu trữ 100% trong PostgreSQL (`public.platform_roles`, `public.platform_permissions`, `public.platform_role_permissions`).
       * Cho phép Quản trị viên ViOne xem và toggle bật/tắt tức thì từng quyền cho từng bộ phận với độ trễ 0 giây.

---

### UC-CRM-19: Cấp Tài Khoản Nhân Viên Nội Bộ ViOne, Phân Quyền Đa Nhóm & Phản Ứng Rerender Tức Thì
* **Tác nhân:** Ban Quản Trị ViOne (Super Admin, Quản trị viên hệ thống), Nhân viên nội bộ ViOne.
* **Mục tiêu:** 
  1. Cung cấp tính năng cấp tài khoản CRM dành riêng cho nhân viên thuộc công ty ViOne: Quản trị viên nhập Email hoặc Số điện thoại của nhân viên, hệ thống tự động khởi tạo tài khoản và tự động gửi email thông báo thông tin tài khoản (Tên đăng nhập, Mật khẩu, Danh sách nhóm quyền, Link đăng nhập CRM).
  2. Phân quyền đa nhóm linh hoạt (Multi-Role Support): Một tài khoản nhân viên có thể đồng thời thuộc nhiều nhóm quyền (ví dụ: vừa thuộc nhóm Thống kê báo cáo tài chính `platform_finance`, vừa thuộc nhóm Quản lý tài khoản & vận hành `platform_operations`).
  3. Đảm bảo các chức năng tối thiểu cốt lõi: Mọi nhân viên hợp lệ đều có quyền Kết nối nhắn tin (`/messages`), quyền Xuất báo cáo được cấp tự động tương ứng theo nhóm quyền (ví dụ có quyền tài chính sẽ được phép xuất Excel/PDF báo cáo tài chính).
  4. Cơ chế phản ứng tức thì (Reactive Rerendering): Khi quản trị viên thay đổi phân quyền của một tài khoản, giao diện của tài khoản đó tự động cập nhật và rerender lại ngay lập tức trên mọi tab trình duyệt mà không cần tải lại trang (F5).
* **Cấu trúc lưu trữ CSDL:**
  - Bảng gán đa quyền: `public.platform_user_roles (id uuid, user_id uuid, role_code text, assigned_by uuid, assigned_at timestamptz)` với ràng buộc UNIQUE `(user_id, role_code)`.
  - Hỗ trợ 4 nhóm quyền chuyên biệt cho nhân sự ViOne:
    * `super_admin`: Toàn quyền tối cao quản trị toàn hệ sinh thái.
    * `platform_executive`: Ban Lãnh đạo & Điều hành (giám sát tăng trưởng, báo cáo KPI, giám sát doanh nghiệp).
    * `platform_operations`: Bộ phận Vận hành & Quản lý tài khoản (quản lý doanh nghiệp, khách hàng, mở khóa CRM, quản lý nhân sự nền tảng).
    * `platform_finance`: Bộ phận Kế toán & Tài chính (quản lý gói cước, đối soát dòng tiền, xuất báo cáo tài chính).
* **Luồng xử lý chính:**
  1. **Quản trị viên cấp tài khoản nhân viên (`PlatformStaffManagement.tsx`):**
     - Quản trị viên truy cập `/platform/admins` hoặc Tab `Cấp & Quản Lý Tài Khoản Nhân Viên ViOne` tại `/platform`.
     - Bấm nút "+ Cấp Tài Khoản Nhân Viên Mới".
     - Nhập Họ và tên, Email (bắt buộc), Số điện thoại (tùy chọn), Mật khẩu (có nút sinh ngẫu nhiên an toàn hoặc tự đặt).
     - Tích chọn một hoặc NHIỀU nhóm quyền đồng thời qua các thẻ Checkbox trực quan (`platform_finance`, `platform_operations`, `platform_executive`, `super_admin`).
     - Tích chọn "Tự động gửi email thông tin đăng nhập cho nhân viên".
     - Bấm "Xác Nhận & Cấp Tài Khoản": Gọi API `POST /api/roles/staff-accounts`.
  2. **Xử lý Backend & Tự động gửi Email (`RolesService.provisionStaffAccount`):**
     - Backend kiểm tra trùng lặp email, tạo hoặc cập nhật tài khoản trong `public.vione_users`, đồng bộ `auth.users` và `public.user_profiles`.
     - Ghi nhận đồng thời các nhóm quyền vào `public.platform_user_roles`.
     - Kích hoạt `MailService.sendStaffAccountCredentialsEmail`: Gửi email giao diện Obsidian & Gold sang trọng, cung cấp tên đăng nhập, mật khẩu tạm thời, bảng tổng hợp các quyền hạn được cấp và nút liên kết trực tiếp vào CRM.
  3. **Hiển thị chức năng theo Role & Chức năng tối thiểu:**
     - Khi nhân viên đăng nhập, `useRole` hook gọi `GET /api/roles/my-permissions` trả về ngữ cảnh RBAC:
       * `roleCodes`: Danh sách tất cả các role nhân viên nắm giữ.
       * `isSuperAdmin`, `isFinanceStaff`, `isOperationsStaff`, `isExecutiveStaff`.
       * `canAccessChat = true`: Luôn mở phân hệ "Kết Nối Nhắn Tin" (`/messages`) trên Sidebar.
       * `canExportReports`: True nếu tài khoản có nhóm quyền tài chính hoặc quyền xuất báo cáo. Nút xuất Excel/CSV và PDF tại `/finance-report` tự động bật/tắt theo cờ này.
       * Sidebar hiển thị đồng thời cả suite "Quản trị Khách Hàng & Doanh Nghiệp" lẫn suite "Gói Dịch Vụ & Doanh Thu" nếu nhân viên có cả 2 nhóm quyền.
  4. **Cơ chế Reactive Permission Rerendering:**
     - Sử dụng `BroadcastChannel('vione_rbac_sync')` kết hợp `window.dispatchEvent(new CustomEvent('permissions-updated'))`.
     - Khi admin thêm mới hoặc cập nhật quyền của nhân viên, hệ thống phát tín hiệu qua BroadcastChannel.
     - Mọi tab đang mở của người dùng tự động bắt sự kiện, gọi lại `GET /api/roles/my-permissions` và cập nhật state React tức thì, giao diện và Sidebar tự động rerender tương ứng mà người dùng không cần reload trang.

