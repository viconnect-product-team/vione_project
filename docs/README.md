# MỤC LỤC & ĐIỀU HƯỚNG TÀI LIỆU KỸ THUẬT VIONE
## VIONE SYSTEM DOCUMENTATION & ARCHITECTURAL DIRECTORY

> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Nguyên tắc tổ chức:** Phân định rõ ràng: CRM ViOne riêng, App ViOne riêng, Tài liệu dùng chung riêng.

---

## 🗺️ BẢN ĐỒ TỔNG THỂ HỆ THỐNG TÀI LIỆU

```
docs/
│
├── 🏢 crm/                                  # [PHÂN HỆ CRM VIONE ENTERPRISE RIÊNG]
│   ├── BRD_CRM.md                           # Yêu cầu nghiệp vụ Quản trị CRM Doanh nghiệp
│   ├── SRS_CRM.md                           # Đặc tả ca sử dụng chi tiết (UC-CRM-01 -> UC-CRM-10)
│   ├── TECHSPEC_CRM.md                      # Đặc tả kỹ thuật, RESTful APIs, RBAC, Data Model
│   ├── QUY_CHUAN_UIUX_CRM.md                # Quy chuẩn giao diện Web CRM C-Level
│   ├── CURSORULES_CRM.md                    # Quy tắc Agent & ràng buộc kỹ thuật phân hệ CRM
│   └── SKILLS_CRM.md                        # Checklist kiểm thử các luật BR-WRK, BR-FIN, BR-HRM
│
├── 📱 app_vione/                             # [PHÂN HỆ APP VIONE CONNECT DUAL-APP RIÊNG]
│   ├── BRD_APP.md                           # Yêu cầu nghiệp vụ Doanh nhân ViOne Connect
│   ├── SRS_APP.md                           # Đặc tả ca sử dụng chi tiết (UC-APP-01 -> UC-APP-15)
│   ├── TECHSPEC_APP.md                      # Đặc tả kỹ thuật Dual-App (PWA + React Native Expo)
│   ├── QUY_CHUAN_UIUX_APP.md                # QUY CHUẨN GIAO DIỆN BẮT BUỘC: 100% NÚT GRADIENT
│   ├── CURSORULES_APP.md                    # Quy tắc Agent, Dual-App Parity, Zero-Mock Rule
│   └── SKILLS_APP.md                        # Checklist kiểm thử đồng bộ PWA vs Native
│
├── 🌐 common/                               # [TÀI LIỆU DÙNG CHUNG TOÀN HỆ THỐNG]
│   ├── DATABASE_SCHEMA_POSTGRESQL.md        # Danh mục bảng PostgreSQL & Entity Mapping
│   ├── SOLID_AND_CODING_CONVENTION.md       # Chuẩn lập trình Clean Architecture & TypeScript
│   ├── SA_BA_RULES_AND_SKILLS.md            # Quy chuẩn SA/BA & Chuỗi truy vết @CODE-MEMORY
│   ├── UIUX_SPEC_AND_FE_BE_BINDING.md       # Đặc tả giao diện & bản đồ binding dữ liệu FE-BE
│   └── BRD_SRS_TECHSPEC_QUALITY.md          # Cẩm nang tổng quan nghiệp vụ hệ sinh thái
│
└── 📍 FEATURE_FLOW_NODE_MAP.md (tại Root)   # BẢN ĐỒ ĐÁNH NODE LUỒNG CHỨC NĂNG TOÀN DIỆN
```

---

## 🔍 QUY TRÌNH TRA CỨU NHANH TRƯỚC KHI CODE

1. **Bước 1**: Mở `FEATURE_FLOW_NODE_MAP.md` tra cứu Mã Node (ví dụ `[NODE-APP-SCAN-02]` hoặc `[NODE-CRM-WORKFLOW-01]`).
2. **Bước 2**: Xác định phân hệ và mở đúng tài liệu SRS tương ứng:
   - Nếu là CRM: Mở `docs/crm/SRS_CRM.md`.
   - Nếu là App ViOne: Mở `docs/app_vione/SRS_APP.md`.
3. **Bước 3**: Kiểm tra kỹ các luật nghiệp vụ và quy chuẩn UI/UX:
   - App ViOne: **CẤM DÙNG NÚT ĐƠN SẮC, BẮT BUỘC 100% DÙNG GRADIENT**.
   - Cấm tự ý fake dữ liệu, mock ảnh. Dữ liệu rỗng hiển thị `EmptyState`.
4. **Bước 4**: Cập nhật SRS nếu luồng có thay đổi: **TUYỆT ĐỐI KHÔNG XÓA (CLEAR) NỘI DUNG CŨ**.
