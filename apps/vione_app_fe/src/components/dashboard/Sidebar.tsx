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
} from "lucide-react";
import type { TKey } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { ProfileMenu } from "@/components/dashboard/ProfileMenu";
import { EnterpriseTreeMenu } from "@/components/dashboard/EnterpriseTreeMenu";
import { ReportsTreeMenu } from "@/components/dashboard/ReportsTreeMenu";
import { SubscribePackageModal } from "@/components/dashboard/SubscribePackageModal";

type Item = { key: TKey; icon: LucideIcon; to?: string; label?: string; badge?: string | number };

// ── PHÂN HỆ QUẢN TRỊ NỀN TẢNG (SUPER ADMIN / PLATFORM ADMIN) ─────────────
// Dành cho ban quản trị nền tảng ViOne điều hành và giám sát toàn hệ thống
const superAdminOverview: Item[] = [
  {
    key: "nav.platformOverview" as TKey,
    icon: LayoutDashboard,
    to: "/platform",
    label: "Tổng Quan & Tăng Trưởng",
    badge: "5.0",
  },
];

const superAdminTenantsSuite: Item[] = [
  {
    key: "nav.vioneCompanyList" as TKey,
    icon: Building2,
    to: "/companies",
    label: "Quản Lý Khách Hàng & DN",
  },
  {
    key: "nav.vionePlatformMonitoring" as TKey,
    icon: Activity,
    to: "/platform",
    label: "Theo Dõi Mức Độ Hoạt Động",
    badge: "Giám sát",
  },
  {
    key: "nav.vionePlatformMembers" as TKey,
    icon: Users,
    to: "/members",
    label: "Khách Hàng Nền Tảng (CRM)",
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
    key: "nav.vioneApprovals" as TKey,
    icon: CheckCircle2,
    to: "/payment-approvals",
    label: "Phê Duyệt Đơn Hàng & Gia Hạn",
  },
];

const vioneInternalChatSuite: Item[] = [
  {
    key: "nav.vioneMessages" as TKey,
    icon: MessageSquare,
    to: "/messages",
    label: "Kết Nối Nhắn Tin",
    badge: "Chat",
  },
];

const superAdminSystemSuite: Item[] = [
  {
    key: "nav.vioneStaffAccounts" as TKey,
    icon: UserPlus,
    to: "/platform/admins",
    label: "Cấp Tài Khoản Nhân Viên",
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
    label: "Nhật Ký Kiểm Toán",
  },
  {
    key: "nav.vioneSettings" as TKey,
    icon: Settings,
    to: "/settings",
    label: "Cài Đặt Nền Tảng",
  },
];

// ── PHÂN HỆ DOANH NGHIỆP (COMPANY / BUSINESS ADMIN SUITE) ───────────────
// Dành cho tài khoản mua gói ViOne Platform và được mở khóa CRM
const companyOverview: Item[] = [
  { key: "nav.dashboard", icon: LayoutDashboard, to: "/", label: "Bảng Điều Khiển Doanh Nghiệp" },
];

// NHÓM 1: QUY TRÌNH & VẬN HÀNH (Gói gọn toàn bộ vận hành doanh nghiệp vào 1 nhóm lớn theo BRD)
const companyWorkflowSuite: Item[] = [
  {
    key: "nav.vioneMemberList" as TKey,
    icon: Users,
    to: "/companies",
    label: "Quản Lý Thành Viên & Nhân Sự",
  },
  {
    key: "nav.vioneDocuments" as TKey,
    icon: FolderOpen,
    to: "/documents",
    label: "Quản Lý Tài Liệu Số Hóa",
  },
  {
    key: "nav.vioneWorkflow" as TKey,
    icon: Kanban,
    to: "/workflow",
    label: "Quy Trình & Công Việc",
    badge: "Kanban",
  },
  {
    key: "nav.vioneAttendance" as TKey,
    icon: UserCheck,
    to: "/attendance",
    label: "Chấm Công & Ca Làm Việc",
  },
  {
    key: "nav.vioneApprovals" as TKey,
    icon: ShieldCheck,
    to: "/payment-approvals",
    label: "Phê Duyệt Chi Tiền",
  },
];

