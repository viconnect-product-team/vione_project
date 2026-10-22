# YÊU CẦU NGHIỆP VỤ (BRD) - HỆ THỐNG WEB CRM VIONE ENTERPRISE
## VIONE CRM PLATFORM — BUSINESS REQUIREMENTS DOCUMENT (CRM ENTERPRISE)

> **Mã tài liệu:** `VIONE-BRD-CRM-01`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Phân hệ:** Quản trị Doanh nghiệp, Hiệp hội & Vận hành Nội bộ (`apps/vione_app_fe` mode CRM)  
> **Tên miền Subdomain:** `https://crm.viconnect.vn/`  
> **Đối tượng sử dụng:** Quản trị viên cấp cao (Super Admin), Giám đốc điều hành (CEO), Quản lý bộ phận (Department Head), Kế toán trưởng, Chuyên viên CRM, Thư ký Hiệp hội.

---

## 1. TỔNG QUAN HỆ THỐNG CRM VIONE

Hệ thống Web CRM ViOne Enterprise là giải pháp quản trị điều hành tập trung dành cho các doanh nghiệp, tập đoàn và các tổ chức hiệp hội doanh nhân quy mô lớn:
- **Triết lý chủ đạo:** "CÀNG ÍT MÀU - ÍT CHỮ CÀNG TỐT - CHUẨN HÓA DỮ LIỆU ĐỒNG NHẤT - QUAN TÂM NHÌN THẤU TIẾN ĐỘ NHÂN VIÊN".
- **Không phục vụ Client App:** Phân hệ CRM Quản trị cấm phục vụ đường dẫn `/connect-app` (tự động chuyển hướng 301 sang `https://vione.viconnect.vn/connect-app`).

---

## 2. CÁC PHÂN HỆ NGHIỆP VỤ CỐT LÕI (CORE BUSINESS MODULES)

### 2.1. Phân hệ Quản Trị Quy Trình & Kanban BPMN 2.0 (Module Workflow)
- **BR-WRK-01 (Bắt buộc Assignee & Deadline)**: Khi khởi tạo bất kỳ công việc hoặc quy trình nào, bắt buộc phải chỉ định Nhân sự phụ trách (Assignee) và Thời hạn hoàn thành (Deadline).
- **BR-WRK-02 (Cảnh báo quá hạn)**: Tự động gắn nhãn cảnh báo đỏ phát sáng (Glowing Red Pulse) lập tức khi công việc bị quá hạn deadline.
- **BR-WRK-06 (Giới hạn WIP Limit)**: Giới hạn số lượng công việc đang xử lý đồng thời ($\le 5$) trên cột In Progress cho mỗi nhân sự, ngăn ngừa nghẽn cổ chai.
- **BR-WRK-07 (Nghiệm thu Checklist 100%)**: Bắt buộc tích đủ 100% các đầu việc con trong Checklist trước khi cho phép chuyển trạng thái sang Hoàn thành (Done).
- **BR-WRK-10 (Chế độ xem linh hoạt)**: Cho phép chuyển đổi tức thì giữa bảng Kanban 4 cột và biểu đồ Gantt tiến độ dạng Finish-to-Start.

### 2.2. Phân hệ Giám Sát Tải Làm Việc Của Nhân Sự (Module Workload)
- **BR-WRK-14 (Bản đồ nhiệt Workload Heatmap)**: Theo dõi tổng số giờ làm việc hàng tuần của từng nhân viên. Tự động cảnh báo đỏ "Quá tải" khi tổng thời gian vượt quá 45 giờ/tuần.
- **BR-WRK-15 (Đánh giá hiệu suất & KPI)**: Thống kê tỷ lệ hoàn thành công việc đúng hạn và tự động gợi ý phân bổ lại nhiệm vụ cho những nhân sự còn trống lịch.

### 2.3. Phân hệ Giám Sát Chấm Công Thời Gian Thực (Module Attendance & HRM)
- **BR-HRM-01 (Định vị GPS bán kính $\le 50\text{m}$)**: Chỉ chấp nhận chấm công khi tọa độ di động nằm trong bán kính 50 mét so với tọa độ văn phòng/chi nhánh.
- **BR-HRM-02 (Xác thực AI FaceID Liveness $\ge 92\%$)**: Quét khuôn mặt chống giả mạo bằng ảnh in, video phát lại hoặc mặt nạ 3D.
- **BR-HRM-05 (Cảnh báo đi muộn)**: Tự động ghi nhận đi muộn nếu check-in sau 08:30 sáng quá 15 phút.
- **BR-HRM-14 (Khóa chốt bảng công)**: Tự động chốt và khóa sổ bảng chấm công vào lúc 23:59 ngày mùng 2 hàng tháng.

### 2.4. Phân hệ Phê Duyệt Thanh Toán & Tờ Trình 3 Cấp (Module Finance & Approvals)
- **BR-FIN-01 (Quy trình kiểm soát 3 cấp)**:
  * Cấp 1 (Maker): Nhân viên/Trưởng bộ phận lập đề xuất chi.
  * Cấp 2 (Checker): Kế toán trưởng kiểm tra tính hợp lệ và chứng từ.
  * Cấp 3 (Approver): CFO hoặc CEO phê duyệt ký số.
- **BR-FIN-02 (Phân quyền theo hạn mức tài chính)**:
  * Chi phí $< 5.000.000$ đ: Trưởng bộ phận phê duyệt.
  * Chi phí $5.000.000 - 20.000.000$ đ: Giám đốc Tài chính (CFO) phê duyệt.
  * Chi phí $> 20.000.000$ đ: Bắt buộc Tổng Giám Đốc (CEO) trực tiếp ký số và phê duyệt trên hệ thống.
- **BR-FIN-06 (Thanh toán tự động Napas VietQR 24/7)**: Sinh mã QR động chuẩn VietQR Napas 24/7 gạch nợ tức thì 1 giây sau khi CEO ký duyệt chi.
- **BR-FIN-07 (Khử trùng lặp hóa đơn)**: Tự động quét và phát hiện trùng số hóa đơn, ngày phát hành và mã số thuế bên thụ hưởng.

### 2.5. Phân hệ Quản Trị Khách Hàng Tiềm Năng & Cơ Hội B2B (Module CRM & Leads)
- **BR-CRM-01 (Tiếp nhận Lead từ Quét Card Mobile)**: Tự động nhận dữ liệu khách hàng tiềm năng gửi về từ phân hệ Quét Danh Thiếp AI OCR của Mobile App.
- **BR-CRM-02 (Phân hạng Tier Leads)**: Quản lý khách hàng theo 4 tier: ⭐ Hot Lead, 💎 VIP C-Level, 🎯 Cần care 24h, 🌟 Nổi bật.
- **BR-CRM-03 (Pipeline đàm phán thương vụ)**: Quản lý các giai đoạn: Prospect (Tiếp cận) $\rightarrow$ Proposal (Gửi báo giá) $\rightarrow$ Negotiation (Đàm phán) $\rightarrow$ Won/Lost.
