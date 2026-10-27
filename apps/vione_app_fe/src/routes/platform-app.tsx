import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Compass,
  Landmark,
  Trophy,
  Flame,
  Ticket,
  Archive,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  Radio,
  ExternalLink,
} from "lucide-react";
import { PlatformAppHeader, type PlatformTab } from "@/components/platform-app/PlatformAppHeader";
import { HeritageExplorer } from "@/components/platform-app/HeritageExplorer";
import { MuseumExplorer } from "@/components/platform-app/MuseumExplorer";
import { SportTournamentHub } from "@/components/platform-app/SportTournamentHub";
import { RunRaceHub } from "@/components/platform-app/RunRaceHub";
import { TicketWallet } from "@/components/platform-app/TicketWallet";
import { ArchiveViewer } from "@/components/platform-app/ArchiveViewer";
import { CitizenPassModal } from "@/components/platform-app/CitizenPassModal";
import { NfcReviewHub } from "@/components/platform-app/NfcReviewHub";

export const Route = createFileRoute("/platform-app")({
  head: () => ({
    meta: [
      { title: "ViConnect Platform — Hệ Sinh Thái Di Sản & Thể Thao Quốc Gia" },
      {
        name: "description",
        content:
          "Bản ứng dụng số hóa di sản văn hóa, bảo tàng số 3D, giải đấu thể thao đa môn và giải chạy phong trào toàn quốc do ViConnect vận hành.",
      },
      { name: "theme-color", content: "#050C15" },
    ],
  }),
  component: PlatformAppPage,
});

