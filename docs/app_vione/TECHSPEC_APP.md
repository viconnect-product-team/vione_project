# ĐẶC TẢ KỸ THUẬT (TECHSPEC) - PHÂN HỆ APP VIONE (DUAL-APP)
## TECHNICAL SPECIFICATION — ARCHITECTURE, APIS & DATA MODELS (APP VIONE)

> **Mã tài liệu:** `VIONE-TECHSPEC-APP-03`  
> **Phiên bản:** `6.0.0 (Tháng 10/2026)`  
> **Phân hệ:** PWA ViOne (`apps/vione_app_fe`) & Native Mobile ViOne (`apps/mobile_vione`)  
> **Backend tương ứng:** `apps/vione_app_be`

---

## 1. KIẾN TRÚC KỸ THUẬT DUAL-APP PARITY

```
+---------------------------------------------------------------------------------+
|                       VIONE DUAL-APP ECOSYSTEM PARITY                           |
+---------------------------------------------------------------------------------+
|   PWA Responsive Web (`apps/vione_app_fe`)   |   React Native (`apps/mobile_vione`)   |
|   - Vite 5 + React 18 + TanStack Router     |   - Expo SDK 51 + React Native 0.74     |
|   - Tailwind CSS v4 + CVA Design Tokens      |   - StyleSheet + Theme Hook (`useTheme`)|
|   - Web Speech API (Voice Assistant)        |   - Speech Recognition Native Bridge    |
|   - Web Share API Level 2 (vCard)           |   - `expo-contacts` Native Contacts     |
|   - Service Worker (`sw.js`) + Apple WebClip|   - Standalone APK & IPA Build          |
+---------------------------------------------------------------------------------+
                                       │
                                       ▼ RESTful APIs / WebSocket
+---------------------------------------------------------------------------------+
|                        BACKEND NESTJS (`apps/vione_app_be`)                     |
|   - Auth & Session (`/connect-app/auth`)                                        |
|   - AI Card Vision & OCR (`/connect-app/card-scan`)                             |
|   - Direct Messaging (`/connect-app/dm`)                                        |
|   - Lead Management & CRM Bridge (`/api/operations/customers`)                  |
|   - Daily Operations & Staff Monitoring (`/api/operations/attendance`)          |
+---------------------------------------------------------------------------------+
                                       │
                                       ▼ Prisma ORM / PostgreSQL
+---------------------------------------------------------------------------------+
|                         POSTGRESQL DATABASE SCHEMAS                             |
|   `public.vione_users`, `user_profiles`, `business_identities`, `connections`,  |
|   `dm_threads`, `dm_messages`, `business_stories`, `business_cards`, `customers`|
+---------------------------------------------------------------------------------+
```

---

## 2. QUY CHUẨN KỸ THUẬT NÚT BẤM (BUTTON COMPONENT SPECIFICATION)

Để đảm bảo quy chuẩn **CẤM NÚT ĐƠN SẮC TRÊN TOÀN BỘ APP VIONE**, mã nguồn được chuẩn hóa như sau:

### 2.1. Phía PWA (`apps/vione_app_fe`):
- Mở rộng component `Button` trong `src/components/ui/button.tsx`:
  * `variant="gradient-gold"`: Nền `var(--bc-mobile-accent-grad)`, chữ `#050C15`, font-bold, shadow glow.
  * `variant="gradient-secondary"`: Nền `linear-gradient(135deg, #1E293B, #0F172A)`, viền mạ vàng `border-[#D8B282]/40`, chữ `#F6E1C3`.
  * `variant="gradient-destructive"`: Nền `linear-gradient(135deg, #EF4444, #991B1B)`, chữ `#FFFFFF`.
  * `variant="gradient-success"`: Nền `linear-gradient(135deg, #34D399, #047857)`, chữ `#FFFFFF`.
- Mặc định `variant="default"` chuyển thành `variant="gradient-gold"` cho giao diện App ViOne.

### 2.2. Phía React Native (`apps/mobile_vione`):
- Sử dụng component chuẩn `ViOneGradientButton` bọc `expo-linear-gradient`:
  ```typescript
  interface ViOneGradientButtonProps {
    variant: 'primary' | 'secondary' | 'danger' | 'success';
    onPress: () => void;
    title: string;
    icon?: React.ReactNode;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
  }
  ```

---

## 3. DANH MỤC RESTFUL APIS DÀNH CHO APP VIONE

| Phương thức | Đường dẫn API | Mục đích nghiệp vụ | Tham chiếu Use Case |
| :--- | :--- | :--- | :--- |
| `POST` | `/connect-app/auth/login` | Đăng nhập tài khoản | `UC-APP-01` |
| `POST` | `/connect-app/auth/register` | Đăng ký & tự động gửi email chào mừng | `UC-APP-01` |
| `GET` | `/connect-app/profile/me` | Lấy hồ sơ cá nhân đầy đủ | `UC-APP-02` |
| `PATCH` | `/connect-app/profile/me` | Cập nhật hồ sơ, avatar, cover | `UC-APP-02` |
| `GET` | `/api/public/profile/:identifier` | Xem hồ sơ công khai (không cần login) | `UC-APP-04` |
| `POST` | `/connect-app/card-scan/ocr` | Phân tích ảnh danh thiếp giấy qua AI Vision | `UC-APP-06` |
| `POST` | `/connect-app/card-scan/save` | Lưu danh thiếp vào ví thẻ cá nhân | `UC-APP-06` |
| `POST` | `/api/operations/customers` | Tạo khách hàng tiềm năng trong CRM Pipeline | `UC-APP-06` |
| `POST` | `/connect-app/dm/threads` | Tạo hoặc lấy thread chat 1-1 theo targetUserId | `UC-APP-07` |
| `GET` | `/connect-app/dm/threads/:id/messages` | Lấy lịch sử tin nhắn cuộc trò chuyện | `UC-APP-07` |
| `GET` | `/connect-app/stories/feed` | Dải khoảnh khắc 24h của bản thân & bạn bè | `UC-APP-08` |
| `POST` | `/connect-app/stories` | Đăng bài khoảnh khắc mới kèm hashtag B2B | `UC-APP-08` |
| `GET` | `/api/operations/staff/daily-activity`| Giám sát nhân sự trong ngày cho Giám đốc | `UC-APP-15` |
