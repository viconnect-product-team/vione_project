import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  FileCheck2,
  Loader2,
} from "lucide-react";

interface CitizenPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl?: string;
}

interface HeritageStamp {
  id: string;
  stamp_time: string;
  note?: string;
  site?: {
    name: string;
    province: string;
    category: string;
    cover_image?: string;
  };
}

export const CitizenPassModal: React.FC<CitizenPassModalProps> = ({
  isOpen,
  onClose,
  apiBaseUrl = "/api",
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"stamps" | "medals" | "cert">("stamps");
  const [stamps, setStamps] = useState<HeritageStamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [certBib, setCertBib] = useState("VNE-42-001");
  const [certResult, setCertResult] = useState<any>(null);
  const [loadingCert, setLoadingCert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserStamps();
    }
  }, [isOpen]);

  const fetchUserStamps = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/platform-hub/user/stamps`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStamps(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load stamps", err);
    } finally {
      setLoading(false);
    }
  };

  const lookupCertificate = async () => {
    if (!certBib.trim()) return;
    try {
      setLoadingCert(true);
      const res = await fetch(`${apiBaseUrl}/platform-hub/run/bibs/${encodeURIComponent(certBib.trim())}/certificate`);
      if (res.ok) {
        const data = await res.json();
        setCertResult(data);
      } else {
        setCertResult(null);
        alert("Không tìm thấy kết quả finisher cho số BIB này.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tra cứu chứng nhận.");
    } finally {
      setLoadingCert(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#D8B282]/40 bg-[#070D18] text-white shadow-2xl shadow-[#D8B282]/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D8B282]/20 px-6 py-4 bg-gradient-to-r from-[#070D18] via-[#0E1726] to-[#070D18]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-black shadow-lg shadow-[#D8B282]/25">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69]">
                HỘ CHIẾU CÔNG DÂN SỐ VICONNECT
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Định danh di sản văn hóa & Thành tích thể thao quốc gia
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8B282]/30 text-[#D8B282] hover:bg-[#D8B282]/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Passport Card Visual */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="relative rounded-2xl border-2 border-[#D8B282]/60 bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#050C15] p-5 shadow-2xl overflow-hidden">
            {/* Background Emblem watermark */}
            <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
              <ShieldCheck className="w-56 h-56 text-[#F6E1C3]" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3] uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-[#F6E1C3]" />
                  Citizen Passport • Official ID
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F6E1C3]">
                  NGUYỄN VĂN AN
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#CBD5E1]">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Mã định danh: </span>
                    <span className="font-mono font-bold text-[#F6E1C3]">VN-PASS-2026-8888</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Hạng thành viên: </span>
                    <span className="font-bold text-[#D8B282]">Đại Sứ Di Sản</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Dấu ấn di sản: </span>
                    <span className="font-bold text-white">{stamps.length} địa điểm</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Cấp độ thể thao: </span>
                    <span className="font-bold text-emerald-400">Marathon Finisher</span>
                  </div>
                </div>
              </div>

              {/* QR verification badge */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#D8B282]/30 bg-[#050C15]/70 backdrop-blur-sm self-start sm:self-center">
                <QrCode className="h-16 w-16 text-[#F6E1C3]" />
                <span className="mt-1 text-[9px] font-mono text-[#D8B282]">XÁC THỰC SỐ VICONNECT</span>
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-[#D8B282]/20">
            <button
              type="button"
              onClick={() => setActiveSubTab("stamps")}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                activeSubTab === "stamps"
                  ? "border-[#D8B282] text-[#F6E1C3]"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Dấu Ấn Di Sản ({stamps.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("medals")}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                activeSubTab === "medals"
                  ? "border-[#D8B282] text-[#F6E1C3]"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Huy Chương Thể Thao (3)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("cert")}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                activeSubTab === "cert"
                  ? "border-[#D8B282] text-[#F6E1C3]"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Tra Cứu Chứng Nhận E-Cert</span>
            </button>
          </div>

          {/* Tab 1: Stamps */}
          {activeSubTab === "stamps" && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-[#D8B282]">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-xs">Đang tải con dấu di sản...</span>
                </div>
              ) : stamps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D8B282]/30 p-8 text-center bg-[#0B0F17]/50">
                  <Award className="mx-auto h-10 w-10 text-[#D8B282]/50 mb-2" />
                  <h4 className="text-sm font-bold text-[#F6E1C3]">Chưa có dấu ấn di sản nào</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Hãy bật định vị GPS khi đến các di tích (Huế, Hội An, Thăng Long...) để đóng dấu vào Hộ chiếu số của bạn!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stamps.map((stamp) => (
                    <div
                      key={stamp.id}
                      className="group relative flex items-start gap-3 rounded-xl border border-[#D8B282]/30 bg-[#0B0F17] p-3.5 hover:border-[#D8B282]/60 transition-all shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8C653B] via-[#D8B282] to-[#F6E1C3] p-[2px] shadow-lg">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050C15]">
                          <Award className="h-5 w-5 text-[#F6E1C3]" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#F6E1C3] truncate">
                            {stamp.site?.name || "Di tích văn hóa"}
                          </h4>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> Đã đóng dấu
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#D8B282]" />
                          {stamp.site?.province || "Việt Nam"}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {stamp.stamp_time ? new Date(stamp.stamp_time).toLocaleDateString("vi-VN") : "Gần đây"}
                        </p>
                        {stamp.note && (
                          <p className="mt-1 text-[11px] italic text-[#CBD5E1] bg-black/30 rounded p-1">
                            "{stamp.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Medals */}
          {activeSubTab === "medals" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-xl border border-yellow-500/40 bg-gradient-to-b from-[#1E1B18] to-[#0A0D14] p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] shadow-lg shadow-yellow-500/20 text-[#050C15] mb-2">
                  <Flame className="h-7 w-7" />
                </div>
                <h4 className="text-xs font-bold text-[#F6E1C3]">Finisher 42.195KM</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">ViOne Heritage Marathon 2026</p>
                <span className="mt-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[9px] font-bold text-yellow-300">
                  Hạng Vàng • 03:45:12
                </span>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-[#D8B282]/30 bg-gradient-to-b from-[#181E26] to-[#0A0D14] p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E2E8F0] via-[#94A3B8] to-[#475569] shadow-lg text-[#050C15] mb-2">
                  <Trophy className="h-7 w-7" />
                </div>
                <h4 className="text-xs font-bold text-[#F6E1C3]">Huy Chương Bạc Pickleball</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Doanh Nhân ViConnect Cup</p>
                <span className="mt-2 rounded-full border border-slate-500/40 bg-slate-500/10 px-2 py-0.5 text-[9px] font-bold text-slate-300">
                  Hạng Nhì Đôi Nam Nữ
                </span>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-[#D8B282]/30 bg-gradient-to-b from-[#1E241A] to-[#0A0D14] p-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6EE7B7] via-[#10B981] to-[#047857] shadow-lg text-[#050C15] mb-2">
                  <Award className="h-7 w-7" />
                </div>
                <h4 className="text-xs font-bold text-[#F6E1C3]">Đại Sứ Hành Trình Xanh</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Hoàn thành 3 Di tích di sản</p>
                <span className="mt-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                  Hạng Danh Dự
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Cert lookup */}
          {activeSubTab === "cert" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập số BIB (Ví dụ: VNE-42-001)"
                  value={certBib}
                  onChange={(e) => setCertBib(e.target.value)}
                  className="flex-1 rounded-xl border border-[#D8B282]/30 bg-[#0B0F17] px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={lookupCertificate}
                  disabled={loadingCert}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2.5 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  {loadingCert ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
                  <span>Tra Cứu</span>
                </button>
              </div>

              {certResult && (
                <div className="rounded-xl border-2 border-[#D8B282] bg-gradient-to-b from-[#141A28] to-[#070D18] p-5 shadow-2xl relative text-center">
                  <div className="text-[11px] font-mono tracking-widest text-[#D8B282] uppercase">
                    CHỨNG NHẬN ĐIỆN TỬ FINISHER CHÍNH THỨC
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-black text-[#F6E1C3] mt-1">
                    {certResult.race?.title || "VI ONE HERITAGE MARATHON"}
                  </h3>
                  <div className="my-3 flex justify-center">
                    <div className="rounded-lg border border-[#D8B282]/40 bg-[#050C15]/80 px-4 py-2">
                      <span className="text-xs text-muted-foreground">Vận động viên: </span>
                      <span className="text-sm font-bold text-white">{certResult.runner_name}</span>
                      <span className="mx-2 text-[#D8B282]">|</span>
                      <span className="text-xs text-muted-foreground">BIB: </span>
                      <span className="text-sm font-mono font-bold text-[#F6E1C3]">{certResult.bib_number}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto my-3 text-xs">
                    <div className="rounded-lg bg-black/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Cự ly</div>
                      <div className="font-bold text-white">{certResult.distance_km} KM</div>
                    </div>
                    <div className="rounded-lg bg-black/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Chip Time</div>
                      <div className="font-mono font-bold text-[#F6E1C3]">{certResult.chip_time || "03:45:12"}</div>
                    </div>
                    <div className="rounded-lg bg-black/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Thứ hạng</div>
                      <div className="font-bold text-emerald-400">#{certResult.ranking_overall || 12} Overall</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic">
                    Xác thực tự động qua thảm Timing RFID • ViConnect Platform Hub
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#D8B282]/20 px-6 py-3 bg-[#0B0F17]">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Xác thực bởi ViConnect Central Hub</span>
          </div>
          <button
            type="button"
            onClick={() => {
              alert("Đã sao chép liên kết Hộ chiếu Công dân số của bạn!");
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Chia Sẻ Hộ Chiếu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
