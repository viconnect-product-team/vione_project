import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface ArchiveItem {
  id: string;
  code: string;
  title: string;
  category: string;
  dynasty: string;
  year: string;
  summary?: string;
  digital_file_url?: string;
  storage_location?: string;
}

export const ArchiveAdminManager: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<ArchiveItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "moc_ban",
    dynasty: "Triều Nguyễn",
    year: "1802",
    summary: "",
    digital_file_url: "",
    storage_location: "Kho Lưu Trữ Quốc Gia I",
  });

  const loadArchives = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (categoryFilter !== "all") q.append("category", categoryFilter);
      const res = await fetchNestApi<ArchiveItem[]>(`/platform-hub/archives?${q.toString()}`);
      if (Array.isArray(res)) setArchives(res);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải kho tư liệu số");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, [categoryFilter]);

  const handleOpenModal = (item?: ArchiveItem) => {
    if (item) {
      setEditingArchive(item);
      setForm({
        title: item.title,
        category: item.category,
        dynasty: item.dynasty,
        year: item.year,
        summary: item.summary || "",
        digital_file_url: item.digital_file_url || "",
        storage_location: item.storage_location || "Kho Lưu Trữ Quốc Gia I",
      });
    } else {
      setEditingArchive(null);
      setForm({
        title: "",
        category: "moc_ban",
        dynasty: "Triều Nguyễn",
        year: "1802",
        summary: "",
        digital_file_url: "",
        storage_location: "Kho Lưu Trữ Quốc Gia I",
      });
    }
    setModalOpen(true);
  };

  const handleSaveArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tư liệu");
      return;
    }
    try {
      if (editingArchive) {
        // PUT /api/platform-hub/archives/:id
        await fetchNestApi(`/platform-hub/archives/${editingArchive.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật tư liệu thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/archives
        await fetchNestApi(`/platform-hub/archives`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Thêm tư liệu mới thành công (RESTful POST)");
      }
      setModalOpen(false);
      loadArchives();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu tư liệu số");
    }
  };

  const handleDeleteArchive = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tư liệu "${title}"?`)) return;
    try {
      // DELETE /api/platform-hub/archives/:id
      await fetchNestApi(`/platform-hub/archives/${id}`, { method: "DELETE" });
      toast.success("Đã xóa tư liệu (RESTful DELETE)");
      loadArchives();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa tư liệu số");
    }
  };

  const filteredArchives = archives.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.dynasty.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "all" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Tất Cả Tư Liệu ({archives.length})
          </button>
          <button
            onClick={() => setCategoryFilter("moc_ban")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "moc_ban" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Mộc Bản
          </button>
          <button
            onClick={() => setCategoryFilter("sac_phong")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "sac_phong" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Sắc Phong
          </button>
          <button
            onClick={() => setCategoryFilter("chau_ban")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              categoryFilter === "chau_ban" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Châu Bản
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tư liệu..."
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
            Lưu Trữ Tư Liệu Mới
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp kho tư liệu số từ RESTful API...
        </div>
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã Số</th>
                <th className="px-5 py-4">Tên Tư Liệu Lịch Sử</th>
                <th className="px-5 py-4">Thể Loại</th>
                <th className="px-5 py-4">Triều Đại & Niên Hiệu</th>
                <th className="px-5 py-4">Vị Trí Lưu Trữ Vật Lý</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredArchives.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Chưa có tư liệu nào. Bấm "+ Lưu Trữ Tư Liệu Mới" để thêm.
                  </td>
                </tr>
              ) : (
                filteredArchives.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282]">{a.code}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#D8B282] flex-shrink-0" />
                        <div>
                          <div>{a.title}</div>
                          {a.summary && <div className="text-xs text-gray-400 font-normal line-clamp-1">{a.summary}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs">
                        {a.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-200">{a.dynasty}</div>
                      <div className="text-gray-400">Năm {a.year}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{a.storage_location}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(a)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArchive(a.id, a.title)}
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

      {/* Archive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D8B282]" />
                {editingArchive ? "Cập Nhật Tư Liệu (RESTful PUT)" : "Lưu Trữ Tư Liệu Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArchive} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên / Tiêu đề tư liệu *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: Mộc Bản Triều Nguyễn - Khâm Định Việt Sử Thông Giám Cương Mục"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Thể loại tư liệu</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="moc_ban">Mộc Bản Triều Nguyễn</option>
                    <option value="sac_phong">Sắc Phong Hoàng Triều</option>
                    <option value="chau_ban">Châu Bản Cung Đình</option>
                    <option value="van_bia">Văn Bia Lịch Sử</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Triều đại</label>
                  <input
                    type="text"
                    value={form.dynasty}
                    onChange={(e) => setForm({ ...form, dynasty: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Niên hiệu / Năm ban hành</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="VD: Gia Long năm thứ 1 (1802)"
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Vị trí kho lưu trữ vật lý</label>
                  <input
                    type="text"
                    value={form.storage_location}
                    onChange={(e) => setForm({ ...form, storage_location: e.target.value })}
                    placeholder="VD: Kho Lưu Trữ Quốc Gia I - Phòng 3 Kệ 12"
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tóm tắt nội dung văn bản</label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Ghi chú tóm tắt ý nghĩa và nội dung sắc chỉ..."
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
                  {editingArchive ? "Cập Nhật (PUT)" : "Lưu Trữ (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
