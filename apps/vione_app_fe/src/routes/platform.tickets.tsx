import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageKit";
import { TicketAdminManager } from "@/components/platform-app/admin/TicketAdminManager";
import { TicketWallet } from "@/components/platform-app/TicketWallet";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/platform/tickets")({
  component: PlatformTicketsPage,
});

function PlatformTicketsPage() {
  const [viewMode, setViewMode] = useState<"admin" | "preview">("admin");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="ViOne Ticket — Phát Hành Vé & Cổng Soát Vé Điện Tử"
            subtitle="Phát hành vé điện tử cho di tích, bảo tàng, giải chạy; tích hợp thanh toán Napas VietQR 24/7 và cổng soát vé (Ticket Validator) chuyển trạng thái vé có đối soát nhân viên."
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

        {viewMode === "admin" ? <TicketAdminManager /> : <TicketWallet />}
      </div>
    </AppShell>
  );
}
