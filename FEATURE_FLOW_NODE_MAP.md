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

---

### 🔸 [NODE-CRM-SLOT-01]: Quản Trị Giới Hạn Thành Viên & Gói Cước Doanh Nghiệp (Slot Control)
* **Tên luồng:** Kiểm soát số lượng nhân sự tối đa được phép thêm vào doanh nghiệp theo gói đăng ký.
* **Mã SRS:** `UC-CRM-12`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Component: `src/components/companies/CompanyEmployeesTab.tsx` (Thước đo Slot sử dụng, tỷ lệ %, cảnh báo đầy slot)
  - Modal: `src/components/dashboard/SubscribePackageModal.tsx`
* **Backend Controller & Service (`apps/vione_app_be`):**
  - Service: `src/companies/companies.service.ts` (`addCompanyEmployee` slot guard, `getCompanySlotUsage`)
  - Controller: `src/companies/companies.controller.ts` (`GET /companies/:id/slot-usage`, `GET /companies/packages`)
* **Bảng CSDL:** `public.vione_subscription_packages`, `public.vione_community_subscriptions` (`max_slots`), `public.company_employees`.

---

### 🔸 [NODE-CRM-RBAC-01]: Ma Trận Phân Quyền Động Đa Cấp (Granular Dynamic RBAC System)
* **Tên luồng:** Quản trị ma trận vai trò và quyền hạn trực tiếp từ cơ sở dữ liệu PostgreSQL (Zero-Mock Data).
* **Mã SRS:** `UC-CRM-13`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/platform.permissions.tsx`
  - Sidebar: `src/components/dashboard/Sidebar.tsx` (`/platform/permissions`)
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/roles/roles.controller.ts` (`GET /roles`, `GET /roles/permissions-matrix`, `PUT /roles/:id/permissions`, `POST /roles`)
  - Service: `src/roles/roles.service.ts`
* **Bảng CSDL:** `public.platform_roles`, `public.platform_permissions`, `public.platform_role_permissions`.

---

### 🔸 [NODE-CRM-STAT-01]: Trung Tâm Thống Kê Toàn Diện 5 Phân Hệ (Executive Statistics Hub)
* **Tên luồng:** Bảng điều khiển số liệu thống kê thời gian thực theo 5 miền: Vận hành, Chấm công, Tài chính, CRM, Nền tảng.
* **Mã SRS:** `UC-CRM-14`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/statistics.tsx`
  - Sidebar: `src/components/dashboard/Sidebar.tsx` (`/statistics`)
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/analytics/analytics.controller.ts` (`/analytics/overview`, `/operations`, `/attendance`, `/finance`, `/crm`, `/platform`)
  - Service: `src/analytics/analytics.service.ts`
* **Bảng CSDL:** `public.company_tasks`, `public.attendance_records`, `public.payment_approvals`, `public.crm_customers`, `public.associations`.

---

### 🔸 [NODE-CRM-BULK-01]: Giao Việc Đa Đối Tượng & Tìm Kiếm Nhân Sự Động (Bulk Tasks & Multi-Select)
* **Tên luồng:** Chọn nhiều nhân sự từ cơ sở dữ liệu và khởi tạo công việc đồng loạt chỉ bằng 1 thao tác.
* **Mã SRS:** `UC-CRM-14`.
* **Giao diện Web CRM (`apps/vione_app_fe`):**
  - Component: `src/components/common/UserMultiSelect.tsx`, `src/components/companies/CompanyTasksTab.tsx`
* **Backend Endpoint (`apps/vione_app_be`):**
  - Controller & Service: `src/companies/companies.controller.ts`, `companies.service.ts` (`POST /companies/:id/tasks/bulk`)
* **Bảng CSDL:** `public.company_tasks`, `public.company_employees`.

---

## 🏛️ PHẦN 3: BẢN ĐỒ NODE HỆ SINH THÁI NỀN TẢNG VICONNECT (VĂN HÓA & THỂ THAO ĐỘC LẬP DOANH NGHIỆP)

> **Nguyên tắc cốt lõi:** 4 danh mục dưới đây thuộc quyền sở hữu, điều hành và phân phối của **ViConnect Central Platform** (Cổng Quốc Gia / Hệ Sinh Thái Nền Tảng), hoàn toàn KHÔNG thuộc quyền sở hữu hay quản trị của bất kỳ doanh nghiệp đơn lẻ nào trong hệ thống CRM Tenant. Các doanh nghiệp chỉ tham gia với vai trò Nhà Tài Trợ (Sponsor), Đơn vị Đồng Hành (Partner) hoặc Cử đoàn VĐV Doanh nghiệp tham gia thi đấu.

