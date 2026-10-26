import { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Check,
  Save,
  RefreshCw,
  Plus,
  KeyRound,
  Users,
  Building2,
  Lock,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  Pencil,
  Trash2,
  X,
  Search,
  CheckCircle2,
  Sliders,
  UserCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { EmptyState } from "@/components/dashboard/StateKit";

export interface CompanyRoleItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  level: number;
  isSystem: boolean;
  companyId?: string | null;
  memberCount: number;
  permissionIds?: string[];
  createdAt?: string;
}

export interface PermissionItem {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string | null;
}

export interface ModuleActionGroup {
  module: string;
  moduleName: string;
  description: string;
  actions: {
    id: string;
    action: string;
    name: string;
    description: string;
  }[];
}

export interface CompanyEmployeePermission {
  id: string;
  communityId: string;
  userId?: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  roleTitle: string | null;
  department: string | null;
  avatarUrl: string | null;
  status: string;
  canAssignTasks?: boolean;
  canManageMembers?: boolean;
  canManageFinance?: boolean;
  canManageDocs?: boolean;
  canManageCrm?: boolean;
  permissions?: string[];
}

const MODULE_LABELS: Record<string, { label: string; icon: string }> = {
  tasks: { label: "Quản lý Công việc & Tiến độ", icon: "📋" },
  attendance: { label: "Nhân sự & Chấm công", icon: "⏰" },
  employees: { label: "Hồ sơ Nhân sự & Thành viên", icon: "👥" },
  roles: { label: "Phân quyền & Nhóm quyền", icon: "🛡️" },
  crm: { label: "Chăm sóc Khách hàng CRM", icon: "🎯" },
  finance: { label: "Tài chính & Phê duyệt chi", icon: "💰" },
  documents: { label: "Quản lý Tài liệu & Hợp đồng", icon: "📂" },
  news: { label: "Bản tin & Truyền thông", icon: "📰" },
  ai: { label: "Trợ lý AI Doanh nghiệp", icon: "✨" },
  settings: { label: "Hồ sơ & Cài đặt Doanh nghiệp", icon: "⚙️" },
};

const ACTION_LABELS: Record<string, string> = {
  view: "Xem",
  create: "Tạo",
  edit: "Sửa",
  delete: "Xóa",
  assign: "Giao việc",
  approve: "Duyệt",
  export: "Xuất file",
};

interface CompanyPermissionsTabProps {
  companyId: string;
  companyName: string;
}

