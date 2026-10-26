import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { RolesService, ProvisionStaffDto } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Danh sách tất cả các vai trò trong hệ thống
   */
  @Get()
  async listRoles() {
    return this.rolesService.listRoles();
  }

  /**
   * Lấy ma trận phân quyền chi tiết (Roles x Permissions x Actions)
   */
  @Get('permissions-matrix')
  async getPermissionsMatrix() {
    return this.rolesService.getPermissionsMatrix();
  }

  /**
   * Lấy danh sách modules và danh sách thao tác con (cho Popup phân quyền)
   */
  @Get('modules-actions')
  async getModulesAndActions() {
    return this.rolesService.getModulesAndActions();
  }

  /**
   * Danh sách nhóm quyền kèm quyền đã gán (cho Quản lý nhóm quyền)
   */
  @Get('groups')
  async listRoleGroups() {
    return this.rolesService.listRoleGroups();
  }

  /**
   * Tạo nhóm quyền mới kèm các quyền được tích chọn
   */
  @Post('groups')
  async createRoleGroup(@Body() body: any) {
    return this.rolesService.createRoleGroup(body);
  }

  /**
   * Cập nhật nhóm quyền và quyền được tích chọn
   */
  @Put('groups/:id')
  async updateRoleGroup(@Param('id') id: string, @Body() body: any) {
    return this.rolesService.updateRoleGroup(id, body);
  }

  /**
   * Xóa nhóm quyền
   */
  @Delete('groups/:id')
  async deleteRoleGroup(@Param('id') id: string) {
    return this.rolesService.deleteRoleGroup(id);
  }

  /**
   * Cập nhật phân quyền cho một vai trò
   */
  @Put(':id/permissions')
  async updateRolePermissions(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.rolesService.updateRolePermissions(roleId, permissionIds);
  }

  /**
   * Tạo vai trò mới
   */
  @Post()
  async createRole(@Body() body: any) {
    return this.rolesService.createRole(body);
  }

  /**
   * Danh sách tài khoản nhân viên nội bộ ViOne
   */
  @Get('staff-accounts')
  async listStaffAccounts() {
    return this.rolesService.listStaffAccounts();
  }

  /**
   * Cấp tài khoản nhân viên ViOne mới (kèm multi-role & gửi email thông tin đăng nhập)
   */
  @Post('staff-accounts')
  async provisionStaffAccount(@Body() dto: ProvisionStaffDto, @Request() req: any) {
    const adminUserId = req.user?.id || req.headers?.['x-user-id'];
    return this.rolesService.provisionStaffAccount(dto, adminUserId);
  }

  /**
   * Cập nhật nhóm quyền cho nhân viên ViOne
   */
  @Put('staff-accounts/:id/roles')
  async updateStaffRoles(
    @Param('id') userId: string,
    @Body('roleCodes') roleCodes: string[],
  ) {
    return this.rolesService.updateStaffRoles(userId, roleCodes);
  }

  /**
   * Gửi lại email thông tin tài khoản và mật khẩu khởi tạo cho nhân viên ViOne
   */
  @Post('staff-accounts/:id/resend-credentials')
  async resendStaffCredentials(
    @Param('id') userId: string,
    @Body('password') newPassword?: string,
  ) {
    return this.rolesService.resendStaffCredentialsEmail(userId, newPassword);
  }

  /**
   * Lấy quyền hiệu lực và ngữ cảnh phân quyền đầy đủ của người dùng hiện tại
   */
  @Get('my-permissions')
  async getMyPermissions(@Request() req: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    const context = await this.rolesService.getUserRbacContext(userId);
    return {
      ok: true,
      userId,
      ...context,
    };
  }

  // ── ĐIỀU PHỐI PHÂN QUYỀN RIÊNG BIỆT TỪNG DOANH NGHIỆP (TENANT ISOLATED RBAC) ─

  /**
   * Danh sách vai trò / nhóm quyền của riêng doanh nghiệp
   */
  @Get('company/:companyId')
  async listCompanyRoles(@Param('companyId') companyId: string) {
    return this.rolesService.listCompanyRoles(companyId);
  }

  /**
   * Ma trận phân quyền riêng biệt của doanh nghiệp
   */
  @Get('company/:companyId/matrix')
  async getCompanyPermissionsMatrix(@Param('companyId') companyId: string) {
    return this.rolesService.getCompanyPermissionsMatrix(companyId);
  }

  /**
   * Danh sách nhân viên doanh nghiệp kèm phân quyền
   */
  @Get('company/:companyId/employees')
  async getCompanyEmployeesWithPermissions(@Param('companyId') companyId: string) {
    return this.rolesService.getCompanyEmployeesWithPermissions(companyId);
  }

  /**
   * Tạo nhóm quyền mới riêng cho doanh nghiệp
   */
  @Post('company/:companyId/groups')
  async createCompanyRoleGroup(
    @Param('companyId') companyId: string,
    @Body() body: any,
  ) {
    return this.rolesService.createCompanyRoleGroup(companyId, body);
  }

  /**
   * Cập nhật nhóm quyền của doanh nghiệp
   */
  @Put('company/:companyId/groups/:roleId')
  async updateCompanyRoleGroup(
    @Param('companyId') companyId: string,
    @Param('roleId') roleId: string,
    @Body() body: any,
  ) {
    return this.rolesService.updateCompanyRoleGroup(companyId, roleId, body);
  }

  /**
   * Xóa nhóm quyền của doanh nghiệp
   */
  @Delete('company/:companyId/groups/:roleId')
  async deleteCompanyRoleGroup(
    @Param('companyId') companyId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.rolesService.deleteCompanyRoleGroup(companyId, roleId);
  }

  /**
   * Cập nhật phân quyền cho một vai trò của doanh nghiệp
   */
  @Put('company/:companyId/:roleId/permissions')
  async updateCompanyRolePermissions(
    @Param('companyId') companyId: string,
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.rolesService.updateCompanyRoleGroup(companyId, roleId, { permissionIds });
  }

  /**
   * Cập nhật phân quyền trực tiếp cho nhân viên của doanh nghiệp
   */
  @Put('company/:companyId/employees/:employeeId/permissions')
  async updateCompanyEmployeePermissions(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() body: any,
  ) {
    return this.rolesService.updateCompanyEmployeePermissions(companyId, employeeId, body);
  }
}