### 🏛️ [NODE-PLATFORM-HERITAGE-01]: ViOne Heritage — Quản Lý, Số Hóa Di Sản Văn Hóa & VR360
* **Tên luồng:** Số hóa hồ sơ di sản quốc gia/UNESCO, bản đồ GIS khoanh vùng bảo vệ, mô hình thực tế ảo 3D/VR360 và thuyết minh di sản tự động theo tọa độ định vị GPS.
* **Mã SRS:** `UC-APP-25`.
* **Cơ quan chủ quản:** ViConnect Central Platform phối hợp Cục Di sản văn hóa / Ban Quản lý Di tích.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/platform.heritage.tsx`, `src/routes/heritage.$id.tsx`
  - Component: `src/components/heritage/HeritageMapViewer.tsx`, `src/components/heritage/HeritageVr360Tour.tsx`, `src/components/heritage/HeritagePassportSheet.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/heritage/HeritageListScreen.tsx`, `src/screens/heritage/HeritageDetailScreen.tsx`
  - Component: `src/components/heritage/GeoAudioGuidePlayer.tsx`, `src/components/heritage/HeritageStampBadge.tsx`
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/modules/heritage/heritage.controller.ts`
  - Service: `src/modules/heritage/heritage.service.ts`
* **Bảng CSDL PostgreSQL:** `public.vione_heritage_sites`, `public.vione_heritage_zones`, `public.vione_user_heritage_stamps`.
* **Quy chuẩn UI/UX:** Nút "Nghe thuyết minh", "Khám phá 3D", "Lưu dấu ấn di sản" bắt buộc 100% Nút Gradient Vàng Hoàng Gia Champagne Gold viền mạ vàng 3D.

---

### 🏛️ [NODE-PLATFORM-MUSEUM-01]: ViOne Museum — Bảo Tàng Số, Trưng Bày Hiện Vật 3D & Thuyết Minh 1-Chạm NFC
* **Tên luồng:** Không gian trưng bày ảo chuyên đề, xoay phóng to hiện vật 3D Photogrammetry/AR, chạm điện thoại NFC tại kệ hiện vật để nghe audio guide, liên thông bán vé điện tử ViOne Ticket.
* **Mã SRS:** `UC-APP-26`.
* **Cơ quan chủ quản:** ViConnect Central Platform phối hợp Hội đồng Bảo tàng học & Ban Giám đốc các Bảo tàng.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/platform.museum.tsx`, `src/routes/museum.$id.artifacts.tsx`
  - Component: `src/components/museum/Artifact3DViewer.tsx`, `src/components/museum/VirtualExhibitionRoom.tsx`, `src/components/museum/MuseumTicketBookingModal.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/museum/MuseumExplorerScreen.tsx`, `src/screens/museum/ArtifactDetailScreen.tsx`
  - Component: `src/components/museum/NfcArtifactListener.tsx`, `src/components/museum/SmartAudioGuideModal.tsx`
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/modules/museum/museum.controller.ts`
  - Service: `src/modules/museum/museum.service.ts`
* **Bảng CSDL PostgreSQL:** `public.vione_museums`, `public.vione_museum_galleries`, `public.vione_museum_artifacts`, `public.vione_museum_nfc_tags`.
* **Quy chuẩn UI/UX:** Nút "Trải nghiệm AR", "Nghe câu chuyện hiện vật", "Đặt vé tham quan" dùng Gradient Vàng Hoàng Gia hoặc Gradient Đen Mạ Vàng sang trọng.

---

### ⚽ [NODE-PLATFORM-SPORT-01]: ViOne Sport — Giải Đấu Thể Thao Đa Môn, Sơ Đồ Bracket & Mạng Lưới CLB
* **Tên luồng:** Khởi tạo giải đấu thể thao đa môn (Pickleball, Bóng đá, Golf, Tennis), tự động sinh sơ đồ nhánh thi đấu (Bracket), cập nhật tỷ số trực tiếp, điều phối tổ trọng tài và cấp Hộ chiếu VĐV số.
* **Mã SRS:** `UC-APP-27`.
* **Cơ quan chủ quản:** ViConnect Central Platform bảo trợ & phối hợp các Liên đoàn Thể thao / Ban Trọng tài.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/platform.sport.tsx`, `src/routes/sport.tournaments.$id.tsx`
  - Component: `src/components/sport/TournamentBracketView.tsx`, `src/components/sport/LiveMatchScoreboard.tsx`, `src/components/sport/SportClubsDirectory.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/sport/SportHubScreen.tsx`, `src/screens/sport/TournamentDetailScreen.tsx`, `src/screens/sport/MatchDetailScreen.tsx`
  - Component: `src/components/sport/DigitalAthleteCard.tsx`, `src/components/sport/RefereeScoreModal.tsx`
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/modules/sport/sport.controller.ts`
  - Service: `src/modules/sport/sport.service.ts`, `src/modules/sport/sport.gateway.ts` (WebSocket Live Score)
