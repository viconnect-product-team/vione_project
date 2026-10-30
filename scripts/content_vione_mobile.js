// scripts/content_vione_mobile.js
// 20 Phân hệ Ứng dụng Di động ViOne (ViOne Connect Mobile App) chi tiết chuẩn mực phong cách Uniwork
// Bổ sung đầy đủ các phân hệ và tính năng con mới nhất: Thể thao (Bracket, Lịch đấu, ELO), Chạy bộ (RFID, GPS, Finisher),
// Bảo tàng (3D 360, Audio Guide, Niên biểu), Di sản (Geofencing 20m, Sắc phong Deep Zoom, Tuyến tham quan), Vé điện tử (POS Validator)

const MOBILE_MODULES = [
  {
    id: 1,
    subCode: '2.3.3.1',
    name: 'Phân hệ Màn hình Đăng nhập Di động Chuẩn Obsidian Luxury & Sinh trắc học Biometrics',
    shortTitle: 'Đăng nhập Di động & Sinh trắc học Biometrics',
    imgFile: 'app_01_login.png',
    figTitle: 'Hình 3.1 – Giao Diện Di Động Đăng Nhập Chuẩn Obsidian Luxury & FaceID',
    generalDesc: 'Phân hệ khởi động ứng dụng di động ViOne trên hai hệ điều hành iOS và Android, được thiết kế theo phong cách Obsidian Luxury với hai tông màu chủ đạo: Đen Thạch Anh Obsidian (#050C15) và Vàng Hoàng Gia Champagne Gold (#D8B282). Hệ thống tích hợp xác thực sinh trắc học phần cứng (Apple FaceID / TouchID và Android Biometric Prompt) giúp doanh nhân mở khóa ứng dụng an toàn chỉ trong 0.3 giây, đồng thời duy trì mã hóa phiên làm việc độc lập.',
    features: [
      {
        name: 'Đăng nhập sinh trắc học phần cứng FaceID / TouchID siêu tốc',
        desc: 'Tận dụng trực tiếp chip bảo mật chuyên dụng Apple Secure Enclave và Android Keystore TEE (Trusted Execution Environment). Khi doanh nhân mở ứng dụng, cảm biến quét khuôn mặt 3D TrueDepth hoặc vân tay siêu âm kích hoạt giải mã khóa mã hóa phần cứng để sinh Access Token trong vòng 0.3 giây mà không cần thao tác gõ mật khẩu, đảm bảo chống giả mạo bằng hình ảnh hoặc mô hình 3D.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đăng nhập bảo mật qua số điện thoại và mã OTP tin nhắn Zalo / SMS',
        desc: 'Cho phép doanh nhân nhập số điện thoại di động đăng ký. Máy chủ backend tự động tạo mã OTP 6 chữ số ngẫu nhiên có hiệu lực trong 120 giây, đẩy gói tin qua cổng Zalo OpenAPI v3 hoặc SMS Brandname ViOne. Ứng dụng hỗ trợ cơ chế tự động đọc và điền mã xác thực (SMS Retriever API / Auto-fill) giúp trải nghiệm đăng nhập nhanh chóng và an toàn.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Ngôn ngữ thiết kế thượng lưu Obsidian Gold tối ưu màn hình OLED',
        desc: 'Toàn bộ giao diện được tối ưu với dải màu tương phản cao: Nền đen thạch anh sâu thẳm giảm hao pin đến 40% trên màn hình Super Retina OLED, kết hợp với các nút bấm và khung viền phủ dải màu Gradient Vàng Hoàng Gia Champagne Gold (#F6E1C3 -> #D8B282 -> #8C653B), tôn vinh vị thế sang trọng và uy quyền của doanh nhân lãnh đạo.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Quản trị vòng đời khóa bảo mật thiết bị (Hardware Token Storage)',
        desc: 'Cặp khóa bất đối xứng và chuỗi Refresh Token được mã hóa AES-256-GCM lưu trữ biệt lập trong Keychain (iOS) và EncryptedSharedPreferences (Android). Hệ thống tích hợp module phát hiện thiết bị can thiệp trái phép (Root/Jailbreak Detection, Debugger Attachment Check); khi phát hiện môi trường mất an toàn, ứng dụng tự động xóa sạch dữ liệu phiên lưu trữ và từ chối khởi động.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Khởi động ứng dụng di động ViOne trên màn hình thiết bị smartphone iPhone hoặc Android.',
      'Bước 2: Hệ thống kích hoạt cảm biến sinh trắc học FaceID / TouchID; doanh nhân hướng khuôn mặt vào màn hình để xác thực tức thì.',
      'Bước 3: Trường hợp đăng nhập thiết bị mới, nhập Số điện thoại hoặc Email cùng Mật khẩu tài khoản đã đăng ký.',
      'Bước 4: Nhấn nút gradient vàng "Đăng nhập" để truy cập vào Bàn điều hành Lãnh đạo Executive Home.'
    ]
  },
  {
    id: 2,
    subCode: '2.3.3.2',
    name: 'Phân hệ Trang chủ Điều hành C-Level Executive Home & Widget Chỉ số Realtime',
    shortTitle: 'Trang chủ Điều hành C-Level Executive Home',
    imgFile: 'app_02_home.png',
    figTitle: 'Hình 3.2 – Giao Diện Di Động Trang Chủ Điều Hành C-Level Executive Home',
    generalDesc: 'Phân hệ trung tâm chỉ huy di động dành riêng cho các chủ doanh nghiệp và lãnh đạo cấp cao C-Level. Màn hình tích hợp thẻ định danh số vCard dập nổi ánh kim vàng, widget lịch trình các cuộc gặp đối tác và phiên họp trong ngày, bảng nút tắt tác vụ nhanh 1-chạm (Quick Action Chips) và đồ thị theo dõi hiệu quả tương tác mạng lưới kinh doanh cập nhật theo thời gian thực.',
    features: [
      {
        name: 'Thẻ định danh doanh nhân số hiển thị trực quan dập nổi',
        desc: 'Hiển thị thẻ danh thiếp số vCard độc quyền với ảnh chân dung đại diện chất lượng cao, họ tên, chức danh lãnh đạo, tên pháp nhân doanh nghiệp, logo tổ chức và huy hiệu phân hạng VIP (VIP Member, Diamond, Gold). Thẻ tích hợp hiệu ứng con quay hồi chuyển Gyroscope 3D Shimmer tạo hiệu ứng ánh kim lấp lánh khi người dùng nghiêng điện thoại.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bảng điều khiển tác vụ nhanh 1-chạm (Quick Action Chips)',
        desc: 'Cung cấp hàng phím tắt gradient vàng mạ kim loại cho phép mở tức thì các tác vụ thường nhật chỉ với 1 lần chạm: Chia sẻ danh thiếp NFC, Bật camera quét danh thiếp AI OCR, Mở ví vé sự kiện QR động, và Khởi động bản đồ định vị đối tác xung quanh qua GPS.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Widget lịch trình sự kiện, họp kết nối giao thương trong ngày',
        desc: 'Đồng bộ hóa dữ liệu từ lịch sự kiện chi hội và lịch hẹn B2B cá nhân; hiển thị đếm ngược thời gian đến phiên kết nối tiếp theo, địa điểm phòng họp, liên kết phòng họp trực tuyến và mã QR check-in sự kiện sẵn sàng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Đo lường chỉ số kết nối mạng lưới giao thương (Networking KPIs)',
        desc: 'Thống kê trực tiếp 4 chỉ số hiệu quả kinh doanh cốt lõi: Số lượt đối tác đã xem danh thiếp số trong tuần, số người đã lưu danh bạ điện thoại, số cơ hội kinh doanh (Deals) đang chờ phản hồi, và điểm uy tín tín nhiệm giao thương.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Thông báo đẩy ưu tiên từ Ban Điều Hành tổ chức doanh nghiệp',
        desc: 'Khối tin tức khẩn cấp hiển thị các nghị quyết mới, thông cáo báo chí, thư mời gala kết nối doanh nhân thường niên được gửi trực tiếp từ Cổng Web Quản Trị thông qua giao thức Socket.IO và dịch vụ Apple APNs / Google FCM.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Sau khi hoàn tất xác thực đăng nhập, người dùng được chuyển hướng trực tiếp vào màn hình "Executive Home".',
      'Bước 2: Vuốt ngang thẻ danh thiếp số để xem nhanh mã QR định danh cá nhân hoặc chạm vào thẻ để mở toàn màn hình.',
      'Bước 3: Chạm vào hàng nút tắt nhanh 1-chạm để kích hoạt tác vụ cần thực hiện (Chia sẻ vCard, Quét AI OCR, Mở ví vé).',
      'Bước 4: Theo dõi widget "Lịch trình hôm nay" để nắm bắt thời gian và địa điểm các phiên họp giao thương trong ngày.'
    ]
  },
  {
    id: 3,
    subCode: '2.3.3.3',
    name: 'Phân hệ Danh thiếp Số vCard & Chạm 1-Tap NFC Vật lý Độc quyền',
    shortTitle: 'Danh thiếp Số vCard & Chạm 1-Tap NFC Vật lý',
    imgFile: 'app_03_card_sheet.png',
    figTitle: 'Hình 3.3 – Giao Diện Di Động Danh Thiếp Số vCard & Ngăn Kéo Chia Sẻ NFC',
    generalDesc: 'Phân hệ biến chiếc smartphone của doanh nhân thành một phương tiện giao tiếp kết nối kinh doanh thượng lưu không chạm. Thay thế hoàn toàn danh thiếp in trên giấy truyền thống, ứng dụng hỗ trợ chia sẻ thông tin đa kênh thông qua công nghệ chạm trường gần 1-Tap NFC với thẻ vật lý NTAG213/215/424 DNA hoặc hiển thị mã QR động chuẩn hóa quốc tế vCard 4.0.',
    features: [
      {
        name: 'Giao tiếp chạm trường gần 1-Tap NFC với phôi thẻ vật lý cao cấp',
        desc: 'Tích hợp bộ điều khiển phần cứng NFC NDEF theo chuẩn ISO/IEC 14443 Type A. Doanh nhân chỉ cần chạm nhẹ mặt lưng điện thoại hoặc phôi thẻ NFC mạ vàng vào máy đối tác (kể cả khi máy đối tác không cài app ViOne); liên kết định danh cá nhân độc quyền tự động bật lên trên trình duyệt web đối tác trong vòng 0.2 giây.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Ngăn kéo chia sẻ đa kênh chuẩn hóa vCard 4.0 (Action Bottom Sheet)',
        desc: 'Cung cấp ngăn kéo trượt thông minh từ đáy màn hình chứa các tùy chọn: Tạo tệp .vcf lưu trực tiếp vào danh bạ điện thoại, gửi danh thiếp qua Zalo OA, chia sẻ qua tin nhắn SMS, mã QR độ phân giải cao và liên kết web ngắn gọn (Short URL).',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Tùy biến giao diện thẻ số theo nhận diện thương hiệu cá nhân',
        desc: 'Cho phép doanh nhân lựa chọn 3 chủ đề thiết kế sang trọng: Obsidian Gold (Đen Thạch Anh mạ vàng hoàng gia), Diamond White (Trắng Ngọc Trai ánh bạch kim) và Sapphire Navy (Xanh Hoàng Gia viền vàng), đồng thời nhúng logo doanh nghiệp và liên kết mạng xã hội doanh nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bộ đếm lượt tương tác và bảo mật liên kết chia sẻ chống sao chép',
        desc: 'Mỗi lượt chạm NFC hoặc quét mã QR đều được hệ thống ghi nhận ẩn danh (thời gian, dòng máy đối tác, địa điểm tương đối); cho phép chủ thẻ bật tính năng khóa riêng tư đòi hỏi mật khẩu một lần nếu danh thiếp chứa thông tin tài chính mật.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Tại màn hình Trang chủ hoặc menu tác vụ nhanh, chạm vào thẻ danh thiếp số để mở ngăn kéo "Chia sẻ vCard".',
      'Bước 2: Chọn phương thức kết nối: Chạm thẻ NFC trực tiếp hoặc Hiển thị mã QR vCard toàn màn hình.',
      'Bước 3: Hướng điện thoại của đối tác vào mã QR hoặc đưa thẻ vật lý chạm vào ăng-ten NFC của thiết bị đối tác.',
      'Bước 4: Thiết bị đối tác tự động nhận diện và hiển thị nút "Lưu vào Danh bạ" đầy đủ thông tin chỉ trong 1 thao tác.'
    ]
  },
  {
    id: 4,
    subCode: '2.3.3.4',
    name: 'Phân hệ Lịch Sự Kiện & Hội Nghị Doanh Nhân Toàn Cầu (/calendar)',
    shortTitle: 'Lịch Sự Kiện & Hội Nghị Doanh Nhân Toàn Cầu',
    imgFile: 'app_04_calendar.png',
    figTitle: 'Hình 3.4 – Giao Diện Di Động Lịch Sự Kiện & Hội Nghị Doanh Nhân Toàn Cầu',
    generalDesc: 'Phân hệ lịch số quản trị toàn bộ các hoạt động sự kiện, hội thảo B2B, tọa đàm xúc tiến đầu tư, giải thể thao và gala họp mặt doanh nhân. Cung cấp góc nhìn lịch trực quan theo ngày, tuần, tháng kèm thông tin diễn giả, địa điểm tổ chức, định vị bản đồ và nút đăng ký tham gia trực tiếp.',
    features: [
      {
        name: 'Xem lịch trực quan theo dạng lưới tháng và danh sách cuốn (Agenda)',
        desc: 'Giao diện lịch hiện đại cho phép chuyển đổi linh hoạt giữa dạng lưới tháng tổng quan và danh sách dòng thời gian chi tiết; các ngày có sự kiện quan trọng được đánh dấu chấm tròn vàng hoàng gia nổi bật.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Đăng ký tham gia sự kiện và thanh toán vé điện tử tích hợp',
        desc: 'Doanh nhân chạm vào sự kiện để xem chi tiết chương trình (Agenda), danh sách diễn giả C-Level, sơ đồ vị trí hội trường; nhấn nút gradient vàng "Đăng ký tham dự" và hoàn tất thanh toán vé qua cổng VNPay trong ứng dụng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Đồng bộ hóa sự kiện vào lịch cá nhân Apple Calendar & Google Calendar',
        desc: 'Hỗ trợ tính năng xuất lịch chuẩn tệp .ics và đồng bộ hai chiều với ứng dụng Calendar trên điện thoại; tự động kích hoạt thông báo nhắc nhở trước giờ diễn ra sự kiện 24 giờ và 2 giờ.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Check-in sự kiện tự động không chạm khi đến gần hội trường',
        desc: 'Khi doanh nhân di chuyển vào bán kính định vị địa lý (Geofencing) của trung tâm hội nghị, ứng dụng tự động hiển thị thẻ thông báo đón tiếp và mở sẵn mã vé QR để nhân viên soát vé quét nhanh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      }
    ],
    steps: [
      'Bước 1: Chạm vào tab "Lịch trình" trên thanh điều hướng dưới đáy ứng dụng.',
      'Bước 2: Lướt chọn ngày trên thanh lịch ngang hoặc chuyển sang dạng xem toàn bộ tháng.',
      'Bước 3: Chạm vào một sự kiện doanh nhân để xem nội dung chương trình và danh sách diễn giả.',
      'Bước 4: Nhấn nút "Đăng ký tham gia" để nhận vé điện tử lưu trực tiếp vào Ví vé ViOne Tickets.'
    ]
  },
  {
    id: 5,
    subCode: '2.3.3.5',
    name: 'Phân hệ Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS (/network)',
    shortTitle: 'Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS',
    imgFile: 'app_05_network.png',
    figTitle: 'Hình 3.5 – Giao Diện Di Động Mạng Lưới Giao Thương & Thư Viện Doanh Nhân GPS',
    generalDesc: 'Phân hệ kết nối không gian kinh doanh mở, tổng hợp hồ sơ số hóa của hàng ngàn doanh nhân và doanh nghiệp thành viên. Tích hợp bộ lọc ngành nghề chuyên sâu (Bất động sản, Tài chính, Công nghệ, Y tế, Xây dựng...) và công nghệ định vị GPS vệ tinh hiển thị các doanh nhân đối tác đang ở bán kính gần nhất.',
    features: [
      {
        name: 'Tra cứu hồ sơ doanh nhân với bộ lọc đa tiêu chí linh hoạt',
        desc: 'Cho phép tìm kiếm nhanh theo từ khóa, ngành nghề kinh doanh cốt lõi, quy mô doanh nghiệp, cấp độ thẻ VIP và khu vực địa lý; danh sách trả về tức thì dưới 100ms nhờ cơ chế bộ đệm chỉ mục thông minh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tìm kiếm đối tác kinh doanh quanh đây qua GPS Geolocation',
        desc: 'Ứng dụng sử dụng tọa độ GPS thiết bị để quét và hiển thị danh sách các doanh nhân trong bán kính từ 1km đến 50km, hỗ trợ kết nối trực tiếp trong các sự kiện hội nghị lớn hoặc triển lãm thương mại.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Gửi yêu cầu kết nối giao thương và trao đổi danh thiếp số 1-chạm',
        desc: 'Doanh nhân có thể xem hồ sơ năng lực doanh nghiệp, nhấn nút "Kết nối" để gửi thông điệp làm quen và chia sẻ danh thiếp số vCard cho đối tác kèm thông báo đẩy bảo mật.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Xác thực doanh nghiệp chính danh (Verified Business Badge)',
        desc: 'Gắn huy hiệu xác minh tích xanh / viền vàng đối với các doanh nghiệp đã hoàn tất quy trình thẩm định KYC, tra cứu mã số thuế hợp lệ và có chứng nhận tư cách pháp nhân từ ban quản trị.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn tab "Mạng lưới" trên thanh điều hướng dưới đáy màn hình ứng dụng.',
      'Bước 2: Sử dụng thanh tìm kiếm hoặc chạm vào các thẻ ngành nghề để lọc danh sách đối tác tiềm năng.',
      'Bước 3: Nhấp vào hồ sơ doanh nhân để xem chi tiết ngành nghề kinh doanh, giới thiệu sản phẩm và tệp hồ sơ năng lực.',
      'Bước 4: Nhấn nút "Kết nối giao thương" hoặc "Lưu danh thiếp" để thiết lập quan hệ hợp tác kinh doanh.'
    ]
  },
  {
    id: 6,
    subCode: '2.3.3.6',
    name: 'Phân hệ Dòng Thời Gian Khoảnh Khắc Doanh Nhân ViOne Moments (/moment)',
    shortTitle: 'Khoảnh Khắc Doanh Nhân ViOne Moments',
    imgFile: 'app_06_moments.png',
    figTitle: 'Hình 3.6 – Giao Diện Di Động Khoảnh Khắc Doanh Nhân ViOne Moments',
    generalDesc: 'Phân hệ mạng xã hội nội bộ chuyên nghiệp dành riêng cho giới tinh hoa doanh nhân. Nơi chia sẻ các bài viết thành tựu ký kết hợp đồng, hình ảnh lễ vinh danh, kinh nghiệm quản trị điều hành C-Level và các sự kiện trách nhiệm xã hội doanh nghiệp (CSR) với trải nghiệm tương tác trang trọng, lịch thiệp.',
    features: [
      {
        name: 'Đăng tải bài viết đa phương tiện hình ảnh và video chất lượng cao',
        desc: 'Hỗ trợ doanh nhân soạn thảo bài viết, đính kèm chùm ảnh hoạt động kinh doanh độ nét cao được nén tự động tối ưu băng thông qua chuẩn WebP/H.265; gắn thẻ (tag) đối tác và đính kèm liên kết sản phẩm sàn B2B.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tương tác kết nối chuyên nghiệp (Chúc mừng, Bắt tay hợp tác, Bình luận)',
        desc: 'Thay thế các nút bấm thông thường bằng các biểu tượng tương tác văn hóa doanh nhân: "Bắt tay chúc mừng", "Quan tâm đầu tư", "Ủng hộ hợp tác" và luồng thảo luận có kiểm duyệt từ ngữ văn minh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Bộ lọc bảng tin thông minh theo chi hội và nhóm sở thích',
        desc: 'Cho phép người dùng chuyển đổi xem bài viết giữa "Toàn mạng lưới doanh nghiệp", "Chi hội trực thuộc", "Nhóm câu lạc bộ Thể thao / Di sản" và "Bài viết nổi bật được ghim bởi Ban Lãnh đạo".',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Kiểm duyệt nội dung tự động bằng bộ lọc từ khóa AI (Content Moderation)',
        desc: 'Hệ thống tự động phát hiện và ngăn chặn các nội dung spam quảng cáo sai quy định, ngôn từ kích động hoặc hình ảnh vi phạm thuần phong mỹ tục trước khi bài viết hiển thị công khai.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chạm vào biểu tượng "Khoảnh khắc" trên thanh điều hướng dưới đáy ứng dụng.',
      'Bước 2: Lướt xem các tin tức kinh doanh, hoạt động ký kết hợp tác của các doanh nhân trong mạng lưới.',
      'Bước 3: Nhấn nút "Đăng khoảnh khắc" để chia sẻ hình ảnh hoặc tin tức sự kiện mới của công ty bạn.',
      'Bước 4: Nhấn biểu tượng "Bắt tay" hoặc để lại lời bình luận chúc mừng thành công của đối tác.'
    ]
  },
  {
    id: 7,
    subCode: '2.3.3.7',
    name: 'Phân hệ Hộp Thư Đàm Phán Kinh Doanh & Trò Chuyện Bảo Mật (/inbox)',
    shortTitle: 'Hộp Thư Đàm Phán & Trò Chuyện Bảo Mật',
    imgFile: 'app_07_inbox.png',
    figTitle: 'Hình 3.7 – Giao Diện Di Động Hộp Thư Đàm Phán & Trò Chuyện Bảo Mật',
    generalDesc: 'Phân hệ kênh liên lạc bảo mật thời gian thực phục vụ các cuộc trao đổi đàm phán hợp đồng, thảo luận cơ hội thương mại B2B giữa các chủ doanh nghiệp. Hoạt động trên nền giao thức WebSocket Socket.IO với chuẩn mã hóa đầu cuối tín nhắn TLS 1.3 và cơ chế lưu trữ tin nhắn phân vùng biệt lập.',
    features: [
      {
        name: 'Trò chuyện thời gian thực siêu tốc qua Socket.IO Gateway',
        desc: 'Duy trì kết nối WebSocket thường trực với máy chủ; đảm bảo tin nhắn văn bản, tệp báo giá PDF và hình ảnh được truyền tải tức thì dưới 50ms kèm chỉ báo đã gửi, đã nhận và đã xem trực quan.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Nhóm thảo luận chuyên đề theo ban điều hành và câu lạc bộ',
        desc: 'Hỗ trợ tạo nhóm chat điều phối Ban Chấp hành, nhóm dự án đầu tư hoặc nhóm VĐV giải đấu thể thao; quản trị viên nhóm có toàn quyền cấp phép, thu hồi quyền gửi tin và ghim tài liệu quan trọng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Chia sẻ thẻ danh thiếp số vCard và tệp hồ sơ năng lực trong cuộc trò chuyện',
        desc: 'Tích hợp nút gửi nhanh thông tin pháp nhân doanh nghiệp, tệp bảng chào giá (Quotation) hoặc gửi lời mời tham dự sự kiện trực tiếp trong khung trò chuyện mà không cần thoát ứng dụng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Thông báo đẩy cuộc gọi và tin nhắn khẩn cấp qua Apple APNs / Firebase FCM',
        desc: 'Đảm bảo doanh nhân không bỏ lỡ các liên hệ giao thương quan trọng ngay cả khi đã tắt ứng dụng hoặc màn hình khóa; hỗ trợ xem trước tin nhắn và trả lời nhanh trực tiếp từ thanh thông báo.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chạm vào biểu tượng "Hộp thư" trên thanh điều hướng dưới đáy màn hình.',
      'Bước 2: Lướt danh sách các hội thoại cá nhân hoặc nhóm làm việc chuyên ban.',
      'Bước 3: Chạm vào một cuộc hội thoại để mở khung chat, soạn thảo tin nhắn đàm phán thương thảo.',
      'Bước 4: Nhấn biểu tượng dấu cộng (+) để đính kèm tệp hồ sơ hợp đồng PDF hoặc gửi thẻ danh thiếp vCard.'
    ]
  },
  {
    id: 8,
    subCode: '2.3.3.8',
    name: 'Phân hệ Menu Điều Phối Nổi Độc Quyền VActionSheet 3D Dập Nổi Vàng Hoàng Gia',
    shortTitle: 'Menu Điều Phối Nổi Độc Quyền VActionSheet 3D',
    imgFile: 'app_08_vaction.png',
    figTitle: 'Hình 3.8 – Giao Diện Di Động Menu Điều Phối Nổi Độc Quyền VActionSheet 3D',
    generalDesc: 'Phân hệ menu điều hướng trung tâm mang tính biểu tượng của ViOne Connect App, được kích hoạt bởi nút bấm tròn nổi chữ "V" mạ vàng hoàng gia 3D ở chính giữa thanh điều hướng đáy. Khi chạm, một ngăn kéo hiệu ứng làm mờ kính thủy tinh (Glassmorphism Acrylic) mở ra toàn màn hình, hiển thị lưới 9 khối tác vụ cao cấp phân bổ thông minh.',
    features: [
      {
        name: 'Nút điều phối nổi chữ V mạ vàng nổi khối 3D xúc giác (Haptic Feedback)',
        desc: 'Nút bấm trung tâm thiết kế hình khối nổi kim loại vàng hoàng gia; khi người dùng chạm vào, động cơ rung haptic phản hồi xúc giác nhẹ nhàng tạo cảm giác chạm vật lý cao cấp.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bố cục lưới 9 lối tắt nghiệp vụ số hóa toàn diện (3x3 Grid Matrix)',
        desc: 'Tập trung toàn bộ các phân hệ trọng điểm: Quét danh thiếp AI OCR, Danh thiếp số vCard, Ví vé ViOne Tickets, Giải đấu ViOne Sport, Giải chạy ViOne Run, Bảo tàng số ViOne Museum, Di sản văn hóa ViOne Heritage, Quản trị công việc Kanban và Khảo sát biểu quyết tín nhiệm.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Hiệu ứng nền kính mờ Glassmorphism và chuyển động mượt mà (Spring Physics)',
        desc: 'Nền ngăn kéo sử dụng bộ lọc đồ họa backdrop-filter làm mờ bối cảnh trang chủ phía sau, các biểu tượng ứng dụng xuất hiện tuần tự với hiệu ứng lò xo tự nhiên mang đến trải nghiệm thị giác ấn tượng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Phân quyền hiển thị lối tắt theo vai trò tài khoản (Role-based Shortcut Visibility)',
        desc: 'Người dùng thông thường chỉ thấy các chức năng kết nối giao thương, văn hóa, thể thao; trong khi các tài khoản lãnh đạo C-Level và Quản trị viên được bổ sung phím tắt vào phân hệ phê duyệt tài chính và quét soát vé POS.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chạm vào nút tròn biểu tượng chữ "V" màu vàng hoàng gia ở chính giữa thanh điều hướng đáy.',
      'Bước 2: Ngăn kéo nổi VActionSheet 3D mở ra với hiệu ứng kính mờ và danh sách 9 tiện ích cao cấp.',
      'Bước 3: Lựa chọn phân hệ muốn làm việc (Ví dụ: ViOne Sport, ViOne Run, ViOne Museum, ViOne Heritage, ViOne Tickets).',
      'Bước 4: Ứng dụng lập tức chuyển hướng tức thì sang màn hình phân hệ chuyên biệt tương ứng.'
    ]
  },
  {
    id: 9,
    subCode: '2.3.3.9',
    name: 'Phân hệ Trung Tâm Cộng Đồng Doanh Nhân & Cơ Cấu Tổ Chức (/community)',
    shortTitle: 'Trung Tâm Cộng Đồng & Cơ Cấu Tổ Chức',
    imgFile: 'app_09_community.png',
    figTitle: 'Hình 3.9 – Giao Diện Di Động Trung Tâm Cộng Đồng & Cơ Cấu Tổ Chức',
    generalDesc: 'Phân hệ quản trị không gian số của tổ chức doanh nghiệp, thể hiện sơ đồ cây cơ cấu tổ chức Ban Chấp hành, Hội đồng Cố vấn, các Ban chuyên môn (Ban Xúc tiến Thương mại, Ban Sự kiện, Ban Đào tạo, Ban Thể thao) và danh sách toàn bộ các thành viên chính thức kèm phân nhóm quyền hạn rõ ràng.',
    features: [
      {
        name: 'Sơ đồ tổ chức Ban Lãnh đạo và các ban chuyên môn trực quan',
        desc: 'Hiển thị sơ đồ phả hệ lãnh đạo với ảnh đại diện, chức vụ trong tổ chức và thông tin liên hệ; giúp các doanh nhân mới tham gia dễ dàng nhận diện và kết nối đúng đầu mối công việc.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Kho tài liệu điều lệ, quy chế hoạt động và biên bản họp số',
        desc: 'Lưu trữ các văn bản pháp lý, quy chế kết nối giao thương, biên bản nghị quyết Đại hội được số hóa và ký điện tử, cho phép doanh nhân tra cứu và tải về dạng PDF có mã kiểm tra.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Diễn đàn đóng góp ý kiến và sáng kiến phát triển tổ chức',
        desc: 'Khu vực gửi đề xuất giải pháp phát triển kinh doanh, đề xuất chủ đề tọa đàm gửi tới Ban Thường trực với quy trình tiếp nhận, phân loại và phản hồi minh bạch.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Đồng bộ hóa danh bạ nội bộ chi hội vào điện thoại',
        desc: 'Hỗ trợ tính năng xuất toàn bộ danh bạ các doanh nhân trong cùng chi hội vào danh bạ máy chỉ bằng một thao tác xác thực an toàn bằng FaceID.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Mở menu điều phối VActionSheet 3D và chọn biểu tượng "Cộng đồng".',
      'Bước 2: Lướt xem cơ cấu Ban Chấp hành và các ban chuyên môn của tổ chức.',
      'Bước 3: Chạm vào danh mục tài liệu để xem điều lệ và các biên bản nghị quyết số hóa.',
      'Bước 4: Nhấn vào hồ sơ của một Trưởng ban chuyên môn để gửi tin nhắn làm việc trực tiếp.'
    ]
  },
  {
    id: 10,
    subCode: '2.3.3.10',
    name: 'Phân hệ Quản Lý Nhiệm Vụ & Bảng Việc Di Động (/tasks)',
    shortTitle: 'Quản Lý Nhiệm Vụ & Bảng Việc Di Động',
    imgFile: 'app_10_tasks.png',
    figTitle: 'Hình 3.10 – Giao Diện Di Động Quản Lý Nhiệm Vụ & Bảng Việc Di Động',
    generalDesc: 'Phân hệ điều phối công việc di động chuẩn Kanban, giúp lãnh đạo doanh nghiệp giao việc, phân công trách nhiệm cho các cộng sự, theo dõi tiến độ hoàn thành các đề án kinh doanh và nhận cảnh báo deadline công việc ngay trên smartphone.',
    features: [
      {
        name: 'Bảng theo dõi công việc đa trạng thái (Cần làm, Đang làm, Hoàn thành)',
        desc: 'Giao diện trực quan phân chia công việc thành các cột trạng thái rõ ràng, hiển thị hạn chót (Deadline), người chịu trách nhiệm chính, độ ưu tiên (Khẩn cấp, Cao, Bình thường).',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Giao việc nhanh kèm tệp đính kèm và danh sách việc cần làm (Checklist)',
        desc: 'Lãnh đạo có thể tạo nhanh đầu việc mới trong 30 giây: nhập tiêu đề, chọn người thực hiện từ danh bạ công ty, đính kèm ảnh hoặc tệp tài liệu và thiết lập các mục tiêu con.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Cảnh báo thời hạn nhiệm vụ tự động qua thông báo đẩy và Zalo OA',
        desc: 'Hệ thống tự động quét các nhiệm vụ sắp đến hạn (trước 24 giờ và 2 giờ) và gửi tin nhắn cảnh báo nhắc nhở đến người phụ trách để đảm bảo không bị chậm tiến độ.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Báo cáo tỷ lệ hoàn thành KPI công việc theo tuần và tháng',
        desc: 'Tự động tổng hợp đồ thị phần trăm hoàn thành nhiệm vụ đúng hạn của từng cá nhân và phòng ban, hỗ trợ đánh giá hiệu quả đóng góp công việc khách quan.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Công việc & Nhiệm vụ" trong menu VActionSheet hoặc màn hình Cộng đồng.',
      'Bước 2: Lướt xem danh sách công việc được giao hoặc công việc mình đang quản lý.',
      'Bước 3: Chạm vào một thẻ công việc để cập nhật tiến độ, đánh dấu các mục checklist đã làm xong.',
      'Bước 4: Nhấn nút "Tạo nhiệm vụ mới" nếu muốn giao việc cho thành viên trong nhóm công tác.'
    ]
  },
  {
    id: 11,
    subCode: '2.3.3.11',
    name: 'Phân hệ Trung Tâm Hồ Sơ Doanh Nhân & Cài Đặt Cá Nhân (/me)',
    shortTitle: 'Trung Tâm Hồ Sơ Doanh Nhân & Cài Đặt Cá Nhân',
    imgFile: 'app_11_me.png',
    figTitle: 'Hình 3.11 – Giao Diện Di Động Hồ Sơ Doanh Nhân & Cài Đặt Cá Nhân',
    generalDesc: 'Phân hệ quản trị toàn diện hồ sơ định danh cá nhân của doanh nhân: Thay đổi thông tin liên hệ, ảnh chân dung lãnh đạo, cập nhật giới thiệu pháp nhân doanh nghiệp, quản lý các thẻ VIP đã kích hoạt, chuyển đổi ngôn ngữ ứng dụng (Việt/Anh) và quản trị thiết bị đăng nhập.',
    features: [
      {
        name: 'Quản trị hồ sơ doanh nhân số hóa toàn diện',
        desc: 'Cho phép chỉnh sửa họ tên, số điện thoại, email công vụ, chức danh doanh nghiệp, địa chỉ trụ sở, mã số thuế và tải lên tệp hồ sơ năng lực (Company Profile PDF) để chia sẻ cho đối tác.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Quản lý hạng thẻ doanh nhân và lịch sử gia hạn phí thường niên',
        desc: 'Hiển thị hạng thẻ hiện tại (VIP Gold, Platinum, Diamond), thời hạn hiệu lực của thẻ và nút thanh toán gia hạn phí thường niên trực tuyến qua VNPay-QR một cách minh bạch.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Cài đặt giao diện hiển thị và tùy chọn ngôn ngữ quốc tế',
        desc: 'Cung cấp tùy chọn chuyển đổi ngôn ngữ linh hoạt giữa Tiếng Việt và Tiếng Anh; lựa chọn chế độ hiển thị thẻ số mặc định và âm thanh phản hồi khi chạm NFC.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Quản lý danh sách thiết bị tin cậy và đăng xuất từ xa',
        desc: 'Liệt kê danh sách các dòng điện thoại, máy tính bảng đang đăng nhập tài khoản; cho phép doanh nhân thu hồi quyền truy cập của các thiết bị lạ chỉ bằng 1 thao tác.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Chạm vào tab "Cá nhân" ở góc phải của thanh điều hướng đáy màn hình.',
      'Bước 2: Quan sát thông tin thẻ định danh, hạng thẻ VIP và số ngày sử dụng còn lại.',
      'Bước 3: Chạm vào "Chỉnh sửa thông tin" để cập nhật số điện thoại, ảnh đại diện hoặc địa chỉ công ty.',
      'Bước 4: Chạm vào "Cài đặt an toàn" để kích hoạt FaceID hoặc quản lý các thiết bị đang đăng nhập.'
    ]
  },
  {
    id: 12,
    subCode: '2.3.3.12',
    name: 'Phân hệ Thẻ vCard QR Động & Mã Hóa Chống Sao Chép (/me/card)',
    shortTitle: 'Thẻ vCard QR Động & Mã Hóa Chống Sao Chép',
    imgFile: 'app_12_vcard_qr.png',
    figTitle: 'Hình 3.12 – Giao Diện Di Động Thẻ vCard QR Động & Mã Hóa Chống Sao Chép',
    generalDesc: 'Phân hệ hiển thị toàn màn hình danh thiếp số vCard cao cấp kết hợp mã QR biến đổi động theo thuật toán bảo mật TOTP. Ngăn chặn triệt để hành vi chụp lén màn hình hoặc sao chép mã QR giả mạo danh tính lãnh đạo doanh nghiệp.',
    features: [
      {
        name: 'Mã QR vCard 4.0 động xoay vòng định kỳ (Dynamic Rolling QR)',
        desc: 'Mã QR được tự động làm mới sau mỗi 60 giây bằng mã băm HMAC-SHA256 kết hợp dấu thời gian (Timestamp); mã cũ sẽ lập tức hết hiệu lực, đảm bảo đối tác luôn quét được thông tin chính chủ và cập nhật nhất.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tự động tăng độ sáng màn hình tối đa khi mở mã QR',
        desc: 'Ứng dụng tự động điều chỉnh độ sáng màn hình điện thoại lên 100% khi vào trang mã QR để đảm bảo các loại camera điện thoại đối tác có thể quét thành công trong mọi điều kiện ánh sáng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Nút lưu danh thiếp số dạng ảnh độ phân giải cao vào thư viện ảnh',
        desc: 'Cho phép kết xuất danh thiếp số thành tệp ảnh PNG nghệ thuật mạ vàng có mã QR để doanh nhân đặt làm hình nền màn hình khóa điện thoại tiện cho đối tác quét nhanh.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Ghi nhật ký thiết bị đối tác đã quét mã QR',
        desc: 'Gửi thông báo ngầm về máy chủ lưu trữ thời gian và vị trí thành phố của đối tác vừa quét thẻ; giúp doanh nhân có dữ liệu theo dõi sau các phiên kết nối sự kiện.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Từ màn hình Trang chủ hoặc Hồ sơ cá nhân, chọn mục "Mã QR danh thiếp".',
      'Bước 2: Màn hình tự động tăng độ sáng tối đa, hiển thị mã QR động có viền vàng hoàng gia sang trọng.',
      'Bước 3: Đưa màn hình cho đối tác dùng camera điện thoại quét để nhận danh bạ vCard.',
      'Bước 4: Nhấn nút "Lưu ảnh danh thiếp" nếu muốn lưu thẻ hình nền vào thư viện ảnh của máy.'
    ]
  },
  {
    id: 13,
    subCode: '2.3.3.13',
    name: 'Phân hệ Quét Danh Thiếp Giấy & Bóc Tách Tự Động AI OCR (/card-scan)',
    shortTitle: 'Quét Danh Thiếp Giấy & Bóc Tách AI OCR',
    imgFile: 'app_13_ocr.png',
    figTitle: 'Hình 3.13 – Giao Diện Di Động Quét Danh Thiếp Giấy & Bóc Tách AI OCR',
    generalDesc: 'Phân hệ ứng dụng công nghệ Thị giác máy tính (Computer Vision) và Trí tuệ nhân tạo OCR, cho phép doanh nhân dùng camera điện thoại quét chụp danh thiếp giấy nhận được từ đối tác, tự động bóc tách họ tên, số điện thoại, email, chức vụ, tên công ty và lưu thẳng vào danh bạ số chỉ trong 2 giây.',
    features: [
      {
        name: 'Tự động nhận diện khung viền và căn chỉnh góc chụp danh thiếp',
        desc: 'Thuật toán OpenCV tự động phát hiện 4 góc mép của tấm danh thiếp giấy trong khung ngắm camera, tự động cân bằng sáng, khử đổ bóng và nắn thẳng góc phối cảnh (Perspective Transform) trước khi phân tích.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Động cơ bóc tách ngữ nghĩa AI OCR Tiếng Việt và Tiếng Anh chuyên sâu',
        desc: 'Mô hình học máy phân tích sâu cấu trúc văn bản: Phân biệt chính xác đâu là Tên người, Chức danh lãnh đạo, Số điện thoại di động/cố định, Địa chỉ trụ sở và Mã số thuế với độ chính xác trên 98%.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Biểu mẫu xem trước và chỉnh sửa thông tin thông minh trước khi lưu',
        desc: 'Hiển thị form đối chiếu trực quan: Ảnh danh thiếp gốc chụp bên trên và các trường thông tin bóc tách được ở bên dưới để doanh nhân kiểm tra, chỉnh sửa nhanh nếu muốn.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Lưu đồng thời vào Danh bạ điện thoại và Cơ sở dữ liệu CRM đám mây',
        desc: 'Sau khi xác nhận lưu, dữ liệu được ghi đồng bộ vào danh bạ Contacts của iPhone/Android và đẩy lên phân hệ Quản trị Khách hàng B2B trên Cổng Web Quản Trị ViOne Platform.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chạm vào biểu tượng "Quét AI OCR" trên menu điều phối nhanh VActionSheet 3D.',
      'Bước 2: Hướng camera điện thoại vào tấm danh thiếp giấy của đối tác trên bàn làm việc.',
      'Bước 3: Nhấn nút chụp; hệ thống AI tự động xử lý và trích xuất toàn bộ thông tin trong 1-2 giây.',
      'Bước 4: Kiểm tra lại họ tên, số điện thoại rồi nhấn nút "Lưu danh bạ & CRM" để hoàn tất.'
    ]
  },
  {
    id: 14,
    subCode: '2.3.3.14',
    name: 'Phân hệ Trung Tâm An Toàn & Bảo Mật Thiết Bị Di Động (/me/security)',
    shortTitle: 'Trung Tâm An Toàn & Bảo Mật Thiết Bị Di Động',
    imgFile: 'app_14_security.png',
    figTitle: 'Hình 3.14 – Giao Diện Di Động Trung Tâm An Toàn & Bảo Mật Thiết Bị',
    generalDesc: 'Phân hệ chuyên trách thiết lập các rào chắn bảo vệ tài khoản và dữ liệu doanh nghiệp trên điện thoại: Bật/tắt sinh trắc học FaceID/TouchID, thiết lập mã PIN bảo vệ 6 số, xác thực hai lớp TOTP, đổi mật khẩu băm Argon2 và xóa sạch dữ liệu cục bộ khi mất máy.',
    features: [
      {
        name: 'Kích hoạt khóa bảo vệ ứng dụng bằng Sinh trắc học & Mã PIN dự phòng',
        desc: 'Thiết lập yêu cầu quét FaceID hoặc nhập mã PIN bí mật mỗi khi mở lại ứng dụng từ chế độ chạy ngầm sau 1 phút, ngăn ngừa nguy cơ người lạ truy cập dữ liệu khi mượn điện thoại.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Cấu hình xác thực hai bước (2FA) bằng ứng dụng bảo mật Authenticator',
        desc: 'Hiển thị khóa bí mật Secret Key và mã QR để tích hợp với Google Authenticator, Microsoft Authenticator hoặc Apple Passwords; bắt buộc nhập mã khi thực hiện giao dịch tài chính.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Tính năng tiêu hủy dữ liệu cục bộ khẩn cấp (Emergency Local Wipe)',
        desc: 'Tự động kích hoạt cơ chế xóa sạch toàn bộ khóa Keychain, tệp đệm Offline, token lưu trữ và đăng xuất tài khoản nếu nhập sai mã PIN quá 10 lần liên tiếp.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Nhật ký các lần đăng nhập và cảnh báo vị trí đăng nhập bất thường',
        desc: 'Hiển thị chi tiết thời gian, địa chỉ IP, tên thiết bị của 5 phiên đăng nhập gần nhất; gửi thông báo cảnh báo tức thì nếu phát hiện đăng nhập từ tỉnh/thành phố khác lạ.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Từ màn hình Hồ sơ cá nhân (/me), chạm vào mục "Trung tâm An toàn & Bảo mật".',
      'Bước 2: Gạt bật công tắc "Mở khóa bằng FaceID" và thiết lập mã PIN bảo vệ 6 chữ số.',
      'Bước 3: Chọn "Kích hoạt bảo mật 2 lớp 2FA" và quét mã QR vào ứng dụng Google Authenticator.',
      'Bước 4: Kiểm tra danh sách thiết bị đang đăng nhập và nhấn "Đổi mật khẩu" định kỳ.'
    ]
  },
  {
    id: 15,
    subCode: '2.3.3.15',
    name: 'Phân hệ Trung Tâm Thông Báo & Cảnh Báo Điều Hành (/notifications)',
    shortTitle: 'Trung Tâm Thông Báo & Cảnh Báo Điều Hành',
    imgFile: 'app_15_notifications.png',
    figTitle: 'Hình 3.15 – Giao Diện Di Động Trung Tâm Thông Báo & Cảnh Báo Điều Hành',
    generalDesc: 'Phân hệ tập trung toàn bộ các luồng thông báo của ứng dụng: Thông báo kết nối giao thương mới, lời mời tham gia sự kiện, cập nhật trạng thái đơn vé VNPay, thông báo bắt đầu trận đấu thể thao và tin tức chỉ đạo từ Ban Chấp hành.',
    features: [
      {
        name: 'Phân loại thông báo thông minh theo 4 danh mục chuyên biệt',
        desc: 'Tự động sắp xếp luồng thông báo thành các nhóm rõ ràng: "Giao thương B2B", "Sự kiện & Vé", "Giải đấu & Thể thao", "Hệ thống & Tài chính" giúp doanh nhân dễ dàng theo dõi theo mức độ ưu tiên.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Thao tác xử lý nhanh trực tiếp từ thẻ thông báo (Interactive Action)',
        desc: 'Cho phép doanh nhân nhấn nút "Chấp nhận kết nối", "Xem chi tiết vé QR" hoặc "Xem kết quả trận đấu" ngay trên thẻ thông báo mà không cần phải chuyển màn hình phức tạp.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Đồng bộ hóa trạng thái đã đọc giữa các thiết bị thời gian thực',
        desc: 'Sử dụng Socket.IO để đồng bộ tức thì số đếm thông báo chưa đọc (Unread Badge Count) giữa điện thoại di động và Cổng Web Quản Trị.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Tùy chỉnh cấu hình nhận tin theo nhu cầu cá nhân',
        desc: 'Cho phép bật/tắt nhận thông báo cho từng phân hệ cụ thể, thiết lập khung giờ im lặng ban đêm để tránh làm phiền ngoài giờ làm việc.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chạm vào biểu tượng Chiếc chuông thông báo ở góc trên bên phải màn hình ứng dụng.',
      'Bước 2: Lướt danh sách thông báo mới hoặc chọn tab chuyên mục (Giao thương, Sự kiện, Thể thao).',
      'Bước 3: Chạm vào một thông báo để mở màn hình chi tiết hoặc thực hiện thao tác tương tác nhanh.',
      'Bước 4: Nhấn nút "Đánh dấu tất cả đã đọc" để làm sạch danh sách thông báo.'
    ]
  },
  {
    id: 16,
    subCode: '2.3.3.16',
    name: 'Phân hệ Ví Vé Điện Tử & Mã Hóa Chống Giả QR Động ViOne Tickets',
    shortTitle: 'Ví Vé Điện Tử & QR Động ViOne Tickets',
    imgFile: 'app_16_tickets.png',
    figTitle: 'Hình 3.16 – Giao Diện Di Động Ví Vé Điện Tử & Mã Hóa Chống Giả QR Động ViOne Tickets',
    generalDesc: 'Phân hệ quản trị toàn diện ví vé điện tử cá nhân dành cho các hội nghị thượng đỉnh doanh nhân, giải đấu thể thao và vé tham quan di sản văn hóa. Tích hợp công nghệ mã QR động xoay vòng khóa chống gian lận (Anti-Counterfeiting Rotating QR), cho phép chuyển nhượng vé an toàn và cung cấp cổng soát vé nhân viên POS di động tốc độ cao dưới 100ms.',
    features: [
      {
        name: 'Ví lưu trữ vé điện tử tập trung đa sự kiện (Unified e-Ticket Wallet)',
        desc: 'Quản lý toàn bộ vé tham dự hội nghị B2B, vé tham gia giải chạy ViOne Run Marathon, vé cổ vũ giải thể thao ViOne Sport và vé tham quan Bảo tàng / Di tích trên một màn hình trực quan với hiệu ứng vé máy bay sang trọng dập nổi viền vàng.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Mã QR động bảo mật xoay vòng 60 giây chống gian lận vé (TOTP Security QR)',
        desc: 'Mã QR check-in được máy chủ tạo ra dựa trên khóa bí mật TOTP kết hợp thời gian thực; mã tự động xoay mới sau mỗi 60 giây và có hiệu lực 1 lần duy nhất, triệt tiêu hoàn toàn hành vi chụp ảnh màn hình bán lại vé hoặc sao chép mã vạch trái phép.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Cổng soát vé nhân viên POS di động siêu tốc (Mobile POS Ticket Validator)',
        desc: 'Tích hợp chế độ camera quét vé chuyên dụng dành cho nhân viên an ninh tại cổng kiểm soát: Quét liên tục không trễ, phản hồi rung và âm thanh "Ting" khi hợp lệ, phát hiện và cảnh báo đỏ ngay lập tức nếu vé đã bị quét check-in trước đó; tốc độ xử lý đạt dưới 100ms/vé, xử lý được 30 khách/phút/cửa.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Chế độ hoạt động ngoại tuyến không cần Internet (Offline Cash & Sync Validator)',
        desc: 'Hỗ trợ tải trước danh sách mã vé đã mã hóa vào bộ nhớ đệm SQLite cục bộ trên máy nhân viên soát vé; hệ thống vẫn xác thực chính xác 100% khi sự kiện diễn ra ở khu vực mất sóng 4G/Wi-Fi và tự động đồng bộ lên đám mây khi có mạng trở lại.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Quy trình chuyển nhượng vé số hóa an toàn và minh bạch',
        desc: 'Cho phép doanh nhân ủy quyền hoặc tặng vé sự kiện cho đối tác/cộng sự; hệ thống hủy mã vé cũ và phát sinh mã vé hoàn toàn mới cho người nhận, đồng thời ghi nhận lịch sử chuyển nhượng bất biến vào CSDL.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Mở menu điều phối nổi VActionSheet 3D và chọn biểu tượng "Ví vé ViOne Tickets".',
      'Bước 2: Lướt xem danh sách các vé sự kiện sắp diễn ra và vé đã tham gia trong quá khứ.',
      'Bước 3: Chạm vào một vé để hiển thị chi tiết số ghế, vị trí khán đài và mã QR động bảo mật xoay vòng 60 giây.',
      'Bước 4: Xuất trình mã QR tại cửa hội trường để nhân viên an ninh dùng ứng dụng POS quét thông quan.'
    ],
    subScreens: [
      {
        title: 'Cổng Soát Vé Nhân Viên Check-in POS Siêu Tốc',
        imgFile: 'app_16b_pos_validator.png',
        figTitle: 'Hình 3.16b – Giao Diện Di Động Cổng Soát Vé Nhân Viên Check-in POS Siêu Tốc',
        desc: 'Màn hình kiểm soát vé chuyên dụng dành cho nhân viên điều phối tại cửa ra vào hội trường hoặc khu vực giải đấu. Ứng dụng kích hoạt camera quét mã QR với tần số quét 60fps, hỗ trợ kiểm tra tính hợp lệ của vé chỉ trong 0.08 giây, tự động phát âm thanh xác nhận và chặn đứng hành vi quay vòng vé.'
      }
    ]
  },
  {
    id: 17,
    subCode: '2.3.3.17',
    name: 'Phân hệ Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport Trên Di Động',
    shortTitle: 'Giải Đấu Thể Thao ViOne Sport Trên Di Động',
    imgFile: 'app_17_sport.png',
    figTitle: 'Hình 3.17 – Giao Diện Di Động Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport',
    generalDesc: 'Phân hệ số hóa toàn diện các giải thi đấu thể thao phong trào doanh nghiệp (Bóng đá mini 7 người, Tennis đôi nam lãnh đạo, Golf Cup doanh nhân, Giải vô địch Pickleball). Cung cấp sơ đồ cây bốc thăm phân nhánh tự động (Tournament Bracket), công cụ điều phối lịch thi đấu và sân bãi của Ban Trọng tài, tường thuật tỷ số trực tiếp qua WebSocket (Live Score) và bảng xếp hạng điểm số ELO chuẩn quốc tế.',
    features: [
      {
        name: 'Sơ đồ bốc thăm phân nhánh thi đấu tự động (Tournament Bracket Generator)',
        desc: 'Hỗ trợ các thể thức thi đấu phổ biến: Đấu loại trực tiếp (Single Elimination Knockout), Nhánh thắng nhánh thua (Double Elimination) và Đấu vòng tròn tính điểm. Sơ đồ cây phân nhánh hiển thị trực quan; người dùng có thể chạm vào từng cặp đấu để xem đội hình, tỷ số hiệp đấu và diễn biến.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Lịch thi đấu, điều phối sân bãi và phân công trọng tài (Court & Referee Scheduling)',
        desc: 'Tự động phân bổ lịch đấu theo khung giờ vàng, phát hiện xung đột trùng sân bãi; trọng tài được chỉ định nhận thông báo phân công và có thể cập nhật biên bản trận đấu ngay trên điện thoại.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tường thuật tỷ số trực tiếp thời gian thực qua WebSocket (Live Score Ticker)',
        desc: 'Ban Trọng tài chạm phím cập nhật bàn thắng, điểm số set tennis, điểm chấp handicap golf hoặc lỗi thẻ phạt; dữ liệu lập tức phát sóng tức thì qua Socket.IO tới toàn bộ cổ động viên với độ trễ dưới 50ms.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bảng xếp hạng điểm số ELO và Bảng tổng sắp huy chương Fair-play',
        desc: 'Hệ thống tự động tính điểm xếp hạng cá nhân và câu lạc bộ theo công thức ELO cải tiến; tự động trừ điểm thẻ phạt kỷ luật để trao giải Phong cách Fair-Play cho đội bóng gương mẫu nhất.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Đăng ký đội hình thi đấu, số áo và thẻ vận động viên số hóa',
        desc: 'Đội trưởng doanh nghiệp đăng ký danh sách cầu thủ, chụp ảnh thẻ, khai báo số áo và vị trí thi đấu; hệ thống cấp mã thẻ VĐV số hóa tích hợp mã QR tra cứu lý lịch thể thao.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      }
    ],
    steps: [
      'Bước 1: Mở menu điều phối nổi VActionSheet 3D và chọn biểu tượng "ViOne Sport".',
      'Bước 2: Chọn môn thể thao quan tâm (Bóng đá, Tennis, Pickleball, Golf) và mùa giải đang diễn ra.',
      'Bước 3: Chạm vào tab "Sơ đồ nhánh đấu" hoặc "Lịch thi đấu" để theo dõi các cặp đối đầu hấp dẫn.',
      'Bước 4: Chạm vào một trận đấu đang diễn ra để xem tỷ số trực tiếp Live Score và bình luận cổ vũ đội nhà.'
    ],
    subScreens: [
      {
        title: 'Sơ Đồ Bốc Thăm Phân Nhánh Đấu Loại Trực Tiếp (Tournament Bracket)',
        imgFile: 'app_17b_bracket.png',
        figTitle: 'Hình 3.17b – Giao Diện Di Động Sơ Đồ Phân Nhánh Tournament Bracket',
        desc: 'Màn hình hiển thị sơ đồ cây thi đấu trực quan từ vòng Bảng, Tứ kết, Bán kết đến Chung kết. Người dùng có thể phóng to thu nhỏ, chạm vào từng nút nhánh để xem tỷ số hiệp phụ, luân lưu phạt đền và đội bóng giành quyền đi tiếp vào vòng trong.'
      },
      {
        title: 'Điều Phối Lịch Thi Đấu & Sân Bãi Ban Trọng Tài (Court Allocation)',
        imgFile: 'app_17c_schedule.png',
        figTitle: 'Hình 3.17c – Giao Diện Di Động Lịch Thi Đấu & Điều Phối Sân Bãi Ban Trọng Tài',
        desc: 'Giao diện chuyên sâu quản lý lịch trình chi tiết theo từng cụm sân (Sân A1, Sân A2, Sân VIP), hiển thị thời gian bắt đầu, danh tính tổ trọng tài điều hành, mã màu phân biệt trạng thái trận đấu (Sắp diễn ra, Đang đấu, Đã kết thúc) và nút cập nhật biên bản trận đấu.'
      },
      {
        title: 'Bảng Xếp Hạng Điểm Số ELO & Bảng Tổng Sắp Huy Chương',
        imgFile: 'app_17d_elo.png',
        figTitle: 'Hình 3.17d – Giao Diện Di Động Bảng Xếp Hạng Điểm Số ELO & Huy Chương Thể Thao',
        desc: 'Bảng xếp hạng tổng hợp danh hiệu của các câu lạc bộ doanh nghiệp, tính toán điểm số thắng/hòa/thua, hiệu số bàn thắng bại và hệ số ELO lũy tiến theo thời gian thực; tôn vinh Top 3 đội mạnh nhất nhận cúp vô địch.'
      }
    ]
  },
  {
    id: 18,
    subCode: '2.3.3.18',
    name: 'Phân hệ Giải Chạy Bộ ViOne Run Marathon & Chip Timing RFID Di Động',
    shortTitle: 'Giải Chạy ViOne Run & Chip Timing RFID Di Động',
    imgFile: 'app_18_run.png',
    figTitle: 'Hình 3.18 – Giao Diện Di Động Giải Chạy ViOne Run & Chip Timing RFID',
    generalDesc: 'Phân hệ chuyên biệt dành cho các giải chạy bộ Marathon cộng đồng doanh nhân (cự ly 5km, 10km, 21km Bán Marathon, 42.195km Marathon toàn phần). Tích hợp số BIB điện tử, bản đồ lộ trình cung đường GPS Track có độ dốc trắc dọc, kết nối giải mã dữ liệu thảm đo thời gian Chip Timing RFID UHF 860-960MHz, bảng xếp hạng Finisher và cấp chứng nhận hoàn thành e-Certificate có chữ ký số.',
    features: [
      {
        name: 'Thẻ vận động viên số hóa kèm số BIB độc quyền (Electronic BIB Passport)',
        desc: 'Hiển thị số BIB nổi bật (Ví dụ: VNE-42-088), cự ly thi đấu, nhóm tuổi, thông tin y tế khẩn cấp (nhóm máu, dị ứng) và mã QR tra cứu thành tích cá nhân.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Giải mã tín hiệu thảm đo thời gian Chip Timing RFID UHF siêu nhạy',
        desc: 'Được thiết kế để tích hợp luồng dữ liệu từ các bộ đọc RFID Impinj / Zebra gắn tại vạch xuất phát, các mốc Checkpoint (5km, 10km, 21km) và vạch đích; hệ thống tính toán chính xác tuyệt đối cả thời gian súng xuất phát (Gun Time) và thời gian thực tế qua vạch (Net Time) với độ trễ ghi nhận dưới 10ms.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Bản đồ số cung đường chạy GPS Track & Đồ thị trắc dọc độ dốc (Elevation Profile)',
        desc: 'Hiển thị bản đồ đường chạy vệ tinh chuẩn xác, đánh dấu các trạm y tế, trạm tiếp nước giải khát, các mốc thời gian giới hạn (Cut-off Time) và biểu đồ trắc dọc độ cao địa hình giúp VĐV phân phối sức bền khoa học.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Bảng tổng sắp Finisher Leaderboard và Phân tích tốc độ Pace chi tiết',
        desc: 'Tự động tính toán tốc độ trung bình (Pace min/km), nhịp bước chân (Cadence) và thứ hạng tổng/thứ hạng lứa tuổi ngay khi VĐV chạm vạch đích; người thân ở nhà có thể nhập số BIB để theo dõi bước chạy trực tiếp.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Chứng nhận hoàn thành điện tử e-Certificate và Tìm ảnh AI theo số BIB',
        desc: 'Tự động tạo tệp chứng nhận hoàn thành giải chạy e-Certificate có dấu chứng nhận số, cho phép tải về máy chia sẻ mạng xã hội; tích hợp công nghệ AI OCR tự động gom toàn bộ ảnh chụp nhiếp ảnh gia trên đường chạy theo số BIB của VĐV.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "ViOne Run" trên menu điều phối nổi VActionSheet 3D.',
      'Bước 2: Quan sát số BIB cá nhân, cự ly thi đấu và nhấn xem bản đồ lộ trình cung đường GPS.',
      'Bước 3: Khi bắt đầu chạy, thảm RFID tự động ghi nhận giờ xuất phát và giờ cán mốc từng checkpoint.',
      'Bước 4: Sau khi về đích, mở tab "Thành tích" để xem tốc độ Pace, thứ hạng và tải Giấy chứng nhận e-Certificate.'
    ],
    subScreens: [
      {
        title: 'Trạm Thu Thập Tín Hiệu Thảm Đo Thời Gian Chip Timing RFID',
        imgFile: 'app_18b_rfid_timing.png',
        figTitle: 'Hình 3.18b – Giao Diện Di Động Trạm Thu Thập Dữ Liệu Thảm Đo Chip Timing RFID',
        desc: 'Màn hình giám sát kỹ thuật của Ban Trọng tài đo thời gian giải chạy: Theo dõi trực tiếp số lượng chip RFID UHF vừa quét qua vạch xuất phát, điểm quay đầu Checkpoint và vạch đích; hiển thị danh sách VĐV vừa cán thảm kèm chỉ số Gun Time và Net Time cực kỳ chuẩn xác.'
      },
      {
        title: 'Bản Đồ Lộ Trình Cung Đường GPS Track & Độ Dốc Trắc Dọc',
        imgFile: 'app_18c_gps_route.png',
        figTitle: 'Hình 3.18c – Giao Diện Di Động Lộ Trình Cung Đường GPS Track & Độ Dốc Trắc Dọc',
        desc: 'Bản đồ vector địa hình phân giải cao thể hiện trọn vẹn lộ trình giải chạy marathon; tích hợp đồ thị trắc dọc biểu diễn độ cao mặt đường (m) theo từng kilômét, đánh dấu trạm cấp cứu y tế, trạm tiếp nước điện giải và các điểm kiểm tra giờ quy định Cut-off.'
      },
      {
        title: 'Bảng Tổng Sắp Finisher, Phân Tích Pace & Chứng Nhận e-Certificate',
        imgFile: 'app_18d_finisher_bxh.png',
        figTitle: 'Hình 3.18d – Giao Diện Di Động Bảng Tổng Sắp Finisher & Chứng Nhận e-Certificate',
        desc: 'Bảng vàng vinh danh toàn bộ các vận động viên đã hoàn thành xuất sắc cự ly marathon; cho phép tra cứu theo số BIB hoặc họ tên để tải tấm chứng nhận e-Certificate thiết kế dập nổi vàng hoàng gia có chữ ký điện tử của Ban Tổ chức.'
      }
    ]
  },
  {
    id: 19,
    subCode: '2.3.3.19',
    name: 'Phân hệ Khám Phá Bảo Tàng Số 3D & Thuyết Minh 1-Chạm NFC ViOne Museum',
    shortTitle: 'Bảo Tàng Số 3D & Thuyết Minh 1-Chạm NFC ViOne Museum',
    imgFile: 'app_19_museum.png',
    figTitle: 'Hình 3.19 – Giao Diện Di Động Bảo Tàng Số 3D & Thuyết Minh NFC ViOne Museum',
    generalDesc: 'Phân hệ chuyển đổi số di sản bảo tàng đỉnh cao, đưa không gian trưng bày hiện vật lịch sử văn hóa lên màn hình smartphone. Hỗ trợ hiển thị mô hình 3D WebGL siêu nét (Trống đồng Ngọc Lũ, Thạp đồng Đào Thịnh, Ngai vàng triều Nguyễn), tương tác xoay lật 360 độ, kích hoạt thuyết minh tự động qua công nghệ chạm 1-Tap NFC tại tủ trưng bày, trình phát Audio Guide 4 ngôn ngữ và niên biểu lịch sử khảo cổ học.',
    features: [
      {
        name: 'Không gian trưng bày 3D WebGL với mô hình hiện vật siêu thực',
        desc: 'Ứng dụng công nghệ quét 3D Photogrammetry hàng ngàn bức ảnh góc chụp, tái tạo mô hình cổ vật với độ chi tiết hàng triệu đa giác (Polygons) và vân bề mặt PBR (Physically Based Rendering), cho phép quan sát sắc nét từng đường rãnh hoa văn cổ.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Tương tác xoay lật 360 độ và điểm chạm thông tin tương tác (Hotspots)',
        desc: 'Người dùng dùng ngón tay xoay tròn hiện vật theo mọi phương vị trong không gian 3 chiều; chạm vào các điểm chú giải Hotspot phát sáng trên thân cổ vật để mở pop-up giải thích ý nghĩa biểu tượng lịch sử.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Kích hoạt bài thuyết minh tự động 1-chạm NFC tại quầy hiện vật',
        desc: 'Khi tham quan trực tiếp tại bảo tàng, du khách chỉ cần chạm điện thoại vào tem chip NFC NDEF (NTAG213/215) gắn trên tủ kính hiện vật; ứng dụng tự động mở ngay trang thông tin và bắt đầu phát bài thuyết minh âm thanh mà không cần tìm kiếm thủ công.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Trình phát thuyết minh Audio Guide đa ngữ 4 thứ tiếng (VI, EN, FR, JA)',
        desc: 'Cung cấp bài thuyết minh âm thanh chuyên nghiệp với 4 ngôn ngữ: Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Nhật; tích hợp phụ đề chạy chữ đồng bộ (Synchronized Transcript), điều chỉnh tốc độ đọc và sóng âm thanh sinh động.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Niên biểu lịch sử khảo cổ học và quét mã QR hiện vật nhanh',
        desc: 'Trục dòng thời gian lịch sử tương tác từ thời kỳ Văn hóa Đông Sơn, thời Lý - Trần, thời Hậu Lê đến triều Nguyễn; tích hợp camera quét mã QR đặt tại chân đế bảo vật để tra cứu nhanh thông số khoa học.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      }
    ],
    steps: [
      'Bước 1: Chạm vào biểu tượng "Bảo tàng 3D ViOne Museum" trên menu điều phối VActionSheet 3D.',
      'Bước 2: Lựa chọn hiện vật trong danh mục bảo vật quốc gia hoặc chạm điện thoại vào tem NFC tại quầy.',
      'Bước 3: Dùng ngón tay vuốt xoay 360 độ cổ vật 3D trên màn hình, phóng to để ngắm hoa văn chạm khắc.',
      'Bước 4: Nhấn nút phát "Audio Guide", lựa chọn ngôn ngữ thuyết minh để lắng nghe câu chuyện lịch sử hào hùng.'
    ],
    subScreens: [
      {
        title: 'Khám Phá Cổ Vật Xoay Lật 360 Độ & Điểm Tương Tác Hotspot',
        imgFile: 'app_19b_museum_360.png',
        figTitle: 'Hình 3.19b – Giao Diện Di Động Xoay Lật 360 Độ & Điểm Chạm Chú Giải Hotspot',
        desc: 'Giao diện tương tác 3 chiều mô phỏng hoàn mỹ cổ vật Trống đồng Ngọc Lũ và Thạp đồng Đào Thịnh; người dùng có thể xoay tự do theo trục không gian, chạm vào các vòng hoa văn chim hạc, cảnh giã gạo để xem thuyết minh ý nghĩa văn hóa thời tiền sử.'
      },
      {
        title: 'Trình Phát Thuyết Minh Tự Động Audio Guide Đa Ngữ 4 Thứ Tiếng',
        imgFile: 'app_19c_audio_guide.png',
        figTitle: 'Hình 3.19c – Giao Diện Di Động Trình Phát Thuyết Minh Tự Động Audio Guide',
        desc: 'Bộ phát âm thanh kỹ thuật số cao cấp hỗ trợ 4 ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Nhật); hiển thị lời thuyết minh chạy chữ karaoke đồng bộ theo giọng đọc của thuyết minh viên bảo tàng quốc gia kèm đồ thị sóng âm thanh trực quan.'
      },
      {
        title: 'Niên Biểu Khảo Cổ Học Lịch Sử & Tra Cứu Mã QR Hiện Vật',
        imgFile: 'app_19d_timeline_qr.png',
        figTitle: 'Hình 3.19d – Giao Diện Di Động Niên Biểu Khảo Cổ Học & Tra Cứu Mã QR Hiện Vật',
        desc: 'Trục niên biểu lịch sử số hóa xuyên suốt hàng ngàn năm dựng nước và giữ nước; hỗ trợ bộ lọc theo các triều đại lịch sử và tích hợp camera quét nhanh mã QR gắn tại chân đế tủ trưng bày.'
      }
    ]
  },
  {
    id: 20,
    subCode: '2.3.3.20',
    name: 'Phân hệ Khám Phá Di Sản Văn Hóa & Bản Đồ Số Di Tích Lịch Sử ViOne Heritage',
    shortTitle: 'Di Sản Văn Hóa & Bản Đồ Di Tích ViOne Heritage',
    imgFile: 'app_20_heritage.png',
    figTitle: 'Hình 3.20 – Giao Diện Di Động Di Sản Văn Hóa & Bản Đồ Di Tích ViOne Heritage',
    generalDesc: 'Phân hệ đồng hành cùng hành trình khám phá và bảo tồn di sản văn hóa dân tộc. Cung cấp bản đồ số GIS định vị các di tích lịch sử và danh lam thắng cảnh UNESCO xung quanh du khách, công nghệ định vị vệ tinh GPS Geofencing tự động phát bài thuyết minh khi bước vào bán kính 20 mét quanh di tích, kính lúp điện tử Deep Zoom xem chi tiết văn bản sắc phong triều Nguyễn phục chế số kèm bản dịch Hán Nôm, các tuyến du lịch di sản chuyên đề và Hộ chiếu Di sản số.',
    features: [
      {
        name: 'Bản đồ số GIS định vị di tích lịch sử văn hóa & Di sản UNESCO',
        desc: 'Bản đồ tương tác đa tầng hiển thị vị trí các di tích quốc gia đặc biệt (Hoàng thành Thăng Long, Cố đô Huế, Phố cổ Hội An, Quần thể Tràng An...) kèm khoảng cách thực tế, chỉ đường di chuyển và chỉ số thời tiết hiện tại.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Tự động phát thuyết minh qua vệ tinh GPS Geofencing bán kính 20 mét',
        desc: 'Module chạy ngầm liên tục tính toán khoảng cách giữa vị trí GPS của người dùng và tọa độ di tích theo công thức Haversine; ngay khi du khách bước qua cổng di tích trong bán kính 20m, ứng dụng tự động rung nhẹ và phát bài giới thiệu văn hóa tự động.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Kính lúp điện tử Deep Zoom & Bản dịch nghĩa Sắc phong Hán Nôm',
        desc: 'Công nghệ phân giải đa tầng Deep Zoom cho phép phóng to gấp 20 lần ngắm từng nét bút lông, con dấu ngự tỷ của các hoàng đế triều Nguyễn (Gia Long, Minh Mạng, Tự Đức...); chạm vào từng dòng chữ Hán để xem phiên âm Hán - Việt và bản dịch nghĩa tiếng Việt hiện đại.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A05 – Thuyết minh viên & Cán bộ bảo tàng'
      },
      {
        name: 'Tuyến du lịch di sản chuyên đề và Lộ trình tham quan thông minh (Curated Heritage Tours)',
        desc: 'Cung cấp các lộ trình khám phá văn hóa được thiết kế khoa học: "Hành trình Kinh đô cổ", "Con đường Di sản miền Trung", "Dấu ấn Thăng Long ngàn năm"; hiển thị tổng thời gian dự kiến, cự ly và gợi ý các điểm dừng chân đặc sản địa phương.',
        actorMain: 'A01 – Khách truy cập vãng lai',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Hộ chiếu Di sản Số (Digital Heritage Passport) và Đóng góp công đức số qua VNPay',
        desc: 'Mỗi lần du khách check-in tại một di tích lịch sử, hệ thống đóng một con dấu số kỷ niệm (Digital Stamp) vào Hộ chiếu Di sản cá nhân; tích hợp nút "Công đức số" cho phép du khách đóng góp kinh phí tu bổ di tích minh bạch qua VNPay-QR.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Di sản văn hóa ViOne Heritage" trên menu điều phối nổi VActionSheet 3D.',
      'Bước 2: Mở bản đồ di tích để tìm kiếm các điểm di sản văn hóa lịch sử nằm gần vị trí của bạn.',
      'Bước 3: Chạm vào một di tích để xem tư liệu sắc phong Hán Nôm phục chế và dùng kính lúp Deep Zoom.',
      'Bước 4: Bật chế độ "GPS Geofencing" để điện thoại tự động phát bài thuyết minh khi bạn bước vào cổng di tích.'
    ],
    subScreens: [
      {
        title: 'Bán Kính Định Vị Vệ Tinh GPS Geofencing 20m Tự Động Thuyết Minh',
        imgFile: 'app_20b_geofencing.png',
        figTitle: 'Hình 3.20b – Giao Diện Di Động Định Vị Vệ Tinh GPS Geofencing 20m',
        desc: 'Màn hình mô phỏng thuật toán hàng rào địa lý GPS Geofencing: Hiển thị radar bán kính an toàn 20 mét quanh di tích lịch sử, biểu thị tọa độ vĩ độ/kinh độ chính xác và thanh trạng thái tự động kích hoạt bài phát âm thanh khi người dùng bước vào vùng ranh giới di tích.'
      },
      {
        title: 'Kính Lúp Điện Tử Deep Zoom & Bản Dịch Sắc Phong Triều Nguyễn',
        imgFile: 'app_20c_sacphong.png',
        figTitle: 'Hình 3.20c – Giao Diện Di Động Kính Lúp Điện Tử Deep Zoom Sắc Phong Cổ',
        desc: 'Công nghệ phóng to đa tầng Deep Zoom hiển thị từng sợi giấy dó cổ và dấu triện son đỏ của Hoàng đế Minh Mạng; người dùng có thể nhấp chọn từng dòng văn tự chữ Hán để xem phiên âm Hán - Việt chuẩn xác kèm bản dịch nghĩa văn chương thuần Việt.'
      },
      {
        title: 'Tuyến Tham Quan Di Sản Chuyên Đề & Hộ Chiếu Văn Hóa Số',
        imgFile: 'app_20d_tours.png',
        figTitle: 'Hình 3.20d – Giao Diện Di Động Tuyến Tham Quan Di Sản & Hộ Chiếu Văn Hóa Số',
        desc: 'Danh mục các lộ trình tham quan văn hóa được biên soạn chuyên nghiệp; tích hợp cuốn sổ tay "Hộ chiếu Di sản Số" lưu giữ các huy hiệu tem số chứng nhận du khách đã đặt chân đến các địa danh lịch sử hào hùng của dân tộc Việt Nam.'
      }
    ]
  }
];

module.exports = {
  MOBILE_MODULES
};
