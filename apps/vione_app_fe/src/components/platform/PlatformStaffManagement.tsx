import { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Phone,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Search,
  Pencil,
  Send,
  AlertCircle,
  FileSpreadsheet,
  MessageSquare,
  Building2,
  BadgeCheck,
  CheckSquare,
  Square,
  Lock,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useRole, notifyPermissionsUpdated } from "@/hooks/use-role";

export interface StaffAccount {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  title?: string;
  status?: string;
  companyName?: string;
  createdAt?: string;
  assignedRoles: {
    code: string;
    name: string;
    level?: number;
  }[];
}

interface PlatformRoleDef {
  code: string;
  name: string;
  department: string;
  description: string;
  color: string;
  badgeBg: string;
  border: string;
  textColor: string;
  defaultPermissions: string[];
}

const AVAILABLE_STAFF_ROLES: PlatformRoleDef[] = [
  {
    code: "platform_finance",
    name: "Kế Toán & Thống Kê Tài Chính",
    department: "Phòng Tài Chính - Kế Toán",
    description:
      "Xem dòng tiền, quản lý doanh thu nền tảng, xuất báo cáo tài chính Excel/PDF, theo dõi số liệu thanh toán.",
    color: "amber",
    badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    border: "border-amber-500/40",
    textColor: "text-amber-400",
    defaultPermissions: [
      "finance:view",
      "finance:export",
      "statistics:view_platform",
      "statistics:view_growth",
    ],
  },
  {
    code: "platform_operations",
    name: "Vận Hành & Quản Lý Tài Khoản / CSKH",
    department: "Phòng Vận Hành & CSKH",
    description:
      "Quản lý khách hàng doanh nghiệp, theo dõi mức độ hoạt động công ty, mở khóa CRM, hỗ trợ đối tác hội viên.",
    color: "blue",
    badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    border: "border-blue-500/40",
    textColor: "text-blue-400",
    defaultPermissions: [
      "companies:manage",
      "companies:monitor",
      "companies:unlock",
      "employees:manage",
      "crm:manage",
    ],
  },
  {
    code: "platform_executive",
    name: "Ban Lãnh Đạo & Điều Hành Nền Tảng",
    department: "Hội Đồng Quản Trị & Ban Giám Đốc",
    description:
      "Xem toàn bộ báo cáo tăng trưởng, phê duyệt chi tiền, duyệt đơn kích hoạt & gia hạn gói cước ViOne Platform.",
    color: "purple",
    badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    border: "border-purple-500/40",
    textColor: "text-purple-400",
    defaultPermissions: [
      "finance:approve",
      "subscriptions:approve",
      "statistics:view_platform",
      "companies:view",
    ],
  },
  {
    code: "super_admin",
    name: "Ban Quản Trị Hệ Thống (Super Admin)",
    department: "Trung Tâm Điều Hành Toàn Quyền",
    description:
      "Toàn quyền quản trị cao nhất, cấu hình ma trận phân quyền RBAC, nhật ký kiểm toán, cài đặt hệ thống.",
    color: "rose",
    badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    border: "border-rose-500/40",
    textColor: "text-rose-400",
    defaultPermissions: ["* (Toàn bộ quyền)"],
  },
];

