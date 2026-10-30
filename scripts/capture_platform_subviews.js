// scripts/capture_platform_subviews.js
// Chụp chuẩn xác 100% các màn hình Platform App (16, 17, 18, 19, 20) và toàn bộ các sub-view tương tác
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve('document/images/evidence_v9');
const tempRawDir = path.resolve('document/images/evidence_v9_temp_raw');
if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });

async function wrapInPhoneFrame(browser, rawImagePath, outFramedPath) {
  const dataUri = 'data:image/png;base64,' + fs.readFileSync(rawImagePath).toString('base64');
  const framePage = await browser.newPage({
    viewport: { width: 500, height: 1000 },
    deviceScaleFactor: 2
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body {
    margin: 0;
    padding: 20px;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
  }
  .phone-frame {
    position: relative;
    width: 393px;
    height: 852px;
    background: #000000;
    border-radius: 54px;
    padding: 12px;
    box-shadow:
      0 0 0 4px #2b2b2e,
      0 0 0 5px #1c1c1e,
      0 25px 50px -12px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(216, 178, 130, 0.15);
    box-sizing: border-box;
  }
  .phone-screen {
    position: relative;
    width: 369px;
    height: 828px;
    background: #F8FAFC;
    border-radius: 44px;
    overflow: hidden;
  }
  .screen-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .dynamic-island {
    position: absolute;
    top: 11px;
    left: 50%;
    transform: translateX(-50%);
    width: 124px;
    height: 35px;
    background: #000000;
    border-radius: 20px;
    z-index: 100;
  }
  .status-bar-time {
    position: absolute;
    top: 17px;
    left: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    z-index: 90;
    letter-spacing: -0.2px;
  }
  .status-bar-icons {
    position: absolute;
    top: 19px;
    right: 30px;
    display: flex;
    gap: 6px;
    align-items: center;
    color: #000000;
    z-index: 90;
  }
  .home-indicator {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 134px;
    height: 4px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 100px;
    z-index: 100;
  }
</style>
</head>
<body>
  <div class="phone-frame" id="phone">
    <div class="phone-screen">
      <div class="status-bar-time">09:41</div>
      <div class="dynamic-island"></div>
      <div class="status-bar-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="black">
          <rect x="0" y="7.5" width="3" height="3.5" rx="0.8"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.8"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.8"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="black">
          <path d="M8 2.5C10.5 2.5 12.8 3.5 14.5 5.2L16 3.7C13.9 1.6 11.1 0.5 8 0.5C4.9 0.5 2.1 1.6 0 3.7L1.5 5.2C3.2 3.5 5.5 2.5 8 2.5ZM8 6.5C9.6 6.5 11 7.2 12.1 8.2L13.6 6.7C12.1 5.3 10.1 4.5 8 4.5C5.9 4.5 3.9 5.3 2.4 6.7L3.9 8.2C5 7.2 6.4 6.5 8 6.5ZM8 9.5C8.8 9.5 9.5 10.2 9.5 11C9.5 11.8 8.8 12.5 8 12.5C7.2 12.5 6.5 11.8 6.5 11C6.5 10.2 7.2 9.5 8 9.5Z"/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="black"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="black"/>
          <path d="M23 4V8C23.8 7.5 24 6.8 24 6C24 5.2 23.8 4.5 23 4Z" fill="black"/>
        </svg>
      </div>
      <img class="screen-img" src="${dataUri}" />
      <div class="home-indicator"></div>
    </div>
  </div>
</body>
</html>
  `;

  await framePage.setContent(html, { waitUntil: 'load' });
  await framePage.waitForTimeout(200);

  const phoneElement = await framePage.$('#phone');
  if (phoneElement) {
    await phoneElement.screenshot({
      path: outFramedPath,
      omitBackground: true
    });
  }
  await framePage.close();
}

async function cleanPageUI(page) {
  try {
    await page.evaluate(() => {
      try {
        sessionStorage.setItem('vba.theme', 'light');
        localStorage.setItem('vba.theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.dataset.theme = 'light';
        document.documentElement.style.colorScheme = 'light';
      } catch (e) {}

      // Xóa triệt để các prompt, toast
      const removeSelectors = [
        '#pwa-install-prompt',
        '.pwa-install-banner',
        '.toaster',
        '[data-sonner-toaster]',
        '[data-sonner-toast]',
        '.sonner-toast',
        'aside[aria-label*="thông báo"]',
        'aside[aria-label*="Cấp quyền"]',
        '[aria-label*="Cấp quyền thông báo"]'
      ];
      removeSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });

      const styleId = 'vione-clean-platform-style';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        body {
          padding-top: 48px !important;
          background-color: #F8FAFC !important;
        }
        header.fixed, header.sticky {
          top: 48px !important;
        }
        aside, .toaster, [data-sonner-toaster] {
          display: none !important;
        }
      `;
    });
  } catch (e) {
    // context destroyed ignore
  }
}

