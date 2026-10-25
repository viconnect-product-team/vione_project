import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export const Route = createFileRoute("/platform/permissions")({
  component: PlatformPermissionsPage,
});

export interface RoleItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  level: number;
  isSystem: boolean;
  memberCount: number;
  permissionIds?: string[];
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

const MODULE_LABELS: Record<string, { label: string; icon: string }> = {
  tasks: { label: "Quản lý Công việc & Tiến độ", icon: "📋" },
  attendance: { label: "Nhân sự & Điểm danh chấm công", icon: "⏰" },
  employees: { label: "Hồ sơ Nhân sự Doanh nghiệp", icon: "👥" },
  roles: { label: "Ma trận Phân quyền (RBAC)", icon: "🛡️" },
  finance: { label: "Tài chính, Dòng tiền & Duyệt chi", icon: "💰" },
  statistics: { label: "Trung tâm Thống kê Toàn diện", icon: "📊" },
  subscriptions: { label: "Quản lý Gói cước & Hạn mức Slots", icon: "🎟️" },
  settings: { label: "Cấu hình Doanh nghiệp & Hệ thống", icon: "⚙️" },
  meetings: { label: "Quản lý Cuộc họp & Lịch hẹn", icon: "🤝" },
  documents: { label: "Quản lý Tài liệu & Hợp đồng", icon: "📂" },
  news: { label: "Bản tin & Bài đăng Truyền thông", icon: "📰" },
  crm: { label: "Chăm sóc Khách hàng CRM 5.0", icon: "🎯" },
  communities: { label: "Cộng đồng ViOne Platform", icon: "🌐" },
  ai: { label: "Trợ lý AI Doanh nghiệp", icon: "✨" },
};

const ACTION_LABELS: Record<string, string> = {
  view: "Xem dữ liệu",
  create: "Tạo mới",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  assign: "Giao việc",
  approve: "Phê duyệt",
  export: "Xuất file",
};

