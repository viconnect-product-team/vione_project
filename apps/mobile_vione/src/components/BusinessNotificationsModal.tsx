import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  X,
  Bell,
  CheckCircle2,
  Calendar,
  Handshake,
  TrendingUp,
  FileCheck,
  CheckCheck,
  ChevronRight,
  Clock,
  Briefcase,
  Users,
  Check,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { meApi, communityApi } from "../api/services";

export interface BusinessNotificationItem {
  id: string;
  type: "connection" | "meeting" | "opportunity" | "event" | "approval" | "task" | "community";
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  actionText?: string;
  metadata?: any;
}

// Không hardcode dữ liệu giả - khởi tạo rỗng để luôn lấy dữ liệu thực tế từ server
const INITIAL_NOTIFICATIONS: BusinessNotificationItem[] = [];

interface BusinessNotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string, params?: any) => void;
  navigation?: any;
}

export const BusinessNotificationsModal: React.FC<BusinessNotificationsModalProps> = ({
  visible,
  onClose,
  onNavigateToTab,
  navigation,
}) => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<BusinessNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      const res = await meApi.getNotifications(30);
      const list = Array.isArray((res as any)?.data)
        ? (res as any).data
        : Array.isArray(res)
        ? res
        : [];

      if (list.length > 0) {
        const mappedList: BusinessNotificationItem[] = list.map((item: any) => {
          let itemType: BusinessNotificationItem["type"] = "event";
          if (
            item.sourceDomain === "company_task" ||
            item.notificationKind === "company_task_assigned"
          ) {
            itemType = "task";
          } else if (
            item.sourceDomain === "community" ||
            item.notificationKind?.includes("community") ||
            item.safeDisplayData?.inviteRef
          ) {
            itemType = "community";
          } else if (
            item.sourceDomain === "connection" ||
            item.notificationKind?.includes("connection")
          ) {
            itemType = "connection";
          } else if (
            item.sourceDomain === "meeting" ||
            item.notificationKind?.includes("meeting")
          ) {
            itemType = "meeting";
          } else if (
            item.sourceDomain === "opportunity" ||
            item.notificationKind?.includes("opportunity")
          ) {
            itemType = "opportunity";
          } else if (
            item.sourceDomain === "approval" ||
            item.notificationKind?.includes("approval")
          ) {
            itemType = "approval";
          }

          const title = item.safeDisplayData?.title || item.titleKey || "Thông báo hệ thống";
          const desc = item.safeDisplayData?.description || item.bodyKey || "";
          const isRead = item.status === "read" || !!item.readAt;

          return {
            id: item.id,
            type: itemType,
            title,
            description: desc,
            timeAgo: item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Gần đây",
            isRead,
            actionText:
              itemType === "task"
                ? "Xem việc của tôi"
                : itemType === "community"
                ? undefined
                : undefined,
            metadata: {
              ...(item.safeDisplayData || {}),
              ...(item.action?.targetParams || {}),
              inviteRef:
                item.safeDisplayData?.inviteRef ||
                item.action?.targetParams?.inviteRef ||
                (item.sourceDomain === "community" ? item.sourceRecordId : undefined),
            },
          };
        });
        setNotifications(mappedList);
      } else {
        setNotifications([]);
      }
    } catch {
      // Giữ danh sách ban đầu nếu offline
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await meApi.markNotificationsRead();
    } catch {}
  };

  const markItemAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await meApi.markNotificationsRead([id]);
    } catch {}
  };

  const handleAcceptInvite = async (item: BusinessNotificationItem) => {
    const inviteRef = item.metadata?.inviteRef;
    if (!inviteRef) {
      Alert.alert("Lỗi", "Không tìm thấy mã lời mời cộng đồng.");
      return;
    }
    try {
      setActionLoadingId(item.id);
      await communityApi.acceptCommunityInvite(inviteRef);
      markItemAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                isRead: true,
                metadata: { ...n.metadata, inviteStatus: "accepted" },
              }
            : n
        )
      );
      Alert.alert("Thành công", "Bạn đã đồng ý tham gia cộng đồng!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tham gia cộng đồng vào lúc này.";
      Alert.alert("Thông báo", msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeclineInvite = async (item: BusinessNotificationItem) => {
    const inviteRef = item.metadata?.inviteRef;
    if (!inviteRef) {
      Alert.alert("Lỗi", "Không tìm thấy mã lời mời cộng đồng.");
      return;
    }
    try {
      setActionLoadingId(item.id);
      await communityApi.declineCommunityInvite(inviteRef);
      markItemAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                isRead: true,
                metadata: { ...n.metadata, inviteStatus: "declined" },
              }
            : n
        )
      );
      Alert.alert("Đã từ chối", "Đã từ chối lời mời tham gia cộng đồng.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể thao tác vào lúc này.";
      Alert.alert("Thông báo", msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleItemPress = (item: BusinessNotificationItem) => {
    markItemAsRead(item.id);
    if (item.type === "task") {
      onClose();
      const communityId = item.metadata?.communityId || "c-vione-internal";
      if (navigation?.navigate) {
        navigation.navigate("Community", {
          communityId,
          tab: "tasks",
          filter: "my_tasks",
        });
      } else if (onNavigateToTab) {
        onNavigateToTab("Community", {
          communityId,
          tab: "tasks",
          filter: "my_tasks",
        });
      }
    } else if (item.type === "community" && item.metadata?.inviteStatus === "accepted") {
      onClose();
      const communityId = item.metadata?.communityId;
      if (communityId) {
        if (navigation?.navigate) {
          navigation.navigate("Community", { communityId });
        } else if (onNavigateToTab) {
          onNavigateToTab("Community", { communityId });
        }
      }
    }
  };

  const filteredList = notifications.filter((item) => {
    if (activeFilter === "unread") return !item.isRead;
    return true;
  });

  const getIcon = (type: BusinessNotificationItem["type"]) => {
    switch (type) {
      case "task":
        return <Briefcase size={18} color="#DFB76C" strokeWidth={2} />;
      case "community":
        return <Users size={18} color="#DFB76C" strokeWidth={2} />;
      case "opportunity":
        return <TrendingUp size={18} color="#D8B282" strokeWidth={2} />;
      case "meeting":
        return <Calendar size={18} color="#38BDF8" strokeWidth={2} />;
      case "connection":
        return <Handshake size={18} color="#10B981" strokeWidth={2} />;
      case "approval":
        return <FileCheck size={18} color="#F59E0B" strokeWidth={2} />;
      case "event":
      default:
        return <CheckCircle2 size={18} color="#A855F7" strokeWidth={2} />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? "#0E1522" : "#FFFFFF",
              borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "#E2E8F0",
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0" },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <Bell size={20} color={isDark ? "#D8B282" : "#A3703C"} strokeWidth={2} />
              <Text
                style={[
                  styles.titleText,
                  { color: isDark ? "#FFFFFF" : "#0F172A" },
                ]}
              >
                Thông báo kết nối
              </Text>
              {unreadCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9" },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            </TouchableOpacity>
          </View>

          {/* Filter Bar & Mark As Read */}
          <View style={styles.filterRow}>
            <View style={styles.filterTabs}>
              <TouchableOpacity
                onPress={() => setActiveFilter("all")}
                style={[
                  styles.filterPill,
                  activeFilter === "all" && [
                    styles.filterPillActive,
                    { backgroundColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#F6E1C3" },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === "all"
                      ? { color: isDark ? "#D8B282" : "#8C653B", fontWeight: "700" }
                      : { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  Tất cả ({notifications.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveFilter("unread")}
                style={[
                  styles.filterPill,
                  activeFilter === "unread" && [
                    styles.filterPillActive,
                    { backgroundColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#F6E1C3" },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === "unread"
                      ? { color: isDark ? "#D8B282" : "#8C653B", fontWeight: "700" }
                      : { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  Chưa đọc ({unreadCount})
                </Text>
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={styles.markAllBtn}
                activeOpacity={0.7}
              >
                <CheckCheck size={14} color={isDark ? "#D8B282" : "#A3703C"} />
                <Text
                  style={[
                    styles.markAllText,
                    { color: isDark ? "#D8B282" : "#A3703C" },
                  ]}
                >
                  Đọc hết
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredList.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={40} color={isDark ? "rgba(216, 178, 130, 0.3)" : "#CBD5E1"} />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? "#FFFFFF" : "#0F172A" },
                  ]}
                >
                  Không có thông báo nào
                </Text>
                <Text style={styles.emptyDesc}>
                  {activeFilter === "unread"
                    ? "Bạn đã đọc hết mọi thông báo và cập nhật mới."
                    : "Các hoạt động đối tác, lời mời cộng đồng và lịch gặp sẽ hiển thị tại đây."}
                </Text>
              </View>
            ) : (
              filteredList.map((item) => {
                const isCommunityInvite =
                  item.type === "community" && !!item.metadata?.inviteRef;
                const inviteStatus = item.metadata?.inviteStatus;
                const isBusy = actionLoadingId === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: isDark
                          ? item.isRead
                            ? "#12151F"
                            : "rgba(22, 32, 50, 0.75)"
                          : item.isRead
                          ? "#F8FAFC"
                          : "#FFFFFF",
                        borderColor: !item.isRead
                          ? isDark
                            ? "rgba(216, 178, 130, 0.4)"
                            : "rgba(216, 178, 130, 0.6)"
                          : isDark
                          ? "rgba(255, 255, 255, 0.06)"
                          : "#E2E8F0",
                      },
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.itemIconCol}>
                      <View
                        style={[
                          styles.iconCircle,
                          {
                            backgroundColor: isDark
                              ? "rgba(255, 255, 255, 0.05)"
                              : "#F1F5F9",
                          },
                        ]}
                      >
                        {getIcon(item.type)}
                      </View>
                      {!item.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <View style={styles.itemBody}>
                      <View style={styles.itemTitleRow}>
                        <Text
                          style={[
                            styles.itemTitle,
                            {
                              color: isDark ? "#FFFFFF" : "#0F172A",
                              fontWeight: item.isRead ? "600" : "800",
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <View style={styles.timeRow}>
                          <Clock size={11} color={isDark ? "#94A3B8" : "#94A3B8"} />
                          <Text style={styles.itemTime}>{item.timeAgo}</Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.itemDesc,
                          { color: isDark ? "#94A3B8" : "#475569" },
                        ]}
                        numberOfLines={3}
                      >
                        {item.description}
                      </Text>

                      {/* Community Invite Interactive Actions */}
                      {isCommunityInvite ? (
                        inviteStatus === "accepted" ? (
                          <View style={styles.statusBadgeAccepted}>
                            <Check size={12} color="#10B981" />
                            <Text style={styles.statusBadgeAcceptedText}>
                              Đã đồng ý gia nhập
                            </Text>
                          </View>
                        ) : inviteStatus === "declined" ? (
                          <View style={styles.statusBadgeDeclined}>
                            <Text style={styles.statusBadgeDeclinedText}>
                              Đã từ chối lời mời
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.inviteActionRow}>
                            <TouchableOpacity
                              disabled={isBusy}
                              onPress={() => handleAcceptInvite(item)}
                              style={styles.acceptInviteBtn}
                            >
                              <LinearGradient
                                colors={["#F6E1C3", "#DFB76C", "#C99C47"]}
                                style={styles.acceptInviteGrad}
                              >
                                {isBusy ? (
                                  <ActivityIndicator size="small" color="#050C15" />
                                ) : (
                                  <>
                                    <Check size={12} color="#050C15" style={{ marginRight: 4 }} />
                                    <Text style={styles.acceptInviteText}>Đồng ý tham gia</Text>
                                  </>
                                )}
                              </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                              disabled={isBusy}
                              onPress={() => handleDeclineInvite(item)}
                              style={[
                                styles.declineInviteBtn,
                                {
                                  borderColor: isDark
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : "#CBD5E1",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.declineInviteText,
                                  { color: isDark ? "#94A3B8" : "#64748B" },
                                ]}
                              >
                                Từ chối
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )
                      ) : null}

                      {item.actionText && (
                        <View style={styles.actionBtnRow}>
                          <Text
                            style={[
                              styles.actionLinkText,
                              { color: isDark ? "#D8B282" : "#A3703C" },
                            ]}
                          >
                            {item.actionText}
                          </Text>
                          <ChevronRight
                            size={13}
                            color={isDark ? "#D8B282" : "#A3703C"}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  container: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "800",
  },
  badgeCount: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCountText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTabs: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  filterPillActive: {},
  filterPillText: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "700",
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
  },
  itemCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  itemIconCol: {
    alignItems: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#D8B282",
    marginTop: 6,
  },
  itemBody: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  itemTime: {
    fontSize: 11,
    color: "#94A3B8",
  },
  itemDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  actionBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 8,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: "700",
  },
  inviteActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  acceptInviteBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  acceptInviteGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptInviteText: {
    color: "#050C15",
    fontSize: 11.5,
    fontWeight: "800",
  },
  declineInviteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  declineInviteText: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  statusBadgeAccepted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    marginTop: 8,
  },
  statusBadgeAcceptedText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadgeDeclined: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
    marginTop: 8,
  },
  statusBadgeDeclinedText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
});
