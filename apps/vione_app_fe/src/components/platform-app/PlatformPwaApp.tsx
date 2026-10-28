import React, { useState, useEffect } from "react";
import {
  Compass,
  Landmark,
  Trophy,
  Flame,
  Ticket,
  Archive,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  Radio,
  ExternalLink,
  User,
  LogOut,
  LogIn,
  QrCode,
  CheckCircle2,
  Volume2,
  Play,
  RotateCcw,
  Smartphone,
  Star,
  Gift,
  Share2,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { HeritageExplorer } from "./HeritageExplorer";
import { MuseumExplorer } from "./MuseumExplorer";
import { SportTournamentHub } from "./SportTournamentHub";
import { RunRaceHub } from "./RunRaceHub";
import { TicketWallet } from "./TicketWallet";
import { ArchiveViewer } from "./ArchiveViewer";
import { CitizenPassModal } from "./CitizenPassModal";
import { NfcReviewHub } from "./NfcReviewHub";

export interface CitizenUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  accountType: "visitor" | "runner" | "citizen";
  bibNumber?: string;
  stampsCount: number;
  medalsCount: number;
  avatarUrl?: string;
}

export interface PlatformPwaAppProps {
  initialTab?: "explore" | "run_events" | "culture" | "wallet" | "profile";
  initialSubTab?: string;
  isEmbedded?: boolean;
}

