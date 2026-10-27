import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  CheckCircle,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface TicketItem {
  id: string;
  ticket_code: string;
  user_name: string;
  user_phone: string;
  ticket_type: string;
  item_name: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  checkin_status: string;
  valid_date: string;
  created_at: string;
}

export const TicketAdminManager: React.FC = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Issue modal
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({
    user_name: "",
    user_phone: "",
    ticket_type: "museum",
    item_name: "Vé Tham Quan Di Tích Hoàng Thành",
    quantity: 1,
    total_amount: 50000,
    payment_status: "paid",
    valid_date: new Date().toISOString().split("T")[0],
  });

  // Validate modal
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [staffName, setStaffName] = useState("Nhân viên cổng soát vé");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetchNestApi<TicketItem[]>(`/platform-hub/tickets${q}`);
      if (Array.isArray(res)) setTickets(res);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách vé điện tử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.user_name.trim()) {
      toast.error("Vui lòng nhập họ tên người mua vé");
      return;
    }
    try {
      // POST /api/platform-hub/tickets
      await fetchNestApi(`/platform-hub/tickets`, {
        method: "POST",
        body: JSON.stringify(issueForm),
      });
      toast.success("Phát hành vé điện tử thành công (RESTful POST)");
      setIssueModalOpen(false);
      loadTickets();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi phát hành vé");
    }
  };

  const handleValidateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) {
      toast.error("Vui lòng nhập hoặc quét mã vé");
      return;
    }
    try {
      // POST /api/platform-hub/tickets/validate
      const res: any = await fetchNestApi(`/platform-hub/tickets/validate`, {
        method: "POST",
        body: JSON.stringify({ ticketCode: scanCode, staffName }),
      });
      if (res?.valid) {
        toast.success(res?.message || "Soát vé thành công!");
        setScanCode("");
        setValidateModalOpen(false);
        loadTickets();
      } else {
        toast.error(res?.message || "Vé không hợp lệ hoặc đã qua sử dụng!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi kiểm tra vé");
    }
  };

  const handleDeleteTicket = async (id: string, code: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy/xóa vé ${code}?`)) return;
    try {
      // DELETE /api/platform-hub/tickets/:id
      await fetchNestApi(`/platform-hub/tickets/${id}`, { method: "DELETE" });
      toast.success("Đã xóa vé (RESTful DELETE)");
      loadTickets();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa vé");
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticket_code.toLowerCase().includes(search.toLowerCase()) ||
      t.user_name.toLowerCase().includes(search.toLowerCase()) ||
      t.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0A101D]/80 border border-[#D8B282]/20 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              statusFilter === "all" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Tất Cả Vé ({tickets.length})
          </button>
          <button
            onClick={() => setStatusFilter("valid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              statusFilter === "valid" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Hợp Lệ
          </button>
          <button
            onClick={() => setStatusFilter("used")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              statusFilter === "used" ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-gray-300"
            }`}
          >
            Đã Sử Dụng
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vé, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-[#D8B282]/20 rounded-xl text-xs text-[#F6E1C3] placeholder-gray-500 focus:outline-none focus:border-[#D8B282]"
            />
          </div>

          <button
            onClick={() => setValidateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-[#D8B282] border border-[#D8B282]/40 shadow-md transition-all whitespace-nowrap"
          >
            <ScanLine className="w-4 h-4 text-[#D8B282]" />
            Cổng Soát Vé
          </button>

          <button
            onClick={() => setIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Phát Hành Vé Mới
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#D8B282]" />
          Đang nạp dữ liệu vé điện tử từ RESTful API...
        </div>
      ) : (
        <div className="bg-[#0A101D]/70 border border-[#D8B282]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#050C15]/90 text-xs font-semibold text-[#D8B282] uppercase border-b border-[#D8B282]/20">
              <tr>
                <th className="px-5 py-4">Mã Vé</th>
                <th className="px-5 py-4">Khách Hàng</th>
                <th className="px-5 py-4">Dịch Vụ & Loại Vé</th>
                <th className="px-5 py-4">Số Lượng & Tiền</th>
                <th className="px-5 py-4">Hạn Sử Dụng</th>
                <th className="px-5 py-4">Trạng Thái</th>
                <th className="px-5 py-4 text-right">Tác Vụ (REST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Chưa có vé nào. Bấm "+ Phát Hành Vé Mới" để tạo.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#D8B282] font-bold">{t.ticket_code}</td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-semibold text-white">{t.user_name}</div>
                      <div className="text-gray-400">{t.user_phone}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="text-gray-200">{t.item_name}</div>
                      <span className="capitalize text-blue-300">{t.ticket_type}</span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-bold text-emerald-400">{Number(t.total_amount).toLocaleString("vi-VN")} đ</div>
                      <div className="text-gray-400">{t.quantity} vé</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-300">
                      {t.valid_date ? t.valid_date.split("T")[0] : "Không thời hạn"}
                    </td>
                    <td className="px-5 py-4">
                      {t.checkin_status === "valid" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium">
                          Hợp Lệ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/40 text-xs font-medium">
                          Đã Soát Vé
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteTicket(t.id, t.ticket_code)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Hủy / Xóa vé (DELETE)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Ticket Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#D8B282]" />
                Phát Hành Vé Điện Tử Mới (RESTful POST)
              </h3>
              <button onClick={() => setIssueModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tên khách hàng *</label>
                  <input
                    type="text"
                    required
                    value={issueForm.user_name}
                    onChange={(e) => setIssueForm({ ...issueForm, user_name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={issueForm.user_phone}
                    onChange={(e) => setIssueForm({ ...issueForm, user_phone: e.target.value })}
                    placeholder="0912..."
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tên dịch vụ / Sự kiện</label>
                <input
                  type="text"
                  value={issueForm.item_name}
                  onChange={(e) => setIssueForm({ ...issueForm, item_name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Loại vé</label>
                  <select
                    value={issueForm.ticket_type}
                    onChange={(e) => setIssueForm({ ...issueForm, ticket_type: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  >
                    <option value="museum">Bảo tàng</option>
                    <option value="heritage">Di tích di sản</option>
                    <option value="marathon">Giải chạy</option>
                    <option value="sport">Giải thể thao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Số lượng</label>
                  <input
                    type="number"
                    min={1}
                    value={issueForm.quantity}
                    onChange={(e) => setIssueForm({ ...issueForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tổng tiền (VNĐ)</label>
                  <input
                    type="number"
                    value={issueForm.total_amount}
                    onChange={(e) => setIssueForm({ ...issueForm, total_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ngày hiệu lực</label>
                <input
                  type="date"
                  value={issueForm.valid_date}
                  onChange={(e) => setIssueForm({ ...issueForm, valid_date: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69] text-[#050C15] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Phát Hành Vé (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Validate Ticket Modal */}
      {validateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B132B] border border-[#D8B282]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-[#F6E1C3] flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-emerald-400" />
                Cổng Soát Vé Quang Học / Camera
              </h3>
              <button onClick={() => setValidateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleValidateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mã Vé Điện Tử</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  placeholder="Quét mã QR hoặc nhập mã TICK-..."
                  className="w-full px-3 py-3 bg-black/40 border border-[#D8B282]/40 rounded-xl text-white font-mono text-sm tracking-wider focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nhân viên soát vé</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-[#D8B282]/30 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setValidateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Xác Thực & Soát Vé (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
