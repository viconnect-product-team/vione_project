# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS) - PHÂN HỆ WEB CRM VIONE ENTERPRISE
## SOFTWARE REQUIREMENTS SPECIFICATION — USE CASES & SYSTEM BEHAVIOR (CRM PLATFORM)

> **Mã tài liệu:** `VIONE-SRS-CRM-02`  
> **Phiên bản:** `7.0.0 (Cập nhật Toàn diện Chuẩn Chi Tiết & Trường Dữ Liệu - Tháng 10/2026)`  
> **Phân hệ:** Quản trị Doanh nghiệp, Hiệp hội & Vận hành Web CRM (`apps/vione_app_fe` build crm_platform / `apps/vione_app_be`)  
> **Nguyên tắc tài liệu:** KHÔNG XÓA NỘI DUNG CŨ. Luôn bổ sung chi tiết vào từng Use Case (UC-CRM-xxx) tương ứng, mô tả đầy đủ 100% các trường dữ liệu, validation rules, placeholder, vị trí hiển thị bản ghi mới trên bảng CRM và cơ chế đồng bộ dữ liệu đa người dùng.

---

## 1. DANH MỤC USE CASES (USE CASE MATRIX)

| Mã Use Case | Tên Chức Năng Trên Web CRM | Tác Nhân (Actors) | Mức Ưu Tiên | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- |
| **UC-CRM-01** | Đăng nhập Quản trị viên & Phân quyền Đa tầng RBAC | Super Admin, Manager, Staff | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-02** | Quản lý Danh sách & Hồ sơ Khách hàng CRM / Hội viên (`/members`) | Quản trị viên CRM | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-03** | Thẩm định & Phê duyệt Đơn gia nhập Hiệp hội | Ban Thẩm định, Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-04** | Quản trị Quy trình BPMN 2.0 & Kanban Công việc (`/workflow`) | Quản lý dự án, Nhân sự | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-05** | Giám sát Tải Làm Việc & Bản đồ nhiệt Nhân sự (`/workload`) | Giám đốc, HR Manager | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-06** | Giám sát Bảng Chấm Công Thời Gian Thực (`/attendance`) | Quản trị nhân sự | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-07** | Quản lý Đơn Xin Nghỉ Phép & Phê duyệt OT | Trưởng phòng, Nhân viên | P1 - Cao | Hoạt động |
| **UC-CRM-08** | Khởi tạo & Phê duyệt Tờ trình Chi 3 cấp (`/payment-approvals`)| Maker, Checker, Approver | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-09** | Sinh mã VietQR Napas 24/7 Gạch nợ Tự động | Kế toán trưởng, CEO | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-10** | Quản trị Pipeline Khách hàng Tiềm năng (Leads CRM) | Trưởng phòng Kinh doanh | P1 - Cao | Hoạt động |
| **UC-CRM-11** | Quản trị Doanh nghiệp Số, Tree Menu Sidebar & Nhân sự Doanh nghiệp | Chủ Doanh nghiệp, Ban Giám Đốc | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-12** | Quản trị Giới hạn Nhân sự & Gói Cước Doanh nghiệp (Slot Control) | Super Admin, Community Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-13** | Ma trận Phân quyền Động 4 cấp Nền tảng (Granular RBAC System) | Super Admin, Community Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-14** | Trung tâm Thống kê Toàn diện 5 Phân hệ & Giao việc Đồng loạt | Ban Lãnh đạo, Quản lý, Super Admin | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-15** | Tự Động Gửi Email Thông Tin Lợi Ích Gói & Link Truy Cập CRM Khi Mua Gói | Khách hàng Doanh nghiệp, Hệ thống Mail | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-16** | Phân Định Giao Diện CRM Chuẩn Theo Role Quyền (Super Admin vs Doanh Nghiệp Mua Gói) | Doanh nghiệp mua gói, Ban Quản trị | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-17** | Giám Sát Chi Tiết Mức Độ Hoạt Động Doanh Nghiệp ViOne Platform & Quản Lý Khách Hàng Nền Tảng | Super Admin Nền tảng | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-18** | Phân Quyền Hai Tầng Hệ Sinh Thái ViOne (Tenant Internal RBAC & Platform Departments) | Chủ Doanh nghiệp, Nhân sự, Super Admin & Bộ phận ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-19** | Cấp Tài Khoản Nhân Viên Nội Bộ ViOne, Phân Quyền Đa Nhóm & Phản Ứng Rerender Tức Thì | Quản Trị Viên ViOne, Nhân Viên ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-20** | Luồng Người Dùng App ViOne & Dùng Thử Miễn Phí 30 Ngày Mở Khóa Cộng Đồng | Người dùng App ViOne thông thường | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-21** | Bộ Phân Hệ Quản Trị CRM Cộng Đồng Dành Cho Người Mua Gói (Tenant Community CRM) | Doanh nghiệp / Khách hàng mua gói ViOne | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-22** | Bộ Phân Hệ Quản Trị Nền Tảng ViConnect Dành Cho Super Admin & Platform Staff | Quản trị viên & Nhân viên ViConnect | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-23** | Quản Lý Danh Mục Gói ViOne Platform & Xét Duyệt Hồ Sơ Đăng Ký Từ App ViOne | Super Admin, Vận hành ViConnect | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-24** | Phân Hệ Thống Kê & Báo Cáo Chuyên Sâu Dạng Tree Menu Đa Cấp Tại Sidebar | Ban Lãnh đạo, Kế toán, Vận hành | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-25** | Quản Trị Giao Việc Cho Nhân Sự Doanh Nghiệp (Task Assignment & Checklist) | Giám đốc, Trưởng phòng, Quản lý | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-26** | Phân Quyền & Vai Trò Riêng Biệt Cho Từng Doanh Nghiệp (Tenant-Isolated RBAC & Role Matrix) | Chủ Doanh nghiệp, Ban Giám Đốc | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-27** | Quản Trị Cấu Hình Hệ Thống Đồng Bộ CSDL Toàn Diện (System Configuration & Third-party Integrations) | Quản trị viên Doanh nghiệp & Hệ thống | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-28** | Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp Chuẩn Google Drive (`/documents`) | Giám đốc, Kế toán, Nhân sự, Nhân viên | P0 - Bắt buộc | Hoạt động |
| **UC-CRM-29** | Kiến Trúc Điều Hướng Phân Tách Doanh Nghiệp & Tooltip Đa Điểm Sidebar | Toàn bộ người dùng Web CRM | P0 - Bắt buộc | Hoạt động |

---

## 2. CHI TIẾT CÁC USE CASE & ĐẶC TẢ TRƯỜNG DỮ LIỆU CHUẨN WEB CRM

---

### UC-CRM-01: Đăng nhập Quản trị viên & Phân quyền RBAC
* **Tác nhân:** Super Admin, Quản lý bộ phận, Kế toán, Nhân sự doanh nghiệp.
* **Màn hình thực hiện:** `/login`, `/auth/crm-login`.
* **Tiền điều kiện:** Người dùng truy cập subdomain CRM (`https://crm.viconnect.vn/` hoặc port 5446).
* **Hậu điều kiện:** Cấp phát Access Token JWT, lưu vào LocalStorage/Cookies, nạp danh mục quyền hiệu lực `GET /api/roles/my-permissions`, điều hướng vào Dashboard CRM.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Đăng Nhập CRM
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `email` | Email / Tên đăng nhập | `TextInput` (email/text) | `admin@connect.vn hoặc ten_dang_nhap` | Bắt buộc. Không để khoảng trắng đầu cuối. Tối thiểu 3 ký tự. | `Vui lòng nhập Email hoặc tên đăng nhập quản trị!` |
| `password` | Mật khẩu quản trị | `TextInput` (password, toggle ẩn/hiện) | `••••••••` | Bắt buộc. Tối thiểu 6 ký tự. | `Mật khẩu phải có độ dài từ 6 ký tự trở lên!` |
| `remember_me` | Ghi nhớ đăng nhập | `Checkbox` | N/A | Tùy chọn. Mặc định `true` (duy trì token 30 ngày). | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đồng bộ
* **Vị trí hiển thị sau khi nhập:** Đăng nhập thành công, hệ thống chuyển hướng tức thì vào Bảng Điều Khiển Tổng Quan (`/`). Góc trên bên phải hiển thị Họ tên, Avatar, Badge phân quyền (`Super Admin` hoặc `Quản trị doanh nghiệp`).
* **Cơ chế cập nhật:** Nạp tức thời ma trận quyền hạn, cấu hình Sidebar tự động lọc hiển thị đúng các phân hệ tương ứng với vai trò của tài khoản.

---

