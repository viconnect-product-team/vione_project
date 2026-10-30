// scripts/content_vione_mobile.js
// 20 Phân hệ Ứng dụng Di động ViOne (ViOne Connect Mobile App) chi tiết chuẩn mực theo phong cách Uniwork

const MOBILE_MODULES = [
  {
    id: 1,
    subCode: '2.3.3.1',
    name: 'Phân hệ Màn hình Đăng nhập Di động Chuẩn Obsidian Luxury & Sinh trắc học Biometrics',
    shortTitle: 'Đăng nhập Di động & Sinh trắc học Biometrics',
    imgFile: 'app_01_login.png',
    figTitle: 'Hình 3.1 – Giao Diện Di Động Đăng Nhập Chuẩn Obsidian Luxury & FaceID',
    generalDesc: 'Phân hệ khởi động ứng dụng di động ViOne trên hệ điều hành iOS và Android, mang ngôn ngữ thiết kế Obsidian Luxury với tông màu Đen Thạch Anh và Vàng Hoàng Gia Champagne Gold đẳng cấp; hỗ trợ mở khóa sinh trắc học FaceID / TouchID siêu tốc và duy trì phiên an toàn. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Đăng nhập nhanh bằng Sinh trắc học FaceID / TouchID',
        desc: 'Sử dụng phần cứng bảo mật Apple Secure Enclave và Android Keystore để nhận diện khuôn mặt 3D hoặc vân tay, đăng nhập vào ứng dụng trong 0.3 giây mà không cần nhập mật khẩu.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đăng nhập bằng số điện thoại và mã OTP tin nhắn',
        desc: 'Cho phép đăng nhập bằng số điện thoại di động đăng ký; hệ thống tự động bắt mã xác thực SMS OTP / Zalo OTP an toàn để xác thực danh tính doanh nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Giao diện thượng lưu Obsidian Gold sang trọng',
        desc: 'Thiết kế chuẩn hóa trải nghiệm người dùng cao cấp với hiệu ứng ánh kim vàng kim loại hoàng gia (Metallic Gold Gradient) dập nổi trên nền đen tuyền obsidian, tối ưu pin màn hình OLED.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Cơ chế lưu trữ khóa bảo mật thiết bị (Hardware Keystore)',
        desc: 'Mã hóa lưu trữ Refresh Token trong bộ nhớ mã hóa phần cứng Keychain / Keystore của thiết bị; tự động xoay vòng khóa và thu hồi token khi phát hiện thiết bị bị bẻ khóa (Jailbreak / Root).',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Khởi động ứng dụng di động ViOne trên thiết bị iPhone hoặc điện thoại Android.',
      'Bước 2: Màn hình chào mừng sang trọng hiển thị, ứng dụng tự động yêu cầu quét FaceID hoặc TouchID.',
      'Bước 3: Trường hợp đăng nhập lần đầu, nhập Số điện thoại hoặc Email cùng Mật khẩu tài khoản đã đăng ký.',
      'Bước 4: Nhấn nút gradient vàng "Đăng nhập" để truy cập ngay vào Bàn điều hành Lãnh đạo Executive Home.'
    ]
  },
  {
    id: 2,
    subCode: '2.3.3.2',
    name: 'Phân hệ Trang chủ Điều hành C-Level Executive Home & Widget Chỉ số Realtime',
    shortTitle: 'Trang chủ Điều hành C-Level Executive Home',
    imgFile: 'app_02_home.png',
    figTitle: 'Hình 3.2 – Giao Diện Di Động Trang Chủ Điều Hành C-Level Executive Home',
    generalDesc: 'Phân hệ trung tâm chỉ huy dành riêng cho các chủ doanh nghiệp và lãnh đạo cấp cao trên smartphone; tổng hợp thẻ định danh số vCard, lịch trình gặp gỡ đối tác trong ngày, các phím tắt tác vụ nhanh 1-chạm và chỉ số dòng tiền trực tiếp. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Thẻ định danh doanh nhân số hiển thị trực quan',
        desc: 'Hiển thị thẻ danh thiếp số nổi bật với ảnh đại diện, họ tên, chức danh, tên công ty, cấp độ thẻ VIP (Gold/Platinum) kèm hiệu ứng ánh kim chuyển màu sinh động.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bảng điều khiển tác vụ nhanh 1-chạm (Quick Action Chips)',
        desc: 'Cung cấp các nút bấm gradient vàng mở nhanh các tác vụ thường nhật: Chia sẻ thẻ số, Quét danh thiếp AI OCR, Mở ví vé sự kiện, Bật GPS kết nối đối tác xung quanh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Widget lịch trình sự kiện và cuộc hẹn hôm nay',
        desc: 'Hiển thị các phiên hội nghị sắp diễn ra trong ngày, thời gian check-in, phòng họp điều hành trực tuyến và lịch hẹn giao thương với đối tác đã được xác nhận.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Chỉ số đo lường hiệu quả kết nối mạng lưới giao thương',
        desc: 'Thống kê số lượt đối tác đã xem danh thiếp, số người lưu số điện thoại vào danh bạ và số cơ hội kinh doanh đang cần xử lý trong tuần.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Cập nhật tin tức quan trọng từ chi hội qua thông báo đẩy',
        desc: 'Lướt xem các thông báo khẩn từ Ban Điều hành chi hội, thư mời tham dự gala doanh nhân và các chính sách kết nối mới nhất.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Sau khi đăng nhập thành công, người dùng lập tức có mặt tại màn hình "Executive Home".',
      'Bước 2: Vuốt ngang thẻ danh thiếp số để xem mã QR định danh cá nhân và số hiệu thẻ VIP.',
      'Bước 3: Nhấp vào các phím chức năng nhanh ở hàng ngang để truy cập ngay tính năng cần sử dụng.',
      'Bước 4: Kiểm tra khối "Lịch trình hôm nay" để nắm bắt các phiên họp và giờ check-in sự kiện doanh nhân.'
    ]
  },
  {
    id: 3,
    subCode: '2.3.3.3',
    name: 'Phân hệ Danh thiếp Số vCard & Chạm 1-Tap NFC Vật lý Độc quyền',
    shortTitle: 'Danh thiếp Số vCard & Chạm 1-Tap NFC Vật lý',
    imgFile: 'app_03_card_sheet.png',
    figTitle: 'Hình 3.3 – Giao Diện Di Động Danh Thiếp Số vCard & Ngăn Kéo Chia Sẻ NFC',
    generalDesc: 'Phân hệ biến smartphone thành một công cụ trao đổi thông tin danh thiếp số thượng lưu thay thế hoàn toàn danh thiếp giấy truyền thống, hỗ trợ công nghệ chạm không dây 1-Tap NFC với thẻ vật lý hoặc hiển thị ngăn kéo chia sẻ đa kênh. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Chạm 1-Tap NFC truyền tải danh bạ không chạm',
        desc: 'Chỉ cần chạm mặt lưng điện thoại có gắn thẻ NFC ViOne vào điện thoại của đối tác (kể cả đối tác không cài app), trang hồ sơ danh thiếp số lập tức tự động mở ra.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Lưu trực tiếp vào danh bạ điện thoại 1-chạm (Add to Contacts)',
        desc: 'Trang danh thiếp số cung cấp nút "Lưu danh bạ"; đối tác chỉ cần nhấp 1 lần là toàn bộ Họ tên, Số điện thoại, Email, Chức vụ, Logo công ty tự động lưu vào danh bạ máy.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Ngăn kéo chia sẻ đa nền tảng (Action Share Sheet)',
        desc: 'Cho phép gửi danh thiếp số qua Zalo, tin nhắn SMS, AirDrop, quét QR hoặc sao chép liên kết rút gọn cá nhân hóa chuyên nghiệp.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Tùy biến chế độ hiển thị thông tin riêng tư',
        desc: 'Doanh nhân có quyền ẩn/hiện số điện thoại cá nhân, chỉ hiển thị số hotline công ty hoặc liên kết mạng xã hội LinkedIn/Facebook tùy theo từng bối cảnh giao tiếp.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Tại màn hình Trang chủ, nhấp vào nút "Chia sẻ danh thiếp" hoặc đưa thẻ NFC lại gần máy đối tác.',
      'Bước 2: Ngăn kéo Action Sheet mạ vàng mở lên từ đáy màn hình hiển thị các phương thức chia sẻ.',
      'Bước 3: Chọn "Chia sẻ qua Zalo" hoặc đưa mã QR cho đối tác sử dụng camera điện thoại quét trực tiếp.',
      'Bước 4: Đối tác nhấn nút "Lưu liên hệ" để tự động thêm thông tin doanh nhân vào danh bạ smartphone.'
    ]
  },
  {
    id: 4,
    subCode: '2.3.3.4',
    name: 'Phân hệ Menu Điều phối Nổi Độc Quyền VActionSheet 3D Dập Nổi Vàng Hoàng Gia',
    shortTitle: 'Menu Điều phối Nổi VActionSheet 3D Hoàng Gia',
    imgFile: 'app_08_vaction.png',
    figTitle: 'Hình 3.4 – Giao Diện Di Động Menu Điều Phối Nổi VActionSheet 3D Độc Quyền',
    generalDesc: 'Phân hệ điểm nhấn nhận diện thương hiệu độc quyền của ViOne: nút tròn trung tâm chữ "V" dập nổi mạ vàng hoàng gia tại thanh điều hướng đáy, khi chạm vào sẽ bung mở một menu hình nan quạt / cánh hoa 3D tuyệt mỹ cho phép mở tức thì các phân hệ chuyên sâu. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Nút biểu tượng chữ "V" dập nổi 3D sang trọng',
        desc: 'Nút điều hướng trung tâm thiết kế nổi hẳn lên trên thanh TabBar, bọc viền vàng Champagne Gold sắc nét với hiệu ứng đổ bóng mờ ảo (Obsidian Glow) tạo điểm nhấn thượng lưu.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Menu mở rộng hiệu ứng nan quạt / cánh hoa 3D mượt mà',
        desc: 'Sử dụng công nghệ diễn hoạt Reanimated mượt mà với tốc độ 60fps; khi chạm vào nút V, các nút chức năng bung tỏa nhẹ nhàng kèm hiệu ứng rung haptic phản hồi xúc giác tinh tế.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Cổng truy cập nhanh các phân hệ thể thao và di sản',
        desc: 'Dẫn nhanh người dùng chỉ với 1-chạm tới các phân hệ: ViOne Sport (Giải đấu thể thao), ViOne Run (Chạy bộ Marathon), ViOne Museum (Bảo tàng 3D) và ViOne Heritage (Di sản văn hóa).',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Đóng menu thông minh khi chạm nền mờ (Backdrop Blur)',
        desc: 'Nền ứng dụng được làm mờ nhẹ nhàng bằng hiệu ứng kính phủ mờ (Glassmorphism); chạm vào bất kỳ khoảng trống nào để đóng menu nhanh chóng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chạm vào nút tròn biểu tượng chữ "V" màu vàng dập nổi nằm chính giữa thanh Bottom Navigation.',
      'Bước 2: Menu điều phối VActionSheet 3D bung mở với hiệu ứng các biểu tượng tỏa rộng tinh tế.',
      'Bước 3: Chọn phân hệ mong muốn như "ViOne Sport", "ViOne Run", "Bảo Tàng 3D" hoặc "Di Sản".',
      'Bước 4: Ứng dụng lập tức chuyển cảnh mượt mà đưa người dùng tới giao diện phân hệ vừa chọn.'
    ]
  },
  {
    id: 5,
    subCode: '2.3.3.5',
    name: 'Phân hệ Quét Thẻ Thông Minh & Bóc Tách Danh Thiếp Tự Động AI OCR',
    shortTitle: 'Quét Thẻ Thông Minh & Bóc Tách AI OCR',
    imgFile: 'app_13_ocr.png',
    figTitle: 'Hình 3.5 – Giao Diện Di Động Quét Thẻ Thông Minh & Bóc Tách Danh Thiếp AI OCR',
    generalDesc: 'Phân hệ ứng dụng thị giác máy tính và trí tuệ nhân tạo nhận dạng ký tự quang học (AI OCR) chạy trực tiếp trên thiết bị di động, tự động quét khung danh thiếp giấy, căn chỉnh góc nghiêng và trích xuất dữ liệu danh bạ trong 1 giây. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Khung ngắm quét camera tự động căn biên và bắt nét',
        desc: 'Hệ thống camera thông minh tự động nhận diện 4 góc của danh thiếp giấy, khử bóng mờ, cân bằng trắng và tự động chụp ngay khi phát hiện góc chụp rõ nét.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bóc tách thông tin đa ngôn ngữ bằng mô hình AI OCR',
        desc: 'Trích xuất chính xác 100% các trường: Họ và tên, Chức vụ lãnh đạo, Tên pháp nhân công ty, Số điện thoại di động, Email, Địa chỉ trụ sở và Mã số thuế.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Xem trước và chỉnh sửa thông tin trước khi lưu',
        desc: 'Hiển thị biểu mẫu điền sẵn dữ liệu vừa bóc tách kèm ảnh chụp gốc đối chiếu; người dùng có thể chạm để chỉnh sửa nhanh các ký tự nếu cần.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Đồng bộ tức thì lên Cổng Web Quản trị và danh bạ máy',
        desc: 'Chỉ với 1 lần chạm "Lưu đối tác", thông tin danh thiếp vừa bóc tách đồng thời được lưu vào CSDL khách hàng trên Cổng Web Quản Trị và danh bạ điện thoại di động.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn tính năng "Quét danh thiếp AI" từ màn hình chính hoặc menu điều phối VActionSheet.',
      'Bước 2: Hướng camera điện thoại về phía tấm danh thiếp giấy, giữ cố định trong khung ngắm mạ vàng.',
      'Bước 3: Máy ảnh tự động chụp và AI xử lý bóc tách thông tin hiển thị lên màn hình trong 1 giây.',
      'Bước 4: Kiểm tra lại các trường dữ liệu và nhấn nút gradient vàng "Lưu vào hệ thống".'
    ]
  },
  {
    id: 6,
    subCode: '2.3.3.6',
    name: 'Phân hệ Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS Geolocation',
    shortTitle: 'Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS',
    imgFile: 'app_05_network.png',
    figTitle: 'Hình 3.6 – Giao Diện Di Động Mạng Lưới Kết Nối & Thư Viện Doanh Nhân',
    generalDesc: 'Phân hệ kết nối cộng đồng doanh nhân số hóa, hỗ trợ tra cứu danh bạ doanh nghiệp toàn diện, tích hợp bản đồ định vị GPS Geolocation phát hiện các đối tác doanh nhân đang ở gần bán kính 1km - 5km để hẹn gặp giao thương trực tiếp. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Bản đồ số định vị doanh nhân ở gần (Radar GPS Connect)',
        desc: 'Hiển thị các vị trí doanh nhân đang có mặt trong khu vực lân cận trên bản đồ số; bảo vệ quyền riêng tư bằng cách chỉ hiển thị khoảng cách ước lượng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bộ lọc ngành nghề và quy mô doanh nghiệp thông minh',
        desc: 'Lọc nhanh danh bạ doanh nhân theo nhóm ngành hàng: Xây dựng, Tài chính, Bất động sản, Công nghệ thông tin, Sản xuất xuất khẩu và cấp bậc doanh nhân VIP.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Xem hồ sơ năng lực doanh nghiệp và danh mục sản phẩm',
        desc: 'Truy cập hồ sơ chi tiết của đối tác: Xem profile lãnh đạo, tải về tài liệu hồ sơ năng lực công ty (Company Profile PDF) và xem các sản phẩm chủ lực.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Gửi yêu cầu kết nối giao thương 1-chạm (Connect Request)',
        desc: 'Gửi lời mời kết nối kèm lời chào giới thiệu ngắn; hệ thống gửi thông báo đẩy đến điện thoại của đối tác để phản hồi chấp thuận hoặc từ chối.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Thêm vào danh bạ đối tác yêu thích (Favorite Partners)',
        desc: 'Lưu các đối tác chiến lược vào danh sách ưu tiên để dễ dàng theo dõi các bài đăng sản phẩm và trao đổi tin nhắn khi có cơ hội kinh doanh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn tab "Mạng lưới" trên thanh điều hướng đáy của ứng dụng di động ViOne.',
      'Bước 2: Sử dụng bộ lọc ngành nghề ở phía trên để tìm kiếm các doanh nghiệp có lĩnh vực phù hợp.',
      'Bước 3: Nhấp vào thẻ đối tác để xem hồ sơ năng lực và danh mục các sản phẩm cung ứng.',
      'Bước 4: Nhấn nút "Kết nối" hoặc "Hẹn gặp" để gửi thông điệp giao thương trực tiếp đến lãnh đạo đối tác.'
    ]
  },
  {
    id: 7,
    subCode: '2.3.3.7',
    name: 'Phân hệ Khoảnh Khắc Doanh Nhân & Bảng Tin Tương Tác Doanh Nghiệp',
    shortTitle: 'Khoảnh Khắc Doanh Nhân & Bảng Tin Tương Tác',
    imgFile: 'app_06_moments.png',
    figTitle: 'Hình 3.7 – Giao Diện Di Động Khoảnh Khắc Doanh Nhân & Bảng Tin Tương Tác',
    generalDesc: 'Phân hệ không gian truyền thông xã hội chuyên biệt dành cho giới doanh nhân, nơi các nhà lãnh đạo chia sẻ các thành tựu ký kết hợp đồng, hoạt động thiện nguyện, giải thưởng danh giá và tin tức kinh tế nổi bật trong cộng đồng. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Đăng bài viết chia sẻ khoảnh khắc doanh nhân đa phương tiện',
        desc: 'Cho phép soạn thảo bài đăng đính kèm album hình ảnh độ nét cao, video phóng sự ngắn, gắn thẻ đối tác tham gia và đính kèm danh thiếp số công ty.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tương tác bắt tay chúc mừng và bình luận giao thương',
        desc: 'Cung cấp nút biểu cảm chuyên biệt: "Bắt tay hợp tác", "Chúc mừng", "Thả tim", "Thú vị"; hỗ trợ bình luận trao đổi thông tin hợp tác kinh doanh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Ghim tin tức chính thức và thông báo quan trọng từ Ban điều hành',
        desc: 'Các bài viết định hướng, thư kêu gọi tài trợ sự kiện của ban lãnh đạo được tự động ghim nổi bật ở vị trí đầu tiên kèm huy hiệu xác thực chính thức.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Kiểm duyệt nội dung tự động chống tin rác và spam',
        desc: 'Mô hình lọc từ khóa tự động ngăn chặn các nội dung phản cảm, quảng cáo không đúng thuần phong mỹ tục hoặc spam lừa đảo trong cộng đồng.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Khoảnh khắc" từ menu hoặc trang cộng đồng của ứng dụng ViOne.',
      'Bước 2: Lướt xem dòng thời gian các hoạt động ký kết hợp tác và sự kiện của các doanh nghiệp.',
      'Bước 3: Nhấp vào nút "Bắt tay" hoặc để lại bình luận kết nối dưới bài viết của đối tác.',
      'Bước 4: Nhấn nút "+" ở góc dưới nếu muốn đăng bài chia sẻ thành tựu hoặc cơ hội hợp tác mới của công ty mình.'
    ]
  },
  {
    id: 8,
    subCode: '2.3.3.8',
    name: 'Phân hệ Hộp Thư Tin Nhắn Trực Tiếp & Phòng Trò Chuyện Nhóm Socket.IO',
    shortTitle: 'Hộp Thư Tin Nhắn Trực Tiếp & Phòng Chat Nhóm',
    imgFile: 'app_07_inbox.png',
    figTitle: 'Hình 3.8 – Giao Diện Di Động Hộp Thư Tin Nhắn Trực Tiếp & Trò Chuyện Socket.IO',
    generalDesc: 'Phân hệ liên lạc tức thời thời gian thực bảo mật cao xây dựng trên nền tảng WebSocket/Socket.IO, phục vụ công tác trao đổi công việc nội bộ và kết nối xúc tiến giao thương giữa các lãnh đạo doanh nghiệp. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Trò chuyện trực tiếp 1-1 và phòng chat nhóm realtime',
        desc: 'Gửi và nhận tin nhắn tức thì với độ trễ <50ms; hỗ trợ hiển thị trạng thái đã gửi, đã nhận, đã đọc và chỉ báo đang nhập nội dung (Typing indicator).',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Gửi danh thiếp số vCard và vé sự kiện ngay trong khung chat',
        desc: 'Tích hợp widget đính kèm thông minh: Cho phép chia sẻ thẻ danh thiếp số hoặc gửi tặng vé tham dự sự kiện trực tiếp trong cuộc hội thoại chỉ với 1 chạm.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Truyền tải hình ảnh độ nét cao và tệp tài liệu hợp đồng PDF',
        desc: 'Gửi tệp tin hợp đồng, báo giá, ảnh chụp sản phẩm với dung lượng lên đến 50MB; mã hóa đường truyền bằng giao thức TLS 1.3 tuyệt đối an toàn.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tìm kiếm tin nhắn và lịch sử tệp tin trao đổi thông minh',
        desc: 'Hỗ trợ tra cứu nhanh nội dung trò chuyện trong quá khứ theo từ khóa; có tab riêng để xem lại toàn bộ kho ảnh và tài liệu đã từng gửi trong phòng chat.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Thông báo đẩy tức thời (Push Notifications)',
        desc: 'Tích hợp dịch vụ Apple Push Notification (APNs) và Google FCM; đảm bảo người dùng nhận được chuông báo tin nhắn mới kể cả khi ứng dụng đang đóng.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn biểu tượng "Tin nhắn / Hộp thư" trên thanh điều hướng đáy của ứng dụng.',
      'Bước 2: Chọn một cuộc hội thoại cá nhân hoặc phòng chat nhóm dự án từ danh sách tin nhắn.',
      'Bước 3: Nhập nội dung văn bản hoặc nhấn biểu tượng "+" để đính kèm Danh thiếp số vCard hoặc Hợp đồng.',
      'Bước 4: Nhấn nút gửi màu vàng; tin nhắn được chuyển tức thì tới điện thoại của đối tác.'
    ]
  },
  {
    id: 9,
    subCode: '2.3.3.9',
    name: 'Phân hệ Không Gian Cộng Đồng & Diễn Đàn Kết Nối Thương Mại',
    shortTitle: 'Không Gian Cộng Đồng & Diễn Đàn Kết Nối',
    imgFile: 'app_09_community.png',
    figTitle: 'Hình 3.9 – Giao Diện Di Động Không Gian Cộng Đồng & Diễn Đàn Kết Nối',
    generalDesc: 'Phân hệ tổ chức các không gian thảo luận chuyên môn, câu lạc bộ sở thích (Golf, Marathon, Tennis, Đầu tư công nghệ) và diễn đàn kết nối cung cầu theo chuyên đề, tạo môi trường sinh hoạt cộng đồng gắn bó và bền vững. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Tham gia các câu lạc bộ và nhóm sở thích chuyên đề',
        desc: 'Cho phép doanh nhân gia nhập các câu lạc bộ: Doanh nhân yêu thể thao, Câu lạc bộ Đầu tư & Khởi nghiệp, Câu lạc bộ Di sản Văn hóa để giao lưu cùng sở thích.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Đăng tin tìm kiếm đối tác và cơ hội hợp tác kinh doanh',
        desc: 'Chuyên mục "Kết nối cung cầu" cho phép đăng tin: Cần tìm nguồn cung ứng nguyên liệu, Cần tìm đại lý phân phối, Cần gọi vốn đầu tư dự án.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bình chọn và khảo sát ý kiến cộng đồng trên di động',
        desc: 'Tham gia bỏ phiếu trực tuyến cho các chủ đề thảo luận của chi hội; kết quả hiển thị tỷ lệ phần trăm trực tiếp ngay sau khi nhấn chọn.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Điều phối viên kiểm duyệt bài viết và doanh nhân nhóm',
        desc: 'Trưởng câu lạc bộ có quyền phê duyệt bài viết, ghim thông báo lịch sinh hoạt câu lạc bộ và quản lý danh sách thành viên tham gia.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn tab "Cộng đồng" trên thanh điều hướng dưới cùng của ứng dụng.',
      'Bước 2: Lựa chọn Câu lạc bộ hoặc Không gian chuyên đề muốn tham gia sinh hoạt.',
      'Bước 3: Đọc các bài thảo luận chuyên môn và chia sẻ quan điểm của mình ở phần bình luận.',
      'Bước 4: Nhấn nút "Tạo chủ đề mới" khi có nhu cầu tìm kiếm đối tác cung ứng trong ngành.'
    ]
  },
  {
    id: 10,
    subCode: '2.3.3.10',
    name: 'Phân hệ Bàn Làm Việc Cá Nhân, Nhiệm Vụ Hôm Nay & Tiến Độ Kanban Mobile',
    shortTitle: 'Bàn Làm Việc Cá Nhân & Tiến Độ Kanban Mobile',
    imgFile: 'app_10_tasks.png',
    figTitle: 'Hình 3.10 – Giao Diện Di Động Bàn Làm Việc Cá Nhân & Quản Trị Công Việc',
    generalDesc: 'Phân hệ quản lý công việc và nhiệm vụ cá nhân dành cho cán bộ nhân viên và lãnh đạo khi di chuyển ngoài văn phòng; cập nhật tiến độ công việc, tải ảnh kết quả nghiệm thu và xem lịch trình làm việc cá nhân hóa. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Danh sách nhiệm vụ cá nhân hôm nay (Today Tasks)',
        desc: 'Hiển thị các đầu việc cần giải quyết trong ngày phân loại theo mức độ khẩn cấp (Khẩn, Quan trọng, Thường); tích chọn hoàn thành nhiệm vụ nhanh chóng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Bảng tiến độ công việc dạng Kanban thu nhỏ tối ưu di động',
        desc: 'Vuốt ngang để chuyển đổi giữa các cột tiến độ: Chờ làm, Đang làm, Đã xong; hỗ trợ kéo thẻ việc để cập nhật trạng thái làm việc trực quan.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Chụp ảnh và đính kèm báo cáo tiến độ trực tiếp từ máy ảnh',
        desc: 'Nhân viên hiện trường chụp ảnh sản phẩm, biên bản nghiệm thu hoặc vị trí lắp đặt và tải lên ngay trong chi tiết công việc để báo cáo cấp trên.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Đồng bộ hai chiều với Cổng Web Quản Trị qua WebSocket',
        desc: 'Mọi thay đổi trạng thái công việc trên app lập tức phản ánh lên màn hình quản trị của quản lý trên web và ngược lại mà không có độ trễ.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Công việc / Bàn làm việc" từ màn hình cá nhân của ứng dụng.',
      'Bước 2: Xem danh sách các đầu việc được giao hôm nay và mức độ ưu tiên tương ứng.',
      'Bước 3: Nhấp vào một công việc để xem mô tả chi tiết, danh mục tiêu chí cần thực hiện.',
      'Bước 4: Nhấn nút "Hoàn thành" hoặc tải ảnh nghiệm thu từ máy ảnh để báo cáo tiến độ cho cấp quản lý.'
    ]
  },
  {
    id: 11,
    subCode: '2.3.3.11',
    name: 'Phân hệ Hồ Sơ Cá Nhân VIP, Quản Trị Danh Mục Yêu Thích & Cài Đặt Ứng Dụng',
    shortTitle: 'Hồ Sơ Cá Nhân VIP & Cài Đặt Ứng Dụng',
    imgFile: 'app_11_me.png',
    figTitle: 'Hình 3.11 – Giao Diện Di Động Hồ Sơ Cá Nhân VIP & Cài Đặt Ứng Dụng',
    generalDesc: 'Phân hệ quản trị thông tin cá nhân của người dùng, tùy chỉnh ảnh đại diện, tiểu sử doanh nhân, quản lý kho vé sự kiện đã mua, danh bạ đối tác lưu trữ và chuyển đổi ngôn ngữ ứng dụng (Tiếng Việt / English). Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Cập nhật hồ sơ doanh nhân số và ảnh chân dung',
        desc: 'Cho phép thay đổi ảnh đại diện chất lượng cao, cập nhật chức vụ mới, chỉnh sửa thông tin doanh nghiệp và liên kết các trang mạng xã hội cá nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Quản lý kho vé sự kiện và chứng nhận thi đấu cá nhân',
        desc: 'Xem lại toàn bộ lịch sử các sự kiện đã tham gia, kho vé điện tử đang còn hiệu lực và các chứng nhận hoàn thành giải chạy Marathon điện tử.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tùy chọn giao diện Obsidian Gold và chế độ ban đêm',
        desc: 'Chuyển đổi linh hoạt giữa giao diện Sang trọng Hoàng Gia (Obsidian Dark) và giao diện Sáng tinh tế (Classic Light) theo sở thích người dùng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Đăng xuất an toàn và xóa dữ liệu đệm trên thiết bị',
        desc: 'Xóa toàn bộ token xác thực và dữ liệu đệm trong máy khi đăng xuất, đảm bảo an toàn tuyệt đối khi người dùng thay đổi điện thoại mới.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Chọn tab "Tôi / Cá nhân" ở góc phải thanh điều hướng dưới cùng của ứng dụng.',
      'Bước 2: Nhấp vào ảnh đại diện nếu muốn cập nhật ảnh chân dung mới hoặc chỉnh sửa tiểu sử.',
      'Bước 3: Nhấp vào mục "Vé của tôi" để xem lại các vé hội nghị và giải chạy đã đăng ký thành công.',
      'Bước 4: Sử dụng mục "Cài đặt chung" để bật/tắt nhận thông báo đẩy hoặc đổi giao diện sáng/tối.'
    ]
  },
  {
    id: 12,
    subCode: '2.3.3.12',
    name: 'Phân hệ Quản Trị & Xuất Bản Danh Thiếp Số Cá Nhân Hóa (Custom vCard QR)',
    shortTitle: 'Xuất Bản Danh Thiếp Số Cá Nhân Hóa',
    imgFile: 'app_12_vcard_qr.png',
    figTitle: 'Hình 3.12 – Giao Diện Di Động Quản Trị & Xuất Bản Mã QR Danh Thiếp Số vCard',
    generalDesc: 'Phân hệ chuyên biệt cho phép doanh nhân xuất bản mã QR danh thiếp số độc bản, tích hợp logo công ty vào tâm mã QR và hỗ trợ tải ảnh mã QR độ nét cao để in lên áo, standee hội chợ hoặc ấn phẩm truyền thông. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Sinh mã QR danh thiếp nghệ thuật tích hợp logo doanh nghiệp',
        desc: 'Mã QR được thiết kế đồng bộ với nhận diện thương hiệu, nhúng logo công ty ở chính giữa với tỷ lệ sửa lỗi cao (Error Correction Level H - 30%).',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đổi kiểu dáng hoa văn mã QR (Dots, Rounded, Square)',
        desc: 'Doanh nhân có thể lựa chọn kiểu chấm điểm mã QR dạng hạt tròn mềm mại hoặc góc bo mạ vàng sang trọng theo sở thích cá nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Lưu mã QR vào Album ảnh máy tính bảng / điện thoại',
        desc: 'Tải mã QR định dạng PNG sắc nét về thư viện ảnh để dễ dàng đặt làm hình nền điện thoại màn hình khóa phục vụ trao đổi danh thiếp siêu tốc.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đường dẫn cá nhân hóa URL duy nhất (Vanity URL)',
        desc: 'Cấp đường link rút gọn dạng thương hiệu: https://vione.viconnect.vn/u/[ho-ten-doanh-nhan] giúp chia sẻ thuận tiện trên các mạng xã hội.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Tại màn hình Trang chủ, nhấp vào thẻ danh thiếp số hoặc biểu tượng "Mã QR của tôi".',
      'Bước 2: Màn hình mã QR kích thước lớn hiển thị kèm ảnh đại diện và logo công ty chính xác.',
      'Bước 3: Đưa màn hình cho đối tác quét trực tiếp để mở hồ sơ kết nối kinh doanh tức thì.',
      'Bước 4: Nhấn nút "Lưu ảnh QR" để tải tệp hình ảnh về máy đặt làm ảnh nền màn hình khóa tiện lợi.'
    ]
  },
  {
    id: 13,
    subCode: '2.3.3.13',
    name: 'Phân hệ Máy Quét Thông Minh Toàn Năng (Smart Scanner: QR / Barcode / NFC / OCR)',
    shortTitle: 'Máy Quét Thông Minh Toàn Năng',
    imgFile: 'app_13_ocr.png',
    figTitle: 'Hình 3.13 – Giao Diện Di Động Máy Quét Thông Minh Toàn Năng Smart Scanner',
    generalDesc: 'Phân hệ máy quét tích hợp "tất cả trong một" (All-in-one Scanner), tự động phân tích định dạng đối tượng trước ống kính để kích hoạt luồng xử lý tương ứng: Quét vé QR sự kiện, Quét danh thiếp giấy OCR, Đọc mã vạch sản phẩm hoặc Đọc chip thẻ NFC. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Tự động nhận diện ngữ cảnh đối tượng quét thông minh',
        desc: 'Khi đưa camera lại gần đối tượng, thuật toán AI tự động phân biệt mã QR vé, mã QR danh thiếp hay danh thiếp văn bản giấy để xử lý phù hợp.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Tốc độ giải mã siêu tốc dưới 0.1 giây',
        desc: 'Sử dụng thư viện thị giác máy tính biên dịch native C++ trên thiết bị; nhận diện mã QR ngay cả trong điều kiện ánh sáng yếu hoặc bị lóa sáng.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Bật đèn Flash trợ sáng khi quét trong bóng tối',
        desc: 'Cung cấp nút bật đèn pin LED của điện thoại ngay trên giao diện quét giúp làm việc thuận lợi tại các khán phòng hội nghị hoặc gala tối.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Lịch sử quét mã và mở lại liên kết an toàn',
        desc: 'Ghi lại danh sách các mã QR đã quét gần đây; kiểm tra đường dẫn an toàn chống mã độc trước khi cho phép người dùng mở trình duyệt.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Nhấp vào biểu tượng "Quét mã" ở góc trên cùng bên phải màn hình Trang chủ.',
      'Bước 2: Hướng camera vào mã QR vé sự kiện, danh thiếp của đối tác hoặc mã sản phẩm.',
      'Bước 3: Máy rung nhẹ và phát âm thanh báo nhận diện thành công sau dưới 0.1 giây.',
      'Bước 4: Màn hình kết quả lập tức hiện ra: Hồ sơ đối tác, Vé check-in hợp lệ hoặc Thông tin sản phẩm.'
    ]
  },
  {
    id: 14,
    subCode: '2.3.3.14',
    name: 'Phân hệ Trung Tâm Bảo Mật Cá Nhân, Đổi Mật Khẩu & Xác Thực Hai Lớp (2FA)',
    shortTitle: 'Bảo Mật Cá Nhân, Đổi Mật Khẩu & 2FA',
    imgFile: 'app_14_security.png',
    figTitle: 'Hình 3.14 – Giao Diện Di Động Trung Tâm Bảo Mật Cá Nhân & Cài Đặt 2FA',
    generalDesc: 'Phân hệ quản lý an toàn thông tin tài khoản cá nhân của doanh nhân trên thiết bị di động, kích hoạt xác thực hai yếu tố (2FA), quản lý các thiết bị đã đăng nhập và thiết lập mã PIN bảo vệ ví vé sự kiện. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Đổi mật khẩu tài khoản có đo lường độ mạnh mật khẩu',
        desc: 'Yêu cầu nhập mật khẩu cũ và xác thực mật khẩu mới; thanh đo lực mật khẩu tự động kiểm tra đủ độ dài, ký tự hoa, số và ký tự đặc biệt.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Bật tắt xác thực hai lớp qua mã ứng dụng (Authenticator App)',
        desc: 'Cung cấp mã khóa bí mật và mã QR để thêm tài khoản vào Google Authenticator hoặc Microsoft Authenticator; yêu cầu nhập mã kiểm tra trước khi kích hoạt.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Quản lý danh sách thiết bị tin cậy và đăng xuất từ xa',
        desc: 'Hiển thị danh sách các điện thoại, máy tính bảng đang đăng nhập tài khoản; cho phép người dùng nhấn "Đăng xuất khỏi thiết bị này" nếu nghi ngờ bị lộ thông tin.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Khóa ứng dụng bằng mã PIN riêng biệt (App Lock)',
        desc: 'Thiết lập mã PIN 6 số bảo vệ ứng dụng ViOne; tự động yêu cầu nhập PIN hoặc quét FaceID mỗi khi chuyển từ ứng dụng khác quay trở lại.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Vào mục "Tôi" -> Chọn "Bảo mật tài khoản" trên ứng dụng di động ViOne.',
      'Bước 2: Chọn mục "Đổi mật khẩu" hoặc gạt nút bật "Xác thực hai lớp (2FA)".',
      'Bước 3: Nhập mã xác nhận OTP được gửi về số điện thoại hoặc mở ứng dụng Google Authenticator.',
      'Bước 4: Nhấn nút "Lưu thay đổi", hệ thống áp dụng cơ chế bảo vệ tài khoản cấp cao ngay lập tức.'
    ]
  },
  {
    id: 15,
    subCode: '2.3.3.15',
    name: 'Phân hệ Trung Tâm Thông Báo Đa Kênh & Đồng Bộ Lịch Sự Kiện Cá Nhân',
    shortTitle: 'Thông Báo Đa Kênh & Đồng Bộ Lịch Cá Nhân',
    imgFile: 'app_15_notifications.png',
    figTitle: 'Hình 3.15 – Giao Diện Di Động Trung Tâm Thông Báo Đa Kênh & Nhắc Lịch',
    generalDesc: 'Phân hệ quản lý các luồng thông báo tập trung từ ban điều hành, thông báo biến động tài chính nộp phí, thông báo tin nhắn mới và nhắc lịch sự kiện; hỗ trợ đồng bộ tự động vào ứng dụng Lịch Apple Calendar (iOS) và Google Calendar (Android). Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Phân loại thông báo thông minh theo nhóm chuyên đề',
        desc: 'Chia thông báo thành các tab riêng: Sự kiện, Giao thương B2B, Tài chính và Tin nhắn hệ thống; giúp người dùng không bị bỏ lỡ các tin tức trọng yếu.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đồng bộ lịch sự kiện vào Apple Calendar và Google Calendar',
        desc: 'Khi đăng ký vé sự kiện thành công, ứng dụng cung cấp nút "Thêm vào lịch"; hệ thống tự động chèn lịch trình, địa điểm và nhắc hẹn vào ứng dụng lịch gốc của điện thoại.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đánh dấu đã đọc và xóa thông báo linh hoạt',
        desc: 'Cho phép người dùng nhấn "Đánh dấu tất cả đã đọc" hoặc vuốt sang trái để xóa thông báo cũ khỏi trung tâm thông báo nhằm giữ giao diện gọn gàng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Nhận tin nhắn xác nhận song song qua Zalo OA',
        desc: 'Đồng bộ thông báo với tài khoản Zalo của người dùng; các biến động quan trọng về vé và tiền đều được Zalo OA gửi tin nhắn ZNS xác nhận chính thống.',
        actorMain: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Nhấp vào biểu tượng chiếc chuông "Thông báo" tại góc trên màn hình chính.',
      'Bước 2: Lướt xem danh sách các thông báo mới nhất được phân loại theo nhãn màu sắc rõ ràng.',
      'Bước 3: Nhấp vào thông báo sự kiện để xem chi tiết và nhấn "Đồng bộ vào lịch điện thoại".',
      'Bước 4: Nhấn nút "Đánh dấu đã đọc" ở góc trên khi đã nắm bắt đầy đủ thông tin.'
    ]
  },
  {
    id: 16,
    subCode: '2.3.3.16',
    name: 'Phân hệ Ví Vé Sự Kiện Điện Tử Thông Minh & Check-in Offline Mã QR',
    shortTitle: 'Ví Vé Sự Kiện Điện Tử & Check-in Offline',
    imgFile: 'app_16_tickets.png',
    figTitle: 'Hình 3.16 – Giao Diện Di Động Ví Vé Điện Tử Thông Minh & Check-in Offline',
    generalDesc: 'Phân hệ lưu trữ và quản lý tập trung toàn bộ vé tham dự sự kiện, hội nghị, giải chạy marathon của người dùng; hiển thị mã QR động chống gian lận và hỗ trợ mở vé check-in ngay cả khi điện thoại không có kết nối Internet. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Hiển thị thẻ vé sang trọng kèm mã QR động (Dynamic QR)',
        desc: 'Thẻ vé thiết kế chuẩn Obsidian Gold hiển thị đầy đủ: Tên sự kiện, Hạng vé VIP, Vị trí ghế ngồi, Sơ đồ cổng vào và mã QR tự động xoay mã chống chụp ảnh màn hình.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Mở vé check-in ngoại tuyến không cần mạng Internet',
        desc: 'Mã vé và thông tin đại biểu được mã hóa lưu trữ sẵn trong bộ nhớ bảo mật của ứng dụng; doanh nhân vẫn mở vé quét bình thường khi vào tầng hầm hội nghị mất sóng di động.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tự động đẩy độ sáng màn hình lên mức tối đa khi mở vé',
        desc: 'Khi mở chi tiết vé, ứng dụng tự động tăng độ sáng màn hình lên 100% giúp các máy quét mã vạch và camera lễ tân nhận diện mã QR trong chớp mắt.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Chuyển nhượng vé cho bạn bè hoặc đối tác doanh nghiệp',
        desc: 'Doanh nhân có thể nhấn "Tặng vé", nhập số điện thoại người nhận; hệ thống thu hồi mã vé cũ và phát hành vé mới sang tài khoản người nhận tức thì.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Ví vé" từ màn hình chính hoặc menu điều phối nổi VActionSheet.',
      'Bước 2: Danh sách các vé sự kiện sắp diễn ra hiển thị dạng thẻ gấp mạ vàng sang trọng.',
      'Bước 3: Nhấp vào vé cần sử dụng; mã QR check-in mở lớn và màn hình tự động tăng sáng tối đa.',
      'Bước 4: Đưa mã QR trước máy quét của ban lễ tân tại cửa hội trường để được xác thực vào cửa.'
    ]
  },
  {
    id: 17,
    subCode: '2.3.3.17',
    name: 'Phân hệ Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport Trên Di Động',
    shortTitle: 'Giải Đấu Thể Thao ViOne Sport Trên Di Động',
    imgFile: 'app_17_sport.png',
    figTitle: 'Hình 3.17 – Giao Diện Di Động Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport',
    generalDesc: 'Phân hệ đồng hành cùng các hoạt động thể thao phong trào doanh nhân (Bóng đá mini, Golf, Tennis, Pickleball) trực tiếp trên điện thoại; theo dõi lịch thi đấu, bảng xếp hạng realtime, đăng ký đội hình và nhận thông báo kết quả trận đấu. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Tra cứu sơ đồ bốc thăm phân nhánh (Tournament Bracket) trên di động',
        desc: 'Xem sơ đồ cây thi đấu trực quan; chạm vào từng nhánh đấu để xem thông tin hai đội bóng/cặp VĐV đối đầu, giờ thi đấu và sân bãi tổ chức.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Bảng điểm và kết quả trận đấu cập nhật trực tiếp (Live Score)',
        desc: 'Cập nhật tỷ số trận bóng đá, điểm số set tennis/pickleball, điểm handicap giải golf theo thời gian thực; nhận thông báo khi có bàn thắng được ghi.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đăng ký danh sách thi đấu và nộp hồ sơ đội thể thao',
        desc: 'Đội trưởng doanh nghiệp đăng ký danh sách cầu thủ/VĐV trực tiếp trên app, đính kèm ảnh thẻ và số áo thi đấu thuận tiện.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Bảng xếp hạng vòng bảng và danh sách Vua phá lưới',
        desc: 'Tự động tính toán điểm số thắng/hòa/thua, hiệu số bàn thắng và bảng xếp hạng huy chương; vinh danh các cá nhân đạt thành tích cao trong giải đấu.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bình luận và cổ vũ đội thể thao thời gian thực',
        desc: 'Khán giả và đồng nghiệp có thể gửi biểu tượng cổ vũ, bình luận trực tiếp dưới trang diễn biến trận đấu để tiếp lửa tinh thần cho đội nhà.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Mở menu điều phối VActionSheet 3D và chọn biểu tượng "ViOne Sport".',
      'Bước 2: Chọn giải đấu đang diễn ra (Bóng đá mini, Golf Doanh nhân, Pickleball).',
      'Bước 3: Nhấp vào tab "Lịch thi đấu" hoặc "Bảng xếp hạng" để xem điểm số các trận đấu mới nhất.',
      'Bước 4: Nhấp vào một trận đấu cụ thể để xem đội hình ra sân và diễn biến tỷ số trực tiếp.'
    ]
  },
  {
    id: 18,
    subCode: '2.3.3.18',
    name: 'Phân hệ Giải Chạy Bộ ViOne Run Marathon & Chip Timing RFID Di Động',
    shortTitle: 'Giải Chạy ViOne Run & Chip Timing RFID Di Động',
    imgFile: 'app_18_run.png',
    figTitle: 'Hình 3.18 – Giao Diện Di Động Giải Chạy ViOne Run & Chip Timing RFID',
    generalDesc: 'Phân hệ chuyên biệt dành cho các giải chạy bộ Marathon cộng đồng doanh nhân, cung cấp mã BIB số hóa, bản đồ lộ trình GPX, tích hợp dữ liệu thảm đo thời gian Chip Timing RFID hiển thị tốc độ Pace, thứ hạng Rank và cấp chứng nhận hoàn thành e-Certificate. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Thẻ vận động viên số hóa kèm số BIB độc quyền',
        desc: 'Hiển thị số BIB nổi bật (Ví dụ: VNE-42-088), cự ly đăng ký (5km/10km/21km/42km), nhóm tuổi và mã QR tra cứu thành tích cá nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Bản đồ số cung đường chạy GPS và trạm tiếp nước Checkpoint',
        desc: 'Hiển thị bản đồ lộ trình giải chạy chuẩn xác trên nền vệ tinh; đánh dấu vị trí các trạm y tế, trạm tiếp nước và các mốc thảm đo thời gian RFID.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Theo dõi thành tích thời gian thực (Live Runner Tracking)',
        desc: 'Người thân và đồng nghiệp có thể nhập số BIB trên app để theo dõi VĐV vừa qua trạm kiểm tra nào, tốc độ chạy trung bình (Pace) và thời gian dự kiến về đích.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bảng xếp hạng Leaderboard cập nhật tức thì',
        desc: 'Bảng tổng sắp thành tích các VĐV về đích sớm nhất theo từng cự ly và lứa tuổi, cập nhật ngay khi thảm RFID vạch đích ghi nhận tín hiệu chip.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tải chứng nhận điện tử (e-Certificate) và tìm ảnh chạy theo số BIB',
        desc: 'Tự động tìm kiếm ảnh chụp của VĐV trên đường chạy bằng công nghệ nhận dạng số BIB AI; hỗ trợ tải chứng nhận thành tích chính thức có dấu số.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Mở menu điều phối VActionSheet 3D và chọn biểu tượng "ViOne Run".',
      'Bước 2: Màn hình hiển thị số BIB cá nhân, cự ly thi đấu và sơ đồ cung đường chạy GPX.',
      'Bước 3: Nhấp vào tab "Bảng thành tích" để xem tốc độ Pace và thứ hạng của mình so với toàn đoàn.',
      'Bước 4: Sau khi cán đích, nhấn nút "Tải chứng nhận e-Certificate" để lưu ảnh kỷ niệm có thành tích.'
    ]
  },
  {
    id: 19,
    subCode: '2.3.3.19',
    name: 'Phân hệ Khám Phá Bảo Tàng Số 3D & Thuyết Minh 1-Chạm NFC ViOne Museum',
    shortTitle: 'Bảo Tàng Số 3D & Thuyết Minh 1-Chạm NFC ViOne Museum',
    imgFile: 'app_19_museum.png',
    figTitle: 'Hình 3.19 – Giao Diện Di Động Bảo Tàng Số 3D & Thuyết Minh NFC ViOne Museum',
    generalDesc: 'Phân hệ mang không gian bảo tàng văn hóa lịch sử lên màn hình smartphone, cho phép tương tác xoay 360 độ các mô hình 3D cổ vật quốc gia, hỗ trợ tính năng chạm 1-Tap NFC vào tủ trưng bày tại bảo tàng để tự động phát thuyết minh âm thanh song ngữ Audio Guide. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Tương tác 3D đa chiều với cổ vật và bảo vật quốc gia',
        desc: 'Mô hình 3D tối ưu cho di động với kết cấu vân siêu thực; người dùng dùng ngón tay xoay tròn 360 độ, phóng to ngắm chi tiết hoa văn Trống đồng, Ngai vàng triều Nguyễn.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Kích hoạt thuyết minh 1-chạm NFC tại quầy trưng bày',
        desc: 'Khách tham quan bảo tàng chỉ cần chạm mặt lưng điện thoại vào biểu tượng NFC gắn tại tủ kính; app lập tức tự động bật đoạn thuyết minh âm thanh của hiện vật đó.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Trình phát âm thanh thuyết minh Audio Guide song ngữ',
        desc: 'Bộ phát âm thanh chuyên nghiệp hỗ trợ tua nhanh, tạm dừng, chọn giọng đọc Tiếng Việt hoặc Tiếng Anh, kèm chữ chạy phụ đề đồng bộ với lời đọc.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Chế độ xem thực tế tăng cường (AR - Augmented Reality)',
        desc: 'Đặt mô hình bảo vật 3D vào không gian phòng khách hoặc bàn làm việc thực tế thông qua camera ARKit (iOS) / ARCore (Android) với tỷ lệ 1:1 chính xác.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Sưu tập tem kỹ thuật số khi khám phá hiện vật',
        desc: 'Mỗi lần chạm NFC khám phá một bảo vật mới, người dùng được tích lũy một con tem số (Digital Stamp) vào sổ tay hành trình văn hóa trên app.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Bảo tàng 3D" trên menu điều phối VActionSheet của ứng dụng.',
      'Bước 2: Lướt danh mục các bảo vật quốc gia hoặc chạm điện thoại vào thẻ NFC tại tủ trưng bày.',
      'Bước 3: Dùng ngón tay vuốt trên màn hình để xoay mô hình 3D cổ vật 360 độ khám phá hoa văn.',
      'Bước 4: Nhấn nút phát Audio Guide để nghe giọng thuyết minh lịch sử và nhận tem số văn hóa.'
    ]
  },
  {
    id: 20,
    subCode: '2.3.3.20',
    name: 'Phân hệ Khám Phá Di Sản Văn Hóa & Bản Đồ Số Di Tích Lịch Sử ViOne Heritage',
    shortTitle: 'Di Sản Văn Hóa & Bản Đồ Di Tích ViOne Heritage',
    imgFile: 'app_20_heritage.png',
    figTitle: 'Hình 3.20 – Giao Diện Di Động Di Sản Văn Hóa & Bản Đồ Di Tích ViOne Heritage',
    generalDesc: 'Phân hệ đồng hành cùng hành trình khám phá di sản văn hóa dân tộc, cung cấp bản đồ số định vị di tích lịch sử quanh vị trí người dùng, tự động thuyết minh khi đến gần qua GPS Geofencing, lưu trữ và dịch nghĩa các bản sắc phong triều Nguyễn phục chế số. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Bản đồ số định vị di tích văn hóa lịch sử quanh vị trí hiện tại',
        desc: 'Hiển thị các ngôi đền, chùa cổ, di tích lịch sử văn hóa quốc gia xung quanh vị trí GPS của người dùng kèm khoảng cách và chỉ đường di chuyển.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Tự động phát thuyết minh khi bước vào vùng di tích (GPS Geofence)',
        desc: 'Khi du khách di chuyển đến bán kính 20 mét quanh cổng di tích, ứng dụng tự động gửi thông báo chào mừng và bắt đầu bài giới thiệu âm thanh lịch sử.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Tra cứu và đọc bản dịch sắc phong Hán Nôm cổ',
        desc: 'Xem ảnh chụp sắc phong triều Nguyễn độ nét cao; chạm vào từng dòng chữ Hán Nôm để xem phiên âm Hán Việt và bản dịch nghĩa tường minh.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Tour tham quan thực tế ảo VR360 Panoramas trên di động',
        desc: 'Hỗ trợ tính năng nghiêng điện thoại (Con quay hồi chuyển Gyroscope) để nhìn ngắm toàn cảnh không gian di tích cổ kính như đang đứng tại hiện trường.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Đóng góp công đức số và tài trợ bảo tồn di sản qua VNPay',
        desc: 'Tích hợp nút "Công đức số"; du khách có thể đóng góp kinh phí tu bổ di tích một cách minh bạch thông qua cổng thanh toán VNPay-QR trên di động.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Di sản văn hóa" từ menu điều phối nổi VActionSheet 3D.',
      'Bước 2: Mở tab "Bản đồ di tích" để xem các điểm di sản văn hóa lịch sử nằm gần vị trí của bạn.',
      'Bước 3: Nhấp vào một điểm di tích để xem tư liệu sắc phong Hán Nôm và hình ảnh phục chế cổ vật.',
      'Bước 4: Bật tính năng "Tự động thuyết minh GPS" để nghe thuyết minh khi bạn đặt chân tới di tích.'
    ]
  }
];

module.exports = {
  MOBILE_MODULES
};

