import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  MapPin,
  RefreshCw,
  CheckCircle,
  Activity,
  X,
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
  banner_url?: string;
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

export const SportAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tournaments" | "clubs">("tournaments");
  const [tournaments, setTournaments] = useState<SportTournament[]>([]);
  const [clubs, setClubs] = useState<SportClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");

  // Modal Tournaments
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<SportTournament | null>(null);
  const [tourForm, setTourForm] = useState({
    name: "",
    sport_type: "pickleball",
    format: "knockout",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    venue: "Sân Thể Thao ViConnect",
    province: "Hà Nội",
    status: "upcoming",
    teams_count: 16,
    banner_url: "",
  });

  // Modal Clubs
  const [clubModalOpen, setClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<SportClub | null>(null);
  const [clubForm, setClubForm] = useState({
    name: "",
    sport_type: "pickleball",
    leader_name: "",
    members_count: 10,
    venue: "",
    schedule_info: "Tối Thứ 3 - 5 - 7",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const q = sportFilter !== "all" ? `?sportType=${sportFilter}` : "";
      const [tRes, cRes] = await Promise.all([
        fetchNestApi<SportTournament[]>(`/platform-hub/sport/tournaments${q}`),
        fetchNestApi<SportClub[]>(`/platform-hub/sport/clubs${q}`),
      ]);
      if (Array.isArray(tRes)) setTournaments(tRes);
      if (Array.isArray(cRes)) setClubs(cRes);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách giải đấu thể thao");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sportFilter]);

  // RESTful Tournaments CRUD
  const handleOpenTourModal = (item?: SportTournament) => {
    if (item) {
      setEditingTour(item);
      setTourForm({
        name: item.name,
        sport_type: item.sport_type,
        format: item.format,
        start_date: item.start_date ? item.start_date.split("T")[0] : "",
        end_date: item.end_date ? item.end_date.split("T")[0] : "",
        venue: item.venue,
        province: item.province,
        status: item.status,
        teams_count: item.teams_count,
        banner_url: item.banner_url || "",
      });
    } else {
      setEditingTour(null);
      setTourForm({
        name: "",
        sport_type: "pickleball",
        format: "knockout",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        venue: "Sân Thể Thao ViConnect",
        province: "Hà Nội",
        status: "upcoming",
        teams_count: 16,
        banner_url: "",
      });
    }
    setTourModalOpen(true);
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourForm.name.trim()) {
      toast.error("Vui lòng nhập tên giải đấu");
      return;
    }
    try {
      if (editingTour) {
        // PUT /api/platform-hub/sport/tournaments/:id
        await fetchNestApi(`/platform-hub/sport/tournaments/${editingTour.id}`, {
          method: "PUT",
          body: JSON.stringify(tourForm),
        });
        toast.success("Cập nhật giải đấu thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/sport/tournaments
        await fetchNestApi(`/platform-hub/sport/tournaments`, {
          method: "POST",
          body: JSON.stringify(tourForm),
        });
        toast.success("Tạo giải đấu mới thành công (RESTful POST)");
      }
      setTourModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu giải đấu");
    }
  };

  const handleDeleteTour = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa giải đấu "${name}"?`)) return;
    try {
      // DELETE /api/platform-hub/sport/tournaments/:id
      await fetchNestApi(`/platform-hub/sport/tournaments/${id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa giải đấu (RESTful DELETE)");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa giải đấu");
    }
  };

  // RESTful Clubs CRUD
  const handleOpenClubModal = (item?: SportClub) => {
    if (item) {
      setEditingClub(item);
      setClubForm({
        name: item.name,
        sport_type: item.sport_type,
        leader_name: item.leader_name,
        members_count: item.members_count,
        venue: item.venue || "",
        schedule_info: item.schedule_info || "",
      });
    } else {
      setEditingClub(null);
      setClubForm({
        name: "",
        sport_type: "pickleball",
        leader_name: "",
        members_count: 10,
        venue: "",
        schedule_info: "Tối Thứ 3 - 5 - 7",
      });
    }
    setClubModalOpen(true);
  };

  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubForm.name.trim()) {
      toast.error("Vui lòng nhập tên CLB");
      return;
    }
    try {
      if (editingClub) {
        // PUT /api/platform-hub/sport/clubs/:id
        await fetchNestApi(`/platform-hub/sport/clubs/${editingClub.id}`, {
          method: "PUT",
          body: JSON.stringify(clubForm),
        });
        toast.success("Cập nhật CLB thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/sport/clubs
        await fetchNestApi(`/platform-hub/sport/clubs`, {
          method: "POST",
          body: JSON.stringify(clubForm),
        });
        toast.success("Tạo CLB mới thành công (RESTful POST)");
      }
      setClubModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu CLB");
    }
  };

  const handleDeleteClub = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa CLB "${name}"?`)) return;
    try {
      // DELETE /api/platform-hub/sport/clubs/:id
      await fetchNestApi(`/platform-hub/sport/clubs/${id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa CLB (RESTful DELETE)");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa CLB");
    }
  };

  const filteredTournaments = tournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.province.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.leader_name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "tournaments"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                : "bg-white/5 text-[#E0E6ED] hover:bg-white/10"
            }`}
          >
            <Trophy className="inline w-4 h-4 mr-1.5" />
            Quản Lý Giải Đấu ({tournaments.length})
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "clubs"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                : "bg-white/5 text-[#E0E6ED] hover:bg-white/10"
            }`}
          >
            <Users className="inline w-4 h-4 mr-1.5" />
            Mạng Lưới CLB ({clubs.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giải đấu, CLB..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-[#D8B282]/20 rounded-xl text-xs text-[#F6E1C3] placeholder-gray-500 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          <button
            onClick={() => (activeTab === "tournaments" ? handleOpenTourModal() : handleOpenClubModal())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "tournaments" ? "Tạo Giải Đấu" : "Thêm CLB Mới"}
          </button>
        </div>
      </div>

      {/* Main Content Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu từ RESTful API...
        </div>
      ) : activeTab === "tournaments" ? (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã Giải</th>
                <th className="px-5 py-4">Tên Giải Đấu</th>
                <th className="px-5 py-4">Môn & Thể Thức</th>
                <th className="px-5 py-4">Thời Gian & Địa Điểm</th>
                <th className="px-5 py-4">Số Đội</th>
                <th className="px-5 py-4">Trạng Thái</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTournaments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Chưa có giải đấu thể thao nào. Bấm "+ Tạo Giải Đấu" để thêm mới.
                  </td>
                </tr>
              ) : (
                filteredTournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{t.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">{t.name}</td>
                    <td className="px-5 py-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs mr-2">
                        {t.sport_type}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{t.format}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D8B282]" />
                        {t.start_date?.split("T")[0]}
                      </div>
                      <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {t.venue}, {t.province}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">{t.teams_count} đội</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          t.status === "in_progress"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : t.status === "completed"
                            ? "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {t.status === "in_progress"
                          ? "Đang Diễn Ra"
                          : t.status === "completed"
                          ? "Đã Kết Thúc"
                          : "Sắp Diễn Ra"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenTourModal(t)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(t.id, t.name)}
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
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã CLB</th>
                <th className="px-5 py-4">Tên Câu Lạc Bộ</th>
                <th className="px-5 py-4">Bộ Môn</th>
                <th className="px-5 py-4">Chủ Nhiệm</th>
                <th className="px-5 py-4">Thành Viên</th>
                <th className="px-5 py-4">Lịch Sinh Hoạt</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Chưa có CLB nào. Bấm "+ Thêm CLB Mới" để tạo.
                  </td>
                </tr>
              ) : (
                filteredClubs.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{c.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">{c.name}</td>
                    <td className="px-5 py-4 capitalize text-blue-300">{c.sport_type}</td>
                    <td className="px-5 py-4 text-gray-200">{c.leader_name}</td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">{c.members_count} hội viên</td>
                    <td className="px-5 py-4 text-xs text-gray-400">{c.schedule_info || "Liên hệ CLB"}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenClubModal(c)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(c.id, c.name)}
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

      {/* Tour Modal Form */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D8B282]" />
                {editingTour ? "Cập Nhật Giải Đấu (RESTful PUT)" : "Tạo Giải Đấu Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setTourModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên giải đấu *</label>
                <input
                  type="text"
                  required
                  value={tourForm.name}
                  onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                  placeholder="VD: Cúp Pickleball Doanh Nghiệp ViConnect 2026"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Môn thể thao</label>
                  <select
                    value={tourForm.sport_type}
                    onChange={(e) => setTourForm({ ...tourForm, sport_type: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="pickleball">Pickleball</option>
                    <option value="football">Bóng Đá</option>
                    <option value="tennis">Quần Vợt (Tennis)</option>
                    <option value="golf">Golf Doanh Nhân</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Thể thức thi đấu</label>
                  <select
                    value={tourForm.format}
                    onChange={(e) => setTourForm({ ...tourForm, format: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="knockout">Loại trực tiếp (Knockout)</option>
                    <option value="round_robin">Vòng bảng (Round Robin)</option>
                    <option value="double_elimination">Nhánh thắng - Nhánh thua</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={tourForm.start_date}
                    onChange={(e) => setTourForm({ ...tourForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={tourForm.end_date}
                    onChange={(e) => setTourForm({ ...tourForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Địa điểm tổ chức</label>
                  <input
                    type="text"
                    value={tourForm.venue}
                    onChange={(e) => setTourForm({ ...tourForm, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={tourForm.province}
                    onChange={(e) => setTourForm({ ...tourForm, province: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Số đội tham gia</label>
                  <input
                    type="number"
                    min={2}
                    value={tourForm.teams_count}
                    onChange={(e) => setTourForm({ ...tourForm, teams_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Trạng thái</label>
                  <select
                    value={tourForm.status}
                    onChange={(e) => setTourForm({ ...tourForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="in_progress">Đang diễn ra</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTourModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingTour ? "Cập Nhật (PUT)" : "Tạo Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Club Modal Form */}
      {clubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D8B282]" />
                {editingClub ? "Cập Nhật CLB (RESTful PUT)" : "Thêm CLB Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setClubModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClub} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên CLB Thể Thao *</label>
                <input
                  type="text"
                  required
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                  placeholder="VD: CLB Pickleball CEO ViOne"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Bộ môn</label>
                  <select
                    value={clubForm.sport_type}
                    onChange={(e) => setClubForm({ ...clubForm, sport_type: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="pickleball">Pickleball</option>
                    <option value="football">Bóng Đá</option>
                    <option value="tennis">Tennis</option>
                    <option value="golf">Golf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Số thành viên</label>
                  <input
                    type="number"
                    min={1}
                    value={clubForm.members_count}
                    onChange={(e) => setClubForm({ ...clubForm, members_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Chủ nhiệm CLB</label>
                <input
                  type="text"
                  value={clubForm.leader_name}
                  onChange={(e) => setClubForm({ ...clubForm, leader_name: e.target.value })}
                  placeholder="Họ tên người phụ trách"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Lịch sinh hoạt</label>
                <input
                  type="text"
                  value={clubForm.schedule_info}
                  onChange={(e) => setClubForm({ ...clubForm, schedule_info: e.target.value })}
                  placeholder="VD: 18h - 20h Thứ 3, 5, 7 hàng tuần"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setClubModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingClub ? "Cập Nhật (PUT)" : "Thêm Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
