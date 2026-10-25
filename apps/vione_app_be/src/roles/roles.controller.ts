import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';

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
   * Lấy quyền hiệu lực của người dùng hiện tại
   */
  @Get('my-permissions')
  async getMyPermissions(@Request() req: any) {
    const userId = req.user?.id || req.headers?.['x-user-id'] || 'a0000000-0000-4000-8000-000000000002';
    const permissions = await this.rolesService.getUserEffectivePermissions(userId);
    return {
      ok: true,
      userId,
      permissions,
    };
  }
}
