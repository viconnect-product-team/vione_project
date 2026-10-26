import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  Calendar,
  FileText,
  ClipboardList,
  Edit2,
  X,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useT } from "@/lib/i18n";

export interface CompanyActivityItem {
  companyId: string;
  companyName: string;
  slug: string;
  logoUrl?: string;
  industry: string;
  ownerName: string;
  buyerName?: string;
  ownerEmail: string;
  ownerPhone: string;
  plan: string;
  subscriptionStatus: "active" | "trial" | "expired" | "unsubscribed" | string;
  isTrial: boolean;
  isTrialExpiringSoon?: boolean;
  trialDaysLeft?: number;
  expiresAt?: string;
  daysLeft: number;
  maxSlots: number;
  employeeCount: number;
  memberCount?: number;
  taskCount: number;
  completedTaskCount: number;
  customerCount: number;
  documentCount: number;
  healthScore: number;
  activityLevel: string;
  crmUnlocked: boolean;
  createdAt: string;
}

export interface PlatformMonitoringData {
  ok: boolean;
  summary: {
    totalCompanies: number;
    activeCompanies: number;
    trialCompanies: number;
    expiredCompanies: number;
    totalUsers: number;
    newUsersThisMonth: number;
    newCompaniesThisMonth: number;
    totalTasks: number;
    platformRevenue: number;
  };
  userGrowthTrend: Array<{
    month: string;
    newUsers: number;
    newCompanies: number;
    totalRevenue: number;
  }>;
  companiesActivity: CompanyActivityItem[];
}

