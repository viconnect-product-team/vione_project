import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileBarChart,
  Wallet,
  Kanban,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Activity,
  UserCheck,
  ClipboardList,
  Users,
  History,
  Layers,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRole } from "@/hooks/use-role";

interface ReportSubItem {
  id: string;
  label: string;
  to: string;
  search?: Record<string, string>;
  icon: LucideIcon;
  badge?: string;
}

interface ReportCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  requireAdmin?: boolean;
  children: ReportSubItem[];
}

interface ReportsTreeMenuProps {
  collapsed?: boolean;
  pathname?: string;
  onNavigate?: () => void;
  view?: "platform" | "company";
}

export function ReportsTreeMenu({
  collapsed = false,
  pathname = "",
  onNavigate,
  view = "platform",
}: ReportsTreeMenuProps) {
  const { isPlatformAdmin, isAdmin, isSuperAdmin: checkSuperAdmin } = useRole();
  const isSuperAdmin = Boolean(isPlatformAdmin || isAdmin || checkSuperAdmin);

  const rawReportCategories: ReportCategory[] = [
    {
      id: "finance_reports",
      label: "Báo Cáo Tài Chính & Doanh Thu",
      icon: Wallet,
      badge: "Tài chính",
      children: [
        {
          id: "fin_kpi",
          label: "Thống Kê Doanh Thu & Dòng Tiền",
          to: "/statistics",
          search: { group: "finance" },
          icon: TrendingUp,
        },
        {
          id: "fin_platform_or_fees",
          label: isSuperAdmin ? "Doanh Thu Toàn Nền Tảng" : "Sổ Quỹ & Doanh Thu Doanh Nghiệp",
          to: isSuperAdmin ? "/finance-report" : "/fees",
          icon: CreditCard,
        },
      ],
    },
    {
      id: "operations_reports",
      label: "Thống Kê Vận Hành & Nhân Sự",
      icon: Kanban,
      badge: "Vận hành",
      children: [
        {
          id: "ops_kanban",
          label: "Tiến Độ & Hiệu Suất Kanban BPMN",
          to: "/statistics",
          search: { group: "operations" },
          icon: Activity,
        },
        {
          id: "ops_attendance",
          label: "Báo Cáo Chấm Công & Ca Làm",
          to: "/statistics",
          search: { group: "attendance" },
          icon: UserCheck,
        },
        {
          id: "ops_tasks",
          label: "Báo Cáo Phân Công Giao Việc",
          to: "/workflow",
          icon: ClipboardList,
        },
      ],
    },
    {
      id: "crm_reports",
      label: "Báo Cáo Khách Hàng CRM",
      icon: HeartHandshake,
      badge: "CRM",
      children: [
        {
          id: "crm_funnel",
          label: "Phân Tích Phễu Khách Hàng CRM",
          to: "/statistics",
          search: { group: "crm" },
          icon: BarChart3,
        },
        {
          id: "crm_engagement",
          label: "Báo Cáo Chăm Sóc & Tương Tác",
          to: "/members",
          icon: Users,
        },
      ],
    },
    {
      id: "platform_reports",
      label: "Giám Sát Nền Tảng ViOne",
      icon: ShieldCheck,
      badge: "Admin",
      requireAdmin: true,
      children: [
        {
          id: "plat_kpi",
          label: "Chỉ Số Tăng Trưởng Nền Tảng",
          to: "/statistics",
          search: { group: "platform" },
          icon: Layers,
        },
        {
          id: "plat_health",
          label: "Theo Dõi Mức Độ Hoạt Động DN",
          to: "/platform",
          icon: Activity,
        },
        {
          id: "plat_audit",
          label: "Nhật Ký Kiểm Toán Toàn Hệ Thống",
          to: "/activity",
          icon: History,
        },
      ],
    },
  ];

  // Lọc category theo role và phân hệ (doanh nghiệp không có tài chính/doanh thu)
  const availableCategories = rawReportCategories.filter((cat) => {
    if (view === "company" && cat.id === "finance_reports") return false;
    if (cat.requireAdmin && !isSuperAdmin) return false;
    return true;
  });

  // State mở rộng các node cha (Tree node expansion)
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    finance_reports: view !== "company",
    operations_reports: view === "company",
    crm_reports: false,
    platform_reports: false,
  });

  const isChildActive = (child: ReportSubItem) => {
    if (!pathname) return false;
    if (child.search?.group) {
      const activeGroup = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("group")
        : "";
      return pathname.startsWith(child.to) && activeGroup === child.search.group;
    }
    return pathname === child.to || pathname.startsWith(child.to + "/");
  };

  // Tự động mở node cha nếu URL hiện tại trỏ tới node con của nó
  useEffect(() => {
    availableCategories.forEach((cat) => {
      const hasActiveChild = cat.children.some((child) => isChildActive(child));
      if (hasActiveChild) {
        setExpandedKeys((prev) => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [pathname]);

  const toggleCategory = (catId: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Trạng thái thu gọn sidebar (collapsed)
  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-2 space-y-2">
        <Link
          to="/statistics"
          onClick={onNavigate}
          title="Trung Tâm Thống Kê & Báo Cáo"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors relative"
        >
          <FileBarChart className="w-5 h-5 text-[#D8B282]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D8B282]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Group Header Title */}
      <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#D8B282]">
          <FileBarChart className="w-3.5 h-3.5 text-[#D8B282]" />
          <span>THỐNG KÊ & BÁO CÁO</span>
        </div>
        <Link
          to="/statistics"
          onClick={onNavigate}
          className="text-[10px] text-slate-400 hover:text-[#F6E1C3] transition font-medium"
        >
          Hub tổng
        </Link>
      </div>

      {/* Tree Menu Categories */}
      <div className="space-y-1">
        {availableCategories.map((cat) => {
          const isExpanded = Boolean(expandedKeys[cat.id]);
          const Icon = cat.icon;
          const hasActiveChild = cat.children.some((c) => isChildActive(c));

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden transition-all">
              {/* Parent Node Button */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  hasActiveChild
                    ? "bg-[#D8B282]/10 text-[#F6E1C3] border border-[#D8B282]/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      hasActiveChild ? "text-[#D8B282]" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate text-left">{cat.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {cat.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-800 text-slate-400 uppercase">
                      {cat.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-90 text-[#D8B282]" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Children Nodes (Sub-functions Tree View) */}
              {isExpanded && (
                <div className="relative pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800/80 ml-5 my-0.5">
                  {cat.children.map((child) => {
                    const active = isChildActive(child);
                    const ChildIcon = child.icon;

                    return (
                      <Link
                        key={child.id}
                        to={child.to}
                        search={child.search as any}
                        onClick={onNavigate}
                        className={`group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150 cursor-pointer ${
                          active
                            ? "bg-[#D8B282]/20 text-[#F6E1C3] font-bold border border-[#D8B282]/40 shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                        }`}
                      >
                        {/* Tree Horizontal Branch Line */}
                        <span
                          className={`absolute -left-3.5 top-1/2 w-2.5 h-px ${
                            active ? "bg-[#D8B282]" : "bg-slate-800"
                          }`}
                        />

                        <ChildIcon
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            active ? "text-[#D8B282]" : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        />
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
