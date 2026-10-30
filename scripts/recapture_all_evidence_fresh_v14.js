// scripts/recapture_all_evidence_fresh_v14.js
// BỘ KỊCH BẢN CHỤP MỚI TOÀN BỘ BỘ ẢNH CHỨNG MINH VIONE PLATFORM (CRM & APP)
// TOÀN BỘ THEME SÁNG (LIGHT THEME) CHO ỨNG DỤNG DI ĐỘNG
// TRIỆT TIÊU 100% CÁC LOẠI POPUP / BANNER THÔNG BÁO / TOAST CHE HEADER
// ĐẦY ĐỦ 23 MÀN HÌNH CRM + 20 MÀN HÌNH APP + CÁC MÀN HÌNH CHỨC NĂNG CON ĐẶC TẢ

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve('document/images/evidence_v9');
const tempRawDir = path.resolve('scratch/temp_raw_fresh_v14');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });

const liveAppUrl = 'https://vione.viconnect.vn';
const liveCrmUrl = 'https://crm_vione.viconnect.vn';
const localDevUrl = 'http://localhost:5137';

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
    try {
      Object.defineProperty(window.navigator, 'standalone', { get: () => true });
    } catch (e) {}

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

async function recaptureAll() {
  console.log('=== BẮT ĐẦU CHỤP MỚI TOÀN BỘ HÌNH ẢNH MINH CHỨNG VIONE PLATFORM ===');
  
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors']
  });

  // 1. Xác thực tài khoản Admin trên hệ thống live
  console.log('1. Đăng nhập hệ thống live để lấy phiên JWT...');
  let authData = { user: { name: 'Admin ViOne' } };
  let token = 'dummy_token';
  let refreshToken = 'dummy_refresh';
  try {
    const loginRes = await fetch(`${liveAppUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@connect.vn', password: '123456' })
    });
    if (loginRes.ok) {
      authData = await loginRes.json();
      token = authData.access_token;
      refreshToken = authData.refresh_token;
      console.log('  -> Đăng nhập thành công:', authData.user?.name || 'Administrator');
    }
  } catch (e) {
    console.warn('  -> Đăng nhập fallback:', e.message);
  }

  // ==========================================
  // PHẦN A: 23 MÀN HÌNH CỔNG WEB QUẢN TRỊ (1440 x 900)
  // ==========================================
  console.log('\n--- 2. CHỤP 23 MÀN HÌNH CỔNG WEB QUẢN TRỊ (DESKTOP 1440x900) ---');
  const crmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true
  });
  const cPage = await crmContext.newPage();

  // Nạp phiên đăng nhập vào CRM
  await cPage.goto(`${liveCrmUrl}/auth`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await cPage.evaluate(({ token, refreshToken, user }) => {
    localStorage.setItem('vibe_token', token);
    localStorage.setItem('vibe_refresh_token', refreshToken);
    localStorage.setItem('vibe_user', JSON.stringify(user));
    document.cookie = `sb-access-token=${token}; path=/; max-age=86400`;
    document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=604800`;
  }, { token, refreshToken, user: authData.user });

  const crmScreens = [
    { id: 1, route: '/auth?portal=crm', name: 'crm_01_login.png', unauth: true },
    { id: 2, route: '/', name: 'crm_02_dashboard.png' },
    { id: 3, route: '/members', name: 'crm_03_customers.png' },
    { id: 4, route: '/opportunities', name: 'crm_04_deals.png' },
    { id: 5, route: '/business-cards', name: 'crm_05_cards.png' },
    { id: 6, route: '/marketplace', name: 'crm_06_marketplace.png' },
    { id: 7, route: '/events', name: 'crm_07_events.png' },
    { id: 8, route: '/checkin', name: 'crm_08_checkin.png' },
    { id: 9, route: '/workflow', name: 'crm_09_workflow.png' },
    { id: 10, route: '/attendance', name: 'crm_10_attendance.png' },
    { id: 11, route: '/income', name: 'crm_11_income.png' },
    { id: 12, route: '/expenses', name: 'crm_12_expenses.png' },
    { id: 13, route: '/fees', name: 'crm_13_fees.png' },
    { id: 14, route: '/platform/sport', name: 'crm_14_sport.png' },
    { id: 15, route: '/platform/run', name: 'crm_15_run.png' },
    { id: 16, route: '/platform/museum', name: 'crm_16_museum.png' },
    { id: 17, route: '/platform/heritage', name: 'crm_17_heritage.png' },
    { id: 18, route: '/platform/tickets', name: 'crm_18_tickets.png' },
    { id: 19, route: '/documents', name: 'crm_19_documents.png' },
    { id: 20, route: '/voting', name: 'crm_20_voting.png' },
    { id: 21, route: '/platform/permissions', name: 'crm_21_rbac.png' },
    { id: 22, route: '/ai', name: 'crm_22_ai.png' },
    { id: 23, route: '/settings', name: 'crm_23_settings.png' },
  ];

  for (const s of crmScreens) {
    try {
      console.log(`[CRM ${s.id}/23] ${s.route} -> ${s.name}`);
      const targetPath = path.join(outDir, s.name);

      if (s.unauth) {
        const uContext = await browser.newContext({
          viewport: { width: 1440, height: 900 },
          deviceScaleFactor: 2,
          ignoreHTTPSErrors: true
        });
        const uPage = await uContext.newPage();
        await uPage.goto(liveCrmUrl + s.route, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
        await uPage.waitForTimeout(1000);
        await uPage.screenshot({ path: targetPath });
        await uContext.close();
      } else {
        await cPage.goto(liveCrmUrl + s.route, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
        await cPage.waitForTimeout(1500);
        await cPage.screenshot({ path: targetPath });
      }
      console.log(`  -> Đã lưu: ${s.name} (${fs.statSync(targetPath).size} bytes)`);
    } catch (e) {
      console.error(`  Lỗi khi chụp ${s.name}:`, e.message);
    }
  }
  await crmContext.close();

  // ==========================================
  // PHẦN B: 20 MÀN HÌNH APP VIONE (THEME SÁNG + MOCKUP IPHONE)
  // ==========================================
  console.log('\n--- 3. CHỤP 20 MÀN HÌNH APP VIONE (THEME SÁNG + KHUNG IPHONE) ---');
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

  // Nạp phiên vào App Mobile
  await mPage.goto(`${liveAppUrl}/auth`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
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
    // 1-15: Chụp từ Live App Server
    { id: 1, route: '/vione/login', name: 'app_01_login.png', unauth: true, base: liveAppUrl },
    { id: 2, route: '/connect-app', name: 'app_02_home.png', base: liveAppUrl },
    { id: 3, route: '/connect-app/me/card', name: 'app_03_card_sheet.png', base: liveAppUrl },
    { id: 4, route: '/connect-app/calendar', name: 'app_04_calendar.png', base: liveAppUrl },
    { id: 5, route: '/connect-app/network', name: 'app_05_network.png', base: liveAppUrl },
    { id: 6, route: '/connect-app/moment', name: 'app_06_moments.png', base: liveAppUrl },
    { id: 7, route: '/connect-app/inbox', name: 'app_07_inbox.png', base: liveAppUrl },
    { id: 8, route: '/connect-app', name: 'app_08_vaction.png', action: 'vaction', base: liveAppUrl },
    { id: 9, route: '/connect-app/community', name: 'app_09_community.png', base: liveAppUrl },
    { id: 10, route: '/connect-app/community', name: 'app_10_tasks.png', action: 'tasks', base: liveAppUrl },
    { id: 11, route: '/connect-app/me', name: 'app_11_me.png', base: liveAppUrl },
    { id: 12, route: '/connect-app/me/card', name: 'app_12_vcard_qr.png', base: liveAppUrl },
    { id: 13, route: '/connect-app/card-scan', name: 'app_13_ocr.png', base: liveAppUrl },
    { id: 14, route: '/connect-app/me/security', name: 'app_14_security.png', base: liveAppUrl },
    { id: 15, route: '/connect-app/notifications', name: 'app_15_notifications.png', base: liveAppUrl },

    // 16-20: Chụp từ Local Dev Server với các tính năng con mới nhất và Header chuẩn
    { id: 16, route: '/platform-app?tab=tickets', name: 'app_16_tickets.png', base: localDevUrl },
    { id: 17, route: '/platform-app?tab=sport', name: 'app_17_sport.png', base: localDevUrl },
    { id: 18, route: '/platform-app?tab=run', name: 'app_18_run.png', base: localDevUrl },
    { id: 19, route: '/platform-app?tab=museum', name: 'app_19_museum.png', base: localDevUrl },
    { id: 20, route: '/platform-app?tab=heritage', name: 'app_20_heritage.png', base: localDevUrl }
  ];

  for (const s of appScreens) {
    try {
      console.log(`[APP ${s.id}/20] ${s.route} -> ${s.name}`);
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
        await uPage.goto(s.base + s.route, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
        await uPage.waitForTimeout(1000);
        await cleanMobileUI(uPage);
        await uPage.screenshot({ path: rawTempPath });
        await uContext.close();
      } else {
        await mPage.goto(s.base + s.route, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
        await mPage.waitForTimeout(1500);

        await cleanMobileUI(mPage);

        if (s.action === 'vaction') {
          const vBtn = await mPage.$('[data-testid="v-button"], button.v-action-btn, #v-action-trigger, .rounded-full.bg-amber-500, .rounded-full.bg-gradient-to-r');
          if (vBtn) {
            await vBtn.click();
            await mPage.waitForTimeout(600);
          }
        }

        await mPage.waitForTimeout(500);
        await cleanMobileUI(mPage);

        await mPage.screenshot({ path: rawTempPath });
      }

      await wrapInPhoneFrame(browser, rawTempPath, outFramedPath);
      console.log(`  -> Đã lưu khung iPhone: ${s.name} (${fs.statSync(outFramedPath).size} bytes)`);
    } catch (e) {
      console.error(`  Lỗi khi chụp ${s.name}:`, e.message);
    }
  }

  // ==========================================
  // PHẦN C: CÁC MÀN HÌNH CON ĐẶC TẢ CHI TIẾT
  // ==========================================
  console.log('\n--- 4. CHỤP CÁC MÀN HÌNH CON TƯƠNG TÁC CHI TIẾT (SPORT, RUN, MUSEUM, HERITAGE, TICKETS) ---');
  const subScreens = [
    {
      name: 'app_17b_bracket.png',
      route: '/platform-app?tab=sport',
      clickBtnText: 'Sơ Đồ Phân Nhánh'
    },
    {
      name: 'app_17c_schedule.png',
      route: '/platform-app?tab=sport',
      clickBtnText: 'Lịch Đấu & Sân Bãi'
    },
    {
      name: 'app_17d_elo.png',
      route: '/platform-app?tab=sport',
      clickBtnText: 'Bảng Xếp Hạng ELO'
    },
    {
      name: 'app_18b_rfid_timing.png',
      route: '/platform-app?tab=run',
      clickBtnText: 'Thảm RFID Timing'
    },
    {
      name: 'app_18c_gps_route.png',
      route: '/platform-app?tab=run',
      clickBtnText: 'Lộ Trình GPS Track'
    },
    {
      name: 'app_18d_finisher_bxh.png',
      route: '/platform-app?tab=run',
      clickBtnText: 'BXH Finisher & e-Cert'
    },
    {
      name: 'app_19b_museum_360.png',
      route: '/platform-app?tab=museum',
      clickBtnText: 'Xoay Lật 360°'
    },
    {
      name: 'app_19c_audio_guide.png',
      route: '/platform-app?tab=museum',
      clickBtnText: 'Audio Guide Đa Ngữ'
    },
    {
      name: 'app_19d_timeline_qr.png',
      route: '/platform-app?tab=museum',
      clickBtnText: 'Niên Biểu & QR'
    },
    {
      name: 'app_20b_geofencing.png',
      route: '/platform-app?tab=heritage',
      clickBtnText: 'GPS Geofencing 20m'
    },
    {
      name: 'app_20c_sacphong.png',
      route: '/platform-app?tab=heritage',
      clickBtnText: 'Sắc Phong Deep Zoom'
    },
    {
      name: 'app_20d_tours.png',
      route: '/platform-app?tab=heritage',
      clickBtnText: 'Tuyến Tham Quan'
    },
    {
      name: 'app_16b_pos_validator.png',
      route: '/platform-app?tab=tickets',
      clickBtnText: 'Cổng Soát Vé Nhân Viên'
    }
  ];

  for (const sub of subScreens) {
    try {
      console.log(`[SUB-VIEW] Chụp tính năng con: ${sub.clickBtnText} -> ${sub.name}`);
      const rawTempPath = path.join(tempRawDir, 'raw_' + sub.name);
      const outFramedPath = path.join(outDir, sub.name);

      await mPage.goto(localDevUrl + sub.route, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await mPage.waitForTimeout(1000);
      await cleanMobileUI(mPage);

      // Nhấp vào tab con tương ứng
      const btn = await mPage.locator(`button:has-text("${sub.clickBtnText}")`).first();
      if (await btn.count() > 0) {
        await btn.click();
        await mPage.waitForTimeout(800);
      }
      await cleanMobileUI(mPage);
      await mPage.screenshot({ path: rawTempPath });

      await wrapInPhoneFrame(browser, rawTempPath, outFramedPath);
      console.log(`  -> Đã lưu khung iPhone: ${sub.name} (${fs.statSync(outFramedPath).size} bytes)`);
    } catch (e) {
      console.error(`  Lỗi khi chụp sub-view ${sub.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('\n=== HOÀN TẤT CHỤP MỚI TOÀN BỘ BỘ ẢNH VIONE THÀNH CÔNG ===');
}

recaptureAll().catch(err => {
  console.error('LỖI CHỤP ẢNH TỔNG HỢP:', err);
  process.exit(1);
});

