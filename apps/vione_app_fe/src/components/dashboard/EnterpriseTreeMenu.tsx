import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  ClipboardList,
  Sparkles,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { fetchNestApi } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  employeeCount: number;
  taskCount: number;
}

interface EnterpriseTreeMenuProps {
  collapsed: boolean;
  pathname?: string;
  onNavigate?: () => void;
  onOpenSubscribeModal?: () => void;
  onRequestSubscribe?: () => void;
}

export function EnterpriseTreeMenu({
  collapsed,
  pathname,
  onNavigate,
  onOpenSubscribeModal,
  onRequestSubscribe,
}: EnterpriseTreeMenuProps) {
  const { user } = useAuth();
  const isViconnectAdmin = Boolean(
    !user ||
    user?.email?.toLowerCase() === "admin@connect.vn" ||
    user?.email?.toLowerCase().endsWith("@connect.vn") ||
    user?.email?.toLowerCase().endsWith("@viconnect.vn") ||
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "platform_admin"
  );

  const handleOpenSubscribe = onOpenSubscribeModal || onRequestSubscribe || (() => {});
  const [hasSubscription, setHasSubscription] = useState<boolean>(true);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [treeOpen, setTreeOpen] = useState<boolean>(true);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchNestApi<any>("/companies");
      if (res) {
        setHasSubscription(Boolean(res.hasSubscription) || isViconnectAdmin);
        if (Array.isArray(res.items)) {
          setCompanies(res.items);
          // Mặc định mở nhánh của doanh nghiệp đầu tiên
          if (res.items.length > 0) {
            setExpandedCompanies((prev) => {
              const next = { ...prev };
              res.items.forEach((c: CompanyItem, idx: number) => {
                if (next[c.id] === undefined) {
                  next[c.id] = idx === 0;
                }
              });
              return next;
            });
          }
        }
      }
    } catch (err) {
      console.error("[EnterpriseTreeMenu] Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleRefresh = () => loadData();
    window.addEventListener("subscription-changed", handleRefresh);
    window.addEventListener("companies-changed", handleRefresh);
    return () => {
      window.removeEventListener("subscription-changed", handleRefresh);
      window.removeEventListener("companies-changed", handleRefresh);
    };
  }, []);

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Helper check active route
  const isEmployeeActive = (companyId: string) => {
    if (!pathname) return false;
    return pathname.includes(companyId) && (typeof window !== "undefined" && window.location.search.includes("tab=employees"));
  };

  const isTaskActive = (companyId: string) => {
    if (!pathname) return false;
    return pathname.includes(companyId) && (typeof window !== "undefined" && window.location.search.includes("tab=tasks"));
  };

  const isCompanyActive = (companyId: string) => {
    if (!pathname) return false;
    return pathname === `/companies/${companyId}` && !isEmployeeActive(companyId) && !isTaskActive(companyId);
  };

  if (collapsed) {
    return (
      <div className="px-2">
        <Link
          to="/companies"
          onClick={onNavigate}
          title={companies.length > 0 ? `Doanh nghiệp (${companies.length})` : "Hệ thống Doanh nghiệp"}
          className={`group relative flex w-full items-center justify-center rounded-xl p-2.5 text-sm transition-all outline outline-1 outline-offset-[-1px] cursor-pointer ${
            pathname?.startsWith("/companies")
              ? "bg-amber-500 text-slate-950 font-bold outline-amber-400 shadow-md shadow-amber-500/20"
              : "bg-transparent outline-transparent text-slate-300 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Building2 className="size-4 shrink-0 text-amber-400 group-hover:text-amber-300" />
          {companies.length > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="px-3">
      {/* Header section */}
      <div className="mb-2 mt-4 px-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-400/90 select-none flex items-center gap-1.5">
          <Layers className="size-3 text-amber-400" />
          <span>DOANH NGHIỆP CỦA TÔI</span>
        </span>
        {companies.length > 0 && (
          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-500/30">
            {companies.length} DN
          </span>
        )}
      </div>

      {/* Root Node of the Tree Menu */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-1 space-y-1">
        <div
          onClick={() => setTreeOpen(!treeOpen)}
          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="size-4 text-amber-400 shrink-0" />
            <span className="truncate">Hệ Thống Doanh Nghiệp</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 border border-emerald-500/30 font-mono">
              Active
            </span>
            {treeOpen ? (
              <ChevronDown className="size-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="size-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Tree Content */}
        {treeOpen && (
          <div className="pt-1 pb-1 space-y-1 border-t border-slate-800/60 mt-1">
            {companies.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                <p className="mb-2 text-[11px]">Chưa có doanh nghiệp nào trong danh bạ.</p>
                <Link
                  to="/companies"
                  onClick={onNavigate}
                  className="text-amber-400 hover:underline text-[11px] font-bold"
                >
                  + Quản lý doanh nghiệp
                </Link>
              </div>
            ) : (
              /* HIỂN THỊ TREE MENU DOANH NGHIỆP */
              companies.map((company) => {
                const isExpanded = Boolean(expandedCompanies[company.id]);
                const empActive = isEmployeeActive(company.id);
                const taskActive = isTaskActive(company.id);
                const detailActive = isCompanyActive(company.id);

                return (
                  <div key={company.id} className="space-y-0.5">
                    {/* Branch Node: Tên Doanh Nghiệp */}
                    <div
                      onClick={() => toggleCompany(company.id)}
                      className="group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="size-3 text-slate-400 group-hover:text-amber-300 shrink-0" />
                        ) : (
                          <ChevronRight className="size-3 text-slate-400 group-hover:text-amber-300 shrink-0" />
                        )}
                        <Building2 className="size-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-[12px] truncate text-slate-200 group-hover:text-amber-200">
                          {company.name}
                        </span>
                      </div>
                    </div>

                    {/* Sub-items of this Enterprise: Quản lý nhân viên & Giao việc */}
                    {isExpanded && (
                      <div className="ml-4 pl-2 border-l border-slate-700/60 space-y-0.5 py-0.5">
                        {/* 1. Quản lý nhân viên */}
                        <Link
                          to="/companies/$companyId"
                          params={{ companyId: company.id }}
                          search={{ tab: "employees" }}
                          onClick={onNavigate}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11.5px] transition-colors cursor-pointer ${
                            empActive
                              ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Users className={`size-3.5 ${empActive ? "text-amber-300" : "text-slate-400"}`} />
                            <span>Quản lý nhân viên</span>
                          </div>
                          {company.employeeCount > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                              {company.employeeCount}
                            </span>
                          )}
                        </Link>

                        {/* 2. Giao việc */}
                        <Link
                          to="/companies/$companyId"
                          params={{ companyId: company.id }}
                          search={{ tab: "tasks" }}
                          onClick={onNavigate}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11.5px] transition-colors cursor-pointer ${
                            taskActive
                              ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ClipboardList className={`size-3.5 ${taskActive ? "text-amber-300" : "text-slate-400"}`} />
                            <span>Giao việc</span>
                          </div>
                          {company.taskCount > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                              {company.taskCount}
                            </span>
                          )}
                        </Link>

                        {/* 3. Hồ sơ doanh nghiệp */}
                        <Link
                          to="/companies/$companyId"
                          params={{ companyId: company.id }}
                          search={{ tab: "overview" }}
                          onClick={onNavigate}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                            detailActive
                              ? "bg-slate-800 text-amber-300 font-semibold"
                              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                          }`}
                        >
                          <span>Hồ sơ & Giới thiệu</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Bottom link: Toàn bộ danh sách doanh nghiệp */}
            <div className="pt-1 mt-1 border-t border-slate-800/60 flex items-center justify-between px-2">
              <Link
                to="/companies"
                onClick={onNavigate}
                className="text-[11px] font-medium text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>Xem tất cả danh bạ</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
