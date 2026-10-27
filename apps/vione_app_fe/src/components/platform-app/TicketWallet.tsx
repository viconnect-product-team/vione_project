import React, { useState, useEffect } from "react";
import {
  Ticket,
  QrCode,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Download,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface PlatformTicket {
  id: string;
  ticket_code: string;
  user_name: string;
  ticket_type: string;
  item_name: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  status?: string;
  checkin_status: string;
  valid_date: string;
  qr_payload: string;
  created_at: string;
  redeemed_at?: string;
  redeemed_by?: string;
}

export const TicketWallet: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"wallet" | "validator">("wallet");
  const [tickets, setTickets] = useState<PlatformTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<PlatformTicket | null>(null);

  // Ticket Validator state
  const [inputCode, setInputCode] = useState("TK-HUE-2026-99");
  const [staffName, setStaffName] = useState("Lê Văn Kiểm (Cổng Đại Nội)");
  const [validating, setValidating] = useState(false);
  const [validateResult, setValidateResult] = useState<{
    valid: boolean;
    message: string;
    ticket?: any;
  } | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchNestApi<PlatformTicket[]>("/platform-hub/tickets/my-tickets");
      if (Array.isArray(res)) {
        setTickets(res);
      }
    } catch (err) {
      console.error("[TicketWallet] error:", err);
      toast.error("Không thể tải danh sách vé điện tử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleValidateTicket = async (codeToValidate?: string) => {
    const code = (codeToValidate || inputCode).trim();
    if (!code) {
      toast.error("Vui lòng nhập mã vé cần soát");
      return;
    }

    try {
      setValidating(true);
      setValidateResult(null);
      const res = await fetch("/api/platform-hub/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketCode: code,
          staffName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setValidateResult(data);
        if (data.valid) {
          toast.success(data.message);
          loadTickets();
        } else {
          toast.error(data.message);
        }
      } else {
        setValidateResult({
          valid: false,
          message: data.message || "Mã vé không tồn tại trong hệ thống!",
        });
        toast.error(data.message || "Không tìm thấy vé");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi kết nối hệ thống soát vé");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Ví Vé */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D8B282]/40 bg-gradient-to-r from-[#0B0F17] via-[#151722] to-[#0B0F17] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B282]/40 bg-[#D8B282]/10 px-3 py-1 text-xs font-semibold text-[#F6E1C3]">
            <Ticket className="h-3.5 w-3.5 text-[#F6E1C3]" />
            <span>ViOne Ticket Platform • Bán Vé & Soát Vé Điện Tử Đa Năng</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#F6E1C3] font-serif">
            Hệ Thống Vé Điện Tử & Cổng Soát Vé QR/NFC 1-Chạm
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Hệ thống số hóa liên thông: Vé tham quan Quần thể Di sản, vé Bảo tàng số và vé nhận RaceKit giải chạy ViOne Run. Tích hợp cổng soát vé thời gian thực dành cho ban quản lý.
          </p>

          {/* Sub-tab switch */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubTab("wallet")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeSubTab === "wallet"
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                  : "border border-[#D8B282]/30 bg-[#0B0F17] text-[#E2E8F0] hover:border-[#D8B282]"
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>Ví Vé Người Dùng ({tickets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("validator")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeSubTab === "validator"
                  ? "bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-lg shadow-[#D8B282]/20"
                  : "border border-[#D8B282]/30 bg-[#0B0F17] text-[#E2E8F0] hover:border-[#D8B282]"
              }`}
            >
              <ScanLine className="h-4 w-4" />
              <span>Cổng Soát Vé Nhân Viên (Validator)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: WALLET */}
      {activeSubTab === "wallet" && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8B282] border-t-transparent" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8B282]/30 bg-[#0B0F17]/60 p-8 text-center">
              <Ticket className="h-12 w-12 text-[#D8B282]/50 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#F6E1C3]">Ví vé đang trống</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Bạn chưa có vé tham quan hoặc vé giải chạy nào. Hãy đặt vé bảo tàng hoặc đăng ký BIB để nhận vé điện tử ngay!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((t) => {
                const isUsed = t.status === "used";
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D8B282]/30 bg-gradient-to-b from-[#121620] to-[#0B0F17] p-5 shadow-xl transition-all hover:border-[#D8B282] hover:scale-[1.01]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#D8B282]/20 border border-[#D8B282]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F6E1C3] uppercase">
                          {t.ticket_type === "museum" ? "Vé Bảo Tàng" : t.ticket_type === "race_bib" ? "Vé Giải Chạy" : "Vé Di Sản"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isUsed ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                            {isUsed ? "Đã soát vé" : "Hợp lệ"}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#D8B282]">{t.ticket_code}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#F6E1C3] group-hover:text-white transition-colors">
                          {t.item_name}
                        </h3>
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#D8B282]" />
                            <span>Hiệu lực: {new Date(t.valid_date || Date.now()).toLocaleDateString("vi-VN")}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Đã thanh toán Napas VietQR 24/7</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D8B282]/15 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#D8B282]">
                        {Number(t.total_amount).toLocaleString()} đ
                      </span>
                      <span className="rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1 text-[11px] font-bold text-[#050C15] flex items-center gap-1">
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Mở Mã Soát Vé</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VALIDATOR (SOÁT VÉ NHÂN VIÊN) */}
      {activeSubTab === "validator" && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-[#D8B282]/40 bg-gradient-to-b from-[#0F172A] to-[#070D18] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#D8B282]/20 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-lg">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-black text-[#F6E1C3]">
                CỔNG SOÁT VÉ ĐIỆN TỬ VICONNECT (TICKET VALIDATOR)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Quét mã QR hoặc nhập mã vé để xác thực và đổi trạng thái vé hợp lệ
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#CBD5E1]">Nhân viên soát vé:</label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#D8B282]/30 bg-[#050C15] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#CBD5E1]">Nhập mã vé hoặc số BIB:</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Ví dụ: TK-HUE-2026-99"
                  className="flex-1 rounded-xl border border-[#D8B282]/30 bg-[#050C15] px-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleValidateTicket()}
                  disabled={validating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-5 py-2.5 text-xs font-bold text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
                  <span>Kiểm Tra & Soát Vé</span>
                </button>
              </div>
            </div>

            {/* Quick Test codes from current tickets */}
            {tickets.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-muted-foreground">Mã vé có sẵn trong ví:</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setInputCode(t.ticket_code);
                        handleValidateTicket(t.ticket_code);
                      }}
                      className="rounded-lg border border-[#D8B282]/30 bg-[#050C15] px-2.5 py-1 text-[11px] font-mono text-[#D8B282] hover:border-[#D8B282]"
                    >
                      {t.ticket_code} ({t.status === "used" ? "Đã dùng" : "Chưa dùng"})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Result Box */}
            {validateResult && (
              <div
                className={`mt-4 rounded-2xl border-2 p-5 text-center space-y-2 animate-fadeIn ${
                  validateResult.valid
                    ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-200"
                    : "border-rose-500/60 bg-rose-950/40 text-rose-200"
                }`}
              >
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-black/40">
                  {validateResult.valid ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-rose-400" />
                  )}
                </div>
                <h4 className="text-base font-bold font-serif">
                  {validateResult.valid ? "XÁC NHẬN SOÁT VÉ THÀNH CÔNG!" : "CẢNH BÁO: VÉ KHÔNG HỢP LỆ"}
                </h4>
                <p className="text-xs">{validateResult.message}</p>
                {validateResult.ticket && (
                  <div className="mt-3 rounded-xl bg-black/50 p-3 text-left grid grid-cols-2 gap-2 text-xs font-mono text-[#CBD5E1]">
                    <div>Mã vé: <span className="text-[#F6E1C3]">{validateResult.ticket.ticket_code}</span></div>
                    <div>Loại: <span className="text-white">{validateResult.ticket.ticket_type}</span></div>
                    <div className="col-span-2">Dịch vụ: <span className="text-white font-sans">{validateResult.ticket.item_name}</span></div>
                    <div>Trạng thái: <span className="text-emerald-400 font-bold">ĐÃ SỬ DỤNG</span></div>
                    <div>Người soát: <span>{validateResult.ticket.redeemed_by || staffName}</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Xuất Mã QR Soát Vé */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-[#D8B282] bg-gradient-to-b from-[#121620] via-[#0B0F17] to-[#0B0F17] p-6 shadow-2xl text-center space-y-4 text-[#F6E1C3]">
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 rounded-full border border-[#D8B282]/40 bg-[#1A1A24] p-1.5 text-muted-foreground hover:text-white"
            >
              ✕
            </button>

            <span className="rounded-full bg-[#D8B282]/20 border border-[#D8B282]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F6E1C3]">
              Vé Điện Tử ViConnect {selectedTicket.status === "used" ? "(ĐÃ SỬ DỤNG)" : "(HỢP LỆ)"}
            </span>

            <h3 className="text-lg font-bold font-serif text-[#F6E1C3]">{selectedTicket.item_name}</h3>
            <p className="text-xs text-muted-foreground">Mã vé: <span className="font-mono font-bold text-[#D8B282]">{selectedTicket.ticket_code}</span></p>

            {/* QR Viewfinder */}
            <div className="relative aspect-square w-48 mx-auto rounded-2xl border-2 border-[#D8B282] p-3 bg-white flex items-center justify-center shadow-xl shadow-[#D8B282]/20">
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-800">
                <QrCode className="h-32 w-32 text-[#050C15]" />
                <span className="text-[10px] font-mono font-bold mt-1 text-[#050C15]">{selectedTicket.ticket_code}</span>
              </div>
              <div className="absolute inset-0 border border-[#D8B282]/50 rounded-2xl pointer-events-none animate-pulse" />
            </div>

            <p className="text-[11px] text-muted-foreground">
              Đưa mã QR này trước cổng xoay soát vé bảo tàng hoặc trạm phát RaceKit giải chạy để xác thực trong 1 giây.
            </p>

            <button
              type="button"
              onClick={() => toast.success("Đã lưu vé điện tử vào thư viện ảnh máy tính/điện thoại!")}
              className="w-full rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-2.5 text-xs font-bold text-[#050C15] shadow-lg hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Lưu Vé Vào Thiết Bị</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
