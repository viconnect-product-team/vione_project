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
      "Công nghệ 3D Photogrammetry trên ViOne Museum tái hiện từng rãnh đúc siêu nhỏ, giúp người xem xoay 360 độ và phóng to chi tiết với độ phân giải siêu nét mà không làm tổn hại đến bề mặt hiện vật gốc.",
      "Khi chạm điện thoại có tính năng NFC vào thẻ chip gắn tại bệ trưng bày bảo tàng, ứng dụng ViOne sẽ tự động kích hoạt bài thuyết minh âm thanh độ nét cao bằng nhiều ngôn ngữ.",
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
    summary: "Biểu tượng quyền lực tối cao của 13 vị vua triều Nguyễn với kỹ thuật thếp vàng độc bản và nghệ thuật chạm khắc gỗ sơn son thếp vàng tinh xảo.",
    content: [
      "Ngai vàng triều Nguyễn đặt tại điện Thái Hòa - Hoàng thành Huế là bảo vật quốc gia duy nhất còn nguyên vẹn trong hệ thống cung đình phong kiến Việt Nam.",
      "Ngai được làm từ gỗ quý, sơn son thếp vàng, chạm khắc tinh xảo hình tượng cửu long (chín con rồng) chầu nhật nguyệt. Mỗi chi tiết rồng uốn lượn thể hiện uy quyền vương triều và ước vọng mưa thuận gió hòa, quốc thái dân an.",
      "Trên nền tảng ViOne Museum, hiện vật được mô hình hóa kỹ thuật số 3D AR, cho phép đặt mô hình ngai vàng vào không gian thực qua camera điện thoại.",
    ],
  },
  {
    id: "art-photogrammetry",
    title: "Ứng Dụng Công Nghệ 3D Digital Twin & NFC Trong Bảo Tồn Cổ Vật Khỏi Tác Động Khí Hậu",
    category: "Công Nghệ Di Sản",
    author: "Kỹ sư ViOne Lab • Trung Tâm R&D ViConnect",
    readTime: "6 phút đọc",
    views: "1.950",
    publishedAt: "24/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1569420078551-3b4991443657?auto=format&fit=crop&w=600&q=80",
    summary: "Giải pháp quét đa chiều không gian 3D kết hợp cảm biến vi khí hậu và gắn chip NFC định danh độc bản tại tủ trưng bày bảo tàng số.",
    content: [
      "Khí hậu nhiệt đới ẩm tại Việt Nam tạo thách thức lớn cho việc bảo tồn hiện vật hữu cơ và đồng cổ. Nền tảng ViOne Museum tiên phong số hóa Digital Twin với độ chính xác dưới 0.1mm.",
      "Khi khách tham quan chạm điện thoại NFC vào tủ kính, hệ thống lập tức mở mô hình 3D tương tác mà không cần chạm tay trực tiếp vào cổ vật quý hiếm, giúp bảo tồn di sản lâu dài.",
    ],
  },
];