export function PlatformStaffManagement() {
  const { isQuanTri, isAdmin } = useRole();
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [availableRoles, setAvailableRoles] = useState<PlatformRoleDef[]>(AVAILABLE_STAFF_ROLES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Modal State: Cấp tài khoản mới
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    autoPassword: true,
    roleCodes: ["platform_operations"] as string[],
    sendEmail: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Modal State: Sửa nhóm quyền
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null);
  const [editRoleCodes, setEditRoleCodes] = useState<string[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);

  // Modal State: Cấp lại mật khẩu & gửi email
  const [resendModalOpen, setResendModalOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [customResetPassword, setCustomResetPassword] = useState("");

  const loadStaffAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<any>("/roles/staff-accounts");
      if (res?.ok && Array.isArray(res.items)) {
        setStaffList(res.items);
      }

      const groupsRes = await fetchNestApi<any>("/roles/groups");
      if (groupsRes?.ok && Array.isArray(groupsRes.items)) {
        const customRoles: PlatformRoleDef[] = groupsRes.items.map((r: any) => ({
          code: r.code,
          name: r.name,
          department: `Cấp độ ${r.level}`,
          description: r.description || `Nhóm quyền ${r.name}`,
          color: "emerald",
          badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          border: "border-emerald-500/40",
          textColor: "text-emerald-400",
          defaultPermissions: [],
        }));
        const existingCodes = new Set(AVAILABLE_STAFF_ROLES.map((r) => r.code));
        const merged = [...AVAILABLE_STAFF_ROLES];
        for (const cr of customRoles) {
          if (!existingCodes.has(cr.code)) {
            merged.push(cr);
          }
        }
        setAvailableRoles(merged);
      }
    } catch (err: any) {
      toast.error("Không thể tải danh sách nhân viên ViOne: " + (err?.message || "Lỗi kết nối"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffAccounts();
  }, []);

  // Lọc danh sách nhân sự
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.fullName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.username?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterRole === "all") return true;
      return s.assignedRoles?.some((r) => r.code === filterRole);
    });
  }, [staffList, searchQuery, filterRole]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    let financeCount = 0;
    let opsCount = 0;
    let superAdminCount = 0;
    let executiveCount = 0;

    for (const s of staffList) {
      const codes = s.assignedRoles?.map((r) => r.code) || [];
      if (codes.includes("platform_finance")) financeCount++;
      if (codes.includes("platform_operations")) opsCount++;
      if (codes.includes("super_admin")) superAdminCount++;
      if (codes.includes("platform_executive")) executiveCount++;
    }

    return {
      total: staffList.length,
      financeCount,
      opsCount,
      superAdminCount,
      executiveCount,
    };
  }, [staffList]);

  // Xử lý tạo tài khoản mới
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên nhân viên");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    if (formData.roleCodes.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nhóm quyền cho nhân viên");
      return;
    }

    setSubmitting(true);
    try {
      const generatedPass = formData.autoPassword
        ? `ViOne@${Math.floor(100000 + Math.random() * 900000)}`
        : formData.password;

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        password: generatedPass,
        roleCodes: formData.roleCodes,
        sendEmail: formData.sendEmail,
      };

      const res = await fetchNestApi<any>("/roles/staff-accounts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res?.ok) {
        toast.success(`Cấp tài khoản thành công cho ${formData.fullName}!`, {
          description: res.emailSent
            ? `Đã tự động gửi email thông tin đăng nhập tới ${formData.email}`
            : "Tài khoản đã sẵn sàng trên hệ thống",
        });

        // Bắn tín hiệu reactive rerender cho toàn bộ hệ thống
        notifyPermissionsUpdated(res.userId);

        setCreateModalOpen(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          autoPassword: true,
          roleCodes: ["platform_operations"],
          sendEmail: true,
        });
        await loadStaffAccounts();
      } else {
        toast.error(res?.message || "Không thể cấp tài khoản");
      }
    } catch (err: any) {
      toast.error("Lỗi khi cấp tài khoản: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle role in create modal
  const toggleRoleCreate = (code: string) => {
    setFormData((prev) => {
      const exists = prev.roleCodes.includes(code);
      if (exists) {
        if (prev.roleCodes.length <= 1) {
          toast.warning("Nhân viên phải có ít nhất một nhóm quyền");
          return prev;
        }
        return { ...prev, roleCodes: prev.roleCodes.filter((c) => c !== code) };
      } else {
        return { ...prev, roleCodes: [...prev.roleCodes, code] };
      }
    });
  };

  // Mở modal sửa nhóm quyền
  const openEditRoles = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setEditRoleCodes(staff.assignedRoles?.map((r) => r.code) || ["platform_operations"]);
    setEditModalOpen(true);
  };

  // Toggle role in edit modal
  const toggleRoleEdit = (code: string) => {
    setEditRoleCodes((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= 1) {
          toast.warning("Nhân viên phải có ít nhất một nhóm quyền");
          return prev;
        }
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // Lưu chỉnh sửa nhóm quyền
  const handleUpdateRolesSubmit = async () => {
    if (!selectedStaff) return;
    if (editRoleCodes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một nhóm quyền");
      return;
    }

    setUpdatingRoles(true);
    try {
      const res = await fetchNestApi<any>(`/roles/staff-accounts/${selectedStaff.id}/roles`, {
        method: "PUT",
        body: JSON.stringify({ roleCodes: editRoleCodes }),
      });

      if (res?.ok) {
        toast.success(`Cập nhật nhóm quyền cho ${selectedStaff.fullName} thành công!`);

        // BẮT BUỘC: Phát tín hiệu toàn hệ thống để mọi tab đang mở của tài khoản này tự động fetch lại và re-render ngay!
        notifyPermissionsUpdated(selectedStaff.id);

        setEditModalOpen(false);
        await loadStaffAccounts();
      } else {
        toast.error(res?.message || "Không thể cập nhật phân quyền");
      }
    } catch (err: any) {
      toast.error("Lỗi cập nhật quyền: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setUpdatingRoles(false);
    }
  };

  // Mở modal cấp lại mật khẩu & gửi email
  const openResendCredentials = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setCustomResetPassword("");
    setResendModalOpen(true);
  };

  // Thực hiện cấp lại mật khẩu & gửi email
  const handleResendSubmit = async () => {
    if (!selectedStaff) return;
    setResending(true);
    try {
      const res = await fetchNestApi<any>(
        `/roles/staff-accounts/${selectedStaff.id}/resend-credentials`,
        {
          method: "POST",
          body: JSON.stringify({ password: customResetPassword || undefined }),
        },
      );

      if (res?.ok) {
        toast.success(`Đã cấp lại mật khẩu & gửi email tới ${selectedStaff.email}!`, {
          description: `Mật khẩu mới: ${res.passwordRaw}`,
        });
        setResendModalOpen(false);
      } else {
        toast.error(res?.message || "Không thể gửi email thông tin đăng nhập");
      }
    } catch (err: any) {
      toast.error("Lỗi gửi thông tin tài khoản: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner giới thiệu phân quyền & chức năng cấp tài khoản */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/40 bg-gradient-to-r from-[#050C15] via-[#111c2d] to-[#0a1424] p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-[#D8B282]/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-bold text-[#F6E1C3]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D8B282]" />
              <span>CỔNG QUẢN TRỊ NỘI BỘ VIONE — CHỈ DÀNH CẤP CHO NHÂN VIÊN VIONE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
              Cấp Tài Khoản & Phân Quyền Nhân Sự Nền Tảng ViOne
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Quản trị viên có thể cấp tài khoản với Email/Số điện thoại của nhân viên trong công
              ty. Hệ thống sẽ <strong>tự động bắn email gửi mật khẩu và liên kết CRM</strong> về hòm
              thư nhân viên. 1 tài khoản có thể{" "}
              <strong>
                vừa thuộc nhóm quyền thống kê báo cáo tài chính vừa thuộc nhóm quyền quản lý tài
                khoản
              </strong>
              . Khi thay đổi quyền hạn, giao diện tài khoản đó sẽ{" "}
              <strong>tự động rerender lại ngay lập tức</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={loadStaffAccounts}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm Mới</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] px-4 py-2.5 text-xs md:text-sm font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/20 hover:brightness-105 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Cấp Tài Khoản Nhân Viên Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Thẻ Thống Kê Nhanh */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-medium text-slate-400">Tổng Nhân Sự ViOne</div>
            <div className="text-xl font-black text-white mt-1">{stats.total} nhân viên</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Đã được cấp tài khoản CRM</div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <div className="text-[11px] font-medium text-amber-300">Nhóm Kế Toán & Tài Chính</div>
            <div className="text-xl font-black text-amber-400 mt-1">{stats.financeCount} người</div>
            <div className="text-[10px] text-amber-500/80 mt-0.5">
              Quyền xem & xuất báo cáo tài chính
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
            <div className="text-[11px] font-medium text-blue-300">Nhóm Vận Hành & CSKH</div>
            <div className="text-xl font-black text-blue-400 mt-1">{stats.opsCount} người</div>
            <div className="text-[10px] text-blue-500/80 mt-0.5">
              Quyền quản lý DN & mở khóa CRM
            </div>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
            <div className="text-[11px] font-medium text-purple-300">
              Ban Lãnh Đạo / Super Admin
            </div>
            <div className="text-xl font-black text-purple-400 mt-1">
              {stats.executiveCount + stats.superAdminCount} người
            </div>
            <div className="text-[10px] text-purple-500/80 mt-0.5">
              Toàn quyền giám sát & phê duyệt
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc và Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại nhân viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D8B282] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Lọc theo nhóm quyền:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#D8B282]"
          >
            <option value="all">Tất cả nhóm quyền ({staffList.length})</option>
            <option value="platform_finance">Kế Toán & Báo Cáo Tài Chính</option>
            <option value="platform_operations">Vận Hành & Quản Lý Tài Khoản</option>
            <option value="platform_executive">Ban Lãnh Đạo & Điều Hành</option>
            <option value="super_admin">Ban Quản Trị Hệ Thống (Super Admin)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách nhân viên ViOne */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Nhân Sự ViOne</th>
                <th className="py-3 px-4">Thông Tin Liên Hệ</th>
                <th className="py-3 px-4">Các Nhóm Quyền Được Giao</th>
                <th className="py-3 px-4">Chức Năng Khả Dụng</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs md:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#D8B282]" />
                    Đang tải danh sách nhân viên ViOne...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-500 opacity-60" />
                    Không tìm thấy nhân viên nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const roleCodes = staff.assignedRoles?.map((r) => r.code) || [];
                  const isFinance = roleCodes.includes("platform_finance");
                  const isOps = roleCodes.includes("platform_operations");
                  const isSuper = roleCodes.includes("super_admin");

                  return (
                    <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Họ tên & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D8B282]/30 to-[#8C653B]/40 font-bold text-[#F6E1C3] border border-[#D8B282]/40">
                            {staff.fullName?.charAt(0)?.toUpperCase() || "V"}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              <span>{staff.fullName}</span>
                              {isSuper && (
                                <span className="inline-block rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-black text-rose-400 border border-rose-500/30">
                                  SUPER ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {staff.title || "Nhân viên nội bộ ViOne"} ·{" "}
                              {staff.companyName || "ViOne Corporation"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <Mail className="h-3.5 w-3.5 text-[#D8B282]" />
                            <span>{staff.email || staff.username}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nhóm quyền (Hỗ trợ multi-role) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {staff.assignedRoles?.map((r) => {
                            const def = AVAILABLE_STAFF_ROLES.find((d) => d.code === r.code);
                            const badgeClass =
                              def?.badgeBg || "bg-slate-800 text-slate-300 border-slate-700";
                            return (
                              <span
                                key={r.code}
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
                              >
                                <BadgeCheck className="h-3 w-3" />
                                <span>{r.name}</span>
                              </span>
                            );
                          })}
                          {(!staff.assignedRoles || staff.assignedRoles.length === 0) && (
                            <span className="text-[11px] text-muted-foreground italic">
                              Chưa gán nhóm quyền
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Chức năng tối thiểu & chi tiết */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 text-[11px]">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <MessageSquare className="h-3 w-3" /> Nhắn tin & Trao đổi (Mặc định)
                          </span>
                          {isFinance || isSuper ? (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                              <FileSpreadsheet className="h-3 w-3" /> Xuất Báo Cáo Tài Chính
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <FileSpreadsheet className="h-3 w-3 opacity-40" /> Không quyền xuất
                              báo cáo
                            </span>
                          )}
                          {isOps || isSuper ? (
                            <span className="inline-flex items-center gap-1 text-blue-400 font-medium">
                              <Building2 className="h-3 w-3" /> Quản Lý Khách Hàng DN
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Hoạt động
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditRoles(staff)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                            title="Chỉnh sửa phân quyền nhóm"
                          >
                            <Pencil className="h-3.5 w-3.5 text-amber-400" />
                            <span>Sửa Quyền</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openResendCredentials(staff)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#D8B282]/30 bg-[#D8B282]/10 px-2.5 py-1.5 text-xs font-bold text-[#F6E1C3] hover:bg-[#D8B282]/20 transition-all cursor-pointer"
                            title="Gửi lại thông tin tài khoản qua email"
                          >
                            <Send className="h-3.5 w-3.5 text-[#D8B282]" />
                            <span>Bắn Email</span>
                          </button>
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

      {/* ── MODAL 1: CẤP TÀI KHOẢN NHÂN VIÊN MỚI ──────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#D8B282]/50 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] to-[#D8B282] text-[#050C15]">
                  <UserPlus className="h-5 w-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cấp Tài Khoản Nhân Viên ViOne Mới
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dành riêng cho nhân sự trực thuộc công ty ViOne
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs md:text-sm">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên nhân viên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email công vụ (Bắn thông tin về đây) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hung.nv@vione.vn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D8B282]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D8B282]"
                  />
                </div>
              </div>

              {/* Mật khẩu khởi tạo */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Mật khẩu khởi tạo</label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.autoPassword}
                      onChange={(e) => setFormData({ ...formData, autoPassword: e.target.checked })}
                      className="rounded border-slate-700 accent-[#D8B282]"
                    />
                    <span>Tự sinh mật khẩu an toàn ngẫu nhiên</span>
                  </label>
                </div>

                {!formData.autoPassword && (
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-white pr-10 focus:outline-none focus:border-[#D8B282]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                )}
                {formData.autoPassword && (
                  <p className="text-[11px] text-slate-400">
                    Hệ thống sẽ tự động tạo mật khẩu an toàn chuẩn ViOne và gửi vào email của nhân
                    viên.
                  </p>
                )}
              </div>

              {/* Lựa chọn Nhóm Quyền (Multi-role checkbox) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Phân bổ Nhóm Quyền Hệ Thống</span>
                    <span className="text-[11px] font-normal text-amber-300">
                      (Có thể chọn nhiều nhóm cùng lúc)
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Đã chọn: {formData.roleCodes.length} nhóm
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {availableRoles.map((role) => {
                    const isChecked = formData.roleCodes.includes(role.code);
                    return (
                      <div
                        key={role.code}
                        onClick={() => toggleRoleCreate(role.code)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? `${role.border} bg-slate-800/80 shadow-md`
                            : "border-slate-800 bg-slate-950/40 hover:border-slate-700 opacity-80"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className={`h-5 w-5 ${role.textColor}`} />
                          ) : (
                            <Square className="h-5 w-5 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs md:text-sm">
                              {role.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{role.department}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox tự động bắn email */}
              <div className="rounded-xl border border-[#D8B282]/30 bg-[#D8B282]/5 p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sendEmailCheckbox"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 accent-[#D8B282]"
                />
                <label
                  htmlFor="sendEmailCheckbox"
                  className="text-xs text-slate-200 cursor-pointer"
                >
                  <span className="font-bold text-[#F6E1C3]">
                    Tự động bắn email gửi thông tin tài khoản cho nhân viên
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Email sẽ bao gồm Tên đăng nhập, Mật khẩu khởi tạo, Danh sách các vai trò được
                    phân bổ và đường dẫn đăng nhập ViOne CRM.
                  </p>
                </label>
              </div>

              {/* Nút Submit */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] px-5 py-2.5 text-xs md:text-sm font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/20 hover:brightness-105 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Đang Xử Lý & Bắn Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Xác Nhận & Cấp Tài Khoản</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SỬA NHÓM QUYỀN CHO NHÂN VIÊN ─────────────────────────────── */}
      {editModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Chỉnh Sửa Nhóm Quyền</h3>
                <p className="text-xs text-slate-400">
                  Nhân sự: <strong>{selectedStaff.fullName}</strong> ({selectedStaff.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-amber-300">
                ⚡ <strong>Lưu ý quan trọng:</strong> 1 nhân viên có thể vừa thuộc nhóm quyền thống
                kê báo cáo tài chính vừa thuộc nhóm quyền quản lý tài khoản. Khi lưu thay đổi, giao
                diện tài khoản này sẽ tự động rerender lại ngay lập tức.
              </p>

              <div className="space-y-2">
                {availableRoles.map((role) => {
                  const isChecked = editRoleCodes.includes(role.code);
                  return (
                    <div
                      key={role.code}
                      onClick={() => toggleRoleEdit(role.code)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? `${role.border} bg-slate-800/90 shadow-md`
                          : "border-slate-800 bg-slate-950/40 hover:border-slate-700 opacity-80"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckSquare className={`h-5 w-5 ${role.textColor}`} />
                        ) : (
                          <Square className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{role.name}</span>
                          <span className="text-[10px] text-slate-400">{role.department}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{role.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={updatingRoles}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleUpdateRolesSubmit}
                  disabled={updatingRoles}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] px-5 py-2 text-xs font-bold text-[#050C15] shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  {updatingRoles ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Đang Cập Nhật...</span>
                    </>
                  ) : (
                    <span>Lưu Thay Đổi & Kích Hoạt Ngay</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: CẤP LẠI MẬT KHẨU & BẮN EMAIL ─────────────────────────────── */}
      {resendModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-[#D8B282]/50 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#D8B282]" />
                <h3 className="text-base font-bold text-white">Gửi Lại Thông Tin Đăng Nhập</h3>
              </div>
              <button
                type="button"
                onClick={() => setResendModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs md:text-sm">
              <p className="text-slate-300">
                Hệ thống sẽ cấp lại mật khẩu khởi tạo mới và{" "}
                <strong>bắn email thông tin đăng nhập trực tiếp</strong> đến địa chỉ:
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="font-bold text-white">{selectedStaff.fullName}</div>
                <div className="text-xs text-[#F6E1C3] font-mono mt-0.5">{selectedStaff.email}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mật khẩu mới (Tùy chọn, để trống sẽ tự sinh ngẫu nhiên an toàn)
                </label>
                <input
                  type="text"
                  placeholder="Để trống nếu muốn tự tạo ngẫu nhiên"
                  value={customResetPassword}
                  onChange={(e) => setCustomResetPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResendModalOpen(false)}
                  disabled={resending}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleResendSubmit}
                  disabled={resending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] px-5 py-2 text-xs font-bold text-[#050C15] shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Đang Bắn Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Xác Nhận & Bắn Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
