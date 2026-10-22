import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  X,
  Users,
  Award,
  ShieldCheck,
  Sparkles,
  Building2,
  Camera,
  Move,
  Image as ImageIcon,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { CommunityItem } from "../types";
import { communityApi } from "../api/services";
import { ImagePanCropModal } from "./ImagePanCropModal";

interface CreateCommunityGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: CommunityItem) => void;
}

const CATEGORIES = [
  "Liên minh Doanh nghiệp Đa ngành",
  "CLB Doanh nhân C-Level",
  "Mạng lưới Đầu tư & Tài chính",
  "Hiệp hội Công nghệ & Chuyển đổi số",
  "Chuỗi Cung ứng & Bán lẻ",
];

export const CreateCommunityGroupModal: React.FC<CreateCommunityGroupModalProps> = ({
  visible,
  onClose,
  onGroupCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Kéo di chuyển ảnh Facebook
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

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập tên cộng đồng / nhóm doanh nghiệp của bạn.");
      return;
    }

    const newCommunity: CommunityItem = {
      id: "c-" + Date.now(),
      name: name.trim(),
      description: description.trim() || `Liên minh doanh nghiệp ${category} kết nối hợp tác & chia sẻ giá trị bền vững.`,
      logoUrl: logoUrl.trim() || null,
      coverUrl: bannerUrl.trim() || null,
      memberCount: 1,
      isMember: true,
      role: "Ban Điều Hành",
    };

    try {
      await communityApi.activateCommunityTrial({
        plan: "community_trial_30d",
        trialDays: 30,
      });
    } catch (err) {
      console.warn("Lỗi kích hoạt trial lên API:", err);
    }

    try {
      await communityApi.createCommunity({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        logoUrl: logoUrl.trim() || undefined,
        bannerUrl: bannerUrl.trim() || undefined,
      } as any);
    } catch (err) {
      console.warn("Lỗi tạo community lên API:", err);
    }

    try {
      await AsyncStorage.setItem("vione_community_subscription_active", "true");
    } catch (err) {
      console.warn("Lỗi lưu subscription AsyncStorage:", err);
    }

    onGroupCreated(newCommunity);
    Alert.alert(
      "Kích hoạt thành công!",
      `Chúc mừng bạn! Cộng đồng "${name.trim()}" đã được khởi tạo thành công cùng Gói dùng thử 30 ngày miễn phí. Toàn bộ phân hệ Giao việc & Điều hành đã sẵn sàng.`
    );
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Tạo Cộng Đồng Của Bạn (30 Ngày Free)</Text>
              <Text style={styles.headerSubtitle}>
                Mở khóa toàn bộ phân hệ Giao việc, Giám sát CRM, Cơ hội B2B và Lịch họp
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
            {/* Banner Khuyến Mãi Dùng Thử 30 Ngày Free */}
            <View style={styles.trialBanner}>
              <LinearGradient
                colors={["rgba(216, 178, 130, 0.22)", "rgba(216, 178, 130, 0.06)"]}
                style={styles.trialBannerGrad}
              >
                <Sparkles size={18} color="#DFB76C" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.trialBannerTitle}>🎉 GÓI DÙNG THỬ 30 NGÀY MIỄN PHÍ</Text>
                  <Text style={styles.trialBannerDesc}>
                    Khởi tạo cộng đồng của bạn ngay hôm nay để nhận 30 ngày trải nghiệm miễn phí trọn bộ phân hệ Giao việc & Điều hành (Trị giá 990.000đ/tháng).
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.inputLabel}>TÊN CỘNG ĐỒNG / DOANH NGHIỆP CỦA BẠN</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ví dụ: Cộng đồng Doanh Nghiệp Hoàng Long / Liên Minh Logistics..."
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            {/* Ảnh bìa / Cover Banner (16:9) */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>ẢNH BÌA CỘNG ĐỒNG (16:9)</Text>
            <View style={styles.bannerPreviewContainer}>
              {bannerUrl ? (
                <Image source={{ uri: bannerUrl }} style={styles.bannerPreviewImg} resizeMode="cover" />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <ImageIcon size={26} color="#64748B" />
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
                  <Camera size={12} color="#DFB76C" />
                  <Text style={styles.pickImageBtnText}>
                    {bannerUrl ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logo / Ảnh đại diện (1:1) */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>ẢNH ĐẠI DIỆN / LOGO (1:1)</Text>
            <View style={styles.logoRow}>
              <View style={styles.logoPreviewContainer}>
                {logoUrl ? (
                  <Image source={{ uri: logoUrl }} style={styles.logoPreviewImg} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Building2 size={24} color="#DFB76C" />
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
                    <Camera size={12} color="#DFB76C" />
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
                  Kéo di chuyển, xoay và phóng to/thu nhỏ như Facebook
                </Text>
              </View>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>LĨNH VỰC HOẠT ĐỘNG</Text>
            <View style={styles.catWrap}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, category === cat && styles.catPillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catPillText, category === cat && styles.catPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>MÔ TẢ MỤC TIÊU & TÔN CHỈ</Text>
            <TextInput
              style={[styles.textInput, { minHeight: 80, textAlignVertical: "top" }]}
              multiline
              numberOfLines={3}
              placeholder="Mô tả mục tiêu liên kết kinh doanh, chuỗi giá trị và phân công công việc..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.infoBox}>
              <ShieldCheck size={16} color="#D8B282" style={{ marginRight: 8 }} />
              <Text style={styles.infoBoxText}>
                Tài khoản của bạn sẽ tự động là <Text style={{ color: "#D8B282", fontWeight: "700" }}>Quản Trị Viên</Text> của cộng đồng với quyền quản lý thành viên & phân công công việc.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} activeOpacity={0.85}>
              <LinearGradient
                colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Sparkles size={16} color="#050C15" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>🎉 Kích Hoạt & Dùng Thử 30 Ngày Free</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#0E1522",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: 11.5,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    color: "#D8B282",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#181D2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    color: "#FFFFFF",
    fontSize: 13,
  },
  catWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catPill: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  catPillActive: {
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderColor: "#D8B282",
  },
  catPillText: {
    color: "#94A3B8",
    fontSize: 11.5,
    fontWeight: "500",
  },
  catPillTextActive: {
    color: "#D8B282",
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(216, 178, 130, 0.08)",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  infoBoxText: {
    color: "#E2E8F0",
    fontSize: 11.5,
    flex: 1,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cancelBtnText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  submitBtnText: {
    color: "#050C15",
    fontSize: 13,
    fontWeight: "700",
  },
  trialBanner: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    marginBottom: 16,
    overflow: "hidden",
  },
  trialBannerGrad: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  trialBannerTitle: {
    color: "#DFB76C",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  trialBannerDesc: {
    color: "#E2E8F0",
    fontSize: 11,
    lineHeight: 15,
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
    marginTop: 6,
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
    marginTop: 6,
    marginBottom: 6,
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
