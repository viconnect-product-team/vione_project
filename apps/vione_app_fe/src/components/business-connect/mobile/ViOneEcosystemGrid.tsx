import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Contact2,
  Users,
  CalendarDays,
  Trophy,
  Flame,
  Radio,
  Landmark,
  Layers,
  Archive,
  Ticket,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function ViOneEcosystemGrid() {
  const communityModules = [
    {
      id: "bc",
      title: "ViOne Business Connect",
      highlight: "Business Connect",
      sub: "Danh thiếp số & quản trị mối quan hệ",
      icon: Contact2,
      to: "/connect-app/me/card",
    },
    {
      id: "assoc",
      title: "ViOne Association",
      highlight: "Association",
      sub: "Quản trị hiệp hội, câu lạc bộ",
      icon: Users,
      to: "/connect-app/community",
    },
    {
      id: "event",
      title: "ViOne Event",
      highlight: "Event",
      sub: "Sự kiện, hội nghị, triển lãm, check-in",
      icon: CalendarDays,
      to: "/events",
    },
    {
      id: "sport",
      title: "ViOne Sport",
      highlight: "Sport",
      sub: "Giải đấu, câu lạc bộ thể thao",
      icon: Trophy,
      to: "/platform-app?tab=sport",
    },
    {
      id: "run",
      title: "ViOne Run",
      highlight: "Run",
      sub: "Giải chạy, timing RFID, kết quả",
      icon: Flame,
      to: "/platform-app?tab=run",
    },
    {
      id: "review",
      title: "ViOne Review",
      highlight: "Review",
      sub: "Chạm NFC tăng đánh giá cho cửa hàng",
      icon: Radio,
      to: "/platform-app?tab=review",
    },
  ];

  const cultureModules = [
    {
      id: "heritage",
      title: "ViOne Heritage",
      highlight: "Heritage",
      sub: "Quản lý, số hóa di sản văn hóa",
      icon: Landmark,
      to: "/platform-app?tab=heritage",
    },
    {
      id: "museum",
      title: "ViOne Museum",
      highlight: "Museum",
      sub: "Bảo tàng số, trưng bày và thuyết minh",
      icon: Layers,
      to: "/platform-app?tab=museum",
    },
    {
      id: "archive",
      title: "ViOne Archive",
      highlight: "Archive",
      sub: "Lưu trữ số tư liệu, hiện vật",
      icon: Archive,
      to: "/platform-app?tab=archive",
    },
    {
      id: "ticket",
      title: "ViOne Ticket",
      highlight: "Ticket",
      sub: "Bán vé, soát vé điện tử",
      icon: Ticket,
      to: "/platform-app?tab=tickets",
    },
  ];

  return (
    <section aria-labelledby="vione-ecosystem-title" className="mt-6 mb-2">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] p-4 text-white shadow-lg shadow-blue-900/20 border border-blue-400/30">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-28 w-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
            <Sparkles className="h-5 w-5 text-[#F6E1C3] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">ViOne</span>
              <span className="text-[12px] font-semibold text-blue-100">
                Con người, cộng đồng &amp; trải nghiệm
              </span>
            </div>
            <p className="text-[11px] text-blue-200/90 mt-0.5">
              Hệ điều hành số hợp nhất: Doanh nghiệp, Thể thao và Văn hóa di sản quốc gia
            </p>
          </div>
        </div>
      </div>

      {/* Two Pillars Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: CỘNG ĐỒNG & DOANH NGHIỆP */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <h3 className="text-[12px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              CỘNG ĐỒNG &amp; DOANH NGHIỆP
            </h3>
          </div>

          <div className="space-y-2">
            {communityModules.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="group flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-card/80 p-3 shadow-xs transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 active:scale-[0.99]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-[13px] font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span>ViOne </span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">{item.highlight}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: VĂN HÓA & DI SẢN */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            <h3 className="text-[12px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              VĂN HÓA &amp; DI SẢN
            </h3>
          </div>

          <div className="space-y-2">
            {cultureModules.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="group flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-card/80 p-3 shadow-xs transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 active:scale-[0.99]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 dark:bg-blue-600 text-white shadow-md shadow-blue-700/20 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-[13px] font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span>ViOne </span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">{item.highlight}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