### UC-CRM-04: Quản trị Quy trình BPMN 2.0 & Kanban Công việc (`/workflow`)
* **Tác nhân:** Quản lý dự án, Trưởng bộ phận, Nhân viên thực thi.
* **Màn hình thực hiện:** `/workflow`, `TaskCreateModal.tsx`, `TaskDetailModal.tsx`.
* **Tiền điều kiện:** Doanh nghiệp có gói cước ViOne Platform đang hoạt động.
* **Hậu điều kiện:** Nhiệm vụ được lưu vào `public.company_tasks`, hiển thị trên cột tương ứng của bảng Kanban.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Tạo / Sửa Công Việc Kanban
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `title` | Tiêu đề công việc | `TextInput` | `VD: Thẩm định hồ sơ hợp đồng đối tác A...` | Bắt buộc. Từ 5 đến 200 ký tự. Không chứa mã độc HTML. | `Tiêu đề công việc không được để trống (5-200 ký tự)!` |
| `description` | Mô tả chi tiết | `RichText / Textarea` | `Mô tả chi tiết mục tiêu, quy chuẩn kết quả cần bàn giao...` | Tùy chọn. Tối đa 2000 ký tự. | `Mô tả không vượt quá 2000 ký tự!` |
| `assignee` | Người phụ trách (Assignee) | `SelectDropdown` | `Chọn nhân sự nhận việc` | Bắt buộc theo quy tắc BR-WRK-01. Phải là nhân sự hợp lệ trong công ty. Kiểm tra WIP Limit: Nếu nhân sự đã có 5 việc trên cột In Progress thì cảnh báo quá tải (BR-WRK-06). | `Vui lòng chỉ định người phụ trách công việc!` / `Nhân sự này đã đạt giới hạn 5 việc đang làm!` |
| `department` | Phòng ban triển khai | `SelectDropdown` | `Chọn phòng ban` | Tùy chọn. Mặc định là phòng ban của người tạo. | N/A |
| `priority` | Mức độ ưu tiên | `SelectDropdown` / Chips | N/A | Bắt buộc. Các giá trị: `urgent` (Khẩn cấp), `high` (Ưu tiên cao), `normal` (Bình thường), `medium` (Trung bình), `low` (Thấp). Mặc định: `medium`. | `Vui lòng chọn độ ưu tiên!` |
| `deadline` | Thời hạn hoàn thành | `DateTimePicker` | `dd/mm/yyyy hh:mm` | Bắt buộc theo BR-WRK-01. Phải là thời điểm trong tương lai ($> \text{now()}$). | `Hạn chót phải là thời gian trong tương lai!` |
| `checklist` | Danh sách đầu việc con | `DynamicListInput` (Checklist) | `Thêm tiêu chí nghiệm thu...` | Tùy chọn. Mỗi tiêu chí từ 2 đến 150 ký tự. Mặc định có 3 tiêu chí chuẩn: Khảo sát yêu cầu, Thực hiện, Báo cáo nghiệm thu. | `Tiêu chí checklist không được để trống!` |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đồng bộ
* **Vị trí hiển thị trên CRM:** 
  1. Thẻ công việc mới lập tức xuất hiện ở **VỊ TRÍ ĐẦU TIÊN (TOP 1)** của cột **[Cần làm / Todo]** trên bảng Kanban `/workflow`.
  2. Modal tạo việc tự động đóng lại.
  3. Xuất hiện **Toast Notification** Vàng Hoàng Gia ở góc trên bên phải: *"Đã khởi tạo công việc [Mã TSK-XXXX] thành công!"*.
  4. Bộ đếm số lượng việc trên đầu cột Todo tự động tăng thêm 1 (`Todo: count + 1`).
* **Cơ chế đẩy dữ liệu về App Native & Đa người dùng:**
  - Backend phát sự kiện WebSocket `task_created`.
  - Nếu nhân sự được giao việc đang mở App Mobile ViOne, ứng dụng di động nhận **Push Notification FCM/APNs**: *"Bạn được giao nhiệm vụ mới: [Tiêu đề công việc]"*. Chạm vào thông báo sẽ mở chi tiết nhiệm vụ trên điện thoại.
  - Trên màn hình của các nhân viên khác cùng công ty, bảng Kanban tự động rerender xuất hiện thẻ mới mà không cần F5.

---

### UC-CRM-08: Khởi tạo & Phê duyệt Tờ trình Chi 3 cấp (`/payment-approvals`)
* **Tác nhân:** Maker (Nhân viên đề xuất chi), Checker (Kế toán trưởng), Approver (CFO / CEO).
* **Màn hình thực hiện:** `/payment-approvals`, `CreateApprovalModal.tsx`.
* **Tiền điều kiện:** Người dùng có tài khoản hợp lệ thuộc doanh nghiệp.
* **Hậu điều kiện:** Tạo tờ trình chi trong `public.payment_approvals`, sinh mã VietQR Napas 24/7 gạch nợ tự động khi Approver ký duyệt.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Đề Xuất Tờ Trình Chi
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `title` | Tiêu đề khoản chi | `TextInput` | `VD: Chi phí thuê máy chủ Cloud tháng 10/2026...` | Bắt buộc. Từ 5 đến 150 ký tự. | `Vui lòng nhập tiêu đề khoản chi (5-150 ký tự)!` |
| `amount` | Số tiền đề xuất chi | `NumberInput` (currency) | `VD: 15,000,000` | Bắt buộc. Số nguyên dương $> 0$. Tối đa 50,000,000,000 đ. | `Số tiền đề xuất phải lớn hơn 0 VNĐ!` |
| `category` | Khoản mục ngân sách | `SelectDropdown` | `Chọn khoản mục chi` | Bắt buộc. Danh mục: Chi phí vận hành, Lương & Thưởng, Tiếp khách, Mua sắm trang thiết bị, Khác. | `Vui lòng chọn khoản mục ngân sách!` |
| `beneficiary_name` | Tên người/đơn vị thụ hưởng | `TextInput` | `VD: CÔNG TY TNHH HẠ TẦNG SỐ CLOUD` | Bắt buộc. Tên viết hoa hoặc đúng theo tài khoản ngân hàng. | `Tên người thụ hưởng không được để trống!` |
| `beneficiary_account`| Số tài khoản ngân hàng | `TextInput` (number-pad) | `1903xxxxxxxx` | Bắt buộc. Từ 6 đến 20 chữ số: `^[0-9]{6,20}$`. | `Số tài khoản ngân hàng không hợp lệ (6-20 chữ số)!` |
| `beneficiary_bank` | Ngân hàng thụ hưởng | `SelectDropdown` (NAPAS) | `Chọn ngân hàng (Vietcombank, MB, Techcombank...)` | Bắt buộc. Chọn từ danh mục 54 ngân hàng thành viên Napas. | `Vui lòng chọn ngân hàng thụ hưởng!` |
| `invoice_file` | Hóa đơn / Chứng từ đính kèm| `FileUpload` (PDF, Image) | N/A | Bắt buộc theo BR-FIN-07. Định dạng PDF, JPG, PNG. Tối đa 10MB. Hệ thống tự động kiểm tra khử trùng hóa đơn chống chi trùng (số hóa đơn, ngày phát hành, MST). | `Vui lòng đính kèm hóa đơn/chứng từ hợp lệ!` |
| `notes` | Diễn giải / Căn cứ chi | `Textarea` | `Căn cứ hợp đồng số... hoặc nhu cầu công tác...` | Tùy chọn. Tối đa 500 ký tự. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đồng bộ
* **Vị trí hiển thị trên CRM:**
  1. Bản ghi mới xuất hiện ngay tại **DÒNG ĐẦU TIÊN (DÒNG 1)** của Bảng Danh sách Tờ trình Chi tại `/payment-approvals`.
  2. Cột trạng thái hiển thị nhãn màu xanh dương: `Chờ Kế Toán Soát Xét (Pending Checker)`.
  3. Tổng số tờ trình và tổng số tiền chờ duyệt trên thẻ KPI đầu trang tự động nhảy tăng giá trị.
* **Luồng phê duyệt 3 cấp tự động:**
  - Sau khi Kế toán trưởng (Checker) bấm "Soát xét hợp lệ", trạng thái chuyển sang `Chờ Lãnh Đạo Ký Duyệt`.
  - Khi Lãnh đạo thẩm quyền (CEO/CFO) bấm "Ký số & Phê duyệt", hệ thống tự động sinh mã VietQR Napas 24/7 gạch nợ tức thì theo BR-FIN-06. Màn hình thanh toán hiển thị mã QR có sẵn số tiền và nội dung chuyển khoản để thủ quỹ thanh toán trong 1 giây.

---

### UC-CRM-11: Quản Trị Doanh Nghiệp Số, Tree Menu Sidebar & Nhân Sự Doanh Nghiệp
* **Tác nhân:** Chủ Doanh Nghiệp (Owner / CEO), Ban Giám Đốc, Quản trị viên.
* **Màn hình thực hiện:** `/companies`, `CompanyEmployeesTab.tsx`, `AddEmployeeModal.tsx`.
* **Tiền điều kiện:** Tài khoản là Quản trị viên hoặc nhân sự ViConnect.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Thêm Mới Nhân Sự Doanh Nghiệp
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Họ và tên nhân viên | `TextInput` | `VD: Trần Thị Bích Thảo` | Bắt buộc. Từ 2 đến 60 ký tự. | `Họ tên nhân viên không được để trống!` |
| `email` | Email đăng nhập | `TextInput` (email-address) | `thao.tran@congty.com` | Bắt buộc. Định dạng email chuẩn. Kiểm tra chống trùng lặp trong doanh nghiệp. | `Email không đúng định dạng!` / `Email này đã tồn tại trong công ty!` |
| `phone` | Số điện thoại | `TextInput` (phone-pad) | `0987 654 321` | Bắt buộc. Định dạng 10 số di động Việt Nam. | `Số điện thoại phải gồm 10 chữ số hợp lệ!` |
| `department` | Phòng ban / Bộ phận | `SelectDropdown` | `Kinh Doanh, Kỹ Thuật, Vận Hành, Kế Toán...` | Bắt buộc. Chọn phòng ban có sẵn hoặc nhập mới. | `Vui lòng chọn phòng ban!` |
| `title` | Chức vụ | `TextInput` | `VD: Trưởng phòng Kinh Doanh` | Bắt buộc. Tối đa 60 ký tự. | `Chức vụ không được để trống!` |
| `role` | Vai trò hệ thống | `SelectDropdown` | `Quản lý (Manager) / Nhân viên (Staff)` | Bắt buộc. `manager` (có quyền giao việc, quản trị), `staff` (chỉ nhận việc và báo cáo). | `Vui lòng chọn vai trò hệ thống!` |
| `can_assign_tasks` | Quyền giao việc cho người khác | `Checkbox / Switch` | N/A | Mặc định `true` cho Manager, `false` cho Staff. | N/A |
| `can_manage_members` | Quyền quản lý nhân sự | `Checkbox / Switch` | N/A | Mặc định `false` cho Staff. | N/A |
| `can_manage_finance` | Quyền xem tài chính & duyệt chi | `Checkbox / Switch` | N/A | Mặc định `false` cho Staff. | N/A |
| `can_manage_docs` | Quyền quản lý tài liệu | `Checkbox / Switch` | N/A | Mặc định `true` (xem/ghi theo phân quyền). | N/A |
| `can_manage_crm` | Quyền quản lý khách hàng | `Checkbox / Switch` | N/A | Mặc định `true`. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đồng bộ
* **Vị trí hiển thị trên CRM:**
  1. Bản ghi nhân sự mới lập tức xuất hiện ở **DÒNG ĐẦU TIÊN (DÒNG 1)** của Bảng Danh Sách Nhân Sự (`CompanyEmployeesTab.tsx`).
  2. Modal đóng lại, xuất hiện Toast Notification xanh ngọc lục bảo: *"Đã thêm thành công nhân viên [Tên nhân viên] vào công ty!"*.
  3. Thước đo Hạn mức Slots tài khoản (`{usedSlots} / {maxSlots}`) tự động cập nhật tăng thêm 1 đơn vị.
