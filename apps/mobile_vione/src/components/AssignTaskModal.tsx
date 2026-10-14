// Phân hệ Giao Việc & Chỉnh Sửa Công Việc Trong Cộng Đồng Doanh Nghiệp ViOne (Executive Luxury Style)
// Tích hợp bóc tách tự động nhiệm vụ từ file Word / Excel / PDF & Tự động gán nhân sự theo phòng ban
// Chuẩn phong cách ViOne: Vàng đồng hoàng gia, text đen than chì, nền trắng ngọc trai / Champagne

import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Briefcase,
  User,
  Clock,
  Sparkles,
  Target,
  Phone,
  AlertTriangle,
  Check,
  Trash2,
  Paperclip,
  FileCheck,
  TrendingUp,
  Building2,
  Calendar,
  FileText,
  FileSpreadsheet,
  Plus,
  UploadCloud,
  Edit3,
} from "lucide-react-native";
import { communityApi } from "../api/services";

export interface AssignTaskModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
  taskToEdit?: any | null;
  onTaskCreated?: (task: any) => void;
  onTaskUpdated?: (task: any) => void;
  onTaskDeleted?: (taskId: string) => void;
  myDeptPermissions?: any | null;
  departmentsList?: string[];
}

const DEPARTMENTS = [
  "Ban Giám Đốc",
  "Phòng Kinh Doanh & Bán Hàng",
  "Phòng Kỹ Thuật & Công Nghệ",
  "Phòng Kế Toán & Tài Chính",
  "Phòng Hành Chính & Nhân Sự",
  "Phòng Marketing & Truyền Thông",
  "Vận Hành & Dự Án",
  "Chăm Sóc Khách Hàng CRM",
];

const TASK_TYPES = [
  { id: "general", label: "Nhiệm vụ chung" },
  { id: "consulting", label: "Tư vấn & Chăm sóc KH" },
  { id: "report", label: "Lập hồ sơ & Báo cáo" },
  { id: "project", label: "Triển khai dự án" },
];

const EXCEL_SAMPLE = `Triển khai chiến dịch quảng cáo TikTok & Facebook quý 4,Phòng Marketing & Truyền Thông,Nguyễn Thu Hà,Thứ 6 tuần này,urgent
Gặp gỡ và tư vấn giải pháp CRM cho Khách hàng SunGroup,Phòng Kinh Doanh & Bán Hàng,Trần Minh Hoàng,15:00 ngày mai,high
Kiểm toán và quyết toán báo cáo thuế doanh nghiệp tháng 10,Phòng Kế Toán & Tài Chính,Lê Thị Mai,25/10/2026,high
Nâng cấp hạ tầng server và bảo mật cổng API ViOne,Phòng Kỹ Thuật & Công Nghệ,Phạm Văn Nam,Hôm nay 18:00,urgent`;

const WORD_SAMPLE = `1. Khảo sát nhu cầu khách hàng doanh nghiệp tại TP.HCM và gửi báo cáo phân tích trước 17h.
2. Hoàn thiện bộ hồ sơ quyết toán hợp đồng cung cấp dịch vụ số 88/ViOne.
3. Tổ chức sự kiện kết nối B2B và truyền thông trên fanpage công ty tuần tới.
4. Tối ưu cơ sở dữ liệu và triển khai bản cập nhật hệ thống CRM v2.5.
5. Tuyển dụng thêm 2 chuyên viên tư vấn kinh doanh cho chi nhánh mới.`;

const PDF_SAMPLE = `KẾ HOẠCH DỰ ÁN CHUYỂN ĐỔI SỐ DOANH NGHIỆP VIONE 2026:
- Nhiệm vụ 1: Họp ban chiến lược và duyệt kế hoạch ngân sách Q4
- Nhiệm vụ 2: Liên hệ khách hàng đối tác chiến lược để ký biên bản ghi nhớ
- Nhiệm vụ 3: Thiết kế ấn phẩm truyền thông và phát hành thông cáo báo chí
- Nhiệm vụ 4: Kiểm thử tính năng bóc tách tài liệu và phân quyền phòng ban
- Nhiệm vụ 5: Đào tạo nội bộ cho toàn thể nhân sự về quy trình tiếp nhận công việc`;

