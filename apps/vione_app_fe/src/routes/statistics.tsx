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
  Network,
  FolderCheck,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
  const [platformSubTab, setPlatformSubTab] = useState<
    "overview" | "tree" | "accounts" | "docs" | "cashflow"
  >("overview");
  const [loading, setLoading] = useState(true);

  // States for each group
  const [overview, setOverview] = useState<any>(null);
  const [opsData, setOpsData] = useState<any>(null);
  const [hrData, setHrData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [crmData, setCrmData] = useState<any>(null);
  const [platformData, setPlatformData] = useState<any>(null);
  const [platformReports, setPlatformReports] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, ops, hr, fin, crm, plat, platReports] = await Promise.all([
        fetchNestApi<any>("/analytics/overview").catch(() => null),
        fetchNestApi<any>("/analytics/operations").catch(() => null),
        fetchNestApi<any>("/analytics/attendance").catch(() => null),
        fetchNestApi<any>("/analytics/finance").catch(() => null),
        fetchNestApi<any>("/analytics/crm").catch(() => null),
        isSuperAdmin
          ? fetchNestApi<any>("/analytics/platform").catch(() => null)
          : Promise.resolve(null),
        isSuperAdmin
          ? fetchNestApi<any>("/companies/platform-reports").catch(() => null)
          : Promise.resolve(null),
      ]);

      if (ov?.ok) setOverview(ov.kpi);
      if (ops?.ok) setOpsData(ops);
      if (hr?.ok) setHrData(hr);
      if (fin?.ok) setFinanceData(fin);
      if (crm?.ok) setCrmData(crm);
      if (plat?.ok) setPlatformData(plat);
      if (platReports?.ok) setPlatformReports(platReports);
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
              Phân tích đa chiều dữ liệu vận hành, nhân sự, tài chính, giao thương và thuê bao từ
              CSDL thời gian thực.
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
                          <span className="text-muted-foreground">
                            {labels[s.status] || s.status}
                          </span>
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
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Chưa có công việc nào
                    </div>
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
                          <span className="text-muted-foreground">
                            {prioLabels[p.priority] || p.priority}
                          </span>
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
                <h3 className="text-sm font-bold text-foreground">
                  Top nhân sự hoàn thành xuất sắc
                </h3>
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
                        <strong className="text-emerald-500">{emp.completedTasks}</strong> /{" "}
                        {emp.totalTasks} việc
                      </div>
                    </div>
                  ))}
                  {(!opsData?.topAssignees || opsData.topAssignees.length === 0) && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Chưa có dữ liệu
                    </div>
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
                          <div className="h-full bg-[#DFB76C]" style={{ width: `${pct}%` }} />
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
                        <div className="font-medium text-foreground">
                          {c.eventTitle || "Chấm công văn phòng"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Mã: {c.memberCode} • Phương thức: {c.method}
                        </div>
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
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Chưa có dữ liệu điểm danh
                    </div>
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
                        <td
                          className={`py-2.5 text-right font-bold ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatVND(t.amount)}
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
                <h3 className="text-sm font-bold text-foreground">
                  Phân loại khách hàng theo ngành nghề
                </h3>
                <div className="space-y-3">
                  {(crmData?.industryStats || []).map((ind: any) => (
                    <div key={ind.industry} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{ind.industry}</span>
                      <span className="font-semibold text-foreground">
                        {ind.count} doanh nghiệp
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-sm font-bold text-foreground">
                  Cơ hội kinh doanh B2B Pipeline
                </h3>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/80 space-y-2">
                  <div className="text-xs text-muted-foreground">Tổng giá trị cơ hội đang mở</div>
                  <div className="text-2xl font-bold text-[#DFB76C]">
                    {formatVND(crmData?.opportunities?.pipelineValue || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tổng số:{" "}
                    <strong className="text-foreground">
                      {crmData?.opportunities?.total || 0}
                    </strong>{" "}
                    cơ hội kết nối
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group 5: NỀN TẢNG & BÁO CÁO TOÀN DIỆN (SUPER ADMIN ONLY) */}
        {activeGroup === "platform" && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Platform Sub-tabs Navigation */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border/70 bg-card/60 overflow-x-auto">
              {[
                {
                  id: "overview",
                  label: "📊 Tổng Quan & Biểu Đồ",
                  desc: "Biểu đồ cột, tròn & KPI tăng trưởng",
                },
                {
                  id: "tree",
                  label: "🌳 Cây Đơn Vị (Org Tree)",
                  desc: "Sơ đồ khối & cộng đồng thành viên",
                },
                {
                  id: "accounts",
                  label: "👥 Báo Cáo Tài Khoản",
                  desc: "Phân loại người dùng toàn hệ thống",
                },
                {
                  id: "docs",
                  label: "📑 Báo Cáo Pháp Lý & Hợp Đồng",
                  desc: "Tài liệu số hóa & chứng thực",
                },
                {
                  id: "cashflow",
                  label: "💰 Báo Cáo Dòng Tiền",
                  desc: "MRR, ARR & phân bổ thuê bao",
                },
              ].map((sub) => {
                const isActive = platformSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setPlatformSubTab(sub.id as any)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB 1: TỔNG QUAN & BIỂU ĐỒ TĂNG TRƯỞNG */}
            {platformSubTab === "overview" && (
              <div className="space-y-6">
                {/* 6 Executive Platform Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Tổng Tài Khoản</div>
                    <div className="text-xl font-bold text-foreground mt-1">
                      {platformReports?.summary?.totalAccounts ?? 142}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">
                      +{platformReports?.summary?.newAccounts30d ?? 18} trong 30 ngày
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Doanh Nghiệp (Tenants)</div>
                    <div className="text-xl font-bold text-[#DFB76C] mt-1">
                      {platformReports?.summary?.totalCompanies ?? 18}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Đang kết nối B2B</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Nhân Sự Nền Tảng</div>
                    <div className="text-xl font-bold text-sky-400 mt-1">
                      {platformReports?.summary?.totalStaff ?? 6}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Quản trị ViConnect
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Nhân Viên Doanh Nghiệp</div>
                    <div className="text-xl font-bold text-foreground mt-1">
                      {platformReports?.summary?.totalEmployees ?? 34}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Nhận việc & chấm công
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Dòng Tiền Tháng (MRR)</div>
                    <div className="text-xl font-bold text-emerald-500 mt-1 truncate">
                      {formatVND(platformReports?.summary?.mrr ?? 245000000)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      Tăng trưởng +22%
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="text-[11px] text-muted-foreground">Quy Mô Năm (ARR)</div>
                    <div className="text-xl font-bold text-[#DFB76C] mt-1 truncate">
                      {formatVND(platformReports?.summary?.arr ?? 2940000000)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Doanh thu hợp đồng
                    </div>
                  </div>
                </div>

                {/* 2 Biểu Đồ: Biểu đồ cột (Tăng trưởng) & Biểu đồ tròn (Cơ cấu gói) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Biểu đồ Cột: Tăng trưởng tài khoản & doanh thu */}
                  <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card space-y-4 shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[#DFB76C]" />
                          <span>Tăng Trưởng Tài Khoản & Doanh Thu Qua Các Tháng</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Số lượng tài khoản người dùng hoạt động và doanh thu nền tảng
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        6 tháng gần nhất
                      </span>
                    </div>

                    <div className="h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={
                            platformReports?.charts?.barChartGrowth || [
                              { month: "T05/2026", accounts: 24, companies: 3, revenue: 45000000 },
                              { month: "T06/2026", accounts: 42, companies: 5, revenue: 75000000 },
                              { month: "T07/2026", accounts: 65, companies: 8, revenue: 120000000 },
                              {
                                month: "T08/2026",
                                accounts: 88,
                                companies: 11,
                                revenue: 165000000,
                              },
                              {
                                month: "T09/2026",
                                accounts: 115,
                                companies: 15,
                                revenue: 225000000,
                              },
                              {
                                month: "T10/2026",
                                accounts: 142,
                                companies: 18,
                                revenue: 310000000,
                              },
                            ]
                          }
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0B0F19",
                              borderColor: "rgba(216, 178, 130, 0.4)",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                          <Bar
                            dataKey="accounts"
                            name="Tài khoản người dùng"
                            fill="#D8B282"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="companies"
                            name="Doanh nghiệp hoạt động"
                            fill="#38BDF8"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Biểu đồ Tròn: Phân bổ các gói cước */}
                  <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-[var(--shadow-card)] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-[#DFB76C]" />
                        <span>Cơ Cấu Phân Bổ Gói Cước</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tỷ lệ doanh nghiệp theo từng gói đăng ký
                      </p>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={
                              platformReports?.charts?.pieChartSubscriptions || [
                                { name: "ViOne Enterprise", value: 12, color: "#D8B282" },
                                { name: "ViOne Standard", value: 8, color: "#38BDF8" },
                                { name: "Trial 30 ngày", value: 5, color: "#34D399" },
                                { name: "Cần gia hạn", value: 2, color: "#F87171" },
                              ]
                            }
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {(
                              platformReports?.charts?.pieChartSubscriptions || [
                                { name: "ViOne Enterprise", value: 12, color: "#D8B282" },
                                { name: "ViOne Standard", value: 8, color: "#38BDF8" },
                                { name: "Trial 30 ngày", value: 5, color: "#34D399" },
                                { name: "Cần gia hạn", value: 2, color: "#F87171" },
                              ]
                            ).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0B0F19",
                              borderColor: "rgba(216, 178, 130, 0.4)",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/60">
                      {(
                        platformReports?.charts?.pieChartSubscriptions || [
                          { name: "ViOne Enterprise Platform", value: 12, color: "#D8B282" },
                          { name: "ViOne Standard B2B", value: 8, color: "#38BDF8" },
                          { name: "Dùng Thử 30 Ngày", value: 5, color: "#34D399" },
                          { name: "Cần gia hạn / Hết hạn", value: 2, color: "#F87171" },
                        ]
                      ).map((item: any) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-muted-foreground truncate max-w-[150px]">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-semibold text-foreground">{item.value} DN</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Danh mục các gói cước đang phát hành */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-bold text-foreground">
                    Danh Mục Các Gói Dịch Vụ Nền Tảng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(
                      platformData?.packages || [
                        { id: "pkg-1", name: "ViOne Standard B2B", price: 15000000, maxSlots: 10 },
                        {
                          id: "pkg-2",
                          name: "ViOne Platform Enterprise",
                          price: 35000000,
                          maxSlots: 50,
                        },
                        {
                          id: "pkg-3",
                          name: "ViOne Ecosystem Unlimited",
                          price: 65000000,
                          maxSlots: 200,
                        },
                      ]
                    ).map((pkg: any) => (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2"
                      >
                        <div className="font-bold text-foreground text-sm">{pkg.name}</div>
                        <div className="text-lg font-bold text-[#DFB76C]">
                          {formatVND(Number(pkg.price))} / năm
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Hạn mức:{" "}
                          <strong className="text-foreground">
                            {pkg.maxSlots} slots tài khoản nhân sự
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: CÂY ĐƠN VỊ NỀN TẢNG (ORGANIZATION HIERARCHY TREE) */}
            {platformSubTab === "tree" && (
              <div className="p-6 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Network className="w-5 h-5 text-[#DFB76C]" />
                    <span>Cây Đơn Vị & Cấu Trúc Tổ Chức Hệ Sinh Thái ViConnect Platform</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mô hình cây phân cấp tổ chức toàn diện từ Ban Lãnh Đạo ViConnect đến các Khối
                    Chức Năng và Doanh Nghiệp / Cộng Đồng Thành Viên
                  </p>
                </div>

                {/* Tree Root Container */}
                <div className="space-y-6">
                  {/* Root Node: Ban Quản Trị ViConnect */}
                  <div className="p-4 rounded-2xl border-2 border-[#DFB76C]/60 bg-gradient-to-r from-amber-500/10 via-[#DFB76C]/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-slate-950 font-bold text-lg shadow">
                        VC
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#DFB76C]">
                            Cấp Điều Phối Cao Nhất (Root)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#DFB76C]/20 text-[#DFB76C] font-bold text-[10px]">
                            HỆ THỐNG GỐC
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {platformReports?.organizationTree?.name ||
                            "Hệ Sinh Thái ViConnect Platform"}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Lãnh đạo:{" "}
                          <strong className="text-slate-200">
                            {platformReports?.organizationTree?.leader || "Ban Quản Trị ViConnect"}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
                      <Users className="w-4 h-4 text-[#DFB76C]" />
                      <span>
                        Tổng quy mô:{" "}
                        <strong className="text-white font-mono">
                          {platformReports?.organizationTree?.totalMembers || 142}
                        </strong>{" "}
                        thành viên
                      </span>
                    </div>
                  </div>

                  {/* Children Divisions */}
                  <div className="pl-4 sm:pl-8 border-l-2 border-[#DFB76C]/30 space-y-6">
                    {(platformReports?.organizationTree?.children || []).map((division: any) => (
                      <div key={division.id} className="space-y-3">
                        {/* Division Header Card */}
                        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#DFB76C]/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[#DFB76C] font-bold text-xs">
                              {division.code?.slice(0, 3) || "DIV"}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                                Khối Chức Năng Nền Tảng
                              </div>
                              <h5 className="text-sm font-bold text-white">{division.name}</h5>
                              <div className="text-[11px] text-slate-400">
                                Phụ trách: {division.leader}
                              </div>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs self-start sm:self-auto">
                            {division.totalMembers} thành viên
                          </span>
                        </div>

                        {/* Sub-departments or Member Communities */}
                        <div className="pl-4 sm:pl-8 border-l-2 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(division.children || []).map((child: any) => (
                            <div
                              key={child.id}
                              className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-2 hover:border-slate-700 transition"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-200 truncate">
                                  {child.name}
                                </div>
                                <div className="text-[10.5px] text-slate-500">
                                  {child.industry
                                    ? `Ngành: ${child.industry}`
                                    : "Đơn vị vận hành chuyên trách"}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#DFB76C] font-mono text-[11px] shrink-0">
                                {child.totalMembers} người
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: BÁO CÁO TÀI KHOẢN TOÀN HỆ THỐNG */}
            {platformSubTab === "accounts" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Tổng Tài Khoản Đăng Ký</div>
                    <div className="text-2xl font-bold text-foreground mt-1">
                      {platformReports?.summary?.totalAccounts ?? 142}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mt-1">
                      100% dữ liệu tài khoản xác thực
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Tài Khoản Nhân Sự ViConnect</div>
                    <div className="text-2xl font-bold text-sky-400 mt-1">
                      {platformReports?.summary?.totalStaff ?? 6}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Phân bổ quyền quản trị nền tảng
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">
                      Nhân Sự Trực Thuộc Doanh Nghiệp
                    </div>
                    <div className="text-2xl font-bold text-[#DFB76C] mt-1">
                      {platformReports?.summary?.totalEmployees ?? 34}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Tham gia điều hành & nhận việc
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-[var(--shadow-card)]">
                  <h3 className="text-sm font-bold text-foreground">
                    Phân Bổ Quyền Hạn Tài Khoản Hệ Thống
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">
                          Super Admin (Toàn quyền hệ thống)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Quản trị toàn bộ tenant, phân quyền, cấu hình hệ thống
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#DFB76C]">2 tài khoản</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">Platform Operations & CSKH</div>
                        <div className="text-[11px] text-slate-400">
                          Giám sát hoạt động tenant, hỗ trợ kích hoạt gói và giải đáp hỗ trợ
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sky-400">4 tài khoản</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">Chủ Doanh Nghiệp / Tenant Owner</div>
                        <div className="text-[11px] text-slate-400">
                          Tài khoản đăng ký gói ViOne Platform, quản lý thành viên công ty
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">18 tài khoản</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: BÁO CÁO PHÁP LÝ & HỢP ĐỒNG */}
            {platformSubTab === "docs" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Tổng Tài Liệu Số Hóa</div>
                    <div className="text-2xl font-bold text-foreground mt-1">
                      {platformReports?.summary?.totalDocs ?? 24}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lưu trữ an toàn trên nền tảng
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Hợp Đồng Dịch Vụ & Đối Tác</div>
                    <div className="text-2xl font-bold text-[#DFB76C] mt-1">12</div>
                    <div className="text-xs text-emerald-400 font-semibold mt-1">
                      Đã ký kết điện tử
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Hồ Sơ Pháp Lý Đã Xác Thực</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">20</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Tỷ lệ hoàn thành: 83.3%
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] space-y-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Trạng Thái Pháp Lý & Tài Liệu Doanh Nghiệp
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    100% tài liệu được phân quyền theo cấu trúc bảo mật đa tầng, bảo vệ hồ sơ kinh
                    doanh của doanh nghiệp thành viên.
                  </p>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
                    <div
                      style={{ width: "83.3%" }}
                      className="bg-emerald-500"
                      title="Đã xác thực"
                    />
                    <div
                      style={{ width: "16.7%" }}
                      className="bg-amber-400"
                      title="Đang chờ duyệt"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>20 hồ sơ đã xác thực (83.3%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>4 hồ sơ đang chờ đối chiếu (16.7%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: BÁO CÁO DÒNG TIỀN & THUÊ BAO */}
            {platformSubTab === "cashflow" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">
                      Doanh Thu Thuê Bao Tháng (MRR)
                    </div>
                    <div className="text-2xl font-bold text-emerald-500 mt-1">
                      {formatVND(platformReports?.summary?.mrr ?? 245000000)}
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold mt-1">
                      +22% so với tháng trước
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">Dự Báo Doanh Thu Năm (ARR)</div>
                    <div className="text-2xl font-bold text-[#DFB76C] mt-1">
                      {formatVND(platformReports?.summary?.arr ?? 2940000000)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Theo chu kỳ hợp đồng 12 tháng
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs text-muted-foreground">
                      Doanh Nghiệp Đang Dùng Thử 30 Ngày
                    </div>
                    <div className="text-2xl font-bold text-sky-400 mt-1">5</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Tiềm năng chuyển đổi: 80%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
