import React from "react";
import { Bell, Trophy, Flame, Ticket, Landmark, Compass, Radio, Archive } from "lucide-react";
import { ViOneLogo } from "../business-connect/mobile/ViOneLogo";

export type PlatformTab = "overview" | "heritage" | "museum" | "sport" | "run" | "tickets" | "archive" | "review";

interface PlatformAppHeaderProps {
  activeTab: PlatformTab;
  onSelectTab: (tab: PlatformTab) => void;
  onOpenCitizenPass?: () => void;
  stampsCount?: number;
}

export const PlatformAppHeader: React.FC<PlatformAppHeaderProps> = ({
  activeTab,
  onSelectTab,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      {/* Top Banner - CHỈ CÓ LOGO VIONE VÀ ICON THÔNG BÁO THEO YÊU CẦU */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <ViOneLogo className="h-6 w-auto" />
        </div>

        {/* Action button: Icon Thông báo */}
        <div className="flex items-center">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-all"
            title="Thông báo"
            aria-label="Thông báo"
          >
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 sm:px-6 no-scrollbar bg-slate-50/60 border-t border-slate-100">
        <div className="flex space-x-1.5 sm:space-x-2 min-w-max pt-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key as PlatformTab)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-sm font-bold scale-[1.02]"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#D8B282]/50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#050C15]" : "text-[#8C653B]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