// Nhận diện phòng ban thông minh từ từ khóa nội dung nhiệm vụ
const detectDepartment = (text: string, deptList: string[]): string => {
  const lower = (text || "").toLowerCase();
  if (
    lower.includes("kinh doanh") ||
    lower.includes("bán hàng") ||
    lower.includes("sales") ||
    lower.includes("khách hàng") ||
    lower.includes("hợp đồng") ||
    lower.includes("cơ hội") ||
    lower.includes("crm")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("kinh doanh")) || "Phòng Kinh Doanh & Bán Hàng";
  }
  if (
    lower.includes("kỹ thuật") ||
    lower.includes("công nghệ") ||
    lower.includes("it") ||
    lower.includes("tech") ||
    lower.includes("phần mềm") ||
    lower.includes("hệ thống") ||
    lower.includes("app") ||
    lower.includes("code") ||
    lower.includes("server")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("kỹ thuật") || d.toLowerCase().includes("công nghệ")) || "Phòng Kỹ Thuật & Công Nghệ";
  }
  if (
    lower.includes("marketing") ||
    lower.includes("truyền thông") ||
    lower.includes("media") ||
    lower.includes("bài viết") ||
    lower.includes("quảng cáo") ||
    lower.includes("sự kiện") ||
    lower.includes("fanpage")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("marketing") || d.toLowerCase().includes("truyền thông")) || "Phòng Marketing & Truyền Thông";
  }
  if (
    lower.includes("kế toán") ||
    lower.includes("tài chính") ||
    lower.includes("thuế") ||
    lower.includes("hóa đơn") ||
    lower.includes("thanh toán") ||
    lower.includes("chi phí") ||
    lower.includes("ngân sách") ||
    lower.includes("quyết toán")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("kế toán") || d.toLowerCase().includes("tài chính")) || "Phòng Kế Toán & Tài Chính";
  }
  if (
    lower.includes("nhân sự") ||
    lower.includes("hành chính") ||
    lower.includes("tuyển dụng") ||
    lower.includes("đào tạo") ||
    lower.includes("hr") ||
    lower.includes("nội quy")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("nhân sự") || d.toLowerCase().includes("hành chính")) || "Phòng Hành Chính & Nhân Sự";
  }
  if (
    lower.includes("giám đốc") ||
    lower.includes("ban điều hành") ||
    lower.includes("chiến lược") ||
    lower.includes("ceo") ||
    lower.includes("bod") ||
    lower.includes("chủ tịch")
  ) {
    return deptList.find((d) => d.toLowerCase().includes("giám đốc")) || "Ban Giám Đốc";
  }
  return deptList[0] || "Vận Hành & Dự Án";
};