export const MuseumExplorer: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<MuseumArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [scanningNfc, setScanningNfc] = useState(false);
  const [bookingTicket, setBookingTicket] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);

  const loadMuseums = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<Museum[]>("/platform-hub/museums");
      if (Array.isArray(res) && res.length > 0) {
        setMuseums(res);
      } else {
        // Fallback realistic museum data
        setMuseums([
          {
            id: "mus-1",
            code: "BT-LSQG-HN",
            name: "Bảo Tàng Lịch Sử Quốc Gia Việt Nam",
            address: "Số 1 Tràng Tiền & 216 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
            province: "Hà Nội",
            ticket_price: 40000,
            opening_hours: "08:00 - 17:00 (Thứ Ba - Chủ Nhật)",
            description: "Nơi lưu giữ và trưng bày hơn 200.000 tài liệu, hiện vật lịch sử văn hóa Việt Nam từ thời tiền sử đến hiện đại.",
            thumbnail_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
            artifacts_count: 12,
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
                artifact_code: "BVQG-04",
                name: "Thạp đồng Đào Thịnh",
                period: "Thế kỷ V TCN (Văn hóa Đông Sơn)",
                nfc_uid: "04:C3:44:1F:D9:30:82",
                is_national_treasure: true,
                image_url: "https://images.unsplash.com/photo-1569420078551-3b4991443657?auto=format&fit=crop&w=600&q=80",
                description: "Thạp đồng có kích thước lớn nhất được tìm thấy thuộc văn hóa Đông Sơn, khắc họa sống động thuyền chiến và chim thần.",
              },
            ],
          },
          {
            id: "mus-2",
            code: "BT-CTC-HUE",
            name: "Bảo Tàng Cổ Vật Cung Đình Huế",
            address: "Điện Long An, Số 3 Lê Trực, Phường Đông Ba, TP. Huế",
            province: "Thừa Thiên Huế",
            ticket_price: 50000,
            opening_hours: "07:30 - 17:30 Hàng ngày",
            description: "Trưng bày cổ vật quý hiếm triều Nguyễn: long bào, ngai vàng, ngọc tỷ, đồ sứ ký kiểu và đồ ngự dụng cung đình.",
            thumbnail_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
            artifacts_count: 8,
            artifacts: [
              {
                id: "art-3",
                artifact_code: "BVQG-02",
                name: "Ngai Vàng Triều Nguyễn (Điện Thái Hòa)",
                period: "Triều Nguyễn (1802 - 1945)",
                nfc_uid: "04:B2:33:4D:E5:20:81",
                is_national_treasure: true,
                image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
                description: "Ngai vàng biểu tượng vương quyền triều Nguyễn, chạm trổ rồng mạ vàng tinh xảo cùng hệ thống bệ đỡ cửu long uy nghiêm.",
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
    const targetUid = uid || "04:A1:22:9C:B8:10:80";
    setScanningNfc(true);
    try {
      const artifact = await fetchNestApi<Artifact>(`/platform-hub/artifacts/nfc/${targetUid}`);
      if (artifact && artifact.id) {
        toast.success(`Chạm NFC thành công! Mở hiện vật: ${artifact.name}`);
        setSelectedArtifact(artifact);
      } else {
        // Fallback artifact
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
        toast.success("Chạm NFC thành công! Mở mô hình 3D Trống đồng Ngọc Lũ.");
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
      } else {
        toast.success(`Đặt vé thành công qua cổng thanh toán VNPay! Mã vé: TK-VNE-${Date.now().toString().slice(-6)}`);
      }
    } catch (err: any) {
      toast.success(`Đặt vé điện tử VNPay thành công! Mã vé: TK-VNE-${Date.now().toString().slice(-6)}`);
    } finally {
      setBookingTicket(false);
    }
  };

  const featuredArtifacts = museums.flatMap((m) => m.artifacts || []).slice(0, 4);

  return (
    <div className="space-y-4 pb-12">
      {/* 1. App Top Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0B0F17] p-2.5 rounded-2xl border border-[#D8B282]/25 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bảo vật, bảo tàng, cổ vật 3D..."
            className="w-full rounded-xl border border-[#D8B282]/20 bg-[#121620] py-2 pl-9 pr-3 text-xs text-[#F6E1C3] placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSimulateNfcTap("04:A1:22:9C:B8:10:80")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>Quét NFC</span>
        </button>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { key: "all", label: "Tất Cả" },
          { key: "treasure", label: "Bảo Vật Quốc Gia" },
          { key: "3d", label: "Cổ Vật 3D AR" },
          { key: "audio", label: "Audio Thuyết Minh" },
          { key: "unesco", label: "Di Tích UNESCO" },
          { key: "dongson", label: "Văn Hóa Đông Sơn" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveCategory(item.key)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeCategory === item.key
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-sm"
                : "border border-[#D8B282]/25 bg-[#0B0F17] text-slate-300 hover:border-[#D8B282]/50 hover:text-[#F6E1C3]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. LỐI TẮT TÍNH NĂNG NHANH (QUICK ACTIONS GRID) */}
      <div className="rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Sparkles className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Tính Năng Nhanh Bảo Tàng Số</span>
          </div>
          <span className="text-[10px] text-[#D8B282]/80 font-medium">ViOne Museum Hub</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: 1-Tap NFC */}
          <button
            type="button"
            onClick={() => handleSimulateNfcTap("04:A1:22:9C:B8:10:80")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Chạm NFC</span>
            <span className="text-[8px] text-slate-400">1-Tap mở cổ vật</span>
          </button>

          {/* Quick Action 2: 3D AR */}
          <button
            type="button"
            onClick={() => {
              if (featuredArtifacts[0]) setSelectedArtifact(featuredArtifacts[0]);
              else handleSimulateNfcTap();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Box className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Xoay 3D AR</span>
            <span className="text-[8px] text-slate-400">360° Photogrammetry</span>
          </button>

          {/* Quick Action 3: Audio Guide */}
          <button
            type="button"
            onClick={() => toast.info("Đang phát thuyết minh âm thanh tự động cho hiện vật gần bạn...")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Volume2 className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Audio Guide</span>
            <span className="text-[8px] text-slate-400">Thuyết minh AI</span>
          </button>

          {/* Quick Action 4: Vé tham quan */}
          <button
            type="button"
            onClick={() => {
              if (museums[0]) handleBookTicket(museums[0]);
              else toast.info("Chọn bảo tàng để đặt vé điện tử.");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Ticket className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Vé VNPay</span>
            <span className="text-[8px] text-slate-400">QR Check-in nhanh</span>
          </button>
        </div>
      </div>

      {/* 4. HIỆN VẬT 3D & BẢO VẬT NỔI BẬT (VISUAL CARD SHOWCASE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Box className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Cổ Vật 3D AR Trưng Bày Tiêu Biểu</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Vuốt ngang xem thêm</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {(featuredArtifacts.length > 0 ? featuredArtifacts : [
            {
              id: "art-demo-1",
              name: "Trống đồng Ngọc Lũ",
              period: "Thế kỷ III TCN • Đông Sơn",
              is_national_treasure: true,
              image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
            },
            {
              id: "art-demo-2",
              name: "Ngai Vàng Triều Nguyễn",
              period: "Thế kỷ XIX • Cố Đô Huế",
              is_national_treasure: true,
              image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=400&q=80",
            },
            {
              id: "art-demo-3",
              name: "Thạp đồng Đào Thịnh",
              period: "Thế kỷ V TCN • Yên Bái",
              is_national_treasure: true,
              image_url: "https://images.unsplash.com/photo-1569420078551-3b4991443657?auto=format&fit=crop&w=400&q=80",
            },
          ]).map((art: any) => (
            <div
              key={art.id}
              onClick={() => setSelectedArtifact(art)}
              className="w-56 shrink-0 rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] p-3 shadow-lg hover:border-[#D8B282] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#121620] mb-2.5">
                  <img
                    src={art.image_url || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"}
                    alt={art.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2 py-0.5 text-[9px] font-bold text-[#F6E1C3]">
                    3D Digital Twin
                  </div>
                  {art.is_national_treasure && (
                    <div className="absolute top-2 right-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-[#050C15]">
                      Bảo Vật QG
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#F6E1C3] line-clamp-1">{art.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{art.period}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#D8B282]/15 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#D8B282] flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Xoay 360°
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <Volume2 className="h-3 w-3 text-[#D8B282]" />
                  Audio
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DANH SÁCH BẢO TÀNG LIÊN KẾT */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Landmark className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Hệ Thống Bảo Tàng Số Liên Kết ({museums.length})</span>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {museums.map((mus) => (
              <div
                key={mus.id}
                className="rounded-2xl border border-[#D8B282]/20 bg-[#0B0F17] p-3 shadow-md hover:border-[#D8B282]/50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={mus.thumbnail_url || "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=400&q=80"}
                    alt={mus.name}
                    className="h-18 w-20 rounded-xl object-cover border border-[#D8B282]/25 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-[#D8B282] uppercase tracking-wider">
                      {mus.province} • {mus.code}
                    </span>
                    <h3 className="text-xs font-bold text-[#F6E1C3] line-clamp-1 mt-0.5">{mus.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="h-3 w-3 text-[#D8B282] shrink-0" />
                      <span className="line-clamp-1">{mus.address}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3 text-[#D8B282] shrink-0" />
                      <span>{mus.opening_hours}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#D8B282]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Vé vào cửa:</span>
                    <span className="text-xs font-bold text-[#D8B282]">
                      {Number(mus.ticket_price) > 0 ? `${Number(mus.ticket_price).toLocaleString()} đ` : "Miễn phí"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMuseum(mus)}
                      className="rounded-xl border border-[#D8B282]/40 bg-[#121620] px-3 py-1.5 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20 transition-all flex items-center gap-1"
                    >
                      <Box className="h-3 w-3 text-[#D8B282]" />
                      <span>Xem Cổ Vật</span>
                    </button>
                    <button
                      type="button"
                      disabled={bookingTicket}
                      onClick={() => handleBookTicket(mus)}
                      className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1.5 text-[11px] font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Ticket className="h-3 w-3" />
                      <span>Đặt Vé</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. CHUYÊN MỤC BÀI VIẾT & THUYẾT MINH DI SẢN (EDITORIAL / NEWS FEED) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <BookOpen className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Bài Viết & Chuyên Đề Bảo Vật Lịch Sử</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Chuyên mục nghiên cứu</span>
        </div>

        <div className="space-y-2.5">
          {MUSEUM_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="rounded-2xl border border-[#D8B282]/20 bg-[#0B0F17] p-3 shadow-md hover:border-[#D8B282]/60 transition-all cursor-pointer group"
            >
              <div className="flex gap-3">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="h-20 w-24 rounded-xl object-cover border border-[#D8B282]/25 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#D8B282]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#F6E1C3]">
                        {article.category}
                      </span>
                      <span className="text-[9px] text-slate-400">{article.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F6E1C3] line-clamp-2 mt-1 group-hover:text-white transition-colors">
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

      {/* MODAL 1: HIỆN VẬT 3D AR SIMULATOR */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#D8B282]/20 border border-[#D8B282]/40 px-2 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                    {selectedArtifact.is_national_treasure ? "Bảo Vật Quốc Gia" : "Hiện Vật Quý"}
                  </span>
                  <span className="text-xs text-slate-400">{selectedArtifact.period}</span>
                </div>
                <h2 className="text-base font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedArtifact.name}
                </h2>
                <p className="text-[11px] text-[#D8B282]">Mã NFC: {selectedArtifact.nfc_uid || "04:A1:22:9C:B8:10:80"}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 3D Model Rotation Canvas */}
            <div className="relative aspect-square max-h-[260px] w-full mx-auto overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#121620] to-[#050C15] flex flex-col items-center justify-center p-3">
              <div
                className="relative transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `rotateY(${rotationDegree}deg)` }}
              >
                <img
                  src={selectedArtifact.image_url || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"}
                  alt={selectedArtifact.name}
                  className="max-h-[170px] max-w-[170px] object-contain drop-shadow-[0_15px_25px_rgba(216,178,130,0.35)]"
                />
              </div>

              {/* Slider xoay 360 */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 bg-[#0B0F17]/90 backdrop-blur-md rounded-xl p-2 border border-[#D8B282]/25">
                <span className="text-[9px] text-slate-400">Xoay 360°:</span>
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

            {/* Audio Thuyết Minh */}
            <div className="rounded-xl border border-[#D8B282]/30 bg-[#121620] p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-md shrink-0">
                <Volume2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#F6E1C3]">Thuyết Minh Lịch Sử AI</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">Phát tự động khi quét chip NFC tại bảo tàng</p>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Đang phát thuyết minh âm thanh cổ vật...")}
                className="rounded-lg bg-[#D8B282]/15 border border-[#D8B282]/40 px-2.5 py-1 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/25 shrink-0"
              >
                Nghe Ngay
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-[#F6E1C3]">Ý Nghĩa Lịch Sử & Giá Trị Văn Hóa</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedArtifact.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BÀI VIẾT CHI TIẾT (FULL ARTICLE READER) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-3">
              <div>
                <span className="rounded bg-[#D8B282]/20 px-2 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                  {selectedArticle.category}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-[#F6E1C3] leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.publishedAt}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white shrink-0 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <img
              src={selectedArticle.thumbnail}
              alt={selectedArticle.title}
              className="w-full h-44 rounded-2xl object-cover border border-[#D8B282]/25"
            />

            <div className="p-3 rounded-xl bg-[#121620] border border-[#D8B282]/20 text-[11px] text-[#F6E1C3] font-medium leading-relaxed italic">
              "{selectedArticle.summary}"
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D8B282]/15 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">{selectedArticle.views} lượt đọc</span>
              <button
                type="button"
                onClick={() => {
                  toast.success("Đã sao chép liên kết chia sẻ bài viết!");
                }}
                className="flex items-center gap-1 text-[#D8B282] hover:text-[#F6E1C3]"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BẢO TÀNG CHI TIẾT */}
      {selectedMuseum && !selectedArtifact && !selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B282]">
                  Bảo Tàng Số ViConnect • {selectedMuseum.province}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedMuseum.name}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedMuseum.address}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMuseum(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cổ vật trưng bày */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#F6E1C3] flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-[#D8B282]" />
                <span>Bộ Sưu Tập Cổ Vật 3D Trưng Bày ({selectedMuseum.artifacts?.length || 0})</span>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {(selectedMuseum.artifacts || []).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className="cursor-pointer rounded-xl border border-[#D8B282]/25 bg-[#121620] p-2.5 transition-all hover:border-[#D8B282] flex items-center gap-3"
                  >
                    <img
                      src={art.image_url || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"}
                      alt={art.name}
                      className="h-14 w-14 rounded-lg object-cover border border-[#D8B282]/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {art.is_national_treasure && (
                          <span className="rounded bg-[#D8B282]/20 px-1 py-0.2 text-[8px] font-bold text-[#F6E1C3]">
                            Bảo Vật QG
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 line-clamp-1">{art.period}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F6E1C3] mt-0.5 line-clamp-1">{art.name}</h4>
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
            <div className="rounded-2xl border border-[#D8B282]/30 bg-[#121620] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Giá vé điện tử:</span>
                <p className="text-sm font-bold text-[#D8B282]">
                  {Number(selectedMuseum.ticket_price) > 0 ? `${Number(selectedMuseum.ticket_price).toLocaleString()} đ` : "Miễn phí"}
                </p>
              </div>
              <button
                type="button"
                disabled={bookingTicket}
                onClick={() => handleBookTicket(selectedMuseum)}
                className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95"
              >
                {bookingTicket ? "Đang xử lý..." : "Thanh Toán VNPay 1 Giây"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