// NHÓM 2: CHĂM SÓC KHÁCH HÀNG (CRM) & TRỢ LÝ AI
const companyCrmRevenueSuite: Item[] = [
  {
    key: "nav.vioneCrmCustomers" as TKey,
    icon: HeartHandshake,
    to: "/members",
    label: "Chăm Sóc Khách Hàng (CRM)",
    badge: "CRM",
  },
  {
    key: "nav.vioneAi" as TKey,
    icon: Sparkles,
    to: "/ai",
    label: "Trợ Lý Trí Tuệ Nhân Tạo AI",
    badge: "AI",
  },
];

// NHÓM 3: KẾT NỐI & TRUYỀN THÔNG (NETWORKING & PUBLIC PRESENCE)
const companyConnectMediaSuite: Item[] = [
  {
    key: "nav.vioneMoments" as TKey,
    icon: Newspaper,
    to: "/news",
    label: "Đăng Tin & Khoảnh Khắc",
  },
  {
    key: "nav.vioneIntroductions" as TKey,
    icon: Handshake,
    to: "/business-connect/connections",
    label: "Kết Nối Đối Tác B2B",
  },
  {
    key: "nav.vioneNfc" as TKey,
    icon: IdCard,
    to: "/admin/business-cards",
    label: "Thẻ Thông Minh NFC & QR",
  },
  {
    key: "nav.vioneMarketplace" as TKey,
    icon: Store,
    to: "/marketplace",
    label: "Sàn Sản Phẩm & Dịch Vụ",
  },
];

