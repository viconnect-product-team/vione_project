// BC-Mobile-3A — /connect-app/me/card: Present QR.
//
// The owner-facing outbound card experience: pick a persona (published
// business card), present its QR encoding the CANONICAL public URL
// (<origin>/b/<slug>) so a guest scanning it lands on the public digital
// card — never on a private record. Truthful states: unpublished cards are
// selectable but clearly flagged; owners with no cards get a create CTA.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Plus, Star, Edit3 } from "lucide-react";
import { MobilePage } from "@/components/business-connect/mobile/MobilePage";
import { BusinessConnectTopBar } from "@/components/business-connect/mobile/BusinessConnectTopBar";
import { QrCanvas } from "@/components/member/QrCanvas";
import { BusinessCardSDK } from "@/lib/business-card";
import { useMyIdentity } from "@/hooks/use-my-identity";
import type { BusinessCardSummary } from "@/lib/business-card/business-card.types";
import { useT } from "@/lib/i18n";
import { VipBusinessCard } from "@/components/business-connect/mobile/me/VipBusinessCard";

export const Route = createFileRoute("/connect-app/me/card")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Đưa QR — ViOne" },
      {
        name: "description",
        content: "Trình bày mã QR danh thiếp số để người khác quét và lưu liên hệ của bạn.",
      },
      { property: "og:title", content: "Đưa QR — ViOne" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PresentQrPage,
});

/** Canonical public URL the QR encodes — fully qualified, /p/<slug> public digital profile. */
export function canonicalPublicCardUrl(origin: string, slug: string): string {
  let base = "https://vione.viconnect.vn";
  if (origin && origin.includes("vione.viconnect.vn")) {
    base = origin;
  }
  return `${base.replace(/\/+$/, "")}/p/${encodeURIComponent(slug)}`;
}

