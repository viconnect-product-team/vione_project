import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  PieChart,
  Activity,
  Layers,
  FileBarChart,
  ShieldCheck,
  RefreshCw,
  Download,
  Filter,
  Briefcase,
  UserCheck,
  Package,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useRole } from "@/hooks/use-role";

export const Route = createFileRoute("/statistics")({
  component: StatisticsHubPage,
});

type StatGroup = "operations" | "attendance" | "finance" | "crm" | "platform";

export function StatisticsHubPage() {
  const { isPlatformAdmin, isAdmin } = useRole();
  const isSuperAdmin = isPlatformAdmin || isAdmin;

  const [activeGroup, setActiveGroup] = useState<StatGroup>("operations");
  const [loading, setLoading] = useState(true);

  // States for each group
  const [overview, setOverview] = useState<any>(null);
  const [opsData, setOpsData] = useState<any>(null);
  const [hrData, setHrData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [crmData, setCrmData] = useState<any>(null);
  const [platformData, setPlatformData] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, ops, hr, fin, crm, plat] = await Promise.all([
        fetchNestApi<any>("/analytics/overview").catch(() => null),
        fetchNestApi<any>("/analytics/operations").catch(() => null),
        fetchNestApi<any>("/analytics/attendance").catch(() => null),
        fetchNestApi<any>("/analytics/finance").catch(() => null),
        fetchNestApi<any>("/analytics/crm").catch(() => null),
        isSuperAdmin ? fetchNestApi<any>("/analytics/platform").catch(() => null) : Promise.resolve(null),
      ]);

      if (ov?.ok) setOverview(ov.kpi);
      if (ops?.ok) setOpsData(ops);
      if (hr?.ok) setHrData(hr);
      if (fin?.ok) setFinanceData(fin);
      if (crm?.ok) setCrmData(crm);
      if (plat?.ok) setPlatformData(plat);
    } catch (err: any) {
      console.error("[Statistics] Error loading analytics:", err);
      toast.error("Không thể tải dữ liệu thống kê: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isSuperAdmin]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
              <FileBarChart className="w-4 h-4 text-[#DFB76C]" />
              <span>Hệ Thống Thống Kê & Báo Cáo Chuyên Sâu</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
              Trung Tâm Thống Kê Toàn Diện
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Phân tích đa chiều dữ liệu vận hành, nhân sự, tài chính, giao thương và thuê bao từ CSDL thời gian thực.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
            <button
              onClick={() => toast.success("Đang xuất báo cáo tổng hợp ra định dạng Excel/PDF...")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-xs shadow hover:opacity-95 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo</span>
            </button>
          </div>
        </div>

        {/* Executive High-Level KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tiến độ công việc</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-1.5">
              {overview?.taskCompletionRate ?? 0}%
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {overview?.completedTasks ?? 0} / {overview?.totalTasks ?? 0} việc hoàn thành
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Quy mô nhân sự</span>
              <Users className="w-4 h-4 text-[#DFB76C]" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-1.5">
              {overview?.totalEmployees ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Nhân viên thực tế đang hoạt động
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Dòng tiền thực thu</span>
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1.5 truncate">
              {formatVND(overview?.totalIncome ?? 0)}
            </div>
            <div className="text-[11px] text-emerald-500 mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Thu chi thực tế</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Hồ sơ khách hàng</span>
              <Briefcase className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-1.5">
              {overview?.totalCustomers ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Doanh nghiệp & Hội viên liên kết
            </div>
          </div>
        </div>

        {/* 5 Main Statistics Group Tabs */}
        <div className="flex items-center gap-2 border-b border-border/80 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveGroup("operations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeGroup === "operations"
                ? "bg-[#DFB76C]/15 border border-[#DFB76C] text-[#DFB76C]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Vận Hành & Tiến Độ Công Việc</span>
          </button>

          <button
            onClick={() => setActiveGroup("attendance")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeGroup === "attendance"
                ? "bg-[#DFB76C]/15 border border-[#DFB76C] text-[#DFB76C]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Nhân Sự & Điểm Danh</span>
          </button>

          <button
            onClick={() => setActiveGroup("finance")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeGroup === "finance"
                ? "bg-[#DFB76C]/15 border border-[#DFB76C] text-[#DFB76C]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Tài Chính & Thu Chi</span>
          </button>

          <button
            onClick={() => setActiveGroup("crm")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeGroup === "crm"
                ? "bg-[#DFB76C]/15 border border-[#DFB76C] text-[#DFB76C]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Khách Hàng & Giao Thương CRM</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveGroup("platform")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeGroup === "platform"
                  ? "bg-[#DFB76C]/15 border border-[#DFB76C] text-[#DFB76C]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>5. Nền Tảng & Thuê Bao (Super Admin)</span>
            </button>
          )}
        </div>

        {/* Group 1: VẬN HÀNH & CÔNG VIỆC */}
        {activeGroup === "operations" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trạng thái công việc */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Phân bổ trạng thái công việc</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Tổng: {opsData?.summary?.totalTasks || 0}
                  </span>
                </h3>
                <div className="space-y-3">
                  {(opsData?.statusBreakdown || []).map((s: any) => {
                    const total = opsData?.summary?.totalTasks || 1;
                    const pct = Math.round((s.count / total) * 100);
                    const labels: Record<string, string> = {
                      assigned: "Chờ thực hiện",
                      in_progress: "Đang tiến hành",
                      completed: "Đã hoàn thành",
                      cancelled: "Đã hủy",
                    };
                    const colors: Record<string, string> = {
                      assigned: "bg-blue-500",
                      in_progress: "bg-amber-500",
                      completed: "bg-emerald-500",
                      cancelled: "bg-rose-500",
                    };
                    return (
                      <div key={s.status} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{labels[s.status] || s.status}</span>
                          <span className="font-semibold text-foreground">
                            {s.count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${colors[s.status] || "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {(!opsData?.statusBreakdown || opsData.statusBreakdown.length === 0) && (
                    <div className="p-4 text-center text-xs text-muted-foreground">Chưa có công việc nào</div>
                  )}
                </div>
              </div>

              {/* Mức độ ưu tiên */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                <h3 className="text-sm font-bold text-foreground">Mức độ ưu tiên nhiệm vụ</h3>
                <div className="space-y-3">
                  {(opsData?.priorityBreakdown || []).map((p: any) => {
                    const total = opsData?.summary?.totalTasks || 1;
                    const pct = Math.round((p.count / total) * 100);
                    const prioLabels: Record<string, string> = {
                      urgent: "Khẩn cấp",
                      high: "Ưu tiên cao",
                      normal: "Bình thường",
                      low: "Thấp",
                    };
                    return (
                      <div key={p.priority} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{prioLabels[p.priority] || p.priority}</span>
                          <span className="font-semibold text-foreground">{p.count}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#DFB76C] to-[#8C653B]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nhân sự phụ trách hàng đầu */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                <h3 className="text-sm font-bold text-foreground">Top nhân sự hoàn thành xuất sắc</h3>
                <div className="space-y-3 divide-y divide-border/40">
                  {(opsData?.topAssignees || []).map((emp: any, idx: number) => (
                    <div key={emp.name} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-foreground">{emp.name}</span>
                      </div>
                      <div className="text-muted-foreground">
                        <strong className="text-emerald-500">{emp.completedTasks}</strong> / {emp.totalTasks} việc
                      </div>
                    </div>
                  ))}
                  {(!opsData?.topAssignees || opsData.topAssignees.length === 0) && (
                    <div className="p-4 text-center text-xs text-muted-foreground">Chưa có dữ liệu</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group 2: NHÂN SỰ & ĐIỂM DANH */}
        {activeGroup === "attendance" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phân bổ theo phòng ban */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                <h3 className="text-sm font-bold text-foreground">
                  Phân bổ nhân sự theo phòng ban
                </h3>
                <div className="space-y-3">
                  {(hrData?.departmentBreakdown || []).map((d: any) => {
                    const total = hrData?.totalEmployees || 1;
                    const pct = Math.round((d.count / total) * 100);
                    return (
                      <div key={d.department} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{d.department}</span>
                          <span className="font-semibold text-foreground">
                            {d.count} người ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-[#DFB76C]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lịch sử điểm danh gần đây */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                <h3 className="text-sm font-bold text-foreground">
                  Lịch sử điểm danh thời gian thực
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto divide-y divide-border/40">
                  {(hrData?.recentCheckins || []).map((c: any) => (
                    <div key={c.id} className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-foreground">{c.eventTitle || "Chấm công văn phòng"}</div>
                        <div className="text-[10px] text-muted-foreground">Mã: {c.memberCode} • Phương thức: {c.method}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold text-[10px]">
                          {c.status}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {c.checkedAt ? new Date(c.checkedAt).toLocaleTimeString("vi-VN") : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!hrData?.recentCheckins || hrData.recentCheckins.length === 0) && (
                    <div className="p-4 text-center text-xs text-muted-foreground">Chưa có dữ liệu điểm danh</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group 3: TÀI CHÍNH & DÒNG TIỀN */}
        {activeGroup === "finance" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Tổng Thu (Inflow)</div>
                <div className="text-2xl font-bold text-emerald-500 mt-1">
                  {formatVND(financeData?.summary?.totalIncome || 0)}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Tổng Chi (Outflow)</div>
                <div className="text-2xl font-bold text-rose-500 mt-1">
                  {formatVND(financeData?.summary?.totalExpense || 0)}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Dòng tiền thuần (Net Cashflow)</div>
                <div className="text-2xl font-bold text-[#DFB76C] mt-1">
                  {formatVND(financeData?.summary?.netCashflow || 0)}
                </div>
              </div>
            </div>

            {/* Bảng giao dịch gần đây */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-bold text-foreground">Giao dịch thu chi gần đây</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2 font-medium">Nội dung giao dịch</th>
                      <th className="pb-2 font-medium">Phân loại</th>
                      <th className="pb-2 font-medium">Ngày</th>
                      <th className="pb-2 font-medium text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {(financeData?.recentTransactions || []).map((t: any) => (
                      <tr key={t.id} className="hover:bg-muted/20">
                        <td className="py-2.5 font-medium text-foreground">{t.description}</td>
                        <td className="py-2.5 text-muted-foreground">{t.category || t.type}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {t.date ? new Date(t.date).toLocaleDateString("vi-VN") : ""}
                        </td>
                        <td className={`py-2.5 text-right font-bold ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                          {t.type === "income" ? "+" : "-"}{formatVND(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Group 4: CRM & GIAO THƯƠNG */}
        {activeGroup === "crm" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-sm font-bold text-foreground">Phân loại khách hàng theo ngành nghề</h3>
                <div className="space-y-3">
                  {(crmData?.industryStats || []).map((ind: any) => (
                    <div key={ind.industry} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{ind.industry}</span>
                      <span className="font-semibold text-foreground">{ind.count} doanh nghiệp</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-sm font-bold text-foreground">Cơ hội kinh doanh B2B Pipeline</h3>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/80 space-y-2">
                  <div className="text-xs text-muted-foreground">Tổng giá trị cơ hội đang mở</div>
                  <div className="text-2xl font-bold text-[#DFB76C]">
                    {formatVND(crmData?.opportunities?.pipelineValue || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tổng số: <strong className="text-foreground">{crmData?.opportunities?.total || 0}</strong> cơ hội kết nối
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group 5: NỀN TẢNG (SUPER ADMIN ONLY) */}
        {activeGroup === "platform" && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Tổng Doanh Nghiệp (Tenants)</div>
                <div className="text-2xl font-bold text-foreground mt-1">
                  {platformData?.totalCompanies || 0}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Slots Cấp Phép Toàn Hệ Thống</div>
                <div className="text-2xl font-bold text-[#DFB76C] mt-1">
                  {platformData?.totalEmployeesSystem || 0} / {platformData?.totalSlotsAllocated || 0}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Tỷ lệ lấp đầy: {platformData?.systemUtilizationPercent || 0}%
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">Số gói dịch vụ đang phát hành</div>
                <div className="text-2xl font-bold text-primary mt-1">
                  {platformData?.packages?.length || 0}
                </div>
              </div>
            </div>

            {/* Danh mục gói cước */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Danh mục gói dịch vụ ViOne Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(platformData?.packages || []).map((pkg: any) => (
                  <div key={pkg.id} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <div className="font-bold text-foreground text-sm">{pkg.name}</div>
                    <div className="text-lg font-bold text-[#DFB76C]">{formatVND(Number(pkg.price))} / năm</div>
                    <div className="text-xs text-muted-foreground">
                      Hạn mức: <strong className="text-foreground">{pkg.maxSlots} slots tài khoản</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
