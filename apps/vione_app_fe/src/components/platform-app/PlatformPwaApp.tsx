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
import { Bell } from "lucide-react";
import { ViOneLogo } from "../business-connect/mobile/ViOneLogo";
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
          ? "w-full min-h-full bg-[#F8FAFC] text-slate-900 font-sans flex flex-col relative"
          : `min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col ${isDeviceView ? "py-6 items-center bg-slate-200" : ""}`
      }
    >
      {/* Container wrapper: full on mobile, simulated device on desktop if toggled */}
      <div
        className={
          isEmbedded
            ? "w-full flex-1 flex flex-col relative"
            : `w-full flex-1 flex flex-col relative ${
                isDeviceView
                  ? "max-w-[420px] h-[880px] rounded-[48px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden bg-[#F8FAFC]"
                  : "max-w-7xl mx-auto"
              }`
        }
      >
        {/* Device Viewport Toggle (Desktop Only) */}
        {!isEmbedded && (
          <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-800">ViOne App PWA Native — Phân Hệ Trải Nghiệm Công Dân & Runner</span>
            </div>
            <button
              onClick={() => setIsDeviceView(!isDeviceView)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              {isDeviceView ? "Mở Rộng Toàn Màn Hình" : "Mô Phỏng Giao Diện Mobile"}
            </button>
          </div>
        )}

        {/* Premium App Top Header Bar with Safe Area Top - LIGHT THEME (CHỈ LOGO VIONE VÀ ICON THÔNG BÁO) */}
        <header
          className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm"
          style={{
            paddingTop: "max(var(--bc-mobile-safe-top, 0px), 12px)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: ViOne Logo */}
            <div className="flex items-center gap-2">
              <ViOneLogo className="h-6 w-auto" />
            </div>

            {/* Right: Notification Bell Icon */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => toast.info("Bạn có 3 thông báo mới từ ban tổ chức")}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-all"
                title="Thông báo"
                aria-label="Thông báo"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content View Switcher */}
        <main className="flex-1 overflow-y-auto pb-24 p-4 sm:p-6">
          {/* TAB 1: KHÁM PHÁ (EXPLORE HOME) */}
          {mobileTab === "explore" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Banner - Light Theme */}
              <div className="relative rounded-3xl border border-[#D8B282]/40 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 p-6 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8B282]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B282]/40 bg-amber-100/60 px-3 py-0.5 text-[10px] font-bold text-[#8C653B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C653B] animate-spin" />
                    <span>NỀN TẢNG SỐ VIONE</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                    Khám Phá Di Sản, Bảo Tàng 3D & Giải Thể Thao Doanh Nhân
                  </h1>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trải nghiệm tương tác di tích VR360, xoay cổ vật hoàng gia 3D Photogrammetry, tham gia giải chạy di sản cấp BIB RFID tự động và chạm thẻ NFC tại các điểm du lịch.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={() => setMobileTab("run_events")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Đăng Ký Giải Chạy</span>
                    </button>
                    <button
                      onClick={() => setMobileTab("culture")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
                    >
                      <Landmark className="w-3.5 h-3.5 text-[#8C653B]" />
                      <span>Xem Bảo Tàng 3D</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Quick Category Shortcuts - Light Theme */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => {
                    setMobileTab("culture");
                    setCultureSubTab("heritage");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D8B282] shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-[#8C653B]">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900">Di Sản Văn Hóa</div>
                    <div className="text-[11px] text-slate-500">VR360 & Tem GPS</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("culture");
                    setCultureSubTab("museum");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D8B282] shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900">Bảo Tàng 3D</div>
                    <div className="text-[11px] text-slate-500">Audio Guide AI</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("run_events");
                    setRunSubTab("run");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D8B282] shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                      <Flame className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900">Giải Chạy Marathon</div>
                    <div className="text-[11px] text-slate-500">Timing RFID & BIB</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setMobileTab("wallet");
                    setWalletSubTab("tickets");
                  }}
                  className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D8B282] shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900">Ví Vé Điện Tử</div>
                    <div className="text-[11px] text-slate-500">QR Check-in 24/7</div>
                  </div>
                </div>
              </div>

              {/* Citizen Passport Widget Card - Light Theme */}
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    HỘ CHIẾU CÔNG DÂN SỐ VIỆT NAM (CITIZEN PASS)
                  </div>
                  <p className="text-xs text-slate-700">
                    Đã tích lũy <strong className="text-amber-800 font-bold">{currentUser.stampsCount} con dấu</strong> di sản & <strong className="text-amber-800 font-bold">{currentUser.medalsCount} huy chương</strong> giải chạy finisher.
                  </p>
                </div>
                <button
                  onClick={() => setCitizenPassOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow-md whitespace-nowrap active:scale-95 transition-all"
                >
                  Mở Hộ Chiếu
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SỰ KIỆN & GIẢI CHẠY */}
          {mobileTab === "run_events" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setRunSubTab("run")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    runSubTab === "run"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Giải Chạy & Timing RFID
                </button>
                <button
                  onClick={() => setRunSubTab("sport")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    runSubTab === "sport"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
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
              <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setCultureSubTab("heritage")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "heritage"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Di Sản & VR360
                </button>
                <button
                  onClick={() => setCultureSubTab("museum")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "museum"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Bảo Tàng 3D
                </button>
                <button
                  onClick={() => setCultureSubTab("archive")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cultureSubTab === "archive"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
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
              <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setWalletSubTab("tickets")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    walletSubTab === "tickets"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Ví Vé Tham Quan & Giải Chạy
                </button>
                <button
                  onClick={() => setWalletSubTab("review")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    walletSubTab === "review"
                      ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center space-y-3 shadow-sm">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#F6E1C3] via-[#D8B282] to-[#8C653B] p-[3px] shadow-md">
                  <div className="h-full w-full rounded-full bg-slate-50 flex items-center justify-center">
                    <User className="h-10 w-10 text-[#8C653B]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
                  <p className="text-xs text-slate-500">{currentUser.phone || "Tài khoản khách vãng lai"}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Hồ Sơ: {currentUser.accountType} {currentUser.bibNumber && `• BIB #${currentUser.bibNumber}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xl font-bold font-serif text-[#8C653B]">{currentUser.stampsCount}</div>
                    <div className="text-[11px] text-slate-500">Tem Di Tích Đã Thu Thập</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xl font-bold font-serif text-emerald-600">{currentUser.medalsCount}</div>
                    <div className="text-[11px] text-slate-500">Huy Chương Finisher</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    Chuyển Đổi / Đăng Nhập Tài Khoản Khác
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng Xuất Tài Khoản Trải Nghiệm
                  </button>
                </div>
              </div>

              {/* Citizen Passport Preview Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-sm text-slate-900">Hộ Chiếu Di Sản Công Dân Số</span>
                  </div>
                  <button
                    onClick={() => setCitizenPassOpen(true)}
                    className="text-xs text-amber-700 font-bold underline"
                  >
                    Xem chi tiết
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Mỗi lần tham quan di tích thực địa hoặc hoàn thành giải chạy marathon, hãy quét mã QR/NFC tại trạm để được đóng con dấu điện tử vĩnh viễn vào Hộ chiếu số.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Mobile PWA Bottom Navigation Bar - Light Theme */}
        <nav
          className={`${
            isEmbedded ? "sticky" : "fixed lg:absolute"
          } bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 py-2 px-3 shadow-lg shrink-0`}
        >
          <div className="flex items-center justify-around max-w-lg mx-auto">
            <button
              onClick={() => setMobileTab("explore")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "explore" ? "text-amber-700 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-bold">Khám Phá</span>
            </button>

            <button
              onClick={() => setMobileTab("run_events")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "run_events" ? "text-amber-700 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Flame className="w-5 h-5" />
              <span className="text-[10px] font-bold">Giải Chạy</span>
            </button>

            <button
              onClick={() => setMobileTab("culture")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "culture" ? "text-amber-700 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span className="text-[10px] font-bold">Di Sản & 3D</span>
            </button>

            <button
              onClick={() => setMobileTab("wallet")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "wallet" ? "text-amber-700 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span className="text-[10px] font-bold">Ví Vé & NFC</span>
            </button>

            <button
              onClick={() => setMobileTab("profile")}
              className={`flex flex-col items-center gap-1 transition-all ${
                mobileTab === "profile" ? "text-amber-700 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold">Cá Nhân</span>
            </button>
          </div>
        </nav>

        {/* Modal Đăng Nhập / Đổi Tài Khoản Trải Nghiệm Riêng - Light Theme */}
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  Tài Khoản Trải Nghiệm ViOne Pass
                </h3>
                <button onClick={() => setAuthModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Tài khoản độc lập dành riêng cho Runner, Du khách & Công dân tham gia hệ thống.
              </p>

              <form onSubmit={handleSaveLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    placeholder="VD: Nguyễn Hải Đăng"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="0988..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vai trò trải nghiệm</label>
                  <select
                    value={loginForm.accountType}
                    onChange={(e) => setLoginForm({ ...loginForm, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    <option value="runner">Vận Động Viên (Runner)</option>
                    <option value="visitor">Du Khách Tham Quan (Visitor)</option>
                    <option value="citizen">Công Dân Số Văn Hóa (Citizen)</option>
                  </select>
                </div>

                {loginForm.accountType === "runner" && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Số BIB Giải Chạy (Nếu có)</label>
                    <input
                      type="text"
                      value={loginForm.bibNumber}
                      onChange={(e) => setLoginForm({ ...loginForm, bibNumber: e.target.value })}
                      placeholder="VD: VNE-42-088"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
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
