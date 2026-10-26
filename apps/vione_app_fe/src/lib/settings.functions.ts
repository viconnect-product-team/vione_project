// BC-Mobile — User settings server functions.
// Migrated from Supabase client to NestJS REST API.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireNestAuth } from "@/integrations/supabase/nest-auth-middleware";
import { fetchNestApiFromServer } from "./api-client";

export type VotingOpenPref = "same" | "new";

export type AppSettings = {
  orgName: string;
  orgEmail: string;
  websiteUrl: string;
  hotline: string;
  slogan: string;
  lang: "vi" | "en";
  emailNotif: boolean;
  smsNotif: boolean;
  twoFa: boolean;
  logoUrl?: string | null;
  integrations?: Record<string, boolean>;
};

const DEFAULTS: AppSettings = {
  orgName: "Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne",
  orgEmail: "contact@vione.vn",
  websiteUrl: "https://vione.vn",
  hotline: "0988 123 456",
  slogan: "Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện",
  lang: "vi",
  emailNotif: true,
  smsNotif: false,
  twoFa: true,
  integrations: {
    zalo: true,
    googleWorkspace: true,
    microsoftTeams: false,
    slack: false,
  },
};

export const getVotingOpenPrefFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .handler(async ({ context }): Promise<{ pref: VotingOpenPref | null }> => {
    const { token } = context as any;
    try {
      return await fetchNestApiFromServer<{ pref: VotingOpenPref | null }>(
        "/connect-app/me/voting-pref",
        token,
      );
    } catch {
      return { pref: null };
    }
  });

export const setVotingOpenPrefFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((input) => z.object({ pref: z.enum(["same", "new"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { token } = context as any;
    return fetchNestApiFromServer<{ ok: true }>("/connect-app/me/voting-pref", token, {
      method: "POST",
      body: JSON.stringify({ pref: data.pref }),
    });
  });

export const clearVotingOpenPrefFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .handler(async ({ context }) => {
    const { token } = context as any;
    return fetchNestApiFromServer<{ ok: true }>("/connect-app/me/voting-pref", token, {
      method: "POST",
      body: JSON.stringify({ pref: null }),
    });
  });

export const getSettingsFn = createServerFn({ method: "GET" })
  .middleware([requireNestAuth])
  .handler(async ({ context }): Promise<AppSettings> => {
    const { token } = context as any;
    try {
      // 1. Ưu tiên lấy từ /settings/system
      const sysRes = await fetchNestApiFromServer<{ ok: boolean; data: any }>("/settings/system", token).catch(() => null);
      if (sysRes && sysRes.data) {
        const d = sysRes.data;
        return {
          orgName: d.orgName || DEFAULTS.orgName,
          orgEmail: d.orgEmail || DEFAULTS.orgEmail,
          websiteUrl: d.websiteUrl || DEFAULTS.websiteUrl,
          hotline: d.hotline || DEFAULTS.hotline,
          slogan: d.slogan || DEFAULTS.slogan,
          lang: (d.lang || DEFAULTS.lang) as "vi" | "en",
          emailNotif: d.emailNotif ?? DEFAULTS.emailNotif,
          smsNotif: d.smsNotif ?? DEFAULTS.smsNotif,
          twoFa: d.twoFa ?? DEFAULTS.twoFa,
          logoUrl: d.logoUrl || null,
          integrations: d.integrations || DEFAULTS.integrations,
        };
      }

      // 2. Dự phòng /connect-app/me/settings
      const data = await fetchNestApiFromServer<any>("/connect-app/me/settings", token);
      return {
        orgName: data?.orgName ?? DEFAULTS.orgName,
        orgEmail: data?.orgEmail ?? DEFAULTS.orgEmail,
        websiteUrl: data?.websiteUrl ?? DEFAULTS.websiteUrl,
        hotline: data?.hotline ?? DEFAULTS.hotline,
        slogan: data?.slogan ?? DEFAULTS.slogan,
        lang: (data?.lang ?? DEFAULTS.lang) as "vi" | "en",
        emailNotif: data?.emailNotif ?? DEFAULTS.emailNotif,
        smsNotif: data?.smsNotif ?? DEFAULTS.smsNotif,
        twoFa: data?.twoFa ?? DEFAULTS.twoFa,
        integrations: DEFAULTS.integrations,
      };
    } catch {
      return DEFAULTS;
    }
  });

export const saveSettingsFn = createServerFn({ method: "POST" })
  .middleware([requireNestAuth])
  .inputValidator((input) =>
    z
      .object({
        orgName: z.string().max(200),
        orgEmail: z.string().max(200),
        websiteUrl: z.string().optional(),
        hotline: z.string().optional(),
        slogan: z.string().optional(),
        lang: z.enum(["vi", "en"]),
        emailNotif: z.boolean(),
        smsNotif: z.boolean(),
        twoFa: z.boolean(),
        logoUrl: z.string().nullable().optional(),
        integrations: z.record(z.boolean()).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { token } = context as any;
    // 1. Lưu vào /settings/system (Persist CSDL PostgreSQL: app_settings, associations, user_settings)
    await fetchNestApiFromServer<{ ok: true }>("/settings/system", token, {
      method: "PUT",
      body: JSON.stringify(data),
    }).catch(() => null);

    // 2. Lưu vào /connect-app/me/settings
    return fetchNestApiFromServer<{ ok: true }>("/connect-app/me/settings", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
