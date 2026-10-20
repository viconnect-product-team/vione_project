import { B2BEvent } from "../../../types";
import { CommunityOpportunityItem } from "../../../components/OpportunityDetailModal";

// ==========================================
// Types
// ==========================================
export type CommunityType = "company_internal" | "b2b_networking";
export type CommunityTab = "all" | "company" | "networking" | "admin" | "joined" | "history";
export type DetailTab = "tasks" | "supervision" | "opportunities" | "news" | "events" | "members";

export interface CommunityDetailModel {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  communityType: CommunityType;
  memberCount: number;
  viewerRole: "admin" | "owner" | "member" | "none";
  isMember: boolean;
  upcomingEventsCount: number;
  openOpportunityCount: number;
  canEdit?: boolean;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description?: string;
  managerName?: string;
  color?: string;
  membersCount?: number;
}

export interface TaskItem {
  id: string;
  communityId: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assignerName?: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "assigned" | "in_progress" | "completed" | "cancelled";
  department?: string;
  progress?: number;
  progressNote?: string;
  reportUrl?: string;
  reportFileName?: string;
  reportFileType?: string;
  attachments?: string;
  handoverHistory?: any[];
  acceptedAt: string | null;
  completedAt: string | null;
  deadline: string;
  customerName?: string;
  customerPhone?: string;
  customerRequirements?: string;
  createdAt: string;
}

export interface NewsPostItem {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar?: string;
  timeAgo: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export interface MemberItem {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl?: string;
  role: "admin" | "member";
  phone: string;
  email: string;
}

export type TaskFilterType = "all" | "my_tasks" | "assigned" | "in_progress" | "completed";

export interface CommunityScreenProps {
  route?: {
    params?: {
      communityId?: string;
      tab?: DetailTab;
      filter?: TaskFilterType;
      opportunityId?: string;
    };
  };
  navigation?: any;
}

// ==========================================
// Helper functions (Matching PWA 100%)
// ==========================================
export function getVNTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Chào buổi sáng,";
  if (hour >= 12 && hour < 18) return "Chào buổi chiều,";
  return "Chào buổi tối,";
}

export function getCommunityVisuals(name: string, logoUrl?: string | null, bannerUrl?: string | null) {
  const lower = (name || "").toLowerCase();

  let defaultBanner = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80";
  let defaultAvatar = logoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80";
  let category = "Hiệp Hội Doanh Nghiệp B2B";
  let attendees: string[] = [];
  let descFallback = "Liên minh xúc tiến thương mại, kết nối cơ hội kinh doanh và đầu tư quy mô lớn.";

  if (lower.includes("vione") || lower.includes("gia đình") || lower.includes("ceo") || lower.includes("lãnh đạo")) {
    defaultBanner = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80";
    defaultAvatar = logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
    category = "Gia Đình ViOne • Doanh Nghiệp";
    attendees = [];
    descFallback = "Mạng lưới kết nối Chủ tịch, CEO & Lãnh đạo doanh nghiệp thuộc Gia Đình ViOne.";
  } else if (lower.includes("ai") || lower.includes("vietnam") || lower.includes("tech")) {
    defaultBanner = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80";
    defaultAvatar = logoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80";
    category = "AI & Chuyển Đổi Số";
    attendees = [];
    descFallback = "Cộng đồng chuyên gia, Founder & Kỹ sư AI tiên phong ứng dụng công nghệ thực chiến.";
  }

  return {
    bannerUrl: bannerUrl || defaultBanner,
    avatarUrl: defaultAvatar,
    category,
    attendees,
    descFallback,
  };
}

// Initial canonical communities list matching PWA (empty by default, loaded from API)
export const INITIAL_COMMUNITIES: CommunityDetailModel[] = [];

export const INITIAL_TASKS: TaskItem[] = [];
export const INITIAL_OPPORTUNITIES: CommunityOpportunityItem[] = [];
export const INITIAL_EVENTS: B2BEvent[] = [];
export const INITIAL_NEWS: NewsPostItem[] = [];
export const INITIAL_MEMBERS: MemberItem[] = [];
