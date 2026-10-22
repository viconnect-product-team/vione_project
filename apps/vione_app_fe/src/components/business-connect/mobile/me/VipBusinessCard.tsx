// ViOne Luxury VIP Business Card Component (Mạ Vàng Champagne Gold / Mạ Bạc Bạch Kim)
// Used in QR Scanned Profile (/p/:identifier), Preview Sheet in /connect-app/me, and Digital Business Card.

import React, { useState } from "react";
import {
  Phone,
  Mail,
  Globe,
  Briefcase,
  Building2,
  MapPin,
  ShieldCheck,
  Crown,
  Sparkles,
  Wifi,
  ExternalLink,
  MessageCircle,
  Download,
  Share2,
  Check,
  User,
  Grid,
  Layers,
  ArrowRight,
  Handshake,
} from "lucide-react";
import { getImageUrl } from "@/lib/image";

export type VipCardStyle = "gold" | "silver";

export type VipCardProfile = {
  id?: string;
  code?: string;
  displayName?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  primaryPhone?: string | null;
  primaryEmail?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  address?: string | null;
  city?: string | null;
  industry?: string | null;
  zaloUrl?: string | null;
};

export type VipVisibleFields = {
  phone?: boolean;
  zalo?: boolean;
  email?: boolean;
  website?: boolean;
  bio?: boolean;
  address?: boolean;
};

interface VipBusinessCardProps {
  profile: VipCardProfile;
  style?: VipCardStyle;
  visibleFields?: VipVisibleFields;
  showActions?: boolean;
  onDownloadVcf?: () => void;
  onShare?: () => void;
  copied?: boolean;
}

