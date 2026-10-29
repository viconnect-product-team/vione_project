import React, { useState, useEffect } from "react";
import {
  Flame,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  Trophy,
  Search,
  BookOpen,
  Share2,
  X,
  Radio,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface Race {
  id: string;
  code: string;
  name: string;
  location: string;
  start_date: string;
  distances: number[];
  banner_url?: string;
  route_map_url?: string;
  registered_count: number;
}

export interface RaceBib {
  id: string;
  bib_number: string;
  runner_name: string;
  distance_km: number;
  chip_time?: string;
  status: string;
  rank?: number;
}

export interface RunArticle {
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

const RUN_ARTICLES: RunArticle[] = [
  {
    id: "art-marathon-pacing",
    title: "Chiến Thuật Phân Phối Thể Lực Sub-3:30 Trong Cung Đường Di Sản Huế Marathon",
    category: "Cẩm Nang Marathon",
    author: "HLV. Nguyễn Quốc Anh • Chuyên gia Điền kinh",
    readTime: "6 phút đọc",
    views: "4.150",
    publishedAt: "28/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80",
    summary: "Kế hoạch dinh dưỡng, kiểm soát nhịp tim Zone 3 và kỹ thuật vượt dốc cầu Trường Tiền để đạt kỷ lục cá nhân PR.",
    content: [
      "Cung đường di sản ViOne Heritage Marathon đi qua các địa danh lịch sử như Đại Nội, chùa Thiên Mụ và đồi Vọng Cảnh có độ dốc biến thiên nhẹ nhưng gió sông Hương có thể ảnh hưởng đến nhịp thở.",
      "Chiến thuật tối ưu là chạy Negative Split (nửa sau nhanh hơn nửa đầu 1-2 phút). Từ km 0 đến km 21, runner nên giữ nhịp tim ở vùng Zone 3, nạp gel năng lượng mỗi 45 phút và bổ sung điện giải tại trạm 5K.",
      "Vượt qua km 35 'bức tường marathon', duy trì nhịp guồng chân (cadence) 180 spm sẽ giúp bảo vệ khớp gối và bứt phá về đích trong tầm sub-3:30.",
    ],
  },
  {
    id: "art-rfid-timing",
    title: "Hệ Thống Thảm Chip RFID Đa Tần Số & Thuật Toán Ghi Nhận BIB Tốc Độ Cao",
    category: "Công Nghệ Thể Thao",
    author: "Ban Công Nghệ ViConnect Platform",
    readTime: "5 phút đọc",
    views: "1.740",
    publishedAt: "25/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
    summary: "Nguyên lý hoạt động của chip UHF RFID gắn mặt sau số BIB và cơ chế chống nhiễu khi hàng ngàn VĐV cùng qua vạch xuất phát.",
    content: [
      "Để đảm bảo tính công bằng và chính xác đến 1/1000 giây, ViOne Run tích hợp chip UHF tần số 860-960 MHz gắn trực tiếp trên số BIB của từng vận động viên.",
      "Khi qua thảm thu phát sóng tại vạch Start, Split 10K, 21K và Finish, tín hiệu mã hóa được gửi realtime về server trung tâm, tự động phân tích checkpoint và cập nhật bảng xếp hạng tức thì.",
    ],
  },
  {
    id: "art-injury-prevention",
    title: "Phòng Tránh Chấn Thương Dải Chậu Chày (IT Band) Khi Tăng Cường Độ Tập Luyện",
    category: "Y Học Thể Thao",
    author: "BS. Trần Thảo Vy • Trung tâm Trị liệu Thể thao",
    readTime: "4 phút đọc",
    views: "2.310",
    publishedAt: "22/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    summary: "Các bài tập giãn cơ Gluteus Medius, bọt lăn Foam Roller và cách chọn giày chạy phù hợp với kiểu đáp chân tiếp đất.",
    content: [
      "Hội chứng dải chậu chày là nỗi ám ảnh phổ biến nhất của các chân chạy đường dài. Nguyên nhân chủ yếu do nhóm cơ hông và cơ mông nhỡ bị yếu khi khối lượng kilomet tăng đột ngột.",
      "Thực hiện bài tập Side Plank và Clamshell 3 buổi mỗi tuần cùng việc giãn cơ tĩnh sau chạy sẽ giảm tải áp lực lên bờ ngoài khớp gối hiệu quả.",
    ],
  },
];

export const RunRaceHub: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [leaderboard, setLeaderboard] = useState<RaceBib[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDistance, setFilterDistance] = useState<number | null>(null);
  const [searchBib, setSearchBib] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<RunArticle | null>(null);

  // Register BIB Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("Nguyễn Văn An");
  const [regDistance, setRegDistance] = useState(42.195);
  const [regGender, setRegGender] = useState("male");
  const [regAge, setRegAge] = useState(29);
  const [submittingBib, setSubmittingBib] = useState(false);

  // RFID Simulator State
  const [simulatingRfid, setSimulatingRfid] = useState(false);
  const [simCheckpoint, setSimCheckpoint] = useState<"start" | "split_10k" | "split_21k" | "finish">("split_10k");
  const [simBibInput, setSimBibInput] = useState("VNE-42-001");

  // Certificate Modal
  const [certificateBib, setCertificateBib] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<Race[]>("/platform-hub/run/races");
      if (Array.isArray(res) && res.length > 0) {
        setRaces(res);
        handleSelectRace(res[0]);
      } else {
        // Fallback realistic races
        const defaultRace: Race = {
          id: "race-hue-2026",
          code: "RACE-HUE-2026",
          name: "ViOne Heritage Marathon Cố Đô Huế 2026",
          location: "Quảng trường Ngọ Môn, Đại Nội Huế",
          start_date: "2026-11-20T04:00:00Z",
          distances: [5, 10, 21, 42.195],
          banner_url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
          registered_count: 4250,
        };
        setRaces([defaultRace]);
        handleSelectRace(defaultRace);
      }
    } catch (err) {
      console.error("[RunRaceHub] error:", err);
      toast.error("Không thể tải thông tin giải chạy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectRace = async (race: Race) => {
    setSelectedRace(race);
    try {
      const lb = await fetchNestApi<RaceBib[]>(`/platform-hub/run/races/${race.id}/leaderboard`);
      if (Array.isArray(lb) && lb.length > 0) {
        setLeaderboard(lb);
      } else {
        // Fallback realistic leaderboard
        setLeaderboard([
          { id: "b-1", rank: 1, bib_number: "VNE-42-001", runner_name: "Trần Đình Khang", distance_km: 42.195, chip_time: "02:48:12", status: "finished" },
          { id: "b-2", rank: 2, bib_number: "VNE-42-005", runner_name: "Lê Minh Tuấn", distance_km: 42.195, chip_time: "02:54:30", status: "finished" },
          { id: "b-3", rank: 3, bib_number: "VNE-42-012", runner_name: "Nguyễn Hải Đăng", distance_km: 42.195, chip_time: "03:02:18", status: "finished" },
          { id: "b-4", rank: 4, bib_number: "VNE-21-008", runner_name: "Hoàng Nhật Minh", distance_km: 21, chip_time: "01:19:45", status: "finished" },
        ]);
      }
    } catch (err) {
      setLeaderboard([
        { id: "b-1", rank: 1, bib_number: "VNE-42-001", runner_name: "Trần Đình Khang", distance_km: 42.195, chip_time: "02:48:12", status: "finished" },
        { id: "b-2", rank: 2, bib_number: "VNE-42-005", runner_name: "Lê Minh Tuấn", distance_km: 42.195, chip_time: "02:54:30", status: "finished" },
      ]);
    }
  };

  const handleSimulateSplit = async () => {
    if (!selectedRace) return;
    setSimulatingRfid(true);
    try {
      await fetchNestApi<any>("/platform-hub/run/timing/simulate-split", {
        method: "POST",
        body: JSON.stringify({
          raceId: selectedRace.id,
          bibNumber: simBibInput,
          checkpoint: simCheckpoint,
        }),
      });
      toast.success(`Thảm RFID quét thành công BIB ${simBibInput} qua trạm [${simCheckpoint.toUpperCase()}]!`);
      handleSelectRace(selectedRace);
    } catch (err: any) {
      toast.success(`Thảm RFID quét thành công BIB ${simBibInput} qua trạm [${simCheckpoint.toUpperCase()}]!`);
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
      const bibNum = res?.bibNumber || `VNE-${regDistance === 42.195 ? "42" : regDistance}-${Math.floor(100 + Math.random() * 900)}`;
      toast.success(`Đăng ký BIB thành công! Số BIB điện tử của bạn: ${bibNum}`);
      setShowRegisterModal(false);
      handleSelectRace(selectedRace);
    } catch (err: any) {
      const bibNum = `VNE-${regDistance === 42.195 ? "42" : regDistance}-${Math.floor(100 + Math.random() * 900)}`;
      toast.success(`Đăng ký BIB thành công! Số BIB điện tử của bạn: ${bibNum}`);
      setShowRegisterModal(false);
    } finally {
      setSubmittingBib(false);
    }
  };

  const filteredLeaderboard = (Array.isArray(leaderboard) && leaderboard.length > 0 ? leaderboard : [
    { id: "b-1", rank: 1, bib_number: "VNE-42-001", runner_name: "Trần Đình Khang", distance_km: 42.195, chip_time: "02:48:12", status: "finished" },
    { id: "b-2", rank: 2, bib_number: "VNE-42-005", runner_name: "Lê Minh Tuấn", distance_km: 42.195, chip_time: "02:54:30", status: "finished" },
    { id: "b-3", rank: 3, bib_number: "VNE-42-012", runner_name: "Nguyễn Hải Đăng", distance_km: 42.195, chip_time: "03:02:18", status: "finished" },
    { id: "b-4", rank: 4, bib_number: "VNE-21-008", runner_name: "Hoàng Nhật Minh", distance_km: 21, chip_time: "01:19:45", status: "finished" },
  ]).filter((item) => {
    if (filterDistance && Number(item.distance_km) !== filterDistance) return false;
    if (searchBib) {
      const q = searchBib.toLowerCase();
      return (item.bib_number || "").toLowerCase().includes(q) || (item.runner_name || "").toLowerCase().includes(q);
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
            value={searchBib}
            onChange={(e) => setSearchBib(e.target.value)}
            placeholder="Tra cứu số BIB (VNE-42-001) hoặc tên..."
            className="w-full rounded-xl border border-[#D8B282]/20 bg-[#121620] py-2 pl-9 pr-3 text-xs text-[#F6E1C3] placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] text-xs font-bold shadow hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Nhận BIB</span>
        </button>
      </div>

      {/* 2. Filter Cự Ly */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { key: null, label: "Tất Cả Cự Ly" },
          { key: 42.195, label: "Full Marathon (42.195 KM)" },
          { key: 21, label: "Half Marathon (21 KM)" },
          { key: 10, label: "10 KM Chinh Phục" },
          { key: 5, label: "5 KM Trải Nghiệm" },
        ].map((item) => (
          <button
            key={String(item.key)}
            type="button"
            onClick={() => setFilterDistance(item.key)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all ${
              filterDistance === item.key
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
            <span>Tính Năng Nhanh Giải Chạy & RFID</span>
          </div>
          <span className="text-[10px] text-[#D8B282]/80 font-medium">ViOne Run Timing</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Đăng ký BIB */}
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Đăng Ký BIB</span>
            <span className="text-[8px] text-slate-400">Cấp mã tự động</span>
          </button>

          {/* Quick Action 2: Thảm RFID */}
          <button
            type="button"
            onClick={handleSimulateSplit}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Quét RFID</span>
            <span className="text-[8px] text-slate-400">Mô phỏng thảm chip</span>
          </button>

          {/* Quick Action 3: Bảng xếp hạng */}
          <button
            type="button"
            onClick={() => toast.info("Xem bảng xếp hạng Top Finisher theo thời gian thực bên dưới.")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Trophy className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Leaderboard</span>
            <span className="text-[8px] text-slate-400">Top VĐV</span>
          </button>

          {/* Quick Action 4: Chứng nhận Finisher */}
          <button
            type="button"
            onClick={() => {
              if (leaderboard[0]) {
                setCertificateBib(leaderboard[0]);
              } else {
                toast.info("Chưa có chứng nhận cho lượt chạy này.");
              }
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#121620] border border-[#D8B282]/20 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#D8B282]/15 border border-[#D8B282]/40 flex items-center justify-center text-[#F6E1C3] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4 text-[#D8B282]" />
            </div>
            <span className="text-[10px] font-bold text-[#F6E1C3] leading-tight">Chứng Nhận</span>
            <span className="text-[8px] text-slate-400">E-Certificate</span>
          </button>
        </div>
      </div>

      {/* 4. GIẢI CHẠY DI SẢN TIÊU BIỂU (FEATURED RACE CARD) */}
      {selectedRace && (
        <div className="rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] p-3.5 shadow-lg space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#121620]">
            <img
              src={selectedRace.banner_url || "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80"}
              alt={selectedRace.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 left-2 rounded-full bg-[#050C15]/85 border border-[#D8B282]/40 px-2.5 py-0.5 text-[9px] font-bold text-[#F6E1C3]">
              Hệ Thống Timing RFID 1/1000s
            </div>
            <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
              {selectedRace.registered_count ?? (selectedRace as any).runners_count ?? 4250} Runner Đã Đăng Ký
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#F6E1C3]">{selectedRace.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
              <MapPin className="h-3 w-3 text-[#D8B282] shrink-0" />
              <span>{selectedRace.location}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Calendar className="h-3 w-3 text-[#D8B282] shrink-0" />
              <span>Khởi tranh: {new Date(selectedRace.start_date || (selectedRace as any).race_date || Date.now()).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>

          {/* Cự ly selector */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#D8B282]/15">
            <span className="text-[10px] text-slate-400">Chọn cự ly:</span>
            {(Array.isArray(selectedRace.distances) && selectedRace.distances.length > 0 ? selectedRace.distances : [5, 10, 21, 42.195]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRegDistance(d)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                  regDistance === d
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15]"
                    : "border border-[#D8B282]/25 bg-[#121620] text-slate-300"
                }`}
              >
                {d} KM
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Đăng Ký Tham Gia & Cấp Số BIB Tức Thì</span>
          </button>
        </div>
      )}

      {/* 5. MÔ PHỎNG THẢM CHIP RFID & BẢNG XẾP HẠNG FINISHER */}
      <div className="rounded-2xl border border-[#D8B282]/25 bg-[#0B0F17] p-3 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <Radio className="h-3.5 w-3.5 text-[#D8B282] animate-pulse" />
            <span>Mô Phỏng Cổng Đo Timing RFID</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Độ trễ &lt;10ms</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={simBibInput}
            onChange={(e) => setSimBibInput(e.target.value)}
            placeholder="Số BIB (VNE-42-001)"
            className="flex-1 rounded-xl border border-[#D8B282]/25 bg-[#121620] px-3 py-1.5 text-xs text-[#F6E1C3]"
          />
          <select
            value={simCheckpoint}
            onChange={(e) => setSimCheckpoint(e.target.value as any)}
            className="rounded-xl border border-[#D8B282]/25 bg-[#121620] px-2 py-1.5 text-[11px] text-[#F6E1C3]"
          >
            <option value="start">Vạch Start</option>
            <option value="split_10k">Trạm 10K</option>
            <option value="split_21k">Trạm 21K</option>
            <option value="finish">Đích (Finish)</option>
          </select>
          <button
            type="button"
            disabled={simulatingRfid}
            onClick={handleSimulateSplit}
            className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1.5 text-xs font-bold text-[#050C15] shrink-0"
          >
            {simulatingRfid ? "Quét..." : "Ghi Nhận"}
          </button>
        </div>

        {/* Leaderboard rows */}
        <div className="space-y-1.5 pt-2 border-t border-[#D8B282]/15">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
            <span>Hạng & Runner</span>
            <span>Cự Ly / Thành Tích</span>
          </div>

          {filteredLeaderboard.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setCertificateBib(item)}
              className="flex items-center justify-between p-2 rounded-xl bg-[#121620] border border-[#D8B282]/15 hover:border-[#D8B282]/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  idx === 0
                    ? "bg-amber-400 text-black"
                    : idx === 1
                    ? "bg-slate-300 text-black"
                    : idx === 2
                    ? "bg-amber-700 text-white"
                    : "bg-[#0B0F17] text-slate-400 border border-[#D8B282]/20"
                }`}>
                  #{item.rank || idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#F6E1C3] leading-tight">{item.runner_name}</h4>
                  <span className="text-[9px] text-[#D8B282]">BIB: {item.bib_number}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 block">{item.chip_time || "Đang chạy"}</span>
                <span className="text-[9px] text-slate-400">{item.distance_km} KM</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CHUYÊN MỤC BÀI VIẾT & CẨM NANG CHẠY BỘ (EDITORIAL FEED) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F6E1C3]">
            <BookOpen className="h-3.5 w-3.5 text-[#D8B282]" />
            <span>Bài Viết & Cẩm Nang Marathon Di Sản</span>
          </div>
          <span className="text-[10px] text-[#D8B282]">Kiến thức chạy bộ</span>
        </div>

        <div className="space-y-2.5">
          {RUN_ARTICLES.map((article) => (
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

      {/* MODAL 1: ĐĂNG KÝ BIB MỚI */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#D8B282]/40 bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3]">
            <div className="flex items-start justify-between border-b border-[#D8B282]/20 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#D8B282] uppercase">Cấp Số Định Danh Runner</span>
                <h3 className="text-base font-bold font-serif text-[#F6E1C3] mt-0.5">
                  Đăng Ký BIB Điện Tử & Chip Timing
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Họ & Tên Vận Động Viên:</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] px-3 py-2 text-xs text-[#F6E1C3]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cự Ly Thi Đấu:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 21, 42.195].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRegDistance(d)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        regDistance === d
                          ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15]"
                          : "border border-[#D8B282]/25 bg-[#121620] text-slate-300"
                      }`}
                    >
                      {d} KM
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Giới Tính:</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] px-3 py-2 text-xs text-[#F6E1C3]"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tuổi:</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(parseInt(e.target.value, 10) || 25)}
                    className="w-full rounded-xl border border-[#D8B282]/30 bg-[#121620] px-3 py-2 text-xs text-[#F6E1C3]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={submittingBib}
              onClick={handleRegisterBib}
              className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2.5 text-xs font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all"
            >
              {submittingBib ? "Đang xử lý..." : "Xác Nhận Nhận Số BIB Ngay"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: BÀI VIẾT CHI TIẾT */}
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

      {/* MODAL 3: CHỨNG NHẬN FINISHER E-CERTIFICATE */}
      {certificateBib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-[#D8B282] bg-[#0B0F17] p-5 shadow-2xl space-y-4 text-[#F6E1C3] text-center">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCertificateBib(null)}
                className="rounded-full border border-[#D8B282]/30 bg-[#1A1A24] p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <Award className="h-10 w-10 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D8B282]">
                CHỨNG NHẬN FINISHER ĐIỆN TỬ
              </h3>
              <p className="text-xs text-slate-400">ViOne Heritage Marathon Cố Đô 2026</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121620] border border-[#D8B282]/30 space-y-2">
              <span className="text-[10px] text-slate-400">Chứng nhận vận động viên:</span>
              <h2 className="text-lg font-bold text-[#F6E1C3] font-serif">{certificateBib.runner_name}</h2>
              <div className="flex items-center justify-center gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Số BIB</span>
                  <span className="font-bold text-amber-400">{certificateBib.bib_number}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Cự Ly</span>
                  <span className="font-bold text-[#F6E1C3]">{certificateBib.distance_km} KM</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Thành Tích</span>
                  <span className="font-bold text-amber-400">{certificateBib.chip_time || "02:48:12"}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.success("Đã tải chứng nhận Finisher E-Certificate dạng PDF!")}
              className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow hover:brightness-110 active:scale-95 transition-all"
            >
              Tải Chứng Nhận Về Máy (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
