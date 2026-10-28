import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { useRole } from "@/hooks/use-role";
import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useServerData } from "@/hooks/use-server-data";
import { listMyAssociationsFn, type MyAssociation } from "@/lib/associations.functions";
import { resolveMediaUrl } from "@/lib/api-client";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  RefreshCw,
  Calendar,
  ClipboardList,
  ScanLine,
  QrCode as QrCodeIcon,
  Handshake,
  Kanban,
  Activity,
  UserCheck,
  Package,
  FileBarChart,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
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
  IdCard,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  PanelLeftClose,
  PanelLeftOpen,
  UserPlus,
  Sun,
  Moon,
  Contrast,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  Trophy,
  Flame,
  Landmark,
  Ticket,
  Archive,
  Radio,
  Layers,
  MapPin,
  Compass,
  Box,
  FileText,
  BarChart3,
} from "lucide-react";
import type { TKey } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { ProfileMenu } from "@/components/dashboard/ProfileMenu";
import { ReportsTreeMenu } from "@/components/dashboard/ReportsTreeMenu";
import { SubscribePackageModal } from "@/components/dashboard/SubscribePackageModal";

export type SubItem = {
  key: string;
  label: string;
  to: string;
  icon?: LucideIcon;
  badge?: string | number;
};

type Item = {
  key: TKey;
  icon: LucideIcon;
  to?: string;
  label?: string;
  badge?: string | number;
  children?: SubItem[];
};

// ── PHÂN HỆ QUẢN TRỊ NỀN TẢNG (SUPER ADMIN / PLATFORM ADMIN) ─────────────
// Dành cho ban quản trị nền tảng ViOne điều hành và giám sát toàn hệ thống
const superAdminOverview: Item[] = [
  {
    key: "nav.platformOverview" as TKey,
    icon: LayoutDashboard,
    to: "/platform",
    label: "Bảng Điều Khiển Nền Tảng",
    badge: "5.0",
  },
  {
    key: "nav.vioneAi" as TKey,
    icon: Sparkles,
    to: "/ai",
    label: "Trợ Lý Điều Hành AI ViOne",
    badge: "AI",
  },
];

const superAdminTenantsSuite: Item[] = [
  {
    key: "nav.vioneCompanyList" as TKey,
    icon: Building2,
    to: "/companies",
    label: "Quản Lý Danh Sách Doanh Nghiệp",
  },
  {
    key: "nav.vionePlatformMembers" as TKey,
    icon: Users,
    to: "/members",
    label: "Khách Hàng & Đối Tác Nền Tảng",
  },
  {
    key: "nav.vionePlatformMonitoring" as TKey,
    icon: Activity,
    to: "/platform/ai-audit",
    label: "Theo Dõi Hoạt Động & AI Audit",
    badge: "Giám sát",
  },
];

const superAdminPackagesSuite: Item[] = [
  {
    key: "nav.vioneCardTiers" as TKey,
    icon: Package,
    to: "/segments",
    label: "Cấu Hình Gói ViOne CRM",
  },
  {
    key: "nav.vioneRevenueReport" as TKey,
    icon: ArrowDownCircle,
    to: "/income",
    label: "Báo Cáo Thu Nền Tảng",
  },
];

const superAdminOperationsSuite: Item[] = [
  {
    key: "nav.vioneDocuments" as TKey,
    icon: FolderOpen,
    to: "/documents",
    label: "Kho Tài Liệu ViConnect Drive",
    badge: "Drive",
  },
  {
    key: "nav.vioneMeetings" as TKey,
    icon: Calendar,
    to: "/meetings",
    label: "Lịch Trình & Cuộc Họp ViConnect",
  },
  {
    key: "nav.vioneWorkflow" as TKey,
    icon: Kanban,
    to: "/workflow",
    label: "Quy Trình & Giao Việc ViConnect",
    badge: "Kanban",
  },
];

