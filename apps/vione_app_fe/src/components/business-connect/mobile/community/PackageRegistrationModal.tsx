import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Copy,
  Users,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNestApi } from "@/lib/api-client";

export interface SubscriptionPackage {
  id: string;
  code: string;
  name: string;
  description: string | null;
  packageType: string;
  price: number;
  billingCycle: string;
  durationDays: number;
  maxSlots: number;
  maxDepartments: number;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  qrTemplate: string | null;
  features: string[];
  isActive: boolean;
}

interface PackageRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  prefillCompanyName?: string;
}

export function PackageRegistrationModal({
  open,
  onClose,
  onSuccess,
  prefillCompanyName = "",
}: PackageRegistrationModalProps) {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<SubscriptionPackage | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Form fields
  const [companyName, setCompanyName] = useState(prefillCompanyName);
  const [taxId, setTaxId] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  useEffect(() => {
    if (open) {
      setStep("form");
      loadPackages();
      if (prefillCompanyName && !companyName) {
        setCompanyName(prefillCompanyName);
      }
    }
  }, [open, prefillCompanyName]);

  const loadPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await fetchNestApi<SubscriptionPackage[]>("/companies/packages");
      if (Array.isArray(res) && res.length > 0) {
        setPackages(res);
        // Default to FREE_30D if available, otherwise first package
        const freePkg = res.find((p) => p.code === "FREE_30D" || p.price === 0);
        setSelectedPkg(freePkg || res[0]);
      } else {
        // Fallback default packages if DB returned empty
        const defaults: SubscriptionPackage[] = [
          {
            id: "free-30d",
            code: "FREE_30D",
            name: "Gói Dùng Thử 30 Ngày",
            description: "Dành cho doanh nghiệp trải nghiệm toàn diện hệ sinh thái ViOne",
            packageType: "trial",
            price: 0,
            billingCycle: "monthly",
            durationDays: 30,
            maxSlots: 30,
            maxDepartments: 5,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["30 tài khoản nhân sự", "Quản lý công việc & phòng ban", "Cơ hội giao thương B2B"],
            isActive: true,
          },
          {
            id: "std-30",
            code: "VIONE_STANDARD_30",
            name: "Gói Chuẩn 30 Tài Khoản",
            description: "Tối ưu hóa quản trị & vận hành cho doanh nghiệp SME",
            packageType: "standard",
            price: 1500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 30,
            maxDepartments: 5,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["30 tài khoản nhân sự", "Phân quyền vai trò", "Chấm công & Tài chính", "Hỗ trợ 24/7"],
            isActive: true,
          },
          {
            id: "growth-50",
            code: "VIONE_GROWTH_50",
            name: "Gói Tăng Trưởng 50 Tài Khoản",
            description: "Mở rộng quy mô doanh nghiệp với đầy đủ công cụ quản trị nâng cao",
            packageType: "growth",
            price: 2500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 50,
            maxDepartments: 10,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["50 tài khoản nhân sự", "Quản lý đa phòng ban", "Tự động hóa báo cáo KPI", "CRM nâng cao"],
            isActive: true,
          },
          {
            id: "ent-100",
            code: "VIONE_ENTERPRISE_100",
            name: "Gói Doanh Nghiệp 100 Tài Khoản",
            description: "Giải pháp toàn diện chuyên biệt cho doanh nghiệp quy mô lớn",
            packageType: "enterprise",
            price: 4500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 100,
            maxDepartments: 20,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["100 tài khoản nhân sự", "Không giới hạn phòng ban", "Bảo mật cấp độ Enterprise", "Hỗ trợ riêng 1-1"],
            isActive: true,
          },
        ];
        setPackages(defaults);
        setSelectedPkg(defaults[0]);
      }
    } catch (err) {
      console.warn("[PackageRegistrationModal] Failed to load packages:", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Vui lòng nhập tên doanh nghiệp");
      return;
    }
    if (!representativeName.trim()) {
      toast.error("Vui lòng nhập tên người đại diện pháp luật");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ để nhận thông tin gói");
      return;
    }
    if (!selectedPkg) {
      toast.error("Vui lòng chọn một gói cước ViOne Platform");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchNestApi<any>("/companies/package-orders", {
        method: "POST",
        body: JSON.stringify({
          packageId: selectedPkg.id,
          packageCode: selectedPkg.code,
          packageName: selectedPkg.name,
          price: selectedPkg.price,
          maxSlots: selectedPkg.maxSlots,
          companyName: companyName.trim(),
          taxId: taxId.trim() || undefined,
          representativeName: representativeName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          industry: industry.trim() || undefined,
          address: address.trim() || undefined,
          paymentMethod: selectedPkg.price > 0 ? "vietqr" : "free_trial",
        }),
      });

      if (res && (res.id || res.success || res.order)) {
        toast.success("Hồ sơ đăng ký gói đã được gửi thành công về CRM ViConnect!");
        setStep("success");
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Không thể gửi hồ sơ đăng ký");
      }
    } catch (err: any) {
      console.error("[PackageRegistrationModal] Submit error:", err);
      toast.error("Lỗi khi gửi hồ sơ: " + (err?.message || "Vui lòng thử lại"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-[#D8B282]/30 bg-[#050C15] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-[#D8B282]/20 bg-gradient-to-r from-[#050C15] via-slate-900 to-[#050C15] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#C29B69]">
                ĐĂNG KÝ GÓI VIONE PLATFORM
              </h2>
              <p className="text-xs text-slate-400">
                Giải pháp chuyển đổi số & quản trị doanh nghiệp toàn diện
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {step === "success" ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#F6E1C3]">
                Gửi Hồ Sơ Đăng Ký Thành Công!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Hồ sơ đăng ký gói <strong className="text-[#D8B282]">{selectedPkg?.name}</strong> của doanh nghiệp{" "}
                <strong className="text-white">{companyName}</strong> đã được chuyển đến ban điều phối ViConnect CRM.
              </p>

              <div className="p-4 rounded-2xl border border-[#D8B282]/30 bg-slate-900/80 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Số lượng tài khoản (Slots):</span>
                  <span className="font-bold text-[#F6E1C3]">{selectedPkg?.maxSlots} tài khoản</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email nhận kết quả kích hoạt:</span>
                  <span className="font-bold text-white">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="font-bold text-amber-400">Đang chờ nhân viên ViConnect duyệt hồ sơ</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sau khi nhân viên bấm Duyệt hồ sơ trên hệ thống CRM, thông tin gói cước và hướng dẫn kích hoạt sẽ tự động được gửi về hộp thư điện tử của bạn.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-95 transition cursor-pointer"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PHẦN 1: THÔNG TIN DOANH NGHIỆP */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8B282]">
                  <Building2 className="w-4 h-4 text-[#D8B282]" />
                  <span>1. Thông Tin Doanh Nghiệp Đăng Ký</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên Doanh Nghiệp / Công Ty <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="VD: Công ty Cổ phần Công nghệ ViConnect"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Số Thuế (MST)
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="VD: 0109988776"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Người Đại Diện Pháp Luật <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Số Điện Thoại Liên Hệ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0988889999"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Nhận Thông Tin Gói <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: ceo@viconnect.vn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lĩnh Vực / Ngành Nghề
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="VD: Bất Động Sản, Xây Dựng, CNTT"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Địa Chỉ Trụ Sở
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="VD: Cầu Giấy, Hà Nội"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D8B282] transition"
                    />
                  </div>
                </div>
              </div>

              {/* PHẦN 2: CHỌN GÓI VIONE PLATFORM */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8B282]">
                    <Layers className="w-4 h-4 text-[#D8B282]" />
                    <span>2. Lựa Chọn Gói Dịch Vụ ViOne</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Mặc định thấp nhất tạo được 30 tài khoản
                  </span>
                </div>

                {loadingPackages ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Đang tải danh mục gói ViOne...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {packages.map((pkg) => {
                      const isSelected = selectedPkg?.id === pkg.id || selectedPkg?.code === pkg.code;
                      const isFree = pkg.price === 0;

                      return (
                        <div
                          key={pkg.id || pkg.code}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#D8B282] bg-gradient-to-br from-[#D8B282]/15 via-slate-900 to-slate-950 shadow-lg shadow-[#D8B282]/10 ring-1 ring-[#D8B282]"
                              : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D8B282] text-slate-950 flex items-center justify-center font-black">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                isFree
                                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                                  : "bg-[#D8B282]/20 border border-[#D8B282]/40 text-[#F6E1C3]"
                              }`}
                            >
                              {isFree ? "Free 30 Ngày" : `${pkg.maxSlots} Tài Khoản`}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {pkg.billingCycle === "yearly" ? "12 tháng" : "30 ngày"}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white mt-1.5">{pkg.name}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                            {pkg.description || "Gói phần mềm ViOne Platform Enterprise"}
                          </p>

                          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-baseline justify-between">
                            <div className="text-base font-black text-[#F6E1C3]">
                              {isFree ? "0 VNĐ" : `${pkg.price.toLocaleString("vi-VN")} đ`}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Users className="w-3 h-3 text-[#D8B282]" />
                              <span>Tối đa {pkg.maxSlots} slots</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PHẦN 3: THANH TOÁN QR NẾU GÓI CÓ PHÍ */}
              {selectedPkg && selectedPkg.price > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8B282]">
                    <QrCode className="w-4 h-4 text-[#D8B282]" />
                    <span>3. Quét Mã VietQR Napas 24/7 Để Thanh Toán</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl border border-[#D8B282]/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col sm:flex-row items-center gap-5">
                    {/* QR Code image */}
                    <div className="relative p-2.5 rounded-2xl bg-white shadow-xl shrink-0">
                      <img
                        src={`https://img.vietqr.io/image/${selectedPkg.bankName || "MB"}-${
                          selectedPkg.bankAccount || "0333666999"
                        }-${selectedPkg.qrTemplate || "compact2"}.png?amount=${
                          selectedPkg.price
                        }&addInfo=${encodeURIComponent(
                          `VIONE ${selectedPkg.code} ${phone || "DK"}`
                        )}&accountName=${encodeURIComponent(
                          selectedPkg.bankAccountName || "CONG TY CP VICONNECT"
                        )}`}
                        alt="VietQR ViOne"
                        className="w-40 h-40 object-contain"
                      />
                      <div className="text-center text-[10px] font-black text-slate-900 mt-1 uppercase tracking-wider">
                        VietQR Napas 24/7
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="flex-1 w-full space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Ngân hàng:</span>
                        <span className="font-bold text-white">{selectedPkg.bankName || "MB (Quân Đội)"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#F6E1C3]">
                            {selectedPkg.bankAccount || "0333666999"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(selectedPkg.bankAccount || "0333666999", "Số tài khoản")
                            }
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Chủ tài khoản:</span>
                        <span className="font-bold text-white">
                          {selectedPkg.bankAccountName || "CONG TY CP VICONNECT"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Số tiền:</span>
                        <span className="font-black text-[#D8B282] text-sm">
                          {selectedPkg.price.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Nội dung CK:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-400">
                            VIONE {selectedPkg.code} {phone || "DK"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `VIONE ${selectedPkg.code} ${phone || "DK"}`,
                                "Nội dung chuyển khoản"
                              )
                            }
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Trial Message */}
              {selectedPkg && selectedPkg.price === 0 && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200 leading-relaxed flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Bạn đang đăng ký <strong>Gói Dùng Thử Free 30 Ngày</strong> (30 tài khoản). Sau khi gửi hồ sơ, nhân viên ViConnect sẽ xem xét và kích hoạt gói ngay cho bạn!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-98 transition cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? "Đang gửi hồ sơ..." : "Gửi Đăng Ký Gói Về ViConnect CRM"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
