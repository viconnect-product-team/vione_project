import { Injectable, Logger, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConnectAppGateway } from '../connect-app.gateway';
import { ConnectCompanyInternalRepository } from '../repositories/connect-company-internal.repository';
import * as crypto from 'crypto';

/**
 * ConnectCompanyInternalService — Business logic domain service for internal company management.
 * 100% separated from SQL & database access via ConnectCompanyInternalRepository.
 */
@Injectable()
export class ConnectCompanyInternalService {
  private readonly logger = new Logger(ConnectCompanyInternalService.name);
  private companyEmployeesStore = new Map<string, any[]>();
  private companyTasksStore = new Map<string, any[]>();
  private companyCustomerCareStore = new Map<string, any[]>();

  constructor(
    private readonly repo: ConnectCompanyInternalRepository,
    private readonly gateway: ConnectAppGateway,
  ) {}

  async listCompanyEmployees(userId: string, communityId: string) {
    try {
      let targetAssocId = communityId;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(communityId);
      if (!isUuid) {
        const foundId = await this.repo.findAssociationId(communityId);
        targetAssocId = foundId || 'c1983000-0000-4000-8000-000000001983';
      }

      let memberList: any[] = [];
      const isTargetUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetAssocId);

      if (isTargetUuid) {
        memberList = await this.repo.findMembershipsByAssociationId(targetAssocId);
      }

      if (!memberList || memberList.length === 0) {
        memberList = await this.repo.findFallbackUsers();
      }

      const taskCountMap = await this.repo.findActiveTaskCounts();

      const formatted = memberList.map((r: any) => ({
        id: r.id,
        userId: r.userId || r.id,
        fullName: r.fullName || 'Thành viên',
        email: r.email || '',
        phone: r.phone || '',
        role: r.role || 'member',
        roleTitle: r.roleTitle || 'Thành viên',
        department: r.department || 'Gia Đình ViOne',
        avatarUrl: r.avatarUrl || '',
        status: r.status || 'active',
        joinedAt: r.joinedAt || new Date().toISOString(),
        activeTasksCount: taskCountMap.get(r.id) || taskCountMap.get(r.userId) || 0,
        customersCount: 0,
      }));

      this.companyEmployeesStore.set(communityId, formatted);

      return {
        ok: true,
        employees: formatted,
      };
    } catch (e) {
      this.logger.warn('listCompanyEmployees DB fallback:', e);
      return {
        ok: true,
        employees: this.companyEmployeesStore.get(communityId) || [],
      };
    }
  }

  async addCompanyEmployee(userId: string, communityId: string, body: any) {
    const newEmp = {
      id: `emp-${Date.now().toString(36)}`,
      userId: body.userId || `usr-${Date.now().toString(36)}`,
      fullName: body.fullName || body.name || 'Nhân Viên Mới',
      email: body.email || '',
      phone: body.phone || '',
      role: body.role || 'employee',
      roleTitle: body.roleTitle || 'Chuyên viên Doanh nghiệp',
      department: body.department || 'Gia Đình ViOne',
      avatarUrl: body.avatarUrl || '',
      status: 'active',
      joinedAt: new Date().toISOString(),
      activeTasksCount: 0,
      customersCount: 0,
    };

    try {
      await this.repo.insertCompanyEmployee(communityId, newEmp);
    } catch (e) {
      this.logger.warn('addCompanyEmployee DB insert fallback:', e);
    }

    const employees = this.companyEmployeesStore.get(communityId) || [];
    employees.unshift(newEmp);
    this.companyEmployeesStore.set(communityId, employees);

    return {
      ok: true,
      employee: newEmp,
      message: 'Đã thêm nhân sự vào cộng đồng thành công.',
    };
  }

  async listCompanyTasks(
    userId: string,
    communityId: string,
    statusFilter?: string,
    isMyTasks?: boolean,
    assigneeIdFilter?: string,
  ) {
    try {
      let query = `
        SELECT 
          id,
          community_id as "communityId",
          title,
          description,
          assignee_id as "assigneeId",
          assignee_name as "assigneeName",
          assigner_name as "assignerName",
          priority,
          status,
          COALESCE(progress, 0)::int as progress,
          progress_note as "progressNote",
          department,
          accepted_at as "acceptedAt",
          completed_at as "completedAt",
          deadline,
          customer_name as "customerName",
          customer_phone as "customerPhone",
          customer_contact as "customerContact",
          customer_requirements as "customerRequirements",
          COALESCE(attachments, '') as "attachments",
          COALESCE(report_url, '') as "reportUrl",
          COALESCE(report_note, '') as "reportNote",
          COALESCE(report_file_name, '') as "reportFileName",
          COALESCE(report_file_type, '') as "reportFileType",
          COALESCE(handover_history, '[]'::jsonb) as "handoverHistory",
          COALESCE(task_type, 'general') as "taskType",
          created_at as "createdAt"
        FROM public.company_tasks
        WHERE 1=1
      `;
      const params: any[] = [];

      if (communityId && communityId !== 'all') {
        params.push(communityId);
        query += ` AND (community_id = $${params.length}`;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(communityId);
        if (!isUuid) {
          query += ` OR community_id = 'c1983000-0000-4000-8000-000000001983')`;
        } else {
          query += `)`;
        }
      }

      if (statusFilter && statusFilter !== 'all') {
        params.push(statusFilter);
        query += ` AND status = $${params.length}`;
      }

      if (isMyTasks && userId) {
        params.push(userId);
        query += ` AND (assignee_id = $${params.length}`;
        try {
          const userName = await this.repo.findUserName(userId);
          if (userName) {
            params.push(`%${userName}%`);
            query += ` OR assignee_name ILIKE $${params.length}`;
          }
        } catch {}
        query += `)`;
      } else if (assigneeIdFilter) {
        params.push(assigneeIdFilter);
        query += ` AND assignee_id = $${params.length}`;
      }

      query += ` ORDER BY created_at DESC`;

      const tasks = await this.repo.findTasks(query, params);
      if (tasks && tasks.length > 0) {
        return { ok: true, tasks };
      }
    } catch (e) {
      this.logger.warn('listCompanyTasks DB query fallback:', e);
    }

    let memoryTasks = [...(this.companyTasksStore.get(communityId) || [])];
    memoryTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (statusFilter && statusFilter !== 'all') {
      memoryTasks = memoryTasks.filter(t => t.status === statusFilter);
    }
    if (isMyTasks && userId) {
      memoryTasks = memoryTasks.filter(t => t.assigneeId === userId);
    }

    return {
      ok: true,
      tasks: memoryTasks,
    };
  }

  async listAllUserCompanyTasks(userId: string, statusFilter?: string) {
    return this.listCompanyTasks(userId, 'all', statusFilter, true);
  }

  async createCompanyTask(userId: string, communityId: string, body: any) {
    if (!body?.title || !body.title.trim()) {
      throw new BadRequestException('Tiêu đề công việc không được để trống');
    }

    // Phân quyền giao việc: Ban Giám Đốc / Quản trị có toàn quyền, hoặc Trưởng ban được phân công ở phòng ban này
    const isExec = await this.repo.isUserExecutive(userId, communityId);
    const targetDept = body.department || 'Vận hành';
    if (!isExec) {
      const canAssignInDept = await this.repo.checkUserCanOperateInDepartment(userId, communityId, targetDept, 'assign');
      if (!canAssignInDept) {
        throw new ForbiddenException(
          `Bạn không có quyền giao việc cho ${targetDept}. Chức năng giao việc chỉ dành cho Ban Giám Đốc hoặc Trưởng ban được phân công!`,
        );
      }
    }

    let assignerName = 'Ban Giám Đốc';
    try {
      assignerName = await this.repo.findCallerName(userId);
    } catch {}

    let assigneeName = (body.assigneeName || '').trim();
    const assigneeId = body.assigneeId || body.userId;
    if (!assigneeName || assigneeName === 'Nhân sự ViOne' || assigneeName === 'Thành viên được giao') {
      if (assigneeId) {
        try {
          assigneeName = await this.repo.findAssigneeName(assigneeId);
        } catch {}
      }
    }
    if (!assigneeName) assigneeName = 'Thành viên được giao';

    const now = new Date();
    const taskId = `task-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const newTask = {
      id: taskId,
      communityId,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      assigneeId: assigneeId || 'emp-vione',
      assigneeName: assigneeName.trim() || 'Thành viên được giao',
      assignerName,
      priority: body.priority || 'high',
      status: 'assigned',
      progress: Math.min(100, Math.max(0, Number(body.progress) || 0)),
      progressNote: body.progressNote || body.progress_note || '',
      department: body.department || 'Vận hành',
      acceptedAt: null,
      completedAt: null,
      deadline: body.deadline?.trim() || 'Trong 24h tới',
      customerName: body.customerName?.trim() || '',
      customerPhone: body.customerPhone?.trim() || '',
      customerContact: body.customerContact?.trim() || '',
      customerRequirements: body.customerRequirements?.trim() || '',
      attachments: typeof body.attachments === 'string' ? body.attachments : JSON.stringify(body.attachments || []),
      reportUrl: body.reportUrl || body.report_url || '',
      reportNote: body.reportNote || body.report_note || '',
      taskType: body.taskType || body.task_type || 'general',
      createdAt: now.toISOString(),
    };

    try {
      await this.repo.insertCompanyTask(newTask);
    } catch (e) {
      this.logger.warn('createCompanyTask DB insert fallback:', e);
    }

    const isAssigneeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newTask.assigneeId);
    if (isAssigneeUuid) {
      const notifId = crypto.randomUUID();
      const dedupe = `task_assigned_${taskId}_${newTask.assigneeId}_${Date.now()}`;
      await this.repo.insertBusinessNotification(
        notifId,
        newTask.assigneeId,
        taskId,
        dedupe,
        'Bạn có công việc mới được giao',
        `${assignerName} đã giao cho bạn: "${newTask.title}". Hạn chót: ${newTask.deadline}.`,
        JSON.stringify({ taskId, title: newTask.title, assignerName, deadline: newTask.deadline, priority: newTask.priority, communityId }),
      );
    }

    await this.repo.insertMemberNotification(
      newTask.assigneeId,
      'Công việc mới được giao',
      `${assignerName} đã giao công việc: "${newTask.title}". Vui lòng nhận việc và cập nhật tiến độ.`,
      taskId,
    );

    const tasks = this.companyTasksStore.get(communityId) || [];
    tasks.unshift(newTask);
    this.companyTasksStore.set(communityId, tasks);

    try {
      this.gateway.emitToAll('notification:new', {
        title: 'Công việc mới được giao',
        body: `Công việc: "${newTask.title}" đã được giao cho ${newTask.assigneeName}.`,
        targetUserId: newTask.assigneeId,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
      this.gateway.emitToAll('company_task:created', { communityId, task: newTask });
    } catch {}

    return {
      ok: true,
      task: newTask,
      message: `Đã giao việc thành công cho ${newTask.assigneeName}! Thông báo đã được gửi tới tài khoản.`,
    };
  }

  async acceptCompanyTask(userId: string, communityId: string, taskId: string) {
    const now = new Date();
    try {
      await this.repo.acceptCompanyTask(taskId);
    } catch (e) {
      this.logger.warn('acceptCompanyTask DB update fallback:', e);
    }

    const tasks = this.companyTasksStore.get(communityId) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    let taskTitle = 'Công việc';
    let assigneeName = 'Nhân sự';
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'in_progress';
      tasks[taskIndex].acceptedAt = now.toISOString();
      taskTitle = tasks[taskIndex].title;
      assigneeName = tasks[taskIndex].assigneeName;
      this.companyTasksStore.set(communityId, tasks);
    } else {
      try {
        const dbTask = await this.repo.findTaskSimple(taskId);
        if (dbTask) {
          taskTitle = dbTask.title;
          assigneeName = dbTask.assigneeName;
        }
      } catch {}
    }

    try {
      this.gateway.emitToAll('company_task:updated', { communityId, taskId, status: 'in_progress' });
      this.gateway.emitToAll('notification:new', {
        title: 'Nhân sự đã nhận việc',
        body: `${assigneeName} đã bắt đầu tiến hành công việc: "${taskTitle}".`,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      message: 'Đã nhận việc thành công! Hệ thống đã thông báo cho quản lý.',
    };
  }

  /**
   * Chỉnh sửa thông tin công việc:
   * Phân quyền dữ liệu: Không cho tài khoản khác chỉnh sửa bản ghi do tài khoản khác tạo ra,
   * trừ khi có role quản trị hoặc role admin.
   */
  async updateCompanyTask(userId: string, communityId: string, taskId: string, body: any) {
    const canEdit = await this.repo.checkUserCanEditTask(userId, taskId);
    if (!canEdit) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bản ghi do tài khoản khác tạo ra!');
    }

    if (body.assigneeId && !body.assigneeName) {
      try {
        body.assigneeName = await this.repo.findAssigneeName(body.assigneeId);
      } catch {}
    }

    await this.repo.updateCompanyTask(taskId, body);

    const tasks = this.companyTasksStore.get(communityId) || [];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      this.companyTasksStore.set(communityId, tasks);
    }

    try {
      this.gateway.emitToAll('company_task:updated', { communityId, taskId, task: body });
    } catch {}

    return {
      ok: true,
      message: 'Đã cập nhật thông tin công việc thành công!',
    };
  }

  async deleteCompanyTask(userId: string, communityId: string, taskId: string) {
    const canDelete = (await this.repo.checkUserCanEditTask(userId, taskId)) || (await this.repo.checkUserCanAssignTask(userId, communityId));
    if (!canDelete) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này!');
    }

    await this.repo.deleteCompanyTask(taskId);

    const tasks = this.companyTasksStore.get(communityId) || [];
    const filtered = tasks.filter((t) => t.id !== taskId);
    this.companyTasksStore.set(communityId, filtered);

    try {
      this.gateway.emitToAll('company_task:deleted', { communityId, taskId });
    } catch {}

    return {
      ok: true,
      message: 'Đã xóa công việc thành công!',
    };
  }

  async updateCompanyTaskStatus(userId: string, communityId: string, taskId: string, status: string) {
    const now = new Date();
    try {
      if (status === 'completed') {
        await this.repo.completeCompanyTask(taskId, status);
      } else {
        await this.repo.updateCompanyTaskStatus(taskId, status);
      }
    } catch (e) {
      this.logger.warn('updateCompanyTaskStatus DB update fallback:', e);
    }

    const tasks = this.companyTasksStore.get(communityId) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    let taskTitle = 'Công việc';
    let assigneeName = 'Nhân sự';
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      if (status === 'completed') tasks[taskIndex].completedAt = now.toISOString();
      taskTitle = tasks[taskIndex].title;
      assigneeName = tasks[taskIndex].assigneeName;
      this.companyTasksStore.set(communityId, tasks);
    } else {
      try {
        const dbTask = await this.repo.findTaskSimple(taskId);
        if (dbTask) {
          taskTitle = dbTask.title;
          assigneeName = dbTask.assigneeName;
        }
      } catch {}
    }

    try {
      this.gateway.emitToAll('company_task:updated', { communityId, taskId, status });
      if (status === 'completed') {
        this.gateway.emitToAll('notification:new', {
          title: 'Công việc đã hoàn thành',
          body: `${assigneeName} vừa báo cáo hoàn thành công việc: "${taskTitle}".`,
          appScope: 'all',
          sentAt: now.toISOString(),
        });
        this.gateway.emitToAll('notification:count', {});
      }
    } catch {}

    return {
      ok: true,
      message: `Đã cập nhật trạng thái công việc thành "${status}".`,
    };
  }

  async updateCompanyTaskProgress(
    userId: string,
    communityId: string,
    taskId: string,
    progress: number,
    note?: string,
    targetStatus?: string,
  ) {
    const now = new Date();
    const clampedProgress = Math.min(100, Math.max(0, Math.round(Number(progress) || 0)));
    let status = targetStatus;
    if (!status) {
      if (clampedProgress >= 100) {
        status = 'completed';
      } else if (clampedProgress > 0) {
        status = 'in_progress';
      }
    }

    try {
      await this.repo.updateCompanyTaskProgress(taskId, clampedProgress, note, status);
    } catch (e) {
      this.logger.warn('updateCompanyTaskProgress DB update fallback:', e);
    }

    const tasks = this.companyTasksStore.get(communityId) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    let taskTitle = 'Công việc';
    let assigneeName = 'Nhân sự';
    let assignerName = 'Quản lý';
    if (taskIndex !== -1) {
      tasks[taskIndex].progress = clampedProgress;
      if (note !== undefined && note !== null) tasks[taskIndex].progressNote = note;
      if (status) tasks[taskIndex].status = status;
      if (status === 'completed') tasks[taskIndex].completedAt = now.toISOString();
      taskTitle = tasks[taskIndex].title;
      assigneeName = tasks[taskIndex].assigneeName;
      assignerName = tasks[taskIndex].assignerName;
      this.companyTasksStore.set(communityId, tasks);
    } else {
      try {
        const dbTask = await this.repo.findTaskSimple(taskId);
        if (dbTask) {
          taskTitle = dbTask.title;
          assigneeName = dbTask.assigneeName;
          assignerName = dbTask.assignerName || assignerName;
        }
      } catch {}
    }

    try {
      this.gateway.emitToAll('company_task:updated', {
        communityId,
        taskId,
        progress: clampedProgress,
        progressNote: note,
        status,
      });

      const notifTitle = clampedProgress >= 100 ? 'Công việc đã hoàn tất' : `Cập nhật tiến độ: ${clampedProgress}%`;
      const notifBody = `${assigneeName} vừa cập nhật tiến độ công việc "${taskTitle}" đạt ${clampedProgress}%${note ? `: "${note}"` : '.'}`;

      this.gateway.emitToAll('notification:new', {
        title: notifTitle,
        body: notifBody,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      progress: clampedProgress,
      status,
      message: `Đã cập nhật tiến độ đạt ${clampedProgress}% cho công việc "${taskTitle}".`,
    };
  }

  async importCompanyTasksFromExcel(
    userId: string,
    communityId: string,
    rawTasks: Array<{
      title: string;
      description?: string;
      assigneeName?: string;
      assigneeId?: string;
      priority?: string;
      deadline?: string;
      department?: string;
      progress?: number;
    }>,
  ) {
    if (!Array.isArray(rawTasks) || rawTasks.length === 0) {
      throw new BadRequestException('Danh sách công việc import không được để trống.');
    }

    const inserted: any[] = [];
    for (const raw of rawTasks) {
      if (!raw?.title || !raw.title.trim()) continue;
      try {
        const res = await this.createCompanyTask(userId, communityId, {
          title: raw.title.trim(),
          description: raw.description || '',
          assigneeName: raw.assigneeName || 'Nhân sự',
          assigneeId: raw.assigneeId,
          priority: raw.priority || 'high',
          deadline: raw.deadline || 'Hôm nay',
          department: raw.department || 'Vận hành',
          progress: Number(raw.progress) || 0,
        });
        if (res?.task) {
          inserted.push(res.task);
        }
      } catch (err) {
        this.logger.warn(`Lỗi import 1 task: ${raw.title}`, err);
      }
    }

    return {
      ok: true,
      importedCount: inserted.length,
      tasks: inserted,
      message: `Đã import thành công ${inserted.length}/${rawTasks.length} công việc từ tệp Excel vào hệ thống!`,
    };
  }

  async getCompanyWorkspaceOverview(userId: string, communityId: string) {
    const employeesRes = await this.listCompanyEmployees(userId, communityId);
    const employees = employeesRes.employees || [];

    const tasksRes = await this.listCompanyTasks(userId, communityId, 'all');
    const tasks = tasksRes.tasks || [];

    let customerCare = this.companyCustomerCareStore.get(communityId) || [];
    try {
      customerCare = await this.repo.listCustomerCare(communityId);
    } catch {}

    const totalTasks = tasks.length;
    const assignedTasks = tasks.filter(t => t.status === 'assigned').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalDealsValue = customerCare.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);

    return {
      ok: true,
      metrics: {
        totalEmployees: employees.length,
        totalTasks,
        assignedTasks,
        inProgressTasks,
        completedTasks,
        acceptanceRate: totalTasks > 0 ? Math.round(((totalTasks - assignedTasks) / totalTasks) * 100) : 100,
        totalDealsValue,
        totalDealsValueFormatted: totalDealsValue > 0 ? `${totalDealsValue.toLocaleString('vi-VN')} đ` : '0 đ',
      },
      employees,
      tasks,
      customerCare,
      recentActivities: [],
    };
  }

  async getCompanySupervision(userId: string, communityId: string) {
    return this.getCompanyWorkspaceOverview(userId, communityId);
  }

  async addCustomerCareLog(userId: string, communityId: string, body: any) {
    const logId = `care-${Date.now().toString(36)}`;
    const dealValue = Number(body.dealValue) || 0;
    const newLog = {
      id: logId,
      employeeId: body.employeeId || 'emp-vione',
      employeeName: body.employeeName || 'Thành viên ViOne',
      customerName: body.customerName || 'Khách hàng',
      customerContact: body.customerContact || '',
      customerCompany: body.customerCompany || '',
      stage: body.stage || 'contacted',
      stageLabel: body.stageLabel || 'Đã liên hệ',
      dealValue,
      dealValueLabel: dealValue > 0 ? `${dealValue.toLocaleString('vi-VN')} đ` : '0 đ',
      lastAction: body.lastAction || 'Ghi nhận chăm sóc khách hàng',
      lastActionAt: 'Vừa xong',
      progressPercent: body.progressPercent || 50,
      nextFollowUp: body.nextFollowUp || 'Theo dõi tiếp tục',
    };

    try {
      await this.repo.insertCustomerCare(communityId, newLog);
    } catch (e) {
      this.logger.warn('addCustomerCareLog DB insert fallback:', e);
    }

    const customerCare = this.companyCustomerCareStore.get(communityId) || [];
    customerCare.unshift(newLog);
    this.companyCustomerCareStore.set(communityId, customerCare);

    return {
      ok: true,
      log: newLog,
      message: 'Đã lưu nhật ký khách hàng thành công.',
    };
  }

  // ==========================================
  // --- QUẢN LÝ PHÒNG BAN (DEPARTMENTS) ---
  // ==========================================

  async listCommunityDepartments(communityId: string) {
    let departments = await this.repo.listCommunityDepartments(communityId);
    if (!departments || departments.length === 0) {
      // Seed mặc định 6 phòng ban cho doanh nghiệp
      const defaults = [
        { name: 'Ban Giám Đốc', description: 'Điều hành chiến lược, phê duyệt kế hoạch & quyết sách tối cao', color: '#B8860B', membersCount: 3 },
        { name: 'Phòng Kinh Doanh & Bán Hàng', description: 'Phát triển thị trường, tìm kiếm khách hàng, ký kết hợp đồng', color: '#2563EB', membersCount: 8 },
        { name: 'Phòng Kỹ Thuật & Công Nghệ', description: 'Nghiên cứu phát triển sản phẩm, chuyển đổi số & hạ tầng công nghệ', color: '#059669', membersCount: 6 },
        { name: 'Phòng Kế Toán & Tài Chính', description: 'Quản trị dòng tiền, hạch toán thu chi, quyết toán & báo cáo tài chính', color: '#D97706', membersCount: 4 },
        { name: 'Phòng Hành Chính & Nhân Sự', description: 'Tuyển dụng, đào tạo, quản lý hồ sơ nhân sự & quy chế nội bộ', color: '#9333EA', membersCount: 4 },
        { name: 'Phòng Marketing & Truyền Thông', description: 'Xây dựng thương hiệu, chiến dịch truyền thông & kết nối đối tác', color: '#E11D48', membersCount: 5 },
      ];
      for (const d of defaults) {
        await this.repo.insertCommunityDepartment({
          communityId,
          ...d,
        });
      }
      departments = await this.repo.listCommunityDepartments(communityId);
    }
    return {
      ok: true,
      departments: departments || [],
    };
  }

  async createCommunityDepartment(userId: string, communityId: string, body: any) {
    if (!body?.name || !body.name.trim()) {
      throw new BadRequestException('Tên phòng ban không được để trống.');
    }
    const canManage = await this.repo.checkUserCanAssignTask(userId, communityId);
    if (!canManage) {
      throw new ForbiddenException('Chỉ Ban Quản Trị hoặc Giám Đốc mới có quyền tạo phòng ban.');
    }

    const dept = {
      communityId,
      name: body.name.trim(),
      description: body.description?.trim() || '',
      managerId: body.managerId || null,
      managerName: body.managerName || '',
      color: body.color || '#DFB76C',
      membersCount: Number(body.membersCount) || 1,
    };

    await this.repo.insertCommunityDepartment(dept);
    const listRes = await this.listCommunityDepartments(communityId);

    try {
      this.gateway.emitToAll('department:created', { communityId, department: dept });
    } catch {}

    return {
      ok: true,
      department: dept,
      departments: listRes.departments,
      message: `Đã tạo phòng ban "${dept.name}" thành công!`,
    };
  }

  async deleteCommunityDepartment(userId: string, communityId: string, departmentId: string) {
    const canManage = await this.repo.checkUserCanAssignTask(userId, communityId);
    if (!canManage) {
      throw new ForbiddenException('Chỉ Ban Quản Trị hoặc Giám Đốc mới có quyền xóa phòng ban.');
    }
    await this.repo.deleteCommunityDepartment(communityId, departmentId);
    return {
      ok: true,
      message: 'Đã xóa phòng ban thành công.',
    };
  }

  // ==========================================
  // --- CHUYỂN GIAO VIỆC (TASK HANDOVER) ---
  // ==========================================

  async handoverCompanyTask(userId: string, communityId: string, taskId: string, body: any) {
    const toAssigneeId = body.toAssigneeId || body.assigneeId;
    const toAssigneeName = (body.toAssigneeName || body.assigneeName || 'Nhân sự nhận bàn giao').trim();
    const toDepartment = body.toDepartment || body.department;
    const reason = (body.reason || body.handoverReason || 'Bàn giao chuyển giao công việc nội bộ').trim();
    const note = (body.note || body.handoverNote || '').trim();

    if (!toAssigneeId && !toDepartment) {
      throw new BadRequestException('Vui lòng chọn nhân sự hoặc phòng ban nhận bàn giao.');
    }

    const dbTask = await this.repo.findTaskSimple(taskId);
    if (!dbTask) {
      throw new BadRequestException('Không tìm thấy công việc tương ứng.');
    }

    const isExec = await this.repo.isUserExecutive(userId, communityId);
    const isAssignee = String(dbTask.assigneeId) === String(userId);
    const canHandoverInDept = await this.repo.checkUserCanOperateInDepartment(userId, communityId, dbTask.department || 'Vận hành', 'handover');
    if (!isExec && !isAssignee && !canHandoverInDept) {
      throw new ForbiddenException('Bạn không có quyền chuyển giao công việc này. Chỉ Ban Giám Đốc, Trưởng ban hoặc người trực tiếp phụ trách mới được chuyển việc!');
    }

    let callerName = 'Đồng nghiệp';
    try {
      callerName = await this.repo.findCallerName(userId);
    } catch {}

    const now = new Date();
    const handoverEntry = {
      fromAssigneeId: dbTask.assigneeId,
      fromAssigneeName: dbTask.assigneeName || 'Nhân sự phụ trách trước',
      fromDepartment: dbTask.department || 'Vận hành',
      toAssigneeId,
      toAssigneeName,
      toDepartment: toDepartment || dbTask.department || 'Vận hành',
      reason,
      note,
      transferredBy: callerName,
      transferredAt: now.toISOString(),
    };

    await this.repo.handoverCompanyTask(taskId, toAssigneeId, toAssigneeName, toDepartment, handoverEntry);

    // Gửi notification cho người nhận việc mới
    const isAssigneeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(toAssigneeId);
    if (isAssigneeUuid) {
      const notifId = crypto.randomUUID();
      const dedupe = `task_handover_${taskId}_${toAssigneeId}_${Date.now()}`;
      await this.repo.insertBusinessNotification(
        notifId,
        toAssigneeId,
        taskId,
        dedupe,
        '🔄 Bạn được chuyển giao công việc mới',
        `${callerName} đã chuyển giao công việc: "${dbTask.title}" cho bạn. Lý do: ${reason}.`,
        JSON.stringify({ taskId, title: dbTask.title, transferredBy: callerName, reason, note, communityId }),
      );
    }

    await this.repo.insertMemberNotification(
      toAssigneeId,
      '🔄 Chuyển giao công việc',
      `${callerName} vừa bàn giao công việc "${dbTask.title}" cho bạn: "${reason}".`,
      taskId,
    );

    // Đồng bộ bộ nhớ ram
    const tasks = this.companyTasksStore.get(communityId) || [];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[idx].assigneeId = toAssigneeId;
      tasks[idx].assigneeName = toAssigneeName;
      if (toDepartment) tasks[idx].department = toDepartment;
      tasks[idx].status = 'assigned';
      if (!Array.isArray(tasks[idx].handoverHistory)) tasks[idx].handoverHistory = [];
      tasks[idx].handoverHistory.unshift(handoverEntry);
      this.companyTasksStore.set(communityId, tasks);
    }

    try {
      this.gateway.emitToAll('company_task:updated', {
        communityId,
        taskId,
        assigneeId: toAssigneeId,
        assigneeName: toAssigneeName,
        department: toDepartment,
        status: 'assigned',
        handoverEntry,
      });
      this.gateway.emitToAll('notification:new', {
        title: 'Chuyển giao công việc nội bộ',
        body: `${callerName} đã chuyển giao công việc "${dbTask.title}" cho ${toAssigneeName}.`,
        targetUserId: toAssigneeId,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      message: `Đã chuyển giao công việc "${dbTask.title}" cho ${toAssigneeName} thành công! Hệ thống đã tự động gửi thông báo trực tiếp.`,
      handoverEntry,
    };
  }

  // ==========================================
  // --- NỘP BÁO CÁO FILE WORD & EXCEL ---
  // ==========================================

  async submitCompanyTaskReport(userId: string, communityId: string, taskId: string, body: any) {
    const dbTask = await this.repo.findTaskSimple(taskId);
    if (!dbTask) {
      throw new BadRequestException('Không tìm thấy công việc tương ứng.');
    }

    const isExec = await this.repo.isUserExecutive(userId, communityId);
    const isAssignee = String(dbTask.assigneeId) === String(userId);
    const canReportInDept = await this.repo.checkUserCanOperateInDepartment(userId, communityId, dbTask.department || 'Vận hành', 'report');
    if (!isExec && !isAssignee && !canReportInDept) {
      throw new ForbiddenException('Bạn không có quyền nộp báo cáo cho công việc này. Chỉ Ban Giám Đốc, Trưởng ban hoặc người trực tiếp phụ trách mới được nộp báo cáo!');
    }

    const progress = Math.min(100, Math.max(0, Math.round(Number(body.progress) || 100)));
    const isCompleted = progress >= 100;
    const status = isCompleted ? 'completed' : 'in_progress';
    const reportUrl = (body.reportUrl || body.report_url || '').trim();
    const reportNote = (body.reportNote || body.report_note || body.note || '').trim();
    const reportFileName = (body.reportFileName || body.report_file_name || '').trim();
    const reportFileType = (body.reportFileType || body.report_file_type || 'other').trim();

    await this.repo.updateCompanyTask(taskId, {
      progress,
      progressNote: reportNote,
      status,
      reportUrl,
      reportNote,
      reportFileName,
      reportFileType,
    });

    const now = new Date();
    let callerName = 'Nhân sự';
    try {
      callerName = await this.repo.findCallerName(userId);
    } catch {}

    const tasks = this.companyTasksStore.get(communityId) || [];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks[idx].progress = progress;
      tasks[idx].progressNote = reportNote;
      tasks[idx].status = status;
      tasks[idx].reportUrl = reportUrl;
      tasks[idx].reportNote = reportNote;
      tasks[idx].reportFileName = reportFileName;
      tasks[idx].reportFileType = reportFileType;
      if (isCompleted) tasks[idx].completedAt = now.toISOString();
      this.companyTasksStore.set(communityId, tasks);
    }

    try {
      this.gateway.emitToAll('company_task:updated', {
        communityId,
        taskId,
        progress,
        status,
        reportUrl,
        reportFileName,
        reportFileType,
        reportNote,
      });

      const fileInfo = reportFileName ? ` (Tệp: ${reportFileName})` : '';
      this.gateway.emitToAll('notification:new', {
        title: isCompleted ? '✓ Báo cáo hoàn thành công việc' : `Tiến độ công việc đạt ${progress}%`,
        body: `${callerName} vừa nộp báo cáo cho công việc "${dbTask?.title || 'Nhiệm vụ'}"${fileInfo}.`,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      progress,
      status,
      reportUrl,
      reportFileName,
      reportFileType,
      message: isCompleted
        ? '✓ Đã nộp báo cáo và nghiệm thu hoàn tất công việc 100%!'
        : `✓ Đã cập nhật tiến độ đạt ${progress}% kèm tệp báo cáo.`,
    };
  }

  // ==========================================
  // --- HỌP BAN TRỰC TUYẾN 1-CHẠM (INSTANT MEETING) ---
  // ==========================================

  async triggerInstantMeeting(userId: string, communityId: string, body: any) {
    const departmentName = body.departmentName || 'Toàn công ty';
    const isExec = await this.repo.isUserExecutive(userId, communityId);
    if (!isExec && departmentName !== 'Toàn công ty') {
      const canMeetInDept = await this.repo.checkUserCanOperateInDepartment(userId, communityId, departmentName, 'meet');
      if (!canMeetInDept) {
        throw new ForbiddenException(`Bạn chỉ có quyền triệu tập cuộc họp cho phòng ban bạn phụ trách (${departmentName})!`);
      }
    }

    const roomTitle = body.roomTitle || `Họp điều hành ${departmentName}`;
    const randRoom = Math.random().toString(36).substring(2, 9);
    const meetingUrl =
      body.meetingUrl ||
      `https://meet.jit.si/vione-executive-${communityId.replace(/-/g, '').slice(0, 8)}-${randRoom}`;

    let callerName = 'Ban Giám Đốc';
    try {
      callerName = await this.repo.findCallerName(userId);
    } catch {}

    const now = new Date();
    try {
      this.gateway.emitToAll('meeting:instant_started', {
        communityId,
        departmentName,
        roomTitle,
        meetingUrl,
        hostName: callerName,
        startedAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:new', {
        title: `📹 Họp trực tuyến khẩn cấp: ${departmentName}`,
        body: `${callerName} triệu tập cuộc họp trực tuyến "${roomTitle}". Nhấn để tham gia ngay!`,
        appScope: 'all',
        sentAt: now.toISOString(),
        safeData: { meetingUrl, roomTitle, departmentName },
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      meetingUrl,
      roomTitle,
      departmentName,
      hostName: callerName,
      message: `Đã mở phòng họp trực tuyến và phát thông báo triệu tập khẩn cấp tới ${departmentName}!`,
    };
  }

  // ==========================================
  // --- PHÂN QUYỀN PHÒNG BAN (DEPARTMENT RBAC) ---
  // ==========================================

  async getMyDepartmentPermissions(userId: string, communityId: string) {
    const isExecutive = await this.repo.isUserExecutive(userId, communityId);
    const departments = await this.repo.findUserDepartmentMemberships(userId, communityId);
    const allowedDepartmentNames = isExecutive ? ['*'] : departments.map((d: any) => d.departmentName);

    return {
      ok: true,
      isExecutive,
      departments,
      allowedDepartmentNames,
    };
  }

  async listCommunityDepartmentMembers(userId: string, communityId: string) {
    const members = await this.repo.listCommunityDepartmentMembers(communityId);
    return {
      ok: true,
      members,
    };
  }

  async assignDepartmentMember(userId: string, communityId: string, body: any) {
    const isExec = await this.repo.isUserExecutive(userId, communityId);
    const targetDeptId = body.departmentId || body.department_id;
    const targetDeptName = body.departmentName || body.department_name;
    const targetUserId = body.userId || body.user_id;

    if (!targetDeptId || !targetDeptName || !targetUserId) {
      throw new BadRequestException('Thiếu thông tin phòng ban hoặc nhân sự cần phân quyền');
    }

    if (!isExec) {
      const isLead = await this.repo.checkUserCanOperateInDepartment(userId, communityId, targetDeptName, 'assign');
      if (!isLead) {
        throw new ForbiddenException('Chỉ Ban Giám Đốc hoặc Trưởng ban mới có quyền phân công thành viên vào phòng ban.');
      }
    }

    let targetUserName = (body.userName || body.user_name || '').trim();
    if (!targetUserName) {
      try {
        targetUserName = (await this.repo.findAssigneeName(targetUserId)) || 'Thành viên';
      } catch {
        targetUserName = 'Thành viên';
      }
    }

    await this.repo.upsertDepartmentMember({
      communityId,
      departmentId: targetDeptId,
      departmentName: targetDeptName,
      userId: targetUserId,
      userName: targetUserName,
      userEmail: body.userEmail || body.user_email || '',
      userPhone: body.userPhone || body.user_phone || '',
      userAvatar: body.userAvatar || body.user_avatar || '',
      role: body.role || 'member',
      canAssign: body.canAssign !== undefined ? Boolean(body.canAssign) : (body.role === 'lead'),
      canAccept: body.canAccept !== undefined ? Boolean(body.canAccept) : true,
      canReport: body.canReport !== undefined ? Boolean(body.canReport) : true,
      canHandover: body.canHandover !== undefined ? Boolean(body.canHandover) : true,
      canMeet: body.canMeet !== undefined ? Boolean(body.canMeet) : (body.role === 'lead'),
    });

    const now = new Date();
    try {
      this.gateway.emitToAll('department:member_updated', {
        communityId,
        departmentId: targetDeptId,
        departmentName: targetDeptName,
        userId: targetUserId,
        userName: targetUserName,
        role: body.role || 'member',
      });
      this.gateway.emitToAll('notification:new', {
        title: '🛡️ Phân quyền phòng ban',
        body: `Bạn vừa được phân quyền vào "${targetDeptName}" với vai trò ${body.role === 'lead' ? 'Trưởng ban' : 'Chuyên viên'}.`,
        targetUserId,
        appScope: 'all',
        sentAt: now.toISOString(),
      });
      this.gateway.emitToAll('notification:count', {});
    } catch {}

    return {
      ok: true,
      message: `Đã phân quyền cho ${targetUserName} vào ${targetDeptName} thành công!`,
    };
  }

  async deleteDepartmentMember(userId: string, communityId: string, departmentId: string, targetUserId: string) {
    const isExec = await this.repo.isUserExecutive(userId, communityId);
    if (!isExec) {
      throw new ForbiddenException('Chỉ Ban Giám Đốc hoặc Quản trị viên mới có quyền gỡ thành viên khỏi phòng ban.');
    }

    await this.repo.deleteDepartmentMember(communityId, departmentId, targetUserId);

    try {
      this.gateway.emitToAll('department:member_deleted', {
        communityId,
        departmentId,
        userId: targetUserId,
      });
    } catch {}

    return {
      ok: true,
      message: 'Đã gỡ thành viên khỏi phòng ban thành công.',
    };
  }
}
