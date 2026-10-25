import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
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
  async listPackages(@Query('includeInactive') includeInactive?: string) {
    return this.companiesService.listSubscriptionPackages(includeInactive === 'true');
  }

  /**
   * SUPER ADMIN / STAFF: Tạo gói dịch vụ ViOne mới
   */
  @Post('packages')
  async createPackage(@Body() body: any) {
    return this.companiesService.createSubscriptionPackage(body);
  }

  /**
   * SUPER ADMIN / STAFF: Cập nhật gói dịch vụ
   */
  @Put('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() body: any) {
    return this.companiesService.updateSubscriptionPackage(id, body);
  }

  /**
   * SUPER ADMIN / STAFF: Xóa / Ẩn gói dịch vụ
   */
  @Delete('packages/:id')
  async deletePackage(@Param('id') id: string) {
    return this.companiesService.deleteSubscriptionPackage(id);
  }

  /**
   * APP VIONE USER: Gửi hồ sơ đăng ký gói cước từ App ViOne
   */
  @Post('package-orders')
  async createPackageOrder(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    return this.companiesService.createPackageOrder(userId, body);
  }

  /**
   * SUPER ADMIN / STAFF: Danh sách hồ sơ đăng ký gói
   */
  @Get('package-orders')
  async listPackageOrders(@Query('status') status?: string) {
    return this.companiesService.listPackageOrders(status);
  }

  /**
   * SUPER ADMIN / STAFF: Xem chi tiết 1 hồ sơ đăng ký gói
   */
  @Get('package-orders/:id')
  async getPackageOrder(@Param('id') id: string) {
    return this.companiesService.getPackageOrder(id);
  }

  /**
   * SUPER ADMIN / STAFF: Phê duyệt hồ sơ đăng ký gói & Bắn email cho khách hàng
   */
  @Post('package-orders/:id/approve')
  async approvePackageOrder(@Request() req: any, @Param('id') id: string) {
    const approvedBy = req.user?.id || req.headers?.['x-user-id'] || null;
    return this.companiesService.approvePackageOrder(id, approvedBy);
  }

  /**
   * SUPER ADMIN / STAFF: Từ chối hồ sơ đăng ký gói
   */
  @Post('package-orders/:id/reject')
  async rejectPackageOrder(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.companiesService.rejectPackageOrder(id, body?.reason);
  }

  /**
   * SUPER ADMIN: GIÁM SÁT NỀN TẢNG & MỨC ĐỘ HOẠT ĐỘNG CÁC DOANH NGHIỆP CÓ GÓI VIONE
   */
  @Get('platform-monitoring')
  async getPlatformMonitoring() {
    return this.companiesService.getPlatformMonitoring();
  }

  /**
   * SUPER ADMIN: TRUNG TÂM THỐNG KÊ BÁO CÁO NỀN TẢNG TOÀN DIỆN (Dashboard, Biểu đồ cột/tròn, Cây đơn vị, Báo cáo tài khoản, Báo cáo tài liệu, Báo cáo dòng tiền)
   */
  @Get('platform-reports')
  async getPlatformReports() {
    return this.companiesService.getPlatformReports();
  }

  /**
   * SUPER ADMIN: TẠO CỘNG ĐỒNG CHO TÀI KHOẢN MUA GÓI VIONE PLATFORM
   */
  @Post('platform/communities')
  async createPlatformCommunity(@Body() body: any) {
    return this.companiesService.createPlatformCommunity(body);
  }

  /**
   * SUPER ADMIN: CẬP NHẬT THÔNG TIN CỘNG ĐỒNG
   */
  @Patch('platform/communities/:id')
  async updatePlatformCommunity(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.companiesService.updatePlatformCommunity(id, body);
  }

  /**
   * SUPER ADMIN: XÓA CỘNG ĐỒNG
   */
  @Delete('platform/communities/:id')
  async deletePlatformCommunity(@Param('id') id: string) {
    return this.companiesService.deletePlatformCommunity(id);
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
