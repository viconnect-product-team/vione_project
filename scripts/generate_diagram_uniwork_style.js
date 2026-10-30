// scripts/generate_diagram_uniwork_style.js
// Tạo sơ đồ kiến trúc tổng thể ViOne Platform chuẩn 100% phong cách Uniwork (Ảnh 1)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = path.join(__dirname, '../document/images/evidence_v9');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1E293B;
    padding: 24px 30px;
    width: 2048px;
    height: 1228px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .diagram-title {
    text-align: center;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #0F172A;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .main-layout {
    display: grid;
    grid-template-columns: 370px 1fr;
    gap: 28px;
    height: 1120px;
    position: relative;
  }

  /* SIDEBAR (CỘT TRÁI) */
  .sidebar-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .side-box {
    border-radius: 12px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .side-box.amber {
    border: 2px solid #E8A87C;
  }
  .side-box.teal {
    border: 2px solid #78C2AD;
  }

  .side-header {
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  .side-box.amber .side-header {
    background: #FFF4EB;
    color: #9A3412;
    border-bottom: 1.5px solid #FDBA74;
  }
  .side-box.teal .side-header {
    background: #E8F8F5;
    color: #0F766E;
    border-bottom: 1.5px solid #99F6E4;
  }

  .side-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    justify-content: space-around;
  }

  .item-card {
    border-radius: 8px;
    padding: 10px 12px;
    background: #FFFFFF;
  }
  .side-box.amber .item-card {
    border: 1.5px solid #FDBA74;
    background: #FFFDF9;
  }
  .side-box.teal .item-card {
    border: 1.5px solid #99F6E4;
    background: #F7FEFC;
  }

  .item-card-title {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .side-box.amber .item-card-title { color: #9A3412; }
  .side-box.teal .item-card-title { color: #0F766E; }

  .item-card-desc {
    font-size: 11px;
    line-height: 1.4;
    color: #475569;
  }

  .side-footer-note {
    text-align: center;
    font-size: 11px;
    font-style: italic;
    color: #64748B;
    padding: 6px 10px 8px;
  }

  /* KHU VỰC CHÍNH (BÊN PHẢI) */
  .center-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }

  /* TẦNG 1: KÊNH NGƯỜI DÙNG */
  .tier-channel {
    border: 2px solid #85D2A0;
    border-radius: 12px;
    background: #FFFFFF;
    padding: 12px 14px;
    position: relative;
  }
  .tier-legend {
    font-size: 13px;
    font-weight: 800;
    color: #166534;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    display: inline-block;
    padding: 2px 8px;
    background: #EBF8F0;
    border-radius: 4px;
  }
  .channel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .channel-card {
    border: 1.5px solid #A7F3D0;
    background: #F0FDF4;
    border-radius: 8px;
    padding: 12px 14px;
    text-align: center;
  }
  .channel-card-title {
    font-size: 14px;
    font-weight: 800;
    color: #15803D;
    margin-bottom: 4px;
  }
  .channel-card-desc {
    font-size: 11.5px;
    line-height: 1.45;
    color: #334155;
  }

  /* TẦNG 2: INGRESS / REVERSE PROXY */
  .tier-ingress {
    border: 2px solid #85BEE8;
    border-radius: 12px;
    background: #FFFFFF;
    padding: 10px 14px;
  }
  .ingress-box {
    border: 1.5px solid #93C5FD;
    background: #EFF6FF;
    border-radius: 8px;
    padding: 10px 16px;
    text-align: center;
  }
  .ingress-title {
    font-size: 14px;
    font-weight: 800;
    color: #1D4ED8;
    margin-bottom: 4px;
  }
  .ingress-desc {
    font-size: 11.5px;
    color: #1E3A8A;
  }

  /* TẦNG 3: APPLICATION NESTJS API */
  .tier-app {
    border: 2px solid #CBD5E1;
    border-radius: 12px;
    background: #F8FAFC;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }
  .app-legend {
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    padding: 2px 8px;
    background: #E2E8F0;
    border-radius: 4px;
    align-self: flex-start;
  }
  .app-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .service-card {
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .service-card.blue {
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
  }
  .service-card.red {
    background: #FFF1F2;
    border: 1.5px solid #FECDD3;
  }
  .service-card.green {
    background: #F0FDF4;
    border: 1.5px solid #BBF7D0;
  }
  .service-card.teal {
    background: #F0FDFA;
    border: 1.5px solid #99F6E4;
  }
  .service-card.amber {
    background: #FFFBEB;
    border: 1.5px solid #FDE68A;
  }
  .service-card.purple {
    background: #FAF5FF;
    border: 1.5px solid #E9D5FF;
  }
  .service-card.slate {
    background: #F1F5F9;
    border: 1.5px solid #CBD5E1;
  }

  .service-title {
    font-size: 12.5px;
    font-weight: 800;
  }
  .service-card.blue .service-title { color: #1E40AF; }
  .service-card.red .service-title { color: #BE123C; }
  .service-card.green .service-title { color: #15803D; }
  .service-card.teal .service-title { color: #0F766E; }
  .service-card.amber .service-title { color: #B45309; }
  .service-card.purple .service-title { color: #7E22CE; }
  .service-card.slate .service-title { color: #334155; }

  .service-desc {
    font-size: 10.5px;
    line-height: 1.4;
    color: #475569;
  }

  .shared-service-box {
    background: #FFFFFF;
    border: 1.5px solid #CBD5E1;
    border-radius: 8px;
    padding: 8px 14px;
    text-align: center;
  }
  .shared-title {
    font-size: 12.5px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 2px;
  }
  .shared-desc {
    font-size: 11px;
    color: #475569;
  }

  /* TẦNG 4: DATA & EXTERNAL */
  .tier-bottom-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 14px;
    height: 145px;
  }
  .tier-data {
    border: 2px solid #C4B5FD;
    border-radius: 12px;
    background: #FAF5FF;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .data-legend {
    font-size: 12.5px;
    font-weight: 800;
    color: #6D28D9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    flex: 1;
  }
  .data-card {
    background: #FFFFFF;
    border: 1.5px solid #DDD6FE;
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  .data-card-title {
    font-size: 12.5px;
    font-weight: 800;
    color: #5B21B6;
    margin-bottom: 2px;
  }
  .data-card-desc {
    font-size: 10.5px;
    line-height: 1.35;
    color: #475569;
  }

  .tier-external {
    border: 2px dashed #94A3B8;
    border-radius: 12px;
    background: #FFFFFF;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ext-legend {
    font-size: 12.5px;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
  .ext-card-title {
    font-size: 12px;
    font-weight: 800;
    color: #334155;
    margin-bottom: 2px;
  }
  .ext-card-desc {
    font-size: 10px;
    color: #64748B;
  }

  /* ARROWS OVERLAY */
  .arrow-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    margin: -4px 0;
  }
  .arrow-indicator svg {
    width: 14px;
    height: 14px;
    fill: #94A3B8;
  }
</style>
</head>
<body>

  <div class="diagram-title">KIẾN TRÚC TỔNG THỂ PHẦN MỀM VIONE PLATFORM (HỢP NHẤT WEB CRM & APP MOBILE)</div>

  <div class="main-layout">
    
    <!-- CỘT TRÁI -->
    <div class="sidebar-col">
      <!-- KHỐI 1: HIỆN TRƯỜNG & NGOẠI VI -->
      <div class="side-box amber" style="height: 520px;">
        <div class="side-header">THIẾT BỊ NGOẠI VI & HIỆN TRƯỜNG THỰC TẾ</div>
        <div class="side-body">
          <div class="item-card">
            <div class="item-card-title">Thẻ chip 1-Chạm NFC (NTAG213/215)</div>
            <div class="item-card-desc">Thẻ danh thiếp thông minh cá nhân, quầy bảo tàng số 3D, điểm chạm check-in đại biểu</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Mã QR Động & Vé Điện Tử</div>
            <div class="item-card-desc">Mã thanh toán VNPay-QR / ZaloPay, vé điện tử QR động chống gian lận tại cổng soát vé</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Chip Timing RFID & Máy In POS</div>
            <div class="item-card-desc">Chip gắn số BIB giải chạy ViOne Run, máy in vé nhiệt POS tại quầy bán vé trực tiếp</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Thiết Bị Di Động Thông Minh</div>
            <div class="item-card-desc">Điện thoại thông minh iOS/Android của hội viên, đại biểu và vận động viên tham gia</div>
          </div>
        </div>
        <div class="side-footer-note">Hội viên, đại biểu & VĐV mang thiết bị di động tương tác tại hiện trường</div>
      </div>

      <!-- KHỐI 2: BÊN TRONG ỨNG DỤNG DI ĐỘNG VIONE -->
      <div class="side-box teal" style="height: 580px;">
        <div class="side-header">BÊN TRONG ỨNG DỤNG DI ĐỘNG VIONE</div>
        <div class="side-body">
          <div class="item-card">
            <div class="item-card-title">Mô-đun Đọc Thẻ NFC & FaceID</div>
            <div class="item-card-desc">Web NFC / iOS Core NFC, sinh trắc học FaceID/Vân tay xác thực phiên đăng nhập an toàn</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Bộ Quét Mã QR & Camera AI OCR</div>
            <div class="item-card-desc">Quét mã QR vé, quét camera trích xuất thông tin danh thiếp giấy vào danh bạ số</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Trình Phát Audio Guide & Bảo Tàng 3D</div>
            <div class="item-card-desc">Three.js WebGL xoay lật cổ vật 360°, phát âm thanh thuyết minh đa ngữ theo vị trí GPS</div>
          </div>
          <div class="item-card">
            <div class="item-card-title">Ví Vé & CSDL Ngoại Tuyến (Offline)</div>
            <div class="item-card-desc">Lưu trữ SQLite / IndexedDB mã vé QR và danh bạ, hiển thị vé và check-in ngay cả khi mất sóng</div>
          </div>
        </div>
        <div class="side-footer-note">Xử lý phần cứng cảm biến, camera và đồng bộ dữ liệu ngoại tuyến</div>
      </div>
    </div>

    <!-- KHU VỰC TRUNG TÂM -->
    <div class="center-col">
      
      <!-- TẦNG 1: KÊNH NGƯỜI DÙNG -->
      <div class="tier-channel">
        <div class="tier-legend">KÊNH NGƯỜI DÙNG (USER CHANNELS & PRESENTATION TIER)</div>
        <div class="channel-grid">
          <div class="channel-card">
            <div class="channel-card-title">Ứng dụng di động ViOne (ViOne Connect)</div>
            <div class="channel-card-desc">Flutter / React Native · iOS / Android & PWA Web<br>CSDL ngoại tuyến SQLite · FaceID · NFC 1-Tap · AI OCR</div>
          </div>
          <div class="channel-card">
            <div class="channel-card-title">Cổng Web Quản trị ViOne Platform (CRM)</div>
            <div class="channel-card-desc">React 18 · TypeScript · Tailwind CSS · TanStack Table<br>Quản trị C-Level · Hồ sơ hội viên 360 · Phễu B2B · Tài chính</div>
          </div>
          <div class="channel-card">
            <div class="channel-card-title">Quầy Bán Vé & Điểm Check-in POS</div>
            <div class="channel-card-desc">Trình duyệt Web POS + Máy in vé nhiệt + Máy quét mã vạch<br>Bán vé cá nhân / vé đoàn · Check-in QR cổng tự động</div>
          </div>
        </div>
      </div>

      <!-- ARROW -->
      <div class="arrow-indicator">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>HTTPS / TLS (Kênh truyền thông mã hóa an toàn)</span>
      </div>

      <!-- TẦNG 2: INGRESS / REVERSE PROXY -->
      <div class="tier-ingress">
        <div class="ingress-box">
          <div class="ingress-title">Ingress / Reverse Proxy (vione-ssl-proxy / Nginx) — Cổng An Toàn HTTPS/TLS</div>
          <div class="ingress-desc">Định tuyến /api tới Backend · Phục vụ Frontend tĩnh · CDN Caching · Giới hạn 100 yêu cầu/60s · SSL Let's Encrypt · CORS Policy · Chặn tấn công DDoS</div>
        </div>
      </div>

      <!-- ARROW -->
      <div class="arrow-indicator">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>HTTPS / JSON (RESTful API & WebSocket Realtime Gateway)</span>
      </div>

      <!-- TẦNG 3: APPLICATION NESTJS API -->
      <div class="tier-app">
        <div class="app-legend">TẦNG ỨNG DỤNG — NESTJS API (REST / API SWAGGER / SOCKET.IO GATEWAY)</div>
        
        <div class="app-grid">
          <div class="service-card blue">
            <div class="service-title">Xác thực & Phân quyền</div>
            <div class="service-desc">JWT Access/Refresh, Argon2, RoleGuard RBAC đa vai trò (Admin, Manager, Member, Guest)</div>
          </div>
          <div class="service-card red">
            <div class="service-title">Giao thương B2B & Deal</div>
            <div class="service-desc">Phễu bán hàng Deals, báo giá, hợp đồng điện tử, quản trị đơn hàng & xuất hóa đơn</div>
          </div>
          <div class="service-card green">
            <div class="service-title">Quản trị Hội viên & Thẻ</div>
            <div class="service-desc">Hồ sơ 360, định danh số vCard, gắn thẻ phân nhóm, ma trận kết nối giao thương</div>
          </div>
          <div class="service-card teal">
            <div class="service-title">Vé & Cổng Thanh toán</div>
            <div class="service-desc">Phát hành vé QR động, thanh toán VNPay-QR, ZaloPay, đối soát ngân sách tự động</div>
          </div>

          <div class="service-card amber">
            <div class="service-title">Sự kiện & Check-in QR</div>
            <div class="service-desc">Tạo sự kiện, soát vé đa cổng realtime qua WebSocket, biểu quyết số, in thẻ đeo</div>
          </div>
          <div class="service-card purple">
            <div class="service-title">Giải đấu Thể thao & Run</div>
            <div class="service-desc">Bảng đấu ViOne Sport, gán chip RFID BIB, ghi nhận thành tích & xếp hạng tự động</div>
          </div>
          <div class="service-card teal">
            <div class="service-title">Bảo tàng Số 3D & Di sản</div>
            <div class="service-desc">Số hóa cổ vật 3D Photogrammetry, thuyết minh audio guide tự động theo GPS & NFC</div>
          </div>
          <div class="service-card slate">
            <div class="service-title">Quản trị Hệ thống & Log</div>
            <div class="service-desc">Nhật ký truy vết Audit Log, cấu hình thông báo Zalo ZNS/Push, backup định kỳ</div>
          </div>
        </div>

        <div class="shared-service-box">
          <div class="shared-title">Dịch Vụ Dùng Chung Nền Tảng (Platform Core Services)</div>
          <div class="shared-desc">Prisma ORM · Kiểm tra dữ liệu ValidationPipe · Interceptor ghi nhật ký truy cập · Tác vụ hàng đợi BullMQ · Socket.IO Realtime Gateway · MinIO S3 SDK</div>
        </div>
      </div>

      <!-- ARROW -->
      <div class="arrow-indicator">
        <svg viewBox="0 0 24 24"><path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z"/></svg>
        <span>Kết nối CSDL & Tích hợp Dịch vụ Bên ngoài</span>
      </div>

      <!-- TẦNG 4: DATA & EXTERNAL SERVICES -->
      <div class="tier-bottom-row">
        
        <!-- TẦNG DỮ LIỆU -->
        <div class="tier-data">
          <div class="data-legend">TẦNG CƠ SỞ DỮ LIỆU & LƯU TRỮ (DATA & STORAGE TIER)</div>
          <div class="data-grid">
            <div class="data-card">
              <div class="data-card-title">PostgreSQL 15 (vione_app)</div>
              <div class="data-card-desc">Hội viên, doanh nghiệp, đơn hàng, vé, giải chạy, audit log · Prisma Migration</div>
            </div>
            <div class="data-card">
              <div class="data-card-title">Kho tệp MinIO / S3 Storage</div>
              <div class="data-card-desc">Ảnh danh thiếp, hóa đơn chứng từ, file audio thuyết minh, mô hình cổ vật 3D GLTF</div>
            </div>
          </div>
        </div>

        <!-- DỊCH VỤ BÊN NGOÀI -->
        <div class="tier-external">
          <div class="ext-legend">DỊCH VỤ TÍCH HỢP BÊN NGOÀI (EXTERNAL INTEGRATIONS)</div>
          <div class="ext-grid">
            <div class="ext-card">
              <div class="ext-card-title">Cổng VNPay & ZaloPay</div>
              <div class="ext-card-desc">Thanh toán trực tuyến & IPN Webhook</div>
            </div>
            <div class="ext-card">
              <div class="ext-card-title">Zalo OpenAPI & ZNS</div>
              <div class="ext-card-desc">Gửi thông báo vé QR xác nhận tức thì</div>
            </div>
            <div class="ext-card">
              <div class="ext-card-title">Apple Store / Google Play</div>
              <div class="ext-card-desc">Phát hành & cập nhật phiên bản di động</div>
            </div>
            <div class="ext-card">
              <div class="ext-card-title">Dịch vụ AI OCR & Vision</div>
              <div class="ext-card-desc">Bóc tách dữ liệu danh thiếp tự động</div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

</body>
</html>`;

(async () => {
  console.log('--- Đang tạo sơ đồ Kiến trúc Tổng thể ViOne chuẩn phong cách Uniwork (Ảnh 1)... ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 2048, height: 1228 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.setContent(htmlContent);

  const outFile = path.join(outDir, 'diagram_01_overall_architecture.png');
  await page.screenshot({ path: outFile, fullPage: true });
  await browser.close();

  const stat = fs.statSync(outFile);
  console.log(`Đã xuất thành công: ${outFile} (${(stat.size / 1024).toFixed(1)} KB)`);
})();

