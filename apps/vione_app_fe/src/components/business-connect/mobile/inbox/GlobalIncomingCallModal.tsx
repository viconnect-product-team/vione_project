import { useEffect, useState, useRef, useCallback } from "react";
import { Phone, PhoneOff, Video, Sparkles } from "lucide-react";
import { getConnectAppSocket } from "@/hooks/use-connect-app-socket";
import { useViewerUserId } from "@/hooks/use-viewer-user-id";
import { sendExternalNotification, sendCallNotification } from "@/lib/notification-permissions";
import { NEST_API_URL } from "@/lib/api-client";
import { DmCallModal } from "./DmCallModal";

export interface IncomingCallData {
  callId: string;
  callerUserId: string;
  callerName: string;
  callerAvatar?: string | null;
  callerTitle?: string | null;
  callType: "audio" | "video";
}

export function GlobalIncomingCallModal() {
  const viewerUserId = useViewerUserId();
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [activeCallData, setActiveCallData] = useState<IncomingCallData | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<any>(null);
  const activeCallRef = useRef<IncomingCallData | null>(null);
  const incomingCallRef = useRef<IncomingCallData | null>(null);

  useEffect(() => {
    activeCallRef.current = activeCallData;
  }, [activeCallData]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  const startRingtone = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playTone = () => {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      };

      playTone();
      ringIntervalRef.current = setInterval(playTone, 2200);

      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate([400, 300, 400, 300, 400]);
      }
    } catch {
      /* ignore audio autoplay restrictions */
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        /* ignore */
      }
      audioContextRef.current = null;
    }
  }, []);

  const handleIncomingCall = useCallback((data: IncomingCallData) => {
    // NEVER show incoming call modal if caller is the viewer themselves
    if (!viewerUserId || data.callerUserId === viewerUserId) {
      return;
    }
    // Đã chấp nhận cuộc gọi này hoặc đang trong cuộc gọi đàm thoại thì tuyệt đối không mở popup lại
    if (activeCallRef.current) {
      return;
    }
    // Nếu đang hiển thị đúng cuộc gọi này rồi thì không lặp lại rung chuông
    if (incomingCallRef.current?.callId === data.callId) {
      return;
    }
    setIncomingCall(data);
    incomingCallRef.current = data;
    startRingtone();
    // Báo cuộc gọi đến lên màn hình khóa điện thoại (Lockscreen Notification)
    sendCallNotification(data.callerName || "Đối tác ViOne", data.callType, data.callId);
  }, [viewerUserId, startRingtone]);

  // Kiểm tra ngay lập tức khi đăng nhập / mở app xem có cuộc gọi nào đang ringing không
  const checkActiveCall = useCallback(async () => {
    if (!viewerUserId) return;
    const socket = getConnectAppSocket();
    try {
      // 1. Gửi socket event check active
      socket.emit("call:check_active", { userId: viewerUserId });

      // 2. Fetch REST API active call để bắt ngay lập tức không phụ thuộc độ trễ socket
      const token = typeof window !== "undefined" ? (localStorage.getItem("accessToken") || localStorage.getItem("token") || "") : "";
      const base = NEST_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://127.0.0.1:4001" : "");
      if (base) {
        const res = await fetch(`${base}/connect-app/calls/active`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const json = await res.json();
          const activeCall = json?.activeCall;
          if (
            activeCall &&
            activeCall.status === "ringing" &&
            activeCall.recipientUserId === viewerUserId &&
            !activeCallRef.current
          ) {
            handleIncomingCall({
              callId: activeCall.callId,
              callerUserId: activeCall.callerUserId,
              callerName: activeCall.callerName,
              callerAvatar: activeCall.callerAvatar,
              callerTitle: activeCall.callerTitle,
              callType: activeCall.callType,
            });
          }
        }
      }
    } catch {
      // ignore network errors
    }
  }, [viewerUserId, handleIncomingCall]);

  useEffect(() => {
    const socket = getConnectAppSocket();
    if (!socket || !viewerUserId) return;

    const handleCallEnded = () => {
      stopRingtone();
      setIncomingCall(null);
      incomingCallRef.current = null;
    };

    const handleCallMissed = (data: any) => {
      stopRingtone();
      if (incomingCallRef.current?.callId === data?.callId) {
        setIncomingCall(null);
        incomingCallRef.current = null;
      }
      // Báo cuộc gọi lỡ ra màn hình điện thoại
      const callerName = data?.callerName || "Đối tác ViOne";
      sendExternalNotification(`📞 Cuộc gọi nhỡ từ ${callerName}`, {
        body: `Bạn đã bỏ lỡ cuộc gọi thoại/video lúc ${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}. Nhấn để xem lại.`,
        tag: `missed-call-${data?.callId || Date.now()}`,
        url: "/connect-app/inbox",
        requireInteraction: false,
      });
    };

    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:ended", handleCallEnded);
    socket.on("call:declined", handleCallEnded);
    socket.on("call:missed", handleCallMissed);
    socket.on("connect", checkActiveCall);

    // Kích hoạt kiểm tra ngay khi mount nếu user vừa đăng nhập
    void checkActiveCall();

    return () => {
      stopRingtone();
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:ended", handleCallEnded);
      socket.off("call:declined", handleCallEnded);
      socket.off("call:missed", handleCallMissed);
      socket.off("connect", checkActiveCall);
    };
  }, [viewerUserId, handleIncomingCall, stopRingtone, checkActiveCall]);

  const handleDecline = () => {
    stopRingtone();
    if (incomingCall) {
      const socket = getConnectAppSocket();
      socket.emit("call:decline", {
        callId: incomingCall.callId,
        callerUserId: incomingCall.callerUserId,
        reason: "declined",
      });
    }
    setIncomingCall(null);
    incomingCallRef.current = null;
  };

  const handleAccept = () => {
    stopRingtone();
    const current = incomingCallRef.current || incomingCall;
    if (current && viewerUserId) {
      const socket = getConnectAppSocket();
      socket.emit("call:accept", {
        callId: current.callId,
        callerUserId: current.callerUserId,
        calleeUserId: viewerUserId,
      });
      activeCallRef.current = current;
      setActiveCallData(current);
    }
    setIncomingCall(null);
    incomingCallRef.current = null;
  };

  return (
    <>
      {incomingCall && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 dark:bg-black/85 p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#DFB76C]/60 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F0E8] dark:from-[#161D2B]/98 dark:via-[#0F1420]/98 dark:to-[#090C14]/99 p-6 text-slate-900 dark:text-white shadow-[0_20px_60px_rgba(216,178,130,0.25),0_0_40px_rgba(216,178,130,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(216,178,130,0.2)] flex flex-col items-center text-center overflow-hidden">
            {/* Ambient Pulse Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#D8B282]/20 blur-[60px] pointer-events-none animate-pulse" />

            {/* Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D8B282]/50 bg-[#D8B282]/20 dark:bg-[#D8B282]/15 text-[11px] font-bold uppercase tracking-wider text-[#8C653B] dark:text-[#F0D59D] mb-6">
              {incomingCall.callType === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
              <span>{incomingCall.callType === "video" ? "Cuộc gọi Video đến" : "Cuộc gọi thoại đến"}</span>
            </div>

            {/* Avatar with Animated Ripple Rings */}
            <div className="relative mb-5">
              <div className="absolute -inset-3 rounded-full bg-[#D8B282]/25 animate-ping opacity-75" style={{ animationDuration: "2s" }} />
              <div className="absolute -inset-1.5 rounded-full bg-[#D8B282]/40 animate-pulse" />
              {incomingCall.callerAvatar ? (
                <img
                  src={incomingCall.callerAvatar}
                  alt={incomingCall.callerName}
                  className="relative w-24 h-24 rounded-full object-cover ring-3 ring-[#D8B282] shadow-2xl"
                />
              ) : (
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] dark:from-[#2F271D] dark:via-[#1F1912] dark:to-[#120F0B] border-2 border-[#D8B282] flex items-center justify-center text-slate-950 dark:text-[#F0D59D] text-3xl font-extrabold shadow-2xl">
                  {incomingCall.callerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h3 className="text-2xl font-black !text-slate-950 dark:!text-white tracking-tight">{incomingCall.callerName}</h3>
            {incomingCall.callerTitle && (
              <p className="text-xs font-semibold text-slate-600 dark:text-[#9DA3AE] mt-1 max-w-[240px] truncate">{incomingCall.callerTitle}</p>
            )}
            <p className="text-xs font-bold text-[#8C653B] dark:text-[#D8B282] mt-2 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Đang đổ chuông mời bạn kết nối...
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-12 mt-8 w-full">
              {/* Decline Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDecline}
                  aria-label="Từ chối"
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
                <span className="text-[11px] text-red-600 dark:text-red-300 font-bold">Từ chối</span>
              </div>

              {/* Accept Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAccept}
                  aria-label="Trả lời"
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(34,197,94,0.6)] animate-bounce transition-all cursor-pointer"
                  style={{ animationDuration: "1.2s" }}
                >
                  <Phone className="w-6 h-6" />
                </button>
                <span className="text-[11px] text-emerald-700 dark:text-green-300 font-bold">Trả lời</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call UI for Callee when accepted */}
      {activeCallData && (
        <DmCallModal
          isOpen={true}
          callId={activeCallData.callId}
          callType={activeCallData.callType}
          counterpartUserId={activeCallData.callerUserId}
          counterpartName={activeCallData.callerName}
          counterpartAvatar={activeCallData.callerAvatar}
          counterpartTitle={activeCallData.callerTitle}
          isIncomingAcceptance={true}
          onClose={() => setActiveCallData(null)}
        />
      )}
    </>
  );
}
