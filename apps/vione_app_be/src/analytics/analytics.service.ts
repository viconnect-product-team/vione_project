import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE DASHBOARD KPI)
   */
  async getExecutiveOverview(companyId?: string) {
    try {
      const taskWhere = companyId ? `WHERE community_id = '${companyId}'` : '';
      const empWhere = companyId ? `WHERE community_id = '${companyId}'` : '';

      // Thống kê công việc
      const taskStats = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COUNT(*)::int as "totalTasks",
          COUNT(*) FILTER (WHERE status = 'completed')::int as "completedTasks",
          COUNT(*) FILTER (WHERE status = 'in_progress')::int as "inProgressTasks",
          COUNT(*) FILTER (WHERE status = 'assigned')::int as "assignedTasks"
        FROM public.company_tasks ${taskWhere}
      `).then(r => r[0] || { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, assignedTasks: 0 });

      const totalTasks = taskStats.totalTasks || 0;
      const completedTasks = taskStats.completedTasks || 0;
      const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Thống kê nhân sự & slots
      const empCount = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM public.company_employees ${empWhere}
      `).then(r => r[0]?.count || 0);

      // Thống kê tài chính từ transactions
      const finance = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)::numeric as "totalIncome",
          COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)::numeric as "totalExpense"
        FROM public.transactions
      `).then(r => r[0] || { totalIncome: 0, totalExpense: 0 });

      // Thống kê khách hàng từ crm / members
      const customerCount = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM public.members
      `).then(r => r[0]?.count || 0);

      return {
        ok: true,
        kpi: {
          totalTasks,
          completedTasks,
          inProgressTasks: taskStats.inProgressTasks || 0,
          assignedTasks: taskStats.assignedTasks || 0,
          taskCompletionRate,
          totalEmployees: empCount,
          totalIncome: Number(finance.totalIncome) || 0,
          totalExpense: Number(finance.totalExpense) || 0,
          netProfit: (Number(finance.totalIncome) || 0) - (Number(finance.totalExpense) || 0),
          totalCustomers: customerCount,
        },
      };
    } catch (err) {
      this.logger.error('Error getting executive overview:', err);
      return { ok: false, kpi: {} };
    }
  }

  /**
   * 2. THỐNG KÊ VẬN HÀNH & CÔNG VIỆC (OPERATIONS & TASKS ANALYTICS)
   */
  async getOperationsStats(companyId?: string) {
    try {
      const whereClause = companyId ? `WHERE ct.community_id = '${companyId}'` : '';

      // Trạng thái công việc
      const statusBreakdown = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          ct.status,
          COUNT(*)::int as count
        FROM public.company_tasks ct
        ${whereClause}
        GROUP BY ct.status
      `);

      // Mức độ ưu tiên
      const priorityBreakdown = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          ct.priority,
          COUNT(*)::int as count
        FROM public.company_tasks ct
        ${whereClause}
        GROUP BY ct.priority
      `);

      // Phân bổ công việc theo nhân sự hàng đầu
      const topAssignees = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          ct.assignee_name as "name",
          COUNT(*)::int as "totalTasks",
          COUNT(*) FILTER (WHERE ct.status = 'completed')::int as "completedTasks"
        FROM public.company_tasks ct
        ${whereClause}
        WHERE ct.assignee_name IS NOT NULL
        GROUP BY ct.assignee_name
        ORDER BY "totalTasks" DESC
        LIMIT 6
      `);

      // Tổng quan & tỷ lệ hoàn thành
      const totalTasks = statusBreakdown.reduce((sum, item) => sum + item.count, 0);
      const completed = statusBreakdown.find(s => s.status === 'completed')?.count || 0;
      const inProgress = statusBreakdown.find(s => s.status === 'in_progress')?.count || 0;
      const assigned = statusBreakdown.find(s => s.status === 'assigned')?.count || 0;
      const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

      return {
        ok: true,
        summary: {
          totalTasks,
          completed,
          inProgress,
          assigned,
          completionRate,
        },
        statusBreakdown,
        priorityBreakdown,
        topAssignees,
      };
    } catch (err) {
      this.logger.error('Error getting operations stats:', err);
      return { ok: false, summary: {}, statusBreakdown: [], priorityBreakdown: [], topAssignees: [] };
    }
  }

  /**
   * 3. THỐNG KÊ NHÂN SỰ & CHẤM CÔNG (HR & ATTENDANCE ANALYTICS)
   */
  async getAttendanceStats(companyId?: string) {
    try {
      const empWhere = companyId ? `WHERE ce.community_id = '${companyId}'` : '';

      // Nhân sự theo phòng ban
      const departmentBreakdown = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COALESCE(ce.department, 'Khác') as "department",
          COUNT(*)::int as "count"
        FROM public.company_employees ce
        ${empWhere}
        GROUP BY ce.department
        ORDER BY "count" DESC
      `);

      // Nhân sự theo chức vụ/role
      const roleBreakdown = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COALESCE(ce.role, 'staff') as "role",
          COUNT(*)::int as "count"
        FROM public.company_employees ce
        ${empWhere}
        GROUP BY ce.role
      `);

      // Lịch sử điểm danh gần nhất từ member_checkins
      const recentCheckins = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          mc.id,
          mc.client_id as "clientId",
          mc.member_code as "memberCode",
          mc.event_title as "eventTitle",
          mc.status,
          mc.method,
          mc.checked_at as "checkedAt"
        FROM public.member_checkins mc
        ORDER BY mc.checked_at DESC
        LIMIT 10
      `);

      const totalEmployees = departmentBreakdown.reduce((sum, d) => sum + d.count, 0);

      return {
        ok: true,
        totalEmployees,
        departmentBreakdown,
        roleBreakdown,
        recentCheckins,
      };
    } catch (err) {
      this.logger.error('Error getting attendance stats:', err);
      return { ok: false, totalEmployees: 0, departmentBreakdown: [], roleBreakdown: [], recentCheckins: [] };
    }
  }

  /**
   * 4. THỐNG KÊ TÀI CHÍNH & THU CHI (FINANCIAL & CASHFLOW ANALYTICS)
   */
  async getFinanceStats() {
    try {
      // Tổng hợp thu chi
      const totals = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          type,
          COALESCE(SUM(amount), 0)::numeric as "totalAmount",
          COUNT(*)::int as "count"
        FROM public.transactions
        GROUP BY type
      `);

      let totalIncome = 0;
      let totalExpense = 0;
      for (const t of totals) {
        if (t.type === 'income') totalIncome = Number(t.totalAmount);
        if (t.type === 'expense') totalExpense = Number(t.totalAmount);
      }

      // Giao dịch gần đây
      const recentTransactions = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          t.id,
          t.description,
          t.amount::numeric,
          t.type,
          t.category,
          t.date,
          t.created_at as "createdAt"
        FROM public.transactions t
        ORDER BY t.date DESC, t.created_at DESC
        LIMIT 8
      `);

      return {
        ok: true,
        summary: {
          totalIncome,
          totalExpense,
          netCashflow: totalIncome - totalExpense,
          profitMargin: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
        },
        recentTransactions,
      };
    } catch (err) {
      this.logger.error('Error getting finance stats:', err);
      return { ok: false, summary: {}, recentTransactions: [] };
    }
  }

  /**
   * 5. THỐNG KÊ KHÁCH HÀNG & GIAO THƯƠNG CRM (CRM & LEADS ANALYTICS)
   */
  async getCrmStats() {
    try {
      // Khách hàng theo ngành nghề
      const industryStats = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COALESCE(m.industry, 'Khác') as "industry",
          COUNT(*)::int as "count"
        FROM public.members m
        GROUP BY m.industry
        ORDER BY "count" DESC
        LIMIT 6
      `);

      // Khách hàng theo cấp bậc hội viên
      const levelStats = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COALESCE(m.level, 'member') as "level",
          COUNT(*)::int as "count"
        FROM public.members m
        GROUP BY m.level
      `);

      const totalMembers = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM public.members
      `).then(r => r[0]?.count || 0);

      // Thống kê cơ hội kinh doanh
      const oppStats = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          COUNT(*)::int as "totalOpportunities",
          COALESCE(SUM(value), 0)::numeric as "totalPipelineValue"
        FROM public.opportunities
      `).then(r => r[0] || { totalOpportunities: 0, totalPipelineValue: 0 });

      return {
        ok: true,
        totalMembers,
        industryStats,
        levelStats,
        opportunities: {
          total: oppStats.totalOpportunities || 0,
          pipelineValue: Number(oppStats.totalPipelineValue) || 0,
        },
      };
    } catch (err) {
      this.logger.error('Error getting CRM stats:', err);
      return { ok: false, totalMembers: 0, industryStats: [], levelStats: [], opportunities: {} };
    }
  }

  /**
   * 6. THỐNG KÊ NỀN TẢNG & GÓI CƯỚC (SAAS PLATFORM ANALYTICS - SUPER ADMIN ONLY)
   */
  async getPlatformStats() {
    try {
      // Tổng số doanh nghiệp / tenant
      const totalCompanies = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM public.companies
      `).then(r => r[0]?.count || 0);

      // Phân bổ thuê bao theo gói cước
      const subscriptionsByPlan = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT 
          s.plan,
          COUNT(*)::int as "tenantCount",
          COALESCE(SUM(s.max_slots), 0)::int as "totalSlotsAllocated"
        FROM public.vione_community_subscriptions s
        WHERE s.status = 'active'
        GROUP BY s.plan
      `);

      // Tổng slots toàn hệ thống
      const totalSlotsAllocated = subscriptionsByPlan.reduce((sum, item) => sum + item.totalSlotsAllocated, 0);

      const totalEmployeesSystem = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as count FROM public.company_employees
      `).then(r => r[0]?.count || 0);

      // Danh mục các gói cước đang mở
      const packages = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT id, code, name, price, max_slots as "maxSlots", billing_cycle as "billingCycle"
        FROM public.vione_subscription_packages
        WHERE is_active = true
      `);

      return {
        ok: true,
        totalCompanies,
        totalSlotsAllocated,
        totalEmployeesSystem,
        systemUtilizationPercent: totalSlotsAllocated > 0 ? Math.round((totalEmployeesSystem / totalSlotsAllocated) * 100) : 0,
        subscriptionsByPlan,
        packages,
      };
    } catch (err) {
      this.logger.error('Error getting platform stats:', err);
      return { ok: false, totalCompanies: 0, subscriptionsByPlan: [], packages: [] };
    }
  }
}
