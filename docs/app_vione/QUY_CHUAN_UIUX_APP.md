# QUY CHUẨN GIAO DIỆN (UI/UX) - PHÂN HỆ VIONE APP (PWA & NATIVE)
## QUY ĐỊNH BẮT BUỘC: 100% NÚT BẤM DÙNG GRADIENT - CẤM NÚT ĐƠN SẮC

> **Mã quy chuẩn:** `VIONE-UIUX-APP-GRADIENT-01`  
> **Phiên bản:** `6.0.0 (Cập nhật Tháng 10/2026)`  
> **Áp dụng bắt buộc cho:** Cả 2 bản **PWA ViOne** (`apps/vione_app_fe`) và **Native Mobile ViOne** (`apps/mobile_vione`).  
> **Nguyên tắc xử lý vi phạm:** Mọi Pull Request, commit hoặc chỉnh sửa sử dụng nút màu đơn sắc (solid color: xám `bg-gray-*`, xanh `bg-blue-*`, đen trơn `bg-black`, trắng trơn `bg-white`, đỏ trơn `bg-red-*`) đều bị **TỪ CHỐI BÀN GIAO (REJECT)** ngay lập tức.

---

## 1. ĐIỀU LUẬT CẤM TUYỆT ĐỐI (STRICT PROHIBITION)

1. **CẤM TUYỆT ĐỐI SỬ DỤNG NÚT ĐƠN SẮC (NO SOLID COLOR BUTTONS):**
   - Không được dùng bất kỳ nút bấm tương tác (Button, CTA, Submit, Filter Chip Active, Floating Action Button, Action Drawer Button) có nền đơn sắc trơn.
   - Các màu bị cấm:
     * ❌ `bg-gray-800`, `bg-gray-900`, `bg-slate-800`, `bg-zinc-900` (Gây xỉn màu, mất đi vẻ hào quang sang trọng).
     * ❌ `bg-black`, `bg-black/80`, `bg-[#0B0F17]` làm nền nút bấm (Bị tối đen, chìm vào nền Dark Obsidian).
     * ❌ `bg-blue-600`, `bg-blue-500`, `bg-indigo-600` (Lệch hoàn toàn nhận diện thương hiệu Hoàng Gia ViOne).
     * ❌ `bg-white`, `bg-gray-100` làm nút chính (Chói mắt và gây xung đột tương phản khi chuyển theme).
     * ❌ `bg-red-500` trơn, `bg-green-500` trơn.

2. **100% NÚT BẤM PHẢI SỬ DÙNG GRADIENT CHUẨN THƯƠNG HIỆU VIONE:**
   - Mọi nút bấm trên ViOne App bắt buộc phải thuộc một trong 4 nhóm Gradient chuẩn mực dưới đây, có bóng đổ kim loại đa chiều (Metallic Glow Shadow) và hiệu ứng chuyển động mượt mà khi hover/press.

---

## 2. BỘ TỨ GRADIENT NÚT BẤM CHUẨN MỰC CỦA VIONE APP

### 🥇 Nhóm 1: Gradient Vàng Hoàng Gia Champagne Gold (PRIMARY CTA)
Áp dụng cho: **Hành động chính, Đăng nhập, Lưu, Xác nhận, Tạo mới, Giao việc, Duyệt, Quét mã, Đưa mã QR, Đăng ký**.

* **Thông số Màu (PWA Web & CSS):**
  ```css
  /* Gradient 3 điểm màu ánh kim hoàng tộc */
  background-image: linear-gradient(135deg, #F6E1C3 0%, #D8B282 45%, #C29B69 85%, #8C653B 100%) !important;
  /* Chữ bắt buộc: Đen thạch anh Obsidian tương phản cực cao */
  color: #050C15 !important;
  font-weight: 700 !important;
  /* Bóng kim loại phát sáng */
  box-shadow: 0 4px 20px rgba(216, 178, 130, 0.45), 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  ```
* **Thông số Màu (React Native Mobile - `expo-linear-gradient`):**
  ```typescript
  colors={['#F6E1C3', '#D8B282', '#C29B69', '#8C653B']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ shadowColor: '#D8B282', shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 }}
  // Chữ trong nút:
  <Text style={{ color: '#050C15', fontWeight: '800' }}>HÀNH ĐỘNG CHÍNH</Text>
  ```
* **Quy chuẩn Text**: BẮT BUỘC chữ đen `#050C15` hoặc `#0A0703`, `font-bold` / `font-extrabold`. TUYỆT ĐỐI KHÔNG để chữ trắng hoặc chữ xám trên nền vàng làm mờ mắt người dùng.

---

### 🥈 Nhóm 2: Gradient Đen Thạch Anh Mạ Vàng (SECONDARY / OUTLINE CTA)
Áp dụng cho: **Nút thao tác phụ, Huỷ, Đóng, Lọc phụ, Xem chi tiết, Ghi chú, Chia sẻ, Quay lại**.

