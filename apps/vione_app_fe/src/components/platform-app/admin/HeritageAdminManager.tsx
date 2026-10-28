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
  Map,
  ShieldCheck,
  AlertTriangle,
  FolderArchive,
  Eye,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
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

export interface GisProtectionZone {
  id: string;
  siteName: string;
  zoneType: "Zone I (Tuyệt đối)" | "Zone II (Vùng đệm)";
  areaHectares: number;
  coordinatesSummary: string;
  boundaryStatus: "Cắm mốc đầy đủ" | "Đang khảo sát mốc";
  patrolFrequency: string;
}

export interface DigitalArchiveItem {
  id: string;
  siteName: string;
  docTitle: string;
  docType: "Sắc phong" | "Văn bia" | "Thần tích" | "Bản dập Hán Nôm";
  resolution: string;
  ocrStatus: "Đã bóc tách chữ Hán Nôm" | "Đang dịch nghĩa";
  accessLevel: "Công khai" | "Hạn chế nghiên cứu";
}

export interface PreservationMonitorItem {
  id: string;
  siteName: string;
  inspectionDate: string;
  humidityLevel: string;
  structuralRisk: "An toàn" | "Xuống cấp cục bộ" | "Cần trùng tu khẩn cấp";
  estimatedBudget: number;
  restorationStatus: "Đã phê duyệt dự toán" | "Đang thi công" | "Nghiệm thu hoàn tất";
}

