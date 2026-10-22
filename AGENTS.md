# AGENTS RULES & CONSTRAINTS

## 1. Git Push & Commit Rule (STRICT)
- **TUYỆT ĐỐI KHÔNG TỰ ĐỘNG CHẠY `git push` HAY `git commit`**:
  - Không được tự ý thực thi các lệnh `git push` hoặc `git commit` trong terminal.
  - Mọi thay đổi mã nguồn chỉ được phép chỉnh sửa cục bộ (local).
  - Để người dùng toàn quyền chủ động kiểm tra, commit và push mã nguồn lên Git khi họ mong muốn.

## 2. Đồng Bộ Hóa Bắt Buộc: Memory, Cursor Rules & Tài Liệu Kỹ Thuật (STRICT)
- **Cập nhật MEMORY.md**: Mỗi lần thực hiện bất kỳ thay đổi kiến trúc, tính năng, sửa lỗi hoặc điều chỉnh luồng, BẮT BUỘC phải ghi nhận chi tiết vào `MEMORY.md`.
- **Cập nhật Cursor Rules / Roles (`.cursorrules`)**: Khi có quy chuẩn coding, quy tắc định tuyến, luồng xử lý hoặc vai trò mới, BẮT BUỘC phải bổ sung đồng bộ vào `.cursorrules`.
- **Bổ sung & Hiệu chỉnh Tài liệu Kỹ thuật**: Nếu phát hiện sai luồng, lệch schema/API/route, hoặc có thay đổi technical, BẮT BUỘC phải hiệu chỉnh ngay các tài liệu trong `document/` để code, database và tài liệu luôn khớp 100%.

## 3. Kiểm Tra Lỗi Code Bắt Buộc Trước Khi Hoàn Thành (STRICT CODE QUALITY & VERIFICATION)
- **TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỂ LỖI CODE**:
  - Trước khi thông báo hoàn thành bất kỳ nhiệm vụ nào, Agent BẮT BUỘC phải chạy kiểm tra type check (`tsc --noEmit`), linter hoặc AST validation trên toàn bộ các tệp vừa chỉnh sửa.
  - Tuyệt đối không để sót biến chưa khai báo, lỗi cú pháp (syntax errors), gạch chân đỏ trong IDE, hoặc kiểu dữ liệu không khớp.
  - Phải xác nhận lệnh kiểm tra trả về exit code 0 (0 errors) trước khi bàn giao cho người dùng.

## 4. Đồng Bộ Hai Bản App: Native ViOne & PWA ViOne (STRICT DUAL-APP PARITY)
- **BẮT BUỘC SỬA ĐỒNG BỘ CẢ 2 BẢN KHI CHỈNH SỬA APP**:
  - Khi có bất kỳ yêu cầu sửa lỗi, nâng cấp tính năng, chỉnh sửa giao diện hay luồng nghiệp vụ trên ứng dụng ViOne, BẮT BUỘC phải thực hiện đồng thời trên **CẢ 2 BẢN**: Native ViOne (`apps/mobile_vione`) và PWA ViOne (`apps/vione_app_fe`).
  - Hai bản phải đồng bộ đồng nhất 100% với nhau từ chức năng, luồng nghiệp vụ đến giao diện, hình ảnh, văn bản (text) và màu sắc thương hiệu (Vàng Champagne Gold / Đen Thạch Anh Obsidian).
  - Tuyệt đối không được chỉ sửa 1 bản mà bỏ quên bản còn lại.

