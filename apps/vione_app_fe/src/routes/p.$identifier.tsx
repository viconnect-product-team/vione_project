// ViOne Public Executive Profile Card Route (/p/:identifier)
// Public-facing digital card opened from external QR scans (Zalo, Camera, WeChat, etc.)
// DOES NOT require authentication and NEVER redirects to CRM or login.

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import {
  VipBusinessCard,
  type VipCardStyle,
} from "@/components/business-connect/mobile/me/VipBusinessCard";

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

export const Route = createFileRoute("/p/$identifier" as any)({
  ssr: false,
  loader: async ({ params }: { params: any }): Promise<{ state: "public" | "unavailable"; card?: PublicProfileData }> => {
    try {
      const identifier = params?.identifier || "";
      const res = await fetch(getNestApiUrl(`/public/profile/${encodeURIComponent(identifier)}`));
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
  head: ({ loaderData }: any) => {
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
  const loaderData = Route.useLoaderData();
  const rawParams = (Route.useParams() as { identifier?: string }) || {};
  const identifier = rawParams.identifier || "";
  const [profileData, setProfileData] = useState<{ state: "public" | "unavailable"; card?: PublicProfileData }>(loaderData);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Client-side fallback retry if initial SSR/loader had a transient network delay
  useEffect(() => {
    if (loaderData.state !== "public" || !loaderData.card) {
      fetch(getNestApiUrl(`/public/profile/${encodeURIComponent(identifier)}`))
        .then((res) => (res.ok ? res.json() : { state: "unavailable" }))
        .then((data) => {
          if (data && data.state === "public" && data.card) {
            setProfileData(data);
          }
        })
        .catch(() => {});
    } else {
      setProfileData(loaderData);
    }
  }, [loaderData, identifier]);

  const { state, card } = profileData;

  if (state !== "public" || !card) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#070B14] px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8B282]/10 border border-[#D8B282]/30 text-[#D8B282] mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-[#F5E6D3]">Hồ sơ không khả dụng hoặc đã thay đổi</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Mã định danh hoặc đường dẫn danh thiếp này không còn hiệu lực hoặc đang cập nhật trên hệ thống ViOne.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href="https://vione.viconnect.vn/connect-app"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D8B282] to-[#B38E5D] px-5 py-2.5 text-xs font-black uppercase text-[#050A14] shadow-lg shadow-[#D8B282]/20 transition-all hover:brightness-110"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Về App ViOne</span>
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            Thử Tải Lại
          </button>
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

  const [cardStyle, setCardStyle] = useState<VipCardStyle>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("style");
      if (p === "silver") return "silver";
    }
    return (card as any)?.cardStyle === "silver" ? "silver" : "gold";
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-start pb-24 selection:bg-[#D8B282]/30">
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
          <div className="flex items-center gap-2">
            <a
              href="https://vione.viconnect.vn/connect-app"
              className="flex items-center gap-1.5 rounded-full border border-[#D8B282]/50 bg-gradient-to-r from-[#D8B282]/20 to-[#B38E5D]/20 px-3 py-1 text-[11px] font-bold text-[#F5E8D3] hover:from-[#D8B282]/30 hover:to-[#B38E5D]/30 transition shadow-sm"
            >
              <ExternalLink className="h-3 w-3 text-[#DFB76C]" />
              <span>Về App ViOne</span>
            </a>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 transition cursor-pointer"
            >
              <QrIcon className="h-3.5 w-3.5" />
              <span>QR</span>
            </button>
          </div>
        </header>

        {/* Cover Photo Header */}
        {card.coverUrl && (
          <div className="relative h-28 sm:h-36 w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <img
              src={getImageUrl(card.coverUrl)}
              alt="Cover"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-black/30" />
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Đã xác thực</span>
            </div>
          </div>
        )}

        {/* Card Style Switcher (Mạ Vàng vs Mạ Bạc) */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-2">
            Phong cách thẻ:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCardStyle("gold")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                cardStyle === "gold"
                  ? "bg-gradient-to-r from-[#DFB76C] to-[#B38E5D] text-[#0A0703] shadow-md shadow-[#DFB76C]/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="h-3 w-3" />
              <span>Mạ Vàng VIP</span>
            </button>
            <button
              type="button"
              onClick={() => setCardStyle("silver")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                cardStyle === "silver"
                  ? "bg-gradient-to-r from-slate-200 to-slate-400 text-[#0A0703] shadow-md shadow-white/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Mạ Bạc VIP</span>
            </button>
          </div>
        </div>

        {/* The Luxury VIP Business Card with Quick Actions & Profile */}
        <VipBusinessCard
          profile={{
            displayName: card.displayName,
            jobTitle: card.jobTitle,
            companyName: card.companyName,
            primaryPhone: card.primaryPhone,
            primaryEmail: card.primaryEmail,
            website: card.website,
            avatarUrl: card.avatarUrl,
            coverUrl: card.coverUrl,
            bio: card.bio,
            headline: card.headline,
            address: card.address,
            city: card.city,
            industry: card.industry,
            code: card.code,
            zaloUrl: (card as any)?.zaloUrl,
          }}
          style={cardStyle}
          showActions={true}
          onDownloadVcf={handleDownloadVcard}
          onShare={handleShare}
          copied={copied}
        />

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

      {/* Mobile Sticky Floating Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060911]/95 backdrop-blur-xl border-t border-[#D8B282]/30 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <a
            href="https://vione.viconnect.vn/connect-app"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DFB76C] via-[#F2D7B3] to-[#B38E5D] py-3 text-xs font-black uppercase tracking-wider text-[#0A0703] shadow-lg shadow-[#DFB76C]/25 hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Về App ViOne</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadVcard}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-bold text-slate-200 hover:bg-white/10 active:scale-[0.98] transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#DFB76C]" />
            <span>Lưu Danh Bạ</span>
          </button>
        </div>
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
