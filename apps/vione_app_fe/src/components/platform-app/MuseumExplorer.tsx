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
  BookOpen,
  Share2,
  Award,
  Layers,
  Smartphone,
  X,
  CheckCircle2,
  Rotate3d,
  Languages,
  Play,
  Pause,
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

export interface MuseumArticle {
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

const MUSEUM_ARTICLES: MuseumArticle[] = [
  {
    id: "art-ngoc-lu",
    title: "Giải Mã Hoa Văn Hình Chim Lạc & Mặt Trời 14 Tia Trên Trống Đồng Ngọc Lũ",
    category: "Bảo Vật Quốc Gia",
    author: "GS. Trần Lâm Biền • Viện Di Sản",
    readTime: "5 phút đọc",
    views: "3.420",
    publishedAt: "28/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    summary: "Trống đồng Ngọc Lũ là kiệt tác nghệ thuật đúc đồng Đông Sơn đỉnh cao, chứa đựng tư duy vũ trụ luận và tín ngưỡng phồn thực của người Việt cổ cách đây hơn 2.500 năm.",
    content: [
      "Trống đồng Ngọc Lũ (niên đại thế kỷ III - II TCN) được xếp hạng Bảo vật quốc gia đợt 1 năm 2012. Hoa văn chính giữa mặt trống là hình ngôi sao 14 tia tượng trưng cho mặt trời - nguồn cội của sự sống.",
      "Xen kẽ giữa các tia là họa tiết lông công và lá dừa cách điệu. Vành 6 và vành 8 thể hiện hình ảnh chim Lạc bay ngược chiều kim đồng hồ, biểu tượng cho chu kỳ vận hành của mùa vụ nông nghiệp lúa nước.",
      "Công nghệ 3D Photogrammetry trên ViOne Museum tái hiện từng rãnh đúc siêu nhỏ, giúp người xem xoay 360 độ và phóng to chi tiết với độ phân giải siêu nét.",
      "Khi chạm điện thoại có tính năng NFC vào thẻ chip gắn tại bệ trưng bày bảo tàng, ứng dụng ViOne sẽ tự động kích hoạt bài thuyết minh âm thanh độ nét cao.",
    ],
  },
  {
    id: "art-ngai-vang",
    title: "Nghệ Thuật Chạm Khắc Rồng Vàng Thời Nguyễn Trên Ngai Vàng Điện Thái Hòa",
    category: "Cung Đình Huế",
    author: "TS. Phan Thanh Hải • Trung Tâm Bảo Tồn Di Tích Cố Đô",
    readTime: "4 phút đọc",
    views: "2.890",
    publishedAt: "26/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
    summary: "Ngai vàng triều Nguyễn tại điện Thái Hòa - biểu tượng quyền lực tối cao của 13 vị hoàng đế triều Nguyễn với nghệ thuật sơn thếp vàng đỉnh cao thế kỷ XIX.",
    content: [
      "Ngai vàng được làm bằng gỗ quý sơn thếp vàng, chạm khắc tinh xảo họa tiết cửu long (chín con rồng) ẩn hiện trong mây ngũ sắc.",
      "Phía trên ngai có bửu tán bằng gỗ thếp vàng rực rỡ. Toàn bộ hiện vật được số hóa 3D không gian thực tế ảo, du khách có thể xoay ngắm chi tiết hoa văn mạ vàng từ mọi góc độ.",
    ],
  },
];

export const MuseumExplorer: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<MuseumArticle | null>(null);
  const [scanningNfc, setScanningNfc] = useState(false);
  const [bookingTicket, setBookingTicket] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"gallery" | "artifacts" | "audio" | "timeline">("gallery");

  // Audio Guide State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"vi" | "en" | "fr" | "ja">("vi");
  const [modelRotation, setModelRotation] = useState(45);

