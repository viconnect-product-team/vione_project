import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Globe,
  Layout,
  Lock,
  Mail,
  MessageSquareText,
  Save,
  Shield,
  KeyRound,
  CheckCircle2,
  X,
  Loader2,
  ExternalLink,
  Phone,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/dashboard/AppShell";
import { Card, PageHeader } from "@/components/dashboard/PageKit";
import { AssociationLogoUploader } from "@/components/dashboard/AssociationLogoUploader";
import { AssociationLandingEditor } from "@/components/dashboard/AssociationLandingEditor";
import { AssociationDomainEditor } from "@/components/dashboard/AssociationDomainEditor";
import { ReplyTemplatesEditor } from "@/components/dashboard/ReplyTemplatesEditor";
import { getSettingsFn, saveSettingsFn } from "@/lib/settings.functions";
import { useLang, useT, type TKey } from "@/lib/i18n";
import { fetchNestApi } from "@/lib/api-client";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const TABS = [
  { key: "general", label: "set.tab.general", icon: Building2 },
  { key: "landing", label: "set.tab.landing", icon: Layout },
  { key: "domain", label: "set.tab.domain", icon: Globe },
  { key: "templates", label: "set.tab.templates", icon: MessageSquareText },
  { key: "notifications", label: "set.tab.notifications", icon: Bell },
  { key: "security", label: "set.tab.security", icon: Shield },
  { key: "integrations", label: "set.tab.integrations", icon: Globe },
] as const;

interface IntegrationItem {
  key: string;
  name: string;
  desc: string;
  category: string;
}

const INTEGRATION_DEFS: IntegrationItem[] = [
  {
    key: "zalo",
    name: "Zalo Official Account (OA)",
    desc: "Đồng bộ tin nhắn chăm sóc khách hàng và gửi thông báo ZNS tự động",
    category: "Tin nhắn & CSKH",
  },
  {
    key: "googleWorkspace",
    name: "Google Workspace & Calendar",
    desc: "Tích hợp lịch họp Google Calendar, Drive lưu trữ và Gmail cho doanh nghiệp",
    category: "Văn phòng số",
  },
  {
    key: "microsoftTeams",
    name: "Microsoft Teams",
    desc: "Nhận thông báo tiến độ công việc, phê duyệt chi và ca trực qua kênh MS Teams",
    category: "Cộng tác nhóm",
  },
  {
    key: "slack",
    name: "Slack Webhook",
    desc: "Tích hợp bot cảnh báo thời gian thực và trao đổi kỹ thuật nội bộ kênh Slack",
    category: "Cảnh báo & Kỹ thuật",
  },
];