export function CompanyPermissionsTab({ companyId, companyName }: CompanyPermissionsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"matrix" | "groups" | "employees">("matrix");
  const [roles, setRoles] = useState<CompanyRoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [modulesMap, setModulesMap] = useState<Record<string, PermissionItem[]>>({});
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Danh sách nhân viên kèm quyền
  const [employees, setEmployees] = useState<CompanyEmployeePermission[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Modal tạo/sửa nhóm quyền
  const [roleGroupModalOpen, setRoleGroupModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CompanyRoleItem | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    code: "",
    description: "",
    level: 4,
    selectedPermIds: [] as string[],
  });
  const [savingGroup, setSavingGroup] = useState(false);

  // Modal sửa quyền cho từng nhân viên
  const [editingEmployee, setEditingEmployee] = useState<CompanyEmployeePermission | null>(null);
  const [empRole, setEmpRole] = useState("");
  const [empRoleTitle, setEmpRoleTitle] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");
  const [empCanAssignTasks, setEmpCanAssignTasks] = useState(false);
  const [empCanManageMembers, setEmpCanManageMembers] = useState(false);
  const [empCanManageFinance, setEmpCanManageFinance] = useState(false);
  const [empCanManageDocs, setEmpCanManageDocs] = useState(false);
  const [empCanManageCrm, setEmpCanManageCrm] = useState(false);
  const [savingEmpPerms, setSavingEmpPerms] = useState(false);

  // Tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [matrixRes, rolesRes] = await Promise.all([
        fetchNestApi<any>(`/roles/company/${companyId}/matrix`).catch(() => null),
        fetchNestApi<any>(`/roles/company/${companyId}`).catch(() => null),
      ]);

      if (matrixRes && matrixRes.ok) {
        setPermissions(matrixRes.permissions || []);
        setModulesMap(matrixRes.modulesMap || {});
        setMatrix(matrixRes.matrix || {});
      }

      if (rolesRes && rolesRes.ok && Array.isArray(rolesRes.items)) {
        setRoles(rolesRes.items);
        if (rolesRes.items.length > 0 && !selectedRoleId) {
          setSelectedRoleId(rolesRes.items[0].id);
        }
      } else if (matrixRes && Array.isArray(matrixRes.roles)) {
        setRoles(matrixRes.roles);
        if (matrixRes.roles.length > 0 && !selectedRoleId) {
          setSelectedRoleId(matrixRes.roles[0].id);
        }
      }
      setHasChanges(false);
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error loading company matrix:", err);
      toast.error("Không thể tải ma trận phân quyền của doanh nghiệp");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await fetchNestApi<any>(`/roles/company/${companyId}/employees`);
      if (res && res.ok && Array.isArray(res.items)) {
        setEmployees(res.items);
      }
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error loading employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadData();
      loadEmployees();
    }
  }, [companyId]);

  // Toggle checkbox trong ma trận quyền
  const togglePermission = (roleId: string, permId: string) => {
    setMatrix((prev) => {
      const roleMap = { ...(prev[roleId] || {}) };
      roleMap[permId] = !roleMap[permId];
      return {
        ...prev,
        [roleId]: roleMap,
      };
    });
    setHasChanges(true);
  };

  // Bật/tắt tất cả quyền trong 1 module cho 1 vai trò
  const toggleModulePermissions = (roleId: string, modulePerms: PermissionItem[]) => {
    const roleMap = matrix[roleId] || {};
    const allChecked = modulePerms.every((p) => roleMap[p.id]);

    setMatrix((prev) => {
      const newRoleMap = { ...(prev[roleId] || {}) };
      modulePerms.forEach((p) => {
        newRoleMap[p.id] = !allChecked;
      });
      return {
        ...prev,
        [roleId]: newRoleMap,
      };
    });
    setHasChanges(true);
  };

  // Lưu toàn bộ ma trận phân quyền của doanh nghiệp
  const handleSaveMatrix = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      const activeRolePermIds = Object.entries(matrix[selectedRoleId] || {})
        .filter(([_, isGranted]) => Boolean(isGranted))
        .map(([permId]) => permId);

      await fetchNestApi(`/roles/company/${companyId}/${selectedRoleId}/permissions`, {
        method: "PUT",
        body: JSON.stringify({ permissionIds: activeRolePermIds }),
      });

      toast.success("✓ Đã lưu ma trận phân quyền cho vai trò thành công vào CSDL!");
      setHasChanges(false);
      await loadData();
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error saving matrix:", err);
      toast.error(err?.message || "Không thể lưu ma trận phân quyền");
    } finally {
      setSaving(false);
    }
  };

  // Mở modal tạo nhóm quyền mới cho doanh nghiệp
  const handleOpenCreateRoleModal = () => {
    setEditingRole(null);
    setGroupFormData({
      name: "",
      code: "",
      description: "",
      level: 4,
      selectedPermIds: [],
    });
    setRoleGroupModalOpen(true);
  };

  // Mở modal sửa nhóm quyền
  const handleOpenEditRoleModal = (role: CompanyRoleItem) => {
    setEditingRole(role);
    setGroupFormData({
      name: role.name,
      code: role.code,
      description: role.description || "",
      level: role.level,
      selectedPermIds: role.permissionIds || [],
    });
    setRoleGroupModalOpen(true);
  };

  // Lưu tạo / sửa nhóm quyền của doanh nghiệp
  const handleSaveRoleGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name.trim()) {
      toast.error("Vui lòng nhập tên nhóm quyền!");
      return;
    }

    setSavingGroup(true);
    try {
      if (editingRole) {
        await fetchNestApi(`/roles/company/${companyId}/groups/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: groupFormData.name.trim(),
            description: groupFormData.description.trim() || undefined,
            level: Number(groupFormData.level),
            permissionIds: groupFormData.selectedPermIds,
          }),
        });
        toast.success(`Đã cập nhật nhóm quyền "${groupFormData.name}" cho doanh nghiệp!`);
      } else {
        await fetchNestApi(`/roles/company/${companyId}/groups`, {
          method: "POST",
          body: JSON.stringify({
            name: groupFormData.name.trim(),
            code: groupFormData.code.trim() || undefined,
            description: groupFormData.description.trim() || undefined,
            level: Number(groupFormData.level),
            permissionIds: groupFormData.selectedPermIds,
          }),
        });
        toast.success(`Đã khởi tạo nhóm quyền mới "${groupFormData.name}" riêng cho doanh nghiệp!`);
      }

      setRoleGroupModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error saving role group:", err);
      toast.error(err?.message || "Không thể lưu nhóm quyền");
    } finally {
      setSavingGroup(false);
    }
  };

  // Xóa nhóm quyền của doanh nghiệp
  const handleDeleteRole = async (role: CompanyRoleItem) => {
    if (role.isSystem) {
      toast.error("Không thể xóa vai trò mặc định của hệ thống!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa nhóm quyền "${role.name}" khỏi doanh nghiệp?`)) {
      return;
    }

    try {
      await fetchNestApi(`/roles/company/${companyId}/groups/${role.id}`, {
        method: "DELETE",
      });
      toast.success(`Đã xóa nhóm quyền "${role.name}" thành công!`);
      await loadData();
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error deleting role:", err);
      toast.error(err?.message || "Không thể xóa nhóm quyền");
    }
  };

  // Mở modal sửa quyền cho nhân viên
  const handleOpenEmpPermModal = (emp: CompanyEmployeePermission) => {
    setEditingEmployee(emp);
    setEmpRole(emp.role || "company_staff");
    setEmpRoleTitle(emp.roleTitle || "");
    setEmpDepartment(emp.department || "Khối Vận Hành");
    const isMgr = emp.role === "manager" || emp.role === "company_manager" || emp.role === "company_owner";
    setEmpCanAssignTasks(Boolean(emp.canAssignTasks || isMgr));
    setEmpCanManageMembers(Boolean(emp.canManageMembers || isMgr));
    setEmpCanManageFinance(Boolean(emp.canManageFinance || emp.role === "company_owner"));
    setEmpCanManageDocs(Boolean(emp.canManageDocs || isMgr));
    setEmpCanManageCrm(Boolean(emp.canManageCrm || isMgr));
  };

  // Lưu phân quyền trực tiếp cho nhân viên
  const handleSaveEmpPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setSavingEmpPerms(true);
    try {
      const selectedRoleObj = roles.find((r) => r.code === empRole || r.id === empRole);
      const permIds = selectedRoleObj?.permissionIds || editingEmployee.permissions || [];

      await fetchNestApi(`/roles/company/${companyId}/employees/${editingEmployee.id}/permissions`, {
        method: "PUT",
        body: JSON.stringify({
          role: empRole,
          roleTitle: empRoleTitle.trim() || undefined,
          department: empDepartment.trim() || undefined,
          canAssignTasks: empCanAssignTasks,
          canManageMembers: empCanManageMembers,
          canManageFinance: empCanManageFinance,
          canManageDocs: empCanManageDocs,
          canManageCrm: empCanManageCrm,
          permissions: permIds,
        }),
      });

      toast.success(`Đã cập nhật phân quyền cho nhân viên "${editingEmployee.fullName}" thành công!`);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err: any) {
      console.error("[CompanyPermissionsTab] Error updating employee permissions:", err);
      toast.error(err?.message || "Không thể cập nhật phân quyền nhân viên");
    } finally {
      setSavingEmpPerms(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.fullName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.department?.toLowerCase().includes(q) ||
        e.roleTitle?.toLowerCase().includes(q),
    );
  }, [employees, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── HEADER PHÂN QUYỀN DOANH NGHIỆP ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-[#D8B282]">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#D8B282]" />
            <span>Phân Hệ Quản Trị Phân Quyền Riêng Biệt (Tenant Isolated RBAC)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Ma Trận & Nhóm Quyền: {companyName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Thiết lập vai trò, ma trận quyền hạn theo từng module và phân quyền độc lập cho các nhân viên thuộc doanh nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Tải Lại</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateRoleModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-bold shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tạo Nhóm Quyền Mới</span>
          </button>
        </div>
      </div>

      {/* ── SUB-TABS NAVIGATION ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("matrix")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "matrix"
              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ma Trận Phân Quyền Động</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("groups")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "groups"
              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Danh Mục Nhóm Quyền ({roles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("employees")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "employees"
              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Phân Quyền Nhân Viên ({employees.length})</span>
        </button>
      </div>

      {/* ── NỘI DUNG SUB-TAB 1: MA TRẬN PHÂN QUYỀN ────────────────────────── */}
      {activeSubTab === "matrix" && (
        <div className="space-y-4">
          {/* Thanh chọn vai trò cấu hình */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Vai Trò Cần Cấu Hình:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoleId(r.id);
                      setHasChanges(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedRoleId === r.id
                        ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{r.name}</span>
                    {r.companyId && (
                      <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-200">
                        DN
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {hasChanges && (
              <button
                type="button"
                onClick={handleSaveMatrix}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-black uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi Ma Trận"}</span>
              </button>
            )}
          </div>

          {/* Bảng ma trận các modules */}
          <div className="space-y-3">
            {Object.entries(modulesMap).map(([moduleKey, perms]) => {
              const meta = MODULE_LABELS[moduleKey] || { label: moduleKey, icon: "📁" };
              const roleMap = matrix[selectedRoleId] || {};
              const checkedCount = perms.filter((p) => roleMap[p.id]).length;

              return (
                <div
                  key={moduleKey}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{meta.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {meta.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {checkedCount} / {perms.length} quyền được cấp
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleModulePermissions(selectedRoleId, perms)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      {checkedCount === perms.length ? "Bỏ Chọn Tất Cả" : "Chọn Tất Cả"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {perms.map((p) => {
                      const isGranted = Boolean(roleMap[p.id]);
                      return (
                        <div
                          key={p.id}
                          onClick={() => togglePermission(selectedRoleId, p.id)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                            isGranted
                              ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 text-slate-900 dark:text-white"
                              : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isGranted ? (
                              <CheckSquare className="w-4 h-4 text-amber-600 dark:text-[#D8B282]" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">
                              {p.name || ACTION_LABELS[p.action] || p.action}
                            </span>
                            {p.description && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {p.description}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              * Mọi thay đổi quyền hạn được áp dụng ngay lập tức cho các nhân viên mang vai trò này trong doanh nghiệp.
            </span>
            <button
              type="button"
              onClick={handleSaveMatrix}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-black uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Đang lưu..." : "Lưu Toàn Bộ Ma Trận Phân Quyền"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── NỘI DUNG SUB-TAB 2: QUẢN LÝ NHÓM QUYỀN ───────────────────────── */}
      {activeSubTab === "groups" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {role.name}
                        </h4>
                        {role.companyId ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Tùy chỉnh DN
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        {role.code}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      Level {role.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {role.description || "Nhóm quyền vận hành thuộc doanh nghiệp"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{role.memberCount} thành viên</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-300">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{role.permissionIds?.length || 0} quyền</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditRoleModal(role)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Chỉnh Sửa</span>
                    </button>

                    {!role.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role)}
                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Xóa nhóm quyền"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NỘI DUNG SUB-TAB 3: PHÂN QUYỀN NHÂN VIÊN DOANH NGHIỆP ─────────── */}
      {activeSubTab === "employees" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhân viên theo tên, email, chức danh hoặc phòng ban..."
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          {filteredEmployees.length === 0 ? (
            <EmptyState
              title="Chưa có nhân viên nào phù hợp"
              description="Doanh nghiệp chưa có nhân viên hoặc không tìm thấy kết quả tìm kiếm."
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 font-bold">Nhân Viên</th>
                    <th className="p-3.5 font-bold">Phòng Ban / Chức Vụ</th>
                    <th className="p-3.5 font-bold">Vai Trò Hệ Thống</th>
                    <th className="p-3.5 font-bold">Quyền Trực Tiếp</th>
                    <th className="p-3.5 font-bold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEmployees.map((emp) => {
                    const roleItem = roles.find((r) => r.code === emp.role || r.id === emp.role);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                              {emp.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {emp.fullName}
                              </span>
                              <span className="text-[11px] text-slate-400 block font-mono">
                                {emp.email || "Chưa có email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {emp.roleTitle || "Chuyên viên"}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {emp.department || "Khối Vận Hành"}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-[#F6E1C3] border border-amber-500/30 inline-block">
                            {roleItem?.name || emp.role}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {emp.canAssignTasks && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/15 text-blue-700 dark:text-blue-300">
                                Giao việc
                              </span>
                            )}
                            {emp.canManageMembers && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                Nhân sự
                              </span>
                            )}
                            {emp.canManageFinance && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                Tài chính
                              </span>
                            )}
                            {emp.canManageDocs && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/15 text-purple-700 dark:text-purple-300">
                                Tài liệu
                              </span>
                            )}
                            {emp.canManageCrm && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/15 text-rose-700 dark:text-rose-300">
                                CRM
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenEmpPermModal(emp)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            Phân Quyền
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL POPUP: TẠO / SỬA NHÓM QUYỀN DOANH NGHIỆP ──────────────── */}
      {roleGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-[#D8B282]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingRole ? `Chỉnh Sửa Nhóm Quyền: ${editingRole.name}` : "Tạo Mới Nhóm Quyền Doanh Nghiệp"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRoleGroupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleGroup} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên Nhóm Quyền / Vai Trò *
                  </label>
                  <input
                    type="text"
                    required
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                    placeholder="VD: Trưởng Phòng Kinh Doanh, Kế Toán Trưởng..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cấp Độ Quản Trị (Level)
                  </label>
                  <select
                    value={groupFormData.level}
                    onChange={(e) => setGroupFormData({ ...groupFormData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                  >
                    <option value={3}>Level 3 — Ban Giám Đốc / Điều Hành Cao Cấp</option>
                    <option value={4}>Level 4 — Quản Trị Viên / Trưởng Phòng Ban</option>
                    <option value={5}>Level 5 — Chuyên Viên / Nhân Viên Thực Thi</option>
                    <option value={6}>Level 6 — Cộng Tác Viên / Thực Tập Sinh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô Tả Vai Trò
                </label>
                <textarea
                  rows={2}
                  value={groupFormData.description}
                  onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                  placeholder="Mô tả trách nhiệm và phạm vi công việc của nhóm quyền này trong doanh nghiệp..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                />
              </div>

              {/* Danh sách quyền chọn cho nhóm quyền */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phân Quyền Cho Nhóm ({groupFormData.selectedPermIds.length} quyền đã chọn)
                </label>

                <div className="max-h-60 overflow-y-auto space-y-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  {Object.entries(modulesMap).map(([modKey, perms]) => (
                    <div key={modKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-1">
                        <span>{MODULE_LABELS[modKey]?.label || modKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const pIds = perms.map((p) => p.id);
                            const hasAll = pIds.every((id) => groupFormData.selectedPermIds.includes(id));
                            setGroupFormData({
                              ...groupFormData,
                              selectedPermIds: hasAll
                                ? groupFormData.selectedPermIds.filter((id) => !pIds.includes(id))
                                : Array.from(new Set([...groupFormData.selectedPermIds, ...pIds])),
                            });
                          }}
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          Chọn/Bỏ Chọn Hết
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {perms.map((p) => {
                          const isChecked = groupFormData.selectedPermIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className="flex items-center gap-1.5 p-1.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/60 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  setGroupFormData({
                                    ...groupFormData,
                                    selectedPermIds: e.target.checked
                                      ? [...groupFormData.selectedPermIds, p.id]
                                      : groupFormData.selectedPermIds.filter((id) => id !== p.id),
                                  });
                                }}
                                className="accent-[#D8B282] rounded"
                              />
                              <span className="truncate">{p.name || p.action}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRoleGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingGroup}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-black uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
                >
                  {savingGroup ? "Đang lưu..." : editingRole ? "Cập Nhật Nhóm Quyền" : "Tạo Mới Nhóm Quyền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL POPUP: PHÂN QUYỀN TRỰC TIẾP CHO NHÂN VIÊN ───────────────── */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600 dark:text-[#D8B282]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Phân Quyền Nhân Viên: {editingEmployee.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmpPermissions} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nhóm Quyền & Vai Trò
                </label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.code}>
                      {r.name} (Level {r.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chức Vụ Hiển Thị
                  </label>
                  <input
                    type="text"
                    value={empRoleTitle}
                    onChange={(e) => setEmpRoleTitle(e.target.value)}
                    placeholder="VD: Trưởng bộ phận..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phòng Ban
                  </label>
                  <input
                    type="text"
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                    placeholder="Khối Vận Hành"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#D8B282]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quyền Hạn Trực Tiếp Của Nhân Sự
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empCanAssignTasks}
                      onChange={(e) => setEmpCanAssignTasks(e.target.checked)}
                      className="accent-[#D8B282] rounded"
                    />
                    <span>Quyền giao việc và phân công nhiệm vụ cho người khác</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empCanManageMembers}
                      onChange={(e) => setEmpCanManageMembers(e.target.checked)}
                      className="accent-[#D8B282] rounded"
                    />
                    <span>Quyền thêm mới, sửa và quản lý danh sách nhân sự</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empCanManageFinance}
                      onChange={(e) => setEmpCanManageFinance(e.target.checked)}
                      className="accent-[#D8B282] rounded"
                    />
                    <span>Quyền xem tài chính, chi phí và phê duyệt chi tiền</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empCanManageDocs}
                      onChange={(e) => setEmpCanManageDocs(e.target.checked)}
                      className="accent-[#D8B282] rounded"
                    />
                    <span>Quyền tải lên và quản lý kho tài liệu doanh nghiệp</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empCanManageCrm}
                      onChange={(e) => setEmpCanManageCrm(e.target.checked)}
                      className="accent-[#D8B282] rounded"
                    />
                    <span>Quyền quản lý khách hàng CRM và cơ hội kinh doanh</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingEmpPerms}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-black uppercase tracking-wider shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
                >
                  {savingEmpPerms ? "Đang lưu..." : "Lưu Phân Quyền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
