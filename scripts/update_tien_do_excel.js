const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const NEW_WBS_ITEMS = [
  {
    wbs: "5.0",
    platform: "Full-Stack (BE / Web CRM / Mobile)",
    title: "Phân Quyền Phòng Ban Chuyên Trách (Department-based RBAC)",
    detail: "Khối -> Phòng ban -> Nhóm chuyên trách (vione_community_departments). Kiểm soát 5 cờ quyền: canAssign, canAccept, canReport, canHandover, canMeet. Department Guard bảo mật dữ liệu theo phòng ban.",
    complexity: "High",
    pic: "Solution Architect & Fullstack Lead",
    start: "03/10/2026",
    end: "07/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Department RBAC Engine, Department Guard, DepartmentPermissionsModal, RESTful APIs /department-members"
  },
  {
    wbs: "5.1",
    platform: "Full-Stack (NestJS BE / CRM / App)",
    title: "Cơ Chế Bàn Giao Công Việc Tự Động (Auto-Handover Engine)",
    detail: "Gom và chuyển giao hàng loạt công việc (tasks), khách hàng (CRM customers), cơ hội (deals) khi luân chuyển hoặc thôi việc. Tự động sinh biên bản bàn giao, phát thông báo Push/In-app, lưu vết audit trail handover_history.",
    complexity: "High",
    pic: "Senior Backend Dev & Mobile Lead",
    start: "05/10/2026",
    end: "08/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Auto-Handover Service, Bulk Reassignment UI, Handover History Audit Trail, Notification Push"
  },
  {
    wbs: "5.2",
    platform: "Full-Stack (Web CRM & Mobile App)",
    title: "Mô Hình Cộng Đồng Hợp Nhất & Gói Dùng Thử 30 Ngày (Unified Community & 30-Day Subscription)",
    detail: "Hợp nhất 2 mô hình cộng đồng (Nội bộ & B2B) thành 1 mô hình toàn năng duy nhất (tasks, supervision, opportunities, news, events, members). Gating phân hệ giao việc tại Trang chủ (chỉ hiện khi có gói hoặc dùng thử 30 ngày free). Thẻ CTA Champagne Gold và form khởi tạo 1-chạm.",
    complexity: "High",
    pic: "Product Owner & Frontend Lead",
    start: "07/10/2026",
    end: "10/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Unified Community Model, Subscription Trial Gating, CommunityPackageTrialCta, CreateCommunityGroupModal"
  },
  {
    wbs: "5.3",
    platform: "Full-Stack (WebRTC / Mobile / Web)",
    title: "Họp Ban Trực Tuyến 1-Chạm (Instant Department Meeting - C-Level Room)",
    detail: "Nút họp ban 1-chạm mạ vàng trên thanh công cụ điều hành công việc. Khởi tạo tức thì phòng họp WebRTC C-Level bảo mật cao, tự động gửi thông báo triệu tập khẩn cấp đến nhân sự phòng ban.",
    complexity: "Medium",
    pic: "Mobile Dev & WebRTC Engineer",
    start: "08/10/2026",
    end: "11/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Instant Meeting Trigger, C-Level Executive Room WebRTC, Urgent Push Notification"
  },
  {
    wbs: "5.4",
    platform: "Full-Stack (Office Document Parser)",
    title: "Import & Export Đa Định Dạng (Excel & Word for Assigner & Assignee)",
    detail: "Người giao việc: Nạp công việc hàng loạt từ tệp .xlsx/.csv và đề án nhiệm vụ từ .docx. Người nhận việc: Đính kèm đồng thời báo cáo Word và bảng tính số liệu Excel khi nghiệm thu công việc.",
    complexity: "Medium",
    pic: "Backend & Frontend Dev",
    start: "09/10/2026",
    end: "11/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Excel Bulk Task Importer, Word Scheme Parser, Dual Word/Excel Proof Attachment Modal"
  },
  {
    wbs: "5.5",
    platform: "Web CRM ViOne Platform",
    title: "Màn Đăng Nhập CRM Tĩnh C-Level & Bộ Lọc Trạng Thái Toàn Diện (Dashboard & Marketplace)",
    detail: "Triệt tiêu 100% animation xoay vòng gây phân tâm, áp dụng kiến trúc tĩnh 2 cột mạ vàng sang trọng. Trang bị bộ lọc trạng thái đa chiều (Status Filter Tabs) kèm badge đếm số lượng thời gian thực trên C-Level Dashboard và Sàn Marketplace.",
    complexity: "Medium",
    pic: "UI/UX Lead & Senior Frontend Dev",
    start: "10/10/2026",
    end: "12/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "Static C-Level Auth Screen (/auth), ExecutiveDashboard Status Filters, Marketplace Category Filters"
  },
  {
    wbs: "5.6",
    platform: "Mobile Native App & PWA (/connect-app)",
    title: "Đồng Bộ Hoàn Toàn Chức Năng ViOne PWA Với ViOne Native App & Cân Đối UI/UX",
    detail: "Đồng bộ 100% tính năng giữa PWA (/connect-app) và Native App (apps/mobile_vione). Cân đối chuẩn xác bố trí text, icon, typography, safe area insets (Dynamic Island / Gesture Nav) trên 4 tabs chính (Home, Network, Community, Me), nút V trung tâm (VActionSheet), PostMomentModal, CardScanReviewModal, ViOneVoiceAssistantModal.",
    complexity: "High",
    pic: "Mobile Lead & Senior UI/UX Designer",
    start: "11/10/2026",
    end: "12/10/2026",
    progress: 100,
    status: "Hoàn Thành",
    deliverable: "100% PWA-Native Parity, CustomBottomTabBar Insets Alignment, Balanced Mobile Native Layout"
  }
];

