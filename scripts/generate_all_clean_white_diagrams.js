// scripts/generate_all_clean_white_diagrams.js
// Tạo toàn bộ 4 sơ đồ kiến trúc và luồng xử lý NỀN TRẮNG TINH KHIẾT (#FFFFFF)
// Mở rộng không gian, font chữ to rõ ràng, viền màu đậm nét, tuyệt đối không dùng nền đen

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = path.join(__dirname, '../document/images/evidence_v9');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// =========================================================================================
// DIAGRAM 1: KIẾN TRÚC TỔNG THỂ (OVERALL ARCHITECTURE - UNIWOrK STYLE NHƯNG RỘNG & TO RÕ)
// =========================================================================================
const htmlDiagram01 = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #0F172A;
    padding: 26px 36px;
    width: 2300px; height: 1420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-bar {
    text-align: center;
    margin-bottom: 20px;
  }
  .header-title {
    font-size: 40px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .header-sub {
    font-size: 22px;
    font-weight: 600;
    color: #8C653B;
    margin-top: 4px;
  }

  .main-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 32px;
    height: 1220px;
  }

  /* CỘT TRÁI */
  .left-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .side-box {
    border-radius: 14px;
    background: #FFFFFF;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .side-box.amber {
    border: 2.5px solid #F59E0B;
  }
  .side-box.teal {
    border: 2.5px solid #0D9488;
  }
  .side-title {
    padding: 12px 16px;
    font-size: 22px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  .side-box.amber .side-title {
    background: #FEF3C7;
    color: #92400E;
    border-bottom: 2px solid #FCD34D;
  }
  .side-box.teal .side-title {
    background: #CCFBF1;
    color: #115E59;
    border-bottom: 2px solid #5EEAD4;
  }
  .side-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    justify-content: space-around;
  }
  .item-card {
    border-radius: 10px;
    padding: 8px 14px;
    background: #FFFFFF;
  }
  .side-box.amber .item-card {
    border: 1.5px solid #FDE68A;
    background: #FFFDF5;
  }
  .side-box.teal .item-card {
    border: 1.5px solid #99F6E4;
    background: #F0FDFA;
  }
  .item-name {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .side-box.amber .item-name { color: #B45309; }
  .side-box.teal .item-name { color: #0F766E; }
  .item-desc {
    font-size: 15.5px;
    line-height: 1.45;
    color: #334155;
  }
  .side-note {
    text-align: center;
    font-size: 18.5px;
    font-style: italic;
    color: #64748B;
    padding: 8px 12px 10px;
    font-weight: 600;
  }

  /* KHU VỰC PHẢI */
  .right-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
    height: 100%;
  }

  /* TẦNG 1 */
  .tier-box {
    border-radius: 14px;
    background: #FFFFFF;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .tier-1 {
    border: 2.5px solid #10B981;
  }
  .legend-badge {
    font-size: 17.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 3px 10px;
    border-radius: 6px;
    align-self: flex-start;
  }
  .legend-green { background: #D1FAE5; color: #065F46; }
  .legend-blue { background: #DBEAFE; color: #1E40AF; }
  .legend-slate { background: #E2E8F0; color: #1E293B; }
  .legend-purple { background: #EDE9FE; color: #5B21B6; }

  .channel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .channel-card {
    border: 2px solid #A7F3D0;
    background: #F0FDF4;
    border-radius: 10px;
    padding: 14px 16px;
    text-align: center;
  }
  .channel-title {
    font-size: 15.5px;
    font-weight: 800;
    color: #047857;
    margin-bottom: 5px;
  }
  .channel-desc {
    font-size: 15.5px;
    line-height: 1.5;
    color: #334155;
  }

  /* TẦNG 2 */
  .tier-2 {
    border: 2.5px solid #3B82F6;
  }
  .ingress-inner {
    border: 1.5px solid #93C5FD;
    background: #EFF6FF;
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
  }
  .ingress-title {
    font-size: 24px;
    font-weight: 800;
    color: #1D4ED8;
    margin-bottom: 4px;
  }
  .ingress-desc {
    font-size: 24px;
    color: #1E3A8A;
    font-weight: 500;
  }

  /* TẦNG 3 */
  .tier-3 {
    border: 2.5px solid #94A3B8;
    background: #F8FAFC;
    flex: 1;
    gap: 12px;
  }
  .app-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .service-card {
    border-radius: 10px;
    padding: 8px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .service-card.blue { background: #EFF6FF; border: 1.5px solid #BFDBFE; }
  .service-card.red { background: #FFF1F2; border: 1.5px solid #FECDD3; }
  .service-card.green { background: #F0FDF4; border: 1.5px solid #BBF7D0; }
  .service-card.teal { background: #F0FDFA; border: 1.5px solid #99F6E4; }
  .service-card.amber { background: #FFFBEB; border: 1.5px solid #FDE68A; }
  .service-card.purple { background: #FAF5FF; border: 1.5px solid #E9D5FF; }
  .service-card.slate { background: #F1F5F9; border: 1.5px solid #CBD5E1; }

  .srv-title {
    font-size: 21px;
    font-weight: 800;
  }
  .service-card.blue .srv-title { color: #1E40AF; }
  .service-card.red .srv-title { color: #BE123C; }
  .service-card.green .srv-title { color: #15803D; }
  .service-card.teal .srv-title { color: #0F766E; }
  .service-card.amber .srv-title { color: #B45309; }
  .service-card.purple .srv-title { color: #7E22CE; }
  .service-card.slate .srv-title { color: #1E293B; }

  .srv-desc {
    font-size: 14.5px;
    line-height: 1.45;
    color: #475569;
  }
  .shared-core-box {
    background: #FFFFFF;
    border: 1.5px solid #CBD5E1;
    border-radius: 10px;
    padding: 10px 18px;
    text-align: center;
  }
  .shared-core-title {
    font-size: 17.5px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 3px;
  }
  .shared-core-desc {
    font-size: 18.5px;
    color: #475569;
  }

  /* TẦNG 4 */
  .bottom-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 18px;
    height: 165px;
  }
  .tier-data {
    border: 2.5px solid #A855F7;
    background: #FAF5FF;
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    flex: 1;
  }
  .data-card {
    background: #FFFFFF;
    border: 1.5px solid #DDD6FE;
    border-radius: 10px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  .data-title {
    font-size: 17.5px;
    font-weight: 800;
    color: #6B21A8;
    margin-bottom: 3px;
  }
  .data-desc {
    font-size: 14.5px;
    line-height: 1.4;
    color: #475569;
  }

  .tier-ext {
    border: 2.5px dashed #64748B;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ext-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    flex: 1;
  }
  .ext-card {
    background: #F8FAFC;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  .ext-title {
    font-size: 24px;
    font-weight: 800;
    color: #1E293B;
    margin-bottom: 2px;
  }
  .ext-desc {
    font-size: 17.5px;
    color: #64748B;
  }

  .arrow-flow {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 18.5px;
    font-weight: 700;
    color: #64748B;
    margin: -4px 0;
  }
  .arrow-flow svg {
    width: 16px;
    height: 16px;
    fill: #64748B;
  }
</style>
</head>
<body>

  <div class="header-bar">
    <div class="header-title">KIẾN TRÚC TỔNG THỂ PHẦN MỀM VIONE PLATFORM (HỢP NHẤT WEB CRM & APP MOBILE)</div>
    <div class="header-sub">Hệ Thống Phân Lớp Toàn Diện: Thiết Bị Hiện Trường · Kênh Người Dùng · Lớp Biên · Ứng Dụng NestJS · CSDL & Dịch Vụ Mở Rộng</div>
  </div>

  <div class="main-grid">
    <!-- CỘT TRÁI -->
    <div class="left-col">
      <div class="side-box amber" style="height: 595px;">
        <div class="side-title">THIẾT BỊ NGOẠI VI & HIỆN TRƯỜNG THỰC TẾ</div>
        <div class="side-body">
          <div class="item-card">
            <div class="item-name">Thẻ chip 1-Chạm NFC (NTAG213/215)</div>
            <div class="item-desc">Thẻ danh thiếp thông minh cá nhân, quầy bảo tàng số 3D, điểm chạm check-in đại biểu nhanh</div>
          </div>
          <div class="item-card">
            <div class="item-name">Mã QR Động & Vé Điện Tử</div>
            <div class="item-desc">Mã thanh toán VNPay-QR / ZaloPay, vé điện tử QR động chống sao chép và gian lận tại cổng</div>
          </div>
          <div class="item-card">
            <div class="item-name">Chip Timing RFID & Máy In POS</div>
            <div class="item-desc">Chip gắn số BIB giải chạy ViOne Run, máy in vé nhiệt POS tại quầy bán vé trực tiếp</div>
          </div>
          <div class="item-card">
            <div class="item-name">Thiết Bị Di Động Thông Minh</div>
            <div class="item-desc">Điện thoại thông minh iOS/Android của doanh nhân, đại biểu và vận động viên tham gia</div>
          </div>
        </div>
        <div class="side-note">Doanh nhân, đại biểu & VĐV mang thiết bị di động tương tác trực tiếp tại hiện trường</div>
      </div>

      <div class="side-box teal" style="height: 605px;">
        <div class="side-title">BÊN TRONG ỨNG DỤNG DI ĐỘNG VIONE</div>
        <div class="side-body">
          <div class="item-card">
            <div class="item-name">Mô-đun Đọc Thẻ NFC & FaceID</div>
            <div class="item-desc">Web NFC / iOS Core NFC, sinh trắc học FaceID/Vân tay xác thực phiên đăng nhập an toàn</div>
          </div>
          <div class="item-card">
            <div class="item-name">Bộ Quét Mã QR & Camera AI OCR</div>
            <div class="item-desc">Quét mã QR vé, quét camera bóc tách tự động thông tin danh thiếp giấy vào danh bạ số</div>
          </div>
          <div class="item-card">
            <div class="item-name">Trình Phát Audio Guide & Bảo Tàng 3D</div>
            <div class="item-desc">Three.js WebGL xoay lật cổ vật 360°, phát âm thanh thuyết minh đa ngữ theo vị trí GPS</div>
          </div>
          <div class="item-card">
            <div class="item-name">Ví Vé & CSDL Ngoại Tuyến (Offline)</div>
            <div class="item-desc">Lưu trữ SQLite / IndexedDB mã vé QR và danh bạ, hiển thị vé check-in ngay cả khi mất sóng</div>
          </div>
        </div>
        <div class="side-note">Xử lý phần cứng cảm biến, camera và đồng bộ dữ liệu ngoại tuyến</div>
      </div>
    </div>

    <!-- KHU VỰC PHẢI -->
    <div class="right-col">
      <!-- TẦNG 1 -->
      <div class="tier-box tier-1">
        <div class="legend-badge legend-green">KÊNH NGƯỜI DÙNG (USER CHANNELS & PRESENTATION TIER)</div>
        <div class="channel-grid">
          <div class="channel-card">
            <div class="channel-title">Ứng dụng di động ViOne (ViOne Connect)</div>
            <div class="channel-desc">Flutter / React Native · iOS / Android & PWA Web<br>CSDL ngoại tuyến SQLite · FaceID · NFC 1-Tap · AI OCR</div>
          </div>
          <div class="channel-card">
            <div class="channel-title">Cổng Web Quản trị ViOne Platform (CRM)</div>
            <div class="channel-desc">React 18 · TypeScript · Tailwind CSS · TanStack Table<br>Quản trị C-Level · Hồ sơ doanh nhân 360 · Phễu B2B · Tài chính</div>
          </div>
          <div class="channel-card">
            <div class="channel-title">Quầy Bán Vé & Điểm Check-in POS</div>
            <div class="channel-desc">Trình duyệt Web POS + Máy in vé nhiệt + Máy quét mã vạch<br>Bán vé cá nhân / vé đoàn · Check-in QR cổng tự động</div>
          </div>
        </div>
      </div>

      <div class="arrow-flow">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>HTTPS / TLS (Kênh truyền thông mã hóa an toàn 256-bit)</span>
      </div>

      <!-- TẦNG 2 -->
      <div class="tier-box tier-2">
        <div class="ingress-inner">
          <div class="ingress-title">Ingress / Reverse Proxy (vione-ssl-proxy / Nginx) — Cổng An Toàn HTTPS/TLS</div>
          <div class="ingress-desc">Định tuyến /api tới Backend · Phục vụ Frontend tĩnh · CDN Caching · Giới hạn 100 req/60s · SSL Let's Encrypt · CORS Policy · Chặn tấn công DDoS</div>
        </div>
      </div>

      <div class="arrow-flow">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>HTTPS / JSON (RESTful API & WebSocket Realtime Gateway)</span>
      </div>

      <!-- TẦNG 3 -->
      <div class="tier-box tier-3">
        <div class="legend-badge legend-slate">TẦNG ỨNG DỤNG — NESTJS API (REST / API SWAGGER / SOCKET.IO GATEWAY)</div>
        <div class="app-grid">
          <div class="service-card blue">
            <div class="srv-title">Xác thực & Phân quyền</div>
            <div class="srv-desc">JWT Access/Refresh, Argon2, RoleGuard RBAC đa vai trò (Admin, Manager, Member, Guest)</div>
          </div>
          <div class="service-card red">
            <div class="srv-title">Giao thương B2B & Deal</div>
            <div class="srv-desc">Phễu bán hàng Deals, báo giá, hợp đồng điện tử, quản trị đơn hàng & xuất hóa đơn</div>
          </div>
          <div class="service-card green">
            <div class="srv-title">Quản trị Doanh nhân & Thẻ</div>
            <div class="srv-desc">Hồ sơ 360, định danh số vCard, gắn thẻ phân nhóm, ma trận kết nối giao thương</div>
          </div>
          <div class="service-card teal">
            <div class="srv-title">Vé & Cổng Thanh toán</div>
            <div class="srv-desc">Phát hành vé QR động, thanh toán VNPay-QR, ZaloPay, đối soát ngân sách tự động</div>
          </div>
          <div class="service-card amber">
            <div class="srv-title">Sự kiện & Check-in QR</div>
            <div class="srv-desc">Tạo sự kiện, soát vé đa cổng realtime qua WebSocket, biểu quyết số, in thẻ đeo</div>
          </div>
          <div class="service-card purple">
            <div class="srv-title">Giải đấu Thể thao & Run</div>
            <div class="srv-desc">Bảng đấu ViOne Sport, gán chip RFID BIB, ghi nhận thành tích & xếp hạng tự động</div>
          </div>
          <div class="service-card teal">
            <div class="srv-title">Bảo tàng Số 3D & Di sản</div>
            <div class="srv-desc">Số hóa cổ vật 3D Photogrammetry, thuyết minh audio guide tự động theo GPS & NFC</div>
          </div>
          <div class="service-card slate">
            <div class="srv-title">Quản trị Hệ thống & Log</div>
            <div class="srv-desc">Nhật ký truy vết Audit Log, cấu hình thông báo Zalo ZNS/Push, backup định kỳ</div>
          </div>
        </div>

        <div class="shared-core-box">
          <div class="shared-core-title">Dịch Vụ Dùng Chung Nền Tảng (Platform Core Shared Services)</div>
          <div class="shared-core-desc">Prisma ORM · Kiểm tra dữ liệu ValidationPipe · Interceptor ghi nhật ký truy cập · Tác vụ hàng đợi BullMQ · Socket.IO Realtime Gateway · MinIO S3 SDK</div>
        </div>
      </div>

      <div class="arrow-flow">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>Kết nối CSDL Nội bộ & Dịch vụ Tích hợp Bên ngoài</span>
      </div>

      <!-- TẦNG 4 -->
      <div class="bottom-row">
        <div class="tier-data">
          <div class="legend-badge legend-purple">TẦNG CƠ SỞ DỮ LIỆU & LƯU TRỮ (DATA & STORAGE TIER)</div>
          <div class="data-grid">
            <div class="data-card">
              <div class="data-title">PostgreSQL 15 (vione_app)</div>
              <div class="data-desc">Doanh nhân, doanh nghiệp, đơn hàng, vé, giải chạy, audit log · Prisma Migration</div>
            </div>
            <div class="data-card">
              <div class="data-title">Kho tệp MinIO / S3 Storage</div>
              <div class="data-desc">Ảnh danh thiếp, hóa đơn chứng từ, file audio thuyết minh, mô hình cổ vật 3D GLTF</div>
            </div>
          </div>
        </div>

        <div class="tier-ext">
          <div class="legend-badge legend-slate">DỊCH VỤ TÍCH HỢP BÊN NGOÀI (EXTERNAL INTEGRATIONS)</div>
          <div class="ext-grid">
            <div class="ext-card">
              <div class="ext-title">Cổng VNPay & ZaloPay</div>
              <div class="ext-desc">Thanh toán trực tuyến & IPN Webhook</div>
            </div>
            <div class="ext-card">
              <div class="ext-title">Zalo OpenAPI & ZNS</div>
              <div class="ext-desc">Gửi thông báo vé QR xác nhận tức thì</div>
            </div>
            <div class="ext-card">
              <div class="ext-title">Apple Store / Google Play</div>
              <div class="ext-desc">Phát hành & cập nhật ứng dụng di động</div>
            </div>
            <div class="ext-card">
              <div class="ext-title">Dịch vụ AI OCR & Vision</div>
              <div class="ext-desc">Bóc tách dữ liệu danh thiếp tự động</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</body>
</html>`;


// =========================================================================================
// DIAGRAM 2: KIẾN TRÚC LOGIC NGHIỆP VỤ & LUỒNG DỮ LIỆU CRM (CRM WORKFLOW) - NỀN TRẮNG
// =========================================================================================
const htmlDiagram02 = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #0F172A;
    padding: 30px 40px;
    width: 2300px; height: 1420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-bar {
    text-align: center;
    margin-bottom: 24px;
  }
  .header-title {
    font-size: 40px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .header-sub {
    font-size: 22px;
    font-weight: 600;
    color: #8C653B;
    margin-top: 4px;
  }

  .workflow-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 1200px;
    justify-content: space-between;
  }

  .stage-row {
    border: 2.5px solid #CBD5E1;
    border-radius: 14px;
    background: #F8FAFC;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .stage-row.blue { border-color: #3B82F6; background: #F0F7FF; }
  .stage-row.green { border-color: #10B981; background: #F0FDF4; }
  .stage-row.amber { border-color: #F59E0B; background: #FFFDF5; }
  .stage-row.purple { border-color: #8B5CF6; background: #FAF5FF; }

  .stage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .stage-badge {
    font-size: 17.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 4px 12px;
    border-radius: 6px;
  }
  .badge-blue { background: #DBEAFE; color: #1E40AF; }
  .badge-green { background: #D1FAE5; color: #065F46; }
  .badge-amber { background: #FEF3C7; color: #92400E; }
  .badge-purple { background: #EDE9FE; color: #5B21B6; }

  .stage-desc {
    font-size: 21px;
    font-weight: 600;
    color: #475569;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .wf-card {
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .stage-row.blue .wf-card { border-color: #BFDBFE; }
  .stage-row.green .wf-card { border-color: #BBF7D0; }
  .stage-row.amber .wf-card { border-color: #FDE68A; }
  .stage-row.purple .wf-card { border-color: #DDD6FE; }

  .wf-step-num {
    font-size: 18.5px;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 4px;
    align-self: flex-start;
  }
  .num-blue { background: #EFF6FF; color: #1D4ED8; }
  .num-green { background: #ECFDF5; color: #047857; }
  .num-amber { background: #FFFBEB; color: #B45309; }
  .num-purple { background: #F5F3FF; color: #6D28D9; }

  .wf-title {
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
  }
  .wf-desc {
    font-size: 15.5px;
    line-height: 1.45;
    color: #475569;
  }

  .flow-arrow-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 800;
    color: #64748B;
  }
  .flow-arrow-row svg {
    width: 20px;
    height: 20px;
    fill: #64748B;
  }
</style>
</head>
<body>

  <div class="header-bar">
    <div class="header-title">SƠ ĐỒ KIẾN TRÚC LOGIC NGHIỆP VỤ & LUỒNG DỮ LIỆU CỔNG WEB QUẢN TRỊ CRM</div>
    <div class="header-sub">Quy Trình 4 Giai Đoạn Khép Kín: Tiếp Nhận & Phân Quyền · Vận Hành Giao Thương · Điều Phối Dịch Vụ Số · Phân Tích & Báo Cáo</div>
  </div>

  <div class="workflow-container">
    
    <!-- GIAI ĐOẠN 1 -->
    <div class="stage-row blue">
      <div class="stage-header">
        <span class="stage-badge badge-blue">GIAI ĐOẠN 1: XÁC THỰC, PHÂN QUYỀN RBAC & QUẢN TRỊ DANH BẠ DOANH NHÂN 360</span>
        <span class="stage-desc">Thiết lập danh tính số doanh nghiệp, kiểm soát truy cập và xây dựng mạng lưới đối tác</span>
      </div>
      <div class="cards-grid">
        <div class="wf-card">
          <span class="wf-step-num num-blue">BƯỚC 01</span>
          <div class="wf-title">Đăng Nhập Quản Trị Đa Yếu Tố</div>
          <div class="wf-desc">Xác thực Email/Mật khẩu băm Argon2, kiểm tra trạng thái kích hoạt tài khoản và phát sinh Access Token JWT (15 phút) + Refresh Token (7 ngày).</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-blue">BƯỚC 02</span>
          <div class="wf-title">Ma Trận Quyền Hạn RoleGuard</div>
          <div class="wf-desc">Đối soát ma trận quyền RBAC 5 cấp (Xem, Thêm, Sửa, Xóa, Duyệt) tương ứng các vai trò Admin, Ban Thư Ký, Kế Toán, Trưởng Ban Chuyên Môn.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-blue">BƯỚC 03</span>
          <div class="wf-title">Hồ Sơ Doanh Nhân 360 Độ</div>
          <div class="wf-desc">Quản lý trọn vẹn thông tin doanh nghiệp, người đại diện pháp luật, lĩnh vực hoạt động, phân hạng doanh nhân VIP và lịch sử tham gia cộng đồng.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-blue">BƯỚC 04</span>
          <div class="wf-title">Danh Thiếp Số vCard & QR Động</div>
          <div class="wf-desc">Tạo lập hồ sơ danh thiếp số vCard chuẩn quốc tế, phát sinh mã QR động đa tầng phục vụ chia sẻ đối tác và kết nối giao thương tức thì.</div>
        </div>
      </div>
    </div>

    <div class="flow-arrow-row">
      <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
      <span>Luân chuyển dữ liệu doanh nhân sang Phễu Bán hàng & Quản lý Tài chính Doanh nghiệp</span>
    </div>

    <!-- GIAI ĐOẠN 2 -->
    <div class="stage-row green">
      <div class="stage-header">
        <span class="stage-badge badge-green">GIAI ĐOẠN 2: QUẢN TRỊ CƠ HỘI KINH DOANH B2B, HỢP ĐỒNG & TÀI CHÍNH</span>
        <span class="stage-desc">Quản trị toàn diện phễu bán hàng, tự động đối soát ngân sách và thanh toán hóa đơn</span>
      </div>
      <div class="cards-grid">
        <div class="wf-card">
          <span class="wf-step-num num-green">BƯỚC 05</span>
          <div class="wf-title">Phễu Bán Hàng & Deals B2B</div>
          <div class="wf-desc">Theo dõi 5 giai đoạn đàm phán: Tiềm năng -> Khảo sát -> Đề xuất báo giá -> Thương thảo -> Ký hợp đồng thành công (Won Deal).</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-green">BƯỚC 06</span>
          <div class="wf-title">Gian Hàng & Sàn Thương Mại B2B</div>
          <div class="wf-desc">Duyệt hồ sơ đăng ký sản phẩm OCOP, dịch vụ ẩm thực, lưu trú; quản lý bảng giá ưu đãi dành riêng cho mạng lưới đối tác thành viên.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-green">BƯỚC 07</span>
          <div class="wf-title">Thu Chi & Kế Toán Quỹ Hội</div>
          <div class="wf-desc">Ghi nhận phiếu thu, ủy nhiệm chi, phân loại danh mục ngân quỹ minh bạch, kiểm soát dòng tiền đóng phí thường niên định kỳ của doanh nhân.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-green">BƯỚC 08</span>
          <div class="wf-title">Thanh Toán Trực Tuyến VNPay</div>
          <div class="wf-desc">Tạo liên kết thanh toán có chữ ký băm HMAC-SHA512, tiếp nhận Webhook IPN xử lý giao dịch tự động trong một Transaction duy nhất.</div>
        </div>
      </div>
    </div>

    <div class="flow-arrow-row">
      <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
      <span>Tích hợp sang Sự kiện, Giải đấu Thể thao, Số hóa Di sản & Phát hành Vé</span>
    </div>

    <!-- GIAI ĐOẠN 3 -->
    <div class="stage-row amber">
      <div class="stage-header">
        <span class="stage-badge badge-amber">GIAI ĐOẠN 3: ĐIỀU HÀNH SỰ KIỆN, VÉ ĐIỆN TỬ, GIẢI ĐẤU & BẢO TÀNG SỐ 3D</span>
        <span class="stage-desc">Vận hành các tiện ích cao cấp phục vụ đại hội, giải chạy và trải nghiệm văn hóa số</span>
      </div>
      <div class="cards-grid">
        <div class="wf-card">
          <span class="wf-step-num num-amber">BƯỚC 09</span>
          <div class="wf-title">Cấu Hình Sự Kiện & Sơ Đồ Ghế</div>
          <div class="wf-desc">Tạo lập sự kiện, đại hội cổ đông, thiết lập các hạng vé (Standard, VIP, Diamond) và số lượng vé phát hành tối đa cho từng phiên.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-amber">BƯỚC 10</span>
          <div class="wf-title">Check-in Soát Vé Đa Điểm Realtime</div>
          <div class="wf-desc">Đồng bộ tức thời tình trạng check-in qua WebSocket Socket.IO; ngăn chặn tuyệt đối tình trạng 1 vé quét tại 2 cửa cùng lúc.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-amber">BƯỚC 11</span>
          <div class="wf-title">Giải Đấu ViOne Sport & ViOne Run</div>
          <div class="wf-desc">Tạo bảng thi đấu vòng tròn/loại trực tiếp; gán chip RFID BIB vận động viên, đối soát cổng tính giờ tự động và bảng xếp hạng Leaderboard.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-amber">BƯỚC 12</span>
          <div class="wf-title">Bảo Tàng Số 3D & Di Sản Văn Hóa</div>
          <div class="wf-desc">Quản trị kho hiện vật 3D GLTF/GLB, tọa độ GPS di tích, nội dung thuyết minh âm thanh đa ngữ gắn với chip thẻ NFC tại điểm dừng.</div>
        </div>
      </div>
    </div>

    <div class="flow-arrow-row">
      <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
      <span>Tổng hợp số liệu điều hành lên Bảng chỉ số Dashboard & Báo cáo Kiểm toán</span>
    </div>

    <!-- GIAI ĐOẠN 4 -->
    <div class="stage-row purple">
      <div class="stage-header">
        <span class="stage-badge badge-purple">GIAI ĐOẠN 4: PHÂN TÍCH CHỈ SỐ C-LEVEL, AN TOÀN DỮ LIỆU & AUDIT LOG</span>
        <span class="stage-desc">Báo cáo điều hành chuyên sâu, nhật ký an ninh bảo mật và xuất bản tài liệu</span>
      </div>
      <div class="cards-grid">
        <div class="wf-card">
          <span class="wf-step-num num-purple">BƯỚC 13</span>
          <div class="wf-title">Bảng Điều Hành C-Level Dashboard</div>
          <div class="wf-desc">Biểu đồ trực quan hóa doanh thu, tốc độ tăng trưởng doanh nhân, tỷ lệ chuyển đổi Deals và số dư ngân quỹ realtime.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-purple">BƯỚC 14</span>
          <div class="wf-title">Nhật Ký Truy Vết An Ninh (Audit Log)</div>
          <div class="wf-desc">Ghi nhận chi tiết địa chỉ IP, User-Agent, thời điểm và nội dung từng thao tác chỉnh sửa dữ liệu trọng yếu, bảo vệ tính toàn vẹn hệ thống.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-purple">BƯỚC 15</span>
          <div class="wf-title">Gửi Thông Báo Tự Động Zalo ZNS</div>
          <div class="wf-desc">Tự động phát lệnh qua Zalo OpenAPI gửi xác nhận vé điện tử, nhắc lịch sự kiện và hóa đơn đóng phí về tài khoản cá nhân doanh nhân.</div>
        </div>
        <div class="wf-card">
          <span class="wf-step-num num-purple">BƯỚC 16</span>
          <div class="wf-title">Xuất Báo Cáo Tài Chính Chuẩn Mực</div>
          <div class="wf-desc">Hỗ trợ kết xuất báo cáo đa định dạng (Excel, PDF) phục vụ đại hội tổng kết năm và quyết toán tài chính định kỳ theo quy định pháp luật.</div>
        </div>
      </div>
    </div>

  </div>

</body>
</html>`;


// =========================================================================================
// DIAGRAM 3: KIẾN TRÚC XỬ LÝ & LUỒNG TRẢI NGHIỆM APP MOBILE - NỀN TRẮNG
// =========================================================================================
const htmlDiagram03 = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #0F172A;
    padding: 30px 40px;
    width: 2300px; height: 1420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-bar {
    text-align: center;
    margin-bottom: 24px;
  }
  .header-title {
    font-size: 40px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .header-sub {
    font-size: 22px;
    font-weight: 600;
    color: #0D9488;
    margin-top: 4px;
  }

  .app-arch-grid {
    display: grid;
    grid-template-columns: 1fr 1.3fr 1fr;
    gap: 24px;
    height: 1200px;
  }

  .col-container {
    border-radius: 14px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .col-1 { border: 2.5px solid #F59E0B; }
  .col-2 { border: 2.5px solid #0D9488; }
  .col-3 { border: 2.5px solid #3B82F6; }

  .col-header {
    padding: 14px 18px;
    font-size: 24px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    text-align: center;
  }
  .col-1 .col-header { background: #FEF3C7; color: #92400E; border-bottom: 2px solid #FCD34D; }
  .col-2 .col-header { background: #CCFBF1; color: #115E59; border-bottom: 2px solid #5EEAD4; }
  .col-3 .col-header { background: #DBEAFE; color: #1E40AF; border-bottom: 2px solid #93C5FD; }

  .col-body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    justify-content: space-around;
  }

  .app-module-card {
    border-radius: 10px;
    padding: 14px 16px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    gap: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .col-1 .app-module-card { border: 1.5px solid #FDE68A; background: #FFFDF5; }
  .col-2 .app-module-card { border: 1.5px solid #99F6E4; background: #F0FDFA; }
  .col-3 .app-module-card { border: 1.5px solid #BFDBFE; background: #F0F7FF; }

  .card-badge {
    font-size: 14.5px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    align-self: flex-start;
  }
  .col-1 .card-badge { background: #FEF3C7; color: #B45309; }
  .col-2 .card-badge { background: #CCFBF1; color: #0F766E; }
  .col-3 .card-badge { background: #DBEAFE; color: #1D4ED8; }

  .card-heading {
    font-size: 22px;
    font-weight: 800;
    color: #0F172A;
  }
  .card-detail {
    font-size: 15.5px;
    line-height: 1.45;
    color: #475569;
  }

  .col-footer-tag {
    text-align: center;
    font-size: 18.5px;
    font-style: italic;
    color: #64748B;
    padding: 10px 14px;
    font-weight: 600;
    border-top: 1px solid #E2E8F0;
  }
</style>
</head>
<body>

  <div class="header-bar">
    <div class="header-title">SƠ ĐỒ KIẾN TRÚC XỬ LÝ & LUỒNG TRẢI NGHIỆM ỨNG DỤNG DI ĐỘNG VIONE</div>
    <div class="header-sub">Mô Hình 3 Trục: Cảm Biến Hiện Trường & Phần Cứng · Động Cơ Lõi Ngoại Tuyến · Đồng Bộ Đám Mây & Thời Gian Thực</div>
  </div>

  <div class="app-arch-grid">
    
    <!-- TRỤC 1: PHẦN CỨNG & CẢM BIẾN HIỆN TRƯỜNG -->
    <div class="col-container col-1">
      <div class="col-header">TRỤC 1: CẢM BIẾN & PHẦN CỨNG HIỆN TRƯỜNG</div>
      <div class="col-body">
        
        <div class="app-module-card">
          <span class="card-badge">GIAO TIẾP VẬT LÝ</span>
          <div class="card-heading">1. Chạm 1-Tap Thẻ Chip NFC NTAG</div>
          <div class="card-detail">Kích hoạt bộ đọc Web NFC / Core NFC, quét chuỗi UID thẻ NTAG213/215 gắn trên quầy di tích hoặc danh thiếp vật lý, mở ngay nội dung số tương ứng.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">THỊ GIÁC MÁY TÍNH</span>
          <div class="card-heading">2. Quét Camera AI OCR & QR Động</div>
          <div class="card-detail">Camera quét mã QR vé check-in cổng; bóc tách thông tin danh thiếp giấy qua mô hình AI OCR On-Device, tự động điền họ tên, số điện thoại, công ty.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">BẢO MẬT SINH TRẮC</span>
          <div class="card-heading">3. Xác Thực FaceID & Vân Tay</div>
          <div class="card-detail">Tích hợp phần cứng bảo mật Apple Keychain / Android Keystore; yêu cầu quét sinh trắc học khi mở ví vé, chuyển nhượng quyền hoặc đổi thông tin cá nhân.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">ĐỊNH VỊ VỆ TINH</span>
          <div class="card-heading">4. GPS Geofencing Thuyết Minh Tự Động</div>
          <div class="card-detail">Dịch vụ ngầm theo dõi tọa độ GPS với thuật toán Haversine; tự động phát bài audio thuyết minh khi khoảng cách tới di tích nhỏ hơn bán kính thiết lập (20m).</div>
        </div>

      </div>
      <div class="col-footer-tag">Tương tác trực tiếp với phần cứng thiết bị di động tại hiện trường</div>
    </div>

    <!-- TRỤC 2: ĐỘNG CƠ LÕI & XỬ LÝ NGOẠI TUYẾN -->
    <div class="col-container col-2">
      <div class="col-header">TRỤC 2: ĐỘNG CƠ LÕI & XỬ LÝ NGOẠI TUYẾN (OFFLINE-FIRST)</div>
      <div class="col-body">
        
        <div class="app-module-card">
          <span class="card-badge">TRÌNH DIỄN GIAO DIỆN</span>
          <div class="card-heading">5. Giao Diện Điều Hành C-Level & VActionSheet</div>
          <div class="card-detail">Trang chủ Executive Home hiển thị chỉ số, danh thiếp vCard mạ vàng, menu điều phối 3D VActionSheet thao tác nhanh chỉ với 1 ngón tay cái.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">CSDL THIẾT BỊ</span>
          <div class="card-heading">6. Kho Dữ Liệu Ngoại Tuyến SQLite / IndexedDB</div>
          <div class="card-detail">Lưu trữ cục bộ toàn bộ danh bạ doanh nhân, thông tin vé điện tử đã mua và tệp audio thuyết minh, cho phép xem vé và check-in ngay cả khi mất sóng hoàn toàn.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">VÍ VÉ THÔNG MINH</span>
          <div class="card-heading">7. Ví Vé Điện Tử & Mã QR Động Chống Gian Lận</div>
          <div class="card-detail">Sinh mã QR vé động có thời gian sống ngắn (TOTP 60 giây), mã hóa nội dung bằng chữ ký số bất đối xứng, vô hiệu hóa việc chụp màn hình vé để chia sẻ lậu.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">KHÔNG GIAN SỐ 3D</span>
          <div class="card-heading">8. Trình Khám Phá 3D WebGL & Âm Thanh Nền</div>
          <div class="card-detail">Engine Three.js WebGL dựng mô hình cổ vật 3D Photogrammetry xoay 360 độ mượt mà; dịch vụ Background Audio Service duy trì phát audio khi khóa màn hình.</div>
        </div>

      </div>
      <div class="col-footer-tag">Đảm bảo trải nghiệm tức thì, mượt mà và hoạt động tin cậy khi offline</div>
    </div>

    <!-- TRỤC 3: KẾT NỐI MẠNG & ĐỒNG BỘ ĐÁM MÂY -->
    <div class="col-container col-3">
      <div class="col-header">TRỤC 3: GIAO TIẾP MẠNG & ĐỒNG BỘ ĐÁM MÂY</div>
      <div class="col-body">
        
        <div class="app-module-card">
          <span class="card-badge">BẢO MẬT ĐƯỜNG TRUYỀN</span>
          <div class="card-heading">9. RESTful Client & SSL Pinning An Toàn</div>
          <div class="card-detail">Thư viện Axios cấu hình gắn chứng chỉ SSL Pinning, tự động đính kèm Bearer JWT, tự động bắt lỗi mã 401 để kích hoạt cơ chế Refresh Token ngầm.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">KẾT NỐI REALTIME</span>
          <div class="card-heading">10. WebSocket Gateway & Kênh Sự Kiện Realtime</div>
          <div class="card-detail">Duy trì kết nối thường trực Socket.IO; nhận tín hiệu biểu quyết số, cập nhật tức thì tỷ số trận đấu ViOne Sport và thời gian về đích giải chạy ViOne Run.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">THÔNG BÁO ĐẨY</span>
          <div class="card-heading">11. Dịch Vụ Push Notification (FCM / APNs)</div>
          <div class="card-detail">Tiếp nhận thông báo tin nhắn mới, lịch hẹn giao thương, lời mời sự kiện từ ban tổ chức và thông báo khẩn từ hệ thống qua Apple APNs và Google FCM.</div>
        </div>

        <div class="app-module-card">
          <span class="card-badge">ĐỒNG BỘ TỰ ĐỘNG</span>
          <div class="card-heading">12. Hàng Đợi Đồng Bộ Hai Chiều (Sync Queue)</div>
          <div class="card-detail">Ghi nhận các tác vụ ngoại tuyến (đánh dấu yêu thích, ghi chú, quét danh thiếp) vào hàng đợi; tự động phát lệnh đồng bộ lên PostgreSQL ngay khi phát hiện có mạng.</div>
        </div>

      </div>
      <div class="col-footer-tag">Liên lạc thời gian thực và đồng bộ dữ liệu toàn vẹn với máy chủ đám mây</div>
    </div>

  </div>

</body>
</html>`;


// =========================================================================================
// DIAGRAM 4: KIẾN TRÚC TRIỂN KHAI PHÂN LẬP & AN TOÀN HẠ TẦNG (DEPLOYMENT) - NỀN TRẮNG
// =========================================================================================
const htmlDiagram04 = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #0F172A;
    padding: 30px 40px;
    width: 2300px; height: 1420px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-bar {
    text-align: center;
    margin-bottom: 24px;
  }
  .header-title {
    font-size: 40px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .header-sub {
    font-size: 22px;
    font-weight: 600;
    color: #1E40AF;
    margin-top: 4px;
  }

  .deploy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    height: 1200px;
  }

  .env-container {
    border-radius: 14px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .env-dev { border: 2.5px solid #F59E0B; }
  .env-prod { border: 2.5px solid #10B981; }

  .env-header {
    padding: 16px 20px;
    font-size: 21px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    text-align: center;
  }
  .env-dev .env-header { background: #FEF3C7; color: #92400E; border-bottom: 2px solid #FCD34D; }
  .env-prod .env-header { background: #D1FAE5; color: #065F46; border-bottom: 2px solid #6EE7B7; }

  .env-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    justify-content: space-around;
  }

  .deploy-card {
    border-radius: 10px;
    padding: 16px 18px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .env-dev .deploy-card { border: 1.5px solid #FDE68A; background: #FFFDF5; }
  .env-prod .deploy-card { border: 1.5px solid #A7F3D0; background: #F0FDF4; }

  .deploy-badge {
    font-size: 18.5px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    align-self: flex-start;
  }
  .env-dev .deploy-badge { background: #FEF3C7; color: #B45309; }
  .env-prod .deploy-badge { background: #D1FAE5; color: #047857; }

  .deploy-name {
    font-size: 24px;
    font-weight: 800;
    color: #0F172A;
  }
  .deploy-desc {
    font-size: 24px;
    line-height: 1.5;
    color: #334155;
  }
  .deploy-url {
    font-family: Consolas, monospace;
    font-size: 18.5px;
    font-weight: 700;
    color: #0284C7;
    margin-top: 2px;
  }

  .env-footer {
    text-align: center;
    font-size: 15.5px;
    font-weight: 700;
    padding: 12px 16px;
    border-top: 1px solid #E2E8F0;
  }
  .env-dev .env-footer { color: #B45309; background: #FFFBEB; }
  .env-prod .env-footer { color: #047857; background: #ECFDF5; }
</style>
</head>
<body>

  <div class="header-bar">
    <div class="header-title">SƠ ĐỒ KIẾN TRÚC TRIỂN KHAI PHÂN LẬP DEV VS PRODUCTION VÀ AN TOÀN HẠ TẦNG</div>
    <div class="header-sub">Nguyên Tắc Phân Lập Độc Lập Giữa Môi Trường Thử Nghiệm Kèm Cổng & Môi Trường Vận Hành Subdomain Chính Thức</div>
  </div>

  <div class="deploy-grid">
    
    <!-- DEV ENVIRONMENT -->
    <div class="env-container env-dev">
      <div class="env-header">MÔI TRƯỜNG MÁY CHỦ PHÁT TRIỂN (DEVELOPMENT SERVER)</div>
      <div class="env-body">
        
        <div class="deploy-card">
          <span class="deploy-badge">CỔNG DEV CHUYÊN BIỆT</span>
          <div class="deploy-name">1. ViOne Mobile App Dev</div>
          <div class="deploy-desc">Môi trường kiểm thử tính năng mới của ứng dụng di động ViOne PWA; cập nhật giao diện, kiểm thử tính năng vé và mạng lưới đối tác.</div>
          <div class="deploy-url">URL: https://dev-vione.14-225-217-232.sslip.io:5445 (Port 5010 HTTP)</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">CỔNG DEV CHUYÊN BIỆT</span>
          <div class="deploy-name">2. ViOne CRM Enterprise Dev</div>
          <div class="deploy-desc">Môi trường thử nghiệm phân hệ quản trị C-Level, phễu bán hàng Deals và đối soát kế toán trước khi đẩy bản dựng lên môi trường chính thức.</div>
          <div class="deploy-url">URL: https://dev-vione-crm.14-225-217-232.sslip.io:5446 (Port 5006 HTTP)</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">CƠ CHẾ ĐIỀU PHỐI</span>
          <div class="deploy-name">3. Điều Phối Kịch Bản Fast Deploy Dev</div>
          <div class="deploy-desc">Sử dụng kịch bản fast-deploy.ps1 đóng gói container Docker độc lập; gán biến môi trường TargetEnv='dev' phân tách triệt để với Subdomain Prod.</div>
          <div class="deploy-url">Script: ./deploy-vione.ps1 & ./deploy-crm.ps1</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">CSDL THỬ NGHIỆM</span>
          <div class="deploy-name">4. Cơ Sở Dữ Liệu Dev Sandbox</div>
          <div class="deploy-desc">Chạy CSDL kiểm thử độc lập; hỗ trợ chạy migration cấu trúc bảng mới qua Prisma Migrate mà không ảnh hưởng tới dữ liệu thực tế của doanh nghiệp.</div>
          <div class="deploy-url">PostgreSQL Sandbox Port 5432 · Schema vione_dev</div>
        </div>

      </div>
      <div class="env-footer">Môi trường phát triển và nghiệm thu tính năng dành cho Đội ngũ Kỹ thuật</div>
    </div>

    <!-- PRODUCTION ENVIRONMENT -->
    <div class="env-container env-prod">
      <div class="env-header">MÔI TRƯỜNG CHÍNH THỨC SUBDOMAIN (PRODUCTION CLUSTER)</div>
      <div class="env-body">
        
        <div class="deploy-card">
          <span class="deploy-badge">SUBDOMAIN CHÍNH THỨC</span>
          <div class="deploy-name">1. Ứng Dụng Di Động ViOne App Prod</div>
          <div class="deploy-desc">Cổng ứng dụng PWA & Mobile chính thức phục vụ doanh nhân kết nối giao thương, quản lý danh thiếp vCard, chạm thẻ NFC và check-in sự kiện.</div>
          <div class="deploy-url">URL Chính Thức: https://vione.viconnect.vn/ (Cổng chuẩn 443 SSL)</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">SUBDOMAIN CHÍNH THỨC</span>
          <div class="deploy-name">2. Cổng Web Quản Trị ViOne CRM Prod</div>
          <div class="deploy-desc">Cổng Web Quản trị doanh nghiệp chính thức phục vụ Ban Điều Hành; vận hành phễu bán hàng Deals, thu chi ngân sách và quản lý sự kiện.</div>
          <div class="deploy-url">URL Chính Thức: https://crm_vione.viconnect.vn/ (Cổng chuẩn 443 SSL)</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">CỤM PROXY ĐỘC LẬP</span>
          <div class="deploy-name">3. Cụm Proxy vione-ssl-proxy & Let's Encrypt</div>
          <div class="deploy-desc">Tách biệt hoàn toàn với hệ thống khác; tự động cấp chứng chỉ SSL Let's Encrypt 90 ngày, nén dữ liệu Gzip, giới hạn tần suất chống tấn công DDoS.</div>
          <div class="deploy-url">Container: vione-ssl-proxy · Cổng 80 & 443 SSL</div>
        </div>

        <div class="deploy-card">
          <span class="deploy-badge">DỰ PHÒNG & AN TOÀN</span>
          <div class="deploy-name">4. Sao Lưu Định Kỳ 6H & Khắc Phục Thảm Họa</div>
          <div class="deploy-desc">Sao lưu tự động CSDL PostgreSQL và thư mục tệp MinIO chu kỳ 6 giờ/lần; lưu trữ 30 ngày an toàn; cam kết chỉ số phục hồi RTO &lt; 15 phút, RPO &lt; 6 giờ.</div>
          <div class="deploy-url">Backup Script: pg_dump tự động + Đồng bộ Cloud Storage an toàn</div>
        </div>

      </div>
      <div class="env-footer">Môi trường vận hành thương mại bảo mật cao đạt chuẩn an toàn doanh nghiệp</div>
    </div>

  </div>

</body>
</html>`;

const DIAGRAMS = [
  { fileName: 'diagram_01_overall_architecture.png', html: htmlDiagram01, title: 'Sơ đồ Kiến trúc Tổng thể Nền tảng ViOne' },
  { fileName: 'diagram_02_crm_workflow.png', html: htmlDiagram02, title: 'Sơ đồ Logic Nghiệp vụ & Luồng Dữ liệu CRM' },
  { fileName: 'diagram_03_mobile_app_architecture.png', html: htmlDiagram03, title: 'Sơ đồ Kiến trúc Xử lý & Luồng Trải nghiệm App' },
  { fileName: 'diagram_04_deployment_topology.png', html: htmlDiagram04, title: 'Sơ đồ Kiến trúc Triển khai Phân lập & An toàn' }
];

(async () => {
  console.log('========================================================================');
  console.log('=== KHỞI CHẠY TẠO 4 SƠ ĐỒ KIẾN TRÚC VIONE NỀN TRẮNG TINH KHIẾT (#FFFFFF) ===');
  console.log('=== KHÔNG GIAN RỘNG RÃI, CHỮ TO RÕ RÀNG, SẮC NÉT CHUẨN MỰC TÀI LIỆU   ===');
  console.log('========================================================================');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const diag of DIAGRAMS) {
    const context = await browser.newContext({
      viewport: { width: 2300, height: 1420 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    await page.setContent(diag.html);

    const outFile = path.join(outDir, diag.fileName);
    await page.screenshot({ path: outFile, fullPage: true });
    await context.close();

    const stat = fs.statSync(outFile);
    console.log(`Đã tạo thành công: ${diag.fileName} (${(stat.size / 1024).toFixed(1)} KB) - ${diag.title}`);
  }

  await browser.close();
  console.log('=== HOÀN TẤT TẠO TOÀN BỘ 4 SƠ ĐỒ NỀN TRẮNG TINH KHIẾT ===');
})();

