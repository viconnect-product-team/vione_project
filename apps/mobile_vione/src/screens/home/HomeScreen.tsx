import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  Dimensions,
  Linking,
  Animated,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  Sparkles,
  X,
  Mic,
  Users,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../../api/client";
import { StickyBrandHeader } from "../../components/common/StickyBrandHeader";
import { CreateCommunityGroupModal } from "../../components/CreateCommunityGroupModal";
import { MyQrModal } from "../quick-connect/MyQrModal";
import { ScanQrModal } from "../quick-connect/ScanQrModal";
import { AttendanceModal } from "../../components/AttendanceModal";
import { WorkflowModal } from "../../components/WorkflowModal";
import { ApprovalsModal } from "../../components/ApprovalsModal";
import { ScheduleMeetingModal } from "../../components/ScheduleMeetingModal";
import { CardScanReviewModal } from "../../components/CardScanReviewModal";
import { EventDetailModal } from "../../components/EventDetailModal";
import { StaffDailyActivityModal } from "../../components/StaffDailyActivityModal";
import { AssignTaskModal } from "../../components/AssignTaskModal";
import { MemberCardBottomSheet } from "../../components/MemberCardBottomSheet";
import { PostMomentModal } from "../../components/PostMomentModal";
import { BusinessNotificationsModal } from "../../components/BusinessNotificationsModal";
import { ViOneVoiceAssistantModal } from "../../components/ai/ViOneVoiceAssistantModal";
import { OpportunityDetailModal, CommunityOpportunityItem } from "../../components/OpportunityDetailModal";
import { ContactsDiscoveryModal } from "../../components/ContactsDiscoveryModal";
import { TodayCustomizeSheet, TodayPreferences, DEFAULT_TODAY_PREFERENCES } from "../../components/TodayCustomizeSheet";
import { ScheduleCalendarModal } from "../../components/ScheduleCalendarModal";
import { meApi, eventsApi, meetingsApi, networkApi, opportunityApi } from "../../api";

import {
  AiPartnerItem,
  VoiceMomentItem,
  TodayMeetingItem,
  HomeScreenProps,
  INITIAL_TODAY_OPPORTUNITIES,
  INITIAL_TODAY_MEETINGS,
} from "./components/home.types";
import { styles } from "./components/home.styles";
import { EntrepreneurCard } from "./components/EntrepreneurCard";
import { TodayEditorialSection } from "./components/TodayEditorialSection";
import { ExecutiveCenterSection } from "./components/ExecutiveCenterSection";
import { AiPartnersSection } from "./components/AiPartnersSection";

export {
  AiPartnerItem,
  VoiceMomentItem,
  TodayMeetingItem,
  HomeScreenProps,
};