const superAdminCommunitySportSuite: Item[] = [
  {
    key: "nav.vioneEvents" as TKey,
    icon: Calendar,
    to: "/events",
    label: "ViOne Event — Sự Kiện & Hội Thảo",
    badge: "Event",
    children: [
      { key: "event-list", label: "Danh Sách Sự Kiện & Diễn Đàn", to: "/events", icon: Calendar },
      { key: "event-checkin", label: "Điểm Danh & Quét Mã QR", to: "/checkin", icon: ScanLine },
      { key: "event-tickets", label: "Quản Lý Vé Mời Sự Kiện", to: "/platform/tickets?tab=tickets", icon: Ticket },
    ],
  },
  {
    key: "nav.vioneSport" as TKey,
    icon: Trophy,
    to: "/platform/sport",
    label: "ViOne Sport — Thể Thao Đa Môn",
    badge: "Sport",
    children: [
      { key: "sport-tournaments", label: "Giải Đấu & Tranh Cúp", to: "/platform/sport?tab=tournaments", icon: Trophy },
      { key: "sport-clubs", label: "Câu Lạc Bộ Thể Thao", to: "/platform/sport?tab=clubs", icon: Users },
      { key: "sport-bracket", label: "Sơ Đồ Thi Đấu & BXH", to: "/platform/sport?tab=bracket", icon: Activity },
    ],
  },
  {
    key: "nav.vioneRun" as TKey,
    icon: Flame,
    to: "/platform/run",
    label: "ViOne Run — Giải Chạy & RFID",
    badge: "Run",
    children: [
      { key: "run-races", label: "Giải Chạy & Cự Ly (BIB)", to: "/platform/run?tab=races", icon: Flame },
      { key: "run-checkpoints", label: "Trạm Cảm Biến RFID", to: "/platform/run?tab=checkpoints", icon: ScanLine },
      { key: "run-leaderboard", label: "Bảng Xếp Hạng & e-Cert", to: "/platform/run?tab=leaderboard", icon: Award },
    ],
  },
  {
    key: "nav.vioneCheckin" as TKey,
    icon: ScanLine,
    to: "/checkin",
    label: "Điểm Danh & Check-in QR",
  },
  {
    key: "nav.vioneMarketplace" as TKey,
    icon: Store,
    to: "/marketplace",
    label: "Sàn Giao Thương Toàn Hệ Thống",
  },
  {
    key: "nav.vioneMessages" as TKey,
    icon: MessageSquare,
    to: "/messages",
    label: "Kết Nối Nhắn Tin Toàn Hệ Thống",
    badge: "Chat",
  },
];

const superAdminCultureHeritageSuite: Item[] = [
  {
    key: "nav.vioneHeritage" as TKey,
    icon: Landmark,
    to: "/platform/heritage",
    label: "ViOne Heritage — Di Sản Văn Hóa",
    badge: "Di sản",
    children: [
      { key: "heritage-list", label: "Danh Mục Di Sản & Hồ Sơ", to: "/platform/heritage?tab=heritage_list", icon: Landmark },
      { key: "heritage-gis", label: "Bản Đồ GIS Khoanh Vùng", to: "/platform/heritage?tab=gis_map", icon: MapPin },
      { key: "heritage-vr360", label: "Tư Liệu VR360 & GPS Audio", to: "/platform/heritage?tab=archives_vr360", icon: Compass },
    ],
  },
  {
    key: "nav.vioneMuseum" as TKey,
    icon: Layers,
    to: "/platform/museum",
    label: "ViOne Museum — Bảo Tàng Số 3D",
    badge: "Bảo tàng",
    children: [
      { key: "museum-exhibitions", label: "Gian Trưng Bày Chuyên Đề", to: "/platform/museum?tab=museums", icon: Layers },
      { key: "museum-artifacts", label: "Hiện Vật 3D Photogrammetry", to: "/platform/museum?tab=artifacts", icon: Box },
      { key: "museum-nfc", label: "Trạm Thẻ Chip NFC Hiện Vật", to: "/platform/museum?tab=nfc_tags", icon: Radio },
    ],
  },
  {
    key: "nav.vioneArchive" as TKey,
    icon: Archive,
    to: "/platform/archive",
    label: "ViOne Archive — Lưu Trữ Tư Liệu",
    badge: "Tư liệu",
    children: [
      { key: "archive-moc-ban", label: "Mộc Bản & Sắc Phong", to: "/platform/archive?tab=moc_ban", icon: Archive },
      { key: "archive-chau-ban", label: "Châu Bản & Địa Bạ Cổ", to: "/platform/archive?tab=chau_ban", icon: FileText },
      { key: "archive-cert", label: "Chứng Thực Số Tư Liệu", to: "/platform/archive?tab=digital_cert", icon: ShieldCheck },
    ],
  },
  {
    key: "nav.vioneTicket" as TKey,
    icon: Ticket,
    to: "/platform/tickets",
    label: "ViOne Ticket — Vé Điện Tử & Soát Vé",
    badge: "Ticket",
    children: [
      { key: "ticket-list", label: "Quản Lý Vé & Phát Hành Vé", to: "/platform/tickets?tab=tickets", icon: Ticket },
      { key: "ticket-scanner", label: "Cổng Soát Vé Mã QR Quang Học", to: "/platform/tickets?tab=scanner", icon: QrCodeIcon },
      { key: "ticket-reports", label: "Báo Cáo Lưu Lượng Cửa Vé", to: "/platform/tickets?tab=reports", icon: BarChart3 },
    ],
  },
  {
    key: "nav.vioneReview" as TKey,
    icon: Radio,
    to: "/platform/review",
    label: "ViOne Review — Chạm Thẻ NFC",
    badge: "NFC",
    children: [
      { key: "review-tags", label: "Cấu Hình Thẻ Chip NFC", to: "/platform/review?tab=tags", icon: Radio },
      { key: "review-locations", label: "Điểm Đặt Trạm Thẻ Review", to: "/platform/review?tab=locations", icon: MapPin },
      { key: "review-analytics", label: "Thống Kê Lượt Chạm & Đánh Giá", to: "/platform/review?tab=analytics", icon: Activity },
    ],
  },
];

