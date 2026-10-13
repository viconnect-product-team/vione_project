/**
 * TEST TOÀN DIỆN TẤT CẢ CÁC LUỒNG CHỨC NĂNG CRM VIONE & APP VIONE TRÊN SERVER DEV
 * Đảm bảo kiểm tra đầy đủ các Role quyền:
 * 1. Role Quản trị / Lãnh đạo C-Level (admin@vione.vn)
 * 2. Role Nhân sự / Trưởng ban Kỹ thuật (tech.solutions@vione.vn)
 * 3. Role Thành viên / Đối tác B2B (pharma.health@vione.vn)
 */

const https = require('https');

const SERVER_BASE = 'https://14.225.217.232:5445';
const results = [];

function request(endpoint, options = {}) {
  return new Promise((resolve) => {
    const url = endpoint.startsWith('http') ? endpoint : `${SERVER_BASE}/api${endpoint}`;
    const start = Date.now();
    const req = https.request(url, {
      method: options.method || 'GET',
      rejectUnauthorized: false,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          data: parsed,
          duration: Date.now() - start,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, ok: false, error: err.message, duration: Date.now() - start });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false, error: 'TIMEOUT (15s)', duration: Date.now() - start });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function record(module, testCase, passed, details) {
  results.push({ module, testCase, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${module}] - ${testCase}`);
  if (!passed) {
    console.log(`   -> Chi tiết:`, typeof details === 'object' ? JSON.stringify(details).slice(0, 150) : details);
  }
}

async function loginUser(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: { email, username: email, password },
  });
  return res.data?.access_token || null;
}

async function run() {
  console.log('======================================================================');
  console.log('>>> TEST TOÀN DIỆN ĐẦY ĐỦ CÁC LUỒNG CHỨC NĂNG VIONE SERVER DEV <<<');
  console.log(`>>> Máy chủ Dev: ${SERVER_BASE}`);
  console.log('======================================================================\n');

  // 1. XÁC THỰC CÁC ROLE
  console.log('--- 1. XÁC THỰC & ĐĂNG NHẬP THEO CÁC ROLE NGƯỜI DÙNG ---');
  const adminToken = await loginUser('admin@vione.vn', '123456');
  record('Role C-Level', 'Đăng nhập thành công tài khoản Quản trị / CEO (admin@vione.vn)', !!adminToken, adminToken ? 'Token OK' : 'Failed');

  const staffToken = await loginUser('tech.solutions@vione.vn', '123456');
  record('Role Staff', 'Đăng nhập thành công tài khoản Nhân sự / Trưởng ban Kỹ thuật (tech.solutions@vione.vn)', !!staffToken, staffToken ? 'Token OK' : 'Failed');

  const partnerToken = await loginUser('pharma.health@vione.vn', '123456');
  record('Role Partner', 'Đăng nhập thành công tài khoản Doanh nghiệp Đối tác (pharma.health@vione.vn)', !!partnerToken, partnerToken ? 'Token OK' : 'Failed');

  const badLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@vione.vn', password: 'wrong_password_999' }
  });
  record('Security Guard', 'Chặn truy cập khi nhập sai mật khẩu (HTTP 401)', badLogin.status === 401, `Status: ${badLogin.status}`);

  if (!adminToken || !staffToken) {
    console.error('Không thể lấy đủ tokens xác thực, dừng kiểm thử.');
    return;
  }

  const adminAuth = { Authorization: `Bearer ${adminToken}` };
  const staffAuth = { Authorization: `Bearer ${staffToken}` };
  const partnerAuth = { Authorization: `Bearer ${partnerToken}` };

  // 2. PHÂN HỆ CRM VIONE
  console.log('\n--- 2. KIỂM THỬ ĐẦY ĐỦ CÁC MODULES NGHIỆP VỤ CRM VIONE ---');
  // 2.1 Khách hàng CRM
  const crmCust = await request('/customers', { headers: adminAuth });
  record('CRM Customers', 'Lấy danh sách khách hàng B2B Lead 360 (/customers)', crmCust.ok, crmCust.status);

  // 2.2 Tạo khách hàng mới
  const newCust = await request('/customers', {
    method: 'POST',
    headers: adminAuth,
    body: {
      fullName: 'Đối Tác Thử Nghiệm ' + Date.now(),
      companyName: 'Công Ty CP Công Nghệ ViOne',
      phone: '0988112233',
      email: `lead_${Date.now()}@vione.vn`,
      stage: 'lead',
      pipelineAmount: '120000000'
    }
  });
  record('CRM Customers', 'Tạo mới hồ sơ khách hàng tiềm năng CRM', newCust.ok, newCust.status);

  // 2.3 Phễu bán hàng Deals Kanban
  const crmDeals = await request('/customers/tags', { headers: adminAuth });
  record('CRM Deals Tags', 'Lấy danh mục nhãn phân loại khách hàng & deal', crmDeals.ok, crmDeals.status);

  // 2.4 Quản trị quy trình công việc (Kanban Tasks)
  const crmTasks = await request('/operations/workflow/tasks', { headers: adminAuth });
  record('Workflow Tasks', 'Quản trị quy trình công việc & Task Kanban (/operations/workflow/tasks)', crmTasks.ok, crmTasks.status);

  // 2.5 Tạo task Kanban
  const newTask = await request('/operations/workflow/tasks', {
    method: 'POST',
    headers: adminAuth,
    body: {
      title: 'Đánh giá an toàn hệ thống ViOne ' + Date.now(),
      assignee: 'Trần Quốc Đạt',
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      department: 'Phòng Kỹ Thuật',
      priority: 'high',
      description: 'Kiểm toán toàn diện các luồng phân quyền và mã hóa bảo mật'
    }
  });
  record('Workflow Tasks', 'Tạo mới nhiệm vụ Kanban phân bổ nhân sự', newTask.ok, newTask.status);

  // 2.6 Workload Heatmap nhân sự
  const crmWorkload = await request('/operations/workload', { headers: adminAuth });
  record('Workload Heatmap', 'Giám sát tải trọng & phân bổ công việc nhân sự (/operations/workload)', crmWorkload.ok, crmWorkload.status);

  // 2.7 HRM Chấm công GPS
  const crmAtt = await request('/operations/attendance', { headers: adminAuth });
  record('HRM Attendance', 'Truy xuất lịch sử chấm công GPS & Chuyên cần (/operations/attendance)', crmAtt.ok, crmAtt.status);

  // 2.8 Đơn xin nghỉ phép
  const crmLeaves = await request('/operations/attendance/leaves', { headers: adminAuth });
  record('HRM Leaves', 'Quản trị duyệt đơn xin nghỉ phép nhân sự (/operations/attendance/leaves)', crmLeaves.ok, crmLeaves.status);

  // 2.9 Phê duyệt chi tiền 3 cấp & VietQR
  const crmFin = await request('/operations/finance/approvals', { headers: adminAuth });
  record('Finance 3-Tier', 'Danh sách hồ sơ trình ký & phê duyệt chi 3 cấp (/operations/finance/approvals)', crmFin.ok, crmFin.status);

  // 2.10 Giám sát nhật ký hoạt động nhân sự (Staff Daily Activities)
  const crmStaffAct = await request('/operations/staff/daily-activities', { headers: adminAuth });
  record('Staff Activities', 'Giám sát tiến độ & nhật ký công việc nhân viên (/operations/staff/daily-activities)', crmStaffAct.ok, crmStaffAct.status);

  // 2.11 Sàn giao thương B2B
  const crmMarket = await request('/opportunities', { headers: adminAuth });
  record('B2B Opportunities', 'Quản lý cơ hội mời thầu & hợp tác kinh doanh (/opportunities)', crmMarket.ok, crmMarket.status);

  // 2.12 Sự kiện B2B
  const crmEvents = await request('/events', { headers: adminAuth });
  record('Events & QR', 'Quản lý sự kiện doanh nghiệp & điểm danh QR (/events)', crmEvents.ok, crmEvents.status);

  // 2.13 Lịch hẹn & Họp 1-on-1
  const crmMeetings = await request('/meetings', { headers: adminAuth });
  record('1-on-1 Meetings', 'Lịch hẹn giao thương & đặt phòng họp C-Level (/meetings)', crmMeetings.ok, crmMeetings.status);

  // 2.14 Hộp thư Messenger
  const crmMsgs = await request('/dm/threads', { headers: adminAuth });
  record('Messenger B2B', 'Hộp thư đa kênh trao đổi tin nhắn trực tiếp (/dm/threads)', crmMsgs.ok, crmMsgs.status);

  // 2.15 Quản trị người dùng & Phân quyền RBAC 7x6
  const crmUsers = await request('/users', { headers: adminAuth });
  record('RBAC Users', 'Quản trị tài khoản & Danh sách người dùng hệ thống (/users)', crmUsers.ok, crmUsers.status);

  // 3. PHÂN HỆ APP VIONE CONNECT
  console.log('\n--- 3. KIỂM THỬ ĐẦY ĐỦ CÁC TÍNH NĂNG APP VIONE NATIVE / PWA ---');
  // 3.1 Briefing Lãnh đạo
  const appBriefing = await request('/me/briefing', { headers: adminAuth });
  record('App Home Briefing', 'Lấy thông tin Briefing & Lịch trình thông minh hôm nay (/me/briefing)', appBriefing.ok, appBriefing.status);

  // 3.2 Danh tính số
  const appIdentity = await request('/me/identity', { headers: adminAuth });
  record('App Digital Identity', 'Hồ sơ danh tính số doanh nhân & Titanium Card (/me/identity)', appIdentity.ok, appIdentity.status);

  // 3.3 Mạng lưới kết nối
  const appNetwork = await request('/network/connections', { headers: adminAuth });
  record('App Network', 'Mạng lưới đối tác & Danh bạ doanh nhân kết nối (/network/connections)', appNetwork.ok, appNetwork.status);

  // 3.4 Gợi ý đối tác hôm nay
  const appRecs = await request('/network/recommendations/today', { headers: adminAuth });
  record('Network AI Matcher', 'Gợi ý đối tác tiềm năng thời gian thực (/network/recommendations/today)', appRecs.ok, appRecs.status);

  // 3.5 Khoảnh khắc 24h & Feed
  const appMoments = await request('/network/feed', { headers: adminAuth });
  record('Moments 24h', 'Dải tin khoảnh khắc 24h & Feed doanh nhân (/network/feed)', appMoments.ok, appMoments.status);

  // 3.6 Đăng khoảnh khắc mới
  const newMoment = await request('/moments', {
    method: 'POST',
    headers: adminAuth,
    body: {
      content: 'Kiểm thử đăng khoảnh khắc tự động ' + Date.now(),
      category: 'Giao thương B2B',
      visibility: 'public'
    }
  });
  record('Moments 24h', 'Đăng khoảnh khắc doanh nhân thành công (POST /moments)', newMoment.ok, newMoment.status);


  // 3.7 Cộng đồng All-in-One đang hoạt động
  const appComm = await request('/communities/active', { headers: adminAuth });
  record('App Communities', 'Truy xuất cộng đồng doanh nghiệp All-in-One (/communities/active)', appComm.ok, appComm.status);

  const communityId = appComm.data?.community?.id || appComm.data?.id || 'c-b2b-leaders';

  // 3.8 Danh sách phòng ban (Department RBAC)
  const commDepts = await request(`/communities/${communityId}/departments`, { headers: adminAuth });
  record('Department RBAC', 'Quản trị phòng ban doanh nghiệp (/communities/:id/departments)', commDepts.ok, commDepts.status);

  // 3.9 Họp ban trực tuyến 1-chạm (Instant Video Meeting WebRTC)
  const instantMeeting = await request(`/communities/${communityId}/instant-meeting`, {
    method: 'POST',
    headers: adminAuth,
    body: { title: 'Họp khẩn Ban Điều Hành ' + Date.now() }
  });
  record('Instant Meeting WebRTC', 'Khởi tạo phòng họp C-Level 1-chạm (/communities/:id/instant-meeting)', instantMeeting.ok || instantMeeting.status === 200 || instantMeeting.status === 201, instantMeeting.status);

  // 3.10 Việc của tôi trong cộng đồng
  const commTasks = await request(`/communities/${communityId}/tasks`, { headers: adminAuth });
  record('Community Tasks', 'Quản lý danh sách công việc phòng ban (/communities/:id/tasks)', commTasks.ok, commTasks.status);

  // 3.11 Trợ lý AI ViOne Copilot 6.0
  const aiChat = await request('/ai/chat', {
    method: 'POST',
    headers: adminAuth,
    body: { message: 'Tôi có lịch trình gì hôm nay?' }
  });
  record('AI Copilot 6.0', 'Tương tác thông minh với Thư ký AI ViOne điều hành (/ai/chat)', aiChat.ok, aiChat.status);

  // 4. KIỂM THỬ PHÂN QUYỀN RBAC CHẶT CHẼ THEO ROLE
  console.log('\n--- 4. KIỂM THỬ BẢO VỆ PHÂN QUYỀN RBAC THEO TỪNG VAI TRÒ ---');
  // 4.1 Staff không được quyền quản trị người dùng -> Chặn (403/401)
  const staffGetUsers = await request('/users', { headers: staffAuth });
  const staffBlockedUsers = staffGetUsers.status === 403 || staffGetUsers.status === 401;
  record('RBAC Boundary', 'Chặn tài khoản Nhân sự truy cập API quản trị người dùng (/users) -> 403 Forbidden', staffBlockedUsers, `Status: ${staffGetUsers.status}`);

  // 4.2 Staff truy cập danh sách việc của mình
  const staffMyTasks = await request('/communities/tasks/my-all', { headers: staffAuth });
  record('Staff Task Access', 'Nhân sự lấy danh sách nhiệm vụ được giao (/communities/tasks/my-all)', staffMyTasks.ok, staffMyTasks.status);

  // 4.3 Partner truy cập hồ sơ định danh của mình
  const partnerMe = await request('/me/identity', { headers: partnerAuth });
  record('Partner Identity', 'Đối tác B2B xem danh thiếp số cá nhân (/me/identity)', partnerMe.ok, partnerMe.status);

  // 4.4 Partner không được quyền truy cập danh sách người dùng quản trị
  const partnerUsers = await request('/users', { headers: partnerAuth });
  const partnerBlocked = partnerUsers.status === 403 || partnerUsers.status === 401;
  record('Partner Boundary', 'Chặn tài khoản Đối tác truy cập danh sách quản trị hệ thống (/users) -> 403 Forbidden', partnerBlocked, `Status: ${partnerUsers.status}`);


  // 5. TỔNG KẾT BÁO CÁO
  console.log('\n======================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`>>> TỔNG HỢP KIỂM THỬ TOÀN BỘ CHỨC NĂNG: ${passed}/${total} ĐẠT (${((passed / total) * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.log(`⚠️ Có ${failed} bài kiểm tra cần kiểm tra lại:`);
    results.filter(r => !r.passed).forEach(r => console.log(`   - [${r.module}] ${r.testCase}:`, r.details));
  } else {
    console.log('🎉 100% CÁC CHỨC NĂNG CỦA CẢ CRM VÀ APP VIONE TRÊN SERVER DEV ĐẠT CHUẨN HOÀN HẢO!');
  }
  console.log('======================================================================\n');
}

run().catch(err => {
  console.error('Lỗi nghiêm trọng:', err);
});
