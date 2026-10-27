import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  RefreshCw,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface MuseumItem {
  id: string;
  code: string;
  name: string;
  address: string;
  province: string;
  ticket_price: number;
  opening_hours: string;
  virtual_tour_url?: string;
  description?: string;
  thumbnail_url?: string;
}

export interface ArtifactItem {
  id: string;
  code: string;
  name: string;
  category: string;
  dynasty: string;
  dating: string;
  national_treasure: boolean;
  description?: string;
  model_3d_url?: string;
  image_url?: string;
  nfc_uid?: string;
}

export const MuseumAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"museums" | "artifacts">("museums");
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Museum
  const [museumModalOpen, setMuseumModalOpen] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<MuseumItem | null>(null);
  const [museumForm, setMuseumForm] = useState({
    name: "",
    address: "",
    province: "Hà Nội",
    ticket_price: 50000,
    opening_hours: "08:00 - 17:00",
    virtual_tour_url: "",
    description: "",
    thumbnail_url: "",
  });

  // Modal Artifact
  const [artifactModalOpen, setArtifactModalOpen] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<ArtifactItem | null>(null);
  const [artifactForm, setArtifactForm] = useState({
    name: "",
    category: "ceramic",
    dynasty: "Triều Nguyễn",
    dating: "Thế kỷ 19",
    national_treasure: false,
    description: "",
    model_3d_url: "",
    image_url: "",
    nfc_uid: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        fetchNestApi<MuseumItem[]>(`/platform-hub/museums`),
        fetchNestApi<ArtifactItem[]>(`/platform-hub/artifacts`),
      ]);
      if (Array.isArray(mRes)) setMuseums(mRes);
      if (Array.isArray(aRes)) setArtifacts(aRes);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bảo tàng và hiện vật");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Museum CRUD
  const handleOpenMuseumModal = (item?: MuseumItem) => {
    if (item) {
      setEditingMuseum(item);
      setMuseumForm({
        name: item.name,
        address: item.address,
        province: item.province,
        ticket_price: item.ticket_price,
        opening_hours: item.opening_hours,
        virtual_tour_url: item.virtual_tour_url || "",
        description: item.description || "",
        thumbnail_url: item.thumbnail_url || "",
      });
    } else {
      setEditingMuseum(null);
      setMuseumForm({
        name: "",
        address: "",
        province: "Hà Nội",
        ticket_price: 50000,
        opening_hours: "08:00 - 17:00",
        virtual_tour_url: "",
        description: "",
        thumbnail_url: "",
      });
    }
    setMuseumModalOpen(true);
  };

  const handleSaveMuseum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!museumForm.name.trim()) {
      toast.error("Vui lòng nhập tên bảo tàng");
      return;
    }
    try {
      if (editingMuseum) {
        await fetchNestApi(`/platform-hub/museums/${editingMuseum.id}`, {
          method: "PUT",
          body: JSON.stringify(museumForm),
        });
        toast.success("Cập nhật bảo tàng thành công (RESTful PUT)");
      } else {
        await fetchNestApi(`/platform-hub/museums`, {
          method: "POST",
          body: JSON.stringify(museumForm),
        });
        toast.success("Tạo bảo tàng mới thành công (RESTful POST)");
      }
      setMuseumModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu bảo tàng");
    }
  };

  const handleDeleteMuseum = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bảo tàng "${name}"?`)) return;
    try {
      await fetchNestApi(`/platform-hub/museums/${id}`, { method: "DELETE" });
      toast.success("Đã xóa bảo tàng (RESTful DELETE)");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa bảo tàng");
    }
  };

  // Artifact CRUD
  const handleOpenArtifactModal = (item?: ArtifactItem) => {
    if (item) {
      setEditingArtifact(item);
      setArtifactForm({
        name: item.name,
        category: item.category,
        dynasty: item.dynasty,
        dating: item.dating,
        national_treasure: item.national_treasure,
        description: item.description || "",
        model_3d_url: item.model_3d_url || "",
        image_url: item.image_url || "",
        nfc_uid: item.nfc_uid || "",
      });
    } else {
      setEditingArtifact(null);
      setArtifactForm({
        name: "",
        category: "ceramic",
        dynasty: "Triều Nguyễn",
        dating: "Thế kỷ 19",
        national_treasure: false,
        description: "",
        model_3d_url: "",
        image_url: "",
        nfc_uid: "",
      });
    }
    setArtifactModalOpen(true);
  };

  const handleSaveArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artifactForm.name.trim()) {
      toast.error("Vui lòng nhập tên hiện vật");
      return;
    }
    try {
      if (editingArtifact) {
        await fetchNestApi(`/platform-hub/artifacts/${editingArtifact.id}`, {
          method: "PUT",
          body: JSON.stringify(artifactForm),
        });
        toast.success("Cập nhật hiện vật thành công (RESTful PUT)");
      } else {
        await fetchNestApi(`/platform-hub/artifacts`, {
          method: "POST",
          body: JSON.stringify(artifactForm),
        });
        toast.success("Thêm hiện vật mới thành công (RESTful POST)");
      }
      setArtifactModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu hiện vật");
    }
  };

  const handleDeleteArtifact = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hiện vật "${name}"?`)) return;
    try {
      await fetchNestApi(`/platform-hub/artifacts/${id}`, { method: "DELETE" });
      toast.success("Đã xóa hiện vật (RESTful DELETE)");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa hiện vật");
    }
  };

  const filteredMuseums = museums.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.province.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredArtifacts = artifacts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.dynasty.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("museums")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "museums"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                : "bg-white/5 text-[#E0E6ED] hover:bg-white/10"
            }`}
          >
            <Building2 className="inline w-4 h-4 mr-1.5" />
            Bảo Tàng Số ({museums.length})
          </button>
          <button
            onClick={() => setActiveTab("artifacts")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "artifacts"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                : "bg-white/5 text-[#E0E6ED] hover:bg-white/10"
            }`}
          >
            <Layers className="inline w-4 h-4 mr-1.5" />
            Hiện Vật 3D ({artifacts.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-[#D8B282]/20 rounded-xl text-xs text-[#F6E1C3] placeholder-gray-500 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          <button
            onClick={() => (activeTab === "museums" ? handleOpenMuseumModal() : handleOpenArtifactModal())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "museums" ? "Thêm Bảo Tàng" : "Thêm Hiện Vật 3D"}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu bảo tàng từ RESTful API...
        </div>
      ) : activeTab === "museums" ? (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã</th>
                <th className="px-5 py-4">Tên Bảo Tàng</th>
                <th className="px-5 py-4">Địa Chỉ & Tỉnh Thành</th>
                <th className="px-5 py-4">Giá Vé</th>
                <th className="px-5 py-4">Giờ Mở Cửa</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMuseums.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Chưa có bảo tàng nào. Bấm "+ Thêm Bảo Tàng" để tạo mới.
                  </td>
                </tr>
              ) : (
                filteredMuseums.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{m.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">{m.name}</td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-200">{m.province}</div>
                      <div className="text-gray-400 truncate max-w-xs">{m.address}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">
                      {Number(m.ticket_price).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-300">{m.opening_hours}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenMuseumModal(m)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMuseum(m.id, m.name)}
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
                <th className="px-5 py-4">Mã Hiện Vật</th>
                <th className="px-5 py-4">Tên Hiện Vật</th>
                <th className="px-5 py-4">Triều Đại & Niên Đại</th>
                <th className="px-5 py-4">Bảo Vật Quốc Gia</th>
                <th className="px-5 py-4">Mã Chip NFC</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredArtifacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Chưa có hiện vật nào. Bấm "+ Thêm Hiện Vật 3D" để tạo mới.
                  </td>
                </tr>
              ) : (
                filteredArtifacts.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{a.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {a.name}
                        {a.model_3d_url && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            3D GLTF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-200">{a.dynasty}</div>
                      <div className="text-gray-400">{a.dating}</div>
                    </td>
                    <td className="px-5 py-4">
                      {a.national_treasure ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                          Bảo Vật Quốc Gia
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Hiện vật quý</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">{a.nfc_uid || "Chưa gắn chip"}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenArtifactModal(a)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArtifact(a.id, a.name)}
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

      {/* Museum Modal */}
      {museumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D8B282]" />
                {editingMuseum ? "Cập Nhật Bảo Tàng (RESTful PUT)" : "Tạo Bảo Tàng Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setMuseumModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMuseum} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên bảo tàng *</label>
                <input
                  type="text"
                  required
                  value={museumForm.name}
                  onChange={(e) => setMuseumForm({ ...museumForm, name: e.target.value })}
                  placeholder="VD: Bảo Tàng Cổ Vật Cung Đình Huế"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tỉnh / Thành</label>
                  <input
                    type="text"
                    value={museumForm.province}
                    onChange={(e) => setMuseumForm({ ...museumForm, province: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Giá vé niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    value={museumForm.ticket_price}
                    onChange={(e) => setMuseumForm({ ...museumForm, ticket_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={museumForm.address}
                  onChange={(e) => setMuseumForm({ ...museumForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Giờ mở cửa</label>
                  <input
                    type="text"
                    value={museumForm.opening_hours}
                    onChange={(e) => setMuseumForm({ ...museumForm, opening_hours: e.target.value })}
                    placeholder="08:00 - 17:00"
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Link Virtual Tour 3D</label>
                  <input
                    type="text"
                    value={museumForm.virtual_tour_url}
                    onChange={(e) => setMuseumForm({ ...museumForm, virtual_tour_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMuseumModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingMuseum ? "Cập Nhật (PUT)" : "Thêm Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Artifact Modal */}
      {artifactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D8B282]" />
                {editingArtifact ? "Cập Nhật Hiện Vật 3D (RESTful PUT)" : "Thêm Hiện Vật 3D Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setArtifactModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtifact} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên hiện vật *</label>
                <input
                  type="text"
                  required
                  value={artifactForm.name}
                  onChange={(e) => setArtifactForm({ ...artifactForm, name: e.target.value })}
                  placeholder="VD: Trống Đồng Đông Sơn Cổ"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Triều đại</label>
                  <input
                    type="text"
                    value={artifactForm.dynasty}
                    onChange={(e) => setArtifactForm({ ...artifactForm, dynasty: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Niên đại</label>
                  <input
                    type="text"
                    value={artifactForm.dating}
                    onChange={(e) => setArtifactForm({ ...artifactForm, dating: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Mã UID Thẻ NFC</label>
                  <input
                    type="text"
                    value={artifactForm.nfc_uid}
                    onChange={(e) => setArtifactForm({ ...artifactForm, nfc_uid: e.target.value })}
                    placeholder="04:A2:3B:..."
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white font-mono focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="nationalTreasure"
                    checked={artifactForm.national_treasure}
                    onChange={(e) => setArtifactForm({ ...artifactForm, national_treasure: e.target.checked })}
                    className="rounded text-[#D8B282] focus:ring-0"
                  />
                  <label htmlFor="nationalTreasure" className="text-gray-300 font-semibold cursor-pointer">
                    Là Bảo Vật Quốc Gia
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Đường dẫn Mô hình 3D (GLTF/USDZ)</label>
                <input
                  type="text"
                  value={artifactForm.model_3d_url}
                  onChange={(e) => setArtifactForm({ ...artifactForm, model_3d_url: e.target.value })}
                  placeholder="https://models.vione.vn/..."
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setArtifactModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingArtifact ? "Cập Nhật (PUT)" : "Thêm Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