const companySettingsSuite: Item[] = [
  {
    key: "nav.vioneSettings" as TKey,
    icon: Settings,
    to: "/settings",
    label: "Hồ Sơ & Cài Đặt Doanh Nghiệp",
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
  const active = isActive(pathname, item.to);
  const label = item.label || t(item.key);
  const badgeVal = item.badge ?? badge;
  const showBadge = badgeVal !== undefined && badgeVal !== null && badgeVal !== "";

  const cls = `group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 outline outline-1 outline-offset-[-1px] cursor-pointer ${
    collapsed ? "justify-center px-2 py-2.5" : ""
  } ${
    active
      ? "bg-blue-600 text-white font-bold outline-blue-500 shadow-md shadow-blue-600/30"
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

  const inner = (
    <div className="flex items-center gap-3 w-full">
      <div className="size-4 shrink-0 flex items-center justify-center">
        <Icon
          className={`size-4 transition-colors ${
            active ? "text-white" : "text-slate-400 group-hover:text-white"
          }`}
          strokeWidth={active ? 2.2 : 1.9}
        />
      </div>
      {!collapsed && (
        <span
          className={`flex-1 truncate text-left font-['Inter'] text-[13.5px] ${
            active ? "text-white font-bold" : "text-slate-200 group-hover:text-white"
          }`}
        >
          {label}
        </span>
      )}
      {!collapsed && renderBadge()}
    </div>
  );

  if (item.to) {
    return (
      <Link
        to={item.to}
        data-active={active ? "true" : undefined}
        className={cls}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      data-active={active ? "true" : undefined}
      className={cls}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
    >
      {inner}
    </button>
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
        <div
          ref={scrollRef}
          className="sidebar-scroll flex-1 space-y-4 overflow-y-auto py-5"
        >
          {effectiveView === "platform" ? (
            <>
              {/* ── SUPER ADMIN: TỔNG QUAN & TĂNG TRƯỞNG ── */}
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

              {/* ── KẾT NỐI NHẮN TIN (CHỨC NĂNG TỐI THIỂU CHO MỌI NHÂN SỰ VIONE) ── */}
              <Group
                label="KẾT NỐI & LIÊN LẠC"
                items={vioneInternalChatSuite}
                pathname={pathname}
                collapsed={isCollapsed}
                onNavigate={onNavigate}
                badges={badges}
              />

              {/* ── NHÓM VẬN HÀNH & QUẢN LÝ KHÁCH HÀNG / DN (platform_operations) ── */}
              {(isSuperAdmin || isOperationsStaff || isExecutiveStaff) && (
                <Group
                  label="QUẢN TRỊ KHÁCH HÀNG & DN"
                  items={superAdminTenantsSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />
              )}

              {/* ── NHÓM TÀI CHÍNH, DOANH THU & GÓI (platform_finance) ── */}
              {(isSuperAdmin || isFinanceStaff || isExecutiveStaff) && (
                <Group
                  label="GÓI DỊCH VỤ NỀN TẢNG"
                  items={superAdminPackagesSuite}
                  pathname={pathname}
                  collapsed={isCollapsed}
                  onNavigate={onNavigate}
                  badges={badges}
                />
              )}

              {/* ── NHÓM THỐNG KÊ & BÁO CÁO (TREE MENU RIÊNG BIỆT) ── */}
              <div className={isCollapsed ? "px-2" : "px-3"}>
                <ReportsTreeMenu
                  collapsed={isCollapsed}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </div>

              {/* ── HỆ THỐNG & BẢO MẬT (Chỉ Super Admin & Ban Quản Trị) ── */}
              {(isSuperAdmin || isQuanTri) && (
                <Group
                  label="HỆ THỐNG & BẢO MẬT"
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
              {/* ── DOANH NGHIỆP: BẢNG ĐIỀU KHIỂN DOANH NGHIỆP ── */}
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

              {/* Doanh nghiệp & Quản trị Doanh nghiệp (Tree Menu Sidebar) */}
              <div className={isCollapsed ? "px-2" : "px-3"}>
                <EnterpriseTreeMenu
                  collapsed={isCollapsed}
                  pathname={pathname}
                  onNavigate={onNavigate}
                  onRequestSubscribe={() => setSubscribeModalOpen(true)}
                />
              </div>

              {/* Divider */}
              {!isCollapsed && (
                <div className="px-6 pt-2 pb-1">
                  <div className="h-px w-full bg-slate-800/80" />
                </div>
              )}

              {/* NHÓM 1: QUY TRÌNH & VẬN HÀNH (Gói gọn toàn bộ vận hành doanh nghiệp vào 1 nhóm lớn theo BRD) */}
              <Group
                label="QUY TRÌNH & VẬN HÀNH"
                items={companyWorkflowSuite}
                pathname={pathname}
                collapsed={isCollapsed}
                onNavigate={onNavigate}
                badges={badges}
              />

              {/* ── NHÓM THỐNG KÊ & BÁO CÁO DOANH NGHIỆP (TREE MENU RIÊNG BIỆT) ── */}
              <div className={isCollapsed ? "px-2" : "px-3"}>
                <ReportsTreeMenu
                  collapsed={isCollapsed}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </div>

              {/* NHÓM 2: CHĂM SÓC KHÁCH HÀNG (CRM) & AI */}
              <Group
                label="CHĂM SÓC KHÁCH HÀNG (CRM) & AI"
                items={companyCrmRevenueSuite}
                pathname={pathname}
                collapsed={isCollapsed}
                onNavigate={onNavigate}
                badges={badges}
              />

              {/* NHÓM 3: KẾT NỐI & TRUYỀN THÔNG */}
              <Group
                label="KẾT NỐI & TRUYỀN THÔNG"
                items={companyConnectMediaSuite}
                pathname={pathname}
                collapsed={isCollapsed}
                onNavigate={onNavigate}
                badges={badges}
              />

              {/* NHÓM 4: HỒ SƠ DOANH NGHIỆP */}
              <Group
                label="HỒ SƠ DOANH NGHIỆP"
                items={companySettingsSuite}
                pathname={pathname}
                collapsed={isCollapsed}
                onNavigate={onNavigate}
                badges={badges}
              />
            </>
          )}
        </div>
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