* **Cơ chế đẩy dữ liệu về người dùng:**
  - Hệ thống tự động tạo tài khoản trong PostgreSQL, kích hoạt `MailService.sendRegistrationAccountEmail` bắn thư mời kèm mật khẩu đăng nhập về hòm thư nhân viên.
  - Khi nhân viên mở App Mobile ViOne đăng nhập, họ lập tức thấy tổ chức công ty của mình và nhận được các thông báo công việc từ ban giám đốc.

---

### UC-CRM-19: Cấp Tài Khoản Nhân Viên Nội Bộ ViOne, Phân Quyền Đa Nhóm & Rerender Tức Thì
* **Tác nhân:** Ban Quản Trị ViOne (Super Admin, Quản trị viên hệ thống).
* **Màn hình thực hiện:** `/platform/admins`, `PlatformStaffManagement.tsx`.
* **Tiền điều kiện:** Người dùng có quyền `super_admin` hoặc `platform_admin`.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Cấp Tài Khoản Nhân Viên Nền Tảng
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Họ và tên nhân sự | `TextInput` | `VD: Lê Hoàng Nam` | Bắt buộc. Từ 2 đến 60 ký tự. | `Vui lòng nhập họ và tên nhân sự!` |
| `email` | Email nội bộ | `TextInput` (email-address) | `nam.le@viconnect.vn` | Bắt buộc. Phải là email hợp lệ, kiểm tra không được trùng với tài khoản đã có. | `Email không hợp lệ hoặc đã được sử dụng!` |
| `phone` | Số điện thoại | `TextInput` (phone-pad) | `0901 234 567` | Tùy chọn. Định dạng 10 số di động. | `Số điện thoại không hợp lệ!` |
| `password` | Mật khẩu ban đầu | `TextInput` (kèm nút Random) | `Nhập hoặc bấm Tạo ngẫu nhiên` | Bắt buộc. Tối thiểu 6 ký tự. Có nút "Sinh mật khẩu ngẫu nhiên an toàn". | `Mật khẩu phải từ 6 ký tự trở lên!` |
| `role_groups` | Nhóm quyền nền tảng (Multi) | `MultiCheckboxCardGroup` | N/A | Bắt buộc chọn ít nhất 1 nhóm: `platform_finance` (Kế toán & Tài chính), `platform_operations` (Vận hành & CSKH), `platform_executive` (Ban Lãnh đạo), `super_admin` (Quản trị tối cao). | `Vui lòng chọn ít nhất một nhóm quyền!` |
| `auto_send_email` | Gửi email thông tin mật khẩu | `Checkbox` | N/A | Mặc định `true` (Tự động gửi email giao diện Obsidian & Gold). | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đồng bộ
* **Vị trí hiển thị trên CRM:** Bản ghi nhân viên mới xuất hiện ở **DÒNG 1** trên Bảng Quản Lý Nhân Sự Nền Tảng (`PlatformStaffManagement.tsx`). Thẻ thống kê tổng nhân sự ViOne tăng thêm 1 người.
* **Cơ chế phản ứng tức thì (Reactive Rerendering):** Hệ thống phát sự kiện qua `BroadcastChannel('vione_rbac_sync')`. Tất cả các tab trình duyệt của nhân viên này (nếu đang mở) tự động bắt sự kiện, cập nhật quyền hạn mới và rerender lại thanh Sidebar ngay lập tức mà không cần F5.

---

### UC-CRM-24: Phân Hệ Thống Kê & Báo Cáo Chuyên Sâu Dạng Tree Menu Đa Cấp Tại Sidebar (Tree-structured Reports Hub)
* **Tác nhân:** Ban Giám Đốc, Kế toán trưởng, Quản lý vận hành, Super Admin.
* **Màn hình thực hiện:** `ReportsTreeMenu.tsx`, `Sidebar.tsx`, `routes/statistics.tsx`.
* **Tiền điều kiện:** Người dùng truy cập Web CRM ViOne.
* **Mục tiêu:** Tách riêng phân hệ Thống Kê Báo Cáo thành một suite độc lập ở Sidebar, tổ chức theo mô hình Cây phân cấp (Tree Menu) trực quan. Khi click vào nhánh cha sẽ trượt xổ xuống các chức năng con chi tiết; click vào chức năng con sẽ tự động điều hướng và kích hoạt đúng tab báo cáo tương ứng.

#### 1. Cấu Trúc Tree Menu 4 Nhánh Cha & Chức Năng Con Chi Tiết
1. **Nhánh 1: BÁO CÁO TÀI CHÍNH & DOANH THU**
   - *Thống Kê Doanh Thu & Dòng Tiền*: Điều hướng `/statistics?group=finance`. Hiển thị biểu đồ doanh thu theo thời gian, dòng tiền thực tế, cơ cấu nguồn thu.
   - *Doanh Thu Toàn Nền Tảng* (dành cho Admin): Điều hướng `/finance-report`. Đối soát dòng tiền SaaS, gói cước và hợp đồng nền tảng.
   - *Sổ Quỹ & Doanh Thu Doanh Nghiệp* (dành cho Tenant): Điều hướng `/fees`. Quản lý các khoản thu nội bộ doanh nghiệp.
   - *Báo Cáo Phê Duyệt Chi Tiền*: Điều hướng `/payment-approvals`. Theo dõi các tờ trình chi 3 cấp và lịch sử gạch nợ VietQR Napas 24/7.
2. **Nhánh 2: THỐNG KÊ VẬN HÀNH & NHÂN SỰ**
   - *Tiến Độ & Hiệu Suất Kanban BPMN*: Điều hướng `/statistics?group=operations`. Báo cáo tiến độ hoàn thành, nhiệm vụ quá hạn, khối lượng công việc.
   - *Báo Cáo Chấm Công & Ca Làm*: Điều hướng `/statistics?group=attendance`. Báo cáo tỷ lệ đi làm đúng giờ, đi muộn, vắng mặt có phép/không phép.
   - *Báo Cáo Phân Công Giao Việc*: Điều hướng `/workflow`. Xem bản đồ nhiệt khối lượng công việc của từng nhân viên.
3. **Nhánh 3: BÁO CÁO KHÁCH HÀNG CRM**
   - *Phân Tích Phễu Khách Hàng CRM*: Điều hướng `/statistics?group=crm`. Phân tích tỷ lệ chuyển đổi Lead -> Opportunity -> Khách hàng ký hợp đồng.
   - *Báo Cáo Chăm Sóc & Tương Tác*: Điều hướng `/members`. Thống kê tần suất tiếp xúc, lịch sử trao đổi của nhân viên kinh doanh với đối tác.
4. **Nhánh 4: GIÁM SÁT NỀN TẢNG VIONE (Dành riêng cho Super Admin)**
   - *Chỉ Số Tăng Trưởng Nền Tảng*: Điều hướng `/statistics?group=platform`. Tăng trưởng người dùng mới, tỷ lệ kích hoạt gói cước MRR/ARR.
   - *Theo Dõi Mức Độ Hoạt Động DN*: Điều hướng `/platform`. Giám sát điểm sức khỏe (Health Score) và mức độ sử dụng tính năng của các công ty thuê gói.
   - *Nhật Ký Kiểm Toán Toàn Hệ Thống*: Điều hướng `/activity`. Tra cứu toàn bộ lịch sử truy vết bảo mật (Audit Logs) trên toàn hệ thống.

#### 2. Vị trí hiển thị & Cơ chế đồng bộ
* Khi người dùng click vào bất kỳ mục con nào trong Tree Menu, Router nhận query param `?group=...`, tự động chuyển tab hiển thị tương ứng, đồng thời Sidebar tự động mở rộng nhánh cha và đánh dấu viền sáng Vàng Hoàng Gia (`active-branch indicator`) cho chức năng đang xem.

---

