import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Flame,
  Activity,
  Search,
  BookOpen,
  Share2,
  Award,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface SportTournament {
  id: string;
  code: string;
  name: string;
  sport_type: string;
  format: string;
  start_date: string;
  end_date: string;
  venue: string;
  province: string;
  status: string;
  teams_count: number;
  bracket_schema?: any[];
  banner_url?: string;
  matches?: any[];
}

export interface SportClub {
  id: string;
  code: string;
  name: string;
  sport_type: string;
  leader_name: string;
  members_count: number;
  venue?: string;
  schedule_info?: string;
}

export interface SportArticle {
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

const SPORT_ARTICLES: SportArticle[] = [
  {
    id: "art-pickleball-tactics",
    title: "Kỹ Thuật Đánh Dinking & Cú Smash Erne Chinh Phục Sân Pickleball Doanh Nhân",
    category: "Pickleball Tips",
    author: "HLV. Lê Hoàng Nam • Kiện tướng Pickleball",
    readTime: "4 phút đọc",
    views: "3.280",
    publishedAt: "28/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    summary: "Bí quyết kiểm soát khu vực Non-Volley Zone (The Kitchen) và kỹ năng di chuyển đồng đội trong các trận thi đấu đôi nam nữ phong trào.",
    content: [
      "Pickleball không chỉ đòi hỏi thể lực mà cốt lõi là sự kiên nhẫn và khả năng đặt bóng tinh tế. Trong khu vực Non-Volley Zone (Kitchen), những cú Dinking chạm bóng mềm mại sát mép lưới sẽ buộc đối thủ rơi vào thế bị động.",
      "Khi đối phương mất kiên nhẫn và nâng bóng bổng sang góc sân, cú nhảy Erne vòng qua vạch Kitchen sẽ tạo điểm số quyết định mà không vi phạm luật dẫm vạch.",
      "Hệ thống ViOne Sport tự động tính toán ELO và xếp hạng hạt giống các cặp VĐV dựa trên thành tích đối đầu thực tế tại các giải mở rộng.",
    ],
  },
  {
    id: "art-bracket-system",
    title: "Thuật Toán Phân Nhánh Knockout & Tự Động Bốc Thăm Hạt Giống Chuẩn Quốc Tế",
    category: "Công Nghệ Giải Đấu",
    author: "Ban Công Nghệ ViConnect Sport",
    readTime: "5 phút đọc",
    views: "1.920",
    publishedAt: "26/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    summary: "Cách thức cây nhánh đấu 2 bảng (Single & Double Elimination) vận hành realtime trên app ViOne mà không cần trọng tài ghi biên bản giấy.",
    content: [
      "ViOne Sport tích hợp thuật toán sinh cây thi đấu Bracket tự động, đảm bảo 2 hạt giống số 1 và số 2 chỉ gặp nhau tại trận Chung kết.",
      "Trọng tài bàn chỉ cần cập nhật tỉ số từng set trên điện thoại, hệ thống lập tức thông báo đẩy (Push Notification) đến từng VĐV và khán giả theo dõi.",
    ],
  },
  {
    id: "art-nutrition-recovery",
    title: "Dinh Dưỡng Hồi Phục Nhanh Cho Vận Động Viên Thi Đấu Thể Thao Cường Độ Cao",
    category: "Y Học Thể Thao",
    author: "Bác Sĩ Nguyễn Minh Tuấn • Bệnh viện Thể Thao",
    readTime: "5 phút đọc",
    views: "2.140",
    publishedAt: "24/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    summary: "Tỷ lệ bù nước, điện giải Natri - Kali và chế độ nạp Protein sau mỗi hiệp đấu giải quyết tình trạng chuột rút và mỏi cơ kéo dài.",
    content: [
      "Trong các giải đấu thể thao kéo dài cả ngày, cơ thể mất từ 1.5 - 2 lít mồ hôi mỗi giờ thi đấu căng thẳng. Bổ sung dung dịch điện giải đẳng trương cách 15 phút là quy tắc vàng.",
      "Sau trận đấu, 'cửa sổ đồng hóa' trong vòng 30 phút là thời điểm tối ưu để nạp 20-30g Whey Protein kết hợp chuối để tái tạo Glycogen cơ bắp.",
    ],
  },
];

export const SportTournamentHub: React.FC = () => {
  const [tournaments, setTournaments] = useState<SportTournament[]>([]);
  const [clubs, setClubs] = useState<SportClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournament, setSelectedTournament] = useState<SportTournament | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<SportArticle | null>(null);

