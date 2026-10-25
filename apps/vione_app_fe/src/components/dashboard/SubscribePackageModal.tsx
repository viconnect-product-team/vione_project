import { useState } from "react";
import { Building2, Sparkles, CheckCircle2, ShieldCheck, X, Users, ClipboardList, Zap } from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

interface SubscribePackageModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubscribed?: () => void;
}

export function SubscribePackageModal({
  open,
  isOpen,
  onClose,
  onSuccess,
  onSubscribed,
}: SubscribePackageModalProps) {
  const isVisible = open ?? isOpen ?? false;
  const [companyName, setCompanyName] = useState("Công Ty Cổ Phần Công Nghệ & Giải Pháp ViOne");
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "trial">("annual");
  const [submitting, setSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Vui lòng nhập tên doanh nghiệp của bạn");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchNestApi<any>("/companies/subscribe-package", {
        method: "POST",
        body: JSON.stringify({
          companyName: companyName.trim(),
          isTrial: selectedPlan === "trial",
          plan: selectedPlan === "annual" ? "vione_platform_annual" : "vione_platform_trial_30d",
        }),
      });

      if (res && res.ok) {
        toast.success(
          selectedPlan === "annual"
            ? "✓ Chúc mừng! Bạn đã đăng ký thành công Gói ViOne Platform 1 năm!"
            : "✓ Đã kích hoạt dùng thử 30 ngày Gói ViOne Platform thành công!",
        );
        window.dispatchEvent(new CustomEvent("subscription-changed"));
        window.dispatchEvent(new CustomEvent("companies-changed"));
        onSuccess?.();
        onSubscribed?.();
        onClose();
      } else {
        toast.error(res?.message || "Không thể kích hoạt gói cước");
      }
    } catch (err: any) {
      toast.error("Lỗi khi đăng ký gói: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950 p-6 text-white shadow-2xl shadow-amber-500/10">
        {/* Glow corner */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-slate-950 shadow-md shadow-amber-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Đăng Ký Gói ViOne Platform</h3>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                VIP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kích hoạt phân hệ Doanh nghiệp, Quản lý Nhân sự & Giao việc
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2.5">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Đặc quyền phân hệ Doanh nghiệp:</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Hồ sơ doanh nghiệp hợp nhất & hiển thị trên Tree Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400 shrink-0" />
              <span><strong>Quản lý nhân viên:</strong> Sơ đồ tổ chức, phân quyền & số điện thoại</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-400 shrink-0" />
              <span><strong>Giao việc:</strong> Phân công nhiệm vụ, quản lý deadline & KPI realtime</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
              <span>Dữ liệu CSDL PostgreSQL bảo mật 100%, không fake/mock</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tên Doanh Nghiệp Của Bạn <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="VD: Công Ty Cổ Phần Công Nghệ & Giải Pháp ViOne"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Lựa Chọn Gói Dịch Vụ
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  selectedPlan === "annual"
                    ? "border-amber-400 bg-amber-500/10 text-white shadow-md shadow-amber-500/10"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-white">Gói 1 Năm</span>
                  {selectedPlan === "annual" && (
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-[11px] text-amber-300 font-semibold">Khuyên dùng cho DN</span>
                <span className="text-[10px] text-slate-400 mt-1">Đầy đủ quyền hạn 365 ngày</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("trial")}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  selectedPlan === "trial"
                    ? "border-amber-400 bg-amber-500/10 text-white shadow-md shadow-amber-500/10"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-white">Dùng Thử 30 Ngày</span>
                  {selectedPlan === "trial" && (
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Miễn phí 100%</span>
                <span className="text-[10px] text-slate-400 mt-1">Trải nghiệm toàn diện</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Để sau
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
              }}
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>{submitting ? "Đang kích hoạt..." : "Kích Hoạt Gói ViOne Platform"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