export function PlatformActivityMonitoring() {
  const t = useT();
  const [data, setData] = useState<PlatformMonitoringData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  // Modal chỉnh sửa gói cước
  const [selectedCompany, setSelectedCompany] = useState<CompanyActivityItem | null>(null);
  const [editPlan, setEditPlan] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("active");
  const [editSlots, setEditSlots] = useState<number>(10);
  const [extendDays, setExtendDays] = useState<number>(30);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<PlatformMonitoringData>("/companies/platform-monitoring");
      if (res && res.ok) {
        setData(res);
      }
    } catch (err: any) {
      console.error("[PlatformActivityMonitoring] Error loading monitoring data:", err);
      toast.error("Không thể tải dữ liệu giám sát nền tảng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (c: CompanyActivityItem) => {
    setSelectedCompany(c);
    setEditPlan(
      c.plan.includes("enterprise") ? "vione_platform_enterprise" : "vione_platform_annual",
    );
    setEditStatus(c.subscriptionStatus === "expired" ? "active" : c.subscriptionStatus);
    setEditSlots(c.maxSlots || 20);
    setExtendDays(30);
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setSubmitting(true);
    try {
      const res = await fetchNestApi<any>(`/companies/${selectedCompany.companyId}/subscription`, {
        method: "PATCH",
        body: JSON.stringify({
          plan: editPlan,
          status: editStatus,
          maxSlots: Number(editSlots),
          extendDays: Number(extendDays),
        }),
      });

      if (res && res.ok) {
        toast.success(res.message || "Cập nhật trạng thái gói cước thành công!");
        setSelectedCompany(null);
        loadData();
      } else {
        toast.error(res?.message || "Không thể cập nhật gói cước");
      }
    } catch (err: any) {
      toast.error("Lỗi khi cập nhật gói: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setSubmitting(false);
    }
  };

  // Modal Quản lý Cộng đồng nền tảng (Platform Community CRUD)
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState<boolean>(false);
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null);
  const [communityName, setCommunityName] = useState<string>("");
  const [communityTagline, setCommunityTagline] = useState<string>("");
  const [communityDescription, setCommunityDescription] = useState<string>("");
  const [communityOwnerUserId, setCommunityOwnerUserId] = useState<string>("");
  const [communitySubmitting, setCommunitySubmitting] = useState<boolean>(false);

  const handleSaveCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim()) {
      toast.error("Vui lòng nhập tên cộng đồng");
      return;
    }
    setCommunitySubmitting(true);
    try {
      if (editingCommunityId) {
        const res = await fetchNestApi<any>(
          `/companies/platform/communities/${editingCommunityId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: communityName.trim(),
              tagline: communityTagline.trim() || undefined,
              description: communityDescription.trim() || undefined,
            }),
          },
        );
        if (res && res.ok) {
          toast.success("Cập nhật cộng đồng thành công!");
          setIsCommunityModalOpen(false);
          loadData();
        } else {
          toast.error(res?.message || "Không thể cập nhật cộng đồng");
        }
      } else {
        const res = await fetchNestApi<any>("/companies/platform/communities", {
          method: "POST",
          body: JSON.stringify({
            name: communityName.trim(),
            tagline: communityTagline.trim() || undefined,
            description: communityDescription.trim() || undefined,
            ownerUserId: communityOwnerUserId || undefined,
          }),
        });
        if (res && res.ok) {
          toast.success("Tạo mới cộng đồng cho tài khoản thành công!");
          setIsCommunityModalOpen(false);
          loadData();
        } else {
          toast.error(res?.message || "Không thể tạo cộng đồng");
        }
      }
    } catch (err: any) {
      toast.error("Lỗi khi lưu cộng đồng: " + (err?.message || "Vui lòng thử lại"));
    } finally {
      setCommunitySubmitting(false);
    }
  };

  const handleDeleteCommunity = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cộng đồng "${name}"?`)) return;
    try {
      const res = await fetchNestApi<any>(`/companies/platform/communities/${id}`, {
        method: "DELETE",
      });
      if (res && res.ok) {
        toast.success(`Đã xóa cộng đồng "${name}" thành công!`);
        loadData();
      } else {
        toast.error(res?.message || "Không thể xóa cộng đồng");
      }
    } catch (err: any) {
      toast.error("Lỗi khi xóa: " + (err?.message || "Vui lòng thử lại"));
    }
  };

  // Filtered list
  const filteredCompanies = (data?.companiesActivity || []).filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.subscriptionStatus === "active") ||
      (statusFilter === "trial" && c.isTrial) ||
      (statusFilter === "expired" && c.subscriptionStatus === "expired") ||
      (statusFilter === "unsubscribed" && c.subscriptionStatus === "unsubscribed");

    const matchesLevel =
      levelFilter === "all" ||
      (levelFilter === "high" && c.healthScore >= 75) ||
      (levelFilter === "medium" && c.healthScore >= 50 && c.healthScore < 75) ||
      (levelFilter === "low" && c.healthScore < 50);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* ── KPI TIÊU ĐIỂM NỀN TẢNG (PLATFORM EXECUTIVE METRICS) ─────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Doanh nghiệp có gói ViOne Platform */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Doanh Nghiệp Kích Hoạt Gói</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {data?.summary.activeCompanies || 0}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5">
              / {data?.summary.totalCompanies || 0} DN
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>{data?.summary.trialCompanies || 0} DN đang dùng thử 30 ngày</span>
          </div>
        </div>

        {/* KPI 2: Người tham gia mới tháng này */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
            <UserPlus className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Người Tham Gia Mới (30 Ngày)</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            +{data?.summary.newUsersThisMonth || 0}
            <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 ml-1.5 font-semibold">
              (Tăng trưởng)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>+{data?.summary.newCompaniesThisMonth || 0} DN mới đăng ký</span>
          </div>
        </div>

        {/* KPI 3: Tổng người dùng / Nhân sự */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tổng Nhân Sự & Thành Viên</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {(data?.summary.totalUsers || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{(data?.summary.totalTasks || 0).toLocaleString()} công việc đang chạy</span>
          </div>
        </div>

        {/* KPI 4: Ước lượng doanh thu gói cước */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 p-2 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Doanh Thu Gói ViOne CRM</div>
          <div className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-300">
            {((data?.summary.platformRevenue || 0) / 1_000_000).toLocaleString()}
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">triệu đ</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-amber-500 dark:text-amber-400" />
            <span>100% Giao dịch thanh toán chính thức</span>
          </div>
        </div>
      </div>

      {/* ── BIỂU ĐỒ TĂNG TRƯỞNG NGƯỜI THAM GIA MỚI (GROWTH CHART) ────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <span>Biểu Đồ Tăng Trưởng Người Tham Gia Mới & Doanh Nghiệp ViOne</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Theo dõi biến động số lượng thành viên, công ty đăng ký mới và quy mô mở rộng nền tảng
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>Người tham gia mới</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Doanh nghiệp mới</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.userGrowthTrend || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="companyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-800" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="Thành viên mới"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#userGrad)"
              />
              <Area
                type="monotone"
                dataKey="newCompanies"
                name="Doanh nghiệp mới"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#companyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── BẢNG THEO DÕI CHI TIẾT MỨC ĐỘ HOẠT ĐỘNG CỦA DOANH NGHIỆP ─── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>Theo Dõi Mức Độ Hoạt Động & Sức Khỏe Doanh Nghiệp (Health Score)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chi tiết các công ty có gói ViOne Platform, số lượng nhân sự, công việc, tài liệu và
              mức độ tương tác CRM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingCommunityId(null);
                setCommunityName("");
                setCommunityTagline("");
                setCommunityDescription("");
                setCommunityOwnerUserId("");
                setIsCommunityModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-950 font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 rounded-lg shadow hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo Cộng Đồng Mới</span>
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên công ty, chủ doanh nghiệp, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            <option value="all">Tất cả trạng thái gói</option>
            <option value="active">Đang kích hoạt (Active)</option>
            <option value="trial">Dùng thử 30 ngày (Trial)</option>
            <option value="expired">Đã hết hạn (Expired)</option>
            <option value="unsubscribed">Chưa mua gói</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            <option value="all">Tất cả mức độ hoạt động</option>
            <option value="high">Rất tích cực (≥ 75%)</option>
            <option value="medium">Tích cực (50% - 74%)</option>
            <option value="low">Cần hỗ trợ (&lt; 50%)</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3 px-4">Doanh Nghiệp & Người Mua Gói</th>
                <th className="py-3 px-3">Gói Dịch Vụ & Trạng Thái</th>
                <th className="py-3 px-3 text-center">Số Thành Viên (Slots)</th>
                <th className="py-3 px-3">Mức Độ Hoạt Động (Health Score)</th>
                <th className="py-3 px-3 text-center">Tài Liệu & CRM</th>
                <th className="py-3 px-4 text-right">Quản Trị Gói & Cộng Đồng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Đang tải dữ liệu giám sát hoạt động doanh nghiệp...</span>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Không tìm thấy doanh nghiệp phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => {
                  const healthColor =
                    c.healthScore >= 75
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                      : c.healthScore >= 50
                        ? "text-amber-600 dark:text-amber-300 bg-amber-500/10 border-amber-500/30"
                        : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30";

                  const slotPercent = Math.min(
                    100,
                    Math.round((c.employeeCount / (c.maxSlots || 1)) * 100),
                  );

                  return (
                    <tr key={c.companyId} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {/* Doanh nghiệp & Chủ sở hữu */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {c.logoUrl ? (
                            <img
                              src={c.logoUrl}
                              alt={c.companyName}
                              className="h-9 w-9 rounded-xl object-contain bg-white p-0.5 border border-slate-300 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-300 font-bold text-sm shrink-0">
                              {c.companyName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to="/companies/$companyId"
                              params={{ companyId: c.companyId }}
                              className="font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-300 transition-colors truncate block text-[13px]"
                            >
                              {c.companyName}
                            </Link>
                            <div className="text-[11px] text-slate-400 flex flex-col gap-0.5 mt-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-300 font-medium">Người mua:</span>
                                <span className="text-[#DFB76C] font-semibold">
                                  {c.buyerName || c.ownerName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span>{c.ownerEmail}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-medium">
                                  {c.memberCount ?? c.employeeCount} thành viên
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gói Dịch Vụ */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                              c.subscriptionStatus === "active"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : c.isTrial
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  : c.subscriptionStatus === "expired"
                                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                    : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {c.isTrial
                              ? "Dùng thử 30 ngày"
                              : c.subscriptionStatus === "active"
                                ? "Doanh Nghiệp Active"
                                : c.subscriptionStatus === "expired"
                                  ? "Đã hết hạn"
                                  : "Chưa kích hoạt"}
                          </span>
                          <div className="text-[10.5px] text-slate-400">
                            {c.daysLeft > 0 ? `Còn ${c.daysLeft} ngày` : "Hết hạn dịch vụ"}
                          </div>

                          {/* Cảnh báo sắp hết hạn dùng thử */}
                          {c.isTrial &&
                            ((c.trialDaysLeft !== undefined
                              ? c.trialDaysLeft <= 7
                              : c.daysLeft <= 7) ||
                              c.isTrialExpiringSoon) && (
                              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-bold animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                                <span>
                                  ⚠️ Sắp hết hạn dùng thử ({c.trialDaysLeft ?? c.daysLeft} ngày)
                                </span>
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Hạn mức slots */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-block text-center">
                          <span className="font-mono font-bold text-white text-[12px]">
                            {c.employeeCount}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            /{c.maxSlots}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden mx-auto">
                            <div
                              className={`h-full rounded-full ${
                                slotPercent >= 90 ? "bg-rose-500" : "bg-amber-400"
                              }`}
                              style={{ width: `${slotPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Mức Độ Hoạt Động & Health Score */}
                      <td className="py-3 px-3">
                        <div className="space-y-1.5 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`px-1.5 py-0.2 rounded border font-semibold ${healthColor}`}
                            >
                              {c.activityLevel}
                            </span>
                            <span className="font-bold font-mono text-white">
                              {c.healthScore}% Sức khỏe
                            </span>
                          </div>
                          {/* Mini stats */}
                          <div className="text-[10.5px] text-slate-400 flex items-center gap-2">
                            <span>
                              Tasks: <strong className="text-white">{c.completedTaskCount}</strong>/
                              {c.taskCount}
                            </span>
                            <span>•</span>
                            <span>
                              Khách: <strong className="text-white">{c.customerCount}</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tài liệu & CRM */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-3 text-slate-400 text-[11px]">
                          <span title={`${c.documentCount} tài liệu lưu trữ`}>
                            📁 <strong className="text-slate-200">{c.documentCount}</strong>
                          </span>
                          <span title={`${c.customerCount} khách hàng CRM`}>
                            👥 <strong className="text-slate-200">{c.customerCount}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommunityId(null);
                              setCommunityName(c.companyName + " Community");
                              setCommunityTagline("Cộng đồng giao thương & điều hành nội bộ");
                              setCommunityDescription(
                                `Cộng đồng điều hành & giao việc trực thuộc ${c.companyName}`,
                              );
                              setCommunityOwnerUserId("");
                              setIsCommunityModalOpen(true);
                            }}
                            title="Tạo / Gán cộng đồng cho doanh nghiệp này"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#DFB76C] hover:text-amber-200 border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            title="Quản trị gói cước & mở khóa CRM"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            to="/companies/$companyId"
                            params={{ companyId: c.companyId }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Xem chi tiết doanh nghiệp"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CHỈNH SỬA / GIA HẠN / MỞ KHÓA GÓI CƯỚC BỞI SUPER ADMIN ─ */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/40 bg-slate-950 p-6 text-white shadow-2xl">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Quản Trị Gói ViOne Platform</h3>
                <p className="text-xs text-amber-300 truncate max-w-[260px]">
                  {selectedCompany.companyName}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateSubscription} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gói Dịch Vụ
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="vione_platform_enterprise">
                    ViOne Platform Enterprise (VIP 50-200 slots)
                  </option>
                  <option value="vione_platform_annual">
                    ViOne Platform Annual (Chuẩn 50 slots)
                  </option>
                  <option value="vione_platform_starter">
                    ViOne Platform Starter (Khởi nghiệp 10 slots)
                  </option>
                  <option value="vione_platform_trial_30d">
                    Gói Dùng Thử Trải Nghiệm (30 Ngày)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Trạng Thái
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active (Mở khóa CRM)</option>
                    <option value="expired">Expired (Khóa CRM)</option>
                    <option value="trial">Trial (Dùng thử)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hạn Mức Slots (Nhân sự)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={editSlots}
                    onChange={(e) => setEditSlots(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gia Hạn Thêm (Số Ngày)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 90, 180, 365].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        extendDays === d
                          ? "border-amber-400 bg-amber-500/20 text-amber-300"
                          : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      +{d} ngày
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
                  }}
                >
                  {submitting ? "Đang lưu..." : "Cập Nhật Quyền CRM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: TẠO / SỬA CỘNG ĐỒNG CHO DOANH NGHIỆP NỀN TẢNG ──────────────── */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setIsCommunityModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-[#DFB76C] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>
                {editingCommunityId ? "Chỉnh Sửa Cộng Đồng" : "Tạo Mới Cộng Đồng Cho Doanh Nghiệp"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mt-1">
              {editingCommunityId
                ? "Cập Nhật Thông Tin Cộng Đồng"
                : "Khởi Tạo Cộng Đồng ViOne Platform"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cộng đồng sẽ được gán quyền cho chủ doanh nghiệp / người mua gói để quản lý thành viên
              & giao việc.
            </p>

            <form onSubmit={handleSaveCommunity} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên cộng đồng <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: CEO 1983 - CLB Doanh Nhân"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Khẩu hiệu / Tagline
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kết nối giao thương & Tăng trưởng bền vững"
                  value={communityTagline}
                  onChange={(e) => setCommunityTagline(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả cộng đồng
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tôn chỉ, định hướng hoạt động của cộng đồng..."
                  value={communityDescription}
                  onChange={(e) => setCommunityDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DFB76C] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCommunityModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={communitySubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
                  }}
                >
                  {communitySubmitting
                    ? "Đang xử lý..."
                    : editingCommunityId
                      ? "Lưu Thay Đổi"
                      : "Tạo Cộng Đồng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
