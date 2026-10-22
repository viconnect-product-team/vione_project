# CURSOR RULES & AGENT CONSTRAINTS - PHÂN HỆ WEB CRM VIONE

> **Mã quy chuẩn:** `VIONE-RULES-CRM-05`  
> **Áp dụng cho:** Tất cả các tác vụ phát triển, sửa lỗi và nâng cấp trên phân hệ Web CRM ViOne.

---

## 1. QUY TRÌNH PRE-CODE BẮT BUỘC (MANDATORY PRE-CODE PROTOCOL)

1. **KIỂM TRA TÀI LIỆU TRƯỚC KHI CODE:**
   - Trước khi thực hiện bất kỳ yêu cầu mới nào trên CRM, Agent **BẮT BUỘC** phải:
     * Đọc kỹ `docs/crm/SRS_CRM.md` để nắm rõ Use Case `UC-CRM-xxx` và các luật nghiệp vụ `BR-WRK-*`, `BR-FIN-*`, `BR-HRM-*`.
     * Đọc `FEATURE_FLOW_NODE_MAP.md` để tìm đúng Node tương ứng.
2. **CẬP NHẬT SRS KHI THAY ĐỔI LUỒNG - KHÔNG CLEAR TEXT CŨ:**
   - Nếu có yêu cầu điều chỉnh luồng hoặc cập nhật chức năng:
     * Tìm đúng Use Case tương ứng trong `docs/crm/SRS_CRM.md`.
     * Bổ sung mục điều chỉnh luồng, đánh dấu version cập nhật.
     * **TUYỆT ĐỐI KHÔNG XÓA (CLEAR) NỘI DUNG CŨ** trong tài liệu SRS.

---

## 2. RÀNG BUỘC KỸ THUẬT PHÂN LẬP SUBDOMAIN (STRICT ISOLATION)

1. **PHÂN LẬP CỔNG 5446 & SUBDOMAIN CRM:**
   - Subdomain chính thức: `https://crm.viconnect.vn/`.
   - Cổng Dev Server: 5446.
   - **CẤM TRIỆT ĐỂ**: CRM tuyệt đối không được mở hay phục vụ đường dẫn `/connect-app`. Bất kỳ truy cập nào tới `/connect-app` từ cổng 5446 hoặc domain CRM phải được 301 Redirect sang `https://vione.viconnect.vn/connect-app`.

2. **DỮ LIỆU THẬT & EMPTY STATE (NO MOCK/FAKE DATA):**
   - CẤM TỰ Ý MOCK DỮ LIỆU hoặc fake ảnh dữ liệu trong giao diện CRM.
   - Mọi bản ghi công việc, chấm công, phê duyệt chi và leads phải lấy từ API NestJS và CSDL PostgreSQL.
   - Nếu database trống, hiển thị EmptyState trung thực và chuẩn mực.

3. **KIỂM TRA TYPECHECK TRƯỚC KHI BÀN GIAO:**
   - Chạy `npx tsc --noEmit` trên project trước khi hoàn thành, đảm bảo 0 errors.
