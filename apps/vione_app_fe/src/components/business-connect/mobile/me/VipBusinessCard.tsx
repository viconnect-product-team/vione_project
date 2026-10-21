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

        {/* Card Body: Photo & Name & Info */}
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

          {/* Member Text Info - High Contrast & Sharp Legibility */}
          <div className="min-w-0 flex-1">
            <h3
              className={`text-lg sm:text-xl font-black tracking-tight leading-snug truncate drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)] ${
                isGold ? "text-[#FFFDF7]" : "text-white"
              }`}
            >
              {displayName}
            </h3>

            {profile.jobTitle && (
              <p
                className={`text-[13px] font-extrabold mt-0.5 flex items-center gap-1.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                  isGold ? "text-[#FDE047]" : "text-white"
                }`}
              >
                <Briefcase className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-[#F59E0B]" : "text-slate-200"}`} />
                <span className="truncate">{profile.jobTitle}</span>
              </p>
            )}

            {profile.companyName && (
              <p className="text-[12.5px] font-bold text-white mt-0.5 flex items-center gap-1.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                <Building2 className={`h-3.5 w-3.5 shrink-0 ${isGold ? "text-amber-300" : "text-slate-300"}`} />
                <span className="truncate">{profile.companyName}</span>
              </p>
            )}

            {visibleFields.phone && profile.primaryPhone && (
              <p
                className={`text-[12.5px] font-bold font-mono mt-1 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
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
      {/* 2. QUICK ACTION BUTTONS & LINKS (BÊN DƯỚI THẺ)               */}
      {/* ============================================================== */}
      {showActions && (
        <div className="flex flex-col gap-2.5">
          {/* Primary Action: Lưu danh bạ (.vcf) */}
          {onDownloadVcf && (
            <button
              type="button"
              onClick={onDownloadVcf}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#DFB76C] via-[#F2D7B3] to-[#B38E5D] py-3.5 px-4 font-black text-[#0A0703] shadow-lg shadow-[#DFB76C]/25 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Download className="h-5 w-5" />
              <span className="text-[14.5px]">Lưu danh bạ vào điện thoại (.vcf)</span>
            </button>
          )}

          {/* Quick Communication Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Call button */}
            {visibleFields.phone && cleanPhone ? (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 px-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <Phone className="h-4 w-4" />
                <span>Gọi điện thoại</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 px-3 text-xs font-medium text-slate-500 opacity-60">
                <Phone className="h-4 w-4" />
                <span>Gọi điện</span>
              </div>
            )}

            {/* Zalo button */}
            {visibleFields.zalo && zaloLink ? (
              <a
                href={zaloLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2.5 px-3 text-xs font-bold text-sky-400 hover:bg-sky-500/20 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Nhắn qua Zalo</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 px-3 text-xs font-medium text-slate-500 opacity-60">
                <MessageCircle className="h-4 w-4" />
                <span>Nhắn Zalo</span>
              </div>
            )}

            {/* Website Link */}
            {visibleFields.website && webLink ? (
              <a
                href={webLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 px-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition truncate"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span className="truncate">Trang web / Link</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 px-3 text-xs font-medium text-slate-500 opacity-60">
                <Globe className="h-4 w-4" />
                <span>Trang web</span>
              </div>
            )}

            {/* Share profile button */}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DFB76C]/40 bg-[#DFB76C]/10 py-2.5 px-3 text-xs font-bold text-[#DFB76C] hover:bg-[#DFB76C]/20 transition cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span>{copied ? "Đã chép link" : "Chia sẻ hồ sơ"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PROFILE CÁ NHÂN (BÊN DƯỚI NỮA)                            */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB76C] flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#DFB76C]" />
          <span>Hồ sơ cá nhân & Doanh nghiệp</span>
        </h4>

        {/* Bio / Giới thiệu */}
        {visibleFields.bio && (profile.bio || profile.headline) && (
          <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-[13px] leading-relaxed text-slate-300 whitespace-pre-line">
            <span className="font-semibold text-white block text-xs text-[#DFB76C] mb-1">
              Giới thiệu doanh nhân:
            </span>
            {profile.bio || profile.headline}
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div className="grid gap-2 text-[12.5px] pt-1">
          {visibleFields.email && profile.primaryEmail && (
            <div className="flex items-center gap-2.5 py-1">
              <Mail className="h-4 w-4 text-[#DFB76C] shrink-0" />
              <span className="text-slate-400">Email:</span>
              <a
                href={`mailto:${profile.primaryEmail}`}
                className="font-medium text-white hover:underline truncate"
              >
                {profile.primaryEmail}
              </a>
            </div>
          )}

          {visibleFields.address && (profile.address || profile.city) && (
            <div className="flex items-center gap-2.5 py-1">
              <MapPin className="h-4 w-4 text-[#DFB76C] shrink-0" />
              <span className="text-slate-400">Địa chỉ:</span>
              <span className="font-medium text-white truncate">
                {[profile.address, profile.city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {profile.industry && (
            <div className="flex items-center gap-2.5 py-1">
              <Briefcase className="h-4 w-4 text-[#DFB76C] shrink-0" />
              <span className="text-slate-400">Lĩnh vực:</span>
              <span className="font-medium text-white truncate">{profile.industry}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
