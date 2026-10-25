import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * 1. Tổng quan điều hành (Executive KPI)
   */
  @Get('overview')
  async getOverview(@Query('companyId') companyId?: string) {
    return this.analyticsService.getExecutiveOverview(companyId);
  }

  /**
   * 2. Thống kê Vận hành & Tiến độ công việc
   */
  @Get('operations')
  async getOperationsStats(@Query('companyId') companyId?: string) {
    return this.analyticsService.getOperationsStats(companyId);
  }

  /**
   * 3. Thống kê Nhân sự & Điểm danh chấm công
   */
  @Get('attendance')
  async getAttendanceStats(@Query('companyId') companyId?: string) {
    return this.analyticsService.getAttendanceStats(companyId);
  }

  /**
   * 4. Thống kê Tài chính & Thu chi dòng tiền
   */
  @Get('finance')
  async getFinanceStats() {
    return this.analyticsService.getFinanceStats();
  }

  /**
   * 5. Thống kê Khách hàng & Cơ hội kinh doanh (CRM)
   */
  @Get('crm')
  async getCrmStats() {
    return this.analyticsService.getCrmStats();
  }

  /**
   * 6. Thống kê Nền tảng & Gói cước (Dành cho Super Admin)
   */
  @Get('platform')
  async getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }
}
