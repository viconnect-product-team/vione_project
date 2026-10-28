import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  RefreshCw,
  Calendar,
  ClipboardList,
  ScanLine,
  QrCode,
  Handshake,
  Package,
  FileBarChart,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Bell,
  Mail,
  Newspaper,
  Gift,
  Award,
  Vote,
  Users2,
  FolderOpen,
  Settings,
  History,
  Sparkles,
  MessageSquare,
  Store,
  ShieldCheck,
  UserCog,
  FileText,
  CalendarDays,
  Trophy,
  Flame,
  Radio,
  Landmark,
  Layers,
  Archive,
  Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TKey } from "@/lib/i18n";

export type NavItem = {
  key: TKey;
  icon: LucideIcon;
  to: string;
  label?: string;
  platformOnly?: boolean;
};

export type NavGroup = {
  label?: string;
  groupKey?: TKey;
  items: NavItem[];
  platformOnly?: boolean;
};

/**
 * Danh sách phân nhóm điều hướng chuẩn của Hệ thống ViOne CRM
 * Đồng bộ chính xác 100% với Sidebar và Breadcrumbs
 */
export const navGroups: NavGroup[] = [
  {
    label: "NGHIỆP VỤ CỐT LÕI",
    items: [
      { key: "nav.dashboard", icon: LayoutDashboard, to: "/", label: "Tổng quan" },
      { key: "nav.vioneMemberList" as TKey, icon: Users, to: "/members", label: "Khách hàng (CRM)" },
      { key: "nav.vioneMessages" as TKey, icon: MessageSquare, to: "/messages", label: "Hộp thư đa kênh" },
      { key: "nav.vioneAi" as TKey, icon: Sparkles, to: "/ai", label: "Tự động hóa" },
      { key: "nav.vioneCompanyList" as TKey, icon: Building2, to: "/companies", label: "Hồ sơ doanh nghiệp" },
      { key: "nav.vioneCardTiers" as TKey, icon: Tags, to: "/segments", label: "Hạng thẻ (Gold / Titanium)" },
      { key: "nav.vioneRenew" as TKey, icon: RefreshCw, to: "/renewal", label: "Gia hạn thẻ & dịch vụ" },
    ],
  },
  {
    label: "VẬN HÀNH & TÀI LIỆU",
    items: [
      { key: "nav.vioneDocuments" as TKey, icon: FolderOpen, to: "/documents", label: "Kho Tài Liệu" },
      { key: "nav.vioneWorkflow" as TKey, icon: ClipboardList, to: "/workflow", label: "Quy Trình & Giao Việc" },
      { key: "nav.vioneMeetings" as TKey, icon: CalendarDays, to: "/meetings", label: "Lịch Họp & Cuộc Hẹn" },
    ],
  },
  {
    label: "CỘNG ĐỒNG & THỂ THAO",
    items: [
      { key: "nav.vioneEventList" as TKey, icon: Calendar, to: "/events", label: "Sự Kiện ViOne Event" },
      { key: "nav.vioneEventReg" as TKey, icon: ClipboardList, to: "/event-registrations", label: "Đăng Ký & Khách Mời" },
      { key: "nav.vioneCheckin" as TKey, icon: QrCode, to: "/checkin-qr", label: "Soát Vé NFC & QR Pass" },
      { key: "nav.vioneSport" as TKey, icon: Trophy, to: "/platform/sport", label: "ViOne Sport (Giải Đấu & CLB)" },
      { key: "nav.vioneRun" as TKey, icon: Flame, to: "/platform/run", label: "ViOne Run (Giải Chạy & RFID)" },
    ],
  },
  {
    label: "VĂN HÓA & DI SẢN",
    items: [
      { key: "nav.vioneHeritage" as TKey, icon: Landmark, to: "/platform/heritage", label: "ViOne Heritage (Di Sản Văn Hóa)" },
      { key: "nav.vioneMuseum" as TKey, icon: Layers, to: "/platform/museum", label: "ViOne Museum (Bảo Tàng Số 3D)" },
      { key: "nav.vioneArchive" as TKey, icon: Archive, to: "/platform/archive", label: "ViOne Archive (Lưu Trữ Số Tư Liệu)" },
      { key: "nav.vioneTicket" as TKey, icon: Ticket, to: "/platform/tickets", label: "ViOne Ticket (Vé Điện Tử & Soát Vé)" },
      { key: "nav.vioneReview" as TKey, icon: Radio, to: "/platform/review", label: "ViOne Review (Trạm Chạm NFC)" },
    ],
  },
  {
    label: "TIỆN ÍCH & GIAO THƯƠNG",
    items: [
      { key: "nav.vioneMarketplace" as TKey, icon: Store, to: "/marketplace", label: "Sàn Sản Phẩm & Dịch Vụ" },
      { key: "nav.vioneOpportunities" as TKey, icon: FileBarChart, to: "/opportunities", label: "Cơ Hội Giao Thương & Hợp Tác" },
      { key: "nav.vioneQuotes" as TKey, icon: ClipboardList, to: "/marketplace/my-quotes", label: "Yêu Cầu Báo Giá VIP" },
    ],
  },
  {
    label: "TÀI CHÍNH & DOANH THU",
    items: [
      { key: "nav.vioneRevenue" as TKey, icon: Wallet, to: "/fees", label: "Doanh Thu & Phí Dịch Vụ" },
      { key: "nav.vioneCashflow" as TKey, icon: ArrowLeftRight, to: "/income", label: "Sổ Quỹ Thu - Chi" },
      { key: "nav.vioneGrowthReport" as TKey, icon: PieChart, to: "/finance-report", label: "Báo Cáo Tăng Trưởng" },
    ],
  },
  {
    label: "CẤU HÌNH & HỆ THỐNG",
    items: [
      { key: "nav.vioneSettings" as TKey, icon: Settings, to: "/settings", label: "Cài Đặt Hệ Thống" },
      { key: "nav.vioneAudit" as TKey, icon: History, to: "/activity", label: "Nhật Ký Kiểm Toán" },
      { key: "nav.account" as TKey, icon: UserCog, to: "/account-settings", label: "Tài khoản cá nhân" },
      { key: "nav.platform" as TKey, icon: ShieldCheck, to: "/platform", label: "Quản trị Nền Tảng & Phân Quyền", platformOnly: true },
    ],
  },
];
