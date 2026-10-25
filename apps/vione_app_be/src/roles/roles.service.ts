import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Lấy danh sách tất cả các vai trò trong hệ thống kèm số lượng thành viên thực tế
   */
  async listRoles() {
    try {
      const roles = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          r.id,
          r.code,
          r.name,
          r.description,
          r.level,
          r.is_system as "isSystem",
          r.created_at as "createdAt",
          COALESCE((
            SELECT COUNT(DISTINCT user_id)::int 
            FROM public.user_roles ur 
            WHERE ur.role::text = r.code
          ), 0) + 
          COALESCE((
            SELECT COUNT(*)::int 
            FROM public.company_employees ce 
            WHERE ce.role = r.code
          ), 0) as "memberCount"
        FROM public.platform_roles r
        ORDER BY r.level ASC, r.created_at ASC
      `);

      return {
        ok: true,
        items: roles,
      };
    } catch (err) {
      this.logger.error('Error listing roles:', err);
      return { ok: false, items: [] };
    }
  }

  /**
   * 2. Lấy ma trận phân quyền chi tiết (Roles x Permissions x Actions)
   */
  async getPermissionsMatrix() {
    try {
      // Danh sách tất cả quyền
      const permissions = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT id, module, action, name, description
        FROM public.platform_permissions
        ORDER BY module ASC, action ASC
      `);

      // Danh sách tất cả vai trò
      const roles = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT id, code, name, description, level, is_system as "isSystem"
        FROM public.platform_roles
        ORDER BY level ASC
      `);

      // Các quyền đã được gán cho từng vai trò
      const rolePerms = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT role_id as "roleId", permission_id as "permissionId"
        FROM public.platform_role_permissions
      `);

      // Xây dựng ma trận tra cứu nhanh { [roleId]: { [permissionId]: true } }
      const matrix: Record<string, Record<string, boolean>> = {};
      for (const r of roles) {
        matrix[r.id] = {};
      }
      for (const rp of rolePerms) {
        if (!matrix[rp.roleId]) {
          matrix[rp.roleId] = {};
        }
        matrix[rp.roleId][rp.permissionId] = true;
      }

      // Nhóm permissions theo module
      const modulesMap: Record<string, any[]> = {};
      for (const p of permissions) {
        if (!modulesMap[p.module]) {
          modulesMap[p.module] = [];
        }
        modulesMap[p.module].push(p);
      }

      return {
        ok: true,
        roles,
        permissions,
        modulesMap,
        matrix,
      };
    } catch (err) {
      this.logger.error('Error getting permissions matrix:', err);
      return { ok: false, roles: [], permissions: [], matrix: {} };
    }
  }

  /**
   * 3. Cập nhật phân quyền cho một vai trò
   */
  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    try {
      // 1. Xóa toàn bộ quyền cũ của vai trò này
      await this.prisma.$executeRawUnsafe(
        `DELETE FROM public.platform_role_permissions WHERE role_id = $1::uuid`,
        roleId,
      );

      // 2. Chèn các quyền mới
      if (Array.isArray(permissionIds) && permissionIds.length > 0) {
        for (const permId of permissionIds) {
          await this.prisma.$executeRawUnsafe(
            `INSERT INTO public.platform_role_permissions (role_id, permission_id) 
             VALUES ($1::uuid, $2::uuid) ON CONFLICT DO NOTHING`,
            roleId,
            permId,
          );
        }
      }

      return {
        ok: true,
        message: 'Cập nhật ma trận phân quyền thành công!',
        roleId,
        assignedCount: permissionIds.length,
      };
    } catch (err) {
      this.logger.error('Error updating role permissions:', err);
      throw new BadRequestException('Không thể cập nhật phân quyền: ' + (err as Error).message);
    }
  }

  /**
   * 4. Tạo vai trò mới
   */
  async createRole(data: { code: string; name: string; description?: string; level?: number }) {
    if (!data.code?.trim() || !data.name?.trim()) {
      throw new BadRequestException('Mã vai trò và tên vai trò không được để trống');
    }

    const code = data.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM public.platform_roles WHERE code = $1 LIMIT 1`,
      code,
    );
    if (existing.length > 0) {
      throw new BadRequestException(`Mã vai trò "${code}" đã tồn tại trên hệ thống`);
    }

    const roleId = crypto.randomUUID();
    const level = data.level || 4;

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO public.platform_roles (id, code, name, description, level, is_system, created_at, updated_at) 
       VALUES ($1::uuid, $2, $3, $4, $5, false, now(), now())`,
      roleId,
      code,
      data.name.trim(),
      data.description?.trim() || null,
      level,
    );

    return {
      id: roleId,
      code,
      name: data.name.trim(),
      description: data.description?.trim() || '',
      level,
      isSystem: false,
      memberCount: 0,
    };
  }

  /**
   * 5. Lấy danh sách quyền hiệu lực của người dùng
   */
  async getUserEffectivePermissions(userId: string) {
    if (!userId) return [];
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT DISTINCT p.module, p.action, (p.module || ':' || p.action) as "key"
        FROM public.platform_permissions p
        JOIN public.platform_role_permissions rp ON rp.permission_id = p.id
        JOIN public.platform_roles r ON r.id = rp.role_id
        WHERE r.code IN (
          SELECT role::text FROM public.user_roles WHERE user_id = $1::uuid
          UNION
          SELECT role FROM public.company_employees WHERE user_id = $1::text
        )
      `, userId);

      return rows.map(r => r.key);
    } catch (err) {
      this.logger.error('Error getting user permissions:', err);
      return [];
    }
  }
}
