---
name: vione-fe-skills
description: Kỹ năng, tiêu chuẩn lập trình và quy tắc phòng tránh lỗi dành cho Frontend Web PWA ViOne
---

# KỸ NĂNG & TIÊU CHUẨN FRONTEND VIONE (FE PWA)

## 1. Công nghệ cốt lõi
- **Vite + React 18 + TypeScript 5.x**.
- **TanStack Router**: Hệ thống định tuyến type-safe (`connect-app.inbox.*`, `connect-app.executive`, v.v.).
- **TanStack Query (React Query)**: Quản lý cache và đồng bộ dữ liệu server.
- **TailwindCSS & CSS Modules**: Tuân thủ triệt để bảng màu nhận diện thương hiệu ViOne (Vàng Champagne Gold `#D8B282` & Đen Thạch Anh Obsidian `#0B0F19`).
- **Web Speech API & Media Capture**: Xử lý camera trực tiếp, micro ghi âm và trợ lý giọng nói AI.
- **Lucide React**: Hệ thống icon tinh giản, sắc nét.

## 2. Quy tắc phòng tránh lỗi & Tiêu chuẩn kỹ thuật quan trọng (CRITICAL BEST PRACTICES)

### 2.1. Quản lý Camera & Vòng đời Ảnh chụp trực tiếp (Object URL Lifecycle)
- **Tránh rò rỉ và thu hồi sớm Object URL**:
  - `URL.createObjectURL(blob)` tạo liên kết bộ nhớ tạm thời cho ảnh chụp hoặc tải lên.
  - **Lỗi phổ biến**: Đặt `URL.revokeObjectURL(p.previewUrl)` trong cleanup function của `useEffect` có dependency `[photos]` hoặc `[cameraStream]`. Mỗi khi thêm ảnh mới hoặc đổi state, effect chạy lại và thu hồi ngay lập tức URL của ảnh vừa tạo, khiến ảnh bị vỡ, không hiển thị hoặc bị ghi đè bởi ảnh mặc định.
  - **Quy chuẩn**: Quản lý danh sách active Object URLs thông qua `useRef<Set<string>>` hoặc chỉ gọi `revokeObjectURL` khi người dùng bấm nút xóa ảnh cụ thể hoặc khi component unmount hoàn toàn.
- **Tương thích Mobile Browser với thẻ `<input type="file">`**:
  - KHÔNG BAO GIỜ kết hợp `capture="environment"` (hoặc `capture="user"`) cùng với thuộc tính `multiple`. Nhiều trình duyệt di động (đặc biệt là Chrome trên Android) sẽ drop file hoặc không kích hoạt camera khi có cả hai thuộc tính này.
  - MIME type fallback: Trình duyệt di động chụp ảnh từ camera thường trả về file có `type === ""` hoặc `application/octet-stream`. BẮT BUỘC kiểm tra cả đuôi file (`.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`) thay vì chỉ check `file.type.startsWith('image/')`.
- **Đồng bộ Cache TanStack Query**:
  - Khi đăng khoảnh khắc thành công, phải invalidate đúng query key `["bc-mobile", "network-feed"]` bên cạnh `["network-feed"]` để feed cập nhật ảnh thực tế ngay lập tức.
  - BẮT BUỘC có nút bấm "Đăng khoảnh khắc" trực tiếp và khung soạn thảo `NetworkSocialComposer` ngay trên màn hình Mạng lưới (`NetworkHome.tsx`).

### 2.2. Nhận diện Danh thiếp (Card Scan OCR) & Xuất Danh bạ điện thoại
- **Xử lý trích xuất thông tin OCR**:
  - Tích hợp pipeline OCR đa tầng (Vision AI -> OCR.space API -> Regex & Heuristic ngữ nghĩa tiếng Việt).
  - Phải phân tách rõ ràng: Họ và tên (chữ hoa/họ phổ biến Việt Nam), Chức vụ (Giám đốc, CEO, Trưởng phòng, Founder,...), Tên công ty, Số điện thoại (regex chuẩn Việt Nam 10-11 số), Email, Website, Địa chỉ.
  - Lưu vào mục "Danh thiếp đã quét" với đầy đủ trường dữ liệu.
- **Quy chuẩn file Danh bạ điện thoại (.vcf)**:
  - Khi người dùng bấm "Lưu vào danh bạ điện thoại", file vCard (`.vcf`) **TUYỆT ĐỐI CHỈ ĐƯỢC CHỨA 3 TRƯỜNG CỐT LÕI**:
    1. Họ và tên (`FN` và `N`).
    2. Chức danh (`TITLE`).
    3. Số điện thoại (`TEL;TYPE=CELL,VOICE`).
  - Không nhồi nhét ghi chú rác, ID hệ thống hay thông tin thừa làm rối danh bạ cá nhân của người dùng.
- **Màu sắc nút Liên kết Zalo**:
  - Nút "Mở Zalo" / "Nhắn Zalo" / "Link Zalo" BẮT BUỘC dùng màu Vàng Champagne Gold (`bg-[#D8B282]` hoặc `#D4AF37`) với chữ đen đậm (`text-black font-bold`). Tuyệt đối không dùng nút màu xanh lam đối chọi với bộ nhận diện sang trọng hoặc nút đen chìm.

### 2.3. Đánh dấu Người đã kết nối làm Khách hàng (Customer Conversion)
- **Chuẩn hóa Payload**:
  - Khi chọn một người từ danh sách đã kết nối, component phải truyền đầy đủ `personId` (UUID hoặc ID người kết nối) cùng với `displayName` và `fullName`.
  - Backend NestJS sử dụng `whitelist: true`, do đó DTO phía frontend và backend phải khớp nhau tuyệt đối (chấp nhận cả `personId`, `fullName`, `displayName`).

### 2.4. Quản lý Cộng đồng (Community Integrity & Anti-Hardcode)
- **Nghiêm cấm Hardcode thành viên**:
  - Khi tạo một cộng đồng mới, TUYỆT ĐỐI KHÔNG tự động thêm các tài khoản mẫu, tài khoản bot hay thành viên giả định vào danh sách.
  - Chỉ cho phép chủ phòng mời những người **ĐÃ KẾT NỐI BẠN BÈ** (`status = 'accepted'`) trong mạng lưới.
  - Mọi thao tác mời phải gọi API rõ ràng.
  - Người được mời phải nhận được thông báo (Bell Notification) kèm 2 nút hành động: **Đồng ý (Accept)** và **Từ chối (Decline)**. Chỉ khi người nhận bấm Đồng ý thì mới chính thức trở thành thành viên.

### 2.5. Tiêu chuẩn Màu sắc & Độ tương phản UI/UX (Brand Palette)
- **Màu sắc chủ đạo**:
  - Vàng Champagne Gold: `#D8B282` (hoặc ánh kim `#D4AF37`).
  - Đen Thạch Anh Obsidian: `#0B0F19` / `#121826` / `#1E293B`.
- **Quy tắc tương phản văn bản**:
  - Nút nền Vàng Champagne Gold -> Text BẮT BUỘC màu đen (`text-black font-semibold`). KHÔNG dùng text trắng trên nền vàng gây lóa mắt, khó đọc.
  - Nút trạng thái, badge thông báo: Dùng nền tối viền vàng (`bg-[#1A2234] border border-[#D8B282]/40 text-[#D8B282]`), không dùng nút đen tuyền trên nền đen gây chìm và mất khả năng nhận diện.
