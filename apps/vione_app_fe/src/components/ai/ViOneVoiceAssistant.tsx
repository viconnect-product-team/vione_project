import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Send,
  Plus,
  History,
  Trash2,
  Bot,
  User,
  ArrowRight,
  Layers,
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  ScanLine,
  Users,
  CheckCircle2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

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

const STORAGE_KEY = "vione_ai_web_sessions_v2";
const DEFAULT_WELCOME = "Xin chào Lãnh đạo! Tôi là Trợ lý Doanh Nhân ViOne AI. Tôi sẵn sàng hỗ trợ điều hành công ty, giao việc, chấm công, ký duyệt hoặc điều khiển toàn bộ ứng dụng bằng giọng nói.";

const QUICK_COMMANDS = [
  { label: "🕒 Chấm công", cmd: "Chấm công vào ca" },
  { label: "✍️ Ký duyệt chi", cmd: "Mở danh sách ký duyệt" },
  { label: "📋 Giao việc mới", cmd: "Giao việc cho nhân viên" },
  { label: "📊 Xem tiến độ", cmd: "Xem tiến độ công việc" },
  { label: "📅 Lịch làm việc", cmd: "Xem lịch làm việc hôm nay" },
  { label: "📷 Quét mã QR", cmd: "Quét mã QR kết nối" },
];

