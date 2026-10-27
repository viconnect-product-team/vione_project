import React, { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  MapPin,
  Volume2,
  VolumeX,
  Compass,
  Play,
  Pause,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface HeritageSite {
  id: string;
  code: string;
  name: string;
  category: string;
  unesco_status: string;
  latitude: number;
  longitude: number;
  address: string;
  province: string;
  description: string;
  vr360_url?: string;
  audio_guide_vn?: string;
  audio_guide_en?: string;
  thumbnail_url?: string;
  stamps_count: number;
  museums?: any[];
}

export const HeritageExplorer: React.FC = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLang, setAudioLang] = useState<"vn" | "en">("vn");
  const [stamping, setStamping] = useState(false);

  const loadHeritageSites = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append("search", search);
      if (categoryFilter !== "all") q.append("category", categoryFilter);
      const res = await fetchNestApi<HeritageSite[]>(`/platform-hub/heritage?${q.toString()}`);
      if (Array.isArray(res)) {
        setSites(res);
      }
    } catch (err) {
      console.error("[HeritageExplorer] load error:", err);
      toast.error("Không thể tải danh sách di sản văn hóa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeritageSites();
  }, [search, categoryFilter]);

  const handleOpenDetail = async (site: HeritageSite) => {
    setSelectedSite(site);
    setIsPlayingAudio(false);
    try {
      const full = await fetchNestApi<HeritageSite>(`/platform-hub/heritage/${site.id}`);
      if (full && full.id) {
        setSelectedSite(full);
      }
    } catch (err) {
      console.warn("Could not load full detail:", err);
    }
  };

  const handleStampHeritage = async (siteId: string) => {
    setStamping(true);
    try {
      const res = await fetchNestApi<any>(`/platform-hub/heritage/${siteId}/stamp`, {
        method: "POST",
        body: JSON.stringify({ note: "Check-in từ Cổng Nền Tảng ViConnect" }),
      });
      if (res && res.success) {
        toast.success(`Đóng dấu ấn số thành công! Mã dấu: ${res.stampCode}`);
        if (selectedSite) {
          setSelectedSite({ ...selectedSite, stamps_count: (selectedSite.stamps_count || 0) + 1 });
        }
        loadHeritageSites();
      }
    } catch (err: any) {
      toast.error("Đóng dấu thất bại: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setStamping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Khám Phá */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-r from-[#0B0F17] via-[#1A1A24] to-[#0B0F17] p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Landmark className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Heritage Platform • Quản Lý & Số Hóa Di Sản</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F6E1C3] sm:text-3xl font-serif">
            Bảo Tồn & Số Hóa Di Sản Văn Hóa Quốc Gia
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Hệ thống dữ liệu số hóa di tích lịch sử, danh lam thắng cảnh UNESCO và di sản phi vật thể. Trải nghiệm Tour 3D VR360 toàn cảnh, thuyết minh tự động qua GPS và lưu giữ dấu ấn số vào Hộ chiếu công dân ViConnect.
          </p>
        </div>
      </div>

      {/* Bộ Lọc & Tìm Kiếm */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm di sản, tỉnh thành, niên đại..."
            className="w-full rounded-xl border border-[#D8B282]/25 bg-[#0B0F17] py-2.5 pl-10 pr-4 text-xs text-[#F6E1C3] placeholder-muted-foreground focus:border-[#D8B282] focus:outline-none focus:ring-1 focus:ring-[#D8B282]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["all", "Di tích Lịch sử & Kiến trúc Nghệ thuật", "Kiến trúc & Đô thị Cổ Thương Cảng", "Di tích Lịch sử & Khảo cổ học"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold"
                  : "border border-[#D8B282]/20 bg-[#0B0F17] text-muted-foreground hover:border-[#D8B282]/40 hover:text-[#F6E1C3]"
              }`}
            >
              {cat === "all" ? "Tất Cả Thể Loại" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Danh Sách Di Sản Grid */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
        </div>
      ) : sites.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8B282]/30 bg-[#0B0F17]/60 p-8 text-center">
          <Landmark className="h-12 w-12 text-[#D8B282]/50 mb-3" />
          <h3 className="text-base font-semibold text-[#F6E1C3]">Chưa có bản ghi di sản phù hợp</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Hệ thống đang đồng bộ dữ liệu di sản văn hóa từ CSDL Nền tảng ViConnect.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div
              key={site.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] shadow-xl transition-all hover:border-[#D8B282]/60 hover:shadow-2xl hover:shadow-[#D8B282]/10"
            >
              {/* Image & Badge */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={site.thumbnail_url || "https://images.unsplash.com/photo-1599827056326-c63e2309f44f?auto=format&fit=crop&w=800&q=80"}
                  alt={site.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3] backdrop-blur-md">
                    {site.unesco_status === "unesco_world" ? "Di Sản Thế Giới UNESCO" : "Di Tích Quốc Gia"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#D8B282]" />
                    <span className="font-medium text-[#F6E1C3]">{site.province}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-[#050C15]/75 px-2 py-0.5 text-[11px] text-[#F6E1C3]">
                    <Award className="h-3 w-3 text-[#D8B282]" />
                    <span>{site.stamps_count || 0} dấu ấn</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B282]">
                    {site.category}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[#F6E1C3] line-clamp-1 group-hover:text-white transition-colors">
                    {site.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#D8B282]/15">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(site)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Khám Phá Di Sản</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStampHeritage(site.id)}
                    title="Đóng con dấu di sản vào Hộ chiếu số"
                    className="rounded-xl border border-[#D8B282]/40 bg-[#D8B282]/10 p-2 text-[#F6E1C3] hover:bg-[#D8B282]/20 transition-all"
                  >
                    <Award className="h-4 w-4 text-[#D8B282]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Chi Tiết Di Sản */}
      {selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-6 shadow-2xl space-y-5 text-[#F6E1C3]">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D8B282]">
                  {selectedSite.category} • Mã: {selectedSite.code}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedSite.name}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-[#D8B282]" />
                  <span>{selectedSite.address}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Media & VR360 */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#D8B282]/30">
              <img
                src={selectedSite.thumbnail_url || "https://images.unsplash.com/photo-1599827056326-c63e2309f44f?auto=format&fit=crop&w=1200&q=80"}
                alt={selectedSite.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {selectedSite.vr360_url && (
                <a
                  href={selectedSite.vr360_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow-xl hover:brightness-110"
                >
                  <Compass className="h-4 w-4" />
                  <span>Trải Nghiệm Tour 3D VR360</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Smart Audio Guide Player */}
            <div className="rounded-2xl border border-[#D8B282]/30 bg-[#121620] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D8B282]/15 text-[#D8B282]">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F6E1C3]">Thuyết Minh Tự Động (Geo-Audio Guide)</h4>
                    <p className="text-[11px] text-muted-foreground">Giọng đọc thuyết minh truyền cảm theo định vị GPS</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-[#D8B282]/30 bg-[#0B0F17] p-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setAudioLang("vn")}
                    className={`rounded px-2 py-0.5 font-bold ${
                      audioLang === "vn" ? "bg-[#D8B282] text-[#050C15]" : "text-muted-foreground"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioLang("en")}
                    className={`rounded px-2 py-0.5 font-bold ${
                      audioLang === "en" ? "bg-[#D8B282] text-[#050C15]" : "text-muted-foreground"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95"
                >
                  {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-[#1A1A24] overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] transition-all duration-300 ${
                        isPlayingAudio ? "w-2/3 animate-pulse" : "w-1/4"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{isPlayingAudio ? "01:24" : "00:00"}</span>
                    <span>03:45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & History */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#F6E1C3]">Hồ Sơ Khoa Học & Giá Trị Lịch Sử</h4>
              <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">
                {selectedSite.description}
              </p>
            </div>

            {/* Bảo tàng trực thuộc nếu có */}
            {selectedSite.museums && selectedSite.museums.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#D8B282]/20">
                <h4 className="text-xs font-bold text-[#D8B282] uppercase tracking-wider">
                  Bảo Tàng Thuộc Quần Thể Di Sản
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSite.museums.map((mus: any) => (
                    <div
                      key={mus.id}
                      className="rounded-xl border border-[#D8B282]/20 bg-[#121620] p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#F6E1C3]">{mus.name}</p>
                        <p className="text-[10px] text-muted-foreground">{mus.address}</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#D8B282]">
                        {mus.ticket_price > 0 ? `${Number(mus.ticket_price).toLocaleString()} đ` : "Miễn phí"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#D8B282]/20">
              <button
                type="button"
                disabled={stamping}
                onClick={() => handleStampHeritage(selectedSite.id)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-3 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Award className="h-4 w-4" />
                <span>{stamping ? "Đang ghi nhận..." : "Đóng Dấu Ấn Di Sản Vào Hộ Chiếu Số"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