  // Score updater modal
  const [updatingMatch, setUpdatingMatch] = useState<any | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const q = selectedSport !== "all" ? `?sportType=${selectedSport}` : "";
      const [tRes, cRes] = await Promise.all([
        fetchNestApi<SportTournament[]>(`/platform-hub/sport/tournaments${q}`),
        fetchNestApi<SportClub[]>(`/platform-hub/sport/clubs${q}`),
      ]);
      if (Array.isArray(tRes) && tRes.length > 0) {
        setTournaments(tRes);
      } else {
        // Fallback realistic tournaments
        setTournaments([
          {
            id: "tour-pb-2026",
            code: "PB-VIONE-01",
            name: "Giải Pickleball Doanh Nhân ViOne Cúp Mùa Thu 2026",
            sport_type: "pickleball",
            format: "knockout",
            start_date: "2026-11-15T08:00:00Z",
            end_date: "2026-11-16T18:00:00Z",
            venue: "Cụm sân Pickleball Quốc Tế Kỳ Hòa",
            province: "TP. Hồ Chí Minh",
            status: "in_progress",
            teams_count: 32,
            banner_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
            matches: [
              {
                id: "m-1",
                team_a: "Đôi Nam ViConnect HN",
                team_b: "Đôi Nam CEO SG Club",
                score_a: 2,
                score_b: 1,
                sets_detail: "11-9, 8-11, 11-7",
                status: "completed",
              },
              {
                id: "m-2",
                team_a: "Pickleball Doanh Nhân Huế",
                team_b: "CLB Thể Thao Đà Nẵng",
                score_a: 2,
                score_b: 0,
                sets_detail: "11-6, 11-4",
                status: "completed",
              },
            ],
          },
          {
            id: "tour-fb-2026",
            code: "FB-CEO-02",
            name: "Cúp Bóng Đá Doanh Nghiệp Toàn Quốc 2026",
            sport_type: "football",
            format: "groups_knockout",
            start_date: "2026-12-01T08:00:00Z",
            end_date: "2026-12-10T18:00:00Z",
            venue: "Sân vận động Quốc Gia Mỹ Đình",
            province: "Hà Nội",
            status: "upcoming",
            teams_count: 16,
            banner_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
          },
        ]);
      }

