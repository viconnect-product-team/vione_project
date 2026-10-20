// ViOne Public Executive Profile Card Route (/p/:identifier)
// Public-facing digital card opened from external QR scans (Zalo, Camera, WeChat, etc.)
// DOES NOT require authentication and NEVER redirects to CRM or login.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Building2,
  Share2,
  Download,
  Check,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Copy,
  Sparkles,
  QrCode as QrIcon,
  Crown,
} from "lucide-react";
import { QrCanvas } from "@/components/member/QrCanvas";
import { getNestApiUrl } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { toast } from "sonner";

export type PublicProfileData = {
  id: string;
  userId?: string;
  code?: string;
  displayName: string;
  fullName?: string;
  headline?: string;
  jobTitle?: string;
  companyName?: string;
  bio?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  address?: string | null;
  city?: string | null;
  countryCode?: string;
  industry?: string | null;
  verified?: boolean;
  shareUrl?: string;
};

export const Route = createFileRoute("/p/$identifier")({
  ssr: false,
  loader: async ({ params }): Promise<{ state: "public" | "unavailable"; card?: PublicProfileData }> => {
    try {
      const res = await fetch(getNestApiUrl(`/public/profile/${encodeURIComponent(params.identifier)}`));
      if (!res.ok) {
        return { state: "unavailable" };
      }
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("[PublicProfile] Loader error:", e);
      return { state: "unavailable" };
    }
  },
  head: ({ loaderData }) => {
    const card = loaderData?.card;
    const name = card?.displayName || "Doanh Nhân ViOne";
    const company = card?.companyName || "Hệ sinh thái Doanh nhân ViOne";
    const title = `${name} · ${company} — Danh thiếp số ViOne`;
    const description = card?.headline || card?.bio || "Hồ sơ danh thiếp số doanh nhân được xác thực bởi ViOne.";
    const ogImage = card?.avatarUrl ? getImageUrl(card.avatarUrl) : "https://vione.viconnect.vn/vione-gold-192.png";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
  component: PublicExecutiveProfilePage,
});

function PublicExecutiveProfilePage() {
  const { state, card } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (state !== "public" || !card) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#070B14] px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8B282]/10 border border-[#D8B282]/30 text-[#D8B282] mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-[#F5E6D3]">Hồ sơ không khả dụng hoặc đã thay đổi</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Mã định danh hoặc đường dẫn danh thiếp này không còn hiệu lực trên hệ thống ViOne.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href="https://vione.viconnect.vn"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D8B282] to-[#B38E5D] px-5 py-2.5 text-xs font-bold text-[#050A14] shadow-lg shadow-[#D8B282]/20 transition-all hover:brightness-110"
          >
            Về Trang chủ ViOne
          </a>
        </div>
      </main>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : card.shareUrl || `https://vione.viconnect.vn/p/${card.code || card.id}`;
  const cleanPhone = (card.primaryPhone || "").replace(/[^\d+]/g, "");

  const handleDownloadVcard = () => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${card.displayName || "Doanh Nhân ViOne"}`,
      `N:${card.displayName || "Doanh Nhân ViOne"};;;;`,
    ];
    if (card.companyName) lines.push(`ORG:${card.companyName}`);
    if (card.jobTitle) lines.push(`TITLE:${card.jobTitle}`);
    if (card.primaryPhone) lines.push(`TEL;TYPE=WORK,VOICE:${card.primaryPhone}`);
    if (card.primaryEmail) lines.push(`EMAIL;TYPE=PREF,INTERNET:${card.primaryEmail}`);
    if (card.website) lines.push(`URL:${card.website}`);
    if (card.address) lines.push(`ADR;TYPE=WORK:;;${card.address};${card.city || ""};;;VN`);
    if (card.headline || card.bio) lines.push(`NOTE:${(card.headline || card.bio || "").replace(/\n/g, " ")}`);
    lines.push(`URL;TYPE=ViOne:${currentUrl}`);
    lines.push("END:VCARD");

    const vcfString = lines.join("\r\n");
    const blob = new Blob([vcfString], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${(card.displayName || "contact").replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Đã tải tệp danh bạ (.vcf). Bấm mở để lưu vào điện thoại!");
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Danh thiếp số ViOne - ${card.displayName}`,
          text: `Kết nối với ${card.displayName} (${card.jobTitle} tại ${card.companyName}) qua ViOne:`,
          url: currentUrl,
        });
        return;
      } catch {
        // Dismissed share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Đã sao chép liên kết danh thiếp vào bộ nhớ tạm!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Không thể sao chép liên kết");
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-start pb-12 selection:bg-[#D8B282]/30">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#D8B282]/15 via-[#B38E5D]/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[30%] -right-40 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-4 pt-4 sm:pt-8 flex flex-col gap-4">
        {/* Top Branding Bar */}
        <header className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8B282] to-[#8C653B] text-[#050A14] font-black text-sm shadow-md shadow-[#D8B282]/20">
              V
            </div>
            <div>
              <span className="text-[13px] font-black tracking-widest text-[#D8B282] block leading-none">
                VIONE
              </span>
              <span className="text-[8.5px] font-semibold tracking-wider text-slate-400 block mt-0.5">
                BUSINESS NETWORK
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#D8B282]/30 bg-[#D8B282]/10 px-3 py-1 text-[11px] font-medium text-[#D8B282]">
            <Crown className="h-3 w-3 text-[#D8B282]" />
            <span>Doanh nhân ViOne</span>
          </div>
        </header>

        {/* Profile Digital Card Container */}
        <div className="overflow-hidden rounded-3xl border border-[#D8B282]/25 bg-gradient-to-b from-[#0F1626] to-[#0A0E18] shadow-2xl shadow-black/80 backdrop-blur-xl">
          {/* Cover Photo */}
          <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-[#182338] via-[#243350] to-[#121A2A] overflow-hidden">
            {card.coverUrl ? (
              <img
                src={getImageUrl(card.coverUrl)}
                alt="Cover"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="font-serif text-9xl font-black text-[#D8B282]">V</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-black/30" />
            
            {/* Verified Floating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Đã xác thực</span>
            </div>
          </div>

          {/* Avatar & Core Identity */}
          <div className="relative px-6 pb-6 pt-0">
            {/* Overlapping Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1 bg-gradient-to-b from-[#F2D7B3] via-[#D8B282] to-[#8C653B] shadow-xl shadow-black/60">
                  <div className="h-full w-full rounded-full overflow-hidden bg-[#0A0E18]">
                    {card.avatarUrl ? (
                      <img
                        src={getImageUrl(card.avatarUrl)}
                        alt={card.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#151D2F] text-2xl sm:text-3xl font-bold text-[#D8B282]">
                        {card.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#D8B282] to-[#F2D7B3] text-[#050A14] shadow-md border-2 border-[#0A0E18]">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>

              {/* Code Badge & QR Trigger */}
              <div className="flex flex-col items-end gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#D8B282]/30 bg-[#D8B282]/10 px-3 py-1.5 text-xs font-semibold text-[#D8B282] hover:bg-[#D8B282]/20 transition"
                >
                  <QrIcon className="h-3.5 w-3.5" />
                  <span>Mã QR</span>
                </button>
                <div className="text-[10px] font-mono font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {card.code || "VIONE-VIP"}
                </div>
              </div>
            </div>

            {/* Name & Titles */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{card.displayName}</span>
              </h1>
              {card.jobTitle && (
                <p className="text-[15px] font-bold text-[#D8B282] flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 shrink-0 text-[#D8B282]" />
                  <span>{card.jobTitle}</span>
                </p>
              )}
              {card.companyName && (
                <p className="text-[14px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{card.companyName}</span>
                </p>
              )}
              {card.headline && (
                <p className="mt-1 text-xs text-slate-400 italic">
                  "{card.headline}"
                </p>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="mt-6 flex flex-col gap-2.5">
              {/* Primary Action: Save to Phone Contacts (vCard) */}
              <button
                type="button"
                onClick={handleDownloadVcard}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D8B282] via-[#E2C39B] to-[#B38E5D] py-3.5 px-4 font-bold text-[#070B14] shadow-lg shadow-[#D8B282]/25 hover:brightness-105 active:scale-[0.99] transition-all"
              >
                <Download className="h-5 w-5" />
                <span className="text-[15px]">Lưu danh bạ vào điện thoại (.vcf)</span>
              </button>

              {/* Quick Communication Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {card.primaryPhone ? (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Gọi điện thoại</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 px-3 text-xs font-medium text-slate-500 cursor-not-allowed"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Chưa có SĐT</span>
                  </button>
                )}

                {card.primaryPhone ? (
                  <a
                    href={`https://zalo.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 py-2.5 px-3 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Nhắn qua Zalo</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] py-2.5 px-3 text-xs font-medium text-slate-500 cursor-not-allowed"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chưa có Zalo</span>
                  </button>
                )}

                {card.primaryEmail ? (
                  <a
                    href={`mailto:${card.primaryEmail}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                  >
                    <Mail className="h-4 w-4 text-[#D8B282]" />
                    <span className="truncate">Gửi Email</span>
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D8B282]/30 bg-[#D8B282]/10 py-2.5 px-3 text-xs font-semibold text-[#D8B282] hover:bg-[#D8B282]/20 transition"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  <span>{copied ? "Đã chép link" : "Chia sẻ hồ sơ"}</span>
                </button>
              </div>
            </div>

            {/* Detailed Information Accordion / Cards */}
            <div className="mt-6 flex flex-col gap-3.5 border-t border-white/10 pt-5">
              {/* Bio */}
              {card.bio && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#D8B282] mb-1.5">
                    Về Doanh Nhân
                  </h2>
                  <p className="text-[13.5px] leading-relaxed text-slate-300 whitespace-pre-line">
                    {card.bio}
                  </p>
                </div>
              )}

              {/* Contact Info List */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#D8B282]">
                  Thông tin kết nối
                </h2>

                {card.primaryPhone && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-slate-400 block">Số điện thoại</span>
                      <a href={`tel:${cleanPhone}`} className="font-semibold text-white hover:underline">
                        {card.primaryPhone}
                      </a>
                    </div>
                  </div>
                )}

                {card.primaryEmail && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-[#D8B282]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-slate-400 block">Hộp thư điện tử</span>
                      <a href={`mailto:${card.primaryEmail}`} className="font-semibold text-white hover:underline truncate block">
                        {card.primaryEmail}
                      </a>
                    </div>
                  </div>
                )}

                {card.website && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-slate-400 block">Trang web doanh nghiệp</span>
                      <a
                        href={card.website.startsWith("http") ? card.website : `https://${card.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{card.website}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {(card.address || card.city) && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-slate-400 block">Trụ sở / Địa chỉ hoạt động</span>
                      <span className="font-medium text-slate-200">
                        {[card.address, card.city].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                )}

                {card.industry && (
                  <div className="flex items-center gap-3 text-[13px]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-slate-400 block">Ngành nghề & Lĩnh vực thế mạnh</span>
                      <span className="font-medium text-slate-200">
                        {card.industry}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner: Connect on ViOne Network */}
        <div className="rounded-2xl border border-[#D8B282]/20 bg-[#D8B282]/5 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-[#F2D7B3]">
              Bạn cũng là Doanh nhân hoặc Nhà lãnh đạo?
            </h3>
            <p className="text-[11.5px] text-slate-400 mt-0.5">
              Kết nối trực tiếp với {card.displayName} qua ViOne App
            </p>
          </div>
          <a
            href="https://vione.viconnect.vn/connect-app"
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#D8B282] to-[#B38E5D] px-3.5 py-2 text-xs font-bold text-[#050A14] shadow-md shadow-[#D8B282]/20 hover:brightness-110 transition"
          >
            Mở ViOne App
          </a>
        </div>

        {/* Footer info */}
        <footer className="mt-2 text-center text-slate-500 text-[11px] flex flex-col items-center gap-1">
          <p>© 2026 ViOne Ecosystem · Nền Tảng Chuyển Đổi Số Doanh Nghiệp</p>
          <a href="https://vione.viconnect.vn" className="text-[#D8B282]/80 hover:underline">
            https://vione.viconnect.vn
          </a>
        </footer>
      </div>

      {/* QR Modal for easy full-screen presentation */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#D8B282]/30 bg-[#0E1524] p-6 text-center text-white shadow-2xl">
            <h3 className="text-base font-bold text-[#F2D7B3]">Mã QR Danh Thiếp Số</h3>
            <p className="mt-1 text-xs text-slate-400">
              Đưa mã này cho đối tác quét trực tiếp bằng Camera hoặc Zalo
            </p>

            <div className="my-6 mx-auto w-fit rounded-2xl bg-white p-4 shadow-xl">
              <QrCanvas value={currentUrl} size={220} />
            </div>

            <p className="text-xs font-mono text-[#D8B282] break-all">{currentUrl}</p>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  toast.success("Đã sao chép liên kết!");
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
                <span>Sao chép</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#D8B282] to-[#B38E5D] py-2.5 text-xs font-bold text-[#050A14]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
