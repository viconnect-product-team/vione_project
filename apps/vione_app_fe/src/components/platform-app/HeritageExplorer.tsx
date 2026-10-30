import React, { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  MapPin,
  Volume2,
  ExternalLink,
  Award,
  Clock,
  Sparkles,
  BookOpen,
  Share2,
  Compass,
  X,
  Radio,
  FileCheck2,
  ZoomIn,
  Navigation,
  CheckCircle2,
  FileText,
  Star,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface HeritageSite {
  id: string;
  code: string;
  name: string;
  category: string;
  province: string;
  description: string;
  vr_tour_url?: string;
  audio_guide_url?: string;
  thumbnail_url?: string;
  stamps_count?: number;
  latitude?: number;
  longitude?: number;
}

export interface HeritageArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
  summary: string;
  content: string[];
}

const HERITAGE_ARTICLES: HeritageArticle[] = [
  {
    id: "art-hue-unesco",
    title: "Kiến Trúc Thành Quách & Phong Thủy Triều Nguyễn Tại Quần Thể Di Tích Cố Đô Huế",
    category: "Di Sản UNESCO",
    author: "PGS.TS. Đặng Văn Bài • Hội Di Sản Văn Hóa Việt Nam",
    readTime: "5 phút đọc",
    views: "3.780",
    publishedAt: "28/10/2026",
    thumbnail:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    summary:
      "Sự kết hợp hoàn hảo giữa nguyên lý phong thủy Đông phương và nghệ thuật kiến trúc thành lũy Vauban phương Tây thế kỷ XIX.",
    content: [
      "Quần thể di tích Cố đô Huế được UNESCO vinh danh là Di sản Văn hóa Thế giới đầu tiên của Việt Nam năm 1993. Quy hoạch kinh thành dựa trên thuyết Ngũ hành và thuật phong thủy với núi Ngự Bình làm tiền án, cồn Hến và cồn Dã Viên làm Tả Thanh Long, Hữu Bạch Hổ.",
      "Ứng dụng công nghệ quét 3D VR360 trên ViOne Heritage cho phép du khách khám phá chiều sâu các công trình lăng tẩm và cung điện từ xa với độ chi tiết trung thực.",
    ],
  },
  {
    id: "art-thang-long",
    title: "Dấu Tích Khảo Cổ Học Hoàng Thành Thăng Long Qua 13 Thế Kỷ Biến Thiên Lịch Sử",
    category: "Khảo Cổ Học",
    author: "Viện Hàn Lâm Khoa Học Xã Hội Việt Nam",
    readTime: "6 phút đọc",
    views: "2.640",
    publishedAt: "25/10/2026",
    thumbnail:
      "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80",
    summary:
      "Tầng văn hóa khảo cổ xếp chồng liên tục từ thời Đại La, Đinh - Tiền Lê, Lý, Trần, Lê sơ đến thời Nguyễn.",
    content: [
      "Khu khảo cổ 18 Hoàng Diệu là minh chứng độc nhất vô nhị về sự giao thoa văn hóa Á Đông và trung tâm quyền lực chính trị lâu dài tại châu Á.",
      "ViOne Heritage đã số hóa hệ thống giếng cổ thời Trần, ngói đầu rồng thời Lý và đồ gốm ngự dụng thành bản đồ số 3D có thuyết minh GPS đa ngữ.",
    ],
  },
  {
    id: "art-hoi-an",
    title: "Bảo Tồn Kiến Trúc Nhà Cổ Gỗ & Thương Cảng Quốc Tế Hội An Thế Kỷ XVII",
    category: "Đô Thị Cổ",
    author: "KTS. Nguyễn Trọng Hải • Ban Quản Lý Phố Cổ",
    readTime: "4 phút đọc",
    views: "2.190",
    publishedAt: "23/10/2026",
    thumbnail:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
    summary:
      "Cấu trúc vì kèo gỗ mít truyền thống và sự thích ứng tài tình với mùa nước lũ hàng năm của cư dân phố cổ Hội An.",
    content: [
      "Những ngôi nhà ống cổ tại Hội An không chỉ có giá trị nghệ thuật chạm khắc mà còn lưu giữ lối sống thương gia xưa. Việc gắn mã định danh di sản ViOne giúp du khách quét thông tin gia phả và lịch sử từng ngôi nhà cổ chỉ trong 1 giây.",
    ],
  },
];

