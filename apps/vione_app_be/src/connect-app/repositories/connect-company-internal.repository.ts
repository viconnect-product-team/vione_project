import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * ConnectCompanyInternalRepository — Data Access Layer for company internal tasks, employees & customer care.
 * Encapsulates 100% of raw SQL and database interactions.
 */
@Injectable()
export class ConnectCompanyInternalRepository {
  private readonly logger = new Logger(ConnectCompanyInternalRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAssociationId(communityId: string): Promise<string | null> {
    const assoc = await this.prisma.$queryRaw<any[]>`
      SELECT id FROM public.associations WHERE slug = ${communityId} OR name ILIKE ${`%${communityId}%`} LIMIT 1
    `.catch(() => [] as any[]);
    return assoc?.[0]?.id || null;
  }

  async findMembershipsByAssociationId(assocId: string): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT DISTINCT ON (m_all."userId")
        m_all."userId" as id,
        m_all."userId" as "userId",
        COALESCE(m_all.full_name, up.display_name, vu.name, SPLIT_PART(vu.email, '@', 1), 'Thành viên')::text as "fullName",
        COALESCE(m_all.email, vu.email, '')::text as email,
        COALESCE(m_all.phone, '')::text as phone,
        COALESCE(m_all.role, 'member')::text as role,
        COALESCE(m_all.role_title, up.professional_title, 'Thành viên cộng đồng')::text as "roleTitle",
        COALESCE(m_all.department, up.company_name, 'Khối Doanh Nghiệp B2B')::text as department,
        COALESCE(m_all.avatar_url, up.avatar_url, vu.avatar_url, '')::text as "avatarUrl",
        'active'::text as status,
        COALESCE(m_all.joined_at, now()) as "joinedAt"
      FROM (
        -- 1. memberships in this association
        SELECT 
          ms.user_id::text as "userId",
          null::text as full_name,
          null::text as email,
          null::text as phone,
          ms.role::text as role,
          ms.executive_role::text as role_title,
          ms.department::text as department,
          null::text as avatar_url,
          ms.created_at as joined_at
        FROM public.memberships ms
        WHERE ms.association_id = ${assocId}::uuid AND ms.user_id IS NOT NULL

        UNION ALL

        -- 2. members in this association
        SELECT 
          COALESCE(m.user_id::text, m.id::text) as "userId",
          m.name::text as full_name,
          m.email::text as email,
          m.phone::text as phone,
          COALESCE(m.executive_role, 'member')::text as role,
          COALESCE(m.executive_role, 'Thành viên')::text as role_title,
          COALESCE(m.department, 'Khối Doanh Nghiệp B2B')::text as department,
          COALESCE(m.avatar, '')::text as avatar_url,
          COALESCE(m.joined_at, m.created_at) as joined_at
        FROM public.members m
        WHERE m.association_id = ${assocId}::uuid AND m.status = 'active'

        UNION ALL

        -- 3. company_employees in this community
        SELECT 
          ce.user_id::text as "userId",
          ce.full_name::text as full_name,
          ce.email::text as email,
          ce.phone::text as phone,
          ce.role::text as role,
          ce.role_title::text as role_title,
          ce.department::text as department,
          ce.avatar_url::text as avatar_url,
          ce.joined_at as joined_at
        FROM public.company_employees ce
        WHERE (ce.community_id = ${assocId} OR ce.community_id = ${assocId}::text)
      ) m_all
      LEFT JOIN public.vione_users vu ON (vu.id::text = m_all."userId")
      LEFT JOIN public.user_profiles up ON (up.user_id::text = m_all."userId" OR (vu.id IS NOT NULL AND up.user_id = vu.id))
      WHERE m_all."userId" IS NOT NULL
      ORDER BY m_all."userId", "fullName" ASC
      LIMIT 100
    `.catch(() => [] as any[]);
  }

  async findFallbackUsers(): Promise<any[]> {
    // Không dùng fallback users toàn hệ thống để tránh rò rỉ thành viên giữa các cộng đồng khác nhau
    return [];
  }

  async findActiveTaskCounts(): Promise<Map<string, number>> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT assignee_id, COUNT(id)::int as count
      FROM public.company_tasks
      WHERE status IN ('assigned', 'in_progress')
      GROUP BY assignee_id
    `.catch(() => [] as any[]);

    const map = new Map<string, number>();
    for (const r of rows) {
      if (r.assignee_id) map.set(r.assignee_id, r.count);
    }
    return map;
  }

