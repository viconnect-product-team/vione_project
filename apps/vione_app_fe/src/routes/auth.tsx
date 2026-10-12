import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/lib/i18n";
import { LuxuryLangSwitcher } from "@/components/LuxuryLangSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  X,
  TrendingUp,
  Users,
  Bot,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";
import { classifyAuthError, type AuthErrorInfo } from "@/lib/business-connect/mobile/auth-error";
import {
  applyRememberPreference,
  getRememberPreference,
  getRememberedEmail,
} from "@/lib/business-connect/mobile/auth-session";
import { fetchNestApi } from "@/lib/api-client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    redirect?: string;
    m?: "1";
    reason?: "expired";
    portal?: "connect" | "vione" | "association" | "crm" | "admin";
  } => ({
    ...(typeof search.redirect === "string" ? { redirect: search.redirect } : {}),
    ...(search.m === "1" ? { m: "1" as const } : {}),
    ...(search.reason === "expired" ? { reason: "expired" as const } : {}),
    ...(search.portal === "association" ? { portal: "association" as const } : {}),
    ...(search.portal === "connect" || search.portal === "vione" ? { portal: "connect" as const } : {}),
    ...(search.portal === "crm" || search.portal === "admin" ? { portal: "crm" as const } : {}),
  }),
  head: () => ({
    meta: [{ title: "Đăng nhập ViOne CRM — Hệ thống Quản trị Doanh nghiệp" }],
  }),
  component: CrmAdminAuthPage,
});

