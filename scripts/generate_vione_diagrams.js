// scripts/generate_vione_diagrams.js
// Tạo 4 sơ đồ kiến trúc và luồng xử lý chuẩn mực cho ViOne Platform & ViOne App
// Màu sắc chuẩn thương hiệu: Vàng Hoàng Gia Champagne Gold & Đen Thạch Anh Obsidian

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = path.join(__dirname, '../document/images/evidence_v9');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const DIAGRAMS = [
  {
    fileName: 'diagram_01_overall_architecture.png',
    title: 'HÌNH 1 – SƠ ĐỒ KIẾN TRÚC TỔNG THỂ NỀN TẢNG VIONE PLATFORM (HỢP NHẤT WEB CRM & APP MOBILE)',
    html: `
      <div class="canvas">
        <div class="header">
          <div class="badge">VIONE PLATFORM ARCHITECTURE · 4-TIER ENTERPRISE</div>
          <h2>SƠ ĐỒ KIẾN TRÚC TỔNG THỂ HỆ THỐNG VIONE PLATFORM</h2>
          <p>Hợp Nhất Cổng Web Quản Trị ViOne CRM & Ứng Dụng Di Động ViOne Connect</p>
        </div>

        <div class="tier-container">
          <!-- TẦNG 1: CLIENT -->
          <div class="tier-box">
            <div class="tier-label">TẦNG 1: TRÌNH DIỄN & THIẾT BỊ NGƯỜI DÙNG (CLIENT PRESENTATION LAYER)</div>
            <div class="boxes-row">
              <div class="sub-card">
                <div class="card-icon">🖥️</div>
                <div class="card-title">CỔNG WEB QUẢN TRỊ CRM</div>
                <div class="card-desc">React 18 · Vite · Tailwind CSS · TanStack Table<br>Desktop 1440x900 · Điều hành C-Level · Quản trị phân quyền RBAC</div>
              </div>
              <div class="sub-card active-gold">
                <div class="card-icon">📱</div>
                <div class="card-title">ỨNG DỤNG DI ĐỘNG VIONE (MOBILE APP)</div>
                <div class="card-desc">iOS Native / Android / PWA · Obsidian Luxury UI<br>Danh thiếp vCard · 1-Tap NFC · AI OCR · Ví vé QR · GPS Geofencing</div>
              </div>
              <div class="sub-card">
                <div class="card-icon">🎫</div>
                <div class="card-title">CỔNG SOÁT VÉ CHECK-IN POS</div>
                <div class="card-desc">Thiết bị quét mã QR cầm tay / Tablet tại cổng sự kiện<br>Xác thực offline/online siêu tốc &lt;100ms</div>
              </div>
            </div>
          </div>

          <div class="arrow-down">▼ Giao thức HTTPS / TLS 1.3 & WebSocket (WSS) qua Cổng An Ninh ▼</div>

          <!-- TẦNG 2: PROXY & GATEWAY -->
          <div class="tier-box">
            <div class="tier-label">TẦNG 2: CỔNG BIÊN, BẢO MẬT & ĐIỀU PHỐI (EDGE PROXY & GATEWAY LAYER)</div>
            <div class="boxes-row">
              <div class="sub-card">
                <div class="card-title">NGINX REVERSE PROXY (vione-ssl-proxy)</div>
                <div class="card-desc">Cổng 5445 (ViOne App) · Cổng 5446 (ViOne CRM)<br>SSL/TLS 1.3 Let's Encrypt 2048-bit · HTTP/2 Multiplexing</div>
              </div>
              <div class="sub-card">
                <div class="card-title">BỘ LỌC AN NINH & TƯỜNG LỬA (WAF)</div>
                <div class="card-desc">Chống tấn công DDoS · Rate Limiting (100 req/min)<br>Chặn SQL Injection / XSS / CSRF · CORS Whitelist</div>
              </div>
              <div class="sub-card">
                <div class="card-title">API GATEWAY & LOAD BALANCER</div>
                <div class="card-desc">Định tuyến tải vi dịch vụ · Giải mã JWT Auth<br>Điều phối kết nối Socket.IO Stateful Clusters</div>
              </div>
            </div>
          </div>

          <div class="arrow-down">▼ Phân Phối Tải Tới Cụm Micro-Services Ứng Dụng ▼</div>

          <!-- TẦNG 3: APPLICATION SERVICES -->
          <div class="tier-box">
            <div class="tier-label">TẦNG 3: MÁY CHỦ DỊCH VỤ ỨNG DỤNG (APPLICATION BUSINESS SERVICES)</div>
            <div class="boxes-grid">
              <div class="sub-card mini">
                <div class="card-title">AUTH & RBAC SERVICE</div>
                <div class="card-desc">JWT Token Kép, 2FA TOTP, Ma trận phân quyền đa tầng</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">REALTIME SOCKET GATEWAY</div>
                <div class="card-desc">Socket.IO Server, Dispatcher sự kiện thời gian thực &lt;50ms</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">VNPAY PAYMENT ENGINE</div>
                <div class="card-desc">Tạo URL thanh toán, Chữ ký HMAC-SHA512, IPN Webhook</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">EVENT & TICKET WALLET</div>
                <div class="card-desc">Phát hành vé điện tử, Mã hóa QR Token AES-256 động</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">VIONE SPORT TOURNAMENT</div>
                <div class="card-desc">Bốc thăm Tournament Bracket, Cập nhật tỷ số Realtime</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">VIONE RUN MARATHON</div>
                <div class="card-desc">Tiếp nhận chip timing RFID UHF, Bảng Leaderboard live</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">VIONE MUSEUM 3D & NFC</div>
                <div class="card-desc">Renderer 3D GLTF xoay 360°, Audio Guide thuyết minh</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">VIONE HERITAGE & GIS</div>
                <div class="card-desc">Bản đồ di tích GIS, GPS Geofencing 20m, Sắc phong Hán Nôm</div>
              </div>
              <div class="sub-card mini">
                <div class="card-title">AI OCR & ZALO OA WORKER</div>
                <div class="card-desc">Bóc tách danh thiếp AI OCR, Gửi thông báo ZNS tự động</div>
              </div>
            </div>
          </div>

          <div class="arrow-down">▼ Đọc / Ghi Dữ Liệu Giao Dịch & Lưu Trữ Đối Tượng ▼</div>

          <!-- TẦNG 4: DATA & STORAGE -->
          <div class="tier-box">
            <div class="tier-label">TẦNG 4: DỮ LIỆU & LƯU TRỮ ĐỐI TƯỢNG (DATA & OBJECT STORAGE TIER)</div>
            <div class="boxes-row">
              <div class="sub-card">
                <div class="card-title">POSTGRESQL 16 ENTERPRISE</div>
                <div class="card-desc">Multi-tenant Architecture · PostGIS Extension không gian<br>Lưu trữ JSONB linh hoạt · ACID Transactions an toàn</div>
              </div>
              <div class="sub-card">
                <div class="card-title">REDIS 7 IN-MEMORY CACHE</div>
                <div class="card-desc">Bộ nhớ đệm hiệu năng cao · Message Broker Pub/Sub<br>Quản lý phiên làm việc & Hàng đợi tiến trình ngầm</div>
              </div>
              <div class="sub-card">
                <div class="card-title">MINIO S3 OBJECT STORAGE</div>
                <div class="card-desc">Lưu trữ mô hình 3D GLTF hiện vật · Tệp âm thanh Audio Guide<br>Kho tài liệu số (/documents) · Mã hóa AES-256</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    fileName: 'diagram_02_crm_workflow.png',
    title: 'HÌNH 2 – SƠ ĐỒ LUỒNG NGHIỆP VỤ & DỮ LIỆU CỔNG WEB QUẢN TRỊ VIONE PLATFORM (CRM ENTERPRISE)',
    html: `
      <div class="canvas">
        <div class="header">
          <div class="badge">VIONE CRM WORKFLOW & DATA PIPELINE</div>
          <h2>SƠ ĐỒ LUỒNG NGHIỆP VỤ & DỮ LIỆU CỔNG WEB QUẢN TRỊ VIONE PLATFORM</h2>
          <p>Điều Hành Doanh Nghiệp C-Level, Quản Trị Hội Viên 360, Dòng Tiền & Vận Hành</p>
        </div>

        <div class="flow-grid">
          <div class="flow-col">
            <div class="col-header">1. XÁC THỰC & BẢO MẬT ĐA TẦNG</div>
            <div class="step-card">
              <div class="step-num">BƯỚC 1</div>
              <div class="step-title">Đăng Nhập Quản Trị</div>
              <div class="step-body">Email & Mật khẩu đối soát băm Argon2/Bcrypt trong CSDL.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 2</div>
              <div class="step-title">Xác Thực 2 Lớp (TOTP)</div>
              <div class="step-body">Mã xác thực 6 chữ số Google Authenticator theo chuẩn RFC 6238.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 3</div>
              <div class="step-title">Phân Quyền RBAC</div>
              <div class="step-body">RoleGuard giải mã JWT, đối chiếu ma trận quyền xem/thêm/sửa/xóa/duyệt.</div>
            </div>
          </div>

          <div class="flow-col">
            <div class="col-header">2. BẢNG ĐIỀU HÀNH & TÀI CHÍNH</div>
            <div class="step-card">
              <div class="step-num">BƯỚC 4</div>
              <div class="step-title">C-Level Dashboard Realtime</div>
              <div class="step-body">Tổng hợp doanh thu vé, hội phí, biến động hội viên theo thời gian thực.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 5</div>
              <div class="step-title">Quản Lý Thu - Chi 3 Cấp</div>
              <div class="step-body">Phiếu thu điện tử kết nối VNPay; Luồng duyệt chi Kế toán -> KT Trưởng -> CEO.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 6</div>
              <div class="step-title">Đối Soát Dòng Tiền & Báo Cáo</div>
              <div class="step-body">Khớp nối tự động đơn hàng vnp_TxnRef, xuất báo cáo tài chính Excel/PDF.</div>
            </div>
          </div>

          <div class="flow-col">
            <div class="col-header">3. VẬN HÀNH & KẾT NỐI GIAO THƯƠNG</div>
            <div class="step-card">
              <div class="step-num">BƯỚC 7</div>
              <div class="step-title">Quản Trị Hội Viên & Deals</div>
              <div class="step-body">Hồ sơ 360, cấp phát thẻ vCard NFC, phễu cơ hội kinh doanh Kanban.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 8</div>
              <div class="step-title">Sàn Giao Thương B2B</div>
              <div class="step-body">Kiểm duyệt sản phẩm/dịch vụ, quản lý chính sách chiết khấu hội viên VIP.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 9</div>
              <div class="step-title">Quy Trình Vận Hành BPMN 2.0</div>
              <div class="step-body">Điều phối nhiệm vụ, chấm công GPS Geofence, biểu quyết số an toàn.</div>
            </div>
          </div>

          <div class="flow-col">
            <div class="col-header">4. SỰ KIỆN, THỂ THAO & DI SẢN</div>
            <div class="step-card">
              <div class="step-num">BƯỚC 10</div>
              <div class="step-title">Phát Hành Vé & Cổng Soát Vé</div>
              <div class="step-body">Cấu hình hạng vé, cổng VNPay, soát vé Check-in QR siêu tốc &lt;100ms.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 11</div>
              <div class="step-title">Điều Phối ViOne Sport / Run</div>
              <div class="step-body">Sơ đồ cây Tournament Bracket, tiếp nhận chip timing RFID giải chạy.</div>
            </div>
            <div class="step-card">
              <div class="step-num">BƯỚC 12</div>
              <div class="step-title">Bảo Tàng 3D & Di Sản GIS</div>
              <div class="step-body">Tải mô hình GLTF 360°, Audio Guide đa ngữ, khoanh vùng GPS di tích.</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    fileName: 'diagram_03_mobile_app_architecture.png',
    title: 'HÌNH 3 – SƠ ĐỒ KIẾN TRÚC XỬ LÝ & LUỒNG TRẢI NGHIỆM ỨNG DỤNG DI ĐỘNG VIONE (MOBILE APP)',
    html: `
      <div class="canvas">
        <div class="header">
          <div class="badge">VIONE MOBILE APP · NATIVE ARCHITECTURE & USER EXPERIENCE</div>
          <h2>SƠ ĐỒ KIẾN TRÚC XỬ LÝ & LUỒNG TRẢI NGHIỆM ỨNG DỤNG DI ĐỘNG VIONE</h2>
          <p>Danh Thiếp Số vCard, Chạm 1-Tap NFC, Quét AI OCR, Ví Vé Offline & Kết Nối Giao Thương</p>
        </div>

        <div class="mobile-grid">
          <!-- KHỐI 1: KHỞI ĐỘNG & BẢO MẬT -->
          <div class="flow-col">
            <div class="col-header">1. KHỞI ĐỘNG & BẢO MẬT</div>
            <div class="step-card">
              <div class="step-title">Sinh Trắc Học Biometrics</div>
              <div class="step-body">Quét FaceID 3D / Vân tay TouchID qua Apple Secure Enclave & Android Keystore trong 0.3s.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Xác Thực Mã OTP & PIN</div>
              <div class="step-body">Bảo vệ phiên giao dịch tài chính bằng mã PIN 6 số và OTP SMS/Zalo.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Hardware Keystore</div>
              <div class="step-body">Lưu trữ khóa Refresh Token an toàn, tự động khóa khi phát hiện Jailbreak/Root.</div>
            </div>
          </div>

          <!-- KHỐI 2: ĐIỀU HÀNH & ĐỊNH DANH SỐ -->
          <div class="flow-col">
            <div class="col-header">2. ĐIỀU HÀNH & ĐỊNH DANH SỐ</div>
            <div class="step-card">
              <div class="step-title">Executive Home C-Level</div>
              <div class="step-body">Thẻ vCard VIP, Widget lịch họp, phím tắt 1-chạm mở nhanh tiện ích thường nhật.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Chạm 1-Tap NFC Vật Lý</div>
              <div class="step-body">Giao tiếp trường gần ISO/IEC 14443 Type A, đọc/ghi thẻ NTAG213 trong 0.2s không cần mở app.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Quét Danh Thiếp AI OCR</div>
              <div class="step-body">Camera chụp namecard giấy, thuật toán Computer Vision tự bóc tách SĐT, Email, Công ty.</div>
            </div>
          </div>

          <!-- KHỐI 3: KẾT NỐI & SỰ KIỆN -->
          <div class="flow-col">
            <div class="col-header">3. KẾT NỐI & SỰ KIỆN</div>
            <div class="step-card">
              <div class="step-title">Mạng Lưới GPS Doanh Nhân</div>
              <div class="step-body">Định vị đối tác kinh doanh quanh đây, kết nối giao thương B2B trực tiếp.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Phòng Chat Socket.IO</div>
              <div class="step-body">Nhắn tin trực tiếp 1-1 và phòng chat nhóm chi hội với độ trễ siêu thấp &lt;50ms.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Ví Vé Điện Tử Offline</div>
              <div class="step-body">Lưu trữ vé sự kiện, xuất mã QR động chống chụp màn hình gian lận, check-in không cần 4G.</div>
            </div>
          </div>

          <!-- KHỐI 4: THỂ THAO & DI SẢN -->
          <div class="flow-col">
            <div class="col-header">4. THỂ THAO & DI SẢN</div>
            <div class="step-card">
              <div class="step-title">ViOne Sport & Run</div>
              <div class="step-body">Tra cứu sơ đồ bảng đấu thể thao; nhập mã BIB nhận dữ liệu chip timing RFID trực tiếp.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Bảo Tàng Số 3D & NFC</div>
              <div class="step-body">Xoay 360 độ hiện vật quý hiếm bằng Three.js/WebGL; chạm NFC nghe thuyết minh Audio Guide.</div>
            </div>
            <div class="step-card">
              <div class="step-title">Di Sản GIS & Geofencing</div>
              <div class="step-body">Bán kính GPS 20m di tích kích hoạt bài thuyết minh văn hóa và tra cứu tư liệu sắc phong cổ.</div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    fileName: 'diagram_04_deployment_topology.png',
    title: 'HÌNH 4 – SƠ ĐỒ KIẾN TRÚC TRIỂN KHAI PHÂN LẬP, AN TOÀN & DỰ PHÒNG HẠ TẦNG VIONE PLATFORM',
    html: `
      <div class="canvas">
        <div class="header">
          <div class="badge">VIONE DEPLOYMENT & ISOLATION TOPOLOGY</div>
          <h2>SƠ ĐỒ KIẾN TRÚC TRIỂN KHAI PHÂN LẬP & AN TOÀN HẠ TẦNG</h2>
          <p>Phân Tách Tuyệt Đối Môi Trường Dev & Subdomain Production, Sao Lưu Tự Động & Chống Rủi Ro</p>
        </div>

        <div class="deploy-grid">
          <!-- CỘT 1: DEV SERVER -->
          <div class="deploy-box dev-box">
            <div class="deploy-header">MÔI TRƯỜNG SERVER DEV (CỔNG KÈM PORT)</div>
            <div class="deploy-content">
              <div class="deploy-url">https://dev-vione.14-225-217-232.sslip.io:5445</div>
              <div class="deploy-desc">ViOne App Dev Container (Port 5010 HTTP / 5445 SSL)</div>
              <div class="deploy-url" style="margin-top: 15px;">https://dev-vione-crm.14-225-217-232.sslip.io:5446</div>
              <div class="deploy-desc">ViOne CRM Dev Container (Port 5006 HTTP / 5446 SSL)</div>
              <div class="tag-warning">Phục vụ kiểm thử nội bộ · Mockup API · Debugging thời gian thực</div>
            </div>
          </div>

          <!-- CỘT 2: PROXY BIỆT LẬP -->
          <div class="deploy-box proxy-box">
            <div class="deploy-header">CỤM PROXY BIỆT LẬP (vione-ssl-proxy)</div>
            <div class="deploy-content">
              <div class="sub-card">
                <div class="card-title">CẤM DÙNG CHUNG PROXY</div>
                <div class="card-desc">Tách biệt hoàn toàn thư mục deploy/ssl/ -> ~/vione-ssl-proxy</div>
              </div>
              <div class="sub-card" style="margin-top: 12px;">
                <div class="card-title">QUẢN LÝ CỔNG ĐỘC LẬP</div>
                <div class="card-desc">Quản lý độc quyền Cổng 5445 (App) & 5446 (CRM), không xung đột với ceo1983-ssl-proxy</div>
              </div>
              <div class="sub-card" style="margin-top: 12px;">
                <div class="card-title">SSL/TLS AUTO-RENEW</div>
                <div class="card-desc">Tự động gia hạn chứng chỉ Let's Encrypt qua Certbot định kỳ</div>
              </div>
            </div>
          </div>

          <!-- CỘT 3: SUBDOMAIN PROD -->
          <div class="deploy-box prod-box">
            <div class="deploy-header">MÔI TRƯỜNG SUBDOMAIN PRODUCTION (CHUẨN 80 & 443)</div>
            <div class="deploy-content">
              <div class="deploy-url-prod">https://vione.viconnect.vn/</div>
              <div class="deploy-desc-prod">ViOne PWA App chính thức · CI/CD GitHub Actions deploy-vione.yml</div>
              <div class="deploy-url-prod" style="margin-top: 15px;">https://crm_vione.viconnect.vn/</div>
              <div class="deploy-desc-prod">ViOne CRM Enterprise chính thức · CI/CD deploy-crm.yml</div>
              <div class="tag-success">Cụm Container chạy ngầm 24/7 · Tự phục hồi Restart: Always · SLA 99.9%</div>
            </div>
          </div>
        </div>

        <div class="disaster-bar">
          <div class="disaster-title">CHÍNH SÁCH SAO LƯU DỰ PHÒNG & AN TOÀN DỮ LIỆU (DISASTER RECOVERY)</div>
          <div class="disaster-desc">
            • Cơ sở dữ liệu PostgreSQL 16 sao lưu tự động (Automated Backup) mỗi 6 giờ/lần với công cụ pg_dump / WAL-G.<br>
            • Lưu trữ nén mã hóa 3 bản sao tại các ổ đĩa độc lập (Local NVMe Storage + MinIO S3 Remote Archive).<br>
            • Thời gian khôi phục mục tiêu (RTO) &lt; 15 phút · Mức độ mất mát dữ liệu tối đa chấp nhận (RPO) &lt; 1 giờ.
          </div>
        </div>
      </div>
    `
  }
];

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
  body { background: #050C15; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  .canvas {
    width: 1400px;
    background: #0B131E;
    border: 2px solid #8C653B;
    border-radius: 12px;
    padding: 30px;
    color: #FFFFFF;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
  }
  .header { text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(216,178,130,0.3); }
  .badge { display: inline-block; background: linear-gradient(135deg, #F6E1C3, #D8B282, #8C653B); color: #050C15; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 8px; }
  .header h2 { color: #F6E1C3; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 5px; }
  .header p { color: #D8B282; font-size: 13px; font-weight: 500; }
  
  .tier-container { display: flex; flex-direction: column; gap: 12px; }
  .tier-box { background: rgba(18,26,36,0.9); border: 1px solid rgba(216,178,130,0.3); border-radius: 8px; padding: 15px; }
  .tier-label { color: #F6E1C3; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 10px; border-left: 3px solid #D8B282; padding-left: 8px; }
  .boxes-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .boxes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  
  .sub-card { background: #0E1724; border: 1px solid rgba(216,178,130,0.2); border-radius: 6px; padding: 12px; transition: all 0.2s; }
  .sub-card.active-gold { border-color: #D8B282; background: linear-gradient(145deg, #121D2D, #1B293E); }
  .sub-card.mini { padding: 10px; }
  .card-icon { font-size: 20px; margin-bottom: 5px; }
  .card-title { color: #F6E1C3; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
  .card-desc { color: #A0AEC0; font-size: 11px; line-height: 1.4; }
  
  .arrow-down { text-align: center; color: #D8B282; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; padding: 2px 0; }
  
  /* Flow Grid */
  .flow-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .flow-col { background: #0E1724; border: 1px solid rgba(216,178,130,0.25); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .col-header { color: #F6E1C3; font-size: 12px; font-weight: 800; text-align: center; padding-bottom: 8px; border-bottom: 1px solid rgba(216,178,130,0.2); margin-bottom: 4px; }
  .step-card { background: #131E2E; border: 1px solid rgba(216,178,130,0.2); border-radius: 6px; padding: 10px; }
  .step-num { color: #8C653B; font-size: 9px; font-weight: 800; letter-spacing: 0.5px; }
  .step-title { color: #F6E1C3; font-size: 12px; font-weight: 700; margin: 2px 0 4px 0; }
  .step-body { color: #A0AEC0; font-size: 11px; line-height: 1.4; }

  /* Mobile Grid */
  .mobile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

  /* Deploy Grid */
  .deploy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 18px; }
  .deploy-box { background: #0E1724; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; }
  .dev-box { border: 1px solid rgba(255, 165, 0, 0.4); }
  .proxy-box { border: 1px solid rgba(216,178,130,0.6); }
  .prod-box { border: 1px solid rgba(40, 167, 69, 0.5); }
  .deploy-header { font-size: 12px; font-weight: 800; text-align: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .dev-box .deploy-header { color: #FFA500; }
  .proxy-box .deploy-header { color: #F6E1C3; }
  .prod-box .deploy-header { color: #28A745; }
  .deploy-url { font-family: monospace; font-size: 11px; color: #FFA500; background: rgba(255,165,0,0.1); padding: 6px; border-radius: 4px; word-break: break-all; }
  .deploy-url-prod { font-family: monospace; font-size: 11px; color: #28A745; background: rgba(40,167,69,0.15); padding: 6px; border-radius: 4px; word-break: break-all; font-weight: bold; }
  .deploy-desc { font-size: 11px; color: #A0AEC0; margin-top: 4px; }
  .deploy-desc-prod { font-size: 11px; color: #E2E8F0; margin-top: 4px; }
  .tag-warning { margin-top: 15px; font-size: 10px; color: #FFA500; background: rgba(255,165,0,0.08); padding: 6px; border-radius: 4px; text-align: center; }
  .tag-success { margin-top: 15px; font-size: 10px; color: #28A745; background: rgba(40,167,69,0.1); padding: 6px; border-radius: 4px; text-align: center; font-weight: 600; }
  
  .disaster-bar { background: rgba(18,26,36,0.95); border: 1px solid #8C653B; border-radius: 8px; padding: 14px 18px; }
  .disaster-title { color: #F6E1C3; font-size: 12px; font-weight: 800; margin-bottom: 6px; }
  .disaster-desc { color: #A0AEC0; font-size: 11px; line-height: 1.5; }
`;

async function generateAllDiagrams() {
  console.log('=== ĐANG RENDER 4 SƠ ĐỒ KIẾN TRÚC VIONE PLATFORM (PLAYWRIGHT) ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const diag of DIAGRAMS) {
    const page = await browser.newPage({
      viewport: { width: 1460, height: 960 },
      deviceScaleFactor: 2
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${STYLES}</style>
        </head>
        <body>
          ${diag.html}
        </body>
      </html>
    `;

    await page.setContent(fullHtml);
    await page.waitForTimeout(300);

    const outPath = path.join(outDir, diag.fileName);
    const canvasElement = await page.$('.canvas');
    if (canvasElement) {
      await canvasElement.screenshot({ path: outPath, type: 'png' });
      console.log(`Đã xuất sơ đồ: ${diag.fileName} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    } else {
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Đã xuất sơ đồ (fullpage): ${diag.fileName}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('=== HOÀN TẤT XUẤT 4 SƠ ĐỒ CHUẨN THƯƠNG HIỆU VIONE PLATFORM ===');
}

generateAllDiagrams().catch(err => {
  console.error('Lỗi khi render sơ đồ:', err);
  process.exit(1);
});