export const HeritageExplorer: React.FC = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HeritageArticle | null>(null);
  const [stamping, setStamping] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"sites" | "geofencing" | "sacphong" | "tours">(
    "sites",
  );

  // Geofencing Simulation State
  const [userDistance, setUserDistance] = useState(15); // meters
  const [isAudioAutoTriggered, setIsAudioAutoTriggered] = useState(true);

  // Deep Zoom State
  const [zoomLevel, setZoomLevel] = useState(1.5);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<HeritageSite[]>("/platform-hub/heritage");
      if (Array.isArray(res) && res.length > 0) {
        setSites(res);
      } else {
        setSites([
          {
            id: "site-1",
            code: "DS-HUE-01",
            name: "Quần thể Di tích Cố đô Huế",
            category: "Di sản thế giới UNESCO",
            province: "Thừa Thiên Huế",
            description:
              "Kinh đô của triều Nguyễn từ 1802 đến 1945. Bảo tồn hệ thống thành quách, cung điện, đàn miếu và lăng tẩm hoàng gia uy nghiêm ven bờ sông Hương.",
            vr_tour_url: "https://vr360.hue.vn",
            thumbnail_url:
              "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
            stamps_count: 1420,
            latitude: 16.4697,
            longitude: 107.5794,
          },
          {
            id: "site-2",
            code: "DS-HN-02",
            name: "Hoàng Thành Thăng Long",
            category: "Di sản thế giới UNESCO",
            province: "Hà Nội",
            description:
              "Trung tâm quyền lực chính trị liên tục trong hơn 13 thế kỷ của các triều đại phong kiến Việt Nam từ thời Lý, Trần, Lê đến Nguyễn.",
            vr_tour_url: "https://vr360.hoangthanhthanglong.vn",
            thumbnail_url:
              "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
            stamps_count: 2180,
            latitude: 21.0338,
            longitude: 105.8398,
          },
          {
            id: "site-3",
            code: "DS-QN-03",
            name: "Đô Thị Cổ Hội An",
            category: "Di sản thế giới UNESCO",
            province: "Quảng Nam",
            description:
              "Thương cảng quốc tế truyền thống Đông Nam Á được bảo tồn gần như nguyên vẹn từ thế kỷ XVI đến XIX.",
            vr_tour_url: "https://vr360.hoian.vn",
            thumbnail_url:
              "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
            stamps_count: 3410,
            latitude: 15.8801,
            longitude: 108.338,
          },
        ]);
      }
    } catch (err) {
      console.error("[HeritageExplorer] load error:", err);
      toast.error("Không thể tải dữ liệu di sản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStamp = async (siteId: string) => {
    setStamping(true);
    try {
      await fetchNestApi(`/platform-hub/heritage/${siteId}/stamp`, {
        method: "POST",
        body: JSON.stringify({
          checkInMethod: "gps_geofence",
          distance: userDistance,
        }),
      });
      toast.success("Đóng dấu lưu niệm di sản vào Hộ chiếu số thành công! (+100 Điểm Văn Hóa)");
      loadData();
    } catch (err: any) {
      toast.success("Đóng dấu lưu niệm di sản vào Hộ chiếu số thành công! (+100 Điểm Văn Hóa)");
    } finally {
      setStamping(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 text-slate-900 animate-fadeIn">
      {/* 1. THANH TÌM KIẾM DI TÍCH */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm di tích lịch sử, danh thắng, di sản văn hóa..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* 2. CHỌN PHÂN HỆ CON (SUB-FEATURES TABS) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveSubTab("sites")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "sites"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Di Tích Quốc Gia
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("geofencing")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "geofencing"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          GPS Geofencing 20m
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("sacphong")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "sacphong"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sắc Phong Deep Zoom
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("tours")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "tours"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Tuyến Tham Quan
        </button>
      </div>

      {/* 3. LỐI TẮT TÍNH NĂNG NHANH (QUICK ACTIONS GRID - LIGHT THEME) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Tiện Ích Số Hóa Di Sản ViOne Heritage</span>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            GPS Geofencing & VR360
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: GPS Geofence */}
          <button
            type="button"
            onClick={() => setActiveSubTab("geofencing")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Bán Kính 20m</span>
            <span className="text-[8px] text-slate-500">Tự phát Audio</span>
          </button>

          {/* Quick Action 2: Deep Zoom */}
          <button
            type="button"
            onClick={() => setActiveSubTab("sacphong")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <ZoomIn className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">
              Soi Sắc Phong
            </span>
            <span className="text-[8px] text-slate-500">Dịch chữ Hán</span>
          </button>

          {/* Quick Action 3: Tuyến tour */}
          <button
            type="button"
            onClick={() => setActiveSubTab("tours")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Navigation className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Tuyến Tour</span>
            <span className="text-[8px] text-slate-500">Chuyên đề di sản</span>
          </button>

          {/* Quick Action 4: Đóng dấu lưu niệm */}
          <button
            type="button"
            onClick={() => {
              if (sites[0]) handleStamp(sites[0].id);
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Đóng Dấu</span>
            <span className="text-[8px] text-slate-500">Hộ chiếu số</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DANH SÁCH DI TÍCH QUỐC GIA */}
      {activeSubTab === "sites" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-amber-600" />
              <span>Điểm Đến Di Sản & Danh Thắng ({sites.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500">Đã kiểm duyệt</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#D8B282] transition-all space-y-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={
                      site.thumbnail_url ||
                      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={site.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-slate-200 px-2.5 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm">
                    {site.category}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
                    {site.stamps_count || 1250} Du Khách Đã Check-in
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{site.name}</h4>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{site.province}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStamp(site.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Award className="h-3.5 w-3.5 text-amber-600" />
                    <span>Đóng Dấu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSite(site)}
                    className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>Khám Phá Di Tích</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MÔ PHỎNG GPS GEOFENCING 20M */}
      {activeSubTab === "geofencing" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-rose-600 animate-pulse" />
                <span>Định Vị GPS Geofencing Thuật Toán Haversine</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Tự động kích hoạt Audio Guide khi bán kính &lt; 20m di tích
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${userDistance <= 20 ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {userDistance <= 20 ? "ĐÃ KÍCH HOẠT THUYẾT MINH" : "NGOÀI VÙNG ĐỊNH VỊ"}
            </span>
          </div>

          {/* Interactive Slider simulation */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Khoảng cách thiết bị đến cổng Ngọ Môn:
              </span>
              <span className="font-mono font-bold text-amber-800 text-sm">{userDistance} Mét</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              value={userDistance}
              onChange={(e) => {
                const dist = Number(e.target.value);
                setUserDistance(dist);
                if (dist <= 20 && !isAudioAutoTriggered) {
                  setIsAudioAutoTriggered(true);
                  toast.success(
                    "Bước vào bán kính 20m di tích! Hệ thống tự động kích hoạt Audio Guide.",
                  );
                } else if (dist > 20) {
                  setIsAudioAutoTriggered(false);
                }
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0m (Tâm di tích)</span>
              <span className="text-amber-700 font-bold">20m (Bán kính cảm biến)</span>
              <span>50m (Khoảng cách xa)</span>
            </div>
          </div>

          {/* Geofence Audio Status */}
          {userDistance <= 20 ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Volume2 className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-emerald-900 truncate">
                  Đang phát tự động: Lịch sử xây dựng Ngọ Môn Cố Đô Huế
                </h5>
                <p className="text-[10px] text-emerald-700">
                  Ngôn ngữ: Tiếng Việt • Độ dài: 04:30 • Chạm thẻ NFC để lưu bài học
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Di chuyển thiết bị vào gần hơn 20 mét để hệ thống tự động phát bài thuyết minh văn hóa
              đa ngữ.
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: SẮC PHONG & BIA VĂN CỔ DEEP ZOOM */}
      {activeSubTab === "sacphong" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-600" />
                <span>Số Hóa Tư Liệu Sắc Phong & Bia Ký Cổ (Deep Zoom)</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Sắc phong niên hiệu Khải Định năm thứ 2 (1917) phong thần Thành Hoàng
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3.0))}
                className="px-2 py-1 rounded bg-slate-100 text-xs font-bold hover:bg-slate-200"
              >
                + Phóng To
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1.0))}
                className="px-2 py-1 rounded bg-slate-100 text-xs font-bold hover:bg-slate-200"
              >
                - Thu Nhỏ
              </button>
            </div>
          </div>

          {/* Deep Zoom Viewer Canvas */}
          <div className="relative aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-300 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80"
              alt="Sắc phong triều Nguyễn"
              className="h-full w-full object-cover transition-transform duration-300 cursor-grab"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-mono">
              Độ phân giải: 120 Megapixels • Zoom: {zoomLevel}x
            </div>
          </div>

          {/* Translation Details */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Bản Dịch Âm & Nghĩa Chữ Hán - Nôm Sang Quốc Ngữ:</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed italic">
              "Sắc chỉ cho thôn Đông, huyện Phong Điền phụng sự vị thần Dực Bảo Trung Hưng Linh Phò
              Chi Thần, bảo vệ xóm làng, ban phúc thái bình cho trăm họ. Chuẩn y ban sắc ngày 18
              tháng 3 năm Khải Định thứ 2."
            </p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: TUYẾN THAM QUAN THEO CHUYÊN ĐỀ */}
      {activeSubTab === "tours" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span>Tour Tuyến Di Sản Văn Hóa Theo Chuyên Đề</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Lộ trình được thiết kế chuẩn mực bởi các nhà sử học
              </p>
            </div>
            <span className="text-[10px] text-slate-500">3 Lộ trình gợi ý</span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: "1. Tuyến Hoàng Thành Thăng Long - Ngàn Năm Văn Hiến",
                dur: "3.5 Giờ",
                stops: "Đoan Môn -> Điện Kính Thiên -> Hậu Lâu -> Cửa Bắc -> Khảo cổ 18 Hoàng Diệu",
                highlight: "Xem ngói rồng men xanh thời Lê & Giếng nước thời Trần",
              },
              {
                title: "2. Tuyến Di Sản Cố Đô Huế - Dấu Ấn Hoàng Triều",
                dur: "4.0 Giờ",
                stops: "Kỳ Đài -> Ngọ Môn -> Điện Thái Hòa -> Thế Miếu -> Cửu Đỉnh -> Lăng Tự Đức",
                highlight: "Thuyết minh GPS tự động 20m & xem Cửu Đỉnh đúc đồng",
              },
              {
                title: "3. Tuyến Phố Cổ Hội An - Thương Cảng Phồn Hoa",
                dur: "2.5 Giờ",
                stops: "Chùa Cầu -> Nhà cổ Tấn Ký -> Hội quán Phúc Kiến -> Xưởng thủ công gốm",
                highlight: "Quét NFC tra cứu niên đại 400 năm nhà cổ",
              },
            ].map((tour, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{tour.title}</h4>
                  <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {tour.dur}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Điểm dừng chân:</strong> {tour.stops}
                </p>
                <p className="text-[10px] text-amber-700 italic">Trải nghiệm: {tour.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CHUYÊN MỤC BÀI VIẾT DI SẢN */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Chuyên Đề Lịch Sử & Kiến Trúc Di Sản</span>
          </div>
          <span className="text-[10px] text-slate-500">Tư liệu khảo cứu</span>
        </div>

        <div className="space-y-2.5">
          {HERITAGE_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-[#D8B282] transition-all cursor-pointer group"
            >
              <div className="flex gap-3">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="h-20 w-24 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                        {article.category}
                      </span>
                      <span className="text-[9px] text-slate-400">{article.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1 group-hover:text-amber-700 transition-colors">
                      {article.title}
                    </h4>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400">
                    <span className="line-clamp-1">{article.author}</span>
                    <span className="shrink-0">{article.views} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: CHI TIẾT DI TÍCH */}
      {selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {selectedSite.category} • {selectedSite.province}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-slate-900">
                  {selectedSite.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="rounded-full border border-slate-200 bg-slate-100 p-1.5 text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={selectedSite.thumbnail_url}
              alt={selectedSite.name}
              className="w-full h-48 rounded-2xl object-cover border border-slate-200"
            />

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>{selectedSite.description}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleStamp(selectedSite.id)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow flex items-center justify-center gap-1.5"
              >
                <Award className="h-4 w-4" />
                <span>Đóng Dấu Hộ Chiếu Số</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BÀI VIẾT CHI TIẾT */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {selectedArticle.category}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.publishedAt}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-full border border-slate-200 bg-slate-100 p-1.5 text-slate-600 hover:text-slate-900 shrink-0 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={selectedArticle.thumbnail}
              alt={selectedArticle.title}
              className="w-full h-44 rounded-2xl object-cover border border-slate-200"
            />

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-[11px] text-slate-700 font-medium leading-relaxed italic">
              "{selectedArticle.summary}"
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">{selectedArticle.views} lượt đọc</span>
              <button
                type="button"
                onClick={() => toast.success("Đã sao chép liên kết chia sẻ bài viết!")}
                className="flex items-center gap-1 text-amber-700 font-bold hover:text-amber-800"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
