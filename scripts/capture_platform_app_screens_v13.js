// scripts/capture_platform_app_screens_v13.js
// Chụp 5 màn hình mới ViOne App (Tickets, Sport, Run, Museum, Heritage) từ localhost dev server
// THEME SÁNG (LIGHT THEME) 100%
// HEADER CHỈ CÓ LOGO VIONE VÀ ICON THÔNG BÁO THEO YÊU CẦU NGƯỜI DÙNG

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve('document/images/evidence_v9');
const tempRawDir = path.resolve('scratch/temp_raw_platform_light');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });

const baseUrl = 'http://localhost:5137';

async function wrapInPhoneFrame(browser, rawImgPath, outFramedPath) {
  const base64Data = fs.readFileSync(rawImgPath).toString('base64');
  const dataUri = `data:image/png;base64,${base64Data}`;

  const framePage = await browser.newPage({
    viewport: { width: 500, height: 1000 },
    deviceScaleFactor: 2
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 1000px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
  }
  .phone-frame {
    position: relative;
    width: 393px;
    height: 852px;
    background: #1e293b;
    border-radius: 54px;
    padding: 11px;
    box-shadow: 
      0 0 0 2px #d4af37,
      0 0 0 6px #1e293b,
      0 0 0 8px #0f172a,
      0 25px 60px rgba(0, 0, 0, 0.35);
  }
  .phone-screen {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 43px;
    overflow: hidden;
    background: #FFFFFF;
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
    width: 122px;
    height: 33px;
    background: #000000;
    border-radius: 20px;
    z-index: 100;
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.15);
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
  await framePage.waitForTimeout(300);

  const phoneElement = await framePage.$('#phone');
  if (phoneElement) {
    await phoneElement.screenshot({
      path: outFramedPath,
      omitBackground: true
    });
  }
  await framePage.close();
}

async function cleanMobileUI(page) {
  await page.evaluate(() => {
    // 1. Standalone PWA
    try {
      Object.defineProperty(window.navigator, 'standalone', { get: () => true });
    } catch (e) {}

    // 2. Ép Theme Sáng
    try {
      sessionStorage.setItem('vione_notif_prompt_dismissed', 'true');
      localStorage.setItem('vione_notif_prompt_dismissed', 'true');
      sessionStorage.setItem('vione_pwa_dismissed', 'true');
      localStorage.setItem('vione_pwa_dismissed', 'true');
      sessionStorage.setItem('vba_pwa_installed', 'true');
      localStorage.setItem('vba_pwa_installed', 'true');
      localStorage.setItem('vba.theme', 'light');
      sessionStorage.setItem('vba.theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.dataset.theme = 'light';
      document.documentElement.style.colorScheme = 'light';
    } catch (e) {}

    // 3. Xóa các popup/banner nếu có
    const removeSelectors = [
      '#pwa-install-prompt',
      '[data-testid="pwa-install"]',
      '.pwa-install-banner',
      '[data-pwa-install]',
      '.toaster',
      '[data-sonner-toaster]',
      '[data-sonner-toast]',
      '.sonner-toast',
      'aside[aria-label*="thông báo"]',
      'aside[aria-label*="Cấp quyền"]',
      '[aria-label*="Cấp quyền thông báo"]',
      '[aria-label*="thông báo hệ thống"]',
      '.vione-notif-prompt',
      '.vione-notif-banner'
    ];
    removeSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // 4. Quét sạch mọi phần tử chứa nội dung yêu cầu bật thông báo
    document.querySelectorAll('aside, div, section').forEach(el => {
      const text = el.innerText || el.textContent || '';
      if (
        text.includes('Bật thông báo trên màn hình') ||
        text.includes('Bật thông báo ngay') ||
        text.includes('Nhận cuộc gọi đến, tin nhắn đối tác') ||
        text.includes('Bật thông báo tin nhắn & cuộc gọi')
      ) {
        if (
          el.tagName === 'ASIDE' ||
          window.getComputedStyle(el).position === 'fixed' ||
          window.getComputedStyle(el).position === 'absolute' ||
          el.classList.contains('fixed') ||
          el.classList.contains('absolute') ||
          el.parentElement === document.body ||
          text.length < 260
        ) {
          el.remove();
        }
      }
    });

    // 5. CSS bổ sung để đảm bảo safe area đỉnh máy có khoảng trống cho Dynamic Island
    const styleId = 'vione-clean-mobile-style';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = `
      aside[aria-label*="thông báo"],
      aside[aria-label*="Cấp quyền"],
      [aria-label*="Cấp quyền thông báo"],
      .vione-notif-prompt,
      .vione-notif-banner,
      #pwa-install-prompt,
      .pwa-install-banner,
      [data-sonner-toaster],
      [data-sonner-toast],
      .toaster,
      .sonner-toast {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        pointer-events: none !important;
      }
      body {
        padding-top: 48px !important;
        background-color: #F8FAFC !important;
      }
      header.fixed, header.sticky {
        top: 48px !important;
      }
    `;
  });
}

async function capturePlatformScreens() {
  console.log('=== BẮT ĐẦU CHỤP 5 MÀN HÌNH NỀN TẢNG THEME SÁNG VỚI HEADER MỚI ===');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: true
  });

  await mobileContext.addInitScript(() => {
    try {
      sessionStorage.setItem('vione_notif_prompt_dismissed', 'true');
      localStorage.setItem('vione_notif_prompt_dismissed', 'true');
      sessionStorage.setItem('vione_pwa_dismissed', 'true');
      localStorage.setItem('vione_pwa_dismissed', 'true');
      localStorage.setItem('vba.theme', 'light');
      sessionStorage.setItem('vba.theme', 'light');
      if (window.Notification) {
        Object.defineProperty(Notification, 'permission', { get: () => 'granted' });
      }
    } catch (e) {}
  });

  const mPage = await mobileContext.newPage();

  const screens = [
    { id: 16, route: '/platform-app?tab=tickets', name: 'app_16_tickets.png' },
    { id: 17, route: '/platform-app?tab=sport', name: 'app_17_sport.png' },
    { id: 18, route: '/platform-app?tab=run', name: 'app_18_run.png' },
    { id: 19, route: '/platform-app?tab=museum', name: 'app_19_museum.png' },
    { id: 20, route: '/platform-app?tab=heritage', name: 'app_20_heritage.png' }
  ];

  for (const s of screens) {
    console.log(`\n[CHỤP ẢNH ${s.id}/20] Tuyến đường: ${s.route} -> ${s.name}`);
    const rawTempPath = path.join(tempRawDir, 'raw_' + s.name);
    const outFramedPath = path.join(outDir, s.name);

    await mPage.goto(baseUrl + s.route, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await mPage.waitForTimeout(3000);

    await cleanMobileUI(mPage);
    await mPage.waitForTimeout(500);
    await cleanMobileUI(mPage);

    // Kiểm tra không có lỗi crash
    const content = await mPage.content();
    if (content.includes('Something went wrong')) {
      throw new Error(`CRITICAL ERROR: Màn hình ${s.route} hiển thị "Something went wrong"!`);
    }

    await mPage.screenshot({ path: rawTempPath });

    // Đóng khung viền điện thoại
    await wrapInPhoneFrame(browser, rawTempPath, outFramedPath);
    const fileSize = fs.statSync(outFramedPath).size;
    console.log(`  -> Thành công: Đã tạo ${s.name} (${fileSize} bytes)`);
  }

  await browser.close();
  console.log('\n=== HOÀN TẤT CHỤP TOÀN BỘ 5 ẢNH NỀN TẢNG THÀNH CÔNG ===');
}

capturePlatformScreens().catch(e => {
  console.error('LỖI CHỤP ẢNH:', e);
  process.exit(1);
});
