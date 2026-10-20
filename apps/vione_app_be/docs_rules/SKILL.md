# VI-ONE BACKEND (NESTJS) — SKILLS & BEST PRACTICES

## 1. Core Competencies & Tech Stack
- **Framework**: NestJS 10.x with TypeScript 5.x.
- **ORM & Database**: Prisma ORM with PostgreSQL (Stand-alone database, strictly decoupled from legacy Supabase auth).
- **Architecture Pattern**: Enterprise 3-Tier Layering + Composite Facade + Repository Pattern:
  - `Controllers`: HTTP routing, status codes, param validation, DTO binding.
  - `Services`: Business logic, permissions, workflow state machine, WebSocket notifications.
  - `Repositories`: 100% data access layer (Prisma & raw SQL query isolation).
- **Authentication**: JWT Strategy via `AuthGuard` (`JWT_SECRET`, cookies & Authorization Bearer header).
- **Realtime Gateway**: WebSocket Gateway (`@WebSocketGateway`) for real-time task notifications, messaging, and approvals.

## 2. Command Palette & Workflow
- **Development**: `npm run start:dev` (runs with hot-reload).
- **Build / Verification**: `npm run build` (`nest build`). Mandatory 0 errors (`exit code 0`).
- **Prisma Schema**:
  - Format schema: `npx prisma format`
  - Push schema: `npx prisma db push`
  - Generate client: `npx prisma generate`

## 3. Strict Rules & Conventions (CRITICAL BEST PRACTICES)

### 3.1. DTO Validation & Whitelist Pipe Discipline
- Backend áp dụng `VietnameseValidationPipe` với cấu hình `{ whitelist: true, forbidNonWhitelisted: false }`.
- **Hệ quả & Quy tắc**: Mọi trường dữ liệu mà Frontend gửi lên (ví dụ: `mediaPaths`, `uploadedMediaIds`, `verifiedSlotOrders` trong `FinalizeMomentDto`; `personId`, `displayName`, `fullName` trong `CreateCustomerDto`) **BẮT BUỘC** phải được khai báo tường minh trong DTO với decorator hợp lệ (`@IsOptional()`, `@IsString()`, `@IsArray()`, v.v.).
- Nếu thiếu decorator, NestJS sẽ âm thầm loại bỏ trường đó khỏi object request, dẫn đến thiếu dữ liệu hoặc văng lỗi validation tiếng Việt `400 Bad Request`.

### 3.2. Quét Danh thiếp OCR Đa tầng (Robust Multi-tier OCR Fallback)
- Tránh việc hệ thống OCR bị tê liệt hoàn toàn khi thiếu key OpenAI hoặc Gemini.
- Backend triển khai cơ chế OCR đa tầng:
  1. Thử gọi Vision AI (nếu có key trong biến môi trường).
  2. Fallback sang OCR engine miễn phí tin cậy (như OCR.space public engine) có khả năng đọc ảnh trực tiếp qua URL hoặc Base64.
  3. Phân tích ngữ nghĩa tiếng Việt (Heuristic Entity Extraction): Bóc tách Họ tên (tên riêng, họ Việt: Nguyễn, Trần, Lê, Phạm, Hoàng, Vũ, Đặng,...), Chức danh (Chủ tịch, Giám đốc, CEO, Trưởng phòng, Quản lý,...), Tên công ty (Công ty, TNHH, CP, Corporation, Group,...), Số điện thoại (bắt đầu bằng 0 hoặc +84), Email, Website, Địa chỉ.
  4. Trả về đúng cấu trúc để Frontend lưu vào "Danh thiếp đã quét".

### 3.3. Đánh dấu Khách hàng (Customer Identification)
- `parsePersonId` phải hỗ trợ linh hoạt cả mã dạng `u:{uuid}`, `c:{uuid}` lẫn chuỗi UUID trần (raw UUID) từ bảng `user_connections`.
- Khi người dùng gửi ID của bạn bè kết nối, hệ thống phải tự động tra cứu trong `user_connections` và bảng người dùng để liên kết chính xác, không ép buộc phải có prefix.

### 3.4. Quản lý Cộng đồng & Lời mời thành viên (Anti-Hardcode & Invitation Flow)
- **Tuyệt đối KHÔNG hardcode thành viên**: Khi tạo mới một cộng đồng, chỉ lưu chủ sở hữu (`owner_id`) là thành viên sáng lập (admin). Không tự động gán bất kỳ tài khoản bot hay người dùng ngẫu nhiên nào.
- **Mời thành viên**: Chỉ cho phép chủ phòng gửi lời mời đến những người đã kết nối (`accepted`).
- **Xử lý lời mời**:
  - Ghi nhận trạng thái lời mời vào cơ sở dữ liệu (`community_invitations` với `status: 'pending'`).
  - Bắn thông báo (Notification) qua WebSocket/Database đến người nhận.
  - Cung cấp 2 API xử lý: `/accept` (chuyển trạng thái sang `accepted`, chính thức thêm vào danh sách thành viên) và `/decline` (chuyển trạng thái sang `declined`).

### 3.5. Kiểm tra Lỗi Code Bắt Buộc (Strict Verification)
- Sau khi chỉnh sửa code Backend, phải chạy `npm run build` kiểm tra xem NestJS compile sạch sẽ 100% với exit code 0.
- Tuân thủ Rule 1: Tuyệt đối KHÔNG tự động chạy `git push` hay `git commit`.