### UC-CRM-25: Quản Trị Giao Việc Cho Nhân Sự Doanh Nghiệp (Task Assignment & Realtime Status Sync)
* **Tác nhân:** Giám đốc (CEO), Trưởng phòng, Quản trị viên doanh nghiệp có cờ `can_assign_tasks = true`.
* **Màn hình thực hiện:** `/companies/:id?tab=tasks`, `CompanyTasksTab.tsx`.
* **Tiền điều kiện:** Doanh nghiệp đã được kích hoạt trên hệ thống và có ít nhất 1 nhân viên.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Giao Việc Cho Nhân Sự
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `title` | Tiêu đề nhiệm vụ | `TextInput` | `VD: Khảo sát hiện trạng và gửi báo giá cho khách hàng X` | Bắt buộc. Từ 5 đến 200 ký tự. | `Tiêu đề nhiệm vụ không được để trống (5-200 ký tự)!` |
| `description` | Nội dung giao việc | `Textarea` (3 dòng) | `Mô tả cụ thể yêu cầu công việc, phạm vi triển khai và kết quả mong đợi...` | Tùy chọn. Tối đa 1500 ký tự. | `Mô tả không vượt quá 1500 ký tự!` |
| `assignee_id` | Nhân sự thực hiện | `SelectDropdown` / Multi-select | `Chọn nhân sự nhận việc` | Bắt buộc. Nạp từ danh sách nhân viên của doanh nghiệp (`public.company_employees`). Hỗ trợ chọn đồng loạt nhiều nhân viên qua API `/companies/:id/tasks/bulk`. | `Vui lòng chọn nhân sự thực hiện công việc!` |
| `priority` | Mức độ ưu tiên | `SelectDropdown` | `urgent, high, normal, medium, low` | Bắt buộc. Mặc định `normal`. | N/A |
| `due_date` | Hạn hoàn thành (Deadline) | `DateTimePicker` | `dd/mm/yyyy hh:mm` | Bắt buộc. Phải lớn hơn thời điểm hiện tại. | `Hạn chót phải lớn hơn thời điểm hiện tại!` |
| `customer_name` | Khách hàng liên quan | `TextInput` | `VD: Tập đoàn ABC, Anh Tuấn Giám Đốc...` | Tùy chọn. Phục vụ theo dõi chăm sóc khách hàng mục tiêu. | N/A |

#### 2. Vị trí hiển thị bản ghi & Cơ chế đẩy dữ liệu về App Native
* **Vị trí hiển thị trên CRM:**
  1. Bản ghi công việc mới xuất hiện ngay tại **DÒNG ĐẦU TIÊN (DÒNG 1)** của Bảng Quản Trị Công Việc Doanh Nghiệp tại `/companies/:id?tab=tasks`.
  2. Modal giao việc tự động đóng lại.
  3. Xuất hiện Toast Notification Vàng Hoàng Gia: *"Đã giao việc thành công cho nhân sự!"*.
  4. Thẻ đếm KPI trên đầu trang: Thẻ "Chờ nhận việc" hoặc "Tổng đầu việc" tự động tăng +1.
* **Cơ chế đẩy dữ liệu về thiết bị nhân sự (App Native):**
  - Hệ thống lưu vào `public.company_tasks`, đồng thời kích hoạt gửi **Push Notification qua Google FCM và Apple APNs** đến điện thoại của nhân sự được chỉ định.
  - Trên App ViOne Native của nhân sự, màn hình thông báo và danh sách nhiệm vụ tại Tab Cộng đồng / Công việc tự động cập nhật đầu việc mới ở vị trí đầu danh sách, cho phép nhân viên bấm nhận việc và cập nhật checklist trực tiếp trên điện thoại.

---

### UC-CRM-26: Phân Quyền & Vai Trò Riêng Biệt Cho Từng Doanh Nghiệp (Tenant-Isolated RBAC & Role Matrix)
* **Tác nhân:** Chủ doanh nghiệp (CEO), Quản trị viên doanh nghiệp (Admin doanh nghiệp thuê gói).
* **Màn hình thực hiện:** `/companies/:id?tab=permissions`, `CompanyPermissionsTab.tsx`, `EnterpriseTreeMenu.tsx` (nhánh "Phân quyền & Vai trò").
* **Tiền điều kiện:** Doanh nghiệp đã mua và kích hoạt gói ViOne Platform (`companies.status = 'active'`).
* **Mục tiêu:** Cung cấp hệ thống kiểm soát truy cập dựa trên vai trò (RBAC) hoàn toàn biệt lập cho từng doanh nghiệp. Dù các chức năng là giống nhau, nhưng dữ liệu nhóm quyền, ma trận quyền và phân quyền nhân viên của mỗi doanh nghiệp được cô lập 100% (Multi-tenant Data Isolation), không ảnh hưởng lẫn nhau và không dùng chung với phân quyền nền tảng.
* **Thay đổi luồng & Tinh gọn phân hệ:**
  - **Loại bỏ tính năng Sự kiện (Events):** Đã gỡ bỏ hoàn toàn tab "Sự kiện" khỏi phân hệ quản trị doanh nghiệp để tinh gọn giao diện và tập trung vào nghiệp vụ vận hành cốt lõi.
  - **Loại bỏ tính năng Kết nối đối tác (Business Connect):** Đã gỡ bỏ chức năng kết nối đối tác B2B khỏi phân hệ quản trị doanh nghiệp, chuyển trọng tâm phân hệ sang điều hành nội bộ và quản trị khách hàng chuyên sâu.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Tạo / Chỉnh Sửa Nhóm Quyền Riêng Doanh Nghiệp
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Tên nhóm quyền / Vai trò | `TextInput` | `VD: Kế toán trưởng, Quản lý dự án, Nhân viên kinh doanh` | Bắt buộc. Từ 2 đến 100 ký tự. Không trùng tên trong cùng một doanh nghiệp. | `Vui lòng nhập tên nhóm quyền hợp lệ!` |
| `code` | Mã định danh vai trò | `TextInput` (In hoa / slug) | `VD: ACC_CHIEF, PM_LEAD, SALES_REP` | Bắt buộc khi tạo mới. Từ 3 đến 50 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới `_`. | `Mã vai trò không hợp lệ (3-50 ký tự, không dấu)!` |
| `description` | Mô tả vai trò & phạm vi | `Textarea` (3 dòng) | `Mô tả cụ thể trách nhiệm và quyền hạn trong doanh nghiệp...` | Tùy chọn. Tối đa 500 ký tự. | `Mô tả không vượt quá 500 ký tự!` |
| `permissions` | Danh sách quyền kích hoạt | `MatrixCheckboxGroup` | N/A | Chọn các quyền hạn cụ thể theo từng module (`crm`, `hr`, `projects`, `finance`, `settings`). | N/A |

#### 2. Bảng Đặc Tả Form Gán Quyền & Cập Nhật Quyền Hạn Cho Nhân Sự Doanh Nghiệp
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `employee_id` | Nhân sự được phân quyền | `SelectDropdown` (Read-only khi sửa) | `Chọn nhân sự trong doanh nghiệp` | Bắt buộc. Phải thuộc danh sách nhân sự của doanh nghiệp (`public.company_employees`). | `Nhân sự không tồn tại!` |
| `role_code` | Nhóm vai trò chính | `SelectDropdown` | `Chọn nhóm quyền...` | Bắt buộc. Nạp từ danh sách vai trò riêng của doanh nghiệp (`GET /roles/company/:id`). | `Vui lòng chọn nhóm quyền!` |
| `custom_permissions` | Quyền ngoại lệ tùy chỉnh | `CheckboxList` | N/A | Tùy chọn. Cho phép thêm/bớt quyền đặc thù cho nhân sự mà không ảnh hưởng cả nhóm vai trò. | N/A |

#### 3. Cấu Trúc 3 Tiểu Phân Hệ (Subtabs) & Vị Trí Hiển Thị Bản Ghi
1. **Tiểu phân hệ 1: Ma Trận Phân Quyền Động (Dynamic Permission Matrix):**
   - Trực quan hóa toàn bộ ma trận theo chiều ngang (các module chức năng) và chiều dọc (các vai trò của công ty).
   - Hỗ trợ click bật/tắt tức thì các hành động: `Xem` (read), `Thêm` (create), `Sửa` (update), `Xóa` (delete), `Phê duyệt` (approve), `Xuất file` (export).
   - Nút lưu "Lưu Ma Trận Quyền" sử dụng gradient Champagne Gold. Khi bấm lưu, hệ thống gửi request `PUT /roles/company/:id/:roleId/permissions` và cập nhật trực tiếp vào PostgreSQL.
2. **Tiểu phân hệ 2: Danh Mục Nhóm Quyền (Role Groups Directory):**
   - Hiển thị danh sách các vai trò riêng của doanh nghiệp dưới dạng card sang trọng phong cách Obsidian viền mạ vàng.
   - Thống kê số lượng nhân sự đang giữ vai trò này, số lượng quyền hạn đã cấp, và nút Chỉnh sửa / Xóa (đối với vai trò tự tạo).
   - Nút "+ Thêm Nhóm Quyền" mở modal tạo vai trò mới, gán `company_id = <companyId>` để đảm bảo phân lập dữ liệu.
3. **Tiểu phân hệ 3: Phân Quyền Nhân Viên (Employee Permission Management):**
   - Hiển thị toàn bộ nhân viên của doanh nghiệp kèm ảnh đại diện, email, chức vụ và nhóm quyền được gán.
   - Nút "Chỉnh Sửa Quyền" mở modal gán vai trò nhanh hoặc cấp quyền bổ sung.
   - Dữ liệu lưu vào `public.company_employees.permissions` (JSONB) và đồng bộ qua API `PUT /roles/company/:id/employees/:employeeId/permissions`.

#### 4. Cơ Chế Phân Lập Dữ Liệu & Đồng Bộ Thời Gian Thực (Multi-tenant Isolation & Reactive Sync)
* **Phân lập CSDL tuyệt đối:** Mọi truy vấn vai trò đều gắn điều kiện `company_id = :companyId`. Vai trò hệ thống chung có `company_id IS NULL` chỉ đóng vai trò template mẫu và không bị sửa đổi bởi các doanh nghiệp.
* **Đồng bộ thời gian thực:** Khi thay đổi quyền hạn nhân viên, hệ thống phát tín hiệu qua `BroadcastChannel('vione_rbac_sync')`. Nếu nhân viên đó đang đăng nhập trên Web CRM hoặc App Native, quyền hạn mới được nạp lại tự động mà không cần đăng xuất.

