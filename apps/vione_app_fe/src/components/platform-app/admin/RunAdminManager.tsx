import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  MapPin,
  RefreshCw,
  X,
  Play,
  Award,
  Users,
  Radio,
  Timer,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Download,
  AlertCircle,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface RaceItem {
  id: string;
  code: string;
  name: string;
  race_date: string;
  location: string;
  province: string;
  elevation_gain_m: number;
  is_heritage_run: boolean;
  status: string;
  banner_url?: string;
  description?: string;
}

export interface RunnerBibItem {
  id: string;
  raceId: string;
  raceName: string;
  bibNumber: string;
  runnerName: string;
  gender: "male" | "female";
  age: number;
  distanceKm: number;
  rfidChipUid: string;
  waveStart: "Wave A (Elite)" | "Wave B (Sub 4)" | "Wave C (Open)";
  shirtSize: "S" | "M" | "L" | "XL" | "XXL";
  status: "registered" | "checked_in" | "running" | "finished" | "dnf";
}

export interface CheckpointItem {
  id: string;
  name: string;
  code: "start" | "split_5k" | "split_10k" | "split_21k" | "finish";
  distanceKm: number;
  rfidMatsCount: number;
  signalStatus: "online" | "weak" | "offline";
  hasWaterStation: boolean;
  hasMedicalSupport: boolean;
  cutOffTimeHours: number;
}

export interface LeaderboardItem {
  rank: number;
  bibNumber: string;
  runnerName: string;
  gender: string;
  distanceKm: number;
  lastCheckpoint: string;
  chipTime: string;
  gunTime: string;
  averagePace: string;
  status: "running" | "finished" | "dnf";
}

type RunAdminTab = "races" | "runners" | "checkpoints" | "leaderboard" | "certificates";

