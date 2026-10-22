# BẢN ĐỒ ĐỊNH DANH NODE LUỒNG CHỨC NĂNG HỆ THỐNG VIONE
## VIONE FEATURE FLOW NODE MAP & CODE TRACEABILITY MATRIX

> **Mã tài liệu:** `VIONE-NODE-MAP-MASTER-01`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Mục đích:** Đánh dấu định danh từng Node luồng chức năng trên toàn bộ hệ sinh thái ViOne. Khi có yêu cầu sửa bug, nâng cấp hoặc tối ưu, lập trình viên và AI Agent chỉ cần tra cứu Mã Node để xác định 100% chính xác các file giao diện (PWA & Native), backend controller, bảng CSDL và quy chuẩn UI/UX liên quan mà không mất thời gian tìm kiếm.

---

## 📌 HƯỚNG DẪN TRA CỨU & QUY TRÌNH SỬA CODE QUA NODE ID

```
[MÃ NODE ID] (Ví dụ: NODE-APP-SCAN-02)
     │
     ├── 1. Đọc SRS Use Case: docs/app_vione/SRS_APP.md (UC-APP-06)
     ├── 2. Đọc Quy chuẩn UI/UX: docs/app_vione/QUY_CHUAN_UIUX_APP.md (100% Nút Gradient)
     ├── 3. Định vị File Giao diện PWA: apps/vione_app_fe/src/components/...
     ├── 4. Định vị File Giao diện Native: apps/mobile_vione/src/components/...
     ├── 5. Định vị File Backend Controller: apps/vione_app_be/src/modules/...
     └── 6. Kiểm tra Bảng CSDL PostgreSQL: public.business_cards, crm_customers
```

---

## 📱 PHẦN 1: BẢN ĐỒ NODE PHÂN HỆ APP VIONE (PWA & NATIVE)

### 🔹 [NODE-APP-AUTH-01]: Đăng nhập Đa kênh & Khởi tạo Phiên làm việc
* **Tên luồng:** Đăng nhập bằng Google SSO, Apple ID, Phone/OTP, Email & Mật khẩu.
* **Mã SRS:** `UC-APP-01` (trong `docs/app_vione/SRS_APP.md`).
* **Mã Luật Nghiệp vụ:** `BR-AUTH-01`, `BR-AUTH-02`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/vione.login.tsx`, `src/components/auth/ConnectAppSignIn.tsx`
  - Hook/Lib: `src/lib/auth.ts`, `src/hooks/use-auth.ts`, `src/lib/business-connect/mobile/auth-error.ts`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/LoginScreen.tsx`
  - Services: `src/services/auth.service.ts`
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Controller: `src/modules/auth/auth.controller.ts`
  - Service: `src/modules/auth/auth.service.ts`, `src/modules/mail/mail.service.ts` (Gửi email chào mừng)
* **Bảng CSDL:** `public.vione_users`, `user_profiles`.
* **Quy chuẩn UI/UX bắt buộc:** Nút Đăng nhập bắt buộc dùng **Gradient Vàng Hoàng Gia Champagne Gold**, chữ đen `#050C15` font-bold. Divider "HOẶC" viền mạ vàng.
* **Lưu ý khi sửa:** Không mock đăng nhập thành công nếu API trả về mã lỗi.

---

### 🔹 [NODE-APP-CARD-01]: Danh thiếp Điện tử VIP Titanium & Quét QR Cá nhân
* **Tên luồng:** Hiển thị thẻ VIP mạ vàng/bạc, mở mã QR danh thiếp cá nhân, tích hợp chip NFC.
* **Mã SRS:** `UC-APP-03`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/VipBusinessCard.tsx`, `src/components/business-connect/mobile/MyQrModal.tsx`
  - Màn hình: `src/routes/connect-app.me.tsx`, `src/components/business-connect/mobile/ExecutiveHome.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/VipBusinessCard.tsx`, `src/components/MyQrModal.tsx`
  - Màn hình: `src/screens/ProfileScreen.tsx`
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Endpoint: `GET /connect-app/profile/me`
* **Bảng CSDL:** `public.vione_users`, `public.user_profiles`, `public.business_identities`.
* **Quy chuẩn UI/UX:** Nút "Mã QR của tôi" và nút chuyển đổi mạ vàng/bạc bắt buộc dùng nút Gradient.

---

### 🔹 [NODE-APP-CARD-02]: Trang Hồ sơ Số Công khai (Public Digital Card `/p/:id`)
* **Tên luồng:** Khách vãng lai quét mã QR từ camera iOS/Android hoặc Zalo mở thẳng profile cá nhân không cần đăng nhập.
* **Mã SRS:** `UC-APP-04`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/p.$identifier.tsx`, `src/routes/card.$slug.tsx`
  - Component: `src/components/business-connect/PublicDigitalCardView.tsx`
  - Auth Exception: Khai báo `/p/` trong `isPublic` tại `src/routes/__root.tsx`.
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Endpoint: `GET /api/public/profile/:identifier`
* **Bảng CSDL:** `public.user_profiles`, `public.business_identities`.
* **Quy chuẩn UI/UX:** Nút Gọi điện, Nhắn tin Zalo, Tải Danh bạ 1-chạm (.vcf) bắt buộc dùng nút Gradient Vàng Hoàng Gia.

