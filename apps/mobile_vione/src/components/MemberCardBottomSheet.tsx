import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  Share,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  QrCode,
  Nfc,
  Share2,
  X,
  Phone,
  Mail,
  Building2,
  Globe,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  User,
  Crown,
  MessageCircle,
  Briefcase,
  MapPin,
  ExternalLink,
  Handshake,
  Grid,
  Layers,
  Award,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { VIconMark } from "./VIconMark";
import { resolveMediaUrl } from "../utils/media";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface MemberCardData {
  id?: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  code?: string;
  website?: string;
  avatarUrl?: string;
  role?: string;
  bio?: string;
  address?: string;
}

interface MemberCardBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  member?: MemberCardData | null;
  onOpenMyQr?: () => void;
  onOpenNfc?: () => void;
  onOpenProfile?: () => void;
}

export const MemberCardBottomSheet: React.FC<MemberCardBottomSheetProps> = ({
  visible,
  onClose,
  member,
  onOpenMyQr,
  onOpenNfc,
  onOpenProfile,
}) => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // State for Gold vs Silver VIP Card & Profile Section
  const [cardStyle, setCardStyle] = useState<"gold" | "silver">("gold");
  const [profileType, setProfileType] = useState<"personal" | "business">("personal");
  const [patternType, setPatternType] = useState<"square" | "triangle" | "crystal">("square");

  const isGold = cardStyle === "gold";

  const displayName = member?.name || user?.displayName || user?.name || "Doanh nhân ViOne";
  const jobTitle = member?.title || user?.title || "Chủ tịch HĐQT & Tổng Giám Đốc";
  const companyName = member?.company || user?.company || "Tập đoàn Đầu tư & Công nghệ ViOne";
  const phone = member?.phone || user?.phone || "0912 345 678";
  const email = member?.email || user?.email || "ceo@vione.vn";
  const memberCode = member?.code || user?.code || "VN-8888";
  const website = member?.website || user?.website || "https://vione.vn";
  const avatarUrl = resolveMediaUrl(member?.avatarUrl || user?.avatarUrl);
  const bio =
    member?.bio ||
    (user as any)?.bio ||
    "Tiên phong ứng dụng công nghệ số và liên kết nguồn lực kiến tạo giá trị kinh doanh bền vững cho cộng đồng doanh nghiệp.";
  const address = member?.address || (user as any)?.address || "Hà Nội, Việt Nam";

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const zaloPhone = cleanPhone.replace(/^\+84/, "0").replace(/^84/, "0");
  const zaloUrl = `https://zalo.me/${zaloPhone}`;

  const getInitial = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "V";
    return parts[parts.length - 1][0].toUpperCase();
  };

  // PanResponder for smooth Swipe Down to Dismiss gesture
  const panY = useRef(new Animated.Value(0)).current;

  const resetPosition = () => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeWithAnimation = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      panY.setValue(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 8;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.6) {
          closeWithAnimation();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Danh thiếp Doanh nhân ViOne - ${displayName}`,
        message: `Kính mời Quý đối tác kết nối với ${displayName} (${companyName}) trên ViOne Connect: ${user?.shareUrl || `https://vione.vn/c/${memberCode}`}`,
        url: user?.shareUrl || `https://vione.vn/c/${memberCode}`,
      });
    } catch (err: any) {
      Alert.alert("Chia sẻ", "Không thể mở bảng chia sẻ trên thiết bị.");
    }
  };

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${cleanPhone}`).catch(() => {
        Alert.alert("Cuộc gọi", "Không thể mở trình quay số trên thiết bị.");
      });
    }
  };

  const handleZalo = () => {
    if (zaloPhone) {
      Linking.openURL(zaloUrl).catch(() => {
        Alert.alert("Zalo", "Không thể mở ứng dụng Zalo trên thiết bị.");
      });
    }
  };

  const handleOpenWeb = () => {
    const targetUrl = website.startsWith("http") ? website : `https://${website}`;
    Linking.openURL(targetUrl).catch(() => {
      Alert.alert("Website", "Không thể mở đường dẫn website.");
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropDismissArea} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? "#0B0F17" : "#FFFFFF",
              borderColor: isDark ? "rgba(216, 178, 130, 0.35)" : "rgba(216, 178, 130, 0.45)",
              transform: [{ translateY: panY }],
            },
          ]}
        >
          {/* Top Drag Handle Header */}
          <View {...panResponder.panHandlers} style={styles.dragZone}>
            <View
              style={[
                styles.dragHandleBar,
                { backgroundColor: isDark ? "rgba(216, 178, 130, 0.45)" : "rgba(163, 112, 60, 0.4)" },
              ]}
            />
            <View style={styles.headerTitleRow}>
              <View style={styles.headerLeft}>
                <View style={styles.vipTagPill}>
                  <Crown size={12} color="#D8B282" />
                  <Text style={styles.vipTagText}>DOANH NHÂN VIONE</Text>
                </View>
                <Text
                  style={[
                    styles.sheetMainTitle,
                    { color: isDark ? "#FFFFFF" : "#0F172A" },
                  ]}
                >
                  Thẻ Hội Viên Doanh Nghiệp
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeWithAnimation}
                style={[
                  styles.closeCircleBtn,
                  { backgroundColor: isDark ? "#181D2A" : "#F1F5F9" },
                ]}
                activeOpacity={0.7}
              >
                <X size={16} color={isDark ? "#D8B282" : "#475569"} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.78 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* TOGGLE SELECTOR: THẺ VÀNG vs THẺ BẠC */}
            <View style={styles.cardTypeSelectorRow}>
              <TouchableOpacity
                onPress={() => setCardStyle("gold")}
                style={[
                  styles.cardTypeOption,
                  isGold && styles.cardTypeOptionActiveGold,
                ]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isGold
                      ? ["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]
                      : ["transparent", "transparent"]
                  }
                  style={styles.cardTypeGradient}
                >
                  <Crown size={13} color={isGold ? "#050C15" : "#D8B282"} />
                  <Text
                    style={[
                      styles.cardTypeText,
                      { color: isGold ? "#050C15" : "#D8B282" },
                    ]}
                  >
                    Thẻ Vàng Hoàng Gia
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCardStyle("silver")}
                style={[
                  styles.cardTypeOption,
                  !isGold && styles.cardTypeOptionActiveSilver,
                ]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    !isGold
                      ? ["#FFFFFF", "#CBD5E1", "#94A3B8"]
                      : ["transparent", "transparent"]
                  }
                  style={styles.cardTypeGradient}
                >
                  <Sparkles size={13} color={!isGold ? "#050C15" : "#94A3B8"} />
                  <Text
                    style={[
                      styles.cardTypeText,
                      { color: !isGold ? "#050C15" : "#94A3B8" },
                    ]}
                  >
                    Thẻ Bạc Bạch Kim
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ============================================================== */}
            {/* 1. PHYSICAL LUXURY VIP CARD (MẠ VÀNG HOẶC MẠ BẠC)            */}
            {/* QUY CHUẨN: TRÊN THẺ CHỈ CÓ TÊN, CÔNG TY, SỐ ĐIỆN THOẠI       */}
            {/* ============================================================== */}
            <View
              style={[
                styles.cardOuterFrame,
                {
                  borderColor: isGold ? "#DFB76C" : "rgba(203, 213, 225, 0.8)",
                  shadowColor: isGold ? "#DFB76C" : "#94A3B8",
                },
              ]}
            >
              <LinearGradient
                colors={
                  isGold
                    ? ["#2A1F0D", "#140F06", "#0A0703"]
                    : ["#242E3D", "#111620", "#080B10"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* ViOne Sculpted Watermark Emblem chìm */}
                <View style={styles.watermarkWrap}>
                  <VIconMark size={145} />
                </View>

                {/* Top Row: Metallic Smart Chip, Contactless Wave & VIP Emblem */}
                <View style={styles.cardTopRow}>
                  <View style={styles.chipAndWaveWrap}>
                    <View
                      style={[
                        styles.smartChip,
                        {
                          borderColor: isGold ? "rgba(223, 183, 108, 0.8)" : "rgba(203, 213, 225, 0.8)",
                          backgroundColor: isGold ? "#D8B282" : "#CBD5E1",
                        },
                      ]}
                    >
                      <View style={styles.chipInnerGrid} />
                    </View>
                    <View style={styles.contactlessIconWrap}>
                      <Globe size={14} color={isGold ? "#DFB76C" : "#CBD5E1"} />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.membershipPill,
                      {
                        borderColor: isGold ? "rgba(223, 183, 108, 0.6)" : "rgba(203, 213, 225, 0.6)",
                        backgroundColor: isGold ? "rgba(223, 183, 108, 0.16)" : "rgba(203, 213, 225, 0.16)",
                      },
                    ]}
                  >
                    <Crown size={11} color={isGold ? "#FFD580" : "#FFFFFF"} />
                    <Text
                      style={[
                        styles.membershipPillText,
                        { color: isGold ? "#FFF3D6" : "#FFFFFF" },
                      ]}
                    >
                      {isGold ? "VIP MẠ VÀNG" : "VIP MẠ BẠC"}
                    </Text>
                  </View>
                </View>

                {/* Card Main Body: Avatar + TÊN, CÔNG TY, SỐ ĐIỆN THOẠI (CHỈ THẾ THÔI) */}
                <View style={styles.identityRow}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.cardAvatar} />
                  ) : (
                    <LinearGradient
                      colors={isGold ? ["#C29B69", "#8C653B"] : ["#94A3B8", "#475569"]}
                      style={styles.cardAvatarCircle}
                    >
                      <Text style={styles.avatarInitialText}>{getInitial(displayName)}</Text>
                    </LinearGradient>
                  )}

                  <View style={styles.identityDetails}>
                    {/* TÊN */}
                    <Text
                      style={[
                        styles.cardDisplayName,
                        { color: isGold ? "#FFFDF7" : "#FFFFFF" },
                      ]}
                      numberOfLines={1}
                    >
                      {displayName}
                    </Text>

                    {/* CÔNG TY */}
                    <View style={styles.companyRow}>
                      <Building2
                        size={13}
                        color={isGold ? "#DFB76C" : "#CBD5E1"}
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={[
                          styles.cardCompany,
                          { color: isGold ? "#F5E8D3" : "#E2E8F0" },
                        ]}
                        numberOfLines={1}
                      >
                        {companyName}
                      </Text>
                    </View>

                    {/* SỐ ĐIỆN THOẠI */}
                    <View style={styles.phoneRow}>
                      <Phone
                        size={13}
                        color={isGold ? "#F59E0B" : "#38BDF8"}
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={[
                          styles.cardPhone,
                          { color: isGold ? "#FDE68A" : "#FFFFFF" },
                        ]}
                        numberOfLines={1}
                      >
                        {phone}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Golden/Silver Laser Divider */}
                <View
                  style={[
                    styles.cardDivider,
                    {
                      backgroundColor: isGold
                        ? "rgba(223, 183, 108, 0.3)"
                        : "rgba(203, 213, 225, 0.3)",
                    },
                  ]}
                />

                {/* Verification Footer */}
                <View style={styles.cardFooterVerified}>
                  <ShieldCheck
                    size={13}
                    color={isGold ? "#D8B282" : "#38BDF8"}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.verifiedText,
                      { color: isGold ? "#F6E1C3" : "#E2E8F0" },
                    ]}
                  >
                    Đã xác thực danh tính Hội đồng Doanh nhân ViOne
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* ============================================================== */}
            {/* 2. CỤM NÚT HÀNH ĐỘNG GRADIENT 100% CHUẨN RULE 8              */}
            {/* ============================================================== */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? "#D8B282" : "#996515" },
              ]}
            >
              KẾT NỐI & LIÊN HỆ TRỰC TIẾP
            </Text>

            <View style={styles.actionButtonRow}>
              {/* Nút Gọi điện - Emerald Green Gradient */}
              <TouchableOpacity
                style={styles.actionBtnContainer}
                onPress={handleCall}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#059669", "#10B981", "#047857"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Phone size={15} color="#FFFFFF" />
                  <Text style={styles.actionBtnTextLight}>Gọi điện</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Nút Chat Zalo - Zalo Blue Gradient */}
              <TouchableOpacity
                style={styles.actionBtnContainer}
                onPress={handleZalo}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#0088FF", "#0066CC", "#0052A3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <MessageCircle size={15} color="#FFFFFF" />
                  <Text style={styles.actionBtnTextLight}>Chat Zalo</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Nút Mã QR - Royal Champagne Gold Gradient */}
              <TouchableOpacity
                style={styles.actionBtnContainer}
                onPress={() => {
                  onClose();
                  onOpenMyQr?.();
                }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <QrCode size={15} color="#050C15" />
                  <Text style={styles.actionBtnTextDark}>Mã QR</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Nút Chia sẻ - Obsidian Gold Outline Gradient */}
              <TouchableOpacity
                style={styles.actionBtnContainer}
                onPress={handleShare}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#1E293B", "#0F172A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.actionBtnGradient, styles.obsidianBorder]}
                >
                  <Share2 size={15} color="#D8B282" />
                  <Text style={styles.actionBtnTextGold}>Chia sẻ</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ============================================================== */}
            {/* 3. PROFILE SECTION DƯỚI THẺ: CÁ NHÂN / DOANH NGHIỆP DỰNG SẴN  */}
            {/* ĐA DẠNG BỐ CỤC: HÌNH VUÔNG, TAM GIÁC, TINH THỂ               */}
            {/* ============================================================== */}
            <View style={styles.profileSectionWrapper}>
              <View style={styles.profileSectionHeader}>
                <View style={styles.profileTabs}>
                  <TouchableOpacity
                    onPress={() => setProfileType("personal")}
                    style={[
                      styles.profileTabBtn,
                      profileType === "personal" && styles.profileTabBtnActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <User
                      size={13}
                      color={profileType === "personal" ? "#050C15" : isDark ? "#94A3B8" : "#64748B"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.profileTabText,
                        profileType === "personal" && styles.profileTabTextActive,
                      ]}
                    >
                      Hồ sơ cá nhân
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setProfileType("business")}
                    style={[
                      styles.profileTabBtn,
                      profileType === "business" && styles.profileTabBtnActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Building2
                      size={13}
                      color={profileType === "business" ? "#050C15" : isDark ? "#94A3B8" : "#64748B"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.profileTabText,
                        profileType === "business" && styles.profileTabTextActive,
                      ]}
                    >
                      Hồ sơ doanh nghiệp
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Pattern Layout Switcher */}
                <View style={styles.patternSwitcher}>
                  <TouchableOpacity
                    onPress={() => setPatternType("square")}
                    style={[
                      styles.patternChip,
                      patternType === "square" && styles.patternChipActive,
                    ]}
                  >
                    <Grid size={11} color={patternType === "square" ? "#D8B282" : "#94A3B8"} />
                    <Text
                      style={[
                        styles.patternChipText,
                        patternType === "square" && styles.patternChipTextActive,
                      ]}
                    >
                      Vuông
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPatternType("triangle")}
                    style={[
                      styles.patternChip,
                      patternType === "triangle" && styles.patternChipActive,
                    ]}
                  >
                    <Layers size={11} color={patternType === "triangle" ? "#D8B282" : "#94A3B8"} />
                    <Text
                      style={[
                        styles.patternChipText,
                        patternType === "triangle" && styles.patternChipTextActive,
                      ]}
                    >
                      Tam giác
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPatternType("crystal")}
                    style={[
                      styles.patternChip,
                      patternType === "crystal" && styles.patternChipActive,
                    ]}
                  >
                    <Sparkles size={11} color={patternType === "crystal" ? "#D8B282" : "#94A3B8"} />
                    <Text
                      style={[
                        styles.patternChipText,
                        patternType === "crystal" && styles.patternChipTextActive,
                      ]}
                    >
                      Tinh thể
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Decorative Geometric Profile Card */}
              <View
                style={[
                  styles.profileDossierCard,
                  {
                    backgroundColor: isDark ? "#121724" : "#F8FAFC",
                    borderColor: isDark ? "rgba(216, 178, 130, 0.28)" : "#E2E8F0",
                  },
                ]}
              >
                {/* Geometric Pattern Overlay Hint */}
                <View style={styles.geometricPatternBadge}>
                  <Text style={styles.patternNoticeText}>
                    {patternType === "square"
                      ? "■ BỐ CỤC LƯỚI KHỐI VUÔNG CHUẨN TƯ PHÁP"
                      : patternType === "triangle"
                      ? "▲ BỐ CỤC LƯỚI TAM GIÁC ĐA DIỆN TĂNG TRƯỞNG"
                      : "◆ BỐ CỤC TINH THỂ OBSIDIAN ĐA TẦNG"}
                  </Text>
                </View>

                {profileType === "personal" ? (
                  /* HỒ SƠ CÁ NHÂN */
                  <View style={styles.profileBody}>
                    <View style={styles.dossierHeader}>
                      <View style={styles.dossierAvatarWrap}>
                        {avatarUrl ? (
                          <Image source={{ uri: avatarUrl }} style={styles.dossierAvatar} />
                        ) : (
                          <View style={styles.dossierAvatarPlaceholder}>
                            <Text style={styles.dossierAvatarText}>{getInitial(displayName)}</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.dossierName,
                            { color: isDark ? "#FFFFFF" : "#0F172A" },
                          ]}
                        >
                          {displayName}
                        </Text>
                        <Text style={styles.dossierRole}>{jobTitle}</Text>
                        <Text style={styles.dossierSubOrg}>{companyName}</Text>
                      </View>
                    </View>

                    {/* Bio giới thiệu */}
                    <View
                      style={[
                        styles.bioBox,
                        {
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
                          borderColor: isDark ? "rgba(216, 178, 130, 0.15)" : "#E2E8F0",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.bioText,
                          { color: isDark ? "#CBD5E1" : "#475569" },
                        ]}
                      >
                        "{bio}"
                      </Text>
                    </View>

                    {/* Meta info fields */}
                    <View style={styles.dossierMetaGrid}>
                      <View style={styles.dossierMetaRow}>
                        <Mail size={14} color="#D8B282" style={{ marginRight: 8 }} />
                        <Text style={[styles.dossierMetaText, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                          {email}
                        </Text>
                      </View>

                      <TouchableOpacity style={styles.dossierMetaRow} onPress={handleOpenWeb}>
                        <Globe size={14} color="#D8B282" style={{ marginRight: 8 }} />
                        <Text
                          style={[styles.dossierMetaText, { color: "#38BDF8" }]}
                          numberOfLines={1}
                        >
                          {website}
                        </Text>
                        <ExternalLink size={12} color="#38BDF8" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>

                      <View style={styles.dossierMetaRow}>
                        <MapPin size={14} color="#D8B282" style={{ marginRight: 8 }} />
                        <Text style={[styles.dossierMetaText, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                          {address}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  /* HỒ SƠ DOANH NGHIỆP */
                  <View style={styles.profileBody}>
                    <View style={styles.dossierHeader}>
                      <View
                        style={[
                          styles.bizLogoPlaceholder,
                          { backgroundColor: isDark ? "rgba(216, 178, 130, 0.15)" : "#FEF3C7" },
                        ]}
                      >
                        <Building2 size={24} color="#D8B282" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.dossierName,
                            { color: isDark ? "#FFFFFF" : "#0F172A" },
                          ]}
                        >
                          {companyName}
                        </Text>
                        <Text style={styles.dossierRole}>Doanh nghiệp Hội viên ViOne Connect</Text>
                        <Text style={styles.dossierSubOrg}>Mã số định danh: {memberCode}</Text>
                      </View>
                    </View>

                    {/* Lĩnh vực & Năng lực */}
                    <View style={styles.bizHighlightBox}>
                      <Text style={styles.bizHighlightTitle}>Lĩnh vực hoạt động trọng tâm</Text>
                      <View style={styles.bizTagRow}>
                        <View style={styles.bizTagPill}>
                          <Text style={styles.bizTagText}>Chuyển đổi số & AI</Text>
                        </View>
                        <View style={styles.bizTagPill}>
                          <Text style={styles.bizTagText}>Kết nối thương mại B2B</Text>
                        </View>
                        <View style={styles.bizTagPill}>
                          <Text style={styles.bizTagText}>Đầu tư & Hợp tác</Text>
                        </View>
                      </View>
                    </View>

                    {/* Chi tiết doanh nghiệp */}
                    <View style={styles.dossierMetaGrid}>
                      <TouchableOpacity style={styles.dossierMetaRow} onPress={handleOpenWeb}>
                        <Globe size={14} color="#D8B282" style={{ marginRight: 8 }} />
                        <Text
                          style={[styles.dossierMetaText, { color: "#38BDF8" }]}
                          numberOfLines={1}
                        >
                          {website}
                        </Text>
                        <ExternalLink size={12} color="#38BDF8" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>

                      <View style={styles.dossierMetaRow}>
                        <MapPin size={14} color="#D8B282" style={{ marginRight: 8 }} />
                        <Text style={[styles.dossierMetaText, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                          Trụ sở: {address}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Nút Kêu gọi Kết nối B2B với LinearGradient Hoàng Gia */}
                <TouchableOpacity
                  style={styles.connectCtaContainer}
                  onPress={() => {
                    onClose();
                    onOpenProfile?.();
                  }}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.connectCtaGradient}
                  >
                    <Handshake size={16} color="#050C15" style={{ marginRight: 6 }} />
                    <Text style={styles.connectCtaText}>Kết Nối Giao Thương B2B</Text>
                    <ChevronRight size={16} color="#050C15" style={{ marginLeft: 4 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* QUYỀN LỢI ĐẶC QUYỀN HỘI VIÊN VIONE */}
            <View
              style={[
                styles.privilegesBox,
                {
                  backgroundColor: isDark ? "#121724" : "#F8FAFC",
                  borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#E2E8F0",
                },
              ]}
            >
              <View style={styles.privilegeItem}>
                <Crown size={15} color="#D8B282" style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.privilegeTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    Mạng lưới 5.000+ Lãnh đạo Doanh nghiệp
                  </Text>
                  <Text
                    style={[
                      styles.privilegeDesc,
                      { color: isDark ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    Kết nối 1-1, trao đổi cơ hội kinh doanh và tìm kiếm đối tác chiến lược.
                  </Text>
                </View>
              </View>

              <View style={styles.privilegeItem}>
                <Sparkles size={15} color="#D8B282" style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.privilegeTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    AI Copilot Gợi Ý Đối Tác Tự Động
                  </Text>
                  <Text
                    style={[
                      styles.privilegeDesc,
                      { color: isDark ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    Thuật toán phân tích ngành nghề và ghép cặp cơ hội B2B chính xác.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  backdropDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    paddingTop: 10,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 20,
  },
  dragZone: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  dragHandleBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  vipTagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  vipTagText: {
    color: "#D8B282",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  sheetMainTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  closeCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardTypeSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  cardTypeOption: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  cardTypeOptionActiveGold: {
    borderColor: "#DFB76C",
  },
  cardTypeOptionActiveSilver: {
    borderColor: "#CBD5E1",
  },
  cardTypeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  cardTypeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  cardOuterFrame: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  cardGradient: {
    padding: 20,
    position: "relative",
  },
  watermarkWrap: {
    position: "absolute",
    right: -25,
    bottom: -30,
    opacity: 0.12,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chipAndWaveWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  smartChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  chipInnerGrid: {
    width: "70%",
    height: "60%",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  contactlessIconWrap: {
    transform: [{ rotate: "45deg" }],
  },
  membershipPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
    borderWidth: 1,
  },
  membershipPillText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#D8B282",
    marginRight: 14,
  },
  cardAvatarCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D8B282",
    marginRight: 14,
  },
  avatarInitialText: {
    color: "#050C15",
    fontSize: 24,
    fontWeight: "900",
  },
  identityDetails: {
    flex: 1,
  },
  cardDisplayName: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  cardCompany: {
    fontSize: 12.5,
    fontWeight: "700",
    flex: 1,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardPhone: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
    marginBottom: 12,
  },
  cardFooterVerified: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 2,
  },
  actionButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  actionBtnContainer: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  obsidianBorder: {
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  actionBtnTextLight: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },
  actionBtnTextDark: {
    color: "#050C15",
    fontSize: 11.5,
    fontWeight: "800",
  },
  actionBtnTextGold: {
    color: "#F6E1C3",
    fontSize: 11.5,
    fontWeight: "800",
  },
  profileSectionWrapper: {
    marginBottom: 20,
  },
  profileSectionHeader: {
    marginBottom: 12,
    gap: 10,
  },
  profileTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  profileTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 11,
  },
  profileTabBtnActive: {
    backgroundColor: "#D8B282",
  },
  profileTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
  },
  profileTabTextActive: {
    color: "#050C15",
    fontWeight: "800",
  },
  patternSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  patternChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  patternChipActive: {
    borderColor: "#D8B282",
    backgroundColor: "rgba(216, 178, 130, 0.15)",
  },
  patternChipText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#94A3B8",
  },
  patternChipTextActive: {
    color: "#D8B282",
    fontWeight: "700",
  },
  profileDossierCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  geometricPatternBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  patternNoticeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 0.8,
  },
  profileBody: {
    gap: 12,
  },
  dossierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dossierAvatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#D8B282",
  },
  dossierAvatar: {
    width: "100%",
    height: "100%",
  },
  dossierAvatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1E2738",
    alignItems: "center",
    justifyContent: "center",
  },
  dossierAvatarText: {
    color: "#D8B282",
    fontSize: 18,
    fontWeight: "800",
  },
  bizLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#D8B282",
  },
  dossierName: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  dossierRole: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D8B282",
    marginTop: 2,
  },
  dossierSubOrg: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  bioBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  bioText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  dossierMetaGrid: {
    gap: 8,
  },
  dossierMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dossierMetaText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  bizHighlightBox: {
    backgroundColor: "rgba(216, 178, 130, 0.08)",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    gap: 8,
  },
  bizHighlightTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 0.5,
  },
  bizTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  bizTagPill: {
    backgroundColor: "rgba(216, 178, 130, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bizTagText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  connectCtaContainer: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 14,
    shadowColor: "#D8B282",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  connectCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  connectCtaText: {
    color: "#050C15",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  privilegesBox: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginTop: 6,
  },
  privilegeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  privilegeTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    marginBottom: 2,
  },
  privilegeDesc: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 15,
  },
});
