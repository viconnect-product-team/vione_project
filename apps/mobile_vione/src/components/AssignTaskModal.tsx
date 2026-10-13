// Phân hệ Giao Việc & Chỉnh Sửa Công Việc Trong Cộng Đồng Doanh Nghiệp ViOne (Executive Luxury Style)
// Chuẩn phong cách ViOne: Vàng đồng hoàng gia, text đen than chì, nền trắng ngọc trai / Champagne

import React, { useState, useEffect } from "react";
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

  const isExecutive = Boolean(
    myDeptPermissions?.isExecutive ||
    myDeptPermissions?.departments?.some((d: any) => d.departmentId === "*" || d.departmentName === "*")
  );

  const availableDepartments = React.useMemo(() => {
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

  // Load danh sách nhân sự thực tế
  useEffect(() => {
    if (visible && communityId) {
      loadEmployees();
    }
  }, [visible, communityId]);

  // Đồng bộ dữ liệu khi mở chế độ Edit hoặc Create
  useEffect(() => {
    if (taskToEdit) {
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
      if (employees.length > 0) {
        setSelectedAssigneeId(employees[0].id || employees[0].userId);
        setAssigneeName(employees[0].fullName);
      }
    }
  }, [taskToEdit, visible, employees, availableDepartments]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await communityApi.getCommunityEmployees(communityId);
      if (res?.data?.employees && res.data.employees.length > 0) {
        setEmployees(res.data.employees);
        if (!selectedAssigneeId && !taskToEdit) {
          const first = res.data.employees[0];
          setSelectedAssigneeId(first.id || first.userId);
          setAssigneeName(first.fullName);
        }
      }
    } catch (e) {
      console.warn("Failed to load community employees:", e);
    } finally {
      setLoadingEmployees(false);
    }
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
                  {isEdit ? "Cập nhật thông tin phân công & tiến độ" : "Phân công nhiệm vụ & theo dõi tiến độ"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Form Body */}
          <ScrollView
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.employeeChipsScroll}
                contentContainerStyle={styles.employeeChipsContent}
              >
                {employees.map((emp) => {
                  const empId = emp.id || emp.userId;
                  const isSelected = selectedAssigneeId === empId;
                  return (
                    <TouchableOpacity
                      key={empId}
                      style={[styles.employeeChip, isSelected && styles.employeeChipSelected]}
                      onPress={() => {
                        setSelectedAssigneeId(empId);
                        setAssigneeName(emp.fullName);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.employeeAvatar, isSelected && styles.employeeAvatarSelected]}>
                        <Text style={[styles.employeeAvatarText, isSelected && { color: "#050C15" }]}>
                          {emp.fullName?.charAt(0)?.toUpperCase() || "NV"}
                        </Text>
                      </View>
                      <View style={styles.employeeInfo}>
                        <Text
                          style={[styles.employeeName, isSelected && styles.employeeNameSelected]}
                          numberOfLines={1}
                        >
                          {emp.fullName}
                        </Text>
                        <Text style={styles.employeeRole} numberOfLines={1}>
                          {emp.roleTitle || emp.role || "Thành viên"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Phòng ban & Loại công việc */}
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.inputLabel}>Phòng ban phụ trách</Text>
                {!isExecutive && myDeptPermissions && (
                  <Text style={{ fontSize: 11, color: "#D4AF37", fontWeight: "600" }}>
                    🛡️ Ban được cấp quyền
                  </Text>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                {availableDepartments.map((dept) => {
                  const isSelected = department === dept;
                  return (
                    <TouchableOpacity
                      key={dept}
                      style={[styles.pillOption, isSelected && styles.pillOptionSelected]}
                      onPress={() => setDepartment(dept)}
                    >
                      <Text style={[styles.pillOptionText, isSelected && styles.pillOptionTextSelected]}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loại công việc</Text>
              <View style={styles.pillsRow}>
                {TASK_TYPES.map((type) => {
                  const isSelected = taskType === type.id;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      style={[styles.pillOption, isSelected && styles.pillOptionSelected]}
                      onPress={() => setTaskType(type.id)}
                    >
                      <Text style={[styles.pillOptionText, isSelected && styles.pillOptionTextSelected]}>
                        {type.label}
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
                <TouchableOpacity
                  style={[styles.priorityBtn, priority === "urgent" && styles.priorityBtnUrgent]}
                  onPress={() => setPriority("urgent")}
                >
                  <Text style={[styles.priorityBtnText, priority === "urgent" && styles.priorityBtnTextUrgent]}>
                    Khẩn cấp
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.priorityBtn, priority === "high" && styles.priorityBtnHigh]}
                  onPress={() => setPriority("high")}
                >
                  <Text style={[styles.priorityBtnText, priority === "high" && styles.priorityBtnTextHigh]}>
                    Ưu tiên cao
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.priorityBtn, priority === "medium" && styles.priorityBtnMedium]}
                  onPress={() => setPriority("medium")}
                >
                  <Text style={[styles.priorityBtnText, priority === "medium" && styles.priorityBtnTextMedium]}>
                    Bình thường
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Thời hạn hoàn thành */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Thời hạn hoàn thành <Text style={{ color: "#E11D48" }}>*</Text>
              </Text>
              <View style={styles.quickDeadlinesRow}>
                {["Hôm nay, 17:30", "Ngày mai, 17:30", "Trong 3 ngày tới", "Trong 1 tuần"].map((d) => (
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
                placeholder="Hoặc nhập thời hạn cụ thể (ví dụ: 17:30 15/10/2026)"
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
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
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
    height: 72,
    textAlignVertical: "top",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employeeChipsScroll: {
    marginVertical: 4,
  },
  employeeChipsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  employeeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  employeeChipSelected: {
    backgroundColor: "rgba(223, 183, 108, 0.2)",
    borderColor: "#DFB76C",
  },
  employeeAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  employeeAvatarSelected: {
    backgroundColor: "#DFB76C",
  },
  employeeAvatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  employeeInfo: {
    maxWidth: 140,
  },
  employeeName: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0F172A",
  },
  employeeNameSelected: {
    color: "#8C653B",
  },
  employeeRole: {
    fontSize: 10.5,
    color: "#64748B",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pillOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 6,
  },
  pillOptionSelected: {
    backgroundColor: "#DFB76C",
    borderColor: "#B8860B",
  },
  pillOptionText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  pillOptionTextSelected: {
    color: "#050C15",
    fontWeight: "800",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 9,
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
