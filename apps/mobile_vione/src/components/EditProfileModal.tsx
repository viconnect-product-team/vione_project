import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  X,
  User,
  Briefcase,
  Building2,
  Phone,
  Mail,
  Globe,
  FileText,
  Check,
  Camera,
  Image as ImageIcon,
  Move,
  Sparkles,
} from "lucide-react-native";
import { ImagePanCropModal } from "./ImagePanCropModal";
import { useTheme } from "../context/ThemeContext";
import { meApi } from "../api/services";
import { UserProfile } from "../types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const { isDark } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Pan & Crop Modal states
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [cropType, setCropType] = useState<"avatar" | "cover">("avatar");
  const [cropImageUri, setCropImageUri] = useState<string | null>(null);
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  useEffect(() => {
    if (visible && currentUser) {
      setDisplayName(currentUser.displayName || currentUser.name || "");
      setJobTitle(currentUser.title || "");
      setCompanyName(currentUser.company || "");
      setPhone(currentUser.phone || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setWebsite(currentUser.website || "");
      setIndustry(currentUser.industry || "");
      setAvatarUrl(currentUser.avatarUrl || "");
      setCoverUrl(currentUser.coverUrl || "");
    }
  }, [visible, currentUser]);

  const handleOpenCropFor = (type: "avatar" | "cover") => {
    setCropType(type);
    const existing = type === "avatar" ? avatarUrl : coverUrl;
    setUrlDraft(existing || "");
    setUrlModalVisible(true);
  };

  const handleUrlConfirmed = () => {
    if (!urlDraft.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đường dẫn hình ảnh (URL).");
      return;
    }
    setUrlModalVisible(false);
    setCropImageUri(urlDraft.trim());
    setCropModalVisible(true);
  };

  const handleCropApplied = (result: { uri: string }) => {
    setCropModalVisible(false);
    if (cropType === "avatar") {
      setAvatarUrl(result.uri);
    } else {
      setCoverUrl(result.uri);
    }
    Alert.alert(
      "Đã căn chỉnh",
      `Đã chọn vùng hiển thị cho ${cropType === "avatar" ? "ảnh đại diện" : "ảnh bìa"}!`
    );
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên của bạn.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<UserProfile> = {
        displayName: displayName.trim(),
        name: displayName.trim(),
        title: jobTitle.trim(),
        company: companyName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        website: website.trim(),
        industry: industry.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
      };

      const res = await meApi.updateProfile(payload);
      const updated = res.data?.profile || {
        ...(currentUser || ({} as UserProfile)),
        ...payload,
      };

      // Also upsert identity for parity
      try {
        await meApi.upsertIdentity({
          displayName: payload.displayName,
          jobTitle: payload.title,
          companyName: payload.company,
          primaryPhone: payload.phone,
          primaryEmail: payload.email,
          bio: payload.bio,
          website: payload.website,
        });
      } catch {
        // Soft fail if identity API is identical
      }

      onProfileUpdated(updated as UserProfile);
      Alert.alert("Thành công", "Hồ sơ doanh nhân của bạn đã được cập nhật!");
      onClose();
    } catch {
      // Offline fallback: save locally
      const localUpdated: UserProfile = {
        ...(currentUser || ({} as UserProfile)),
        displayName: displayName.trim(),
        name: displayName.trim(),
        title: jobTitle.trim(),
        company: companyName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        website: website.trim(),
        industry: industry.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
      };
      onProfileUpdated(localUpdated);
      Alert.alert("Thành công", "Thông tin hồ sơ đã được lưu cục bộ!");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputBg = isDark ? "#181D2A" : "#F8FAFC";
  const inputBorder = isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  const placeholderColor = isDark ? "#64748B" : "#94A3B8";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoid}
        >
          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: isDark ? "#0E1522" : "#FFFFFF",
                borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "#E2E8F0",
              },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.headerBar,
                { borderBottomColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0" },
              ]}
            >
              <View style={styles.headerLeft}>
                <View style={styles.iconCircle}>
                  <User size={16} color="#D8B282" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: isDark ? "#FFFFFF" : "#0F172A" },
                    ]}
                  >
                    Chỉnh sửa hồ sơ doanh nhân
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    Cập nhật danh tính số ViOne Ecosystem
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={18} color={isDark ? "#94A3B8" : "#64748B"} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: SCREEN_HEIGHT * 0.65 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* KHỐI ẢNH BÌA & AVATAR: CĂN CHỈNH VÙNG HIỂN THỊ TRỰC QUAN */}
              <View style={styles.imageSectionWrap}>
                {/* 1. Ảnh bìa (16:9) */}
                <View style={styles.coverBox}>
                  {coverUrl ? (
                    <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.coverPlaceholder}>
                      <ImageIcon size={28} color="#D8B282" />
                      <Text style={styles.coverPlaceholderText}>Chưa có ảnh bìa doanh nghiệp</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.changeCoverBtn}
                    onPress={() => handleOpenCropFor("cover")}
                    activeOpacity={0.8}
                  >
                    <Move size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.changeCoverBtnText}>
                      {coverUrl ? "Di chuyển / Đổi ảnh bìa (16:9)" : "Tải ảnh bìa & Căn chỉnh"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 2. Ảnh đại diện (1:1 tròn) */}
                <View style={styles.avatarRow}>
                  <View style={styles.avatarCircleWrap}>
                    {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>
                          {(displayName || "V").slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.avatarCameraBadge}
                      onPress={() => handleOpenCropFor("avatar")}
                      activeOpacity={0.8}
                    >
                      <Camera size={13} color="#050C15" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.avatarHintTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                      Ảnh đại diện danh thiếp
                    </Text>
                    <Text style={styles.avatarHintSub}>
                      Tỷ lệ chuẩn 1:1 · Cho phép kéo di chuyển và phóng to/thu nhỏ
                    </Text>
                    <TouchableOpacity
                      style={styles.cropAvatarBtn}
                      onPress={() => handleOpenCropFor("avatar")}
                    >
                      <Move size={11} color="#D8B282" style={{ marginRight: 4 }} />
                      <Text style={styles.cropAvatarBtnText}>Di chuyển & Căn chỉnh góc mặt</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Họ và tên */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Họ và tên <Text style={{ color: "#EF4444" }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <User size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: Nguyễn Văn An"
                    placeholderTextColor={placeholderColor}
                    value={displayName}
                    onChangeText={setDisplayName}
                  />
                </View>
              </View>

              {/* Chức vụ */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Chức vụ / Vị trí
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Briefcase size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: Chủ tịch HĐQT / Tổng Giám Đốc"
                    placeholderTextColor={placeholderColor}
                    value={jobTitle}
                    onChangeText={setJobTitle}
                  />
                </View>
              </View>

              {/* Công ty */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Công ty / Doanh nghiệp
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Building2 size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: Tập đoàn Công nghệ ViOne"
                    placeholderTextColor={placeholderColor}
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>
              </View>

              {/* Lĩnh vực hoạt động */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Ngành nghề & Lĩnh vực
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Briefcase size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: Công nghệ thông tin & Chuyển đổi số"
                    placeholderTextColor={placeholderColor}
                    value={industry}
                    onChangeText={setIndustry}
                  />
                </View>
              </View>

              {/* Số điện thoại */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Số điện thoại
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Phone size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: 0912 345 678"
                    placeholderTextColor={placeholderColor}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Email liên hệ
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Mail size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: ceo@vione.vn"
                    placeholderTextColor={placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Website */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Website doanh nghiệp
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: inputBorder },
                  ]}
                >
                  <Globe size={16} color={isDark ? "#D8B282" : "#8C653B"} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="VD: https://vione.vn"
                    placeholderTextColor={placeholderColor}
                    value={website}
                    onChangeText={setWebsite}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Tiểu sử / Giới thiệu */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: isDark ? "#E2E8F0" : "#334155" }]}>
                  Tiểu sử & Định vị bản thân
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: inputBg,
                      borderColor: inputBorder,
                      alignItems: "flex-start",
                      paddingTop: 10,
                    },
                  ]}
                >
                  <FileText
                    size={16}
                    color={isDark ? "#D8B282" : "#8C653B"}
                    style={[styles.fieldIcon, { marginTop: 2 }]}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      { color: textColor },
                    ]}
                    placeholder="Giới thiệu ngắn về kinh nghiệm, thế mạnh và mục tiêu kết nối của bạn..."
                    placeholderTextColor={placeholderColor}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View
              style={[
                styles.footerBar,
                { borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0" },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  {
                    backgroundColor: isDark ? "#181D2A" : "#F1F5F9",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  },
                ]}
                onPress={onClose}
                disabled={saving}
              >
                <Text style={[styles.cancelBtnText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#050C15" />
                ) : (
                  <>
                    <Check size={16} color="#050C15" style={{ marginRight: 6 }} />
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* URL Input Modal trước khi Cắt ảnh */}
      <Modal
        visible={urlModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUrlModalVisible(false)}
      >
        <View style={styles.urlModalOverlay}>
          <View
            style={[
              styles.urlModalBox,
              { backgroundColor: isDark ? "#0E1522" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.urlModalTitle,
                { color: isDark ? "#FFFFFF" : "#0F172A" },
              ]}
            >
              {cropType === "avatar" ? "Cập nhật Ảnh đại diện" : "Cập nhật Ảnh bìa"}
            </Text>
            <Text style={styles.urlModalDesc}>
              Dán URL hình ảnh chất lượng cao để kéo di chuyển và chọn vùng hiển thị:
            </Text>

            <TextInput
              style={[
                styles.urlInput,
                {
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  color: textColor,
                },
              ]}
              placeholder="VD: https://images.unsplash.com/... hoặc link ảnh"
              placeholderTextColor={placeholderColor}
              value={urlDraft}
              onChangeText={setUrlDraft}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.urlModalActions}>
              <TouchableOpacity
                style={[
                  styles.urlBtnCancel,
                  {
                    backgroundColor: isDark ? "#181D2A" : "#F1F5F9",
                  },
                ]}
                onPress={() => setUrlModalVisible(false)}
              >
                <Text
                  style={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.urlBtnConfirm}
                onPress={handleUrlConfirmed}
                activeOpacity={0.85}
              >
                <Text style={{ color: "#050C15", fontWeight: "700", fontSize: 13 }}>
                  Kéo căn chỉnh ảnh
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pan & Zoom Crop Modal */}
      <ImagePanCropModal
        visible={cropModalVisible}
        imageUri={cropImageUri}
        aspectRatio={cropType === "avatar" ? "1:1" : "16:9"}
        circular={cropType === "avatar"}
        title={
          cropType === "avatar"
            ? "Căn chỉnh Ảnh đại diện (1:1)"
            : "Căn chỉnh Ảnh bìa (16:9)"
        }
        onConfirm={handleCropApplied}
        onCancel={() => setCropModalVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  keyboardAvoid: {
    width: "100%",
    maxHeight: "92%",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  imageSectionWrap: {
    marginBottom: 8,
  },
  coverBox: {
    height: 120,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(216, 178, 130, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholderText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "500",
  },
  changeCoverBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(5, 12, 21, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  changeCoverBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  avatarCircleWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#D8B282",
    position: "relative",
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  avatarPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(216, 178, 130, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D8B282",
  },
  avatarCameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#0E1522",
  },
  avatarHintTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  avatarHintSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  cropAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(216, 178, 130, 0.12)",
  },
  cropAvatarBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D8B282",
  },
  urlModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  urlModalBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
  },
  urlModalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  urlModalDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 18,
  },
  urlInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
  },
  urlModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  urlBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  urlBtnConfirm: {
    backgroundColor: "#D8B282",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  footerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8B282",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#050C15",
  },
});
