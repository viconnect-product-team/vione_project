// scripts/capture_light_theme_app_screens_v12.js
// Bộ kịch bản chụp toàn bộ 20 màn hình App Di Động ViOne mới nhất từ live server https://vione.viconnect.vn
// THEME SÁNG (LIGHT THEME) THEO YÊU CẦU NGƯỜI DÙNG
// TRIỆT TIÊU 100% CÁC LOẠI POPUP / BANNER THÔNG BÁO CHE HEADER
// ĐẢM BẢO KHOẢNG CÁCH AN TOÀN DYNAMIC ISLAND VÀ KHÔNG CHỨA LỖI "SOMETHING WENT WRONG"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve('document/images/evidence_v9');
const tempRawDir = path.resolve('scratch/temp_raw_app_light');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });

const baseUrl = 'https://vione.viconnect.vn';

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

  await framePage.setContent(html);
  await framePage.waitForTimeout(300);
  const phoneEl = await framePage.$('#phone');
  await phoneEl.screenshot({ path: outFramedPath });
  await framePage.close();
}

async function cleanMobileUI(page) {
  await page.evaluate(() => {
    // 1. Giả lập Standalone PWA
    try {
      Object.defineProperty(window.navigator, 'standalone', { get: () => true });
    } catch (e) {}

    // 2. Thiết lập cờ chặn thông báo và chế độ sáng LIGHT THEME
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

    // 3. Xóa vĩnh viễn các selector popup, banner, toast
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

    // 5. Tiêm CSS cưỡng chế ẩn triệt để mọi popup và đảm bảo safe-area-top 52px
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
      [data-testid="pwa-install"],
      [data-pwa-install],
      .toaster,
      [data-sonner-toaster],
      [data-sonner-toast],
      .sonner-toast {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      :root {
        --bc-mobile-safe-top: 52px !important;
        --bc-mobile-safe-top-compact: 52px !important;
      }
      header.sticky, .bc-header, header {
        padding-top: 52px !important;
      }
    `;

    document.querySelectorAll('header.sticky, .bc-header, header').forEach(h => {
      h.style.paddingTop = '52px';
    });
  });
}

async function captureAll20AppScreensLight() {
  console.log('=== BẮT ĐẦU CHỤP LẠI TOÀN BỘ 20 ẢNH APP VIONE THEME SÁNG (LIGHT THEME) ===');

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@connect.vn', password: '123456' })
  });
  const authData = await loginRes.json();
  console.log('Xác thực API thành công cho tài khoản:', authData.user?.name);
  const token = authData.access_token;
  const refreshToken = authData.refresh_token;

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--ignore-certificate-errors']
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
      sessionStorage.setItem('vba_pwa_installed', 'true');
      localStorage.setItem('vba_pwa_installed', 'true');
      localStorage.setItem('vba.theme', 'light');
      sessionStorage.setItem('vba.theme', 'light');
      if (window.Notification) {
        Object.defineProperty(Notification, 'permission', { get: () => 'granted' });
      }
    } catch (e) {}
  });

  const mPage = await mobileContext.newPage();

  // Nạp phiên đăng nhập vào trình duyệt
  await mPage.goto(`${baseUrl}/auth`, { waitUntil: 'domcontentloaded' });
  await mPage.evaluate(({ token, refreshToken, user }) => {
    localStorage.setItem('vibe_token', token);
    localStorage.setItem('vibe_refresh_token', refreshToken);
    localStorage.setItem('vibe_user', JSON.stringify(user));
    localStorage.setItem('vba.theme', 'light');
    sessionStorage.setItem('vba.theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
    document.cookie = `sb-access-token=${token}; path=/; max-age=86400`;
    document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=604800`;
  }, { token, refreshToken, user: authData.user });

  const appScreens = [
    { id: 1, route: '/vione/login', name: 'app_01_login.png', unauth: true },
    { id: 2, route: '/connect-app', name: 'app_02_home.png' },
    { id: 3, route: '/connect-app/me/card', name: 'app_03_card_sheet.png' },
    { id: 4, route: '/connect-app/calendar', name: 'app_04_calendar.png' },
    { id: 5, route: '/connect-app/network', name: 'app_05_network.png' },
    { id: 6, route: '/connect-app/moment', name: 'app_06_moments.png' },
    { id: 7, route: '/connect-app/inbox', name: 'app_07_inbox.png' },
    { id: 8, route: '/connect-app', name: 'app_08_vaction.png', action: 'vaction' },
    { id: 9, route: '/connect-app/community', name: 'app_09_community.png' },
    { id: 10, route: '/connect-app/community', name: 'app_10_tasks.png', action: 'tasks' },
    { id: 11, route: '/connect-app/me', name: 'app_11_me.png' },
    { id: 12, route: '/connect-app/me/card', name: 'app_12_vcard_qr.png' },
    { id: 13, route: '/connect-app/card-scan', name: 'app_13_ocr.png' },
    { id: 14, route: '/connect-app/me/security', name: 'app_14_security.png' },
    { id: 15, route: '/connect-app/notifications', name: 'app_15_notifications.png' },
    { id: 16, route: '/platform-app?tab=tickets', name: 'app_16_tickets.png' },
    { id: 17, route: '/platform-app?tab=sport', name: 'app_17_sport.png' },
    { id: 18, route: '/platform-app?tab=run', name: 'app_18_run.png' },
    { id: 19, route: '/platform-app?tab=museum', name: 'app_19_museum.png' },
    { id: 20, route: '/platform-app?tab=heritage', name: 'app_20_heritage.png' }
  ];

  for (const s of appScreens) {
    try {
      console.log(`\n[CHỤP ẢNH ${s.id}/20] Tuyến đường: ${s.route} -> ${s.name}`);
      const rawTempPath = path.join(tempRawDir, 'raw_' + s.name);
      const outFramedPath = path.join(outDir, s.name);

      if (s.unauth) {
        const uContext = await browser.newContext({
          viewport: { width: 393, height: 852 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          ignoreHTTPSErrors: true
        });
        await uContext.addInitScript(() => {
          try {
            sessionStorage.setItem('vba.theme', 'light');
            localStorage.setItem('vba.theme', 'light');
            sessionStorage.setItem('vione_notif_prompt_dismissed', 'true');
            localStorage.setItem('vione_notif_prompt_dismissed', 'true');
          } catch (e) {}
        });
        const uPage = await uContext.newPage();
        await uPage.goto(baseUrl + s.route, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
        await uPage.waitForTimeout(1000);
        await cleanMobileUI(uPage);
        await uPage.screenshot({ path: rawTempPath });
        await uContext.close();
      } else {
        await mPage.goto(baseUrl + s.route, { waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});
        await mPage.waitForTimeout(2000);

        // Chạy làm sạch lần 1
        await cleanMobileUI(mPage);

        // Thực hiện hành động chuyên biệt nếu có
        if (s.action === 'vaction') {
          const vBtn = await mPage.$('[data-testid="v-button"], button.v-action-btn, #v-action-trigger, .rounded-full.bg-amber-500, .rounded-full.bg-gradient-to-r');
          if (vBtn) {
            await vBtn.click();
            await mPage.waitForTimeout(600);
          }
        }

        // Chờ thêm 500ms và làm sạch lần 2 ngay trước khi chụp
        await mPage.waitForTimeout(500);
        await cleanMobileUI(mPage);

        // KIỂM TRA NGHIÊM NGẶT: TUYỆT ĐỐI KHÔNG CHỨA "Something went wrong"
        const content = await mPage.content();
        if (content.includes('Something went wrong')) {
          throw new Error(`CRITICAL ERROR: Màn hình ${s.route} hiển thị "Something went wrong"!`);
        }
        if (content.includes('Cấp quyền thông báo hệ thống') || content.includes('Nhận cuộc gọi đến, tin nhắn đối tác')) {
          console.warn(`CẢNH BÁO: Vẫn còn banner thông báo, tiến hành gỡ bỏ cưỡng chế cấp DOM...`);
          await mPage.evaluate(() => {
            document.querySelectorAll('aside').forEach(a => a.remove());
          });
        }

        await mPage.screenshot({ path: rawTempPath });
      }

      // Đóng khung viền điện thoại iPhone 15/16 Pro với Dynamic Island và status bar theme sáng
      await wrapInPhoneFrame(browser, rawTempPath, outFramedPath);
      const fileSize = fs.statSync(outFramedPath).size;
      console.log(`  -> Thành công: Đã tạo ${s.name} (${fileSize} bytes)`);
    } catch (e) {
      console.error(`  LỖI KHI CHỤP ${s.name}:`, e.message);
      throw e;
    }
  }

  await browser.close();
  console.log('\n=== HOÀN TẤT CHỤP LẠI TOÀN BỘ 20 ẢNH APP VIONE THEME SÁNG THÀNH CÔNG ===');
}

captureAll20AppScreensLight().catch(e => {
  console.error('LỖI TOÀN CỤC:', e);
  process.exit(1);
});