const superAdminSystemSuite: Item[] = [
  {
    key: "nav.vioneStaffAccounts" as TKey,
    icon: UserPlus,
    to: "/platform/admins",
    label: "Cấp Tài Khoản Quản Trị ViOne",
    badge: "ViOne",
  },
  {
    key: "nav.platform" as TKey,
    icon: ShieldCheck,
    to: "/platform/permissions",
    label: "Phân Quyền Ma Trận (RBAC)",
    badge: "RBAC",
  },
  {
    key: "nav.vioneAudit" as TKey,
    icon: History,
    to: "/activity",
    label: "Nhật Ký Kiểm Toán Toàn Hệ Thống",
  },
  {
    key: "nav.vioneSettings" as TKey,
    icon: Settings,
    to: "/settings",
    label: "Cài Đặt & Cấu Hình Nền Tảng",
  },
];

// ── PHÂN HỆ DOANH NGHIỆP (COMPANY / BUSINESS SUITE) ───────────────
// Dành cho tài khoản doanh nghiệp đã mua gói ViOne Platform
// Tuyệt đối không có quản lý doanh nghiệp (/companies) và không gộp chung
const companyOverview: Item[] = [
  {
    key: "nav.dashboard",
    icon: LayoutDashboard,
    to: "/",
    label: "Bảng Điều Khiển Doanh Nghiệp",
  },
  {
    key: "nav.vioneAi" as TKey,
    icon: Sparkles,
    to: "/ai",
    label: "Trợ Lý Trí Tuệ Nhân Tạo AI",
    badge: "AI",
  },
];

// NHÓM 1: NHÂN SỰ & CHẤM CÔNG
const companyHrSuite: Item[] = [
  {
    key: "nav.vioneMemberList" as TKey,
    icon: Users,
    to: "/members",
    label: "Quản Lý Nhân Sự & Đội Ngũ",
  },
  {
    key: "nav.vioneAttendance" as TKey,
    icon: UserCheck,
    to: "/attendance",
    label: "Chấm Công & Ca Làm Việc",
  },
];

// NHÓM 2: VẬN HÀNH & GIAO VIỆC (ĐƠN GIẢN HÓA, KHÔNG LIÊN QUAN ĐẾN TIỀN)
const companyOperationsSuite: Item[] = [
  {
    key: "nav.vioneWorkflow" as TKey,
    icon: Kanban,
    to: "/workflow",
    label: "Giao Việc & Quản Lý Công Việc",
    badge: "Giao việc",
  },
  {
    key: "nav.vioneMeetings" as TKey,
    icon: Calendar,
    to: "/meetings",
    label: "Lịch Trình & Cuộc Họp",
  },
];

// NHÓM 3: TÀI CHÍNH & DÒNG TIỀN
const companyFinanceSuite: Item[] = [
  {
    key: "nav.vioneIncome" as TKey,
    icon: ArrowDownCircle,
    to: "/income",
    label: "Quản Lý Thu Tiền",
  },
  {
    key: "nav.vioneExpenses" as TKey,
    icon: ArrowUpCircle,
    to: "/expenses",
    label: "Quản Lý Chi Phí",
  },
  {
    key: "nav.vioneFees" as TKey,
    icon: Wallet,
    to: "/fees",
    label: "Hóa Đơn & Định Mức",
  },
];

