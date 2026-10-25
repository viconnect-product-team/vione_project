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
} from "lucide-react";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { Card, PageHeader, Pill, StatCard } from "@/components/dashboard/PageKit";
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
}

export interface PermissionItem {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string | null;
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
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [modulesMap, setModulesMap] = useState<Record<string, PermissionItem[]>>({});
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modal tạo vai trò mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleLevel, setNewRoleLevel] = useState(3);
  const [creatingRole, setCreatingRole] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<any>("/roles/permissions-matrix");
      if (res && res.ok) {
        setRoles(res.roles || []);
        setPermissions(res.permissions || []);
        setModulesMap(res.modulesMap || {});
        setMatrix(res.matrix || {});

        if (res.roles && res.roles.length > 0 && !selectedRoleId) {
          setSelectedRoleId(res.roles[0].id);
        }
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
    } catch (err: any) {
      toast.error("Không thể lưu phân quyền: " + (err?.message || "Lỗi hệ thống"));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleCode.trim()) {
      toast.error("Vui lòng nhập tên và mã vai trò");
      return;
    }

    setCreatingRole(true);
    try {
      const res = await fetchNestApi<RoleItem>("/roles", {
        method: "POST",
        body: JSON.stringify({
          code: newRoleCode.trim().toLowerCase(),
          name: newRoleName.trim(),
          description: newRoleDesc.trim() || undefined,
          level: Number(newRoleLevel) || 4,
        }),
      });

      toast.success(`✓ Đã tạo vai trò "${res.name}" thành công!`);
      setIsCreateModalOpen(false);
      setNewRoleCode("");
      setNewRoleName("");
      setNewRoleDesc("");
      await loadData();
      if (res.id) setSelectedRoleId(res.id);
    } catch (err: any) {
      toast.error("Không thể tạo vai trò: " + (err?.message || "Lỗi hệ thống"));
    } finally {
      setCreatingRole(false);
    }
  };

  const activePermsCount = useMemo(() => {
    if (!selectedRoleId || !matrix[selectedRoleId]) return 0;
    return Object.values(matrix[selectedRoleId]).filter(Boolean).length;
  }, [matrix, selectedRoleId]);

  return (
    <PlatformShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
              <KeyRound className="w-4 h-4 text-[#DFB76C]" />
              <span>Hệ Thống Quản Trị Phân Quyền (Granular RBAC)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
              Ma Trận Phân Quyền Vai Trò
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Cấu hình quyền hạn chi tiết theo từng phân hệ chức năng cho Super Admin, Community Admin, Quản lý và Nhân sự. Dữ liệu được áp dụng tức thì vào hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-background/80 hover:bg-muted/80 text-foreground text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Thêm vai trò mới</span>
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
              <span>{saving ? "Đang lưu..." : "Lưu thay đổi ma trận"}</span>
            </button>
          </div>
        </div>

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
                    {r.memberCount} nhân sự
                  </span>
                </div>
                <h4 className={`text-sm font-bold truncate ${isSelected ? "text-[#DFB76C]" : "text-foreground"}`}>
                  {r.name}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {r.description || "Không có mô tả chi tiết."}
                </p>
              </div>
            );
          })}
        </div>

        {/* Permissions Matrix Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
          <div className="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Ma trận quyền:</span>
                <span className="text-[#DFB76C]">{selectedRole?.name}</span>
                {selectedRole?.isSystem && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    Hệ thống
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kích hoạt: <strong className="text-foreground">{activePermsCount}</strong> / {permissions.length} quyền
              </p>
            </div>

            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Tải lại</span>
            </button>
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
                        <h4 className="text-sm font-bold text-foreground">
                          {meta.label}
                        </h4>
                        <span className="text-xs text-muted-foreground font-mono">
                          ({moduleKey})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleModuleAll(moduleKey)}
                        className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1"
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
                                <span className={isChecked ? "text-foreground" : "text-muted-foreground"}>
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

      {/* Modal Tạo Vai Trò Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DFB76C]" />
              <span>Thêm Vai Trò Mới Vào Hệ Thống</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Định nghĩa vai trò người dùng để phân bổ quyền truy cập chính xác trong ma trận.
            </p>

            <form onSubmit={handleCreateRole} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mã vai trò (Code) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: project_manager, accountant"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên hiển thị vai trò <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Quản Lý Dự Án, Kế Toán Trưởng"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cấp bậc vai trò (Level 1-5)
                </label>
                <select
                  value={newRoleLevel}
                  onChange={(e) => setNewRoleLevel(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C]"
                >
                  <option value={2}>Cấp 2 - Ban Lãnh Đạo / Community Admin</option>
                  <option value={3}>Cấp 3 - Quản Lý / Trưởng Bộ Phận</option>
                  <option value={4}>Cấp 4 - Chuyên Viên / Nhân Sự</option>
                  <option value={5}>Cấp 5 - Đối Tác / Khách Hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả phạm vi quyền
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt quyền hạn của vai trò này..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={creatingRole}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 text-xs font-bold shadow hover:opacity-95 transition cursor-pointer"
                >
                  {creatingRole ? "Đang tạo..." : "Xác nhận tạo vai trò"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PlatformShell>
  );
}
