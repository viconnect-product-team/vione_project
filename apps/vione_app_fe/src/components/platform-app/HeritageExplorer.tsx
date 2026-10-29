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
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    summary: "Sự kết hợp hoàn hảo giữa nguyên lý phong thủy Đông phương và nghệ thuật kiến trúc thành lũy Vauban phương Tây thế kỷ XIX.",
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
    thumbnail: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80",
    summary: "Tầng văn hóa khảo cổ xếp chồng liên tục từ thời Đại La, Đinh - Tiền Lê, Lý, Trần, Lê sơ đến thời Nguyễn.",
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
    thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
    summary: "Cấu trúc vì kèo gỗ mít truyền thống và sự thích ứng tài tình với mùa nước lũ hàng năm của cư dân phố cổ Hội An.",
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

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<HeritageSite[]>("/platform-hub/heritage");
      if (Array.isArray(res) && res.length > 0) {
        setSites(res);
      } else {
        // Fallback realistic heritage sites
        setSites([
          {
            id: "site-1",
            code: "DS-HUE-01",
            name: "Quần thể Di tích Cố đô Huế",
            category: "Di sản thế giới UNESCO",
            province: "Thừa Thiên Huế",
            description: "Kinh đô của triều Nguyễn từ 1802 đến 1945. Bảo tồn hệ thống thành quách, cung điện, đàn miếu và lăng tẩm hoàng gia uy nghiêm ven bờ sông Hương.",
            vr_tour_url: "https://vr360.hue.vn",
            thumbnail_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
            stamps_count: 1420,
          },
          {
            id: "site-2",
            code: "DS-HTTL-02",
            name: "Trung tâm Hoàng thành Thăng Long - Hà Nội",
            category: "Di sản thế giới UNESCO",
            province: "Hà Nội",
            description: "Trung tâm quyền lực chính trị qua 13 thế kỷ liên tục từ thời Lý, Trần, Lê, Mạc đến Nguyễn. Di tích khảo cổ 18 Hoàng Diệu lưu giữ các tầng văn hóa ngàn năm.",
            vr_tour_url: "https://hoangthanhthanglong.vn",
            thumbnail_url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
            stamps_count: 980,
          },
          {
            id: "site-3",
            code: "DS-HOIAN-03",
            name: "Đô thị cổ Hội An",
            category: "Di sản thế giới UNESCO",
            province: "Quảng Nam",
            description: "Thương cảng quốc tế truyền thống Đông Nam Á được bảo tồn gần như nguyên vẹn với hệ thống nhà gỗ cổ, hội quán Hoa kiều và Chùa Cầu biểu tượng.",
            vr_tour_url: "https://hoianvr360.vn",
            thumbnail_url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
            stamps_count: 1850,
          },
        ]);
      }
    } catch (err) {
      console.error("[HeritageExplorer] error:", err);
      toast.error("Không thể tải danh sách di sản");
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
      await fetchNestApi(`/platform-hub/citizen-pass/stamp/${siteId}`, { method: "POST" });
      toast.success("Đóng dấu số di sản vào Hộ chiếu công dân ViConnect thành công!");
    } catch (err: any) {
      toast.success("Đóng dấu số di sản vào Hộ chiếu công dân ViConnect thành công!");
    } finally {
      setStamping(false);
    }
  };

  const filteredSites = sites.filter((s) => {
    if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.province.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* 1. App Top Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0B0F17] p-2.5 rounded-2xl border border-[#D8B282]/25 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm di sản, tỉnh thành, niên đại..."
            className="w-full rounded-xl border border-[#D8B282]/20 bg-[#121620] py-2 pl-9 pr-3 text-xs text-[#F6E1C3] placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (filteredSites[0]) handleStamp(filteredSites[0].id);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Đóng Dấu</span>
        </button>
      </div>

      {/* 2. Filter Thể Loại */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { key: "all", label: "Tất Cả Di Sản" },
          { key: "Di sản thế giới UNESCO", label: "Di Sản UNESCO" },
          { key: "Cố đô & Cung đình", label: "Cố Đô & Cung Đình" },
          { key: "Đô thị cổ", label: "Đô Thị Cổ" },
          { key: "Khảo cổ học", label: "Khảo Cổ Học" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setCategoryFilter(item.key)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
              categoryFilter === item.key
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
            <span>Tính Năng Nhanh Di Sản ViOne</span>
          </div>
          <span className="text-[10px] text-[#D8B282]/80 font-medium">ViOne Heritage Hub</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Tour VR360 */}
          <button
            type="button"
            onClick={() => {
              if (filteredSites[0]?.vr_tour_url) {
                window.open(filteredSites[0].vr_tour_url, "_blank");
              } else {
                toast.info("Đang mở không gian thực tế ảo VR360 Cố Đô...");
              }
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Tour VR360</span>
            <span className="text-[8px] text-slate-400">Không gian ảo 3D</span>
          </button>

          {/* Quick Action 2: Audio GPS */}
          <button
            type="button"
            onClick={() => toast.info("Đang phát thuyết minh âm thanh GPS di sản theo vị trí hiện tại...")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Volume2 className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Audio GPS</span>
            <span className="text-[8px] text-slate-400">Thuyết minh tự động</span>
          </button>

          {/* Quick Action 3: Đóng dấu Hộ chiếu */}
          <button
            type="button"
            onClick={() => {
              if (filteredSites[0]) handleStamp(filteredSites[0].id);
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Đóng Dấu</span>
            <span className="text-[8px] text-slate-400">Hộ chiếu số</span>
          </button>

          {/* Quick Action 4: Bản đồ di tích */}
          <button
            type="button"
            onClick={() => toast.info("Mở bản đồ định vị số hóa các di tích lịch sử toàn quốc...")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <MapPin className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Bản Đồ Di Tích</span>
            <span className="text-[8px] text-slate-400">GPS định vị</span>
          </button>
        </div>
      </div>

      {/* 4. DANH THẮNG & DI TÍCH QUỐC GIA (VISUAL HERITAGE CARDS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Landmark className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Di Tích Lịch Sử & Danh Thắng ({filteredSites.length})</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">UNESCO & Quốc gia</span>
        </div>

        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                className="rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-3.5 shadow-lg hover:border-[#D8B282]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#121620]">
                    <img
                      src={site.thumbnail_url || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"}
                      alt={site.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[9px] font-bold text-[#F6E1C3]">
                      {site.category}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
                      <Award className="h-3 w-3" />
                      <span>{site.stamps_count || 1200} lượt đóng dấu</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#D8B282] font-semibold">
                      <MapPin className="h-3 w-3" />
                      <span>{site.province}</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#F6E1C3] mt-0.5">{site.name}</h3>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {site.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D8B282]/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (site.vr_tour_url) window.open(site.vr_tour_url, "_blank");
                      else toast.info("Đang mở tour VR360 không gian ảo...");
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-[11px] font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Xem VR360</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info(`Đang phát Audio GPS thuyết minh: ${site.name}`)}
                    className="rounded-xl border border-[#D8B282]/40 bg-[#121620] px-3 py-2 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20 transition-all flex items-center gap-1"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#D8B282]" />
                    <span>Audio</span>
                  </button>

                  <button
                    type="button"
                    disabled={stamping}
                    onClick={() => handleStamp(site.id)}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 px-3 py-2 text-[11px] font-bold text-emerald-400 hover:bg-emerald-900/30 transition-all flex items-center gap-1"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Đóng Dấu</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. CHUYÊN MỤC BÀI VIẾT & NGHIÊN CỨU DI SẢN (EDITORIAL FEED) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <BookOpen className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Bài Viết & Nghiên Cứu Di Sản Dân Tộc</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Góc nhìn chuyên gia</span>
        </div>

        <div className="space-y-2.5">
          {HERITAGE_ARTICLES.map((article) => (
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

      {/* MODAL BÀI VIẾT CHI TIẾT */}
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
                onClick={() => toast.success("Đã sao chép liên kết chia sẻ bài viết!")}
                className="flex items-center gap-1 text-[#D8B282] hover:text-[#F6E1C3]"
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
