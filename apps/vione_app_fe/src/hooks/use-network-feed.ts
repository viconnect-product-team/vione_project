// BC-Mobile-7E — Network feed hook (viewer-scoped cache key).

import { useInfiniteQuery } from "@tanstack/react-query";
import { bcMobileNetworkFeedFn } from "@/lib/business-connect/mobile/network-feed.functions";
import type { BcNetworkFeedItem } from "@/lib/business-connect/mobile/network-feed.types";
import { useViewerUserId } from "@/hooks/use-viewer-user-id";
import { fetchNestApi } from "@/lib/api-client";

export const networkFeedKeys = {
  root: ["bc-mobile", "network-feed"] as const,
  list: (viewerId: string) => [...networkFeedKeys.root, viewerId] as const,
};

export function useNetworkFeed() {
  const viewerId = useViewerUserId();
  const query = useInfiniteQuery({
    queryKey: networkFeedKeys.list(viewerId ?? "viewer-pending"),
    enabled: viewerId !== null,
    staleTime: 0,
    refetchOnMount: "always",
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      try {
        const res = await fetchNestApi<{ items: BcNetworkFeedItem[]; nextCursor: string | null }>(
          `/connect-app/network/feed${pageParam ? `?cursor=${pageParam}` : ""}`
        );
        if (res && Array.isArray(res.items)) {
          return res;
        }
      } catch (err) {
        console.warn("Direct fetchNestApi feed failed, falling back to serverFn:", err);
      }
      return bcMobileNetworkFeedFn({ data: { cursor: pageParam } });
    },
    getNextPageParam: (last) => last.nextCursor,
  });

  const serverItems: BcNetworkFeedItem[] = (query.data?.pages ?? []).flatMap((p) => p.items);

  // Kết hợp bài viết vừa lưu cục bộ (Local Optimistic Feed)
  const items: BcNetworkFeedItem[] = (() => {
    let localItems: BcNetworkFeedItem[] = [];
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("vba_local_moments");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localItems = parsed.map((m: any) => ({
              momentId: m.id || `local-${Date.now()}`,
              ownerUserId: viewerId,
              owner: {
                userId: viewerId || "me",
                displayName: m.authorName || "Tôi",
                avatarUrl: null,
                headline: "Thành viên ViOne",
                companyName: null,
              },
              target: null,
              personId: `u:${viewerId || "me"}`,
              occurredAt: m.occurredAt || new Date().toISOString(),
              createdAt: m.occurredAt || new Date().toISOString(),
              eventName: m.eventName || null,
              placeLabel: m.placeLabel || null,
              note: m.content || m.note || null,
              photoUrls: Array.isArray(m.photos) ? m.photos : (Array.isArray(m.photoUrls) ? m.photoUrls : []),
              photoCount: (m.photos || m.photoUrls || []).length,
              visibility: m.visibility || "friends",
            }));
          }
        }
      }
    } catch {}

    if (localItems.length === 0) return serverItems;

    // Lọc bỏ trùng lặp id giữa local và server
    const serverIds = new Set(serverItems.map((s) => s.momentId));
    const uniqueLocal = localItems.filter((l) => !serverIds.has(l.momentId));
    return [...uniqueLocal, ...serverItems];
  })();

  return {
    items,
    initialLoading: query.isPending && viewerId !== null,
    error: query.isError && !query.data,
    hasMore: Boolean(query.hasNextPage),
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
    retry: () => void query.refetch(),
  };
}