function safeRedirect(target?: string): string | null {
  if (!target) return null;
  try {
    const url = new URL(target, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const path = url.pathname + url.search + url.hash;
    if (path.startsWith("/auth") || path.includes("/login")) return null;
    return path.startsWith("/") && !path.startsWith("//") ? path : null;
  } catch {
    return null;
  }
}

function CrmAdminAuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const { redirect: redirectTo, reason, portal: searchPortal } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorInfo, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [remember, setRemember] = useState(true);
  const { user, setAuthData } = useAuth();
  const hasRedirectedRef = useRef(false);

  const destPath = safeRedirect(redirectTo) ?? "";

  // Tự động phân luồng theo portal chuyên biệt
  useEffect(() => {
    if (searchPortal === "crm" || searchPortal === "admin") {
      return;
    }
    if (searchPortal === "association" || (destPath.startsWith("/association") || destPath.startsWith("/m"))) {
      navigate({
        to: "/association/login" as any,
        search: { redirect: redirectTo } as any,
        replace: true,
      });
      return;
    }
    if (searchPortal === "connect" || searchPortal === "vione") {
      navigate({
        to: "/vione/login" as any,
        search: { redirect: redirectTo } as any,
        replace: true,
      });
      return;
    }
  }, [searchPortal, destPath, redirectTo, navigate]);

  async function goPostLogin() {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    const target = safeRedirect(redirectTo);
    if (
      target &&
      !target.startsWith("/connect-app") &&
      !target.startsWith("/vione") &&
      !target.startsWith("/auth") &&
      !target.startsWith("/association/login")
    ) {
      navigate({ to: target as any, replace: true });
      return;
    }
    navigate({ to: "/", replace: true });
  }

  useEffect(() => {
    if (reason !== "expired") return;
    setAuthErrorInfo(null);
    toast.error(t("auth.sessionExpired"));
  }, [reason, t]);

  useEffect(() => {
    setRemember(getRememberPreference());
    const saved = getRememberedEmail();
    if (saved) setEmail((v) => v || saved);
  }, []);

  useEffect(() => {
    if (user && !hasRedirectedRef.current) {
      void goPostLogin();
    }
  }, [user]);

  async function submit() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const err = "Vui lòng nhập tài khoản hoặc email quản trị";
      setAuthError(err);
      toast.error(err);
      return;
    }
    if (!password) {
      const err = "Vui lòng nhập mật khẩu";
      setAuthError(err);
      toast.error(err);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      const err = "Mật khẩu xác nhận không khớp";
      setAuthError(err);
      toast.error(err);
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthErrorInfo(null);

    try {
      if (mode === "signup") {
        await fetchNestApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ username: trimmedEmail, password }),
        });
        toast.success(t("auth.signUpSuccess") || "Đăng ký thành công! Hãy đăng nhập");
        setMode("signin");
      } else {
        const res = await fetchNestApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: trimmedEmail, password }),
        });
        if (!res?.access_token) {
          throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
        }
        setAuthData(res);
        applyRememberPreference(remember, trimmedEmail);
        await goPostLogin();
      }
    } catch (e: any) {
      const info = classifyAuthError(e, { provider: "password" });
      setAuthErrorInfo(info);
      let errorMsg = "";
      if (info.kind === "credentials") {
        errorMsg = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
      } else {
        const translated = t(info.messageKey as Parameters<typeof t>[0]);
        if (translated && translated !== "auth.genericError" && translated !== "Có lỗi xảy ra") {
          errorMsg = translated;
        } else if (e?.message && !e.message.includes("Object") && !e.message.includes("500")) {
          errorMsg = e.message;
        } else {
          errorMsg = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
        }
      }
      setAuthError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Ảnh chìm nền Skyline Architecture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 dark:opacity-40"
        style={{
          backgroundImage: "url('/skyline_perspective_light.jpg')",
        }}
      />

      {/* 2. Soft Light / Dark Overlay for Optimal Contrast */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-white/90 via-slate-50/80 to-white/95 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 backdrop-blur-[2px]" />

      {/* 3. Ambient Champagne Gold Glow Accents (Tĩnh, không animation) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-30 dark:opacity-20"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(223, 183, 108, 0.25) 0%, rgba(201, 158, 85, 0.08) 50%, transparent 70%)",
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-amber-400/20 backdrop-blur-md bg-white/60 dark:bg-slate-950/60">
        <a
          href="https://viconnect.vn/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 transition hover:text-amber-950 dark:hover:text-amber-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Website chính thức ViOne</span>
        </a>
        <div className="flex items-center gap-2.5">
          <ThemeSwitcher />
          <LuxuryLangSwitcher />
        </div>
      </header>

      {/* Main Content: 2 Cột Chuẩn Mực (Trái: Ảnh + Biểu đồ PR Điểm Lợi ViOne; Phải: Đăng Nhập CRM) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* CỘT BÊN TRÁI: ẢNH KÈM TEXT & BIỂU ĐỒ PR ĐIỂM LỢI THẾ VIONE (HOÀN TOÀN KHÔNG ANIMATION) */}
          <div className="lg:col-span-7 w-full hidden lg:flex flex-col justify-center space-y-6">
            
            {/* Header Text giới thiệu kiến trúc điều hành */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/35 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>HỆ ĐIỀU HÀNH DOANH NGHIỆP TOÀN DIỆN VIONE CRM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Vận Hành Tự Động Hóa & <br />
                <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
                  Đột Phá Tăng Trưởng Doanh Nghiệp
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Giải pháp All-in-One thay thế hệ thống rời rạc: Tích hợp Quản trị Khách hàng, Phân quyền Phòng ban, Phê duyệt VietQR 3 cấp và Sàn Giao thương B2B trực tiếp.
              </p>
            </div>

            {/* Banner Ảnh + Mockup Thống Kê ViOne Cao Cấp */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-white/80 to-amber-500/5 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-amber-950/30 p-5 shadow-lg backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-md">
                  <img
                    src="/skyline_perspective_light.jpg"
                    alt="ViOne Enterprise Architecture"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-center p-1.5">
                    <span className="text-[10px] font-extrabold text-amber-300 tracking-wider">C-LEVEL ERP</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Hiệu năng Vận hành Doanh nghiệp
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Tối ưu hóa đến 45% chi phí &amp; 3x tốc độ phê duyệt
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Đồng bộ thời gian thực giữa Web CRM, App Mobile Native và Kế toán tài chính PostgreSQL.
                  </p>
                </div>
              </div>

              {/* Biểu Đồ So Sánh PR Trực Quan (Trước vs Sau khi dùng ViOne) */}
              <div className="mt-4 pt-4 border-t border-amber-400/20 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400">+168%</div>
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Hiệu suất điều hành</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Tự động hóa luồng việc</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">&lt; 30 Giây</div>
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Duyệt chi VietQR 3 cấp</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Tự động gạch nợ tức thì</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-lg font-black text-sky-600 dark:text-sky-400">100%</div>
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Phân quyền phòng ban</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Bàn giao &amp; Audit Trail</div>
                </div>
              </div>
            </div>

            {/* 4 Thẻ Điểm Lợi Cốt Lõi ViOne (Static, Giao diện chuẩn mực) */}
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Điểm lợi 1 */}
              <div className="rounded-2xl border border-amber-400/30 bg-white/85 dark:bg-slate-900/85 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Kiểm Soát Dòng Tiền</h4>
                    <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">Duyệt chi VietQR 3 cấp</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ngăn chặn 90% rủi ro chi sai, tự động hóa đối soát kế toán và tạo lệnh thanh toán QR trực tiếp.
                </p>
              </div>

              {/* Điểm lợi 2 */}
              <div className="rounded-2xl border border-amber-400/30 bg-white/85 dark:bg-slate-900/85 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Phân Quyền Phòng Ban</h4>
                    <span className="text-[10.5px] font-semibold text-blue-600 dark:text-blue-400">Department RBAC</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bảo mật dữ liệu kinh doanh, kỹ thuật, kế toán. Tự động chuyển giao việc khi thay đổi nhân sự.
                </p>
              </div>

              {/* Điểm lợi 3 */}
              <div className="rounded-2xl border border-amber-400/30 bg-white/85 dark:bg-slate-900/85 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Mạng Lưới B2B Connect</h4>
                    <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">1,280+ Đối tác liên minh</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tiếp cận cộng đồng doanh nhân chất lượng cao, chia sẻ cơ hội giao thương và niêm yết Marketplace.
                </p>
              </div>

              {/* Điểm lợi 4 */}
              <div className="rounded-2xl border border-amber-400/30 bg-white/85 dark:bg-slate-900/85 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Trợ Lý AI Doanh Nghiệp</h4>
                    <span className="text-[10.5px] font-semibold text-purple-600 dark:text-purple-400">ViOne AI Copilot 24/7</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tự động phân tích báo cáo tài chính, cảnh báo công nợ đến hạn và gợi ý chiến lược tăng trưởng.
                </p>
              </div>

            </div>

            {/* Dải trạng thái cam kết bảo mật & ổn định */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-amber-400/25 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">Bảo mật đa tầng TLS 1.3 &amp; AES-256</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                <span>SLA Uptime 99.98% • Enterprise v5.0</span>
              </div>
            </div>

          </div>

          {/* CỘT BÊN PHẢI: MÀN HÌNH ĐĂNG NHẬP SÁT BÊN PHẢI */}
          <div className="lg:col-span-5 w-full max-w-md ml-auto">
            <div className="rounded-3xl border border-amber-400/35 bg-white/95 dark:bg-slate-900/90 p-7 sm:p-9 backdrop-blur-2xl shadow-[0_25px_60px_rgba(216,178,130,0.22),0_10px_35px_rgba(15,23,42,0.08)] text-slate-900 dark:text-slate-100 transition-all duration-200">
              
              {/* Brand Logo & Hệ Thống Text (Chỉ logo ViOne + text hệ thống) */}
              <div className="flex flex-col items-center justify-center text-center">
                <a
                  href="https://viconnect.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform hover:scale-[1.02]"
                >
                  <img
                    src="/vione-wordmark.png"
                    alt="ViOne Logo"
                    className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm"
                  />
                </a>

                <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 border border-amber-400/30 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP CRM</span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-[25px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {mode === "signin" ? "Đăng nhập Hệ thống" : "Đăng ký Quản trị viên"}
                </h1>
                <p className="mt-1 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 max-w-[20rem]">
                  ViOne Enterprise Management & AI Copilot Platform
                </p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900/50 p-3 text-xs text-rose-700 dark:text-rose-300 leading-relaxed shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-semibold">{authError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthError(null)}
                      className="flex h-5 w-5 items-center justify-center rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer text-rose-500"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Đăng Nhập */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tài khoản / Email
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@connect.vn"
                    className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/80 dark:bg-slate-800/80 px-4 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Mật khẩu
                    </label>
                    {mode === "signin" && (
                      <Link
                        to="/forgot-password"
                        search={{ email: email.trim() || undefined }}
                        className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline transition-colors"
                      >
                        {t("auth.forgotPassword")}
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/80 dark:bg-slate-800/80 px-4 pr-11 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-[11.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/80 dark:bg-slate-800/80 px-4 pr-11 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Ghi nhớ đăng nhập */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-400/30 accent-amber-600"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                </div>

                {/* Nút Đăng nhập Hoàng Gia Champagne Gold */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative mt-2 flex h-12 w-full items-center justify-center rounded-xl text-[15px] sm:text-[16px] font-bold text-slate-950 transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-lg bg-[linear-gradient(135deg,#F6E1C3_0%,#D8B282_45%,#C29B69_70%,#8C653B_100%)] border border-[#D8B282]/50 shadow-amber-500/25"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 text-slate-950 font-bold">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-950" /> Đang xử lý...
                    </span>
                  ) : mode === "signin" ? (
                    "Đăng nhập Hệ thống CRM"
                  ) : (
                    "Đăng ký Quản trị viên"
                  )}
                  {!loading && (
                    <ArrowRight
                      className="absolute right-5 sm:right-6 h-5 w-5 text-slate-950 font-bold"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </form>

              {/* Chuyển đổi Đăng nhập / Đăng ký */}
              <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setAuthError(null);
                  }}
                  className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 transition-colors hover:text-amber-600 dark:hover:text-[#DFB76C] cursor-pointer"
                >
                  {mode === "signin" ? (
                    <span>Chưa có tài khoản quản trị? <strong className="text-amber-600 dark:text-[#DFB76C] underline underline-offset-4">Đăng ký ngay</strong></span>
                  ) : (
                    <span>Đã có tài khoản quản trị? <strong className="text-amber-600 dark:text-[#DFB76C] underline underline-offset-4">Đăng nhập</strong></span>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 w-full py-3.5 px-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-amber-400/10 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30">
        <span>© {new Date().getFullYear()} ViOne Platform • Hệ thống Quản trị & Điều hành Doanh nghiệp Toàn diện</span>
      </footer>
    </main>
  );
}
