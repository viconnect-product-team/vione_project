# HƯỚNG DẪN KIẾN TRÚC TRIỂN KHAI & ĐÓNG GÓI VIONE (DEPLOYMENT ARCHITECTURE)
## PHÂN LẬP RÕ RÀNG: CRM RIÊNG, APP RIÊNG, MOBILE RIÊNG, BACKEND RIÊNG

> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Nguyên tắc cốt lõi:** Phân lập tuyệt đối giữa Server DEV (kèm Port) và Subdomain Production (Cổng 443 SSL). Phân định rõ ràng giữa CRM Quản trị và ViOne App/Mobile.

---

## 📂 SƠ ĐỒ THƯ MỤC KIẾN TRÚC TRIỂN KHAI

```
deploy/
├── crm/                    # [CRM RIÊNG] Phân hệ Web CRM Quản trị ViOne Enterprise
│   ├── .env.crm            # Cấu hình môi trường CRM Dev
│   ├── .env.production     # Cấu hình môi trường CRM Subdomain (crm.viconnect.vn)
│   ├── Dockerfile.frontend # Dockerfile đóng gói CRM Frontend
│   ├── docker-compose.yml  # Docker Compose dịch vụ CRM (Port 5006 FE / 5007 BE)
│   └── fast-deploy.ps1     # Kịch bản triển khai độc lập Web CRM
│
├── vione/                  # [APP VIONE RIÊNG] Phân hệ PWA ViOne App Doanh Nhân
│   ├── .env                # Cấu hình môi trường ViOne Dev
│   ├── .env.production     # Cấu hình môi trường PWA Subdomain (vione.viconnect.vn)
│   ├── Dockerfile.frontend # Dockerfile đóng gói ViOne PWA
│   ├── docker-compose.yml  # Docker Compose dịch vụ ViOne (Port 5010 FE / 5011 BE)
│   └── fast-deploy.ps1     # Kịch bản triển khai độc lập ViOne App PWA
│
├── mobile/                 # [MOBILE RIÊNG] Đóng gói & Build Ứng dụng Di động Native
│   ├── build-apk.ps1       # Script 1-Click biên dịch file APK Android (Local Gradle / EAS)
│   └── build-ipa.ps1       # Script biên dịch IPA cho iOS
│
├── backend/                # [BACKEND RIÊNG] Đóng gói Dịch vụ API NestJS
│   └── Dockerfile.backend  # Dockerfile đa tầng đóng gói Backend NestJS Node.js
│
└── ssl/                    # [NGINX & SSL] Điều phối VirtualHost Reverse Proxy
    ├── nginx.conf          # Cấu hình VirtualHost phân lập riêng CRM và ViOne App
    └── deploy-ssl.ps1      # Kịch bản nạp chứng chỉ SSL và reload Nginx
```

---

## 🚀 CÁCH SỬ DỤNG KỊCH BẢN TRIỂN KHAI

### 1. Triển Khai CRM Quản Trị (CRM Riêng)
- **Triển khai Server Dev (Cổng 5446):**
  ```powershell
  .\deploy.ps1 -Target dev-crm
  # hoặc chạy script wrapper:
  .\deploy-crm.ps1
  ```
- **Triển khai Subdomain Production (`https://crm.viconnect.vn`):**
  ```powershell
  .\deploy.ps1 -Target subdomain-crm
  # hoặc chạy:
  .\deploy-subdomain-crm.ps1
  ```

### 2. Triển Khai ViOne App PWA (App Riêng)
- **Triển khai Server Dev (Cổng 5445):**
  ```powershell
  .\deploy.ps1 -Target dev-vione
  # hoặc chạy script wrapper:
  .\deploy-vione.ps1
  ```
- **Triển khai Subdomain Production (`https://vione.viconnect.vn`):**
  ```powershell
  .\deploy.ps1 -Target subdomain-vione
  # hoặc chạy:
  .\deploy-subdomain-vione.ps1
  ```

### 3. Biên Dịch Ứng Dụng Di Động Native (Mobile Riêng)
- **Biên dịch Android APK:**
  ```powershell
  # Chạy trực tiếp từ deploy/mobile/
  & "deploy/mobile/build-apk.ps1" -Profile preview
  # hoặc chạy lệnh wrapper tại root:
  .\build-apk.ps1
  ```
- **Biên dịch iOS IPA:**
  ```powershell
  & "deploy/mobile/build-ipa.ps1"
  # hoặc chạy:
  .\build-ipa.ps1
  ```