---

### UC-CRM-27: Quản Trị Cấu Hình Hệ Thống Đồng Bộ CSDL Toàn Diện (System Configuration & Third-party Integrations)
* **Tác nhân:** Quản trị viên Doanh nghiệp, Super Admin hệ thống.
* **Màn hình thực hiện:** `/settings`, `routes/settings.tsx`, `settings.functions.ts`.
* **Tiền điều kiện:** Đăng nhập tài khoản có quyền quản trị cấu hình (`settings_manage` hoặc `company_admin`).
* **Mục tiêu:** Đảm bảo 100% các dữ liệu cấu hình hệ thống, tổ chức và tích hợp bên thứ ba được lưu trữ vĩnh viễn vào CSDL PostgreSQL (`public.app_settings`, `public.associations`, `public.user_settings`), loại bỏ hoàn toàn việc dùng dữ liệu giả (mock) hay chỉ lưu tạm thời ở client state.

#### 1. Bảng Đặc Tả Trường Dữ Liệu Form Cấu Hình Hệ Thống
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `orgName` | Tên tổ chức / Doanh nghiệp | `TextInput` | `VD: ViOne Global Platform` | Bắt buộc. Từ 3 đến 150 ký tự. | `Tên tổ chức không được để trống (3-150 ký tự)!` |
| `orgEmail` | Email liên hệ chính thức | `TextInput` (email) | `contact@vione.vn` | Bắt buộc. Định dạng email chuẩn. | `Email liên hệ không hợp lệ!` |
| `hotline` | Hotline hỗ trợ khách hàng | `TextInput` (tel) | `1900 6868 hoặc 0901 234 567` | Tùy chọn. Từ 8 đến 20 ký tự số/khoảng trắng. | `Hotline không hợp lệ!` |
| `websiteUrl` | Địa chỉ Website chính thức | `TextInput` (url) | `https://vione.vn` | Tùy chọn. Phải có giao thức `http://` hoặc `https://`. | `Đường dẫn website không hợp lệ!` |
| `slogan` | Khẩu hiệu / Slogan thương hiệu | `TextInput` | `VD: Nền Tảng Kết Nối & Vận Hành Doanh Nghiệp Toàn Diện` | Tùy chọn. Tối đa 255 ký tự. | `Slogan không vượt quá 255 ký tự!` |
| `lang` | Ngôn ngữ mặc định hệ thống | `SelectDropdown` | `vi (Tiếng Việt) / en (Tiếng Anh)` | Bắt buộc. Mặc định `vi`. | N/A |
| `emailNotif` | Nhận thông báo qua Email | `ToggleSwitch` | `Bật / Tắt` | Boolean (`true` / `false`). Mặc định `true`. | N/A |
| `smsNotif` | Nhận thông báo qua SMS / ZNS | `ToggleSwitch` | `Bật / Tắt` | Boolean (`true` / `false`). Mặc định `false`. | N/A |
| `twoFa` | Bắt buộc xác thực 2 bước 2FA | `ToggleSwitch` | `Bật / Tắt` | Boolean (`true` / `false`). | N/A |

#### 2. Đặc Tả Tích Hợp Ứng Dụng Bên Thứ Ba (Third-party Integrations)
| Tên Tích Hợp | Mã (Key) | Mô Tả & Tính Năng | Trạng Thái & Nút Điều Khiển |
| :--- | :--- | :--- | :--- |
| **Zalo Official Account (Zalo OA)** | `zalo_oa` | Tự động gửi tin nhắn chăm sóc khách hàng, thông báo biến động số dư và xác nhận đơn hàng qua Zalo ZNS. | `ToggleSwitch` / Nút "Kết Nối Zalo OA" (Gradient Champagne Gold) & "Hủy Kết Nối". Trạng thái lưu vào CSDL. |
| **Google Workspace** | `google_workspace` | Đồng bộ lịch họp Google Calendar, gửi thư qua Gmail API và lưu trữ tài liệu doanh nghiệp trên Google Drive. | `ToggleSwitch` / Nút "Kết Nối Google" & "Hủy Kết Nối". |
| **Microsoft Teams** | `microsoft_teams` | Đẩy thông báo công việc, nhắc lịch họp và tương tác dự án tức thì vào kênh Teams của doanh nghiệp. | `ToggleSwitch` / Nút "Kết Nối MS Teams" & "Hủy Kết Nối". |
| **Slack Corporate** | `slack` | Tích hợp webhook cảnh báo hệ thống, thông báo phê duyệt tờ trình chi và nhắc hạn công việc Kanban. | `ToggleSwitch` / Nút "Kết Nối Slack" & "Hủy Kết Nối". |

#### 3. Form Đổi Mật Khẩu Quản Trị Viên (Security & Password Update)
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `current_password` | Mật khẩu hiện tại | `TextInput` (password) | `••••••••` | Bắt buộc. Kiểm tra đối chiếu với mật khẩu đã băm (bcrypt) trong CSDL. | `Mật khẩu hiện tại không chính xác!` |
| `new_password` | Mật khẩu mới | `TextInput` (password) | `Tối thiểu 6 ký tự` | Bắt buộc. Tối thiểu 6 ký tự. Không được trùng mật khẩu cũ. | `Mật khẩu mới phải từ 6 ký tự trở lên!` |
| `confirm_password` | Xác nhận mật khẩu mới | `TextInput` (password) | `••••••••` | Bắt buộc. Phải khớp 100% với `new_password`. | `Xác nhận mật khẩu mới không khớp!` |

#### 4. Cơ Chế Lưu Trữ Vĩnh Viễn & Đồng Bộ Thời Gian Thực (Persistence & Reactivity)
1. **Lưu trữ CSDL 3 tầng (3-Tier PostgreSQL Persistence):**
   - **Tầng 1 (`public.app_settings`):** Lưu trữ toàn bộ payload cấu hình hệ thống dưới dạng JSONB với `key = 'system_config'` (bao gồm thông tin tổ chức, hotline, website, slogan, ngôn ngữ, cờ thông báo, bảo mật và trạng thái 4 ứng dụng tích hợp).
   - **Tầng 2 (`public.associations`):** Đồng bộ tự động các trường cốt lõi như `name` (tên tổ chức) và `tagline` (khẩu hiệu) vào bản ghi hiệp hội/tổ chức đang hoạt động.
   - **Tầng 3 (`public.user_settings`):** Cập nhật cấu hình người dùng cá nhân để đảm bảo trải nghiệm thống nhất.
2. **Cơ chế phản ứng tức thì (Instant Reactive UI):**
   - Ngay sau khi bấm "Lưu Thay Đổi" và API `PUT /settings/system` trả về thành công:
     - Hệ thống hiển thị Toast Notification Vàng Hoàng Gia: *"Đã lưu toàn bộ cấu hình hệ thống thành công!"*.
     - Lưu thông tin cập nhật vào `localStorage`.
     - Kích hoạt sự kiện trình duyệt `window.dispatchEvent(new CustomEvent('association-changed', { detail: { name, slogan } }))` và `vione-settings-updated`.
     - Tên tổ chức ở Header, Sidebar và Tab Title trên trình duyệt lập tức thay đổi theo tên mới mà không cần F5 lại trang.

---

### UC-CRM-28: Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp Chuẩn Google Drive (`/documents`)
* **Tác nhân:** Giám đốc, Kế toán trưởng, Quản lý Nhân sự, Nhân viên các phòng ban.
* **Màn hình thực hiện:** `/documents`, `routes/documents.index.tsx`, `lib/documents.functions.ts`.
* **Tiền điều kiện:** Đăng nhập tài khoản doanh nghiệp hợp lệ.
* **Mục tiêu:** Cung cấp kho lưu trữ số hóa tài liệu doanh nghiệp chuẩn mực theo kiến trúc Google Drive với cấu trúc thư mục lồng nhau đa cấp (Nested Folders), breadcrumbs điều hướng phân cấp, phân loại 6 danh mục nghiệp vụ cốt lõi, ghim sao, tìm kiếm và chuyển đổi linh hoạt giao diện Lưới (Grid) / Bảng (List).

#### 1. Bảng Đặc Tả Trường Dữ Liệu Quản Trị Thư Mục & Tài Liệu
| Tên trường (Key) | Nhãn (Label) | Kiểu dữ liệu & Control | Placeholder | Quy tắc Kiểm thực (Validation Rules) | Thông báo lỗi (Error Messages) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | Tên thư mục / Tài liệu | `TextInput` | `VD: Hợp đồng kinh tế 2026` | Bắt buộc. Từ 2 đến 200 ký tự. Không chứa ký tự cấm: `\ / : * ? " < > \|`. | `Tên thư mục/tài liệu không hợp lệ!` |
| `parent_id` | Thư mục cha | `SelectDropdown` / Breadcrumb | `Chọn thư mục cha (hoặc Thư mục gốc)` | Tùy chọn. UUID hợp lệ trong `public.document_folders`. Cho phép đa cấp không giới hạn. | `Thư mục cha không tồn tại!` |
| `category` | Danh mục tài liệu | `SelectDropdown` / Chips | `Chọn danh mục nghiệp vụ` | Bắt buộc. Chọn từ 6 danh mục chuẩn: Pháp Lý & ĐKKD, Hợp Đồng & Phụ Lục, Tài Chính & Thuế, Nhân Sự & Tiền Lương, Quy Chế & Vận Hành, Kỹ Thuật & Dự Án. | `Vui lòng chọn danh mục tài liệu!` |
| `color` | Màu sắc nhận diện thư mục | `ColorPicker` / Preset Dots | `Mặc định Champagne Gold (#D8B282)` | Tùy chọn. Mã màu Hex chuẩn. | N/A |
| `file` | Tệp tin đính kèm | `FileInput` (Drag & Drop) | `Kéo thả tệp tin hoặc nhấn để chọn...` | Hỗ trợ PDF, DOCX, XLSX, PPTX, JPG, PNG. Dung lượng tối đa 50MB/file. | `Tệp vượt quá dung lượng 50MB hoặc không đúng định dạng!` |
| `is_starred` | Ghim dấu sao ưu tiên | `IconButton` (Star Icon) | N/A | Boolean. Mặc định `false`. | N/A |

