import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { SettingsService, SystemConfigDto } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Lấy cấu hình hệ thống & doanh nghiệp
   */
  @Get('system')
  async getSystemSettings(@Request() req: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'];
    return this.settingsService.getSystemSettings(userId);
  }

  /**
   * Lưu / Cập nhật cấu hình hệ thống & doanh nghiệp
   */
  @Put('system')
  async saveSystemSettings(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'];
    return this.settingsService.saveSystemSettings(body, userId);
  }

  /**
   * Đổi mật khẩu tài khoản
   */
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() body: { currentPassword?: string; newPassword: string },
  ) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    return this.settingsService.changePassword(userId, body);
  }
}
