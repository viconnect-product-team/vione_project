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
  Headphones,
  Radio,
  FileCheck2,
  Play,
  Pause,
  Volume2,
  Languages,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
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

export interface AudioGuideItem {
  id: string;
  artifactId: string;
  artifactName: string;
  language: "vi" | "en" | "fr";
  duration: string;
  voiceGender: "female" | "male";
  audioUrl: string;
  playCount: number;
  status: "active" | "draft";
}

export interface NfcStationItem {
  id: string;
  uid: string;
  stationName: string;
  roomName: string;
  pedestalNo: string;
  artifactId: string;
  artifactName: string;
  batteryLevel: number;
  tapCount: number;
  status: "online" | "maintenance";
}

export interface ArtifactLendingItem {
  id: string;
  decisionNo: string;
  artifactName: string;
  borrowingMuseum: string;
  purpose: string;
  conservationStatus: "perfect" | "good" | "needs_attention";
  startDate: string;
  dueDate: string;
  approvalStatus: "approved" | "in_transit" | "returned";
}

export const MuseumAdminManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"museums" | "artifacts" | "audioguide" | "nfc_tags" | "lending">(() => {
    if (typeof window !== "undefined") {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "museums" || t === "artifacts" || t === "audioguide" || t === "nfc_tags" || t === "lending") {
        return t as any;
      }
    }
    return "museums";
  });
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncTab = () => {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "museums" || t === "artifacts" || t === "audioguide" || t === "nfc_tags" || t === "lending") {
        setActiveTab(t as any);
      }
    };
    syncTab();
    window.addEventListener("popstate", syncTab);
    return () => window.removeEventListener("popstate", syncTab);
  }, []);

  // Sub-modules state
  const [audioGuides, setAudioGuides] = useState<AudioGuideItem[]>([
    {
      id: "ag-01",
      artifactId: "art-01",
      artifactName: "Trống Đồng Đông Sơn (Bảo vật Quốc gia)",
      language: "vi",
      duration: "03:45",
      voiceGender: "female",
      audioUrl: "https://audio.vione.vn/guides/dong-son-vi.mp3",
      playCount: 1420,
      status: "active",
    },
    {
      id: "ag-02",
      artifactId: "art-01",
      artifactName: "Dong Son Bronze Drum (National Treasure)",
      language: "en",
      duration: "03:10",
      voiceGender: "male",
      audioUrl: "https://audio.vione.vn/guides/dong-son-en.mp3",
      playCount: 890,
      status: "active",
    },
    {
      id: "ag-03",
      artifactId: "art-02",
      artifactName: "Thạp Gốm Hoa Nâu Thời Lý",
      language: "vi",
      duration: "02:30",
      voiceGender: "female",
      audioUrl: "https://audio.vione.vn/guides/thap-gom-ly-vi.mp3",
      playCount: 654,
      status: "active",
    },
  ]);

  const [nfcStations, setNfcStations] = useState<NfcStationItem[]>([
    {
      id: "nfc-01",
      uid: "04:A2:3B:11:89:FA:90",
      stationName: "Trạm Chạm Hiện Vật 01",
      roomName: "Gian Trưng Bày Tiền Sử & Kim Khí",
      pedestalNo: "Bệ kính trung tâm P.102",
      artifactId: "art-01",
      artifactName: "Trống Đồng Đông Sơn",
      batteryLevel: 98,
      tapCount: 3120,
      status: "online",
    },
    {
      id: "nfc-02",
      uid: "04:C5:91:2E:47:66:81",
      stationName: "Trạm Chạm Hiện Vật 02",
      roomName: "Gian Trưng Bày Văn Hóa Đại Việt",
      pedestalNo: "Tủ trưng bày A3",
      artifactId: "art-02",
      artifactName: "Thạp Gốm Hoa Nâu Thời Lý",
      batteryLevel: 92,
      tapCount: 1840,
      status: "online",
    },
  ]);

  const [lendings, setLendings] = useState<ArtifactLendingItem[]>([
    {
      id: "lend-01",
      decisionNo: "QĐ-142/BV-VHL",
      artifactName: "Trống Đồng Đông Sơn (Bản phục dựng cấp 1)",
      borrowingMuseum: "Bảo Tàng Lịch Sử TP. Hồ Chí Minh",
      purpose: "Triển lãm chuyên đề 'Ánh Bình Minh Văn Minh Sông Hồng'",
      conservationStatus: "perfect",
      startDate: "2026-09-01",
      dueDate: "2026-12-31",
      approvalStatus: "approved",
    },
  ]);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

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
        toast.success("Thêm bảo tàng mới thành công (RESTful POST)");
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
      {/* 5 Dimensional Module Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("museums")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "museums"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Building2 className="inline w-4 h-4 mr-1.5" />
            Bảo Tàng Số ({museums.length})
          </button>
          <button
            onClick={() => setActiveTab("artifacts")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "artifacts"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Layers className="inline w-4 h-4 mr-1.5" />
            Hiện Vật 3D ({artifacts.length})
          </button>
          <button
            onClick={() => setActiveTab("audioguide")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "audioguide"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Headphones className="inline w-4 h-4 mr-1.5" />
            Thuyết Minh Audio ({audioGuides.length})
          </button>
          <button
            onClick={() => setActiveTab("nfc_tags")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "nfc_tags"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Radio className="inline w-4 h-4 mr-1.5" />
            Trạm Thẻ NFC ({nfcStations.length})
          </button>
          <button
            onClick={() => setActiveTab("lending")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "lending"
                ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <ArrowRightLeft className="inline w-4 h-4 mr-1.5" />
            Luân Chuyển ({lendings.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          {activeTab === "museums" && (
            <button
              onClick={() => handleOpenMuseumModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Thêm Bảo Tàng
            </button>
          )}

          {activeTab === "artifacts" && (
            <button
              onClick={() => handleOpenArtifactModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Thêm Hiện Vật 3D
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Bảo Tàng Số */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu bảo tàng từ RESTful API...
        </div>
      ) : activeTab === "museums" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Mã</th>
                  <th className="px-5 py-4">Tên Bảo Tàng</th>
                  <th className="px-5 py-4">Địa Chỉ & Tỉnh Thành</th>
                  <th className="px-5 py-4">Giá Vé</th>
                  <th className="px-5 py-4">Giờ Mở Cửa</th>
                  <th className="px-5 py-4">Tour VR360</th>
                  <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMuseums.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      Chưa có bảo tàng nào. Bấm "+ Thêm Bảo Tàng" để tạo mới.
                    </td>
                  </tr>
                ) : (
                  filteredMuseums.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-amber-600 dark:text-[#D8B282]">{m.code}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                      <td className="px-5 py-4 text-xs">
                        <div className="text-slate-900 dark:text-slate-200 font-medium">{m.province}</div>
                        <div className="text-slate-500 dark:text-slate-400 truncate max-w-xs">{m.address}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {Number(m.ticket_price).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">{m.opening_hours}</td>
                      <td className="px-5 py-4 text-xs">
                        {m.virtual_tour_url ? (
                          <a
                            href={m.virtual_tour_url}
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
                          onClick={() => handleOpenMuseumModal(m)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-300 transition-colors"
                          title="Chỉnh sửa (PUT)"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMuseum(m.id, m.name)}
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
      ) : activeTab === "artifacts" ? (
        /* Tab 2: Hiện Vật 3D */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Mã Hiện Vật</th>
                  <th className="px-5 py-4">Tên Hiện Vật</th>
                  <th className="px-5 py-4">Phân Loại & Niên Đại</th>
                  <th className="px-5 py-4">Bảo Vật QG</th>
                  <th className="px-5 py-4">Mã Chip NFC</th>
                  <th className="px-5 py-4">Mô Hình 3D</th>
                  <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredArtifacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      Chưa có hiện vật nào. Bấm "+ Thêm Hiện Vật 3D" để số hóa.
                    </td>
                  </tr>
                ) : (
                  filteredArtifacts.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-amber-600 dark:text-[#D8B282]">{a.code}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{a.name}</td>
                      <td className="px-5 py-4 text-xs">
                        <div className="text-slate-900 dark:text-slate-200 font-medium">{a.dynasty}</div>
                        <div className="text-slate-500 dark:text-slate-400">{a.dating}</div>
                      </td>
                      <td className="px-5 py-4">
                        {a.national_treasure ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                            <Sparkles className="w-3 h-3" /> Bảo Vật QG
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Hiện vật thường</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {a.nfc_uid || "Chưa gắn chip"}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {a.model_3d_url ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Có 3D GLTF
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa dựng 3D</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenArtifactModal(a)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-300 transition-colors"
                          title="Chỉnh sửa (PUT)"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArtifact(a.id, a.name)}
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
      ) : activeTab === "audioguide" ? (
        /* Tab 3: Thuyết Minh Audio Guide */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Tổng bản thuyết minh</span>
                <Languages className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">12 Bản Thu Âm</div>
              <div className="text-xs text-emerald-600 mt-1">Hỗ trợ 3 ngôn ngữ: VI, EN, FR</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Lượt khách đã nghe</span>
                <Volume2 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">2,964 Lượt</div>
              <div className="text-xs text-slate-500 mt-1">Trung bình 2.5 phút / lượt nghe</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Công nghệ phát thanh</span>
                <Sparkles className="w-4 h-4 text-[#D8B282]" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">AI Studio Voice</div>
              <div className="text-xs text-purple-600 mt-1">Giọng đọc Bắc Chuẩn truyền cảm</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-500" />
                Danh Sách Bản Thu Thuyết Minh Số (Audio Guide)
              </h3>
              <button
                onClick={() => toast.success("Mở công cụ thu âm thuyết minh ViOne Studio")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Thu Âm Bản Mới
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Hiện Vật</th>
                  <th className="px-5 py-4">Ngôn Ngữ</th>
                  <th className="px-5 py-4">Thời Lượng</th>
                  <th className="px-5 py-4">Lượt Nghe</th>
                  <th className="px-5 py-4">Trình Phát</th>
                  <th className="px-5 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {audioGuides.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{ag.artifactName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {ag.language}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono">{ag.duration}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-emerald-600">{ag.playCount} lượt</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          if (currentlyPlaying === ag.id) {
                            setCurrentlyPlaying(null);
                          } else {
                            setCurrentlyPlaying(ag.id);
                            toast.info(`Đang nghe thử bản thuyết minh: ${ag.artifactName}`);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentlyPlaying === ag.id
                            ? "bg-amber-500 text-white animate-pulse"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {currentlyPlaying === ag.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {currentlyPlaying === ag.id ? "Đang phát..." : "Nghe thử"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toast.info("Tính năng chỉnh sửa kịch bản thuyết minh")}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-amber-500"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "nfc_tags" ? (
        /* Tab 4: Trạm Thẻ Chip NFC Thực Địa */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  Mạng Lưới Trạm Chip NFC NTAG213 Tại Bệ Trưng Bày Thực Tế
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Khách tham quan dùng smartphone chạm vào bệ hiện vật sẽ mở tức thì bài thuyết minh audio và mô hình 3D xoay 360 độ.
                </p>
              </div>
              <button
                onClick={() => toast.success("Đã mở chế độ quét gán thẻ NFC mới từ đầu đọc USB/Bluetooth")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Gán Chip NFC Bệ Mới
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Mã UID Thẻ NFC</th>
                  <th className="px-5 py-4">Tên Trạm & Gian Phòng</th>
                  <th className="px-5 py-4">Vị Trí Bệ Kính</th>
                  <th className="px-5 py-4">Hiện Vật Liên Kết</th>
                  <th className="px-5 py-4">Pin & Sóng</th>
                  <th className="px-5 py-4">Lượt Chạm</th>
                  <th className="px-5 py-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {nfcStations.map((station) => (
                  <tr key={station.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600 dark:text-[#D8B282]">{station.uid}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{station.stationName}</div>
                      <div className="text-xs text-slate-500">{station.roomName}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium">{station.pedestalNo}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-sky-600 dark:text-sky-400">{station.artifactName}</td>
                    <td className="px-5 py-4 text-xs">
                      <span className="font-mono text-emerald-600 font-bold">{station.batteryLevel}%</span> Pin NTAG Passive
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white text-xs">{station.tapCount.toLocaleString("vi-VN")} chạm</td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Online
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 5: Sổ Luân Chuyển & Mượn Trả Hiện Vật */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-sky-500" />
                  Sổ Theo Dõi Kiểm Kê & Luân Chuyển Hiện Vật Liên Bảo Tàng
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quản lý hồ sơ pháp lý, tình trạng bảo quản hiện trạng và theo dõi thời hạn mượn/trả triển lãm lưu động.
                </p>
              </div>
              <button
                onClick={() => toast.success("Mở biểu mẫu lập phiếu luân chuyển hiện vật")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15]"
              >
                + Lập Phiếu Luân Chuyển
              </button>
            </div>
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-[#D8B282] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Số Quyết Định</th>
                  <th className="px-5 py-4">Hiện Vật Luân Chuyển</th>
                  <th className="px-5 py-4">Đơn Vị Mượn</th>
                  <th className="px-5 py-4">Mục Đích Trưng Bày</th>
                  <th className="px-5 py-4">Thời Hạn</th>
                  <th className="px-5 py-4">Hiện Trạng</th>
                  <th className="px-5 py-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lendings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-600 dark:text-[#D8B282]">{l.decisionNo}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{l.artifactName}</td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">{l.borrowingMuseum}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate">{l.purpose}</td>
                    <td className="px-5 py-4 text-xs font-mono">{l.startDate} → {l.dueDate}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <ShieldCheck className="w-3.5 h-3.5" /> Nguyên Vẹn 100%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                        Đang Mượn
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Museum Modal */}
      {museumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                {editingMuseum ? "Cập Nhật Bảo Tàng (RESTful PUT)" : "Thêm Bảo Tàng Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setMuseumModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMuseum} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên bảo tàng *</label>
                <input
                  type="text"
                  required
                  value={museumForm.name}
                  onChange={(e) => setMuseumForm({ ...museumForm, name: e.target.value })}
                  placeholder="VD: Bảo Tàng Lịch Sử Quốc Gia"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  value={museumForm.address}
                  onChange={(e) => setMuseumForm({ ...museumForm, address: e.target.value })}
                  placeholder="Số 1 Tràng Tiền..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={museumForm.province}
                    onChange={(e) => setMuseumForm({ ...museumForm, province: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Giá vé tham quan (VNĐ)</label>
                  <input
                    type="number"
                    value={museumForm.ticket_price}
                    onChange={(e) => setMuseumForm({ ...museumForm, ticket_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Giờ mở cửa</label>
                  <input
                    type="text"
                    value={museumForm.opening_hours}
                    onChange={(e) => setMuseumForm({ ...museumForm, opening_hours: e.target.value })}
                    placeholder="08:00 - 17:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Link Virtual Tour 3D</label>
                  <input
                    type="text"
                    value={museumForm.virtual_tour_url}
                    onChange={(e) => setMuseumForm({ ...museumForm, virtual_tour_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMuseumModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                {editingArtifact ? "Cập Nhật Hiện Vật 3D (RESTful PUT)" : "Thêm Hiện Vật 3D Mới (RESTful POST)"}
              </h3>
              <button onClick={() => setArtifactModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtifact} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên hiện vật *</label>
                <input
                  type="text"
                  required
                  value={artifactForm.name}
                  onChange={(e) => setArtifactForm({ ...artifactForm, name: e.target.value })}
                  placeholder="VD: Trống Đồng Đông Sơn Cổ"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8B282]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Triều đại</label>
                  <input
                    type="text"
                    value={artifactForm.dynasty}
                    onChange={(e) => setArtifactForm({ ...artifactForm, dynasty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Niên đại</label>
                  <input
                    type="text"
                    value={artifactForm.dating}
                    onChange={(e) => setArtifactForm({ ...artifactForm, dating: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã UID Thẻ NFC</label>
                  <input
                    type="text"
                    value={artifactForm.nfc_uid}
                    onChange={(e) => setArtifactForm({ ...artifactForm, nfc_uid: e.target.value })}
                    placeholder="04:A2:3B:..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="nationalTreasure"
                    checked={artifactForm.national_treasure}
                    onChange={(e) => setArtifactForm({ ...artifactForm, national_treasure: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="nationalTreasure" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Là Bảo Vật Quốc Gia
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Đường dẫn Mô hình 3D (GLTF/USDZ)</label>
                <input
                  type="text"
                  value={artifactForm.model_3d_url}
                  onChange={(e) => setArtifactForm({ ...artifactForm, model_3d_url: e.target.value })}
                  placeholder="https://models.vione.vn/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setArtifactModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
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
