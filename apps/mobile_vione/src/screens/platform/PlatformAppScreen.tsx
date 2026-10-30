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
  BookOpen,
  Clock,
  Eye,
  Layers,
  Search,
  Users,
  Activity,
  Bell,
} from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { ViOneLogo } from "../../components/ViOneLogo";
import { apiRequest } from "../../api/client";
import { Colors } from "../../theme/colors";

const { width } = Dimensions.get("window");

export type PlatformTab = "overview" | "heritage" | "museum" | "sport" | "run" | "tickets" | "review" | "archive";

export interface MobileArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
  summary: string;
  content: string[];
}

const SHARED_ARTICLES: Record<string, MobileArticle[]> = {
  museum: [
    {
      id: "art-ngoc-lu",
      title: "Giải Mã Hoa Văn Hình Chim Lạc & Mặt Trời 14 Tia Trên Trống Đồng Ngọc Lũ",
      category: "Bảo Vật Quốc Gia",
      author: "GS. Trần Lâm Biền • Viện Di Sản",
      readTime: "5 phút đọc",
      views: "3.420",
      publishedAt: "28/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      summary: "Trống đồng Ngọc Lũ là kiệt tác nghệ thuật đúc đồng Đông Sơn đỉnh cao, chứa đựng tư duy vũ trụ luận và tín ngưỡng phồn thực của người Việt cổ cách đây hơn 2.500 năm.",
      content: [
        "Trống đồng Ngọc Lũ (niên đại thế kỷ III - II TCN) được xếp hạng Bảo vật quốc gia đợt 1 năm 2012. Hoa văn chính giữa mặt trống là hình ngôi sao 14 tia tượng trưng cho mặt trời - nguồn cội của sự sống.",
        "Xen kẽ giữa các tia là họa tiết lông công và lá dừa cách điệu. Vành 6 và vành 8 thể hiện hình ảnh chim Lạc bay ngược chiều kim đồng hồ, biểu tượng cho chu kỳ vận hành của mùa vụ nông nghiệp lúa nước.",
        "Công nghệ 3D Photogrammetry trên ViOne Museum tái hiện từng rãnh đúc siêu nhỏ, giúp người xem xoay 360 độ và phóng to chi tiết với độ phân giải siêu nét.",
        "Khi chạm điện thoại có tính năng NFC vào thẻ chip gắn tại bệ trưng bày bảo tàng, ứng dụng ViOne sẽ tự động kích hoạt bài thuyết minh âm thanh độ nét cao.",
      ],
    },
    {
      id: "art-ngai-vang",
      title: "Nghệ Thuật Chạm Khắc Rồng Vàng Thời Nguyễn Trên Ngai Vàng Điện Thái Hòa",
      category: "Cung Đình Huế",
      author: "TS. Phan Thanh Hải • Trung Tâm Bảo Tồn Di Tích",
      readTime: "4 phút đọc",
      views: "2.890",
      publishedAt: "26/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
      summary: "Biểu tượng quyền lực tối cao của 13 vị vua triều Nguyễn với kỹ thuật thếp vàng độc bản và nghệ thuật chạm khắc gỗ sơn son thếp vàng tinh xảo.",
      content: [
        "Ngai vàng triều Nguyễn đặt tại điện Thái Hòa - Hoàng thành Huế là bảo vật quốc gia duy nhất còn nguyên vẹn trong hệ thống cung đình phong kiến Việt Nam.",
        "Ngai được làm từ gỗ quý, sơn son thếp vàng, chạm khắc tinh xảo hình tượng cửu long chầu nhật nguyệt.",
      ],
    },
  ],
  sport: [
    {
      id: "art-pickleball-tactics",
      title: "Kỹ Thuật Đánh Dinking & Cú Smash Erne Chinh Phục Sân Pickleball Doanh Nhân",
      category: "Pickleball Tips",
      author: "HLV. Lê Hoàng Nam • Kiện tướng Pickleball",
      readTime: "4 phút đọc",
      views: "3.280",
      publishedAt: "28/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      summary: "Bí quyết kiểm soát khu vực Non-Volley Zone (The Kitchen) và kỹ năng di chuyển đồng đội trong các trận thi đấu đôi nam nữ phong trào.",
      content: [
        "Pickleball không chỉ đòi hỏi thể lực mà cốt lõi là sự kiên nhẫn và khả năng đặt bóng tinh tế. Trong khu vực Non-Volley Zone (Kitchen), những cú Dinking chạm bóng mềm mại sát mép lưới sẽ buộc đối thủ rơi vào thế bị động.",
        "Khi đối phương mất kiên nhẫn và nâng bóng bổng sang góc sân, cú nhảy Erne vòng qua vạch Kitchen sẽ tạo điểm số quyết định mà không vi phạm luật dẫm vạch.",
      ],
    },
    {
      id: "art-bracket-system",
      title: "Thuật Toán Phân Nhánh Knockout & Tự Động Bốc Thăm Hạt Giống Chuẩn Quốc Tế",
      category: "Công Nghệ Giải Đấu",
      author: "Ban Công Nghệ ViConnect Sport",
      readTime: "5 phút đọc",
      views: "1.920",
      publishedAt: "26/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
      summary: "Cách thức cây nhánh đấu 2 bảng (Single & Double Elimination) vận hành realtime trên app ViOne mà không cần trọng tài ghi biên bản giấy.",
      content: [
        "ViOne Sport tích hợp thuật toán sinh cây thi đấu Bracket tự động, đảm bảo 2 hạt giống số 1 và số 2 chỉ gặp nhau tại trận Chung kết.",
        "Trọng tài bàn chỉ cần cập nhật tỉ số từng set trên điện thoại, hệ thống lập tức thông báo đẩy đến từng VĐV và khán giả theo dõi.",
      ],
    },
  ],
  run: [
    {
      id: "art-marathon-pacing",
      title: "Chiến Thuật Phân Phối Thể Lực Sub-3:30 Trong Cung Đường Di Sản Huế Marathon",
      category: "Cẩm Nang Marathon",
      author: "HLV. Nguyễn Quốc Anh • Chuyên gia Điền kinh",
      readTime: "6 phút đọc",
      views: "4.150",
      publishedAt: "28/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80",
      summary: "Kế hoạch dinh dưỡng, kiểm soát nhịp tim Zone 3 và kỹ thuật vượt dốc cầu Trường Tiền để đạt kỷ lục cá nhân PR.",
      content: [
        "Cung đường di sản ViOne Heritage Marathon đi qua các địa danh lịch sử như Đại Nội, chùa Thiên Mụ và đồi Vọng Cảnh có độ dốc biến thiên nhẹ nhưng gió sông Hương có thể ảnh hưởng đến nhịp thở.",
        "Chiến thuật tối ưu là chạy Negative Split (nửa sau nhanh hơn nửa đầu 1-2 phút). Từ km 0 đến km 21, runner nên giữ nhịp tim ở vùng Zone 3, nạp gel năng lượng mỗi 45 phút.",
      ],
    },
    {
      id: "art-rfid-timing",
      title: "Hệ Thống Thảm Chip RFID Đa Tần Số & Thuật Toán Ghi Nhận BIB Tốc Độ Cao",
      category: "Công Nghệ Thể Thao",
      author: "Ban Công Nghệ ViConnect Platform",
      readTime: "5 phút đọc",
      views: "1.740",
      publishedAt: "25/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
      summary: "Nguyên lý hoạt động của chip UHF RFID gắn mặt sau số BIB và cơ chế chống nhiễu khi hàng ngàn VĐV cùng qua vạch xuất phát.",
      content: [
        "Để đảm bảo tính công bằng và chính xác đến 1/1000 giây, ViOne Run tích hợp chip UHF tần số 860-960 MHz gắn trực tiếp trên số BIB của từng vận động viên.",
        "Khi qua thảm thu phát sóng tại vạch Start, Split 10K, 21K và Finish, tín hiệu mã hóa được gửi realtime về server trung tâm, tự động phân tích checkpoint và cập nhật bảng xếp hạng.",
      ],
    },
  ],
  heritage: [
    {
      id: "art-hue-unesco",
      title: "Kiến Trúc Thành Quách & Phong Thủy Triều Nguyễn Tại Cố Đô Huế",
      category: "Di Sản UNESCO",
      author: "PGS.TS. Đặng Văn Bài • Hội Di Sản Văn Hóa",
      readTime: "5 phút đọc",
      views: "3.780",
      publishedAt: "28/10/2026",
      thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
      summary: "Sự kết hợp hoàn hảo giữa nguyên lý phong thủy Đông phương và nghệ thuật kiến trúc thành lũy Vauban phương Tây thế kỷ XIX.",
      content: [
        "Quần thể di tích Cố đô Huế được UNESCO vinh danh là Di sản Văn hóa Thế giới đầu tiên của Việt Nam năm 1993. Quy hoạch kinh thành dựa trên thuyết Ngũ hành và thuật phong thủy.",
        "Ứng dụng công nghệ quét 3D VR360 trên ViOne Heritage cho phép du khách khám phá chiều sâu các công trình lăng tẩm và cung điện từ xa.",
      ],
    },
  ],
};

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

  // Selected article for reader modal
  const [selectedArticle, setSelectedArticle] = useState<MobileArticle | null>(null);

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
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
      {/* Platform Header - CHỈ LOGO VIONE VÀ ICON THÔNG BÁO THEO YÊU CẦU */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <X size={20} color="#334155" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <ViOneLogo width={74} height={28} />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert("Thông Báo", "Bạn có 3 thông báo mới từ hệ thống ViOne")}
            style={styles.notifBtn}
          >
            <Bell size={20} color="#334155" />
            <View style={styles.notifDot} />
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
              {/* Lối Tắt Tính Năng Nhanh */}
              <View style={styles.quickGridCard}>
                <View style={styles.quickGridHeader}>
                  <Sparkles size={14} color="#D8B282" />
                  <Text style={styles.quickGridTitle}>Tính Năng Nhanh Di Sản</Text>
                </View>
                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    onPress={() => Alert.alert("VR360", "Đang mở không gian thực tế ảo Cố Đô...")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconGold}>
                      <Compass size={16} color="#050C15" />
                    </View>
                    <Text style={styles.quickActionText}>Tour VR360</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Audio GPS", "Đang phát thuyết minh GPS tự động...")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Volume2 size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Audio GPS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCitizenPassOpen(true)}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Award size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Đóng Dấu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Bản Đồ", "Mở bản đồ số hóa di tích toàn quốc.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <MapPin size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Bản Đồ</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Danh sách Di tích */}
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

              {/* Chuyên mục bài viết Di Sản */}
              <Text style={styles.sectionHeader}>Bài Viết & Nghiên Cứu Di Sản</Text>
              {SHARED_ARTICLES.heritage.map((art) => (
                <TouchableOpacity
                  key={art.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedArticle(art)}
                  style={styles.articleCard}
                >
                  <Image source={{ uri: art.thumbnail }} style={styles.articleThumb} />
                  <View style={styles.articleInfo}>
                    <View style={styles.articleTagRow}>
                      <Text style={styles.articleTag}>{art.category}</Text>
                      <Text style={styles.articleReadTime}>{art.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>{art.title}</Text>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleAuthor} numberOfLines={1}>{art.author}</Text>
                      <Text style={styles.articleViews}>{art.views} xem</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TAB 3: MUSEUM */}
          {activeTab === "museum" && (
            <View style={styles.tabContent}>
              {/* Lối Tắt Tính Năng Nhanh */}
              <View style={styles.quickGridCard}>
                <View style={styles.quickGridHeader}>
                  <Sparkles size={14} color="#D8B282" />
                  <Text style={styles.quickGridTitle}>Tính Năng Nhanh Bảo Tàng Số</Text>
                </View>
                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    onPress={() => Alert.alert("NFC Cổ Vật", "Đã nhận diện thẻ NFC bảo vật! Đang tải thuyết minh chi tiết.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconGold}>
                      <Radio size={16} color="#050C15" />
                    </View>
                    <Text style={styles.quickActionText}>Chạm NFC</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setArtifactRotation((r) => (r + 45) % 360)}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <RotateCcw size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Xoay 3D</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Audio Guide", "Đang phát thuyết minh âm thanh bảo vật...")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Volume2 size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Audio Guide</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Đặt Vé VNPay", "Mở cổng thanh toán VNPay đặt vé bảo tàng.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Ticket size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Vé VNPay</Text>
                  </TouchableOpacity>
                </View>
              </View>

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

              {/* Chuyên mục bài viết Bảo Tàng */}
              <Text style={styles.sectionHeader}>Bài Viết & Chuyên Đề Cổ Vật Hoàng Gia</Text>
              {SHARED_ARTICLES.museum.map((art) => (
                <TouchableOpacity
                  key={art.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedArticle(art)}
                  style={styles.articleCard}
                >
                  <Image source={{ uri: art.thumbnail }} style={styles.articleThumb} />
                  <View style={styles.articleInfo}>
                    <View style={styles.articleTagRow}>
                      <Text style={styles.articleTag}>{art.category}</Text>
                      <Text style={styles.articleReadTime}>{art.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>{art.title}</Text>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleAuthor} numberOfLines={1}>{art.author}</Text>
                      <Text style={styles.articleViews}>{art.views} xem</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TAB 4: SPORT */}
          {activeTab === "sport" && (
            <View style={styles.tabContent}>
              {/* Lối Tắt Tính Năng Nhanh */}
              <View style={styles.quickGridCard}>
                <View style={styles.quickGridHeader}>
                  <Sparkles size={14} color="#D8B282" />
                  <Text style={styles.quickGridTitle}>Tính Năng Nhanh Thể Thao</Text>
                </View>
                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Đăng Ký", "Mở biểu mẫu đăng ký giải Pickleball Doanh Nhân.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconGold}>
                      <Trophy size={16} color="#050C15" />
                    </View>
                    <Text style={styles.quickActionText}>Đăng Ký</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Nhánh Đấu", "Cập nhật cây thi đấu Knockout Bracket.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Activity size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Nhánh Đấu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Tỉ Số Live", "Đang cập nhật tỉ số các trận đấu trực tiếp...")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Flame size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Tỉ Số Live</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Mạng Lưới CLB", "Xem danh bạ các CLB thể thao doanh nhân liên kết.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Users size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>CLB Thể Thao</Text>
                  </TouchableOpacity>
                </View>
              </View>

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

              {/* Chuyên mục bài viết Thể Thao */}
              <Text style={styles.sectionHeader}>Bài Viết & Cẩm Nang Thể Thao Đa Môn</Text>
              {SHARED_ARTICLES.sport.map((art) => (
                <TouchableOpacity
                  key={art.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedArticle(art)}
                  style={styles.articleCard}
                >
                  <Image source={{ uri: art.thumbnail }} style={styles.articleThumb} />
                  <View style={styles.articleInfo}>
                    <View style={styles.articleTagRow}>
                      <Text style={styles.articleTag}>{art.category}</Text>
                      <Text style={styles.articleReadTime}>{art.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>{art.title}</Text>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleAuthor} numberOfLines={1}>{art.author}</Text>
                      <Text style={styles.articleViews}>{art.views} xem</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TAB 5: RUN */}
          {activeTab === "run" && (
            <View style={styles.tabContent}>
              {/* Lối Tắt Tính Năng Nhanh */}
              <View style={styles.quickGridCard}>
                <View style={styles.quickGridHeader}>
                  <Sparkles size={14} color="#D8B282" />
                  <Text style={styles.quickGridTitle}>Tính Năng Nhanh Giải Chạy & RFID</Text>
                </View>
                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    onPress={() => setRegBibModalOpen(true)}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconGold}>
                      <Flame size={16} color="#050C15" />
                    </View>
                    <Text style={styles.quickActionText}>Đăng Ký BIB</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSimulateSplit}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Radio size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Quét RFID</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Leaderboard", "Xem bảng thành tích xếp hạng Finisher.")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Trophy size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Xếp Hạng</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Chứng Nhận", "Đang tạo chứng nhận Finisher điện tử dạng PDF...")}
                    style={styles.quickActionItem}
                  >
                    <View style={styles.quickIconBorder}>
                      <Award size={16} color="#D8B282" />
                    </View>
                    <Text style={styles.quickActionText}>Chứng Nhận</Text>
                  </TouchableOpacity>
                </View>
              </View>

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

              {/* Chuyên mục bài viết Chạy bộ */}
              <Text style={styles.sectionHeader}>Bài Viết & Cẩm Nang Marathon</Text>
              {SHARED_ARTICLES.run.map((art) => (
                <TouchableOpacity
                  key={art.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedArticle(art)}
                  style={styles.articleCard}
                >
                  <Image source={{ uri: art.thumbnail }} style={styles.articleThumb} />
                  <View style={styles.articleInfo}>
                    <View style={styles.articleTagRow}>
                      <Text style={styles.articleTag}>{art.category}</Text>
                      <Text style={styles.articleReadTime}>{art.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>{art.title}</Text>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleAuthor} numberOfLines={1}>{art.author}</Text>
                      <Text style={styles.articleViews}>{art.views} xem</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TAB 6: TICKETS */}
          {activeTab === "tickets" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Soát Vé Điện Tử Tại Cổng (Validator)</Text>
              
              <View style={styles.validatorBox}>
                <TextInput
                  style={styles.valInput}
                  value={valCode}
                  onChangeText={setValCode}
                  placeholder="Nhập mã vé hoặc quét QR..."
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
                    style={styles.gradientBtn}
                  >
                    <ScanLine size={14} color="#050C15" />
                    <Text style={styles.gradientBtnText}>
                      {validatingTicket ? "Đang Kiểm Tra..." : "Xác Thực Vé"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionHeader, { marginTop: 12 }]}>Danh Sách Vé Của Tôi</Text>

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

          {/* TAB 8: ARCHIVE */}
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

      {/* MODAL ĐỌC BÀI VIẾT CHI TIẾT */}
      {selectedArticle && (
        <Modal visible={!!selectedArticle} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.articleModalCategory}>{selectedArticle.category}</Text>
                  <Text style={styles.articleModalTitle}>{selectedArticle.title}</Text>
                  <Text style={styles.articleModalMeta}>
                    {selectedArticle.author} • {selectedArticle.publishedAt} • {selectedArticle.readTime}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeBtn}>
                  <X size={18} color="#D8B282" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedArticle.thumbnail }} style={styles.articleModalImage} />
                <View style={styles.articleModalSummaryBox}>
                  <Text style={styles.articleModalSummary}>"{selectedArticle.summary}"</Text>
                </View>
                <View style={styles.articleModalBody}>
                  {selectedArticle.content.map((p, idx) => (
                    <Text key={idx} style={styles.articleModalParagraph}>{p}</Text>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.articleModalFooter}>
                <Text style={styles.articleModalViews}>{selectedArticle.views} lượt đọc</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => Alert.alert("Chia Sẻ", "Đã sao chép liên kết bài viết!")}
                  style={styles.gradientBtnWrapper}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    style={styles.gradientBtnSmall}
                  >
                    <Share2 size={12} color="#050C15" />
                    <Text style={styles.gradientBtnSmallText}>Chia Sẻ</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

            <View style={{ gap: 12, marginTop: 12 }}>
              <View>
                <Text style={styles.inputLabel}>Họ và tên VĐV:</Text>
                <TextInput
                  style={styles.input}
                  value={runnerName}
                  onChangeText={setRunnerName}
                  placeholderTextColor="#64748B"
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>Cự ly đăng ký:</Text>
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
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRegisterBib}
                style={[styles.gradientBtnWrapper, { marginTop: 8 }]}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBtn}
                >
                  <Flame size={14} color="#050C15" />
                  <Text style={styles.gradientBtnText}>Xác Nhận Đăng Ký BIB</Text>
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
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
  notifBtn: {
    position: "relative",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
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
    gap: 14,
  },
  quickGridCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  quickGridHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  quickGridTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    width: (width - 64) / 4,
  },
  quickIconGold: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  quickIconBorder: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F6E1C3",
    textAlign: "center",
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
    fontSize: 13,
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
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 6,
  },
  pillarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  pillarSub: {
    fontSize: 10,
    color: "#94A3B8",
    lineHeight: 14,
  },
  heritageCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCategory: {
    fontSize: 9,
    fontWeight: "700",
    color: "#D8B282",
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
    color: "#F6E1C3",
  },
  cardDesc: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 16,
  },
  cardActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  viewer3dCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    gap: 12,
  },
  viewerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
    flex: 1,
  },
  badge3d: {
    fontSize: 9,
    fontWeight: "800",
    color: "#050C15",
    backgroundColor: "#D8B282",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modelCanvas: {
    height: 140,
    backgroundColor: "#121620",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  modelCanvasText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  modelCanvasSub: {
    fontSize: 10,
    color: "#94A3B8",
  },
  rotationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  bracketCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    gap: 10,
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
    backgroundColor: "#121620",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    gap: 6,
  },
  matchTeamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E2E8F0",
  },
  teamScore: {
    fontSize: 13,
    fontWeight: "900",
    color: "#D8B282",
  },
  matchDivider: {
    height: 1,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
  },
  matchStatusRow: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    gap: 8,
  },
  raceTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  raceDate: {
    fontSize: 10,
    color: "#94A3B8",
  },
  distancesRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  distanceChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#121620",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  distanceChipActive: {
    backgroundColor: "#D8B282",
    borderColor: "#D8B282",
  },
  distanceText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#CBD5E1",
  },
  distanceTextActive: {
    color: "#050C15",
  },
  rfidCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    gap: 10,
  },
  rfidInputRow: {
    gap: 8,
  },
  bibInput: {
    backgroundColor: "#121620",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: "#F6E1C3",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  splitSelector: {
    flexDirection: "row",
    gap: 6,
  },
  splitBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#121620",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  splitBtnActive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#EF4444",
  },
  splitText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  splitTextActive: {
    color: "#F87171",
  },
  leaderboardCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 8,
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 178, 130, 0.1)",
  },
  rankPill: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#121620",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#D8B282",
  },
  runnerName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F6E1C3",
  },
  runnerBib: {
    fontSize: 10,
    color: "#94A3B8",
  },
  runnerTime: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FBBF24",
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: "#0B0F17",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    gap: 10,
  },
  articleThumb: {
    width: 80,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#121620",
  },
  articleInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  articleTagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  articleTag: {
    fontSize: 9,
    fontWeight: "700",
    color: "#D8B282",
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  articleReadTime: {
    fontSize: 9,
    color: "#64748B",
  },
  articleTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F6E1C3",
    lineHeight: 16,
  },
  articleMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  articleAuthor: {
    fontSize: 9,
    color: "#94A3B8",
    flex: 1,
  },
  articleViews: {
    fontSize: 9,
    color: "#64748B",
  },
  validatorBox: {
    backgroundColor: "#0B0F17",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 8,
  },
  valInput: {
    backgroundColor: "#121620",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: "#F6E1C3",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  ticketCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 8,
  },
  ticketHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketCode: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D8B282",
  },
  ticketStatus: {
    fontSize: 10,
    fontWeight: "700",
  },
  ticketName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#F6E1C3",
  },
  ticketAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#CBD5E1",
  },
  ticketQrContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  archiveCard: {
    backgroundColor: "#0B0F17",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
    gap: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0B0F17",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#121620",
  },
  articleModalCategory: {
    fontSize: 9,
    fontWeight: "800",
    color: "#D8B282",
    textTransform: "uppercase",
  },
  articleModalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#F6E1C3",
    marginTop: 2,
    lineHeight: 18,
  },
  articleModalMeta: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  articleModalImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  articleModalSummaryBox: {
    backgroundColor: "#121620",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
    marginBottom: 10,
  },
  articleModalSummary: {
    fontSize: 11,
    color: "#F6E1C3",
    fontStyle: "italic",
    lineHeight: 16,
  },
  articleModalBody: {
    gap: 8,
  },
  articleModalParagraph: {
    fontSize: 11,
    color: "#CBD5E1",
    lineHeight: 16,
  },
  articleModalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(216, 178, 130, 0.15)",
    paddingTop: 10,
  },
  articleModalViews: {
    fontSize: 10,
    color: "#64748B",
  },
  passportCard: {
    backgroundColor: "#121620",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    alignItems: "center",
    gap: 6,
  },
  passId: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "700",
  },
  passName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  passRank: {
    fontSize: 11,
    color: "#D8B282",
  },
  passQr: {
    marginTop: 8,
  },
  stampsHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#F6E1C3",
    marginBottom: 8,
  },
  stampItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  stampText: {
    fontSize: 11,
    color: "#E2E8F0",
  },
  inputLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#121620",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: "#F6E1C3",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
});
