# QUY CHUẨN GIAO DIỆN (UI/UX) - HỆ THỐNG WEB CRM VIONE
## VIONE CRM PLATFORM — EXECUTIVE UI/UX DESIGN SYSTEM & DATA INTEGRITY

> **Mã quy chuẩn:** `VIONE-UIUX-CRM-04`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Áp dụng cho:** Toàn bộ màn hình, bảng điều khiển và form nhập liệu của Web CRM ViOne.

---

## 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (CORE PRINCIPLES)

1. **TRIẾT LÝ TỐI GIẢN C-LEVEL: "CÀNG ÍT MÀU - ÍT CHỮ CÀNG TỐT":**
   - Tránh giao diện màu mè gây phân tán sự chú ý của lãnh đạo điều hành.
   - Tập trung vào số liệu thực tế, bảng biểu rõ ràng và trạng thái cảnh báo nổi bật.

2. **BẢNG MÀU CHUẨN ĐIỀU HÀNH EXECUTIVE OBSIDIAN SLATE:**
   - Nền chính: Dark Slate `#0F172A` / `#0B0F17` kết hợp các thẻ Surface `#1E293B`.
   - Màu nhấn nhận diện thương hiệu: Vàng Nâu ViOne (`#D8B282`, `#C29B69`).
   - Trạng thái nghiệp vụ:
     * Xanh lá (`#16A34A`): Hoàn thành, Đúng hạn, Đã duyệt, Hợp lệ.
     * Đỏ viền phát sáng (`#DC2626`, `shadow-[0_0_12px_rgba(220,38,38,0.5)]`): Quá hạn deadline, Cảnh báo quá tải, Chi phí bị từ chối.
     * Hổ phách / Vàng hổ phách (`#D97706`): Chờ phê duyệt, Cần chú ý trong 24h.

3. **CHUẨN KÍCH THƯỚC NÚT BẤM & CONTROL CỐ ĐỊNH (FIXED CONTROL HEIGHT):**
   - Tất cả các nút bấm, ô input tìm kiếm và dropdown bộ lọc trên cùng một thanh công cụ (Toolbar) bắt buộc phải có chiều cao đồng nhất (`h-9` = 36px hoặc `h-10` = 40px).
   - Tuyệt đối không để xảy ra tình trạng nút to nút nhỏ lệch hàng.

4. **QUY TẮC DỮ LIỆU THỰC & EMPTY STATE SẠCH SẼ (NO MOCK DATA):**
   - CẤM TUYỆT ĐỐI việc fake dữ liệu, mock ảnh tĩnh hoặc số liệu cứng trong giao diện CRM.
   - Khi bảng dữ liệu rỗng: Hiển thị EmptyState chuyên nghiệp với icon Lucide mạ vàng nhẹ, thông báo trung thực và nút CTA tạo mới nếu người dùng có quyền.