#### 2. Vị Trí Hiển Thị & Cơ Chế Đồng Bộ
* **Thanh điều hướng Breadcrumbs:** Hiển thị cây thư mục động `Kho Lưu Trữ > [Thư Mục Cấp 1] > [Thư Mục Cấp 2]` kèm nút quay lại cấp trước. Nhấn vào bất kỳ cấp nào sẽ chuyển thẳng đến thư mục đó.
* **Lưới Thư Mục Obsidian Gold:** Hiển thị thẻ thư mục với số lượng tệp bên trong, danh mục và các tác vụ Đổi tên, Xóa.
* **Cơ chế cập nhật:** Dữ liệu lưu vào bảng `public.document_folders`, `public.documents` và `public.document_categories` trong PostgreSQL. Khi tải lên tệp mới, danh sách tự động cập nhật và bộ đếm tệp tin của thư mục cha tự động tăng tức thời.

---

### UC-CRM-29: Kiến Trúc Điều Hướng Phân Tách Doanh Nghiệp & Tooltip Đa Điểm Sidebar
* **Tác nhân:** Toàn bộ người dùng Web CRM ViOne.
* **Màn hình thực hiện:** `components/dashboard/Sidebar.tsx`, `components/dashboard/EnterpriseTreeMenu.tsx`.
* **Tiền điều kiện:** Đăng nhập vào hệ thống Web CRM ViOne.
* **Mục tiêu:** Tinh giản cấu trúc điều hướng, phân tách độc lập giữa Phân hệ Doanh nghiệp và Phân hệ Quản trị Nền tảng, đồng thời trang bị Tooltip viền vàng Obsidian chống tràn chữ 3 dấu chấm (...).

#### 1. Quy Chuẩn Phân Tách Phân Hệ (Two-Tier View Isolation)
* **Phân hệ Doanh nghiệp (`effectiveView === 'company'`):**
  - **LOẠI BỎ HOÀN TOÀN** chức năng Quản lý doanh nghiệp (`/companies`) vì doanh nghiệp không tự quản lý danh sách công ty khác. Quản lý nhân sự được điều hướng chuẩn qua `/members`.
  - **LOẠI BỎ HOÀN TOÀN** cây menu "Doanh nghiệp của tôi" (EnterpriseTreeMenu); khi đăng nhập, hệ thống tự động hiển thị các chức năng khả dụng theo gói đã mua.
  - Phân định thành 6 nhóm nghiệp vụ: `NHÂN SỰ & CHẤM CÔNG`, `VẬN HÀNH & CÔNG VIỆC`, `TÀI CHÍNH & DÒNG TIỀN`, `KINH DOANH & CRM`, `TRUYỀN THÔNG & TƯƠNG TÁC`, `CẤU HÌNH & TỔ CHỨC`.
* **Phân hệ Quản trị Nền tảng ViConnect (`effectiveView === 'platform'`):**
  - Dành riêng cho Super Admin và nhân sự ViConnect: `TỔNG QUAN NỀN TẢNG`, `QUẢN LÝ DOANH NGHIỆP & HỘI VIÊN`, `GÓI CƯỚC & DOANH THU`, `MẠNG LƯỚI & GIAO THƯƠNG`, `BÁO CÁO & THỐNG KÊ TOÀN DIỆN`, `AN NINH & HỆ THỐNG`.

#### 2. Cơ Chế Tooltip Đa Điểm (Sidebar Tooltip Engine)
* Tích hợp Radix UI Tooltip trên 100% các mục điều hướng (NavItems).
* Hiển thị Tooltip sang trọng phong cách Đen Thạch Anh Mạ Vàng (`bg-[#0B0F17] text-[#F6E1C3] border border-[#D8B282]/40 shadow-2xl`) với độ trễ mở 150ms.
* Khắc phục triệt để lỗi thẩm mỹ khi tên tính năng dài bị cắt thành dấu ba chấm (...) trên Sidebar, đảm bảo người dùng luôn đọc được trọn vẹn tên tính năng và badge trạng thái.
### UC-CRM-30: Tinh Gọn Phân Hệ Doanh Nghiệp - Tách Rời Hoàn Toàn Thu Chi Tài Chính, Trọng Tâm Giao Việc & Tiến Độ
* **Tác nhân:** Ban Lãnh đạo Doanh nghiệp, Trưởng phòng ban, Nhân sự thành viên.
* **Màn hình thực hiện:** `components/dashboard/Sidebar.tsx`, `components/dashboard/ExecutiveDashboard.tsx`, `components/dashboard/ReportsTreeMenu.tsx`, `routes/workflow.index.tsx`.
* **Tiền điều kiện:** Người dùng đăng nhập tài khoản Doanh nghiệp hoặc kích hoạt chế độ làm việc `workspaceView === 'company'`.
* **Mục tiêu:** Tinh giản hóa giao diện doanh nghiệp, loại bỏ hoàn toàn các màn hình/chỉ số liên quan đến dòng tiền, kế toán, hóa đơn và thu chi; chuyển đổi 100% trọng tâm sang quản lý giao việc (Task Delegation & Workflow), theo dõi tiến độ công việc và phối hợp điều hành nội bộ.

#### 1. Quy Chuẩn Triệt Tiêu Chức Năng Tiền & Doanh Thu ở Phân Hệ Doanh Nghiệp
* **Sidebar Điều Hướng:** Loại bỏ hoàn toàn khối `companyFinanceSuite` (Hóa đơn `/invoices`, Thu phí hội viên `/fees`, Báo cáo doanh thu & dòng tiền).
* **Cây Báo Cáo (ReportsTreeMenu):** Khi `view === 'company'`, tự động ẩn hoàn toàn nhánh "Tài chính & Thu chi", chỉ giữ lại báo cáo công việc, nhân sự và vận hành.
* **Dashboard Điều Hành Doanh Nghiệp (ExecutiveDashboard):**
  - Triệt tiêu các thẻ KPI tài chính (`Doanh thu tháng`, `Công nợ quá hạn`, `Dòng tiền thu chi`).
  - Thay thế bằng Thẻ KPI vận hành thực chiến: `Công việc cần xử lý` (chuyển hướng `/workflow`) và `Nhiệm vụ hoàn thành` (chuyển hướng `/workflow`).
  - Khối biểu đồ thu chi và nợ phí được thay thế bằng:
    1. **Bảng Điều Hành Giao Việc & Nhiệm Vụ Doanh Nghiệp:** Hiển thị trực quan trạng thái công việc (Cần làm, Đang làm, Hoàn thành), giới hạn WIP (Work In Progress), tiến độ hoàn thành % tổng thể kèm nút CTA "Tới Bảng Việc Kanban".
    2. **Phân Bổ Giao Việc & Nhân Sự Doanh Nghiệp:** Hiển thị thống kê số lượng công việc đã giao cho từng phòng ban (Ban Điều hành, Kinh doanh & Marketing, Kỹ thuật & Sản phẩm, Vận hành & Hành chính), tỉ lệ hoàn thành nhiệm vụ theo thời gian thực.
  - Nút Tác vụ nhanh (Quick Action): Thay thế nút "Tạo phiếu thu phí" bằng nút "Giao việc mới" trỏ trực tiếp đến `/workflow`.
  - Thanh tìm kiếm Spotlight: Tự động lọc bỏ các gợi ý tìm kiếm liên quan đến "Hóa đơn & Doanh thu" khi ở chế độ doanh nghiệp.

---

### UC-CRM-31: Phân Hệ Quản Trị ViConnect Platform - Quản Lý Tài Liệu ViConnect Drive, Lịch Họp, Giao Việc & Hệ Sinh Thái Thể Thao / Di Sản Số
* **Tác nhân:** Ban Lãnh đạo ViConnect, Super Admin hệ thống.
* **Màn hình thực hiện:**
  - Cụm Điều Hành: Kho tài liệu (`/documents`), Lịch họp (`/meetings`), Quản lý giao việc (`/workflow`).
  - Cụm Thể Thao & Cộng Đồng: ViOne Event (`/events`), ViOne Sport (`/platform/sport`), ViOne Run (`/platform/run`).
  - Cụm Văn Hóa & Di Sản: ViOne Heritage (`/platform/heritage`), ViOne Museum (`/platform/museum`), ViOne Archive (`/platform/archive`), ViOne Ticket (`/platform/tickets`), ViOne Review (`/platform/review`).
* **Tiền điều kiện:** Người dùng có quyền Quản trị Nền tảng (`workspaceView === 'platform'` hoặc Super Admin).
* **Mục tiêu:** Cung cấp trọn vẹn bộ công cụ điều hành nền tảng ViConnect (Drive, Lịch họp, Giao việc) và các phân hệ chức năng chuyên sâu tương ứng với 2 trụ cột hệ sinh thái ViOne: Cộng Đồng & Doanh Nghiệp và Văn Hóa & Di Sản.