function SettingsPage() {
  const t = useT();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("general");
  const { lang, setLang } = useLang();

  // Core system fields
  const [orgName, setOrgName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vba_active_assoc_name") || "Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne";
    }
    return "Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne";
  });
  const [email, setEmail] = useState("contact@vione.vn");
  const [websiteUrl, setWebsiteUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vione_system_website") || "https://vione.vn";
    }
    return "https://vione.vn";
  });
  const [hotline, setHotline] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vione_system_hotline") || "0988 123 456";
    }
    return "0988 123 456";
  });
  const [slogan, setSlogan] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vione_system_slogan") || "Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện";
    }
    return "Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện";
  });

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Integrations state
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    zalo: true,
    googleWorkspace: true,
    microsoftTeams: false,
    slack: false,
  });

  const [saving, setSaving] = useState(false);

  // Change password modal states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const loadSettings = useServerFn(getSettingsFn);
  const persistSettings = useServerFn(saveSettingsFn);

  // Load complete system settings from backend database
  useEffect(() => {
    let active = true;

    async function fetchSystemConfig() {
      try {
        // 1. Fetch from /settings/system REST API
        const res = await fetchNestApi<any>("/settings/system").catch(() => null);
        if (res && res.data && active) {
          const d = res.data;
          if (d.orgName) setOrgName(d.orgName);
          if (d.orgEmail) setEmail(d.orgEmail);
          if (d.websiteUrl) setWebsiteUrl(d.websiteUrl);
          if (d.hotline) setHotline(d.hotline);
          if (d.slogan) setSlogan(d.slogan);
          if (d.lang) setLang(d.lang as any);
          if (d.emailNotif !== undefined) setEmailNotif(Boolean(d.emailNotif));
          if (d.smsNotif !== undefined) setSmsNotif(Boolean(d.smsNotif));
          if (d.twoFa !== undefined) setTwoFA(Boolean(d.twoFa));
          if (d.logoUrl) setLogoUrl(d.logoUrl);
          if (d.integrations) {
            setIntegrations((prev) => ({
              ...prev,
              ...d.integrations,
            }));
          }
          return;
        }

        // 2. Fallback to server function if API endpoint fails
        const s = await loadSettings();
        if (!active) return;
        if (s.orgName) setOrgName(s.orgName);
        if (s.orgEmail) setEmail(s.orgEmail);
        if (s.websiteUrl) setWebsiteUrl(s.websiteUrl);
        if (s.hotline) setHotline(s.hotline);
        if (s.slogan) setSlogan(s.slogan);
        setEmailNotif(s.emailNotif);
        setSmsNotif(s.smsNotif);
        setTwoFA(s.twoFa);
        setLang(s.lang);
        if (s.integrations) setIntegrations(s.integrations);
      } catch (err) {
        console.warn("[SettingsPage] Error loading settings:", err);
      }
    }

    fetchSystemConfig();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save all system configuration directly into PostgreSQL
  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        orgName: orgName.trim(),
        orgEmail: email.trim(),
        websiteUrl: websiteUrl.trim(),
        hotline: hotline.trim(),
        slogan: slogan.trim(),
        lang,
        emailNotif,
        smsNotif,
        twoFa: twoFA,
        logoUrl,
        integrations,
      };

      // 1. Direct NestJS API call to persist to PostgreSQL app_settings, associations & user_settings
      await fetchNestApi("/settings/system", {
        method: "PUT",
        body: JSON.stringify(payload),
      }).catch(async (apiErr) => {
        console.warn("[SettingsPage] API PUT error, trying server function fallback:", apiErr);
        await persistSettings({ data: payload });
      });

      // 2. Cache in localStorage & dispatch reactive events across tabs & components
      if (typeof window !== "undefined") {
        localStorage.setItem("vba_active_assoc_name", orgName);
        localStorage.setItem("vione_system_website", websiteUrl);
        localStorage.setItem("vione_system_hotline", hotline);
        localStorage.setItem("vione_system_slogan", slogan);
        window.dispatchEvent(
          new CustomEvent("association-changed", {
            detail: { name: orgName, websiteUrl, hotline, slogan },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("vione-settings-updated", {
            detail: { orgName, websiteUrl, hotline, slogan },
          }),
        );
      }
      toast.success("✓ Đã lưu thành công mọi thay đổi cấu hình vào hệ thống CSDL!");
    } catch (err: any) {
      console.error("[SettingsPage] Failed to save settings:", err);
      toast.error(err?.message || "Không thể lưu cài đặt hệ thống");
    } finally {
      setSaving(false);
    }
  };

  // Toggle third-party integration connection
  const handleToggleIntegration = async (key: string) => {
    const nextIntegrations = {
      ...integrations,
      [key]: !integrations[key],
    };
    setIntegrations(nextIntegrations);

    try {
      await fetchNestApi("/settings/system", {
        method: "PUT",
        body: JSON.stringify({
          orgName,
          orgEmail: email,
          websiteUrl,
          hotline,
          slogan,
          lang,
          emailNotif,
          smsNotif,
          twoFa: twoFA,
          logoUrl,
          integrations: nextIntegrations,
        }),
      });
      toast.success(
        nextIntegrations[key]
          ? `✓ Đã kết nối thành công dịch vụ tích hợp!`
          : `Đã ngắt kết nối dịch vụ tích hợp.`,
      );
    } catch (err) {
      console.error("[SettingsPage] Error toggling integration:", err);
      toast.error("Không thể cập nhật trạng thái tích hợp");
    }
  };

  // Handle Change Password submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp");
      return;
    }

    setSubmittingPassword(true);
    try {
      const res: any = await fetchNestApi("/settings/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newPassword,
        }),
      });
      toast.success(res?.message || "✓ Đổi mật khẩu thành công!");
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("[SettingsPage] Error changing password:", err);
      toast.error(err?.message || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title={t("set.title")} subtitle={t("set.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
        <Card className="p-2 h-fit">
          <nav className="space-y-1">
            {TABS.map((tt) => {
              const Icon = tt.icon;
              const active = tab === tt.key;
              return (
                <button
                  key={tt.key}
                  onClick={() => setTab(tt.key)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs lg:text-sm font-medium transition cursor-pointer ${
                    active
                      ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-amber-400" : ""}`} />
                  <span>{t(tt.label as TKey)}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        <Card className="p-6">
          {/* TAB 1: THÔNG TIN TỔ CHỨC / CẤU HÌNH CHUNG */}
          {tab === "general" && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground">
                  {t("set.org.title")}
                </h3>
                <p className="text-xs text-muted-foreground">{t("set.org.desc")}</p>
              </div>

              {/* Logo Management */}
              <AssociationLogoUploader />

              {/* Website chính / Tên miền hệ thống */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Website chính / Tên miền hệ thống ViOne
                  </label>
                  {websiteUrl && (
                    <a
                      href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 hover:text-amber-400 hover:underline"
                    >
                      <span>Mở Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://vione.vn"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-mono"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Tên miền chính thức của doanh nghiệp hiển thị trên danh thiếp số, mã QR và cổng portal. Dữ liệu này được lưu trực tiếp vào CSDL hệ thống.
                </p>
              </div>

              {/* Tên tổ chức / Doanh nghiệp */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t("set.org.name")}
                </label>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Hotline & Email CSKH */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    Hotline CSKH / Tổng đài
                  </label>
                  <input
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    placeholder="0988 123 456"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    {t("set.org.email")}
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@vione.vn"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              {/* Slogan / Định vị thương hiệu */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Slogan & Tuyên ngôn thương hiệu
                </label>
                <input
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Ngôn ngữ mặc định */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t("set.org.lang")}
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium focus:border-amber-400 focus:outline-none"
                >
                  <option value="vi">Tiếng Việt (Mặc định)</option>
                  <option value="en">English</option>
                  <option value="lo">ພາສາລາວ</option>
                  <option value="km">ភាសាខ្មែរ</option>
                  <option value="my">မြန်မာဘာသာ</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: LANDING PAGE */}
          {tab === "landing" && <AssociationLandingEditor />}

          {/* TAB 3: CUSTOM DOMAIN */}
          {tab === "domain" && <AssociationDomainEditor />}

          {/* TAB 4: MẪU PHẢN HỒI */}
          {tab === "templates" && <ReplyTemplatesEditor />}

          {/* TAB 5: THÔNG BÁO */}
          {tab === "notifications" && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground">
                  {t("set.notif.title")}
                </h3>
                <p className="text-xs text-muted-foreground">{t("set.notif.desc")}</p>
              </div>
              <ToggleRow
                icon={Mail}
                label={t("set.notif.email")}
                desc={t("set.notif.emailDesc")}
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <ToggleRow
                icon={Bell}
                label={t("set.notif.sms")}
                desc={t("set.notif.smsDesc")}
                checked={smsNotif}
                onChange={setSmsNotif}
              />
            </div>
          )}

          {/* TAB 6: BẢO MẬT & MẬT KHẨU */}
          {tab === "security" && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground">
                  {t("set.sec.title")}
                </h3>
                <p className="text-xs text-muted-foreground">{t("set.sec.desc")}</p>
              </div>
              <ToggleRow
                icon={Lock}
                label={t("set.sec.2fa")}
                desc={t("set.sec.2faDesc")}
                checked={twoFA}
                onChange={setTwoFA}
              />
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D8B282]/40 bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 transition cursor-pointer"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{t("common.changePassword") || "Đổi mật khẩu tài khoản"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: TÍCH HỢP HỆ THỐNG */}
          {tab === "integrations" && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground">
                  {t("set.int.title")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Quản lý kết nối các nền tảng của bên thứ ba vào hệ sinh thái ViOne Platform. Mọi thay đổi đều được lưu trực tiếp vào CSDL.
                </p>
              </div>

              <div className="space-y-3">
                {INTEGRATION_DEFS.map((item) => {
                  const isConnected = Boolean(integrations[item.key]);
                  return (
                    <div
                      key={item.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border p-4 transition hover:border-amber-500/40 bg-card/60"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {item.name}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isConnected
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isConnected ? "Đang kết nối" : "Chưa kích hoạt"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleIntegration(item.key)}
                        className={`inline-flex items-center justify-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                          isConnected
                            ? "border border-border bg-background text-foreground hover:bg-muted"
                            : "font-bold text-[#050C15] shadow-sm hover:brightness-105"
                        }`}
                        style={
                          isConnected
                            ? undefined
                            : {
                                background:
                                  "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
                              }
                        }
                      >
                        {isConnected ? t("common.disconnect") || "Ngắt kết nối" : t("common.connect") || "Kết nối ngay"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NÚT LƯU THAY ĐỔI CẤU HÌNH (ÁP DỤNG CHO GENERAL, NOTIFICATIONS, SECURITY, INTEGRATIONS) */}
          {tab !== "landing" && tab !== "domain" && tab !== "templates" && (
            <div className="mt-8 flex justify-end border-t border-border pt-5">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[#050C15] shadow-md hover:brightness-105 transition disabled:opacity-50 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
                }}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{saving ? "Đang lưu vào CSDL..." : "Lưu Thay Đổi Cấu Hình"}</span>
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* MODAL ĐỔI MẬT KHẨU TÀI KHOẢN */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-foreground">Đổi Mật Khẩu Tài Khoản</h3>
              </div>
              <button
                type="button"
                onClick={() => setChangePasswordOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Mật khẩu hiện tại (nếu có)
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-[#050C15] shadow-sm hover:brightness-105 transition disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F6E1C3 0%, #D8B282 50%, #C29B69 100%)",
                  }}
                >
                  {submittingPassword ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  <span>{submittingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-card/60">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-amber-400" />
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="text-[11px] text-muted-foreground">{desc}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition cursor-pointer ${
          checked ? "bg-amber-500" : "bg-secondary"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