export const HeritageAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"heritage_list" | "gis_map" | "archives_vr360" | "preservation">(() => {
    if (typeof window !== "undefined") {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "heritage_list" || t === "gis_map" || t === "archives_vr360" || t === "preservation") {
        return t as any;
      }
    }
    return "heritage_list";
  });
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncTab = () => {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "heritage_list" || t === "gis_map" || t === "archives_vr360" || t === "preservation") {
        setActiveTab(t as any);
      }
    };
    syncTab();
    window.addEventListener("popstate", syncTab);
    return () => window.removeEventListener("popstate", syncTab);
  }, []);

  // Sub-modules state
  const [gisZones, setGisZones] = useState<GisProtectionZone[]>([
    {
      id: "gis-01",
      siteName: "Khu Di Tích Hoàng Thành Thăng Long",
      zoneType: "Zone I (Tuyệt đối)",
      areaHectares: 18.3,
      coordinatesSummary: "21.0345° N, 105.8402° E (Bao bọc bởi đường Hoàng Diệu - Điện Biên Phủ)",
      boundaryStatus: "Cắm mốc đầy đủ",
      patrolFrequency: "Hàng ngày (24/7)",
    },
    {
      id: "gis-02",
      siteName: "Quần Thể Danh Thắng Tràng An",
      zoneType: "Zone II (Vùng đệm)",
      areaHectares: 6026.0,
      coordinatesSummary: "20.2506° N, 105.9084° E (Huyện Hoa Lư, Gia Viễn, Nho Quan)",
      boundaryStatus: "Cắm mốc đầy đủ",
      patrolFrequency: "Tuần tra định kỳ 2 lần/tuần",
    },
  ]);

  const [archives, setArchives] = useState<DigitalArchiveItem[]>([
    {
      id: "arc-01",
      siteName: "Hoàng Thành Thăng Long",
      docTitle: "Sắc phong Cảnh Hưng năm thứ 44 cho Thần Đô Thành Hoàng",
      docType: "Sắc phong",
      resolution: "8K UltraScan (TIFF)",
      ocrStatus: "Đã bóc tách chữ Hán Nôm",
      accessLevel: "Công khai",
    },
    {
      id: "arc-02",
      siteName: "Văn Miếu - Quốc Tử Giám",
      docTitle: "Bản dập Bia Tiến Sĩ Khoa Nhâm Tuất (1442)",
      docType: "Văn bia",
      resolution: "4K Photogrammetry",
      ocrStatus: "Đã bóc tách chữ Hán Nôm",
      accessLevel: "Công khai",
    },
  ]);

  const [preservations, setPreservations] = useState<PreservationMonitorItem[]>([
    {
      id: "pre-01",
      siteName: "Chùa Một Cột (Diên Hựu Tự)",
      inspectionDate: "2026-10-15",
      humidityLevel: "78% (Đạt tiêu chuẩn)",
      structuralRisk: "An toàn",
      estimatedBudget: 350000000,
      restorationStatus: "Nghiệm thu hoàn tất",
    },
    {
      id: "pre-02",
      siteName: "Tháp Bút - Cầu Thê Húc (Đền Ngọc Sơn)",
      inspectionDate: "2026-10-20",
      humidityLevel: "84% (Độ ẩm cao mùa sương)",
      structuralRisk: "Xuống cấp cục bộ",
      estimatedBudget: 850000000,
      restorationStatus: "Đang thi công",
    },
  ]);

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
        await fetchNestApi(`/platform-hub/heritage/${editingSite.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Cập nhật di sản thành công (RESTful PUT)");
      } else {
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
      {/* 4 Dimensional Module Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("heritage_list")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "heritage_list"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Landmark className="inline w-4 h-4 mr-1.5" />
            Hồ Sơ Di Sản ({sites.length})
          </button>
          <button
            onClick={() => setActiveTab("gis_map")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "gis_map"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Map className="inline w-4 h-4 mr-1.5" />
            Khoanh Vùng GIS ({gisZones.length})
          </button>
          <button
            onClick={() => setActiveTab("archives_vr360")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "archives_vr360"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <FolderArchive className="inline w-4 h-4 mr-1.5" />
            Tư Liệu & VR360 ({archives.length})
          </button>
          <button
            onClick={() => setActiveTab("preservation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preservation"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <ShieldCheck className="inline w-4 h-4 mr-1.5" />
            Giám Sát Bảo Tồn ({preservations.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm di sản, tỉnh thành..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          {activeTab === "heritage_list" && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Thêm Di Sản
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Hồ Sơ Di Sản */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu di sản từ RESTful API...
        </div>
      ) : activeTab === "heritage_list" ? (
        <div className="space-y-4">
          {/* Category filter sub-chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                categoryFilter === "all"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Tất Cả ({sites.length})
            </button>
            <button
              onClick={() => setCategoryFilter("tangible")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                categoryFilter === "tangible"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Vật Thể
            </button>
            <button
              onClick={() => setCategoryFilter("intangible")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                categoryFilter === "intangible"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Phi Vật Thể
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Mã</th>
                    <th className="px-5 py-4">Tên Di Sản</th>
                    <th className="px-5 py-4">Phân Loại & Xếp Hạng</th>
                    <th className="px-5 py-4">Tỉnh Thành & Địa Chỉ</th>
                    <th className="px-5 py-4">Tem Check-in</th>
                    <th className="px-5 py-4">Tour VR360</th>
                    <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSites.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        Chưa có di sản nào. Bấm "+ Thêm Di Sản" để tạo mới.
                      </td>
                    </tr>
                  ) : (
                    filteredSites.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-amber-600 dark:text-[#D8B282]">{s.code}</td>
                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="px-5 py-4 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {s.category === "tangible" ? "Vật Thể" : "Phi Vật Thể"}
                          </div>
                          <div className="text-amber-600 dark:text-amber-400">{s.unesco_status}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <div className="font-semibold text-slate-900 dark:text-white">{s.province}</div>
                          <div className="text-slate-500 dark:text-slate-400 truncate max-w-xs">{s.address}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <Award className="w-3.5 h-3.5" /> {s.stamps_count || 0} lượt đóng dấu
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          {s.vr360_url ? (
                            <a
                              href={s.vr360_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Xem VR360
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Chưa có</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(s)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-300 transition-colors"
                            title="Chỉnh sửa (PUT)"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSite(s.id, s.name)}
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
        </div>
      ) : activeTab === "gis_map" ? (
        /* Tab 2: Khoanh Vùng Ranh Giới GIS */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Map className="w-4 h-4 text-sky-500" />
                  Bản Đồ Số Tọa Độ GIS & Ranh Giới Khoanh Vùng Bảo Vệ Di Tích
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Xác lập ranh giới Vùng bảo vệ I (Bất khả xâm phạm) và Vùng bảo vệ II (Vùng cảnh quan phụ cận) theo Luật Di sản văn hóa.
                </p>
              </div>
              <button
                onClick={() => toast.success("Mở công cụ vẽ ranh giới Polygon GIS vệ tinh")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Vẽ Ranh Giới Polygon GIS
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên Di Tích</th>
                  <th className="px-5 py-4">Phân Vùng Bảo Vệ</th>
                  <th className="px-5 py-4">Diện Tích (ha)</th>
                  <th className="px-5 py-4">Tọa Độ Trung Tâm & Ranh Giới</th>
                  <th className="px-5 py-4">Tình Trạng Mốc Giới</th>
                  <th className="px-5 py-4">Tần Suất Giám Sát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gisZones.map((gz) => (
                  <tr key={gz.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{gz.siteName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        {gz.zoneType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600">{gz.areaHectares.toLocaleString("vi-VN")} ha</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-600 dark:text-slate-300 max-w-sm truncate">
                      {gz.coordinatesSummary}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {gz.boundaryStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{gz.patrolFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "archives_vr360" ? (
        /* Tab 3: Tư Liệu & VR360 */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-purple-500" />
                  Kho Tư Liệu Số Hóa Lịch Sử & Tour Thực Tế Ảo VR360
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bản quét độ phân giải siêu cao (8K UltraScan) cho sắc phong, văn bia Hán Nôm và tour VR tương tác toàn cảnh di tích.
                </p>
              </div>
              <button
                onClick={() => toast.success("Mở trình nạp tệp scan tư liệu lịch sử")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Tải Lên Bản Quét Mới
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên Tư Liệu Lịch Sử</th>
                  <th className="px-5 py-4">Di Tích Liên Quan</th>
                  <th className="px-5 py-4">Loại Tư Liệu</th>
                  <th className="px-5 py-4">Độ Phân Giải Scan</th>
                  <th className="px-5 py-4">Bóc Tách Hán Nôm (OCR)</th>
                  <th className="px-5 py-4 text-right">Quyền Truy Cập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {archives.map((arc) => (
                  <tr key={arc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{arc.docTitle}</td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">{arc.siteName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {arc.docType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-emerald-600">{arc.resolution}</td>
                    <td className="px-5 py-4 text-xs">
                      <span className="inline-flex items-center gap-1 text-purple-600 font-medium">
                        <Sparkles className="w-3.5 h-3.5" /> {arc.ocrStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {arc.accessLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 4: Giám Sát Bảo Tồn & Tu Bổ */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Hệ Thống Quan Trắc Xuống Cấp & Quản Lý Dự Toán Tu Bổ Định Kỳ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Đo lường các chỉ số môi trường, độ ẩm gỗ, nguy cơ rêu mốc và giám sát giải ngân nguồn kinh phí bảo tồn di tích.
                </p>
              </div>
              <button
                onClick={() => toast.success("Mở biên bản kiểm định hiện trạng kỹ thuật")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Lập Biên Bản Quan Trắc
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Di Tích Khảo Sát</th>
                  <th className="px-5 py-4">Ngày Quan Trắc Gần Nhất</th>
                  <th className="px-5 py-4">Chỉ Số Độ Ẩm & Môi Trường</th>
                  <th className="px-5 py-4">Nguy Cơ Kết Cấu</th>
                  <th className="px-5 py-4">Dự Toán Tu Bổ (VNĐ)</th>
                  <th className="px-5 py-4 text-right">Tiến Độ Dự Án</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {preservations.map((pre) => (
                  <tr key={pre.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{pre.siteName}</td>
                    <td className="px-5 py-4 text-xs font-mono">{pre.inspectionDate}</td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">{pre.humidityLevel}</td>
                    <td className="px-5 py-4">
                      {pre.structuralRisk === "An toàn" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> An toàn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                          <AlertTriangle className="w-3.5 h-3.5" /> {pre.structuralRisk}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600">
                      {pre.estimatedBudget.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                        {pre.restorationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Heritage Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-500" />
                {editingSite ? "Cập Nhật Hồ Sơ Di Sản (RESTful PUT)" : "Tạo Mới Hồ Sơ Di Sản (RESTful POST)"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên di sản văn hóa *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Quần thể Di tích Cố đô Huế"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Loại hình</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="tangible">Di sản vật thể</option>
                    <option value="intangible">Di sản phi vật thể</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Cấp độ xếp hạng</label>
                  <input
                    type="text"
                    value={form.unesco_status}
                    onChange={(e) => setForm({ ...form, unesco_status: e.target.value })}
                    placeholder="VD: Di sản Thế giới UNESCO"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tọa độ Vĩ độ (Latitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tọa độ Kinh độ (Longitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Link Tham Quan Thực Tế Ảo VR360</label>
                <input
                  type="text"
                  value={form.vr360_url}
                  onChange={(e) => setForm({ ...form, vr360_url: e.target.value })}
                  placeholder="https://vr360.vione.vn/..."
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
                  {editingSite ? "Cập Nhật (PUT)" : "Tạo Mới (POST)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
