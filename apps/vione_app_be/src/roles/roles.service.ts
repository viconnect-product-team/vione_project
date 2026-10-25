import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class ProvisionStaffDto {
  fullName!: string;
  email!: string;
  phone?: string;
  password?: string;
  roleCodes!: string[];
  sendEmail?: boolean;
}

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

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
            FROM public.platform_user_roles pur 
            WHERE pur.role_code = r.code
          ), 0) +
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
   * 4. Lấy danh sách modules và các thao tác con (cho Popup tạo / sửa nhóm quyền)
   */
  async getModulesAndActions() {
    try {
      const permissions = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT id, module, action, name, description
        FROM public.platform_permissions
        ORDER BY module ASC, action ASC
      `);

      const moduleMetaMap: Record<string, { name: string; description: string }> = {
        attendance: { name: 'Chấm công & Điểm danh', description: 'Quản lý vào ca, ra ca, GPS và lịch sử chấm công' },
        employees: { name: 'Nhân sự & Thành viên', description: 'Quản lý nhân viên, hồ sơ, cấp tài khoản và vai trò' },
        finance: { name: 'Tài chính & Dòng tiền', description: 'Báo cáo doanh thu, chi phí, kế toán và dòng tiền' },
        roles: { name: 'Phân quyền & Nhóm quyền', description: 'Quản lý vai trò, nhóm quyền và ma trận quyền hạn' },
        settings: { name: 'Cài đặt hệ thống', description: 'Cấu hình nền tảng, thương hiệu và thông số' },
        statistics: { name: 'Báo cáo & Thống kê', description: 'Biểu đồ tăng trưởng, phân tích dữ liệu và dashboard' },
        subscriptions: { name: 'Gói dịch vụ & Doanh nghiệp', description: 'Quản lý đăng ký gói ViOne, dùng thử và hạn mức' },
        tasks: { name: 'Quản lý công việc', description: 'Giao việc, nhận việc, tiến độ và phê duyệt công việc' },
        meetings: { name: 'Quản lý cuộc họp', description: 'Lên lịch họp, phòng họp Zoom/Google Meet và biên bản' },
        documents: { name: 'Quản lý tài liệu số', description: 'Lưu trữ hợp đồng, tài liệu pháp lý và tài nguyên số' },
        news: { name: 'Bản tin & Bài đăng', description: 'Đăng tải thông báo, bài viết truyền thông và sự kiện' },
        crm: { name: 'Chăm sóc khách hàng CRM', description: 'Khách hàng tiềm năng, liên hệ, lịch hẹn và tương tác' },
        communities: { name: 'Cộng đồng ViOne Platform', description: 'Quản trị cộng đồng, kết nối B2B và thành viên' },
        ai: { name: 'Trợ lý AI Doanh nghiệp', description: 'Trợ lý trí tuệ nhân tạo, tự động hóa và tư vấn số' },
      };

      const modulesGrouped: Record<string, { module: string; moduleName: string; description: string; actions: any[] }> = {};

      for (const p of permissions) {
        if (!modulesGrouped[p.module]) {
          const meta = moduleMetaMap[p.module] || { name: p.module.toUpperCase(), description: '' };
          modulesGrouped[p.module] = {
            module: p.module,
            moduleName: meta.name,
            description: meta.description,
            actions: [],
          };
        }
        modulesGrouped[p.module].actions.push({
          id: p.id,
          action: p.action,
          name: p.name,
          description: p.description,
        });
      }

      return {
        ok: true,
        modules: Object.values(modulesGrouped),
        totalPermissions: permissions.length,
      };
    } catch (err) {
      this.logger.error('Error getting modules and actions:', err);
      return { ok: false, modules: [], totalPermissions: 0 };
    }
  }

  /**
   * 5. Lấy danh sách nhóm quyền (Role Groups) kèm permissionIds đã gán
   */
  async listRoleGroups() {
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
            FROM public.platform_user_roles pur 
            WHERE pur.role_code = r.code
          ), 0) +
          COALESCE((
            SELECT COUNT(DISTINCT user_id)::int 
            FROM public.user_roles ur 
            WHERE ur.role::text = r.code
          ), 0) + 
          COALESCE((
            SELECT COUNT(*)::int 
            FROM public.company_employees ce 
            WHERE ce.role = r.code
          ), 0) as "memberCount",
          COALESCE(
            (SELECT json_agg(rp.permission_id)
             FROM public.platform_role_permissions rp
             WHERE rp.role_id = r.id), '[]'::json
          ) as "permissionIds"
        FROM public.platform_roles r
        ORDER BY r.level ASC, r.created_at ASC
      `);

      return {
        ok: true,
        items: roles,
      };
    } catch (err) {
      this.logger.error('Error listing role groups:', err);
      return { ok: false, items: [] };
    }
  }

  /**
   * 6. Tạo nhóm quyền mới (kèm các thao tác con được tích chọn)
   */
  async createRoleGroup(data: { name: string; code?: string; description?: string; level?: number; permissionIds?: string[] }) {
    if (!data.name?.trim()) {
      throw new BadRequestException('Tên nhóm quyền không được để trống');
    }

    const baseCode = (data.code?.trim() || data.name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/(^_|_$)/g, '');

    let code = baseCode || `role_${Date.now().toString(36)}`;
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM public.platform_roles WHERE code = $1 LIMIT 1`,
      code,
    );
    if (existing.length > 0) {
      code = `${baseCode}_${Date.now().toString(36).slice(-4)}`;
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

    if (Array.isArray(data.permissionIds) && data.permissionIds.length > 0) {
      for (const permId of data.permissionIds) {
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
      message: 'Tạo nhóm quyền thành công!',
      role: {
        id: roleId,
        code,
        name: data.name.trim(),
        description: data.description?.trim() || '',
        level,
        isSystem: false,
        permissionIds: data.permissionIds || [],
        memberCount: 0,
      },
    };
  }

  /**
   * 7. Cập nhật nhóm quyền (tên, mô tả, cấp độ và danh sách permissionIds)
   */
  async updateRoleGroup(roleId: string, data: { name?: string; description?: string; level?: number; permissionIds?: string[] }) {
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, code, is_system as "isSystem" FROM public.platform_roles WHERE id = $1::uuid LIMIT 1`,
      roleId,
    );
    if (!existing || existing.length === 0) {
      throw new NotFoundException('Không tìm thấy nhóm quyền để cập nhật');
    }

    await this.prisma.$executeRawUnsafe(
      `UPDATE public.platform_roles 
       SET name = COALESCE($2, name), 
           description = COALESCE($3, description), 
           level = COALESCE($4, level),
           updated_at = now()
       WHERE id = $1::uuid`,
      roleId,
      data.name?.trim() || null,
      data.description !== undefined ? data.description.trim() : null,
      data.level || null,
    );

    if (Array.isArray(data.permissionIds)) {
      await this.prisma.$executeRawUnsafe(
        `DELETE FROM public.platform_role_permissions WHERE role_id = $1::uuid`,
        roleId,
      );
      for (const permId of data.permissionIds) {
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
      message: 'Cập nhật nhóm quyền thành công!',
    };
  }

  /**
   * 8. Xóa nhóm quyền
   */
  async deleteRoleGroup(roleId: string) {
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, code, is_system as "isSystem" FROM public.platform_roles WHERE id = $1::uuid LIMIT 1`,
      roleId,
    );
    if (!existing || existing.length === 0) {
      throw new NotFoundException('Không tìm thấy nhóm quyền để xóa');
    }
    if (existing[0].isSystem) {
      throw new BadRequestException('Không thể xóa vai trò hệ thống mặc định');
    }

    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.platform_role_permissions WHERE role_id = $1::uuid`,
      roleId,
    );
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.platform_user_roles WHERE role_code = $1`,
      existing[0].code,
    );
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.platform_roles WHERE id = $1::uuid`,
      roleId,
    );

    return {
      ok: true,
      message: 'Đã xóa nhóm quyền thành công!',
    };
  }

  /**
   * Alias createRole
   */
  async createRole(data: { code: string; name: string; description?: string; level?: number }) {
    return this.createRoleGroup(data);
  }

  /**
   * 5. Lấy danh sách quyền hiệu lực của người dùng (kết hợp platform_user_roles, user_roles, company_employees)
   */
  async getUserEffectivePermissions(userId: string): Promise<string[]> {
    if (!userId) return [];
    try {
      // 1. Kiểm tra nếu là super_admin / platform_admin -> cấp toàn bộ quyền
      const superCheck = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 1 FROM public.platform_user_roles WHERE user_id = $1::uuid AND role_code = 'super_admin'
        UNION
        SELECT 1 FROM public.user_roles WHERE user_id = $1::uuid AND role IN ('admin', 'platform_admin')
      `, userId);

      if (superCheck.length > 0) {
        const allPerms = await this.prisma.$queryRawUnsafe<any[]>(`
          SELECT DISTINCT (module || ':' || action) as "key" FROM public.platform_permissions
        `);
        const set = new Set<string>(allPerms.map(p => p.key));
        set.add('tasks:assign');
        set.add('finance:export');
        set.add('chat:access');
        return Array.from(set);
      }

      // 2. Quyền từ platform roles
      const rows = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT DISTINCT (p.module || ':' || p.action) as "key"
        FROM public.platform_permissions p
        JOIN public.platform_role_permissions rp ON rp.permission_id = p.id
        JOIN public.platform_roles r ON r.id = rp.role_id
        WHERE r.code IN (
          SELECT role_code FROM public.platform_user_roles WHERE user_id = $1::uuid
          UNION
          SELECT role::text FROM public.user_roles WHERE user_id = $1::uuid
          UNION
          SELECT role FROM public.company_employees WHERE user_id = $1::text
        )
      `, userId);

      const permsSet = new Set<string>(rows.map(r => r.key));

      // 3. Quyền chi tiết theo cờ phân quyền nhân sự nội bộ công ty
      const empFlags = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT can_assign_tasks, can_manage_members, can_manage_finance, can_manage_docs, can_manage_crm, permissions
        FROM public.company_employees 
        WHERE user_id = $1::text AND status = 'active'
      `, userId);

      for (const ef of empFlags) {
        if (ef.can_assign_tasks) permsSet.add('tasks:assign');
        if (ef.can_manage_members) permsSet.add('employees:manage');
        if (ef.can_manage_finance) {
          permsSet.add('finance:view');
          permsSet.add('finance:approve');
          permsSet.add('finance:export');
        }
        if (ef.can_manage_docs) permsSet.add('documents:manage');
        if (ef.can_manage_crm) permsSet.add('crm:manage');
        if (Array.isArray(ef.permissions)) {
          ef.permissions.forEach((p: string) => permsSet.add(p));
        }
      }

      // Mặc định mọi nhân viên / người dùng hợp lệ đều có quyền kết nối nhắn tin
      permsSet.add('chat:access');

      return Array.from(permsSet);
    } catch (err) {
      this.logger.error('Error getting user permissions:', err);
      return ['chat:access'];
    }
  }

  /**
   * 6. Lấy ngữ cảnh phân quyền đầy đủ cho tài khoản người dùng
   */
  async getUserRbacContext(userId: string) {
    if (!userId) {
      return {
        roles: [],
        permissions: [],
        isSuperAdmin: false,
        isFinanceStaff: false,
        isOperationsStaff: false,
        isExecutiveStaff: false,
        canExportReports: false,
        canAccessChat: true,
      };
    }

    try {
      const roleRows = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT r.code, r.name, r.level
        FROM public.platform_roles r
        WHERE r.code IN (
          SELECT role_code FROM public.platform_user_roles WHERE user_id = $1::uuid
          UNION
          SELECT role::text FROM public.user_roles WHERE user_id = $1::uuid
        )
      `, userId);

      const roleCodes = roleRows.map(r => r.code);
      const permissions = await this.getUserEffectivePermissions(userId);

      const isSuperAdmin = roleCodes.includes('super_admin') || roleCodes.includes('admin') || roleCodes.includes('platform_admin');
      const isFinanceStaff = isSuperAdmin || roleCodes.includes('platform_finance');
      const isOperationsStaff = isSuperAdmin || roleCodes.includes('platform_operations');
      const isExecutiveStaff = isSuperAdmin || roleCodes.includes('platform_executive');

      const canExportReports = isSuperAdmin || isFinanceStaff || isExecutiveStaff || permissions.includes('finance:export') || permissions.includes('statistics:view_platform');

      return {
        roles: roleRows,
        roleCodes,
        permissions,
        isSuperAdmin,
        isFinanceStaff,
        isOperationsStaff,
        isExecutiveStaff,
        canExportReports,
        canAccessChat: true,
      };
    } catch (err) {
      this.logger.error('Error getting user RBAC context:', err);
      return {
        roles: [],
        roleCodes: [],
        permissions: ['chat:access'],
        isSuperAdmin: false,
        isFinanceStaff: false,
        isOperationsStaff: false,
        isExecutiveStaff: false,
        canExportReports: false,
        canAccessChat: true,
      };
    }
  }

  /**
   * 7. Danh sách tài khoản nhân viên nội bộ ViOne
   */
  async listStaffAccounts() {
    try {
      const users = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          u.id,
          u.name as "fullName",
          u.email,
          u.username,
          p.professional_title as "title",
          p.account_status as "status",
          p.company_name as "companyName",
          u.created_at as "createdAt",
          u.updated_at as "updatedAt",
          COALESCE((
            SELECT json_agg(json_build_object('code', r.code, 'name', r.name, 'level', r.level))
            FROM public.platform_user_roles pur
            JOIN public.platform_roles r ON r.code = pur.role_code
            WHERE pur.user_id = u.id
          ), '[]'::json) as "assignedRoles"
        FROM public.vione_users u
        LEFT JOIN public.user_profiles p ON p.user_id = u.id
        WHERE u.id IN (
          SELECT DISTINCT user_id FROM public.platform_user_roles
          UNION
          SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin', 'platform_admin')
        )
        OR p.company_name ILIKE '%ViOne%'
        ORDER BY u.created_at DESC
      `);

      return {
        ok: true,
        items: users,
        total: users.length,
      };
    } catch (err) {
      this.logger.error('Error listing ViOne staff accounts:', err);
      return { ok: false, items: [], total: 0 };
    }
  }

  /**
   * 8. Cấp tài khoản nhân viên ViOne mới (kèm multi-role & gửi email thông tin đăng nhập)
   */
  async provisionStaffAccount(dto: ProvisionStaffDto, assignedByUserId?: string) {
    const { fullName, email, phone, roleCodes } = dto;
    if (!fullName || !fullName.trim()) {
      throw new BadRequestException('Họ và tên nhân viên không được để trống');
    }
    if (!email || !email.trim() || !email.includes('@')) {
      throw new BadRequestException('Email nhân viên không hợp lệ');
    }
    if (!Array.isArray(roleCodes) || roleCodes.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một nhóm quyền cho nhân viên');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : null;

    // Mật khẩu khởi tạo: nếu admin không chỉ định thì sinh ngẫu nhiên an toàn
    const passwordRaw = dto.password && dto.password.trim().length >= 6 
      ? dto.password.trim() 
      : `ViOne@${Math.floor(100000 + Math.random() * 900000)}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordRaw, salt);

    let userId: string;

    // Kiểm tra xem email đã tồn tại trong vione_users chưa
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM public.vione_users WHERE email = $1 OR username = $1 LIMIT 1`,
      cleanEmail,
    );

    if (existing.length > 0) {
      userId = existing[0].id;
      // Cập nhật tên và mật khẩu
      await this.prisma.$executeRawUnsafe(
        `UPDATE public.vione_users SET name = $1, password = $2, updated_at = now() WHERE id = $3::uuid`,
        cleanName,
        hashedPassword,
        userId,
      );
      // Cập nhật profile
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.user_profiles (user_id, display_name, company_name, account_status, onboarding_status, created_at, updated_at)
         VALUES ($1::uuid, $2, 'ViOne Corporation', 'active', 'completed', now(), now())
         ON CONFLICT (user_id) DO UPDATE SET 
           display_name = EXCLUDED.display_name,
           company_name = 'ViOne Corporation',
           account_status = 'active',
           updated_at = now()`,
        userId,
        cleanName,
      );
    } else {
      userId = crypto.randomUUID();
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.vione_users (id, username, email, password, name, email_verified, created_at, updated_at)
         VALUES ($1::uuid, $2, $2, $3, $4, true, now(), now())`,
        userId,
        cleanEmail,
        hashedPassword,
        cleanName,
      );

      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.user_profiles (user_id, display_name, company_name, account_status, onboarding_status, created_at, updated_at)
         VALUES ($1::uuid, $2, 'ViOne Corporation', 'active', 'completed', now(), now())
         ON CONFLICT (user_id) DO UPDATE SET 
           display_name = EXCLUDED.display_name,
           company_name = 'ViOne Corporation',
           account_status = 'active',
           updated_at = now()`,
        userId,
        cleanName,
      );
    }

    // Gán các nhóm quyền vào public.platform_user_roles (hỗ trợ 1 user có nhiều nhóm quyền cùng lúc)
    // 1. Xóa các quyền cũ của nhân viên này
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.platform_user_roles WHERE user_id = $1::uuid`,
      userId,
    );

    // 2. Chèn các nhóm quyền mới
    for (const rCode of roleCodes) {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.platform_user_roles (user_id, role_code, assigned_by, assigned_at)
         VALUES ($1::uuid, $2, $3::uuid, now())
         ON CONFLICT (user_id, role_code) DO NOTHING`,
        userId,
        rCode,
        assignedByUserId || null,
      );
    }

    // 3. Đảm bảo user_roles có quyền admin hoặc platform_admin để qua các tầng middleware auth
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO auth.users (id, email, role)
         VALUES ($1::uuid, $2, 'authenticated')
         ON CONFLICT (id) DO NOTHING`,
        userId,
        cleanEmail,
      );
      const hasSuper = roleCodes.includes('super_admin');
      const legacyRole = hasSuper ? 'platform_admin' : 'admin';
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.user_roles (user_id, role, created_at)
         VALUES ($1::uuid, $2::app_role, now())
         ON CONFLICT (user_id, role) DO NOTHING`,
        userId,
        legacyRole,
      );
    } catch (authErr) {
      this.logger.warn(`Could not sync into auth.users/user_roles: ${authErr}`);
    }

    // 4. Lấy danh sách thông tin chi tiết các roles vừa gán
    const assignedRoles = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT code, name FROM public.platform_roles WHERE code = ANY($1)`,
      roleCodes,
    );

    // 5. Tự động bắn email gửi thông tin tài khoản và mật khẩu khởi tạo cho nhân viên
    let emailSent = false;
    let emailMessage = 'Bỏ qua gửi email theo cài đặt';

    if (dto.sendEmail !== false) {
      const emailRes = await this.mailService.sendStaffAccountCredentialsEmail({
        to: cleanEmail,
        fullName: cleanName,
        username: cleanEmail,
        passwordRaw,
        phone: cleanPhone || undefined,
        roles: assignedRoles,
      });
      emailSent = emailRes.ok;
      emailMessage = emailRes.message || 'Đã gửi email thông tin tài khoản thành công';
    }

    return {
      ok: true,
      message: `Đã cấp tài khoản thành công cho nhân viên ${cleanName}!`,
      userId,
      email: cleanEmail,
      fullName: cleanName,
      passwordRaw,
      roles: assignedRoles,
      emailSent,
      emailMessage,
    };
  }

  /**
   * 9. Cập nhật nhóm quyền cho nhân viên ViOne
   */
  async updateStaffRoles(userId: string, roleCodes: string[]) {
    if (!userId) {
      throw new BadRequestException('ID nhân viên không hợp lệ');
    }
    if (!Array.isArray(roleCodes) || roleCodes.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một nhóm quyền');
    }

    // Xóa các roles cũ
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.platform_user_roles WHERE user_id = $1::uuid`,
      userId,
    );

    // Chèn các roles mới
    for (const rCode of roleCodes) {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.platform_user_roles (user_id, role_code, assigned_at)
         VALUES ($1::uuid, $2, now())
         ON CONFLICT (user_id, role_code) DO NOTHING`,
        userId,
        rCode,
      );
    }

    const assignedRoles = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT code, name FROM public.platform_roles WHERE code = ANY($1)`,
      roleCodes,
    );

    return {
      ok: true,
      message: 'Cập nhật phân quyền nhân viên thành công!',
      userId,
      roles: assignedRoles,
    };
  }

  /**
   * 10. Gửi lại email thông tin đăng nhập cho nhân viên ViOne
   */
  async resendStaffCredentialsEmail(userId: string, newPassword?: string) {
    const userRows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT u.id, u.name, u.email, p.company_name
       FROM public.vione_users u
       LEFT JOIN public.user_profiles p ON p.user_id = u.id
       WHERE u.id = $1::uuid LIMIT 1`,
      userId,
    );

    if (userRows.length === 0) {
      throw new NotFoundException('Không tìm thấy tài khoản nhân viên');
    }

    const user = userRows[0];
    const passwordRaw = newPassword || `ViOne@${Math.floor(100000 + Math.random() * 900000)}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordRaw, salt);

    await this.prisma.$executeRawUnsafe(
      `UPDATE public.vione_users SET password = $1, updated_at = now() WHERE id = $2::uuid`,
      hashedPassword,
      userId,
    );

    const assignedRoles = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT r.code, r.name 
       FROM public.platform_roles r
       JOIN public.platform_user_roles pur ON pur.role_code = r.code
       WHERE pur.user_id = $1::uuid`,
      userId,
    );

    const emailRes = await this.mailService.sendStaffAccountCredentialsEmail({
      to: user.email,
      fullName: user.name,
      username: user.email,
      passwordRaw,
      roles: assignedRoles,
    });

    return {
      ok: true,
      message: `Đã cấp lại mật khẩu và gửi email thành công tới ${user.email}`,
      email: user.email,
      passwordRaw,
      emailSent: emailRes.ok,
    };
  }
}

