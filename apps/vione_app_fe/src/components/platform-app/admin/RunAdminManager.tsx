import React, { useState, useEffect } from "react";
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

export const RunAdminManager: React.FC = () => {
  const [races, setRaces] = useState<RaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHeritage, setFilterHeritage] = useState<string>("all");

  // Modal
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

  // Timing simulation modal
  const [timingModalOpen, setTimingModalOpen] = useState(false);
  const [timingRace, setTimingRace] = useState<RaceItem | null>(null);
  const [timingForm, setTimingForm] = useState({
    bibNumber: "21088",
    checkpoint: "start" as "start" | "split_5k" | "split_10k" | "split_21k" | "finish",
  });

  const loadRaces = async () => {
    setLoading(true);
    try {
      const q = filterHeritage !== "all" ? `?isHeritageRun=${filterHeritage === "true"}` : "";
      const res = await fetchNestApi<RaceItem[]>(`/platform-hub/run/races${q}`);
      if (Array.isArray(res)) setRaces(res);
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
        // PUT /api/platform-hub/run/races/:id
        await fetchNestApi(`/platform-hub/run/races/${editingRace.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật giải chạy thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/run/races
        await fetchNestApi(`/platform-hub/run/races`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Tạo giải chạy mới thành công (RESTful POST)");
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
      // DELETE /api/platform-hub/run/races/:id
      await fetchNestApi(`/platform-hub/run/races/${id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa giải chạy (RESTful DELETE)");
      loadRaces();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa giải chạy");
    }
  };

  const handleSimulateTiming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timingRace) return;
    try {
      // POST /api/platform-hub/run/timing/simulate-split
      const res: any = await fetchNestApi(`/platform-hub/run/timing/simulate-split`, {
        method: "POST",
        body: JSON.stringify({
          raceId: timingRace.id,
          bibNumber: timingForm.bibNumber,
          checkpoint: timingForm.checkpoint,
        }),
      });
      toast.success(res?.message || "Đã ghi nhận dữ liệu Timing RFID!");
      setTimingModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi mô phỏng timing");
    }
  };

  const filteredRaces = races.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.province.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterHeritage("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filterHeritage === "all" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Tất Cả Giải Chạy ({races.length})
          </button>
          <button
            onClick={() => setFilterHeritage("true")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filterHeritage === "true" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Giải Chạy Di Sản
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giải chạy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-[#D8B282]/20 rounded-xl text-xs text-[#F6E1C3] placeholder-gray-500 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tạo Giải Chạy Mới
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu giải chạy...
        </div>
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
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
            <tbody className="divide-y divide-white/5">
              {filteredRaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Chưa có giải chạy nào. Bấm "+ Tạo Giải Chạy Mới" để thêm.
                  </td>
                </tr>
              ) : (
                filteredRaces.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{r.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">{r.name}</td>
                    <td className="px-5 py-4">
                      {r.is_heritage_run ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
                          Di Sản (Heritage Run)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-medium">
                          Marathon Tiêu Chuẩn
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D8B282]" />
                        {r.race_date ? r.race_date.split("T")[0] : "Chưa định ngày"}
                      </div>
                      <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {r.location}, {r.province}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">+{r.elevation_gain_m}m</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          r.status === "in_progress"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : r.status === "completed"
                            ? "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {r.status === "in_progress"
                          ? "Đang Diễn Ra"
                          : r.status === "completed"
                          ? "Đã Kết Thúc"
                          : "Sắp Khởi Tranh"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setTimingRace(r);
                          setTimingModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors"
                        title="Bắn Timing RFID"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(r)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRace(r.id, r.name)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Xóa (DELETE)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Race Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D8B282]" />
                {editingRace ? "Cập Nhật Giải Chạy (RESTful PUT)" : "Tạo Giải Chạy Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRace} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên giải chạy *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: ViOne Heritage Marathon Thăng Long 2026"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Ngày thi đấu</label>
                  <input
                    type="date"
                    value={form.race_date}
                    onChange={(e) => setForm({ ...form, race_date: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Độ cao Gain (m)</label>
                  <input
                    type="number"
                    value={form.elevation_gain_m}
                    onChange={(e) => setForm({ ...form, elevation_gain_m: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="in_progress">Đang diễn ra</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isHeritageRun"
                    checked={form.is_heritage_run}
                    onChange={(e) => setForm({ ...form, is_heritage_run: e.target.checked })}
                    className="rounded text-[#D8B282] focus:ring-0"
                  />
                  <label htmlFor="isHeritageRun" className="text-gray-300 font-semibold cursor-pointer">
                    Là Giải Chạy Di Sản (Đóng Dấu Số)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingRace ? "Cập Nhật (PUT)" : "Tạo Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Timing RFID Modal */}
      {timingModalOpen && timingRace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                Bắn Chip Timing RFID (Simulate)
              </h3>
              <button onClick={() => setTimingModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Giải: <span className="font-bold text-white">{timingRace.name}</span>
            </p>

            <form onSubmit={handleSimulateTiming} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Số BIB VĐV</label>
                <input
                  type="text"
                  required
                  value={timingForm.bibNumber}
                  onChange={(e) => setTimingForm({ ...timingForm, bibNumber: e.target.value })}
                  placeholder="VD: 21088 hoặc 42195"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Cổng Sensor Thảm RFID</label>
                <select
                  value={timingForm.checkpoint}
                  onChange={(e: any) => setTimingForm({ ...timingForm, checkpoint: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white"
                >
                  <option value="start">Thảm Xuất Phát (Start Line)</option>
                  <option value="split_5k">Trạm Checkpoint 5KM</option>
                  <option value="split_10k">Trạm Checkpoint 10KM</option>
                  <option value="split_21k">Trạm Checkpoint 21KM (Half Marathon)</option>
                  <option value="finish">Thảm Về Đích (Finish Line)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTimingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Ghi Nhận Sensor Thảm (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
