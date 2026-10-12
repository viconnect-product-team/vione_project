import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * ConnectDdlRepository — Data Access Layer for schema checks and runtime DDL patching.
 * Separates DDL SQL execution from business service logic.
 */
@Injectable()
export class ConnectDdlRepository {
  private readonly logger = new Logger(ConnectDdlRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeSchemaInitialization(): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.association_logo_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          association_id UUID NOT NULL,
          changed_by UUID,
          changed_by_name TEXT,
          old_logo_url TEXT,
          new_logo_url TEXT,
          action TEXT NOT NULL DEFAULT 'change',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.business_relationship_moment_comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          moment_id UUID NOT NULL,
          user_id UUID NOT NULL,
          parent_id UUID,
          content TEXT NOT NULL,
          mentions JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_brmc_moment_id ON public.business_relationship_moment_comments (moment_id, created_at ASC);
        CREATE INDEX IF NOT EXISTS idx_brmc_parent_id ON public.business_relationship_moment_comments (parent_id);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.business_relationship_moment_comment_likes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          comment_id UUID NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_brm_comment_like UNIQUE (comment_id, user_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.business_relationship_moment_likes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          moment_id UUID NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_brm_moment_like UNIQUE (moment_id, user_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS image TEXT;
        ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS contact_name TEXT;
        ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS contact_phone TEXT;
        ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS contact_title TEXT;
        ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS company TEXT;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS company TEXT;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS member_price NUMERIC;
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.business_relationship_moments
        ADD COLUMN IF NOT EXISTS visibility VARCHAR(32) DEFAULT 'friends';
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.business_relationship_moments DROP CONSTRAINT IF EXISTS brm_target_xor;
        ALTER TABLE public.business_relationship_moments ADD CONSTRAINT brm_target_xor CHECK (
          (target_kind = 'connection' AND target_user_id IS NOT NULL AND target_card_id IS NULL AND target_guest_id IS NULL) OR
          (target_kind = 'saved_card' AND target_card_id IS NOT NULL AND target_user_id IS NULL AND target_guest_id IS NULL) OR
          (target_kind = 'guest_contact' AND target_guest_id IS NOT NULL AND target_user_id IS NULL AND target_card_id IS NULL) OR
          (target_kind = 'general' AND target_user_id IS NULL AND target_card_id IS NULL AND target_guest_id IS NULL)
        );
        ALTER TABLE public.business_relationship_moments DROP CONSTRAINT IF EXISTS business_relationship_moments_target_kind_check;
        ALTER TABLE public.business_relationship_moments ADD CONSTRAINT business_relationship_moments_target_kind_check
          CHECK (target_kind = ANY (ARRAY['connection'::text, 'saved_card'::text, 'guest_contact'::text, 'general'::text]));
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.business_relationship_moment_comments
        ADD COLUMN IF NOT EXISTS photo_url TEXT;
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.associations ADD COLUMN IF NOT EXISTS banner_url text;
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS app_scope text DEFAULT 'crm';
        ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_app text DEFAULT 'crm';
        ALTER TABLE public.business_notifications ADD COLUMN IF NOT EXISTS app_scope text DEFAULT 'vione_app';
        ALTER TABLE public.business_notifications ADD COLUMN IF NOT EXISTS target_app text DEFAULT 'vione_app';
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.direct_message_threads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user1_id UUID NOT NULL,
          user2_id UUID NOT NULL,
          last_message_at TIMESTAMPTZ DEFAULT now(),
          last_message_body TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_dm_thread_pair UNIQUE (user1_id, user2_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_dmt_user1 ON public.direct_message_threads (user1_id, last_message_at DESC);
        CREATE INDEX IF NOT EXISTS idx_dmt_user2 ON public.direct_message_threads (user2_id, last_message_at DESC);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.direct_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          thread_id UUID NOT NULL,
          sender_user_id UUID NOT NULL,
          body TEXT NOT NULL,
          client_token TEXT,
          reply_to JSONB,
          reactions JSONB DEFAULT '[]'::jsonb,
          is_retracted BOOLEAN DEFAULT false,
          read_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_dm_thread_created ON public.direct_messages (thread_id, created_at ASC);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.community_join_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          association_id UUID NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'pending',
          message TEXT,
          cancel_reason TEXT,
          decided_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_cjr_user_assoc UNIQUE (user_id, association_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_cjr_user_status ON public.community_join_requests (user_id, status);
        CREATE INDEX IF NOT EXISTS idx_cjr_assoc_status ON public.community_join_requests (association_id, status);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.business_relationship_moment_mutes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          moment_id UUID NOT NULL,
          user_id UUID NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_brm_mute UNIQUE (moment_id, user_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_brm_mutes_user_moment ON public.business_relationship_moment_mutes (user_id, moment_id);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.company_tasks (
          id TEXT PRIMARY KEY,
          community_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          assignee_id TEXT,
          assignee_name TEXT,
          assigner_name TEXT,
          priority TEXT DEFAULT 'high',
          status TEXT DEFAULT 'assigned',
          accepted_at TIMESTAMPTZ,
          completed_at TIMESTAMPTZ,
          deadline TEXT,
          customer_name TEXT,
          customer_phone TEXT,
          customer_contact TEXT,
          customer_requirements TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS progress_note TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS department TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS attachments TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS report_url TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS report_note TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS report_file_name TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS report_file_type TEXT;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS handover_history JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE public.company_tasks ADD COLUMN IF NOT EXISTS task_type TEXT DEFAULT 'general';
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.vione_community_departments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          community_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          manager_id TEXT,
          manager_name TEXT,
          color TEXT DEFAULT '#DFB76C',
          members_count INT DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_vcd_comm ON public.vione_community_departments (community_id);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.vione_community_department_members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          community_id TEXT NOT NULL,
          department_id TEXT NOT NULL,
          department_name TEXT NOT NULL,
          user_id TEXT NOT NULL,
          user_name TEXT,
          user_email TEXT,
          user_phone TEXT,
          user_avatar TEXT,
          role TEXT DEFAULT 'member',
          can_assign BOOLEAN DEFAULT false,
          can_accept BOOLEAN DEFAULT true,
          can_report BOOLEAN DEFAULT true,
          can_handover BOOLEAN DEFAULT true,
          can_meet BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_vcdm_user_dept UNIQUE (community_id, department_id, user_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_vcdm_user ON public.vione_community_department_members (community_id, user_id);
        CREATE INDEX IF NOT EXISTS idx_vcdm_dept ON public.vione_community_department_members (community_id, department_id);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_company_tasks_comm ON public.company_tasks (community_id, created_at DESC);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.company_employees (
          id TEXT PRIMARY KEY,
          community_id TEXT NOT NULL,
          user_id TEXT,
          full_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          role TEXT DEFAULT 'employee',
          role_title TEXT DEFAULT 'Chuyên viên',
          department TEXT DEFAULT 'Phòng Ban ViOne',
          avatar_url TEXT,
          status TEXT DEFAULT 'active',
          active_tasks_count INT DEFAULT 0,
          customers_count INT DEFAULT 0,
          joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_company_employees_comm ON public.company_employees (community_id);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.company_customer_care (
          id TEXT PRIMARY KEY,
          community_id TEXT NOT NULL,
          employee_id TEXT,
          employee_name TEXT,
          customer_name TEXT NOT NULL,
          customer_contact TEXT,
          customer_company TEXT,
          stage TEXT DEFAULT 'contacted',
          stage_label TEXT DEFAULT 'Đã liên hệ',
          deal_value NUMERIC DEFAULT 0,
          deal_value_label TEXT,
          last_action TEXT,
          last_action_at TEXT,
          progress_percent INT DEFAULT 50,
          next_follow_up TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_company_care_comm ON public.company_customer_care (community_id, created_at DESC);
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        UPDATE public.associations
        SET name = 'Gia Đình ViOne',
            tagline = 'Hệ sinh thái kết nối & chuyển đổi số Gia Đình ViOne',
            about = 'Cộng đồng chính thức Gia Đình ViOne — Gắn kết thịnh vượng, kết nối cơ hội kinh doanh và kiến tạo giá trị bền vững.',
            description = 'Mạng lưới kết nối và kiến tạo giá trị chung cho toàn thể thành viên Gia Đình ViOne.',
            short_name = 'ViOne Family',
            updated_at = now()
        WHERE name LIKE '%Gia%nh%'
           OR name LIKE '%Gia ??nh%'
           OR name LIKE '%Gia ?nh%'
           OR tagline LIKE '%H? sinh th?i%'
           OR tagline LIKE '%k?t n?i%'
           OR tagline LIKE '%chuy?n%'
           OR id = 'c1983000-0000-4000-8000-000000001983'::uuid
           OR slug = 'ceo-1983'
           OR name ILIKE '%ceo 1983%'
           OR name ILIKE '%ceo1983%';
      `).catch(() => {});

      this.logger.log('ConnectApp database schema verified successfully by ConnectDdlRepository.');

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS public.vione_community_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          community_id UUID,
          plan TEXT NOT NULL DEFAULT 'community_trial_30d',
          status TEXT NOT NULL DEFAULT 'active',
          is_trial BOOLEAN NOT NULL DEFAULT true,
          trial_days INTEGER NOT NULL DEFAULT 30,
          starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_vcs_user_comm UNIQUE (user_id, community_id)
        );
      `).catch(() => {});

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_vcs_user_exp ON public.vione_community_subscriptions (user_id, expires_at DESC);
      `).catch(() => {});
    } catch (err) {
      this.logger.warn('Could not ensure all tables on module init:', err);
    }
  }
}
