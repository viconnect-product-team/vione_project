import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Check,
  X,
  Phone,
  Mail,
  Sparkles,
  Building2,
  MessageSquare,
  Users,
  Plus,
  ArrowRight,
  Shield,
  Bell,
  UserPlus,
  Briefcase,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Sun,
  Moon,
  Calendar,
  Heart,
  Share2,
  Camera,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { Avatar } from "../../components/common/Avatar";
import { ConnectionPerson, DmThreadSummary } from "../../types";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { StickyBrandHeader } from "../../components/common/StickyBrandHeader";
import { ChatThreadModal } from "./ChatThreadModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { StoryViewerModal, StoryItemData } from "../../components/StoryViewerModal";
import { CreateStoryModal } from "../../components/CreateStoryModal";
import { CustomerDetailModal } from "../../components/CustomerDetailModal";
import { CreateCustomerModal, NewCustomerData } from "../../components/CreateCustomerModal";
import { ScheduleMeetingModal } from "../../components/ScheduleMeetingModal";
import { PostMomentModal } from "../../components/PostMomentModal";
import { MomentCommentModal } from "../../components/MomentCommentModal";
import { BusinessNotificationsModal } from "../../components/BusinessNotificationsModal";
import { ViOneVoiceAssistantModal } from "../../components/ai/ViOneVoiceAssistantModal";
import { MemberCardBottomSheet, MemberCardData } from "../../components/MemberCardBottomSheet";
import { resolveMediaUrl } from "../../utils/media";
import { ContactsDiscoveryModal } from "../../components/ContactsDiscoveryModal";
import { EmptyState } from "../../components/common/EmptyState";
import { networkApi, customerApi, momentApi } from "../../api/services";

// Dữ liệu khoảnh khắc 24h doanh nhân (mặc định trống, chỉ hiện tin của chính mình hoặc đối tác đã kết nối)
const INITIAL_STORIES: StoryItemData[] = [];

// Danh sách đối tác cần giữ kết nối & chăm sóc (mặc định trống, tải từ API)
const NURTURE_PARTNERS: any[] = [];

// Danh bạ đối tác doanh nghiệp thực tế (mặc định trống, tải từ API)
const INITIAL_PARTNERS: ConnectionPerson[] = [];

// Khách hàng B2B pipeline (mặc định trống, tải từ API)
const B2B_CUSTOMERS: any[] = [];

// Danh sách hội thoại tin nhắn (mặc định trống, tải từ API)
const INITIAL_THREADS: DmThreadSummary[] = [];

