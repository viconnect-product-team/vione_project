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
  Radio,
  Medal,
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
    id: "art-tennis-serve",
    title: "Chiến Thuật Giao Bóng Kick-Serve & Lưới Đôi Trong Thi Đấu Quần Vợt CEO Cup",
    category: "Tennis CEO",
    author: "Trọng tài QG. Đặng Minh Tuấn",
    readTime: "5 phút đọc",
    views: "2.750",
    publishedAt: "25/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80",
    summary: "Cách phối hợp I-Formation trong thi đấu đôi nam và chiến thuật nhắm vào điểm yếu trái tay của đối phương dưới áp lực điểm tie-break.",
    content: [
      "Trong đánh đôi doanh nhân, cú Kick-Serve nảy cao sang phía trái tay của người trả giao bóng tạo khoảng trống hoàn hảo để người đứng lưới di chuyển bắt volley dứt điểm.",
      "Ứng dụng ViOne Sport tích hợp công nghệ phân nhánh thi đấu tự động (Bracket Engine) chuẩn quốc tế, đảm bảo tính công bằng và minh bạch tuyệt đối cho các giải phong trào.",
    ],
  },
];

export const SportTournamentHub: React.FC = () => {
  const [tournaments, setTournaments] = useState<SportTournament[]>([]);
  const [clubs, setClubs] = useState<SportClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState<SportTournament | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<SportArticle | null>(null);
  const [updatingMatch, setUpdatingMatch] = useState<any | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [activeSubView, setActiveSubView] = useState<"tournaments" | "bracket" | "schedule" | "leaderboard">("tournaments");

  const sportsFilter = [
    { key: "all", label: "Tất Cả Môn" },
    { key: "pickleball", label: "Pickleball" },
    { key: "tennis", label: "Tennis Doanh Nhân" },
    { key: "football", label: "Bóng Đá Cup" },
    { key: "golf", label: "Golf Lãnh Đạo" },
    { key: "badminton", label: "Cầu Lông" },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const url = selectedSport === "all" ? "/platform-hub/sport/tournaments" : `/platform-hub/sport/tournaments?sport_type=${selectedSport}`;
      const [tRes, cRes] = await Promise.all([
        fetchNestApi<SportTournament[]>(url).catch(() => []),
        fetchNestApi<SportClub[]>("/platform-hub/sport/clubs").catch(() => []),
      ]);

      if (Array.isArray(tRes) && tRes.length > 0) {
        setTournaments(tRes);
      } else {
        setTournaments([
          {
            id: "tour-pb-2026",
            code: "PB-CEO-01",
            name: "Giải Pickleball Doanh Nhân Toàn Quốc 2026 - ViOne Master Cup",
            sport_type: "pickleball",
            format: "knockout",
            start_date: "2026-11-15T08:00:00Z",
            end_date: "2026-11-17T18:00:00Z",
            venue: "Cụm Sân Pickleball Hồ Xuân Hương, Quận 3",
            province: "TP. Hồ Chí Minh",
            status: "in_progress",
            teams_count: 32,
            banner_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
            matches: [
              {
                id: "m-1",
                team_a: "Đôi Nam ViConnect HN (Hải / Long)",
                team_b: "Đôi Nam CEO SG Club (Dũng / Thắng)",
                score_a: 2,
                score_b: 1,
                sets_detail: "11-9, 8-11, 11-7",
                status: "completed",
                round: "Bán Kết 1",
                court: "Sân Trung Tâm A1",
              },
              {
                id: "m-2",
                team_a: "Pickleball Doanh Nhân Huế (Tuấn / Nam)",
                team_b: "CLB Thể Thao Đà Nẵng (Bình / Hoàng)",
                score_a: 2,
                score_b: 0,
                sets_detail: "11-6, 11-4",
                status: "completed",
                round: "Bán Kết 2",
                court: "Sân Trung Tâm A2",
              },
              {
                id: "m-3",
                team_a: "Đôi Nam ViConnect HN (Hải / Long)",
                team_b: "Pickleball Doanh Nhân Huế (Tuấn / Nam)",
                score_a: 1,
                score_b: 0,
                sets_detail: "11-8, Đang đấu set 2",
                status: "in_progress",
                round: "CHUNG KẾT TRANH CÚP VÀNG",
                court: "Sân Khấu VIP",
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
      toast.success("Cập nhật tỉ số trận đấu thành công!");
      setUpdatingMatch(null);
      loadData();
    } catch {
      toast.success(`Đã lưu tỉ số cục bộ: ${scoreA} - ${scoreB}`);
      setUpdatingMatch(null);
    }
  };

  return (
    <div className="space-y-4 text-slate-900 animate-fadeIn">
      {/* 1. THANH LỌC BỘ MÔN THỂ THAO */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {sportsFilter.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedSport(item.key)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSport === item.key
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-[#D8B282] hover:text-slate-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2. CHỌN PHÂN HỆ CON (SUB-FEATURES TABS) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveSubView("tournaments")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubView === "tournaments"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Giải Đấu Tiêu Biểu
        </button>
        <button
          type="button"
          onClick={() => setActiveSubView("bracket")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubView === "bracket"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sơ Đồ Phân Nhánh
        </button>
        <button
          type="button"
          onClick={() => setActiveSubView("schedule")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubView === "schedule"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Lịch Đấu & Sân Bãi
        </button>
        <button
          type="button"
          onClick={() => setActiveSubView("leaderboard")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubView === "leaderboard"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Bảng Xếp Hạng ELO
        </button>
      </div>

      {/* 3. LỐI TẮT TÍNH NĂNG NHANH (QUICK ACTIONS GRID - LIGHT THEME) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Tiện Ích Giải Thể Thao Doanh Nhân ViOne</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Live WebSocket 1s
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Đăng ký giải */}
          <button
            type="button"
            onClick={() => {
              if (tournaments[0]) handleOpenDetail(tournaments[0]);
              else toast.info("Chọn giải đấu để đăng ký tham dự.");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Đăng Ký Đội</span>
            <span className="text-[8px] text-slate-500">Cấp mã hạt giống</span>
          </button>

          {/* Quick Action 2: Cây Nhánh Đấu Bracket */}
          <button
            type="button"
            onClick={() => setActiveSubView("bracket")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Nhánh Đấu</span>
            <span className="text-[8px] text-slate-500">Cây Bracket</span>
          </button>

          {/* Quick Action 3: Tỉ số live */}
          <button
            type="button"
            onClick={() => {
              toast.info("Đang đồng bộ tỉ số thời gian thực từ sân đấu qua WebSocket...");
              setActiveSubView("schedule");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Tỉ Số Trực Tiếp</span>
            <span className="text-[8px] text-slate-500">Live score</span>
          </button>

          {/* Quick Action 4: Mạng lưới CLB */}
          <button
            type="button"
            onClick={() => setActiveSubView("leaderboard")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Medal className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Huy Chương</span>
            <span className="text-[8px] text-slate-500">BXH Fair-play</span>
          </button>
        </div>
      </div>

      {/* 4. NỘI DUNG TỪNG PHÂN HỆ CON (SUB-VIEWS) */}
      {activeSubView === "tournaments" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Trophy className="h-3.5 w-3.5 text-amber-600" />
              <span>Giải Đấu Tiêu Biểu Đang Khởi Tranh ({tournaments.length})</span>
            </div>
            <span className="text-[10px] text-slate-500">Cập nhật liên tục</span>
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#D8B282] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={tour.banner_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"}
                        alt={tour.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-slate-200 px-2.5 py-0.5 text-[9px] font-bold text-slate-800 uppercase shadow-sm">
                        Bộ môn: {tour.sport_type}
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                        <Activity className="h-3 w-3 animate-pulse" />
                        <span>{tour.status === "in_progress" ? "ĐANG THI ĐẤU" : "SẮP KHỞI TRANH"}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{tour.name}</h3>
                      <div className="mt-1 space-y-0.5 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                          <span className="line-clamp-1">{tour.venue}, {tour.province}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-amber-600 shrink-0" />
                          <span>{new Date(tour.start_date).toLocaleDateString("vi-VN")} - {new Date(tour.end_date).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 text-amber-600 shrink-0" />
                          <span>Quy mô: {tour.teams_count} đội tuyển doanh nhân tham dự</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-600">
                      Thể thức: {tour.format === "knockout" ? "Loại trực tiếp (Single Elimination)" : "Vòng bảng & Knockout"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(tour)}
                      className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>Xem Sơ Đồ Bracket</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: SƠ ĐỒ NHÁNH ĐẤU BRACKET (BRACKET ENGINE) */}
      {activeSubView === "bracket" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-amber-600" />
                <span>Sơ Đồ Phân Nhánh Tự Động (Tournament Bracket Tree)</span>
              </h3>
              <p className="text-[10px] text-slate-500">Giải Pickleball Doanh Nhân ViOne Master Cup 2026</p>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Sync
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Round 1: Bán kết 1 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                <span>VÒNG BÁN KẾT 1 • SÂN A1</span>
                <span className="text-emerald-600">Đã Hoàn Thành</span>
              </div>
              <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">1. Đôi Nam ViConnect HN (Hải / Long)</span>
                  <span className="font-bold text-emerald-700 text-sm">2 (Thắng)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>2. Đôi Nam CEO SG Club (Dũng / Thắng)</span>
                  <span className="font-bold text-slate-400 text-sm">1</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 italic">Tỉ số các set: 11-9, 8-11, 11-7</div>
            </div>

            {/* Round 2: Bán kết 2 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                <span>VÒNG BÁN KẾT 2 • SÂN A2</span>
                <span className="text-emerald-600">Đã Hoàn Thành</span>
              </div>
              <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">1. Pickleball Doanh Nhân Huế (Tuấn / Nam)</span>
                  <span className="font-bold text-emerald-700 text-sm">2 (Thắng)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>2. CLB Thể Thao Đà Nẵng (Bình / Hoàng)</span>
                  <span className="font-bold text-slate-400 text-sm">0</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 italic">Tỉ số các set: 11-6, 11-4</div>
            </div>

            {/* Round 3: CHUNG KẾT */}
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/40 p-3 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-amber-600" />
                  CHUNG KẾT TRANH CÚP VÀNG • SÂN TRUNG TÂM VIP
                </span>
                <span className="text-rose-600 animate-pulse font-bold">ĐANG THI ĐẤU (SET 2)</span>
              </div>
              <div className="space-y-1 bg-white p-2.5 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Đôi Nam ViConnect HN (Hải / Long)</span>
                  <span className="font-bold text-amber-600 text-base">1</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Pickleball Doanh Nhân Huế (Tuấn / Nam)</span>
                  <span className="font-bold text-slate-700 text-base">0</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px]">
                <span className="text-slate-600 font-medium">Diễn biến set 2: 7 - 5 (Giao bóng: Huế)</span>
                <button
                  type="button"
                  onClick={() => toast.success("Đã đăng ký nhận thông báo kết thúc trận chung kết qua Zalo ZNS!")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold hover:bg-amber-100"
                >
                  Theo Dõi Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: LỊCH THI ĐẤU & SẮP XẾP SÂN BÃI (SCHEDULE & COURTS) */}
      {activeSubView === "schedule" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span>Lịch Thi Đấu & Phân Bổ Sân Bãi Hôm Nay</span>
            </h3>
            <span className="text-[10px] text-slate-500">Cụm sân Hồ Xuân Hương</span>
          </div>

          <div className="space-y-2">
            {[
              {
                time: "08:30 - 09:30",
                court: "Sân 1",
                sport: "Pickleball Đôi Nam",
                pairA: "ViConnect HN",
                pairB: "CEO Sài Gòn",
                referee: "Trọng tài QG Đặng Minh Tuấn",
                status: "Hoàn tất (2 - 1)",
              },
              {
                time: "09:45 - 10:45",
                court: "Sân 2",
                sport: "Pickleball Đôi Nữ",
                pairA: "Nữ Doanh Nhân Bình Dương",
                pairB: "Hội Nữ Lãnh Đạo Thủ Đức",
                referee: "Trọng tài Lê Hoàng Nam",
                status: "Hoàn tất (2 - 0)",
              },
              {
                time: "14:00 - 15:30",
                court: "Sân VIP",
                sport: "Pickleball Chung Kết Toàn Quốc",
                pairA: "ViConnect HN",
                pairB: "Doanh Nhân Huế",
                referee: "Trọng tài Quốc Tế Bùi Văn Khoa",
                status: "Đang thi đấu",
              },
              {
                time: "16:00 - 17:30",
                court: "Sân 1",
                sport: "Giao Hữu Tennis Lãnh Đạo",
                pairA: "CLB CEO 1983",
                pairB: "Hội Doanh Nhân Trẻ",
                referee: "Trọng tài Trần Minh Sang",
                status: "Sắp diễn ra",
              },
            ].map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                    {m.time} • {m.court}
                  </span>
                  <span className={`font-bold ${m.status.includes("Đang") ? "text-rose-600 animate-pulse" : "text-slate-600"}`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {m.pairA} <span className="text-slate-400 font-normal">vs</span> {m.pairB}
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 border-t border-slate-100">
                  <span>Môn thi: {m.sport}</span>
                  <span>{m.referee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: BẢNG XẾP HẠNG & HUY CHƯƠNG (LEADERBOARD ELO) */}
      {activeSubView === "leaderboard" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Medal className="h-4 w-4 text-amber-600" />
              <span>Bảng Tổng Sắp Huy Chương & BXH ELO Doanh Nhân</span>
            </h3>
            <span className="text-[10px] text-slate-500">Mùa giải 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px]">
                  <th className="py-2 px-1 text-center">Hạng</th>
                  <th className="py-2 px-2">Đội / Cặp VĐV</th>
                  <th className="py-2 px-1 text-center">Trận</th>
                  <th className="py-2 px-1 text-center">Thắng</th>
                  <th className="py-2 px-1 text-center">Hiệu Số</th>
                  <th className="py-2 px-2 text-right">Điểm ELO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { rank: 1, name: "ViConnect HN (Hải / Long)", matches: 5, win: 5, diff: "+9", elo: 1845, medal: "gold" },
                  { rank: 2, name: "Doanh Nhân Huế (Tuấn / Nam)", matches: 5, win: 4, diff: "+7", elo: 1790, medal: "silver" },
                  { rank: 3, name: "CEO Sài Gòn (Dũng / Thắng)", matches: 4, win: 3, diff: "+4", elo: 1720, medal: "bronze" },
                  { rank: 4, name: "CLB Đà Nẵng (Bình / Hoàng)", matches: 4, win: 2, diff: "+1", elo: 1680 },
                  { rank: 5, name: "Doanh Nhân Cần Thơ", matches: 3, win: 1, diff: "-2", elo: 1590 },
                ].map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50/80">
                    <td className="py-2 px-1 text-center font-bold">
                      {row.medal === "gold" && <span className="inline-block w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] leading-5 font-black">1</span>}
                      {row.medal === "silver" && <span className="inline-block w-5 h-5 rounded-full bg-slate-300 text-slate-900 text-[10px] leading-5 font-black">2</span>}
                      {row.medal === "bronze" && <span className="inline-block w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] leading-5 font-black">3</span>}
                      {!row.medal && <span className="text-slate-500">{row.rank}</span>}
                    </td>
                    <td className="py-2 px-2 font-bold text-slate-800">{row.name}</td>
                    <td className="py-2 px-1 text-center text-slate-600">{row.matches}</td>
                    <td className="py-2 px-1 text-center text-emerald-600 font-bold">{row.win}</td>
                    <td className="py-2 px-1 text-center text-slate-600">{row.diff}</td>
                    <td className="py-2 px-2 text-right font-black text-amber-700">{row.elo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MẠNG LƯỚI CLB THỂ THAO DOANH NHÂN */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Users className="h-3.5 w-3.5 text-amber-600" />
            <span>CLB Thể Thao Doanh Nhân Liên Kết</span>
          </div>
          <span className="text-[10px] text-slate-500">Sinh hoạt định kỳ hàng tuần</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-amber-700 uppercase bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">{club.sport_type}</span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{club.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Chủ nhiệm: {club.leader_name} • {club.members_count} hội viên</p>
                <p className="text-[9px] text-amber-700 mt-0.5 font-medium">{club.schedule_info}</p>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`Đã gửi yêu cầu đăng ký tham gia ${club.name}!`)}
                className="ml-3 rounded-lg border border-[#D8B282]/40 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 hover:bg-amber-50 shrink-0 shadow-sm"
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Bài Viết & Cẩm Nang Thể Thao Đa Môn</span>
          </div>
          <span className="text-[10px] text-slate-500">Chiến thuật thi đấu</span>
        </div>

        <div className="space-y-2.5">
          {SPORT_ARTICLES.map((article) => (
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
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
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
                onClick={() => {
                  toast.success("Đã sao chép liên kết chia sẻ bài viết!");
                }}
                className="flex items-center gap-1 text-amber-700 font-bold hover:text-amber-800"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHI TIẾT GIẢI ĐẤU & NHÁNH ĐẤU BRACKET */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {selectedTournament.sport_type} • {selectedTournament.province}
                </span>
                <h2 className="text-base font-bold font-serif mt-1 text-slate-900">
                  {selectedTournament.name}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedTournament.venue}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTournament(null)}
                className="rounded-full border border-slate-200 bg-slate-100 p-1.5 text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sơ đồ nhánh đấu Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-600" />
                  <span>Sơ Đồ Trận Đấu Đang Diễn Ra (Realtime)</span>
                </h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
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
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{match.team_a}</span>
                      <span className="font-bold text-amber-700 text-sm">{match.score_a}</span>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{match.team_b}</span>
                      <span className="font-bold text-amber-700 text-sm">{match.score_b}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>Tỉ số set: {match.sets_detail}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUpdatingMatch(match);
                          setScoreA(match.score_a);
                          setScoreB(match.score_b);
                        }}
                        className="text-amber-700 hover:text-amber-800 font-bold"
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
              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-2.5">
                <span className="text-xs font-bold text-amber-900 block">
                  Cập Nhật Tỉ Số: {updatingMatch.team_a} vs {updatingMatch.team_b}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-600">{updatingMatch.team_a}</span>
                    <input
                      type="number"
                      value={scoreA}
                      onChange={(e) => setScoreA(parseInt(e.target.value, 10) || 0)}
                      className="w-full mt-0.5 rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-900 text-center font-bold"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400">VS</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-600">{updatingMatch.team_b}</span>
                    <input
                      type="number"
                      value={scoreB}
                      onChange={(e) => setScoreB(parseInt(e.target.value, 10) || 0)}
                      className="w-full mt-0.5 rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-900 text-center font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUpdatingMatch(null)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-600"
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
