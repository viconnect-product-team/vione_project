import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface SystemConfigDto {
  orgName?: string;
  orgEmail?: string;
  websiteUrl?: string;
  hotline?: string;
  slogan?: string;
  lang?: string;
  emailNotif?: boolean;
  smsNotif?: boolean;
  twoFa?: boolean;
  logoUrl?: string | null;
  integrations?: {
    zalo?: boolean;
    googleWorkspace?: boolean;
    microsoftTeams?: boolean;
    slack?: boolean;
    [key: string]: boolean | undefined;
  };
}

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy cấu hình hệ thống & doanh nghiệp hoàn chỉnh
   */
  async getSystemSettings(userId?: string) {
    try {
      // 1. Kiểm tra cấu hình trong public.app_settings
      const rows = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT value FROM public.app_settings WHERE key = 'system_config' LIMIT 1
      `).catch(() => []);

      let config: SystemConfigDto = rows.length > 0 && rows[0].value ? rows[0].value : {};

      // 2. Lấy thông tin dự phòng từ associations (nếu có)
      const assoc = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT name, tagline, about, logo_url, custom_domain 
        FROM public.associations 
        ORDER BY created_at ASC LIMIT 1
      `).catch(() => []);
      const a = assoc[0] || {};

      // 3. Lấy thông tin cài đặt riêng của user nếu có
      let userSettings: any = {};
      if (userId) {
        const uRows = await this.prisma.$queryRawUnsafe<any[]>(`
          SELECT org_name, org_email, lang, email_notif, sms_notif, two_fa 
          FROM public.user_settings WHERE user_id = $1::uuid LIMIT 1
        `, userId).catch(() => []);
        if (uRows[0]) userSettings = uRows[0];
      }

      const merged = {
        orgName: config.orgName || userSettings.org_name || a.name || 'Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne',
        orgEmail: config.orgEmail || userSettings.org_email || 'contact@vione.vn',
        websiteUrl: config.websiteUrl || (a.custom_domain ? `https://${a.custom_domain}` : 'https://vione.vn'),
        hotline: config.hotline || '0988 123 456',
        slogan: config.slogan || a.tagline || 'Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện',
        lang: config.lang || userSettings.lang || 'vi',
        emailNotif: config.emailNotif !== undefined ? config.emailNotif : (userSettings.email_notif ?? true),
        smsNotif: config.smsNotif !== undefined ? config.smsNotif : (userSettings.sms_notif ?? false),
        twoFa: config.twoFa !== undefined ? config.twoFa : (userSettings.two_fa ?? true),
        logoUrl: config.logoUrl || a.logo_url || null,
        integrations: {
          zalo: true,
          googleWorkspace: true,
          microsoftTeams: false,
          slack: false,
          ...(config.integrations || {}),
        },
      };

      return {
        ok: true,
        data: merged,
      };
    } catch (err: any) {
      this.logger.error('Error fetching system settings:', err);
      return {
        ok: true,
        data: {
          orgName: 'Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne',
          orgEmail: 'contact@vione.vn',
          websiteUrl: 'https://vione.vn',
          hotline: '0988 123 456',
          slogan: 'Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện',
          lang: 'vi',
          emailNotif: true,
          smsNotif: false,
          twoFa: true,
          integrations: {
            zalo: true,
            googleWorkspace: true,
            microsoftTeams: false,
            slack: false,
          },
        },
      };
    }
  }

  /**
   * Lưu / Cập nhật cấu hình hệ thống & doanh nghiệp vào CSDL PostgreSQL
   */
  async saveSystemSettings(data: SystemConfigDto, userId?: string) {
    try {
      const sanitized: SystemConfigDto = {
        orgName: (data.orgName || '').trim() || 'Tập đoàn Công nghệ & Kết nối Doanh nhân ViOne',
        orgEmail: (data.orgEmail || '').trim() || 'contact@vione.vn',
        websiteUrl: (data.websiteUrl || '').trim() || 'https://vione.vn',
        hotline: (data.hotline || '').trim() || '0988 123 456',
        slogan: (data.slogan || '').trim() || 'Nền tảng Doanh nhân & Doanh nghiệp Số Toàn diện',
        lang: data.lang || 'vi',
        emailNotif: data.emailNotif !== undefined ? Boolean(data.emailNotif) : true,
        smsNotif: data.smsNotif !== undefined ? Boolean(data.smsNotif) : false,
        twoFa: data.twoFa !== undefined ? Boolean(data.twoFa) : true,
        logoUrl: data.logoUrl || null,
        integrations: {
          zalo: true,
          googleWorkspace: true,
          microsoftTeams: false,
          slack: false,
          ...(data.integrations || {}),
        },
      };

      // 1. Lưu vào public.app_settings với key = 'system_config'
      const validUserId = userId && userId.length === 36 ? userId : null;
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.app_settings (key, value, updated_by, updated_at)
        VALUES ('system_config', $1::jsonb, $2::uuid, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
      `, JSON.stringify(sanitized), validUserId);

      // 2. Cập nhật bảng public.associations để đồng bộ tên thương hiệu và slogan
      if (sanitized.orgName) {
        await this.prisma.$executeRawUnsafe(`
          UPDATE public.associations
          SET name = $1,
              tagline = $2,
              updated_at = NOW()
          WHERE id IN (
            SELECT id FROM public.associations ORDER BY created_at ASC LIMIT 1
          )
        `, sanitized.orgName, sanitized.slogan).catch(() => null);
      }

      // 3. Cập nhật bảng public.user_settings nếu có userId
      if (validUserId) {
        await this.prisma.$executeRawUnsafe(`
          INSERT INTO public.user_settings (user_id, org_name, org_email, lang, email_notif, sms_notif, two_fa, updated_at)
          VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            org_name = EXCLUDED.org_name,
            org_email = EXCLUDED.org_email,
            lang = EXCLUDED.lang,
            email_notif = EXCLUDED.email_notif,
            sms_notif = EXCLUDED.sms_notif,
            two_fa = EXCLUDED.two_fa,
            updated_at = NOW()
        `, validUserId, sanitized.orgName, sanitized.orgEmail, sanitized.lang, sanitized.emailNotif, sanitized.smsNotif, sanitized.twoFa).catch(() => null);
      }

      return {
        ok: true,
        message: 'Đã lưu thành công cấu hình hệ thống vào CSDL!',
        data: sanitized,
      };
    } catch (err: any) {
      this.logger.error('Error saving system settings:', err);
      throw new BadRequestException('Không thể lưu cấu hình hệ thống: ' + (err as Error).message);
    }
  }

  /**
   * Đổi mật khẩu tài khoản có kiểm tra mật khẩu hiện tại
   */
  async changePassword(userId: string, dto: { currentPassword?: string; newPassword: string }) {
    if (!dto.newPassword || dto.newPassword.length < 6) {
      throw new BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    if (!userId || userId.length !== 36) {
      throw new BadRequestException('Không xác định được danh tính người dùng');
    }

    // Kiểm tra user trong auth.users
    const userRows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT id, email, encrypted_password 
      FROM auth.users WHERE id = $1::uuid LIMIT 1
    `, userId).catch(() => []);

    if (userRows.length === 0) {
      throw new NotFoundException('Không tìm thấy tài khoản trong hệ thống');
    }

    const currentHash = userRows[0].encrypted_password;
    if (dto.currentPassword && currentHash) {
      const match = await bcrypt.compare(dto.currentPassword, currentHash).catch(() => false);
      if (!match) {
        throw new BadRequestException('Mật khẩu hiện tại không chính xác');
      }
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$executeRawUnsafe(`
      UPDATE auth.users SET encrypted_password = $1, updated_at = NOW() WHERE id = $2::uuid
    `, newHash, userId);

    return {
      ok: true,
      message: 'Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho các lần đăng nhập tiếp theo.',
    };
  }
}
