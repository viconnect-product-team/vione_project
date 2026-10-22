import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Sparkles,
  Smartphone,
  Apple,
  Share,
  PlusSquare,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { isStandalonePwa } from "@/lib/business-connect/mobile/auth-session";

declare global {
  interface Window {
    __vione_deferred_pwa_prompt?: any;
  }
}

/**
 * Hook điều khiển việc cài đặt 1-chạm cho PWA ViOne App trên cả Android và iOS
 */
export function useOneTapPwaInstall() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Kiểm tra trạng thái đã cài đặt (Standalone PWA)
    const standalone = isStandalonePwa();
    setIsStandalone(standalone);

    // 2. Nhận diện thiết bị
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const androidDevice = /android/.test(ua);
    const inAppBrowser =
      /zalo|fbav|fban|messenger|instagram|line|micromessenger|tiktok|bytedance/i.test(ua);

    setIsIos(iosDevice);
    setIsAndroid(androidDevice);
    setIsInApp(inAppBrowser);

    // 3. Lấy prompt đã lưu trước đó nếu có
    if (window.__vione_deferred_pwa_prompt) {
      setDeferredPrompt(window.__vione_deferred_pwa_prompt);
    }

    // 4. Lắng nghe sự kiện beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__vione_deferred_pwa_prompt = e;
      setDeferredPrompt(e);
      window.dispatchEvent(new CustomEvent("vione-pwa-installable"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    // Nếu app đã ở chế độ Standalone
    if (isStandalone) {
      toast.success("✓ Ứng dụng ViOne đã được cài đặt trên thiết bị của bạn!");
      return;
    }

    // Nếu là In-App browser (Zalo, Facebook)
    if (isInApp) {
      setShowModal(true);
      return;
    }

    // 1. Luồng Android / Chrome có sẵn deferred prompt
    const promptEvent = deferredPrompt || window.__vione_deferred_pwa_prompt;
    if (promptEvent && typeof promptEvent.prompt === "function") {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          toast.success("✓ Đang thêm ViOne App lên màn hình chính!");
          window.__vione_deferred_pwa_prompt = null;
          setDeferredPrompt(null);
        }
        return;
      } catch (err) {
        console.warn("[pwa-install] native prompt failed, showing guide:", err);
      }
    }

    // 2. Luồng iOS (Safari / iPhone / iPad) hoặc fallback khi không có prompt tự động
    setShowModal(true);
  }, [deferredPrompt, isStandalone, isInApp]);

  return {
    isStandalone,
    isIos,
    isAndroid,
    isInApp,
    canPromptNative: Boolean(deferredPrompt || (typeof window !== "undefined" && window.__vione_deferred_pwa_prompt)),
    showModal,
    setShowModal,
    triggerInstall,
  };
}

/**
 * Nút cài đặt 1-chạm nhỏ gọn đặt trên Header Trang Chủ (cạnh nút đổi theme và chuông)
 */
export function HomeHeaderInstallButton() {
  const { isStandalone, triggerInstall } = useOneTapPwaInstall();

  // Đã cài rồi thì ẩn đi để giữ Header tinh gọn
  if (isStandalone) return null;

  return (
    <button
      type="button"
      onClick={triggerInstall}
      aria-label="Cài đặt ứng dụng ViOne lên màn hình chính"
      title="Cài đặt 1-chạm ViOne App lên màn hình chính"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#FAF3DD_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] px-2.5 text-[11px] font-black tracking-tight text-slate-950 shadow-[0_2px_10px_rgba(216,178,130,0.35)] transition-all hover:brightness-105 active:scale-95 border border-[#D8B282]/60 cursor-pointer"
    >
      <Sparkles className="h-3.5 w-3.5 text-amber-950 animate-pulse" />
      <span className="whitespace-nowrap">Cài App</span>
    </button>
  );
}

/**
 * Thẻ Card cài đặt 1-chạm VIP nổi bật ở ngay đầu trang chủ
 */
