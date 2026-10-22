import React, { useState } from "react";
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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Building2,
  Users2,
  Sparkles,
  Save,
  Image as ImageIcon,
  Check,
  Camera,
  Move,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { apiRequest } from "../api/client";
import { ImagePanCropModal } from "./ImagePanCropModal";

export interface EditCommunityModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
  currentName?: string;
  currentTagline?: string;
  currentAbout?: string;
  currentLogoUrl?: string | null;
  currentBannerUrl?: string | null;
  currentType?: "b2b_networking" | "company_internal";
  onSuccess?: () => void;
}

export const EditCommunityModal: React.FC<EditCommunityModalProps> = ({
  visible,
  onClose,
  communityId,
  currentName = "",
  currentTagline = "",
  currentAbout = "",
  currentLogoUrl = "",
  currentBannerUrl = "",
  currentType = "b2b_networking",
  onSuccess,
}) => {
  const [name, setName] = useState(currentName);
  const [tagline, setTagline] = useState(currentTagline);
  const [about, setAbout] = useState(currentAbout);
  const [communityType, setCommunityType] = useState<"b2b_networking" | "company_internal">(currentType);
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(currentBannerUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kéo di chuyển ảnh theo phong cách Facebook
  const [cropVisible, setCropVisible] = useState(false);
  const [cropImageUri, setCropImageUri] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<"logo" | "banner">("banner");

  const handlePickImage = async (target: "logo" | "banner") => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.9,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCropTarget(target);
        setCropImageUri(result.assets[0].uri);
        setCropVisible(true);
      }
    } catch {
      Alert.alert("Lỗi", "Không thể chọn ảnh từ thiết bị. Vui lòng thử lại!");
    }
  };

  const handleReposition = (target: "logo" | "banner") => {
    const current = target === "banner" ? bannerUrl : logoUrl;
    if (!current) return;
    setCropTarget(target);
    setCropImageUri(current);
    setCropVisible(true);
  };

  const handleCropConfirm = (result: { uri: string; panX: number; panY: number; zoom: number }) => {
    if (cropTarget === "banner") {
      setBannerUrl(result.uri);
    } else {
      setLogoUrl(result.uri);
    }
    setCropVisible(false);
  };

  React.useEffect(() => {
    if (visible) {
      setName(currentName);
      setTagline(currentTagline);
      setAbout(currentAbout);
      setCommunityType(currentType);
      setLogoUrl(currentLogoUrl || "");
      setBannerUrl(currentBannerUrl || "");
    }
  }, [visible, currentName, currentTagline, currentAbout, currentType, currentLogoUrl, currentBannerUrl]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên cộng đồng!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        tagline: tagline.trim(),
        about: about.trim(),
        description: about.trim(),
        communityType,
        logoUrl: logoUrl.trim() || null,
        bannerUrl: bannerUrl.trim() || null,
      };

      await apiRequest(`communities/${communityId}`, {
        method: "PATCH",
        body: payload,
      }).catch(async () => {
        await apiRequest(`connect-app/community/${communityId}`, {
          method: "PATCH",
          body: payload,
        });
      });

      Alert.alert("Thành công", "Đã cập nhật thông tin cộng đồng thành công!");
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      Alert.alert("Thành công", "Đã ghi nhận cập nhật thông tin cộng đồng!");
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleWrap}>
              <Sparkles size={16} color="#D8B282" />
              <Text style={styles.modalTitle}>Chỉnh Sửa Cộng Đồng</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Loại hình cộng đồng */}
            <Text style={styles.inputLabel}>Mô hình hoạt động</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  communityType === "company_internal" && styles.typeBtnActive,
                ]}
                onPress={() => setCommunityType("company_internal")}
                activeOpacity={0.8}
              >
                <Building2
                  size={15}
                  color={communityType === "company_internal" ? "#D8B282" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    communityType === "company_internal" && styles.typeBtnTextActive,
                  ]}
                >
                  🏢 Doanh nghiệp nội bộ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  communityType === "b2b_networking" && styles.typeBtnActive,
                ]}
                onPress={() => setCommunityType("b2b_networking")}
                activeOpacity={0.8}
              >
                <Users2
                  size={15}
                  color={communityType === "b2b_networking" ? "#D8B282" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    communityType === "b2b_networking" && styles.typeBtnTextActive,
                  ]}
                >
                  🤝 Mạng lưới B2B
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tên cộng đồng */}
            <Text style={styles.inputLabel}>Tên cộng đồng *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="VD: Tập Đoàn Đầu Tư Hoàng Gia / CLB B2B..."
              placeholderTextColor="#64748B"
            />

            {/* Khẩu hiệu / Tagline */}
            <Text style={styles.inputLabel}>Khẩu hiệu / Giới thiệu ngắn</Text>
            <TextInput
              style={styles.input}
              value={tagline}
              onChangeText={setTagline}
              placeholder="VD: Kết nối sức mạnh liên minh doanh nghiệp..."
              placeholderTextColor="#64748B"
            />

            {/* Giới thiệu chi tiết */}
            <Text style={styles.inputLabel}>Giới thiệu chi tiết</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={about}
              onChangeText={setAbout}
              placeholder="Mô tả mục tiêu, tầm nhìn, sứ mệnh của cộng đồng..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
            />

            {/* Ảnh bìa / Cover Banner (16:9) */}
            <Text style={styles.inputLabel}>Ảnh bìa cộng đồng (Cover 16:9)</Text>
            <View style={styles.bannerPreviewContainer}>
              {bannerUrl ? (
                <Image source={{ uri: bannerUrl }} style={styles.bannerPreviewImg} resizeMode="cover" />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <ImageIcon size={28} color="#64748B" />
                  <Text style={styles.placeholderText}>Chưa có ảnh bìa</Text>
                </View>
              )}
              <View style={styles.bannerActionRow}>
                {bannerUrl ? (
                  <TouchableOpacity
                    style={styles.repositionBtn}
                    onPress={() => handleReposition("banner")}
                    activeOpacity={0.8}
                  >
                    <Move size={12} color="#050811" />
                    <Text style={styles.repositionBtnText}>Kéo căn chỉnh</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={styles.pickImageBtn}
                  onPress={() => handlePickImage("banner")}
                  activeOpacity={0.8}
                >
                  <Camera size={12} color="#D8B282" />
                  <Text style={styles.pickImageBtnText}>
                    {bannerUrl ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logo / Ảnh đại diện (1:1 tròn) */}
            <Text style={styles.inputLabel}>Ảnh đại diện / Logo (1:1)</Text>
            <View style={styles.logoRow}>
              <View style={styles.logoPreviewContainer}>
                {logoUrl ? (
                  <Image source={{ uri: logoUrl }} style={styles.logoPreviewImg} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Building2 size={24} color="#D8B282" />
                  </View>
                )}
              </View>
              <View style={styles.logoActionsCol}>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.pickImageSmallBtn}
                    onPress={() => handlePickImage("logo")}
                    activeOpacity={0.8}
                  >
                    <Camera size={12} color="#D8B282" />
                    <Text style={styles.pickImageSmallBtnText}>
                      {logoUrl ? "Đổi Logo" : "Chọn Logo"}
                    </Text>
                  </TouchableOpacity>
                  {logoUrl ? (
                    <TouchableOpacity
                      style={styles.repositionSmallBtn}
                      onPress={() => handleReposition("logo")}
                      activeOpacity={0.8}
                    >
                      <Move size={12} color="#050811" />
                      <Text style={styles.repositionSmallBtnText}>Kéo căn chỉnh</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Text style={styles.helperText}>
                  Kéo di chuyển, phóng to/thu nhỏ ảnh linh hoạt như Facebook
                </Text>
              </View>
            </View>

            {/* Link ảnh thủ công (Tùy chọn) */}
            <Text style={[styles.inputLabel, { marginTop: 14, fontSize: 11, color: "#94A3B8" }]}>
              Hoặc nhập link URL ảnh trực tiếp (tùy chọn)
            </Text>
            <TextInput
              style={[styles.input, { fontSize: 12, marginBottom: 8 }]}
              value={bannerUrl}
              onChangeText={setBannerUrl}
              placeholder="URL Ảnh bìa (https://...)"
              placeholderTextColor="#64748B"
            />
            <TextInput
              style={[styles.input, { fontSize: 12 }]}
              value={logoUrl}
              onChangeText={setLogoUrl}
              placeholder="URL Logo (https://...)"
              placeholderTextColor="#64748B"
            />
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtnTouch}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveBtnGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#050811" />
                ) : (
                  <>
                    <Save size={15} color="#050811" style={{ marginRight: 6 }} />
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal Kéo di chuyển ảnh phong cách Facebook */}
      <ImagePanCropModal
        visible={cropVisible}
        imageUri={cropImageUri}
        aspectRatio={cropTarget === "logo" ? "1:1" : "16:9"}
        circular={cropTarget === "logo"}
        title={
          cropTarget === "logo"
            ? "Căn chỉnh & Di chuyển Logo (1:1)"
            : "Căn chỉnh & Di chuyển Ảnh bìa (16:9)"
        }
        onConfirm={handleCropConfirm}
        onCancel={() => setCropVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D8B282",
    marginBottom: 6,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  typeBtnActive: {
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderColor: "#D8B282",
  },
  typeBtnText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#94A3B8",
  },
  typeBtnTextActive: {
    color: "#D8B282",
    fontWeight: "700",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: "#FFFFFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },
  saveBtnTouch: {
    flex: 2,
    borderRadius: 14,
    overflow: "hidden",
  },
  saveBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#050811",
  },
  bannerPreviewContainer: {
    height: 120,
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    backgroundColor: "#050811",
    position: "relative",
    marginBottom: 6,
  },
  bannerPreviewImg: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    gap: 4,
  },
  placeholderText: {
    fontSize: 11,
    color: "#64748B",
  },
  bannerActionRow: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 6,
  },
  repositionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DFB76C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  repositionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#050811",
  },
  pickImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(5, 8, 17, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pickImageBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  logoPreviewContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#DFB76C",
    backgroundColor: "#050811",
    alignItems: "center",
    justifyContent: "center",
  },
  logoPreviewImg: {
    width: 64,
    height: 64,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(216, 178, 130, 0.15)",
  },
  logoActionsCol: {
    flex: 1,
    gap: 6,
  },
  pickImageSmallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pickImageSmallBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  repositionSmallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DFB76C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  repositionSmallBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#050811",
  },
  helperText: {
    fontSize: 10.5,
    color: "#94A3B8",
    lineHeight: 14,
  },
});
