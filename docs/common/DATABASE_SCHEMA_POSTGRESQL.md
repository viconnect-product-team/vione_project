# CƠ SỞ DỮ LIỆU POSTGRESQL & BẢN ĐỒ THỰC THỂ DỰ ÁN VIONE
## VIONE BUSINESS CONNECT ECOSYSTEM — DATABASE SCHEMAS & ENTITY MAPPING

> **Mã tài liệu:** `VIONE-DB-SCHEMA-01`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Hệ quản trị CSDL:** PostgreSQL 15+ / Supabase  
> **ORM:** Prisma ORM

---

## 1. BẢNG DANH MỤC THỰC THỂ CỐT LÕI (CORE TABLES)

| Tên Bảng (PostgreSQL) | Phân Hệ | Mô Tả & Nghiệp Vụ Liên Quan | Tham Chiếu Node |
| :--- | :--- | :--- | :--- |
| `public.vione_users` | Toàn hệ thống | Bảng tài khoản người dùng chính thức (UUID, email, phone, password_hash, role, status). | `NODE-APP-AUTH-01`, `NODE-CRM-AUTH-01` |
| `public.user_profiles` | Toàn hệ thống | Hồ sơ cá nhân (`user_id`, `display_name`, `avatar_url`, `cover_url`, `bio`, `qr_slug`). | `NODE-APP-CARD-01`, `NODE-APP-CARD-02` |
| `public.business_identities` | App ViOne | Danh tính kinh doanh (`owner_user_id`, `company_name`, `title`, `tax_code`, `industry`).| `NODE-APP-CARD-01` |
| `public.connections` / `user_connections` | App ViOne | Quan hệ kết nối giữa các doanh nhân (`user_id`, `partner_id`, `status: pending/accepted/declined`). | `NODE-APP-NET-01`, `NODE-APP-DM-01` |
| `public.dm_threads` | App ViOne | Cuộc trò chuyện 1-1 giữa 2 doanh nhân (`id` UUID, `created_at`, `updated_at`). | `NODE-APP-DM-01` |
| `public.dm_messages` | App ViOne | Chi tiết tin nhắn chat (`thread_id`, `sender_id`, `content`, `media_url`, `read_at`). | `NODE-APP-DM-01` |
| `public.business_stories` | App ViOne | Khoảnh khắc 24h doanh nhân (`user_id`, `media_url`, `caption`, `tags`, `expires_at`). | `NODE-APP-STORIES-01` |
| `public.business_cards` | App ViOne | Danh thiếp giấy đã chụp qua OCR (`owner_id`, `name`, `phone`, `email`, `company`, `title`, `vcard_raw`).| `NODE-APP-SCAN-02` |
| `public.crm_customers` / `customers` | App + CRM | Khách hàng tiềm năng & Pipeline (`tier`, `deal_value`, `stage`, `pic_user_id`, `company_name`).| `NODE-APP-LEAD-01`, `NODE-CRM-LEAD-01` |
| `public.workflow_tasks` | CRM | Công việc BPMN (`title`, `assignee_id`, `deadline`, `status`, `department_id`, `wip_order`).| `NODE-CRM-WORKFLOW-01` |
| `public.workflow_checklists` | CRM | Đầu việc con nghiệm thu (`task_id`, `item_text`, `is_done`). | `NODE-CRM-WORKFLOW-01` |
| `public.attendance_logs` | CRM | Nhật ký chấm công (`user_id`, `checkin_time`, `lat`, `lng`, `face_score`, `is_late`). | `NODE-CRM-ATTENDANCE-01`|
| `public.payment_approvals` | CRM | Tờ trình phê duyệt chi (`maker_id`, `amount`, `purpose`, `status: pending/approved/rejected`, `qr_code`).| `NODE-CRM-FINANCE-01` |

---

## 2. QUY CHUẨN TRUY VẤN CSDL BẮT BUỘC (STRICT QUERY CONSTRAINTS)

1. **Tuyệt đối không truy vấn các bảng không tồn tại**:
   - Nghiêm cấm truy vấn `public.users` hay `public.profiles` (vì các bảng này là tàn dư cũ).
   - Luôn sử dụng đúng `public.vione_users`, `public.user_profiles`, `public.business_identities`.
2. **Không tự tạo prefix giả lập**:
   - `threadId` của Chat bắt buộc dùng UUID sinh từ PostgreSQL qua API `POST /connect-app/dm/threads`. Tuyệt đối không tự ghép `th-...`.