## 5. Quy Chuẩn Agent Phân Tách Triển Khai Subdomain & Môi Trường Server (STRICT SUBDOMAIN & ENVIRONMENT DEPLOYMENT ISOLATION)
- **PHÂN ĐỊNH TUYỆT ĐỐI GIỮA HAI MÔI TRƯỜNG DEV VÀ SUBDOMAIN PRODUCTION**:
  - **Môi Trường Subdomain Production (Cổng Chuẩn 80 & 443 SSL)**:
    * **ViOne PWA App**: Subdomain chính thức `https://vione.viconnect.vn/`. Điều phối qua kịch bản `.\deploy-subdomain-vione.ps1` hoặc `.\deploy.ps1 -Target subdomain-vione`. Tự động kích hoạt khi push Git qua GitHub Actions `.github/workflows/deploy-vione.yml`.
    * **ViOne CRM Enterprise**: Subdomain chính thức `https://crm.viconnect.vn/`. Điều phối qua kịch bản `.\deploy-subdomain-crm.ps1` hoặc `.\deploy.ps1 -Target subdomain-crm`. Kích hoạt CI/CD qua `.github/workflows/deploy-crm.yml`.
    * **Phân Lập Tuyệt Đối**: Cổng 443 và Nginx phân luồng VirtualHost riêng biệt. Subdomain CRM (`crm.viconnect.vn`) cấm phục vụ `/connect-app` (tự động 301 Redirect sang `https://vione.viconnect.vn/connect-app`).
  - **Môi Trường Server Dev (Cổng Chuyên Biệt Kèm Port Trong URL)**:
    * **ViOne App Dev (Cổng 5445 HTTPS / 5010 HTTP)**: Triển khai qua `.\deploy-vione.ps1` trỏ URL `https://dev-vione.14-225-217-232.sslip.io:5445`.
    * **ViOne CRM Dev (Cổng 5446 HTTPS / 5006 HTTP)**: Triển khai qua `.\deploy-crm.ps1` trỏ URL `https://dev-vione-crm.14-225-217-232.sslip.io:5446`.
  - **Trách Nhiệm Của Agent Triển Khai (.ps1)**:
    * Trước khi build, BẮT BUỘC xác định đúng `TargetEnv` (`prod` cho subdomain, `dev` cho dev server) để nạp biến môi trường `VITE_PUBLIC_APP_URL` và `VITE_APP_SCOPE` chính xác.
    * Khi cần triển khai toàn diện, dùng Master Hub `.\deploy.ps1` với các cờ tham số rõ ràng. Tuyệt đối không nhầm lẫn giữa URL Dev và URL Subdomain Production.

## 6. Quy Trình Pre-Code & Cập Nhật SRS (STRICT PRE-CODE CHECK & ZERO-CLEAR TEXT RULE)
- **ĐỌC KỸ TÀI LIỆU TRƯỚC KHI CODE KHI CÓ YÊU CẦU MỚI**:
  * Trước khi viết bất kỳ dòng code nào, Agent BẮT BUỘC phải tra cứu mã Node trong `FEATURE_FLOW_NODE_MAP.md` để xác định chính xác các file liên quan (PWA, Native, Backend, DB).
  * Đọc kỹ tài liệu đặc tả tương ứng:
    - Nếu làm phân hệ CRM: đọc `docs/crm/SRS_CRM.md`, `docs/crm/TECHSPEC_CRM.md`, `docs/crm/QUY_CHUAN_UIUX_CRM.md`.
    - Nếu làm phân hệ App ViOne: đọc `docs/app_vione/SRS_APP.md`, `docs/app_vione/TECHSPEC_APP.md`, `docs/app_vione/QUY_CHUAN_UIUX_APP.md`.
- **CẬP NHẬT SRS KHI THAY ĐỔI LUỒNG - TUYỆT ĐỐI KHÔNG CLEAR TEXT CŨ**:
  * Khi update chức năng nào, PHẢI tìm đúng chức năng đó trong SRS tương ứng (`SRS_CRM.md` hoặc `SRS_APP.md`) theo Node ID / mã UC để cập nhật lại luồng.
  * **TUYỆT ĐỐI KHÔNG XÓA (CLEAR) NỘI DUNG CŨ** ở các file tài liệu. Luôn cập nhật / bổ sung chi tiết vào Use Case (UC) tương ứng, ghi nhận rõ lịch sử thay đổi và phiên bản cập nhật.

