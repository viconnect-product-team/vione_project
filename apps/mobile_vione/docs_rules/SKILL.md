---
name: vione-mobile-skills
description: Kỹ năng, tiêu chuẩn lập trình và quy tắc phòng tránh lỗi dành cho Mobile Native React Native ViOne
---

# KỸ NĂNG & TIÊU CHUẨN REACT NATIVE VIONE (MOBILE NATIVE)

## 1. Công nghệ & Thư viện
- **React Native 0.74+ / Expo SDK 51**.
- **TypeScript & StyleSheet chuẩn React Native** (hạn chế style inline).
- **React Navigation** (BottomTabs, Stack Navigator).
- **Camera & Image Picker**: `expo-camera`, `expo-image-picker`.
- **AsyncStorage**: `@react-native-async-storage/async-storage` cho lưu trữ offline và session.
- **Lucide Icons**: `lucide-react-native` cho icon vector sắc nét.
- **Android SDK Build Tools 34.0.0, Gradle 8.3+**.

## 2. Quy tắc phòng tránh lỗi & Tiêu chuẩn kỹ thuật quan trọng (CRITICAL BEST PRACTICES)

### 2.1. Quản lý Chụp ảnh trực tiếp & Đăng khoảnh khắc
- **Xử lý URI ảnh chụp Native**:
  - Khi chụp ảnh từ camera hoặc thư viện (`ImagePicker.launchCameraAsync`), lấy đường dẫn file cục bộ `file://...` và upload lên endpoint `/api/v1/connect-app/moments/upload` hoặc `/api/v1/connect-app/moments/direct-photo`.
  - Tuyệt đối không thay thế URI vừa chụp bằng các ảnh mẫu demo khi render giao diện.
  - Phải hiển thị nút "Đăng khoảnh khắc" nổi bật (Màu Vàng Champagne Gold `#D8B282`) ngay tại đầu danh sách Mạng lưới để người dùng bấm chụp và đăng tức thì.
- **Đồng bộ State Feed**:
  - Sau khi đăng khoảnh khắc thành công, gọi ngay hàm refresh state feed của danh sách để tải lại bài viết kèm ảnh thật tế vừa chụp.

### 2.2. Quét Danh thiếp OCR & Lưu Danh bạ điện thoại
- **Trích xuất thông tin OCR**:
  - Gửi ảnh chụp danh thiếp lên endpoint OCR của backend hoặc xử lý nhận diện văn bản.
  - Phân tích bóc tách các trường: Họ và tên, Chức vụ, Số điện thoại, Email, Công ty, Địa chỉ.
  - Lưu vào mục "Danh thiếp đã quét" trên app.
- **Lưu Danh bạ điện thoại**:
  - Khi xuất file `.vcf` hoặc dùng API danh bạ (`expo-contacts` / native contacts), **CHỈ ĐƯỢC LƯU 3 TRƯỜNG**:
    1. Họ và tên (`fullName`).
    2. Chức danh (`jobTitle`).
    3. Số điện thoại (`phone`).
  - Không chèn thêm các trường rác hay note hệ thống vào danh bạ máy.
- **Nút Link Zalo**:
  - BẮT BUỘC dùng màu Vàng Champagne Gold (`backgroundColor: '#D8B282'`, `color: '#000000'`, `fontWeight: 'bold'`).

### 2.3. Đánh dấu Người đã kết nối làm Khách hàng
- Khi chọn người từ danh bạ kết nối, truyền định danh `personId` (UUID) và tên `fullName` đầy đủ để hệ thống chuyển đổi thành khách hàng chính xác, không bị lỗi thiếu trường.

### 2.4. Quản lý Cộng đồng (Tuyệt đối không Hardcode)
- Không tự động thêm thành viên giả lập vào cộng đồng mới tạo.
- Chỉ hiển thị danh sách bạn bè đã kết nối (`accepted connection`) để chủ phòng tích chọn gửi lời mời.
- Tài khoản được mời phải thấy thông báo trong tab Thông báo/Lời mời với 2 nút: **Đồng ý** và **Từ chối**.

### 2.5. Tiêu chuẩn Màu sắc & Độ tương phản UI/UX
- Màu nền: Obsidian Quartz `#0B0F19`.
- Màu chủ đạo: Vàng Champagne Gold `#D8B282`.
- Text trên nút Vàng luôn là màu Đen `#000000` (độ tương phản cao nhất).
- Nút trạng thái và tag thông báo không dùng nền đen tuyền chìm màu, mà phải dùng nền `#1A2234` viền vàng `#D8B282` để người dùng nhìn thấy rõ ràng.
