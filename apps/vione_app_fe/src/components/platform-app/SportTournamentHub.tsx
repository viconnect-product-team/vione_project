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

export const SportTournamentHub: React.FC = () => {
  const [tournaments, setTournaments] = useState<SportTournament[]>([]);
  const [clubs, setClubs] = useState<SportClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState<SportTournament | null>(null);

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
      if (Array.isArray(tRes)) setTournaments(tRes);
      if (Array.isArray(cRes)) setClubs(cRes);
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
          status: "finished",
          winner: scoreA > scoreB ? updatingMatch.team_a_name : updatingMatch.team_b_name,
        }),
      });
      toast.success("Cập nhật tỷ số trận đấu thành công!");
      setUpdatingMatch(null);
      if (selectedTournament) {
        handleOpenDetail(selectedTournament);
      }
    } catch (err: any) {
      toast.error("Cập nhật tỷ số thất bại: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Thể Thao */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-r from-[#0B0F17] via-[#1A1824] to-[#0B0F17] p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Trophy className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Sport Platform • Điều Hành Giải Đấu Đa Môn & Mạng Lưới CLB</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F6E1C3] sm:text-3xl font-serif">
            Giải Đấu Đa Môn, Sơ Đồ Bảng Đấu Bracket & Hộ Chiếu VĐV Số
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Hệ sinh thái thể thao đa môn do ViConnect chủ quản: Pickleball thời thượng, Bóng đá, Golf, Tennis. Tự động sinh cây nhánh đấu Bracket 2 nhánh, cập nhật tỷ số trực tiếp và số hóa hồ sơ VĐV.
          </p>
        </div>
      </div>

      {/* Filter Bộ Môn */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
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
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSport === item.key
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold"
                : "border border-[#D8B282]/20 bg-[#0B0F17] text-muted-foreground hover:border-[#D8B282]/40 hover:text-[#F6E1C3]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Danh Sách Giải Đấu */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8B282]/30 bg-[#0B0F17]/60 p-8 text-center">
          <Trophy className="h-12 w-12 text-[#D8B282]/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F6E1C3]">Chưa có giải đấu nào</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tournaments.map((tour) => (
            <div
              key={tour.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-5 shadow-xl transition-all hover:border-[#D8B282]/60 hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={tour.banner_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"}
                    alt={tour.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3] uppercase">
                    Bộ môn: {tour.sport_type}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>{tour.status === "in_progress" ? "ĐANG THI ĐẤU" : "SẮP KHỞI TRANH"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#F6E1C3] group-hover:text-white transition-colors">
                    {tour.name}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#D8B282]" />
                      <span className="line-clamp-1">{tour.venue}, {tour.province}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#D8B282]" />
                      <span>{new Date(tour.start_date).toLocaleDateString("vi-VN")} - {new Date(tour.end_date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#D8B282]" />
                      <span>Quy mô: {tour.teams_count} đội tuyển tham dự</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8B282]/15 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#D8B282]">
                  Thể thức: {tour.format === "knockout" ? "Loại trực tiếp (Bracket)" : "Vòng bảng"}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenDetail(tour)}
                  className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Xem Bảng Đấu Bracket</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Sơ Đồ Nhánh Đấu Bracket Trực Quan */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-6 shadow-2xl space-y-6 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D8B282]">
                  Sơ Đồ Nhánh Đấu Bracket • {selectedTournament.sport_type.toUpperCase()}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-[#F6E1C3]">
                  {selectedTournament.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedTournament.venue}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTournament(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Trực Quan Hóa Cây Bracket */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F6E1C3] flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#D8B282]" />
                  <span>Diễn Biến Nhánh Đấu Loại Trực Tiếp (Bracket Tree)</span>
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold">
                  Live Score Realtime
                </span>
              </div>

              {/* Bảng trận đấu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedTournament.bracket_schema || []).map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#D8B282]/30 bg-[#121620] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#D8B282]">{b.round}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === "live"
                          ? "bg-red-500 text-white animate-pulse"
                          : b.status === "finished"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {b.status === "live" ? "ĐANG ĐẤU" : b.status === "finished" ? "KẾT THÚC" : "SẮP ĐẤU"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        b.winner === b.teamA ? "bg-[#D8B282]/15 border border-[#D8B282]/40 font-bold" : "bg-[#0B0F17]"
                      }`}>
                        <span className="text-xs text-[#F6E1C3]">{b.teamA}</span>
                        {b.winner === b.teamA && <CheckCircle className="h-4 w-4 text-[#D8B282]" />}
                      </div>

                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        b.winner === b.teamB ? "bg-[#D8B282]/15 border border-[#D8B282]/40 font-bold" : "bg-[#0B0F17]"
                      }`}>
                        <span className="text-xs text-[#F6E1C3]">{b.teamB}</span>
                        {b.winner === b.teamB && <CheckCircle className="h-4 w-4 text-[#D8B282]" />}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D8B282]/15 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground text-[11px]">Tỷ số set:</span>
                      <span className="font-mono font-bold text-[#D8B282]">{b.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh Sách CLB Thể Thao Tham Gia */}
            <div className="space-y-3 pt-4 border-t border-[#D8B282]/20">
              <h3 className="text-sm font-bold text-[#F6E1C3] flex items-center gap-2">
                <Users className="h-4 w-4 text-[#D8B282]" />
                <span>Mạng Lưới Câu Lạc Bộ Thể Thao ViConnect ({clubs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clubs.map((c) => (
                  <div key={c.id} className="rounded-xl border border-[#D8B282]/20 bg-[#121620] p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#F6E1C3]">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">Chủ nhiệm: {c.leader_name} • {c.members_count} VĐV</p>
                    </div>
                    <span className="rounded-md bg-[#D8B282]/15 px-2 py-0.5 text-[10px] font-bold text-[#F6E1C3] uppercase">
                      {c.sport_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
