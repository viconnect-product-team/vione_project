# MOBILE MEMORY - VIONE MOBILE NATIVE

## Lịch sử kiến trúc & Cải tiến phiên bản
- **Ngày 09/10/2026**:
  - Tích hợp kiểm tra doanh nghiệp: `hasCompanyWithStaff` ẩn Chấm công và Ký duyệt chi, chỉ hiển thị Công việc khi tài khoản chưa có công ty có nhân sự.
  - Tối ưu trang chủ Native: Đưa danh mục "Tất cả" lên vị trí mặc định đầu tiên.
  - Tích hợp tính năng đề xuất kết bạn từ danh bạ số điện thoại phong cách Zalo (`ContactsDiscoveryModal`).
  - Sắp xếp tin nhắn: Hội thoại có tin nhắn mới nhất luôn đưa lên đầu danh sách.
  - Tương tác chat: Bấm vào avatar người chat chuyển ngay tới `MemberCardBottomSheet` để xem hồ sơ đối tác.
  - Đại tu Trợ lý AI: Giao diện tối giản Executive, hỗ trợ lịch sử đa phiên lưu `AsyncStorage`, xóa lịch sử, tạo hội thoại mới, nhận diện giọng nói tự động điều khiển 100% ứng dụng.
  - Chuẩn hóa luồng giao việc: Bổ sung thanh tiến độ %, nút nhận việc, modal cập nhật % tiến độ kèm ghi chú và chức năng Import công việc từ file mẫu Excel.

- **Ngày 11/10/2026 - Đồng bộ & Nâng cấp Toàn diện 4 Phân hệ PWA & Native ViOne**:
  1. **Refactor Giao việc & Nhận việc chuẩn Doanh nghiệp C-Level**:
     - *Backend*: Sửa lỗi Cartesian Join đè tên admin trong `findAssigneeName`. Bổ sung các cột `progress`, `progress_note`, `department`, `attachments`, `report_url`, `report_note`, `task_type` vào bảng `company_tasks`. Bổ sung method và endpoint `@Delete(':communityId/tasks/:taskId')`.
     - *PWA (`CompanyTaskManagement.tsx`)*: Refactor 100% sang theme ViOne Executive vàng đồng nền champagne, modal tạo việc và sửa việc đối xứng 100% tất cả các trường (datetime-local, phòng ban, tệp đính kèm, báo cáo nghiệm thu, slider tiến độ %), thêm nút Xóa việc với popup xác nhận.
     - *Native (`AssignTaskModal.tsx`)*: Viết lại hoàn toàn sang theme sáng ViOne vàng đồng nền trắng, hỗ trợ cả Tạo việc và Sửa việc (`taskToEdit`), có nút Xóa việc kèm `Alert.alert` xác nhận, đầy đủ trường đính kèm, báo cáo, phòng ban, tiến độ %.
  2. **Khắc phục Triệt để Nhắn tin & Luồng Cuộc Gọi**:
     - *Backend*: `connect-dm.service.ts` ghép nối chuẩn theo `counterpartUserId` và `FULL OUTER JOIN`, triệt tiêu lỗi tạo thread trùng lặp với tên ID số dài lạ lẫm.
     - *Cuộc gọi PWA*: `DmCallModal.tsx` đã loại bỏ timer `duration` khỏi effect socket initiate, caller không re-emit `call:initiate` mỗi giây. `GlobalIncomingCallModal.tsx` dùng `activeCallRef` và `incomingCallRef` chặn triệt để lặp popup rung chuông khi người nhận đã bấm chấp nhận cuộc gọi hoặc đang trong cuộc gọi.
     - *Native (`ChatThreadModal.tsx`)*: Chuyển sang theme sáng ViOne vàng đồng nền champagne, avatar đối tác 34px viền vàng đồng cân đối, hiển thị hình ảnh chuẩn tỷ lệ và đẹp mắt.
  3. **Trợ lý AI Doanh Nhân ViOne (Voice & Text-To-Speech)**:
     - *Android APK*: `client.ts` tự động fallback sang `FALLBACK_API_BASE_URL` (`http://14.225.217.232:5001/api`) khi gặp lỗi SSL/mạng trên cổng 5445 (status === 0).
     - *Backend NestJS*: Endpoint `/ai/chat` trả về cả `answer` và `reply`.
     - *PWA (`ViOneVoiceAssistant.tsx`)*: Chuyển sang theme sáng ViOne vàng đồng nền champagne, đọc `answer`/`reply`, tích hợp Web Speech API `speechSynthesis` phát giọng nói tiếng Việt tự động ra loa kèm nút toggle âm thanh.
     - *Native (`ViOneVoiceAssistantModal.tsx`)*: Chuyển sang theme sáng ViOne vàng đồng nền champagne, đọc đúng `answer`/`voiceText`/`reply`.
  4. **Đồng bộ Giao diện Trang chủ PWA vs Native**:
     - *PWA (`ExecutiveHome.tsx`)*: Bổ sung 2 lối tắt nhanh **"Khách hàng CRM"** và **"Cộng đồng Doanh nghiệp"**.
     - *Native (`HomeScreen.tsx`)*: Chèn dải **"Khoảnh khắc doanh nhân 24h" (Stories strip)** với nút đăng tin của bạn và các story doanh nhân, sửa lỗi cú pháp đúp thẻ `</ScrollView>`.

- **Ngày 12/10/2026 - Phân Quyền Phòng Ban (Department-based RBAC) Toàn Diện**:
  1. *Backend NestJS*: Tạo bảng `public.vione_community_department_members`, kiểm tra quyền chặt chẽ cho `createCompanyTask`, `handoverCompanyTask`, `submitCompanyTaskReport`, `triggerInstantMeeting`. Mở 4 API endpoints quản lý phân quyền phòng ban.
  2. *Native Mobile (`CommunityScreen.tsx`, `CommunityDetailView.tsx`, `DepartmentPermissionsModal.tsx`, `AssignTaskModal.tsx`)*:
     - Tích hợp `DepartmentPermissionsModal.tsx` phong cách ViOne Luxury Champagne Gold quản lý gán/xóa quyền và vai trò theo từng phòng ban.
     - Kiểm tra quyền `checkCanOperate`: Tài khoản gán vào ban nào chỉ được thao tác các chức năng trong ban đó (`canAssign`, `canAccept`, `canReport`, `canHandover`, `canMeet`). Cấp Executive có toàn quyền trên toàn bộ các ban (`*`).
     - Tự động hiển thị banner `Chế độ chỉ xem` và ẩn các nút hành động nhạy cảm khi lọc ban không có quyền.
     - `AssignTaskModal.tsx`: Giới hạn các ban được phép giao việc tương ứng với quyền của tài khoản.
     - Kết nối `handleTriggerInstantMeeting` mở video call qua `Linking.openURL`.
     - Typecheck `tsc --noEmit` đạt 100% 0 errors.
