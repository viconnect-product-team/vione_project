// BC-Mobile — Phân hệ Giao Việc & Nhận Việc Trong Cộng Đồng Doanh Nghiệp (ViOne Executive Luxury Style)
// Chuẩn phong cách ViOne: Vàng đồng hoàng gia, text đen than chì, nền trắng ngọc trai / Champagne
// Tối ưu hóa toàn diện: Quản lý phòng ban, Import Word/Excel, Nộp báo cáo Word/Excel, Chuyển giao việc, Họp ban trực tuyến

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  User,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  Loader2,
  Check,
  Send,
  X,
  Target,
  Pencil,
  Trash2,
  FileText,
  Paperclip,
  TrendingUp,
  FileCheck,
  Layers,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Settings2,
  Lock,
  FileSpreadsheet,
  Upload,
  Download,
  Video,
  ArrowRightLeft,
  FolderPlus,
  Users,
  History,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/use-role";

export interface HandoverEntry {
  fromAssigneeName: string;
  toAssigneeName: string;
  fromDepartment?: string;
  toDepartment?: string;
  reason: string;
  note?: string;
  attachmentUrl?: string;
  transferredBy?: string;
  transferredAt: string;
}

export interface TaskItem {
  id: string;
  communityId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assignerName?: string;
  createdById?: string;
  creatorId?: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "assigned" | "in_progress" | "in_review" | "completed" | "cancelled";
  progress?: number;
  progressNote?: string;
  department?: string;
  taskType?: string;
  attachments?: string;
  reportUrl?: string;
  reportNote?: string;
  reportFileName?: string;
  reportFileType?: string;
  handoverHistory?: HandoverEntry[];
  acceptedAt: string | null;
  completedAt: string | null;
  deadline: string;
  customerName?: string;
  customerPhone?: string;
  customerContact?: string;
  customerRequirements?: string;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  color?: string;
  membersCount?: number;
}

export interface DepartmentMemberItem {
  id?: string;
  communityId: string;
  departmentId: string;
  departmentName: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  role: "lead" | "member";
  canAssign: boolean;
  canAccept: boolean;
  canReport: boolean;
  canHandover: boolean;
  canMeet: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyDepartmentPermissions {
  isExecutive: boolean;
  allowedDepartmentNames: string[];
  memberships: DepartmentMemberItem[];
}

interface Props {
  communityId: string;
  isDirector?: boolean;
  communityCreatorId?: string;
}

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { id: "dept-1", name: "Ban Giám Đốc", description: "Điều hành chiến lược & quyết sách công ty", color: "#B8860B", membersCount: 3 },
  { id: "dept-2", name: "Phòng Kinh Doanh & Bán Hàng", description: "Phát triển thị trường, khách hàng & doanh thu", color: "#2563EB", membersCount: 8 },
  { id: "dept-3", name: "Phòng Kỹ Thuật & Công Nghệ", description: "R&D, phát triển sản phẩm & chuyển đổi số", color: "#059669", membersCount: 6 },
  { id: "dept-4", name: "Phòng Kế Toán & Tài Chính", description: "Quản trị dòng tiền, hạch toán & tài chính", color: "#D97706", membersCount: 4 },
  { id: "dept-5", name: "Phòng Hành Chính & Nhân Sự", description: "Tuyển dụng, đào tạo & quản lý nhân sự", color: "#9333EA", membersCount: 4 },
  { id: "dept-6", name: "Phòng Marketing & Truyền Thông", description: "Thương hiệu & tiếp thị kết nối đối tác", color: "#E11D48", membersCount: 5 },
];

