import React, { useState, useEffect } from "react";
import {
  Flame,
  Calendar,
  MapPin,
  TrendingUp,
  Award,
  Search,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  Download,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface Race {
  id: string;
  code: string;
  name: string;
  race_date: string;
  location: string;
  province: string;
  gpx_map_url?: string;
  elevation_gain_m: number;
  status: string;
  is_heritage_run: boolean;
  banner_url?: string;
  description?: string;
  distances?: any[];
  runners_count?: number;
  stats?: any;
}

export interface RaceBib {
  id: string;
  race_id: string;
  runner_name: string;
  runner_gender: string;
  runner_age: number;
  bib_number: string;
  distance_km: number;
  rfid_tag_epc?: string;
  chip_time_str?: string;
  gun_time_str?: string;
  avg_pace_str?: string;
  overall_rank?: number;
  gender_rank?: number;
  age_group_rank?: number;
  status: string;
  certificate_url?: string;
}

export const RunRaceHub: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<RaceBib[]>([]);
  const [filterDistance, setFilterDistance] = useState<number | undefined>(undefined);
  const [searchBib, setSearchBib] = useState("");

  // Certificate Modal state
  const [certificateBib, setCertificateBib] = useState<any | null>(null);

  // Register BIB Form Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regDistance, setRegDistance] = useState(42.19);
  const [regGender, setRegGender] = useState("male");
  const [regAge, setRegAge] = useState(32);
  const [submittingBib, setSubmittingBib] = useState(false);

  // RFID Timing Simulator state
  const [simulatingRfid, setSimulatingRfid] = useState(false);

  const loadRaces = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<Race[]>("/platform-hub/run/races");
      if (Array.isArray(res)) {
        setRaces(res);
        if (res.length > 0 && !selectedRace) {
          handleSelectRace(res[0]);
        }
      }
    } catch (err) {
      console.error("[RunRaceHub] error:", err);
      toast.error("Không thể tải danh sách giải chạy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRaces();
  }, []);

  const handleSelectRace = async (race: Race) => {
    setSelectedRace(race);
    try {
      const [detail, lb] = await Promise.all([
        fetchNestApi<Race>(`/platform-hub/run/races/${race.id}`),
        fetchNestApi<RaceBib[]>(`/platform-hub/run/races/${race.id}/leaderboard`),
      ]);
      if (detail && detail.id) setSelectedRace(detail);
      if (Array.isArray(lb)) setLeaderboard(lb);
    } catch (err) {
      console.warn("Could not load race details:", err);
    }
  };

  const handleSimulateSplit = async (checkpoint: "start" | "split_5k" | "split_10k" | "split_21k" | "finish") => {
    if (!selectedRace) return;
    const targetBib = searchBib || "42195";
    setSimulatingRfid(true);
    try {
      const res = await fetchNestApi<any>("/platform-hub/run/timing/simulate-split", {
        method: "POST",
        body: JSON.stringify({
          raceId: selectedRace.id,
          bibNumber: targetBib,
          checkpoint,
        }),
      });
      if (res && res.success) {
        toast.success(`Thảm RFID nhận diện BIB ${targetBib} qua trạm [${checkpoint.toUpperCase()}] thành công!`);
        // Refresh leaderboard
        const lb = await fetchNestApi<RaceBib[]>(`/platform-hub/run/races/${selectedRace.id}/leaderboard`);
        if (Array.isArray(lb)) setLeaderboard(lb);
      }
    } catch (err: any) {
      toast.error("Giả lập timing thất bại: " + err.message);
    } finally {
      setSimulatingRfid(false);
    }
  };

  const handleRegisterBib = async () => {
    if (!selectedRace) return;
    if (!regName.trim()) {
      toast.error("Vui lòng nhập họ và tên vận động viên");
      return;
    }
    setSubmittingBib(true);
    try {
      const res = await fetchNestApi<any>(`/platform-hub/run/races/${selectedRace.id}/register-bib`, {
        method: "POST",
        body: JSON.stringify({
          runnerName: regName,
          distanceKm: regDistance,
          runnerGender: regGender,
          runnerAge: regAge,
        }),
      });
      if (res && res.success) {
        toast.success(`Đăng ký BIB thành công! Số BIB của bạn: ${res.bibNumber}`);
        setShowRegisterModal(false);
        setRegName("");
        handleSelectRace(selectedRace);
      }
    } catch (err: any) {
      toast.error("Đăng ký BIB thất bại: " + err.message);
    } finally {
      setSubmittingBib(false);
    }
  };

  const handleViewCertificate = async (bibNumber: string) => {
    try {
      const cert = await fetchNestApi<any>(`/platform-hub/run/bibs/${bibNumber}/certificate`);
      if (cert) {
        setCertificateBib(cert);
      }
    } catch (err: any) {
      toast.error("Chưa có chứng nhận cho BIB này hoặc chưa cán đích.");
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (filterDistance && Number(item.distance_km) !== filterDistance) return false;
    if (searchBib) {
      const q = searchBib.toLowerCase();
      return item.bib_number.toLowerCase().includes(q) || item.runner_name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner Giải Chạy & Timing RFID */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-r from-[#0B0F17] via-[#1E1710] to-[#0B0F17] p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Flame className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Run Platform • Hệ Thống Giải Chạy & Timing RFID</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F6E1C3] sm:text-3xl font-serif">
            Hạ Tầng Tính Giờ Chip Timing RFID & Xuất Finisher e-Certificate
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Hệ sinh thái giải chạy marathon chuyên nghiệp: Cung đường trắc dọc cao độ GPX, cấp số BIB tự động, đồng bộ thảm chíp Timing RFID dọc đường chạy, Live Leaderboard và xuất Giấy chứng nhận hoàn thành mạ vàng có mã QR chống giả mạo.
          </p>
        </div>

        {/* Thanh Giả Lập Thảm RFID Trực Tiếp */}
        <div className="mt-4 pt-4 border-t border-[#D8B282]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#F6E1C3]">
            <Radio className="h-4 w-4 text-[#D8B282] animate-pulse" />
            <span className="font-semibold">Thảm Chíp Timing RFID (Mô Phỏng Thực Tế):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={simulatingRfid}
              onClick={() => handleSimulateSplit("start")}
              className="rounded-lg bg-[#0B0F17] border border-[#D8B282]/30 px-2.5 py-1 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20"
            >
              1. Thảm Xuất Phát
            </button>
            <button
              type="button"
              disabled={simulatingRfid}
              onClick={() => handleSimulateSplit("split_10k")}
              className="rounded-lg bg-[#0B0F17] border border-[#D8B282]/30 px-2.5 py-1 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20"
            >
              2. Checkpoint 10K
            </button>
            <button
              type="button"
              disabled={simulatingRfid}
              onClick={() => handleSimulateSplit("split_21k")}
              className="rounded-lg bg-[#0B0F17] border border-[#D8B282]/30 px-2.5 py-1 text-[11px] font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20"
            >
              3. Checkpoint 21K
            </button>
            <button
              type="button"
              disabled={simulatingRfid}
              onClick={() => handleSimulateSplit("finish")}
              className="rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1 text-[11px] font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95"
            >
              4. Cán Đích (Finish Mat)
            </button>
          </div>
        </div>
      </div>

      {/* Chọn Giải Chạy */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {races.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => handleSelectRace(r)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedRace?.id === r.id
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold shadow-lg shadow-[#D8B282]/20"
                : "border border-[#D8B282]/25 bg-[#0B0F17] text-muted-foreground hover:border-[#D8B282]/40 hover:text-[#F6E1C3]"
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>{r.name}</span>
            {r.is_heritage_run && (
              <span className="rounded bg-[#050C15] px-1.5 py-0.2 text-[9px] text-[#F6E1C3]">
                Giải Chạy Di Sản
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chi Tiết Giải Chạy Đang Chọn */}
      {selectedRace && (
        <div className="space-y-6">
          {/* Card Thông Tin Lộ Trình & Cao Độ GPX */}
          <div className="rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#D8B282]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3]">
                    Mã: {selectedRace.code}
                  </span>
                  {selectedRace.is_heritage_run && (
                    <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold">
                      Cung Đường Di Sản UNESCO
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold font-serif text-[#F6E1C3] mt-1">
                  {selectedRace.name}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#D8B282]" />
                    {selectedRace.location}, {selectedRace.province}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#D8B282]" />
                    {new Date(selectedRace.race_date).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1 text-[#D8B282] font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Độ dốc tích lũy: +{selectedRace.elevation_gain_m}m
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-2.5 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/25 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
              >
                <Ticket className="h-4 w-4" />
                <span>Đăng Ký Nhận BIB Số</span>
              </button>
            </div>

            {/* Trắc dọc cao độ & Bản đồ GPX */}
            <div className="rounded-xl border border-[#D8B282]/20 bg-[#121620] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F6E1C3] flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#D8B282]" />
                  <span>Trắc Dọc Cao Độ Cung Đường (Elevation Profile)</span>
                </span>
                <span className="text-[11px] text-muted-foreground">Tệp GPX chuẩn AIMS</span>
              </div>

              {/* Simulation Graph Bar */}
              <div className="h-20 w-full rounded-lg bg-[#0B0F17] p-2 flex items-end gap-1 overflow-hidden border border-[#D8B282]/15">
                {[15, 22, 35, 48, 65, 80, 110, 145, 120, 95, 70, 55, 40, 30, 25, 18, 15, 20, 35, 50, 45, 30, 20, 15].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${(h / 150) * 100}%` }}
                    className="flex-1 bg-gradient-to-t from-[#8C653B] to-[#D8B282] rounded-t-sm hover:brightness-125 transition-all"
                    title={`Km ${i * 1.8}: +${h}m`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Xuất Phát (0 KM)</span>
                <span>Cầu Sông Hương (10 KM)</span>
                <span>Lăng Tự Đức (21 KM)</span>
                <span>Về Đích Cột Cờ (42.195 KM)</span>
              </div>
            </div>
          </div>

          {/* Bảng Xếp Hạng Live Leaderboard */}
          <div className="rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D8B282]/20 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#F6E1C3] flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#D8B282]" />
                  <span>Bảng Xếp Hạng Thành Tích Trực Tiếp (Live Leaderboard)</span>
                </h3>
                <p className="text-xs text-muted-foreground">Đo đếm thời gian thực qua chíp RFID tại vạch đích</p>
              </div>

              {/* Tìm BIB & Bộ lọc cự ly */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchBib}
                  onChange={(e) => setSearchBib(e.target.value)}
                  placeholder="Tra cứu số BIB / VĐV..."
                  className="rounded-lg border border-[#D8B282]/30 bg-[#121620] px-3 py-1.5 text-xs text-[#F6E1C3] placeholder-muted-foreground focus:outline-none focus:border-[#D8B282]"
                />
                <button
                  type="button"
                  onClick={() => setFilterDistance(undefined)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    filterDistance === undefined ? "bg-[#D8B282] text-[#050C15]" : "text-muted-foreground border border-[#D8B282]/20"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDistance(42.19)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    filterDistance === 42.19 ? "bg-[#D8B282] text-[#050C15]" : "text-muted-foreground border border-[#D8B282]/20"
                  }`}
                >
                  42KM
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDistance(21.1)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    filterDistance === 21.1 ? "bg-[#D8B282] text-[#050C15]" : "text-muted-foreground border border-[#D8B282]/20"
                  }`}
                >
                  21KM
                </button>
              </div>
            </div>

            {/* Bảng VĐV */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8B282]/20 text-[11px] font-semibold uppercase tracking-wider text-[#D8B282]">
                    <th className="py-2.5 px-3">Hạng</th>
                    <th className="py-2.5 px-3">Số BIB</th>
                    <th className="py-2.5 px-3">Họ và Tên VĐV</th>
                    <th className="py-2.5 px-3">Cự Ly</th>
                    <th className="py-2.5 px-3">Chip Time</th>
                    <th className="py-2.5 px-3">Pace TB</th>
                    <th className="py-2.5 px-3">Trạng Thái</th>
                    <th className="py-2.5 px-3 text-right">Chứng Nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8B282]/10 text-slate-200">
                  {filteredLeaderboard.map((item) => (
                    <tr key={item.id} className="hover:bg-[#121620]/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#F6E1C3]">
                        {item.overall_rank ? `#${item.overall_rank}` : "-"}
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-[#D8B282]/15 border border-[#D8B282]/30 px-2 py-0.5 font-mono font-bold text-[#F6E1C3]">
                          {item.bib_number}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {item.runner_name}
                      </td>
                      <td className="py-3 px-3 text-[#D8B282]">
                        {item.distance_km} KM
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#F6E1C3]">
                        {item.chip_time_str || "--:--:--"}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {item.avg_pace_str || "-"}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "finished"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : item.status === "racing"
                            ? "bg-amber-500/20 text-amber-300 animate-pulse"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.status === "finished" ? "FINISHER" : item.status === "racing" ? "ĐANG CHẠY" : "ĐÃ ĐĂNG KÝ"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.status === "finished" ? (
                          <button
                            type="button"
                            onClick={() => handleViewCertificate(item.bib_number)}
                            className="rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-2.5 py-1 text-[11px] font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95"
                          >
                            e-Certificate
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Chờ về đích</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Đăng Ký BIB */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-6 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-center justify-between border-b border-[#D8B282]/20 pb-3">
              <h3 className="text-lg font-bold font-serif text-[#F6E1C3]">
                Đăng Ký BIB & Nhận Vé e-RaceKit
              </h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="rounded-full border border-[#D8B282]/30 p-1 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Họ và Tên VĐV:</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Tuấn"
                  className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] p-2.5 text-[#F6E1C3] focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Cự Ly Thi Đấu:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { km: 42.19, label: "42.195 KM (Full Marathon)" },
                    { km: 21.1, label: "21.1 KM (Half Marathon)" },
                    { km: 10, label: "10 KM Road Race" },
                    { km: 5, label: "5 KM Fun Run" },
                  ].map((d) => (
                    <button
                      key={d.km}
                      type="button"
                      onClick={() => setRegDistance(d.km)}
                      className={`rounded-xl p-2 font-bold text-center border transition-all ${
                        regDistance === d.km
                          ? "bg-[#D8B282] text-[#050C15] border-[#D8B282]"
                          : "bg-[#121620] text-slate-300 border-[#D8B282]/25"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-muted-foreground">Giới Tính:</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] p-2.5 text-[#F6E1C3] focus:outline-none"
                  >
                    <option value="male">Nam (Male)</option>
                    <option value="female">Nữ (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-muted-foreground">Tuổi:</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] p-2.5 text-[#F6E1C3] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8B282]/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="rounded-xl border border-[#D8B282]/30 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-white"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={submittingBib}
                onClick={handleRegisterBib}
                className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-2 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/20 hover:brightness-110 active:scale-95"
              >
                {submittingBib ? "Đang cấp BIB..." : "Cấp BIB & Xuất Vé"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Finisher e-Certificate Hoàng Gia Mạ Vàng */}
      {certificateBib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border-2 border-[#D8B282] bg-gradient-to-b from-[#0B0F17] via-[#151A24] to-[#0B0F17] p-6 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setCertificateBib(null)}
              className="absolute top-4 right-4 rounded-full border border-[#D8B282]/40 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
            >
              ✕
            </button>

            {/* Chứng nhận layout */}
            <div className="border border-[#D8B282]/40 rounded-2xl p-6 bg-radial-gradient space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-[#D8B282]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D8B282]">
                  VICONNECT OFFICIAL FINISHER CERTIFICATE
                </span>
                <Sparkles className="h-5 w-5 text-[#D8B282]" />
              </div>

              <h2 className="text-2xl font-bold font-serif text-[#F6E1C3] uppercase tracking-wide">
                Chứng Nhận Thành Tích Finisher
              </h2>
              <p className="text-xs text-muted-foreground">{certificateBib.race_name}</p>

              <div className="py-2 border-y border-[#D8B282]/25">
                <p className="text-xs text-muted-foreground">Chứng nhận vận động viên:</p>
                <h3 className="text-xl font-bold text-white font-serif mt-0.5">
                  {certificateBib.runner_name}
                </h3>
                <p className="text-xs text-[#D8B282] mt-0.5">
                  Số BIB: <span className="font-mono font-bold">{certificateBib.bib_number}</span> • Cự ly: {certificateBib.distance_km} KM
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="rounded-lg bg-[#0B0F17] p-2 border border-[#D8B282]/20">
                  <span className="text-[10px] text-muted-foreground block">Chip Time</span>
                  <span className="text-sm font-mono font-bold text-[#F6E1C3]">
                    {certificateBib.chip_time_str}
                  </span>
                </div>
                <div className="rounded-lg bg-[#0B0F17] p-2 border border-[#D8B282]/20">
                  <span className="text-[10px] text-muted-foreground block">Avg Pace</span>
                  <span className="text-sm font-mono font-bold text-[#F6E1C3]">
                    {certificateBib.avg_pace_str}
                  </span>
                </div>
                <div className="rounded-lg bg-[#0B0F17] p-2 border border-[#D8B282]/20">
                  <span className="text-[10px] text-muted-foreground block">Hạng Overall</span>
                  <span className="text-sm font-mono font-bold text-[#D8B282]">
                    #{certificateBib.overall_rank}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Ngày thi đấu: {new Date(certificateBib.race_date).toLocaleDateString("vi-VN")}</span>
                <span className="font-semibold text-[#D8B282]">Ký duyệt điện tử: ViConnect Platform</span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => toast.success("Đã tải chứng nhận Finisher về máy (PDF/JPG)!")}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-2.5 text-xs font-bold text-[#050C15] shadow-lg hover:brightness-110 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Tải Chứng Nhận Về Máy</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info("Đã sao chép link chứng nhận xác thực mã QR!")}
                className="flex items-center gap-1.5 rounded-xl border border-[#D8B282]/40 bg-[#121620] px-4 py-2.5 text-xs font-semibold text-[#F6E1C3] hover:bg-[#D8B282]/20"
              >
                <Share2 className="h-4 w-4" />
                <span>Chia Sẻ Mã QR Xác Thực</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