export function HomeInstallBannerCard() {
  const { isStandalone, isIos, isAndroid, triggerInstall, showModal, setShowModal } = useOneTapPwaInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("vione_home_install_banner_dismissed") === "true";
      if (isDismissed) setDismissed(true);
    } catch {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("vione_home_install_banner_dismissed", "true");
    } catch {}
  };

  // Đã cài đặt PWA hoặc người dùng đã tắt tạm thời trong phiên
  if (isStandalone || dismissed) return null;

  return (
    <>
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-[#D8B282]/40 bg-gradient-to-br from-[#14100C] via-[#1A140E] to-[#0A0704] p-4 text-white shadow-[0_12px_36px_rgba(0,0,0,0.65)] ring-1 ring-[#D8B282]/25">
        {/* Ambient Gold Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/15 blur-2xl" />

        {/* Nút tắt tạm thời */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Đóng banner cài đặt"
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition active:scale-95"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* Logo ViOne cân đối sắc nét */}
          <div className="relative h-13 w-13 shrink-0 rounded-2xl bg-gradient-to-br from-[#FAF3DD] via-[#D8B282] to-[#8C653B] p-[1.5px] shadow-lg">
            <div className="h-full w-full rounded-[14px] bg-[#05070E] flex items-center justify-center overflow-hidden">
              <img
                src="/apple-touch-icon.png?v=vione_balanced_20261022"
                alt="ViOne App"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute("src", "/vione-gold-192.png");
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#D8B282] text-[10px] font-black text-black shadow-sm">
              ★
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-[14px] font-black tracking-wide text-[#F3E5AB]">
                Cài Đặt App ViOne (1-Chạm)
              </h4>
              <span className="rounded-full bg-amber-400/20 border border-amber-400/35 px-2 py-0.5 text-[9.5px] font-black text-amber-300 uppercase tracking-wider">
                Màn hình chính
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-300">
              Thêm lên điện thoại để mở tức thì, chạy mượt toàn màn hình và nhận thông báo kết nối 24/7.
            </p>
          </div>
        </div>

        {/* Nút hành động cài đặt chính */}
        <div className="mt-3.5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={triggerInstall}
            className="flex-1 min-h-[42px] px-4 rounded-xl bg-[linear-gradient(135deg,#FAF3DD_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 font-black text-[12.5px] tracking-tight hover:brightness-105 active:scale-[0.98] transition shadow-md flex items-center justify-center gap-2 border border-[#D8B282]/60 cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            <span>Thêm Lên Màn Hình Ngay (1-Chạm)</span>
          </button>
        </div>
      </div>

      {/* Modal Hướng Dẫn Cài Đặt Khi Cần */}
      {showModal && <OneTapInstallGuideModal onClose={() => setShowModal(false)} isIos={isIos} isAndroid={isAndroid} />}
    </>
  );
}

/**
 * Modal Hướng Dẫn Cài Đặt 1-Chạm Sang Trọng (Dành cho iOS Safari và Fallback)
 */
export function OneTapInstallGuideModal({
  onClose,
  isIos,
  isAndroid,
}: {
  onClose: () => void;
  isIos: boolean;
  isAndroid: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleShareClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "ViOne — Nền Tảng Chuyển Đổi Số & Kết Nối Doanh Nghiệp",
          text: "Cài đặt ứng dụng ViOne lên màn hình chính",
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("✓ Đã sao chép liên kết vào bộ nhớ tạm!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Không thể sao chép liên kết");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#D4AF37]/50 bg-[#120E0A] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)] ring-1 ring-[#D4AF37]/40 max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4AF37]/20 blur-3xl" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#D8B282] to-[#996515] p-0.5 shadow-md shrink-0">
              <img
                src="/apple-touch-icon.png?v=vione_balanced_20261022"
                alt="ViOne App"
                className="h-full w-full rounded-[14px] object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute("src", "/vione-gold-192.png");
                }}
              />
            </div>
            <div>
              <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-1.5">
                <span>Cài Đặt App ViOne</span>
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              </h3>
              <p className="text-[11.5px] text-slate-300">Thêm biểu tượng lên màn hình chính điện thoại</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-1.5 text-slate-400 hover:bg-white/20 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nội dung theo thiết bị */}
        {isIos ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Apple className="h-4 w-4" />
                <span>Cách 1: Thêm nhanh qua Safari (Chuẩn Apple)</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    1
                  </span>
                  <span>
                    Bấm vào biểu tượng <strong>Chia sẻ</strong>{" "}
                    <Share className="inline h-3.5 w-3.5 text-amber-400" /> ở thanh công cụ dưới đáy trình duyệt Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    2
                  </span>
                  <span>
                    Cuộn xuống và chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen){" "}
                    <PlusSquare className="inline h-3.5 w-3.5 text-amber-400" />.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    3
                  </span>
                  <span>
                    Nhấn nút <strong>"Thêm"</strong> (Add) ở góc trên bên phải. Xong!
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={handleShareClick}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs border border-amber-400/40 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Share className="h-3.5 w-3.5" />
                <span>Bấm để mở Chia sẻ ngay</span>
              </button>
            </div>

            {/* Cách 2: Tải Cấu hình MobileConfig */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs mb-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Cách 2: Cài đặt tự động qua Cấu hình Apple iOS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tự động cài đặt biểu tượng ViOne WebClip ra màn hình chính qua hồ sơ cấu hình Apple đã xác thực.
              </p>
              <a
                href="/vione_ios_install.mobileconfig"
                download="vione_ios_install.mobileconfig"
                className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 py-2 px-3 text-xs font-bold text-[#F3E5AB] border border-white/15 transition active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Tải Cấu Hình Cài Đặt (.mobileconfig)</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Smartphone className="h-4 w-4" />
                <span>Hướng dẫn thêm lên màn hình chính Android</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    1
                  </span>
                  <span>
                    Nhấn vào biểu tượng <strong>Menu 3 chấm (⋮)</strong> ở góc trên bên phải trình duyệt Chrome.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    2
                  </span>
                  <span>
                    Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] font-black text-black text-[10px]">
                    3
                  </span>
                  <span>
                    Nhấn <strong>"Cài đặt"</strong>. Biểu tượng ViOne sẽ xuất hiện ngay tại màn hình chính!
                  </span>
                </li>
              </ol>
            </div>

            {/* Tùy chọn sao chép link */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 border border-white/15 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Đã chép link!" : "Chép link để dán vào Chrome"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Nút đóng */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition active:scale-95"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
