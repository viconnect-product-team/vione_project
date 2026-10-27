import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Linking,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Compass,
  Landmark,
  Trophy,
  Flame,
  Ticket,
  Archive,
  Award,
  Sparkles,
  ChevronRight,
  MapPin,
  Calendar,
  X,
  QrCode,
  Share2,
  CheckCircle2,
  Play,
  RotateCcw,
  Volume2,
  Radio,
  FileCheck2,
  ExternalLink,
  Star,
  Store,
  ScanLine,
  AlertTriangle,
} from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { apiRequest } from "../../api/client";
import { Colors } from "../../theme/colors";

const { width } = Dimensions.get("window");

export type PlatformTab = "overview" | "heritage" | "museum" | "sport" | "run" | "tickets" | "review" | "archive";

export const PlatformAppScreen: React.FC<{
  navigation?: any;
  onBack?: () => void;
  initialTab?: PlatformTab;
}> = ({
  navigation,
  onBack,
  initialTab = "overview",
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>(initialTab);
  const [isCitizenPassOpen, setCitizenPassOpen] = useState(false);
  const [stampsCount, setStampsCount] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [museums, setMuseums] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reviewStores, setReviewStores] = useState<any[]>([]);

  // Ticket Validator state
  const [valCode, setValCode] = useState("TK-HUE-2026-99");
  const [valResult, setValResult] = useState<any>(null);
  const [validatingTicket, setValidatingTicket] = useState(false);

  // Museum 3D state
  const [artifactRotation, setArtifactRotation] = useState(0);

  // Run Timing Simulator state
  const [bibInput, setBibInput] = useState("VNE-42-001");
  const [selectedSplit, setSelectedSplit] = useState<"start" | "split_10k" | "split_21k" | "finish">("split_10k");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [certData, setCertData] = useState<any>(null);

  // Registration BIB modal
  const [regBibModalOpen, setRegBibModalOpen] = useState(false);
  const [runnerName, setRunnerName] = useState("Nguyễn Văn An");
  const [selectedDistance, setSelectedDistance] = useState(42.195);

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: PlatformTab) => {
    try {
      setLoading(true);
      if (tab === "overview") {
        const res = await apiRequest("/platform-hub/overview");
        setOverview(res);
      } else if (tab === "heritage") {
        const res = await apiRequest("/platform-hub/heritage");
        setHeritageSites(Array.isArray(res) ? res : []);
      } else if (tab === "museum") {
        const res = await apiRequest("/platform-hub/museums");
        setMuseums(Array.isArray(res) ? res : []);
      } else if (tab === "sport") {
        const res = await apiRequest("/platform-hub/sport/tournaments");
        setTournaments(Array.isArray(res) ? res : []);
      } else if (tab === "run") {
        const resRaces = await apiRequest("/platform-hub/run/races");
        setRaces(Array.isArray(resRaces) ? resRaces : []);
        if (Array.isArray(resRaces) && resRaces.length > 0) {
          const lb = await apiRequest(`/platform-hub/run/races/${resRaces[0].id}/leaderboard`);
          setLeaderboard(Array.isArray(lb) ? lb : []);
        }
      } else if (tab === "tickets") {
        const res = await apiRequest("/platform-hub/tickets/my-tickets");
        setTickets(Array.isArray(res) ? res : []);
      } else if (tab === "review") {
        const res = await apiRequest("/platform-hub/reviews/stores");
        setReviewStores(Array.isArray(res) ? res : []);
      } else if (tab === "archive") {
        const res = await apiRequest("/platform-hub/archives");
        setArchives(Array.isArray(res) ? res : []);
      }
    } catch (err) {
      console.warn("API request fallback for tab:", tab, err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateTicket = async () => {
    if (!valCode.trim()) return;
    try {
      setValidatingTicket(true);
      const res: any = await apiRequest("/platform-hub/tickets/validate", {
        method: "POST",
        body: { ticketCode: valCode.trim(), staffName: "Nhân viên Soát vé Mobile" },
      });
      setValResult(res);
      Alert.alert(res?.valid ? "Xác Thực Thành Công" : "Cảnh Báo", res?.message || "");
      loadTabData("tickets");
    } catch (err: any) {
      Alert.alert("Lỗi", "Không tìm thấy vé trong hệ thống!");
    } finally {
      setValidatingTicket(false);
    }
  };

  const handleSimulateNfcReview = async (store: any) => {
    try {
      const res: any = await apiRequest("/platform-hub/reviews/submit", {
        method: "POST",
        body: {
          storeId: store.id,
          rating: 5,
          comment: "Dịch vụ và không gian di sản rất tuyệt vời!",
          customerName: "Nguyễn Văn An",
        },
      });
      Alert.alert(
        "Chạm NFC Review 5 Sao Thành Công!",
        `Cảm ơn bạn! Điểm ${store.store_name} tặng bạn voucher: ${res?.voucher || store.reward_voucher}`
      );
      loadTabData("review");
    } catch {
      Alert.alert("Thông Báo", `Đã lưu đánh giá 5 sao cho ${store.store_name}! Mã voucher: ${store.reward_voucher}`);
    }
  };

  const handleStampHeritage = async (siteId: string) => {
    try {
      await apiRequest(`/platform-hub/heritage/${siteId}/stamp`, {
        method: "POST",
        body: { note: "Điểm danh di sản qua app ViOne Mobile" },
      });
      setStampsCount((c) => c + 1);
      Alert.alert("Thành Công", "Đã đóng dấu lưu niệm di sản vào Hộ chiếu số!");
    } catch {
      Alert.alert("Thông Báo", "Đã lưu dấu ấn vào Hộ chiếu công dân số cục bộ!");
      setStampsCount((c) => c + 1);
    }
  };

  const handleSimulateSplit = async () => {
    if (!races[0]?.id) return;
    try {
      await apiRequest("/platform-hub/run/timing/simulate-split", {
        method: "POST",
        body: {
          raceId: races[0].id,
          bibNumber: bibInput,
          checkpoint: selectedSplit,
        },
      });
      Alert.alert("Timing RFID", `Đã ghi nhận quét chip BIB ${bibInput} tại thảm ${selectedSplit}`);
      loadTabData("run");
    } catch {
      Alert.alert("Timing RFID", `Mô phỏng thảm ${selectedSplit} thành công cho BIB ${bibInput}`);
    }
  };

  const handleRegisterBib = async () => {
    if (!races[0]?.id) return;
    try {
      await apiRequest(`/platform-hub/run/races/${races[0].id}/register-bib`, {
        method: "POST",
        body: {
          runnerName,
          distanceKm: selectedDistance,
          runnerGender: "Nam",
          runnerAge: 32,
        },
      });
      Alert.alert("Thành Công", "Đã cấp số BIB điện tử thành công! Kiểm tra trong Ví Vé.");
      setRegBibModalOpen(false);
      loadTabData("run");
    } catch {
      Alert.alert("Thành Công", "Đã cấp số BIB điện tử tự động!");
      setRegBibModalOpen(false);
    }
  };

  const tabs: { key: PlatformTab; label: string; icon: any }[] = [
    { key: "overview", label: "Tổng Quan", icon: Compass },
    { key: "heritage", label: "Di Sản", icon: Landmark },
    { key: "museum", label: "Bảo Tàng 3D", icon: Landmark },
    { key: "sport", label: "Thể Thao", icon: Trophy },
    { key: "run", label: "Giải Chạy", icon: Flame },
    { key: "tickets", label: "Ví & Soát Vé", icon: Ticket },
    { key: "review", label: "NFC Review", icon: Radio },
    { key: "archive", label: "Tư Liệu", icon: Archive },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Platform Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <X size={20} color="#F6E1C3" />
            </TouchableOpacity>
          )}
          <View style={styles.logoBadge}>
            <Sparkles size={16} color="#050C15" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={styles.headerTitle}>VICONNECT PLATFORM</Text>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>Bản Di Sản & Thể Thao</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>Bảo tồn di sản số • Thể thao đa môn</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCitizenPassOpen(true)}
            style={{ borderRadius: 10, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.passBtnGradient}
            >
              <Award size={14} color="#050C15" />
              <Text style={styles.passBtnText}>Hộ Chiếu ({stampsCount})</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Scrollable Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.key)}
                style={styles.tabItemWrapper}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabActiveGradient}
                  >
                    <Icon size={14} color="#050C15" />
                    <Text style={styles.tabActiveText}>{tab.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabInactive}>
                    <Icon size={14} color="#D8B282" />
                    <Text style={styles.tabInactiveText}>{tab.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Body */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#D8B282" />
          <Text style={styles.loadingText}>Đang nạp dữ liệu nền tảng...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <View style={styles.tabContent}>
              {/* Hero Banner */}
              <View style={styles.heroCard}>
                <LinearGradient
                  colors={["#161E2E", "#0A101D"]}
                  style={styles.heroGradient}
                >
                  <View style={styles.heroBadgeRow}>
                    <Sparkles size={12} color="#F6E1C3" />
                    <Text style={styles.heroBadgeText}>NỀN TẢNG TRUNG ƯƠNG QUỐC GIA</Text>
                  </View>
                  <Text style={styles.heroTitle}>Bảo Tồn Di Sản & Nâng Tầm Thể Thao</Text>
                  <Text style={styles.heroDesc}>
                    Hệ thống thuộc quản trị trực tiếp của ViConnect: tích hợp di sản số VR360, bảo tàng cổ vật 3D NFC, giải đấu đa môn và hệ thống chip timing marathon.
                  </Text>
                  <View style={styles.heroActions}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setActiveTab("heritage")}
                      style={styles.gradientBtnWrapper}
                    >
                      <LinearGradient
                        colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBtn}
                      >
                        <Landmark size={14} color="#050C15" />
                        <Text style={styles.gradientBtnText}>Khám Phá Di Sản</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setActiveTab("run")}
                      style={styles.gradientBtnWrapper}
                    >
                      <LinearGradient
                        colors={["#2A2418", "#1E1A12"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.gradientBtn, { borderWidth: 1, borderColor: "rgba(216,178,130,0.5)" }]}
                      >
                        <Flame size={14} color="#D8B282" />
                        <Text style={[styles.gradientBtnText, { color: "#F6E1C3" }]}>Giải Chạy RFID</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              {/* 4 Pillar Grid */}
              <Text style={styles.sectionHeader}>4 Trụ Cột Nền Tảng ViConnect</Text>
              <View style={styles.pillarGrid}>
                {/* Pillar 1 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("heritage")}
                  style={styles.pillarCard}
                >
                  <View style={styles.pillarHeader}>
                    <Landmark size={20} color="#D8B282" />
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                  <Text style={styles.pillarTitle}>ViOne Heritage</Text>
                  <Text style={styles.pillarSub}>Di sản số • VR360 • GPS Thuyết minh</Text>
                </TouchableOpacity>

                {/* Pillar 2 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("museum")}
                  style={styles.pillarCard}
                >
                  <View style={styles.pillarHeader}>
                    <RotateCcw size={20} color="#60A5FA" />
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                  <Text style={styles.pillarTitle}>ViOne Museum</Text>
                  <Text style={styles.pillarSub}>Bảo tàng số 3D • Chạm thẻ NFC</Text>
                </TouchableOpacity>

                {/* Pillar 3 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("sport")}
                  style={styles.pillarCard}
                >
                  <View style={styles.pillarHeader}>
                    <Trophy size={20} color="#34D399" />
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                  <Text style={styles.pillarTitle}>ViOne Sport</Text>
                  <Text style={styles.pillarSub}>Pickleball • Nhánh đấu • Tỉ số live</Text>
                </TouchableOpacity>

                {/* Pillar 4 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("run")}
                  style={styles.pillarCard}
                >
                  <View style={styles.pillarHeader}>
                    <Flame size={20} color="#F87171" />
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                  <Text style={styles.pillarTitle}>ViOne Run</Text>
                  <Text style={styles.pillarSub}>Cấp BIB tự động • Timing RFID</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 2: HERITAGE */}
          {activeTab === "heritage" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Di Tích Lịch Sử & Danh Thắng Quốc Gia</Text>
              {(heritageSites.length > 0 ? heritageSites : [
                { id: "1", name: "Quần thể Di tích Cố đô Huế", province: "Thừa Thiên Huế", category: "Di sản thế giới UNESCO", description: "Kinh đô của triều Nguyễn từ 1802 đến 1945, bảo tồn hệ thống thành quách, cung điện, lăng tẩm uy nghiêm.", vr_tour_url: "https://vr360.hue.vn" },
                { id: "2", name: "Hoàng thành Thăng Long", province: "Hà Nội", category: "Di sản thế giới UNESCO", description: "Trung tâm quyền lực chính trị qua 13 thế kỷ liên tục từ thời Lý, Trần, Lê, Mạc đến Nguyễn.", vr_tour_url: "https://hoangthanhthanglong.vn" },
                { id: "3", name: "Đô thị cổ Hội An", province: "Quảng Nam", category: "Di sản thế giới UNESCO", description: "Thương cảng quốc tế truyền thống Đông Nam Á được bảo tồn gần như nguyên vẹn.", vr_tour_url: "https://hoianvr360.vn" }
              ]).map((site) => (
                <View key={site.id} style={styles.heritageCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardCategory}>{site.category || "Di tích văn hóa"}</Text>
                    <View style={styles.locationTag}>
                      <MapPin size={11} color="#D8B282" />
                      <Text style={styles.locationText}>{site.province}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{site.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={3}>{site.description}</Text>

                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (site.vr_tour_url) Linking.openURL(site.vr_tour_url);
                        else Alert.alert("VR360", "Đang mở không gian thực tế ảo 360 độ...");
                      }}
                      style={styles.gradientBtnWrapper}
                    >
                      <LinearGradient
                        colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBtnSmall}
                      >
                        <ExternalLink size={12} color="#050C15" />
                        <Text style={styles.gradientBtnSmallText}>Xem VR360</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => Alert.alert("Audio Guide", `Đang phát thuyết minh tự động GPS cho: ${site.name}`)}
                      style={styles.gradientBtnWrapper}
                    >
                      <LinearGradient
                        colors={["#2A2418", "#1E1A12"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.gradientBtnSmall, { borderWidth: 1, borderColor: "rgba(216,178,130,0.4)" }]}
                      >
                        <Volume2 size={12} color="#D8B282" />
                        <Text style={[styles.gradientBtnSmallText, { color: "#F6E1C3" }]}>Audio GPS</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleStampHeritage(site.id)}
                      style={styles.gradientBtnWrapper}
                    >
                      <LinearGradient
                        colors={["#10B981", "#059669"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBtnSmall}
                      >
                        <Award size={12} color="#FFFFFF" />
                        <Text style={[styles.gradientBtnSmallText, { color: "#FFFFFF" }]}>Đóng Dấu</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: MUSEUM */}
          {activeTab === "museum" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Bảo Vật Quốc Gia & Mô Phỏng Cổ Vật 3D</Text>
              
              {/* 3D Viewer Simulator Card */}
              <View style={styles.viewer3dCard}>
                <View style={styles.viewerHeaderRow}>
                  <Text style={styles.viewerTitle}>Trống đồng Ngọc Lũ (Thời Đông Sơn)</Text>
                  <Text style={styles.badge3d}>3D Digital Twin</Text>
                </View>
                <View style={styles.modelCanvas}>
                  <RotateCcw size={40} color="#D8B282" />
                  <Text style={styles.modelCanvasText}>Góc xoay hiện tại: {artifactRotation}°</Text>
                  <Text style={styles.modelCanvasSub}>Bảo vật quốc gia số 01 • Niên đại 2500 năm</Text>
                </View>
                <View style={styles.rotationControls}>
                  <TouchableOpacity
                    onPress={() => setArtifactRotation((r) => (r - 45 + 360) % 360)}
                    style={styles.gradientBtnWrapper}
                  >
                    <LinearGradient
                      colors={["#2A2418", "#1E1A12"]}
                      style={[styles.gradientBtnSmall, { borderWidth: 1, borderColor: "rgba(216,178,130,0.4)" }]}
                    >
                      <RotateCcw size={14} color="#F6E1C3" />
                      <Text style={[styles.gradientBtnSmallText, { color: "#F6E1C3" }]}>Xoay Trái (-45°)</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setArtifactRotation((r) => (r + 45) % 360)}
                    style={styles.gradientBtnWrapper}
                  >
                    <LinearGradient
                      colors={["#2A2418", "#1E1A12"]}
                      style={[styles.gradientBtnSmall, { borderWidth: 1, borderColor: "rgba(216,178,130,0.4)" }]}
                    >
                      <RotateCcw size={14} color="#F6E1C3" />
                      <Text style={[styles.gradientBtnSmallText, { color: "#F6E1C3" }]}>Xoay Phải (+45°)</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* NFC Touch button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => Alert.alert("NFC Cổ Vật", "Đã nhận diện thẻ NFC bảo vật! Đang tải thuyết minh chi tiết.")}
                  style={[styles.gradientBtnWrapper, { marginTop: 12 }]}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBtn}
                  >
                    <Radio size={14} color="#050C15" />
                    <Text style={styles.gradientBtnText}>Mô Phỏng Chạm Thẻ NFC Cổ Vật</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 4: SPORT */}
          {activeTab === "sport" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Giải Đấu Thể Thao Đa Môn ViConnect</Text>
              
              {/* Bracket Tree Preview */}
              <View style={styles.bracketCard}>
                <View style={styles.bracketHeader}>
                  <Trophy size={16} color="#D8B282" />
                  <Text style={styles.bracketTitle}>Nhánh Đấu: Giải Pickleball Doanh Nhân 2026</Text>
                </View>
                <Text style={styles.bracketSub}>Thể thức loại trực tiếp 3 set • Tỉ số thời gian thực</Text>

                <View style={styles.matchItem}>
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>Đôi Nam ViConnect HN</Text>
                    <Text style={styles.teamScore}>2</Text>
                  </View>
                  <View style={styles.matchDivider} />
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>Đôi Nam CEO SG Club</Text>
                    <Text style={styles.teamScore}>1</Text>
                  </View>
                  <View style={styles.matchStatusRow}>
                    <Text style={styles.matchSetDetail}>(11-9, 8-11, 11-7)</Text>
                    <Text style={styles.matchCompletedBadge}>Hoàn thành</Text>
                  </View>
                </View>

                <View style={styles.matchItem}>
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>Pickleball Doanh Nhân Huế</Text>
                    <Text style={styles.teamScore}>2</Text>
                  </View>
                  <View style={styles.matchDivider} />
                  <View style={styles.matchTeamRow}>
                    <Text style={styles.teamName}>CLB Thể Thao Đà Nẵng</Text>
                    <Text style={styles.teamScore}>0</Text>
                  </View>
                  <View style={styles.matchStatusRow}>
                    <Text style={styles.matchSetDetail}>(11-6, 11-4)</Text>
                    <Text style={styles.matchCompletedBadge}>Hoàn thành</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 5: RUN */}
          {activeTab === "run" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>ViOne Heritage Marathon & Timing RFID</Text>
              
              {/* Race Info & BIB Registration CTA */}
              <View style={styles.raceHeroCard}>
                <Text style={styles.raceTitle}>ViOne Heritage Marathon Cố Đô Huế 2026</Text>
                <Text style={styles.raceDate}>Cung đường di sản: Đại Nội • Chùa Thiên Mụ • Đồi Vọng Cảnh</Text>
                
                <View style={styles.distancesRow}>
                  {[5, 10, 21, 42.195].map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setSelectedDistance(d)}
                      style={[
                        styles.distanceChip,
                        selectedDistance === d && styles.distanceChipActive,
                      ]}
                    >
                      <Text style={[styles.distanceText, selectedDistance === d && styles.distanceTextActive]}>
                        {d} KM
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setRegBibModalOpen(true)}
                  style={[styles.gradientBtnWrapper, { marginTop: 12 }]}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBtn}
                  >
                    <Flame size={14} color="#050C15" />
                    <Text style={styles.gradientBtnText}>Đăng Ký & Nhận Số BIB Điện Tử</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* RFID Timing Gate Simulator */}
              <View style={styles.rfidCard}>
                <View style={styles.bracketHeader}>
                  <Radio size={16} color="#F87171" />
                  <Text style={styles.bracketTitle}>Mô Phỏng Thảm Chip RFID Thời Gian Thực</Text>
                </View>
                <Text style={styles.bracketSub}>Ghi nhận runner đi qua thảm tính giờ tự động</Text>

                <View style={styles.rfidInputRow}>
                  <TextInput
                    style={styles.bibInput}
                    value={bibInput}
                    onChangeText={setBibInput}
                    placeholder="Số BIB (VNE-42-001)"
                    placeholderTextColor="#64748B"
                  />
                  <View style={styles.splitSelector}>
                    {(["split_10k", "split_21k", "finish"] as const).map((cp) => (
                      <TouchableOpacity
                        key={cp}
                        onPress={() => setSelectedSplit(cp)}
                        style={[styles.splitBtn, selectedSplit === cp && styles.splitBtnActive]}
                      >
                        <Text style={[styles.splitText, selectedSplit === cp && styles.splitTextActive]}>
                          {cp === "finish" ? "Finish" : cp === "split_10k" ? "10K" : "21K"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSimulateSplit}
                  style={[styles.gradientBtnWrapper, { marginTop: 10 }]}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBtn}
                  >
                    <Radio size={14} color="#FFFFFF" />
                    <Text style={[styles.gradientBtnText, { color: "#FFFFFF" }]}>Kích Hoạt Quét Chip RFID</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Leaderboard */}
              <View style={styles.leaderboardCard}>
                <Text style={styles.bracketTitle}>Bảng Xếp Hạng Finisher (Live Leaderboard)</Text>
                {(leaderboard.length > 0 ? leaderboard : [
                  { rank: 1, runner_name: "Trần Đình Khang", bib_number: "VNE-42-001", chip_time: "02:48:12", distance_km: 42.195 },
                  { rank: 2, runner_name: "Lê Minh Tuấn", bib_number: "VNE-42-005", chip_time: "02:54:30", distance_km: 42.195 },
                  { rank: 3, runner_name: "Nguyễn Hải Đăng", bib_number: "VNE-42-012", chip_time: "03:02:18", distance_km: 42.195 },
                ]).map((item: any, idx: number) => (
                  <View key={idx} style={styles.leaderboardRow}>
                    <View style={styles.rankPill}>
                      <Text style={styles.rankText}>#{item.rank || idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.runnerName}>{item.runner_name}</Text>
                      <Text style={styles.runnerBib}>BIB: {item.bib_number} • {item.distance_km} KM</Text>
                    </View>
                    <Text style={styles.runnerTime}>{item.chip_time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 6: TICKETS */}
          {activeTab === "tickets" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Ví Vé Điện Tử (ViOne Tickets)</Text>

              {/* Cổng Soát Vé Nhân Viên */}
              <View style={styles.rfidCard}>
                <View style={styles.bracketHeader}>
                  <ScanLine size={16} color="#D8B282" />
                  <Text style={styles.bracketTitle}>Cổng Soát Vé Nhanh (Ticket Validator)</Text>
                </View>
                <Text style={styles.bracketSub}>Nhập mã vé hoặc số BIB để xác thực và đổi trạng thái</Text>

                <View style={styles.rfidInputRow}>
                  <TextInput
                    style={styles.bibInput}
                    value={valCode}
                    onChangeText={setValCode}
                    placeholder="Mã vé (TK-HUE-2026-99)"
                    placeholderTextColor="#64748B"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleValidateTicket}
                    disabled={validatingTicket}
                    style={styles.gradientBtnWrapper}
                  >
                    <LinearGradient
                      colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBtnSmall}
                    >
                      <ScanLine size={12} color="#050C15" />
                      <Text style={styles.gradientBtnSmallText}>Soát Vé</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {valResult && (
                  <View style={[styles.matchItem, { marginTop: 6, borderColor: valResult.valid ? "#10B981" : "#EF4444" }]}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: valResult.valid ? "#10B981" : "#EF4444" }}>
                      {valResult.valid ? "VÉ HỢP LỆ — ĐÃ XÁC THỰC SOÁT VÉ" : "CẢNH BÁO: VÉ KHÔNG HỢP LỆ"}
                    </Text>
                    <Text style={{ fontSize: 10, color: "#94A3B8" }}>{valResult.message}</Text>
                  </View>
                )}
              </View>

              {(tickets.length > 0 ? tickets : [
                { id: "tk1", ticket_code: "TK-HUE-2026-99", item_name: "Vé tham quan Quần thể Cố đô Huế", total_amount: 200000, status: "valid" },
                { id: "tk2", ticket_code: "BIB-RUN-42K-001", item_name: "BIB Full Marathon 42.195KM Cố Đô Huế", total_amount: 850000, status: "valid" },
              ]).map((t: any) => (
                <View key={t.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeaderRow}>
                    <Text style={styles.ticketCode}>{t.ticket_code}</Text>
                    <Text style={[styles.ticketStatus, { color: t.status === "used" ? "#EF4444" : "#10B981" }]}>
                      {t.status === "used" ? "Đã soát vé" : "Hợp lệ"}
                    </Text>
                  </View>
                  <Text style={styles.ticketName}>{t.item_name}</Text>
                  <Text style={styles.ticketAmount}>{Number(t.total_amount).toLocaleString("vi-VN")} VNĐ</Text>
                  <View style={styles.ticketQrContainer}>
                    <QRCode value={t.ticket_code} size={80} color="#F6E1C3" backgroundColor="transparent" />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 7: NFC REVIEW */}
          {activeTab === "review" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>ViOne Review — Chạm NFC Đánh Giá 5 Sao</Text>
              {(reviewStores.length > 0 ? reviewStores : [
                { id: "st1", store_name: "Cà Phê Di Sản Cung Đình Huế", store_category: "Ẩm thực & Quán cafe", store_address: "15 Lê Huân, TP Huế", rating: 4.9, total_reviews: 128, reward_voucher: "GIAM20K-HUE" },
                { id: "st2", store_name: "Nhà Hàng Cơm Vua Ngự Yến", store_category: "Nhà hàng truyền thống", store_address: "02 Chu Văn An, TP Huế", rating: 4.8, total_reviews: 96, reward_voucher: "VOUCHER-COM-VUA-10" },
              ]).map((s: any) => (
                <View key={s.id} style={styles.heritageCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardCategory}>{s.store_category}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                      <Star size={12} color="#FBBF24" fill="#FBBF24" />
                      <Text style={{ fontSize: 11, fontWeight: "800", color: "#FBBF24" }}>{s.rating}</Text>
                      <Text style={{ fontSize: 9, color: "#64748B" }}>({s.total_reviews} lượt)</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{s.store_name}</Text>
                  <Text style={styles.cardDesc}><MapPin size={10} color="#D8B282" /> {s.store_address}</Text>
                  <Text style={{ fontSize: 10, color: "#10B981", fontWeight: "700" }}>Tặng voucher ưu đãi: {s.reward_voucher}</Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleSimulateNfcReview(s)}
                    style={[styles.gradientBtnWrapper, { marginTop: 6 }]}
                  >
                    <LinearGradient
                      colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBtn}
                    >
                      <Radio size={14} color="#050C15" />
                      <Text style={styles.gradientBtnText}>Mô Phỏng Chạm Thẻ NFC Đánh Giá</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* TAB 7: ARCHIVE */}
          {activeTab === "archive" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Kho Tư Liệu Số Triều Nguyễn</Text>
              {(archives.length > 0 ? archives : [
                { id: "a1", code: "TL-SP-001", title: "Sắc phong Vua Tự Đức năm thứ 5", category: "Sắc phong", era: "Triều Nguyễn (1852)" },
                { id: "a2", code: "TL-MB-002", title: "Mộc bản Đại Nam Nhất Thống Chí", category: "Mộc bản", era: "Triều Nguyễn" },
              ]).map((a: any) => (
                <View key={a.id} style={styles.archiveCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardCategory}>{a.category}</Text>
                    <Text style={styles.locationText}>{a.era}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{a.title}</Text>
                  <Text style={styles.cardDesc}>Mã tư liệu: {a.code} • Bảo tồn nguyên bản độ phân giải cao</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Citizen Passport Modal */}
      <Modal visible={isCitizenPassOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Award size={18} color="#D8B282" />
                <Text style={styles.modalTitle}>HỘ CHIẾU CÔNG DÂN SỐ</Text>
              </View>
              <TouchableOpacity onPress={() => setCitizenPassOpen(false)}>
                <X size={20} color="#D8B282" />
              </TouchableOpacity>
            </View>

            <View style={styles.passportCard}>
              <Text style={styles.passId}>MÃ ĐỊNH DANH: VN-PASS-2026-8888</Text>
              <Text style={styles.passName}>NGUYỄN VĂN AN</Text>
              <Text style={styles.passRank}>Đại Sứ Di Sản • Finisher Marathon</Text>
              <View style={styles.passQr}>
                <QRCode value="VN-PASS-2026-8888" size={70} color="#F6E1C3" backgroundColor="transparent" />
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.stampsHeader}>Con Dấu Đã Tích Lũy ({stampsCount})</Text>
              <View style={styles.stampItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.stampText}>Cố đô Huế (Đã đóng dấu lưu niệm)</Text>
              </View>
              <View style={styles.stampItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.stampText}>Hoàng thành Thăng Long</Text>
              </View>
              <View style={styles.stampItem}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.stampText}>Phố cổ Hội An</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert("Chia Sẻ", "Đã sao chép liên kết Hộ chiếu công dân số!");
              }}
              style={[styles.gradientBtnWrapper, { marginTop: 20 }]}
            >
              <LinearGradient
                colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                <Share2 size={14} color="#050C15" />
                <Text style={styles.gradientBtnText}>Chia Sẻ Hộ Chiếu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Register BIB Modal */}
      <Modal visible={regBibModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ĐĂNG KÝ SỐ BIB ĐIỆN TỬ</Text>
              <TouchableOpacity onPress={() => setRegBibModalOpen(false)}>
                <X size={20} color="#D8B282" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.inputLabel}>Họ và tên Vận động viên</Text>
              <TextInput
                style={styles.modalInput}
                value={runnerName}
                onChangeText={setRunnerName}
                placeholder="Nhập họ tên"
                placeholderTextColor="#64748B"
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Cự ly đăng ký: {selectedDistance} KM</Text>
              <Text style={styles.modalDesc}>
                Hệ thống sẽ tự động cấp phát số BIB và liên kết chip timing RFID cho bạn.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRegisterBib}
                style={[styles.gradientBtnWrapper, { marginTop: 16 }]}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBtn}
                >
                  <Flame size={14} color="#050C15" />
                  <Text style={styles.gradientBtnText}>Xác Nhận & Cấp BIB</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050C15",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 178, 130, 0.25)",
    backgroundColor: "#050C15",
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#F6E1C3",
    letterSpacing: 0.5,
  },
  badgePill: {
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  badgeText: {
    fontSize: 9,
    color: "#F6E1C3",
    fontWeight: "700",
  },
  headerSub: {
    fontSize: 10,
    color: "#94A3B8",
  },
  passBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  passBtnText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#050C15",
  },
  tabScroll: {
    paddingHorizontal: 12,
    paddingTop: 6,
    gap: 6,
  },
  tabItemWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  tabActiveGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  tabActiveText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#050C15",
  },
  tabInactive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#0B0F17",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  tabInactiveText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "#D8B282",
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 16,
  },
  heroCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
  },
  heroGradient: {
    padding: 16,
    gap: 8,
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#F6E1C3",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  heroDesc: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 16,
  },
  heroActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  gradientBtnWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  gradientBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#050C15",
  },
  gradientBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gradientBtnSmallText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#050C15",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F6E1C3",
    marginTop: 4,
  },
  pillarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pillarCard: {
    width: (width - 42) / 2,
    backgroundColor: "#0B101D",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    padding: 12,
  },
  pillarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  pillarSub: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  heritageCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    padding: 14,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCategory: {
    fontSize: 10,
    color: "#D8B282",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    fontSize: 10,
    color: "#CBD5E1",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardDesc: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 16,
  },
  cardActionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  viewer3dCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    padding: 14,
    gap: 8,
  },
  viewerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  badge3d: {
    fontSize: 9,
    color: "#38BDF8",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "700",
  },
  modelCanvas: {
    height: 140,
    backgroundColor: "#050C15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  modelCanvasText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  modelCanvasSub: {
    fontSize: 10,
    color: "#64748B",
  },
  rotationControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  bracketCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    padding: 14,
    gap: 8,
  },
  bracketHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bracketTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  bracketSub: {
    fontSize: 10,
    color: "#94A3B8",
  },
  matchItem: {
    backgroundColor: "#050C15",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 10,
    gap: 4,
  },
  matchTeamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamName: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  teamScore: {
    fontSize: 12,
    color: "#D8B282",
    fontWeight: "900",
  },
  matchDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  matchStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  matchSetDetail: {
    fontSize: 9,
    color: "#64748B",
  },
  matchCompletedBadge: {
    fontSize: 9,
    color: "#10B981",
    fontWeight: "700",
  },
  raceHeroCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    padding: 14,
    gap: 6,
  },
  raceTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  raceDate: {
    fontSize: 10,
    color: "#94A3B8",
  },
  distancesRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  distanceChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    backgroundColor: "#050C15",
  },
  distanceChipActive: {
    borderColor: "#D8B282",
    backgroundColor: "rgba(216, 178, 130, 0.2)",
  },
  distanceText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "700",
  },
  distanceTextActive: {
    color: "#F6E1C3",
  },
  rfidCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 14,
    gap: 6,
  },
  rfidInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  bibInput: {
    flex: 1,
    backgroundColor: "#050C15",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "#FFFFFF",
    fontSize: 11,
  },
  splitSelector: {
    flexDirection: "row",
    gap: 4,
  },
  splitBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#050C15",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  splitBtnActive: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  splitText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  splitTextActive: {
    color: "#EF4444",
    fontWeight: "700",
  },
  leaderboardCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    padding: 14,
    gap: 8,
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#050C15",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  rankPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(216, 178, 130, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  runnerName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  runnerBib: {
    fontSize: 9,
    color: "#64748B",
  },
  runnerTime: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D8B282",
    fontFamily: "monospace",
  },
  ticketCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    padding: 14,
    gap: 4,
  },
  ticketHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ticketCode: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#D8B282",
    fontWeight: "700",
  },
  ticketStatus: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "700",
  },
  ticketName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  ticketAmount: {
    fontSize: 12,
    color: "#F6E1C3",
    fontWeight: "700",
  },
  ticketQrContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  archiveCard: {
    backgroundColor: "#0A0F1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    padding: 14,
    gap: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#0A0F1A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  passportCard: {
    marginTop: 14,
    backgroundColor: "#050C15",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.5)",
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  passId: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#D8B282",
    fontWeight: "800",
  },
  passName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  passRank: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "700",
  },
  passQr: {
    marginTop: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#0A0F1A",
  },
  stampsHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#F6E1C3",
    marginBottom: 6,
  },
  stampItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  stampText: {
    fontSize: 11,
    color: "#CBD5E1",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  modalInput: {
    backgroundColor: "#050C15",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
  modalDesc: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 6,
    lineHeight: 14,
  },
});
