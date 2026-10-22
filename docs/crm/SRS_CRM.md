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