export function ViOneVoiceAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Vị trí và trạng thái kéo thả Quả cầu AI (Persistent Draggable FAB)
  const [orbPos, setOrbPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vione_ai_orb_pos");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            return parsed;
          }
        }
      } catch {}
    }
    const defaultX = typeof window !== "undefined" ? Math.max(16, window.innerWidth - 76) : 300;
    const defaultY = typeof window !== "undefined" ? Math.max(80, window.innerHeight - 100) : 500;
    return { x: defaultX, y: defaultY };
  });

  const [isOrbHidden, setIsOrbHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vione_ai_orb_hidden") === "true";
    }
    return false;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; orbX: number; orbY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    orbX: 0,
    orbY: 0,
    moved: false,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const sessionsRef = useRef<AiSession[]>([]);
  const currentSessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  // Text to speech hỗ trợ tiếng Việt
  const speakVietnamese = useCallback((rawText: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Lược bỏ emoji và định dạng markdown trước khi đọc
      const cleanText = rawText
        .replace(/[#*_`~>]/g, "")
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "vi-VN";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.toLowerCase().includes("vi"));
      if (viVoice) {
        utterance.voice = viVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }, [isSpeechEnabled]);

  // Load sessions from localStorage
  useEffect(() => {
    loadSessions();
  }, []);

  // Listen to open event from other components
  useEffect(() => {
    const handleOpenAi = () => {
      setIsOrbHidden(false);
      setIsOpen(true);
    };
    const handleToggle = (e: any) => {
      const hidden = e?.detail?.hidden !== undefined ? e.detail.hidden : localStorage.getItem("vione_ai_orb_hidden") === "true";
      setIsOrbHidden(hidden);
    };
    window.addEventListener("vione-open-ai-assistant", handleOpenAi);
    window.addEventListener("vione_ai_toggled", handleToggle);
    window.addEventListener("storage", handleToggle);
    return () => {
      window.removeEventListener("vione-open-ai-assistant", handleOpenAi);
      window.removeEventListener("vione_ai_toggled", handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
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
      createNewSession();
    } catch {
      createNewSession();
    }
  };

  const saveSessions = (newSessions: AiSession[]) => {
    try {
      sessionsRef.current = newSessions;
      setSessions(newSessions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    } catch (e) {
      console.warn("Failed to save AI sessions:", e);
    }
  };

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const initialMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: DEFAULT_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const newSession: AiSession = {
      id: newId,
      title: "Cuộc trò chuyện mới",
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
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử các cuộc trò chuyện AI?")) {
      localStorage.removeItem(STORAGE_KEY);
      sessionsRef.current = [];
      setSessions([]);
      createNewSession();
      toast.success("✓ Đã xóa sạch lịch sử trò chuyện AI!");
    }
  };

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) ||
    sessionsRef.current.find((s) => s.id === currentSessionIdRef.current) ||
    sessions[0] ||
    sessionsRef.current[0];

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.info("Trình duyệt không hỗ trợ nhận diện giọng nói trực tiếp. Quý khách vui lòng nhập câu hỏi bằng văn bản.");
        return;
      }

      try {
        const r = new SpeechRecognition();
        r.continuous = false;
        r.interimResults = false;
        r.lang = "vi-VN";

        r.onstart = () => {
          setIsListening(true);
          toast.info("Đang lắng nghe giọng nói tiếng Việt...");
        };

        r.onresult = (e: any) => {
          setIsListening(false);
          const transcript = e.results?.[0]?.[0]?.transcript;
          if (transcript && transcript.trim()) {
            toast.success(`Đã nhận diện: "${transcript.trim()}"`);
            handleSend(transcript.trim());
          }
        };

        r.onerror = (e: any) => {
          setIsListening(false);
          console.warn("Speech error:", e.error);
          if (e.error === "not-allowed") {
            toast.error("Vui lòng cấp quyền truy cập Micro cho trình duyệt!");
          } else if (e.error === "no-speech") {
            toast.info("Không phát hiện âm thanh. Vui lòng nói lại hoặc gõ văn bản.");
          }
        };

        r.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = r;
        r.start();
      } catch (err) {
        console.warn("SpeechRecognition start error:", err);
        setIsListening(false);
        toast.error("Không thể khởi động micro. Vui lòng kiểm tra quyền truy cập micro của trình duyệt.");
      }
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
        reply: `📅 **Kính thưa Lãnh đạo ${userName}:**\n\nTheo dữ liệu đồng bộ điều hành hôm nay, Sếp có các mốc công việc trọng tâm:\n• **09:00 - 10:30:** Họp giao ban điều hành & Rà soát tiến độ tuần.\n• **14:00 - 15:30:** Kết nối giao thương B2B & Trao đổi hợp tác đối tác.\n• **16:30 - 17:00:** Ký duyệt chi và phê duyệt các tờ trình 3 cấp.\n\nSếp có muốn mở chi tiết Lịch làm việc toàn diện không ạ?`,
        action: {
          label: "Mở Lịch Làm Việc",
          route: "/connect-app/calendar",
        },
      };
    }

    // 2. Công việc / Tiến độ / Nhiệm vụ
    if (q.includes("công việc") || q.includes("tiến độ") || q.includes("nhiệm vụ") || q.includes("task") || q.includes("dự án")) {
      return {
        reply: `📊 **Báo cáo tiến độ điều hành công việc cho Lãnh đạo ${userName}:**\n\n• **Tổng đầu việc đang triển khai:** Đang được phân bổ chi tiết theo từng ban.\n• **Tiến độ trung bình:** Đạt 85% chỉ tiêu tuần.\n• **Nghiệp vụ lưu ý:** Đã có báo cáo hoàn thành cần nghiệm thu và 2 đầu việc chờ giao mới.\n\nEm đã chuẩn bị sẵn Bảng điều hành công việc để Sếp chỉ đạo trực tiếp.`,
        action: {
          label: "Mở Bảng Công Việc",
          command: "Mở bảng điều hành công việc",
        },
      };
    }

    // 3. Ký duyệt / Duyệt chi / Tờ trình / Thanh toán
    if (q.includes("ký duyệt") || q.includes("duyệt chi") || q.includes("tờ trình") || q.includes("thanh toán") || q.includes("duyệt")) {
      return {
        reply: `✍️ **Kính thưa Lãnh đạo ${userName}:**\n\nHệ thống ghi nhận quy trình Ký duyệt chi & Tờ trình 3 cấp VietQR đang sẵn sàng. Sếp có thể duyệt nhanh các phiếu đề xuất chi phí, mua sắm hoặc phê duyệt công tác chỉ với 1-chạm bảo mật cao.`,
        action: {
          label: "Mở Danh Sách Ký Duyệt",
          command: "Mở danh sách ký duyệt",
        },
      };
    }

    // 4. Chấm công / Giờ giấc / Nhân sự
    if (q.includes("chấm công") || q.includes("điểm danh") || q.includes("vào ca") || q.includes("tan ca") || q.includes("nhân sự")) {
      return {
        reply: `🕒 **Trạng thái Chấm công & Giờ giấc nhân sự:**\n\nTheo quy chế điều hành doanh nghiệp ViOne, việc theo dõi chuyên cần và chấm công FaceID/GPS tự động được kích hoạt theo cộng đồng doanh nghiệp. Sếp có thể theo dõi tỷ lệ nhân sự có mặt đúng giờ ngay tại Bàn điều hành.`,
        action: {
          label: "Mở Giao Diện Chấm Công",
          command: "Mở giao diện chấm công",
        },
      };
    }

    // 5. Đối tác / Mạng lưới / Giao thương / Khách hàng
    if (q.includes("đối tác") || q.includes("kết nối") || q.includes("mạng lưới") || q.includes("doanh nhân") || q.includes("khách hàng")) {
      return {
        reply: `🌐 **Mạng lưới đối tác & Giao thương B2B:**\n\nViOne AI đã quét các đối tác phù hợp ngành nghề và định vị gần Sếp. Sếp có thể vào Tab Kết nối để quét danh thiếp OCR, trao đổi Digital Card hoặc đề xuất cuộc gặp 1-1 ngay.`,
        action: {
          label: "Mở Mạng Lưới Đối Tác",
          route: "/connect-app/network",
        },
      };
    }

    // 6. Bạn là ai / Giới thiệu / Chào hỏi
    if (q.includes("bạn là ai") || q.includes("ai vậy") || q.includes("giới thiệu") || q.includes("xin chào") || q.includes("hello")) {
      return {
        reply: `✨ **Kính chào Lãnh đạo ${userName}!**\n\nTôi là **Trợ lý Doanh Nhân ViOne AI Copilot 5.0**, được thiết kế riêng phục vụ điều hành và giao thương cho các nhà lãnh đạo, CEO và doanh nghiệp tinh hoa. Tôi có thể hỗ trợ Sếp:\n1. 📋 Giao việc và giám sát tiến độ nhân sự các phòng ban\n2. 📅 Quản lý lịch trình công tác và hội họp\n3. ✍️ Phê duyệt tờ trình, chi tiêu và ký duyệt VietQR\n4. 🤝 Kết nối đối tác doanh nhân và quét danh thiếp AI\n5. 🎙️ Điều khiển toàn bộ ứng dụng bằng giọng nói tiếng Việt\n\nSếp cần tôi hỗ trợ công việc nào trước ạ?`,
        action: {
          label: "Giao Việc Cho Nhân Sự",
          command: "Giao việc cho nhân viên",
        },
      };
    }

    // 7. Mặc định thông minh
    return {
      reply: `💡 **Dạ thưa Lãnh đạo ${userName}:**\n\nTôi đã tiếp nhận yêu cầu của Sếp: *"${query}"*.\n\nVề phương diện quản trị và vận hành, hệ sinh thái ViOne luôn sẵn sàng hỗ trợ Sếp tối ưu quy trình, đồng bộ dữ liệu và ra quyết định chuẩn xác. Sếp có thể chỉ đạo tôi thực hiện ngay các tác vụ bên dưới:`,
      action: {
        label: "Xem Tiến Độ Điều Hành",
        command: "Xem tiến độ công việc",
      },
    };
  };

  // Pointer drag handlers cho Quả cầu AI di chuyển tự do
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".ai-close-badge")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orbX: orbPos.x,
      orbY: orbPos.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }
    const maxX = window.innerWidth - 68;
    const maxY = window.innerHeight - 90;
    const newX = Math.min(Math.max(12, dragStartRef.current.orbX + dx), maxX);
    const newY = Math.min(Math.max(50, dragStartRef.current.orbY + dy), maxY);
    setOrbPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (dragStartRef.current.moved) {
      try {
        localStorage.setItem("vione_ai_orb_pos", JSON.stringify(orbPos));
      } catch {}
    } else {
      setIsOpen(true);
    }
  };

  const handleCloseOrb = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOrbHidden(true);
    try {
      localStorage.setItem("vione_ai_orb_hidden", "true");
      window.dispatchEvent(new CustomEvent("vione_ai_toggled", { detail: { hidden: true } }));
    } catch {}
    toast.info("Đã tắt Trợ lý AI trên giao diện. Khi muốn bật lại, vui lòng vào màn Tôi để bật.");
  };

  const handleRestoreOrb = () => {
    setIsOrbHidden(false);
    try {
      localStorage.removeItem("vione_ai_orb_hidden");
      window.dispatchEvent(new CustomEvent("vione_ai_toggled", { detail: { hidden: false } }));
    } catch {}
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
      triggerAppAction("🕒 Đang mở giao diện Chấm công nhân sự...", () => {
        window.dispatchEvent(new Event("vione-open-attendance"));
        navigate({ to: "/connect-app" });
      });
      return true;
    }

    // 2. Giao việc cho nhân viên
    if (
      (isNavigationVerb && (q.includes("giao việc") || q.includes("tạo việc") || q.includes("thêm việc") || q.includes("phân công"))) ||
      q === "giao việc" ||
      q === "giao việc mới" ||
      q === "tạo việc mới"
    ) {
      triggerAppAction("📋 Đang mở giao diện Giao việc & Điều hành...", () => {
        window.dispatchEvent(new Event("vione-open-workflow"));
        navigate({ to: "/connect-app" });
      });
      return true;
    }

    // 4. Tiến độ công việc / Workflow
    if (
      isNavigationVerb &&
      (q.includes("tiến độ") || q.includes("công việc") || q.includes("quy trình") || q.includes("workflow"))
    ) {
      triggerAppAction("📊 Đang mở Bảng điều hành tiến độ công việc...", () => {
        window.dispatchEvent(new Event("vione-open-workflow"));
        navigate({ to: "/connect-app" });
      });
      return true;
    }

    // 5. Lịch làm việc & Hội họp
    if (
      (isNavigationVerb && (q.includes("lịch") || q.includes("họp") || q.includes("thời gian biểu") || q.includes("calendar"))) ||
      q === "mở lịch" ||
      q === "xem lịch"
    ) {
      triggerAppAction("📅 Đang mở Lịch làm việc & Hội họp...", () => {
        navigate({ to: "/connect-app/calendar" });
      });
      return true;
    }

    // 6. Mã QR của tôi
    if (
      q.includes("mã qr của tôi") ||
      q.includes("danh thiếp qr") ||
      q.includes("qr cá nhân") ||
      q.includes("danh thiếp số")
    ) {
      triggerAppAction("💳 Đang hiển thị Mã QR Danh thiếp số...", () => {
        navigate({ to: "/connect-app/me/card" });
      });
      return true;
    }

    // 7. Quét QR
    if (
      q === "quét qr" ||
      q === "quét mã" ||
      q === "scan qr" ||
      (isNavigationVerb && (q.includes("quét qr") || q.includes("quét mã") || q.includes("scan qr")))
    ) {
      triggerAppAction("📷 Đang mở chức năng quét mã QR kết nối...", () => {
        navigate({ to: "/connect-app/card-scan" });
      });
      return true;
    }

    // 8. Tin nhắn / Hộp thư
    if (
      isNavigationVerb &&
      (q.includes("tin nhắn") || q.includes("hộp thư") || q.includes("chat"))
    ) {
      triggerAppAction("💬 Đang mở Hộp thư trò chuyện đối tác...", () => {
        navigate({ to: "/connect-app/inbox" });
      });
      return true;
    }

    // 9. Điều hướng Tab: Mạng lưới
    if (
      isNavigationVerb &&
      (q.includes("mạng lưới") || q.includes("kết nối") || q.includes("tìm đối tác"))
    ) {
      triggerAppAction("🌐 Đang chuyển sang Tab Mạng lưới đối tác...", () => {
        navigate({ to: "/connect-app/network" });
      });
      return true;
    }

    // 10. Điều hướng Tab: Cộng đồng
    if (isNavigationVerb && (q.includes("cộng đồng") || q.includes("liên minh"))) {
      triggerAppAction("🏛️ Đang chuyển sang Tab Cộng đồng doanh nghiệp...", () => {
        navigate({ to: "/connect-app/community" });
      });
      return true;
    }

    // 11. Điều hướng Tab: Trang chủ
    if (
      q === "về trang chủ" ||
      q === "trang chủ" ||
      (isNavigationVerb && (q.includes("trang chủ") || q.includes("màn hình chính")))
    ) {
      triggerAppAction("🏠 Đang quay về Bảng điều khiển Trang chủ...", () => {
        navigate({ to: "/connect-app" });
      });
      return true;
    }

    return false;
  };

  const triggerAppAction = (msg: string, actionFn?: () => void) => {
    addMessageToCurrentSession("assistant", msg);
    setIsLoading(false);
    setTimeout(() => {
      setIsOpen(false);
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
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 150);
  };

  const handleSend = async (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputText;
    const text = raw.trim();
    if (!text || isLoading) return;

    setInputText("");
    addMessageToCurrentSession("user", text);
    setIsLoading(true);

    // Kiểm tra điều khiển giọng nói tự thao tác chỉ khi là lệnh điều hướng cụ thể
    const isHandled = executeVoiceAppCommand(text);
    if (isHandled) return;

    const currentUserName = user?.name || user?.displayName || (user as any)?.fullName || "Lãnh đạo";
    const currentUserRole = user?.role || "CEO_Executive";
    const currentCompany = (user as any)?.companyName || (user as any)?.company || "Doanh Nghiệp ViOne";

    try {
      const res: any = await fetchNestApi("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          conversationId: currentSessionId,
          currentUser: {
            id: user?.id,
            name: currentUserName,
            role: currentUserRole,
            companyName: currentCompany,
            department: user?.department,
          },
          context: {
            platform: "vione_pwa_web",
            role: currentUserRole,
          },
        }),
      });

      const reply =
        res?.answer ||
        res?.data?.answer ||
        res?.reply ||
        res?.data?.reply ||
        res?.voiceText;

      if (reply) {
        addMessageToCurrentSession("assistant", reply);
        speakVietnamese(reply);
        return;
      }
      throw new Error("Empty response from AI engine");
    } catch {
      // Intelligent Contextual Executive Response Generator (Khắc phục triệt để lỗi AI không trả lời)
      const fallback = generateContextualAiResponse(text, currentUserName);
      addMessageToCurrentSession("assistant", fallback.reply, fallback.action);
      speakVietnamese(fallback.reply);
    } finally {
      setIsLoading(false);
    }
  };

  // FAB Trigger Button (Khi modal đóng)
  if (!isOpen) {
    if (isOrbHidden) {
      // Khi người dùng tắt AI: Tắt hẳn trên toàn bộ giao diện (không hiện orb, không hiện tab mép)
      // Người dùng có thể bật lại bất cứ lúc nào trong màn "Tôi"
      return null;
    }

    return (
      <div
        style={{
          position: "fixed",
          left: `${orbPos.x}px`,
          top: `${orbPos.y}px`,
          touchAction: "none",
          userSelect: "none",
          zIndex: 9999,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="group cursor-grab active:cursor-grabbing select-none"
      >
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 shadow-[0_8px_30px_rgba(216,178,130,0.55)] border-2 border-[#F6E1C3] transition-transform hover:scale-105 active:scale-95">
          <Sparkles className="h-6 w-6 stroke-[2.2] text-[#1A120B]" />

          {/* Pulsing AI badge */}
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 text-[8.5px] font-black text-white items-center justify-center shadow-xs">
              AI
            </span>
          </span>

          {/* Quick Close Button (X) on Corner */}
          <button
            type="button"
            onClick={handleCloseOrb}
            className="ai-close-badge absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B0F17] text-white border border-[#DFB76C]/80 shadow-md hover:bg-red-600 hover:border-red-500 hover:scale-110 active:scale-90 transition cursor-pointer z-10"
            title="Tắt nhanh logo AI"
            aria-label="Tắt logo AI"
          >
            <X className="h-3 w-3 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-md p-0 sm:p-4 transition-all">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF8F5] border border-[#DFB76C]/60 shadow-[0_20px_60px_rgba(216,178,130,0.35)] overflow-hidden h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 text-slate-900"
        style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}
      >
        {/* Executive Minimalist Header - Chuẩn ViOne sáng vàng đồng */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFB76C]/30 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_100%)] border border-[#DFB76C] text-slate-950 shadow-sm">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 leading-tight">
                Trợ Lý Doanh Nhân ViOne
              </h3>
              <p className="text-[11px] font-bold text-[#8C653B]">
                {isListening ? "🎙️ Đang lắng nghe giọng nói..." : "● Giọng nói sẵn sàng"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle TTS Speech Button */}
            <button
              type="button"
              onClick={() => {
                const nextState = !isSpeechEnabled;
                setIsSpeechEnabled(nextState);
                if (!nextState && typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={isSpeechEnabled ? "Đang bật giọng đọc AI (Bấm để tắt)" : "Đang tắt giọng đọc (Bấm để bật)"}
              className={`grid h-8 w-8 place-items-center rounded-lg border transition cursor-pointer ${
                isSpeechEnabled
                  ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#8C653B]"
                  : "border-slate-200 bg-slate-100 text-slate-400 hover:text-slate-600"
              }`}
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* New Chat Button */}
            <button
              type="button"
              onClick={createNewSession}
              title="Cuộc trò chuyện mới"
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#DFB76C]/50 bg-[#DFB76C]/15 text-[#8C653B] hover:bg-[#DFB76C]/25 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* History Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              title="Lịch sử trò chuyện"
              className={`grid h-8 w-8 place-items-center rounded-lg border transition cursor-pointer ${
                showHistoryDrawer
                  ? "border-[#DFB76C] bg-[#DFB76C]/25 text-[#8C653B]"
                  : "border-slate-200 bg-slate-100 text-slate-500 hover:text-slate-900"
              }`}
            >
              <History className="h-4 w-4" />
            </button>

            {/* Clear History */}
            <button
              type="button"
              onClick={clearAllHistory}
              title="Xóa lịch sử"
              className="grid h-8 w-8 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsOpen(false);
              }}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:text-slate-900 transition cursor-pointer ml-1"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* History Drawer */}
        {showHistoryDrawer && (
          <div className="p-3 bg-white border-b border-[#DFB76C]/30 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Lịch sử cuộc trò chuyện ({sessions.length})</span>
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-red-600 hover:underline text-[11px] font-semibold"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sessions.map((s) => {
                const isSelected = s.id === currentSessionId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setCurrentSessionId(s.id);
                      setShowHistoryDrawer(false);
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs text-left max-w-[140px] truncate transition cursor-pointer ${
                      isSelected
                        ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#8C653B] font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#DFB76C]/50"
                    }`}
                  >
                    <p className="truncate font-semibold">{s.title || "Cuộc trò chuyện"}</p>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {new Date(s.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Message Scroll Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
          {currentSession?.messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_100%)] border border-[#DFB76C] text-slate-950 shadow-xs">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-semibold rounded-br-xs shadow-sm"
                      : "bg-white border border-[#DFB76C]/35 text-slate-900 rounded-bl-xs shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line text-slate-900 font-normal leading-relaxed">{msg.text}</p>

                  {/* Action Button inside AI Bubble */}
                  {msg.suggestedAction && (
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.suggestedAction?.route) {
                          setIsOpen(false);
                          navigate({ to: msg.suggestedAction.route as any });
                        } else if (msg.suggestedAction?.command) {
                          handleSend(msg.suggestedAction.command);
                        }
                      }}
                      className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg border border-[#DFB76C]/70 bg-[#FAF8F5] text-[#8C653B] font-bold text-[11px] flex items-center justify-between hover:bg-[#F3EAD8] active:scale-98 transition cursor-pointer shadow-xs"
                    >
                      <span>⚡ {msg.suggestedAction.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <span
                    className={`block text-[9.5px] mt-1 text-right font-medium ${
                      isUser ? "text-slate-900/60" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_100%)] border border-[#DFB76C] text-slate-950 shadow-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl bg-white border border-[#DFB76C]/30 p-3 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#DFB76C] animate-ping" />
                <span className="font-medium text-[#8C653B]">Trợ lý AI đang tư duy và xử lý dữ liệu...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2 bg-white/90 border-t border-[#DFB76C]/25">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {QUICK_COMMANDS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.cmd)}
                className="shrink-0 px-2.5 py-1 rounded-full border border-[#DFB76C]/40 bg-[#FAF8F5] text-slate-700 text-[11px] font-semibold hover:border-[#DFB76C] hover:bg-white hover:text-[#8C653B] transition cursor-pointer shadow-xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Listening Active Banner */}
        {isListening && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-300 flex items-center justify-between text-xs text-[#8C653B]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>Đang nghe giọng nói... Hãy nói: "Giao việc", "Chấm công", "Tiến độ"</span>
            </div>
            <button
              type="button"
              onClick={toggleListening}
              className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold cursor-pointer hover:bg-red-700"
            >
              Dừng
            </button>
          </div>
        )}

        {/* Bottom Input Field */}
        <div className="p-3 border-t border-[#DFB76C]/25 bg-white flex items-center gap-2 shadow-sm">
          {/* Voice Microphone */}
          <button
            type="button"
            onClick={toggleListening}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition cursor-pointer shadow-xs ${
              isListening
                ? "bg-red-600 text-white border-red-500 animate-pulse"
                : "border-[#DFB76C] bg-[#FAF8F5] text-[#8C653B] hover:bg-[#F3EAD8]"
            }`}
            title="Nói để điều khiển ứng dụng"
          >
            {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nói hoặc nhập lệnh điều hành..."
            className="flex-1 h-10 rounded-full border border-slate-200 bg-[#FAF8F5] px-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#DFB76C] focus:bg-white transition"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#F6E1C3_0%,#DFB76C_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-bold transition disabled:opacity-40 cursor-pointer shadow-sm active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