function PlatformAppPage() {
  const [activeTab, setActiveTab] = useState<PlatformTab>("overview");
  const [isCitizenPassOpen, setCitizenPassOpen] = useState(false);
  const [stampsCount, setStampsCount] = useState(3);
  const [overviewData, setOverviewData] = useState<any>(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/platform-hub/overview");
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
      }
    } catch (err) {
      console.error("Failed to load platform overview", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050C15] text-[#E2E8F0] selection:bg-[#D8B282]/30 selection:text-[#F6E1C3] flex flex-col font-sans">
      {/* Platform App Header */}
      <PlatformAppHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCitizenPass={() => setCitizenPassOpen(true)}
        stampsCount={stampsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <div className="relative rounded-3xl border border-[#D8B282]/40 bg-gradient-to-br from-[#0F172A] via-[#0A101D] to-[#050C15] p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8B282]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/50 bg-[#D8B282]/10 px-3.5 py-1 text-xs font-bold text-[#F6E1C3]">
                  <Sparkles className="h-4 w-4 text-[#F6E1C3] animate-spin" />
                  <span>HỆ SINH THÁI NỀN TẢNG TRUNG ƯƠNG VICONNECT</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69]">
                  Bảo Tồn Di Sản Dân Tộc & Nâng Tầm Thể Thao Việt Nam
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  Ứng dụng độc lập tích hợp số hóa không gian di tích VR360, bảo tàng số 3D kèm chạm tương tác NFC, bảng đấu thể thao đa môn và hệ thống tính giờ giải chạy RFID thời gian thực.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("heritage")}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-3 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/25 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Landmark className="h-4 w-4" />
                    <span>Khám Phá Di Sản</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("run")}
                    className="flex items-center gap-2 rounded-xl border border-[#D8B282]/40 bg-[#0B0F17]/80 px-5 py-3 text-xs font-bold text-[#F6E1C3] hover:border-[#D8B282] hover:bg-[#D8B282]/10 active:scale-95 transition-all"
                  >
                    <Flame className="h-4 w-4 text-[#D8B282]" />
                    <span>Giải Chạy & Timing RFID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCitizenPassOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-xs font-bold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/50 active:scale-95 transition-all"
                  >
                    <Award className="h-4 w-4" />
                    <span>Hộ Chiếu Công Dân Số</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("heritage")}
                className="group cursor-pointer rounded-2xl border border-[#D8B282]/30 bg-[#0A101D] p-5 hover:border-[#D8B282] hover:shadow-xl hover:shadow-[#D8B282]/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8B282]/10 text-[#F6E1C3] group-hover:scale-110 transition-transform">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#F6E1C3]" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold font-serif text-[#F6E1C3]">
                    {overviewData?.stats?.heritage_sites_count || 12}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Di tích di sản quốc gia</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("museum")}
                className="group cursor-pointer rounded-2xl border border-[#D8B282]/30 bg-[#0A101D] p-5 hover:border-[#D8B282] hover:shadow-xl hover:shadow-[#D8B282]/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8B282]/10 text-[#F6E1C3] group-hover:scale-110 transition-transform">
                    <Layers className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#F6E1C3]" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold font-serif text-[#F6E1C3]">
                    {overviewData?.stats?.museum_artifacts_count || 48}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Bảo vật & Cổ vật số 3D</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("sport")}
                className="group cursor-pointer rounded-2xl border border-[#D8B282]/30 bg-[#0A101D] p-5 hover:border-[#D8B282] hover:shadow-xl hover:shadow-[#D8B282]/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8B282]/10 text-[#F6E1C3] group-hover:scale-110 transition-transform">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#F6E1C3]" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold font-serif text-[#F6E1C3]">
                    {overviewData?.stats?.tournaments_count || 6}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Giải thể thao đa môn</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("run")}
                className="group cursor-pointer rounded-2xl border border-[#D8B282]/30 bg-[#0A101D] p-5 hover:border-[#D8B282] hover:shadow-xl hover:shadow-[#D8B282]/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8B282]/10 text-[#F6E1C3] group-hover:scale-110 transition-transform">
                    <Flame className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#F6E1C3]" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold font-serif text-[#F6E1C3]">
                    {overviewData?.stats?.races_count || 4}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Giải chạy & Hệ thống Timing</div>
                </div>
              </div>
            </div>

            {/* 4 Core Pillars Presentation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#F6E1C3]">
                    4 Trụ Cột Nền Tảng ViConnect Platform
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Kiến trúc phân quyền độc lập, thuộc quản lý trực tiếp của ViConnect
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1: ViOne Heritage */}
                <div className="relative rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#0E1626] to-[#070B14] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        Trụ Cột 1 • Văn Hóa
                      </span>
                      <Landmark className="h-5 w-5 text-[#D8B282]" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#F6E1C3]">ViOne Heritage — Di Sản Số</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Bản đồ số hóa các quần thể di tích quốc gia đặc biệt: Cố đô Huế, Hoàng thành Thăng Long, Phố cổ Hội An. Tích hợp tham quan VR360 toàn cảnh, thuyết minh Audio Guide theo định vị GPS tự động và đóng dấu lưu niệm Hộ chiếu số.
                    </p>
                  </div>
                  <div className="pt-5 flex items-center justify-between">
                    <span className="text-xs text-[#CBD5E1]">VR360 • GPS Audio Guide • Con dấu số</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("heritage")}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Truy cập</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pillar 2: ViOne Museum */}
                <div className="relative rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#0E1626] to-[#070B14] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                        Trụ Cột 2 • Bảo Tàng
                      </span>
                      <Layers className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#F6E1C3]">ViOne Museum — Cổ Vật 3D & NFC</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Không gian bảo tàng số hiện đại tương tác với các bảo vật hoàng gia (Trống đồng Ngọc Lũ, Ngai vàng Triều Nguyễn). Hỗ trợ xoay lật 360 độ chân thực và tương tác 1 chạm NFC tại quầy hiện vật thực tế.
                    </p>
                  </div>
                  <div className="pt-5 flex items-center justify-between">
                    <span className="text-xs text-[#CBD5E1]">Mô hình 3D xoay lật • Chạm NFC thông minh</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("museum")}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Truy cập</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pillar 3: ViOne Sport */}
                <div className="relative rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#0E1626] to-[#070B14] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                        Trụ Cột 3 • Thể Thao
                      </span>
                      <Trophy className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#F6E1C3]">ViOne Sport — Thể Thao Đa Môn</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Cổng điều hành và theo dõi giải đấu: Pickleball Doanh nhân, Bóng đá phong trào, Golf, Tennis. Sơ đồ nhánh đấu trực quan (Tournament Bracket), cập nhật tỉ số trực tiếp từng set và quản lý câu lạc bộ thể thao.
                    </p>
                  </div>
                  <div className="pt-5 flex items-center justify-between">
                    <span className="text-xs text-[#CBD5E1]">Pickleball • Nhánh đấu • Tỉ số trực tiếp</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("sport")}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Truy cập</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pillar 4: ViOne Run */}
                <div className="relative rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#0E1626] to-[#070B14] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                        Trụ Cột 4 • Giải Chạy
                      </span>
                      <Flame className="h-5 w-5 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#F6E1C3]">ViOne Run — Giải Chạy & Timing RFID</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Nền tảng tổ chức giải marathon di sản: đăng ký cự ly (5KM, 10KM, 21KM, 42KM), cấp số BIB tự động, mô phỏng thảm chip RFID tại các trạm kiểm soát, bảng xếp hạng thời gian thực và cấp e-Certificate Finisher.
                    </p>
                  </div>
                  <div className="pt-5 flex items-center justify-between">
                    <span className="text-xs text-[#CBD5E1]">Số BIB tự động • Thảm RFID • E-Certificate</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("run")}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Truy cập</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Companion Modules: Tickets & Archives */}
            <div className="rounded-2xl border border-[#D8B282]/30 bg-[#0B101D] p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab("tickets")}
                  className="cursor-pointer flex items-center gap-4 rounded-xl border border-[#D8B282]/20 bg-[#050C15]/70 p-4 hover:border-[#D8B282]/60 transition-all"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-black">
                    <Ticket className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F6E1C3]">Ví Vé & Soát Vé (ViOne Ticket)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mua vé Napas 24/7 & Cổng soát vé điện tử QR/NFC cho nhân viên.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("review")}
                  className="cursor-pointer flex items-center gap-4 rounded-xl border border-[#D8B282]/20 bg-[#050C15]/70 p-4 hover:border-[#D8B282]/60 transition-all"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-black">
                    <Radio className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F6E1C3]">Chạm NFC Review (ViOne Review)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Chạm thẻ NFC tăng đánh giá 5 sao cho cửa hàng & tặng voucher.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("archive")}
                  className="cursor-pointer flex items-center gap-4 rounded-xl border border-[#D8B282]/20 bg-[#050C15]/70 p-4 hover:border-[#D8B282]/60 transition-all"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] font-black">
                    <Archive className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F6E1C3]">Kho Tư Liệu Số (ViOne Archive)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tra cứu sắc phong, mộc bản, châu bản triều Nguyễn có chứng thực số.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Heritage */}
        {activeTab === "heritage" && <HeritageExplorer />}

        {/* Tab 2: Museum */}
        {activeTab === "museum" && <MuseumExplorer />}

        {/* Tab 3: Sport */}
        {activeTab === "sport" && <SportTournamentHub />}

        {/* Tab 4: Run */}
        {activeTab === "run" && <RunRaceHub />}

        {/* Tab 5: Tickets */}
        {activeTab === "tickets" && <TicketWallet />}

        {/* Tab 6: NFC Review */}
        {activeTab === "review" && <NfcReviewHub />}

        {/* Tab 7: Archive */}
        {activeTab === "archive" && <ArchiveViewer />}
      </main>

      {/* Citizen Passport Modal */}
      <CitizenPassModal
        isOpen={isCitizenPassOpen}
        onClose={() => setCitizenPassOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-[#D8B282]/20 bg-[#02050A] py-6 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#F6E1C3]">VICONNECT PLATFORM HUB</span>
            <span className="text-[#D8B282]">|</span>
            <span>Hệ Thống Quản Trị Cấp Nền Tảng Trung Ương</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Chuẩn Bảo Mật Quốc Gia
            </span>
            <span>Phiên bản 2.6.0 (Cultural & Sport Edition)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
