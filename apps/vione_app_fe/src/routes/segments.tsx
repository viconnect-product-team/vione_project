import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  CreditCard,
  QrCode,
  Calendar,
  ShieldCheck,
  Eye,
  Edit3,
  Trash2,
  Users,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  FileText,
  AlertCircle,
  X,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { fetchNestApi } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/segments")({
  component: PackageManagementPage,
});

interface SubscriptionPackage {
  id: string;
  code: string;
  name: string;
  description?: string;
  packageType: "free_trial" | "paid";
  price: number;
  billingCycle: string;
  durationDays: number;
  maxSlots: number;
  maxDepartments: number;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  qrTemplate?: string;
  features?: string[];
  isActive: boolean;
  createdAt?: string;
}

interface PackageOrder {
  id: string;
  userId?: string;
  packageId?: string;
  packageCode: string;
  packageName: string;
  price: number;
  maxSlots: number;
  companyName: string;
  taxId?: string;
  representativeName: string;
  phone: string;
  email: string;
  industry?: string;
  address?: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export function PackageManagementPage() {
  const [activeTab, setActiveTab] = useState<"packages" | "orders">("orders");
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [orders, setOrders] = useState<PackageOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Package state
  const [isPkgModalOpen, setIsPkgModalOpen] = useState<boolean>(false);
  const [editingPkg, setEditingPkg] = useState<SubscriptionPackage | null>(null);
  const [pkgCode, setPkgCode] = useState<string>("");
  const [pkgName, setPkgName] = useState<string>("");
  const [pkgDesc, setPkgDesc] = useState<string>("");
  const [pkgType, setPkgType] = useState<"free_trial" | "paid">("paid");
  const [pkgPrice, setPkgPrice] = useState<number>(1500000);
  const [pkgSlots, setPkgSlots] = useState<number>(30);
  const [pkgCycle, setPkgCycle] = useState<string>("monthly");
  const [pkgDuration, setPkgDuration] = useState<number>(30);
  const [pkgBankName, setPkgBankName] = useState<string>("MB Bank (Quân Đội)");
  const [pkgBankAccount, setPkgBankAccount] = useState<string>("0987654321");
  const [pkgAccountName, setPkgAccountName] = useState<string>("CONG TY CP CONG NGHE VICONNECT");
  const [pkgFeatures, setPkgFeatures] = useState<string>("");
  const [submittingPkg, setSubmittingPkg] = useState<boolean>(false);

  // Modal Order Review state
  const [selectedOrder, setSelectedOrder] = useState<PackageOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgsRes, ordersRes] = await Promise.all([
        fetchNestApi<SubscriptionPackage[]>("/companies/packages?includeInactive=true").catch(() => []),
        fetchNestApi<PackageOrder[]>("/companies/package-orders").catch(() => []),
      ]);

