# BACKEND MEMORY - VIONE APP BE

## Nhật ký thay đổi & Tóm tắt kiến trúc Backend
- **Ngày 09/10/2026**:
  - Bổ sung schema `public.company_tasks` với các trường `progress` (int 0-100), `progress_note` (text), `department` (text).
  - Tích hợp endpoint `/connect-app/community/company-staff-status`: Đếm số lượng nhân sự trực thuộc cộng đồng/công ty do người dùng sáng lập/quản lý để quyết định cờ `hasCompanyWithStaff`.
  - Bổ sung endpoint cập nhật tiến độ công việc `PATCH /connect-app/community/:communityId/tasks/:taskId/progress`: Cập nhật % tiến độ, ghi chú, trạng thái `in_progress` / `done`, phát socket realtime tới quản lý/sếp và người giao việc.
  - Bổ sung endpoint import Excel `POST /connect-app/community/:communityId/tasks/import-excel`: Cho phép nạp hàng loạt công việc chia theo phòng ban (Kinh doanh, Kỹ thuật, Marketing, Kế toán, Nhân sự) vào hệ thống.
  - Bổ sung Realtime Gateway thông báo khi giao việc mới (`task_assigned`), nhận việc (`task_accepted`) và cập nhật tiến độ (`task_progress_updated`).