* **Bảng CSDL PostgreSQL:** `public.vione_sport_tournaments`, `public.vione_sport_brackets`, `public.vione_sport_matches`, `public.vione_sport_clubs`, `public.vione_athlete_profiles`.
* **Quy chuẩn UI/UX:** Nút "Đăng ký thi đấu", "Xem bảng đấu", "Cập nhật tỷ số" dùng Nút Gradient; thẻ tỷ số trực tiếp viền vàng phát sáng.

---

### 🏃 [NODE-PLATFORM-RUN-01]: ViOne Run — Giải Chạy Marathon/Trail, Cấp BIB, Timing RFID & Live Leaderboard
* **Tên luồng:** Quản trị giải chạy marathon/trail, hiển thị trắc dọc độ cao GPX, tự động cấp phát số BIB & mã QR nhận RaceKit, tích hợp đồng bộ thảm chíp Timing RFID, bảng xếp hạng trực tiếp và xuất Finisher e-Certificate.
* **Mã SRS:** `UC-APP-28`.
* **Cơ quan chủ quản:** ViConnect Central Platform phối hợp Race Director & Hiệp hội Chạy bộ Quốc gia.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/platform.run.tsx`, `src/routes/run.races.$id.tsx`, `src/routes/run.results.tsx`
  - Component: `src/components/run/RaceGpxElevatorMap.tsx`, `src/components/run/LiveRaceLeaderboard.tsx`, `src/components/run/FinisherCertificateGenerator.tsx`, `src/components/run/AiBibPhotoFinder.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/run/RunHubScreen.tsx`, `src/screens/run/RaceDetailScreen.tsx`, `src/screens/run/MyBibPassScreen.tsx`
  - Component: `src/components/run/LivePaceTrackerCard.tsx`, `src/components/run/CertificateShareModal.tsx`
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/modules/run/run.controller.ts`
  - Service: `src/modules/run/run.service.ts`, `src/modules/run/rfid-timing.listener.ts` (Đầu nhận chíp thảm RFID UDP/WebSocket)
* **Bảng CSDL PostgreSQL:** `public.vione_races`, `public.vione_race_distances`, `public.vione_race_bibs`, `public.vione_rfid_mats`, `public.vione_race_timing_logs`, `public.vione_race_certificates`.
* **Quy chuẩn UI/UX:** Nút "Đăng ký BIB", "Tra cứu thành tích", "Tải chứng nhận Finish" dùng 100% Nút Gradient Vàng Hoàng Gia Champagne Gold viền mạ vàng.

---

### ⭐ [NODE-PLATFORM-REVIEW-01]: ViOne Review — Chạm Thẻ NFC Tăng Đánh Giá Google Maps & Tặng Voucher Cửa Hàng
* **Tên luồng:** Giải pháp Standee/Thẻ NFC đặt tại quầy thu ngân cửa hàng, nhà hàng, điểm di tích. Khách chạm nhẹ smartphone vào chip NFC NTAG213 để mở ngay biểu mẫu đánh giá 5 sao, chuyển hướng Google Maps Review và tự động nhận mã ưu đãi voucher tức thì.
* **Mã SRS:** `UC-APP-30`.
* **Cơ quan chủ quản:** ViConnect Central Platform bảo trợ mạng lưới đối tác thương mại văn hóa & ẩm thực.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/platform-app/NfcReviewHub.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/platform/PlatformAppScreen.tsx` (Tab `review`)
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/platform-hub/platform-hub.controller.ts` (`GET /platform-hub/reviews/stores`, `POST /platform-hub/reviews/submit`)
  - Service: `src/platform-hub/platform-hub.service.ts`
* **Bảng CSDL PostgreSQL:** `public.vione_nfc_reviews`, `public.vione_store_feedback`.
* **Quy chuẩn UI/UX:** Nút "Chạm NFC Đánh Giá", "Gửi Đánh Giá & Nhận Voucher" dùng 100% Nút Gradient Vàng Hoàng Gia Champagne Gold.

