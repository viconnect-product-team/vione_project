// BC-Mobile — Modal Tạo Cộng Đồng / Hiệp Hội Mới (Executive Minimal Luxury)

import { useState, useRef } from "react";
import { X, Upload, Plus, Building2, Sparkles, Loader2, Image as ImageIcon, Trash2, Users, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi, uploadFileToNest } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { communityKeys } from "@/hooks/use-community";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (community: any) => void;
};

export function CreateCommunityModal({ open, onClose, onCreated }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [communityType, setCommunityType] = useState<"b2b_networking" | "company_internal">("company_internal");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug.startsWith("comm-") || slug === cleanSlug(name)) {
      setSlug(cleanSlug(val));
    }
  };

  function cleanSlug(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ảnh quá lớn (tối đa 10MB)");
      return;
    }

    setUploadingLogo(true);
    try {
      const url = await uploadFileToNest(file, file.name || "logo.png");
      if (url) {
        setLogoUrl(url);
        toast.success("Tải logo thành công");
      }
    } catch {
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ảnh quá lớn (tối đa 10MB)");
      return;
    }

    setUploadingBanner(true);
    try {
      const url = await uploadFileToNest(file, file.name || "banner.jpg");
      if (url) {
        setBannerUrl(url);
        toast.success("Tải ảnh bìa thành công");
      }
    } catch {
      toast.error("Không thể tải ảnh bìa lên. Vui lòng thử lại");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      toast.error("Vui lòng nhập tên cộng đồng / doanh nghiệp");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchNestApi<any>("/connect-app/community", {
        method: "POST",
        body: JSON.stringify({
          name: cleanName,
          communityType: "company_internal", // Unified: holds both internal ops & B2B capabilities
          tagline: tagline.trim() || undefined,
          about: about.trim() || undefined,
          slug: slug.trim() || undefined,
          logoUrl: logoUrl.trim() || undefined,
          bannerUrl: bannerUrl.trim() || undefined,
          isTrial: true,
          trialDays: 30,
        }),
      });

      // Lưu trạng thái đã kích hoạt gói cộng đồng dùng thử 30 ngày
      try {
        localStorage.setItem("vione_community_subscription_active", "true");
        localStorage.setItem("vione_community_subscription_trial", "true");
        localStorage.setItem("vione_community_trial_days", "30");
        localStorage.setItem("vione_community_trial_expires_at", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("community-created", { detail: { communityId: res?.id || res?.communityId } }));
      } catch {}

      toast.success(`✓ Chúc mừng! Bạn đã kích hoạt Gói Cộng Đồng dùng thử 30 ngày miễn phí và tạo "${cleanName}" thành công!`);
      void queryClient.invalidateQueries({ queryKey: communityKeys.root });
      
      // Reset form
      setName("");
      setTagline("");
      setAbout("");
      setSlug("");
      setLogoUrl("");
      setBannerUrl("");
      
      onClose();
      if (onCreated) onCreated(res);
    } catch (err: any) {
      toast.error(err?.message || "Không thể tạo cộng đồng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bc-app relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#DFB76C]/30 bg-white dark:bg-[#0B0F17] shadow-2xl p-6 text-zinc-950 dark:text-white max-h-[92vh] flex flex-col"
        style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#DFB76C] to-[#8C653B] text-slate-950 font-bold shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#DFB76C] via-[#D4AF37] to-[#8C653B]">
                  Tạo Cộng Đồng Doanh Nghiệp
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DFB76C]/20 text-[#DFB76C] border border-[#DFB76C]/40">
                  FREE 30 NGÀY
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gói Cộng Đồng ViOne — Trọn vẹn tất cả tính năng điều hành & kết nối
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {/* BANNER GÓI CỘNG ĐỒNG TOÀN NĂNG — DÙNG THỬ 30 NGÀY MIỄN PHÍ */}
          <div className="p-4 rounded-2xl border border-[#DFB76C]/40 bg-gradient-to-br from-[#DFB76C]/15 via-amber-500/10 to-transparent shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#DFB76C] text-slate-950">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>Dùng thử VIP 30 ngày free</span>
              </span>
              <span className="text-[11px] font-bold text-[#DFB76C]">
                30 Ngày Miễn Phí
              </span>
            </div>
            <h4 className="text-[13.5px] font-black text-zinc-950 dark:text-white leading-snug">
              Cộng Đồng Toàn Năng ViOne — Gộp Trọn Vẹn Tất Cả Tính Năng
            </h4>
            <p className="mt-1 text-[11.5px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Khi tạo cộng đồng, bạn được cấp quyền Quản trị tối cao và mở khóa toàn bộ phân hệ:
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-[#DFB76C] font-bold">✓</span> Giao việc & Điều hành nhân sự
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#DFB76C] font-bold">✓</span> Giám sát khách hàng CRM
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#DFB76C] font-bold">✓</span> Đăng cơ hội hợp tác B2B
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#DFB76C] font-bold">✓</span> Tổ chức sự kiện & Bản tin
              </div>
            </div>
          </div>

          {/* 2. Ảnh bìa / Background Banner upload */}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Ảnh bìa / Banner cộng đồng
            </label>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerFile}
              className="hidden"
            />
            {bannerUrl ? (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-[var(--bc-mobile-border)] group">
                <img src={bannerUrl} alt="Banner preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                    className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-medium hover:bg-white/30 transition-colors"
                  >
                    Thay đổi ảnh bìa
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerUrl("")}
                    className="p-1.5 rounded-xl bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                    title="Xóa ảnh bìa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {uploadingBanner && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#D8B282]" />
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => !uploadingBanner && bannerInputRef.current?.click()}
                className="relative h-24 w-full rounded-2xl border border-dashed border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] overflow-hidden flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[var(--bc-mobile-accent)] transition-colors p-3 text-center"
              >
                {uploadingBanner ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--bc-mobile-accent)]" />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 text-[var(--bc-mobile-muted)]" />
                    <span className="text-xs font-medium text-[var(--bc-mobile-accent)]">
                      Tải ảnh bìa background lên
                    </span>
                    <span className="text-[10.5px] text-[var(--bc-mobile-muted)]">
                      Khuyến nghị ảnh ngang tỉ lệ 16:9 hoặc 3:1 (PNG, JPG, tối đa 10MB)
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-xs font-medium text-[var(--bc-mobile-muted)] mb-1.5">
              Ảnh đại diện / Logo cộng đồng
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-dashed border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] overflow-hidden flex items-center justify-center group">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-[var(--bc-mobile-muted)]" />
                )}
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--bc-mobile-accent)]" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] text-xs font-medium text-[var(--bc-mobile-accent)] hover:bg-[var(--bc-mobile-accent)]/10 transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {logoUrl ? "Thay đổi logo" : "Tải ảnh logo lên"}
                </button>
                <p className="mt-1 text-[11px] text-[var(--bc-mobile-muted)]">
                  Khuyến nghị ảnh vuông tỉ lệ 1:1 (PNG, JPG, tối đa 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Tên cộng đồng */}
          <div>
            <label className="block text-xs font-medium text-[var(--bc-mobile-muted)] mb-1">
              Tên Cộng Đồng / Hiệp Hội <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ví dụ: Gia Đình ViOne, CLB Doanh Nhân Trẻ Hà Nội..."
              className="w-full rounded-2xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] px-4 py-2.5 text-sm text-[var(--bc-mobile-text)] placeholder:text-[var(--bc-mobile-muted)]/60 focus:border-[var(--bc-mobile-accent)] focus:outline-none transition-colors"
            />
          </div>

          {/* Khẩu hiệu / Slogan */}
          <div>
            <label className="block text-xs font-medium text-[var(--bc-mobile-muted)] mb-1">
              Khẩu hiệu / Giới thiệu ngắn
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ví dụ: Kết Nối Giá Trị — Tiên Phong Phát Triển"
              className="w-full rounded-2xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] px-4 py-2.5 text-sm text-[var(--bc-mobile-text)] placeholder:text-[var(--bc-mobile-muted)]/60 focus:border-[var(--bc-mobile-accent)] focus:outline-none transition-colors"
            />
          </div>

          {/* Mã định danh (Slug) */}
          <div>
            <label className="block text-xs font-medium text-[var(--bc-mobile-muted)] mb-1">
              Mã định danh (Slug đường dẫn)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="vi-du: gia-dinh-vione"
              className="w-full rounded-2xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] px-4 py-2.5 text-xs text-[var(--bc-mobile-text)] placeholder:text-[var(--bc-mobile-muted)]/60 focus:border-[var(--bc-mobile-accent)] focus:outline-none font-mono transition-colors"
            />
          </div>

          {/* Giới thiệu chi tiết */}
          <div>
            <label className="block text-xs font-medium text-[var(--bc-mobile-muted)] mb-1">
              Mô tả chi tiết về Cộng đồng
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tôn chỉ, mục tiêu kết nối, quyền lợi hội viên..."
              className="w-full rounded-2xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)] px-4 py-2.5 text-sm text-[var(--bc-mobile-text)] placeholder:text-[var(--bc-mobile-muted)]/60 focus:border-[var(--bc-mobile-accent)] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[var(--bc-mobile-border)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-2xl border border-[var(--bc-mobile-border)] text-xs font-medium text-[var(--bc-mobile-muted)] hover:bg-[var(--bc-mobile-surface-2)] transition-colors cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] text-slate-950 text-xs font-bold shadow-lg hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang kích hoạt gói dùng thử...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  ⚡ Kích hoạt & Tạo cộng đồng (Dùng thử 30 ngày)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
