import React, { useState, useEffect } from "react";
import { Archive, Search, FileText, Calendar, Building, Download, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface ArchiveItem {
  id: string;
  code: string;
  title: string;
  category: string;
  dynasty?: string;
  year?: string;
  summary: string;
  digital_file_url?: string;
  storage_location?: string;
  created_at: string;
}

export const ArchiveViewer: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const loadArchives = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append("search", search);
      if (category !== "all") q.append("category", category);
      const res = await fetchNestApi<ArchiveItem[]>(`/platform-hub/archives?${q.toString()}`);
      if (Array.isArray(res)) setArchives(res);
    } catch (err) {
      console.error("[ArchiveViewer] error:", err);
      toast.error("Không thể tải kho tư liệu số");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, [search, category]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-r from-[#0B0F17] via-[#1A1915] to-[#0B0F17] p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Archive className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Archive Platform • Lưu Trữ Số Tư Liệu, Cổ Vật & Di Sản Ký Ức</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F6E1C3] sm:text-3xl font-serif">
            Kho Tư Liệu Lịch Sử, Sắc Phong Hoàng Gia & Mộc Bản Triều Nguyễn
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Số hóa độ phân giải cao các văn bản cổ, châu bản, sắc phong thếp vàng và di sản ký ức thế giới UNESCO. Bảo tồn vĩnh viễn kho tàng thư tịch cổ của dân tộc trên nền tảng đám mây an toàn.
          </p>
        </div>
      </div>

      {/* Tìm kiếm & Danh mục */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tư liệu, triều đại, niên hiệu..."
            className="w-full rounded-xl border border-[#D8B282]/25 bg-[#0B0F17] py-2.5 pl-10 pr-4 text-xs text-[#F6E1C3] placeholder-muted-foreground focus:border-[#D8B282] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: "Tất Cả Loại Hình" },
            { key: "sac_phong", label: "Sắc Phong Hoàng Gia" },
            { key: "moc_ban", label: "Mộc Bản UNESCO" },
            { key: "van_bia", label: "Văn Bia & Châu Bản" },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat.key
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-bold"
                  : "border border-[#D8B282]/20 bg-[#0B0F17] text-muted-foreground hover:border-[#D8B282]/40 hover:text-[#F6E1C3]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách tư liệu */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
        </div>
      ) : archives.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8B282]/30 bg-[#0B0F17]/60 p-8 text-center">
          <Archive className="h-12 w-12 text-[#D8B282]/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F6E1C3]">Chưa tìm thấy tư liệu phù hợp</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {archives.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D8B282]/30 bg-[#0B0F17] p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-[#D8B282]/60 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#D8B282]/20 border border-[#D8B282]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3] uppercase">
                    {item.category === "sac_phong" ? "Sắc Phong" : "Mộc Bản UNESCO"}
                  </span>
                  <span className="font-mono text-xs text-[#D8B282]">{item.code}</span>
                </div>

                <h3 className="text-base font-bold text-[#F6E1C3] font-serif leading-snug">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[#D8B282]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {item.dynasty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#D8B282]" />
                    {item.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-[#D8B282]" />
                    {item.storage_location}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D8B282]/15 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => toast.info("Đang mở bản số hóa độ phân giải cao...")}
                  className="rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-4 py-2 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Xem Bản Số Hóa PDF</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