// NHÓM 4: KINH DOANH & KHÁCH HÀNG (CRM)
const companyCrmSuite: Item[] = [
  {
    key: "nav.vioneCrmCustomers" as TKey,
    icon: HeartHandshake,
    to: "/members",
    label: "Khách Hàng & Đối Tác CRM",
    badge: "CRM",
  },
  {
    key: "nav.vioneDeals" as TKey,
    icon: Handshake,
    to: "/opportunities",
    label: "Cơ Hội Kinh Doanh (Deals)",
  },
  {
    key: "nav.vioneMarketplace" as TKey,
    icon: Store,
    to: "/marketplace",
    label: "Sàn Giao Thương B2B",
  },
  {
    key: "nav.vioneNfc" as TKey,
    icon: IdCard,
    to: "/admin/business-cards",
    label: "Danh Thiếp Số NFC & QR",
  },
];

// NHÓM 5: TRUYỀN THÔNG & TƯƠNG TÁC
const companyMediaSuite: Item[] = [
  {
    key: "nav.vioneMoments" as TKey,
    icon: Newspaper,
    to: "/news",
    label: "Đăng Tin & Khoảnh Khắc 24h",
  },
  {
    key: "nav.vioneVoting" as TKey,
    icon: Vote,
    to: "/voting",
    label: "Biểu Quyết & Khảo Sát",
  },
  {
    key: "nav.vioneMessages" as TKey,
    icon: MessageSquare,
    to: "/messages",
    label: "Nhắn Tin & Trao Đổi",
    badge: "Chat",
  },
];

// NHÓM 6: CẤU HÌNH & TỔ CHỨC
const companySettingsSuite: Item[] = [
  {
    key: "nav.vioneSettings" as TKey,
    icon: Settings,
    to: "/settings",
    label: "Cài Đặt Hồ Sơ Doanh Nghiệp",
  },
];

const COLLAPSE_KEY = "vba.sidebar.collapsed";