---

### 🔹 [NODE-APP-SCAN-01]: Quét Mã QR Đối Tác (Live Camera Viewfinder)
* **Tên luồng:** Mở camera quét mã QR của đối tác với tia laser quét, hỗ trợ bật/tắt flash.
* **Mã SRS:** `UC-APP-05`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/ScanQrModal.tsx`, `src/components/scanner/LiveQrScanner.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/ScanQrModal.tsx`
* **Quy chuẩn UI/UX:** Khung ngắm viền vàng `#D8B282`, tia laser chuyển động, nút flash dùng gradient đen mạ vàng.

---

### 🔹 [NODE-APP-SCAN-02]: AI OCR Danh Thiếp Giấy & Chuyển Khách Hàng Tiềm Năng (Lead)
* **Tên luồng:** Chụp danh thiếp giấy, AI bóc tách thông tin vCard và lưu thành Lead trong CRM Pipeline.
* **Mã SRS:** `UC-APP-06`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/BusinessCardReviewForm.tsx`, `src/components/business-connect/mobile/CardScanFlow.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/CardScanReviewModal.tsx`
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Controller: `src/modules/card-scan/card-scan.controller.ts`
  - Heuristics: `src/modules/card-scan/card-scan.service.ts` (hỗ trợ Gemini, OpenAI, OCR.space)
* **Bảng CSDL:** `public.business_cards`, `public.crm_customers`.
* **Quy chuẩn UI/UX:** Switch lưu Lead, chọn Tier (Hot Lead, VIP C-Level), Deal Value màu vàng kim, nút Lưu dùng Gradient Vàng Hoàng Gia.
* **Lưu ý khi sửa:** Dung lượng ảnh chụp camera bắt buộc nén $< 450\text{KB}$ (Native `quality: 0.4`), cấm revoke ObjectURL sớm.

---

### 🔹 [NODE-APP-DM-01]: Tin Nhắn Trực Tiếp 1-1 (Direct Messaging) & Chat Thread
* **Tên luồng:** Trò chuyện 1-1 realtime giữa hai doanh nhân đã kết nối.
* **Mã SRS:** `UC-APP-07`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/ChatThreadModal.tsx`, `src/components/chat/ChatThreadView.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/ChatThreadModal.tsx`
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Controller: `src/modules/dm/dm.controller.ts`
  - Service: `src/modules/dm/dm.service.ts`, `src/modules/dm/dm.gateway.ts` (WebSocket)
* **Bảng CSDL:** `public.dm_threads`, `public.dm_messages`.
* **Lưu ý khi sửa:** Thread ID bắt buộc dùng UUID từ PostgreSQL qua `POST /connect-app/dm/threads`, tuyệt đối không dùng prefix giả lập `th-...`.

---

### 🔹 [NODE-APP-STORIES-01]: Khoảnh Khắc Doanh Nhân 24h (Stories Strip)
* **Tên luồng:** Đăng bài chia sẻ khoảnh khắc hợp tác, xem story toàn màn hình chạy tiến độ 0-100%.
* **Mã SRS:** `UC-APP-08`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/StoriesStrip.tsx`, `src/components/business-connect/mobile/StoryViewerModal.tsx`, `src/components/business-connect/mobile/CreateStoryModal.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/StoriesStrip.tsx`, `src/components/StoryViewerModal.tsx`, `src/components/CreateStoryModal.tsx`
* **Backend Controller:** `src/modules/stories/stories.controller.ts`
* **Bảng CSDL:** `public.business_stories`.
* **Lưu ý khi sửa:** Chỉ hiển thị story của bản thân và bạn bè đã kết nối (`connected`), cấm hardcode story giả lập.

---

### 🔹 [NODE-APP-STAFF-01]: Giám Sát Hoạt Động Nhân Sự Trong Ngày Dành Cho Giám Đốc
* **Tên luồng:** Lãnh đạo C-Level theo dõi nhân sự đi gặp đối tác, tại văn phòng, checklist BPMN và chấm công GPS.
* **Mã SRS:** `UC-APP-15`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/StaffDailyActivitySheet.tsx`, `src/components/business-connect/mobile/OperationsStaffPanel.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/StaffDailyActivityModal.tsx`
* **Backend Controller:** `src/modules/attendance/attendance.controller.ts`
* **Bảng CSDL:** `public.attendance_logs`, `public.workflow_tasks`.
* **Quy chuẩn UI/UX:** Các nút "Gọi trực tiếp", "Nhắc việc" bắt buộc dùng chuẩn Nút Gradient.

