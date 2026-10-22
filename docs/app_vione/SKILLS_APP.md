# KỸ NĂNG & CHECKLIST KIỂM THỬ (SKILLS) - PHÂN HỆ APP VIONE
## VIONE DUAL-APP TESTING & VERIFICATION PROTOCOL

> **Mã tài liệu:** `VIONE-SKILLS-APP-05`  
> **Phân hệ:** PWA ViOne (`apps/vione_app_fe`) & Native Mobile ViOne (`apps/mobile_vione`)

---

## 1. KỸ NĂNG XÁC THỰC DUAL-APP PARITY (PWA VS NATIVE CHECKLIST)

Khi thực hiện bất kỳ chức năng nào trên App ViOne, kiểm tra theo checklist sau:

| STT | Hạng mục kiểm tra | Tiêu chí nghiệm thu trên PWA | Tiêu chí nghiệm thu trên Native |
| :--- | :--- | :--- | :--- |
| 1 | **Chuẩn nút Gradient** | Nút chính có class `.bc-cta-gold` / variant `gradient-gold`, chữ đen `#050C15`, không dùng nền đơn sắc. | Nút chính dùng `<ViOneGradientButton variant="primary">` với expo-linear-gradient vàng hoàng gia. |
| 2 | **Quét mã QR Live** | Mở camera WebRTC với viewfinder, laser line, quét QR vCard tức thì. | Mở camera Expo Camera, viewfinder mạ vàng, nhận diện QR dưới 0.3s. |
| 3 | **Quét danh thiếp AI** | Chụp ảnh $< 450\text{KB}$, trích xuất vCard, bật lưu Lead CRM có tier, deal value. | Chụp ảnh với quality 0.4, bóc tách thông tin, Switch lưu Lead CRM đồng bộ. |
| 4 | **Trang Hồ sơ `/p/:id`** | Bỏ qua AuthGate, hiển thị đầy đủ thông tin, nút gọi điện, Zalo, Lưu danh bạ 1-chạm (.vcf). | Đầy đủ nút tương tác, không đá vào màn hình login. |
| 5 | **Direct Message DM** | Gọi `POST /connect-app/dm/threads`, nhận UUID chuẩn từ DB, WebSocket chat realtime. | Nhận diện tin nhắn `isFromMe` chính xác, avatar và tên đối tác từ CSDL. |
| 6 | **Dải Khoảnh khắc 24h** | Chỉ hiển thị story của bản thân và bạn bè đã kết nối (`connected`), có EmptyState chuẩn. | Không hardcode story tĩnh, chạm vào xem full-screen tiến độ 0-100%. |
| 7 | **Quả cầu AI Voice** | Bấm đóng ẩn 100% không còn tab mép thừa. Nhận diện giọng nói tiếng Việt mượt mà. | Floating Orb kéo thả mượt mà, tắt là ẩn hoàn toàn khỏi màn hình. |
| 8 | **Dữ liệu thật & EmptyState** | Không chứa dữ liệu mock tĩnh, CSDL trống hiển thị EmptyState viền vàng tinh tế. | Không dùng mảng giả lập cứng, hiển thị EmptyState vector Lucide chuẩn. |

---

## 2. LỆNH KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN TRƯỚC KHI BÀN GIAO

```powershell
# 1. Kiểm tra Typecheck PWA ViOne
cd apps/vione_app_fe
npx tsc --noEmit

# 2. Kiểm tra Typecheck Native ViOne
cd ../mobile_vione
npx tsc --noEmit
```
Bắt buộc cả 2 lệnh trả về exit code 0 (0 errors).
