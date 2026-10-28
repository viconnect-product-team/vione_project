import React, { useState, useEffect } from "react";
import {
  Smartphone,
  RotateCcw,
  ExternalLink,
  QrCode,
  Sparkles,
  Check,
  Copy,
  ZoomIn,
  ZoomOut,
  Wifi,
  Battery,
  Signal,
  X,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import { PlatformPwaApp } from "./PlatformPwaApp";

export interface PwaDeviceSimulatorProps {
  initialTab?: "explore" | "run_events" | "culture" | "wallet" | "profile";
  initialSubTab?: string;
  moduleName?: string;
}

type DevicePreset = "iphone15" | "galaxy24" | "compact";

interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  label: string;
  bezelRadius: string;
  screenRadius: string;
  notchType: "dynamic-island" | "punch-hole" | "notch";
}

const DEVICES: Record<DevicePreset, DeviceSpec> = {
  iphone15: {
    name: "iPhone 15 Pro",
    width: 393,
    height: 852,
    label: "393 × 852 px (19.5:9)",
    bezelRadius: "rounded-[52px]",
    screenRadius: "rounded-[42px]",
    notchType: "dynamic-island",
  },
  galaxy24: {
    name: "Galaxy S24",
    width: 412,
    height: 890,
    label: "412 × 890 px (19.5:9)",
    bezelRadius: "rounded-[46px]",
    screenRadius: "rounded-[38px]",
    notchType: "punch-hole",
  },
  compact: {
    name: "iPhone SE / Compact",
    width: 375,
    height: 720,
    label: "375 × 720 px (16:9)",
    bezelRadius: "rounded-[40px]",
    screenRadius: "rounded-[32px]",
    notchType: "notch",
  },
};

