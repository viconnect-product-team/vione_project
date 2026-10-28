import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageKit";
import { HeritageAdminManager } from "@/components/platform-app/admin/HeritageAdminManager";
import { PwaDeviceSimulator } from "@/components/platform-app/PwaDeviceSimulator";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/platform/heritage")({
  component: PlatformHeritagePage,
});

function PlatformHeritagePage() {
  const [viewMode, setViewMode] = useState<"admin" | "preview">("admin");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="ViOne Heritage — Quản Lý & Số Hóa Di Sản Văn Hóa"
            subtitle="Số hóa hồ sơ di sản quốc gia và UNESCO, định vị bản đồ GIS khoanh vùng bảo vệ, tham quan thực tế ảo VR360 và thuyết minh di sản tự động theo tọa độ định vị GPS."
          />
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-[#D8B282]/30 rounded-xl self-start md:self-auto shrink-0 shadow-sm">
            <button
              onClick={() => setViewMode("admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "admin"
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                  : "text-slate-600 dark:text-[#9EABB8] hover:text-slate-900 dark:hover:text-[#F6E1C3] hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Quản Trị CRM (RESTful)
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "preview"
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                  : "text-slate-600 dark:text-[#9EABB8] hover:text-slate-900 dark:hover:text-[#F6E1C3] hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Xem Trước App/PWA
            </button>
          </div>
        </div>

        {viewMode === "admin" ? (
          <HeritageAdminManager />
        ) : (
          <PwaDeviceSimulator
            initialTab="culture"
            initialSubTab="heritage"
            moduleName="ViOne Heritage (Di Sản Văn Hóa)"
          />
        )}
      </div>
    </AppShell>
  );
}