  async insertCompanyEmployee(communityId: string, emp: any): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.company_employees (
        id, community_id, user_id, full_name, email, phone, role, role_title, department, avatar_url, status, joined_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now()
      )
    `, emp.id, communityId, emp.userId, emp.fullName, emp.email, emp.phone, emp.role, emp.roleTitle, emp.department, emp.avatarUrl, emp.status).catch(() => {});
  }

  async findTasks(query: string, params: any[]): Promise<any[]> {
    return this.prisma.$queryRawUnsafe<any[]>(query, ...params).catch(() => [] as any[]);
  }

  async findUserName(userId: string): Promise<string | null> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT COALESCE(up.display_name, vu.name, SPLIT_PART(vu.email, '@', 1))::text as name
      FROM public.vione_users vu
      LEFT JOIN public.user_profiles up ON up.user_id = vu.id
      WHERE vu.id = ${userId}::uuid
      LIMIT 1
    `.catch(() => [] as any[]);
    return rows?.[0]?.name || null;
  }

  async findCallerName(userId: string): Promise<string> {
    const caller = await this.prisma.$queryRaw<any[]>`
      SELECT 
        COALESCE(up.display_name, vu.name, SPLIT_PART(vu.email, '@', 1), 'Ban Giám Đốc')::text as "fullName"
      FROM public.vione_users vu
      LEFT JOIN public.user_profiles up ON up.user_id = vu.id
      LEFT JOIN public.members m ON m.user_id = vu.id
      WHERE vu.id = ${userId}::uuid
      LIMIT 1
    `.catch(() => [] as any[]);
    return caller?.[0]?.fullName || 'Ban Giám Đốc';
  }

  async findAssigneeName(assigneeId: string): Promise<string> {
    if (!assigneeId) return 'Thành viên được giao';
    // 1. Tìm trong bảng members trước (theo id hoặc user_id)
    const mem = await this.prisma.$queryRaw<any[]>`
      SELECT 
        COALESCE(m.name, up.display_name, vu.name, SPLIT_PART(vu.email, '@', 1), 'Thành viên')::text as "fullName"
      FROM public.members m
      LEFT JOIN public.vione_users vu ON vu.id = m.user_id
      LEFT JOIN public.user_profiles up ON up.user_id = vu.id
      WHERE m.id::text = ${assigneeId} OR m.user_id::text = ${assigneeId}
      LIMIT 1
    `.catch(() => [] as any[]);
    if (mem?.[0]?.fullName) return mem[0].fullName;

    // 2. Tìm trong bảng vione_users nếu không thấy trong members
    const emp = await this.prisma.$queryRaw<any[]>`
      SELECT 
        COALESCE(up.display_name, vu.name, SPLIT_PART(vu.email, '@', 1), 'Thành viên')::text as "fullName"
      FROM public.vione_users vu
      LEFT JOIN public.user_profiles up ON up.user_id = vu.id
      WHERE vu.id::text = ${assigneeId}
      LIMIT 1
    `.catch(() => [] as any[]);
    return emp?.[0]?.fullName || 'Thành viên được giao';
  }

  async insertCompanyTask(task: any): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.company_tasks (
        id, community_id, title, description, assignee_id, assignee_name, assigner_name,
        priority, status, progress, progress_note, department, deadline, customer_name, customer_phone, customer_contact, customer_requirements, attachments, report_url, report_note, report_file_name, report_file_type, handover_history, task_type, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23::jsonb, $24, now(), now()
      )
    `, task.id, task.communityId, task.title, task.description, task.assigneeId, task.assigneeName,
       task.assignerName, task.priority, task.status, task.progress || 0, task.progressNote || '',
       task.department || 'Vận hành', task.deadline, task.customerName || '',
       task.customerPhone || '', task.customerContact || '', task.customerRequirements || '',
       task.attachments || '', task.reportUrl || '', task.reportNote || '',
       task.reportFileName || '', task.reportFileType || '',
       JSON.stringify(task.handoverHistory || []), task.taskType || 'general'
    ).catch((e) => this.logger.warn('createCompanyTask DB insert fallback:', e));
  }

  async updateCompanyTaskProgress(taskId: string, progress: number, note?: string, status?: string): Promise<void> {
    let query = `UPDATE public.company_tasks SET progress = $1, updated_at = now()`;
    const params: any[] = [progress];
    if (note !== undefined && note !== null) {
      params.push(note);
      query += `, progress_note = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += `, status = $${params.length}`;
      if (status === 'completed') {
        query += `, completed_at = now()`;
      }
    }
    params.push(taskId);
    query += ` WHERE id = $${params.length}`;
    await this.prisma.$executeRawUnsafe(query, ...params).catch((e) => this.logger.warn('updateCompanyTaskProgress fallback:', e));
  }

  async insertBusinessNotification(notifId: string, assigneeId: string, taskId: string, dedupe: string, title: string, body: string, safeDataJson: string): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO public.business_notifications (
        id, recipient_user_id, source_domain, source_record_id, dedupe_key, event_kind, notification_kind,
        title_key, body_key, safe_display_data, priority, status, app_scope, target_app, created_at, updated_at
      ) VALUES (
        ${notifId}::uuid, ${assigneeId}::uuid, 'company_task', ${taskId}, ${dedupe}, 'task_assigned', 'company_task_assigned',
        ${title},
        ${body},
        ${safeDataJson}::jsonb,
        'high', 'delivered', 'all', 'all', now(), now()
      )
    `.catch((err) => this.logger.warn('Task business_notification insert error:', err));
  }

  async insertMemberNotification(recipientId: string, title: string, body: string, taskId: string): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO public.member_notifications (
        id, recipient_id, type, title, body, read, created_at, ref_type, ref_id
      ) VALUES (
        gen_random_uuid(), ${recipientId}, 'task',
        ${title},
        ${body},
        false, now(), 'company_task', ${taskId}
      )
    `.catch(() => {});
  }

  async acceptCompanyTask(taskId: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.company_tasks
      SET status = 'in_progress', accepted_at = now(), updated_at = now()
      WHERE id = $1
    `, taskId).catch((e) => this.logger.warn('acceptCompanyTask DB update fallback:', e));
  }

  async findTaskSimple(taskId: string): Promise<{ title: string; assigneeId?: string; assigneeName: string; assignerName?: string; department?: string } | null> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT title, assignee_id, assignee_name, assigner_name, department FROM public.company_tasks WHERE id = ${taskId} LIMIT 1
    `.catch(() => [] as any[]);
    if (!rows?.[0]) return null;
    return {
      title: rows[0].title,
      assigneeId: rows[0].assignee_id,
      assigneeName: rows[0].assignee_name,
      assignerName: rows[0].assigner_name,
      department: rows[0].department,
    };
  }

  async completeCompanyTask(taskId: string, status: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.company_tasks
      SET status = $1, completed_at = now(), updated_at = now()
      WHERE id = $2
    `, status, taskId).catch((e) => this.logger.warn('completeCompanyTask DB update fallback:', e));
  }

  async updateCompanyTaskStatus(taskId: string, status: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.company_tasks
      SET status = $1, updated_at = now()
      WHERE id = $2
    `, status, taskId).catch((e) => this.logger.warn('updateCompanyTaskStatus DB update fallback:', e));
  }

  async listCustomerCare(communityId: string): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        id,
        employee_id as "employeeId",
        employee_name as "employeeName",
        customer_name as "customerName",
        customer_contact as "customerContact",
        customer_company as "customerCompany",
        stage,
        stage_label as "stageLabel",
        deal_value as "dealValue",
        deal_value_label as "dealValueLabel",
        last_action as "lastAction",
        last_action_at as "lastActionAt",
        progress_percent as "progressPercent",
        next_follow_up as "nextFollowUp"
      FROM public.company_customer_care
      WHERE community_id = ${communityId}
      ORDER BY created_at DESC
    `.catch(() => [] as any[]);
  }

  async insertCustomerCare(communityId: string, log: any): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.company_customer_care (
        id, community_id, employee_id, employee_name, customer_name,
        customer_contact, customer_company, stage, stage_label,
        deal_value, deal_value_label, last_action, last_action_at,
        progress_percent, next_follow_up, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now(), now()
      )
    `,
      log.id,
      communityId,
      log.employeeId || null,
      log.employeeName || null,
      log.customerName,
      log.customerContact || null,
      log.customerCompany || null,
      log.stage || 'contacted',
      log.stageLabel || 'Đã liên hệ',
      log.dealValue || 0,
      log.dealValueLabel || '0 đ',
      log.lastAction || '',
      log.lastActionAt || 'Vừa xong',
      log.progressPercent || 50,
      log.nextFollowUp || ''
    ).catch((e) => this.logger.warn('insertCustomerCare DB insert fallback:', e));
  }


  async checkUserCanAssignTask(userId: string, communityId: string): Promise<boolean> {
    if (!userId) return false;
    if (userId === '00000000-0000-0000-0000-000000000000' || userId === 'mock-admin-id') return true;

    try {
      // 1. Kiểm tra global roles (quan_tri, admin, platform_admin)
      const globalRoles = await this.prisma.$queryRaw<any[]>`
        SELECT role FROM public.user_roles WHERE user_id = ${userId}::uuid
      `.catch(() => [] as any[]);
      const hasSuper = globalRoles.some((r) => ['quan_tri', 'admin', 'platform_admin', 'superadmin'].includes(r.role?.toLowerCase()));
      if (hasSuper) return true;

      // 2. Kiểm tra quyền tại cộng đồng/hiệp hội (là người tạo hoặc có role admin/owner/president)
      const assoc = await this.prisma.$queryRaw<any[]>`
        SELECT id, creator_id FROM public.associations
        WHERE (id::text = ${communityId} OR slug = ${communityId})
        LIMIT 1
      `.catch(() => [] as any[]);
      if (assoc?.[0]?.creator_id && String(assoc[0].creator_id) === String(userId)) {
        return true;
      }

      // 3. Kiểm tra membership role trong cộng đồng
      const mem = await this.prisma.$queryRaw<any[]>`
        SELECT role FROM public.memberships
        WHERE user_id = ${userId}::uuid AND (association_id::text = ${communityId} OR association_id IN (
          SELECT id FROM public.associations WHERE slug = ${communityId}
        ))
        LIMIT 1
      `.catch(() => [] as any[]);
      if (mem?.[0] && ['admin', 'owner', 'president', 'vice_president', 'director', 'quan_tri'].includes(mem[0].role?.toLowerCase())) {
        return true;
      }
    } catch (e) {
      this.logger.warn('checkUserCanAssignTask error:', e);
    }
    return false;
  }

  async checkUserCanEditTask(userId: string, taskId: string): Promise<boolean> {
    if (!userId) return false;
    if (userId === '00000000-0000-0000-0000-000000000000' || userId === 'mock-admin-id') return true;

    try {
      // Quản trị & Admin luôn có quyền sửa mọi bản ghi
      const globalRoles = await this.prisma.$queryRaw<any[]>`
        SELECT role FROM public.user_roles WHERE user_id = ${userId}::uuid
      `.catch(() => [] as any[]);
      const hasSuper = globalRoles.some((r) => ['quan_tri', 'admin', 'platform_admin'].includes(r.role?.toLowerCase()));
      if (hasSuper) return true;

      // Người tạo task mới được sửa
      const task = await this.prisma.$queryRaw<any[]>`
        SELECT id, assignee_id, assigner_name FROM public.company_tasks WHERE id = ${taskId} LIMIT 1
      `.catch(() => [] as any[]);
      if (!task?.[0]) return true;

      // Kiểm tra xem tên của user có khớp assigner_name hoặc user_id có trong task không
      const callerName = await this.findCallerName(userId);
      if (task[0].assigner_name && callerName && task[0].assigner_name === callerName) {
        return true;
      }
    } catch (e) {
      this.logger.warn('checkUserCanEditTask error:', e);
    }
    return false;
  }

  async updateCompanyTask(taskId: string, body: any): Promise<void> {
    let query = `UPDATE public.company_tasks SET updated_at = now()`;
    const params: any[] = [];
    if (body.title) {
      params.push(body.title.trim());
      query += `, title = $${params.length}`;
    }
    if (body.description !== undefined) {
      params.push(body.description);
      query += `, description = $${params.length}`;
    }
    if (body.assigneeId !== undefined) {
      params.push(body.assigneeId);
      query += `, assignee_id = $${params.length}`;
    }
    if (body.assigneeName !== undefined) {
      params.push(body.assigneeName);
      query += `, assignee_name = $${params.length}`;
    }
    if (body.priority) {
      params.push(body.priority);
      query += `, priority = $${params.length}`;
    }
    if (body.department !== undefined) {
      params.push(body.department);
      query += `, department = $${params.length}`;
    }
    if (body.deadline) {
      params.push(body.deadline);
      query += `, deadline = $${params.length}`;
    }
    if (body.status) {
      params.push(body.status);
      query += `, status = $${params.length}`;
      if (body.status === 'completed') {
        query += `, completed_at = now()`;
      }
    }
    if (body.progress !== undefined) {
      params.push(Number(body.progress) || 0);
      query += `, progress = $${params.length}`;
    }
    if (body.progressNote !== undefined || body.progress_note !== undefined) {
      params.push(body.progressNote || body.progress_note || '');
      query += `, progress_note = $${params.length}`;
    }
    if (body.customerName !== undefined || body.customer_name !== undefined) {
      params.push(body.customerName || body.customer_name || '');
      query += `, customer_name = $${params.length}`;
    }
    if (body.customerPhone !== undefined || body.customer_phone !== undefined) {
      params.push(body.customerPhone || body.customer_phone || '');
      query += `, customer_phone = $${params.length}`;
    }
    if (body.customerContact !== undefined || body.customer_contact !== undefined) {
      params.push(body.customerContact || body.customer_contact || '');
      query += `, customer_contact = $${params.length}`;
    }
    if (body.customerRequirements !== undefined || body.customer_requirements !== undefined) {
      params.push(body.customerRequirements || body.customer_requirements || '');
      query += `, customer_requirements = $${params.length}`;
    }
    if (body.attachments !== undefined) {
      params.push(typeof body.attachments === 'string' ? body.attachments : JSON.stringify(body.attachments));
      query += `, attachments = $${params.length}`;
    }
    if (body.reportUrl !== undefined || body.report_url !== undefined) {
      params.push(body.reportUrl || body.report_url || '');
      query += `, report_url = $${params.length}`;
    }
    if (body.reportNote !== undefined || body.report_note !== undefined) {
      params.push(body.reportNote || body.report_note || '');
      query += `, report_note = $${params.length}`;
    }
    if (body.reportFileName !== undefined || body.report_file_name !== undefined) {
      params.push(body.reportFileName || body.report_file_name || '');
      query += `, report_file_name = $${params.length}`;
    }
    if (body.reportFileType !== undefined || body.report_file_type !== undefined) {
      params.push(body.reportFileType || body.report_file_type || '');
      query += `, report_file_type = $${params.length}`;
    }
    if (body.handoverHistory !== undefined || body.handover_history !== undefined) {
      const hist = body.handoverHistory || body.handover_history;
      params.push(typeof hist === 'string' ? hist : JSON.stringify(hist));
      query += `, handover_history = $${params.length}::jsonb`;
    }
    if (body.taskType !== undefined || body.task_type !== undefined) {
      params.push(body.taskType || body.task_type || 'general');
      query += `, task_type = $${params.length}`;
    }
    params.push(taskId);
    query += ` WHERE id = $${params.length}`;
    await this.prisma.$executeRawUnsafe(query, ...params).catch((e) => this.logger.warn('updateCompanyTask DB update fallback:', e));
  }

  async handoverCompanyTask(
    taskId: string,
    toAssigneeId: string,
    toAssigneeName: string,
    toDepartment?: string,
    handoverEntry?: any
  ): Promise<void> {
    try {
      const current = await this.prisma.$queryRaw<any[]>`
        SELECT COALESCE(handover_history, '[]'::jsonb) as "handoverHistory"
        FROM public.company_tasks WHERE id = ${taskId} LIMIT 1
      `.catch(() => []);

      let history: any[] = [];
      if (current?.[0]?.handoverHistory) {
        history = Array.isArray(current[0].handoverHistory)
          ? current[0].handoverHistory
          : JSON.parse(current[0].handoverHistory || '[]');
      }
      if (handoverEntry) {
        history.unshift(handoverEntry);
      }

      let query = `
        UPDATE public.company_tasks
        SET assignee_id = $1,
            assignee_name = $2,
            handover_history = $3::jsonb,
            updated_at = now()
      `;
      const params: any[] = [toAssigneeId, toAssigneeName, JSON.stringify(history)];
      if (toDepartment) {
        params.push(toDepartment);
        query += `, department = $${params.length}`;
      }
      params.push(taskId);
      query += ` WHERE id = $${params.length}`;

      await this.prisma.$executeRawUnsafe(query, ...params);
    } catch (e) {
      this.logger.warn('handoverCompanyTask DB update fallback:', e);
    }
  }

  async deleteCompanyTask(taskId: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`DELETE FROM public.company_tasks WHERE id = $1`, taskId)
      .catch((e) => this.logger.warn('deleteCompanyTask DB fallback:', e));
  }

  // --- QUẢN LÝ PHÒNG BAN (DEPARTMENTS) ---
  async listCommunityDepartments(communityId: string): Promise<any[]> {
    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT 
          id::text,
          community_id as "communityId",
          name,
          description,
          manager_id as "managerId",
          manager_name as "managerName",
          COALESCE(color, '#DFB76C') as "color",
          COALESCE(members_count, 0)::int as "membersCount",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM public.vione_community_departments
        WHERE community_id = ${communityId}
           OR community_id = 'c1983000-0000-4000-8000-000000001983'
        ORDER BY created_at ASC
      `.catch(() => []);
      return rows;
    } catch {
      return [];
    }
  }

  async insertCommunityDepartment(dept: any): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.vione_community_departments (
          id, community_id, name, description, manager_id, manager_name, color, members_count, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, now(), now()
        )
      `, dept.communityId, dept.name, dept.description || '', dept.managerId || null, dept.managerName || '', dept.color || '#DFB76C', Number(dept.membersCount) || 0);
    } catch (e) {
      this.logger.warn('insertCommunityDepartment DB insert fallback:', e);
    }
  }

  async deleteCommunityDepartment(communityId: string, departmentId: string): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`
        DELETE FROM public.vione_community_departments 
        WHERE id::text = $1 AND (community_id = $2 OR community_id = 'c1983000-0000-4000-8000-000000001983')
      `, departmentId, communityId);
    } catch (e) {
      this.logger.warn('deleteCommunityDepartment DB fallback:', e);
    }
  }

  async isUserExecutive(userId: string, communityId: string): Promise<boolean> {
    return this.checkUserCanAssignTask(userId, communityId);
  }

  async listCommunityDepartmentMembers(communityId: string): Promise<any[]> {
    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT 
          id,
          community_id as "communityId",
          department_id as "departmentId",
          department_name as "departmentName",
          user_id as "userId",
          user_name as "userName",
          user_email as "userEmail",
          user_phone as "userPhone",
          user_avatar as "userAvatar",
          role,
          COALESCE(can_assign, false) as "canAssign",
          COALESCE(can_accept, true) as "canAccept",
          COALESCE(can_report, true) as "canReport",
          COALESCE(can_handover, true) as "canHandover",
          COALESCE(can_meet, true) as "canMeet",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM public.vione_community_department_members
        WHERE community_id = ${communityId}
           OR community_id = 'c1983000-0000-4000-8000-000000001983'
        ORDER BY department_name ASC, role DESC, user_name ASC
      `.catch(() => []);
      return rows;
    } catch {
      return [];
    }
  }

  async findUserDepartmentMemberships(userId: string, communityId: string): Promise<any[]> {
    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT 
          id,
          community_id as "communityId",
          department_id as "departmentId",
          department_name as "departmentName",
          user_id as "userId",
          user_name as "userName",
          role,
          COALESCE(can_assign, false) as "canAssign",
          COALESCE(can_accept, true) as "canAccept",
          COALESCE(can_report, true) as "canReport",
          COALESCE(can_handover, true) as "canHandover",
          COALESCE(can_meet, true) as "canMeet"
        FROM public.vione_community_department_members
        WHERE (community_id = ${communityId} OR community_id = 'c1983000-0000-4000-8000-000000001983')
          AND user_id = ${userId}
      `.catch(() => []);
      return rows;
    } catch {
      return [];
    }
  }

  async upsertDepartmentMember(member: {
    communityId: string;
    departmentId: string;
    departmentName: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    userAvatar?: string;
    role?: string;
    canAssign?: boolean;
    canAccept?: boolean;
    canReport?: boolean;
    canHandover?: boolean;
    canMeet?: boolean;
  }): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.vione_community_department_members (
          id, community_id, department_id, department_name, user_id, user_name, user_email, user_phone, user_avatar,
          role, can_assign, can_accept, can_report, can_handover, can_meet, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, now(), now()
        )
        ON CONFLICT (community_id, department_id, user_id)
        DO UPDATE SET
          department_name = EXCLUDED.department_name,
          user_name = COALESCE(EXCLUDED.user_name, public.vione_community_department_members.user_name),
          user_email = COALESCE(EXCLUDED.user_email, public.vione_community_department_members.user_email),
          role = EXCLUDED.role,
          can_assign = EXCLUDED.can_assign,
          can_accept = EXCLUDED.can_accept,
          can_report = EXCLUDED.can_report,
          can_handover = EXCLUDED.can_handover,
          can_meet = EXCLUDED.can_meet,
          updated_at = now()
      `,
        member.communityId,
        member.departmentId,
        member.departmentName,
        member.userId,
        member.userName || '',
        member.userEmail || '',
        member.userPhone || '',
        member.userAvatar || '',
        member.role || 'member',
        Boolean(member.canAssign),
        member.canAccept !== undefined ? Boolean(member.canAccept) : true,
        member.canReport !== undefined ? Boolean(member.canReport) : true,
        member.canHandover !== undefined ? Boolean(member.canHandover) : true,
        member.canMeet !== undefined ? Boolean(member.canMeet) : true
      );

      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_community_departments
        SET members_count = (
          SELECT COUNT(id)::int FROM public.vione_community_department_members
          WHERE department_id = $1 AND community_id = $2
        ),
        updated_at = now()
        WHERE id::text = $1 AND (community_id = $2 OR community_id = 'c1983000-0000-4000-8000-000000001983')
      `, member.departmentId, member.communityId).catch(() => {});
    } catch (e) {
      this.logger.warn('upsertDepartmentMember error:', e);
    }
  }

  async deleteDepartmentMember(communityId: string, departmentId: string, userId: string): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`
        DELETE FROM public.vione_community_department_members
        WHERE community_id = $1 AND department_id = $2 AND user_id = $3
      `, communityId, departmentId, userId);

      await this.prisma.$executeRawUnsafe(`
        UPDATE public.vione_community_departments
        SET members_count = (
          SELECT COUNT(id)::int FROM public.vione_community_department_members
          WHERE department_id = $1 AND community_id = $2
        ),
        updated_at = now()
        WHERE id::text = $1 AND (community_id = $2 OR community_id = 'c1983000-0000-4000-8000-000000001983')
      `, departmentId, communityId).catch(() => {});
    } catch (e) {
      this.logger.warn('deleteDepartmentMember error:', e);
    }
  }

  async checkUserCanOperateInDepartment(
    userId: string,
    communityId: string,
    departmentName: string,
    action: 'assign' | 'accept' | 'report' | 'handover' | 'meet',
  ): Promise<boolean> {
    if (!userId) return false;
    const isExec = await this.isUserExecutive(userId, communityId);
    if (isExec) return true;

    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT role, can_assign, can_accept, can_report, can_handover, can_meet
        FROM public.vione_community_department_members
        WHERE (community_id = ${communityId} OR community_id = 'c1983000-0000-4000-8000-000000001983')
          AND user_id = ${userId}
          AND (department_name ILIKE ${departmentName} OR department_id = ${departmentName} OR department_name ILIKE ${`%${departmentName}%`})
        LIMIT 1
      `.catch(() => [] as any[]);

      if (!rows || rows.length === 0) {
        return false;
      }

      const m = rows[0];
      if (action === 'assign') return Boolean(m.can_assign || m.role === 'lead');
      if (action === 'accept') return Boolean(m.can_accept ?? true);
      if (action === 'report') return Boolean(m.can_report ?? true);
      if (action === 'handover') return Boolean(m.can_handover ?? true);
      if (action === 'meet') return Boolean(m.can_meet || m.role === 'lead');
      return true;
    } catch (e) {
      this.logger.warn('checkUserCanOperateInDepartment error:', e);
      return false;
    }
  }
}