// Tìm thành viên thuộc ban tương ứng từ danh sách nhân sự thật
const matchMemberForDept = (deptName: string, emps: any[]): { id: string; name: string } => {
  if (!emps || emps.length === 0) return { id: "", name: "Nhân sự" };
  const dNorm = (deptName || "").toLowerCase();
  const matched = emps.find((e: any) => {
    const eDept = (e.department || e.role || "").toLowerCase();
    return eDept.includes(dNorm) || dNorm.includes(eDept);
  });
  if (matched) {
    return { id: matched.id || matched.userId || "", name: matched.fullName || matched.name || "Nhân sự" };
  }
  return { id: emps[0].id || emps[0].userId || "", name: emps[0].fullName || emps[0].name || "Nhân sự" };
};

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  visible,
  onClose,
  communityId,
  taskToEdit = null,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  myDeptPermissions = null,
  departmentsList,
}) => {
  const isEdit = Boolean(taskToEdit);

  // Tab chuyển đổi: Giao việc thủ công hoặc Bóc tách từ Word / Excel / PDF
  const [modalMode, setModalMode] = useState<"manual" | "import">("manual");

  const isExecutive = Boolean(
    myDeptPermissions?.isExecutive ||
    myDeptPermissions?.departments?.some((d: any) => d.departmentId === "*" || d.departmentName === "*")
  );

  const availableDepartments = useMemo(() => {
    const baseList = departmentsList && departmentsList.length > 0 ? departmentsList : DEPARTMENTS;
    if (!myDeptPermissions || isExecutive) {
      return baseList;
    }
    const allowed = (myDeptPermissions.departments || [])
      .filter((d: any) => d.canAssign)
      .map((d: any) => d.departmentName);

    if (allowed.length === 0) {
      return baseList;
    }
    return baseList.filter((dept) =>
      allowed.some((a: string) => a.toLowerCase() === dept.toLowerCase())
    );
  }, [departmentsList, myDeptPermissions, isExecutive]);

  // Form states cho giao việc đơn
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeName, setAssigneeName] = useState("Thành viên");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [priority, setPriority] = useState<"urgent" | "high" | "medium">("high");
  const [department, setDepartment] = useState("Vận Hành & Dự Án");
  const [taskType, setTaskType] = useState("general");
  const [deadline, setDeadline] = useState("Hôm nay, 17:30");
  const [progress, setProgress] = useState(0);
  const [progressNote, setProgressNote] = useState("");
  const [attachments, setAttachments] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [reportFileName, setReportFileName] = useState("");
  const [reportFileType, setReportFileType] = useState("other");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerRequirements, setCustomerRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // States cho tính năng bóc tách thông minh từ Word/Excel/PDF
  const [importText, setImportText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<
    Array<{
      id: string;
      title: string;
      description?: string;
      department: string;
      assigneeId: string;
      assigneeName: string;
      priority: "urgent" | "high" | "medium";
      deadline: string;
    }>
  >([]);
  const [isBatchImporting, setIsBatchImporting] = useState(false);

  // Load danh sách nhân sự thực tế
  useEffect(() => {
    if (visible && communityId) {
      loadEmployees();
    }
  }, [visible, communityId]);

  // Đồng bộ dữ liệu khi mở chế độ Edit hoặc Create
  useEffect(() => {
    if (taskToEdit) {
      setModalMode("manual");
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setSelectedAssigneeId(taskToEdit.assigneeId || "");
      setAssigneeName(taskToEdit.assigneeName || "Thành viên");
      setDepartment(taskToEdit.department || "Vận Hành & Dự Án");
      setTaskType(taskToEdit.taskType || "general");
      setPriority(taskToEdit.priority || "high");
      setDeadline(taskToEdit.deadline || "Hôm nay, 17:30");
      setProgress(taskToEdit.progress || 0);
      setProgressNote(taskToEdit.progressNote || "");
      setAttachments(taskToEdit.attachments || "");
      setReportUrl(taskToEdit.reportUrl || "");
      setReportNote(taskToEdit.reportNote || "");
      setReportFileName(taskToEdit.reportFileName || "");
      setReportFileType(taskToEdit.reportFileType || "other");
      setCustomerName(taskToEdit.customerName || "");
      setCustomerPhone(taskToEdit.customerPhone || "");
      setCustomerRequirements(taskToEdit.customerRequirements || "");
    } else {
      setTitle("");
      setDescription("");
      setDepartment(availableDepartments[0] || "Vận Hành & Dự Án");
      setTaskType("general");
      setPriority("high");
      setDeadline("Hôm nay, 17:30");
      setProgress(0);
      setProgressNote("");
      setAttachments("");
      setReportUrl("");
      setReportNote("");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerRequirements("");
      setParsedTasks([]);
      setImportText("");
      if (employees.length > 0) {
        setSelectedAssigneeId(employees[0].id || employees[0].userId);
        setAssigneeName(employees[0].fullName || employees[0].name);
      }
    }
  }, [taskToEdit, visible, employees, availableDepartments]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await communityApi.getCommunityEmployees(communityId);
      const list = (res as any)?.employees || (Array.isArray((res as any)?.data?.employees) ? (res as any).data.employees : []);
      if (Array.isArray(list) && list.length > 0) {
        setEmployees(list);
        if (!selectedAssigneeId && !taskToEdit) {
          const first = list[0];
          setSelectedAssigneeId(first.id || first.userId);
          setAssigneeName(first.fullName || first.name);
        }
      }
    } catch (e) {
      console.warn("Failed to load community employees:", e);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Thuật toán bóc tách văn bản Word / Excel / PDF
  const handleExtractFromText = () => {
    if (!importText.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập hoặc dán nội dung văn bản / bảng công việc để bóc tách!");
      return;
    }

    setIsExtracting(true);
    try {
      const rawLines = importText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const newTasks: Array<{
        id: string;
        title: string;
        description?: string;
        department: string;
        assigneeId: string;
        assigneeName: string;
        priority: "urgent" | "high" | "medium";
        deadline: string;
      }> = [];

      for (let idx = 0; idx < rawLines.length; idx++) {
        const line = rawLines[idx];
        if (
          idx === 0 &&
          (line.toLowerCase().includes("tiêu đề") ||
            line.toLowerCase().includes("công việc") ||
            line.toLowerCase().includes("title") ||
            line.toLowerCase().includes("stt"))
        ) {
          continue;
        }

        // Bóc tách bảng dữ liệu CSV / Excel tab-delimited
        if (line.includes(",") || line.includes("\t") || line.includes(";")) {
          const delimiter = line.includes("\t") ? "\t" : line.includes(";") ? ";" : ",";
          const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""));
          if (cols[0]) {
            const rawTitle = cols[0];
            const deptCandidate = cols[1] || detectDepartment(rawTitle, availableDepartments);
            const dept = availableDepartments.find((d) => d.toLowerCase() === deptCandidate.toLowerCase()) || deptCandidate;
            const matchedMember = matchMemberForDept(dept, employees);
            const priorityVal: "urgent" | "high" | "medium" =
              (cols[4] as any) === "urgent" || cols[4]?.toLowerCase().includes("khẩn")
                ? "urgent"
                : (cols[4] as any) === "medium" || cols[4]?.toLowerCase().includes("thường")
                ? "medium"
                : "high";

            newTasks.push({
              id: `imported-${Date.now()}-${idx}`,
              title: rawTitle,
              description: `Bóc tách từ bảng dữ liệu · ${dept}`,
              department: dept,
              assigneeId: cols[2] ? (employees.find((e) => (e.fullName || e.name) === cols[2])?.id || matchedMember.id) : matchedMember.id,
              assigneeName: cols[2] || matchedMember.name,
              priority: priorityVal,
              deadline: cols[3] || "Hôm nay, 17:30",
            });
            continue;
          }
        }

        // Bóc tách văn bản Word / PDF (danh sách gạch đầu dòng hoặc số thứ tự)
        const cleaned = line.replace(/^(\d+[\.\)]|\-|\*|\•)\s*/, "").trim();
        if (cleaned.length > 5) {
          const dept = detectDepartment(cleaned, availableDepartments);
          const matchedMember = matchMemberForDept(dept, employees);
          const isUrgent = cleaned.toLowerCase().includes("gấp") || cleaned.toLowerCase().includes("khẩn") || cleaned.toLowerCase().includes("ngay");

          newTasks.push({
            id: `imported-${Date.now()}-${idx}`,
            title: cleaned,
            description: `Bóc tách tự động · Thuộc ${dept}`,
            department: dept,
            assigneeId: matchedMember.id,
            assigneeName: matchedMember.name,
            priority: isUrgent ? "urgent" : "high",
            deadline: "Hôm nay, 17:30",
          });
        }
      }

      if (newTasks.length === 0) {
        Alert.alert("Không tìm thấy đầu việc", "Không thể trích xuất đầu việc nào từ nội dung đã nhập. Vui lòng kiểm tra lại cấu trúc văn bản!");
      } else {
        setParsedTasks(newTasks);
        Alert.alert(
          "Bóc tách thành công",
          `Đã tìm thấy ${newTasks.length} nhiệm vụ và tự động chỉ định phòng ban & nhân sự phụ trách phù hợp!`
        );
      }
    } catch (e: any) {
      Alert.alert("Lỗi bóc tách", e?.message || "Có lỗi xảy ra khi xử lý văn bản.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Giao việc hàng loạt từ danh sách bóc tách
  const handleBatchSubmit = async () => {
    if (parsedTasks.length === 0) {
      Alert.alert("Chưa có nhiệm vụ", "Vui lòng bóc tách danh sách nhiệm vụ trước khi giao việc!");
      return;
    }

    setIsBatchImporting(true);
    try {
      const payloadTasks = parsedTasks.map((t) => ({
        title: t.title,
        description: t.description || `Nhiệm vụ phân công cho ${t.department}`,
        department: t.department,
        assigneeId: t.assigneeId,
        assigneeName: t.assigneeName,
        priority: t.priority,
        deadline: t.deadline,
        progress: 0,
      }));

      await communityApi.importCommunityTasks(communityId, payloadTasks);
      Alert.alert(
        "Giao việc thành công",
        `Đã tạo và phân công thành công ${parsedTasks.length} nhiệm vụ theo phòng ban và nhân sự!`
      );
      if (onTaskCreated) {
        parsedTasks.forEach((pt) => {
          onTaskCreated({
            ...pt,
            status: "assigned",
            createdAt: new Date().toISOString(),
          });
        });
      }
      onClose();
    } catch (err: any) {
      Alert.alert("Lỗi giao việc", err?.message || "Không thể lưu danh sách nhiệm vụ hàng loạt.");
    } finally {
      setIsBatchImporting(false);
    }
  };

  // Cập nhật từng nhiệm vụ đã bóc tách
  const updateParsedTask = (id: string, field: string, value: any) => {
    setParsedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // Xóa 1 nhiệm vụ khỏi danh sách bóc tách
  const removeParsedTask = (id: string) => {
    setParsedTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề công việc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        department: department.trim(),
        taskType,
        assigneeId: selectedAssigneeId || undefined,
        assigneeName: assigneeName.trim() || "Nhân sự",
        priority,
        deadline: deadline.trim() || "Trong hôm nay",
        progress,
        progressNote: progressNote.trim(),
        attachments: attachments.trim(),
        reportUrl: reportUrl.trim(),
        reportNote: reportNote.trim(),
        reportFileName: reportFileName.trim() || undefined,
        reportFileType: reportFileType.trim() || undefined,
        customerName: customerName.trim() || null,
        customerPhone: customerPhone.trim() || null,
        customerRequirements: customerRequirements.trim() || null,
      };

      if (isEdit && taskToEdit?.id) {
        const res = await communityApi.updateCommunityTask(communityId, taskToEdit.id, payload);
        Alert.alert("Thành công", `Đã cập nhật công việc "${title}"!`);
        if (onTaskUpdated) {
          onTaskUpdated(res?.data?.task || { ...taskToEdit, ...payload });
        }
      } else {
        const res = await communityApi.createCommunityTask(communityId, payload);
        Alert.alert("Thành công", `Đã giao việc "${title}" cho ${assigneeName}!`);
        if (onTaskCreated) {
          onTaskCreated(res?.data?.task || payload);
        }
      }

      onClose();
    } catch (err: any) {
      Alert.alert("Lỗi", err?.message || "Không thể lưu công việc. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!taskToEdit?.id) return;

    Alert.alert(
      "Xác nhận xóa việc",
      `Bạn có chắc chắn muốn xóa vĩnh viễn công việc: "${taskToEdit.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa việc",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await communityApi.deleteCommunityTask(communityId, taskToEdit.id);
              Alert.alert("Thành công", "Đã xóa công việc!");
              if (onTaskDeleted) {
                onTaskDeleted(taskToEdit.id);
              }
              onClose();
            } catch {
              Alert.alert("Lỗi", "Không thể xóa công việc. Vui lòng kiểm tra quyền hạn!");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <LinearGradient
            colors={["#FFFFFF", "#FAF8F5", "#F5EEDC"]}
            style={styles.modalHeader}
          >
            <View style={styles.headerLeft}>
              <View style={styles.iconWrap}>
                <Briefcase size={20} color="#050C15" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {isEdit ? "Chỉnh sửa công việc" : "Giao việc nhân sự"}
                </Text>
                <Text style={styles.headerSub}>
                  {isEdit ? "Cập nhật thông tin phân công & tiến độ" : "Phân công nhiệm vụ & bóc tách tự động"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Mode Switcher Tabs (Chỉ hiển thị khi tạo mới, không hiển thị khi edit) */}
          {!isEdit && (
            <View style={styles.modeTabsRow}>
              <TouchableOpacity
                style={[
                  styles.modeTabBtn,
                  modalMode === "manual" && styles.modeTabBtnActive,
                ]}
                onPress={() => setModalMode("manual")}
                activeOpacity={0.8}
              >
                <Edit3
                  size={14}
                  color={modalMode === "manual" ? "#8C653B" : "#64748B"}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    modalMode === "manual" && styles.modeTabTextActive,
                  ]}
                >
                  Giao việc thủ công
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeTabBtn,
                  modalMode === "import" && styles.modeTabBtnActive,
                ]}
                onPress={() => setModalMode("import")}
                activeOpacity={0.8}
              >
                <FileSpreadsheet
                  size={14}
                  color={modalMode === "import" ? "#8C653B" : "#64748B"}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    modalMode === "import" && styles.modeTabTextActive,
                  ]}
                >
                  Import Word / Excel / PDF
                </Text>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>Tự động</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Form Body */}
          <ScrollView
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ========================================================================= */}
            {/* CHẾ ĐỘ 1: IMPORT TỰ ĐỘNG TỪ WORD / EXCEL / PDF                           */}
            {/* ========================================================================= */}
            {modalMode === "import" && !isEdit && (
              <View style={styles.importContainer}>
                {/* Banner hướng dẫn tính năng */}
                <View style={styles.smartIntroBox}>
                  <View style={styles.smartIntroHeader}>
                    <Sparkles size={16} color="#B8860B" />
                    <Text style={styles.smartIntroTitle}>
                      Bóc Tách Việc Tự Động Từ Tài Liệu
                    </Text>
                  </View>
                  <Text style={styles.smartIntroDesc}>
                    Hỗ trợ dán hoặc nhập nội dung từ file Word, Excel, PDF. Hệ thống sẽ tự động bóc tách từng đầu việc, nhận diện phòng ban và gán nhân sự trực thuộc phù hợp.
                  </Text>

                  {/* Nút bấm chọn mẫu thử nhanh */}
                  <View style={styles.sampleButtonsRow}>
                    <Text style={styles.sampleLabel}>Mẫu nhanh:</Text>
                    <TouchableOpacity
                      style={styles.sampleBtn}
                      onPress={() => setImportText(EXCEL_SAMPLE)}
                    >
                      <Text style={styles.sampleBtnText}>📊 Mẫu Excel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sampleBtn}
                      onPress={() => setImportText(WORD_SAMPLE)}
                    >
                      <Text style={styles.sampleBtnText}>📝 Mẫu Word</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sampleBtn}
                      onPress={() => setImportText(PDF_SAMPLE)}
                    >
                      <Text style={styles.sampleBtnText}>📑 Mẫu PDF</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Khung dán nội dung văn bản */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Nội dung văn bản / Bảng công việc <Text style={{ color: "#E11D48" }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.textInput, styles.importTextArea]}
                    placeholder="Dán nội dung từ file Word, bảng tính Excel hoặc tài liệu PDF vào đây..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={6}
                    value={importText}
                    onChangeText={setImportText}
                  />
                </View>

                {/* Nút kích hoạt bóc tách */}
                <TouchableOpacity
                  style={styles.extractActionBtn}
                  onPress={handleExtractFromText}
                  disabled={isExtracting}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#DFB76C", "#B8860B"]}
                    style={styles.extractActionGrad}
                  >
                    {isExtracting ? (
                      <ActivityIndicator size="small" color="#050C15" />
                    ) : (
                      <>
                        <Sparkles size={16} color="#050C15" strokeWidth={2.5} />
                        <Text style={styles.extractActionBtnText}>
                          Bóc tách nhiệm vụ & Tự động gán nhân sự
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Danh sách nhiệm vụ tự động sinh ra (Dynamically Generated Task Cards) */}
                {parsedTasks.length > 0 && (
                  <View style={styles.parsedTasksSection}>
                    <View style={styles.parsedSectionHeader}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <FileCheck size={16} color="#0284C7" />
                        <Text style={styles.parsedSectionTitle}>
                          Danh sách việc đã bóc tách ({parsedTasks.length})
                        </Text>
                      </View>
                      <Text style={styles.parsedSectionHint}>
                        Chạm để chỉnh sửa trước khi giao
                      </Text>
                    </View>

                    {parsedTasks.map((t, idx) => (
                      <View key={t.id} style={styles.parsedTaskCard}>
                        {/* Tiêu đề & nút xóa */}
                        <View style={styles.parsedTaskHeader}>
                          <View style={styles.taskIndexBadge}>
                            <Text style={styles.taskIndexText}>#{idx + 1}</Text>
                          </View>
                          <TextInput
                            style={styles.parsedTaskTitleInput}
                            value={t.title}
                            onChangeText={(val) => updateParsedTask(t.id, "title", val)}
                            placeholder="Tiêu đề việc..."
                          />
                          <TouchableOpacity
                            onPress={() => removeParsedTask(t.id)}
                            style={styles.removeParsedTaskBtn}
                          >
                            <Trash2 size={14} color="#E11D48" />
                          </TouchableOpacity>
                        </View>

                        {/* Chọn phòng ban (Tự động nhận diện) */}
                        <View style={styles.parsedFieldRow}>
                          <Text style={styles.parsedFieldLabel}>Phòng ban:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {availableDepartments.map((dept) => {
                              const isSel = t.department === dept;
                              return (
                                <TouchableOpacity
                                  key={dept}
                                  style={[
                                    styles.miniChip,
                                    isSel && styles.miniChipActive,
                                  ]}
                                  onPress={() => {
                                    updateParsedTask(t.id, "department", dept);
                                    // Tự động tìm lại nhân sự ứng với ban mới
                                    const match = matchMemberForDept(dept, employees);
                                    updateParsedTask(t.id, "assigneeId", match.id);
                                    updateParsedTask(t.id, "assigneeName", match.name);
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.miniChipText,
                                      isSel && styles.miniChipTextActive,
                                    ]}
                                  >
                                    {dept}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>

                        {/* Nhân sự phụ trách (Tự động gán) */}
                        <View style={styles.parsedFieldRow}>
                          <Text style={styles.parsedFieldLabel}>Nhân sự:</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {employees.map((emp) => {
                              const empId = emp.id || emp.userId;
                              const empName = emp.fullName || emp.name;
                              const isSel = t.assigneeId === empId || t.assigneeName === empName;
                              return (
                                <TouchableOpacity
                                  key={empId || empName}
                                  style={[
                                    styles.miniChip,
                                    isSel && styles.miniChipActiveGold,
                                  ]}
                                  onPress={() => {
                                    updateParsedTask(t.id, "assigneeId", empId);
                                    updateParsedTask(t.id, "assigneeName", empName);
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.miniChipText,
                                      isSel && styles.miniChipTextActiveGold,
                                    ]}
                                  >
                                    👤 {empName}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>

                        {/* Mức độ ưu tiên & Hạn chót */}
                        <View style={styles.parsedMetaRow}>
                          <View style={{ flexDirection: "row", gap: 4 }}>
                            {(["urgent", "high", "medium"] as const).map((p) => {
                              const isSel = t.priority === p;
                              return (
                                <TouchableOpacity
                                  key={p}
                                  style={[
                                    styles.priorityMiniBtn,
                                    p === "urgent" && isSel && styles.priorityMiniUrgent,
                                    p === "high" && isSel && styles.priorityMiniHigh,
                                    p === "medium" && isSel && styles.priorityMiniMedium,
                                  ]}
                                  onPress={() => updateParsedTask(t.id, "priority", p)}
                                >
                                  <Text
                                    style={[
                                      styles.priorityMiniText,
                                      isSel && styles.priorityMiniTextActive,
                                    ]}
                                  >
                                    {p === "urgent" ? "Khẩn" : p === "high" ? "Cao" : "Thường"}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <TextInput
                              style={styles.deadlineMiniInput}
                              value={t.deadline}
                              onChangeText={(val) => updateParsedTask(t.id, "deadline", val)}
                              placeholder="Hạn chót..."
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={{ height: 24 }} />
              </View>
            )}

            {/* ========================================================================= */}
            {/* CHẾ ĐỘ 2: GIAO VIỆC THỦ CÔNG (HOẶC CHẾ ĐỘ EDIT)                           */}
            {/* ========================================================================= */}
            {(modalMode === "manual" || isEdit) && (
              <>
                {/* Tiêu đề */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Tiêu đề công việc <Text style={{ color: "#E11D48" }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ví dụ: Tư vấn triển khai CRM cho Tập đoàn X..."
                    placeholderTextColor="#94A3B8"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Mô tả */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mô tả công việc</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Mục tiêu, nội dung cần làm và tiêu chuẩn đầu ra..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                {/* Chọn nhân sự phụ trách */}
                <View style={styles.inputGroup}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.inputLabel}>
                      Nhân sự phụ trách <Text style={{ color: "#E11D48" }}>*</Text>
                    </Text>
                    {loadingEmployees && <ActivityIndicator size="small" color="#B8860B" />}
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {employees.map((emp) => {
                      const empId = emp.id || emp.userId;
                      const empName = emp.fullName || emp.name;
                      const isSelected = selectedAssigneeId === empId || assigneeName === empName;
                      return (
                        <TouchableOpacity
                          key={empId || empName}
                          style={[styles.employeeChip, isSelected && styles.employeeChipActive]}
                          onPress={() => {
                            setSelectedAssigneeId(empId);
                            setAssigneeName(empName);
                            if (emp.department) {
                              setDepartment(emp.department);
                            }
                          }}
                        >
                          <User size={13} color={isSelected ? "#8C653B" : "#64748B"} />
                          <Text style={[styles.employeeChipText, isSelected && styles.employeeChipTextActive]}>
                            {empName}
                          </Text>
                          {emp.role && (
                            <Text style={styles.employeeChipSubText}>
                              · {emp.role}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Phòng ban phụ trách */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Phòng ban đảm nhận <Text style={{ color: "#E11D48" }}>*</Text>
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {availableDepartments.map((dept) => {
                      const isSelected = department === dept;
                      return (
                        <TouchableOpacity
                          key={dept}
                          style={[styles.deptChip, isSelected && styles.deptChipActive]}
                          onPress={() => setDepartment(dept)}
                        >
                          <Building2 size={13} color={isSelected ? "#8C653B" : "#64748B"} />
                          <Text style={[styles.deptChipText, isSelected && styles.deptChipTextActive]}>
                            {dept}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Loại nhiệm vụ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Loại nhiệm vụ</Text>
                  <View style={styles.taskTypeGrid}>
                    {TASK_TYPES.map((t) => {
                      const isSelected = taskType === t.id;
                      return (
                        <TouchableOpacity
                          key={t.id}
                          style={[styles.taskTypeBtn, isSelected && styles.taskTypeBtnActive]}
                          onPress={() => setTaskType(t.id)}
                        >
                          <Text style={[styles.taskTypeText, isSelected && styles.taskTypeTextActive]}>
                            {t.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Mức độ ưu tiên */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mức độ ưu tiên</Text>
                  <View style={styles.priorityRow}>
                    {(
                      [
                        { id: "urgent", label: "Khẩn cấp", color: "#E11D48" },
                        { id: "high", label: "Quan trọng", color: "#D97706" },
                        { id: "medium", label: "Tiêu chuẩn", color: "#2563EB" },
                      ] as const
                    ).map((p) => {
                      const isSelected = priority === p.id;
                      return (
                        <TouchableOpacity
                          key={p.id}
                          style={[
                            styles.priorityBtn,
                            isSelected &&
                              (p.id === "urgent"
                                ? styles.priorityBtnUrgent
                                : p.id === "high"
                                ? styles.priorityBtnHigh
                                : styles.priorityBtnMedium),
                          ]}
                          onPress={() => setPriority(p.id)}
                        >
                          <Text
                            style={[
                              styles.priorityBtnText,
                              isSelected &&
                                (p.id === "urgent"
                                  ? styles.priorityBtnTextUrgent
                                  : p.id === "high"
                                  ? styles.priorityBtnTextHigh
                                  : styles.priorityBtnTextMedium),
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Hạn hoàn thành */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hạn hoàn thành</Text>
                  <View style={styles.quickDeadlinesRow}>
                    {["Hôm nay, 17:30", "Ngày mai, 12:00", "Thứ 6 tuần này", "Cuối tháng"].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.quickDeadlineBtn, deadline === d && styles.quickDeadlineBtnActive]}
                        onPress={() => setDeadline(d)}
                      >
                        <Text style={[styles.quickDeadlineText, deadline === d && styles.quickDeadlineTextActive]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={[styles.textInput, { marginTop: 6 }]}
                    placeholder="Hoặc nhập ngày giờ cụ thể..."
                    placeholderTextColor="#94A3B8"
                    value={deadline}
                    onChangeText={setDeadline}
                  />
                </View>

                {/* Tiến độ % và ghi chú */}
                <View style={styles.cardSection}>
                  <View style={styles.cardSectionHeader}>
                    <TrendingUp size={16} color="#B8860B" />
                    <Text style={styles.cardSectionTitle}>Tiến độ công việc: {progress}%</Text>
                  </View>

                  <View style={styles.progressChipsRow}>
                    {[0, 25, 50, 75, 100].map((val) => (
                      <TouchableOpacity
                        key={val}
                        style={[styles.progressChip, progress === val && styles.progressChipActive]}
                        onPress={() => setProgress(val)}
                      >
                        <Text style={[styles.progressChipText, progress === val && styles.progressChipTextActive]}>
                          {val}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={[styles.textInput, { marginTop: 8 }]}
                    placeholder="Ghi chú tiến độ hiện tại..."
                    placeholderTextColor="#94A3B8"
                    value={progressNote}
                    onChangeText={setProgressNote}
                  />
                </View>

                {/* Tệp đính kèm & Báo cáo kết quả */}
                <View style={[styles.cardSection, { backgroundColor: "#F0F9FF", borderColor: "#BAE6FD" }]}>
                  <View style={styles.cardSectionHeader}>
                    <Paperclip size={16} color="#0284C7" />
                    <Text style={[styles.cardSectionTitle, { color: "#0369A1" }]}>Tệp đính kèm & Nghiệm thu</Text>
                  </View>

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF", marginBottom: 8 }]}
                    placeholder="Link tệp tài liệu / hồ sơ đính kèm..."
                    placeholderTextColor="#94A3B8"
                    value={attachments}
                    onChangeText={setAttachments}
                  />

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF", marginBottom: 8 }]}
                    placeholder="Link báo cáo kết quả / nghiệm thu công việc..."
                    placeholderTextColor="#94A3B8"
                    value={reportUrl}
                    onChangeText={setReportUrl}
                  />

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF" }]}
                    placeholder="Nội dung kết quả hoàn thành..."
                    placeholderTextColor="#94A3B8"
                    value={reportNote}
                    onChangeText={setReportNote}
                  />
                </View>

                {/* Khách hàng CRM liên kết */}
                <View style={[styles.cardSection, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
                  <View style={styles.cardSectionHeader}>
                    <Target size={16} color="#D97706" />
                    <Text style={[styles.cardSectionTitle, { color: "#B45309" }]}>Liên kết khách hàng CRM</Text>
                  </View>

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF", marginBottom: 8 }]}
                    placeholder="Tên khách hàng / doanh nghiệp..."
                    placeholderTextColor="#94A3B8"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF", marginBottom: 8 }]}
                    placeholder="Số điện thoại liên hệ..."
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />

                  <TextInput
                    style={[styles.textInput, { backgroundColor: "#FFFFFF" }]}
                    placeholder="Yêu cầu / Nhu cầu khách hàng..."
                    placeholderTextColor="#94A3B8"
                    value={customerRequirements}
                    onChangeText={setCustomerRequirements}
                  />
                </View>

                <View style={{ height: 30 }} />
              </>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            {modalMode === "import" && !isEdit ? (
              <>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { flex: 1 },
                    parsedTasks.length === 0 && { opacity: 0.5 },
                  ]}
                  onPress={handleBatchSubmit}
                  disabled={isBatchImporting || parsedTasks.length === 0}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#DFB76C", "#B8860B"]}
                    style={styles.submitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isBatchImporting ? (
                      <ActivityIndicator size="small" color="#050C15" />
                    ) : (
                      <>
                        <Check size={18} color="#050C15" strokeWidth={3} />
                        <Text style={styles.submitBtnText}>
                          {parsedTasks.length > 0
                            ? `Giao hàng loạt (${parsedTasks.length} việc)`
                            : "Chưa có việc để giao"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isEdit && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDelete}
                    disabled={isDeleting || isSubmitting}
                    activeOpacity={0.8}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#E11D48" />
                    ) : (
                      <>
                        <Trash2 size={16} color="#E11D48" />
                        <Text style={styles.deleteBtnText}>Xóa việc</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitBtn, { flex: 1 }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting || isDeleting}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#DFB76C", "#B8860B"]}
                    style={styles.submitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#050C15" />
                    ) : (
                      <>
                        <Check size={18} color="#050C15" strokeWidth={3} />
                        <Text style={styles.submitBtnText}>
                          {isEdit ? "Lưu thay đổi" : "Hoàn tất giao việc"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#DFB76C",
    maxHeight: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(223, 183, 108, 0.3)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#DFB76C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DFB76C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modeTabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
    backgroundColor: "#FAF8F5",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(223, 183, 108, 0.2)",
  },
  modeTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modeTabBtnActive: {
    backgroundColor: "rgba(223, 183, 108, 0.18)",
    borderColor: "#DFB76C",
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  modeTabTextActive: {
    fontWeight: "800",
    color: "#8C653B",
  },
  aiBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: "#B8860B",
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  importTextArea: {
    height: 120,
    textAlignVertical: "top",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
  },
  importContainer: {
    marginBottom: 16,
  },
  smartIntroBox: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(223, 183, 108, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(223, 183, 108, 0.35)",
    marginBottom: 14,
  },
  smartIntroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  smartIntroTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#8C653B",
  },
  smartIntroDesc: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
    marginBottom: 8,
  },
  sampleButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8C653B",
  },
  sampleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFB76C",
  },
  sampleBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  extractActionBtn: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  extractActionGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  extractActionBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#050C15",
  },
  parsedTasksSection: {
    marginTop: 6,
  },
  parsedSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  parsedSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  parsedSectionHint: {
    fontSize: 11,
    color: "#94A3B8",
  },
  parsedTaskCard: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "rgba(223, 183, 108, 0.3)",
    marginBottom: 10,
  },
  parsedTaskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  taskIndexBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#DFB76C",
  },
  taskIndexText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#050C15",
  },
  parsedTaskTitleInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeParsedTaskBtn: {
    padding: 4,
  },
  parsedFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  parsedFieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    width: 65,
  },
  miniChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 4,
  },
  miniChipActive: {
    backgroundColor: "rgba(2, 132, 199, 0.12)",
    borderColor: "#0284C7",
  },
  miniChipText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#64748B",
  },
  miniChipTextActive: {
    color: "#0284C7",
    fontWeight: "800",
  },
  miniChipActiveGold: {
    backgroundColor: "rgba(223, 183, 108, 0.25)",
    borderColor: "#B8860B",
  },
  miniChipTextActiveGold: {
    color: "#8C653B",
    fontWeight: "800",
  },
  parsedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priorityMiniBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  priorityMiniUrgent: {
    backgroundColor: "#FFE4E6",
    borderColor: "#F43F5E",
  },
  priorityMiniHigh: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  priorityMiniMedium: {
    backgroundColor: "#F0F9FF",
    borderColor: "#0284C7",
  },
  priorityMiniText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  priorityMiniTextActive: {
    fontWeight: "800",
    color: "#0F172A",
  },
  deadlineMiniInput: {
    fontSize: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "#0F172A",
  },
  chipScroll: {
    flexDirection: "row",
    marginTop: 2,
    marginBottom: 4,
  },
  employeeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  employeeChipActive: {
    backgroundColor: "rgba(223, 183, 108, 0.25)",
    borderColor: "#DFB76C",
  },
  employeeChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  employeeChipTextActive: {
    color: "#8C653B",
    fontWeight: "800",
  },
  employeeChipSubText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  deptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  deptChipActive: {
    backgroundColor: "rgba(223, 183, 108, 0.25)",
    borderColor: "#DFB76C",
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  deptChipTextActive: {
    color: "#8C653B",
    fontWeight: "800",
  },
  taskTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  taskTypeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  taskTypeBtnActive: {
    backgroundColor: "rgba(223, 183, 108, 0.25)",
    borderColor: "#DFB76C",
  },
  taskTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  taskTypeTextActive: {
    color: "#8C653B",
    fontWeight: "800",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  priorityBtnUrgent: {
    backgroundColor: "#FFE4E6",
    borderColor: "#F43F5E",
  },
  priorityBtnHigh: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  priorityBtnMedium: {
    backgroundColor: "#F1F5F9",
    borderColor: "#CBD5E1",
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  priorityBtnTextUrgent: {
    color: "#BE123C",
  },
  priorityBtnTextHigh: {
    color: "#B45309",
  },
  priorityBtnTextMedium: {
    color: "#334155",
  },
  quickDeadlinesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  quickDeadlineBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickDeadlineBtnActive: {
    backgroundColor: "rgba(223, 183, 108, 0.25)",
    borderColor: "#DFB76C",
  },
  quickDeadlineText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  quickDeadlineTextActive: {
    color: "#8C653B",
    fontWeight: "800",
  },
  cardSection: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "rgba(223, 183, 108, 0.3)",
    marginBottom: 14,
  },
  cardSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardSectionTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#8C653B",
    textTransform: "uppercase",
  },
  progressChipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  progressChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  progressChipActive: {
    backgroundColor: "#DFB76C",
    borderColor: "#B8860B",
  },
  progressChipText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#64748B",
  },
  progressChipTextActive: {
    color: "#050C15",
    fontWeight: "900",
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(223, 183, 108, 0.25)",
    backgroundColor: "#FFFFFF",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#E11D48",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
  },
  submitBtn: {
    borderRadius: 14,
    overflow: "hidden",
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#050C15",
  },
});
