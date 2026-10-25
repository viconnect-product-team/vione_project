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
