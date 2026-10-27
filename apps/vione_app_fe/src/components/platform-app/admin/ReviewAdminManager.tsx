import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Smartphone,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface ReviewStoreItem {
  id: string;
  store_name: string;
  store_category: string;
  store_address: string;
  nfc_uid: string;
  google_maps_url: string;
  rating: number;
  total_reviews: number;
  reward_voucher: string;
  created_at: string;
}

export const ReviewAdminManager: React.FC = () => {
  const [stores, setStores] = useState<ReviewStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<ReviewStoreItem | null>(null);
  const [form, setForm] = useState({
    store_name: "",
    store_category: "restaurant",
    store_address: "",
    nfc_uid: "",
    google_maps_url: "https://maps.google.com",
    reward_voucher: "VIONE-10K",
  });

  const loadStores = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<ReviewStoreItem[]>(`/platform-hub/reviews/stores`);
      if (Array.isArray(res)) setStores(res);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách trạm NFC đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleOpenModal = (store?: ReviewStoreItem) => {
    if (store) {
      setEditingStore(store);
      setForm({
        store_name: store.store_name,
        store_category: store.store_category,
        store_address: store.store_address,
        nfc_uid: store.nfc_uid,
        google_maps_url: store.google_maps_url,
        reward_voucher: store.reward_voucher || "VIONE-10K",
      });
    } else {
      setEditingStore(null);
      setForm({
        store_name: "",
        store_category: "restaurant",
        store_address: "",
        nfc_uid: "04:" + Math.random().toString(16).substring(2, 8).toUpperCase(),
        google_maps_url: "https://maps.google.com",
        reward_voucher: "VIONE-10K",
      });
    }
    setModalOpen(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.store_name.trim()) {
      toast.error("Vui lòng nhập tên cửa hàng / điểm chạm");
      return;
    }
    try {
      if (editingStore) {
        // PUT /api/platform-hub/reviews/stores/:id
        await fetchNestApi(`/platform-hub/reviews/stores/${editingStore.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật trạm NFC thành công (RESTful PUT)");
      } else {
        // POST /api/platform-hub/reviews/stores
        await fetchNestApi(`/platform-hub/reviews/stores`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Đăng ký trạm NFC mới thành công (RESTful POST)");
      }
      setModalOpen(false);
      loadStores();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu trạm NFC");
    }
  };

  const handleDeleteStore = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa trạm NFC "${name}"?`)) return;
    try {
      // DELETE /api/platform-hub/reviews/stores/:id
      await fetchNestApi(`/platform-hub/reviews/stores/${id}`, { method: "DELETE" });
      toast.success("Đã xóa trạm NFC (RESTful DELETE)");
      loadStores();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa trạm");
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.store_name.toLowerCase().includes(search.toLowerCase()) ||
      s.store_address.toLowerCase().includes(search.toLowerCase()) ||
      s.nfc_uid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#D8B282]" />
            Danh Sách Trạm Chạm NFC ({stores.length} Điểm)
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm điểm chạm NFC..."
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
            Đăng Ký Điểm Chạm NFC
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp danh sách trạm NFC từ RESTful API...
        </div>
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã Chip NFC</th>
                <th className="px-5 py-4">Tên Cửa Hàng / Điểm Chạm</th>
                <th className="px-5 py-4">Ngành Nghề & Địa Chỉ</th>
                <th className="px-5 py-4">Điểm Đánh Giá</th>
                <th className="px-5 py-4">Voucher Tặng Khách</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Chưa có điểm chạm NFC nào. Bấm "+ Đăng Ký Điểm Chạm NFC" để tạo.
                  </td>
                </tr>
              ) : (
                filteredStores.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282] font-bold">{s.nfc_uid}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {s.store_name}
                        {s.google_maps_url && (
                          <a
                            href={s.google_maps_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-amber-400 transition-colors"
                            title="Mở Google Maps"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] mr-1.5">
                        {s.store_category}
                      </span>
                      <span className="text-gray-400">{s.store_address}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {Number(s.rating || 5.0).toFixed(1)}
                        <span className="font-normal text-gray-400">({s.total_reviews} lượt)</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {s.reward_voucher || "Không có"}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(s)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                        title="Chỉnh sửa (PUT)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(s.id, s.store_name)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#D8B282]" />
                {editingStore ? "Cập Nhật Điểm Chạm (RESTful PUT)" : "Đăng Ký Điểm Chạm NFC (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên cửa hàng / Nhà hàng / Điểm di tích *</label>
                <input
                  type="text"
                  required
                  value={form.store_name}
                  onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                  placeholder="VD: Nhà Hàng Cung Đình Huế"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Ngành nghề / Danh mục</label>
                  <select
                    value={form.store_category}
                    onChange={(e) => setForm({ ...form, store_category: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="restaurant">Nhà hàng & Ẩm thực</option>
                    <option value="cafe">Cafe & Đồ uống</option>
                    <option value="hotel">Khách sạn & Lưu trú</option>
                    <option value="heritage">Điểm tham quan di sản</option>
                    <option value="retail">Cửa hàng lưu niệm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Mã UID Thẻ NFC (NTAG213)</label>
                  <input
                    type="text"
                    value={form.nfc_uid}
                    onChange={(e) => setForm({ ...form, nfc_uid: e.target.value })}
                    placeholder="04:A2:3B:..."
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={form.store_address}
                  onChange={(e) => setForm({ ...form, store_address: e.target.value })}
                  placeholder="Số nhà, đường, quận/huyện, tỉnh..."
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Đường dẫn Google Maps Review</label>
                <input
                  type="text"
                  value={form.google_maps_url}
                  onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                  placeholder="https://g.page/r/..."
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mã Voucher Tặng Khách Hàng</label>
                <input
                  type="text"
                  value={form.reward_voucher}
                  onChange={(e) => setForm({ ...form, reward_voucher: e.target.value })}
                  placeholder="VD: VIONE-GIAM-10K"
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white font-mono focus:outline-none"
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
                  {editingStore ? "Cập Nhật (PUT)" : "Đăng Ký (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
