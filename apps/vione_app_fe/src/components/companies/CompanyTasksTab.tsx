import { useState, useEffect, useMemo } from "react";
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import type { CompanyEmployee } from "./CompanyEmployeesTab";
import { UserMultiSelect } from "@/components/common/UserMultiSelect";

export interface CompanyTask {
  id: string;
  communityId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  assignerName: string | null;
  priority: string;
  status: "assigned" | "in_progress" | "completed" | "cancelled" | string;
  deadline: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerRequirements: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CompanyTasksTabProps {
  companyId: string;
  companyName: string;
  initialAssignee?: CompanyEmployee | null;
}

export function CompanyTasksTab({
  companyId,
  companyName,
  initialAssignee,
}: CompanyTasksTabProps) {
  const [tasks, setTasks] = useState<CompanyTask[]>([]);
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [priority, setPriority] = useState("normal");
  const [deadline, setDeadline] = useState("Trong tuần này");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerRequirements, setCustomerRequirements] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, empRes] = await Promise.all([
        fetchNestApi<CompanyTask[]>(`/companies/${companyId}/tasks`),
        fetchNestApi<CompanyEmployee[]>(`/companies/${companyId}/employees`),
      ]);

      if (Array.isArray(tasksRes)) setTasks(tasksRes);
      if (Array.isArray(empRes)) {
        setEmployees(empRes);
        if (initialAssignee) {
          setAssigneeIds([initialAssignee.id]);
          setIsModalOpen(true);
        }
      }
    } catch (err: any) {
      console.error("[CompanyTasksTab] Load error:", err);
      toast.error("Không thể tải danh sách công việc: " + (err?.message || "Lỗi kết nối"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadData();
    }
  }, [companyId]);

  useEffect(() => {
    if (initialAssignee) {
      setAssigneeIds([initialAssignee.id]);
      setIsModalOpen(true);
    }
  }, [initialAssignee]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề nhiệm vụ");
      return;
    }

    setSubmitting(true);
    try {
      if (assigneeIds.length > 1) {
        // Giao việc hàng loạt cho nhiều người cùng lúc (Bulk dispatch)
        await fetchNestApi<any>(`/companies/${companyId}/tasks/bulk`, {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || undefined,
            assigneeIds,
            priority,
            deadline: deadline.trim() || undefined,
            customerName: customerName.trim() || undefined,
            customerPhone: customerPhone.trim() || undefined,
            customerRequirements: customerRequirements.trim() || undefined,
          }),
        });

        toast.success(`✓ Đã giao việc thành công cho ${assigneeIds.length} nhân sự cùng lúc!`);
        setIsModalOpen(false);
        await loadData();
      } else {
        const singleAssigneeId = assigneeIds[0] || undefined;
        const selectedEmp = employees.find((e) => e.id === singleAssigneeId);

        const newTask = await fetchNestApi<CompanyTask>(`/companies/${companyId}/tasks`, {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || undefined,
            assigneeId: singleAssigneeId,
            assigneeName: selectedEmp ? selectedEmp.fullName : undefined,
            priority,
            deadline: deadline.trim() || undefined,
            customerName: customerName.trim() || undefined,
            customerPhone: customerPhone.trim() || undefined,
            customerRequirements: customerRequirements.trim() || undefined,
          }),
        });

        toast.success(`✓ Đã giao việc "${title}" thành công!`);
        setIsModalOpen(false);

        if (newTask && newTask.id) {
          setTasks((prev) => [newTask, ...prev]);
        } else {
          await loadData();
        }
      }

      setTitle("");
      setDescription("");
      setDeadline("Trong tuần này");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerRequirements("");
      setAssigneeIds([]);
    } catch (err: any) {
      toast.error("Lỗi khi giao việc: " + (err?.message || "Lỗi máy chủ"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await fetchNestApi(`/companies/${companyId}/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      const statusLabels: Record<string, string> = {
        in_progress: "Đang thực hiện",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
        assigned: "Chờ xử lý",
      };
      toast.success(`Đã cập nhật trạng thái: ${statusLabels[newStatus] || newStatus}!`);
    } catch (err: any) {
      toast.error("Không thể cập nhật trạng thái: " + (err?.message || "Lỗi hệ thống"));
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(q);
        const inDesc = t.description?.toLowerCase().includes(q);
        const inAssignee = t.assigneeName?.toLowerCase().includes(q);
        const inCustomer = t.customerName?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inAssignee && !inCustomer) return false;
      }
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const priorityBadge = (p: string) => {
    switch (p) {
      case "urgent":
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "normal":
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const priorityLabel = (p: string) => {
    switch (p) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Ưu tiên cao";
      case "normal":
      case "medium":
        return "Bình thường";
      default:
        return "Thấp";
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "in_progress":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "completed":
        return "Hoàn thành";
      case "in_progress":
        return "Đang làm";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ nhận việc";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur shadow-[var(--shadow-card)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB76C]">
            <ListTodo className="w-4 h-4 text-[#DFB76C]" />
            <span>Phân hệ Điều Phối & Giao Việc</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-1">
            Giao Việc & Tiến Độ — {companyName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi phân công, deadline và trạng thái xử lý nhiệm vụ của nhân sự doanh nghiệp.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Giao Việc Mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Tổng đầu việc</div>
          <div className="text-2xl font-bold text-foreground mt-1">{tasks.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Chờ nhận việc</div>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {tasks.filter((t) => t.status === "assigned" || t.status === "todo").length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Đang triển khai</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {tasks.filter((t) => t.status === "in_progress").length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground font-medium">Đã hoàn thành</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {tasks.filter((t) => t.status === "completed").length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, nhân sự, khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#DFB76C]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#DFB76C]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="assigned">Chờ nhận việc</option>
            <option value="in_progress">Đang làm</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:border-[#DFB76C]"
          >
            <option value="all">Tất cả ưu tiên</option>
            <option value="urgent">Khẩn cấp</option>
            <option value="high">Ưu tiên cao</option>
            <option value="normal">Bình thường</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-border bg-card">
          <Clock className="w-8 h-8 mx-auto text-[#DFB76C] animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Đang tải danh sách công việc thực...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card shadow-[var(--shadow-card)]">
          <ListTodo className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h4 className="text-base font-bold text-foreground">Không tìm thấy công việc nào</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search || statusFilter !== "all"
              ? "Hãy thử thay đổi điều kiện tìm kiếm hoặc bộ lọc trạng thái."
              : "Doanh nghiệp chưa có nhiệm vụ nào được phân công. Hãy bấm nút dưới đây để tạo việc mới."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-bold text-sm shadow hover:opacity-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Giao việc ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] hover:border-[#DFB76C]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${priorityBadge(
                        task.priority
                      )}`}
                    >
                      {priorityLabel(task.priority)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge(
                        task.status
                      )}`}
                    >
                      {statusLabel(task.status)}
                    </span>
                  </div>

                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#DFB76C]" />
                    <span>Hạn: {task.deadline || "Chưa có"}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold text-foreground mt-3 leading-snug">
                  {task.title}
                </h4>

                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    {task.description}
                  </p>
                )}

                {/* Customer Info if exists */}
                {task.customerName && (
                  <div className="mt-3 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#DFB76C]" />
                      <span>Khách hàng: {task.customerName}</span>
                      {task.customerPhone && (
                        <span className="text-muted-foreground">({task.customerPhone})</span>
                      )}
                    </div>
                    {task.customerRequirements && (
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        Yêu cầu: {task.customerRequirements}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#DFB76C] to-[#8C653B] text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {(task.assigneeName?.[0] || "N").toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-foreground">{task.assigneeName || "Chưa phân công"}</div>
                    <div className="text-[10px] text-muted-foreground">Người nhận việc</div>
                  </div>
                </div>

                {/* Quick Status Toggles */}
                <div className="flex items-center gap-1">
                  {task.status !== "in_progress" && task.status !== "completed" && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "in_progress")}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-medium transition cursor-pointer"
                      title="Chuyển sang Đang làm"
                    >
                      Bắt đầu
                    </button>
                  )}
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "completed")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition cursor-pointer"
                      title="Đánh dấu hoàn thành"
                    >
                      Hoàn thành
                    </button>
                  )}
                  {task.status === "completed" && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "in_progress")}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                      title="Mở lại việc"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Giao Việc Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[#DFB76C]/30 bg-slate-950 p-6 shadow-2xl relative text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-[#DFB76C]" />
              <span>Giao Việc Cho Nhân Sự</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phân công nhiệm vụ cụ thể, theo dõi thời hạn hoàn thành và khách hàng mục tiêu.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tiêu đề nhiệm vụ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gọi điện tư vấn giải pháp chuyển đổi số cho khách hàng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả chi tiết công việc
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các yêu cầu cụ thể cần hoàn thành..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <UserMultiSelect
                    companyId={companyId}
                    value={assigneeIds}
                    onChange={(ids) => setAssigneeIds(ids)}
                    label="Nhân sự phụ trách (Hỗ trợ giao 1 hoặc giao đồng loạt nhiều người)"
                    placeholder="Tìm và chọn 1 hoặc nhiều nhân sự để giao việc..."
                    isMulti={true}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:border-[#DFB76C]"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="high">Ưu tiên cao</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="low">Thấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hạn hoàn thành (Deadline)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thứ Sáu 17:00, 24/10/2026"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              {/* Optional customer info */}
              <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/60 space-y-3">
                <div className="text-xs font-semibold text-[#DFB76C]">
                  Thông tin khách hàng gắn với công việc (Tùy chọn)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                  />
                  <input
                    type="tel"
                    placeholder="SĐT khách hàng"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nội dung nhu cầu khách hàng..."
                  value={customerRequirements}
                  onChange={(e) => setCustomerRequirements(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DFB76C]"
                />
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
                  {submitting ? "Đang giao việc..." : "Xác nhận giao việc"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
