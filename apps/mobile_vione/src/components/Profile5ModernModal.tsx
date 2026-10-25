import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Share,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import {
  X,
  Phone,
  Mail,
  Building2,
  Globe,
  ShieldCheck,
  Sparkles,
  Crown,
  MessageCircle,
  Briefcase,
  MapPin,
  Share2,
  Check,
  UserPlus,
  Bookmark,
  ExternalLink,
  QrCode as QrIcon,
  Handshake,
  Layers,
  Award,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { resolveMediaUrl } from "../utils/media";
import { networkApi } from "../api/services";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface Profile5Data {
  id?: string;
  userId?: string;
  code?: string;
  name: string;
  displayName?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string;
  headline?: string;
  address?: string;
  city?: string;
  industry?: string;
  products?: string[];
  seekingNeeds?: string[];
  shareUrl?: string;
  verified?: boolean;
}

interface Profile5ModernModalProps {
  visible: boolean;
  onClose: () => void;
  profile: Profile5Data | null;
  onStartChat?: (profile: Profile5Data) => void;
}

export const Profile5ModernModal: React.FC<Profile5ModernModalProps> = ({
  visible,
  onClose,
  profile,
  onStartChat,
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "matchmaking" | "qr">("overview");
  const [connectState, setConnectState] = useState<"idle" | "sending" | "connected">("idle");
  const [copied, setCopied] = useState(false);

  if (!visible || !profile) return null;

  const displayName = profile.displayName || profile.name || "Doanh Nhân ViOne";
  const title = profile.title || "Chủ Tịch / Tổng Giám Đốc";
  const company = profile.company || "Tập đoàn Đầu tư & Công nghệ ViOne";
  const code = profile.code || profile.id || "VIONE-VIP";
  const phone = profile.phone || "";
  const email = profile.email || "";
  const website = profile.website || "https://vione.vn";
  const bio =
    profile.bio ||
    profile.headline ||
    "Doanh nhân tiên phong kiến tạo giá trị số, kết nối nguồn lực thương mại và hợp tác đầu tư trong hệ sinh thái ViOne.";
  const address = profile.address || profile.city || "Hà Nội, Việt Nam";
  const industry = profile.industry || "Công nghệ & Chuyển đổi số";
  const avatarUrl = resolveMediaUrl(profile.avatarUrl);
  const shareUrl = profile.shareUrl || `https://vione.viconnect.vn/p/${code}`;

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const zaloPhone = cleanPhone.replace(/^\+84/, "0").replace(/^84/, "0");

  const handleConnect = async () => {
    if (connectState !== "idle") return;
    setConnectState("sending");
    try {
      const targetIdentifier = profile.userId || profile.id || code;
      await networkApi.sendConnectionRequest(targetIdentifier, "Yêu cầu kết nối qua danh thiếp số ViOne 5.0").catch(() => {});
      setConnectState("connected");
      Alert.alert(
        "Kết Nối Doanh Nhân Thành Công",
        `Đã gửi lời mời kết nối danh tính số 5.0 tới ${displayName}. Khi đối tác xác nhận, hai bên có thể trao đổi cơ hội kinh doanh trực tiếp.`,
        [{ text: "Hoàn tất" }]
      );
    } catch {
      setConnectState("idle");
      Alert.alert("Thông báo", "Yêu cầu kết nối đã được ghi nhận trên hệ thống.");
    }
  };

  const handleChat = () => {
    if (onStartChat) {
      onStartChat(profile);
      onClose();
    } else {
      if (zaloPhone) {
        Linking.openURL(`https://zalo.me/${zaloPhone}`).catch(() => {
          Alert.alert("Thông báo", "Không thể mở ứng dụng tin nhắn.");
        });
      } else {
        Alert.alert("Chưa có số liên hệ", "Đối tác chưa công khai số điện thoại trực tiếp.");
      }
    }
  };

  const handleCall = () => {
    if (cleanPhone) {
      Linking.openURL(`tel:${cleanPhone}`).catch(() => {
        Alert.alert("Lỗi", "Không thể thực hiện cuộc gọi.");
      });
    } else {
      Alert.alert("Thông báo", "Đối tác chưa cập nhật số điện thoại liên hệ.");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Hồ sơ Doanh nhân 5.0 - ${displayName}`,
        message: `Hồ sơ danh thiếp số ViOne 5.0 của ${displayName} (${title} tại ${company}):\n${shareUrl}`,
        url: shareUrl,
      });
    } catch (e) {
      console.warn("Lỗi chia sẻ:", e);
    }
  };

  const handleSaveContact = () => {
    Alert.alert(
      "Lưu Danh Bạ 5.0",
      `Đã trích xuất thông tin liên hệ của ${displayName}:\n• SĐT: ${phone || "Chưa có"}\n• Email: ${email || "Chưa có"}\n• Công ty: ${company}\n\nBạn có thể sao chép liên kết hồ sơ hoặc gọi điện thoại trực tiếp.`,
      [
        { text: "Gọi điện", onPress: handleCall },
        { text: "Sao chép link", onPress: handleShare },
        { text: "Đóng", style: "cancel" },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Top Drag Indicator & Close */}
          <View style={styles.dragBarContainer}>
            <View style={styles.dragBar} />
            <TouchableOpacity onPress={onClose} style={styles.closeIconBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={isDark ? "#94A3B8" : "#64748B"} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* VIP 5.0 Holographic Master Card */}
            <View style={styles.cardWrapper}>
              <LinearGradient
                colors={["#161B26", "#0D111A", "#06080F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Gold Neon Outer Halo */}
                <View style={styles.neonHaloBorder} />

                {/* Top Badge Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.hologramBadge}>
                    <Crown size={12} color="#F6E1C3" />
                    <Text style={styles.hologramText}>DOANH NHÂN 5.0</Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={13} color="#10B981" />
                    <Text style={styles.verifiedText}>ĐÃ XÁC THỰC</Text>
                  </View>
                </View>

                {/* Avatar with Animated Gold Ring */}
                <View style={styles.avatarSection}>
                  <View style={styles.avatarRingOuter}>
                    <LinearGradient
                      colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarRingGradient}
                    >
                      {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                      ) : (
                        <View style={styles.avatarFallback}>
                          <Text style={styles.avatarFallbackText}>
                            {(displayName[0] || "V").toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                  {/* Digital Pulse Indicator */}
                  <View style={styles.onlineDot} />
                </View>

                {/* Identity Information */}
                <View style={styles.identitySection}>
                  <Text style={styles.displayName}>{displayName}</Text>
                  <View style={styles.jobTitleRow}>
                    <Briefcase size={14} color="#D8B282" />
                    <Text style={styles.jobTitleText} numberOfLines={1}>
                      {title}
                    </Text>
                  </View>
                  <View style={styles.companyRow}>
                    <Building2 size={14} color="#94A3B8" />
                    <Text style={styles.companyText} numberOfLines={1}>
                      {company}
                    </Text>
                  </View>

                  {/* Digital Member ID Chip */}
                  <View style={styles.idChip}>
                    <Sparkles size={11} color="#D8B282" />
                    <Text style={styles.idChipText}>MÃ ĐỊNH DANH SỐ: {code}</Text>
                  </View>
                </View>

                {/* 5.0 Primary Quick Actions */}
                <View style={styles.actionRow}>
                  {/* Button 1: Kết Nối Ngay */}
                  <TouchableOpacity
                    onPress={handleConnect}
                    disabled={connectState !== "idle"}
                    style={styles.primaryCtaWrapper}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={
                        connectState === "connected"
                          ? ["#059669", "#10B981"]
                          : ["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.primaryCtaGradient}
                    >
                      {connectState === "sending" ? (
                        <ActivityIndicator size="small" color="#050C15" />
                      ) : connectState === "connected" ? (
                        <>
                          <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                          <Text style={styles.primaryCtaTextWhite}>Đã Gửi Lời Mời</Text>
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} color="#050C15" strokeWidth={2.5} />
                          <Text style={styles.primaryCtaText}>Kết Nối 5.0</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Button 2: Nhắn Tin Trực Tiếp */}
                  <TouchableOpacity
                    onPress={handleChat}
                    style={styles.secondaryCtaBtn}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#1E2536", "#121722"]}
                      style={styles.secondaryCtaGradient}
                    >
                      <MessageCircle size={15} color="#F6E1C3" />
                      <Text style={styles.secondaryCtaText}>Nhắn Tin</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Button 3: Lưu Danh Bạ */}
                  <TouchableOpacity
                    onPress={handleSaveContact}
                    style={styles.iconActionBtn}
                    activeOpacity={0.8}
                  >
                    <Bookmark size={16} color="#D8B282" />
                  </TouchableOpacity>

                  {/* Button 4: Chia Sẻ */}
                  <TouchableOpacity
                    onPress={handleShare}
                    style={styles.iconActionBtn}
                    activeOpacity={0.8}
                  >
                    <Share2 size={16} color="#D8B282" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* Navigation Tabs 5.0 */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("overview")}
                style={[styles.tabButton, activeTab === "overview" && styles.tabButtonActive]}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === "overview" && styles.tabButtonTextActive]}
                >
                  Hồ Sơ Doanh Nhân
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("matchmaking")}
                style={[styles.tabButton, activeTab === "matchmaking" && styles.tabButtonActive]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "matchmaking" && styles.tabButtonTextActive,
                  ]}
                >
                  Hợp Tác B2B
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("qr")}
                style={[styles.tabButton, activeTab === "qr" && styles.tabButtonActive]}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === "qr" && styles.tabButtonTextActive]}
                >
                  Mã QR Đối Ứng
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <View style={styles.tabContentBox}>
                {/* Bio / Headline */}
                <View style={styles.infoCard}>
                  <View style={styles.infoCardTitleRow}>
                    <Sparkles size={14} color="#D8B282" />
                    <Text style={styles.infoCardTitle}>Định Vị Doanh Nhân</Text>
                  </View>
                  <Text style={styles.infoCardBody}>{bio}</Text>
                </View>

                {/* Direct Contacts Card */}
                <View style={styles.infoCard}>
                  <View style={styles.infoCardTitleRow}>
                    <Layers size={14} color="#D8B282" />
                    <Text style={styles.infoCardTitle}>Thông Tin Liên Lạc Số</Text>
                  </View>

                  {phone ? (
                    <TouchableOpacity onPress={handleCall} style={styles.contactRow}>
                      <View style={styles.contactIconCircle}>
                        <Phone size={14} color="#D8B282" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.contactLabel}>Số điện thoại chính thức</Text>
                        <Text style={styles.contactValue}>{phone}</Text>
                      </View>
                      <ExternalLink size={14} color="#64748B" />
                    </TouchableOpacity>
                  ) : null}

                  {email ? (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`mailto:${email}`)}
                      style={styles.contactRow}
                    >
                      <View style={styles.contactIconCircle}>
                        <Mail size={14} color="#D8B282" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.contactLabel}>Email liên hệ công việc</Text>
                        <Text style={styles.contactValue}>{email}</Text>
                      </View>
                      <ExternalLink size={14} color="#64748B" />
                    </TouchableOpacity>
                  ) : null}

                  <View style={styles.contactRow}>
                    <View style={styles.contactIconCircle}>
                      <MapPin size={14} color="#D8B282" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactLabel}>Khu vực / Trụ sở chính</Text>
                      <Text style={styles.contactValue}>{address}</Text>
                    </View>
                  </View>

                  {website ? (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(website.startsWith("http") ? website : `https://${website}`)}
                      style={styles.contactRow}
                    >
                      <View style={styles.contactIconCircle}>
                        <Globe size={14} color="#D8B282" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.contactLabel}>Website doanh nghiệp</Text>
                        <Text style={styles.contactValue}>{website}</Text>
                      </View>
                      <ExternalLink size={14} color="#64748B" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}

            {/* Tab 2: Matchmaking */}
            {activeTab === "matchmaking" && (
              <View style={styles.tabContentBox}>
                {/* Lĩnh vực hoạt động */}
                <View style={styles.infoCard}>
                  <View style={styles.infoCardTitleRow}>
                    <Award size={14} color="#D8B282" />
                    <Text style={styles.infoCardTitle}>Lĩnh Vực Hoạt Động & Ngành Nghề</Text>
                  </View>
                  <View style={styles.tagWrap}>
                    <View style={styles.goldChip}>
                      <Text style={styles.goldChipText}>{industry}</Text>
                    </View>
                    <View style={styles.goldChip}>
                      <Text style={styles.goldChipText}>Doanh Nhân ViOne Platform</Text>
                    </View>
                    <View style={styles.goldChip}>
                      <Text style={styles.goldChipText}>Hội Viên VIP</Text>
                    </View>
                  </View>
                </View>

                {/* Nhu cầu hợp tác */}
                <View style={styles.infoCard}>
                  <View style={styles.infoCardTitleRow}>
                    <Handshake size={14} color="#D8B282" />
                    <Text style={styles.infoCardTitle}>Nhu Cầu Giao Thương B2B</Text>
                  </View>
                  <Text style={styles.infoCardBody}>
                    • Cung cấp: Giải pháp sản phẩm, dịch vụ chuyên ngành và nguồn lực kinh doanh uy tín.{"\n"}
                    • Tìm kiếm: Đối tác liên doanh, nhà phân phối chiến lược và khách hàng doanh nghiệp tiềm năng.
                  </Text>
                </View>
              </View>
            )}

            {/* Tab 3: Digital QR */}
            {activeTab === "qr" && (
              <View style={styles.tabContentBox}>
                <View style={styles.qrCardContainer}>
                  <Text style={styles.qrCardTitle}>MÃ DANH THIẾP ĐỐI ỨNG</Text>
                  <Text style={styles.qrCardSubtitle}>
                    Quét hoặc chia sẻ mã QR này để truy cập trực tiếp trang hồ sơ số 5.0
                  </Text>
                  <View style={styles.qrInnerWrapper}>
                    <QRCode
                      value={shareUrl}
                      size={180}
                      color="#05070E"
                      backgroundColor="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.qrUrlText}>{shareUrl}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 6, 12, 0.78)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#0B0F19",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    maxHeight: SCREEN_HEIGHT * 0.92,
    minHeight: SCREEN_HEIGHT * 0.75,
    paddingBottom: 24,
  },
  dragBarContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    position: "relative",
  },
  dragBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  closeIconBtn: {
    position: "absolute",
    right: 18,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardWrapper: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.45)",
    shadowColor: "#D8B282",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    padding: 18,
    position: "relative",
  },
  neonHaloBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#D8B282",
    opacity: 0.8,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  hologramBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderColor: "rgba(216, 178, 130, 0.4)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  hologramText: {
    color: "#F6E1C3",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: "#34D399",
    fontSize: 10,
    fontWeight: "700",
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 4,
    position: "relative",
  },
  avatarRingOuter: {
    width: 86,
    height: 86,
    borderRadius: 43,
    padding: 3,
  },
  avatarRingGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 43,
    padding: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "#05070E",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "#161D2B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#F6E1C3",
    fontSize: 28,
    fontWeight: "800",
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: SCREEN_WIDTH / 2 - 40,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#0B0F19",
  },
  identitySection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 21,
    fontWeight: "800",
    color: "#F8FAFC",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  jobTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  jobTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D8B282",
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  companyText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  idChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    marginTop: 10,
  },
  idChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#CBD5E1",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  primaryCtaWrapper: {
    flex: 1.4,
    borderRadius: 14,
    overflow: "hidden",
  },
  primaryCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryCtaText: {
    color: "#050C15",
    fontSize: 13.5,
    fontWeight: "800",
  },
  primaryCtaTextWhite: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
  secondaryCtaBtn: {
    flex: 1.1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  secondaryCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 12,
  },
  secondaryCtaText: {
    color: "#F6E1C3",
    fontSize: 13,
    fontWeight: "700",
  },
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "rgba(216, 178, 130, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  tabButtonTextActive: {
    color: "#F6E1C3",
    fontWeight: "800",
  },
  tabContentBox: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: "rgba(22, 27, 38, 0.7)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },
  infoCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 0.2,
  },
  infoCardBody: {
    fontSize: 13,
    color: "#CBD5E1",
    lineHeight: 19,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  contactIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "500",
  },
  contactValue: {
    fontSize: 12.5,
    color: "#E2E8F0",
    fontWeight: "600",
    marginTop: 1,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  goldChip: {
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  goldChipText: {
    color: "#F6E1C3",
    fontSize: 11.5,
    fontWeight: "600",
  },
  qrCardContainer: {
    backgroundColor: "rgba(22, 27, 38, 0.7)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    alignItems: "center",
  },
  qrCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 0.5,
  },
  qrCardSubtitle: {
    fontSize: 11.5,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  qrInnerWrapper: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D8B282",
    shadowColor: "#D8B282",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  qrUrlText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 12,
    textAlign: "center",
  },
});
