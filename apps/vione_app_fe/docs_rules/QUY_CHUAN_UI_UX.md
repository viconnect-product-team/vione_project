# QUY CHUẨN THIẾT KẾ UI/UX - VIONE

## 1. Triết lý Thiết kế
- **Phong cách**: Executive Minimalist, Sang trọng, Hiện đại, Định hướng Doanh nhân & Lãnh đạo.
- **Không gian**: Giảm thiểu chi tiết thừa, ưu tiên thẻ thông tin có độ tương phản cao, bo góc mềm mại (`rounded-2xl`, `rounded-3xl`).
- **Phân cấp thị giác**: Nội dung quan trọng nhất đặt ở vị trí mắt dễ tiếp cận nhất; các hành động chính (CTA) sử dụng màu Gold hoặc Navy nổi bật.

## 2. Bảng màu Chuẩn (Strict Palette)
- **Champagne Gold**:
  - Mã màu chính: `#DFB76C`, `#D4AF37`, `#C5A059`.
  - Ứng dụng: Điểm nhấn, viền thẻ nổi bật, icon chỉ thị, trạng thái hoàn thành / danh giá.
- **Obsidian / Deep Navy**:
  - Mã màu: `#0B0F17` (Dark Navy Obsidian), `#121A26` (Surface Dark), `#003B95` (Navy Accent).
  - Ứng dụng: Nền thanh điều hướng, thẻ chính điều hành, nút bấm chủ đạo.
- **Trắng & Slate xám**:
  - Mã màu: `#FFFFFF`, `#F8FAFC`, `#E2E8F0`, `#64748B`.
  - Ứng dụng: Nền thẻ sáng, chữ mô tả, đường viền phụ.

## 3. Quy tắc Icon & Logo
- Tuyệt đối không gắn logo cứng bên ngoài hay icon lòe loẹt.
- Chỉ sử dụng hệ thống vector icon Lucide nhất quán với stroke width 1.5 - 2px, kích thước chuẩn 16px - 24px.
- Các trạng thái hover/active phải có hiệu ứng chuyển động mượt mà (transition 150-200ms).

## 4. Quy tắc Dữ liệu Thực & Trạng thái Trống (Empty State)
- Tuyệt đối KHÔNG sử dụng dữ liệu tĩnh giả lập (mock data / fake fallback) trên giao diện Frontend.
- Dữ liệu hiển thị phải phản ánh 100% bản ghi thực tế từ CSDL PostgreSQL qua các RESTful API của NestJS Backend.
- Khi CSDL chưa có dữ liệu hoặc danh sách trả về rỗng, BẮT BUỘC hiển thị `EmptyState` sạch sẽ, bao gồm:
  * Icon minh họa Lucide tinh tế (ví dụ: `FolderKanban`, `Users`, `CreditCard`, `CalendarCheck`, `Sparkles`).
  * Tiêu đề thông báo rõ ràng (ví dụ: "Chưa có công việc nào", "Chưa có khách hàng nào").
  * Mô tả hoặc hướng dẫn nhẹ nhàng để người dùng biết bước tiếp theo.
  * Nút hành động kêu gọi tạo mới (CTA) nếu người dùng có quyền tương ứng.
- Không sử dụng các hàm giả lập chỉ số (`Math.max(..., 33)`) để phóng đại số liệu khi CSDL trống.

## 5. Quy Chuẩn Nút Bấm: CẤM DÙNG NÚT MÀU KHÁC NGOÀI NÚT GRADIENT (STRICT GRADIENT-ONLY BUTTON RULE)
- **ĐIỀU CẤM TUYỆT ĐỐI**:
  * CẤM dùng các nút màu đơn sắc trơn: xám `bg-gray-*`, xanh `bg-blue-*`, đen trơn `bg-black`, trắng trơn `bg-white`, đỏ trơn `bg-red-*`.
- **100% NÚT BẤM (BUTTONS / CTAs / ACTION CHIPS) BẮT BUỘC PHẢI DÙNG GRADIENT CHUẨN THƯƠNG HIỆU**:
  1. **Primary Action**: Gradient Vàng Hoàng Gia Champagne Gold (`.bc-cta-gold` hoặc variant `gradient-gold`):
     - CSS: `background-image: linear-gradient(135deg, #F6E1C3 0%, #D8B282 45%, #C29B69 85%, #8C653B 100%) !important;`
     - Text: Chữ đen Obsidian `#050C15` font-bold tương phản cao tuyệt đối.
     - Shadow: `0 4px 20px rgba(216, 178, 130, 0.45)`.
  2. **Secondary Action**: Gradient Đen Thạch Anh Mạ Vàng (`.bc-cta-gold-soft` hoặc variant `gradient-secondary`):
     - CSS: `background-image: linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #080D1A 100%) !important; border: 1px solid rgba(216, 178, 130, 0.45) !important;`
     - Text: Vàng đồng sáng `#F6E1C3`.
  3. **Danger Action**: Gradient Đỏ Ruby (`gradient-destructive`):
     - CSS: `linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)`, chữ Trắng `#FFFFFF`.
  4. **Success Action**: Gradient Ngọc Lục Bảo (`gradient-success`):
     - CSS: `linear-gradient(135deg, #34D399 0%, #10B981 50%, #047857 100%)`, chữ Trắng `#FFFFFF`.