function formatDmMessagePreview(raw?: string | null): string {
  if (!raw) return "Chưa có tin nhắn";
  const text = raw.trim();
  if (/\[action:payment/i.test(text)) return "💳 [Giao dịch] Thông báo thanh toán";
  if (/\[action:ticket/i.test(text)) {
    const titleMatch = text.match(/eventTitle:([^|\]]+)/i);
    let eventTitle = "";
    if (titleMatch) {
      try { eventTitle = decodeURIComponent(titleMatch[1]); } catch { eventTitle = titleMatch[1]; }
    }
    return `🎟️ [Vé điện tử] ${eventTitle ? eventTitle + " · " : ""}Mã QR Check-in VIP`;
  }
  if (/\[action:meeting/i.test(text)) {
    const titleMatch = text.match(/title:([^|\]]+)/i);
    let meetingTitle = "";
    if (titleMatch) {
      try { meetingTitle = decodeURIComponent(titleMatch[1]); } catch { meetingTitle = titleMatch[1]; }
    }
    return `📅 [Cuộc họp] ${meetingTitle ? meetingTitle + " · " : ""}Thư mời tham dự`;
  }
  if (/^\[action:([^|\]]+)/i.test(text)) return "🔔 [Thông báo hệ thống]";
  if (/\[image:/i.test(text) || /\.(jpeg|jpg|png|webp|gif)(\?.*)?$/i.test(text)) return "📷 [Hình ảnh]";
  if (/\[file:/i.test(text)) return "📎 [Tệp đính kèm]";
  if (/\[voice:/i.test(text)) return "🎙️ [Tin nhắn thoại]";
  if (/\[call:/i.test(text)) return "📞 [Cuộc gọi]";
  return text;
}


type NetworkTab = "network" | "customers" | "suggestions" | "messages" | "requests";
type MessageCategory = "all" | "unread" | "groups" | "requests";

export const NetworkScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<NetworkTab>("network");

  // Partners state
  const [partners, setPartners] = useState<ConnectionPerson[]>(INITIAL_PARTNERS);
  const [filterPartnerKind, setFilterPartnerKind] = useState<"all" | "connected" | "pending" | "suggested">("all");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");

  // Messaging state
  const [threads, setThreads] = useState<DmThreadSummary[]>(INITIAL_THREADS);
  const [activeMessageCategory, setActiveMessageCategory] = useState<MessageCategory>("all");
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);

  // Modals
  const [selectedThread, setSelectedThread] = useState<DmThreadSummary | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  // Stories & Nurture state (Khớp 100% NetworkStoriesStrip & Nurture List)
  const [stories, setStories] = useState<StoryItemData[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryItemData | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [createStoryVisible, setCreateStoryVisible] = useState(false);
  const [nurtureList, setNurtureList] = useState(NURTURE_PARTNERS);

  // Parity Modals (Customer Detail, Meeting Scheduler, Moments & Comments)
  const [customersList, setCustomersList] = useState(B2B_CUSTOMERS);
  const [customerStageFilter, setCustomerStageFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDetailVisible, setCustomerDetailVisible] = useState(false);
  const [createCustomerVisible, setCreateCustomerVisible] = useState(false);
  const [selectedPartnerForMeeting, setSelectedPartnerForMeeting] = useState<{ name: string; company: string } | null>(null);
  const [scheduleMeetingVisible, setScheduleMeetingVisible] = useState(false);
  const [postMomentVisible, setPostMomentVisible] = useState(false);
  const [selectedMomentForComment, setSelectedMomentForComment] = useState<any | null>(null);
  const [momentCommentVisible, setMomentCommentVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);

  // B2B Social Moments Feed state (Tách biệt hoàn toàn khỏi 24h stories, tải từ API)
  const [momentsFeed, setMomentsFeed] = useState<any[]>([]);

  // Danh sách lời mời kết nối đang chờ duyệt (tải từ API)
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);

  // Partner Profile Modal (Xem danh thiếp khi bấm vào avatar người chat)
  const [partnerProfileModalVisible, setPartnerProfileModalVisible] = useState(false);
  const [selectedMemberCard, setSelectedMemberCard] = useState<MemberCardData | null>(null);

  // Danh bạ điện thoại tìm bạn bè (như Zalo)
  const [contactsDiscoveryVisible, setContactsDiscoveryVisible] = useState(false);
  const [contactsBannerDismissed, setContactsBannerDismissed] = useState(false);

  const handleOpenPartnerProfile = (item: DmThreadSummary | ConnectionPerson) => {
    const cardData: MemberCardData = {
      id: (item as any).id || (item as any).counterpartUserId || (item as any).threadId,
      name: (item as any).name || (item as any).displayName || "Doanh nhân đối tác",
      title: (item as any).title || (item as any).headline || "Hội viên ViOne Connect",
      company: (item as any).company || (item as any).companyName || "Đối tác kinh doanh",
      phone: (item as any).phone || "0988 888 888",
      email: (item as any).email || "contact@vione.vn",
      avatarUrl: (item as any).avatarUrl,
      website: "https://vione.vn",
    };
    setSelectedMemberCard(cardData);
    setPartnerProfileModalVisible(true);
  };

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng,";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều,";
    return "Chào buổi tối,";
  };

  // Tải danh sách cuộc trò chuyện, đối tác kết nối, khách hàng B2B, gợi ý và khoảnh khắc từ API
  useEffect(() => {
    let isMounted = true;
    const fetchNetworkData = async () => {
      try {
        setIsLoadingThreads(true);
        const [threadsRes, connsRes, recsRes, customersRes, requestsRes, savedCardsRes, momentsRes] = await Promise.allSettled([
          apiRequest<{ ok?: boolean; threads?: DmThreadSummary[] }>("connect-app/dm/threads"),
          networkApi.getConnections(),
          networkApi.getTodayRecommendations(),
          customerApi.getCustomers(),
          apiRequest<any[]>("connect-app/network/requests/incoming"),
          networkApi.getSavedCards(),
          momentApi.getMoments(),
        ]);
        if (!isMounted) return;

        // 1. Threads
        if (threadsRes.status === "fulfilled" && threadsRes.value?.data?.threads && Array.isArray(threadsRes.value.data.threads)) {
          setThreads(threadsRes.value.data.threads);
        }

        // 2. Partners & Saved Cards
        const partnersList: ConnectionPerson[] = [];
        if (connsRes.status === "fulfilled" && connsRes.value?.data) {
          const rawConns = Array.isArray(connsRes.value.data)
            ? connsRes.value.data
            : (connsRes.value.data as any)?.connections || [];
          rawConns.forEach((c: any) => {
            partnersList.push({
              id: c.counterpartUserId || c.id,
              name: c.fullName || c.name || "Doanh nhân đối tác",
              title: c.professionalTitle || c.title || "Hội viên ViOne Connect",
              company: c.companyName || c.company || "ViOne Network",
              avatarUrl: c.avatarUrl,
              phone: c.phone || "",
              email: c.email || "",
              industry: c.industry || "Doanh nghiệp",
              status: (c.status as any) || "connected",
              matchScore: c.matchScore || 95,
            });
          });
        }
        if (savedCardsRes.status === "fulfilled" && savedCardsRes.value?.data && Array.isArray(savedCardsRes.value.data)) {
          savedCardsRes.value.data.forEach((sc: any) => {
            const cardId = sc.targetUserId || sc.id;
            if (!partnersList.some((p) => p.id === cardId)) {
              partnersList.push({
                id: cardId,
                name: sc.targetName || sc.name || "Doanh nhân danh thiếp",
                title: sc.targetTitle || sc.title || "Hội viên ViOne",
                company: sc.targetCompany || sc.company || "Đối tác kinh doanh",
                avatarUrl: sc.targetAvatar || sc.avatarUrl,
                phone: sc.phone || "",
                email: sc.email || "",
                industry: sc.industry || "Doanh nghiệp",
                status: "connected",
                matchScore: 92,
              });
            }
          });
        }
        setPartners(partnersList);

        // 3. Nurture / Recommendations
        if (recsRes.status === "fulfilled" && recsRes.value?.data && Array.isArray(recsRes.value.data)) {
          const mappedNurture = recsRes.value.data.map((r: any) => ({
            id: r.id || r.targetUserId,
            name: r.name || r.fullName || "Đối tác tiềm năng",
            title: r.title || r.role || "Lãnh đạo doanh nghiệp",
            role: r.role || `${r.title || "CEO"} · ${r.company || "ViOne Network"}`,
            tag: r.tag || "CẦN GẶP LẠI",
            reason: r.reason || "Cần giữ liên lạc định kỳ để mở rộng giao thương B2B.",
            avatar: r.avatar || r.avatarUrl,
            company: r.company || "ViOne Network",
            phone: r.phone || "",
          }));
          setNurtureList(mappedNurture);
        } else {
          setNurtureList([]);
        }

        // 4. B2B Customers
        if (customersRes.status === "fulfilled" && customersRes.value?.data && Array.isArray(customersRes.value.data)) {
          const mappedCusts = customersRes.value.data.map((cust: any) => ({
            id: cust.id || `cust-${Date.now()}`,
            name: cust.name || cust.company || "Doanh nghiệp",
            contactPerson: cust.contactPerson || cust.name || "Người đại diện",
            role: cust.role || "Đại diện kinh doanh",
            stage: cust.stage || "Đàm phán",
            dealValue: cust.dealValue ? `${cust.dealValue} đ` : "Chưa định giá",
            priority: cust.priority || "Tiềm năng",
            lastContact: cust.lastContact || "Gần đây",
            phone: cust.phone || "",
            email: cust.email || "",
            tags: cust.tags || [],
          }));
          setCustomersList(mappedCusts);
        } else {
          setCustomersList([]);
        }

        // 5. Incoming requests
        if (requestsRes.status === "fulfilled" && requestsRes.value?.data && Array.isArray(requestsRes.value.data)) {
          setConnectionRequests(requestsRes.value.data);
        } else {
          setConnectionRequests([]);
        }

        // 6. Moments Feed
        if (momentsRes.status === "fulfilled" && momentsRes.value?.data && Array.isArray(momentsRes.value.data)) {
          setMomentsFeed(momentsRes.value.data);
        }
      } catch (err) {
        console.warn("Lỗi tải dữ liệu network:", err);
      } finally {
        if (isMounted) setIsLoadingThreads(false);
      }
    };

    fetchNetworkData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Khôi phục bài đăng khoảnh khắc và stories cá nhân đã đăng từ AsyncStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedMoments = await AsyncStorage.getItem("vione_saved_moments_feed");
        if (savedMoments) {
          const parsed = JSON.parse(savedMoments);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMomentsFeed((prev) => {
              const combined = [...parsed];
              prev.forEach((item) => {
                if (!combined.some((c) => c.id === item.id)) {
                  combined.push(item);
                }
              });
              return combined;
            });
          }
        }

        const savedStories = await AsyncStorage.getItem("vione_user_stories_24h");
        if (savedStories) {
          const parsed = JSON.parse(savedStories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStories((prev) => {
              const combined = [...parsed];
              prev.forEach((item) => {
                if (!combined.some((c) => c.id === item.id)) {
                  combined.push(item);
                }
              });
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn("Lỗi tải cache moments/stories:", err);
      }
    };
    loadSavedData();
  }, []);

  // Lọc đối tác
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      if (filterPartnerKind !== "all" && p.status !== filterPartnerKind) return false;

      const q = partnerSearchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.company?.toLowerCase().includes(q) ||
        p.industry?.toLowerCase().includes(q)
      );
    });
  }, [partners, filterPartnerKind, partnerSearchQuery]);

  // Khoảnh khắc 24h chỉ hiển thị cho chính mình hoặc những người đã kết nối
  const displayStories = useMemo(() => {
    return stories.filter((s) => {
      if (s.authorName === user?.displayName || s.id.startsWith("story-my-") || s.id.startsWith("story-custom-")) return true;
      const isConnected = partners.some(
        (p) => p.status === "connected" && (p.name === s.authorName || p.id === s.id)
      );
      return isConnected;
    });
  }, [stories, partners, user?.displayName]);

  // Phân loại danh mục Hộp thư
  const allThreads = useMemo(() => {
    return threads.filter((t) => {
      if (t.isGroup) return true;
      if (t.lastMessageFromMe) return true;
      if (Boolean(t.lastMessagePreview)) return true;
      if (t.isConnected !== false) return true;
      return false;
    });
  }, [threads]);

  const unreadThreads = useMemo(() => {
    return allThreads.filter((t) => (t.unreadCount || 0) > 0);
  }, [allThreads]);

  const groupThreads = useMemo(() => {
    return threads.filter((t) => t.isGroup);
  }, [threads]);

  const pendingThreads = useMemo(() => {
    return threads.filter(
      (t) => t.isConnected === false && !t.lastMessageFromMe && Boolean(t.lastMessagePreview)
    );
  }, [threads]);

  const totalUnreadCount = useMemo(() => {
    return unreadThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);
  }, [unreadThreads]);

  // Lọc danh sách hội thoại theo category & search (Tin nhắn mới luôn nhảy lên đầu)
  const filteredThreads = useMemo(() => {
    let baseList = allThreads;
    if (activeMessageCategory === "unread") baseList = unreadThreads;
    if (activeMessageCategory === "groups") baseList = groupThreads;
    if (activeMessageCategory === "requests") baseList = pendingThreads;

    const q = messageSearchQuery.trim().toLowerCase();
    const list = !q
      ? baseList
      : baseList.filter((t) => {
          const name = (t.displayName || "").toLowerCase();
          const company = (t.companyName || "").toLowerCase();
          const msg = (t.lastMessagePreview || "").toLowerCase();
          return name.includes(q) || company.includes(q) || msg.includes(q);
        });

    // Luôn ưu tiên đưa cuộc hội thoại có tin nhắn mới nhất lên đầu tiên
    return [...list].sort((a, b) => {
      const timeA = new Date(a.lastMessageAt || 0).getTime();
      const timeB = new Date(b.lastMessageAt || 0).getTime();
      return timeB - timeA;
    });
  }, [activeMessageCategory, allThreads, unreadThreads, groupThreads, pendingThreads, messageSearchQuery]);

  const handleOpenChatWithPartner = async (partner: ConnectionPerson) => {
    const existing = threads.find((t) => t.counterpartUserId === partner.id);
    if (existing && !existing.threadId.startsWith("th-")) {
      setSelectedThread(existing);
      setChatModalVisible(true);
      return;
    }

    try {
      const res = await apiRequest<{ ok?: boolean; threadId?: string }>("connect-app/dm/threads", {
        method: "POST",
        data: { counterpartUserId: partner.id, personId: partner.id },
      });

      const realThreadId = res.data?.threadId;
      if (realThreadId) {
        const newThread: DmThreadSummary = {
          threadId: realThreadId,
          counterpartUserId: partner.id,
          displayName: partner.name,
          companyName: partner.company,
          avatarUrl: partner.avatarUrl,
          lastMessagePreview: existing?.lastMessagePreview || "Bắt đầu cuộc trò chuyện kinh doanh mới",
          lastMessageAt: existing?.lastMessageAt || new Date().toISOString(),
          lastMessageFromMe: existing?.lastMessageFromMe ?? true,
          unreadCount: 0,
          isConnected: partner.status === "connected",
          isOnline: true,
        };
        setThreads((prev) => [newThread, ...prev.filter((t) => t.threadId !== realThreadId && t.counterpartUserId !== partner.id)]);
        setSelectedThread(newThread);
        setChatModalVisible(true);
        return;
      }
    } catch (e) {
      console.warn("Lỗi mở cuộc trò chuyện:", e);
    }

    const fallbackThread: DmThreadSummary = existing || {
      threadId: partner.id,
      counterpartUserId: partner.id,
      displayName: partner.name,
      companyName: partner.company,
      avatarUrl: partner.avatarUrl,
      lastMessagePreview: "Bắt đầu cuộc trò chuyện kinh doanh mới",
      lastMessageAt: new Date().toISOString(),
      lastMessageFromMe: true,
      unreadCount: 0,
      isConnected: partner.status === "connected",
      isOnline: true,
    };
    setSelectedThread(fallbackThread);
    setChatModalVisible(true);
  };

  const handleMessageSent = (threadId: string, lastMessage: string) => {
    setThreads((prev) => {
      const updated = prev.map((t) =>
        t.threadId === threadId
          ? {
              ...t,
              lastMessagePreview: lastMessage,
              lastMessageAt: new Date().toISOString(),
              lastMessageFromMe: true,
              unreadCount: 0,
            }
          : t
      );
      // Đẩy cuộc trò chuyện vừa gửi/nhận tin nhắn lên vị trí đầu tiên
      return [...updated].sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || 0).getTime();
        const timeB = new Date(b.lastMessageAt || 0).getTime();
        return timeB - timeA;
      });
    });
  };

  const handleGroupCreated = (newGroup: DmThreadSummary) => {
    setThreads((prev) => [newGroup, ...prev]);
    setSelectedThread(newGroup);
    setChatModalVisible(true);
  };

  const formatThreadTime = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#0B0F17" : "#FFFFFF" },
      ]}
      edges={["top"]}
    >
      {/* 1. Sticky Header Thương Hiệu Khớp 100% PWA */}
      <StickyBrandHeader
        rightActions={
          <>
            <TouchableOpacity
              style={[
                styles.headerSquareBtn,
                {
                  backgroundColor: isDark ? "rgba(22, 32, 50, 0.65)" : "#F1F5F9",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                },
              ]}
              onPress={() => setActiveTab("messages")}
              activeOpacity={0.7}
            >
              <MessageSquare size={16} color={isDark ? "#D8B282" : "#64748B"} strokeWidth={1.8} />
              {totalUnreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{totalUnreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.headerSquareBtn,
                {
                  backgroundColor: isDark ? "rgba(22, 32, 50, 0.65)" : "#F1F5F9",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                },
              ]}
              onPress={() => setNotificationsVisible(true)}
              activeOpacity={0.7}
            >
              <Bell size={16} color={isDark ? "#D8B282" : "#64748B"} strokeWidth={1.8} />
            </TouchableOpacity>
          </>
        }
      />

      <View
        style={[
          styles.headerDivider,
          { backgroundColor: isDark ? "rgba(216, 178, 130, 0.15)" : "#E2E8F0" },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 2. Page Title Header: Network + Subtitle */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.pageTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
              Mạng lưới
            </Text>
          </View>
          <Text style={styles.pageSubtitle}>
            <Text style={styles.boldText}>{partners.length} kết nối</Text>
            <Text> • </Text>
            <Text style={styles.goldText}>3 cần chăm sóc</Text>
          </Text>
        </View>

        {/* 3. Horizontal Category Tabs (Khớp 100% web PWA) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryTabPill,
              {
                backgroundColor: activeTab === "network" ? "#D8B282" : isDark ? "#12151F" : "#F1F5F9",
                borderColor: activeTab === "network" ? "#D8B282" : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
              },
            ]}
            onPress={() => setActiveTab("network")}
          >
            <Text
              style={[
                styles.categoryTabPillText,
                {
                  color: activeTab === "network" ? "#050C15" : isDark ? "#94A3B8" : "#475569",
                  fontWeight: activeTab === "network" ? "800" : "600",
                },
              ]}
            >
              Mạng lưới
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTabPill,
              {
                backgroundColor: activeTab === "customers" ? "#D8B282" : isDark ? "#12151F" : "#F1F5F9",
                borderColor: activeTab === "customers" ? "#D8B282" : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
              },
            ]}
            onPress={() => setActiveTab("customers")}
          >
            <Text
              style={[
                styles.categoryTabPillText,
                {
                  color: activeTab === "customers" ? "#050C15" : isDark ? "#94A3B8" : "#475569",
                  fontWeight: activeTab === "customers" ? "800" : "600",
                },
              ]}
            >
              Khách hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTabPill,
              {
                backgroundColor: activeTab === "suggestions" ? "#D8B282" : isDark ? "#12151F" : "#F1F5F9",
                borderColor: activeTab === "suggestions" ? "#D8B282" : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
              },
            ]}
            onPress={() => setActiveTab("suggestions")}
          >
            <Sparkles size={13} color={activeTab === "suggestions" ? "#050C15" : "#D8B282"} style={{ marginRight: 4 }} />
            <Text
              style={[
                styles.categoryTabPillText,
                {
                  color: activeTab === "suggestions" ? "#050C15" : isDark ? "#94A3B8" : "#475569",
                  fontWeight: activeTab === "suggestions" ? "800" : "600",
                },
              ]}
            >
              Gợi ý (AI)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTabPill,
              {
                backgroundColor: activeTab === "messages" ? "#D8B282" : isDark ? "#12151F" : "#F1F5F9",
                borderColor: activeTab === "messages" ? "#D8B282" : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
              },
            ]}
            onPress={() => setActiveTab("messages")}
          >
            <Text
              style={[
                styles.categoryTabPillText,
                {
                  color: activeTab === "messages" ? "#050C15" : isDark ? "#94A3B8" : "#475569",
                  fontWeight: activeTab === "messages" ? "800" : "600",
                },
              ]}
            >
              Tin nhắn {totalUnreadCount > 0 ? `(${totalUnreadCount})` : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTabPill,
              {
                backgroundColor: activeTab === "requests" ? "#D8B282" : isDark ? "#12151F" : "#F1F5F9",
                borderColor: activeTab === "requests" ? "#D8B282" : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
              },
            ]}
            onPress={() => setActiveTab("requests")}
          >
            <Text
              style={[
                styles.categoryTabPillText,
                {
                  color: activeTab === "requests" ? "#050C15" : isDark ? "#94A3B8" : "#475569",
                  fontWeight: activeTab === "requests" ? "800" : "600",
                },
              ]}
            >
              Lời mời (1)
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ─── TAB 1: MẠNG LƯỚI (NETWORK) ─── */}
        {activeTab === "network" && (
          <View style={styles.tabContent}>
            {/* Search Bar with Filter */}
            <View
              style={[
                styles.searchWrapper,
                {
                  backgroundColor: isDark ? "#12151F" : "#F1F5F9",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                },
              ]}
            >
              <Search size={18} color={isDark ? "#D8B282" : "#A3703C"} style={styles.searchIcon} />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDark ? "#FFFFFF" : "#0F172A" },
                ]}
                placeholder="Tìm kiếm đối tác, công ty, ngành nghề..."
                placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                value={partnerSearchQuery}
                onChangeText={setPartnerSearchQuery}
              />
              {partnerSearchQuery !== "" && (
                <TouchableOpacity onPress={() => setPartnerSearchQuery("")}>
                  <X size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Filter Pills */}
            <View style={styles.quickFilterRow}>
              {[
                { id: "all", label: "Tất cả" },
                { id: "connected", label: "Đã kết nối" },
                { id: "pending", label: "Đang chờ" },
                { id: "suggested", label: "Gợi ý" },
              ].map((f) => {
                const isActive = filterPartnerKind === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: isActive
                          ? isDark ? "rgba(216, 178, 130, 0.18)" : "#F6E1C3"
                          : isDark ? "#181D2A" : "#F8FAFC",
                        borderColor: isActive
                          ? "#D8B282"
                          : isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0",
                      },
                    ]}
                    onPress={() => setFilterPartnerKind(f.id as any)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        {
                          color: isActive
                            ? isDark ? "#D8B282" : "#8C653B"
                            : isDark ? "#94A3B8" : "#64748B",
                          fontWeight: isActive ? "700" : "500",
                        },
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tin 24h Doanh nhân (Story Strip) */}
            <View style={styles.storiesSection}>
              <View style={styles.storiesHeaderRow}>
                <Text style={styles.sectionHeaderSmall}>TIN 24H DOANH NHÂN (STORY)</Text>
                <TouchableOpacity
                  onPress={() => setCreateStoryVisible(true)}
                  style={styles.addMomentBtn}
                  activeOpacity={0.8}
                >
                  <Plus size={13} color="#D8B282" style={{ marginRight: 3 }} />
                  <Text style={styles.addMomentText}>Đăng story</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesScroll}
              >
                {/* 1. Nút Thêm Story */}
                <TouchableOpacity
                  style={styles.myStoryCard}
                  onPress={() => setCreateStoryVisible(true)}
                  activeOpacity={0.85}
                >
                  <View style={styles.myStoryAvatarWrap}>
                    <Avatar url={user?.avatarUrl} name={user?.displayName || "Doanh nhân"} size={44} showGoldBorder />
                    <View style={styles.myStoryAddBadge}>
                      <Plus size={13} color="#050C15" strokeWidth={3} />
                    </View>
                  </View>
                  <Text style={styles.myStoryLabel}>Đăng story</Text>
                  <Text style={styles.myStorySub}>Tin 24h</Text>
                </TouchableOpacity>

                {/* 2. Danh sách Story các Doanh Nhân */}
                {displayStories.length === 0 ? (
                  <View
                    style={{
                      width: 165,
                      height: 140,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "rgba(216, 178, 130, 0.4)",
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 12,
                      marginLeft: 10,
                      backgroundColor: isDark ? "rgba(216, 178, 130, 0.05)" : "#FDFBF7",
                    }}
                  >
                    <Sparkles size={18} color="#D8B282" style={{ marginBottom: 6 }} />
                    <Text style={{ fontSize: 11, fontWeight: "700", color: isDark ? "#F6E1C3" : "#8C653B", textAlign: "center" }}>
                      Khoảnh khắc 24h
                    </Text>
                    <Text style={{ fontSize: 9.5, color: isDark ? "#94A3B8" : "#64748B", textAlign: "center", marginTop: 4 }}>
                      Chỉ hiển thị cho đối tác đã kết nối
                    </Text>
                  </View>
                ) : (
                  displayStories.map((story) => (
                    <TouchableOpacity
                      key={story.id}
                      style={styles.storyCard}
                      onPress={() => {
                        setSelectedStory(story);
                        setStoryViewerVisible(true);
                      }}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: resolveMediaUrl(story.storyImage) || story.storyImage }} style={styles.storyCardBg} resizeMode="cover" />
                      <LinearGradient
                        colors={["rgba(10, 10, 11, 0.4)", "transparent", "rgba(10, 10, 11, 0.9)"]}
                        style={styles.storyCardGradient}
                      />

                      {/* Top Author Avatar & Tag */}
                      <View style={styles.storyCardTop}>
                        <Avatar url={story.authorAvatar} name={story.authorName} size={28} showGoldBorder />
                        {story.tag && (
                          <View style={styles.storyCardTag}>
                            <Text style={styles.storyCardTagText} numberOfLines={1}>{story.tag}</Text>
                          </View>
                        )}
                      </View>

                      {/* Bottom Author Name & Time */}
                      <View style={styles.storyCardBottom}>
                        <Text style={styles.storyAuthorName} numberOfLines={1}>
                          {story.authorName}
                        </Text>
                        <Text style={styles.storyTimeAgo}>{story.timeAgo}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            {/* Khối SOẠN KHOẢNH KHẮC DOANH NGHIỆP (B2B Social Composer) */}
            <View
              style={[
                styles.nurtureSection,
                {
                  backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                  borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "rgba(216, 178, 130, 0.4)",
                  marginTop: 10,
                  marginBottom: 12,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9" }}>
                <Avatar url={user?.avatarUrl} name={user?.displayName || "Doanh nhân"} size={36} showGoldBorder />
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 20,
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC",
                    borderWidth: 1,
                    borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#E2E8F0",
                  }}
                  onPress={() => setPostMomentVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#64748B" }}>
                    Bạn đang nghĩ gì? Chia sẻ khoảnh khắc...
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setPostMomentVisible(true)}
                  activeOpacity={0.8}
                >
                  <Camera size={15} color="#10B981" style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: isDark ? "#E2E8F0" : "#334155" }}>
                    Chụp ảnh
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setPostMomentVisible(true)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={15} color="#D8B282" style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: isDark ? "#E2E8F0" : "#334155" }}>
                    Chủ đề
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setPostMomentVisible(true)}
                  activeOpacity={0.8}
                >
                  <Plus size={15} color="#3B82F6" style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}>
                    Đăng khoảnh khắc
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* BẢNG TIN KHOẢNH KHẮC DOANH NGHIỆP (Feed Cards) */}
            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 4 }}>
                <Text style={styles.sectionHeaderSmall}>BẢNG TIN KHOẢNH KHẮC DOANH NGHIỆP</Text>
                <Text style={{ fontSize: 11, color: isDark ? "#D8B282" : "#8C653B", fontWeight: "700" }}>
                  {momentsFeed.length} bài viết
                </Text>
              </View>

              {momentsFeed.length === 0 ? (
                <EmptyState
                  icon={<Camera size={28} color="#D8B282" />}
                  title="Chưa có khoảnh khắc nào"
                  description="Chia sẻ tin tức, hoạt động ký kết hoặc sự kiện doanh nghiệp với mạng lưới đối tác."
                  actionTitle="Đăng Khoảnh Khắc Mới"
                  onAction={() => setPostMomentVisible(true)}
                  isDark={isDark}
                />
              ) : (
                momentsFeed.map((moment) => {
                  const photoUri = moment.imageUrl ? (resolveMediaUrl(moment.imageUrl) || moment.imageUrl) : null;
                  return (
                    <View
                      key={moment.id}
                      style={{
                        borderRadius: 16,
                        backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                        borderWidth: 1,
                        borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "rgba(216, 178, 130, 0.35)",
                        padding: 14,
                        marginBottom: 12,
                        shadowColor: isDark ? "#000000" : "#64748B",
                        shadowOpacity: isDark ? 0.3 : 0.05,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        elevation: 2,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <Avatar url={moment.authorAvatar} name={moment.authorName} size={40} showGoldBorder />
                          <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: "700", color: isDark ? "#FFFFFF" : "#0F172A" }}>
                              {moment.authorName}
                            </Text>
                            <Text style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B" }} numberOfLines={1}>
                              {moment.authorTitle} · {moment.authorCompany}
                            </Text>
                          </View>
                        </View>
                        {moment.tag ? (
                          <View style={{ backgroundColor: isDark ? "rgba(216, 178, 130, 0.15)" : "#F6E1C3", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: "#8C653B" }}>
                            <Text style={{ fontSize: 10, fontWeight: "700", color: isDark ? "#F6E1C3" : "#8C653B" }}>
                              #{moment.tag}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={{ fontSize: 13.5, lineHeight: 20, color: isDark ? "#E2E8F0" : "#1E293B", marginBottom: photoUri ? 10 : 6 }}>
                        {moment.content}
                      </Text>

                      {photoUri ? (
                        <View style={{ borderRadius: 12, overflow: "hidden", marginBottom: 10, backgroundColor: isDark ? "#000" : "#F1F5F9" }}>
                          <Image
                            source={{ uri: photoUri }}
                            style={{ width: "100%", height: 210 }}
                            resizeMode="cover"
                          />
                        </View>
                      ) : null}

                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
                        <Text style={{ fontSize: 11, color: isDark ? "#64748B" : "#94A3B8" }}>
                          {moment.timeAgo || "Vừa xong"}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                          <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => {
                              setMomentsFeed((prev) =>
                                prev.map((m) =>
                                  m.id === moment.id
                                    ? {
                                        ...m,
                                        isLiked: !m.isLiked,
                                        likesCount: m.isLiked ? Math.max(0, m.likesCount - 1) : m.likesCount + 1,
                                      }
                                    : m
                                )
                              );
                            }}
                            activeOpacity={0.7}
                          >
                            <Heart
                              size={16}
                              color={moment.isLiked ? "#EF4444" : (isDark ? "#94A3B8" : "#64748B")}
                              fill={moment.isLiked ? "#EF4444" : "transparent"}
                              style={{ marginRight: 4 }}
                            />
                            <Text style={{ fontSize: 12, fontWeight: "600", color: moment.isLiked ? "#EF4444" : (isDark ? "#CBD5E1" : "#475569") }}>
                              {moment.likesCount || 0}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => {
                              setSelectedMomentForComment(moment);
                              setMomentCommentVisible(true);
                            }}
                            activeOpacity={0.7}
                          >
                            <MessageSquare size={16} color={isDark ? "#94A3B8" : "#64748B"} style={{ marginRight: 4 }} />
                            <Text style={{ fontSize: 12, fontWeight: "600", color: isDark ? "#CBD5E1" : "#475569" }}>
                              {moment.commentsCount || 0}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => Alert.alert("Chia sẻ", "Đã sao chép liên kết khoảnh khắc để chia sẻ!")}
                            activeOpacity={0.7}
                          >
                            <Share2 size={16} color={isDark ? "#94A3B8" : "#64748B"} style={{ marginRight: 4 }} />
                            <Text style={{ fontSize: 12, fontWeight: "600", color: isDark ? "#CBD5E1" : "#475569" }}>
                              Chia sẻ
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Khối CẦN GIỮ KẾT NỐI & CHĂM SÓC (Khớp 100% Nurture List) */}
            <View
              style={[
                styles.nurtureSection,
                {
                  backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                  borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "rgba(216, 178, 130, 0.4)",
                  shadowColor: isDark ? "#000000" : "#64748B",
                  shadowOpacity: isDark ? 0.4 : 0.06,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 8,
                  elevation: 2,
                },
              ]}
            >
              <View style={styles.nurtureHeaderRow}>
                <View style={styles.nurtureHeaderLeft}>
                  <Sparkles size={15} color="#D8B282" style={{ marginRight: 6 }} />
                  <Text style={styles.nurtureTitle}>CẦN GIỮ KẾT NỐI & CHĂM SÓC</Text>
                </View>
                <View style={styles.nurtureCountBadge}>
                  <Text style={styles.nurtureCountText}>{nurtureList.length} CẦN CHĂM SÓC</Text>
                </View>
              </View>

              <View style={styles.nurtureListCol}>
                {nurtureList.length === 0 ? (
                  <EmptyState
                    icon={<Sparkles size={28} color="#D8B282" />}
                    title="Chưa có gợi ý chăm sóc hôm nay"
                    description="Hệ thống AI sẽ tự động phân tích tương tác và đề xuất đối tác B2B cần giữ kết nối khi mạng lưới phát triển."
                    isDark={isDark}
                  />
                ) : (
                  nurtureList.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.nurtureCard,
                        {
                          backgroundColor: isDark ? "#181D2A" : "#F8FAFC",
                          borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0",
                        },
                      ]}
                    >
                      <View style={styles.nurtureCardMain}>
                        <View style={styles.nurtureInfo}>
                          <View style={styles.nurtureNameRow}>
                            <Text
                              style={[
                                styles.nurtureName,
                                { color: isDark ? "#FFFFFF" : "#0F172A" },
                              ]}
                            >
                              {item.name}
                            </Text>
                            <View style={styles.nurtureTagBadge}>
                              <Text style={styles.nurtureTagText}>{item.tag}</Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              styles.nurtureRole,
                              { color: isDark ? "#94A3B8" : "#64748B" },
                            ]}
                          >
                            {item.role || `${item.title} · ${item.company}`}
                          </Text>
                          <Text
                            style={[
                              styles.nurtureReasonText,
                              { color: isDark ? "#F6E1C3" : "#8C653B" },
                            ]}
                          >
                            💡 {item.reason}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.nurtureActionRow}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedPartnerForMeeting({
                              name: item.name,
                              company: item.company,
                            });
                            setScheduleMeetingVisible(true);
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.nurtureMeetBtn}
                          >
                            <Users size={13} color="#050C15" style={{ marginRight: 4 }} />
                            <Text style={styles.nurtureMeetText}>Hẹn 1-1</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            const partner = partners.find((p) => p.name === item.name) || {
                              id: item.id,
                              name: item.name,
                              title: item.title,
                              company: item.company,
                              status: "connected" as const,
                            };
                            handleOpenChatWithPartner(partner);
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={isDark ? ["#1E293B", "#0F172A"] : ["#F8FAFC", "#E2E8F0"]}
                            style={[styles.nurtureChatBtn, { borderWidth: 1, borderColor: "rgba(216, 178, 130, 0.4)" }]}
                          >
                            <MessageSquare size={13} color="#D8B282" style={{ marginRight: 4 }} />
                            <Text style={styles.nurtureChatText}>Nhắn tin</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => Alert.alert("Gọi điện", `Gọi tới số: ${item.phone}`)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={isDark ? ["#1E293B", "#0F172A"] : ["#F8FAFC", "#E2E8F0"]}
                            style={[styles.nurtureCallBtn, { borderWidth: 1, borderColor: "rgba(216, 178, 130, 0.4)" }]}
                          >
                            <Phone size={13} color="#D8B282" />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>

            {/* ViOne AI Copilot Matcher Banner (Khớp 100% PWA) */}
            <View
              style={[
                styles.aiBanner,
                {
                  backgroundColor: isDark ? "rgba(216, 178, 130, 0.12)" : "#FFFDF8",
                  borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "rgba(216, 178, 130, 0.45)",
                },
              ]}
            >
              <View style={styles.aiBannerIconWrap}>
                <Sparkles size={20} color={isDark ? "#D8B282" : "#A3703C"} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.aiBannerTitle,
                    { color: isDark ? "#D8B282" : "#8C653B" },
                  ]}
                >
                  ViOne AI Matchmaking 5.0
                </Text>
                <Text
                  style={[
                    styles.aiBannerSubtitle,
                    { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  Trợ lý AI tự động phân tích ngành nghề & đề xuất đối tác B2B tương thích cao.
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.aiExploreBtn,
                  { backgroundColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#F6E1C3" },
                ]}
                onPress={() => setAiAssistantVisible(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.aiExploreText,
                    { color: isDark ? "#D8B282" : "#8C653B" },
                  ]}
                >
                  Khám phá AI
                </Text>
                <ChevronRight size={13} color={isDark ? "#D8B282" : "#8C653B"} />
              </TouchableOpacity>
            </View>

            {/* Partners List */}
            <View style={styles.listSection}>
              <Text style={styles.sectionHeaderSmall}>DANH BẠ ĐỐI TÁC DOANH NGHIỆP</Text>
              {filteredPartners.length === 0 ? (
                <EmptyState
                  icon={<Users size={28} color="#D8B282" />}
                  title="Chưa có đối tác kết nối nào"
                  description="Quét mã QR danh thiếp hoặc tìm kiếm doanh nhân để mở rộng mạng lưới giao thương."
                  actionTitle="Quét QR Kết Nối"
                  onAction={() => navigation.navigate("QuickConnect" as any)}
                  isDark={isDark}
                />
              ) : (
                filteredPartners.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.partnerCard,
                      {
                        backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                        shadowColor: isDark ? "#000000" : "#64748B",
                        shadowOpacity: isDark ? 0.3 : 0.04,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        elevation: 2,
                      },
                    ]}
                  >
                    <View style={styles.cardMain}>
                      <Avatar url={item.avatarUrl} name={item.name} size={50} showGoldBorder />
                      <View style={styles.partnerInfo}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.partnerName,
                              { color: isDark ? "#FFFFFF" : "#0F172A" },
                            ]}
                          >
                            {item.name}
                          </Text>
                          {item.matchScore && (
                            <View style={styles.matchBadge}>
                              <Text style={styles.matchText}>{item.matchScore}% Phù hợp</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.partnerTitle}>{item.title}</Text>

                        <View style={styles.companyRow}>
                          <Building2 size={12} color={isDark ? "#94A3B8" : "#64748B"} style={{ marginRight: 4 }} />
                          <Text
                            style={[
                              styles.partnerCompany,
                              { color: isDark ? "#94A3B8" : "#64748B" },
                            ]}
                            numberOfLines={1}
                          >
                            {item.company}
                          </Text>
                        </View>

                        {item.industry && (
                          <View
                            style={[
                              styles.industryTag,
                              { backgroundColor: isDark ? "#181D2A" : "#F1F5F9" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.industryText,
                                { color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569" },
                              ]}
                            >
                              {item.industry}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        onPress={() => handleOpenChatWithPartner(item)}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.chatActionBtn}
                        >
                          <MessageSquare size={14} color="#050C15" style={{ marginRight: 5 }} />
                          <Text style={styles.chatActionText}>Nhắn tin</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {item.status === "connected" && (
                        <>
                          <TouchableOpacity
                            style={[
                              styles.iconActionBtn,
                              {
                                backgroundColor: isDark ? "#181D2A" : "#F1F5F9",
                                borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "#E2E8F0",
                              },
                            ]}
                            onPress={() => Alert.alert("Gọi điện", `Gọi tới số: ${item.phone}`)}
                          >
                            <Phone size={15} color={isDark ? "#D8B282" : "#A3703C"} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.iconActionBtn,
                              {
                                backgroundColor: isDark ? "#181D2A" : "#F1F5F9",
                                borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "#E2E8F0",
                              },
                            ]}
                            onPress={() => Alert.alert("Gửi email", `Gửi tới: ${item.email}`)}
                          >
                            <Mail size={15} color={isDark ? "#D8B282" : "#A3703C"} />
                          </TouchableOpacity>
                        </>
                      )}

                      {item.status === "pending" && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingBadgeText}>Đang chờ duyệt</Text>
                        </View>
                      )}

                      {item.status === "suggested" && (
                        <TouchableOpacity
                          onPress={() => {
                            setPartners((prev) =>
                              prev.map((p) => (p.id === item.id ? { ...p, status: "pending" } : p))
                            );
                            Alert.alert("Thành công", `Đã gửi lời mời kết nối tới ${item.name}.`);
                          }}
                          activeOpacity={0.85}
                        >
                          <LinearGradient
                            colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.connectBtn}
                          >
                            <Text style={[styles.connectBtnText, { color: "#050C15", fontWeight: "700" }]}>Kết nối ngay</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* ─── TAB 2: KHÁCH HÀNG (CUSTOMERS PANEL) ─── */}
        {activeTab === "customers" && (
          <View style={styles.tabContent}>
            {/* Summary Pipeline Metric Grid (4 Executive Metrics) */}
            <View style={{ gap: 8, marginBottom: 12 }}>
              <View style={styles.pipelineSummaryRow}>
                <View
                  style={[
                    styles.pipelineCard,
                    {
                      backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      shadowColor: isDark ? "#000000" : "#64748B",
                      shadowOpacity: isDark ? 0.3 : 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 2,
                    },
                  ]}
                >
                  <DollarSign size={18} color={isDark ? "#D8B282" : "#A3703C"} />
                  <Text style={[styles.pipelineNumber, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    {customersList.length} Deal
                  </Text>
                  <Text style={[styles.pipelineLabel, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    Quy mô cơ hội
                  </Text>
                </View>

                <View
                  style={[
                    styles.pipelineCard,
                    {
                      backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      shadowColor: isDark ? "#000000" : "#64748B",
                      shadowOpacity: isDark ? 0.3 : 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 2,
                    },
                  ]}
                >
                  <TrendingUp size={18} color="#38BDF8" />
                  <Text style={[styles.pipelineNumber, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    {customersList.filter((c) => (c.stage || "").toLowerCase().includes("đàm phán") || (c.stage || "").toLowerCase().includes("thương thảo")).length} B2B
                  </Text>
                  <Text style={[styles.pipelineLabel, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    Đang đàm phán
                  </Text>
                </View>
              </View>

              <View style={styles.pipelineSummaryRow}>
                <View
                  style={[
                    styles.pipelineCard,
                    {
                      backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      shadowColor: isDark ? "#000000" : "#64748B",
                      shadowOpacity: isDark ? 0.3 : 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 2,
                    },
                  ]}
                >
                  <Sparkles size={18} color="#10B981" />
                  <Text style={[styles.pipelineNumber, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    {customersList.length > 0 ? `${Math.round((customersList.filter((c) => (c.stage || "").toLowerCase().includes("triển khai") || (c.stage || "").toLowerCase().includes("ký kết")).length / customersList.length) * 100)}%` : "0%"}
                  </Text>
                  <Text style={[styles.pipelineLabel, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    Tỷ lệ chốt deal
                  </Text>
                </View>

                <View
                  style={[
                    styles.pipelineCard,
                    {
                      backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      shadowColor: isDark ? "#000000" : "#64748B",
                      shadowOpacity: isDark ? 0.3 : 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 2,
                    },
                  ]}
                >
                  <Calendar size={18} color="#F59E0B" />
                  <Text style={[styles.pipelineNumber, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                    {customersList.filter((c) => c.priority === "Ưu tiên cao" || c.priority === "Chiến lược").length} KH
                  </Text>
                  <Text style={[styles.pipelineLabel, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    Ưu tiên cao
                  </Text>
                </View>
              </View>
            </View>

            {/* Filter Stage Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {[
                { key: "all", label: `Tất cả (${customersList.length})` },
                { key: "Đàm phán", label: `Đàm phán (${customersList.filter((c) => (c.stage || "").toLowerCase().includes("đàm phán")).length})` },
                { key: "Đề xuất", label: `Đề xuất (${customersList.filter((c) => (c.stage || "").toLowerCase().includes("đề xuất")).length})` },
                { key: "Triển khai", label: `Triển khai (${customersList.filter((c) => (c.stage || "").toLowerCase().includes("triển khai") || (c.stage || "").toLowerCase().includes("ký kết")).length})` },
              ].map((f) => {
                const isActive = customerStageFilter === f.key;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => setCustomerStageFilter(f.key)}
                    style={[
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        marginRight: 6,
                        borderWidth: 1,
                        backgroundColor: isActive
                          ? isDark ? "rgba(216, 178, 130, 0.2)" : "#F6E1C3"
                          : isDark ? "#12151F" : "#F1F5F9",
                        borderColor: isActive
                          ? "#D8B282"
                          : isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: isActive ? "700" : "500",
                        color: isActive
                          ? isDark ? "#F6E1C3" : "#8C653B"
                          : isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Customer List Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={[styles.sectionHeaderSmall, { marginTop: 0, marginBottom: 0 }]}>
                DANH SÁCH KHÁCH HÀNG ({customersList.length})
              </Text>
              <TouchableOpacity
                style={{ borderRadius: 12, overflow: "hidden" }}
                onPress={() => setCreateCustomerVisible(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, gap: 5 }}
                >
                  <Plus size={13} color="#050C15" strokeWidth={2.5} />
                  <Text style={{ fontSize: 11.5, fontWeight: "800", color: "#050C15" }}>Thêm khách hàng</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {customersList.filter((cust) => {
              if (customerStageFilter === "all") return true;
              return (cust.stage || "").toLowerCase().includes(customerStageFilter.toLowerCase());
            }).length === 0 ? (
              <EmptyState
                icon={<Building2 size={28} color="#D8B282" />}
                title="Chưa có khách hàng B2B nào"
                description="Tạo hồ sơ khách hàng doanh nghiệp để quản lý phễu đàm phán và tiến độ chốt hợp đồng."
                actionTitle="Thêm Khách Hàng Mới"
                onAction={() => setCreateCustomerVisible(true)}
                isDark={isDark}
              />
            ) : (
              customersList
                .filter((cust) => {
                  if (customerStageFilter === "all") return true;
                  return (cust.stage || "").toLowerCase().includes(customerStageFilter.toLowerCase());
                })
                .map((cust) => (
                  <TouchableOpacity
                    key={cust.id}
                    style={[
                      styles.customerCard,
                      {
                        backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                        shadowColor: isDark ? "#000000" : "#64748B",
                        shadowOpacity: isDark ? 0.3 : 0.04,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        elevation: 2,
                      },
                    ]}
                    onPress={() => {
                      setSelectedCustomer({
                        id: cust.id,
                        name: cust.name,
                        contactPerson: cust.contactPerson,
                        dealValue: cust.dealValue,
                        stage: cust.stage,
                        priority: cust.priority,
                        phone: (cust as any).phone || "",
                        email: (cust as any).email || "",
                        tags: (cust as any).tags || ["B2B", "Khách hàng"],
                        lastInteraction: (cust as any).lastInteraction || "Gần đây",
                      });
                      setCustomerDetailVisible(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.customerTop}>
                      <Text
                        style={[
                          styles.customerName,
                          { color: isDark ? "#FFFFFF" : "#0F172A" },
                        ]}
                      >
                        {cust.name}
                      </Text>
                      <View
                        style={[
                          styles.priorityPill,
                          { backgroundColor: isDark ? "rgba(216, 178, 130, 0.18)" : "#F6E1C3" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            { color: isDark ? "#D8B282" : "#8C653B" },
                          ]}
                        >
                          {cust.priority}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.customerContact,
                        { color: isDark ? "#94A3B8" : "#64748B" },
                      ]}
                    >
                      Người liên hệ: {cust.contactPerson}
                    </Text>

                    <View
                      style={[
                        styles.customerFooter,
                        { borderTopColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0" },
                      ]}
                    >
                      <View style={styles.dealPill}>
                        <Text style={styles.dealText}>{cust.dealValue}</Text>
                      </View>
                      <Text
                        style={[
                          styles.customerStage,
                          { color: isDark ? "#D8B282" : "#8C653B" },
                        ]}
                      >
                        {cust.stage}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </View>
        )}

        {/* ─── TAB 3: GỢI Ý (AI SUGGESTIONS) ─── */}
        {activeTab === "suggestions" && (
          <View style={styles.tabContent}>
            <View
              style={[
                styles.aiBanner,
                {
                  backgroundColor: isDark ? "rgba(216, 178, 130, 0.12)" : "#FFFDF8",
                  borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "rgba(216, 178, 130, 0.45)",
                },
              ]}
            >
              <Sparkles size={20} color={isDark ? "#D8B282" : "#A3703C"} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.aiBannerTitle,
                    { color: isDark ? "#D8B282" : "#8C653B" },
                  ]}
                >
                  AI Đề Xuất Đối Tác Phù Hợp
                </Text>
                <Text
                  style={[
                    styles.aiBannerSubtitle,
                    { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  Dựa trên hồ sơ năng lực doanh nghiệp, ngành nghề và cơ hội cung ứng chéo.
                </Text>
              </View>
            </View>

            {partners.filter((p) => p.status === "suggested").length === 0 ? (
              <EmptyState
                icon={<Sparkles size={28} color="#D8B282" />}
                title="Chưa có gợi ý đối tác mới"
                description="Hệ thống AI đang phân tích dữ liệu ngành nghề và hồ sơ doanh nghiệp để đề xuất các cơ hội hợp tác phù hợp nhất."
                isDark={isDark}
              />
            ) : (
              partners
                .filter((p) => p.status === "suggested")
                .map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.partnerCard,
                      {
                        backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                        shadowColor: isDark ? "#000000" : "#64748B",
                        shadowOpacity: isDark ? 0.3 : 0.04,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        elevation: 2,
                      },
                    ]}
                  >
                    <View style={styles.cardMain}>
                      <Avatar url={item.avatarUrl} name={item.name} size={50} showGoldBorder />
                      <View style={styles.partnerInfo}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.partnerName,
                              { color: isDark ? "#FFFFFF" : "#0F172A" },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <View style={styles.matchBadge}>
                            <Text style={styles.matchText}>{item.matchScore}% Phù hợp</Text>
                          </View>
                        </View>
                        <Text style={styles.partnerTitle}>{item.title}</Text>
                        <Text
                          style={[
                            styles.partnerCompany,
                            { color: isDark ? "#94A3B8" : "#64748B" },
                          ]}
                        >
                          {item.company}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.cardActions,
                        { borderTopColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0" },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setPartners((prev) =>
                            prev.map((p) => (p.id === item.id ? { ...p, status: "pending" } : p))
                          );
                          Alert.alert("Thành công", `Đã gửi lời mời hợp tác tới ${item.name}.`);
                        }}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.connectBtnFull}
                        >
                          <Sparkles size={14} color="#050C15" style={{ marginRight: 6 }} />
                          <Text style={styles.connectBtnFullText}>Gửi lời mời kết nối B2B</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            )}
          </View>
        )}

        {/* ─── TAB 4: HỘP THƯ TIN NHẮN (MESSAGES) ─── */}
        {activeTab === "messages" && (
          <View style={styles.tabContent}>
            {/* Banner Tìm bạn bè từ danh bạ điện thoại */}
            {!contactsBannerDismissed && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 16,
                  marginBottom: 12,
                  backgroundColor: isDark ? "rgba(216, 178, 130, 0.1)" : "#F6E1C3",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "rgba(216, 178, 130, 0.6)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, marginRight: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "#D8B282",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={16} color="#050C15" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: "800",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                      numberOfLines={1}
                    >
                      Tìm bạn bè từ danh bạ điện thoại
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: isDark ? "#D8B282" : "#8C653B",
                        marginTop: 1,
                      }}
                      numberOfLines={1}
                    >
                      Kết nối với bạn bè, đồng nghiệp đang dùng ViOne
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setContactsDiscoveryVisible(true)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      borderRadius: 8,
                      backgroundColor: "#D8B282",
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "800", color: "#050C15" }}>
                      Khám phá
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setContactsBannerDismissed(true)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={15} color={isDark ? "#94A3B8" : "#64748B"} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Search & Create Group Header Row */}
            <View style={styles.inboxActionRow}>
              <View
                style={[
                  styles.inboxSearchWrap,
                  {
                    backgroundColor: isDark ? "#12151F" : "#F1F5F9",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  },
                ]}
              >
                <Search size={16} color={isDark ? "#D8B282" : "#A3703C"} style={{ marginRight: 8 }} />
                <TextInput
                  style={[
                    styles.inboxSearchInput,
                    { color: isDark ? "#FFFFFF" : "#0F172A" },
                  ]}
                  placeholder="Tìm người liên hệ, nhóm phòng ban..."
                  placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                  value={messageSearchQuery}
                  onChangeText={setMessageSearchQuery}
                />
                {messageSearchQuery !== "" && (
                  <TouchableOpacity onPress={() => setMessageSearchQuery("")}>
                    <X size={15} color={isDark ? "#94A3B8" : "#64748B"} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.createGroupBtn}
                onPress={() => setCreateGroupVisible(true)}
              >
                <Users size={15} color="#050C15" style={{ marginRight: 5 }} />
                <Text style={styles.createGroupText}>Tạo nhóm</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Messenger-Style Category Tabs */}
            <View style={styles.categoryTabsRow}>
              {[
                { id: "all", label: `Tất cả (${allThreads.length})` },
                { id: "unread", label: `Chưa đọc ${unreadThreads.length > 0 ? `(${unreadThreads.length})` : ""}` },
                { id: "groups", label: `Nhóm (${groupThreads.length})` },
                { id: "requests", label: `Tin nhắn chờ ${pendingThreads.length > 0 ? `(${pendingThreads.length})` : ""}` },
              ].map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor: activeMessageCategory === c.id
                        ? isDark ? "rgba(216, 178, 130, 0.2)" : "#F6E1C3"
                        : isDark ? "#181D2A" : "#F1F5F9",
                      borderColor: activeMessageCategory === c.id
                        ? "#D8B282"
                        : isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0",
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => setActiveMessageCategory(c.id as any)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      {
                        color: activeMessageCategory === c.id
                          ? isDark ? "#D8B282" : "#8C653B"
                          : isDark ? "#94A3B8" : "#64748B",
                        fontWeight: activeMessageCategory === c.id ? "700" : "500",
                      },
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Thread List */}
            {isLoadingThreads ? (
              <View style={styles.centerLoading}>
                <ActivityIndicator size="small" color="#D8B282" />
                <Text style={styles.loadingText}>Đang đồng bộ hộp thư ViOne...</Text>
              </View>
            ) : filteredThreads.length === 0 ? (
              <EmptyState
                icon={<MessageSquare size={28} color="#D8B282" />}
                title="Chưa có cuộc trò chuyện nào"
                description={
                  activeMessageCategory === "unread"
                    ? "Bạn đã đọc hết mọi tin nhắn."
                    : activeMessageCategory === "groups"
                    ? "Chưa tham gia nhóm nào. Bấm 'Tạo nhóm' để kết nối nhóm làm việc."
                    : "Chọn một đối tác trong danh bạ để bắt đầu nhắn tin trao đổi công việc."
                }
                actionTitle={activeMessageCategory === "groups" ? "Tạo Nhóm Mới" : undefined}
                onAction={activeMessageCategory === "groups" ? () => setCreateGroupVisible(true) : undefined}
                isDark={isDark}
              />
            ) : (
              filteredThreads.map((item) => {
                const hasUnread = (item.unreadCount || 0) > 0;
                return (
                  <TouchableOpacity
                    key={item.threadId}
                    style={[
                      styles.threadItem,
                      {
                        backgroundColor: isDark
                          ? (hasUnread ? "#161B29" : "#12151F")
                          : (hasUnread ? "#FDF8F0" : "#FFFFFF"),
                        borderColor: hasUnread
                          ? "rgba(216, 178, 130, 0.45)"
                          : isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0",
                        shadowColor: isDark ? "#000000" : "#64748B",
                        shadowOpacity: isDark ? 0.3 : 0.03,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 5,
                        elevation: 1,
                      },
                    ]}
                    onPress={() => {
                      setSelectedThread(item);
                      setChatModalVisible(true);
                    }}
                  >
                    <TouchableOpacity
                      style={styles.threadAvatarWrap}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleOpenPartnerProfile(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Avatar
                        url={item.avatarUrl}
                        name={item.displayName}
                        size={48}
                        showGoldBorder={hasUnread}
                      />
                      {item.isOnline && <View style={styles.onlineDot} />}
                    </TouchableOpacity>

                    <View style={styles.threadBody}>
                      <View style={styles.threadHeaderRow}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <Text
                            style={[
                              styles.threadName,
                              { color: isDark ? "#FFFFFF" : "#0F172A" },
                              hasUnread && styles.threadNameBold,
                            ]}
                            numberOfLines={1}
                          >
                            {item.displayName}
                          </Text>
                          {item.isGroup && (
                            <View style={styles.threadGroupTag}>
                              <Users size={10} color="#D8B282" />
                              <Text style={styles.threadGroupTagText}>Nhóm</Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.threadTime,
                            { color: isDark ? "#94A3B8" : "#64748B" },
                          ]}
                        >
                          {formatThreadTime(item.lastMessageAt)}
                        </Text>
                      </View>

                      <View style={styles.threadPreviewRow}>
                        <Text
                          style={[
                            styles.threadPreviewText,
                            { color: isDark ? "#94A3B8" : "#64748B" },
                            hasUnread && { color: isDark ? "#FFFFFF" : "#0F172A", fontWeight: "600" },
                          ]}
                          numberOfLines={1}
                        >
                          {item.lastMessageFromMe && (
                            <Text style={{ fontWeight: "700", color: "#D8B282" }}>
                              Bạn:{" "}
                            </Text>
                          )}
                          {formatDmMessagePreview(item.lastMessagePreview)}
                        </Text>

                        {hasUnread && (
                          <View style={styles.unreadCounter}>
                            <Text style={styles.unreadCounterText}>{item.unreadCount}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* ─── TAB 5: LỜI MỜI (REQUESTS) ─── */}
        {activeTab === "requests" && (
          <View style={styles.tabContent}>
            {connectionRequests.length === 0 ? (
              <EmptyState
                icon={<UserPlus size={28} color="#D8B282" />}
                title="Chưa có lời mời kết nối nào"
                description="Khi có đối tác gửi lời mời kết nối hợp tác qua danh thiếp số hoặc cộng đồng, yêu cầu sẽ xuất hiện tại đây."
                isDark={isDark}
              />
            ) : (
              connectionRequests.map((req) => (
                <View
                  key={req.id}
                  style={[
                    styles.requestCard,
                    {
                      backgroundColor: isDark ? "#12151F" : "#FFFFFF",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                      shadowColor: isDark ? "#000000" : "#64748B",
                      shadowOpacity: isDark ? 0.3 : 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 2,
                    },
                  ]}
                >
                  <View style={styles.cardMain}>
                    <Avatar url={req.senderAvatar || req.avatarUrl} name={req.senderName || req.name || "Doanh nhân"} size={50} showGoldBorder />
                    <View style={styles.partnerInfo}>
                      <Text
                        style={[
                          styles.partnerName,
                          { color: isDark ? "#FFFFFF" : "#0F172A" },
                        ]}
                      >
                        {req.senderName || req.name || "Doanh nhân"}
                      </Text>
                      <Text style={styles.partnerTitle}>{req.senderTitle || req.title || "Lãnh đạo doanh nghiệp"}</Text>
                      <Text
                        style={[
                          styles.partnerCompany,
                          { color: isDark ? "#94A3B8" : "#64748B" },
                        ]}
                      >
                        {req.senderCompany || req.company || "Đối tác ViOne"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.requestActionRow,
                      { borderTopColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0" },
                    ]}
                  >
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          await networkApi.updateConnection(req.id, "accepted");
                          setConnectionRequests((prev) => prev.filter((r) => r.id !== req.id));
                          Alert.alert("Thành công", "Đã chấp nhận lời mời kết nối.");
                        } catch (err) {
                          setConnectionRequests((prev) => prev.filter((r) => r.id !== req.id));
                          Alert.alert("Thông báo", "Đã ghi nhận kết nối.");
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.acceptBtn}
                      >
                        <Check size={14} color="#050C15" style={{ marginRight: 4 }} />
                        <Text style={styles.acceptBtnText}>Chấp nhận</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          await networkApi.updateConnection(req.id, "declined");
                          setConnectionRequests((prev) => prev.filter((r) => r.id !== req.id));
                          Alert.alert("Thông báo", "Đã từ chối lời mời.");
                        } catch (err) {
                          setConnectionRequests((prev) => prev.filter((r) => r.id !== req.id));
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={isDark ? ["#1E293B", "#0F172A"] : ["#F8FAFC", "#E2E8F0"]}
                        style={[
                          styles.declineBtn,
                          {
                            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <X size={14} color={isDark ? "#94A3B8" : "#64748B"} style={{ marginRight: 4 }} />
                        <Text
                          style={[
                            styles.declineBtnText,
                            { color: isDark ? "#94A3B8" : "#64748B" },
                          ]}
                        >
                          Bỏ qua
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating AI Copilot Assistant Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 18,
          borderRadius: 24,
          overflow: "hidden",
          elevation: 6,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        }}
        onPress={() => setAiAssistantVisible(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 6,
          }}
        >
          <Sparkles size={18} color="#050C15" />
          <Text style={{ fontSize: 13, fontWeight: "800", color: "#050C15" }}>ViOne AI</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Realtime Business Notifications Modal */}
      <BusinessNotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* ViOne AI Voice & Copilot Assistant Modal */}
      <ViOneVoiceAssistantModal
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        onNavigateToTab={(tab) => navigation?.navigate(tab as any)}
      />

      {/* Global Modals */}
      <ChatThreadModal
        visible={chatModalVisible}
        thread={selectedThread}
        onClose={() => setChatModalVisible(false)}
        onMessageSent={handleMessageSent}
        onOpenProfile={handleOpenPartnerProfile}
      />

      <MemberCardBottomSheet
        visible={partnerProfileModalVisible}
        member={selectedMemberCard}
        onClose={() => setPartnerProfileModalVisible(false)}
      />

      <ContactsDiscoveryModal
        visible={contactsDiscoveryVisible}
        onClose={() => setContactsDiscoveryVisible(false)}
      />

      <CreateGroupModal
        visible={createGroupVisible}
        partners={partners}
        onClose={() => setCreateGroupVisible(false)}
        onGroupCreated={handleGroupCreated}
      />

      <StoryViewerModal
        visible={storyViewerVisible}
        story={selectedStory}
        onClose={() => setStoryViewerVisible(false)}
      />

      <CreateStoryModal
        visible={createStoryVisible}
        onClose={() => setCreateStoryVisible(false)}
        onStoryCreated={(newStory) => {
          setStories((prev) => {
            const updated = [newStory, ...prev.filter((s) => s.id !== newStory.id)];
            AsyncStorage.setItem("vione_user_stories_24h", JSON.stringify(updated.slice(0, 20))).catch(() => {});
            return updated;
          });
        }}
      />

      {/* Parity Modals: Chi Tiết Khách Hàng CRM */}
      <CustomerDetailModal
        visible={customerDetailVisible}
        customer={selectedCustomer}
        onClose={() => setCustomerDetailVisible(false)}
        onUpdateCustomer={(updated) => {
          setCustomersList((prev) =>
            prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
          );
          setSelectedCustomer(updated);
        }}
        onOpenChat={(cust) => {
          setCustomerDetailVisible(false);
          const partnerName = cust.contactPerson || cust.name;
          const partner = partners.find((p) => p.name === partnerName) || {
            id: `p-${cust.id}`,
            name: partnerName,
            company: cust.name,
            status: "connected" as const,
          };
          handleOpenChatWithPartner(partner);
        }}
        onScheduleMeeting={(cust) => {
          setCustomerDetailVisible(false);
          setSelectedPartnerForMeeting({
            name: cust.contactPerson || cust.name,
            company: cust.name,
          });
          setScheduleMeetingVisible(true);
        }}
      />

      {/* Parity Modals: Thêm Khách Hàng Tiềm Năng B2B CRM */}
      <CreateCustomerModal
        visible={createCustomerVisible}
        onClose={() => setCreateCustomerVisible(false)}
        onCustomerCreated={async (newCust: NewCustomerData) => {
          try {
            await customerApi.createCustomer({
              name: newCust.name,
              contactPerson: newCust.contactPerson,
              company: newCust.name,
              dealValue: newCust.dealValue,
              stage: newCust.stage,
              phone: newCust.phone,
              email: newCust.email,
              tags: newCust.tags,
            });
          } catch (err) {
            console.warn("Lưu khách hàng B2B lên backend:", err);
          }
          setCustomersList((prev) => [
            {
              id: newCust.id,
              name: newCust.name,
              contactPerson: newCust.contactPerson,
              role: newCust.role || "Đại diện kinh doanh",
              stage: newCust.stage,
              dealValue: newCust.dealValue,
              priority: newCust.priority,
              lastContact: "Vừa xong",
              phone: newCust.phone,
              email: newCust.email,
              tags: newCust.tags,
              lastInteraction: newCust.lastInteraction,
            } as any,
            ...prev,
          ]);
        }}
      />

      {/* Parity Modals: Lên Lịch Cuộc Hẹn 1-1 */}
      <ScheduleMeetingModal
        visible={scheduleMeetingVisible}
        partnerName={selectedPartnerForMeeting?.name}
        partnerCompany={selectedPartnerForMeeting?.company}
        onClose={() => setScheduleMeetingVisible(false)}
      />

      {/* Parity Modals: Đăng Khoảnh Khắc Doanh Nhân B2B */}
      <PostMomentModal
        visible={postMomentVisible}
        onClose={() => setPostMomentVisible(false)}
        onPostSuccess={(newMoment) => {
          setMomentsFeed((prev) => {
            const updated = [
              {
                ...newMoment,
                isLiked: false,
                likesCount: newMoment.likesCount || 1,
                commentsCount: newMoment.commentsCount || 0,
              },
              ...prev.filter((m) => m.id !== newMoment.id),
            ];
            AsyncStorage.setItem("vione_saved_moments_feed", JSON.stringify(updated.slice(0, 30))).catch(() => {});
            return updated;
          });
        }}
      />

      {/* Parity Modals: Thảo Luận & Bình Luận B2B */}
      <MomentCommentModal
        visible={momentCommentVisible}
        moment={selectedMomentForComment}
        onClose={() => setMomentCommentVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F17",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: "#0B0F17",
  },
  headerBrand: {
    justifyContent: "center",
  },
  logoWordmark: {
    width: 140,
    height: 48,
  },
  headerGreeting: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
    marginTop: -2,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerSquareBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#D8B282",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    color: "#050C15",
    fontSize: 9,
    fontWeight: "800",
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  addPersonBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#181D2A",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  boldText: {
    fontWeight: "600",
    color: "#94A3B8",
  },
  goldText: {
    color: "#D8B282",
    fontWeight: "700",
  },
  categoryTabsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 6,
    marginBottom: 12,
  },
  categoryTabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#12151F",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  categoryTabPillActive: {
    backgroundColor: "#D8B282",
    borderColor: "#D8B282",
  },
  categoryTabPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  categoryTabPillTextActive: {
    color: "#050C15",
    fontWeight: "800",
  },
  tabContent: {
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12151F",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#FFFFFF",
    padding: 0,
  },
  quickFilterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: "#181D2A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  filterPillActive: {
    backgroundColor: "rgba(216, 178, 130, 0.18)",
    borderColor: "#D8B282",
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  filterPillTextActive: {
    color: "#D8B282",
    fontWeight: "700",
  },
  storiesSection: {
    marginBottom: 20,
  },
  storiesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionHeaderSmall: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 1,
  },
  addMomentBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
  },
  addMomentText: {
    color: "#D8B282",
    fontSize: 11,
    fontWeight: "700",
  },
  storiesScroll: {
    gap: 10,
    paddingVertical: 2,
  },
  myStoryCard: {
    width: 95,
    height: 145,
    borderRadius: 14,
    backgroundColor: "#181D2A",
    borderWidth: 1.5,
    borderColor: "rgba(216, 178, 130, 0.35)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  myStoryAvatarWrap: {
    position: "relative",
    marginBottom: 8,
  },
  myStoryAddBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#D8B282",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#0B0F17",
  },
  myStoryLabel: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    textAlign: "center",
  },
  myStorySub: {
    color: "#D8B282",
    fontSize: 9.5,
    fontWeight: "600",
    marginTop: 2,
  },
  storyCard: {
    width: 105,
    height: 145,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    justifyContent: "space-between",
    padding: 8,
  },
  storyCardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  storyCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  storyCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storyCardTag: {
    backgroundColor: "rgba(10, 10, 11, 0.75)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#D8B282",
    maxWidth: 62,
  },
  storyCardTagText: {
    color: "#D8B282",
    fontSize: 8.5,
    fontWeight: "700",
  },
  storyCardBottom: {
    gap: 2,
  },
  storyAuthorName: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storyTimeAgo: {
    color: "#F6E1C3",
    fontSize: 9.5,
    fontWeight: "500",
  },
  nurtureSection: {
    marginBottom: 20,
    backgroundColor: "#12151F",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  nurtureHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  nurtureHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  nurtureTitle: {
    color: "#D8B282",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  nurtureCountBadge: {
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
  },
  nurtureCountText: {
    color: "#D8B282",
    fontSize: 9.5,
    fontWeight: "800",
  },
  nurtureListCol: {
    gap: 10,
  },
  nurtureCard: {
    backgroundColor: "#181D2A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  nurtureCardMain: {
    marginBottom: 10,
  },
  nurtureInfo: {
    gap: 2,
  },
  nurtureNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nurtureName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  nurtureTagBadge: {
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nurtureTagText: {
    color: "#D8B282",
    fontSize: 10,
    fontWeight: "600",
  },
  nurtureRole: {
    color: "#94A3B8",
    fontSize: 11.5,
  },
  nurtureReasonText: {
    color: "#F6E1C3",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
    fontWeight: "500",
  },
  nurtureActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    paddingTop: 8,
  },
  nurtureMeetBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8B282",
    paddingVertical: 6,
    borderRadius: 8,
  },
  nurtureMeetText: {
    color: "#050C15",
    fontSize: 11.5,
    fontWeight: "700",
  },
  nurtureChatBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    paddingVertical: 6,
    borderRadius: 8,
  },
  nurtureChatText: {
    color: "#D8B282",
    fontSize: 11.5,
    fontWeight: "600",
  },
  nurtureCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  listSection: {
    gap: 10,
  },
  partnerCard: {
    backgroundColor: "#12151F",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardMain: {
    flexDirection: "row",
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  partnerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  matchBadge: {
    backgroundColor: "rgba(216, 178, 130, 0.18)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#D8B282",
  },
  partnerTitle: {
    fontSize: 12,
    color: "#D8B282",
    marginTop: 2,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  partnerCompany: {
    fontSize: 11.5,
    color: "#94A3B8",
    flex: 1,
  },
  industryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#181D2A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  industryText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  chatActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8B282",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  chatActionText: {
    color: "#050C15",
    fontSize: 12,
    fontWeight: "700",
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#181D2A",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  pendingBadge: {
    backgroundColor: "#181D2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pendingBadgeText: {
    color: "#94A3B8",
    fontSize: 11,
  },
  connectBtn: {
    backgroundColor: "rgba(216, 178, 130, 0.18)",
    borderWidth: 1,
    borderColor: "#D8B282",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectBtnText: {
    color: "#D8B282",
    fontSize: 11,
    fontWeight: "700",
  },
  pipelineSummaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  pipelineCard: {
    flex: 1,
    backgroundColor: "#12151F",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
  },
  pipelineNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
  },
  pipelineLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  customerCard: {
    backgroundColor: "#12151F",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
    marginBottom: 10,
  },
  customerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  priorityPill: {
    backgroundColor: "rgba(216, 178, 130, 0.18)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#D8B282",
  },
  customerContact: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  customerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  dealPill: {
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dealText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#38BDF8",
  },
  customerStage: {
    fontSize: 11,
    color: "#D8B282",
    fontWeight: "600",
  },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(216, 178, 130, 0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    padding: 14,
    marginBottom: 14,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D8B282",
  },
  aiBannerSubtitle: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  aiBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiExploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 2,
  },
  aiExploreText: {
    fontSize: 11.5,
    fontWeight: "700",
  },
  connectBtnFull: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8B282",
    paddingVertical: 10,
    borderRadius: 10,
  },
  connectBtnFullText: {
    color: "#050C15",
    fontSize: 12.5,
    fontWeight: "700",
  },
  inboxActionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  inboxSearchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12151F",
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inboxSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: "#FFFFFF",
    paddingVertical: 8,
  },
  createGroupBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8B282",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  createGroupText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#050C15",
  },
  categoryTabsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  categoryTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#181D2A",
  },
  categoryTabActive: {
    backgroundColor: "rgba(216, 178, 130, 0.2)",
    borderWidth: 1,
    borderColor: "#D8B282",
  },
  categoryTabText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#D8B282",
    fontWeight: "700",
  },
  centerLoading: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
  },
  emptyInboxBox: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
  threadItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12151F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  threadItemUnread: {
    borderColor: "rgba(216, 178, 130, 0.35)",
    backgroundColor: "#161B29",
  },
  threadAvatarWrap: {
    position: "relative",
    marginRight: 12,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#0B0F17",
  },
  threadBody: {
    flex: 1,
  },
  threadHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  threadName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    maxWidth: 180,
  },
  threadNameBold: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
  threadGroupTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
    gap: 2,
  },
  threadGroupTagText: {
    fontSize: 9,
    color: "#D8B282",
    fontWeight: "700",
  },
  threadTime: {
    fontSize: 10.5,
    color: "#94A3B8",
  },
  threadPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  threadPreviewText: {
    fontSize: 12,
    color: "#94A3B8",
    flex: 1,
    marginRight: 8,
  },
  threadPreviewTextUnread: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  unreadCounter: {
    backgroundColor: "#D8B282",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  unreadCounterText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#050C15",
  },
  requestCard: {
    backgroundColor: "#12151F",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  requestActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8B282",
    paddingVertical: 8,
    borderRadius: 10,
  },
  acceptBtnText: {
    color: "#050C15",
    fontSize: 12,
    fontWeight: "700",
  },
  declineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181D2A",
    paddingVertical: 8,
    borderRadius: 10,
  },
  declineBtnText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  floatingAiBtn: {
    position: "absolute",
    bottom: 24,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8B282",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  floatingAiText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#050C15",
  },
});