## 7. Quy Tắc Dữ Liệu Thực & Cấm Tự Ý Fake/Mock (STRICT ZERO-MOCK DATA RULE)
- **TUYỆT ĐỐI KHÔNG TỰ Ý FAKE DỮ LIỆU, MOCK ẢNH DỮ LIỆU**:
  * Nghiêm cấm tạo các mảng dữ liệu giả lập (mock data), ảnh placeholder ngẫu nhiên hoặc các hàm phóng đại chỉ số ảo (`Math.max(count, 33)`) trừ khi có yêu cầu bằng văn bản rõ ràng từ người dùng.
  * 100% dữ liệu hiển thị phải phản ánh trung thực từ RESTful API / CSDL PostgreSQL.
  * Khi CSDL trống hoặc chưa có dữ liệu: BẮT BUỘC hiển thị component `EmptyState` sạch sẽ, tinh tế với icon Lucide viền vàng, tiêu đề thông báo trung thực và nút hành động kêu gọi (CTA) nếu người dùng có quyền.

## 8. Quy Chuẩn Nút Gradient ViOne App: Cấm Nút Màu Khác Ngoài Gradient (STRICT GRADIENT-ONLY BUTTON RULE)
- **CẤM TUYỆT ĐỐI KHÔNG DÙNG NÚT MÀU KHÁC NGOÀI NÚT GRADIENT TRÊN VIONE APP**:
  * Hiện tại App ViOne có các màu nút lệch theo quy chuẩn UI/UX -> CẤM DÙNG NÚT ĐƠN SẮC TRƠN (như xám `bg-gray-*`, xanh `bg-blue-*`, đen trơn `bg-black`, trắng trơn `bg-white`, đỏ trơn `bg-red-*`).
  * **100% TẤT CẢ CÁC NÚT BẤM (BUTTONS / CTAs / ACTION CHIPS) TRÊN APP VIONE (CẢ PWA VÀ NATIVE) BẮT BUỘC PHẢI DÙNG NÚT GRADIENT**:
    1. **Primary Action**: Gradient Vàng Hoàng Gia Champagne Gold (`.bc-cta-gold` / `gradient-gold` / `expo-linear-gradient` `["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]`), chữ Đen Obsidian `#050C15` font-bold tương phản cao.
    2. **Secondary Action**: Gradient Đen Thạch Anh Mạ Vàng (`.bc-cta-gold-soft` / `gradient-secondary` viền mạ vàng `border-[#D8B282]/40`), chữ Vàng `#F6E1C3`.
    3. **Danger / Delete Action**: Gradient Đỏ Ruby (`gradient-destructive`), chữ Trắng `#FFFFFF` font-bold.
    4. **Success / Connect Action**: Gradient Ngọc Lục Bảo (`gradient-success`), chữ Trắng `#FFFFFF` font-bold.

## 9. Phân Bổ Thông Minh Chuẩn Kiến Trúc Triển Khai & Đóng Gói (DEPLOY ARCHITECTURE)
- **Tách Biệt Thư Mục Triển Khai Gọn Gàng**:
  * CRM riêng: `deploy/crm/` (Dockerfile.frontend, docker-compose.yml, fast-deploy.ps1)
  * App ViOne riêng: `deploy/vione/` (Dockerfile.frontend, docker-compose.yml, fast-deploy.ps1)
  * Mobile riêng: `deploy/mobile/` (`build-apk.ps1`, `build-ipa.ps1`, README.md)
  * Backend riêng: `deploy/backend/` (`Dockerfile.backend`)
  * SSL / Nginx: `deploy/ssl/` (`nginx.conf`, `deploy-ssl.ps1`)
  * Master Hub điều phối: `deploy.ps1` (hỗ trợ các cờ target rõ ràng cho cả CRM, App và Mobile).