      if (Array.isArray(pkgsRes)) setPackages(pkgsRes);
      if (Array.isArray(ordersRes)) setOrders(ordersRes);
    } catch (err: any) {
      toast.error("Lỗi khi tải dữ liệu gói dịch vụ: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreatePkgModal = () => {
    setEditingPkg(null);
    setPkgCode(`VIONE_PKG_${Date.now().toString().slice(-4)}`);
    setPkgName("");
    setPkgDesc("");
    setPkgType("paid");
    setPkgPrice(1500000);
    setPkgSlots(30);
    setPkgCycle("monthly");
    setPkgDuration(30);
    setPkgBankName("MB Bank (Quân Đội)");
    setPkgBankAccount("0987654321");
    setPkgAccountName("CONG TY CP CONG NGHE VICONNECT");
    setPkgFeatures("30 Tài khoản thành viên\nQuản lý công việc Kanban BPMN\nChấm công GPS thời gian thực\nCRM Chăm sóc khách hàng");
    setIsPkgModalOpen(true);
  };

  const openEditPkgModal = (pkg: SubscriptionPackage) => {
    setEditingPkg(pkg);
    setPkgCode(pkg.code);
    setPkgName(pkg.name);
    setPkgDesc(pkg.description || "");
    setPkgType(pkg.packageType || (pkg.price === 0 ? "free_trial" : "paid"));
    setPkgPrice(pkg.price);
    setPkgSlots(pkg.maxSlots || 30);
    setPkgCycle(pkg.billingCycle || "monthly");
    setPkgDuration(pkg.durationDays || 30);
    setPkgBankName(pkg.bankName || "MB Bank (Quân Đội)");
    setPkgBankAccount(pkg.bankAccount || "0987654321");
    setPkgAccountName(pkg.bankAccountName || "CONG TY CP CONG NGHE VICONNECT");
    setPkgFeatures(Array.isArray(pkg.features) ? pkg.features.join("\n") : "");
    setIsPkgModalOpen(true);
  };

  const handleSavePkg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) {
      toast.error("Vui lòng nhập tên gói dịch vụ");
      return;
    }
    if (pkgSlots < 1) {
      toast.error("Số lượng tài khoản tối thiểu phải từ 1 tài khoản");
      return;
    }

    setSubmittingPkg(true);
    try {
      const featuresArray = pkgFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        code: pkgCode.trim().toUpperCase(),
        name: pkgName.trim(),
        description: pkgDesc.trim(),
        packageType: pkgType,
        price: pkgType === "free_trial" ? 0 : Number(pkgPrice),
        billingCycle: pkgCycle,
        durationDays: Number(pkgDuration),
        maxSlots: Number(pkgSlots),
        bankName: pkgBankName.trim(),
        bankAccount: pkgBankAccount.trim(),
        bankAccountName: pkgAccountName.trim(),
        features: featuresArray,
      };

      if (editingPkg) {
        await fetchNestApi(`/companies/packages/${editingPkg.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success(`Đã cập nhật gói "${pkgName}" thành công!`);
      } else {
        await fetchNestApi("/companies/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success(`Đã tạo mới gói "${pkgName}" thành công!`);
      }

      setIsPkgModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Lỗi khi lưu gói dịch vụ: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setSubmittingPkg(false);
    }
  };

  const handleTogglePkgActive = async (pkg: SubscriptionPackage) => {
    try {
      await fetchNestApi(`/companies/packages/${pkg.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      toast.success(`Đã ${pkg.isActive ? "ẩn" : "kích hoạt"} gói "${pkg.name}"`);
      loadData();
    } catch (err: any) {
      toast.error("Lỗi cập nhật trạng thái gói: " + (err?.message || ""));
    }
  };

  const handleApproveOrder = async (order: PackageOrder) => {
    setProcessingOrder(true);
    try {
      const res = await fetchNestApi<any>(`/companies/package-orders/${order.id}/approve`, {
        method: "POST",
      });

      toast.success(
        res?.message || `Đã phê duyệt gói cước và gửi email thông báo tới ${order.email}!`,
        { duration: 5000 }
      );
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
      loadData();
    } catch (err: any) {
      toast.error("Lỗi phê duyệt hồ sơ: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedOrder) return;
    setProcessingOrder(true);
    try {
      await fetchNestApi(`/companies/package-orders/${selectedOrder.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectionReason.trim() }),
      });
      toast.success(`Đã từ chối hồ sơ đăng ký của "${selectedOrder.companyName}"`);
      setIsRejectModalOpen(false);
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
      setRejectionReason("");
      loadData();
    } catch (err: any) {
      toast.error("Lỗi từ chối hồ sơ: " + (err?.message || ""));
    } finally {
      setProcessingOrder(false);
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchTerm ||
      o.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.representativeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.includes(searchTerm) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.packageName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#D8B282]/35 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 dark:from-[#050C15] dark:via-[#111827] dark:to-[#0A101D] p-6 shadow-xl">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#D8B282]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B282]/15 border border-[#D8B282]/40 text-amber-800 dark:text-[#F6E1C3] text-xs font-black uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5 text-[#D8B282]" />
                <span>ViOne Platform Licensing & Subscription Engine</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Quản Trị Gói Dịch Vụ & Xét Duyệt Hồ Sơ Doanh Nghiệp
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                Cấu hình phân chia gói dịch vụ theo số lượng tài khoản (mặc định thấp nhất 30 tài khoản),
                tích hợp mã thanh toán VietQR Napas 24/7 và duyệt hồ sơ đăng ký tự động bắn email thông tin gói.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>

              <button
                type="button"
                onClick={openCreatePkgModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Tạo Gói Dịch Vụ Mới</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mt-6 border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#D8B282] text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Hồ Sơ Đăng Ký Gói Từ App ViOne</span>
              {pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-sm">
                  {pendingOrdersCount} chờ duyệt
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "packages"
                  ? "bg-[#D8B282] text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Danh Mục Gói ViOne Platform ({packages.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DANH MỤC GÓI CƯỚC */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {packages.map((pkg) => {
                const isTrial = pkg.packageType === "free_trial" || pkg.price === 0;
                const qrUrl =
                  !isTrial && pkg.price > 0
                    ? `https://img.vietqr.io/image/970422-${pkg.bankAccount || "0987654321"}-compact2.png?amount=${pkg.price}&addInfo=${encodeURIComponent(
                        `VIONE ${pkg.code}`
                      )}&accountName=${encodeURIComponent(pkg.bankAccountName || "VICONNECT")}`
                    : null;

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 relative ${
                      pkg.isActive
                        ? "border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900/90 shadow-md hover:border-[#D8B282]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 opacity-60"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isTrial
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                              : "bg-[#D8B282]/20 text-amber-800 dark:text-[#F6E1C3] border border-[#D8B282]/50"
                          }`}
                        >
                          {isTrial ? "FREE 30 NGÀY" : "GÓI CÓ PHÍ"}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            pkg.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {pkg.isActive ? "Đang phát hành" : "Tạm ẩn"}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{pkg.name}</h3>
                      <div className="text-[11px] font-mono text-amber-700 dark:text-[#D8B282] mb-3">Mã: {pkg.code}</div>

                      {/* Pricing */}
                      <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="text-2xl font-black text-amber-700 dark:text-[#F6E1C3]">
                          {isTrial ? "0 đ" : `${new Intl.NumberFormat("vi-VN").format(pkg.price)} đ`}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / {pkg.durationDays} ngày</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8B282]" />
                          <span>
                            Tối đa: <strong className="text-slate-900 dark:text-white">{pkg.maxSlots} tài khoản</strong> thành viên
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{pkg.description}</p>

                      {/* Features List */}
                      {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                        <div className="space-y-1.5 mb-4 border-t border-slate-200 dark:border-slate-800 pt-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Tính năng nổi bật:
                          </div>
                          {pkg.features.slice(0, 5).map((f, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* VietQR Preview */}
                      {qrUrl && (
                        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-center mb-4">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase flex items-center justify-center gap-1">
                            <QrCode className="w-3 h-3 text-amber-600 dark:text-[#D8B282]" />
                            <span>Mã VietQR Napas 24/7 Gói Cước</span>
                          </div>
                          <img
                            src={qrUrl}
                            alt="VietQR"
                            className="w-32 h-32 mx-auto rounded-lg bg-white p-1 shadow"
                          />
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1.5">
                            {pkg.bankName} - {pkg.bankAccount}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => openEditPkgModal(pkg)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8B282]" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePkgActive(pkg)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          pkg.isActive
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                        }`}
                      >
                        {pkg.isActive ? "Tạm ẩn" : "Kích hoạt"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DUYỆT HỒ SƠ ĐĂNG KÝ GÓI TỪ APP VIONE */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên doanh nghiệp, người đại diện, SĐT, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1">Trạng thái:</span>
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "pending", label: "Chờ duyệt" },
                  { key: "approved", label: "Đã duyệt" },
                  { key: "rejected", label: "Từ chối" },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setStatusFilter(st.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      statusFilter === st.key
                        ? "bg-[#D8B282] text-slate-950 shadow"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Hồ Sơ Đăng Ký */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <th className="py-3.5 px-4">Doanh nghiệp đăng ký</th>
                      <th className="py-3.5 px-4">Người đại diện & Liên hệ</th>
                      <th className="py-3.5 px-4">Gói cước đã chọn</th>
                      <th className="py-3.5 px-4">Số lượng tài khoản</th>
                      <th className="py-3.5 px-4">Giá tiền</th>
                      <th className="py-3.5 px-4 text-center">Trạng thái</th>
                      <th className="py-3.5 px-4">Ngày đăng ký</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <Package className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-2 opacity-50" />
                          <p className="text-sm font-medium">Chưa có hồ sơ đăng ký gói cước nào</p>
                          <p className="text-xs text-slate-500 dark:text-slate-600 mt-0.5">
                            Khi người dùng đăng ký gói tại App ViOne, hồ sơ sẽ hiển thị ngay tại đây.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPending = order.status === "pending";
                        const isApproved = order.status === "approved";
                        const isRejected = order.status === "rejected";

                        return (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">{order.companyName}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                {order.taxId && <span>MST: {order.taxId}</span>}
                                {order.industry && <span>· {order.industry}</span>}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800 dark:text-slate-200">{order.representativeName}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{order.phone}</span>
                                <span>· {order.email}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-amber-800 dark:text-[#F6E1C3] bg-[#D8B282]/20 px-2.5 py-1 rounded-md border border-[#D8B282]/40 inline-block">
                                {order.packageName}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8B282]" />
                                <span>{order.maxSlots} tài khoản</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-bold text-amber-700 dark:text-[#F6E1C3]">
                              {order.price === 0
                                ? "0 đ (Free Trial)"
                                : `${new Intl.NumberFormat("vi-VN").format(order.price)} đ`}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/50 text-amber-700 dark:text-amber-300">
                                  <Clock className="w-3 h-3" />
                                  <span>Chờ duyệt</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Đã duyệt</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/50 text-rose-700 dark:text-rose-300">
                                  <XCircle className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsOrderModalOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8B282]" />
                                  <span>Xem hồ sơ</span>
                                </button>

                                {isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOrder(order)}
                                    disabled={processingOrder}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black text-xs uppercase shadow hover:brightness-105 active:scale-95 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Duyệt</span>
                                  </button>
                                )}
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
          </div>
        )}

        {/* MODAL 1: TẠO / SỬA GÓI DỊCH VỤ */}
        {isPkgModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#D8B282]/50 bg-white dark:bg-[#0F172A] p-6 shadow-2xl space-y-5 my-8 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D8B282] flex items-center justify-center text-slate-950 font-bold">
                    <Package className="w-4 h-4 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingPkg ? `Chỉnh Sửa Gói: ${editingPkg.name}` : "Tạo Mới Gói Dịch Vụ ViOne Platform"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thiết lập số lượng người, giá tiền và thông tin thanh toán VietQR
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPkgModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePkg} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã Gói Cước (Code) *</label>
                    <input
                      type="text"
                      required
                      value={pkgCode}
                      onChange={(e) => setPkgCode(e.target.value.toUpperCase())}
                      placeholder="VD: VIONE_STARTER_30"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#D8B282] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên Gói Dịch Vụ *</label>
                    <input
                      type="text"
                      required
                      value={pkgName}
                      onChange={(e) => setPkgName(e.target.value)}
                      placeholder="VD: Gói Tiêu Chuẩn (30 Tài Khoản)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Loại Gói</label>
                    <select
                      value={pkgType}
                      onChange={(e) => {
                        const val = e.target.value as "free_trial" | "paid";
                        setPkgType(val);
                        if (val === "free_trial") setPkgPrice(0);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                    >
                      <option value="paid">Có phí (Paid)</option>
                      <option value="free_trial">Dùng thử Free (0 đ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Số Tài Khoản Tối Đa (Slots) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={pkgSlots}
                      onChange={(e) => setPkgSlots(Number(e.target.value))}
                      placeholder="Mặc định thấp nhất 30"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:border-[#D8B282] outline-none"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Mặc định tối thiểu 30 tài khoản
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Giá Tiền (VND) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      disabled={pkgType === "free_trial"}
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(Number(e.target.value))}
                      placeholder="VD: 1500000"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-amber-700 dark:text-[#F6E1C3] font-black focus:border-[#D8B282] outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Thời Hạn Sử Dụng (Ngày) *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Chu Kỳ Thanh Toán</label>
                    <select
                      value={pkgCycle}
                      onChange={(e) => setPkgCycle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                    >
                      <option value="monthly">Theo tháng (Monthly)</option>
                      <option value="quarterly">Theo quý (Quarterly)</option>
                      <option value="yearly">Theo năm (Yearly)</option>
                      <option value="trial">Dùng thử (Trial)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mô Tả Gói Dịch Vụ</label>
                  <textarea
                    rows={2}
                    value={pkgDesc}
                    onChange={(e) => setPkgDesc(e.target.value)}
                    placeholder="Mô tả quyền lợi và đối tượng doanh nghiệp phù hợp..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                  />
                </div>

                {/* Thông tin VietQR Ngân Hàng */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-amber-800 dark:text-[#F6E1C3] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-[#D8B282]" />
                    <span>Cấu Hình Nhận Thanh Toán VietQR Napas 24/7</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-[10px] mb-1">Ngân Hàng Nhận</label>
                      <input
                        type="text"
                        value={pkgBankName}
                        onChange={(e) => setPkgBankName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-[10px] mb-1">Số Tài Khoản</label>
                      <input
                        type="text"
                        value={pkgBankAccount}
                        onChange={(e) => setPkgBankAccount(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#D8B282] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-[10px] mb-1">Tên Chủ Tài Khoản</label>
                      <input
                        type="text"
                        value={pkgAccountName}
                        onChange={(e) => setPkgAccountName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Danh Sách Tính Năng (Mỗi dòng 1 tính năng)
                  </label>
                  <textarea
                    rows={3}
                    value={pkgFeatures}
                    onChange={(e) => setPkgFeatures(e.target.value)}
                    placeholder="VD:&#10;30 Tài khoản thành viên&#10;Quản lý công việc Kanban BPMN&#10;Chấm công thông minh thời gian thực"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#D8B282] outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPkgModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPkg}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingPkg ? "Đang lưu..." : editingPkg ? "Lưu Thay Đổi" : "Tạo Gói Mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: XEM HỒ SƠ ĐĂNG KÝ GÓI (NHÂN VIÊN BẤM XEM HỒ SƠ) */}
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#D8B282]/50 bg-white dark:bg-[#0F172A] p-6 shadow-2xl space-y-5 my-8 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D8B282] flex items-center justify-center text-slate-950 font-bold shadow">
                    <Building2 className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hồ Sơ Đăng Ký Gói: {selectedOrder.companyName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mã đơn: <span className="font-mono text-amber-700 dark:text-[#D8B282]">ORD-{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thông tin chi tiết */}
              <div className="space-y-4 text-xs">
                {/* Doanh nghiệp & Đại diện */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-3">
                  <div className="text-xs font-black text-amber-800 dark:text-[#F6E1C3] uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-600 dark:text-[#D8B282]" />
                    <span>Thông Tin Doanh Nghiệp Đăng Ký</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Tên doanh nghiệp:</span>
                      <strong className="text-slate-900 dark:text-white text-sm">{selectedOrder.companyName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mã số thuế:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedOrder.taxId || "Chưa cung cấp"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Người đại diện / Liên hệ:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedOrder.representativeName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Số điện thoại:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedOrder.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email nhận thông tin gói:</span>
                      <strong className="text-amber-700 dark:text-[#D8B282] font-mono">{selectedOrder.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ngành nghề:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedOrder.industry || "Doanh nghiệp dịch vụ / Thương mại"}</strong>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500 block">Địa chỉ trụ sở:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedOrder.address || "Việt Nam"}</strong>
                    </div>
                  </div>
                </div>

                {/* Gói cước đã chọn & Thanh toán */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-3">
                  <div className="text-xs font-black text-amber-800 dark:text-[#F6E1C3] uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-600 dark:text-[#D8B282]" />
                    <span>Gói Cước Đăng Ký & Thanh Toán</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Tên gói cước:</span>
                      <div className="text-sm font-black text-amber-800 dark:text-[#F6E1C3] mt-0.5">{selectedOrder.packageName}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mã: {selectedOrder.packageCode}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Số tài khoản tối đa:</span>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-600 dark:text-[#D8B282]" />
                        <span>{selectedOrder.maxSlots} tài khoản</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Cố tạo thêm sẽ bị chặn</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Số tiền thanh toán:</span>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {selectedOrder.price === 0
                          ? "0 đ (Free)"
                          : `${new Intl.NumberFormat("vi-VN").format(selectedOrder.price)} đ`}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Hình thức: {selectedOrder.paymentMethod || "VietQR"}</div>
                    </div>
                  </div>

                  {selectedOrder.paymentProofUrl && (
                    <div className="pt-2">
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">Ảnh ủy nhiệm chi / Chứng từ thanh toán:</span>
                      <img
                        src={selectedOrder.paymentProofUrl}
                        alt="Chứng từ"
                        className="max-h-48 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Trạng thái hiện tại:{" "}
                  <strong className="text-slate-900 dark:text-white uppercase">{selectedOrder.status}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {selectedOrder.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsRejectModalOpen(true)}
                        disabled={processingOrder}
                        className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-500/20 transition cursor-pointer"
                      >
                        Từ chối
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveOrder(selectedOrder)}
                        disabled={processingOrder}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{processingOrder ? "Đang xử lý..." : "Duyệt & Bắn Mail Thông Tin Gói"}</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status !== "pending" && (
                    <button
                      type="button"
                      onClick={() => setIsOrderModalOpen(false)}
                      className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: NHẬP LÝ DO TỪ CHỐI */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-white dark:bg-[#0F172A] p-5 shadow-2xl space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Từ Chối Hồ Sơ Đăng Ký Gói</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Vui lòng nhập lý do từ chối để hệ thống phản hồi tới khách hàng:
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="VD: Thông tin ủy nhiệm chi chưa khớp số tiền, vui lòng liên hệ lại..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-rose-500 outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleRejectOrder}
                  disabled={processingOrder}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {processingOrder ? "Đang xử lý..." : "Xác Nhận Từ Chối"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
