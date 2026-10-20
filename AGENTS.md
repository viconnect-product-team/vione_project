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
    * **ViOne PWA App**: Subdomain chính thức `https://vione.viconnect.vn/`. Điều phối qua kịch bản `.\deploy-subdomain-vione.ps1` hoặc `.\deploy-subdomain.ps1 -Subdomain vione`. Tự động kích hoạt khi push Git qua GitHub Actions `.github/workflows/deploy-vione.yml`.
    * **ViOne CRM Enterprise**: Subdomain chính thức `https://crm.viconnect.vn/`. Điều phối qua kịch bản `.\deploy-subdomain-crm.ps1` hoặc `.\deploy-subdomain.ps1 -Subdomain crm`. Kích hoạt CI/CD qua `.github/workflows/deploy-crm.yml`.
    * **Phân Lập Tuyệt Đối**: Cổng 443 và Nginx phân luồng VirtualHost riêng biệt. Subdomain CRM (`crm.viconnect.vn`) cấm phục vụ `/connect-app` (tự động 301 Redirect sang `https://vione.viconnect.vn/connect-app`).
  - **Môi Trường Server Dev (Cổng Chuyên Biệt Kèm Port Trong URL)**:
    * **ViOne App Dev (Cổng 5445 HTTPS / 5010 HTTP)**: Triển khai qua `.\deploy-vione.ps1` trỏ URL `https://dev-vione.14-225-217-232.sslip.io:5445`.
    * **ViOne CRM Dev (Cổng 5446 HTTPS / 5006 HTTP)**: Triển khai qua `.\deploy-crm.ps1` trỏ URL `https://dev-vione-crm.14-225-217-232.sslip.io:5446`.
  - **Trách Nhiệm Của Agent Triển Khai (.ps1)**:
    * Trước khi build, BẮT BUỘC xác định đúng `TargetEnv` (`prod` cho subdomain, `dev` cho dev server) để nạp biến môi trường `VITE_PUBLIC_APP_URL` và `VITE_APP_SCOPE` chính xác.
    * Khi cần triển khai toàn diện, dùng Master Hub `.\deploy.ps1` với các cờ tham số rõ ràng. Tuyệt đối không nhầm lẫn giữa URL Dev và URL Subdomain Production.