#### 1. Cụm Vận Hành & Điều Hành ViConnect
* **Kho Tài Liệu ViConnect Drive (`/documents`):** Hệ thống lưu trữ tệp tin phân cấp chuẩn mực (Nested Folders), breadcrumbs, phân loại 6 danh mục, ghim sao, tìm kiếm và phân quyền xem/tải tài liệu doanh nghiệp & hiệp hội.
* **Lịch Họp & Phòng Họp Số (`/meetings`):** Lên lịch các phiên họp thường niên, họp ban chấp hành, liên kết Google Meet/Zoom, điểm danh tự động bằng mã QR và lưu biên bản cuộc họp số.
* **Quản Lý Giao Việc Nền Tảng (`/workflow`):** Bảng Kanban điều phối công việc giữa các phòng ban ViConnect, phân công người phụ trách, gắn nhãn độ ưu tiên, đính kèm tài liệu và thiết lập hạn chót (Deadline).

#### 2. Cụm Chức Năng Hệ Sinh Thái Mới (2 Trụ Cột ViOne)
* **Trụ Cột 1: Cộng Đồng & Doanh Nghiệp**
  - `ViOne Sport` (`/platform/sport`): Quản lý giải đấu thể thao doanh nghiệp, câu lạc bộ bóng đá/tennis/golf/pickleball, bảng xếp hạng, lịch thi đấu vòng bảng và nhánh đấu (Bracket).
  - `ViOne Run` (`/platform/run`): Quản lý giải chạy marathon/trail run, đồng bộ chip timing RFID, quản lý số BIB vận động viên, kiểm soát các cổng Checkpoint (CP/Split) và cập nhật bảng xếp hạng Pace/Gun Time/Chip Time thời gian thực.
  - `ViOne Event` (`/events`): Tổ chức hội nghị, triển lãm giao thương B2B, check-in QR Code siêu tốc dưới 1 giây.
  - `ViOne Review` (`/platform/review`): Quản lý giải pháp thẻ chạm NFC thông minh NTAG213 đặt tại bàn thu ngân/quầy dịch vụ, thúc đẩy khách hàng đánh giá 5 sao Google Maps/Facebook cho doanh nghiệp thành viên.
* **Trụ Cột 2: Văn Hóa & Di Sản**
  - `ViOne Heritage` (`/platform/heritage`): Quản lý và số hóa di sản văn hóa vật thể & phi vật thể, tọa độ GIS bản đồ di sản, tích hợp tour tham quan thực tế ảo VR360.
  - `ViOne Museum` (`/platform/museum`): Bảo tàng số 3D, mô hình hiện vật đa chiều (GLTF/USDZ), công nghệ AR và trợ lý thuyết minh âm thanh đa ngôn ngữ (Audio Guide) kích hoạt qua mã QR/NFC.
  - `ViOne Archive` (`/platform/archive`): Lưu trữ số hóa tư liệu lịch sử, mộc bản, văn bia, sắc phong hoàng triều với siêu dữ liệu Dublin Core, phân loại niên đại và lưu trữ bảo quản an toàn.
  - `ViOne Ticket` (`/platform/tickets`): Hệ thống phát hành vé điện tử sự kiện, di tích, bảo tàng; soát vé qua cổng kiểm soát quang học/camera QR, thanh toán tự động VietQR NAPAS 247.

#### 3. Bảng Đặc Tả Chi Tiết Chuẩn RESTful API (Full CRUD HTTP Verbs)
* **Quy chuẩn thiết kế:**
  - Resource URLs sử dụng danh từ số nhiều (`/documents`, `/tournaments`, `/clubs`, `/races`, `/heritage`, `/museums`, `/artifacts`, `/archives`, `/tickets`, `/reviews/stores`).
  - Sử dụng chuẩn mực các HTTP Verbs:
    * `GET`: Truy vấn danh sách có phân trang, bộ lọc (query params) hoặc lấy chi tiết tài nguyên theo ID (`GET /:id`).
    * `POST`: Tạo mới tài nguyên, trả về mã trạng thái 201 Created cùng dữ liệu đối tượng vừa khởi tạo.
    * `PUT`: Cập nhật toàn diện thông tin tài nguyên theo ID (`PUT /:id`), trả về bản ghi sau cập nhật.
    * `DELETE`: Xóa tài nguyên theo ID (`DELETE /:id`), trả về đối tượng đã xóa hoặc thông báo xác nhận thành công.
  - Phân quyền (Auth & Tenant): Kiểm tra token JWT, tự động gán và cô lập dữ liệu theo `company_id` / `user_id`.

| STT | Phân Hệ | HTTP Method | Endpoint URI | Mô Tả Nghiệp Vụ | Dữ Liệu Payload (Body / Params) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Documents | `GET` | `/api/documents` | Lấy danh sách tài liệu Drive (lọc folder, category, search, starred) | `folder_id`, `category`, `search`, `starred` |
| 2 | Documents | `GET` | `/api/documents/:id` | Lấy thông tin chi tiết một tài liệu | Path param `id` |
| 3 | Documents | `POST` | `/api/documents/folders` | Tạo thư mục mới trong Drive | `{ name, parent_id, category, color }` |
| 4 | Documents | `POST` | `/api/documents/categories` | Tạo danh mục phân loại tài liệu mới | `{ name, code, description, color }` |
| 5 | Documents | `PUT` | `/api/documents/categories/:id` | Cập nhật thông tin danh mục tài liệu | `{ name, description, color }` |
| 6 | Documents | `DELETE` | `/api/documents/categories/:id`| Xóa danh mục phân loại tài liệu | Path param `id` |
| 7 | Sport | `GET` | `/api/platform-hub/sport/tournaments` | Lấy danh sách giải đấu thể thao | `sport_type`, `status` |
| 8 | Sport | `POST` | `/api/platform-hub/sport/tournaments` | Tạo mới giải đấu thể thao | `{ name, sport_type, format, start_date, end_date, venue, province }` |
| 9 | Sport | `PUT` | `/api/platform-hub/sport/tournaments/:id` | Cập nhật thông tin giải đấu thể thao | `{ name, format, status, venue, banner_url, ... }` |
| 10 | Sport | `DELETE` | `/api/platform-hub/sport/tournaments/:id` | Xóa giải đấu thể thao | Path param `id` |
| 11 | Sport | `POST` | `/api/platform-hub/sport/clubs` | Thành lập CLB thể thao doanh nghiệp | `{ name, sport_type, leader_name, venue, schedule_info }` |
| 12 | Sport | `PUT` | `/api/platform-hub/sport/clubs/:id` | Hiệu chỉnh thông tin CLB thể thao | `{ name, leader_name, venue, schedule_info, members_count }` |
| 13 | Sport | `DELETE` | `/api/platform-hub/sport/clubs/:id` | Giải tán / Xóa CLB thể thao | Path param `id` |
| 14 | Run | `GET` | `/api/platform-hub/run/races` | Lấy danh sách giải chạy marathon/trail | `status` |
| 15 | Run | `POST` | `/api/platform-hub/run/races` | Khởi tạo giải chạy marathon mới | `{ name, location, race_date, distances, banner_url }` |
| 16 | Run | `PUT` | `/api/platform-hub/run/races/:id` | Cập nhật cấu hình & cự ly giải chạy | `{ name, race_date, distances, status, ... }` |
| 17 | Run | `DELETE` | `/api/platform-hub/run/races/:id` | Xóa giải chạy marathon | Path param `id` |
| 18 | Run | `POST` | `/api/platform-hub/run/timing` | Bắn tín hiệu chíp RFID thảm đo thời gian | `{ race_id, bib, split_name, timestamp }` |
| 19 | Heritage | `GET` | `/api/platform-hub/heritage` | Danh sách hồ sơ di sản văn hóa GIS | `type`, `status`, `search` |
| 20 | Heritage | `POST` | `/api/platform-hub/heritage` | Đăng ký hồ sơ số hóa di sản mới | `{ name, type, province, coordinates, period, vr360_url, ... }` |
| 21 | Heritage | `PUT` | `/api/platform-hub/heritage/:id` | Hiệu chỉnh thông tin hồ sơ di sản | `{ name, type, coordinates, description, vr360_url, status }` |
| 22 | Heritage | `DELETE` | `/api/platform-hub/heritage/:id` | Thu hồi / Xóa hồ sơ di sản | Path param `id` |
| 23 | Museum | `GET` | `/api/platform-hub/museums` | Danh sách bảo tàng số & phòng trưng bày | `province`, `search` |
| 24 | Museum | `POST` | `/api/platform-hub/museums` | Tạo mới bảo tàng số trên nền tảng | `{ name, code, address, province, ticket_price, vr_tour_url }` |
| 25 | Museum | `PUT` | `/api/platform-hub/museums/:id` | Cập nhật thông tin bảo tàng số | `{ name, address, ticket_price, opening_hours, vr_tour_url }` |
| 26 | Museum | `DELETE` | `/api/platform-hub/museums/:id` | Đóng / Xóa phòng trưng bày bảo tàng | Path param `id` |
| 27 | Museum | `GET` | `/api/platform-hub/artifacts` | Danh mục hiện vật 3D Photogrammetry | `museum_id`, `category` |
| 28 | Museum | `POST` | `/api/platform-hub/artifacts` | Thêm hiện vật 3D & gán thẻ NFC quầy | `{ museum_id, code, name, category, dynasty, model_3d_url, nfc_uid }` |
| 29 | Museum | `PUT` | `/api/platform-hub/artifacts/:id` | Cập nhật hiện vật 3D & audio guide | `{ name, category, model_3d_url, audio_guide_vn, nfc_uid }` |
| 30 | Museum | `DELETE` | `/api/platform-hub/artifacts/:id` | Gỡ bỏ hiện vật 3D khỏi bảo tàng | Path param `id` |
| 31 | Archive | `GET` | `/api/platform-hub/archives` | Kho tư liệu lưu trữ số hóa lịch sử | `collection`, `format`, `search` |
| 32 | Archive | `POST` | `/api/platform-hub/archives` | Lưu trữ tư liệu lịch sử số hóa mới | `{ title, code, collection, era, author, digital_url, tags }` |
| 33 | Archive | `PUT` | `/api/platform-hub/archives/:id` | Hiệu chỉnh siêu dữ liệu tư liệu số | `{ title, collection, era, author, digital_url, security_level }` |
| 34 | Archive | `DELETE` | `/api/platform-hub/archives/:id` | Xóa tư liệu lưu trữ khỏi kho | Path param `id` |
| 35 | Tickets | `GET` | `/api/platform-hub/tickets` | Danh sách vé điện tử đã phát hành | `target_type`, `status`, `search` |
| 36 | Tickets | `POST` | `/api/platform-hub/tickets` | Phát hành vé điện tử (di tích/giải/vé) | `{ code, title, target_type, target_name, price, user_name }` |
| 37 | Tickets | `PUT` | `/api/platform-hub/tickets/:id` | Cập nhật trạng thái vé điện tử | `{ status, seat_number, checked_in_at }` |
| 38 | Tickets | `DELETE` | `/api/platform-hub/tickets/:id` | Hủy bỏ / Thu hồi vé điện tử | Path param `id` |
| 39 | Tickets | `POST` | `/api/platform-hub/tickets/validate` | Cổng soát vé quét QR / NFC Check-in | `{ code, device_id }` |
| 40 | Review | `GET` | `/api/platform-hub/reviews/stores` | Danh sách điểm chạm NFC Google Maps | `province`, `search` |
| 41 | Review | `POST` | `/api/platform-hub/reviews/stores` | Đăng ký điểm chạm thẻ NFC NTAG213 | `{ store_name, address, google_place_id, map_url, nfc_tag_uid }` |
| 42 | Review | `PUT` | `/api/platform-hub/reviews/stores/:id` | Cập nhật liên kết điểm chạm & voucher | `{ store_name, address, map_url, voucher_title, discount_percent }` |
| 43 | Review | `DELETE` | `/api/platform-hub/reviews/stores/:id` | Hủy điểm chạm thẻ NFC cửa hàng | Path param `id` |

