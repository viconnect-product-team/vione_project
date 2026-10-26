import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Building,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ListTodo,
  ShieldCheck,
  Shield,
  KeyRound,
  Edit,
  User,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useRole } from "@/hooks/use-role";

export interface CompanyEmployee {
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
  joinedAt: string;
  activeTasksCount: number;
  customersCount: number;
  canAssignTasks?: boolean;
  canManageMembers?: boolean;
  canManageFinance?: boolean;
  canManageDocs?: boolean;
  canManageCrm?: boolean;
  permissions?: string[];
}

export interface SlotUsage {
  plan: string;
  maxSlots: number;
  usedSlots: number;
  remainingSlots: number;
  utilizationPercent: number;
  isFull: boolean;
  expiresAt: string | null;
}

interface CompanyEmployeesTabProps {
  companyId: string;
  companyName: string;
  onAssignTask?: (employee: CompanyEmployee) => void;
}

export function CompanyEmployeesTab({
  companyId,
  companyName,
  onAssignTask,
}: CompanyEmployeesTabProps) {
  const { isQuanTri, isPlatformAdmin, isAdmin } = useRole();
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [slotUsage, setSlotUsage] = useState<SlotUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states for creating new employee
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Khối Vận Hành");
  const [selectedRole, setSelectedRole] = useState<"staff" | "manager">("staff");
  const [canAssignTasks, setCanAssignTasks] = useState(false);
  const [canManageMembers, setCanManageMembers] = useState(false);
  const [canManageFinance, setCanManageFinance] = useState(false);
  const [canManageDocs, setCanManageDocs] = useState(false);
  const [canManageCrm, setCanManageCrm] = useState(false);

  // Edit Permissions Modal states
  const [editingEmployee, setEditingEmployee] = useState<CompanyEmployee | null>(null);
  const [editRole, setEditRole] = useState<"staff" | "manager">("staff");
  const [editRoleTitle, setEditRoleTitle] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editCanAssignTasks, setEditCanAssignTasks] = useState(false);
  const [editCanManageMembers, setEditCanManageMembers] = useState(false);
  const [editCanManageFinance, setEditCanManageFinance] = useState(false);
  const [editCanManageDocs, setEditCanManageDocs] = useState(false);
  const [editCanManageCrm, setEditCanManageCrm] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [roleGroups, setRoleGroups] = useState<
    Array<{
      id: string;
      name: string;
      code: string;
      description: string;
      level: number;
      permissionIds: string[];
    }>
  >([]);
  const [selectedRoleGroupId, setSelectedRoleGroupId] = useState<string>("");
  const [editRoleGroupId, setEditRoleGroupId] = useState<string>("");

  const handleRoleChange = (newRole: "staff" | "manager") => {
    setSelectedRole(newRole);
    if (newRole === "manager") {
      setCanAssignTasks(true);
      setCanManageMembers(true);
      setCanManageDocs(true);
      setCanManageCrm(true);
      if (!roleTitle) setRoleTitle("Quản trị viên / Trưởng bộ phận");
    } else {
      setCanAssignTasks(false);
      setCanManageMembers(false);
      setCanManageFinance(false);
      setCanManageDocs(false);
      setCanManageCrm(false);
      if (roleTitle === "Quản trị viên / Trưởng bộ phận") setRoleTitle("Chuyên viên");
    }
  };

  const handleSelectRoleGroup = (groupId: string) => {
    setSelectedRoleGroupId(groupId);
    if (!groupId) return;
    const group = roleGroups.find((g) => g.id === groupId || g.code === groupId);
    if (!group) return;

    setRoleTitle(group.name);
    const isMgr =
      group.level >= 50 ||
      group.code === "manager" ||
      group.code === "admin" ||
      group.code === "owner";
    setSelectedRole(isMgr ? "manager" : "staff");

    const pIds = group.permissionIds || [];
    setCanAssignTasks(
      pIds.some((p) => p.includes("tasks") || p.includes("task.create") || p === "*") || isMgr,
    );
    setCanManageMembers(
      pIds.some((p) => p.includes("employees") || p.includes("employee.create") || p === "*") ||
        isMgr,
    );
    setCanManageFinance(pIds.some((p) => p.includes("finance") || p === "*"));
    setCanManageDocs(
      pIds.some((p) => p.includes("documents") || p.includes("document.create") || p === "*") ||
        isMgr,
    );
    setCanManageCrm(pIds.some((p) => p.includes("crm") || p === "*") || isMgr);
  };

  const handleSelectEditRoleGroup = (groupId: string) => {
    setEditRoleGroupId(groupId);
    if (!groupId) return;
    const group = roleGroups.find((g) => g.id === groupId || g.code === groupId);
    if (!group) return;

    setEditRoleTitle(group.name);
    const isMgr =
      group.level >= 50 ||
      group.code === "manager" ||
      group.code === "admin" ||
      group.code === "owner";
    setEditRole(isMgr ? "manager" : "staff");

    const pIds = group.permissionIds || [];
    setEditCanAssignTasks(
      pIds.some((p) => p.includes("tasks") || p.includes("task.create") || p === "*") || isMgr,
    );
    setEditCanManageMembers(
      pIds.some((p) => p.includes("employees") || p.includes("employee.create") || p === "*") ||
        isMgr,
    );
    setEditCanManageFinance(pIds.some((p) => p.includes("finance") || p === "*"));
    setEditCanManageDocs(
      pIds.some((p) => p.includes("documents") || p.includes("document.create") || p === "*") ||
        isMgr,
    );
    setEditCanManageCrm(pIds.some((p) => p.includes("crm") || p === "*") || isMgr);
  };

  const loadRoleGroups = async () => {
    try {
      const res = await fetchNestApi<any>(`/roles/company/${companyId}`);
      const list = Array.isArray(res) ? res : res?.roles || res?.groups || [];
      if (Array.isArray(list)) {
        setRoleGroups(list);
      }
    } catch (err) {
      console.warn("[CompanyEmployeesTab] Failed to load company role groups:", err);
    }
  };

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const [empRes, slotRes] = await Promise.all([
        fetchNestApi<CompanyEmployee[]>(`/companies/${companyId}/employees`),
        fetchNestApi<SlotUsage>(`/companies/${companyId}/slot-usage`).catch(() => null),
      ]);
      if (Array.isArray(empRes)) {
        setEmployees(empRes);
      }
      if (slotRes && slotRes.maxSlots) {
        setSlotUsage(slotRes);
      }
    } catch (err: any) {
      console.error("[CompanyEmployeesTab] Error loading employees:", err);
      toast.error("Không thể tải danh sách nhân sự: " + (err?.message || "Lỗi kết nối"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadEmployees();
      loadRoleGroups();
    }
  }, [companyId]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên nhân sự");
      return;
    }

    const max = slotUsage?.maxSlots ?? 30;
    if (employees.length >= max || slotUsage?.isFull) {
      toast.error(`Gói của bạn chỉ có thể tạo được ${max} tài khoản`);
      return;
    }

    setSubmitting(true);
    try {
      const newEmp = await fetchNestApi<CompanyEmployee>(`/companies/${companyId}/employees`, {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          roleTitle:
            roleTitle.trim() ||
            (selectedRole === "manager" ? "Quản trị viên / Trưởng bộ phận" : "Chuyên viên"),
          department: department.trim() || "Khối Vận Hành",
          role: selectedRole,
          canAssignTasks,
          canManageMembers,
          canManageFinance,
          canManageDocs,
          canManageCrm,
          permissions: (selectedRoleGroupId &&
            roleGroups.find((g) => g.id === selectedRoleGroupId)?.permissionIds) || [
            ...(canAssignTasks ? ["tasks.create", "tasks.update"] : []),
            ...(canManageMembers ? ["employees.create", "employees.update"] : []),
            ...(canManageFinance ? ["finance.view", "finance.manage"] : []),
            ...(canManageDocs ? ["documents.create", "documents.update"] : []),
            ...(canManageCrm ? ["crm.view", "crm.create"] : []),
          ],
        }),
      });

      toast.success(`Đã thêm nhân sự "${fullName}" kèm phân quyền thành công!`);
      setIsModalOpen(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setRoleTitle("");
      setDepartment("Khối Vận Hành");
      setSelectedRole("staff");
      setCanAssignTasks(false);
      setCanManageMembers(false);
      setCanManageFinance(false);
      setCanManageDocs(false);
      setCanManageCrm(false);

      if (newEmp && newEmp.id) {
        setEmployees((prev) => [...prev, newEmp]);
      } else {
        await loadEmployees();
      }
    } catch (err: any) {
      toast.error("Không thể thêm nhân viên: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (emp: CompanyEmployee) => {
    setEditingEmployee(emp);
    const isMgr = emp.role === "manager" || emp.role === "owner" || emp.role === "admin";
    setEditRole(isMgr ? "manager" : "staff");
    setEditRoleTitle(emp.roleTitle || "");
    setEditDepartment(emp.department || "Khối Vận Hành");
    setEditCanAssignTasks(Boolean(emp.canAssignTasks || isMgr));
    setEditCanManageMembers(Boolean(emp.canManageMembers || isMgr));
    setEditCanManageFinance(Boolean(emp.canManageFinance));
    setEditCanManageDocs(Boolean(emp.canManageDocs || isMgr));
    setEditCanManageCrm(Boolean(emp.canManageCrm || isMgr));
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setSavingPermissions(true);
    try {
      await fetchNestApi(`/companies/${companyId}/employees/${editingEmployee.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          role: editRole,
          roleTitle: editRoleTitle.trim() || undefined,
          department: editDepartment.trim() || undefined,
          canAssignTasks: editCanAssignTasks,
          canManageMembers: editCanManageMembers,
          canManageFinance: editCanManageFinance,
          canManageDocs: editCanManageDocs,
          canManageCrm: editCanManageCrm,
          permissions: (editRoleGroupId &&
            roleGroups.find((g) => g.id === editRoleGroupId)?.permissionIds) || [
            ...(editCanAssignTasks ? ["tasks.create", "tasks.update"] : []),
            ...(editCanManageMembers ? ["employees.create", "employees.update"] : []),
            ...(editCanManageFinance ? ["finance.view", "finance.manage"] : []),
            ...(editCanManageDocs ? ["documents.create", "documents.update"] : []),
            ...(editCanManageCrm ? ["crm.view", "crm.create"] : []),
          ],
        }),
      });

      toast.success(
        `Đã cập nhật vai trò & quyền hạn cho "${editingEmployee.fullName}" thành công!`,
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                role: editRole,
                roleTitle: editRoleTitle.trim() || emp.roleTitle,
                department: editDepartment.trim() || emp.department,
                canAssignTasks: editCanAssignTasks,
                canManageMembers: editCanManageMembers,
                canManageFinance: editCanManageFinance,
                canManageDocs: editCanManageDocs,
                canManageCrm: editCanManageCrm,
              }
            : emp,
        ),
      );
      setEditingEmployee(null);
    } catch (err: any) {
      toast.error("Không thể cập nhật phân quyền: " + (err?.message || "Lỗi hệ thống"));
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleDeleteEmployee = async (emp: CompanyEmployee) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân sự "${emp.fullName}" khỏi doanh nghiệp?`)) {
      return;
    }

    try {
      await fetchNestApi(`/companies/${companyId}/employees/${emp.id}`, {
        method: "DELETE",
      });
      toast.success(`Đã xóa nhân viên "${emp.fullName}"!`);
      setEmployees((prev) => prev.filter((item) => item.id !== emp.id));
    } catch (err: any) {
      toast.error("Không thể xóa nhân viên: " + (err?.message || "Lỗi hệ thống"));
    }
  };

  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
            <Users className="w-4 h-4 text-[#DFB76C]" />
            <span>Phân hệ Nhân sự & Phân Quyền Doanh Nghiệp</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1">
            Quản lý Đội ngũ & Phân Quyền — {companyName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng cộng: <strong className="text-foreground">{employees.length}</strong> nhân sự được
            cấp quyền trong doanh nghiệp.
          </p>
        </div>

        <button
          onClick={() => {
            const max = slotUsage?.maxSlots ?? 30;
            if (employees.length >= max || slotUsage?.isFull) {
              toast.error(`Gói của bạn chỉ có thể tạo được ${max} tài khoản`);
              return;
            }
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Nhân Viên & Phân Quyền</span>
        </button>
      </div>

      {/* Hạn Mức Slot Tài Khoản Doanh Nghiệp */}
      {slotUsage && (
        <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Hạn Mức Tài Khoản (Slots):</span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[11px]">
                {slotUsage.usedSlots} / {slotUsage.maxSlots} slots đã dùng
              </span>
              <span className="text-muted-foreground">
                ({slotUsage.remainingSlots} slots còn lại)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tỷ lệ sử dụng:</span>
              <span className="font-bold text-[#DFB76C]">{slotUsage.utilizationPercent}%</span>
              {slotUsage.isFull && (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-[10px]">
                  Đã hết slot
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                slotUsage.isFull ? "bg-rose-500" : "bg-gradient-to-r from-[#DFB76C] to-[#C29B69]"
              }`}
              style={{ width: `${slotUsage.utilizationPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Tổng nhân sự</div>
          <div className="text-2xl font-bold text-foreground mt-1">{employees.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Quản trị viên / Giao việc</div>
          <div className="text-2xl font-bold text-[#DFB76C] mt-1">
            {
              employees.filter(
                (e) => e.role === "manager" || e.role === "owner" || e.canAssignTasks,
              ).length
            }
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Nhân viên thực thi</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {
              employees.filter(
                (e) => e.role !== "manager" && e.role !== "owner" && !e.canAssignTasks,
              ).length
            }
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Việc đang thực hiện</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {employees.reduce((acc, curr) => acc + (curr.activeTasksCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Table of employees with Role Badges and Permission Chips */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-border bg-card">
          <Clock className="w-8 h-8 mx-auto text-[#DFB76C] animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">
            Đang tải danh sách nhân sự và phân quyền từ PostgreSQL...
          </p>
        </div>
      ) : employees.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card shadow-[var(--shadow-card)]">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h4 className="text-base font-bold text-foreground">
            Doanh nghiệp chưa có nhân viên nào
          </h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Thêm nhân sự đầu tiên để bắt đầu phân công nhiệm vụ và quản lý vận hành số.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm nhân sự ngay</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Nhân sự</th>
                  <th className="py-3 px-4">Vai trò & Quyền hạn</th>
                  <th className="py-3 px-4">Chức danh & Bộ phận</th>
                  <th className="py-3 px-4">Liên hệ</th>
                  <th className="py-3 px-4 text-center">Nhiệm vụ</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {employees.map((emp) => {
                  const isManager =
                    emp.role === "manager" || emp.role === "owner" || emp.role === "admin";
                  return (
                    <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFB76C] to-[#8C653B] text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {initials(emp.fullName)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{emp.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              Mã: NV-{emp.id.slice(0, 6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          {isManager ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DFB76C]/15 border border-[#DFB76C]/40 text-[#DFB76C] inline-flex items-center gap-1.5 shadow-sm">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                              <span>Quản Trị Viên (Quản lý)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-300 inline-flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>Nhân Viên Thực Thi</span>
                            </span>
                          )}

                          <div className="flex items-center gap-1 flex-wrap">
                            {emp.canAssignTasks && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                title="Được quyền giao việc cho nhân viên khác"
                              >
                                📋 Giao việc
                              </span>
                            )}
                            {emp.canManageMembers && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                title="Được quyền thêm và quản lý nhân viên"
                              >
                                👥 Nhân sự
                              </span>
                            )}
                            {emp.canManageFinance && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                title="Được quyền xem tài chính và duyệt chi"
                              >
                                💰 Tài chính
                              </span>
                            )}
                            {emp.canManageDocs && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                title="Được quyền số hóa và quản lý tài liệu"
                              >
                                📁 Tài liệu
                              </span>
                            )}
                            {emp.canManageCrm && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                title="Được quyền chăm sóc khách hàng CRM"
                              >
                                🤝 CRM
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Briefcase className="w-3.5 h-3.5 text-[#DFB76C]" />
                          <span>{emp.roleTitle || "Chuyên viên"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Building className="w-3.5 h-3.5" />
                          <span>{emp.department || "Khối Vận Hành"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {emp.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[160px]">{emp.email}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                        {!emp.email && !emp.phone && (
                          <span className="text-xs text-muted-foreground/60 italic">
                            Chưa cập nhật
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
                          {emp.activeTasksCount} đầu việc
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {onAssignTask && (
                            <button
                              onClick={() => onAssignTask(emp)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[#D8B282]/40 text-[#F6E1C3] text-xs font-medium hover:border-[#D8B282] transition-colors cursor-pointer"
                              title="Giao việc cho nhân sự này"
                            >
                              <ListTodo className="w-3.5 h-3.5 text-[#DFB76C]" />
                              <span>Giao việc</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(emp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#DFB76C] hover:bg-[#DFB76C]/10 transition-colors cursor-pointer"
                            title="Phân quyền & Chỉnh sửa vai trò"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Xóa nhân sự"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL 1: THÊM NHÂN VIÊN MỚI KÈM PHÂN QUYỀN ─────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#DFB76C]" />
              <span>Thêm Nhân Viên & Phân Quyền</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phân định vai trò rõ ràng giữa Quản trị viên (được quyền giao việc, quản trị) và Nhân
              viên thực thi.
            </p>

            <form onSubmit={handleAddEmployee} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên nhân sự <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Tuấn"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              {/* Lựa chọn Nhóm Quyền (Role Group) từ API */}
              <div className="p-3.5 rounded-xl border border-[#DFB76C]/30 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#DFB76C] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                    Nhóm Quyền Phân Bổ (API RBAC)
                  </label>
                  <span className="text-[11px] text-slate-400">Tự động nạp mẫu quyền</span>
                </div>
                <select
                  value={selectedRoleGroupId}
                  onChange={(e) => handleSelectRoleGroup(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C] cursor-pointer"
                >
                  <option value="">-- Chọn nhóm quyền từ hệ thống --</option>
                  {roleGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Cấp {g.level} • {g.permissionIds?.length || 0} quyền)
                    </option>
                  ))}
                </select>
                {selectedRoleGroupId && (
                  <p className="text-[11px] text-[#DFB76C]/90 mt-1">
                    {roleGroups.find((g) => g.id === selectedRoleGroupId)?.description ||
                      "Đã áp dụng quyền từ nhóm"}
                  </p>
                )}
              </div>

              {/* Lựa chọn vai trò cốt lõi */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#DFB76C]">
                  Vai trò trong công ty
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("staff")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedRole === "staff"
                        ? "border-[#DFB76C] bg-[#DFB76C]/10 text-white shadow-sm"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Nhân Viên Thực Thi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange("manager")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedRole === "manager"
                        ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#DFB76C] shadow-sm font-bold"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#DFB76C]" />
                    <span>Quản Trị Viên (Quản lý)</span>
                  </button>
                </div>
              </div>

              {/* Bảng phân quyền chi tiết */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#DFB76C]" />
                    Quyền hạn cụ thể được cấp:
                  </span>
                  <span className="text-[11px] text-slate-500">Bật/tắt linh hoạt</span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canAssignTasks}
                      onChange={(e) => setCanAssignTasks(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">Quyền Giao Việc Cho Nhân Sự</span>
                      <p className="text-[11px] text-slate-400">
                        Được phép tạo việc mới và phân công nhiệm vụ cho nhân viên khác
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canManageMembers}
                      onChange={(e) => setCanManageMembers(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">Quyền Quản Lý & Thêm Nhân Sự</span>
                      <p className="text-[11px] text-slate-400">
                        Được phép thêm thành viên mới, phân quyền phòng ban
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canManageFinance}
                      onChange={(e) => setCanManageFinance(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Tài Chính & Duyệt Chi Tiền
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Được phép xem thống kê doanh thu và phê duyệt tờ trình chi
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canManageDocs}
                      onChange={(e) => setCanManageDocs(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Quản Lý Tài Liệu Số Hóa
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Được phép tải lên, biên tập và phân loại tài liệu công ty
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canManageCrm}
                      onChange={(e) => setCanManageCrm(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Chăm Sóc Khách Hàng CRM
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Được xem và cập nhật thông tin khách hàng, leads tiềm năng
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email công việc
                  </label>
                  <input
                    type="email"
                    placeholder="tuan.nguyen@vione.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chức danh hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Trưởng phòng Kinh Doanh"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phòng ban
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C]"
                  >
                    <option value="Khối Vận Hành">Khối Vận Hành</option>
                    <option value="Phòng Kinh Doanh">Phòng Kinh Doanh</option>
                    <option value="Phòng Kỹ Thuật & Công Nghệ">Phòng Kỹ Thuật & Công Nghệ</option>
                    <option value="Phòng Marketing & Truyền Thông">
                      Phòng Marketing & Truyền Thông
                    </option>
                    <option value="Phòng Tài Chính - Kế Toán">Phòng Tài Chính - Kế Toán</option>
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-medium transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Đang lưu..." : "Xác nhận thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CHỈNH SỬA VAI TRÒ & PHÂN QUYỀN NHÂN SỰ ──────────────── */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DFB76C]" />
              <span>Phân Quyền Cho Nhân Sự</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Điều chỉnh vai trò và cấp quyền trực tiếp cho:{" "}
              <strong className="text-white">{editingEmployee.fullName}</strong>
            </p>

            <form onSubmit={handleSavePermissions} className="space-y-4 mt-5">
              {/* Lựa chọn Nhóm Quyền (Role Group) từ API */}
              <div className="p-3.5 rounded-xl border border-[#DFB76C]/30 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#DFB76C] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                    Đổi Nhóm Quyền Mẫu (API RBAC)
                  </label>
                  <span className="text-[11px] text-slate-400">Đồng bộ quyền tự động</span>
                </div>
                <select
                  value={editRoleGroupId}
                  onChange={(e) => handleSelectEditRoleGroup(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C] cursor-pointer"
                >
                  <option value="">-- Chọn nhóm quyền để cập nhật --</option>
                  {roleGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Cấp {g.level} • {g.permissionIds?.length || 0} quyền)
                    </option>
                  ))}
                </select>
                {editRoleGroupId && (
                  <p className="text-[11px] text-[#DFB76C]/90 mt-1">
                    {roleGroups.find((g) => g.id === editRoleGroupId)?.description ||
                      "Đã áp dụng quyền từ nhóm"}
                  </p>
                )}
              </div>

              {/* Lựa chọn vai trò */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#DFB76C]">
                  Cấp bậc / Vai trò
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditRole("staff");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      editRole === "staff"
                        ? "border-[#DFB76C] bg-[#DFB76C]/10 text-white shadow-sm"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Nhân Viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditRole("manager");
                      setEditCanAssignTasks(true);
                      setEditCanManageMembers(true);
                      setEditCanManageDocs(true);
                      setEditCanManageCrm(true);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      editRole === "manager"
                        ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#DFB76C] shadow-sm font-bold"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#DFB76C]" />
                    <span>Quản Trị Viên (Quản lý)</span>
                  </button>
                </div>
              </div>

              {/* Bảng phân quyền chi tiết */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#DFB76C]" />
                    Quyền hạn cụ thể:
                  </span>
                  <span className="text-[11px] text-slate-500">Tùy biến quyền</span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={editCanAssignTasks}
                      onChange={(e) => setEditCanAssignTasks(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">Quyền Giao Việc Cho Nhân Sự</span>
                      <p className="text-[11px] text-slate-400">
                        Cho phép tạo công việc và giao việc cho các nhân viên khác
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={editCanManageMembers}
                      onChange={(e) => setEditCanManageMembers(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">Quyền Quản Lý & Thêm Nhân Sự</span>
                      <p className="text-[11px] text-slate-400">
                        Cho phép thêm mới và phân quyền cho nhân viên
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={editCanManageFinance}
                      onChange={(e) => setEditCanManageFinance(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Tài Chính & Duyệt Chi Tiền
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Cho phép xem doanh thu và duyệt chi tiền
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={editCanManageDocs}
                      onChange={(e) => setEditCanManageDocs(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Quản Lý Tài Liệu Số Hóa
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Cho phép tải lên và phân loại tài liệu doanh nghiệp
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={editCanManageCrm}
                      onChange={(e) => setEditCanManageCrm(e.target.checked)}
                      className="w-4 h-4 accent-[#DFB76C] rounded"
                    />
                    <div>
                      <span className="font-semibold text-white">
                        Quyền Chăm Sóc Khách Hàng CRM
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Cho phép xem và cập nhật khách hàng tiềm năng
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chức danh
                  </label>
                  <input
                    type="text"
                    value={editRoleTitle}
                    onChange={(e) => setEditRoleTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-medium transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={savingPermissions}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {savingPermissions ? "Đang lưu..." : "Lưu Phân Quyền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
