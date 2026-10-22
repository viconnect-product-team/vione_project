# CURSOR RULES & AGENT CONSTRAINTS - PHÂN HỆ APP VIONE (PWA & NATIVE)

> **Mã quy chuẩn:** `VIONE-RULES-APP-04`  
> **Áp dụng cho:** Tất cả các tác vụ phát triển, sửa bug, nâng cấp trên PWA ViOne (`apps/vione_app_fe`) và Native ViOne (`apps/mobile_vione`).

---

## 1. QUY TẮC PRE-CODE BẮT BUỘC (MANDATORY PRE-CODE WORKFLOW)

1. **ĐỌC KỸ TÀI LIỆU TRƯỚC KHI VIẾT CODE:**
   - Trước khi thực hiện bất kỳ yêu cầu mới nào, Agent **BẮT BUỘC** phải đọc kỹ các tệp:
     * `docs/app_vione/SRS_APP.md`: Để xác định đúng Use Case và luồng nghiệp vụ.
     * `docs/app_vione/QUY_CHUAN_UIUX_APP.md`: Để tuân thủ đúng bảng màu và quy chuẩn nút bấm.
     * `FEATURE_FLOW_NODE_MAP.md`: Để tra cứu đúng mã Node và các file liên quan cần sửa.
2. **CẬP NHẬT SRS KHI THAY ĐỔI LUỒNG - KHÔNG CLEAR TEXT CŨ:**
   - Khi có thay đổi luồng hoặc yêu cầu sửa chức năng:
     * Tìm đúng Use Case `UC-APP-xxx` trong `docs/app_vione/SRS_APP.md`.
     * Cập nhật lại luồng xử lý hoặc thêm phần "Lịch sử cập nhật / Luồng điều chỉnh".
     * **TUYỆT ĐỐI KHÔNG XÓA NỘI DUNG CŨ** làm mất dấu vết yêu cầu nghiệp vụ ban đầu.

---

## 2. QUY CHUẨN GIAO DIỆN & NÚT BẤM (STRICT BUTTON & THEME RULES)

1. **CẤM DÙNG NÚT ĐƠN SẮC - 100% NÚT BẤM DÙNG GRADIENT:**
   - Nghiêm cấm hoàn toàn các nút màu trơn (`bg-gray-*`, `bg-black`, `bg-blue-*`, `bg-white`).
   - Mọi nút bấm trên App ViOne bắt buộc thuộc 4 nhóm gradient chuẩn:
     * Nút chính: **Gradient Vàng Hoàng Gia Champagne Gold** (`.bc-cta-gold` hoặc variant `gradient-gold`) kèm chữ đen `#050C15` font-bold.
     * Nút phụ: **Gradient Đen Thạch Anh Mạ Vàng** (`.bc-cta-gold-soft` hoặc variant `gradient-secondary`) viền vàng mạ `#D8B282/40`, chữ vàng sáng.
     * Nút xóa/từ chối: **Gradient Đỏ Ruby** (variant `gradient-destructive`), chữ trắng.
     * Nút chấp nhận/thành công: **Gradient Ngọc Lục Bảo** (variant `gradient-success`), chữ trắng.

2. **CẤM TỰ Ý FAKE DỮ LIỆU & MOCK DATA (ZERO-MOCK RULE):**
   - Tuyệt đối không tự ý viết các mảng mock dữ liệu tĩnh trong component.
   - 100% dữ liệu hiển thị phải phản ánh trung thực từ RESTful API / CSDL PostgreSQL.
   - Khi CSDL trống, bắt buộc hiển thị `EmptyState` mạ vàng sang trọng với icon Lucide tinh tế và nút CTA gradient vàng hoàng gia.

---

## 3. QUY TẮC DUAL-APP PARITY (ĐỒNG BỘ NATIVE & PWA)

1. **SỬA ĐỒNG THỜI CẢ 2 BẢN KHI CHỈNH SỬA APP VIONE:**
   - Bất kỳ thay đổi logic, màn hình, luồng nghiệp vụ hay text hiển thị nào trên ViOne App đều phải được thực hiện đồng thời trên cả **PWA** (`apps/vione_app_fe`) và **Native** (`apps/mobile_vione`).
   - Không được sửa một bên và bỏ quên bên còn lại.

2. **KIỂM TRA LỖI CODE TRƯỚC KHI HOÀN THÀNH:**
   - Bắt buộc chạy kiểm tra typecheck: `npx tsc --noEmit` trên cả 2 thư mục app.
   - Đảm bảo trả về exit code 0 (0 errors, không còn gạch đỏ IDE).
