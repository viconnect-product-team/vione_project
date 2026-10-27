import { CommunityOpportunityItem } from "../../../components/OpportunityDetailModal";

export interface AiPartnerItem {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  industryKey: string;
  location: string;
  distanceTier: "near" | "city" | "national";
  suggestion: string;
  matchScore: string;
  initial: string;
}

export interface VoiceMomentItem {
  id: string;
  title: string;
  author: string;
  date: string;
  duration: string;
  location: string;
  transcript: string;
  audioUrl?: string;
}

export interface TodayMeetingItem {
  id: string;
  title: string;
  counterpart: string;
  phone?: string;
  time: string;
  date: string;
  format: string;
  location: string;
  status: string;
}

export const INITIAL_TODAY_OPPORTUNITIES: CommunityOpportunityItem[] = [];

export const INITIAL_TODAY_MEETINGS: TodayMeetingItem[] = [];

export interface HomeStoryItem {
  id: string;
  name: string;
  avatarUrl: string;
  title?: string;
  company?: string;
  caption?: string;
}

export const HOME_STORIES: HomeStoryItem[] = [];

export interface HomeScreenProps {
  navigation?: any;
  onOpenV?: () => void;
  onOpenPlatformTab?: (tab: any) => void;
}