export function VipBusinessCard({
  profile,
  style = "gold",
  visibleFields = {
    phone: true,
    zalo: true,
    email: true,
    website: true,
    bio: true,
    address: true,
  },
  showActions = true,
  onDownloadVcf,
  onShare,
  copied = false,
}: VipBusinessCardProps) {
  const [imgError, setImgError] = useState(false);
  const [profileType, setProfileType] = useState<"personal" | "business">("personal");
  const [patternType, setPatternType] = useState<"square" | "triangle" | "crystal">("square");

  const isGold = style === "gold";
  const displayName = profile.displayName || "Doanh Nhân ViOne";
  const cleanPhone = (profile.primaryPhone || "").replace(/[^\d+]/g, "");
  const zaloPhone = cleanPhone.replace(/^\+84/, "0").replace(/^84/, "0");
  const zaloLink = profile.zaloUrl || (zaloPhone ? `https://zalo.me/${zaloPhone}` : null);
  const webLink = profile.website
    ? profile.website.startsWith("http")
      ? profile.website
      : `https://${profile.website}`
    : null;

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "VO";

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ============================================================== */}
      {/* 1. PHYSICAL LUXURY VIP CARD (MẠ VÀNG HOẶC MẠ BẠC)            */}
      {/* QUY CHUẨN: TRÊN THẺ CHỈ CÓ TÊN, CÔNG TY, SỐ ĐIỆN THOẠI       */}
      {/* ============================================================== */}
      <div
        className={`relative w-full overflow-hidden rounded-3xl p-5 sm:p-6 transition-all shadow-2xl select-none ${
          isGold
            ? "border-2 border-[#DFB76C]/80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2A1F0D] via-[#140F06] to-[#0A0703] text-[#F5E8D3] shadow-[0_12px_40px_rgba(223,183,108,0.28)]"
            : "border-2 border-slate-300/80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#242E3D] via-[#111620] to-[#080B10] text-[#F1F5F9] shadow-[0_12px_40px_rgba(203,213,225,0.22)]"
        }`}
      >
        {/* Metallic Foil Sheen Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.4)_0%,_transparent_40%)]" />
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-25 ${
            isGold ? "bg-[#DFB76C]" : "bg-slate-300"
          }`}
        />
        <div
          className={`pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full blur-3xl opacity-15 ${
            isGold ? "bg-[#B38E5D]" : "bg-sky-400"
          }`}
        />

        {/* Card Header: Chip, Contactless, & VIP Emblem */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Realistic Metallic Smart Chip */}
            <div
              className={`relative h-9 w-12 rounded-lg border p-1 shadow-inner overflow-hidden ${
                isGold
                  ? "border-[#DFB76C]/70 bg-gradient-to-br from-[#FFE5B4] via-[#D8B282] to-[#8C653B]"
                  : "border-slate-300/70 bg-gradient-to-br from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]"
              }`}
            >
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] opacity-40">
                <div className="border-r border-b border-black/40" />
                <div className="border-b border-black/40" />
                <div className="border-r border-black/40" />
                <div />
              </div>
              <div className="absolute inset-x-2 inset-y-1.5 rounded-sm border border-black/30" />
            </div>

            {/* Contactless Waves Icon */}
            <Wifi
              className={`h-5 w-5 rotate-90 opacity-85 ${
                isGold ? "text-[#DFB76C]" : "text-slate-200"
              }`}
            />
          </div>

          {/* Luxury Badge: GOLD VIP vs SILVER VIP */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black tracking-wider uppercase border shadow-md ${
              isGold
                ? "border-[#DFB76C]/70 bg-gradient-to-r from-[#DFB76C]/35 to-[#B38E5D]/20 text-[#FFF3D6] shadow-[0_2px_8px_rgba(223,183,108,0.3)]"
                : "border-slate-300/70 bg-gradient-to-r from-slate-200/25 to-slate-400/15 text-white shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
            }`}
          >
            <Crown className={`h-3.5 w-3.5 ${isGold ? "text-[#FFD580]" : "text-slate-100"}`} />
            <span>{isGold ? "VIP MẠ VÀNG" : "VIP MẠ BẠC"}</span>
          </div>
        </div>

        {/* Card Body: Photo & TÊN, CÔNG TY, SỐ ĐIỆN THOẠI (CHỈ THẾ THÔI) */}
        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar with Metallic Halo */}
          <div className="relative shrink-0">
            <div
              className={`h-20 w-20 sm:h-22 sm:w-22 rounded-2xl p-[2.5px] shadow-xl ${
                isGold
                  ? "bg-gradient-to-tr from-[#FFE6C2] via-[#DFB76C] to-[#8C653B]"
                  : "bg-gradient-to-tr from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]"
              }`}
            >
              <div className="h-full w-full rounded-[14px] overflow-hidden bg-black/80">
                {profile.avatarUrl && !imgError ? (
                  <img
                    src={getImageUrl(profile.avatarUrl)}
                    alt={displayName}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full flex items-center justify-center font-black text-xl tracking-wider select-none ${
                      isGold
                        ? "text-[#FFD580] bg-gradient-to-br from-[#2E200C] to-[#120D05]"
                        : "text-white bg-gradient-to-br from-[#242E3D] to-[#0D121B]"
                    }`}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>
            {/* Sparkle Verification Pin */}
            <div
              className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0A0703] shadow-md ${
                isGold
                  ? "bg-gradient-to-tr from-[#DFB76C] to-[#FFF3D6] text-slate-950"
                  : "bg-gradient-to-tr from-slate-200 to-white text-slate-950"
              }`}
            >
              <Sparkles className="h-3 w-3 fill-current" />
            </div>
          </div>

          {/* Member Text Info - Strictly Tên, Công ty, Số điện thoại */}
          <div className="min-w-0 flex-1 space-y-1">
            <h3
              className={`text-lg sm:text-xl font-black tracking-tight leading-snug truncate drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)] ${
                isGold ? "text-[#FFFDF7]" : "text-white"
              }`}
            >
              {displayName}
            </h3>

            {profile.companyName ? (
              <p className="text-[13px] font-bold text-slate-100 flex items-center gap-1.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                <Building2 className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-amber-300" : "text-slate-300"}`} />
                <span className="truncate">{profile.companyName}</span>
              </p>
            ) : (
              <p className="text-[12.5px] font-semibold text-slate-300 flex items-center gap-1.5 truncate">
                <Building2 className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-amber-300" : "text-slate-400"}`} />
                <span className="truncate">Thành viên Doanh nhân ViOne</span>
              </p>
            )}

            {visibleFields.phone && profile.primaryPhone && (
              <p
                className={`text-[13px] font-bold font-mono flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                  isGold ? "text-[#FDE68A]" : "text-slate-100"
                }`}
              >
                <Phone className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-[#F59E0B]" : "text-slate-300"}`} />
                <span>{profile.primaryPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Card Footer: Brand watermark & Code */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-black tracking-wider">
            <span className={isGold ? "text-[#F5C46B] font-extrabold drop-shadow-xs" : "text-white font-extrabold drop-shadow-xs"}>
              VIONE NETWORK
            </span>
            <span className="text-amber-200/80 font-semibold">| VIP EXECUTIVE</span>
          </div>
          <div className="font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded bg-black/70 border border-amber-400/40 text-amber-300 shadow-sm">
            {profile.code || "VIONE-VIP"}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CỤM NÚT HÀNH ĐỘNG GRADIENT CAO CẤP (BÊN DƯỚI THẺ)         */}
      {/* TUÂN THỦ STRICT RULE 8: 100% NÚT LÀ DẢI MÀU GRADIENT           */}
      {/* ============================================================== */}
      {showActions && (
        <div className="flex flex-col gap-2.5">
          {/* Primary Action: Lưu danh bạ (.vcf) - Royal Champagne Gold Gradient */}
          {onDownloadVcf && (
            <button
              type="button"
              onClick={onDownloadVcf}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#FAF3DD_0%,#F6E1C3_25%,#D8B282_60%,#C29B69_100%)] py-3.5 px-4 font-black text-slate-950 shadow-[0_8px_24px_rgba(216,178,130,0.35)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer border border-[#FFE5B4]/60"
            >
              <Download className="h-5 w-5 text-slate-950" />
              <span className="text-[14.5px]">Lưu danh bạ vào điện thoại (.vcf)</span>
            </button>
          )}

          {/* Quick Communication Grid: 4 nút hành động chuẩn gradient */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Call button - Emerald Green Gradient */}
            {visibleFields.phone && cleanPhone ? (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#059669_0%,#10B981_50%,#047857_100%)] text-white py-3 px-3 text-xs font-black shadow-md shadow-emerald-950/40 border border-emerald-400/40 hover:brightness-110 active:scale-98 transition"
              >
                <Phone className="h-4 w-4 text-white" />
                <span>Gọi điện thoại</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800/40 border border-white/5 py-3 px-3 text-xs font-medium text-slate-500 opacity-60">
                <Phone className="h-4 w-4" />
                <span>Gọi điện</span>
              </div>
            )}

            {/* 2. Zalo button - Zalo Blue Gradient sắc nét tương phản cao */}
            {visibleFields.zalo && zaloLink ? (
              <a
                href={zaloLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0088FF_0%,#0066CC_50%,#0052A3_100%)] text-white py-3 px-3 text-xs font-black shadow-md shadow-blue-950/40 border border-blue-400/40 hover:brightness-110 active:scale-98 transition"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>Nhắn qua Zalo</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800/40 border border-white/5 py-3 px-3 text-xs font-medium text-slate-500 opacity-60">
                <MessageCircle className="h-4 w-4" />
                <span>Nhắn Zalo</span>
              </div>
            )}

            {/* 3. Website Link - Obsidian Gold Gradient */}
            {visibleFields.website && webLink ? (
              <a
                href={webLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1E293B_0%,#0F172A_100%)] text-[#F6E1C3] py-3 px-3 text-xs font-bold border border-[#D8B282]/50 shadow-md hover:border-[#D8B282] hover:brightness-110 active:scale-98 transition truncate"
              >
                <Globe className="h-4 w-4 shrink-0 text-[#DFB76C]" />
                <span className="truncate">Trang web / Link</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800/40 border border-white/5 py-3 px-3 text-xs font-medium text-slate-500 opacity-60">
                <Globe className="h-4 w-4" />
                <span>Trang web</span>
              </div>
            )}

            {/* 4. Share profile button - Obsidian Gold Gradient */}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2A1F0D_0%,#140F06_100%)] text-[#F6E1C3] py-3 px-3 text-xs font-bold border border-[#D8B282]/60 shadow-md hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-[#DFB76C]" />}
                <span>{copied ? "Đã chép link" : "Chia sẻ hồ sơ"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. HỒ SƠ CÁ NHÂN & DOANH NGHIỆP DỰNG SẴN ĐA DẠNG BỐ CỤC      */}
      {/* CÓ ẢNH NỀN HÌNH VUÔNG, TAM GIÁC, ĐA DIỆN GEOMETRIC LUXURY     */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-3 rounded-3xl border border-[#D8B282]/30 bg-[#0A0D14] p-4 sm:p-5 text-slate-200 shadow-xl overflow-hidden relative">
        {/* Vector Background Graphic: Hình Vuông hoặc Tam Giác */}
        {patternType === "square" && (
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vip-square-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="34" height="34" fill="none" stroke="#D8B282" strokeWidth="0.7" strokeDasharray="3 2" />
                <rect x="6" y="6" width="10" height="10" fill="#D8B282" fillOpacity="0.18" />
                <rect x="20" y="20" width="8" height="8" fill="#D8B282" fillOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vip-square-pattern)" />
          </svg>
        )}

        {patternType === "triangle" && (
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vip-triangle-pattern" width="44" height="44" patternUnits="userSpaceOnUse">
                <polygon points="22,0 44,44 0,44" fill="none" stroke="#DFB76C" strokeWidth="0.8" />
                <polygon points="22,0 44,44 22,44" fill="#DFB76C" fillOpacity="0.1" />
                <line x1="0" y1="22" x2="44" y2="22" stroke="#DFB76C" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vip-triangle-pattern)" />
          </svg>
        )}

        {patternType === "crystal" && (
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vip-crystal-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25 0 L50 25 L25 50 L0 25 Z" fill="none" stroke="#D8B282" strokeWidth="0.8" />
                <path d="M25 10 L40 25 L25 40 L10 25 Z" fill="#D8B282" fillOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vip-crystal-pattern)" />
          </svg>
        )}

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#D8B282]/15 blur-2xl" />

        {/* Header Controls: Chọn Loại Hồ Sơ & Chọn Mẫu Nền */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          {/* Switch Hồ Sơ Cá Nhân vs Doanh Nghiệp */}
          <div className="flex items-center gap-1 rounded-2xl bg-black/60 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setProfileType("personal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                profileType === "personal"
                  ? "bg-[linear-gradient(135deg,#FAF3DD_0%,#F6E1C3_25%,#D8B282_60%,#C29B69_100%)] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              type="button"
              onClick={() => setProfileType("business")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                profileType === "business"
                  ? "bg-[linear-gradient(135deg,#FAF3DD_0%,#F6E1C3_25%,#D8B282_60%,#C29B69_100%)] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Hồ sơ doanh nghiệp</span>
            </button>
          </div>

          {/* Switch Kiểu Nền Hình Vuông / Tam Giác */}
          <div className="flex items-center gap-1 self-start sm:self-auto text-[11px] font-semibold text-slate-400">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 pr-1">Mẫu nền:</span>
            <button
              type="button"
              onClick={() => setPatternType("square")}
              title="Ảnh nền khối hình vuông hiện đại"
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                patternType === "square"
                  ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#F6E1C3]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              ■ Vuông
            </button>
            <button
              type="button"
              onClick={() => setPatternType("triangle")}
              title="Ảnh nền khối tam giác đa giác tinh xảo"
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                patternType === "triangle"
                  ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#F6E1C3]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              ▲ Tam giác
            </button>
            <button
              type="button"
              onClick={() => setPatternType("crystal")}
              title="Ảnh nền tinh thể đa diện"
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                patternType === "crystal"
                  ? "border-[#DFB76C] bg-[#DFB76C]/20 text-[#F6E1C3]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              ◆ Tinh thể
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* NỘI DUNG 1: HỒ SƠ CÁ NHÂN                                     */}
        {/* ============================================================== */}
        {profileType === "personal" && (
          <div className="relative z-10 flex flex-col gap-3 pt-1 animate-in fade-in duration-200">
            {/* Header tóm lược cá nhân */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl border border-[#DFB76C]/60 bg-gradient-to-br from-[#1E2738] to-[#0A0D14] flex items-center justify-center font-black text-amber-300 shadow-md shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-black text-white truncate">
                  {displayName}
                </h4>
                <p className="text-xs font-semibold text-amber-400/90 truncate">
                  {profile.jobTitle || "Doanh nhân & Lãnh đạo cấp cao"}
                </p>
              </div>
            </div>

            {/* Bio / Tầm nhìn doanh nhân */}
            {visibleFields.bio && (profile.bio || profile.headline) && (
              <div className="rounded-2xl bg-black/50 border border-white/10 p-3.5 text-[12.5px] leading-relaxed text-slate-300">
                <span className="text-[#DFB76C] font-bold block text-[11px] uppercase tracking-wider mb-1">
                  Giới thiệu & Triết lý kinh doanh:
                </span>
                "{profile.bio || profile.headline}"
              </div>
            )}

            {/* Thông tin liên hệ cá nhân chi tiết */}
            <div className="grid gap-2 rounded-2xl bg-white/[0.02] border border-white/5 p-3 text-[12px]">
              {visibleFields.phone && profile.primaryPhone && (
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#DFB76C]" />
                    <span>Điện thoại:</span>
                  </span>
                  <a href={`tel:${cleanPhone}`} className="font-bold text-white font-mono hover:text-[#DFB76C]">
                    {profile.primaryPhone}
                  </a>
                </div>
              )}

              {visibleFields.email && profile.primaryEmail && (
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#DFB76C]" />
                    <span>Email làm việc:</span>
                  </span>
                  <a href={`mailto:${profile.primaryEmail}`} className="font-bold text-white truncate hover:underline">
                    {profile.primaryEmail}
                  </a>
                </div>
              )}

              {visibleFields.address && (profile.address || profile.city) && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#DFB76C]" />
                    <span>Khu vực:</span>
                  </span>
                  <span className="font-semibold text-slate-200 truncate">
                    {[profile.address, profile.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Chips Giá Trị & Năng Lực Kết Nối */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#DFB76C]/15 border border-[#DFB76C]/30 text-[#F6E1C3]">
                ★ Lãnh Đạo Cấp Cao
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-white/5 border border-white/10 text-slate-300">
                ✦ Kết Nối B2B
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-white/5 border border-white/10 text-slate-300">
                ✦ Đầu Tư & Chiến Lược
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* NỘI DUNG 2: HỒ SƠ DOANH NGHIỆP                                */}
        {/* ============================================================== */}
        {profileType === "business" && (
          <div className="relative z-10 flex flex-col gap-3.5 pt-1 animate-in fade-in duration-200">
            {/* Header Thông Tin Doanh Nghiệp */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl border border-[#DFB76C]/60 bg-gradient-to-br from-[#2E200C] to-[#0A0703] flex items-center justify-center text-amber-300 shadow-md shrink-0">
                <Building2 className="h-6 w-6 text-[#DFB76C]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-black text-white truncate">
                  {profile.companyName || "Tập đoàn Đầu tư & Công nghệ ViOne"}
                </h4>
                <p className="text-xs font-semibold text-amber-400/90 truncate flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>{profile.industry || "Công nghệ, Thương mại & Đầu tư đa ngành"}</span>
                </p>
              </div>
            </div>

            {/* Giới thiệu năng lực doanh nghiệp */}
            <div className="rounded-2xl bg-black/50 border border-white/10 p-3.5 text-[12.5px] leading-relaxed text-slate-300">
              <span className="text-[#DFB76C] font-bold block text-[11px] uppercase tracking-wider mb-1">
                Năng Lực & Sứ Mệnh Doanh Nghiệp:
              </span>
              Cung cấp giải pháp kết nối chuyển đổi số toàn diện cho doanh nhân, tối ưu hóa chuỗi cung ứng và mở rộng giao thương quốc tế.
            </div>

            {/* Thông tin pháp lý & Trụ sở chính */}
            <div className="grid gap-2 rounded-2xl bg-white/[0.02] border border-white/5 p-3 text-[12px]">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Trụ sở chính:</span>
                <span className="font-bold text-slate-200 truncate">
                  {[profile.address, profile.city].filter(Boolean).join(", ") || "Hà Nội, Việt Nam"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Hotline đối tác:</span>
                <a href={`tel:${cleanPhone}`} className="font-bold text-white font-mono hover:text-[#DFB76C]">
                  {profile.primaryPhone || "1900 xxxx"}
                </a>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Website chính thức:</span>
                <a
                  href={webLink || "https://vione.vn"}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#DFB76C] flex items-center gap-1 hover:underline truncate"
                >
                  <span>{profile.website ? profile.website.replace(/^https?:\/\//, "") : "vione.vn"}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Nút Kêu Gọi Hợp Tác B2B Trực Tiếp - Chuẩn Gradient */}
            <a
              href={zaloLink || `tel:${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[linear-gradient(135deg,#FAF3DD_0%,#F6E1C3_25%,#D8B282_60%,#C29B69_100%)] text-slate-950 font-black text-xs shadow-md shadow-[#D8B282]/30 hover:brightness-105 active:scale-98 transition border border-[#FFE5B4]/60 cursor-pointer"
            >
              <Handshake className="h-4 w-4 text-slate-950" />
              <span>Đề Xuất Hẹn Gặp Hợp Tác B2B</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
