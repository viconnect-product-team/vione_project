import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageKit";
import { RunAdminManager } from "@/components/platform-app/admin/RunAdminManager";
import { RunRaceHub } from "@/components/platform-app/RunRaceHub";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/platform/run")({
  component: PlatformRunPage,
});

function PlatformRunPage() {
  const [viewMode, setViewMode] = useState<"admin" | "preview">("admin");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="ViOne Run — Quản Trị Giải Chạy & Timing RFID"
            subtitle="Hệ thống tổ chức giải marathon/trail, đăng ký cự ly, cấp phát số BIB tự động, đồng bộ thảm chíp Timing RFID, bảng xếp hạng trực tiếp và xuất Finisher e-Certificate."
          />
          <div className="flex items-center gap-2 p-1 bg-[#121820] border border-[#D8B282]/30 rounded-xl self-start md:self-auto shrink-0 shadow-lg">
            <button
              onClick={() => setViewMode("admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "admin"
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md shadow-[#D8B282]/20"
                  : "text-[#9EABB8] hover:text-[#F6E1C3] hover:bg-[#1E2632]"
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
                  : "text-[#9EABB8] hover:text-[#F6E1C3] hover:bg-[#1E2632]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Xem Trước App/PWA
            </button>
          </div>
        </div>

        {viewMode === "admin" ? <RunAdminManager /> : <RunRaceHub />}
      </div>
    </AppShell>
  );
}
