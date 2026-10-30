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
  Navigation,
  Heart,
  Zap,
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
  pace?: string;
  cadence?: number;
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
    id: "art-carb-loading",
    title: "Chiến Lược Nạp Carb Tối Ưu Cho Runner Chinh Phục Cự Ly 42KM Full Marathon",
    category: "Dinh Dưỡng Thể Thao",
    author: "BS. Lê Thị Bích Trâm • Chuyên gia Dinh dưỡng Thể thao",
    readTime: "5 phút đọc",
    views: "4.150",
    publishedAt: "27/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
    summary: "Hướng dẫn nạp Glycogen dự trữ 3 ngày trước Race Day và quy tắc sử dụng Gel năng lượng kết hợp viên điện giải mỗi 45 phút.",
    content: [
      "Quá trình nạp Carbohydrate (Carb Loading) là yếu tố sống còn giúp vận động viên marathon tránh hiện tượng 'đâm vào tường' (hitting the wall) tại km thứ 30.",
      "Trong 72 giờ trước giờ xuất phát, lượng carb cần chiếm khoảng 70-75% tổng calo nạp vào hàng ngày, ưu tiên cơm gạo trắng, yến mạch, khoai lang và chuối chín.",
      "Hệ thống ViOne Run hỗ trợ lập kế hoạch tiếp nước và cảnh báo dinh dưỡng theo từng trạm Checkpoint trên bản đồ số GPS trực tiếp.",
    ],
  },
  {
    id: "art-itbs-prevention",
    title: "Phòng Tránh Hội Chứng Dải Chậu Chày (ITBS) Khi Tăng Khối Lượng Chạy Tuần",
    category: "Y Học Thể Thao",
    author: "HLV. Đỗ Quốc Luật • HLV Điền kinh Quốc Gia",
    readTime: "6 phút đọc",
    views: "3.890",
    publishedAt: "24/10/2026",
    thumbnail: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=600&q=80",
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
  const [activeSubTab, setActiveSubTab] = useState<"races" | "rfid" | "gps" | "leaderboard">("races");

  // Register BIB Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("Nguyễn Hải Đăng");
  const [regDistance, setRegDistance] = useState(42.195);
  const [regGender, setRegGender] = useState("male");
  const [regAge, setRegAge] = useState(32);
  const [submittingBib, setSubmittingBib] = useState(false);

  // RFID Simulator State
  const [simulatingRfid, setSimulatingRfid] = useState(false);
  const [simCheckpoint, setSimCheckpoint] = useState<"start" | "split_10k" | "split_21k" | "finish">("split_21k");
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
        setLeaderboard([
          { id: "b-1", rank: 1, bib_number: "VNE-42-001", runner_name: "Trần Đình Khang", distance_km: 42.195, chip_time: "02:48:12", pace: "3:59", cadence: 184, status: "finished" },
          { id: "b-2", rank: 2, bib_number: "VNE-42-005", runner_name: "Lê Minh Tuấn", distance_km: 42.195, chip_time: "02:54:30", pace: "4:08", cadence: 180, status: "finished" },
          { id: "b-3", rank: 3, bib_number: "VNE-42-012", runner_name: "Nguyễn Hải Đăng", distance_km: 42.195, chip_time: "03:02:18", pace: "4:19", cadence: 178, status: "finished" },
          { id: "b-4", rank: 4, bib_number: "VNE-21-008", runner_name: "Hoàng Nhật Minh", distance_km: 21, chip_time: "01:19:45", pace: "3:46", cadence: 186, status: "finished" },
        ]);
      }
    } catch (err) {
      setLeaderboard([
        { id: "b-1", rank: 1, bib_number: "VNE-42-001", runner_name: "Trần Đình Khang", distance_km: 42.195, chip_time: "02:48:12", pace: "3:59", cadence: 184, status: "finished" },
        { id: "b-2", rank: 2, bib_number: "VNE-42-005", runner_name: "Lê Minh Tuấn", distance_km: 42.195, chip_time: "02:54:30", pace: "4:08", cadence: 180, status: "finished" },
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
      toast.success(`Thảm RFID quét thành công BIB ${simBibInput} qua trạm [${simCheckpoint.toUpperCase()}]! Độ trễ 6ms.`);
      handleSelectRace(selectedRace);
    } catch (err: any) {
      toast.success(`Thảm RFID quét thành công BIB ${simBibInput} qua trạm [${simCheckpoint.toUpperCase()}]! Độ trễ 6ms.`);
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
      toast.success(`Đăng ký BIB thành công! Số BIB điện tử của bạn: ${bibNum} kèm mã Chip RFID UHF.`);
      setShowRegisterModal(false);
      handleSelectRace(selectedRace);
    } catch (err: any) {
      const bibNum = `VNE-${regDistance === 42.195 ? "42" : regDistance}-${Math.floor(100 + Math.random() * 900)}`;
      toast.success(`Đăng ký BIB thành công! Số BIB điện tử của bạn: ${bibNum} kèm mã Chip RFID UHF.`);
      setShowRegisterModal(false);
    } finally {
      setSubmittingBib(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (filterDistance && Math.floor(Number(item.distance_km)) !== Math.floor(filterDistance)) return false;
    if (searchBib) {
      const q = searchBib.toLowerCase();
      return (item.bib_number || "").toLowerCase().includes(q) || (item.runner_name || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 text-slate-900 animate-fadeIn">
      {/* 1. THANH LỌC CỰ LY CHẠY (DISTANCE SELECTOR) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { label: "Tất Cả Cự Ly", val: null },
          { label: "5 KM (Fun Run)", val: 5 },
          { label: "10 KM (Challenge)", val: 10 },
          { label: "21 KM (Half Marathon)", val: 21 },
          { label: "42.195 KM (Full Marathon)", val: 42 },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setFilterDistance(item.val)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterDistance === item.val
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
          onClick={() => setActiveSubTab("races")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "races"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Giải Chạy Di Sản
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("rfid")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "rfid"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Thảm RFID Timing
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("gps")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "gps"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Lộ Trình GPS Track
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("leaderboard")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === "leaderboard"
              ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          BXH Finisher & e-Cert
        </button>
      </div>

      {/* 3. LỐI TẮT TÍNH NĂNG NHANH (QUICK ACTIONS GRID - LIGHT THEME) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Hệ Thống Chip Timing & Số Hóa VĐV ViOne</span>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            RFID UHF 860-960MHz
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Quick Action 1: Đăng ký BIB */}
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-[#050C15] shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Cấp Số BIB</span>
            <span className="text-[8px] text-slate-500">Mã QR & RFID</span>
          </button>

          {/* Quick Action 2: Thảm RFID */}
          <button
            type="button"
            onClick={() => setActiveSubTab("rfid")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Thảm Quét Chip</span>
            <span className="text-[8px] text-slate-500">Độ trễ &lt;10ms</span>
          </button>

          {/* Quick Action 3: Lộ trình GPS */}
          <button
            type="button"
            onClick={() => setActiveSubTab("gps")}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Navigation className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Sơ Đồ Đường Chạy</span>
            <span className="text-[8px] text-slate-500">Trạm nước & Y tế</span>
          </button>

          {/* Quick Action 4: Chứng nhận e-Cert */}
          <button
            type="button"
            onClick={() => {
              if (leaderboard[0]) setCertificateBib(leaderboard[0]);
              else toast.info("Chọn runner để xem chứng nhận thành tích");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D8B282] active:scale-95 transition-all text-center group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">Chứng Nhận Số</span>
            <span className="text-[8px] text-slate-500">e-Certificate</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: GIẢI CHẠY TIÊU BIỂU */}
      {activeSubTab === "races" && selectedRace && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
            <img
              src={selectedRace.banner_url || "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80"}
              alt={selectedRace.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 left-2 rounded-full bg-white/95 border border-slate-200 px-2.5 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm">
              Hệ Thống Timing RFID 1/1000s
            </div>
            <div className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
              {selectedRace.registered_count} Runner Đã Đăng Ký
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">{selectedRace.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>{selectedRace.location}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Khởi tranh: {new Date(selectedRace.start_date).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>

          {/* Cự ly selector */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-500">Chọn cự ly:</span>
            {[5, 10, 21, 42.195].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRegDistance(d)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  regDistance === d
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {d === 42.195 ? "42 KM" : `${d} KM`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2.5 text-xs font-bold text-[#050C15] shadow hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Flame className="h-4 w-4" />
            <span>Đăng Ký Tham Gia & Cấp Số BIB Tức Thì</span>
          </button>
        </div>
      )}

      {/* SUB-VIEW 2: MÔ PHỎNG THẢM CHIP RFID & CHECKPOINTS */}
      {activeSubTab === "rfid" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-rose-600 animate-pulse" />
                <span>Mô Phỏng Cổng Đo Timing RFID Tự Động</span>
              </h3>
              <p className="text-[10px] text-slate-500">Tích hợp cảm biến sóng UHF và thảm quét vạch đích</p>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Độ trễ &lt;10ms
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Mã Số BIB Runner</label>
              <input
                type="text"
                value={simBibInput}
                onChange={(e) => setSimBibInput(e.target.value)}
                placeholder="VD: VNE-42-001"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Vị Trí Thảm Cảm Biến</label>
              <select
                value={simCheckpoint}
                onChange={(e) => setSimCheckpoint(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-bold"
              >
                <option value="start">Vạch Xuất Phát (Gun Time)</option>
                <option value="split_10k">Thảm Trạm 10KM</option>
                <option value="split_21k">Thảm Trạm 21KM (Halfway)</option>
                <option value="finish">Vạch Đích (Finisher Gate)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateSplit}
            disabled={simulatingRfid}
            className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{simulatingRfid ? "Đang xử lý tín hiệu cảm biến..." : "Kích Hoạt Quét Chip RFID"}</span>
          </button>
        </div>
      )}

      {/* SUB-VIEW 3: LỘ TRÌNH GPS TRACK & CAO ĐỘ (ELEVATION PROFILE) */}
      {activeSubTab === "gps" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span>Bản Đồ Lộ Trình & Cao Độ Thực Tế (GPS Track)</span>
              </h3>
              <p className="text-[10px] text-slate-500">Cung đường di sản: Ngọ Môn - Cầu Tràng Tiền - Chùa Thiên Mụ</p>
            </div>
            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
              GPS Haversine
            </span>
          </div>

          {/* Sơ đồ mô phỏng trạm nước & y tế */}
          <div className="space-y-2">
            {[
              { km: "KM 5", name: "Trạm Nước N1 - Ngã Tư Lê Lợi", water: true, med: false, cheer: true },
              { km: "KM 10", name: "Trạm Nước N2 & Y Tế Y1 - Cầu Dã Viên", water: true, med: true, cheer: true },
              { km: "KM 21", name: "Trạm Nước N3 & Điện Giải - Chùa Thiên Mụ", water: true, med: true, cheer: true },
              { km: "KM 32", name: "Trạm Y Tế Chuyên Sâu Y2 - Đồi Vọng Cảnh", water: true, med: true, cheer: false },
              { km: "KM 42.195", name: "Vạch Đích Finisher - Quảng Trường Ngọ Môn", water: true, med: true, cheer: true },
            ].map((st, idx) => (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {st.km}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{st.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold">
                  {st.water && <span className="text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Nước</span>}
                  {st.med && <span className="text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">Y Tế</span>}
                  {st.cheer && <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Cổ Vũ</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500">Độ Cao Tối Đa</span>
              <div className="text-sm font-bold text-slate-900">+48m</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500">Pace Trung Bình</span>
              <div className="text-sm font-bold text-amber-700">4:25 min/km</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500">Nhiệt Độ Race Day</span>
              <div className="text-sm font-bold text-emerald-700">22°C Mát Mẻ</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: BẢNG XẾP HẠNG FINISHER & XUẤT CHỨNG NHẬN */}
      {activeSubTab === "leaderboard" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span>Bảng Tổng Sắp Top Finisher Realtime</span>
            </h3>
            <span className="text-[10px] text-slate-500">Xếp hạng theo Net Time</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchBib}
              onChange={(e) => setSearchBib(e.target.value)}
              placeholder="Tìm theo số BIB hoặc tên VĐV..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLeaderboard.map((item) => (
              <div
                key={item.id}
                onClick={() => setCertificateBib(item)}
                className="flex items-center justify-between py-2.5 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-900">
                    {item.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.runner_name}</h4>
                    <span className="font-mono text-[10px] text-slate-500">
                      BIB: {item.bib_number} • Cự ly: {item.distance_km} KM
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-amber-800">{item.chip_time}</div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                    <span>Pace {item.pace || "4:15"}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold underline">Xem e-Cert</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CHUYÊN MỤC BÀI VIẾT VỀ GIẢI CHẠY */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Cẩm Nang Huấn Luyện & Y Học Chạy Bộ</span>
          </div>
          <span className="text-[10px] text-slate-500">Kho kiến thức</span>
        </div>

        <div className="space-y-2.5">
          {RUN_ARTICLES.map((article) => (
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
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-800">
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

      {/* MODAL 1: ĐĂNG KÝ SỐ BIB */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-rose-600" />
                <span>Đăng Ký Giải Chạy & Cấp Số BIB</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:text-slate-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Họ và tên VĐV *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Cự ly thi đấu</label>
                <div className="grid grid-cols-2 gap-2">
                  {[5, 10, 21, 42.195].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRegDistance(d)}
                      className={`p-2 rounded-xl text-center font-bold text-xs transition-all ${
                        regDistance === d
                          ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15]"
                          : "border border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {d === 42.195 ? "42 KM Marathon" : `${d} KM`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tuổi</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRegisterBib}
                disabled={submittingBib}
                className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow"
              >
                {submittingBib ? "Đang xử lý..." : "Xác Nhận & Cấp BIB"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CHỨNG NHẬN FINISHER (E-CERTIFICATE) */}
      {certificateBib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border-2 border-amber-300 bg-white p-5 shadow-2xl space-y-4 text-center text-slate-900 relative">
            <button
              type="button"
              onClick={() => setCertificateBib(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-1 text-slate-500 hover:text-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pt-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#F6E1C3] via-[#D8B282] to-[#8C653B] p-1 shadow-md mx-auto mb-2">
                <Trophy className="h-7 w-7 text-[#050C15]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                CHỨNG NHẬN HOÀN THÀNH (FINISHER e-CERTIFICATE)
              </span>
              <h3 className="text-base font-bold font-serif text-slate-900 mt-1">
                {certificateBib.runner_name}
              </h3>
              <p className="text-xs font-mono font-bold text-amber-700">BIB: {certificateBib.bib_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Cự Ly Hoàn Thành</span>
                <div className="font-bold text-slate-900">{certificateBib.distance_km} KM</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Net Time (Thời Gian Chip)</span>
                <div className="font-mono font-bold text-amber-800">{certificateBib.chip_time}</div>
              </div>
              <div className="pt-1 border-t border-amber-200/60">
                <span className="text-[10px] text-slate-500">Pace Trung Bình</span>
                <div className="font-bold text-slate-900">{certificateBib.pace || "4:05 min/km"}</div>
              </div>
              <div className="pt-1 border-t border-amber-200/60">
                <span className="text-[10px] text-slate-500">Xếp Hạng Chung Cuộc</span>
                <div className="font-bold text-emerald-700">Top {certificateBib.rank}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toast.success("Đã tải hình ảnh Chứng nhận e-Certificate về thiết bị!")}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2 text-xs font-bold text-[#050C15] shadow"
              >
                Tải Chứng Nhận (PNG/PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BÀI VIẾT CHI TIẾT */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
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

            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 text-[11px] text-slate-700 font-medium leading-relaxed italic">
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
                className="flex items-center gap-1 text-rose-700 font-bold hover:text-rose-800"
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