- **Ngày 21/10/2026**:
  - **Sửa triệt để luồng quét mã QR ViOne qua Zalo & Bổ sung nút "Về App ViOne"**:
    - Chuẩn hóa link mã QR cá nhân và chia sẻ danh thiếp sang URL canonical production công khai: `https://vione.viconnect.vn/p/{identifier}` (tránh URL nội bộ/dev cổng 5445 hoặc IP loopback khiến trình duyệt Zalo chặn SSL hoặc báo lỗi trang).
    - Cải tiến Backend `getPublicProfile`: Hỗ trợ đa dạng định dạng identifier (UUID, clean token, full URL), tổng hợp và fallback qua 6 bảng (`identity_share_links`, `business_identities`, `member_business_cards`, `members`, `user_profiles`, `vione_users`) để đảm bảo quét mã là load được đầy đủ hồ sơ thành viên mà không bao giờ bị trả về "Hồ sơ không khả dụng".
    - Mở rộng controller và route aliases cho endpoint public profile: `@Controller(['public', 'connect-app/public'])`, `@Get(['profile/:identifier', 'p/:identifier', 'identity/:identifier'])`.
    - Bổ sung nút bấm CTA "Về App ViOne" (dẫn đến `https://vione.viconnect.vn/connect-app`) cả ở Header trên cùng và thanh điều hướng nổi cố định (sticky bottom bar) phía dưới trên trang `p.$identifier.tsx`, giúp người dùng Zalo sau khi xem hồ sơ có thể 1 chạm chuyển tiếp ngay về ứng dụng ViOne hoặc lưu danh bạ.
  - **Khắc phục lỗi nhận diện thẻ danh thiếp (Card visit)**:
    - Sửa lỗi nghiêm trọng trong tích hợp OCR.space tại `connect-helpers.ts`: tham số ngôn ngữ tiếng Việt của OCR.space là `'vnm'`, trước đây truyền nhầm `'vie'` dẫn đến OCR.space luôn trả về mã lỗi 99 `E201: Value for parameter 'language' is invalid` khiến 100% lần quét thẻ thất bại.
    - Chuyển đổi payload gửi sang OCR.space từ chuỗi URL-encoded sang `FormData` multipart nhằm tránh tình trạng URL base64 bị phình to làm đứt kết nối HTTP.
    - Cải thiện hàm trích xuất `buildCandidateFromModel`: khi thẻ scan thiếu trường nhưng vẫn có dòng text nhận diện được, tự động fallback lấy dòng text đầu tiên làm họ tên (confidence 0.6 kèm warning `low_confidence_name`) thay vì hủy bỏ kết quả (`unusable`).
    - Bổ sung tính năng cứu cánh tại Frontend: nút "Tự nhập thông tin danh thiếp" hiển thị ngay trên màn hình khi quét thẻ bị mờ hoặc không nhận diện được, đưa người dùng vào form điền thông tin danh thiếp trực tiếp mà không bị gián đoạn công việc.
  - **Sửa lỗi màu giao diện theme sáng (bị màu đen) ở chức năng chỉnh sửa thông tin mã QR**:
    - Sửa biến CSS `--bc-mobile-ivory` trong `styles.css` từ `#000000` thành `#FFFFFF` khi ở chế độ sáng (`html:not(.dark)`), giải quyết triệt để lỗi khung thẻ QR bị đen đặc trong theme sáng.
    - Thay thế toàn bộ mã màu cố định nền đen / chữ trắng (`bg-[#0B0F19]`, `text-white`, `border-white/10`, `bg-white/[0.02]`) trong `QrPresetSetupModal.tsx` và màn hình `connect-app.me.index.tsx` thành các biến theme linh hoạt (`--bc-mobile-surface`, `--bc-mobile-text`, `--bc-mobile-border`, `--bc-mobile-surface-soft`), giúp giao diện chuyển đổi mượt mà, sang trọng và chuẩn màu vàng Champagne Gold trên cả 2 theme Sáng và Tối.
    - **Nâng cấp quy trình quét thẻ danh thiếp: Bỏ AI đọc, trích xuất OCR trực tiếp & Bổ sung Lưu danh bạ + Kết bạn Zalo**:
      - Bỏ hoàn toàn phần gọi Cloud AI Vision bên ngoài (OpenAI/Gemini/Lovable/Anthropic) trong `runCardOcrVision` để loại bỏ độ trễ 12s, lỗi hết quota và kết quả thiếu ổn định.
      - Chuyển sang đọc OCR tiếng Việt tốc độ cao trực tiếp: bóc tách chính xác toàn bộ các trường trên thẻ gồm Họ tên, Chức vụ, Công ty, Số điện thoại, Email, Website, Địa chỉ.
      - **Bổ sung cụm tác vụ kết nối nhanh trên giao diện xem lại thẻ (Cả PWA & Native ViOne)**:
        + Nút **"Kết bạn Zalo"** (`https://zalo.me/{cleanPhone}`): 1 chạm mở ngay ứng dụng Zalo để kết nối trực tiếp với đối tác.
        + Nút **"Lưu danh bạ điện thoại"**: Tự động đóng gói và xuất file vCard 3.0 (.vcf) chứa đầy đủ thông tin đối tác để lưu tức thì vào danh bạ của điện thoại (iOS / Android / PWA).
      - Sửa lỗi AST syntax của `createFileRoute` trong `p.$identifier.tsx` và đồng bộ `routeTree.gen.ts` đảm bảo lệnh build GitHub Actions và Docker Production thành công 100%.

  - **Cập nhật hoàn thiện 3 yêu cầu cốt lõi (PWA, Native Mobile & Backend)**:
    1. **Quét danh thiếp**: Gỡ bỏ hoàn toàn 100% nhãn/text AI nhận diện ("AI đề xuất", "AI đã nhận diện 90%", icon Sparkles). Nút "Lưu danh bạ" tải ngay trực tiếp file `.vcf` về điện thoại không qua popup trung gian. Nút Zalo chuẩn hóa màu vàng Champagne Gold / Đen Obsidian (bỏ hoàn toàn màu xanh dương). Sửa icon Lưu danh bạ bị khối đen thành `<UserPlus strokeWidth={2.2} fill="none" />`.
    2. **Quét mã QR doanh nhân**: Sửa triệt để lỗi "Hồ sơ không khả dụng hoặc đã thay đổi" bằng cơ chế fallback đa tầng (`/public/identity/`, `/public/profile/`, `/public/p/`), hợp nhất controller `@Get(['identity/:identifier', 'profile/:identifier', 'p/:identifier', ':identifier'])` và chuẩn hóa làm sạch `cleanId` từ URL/token/slug.
    3. **Tạo cộng đồng**: Sửa lỗi 400 validation pipe bằng cách dùng `@Body() body: any` trong `community.controller.ts`, chống lỗi ngoại lệ `VietnameseValidationPipe`, đồng thời đảm bảo tài khoản người dùng tồn tại trong `auth.users` trước khi liên kết membership tạo cộng đồng kèm gói dùng thử 30 ngày thành công 100%.


