import React from "react";
import { Sparkles, Compass, Landmark, Trophy, Flame, Ticket, Archive, Award, Radio } from "lucide-react";

export type PlatformTab = "overview" | "heritage" | "museum" | "sport" | "run" | "tickets" | "archive" | "review";

interface PlatformAppHeaderProps {
  activeTab: PlatformTab;
  onSelectTab: (tab: PlatformTab) => void;
  onOpenCitizenPass: () => void;
  stampsCount?: number;
}

export const PlatformAppHeader: React.FC<PlatformAppHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCitizenPass,
  stampsCount = 0,
}) => {
  const tabs = [
    { key: "overview", label: "Tổng Quan", icon: Compass },
    { key: "heritage", label: "Di Sản Văn Hóa", icon: Landmark },
    { key: "museum", label: "Bảo Tàng Số 3D", icon: Landmark },
    { key: "sport", label: "Thể Thao Đa Môn", icon: Trophy },
    { key: "run", label: "Giải Chạy & Timing", icon: Flame },
    { key: "tickets", label: "Ví Vé & Soát Vé", icon: Ticket },
    { key: "review", label: "NFC Review", icon: Radio },
    { key: "archive", label: "Kho Tư Liệu Số", icon: Archive },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8B282]/25 bg-[#050C15]/95 backdrop-blur-md shadow-2xl transition-all">
      {/* Top Banner */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] p-[2px] shadow-lg shadow-[#D8B282]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#050C15]">
              <Sparkles className="h-5 w-5 text-[#F6E1C3] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-lg uppercase font-serif">
                ViConnect Platform
              </span>
              <span className="rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F6E1C3]">
                Hệ Sinh Thái Nền Tảng
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Văn Hóa & Di Sản Quốc Gia • Thể Thao & Giải Chạy Phong Trào
            </p>
          </div>
        </div>

        {/* Action button: Hộ chiếu công dân số */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCitizenPass}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3.5 py-1.5 text-xs font-bold text-[#050C15] shadow-md shadow-[#D8B282]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Award className="h-4 w-4 text-[#050C15]" />
            <span>Hộ Chiếu Công Dân Số</span>
            {stampsCount > 0 && (
              <span className="rounded-full bg-[#050C15] px-1.5 py-0.2 text-[10px] text-[#F6E1C3]">
                {stampsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 sm:px-6 no-scrollbar">
        <div className="flex space-x-1.5 sm:space-x-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key as PlatformTab)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-lg shadow-[#D8B282]/25 font-bold scale-[1.02]"
                    : "border border-[#D8B282]/20 bg-[#0B0F17]/80 text-[#E2E8F0] hover:border-[#D8B282]/40 hover:text-[#F6E1C3]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#050C15]" : "text-[#D8B282]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
