# ĐẶC TẢ KỸ THUẬT (TECHSPEC) - HỆ THỐNG WEB CRM VIONE ENTERPRISE
## TECHNICAL SPECIFICATION — ARCHITECTURE, APIS & DATA MODELS (CRM PLATFORM)

> **Mã tài liệu:** `VIONE-TECHSPEC-CRM-03`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Phân hệ:** Web CRM Quản trị ViOne (`apps/vione_app_fe` build crm_platform)  
> **Backend tương ứng:** `apps/vione_app_be`

---

## 1. KIẾN TRÚC KỸ THUẬT WEB CRM VIONE

```
+---------------------------------------------------------------------------------+
|                        WEB CRM FRONTEND ARCHITECTURE                            |
+---------------------------------------------------------------------------------+
|   - Framework: React 18 + Vite 5 + TypeScript                                   |
|   - Routing: TanStack Router với scope crm_platform                             |
|   - State Management: TanStack React Query + Zustand Store                      |
|   - UI Components: Shadcn/UI (Radix UI) + Tailwind CSS v4                       |
|   - Theme: Executive Dark Obsidian Slate & Clean White Contrast                 |
|   - Subdomain Production: `https://crm.viconnect.vn/` (Port 443 SSL)            |
|   - Dev Server: `https://dev-vione-crm.14-225-217-232.sslip.io:5446`            |
+---------------------------------------------------------------------------------+
                                       │
                                       ▼ RESTful APIs (JSON / JWT)
+---------------------------------------------------------------------------------+
|                        BACKEND NESTJS (`apps/vione_app_be`)                     |
|   - Workflow & Tasks Module (`/api/operations/workflow`)                        |
|   - Workload & Heatmap Module (`/api/operations/workload`)                      |
|   - Attendance & Leaves Module (`/api/operations/attendance`)                   |
|   - Finance & Approvals Module (`/api/operations/finance`)                      |
|   - Napas VietQR 24/7 Gateway Bridge                                            |
|   - CRM Leads & Customers Pipeline (`/api/operations/customers`)                |
+---------------------------------------------------------------------------------+
                                       │
                                       ▼ Prisma ORM
+---------------------------------------------------------------------------------+
|                         POSTGRESQL DATABASE SCHEMAS                             |
|   `workflow_tasks`, `workflow_checklists`, `workload_logs`, `attendance_logs`,  |
|   `leave_requests`, `payment_approvals`, `payment_invoices`, `crm_customers`    |
+---------------------------------------------------------------------------------+
```

---

## 2. DANH MỤC RESTFUL APIS QUẢN TRỊ CRM

| Phân hệ | Endpoint | Method | Status | Mô tả chức năng | Tham chiếu UC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Workflow** | `/api/operations/workflow/tasks` | `GET` | `200` | Lấy danh sách nhiệm vụ Kanban (hỗ trợ lọc status, dept, assignee) | `UC-CRM-04` |
| **Workflow** | `/api/operations/workflow/tasks` | `POST` | `201` | Tạo mới công việc (Check WIP $\le 5$ BR-WRK-06 & Deadline BR-WRK-01) | `UC-CRM-04` |
| **Workflow** | `/api/operations/workflow/tasks/:id`| `PUT` | `200` | Cập nhật tiến độ & checklist (Chặn Done nếu checklist $< 100\%$) | `UC-CRM-04` |
| **Workflow** | `/api/operations/workflow/tasks/:id`| `DELETE` | `200` | Xóa nhiệm vụ | `UC-CRM-04` |
| **Workload** | `/api/operations/workload` | `GET` | `200` | Lấy ma trận tải nhân sự, phát hiện cảnh báo quá tải $> 45\text{h/tuần}$ | `UC-CRM-05` |
| **Attendance** | `/api/operations/attendance` | `GET` | `200` | Thống kê bảng công, nhật ký check-in thời gian thực | `UC-CRM-06` |
| **Attendance** | `/api/operations/attendance/leaves` | `GET` | `200` | Danh sách đơn xin nghỉ phép / OT | `UC-CRM-07` |
| **Attendance** | `/api/operations/attendance/leaves/:id/approve` | `PUT` | `200` | Trưởng bộ phận phê duyệt đơn nghỉ | `UC-CRM-07` |
| **Finance** | `/api/operations/finance/approvals` | `GET` | `200` | Danh sách tờ trình chi 3 cấp | `UC-CRM-08` |
| **Finance** | `/api/operations/finance/approvals` | `POST` | `201` | Khởi tạo tờ trình chi (Gán hạn mức thẩm quyền tự động BR-FIN-02) | `UC-CRM-08` |
| **Finance** | `/api/operations/finance/approvals/:id/approve` | `PUT` | `200` | Phê duyệt tờ trình (Checker $\rightarrow$ Approver) | `UC-CRM-08` |
| **Finance** | `/api/operations/finance/approvals/:id/qr` | `GET` | `200` | Sinh mã VietQR Napas 24/7 gạch nợ tức thì 1 giây (BR-FIN-06) | `UC-CRM-09` |
| **CRM Leads** | `/api/operations/customers` | `GET` | `200` | Lấy danh sách khách hàng tiềm năng kèm phân hạng Tier | `UC-CRM-10` |
| **CRM Leads** | `/api/operations/customers/:id` | `PATCH` | `200` | Cập nhật giai đoạn đàm phán CRM (prospect $\rightarrow$ won) | `UC-CRM-10` |