export const PwaDeviceSimulator: React.FC<PwaDeviceSimulatorProps> = ({
  initialTab = "explore",
  initialSubTab,
  moduleName = "ViOne App",
}) => {
  const [device, setDevice] = useState<DevicePreset>("iphone15");
  const [zoom, setZoom] = useState<number>(100);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("09:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const spec = DEVICES[device];

  // Build target PWA URL for real device QR Code / direct link
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://vione.viconnect.vn";
  const pwaUrl = `${currentOrigin}/platform-app?tab=${initialSubTab || (initialTab === "run_events" ? "run" : initialTab === "culture" ? "heritage" : "explore")}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=15&data=${encodeURIComponent(pwaUrl)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pwaUrl);
      setCopied(true);
      toast.success("Đã sao chép link PWA ViOne!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.info(`Link: ${pwaUrl}`);
    }
  };

  const handleOpenStandalone = () => {
    window.open(pwaUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Studio Control Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#0A101D] border border-slate-200 dark:border-[#D8B282]/30 rounded-2xl shadow-sm">
        {/* Left: Module Indicator & Specs Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F6E1C3]">
                Xem Trước Chuẩn PWA ViOne
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Mobile Screen
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Phân hệ: <span className="font-semibold text-slate-700 dark:text-slate-200">{moduleName}</span> • Khung hình {spec.label}
            </div>
          </div>
        </div>

        {/* Center: Device Presets Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
          {(["iphone15", "galaxy24", "compact"] as DevicePreset[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === d
                  ? "bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F6E1C3] shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {DEVICES[d].name}
            </button>
          ))}
        </div>

        {/* Right: Actions (Zoom, Reload, QR, Standalone) */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setZoom((prev) => Math.max(70, prev - 10))}
              disabled={zoom <= 70}
              className="p-1 hover:text-amber-500 disabled:opacity-40"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(110, prev + 10))}
              disabled={zoom >= 110}
              className="p-1 hover:text-amber-500 disabled:opacity-40"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reload button */}
          <button
            onClick={() => {
              setReloadKey((k) => k + 1);
              toast.info("Đã làm mới màn hình điện thoại");
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
            title="Làm mới ứng dụng trên điện thoại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* QR Code button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300/40 dark:border-[#D8B282]/30 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-[#F6E1C3] text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-all shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quét QR Trên Điện Thoại</span>
          </button>

          {/* Open Standalone PWA */}
          <button
            onClick={handleOpenStandalone}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md shadow-[#D8B282]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở PWA Độc Lập</span>
          </button>
        </div>
      </div>

      {/* Simulator Viewport Stage */}
      <div className="w-full flex items-center justify-center p-4 md:p-8 bg-slate-100/70 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden min-h-[920px]">
        {/* Scaled Device Box */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease-out",
          }}
          className="relative transition-all duration-300"
        >
          {/* Exterior Side Buttons Simulation */}
          <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-slate-700 rounded-l-md" />
          <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-slate-700 rounded-l-md" />
          <div className="absolute -right-[14px] top-36 w-[4px] h-16 bg-slate-700 rounded-r-md" />

          {/* Smartphone Chassis Outer Bezel */}
          <div
            style={{ width: `${spec.width + 24}px`, height: `${spec.height + 24}px` }}
            className={`relative p-3 bg-gradient-to-b from-[#1C1F26] via-[#101319] to-[#0A0D14] border-[3px] border-[#D8B282]/40 shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_20px_rgba(216,178,130,0.15)] ${spec.bezelRadius} flex flex-col overflow-hidden`}
          >
            {/* Screen Inner Bezel */}
            <div
              style={{ width: `${spec.width}px`, height: `${spec.height}px` }}
              className={`relative bg-[#050C15] ${spec.screenRadius} overflow-hidden flex flex-col shadow-inner select-none`}
            >
              {/* Top Notch / Dynamic Island */}
              {spec.notchType === "dynamic-island" && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/5 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#0d0d0d] ring-1 ring-white/5" />
                </div>
              )}

              {spec.notchType === "punch-hole" && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-3.5 h-3.5 bg-black rounded-full ring-2 ring-[#111] flex items-center justify-center pointer-events-none">
                  <div className="w-1 h-1 rounded-full bg-blue-900/40" />
                </div>
              )}

              {/* Mobile Phone Status Bar */}
              <div className="relative z-40 w-full h-11 px-6 pt-1 flex items-center justify-between text-white text-[11px] font-semibold pointer-events-none shrink-0 bg-[#050C15]">
                {/* Time */}
                <span className="font-semibold tracking-tight">{currentTime}</span>

                {/* Icons: Signal, 5G, Wifi, Battery */}
                <div className="flex items-center gap-1.5 text-white/90">
                  <Signal className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-amber-400">5G</span>
                  <Wifi className="w-3.5 h-3.5 text-white" />
                  <div className="flex items-center gap-0.5">
                    <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Scrollable Screen Content: Running Real PWA ViOne */}
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative bg-[#050C15] text-[#E2E8F0] scrollbar-thin scrollbar-thumb-slate-700">
                <PlatformPwaApp
                  key={reloadKey}
                  initialTab={initialTab}
                  initialSubTab={initialSubTab}
                  isEmbedded={true}
                />
              </div>

              {/* Bottom Home Indicator Gesture Bar */}
              <div className="relative z-50 w-full h-5 bg-[#070B14] flex items-center justify-center pointer-events-none shrink-0">
                <div className="w-32 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Testing on Real Mobile Device */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#0A101D] border border-slate-200 dark:border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6E1C3] flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-500" />
                Mở Trên Điện Thoại Thực Tế
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center">
              Dùng camera điện thoại (iPhone hoặc Android) quét mã QR bên dưới để trải nghiệm ngay trên thiết bị thực tế:
            </p>

            <div className="flex justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-inner">
              <img
                src={qrCodeImageUrl}
                alt="QR Code PWA ViOne"
                className="w-52 h-52 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
                <span className="flex-1 truncate">{pwaUrl}</span>
                <button
                  onClick={handleCopyUrl}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:text-amber-500 shrink-0 flex items-center gap-1 font-sans text-xs font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Đã chép" : "Chép"}
                </button>
              </div>

              <button
                onClick={() => {
                  window.open(pwaUrl, "_blank");
                  setShowQrModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở Trực Tiếp Trong Tab Mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
