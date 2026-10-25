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
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface CompanyEmployee {
  id: string;
  communityId: string;
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
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [slotUsage, setSlotUsage] = useState<SlotUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Khối Vận Hành");

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
    }
  }, [companyId]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên nhân sự");
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
          roleTitle: roleTitle.trim() || "Chuyên viên",
          department: department.trim() || "Khối Vận Hành",
          role: "staff",
        }),
      });

      toast.success(`Đã thêm nhân sự "${fullName}" thành công!`);
      setIsModalOpen(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setRoleTitle("");
      setDepartment("Khối Vận Hành");

      // Cập nhật danh sách
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
            <span>Phân hệ Nhân sự & Đội ngũ</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1">
            Quản lý Nhân viên — {companyName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng cộng: <strong className="text-foreground">{employees.length}</strong> nhân sự thực tế trong doanh nghiệp.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Nhân Viên Mới</span>
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
          <div className="text-xs text-muted-foreground font-medium">Đang làm việc</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {employees.filter((e) => e.status === "active").length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Phòng ban hoạt động</div>
          <div className="text-2xl font-bold text-[#DFB76C] mt-1">
            {new Set(employees.map((e) => e.department).filter(Boolean)).size || 1}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Việc đang thực hiện</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {employees.reduce((acc, curr) => acc + (curr.activeTasksCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Table or Cards */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-border bg-card">
          <Clock className="w-8 h-8 mx-auto text-[#DFB76C] animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Đang tải danh sách nhân sự từ CSDL PostgreSQL...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card shadow-[var(--shadow-card)]">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h4 className="text-base font-bold text-foreground">Doanh nghiệp chưa có nhân viên nào</h4>
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
                  <th className="py-3 px-4">Chức vụ & Bộ phận</th>
                  <th className="py-3 px-4">Liên hệ</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Nhiệm vụ</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFB76C] to-[#8C653B] text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm">
                          {initials(emp.fullName)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{emp.fullName}</div>
                          <div className="text-xs text-muted-foreground">Mã: NV-{emp.id.slice(0, 6).toUpperCase()}</div>
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
                        <span className="text-xs text-muted-foreground/60 italic">Chưa cập nhật</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đang làm việc</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-500/20">
                        {emp.activeTasksCount} đầu việc
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
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
                          onClick={() => handleDeleteEmployee(emp)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Xóa nhân sự"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Thêm Nhân Viên */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#DFB76C]" />
              <span>Thêm Nhân Viên Vào Doanh Nghiệp</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Nhân viên sẽ được ghi nhận vào cơ sở dữ liệu doanh nghiệp và sẵn sàng để phân công giao việc.
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
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    placeholder="Trưởng phòng Kinh Doanh"
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
                    <option value="Phòng Marketing & Truyền Thông">Phòng Marketing & Truyền Thông</option>
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
    </div>
  );
}