export const RunAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RunAdminTab>("races");
  const [races, setRaces] = useState<RaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHeritage, setFilterHeritage] = useState<string>("all");

  // Selected Race for sub-modules
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");

  // Modal Race (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRace, setEditingRace] = useState<RaceItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    race_date: new Date().toISOString().split("T")[0],
    location: "Khu Di Tích & Đô Thị Cổ",
    province: "Hà Nội",
    elevation_gain_m: 150,
    is_heritage_run: true,
    status: "upcoming",
    banner_url: "",
    description: "",
  });

  // Runner & BIB Modal State
  const [runners, setRunners] = useState<RunnerBibItem[]>([
    {
      id: "run-01",
      raceId: "1",
      raceName: "Hà Nội Heritage Marathon 2026",
      bibNumber: "42088",
      runnerName: "Nguyễn Văn Hùng",
      gender: "male",
      age: 32,
      distanceKm: 42.195,
      rfidChipUid: "E280-6894-0001",
      waveStart: "Wave A (Elite)",
      shirtSize: "L",
      status: "finished",
    },
    {
      id: "run-02",
      raceId: "1",
      raceName: "Hà Nội Heritage Marathon 2026",
      bibNumber: "21055",
      runnerName: "Trần Thị Mai Anh",
      gender: "female",
      age: 28,
      distanceKm: 21.097,
      rfidChipUid: "E280-6894-0002",
      waveStart: "Wave B (Sub 4)",
      shirtSize: "M",
      status: "running",
    },
    {
      id: "run-03",
      raceId: "1",
      raceName: "Hà Nội Heritage Marathon 2026",
      bibNumber: "10012",
      runnerName: "Lê Minh Tuấn",
      gender: "male",
      age: 35,
      distanceKm: 10,
      rfidChipUid: "E280-6894-0003",
      waveStart: "Wave C (Open)",
      shirtSize: "XL",
      status: "checked_in",
    },
  ]);
  const [isRunnerModalOpen, setIsRunnerModalOpen] = useState(false);
  const [runnerForm, setRunnerForm] = useState({
    runnerName: "",
    bibNumber: "",
    gender: "male" as "male" | "female",
    age: 30,
    distanceKm: 42.195,
    rfidChipUid: "",
    waveStart: "Wave A (Elite)" as "Wave A (Elite)" | "Wave B (Sub 4)" | "Wave C (Open)",
    shirtSize: "L" as "S" | "M" | "L" | "XL" | "XXL",
  });

  // Checkpoints State
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([
    {
      id: "cp-0",
      name: "Cổng Xuất Phát (Start Line)",
      code: "start",
      distanceKm: 0,
      rfidMatsCount: 4,
      signalStatus: "online",
      hasWaterStation: true,
      hasMedicalSupport: true,
      cutOffTimeHours: 0.5,
    },
    {
      id: "cp-1",
      name: "Trạm Tiếp Sức Hồ Gươm (Split 5K)",
      code: "split_5k",
      distanceKm: 5,
      rfidMatsCount: 2,
      signalStatus: "online",
      hasWaterStation: true,
      hasMedicalSupport: true,
      cutOffTimeHours: 1.0,
    },
    {
      id: "cp-2",
      name: "Cột Cờ Hà Nội (Split 10K)",
      code: "split_10k",
      distanceKm: 10,
      rfidMatsCount: 2,
      signalStatus: "online",
      hasWaterStation: true,
      hasMedicalSupport: true,
      cutOffTimeHours: 2.0,
    },
    {
      id: "cp-3",
      name: "Cầu Long Biên (Halfway 21K)",
      code: "split_21k",
      distanceKm: 21.097,
      rfidMatsCount: 2,
      signalStatus: "online",
      hasWaterStation: true,
      hasMedicalSupport: true,
      cutOffTimeHours: 3.5,
    },
    {
      id: "cp-4",
      name: "Cổng Về Đích (Finish Line)",
      code: "finish",
      distanceKm: 42.195,
      rfidMatsCount: 4,
      signalStatus: "online",
      hasWaterStation: true,
      hasMedicalSupport: true,
      cutOffTimeHours: 7.0,
    },
  ]);

  // Live Leaderboard & RFID Simulation State
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([
    {
      rank: 1,
      bibNumber: "42088",
      runnerName: "Nguyễn Văn Hùng",
      gender: "Nam",
      distanceKm: 42.195,
      lastCheckpoint: "Finish Line",
      chipTime: "02:38:15",
      gunTime: "02:38:20",
      averagePace: "03:45",
      status: "finished",
    },
    {
      rank: 2,
      bibNumber: "42102",
      runnerName: "Phạm Hải Đăng",
      gender: "Nam",
      distanceKm: 42.195,
      lastCheckpoint: "Finish Line",
      chipTime: "02:42:30",
      gunTime: "02:42:35",
      averagePace: "03:51",
      status: "finished",
    },
    {
      rank: 3,
      bibNumber: "21055",
      runnerName: "Trần Thị Mai Anh",
      gender: "Nữ",
      distanceKm: 21.097,
      lastCheckpoint: "Halfway 21K",
      chipTime: "01:28:40",
      gunTime: "01:28:45",
      averagePace: "04:12",
      status: "running",
    },
  ]);
  const [timingModalOpen, setTimingModalOpen] = useState(false);
  const [timingForm, setTimingForm] = useState({
    bibNumber: "42088",
    checkpoint: "finish" as "start" | "split_5k" | "split_10k" | "split_21k" | "finish",
  });

  // Certificate Modal Preview
  const [selectedCertRunner, setSelectedCertRunner] = useState<RunnerBibItem | null>(null);

  const loadRaces = async () => {
    setLoading(true);
    try {
      const q = filterHeritage !== "all" ? `?isHeritageRun=${filterHeritage === "true"}` : "";
      const res = await fetchNestApi<RaceItem[]>(`/platform-hub/run/races${q}`);
      if (Array.isArray(res)) {
        setRaces(res);
        if (res.length > 0 && !selectedRaceId) {
          setSelectedRaceId(res[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách giải chạy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRaces();
  }, [filterHeritage]);

  const handleOpenModal = (race?: RaceItem) => {
    if (race) {
      setEditingRace(race);
      setForm({
        name: race.name,
        race_date: race.race_date ? race.race_date.split("T")[0] : "",
        location: race.location,
        province: race.province,
        elevation_gain_m: race.elevation_gain_m,
        is_heritage_run: race.is_heritage_run,
        status: race.status,
        banner_url: race.banner_url || "",
        description: race.description || "",
      });
    } else {
      setEditingRace(null);
      setForm({
        name: "",
        race_date: new Date().toISOString().split("T")[0],
        location: "Khu Di Tích & Đô Thị Cổ",
        province: "Hà Nội",
        elevation_gain_m: 150,
        is_heritage_run: true,
        status: "upcoming",
        banner_url: "",
        description: "",
      });
    }
    setModalOpen(true);
  };

  const handleSaveRace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên giải chạy");
      return;
    }
    try {
      if (editingRace) {
        await fetchNestApi(`/platform-hub/run/races/${editingRace.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật thông tin giải chạy thành công!");
      } else {
        await fetchNestApi(`/platform-hub/run/races`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Khởi tạo giải chạy mới thành công!");
      }
      setModalOpen(false);
      loadRaces();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu giải chạy");
    }
  };

  const handleDeleteRace = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa giải chạy "${name}"?`)) return;
    try {
      await fetchNestApi(`/platform-hub/run/races/${id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa giải chạy thành công!");
      loadRaces();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa giải chạy");
    }
  };

  // Simulating RFID Scan trigger
  const handleSimulateTiming = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await fetchNestApi(`/platform-hub/run/timing/simulate-split`, {
        method: "POST",
        body: JSON.stringify({
          raceId: selectedRaceId || races[0]?.id || "1",
          bibNumber: timingForm.bibNumber,
          checkpoint: timingForm.checkpoint,
        }),
      });
      toast.success(res?.message || `Đã ghi nhận tín hiệu thảm RFID cho BIB ${timingForm.bibNumber}!`);
      setTimingModalOpen(false);

      // Cập nhật live leaderboard
      setLeaderboard((prev) => [
        {
          rank: 1,
          bibNumber: timingForm.bibNumber,
          runnerName: runners.find((r) => r.bibNumber === timingForm.bibNumber)?.runnerName || "Runner ViOne",
          gender: "Nam",
          distanceKm: 42.195,
          lastCheckpoint: checkpoints.find((c) => c.code === timingForm.checkpoint)?.name || "Thảm đo",
          chipTime: "02:35:10",
          gunTime: "02:35:14",
          averagePace: "03:41",
          status: timingForm.checkpoint === "finish" ? "finished" : "running",
        },
        ...prev.filter((item) => item.bibNumber !== timingForm.bibNumber),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi kích hoạt timing RFID");
    }
  };

  const handleAddRunner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runnerForm.runnerName || !runnerForm.bibNumber) {
      toast.error("Vui lòng điền đủ tên VĐV và số BIB");
      return;
    }
    const newRunner: RunnerBibItem = {
      id: `run-${Date.now()}`,
      raceId: selectedRaceId || races[0]?.id || "1",
      raceName: races.find((r) => r.id === selectedRaceId)?.name || "Giải Chạy Di Sản",
      bibNumber: runnerForm.bibNumber,
      runnerName: runnerForm.runnerName,
      gender: runnerForm.gender,
      age: runnerForm.age,
      distanceKm: runnerForm.distanceKm,
      rfidChipUid: runnerForm.rfidChipUid || `E280-${Math.floor(1000 + Math.random() * 9000)}`,
      waveStart: runnerForm.waveStart,
      shirtSize: runnerForm.shirtSize,
      status: "checked_in",
    };
    setRunners([newRunner, ...runners]);
    setIsRunnerModalOpen(false);
    toast.success(`Đã phân bổ BIB ${runnerForm.bibNumber} cho VĐV ${runnerForm.runnerName}!`);
  };

  const filteredRaces = races.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.province.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Tabs Navigation Suite (Đa Chiều Nghiệp Vụ) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: "races", label: "1. Giải Chạy & Cự Ly", icon: Flame, count: races.length },
            { id: "runners", label: "2. VĐV & BIB RFID", icon: Users, count: runners.length },
            { id: "checkpoints", label: "3. Trạm Checkpoint", icon: Radio, count: checkpoints.length },
            { id: "leaderboard", label: "4. Live Timing Console", icon: Timer, count: leaderboard.length },
            { id: "certificates", label: "5. E-Certificate & Medal", icon: Award, count: runners.filter((r) => r.status === "finished").length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as RunAdminTab)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 font-bold shadow-md"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.2 text-[10px]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimingModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-[#D8B282]/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-800 dark:text-[#F6E1C3] hover:bg-amber-500/20"
          >
            <Radio className="h-3.5 w-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
            <span>Bắn Tín Hiệu RFID</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: QUẢN TRỊ GIẢI CHẠY & CỰ LY (RACES) ── */}
      {activeTab === "races" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterHeritage("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterHeritage === "all"
                    ? "bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] text-zinc-950 font-bold shadow-sm"
                    : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                }`}
              >
                Tất Cả ({races.length})
              </button>
              <button
                onClick={() => setFilterHeritage("true")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterHeritage === "true"
                    ? "bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] text-zinc-950 font-bold shadow-sm"
                    : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                }`}
              >
                Giải Chạy Di Sản
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm giải chạy..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Tạo Giải Mới
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-[#B38048] dark:text-[#D8B282]" />
              Đang tải danh sách giải chạy...
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Mã Giải</th>
                      <th className="px-5 py-4">Tên Giải Chạy</th>
                      <th className="px-5 py-4">Phân Loại</th>
                      <th className="px-5 py-4">Thời Gian & Địa Điểm</th>
                      <th className="px-5 py-4">Độ Cao Gain</th>
                      <th className="px-5 py-4">Trạng Thái</th>
                      <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredRaces.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                          Chưa có giải chạy nào. Bấm "+ Tạo Giải Mới" để thêm.
                        </td>
                      </tr>
                    ) : (
                      filteredRaces.map((race) => (
                        <tr
                          key={race.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-5 py-4 font-mono text-xs text-amber-700 dark:text-[#D8B282] font-bold">
                            {race.code}
                          </td>
                          <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                            {race.name}
                          </td>
                          <td className="px-5 py-4">
                            {race.is_heritage_run ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-[#F6E1C3]">
                                <Flame className="w-3 h-3 text-amber-500" />
                                Giải Chạy Di Sản
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-400">
                                Thể Thao Phổ Thông
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {race.race_date ? new Date(race.race_date).toLocaleDateString("vi-VN") : "Chưa xác định"}
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {race.location}, {race.province}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">
                            +{race.elevation_gain_m || 0}m
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              {race.status === "upcoming" ? "Sắp Diễn Ra" : race.status === "ongoing" ? "Đang Diễn Ra" : "Đã Kết Thúc"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenModal(race)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                title="Chỉnh sửa giải chạy"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRace(race.id, race.name)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                                title="Xóa giải chạy"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: VẬN ĐỘNG VIÊN & PHÂN BỔ BIB RFID (RUNNERS) ── */}
      {activeTab === "runners" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Danh Sách VĐV & Số BIB RFID</h3>
              <p className="text-xs text-slate-500">Phân bổ đợt xuất phát (Wave), mã chip thảm đo và kích cỡ áo finisher.</p>
            </div>
            <button
              onClick={() => {
                setRunnerForm({
                  runnerName: "",
                  bibNumber: `${Math.floor(10000 + Math.random() * 90000)}`,
                  gender: "male",
                  age: 29,
                  distanceKm: 42.195,
                  rfidChipUid: `E280-6894-${Math.floor(1000 + Math.random() * 9000)}`,
                  waveStart: "Wave A (Elite)",
                  shirtSize: "L",
                });
                setIsRunnerModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 shadow-md hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              Cấp BIB & Gán Chip RFID
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Số BIB</th>
                    <th className="px-5 py-4">Họ Và Tên VĐV</th>
                    <th className="px-5 py-4">Cự Ly</th>
                    <th className="px-5 py-4">Mã Chip RFID</th>
                    <th className="px-5 py-4">Đợt Xuất Phát (Wave)</th>
                    <th className="px-5 py-4">Áo Finisher</th>
                    <th className="px-5 py-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {runners.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-sm font-extrabold text-amber-700 dark:text-[#D8B282]">
                        #{r.bibNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{r.runnerName}</div>
                        <div className="text-[11px] text-slate-500">{r.gender === "male" ? "Nam" : "Nữ"} · {r.age} tuổi</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {r.distanceKm} KM
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                        {r.rfidChipUid}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 font-medium text-slate-700 dark:text-slate-300">
                          {r.waveStart}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Size {r.shirtSize}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            r.status === "finished"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : r.status === "running"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {r.status === "finished" ? "Đã Về Đích" : r.status === "running" ? "Đang Trên Đường Chạy" : "Đã Nhận BIB"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: TRẠM ĐO CHECKPOINT & AID STATIONS ── */}
      {activeTab === "checkpoints" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-[#D8B282]">
                      <Radio className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cp.name}</h4>
                      <p className="text-xs text-slate-500">Mốc cự ly: {cp.distanceKm} KM</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {cp.signalStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <span className="text-slate-400">Thảm đo RFID:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{cp.rfidMatsCount} Thảm song song</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Giới hạn COT:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{cp.cutOffTimeHours} Giờ</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Trạm Nước:</span>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">Đầy đủ Điện giải/Nước</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Đội Y Tế:</span>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Bác sĩ & Xe cấp cứu</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: LIVE TIMING & RFID CONSOLE ── */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bảng Xếp Hạng & Bắt Tín Hiệu Thảm Đo Thời Gian Thực</h3>
              <p className="text-xs text-slate-500">Giám sát Pace (min/km), Gun Time, Chip Time của vận động viên theo từng checkpoint.</p>
            </div>
            <button
              onClick={() => setTimingModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
            >
              <Radio className="h-4 w-4 animate-pulse text-amber-900" />
              <span>Bắn Tín Hiệu Thảm Đo</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Xếp Hạng</th>
                    <th className="px-5 py-4">Số BIB</th>
                    <th className="px-5 py-4">Họ Tên VĐV</th>
                    <th className="px-5 py-4">Cự Ly</th>
                    <th className="px-5 py-4">Trạm Vừa Qua</th>
                    <th className="px-5 py-4">Chip Time</th>
                    <th className="px-5 py-4">Pace Trung Bình</th>
                    <th className="px-5 py-4 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {leaderboard.map((item) => (
                    <tr key={item.bibNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          item.rank === 1 ? "bg-amber-400 text-zinc-950 shadow-sm" :
                          item.rank === 2 ? "bg-slate-300 text-zinc-950" :
                          item.rank === 3 ? "bg-amber-700 text-white" : "text-slate-500"
                        }`}>
                          {item.rank}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-amber-700 dark:text-[#D8B282]">
                        #{item.bibNumber}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                        {item.runnerName}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {item.distanceKm} KM
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {item.lastCheckpoint}
                      </td>
                      <td className="px-5 py-4 font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {item.chipTime}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {item.averagePace} /km
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.status === "finished" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        }`}>
                          {item.status === "finished" ? "Đã Finisher" : "Đang Chạy"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: E-CERTIFICATE & FINISHER MEDAL ── */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Giấy Chứng Nhận Hoàn Thành Điện Tử (E-Certificate)</h3>
            <p className="text-xs text-slate-500">Tra cứu và phát hành chứng nhận hoàn thành chuẩn quốc tế cho VĐV về đích đúng COT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {runners.filter((r) => r.status === "finished").map((r) => (
              <div
                key={r.id}
                className="relative rounded-2xl border border-amber-300/40 dark:border-[#D8B282]/30 bg-gradient-to-br from-amber-50/40 to-white dark:from-slate-900 dark:to-slate-950 p-5 shadow-sm space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-amber-600 dark:text-[#D8B282]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#F6E1C3]">FINISHER MEDAL</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">BIB #{r.bibNumber}</span>
                </div>

                <div className="border-t border-b border-amber-200/60 dark:border-slate-800 py-3 text-center space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{r.runnerName}</h4>
                  <p className="text-xs text-slate-500">Đã hoàn thành xuất sắc cự ly {r.distanceKm} KM</p>
                  <p className="font-mono text-lg font-black text-amber-700 dark:text-[#D8B282]">02:38:15</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{r.raceName}</span>
                  <button
                    onClick={() => setSelectedCertRunner(r)}
                    className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] px-2.5 py-1 text-[11px] font-bold text-zinc-950 hover:brightness-110"
                  >
                    <Download className="h-3 w-3" />
                    <span>Xuất E-Cert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: TẠO / SỬA GIẢI CHẠY (RESTful) ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-amber-800 dark:text-[#F6E1C3] flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600 dark:text-[#D8B282]" />
                {editingRace ? "Hiệu Chỉnh Giải Chạy" : "Tạo Mới Giải Chạy"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRace} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Tên Giải Chạy <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Huế Heritage Marathon 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Ngày Thi Đấu
                  </label>
                  <input
                    type="date"
                    value={form.race_date}
                    onChange={(e) => setForm({ ...form, race_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Tỉnh / Thành Phố
                  </label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Địa Điểm Xuất Phát
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Độ Cao Gain (m)
                  </label>
                  <input
                    type="number"
                    value={form.elevation_gain_m}
                    onChange={(e) => setForm({ ...form, elevation_gain_m: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isHeritageRun"
                  checked={form.is_heritage_run}
                  onChange={(e) => setForm({ ...form, is_heritage_run: e.target.checked })}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="isHeritageRun" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                  Giải chạy di sản (Heritage Run Flag)
                </label>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Mô Tả Cung Đường & Quy Định Giải
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả các mốc cự ly 5K, 10K, 21K, 42K..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 shadow-md hover:brightness-110"
                >
                  {editingRace ? "Cập Nhật Giải Chạy" : "Khởi Tạo Giải"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CẤP SỐ BIB & RFID ── */}
      {isRunnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-amber-800 dark:text-[#F6E1C3] flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600 dark:text-[#D8B282]" />
                Cấp BIB & Gán Chip RFID
              </h3>
              <button
                onClick={() => setIsRunnerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRunner} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Họ Và Tên Vận Động Viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Quốc Hưng"
                  value={runnerForm.runnerName}
                  onChange={(e) => setRunnerForm({ ...runnerForm, runnerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Số BIB
                  </label>
                  <input
                    type="text"
                    required
                    value={runnerForm.bibNumber}
                    onChange={(e) => setRunnerForm({ ...runnerForm, bibNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Cự Ly Thi Đấu
                  </label>
                  <select
                    value={runnerForm.distanceKm}
                    onChange={(e) => setRunnerForm({ ...runnerForm, distanceKm: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  >
                    <option value={42.195}>42.195 KM (Full)</option>
                    <option value={21.097}>21.097 KM (Half)</option>
                    <option value={10}>10 KM (Challenge)</option>
                    <option value={5}>5 KM (Fun Run)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Đợt Xuất Phát (Wave)
                  </label>
                  <select
                    value={runnerForm.waveStart}
                    onChange={(e) => setRunnerForm({ ...runnerForm, waveStart: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                  >
                    <option value="Wave A (Elite)">Wave A (Elite)</option>
                    <option value="Wave B (Sub 4)">Wave B (Sub 4)</option>
                    <option value="Wave C (Open)">Wave C (Open)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Mã Chip RFID UID
                  </label>
                  <input
                    type="text"
                    value={runnerForm.rfidChipUid}
                    onChange={(e) => setRunnerForm({ ...runnerForm, rfidChipUid: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRunnerModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 shadow-md hover:brightness-110"
                >
                  Xác Nhận Cấp BIB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: BẮN TÍN HIỆU THẢM ĐO RFID ── */}
      {timingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#D8B282]/40 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-amber-800 dark:text-[#F6E1C3] flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-600 dark:text-[#D8B282] animate-pulse" />
                Mô Phỏng Quét Chip Thảm RFID
              </h3>
              <button
                onClick={() => setTimingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateTiming} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Chọn Giải Chạy
                </label>
                <select
                  value={selectedRaceId}
                  onChange={(e) => setSelectedRaceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none"
                >
                  {races.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Số BIB Vận Động Viên
                </label>
                <input
                  type="text"
                  required
                  value={timingForm.bibNumber}
                  onChange={(e) => setTimingForm({ ...timingForm, bibNumber: e.target.value })}
                  placeholder="Ví dụ: 42088"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono font-bold focus:border-[#D8B282] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Trạm Checkpoint Đang Quét
                </label>
                <select
                  value={timingForm.checkpoint}
                  onChange={(e) => setTimingForm({ ...timingForm, checkpoint: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-[#D8B282] focus:outline-none font-semibold"
                >
                  <option value="start">Cổng Xuất Phát (Start Line)</option>
                  <option value="split_5k">Trạm Tiếp Sức Hồ Gươm (5K)</option>
                  <option value="split_10k">Cột Cờ Hà Nội (10K)</option>
                  <option value="split_21k">Cầu Long Biên (Halfway 21K)</option>
                  <option value="finish">Cổng Về Đích (Finish Line)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTimingModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-zinc-950 shadow-md hover:brightness-110 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  Kích Hoạt Quét RFID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW E-CERTIFICATE ── */}
      {selectedCertRunner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-amber-300 dark:border-[#D8B282]/50 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-[#D8B282]">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-800 dark:text-[#F6E1C3]">GIẤY CHỨNG NHẬN HOÀN THÀNH</h3>
              <p className="text-xs text-slate-500">{selectedCertRunner.raceName}</p>
            </div>
            <div className="rounded-xl border border-amber-200 dark:border-slate-800 bg-amber-50/30 dark:bg-slate-950/60 p-4 space-y-2">
              <p className="text-xs text-slate-500">Trao tặng vận động viên</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">{selectedCertRunner.runnerName}</h4>
              <p className="text-xs font-mono font-bold text-amber-700 dark:text-[#D8B282]">BIB #{selectedCertRunner.bibNumber} · CỰ LY {selectedCertRunner.distanceKm} KM</p>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
                02:38:15
              </div>
              <p className="text-[11px] text-slate-400">Pace: 03:45 min/km · Rank: #1</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCertRunner(null)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  toast.success(`Đã tải xuống E-Certificate của BIB #${selectedCertRunner.bibNumber}!`);
                  setSelectedCertRunner(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] to-[#D8B282] px-5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:brightness-110"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải Chứng Nhận PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
