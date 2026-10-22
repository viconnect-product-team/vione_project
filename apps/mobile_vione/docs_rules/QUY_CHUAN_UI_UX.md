# QUY CHUẨN THIẾT KẾ UI/UX - MOBILE NATIVE VIONE

## 1. Phong cách Thiết kế Executive
- Tối giản, thanh lịch, sang trọng.
- Loại bỏ các đường viền sắc nhọn hoặc hiệu ứng đổ bóng quá nặng; ưu tiên bo góc mềm (`borderRadius: 16`, `20`, `24`).
- Thẻ thông tin chia rõ ràng theo từng khối chức năng, không nhồi nhét chi tiết phụ.

## 2. Bảng màu Chuẩn (Strict Theme Palette)
- **Champagne Gold**:
  - Mã: `#DFB76C` (Gold chính), `#D4AF37` (Gold sáng), `#F5E7C8` (Gold nhạt nền).
  - Sử dụng: Nút hành động nổi bật, icon chỉ thị, viền thẻ cao cấp.
- **Obsidian Navy**:
  - Mã: `#0B0F17` (Navy đậm), `#121A26` (Màu bề mặt), `#003B95` (Xanh Navy điểm nhấn).
  - Sử dụng: Nền thanh điều hướng dưới, thẻ trung tâm điều hành.
- **Trắng & Xám Slate**:
  - Mã: `#FFFFFF`, `#F8FAFC`, `#64748B`, `#94A3B8`.
  - Sử dụng: Văn bản nội dung, thanh phân cách, nền màn hình.

## 3. Quy chuẩn Icon & Tương tác
- Hiệu ứng phản hồi chạm (`activeOpacity={0.7}`) rõ ràng, phản hồi tức thì.

## 4. Quy Chuẩn Nút Bấm: CẤM DÙNG NÚT MÀU KHÁC NGOÀI NÚT GRADIENT (STRICT GRADIENT-ONLY BUTTON RULE)
- **ĐIỀU CẤM TUYỆT ĐỐI**:
  * CẤM dùng các nút màu đơn sắc trơn (xám, xanh trơn, đen trơn, trắng trơn, đỏ trơn).
- **100% NÚT BẤM (BUTTONS / CTAs / ACTION CHIPS) BẮT BUỘC PHẢI DÙNG GRADIENT BỌC `expo-linear-gradient`**:
  1. **Primary Action (Nút chính)**: `<ViOneGradientButton variant="primary">` hoặc `<LinearGradient colors={['#F6E1C3', '#D8B282', '#C29B69', '#8C653B']} start={{x:0, y:0}} end={{x:1, y:1}}>`.
     - Text: Chữ đen than `#050C15` font-bold/font-extrabold.
     - Shadow: `shadowColor: '#D8B282', shadowOpacity: 0.45, elevation: 8`.
  2. **Secondary Action (Nút phụ)**: `<ViOneGradientButton variant="secondary">` hoặc `<LinearGradient colors={['#1E293B', '#0F172A', '#080D1A']}>`.
     - Viền: `borderWidth: 1, borderColor: 'rgba(216, 178, 130, 0.45)'`.
     - Text: Vàng đồng `#F6E1C3`.
  3. **Danger Action (Nút xóa/hủy)**: `<ViOneGradientButton variant="danger">` hoặc `<LinearGradient colors={['#EF4444', '#DC2626', '#991B1B']}>`, chữ trắng `#FFFFFF`.
  4. **Success Action (Nút thành công/kết nối)**: `<ViOneGradientButton variant="success">` hoặc `<LinearGradient colors={['#34D399', '#10B981', '#047857']}>`, chữ trắng `#FFFFFF`.