async function updateWorkbook(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  console.log('Updating workbook:', filePath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const sheet = wb.getWorksheet(1);

  // Check existing WBS items
  const existingWbs = new Set();
  for (let r = 2; r <= sheet.rowCount; r++) {
    const val = sheet.getCell(r, 1).value;
    if (val) existingWbs.add(String(val).trim());
  }

  // Get style reference from row 2
  const sampleRow = sheet.getRow(2);

  for (const item of NEW_WBS_ITEMS) {
    if (existingWbs.has(item.wbs)) {
      console.log('Skipping existing WBS:', item.wbs);
      continue;
    }

    const newRow = sheet.addRow([
      item.wbs,
      item.platform,
      item.title,
      item.detail,
      item.complexity,
      item.pic,
      item.start,
      item.end,
      item.progress,
      item.status,
      item.deliverable
    ]);

    // Apply styles to new row cells
    newRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 10, color: { argb: "000000" } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        left: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'E2E8F0' } },
      };
      if (colNumber === 1 || colNumber === 5 || colNumber === 7 || colNumber === 8 || colNumber === 9 || colNumber === 10) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      }
      if (colNumber === 10) {
        cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "10B981" } };
      }
    });
    console.log('Added WBS row:', item.wbs, item.title);
  }

  await wb.xlsx.writeFile(filePath);
  console.log('Successfully saved:', filePath);
}

// Update TIEN_DO_CONG_VIEC_VIONE.xlsx (8-column format)
async function updateSimpleTienDo(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  console.log('Updating simple workbook:', filePath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const sheet = wb.getWorksheet(1);

  const existingWbs = new Set();
  for (let r = 2; r <= sheet.rowCount; r++) {
    const val = sheet.getCell(r, 3).value; // Col 3 is Ma WBS
    if (val) existingWbs.add(String(val).trim());
  }

  let nextStt = sheet.rowCount;

  for (const item of NEW_WBS_ITEMS) {
    if (existingWbs.has(item.wbs)) {
      continue;
    }
    const newRow = sheet.addRow([
      nextStt++,
      item.wbs,
      item.title,
      item.pic,
      item.complexity === "High" ? "Critical" : "High",
      "Hoàn thành 100%",
      100,
      item.detail
    ]);

    newRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 10 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        left: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'E2E8F0' } },
      };
      if (colNumber === 1 || colNumber === 2 || colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      }
    });
    console.log('Added simple row:', item.wbs);
  }

  await wb.xlsx.writeFile(filePath);
  console.log('Saved simple workbook:', filePath);
}

(async () => {
  await updateWorkbook('docs/TIEN_DO_CONG_VIEC_HE_THONG_VA_APP_VIONE.xlsx');
  await updateWorkbook('apps/vione_app_fe/public/docs/TIEN_DO_CONG_VIEC_HE_THONG_VA_APP_VIONE.xlsx');
  await updateSimpleTienDo('apps/vione_app_fe/public/docs/TIEN_DO_CONG_VIEC_VIONE.xlsx');
  console.log('ALL EXCEL FILES UPDATED SUCCESSFULLY!');
})();