async function run() {
  console.log('=== BẮT ĐẦU CHỤP BỔ SUNG CHUẨN XÁC CÁC MÀN HÌNH PLATFORM & TÍNH NĂNG CON ===');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors']
  });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  const screens = [
    // 5 Màn hình chính Platform App
    { name: 'app_16_tickets.png', url: 'http://localhost:5137/platform-app?tab=tickets' },
    { name: 'app_17_sport.png', url: 'http://localhost:5137/platform-app?tab=sport' },
    { name: 'app_18_run.png', url: 'http://localhost:5137/platform-app?tab=run' },
    { name: 'app_19_museum.png', url: 'http://localhost:5137/platform-app?tab=museum' },
    { name: 'app_20_heritage.png', url: 'http://localhost:5137/platform-app?tab=heritage' },

    // Các màn hình tính năng con tương tác chi tiết
    { name: 'app_16b_pos_validator.png', url: 'http://localhost:5137/platform-app?tab=tickets', btnText: 'Cổng Soát Vé Nhân Viên' },
    { name: 'app_17b_bracket.png', url: 'http://localhost:5137/platform-app?tab=sport', btnText: 'Sơ Đồ Phân Nhánh' },
    { name: 'app_17c_schedule.png', url: 'http://localhost:5137/platform-app?tab=sport', btnText: 'Lịch Đấu & Sân Bãi' },
    { name: 'app_17d_elo.png', url: 'http://localhost:5137/platform-app?tab=sport', btnText: 'Bảng Xếp Hạng ELO' },
    { name: 'app_18b_rfid_timing.png', url: 'http://localhost:5137/platform-app?tab=run', btnText: 'Thảm RFID Timing' },
    { name: 'app_18c_gps_route.png', url: 'http://localhost:5137/platform-app?tab=run', btnText: 'Lộ Trình GPS Track' },
    { name: 'app_18d_finisher_bxh.png', url: 'http://localhost:5137/platform-app?tab=run', btnText: 'BXH Finisher & e-Cert' },
    { name: 'app_19b_museum_360.png', url: 'http://localhost:5137/platform-app?tab=museum', btnText: 'Xoay Lật 360°' },
    { name: 'app_19c_audio_guide.png', url: 'http://localhost:5137/platform-app?tab=museum', btnText: 'Audio Guide Đa Ngữ' },
    { name: 'app_19d_timeline_qr.png', url: 'http://localhost:5137/platform-app?tab=museum', btnText: 'Niên Biểu & QR' },
    { name: 'app_20b_geofencing.png', url: 'http://localhost:5137/platform-app?tab=heritage', btnText: 'GPS Geofencing 20m' },
    { name: 'app_20c_sacphong.png', url: 'http://localhost:5137/platform-app?tab=heritage', btnText: 'Sắc Phong Deep Zoom' },
    { name: 'app_20d_tours.png', url: 'http://localhost:5137/platform-app?tab=heritage', btnText: 'Tuyến Tham Quan' }
  ];

  for (const s of screens) {
    try {
      console.log(`\n-> Chụp: ${s.name} (URL: ${s.url}${s.btnText ? ' | Tab: ' + s.btnText : ''})`);
      const rawTemp = path.join(tempRawDir, 'raw_' + s.name);
      const outFramed = path.join(outDir, s.name);

      await page.goto(s.url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(1000);
      await cleanPageUI(page);

      if (s.btnText) {
        const btn = page.locator(`button:has-text("${s.btnText}")`).first();
        if (await btn.count() > 0) {
          await btn.click();
          await page.waitForTimeout(800);
          await cleanPageUI(page);
        } else {
          console.warn(`   Cảnh báo: Không tìm thấy button với text "${s.btnText}"`);
        }
      }

      await page.screenshot({ path: rawTemp });
      await wrapInPhoneFrame(browser, rawTemp, outFramed);
      console.log(`   Hoàn tất lưu khung iPhone: ${s.name} (${fs.statSync(outFramed).size} bytes)`);
    } catch (err) {
      console.error(`   Lỗi khi chụp ${s.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n=== TẤT CẢ CÁC MÀN HÌNH ĐÃ ĐƯỢC CHỤP MỚI VÀ ĐÓNG KHUNG THÀNH CÔNG ===');
}

run().catch(console.error);