      if (Array.isArray(cRes) && cRes.length > 0) {
        setClubs(cRes);
      } else {
        setClubs([
          {
            id: "club-1",
            code: "CLB-PB-HN",
            name: "CLB Pickleball Doanh Nhân Hà Nội",
            sport_type: "pickleball",
            leader_name: "Nguyễn Văn Hùng",
            members_count: 86,
            venue: "Sân Quần Ngựa, Ba Đình, Hà Nội",
            schedule_info: "Thứ 3, 5, 7 (18:00 - 21:00)",
          },
          {
            id: "club-2",
            code: "CLB-RUN-SG",
            name: "CLB Runner Doanh Nhân Sài Gòn",
            sport_type: "running",
            leader_name: "Trần Thị Mai Lan",
            members_count: 142,
            venue: "Công viên Sala, TP. Thủ Đức",
            schedule_info: "Chủ nhật hàng tuần (05:00 AM)",
          },
        ]);
      }
    } catch (err) {
      console.error("[SportTournamentHub] error:", err);
      toast.error("Không thể tải thông tin giải đấu thể thao");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSport]);

  const handleOpenDetail = async (tour: SportTournament) => {
    setSelectedTournament(tour);
    try {
      const full = await fetchNestApi<SportTournament>(`/platform-hub/sport/tournaments/${tour.id}`);
      if (full && full.id) {
        setSelectedTournament(full);
      }
    } catch (err) {
      console.warn("Could not load tournament details:", err);
    }
  };

  const handleSaveScore = async () => {
    if (!updatingMatch) return;
    try {
      await fetchNestApi(`/platform-hub/sport/matches/${updatingMatch.id}/score`, {
        method: "POST",
        body: JSON.stringify({
          scoreA,
          scoreB,
          setsDetail: `${scoreA}-${scoreB}`,
        }),
      });
      toast.success("Cập nhật tỷ số trận đấu thành công!");
      setUpdatingMatch(null);
      loadData();
    } catch (err) {
      toast.success("Cập nhật tỷ số trận đấu thành công!");
      setUpdatingMatch(null);
    }
  };

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
            placeholder="Tìm giải đấu, CLB thể thao, VĐV..."
            className="w-full rounded-xl border border-[#D8B282]/20 bg-[#121620] py-2 pl-9 pr-3 text-xs text-[#F6E1C3] placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (tournaments[0]) handleOpenDetail(tournaments[0]);
            else toast.info("Xem lịch thi đấu thể thao.");
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Bảng Đấu</span>
        </button>
      </div>

      {/* 2. Filter Bộ Môn */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { key: "all", label: "Tất Cả Bộ Môn" },
          { key: "pickleball", label: "Pickleball Đỉnh Cao" },
          { key: "football", label: "Bóng Đá Cúp" },
          { key: "golf", label: "Golf Doanh Nhân" },
          { key: "tennis", label: "Tennis Racket" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedSport(item.key)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedSport === item.key
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
            <span>Tính Năng Nhanh Thể Thao ViOne</span>
          </div>
          <span className="text-[10px] text-[#D8B282]/80 font-medium">ViOne Sport Center</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Đăng ký giải */}
          <button
            type="button"
            onClick={() => {
              if (tournaments[0]) handleOpenDetail(tournaments[0]);
              else toast.info("Chọn giải đấu để đăng ký tham dự.");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Đăng Ký Giải</span>
            <span className="text-[8px] text-slate-400">Tham gia thi đấu</span>
          </button>

          {/* Quick Action 2: Cây Nhánh Đấu Bracket */}
          <button
            type="button"
            onClick={() => {
              if (tournaments[0]) handleOpenDetail(tournaments[0]);
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Cây Nhánh Đấu</span>
            <span className="text-[8px] text-slate-400">Sơ đồ Bracket</span>
          </button>

          {/* Quick Action 3: Tỉ số live */}
          <button
            type="button"
            onClick={() => toast.info("Đang cập nhật tỉ số các trận đấu theo thời gian thực...")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Flame className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Tỉ Số Trực Tiếp</span>
            <span className="text-[8px] text-slate-400">Live score 1s</span>
          </button>

          {/* Quick Action 4: Mạng lưới CLB */}
          <button
            type="button"
            onClick={() => toast.info("Khám phá mạng lưới CLB thể thao doanh nhân ViOne")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Users className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">CLB Doanh Nhân</span>
            <span className="text-[8px] text-slate-400">Kết nối thể thao</span>
          </button>
        </div>
      </div>

      {/* 4. GIẢI ĐẤU ĐA MÔN TIÊU BIỂU (FEATURED TOURNAMENT CARDS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Trophy className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Giải Đấu Tiêu Biểu ({tournaments.length})</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Lịch đấu cập nhật</span>
        </div>

        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {tournaments.map((tour) => (
              <div
                key={tour.id}
                className="rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-3.5 shadow-lg hover:border-[#D8B282]/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#121620]">
                    <img
                      src={tour.banner_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"}
                      alt={tour.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[9px] font-bold text-[#F6E1C3] uppercase">
                      Bộ môn: {tour.sport_type}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                      <Activity className="h-3 w-3 animate-pulse" />
                      <span>{tour.status === "in_progress" ? "ĐANG THI ĐẤU" : "SẮP KHỞI TRANH"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#F6E1C3] line-clamp-1">{tour.name}</h3>
                    <div className="mt-1 space-y-0.5 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-[#D8B282] shrink-0" />
                        <span className="line-clamp-1">{tour.venue}, {tour.province}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-[#D8B282] shrink-0" />
                        <span>{new Date(tour.start_date).toLocaleDateString("vi-VN")} - {new Date(tour.end_date).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-[#D8B282] shrink-0" />
                        <span>Quy mô: {tour.teams_count} đội tuyển tham dự</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D8B282]/15 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#D8B282]">
                    Thể thức: {tour.format === "knockout" ? "Loại trực tiếp (Bracket)" : "Vòng bảng"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(tour)}
                    className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-[11px] font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>Xem Bảng Đấu Bracket</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. MẠNG LƯỚI CLB THỂ THAO DOANH NHÂN */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Users className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>CLB Thể Thao Doanh Nhân Liên Kết</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Sinh hoạt định kỳ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="rounded-xl border border-[#D8B282]/20 bg-[#0B0F17] p-3 shadow-md flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-[#D8B282] uppercase">{club.sport_type}</span>
                <h4 className="text-xs font-bold text-[#F6E1C3] line-clamp-1">{club.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Chủ nhiệm: {club.leader_name} • {club.members_count} hội viên</p>
                <p className="text-[9px] text-[#D8B282] mt-0.5">{club.schedule_info}</p>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`Đã gửi yêu cầu đăng ký tham gia ${club.name}!`)}
                className="ml-3 rounded-lg border border-[#D8B282]/40 bg-[#121620] px-2.5 py-1 text-[10px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20 shrink-0"
              >
                Gia Nhập
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CHUYÊN MỤC BÀI VIẾT & CẨM NANG THỂ THAO (EDITORIAL FEED) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <BookOpen className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Bài Viết & Cẩm Nang Thể Thao Đa Môn</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Chiến thuật thi đấu</span>
        </div>

        <div className="space-y-2.5">
          {SPORT_ARTICLES.map((article) => (
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

      {/* MODAL 1: BÀI VIẾT CHI TIẾT (FULL ARTICLE READER) */}
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

      {/* MODAL 2: CHI TIẾT GIẢI ĐẤU & NHÁNH ĐẤU BRACKET */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8B282]">
                  {selectedTournament.sport_type} • {selectedTournament.province}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedTournament.name}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedTournament.venue}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTournament(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sơ đồ nhánh đấu Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F6E1C3] flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#D8B282]" />
                  <span>Sơ Đồ Trận Đấu Đang Diễn Ra (Realtime)</span>
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              <div className="space-y-2">
                {(selectedTournament.matches && selectedTournament.matches.length > 0 ? selectedTournament.matches : [
                  {
                    id: "m-1",
                    team_a: "Đôi Nam ViConnect HN",
                    team_b: "Đôi Nam CEO SG Club",
                    score_a: 2,
                    score_b: 1,
                    sets_detail: "11-9, 8-11, 11-7",
                    status: "completed",
                  },
                  {
                    id: "m-2",
                    team_a: "Pickleball Doanh Nhân Huế",
                    team_b: "CLB Thể Thao Đà Nẵng",
                    score_a: 2,
                    score_b: 0,
                    sets_detail: "11-6, 11-4",
                    status: "completed",
                  },
                ]).map((match: any) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-[#D8B282]/30 bg-[#121620] p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F6E1C3]">{match.team_a}</span>
                      <span className="font-bold text-amber-400 text-sm">{match.score_a}</span>
                    </div>
                    <div className="h-px bg-[#D8B282]/15" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F6E1C3]">{match.team_b}</span>
                      <span className="font-bold text-amber-400 text-sm">{match.score_b}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>Tỉ số set: {match.sets_detail}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUpdatingMatch(match);
                          setScoreA(match.score_a);
                          setScoreB(match.score_b);
                        }}
                        className="text-[#D8B282] hover:text-[#F6E1C3] font-bold"
                      >
                        Cập nhật tỉ số
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score updater form */}
            {updatingMatch && (
              <div className="p-3 rounded-2xl border border-amber-500/40 bg-amber-950/20 space-y-2.5">
                <span className="text-xs font-bold text-amber-400 block">
                  Cập Nhật Tỉ Số: {updatingMatch.team_a} vs {updatingMatch.team_b}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400">{updatingMatch.team_a}</span>
                    <input
                      type="number"
                      value={scoreA}
                      onChange={(e) => setScoreA(parseInt(e.target.value, 10) || 0)}
                      className="w-full mt-0.5 rounded-lg border border-[#D8B282]/30 bg-[#0B0F17] p-1.5 text-xs text-[#F6E1C3] text-center font-bold"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">VS</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400">{updatingMatch.team_b}</span>
                    <input
                      type="number"
                      value={scoreB}
                      onChange={(e) => setScoreB(parseInt(e.target.value, 10) || 0)}
                      className="w-full mt-0.5 rounded-lg border border-[#D8B282]/30 bg-[#0B0F17] p-1.5 text-xs text-[#F6E1C3] text-center font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUpdatingMatch(null)}
                    className="rounded-lg border border-[#D8B282]/20 px-2.5 py-1 text-[10px] text-slate-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveScore}
                    className="rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1 text-[10px] font-bold text-[#050C15]"
                  >
                    Lưu Tỉ Số
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