  const loadMuseums = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<Museum[]>("/platform-hub/museums");
      if (Array.isArray(res) && res.length > 0) {
        setMuseums(res);
      } else {
        setMuseums([
          {
            id: "mus-1",
            code: "BT-LSQG",
            name: "Bảo Tàng Lịch Sử Quốc Gia Việt Nam",
            address: "Số 1 Tràng Tiền & 216 Trần Quang Khải, Hoàn Kiếm",
            province: "Hà Nội",
            ticket_price: 40000,
            opening_hours: "08:00 - 17:00 (Thứ 3 - Chủ nhật)",
            artifacts_count: 200000,
            thumbnail_url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80",
            artifacts: [
              {
                id: "art-1",
                artifact_code: "BVQG-01",
                name: "Trống đồng Ngọc Lũ (Thời Đông Sơn)",
                period: "Thế kỷ III - II TCN (Thời đại kim khí)",
                nfc_uid: "04:A1:22:9C:B8:10:80",
                is_national_treasure: true,
                image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
                description: "Kiệt tác đúc đồng đỉnh cao của văn hóa Đông Sơn. Mặt trống trang trí ngôi sao 14 cánh, hình chim Lạc bay và cảnh sinh hoạt lễ hội giã gạo của người Việt cổ.",
              },
              {
                id: "art-2",
                artifact_code: "BVQG-02",
                name: "Thạp đồng Đào Thịnh",
                period: "Thế kỷ V TCN (Văn hóa Đông Sơn)",
                nfc_uid: "04:B2:33:8D:C9:20:90",
                is_national_treasure: true,
                image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
                description: "Chiếc thạp đồng lớn nhất Việt Nam được trang trí cảnh giao hoan phồn thực, cầu mong sự sinh sôi nảy nở của con người và mùa màng.",
              },
            ],
          },
          {
            id: "mus-2",
            code: "BT-CDH",
            name: "Bảo Tàng Cổ Vật Cung Đình Huế",
            address: "Số 03 Lê Trực, Phường Thuận Thành",
            province: "Thừa Thiên Huế",
            ticket_price: 50000,
            opening_hours: "07:30 - 17:30 (Hàng ngày)",
            artifacts_count: 10000,
            thumbnail_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
            artifacts: [
              {
                id: "art-3",
                artifact_code: "BVQG-03",
                name: "Ngai Vàng Triều Nguyễn (Điện Thái Hòa)",
                period: "Năm 1802 (Triều vua Gia Long)",
                nfc_uid: "04:C3:44:7E:DA:30:00",
                is_national_treasure: true,
                image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
                description: "Ngai vàng gỗ thếp vàng lộng lẫy, biểu tượng quyền lực của 13 đời vua Nguyễn với nghệ thuật sơn son thếp vàng đỉnh cao.",
              },
            ],
          },
        ]);
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

  const handleSimulateNfcTap = async (uid?: string) => {
    const targetUid = uid || "04:A1:22:9C:B8:10:80";
    setScanningNfc(true);
    try {
      const artifact = await fetchNestApi<Artifact>(`/platform-hub/artifacts/nfc/${targetUid}`);
      if (artifact && artifact.id) {
        toast.success(`Chạm 1-Tap NFC thành công! Mở hiện vật: ${artifact.name}`);
        setSelectedArtifact(artifact);
      } else {
        setSelectedArtifact({
          id: "art-1",
          artifact_code: "BVQG-01",
          name: "Trống đồng Ngọc Lũ (Thời Đông Sơn)",
          period: "Thế kỷ III - II TCN (Thời đại kim khí)",
          nfc_uid: targetUid,
          is_national_treasure: true,
          image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
          description: "Kiệt tác đúc đồng đỉnh cao của văn hóa Đông Sơn. Mặt trống trang trí ngôi sao 14 cánh, hình chim Lạc bay và cảnh sinh hoạt lễ hội giã gạo của người Việt cổ.",
        });
        toast.success("Chạm 1-Tap NFC thành công! Mở mô hình 3D Trống đồng Ngọc Lũ.");
      }
    } catch (err: any) {
      toast.error("Không nhận diện được thẻ NFC này trên hệ thống.");
    } finally {
      setScanningNfc(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 text-slate-900 animate-fadeIn">
      {/* 1. THANH TÌM KIẾM & NÚT CHẠM NFC */}
      <div className="flex items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bảo vật quốc gia, cổ vật 3D, niên đại..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSimulateNfcTap("04:A1:22:9C:B8:10:80")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow hover:brightness-105 active:scale-95 transition-all shrink-0"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>Chạm NFC</span>
        </button>
      </div>

      {/* 2. CHỌN PHÂN HỆ CON (SUB-FEATURES TABS) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveSubTab("gallery")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "gallery"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Phòng Trưng Bày 3D
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("artifacts")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "artifacts"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Xoay Lật 360°
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("audio")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "audio"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Audio Guide Đa Ngữ
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("timeline")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "timeline"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Niên Biểu & QR
        </button>
      </div>

      {/* 3. LỐI TẮT TÍNH NĂNG NHANH (QUICK ACTIONS GRID - LIGHT THEME) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Tính Năng Nổi Bật Bảo Tàng Số 3D</span>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            WebGL 3D & NFC
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Chạm NFC */}
          <button
            type="button"
            onClick={() => handleSimulateNfcTap("04:A1:22:9C:B8:10:80")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Chạm NFC</span>
            <span className="text-[8px] text-slate-500">1-Tap hiện vật</span>
          </button>

          {/* Quick Action 2: Xoay lật 360 */}
          <button
            type="button"
            onClick={() => setActiveSubTab("artifacts")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Rotate3d className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Xoay 360°</span>
            <span className="text-[8px] text-slate-500">Photogrammetry</span>
          </button>

          {/* Quick Action 3: Audio Guide */}
          <button
            type="button"
            onClick={() => setActiveSubTab("audio")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Volume2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Audio Guide</span>
            <span className="text-[8px] text-slate-500">4 Ngôn ngữ</span>
          </button>

          {/* Quick Action 4: Tra cứu QR */}
          <button
            type="button"
            onClick={() => setActiveSubTab("timeline")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <QrCode className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Quét QR</span>
            <span className="text-[8px] text-slate-500">Hồ sơ bảo vật</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: PHÒNG TRƯNG BÀY 3D (VIRTUAL EXHIBITION GALLERY) */}
      {activeSubTab === "gallery" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-amber-600" />
              <span>Bảo Tàng & Không Gian Trưng Bày Tiêu Biểu ({museums.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500">Tham quan số hóa</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {museums.map((mus) => (
              <div
                key={mus.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#D8B282] transition-all space-y-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={mus.thumbnail_url || "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80"}
                    alt={mus.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-slate-200 px-2.5 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm">
                    {mus.province}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-amber-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
                    Giá vé: {mus.ticket_price.toLocaleString("vi-VN")} đ
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{mus.name}</h4>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{mus.address}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{mus.opening_hours}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">
                    {mus.artifacts?.length || 2} Bảo vật quốc gia số hóa 3D
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (mus.artifacts && mus.artifacts[0]) {
                        setSelectedArtifact(mus.artifacts[0]);
                      } else {
                        toast.info("Đang nạp không gian 3D bảo tàng...");
                      }
                    }}
                    className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>Vào Xem 3D</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: XOAY LẬT MÔ HÌNH HIỆN VẬT 3D 360 ĐỘ */}
      {activeSubTab === "artifacts" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Rotate3d className="h-4 w-4 text-blue-600" />
                <span>Mô Hình 3D Photogrammetry Tương Tác 360°</span>
              </h3>
              <p className="text-[10px] text-slate-500">Trống đồng Ngọc Lũ (Thời Đông Sơn - Thế kỷ III TCN)</p>
            </div>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
              Bảo Vật Quốc Gia #01
            </span>
          </div>

          {/* 3D Canvas Mockup Container */}
          <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center p-4">
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=700&q=80"
              alt="Trống đồng 3D"
              className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-300"
              style={{ transform: `rotate(${modelRotation}deg) scale(1.05)` }}
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
              <Box className="h-3 w-3 text-amber-600" />
              <span>WebGL / Three.js 60fps</span>
            </div>
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm text-xs">
              <span className="text-[11px] font-bold text-slate-700">Góc xoay: {modelRotation}°</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setModelRotation((r) => (r - 45 + 360) % 360)}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200"
                >
                  Xoay Trái
                </button>
                <button
                  type="button"
                  onClick={() => setModelRotation((r) => (r + 45) % 360)}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200"
                >
                  Xoay Phải
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">Chi Tiết Cổ Vật:</h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Trống đồng Ngọc Lũ có dáng cân đối, trang trí hoa văn chìm nổi tinh tế. Chính giữa mặt trống có hình ngôi sao 14 cánh, xen giữa các cánh là họa tiết lông công. Xung quanh có 16 vành hoa văn hình học, động vật và hình ảnh con người nhảy múa trong lễ hội.
            </p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: AUDIO GUIDE ĐA NGỮ */}
      {activeSubTab === "audio" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-emerald-600" />
                <span>Thuyết Minh Âm Thanh Audio Guide Đa Ngữ</span>
              </h3>
              <p className="text-[10px] text-slate-500">Trí tuệ nhân tạo AI Voice tái hiện lịch sử hào hùng</p>
            </div>
            <div className="flex items-center gap-1">
              {[
                { code: "vi", label: "Tiếng Việt" },
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "ja", label: "日本語" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang.code as any);
                    toast.info(`Đã đổi ngôn ngữ Audio Guide sang: ${lang.label}`);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    selectedLanguage === lang.code
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Player Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                {isPlayingAudio ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Bài thuyết minh: Trống đồng Ngọc Lũ & Lịch sử Văn hóa Đông Sơn
                </h4>
                <p className="text-[10px] text-slate-500">Giọng đọc: AI Voice truyền cảm • Thời lượng: 03:45</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full bg-amber-600 rounded-full ${isPlayingAudio ? "w-2/5 animate-pulse" : "w-1/12"}`} />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>{isPlayingAudio ? "01:28" : "00:15"}</span>
                <span>03:45</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Danh Sách Bài Thuyết Minh Sẵn Có:</h4>
            {[
              { id: 1, title: "1. Khái quát nghệ thuật đúc đồng đỉnh cao thời Đông Sơn", dur: "04:12" },
              { id: 2, title: "2. Giải mã biểu tượng chim Lạc và tín ngưỡng mặt trời", dur: "03:30" },
              { id: 3, title: "3. Ngai vàng Điện Thái Hòa - Biểu tượng vương quyền triều Nguyễn", dur: "05:18" },
              { id: 4, title: "4. Gốm hoa lam Chu Đậu - Dòng gốm đạo thế kỷ XV", dur: "04:45" },
            ].map((item) => (
              <div key={item.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-all cursor-pointer">
                <span className="text-xs font-medium text-slate-800">{item.title}</span>
                <span className="text-[10px] font-mono text-slate-500">{item.dur}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: NIÊN BIỂU LỊCH SỬ & QUÉT QR */}
      {activeSubTab === "timeline" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Niên Biểu Lịch Sử & Tra Cứu Mã QR Hiện Vật</span>
              </h3>
              <p className="text-[10px] text-slate-500">Tra cứu nhanh hồ sơ di sản được số hóa</p>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Đã mở camera quét mã QR hiện vật bảo tàng!")}
              className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Quét QR</span>
            </button>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-300">
            {[
              {
                period: "Thế kỷ V - II TCN",
                name: "Thời Đại Đông Sơn - Nhà Nước Văn Lang & Âu Lạc",
                desc: "Kiệt tác Trống đồng Ngọc Lũ, Thạp đồng Đào Thịnh, Dao găm chuôi hình người.",
              },
              {
                period: "Thế kỷ X - XIV",
                name: "Thời Đại Lý - Trần (Thăng Long Kinh Kỳ)",
                desc: "Rồng thời Lý chạm khắc đá chùa Phật Tích, Chuông đồng chùa Một Cột.",
              },
              {
                period: "Thế kỷ XV - XVIII",
                name: "Thời Lê Sơ & Mạc (Văn Hóa Gốm Sứ Đại Việt)",
                desc: "Bình gốm hoa lam Chu Đậu, Bia tiến sĩ Văn Miếu Quốc Tử Giám.",
              },
              {
                period: "Thế kỷ XIX - XX",
                name: "Triều Đại Nhà Nguyễn (Kinh Đô Huế)",
                desc: "Ngai vàng điện Thái Hòa, Cửu Đỉnh đúc đồng trước Thế Miếu, Áo hoàng bào thêu chỉ vàng.",
              },
            ].map((t, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-amber-600 bg-white" />
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                  {t.period}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{t.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CHUYÊN MỤC BÀI VIẾT BẢO TÀNG */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Chuyên Đề Bảo Vật Quốc Gia & Khảo Cổ Học</span>
          </div>
          <span className="text-[10px] text-slate-500">Nghiên cứu văn hóa</span>
        </div>

        <div className="space-y-2.5">
          {MUSEUM_ARTICLES.map((article) => (
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

      {/* MODAL: HIỆN VẬT CHI TIẾT */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {selectedArtifact.artifact_code} • {selectedArtifact.period}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-slate-900">
                  {selectedArtifact.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="rounded-full border border-slate-200 bg-slate-100 p-1.5 text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={selectedArtifact.image_url}
              alt={selectedArtifact.name}
              className="w-full h-48 rounded-2xl object-cover border border-slate-200"
            />

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 leading-relaxed">
              {selectedArtifact.description}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.success("Đang kích hoạt Audio Guide thuyết minh hiện vật...");
                  setActiveSubTab("audio");
                  setSelectedArtifact(null);
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow flex items-center justify-center gap-1.5"
              >
                <Volume2 className="h-4 w-4" />
                <span>Nghe Thuyết Minh Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BÀI VIẾT CHI TIẾT */}
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
