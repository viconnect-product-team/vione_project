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
  GitBranch,
  BarChart3,
  MessageSquareWarning,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
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

export interface SmartRoutingRule {
  id: string;
  ruleName: string;
  starThreshold: string;
  targetDestination: string;
  actionSummary: string;
  alertManager: boolean;
  active: boolean;
}

export interface ReviewCampaignItem {
  id: string;
  campaignName: string;
  voucherCode: string;
  discountValue: string;
  minOrderValue: number;
  totalIssued: number;
  totalRedeemed: number;
  status: "active" | "expired";
}

export interface ReviewAnalyticsSummary {
  totalTaps: number;
  tapsToday: number;
  positiveReviews: number;
  interceptedComplaints: number;
  avgRating: number;
}

export const ReviewAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stations" | "routing" | "incentives" | "analytics">("stations");
  const [stores, setStores] = useState<ReviewStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Sub-modules state
  const [routingRules, setRoutingRules] = useState<SmartRoutingRule[]>([
    {
      id: "rule-01",
      ruleName: "Khách khen ngợi (4 - 5 Sao)",
      starThreshold: "⭐⭐⭐⭐ - ⭐⭐⭐⭐⭐ (Hài lòng)",
      targetDestination: "Google Maps Review URL",
      actionSummary: "Tự động mở app Google Maps của khách và điền sẵn lời khen gợi ý",
      alertManager: false,
      active: true,
    },
    {
      id: "rule-02",
      ruleName: "Khách phản ánh (1 - 3 Sao)",
      starThreshold: "⭐ - ⭐⭐⭐ (Chưa hài lòng)",
      targetDestination: "Biểu Mẫu Góp Ý Kín Quản Lý (Private Feedback)",
      actionSummary: "Chặn không đăng lên Google Maps; gửi tin nhắn cảnh báo SOS tức thì cho Quản lý",
      alertManager: true,
      active: true,
    },
  ]);

  const [campaigns, setCampaignss] = useState<ReviewCampaignItem[]>([
    {
      id: "cam-01",
      campaignName: "Tri Ân Khách Chạm NFC Review Mùa Lễ",
      voucherCode: "VIONE-THANKYOU-20K",
      discountValue: "20.000 VNĐ",
      minOrderValue: 100000,
      totalIssued: 450,
      totalRedeemed: 320,
      status: "active",
    },
    {
      id: "cam-02",
      campaignName: "Tặng Ly Trà Thảo Mộc Đánh Giá 5 Sao",
      voucherCode: "FREE-HERBAL-TEA",
      discountValue: "Tặng 1 đồ uống",
      minOrderValue: 50000,
      totalIssued: 890,
      totalRedeemed: 670,
      status: "active",
    },
  ]);

  const [analytics] = useState<ReviewAnalyticsSummary>({
    totalTaps: 4280,
    tapsToday: 135,
    positiveReviews: 1240,
    interceptedComplaints: 28,
    avgRating: 4.9,
  });

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
        await fetchNestApi(`/platform-hub/reviews/stores/${editingStore.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật trạm NFC thành công (RESTful PUT)");
      } else {
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
      {/* 4 Dimensional Module Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("stations")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "stations"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Smartphone className="inline w-4 h-4 mr-1.5" />
            Trạm Thẻ NFC ({stores.length})
          </button>
          <button
            onClick={() => setActiveTab("routing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "routing"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <GitBranch className="inline w-4 h-4 mr-1.5" />
            Điều Hướng Thông Minh
          </button>
          <button
            onClick={() => setActiveTab("incentives")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "incentives"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Gift className="inline w-4 h-4 mr-1.5" />
            Chiến Dịch Voucher ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="inline w-4 h-4 mr-1.5" />
            Báo Cáo Tăng Trưởng
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm điểm chạm NFC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          {activeTab === "stations" && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Đăng Ký Trạm Mới
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Danh Sách Trạm Thẻ NFC */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu trạm NFC từ RESTful API...
        </div>
      ) : activeTab === "stations" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên Cửa Hàng / Điểm Chạm</th>
                  <th className="px-5 py-4">Mã Chip NFC UID</th>
                  <th className="px-5 py-4">Địa Chỉ</th>
                  <th className="px-5 py-4">Đánh Giá Google</th>
                  <th className="px-5 py-4">Voucher Tri Ân</th>
                  <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      Chưa có trạm NFC nào. Bấm "+ Đăng Ký Trạm Mới" để kích hoạt thẻ.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{s.store_name}</div>
                        <div className="text-xs text-slate-500 capitalize">{s.store_category}</div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600 dark:text-[#D8B282]">
                        {s.nfc_uid}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate">{s.store_address}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{s.rating || 5.0}</span>
                          <span className="text-slate-400 font-normal">({s.total_reviews || 0} reviews)</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                          <Gift className="w-3 h-3" /> {s.reward_voucher || "VIONE-10K"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {s.google_maps_url && (
                          <a
                            href={s.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:underline"
                            title="Mở link Google Maps"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenModal(s)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-300 transition-colors"
                          title="Chỉnh sửa (PUT)"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStore(s.id, s.store_name)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
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
        </div>
      ) : activeTab === "routing" ? (
        /* Tab 2: Điều Hướng Thông Minh Smart Review Routing */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
                Cơ chế lọc phễu thông minh (Negative Feedback Interception):
              </strong>
              Khi khách hàng chạm điện thoại vào thẻ NFC ViOne, hệ thống hiển thị màn hình chọn số sao. Đánh giá 4-5 sao sẽ mở thẳng Google Maps để nhận review công khai. Đánh giá 1-3 sao sẽ chuyển sang màn hình gửi góp ý bí mật cho Quản lý cửa hàng kèm cảnh báo SOS khẩn cấp, giúp xử lý êm đẹp trước khi khách đăng bài tiêu cực lên mạng xã hội.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-500" />
                Cấu Hình Quy Tắc Điều Hướng Đánh Giá Khách Hàng
              </h3>
              <button
                onClick={() => toast.success("Đã lưu quy tắc điều hướng thông minh")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                Lưu Cấu Hình
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên Kịch Bản</th>
                  <th className="px-5 py-4">Ngưỡng Số Sao</th>
                  <th className="px-5 py-4">Đích Đến Tiếp Theo</th>
                  <th className="px-5 py-4">Mô Tả Luồng Xử Lý</th>
                  <th className="px-5 py-4">Báo Động Khẩn (SOS)</th>
                  <th className="px-5 py-4 text-right">Kích Hoạt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {routingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{rule.ruleName}</td>
                    <td className="px-5 py-4 text-xs font-bold text-amber-600">{rule.starThreshold}</td>
                    <td className="px-5 py-4 text-xs font-medium text-sky-600 dark:text-sky-400">{rule.targetDestination}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-xs">{rule.actionSummary}</td>
                    <td className="px-5 py-4 text-xs">
                      {rule.alertManager ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" /> Telegram SOS + SMS
                        </span>
                      ) : (
                        <span className="text-slate-400">Không cần</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Đang Bật
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "incentives" ? (
        /* Tab 3: Chiến Dịch Voucher Tri Ân */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-500" />
                  Quản Lý Chiến Dịch Phát Hành Mã Voucher Thưởng Sau Review
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tự động hiển thị voucher quà tặng có mã QR cho khách ngay sau khi khách ấn gửi đánh giá qua thẻ NFC.
                </p>
              </div>
              <button
                onClick={() => toast.success("Mở biểu mẫu tạo chiến dịch voucher mới")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Tạo Chiến Dịch Mới
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên Chiến Dịch</th>
                  <th className="px-5 py-4">Mã Voucher</th>
                  <th className="px-5 py-4">Mức Giảm / Quà Tặng</th>
                  <th className="px-5 py-4">Đã Phát Hành</th>
                  <th className="px-5 py-4">Đã Dùng Tại Quầy</th>
                  <th className="px-5 py-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {campaigns.map((cam) => (
                  <tr key={cam.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{cam.campaignName}</td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600 dark:text-[#D8B282]">{cam.voucherCode}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-emerald-600">{cam.discountValue}</td>
                    <td className="px-5 py-4 font-mono text-xs">{cam.totalIssued.toLocaleString("vi-VN")} mã</td>
                    <td className="px-5 py-4 font-mono text-xs text-sky-600 font-bold">{cam.totalRedeemed.toLocaleString("vi-VN")} mã</td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Đang Chạy
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 4: Báo Cáo Tăng Trưởng & Chỉ Số CSAT */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Tổng Lượt Chạm NFC</span>
                <Smartphone className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.totalTaps.toLocaleString("vi-VN")}
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">+{analytics.tapsToday} lượt hôm nay</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Đánh Giá 5 Sao Đã Tạo</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-500">{analytics.positiveReviews.toLocaleString("vi-VN")}</div>
              <div className="text-xs text-slate-500 mt-1">Tỷ lệ chuyển đổi đạt 88.5%</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Khiếu Nại Đã Chặn Thành Công</span>
                <MessageSquareWarning className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-rose-500">{analytics.interceptedComplaints} vụ việc</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">100% xử lý êm đẹp tại quầy</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Điểm Đánh Giá Trung Bình</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.avgRating} / 5.0</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">Top 1 ngành hàng khu vực</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Store NFC */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-500" />
                {editingStore ? "Cập Nhật Trạm NFC (RESTful PUT)" : "Kích Hoạt Trạm NFC Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên cửa hàng / quầy thu ngân *</label>
                <input
                  type="text"
                  required
                  value={form.store_name}
                  onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                  placeholder="VD: Nhà Hàng Hoàng Gia - Bàn 12"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Loại hình kinh doanh</label>
                  <select
                    value={form.store_category}
                    onChange={(e) => setForm({ ...form, store_category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="restaurant">Nhà hàng / Ẩm thực</option>
                    <option value="cafe">Quán Cafe / Đồ uống</option>
                    <option value="hotel">Khách sạn / Lưu trú</option>
                    <option value="retail">Cửa hàng bán lẻ / Quà tặng</option>
                    <option value="tourism">Điểm tham quan / Di tích</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã UID Thẻ NFC NTAG213</label>
                  <input
                    type="text"
                    value={form.nfc_uid}
                    onChange={(e) => setForm({ ...form, nfc_uid: e.target.value })}
                    placeholder="04:A2:3B:..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  value={form.store_address}
                  onChange={(e) => setForm({ ...form, store_address: e.target.value })}
                  placeholder="Số 45 Tràng Tiền, Hoàn Kiếm, Hà Nội"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Đường dẫn Google Maps Review</label>
                <input
                  type="text"
                  value={form.google_maps_url}
                  onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                  placeholder="https://g.page/r/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã Voucher Tri Ân Tặng Kèm</label>
                <input
                  type="text"
                  value={form.reward_voucher}
                  onChange={(e) => setForm({ ...form, reward_voucher: e.target.value })}
                  placeholder="VD: VIONE-THANKYOU-20K"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  {editingStore ? "Cập Nhật (PUT)" : "Kích Hoạt (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