export const PlatformPwaApp: React.FC<PlatformPwaAppProps> = ({
  initialTab,
  initialSubTab,
  isEmbedded = false,
}) => {
  // Mobile Bottom Navigation Tabs: "explore" | "run_events" | "culture" | "wallet" | "profile"
  const [mobileTab, setMobileTab] = useState<"explore" | "run_events" | "culture" | "wallet" | "profile">(
    initialTab || "explore"
  );
  const [cultureSubTab, setCultureSubTab] = useState<"heritage" | "museum" | "archive">(
    (initialSubTab as "heritage" | "museum" | "archive") || "heritage"
  );
  const [runSubTab, setRunSubTab] = useState<"run" | "sport">(
    (initialSubTab as "run" | "sport") || "run"
  );
  const [walletSubTab, setWalletSubTab] = useState<"tickets" | "review">(
    (initialSubTab as "tickets" | "review") || "tickets"
  );

  const [isCitizenPassOpen, setCitizenPassOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isDeviceView, setIsDeviceView] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setMobileTab(initialTab);
    }
    if (initialSubTab) {
      if (initialTab === "culture" || ["heritage", "museum", "archive"].includes(initialSubTab)) {
        setCultureSubTab(initialSubTab as any);
      } else if (initialTab === "run_events" || ["run", "sport"].includes(initialSubTab)) {
        setRunSubTab(initialSubTab as any);
      } else if (initialTab === "wallet" || ["tickets", "review"].includes(initialSubTab)) {
        setWalletSubTab(initialSubTab as any);
      }
    }
  }, [initialTab, initialSubTab]);

  useEffect(() => {
    if (initialTab) return; // Prioritize prop if provided
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "run") {
        setMobileTab("run_events");
        setRunSubTab("run");
      } else if (tabParam === "sport") {
        setMobileTab("run_events");
        setRunSubTab("sport");
      } else if (tabParam === "heritage") {
        setMobileTab("culture");
        setCultureSubTab("heritage");
      } else if (tabParam === "museum") {
        setMobileTab("culture");
        setCultureSubTab("museum");
      } else if (tabParam === "archive") {
        setMobileTab("culture");
        setCultureSubTab("archive");
      } else if (tabParam === "tickets") {
        setMobileTab("wallet");
        setWalletSubTab("tickets");
      } else if (tabParam === "review") {
        setMobileTab("wallet");
        setWalletSubTab("review");
      } else if (tabParam === "profile") {
        setMobileTab("profile");
      }
    }
  }, [initialTab]);

  // Independent Citizen / Runner Account State
  const [currentUser, setCurrentUser] = useState<CitizenUser>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vione_citizen_pass_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      id: "cz-8824",
      name: "Nguyễn Hải Đăng",
      phone: "0988 123 456",
      email: "haidang.runner@gmail.com",
      accountType: "runner",
      bibNumber: "VNE-42-088",
      stampsCount: 5,
      medalsCount: 2,
    };
  });

  const [loginForm, setLoginForm] = useState({
    name: "",
    phone: "",
    accountType: "runner" as "visitor" | "runner" | "citizen",
    bibNumber: "",
  });

  const handleSaveLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.name.trim() || !loginForm.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    const newUser: CitizenUser = {
      id: "cz-" + Math.floor(1000 + Math.random() * 9000),
      name: loginForm.name,
      phone: loginForm.phone,
      email: `${loginForm.phone}@vione.vn`,
      accountType: loginForm.accountType,
      bibNumber: loginForm.bibNumber || (loginForm.accountType === "runner" ? "VNE-21-999" : undefined),
      stampsCount: 1,
      medalsCount: 0,
    };
    setCurrentUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("vione_citizen_pass_user", JSON.stringify(newUser));
    }
    setAuthModalOpen(false);
    toast.success(`Đăng nhập thành công! Chào mừng ${newUser.name}`);
  };

  const handleLogout = () => {
    const guestUser: CitizenUser = {
      id: "guest",
      name: "Khách Trải Nghiệm",
      phone: "",
      email: "",
      accountType: "visitor",
      stampsCount: 0,
      medalsCount: 0,
    };
    setCurrentUser(guestUser);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vione_citizen_pass_user");
    }
    toast.info("Đã đăng xuất tài khoản trải nghiệm");
  };

  return (
    <div
      className={
        isEmbedded
          ? "w-full min-h-full bg-[#050C15] text-[#E2E8F0] font-sans flex flex-col relative"
          : `min-h-screen bg-[#050C15] text-[#E2E8F0] font-sans flex flex-col ${isDeviceView ? "py-6 items-center bg-[#02050A]" : ""}`
      }
    >
      {/* Container wrapper: full on mobile, simulated device on desktop if toggled */}
      <div
        className={
          isEmbedded
            ? "w-full flex-1 flex flex-col relative"
            : `w-full flex-1 flex flex-col relative ${
                isDeviceView
                  ? "max-w-[420px] h-[880px] rounded-[48px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(216,178,130,0.25)] overflow-hidden bg-[#050C15]"
                  : "max-w-7xl mx-auto"
              }`
        }
      >
        {/* Device Viewport Toggle (Desktop Only) */}
        {!isEmbedded && (
          <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-[#0A101D] border-b border-[#D8B282]/20 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-slate-300">ViOne App PWA Native — Phân Hệ Trải Nghiệm Công Dân & Runner</span>
            </div>
            <button
              onClick={() => setIsDeviceView(!isDeviceView)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-semibold transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              {isDeviceView ? "Mở Rộng Toàn Màn Hình" : "Mô Phỏng Giao Diện Mobile"}
            </button>
          </div>
        )}

        {/* Premium App Top Header Bar */}
        <header className="sticky top-0 z-30 w-full bg-[#050C15]/95 backdrop-blur-md border-b border-[#D8B282]/20 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* User Profile Avatar & Switch Account */}
            <div className="flex items-center gap-2.5">
              <div
                onClick={() => setAuthModalOpen(true)}
                className="cursor-pointer relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F6E1C3] via-[#D8B282] to-[#8C653B] p-[2px] shadow-md shadow-[#D8B282]/20 hover:scale-105 transition-transform"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050C15]">
                  <User className="h-5 w-5 text-[#F6E1C3]" />
                </div>
              </div>
              <div onClick={() => setAuthModalOpen(true)} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-tight hover:text-[#F6E1C3] transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentUser.accountType}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{currentUser.bibNumber ? `BIB: ${currentUser.bibNumber}` : "Hộ Chiếu ViOne"}</span>
                  <span className="text-amber-400 underline font-semibold ml-1">Đổi tài khoản</span>
                </div>
              </div>
            </div>

            {/* Passport Stamps & Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCitizenPassOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md shadow-[#D8B282]/20 hover:brightness-105 active:scale-95 transition-all"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{currentUser.stampsCount} Tem</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content View Switcher */}
        <main className="flex-1 overflow-y-auto pb-24 p-4 sm:p-6">
          {/* TAB 1: KHÁM PHÁ (EXPLORE HOME) */}
          {mobileTab === "explore" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Banner */}
              <div className="relative rounded-3xl border border-[#D8B282]/40 bg-gradient-to-br from-[#0F172A] via-[#0A101D] to-[#050C15] p-6 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8B282]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F6E1C3] animate-spin" />
                    <span>HỆ SINH THÁI SỐ QUỐC GIA VIONE</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69]">
                    Khám Phá Di Sản, Bảo Tàng 3D & Giải Chạy Marathon
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Trải nghiệm tương tác di tích VR360, xoay cổ vật hoàng gia 3D Photogrammetry, tham gia giải chạy di sản cấp BIB RFID tự động và chạm thẻ NFC tại các điểm du lịch.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={() => setMobileTab("run_events")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Đăng Ký Giải Chạy</span>
                    </button>
                    <button
                      onClick={() => setMobileTab("culture")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D8B282]/40 bg-[#0B0F17]/80 text-[#F6E1C3] text-xs font-bold hover:bg-[#D8B282]/10 active:scale-95 transition-all"
                    >
                      <Landmark className="w-3.5 h-3.5 text-[#D8B282]" />
                      <span>Xem Bảo Tàng 3D</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Quick Category Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => {
                    setMobileTab("culture");
                    setCultureSubTab("heritage");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-[#0A101D] border border-[#D8B282]/30 hover:border-[#D8B282] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-[#D8B282]/10 text-[#F6E1C3]">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-[#F6E1C3]">Di Sản Văn Hóa</div>
                    <div className="text-[11px] text-slate-400">VR360 & Tem GPS</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("culture");
                    setCultureSubTab("museum");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-[#0A101D] border border-[#D8B282]/30 hover:border-[#D8B282] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-[#F6E1C3]">Bảo Tàng 3D</div>
                    <div className="text-[11px] text-slate-400">Audio Guide AI</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("run_events");
                    setRunSubTab("run");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-[#0A101D] border border-[#D8B282]/30 hover:border-[#D8B282] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-[#F6E1C3]">Giải Chạy Marathon</div>
                    <div className="text-[11px] text-slate-400">Timing RFID & BIB</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("wallet");
                    setWalletSubTab("tickets");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-[#0A101D] border border-[#D8B282]/30 hover:border-[#D8B282] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-[#F6E1C3]">Ví Vé Điện Tử</div>
                    <div className="text-[11px] text-slate-400">QR Check-in 24/7</div>
                  </div>
                </div>
              </div>

              {/* Citizen Passport Widget Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    HỘ CHIẾU CÔNG DÂN SỐ VIỆT NAM (CITIZEN PASS)
                  </div>
                  <p className="text-xs text-slate-300">
                    Đã tích lũy <strong className="text-amber-400 font-bold">{currentUser.stampsCount} con dấu</strong> di sản & <strong className="text-amber-400 font-bold">{currentUser.medalsCount} huy chương</strong> giải chạy finisher.
                  </p>
                </div>
                <button
                  onClick={() => setCitizenPassOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md whitespace-nowrap"
                >
                  Mở Hộ Chiếu
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SỰ KIỆN & GIẢI CHẠY */}
          {mobileTab === "run_events" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-[#0A101D] border border-[#D8B282]/20 rounded-xl">
                <button
                  onClick={() => setRunSubTab("run")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    runSubTab === "run"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Giải Chạy & Timing RFID
                </button>
                <button
                  onClick={() => setRunSubTab("sport")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    runSubTab === "sport"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Giải Đấu Thể Thao (Pickleball)
                </button>
              </div>
              {runSubTab === "run" ? <RunRaceHub /> : <SportTournamentHub />}
            </div>
          )}

          {/* TAB 3: BẢO TÀNG & DI SẢN */}
          {mobileTab === "culture" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-[#0A101D] border border-[#D8B282]/20 rounded-xl">
                <button
                  onClick={() => setCultureSubTab("heritage")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "heritage"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Di Sản & VR360
                </button>
                <button
                  onClick={() => setCultureSubTab("museum")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "museum"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Bảo Tàng 3D
                </button>
                <button
                  onClick={() => setCultureSubTab("archive")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "archive"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Tư Liệu Sắc Phong
                </button>
              </div>
              {cultureSubTab === "heritage" && <HeritageExplorer />}
              {cultureSubTab === "museum" && <MuseumExplorer />}
              {cultureSubTab === "archive" && <ArchiveViewer />}
            </div>
          )}

          {/* TAB 4: VÍ VÉ & THẺ CHẠM NFC */}
          {mobileTab === "wallet" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-[#0A101D] border border-[#D8B282]/20 rounded-xl">
                <button
                  onClick={() => setWalletSubTab("tickets")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    walletSubTab === "tickets"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Ví Vé Tham Quan & Giải Chạy
                </button>
                <button
                  onClick={() => setWalletSubTab("review")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    walletSubTab === "review"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
                      : "text-slate-400"
                  }`}
                >
                  Chạm NFC Review & Voucher
                </button>
              </div>
              {walletSubTab === "tickets" ? <TicketWallet /> : <NfcReviewHub />}
            </div>
          )}

          {/* TAB 5: HỒ SƠ & TÀI KHOẢN TRẢI NGHIỆM */}
          {mobileTab === "profile" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="rounded-3xl border border-[#D8B282]/40 bg-[#0A101D] p-6 text-center space-y-3">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#F6E1C3] via-[#D8B282] to-[#8C653B] p-[3px] shadow-xl shadow-[#D8B282]/20">
                  <div className="h-full w-full rounded-full bg-[#050C15] flex items-center justify-center">
                    <User className="h-10 w-10 text-[#F6E1C3]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400">{currentUser.phone || "Tài khoản khách vãng lai"}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Hồ Sơ: {currentUser.accountType} {currentUser.bibNumber && `• BIB #${currentUser.bibNumber}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="p-3 rounded-2xl bg-white/5">
                    <div className="text-xl font-bold font-serif text-[#F6E1C3]">{currentUser.stampsCount}</div>
                    <div className="text-[11px] text-slate-400">Tem Di Tích Đã Thu Thập</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5">
                    <div className="text-xl font-bold font-serif text-emerald-400">{currentUser.medalsCount}</div>
                    <div className="text-[11px] text-slate-400">Huy Chương Finisher</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    Chuyển Đổi / Đăng Nhập Tài Khoản Khác
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng Xuất Tài Khoản Trải Nghiệm
                  </button>
                </div>
              </div>

              {/* Citizen Passport Preview Card */}
              <div className="p-5 rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm text-white">Hộ Chiếu Di Sản Công Dân Số</span>
                  </div>
                  <button
                    onClick={() => setCitizenPassOpen(true)}
                    className="text-xs text-amber-400 font-bold underline"
                  >
                    Xem chi tiết
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Mỗi lần tham quan di tích thực địa hoặc hoàn thành giải chạy marathon, hãy quét mã QR/NFC tại trạm để được đóng con dấu điện tử vĩnh viễn vào Hộ chiếu số.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Mobile PWA Bottom Navigation Bar */}
        <nav
          className={`${
            isEmbedded ? "sticky" : "fixed lg:absolute"
          } bottom-0 left-0 right-0 z-40 bg-[#070B14]/98 backdrop-blur-xl border-t border-[#D8B282]/25 py-2 px-3 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] shrink-0`}
        >
          <div className="flex items-center justify-around max-w-lg mx-auto">
            <button
              onClick={() => setMobileTab("explore")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "explore" ? "text-amber-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-bold">Khám Phá</span>
            </button>

            <button
              onClick={() => setMobileTab("run_events")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "run_events" ? "text-amber-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-5 h-5" />
              <span className="text-[10px] font-bold">Giải Chạy</span>
            </button>

            <button
              onClick={() => setMobileTab("culture")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "culture" ? "text-amber-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span className="text-[10px] font-bold">Di Sản & 3D</span>
            </button>

            <button
              onClick={() => setMobileTab("wallet")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "wallet" ? "text-amber-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span className="text-[10px] font-bold">Ví Vé & NFC</span>
            </button>

            <button
              onClick={() => setMobileTab("profile")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "profile" ? "text-amber-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold">Cá Nhân</span>
            </button>
          </div>
        </nav>

        {/* Modal Đăng Nhập / Đổi Tài Khoản Trải Nghiệm Riêng */}
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#0A101D] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-[#F6E1C3] flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  Tài Khoản Trải Nghiệm ViOne Pass
                </h3>
                <button onClick={() => setAuthModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Tài khoản độc lập dành riêng cho Runner, Du khách & Công dân tham gia hệ sinh thái (tách biệt hoàn toàn với tài khoản Doanh nhân CRM).
              </p>

              <form onSubmit={handleSaveLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    placeholder="VD: Nguyễn Hải Đăng"
                    className="w-full px-3 py-2 bg-black/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="0988..."
                    className="w-full px-3 py-2 bg-black/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vai trò trải nghiệm</label>
                  <select
                    value={loginForm.accountType}
                    onChange={(e) => setLoginForm({ ...loginForm, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-black/50 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="runner">Vận Động Viên (Runner)</option>
                    <option value="visitor">Du Khách Tham Quan (Visitor)</option>
                    <option value="citizen">Công Dân Số Văn Hóa (Citizen)</option>
                  </select>
                </div>

                {loginForm.accountType === "runner" && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số BIB Giải Chạy (Nếu có)</label>
                    <input
                      type="text"
                      value={loginForm.bibNumber}
                      onChange={(e) => setLoginForm({ ...loginForm, bibNumber: e.target.value })}
                      placeholder="VD: VNE-42-088"
                      className="w-full px-3 py-2 bg-black/50 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    Lưu & Đăng Nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Hộ Chiếu Công Dân Số */}
        <CitizenPassModal
          isOpen={isCitizenPassOpen}
          onClose={() => setCitizenPassOpen(false)}
        />
      </div>
    </div>
  );
};
