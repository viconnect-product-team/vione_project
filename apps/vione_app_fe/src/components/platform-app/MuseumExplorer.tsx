import React, { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  MapPin,
  Volume2,
  Box,
  Ticket,
  ExternalLink,
  ChevronRight,
  Sparkles,
  QrCode,
  Radio,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface Museum {
  id: string;
  code: string;
  name: string;
  address: string;
  province: string;
  ticket_price: number;
  opening_hours: string;
  virtual_tour_url?: string;
  description?: string;
  thumbnail_url?: string;
  artifacts_count?: number;
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  artifact_code: string;
  name: string;
  period: string;
  nfc_uid?: string;
  model_3d_url?: string;
  image_url?: string;
  audio_story_url?: string;
  description?: string;
  is_national_treasure: boolean;
}

export const MuseumExplorer: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [nfcInput, setNfcInput] = useState("");
  const [scanningNfc, setScanningNfc] = useState(false);
  const [bookingTicket, setBookingTicket] = useState(false);

  // Rotation animation for 3D simulator
  const [rotationDegree, setRotationDegree] = useState(0);

  const loadMuseums = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<Museum[]>("/platform-hub/museums");
      if (Array.isArray(res)) {
        setMuseums(res);
      }
    } catch (err) {
      console.error("[MuseumExplorer] load error:", err);
      toast.error("Không thể tải danh sách bảo tàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMuseums();
  }, []);

  const handleOpenMuseum = async (mus: Museum) => {
    setSelectedMuseum(mus);
    try {
      const full = await fetchNestApi<Museum>(`/platform-hub/museums/${mus.id}`);
      if (full && full.id) {
        setSelectedMuseum(full);
      }
    } catch (err) {
      console.warn("Could not load full museum detail:", err);
    }
  };

  const handleSimulateNfcTap = async (uid?: string) => {
    const targetUid = uid || nfcInput || "04:A1:22:9C:B8:10:80";
    setScanningNfc(true);
    try {
      const artifact = await fetchNestApi<Artifact>(`/platform-hub/artifacts/nfc/${targetUid}`);
      if (artifact && artifact.id) {
        toast.success(`Chạm NFC thành công! Mở hiện vật: ${artifact.name}`);
        setSelectedArtifact(artifact);
      }
    } catch (err: any) {
      toast.error("Không nhận diện được thẻ NFC này trên hệ thống.");
    } finally {
      setScanningNfc(false);
    }
  };

  const handleBookTicket = async (museum: Museum) => {
    setBookingTicket(true);
    try {
      const res = await fetchNestApi<any>("/platform-hub/tickets/purchase", {
        method: "POST",
        body: JSON.stringify({
          ticketType: "museum",
          itemName: `Vé tham quan: ${museum.name}`,
          totalAmount: Number(museum.ticket_price) || 50000,
          quantity: 1,
        }),
      });
      if (res && res.success) {
        toast.success(`Đặt vé điện tử thành công! Mã vé: ${res.ticketCode}`);
      }
    } catch (err: any) {
      toast.error("Đặt vé thất bại: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setBookingTicket(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Giới Thiệu */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-r from-[#0B0F17] via-[#151A24] to-[#0B0F17] p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Box className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Museum Platform • Bảo Tàng Số & Thuyết Minh Hiện Vật</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F6E1C3] sm:text-3xl font-serif">
            Khám Phá Bảo Vật Quốc Gia Qua Không Gian 3D & Chạm 1-Tap NFC
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Trưng bày trực quan các cổ vật quý hiếm bằng công nghệ 3D Photogrammetry/AR xoay 360 độ. Chạm điện thoại vào thẻ NFC gắn trên bệ trưng bày bảo tàng để nghe audio guide thuyết minh câu chuyện lịch sử.
          </p>
        </div>

        {/* Thanh giả lập chạm NFC tại chỗ */}
        <div className="mt-4 pt-4 border-t border-[#D8B282]/20 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#F6E1C3]">
            <Radio className="h-4 w-4 text-[#D8B282] animate-pulse" />
            <span className="font-semibold">Thuyết minh 1-Chạm NFC:</span>
          </div>
          <button
            type="button"
            onClick={() => handleSimulateNfcTap("04:A1:22:9C:B8:10:80")}
            className="rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1 text-xs font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95"
          >
            Chạm Thẻ NFC: Trống Đồng Ngọc Lũ
          </button>
          <button
            type="button"
            onClick={() => handleSimulateNfcTap("04:B2:33:4D:E5:20:81")}
            className="rounded-lg border border-[#D8B282]/40 bg-[#0B0F17] px-3 py-1 text-xs font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20"
          >
            Chạm Thẻ NFC: Ngai Vàng Triều Nguyễn
          </button>
        </div>
      </div>

      {/* Danh Sách Bảo Tàng */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
        </div>
      ) : museums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8B282]/30 bg-[#0B0F17]/60 p-8 text-center">
          <Landmark className="h-12 w-12 text-[#D8B282]/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F6E1C3]">Chưa có dữ liệu bảo tàng</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {museums.map((mus) => (
            <div
              key={mus.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-5 shadow-xl transition-all hover:border-[#D8B282]/60 hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={mus.thumbnail_url || "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80"}
                    alt={mus.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                    {mus.artifacts_count || 1} hiện vật 3D
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B282]">
                    Mã: {mus.code} • {mus.province}
                  </span>
                  <h3 className="text-base font-bold text-[#F6E1C3] group-hover:text-white transition-colors">
                    {mus.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-[#D8B282]" />
                    <span className="line-clamp-1">{mus.address}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-[#D8B282]" />
                    <span>{mus.opening_hours}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-[#D8B282]/15 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Giá vé điện tử</span>
                  <span className="text-sm font-bold text-[#D8B282]">
                    {Number(mus.ticket_price) > 0 ? `${Number(mus.ticket_price).toLocaleString()} đ` : "Miễn phí"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenMuseum(mus)}
                    className="rounded-xl border border-[#D8B282]/40 bg-[#0B0F17] px-3.5 py-2 text-xs font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20 transition-all flex items-center gap-1"
                  >
                    <Box className="h-3.5 w-3.5 text-[#D8B282]" />
                    <span>Xem Cổ Vật 3D</span>
                  </button>
                  <button
                    type="button"
                    disabled={bookingTicket}
                    onClick={() => handleBookTicket(mus)}
                    className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-2 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>Đặt Vé Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Hiện Vật 3D Chi Tiết */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-6 shadow-2xl space-y-5 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#D8B282]/20 border border-[#D8B282]/40 px-2 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                    {selectedArtifact.is_national_treasure ? "Bảo Vật Quốc Gia" : "Hiện Vật Quý"}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedArtifact.period}</span>
                </div>
                <h2 className="text-xl font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedArtifact.name}
                </h2>
                <p className="text-xs text-[#D8B282]">Mã chip NFC gắn bệ tủ kính: {selectedArtifact.nfc_uid}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Khung Tương Tác 3D Simulator */}
            <div className="relative aspect-square max-h-[320px] w-full mx-auto overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#121620] to-[#050C15] flex flex-col items-center justify-center p-4">
              <div
                className="relative transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `rotateY(${rotationDegree}deg)` }}
              >
                <img
                  src={selectedArtifact.image_url || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"}
                  alt={selectedArtifact.name}
                  className="max-h-[220px] max-w-[220px] object-contain drop-shadow-[0_15px_25px_rgba(216,178,130,0.35)]"
                />
              </div>

              {/* Slider xoay 360 */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 bg-[#0B0F17]/85 backdrop-blur-md rounded-xl p-2 border border-[#D8B282]/25">
                <span className="text-[10px] text-muted-foreground">Xoay 360° Cổ Vật:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationDegree}
                  onChange={(e) => setRotationDegree(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[#D8B282] h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-bold text-[#F6E1C3]">{rotationDegree}°</span>
              </div>
            </div>

            {/* Audio Story Thuyết Minh */}
            <div className="rounded-2xl border border-[#D8B282]/30 bg-[#121620] p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-md">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#F6E1C3]">Thuyết Minh Câu Chuyện Hiện Vật</h4>
                <p className="text-[11px] text-muted-foreground">Phát tự động khi chạm điện thoại vào thẻ NFC tại tủ kính bảo tàng</p>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Đang phát thuyết minh âm thanh cổ vật...")}
                className="rounded-lg bg-[#D8B282]/15 border border-[#D8B282]/40 px-3 py-1.5 text-xs font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/25"
              >
                Nghe Ngay
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#F6E1C3]">Ý Nghĩa Lịch Sử & Nghệ Thuật</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedArtifact.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi Tiết Bảo Tàng & Danh Sách Cổ Vật */}
      {selectedMuseum && !selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-6 shadow-2xl space-y-5 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D8B282]">
                  Bảo Tàng Số ViConnect • {selectedMuseum.province}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedMuseum.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedMuseum.address}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMuseum(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Cổ vật trưng bày */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#F6E1C3] flex items-center gap-2">
                <Box className="h-4 w-4 text-[#D8B282]" />
                <span>Bộ Sưu Tập Cổ Vật 3D Trưng Bày ({selectedMuseum.artifacts?.length || 0})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(selectedMuseum.artifacts || []).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className="cursor-pointer rounded-xl border border-[#D8B282]/25 bg-[#121620] p-3 transition-all hover:border-[#D8B282] hover:bg-[#1A1A24] flex items-center gap-3"
                  >
                    <img
                      src={art.image_url || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"}
                      alt={art.name}
                      className="h-16 w-16 rounded-lg object-cover border border-[#D8B282]/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        {art.is_national_treasure && (
                          <span className="rounded bg-[#D8B282]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#F6E1C3]">
                            Bảo Vật QG
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{art.period}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F6E1C3] mt-1 line-clamp-1">{art.name}</h4>
                      <p className="text-[10px] text-[#D8B282] mt-0.5 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>Chạm để xoay 360° & nghe audio</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Đặt vé */}
            <div className="rounded-2xl border border-[#D8B282]/30 bg-[#121620] p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Giá vé vào cửa điện tử:</span>
                <p className="text-base font-bold text-[#D8B282]">
                  {Number(selectedMuseum.ticket_price) > 0 ? `${Number(selectedMuseum.ticket_price).toLocaleString()} đ` : "Miễn phí"}
                </p>
              </div>
              <button
                type="button"
                disabled={bookingTicket}
                onClick={() => handleBookTicket(selectedMuseum)}
                className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-2.5 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/25 hover:brightness-110 active:scale-95"
              >
                {bookingTicket ? "Đang xử lý..." : "Thanh Toán VietQR 1 Giây"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