* **Thông số Màu (PWA Web & CSS):**
  ```css
  /* Gradient sâu thẳm Obsidian kết hợp viền mạ vàng */
  background-image: linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #080D1A 100%) !important;
  border: 1px solid rgba(216, 178, 130, 0.45) !important;
  /* Chữ vàng đồng sáng hoặc trắng ngọc trai */
  color: #F6E1C3 !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(216, 178, 130, 0.2) !important;
  ```
* **Thông số Màu (React Native Mobile):**
  ```typescript
  colors={['#1E293B', '#0F172A', '#080D1A']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ borderWidth: 1, borderColor: 'rgba(216, 178, 130, 0.45)', shadowColor: '#000', elevation: 4 }}
  <Text style={{ color: '#F6E1C3', fontWeight: '600' }}>THAO TÁC PHỤ</Text>
  ```

---

### 🚨 Nhóm 3: Gradient Đỏ Ruby Hoàng Gia (DANGER / DESTRUCTIVE CTA)
Áp dụng cho: **Xóa vĩnh viễn, Từ chối phê duyệt, Hủy lời mời, Rút đơn, Đăng xuất khỏi thiết bị**.

* **Thông số Màu (PWA Web & CSS):**
  ```css
  background-image: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%) !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border: 1px solid rgba(254, 202, 202, 0.3) !important;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4) !important;
  ```
* **Thông số Màu (React Native Mobile):**
  ```typescript
  colors={['#EF4444', '#DC2626', '#991B1B']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ shadowColor: '#DC2626', shadowOpacity: 0.4, elevation: 6 }}
  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>XÓA / TỪ CHỐI</Text>
  ```

---

### 🟢 Nhóm 4: Gradient Ngọc Lục Bảo Emerald (SUCCESS / CONNECT CTA)
Áp dụng cho: **Chấp nhận kết nối, Đồng ý tham gia cộng đồng, Check-in thành công, Khớp lệnh B2B, Thanh toán hoàn tất**.

* **Thông số Màu (PWA Web & CSS):**
  ```css
  background-image: linear-gradient(135deg, #34D399 0%, #10B981 50%, #047857 100%) !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border: 1px solid rgba(167, 243, 208, 0.3) !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4) !important;
  ```
* **Thông số Màu (React Native Mobile):**
  ```typescript
  colors={['#34D399', '#10B981', '#047857']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ shadowColor: '#10B981', shadowOpacity: 0.4, elevation: 6 }}
  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>CHẤP NHẬN / THÀNH CÔNG</Text>
  ```

---

## 3. BẢNG TRA CỨU CLASS & COMPONENT DÙNG CHUẨN

| Mục đích nút | PWA Tailwind Utility Class | Component UI PWA | Component React Native |
| :--- | :--- | :--- | :--- |
| **Nút Chính (Primary)** | `.bc-cta-gold` hoặc `bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15]` | `<Button variant="gradient-gold">` | `<ViOneGradientButton variant="primary">` |
| **Nút Phụ (Secondary)** | `.bc-cta-gold-soft` hoặc `bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-[#D8B282]/40 text-[#F6E1C3]` | `<Button variant="gradient-secondary">` | `<ViOneGradientButton variant="secondary">` |
| **Nút Xóa / Hủy (Danger)** | `bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#991B1B] text-white border border-red-300/30` | `<Button variant="gradient-destructive">` | `<ViOneGradientButton variant="danger">` |
| **Nút Đồng ý (Success)** | `bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#047857] text-white border border-emerald-300/30` | `<Button variant="gradient-success">` | `<ViOneGradientButton variant="success">` |

---

## 4. QUY TẮC DỮ LIỆU THỰC & KHÔNG FAKE DỮ LIỆU TRÊN GIAO DIỆN (ZERO-MOCK DATA RULE)

1. **Tuyệt đối không hardcode mảng dữ liệu tĩnh (mock/dummy data) trong component giao diện**:
   - Dữ liệu hiển thị (danh sách công việc, đối tác, sự kiện, khoảnh khắc stories, hội viên, thông báo) **BẮT BUỘC 100% PHẢN ÁNH TỪ CSDL THỰC TẾ** thông qua API backend.
2. **Xử lý trạng thái trống (Empty State) đẳng cấp**:
   - Khi API trả về rỗng (`length === 0`), BẮT BUỘC hiển thị component `EmptyState` mạ vàng tinh tế gồm:
     * Icon Lucide vector sắc nét viền vàng (`Users`, `Briefcase`, `Calendar`, `Sparkles`).
     * Tiêu đề rõ ràng: "Chưa có dữ liệu", "Chưa có lịch hẹn nào", "Chưa có tin nhắn".
     * Lời mô tả gợi ý bước tiếp theo.
     * Nút bấm hành động kêu gọi (CTA) bằng **NÚT GRADIENT VÀNG HOÀNG GIA** (ví dụ: `+ Tạo lịch hẹn mới`, `+ Khám phá đối tác`).
3. **Cấm dùng hàm phóng đại chỉ số giả mạo**:
   - Nghiêm cấm dùng các hàm tính nhẩm hoặc làm tròn giả lập như `Math.max(count, 33)` để hiển thị số lượng ảo khi database trống.
