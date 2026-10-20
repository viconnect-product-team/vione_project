# HƯỚNG DẪN KỸ THUẬT: PHÂN TÁCH TRIỂN KHAI SUBDOMAIN & SERVER DEV VIONE PLATFORM

Tài liệu này chuẩn hóa kiến trúc triển khai, quy tắc phân lập môi trường, và các kịch bản PowerShell (`.ps1`) cùng GitHub Actions CI/CD cho hệ sinh thái ViOne.

---

## 1. MA TRẬN HẠ TẦNG VÀ PHÂN LẬP CỔNG (PORT MATRIX)

Hệ thống ViOne được phân tách nghiêm ngặt thành 2 môi trường: **Môi trường Subdomain Production** (Cổng chuẩn 80/443 SSL) và **Môi trường Server DEV** (Cổng chuyên biệt):

| Môi trường / Phân hệ | Domain / URL truy cập | Cổng Nginx SSL | Container Frontend | Container Backend | Scope Build |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Subdomain PWA ViOne (Prod)** | `https://vione.viconnect.vn/` | 80 & 443 | `vione-frontend-prod` (8080) | `vione-backend-prod` (4000) | `vione_app` |
| **Subdomain CRM ViOne (Prod)** | `https://crm.viconnect.vn/` | 80 & 443 | `vione-crm-frontend-prod` (8080) | `vione-crm-backend-prod` (4000) | `crm_platform` |
| **Server DEV ViOne App** | `https://dev-vione.14-225-217-232.sslip.io:5445` | 5445 | `vione-frontend-prod` (5010) | `vione-backend-prod` (5011) | `vione_app` |
| **Server DEV ViOne CRM** | `https://dev-vione-crm.14-225-217-232.sslip.io:5446` | 5446 | `vione-crm-frontend-prod` (5006) | `vione-crm-backend-prod` (5007) | `crm_platform` |
| **Landing & CRM CEO 1983** | `https://dev-crm.14-225-217-232.sslip.io:5443` | 5443 | `crm-frontend-prod` (8080) | `crm-backend-prod` (4000) | `crm_platform` |

---

## 2. QUY CHUẨN CÁC KỊCH BẢN POWERSHELL (.PS1)

Hệ thống cung cấp bộ kịch bản PowerShell chuẩn hóa đặt tại thư mục gốc của dự án:

### A. Triển Khai Subdomain Production (Cổng 80 & 443)

| Kịch bản | Lệnh thực thi | Mục đích |
| :--- | :--- | :--- |
| **Deploy Subdomain ViOne PWA** | `.\deploy-subdomain-vione.ps1` | Build giao diện PWA với `https://vione.viconnect.vn`, đóng gói Docker và cập nhật container `vione-frontend-prod`, reload Nginx 443. |
| **Deploy Subdomain ViOne CRM** | `.\deploy-subdomain-crm.ps1` | Build giao diện CRM với `https://crm.viconnect.vn`, đóng gói Docker và cập nhật container `vione-crm-frontend-prod`, reload Nginx 443. |
| **Deploy Toàn Bộ Subdomain** | `.\deploy-subdomain.ps1 -Subdomain all` | Triển khai đồng thời cả 2 Subdomain PWA và CRM lên cổng 80 & 443. |

### B. Triển Khai Server DEV (Cổng 5445 / 5446)

| Kịch bản | Lệnh thực thi | Mục đích |
| :--- | :--- | :--- |
| **Deploy ViOne App Dev** | `.\deploy-vione.ps1` | Triển khai nhanh bản thử nghiệm lên Server Dev cổng `5445` (`https://dev-vione.14-225-217-232.sslip.io:5445`). |
| **Deploy ViOne CRM Dev** | `.\deploy-crm.ps1` | Triển khai nhanh bản thử nghiệm CRM lên Server Dev cổng `5446` (`https://dev-vione-crm.14-225-217-232.sslip.io:5446`). |

### C. Master Deployment Hub (`deploy.ps1`)

Kịch bản trung tâm điều phối toàn bộ phân hệ với tham số `-Target`:

```powershell
# 1. Triển khai Subdomain PWA:
.\deploy.ps1 -Target subdomain-vione

# 2. Triển khai Subdomain CRM:
.\deploy.ps1 -Target subdomain-crm

# 3. Triển khai cả 2 Subdomain:
.\deploy.ps1 -Target subdomain-all

# 4. Triển khai Server Dev ViOne App:
.\deploy.ps1 -Target dev-vione

# 5. Triển khai Server Dev ViOne CRM:
.\deploy.ps1 -Target dev-crm

# 6. Triển khai toàn bộ cả Dev lẫn Subdomain:
.\deploy.ps1 -Target all
```

---

## 3. QUY TRÌNH CI/CD GITHUB ACTIONS

Hệ sinh thái ViOne tích hợp GitHub Actions tự động hóa:

1. **Auto Deploy PWA to Subdomain (`.github/workflows/deploy-vione.yml`)**:
   - Tự động kích hoạt khi lập trình viên `git push` lên nhánh `main`.
   - Biên dịch TanStack React Start Frontend với biến môi trường `VITE_PUBLIC_APP_URL="https://vione.viconnect.vn"`.
   - Đóng gói Docker, chuyển tệp qua SCP và nạp container `vione-frontend-prod`, reload Nginx SSL Proxy.
2. **Deploy CRM to Subdomain (`.github/workflows/deploy-crm.yml`)**:
   - Kích hoạt qua giao diện GitHub Actions (`workflow_dispatch`) hoặc khi cập nhật `deploy/crm/**`.
   - Biên dịch Frontend với biến môi trường `VITE_PUBLIC_APP_URL="https://crm.viconnect.vn"`.
   - Nạp container `vione-crm-frontend-prod` và cập nhật Subdomain CRM.
3. **PR Integration Guardrails (`.github/workflows/pr-integration.yml`)**:
   - Chạy kiểm tra typecheck và bảo mật trên các Pull Request. Không can thiệp vào tiến trình push trực tiếp lên `main`.

---

## 4. QUY TẮC PHÂN LẬP TUYỆT ĐỐI NGINX REVERSE PROXY

Tại [deploy/ssl/nginx.conf](file:///d:/download/VICONNECT/CEO_VIONE_PROJECT/vione_project/deploy/ssl/nginx.conf):
- Subdomain `vione.viconnect.vn` lắng nghe cổng 80 & 443, proxy về `vione-frontend-prod:8080` và `vione-backend-prod:4000`.
- Subdomain `crm.viconnect.vn` lắng nghe cổng 80 & 443, proxy về `vione-crm-frontend-prod:8080` và `vione-crm-backend-prod:4000`.
- **Cấm lấn tuyến CRM sang PWA**: Mọi truy cập vào `/connect-app` tại `crm.viconnect.vn` hoặc cổng `5446` đều tự động nhận HTTP 301 Redirect chuyển thẳng sang `https://vione.viconnect.vn/connect-app`.