export function PlatformPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "groups">("matrix");
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [modulesMap, setModulesMap] = useState<Record<string, PermissionItem[]>>({});
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Danh sách modules và thao tác con cho Popup phân quyền (từ API /roles/modules-actions)
  const [availableModules, setAvailableModules] = useState<ModuleActionGroup[]>([]);

  // Modal Popup Quản lý Nhóm Quyền (Tạo mới & Chỉnh sửa)
  const [roleGroupModalOpen, setRoleGroupModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    code: "",
    description: "",
    level: 3,
    selectedPermIds: [] as string[],
  });
  const [savingGroup, setSavingGroup] = useState(false);
  const [searchModuleQuery, setSearchModuleQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Tải ma trận phân quyền
      const matrixRes = await fetchNestApi<any>("/roles/permissions-matrix");
      if (matrixRes && matrixRes.ok) {
        setPermissions(matrixRes.permissions || []);
        setModulesMap(matrixRes.modulesMap || {});
        setMatrix(matrixRes.matrix || {});
      }

      // 2. Tải danh sách nhóm quyền kèm permissionIds
      const groupsRes = await fetchNestApi<any>("/roles/groups");
      if (groupsRes && groupsRes.ok) {
        setRoles(groupsRes.items || matrixRes.roles || []);
        if (groupsRes.items?.length > 0 && !selectedRoleId) {
          setSelectedRoleId(groupsRes.items[0].id);
        }
      } else if (matrixRes && matrixRes.roles) {
        setRoles(matrixRes.roles);
        if (matrixRes.roles.length > 0 && !selectedRoleId) {
          setSelectedRoleId(matrixRes.roles[0].id);
        }
      }

      // 3. Tải danh sách modules và thao tác con cho Popup
      const modRes = await fetchNestApi<any>("/roles/modules-actions");
      if (modRes && modRes.ok && Array.isArray(modRes.modules)) {
        setAvailableModules(modRes.modules);
      }
    } catch (err: any) {
      console.error("[Permissions] Error loading matrix:", err);
      toast.error("Không thể tải ma trận phân quyền: " + (err?.message || "Lỗi kết nối"));
    } finally {
      setLoading(false);
      setHasChanges(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const togglePermission = (permId: string) => {
    if (!selectedRoleId) return;
    setMatrix((prev) => {
      const roleMap = { ...(prev[selectedRoleId] || {}) };
      roleMap[permId] = !roleMap[permId];
      return {
        ...prev,
        [selectedRoleId]: roleMap,
      };
    });
    setHasChanges(true);
  };

  const toggleModuleAll = (moduleKey: string) => {
    if (!selectedRoleId || !modulesMap[moduleKey]) return;
    const modulePerms = modulesMap[moduleKey];
    const roleMap = { ...(matrix[selectedRoleId] || {}) };

    const allChecked = modulePerms.every((p) => roleMap[p.id]);
    modulePerms.forEach((p) => {
      roleMap[p.id] = !allChecked;
    });

    setMatrix((prev) => ({
      ...prev,
      [selectedRoleId]: roleMap,
    }));
    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    try {
      const roleMap = matrix[selectedRoleId] || {};
      const activePermIds = Object.keys(roleMap).filter((id) => roleMap[id]);

      await fetchNestApi(`/roles/${selectedRoleId}/permissions`, {
        method: "PUT",
        body: JSON.stringify({ permissionIds: activePermIds }),
      });

      toast.success(`✓ Đã lưu ma trận phân quyền cho vai trò "${selectedRole?.name}" thành công!`);
      setHasChanges(false);
      await loadData();
    } catch (err: any) {
      toast.error("Không thể lưu phân quyền: " + (err?.message || "Lỗi hệ thống"));
    } finally {
      setSaving(false);
    }
  };

  // Mở Popup Tạo Nhóm Quyền Mới
  const openCreateRoleGroup = () => {
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

  // Mở Popup Chỉnh Sửa Nhóm Quyền
  const openEditRoleGroup = (role: RoleItem) => {
    setEditingRole(role);
    // Lấy danh sách permissionIds từ matrix hoặc role
    const activeIds: string[] = [];
    if (matrix[role.id]) {
      Object.entries(matrix[role.id]).forEach(([pid, active]) => {
        if (active) activeIds.push(pid);
      });
    } else if (Array.isArray(role.permissionIds)) {
      activeIds.push(...role.permissionIds);
    }

    setGroupFormData({
      name: role.name,
      code: role.code,
      description: role.description || "",
      level: role.level,
      selectedPermIds: activeIds,
    });
    setRoleGroupModalOpen(true);
  };

  // Toggle permission trong Popup
  const togglePopupPerm = (permId: string) => {
    setGroupFormData((prev) => {
      const exists = prev.selectedPermIds.includes(permId);
      return {
        ...prev,
        selectedPermIds: exists
          ? prev.selectedPermIds.filter((id) => id !== permId)
          : [...prev.selectedPermIds, permId],
      };
    });
  };

  // Toggle tất cả permissions trong 1 module của Popup
  const togglePopupModule = (mod: ModuleActionGroup) => {
    const modActionIds = mod.actions.map((a) => a.id);
    const allChecked = modActionIds.every((id) => groupFormData.selectedPermIds.includes(id));

    setGroupFormData((prev) => {
      if (allChecked) {
        return {
          ...prev,
          selectedPermIds: prev.selectedPermIds.filter((id) => !modActionIds.includes(id)),
        };
      } else {
        const set = new Set([...prev.selectedPermIds, ...modActionIds]);
        return {
          ...prev,
          selectedPermIds: Array.from(set),
        };
      }
    });
  };

  // Lưu Nhóm Quyền từ Popup (Tạo mới hoặc Chỉnh sửa)
  const handleSaveRoleGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name.trim()) {
      toast.error("Vui lòng nhập tên nhóm quyền");
      return;
    }

    setSavingGroup(true);
    try {
      if (editingRole) {
        // Cập nhật
        await fetchNestApi(`/roles/groups/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: groupFormData.name.trim(),
            description: groupFormData.description.trim(),
            level: Number(groupFormData.level),
            permissionIds: groupFormData.selectedPermIds,
          }),
        });
        toast.success(`✓ Đã cập nhật nhóm quyền "${groupFormData.name}" thành công!`);
      } else {
        // Tạo mới
        await fetchNestApi(`/roles/groups`, {
          method: "POST",
          body: JSON.stringify({
            name: groupFormData.name.trim(),
            code: groupFormData.code.trim() || undefined,
            description: groupFormData.description.trim(),
            level: Number(groupFormData.level),
            permissionIds: groupFormData.selectedPermIds,
          }),
        });
        toast.success(`✓ Đã tạo mới nhóm quyền "${groupFormData.name}" thành công!`);
      }

      setRoleGroupModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error("Không thể lưu nhóm quyền: " + (err?.message || "Lỗi hệ thống"));
    } finally {
      setSavingGroup(false);
    }
  };

  // Xóa Nhóm Quyền
  const handleDeleteRoleGroup = async (role: RoleItem) => {
    if (role.isSystem) {
      toast.error("Không thể xóa vai trò hệ thống mặc định!");
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm quyền "${role.name}" không?`)) {
      return;
    }

    try {
      await fetchNestApi(`/roles/groups/${role.id}`, {
        method: "DELETE",
      });
      toast.success(`✓ Đã xóa nhóm quyền "${role.name}" thành công!`);
      if (selectedRoleId === role.id) {
        setSelectedRoleId(roles.find((r) => r.id !== role.id)?.id || "");
      }
      await loadData();
    } catch (err: any) {
      toast.error("Không thể xóa nhóm quyền: " + (err?.message || "Lỗi hệ thống"));
    }
  };

  const activePermsCount = useMemo(() => {
    if (!selectedRoleId || !matrix[selectedRoleId]) return 0;
    return Object.values(matrix[selectedRoleId]).filter(Boolean).length;
  }, [matrix, selectedRoleId]);

  const filteredModulesInPopup = useMemo(() => {
    if (!searchModuleQuery.trim()) return availableModules;
    const q = searchModuleQuery.trim().toLowerCase();
    return availableModules.filter(
      (m) =>
        m.moduleName.toLowerCase().includes(q) ||
        m.module.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.actions.some(
          (a) => a.name.toLowerCase().includes(q) || a.action.toLowerCase().includes(q),
        ),
    );
  }, [availableModules, searchModuleQuery]);

  return (
    <PlatformShell>
      <div className="space-y-6">
        {/* Header với Tabs chuyển đổi chế độ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
              <KeyRound className="w-4 h-4 text-[#DFB76C]" />
              <span>Hệ Thống Quản Trị Phân Quyền Nền Tảng ViOne (Granular RBAC 5.0)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
              Phân Quyền & Quản Lý Nhóm Quyền
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Cấu hình nhóm quyền linh hoạt, chọn thao tác chi tiết từng phân hệ cho ViConnect và
              Doanh nghiệp Platform. Áp dụng ngay lập tức trên toàn hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Tab switchers */}
            <div className="flex items-center p-1 rounded-xl bg-background/80 border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("matrix")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "matrix"
                    ? "bg-[#DFB76C] text-[#0A0703] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ma Trận Phân Quyền
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("groups")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "groups"
                    ? "bg-[#DFB76C] text-[#0A0703] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Quản Lý Nhóm Quyền
              </button>
            </div>

            <button
              onClick={openCreateRoleGroup}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-bold hover:opacity-95 shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tạo Nhóm Quyền Mới</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: MA TRẬN PHÂN QUYỀN (MATRIX VIEW) ────────────────────────── */}
        {activeTab === "matrix" && (
          <div className="space-y-6">
            {/* Roles Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {roles.map((r) => {
                const isSelected = r.id === selectedRoleId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "border-[#DFB76C] bg-[#DFB76C]/10 shadow-[var(--shadow-card)]"
                        : "border-border bg-card/60 hover:bg-card/90"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#DFB76C]" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
                      <span>Cấp {r.level}</span>
                      <span className="px-1.5 py-0.5 rounded bg-background/60 text-[10px] font-semibold text-foreground">
                        {r.memberCount} tài khoản
                      </span>
                    </div>
                    <h4
                      className={`text-sm font-bold truncate ${isSelected ? "text-[#DFB76C]" : "text-foreground"}`}
                    >
                      {r.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {r.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Matrix Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
              <div className="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>Đang cấu hình ma trận:</span>
                    <span className="text-[#DFB76C] font-extrabold">{selectedRole?.name}</span>
                    {selectedRole?.isSystem && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        Hệ thống
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Đã kích hoạt: <strong className="text-foreground">{activePermsCount}</strong> /{" "}
                    {permissions.length} quyền
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadData}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/60 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Tải lại</span>
                  </button>

                  <button
                    onClick={handleSavePermissions}
                    disabled={saving || !hasChanges}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                      hasChanges
                        ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 hover:opacity-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  Đang tải ma trận phân quyền từ cơ sở dữ liệu...
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {Object.keys(modulesMap).map((moduleKey) => {
                    const modulePerms = modulesMap[moduleKey];
                    const meta = MODULE_LABELS[moduleKey] || { label: moduleKey, icon: "📁" };
                    const roleMap = matrix[selectedRoleId] || {};
                    const allChecked = modulePerms.every((p) => roleMap[p.id]);

                    return (
                      <div key={moduleKey} className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{meta.icon}</span>
                            <h4 className="text-sm font-bold text-foreground">{meta.label}</h4>
                            <span className="text-xs text-muted-foreground font-mono">
                              ({moduleKey})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleModuleAll(moduleKey)}
                            className="text-xs text-[#DFB76C] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả phân hệ"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                          {modulePerms.map((perm) => {
                            const isChecked = Boolean(roleMap[perm.id]);
                            const actionLabel = ACTION_LABELS[perm.action] || perm.action;

                            return (
                              <div
                                key={perm.id}
                                onClick={() => togglePermission(perm.id)}
                                className={`flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer ${
                                  isChecked
                                    ? "border-[#DFB76C]/60 bg-[#DFB76C]/10 text-foreground"
                                    : "border-border/60 bg-muted/10 text-muted-foreground hover:bg-muted/30"
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-[#DFB76C]" />
                                  ) : (
                                    <Square className="w-4 h-4 text-muted-foreground/60" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-semibold flex items-center justify-between gap-1">
                                    <span
                                      className={
                                        isChecked ? "text-foreground" : "text-muted-foreground"
                                      }
                                    >
                                      {perm.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/80 font-mono text-muted-foreground shrink-0 uppercase">
                                      {perm.action}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                    {perm.description || actionLabel}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: QUẢN LÝ NHÓM QUYỀN (ROLE GROUPS CRUD) ────────────────────── */}
        {activeTab === "groups" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
              <div className="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Danh Sách Nhóm Quyền Hệ Thống ({roles.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Các nhóm quyền này được liên kết trực tiếp để gán quyền tại mục Quản lý tài
                    khoản nhân viên ViOne & Doanh nghiệp.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateRoleGroup}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-bold hover:opacity-95 shadow transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tạo Nhóm Quyền Mới</span>
                </button>
              </div>

              <div className="divide-y divide-border/60">
                {roles.map((role) => {
                  const permCount = role.permissionIds
                    ? role.permissionIds.length
                    : matrix[role.id]
                      ? Object.values(matrix[role.id]).filter(Boolean).length
                      : 0;
                  return (
                    <div
                      key={role.id}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/10 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-base font-bold text-foreground">{role.name}</h4>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {role.code}
                          </span>
                          {role.isSystem ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                              Hệ Thống Mặc Định
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                              Tùy Chỉnh
                            </span>
                          )}
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#DFB76C]/10 text-[#DFB76C] font-semibold">
                            Cấp độ: Level {role.level}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">
                          {role.description || "Chưa có mô tả chi tiết quyền hạn."}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                          <span>
                            Thành viên đang gán:{" "}
                            <strong className="text-foreground">{role.memberCount}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Quyền kích hoạt: <strong className="text-[#DFB76C]">{permCount}</strong>{" "}
                            quyền
                          </span>
                        </div>
                      </div>

                      {/* Action buttons (Tạo mới, Chỉnh sửa, Xóa - Full CRUD) */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditRoleGroup(role)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background/80 hover:bg-muted text-xs font-semibold text-foreground transition cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#DFB76C]" />
                          <span>Chỉnh Sửa</span>
                        </button>

                        {!role.isSystem && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRoleGroup(role)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Xóa</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── POPUP MODAL TẠO MỚI / CHỈNH SỬA NHÓM QUYỀN KÈM CHECKBOX THAO TÁC CON ─ */}
      {roleGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[#DFB76C]/40 bg-slate-950 shadow-2xl text-white overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] to-[#D8B282] text-slate-950 font-bold">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>
                      {editingRole ? "Chỉnh Sửa Nhóm Quyền" : "Tạo Mới Nhóm Quyền Hệ Thống"}
                    </span>
                    {editingRole && (
                      <span className="text-xs text-[#DFB76C]">({editingRole.code})</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tích chọn chức năng và các thao tác con để định hình phạm vi quyền hạn cho vai
                    trò.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRoleGroupModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Form Inputs + Modules Checkboxes */}
            <form onSubmit={handleSaveRoleGroup} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Form Thông tin cơ bản */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên Nhóm Quyền <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Chuyên Viên Kinh Doanh"
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Nhóm Quyền (Code)
                    </label>
                    <input
                      type="text"
                      disabled={!!editingRole}
                      placeholder="Tự động tạo hoặc nhập: sales_staff"
                      value={groupFormData.code}
                      onChange={(e) => setGroupFormData({ ...groupFormData, code: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cấp Bậc (Level)
                    </label>
                    <select
                      value={groupFormData.level}
                      onChange={(e) =>
                        setGroupFormData({ ...groupFormData, level: Number(e.target.value) })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-[#DFB76C]"
                    >
                      <option value={2}>Cấp 2 - Ban Lãnh Đạo / Community Admin</option>
                      <option value={3}>Cấp 3 - Quản Lý / Trưởng Bộ Phận</option>
                      <option value={4}>Cấp 4 - Chuyên Viên / Nhân Sự</option>
                      <option value={5}>Cấp 5 - Đối Tác / Khách Hàng</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mô Tả Phạm Vi Quyền Hạn
                    </label>
                    <input
                      type="text"
                      placeholder="Mô tả tóm tắt quyền hạn của nhóm quyền này trong quy trình làm việc..."
                      value={groupFormData.description}
                      onChange={(e) =>
                        setGroupFormData({ ...groupFormData, description: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                    />
                  </div>
                </div>

                {/* Danh sách chức năng & Thao tác con */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#DFB76C]" />
                        <span>Danh Sách Chức Năng & Thao Tác Con</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Đã chọn:{" "}
                        <strong className="text-[#DFB76C]">
                          {groupFormData.selectedPermIds.length}
                        </strong>{" "}
                        thao tác
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm chức năng / thao tác..."
                        value={searchModuleQuery}
                        onChange={(e) => setSearchModuleQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                      />
                    </div>
                  </div>

                  {/* Modules Cards */}
                  <div className="space-y-3">
                    {filteredModulesInPopup.map((mod) => {
                      const modActionIds = mod.actions.map((a) => a.id);
                      const isAllChecked =
                        modActionIds.length > 0 &&
                        modActionIds.every((id) => groupFormData.selectedPermIds.includes(id));
                      const checkedCount = modActionIds.filter((id) =>
                        groupFormData.selectedPermIds.includes(id),
                      ).length;
                      const meta = MODULE_LABELS[mod.module] || {
                        label: mod.moduleName,
                        icon: "📁",
                      };

                      return (
                        <div
                          key={mod.module}
                          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{meta.icon}</span>
                              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                                {mod.moduleName}
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400">
                                ({mod.module})
                              </span>
                              {checkedCount > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#DFB76C]/20 text-[#DFB76C] font-bold">
                                  {checkedCount}/{mod.actions.length}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => togglePopupModule(mod)}
                              className="text-xs text-[#DFB76C] hover:underline cursor-pointer font-semibold"
                            >
                              {isAllChecked ? "Bỏ chọn tất cả" : "Chọn tất cả thao tác"}
                            </button>
                          </div>

                          {/* Grid Checkbox Thao Tác Con */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {mod.actions.map((action) => {
                              const isChecked = groupFormData.selectedPermIds.includes(action.id);
                              return (
                                <div
                                  key={action.id}
                                  onClick={() => togglePopupPerm(action.id)}
                                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2.5 select-none ${
                                    isChecked
                                      ? "border-[#DFB76C]/60 bg-[#DFB76C]/10 text-white"
                                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {isChecked ? (
                                      <CheckSquare className="w-4 h-4 text-[#DFB76C]" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-600" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span
                                        className={`text-xs font-semibold truncate ${isChecked ? "text-white" : "text-slate-300"}`}
                                      >
                                        {action.name}
                                      </span>
                                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 font-mono text-slate-400 uppercase shrink-0">
                                        {action.action}
                                      </span>
                                    </div>
                                    <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-1">
                                      {action.description ||
                                        ACTION_LABELS[action.action] ||
                                        action.action}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Tổng thao tác đã chọn:{" "}
                  <strong className="text-white">{groupFormData.selectedPermIds.length}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRoleGroupModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={savingGroup}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-bold hover:opacity-95 shadow transition cursor-pointer"
                  >
                    {savingGroup
                      ? "Đang lưu..."
                      : editingRole
                        ? "Cập Nhật Nhóm Quyền"
                        : "Tạo Nhóm Quyền"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </PlatformShell>
  );
}