---

### UC-CRM-32: Giao Diện Quản Trị CRM Admin Cho 7 Phân Hệ Mới & Cơ Chế Đồng Bộ RESTful
* **Tác nhân:** Quản trị viên ViConnect, Điều hành viên sự kiện & di sản.
* **Màn hình thực hiện:**
  - `components/platform-app/admin/SportAdminManager.tsx`
  - `components/platform-app/admin/RunAdminManager.tsx`
  - `components/platform-app/admin/HeritageAdminManager.tsx`
  - `components/platform-app/admin/MuseumAdminManager.tsx`
  - `components/platform-app/admin/ArchiveAdminManager.tsx`
  - `components/platform-app/admin/TicketAdminManager.tsx`
  - `components/platform-app/admin/ReviewAdminManager.tsx`
  - Định tuyến CRM: `routes/platform.sport.tsx`, `platform.run.tsx`, `platform.heritage.tsx`, `platform.museum.tsx`, `platform.archive.tsx`, `platform.tickets.tsx`, `platform.review.tsx`.
* **Mục tiêu:** Trang bị giao diện Quản trị viên (CRM Admin Management) chuyên nghiệp với đầy đủ bảng dữ liệu (Data Table), bộ lọc tìm kiếm tức thì, hộp thoại thêm mới (POST Modal), hộp thoại chỉnh sửa (PUT Modal), thao tác xóa dữ liệu an toàn (DELETE Action) và cơ chế chuyển đổi mượt mà giữa chế độ Quản trị CRM và chế độ Xem trước Ứng dụng PWA/App.

#### 1. Quy Chuẩn Thiết Kế Giao Diện Quản Trị CRM
* **Bảng Dữ Liệu (Data Table):** Sử dụng nền Đen Thạch Anh Obsidian (`bg-[#0A0E14]`), viền mạ vàng Champagne Gold mờ (`border-[#D8B282]/20`), hiển thị đầy đủ các cột nghiệp vụ, trạng thái gắn badge màu sắc chuẩn UI/UX.
* **Bộ Lọc & Tìm Kiếm:** Hộp tìm kiếm theo từ khóa kết hợp dropdown lọc theo danh mục / trạng thái với debounce thời gian thực.
* **Nút Tác Vụ Gradient Chuẩn ViOne (Strict Rule 8):**
  - Nút thêm mới / Lưu dữ liệu: Gradient Vàng Hoàng Gia (`bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold`).
  - Nút chỉnh sửa / Xem trước: Gradient Đen Thạch Anh Mạ Vàng (`bg-[#121820] text-[#F6E1C3] border border-[#D8B282]/30`).
  - Nút xóa / Hủy: Gradient Đỏ Ruby (`bg-gradient-to-r from-red-600 to-red-800 text-white font-bold`).
* **Hộp Thoại Modal Nhập Liệu:** Form thiết kế khoa học, có nhãn rõ ràng, kiểm tra tính hợp lệ dữ liệu (validation), tự động nạp dữ liệu cũ khi chỉnh sửa và thông báo Toast phản hồi thành công/thất bại tức thì qua `sonner`.
* **Cơ Chế Tab Switcher Chế Độ Xem:** Header của mỗi phân hệ trang bị cụm nút chuyển đổi 2 chế độ:
  1. `Quản Trị CRM (RESTful)`: Bảng quản lý dữ liệu, kiểm soát nghiệp vụ, thêm/sửa/xóa trực tiếp vào hệ thống.
  2. `Xem Trước App/PWA`: Hiển thị giao diện người dùng thực tế trên ứng dụng PWA ViOne để quản trị viên kiểm tra trải nghiệm người dùng cuối.

---

### UC-CRM-33: Nâng Cấp Đa Chiều Chức Năng 5 Module Nền Tảng & Chuẩn Hóa Theme Sáng/Tối 100% CRM Tokens (Phiên Bản 7.1.0 - Tháng 10/2026)
* **Tác nhân:** Quản trị viên Nền tảng ViConnect, Ban Điều Hành Giải Chạy & Di Sản, Khách Hàng Doanh Nghiệp.
* **Màn hình thực hiện:**
  - `components/platform-app/admin/RunAdminManager.tsx`
  - `components/platform-app/admin/MuseumAdminManager.tsx`
  - `components/platform-app/admin/HeritageAdminManager.tsx`
  - `components/platform-app/admin/ReviewAdminManager.tsx`
  - `routes/documents.index.tsx`
  - `routes/platform.sport.tsx`, `platform.run.tsx`, `platform.heritage.tsx`, `platform.museum.tsx`, `platform.archive.tsx`, `platform.tickets.tsx`, `platform.review.tsx`.
* **Tiền điều kiện:** Người dùng đăng nhập CRM và có thể chọn chế độ Light Mode (Theme Sáng) hoặc Dark Mode (Theme Tối).
* **Mục tiêu:**
  1. **Khắc phục triệt để lỗi Theme Sáng (Light Mode):** Chuyển đổi toàn bộ các phần tử giao diện đang bị hardcoded màu đen xì (`bg-[#0B0F17]`, `bg-[#0B132B]`, `bg-[#0A101D]`, `bg-[#050C15]`) sang bộ Tailwind tokens chuẩn CRM: `bg-white dark:bg-slate-900`, `border-slate-200 dark:border-slate-800`, `text-slate-900 dark:text-slate-100`, `text-slate-500 dark:text-slate-400`, `bg-slate-50 dark:bg-slate-950`. Đảm bảo trang Kho Tài Liệu (`/documents`) và 7 phân hệ nền tảng hiển thị trang nhã, sáng sủa, tinh tế khi bật Light Theme và giữ trọn đẳng cấp Luxury khi bật Dark Theme.
  2. **Việt Hóa Toàn Diện Breadcrumbs & Kho Tài Liệu:** Xóa bỏ chữ "Documents" dính tiếng Anh, hiển thị chuẩn "Kho Tài Liệu Doanh Nghiệp" thông qua từ điển ánh xạ `ROUTE_LABELS` trong `TopbarBreadcrumb.tsx`.
  3. **Nâng Cấp Chiều Sâu Nghiệp Vụ Chuyên Sâu Cho Các Module:**
     * **ViOne Run (5 Tabs):** Giải chạy & cự ly marathon/trail (`races`), danh sách VĐV & phân bổ số BIB RFID (`runners`), trạng thái sóng thảm đo chíp checkpoints (`checkpoints`), Live Leaderboard & Console giả lập quét chíp (`leaderboard`), cấp chứng nhận điện tử Finisher Medal (`certificates`).
     * **ViOne Museum (5 Tabs):** Quản trị bảo tàng & triển lãm (`museums`), kho hiện vật 3D Photogrammetry GLTF/GLB xoay 360 (`artifacts`), thuyết minh Audio Guide AI đa ngôn ngữ VI/EN/FR có player nghe thử (`audioguide`), trạm thẻ chip NFC NTAG213 tại bệ trưng bày thực tế (`nfc_tags`), sổ luân chuyển mượn/trả hiện vật triển lãm lưu động (`lending`).
     * **ViOne Heritage (4 Tabs):** Hồ sơ di sản xếp hạng UNESCO & Di tích QG (`heritage_list`), bản đồ số tọa độ GIS khoanh vùng bảo vệ I & II (`gis_map`), kho tư liệu số hóa văn bia sắc phong 8K & VR360 (`archives_vr360`), hệ thống quan trắc độ ẩm & giám sát dự toán bảo tồn (`preservation`).
     * **ViOne Review (4 Tabs):** Quản lý trạm thẻ NFC NTAG213/215 tại quầy (`stations`), kịch bản điều hướng thông minh Smart Review Routing 4-5 sao mở Google Maps / 1-3 sao gửi phản hồi kín SOS cho Quản lý (`routing`), chiến dịch voucher tri ân sau review (`incentives`), báo cáo tăng trưởng & chỉ số CSAT (`analytics`).

