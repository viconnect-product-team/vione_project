// ViOne QR Setup & Custom Presets Modal
// Allows user to configure QR presentations (Gold VIP vs Silver VIP vs Custom fields)
// so different QR codes show different information when scanned.

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Crown,
  Sparkles,
  QrCode,
  Eye,
  Sliders,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  VipBusinessCard,
  type VipCardProfile,
  type VipCardStyle,
  type VipVisibleFields,
} from "./VipBusinessCard";

export type QrPresetConfig = {
  id: "gold_full" | "silver_partner" | "quick_connect" | "custom";
  title: string;
  subtitle: string;
  style: VipCardStyle;
  visibleFields: VipVisibleFields;
};

export const DEFAULT_QR_PRESETS: QrPresetConfig[] = [
  {
    id: "gold_full",
    title: "Thẻ Doanh Nhân VIP Mạ Vàng",
    subtitle: "Hiển thị đầy đủ SĐT, Zalo, Email, Website & Profile cá nhân",
    style: "gold",
    visibleFields: {
      phone: true,
      zalo: true,
      email: true,
      website: true,
      bio: true,
      address: true,
    },
  },
  {
    id: "silver_partner",
    title: "Thẻ Đối Tác VIP Mạ Bạc",
    subtitle: "Mạ bạc Platinum, ẩn SĐT riêng, chỉ hiện Email, Website & Profile",
    style: "silver",
    visibleFields: {
      phone: false,
      zalo: false,
      email: true,
      website: true,
      bio: true,
      address: true,
    },
  },
  {
    id: "quick_connect",
    title: "Danh Thiếp Kết Nối Nhanh",
    subtitle: "Tối giản cho sự kiện networking, chỉ trao đổi SĐT & Zalo",
    style: "gold",
    visibleFields: {
      phone: true,
      zalo: true,
      email: false,
      website: false,
      bio: false,
      address: false,
    },
  },
];

interface QrPresetSetupModalProps {
  profile: VipCardProfile;
  isOpen: boolean;
  onClose: () => void;
  onPresetChanged?: (config: QrPresetConfig) => void;
}