const TASK_TYPES = [
  { id: "general", label: "Nhiệm vụ chung" },
  { id: "consulting", label: "Tư vấn & Chăm sóc khách hàng CRM" },
  { id: "report", label: "Lập hồ sơ & Báo cáo số liệu" },
  { id: "project", label: "Triển khai dự án & Hợp đồng" },
  { id: "operation", label: "Vận hành & Hậu cần" },
];

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "Chưa đặt thời hạn";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const hours = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${hours}:${mins} ngày ${day}/${month}/${year}`;
    }
  } catch {}
  return dateStr;
}

function toDateTimeLocalValue(dateStr?: string): string {
  if (!dateStr) {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d.toISOString().slice(0, 16);
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    }
  } catch {}
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString().slice(0, 16);
}

export function CompanyTaskManagement({ communityId, isDirector = false, communityCreatorId }: Props) {
  const { user } = useAuth();
  const { isQuanTri, isAdmin, canAssignTask, canEditRecord, currentUser } = useRole();

  const userCanAssign = canAssignTask(communityCreatorId, isDirector);

  // Tab cấp cao: Giao việc & Điều hành vs Nhận việc (Việc của tôi)
  const [activeMode, setActiveMode] = useState<"assign" | "receive">(userCanAssign ? "assign" : "receive");

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "assigned" | "in_progress" | "in_review" | "completed">("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");

  // Danh sách phòng ban
  const [departments, setDepartments] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [newDeptManagerName, setNewDeptManagerName] = useState("");
  const [newDeptManagerUserId, setNewDeptManagerUserId] = useState("");
  const [newDeptSelectedMemberUserIds, setNewDeptSelectedMemberUserIds] = useState<string[]>([]);
  const [newDeptColor, setNewDeptColor] = useState("#DFB76C");
  const [savingDept, setSavingDept] = useState(false);

  // Jira-Style Kanban vs List view mode
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Danh sách nhân sự
  const [employees, setEmployees] = useState<any[]>([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);

  // Modal Báo cáo tiến độ & nộp File Word/Excel
  const [reportModalTask, setReportModalTask] = useState<TaskItem | null>(null);
  const [quickProgress, setQuickProgress] = useState<number>(0);
  const [quickProgressNote, setQuickProgressNote] = useState<string>("");
  const [quickReportUrl, setQuickReportUrl] = useState<string>("");
  const [reportFileWordName, setReportFileWordName] = useState<string>("");
  const [reportFileExcelName, setReportFileExcelName] = useState<string>("");
  const [savingProgress, setSavingProgress] = useState(false);
  const wordFileInputRef = useRef<HTMLInputElement | null>(null);
  const excelFileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal Chuyển giao việc (Task Handover)
  const [handoverModalTask, setHandoverModalTask] = useState<TaskItem | null>(null);
  const [handoverToAssigneeId, setHandoverToAssigneeId] = useState<string>("");
  const [handoverToAssigneeName, setHandoverToAssigneeName] = useState<string>("");
  const [handoverToDepartment, setHandoverToDepartment] = useState<string>("");
  const [handoverReason, setHandoverReason] = useState<string>("");
  const [handoverNote, setHandoverNote] = useState<string>("");
  const [submittingHandover, setSubmittingHandover] = useState<boolean>(false);

  // Modal Họp Ban Trực Tuyến 1-Chạm (Instant Meeting)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingDept, setMeetingDept] = useState("Toàn công ty");
  const [meetingTitle, setMeetingTitle] = useState("Họp giao ban điều hành khẩn cấp");
  const [activeMeetingUrl, setActiveMeetingUrl] = useState<string | null>(null);
  const [startingMeeting, setStartingMeeting] = useState(false);

  // --- PHÂN QUYỀN PHÒNG BAN VI ONE (DEPARTMENT RBAC) ---
  const [myDeptPermissions, setMyDeptPermissions] = useState<MyDepartmentPermissions | null>(null);
  const [deptPermissionsModalOpen, setDeptPermissionsModalOpen] = useState(false);
  const [departmentMembers, setDepartmentMembers] = useState<DepartmentMemberItem[]>([]);
  const [loadingDeptMembers, setLoadingDeptMembers] = useState(false);

  // Form gán quyền thành viên
  const [assignDeptId, setAssignDeptId] = useState<string>("");
  const [assignDeptName, setAssignDeptName] = useState<string>("");
  const [assignUserId, setAssignUserId] = useState<string>("");
  const [assignUserName, setAssignUserName] = useState<string>("");
  const [assignUserEmail, setAssignUserEmail] = useState<string>("");
  const [assignUserPhone, setAssignUserPhone] = useState<string>("");
  const [assignRole, setAssignRole] = useState<"lead" | "member">("member");
  const [assignCanAssign, setAssignCanAssign] = useState<boolean>(false);
  const [assignCanAccept, setAssignCanAccept] = useState<boolean>(true);
  const [assignCanReport, setAssignCanReport] = useState<boolean>(true);
  const [assignCanHandover, setAssignCanHandover] = useState<boolean>(true);
  const [assignCanMeet, setAssignCanMeet] = useState<boolean>(true);
  const [savingDeptMember, setSavingDeptMember] = useState<boolean>(false);
  const [deletingDeptMemberId, setDeletingDeptMemberId] = useState<string | null>(null);

  // Modal Import File Excel cho Người giao việc
  const [excelImportModalOpen, setExcelImportModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelPreviewTasks, setExcelPreviewTasks] = useState<any[]>([]);
  const [importingExcel, setImportingExcel] = useState(false);

  // Modal Import File Word cho Người giao việc
  const [wordImportModalOpen, setWordImportModalOpen] = useState(false);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [wordTaskTitle, setWordTaskTitle] = useState("");
  const [wordTaskDesc, setWordTaskDesc] = useState("");
  const [wordTaskDept, setWordTaskDept] = useState("Ban Giám Đốc");
  const [importingWord, setImportingWord] = useState(false);

  // Form State Tạo/Sửa việc
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    assigneeName: "Thành viên",
    department: "Phòng Kinh Doanh & Bán Hàng",
    taskType: "general",
    priority: "high" as "urgent" | "high" | "medium" | "low",
    deadline: toDateTimeLocalValue(),
    progress: 0,
    progressNote: "",
    attachments: "",
    reportUrl: "",
    reportNote: "",
    reportFileName: "",
    reportFileType: "",
    customerName: "",
    customerPhone: "",
    customerRequirements: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userCanAssign && activeMode === "assign") {
      setActiveMode("receive");
    }
  }, [userCanAssign, activeMode]);

  const loadDepartments = async () => {
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/departments`);
      if (res?.departments && Array.isArray(res.departments) && res.departments.length > 0) {
        setDepartments(res.departments);
      }
    } catch {
      // Giữ DEFAULT_DEPARTMENTS
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/employees`);
      if (res?.employees && res.employees.length > 0) {
        setEmployees(res.employees);
        if (!formData.assigneeId) {
          const first = res.employees[0];
          setFormData((prev) => ({
            ...prev,
            assigneeId: first.id || first.userId,
            assigneeName: first.fullName,
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to load community employees:", e);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/tasks`);
      if (res?.tasks && Array.isArray(res.tasks)) {
        const sorted = [...res.tasks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTasks(sorted);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyDepartmentPermissions = async () => {
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/department-permissions/my-role`);
      if (res?.success) {
        setMyDeptPermissions(res);
      }
    } catch (e) {
      console.warn("Failed to load my department permissions:", e);
    }
  };

  const loadDepartmentMembers = async () => {
    setLoadingDeptMembers(true);
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/department-members`);
      if (res?.success && Array.isArray(res.members)) {
        setDepartmentMembers(res.members);
      }
    } catch (e) {
      console.warn("Failed to load department members:", e);
    } finally {
      setLoadingDeptMembers(false);
    }
  };

  useEffect(() => {
    loadTasks();
    loadEmployees();
    loadDepartments();
    loadMyDepartmentPermissions();
  }, [communityId]);

  // Kiểm tra quyền C-Level Executive (Ban Giám Đốc / Quản trị viên tối cao)
  const isExecutive = useMemo(() => {
    if (isQuanTri || isAdmin || isDirector) return true;
    if (myDeptPermissions?.isExecutive) return true;
    return false;
  }, [isQuanTri, isAdmin, isDirector, myDeptPermissions]);

  // Hàm kiểm tra quyền thao tác trên từng phòng ban
  const checkCanOperate = (
    deptName?: string,
    action: "assign" | "accept" | "report" | "handover" | "meet" = "assign"
  ): boolean => {
    if (isExecutive) return true;
    if (!deptName) return false;
    const membership = myDeptPermissions?.memberships?.find(
      (m) => m.departmentName.trim().toLowerCase() === deptName.trim().toLowerCase()
    );
    if (!membership) return false;
    if (action === "assign") return !!membership.canAssign;
    if (action === "accept") return !!membership.canAccept;
    if (action === "report") return !!membership.canReport;
    if (action === "handover") return !!membership.canHandover;
    if (action === "meet") return !!membership.canMeet;
    return true;
  };

  // Quyền trên phòng ban đang lọc
  const isCurrentDeptAllowed = useMemo(() => {
    if (selectedDeptFilter === "all") return true;
    if (isExecutive) return true;
    return (
      checkCanOperate(selectedDeptFilter, "accept") ||
      checkCanOperate(selectedDeptFilter, "assign") ||
      checkCanOperate(selectedDeptFilter, "report")
    );
  }, [selectedDeptFilter, isExecutive, myDeptPermissions]);

  const handleOpenDeptPermissionsModal = () => {
    setDeptPermissionsModalOpen(true);
    loadDepartmentMembers();
    if (departments.length > 0) {
      setAssignDeptId(departments[0].id || departments[0].name);
      setAssignDeptName(departments[0].name);
    }
    if (employees.length > 0) {
      const firstEmp = employees[0];
      setAssignUserId(firstEmp.id || firstEmp.userId);
      setAssignUserName(firstEmp.fullName);
      setAssignUserEmail(firstEmp.email || "");
      setAssignUserPhone(firstEmp.phone || "");
    }
  };

  const handleRoleChangeInForm = (newRole: "lead" | "member") => {
    setAssignRole(newRole);
    if (newRole === "lead") {
      setAssignCanAssign(true);
      setAssignCanAccept(true);
      setAssignCanReport(true);
      setAssignCanHandover(true);
      setAssignCanMeet(true);
    } else {
      setAssignCanAssign(false);
      setAssignCanAccept(true);
      setAssignCanReport(true);
      setAssignCanHandover(true);
      setAssignCanMeet(true);
    }
  };

  const handleSaveDepartmentMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDeptId || !assignUserId) {
      toast.error("Vui lòng chọn đầy đủ phòng ban và nhân sự!");
      return;
    }
    setSavingDeptMember(true);
    try {
      const selectedDept = departments.find((d) => d.id === assignDeptId || d.name === assignDeptId);
      const selectedEmp = employees.find((emp) => (emp.id || emp.userId) === assignUserId);
      const dName = selectedDept?.name || assignDeptName;
      const uName = selectedEmp?.fullName || assignUserName || "Thành viên";

      await fetchNestApi(`/connect-app/community/${communityId}/department-members/assign`, {
        method: "POST",
        body: JSON.stringify({
          departmentId: assignDeptId,
          departmentName: dName,
          userId: assignUserId,
          userName: uName,
          userEmail: selectedEmp?.email || assignUserEmail || "",
          userPhone: selectedEmp?.phone || assignUserPhone || "",
          role: assignRole,
          canAssign: assignCanAssign,
          canAccept: assignCanAccept,
          canReport: assignCanReport,
          canHandover: assignCanHandover,
          canMeet: assignCanMeet,
        }),
      });

      toast.success(`✓ Đã phân quyền thành công cho "${uName}" trong "${dName}"!`);
      loadDepartmentMembers();
      loadDepartments();
      loadMyDepartmentPermissions();
    } catch (err: any) {
      toast.error(err?.message || "Không thể lưu phân quyền phòng ban!");
    } finally {
      setSavingDeptMember(false);
    }
  };

  const handleDeleteDepartmentMember = async (departmentId: string, memberUserId: string, memberName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn gỡ quyền của ${memberName} khỏi phòng ban này?`)) return;
    setDeletingDeptMemberId(memberUserId);
    try {
      await fetchNestApi(`/connect-app/community/${communityId}/department-members/${departmentId}/${memberUserId}`, {
        method: "DELETE",
      });
      toast.success(`✓ Đã gỡ thành viên ${memberName} khỏi phòng ban!`);
      loadDepartmentMembers();
      loadDepartments();
      loadMyDepartmentPermissions();
    } catch {
      toast.error("Không thể gỡ thành viên khỏi phòng ban. Vui lòng thử lại!");
    } finally {
      setDeletingDeptMemberId(null);
    }
  };

  // Lọc tác vụ
  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (activeMode === "receive") {
      const currentUserId = user?.id || (currentUser as any)?.id;
      const currentUserName = user?.name || (currentUser as any)?.name;
      list = list.filter((t) => {
        if (currentUserId && (t.assigneeId === currentUserId || t.assigneeId === (user as any)?.userId)) return true;
        if (currentUserName && t.assigneeName && t.assigneeName.toLowerCase().includes(currentUserName.toLowerCase())) return true;
        return false;
      });
    }
    if (filter !== "all") {
      list = list.filter((t) => t.status === filter);
    }
    if (selectedDeptFilter !== "all") {
      list = list.filter((t) => (t.department || "").toLowerCase().includes(selectedDeptFilter.toLowerCase()));
    }
    return list;
  }, [tasks, activeMode, filter, selectedDeptFilter, user, currentUser]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = tasks.length;
    const assigned = tasks.filter((t) => t.status === "assigned").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const inReview = tasks.filter((t) => t.status === "in_review").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total, assigned, inProgress, inReview, completed };
  }, [tasks]);

  // ==========================================
  // --- TẠO PHÒNG BAN MỚI & GÁN THÀNH VIÊN ---
  // ==========================================
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      toast.error("Vui lòng nhập tên phòng ban!");
      return;
    }
    setSavingDept(true);
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/departments`, {
        method: "POST",
        body: JSON.stringify({
          name: newDeptName.trim(),
          description: newDeptDesc.trim(),
          managerName: newDeptManagerName.trim(),
          color: newDeptColor,
          membersCount: 1 + newDeptSelectedMemberUserIds.length,
        }),
      });

      const createdDeptId =
        res?.department?.id ||
        res?.departments?.find((d: any) => d.name === newDeptName.trim())?.id ||
        `dept-${Date.now()}`;

      // 1. Nếu có chọn Trưởng ban, gán quyền lead vào phòng ban
      if (newDeptManagerUserId) {
        const mgr = employees.find(
          (emp) => emp.id === newDeptManagerUserId || emp.userId === newDeptManagerUserId
        );
        await fetchNestApi(`/connect-app/community/${communityId}/department-members/assign`, {
          method: "POST",
          body: JSON.stringify({
            departmentId: createdDeptId,
            departmentName: newDeptName.trim(),
            userId: newDeptManagerUserId,
            userName: mgr?.fullName || newDeptManagerName,
            userEmail: mgr?.email || "",
            userPhone: mgr?.phone || "",
            role: "lead",
            canAssign: true,
            canAccept: true,
            canReport: true,
            canHandover: true,
            canMeet: true,
          }),
        }).catch(() => {});
      }

      // 2. Gán các thành viên cộng đồng đã chọn vào phòng ban mới
      for (const mId of newDeptSelectedMemberUserIds) {
        if (mId === newDeptManagerUserId) continue;
        const memberEmp = employees.find((emp) => emp.id === mId || emp.userId === mId);
        await fetchNestApi(`/connect-app/community/${communityId}/department-members/assign`, {
          method: "POST",
          body: JSON.stringify({
            departmentId: createdDeptId,
            departmentName: newDeptName.trim(),
            userId: mId,
            userName: memberEmp?.fullName || "Thành viên",
            userEmail: memberEmp?.email || "",
            userPhone: memberEmp?.phone || "",
            role: "member",
            canAssign: false,
            canAccept: true,
            canReport: true,
            canHandover: true,
            canMeet: true,
          }),
        }).catch(() => {});
      }

      if (res?.departments) {
        setDepartments(res.departments);
      } else {
        loadDepartments();
      }
      loadDepartmentMembers();
      loadMyDepartmentPermissions();
      toast.success(`✓ Đã tạo phòng ban "${newDeptName}" và gán thành viên thành công!`);
      setNewDeptName("");
      setNewDeptDesc("");
      setNewDeptManagerName("");
      setNewDeptManagerUserId("");
      setNewDeptSelectedMemberUserIds([]);
      setDeptModalOpen(false);
    } catch {
      toast.error("Không thể tạo phòng ban. Vui lòng kiểm tra quyền hạn!");
    } finally {
      setSavingDept(false);
    }
  };

  // Cập nhật trạng thái tiến độ công việc chuẩn Jira
  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: "assigned" | "in_progress" | "in_review" | "completed"
  ) => {
    try {
      const target = tasks.find((t) => t.id === taskId);
      if (!target) return;

      const payload: any = {
        status: newStatus,
        progress:
          newStatus === "completed"
            ? 100
            : newStatus === "in_review"
            ? 85
            : newStatus === "in_progress" && (target.progress || 0) < 30
            ? 30
            : target.progress || 0,
        completedAt: newStatus === "completed" ? new Date().toISOString() : target.completedAt,
      };

      await fetchNestApi(`/connect-app/community/${communityId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...payload } : t))
      );

      const statusLabels: Record<string, string> = {
        assigned: "Chờ thực hiện",
        in_progress: "Đang thực hiện",
        in_review: "Chờ nghiệm thu",
        completed: "Đã hoàn thành",
      };

      toast.success(`✓ Đã cập nhật sang: ${statusLabels[newStatus] || newStatus}`);
    } catch {
      toast.error("Không thể cập nhật trạng thái công việc. Vui lòng thử lại!");
    }
  };

  // ==========================================
  // --- HỌP BAN TRỰC TUYẾN 1-CHẠM ---
  // ==========================================
  const handleStartInstantMeeting = async () => {
    setStartingMeeting(true);
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/instant-meeting`, {
        method: "POST",
        body: JSON.stringify({
          departmentName: meetingDept,
          roomTitle: meetingTitle,
        }),
      });
      const roomUrl =
        res?.meetingUrl ||
        `https://meet.jit.si/vione-${communityId.replace(/-/g, "").slice(0, 8)}-${Date.now()}`;
      setActiveMeetingUrl(roomUrl);
      toast.success(
        `✓ Đã kích hoạt phòng họp trực tuyến và phát thông báo triệu tập khẩn cấp tới ${meetingDept}!`
      );
    } catch {
      toast.error("Không thể kích hoạt cuộc họp. Vui lòng thử lại!");
    } finally {
      setStartingMeeting(false);
    }
  };

  // ==========================================
  // --- IMPORT FILE EXCEL CHO NGƯỜI GIAO VIỆC ---
  // ==========================================
  const handleDownloadExcelTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      "Tiêu đề công việc,Mô tả công việc,Người nhận việc,Phòng ban,Hạn chót,Mức độ ưu tiên\n" +
      "Tư vấn triển khai CRM cho Tập đoàn Alpha,Khảo sát quy trình và báo cáo ban giám đốc,Nguyễn Văn A,Phòng Kinh Doanh & Bán Hàng,Ngày mai 17:30,high\n" +
      "Nghiệm thu phần mềm chuyển đổi số,Kiểm tra chức năng họp trực tuyến và báo cáo,Trần Thị B,Phòng Kỹ Thuật & Công Nghệ,2026-10-20 18:00,urgent\n" +
      "Lập báo cáo tài chính quý IV,Đối soát thu chi theo biên bản hợp đồng,Lê Văn C,Phòng Kế Toán & Tài Chính,2026-10-25 17:00,medium\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ViOne_Mau_Giao_Viec.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("✓ Đã tải file mẫu bảng tính ViOne thành công!");
  };

  const handleSelectExcelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);

    // Đọc parse file CSV hoặc preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("File không có dữ liệu!");
        return;
      }
      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.replace(/["\r]/g, "").trim());
        if (cols[0]) {
          parsed.push({
            title: cols[0],
            description: cols[1] || "",
            assigneeName: cols[2] || (employees[0]?.fullName || "Nhân sự"),
            department: cols[3] || "Phòng Kinh Doanh & Bán Hàng",
            deadline: cols[4] || "Hôm nay 18:00",
            priority: (cols[5] as any) || "high",
          });
        }
      }
      setExcelPreviewTasks(parsed);
      toast.success(`✓ Đã nạp ${parsed.length} dòng công việc từ file! Vui lòng kiểm tra và xác nhận.`);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleConfirmImportExcel = async () => {
    if (!excelPreviewTasks || excelPreviewTasks.length === 0) {
      toast.error("Chưa có danh sách công việc để nạp!");
      return;
    }
    setImportingExcel(true);
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/tasks/import-excel`, {
        method: "POST",
        body: JSON.stringify({ tasks: excelPreviewTasks }),
      });
      toast.success(res?.message || `✓ Đã import thành công ${excelPreviewTasks.length} công việc từ tệp Excel!`);
      setExcelImportModalOpen(false);
      setExcelFile(null);
      setExcelPreviewTasks([]);
      loadTasks();
    } catch {
      toast.error("Không thể nạp công việc từ Excel. Vui lòng thử lại!");
    } finally {
      setImportingExcel(false);
    }
  };

  // ==========================================
  // --- IMPORT FILE WORD CHO NGƯỜI GIAO VIỆC ---
  // ==========================================
  const handleSelectWordFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWordFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    setWordTaskTitle(`[Đề cương] ${cleanName}`);
    setWordTaskDesc(`Nhiệm vụ trích xuất từ tài liệu Word đính kèm: "${file.name}" (Dung lượng: ${(file.size / 1024).toFixed(1)} KB). Yêu cầu nghiên cứu và thực hiện đúng tiến độ.`);
    toast.success(`✓ Đã nạp file Word: "${file.name}". Vui lòng phân công nhân sự và giao việc!`);
  };

  const handleConfirmImportWord = async () => {
    if (!wordTaskTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề nhiệm vụ!");
      return;
    }
    setImportingWord(true);
    try {
      const defaultEmp = employees[0];
      await fetchNestApi<any>(`/connect-app/community/${communityId}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title: wordTaskTitle.trim(),
          description: wordTaskDesc.trim(),
          assigneeId: defaultEmp ? defaultEmp.id || defaultEmp.userId : "emp-vione",
          assigneeName: defaultEmp ? defaultEmp.fullName : "Thành viên",
          department: wordTaskDept,
          priority: "high",
          deadline: toDateTimeLocalValue(),
          attachments: wordFile ? `file://word/${encodeURIComponent(wordFile.name)}` : "",
          progress: 0,
        }),
      });
      toast.success(`✓ Đã giao việc thành công từ tài liệu Word!`);
      setWordImportModalOpen(false);
      setWordFile(null);
      setWordTaskTitle("");
      setWordTaskDesc("");
      loadTasks();
    } catch {
      toast.error("Lỗi giao việc từ Word!");
    } finally {
      setImportingWord(false);
    }
  };

  // ==========================================
  // --- CHUYỂN GIAO VIỆC (HANDOVER) ---
  // ==========================================
  const handleOpenHandoverModal = (task: TaskItem) => {
    setHandoverModalTask(task);
    const defaultEmp = employees.find((emp) => (emp.id || emp.userId) !== task.assigneeId) || employees[0];
    setHandoverToAssigneeId(defaultEmp ? defaultEmp.id || defaultEmp.userId : "");
    setHandoverToAssigneeName(defaultEmp ? defaultEmp.fullName : "Nhân sự nhận việc");
    setHandoverToDepartment(task.department || departments[0]?.name || "Ban Giám Đốc");
    setHandoverReason("Điều phối nhân sự và phân bổ nhiệm vụ chuyên môn nội bộ");
    setHandoverNote("");
  };

  const handleSubmitHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverModalTask) return;
    if (!handoverToAssigneeId) {
      toast.error("Vui lòng chọn nhân sự nhận bàn giao!");
      return;
    }
    setSubmittingHandover(true);
    try {
      const res = await fetchNestApi<any>(
        `/connect-app/community/${communityId}/tasks/${handoverModalTask.id}/handover`,
        {
          method: "POST",
          body: JSON.stringify({
            toAssigneeId: handoverToAssigneeId,
            toAssigneeName: handoverToAssigneeName,
            toDepartment: handoverToDepartment,
            reason: handoverReason.trim(),
            note: handoverNote.trim(),
          }),
        }
      );

      toast.success(
        res?.message || `✓ Đã chuyển giao việc cho ${handoverToAssigneeName} thành công! Không cần gọi điện thoại riêng.`
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === handoverModalTask.id
            ? {
                ...t,
                assigneeId: handoverToAssigneeId,
                assigneeName: handoverToAssigneeName,
                department: handoverToDepartment,
                status: "assigned",
                handoverHistory: [
                  res?.handoverEntry || {
                    fromAssigneeName: t.assigneeName,
                    toAssigneeName: handoverToAssigneeName,
                    fromDepartment: t.department,
                    toDepartment: handoverToDepartment,
                    reason: handoverReason.trim(),
                    note: handoverNote.trim(),
                    transferredBy: currentUser?.name || "Ban Lãnh Đạo",
                    transferredAt: new Date().toISOString(),
                  },
                  ...(t.handoverHistory || []),
                ],
              }
            : t
        )
      );

      setHandoverModalTask(null);
    } catch {
      toast.error("Không thể chuyển giao công việc. Vui lòng thử lại!");
    } finally {
      setSubmittingHandover(false);
    }
  };

  // ==========================================
  // --- NỘP BÁO CÁO FILE WORD & EXCEL ---
  // ==========================================
  const handleOpenReportModal = (task: TaskItem) => {
    setReportModalTask(task);
    setQuickProgress(task.progress || 50);
    setQuickProgressNote(task.progressNote || "");
    setQuickReportUrl(task.reportUrl || "");
    setReportFileWordName(task.reportFileType === "word" ? task.reportFileName || "" : "");
    setReportFileExcelName(task.reportFileType === "excel" ? task.reportFileName || "" : "");
  };

  const handleSaveQuickProgress = async () => {
    if (!reportModalTask) return;
    setSavingProgress(true);
    try {
      const isCompleted = quickProgress >= 100;
      let finalFileName = "";
      let finalFileType = "other";

      if (reportFileWordName && reportFileExcelName) {
        finalFileName = `${reportFileWordName} & ${reportFileExcelName}`;
        finalFileType = "both";
      } else if (reportFileWordName) {
        finalFileName = reportFileWordName;
        finalFileType = "word";
      } else if (reportFileExcelName) {
        finalFileName = reportFileExcelName;
        finalFileType = "excel";
      }

      await fetchNestApi(`/connect-app/community/${communityId}/tasks/${reportModalTask.id}/report`, {
        method: "POST",
        body: JSON.stringify({
          progress: quickProgress,
          reportNote: quickProgressNote.trim(),
          reportUrl: quickReportUrl.trim(),
          reportFileName: finalFileName,
          reportFileType: finalFileType,
        }),
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === reportModalTask.id
            ? {
                ...t,
                progress: quickProgress,
                progressNote: quickProgressNote.trim(),
                reportUrl: quickReportUrl.trim() || t.reportUrl,
                reportFileName: finalFileName || t.reportFileName,
                reportFileType: finalFileType || t.reportFileType,
                status: isCompleted ? "completed" : "in_progress",
                completedAt: isCompleted ? new Date().toISOString() : t.completedAt,
              }
            : t
        )
      );

      toast.success(
        isCompleted
          ? "✓ Chúc mừng! Công việc đã hoàn thành 100% kèm tệp nghiệm thu!"
          : "✓ Đã cập nhật tiến độ và lưu tệp báo cáo thành công!"
      );
      setReportModalTask(null);
    } catch {
      toast.error("Lỗi cập nhật tiến độ và nộp tệp báo cáo!");
    } finally {
      setSavingProgress(false);
    }
  };

  const handleOpenCreateModal = () => {
    const defaultEmp = employees[0];
    setFormData({
      title: "",
      description: "",
      assigneeId: defaultEmp ? defaultEmp.id || defaultEmp.userId : "",
      assigneeName: defaultEmp ? defaultEmp.fullName : "Thành viên",
      department: selectedDeptFilter !== "all" ? selectedDeptFilter : "Phòng Kinh Doanh & Bán Hàng",
      taskType: "general",
      priority: "high",
      deadline: toDateTimeLocalValue(),
      progress: 0,
      progressNote: "",
      attachments: "",
      reportUrl: "",
      reportNote: "",
      reportFileName: "",
      reportFileType: "",
      customerName: "",
      customerPhone: "",
      customerRequirements: "",
    });
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    const creatorId = task.createdById || task.creatorId;
    if (!canEditRecord(creatorId) && !userCanAssign) {
      toast.error("Bạn không có quyền chỉnh sửa công việc do tài khoản khác tạo ra!");
      return;
    }
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      assigneeId: task.assigneeId || "",
      assigneeName: task.assigneeName || "Thành viên",
      department: task.department || "Phòng Kinh Doanh & Bán Hàng",
      taskType: task.taskType || "general",
      priority: task.priority || "high",
      deadline: toDateTimeLocalValue(task.deadline),
      progress: task.progress || 0,
      progressNote: task.progressNote || "",
      attachments: task.attachments || "",
      reportUrl: task.reportUrl || "",
      reportNote: task.reportNote || "",
      reportFileName: task.reportFileName || "",
      reportFileType: task.reportFileType || "",
      customerName: task.customerName || "",
      customerPhone: task.customerPhone || "",
      customerRequirements: task.customerRequirements || "",
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCanAssign) {
      toast.error("Bạn không có quyền giao việc trong cộng đồng này");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return;
    }
    if (!formData.deadline) {
      toast.error("Vui lòng chọn thời hạn hoàn thành (Deadline)!");
      return;
    }
    if (!formData.department?.trim()) {
      toast.error("Vui lòng chọn hoặc nhập phòng ban / bộ phận!");
      return;
    }
    if (!formData.assigneeId) {
      toast.error("Vui lòng chọn nhân sự thực hiện công việc!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchNestApi<any>(`/connect-app/community/${communityId}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          assigneeId: formData.assigneeId || "emp-vione",
          assigneeName: formData.assigneeName.trim() || "Thành viên được giao",
          department: formData.department,
          taskType: formData.taskType,
          priority: formData.priority,
          deadline: formData.deadline,
          progress: Number(formData.progress) || 0,
          progressNote: formData.progressNote.trim(),
          attachments: formData.attachments.trim(),
          reportUrl: formData.reportUrl.trim(),
          reportNote: formData.reportNote.trim(),
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerRequirements: formData.customerRequirements.trim(),
        }),
      }).catch(() => null);

      toast.success(`Đã giao việc "${formData.title}" cho ${formData.assigneeName}!`);
      setCreateModalOpen(false);

      const newTaskItem: TaskItem = res?.task || {
        id: `task-${Date.now()}`,
        communityId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigneeId: formData.assigneeId || "emp-new",
        assigneeName: formData.assigneeName.trim() || "Thành viên được giao",
        assignerName: currentUser?.name || "Ban Giám Đốc",
        createdById: currentUser?.id,
        department: formData.department,
        taskType: formData.taskType,
        priority: formData.priority,
        status: "assigned",
        progress: Number(formData.progress) || 0,
        progressNote: formData.progressNote.trim(),
        attachments: formData.attachments.trim(),
        reportUrl: formData.reportUrl.trim(),
        reportNote: formData.reportNote.trim(),
        acceptedAt: null,
        completedAt: null,
        deadline: formData.deadline,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerRequirements: formData.customerRequirements.trim(),
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTaskItem, ...prev]);
    } catch {
      toast.error("Không thể giao việc. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return;
    }
    if (!formData.deadline) {
      toast.error("Vui lòng chọn thời hạn hoàn thành (Deadline)!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigneeId: formData.assigneeId,
        assigneeName: formData.assigneeName,
        department: formData.department,
        taskType: formData.taskType,
        priority: formData.priority,
        deadline: formData.deadline,
        progress: Number(formData.progress) || 0,
        progressNote: formData.progressNote.trim(),
        attachments: formData.attachments.trim(),
        reportUrl: formData.reportUrl.trim(),
        reportNote: formData.reportNote.trim(),
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerRequirements: formData.customerRequirements.trim(),
      };

      await fetchNestApi(`/connect-app/community/${communityId}/tasks/${editingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...payload } : t))
      );

      toast.success("✓ Đã cập nhật đầy đủ thông tin công việc!");
      setEditingTask(null);
    } catch {
      toast.error("Không thể cập nhật công việc. Vui lòng kiểm tra quyền hạn!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setDeletingTask(true);
    try {
      await fetchNestApi(`/connect-app/community/${communityId}/tasks/${taskToDelete.id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success("✓ Đã xóa công việc thành công!");
      setTaskToDelete(null);
      if (editingTask && editingTask.id === taskToDelete.id) {
        setEditingTask(null);
      }
    } catch {
      toast.error("Không thể xóa công việc. Vui lòng thử lại!");
    } finally {
      setDeletingTask(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    setAcceptingId(taskId);
    try {
      await fetchNestApi(`/connect-app/community/${communityId}/tasks/${taskId}/accept`, {
        method: "POST",
      }).catch(() => null);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: "in_progress", acceptedAt: new Date().toISOString() }
            : t
        )
      );

      toast.success(`✓ Đã tiến hành nhận việc! Hệ thống đã thông báo cho cấp quản lý.`);
    } catch {
      toast.error("Không thể nhận việc. Vui lòng thử lại!");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="w-full space-y-4 pb-28" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
      {/* ── HEADER EXECUTIVE VI ONE ── */}
      <div className="rounded-3xl border border-[#DFB76C]/30 bg-white dark:bg-[#121824] p-4.5 shadow-xs text-slate-900 dark:text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#DFB76C] to-[#B8860B] text-slate-950 shadow-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Điều Hành & Giao Việc Doanh Nghiệp
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                Quản lý phòng ban, phân công nhiệm vụ, nộp báo cáo và cập nhật tiến độ công việc
              </p>
            </div>
          </div>

          {/* Nhóm nút Hành Động (Giao việc mới, Import Excel, Import Word, Họp trực tuyến) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Nút Họp ban trực tuyến 1-chạm */}
            <button
              type="button"
              onClick={() => {
                const targetDept = selectedDeptFilter !== "all" ? selectedDeptFilter : "Toàn công ty";
                if (selectedDeptFilter !== "all" && !checkCanOperate(selectedDeptFilter, "meet")) {
                  toast.error(`Bạn không có quyền triệu tập họp tại "${selectedDeptFilter}"! Thao tác này chỉ dành cho Ban Giám Đốc hoặc thành viên có quyền trong ban.`);
                  return;
                }
                setMeetingDept(targetDept);
                setMeetingModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 px-3 py-1.5 text-xs font-bold border border-amber-300/60 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Video className="h-3.5 w-3.5 text-amber-600" />
              <span>Họp ban</span>
            </button>

            {userCanAssign && (
              <>
                {/* Nút Import Word */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDeptFilter !== "all" && !checkCanOperate(selectedDeptFilter, "assign")) {
                      toast.error(`Bạn không có quyền giao việc tại "${selectedDeptFilter}"!`);
                      return;
                    }
                    setWordTaskDept(selectedDeptFilter !== "all" ? selectedDeptFilter : (departments[0]?.name || "Ban Giám Đốc"));
                    setWordImportModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-900 dark:text-blue-300 px-3 py-1.5 text-xs font-bold border border-blue-300/60 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Import đề án nhiệm vụ từ file Word (.docx)"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Word</span>
                </button>

                {/* Nút Import Excel */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDeptFilter !== "all" && !checkCanOperate(selectedDeptFilter, "assign")) {
                      toast.error(`Bạn không có quyền giao việc tại "${selectedDeptFilter}"!`);
                      return;
                    }
                    setExcelImportModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold border border-emerald-300/60 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Nạp việc hàng loạt từ file Excel (.xlsx / .csv)"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                {/* Nút Giao việc mới */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDeptFilter !== "all" && !checkCanOperate(selectedDeptFilter, "assign")) {
                      toast.error(`Bạn không có quyền giao việc tại "${selectedDeptFilter}"!`);
                      return;
                    }
                    handleOpenCreateModal();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#DFB76C_0%,#C89B48_50%,#B38230_100%)] px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-[#DFB76C]/60"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>+ Giao việc</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thanh điều khiển kép: [Giao việc | Nhận việc] + [📊 Kanban | 📋 Danh sách] */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {userCanAssign && (
              <button
                type="button"
                onClick={() => setActiveMode("assign")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMode === "assign"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-950"
                }`}
              >
                Giao việc ({tasks.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveMode("receive")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === "receive"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950"
              }`}
            >
              Việc của tôi ({filteredTasks.length})
            </button>
          </div>

          {/* Nút chuyển chế độ xem: Bảng Kanban kiểu Jira vs Danh sách */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-900 text-[#8C653B] dark:text-[#DFB76C] shadow-xs font-extrabold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950"
              }`}
              title="Xem theo bảng cột trạng thái tiến độ Kanban chuẩn Jira"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Bảng Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-900 text-[#8C653B] dark:text-[#DFB76C] shadow-xs font-extrabold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950"
              }`}
              title="Xem theo danh sách chi tiết"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Danh sách</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BỘ CHỌN & PHÂN CHIA PHÒNG BAN CÔNG TY ── */}
      <div className="rounded-2xl bg-white border border-[#DFB76C]/30 p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#B8860B]" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Phòng Ban Doanh Nghiệp ({departments.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isExecutive && (
              <button
                type="button"
                onClick={handleOpenDeptPermissionsModal}
                className="flex items-center gap-1 rounded-xl bg-[#DFB76C]/20 border border-[#DFB76C]/50 px-2.5 py-1 text-[11px] font-extrabold text-[#8C653B] hover:bg-[#DFB76C]/30 cursor-pointer transition-all active:scale-95 shadow-xs"
                title="Phân quyền các thành viên vào từng phòng ban"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" />
                <span>Phân quyền ban</span>
              </button>
            )}
            {userCanAssign && (
              <button
                type="button"
                onClick={() => setDeptModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#8C653B] hover:text-[#B8860B] cursor-pointer"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>+ Tạo phòng ban</span>
              </button>
            )}
          </div>
        </div>

        {/* Thanh trượt ngang các phòng ban */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedDeptFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedDeptFilter === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Tất cả phòng ban
          </button>
          {departments.map((dept) => {
            const isSelected = selectedDeptFilter.toLowerCase() === dept.name.toLowerCase();
            const deptTaskCount = tasks.filter((t) => (t.department || "").toLowerCase().includes(dept.name.toLowerCase())).length;

            return (
              <button
                key={dept.id || dept.name}
                type="button"
                onClick={() => setSelectedDeptFilter(isSelected ? "all" : dept.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#DFB76C]/25 text-[#8C653B] border-[#DFB76C] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: dept.color || "#DFB76C" }}
                />
                <span>{dept.name}</span>
                {deptTaskCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-extrabold">
                    {deptTaskCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Banner cảnh báo Chế độ chỉ xem nếu không thuộc phòng ban này */}
        {selectedDeptFilter !== "all" && !isCurrentDeptAllowed && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
            <ShieldAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <span>Chế độ chỉ xem</span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-200/80 text-[10px] font-black text-amber-900">
                  {selectedDeptFilter}
                </span>
              </div>
              <p className="text-amber-800 text-[11.5px] leading-relaxed">
                Tài khoản của bạn chưa được gán quyền trong ban này. Bạn chỉ có thể theo dõi tiến độ chung. Các thao tác giao việc mới, nhận việc, nộp báo cáo, chuyển việc hoặc triệu tập họp ban được giới hạn cho nhân sự có quyền trong ban.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 5 THẺ THỐNG KÊ TIẾN ĐỘ CHUẨN JIRA ── */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <div className="rounded-2xl border border-[#DFB76C]/30 bg-white p-2 text-center shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Tổng việc</p>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-300/50 bg-amber-50/60 p-2 text-center shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-amber-800">Chờ nhận</p>
          <p className="text-base sm:text-lg font-black text-amber-700 mt-0.5">{stats.assigned}</p>
        </div>
        <div className="rounded-2xl border border-blue-300/50 bg-blue-50/60 p-2 text-center shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-blue-800">Đang làm</p>
          <p className="text-base sm:text-lg font-black text-blue-700 mt-0.5">{stats.inProgress}</p>
        </div>
        <div className="rounded-2xl border border-purple-300/50 bg-purple-50/60 p-2 text-center shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-purple-800">Chờ duyệt</p>
          <p className="text-base sm:text-lg font-black text-purple-700 mt-0.5">{stats.inReview}</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 p-2 text-center shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-emerald-800">Hoàn thành</p>
          <p className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">{stats.completed}</p>
        </div>
      </div>

      {/* ── BỘ LỌC TRẠNG THÁI ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Tất cả trạng thái" },
          { key: "assigned", label: "Chờ nhận việc" },
          { key: "in_progress", label: "Đang tiến hành" },
          { key: "in_review", label: "Chờ duyệt / Nghiệm thu" },
          { key: "completed", label: "Đã hoàn thành" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              filter === item.key
                ? "bg-[#DFB76C]/25 border-[#DFB76C] text-[#8C653B] shadow-xs"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── DANH SÁCH & BẢNG KANBAN CÔNG VIỆC ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white border border-[#DFB76C]/20 shadow-xs">
          <Loader2 className="h-8 w-8 text-[#DFB76C] animate-spin" />
          <p className="text-xs font-semibold text-slate-500 mt-2">Đang tải danh sách công việc...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 rounded-3xl bg-white border border-dashed border-[#DFB76C]/40 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-[#DFB76C]/15 grid place-items-center text-[#B8860B] mb-2">
            <Briefcase className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {activeMode === "receive" ? "Bạn chưa có công việc nào được giao" : "Chưa có công việc nào trong danh mục này"}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {activeMode === "receive"
              ? "Khi Ban Quản Trị hoặc Giám Đốc phân công việc, tác vụ sẽ tự động hiển thị tại đây kèm thông báo."
              : "Bấm 'Giao việc mới', nạp Excel hoặc Word để phân bổ nhiệm vụ và KPI cho nhân sự công ty."}
          </p>
        </div>
      ) : viewMode === "kanban" ? (
        /* ── CHẾ ĐỘ XEM BẢNG KANBAN CHUẨN JIRA ── */
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory pt-1">
          {[
            {
              status: "assigned" as const,
              label: "Chờ nhận việc",
              icon: Clock,
              badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
              headerBg: "bg-amber-50/70 border-amber-200/80",
            },
            {
              status: "in_progress" as const,
              label: "Đang tiến hành",
              icon: TrendingUp,
              badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
              headerBg: "bg-blue-50/70 border-blue-200/80",
            },
            {
              status: "in_review" as const,
              label: "Chờ nghiệm thu",
              icon: FileCheck,
              badgeBg: "bg-purple-100 text-purple-800 border-purple-300",
              headerBg: "bg-purple-50/70 border-purple-200/80",
            },
            {
              status: "completed" as const,
              label: "Đã hoàn thành",
              icon: CheckCircle2,
              badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
              headerBg: "bg-emerald-50/70 border-emerald-200/80",
            },
          ].map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            const ColIcon = col.icon;
            return (
              <div
                key={col.status}
                className="w-[290px] shrink-0 snap-center flex flex-col gap-3 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-3"
              >
                {/* Header Cột Kanban */}
                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${col.headerBg}`}>
                  <div className="flex items-center gap-1.5">
                    <ColIcon className="h-4 w-4" />
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Danh sách thẻ trong cột */}
                <div className="space-y-2.5 overflow-y-auto max-h-[70vh] pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Không có công việc
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const progress = task.progress || 0;
                      const canHandoverThis = checkCanOperate(task.department, "handover");
                      const canEditThis =
                        (canEditRecord(task.createdById || task.creatorId) || userCanAssign) &&
                        checkCanOperate(task.department, "assign");
                      const canAcceptThis = checkCanOperate(task.department, "accept");
                      const canReportThis = checkCanOperate(task.department, "report");

                      return (
                        <div
                          key={task.id}
                          className="rounded-2xl border border-[#DFB76C]/40 bg-white p-3 shadow-xs hover:border-[#DFB76C] transition-all flex flex-col gap-2.5"
                        >
                          {/* Priority & Quick Actions */}
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                task.priority === "urgent"
                                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                                  : task.priority === "high"
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {task.priority === "urgent" ? "Khẩn cấp" : task.priority === "high" ? "Ưu tiên cao" : "Bình thường"}
                            </span>

                            <div className="flex items-center gap-1">
                              {canHandoverThis && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenHandoverModal(task)}
                                  className="h-6 w-6 rounded-md grid place-items-center bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
                                  title="Chuyển việc"
                                >
                                  <ArrowRightLeft className="h-3 w-3" />
                                </button>
                              )}
                              {canEditThis && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(task)}
                                    className="h-6 w-6 rounded-md grid place-items-center bg-slate-100 text-slate-600 hover:bg-[#DFB76C]/25 cursor-pointer"
                                    title="Sửa"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setTaskToDelete(task)}
                                    className="h-6 w-6 rounded-md grid place-items-center bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Tiêu đề & Phòng ban */}
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                              {task.title}
                            </h4>
                            {task.department && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-100 text-slate-700">
                                {task.department}
                              </span>
                            )}
                          </div>

                          {/* Thanh tiến độ */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10.5px]">
                              <span className="text-slate-500 font-semibold">Tiến độ:</span>
                              <span className="font-extrabold text-[#8C653B]">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#DFB76C] to-[#B8860B]"
                                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                              />
                            </div>
                          </div>

                          {/* Người nhận & Hạn chót */}
                          <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                            <div className="flex items-center gap-1 truncate">
                              <User className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">Giao: <strong className="text-slate-900">{task.assigneeName}</strong></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-[#B8860B] shrink-0" />
                              <span>Hạn: <strong className="text-slate-900">{formatDisplayDate(task.deadline)}</strong></span>
                            </div>
                          </div>

                          {/* Bộ chuyển trạng thái nhanh 1-chạm (Chuẩn Jira Workflow) */}
                          <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-1">
                            <label className="text-[10px] font-bold text-slate-500">Chuyển:</label>
                            <select
                              value={task.status}
                              onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                              className="text-[10.5px] font-bold rounded-lg border border-slate-200 bg-slate-50 py-1 px-1.5 text-slate-800 focus:outline-none focus:border-[#DFB76C] cursor-pointer"
                            >
                              <option value="assigned">⏳ Chờ nhận việc</option>
                              <option value="in_progress">⚡ Đang xử lý</option>
                              <option value="in_review">🔍 Chờ nghiệm thu</option>
                              <option value="completed">✓ Đã xong</option>
                            </select>
                          </div>

                          {/* Nút hành động chính */}
                          {task.status === "assigned" && canAcceptThis ? (
                            <button
                              type="button"
                              disabled={acceptingId === task.id}
                              onClick={() => handleAcceptTask(task.id)}
                              className="w-full py-1.5 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-[11px] shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              {acceptingId === task.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 stroke-[3]" />}
                              <span>Nhận việc ngay</span>
                            </button>
                          ) : task.status === "in_progress" && canReportThis ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReportModal(task)}
                              className="w-full py-1.5 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-[11px] shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <FileCheck className="h-3 w-3" />
                              <span>Báo cáo tiến độ</span>
                            </button>
                          ) : task.status === "in_review" && canReportThis ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReportModal(task)}
                              className="w-full py-1.5 rounded-xl bg-purple-50 text-purple-800 font-bold text-[11px] border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                            >
                              <FileCheck className="h-3 w-3" />
                              <span>Cập nhật nghiệm thu</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenReportModal(task)}
                              className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Eye className="h-3 w-3 text-slate-500" />
                              <span>Xem chi tiết hồ sơ</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── CHẾ ĐỘ XEM DANH SÁCH CHI TIẾT ── */
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isAssigned = task.status === "assigned";
            const isInProgress = task.status === "in_progress";
            const isInReview = task.status === "in_review";
            const isCompleted = task.status === "completed";
            const progress = task.progress || 0;
            const canHandoverThis = checkCanOperate(task.department, "handover");
            const canEditThis = (canEditRecord(task.createdById || task.creatorId) || userCanAssign) && checkCanOperate(task.department, "assign");
            const canAcceptThis = checkCanOperate(task.department, "accept");
            const canReportThis = checkCanOperate(task.department, "report");
            const hasHandover = task.handoverHistory && task.handoverHistory.length > 0;

            return (
              <div
                key={task.id}
                className="relative rounded-3xl border border-[#DFB76C]/40 bg-white p-4 shadow-sm hover:border-[#DFB76C] transition-all flex flex-col gap-3"
              >
                {/* Header card: Priority + Status + Action icons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge Priority */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider ${
                        task.priority === "urgent"
                          ? "bg-rose-100 text-rose-700 border border-rose-300"
                          : task.priority === "high"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {task.priority === "urgent" ? "Khẩn cấp" : task.priority === "high" ? "Ưu tiên cao" : "Bình thường"}
                    </span>

                    {/* Badge Status */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isInReview
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : isInProgress
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {isCompleted ? "✓ Đã hoàn thành" : isInReview ? "🔍 Chờ nghiệm thu" : isInProgress ? "⚡ Đang xử lý" : "⏳ Chờ nhận việc"}
                    </span>

                    {/* Department */}
                    {task.department && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {task.department}
                      </span>
                    )}

                    {/* Badge Chuyển giao việc nếu có */}
                    {hasHandover && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <ArrowRightLeft className="h-2.5 w-2.5" />
                        <span>Đã bàn giao ({task.handoverHistory?.length})</span>
                      </span>
                    )}
                  </div>

                  {/* Nút Chuyển giao việc, Sửa & Xóa */}
                  <div className="flex items-center gap-1">
                    {/* Nút Chuyển giao việc */}
                    {canHandoverThis && (
                      <button
                        type="button"
                        onClick={() => handleOpenHandoverModal(task)}
                        className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-purple-200"
                        title="Chuyển giao công việc cho nhân sự hoặc phòng ban khác"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        <span>Chuyển việc</span>
                      </button>
                    )}

                    {canEditThis && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(task)}
                          className="h-7 w-7 rounded-lg grid place-items-center bg-slate-100 hover:bg-[#DFB76C]/25 text-slate-600 hover:text-[#8C653B] transition-colors cursor-pointer"
                          title="Chỉnh sửa công việc"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaskToDelete(task)}
                          className="h-7 w-7 rounded-lg grid place-items-center bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Xóa công việc"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{task.title}</h3>
                  {task.description ? (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                  ) : null}
                </div>

                {/* Thanh tiến độ % */}
                <div className="rounded-2xl bg-[#FAF8F5] border border-[#DFB76C]/25 p-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-[#B8860B]" /> Tiến độ:
                    </span>
                    <span className="font-black text-[#8C653B]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#DFB76C] to-[#B8860B] transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  {task.progressNote ? (
                    <p className="text-[11px] text-slate-600 italic mt-1.5">Ghi chú: {task.progressNote}</p>
                  ) : null}
                </div>

                {/* Metadata: Người giao, Người nhận, Thời hạn */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2.5 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Giao cho: <strong className="text-slate-900 font-bold">{task.assigneeName}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#B8860B] shrink-0" />
                    <span className="truncate">
                      Hạn: <strong className="text-slate-900 font-bold">{formatDisplayDate(task.deadline)}</strong>
                    </span>
                  </div>
                </div>

                {/* Khách hàng CRM liên kết nếu có */}
                {task.customerName ? (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/60 border border-amber-200/70 px-3 py-1.5 text-xs text-amber-900">
                    <Target className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">
                      KH: <strong>{task.customerName}</strong> {task.customerPhone ? `(${task.customerPhone})` : ""}
                    </span>
                  </div>
                ) : null}

                {/* Huy hiệu Tệp Word & Excel Báo cáo nghiệm thu */}
                {(task.reportFileName || task.attachments || task.reportUrl) && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {(task.reportFileType === "word" || (task.reportFileName && task.reportFileName.includes(".doc"))) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span className="max-w-[140px] truncate">{task.reportFileName || "Báo cáo Word"}</span>
                      </span>
                    )}

                    {(task.reportFileType === "excel" || (task.reportFileName && (task.reportFileName.includes(".xls") || task.reportFileName.includes(".csv")))) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="max-w-[140px] truncate">{task.reportFileName || "Bảng số liệu Excel"}</span>
                      </span>
                    )}

                    {task.attachments ? (
                      <a
                        href={task.attachments}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>Tệp đính kèm</span>
                      </a>
                    ) : null}

                    {task.reportUrl ? (
                      <a
                        href={task.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <FileCheck className="h-3 w-3" />
                        <span>Báo cáo nghiệm thu</span>
                        <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                      </a>
                    ) : null}
                  </div>
                )}

                {/* Khối hiển thị lịch sử bàn giao việc (Audit Trail) */}
                {hasHandover && (
                  <div className="rounded-2xl bg-purple-50/50 border border-purple-200/60 p-2.5 text-xs text-purple-900 space-y-1.5">
                    <span className="font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider text-purple-800">
                      <History className="h-3 w-3 text-purple-700" /> Lịch sử chuyển giao gần nhất:
                    </span>
                    {task.handoverHistory?.slice(0, 2).map((h, hIdx) => (
                      <div key={hIdx} className="text-[11.5px] leading-relaxed border-t border-purple-200/40 pt-1">
                        Từ <strong>{h.fromAssigneeName}</strong> ({h.fromDepartment || "PB"}) ➔ <strong>{h.toAssigneeName}</strong> ({h.toDepartment || "PB"}).
                        <p className="text-[11px] text-purple-700 italic">Lý do: {h.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer: Bộ chuyển trạng thái nhanh + action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500">Chuyển trạng thái:</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                      className="text-[11px] font-bold rounded-lg border border-slate-200 bg-white py-1 px-2 text-slate-800 focus:outline-none focus:border-[#DFB76C] cursor-pointer"
                    >
                      <option value="assigned">⏳ Chờ nhận việc</option>
                      <option value="in_progress">⚡ Đang xử lý</option>
                      <option value="in_review">🔍 Chờ nghiệm thu</option>
                      <option value="completed">✓ Hoàn thành</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAssigned ? (
                      canAcceptThis ? (
                        <button
                          type="button"
                          disabled={acceptingId === task.id}
                          onClick={() => handleAcceptTask(task.id)}
                          className="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                        >
                          {acceptingId === task.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          )}
                          <span>Tiến hành nhận việc</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200/80">
                          ⏳ Chờ nhân sự ban nhận việc
                        </span>
                      )
                    ) : isInProgress ? (
                      canReportThis ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReportModal(task)}
                          className="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          <span>Báo cáo tiến độ & nộp File</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200/80">
                          ⚡ Đang thực hiện trong ban
                        </span>
                      )
                    ) : isInReview ? (
                      canReportThis ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReportModal(task)}
                          className="px-4 py-2 rounded-xl bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          <span>Hồ sơ nghiệm thu</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200/80">
                          🔍 Chờ cấp quản lý nghiệm thu
                        </span>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenReportModal(task)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Xem hồ sơ nghiệm thu</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL TẠO PHÒNG BAN MỚI ── */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#DFB76C]/60 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F0E8] shadow-2xl p-5 text-slate-900 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFB76C]/30">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-[#B8860B]" />
                <h3 className="text-base font-black text-slate-900">Tạo Phòng Ban Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeptModalOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="py-3.5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên phòng ban / Bộ phận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phòng Dự Án Đặc Biệt, Ban Pháp Chế..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chức năng & Nhiệm vụ</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả chức năng nhiệm vụ trọng tâm..."
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trưởng bộ phận phụ trách</label>
                <select
                  value={newDeptManagerUserId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    setNewDeptManagerUserId(selId);
                    const found = employees.find((emp) => (emp.id || emp.userId) === selId);
                    setNewDeptManagerName(found?.fullName || "");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                >
                  <option value="">-- Chọn trưởng bộ phận (từ cộng đồng này) --</option>
                  {employees.map((emp) => (
                    <option key={emp.id || emp.userId} value={emp.id || emp.userId}>
                      {emp.fullName} ({emp.roleTitle || "Thành viên"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Thêm thành viên vào phòng ban */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Thêm thành viên vào ban ({newDeptSelectedMemberUserIds.length})
                  </label>
                  <span className="text-[10.5px] text-slate-500">Chỉ thành viên thuộc cộng đồng này</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50/70">
                  {employees.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center">Chưa có thành viên nào trong cộng đồng</p>
                  ) : (
                    employees.map((emp) => {
                      const empId = emp.id || emp.userId;
                      const isManager = empId === newDeptManagerUserId;
                      const isChecked = newDeptSelectedMemberUserIds.includes(empId) || isManager;
                      return (
                        <label
                          key={empId}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-amber-50/80 border-[#DFB76C]/60 text-slate-900"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              disabled={isManager}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewDeptSelectedMemberUserIds((prev) => [...prev, empId]);
                                } else {
                                  setNewDeptSelectedMemberUserIds((prev) => prev.filter((id) => id !== empId));
                                }
                              }}
                              className="rounded border-slate-300 text-[#DFB76C] focus:ring-[#DFB76C]"
                            />
                            <div className="truncate">
                              <p className="font-bold truncate">{emp.fullName}</p>
                              <p className="text-[10px] text-slate-500 truncate">{emp.roleTitle || emp.email || "Thành viên"}</p>
                            </div>
                          </div>
                          {isManager && (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-[#DFB76C]/30 text-[#8C653B]">
                              Trưởng ban
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Màu sắc nhận diện</label>
                <div className="flex items-center gap-2">
                  {["#B8860B", "#2563EB", "#059669", "#D97706", "#9333EA", "#E11D48"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewDeptColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer ${
                        newDeptColor === c ? "scale-110 border-slate-900 ring-2 ring-slate-400" : "border-white"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFB76C]/30">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingDept}
                  className="px-5 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                >
                  {savingDept ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  <span>Lưu phòng ban</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL HỌP BAN TRỰC TUYẾN 1-CHẠM ── */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-amber-300/80 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FFF8E7] shadow-2xl p-5 text-slate-900 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-amber-700" />
                <h3 className="text-base font-black text-slate-900">Họp Ban Trực Tuyến 1-Chạm</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMeetingModalOpen(false);
                  setActiveMeetingUrl(null);
                }}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="py-3.5 space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Tối ưu hóa quy trình: Tự động khởi tạo phòng họp video trực tuyến và gửi thông báo triệu tập khẩn cấp cho nhân sự, không cần gọi điện thoại riêng.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bộ phận triệu tập họp</label>
                <select
                  value={meetingDept}
                  onChange={(e) => setMeetingDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                >
                  <option value="Toàn công ty">Toàn thể cán bộ công ty</option>
                  {departments.map((d) => (
                    <option key={d.id || d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề cuộc họp</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Ví dụ: Họp khẩn cấp tiến độ dự án tuần..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              {activeMeetingUrl && (
                <div className="p-3 rounded-2xl bg-amber-100/70 border border-amber-300 space-y-2">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-700" /> Phòng họp đã sẵn sàng:
                  </p>
                  <a
                    href={activeMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-blue-700 underline truncate font-medium"
                  >
                    {activeMeetingUrl}
                  </a>
                  <a
                    href={activeMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Tham gia phòng họp ngay</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-200">
              <button
                type="button"
                onClick={() => {
                  setMeetingModalOpen(false);
                  setActiveMeetingUrl(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              {!activeMeetingUrl && (
                <button
                  type="button"
                  disabled={startingMeeting}
                  onClick={handleStartInstantMeeting}
                  className="px-5 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                >
                  {startingMeeting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Video className="h-3.5 w-3.5" />}
                  <span>Triệu tập & Bắt đầu họp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CHUYỂN GIAO VIỆC (TASK HANDOVER) ── */}
      {handoverModalTask && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-purple-300/80 bg-gradient-to-b from-white via-[#FAF7FD] to-[#F5EFFE] shadow-2xl p-5 text-slate-900 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-purple-200">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-purple-700" />
                <h3 className="text-base font-black text-slate-900">Chuyển Giao Công Việc</h3>
              </div>
              <button
                type="button"
                onClick={() => setHandoverModalTask(null)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHandover} className="py-3.5 space-y-3">
              <div className="p-3 rounded-2xl bg-white border border-purple-200 text-xs space-y-1">
                <p className="text-slate-500 font-semibold">Công việc chuyển giao:</p>
                <p className="text-slate-900 font-extrabold text-sm">{handoverModalTask.title}</p>
                <p className="text-slate-600">
                  Người phụ trách hiện tại: <strong>{handoverModalTask.assigneeName}</strong> ({handoverModalTask.department || "Vận hành"})
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhân sự nhận bàn giao mới <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={handoverToAssigneeId}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    const found = employees.find((emp) => (emp.id || emp.userId) === chosenId);
                    setHandoverToAssigneeId(chosenId);
                    setHandoverToAssigneeName(found ? found.fullName : "Nhân sự nhận việc");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500"
                >
                  <option value="">-- Chọn nhân sự nhận việc --</option>
                  {employees.map((emp) => (
                    <option key={emp.id || emp.userId} value={emp.id || emp.userId}>
                      {emp.fullName} ({emp.roleTitle || "Thành viên"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chuyển sang bộ phận / phòng ban</label>
                <select
                  value={handoverToDepartment}
                  onChange={(e) => setHandoverToDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500"
                >
                  {departments.map((d) => (
                    <option key={d.id || d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lý do chuyển giao việc <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bàn giao ca trực, hỗ trợ chuyên môn, điều chuyển dự án..."
                  value={handoverReason}
                  onChange={(e) => setHandoverReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú & Dặn dò bàn giao</label>
                <textarea
                  rows={2}
                  placeholder="Dặn dò đầu mối khách hàng, tiến độ tài liệu, các việc cần chú ý..."
                  value={handoverNote}
                  onChange={(e) => setHandoverNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setHandoverModalTask(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingHandover}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  {submittingHandover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRightLeft className="h-3.5 w-3.5" />}
                  <span>Xác nhận chuyển việc</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL IMPORT EXCEL CHO NGƯỜI GIAO VIỆC ── */}
      {excelImportModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-300/80 bg-gradient-to-b from-white via-[#F8FDF9] to-[#EFFBF1] shadow-2xl p-5 text-slate-900 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-700" />
                <h3 className="text-base font-black text-slate-900">Import Công Việc Hàng Loạt Từ Excel</h3>
              </div>
              <button
                type="button"
                onClick={() => setExcelImportModalOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="py-3.5 space-y-3 overflow-y-auto flex-1">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <p className="font-extrabold text-emerald-950">Chưa có file mẫu bảng tính?</p>
                  <p className="text-emerald-700 text-[11px]">Tải file mẫu Excel chuẩn ViOne để nạp danh sách</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadExcelTemplate}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải file mẫu (.csv)</span>
                </button>
              </div>

              {/* Ô upload file */}
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center bg-white hover:bg-emerald-50/50 transition-colors">
                <Upload className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {excelFile ? excelFile.name : "Chọn hoặc kéo thả tệp Excel (.xlsx, .xls, .csv)"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Dung lượng tối đa 15MB</p>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleSelectExcelFile}
                  className="mt-2 text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
              </div>

              {/* Xem trước bảng dữ liệu */}
              {excelPreviewTasks.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">
                    Xem trước danh sách ({excelPreviewTasks.length} công việc):
                  </p>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 text-xs">
                    {excelPreviewTasks.map((t, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 truncate">{t.title}</p>
                          <p className="text-[11px] text-slate-500">
                            Phòng ban: {t.department} | Hạn: {t.deadline}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {t.assigneeName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-200">
              <button
                type="button"
                onClick={() => setExcelImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={importingExcel || excelPreviewTasks.length === 0}
                onClick={handleConfirmImportExcel}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {importingExcel ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                <span>Xác nhận nạp hàng loạt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL IMPORT WORD CHO NGƯỜI GIAO VIỆC ── */}
      {wordImportModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-blue-300/80 bg-gradient-to-b from-white via-[#F8FBFE] to-[#EFF6FE] shadow-2xl p-5 text-slate-900 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-700" />
                <h3 className="text-base font-black text-slate-900">Import Nhiệm Vụ Từ File Word</h3>
              </div>
              <button
                type="button"
                onClick={() => setWordImportModalOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="py-3.5 space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                Nạp trực tiếp đề cương, nghị quyết hoặc kế hoạch nhiệm vụ file Word (.docx) vào hệ thống giao việc.
              </p>

              {/* Ô upload file Word */}
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-4 text-center bg-white hover:bg-blue-50/50 transition-colors">
                <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {wordFile ? wordFile.name : "Chọn tệp văn bản Word (.docx, .doc)"}
                </p>
                <input
                  type="file"
                  accept=".docx, .doc, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleSelectWordFile}
                  className="mt-2 text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề nhiệm vụ</label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề rút trích từ văn bản Word..."
                  value={wordTaskTitle}
                  onChange={(e) => setWordTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả tóm tắt nội dung</label>
                <textarea
                  rows={2}
                  value={wordTaskDesc}
                  onChange={(e) => setWordTaskDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phòng ban phụ trách</label>
                <select
                  value={wordTaskDept}
                  onChange={(e) => setWordTaskDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                >
                  {departments.map((d) => (
                    <option key={d.id || d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-200">
              <button
                type="button"
                onClick={() => setWordImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={importingWord || !wordTaskTitle.trim()}
                onClick={handleConfirmImportWord}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {importingWord ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                <span>Giao việc ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NỘP BÁO CÁO KÈM FILE WORD & EXCEL ── */}
      {reportModalTask && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#DFB76C]/60 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F0E8] shadow-2xl p-5 text-slate-900 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFB76C]/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#B8860B]" />
                <h3 className="text-base font-black text-slate-900">Nộp Báo Cáo Tiến Độ & Nghiệm Thu</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalTask(null)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="py-3.5 space-y-3.5 overflow-y-auto flex-1">
              <p className="text-xs text-slate-600 font-medium">
                Công việc: <strong className="text-slate-900">{reportModalTask.title}</strong>
              </p>

              {/* Tiến độ % */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Tiến độ thực hiện (%):</span>
                  <span className="text-base font-black text-[#8C653B]">{quickProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={quickProgress}
                  onChange={(e) => setQuickProgress(Number(e.target.value))}
                  className="w-full accent-[#DFB76C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>0% Bắt đầu</span>
                  <span>50% Đang làm</span>
                  <span>100% Hoàn tất</span>
                </div>
              </div>

              {/* ĐÍNH KÈM FILE BÁO CÁO WORD & EXCEL */}
              <div className="p-3 rounded-2xl bg-white border border-[#DFB76C]/40 space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-[#B8860B]" /> Đính kèm tệp báo cáo nghiệm thu
                </span>

                {/* File Word */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold text-blue-950 truncate">
                      {reportFileWordName ? reportFileWordName : "Chưa chọn file Word (.docx, .doc)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => wordFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    {reportFileWordName ? "Đổi file" : "Chọn Word"}
                  </button>
                  <input
                    ref={wordFileInputRef}
                    type="file"
                    accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setReportFileWordName(f.name);
                    }}
                  />
                </div>

                {/* File Excel */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-950 truncate">
                      {reportFileExcelName ? reportFileExcelName : "Chưa chọn file Excel (.xlsx, .csv)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => excelFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    {reportFileExcelName ? "Đổi file" : "Chọn Excel"}
                  </button>
                  <input
                    ref={excelFileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setReportFileExcelName(f.name);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú tiến độ & giải trình kết quả</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú chi tiết những việc đã làm được và nghiệm thu..."
                  value={quickProgressNote}
                  onChange={(e) => setQuickProgressNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link tài liệu nghiệm thu trực tuyến</label>
                <input
                  type="url"
                  placeholder="Link Google Drive, OneDrive hoặc liên kết nghiệm thu..."
                  value={quickReportUrl}
                  onChange={(e) => setQuickReportUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFB76C]/30">
              <button
                type="button"
                onClick={() => setReportModalTask(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={savingProgress}
                onClick={handleSaveQuickProgress}
                className="px-5 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
              >
                {savingProgress ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                <span>Gửi báo cáo nghiệm thu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL TẠO & CHỈNH SỬA CÔNG VIỆC THỦ CÔNG ── */}
      {(createModalOpen || editingTask) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#DFB76C]/60 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F0E8] shadow-2xl p-5 text-slate-900 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFB76C]/30 shrink-0">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#F6E1C3] to-[#DFB76C] text-slate-950 shadow-sm">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {createModalOpen ? "Giao việc cho nhân sự" : "Chỉnh sửa công việc"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chuẩn chỉnh thông tin phân công, phòng ban, tiến độ & hồ sơ nghiệm thu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditingTask(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={createModalOpen ? handleCreateTask : handleUpdateTask}
              className="overflow-y-auto flex-1 py-3.5 space-y-3.5 pr-1"
            >
              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề công việc <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tư vấn triển khai CRM cho Tập đoàn X..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#DFB76C] focus:ring-1 focus:ring-[#DFB76C]"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả công việc chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả mục tiêu, yêu cầu đầu ra và tiêu chí hoàn thành..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#DFB76C] focus:ring-1 focus:ring-[#DFB76C]"
                />
              </div>

              {/* Nhân sự phụ trách */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhân sự phụ trách <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    const found = employees.find((emp) => (emp.id || emp.userId) === chosenId);
                    setFormData({
                      ...formData,
                      assigneeId: chosenId,
                      assigneeName: found ? found.fullName : "Thành viên",
                    });
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#DFB76C] focus:ring-1 focus:ring-[#DFB76C]"
                >
                  {employees && employees.length > 0 ? (
                    employees.map((emp) => (
                      <option key={emp.id || emp.userId} value={emp.id || emp.userId}>
                        {emp.fullName} ({emp.roleTitle || emp.role || "Thành viên"})
                      </option>
                    ))
                  ) : (
                    <option value="">Đang tải danh sách nhân sự...</option>
                  )}
                </select>
              </div>

              {/* 2 cột: Phòng ban & Loại công việc */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phòng ban</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id || dept.name} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại công việc</label>
                  <select
                    value={formData.taskType}
                    onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                  >
                    {TASK_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2 cột: Mức độ ưu tiên & Hạn chót */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                  >
                    <option value="urgent">Khẩn cấp</option>
                    <option value="high">Ưu tiên cao</option>
                    <option value="medium">Bình thường</option>
                    <option value="low">Thấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời hạn hoàn thành <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                  />
                </div>
              </div>

              {/* Khối Tệp đính kèm */}
              <div className="p-3 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-blue-700" /> Tệp đính kèm & Tài liệu đề án
                </span>
                <input
                  type="url"
                  placeholder="Đường link tệp tài liệu / hồ sơ đính kèm (Google Drive, OneDrive...)"
                  value={formData.attachments}
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* Khách hàng liên kết (CRM) */}
              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-amber-700" /> Khách hàng liên kết chăm sóc (CRM)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Tên khách hàng / DN"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DFB76C]/30 shrink-0">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => setTaskToDelete(editingTask)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-rose-200 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa việc</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateModalOpen(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                  >
                    {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    <span>{createModalOpen ? "Hoàn tất giao việc" : "Lưu thay đổi"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL XÁC NHẬN XÓA VIỆC ── */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-rose-300 bg-white shadow-2xl p-5 text-slate-900 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 grid place-items-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Xác nhận xóa công việc?</h3>
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa vĩnh viễn công việc: <strong className="text-slate-900">"{taskToDelete.title}"</strong>?
              Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deletingTask}
                onClick={handleDeleteTask}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1"
              >
                {deletingTask ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PHÂN QUYỀN PHÒNG BAN VI ONE (DEPARTMENT RBAC) ── */}
      {deptPermissionsModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-[#DFB76C]/60 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F0E8] shadow-2xl p-4 sm:p-6 text-slate-900 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFB76C]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#F6E1C3] via-[#DFB76C] to-[#B8860B] text-slate-950 shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      Phân Quyền Vận Hành Phòng Ban
                    </h3>
                    <span className="rounded-full bg-[#DFB76C]/25 border border-[#DFB76C]/50 px-2 py-0.5 text-[10px] font-extrabold text-[#8C653B]">
                      RBAC Executive
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Nhân sự được add vào ban nào chỉ được thao tác các tính năng được cấp ở ban đó
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeptPermissionsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-3.5 space-y-4 pr-1">
              {/* Form gán quyền mới */}
              <form onSubmit={handleSaveDepartmentMember} className="rounded-2xl border border-[#DFB76C]/40 bg-white p-3.5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <UserPlus className="h-4 w-4 text-[#B8860B]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Gán thành viên vào ban & Cấp quyền thao tác
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chọn phòng ban */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chọn phòng ban <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={assignDeptId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssignDeptId(val);
                        const d = departments.find((dept) => (dept.id || dept.name) === val || dept.name === val);
                        if (d) setAssignDeptName(d.name);
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id || dept.name} value={dept.id || dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn nhân sự */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chọn nhân sự <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={assignUserId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssignUserId(val);
                        const emp = employees.find((item) => (item.id || item.userId) === val);
                        if (emp) {
                          setAssignUserName(emp.fullName);
                          setAssignUserEmail(emp.email || "");
                          setAssignUserPhone(emp.phone || "");
                        }
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#DFB76C]"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id || emp.userId} value={emp.id || emp.userId}>
                          {emp.fullName} ({emp.phone || emp.email || "Nhân sự"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chọn vai trò trong ban */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vai trò trong ban
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleChangeInForm("lead")}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        assignRole === "lead"
                          ? "bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 border-[#D8B282] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Trưởng ban (Quản lý)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChangeInForm("member")}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        assignRole === "member"
                          ? "bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 border-[#D8B282] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Chuyên viên ban</span>
                    </button>
                  </div>
                </div>

                {/* Checkboxes 5 quyền chi tiết */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chi tiết quyền thao tác trong ban:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignCanAssign}
                        onChange={(e) => setAssignCanAssign(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#B8860B]"
                      />
                      <span className="text-xs font-bold text-slate-800">📌 Giao việc mới trong ban</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignCanAccept}
                        onChange={(e) => setAssignCanAccept(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#B8860B]"
                      />
                      <span className="text-xs font-bold text-slate-800">📥 Nhận việc trong ban</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignCanReport}
                        onChange={(e) => setAssignCanReport(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#B8860B]"
                      />
                      <span className="text-xs font-bold text-slate-800">📝 Nộp báo cáo & File Word/Excel</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignCanHandover}
                        onChange={(e) => setAssignCanHandover(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#B8860B]"
                      />
                      <span className="text-xs font-bold text-slate-800">🔄 Chuyển giao việc nội bộ</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={assignCanMeet}
                        onChange={(e) => setAssignCanMeet(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#B8860B]"
                      />
                      <span className="text-xs font-bold text-slate-800">🎥 Triệu tập họp ban trực tuyến 1-chạm</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingDeptMember}
                    className="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#D8B282]/50"
                  >
                    {savingDeptMember ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    <span>Lưu phân quyền thành viên</span>
                  </button>
                </div>
              </form>

              {/* Danh sách thành viên từng phòng ban hiện tại */}
              <div className="rounded-2xl border border-[#DFB76C]/30 bg-white p-3.5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#B8860B]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Danh sách nhân sự & quyền hạn theo ban ({departmentMembers.length})
                    </h4>
                  </div>
                  {loadingDeptMembers && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#B8860B]" />}
                </div>

                {departmentMembers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-3 text-center">
                    Chưa có nhân sự nào được phân quyền phòng ban riêng. Hiện tại Ban Giám Đốc đang quản lý tập trung.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {departmentMembers.map((m) => (
                      <div
                        key={m.id || `${m.departmentId}-${m.userId}`}
                        className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-[#DFB76C]/20 border border-[#DFB76C] grid place-items-center font-bold text-[#8C653B] shrink-0">
                            {m.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-slate-900 truncate">{m.userName || "Nhân viên"}</span>
                              <span
                                className={`px-2 py-0.2 rounded-md text-[10px] font-extrabold uppercase ${
                                  m.role === "lead"
                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                    : "bg-blue-100 text-blue-900 border border-blue-300"
                                }`}
                              >
                                {m.role === "lead" ? "Trưởng ban" : "Thành viên"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                              <span className="font-bold text-[#8C653B]">{m.departmentName}</span>
                              {m.userPhone && <span>• {m.userPhone}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Badges quyền & Nút gỡ */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                            {m.canAssign && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800" title="Được giao việc">
                                Giao việc
                              </span>
                            )}
                            {m.canAccept && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800" title="Được nhận việc">
                                Nhận việc
                              </span>
                            )}
                            {m.canReport && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800" title="Được nộp báo cáo">
                                Báo cáo
                              </span>
                            )}
                            {m.canHandover && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800" title="Được chuyển việc">
                                Chuyển việc
                              </span>
                            )}
                            {m.canMeet && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800" title="Được họp ban">
                                Họp ban
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={deletingDeptMemberId === m.userId}
                            onClick={() => handleDeleteDepartmentMember(m.departmentId, m.userId, m.userName || "thành viên")}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Gỡ khỏi ban này"
                          >
                            {deletingDeptMemberId === m.userId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#DFB76C]/30 shrink-0">
              <button
                type="button"
                onClick={() => setDeptPermissionsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
