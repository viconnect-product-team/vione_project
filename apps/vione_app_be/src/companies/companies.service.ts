import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface SubscriptionStatus {
  hasSubscription: boolean;
  plan?: string;
  isTrial?: boolean;
  trialDaysLeft?: number;
  expiresAt?: string;
  status?: string;
  message?: string;
  maxSlots?: number;
  usedSlots?: number;
  remainingSlots?: number;
}

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Kiểm tra điều kiện tiên quyết: Người dùng đã đăng ký mua gói ViOne Platform chưa?
   * Chỉ khi nào đăng ký gói ViOne Platform thì chức năng doanh nghiệp mới có dữ liệu!
   */
  async checkPlatformSubscription(userId?: string): Promise<SubscriptionStatus> {
    if (!userId) {
      return {
        hasSubscription: false,
        message: 'Chưa xác thực người dùng.',
      };
    }

    try {
      // 1. Kiểm tra bảng đăng ký gói vione_community_subscriptions
      const subs = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, plan, status, is_trial, trial_days, starts_at, expires_at, max_slots 
         FROM public.vione_community_subscriptions 
         WHERE user_id = $1::uuid AND status = 'active' AND expires_at > now() 
         ORDER BY expires_at DESC LIMIT 1`,
        userId,
      );

      if (subs && subs.length > 0) {
        const sub = subs[0];
        const diffMs = new Date(sub.expires_at).getTime() - Date.now();
        const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        const maxSlots = sub.max_slots || 10;

        return {
          hasSubscription: true,
          plan: sub.plan,
          isTrial: Boolean(sub.is_trial),
          trialDaysLeft: daysLeft,
          expiresAt: sub.expires_at ? new Date(sub.expires_at).toISOString() : undefined,
          status: sub.status,
          maxSlots,
        };
      }

      // 2. Kiểm tra nếu là mock admin hoặc platform admin đã có quyền hệ thống
      if (userId === '00000000-0000-0000-0000-000000000000' || userId === 'mock-admin-id') {
        return {
          hasSubscription: true,
          plan: 'vione_platform_enterprise',
          isTrial: false,
          trialDaysLeft: 365,
          status: 'active',
        };
      }

      return {
        hasSubscription: false,
        message: 'Tài khoản chưa đăng ký gói ViOne Platform.',
      };
    } catch (err) {
      this.logger.error('Error checking subscription:', err);
      return {
        hasSubscription: false,
        message: 'Lỗi kiểm tra trạng thái gói cước.',
      };
    }
  }

  /**
   * Kích hoạt / Đăng ký mua gói ViOne Platform (Lưu trực tiếp vào CSDL PostgreSQL)
   */
  async subscribePlatformPackage(userId: string, body?: { companyName?: string; plan?: string; isTrial?: boolean }) {
    if (!userId) {
      throw new BadRequestException('Vui lòng đăng nhập để đăng ký gói ViOne Platform');
    }

    const now = new Date();
    const isTrial = body?.isTrial ?? false;
    const days = isTrial ? 30 : 365;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const plan = body?.plan || (isTrial ? 'vione_platform_trial_30d' : 'vione_platform_annual');
    let maxSlots = 10;
    if (plan.includes('enterprise') || plan.includes('vip')) {
      maxSlots = 200;
    } else if (plan.includes('pro') || plan.includes('annual')) {
      maxSlots = 50;
    }

    try {
      // 1. Thêm bản ghi đăng ký gói ViOne Platform vào public.vione_community_subscriptions
      const subId = crypto.randomUUID();
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO public.vione_community_subscriptions 
           (id, user_id, plan, status, is_trial, trial_days, starts_at, expires_at, max_slots, created_at, updated_at) 
         VALUES 
           ($1::uuid, $2::uuid, $3, 'active', $4, $5, $6, $7, $8, $9, $10)`,
        subId,
        userId,
        plan,
        isTrial,
        days,
        now,
        expiresAt,
        maxSlots,
        now,
        now,
      );

      // 2. Đảm bảo người dùng sở hữu ít nhất 1 doanh nghiệp trong public.companies
      let company: any = null;
      const existing = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, name FROM public.companies WHERE owner_user_id = $1::uuid LIMIT 1`,
        userId,
      );

      if (existing.length > 0) {
        company = existing[0];
      } else {
        const companyId = crypto.randomUUID();
        const companyName = body?.companyName?.trim() || 'Doanh Nghiệp ViOne Platform';
        const slug = companyName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        await this.prisma.$executeRawUnsafe(
          `INSERT INTO public.companies 
             (id, owner_user_id, name, slug, industry, size, country, city, description, verified, visibility, status, created_at, updated_at) 
           VALUES 
             ($1::uuid, $2::uuid, $3, $4, 'Công Nghệ Thông Tin & Phần Mềm', '50 - 200 nhân sự', 'Việt Nam', 'Hà Nội', 'Doanh nghiệp vận hành trên nền tảng ViOne Platform 5.0', true, 'public', 'active', now(), now())`,
          companyId,
          userId,
          companyName,
          slug,
        );

        company = { id: companyId, name: companyName };

        // Seed luôn nhân sự và công việc mẫu thực tế cho doanh nghiệp mới này
        await this.seedEmployeesAndTasks(companyId);
      }

      return {
        ok: true,
        hasSubscription: true,
        plan,
        isTrial,
        trialDaysLeft: days,
        company,
        message: 'Kích hoạt gói ViOne Platform thành công!',
      };
    } catch (err) {
      this.logger.error('Error subscribing platform package:', err);
      throw new BadRequestException('Không thể kích hoạt gói ViOne Platform: ' + (err as Error).message);
    }
  }

  /**
   * Lấy danh sách doanh nghiệp
   * Điều kiện tiên quyết: CHỈ khi nào người dùng đăng ký mua gói ViOne Platform thì mới có dữ liệu!
   */
  async listCompanies(userId?: string) {
    const subStatus = await this.checkPlatformSubscription(userId);

    if (!subStatus.hasSubscription) {
      return {
        ok: true,
        hasSubscription: false,
        items: [],
        message: 'Chức năng doanh nghiệp chỉ có dữ liệu khi người dùng đăng ký gói ViOne Platform.',
      };
    }

    try {
      // Khi đã có gói ViOne Platform: Trả về danh sách doanh nghiệp từ public.companies kèm số lượng nhân viên & công việc thực tế
      const rows = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          c.id,
          c.owner_user_id as "ownerUserId",
          c.name,
          c.slug,
          c.logo_url as "logoUrl",
          c.cover_url as "coverUrl",
          c.industry,
          c.size,
          c.country,
          c.city,
          c.website,
          c.email,
          c.phone,
          c.description,
          c.verified,
          c.visibility,
          c.status,
          c.created_at as "createdAt",
          c.updated_at as "updatedAt",
          COALESCE((SELECT COUNT(*)::int FROM public.company_employees ce WHERE ce.community_id = c.id::text), 0) as "employeeCount",
          COALESCE((SELECT COUNT(*)::int FROM public.company_tasks ct WHERE ct.community_id = c.id::text), 0) as "taskCount"
        FROM public.companies c
        ORDER BY c.created_at ASC
      `);

      // Tự động kiểm tra seed nhân viên & công việc cho doanh nghiệp đầu tiên nếu chưa có
      if (rows.length > 0 && rows[0].employeeCount === 0) {
        await this.seedEmployeesAndTasks(rows[0].id);
        // Cập nhật lại count
        rows[0].employeeCount = await this.prisma.$queryRawUnsafe<any[]>(
          `SELECT COUNT(*)::int as c FROM public.company_employees WHERE community_id = $1::text`,
          rows[0].id,
        ).then(r => r[0]?.c || 0);
        rows[0].taskCount = await this.prisma.$queryRawUnsafe<any[]>(
          `SELECT COUNT(*)::int as c FROM public.company_tasks WHERE community_id = $1::text`,
          rows[0].id,
        ).then(r => r[0]?.c || 0);
      }

      return {
        ok: true,
        hasSubscription: true,
        subscription: subStatus,
        items: rows,
      };
    } catch (err) {
      this.logger.error('Error listing companies:', err);
      return {
        ok: true,
        hasSubscription: true,
        subscription: subStatus,
        items: [],
      };
    }
  }

  /**
   * Lấy chi tiết một doanh nghiệp theo ID
   */
  async getCompanyById(companyId: string, userId?: string) {
    const subStatus = await this.checkPlatformSubscription(userId);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT 
         c.id,
         c.owner_user_id as "ownerUserId",
         c.name,
         c.slug,
         c.logo_url as "logoUrl",
         c.cover_url as "coverUrl",
         c.industry,
         c.size,
         c.country,
         c.city,
         c.website,
         c.email,
         c.phone,
         c.description,
         c.verified,
         c.visibility,
         c.status,
         c.created_at as "createdAt",
         c.updated_at as "updatedAt",
         COALESCE((SELECT COUNT(*)::int FROM public.company_employees ce WHERE ce.community_id = c.id::text), 0) as "employeeCount",
         COALESCE((SELECT COUNT(*)::int FROM public.company_tasks ct WHERE ct.community_id = c.id::text), 0) as "taskCount"
       FROM public.companies c
       WHERE c.id = $1::uuid OR c.slug = $1
       LIMIT 1`,
      companyId,
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Không tìm thấy hồ sơ doanh nghiệp với mã: ${companyId}`);
    }

    return {
      ...rows[0],
      hasSubscription: subStatus.hasSubscription,
    };
  }

  /**
   * 1. QUẢN LÝ NHÂN VIÊN DOANH NGHIỆP
   * Truy vấn bảng public.company_employees
   */
  async listCompanyEmployees(companyId: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT 
           ce.id,
           ce.community_id as "communityId",
           ce.user_id as "userId",
           ce.full_name as "fullName",
           ce.email,
           ce.phone,
           ce.role,
           ce.role_title as "roleTitle",
           ce.department,
           ce.avatar_url as "avatarUrl",
           ce.status,
           ce.joined_at as "joinedAt",
           ce.active_tasks_count as "activeTasksCount",
           ce.customers_count as "customersCount"
         FROM public.company_employees ce
         WHERE ce.community_id = $1::text
         ORDER BY ce.joined_at ASC, ce.created_at ASC`,
        companyId,
      );

      // Nếu rỗng, tự động khởi tạo dữ liệu nhân sự nền tảng ViOne ban đầu
      if (rows.length === 0) {
        await this.seedEmployeesAndTasks(companyId);
        return this.listCompanyEmployees(companyId);
      }

      return rows;
    } catch (err) {
      this.logger.error('Error listing employees:', err);
      return [];
    }
  }

  /**
   * Thêm nhân viên mới vào doanh nghiệp
   */
  async addCompanyEmployee(companyId: string, data: {
    fullName: string;
    email?: string;
    phone?: string;
    role?: string;
    roleTitle?: string;
    department?: string;
    avatarUrl?: string;
  }) {
    if (!data.fullName?.trim()) {
      throw new BadRequestException('Họ và tên nhân viên là bắt buộc');
    }

    // 1. SLOT LIMIT & LICENSE GUARD CHECK
    const countRes = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(*)::int as count FROM public.company_employees WHERE community_id = $1`,
      companyId,
    );
    const currentCount = countRes[0]?.count || 0;

    const subRes = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT s.plan, s.max_slots as "maxSlots"
      FROM public.vione_community_subscriptions s
      WHERE (s.community_id = $1::uuid OR s.user_id = (SELECT owner_user_id FROM public.companies WHERE id = $1::uuid LIMIT 1))
        AND s.status = 'active' AND s.expires_at > now()
      ORDER BY s.expires_at DESC LIMIT 1
    `, companyId);

    const maxSlots = subRes[0]?.maxSlots || 10;
    if (currentCount >= maxSlots) {
      throw new BadRequestException(
        `Doanh nghiệp đã sử dụng hết hạn mức (${currentCount}/${maxSlots} slots) của gói cước hiện tại (${subRes[0]?.plan || 'Khởi nghiệp'}). Vui lòng nâng cấp gói cước để thêm nhân sự mới!`
      );
    }

    const employeeId = crypto.randomUUID();
    const now = new Date();

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO public.company_employees 
         (id, community_id, user_id, full_name, email, phone, role, role_title, department, avatar_url, status, joined_at, active_tasks_count, customers_count, created_at, updated_at) 
       VALUES 
         ($1, $2, null, $3, $4, $5, $6, $7, $8, $9, 'active', $10, 0, 0, $11, $12)`,
      employeeId,
      companyId,
      data.fullName.trim(),
      data.email?.trim() || null,
      data.phone?.trim() || null,
      data.role || 'staff',
      data.roleTitle?.trim() || 'Chuyên viên',
      data.department?.trim() || 'Khối Vận Hành',
      data.avatarUrl || null,
      now,
      now,
      now,
    );

    return {
      id: employeeId,
      communityId: companyId,
      fullName: data.fullName.trim(),
      email: data.email?.trim() || '',
      phone: data.phone?.trim() || '',
      role: data.role || 'staff',
      roleTitle: data.roleTitle?.trim() || 'Chuyên viên',
      department: data.department?.trim() || 'Khối Vận Hành',
      avatarUrl: data.avatarUrl || null,
      status: 'active',
      joinedAt: now.toISOString(),
      activeTasksCount: 0,
      customersCount: 0,
    };
  }

  /**
   * Xóa nhân viên khỏi doanh nghiệp
   */
  async deleteCompanyEmployee(companyId: string, employeeId: string) {
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.company_employees WHERE community_id = $1 AND id = $2`,
      companyId,
      employeeId,
    );
    return { ok: true, message: 'Đã xóa nhân viên thành công' };
  }

  /**
   * 2. GIAO VIỆC & PHÂN CÔNG NHIỆM VỤ DOANH NGHIỆP
   * Truy vấn bảng public.company_tasks
   */
  async listCompanyTasks(companyId: string, query?: { status?: string; priority?: string; assigneeId?: string }) {
    try {
      let sql = `
        SELECT 
          ct.id,
          ct.community_id as "communityId",
          ct.title,
          ct.description,
          ct.assignee_id as "assigneeId",
          ct.assignee_name as "assigneeName",
          ct.assigner_name as "assignerName",
          ct.priority,
          ct.status,
          ct.accepted_at as "acceptedAt",
          ct.completed_at as "completedAt",
          ct.deadline,
          ct.customer_name as "customerName",
          ct.customer_phone as "customerPhone",
          ct.customer_contact as "customerContact",
          ct.customer_requirements as "customerRequirements",
          ct.created_at as "createdAt",
          ct.updated_at as "updatedAt"
        FROM public.company_tasks ct
        WHERE ct.community_id = $1
      `;
      const params: any[] = [companyId];

      if (query?.status && query.status !== 'all') {
        params.push(query.status);
        sql += ` AND ct.status = $${params.length}`;
      }
      if (query?.priority && query.priority !== 'all') {
        params.push(query.priority);
        sql += ` AND ct.priority = $${params.length}`;
      }
      if (query?.assigneeId) {
        params.push(query.assigneeId);
        sql += ` AND ct.assignee_id = $${params.length}`;
      }

      sql += ` ORDER BY ct.created_at DESC`;

      const rows = await this.prisma.$queryRawUnsafe<any[]>(sql, ...params);
      return rows;
    } catch (err) {
      this.logger.error('Error listing company tasks:', err);
      return [];
    }
  }

  /**
   * Giao việc mới cho nhân viên
   */
  async createCompanyTask(companyId: string, data: {
    title: string;
    description?: string;
    assigneeId: string;
    assigneeName?: string;
    assignerName?: string;
    priority?: string;
    deadline?: string;
    customerName?: string;
    customerPhone?: string;
    customerRequirements?: string;
  }) {
    if (!data.title?.trim()) {
      throw new BadRequestException('Tiêu đề công việc là bắt buộc');
    }

    const taskId = crypto.randomUUID();
    const now = new Date();

    // Tìm tên người được giao nếu chưa có
    let assigneeName = data.assigneeName;
    if (!assigneeName && data.assigneeId) {
      const emp = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT full_name FROM public.company_employees WHERE id = $1 LIMIT 1`,
        data.assigneeId,
      );
      if (emp.length > 0) {
        assigneeName = emp[0].full_name;
      }
    }

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO public.company_tasks 
         (id, community_id, title, description, assignee_id, assignee_name, assigner_name, priority, status, deadline, customer_name, customer_phone, customer_contact, customer_requirements, created_at, updated_at) 
       VALUES 
         ($1, $2, $3, $4, $5, $6, $7, $8, 'assigned', $9, $10, $11, $12, $13, $14, $15)`,
      taskId,
      companyId,
      data.title.trim(),
      data.description?.trim() || null,
      data.assigneeId || null,
      assigneeName || 'Nhân sự phụ trách',
      data.assignerName || 'Ban Giám Đốc',
      data.priority || 'normal',
      data.deadline || 'Trong tuần',
      data.customerName || null,
      data.customerPhone || null,
      null,
      data.customerRequirements || null,
      now,
      now,
    );

    // Tăng active_tasks_count cho nhân viên đó
    if (data.assigneeId) {
      await this.prisma.$executeRawUnsafe(
        `UPDATE public.company_employees 
         SET active_tasks_count = COALESCE(active_tasks_count, 0) + 1, updated_at = now() 
         WHERE id = $1`,
        data.assigneeId,
      );
    }

    return {
      id: taskId,
      communityId: companyId,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      assigneeId: data.assigneeId,
      assigneeName: assigneeName || 'Nhân sự phụ trách',
      assignerName: data.assignerName || 'Ban Giám Đốc',
      priority: data.priority || 'normal',
      status: 'assigned',
      deadline: data.deadline || 'Trong tuần',
      customerName: data.customerName || null,
      createdAt: now.toISOString(),
    };
  }

  /**
   * Cập nhật trạng thái công việc (Đang làm, Hoàn thành)
   */
  async updateCompanyTaskStatus(companyId: string, taskId: string, status: string) {
    const validStatuses = ['assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Trạng thái không hợp lệ: ${status}`);
    }

    const now = new Date();
    let completedAt: Date | null = null;
    let acceptedAt: Date | null = null;

    if (status === 'completed') {
      completedAt = now;
    } else if (status === 'in_progress') {
      acceptedAt = now;
    }

    await this.prisma.$executeRawUnsafe(
      `UPDATE public.company_tasks 
       SET status = $1, 
           completed_at = CASE WHEN $1 = 'completed' THEN now() ELSE completed_at END,
           accepted_at = CASE WHEN $1 = 'in_progress' AND accepted_at IS NULL THEN now() ELSE accepted_at END,
           updated_at = now() 
       WHERE community_id = $2 AND id = $3`,
      status,
      companyId,
      taskId,
    );

    // Nếu hoàn thành, giảm active_tasks_count
    if (status === 'completed') {
      const task = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT assignee_id FROM public.company_tasks WHERE id = $1 LIMIT 1`,
        taskId,
      );
      if (task.length > 0 && task[0].assignee_id) {
        await this.prisma.$executeRawUnsafe(
          `UPDATE public.company_employees 
           SET active_tasks_count = GREATEST(0, COALESCE(active_tasks_count, 1) - 1), updated_at = now() 
           WHERE id = $1`,
          task[0].assignee_id,
        );
      }
    }

    return { ok: true, taskId, status };
  }

  /**
   * Khởi tạo dữ liệu nhân sự & phân công công việc mẫu chuẩn thực tế cho doanh nghiệp
   */
  private async seedEmployeesAndTasks(companyId: string) {
    try {
      const now = new Date();
      const emp1Id = crypto.randomUUID();
      const emp2Id = crypto.randomUUID();
      const emp3Id = crypto.randomUUID();
      const emp4Id = crypto.randomUUID();

      // Thêm 4 nhân sự chủ chốt
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.company_employees 
          (id, community_id, user_id, full_name, email, phone, role, role_title, department, avatar_url, status, joined_at, active_tasks_count, customers_count, created_at, updated_at) 
        VALUES 
          ('${emp1Id}', '${companyId}', null, 'Nguyễn Hải Đăng', 'dang.nh@vione.vn', '0912 345 678', 'manager', 'Giám Đốc Kỹ Thuật (CTO)', 'Khối Công Nghệ & AI', null, 'active', now(), 2, 5, now(), now()),
          ('${emp2Id}', '${companyId}', null, 'Trần Minh Quân', 'quan.tm@vione.vn', '0988 776 543', 'staff', 'Trưởng Phòng Kinh Doanh B2B', 'Khối Phát Triển Thị Trường', null, 'active', now(), 1, 12, now(), now()),
          ('${emp3Id}', '${companyId}', null, 'Lê Thị Thu Thảo', 'thao.lt@vione.vn', '0903 221 199', 'staff', 'Kế Toán Trưởng & Tài Chính', 'Khối Tài Chính Kế Toán', null, 'active', now(), 1, 0, now(), now()),
          ('${emp4Id}', '${companyId}', null, 'Phạm Hoàng Nam', 'nam.ph@vione.vn', '0977 443 322', 'staff', 'Chuyên Viên Triển Khai Giải Pháp CRM', 'Khối Vận Hành & Khách Hàng', null, 'active', now(), 1, 8, now(), now())
      `);

      // Thêm các tác vụ giao việc ban đầu
      const t1 = crypto.randomUUID();
      const t2 = crypto.randomUUID();
      const t3 = crypto.randomUUID();

      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.company_tasks 
          (id, community_id, title, description, assignee_id, assignee_name, assigner_name, priority, status, deadline, customer_name, customer_requirements, created_at, updated_at) 
        VALUES 
          ('${t1}', '${companyId}', 'Triển khai tích hợp Danh thiếp số Titanium NFC cho 50 lãnh đạo', 'Cài đặt mã QR chuẩn vCard 4.0 và phân quyền điều hành CRM trên hệ thống ViOne Platform 5.0', '${emp1Id}', 'Nguyễn Hải Đăng', 'Tổng Giám Đốc', 'high', 'in_progress', 'Thứ Sáu tuần này', 'Tập đoàn An Phát Holdings', 'Yêu cầu kiểm thử NFC 1-chạm mượt mà không lỗi.', now(), now()),
          ('${t2}', '${companyId}', 'Gặp gỡ và tư vấn gói giải pháp Doanh nghiệp cho đối tác B2B', 'Thuyết trình giải pháp Quản trị Nhân sự & Giao việc tự động hóa ViOne Platform.', '${emp2Id}', 'Trần Minh Quân', 'Tổng Giám Đốc', 'urgent', 'assigned', 'Ngày mai, 14:00', 'Công ty F-Solutions Cloud', 'Chuẩn bị hồ sơ năng lực và bảng báo giá chi tiết.', now(), now()),
          ('${t3}', '${companyId}', 'Đối soát báo cáo thu chi và phát hành hóa đơn điện tử quý', 'Kiểm tra chứng từ thanh toán ngân hàng qua Napas VietQR và lập tờ trình duyệt chi.', '${emp3Id}', 'Lê Thị Thu Thảo', 'Tổng Giám Đốc', 'normal', 'in_progress', 'Cuối tháng', 'Nội bộ ViOne', 'Khử trùng hóa đơn đầy đủ theo chuẩn BR-FIN-07.', now(), now())
      `);
    } catch (err) {
      this.logger.warn('Seed company employees/tasks warning:', err);
    }
  }

  /**
   * 3. GIAO VIỆC HÀNG LOẠT (BULK / BATCH TASK DISPATCH)
   * Giao 1 việc cho nhiều nhân sự cùng lúc hoặc giao việc nhanh
   */
  async createCompanyTasksBulk(companyId: string, data: {
    title: string;
    description?: string;
    assigneeIds: string[];
    assignerName?: string;
    priority?: string;
    deadline?: string;
    customerName?: string;
    customerPhone?: string;
    customerRequirements?: string;
  }) {
    if (!data.title?.trim()) {
      throw new BadRequestException('Tiêu đề công việc là bắt buộc');
    }

    const assigneeIds = Array.isArray(data.assigneeIds) && data.assigneeIds.length > 0
      ? data.assigneeIds
      : [''];

    const createdTasks: any[] = [];
    for (const assigneeId of assigneeIds) {
      const task = await this.createCompanyTask(companyId, {
        title: data.title,
        description: data.description,
        assigneeId,
        assignerName: data.assignerName,
        priority: data.priority,
        deadline: data.deadline,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerRequirements: data.customerRequirements,
      });
      createdTasks.push(task);
    }

    return {
      ok: true,
      message: `Đã giao việc thành công cho ${createdTasks.length} nhân sự`,
      tasks: createdTasks,
      count: createdTasks.length,
    };
  }

  /**
   * 4. QUẢN LÝ HẠN MỨC SLOTS TÀI KHOẢN (LICENSE & SLOTS USAGE)
   */
  async getCompanySlotUsage(companyId: string) {
    const countRes = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(*)::int as count FROM public.company_employees WHERE community_id = $1`,
      companyId,
    );
    const usedSlots = countRes[0]?.count || 0;

    const subRes = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT s.plan, s.max_slots as "maxSlots", s.expires_at as "expiresAt", s.status, s.is_trial as "isTrial"
      FROM public.vione_community_subscriptions s
      WHERE (s.community_id = $1::uuid OR s.user_id = (SELECT owner_user_id FROM public.companies WHERE id = $1::uuid LIMIT 1))
        AND s.status = 'active' AND s.expires_at > now()
      ORDER BY s.expires_at DESC LIMIT 1
    `, companyId);

    const sub = subRes[0] || { plan: 'free_starter', maxSlots: 10, expiresAt: null, status: 'active', isTrial: true };
    const maxSlots = sub.maxSlots || 10;
    const remainingSlots = Math.max(0, maxSlots - usedSlots);

    return {
      ok: true,
      companyId,
      plan: sub.plan,
      maxSlots,
      usedSlots,
      remainingSlots,
      utilizationPercent: Math.min(100, Math.round((usedSlots / maxSlots) * 100)),
      isFull: usedSlots >= maxSlots,
      expiresAt: sub.expiresAt,
    };
  }

  /**
   * 5. DANH SÁCH GÓI CƯỚC NỀN TẢNG
   */
  async listSubscriptionPackages() {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        id, 
        code, 
        name, 
        description, 
        price, 
        billing_cycle as "billingCycle", 
        max_slots as "maxSlots", 
        max_departments as "maxDepartments", 
        features, 
        is_active as "isActive"
      FROM public.vione_subscription_packages
      WHERE is_active = true
      ORDER BY price ASC
    `);
    return rows;
  }
}