---

### 🔹 [NODE-APP-AI-01]: Quả Cầu Trợ Lý Giọng Nói Doanh Nhân AI (Floating Orb)
* **Tên luồng:** Nhận diện giọng nói tiếng Việt điều khiển các tác vụ chấm công, duyệt chi, xem việc.
* **Mã SRS:** `UC-APP-14`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/ai/ViOneVoiceAssistant.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/components/DraggableFloatingAiOrb.tsx`
* **Lưu ý khi sửa:** Khi người dùng tắt Trợ lý AI, hệ thống phải ẩn hoàn toàn 100%, tuyệt đối không để lại tab thừa mép màn hình.

---

## 💻 PHẦN 2: BẢN ĐỒ NODE PHÂN HỆ WEB CRM VIONE ENTERPRISE

### 🔸 [NODE-CRM-AUTH-01]: Đăng Nhập & Phân Quyền Quản Trị RBAC
* **Tên luồng:** Đăng nhập quản trị CRM qua subdomain `crm.viconnect.vn` hoặc cổng 5446.
* **Mã SRS:** `UC-CRM-01` (trong `docs/crm/SRS_CRM.md`).
* **Giao diện Web CRM (`apps/vione_app_fe` build crm_platform):**
  - Màn hình: `src/routes/auth.tsx`, `src/components/auth/CrmSignIn.tsx`
* **Backend Controller & Service:** `src/modules/auth/auth.controller.ts`
* **Bảng CSDL:** `public.vione_users`, `public.admin_roles`.
* **Lưu ý khi sửa:** Tự động 301 Redirect nếu truy cập `/connect-app` từ domain CRM.

---

### 🔸 [NODE-CRM-WORKFLOW-01]: Quản Trị Quy Trình BPMN 2.0 & Kanban Công Việc
* **Tên luồng:** Bảng Kanban 4 cột, bắt buộc Assignee & Deadline, giới hạn WIP $\le 5$, cảnh báo quá hạn viền đỏ phát sáng.
* **Mã SRS:** `UC-CRM-04`.
* **Luật Nghiệp Vụ:** `BR-WRK-01`, `BR-WRK-02`, `BR-WRK-06`, `BR-WRK-07`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/workflow.tsx`
  - Component: `src/components/workflow/KanbanBoard.tsx`, `src/components/workflow/TaskDetailModal.tsx`
* **Backend Controller & Service:** `src/modules/workflow/workflow.controller.ts`, `src/modules/workflow/workflow.service.ts`
* **Bảng CSDL:** `public.workflow_tasks`, `public.workflow_checklists`.
* **Lưu ý khi sửa:** 100% dữ liệu từ DB, không mock task tĩnh.

---

### 🔸 [NODE-CRM-WORKLOAD-01]: Giám Sát Tải Làm Việc & Bản Đồ Nhiệt (Heatmap)
* **Tên luồng:** Theo dõi giờ làm việc tuần, cảnh báo đỏ "Quá tải" khi $> 45\text{h/tuần}$, gợi ý san tải.
* **Mã SRS:** `UC-CRM-05`.
* **Luật Nghiệp Vụ:** `BR-WRK-14`, `BR-WRK-15`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/workload.tsx`
  - Component: `src/components/workload/WorkloadHeatmap.tsx`
* **Backend Controller:** `src/modules/workload/workload.controller.ts`
* **Bảng CSDL:** `public.workload_logs`, `public.workflow_tasks`.

---

### 🔸 [NODE-CRM-FINANCE-01]: Tờ Trình & Phê Duyệt Chi 3 Cấp
* **Tên luồng:** Maker lập đề xuất $\rightarrow$ Checker kế toán soát xét $\rightarrow$ Approver (CFO/CEO) ký số duyệt chi.
* **Mã SRS:** `UC-CRM-08`.
* **Luật Nghiệp Vụ:** `BR-FIN-01`, `BR-FIN-02`, `BR-FIN-07`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/payment-approvals.tsx`
  - Component: `src/components/finance/ApprovalDetailSheet.tsx`
* **Backend Controller:** `src/modules/finance/finance.controller.ts`
* **Bảng CSDL:** `public.payment_approvals`, `public.payment_invoices`.

---

### 🔸 [NODE-CRM-FINANCE-02]: Sinh Mã VietQR Napas 24/7 Gạch Nợ Tự Động
* **Tên luồng:** Tự động sinh mã VietQR Napas 24/7 sau khi CEO ký duyệt chi để thanh toán ngay trong 1 giây.
* **Mã SRS:** `UC-CRM-09`.
* **Luật Nghiệp Vụ:** `BR-FIN-06`.
* **Backend Endpoint:** `GET /api/operations/finance/approvals/:id/qr`
* **Bảng CSDL:** `public.payment_approvals`.