function isActive(pathname: string | undefined, to?: string) {
  if (!to || !pathname) return false;
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

function NavItem({
  item,
  pathname,
  collapsed,
  onNavigate,
  badge,
}: {
  item: Item;
  pathname: string | undefined;
  collapsed: boolean;
  onNavigate?: () => void;
  badge?: string | number;
}) {
  const t = useT();
  const Icon = item.icon;
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const active = isActive(pathname, item.to);
  const hasActiveChild = Boolean(
    item.children?.some((c) => {
      if (!pathname) return false;
      const [cPath, cQuery] = c.to.split("?");
      if (cQuery && typeof window !== "undefined") {
        const currentSearch = window.location.search.replace(/^\?/, "");
        return pathname === cPath && currentSearch.includes(cQuery);
      }
      return pathname === cPath;
    })
  );

  const [expanded, setExpanded] = useState<boolean>(() => Boolean(active || hasActiveChild));

  useEffect(() => {
    if (active || hasActiveChild) {
      setExpanded(true);
    }
  }, [active, hasActiveChild, pathname]);

  const label = item.label || t(item.key);
  const badgeVal = item.badge ?? badge;
  const showBadge = badgeVal !== undefined && badgeVal !== null && badgeVal !== "";

  const cls = `group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 outline outline-1 outline-offset-[-1px] cursor-pointer ${
    collapsed ? "justify-center px-2 py-2.5" : ""
  } ${
    active && !hasChildren
      ? "bg-blue-600 text-white font-bold outline-blue-500 shadow-md shadow-blue-600/30"
      : (active || hasActiveChild)
      ? "bg-slate-900/90 text-white font-semibold outline-slate-700/60"
      : "bg-transparent outline-transparent text-slate-300 hover:text-white hover:bg-slate-900 font-medium"
  }`;

  const renderBadge = () => {
    if (!showBadge) return null;
    if (collapsed) {
      return (
        <span
          className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${
            badgeVal === "New" ? "bg-amber-500" : "bg-blue-600"
          }`}
        />
      );
    }
    if (badgeVal === "New") {
      return (
        <div className="px-2 py-0.5 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold font-['Inter'] leading-none">New</span>
        </div>
      );
    }
    return (
      <div className="px-2 py-0.5 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold font-['Inter'] leading-none">{badgeVal}</span>
      </div>
    );
  };

  const handleRowClick = () => {
    if (hasChildren && !collapsed) {
      setExpanded((prev) => !prev);
    }
    if (onNavigate) onNavigate();
  };

  const inner = (
    <div className="flex items-center gap-3 w-full">
      <div className="size-4 shrink-0 flex items-center justify-center">
        <Icon
          className={`size-4 transition-colors ${
            active || hasActiveChild ? "text-[#DFB76C]" : "text-slate-400 group-hover:text-white"
          }`}
          strokeWidth={active || hasActiveChild ? 2.2 : 1.9}
        />
      </div>
      {!collapsed && (
        <span
          className={`flex-1 truncate text-left font-['Inter'] text-[13.5px] ${
            active || hasActiveChild ? "text-white font-bold" : "text-slate-200 group-hover:text-white"
          }`}
        >
          {label}
        </span>
      )}
      {!collapsed && (
        <div className="flex items-center gap-1.5 shrink-0">
          {renderBadge()}
          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                expanded ? "rotate-180 text-[#DFB76C]" : "rotate-0"
              }`}
            />
          )}
        </div>
      )}
    </div>
  );

  const interactive = (item.to && !hasChildren) ? (
    <Link
      to={item.to}
      data-active={active ? "true" : undefined}
      className={cls}
      onClick={onNavigate}
      title={label}
    >
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      data-active={(active || hasActiveChild) ? "true" : undefined}
      className={cls}
      onClick={handleRowClick}
      title={label}
    >
      {inner}
    </button>
  );

  return (
    <div className="space-y-0.5">
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>{interactive}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="z-50 max-w-xs rounded-xl border border-[#D8B282]/40 bg-[#0B0F17] px-3 py-2 text-xs font-semibold text-[#F6E1C3] shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span>{label}</span>
            {showBadge && (
              <span className="rounded bg-[#C29B69]/30 px-1.5 py-0.5 text-[10px] text-[#F6E1C3]">
                {badgeVal}
              </span>
            )}
          </div>
          {hasChildren && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 space-y-1">
              {item.children!.map((c) => (
                <div key={c.key} className="text-[11px] text-slate-300">
                  • {c.label}
                </div>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>

      {/* Expandable sub-items tree */}
      {hasChildren && !collapsed && expanded && (
        <div className="ml-5 pl-3 border-l border-[#DFB76C]/30 my-1 space-y-1 py-0.5 animate-in fade-in duration-200">
          {item.children!.map((child) => {
            const [cPath, cQuery] = child.to.split("?");
            const isCurrentSearch = typeof window !== "undefined" && cQuery
              ? window.location.search.includes(cQuery)
              : false;
            const isChildActive = (pathname === cPath && (cQuery ? isCurrentSearch : true));
            const ChildIcon = child.icon || Icon;

            return (
              <Link
                key={child.key}
                to={child.to}
                onClick={onNavigate}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  isChildActive
                    ? "bg-[#DFB76C]/20 text-[#F6E1C3] font-bold border border-[#DFB76C]/40 shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 font-medium"
                }`}
              >
                <ChildIcon className={`size-3.5 shrink-0 ${isChildActive ? "text-[#DFB76C]" : "text-slate-500"}`} />
                <span className="truncate flex-1 text-[12px]">{child.label}</span>
                {child.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {child.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Group({
  label,
  items,
  pathname,
  collapsed,
  onNavigate,
  badges,
}: {
  label?: string;
  items: Item[];
  pathname: string | undefined;
  collapsed: boolean;
  onNavigate?: () => void;
  badges?: Record<string, number>;
}) {
  const t = useT();
  const displayLabel = label ? (label.startsWith("nav.") ? t(label as TKey) : label) : undefined;
  return (
    <div className={collapsed ? "px-2" : "px-3"}>
      {displayLabel &&
        (collapsed ? (
          <div className="mx-2 mb-2 mt-2 h-px bg-slate-800" />
        ) : (
          <div className="mb-2 mt-4 px-3 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 select-none">
              {displayLabel}
            </span>
          </div>
        ))}
      <div className="space-y-1">
        {items.map((it) => (
          <NavItem
            key={it.key}
            item={it}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
            badge={it.to ? badges?.[it.to] : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function Sidebar({
  mobile = false,
  onNavigate,
}: { mobile?: boolean; onNavigate?: () => void } = {}) {
  const t = useT();
  const {
    isPlatformAdmin,
    isQuanTri,
    isAdmin,
    roles,
    isSuperAdmin: isRbacSuperAdmin,
    isFinanceStaff,
    isOperationsStaff,
    isExecutiveStaff,
  } = useRole();

  const isSuperAdmin = Boolean(isQuanTri || isPlatformAdmin || isRbacSuperAdmin);
  const isViOneStaff = Boolean(isSuperAdmin || isFinanceStaff || isOperationsStaff || isExecutiveStaff);

  const [workspaceView, setWorkspaceView] = useState<"platform" | "company">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vione_crm_workspace_view");
      if (saved === "platform" || saved === "company") return saved;
    }
    return isPlatformAdmin || isQuanTri || isRbacSuperAdmin || isViOneStaff ? "platform" : "company";
  });
  const effectiveView = (isSuperAdmin || isViOneStaff) ? workspaceView : "company";

  const isTongThuKy = roles.some((r) => String(r) === "tong_thu_ky");
  const isBanThanhVien = roles.some((r) => String(r) === "truong_ban_thanh_vien");
  const isBanTaiChinh = roles.some((r) => String(r) === "truong_ban_tai_chinh");
  const isBanTruyenThong = roles.some((r) => String(r) === "truong_ban_truyen_thong");
  const isBanXucTien = roles.some((r) => String(r) === "truong_ban_xuc_tien");

  // Scoped permissions according to the permission matrix:
  const canViewMembers = isPlatformAdmin || isAdmin || isTongThuKy || isBanThanhVien;
  const canViewEvents = isPlatformAdmin || isAdmin || isTongThuKy || isBanTruyenThong || isBanXucTien;
  const canViewSponsors = isPlatformAdmin || isAdmin || isTongThuKy || isBanTaiChinh;
  const canViewFinance = isPlatformAdmin || isAdmin || isTongThuKy || isBanTaiChinh;
  const canViewComm = isPlatformAdmin || isAdmin || isTongThuKy || isBanTruyenThong;
  const canViewGovernance = isPlatformAdmin || isAdmin || isTongThuKy || isBanThanhVien;
  const canViewNetwork = isPlatformAdmin || isAdmin || isTongThuKy || isBanXucTien;
  const canViewBusinessConnect = isPlatformAdmin || isAdmin || isTongThuKy || isBanXucTien;
  const canViewSystem = isPlatformAdmin || isAdmin;

  const pathname = useRouterState({ select: (s) => s?.location?.pathname });

  const fetchMine = useServerFn(listMyAssociationsFn);
  const { data: myAssocs, reload } = useServerData<MyAssociation[]>(() => fetchMine(), []);
  const activeAssoc = myAssocs?.find((a) => a.isActive) ?? myAssocs?.[0];

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vione_custom_logo") || localStorage.getItem("vba_active_assoc_logo") || null;
    }
    return null;
  });

  const [customBrandName, setCustomBrandName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vba_active_assoc_name") || null;
    }
    return null;
  });

  const brandName = customBrandName || activeAssoc?.name || t("brand.name");
  const displayLogo = customLogo || (activeAssoc?.logoUrl ? (resolveMediaUrl(activeAssoc.logoUrl) || activeAssoc.logoUrl) : null);

  const unreadNotify = useUnreadNotifications();
  const badges: Record<string, number> = { "/notifications": unreadNotify };
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

  useEffect(() => {
    const onChange = (e: any) => {
      reload();
      if (e?.detail?.logoUrl !== undefined) {
        setCustomLogo(e.detail.logoUrl);
      }
      if (e?.detail?.name) {
        setCustomBrandName(e.detail.name);
      }
    };
    window.addEventListener("association-changed", onChange);
    return () => window.removeEventListener("association-changed", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Collapse only applies to the desktop sidebar; the mobile drawer is always full.
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bottomExpanded, setBottomExpanded] = useState(false);

  useEffect(() => {
    if (mobile) return;
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, [mobile]);

  // Keep sidebar at top on dashboard home
  useEffect(() => {
    if (pathname === "/" && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [pathname]);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const isCollapsed = !mobile && collapsed;
  const visibility = mobile ? "flex" : "hidden lg:flex";
  const width = isCollapsed ? "w-[72px]" : "w-[260px]";

  return (
    <aside
      className={`${visibility} ${mobile ? "h-dvh" : "sticky top-0 h-dvh"} ${width} shrink-0 flex-col bg-slate-950 border-r border-slate-800/80 transition-[width] duration-[var(--motion-slow)] ease-out justify-between select-none text-white`}
    >
      {/* ── Top Header & Core Nav ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div
          className={`flex h-[76px] items-center gap-2.5 border-b border-slate-800/80 ${
            isCollapsed ? "justify-center px-2" : "px-6"
          }`}
        >
          {displayLogo ? (
            <img
              src={displayLogo}
              alt={brandName}
              className="w-9 h-9 rounded-xl object-contain bg-white p-1 border border-slate-700/60 shadow-md shrink-0"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-l from-[#C99E55] via-[#DFB76C] to-[#E8C98E] rounded-lg inline-flex flex-col justify-center items-center shrink-0 shadow-md">
              <span className="text-zinc-950 text-lg font-extrabold font-['Inter'] leading-none">V</span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-white text-xl font-extrabold font-['Inter'] tracking-tight truncate">
                {brandName === "Hiệp hội Doanh nghiệp Việt Nam" ? "ViOne" : brandName}
              </span>
              <span className="rounded bg-[#DFB76C]/20 text-[#DFB76C] text-[10px] font-bold px-1.5 py-0.5 border border-[#DFB76C]/30 shrink-0 font-mono">
                CRM
              </span>
            </div>
          )}
          {!mobile && !isCollapsed && (
            <button
              onClick={toggle}
              aria-label={t("nav.collapse")}
              title={t("nav.collapse")}
              className="ml-auto shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Workspace Switcher for Super Admin */}
        {isSuperAdmin && !isCollapsed && (
          <div className="px-3 pt-2.5 pb-1 border-b border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setWorkspaceView("platform");
                  localStorage.setItem("vione_crm_workspace_view", "platform");
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("vione_workspace_view_changed"));
                  }
                }}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  effectiveView === "platform"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Nền Tảng</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setWorkspaceView("company");
                  localStorage.setItem("vione_crm_workspace_view", "company");
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("vione_workspace_view_changed"));
                  }
                }}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  effectiveView === "company"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Doanh Nghiệp</span>
              </button>
            </div>
          </div>
        )}

        {isSuperAdmin && isCollapsed && (
          <div className="flex justify-center py-2 border-b border-slate-800/60">
            <button
              type="button"
              onClick={() => {
                const next = effectiveView === "platform" ? "company" : "platform";
                setWorkspaceView(next);
                localStorage.setItem("vione_crm_workspace_view", next);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("vione_workspace_view_changed"));
                }
              }}
              title={`Chuyển chế độ: ${effectiveView === "platform" ? "Quản trị Nền tảng" : "Doanh nghiệp"}`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white transition-all shadow-sm"
            >
              {effectiveView === "platform" ? <ShieldCheck className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Collapsed expand button */}
        {!mobile && isCollapsed && (
          <div className="flex justify-center pt-2">
            <button
              onClick={toggle}
              aria-label={t("nav.expand")}
              title={t("nav.expand")}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Nav Container with Scroll */}
        <TooltipProvider delayDuration={150}>
          <div
            ref={scrollRef}
            className="sidebar-scroll flex-1 space-y-4 overflow-y-auto py-5"
          >
            {effectiveView === "platform" ? (
              <>
                {/* ── SUPER ADMIN: TỔNG QUAN NỀN TẢNG ── */}
                <div className={isCollapsed ? "px-2" : "px-3"}>
                  <div className="space-y-1">
                    {superAdminOverview.map((it) => (
                      <NavItem
                        key={it.key}
                        item={it}
                        pathname={pathname}
                        collapsed={isCollapsed}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>

                {/* ── QUẢN LÝ DOANH NGHIỆP & HỘI VIÊN ── */}
                {(isSuperAdmin || isOperationsStaff || isExecutiveStaff) && (
                  <Group
                    label="QUẢN LÝ DOANH NGHIỆP & HỘI VIÊN"
                    items={superAdminTenantsSuite}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                    badges={badges}
                  />
                )}

                {/* ── GÓI CƯỚC & DOANH THU NỀN TẢNG ── */}
                {(isSuperAdmin || isFinanceStaff || isExecutiveStaff) && (
                  <Group
                    label="GÓI CƯỚC & DOANH THU"
                    items={superAdminPackagesSuite}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                    badges={badges}
                  />
                )}

                {/* ── ĐIỀU HÀNH & TÀI LIỆU VICONNECT ── */}
                <Group
                  label="ĐIỀU HÀNH & TÀI LIỆU"
                  items={superAdminOperationsSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* ── CỘNG ĐỒNG, THỂ THAO & SỰ KIỆN ── */}
                <Group
                  label="CỘNG ĐỒNG & THỂ THAO"
                  items={superAdminCommunitySportSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* ── VĂN HÓA & DI SẢN QUỐC GIA ── */}
                <Group
                  label="VĂN HÓA & DI SẢN"
                  items={superAdminCultureHeritageSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* ── QUẢN LÝ DOANH NGHIỆP & HỘI VIÊN ── */}
                {(isSuperAdmin || isOperationsStaff || isExecutiveStaff) && (
                  <Group
                    label="QUẢN LÝ DOANH NGHIỆP & HỘI VIÊN"
                    items={superAdminTenantsSuite}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                    badges={badges}
                  />
                )}

                {/* ── GÓI CƯỚC & DOANH THU NỀN TẢNG ── */}
                {(isSuperAdmin || isFinanceStaff || isExecutiveStaff) && (
                  <Group
                    label="GÓI CƯỚC & DOANH THU"
                    items={superAdminPackagesSuite}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                    badges={badges}
                  />
                )}

                {/* ── NHÓM THỐNG KÊ & BÁO CÁO TOÀN DIỆN ── */}
                <div className={isCollapsed ? "px-2" : "px-3"}>
                  <ReportsTreeMenu
                    collapsed={isCollapsed}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    view="platform"
                  />
                </div>

                {/* ── AN NINH & HỆ THỐNG NỀN TẢNG ── */}
                {(isSuperAdmin || isQuanTri) && (
                  <Group
                    label="AN NINH & HỆ THỐNG"
                    items={superAdminSystemSuite}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                    badges={badges}
                  />
                )}
              </>
            ) : (
              <>
                {/* ── DOANH NGHIỆP: TỔNG QUAN NỔI BẬT ── */}
                <div className={isCollapsed ? "px-2" : "px-3"}>
                  <div className="space-y-1">
                    {companyOverview.map((it) => (
                      <NavItem
                        key={it.key}
                        item={it}
                        pathname={pathname}
                        collapsed={isCollapsed}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>

                {/* NHÓM 1: NHÂN SỰ & CHẤM CÔNG */}
                <Group
                  label="NHÂN SỰ & CHẤM CÔNG"
                  items={companyHrSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* NHÓM 2: VẬN HÀNH & GIAO VIỆC (ĐƠN GIẢN HÓA, KHÔNG DÍNH TIỀN) */}
                <Group
                  label="VẬN HÀNH & GIAO VIỆC"
                  items={companyOperationsSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* NHÓM 3: KINH DOANH & KHÁCH HÀNG (CRM) */}
                <Group
                  label="KINH DOANH & CRM"
                  items={companyCrmSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* NHÓM 5: TRUYỀN THÔNG & TƯƠNG TÁC */}
                <Group
                  label="TRUYỀN THÔNG & TƯƠNG TÁC"
                  items={companyMediaSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />

                {/* ── BÁO CÁO & THỐNG KÊ DOANH NGHIỆP (KHÔNG CÓ TÀI CHÍNH) ── */}
                <div className={isCollapsed ? "px-2" : "px-3"}>
                  <ReportsTreeMenu
                    collapsed={isCollapsed}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    view="company"
                  />
                </div>

                {/* NHÓM 6: CẤU HÌNH & TỔ CHỨC */}
                <Group
                  label="CẤU HÌNH & TỔ CHỨC"
                  items={companySettingsSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* ── Profile Footer matching user's design ──────────────────────── */}
      <div className={`border-t border-slate-800/80 bg-slate-950 w-full shrink-0 ${isCollapsed ? "p-2" : "p-3"}`}>
        <ProfileMenu variant="sidebar" collapsed={isCollapsed} />
      </div>

      <SubscribePackageModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        onSubscribed={() => {
          setSubscribeModalOpen(false);
          window.location.reload();
        }}
      />
    </aside>
  );
}

/** Mini cycling icon button dùng khi sidebar thu gọn. */
function ThemeToggleIconBtn() {
  const { theme, toggle } = useTheme();
  const icons: Record<string, any> = { light: Sun, dark: Moon, contrast: Contrast };
  const Icon = icons[theme] || Sun;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Đổi giao diện"
      title="Đổi giao diện"
      className="flex h-9 w-9 items-center justify-center rounded-full text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
