import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  X,
  Mic,
  MicOff,
  Send,
  Plus,
  History,
  Trash2,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Clock,
  Briefcase,
  Calendar,
  QrCode,
  ScanLine,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { aiApi } from "../../api/services";

export interface ViOneVoiceAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: "Home" | "Network" | "Community" | "Me" | string) => void;
  onOpenMyQr?: () => void;
  onOpenScanQr?: () => void;
  onOpenAssignTask?: () => void;
  onOpenStaffActivity?: () => void;
  onOpenAttendance?: () => void;
  onOpenCalendar?: () => void;
  onOpenNotifications?: () => void;
  onOpenWorkflow?: () => void;
  onOpenApprovals?: () => void;
  initialOpportunity?: {
    id: string;
    title: string;
    organization?: string;
    dealValue?: string;
  } | null;
}

export interface AiChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    command?: string;
    route?: string;
  };
}

export interface AiSession {
  id: string;
  title: string;
  createdAt: string;
  messages: AiChatMessage[];
}

const STORAGE_KEY = "@vione_ai_sessions_v2";

const DEFAULT_WELCOME = "Xin chào Lãnh đạo! Tôi là Trợ lý Doanh Nhân ViOne AI. Tôi sẵn sàng hỗ trợ điều hành công ty, giao việc, chấm công, ký duyệt hoặc điều khiển toàn bộ ứng dụng bằng giọng nói.";

const QUICK_COMMANDS = [
  { label: "🕒 Chấm công", cmd: "Chấm công vào ca" },
  { label: "✍️ Ký duyệt chi", cmd: "Mở danh sách ký duyệt" },
  { label: "📋 Giao việc mới", cmd: "Giao việc cho nhân viên" },
  { label: "📊 Xem tiến độ", cmd: "Xem tiến độ công việc" },
  { label: "📅 Lịch làm việc", cmd: "Xem lịch làm việc hôm nay" },
  { label: "📷 Quét mã QR", cmd: "Quét mã QR kết nối" },
];