function PresentQrPage() {
  const t = useT();
  const myIdentity = useMyIdentity();
  const [cards, setCards] = useState<BusinessCardSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    BusinessCardSDK.listGlobal()
      .then((list) => {
        if (!active) return;
        setCards(list);
        const primary = list.find((c) => c.cardKind === "primary") ?? list[0];
        setSelectedId(primary?.id ?? null);
      })
      .catch((e) => {
        console.warn("Could not load cards, fallback to identity:", e);
        if (active) setCards([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const list = cards ?? [];
  const selected = useMemo(() => list.find((c) => c.id === selectedId) ?? null, [list, selectedId]);
  const published = selected?.status === "published";
  const origin = typeof window !== "undefined" && window.location.origin.includes("vione.viconnect.vn")
    ? window.location.origin
    : "https://vione.viconnect.vn";
  const qrValue = selected ? canonicalPublicCardUrl(origin, selected.slug) : "";

  const identity = myIdentity.data?.identity;
  const fallbackQrValue = identity?.ownerUserId
    ? `${origin}/p/${identity.ownerUserId}`
    : `${origin}/p/VIONE-VIP`;

  return (
    <MobilePage>
      <BusinessConnectTopBar title="Danh thiếp số & Đưa QR" back />
      <section className="flex flex-1 flex-col items-center pt-4 pb-12 w-full max-w-md mx-auto px-4">
        {cards === null && !identity ? (
          <Loader2 className="mt-16 size-6 animate-spin text-[var(--bc-mobile-muted)]" />
        ) : list.length === 0 ? (
          identity ? (
            <div className="mt-2 flex flex-col items-center w-full space-y-5">
              {/* Luxury VIP Business Card Preview */}
              <div className="w-full">
                <VipBusinessCard
                  profile={{
                    displayName: identity.displayName || "Doanh nhân ViOne",
                    jobTitle: identity.jobTitle,
                    companyName: identity.companyName,
                    primaryPhone: identity.primaryPhone,
                    primaryEmail: identity.primaryEmail,
                    website: identity.website,
                    avatarUrl: identity.avatarUrl,
                    bio: identity.bio,
                    address: identity.address,
                    city: identity.city,
                  }}
                  style="gold"
                  showActions={false}
                />
              </div>

              {/* QR Code Presentation Box */}
              <div className="flex flex-col items-center p-5 rounded-[28px] bg-white text-slate-900 shadow-xl border border-amber-300/40 w-full max-w-[280px]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  MÃ QR KẾT NỐI NHANH
                </p>
                <QrCanvas
                  value={fallbackQrValue}
                  size={210}
                  logoUrl={identity.avatarUrl}
                  logoScale={0.22}
                />
                <p className="mt-3 text-[11px] text-center text-slate-500 font-medium">
                  Đối tác quét bằng Camera hoặc Zalo để lưu danh bạ
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/connect-app/me/edit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bc-mobile-border-gold)] px-5 text-[14px] font-semibold text-[var(--bc-mobile-text)] hover:bg-[var(--bc-mobile-surface-2)] transition-colors"
                >
                  <Edit3 className="size-4 text-[#D8B282]" />
                  <span>Chỉnh sửa hồ sơ</span>
                </Link>
                <a
                  href={fallbackQrValue}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--bc-mobile-accent-grad)] text-black px-5 text-[14px] font-bold shadow-md hover:opacity-95 transition"
                >
                  <ExternalLink className="size-4" />
                  <span>Xem trang công khai</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-[15px] text-[var(--bc-mobile-muted)]">
                {t("bc.mobile.presentQr.empty")}
              </p>
              <Link
                to="/connect-app/me/edit"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bc-cta-gold px-5 text-[15px] font-semibold"
              >
                <Plus className="size-4" />
                {t("bc.mobile.presentQr.create")}
              </Link>
            </div>
          )
        ) : (
          <>
            {list.length > 1 && (
              <fieldset className="w-full max-w-[320px]">
                <legend className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--bc-mobile-muted)]">
                  {t("bc.mobile.presentQr.switchPersona")}
                </legend>
                <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup">
                  {list.map((c: any) => (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={c.id === selectedId}
                      onClick={() => setSelectedId(c.id)}
                      className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-colors ${
                        c.id === selectedId
                          ? "border-[var(--bc-mobile-accent)] bg-[var(--bc-mobile-accent-soft)] text-[var(--bc-mobile-text)]"
                          : "border-[var(--bc-mobile-border)] text-[var(--bc-mobile-muted)]"
                      }`}
                    >
                      {c.cardKind === "primary" && (
                        <Star className="size-3.5 text-[var(--bc-mobile-accent)]" />
                      )}
                      {c.displayName || c.slug}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {selected && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--bc-mobile-muted)]">
                  {t("bc.mobile.presentQr.personaLabel")}
                </p>
                <p className="mt-1 text-[19px] font-semibold text-[var(--bc-mobile-text)]">
                  {selected.displayName || selected.slug}
                </p>
                {(selected.professionalTitle || selected.companyName) && (
                  <p className="text-[14px] text-[var(--bc-mobile-muted)]">
                    {[selected.professionalTitle, selected.companyName].filter(Boolean).join(" · ")}
                  </p>
                )}

                <div className="mt-6 rounded-[28px] bg-white p-5 shadow-[var(--bc-mobile-shadow-v)]">
                  {published ? (
                    <QrCanvas
                      value={qrValue}
                      size={240}
                      logoUrl={selected.avatarUrl}
                      logoScale={0.22}
                    />
                  ) : (
                    <div className="grid h-[240px] w-[240px] place-items-center px-6 text-center">
                      <p className="text-[14px] leading-relaxed text-[var(--bc-mobile-muted)]">
                        {t("bc.mobile.presentQr.unpublished")}
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-5 max-w-[32ch] text-center text-[14px] leading-relaxed text-[var(--bc-mobile-muted)]">
                  {t("bc.mobile.presentQr.hint")}
                </p>

                {published && (
                  <a
                    href={`/b/${encodeURIComponent(selected.slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bc-mobile-border)] px-5 text-[14px] font-medium text-[var(--bc-mobile-text)]"
                  >
                    <ExternalLink className="size-4" />
                    {t("bc.mobile.presentQr.viewPublic")}
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </MobilePage>
  );
}
