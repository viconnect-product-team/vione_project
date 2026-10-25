import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * Kiểm tra người dùng đã đăng ký mua gói ViOne Platform chưa
   */
  @Get('subscription-status')
  async getSubscriptionStatus(@Request() req: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || '00000000-0000-0000-0000-000000000002';
    return this.companiesService.checkPlatformSubscription(userId);
  }

  /**
   * Đăng ký mua / Kích hoạt gói ViOne Platform
   */
  @Post('subscribe-package')
  async subscribePackage(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    return this.companiesService.subscribePlatformPackage(userId, body);
  }

  /**
   * Lấy danh sách doanh nghiệp
   * CHỈ KHI NÀO ĐĂNG KÝ GÓI VIONE PLATFORM THÌ MỚI CÓ DỮ LIỆU!
   */
  @Get()
  async listCompanies(@Request() req: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    return this.companiesService.listCompanies(userId);
  }

  /**
   * Danh sách các gói cước ViOne Platform
   */
  @Get('packages')
  async listPackages() {
    return this.companiesService.listSubscriptionPackages();
  }

  /**
   * SUPER ADMIN: GIÁM SÁT NỀN TẢNG & MỨC ĐỘ HOẠT ĐỘNG CÁC DOANH NGHIỆP CÓ GÓI VIONE
   */
  @Get('platform-monitoring')
  async getPlatformMonitoring() {
    return this.companiesService.getPlatformMonitoring();
  }

  /**
   * SUPER ADMIN: CẬP NHẬT / GIA HẠN / MỞ KHÓA GÓI CƯỚC DOANH NGHIỆP
   */
  @Patch(':id/subscription')
  async updateSubscription(
    @Param('id') companyId: string,
    @Body() body: any,
  ) {
    return this.companiesService.updateCompanySubscription(companyId, body);
  }

  /**
   * Lấy chi tiết hồ sơ một doanh nghiệp
   */
  @Get(':id')
  async getCompanyById(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id || req.headers?.['x-user-id'];
    return this.companiesService.getCompanyById(id, userId);
  }

  /**
   * Kiểm tra hạn mức Slots tài khoản của doanh nghiệp
   */
  @Get(':id/slot-usage')
  async getSlotUsage(@Param('id') companyId: string) {
    return this.companiesService.getCompanySlotUsage(companyId);
  }

  /**
   * 1. QUẢN LÝ NHÂN VIÊN DOANH NGHIỆP
   */
  @Get(':id/employees')
  async listEmployees(@Param('id') companyId: string) {
    return this.companiesService.listCompanyEmployees(companyId);
  }

  @Post(':id/employees')
  async addEmployee(@Param('id') companyId: string, @Body() body: any) {
    return this.companiesService.addCompanyEmployee(companyId, body);
  }

  @Patch(':id/employees/:employeeId')
  async updateEmployee(
    @Param('id') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() body: any,
  ) {
    return this.companiesService.updateCompanyEmployee(companyId, employeeId, body);
  }

  @Delete(':id/employees/:employeeId')
  async deleteEmployee(
    @Param('id') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.companiesService.deleteCompanyEmployee(companyId, employeeId);
  }

  /**
   * 2. GIAO VIỆC & PHÂN CÔNG NHIỆM VỤ DOANH NGHIỆP
   */
  @Get(':id/tasks')
  async listTasks(
    @Param('id') companyId: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    return this.companiesService.listCompanyTasks(companyId, { status, priority, assigneeId });
  }

  @Post(':id/tasks')
  async createTask(
    @Request() req: any,
    @Param('id') companyId: string,
    @Body() body: any,
  ) {
    const assignerName = req.user?.name || 'Ban Lãnh Đạo Doanh Nghiệp';
    return this.companiesService.createCompanyTask(companyId, { ...body, assignerName });
  }

  /**
   * Giao việc hàng loạt (Bulk task dispatch) cho 1 hoặc nhiều người
   */
  @Post(':id/tasks/bulk')
  async createTasksBulk(
    @Request() req: any,
    @Param('id') companyId: string,
    @Body() body: any,
  ) {
    const assignerName = req.user?.name || 'Ban Lãnh Đạo Doanh Nghiệp';
    return this.companiesService.createCompanyTasksBulk(companyId, { ...body, assignerName });
  }

  @Patch(':id/tasks/:taskId/status')
  async updateTaskStatus(
    @Param('id') companyId: string,
    @Param('taskId') taskId: string,
    @Body('status') status: string,
  ) {
    return this.companiesService.updateCompanyTaskStatus(companyId, taskId, status);
  }
}
