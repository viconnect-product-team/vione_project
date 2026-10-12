// Phân hệ Quản lý & Phân quyền Phòng ban Nội bộ ViOne (Department-based RBAC)
// Chuẩn phong cách ViOne: Champagne Gold hoàng gia, thẻ bo góc 24px, dark/light mode

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  ShieldCheck,
  UserCheck,
  User,
  UserPlus,
  Trash2,
  Check,
  Building2,
  Users,
} from "lucide-react-native";
import { communityApi } from "../api/services";

export interface DepartmentPermissionsModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
  isDark?: boolean;
  onPermissionsUpdated?: () => void;
}

export const DepartmentPermissionsModal: React.FC<DepartmentPermissionsModalProps> = ({
  visible,
  onClose,
  communityId,
  isDark = false,
  onPermissionsUpdated,
}) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form gán quyền
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"lead" | "member">("member");
  const [canAssign, setCanAssign] = useState(false);
  const [canAccept, setCanAccept] = useState(true);
  const [canReport, setCanReport] = useState(true);
  const [canHandover, setCanHandover] = useState(true);
  const [canMeet, setCanMeet] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (visible && communityId) {
      loadInitialData();
    }
  }, [visible, communityId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes, memRes] = await Promise.all([
        communityApi.getCommunityDepartments(communityId).catch(() => null),
        communityApi.getCommunityEmployees(communityId).catch(() => null),
        communityApi.getDepartmentMembers(communityId).catch(() => null),
      ]);

      const depts = (deptRes as any)?.data?.departments || (deptRes as any)?.departments || [
        { id: "dept-1", name: "Ban Giám Đốc" },
        { id: "dept-2", name: "Phòng Kinh Doanh & Bán Hàng" },
        { id: "dept-3", name: "Phòng Kỹ Thuật & Công Nghệ" },
        { id: "dept-4", name: "Phòng Kế Toán & Tài Chính" },
        { id: "dept-5", name: "Phòng Hành Chính & Nhân Sự" },
        { id: "dept-6", name: "Phòng Marketing & Truyền Thông" },
      ];
      setDepartments(depts);
      if (depts.length > 0 && !selectedDeptId) {
        setSelectedDeptId(depts[0].id || depts[0].name);
        setSelectedDeptName(depts[0].name);
      }

      const emps = empRes?.data?.employees || (empRes as any)?.employees || [];
      setEmployees(emps);
      if (emps.length > 0 && !selectedUserId) {
        const first = emps[0];
        setSelectedUserId(first.id || first.userId);
        setSelectedUserName(first.fullName || first.name || "Nhân sự");
      }

      const memberList = (memRes as any)?.data?.members || (memRes as any)?.members || [];
      setMembers(memberList);
    } catch (e) {
      console.warn("Failed to load department RBAC data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: "lead" | "member") => {
    setSelectedRole(role);
    if (role === "lead") {
      setCanAssign(true);
      setCanAccept(true);
      setCanReport(true);
      setCanHandover(true);
      setCanMeet(true);
    } else {
      setCanAssign(false);
      setCanAccept(true);
      setCanReport(true);
      setCanHandover(true);
      setCanMeet(true);
    }
  };

  const handleSavePermission = async () => {
    if (!selectedDeptId || !selectedUserId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn đầy đủ phòng ban và nhân sự!");
      return;
    }

    setSaving(true);
    try {
      const chosenDept = departments.find((d) => (d.id || d.name) === selectedDeptId || d.name === selectedDeptId);
      const chosenEmp = employees.find((e) => (e.id || e.userId) === selectedUserId);

      const dName = chosenDept?.name || selectedDeptName;
      const uName = chosenEmp?.fullName || chosenEmp?.name || selectedUserName || "Nhân sự";

      await communityApi.assignDepartmentMember(communityId, {
        departmentId: selectedDeptId,
        departmentName: dName,
        userId: selectedUserId,
        userName: uName,
        userEmail: chosenEmp?.email || "",
        userPhone: chosenEmp?.phone || "",
        role: selectedRole,
        canAssign,
        canAccept,
        canReport,
        canHandover,
        canMeet,
      });

      Alert.alert("✓ Thành công", `Đã phân quyền cho "${uName}" trong "${dName}"!`);
      // Reload members list
      const memRes = await communityApi.getDepartmentMembers(communityId).catch(() => null);
      if ((memRes as any)?.members) {
        setMembers((memRes as any).members);
      }
      onPermissionsUpdated?.();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu phân quyền phòng ban. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (departmentId: string, userId: string, userName: string) => {
    Alert.alert(
      "Gỡ quyền thành viên?",
      `Bạn có chắc chắn muốn gỡ quyền của ${userName} khỏi ban này?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận gỡ",
          style: "destructive",
          onPress: async () => {
            setDeletingUserId(userId);
            try {
              await communityApi.deleteDepartmentMember(communityId, departmentId, userId);
              setMembers((prev) => prev.filter((m) => !(m.departmentId === departmentId && m.userId === userId)));
              Alert.alert("✓ Đã gỡ thành công", `Đã gỡ quyền của ${userName} khỏi ban!`);
              onPermissionsUpdated?.();
            } catch {
              Alert.alert("Lỗi", "Không thể gỡ thành viên khỏi ban!");
            } finally {
              setDeletingUserId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalSheet,
            { backgroundColor: isDark ? "#0F172A" : "#FFFFFF", borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "#E2E8F0" },
          ]}
        >
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#F1F5F9" }]}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconWrap}>
                <ShieldCheck size={20} color="#D8B282" />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.titleText, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    Phân Quyền Ban Nội Bộ
                  </Text>
                  <View style={styles.badgeExecutive}>
                    <Text style={styles.badgeExecutiveText}>ViOne RBAC</Text>
                  </View>
                </View>
                <Text style={styles.subtitleText}>
                  Add vào ban nào chỉ được thao tác chức năng ở ban đó
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={isDark ? "#94A3B8" : "#64748B"} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#DFB76C" />
              <Text style={styles.loadingText}>Đang tải dữ liệu phân quyền ban...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Card Gán Quyền Thành Viên */}
              <View
                style={[
                  styles.formCard,
                  { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#E2E8F0" },
                ]}
              >
                <View style={styles.formCardHeader}>
                  <UserPlus size={16} color="#D8B282" />
                  <Text style={[styles.formCardTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    Gán nhân sự vào ban & Cấp quyền
                  </Text>
                </View>

                {/* Chọn Phòng ban */}
                <Text style={[styles.fieldLabel, { color: isDark ? "#CBD5E1" : "#334155" }]}>
                  Chọn phòng ban:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {departments.map((dept) => {
                    const isSelected = (dept.id || dept.name) === selectedDeptId || dept.name === selectedDeptId;
                    return (
                      <TouchableOpacity
                        key={dept.id || dept.name}
                        onPress={() => {
                          setSelectedDeptId(dept.id || dept.name);
                          setSelectedDeptName(dept.name);
                        }}
                        style={[
                          styles.chipItem,
                          isSelected && styles.chipItemActive,
                          { backgroundColor: isSelected ? "#DFB76C" : isDark ? "#0F172A" : "#FFFFFF" },
                        ]}
                      >
                        <Building2 size={13} color={isSelected ? "#050C15" : isDark ? "#94A3B8" : "#64748B"} />
                        <Text
                          style={[
                            styles.chipText,
                            { color: isSelected ? "#050C15" : isDark ? "#E2E8F0" : "#334155", fontWeight: isSelected ? "800" : "500" },
                          ]}
                        >
                          {dept.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Chọn Nhân sự */}
                <Text style={[styles.fieldLabel, { color: isDark ? "#CBD5E1" : "#334155", marginTop: 10 }]}>
                  Chọn nhân sự:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {employees.map((emp) => {
                    const empId = emp.id || emp.userId;
                    const isSelected = empId === selectedUserId;
                    const name = emp.fullName || emp.name || "Nhân sự";
                    return (
                      <TouchableOpacity
                        key={empId}
                        onPress={() => {
                          setSelectedUserId(empId);
                          setSelectedUserName(name);
                        }}
                        style={[
                          styles.chipItem,
                          isSelected && styles.chipItemActive,
                          { backgroundColor: isSelected ? "#DFB76C" : isDark ? "#0F172A" : "#FFFFFF" },
                        ]}
                      >
                        <User size={13} color={isSelected ? "#050C15" : isDark ? "#94A3B8" : "#64748B"} />
                        <Text
                          style={[
                            styles.chipText,
                            { color: isSelected ? "#050C15" : isDark ? "#E2E8F0" : "#334155", fontWeight: isSelected ? "800" : "500" },
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Chọn Vai trò */}
                <Text style={[styles.fieldLabel, { color: isDark ? "#CBD5E1" : "#334155", marginTop: 10 }]}>
                  Vai trò trong ban:
                </Text>
                <View style={styles.roleGrid}>
                  <TouchableOpacity
                    onPress={() => handleRoleChange("lead")}
                    style={[
                      styles.roleBtn,
                      selectedRole === "lead" && styles.roleBtnActive,
                      { backgroundColor: selectedRole === "lead" ? "rgba(223, 183, 108, 0.2)" : isDark ? "#0F172A" : "#FFFFFF" },
                    ]}
                  >
                    <UserCheck size={16} color={selectedRole === "lead" ? "#DFB76C" : "#94A3B8"} />
                    <Text
                      style={[
                        styles.roleBtnText,
                        { color: selectedRole === "lead" ? "#DFB76C" : isDark ? "#CBD5E1" : "#475569", fontWeight: selectedRole === "lead" ? "800" : "500" },
                      ]}
                    >
                      Trưởng ban (Quản lý)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRoleChange("member")}
                    style={[
                      styles.roleBtn,
                      selectedRole === "member" && styles.roleBtnActive,
                      { backgroundColor: selectedRole === "member" ? "rgba(56, 189, 248, 0.2)" : isDark ? "#0F172A" : "#FFFFFF" },
                    ]}
                  >
                    <User size={16} color={selectedRole === "member" ? "#38BDF8" : "#94A3B8"} />
                    <Text
                      style={[
                        styles.roleBtnText,
                        { color: selectedRole === "member" ? "#38BDF8" : isDark ? "#CBD5E1" : "#475569", fontWeight: selectedRole === "member" ? "800" : "500" },
                      ]}
                    >
                      Chuyên viên ban
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 5 Toggle quyền */}
                <Text style={[styles.fieldLabel, { color: isDark ? "#CBD5E1" : "#334155", marginTop: 10 }]}>
                  Chi tiết quyền thao tác:
                </Text>
                <View style={styles.permList}>
                  {[
                    { label: "📌 Giao việc mới trong ban", value: canAssign, set: setCanAssign },
                    { label: "📥 Nhận việc trong ban", value: canAccept, set: setCanAccept },
                    { label: "📝 Nộp báo cáo Word/Excel", value: canReport, set: setCanReport },
                    { label: "🔄 Chuyển giao việc nội bộ", value: canHandover, set: setCanHandover },
                    { label: "🎥 Triệu tập họp ban 1-chạm", value: canMeet, set: setCanMeet },
                  ].map((perm, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => perm.set(!perm.value)}
                      style={[
                        styles.permRow,
                        { backgroundColor: isDark ? "#0F172A" : "#FFFFFF", borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0" },
                      ]}
                    >
                      <Text style={[styles.permLabel, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                        {perm.label}
                      </Text>
                      <View
                        style={[
                          styles.checkboxBox,
                          perm.value && styles.checkboxActive,
                        ]}
                      >
                        {perm.value && <Check size={12} color="#050C15" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Nút Lưu Phân Quyền */}
                <TouchableOpacity
                  style={styles.saveBtn}
                  disabled={saving}
                  onPress={handleSavePermission}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGrad}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#050C15" />
                    ) : (
                      <>
                        <Check size={16} color="#050C15" strokeWidth={3} />
                        <Text style={styles.saveBtnText}>Lưu phân quyền thành viên</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Danh sách thành viên từng phòng ban */}
              <View
                style={[
                  styles.listCard,
                  { backgroundColor: isDark ? "#1E293B" : "#F8FAFC", borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#E2E8F0" },
                ]}
              >
                <View style={styles.listCardHeader}>
                  <Users size={16} color="#D8B282" />
                  <Text style={[styles.listCardTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    Nhân sự đã phân quyền ({members.length})
                  </Text>
                </View>

                {members.length === 0 ? (
                  <Text style={[styles.emptyMembersText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    Chưa có nhân sự nào được phân quyền phòng ban riêng. Ban Giám Đốc đang quản lý tập trung.
                  </Text>
                ) : (
                  members.map((m) => (
                    <View
                      key={m.id || `${m.departmentId}-${m.userId}`}
                      style={[
                        styles.memberItem,
                        { backgroundColor: isDark ? "#0F172A" : "#FFFFFF", borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0" },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.memberTopRow}>
                          <Text style={[styles.memberNameText, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                            {m.userName || "Nhân sự"}
                          </Text>
                          <View
                            style={[
                              styles.memberRoleBadge,
                              m.role === "lead" ? styles.roleLeadBadge : styles.roleMemberBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.memberRoleBadgeText,
                                m.role === "lead" ? styles.roleLeadText : styles.roleMemberText,
                              ]}
                            >
                              {m.role === "lead" ? "Trưởng ban" : "Thành viên"}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.memberDeptText}>Ban: {m.departmentName}</Text>

                        {/* Quyền tags */}
                        <View style={styles.permTagsWrap}>
                          {m.canAssign && <Text style={styles.permTag}>Giao việc</Text>}
                          {m.canAccept && <Text style={styles.permTag}>Nhận việc</Text>}
                          {m.canReport && <Text style={styles.permTag}>Báo cáo</Text>}
                          {m.canHandover && <Text style={styles.permTag}>Chuyển việc</Text>}
                          {m.canMeet && <Text style={styles.permTag}>Họp ban</Text>}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteMemberBtn}
                        disabled={deletingUserId === m.userId}
                        onPress={() => handleDeleteMember(m.departmentId, m.userId, m.userName || "thành viên")}
                      >
                        {deletingUserId === m.userId ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <Trash2 size={16} color="#EF4444" />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "90%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(223, 183, 108, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "900",
  },
  badgeExecutive: {
    backgroundColor: "rgba(223, 183, 108, 0.2)",
    borderColor: "#DFB76C",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeExecutiveText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#D8B282",
  },
  subtitleText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  loadingWrap: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 10,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  formCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  formCardTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
  chipScroll: {
    marginBottom: 4,
  },
  chipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  chipItemActive: {
    borderColor: "#DFB76C",
  },
  chipText: {
    fontSize: 11,
  },
  roleGrid: {
    flexDirection: "row",
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleBtnActive: {
    borderColor: "#DFB76C",
  },
  roleBtnText: {
    fontSize: 11,
  },
  permList: {
    gap: 6,
    marginTop: 4,
  },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  permLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#DFB76C",
    borderColor: "#DFB76C",
  },
  saveBtn: {
    marginTop: 14,
    borderRadius: 16,
    overflow: "hidden",
  },
  saveBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#050C15",
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  listCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  listCardTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  emptyMembersText: {
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 14,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberNameText: {
    fontSize: 13,
    fontWeight: "800",
  },
  memberRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  memberRoleBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  roleLeadBadge: {
    backgroundColor: "rgba(223, 183, 108, 0.2)",
  },
  roleLeadText: {
    color: "#DFB76C",
    fontSize: 10,
    fontWeight: "800",
  },
  roleMemberBadge: {
    backgroundColor: "rgba(56, 189, 248, 0.2)",
  },
  roleMemberText: {
    color: "#38BDF8",
    fontSize: 10,
    fontWeight: "800",
  },
  memberDeptText: {
    fontSize: 11,
    color: "#D8B282",
    fontWeight: "700",
    marginTop: 2,
  },
  permTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  permTag: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  deleteMemberBtn: {
    padding: 8,
  },
});