export function QrPresetSetupModal({
  profile,
  isOpen,
  onClose,
  onPresetChanged,
}: QrPresetSetupModalProps) {
  const [selectedId, setSelectedId] = useState<string>("gold_full");
  const [cardStyle, setCardStyle] = useState<VipCardStyle>("gold");
  const [visibleFields, setVisibleFields] = useState<VipVisibleFields>({
    phone: true,
    zalo: true,
    email: true,
    website: true,
    bio: true,
    address: true,
  });

  // Load saved preset from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vione_active_qr_preset");
      if (saved) {
        const parsed = JSON.parse(saved) as QrPresetConfig;
        setSelectedId(parsed.id || "gold_full");
        setCardStyle(parsed.style || "gold");
        if (parsed.visibleFields) {
          setVisibleFields(parsed.visibleFields);
        }
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: QrPresetConfig) => {
    setSelectedId(preset.id);
    setCardStyle(preset.style);
    setVisibleFields({ ...preset.visibleFields });
  };

  const handleToggleField = (field: keyof VipVisibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setSelectedId("custom");
  };

  const handleSave = () => {
    const config: QrPresetConfig = {
      id: selectedId as any,
      title:
        selectedId === "gold_full"
          ? "Thẻ Doanh Nhân VIP Mạ Vàng"
          : selectedId === "silver_partner"
          ? "Thẻ Đối Tác VIP Mạ Bạc"
          : selectedId === "quick_connect"
          ? "Danh Thiếp Kết Nối Nhanh"
          : "Cấu hình tùy chỉnh",
      subtitle: "Cấu hình quét mã QR cá nhân hóa",
      style: cardStyle,
      visibleFields,
    };

    try {
      localStorage.setItem("vione_active_qr_preset", JSON.stringify(config));
      window.dispatchEvent(new CustomEvent("vione_qr_preset_updated", { detail: config }));
    } catch {}

    onPresetChanged?.(config);
    toast.success("Đã lưu thiết lập hiển thị quét mã QR thành công!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border border-[#DFB76C]/30 bg-[#0B0F19] text-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DFB76C]/15 border border-[#DFB76C]/40 text-[#DFB76C]">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5E8D3]">Thiết Lập Quét Mã QR</h3>
              <p className="text-xs text-slate-400">Chọn cấu hình thông tin khi người khác quét QR</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Section 1: Choose Predefined Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#DFB76C] block mb-2.5">
              1. Chọn Mẫu Thẻ QR
            </label>
            <div className="grid gap-2.5">
              {DEFAULT_QR_PRESETS.map((preset) => {
                const active = selectedId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                      active
                        ? "border-[#DFB76C] bg-[#DFB76C]/15 shadow-md shadow-[#DFB76C]/10"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#DFB76C] bg-[#DFB76C] text-black"
                          : "border-slate-500 bg-transparent"
                      }`}
                    >
                      {active && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-white">{preset.title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase ${
                            preset.style === "gold"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-300/20 text-slate-200 border border-slate-300/30"
                          }`}
                        >
                          {preset.style === "gold" ? "Mạ Vàng" : "Mạ Bạc"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{preset.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Choose Gold vs Silver Style Toggle */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#DFB76C] block mb-2.5">
              2. Chất Liệu Mạ Thẻ VIP
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCardStyle("gold")}
                className={`flex items-center justify-center gap-2.5 rounded-2xl border p-3 font-bold text-xs transition cursor-pointer ${
                  cardStyle === "gold"
                    ? "border-[#DFB76C] bg-gradient-to-r from-[#DFB76C]/25 to-[#B38E5D]/15 text-[#FFE8C2] shadow-md"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                <Crown className="h-4 w-4 text-[#DFB76C]" />
                <span>Mạ Vàng Champagne Gold</span>
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("silver")}
                className={`flex items-center justify-center gap-2.5 rounded-2xl border p-3 font-bold text-xs transition cursor-pointer ${
                  cardStyle === "silver"
                    ? "border-slate-300 bg-gradient-to-r from-slate-200/20 to-slate-400/10 text-white shadow-md"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-4 w-4 text-slate-300" />
                <span>Mạ Bạc Platinum Silver</span>
              </button>
            </div>
          </div>

          {/* Section 3: Fine-grained Field Visibility Checkboxes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#DFB76C] block mb-2.5">
              3. Chọn Các Trường Hiển Thị Khi Quét QR
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "phone" as const, label: "Số điện thoại", icon: Phone },
                { key: "zalo" as const, label: "Nhắn tin Zalo", icon: MessageCircle },
                { key: "email" as const, label: "Địa chỉ Email", icon: Mail },
                { key: "website" as const, label: "Website / Đường link", icon: Globe },
                { key: "bio" as const, label: "Giới thiệu / Bio", icon: FileText },
                { key: "address" as const, label: "Địa chỉ / Thành phố", icon: MapPin },
              ].map(({ key, label, icon: Icon }) => {
                const on = !!visibleFields[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleField(key)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                      on
                        ? "border-[#DFB76C]/40 bg-[#DFB76C]/10 text-white"
                        : "border-white/5 bg-white/[0.01] text-slate-400 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#DFB76C]" />
                      <span className="truncate">{label}</span>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-1.5 ${
                        on ? "border-[#DFB76C] bg-[#DFB76C] text-black" : "border-slate-500"
                      }`}
                    >
                      {on && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Real-time Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#DFB76C]">
                4. Xem Trước Thẻ Quét QR Thực Tế
              </label>
              <span className="text-[11px] text-slate-400">Giao diện người quét sẽ thấy</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-2 sm:p-3">
              <VipBusinessCard
                profile={profile}
                style={cardStyle}
                visibleFields={visibleFields}
                showActions={true}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer: Save Button */}
        <div className="border-t border-white/10 p-4 bg-white/[0.02] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 rounded-2xl bg-gradient-to-r from-[#DFB76C] via-[#F2D7B3] to-[#B38E5D] py-3 text-xs font-black uppercase tracking-wider text-[#0A0703] shadow-lg shadow-[#DFB76C]/20 hover:brightness-105 active:scale-[0.99] transition cursor-pointer"
          >
            Lưu Cấu Hình Mã QR
          </button>
        </div>
      </div>
    </div>
  );
}
