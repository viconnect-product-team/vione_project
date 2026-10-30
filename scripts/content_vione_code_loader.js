// scripts/content_vione_code_loader.js
// Nạp mã nguồn thực tế của dự án ViOne Platform cho Phụ Lục IV

const fs = require('fs');
const path = require('path');

const CODE_FILES = [
  {
    order: 1,
    path: 'apps/vione_app_be/src/auth/auth.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ xác thực danh tính trung tâm (AuthService): Xử lý đăng nhập, đối chiếu mật khẩu băm Argon2/Bcrypt, cấp phát cặp Access Token (JWT) và Refresh Token phần cứng an toàn'
  },
  {
    order: 2,
    path: 'apps/vione_app_be/src/auth/auth.controller.ts',
    lang: 'typescript',
    desc: 'Bộ điều khiển xác thực RESTful (AuthController): Định tuyến API đăng nhập, làm mới phiên làm việc, kích hoạt 2FA và đăng xuất bảo mật'
  },
  {
    order: 3,
    path: 'apps/vione_app_be/src/platform-hub/platform-hub.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ lõi Platform Hub: Quản lý giải đấu thể thao ViOne Sport, bốc thăm sơ đồ cây Tournament Bracket, giải chạy ViOne Run, tiếp nhận chip timing RFID UHF, bảo tàng số 3D Photogrammetry và bản đồ GIS di sản văn hóa'
  },
  {
    order: 4,
    path: 'apps/vione_app_be/src/platform-hub/platform-hub.controller.ts',
    lang: 'typescript',
    desc: 'Bộ điều khiển RESTful Platform Hub Controller: Các điểm cuối API tiếp nhận và xử lý dữ liệu thể thao, giải chạy, mô hình 3D bảo tàng và di tích lịch sử'
  },
  {
    order: 5,
    path: 'apps/vione_app_be/src/events/events.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ quản trị sự kiện & bán vé điện tử ViOne Tickets: Cấu hình hạng vé (VIP, Standard), sinh mã QR token AES-256 động, tích hợp thanh toán VNPay và kiểm soát cổng soát vé check-in siêu tốc <100ms'
  },
  {
    order: 6,
    path: 'apps/vione_app_be/src/events/events.controller.ts',
    lang: 'typescript',
    desc: 'Bộ điều khiển RESTful Events Controller: Điều phối luồng phát hành vé, thanh toán trực tuyến và xác thực mã vé QR'
  },
  {
    order: 7,
    path: 'apps/vione_app_be/src/members/members.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ quản trị hội viên 360 & Danh thiếp số vCard: Quản lý hồ sơ doanh nhân, cấp bậc thẻ VIP, định danh số NFC vật lý, mạng lưới kết nối kinh doanh'
  },
  {
    order: 8,
    path: 'apps/vione_app_be/src/companies/companies.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ quản trị doanh nghiệp, Sàn giao thương B2B Marketplace & Phễu bán hàng Deals: Xác thực pháp nhân công ty, niêm yết sản phẩm, theo dõi quy trình giao thương'
  },
  {
    order: 9,
    path: 'apps/vione_app_be/src/admin/admin.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ quản trị hệ thống, Phân quyền RBAC ma trận đặc quyền & Nhật ký kiểm toán Audit Log: Kiểm soát truy cập đa tầng, truy vết bảo mật bất biến và cấu hình tích hợp cổng'
  },
  {
    order: 10,
    path: 'apps/vione_app_be/src/operations/operations.service.ts',
    lang: 'typescript',
    desc: 'Dịch vụ vận hành quy trình BPMN 2.0, Chấm công định vị GPS Geofencing & Quản trị tài chính thu chi: Luồng phê duyệt đa cấp và đối soát dòng tiền'
  },
  {
    order: 11,
    path: 'apps/vione_app_fe/src/components/dashboard/ExecutiveDashboard.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Cổng Web Quản Trị C-Level Executive Dashboard: Bảng điều hành tổng quan doanh nghiệp, trực quan hóa KPI dòng tiền, doanh thu bán vé VNPay và trạng thái vận hành thời gian thực'
  },
  {
    order: 12,
    path: 'apps/vione_app_fe/src/components/business-connect/mobile/ExecutiveHome.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Bàn điều hành Di động Lãnh đạo Executive Home: Widget lịch trình họp, phím tắt tác vụ nhanh 1-chạm, chỉ số kết nối kinh doanh và danh thiếp số vCard VIP trên smartphone'
  },
  {
    order: 13,
    path: 'apps/vione_app_fe/src/components/platform-app/SportTournamentHub.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Web/Mobile Giải đấu thể thao ViOne Sport: Bảng đấu, sơ đồ thi đấu loại trực tiếp, lịch thi đấu và bảng điểm thời gian thực'
  },
  {
    order: 14,
    path: 'apps/vione_app_fe/src/components/platform-app/RunRaceHub.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Web/Mobile Giải chạy ViOne Run Marathon: Tra cứu số BIB, sơ đồ đường chạy GPX, bảng xếp hạng Gun Time / Chip Time / Pace theo thời gian thực'
  },
  {
    order: 15,
    path: 'apps/vione_app_fe/src/components/platform-app/MuseumExplorer.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Web/Mobile Không gian bảo tàng số 3D ViOne Museum: Trình diễn mô hình 3D xoay 360 độ và trình phát thuyết minh 1-chạm NFC'
  },
  {
    order: 16,
    path: 'apps/vione_app_fe/src/components/platform-app/HeritageExplorer.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Web/Mobile Di sản văn hóa ViOne Heritage: Bản đồ GIS khoanh vùng di tích và số hóa tư liệu sắc phong cổ'
  },
  {
    order: 17,
    path: 'apps/vione_app_fe/src/components/platform-app/TicketWallet.tsx',
    lang: 'typescript-react',
    desc: 'Thành phần giao diện Ví vé sự kiện điện tử Ticket Wallet: Lưu trữ vé ngoại tuyến, hiển thị mã QR động chống chụp màn hình gian lận'
  },
  {
    order: 18,
    path: 'apps/mobile_vione/src/screens/platform/PlatformAppScreen.tsx',
    lang: 'typescript-react',
    desc: 'Màn hình di động Native tổng thể ViOne Mobile Platform: Điều hướng mượt mà giữa các phân hệ danh thiếp số vCard, thể thao, giải chạy, bảo tàng và di sản'
  }
];

function loadAllCodeFiles() {
  const loaded = [];
  for (const item of CODE_FILES) {
    if (fs.existsSync(item.path)) {
      const content = fs.readFileSync(item.path, 'utf-8');
      const lines = content.split('\n');
      loaded.push({
        ...item,
        linesCount: lines.length,
        codeLines: lines
      });
    } else {
      console.warn(`Warning: File not found: ${item.path}`);
    }
  }
  return loaded;
}

module.exports = {
  CODE_FILES,
  loadAllCodeFiles
};