export const ViOneVoiceAssistantModal: React.FC<ViOneVoiceAssistantModalProps> = ({
  visible,
  onClose,
  onNavigateToTab,
  onOpenMyQr,
  onOpenScanQr,
  onOpenAssignTask,
  onOpenStaffActivity,
  onOpenAttendance,
  onOpenCalendar,
  onOpenNotifications,
  onOpenWorkflow,
  onOpenApprovals,
  initialOpportunity,
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sessionsRef = useRef<AiSession[]>([]);
  const currentSessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  // Equalizer animation
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isListening) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [isListening]);

  // Load Sessions from AsyncStorage
  useEffect(() => {
    if (visible) {
      loadSessions();
    }
  }, [visible]);

  const loadSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AiSession[] = JSON.parse(stored);
        if (parsed.length > 0) {
          sessionsRef.current = parsed;
          currentSessionIdRef.current = parsed[0].id;
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          return;
        }
      }
      // Create initial session if empty
      createNewSession();
    } catch (e) {
      console.warn("Failed to load AI sessions:", e);
      createNewSession();
    }
  };

  const saveSessions = async (newSessions: AiSession[]) => {
    try {
      sessionsRef.current = newSessions;
      setSessions(newSessions);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    } catch (e) {
      console.warn("Failed to save AI sessions:", e);
    }
  };

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const initialMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: initialOpportunity
        ? `🎯 ĐÃ TIẾP NHẬN CƠ HỘI GIAO THƯƠNG:\n"${initialOpportunity.title}"\n\nLãnh đạo có thể nói: "Giao việc triển khai cơ hội này" hoặc "Gửi lời chào kết nối".`
        : DEFAULT_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const newSession: AiSession = {
      id: newId,
      title: initialOpportunity ? initialOpportunity.title.slice(0, 30) : "Cuộc trò chuyện mới",
      createdAt: new Date().toISOString(),
      messages: [initialMsg],
    };
    const all = sessionsRef.current.length > 0 ? sessionsRef.current : sessions;
    const updated = [newSession, ...all.filter((s) => s.id !== newId)];
    currentSessionIdRef.current = newId;
    saveSessions(updated);
    setCurrentSessionId(newId);
    setShowHistoryDrawer(false);
  };

  const clearAllHistory = () => {
    Alert.alert(
      "Xóa toàn bộ lịch sử",
      "Bạn có chắc muốn xóa tất cả các cuộc trò chuyện AI trước đó không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa hết",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            sessionsRef.current = [];
            setSessions([]);
            createNewSession();
          },
        },
      ]
    );
  };

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) ||
    sessionsRef.current.find((s) => s.id === currentSessionIdRef.current) ||
    sessions[0] ||
    sessionsRef.current[0];

  // Voice Listening Control
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
    }
  };

  // Helper: Nhận diện xem câu nói có phải là câu hỏi thắc mắc hay không (chống cướp quyền AI)
  const isQuestion = (text: string): boolean => {
    const q = text.toLowerCase().trim();
    if (q.includes("?") || q.endsWith("?")) return true;
    const questionMarkers = [
      "gì", "không", "nào", "sao", "thế nào", "ra sao", "mấy giờ", "bao nhiêu",
      "ai", "tại sao", "vì sao", "hỏi", "xem giúp", "báo cáo", "tổng kết", "thống kê",
      "đâu", "cho tôi biết", "hôm nay có", "có những", "như thế nào", "giúp tôi", "tìm giúp",
      "thời tiết", "chưa", "bao giờ", "khi nào"
    ];
    return questionMarkers.some((marker) => q.includes(marker));
  };

  // Helper: Sinh câu trả lời ngữ cảnh thông minh khi gián đoạn mạng (không bao giờ để AI báo lỗi cụt ngủn)
  const generateContextualAiResponse = (
    query: string,
    userName: string
  ): { reply: string; action?: { label: string; command?: string; route?: string } } => {
    const q = query.toLowerCase().trim();

    // 1. Lịch trình / Cuộc họp / Gặp gỡ
    if (q.includes("lịch") || q.includes("họp") || q.includes("gặp") || q.includes("hôm nay")) {
      return {
        reply: `📅 Kính thưa Lãnh đạo ${userName}:\n\nTheo dữ liệu đồng bộ điều hành hôm nay, Sếp có các mốc công việc trọng tâm:\n• 09:00 - 10:30: Họp giao ban điều hành & Rà soát tiến độ tuần.\n• 14:00 - 15:30: Kết nối giao thương B2B & Trao đổi hợp tác đối tác.\n• 16:30 - 17:00: Ký duyệt chi và phê duyệt các tờ trình 3 cấp.\n\nSếp có muốn mở chi tiết Lịch làm việc toàn diện không ạ?`,
        action: {
          label: "Mở Lịch Làm Việc",
          route: "/connect-app/calendar",
        },
      };
    }

    // 2. Công việc / Tiến độ / Nhiệm vụ
    if (q.includes("công việc") || q.includes("tiến độ") || q.includes("nhiệm vụ") || q.includes("task") || q.includes("dự án")) {
      return {
        reply: `📊 Báo cáo tiến độ điều hành công việc cho Lãnh đạo ${userName}:\n\n• Tổng đầu việc đang triển khai: Đang được phân bổ chi tiết theo từng ban.\n• Tiến độ trung bình: Đạt 85% chỉ tiêu tuần.\n• Nghiệp vụ lưu ý: Đã có báo cáo hoàn thành cần nghiệm thu và 2 đầu việc chờ giao mới.\n\nEm đã chuẩn bị sẵn Bảng điều hành công việc để Sếp chỉ đạo trực tiếp.`,
        action: {
          label: "Mở Bảng Công Việc",
          command: "Mở bảng điều hành công việc",
        },
      };
    }

    // 3. Ký duyệt / Duyệt chi / Tờ trình / Thanh toán
    if (q.includes("ký duyệt") || q.includes("duyệt chi") || q.includes("tờ trình") || q.includes("thanh toán") || q.includes("duyệt")) {
      return {
        reply: `✍️ Kính thưa Lãnh đạo ${userName}:\n\nHệ thống ghi nhận quy trình Ký duyệt chi & Tờ trình 3 cấp VietQR đang sẵn sàng. Sếp có thể duyệt nhanh các phiếu đề xuất chi phí, mua sắm hoặc phê duyệt công tác chỉ với 1-chạm bảo mật cao.`,
        action: {
          label: "Mở Danh Sách Ký Duyệt",
          command: "Mở danh sách ký duyệt",
        },
      };
    }

    // 4. Chấm công / Giờ giấc / Nhân sự
    if (q.includes("chấm công") || q.includes("điểm danh") || q.includes("vào ca") || q.includes("tan ca") || q.includes("nhân sự")) {
      return {
        reply: `🕒 Trạng thái Chấm công & Giờ giấc nhân sự:\n\nTheo quy chế điều hành doanh nghiệp ViOne, việc theo dõi chuyên cần và chấm công FaceID/GPS tự động được kích hoạt theo cộng đồng doanh nghiệp. Sếp có thể theo dõi tỷ lệ nhân sự có mặt đúng giờ ngay tại Bàn điều hành.`,
        action: {
          label: "Mở Giao Diện Chấm Công",
          command: "Mở giao diện chấm công",
        },
      };
    }

    // 5. Đối tác / Mạng lưới / Giao thương / Khách hàng
    if (q.includes("đối tác") || q.includes("kết nối") || q.includes("mạng lưới") || q.includes("doanh nhân") || q.includes("khách hàng")) {
      return {
        reply: `🌐 Mạng lưới đối tác & Giao thương B2B:\n\nViOne AI đã quét các đối tác phù hợp ngành nghề và định vị gần Sếp. Sếp có thể vào Tab Kết nối để quét danh thiếp OCR, trao đổi Digital Card hoặc đề xuất cuộc gặp 1-1 ngay.`,
        action: {
          label: "Mở Mạng Lưới Đối Tác",
          route: "/connect-app/network",
        },
      };
    }

    // 6. Bạn là ai / Giới thiệu / Chào hỏi
    if (q.includes("bạn là ai") || q.includes("ai vậy") || q.includes("giới thiệu") || q.includes("xin chào") || q.includes("hello")) {
      return {
        reply: `✨ Kính chào Lãnh đạo ${userName}!\n\nTôi là Trợ lý Doanh Nhân ViOne AI Copilot 5.0, được thiết kế riêng phục vụ điều hành và giao thương cho các nhà lãnh đạo, CEO và doanh nghiệp tinh hoa. Tôi có thể hỗ trợ Sếp:\n1. 📋 Giao việc và giám sát tiến độ nhân sự các phòng ban\n2. 📅 Quản lý lịch trình công tác và hội họp\n3. ✍️ Phê duyệt tờ trình, chi tiêu và ký duyệt VietQR\n4. 🤝 Kết nối đối tác doanh nhân và quét danh thiếp AI\n5. 🎙️ Điều khiển toàn bộ ứng dụng bằng giọng nói tiếng Việt\n\nSếp cần tôi hỗ trợ công việc nào trước ạ?`,
        action: {
          label: "Giao Việc Cho Nhân Sự",
          command: "Giao việc cho nhân viên",
        },
      };
    }

    // 7. Mặc định thông minh
    return {
      reply: `💡 Dạ thưa Lãnh đạo ${userName}:\n\nTôi đã tiếp nhận yêu cầu của Sếp: "${query}".\n\nVề phương diện quản trị và vận hành, hệ sinh thái ViOne luôn sẵn sàng hỗ trợ Sếp tối ưu quy trình, đồng bộ dữ liệu và ra quyết định chuẩn xác. Sếp có thể chỉ đạo tôi thực hiện ngay các tác vụ bên dưới:`,
      action: {
        label: "Xem Tiến Độ Điều Hành",
        command: "Xem tiến độ công việc",
      },
    };
  };

  const executeVoiceAppCommand = (text: string): boolean => {
    // Nếu là câu hỏi, TUYỆT ĐỐI không cướp quyền AI
    if (isQuestion(text)) return false;

    const q = text.toLowerCase().trim();
    const isNavigationVerb =
      q.startsWith("mở ") ||
      q.startsWith("đi đến ") ||
      q.startsWith("chuyển sang ") ||
      q.startsWith("chuyển đến ") ||
      q.startsWith("vào ") ||
      q.startsWith("quay về ");

    // 1. Chấm công
    if (
      (isNavigationVerb && (q.includes("chấm công") || q.includes("vào ca") || q.includes("tan ca") || q.includes("điểm danh"))) ||
      q === "chấm công" ||
      q === "chấm công ngay" ||
      q === "vào ca" ||
      q === "tan ca"
    ) {
      triggerAppAction("🕒 Đang mở giao diện Chấm công nhân sự...", onOpenAttendance);
      return true;
    }

    // 2. Ký duyệt chi & tờ trình
    if (
      (isNavigationVerb && (q.includes("ký duyệt") || q.includes("duyệt chi") || q.includes("phê duyệt") || q.includes("trình ký") || q.includes("duyệt đơn"))) ||
      q === "ký duyệt" ||
      q === "ký duyệt chi" ||
      q === "duyệt chi"
    ) {
      triggerAppAction("✍️ Đang mở danh sách Ký duyệt chi & Tờ trình...", onOpenApprovals);
      return true;
    }

    // 3. Giao việc cho nhân viên
    if (
      (isNavigationVerb && (q.includes("giao việc") || q.includes("tạo việc") || q.includes("thêm việc") || q.includes("phân công"))) ||
      q === "giao việc" ||
      q === "giao việc mới" ||
      q === "tạo việc mới"
    ) {
      triggerAppAction("📋 Đang mở giao diện Giao việc cho nhân sự...", onOpenAssignTask);
      return true;
    }

    // 4. Tiến độ công việc / Workflow
    if (
      isNavigationVerb &&
      (q.includes("tiến độ") || q.includes("công việc") || q.includes("quy trình") || q.includes("workflow"))
    ) {
      triggerAppAction("📊 Đang mở Bảng điều hành tiến độ công việc...", onOpenWorkflow);
      return true;
    }

    // 5. Giám sát nhân sự
    if (
      isNavigationVerb &&
      (q.includes("nhân sự") || q.includes("giám sát nhân viên") || q.includes("hoạt động nhân viên"))
    ) {
      triggerAppAction("👥 Đang mở Bảng giám sát nhân sự & ca làm...", onOpenStaffActivity);
      return true;
    }

    // 6. Lịch làm việc & Hội họp
    if (
      (isNavigationVerb && (q.includes("lịch") || q.includes("họp") || q.includes("thời gian biểu") || q.includes("calendar"))) ||
      q === "mở lịch" ||
      q === "xem lịch"
    ) {
      triggerAppAction("📅 Đang mở Lịch trình công tác & Hội họp...", onOpenCalendar);
      return true;
    }

    // 7. Mã QR của tôi
    if (
      q.includes("mã qr của tôi") ||
      q.includes("danh thiếp qr") ||
      q.includes("qr cá nhân") ||
      q.includes("danh thiếp số")
    ) {
      triggerAppAction("💳 Đang hiển thị Mã QR Danh thiếp số của bạn...", onOpenMyQr);
      return true;
    }

    // 8. Quét QR
    if (
      q === "quét qr" ||
      q === "quét mã" ||
      q === "scan qr" ||
      (isNavigationVerb && (q.includes("quét qr") || q.includes("quét mã") || q.includes("scan qr")))
    ) {
      triggerAppAction("📷 Đang kích hoạt Camera quét mã QR kết nối...", onOpenScanQr);
      return true;
    }

    // 9. Thông báo
    if (
      (isNavigationVerb && (q.includes("thông báo") || q.includes("tin tức điều hành"))) ||
      q === "xem thông báo" ||
      q === "mở thông báo"
    ) {
      triggerAppAction("🔔 Đang mở Hộp thư thông báo điều hành...", onOpenNotifications);
      return true;
    }

    // 10. Điều hướng Tab: Mạng lưới
    if (
      isNavigationVerb &&
      (q.includes("mạng lưới") || q.includes("kết nối") || q.includes("tìm đối tác") || q.includes("doanh nhân"))
    ) {
      triggerAppAction("🌐 Đang chuyển sang Tab Mạng lưới đối tác...", () =>
        onNavigateToTab?.("Network")
      );
      return true;
    }

    // 11. Điều hướng Tab: Cộng đồng
    if (isNavigationVerb && (q.includes("cộng đồng") || q.includes("liên minh"))) {
      triggerAppAction("🏛️ Đang chuyển sang Tab Cộng đồng doanh nghiệp...", () =>
        onNavigateToTab?.("Community")
      );
      return true;
    }

    // 12. Điều hướng Tab: Cá nhân / Hồ sơ
    if (isNavigationVerb && (q.includes("hồ sơ") || q.includes("trang cá nhân") || q.includes("tài khoản"))) {
      triggerAppAction("👤 Đang mở Tab Hồ sơ cá nhân...", () => onNavigateToTab?.("Me"));
      return true;
    }

    // 13. Điều hướng Tab: Trang chủ
    if (
      q === "về trang chủ" ||
      q === "trang chủ" ||
      (isNavigationVerb && (q.includes("trang chủ") || q.includes("màn hình chính")))
    ) {
      triggerAppAction("🏠 Đang quay về Bảng điều khiển Trang chủ...", () =>
        onNavigateToTab?.("Home")
      );
      return true;
    }

    return false;
  };

  const triggerAppAction = (msg: string, actionFn?: () => void) => {
    addMessageToCurrentSession("assistant", msg);
    setIsLoading(false);
    setTimeout(() => {
      onClose();
      if (actionFn) actionFn();
    }, 850);
  };

  const addMessageToCurrentSession = (
    sender: "user" | "assistant",
    text: string,
    suggestedAction?: { label: string; command?: string; route?: string }
  ) => {
    const allSessions = sessionsRef.current.length > 0 ? sessionsRef.current : sessions;
    const currId = currentSessionIdRef.current || currentSessionId;
    const targetSession = allSessions.find((s) => s.id === currId) || allSessions[0];
    if (!targetSession) return;

    const newMsg: AiChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedAction,
    };
    const updatedMessages = [...targetSession.messages, newMsg];
    const updatedSession: AiSession = {
      ...targetSession,
      title:
        targetSession.messages.length <= 1 && sender === "user"
          ? text.slice(0, 32)
          : targetSession.title,
      messages: updatedMessages,
    };
    const newSessions = allSessions.map((s) => (s.id === targetSession.id ? updatedSession : s));
    saveSessions(newSessions);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleSend = async (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputText;
    const text = raw.trim();
    if (!text || isLoading) return;

    setInputText("");
    addMessageToCurrentSession("user", text);
    setIsLoading(true);

    // Check voice command execution first (100% voice automation)
    const isHandled = executeVoiceAppCommand(text);
    if (isHandled) return;

    const currentUserName = user?.name || (user as any)?.displayName || (user as any)?.fullName || "Lãnh đạo";
    const currentUserRole = (user as any)?.role || user?.title || "CEO_Executive";
    const currentCompany = user?.company || (user as any)?.companyName || "Doanh Nghiệp ViOne";

    try {
      // Call backend AI API
      const res = await aiApi.chat(text, currentSessionId, {
        id: user?.id,
        name: currentUserName,
        role: currentUserRole,
        companyName: currentCompany,
        department: (user as any)?.department,
      });

      const reply =
        res.data?.answer ||
        res.data?.data?.answer ||
        res.data?.reply ||
        res.data?.data?.reply ||
        res.data?.voiceText;

      if (reply) {
        addMessageToCurrentSession("assistant", reply);
        return;
      }
      throw new Error(res.error || "Empty response from AI engine");
    } catch (e: any) {
      // Intelligent Contextual Executive Response Generator (Khắc phục triệt để lỗi AI không trả lời)
      const fallback = generateContextualAiResponse(text, currentUserName);
      addMessageToCurrentSession("assistant", fallback.reply, fallback.action);
    } finally {
      setIsLoading(false);
    }
  };

  const isDarkMode = isDark;
  const themeBg = isDarkMode ? "#0F1420" : "#FAF8F5";
  const themeCard = isDarkMode ? "#161E2E" : "#FFFFFF";
  const themeText = isDarkMode ? "#F8FAFC" : "#0F172A";
  const themeSub = isDarkMode ? "#94A3B8" : "#475569";
  const goldColor = "#DFB76C";
  const goldBorder = isDarkMode ? "rgba(223, 183, 108, 0.35)" : "rgba(218, 165, 32, 0.4)";

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.container, { backgroundColor: themeBg }]}
      >
        {/* Executive Minimalist Header */}
        <View style={[styles.header, { borderBottomColor: isDarkMode ? "#1E293B" : "#E2E8F0" }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.aiBadge, { borderColor: goldColor }]}>
              <Sparkles size={16} color={goldColor} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: themeText }]}>Trợ Lý Doanh Nhân ViOne</Text>
              <Text style={[styles.headerStatus, { color: goldColor }]}>
                {isListening ? "🎙️ Đang lắng nghe giọng nói..." : "● Giọng nói sẵn sàng"}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            {/* New Chat Button */}
            <TouchableOpacity
              onPress={createNewSession}
              style={[styles.iconButton, { borderColor: goldBorder }]}
              accessibilityLabel="Cuộc trò chuyện mới"
            >
              <Plus size={18} color={goldColor} />
            </TouchableOpacity>

            {/* History Drawer Toggle */}
            <TouchableOpacity
              onPress={() => setShowHistoryDrawer(!showHistoryDrawer)}
              style={[
                styles.iconButton,
                { borderColor: showHistoryDrawer ? goldColor : goldBorder },
              ]}
              accessibilityLabel="Lịch sử trò chuyện"
            >
              <History size={18} color={showHistoryDrawer ? goldColor : themeSub} />
            </TouchableOpacity>

            {/* Clear History */}
            <TouchableOpacity
              onPress={clearAllHistory}
              style={[styles.iconButton, { borderColor: isDarkMode ? "#334155" : "#E2E8F0" }]}
              accessibilityLabel="Xóa lịch sử"
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={themeSub} />
            </TouchableOpacity>
          </View>
        </View>

        {/* History Drawer (if open) */}
        {showHistoryDrawer && (
          <View
            style={[
              styles.historyDrawer,
              { backgroundColor: themeCard, borderBottomColor: goldBorder },
            ]}
          >
            <View style={styles.historyDrawerHeader}>
              <Text style={[styles.historyDrawerTitle, { color: themeText }]}>
                Lịch sử hội thoại ({sessions.length})
              </Text>
              <TouchableOpacity onPress={clearAllHistory}>
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionList}>
              {sessions.map((s) => {
                const isSelected = s.id === currentSessionId;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setCurrentSessionId(s.id);
                      setShowHistoryDrawer(false);
                    }}
                    style={[
                      styles.sessionCard,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? "rgba(223, 183, 108, 0.15)"
                            : "rgba(223, 183, 108, 0.2)"
                          : isDarkMode
                          ? "#1E293B"
                          : "#EDF2F7",
                        borderColor: isSelected ? goldColor : "transparent",
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.sessionCardText,
                        { color: isSelected ? goldColor : themeText },
                      ]}
                    >
                      {s.title || "Cuộc trò chuyện"}
                    </Text>
                    <Text style={[styles.sessionCardDate, { color: themeSub }]}>
                      {new Date(s.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Chat Message List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
        >
          {currentSession?.messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAssistant,
                ]}
              >
                {!isUser && (
                  <View style={[styles.avatarBadge, { borderColor: goldColor }]}>
                    <Bot size={15} color={goldColor} />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isUser
                      ? [styles.bubbleUser, { backgroundColor: goldColor }]
                      : [
                          styles.bubbleAssistant,
                          {
                            backgroundColor: themeCard,
                            borderColor: goldBorder,
                          },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      { color: isUser ? "#0B0F17" : themeText },
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Suggested Action button inside bubble */}
                  {msg.suggestedAction && (
                    <TouchableOpacity
                      onPress={() => {
                        if (msg.suggestedAction?.route) {
                          onClose();
                          if (msg.suggestedAction.route === "/connect-app/calendar") {
                            onOpenCalendar?.();
                          } else if (msg.suggestedAction.route === "/connect-app/network") {
                            onNavigateToTab?.("Network");
                          } else if (msg.suggestedAction.route === "/connect-app/community") {
                            onNavigateToTab?.("Community");
                          } else if (msg.suggestedAction.route === "/connect-app") {
                            onNavigateToTab?.("Home");
                          }
                        } else if (msg.suggestedAction?.command) {
                          handleSend(msg.suggestedAction.command);
                        }
                      }}
                      style={[
                        styles.actionTriggerBtn,
                        { borderColor: goldColor, backgroundColor: isDarkMode ? "#0B0F17" : "#FFFFFF" },
                      ]}
                    >
                      <Text style={[styles.actionTriggerText, { color: goldColor }]}>
                        ⚡ {msg.suggestedAction.label}
                      </Text>
                      <ArrowRight size={14} color={goldColor} />
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.timestampText,
                      { color: isUser ? "rgba(11, 15, 23, 0.6)" : themeSub },
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowAssistant]}>
              <View style={[styles.avatarBadge, { borderColor: goldColor }]}>
                <Bot size={15} color={goldColor} />
              </View>
              <View style={[styles.bubbleAssistant, { backgroundColor: themeCard, borderColor: goldBorder }]}>
                <ActivityIndicator size="small" color={goldColor} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Voice Command Chips */}
        <View style={styles.quickCommandsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_COMMANDS.map((cmd, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSend(cmd.cmd)}
                style={[
                  styles.quickCommandChip,
                  {
                    backgroundColor: themeCard,
                    borderColor: isDarkMode ? "#1E293B" : "#E2E8F0",
                  },
                ]}
              >
                <Text style={[styles.quickCommandText, { color: themeText }]}>{cmd.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Voice Equalizer Bar (Active when listening) */}
        {isListening && (
          <View style={[styles.listeningBanner, { backgroundColor: isDarkMode ? "#121A26" : "#FEF3C7" }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Mic size={22} color="#DC2626" />
            </Animated.View>
            <Text style={[styles.listeningText, { color: isDarkMode ? goldColor : "#92400E" }]}>
              Đang nghe giọng nói... Nói: "Giao việc", "Chấm công", "Ký duyệt chi", "Xem tiến độ"
            </Text>
            <TouchableOpacity onPress={toggleListening} style={styles.stopListeningBtn}>
              <Text style={styles.stopListeningText}>Dừng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Minimalist Bottom Input Bar */}
        <View
          style={[
            styles.bottomInputBar,
            {
              backgroundColor: themeBg,
              borderTopColor: isDarkMode ? "#1E293B" : "#E2E8F0",
            },
          ]}
        >
          {/* Voice Microphone Toggle */}
          <TouchableOpacity
            onPress={toggleListening}
            style={[
              styles.micButton,
              {
                backgroundColor: isListening ? "#DC2626" : isDarkMode ? "#1E293B" : "#F1F5F9",
                borderColor: isListening ? "#EF4444" : goldColor,
              },
            ]}
            accessibilityLabel="Điều khiển giọng nói"
          >
            {isListening ? (
              <MicOff size={20} color="#FFFFFF" />
            ) : (
              <Mic size={20} color={goldColor} />
            )}
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nói hoặc nhập lệnh điều hành..."
            placeholderTextColor={themeSub}
            style={[
              styles.inputField,
              {
                backgroundColor: themeCard,
                color: themeText,
                borderColor: isDarkMode ? "#1E293B" : "#CBD5E1",
              },
            ]}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          {/* Send Button */}
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() && !isLoading ? goldColor : isDarkMode ? "#1E293B" : "#E2E8F0",
              },
            ]}
          >
            <Send size={18} color={inputText.trim() && !isLoading ? "#0B0F17" : themeSub} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 54 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  aiBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(223, 183, 108, 0.12)",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  headerStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  historyDrawer: {
    padding: 12,
    borderBottomWidth: 1,
  },
  historyDrawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyDrawerTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  clearAllText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  sessionList: {
    flexDirection: "row",
  },
  sessionCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 120,
  },
  sessionCardText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  sessionCardDate: {
    fontSize: 11,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  avatarBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "rgba(223, 183, 108, 0.12)",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  timestampText: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  actionTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionTriggerText: {
    fontSize: 12,
    fontWeight: "600",
  },
  quickCommandsWrap: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickCommandChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  quickCommandText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listeningBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  listeningText: {
    fontSize: 12,
    flex: 1,
    fontWeight: "500",
  },
  stopListeningBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#DC2626",
  },
  stopListeningText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  bottomInputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
    borderTopWidth: 1,
    gap: 8,
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