---

### 🎟️ [NODE-PLATFORM-TICKET-01]: ViOne Ticket — Bán Vé & Cổng Soát Vé Điện Tử QR/NFC Đa Năng
* **Tên luồng:** Phát hành vé điện tử cho di tích, bảo tàng, giải chạy; tích hợp thanh toán Napas VietQR 24/7 và cổng soát vé (Ticket Validator) chuyển trạng thái vé từ `Hợp lệ` sang `Đã sử dụng` có đối soát nhân viên.
* **Mã SRS:** `UC-APP-31`.
* **Cơ quan chủ quản:** ViConnect Central Platform quản lý cổng thanh toán & mã hóa bảo mật vé.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/platform-app/TicketWallet.tsx`
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Màn hình: `src/screens/platform/PlatformAppScreen.tsx` (Tab `tickets`)
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/platform-hub/platform-hub.controller.ts` (`POST /platform-hub/tickets/validate`)
* **Bảng CSDL PostgreSQL:** `public.vione_platform_tickets`.
* **Quy chuẩn UI/UX:** Cổng soát vé có thông báo phân biệt rõ rệt: Xanh Ngọc Lục Bảo (Vé hợp lệ) vs Đỏ Ruby (Cảnh báo vé đã dùng).

---

### 💼 [NODE-CRM-COMPANY-WORKFLOW-01]: CRM Doanh Nghiệp Tinh Gọn — Trọng Tâm Giao Việc & Bỏ Thu Chi
* **Tên luồng:** Phân hệ Doanh nghiệp không còn chức năng tiền, hóa đơn hay báo cáo thu chi; chuyển đổi 100% trọng tâm sang giao việc và điều phối vận hành.
* **Mã SRS:** `UC-CRM-30`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/workflow.index.tsx`, `src/components/dashboard/ExecutiveDashboard.tsx`
  - Điều hướng: `src/components/dashboard/Sidebar.tsx` (loại bỏ `companyFinanceSuite`, hiển thị Giao việc & Lịch trình), `src/components/dashboard/ReportsTreeMenu.tsx` (ẩn báo cáo thu chi khi `view === 'company'`).
* **Bảng CSDL PostgreSQL:** `public.vione_tasks`, `public.task_assignments`, `public.workflow_stages`.
* **Quy chuẩn UI/UX:** Nút "Giao việc mới" dùng Gradient Vàng Hoàng Gia Champagne Gold; bảng Kanban hiển thị tiến độ % và chỉ số WIP Limit.

---

### 📂 [NODE-CRM-PLATFORM-DOCS-01]: Kho Tài Liệu ViConnect Drive & Lịch Họp Nền Tảng
* **Tên luồng:** Cung cấp chức năng quản lý tài liệu độc lập như Google Drive cho ViConnect Platform cùng lịch họp và giao việc nội bộ.
* **Mã SRS:** `UC-CRM-28`, `UC-CRM-31`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình: `src/routes/documents.index.tsx`, `src/routes/meetings.index.tsx`, `src/routes/workflow.index.tsx`
  - Sidebar: `superAdminOperationsSuite` (Kho tài liệu, Lịch họp, Giao việc).
* **Backend Module (`apps/vione_app_be`):**
  - Controller: `src/documents/documents.controller.ts`, `src/modules/meetings/meetings.controller.ts`
  - Service: `src/documents/documents.service.ts`
* **Bảng CSDL PostgreSQL:** `public.documents`, `public.document_folders`, `public.document_categories`.

---

### 🏛️ [NODE-CRM-PLATFORM-ECOSYSTEM-01]: Cụm Phân Hệ Quản Trị Hệ Sinh Thái ViOne Trên CRM (Chuẩn RESTful CRUD)
* **Tên luồng:** Bổ sung nhóm phân hệ quản trị chuyên biệt vào ViOne CRM: Sport, Run, Heritage, Museum, Archive, Ticket, Review với đầy đủ chức năng Quản trị Admin (Bảng dữ liệu, Thêm mới POST, Sửa PUT, Xóa DELETE) và chuyển đổi giao diện xem trước App/PWA.
* **Mã SRS:** `UC-CRM-31`, `UC-CRM-32`.
* **Giao diện PWA CRM Admin (`apps/vione_app_fe`):**
  - Routes: `src/routes/platform.sport.tsx`, `src/routes/platform.run.tsx`, `src/routes/platform.heritage.tsx`, `src/routes/platform.museum.tsx`, `src/routes/platform.archive.tsx`, `src/routes/platform.tickets.tsx`, `src/routes/platform.review.tsx`
  - Admin Managers: `src/components/platform-app/admin/SportAdminManager.tsx`, `RunAdminManager.tsx`, `HeritageAdminManager.tsx`, `MuseumAdminManager.tsx`, `ArchiveAdminManager.tsx`, `TicketAdminManager.tsx`, `ReviewAdminManager.tsx`
  - Preview Components: `SportTournamentHub.tsx`, `RunRaceHub.tsx`, `HeritageExplorer.tsx`, `MuseumExplorer.tsx`, `ArchiveViewer.tsx`, `TicketWallet.tsx`, `NfcReviewHub.tsx`
  - Sidebar Suites: `superAdminCommunitySportSuite`, `superAdminCultureHeritageSuite`
* **Backend Module Chuẩn RESTful (`apps/vione_app_be`):**
  - Controller: `src/platform-hub/platform-hub.controller.ts` (Full HTTP Verbs: `@Get`, `@Post`, `@Put`, `@Delete`)
  - Service: `src/platform-hub/platform-hub.service.ts`
  - Documents Module: `src/documents/documents.controller.ts`, `src/documents/documents.service.ts` (Hỗ trợ RESTful CRUD cho Documents, Folders, Categories)
* **Bảng CSDL PostgreSQL:** `public.vione_heritage_sites`, `public.vione_museums`, `public.vione_artifacts`, `public.vione_sports_tournaments`, `public.vione_sports_clubs`, `public.vione_races`, `public.vione_archives`, `public.vione_platform_tickets`, `public.vione_review_stores`, `public.documents`, `public.document_folders`, `public.document_categories`.

---

### 🌐 [NODE-APP-ECOSYSTEM-GRID-01]: Lưới Hệ Sinh Thái 2 Trụ Cột: "Con Người, Cộng Đồng & Trải Nghiệm"
* **Tên luồng:** Hiển thị lưới hệ sinh thái 2 cột tương xứng trên App PWA và Mobile Native kết nối 10 phân hệ dịch vụ số ViOne.
* **Mã SRS:** `UC-APP-30`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Component: `src/components/business-connect/mobile/ViOneEcosystemGrid.tsx`
  - Tích hợp: `src/components/business-connect/mobile/ExecutiveHome.tsx`
  - Tuyến đích: `src/routes/platform-app.tsx` (`?tab=...`)
* **Giao diện Native Mobile (`apps/mobile_vione`):**
  - Component: `src/screens/home/components/ViOneEcosystemGrid.tsx`
  - Tích hợp: `src/screens/home/HomeScreen.tsx`
  - Tuyến đích: `src/screens/platform/PlatformAppScreen.tsx` (nhận `initialTab`)
* **Quy chuẩn UI/UX:** Header xanh hoàng gia "ViOne - Con người, cộng đồng & trải nghiệm", 100% nút và thẻ tương tác theo chuẩn Gradient Champagne Gold / Obsidian viền mạ vàng.

---

### 📱 [NODE-APP-PWA-PREMIUM-01]: Phân Hệ Ứng Dụng PWA ViOne Native Premium Độc Lập (Citizen & Runner Pass)
* **Tên luồng:** Cung cấp trải nghiệm ứng dụng PWA độc lập (tách biệt tài khoản Hội viên Doanh nhân), sở hữu bottom navigation 5 tabs mượt mà và quản lý tài khoản trải nghiệm công dân số / runner.
* **Mã SRS:** `UC-APP-31`, `UC-CRM-33`.
* **Giao diện PWA (`apps/vione_app_fe`):**
  - Màn hình Shell: `src/components/platform-app/PlatformPwaApp.tsx`
  - Tuyến định tuyến: `src/routes/platform-app.tsx`
  - Phân hệ con: `HeritageExplorer.tsx`, `MuseumExplorer.tsx`, `SportTournamentHub.tsx`, `RunRaceHub.tsx`, `TicketWallet.tsx`, `NfcReviewHub.tsx`, `ArchiveViewer.tsx`, `CitizenPassModal.tsx`
* **Giao diện Native Mobile tương ứng (`apps/mobile_vione`):**
  - Màn hình: `src/screens/platform/PlatformAppScreen.tsx`
* **Trạng thái lưu trữ tài khoản độc lập:** `vione_citizen_pass_user` trong LocalStorage / AsyncStorage.
* **Quy chuẩn UI/UX:** Màu Executive Obsidian & Champagne Gold, 100% nút bấm Gradient Hoàng Gia theo Rule 8.




