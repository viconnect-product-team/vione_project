import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { X, Camera, Image as ImageIcon, Sparkles, Check, Flashlight, SwitchCamera } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { StoryItemData } from "./StoryViewerModal";
import { momentApi, uploadFile } from "../api";

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onStoryCreated: (newStory: StoryItemData) => void;
}

const STORY_TAGS = [
  "Cơ hội hợp tác",
  "Xúc tiến đầu tư",
  "Ký kết đối tác",
  "Bàn tròn CEO",
  "Gặp gỡ đối tác",
  "Sự kiện hôm nay",
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  visible,
  onClose,
  onStoryCreated,
}) => {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [caption, setCaption] = useState("");
  const [selectedTag, setSelectedTag] = useState("Cơ hội hợp tác");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Camera Viewfinder State
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleOpenLiveCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Quyền Camera", "Vui lòng cấp quyền truy cập máy ảnh để chụp ảnh khoảnh khắc 24h.");
        return;
      }
    }
    setCameraActive(true);
  };

  const handleCapturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
        if (photo?.uri) {
          setCapturedImages((prev) => [photo.uri, ...prev]);
          setSelectedImage(photo.uri);
          setCameraActive(false);
        }
      } catch (err) {
        Alert.alert("Lỗi chụp ảnh", "Không thể chụp ảnh lúc này. Vui lòng thử lại.");
      }
    }
  };

  const handlePost = async () => {
    if (!selectedImage && !caption.trim()) {
      Alert.alert("Thông báo", "Vui lòng chụp ảnh hoặc nhập nội dung chia sẻ khoảnh khắc.");
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = selectedImage || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80";

    // Upload ảnh chụp thật lên máy chủ ViOne backend (MinIO)
    if (selectedImage && (selectedImage.startsWith("file://") || selectedImage.startsWith("content://"))) {
      try {
        const uploadRes = await uploadFile(selectedImage, `story_${Date.now()}.jpg`, "image/jpeg");
        if (uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (err) {
        console.warn("Upload ảnh story lên server thất bại, dùng local preview:", err);
      }
    }

    try {
      await momentApi.createMoment({
        content: `[${selectedTag}] ${caption.trim()}`,
        photoUrls: [finalImageUrl],
      });
    } catch (e) {
      // Offline fallback
    } finally {
      setIsSubmitting(false);
    }

    const newStory: StoryItemData = {
      id: "story-" + Date.now(),
      authorName: user?.displayName || user?.name || "Doanh nhân ViOne",
      authorTitle: user?.title || "Chủ tịch & Tổng Giám Đốc",
      authorCompany: user?.company || "Tập đoàn Đầu tư & Công nghệ ViOne",
      authorAvatar: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      storyImage: finalImageUrl,
      storyCaption: caption.trim() || "Chia sẻ khoảnh khắc cùng cộng đồng doanh nhân ViOne Connect.",
      tag: selectedTag,
      timeAgo: "Vừa xong",
      viewsCount: 1,
    };

    onStoryCreated(newStory);
    Alert.alert("Thành công", "Đã đăng khoảnh khắc 24h lên mạng lưới doanh nhân ViOne.");
    setCaption("");
    setSelectedImage(null);
    onClose();
  };

  return (
    <>
      <Modal visible={visible && !cameraActive} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={[styles.sheetContainer, { backgroundColor: colors.surface, borderColor: colors.surfaceBorderGold }]}>
            {/* Header */}
            <View style={[styles.headerRow, { borderBottomColor: colors.surfaceBorder }]}>
              <View>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Đăng Khoảnh Khắc 24h</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  Chia sẻ tin tức, cơ hội hợp tác, sự kiện giao thương
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
              {/* Image Preview & Capture */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={[styles.sectionLabel, { color: colors.gold }]}>HÌNH ẢNH KHOẢNH KHẮC</Text>
                <TouchableOpacity
                  style={[styles.cameraQuickBtn, { backgroundColor: colors.goldSoft, borderColor: colors.gold }]}
                  onPress={handleOpenLiveCamera}
                  activeOpacity={0.8}
                >
                  <Camera size={13} color={colors.gold} style={{ marginRight: 4 }} />
                  <Text style={[styles.cameraQuickBtnText, { color: isDark ? colors.textGold : "#92400E" }]}>Chụp ảnh mới</Text>
                </TouchableOpacity>
              </View>

              {selectedImage ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
                  <View style={styles.previewTagBadge}>
                    <Text style={styles.previewTagText}>{selectedTag}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.retakeBtn}
                    onPress={handleOpenLiveCamera}
                    activeOpacity={0.85}
                  >
                    <Camera size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.retakeText}>Chụp lại</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.emptyCaptureCard, { backgroundColor: colors.goldSoft, borderColor: colors.gold }]}
                  onPress={handleOpenLiveCamera}
                  activeOpacity={0.8}
                >
                  <View style={[styles.emptyCameraIconWrap, { backgroundColor: colors.goldSoft }]}>
                    <Camera size={26} color={colors.gold} />
                  </View>
                  <Text style={[styles.emptyCaptureTitle, { color: colors.textPrimary }]}>Bấm để chụp ảnh khoảnh khắc 24h</Text>
                  <Text style={[styles.emptyCaptureSubtitle, { color: colors.textMuted }]}>Ghi lại hoạt động kinh doanh, sự kiện, gặp gỡ đối tác thực tế</Text>
                </TouchableOpacity>
              )}

              {/* Thumbnails of captured photos */}
              {capturedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
                  {capturedImages.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.thumbItem, selectedImage === img && styles.thumbItemActive]}
                      onPress={() => setSelectedImage(img)}
                    >
                      <Image source={{ uri: img }} style={styles.thumbImg} />
                      {selectedImage === img && (
                        <View style={styles.thumbCheck}>
                          <Check size={12} color="#050C15" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Input Caption */}
              <Text style={[styles.sectionLabel, { marginTop: 16, color: colors.gold }]}>NỘI DUNG CHIA SẺ</Text>
              <TextInput
                style={[styles.captionInput, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                multiline
                numberOfLines={3}
                placeholder="Chia sẻ cơ hội hợp tác kinh doanh, sự kiện kết nối hôm nay..."
                placeholderTextColor={colors.textDisabled}
                value={caption}
                onChangeText={setCaption}
              />

              {/* Tag Selection */}
              <Text style={[styles.sectionLabel, { marginTop: 14, color: colors.gold }]}>CHỦ ĐỀ KHOẢNH KHẮC</Text>
              <View style={styles.tagsWrap}>
                {STORY_TAGS.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagPill,
                        { backgroundColor: colors.surface2, borderColor: colors.surfaceBorder },
                        isActive && { backgroundColor: colors.goldSoft, borderColor: colors.gold },
                      ]}
                      onPress={() => setSelectedTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          { color: colors.textMuted },
                          isActive && { color: isDark ? colors.textGold : "#92400E", fontWeight: "700" },
                        ]}
                      >
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surface2, borderColor: colors.surfaceBorder, borderWidth: 1 }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textPrimary }]}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handlePost}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  <Sparkles size={16} color="#050C15" style={{ marginRight: 6 }} />
                  <Text style={styles.submitBtnText}>
                    {isSubmitting ? "Đang công bố..." : "Đăng Khoảnh Khắc"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Live Camera Viewfinder Modal */}
      <Modal visible={cameraActive} animationType="slide" transparent={false} onRequestClose={() => setCameraActive(false)}>
        <View style={styles.cameraFullContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            enableTorch={torch}
          />
          {/* Camera Header Bar */}
          <View style={styles.cameraHeaderBar}>
            <TouchableOpacity onPress={() => setCameraActive(false)} style={styles.cameraActionBtn} activeOpacity={0.8}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.cameraControlsRight}>
              <TouchableOpacity
                onPress={() => setTorch((prev) => !prev)}
                style={[styles.cameraActionBtn, torch && styles.cameraActionBtnActive]}
                activeOpacity={0.8}
              >
                <Flashlight size={20} color={torch ? "#050C15" : "#FFFFFF"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
                style={styles.cameraActionBtn}
                activeOpacity={0.8}
              >
                <SwitchCamera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Camera Bottom Shutter Bar */}
          <View style={styles.cameraBottomBar}>
            <Text style={styles.cameraTipText}>Hướng máy ảnh vào khoảnh khắc thực tế của bạn</Text>
            <TouchableOpacity
              onPress={handleCapturePhoto}
              style={styles.shutterOuter}
              activeOpacity={0.7}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  sectionLabel: {
    color: "#D8B282",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  cameraQuickBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cameraQuickBtnText: {
    color: "#D8B282",
    fontSize: 11,
    fontWeight: "700",
  },
  previewContainer: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewTagBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(10, 10, 11, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D8B282",
  },
  previewTagText: {
    color: "#D8B282",
    fontSize: 10.5,
    fontWeight: "700",
  },
  retakeBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retakeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyCaptureCard: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(216, 178, 130, 0.4)",
    backgroundColor: "rgba(216, 178, 130, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyCameraIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyCaptureTitle: {
    color: "#F6E1C3",
    fontSize: 12.5,
    fontWeight: "700",
    marginBottom: 2,
  },
  emptyCaptureSubtitle: {
    color: "#94A3B8",
    fontSize: 10.5,
    textAlign: "center",
  },
  thumbScroll: {
    marginTop: 10,
  },
  thumbItem: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 8,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  thumbItemActive: {
    borderColor: "#D8B282",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
  },
  thumbCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#D8B282",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  captionInput: {
    backgroundColor: "#181D2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    color: "#FFFFFF",
    fontSize: 13,
    textAlignVertical: "top",
    minHeight: 70,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  tagPillActive: {
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderColor: "#D8B282",
  },
  tagPillText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "500",
  },
  tagPillTextActive: {
    color: "#D8B282",
    fontWeight: "700",
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
  cameraFullContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraHeaderBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  cameraActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  cameraActionBtnActive: {
    backgroundColor: "#D8B282",
  },
  cameraControlsRight: {
    flexDirection: "row",
  },
  cameraBottomBar: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  cameraTipText: {
    color: "#F6E1C3",
    fontSize: 12,
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(216, 178, 130, 0.2)",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F6E1C3",
  },
});
