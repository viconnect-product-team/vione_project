import React, { useState, useEffect } from "react";
import {
  Landmark,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  RefreshCw,
  X,
  Compass,
  ExternalLink,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface HeritageSite {
  id: string;
  code: string;
  name: string;
  category: string;
  unesco_status: string;
  latitude: number;
  longitude: number;
  address: string;
  province: string;
  description: string;
  vr360_url?: string;
  thumbnail_url?: string;
  stamps_count: number;
}

export const HeritageAdminManager: React.FC = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<HeritageSite | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "tangible",
    unesco_status: "National Special Relic",
    latitude: 21.0285,
    longitude: 105.8542,
    address: "",
    province: "Hà Nội",
    description: "",
    vr360_url: "",
    thumbnail_url: "",
  });

  const loadSites = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (categoryFilter !== "all") q.append("category", categoryFilter);
      const res = await fetchNestApi<HeritageSite[]>(`/platform-hub/heritage?${q.toString()}`);
      if (Array.isArray(res)) setSites(res);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách di sản văn hóa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, [categoryFilter]);

  const handleOpenModal = (site?: HeritageSite) => {
    if (site) {
      setEditingSite(site);
      setForm({
        name: site.name,
        category: site.category,
        unesco_status: site.unesco_status,
        latitude: site.latitude,
        longitude: site.longitude,
        address: site.address,
        province: site.province,
        description: site.description || "",
        vr360_url: site.vr360_url || "",
        thumbnail_url: site.thumbnail_url || "",
      });
    } else {
      setEditingSite(null);
      setForm({
        name: "",
        category: "tangible",
        unesco_status: "National Special Relic",
        latitude: 21.0285,
        longitude: 105.8542,
        address: "",
        province: "Hà Nội",
        description: "",
        vr360_url: "",
        thumbnail_url: "",
      });
    }
    setModalOpen(true);
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên di sản");
      return;
    }
    try {
      if (editingSite) {
        // PUT /api/platform-hub/heritage/:id
        await fetchNestApi(`/platform-hub/heritage/${editingSite.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật di sản thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/heritage
        await fetchNestApi(`/platform-hub/heritage`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Tạo di sản mới thành công (RESTful POST)");
      }
      setModalOpen(false);
      loadSites();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu di sản");
    }
  };

  const handleDeleteSite = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa di sản "${name}"?`)) return;
    try {
      // DELETE /api/platform-hub/heritage/:id
      await fetchNestApi(`/platform-hub/heritage/${id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa di sản (RESTful DELETE)");
      loadSites();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa di sản");
    }
  };

  const filteredSites = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.province.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "all" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Tất Cả Di Sản ({sites.length})
          </button>
          <button
            onClick={() => setCategoryFilter("tangible")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "tangible" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Vật Thể
          </button>
          <button
            onClick={() => setCategoryFilter("intangible")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "intangible" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Phi Vật Thể
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm di sản, tỉnh thành..."
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
            Thêm Di Sản Mới
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp hồ sơ di sản từ RESTful API...
        </div>
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã Di Sản</th>
                <th className="px-5 py-4">Tên Di Sản Văn Hóa</th>
                <th className="px-5 py-4">Phân Loại & Cấp Độ</th>
                <th className="px-5 py-4">Địa Chỉ & Tỉnh Thành</th>
                <th className="px-5 py-4">Tọa Độ GIS</th>
                <th className="px-5 py-4">Lượt Check-in</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Chưa có hồ sơ di sản nào. Bấm "+ Thêm Di Sản Mới" để tạo.
                  </td>
                </tr>
              ) : (
                filteredSites.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{s.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {s.name}
                        {s.vr360_url && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            VR360
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs mr-2">
                        {s.category === "tangible" ? "Vật thể" : "Phi vật thể"}
                      </span>
                      <span className="text-xs text-gray-400">{s.unesco_status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-200">{s.province}</div>
                      <div className="text-gray-400 truncate max-w-xs">{s.address}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-gray-400">
                      {s.latitude?.toFixed(4)}, {s.longitude?.toFixed(4)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">{s.stamps_count || 0} dấu</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(s)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSite(s.id, s.name)}
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

      {/* Heritage Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#D8B282]" />
                {editingSite ? "Cập Nhật Hồ Sơ Di Sản (RESTful PUT)" : "Thêm Di Sản Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSite} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên di sản *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Quần thể Di tích Cố đô Huế"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Loại hình</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="tangible">Di sản văn hóa vật thể</option>
                    <option value="intangible">Di sản văn hóa phi vật thể</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Cấp độ công nhận</label>
                  <select
                    value={form.unesco_status}
                    onChange={(e) => setForm({ ...form, unesco_status: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="UNESCO World Heritage">Di sản thế giới UNESCO</option>
                    <option value="National Special Relic">Di tích Quốc gia đặc biệt</option>
                    <option value="National Relic">Di tích Quốc gia</option>
                    <option value="Provincial Relic">Di tích cấp Tỉnh / Thành</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Vĩ độ (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Kinh độ (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Link Tham Quan VR360</label>
                <input
                  type="text"
                  value={form.vr360_url}
                  onChange={(e) => setForm({ ...form, vr360_url: e.target.value })}
                  placeholder="https://vr360.vione.vn/tour/..."
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mô tả lịch sử</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Tóm tắt giá trị lịch sử và kiến trúc..."
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
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
                  {editingSite ? "Cập Nhật (PUT)" : "Thêm Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
