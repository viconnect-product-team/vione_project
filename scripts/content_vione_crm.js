// scripts/content_vione_crm.js
// 23 Phân hệ Cổng Web Quản Trị ViOne Platform (CRM) chi tiết chuẩn mực theo phong cách Uniwork

const CRM_MODULES = [
  {
    id: 1,
    subCode: '2.3.2.1',
    name: 'Phân hệ Đăng nhập Quản trị & Xác thực Đa tầng',
    shortTitle: 'Đăng nhập Quản trị & Xác thực Đa tầng',
    imgFile: 'crm_01_login.png',
    figTitle: 'Hình 2.1 – Giao Diện Đăng Nhập Cổng Web Quản Trị ViOne Platform',
    generalDesc: 'Phân hệ quản lý vòng đời truy cập và bảo mật cổng vào hệ thống điều hành Web Quản trị, bảo vệ dữ liệu doanh nghiệp thông qua cơ chế xác thực danh tính đa lớp (MFA/TOTP), chống tấn công dò quét mật khẩu Brute Force và quản lý phiên làm việc bảo mật cao (Session Timeout). Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Đăng nhập tài khoản quản trị bảo mật',
        desc: 'Cho phép người dùng nhập địa chỉ email doanh nghiệp và mật khẩu; hệ thống kiểm tra đối chiếu băm Argon2/Bcrypt trong CSDL, kiểm tra cờ khóa tài khoản và thiết lập phiên làm việc qua HTTP-only Cookie và JWT Token.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Xác thực hai lớp (2FA / TOTP)',
        desc: 'Yêu cầu nhập mã khóa biến đổi 6 chữ số theo chuẩn RFC 6238 từ ứng dụng Google Authenticator hoặc tin nhắn xác thực trước khi cấp quyền truy cập vào các phân hệ tài chính và cấu hình hệ thống.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Khôi phục mật khẩu qua liên kết xác thực',
        desc: 'Người dùng yêu cầu gửi liên kết đặt lại mật khẩu về email định danh; token đặt lại mật khẩu có thời hạn 15 phút và tự động hủy sau một lần sử dụng thành công.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Giám sát phiên làm việc và khóa chống brute-force',
        desc: 'Hệ thống tự động ghi nhận địa chỉ IP, User-Agent trình duyệt và khóa tạm thời tài khoản trong 30 phút nếu đăng nhập sai quá 5 lần liên tiếp; tự động đăng xuất sau 15 phút không tương tác.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Truy cập đường dẫn chính thức của Cổng Web Quản Trị ViOne Platform: https://crm_vione.viconnect.vn.',
      'Bước 2: Nhập thông tin Email tài khoản quản trị viên và Mật khẩu đăng nhập hợp lệ.',
      'Bước 3: Nhập mã xác thực hai lớp TOTP (6 chữ số) nếu tài khoản đã kích hoạt bảo mật 2FA.',
      'Bước 4: Nhấn nút "Đăng nhập" để hệ thống kiểm tra quyền hạn RBAC và chuyển hướng vào Bảng điều khiển Tổng quan.'
    ]
  },
  {
    id: 2,
    subCode: '2.3.2.2',
    name: 'Phân hệ Bảng Điều Hành C-Level Dashboard & KPI Dòng Tiền Realtime',
    shortTitle: 'Bảng Điều Hành C-Level Dashboard & KPI Dòng Tiền',
    imgFile: 'crm_02_dashboard.png',
    figTitle: 'Hình 2.2 – Bảng Điều Hành C-Level Dashboard & KPI Dòng Tiền Realtime',
    generalDesc: 'Phân hệ cung cấp góc nhìn toàn cảnh về sức khỏe tài chính, vận hành, quy mô doanh nhân và các chỉ số kinh doanh sống còn của tổ chức doanh nghiệp trong thời gian thực. Tích hợp trực tiếp dữ liệu từ cổng thanh toán VNPay và máy chủ PostgreSQL. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Giám sát tổng doanh thu & KPI dòng tiền thực tế',
        desc: 'Tổng hợp số liệu doanh thu bán vé sự kiện, phí thường niên, doanh thu giao thương theo ngày, tuần, tháng với biểu đồ trực quan hóa dữ liệu dòng tiền và tốc độ tăng trưởng.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Theo dõi biến động số lượng doanh nhân & doanh nghiệp',
        desc: 'Thống kê tổng số lượng doanh nhân cá nhân, doanh nghiệp thành viên, tỷ lệ doanh nhân mới tham gia và tỷ lệ gia hạn thẻ định danh số theo chu kỳ.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Đồng bộ dữ liệu thời gian thực qua Socket.IO',
        desc: 'Lắng nghe các sự kiện giao dịch mới từ cổng thanh toán VNPay, lượt check-in sự kiện và phản hồi tức thì lên màn hình dashboard mà không cần người dùng tải lại trang.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay'
      },
      {
        name: 'Lọc dữ liệu đa chiều theo thời gian và phòng ban',
        desc: 'Cung cấp bộ lọc theo khoảng thời gian tùy chọn (Hôm nay, 7 ngày, 30 ngày, Quý, Năm) và phân rã báo cáo theo từng chi hội, nhóm ngành nghề hoặc khu vực địa lý.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Xuất báo cáo tổng quan định dạng Excel & PDF',
        desc: 'Tự động tổng hợp và kết xuất báo cáo thống kê KPI quản trị ra tệp bảng tính XLSX và PDF có đóng dấu số thời gian phục vụ các cuộc họp Hội đồng Quản trị.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Tổng quan" tại menu điều hướng thanh bên trái (Sidebar) của Cổng Web Quản Trị.',
      'Bước 2: Quan sát 4 khối thẻ KPI chính: Tổng Doanh Thu, Doanh Nhân Thực Tế, Sự Kiện Đang Chạy và Tỷ Lệ Tương Tác.',
      'Bước 3: Sử dụng bộ lọc thời gian ở góc trên cùng để chuyển đổi xem dữ liệu theo Tuần, Tháng hoặc Quý.',
      'Bước 4: Nhấn nút "Xuất báo cáo" nếu muốn tải tệp bảng tính thống kê chi tiết về máy tính.'
    ]
  },
  {
    id: 3,
    subCode: '2.3.2.3',
    name: 'Phân hệ Quản Trị Danh Sách Doanh Nghiệp & Hồ Sơ Doanh Nhân 360',
    shortTitle: 'Quản Trị Danh Sách Doanh Nghiệp & Hồ Sơ Doanh Nhân 360',
    imgFile: 'crm_03_customers.png',
    figTitle: 'Hình 2.3 – Quản Lý Danh Sách Khách Hàng B2B & Hồ Sơ Doanh Nhân 360',
    generalDesc: 'Phân hệ quản lý toàn bộ cơ sở dữ liệu hồ sơ pháp nhân doanh nghiệp, doanh nhân, thông tin định danh KYC, lịch sử tương tác, cấp độ doanh nhân (VIP, Kim Cương, Vàng, Tiêu chuẩn) và danh thiếp số vCard tích hợp. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Tra cứu và lọc hồ sơ doanh nghiệp thông minh',
        desc: 'Tìm kiếm nhanh doanh nhân theo họ tên, số điện thoại, tên công ty, mã số thuế hoặc phân loại ngành nghề kinh doanh thông qua thanh tìm kiếm toàn cục.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Hồ sơ doanh nhân 360 độ (Customer 360 View)',
        desc: 'Xem chi tiết thẻ căn cước số doanh nhân: ảnh đại diện, chức vụ, tiểu sử, thông tin liên hệ, danh mục sản phẩm cung ứng, lịch sử tham gia sự kiện và lịch sử thanh toán.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Cấp duyệt và quản lý hạn thẻ doanh nhân số',
        desc: 'Phê duyệt hồ sơ đăng ký gia nhập, thay đổi trạng thái hoạt động (Đang hoạt động, Tạm ngừng, Hết hạn), gia hạn ngày hiệu lực và chỉ định cấp bậc thẻ VIP.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Nhập xuất danh sách doanh nhân hàng loạt qua Excel',
        desc: 'Hỗ trợ nạp dữ liệu hàng trăm doanh nghiệp từ file mẫu Excel .xlsx chuẩn hóa; đồng thời xuất toàn bộ danh bạ doanh nhân có phân loại phục vụ công tác kết nối giao thương.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Cấp mã định danh số vCard và URL công khai',
        desc: 'Tự động tạo mã QR định danh cá nhân và đường dẫn trang Profile cá nhân duy nhất (https://vione.viconnect.vn/u/[slug]) cho mỗi doanh nhân để chia sẻ qua NFC.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Điều hướng tới mục "Khách hàng / Doanh nhân" trên thanh điều hướng bên trái.',
      'Bước 2: Sử dụng ô tìm kiếm để lọc doanh nhân theo tên công ty, số điện thoại hoặc mã định danh.',
      'Bước 3: Nhấp vào một bản ghi cụ thể để mở ngăn kéo chi tiết (Drawer) hiển thị Hồ sơ 360 độ của doanh nhân.',
      'Bước 4: Nhấn nút "Chỉnh sửa" để cập nhật thông tin cấp bậc, hạn thẻ hoặc "Xuất thẻ vCard" khi cần phát hành.'
    ]
  },
  {
    id: 4,
    subCode: '2.3.2.4',
    name: 'Phân hệ Quản Trị Cơ Hội Kinh Doanh & Phễu Bán Hàng B2B Deals',
    shortTitle: 'Quản Trị Cơ Hội Kinh Doanh & Phễu Bán Hàng B2B Deals',
    imgFile: 'crm_04_deals.png',
    figTitle: 'Hình 2.4 – Quản Lý Cơ Hội Kinh Doanh & Phễu Bán Hàng B2B Deals',
    generalDesc: 'Phân hệ quản trị toàn diện quy trình kết nối xúc tiến thương mại, quản lý các cơ hội kinh doanh (Deals) theo dạng phễu bán hàng đa giai đoạn (Pipeline Stages), theo dõi giá trị hợp đồng giao thương và đo lường hiệu quả kết nối mạng lưới B2B. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Trực quan hóa phễu bán hàng Kanban đa giai đoạn',
        desc: 'Hiển thị các cơ hội kinh doanh theo các cột trạng thái: Tiềm năng (Lead), Đã liên hệ (Contacted), Đang đàm phán (Negotiation), Đã chốt thành công (Won) và Thất bại (Lost).',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Kéo thả cập nhật trạng thái cơ hội (Drag & Drop)',
        desc: 'Hỗ trợ thao tác kéo thả trực quan thẻ cơ hội giữa các giai đoạn; hệ thống tự động ghi nhật ký thời gian và tính toán lại tổng giá trị hợp đồng của từng cột trạng thái.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tạo mới và quản lý giá trị hợp đồng giao thương',
        desc: 'Thiết lập cơ hội kinh doanh mới bao gồm: Tên cơ hội, Doanh nghiệp đối tác, Giá trị dự kiến (VNĐ), Người phụ trách và Ngày dự kiến ký kết.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Ghi chú lịch sử đàm phán & Đính kèm tài liệu',
        desc: 'Lưu trữ toàn bộ dòng thời gian tương tác: biên bản cuộc họp, hợp đồng nháp, báo giá PDF và nhắc hẹn lịch chăm sóc đối tác tự động.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Báo cáo tỷ lệ chuyển đổi và tổng giá trị giao dịch',
        desc: 'Thống kê tỷ lệ thắng thầu (Win Rate), thời gian trung bình đóng một thương vụ và bảng xếp hạng những thành viên có giá trị giao thương lớn nhất trong mạng lưới.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      }
    ],
    steps: [
      'Bước 1: Truy cập mục "Cơ hội kinh doanh / Deals" trên menu Cổng Web Quản Trị.',
      'Bước 2: Xem tổng quan các cột giai đoạn phễu bán hàng và tổng giá trị dòng tiền tương ứng mỗi cột.',
      'Bước 3: Nhấp nút "Tạo cơ hội mới", điền thông tin đối tác, sản phẩm quan tâm và giá trị hợp đồng dự kiến.',
      'Bước 4: Kéo thả thẻ cơ hội sang cột "Đã ký kết" khi thương vụ hoàn tất để ghi nhận doanh thu vào nền tảng ViOne Platform.'
    ]
  },
  {
    id: 5,
    subCode: '2.3.2.5',
    name: 'Phân hệ Quản Trị Danh Thiếp Thông Minh VIP vCard & Mã QR Động',
    shortTitle: 'Quản Trị Danh Thiếp Thông Minh VIP vCard & Mã QR Động',
    imgFile: 'crm_05_cards.png',
    figTitle: 'Hình 2.5 – Quản Lý Danh Thiếp Thông Minh vCard & Mã QR Động ViOne',
    generalDesc: 'Phân hệ quản trị kho danh thiếp điện tử của toàn bộ lãnh đạo doanh nghiệp thành viên, cung cấp bộ công cụ tùy biến giao diện thẻ số chuẩn sang trọng (Obsidian Gold), tạo mã QR động dẫn liên kết và ghi nhận lượt chạm thẻ NFC. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Quản lý kho mẫu thiết kế danh thiếp điện tử',
        desc: 'Cấu hình các bộ template danh thiếp: Doanh nhân Hoàng Gia (Champagne Gold), Thạch Anh Đen (Obsidian Dark), Doanh nghiệp Hiện Đại, hỗ trợ xem trước (Live Preview).',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Sinh mã QR động chống sao chép và tải định dạng cao',
        desc: 'Mã QR chứa đường dẫn định danh bảo mật có mã băm xác thực; hỗ trợ tải mã QR dạng ảnh PNG độ phân giải 4K hoặc SVG vector phục vụ in ấn ấn phẩm vật lý.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Liên kết thẻ chip vật lý 1-chạm NFC',
        desc: 'Gán mã UID phần cứng của thẻ NFC vật lý (NTAG213, NTAG215) với tài khoản định danh số của doanh nhân; quản lý lịch sử đọc thẻ và cho phép khóa thẻ từ xa khi bị thất lạc.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Thống kê lượt xem và lưu danh bạ điện thoại',
        desc: 'Ghi nhận số lượt khách quét mã QR, số lượt tải tệp vCard .vcf về danh bạ điện thoại smartphone, thống kê biểu đồ lượt truy cập theo thời gian.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Danh thiếp số / vCard" trên thanh điều hướng bên trái.',
      'Bước 2: Tìm kiếm doanh nhân cần quản lý và nhấp vào biểu tượng "Tùy biến thẻ".',
      'Bước 3: Chọn giao diện Vàng Hoàng Gia hoặc Đen Thạch Anh và bật/tắt các trường thông tin cần hiển thị.',
      'Bước 4: Nhấn nút "Tải mã QR" hoặc "Gán thẻ NFC" để xuất thông tin phục vụ in ấn hoặc ghi chip vật lý.'
    ]
  },
  {
    id: 6,
    subCode: '2.3.2.6',
    name: 'Phân hệ Quản Trị Sàn Giao Thương B2B & Gian Hàng Sản Phẩm Doanh Nghiệp',
    shortTitle: 'Quản Trị Sàn Giao Thương B2B & Gian Hàng Sản Phẩm',
    imgFile: 'crm_06_marketplace.png',
    figTitle: 'Hình 2.6 – Quản Trị Sàn Giao Thương B2B & Gian Hàng Sản Phẩm Doanh Nghiệp',
    generalDesc: 'Phân hệ số hóa danh mục sản phẩm, giải pháp và dịch vụ chủ lực của các doanh nghiệp thành viên, tạo lập không gian triển lãm số B2B kết nối giao thương giữa các doanh nhân trong và ngoài mạng lưới. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Kiểm duyệt và đăng tải sản phẩm B2B',
        desc: 'Ban quản trị tiếp nhận, kiểm duyệt nội dung, hình ảnh, hồ sơ chứng nhận chất lượng (ISO, OCOP, GMP) và phê duyệt hiển thị sản phẩm lên sàn giao thương.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Quản lý bảng giá niêm yết và chiết khấu nội bộ',
        desc: 'Thiết lập hai tầng giá: Giá công khai dành cho khách hàng bên ngoài và Giá ưu đãi đặc quyền (B2B Discount) dành riêng cho các doanh nhân chính thức.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Phân loại ngành hàng và tìm kiếm đa tiêu chí',
        desc: 'Tổ chức cây danh mục ngành hàng: Công nghệ, Sản xuất, Bất động sản, Dịch vụ tài chính, Nông nghiệp sạch; hỗ trợ bộ lọc theo khoảng giá và khu vực địa lý.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Tiếp nhận và điều phối yêu cầu báo giá (RFQ)',
        desc: 'Ghi nhận các yêu cầu báo giá từ khách hàng tiềm năng, tự động chuyển thông tin về hộp thư nội bộ của doanh nghiệp cung ứng và cảnh báo qua Zalo OA.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Thống kê tương tác và lượt kết nối gian hàng',
        desc: 'Đo lường số lượt xem sản phẩm, số lượt click liên hệ Zalo/Hotline của doanh nghiệp, giúp đánh giá mức độ quan tâm của thị trường đối với sản phẩm.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Sàn giao thương / Marketplace" trên thanh menu Cổng Web Quản Trị.',
      'Bước 2: Xem danh sách các sản phẩm đang chờ duyệt, nhấp vào sản phẩm để kiểm tra hình ảnh và pháp lý.',
      'Bước 3: Nhấn "Phê duyệt" để xuất bản sản phẩm lên ứng dụng di động ViOne và cổng web công khai.',
      'Bước 4: Thiết lập tỷ lệ chiết khấu kết nối doanh nghiệp nếu là sản phẩm ưu đãi độc quyền của chi hội.'
    ]
  },
  {
    id: 7,
    subCode: '2.3.2.7',
    name: 'Phân hệ Quản Trị Sự Kiện Doanh Nhân & Phân Hạng Vé Bán Qua VNPay',
    shortTitle: 'Quản Trị Sự Kiện Doanh Nhân & Bán Vé VNPay',
    imgFile: 'crm_07_events.png',
    figTitle: 'Hình 2.7 – Quản Trị Sự Kiện Doanh Nhân & Phân Hạng Vé Bán Qua VNPay',
    generalDesc: 'Phân hệ khởi tạo, cấu hình và điều phối toàn bộ vòng đời các sự kiện hội nghị, tọa đàm xúc tiến thương mại, gala doanh nhân, giải đấu thể thao; quản lý phân hạng vé và tích hợp cổng thanh toán trực tuyến an toàn VNPay. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Khởi tạo và biên tập nội dung sự kiện chuyên nghiệp',
        desc: 'Thiết lập tiêu đề sự kiện, diễn giả C-Level, địa điểm tổ chức, thời gian bắt đầu/kết thúc, hình ảnh banner truyền thông chuẩn 16:9 và lịch trình chi tiết.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Cấu hình phân hạng vé và hạn mức số lượng',
        desc: 'Thiết lập các loại vé: Vé VIP (khu vực hàng đầu, tiệc thân mật), Vé Tiêu chuẩn, Vé Miễn phí; giới hạn số vé tối đa cho từng hạng vé để tránh quá tải hội trường.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Tích hợp cổng thanh toán trực tuyến VNPay',
        desc: 'Hỗ trợ thanh toán tự động qua cổng VNPay-QR, thẻ ATM nội địa, thẻ quốc tế Visa/Mastercard; tự động kích hoạt vé và cập nhật trạng thái đơn hàng ngay khi nhận tín hiệu IPN.',
        actorMain: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Gửi vé điện tử kèm mã QR qua Zalo OA',
        desc: 'Sau khi thanh toán thành công, hệ thống tự động gửi tin nhắn Zalo ZNS chứa liên kết mở vé QR điện tử có đóng dấu thời gian bảo mật tới số điện thoại đại biểu.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Báo cáo doanh thu bán vé và danh sách đại biểu',
        desc: 'Tổng hợp doanh thu bán vé realtime, xuất danh sách đại biểu đã đăng ký kèm chức vụ, tên công ty và số điện thoại phục vụ công tác in thẻ đeo và lễ tân.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Sự kiện / Events" trên menu Cổng Web Quản Trị.',
      'Bước 2: Nhấn nút "Tạo sự kiện mới", điền thông tin chủ đề, diễn giả, thời gian và địa điểm tổ chức.',
      'Bước 3: Nhấp tab "Cấu hình vé" để thêm các hạng vé VIP/Standard, đặt đơn giá và số lượng vé phát hành.',
      'Bước 4: Nhấn "Xuất bản" để mở cổng đăng ký trực tuyến trên App ViOne và tự động kích hoạt cổng VNPay.'
    ]
  },
  {
    id: 8,
    subCode: '2.3.2.8',
    name: 'Phân hệ Quản Trị Cổng Soát Vé Điện Tử & Check-in QR Siêu Tốc <100ms',
    shortTitle: 'Cổng Soát Vé Điện Tử & Check-in QR Siêu Tốc',
    imgFile: 'crm_08_checkin.png',
    figTitle: 'Hình 2.8 – Cổng Soát Vé Điện Tử & Điểm Danh Check-in QR Realtime',
    generalDesc: 'Phân hệ quản trị vận hành công tác đón tiếp đại biểu tại cửa hội trường, giải quyết triệt để bài toán ùn tắc tại các sự kiện quy mô lớn thông qua công nghệ quét mã QR siêu tốc với thời gian phản hồi dưới 100ms và chế độ dự phòng Offline. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Giao diện quét vé QR trực tiếp qua Camera Web và Máy quét chuyên dụng',
        desc: 'Hỗ trợ nhận diện mã QR vé từ camera máy tính xách tay hoặc máy quét mã vạch 2D cầm tay không dây chuẩn USB HID tốc độ cao.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Giải mã và xác thực mã vé tức thì <100ms',
        desc: 'Giải mã token AES-256 động của mã vé, kiểm tra tính hợp lệ, trạng thái đã thanh toán và kiểm tra tránh quét trùng lặp vé (Anti-Passback) trong dưới 100ms.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Cơ chế hoạt động ngoại tuyến Offline Check-in',
        desc: 'Tự động tải trước danh sách mã vé vào bộ nhớ đệm trình duyệt (IndexedDB); khi hội trường bị đứt cáp mạng, hệ thống vẫn tiếp tục quét vé bình thường và tự đồng bộ khi có mạng.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Bảng điều phối sĩ số hội trường thời gian thực',
        desc: 'Hiển thị tỷ lệ phần trăm đại biểu đã đến hội trường theo từng phân hạng vé (Ví dụ: 185/200 VIP - 92.5%); cảnh báo khi khách VIP vừa quét vé qua cửa.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Tích hợp màn hình LED chào mừng đại biểu tự động',
        desc: 'Khi vé được quét thành công, hệ thống phát tín hiệu WebSocket sang màn hình LED lớn tại sảnh để hiện thông điệp: "Nhiệt liệt chào mừng Ông/Bà [Họ tên] - [Chức vụ]".',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Soát vé / Check-in" trên menu Cổng Web Quản Trị.',
      'Bước 2: Chọn sự kiện đang diễn ra và cho phép trình duyệt truy cập Camera hoặc cắm máy quét mã QR.',
      'Bước 3: Hướng camera vào mã QR trên điện thoại của đại biểu; hệ thống phát tiếng "Bíp" và hiện tích xanh.',
      'Bước 4: Quan sát số liệu sĩ số đại biểu cập nhật tức thời trên biểu đồ tỷ lệ tham dự realtime.'
    ]
  },
  {
    id: 9,
    subCode: '2.3.2.9',
    name: 'Phân hệ Quản Trị Quy Trình Vận Hành BPMN 2.0 & Bảng Việc Kanban',
    shortTitle: 'Quy Trình Vận Hành BPMN 2.0 & Bảng Việc Kanban',
    imgFile: 'crm_09_workflow.png',
    figTitle: 'Hình 2.9 – Quản Trị Quy Trình Vận Hành BPMN 2.0 & Bảng Việc Kanban',
    generalDesc: 'Phân hệ quản trị luồng quy trình làm việc tự động hóa trong tổ chức, phân rã công việc cho các bộ phận, theo dõi tiến độ từng đầu việc (Tasks) qua bảng Kanban trực quan và giám sát hạn chót (Deadline) tránh trễ việc. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Thiết kế quy trình vận hành tự động BPMN 2.0',
        desc: 'Cho phép tạo lập các luồng phê duyệt: Phê duyệt mua sắm, Quy trình tổ chức sự kiện, Quy trình tiếp nhận doanh nhân mới với các nút điều kiện rẽ nhánh logic.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Bảng việc Kanban phân loại theo tiến độ công việc',
        desc: 'Quản lý thẻ công việc theo các cột: Cần làm (To Do), Đang thực hiện (In Progress), Đang duyệt (In Review) và Hoàn thành (Done) có kéo thả mượt mà.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Phân công nhân sự phụ trách và giám sát tiến độ',
        desc: 'Giao việc cho từng cán bộ, đính kèm mô tả chi tiết, danh sách tiêu chí nghiệm thu (Checklist), tài liệu biểu mẫu và đặt mức độ ưu tiên (Khẩn cấp, Cao, Bình thường).',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Cảnh báo hạn chót và thông báo trễ hạn',
        desc: 'Tự động gửi thông báo đẩy và nhắc lịch trước 24 giờ khi đến hạn chót; tô đỏ các thẻ công việc bị chậm tiến độ trên bảng Kanban để người quản lý can thiệp kịp thời.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Lưu trữ nhật ký trao đổi và tệp kết quả nghiệm thu',
        desc: 'Hỗ trợ bình luận trực tiếp bên trong thẻ công việc, đính kèm tệp kết quả hoàn thành và ghi nhận lịch sử thay đổi phục vụ đánh giá năng suất KPI cuối tháng.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Điều hướng tới mục "Quy trình & Công việc / Workflow" trên thanh menu.',
      'Bước 2: Chọn dự án hoặc quy trình làm việc cần theo dõi để mở giao diện bảng Kanban.',
      'Bước 3: Nhấp vào nút "Thêm công việc", nhập tiêu đề, chọn người phụ trách, ngày hoàn thành và hạn chót.',
      'Bước 4: Theo dõi tiến độ công việc được các phòng ban kéo thả chuyển trạng thái theo thời gian thực.'
    ]
  },
  {
    id: 10,
    subCode: '2.3.2.10',
    name: 'Phân hệ Quản Trị Chấm Công Định Vị AI GPS & Chuyên Cần Doanh Nghiệp',
    shortTitle: 'Chấm Công Định Vị AI GPS & Chuyên Cần Doanh Nghiệp',
    imgFile: 'crm_10_attendance.png',
    figTitle: 'Hình 2.10 – Quản Trị Chấm Công Định Vị AI GPS & Bảng Điểm Chuyên Cần',
    generalDesc: 'Phân hệ quản trị thời gian làm việc và sự hiện diện của nhân sự tại văn phòng hoặc tại các địa điểm diễn ra sự kiện thông qua công nghệ hàng rào địa lý GPS Geofence và nhận diện khuôn mặt AI chống gian lận. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Cấu hình tọa độ và bán kính hàng rào địa lý GPS Geofence',
        desc: 'Thiết lập vị trí văn phòng hoặc trung tâm hội nghị trên bản đồ số; chỉ cho phép nhân sự điểm danh khi thiết bị di động nằm trong bán kính hợp lệ (50m - 100m).',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Nhận diện khuôn mặt AI xác thực nhân sự thực tế',
        desc: 'Sử dụng thuật toán so khớp khuôn mặt khi chấm công trên app di động, ngăn chặn hành vi chấm công hộ và chụp ảnh trực tiếp lưu vết thời gian.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bảng tổng hợp công nhật và tỷ lệ chuyên cần tự động',
        desc: 'Tự động tính toán số giờ làm việc, số lần đi muộn/về sớm, số ngày nghỉ phép có lương/không lương và tổng hợp thành bảng chấm công điện tử hàng tháng.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Phê duyệt đơn xin nghỉ phép và đi công tác trực tuyến',
        desc: 'Cán bộ quản lý tiếp nhận đơn xin nghỉ phép được gửi từ ứng dụng di động ViOne và thực hiện phê duyệt 1-chạm, hệ thống tự động cập nhật bảng công.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Chấm công / Attendance" trên menu thanh bên trái Cổng Web Quản Trị.',
      'Bước 2: Xem bản đồ vị trí các điểm chấm công hợp lệ đã được thiết lập bán kính GPS Geofence.',
      'Bước 3: Xem bảng nhật ký điểm danh theo ngày, kiểm tra ảnh chụp xác thực khuôn mặt của nhân sự.',
      'Bước 4: Nhấn nút "Xuất bảng công" vào cuối tháng để chuyển số liệu sang phòng kế toán tính lương.'
    ]
  },
  {
    id: 11,
    subCode: '2.3.2.11',
    name: 'Phân hệ Quản Trị Dòng Tiền Thu & Báo Cáo Doanh Thu Bán Vé VNPay',
    shortTitle: 'Quản Trị Dòng Tiền Thu & Doanh Thu Vé VNPay',
    imgFile: 'crm_11_income.png',
    figTitle: 'Hình 2.11 – Quản Trị Dòng Tiền Thu & Đối Soát Doanh Thu Cổng VNPay',
    generalDesc: 'Phân hệ quản lý toàn bộ các nguồn thu tài chính của tổ chức: doanh thu bán vé hội nghị, phí tài trợ sự kiện, phí tham gia giải đấu thể thao và phí thành viên thường niên thông qua cổng thanh toán VNPay. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Ghi nhận và phân loại nguồn thu tài chính đa nguồn',
        desc: 'Theo dõi từng khoản thu với đầy đủ thông tin: Mã giao dịch VNPay, Tên người nộp, Số tiền, Thời gian thanh toán và Mục đích thu (Vé sự kiện, Tài trợ, Đóng phí).',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Đối soát tự động với cổng thanh toán VNPay',
        desc: 'Hệ thống đối chiếu mã đơn hàng (vnp_TxnRef) và mã giao dịch ngân hàng (vnp_TransactionNo) từ cổng VNPay, tự động phát hiện sai lệch và lập biên bản đối soát.',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Tự động phát hành phiếu thu điện tử và gửi thông báo',
        desc: 'Khi dòng tiền nạp vào thành công, hệ thống tự động sinh số phiếu thu điện tử có mã QR tra cứu và gửi tin nhắn biên nhận qua Zalo OA đến người nộp tiền.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Biểu đồ phân tích cấu trúc doanh thu theo kỳ kế toán',
        desc: 'Biểu diễn tỷ trọng các nguồn thu qua biểu đồ tròn (Donut Chart) và biểu đồ cột so sánh theo từng tháng giúp ban lãnh đạo định hướng hoạt động tạo dòng tiền.',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Kết xuất báo cáo tài chính thu chuẩn mực',
        desc: 'Xuất dữ liệu dòng tiền thu ra định dạng Excel theo mẫu biểu kế toán doanh nghiệp Việt Nam, phục vụ công tác thanh kiểm tra tài chính định kỳ.',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Tài chính / Dòng tiền thu" trên thanh menu điều hướng.',
      'Bước 2: Quan sát danh sách các giao dịch thanh toán thành công vừa đổ về từ cổng VNPay.',
      'Bước 3: Nhấp vào một giao dịch để kiểm tra mã giao dịch ngân hàng và thông tin vé điện tử phát hành.',
      'Bước 4: Nhấn nút "Đối soát VNPay" để kích hoạt tiến trình kiểm tra cân bằng dòng tiền giữa hai hệ thống.'
    ]
  },
  {
    id: 12,
    subCode: '2.3.2.12',
    name: 'Phân hệ Quản Trị Phê Duyệt Chi Tiền 3 Cấp & Ngân Sách Dự Án',
    shortTitle: 'Phê Duyệt Chi Tiền 3 Cấp & Ngân Sách Dự Án',
    imgFile: 'crm_12_expenses.png',
    figTitle: 'Hình 2.12 – Quản Trị Quy Trình Phê Duyệt Chi Tiền 3 Cấp & Ngân Sách',
    generalDesc: 'Phân hệ thiết lập quy trình kiểm soát chi tiêu chặt chẽ của doanh nghiệp, thực hiện quy trình trình ký duyệt chi 3 cấp (Người đề xuất -> Kế toán trưởng -> Ban Giám đốc) đảm bảo minh bạch tài chính. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Lập tờ trình đề xuất chi tiền trực tuyến',
        desc: 'Cán bộ phụ trách điền phiếu đề xuất: Khoản mục chi, Số tiền, Lý do chi, Đơn vị thụ hưởng, kèm hóa đơn đỏ VAT hoặc hợp đồng dịch vụ đính kèm dạng PDF/ảnh.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Quy trình thẩm định và phê duyệt chi 3 cấp',
        desc: 'Quy trình kiểm soát theo hạn mức: Cấp 1 thẩm định hồ sơ hóa đơn (Kế toán), Cấp 2 phê duyệt chuyên môn (Trưởng ban), Cấp 3 duyệt chi ngân sách (Ban Giám đốc).',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Cảnh báo vượt định mức ngân sách dự án (Budget Overrun)',
        desc: 'Tự động kiểm tra khoản chi với quỹ ngân sách đã được duyệt từ đầu năm; phát tín hiệu cảnh báo màu đỏ nếu khoản chi làm tổng chi vượt quá 100% ngân sách.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Ký số phê duyệt và ghi sổ cái tài chính',
        desc: 'Hỗ trợ lãnh đạo ký duyệt trực tuyến trên Cổng Web Quản trị hoặc App Di động; hệ thống tự động ghi nhận phiếu chi hợp lệ và trừ số dư tài khoản ngân quỹ.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Báo cáo giải ngân và tỷ lệ tiết kiệm chi phí',
        desc: 'Thống kê tiến độ giải ngân theo từng dự án, sự kiện và phòng ban; so sánh chi phí thực tế so với kế hoạch ban đầu để tối ưu hóa dòng tiền.',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Tài chính / Phê duyệt chi" trên menu Cổng Web Quản Trị.',
      'Bước 2: Xem danh sách các phiếu đề xuất chi tiền đang chờ phê duyệt ở cấp của mình.',
      'Bước 3: Nhấp vào phiếu đề xuất để kiểm tra chứng từ hóa đơn và hạn mức ngân sách dự án còn lại.',
      'Bước 4: Nhấn nút "Phê duyệt" để thông qua hoặc "Từ chối" kèm ghi chú lý do để người đề xuất bổ sung.'
    ]
  },
  {
    id: 13,
    subCode: '2.3.2.13',
    name: 'Phân hệ Quản Trị Phí Thường Niên Định Kỳ & Công Nợ Doanh Nghiệp',
    shortTitle: 'Quản Trị Phí Thường Niên Định Kỳ & Công Nợ Doanh Nghiệp',
    imgFile: 'crm_13_fees.png',
    figTitle: 'Hình 2.13 – Quản Trị Phí Thường Niên Thường Niên & Công Nợ Doanh Nghiệp',
    generalDesc: 'Phân hệ quản trị công tác thu phí thường niên thường niên, nhắc nợ tự động, theo dõi tình trạng hoàn thành nghĩa vụ tài chính của từng doanh nghiệp thành viên trong mạng lưới chi hội. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Cấu hình biểu phí thường niên theo cấp bậc và niên độ',
        desc: 'Thiết lập định mức phí thường niên hàng năm cho từng hạng thẻ: Doanh nhân Kim Cương (50.000.000đ/năm), Doanh nhân Vàng (20.000.000đ/năm), Doanh nhân Chuẩn (10.000.000đ/năm).',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Theo dõi tình trạng nộp phí và phát sinh công nợ',
        desc: 'Quản lý trạng thái đóng phí: Đã hoàn thành, Chưa nộp, Quá hạn nộp phí; tính toán tổng số tiền công nợ phí thường niên của toàn bộ cộng đồng doanh nghiệp.',
        actorMain: 'A06 – Kế toán trưởng & Quản trị tài chính',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Gửi thông báo nhắc đóng phí tự động qua Zalo OA & Email',
        desc: 'Trước khi hết hạn 30 ngày và 7 ngày, hệ thống tự động gửi thông báo nhắc phí kèm đường link thanh toán 1-chạm qua cổng VNPay đến người đại diện pháp luật.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Gia hạn thẻ định danh số tự động khi hoàn thành phí',
        desc: 'Ngay khi giao dịch nộp phí thường niên qua cổng VNPay thành công, hệ thống tự động cộng thêm 365 ngày hiệu lực cho thẻ định danh số vCard của doanh nhân trên app.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Phí thường niên & Công nợ" trên thanh menu Cổng Web Quản Trị.',
      'Bước 2: Lọc danh sách các doanh nghiệp sắp hết hạn phí thường niên hoặc đang còn nợ phí niên độ hiện tại.',
      'Bước 3: Nhấn nút "Gửi nhắc phí hàng loạt" để hệ thống tự động bắn tin nhắn Zalo OA kèm link thanh toán.',
      'Bước 4: Kiểm tra trạng thái nộp tiền được hệ thống tự động tích xanh khi doanh nhân hoàn tất thanh toán VNPay.'
    ]
  },
  {
    id: 14,
    subCode: '2.3.2.14',
    name: 'Phân hệ Quản Trị Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport',
    shortTitle: 'Quản Trị Giải Đấu Thể Thao ViOne Sport',
    imgFile: 'crm_14_sport.png',
    figTitle: 'Hình 2.14 – Quản Trị Giải Đấu Thể Thao Doanh Nghiệp ViOne Sport',
    generalDesc: 'Phân hệ chuyên biệt phục vụ công tác tổ chức, điều phối, bốc thăm và số hóa toàn diện các giải đấu thể thao doanh nhân (Bóng đá mini, Golf, Tennis, Pickleball) nhằm tăng cường gắn kết mạng lưới cộng đồng. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Cấu hình thể thức thi đấu và điều lệ giải',
        desc: 'Hỗ trợ các thể thức: Đấu loại trực tiếp (Single/Double Knockout), Vòng tròn tính điểm (Round-Robin), Chia bảng đấu có vòng Play-off tranh cúp vô địch.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Tự động bốc thăm phân nhánh sơ đồ cây (Tournament Bracket)',
        desc: 'Thuật toán bốc thăm ngẫu nhiên kết hợp chia nhóm hạt giống; tự động xếp lịch thi đấu, chia sân bãi và thời gian các trận đấu mà không thể can thiệp thủ công.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Quản lý hồ sơ vận động viên và thẻ VĐV điện tử',
        desc: 'Số hóa danh sách đăng ký thi đấu của các đội: Ảnh chân dung, Số áo, Vị trí thi đấu, Giấy khám sức khỏe và cấp phát thẻ VĐV số có mã QR định danh.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Cập nhật tỷ số, biên bản trận đấu thời gian thực',
        desc: 'Tổ trọng tài nhập tỷ số trận đấu, cầu thủ ghi bàn, thẻ vàng/thẻ đỏ, điểm số set đấu trực tiếp trên web/app; bảng tổng sắp tự động cập nhật ngay lập tức.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bảng xếp hạng tổng sắp và danh hiệu cá nhân',
        desc: 'Tự động tính toán điểm số, hiệu số bàn thắng bại, tỷ số đối đầu; xếp hạng huy chương vàng/bạc/đồng và tôn vinh danh hiệu Vua phá lưới, VĐV xuất sắc nhất.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "ViOne Sport / Giải đấu" trên thanh menu Cổng Web Quản Trị.',
      'Bước 2: Tạo giải đấu mới, chọn bộ môn (Bóng đá mini, Golf, Tennis, Pickleball) và cấu hình điều lệ.',
      'Bước 3: Nhấp vào nút "Bốc thăm tự động" để hệ thống tạo sơ đồ nhánh thi đấu (Tournament Bracket).',
      'Bước 4: Trong thời gian diễn ra trận đấu, tổ trọng tài nhập trực tiếp tỷ số để phát sóng realtime lên App.'
    ]
  },
  {
    id: 15,
    subCode: '2.3.2.15',
    name: 'Phân hệ Quản Trị Giải Chạy Bộ ViOne Run Marathon & Chip Timing RFID UHF',
    shortTitle: 'Quản Trị Giải Chạy ViOne Run & Chip Timing RFID',
    imgFile: 'crm_15_run.png',
    figTitle: 'Hình 2.15 – Quản Trị Giải Chạy ViOne Run Marathon & Đo Đạc Chip Timing RFID',
    generalDesc: 'Phân hệ quản trị vận hành giải chạy bộ phong trào chuyên nghiệp dành cho cộng đồng doanh nhân, hỗ trợ cự ly 5km, 10km, 21km, 42km, quản lý mã số BIB, tích hợp hệ thống thảm ăng-ten Chip Timing RFID UHF đo đạc thành tích chính xác đến 1/1000 giây. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Cấu hình cự ly thi đấu và bản đồ cung đường chạy (GPX / GIS)',
        desc: 'Thiết lập các cự ly tiêu chuẩn (5km Fun Run, 10km Challenge, 21km Half Marathon, 42km Full Marathon); tải lên tệp tọa độ GPX hiển thị bản đồ độ dốc elevation.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Quản lý và cấp phát mã số BIB điện tử chống giả',
        desc: 'Tự động sinh mã BIB cá nhân hóa cho từng vận động viên; liên kết mã BIB với mã chip RFID UHF dán sau số đeo và mã QR tra cứu thành tích cá nhân.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tiếp nhận dữ liệu thảm đo thời gian Chip Timing RFID Realtime',
        desc: 'Kết nối mạng TCP/IP với các thảm đọc RFID đặt tại vạch Xuất phát (Start), vạch Đích (Finish) và các trạm Checkpoint dọc đường; ghi nhận Gun Time và Chip Time.',
        actorMain: 'A04 – Ban trọng tài & Điều phối viên thể thao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Bảng xếp hạng Leaderboard tự động tính Pace và Rank',
        desc: 'Tính toán tốc độ chạy trung bình (Pace phút/km), thứ hạng chung cuộc (Overall Rank), thứ hạng theo nhóm tuổi và giới tính (Gender/Age Group Rank) ngay khi VĐV cán đích.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A04 – Ban trọng tài & Điều phối viên thể thao'
      },
      {
        name: 'Cấp chứng nhận điện tử (e-Certificate) & Ảnh kỷ niệm VĐV',
        desc: 'Tự động ghép ảnh chân dung VĐV với khung mẫu chứng nhận số có thành tích chính xác; hỗ trợ VĐV tải chứng nhận PDF có chữ ký số của Ban Tổ chức.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "ViOne Run / Giải chạy" trên menu Cổng Web Quản Trị.',
      'Bước 2: Cấu hình cự ly giải chạy, tải tệp bản đồ cung đường chạy GPX và kiểm tra các trạm Checkpoint.',
      'Bước 3: Kết nối cổng thu phát dữ liệu từ thảm đọc Chip Timing RFID vào hệ thống máy chủ.',
      'Bước 4: Giám sát bảng Leaderboard trực tiếp hiển thị tốc độ Pace và thứ hạng các VĐV dẫn đầu khi về đích.'
    ]
  },
  {
    id: 16,
    subCode: '2.3.2.16',
    name: 'Phân hệ Quản Trị Không Gian Trưng Bày Bảo Tàng Số 3D & Hiện Vật NFC ViOne Museum',
    shortTitle: 'Bảo Tàng Số 3D & Thuyết Minh Hiện Vật NFC ViOne Museum',
    imgFile: 'crm_16_museum.png',
    figTitle: 'Hình 2.16 – Quản Trị Không Gian Trưng Bày Bảo Tàng Số 3D ViOne Museum',
    generalDesc: 'Phân hệ quản trị kho dữ liệu số hóa bảo vật quốc gia, cổ vật lịch sử và hiện vật văn hóa bằng công nghệ quét 3D Photogrammetry/GLTF xoay 360 độ, kết nối thẻ vật lý 1-chạm NFC tại các tủ trưng bày và hệ thống thuyết minh âm thanh đa ngữ. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Lưu trữ và kết xuất mô hình hiện vật 3D tương tác (GLTF / OBJ)',
        desc: 'Quản lý tệp mô hình không gian ba chiều siêu thực của bảo vật; hỗ trợ người xem trên web/app xoay 360 độ, thu phóng bề mặt hoa văn và bật/tắt ánh sáng giả lập.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Biên tập kho thuyết minh âm thanh số (Audio Guide)',
        desc: 'Tải lên các đoạn âm thanh thuyết minh lịch sử, nguồn gốc và ý nghĩa văn hóa của cổ vật bằng hai ngôn ngữ Tiếng Việt và Tiếng Anh; tự động sinh phụ đề văn bản.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Gán thẻ chip 1-chạm NFC vào tủ kính trưng bày',
        desc: 'Mỗi hiện vật vật lý ngoài đời thực được định danh bởi một thẻ chip NFC mật mã; khách tham quan chỉ cần chạm điện thoại vào tủ trưng bày là app tự động phát thuyết minh.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Bán vé tham quan không gian số trực tuyến qua VNPay',
        desc: 'Phát hành vé tham quan triển lãm ảo cho khách ở xa; thanh toán vé qua cổng VNPay và cấp quyền truy cập phòng trưng bày số trong 24 giờ.',
        actorMain: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      },
      {
        name: 'Trợ lý ảo AI Hướng dẫn viên bảo tàng',
        desc: 'Tích hợp mô hình AI hiểu sâu dữ liệu khảo cổ để tương tác hỏi đáp trực tiếp với khách tham quan về niên đại, chất liệu và văn hóa thời kỳ của hiện vật.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A01 – Khách truy cập vãng lai'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Bảo tàng số / ViOne Museum" trên menu Cổng Web Quản Trị.',
      'Bước 2: Tải lên tệp mô hình 3D (định dạng .gltf/.glb) và ảnh chụp chi tiết các góc cạnh của cổ vật.',
      'Bước 3: Nhập bài thuyết minh và tải lên tệp âm thanh Audio Guide song ngữ Việt - Anh.',
      'Bước 4: Nhấn nút "Ghi thẻ NFC" để nạp đường dẫn định danh vào chip vật lý gắn tại tủ trưng bày bảo tàng.'
    ]
  },
  {
    id: 17,
    subCode: '2.3.2.17',
    name: 'Phân hệ Quản Trị & Số Hóa Di Sản Văn Hóa ViOne Heritage',
    shortTitle: 'Quản Trị & Số Hóa Di Sản Văn Hóa ViOne Heritage',
    imgFile: 'crm_17_heritage.png',
    figTitle: 'Hình 2.17 – Quản Trị & Số Hóa Di Sản Văn Hóa ViOne Heritage',
    generalDesc: 'Phân hệ quản trị kho dữ liệu số hóa di sản văn hóa vật thể và phi vật thể, phục chế tài liệu Hán Nôm cổ, sắc phong các triều đại phong kiến, tích hợp bản đồ số GIS khoanh vùng di tích và công nghệ định vị GPS Geofencing tự động thuyết minh. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Lưu trữ và phục chế số sắc phong triều Nguyễn và tư liệu cổ',
        desc: 'Quản lý bản chụp độ phân giải siêu cao (Gigapixel) các bản sắc phong cổ; số hóa bản dịch nghĩa Hán Nôm, chú giải danh xưng và thông tin triều đại vua ban tặng.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Bản đồ số GIS định vị và khoanh vùng bảo vệ di tích',
        desc: 'Khoanh vùng ranh giới bảo vệ Di tích Quốc gia (Khu vực bảo vệ I và II) trên nền bản đồ số không gian; hiển thị đầy đủ thông tin tọa độ và quyết định xếp hạng di tích.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Tự động kích hoạt thuyết minh qua GPS Geofencing',
        desc: 'Thiết lập bán kính định vị 20 mét quanh di tích; khi du khách mang điện thoại cài App ViOne bước vào vùng di tích, hệ thống tự động phát bài giới thiệu lịch sử.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Tour tham quan thực tế ảo VR360 Panoramas 8K',
        desc: 'Liên kết chuỗi ảnh toàn cảnh 360 độ độ nét 8K tạo thành tour tham quan thực tế ảo tương tác đa điểm chạm, giúp du khách chiêm bái di tích từ xa.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A01 – Khách truy cập vãng lai'
      },
      {
        name: 'Bảo tồn văn hóa phi vật thể và diễn xướng dân gian',
        desc: 'Lưu trữ các video tư liệu, bản ghi âm diễn xướng Ca trù, Quan họ, Hát xoan kèm phụ đề phân tích nghệ thuật, phục vụ nghiên cứu và giáo dục di sản cho thế hệ trẻ.',
        actorMain: 'A05 – Thuyết minh viên & Cán bộ bảo tàng',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Di sản văn hóa / ViOne Heritage" trên menu Cổng Web Quản Trị.',
      'Bước 2: Tạo hồ sơ di sản mới, nhập niên đại, địa danh lịch sử và quyết định công nhận di tích.',
      'Bước 3: Tải lên các bản scan sắc phong cổ Hán Nôm cùng văn bản dịch thơ và chú thích lịch sử.',
      'Bước 4: Nhấp bản đồ vệ tinh để chấm tọa độ GPS Geofence kích hoạt bài thuyết minh tự động cho du khách.'
    ]
  },
  {
    id: 18,
    subCode: '2.3.2.18',
    name: 'Phân hệ Quản Trị Vé Sự Kiện Điện Tử & Mã Hóa Chống Giả ViOne Tickets',
    shortTitle: 'Vé Sự Kiện Điện Tử & Mã Hóa Chống Giả ViOne Tickets',
    imgFile: 'crm_18_tickets.png',
    figTitle: 'Hình 2.18 – Quản Trị Vé Sự Kiện Điện Tử & Mã Hóa Chống Giả ViOne Tickets',
    generalDesc: 'Phân hệ chuyên trách quản lý vòng đời toàn bộ vé điện tử phát hành trên nền tảng, áp dụng thuật toán mã hóa mã QR biến đổi chống quay video/chụp màn hình gian lận vé và phân bổ chỗ ngồi đại biểu. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Mã hóa vé QR động theo thời gian (Dynamic Time-based Token)',
        desc: 'Mã QR trên ứng dụng di động tự động làm mới mã băm bảo mật sau mỗi 30 giây (tương tự Google Authenticator OTP), vô hiệu hóa hoàn toàn thủ đoạn chụp ảnh màn hình bán lại vé.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Sơ đồ chỗ ngồi và phân luồng cửa vào thông minh',
        desc: 'Gán số ghế, số bàn VIP và chỉ định cổng ra vào (Gate A, Gate B) tương ứng với từng hạng vé, in rõ ràng trên vé điện tử để hỗ trợ điều phối dòng người.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Ủy quyền chuyển nhượng vé an toàn giữa các doanh nhân',
        desc: 'Cho phép chủ vé chuyển nhượng vé cho đối tác thông qua số điện thoại; hệ thống hủy mã vé cũ và phát hành vé mới cho người nhận để đảm bảo tính duy nhất.',
        actorMain: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tra cứu lịch sử quét vé và kiểm soát gian lận',
        desc: 'Ghi nhận chi tiết nhật ký thời gian quét vé, thiết bị soát vé, nhân viên thực hiện soát vé; cảnh báo ngay lập tức nếu mã vé đã được check-in trước đó.',
        actorMain: 'A03 – Quản trị viên phân hệ nghiệp vụ',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Kho vé / ViOne Tickets" trên thanh menu Cổng Web Quản Trị.',
      'Bước 2: Xem danh sách toàn bộ các vé đã phát hành, lọc theo sự kiện và trạng thái vé.',
      'Bước 3: Tra cứu lịch sử quét vé của một đại biểu cụ thể bằng số điện thoại hoặc mã vé.',
      'Bước 4: Sử dụng tính năng "Thu hồi vé" hoặc "Cấp lại vé" trong trường hợp đại biểu báo đổi người tham dự.'
    ]
  },
  {
    id: 19,
    subCode: '2.3.2.19',
    name: 'Phân hệ Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp Đa Tầng ViOne Archive (/documents)',
    shortTitle: 'Kho Lưu Trữ Tài Liệu Phân Cấp ViOne Archive',
    imgFile: 'crm_19_documents.png',
    figTitle: 'Hình 2.19 – Quản Trị Kho Lưu Trữ Tài Liệu Phân Cấp ViOne Archive (/documents)',
    generalDesc: 'Phân hệ lưu trữ, quản lý và chia sẻ toàn bộ tài liệu số của tổ chức doanh nghiệp theo cấu trúc cây thư mục phân cấp đa tầng (tương tự Google Drive), tích hợp trình xem trước tài liệu văn phòng trực tiếp trên trình duyệt. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Tổ chức cây thư mục phân cấp đa tầng (Nested Folders)',
        desc: 'Hỗ trợ tạo lập cây thư mục không giới hạn độ sâu: Thư mục theo phòng ban, Thư mục dự án, Niên độ tài chính; hỗ trợ thao tác kéo thả tệp tin tiện lợi.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Xem trước tài liệu trực tiếp không cần cài phần mềm (In-browser Preview)',
        desc: 'Hỗ trợ hiển thị trực quan tệp Hợp đồng PDF, văn bản Word .docx, bảng tính Excel .xlsx, bài thuyết trình PowerPoint .pptx và hình ảnh sắc nét ngay trên web.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Phân quyền bảo mật tệp theo ma trận vai trò RBAC',
        desc: 'Cấu hình quyền chi tiết cho từng thư mục/tệp: Chỉ xem (View Only), Tải về (Download), Chỉnh sửa (Edit) và Quản trị toàn quyền (Full Control) theo vai trò người dùng.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Quản lý lịch sử phiên bản tệp tin (File Versioning)',
        desc: 'Lưu trữ các phiên bản cập nhật (v1.0, v1.1...); cho phép người dùng so sánh sự thay đổi giữa các phiên bản và khôi phục lại phiên bản cũ khi cần thiết.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A03 – Quản trị viên phân hệ nghiệp vụ'
      },
      {
        name: 'Thùng rác an toàn và cơ chế khôi phục dữ liệu',
        desc: 'Tệp tin bị xóa được chuyển vào Thùng rác bảo vệ trong vòng 30 ngày trước khi xóa vĩnh viễn; chỉ người có quyền Quản trị viên mới được xóa hoàn toàn.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Tài liệu / Archive (/documents)" trên thanh điều hướng Cổng Web Quản Trị.',
      'Bước 2: Nhấp vào cây thư mục phòng ban bên trái để duyệt đến vị trí lưu trữ mong muốn.',
      'Bước 3: Nhấn nút "Tải tệp lên" hoặc kéo thả tài liệu từ máy tính vào không gian làm việc.',
      'Bước 4: Nhấp đúp vào tệp tin để xem trước nội dung trực tiếp trên trình duyệt hoặc chia sẻ quyền truy cập.'
    ]
  },
  {
    id: 20,
    subCode: '2.3.2.20',
    name: 'Phân hệ Quản Trị Biểu Quyết, Khảo Sát & Bỏ Phiếu Tín Nhiệm Số',
    shortTitle: 'Biểu Quyết, Khảo Sát & Bỏ Phiếu Tín Nhiệm Số',
    imgFile: 'crm_20_voting.png',
    figTitle: 'Hình 2.20 – Quản Trị Biểu Quyết, Khảo Sát & Bỏ Phiếu Tín Nhiệm Số',
    generalDesc: 'Phân hệ điều phối công tác lấy ý kiến tập thể, biểu quyết đại hội cổ đông, bầu cử ban lãnh đạo và khảo sát ý kiến doanh nhân một cách minh bạch, bảo mật và kết quả được kiểm phiếu tự động theo thời gian thực. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Khởi tạo cuộc biểu quyết và đại hội tín nhiệm số',
        desc: 'Thiết lập nội dung biểu quyết, các phương án lựa chọn, thời gian mở/đóng hòm phiếu điện tử và cơ chế biểu quyết công khai hoặc bỏ phiếu kín.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Kiểm soát tư cách cử tri và tỷ lệ quyền biểu quyết',
        desc: 'Hệ thống đối chiếu danh sách doanh nhân chính thức đủ điều kiện; gán trọng số phiếu biểu quyết theo tỷ lệ sở hữu vốn hoặc chức danh điều hành.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Thuật toán kiểm phiếu tự động và chống gian lận',
        desc: 'Mỗi lá phiếu điện tử được ký bằng khóa riêng của tài khoản; hệ thống khóa không cho phép bỏ phiếu lần hai và tự động tổng hợp tỷ lệ phần trăm.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Xuất biên bản kiểm phiếu đại hội định dạng PDF có mã băm',
        desc: 'Tự động tạo biên bản kiểm phiếu hoàn chỉnh có biểu đồ kết quả, danh sách cử tri tham gia và mã băm SHA-256 niêm phong kết quả bầu cử.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Biểu quyết & Khảo sát" trên menu thanh bên trái Cổng Web Quản Trị.',
      'Bước 2: Nhấn "Tạo cuộc biểu quyết", nhập tiêu đề, danh sách ứng viên hoặc phương án biểu quyết.',
      'Bước 3: Thiết lập quyền cử tri và thời gian đếm ngược đóng hòm phiếu.',
      'Bước 4: Quan sát biểu đồ kiểm phiếu trực tiếp cập nhật realtime khi các đại biểu nhấn nút bỏ phiếu trên App.'
    ]
  },
  {
    id: 21,
    subCode: '2.3.2.21',
    name: 'Phân hệ Cấu Hình Phân Quyền RBAC Ma Trận Vai Trò & Nhật Ký Kiểm Toán Audit Log',
    shortTitle: 'Phân Quyền RBAC Ma Trận Vai Trò & Nhật Ký Kiểm Toán',
    imgFile: 'crm_21_rbac.png',
    figTitle: 'Hình 2.21 – Cấu Hình Phân Quyền RBAC Ma Trận Vai Trò & Nhật Ký Kiểm Toán',
    generalDesc: 'Phân hệ quản trị an ninh hệ thống hạt nhân, thiết lập ma trận phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) không phụ thuộc các ban chuyên môn, và ghi vết bất biến toàn bộ hành động người dùng phục vụ công tác thanh tra bảo mật. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Thiết lập ma trận phân quyền vai trò RBAC linh hoạt',
        desc: 'Định nghĩa các nhóm vai trò (Super Admin, Portal Admin, Event Manager, Sport Referee, Heritage Curator, Finance Admin, Member); gán quyền chi tiết (Xem, Thêm, Sửa, Xóa).',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Gán vai trò người dùng theo phòng ban và chức danh',
        desc: 'Chỉ định một hoặc nhiều vai trò cho từng tài khoản người dùng; quyền hạn có hiệu lực tức thì mà không cần người dùng phải đăng xuất đăng nhập lại.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Nhật ký kiểm toán truy vết bất biến (Audit Logs)',
        desc: 'Ghi lại mọi thao tác quan trọng: Đổi mật khẩu, Xuất dữ liệu doanh nhân, Phê duyệt chi tiền, Sửa điểm giải đấu kèm địa chỉ IP, User-Agent và thời điểm chính xác.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tra cứu sự cố và lọc vết bảo mật theo mã giao dịch',
        desc: 'Hỗ trợ cán bộ an ninh tìm kiếm lịch sử hành động theo mã người dùng, khoảng thời gian hoặc phân hệ nghi vấn bị rò rỉ dữ liệu để phục vụ điều tra.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Khóa tài khoản và thu hồi quyền khẩn cấp',
        desc: 'Cho phép Super Admin đình chỉ tức thì phiên làm việc của bất kỳ tài khoản nào khi phát hiện có dấu hiệu bất thường hoặc nhân sự nghỉ việc.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Phân quyền RBAC / Audit Logs" trên menu Cổng Web Quản Trị.',
      'Bước 2: Nhấp vào tab "Ma trận vai trò" để điều chỉnh dấu tích cấp quyền Xem/Sửa/Xóa cho từng nhóm.',
      'Bước 3: Nhấp vào tab "Nhật ký kiểm toán" để xem dòng thời gian hoạt động của toàn thể nhân sự trong hệ thống.',
      'Bước 4: Sử dụng ô tìm kiếm IP hoặc tên người dùng để truy vết hành động khi cần kiểm tra sự cố.'
    ]
  },
  {
    id: 22,
    subCode: '2.3.2.22',
    name: 'Phân hệ Trợ Lý Trí Tuệ Nhân Tạo & Bóc Tách Dữ Liệu AI OCR ViOne AI',
    shortTitle: 'Trợ Lý Trí Tuệ Nhân Tạo & Bóc Tách AI OCR',
    imgFile: 'crm_22_ai.png',
    figTitle: 'Hình 2.22 – Trợ Lý Trí Tuệ Nhân Tạo & Bóc Tách Dữ Liệu AI OCR ViOne AI',
    generalDesc: 'Phân hệ ứng dụng các công nghệ trí tuệ nhân tạo hiện đại, hỗ trợ bóc tách danh thiếp giấy tự động bằng thị giác máy tính OCR, gợi ý đối tác kết nối kinh doanh tự động và trợ lý điều hành hỏi đáp dữ liệu doanh nghiệp thông minh. Phân hệ gồm 4 chức năng chính.',
    features: [
      {
        name: 'Bóc tách thông tin danh thiếp giấy tự động AI OCR',
        desc: 'Nhận dạng ảnh chụp danh thiếp giấy, tự động bóc tách Họ tên, Chức vụ, Tên công ty, Số điện thoại, Email và Địa chỉ rồi điền chính xác vào các trường của CSDL.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Thuật toán kết nối đối tác giao thương thông minh (AI Matching)',
        desc: 'Phân tích nhu cầu Chào mua và Chào bán của các doanh nghiệp thành viên, tự động ghép nối các đối tác có độ tương thích cao và gửi gợi ý kết nối qua app.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A07 – Quản trị viên Cổng Web Quản trị'
      },
      {
        name: 'Trợ lý ảo hỗ trợ điều hành và truy vấn dữ liệu giọng nói',
        desc: 'Cho phép lãnh đạo đặt câu hỏi bằng ngôn ngữ tự nhiên: "Doanh thu vé tuần này là bao nhiêu?", "Có bao nhiêu doanh nhân mới tham gia?", trợ lý AI trích xuất dữ liệu trả lời tức thì.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A02 – Doanh nhân doanh nghiệp / Lãnh đạo C-Level'
      },
      {
        name: 'Cảnh báo rủi ro tài chính và dự báo xu hướng doanh thu',
        desc: 'Mô hình học máy phân tích chuỗi thời gian dòng tiền, dự báo các khoản công nợ có nguy cơ chậm trả và gợi ý kế hoạch cân đối tài chính cho ban giám đốc.',
        actorMain: 'A10 – Động cơ nền tảng tự động',
        actorSub: 'A06 – Kế toán trưởng & Quản trị tài chính'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Trợ lý AI / ViOne AI" trên thanh menu Cổng Web Quản Trị.',
      'Bước 2: Tải lên hình ảnh danh thiếp giấy cần bóc tách để kiểm tra độ chính xác của mô hình OCR.',
      'Bước 3: Nhập câu hỏi truy vấn vào khung chat để yêu cầu AI tổng hợp số liệu doanh thu và doanh nhân.',
      'Bước 4: Xem danh sách các cặp đối tác tiềm năng được thuật toán AI gợi ý kết nối giao thương trong tháng.'
    ]
  },
  {
    id: 23,
    subCode: '2.3.2.23',
    name: 'Phân hệ Cấu Hình Nền Tảng, Tích Hợp Zalo OA & Cổng Thanh Toán VNPay',
    shortTitle: 'Cấu Hình Nền Tảng, Tích Hợp Zalo OA & VNPay',
    imgFile: 'crm_23_settings.png',
    figTitle: 'Hình 2.23 – Cấu Hình Hệ Thống, Tích Hợp Zalo OA & Cổng Thanh Toán VNPay',
    generalDesc: 'Phân hệ quản trị cấu hình trung tâm của toàn bộ nền tảng, thiết lập thông số kết nối cổng thanh toán VNPay, tài khoản định danh Zalo Official Account (Zalo OA), cấu hình gửi email SMTP và các tùy chọn giao diện thương hiệu Vàng Champagne Gold / Đen Obsidian. Phân hệ gồm 5 chức năng chính.',
    features: [
      {
        name: 'Cấu hình tham số tích hợp cổng thanh toán VNPay',
        desc: 'Quản lý an toàn mã định danh doanh nghiệp (vnp_TmnCode), khóa bí mật tạo chữ ký số (vnp_HashSecret), URL cổng thanh toán và đường dẫn nhận webhook IPN bảo mật.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Cấu hình kết nối tài khoản Zalo Official Account (Zalo OA)',
        desc: 'Thiết lập App ID, Secret Key, Access Token và Refresh Token kết nối Zalo OpenAPI v3; quản lý kho mẫu tin nhắn thông báo chăm sóc khách hàng tự động ZNS.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A09 – Dịch vụ cổng thanh toán quốc gia VNPay & Cổng thông báo Zalo OA'
      },
      {
        name: 'Cấu hình máy chủ gửi thư điện tử SMTP',
        desc: 'Thiết lập thông số máy chủ thư tín doanh nghiệp: Host, Port, Mã hóa TLS/SSL, Tài khoản và Mật khẩu ứng dụng; gửi thử nghiệm email kiểm tra kết nối.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      },
      {
        name: 'Tùy biến bộ nhận diện thương hiệu và màu sắc Obsidian Gold',
        desc: 'Tải lên logo chính thức, biểu tượng favicon, cấu hình bảng màu thương hiệu chuẩn: Vàng Champagne Gold (#D8B282), Đen Thạch Anh (#050C15) trên toàn bộ Cổng Web và App.',
        actorMain: 'A07 – Quản trị viên Cổng Web Quản trị',
        actorSub: 'A08 – Quản trị viên hệ thống cấp cao'
      },
      {
        name: 'Sao lưu cơ sở dữ liệu và cấu hình tham số hệ thống',
        desc: 'Kích hoạt lệnh sao lưu dữ liệu PostgreSQL thủ công hoặc đặt lịch tự động sao lưu hàng ngày; kiểm tra tình trạng dung lượng bộ nhớ máy chủ và phiên bản ứng dụng.',
        actorMain: 'A08 – Quản trị viên hệ thống cấp cao',
        actorSub: 'A10 – Động cơ nền tảng tự động'
      }
    ],
    steps: [
      'Bước 1: Chọn mục "Cài đặt hệ thống / Settings" ở góc dưới thanh menu Cổng Web Quản Trị.',
      'Bước 2: Nhấp tab "Cổng thanh toán" để nhập các tham số vnp_TmnCode và Secret Key của VNPay.',
      'Bước 3: Nhấp tab "Zalo OA" để kiểm tra trạng thái kết nối và các mẫu tin nhắn thông báo tự động.',
      'Bước 4: Nhấn nút "Lưu cấu hình", hệ thống kiểm tra kết nối và nạp các biến môi trường tức thì.'
    ]
  }
];

module.exports = {
  CRM_MODULES
};