const HOME_STORIES = [
  {
    id: "st-1",
    name: "Vũ Minh Tuấn",
    title: "Chủ tịch HĐQT",
    company: "Tập đoàn VTech",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    caption: "Ký kết thỏa thuận hợp tác phân phối độc quyền tại Diễn đàn Kinh tế 2026.",
  },
  {
    id: "st-2",
    name: "Hoàng Mai Anh",
    title: "Giám đốc Tài chính",
    company: "VNPay FinTech",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    caption: "Chuyến công tác thẩm định dự án năng lượng tái tạo tại Hải Phòng.",
  },
  {
    id: "st-3",
    name: "Trần Đức Nam",
    title: "Tổng Giám đốc",
    company: "Nam Phát Logistics",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    caption: "Khai trương trung tâm kho bãi thông minh 10.000m2 tại Bắc Ninh.",
  },
  {
    id: "st-4",
    name: "Lê Thu Hương",
    title: "CEO & Founder",
    company: "EcoWear Global",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    caption: "Ra mắt bộ sưu tập thời trang doanh nhân xanh tuần lễ thời trang ASEAN.",
  },
  {
    id: "st-5",
    name: "Phạm Quốc Huy",
    title: "Viện trưởng",
    company: "Viện Đổi mới B2B",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    caption: "Bàn tròn chuyển đổi số doanh nghiệp vừa và nhỏ quý IV.",
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, onOpenV }) => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "all" | "upcoming" | "reminders" | "voice_moments">("all");

  // Quyền truy cập chấm công & ký duyệt: Chỉ xuất hiện khi có cộng đồng công ty có nhân sự
  const [hasCompanyWithStaff, setHasCompanyWithStaff] = useState<boolean>(false);

  // Quyền gói cộng đồng / Dùng thử 30 ngày: Chỉ khi có gói mới hiện phân hệ giao việc trên trang chủ
  const [hasCommunityPlan, setHasCommunityPlan] = useState<boolean>(false);
  const [createCommunityVisible, setCreateCommunityVisible] = useState<boolean>(false);

  // Thông báo tìm bạn bè từ danh bạ điện thoại (giống Zalo)
  const [contactsBannerDismissed, setContactsBannerDismissed] = useState<boolean>(false);
  const [contactsDiscoveryVisible, setContactsDiscoveryVisible] = useState<boolean>(false);

  // Location permission state
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(true);
  const [requestingLocation, setRequestingLocation] = useState<boolean>(false);

  // Today Briefing Preferences (Matching 100% PWA TodayCustomizeSheet)
  const [todayPrefs, setTodayPrefs] = useState<TodayPreferences>(DEFAULT_TODAY_PREFERENCES);
  const [todayCustomizeVisible, setTodayCustomizeVisible] = useState(false);

  // Modals state
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [myQrVisible, setMyQrVisible] = useState(false);
  const [scanQrVisible, setScanQrVisible] = useState(false);
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [approvalsVisible, setApprovalsVisible] = useState(false);
  const [staffDailyModalVisible, setStaffDailyModalVisible] = useState(false);
  const [assignTaskModalVisible, setAssignTaskModalVisible] = useState(false);
  const [scheduleMeetingVisible, setScheduleMeetingVisible] = useState(false);
  const [selectedPartnerForMeeting, setSelectedPartnerForMeeting] = useState<{ name: string; company: string } | null>(null);
  const [cardScanReviewVisible, setCardScanReviewVisible] = useState(false);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<any | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [memberCardModalVisible, setMemberCardModalVisible] = useState(false);
  const [postMomentVisible, setPostMomentVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [showFloatingAi, setShowFloatingAi] = useState(true);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  const [opportunityDetailModalVisible, setOpportunityDetailModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CommunityOpportunityItem | null>(null);

  // Filters for AI suggestions
  const [distanceFilter, setDistanceFilter] = useState<"all" | "near" | "city" | "national">("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  // Dynamic data lists
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [aiSuggestedPartners, setAiSuggestedPartners] = useState<AiPartnerItem[]>([]);
  const [todayPool, setTodayPool] = useState<any[]>([]);
  const [todayOpportunities, setTodayOpportunities] = useState<CommunityOpportunityItem[]>(INITIAL_TODAY_OPPORTUNITIES);
  const [todayMeetings, setTodayMeetings] = useState<any[]>(INITIAL_TODAY_MEETINGS);

  // Voice moments audio player simulation
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceMomentsList, setVoiceMomentsList] = useState<VoiceMomentItem[]>([]);
  const [selectedOpportunityForAi, setSelectedOpportunityForAi] = useState<any | null>(null);

  const togglePlayVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => {
        setPlayingVoiceId((prev) => (prev === id ? null : prev));
      }, 5000);
    }
  };

  const handleRequestLocation = () => {
    setRequestingLocation(true);
    setTimeout(() => {
      setRequestingLocation(false);
      setHasLocationPermission(true);
      Alert.alert(
        "Định vị AI",
        "Đã bật chia sẻ vị trí thành công! Trợ lý AI ViOne đã sẵn sàng tìm kiếm đối tác quanh bạn."
      );
    }, 600);
  };

  // Load live data from API
  const loadData = async () => {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    try {
      // 1. Identity & profile cover/avatar from NestJS API
      const identRes = await meApi.getIdentity();
      if (identRes?.data?.identity) {
        const iden = identRes.data.identity;
        updateUser({
          displayName: iden.displayName || user?.displayName,
          name: iden.displayName || user?.name,
          title: iden.jobTitle || iden.headline || user?.title,
          company: iden.companyName || user?.company,
          avatarUrl: iden.avatarUrl || user?.avatarUrl,
          coverUrl: iden.coverUrl || user?.coverUrl,
          phone: iden.primaryPhone || user?.phone,
        });
      }
    } catch {}

    try {
      // 2. Unread notifications
      const notifRes = await meApi.getUnreadNotificationCount();
      if (notifRes?.data?.count !== undefined) {
        setUnreadNotificationsCount(notifRes.data.count);
      }
    } catch {}

    try {
      // 2. Events from NestJS API
      const eventsRes = await eventsApi.getEvents();
      const eventsList = Array.isArray(eventsRes?.data)
        ? eventsRes.data
        : (eventsRes?.data as any)?.items || [];

      if (eventsList.length > 0) {

        const mapped = eventsList.map((ev: any) => {
          const rawDate = ev.date || ev.startDate || ev.startsAt || ev.start_date;
          const dt = rawDate ? new Date(rawDate) : null;
          return {
            id: String(ev.id),
            title: ev.title || ev.name || "Sự kiện kết nối Doanh nghiệp",
            imageUrl: ev.imageUrl || ev.coverUrl || ev.bannerUrl || ev.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
            date: dt ? dt.toLocaleDateString("vi-VN") : "Hôm nay",
            time: dt ? dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "09:30",
            location: ev.location || ev.venue || "Hội trường ViOne Connect",
            community: ev.associationName || ev.communityName || "CLB Doanh Nhân ViOne",
            dt,
          };
        });

        // Filter upcoming events (future dates)
        const upcoming = mapped.filter((ev: any) => ev.dt && ev.dt > todayEnd);
        setUpcomingEvents(upcoming.length > 0 ? upcoming : mapped.slice(0, 5));

        // Filter today events
        const todayEvents = mapped.filter((ev: any) => {
          if (!ev.dt) return false;
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return ev.dt >= start && ev.dt <= todayEnd;
        });
        setTodayPool(todayEvents);
      }
    } catch {}

    try {
      // 3. Meetings from NestJS API
      const meetingsRes = await meetingsApi.getMeetings();
      const meetingsList = Array.isArray(meetingsRes?.data)
        ? meetingsRes.data
        : (meetingsRes?.data as any)?.items || [];

      if (meetingsList.length > 0) {
        const mappedMeets = meetingsList.map((m: any) => {
          const rawDate = m.meetingDate || m.scheduled_start_at || m.date || m.time;
          const dt = rawDate ? new Date(rawDate) : null;
          const isOnline =
            m.locationType === "online" ||
            m.format === "online" ||
            (m.locationName && m.locationName.toLowerCase().includes("meet"));

          return {
            id: String(m.id),
            title: m.title || `Cuộc gặp 1-1: ${m.partnerName || m.counterpart || "Doanh nhân Đối tác"}`,
            counterpart: m.partnerName || m.counterpart || "Doanh nhân Đối tác",
            phone: m.phone || m.partnerPhone || "0988 888 888",
            date: dt ? dt.toLocaleDateString("vi-VN") : "Hôm nay",
            time: dt ? dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : (m.time || "14:30"),
            location: isOnline
              ? "Google Meet Trực Tuyến"
              : m.locationName || m.location || "Trụ sở ViOne Connect",
            format: isOnline ? "online" : "offline",
            type: "meeting",
            status: m.status || "confirmed",
            dt,
          };
        });

        setRemindersList(mappedMeets);

        // Filter today meetings
        const todayMeets = mappedMeets.filter((m: any) => {
          if (!m.dt) return true;
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return m.dt >= start && m.dt <= todayEnd;
        });
        setTodayMeetings(todayMeets.length > 0 ? todayMeets : INITIAL_TODAY_MEETINGS);
      } else {
        setRemindersList([]);
        setTodayMeetings(INITIAL_TODAY_MEETINGS);
      }
    } catch {
      setTodayMeetings(INITIAL_TODAY_MEETINGS);
    }

    try {
      // 4. Opportunities from Community API
      const oppRes = await opportunityApi.getOpportunities();
      const oppList = Array.isArray(oppRes?.data)
        ? oppRes.data
        : (oppRes?.data as any)?.items || (Array.isArray(oppRes) ? oppRes : []);
      if (oppList.length > 0) {
        setTodayOpportunities(
          oppList.map((op: any, idx: number): CommunityOpportunityItem => ({
            id: String(op.id || `opp-${idx}`),
            title: op.title || "Cơ hội hợp tác chiến lược & giao thương",
            organization: op.organization || op.companyName || op.creatorName || "Tập đoàn Đối tác ViOne",
            communityName: op.communityName || op.groupName || "Liên minh Doanh Nhân B2B",
            dealValue: op.dealValue || (op.budget ? `${op.budget.toLocaleString("vi-VN")} VNĐ` : "Thỏa thuận"),
            category: op.category || op.field || "Hợp tác & Đầu tư",
            daysLeft: op.daysLeft || op.duration || "Còn 14 ngày",
            interested: !!op.interested,
          }))
        );
      } else {
        setTodayOpportunities(INITIAL_TODAY_OPPORTUNITIES);
      }
    } catch {
      setTodayOpportunities(INITIAL_TODAY_OPPORTUNITIES);
    }

    try {
      // 5. AI Recommendations from NestJS API
      const recoRes = await networkApi.getTodayRecommendations();
      const recoList = Array.isArray(recoRes?.data) ? recoRes.data : [];
      if (recoList.length > 0) {
        setAiSuggestedPartners(
          recoList.map((r: any, idx: number): AiPartnerItem => ({
            id: r.id || `reco-${idx}`,
            name: r.name || r.displayName || "Doanh nhân đối tác",
            title: r.title || r.headline || "Lãnh đạo Doanh nghiệp",
            company: r.company || r.companyName || "Tập đoàn Đối tác",
            industry: r.industry || "Kinh doanh & Đầu tư",
            industryKey: r.industryKey || "tech",
            location: r.location || "Hà Nội",
            distanceTier: r.distanceTier || "near",
            suggestion: r.suggestion || r.reason || "Tìm thấy tiềm năng hợp tác chiến lược giữa hai doanh nghiệp",
            matchScore: r.matchScore || "92% phù hợp B2B",
            initial: (r.name || r.displayName || "V").trim().slice(-1).toUpperCase(),
          }))
        );
      } else {
        setAiSuggestedPartners([]);
      }
    } catch {}

    try {
      // 6. Kiểm tra quyền hiển thị Chấm công, Ký duyệt & Gói cộng đồng giao việc
      const cachedSub = await AsyncStorage.getItem("vione_community_subscription_active");
      if (cachedSub === "true") {
        setHasCommunityPlan(true);
      }

      const staffStatusRes = await apiRequest<{
        ok?: boolean;
        hasCompanyWithStaff?: boolean;
        hasCommunityPlan?: boolean;
      }>("connect-app/community/company-staff-status");

      if (staffStatusRes?.data) {
        if (typeof staffStatusRes.data.hasCompanyWithStaff === "boolean") {
          setHasCompanyWithStaff(staffStatusRes.data.hasCompanyWithStaff);
        }
        if (staffStatusRes.data.hasCommunityPlan) {
          setHasCommunityPlan(true);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Formatted date in Vietnamese
  const getFormattedDate = () => {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${dayName}, ${dd} Tháng ${mm}`;
  };

  const getInitial = (name?: string | null) => {
    if (!name) return "A";
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return "A";
    return words[words.length - 1][0].toUpperCase();
  };

  const displayName = user?.displayName || user?.name || "Doanh nhân ViOne";
  const userPhone = user?.phone || "";
  const avatarInitial = getInitial(displayName);

  // Filter AI partners by distance and industry
  const filteredAiPartners = useMemo(() => {
    return aiSuggestedPartners.filter((p) => {
      if (distanceFilter !== "all") {
        if (distanceFilter === "near" && p.distanceTier !== "near") return false;
        if (distanceFilter === "city" && p.distanceTier !== "near" && p.distanceTier !== "city") return false;
        if (distanceFilter === "national" && p.distanceTier !== "national") return false;
      }
      if (industryFilter !== "all") {
        if (p.industryKey !== industryFilter) return false;
      }
      return true;
    });
  }, [aiSuggestedPartners, distanceFilter, industryFilter]);

  const todayTotalCount = todayPool.length + todayMeetings.length + todayOpportunities.length;
  const allTotalCount = todayMeetings.length + todayOpportunities.length + upcomingEvents.length;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#0B0F17" : "#FFFFFF" },
      ]}
      edges={["top"]}
    >
      {/* Top Sticky Header — Khớp 100% PWA ExecutiveHome */}
      <StickyBrandHeader
        rightActions={
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
            {unreadNotificationsCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D8B282"
            colors={["#D8B282"]}
          />
        }
      >
        {/* 1. Thẻ Doanh Nhân ViOne */}
        <EntrepreneurCard
          isDark={isDark}
          user={user}
          hasLocationPermission={hasLocationPermission}
          requestingLocation={requestingLocation}
          handleRequestLocation={handleRequestLocation}
          setMemberCardModalVisible={setMemberCardModalVisible}
          setTodayCustomizeVisible={setTodayCustomizeVisible}
        />

        {/* Dải Khoảnh Khắc Doanh Nhân 24h (Stories Strip) — Đồng bộ 100% với PWA */}
        <View style={{ marginTop: 14, marginBottom: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Sparkles size={15} color="#D8B282" />
              <Text style={{ fontSize: 13, fontWeight: "800", color: isDark ? "#FFFFFF" : "#0F172A", letterSpacing: 0.2 }}>
                Khoảnh khắc doanh nhân 24h
              </Text>
            </View>
            <TouchableOpacity onPress={() => setPostMomentVisible(true)} activeOpacity={0.7}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#D8B282" }}>+ Đăng tin</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 2 }}>
            {/* My Story Add Button */}
            <TouchableOpacity
              onPress={() => setPostMomentVisible(true)}
              style={{ alignItems: "center", width: 68 }}
              activeOpacity={0.8}
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    borderWidth: 2,
                    borderColor: "#D8B282",
                    padding: 2,
                    backgroundColor: isDark ? "#121A26" : "#FAF8F5",
                  }}
                >
                  <Image
                    source={{ uri: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }}
                    style={{ width: "100%", height: "100%", borderRadius: 26 }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#DFB76C",
                    borderWidth: 2,
                    borderColor: isDark ? "#0B0F17" : "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#050C15", fontSize: 13, fontWeight: "900", lineHeight: 15 }}>+</Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: isDark ? "#E2E8F0" : "#1E293B",
                  marginTop: 5,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                Tin của bạn
              </Text>
            </TouchableOpacity>

            {/* Partner Stories */}
            {HOME_STORIES.map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => {
                  Alert.alert(`Khoảnh khắc: ${st.name}`, `${st.title} · ${st.company}\n\n"${st.caption}"`);
                }}
                style={{ alignItems: "center", width: 68 }}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    borderWidth: 2,
                    borderColor: "#DFB76C",
                    padding: 2,
                    backgroundColor: isDark ? "#121A26" : "#FAF8F5",
                  }}
                >
                  <Image
                    source={{ uri: st.avatarUrl }}
                    style={{ width: "100%", height: "100%", borderRadius: 26 }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "500",
                    color: isDark ? "#CBD5E1" : "#334155",
                    marginTop: 5,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {st.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Banner Khám Phá Bạn Bè Từ Danh Bạ (Zalo-style) */}
        {!contactsBannerDismissed && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 16,
              marginTop: 14,
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
                  Phát hiện 3 liên hệ trong danh bạ đang dùng ViOne
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

        {/* 2. Phân Hệ HÔM NAY */}
        <TodayEditorialSection
          onOpenV={onOpenV}
          setTodayCustomizeVisible={setTodayCustomizeVisible}
          isDark={isDark}
          navigation={navigation}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          todayMeetings={todayMeetings}
          todayOpportunities={todayOpportunities}
          todayPool={todayPool}
          upcomingEvents={upcomingEvents}
          remindersList={remindersList}
          voiceMomentsList={voiceMomentsList}
          playingVoiceId={playingVoiceId}
          togglePlayVoice={togglePlayVoice}
          todayPrefs={todayPrefs}
          setSelectedEventForDetail={setSelectedEventForDetail}
          setEventDetailModalVisible={setEventDetailModalVisible}
          setSelectedOpportunity={setSelectedOpportunity}
          setOpportunityDetailModalVisible={setOpportunityDetailModalVisible}
          setSelectedPartnerForMeeting={setSelectedPartnerForMeeting}
          setScheduleMeetingVisible={setScheduleMeetingVisible}
          setSelectedOpportunityForAi={setSelectedOpportunityForAi}
          setAiAssistantVisible={setAiAssistantVisible}
          setCalendarModalVisible={setCalendarModalVisible}
          setPostMomentVisible={setPostMomentVisible}
        />

        {/* 3 & 4 & 5. Phân Hệ Điều Hành C-Level & Giao Việc: Chỉ hiển thị khi có Gói Cộng Đồng */}
        {hasCommunityPlan ? (
          <ExecutiveCenterSection
            isDark={isDark}
            navigation={navigation}
            hasCompanyWithStaff={hasCompanyWithStaff}
            setSelectedPartnerForMeeting={setSelectedPartnerForMeeting}
            setCardScanReviewVisible={setCardScanReviewVisible}
            setMemberCardModalVisible={setMemberCardModalVisible}
            setScheduleMeetingVisible={setScheduleMeetingVisible}
            setScanQrVisible={setScanQrVisible}
            setMyQrVisible={setMyQrVisible}
            setAttendanceVisible={setAttendanceVisible}
            setWorkflowVisible={setWorkflowVisible}
            setApprovalsVisible={setApprovalsVisible}
            setAiAssistantVisible={setAiAssistantVisible}
          />
        ) : (
          <View
            style={{
              marginTop: 18,
              marginBottom: 4,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: "rgba(216, 178, 130, 0.4)",
              overflow: "hidden",
              backgroundColor: isDark ? "#121A28" : "#FFFFFF",
            }}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(216, 178, 130, 0.2)", "rgba(11, 15, 23, 0.95)"]
                  : ["#FFF9F0", "#FFFFFF"]
              }
              style={{ padding: 18 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "rgba(216, 178, 130, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={16} color="#DFB76C" />
                  </View>
                  <Text style={{ fontSize: 11.5, fontWeight: "800", color: "#DFB76C", letterSpacing: 0.6 }}>
                    GÓI CỘNG ĐỒNG VI-ONE · DÙNG THỬ 30 NGÀY FREE
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: "800", color: "#10B981" }}>0đ / 30 ngày</Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  marginBottom: 6,
                }}
              >
                Mở Khóa Phân Hệ Giao Việc & Điều Hành
              </Text>

              <Text
                style={{
                  fontSize: 12.5,
                  lineHeight: 18,
                  color: isDark ? "#94A3B8" : "#64748B",
                  marginBottom: 16,
                }}
              >
                Theo cơ chế bản quyền ViOne, phân hệ giao việc và điều hành chỉ kích hoạt khi tài khoản sở hữu cộng đồng. Đăng ký khởi tạo cộng đồng của bạn ngay hôm nay để nhận 30 ngày trải nghiệm miễn phí trọn bộ: Giao việc & Nhận việc 1-chạm, Giám sát CRM, Cơ hội B2B & Lịch họp!
              </Text>

              <TouchableOpacity
                onPress={() => setCreateCommunityVisible(true)}
                activeOpacity={0.85}
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 13,
                    paddingHorizontal: 16,
                    gap: 8,
                  }}
                >
                  <Sparkles size={16} color="#050C15" />
                  <Text style={{ fontSize: 13.5, fontWeight: "800", color: "#050C15" }}>
                    + Tạo cộng đồng & Dùng thử 30 ngày free
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* 6. Khối Đối Tác Khuyên Dùng (AI) */}
        <AiPartnersSection
          isDark={isDark}
          navigation={navigation}
          distanceFilter={distanceFilter}
          setDistanceFilter={setDistanceFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          filteredAiPartners={filteredAiPartners}
          setSelectedPartnerForMeeting={setSelectedPartnerForMeeting}
          setScheduleMeetingVisible={setScheduleMeetingVisible}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals hỗ trợ kết nối & nghiệp vụ */}
      <MyQrModal visible={myQrVisible} onClose={() => setMyQrVisible(false)} />
      <ScanQrModal visible={scanQrVisible} onClose={() => setScanQrVisible(false)} />
      <AttendanceModal visible={attendanceVisible} onClose={() => setAttendanceVisible(false)} />
      <WorkflowModal visible={workflowVisible} onClose={() => setWorkflowVisible(false)} />
      <StaffDailyActivityModal visible={staffDailyModalVisible} onClose={() => setStaffDailyModalVisible(false)} />
      <AssignTaskModal
        visible={assignTaskModalVisible}
        onClose={() => setAssignTaskModalVisible(false)}
        communityId="c-vione-internal"
      />
      <ScheduleMeetingModal
        visible={scheduleMeetingVisible}
        partnerName={selectedPartnerForMeeting?.name}
        partnerCompany={selectedPartnerForMeeting?.company}
        onClose={() => setScheduleMeetingVisible(false)}
      />
      <CardScanReviewModal
        visible={cardScanReviewVisible}
        onClose={() => setCardScanReviewVisible(false)}
        onSaveContact={() => setCardScanReviewVisible(false)}
      />
      <EventDetailModal
        visible={eventDetailModalVisible}
        event={selectedEventForDetail}
        onClose={() => setEventDetailModalVisible(false)}
      />
      <MemberCardBottomSheet
        visible={memberCardModalVisible}
        onClose={() => setMemberCardModalVisible(false)}
        onOpenMyQr={() => setMyQrVisible(true)}
        onOpenNfc={() => Alert.alert("Chạm thẻ NFC", "Đưa điện thoại lại gần thẻ doanh nhân thông minh ViOne để kết nối.")}
        onOpenProfile={() => navigation?.navigate("Me")}
      />
      <PostMomentModal
        visible={postMomentVisible}
        onClose={() => setPostMomentVisible(false)}
        onPostSuccess={() => {
          setPostMomentVisible(false);
          loadData();
        }}
      />
      <BusinessNotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
      <ViOneVoiceAssistantModal
        visible={aiAssistantVisible}
        initialOpportunity={selectedOpportunityForAi}
        onClose={() => {
          setAiAssistantVisible(false);
          setSelectedOpportunityForAi(null);
        }}
        onNavigateToTab={(tab) => navigation?.navigate(tab as any)}
        onOpenMyQr={() => setMyQrVisible(true)}
        onOpenScanQr={() => setScanQrVisible(true)}
        onOpenAssignTask={() => setAssignTaskModalVisible(true)}
        onOpenStaffActivity={() => setStaffDailyModalVisible(true)}
        onOpenAttendance={() => setAttendanceVisible(true)}
        onOpenCalendar={() => setCalendarModalVisible(true)}
        onOpenNotifications={() => setNotificationsVisible(true)}
        onOpenWorkflow={() => setWorkflowVisible(true)}
        onOpenApprovals={() => setApprovalsVisible(true)}
      />
      <OpportunityDetailModal
        visible={opportunityDetailModalVisible}
        opportunity={selectedOpportunity}
        onClose={() => setOpportunityDetailModalVisible(false)}
        onGoToCommunity={() => {
          setOpportunityDetailModalVisible(false);
          navigation?.navigate("Community");
        }}
      />
      <ContactsDiscoveryModal
        visible={contactsDiscoveryVisible}
        onClose={() => setContactsDiscoveryVisible(false)}
      />

      {/* Floating AI Assistant Copilot Button (Draggable & Closable) */}
      {showFloatingAi && (
        <Animated.View
          style={[
            styles.floatingAiBtn,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
              backgroundColor: isDark ? "#12151F" : "#FFFFFF",
              borderColor: isDark ? "rgba(216, 178, 130, 0.4)" : "rgba(216, 178, 130, 0.6)",
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setAiAssistantVisible(true)}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} color={isDark ? "#D8B282" : "#A3703C"} />
              <View style={styles.floatingAiPing} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingAiCloseBadge}
            onPress={() => setShowFloatingAi(false)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <X size={9} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Modal Tuỳ chỉnh hiển thị thẻ Hôm Nay (Matching 100% PWA) */}
      <TodayCustomizeSheet
        visible={todayCustomizeVisible}
        onClose={() => setTodayCustomizeVisible(false)}
        prefs={todayPrefs}
        onChange={setTodayPrefs}
        onReset={() => setTodayPrefs(DEFAULT_TODAY_PREFERENCES)}
      />

      {/* Modal Lịch Hoạt Động & Cuộc Gặp (Matching 100% PWA /connect-app/calendar) */}
      <ScheduleCalendarModal
        visible={calendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        onOpenScheduleMeeting={() => {
          setSelectedPartnerForMeeting(null);
          setScheduleMeetingVisible(true);
        }}
        onSelectEvent={(evt) => {
          setSelectedEventForDetail({
            id: evt.id,
            title: evt.title,
            name: evt.title,
            time: evt.time,
            date: evt.date,
            location: evt.location,
            venue: evt.location,
            description: evt.notes,
            status: evt.status,
            type: evt.kind,
            communityName: evt.company || "Cộng đồng Doanh nhân ViOne",
          });
          setEventDetailModalVisible(true);
        }}
      />

      {/* Modal Tạo Cộng Đồng Dùng Thử 30 Ngày Free */}
      <CreateCommunityGroupModal
        visible={createCommunityVisible}
        onClose={() => setCreateCommunityVisible(false)}
        onGroupCreated={() => {
          setHasCommunityPlan(true);
          loadData();
        }}
      />
    </SafeAreaView>
  );
};

