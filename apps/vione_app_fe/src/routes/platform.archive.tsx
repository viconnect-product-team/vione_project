import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageKit";
import { ArchiveAdminManager } from "@/components/platform-app/admin/ArchiveAdminManager";
import { PwaDeviceSimulator } from "@/components/platform-app/PwaDeviceSimulator";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/platform/archive")({
  component: PlatformArchivePage,
});

function PlatformArchivePage() {
  const [viewMode, setViewMode] = useState<"admin" | "preview">("admin");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="ViOne Archive — Kho Lưu Trữ Số Tư Liệu & Hiện Vật Lịch Sử"
            subtitle="Kho tư liệu lưu trữ số hóa sắc phong hoàng gia, mộc bản triều Nguyễn, châu bản và di sản ký ức thế giới UNESCO có chứng thực số và bản sao điện tử chất lượng cao."
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
          <ArchiveAdminManager />
        ) : (
          <PwaDeviceSimulator
            initialTab="culture"
            initialSubTab="archive"
            moduleName="ViOne Archive (Tư Liệu Số)"
          />
        )}
      </div>
    </AppShell>
  );
}
