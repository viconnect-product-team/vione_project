import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Share,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  X,
  QrCode,
  Copy,
  Share2,
  Users,
  ShieldCheck,
  Check,
  Sparkles,
  Building2,
  Search,
  UserPlus,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../context/ThemeContext";
import { resolveMediaUrl } from "../utils/media";
import { networkApi, communityApi } from "../api/services";
import { ConnectionPerson } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface CommunityInviteData {
  id: string;
  name: string;
  shortDescription?: string;
  logoUrl?: string | null;
  communityType?: string;
  memberCount?: number;
}

interface CommunityInviteModalProps {
  visible: boolean;
  onClose: () => void;
  community?: CommunityInviteData | null;
  communityId?: string;
  communityName?: string;
  communityDescription?: string;
}

export const CommunityInviteModal: React.FC<CommunityInviteModalProps> = ({
  visible,
  onClose,
  community: communityProp,
  communityId,
  communityName,
  communityDescription,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"friends" | "qr">("friends");
  const [copied, setCopied] = useState(false);
  const [connections, setConnections] = useState<ConnectionPerson[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [search, setSearch] = useState("");
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  const community: CommunityInviteData = communityProp || {
    id: communityId || "comm-vione",
    name: communityName || "Cộng đồng Doanh nhân ViOne",
    shortDescription: communityDescription || "Kết nối giao thương B2B & xúc tiến thương mại",
    communityType: "b2b_networking",
    memberCount: 1,
  };

  const inviteUrl = `https://vione.vn/c/${community.id}`;

  useEffect(() => {
    if (visible) {
      loadConnections();
    }
  }, [visible]);

  const loadConnections = async () => {
    try {
      setLoadingFriends(true);
      const res = await networkApi.getConnections();
      const list = Array.isArray(res) ? res : (res as any)?.connections || [];
      setConnections(list);
    } catch (e) {
      console.warn("Failed to load connections:", e);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleInviteFriend = async (friend: ConnectionPerson) => {
    const f = friend as any;
    const targetUserId =
      f.peerId ||
      f.counterpartUserId ||
      f.userId ||
      f.id;
    if (!targetUserId) return;

    try {
      setInvitingId(targetUserId);
      await communityApi.createCommunityInvite(community.id, {
        targetUserId,
      });
      setInvitedMap((prev) => ({ ...prev, [targetUserId]: true }));
      Alert.alert(
        "Thành công",
        `Đã gửi lời mời tham gia "${community.name}" tới ${(friend as any).fullName || friend.name || "bạn bè"}!`
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi lời mời. Vui lòng thử lại sau.";
      Alert.alert("Thông báo", msg);
    } finally {
      setInvitingId(null);
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      Alert.alert("Đã sao chép", "Đã sao chép liên kết mời gia nhập cộng đồng vào bộ nhớ tạm.");
    } catch {
      Alert.alert("Sao chép", `Liên kết: ${inviteUrl}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Gia nhập cộng đồng ${community.name}`,
        message: `Kính mời bạn tham gia cộng đồng "${community.name}" trên hệ sinh thái ViOne Connect:\n\n${inviteUrl}\n\nKết nối doanh nhân & mở ra cơ hội hợp tác kinh doanh!`,
      });
    } catch {
      Alert.alert("Chia sẻ", "Không thể kích hoạt chia sẻ.");
    }
  };

  const isCompany =
    community.communityType === "company_internal" ||
    community.name?.toLowerCase().includes("công ty") ||
    community.name?.toLowerCase().includes("tập đoàn");

  const filteredFriends = connections.filter((c: any) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (c.fullName || c.name || "").toLowerCase();
    const title = (c.professionalTitle || c.title || c.companyName || c.company || "").toLowerCase();
    return name.includes(q) || title.includes(q);
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? "#0E1522" : "#FFFFFF",
              borderColor: isDark ? "rgba(216, 178, 130, 0.3)" : "#E2E8F0",
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.headerBadge}>
                <Sparkles size={11} color="#DFB76C" />
                <Text style={styles.headerBadgeText}>KẾT NỐI HỘI VIÊN</Text>
              </View>
              <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>
                Mời Gia Nhập Cộng Đồng
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={isDark ? "#94A3B8" : "#64748B"} />
            </TouchableOpacity>
          </View>

          {/* Community Info Box */}
          <View
            style={[
              styles.communityBox,
              {
                backgroundColor: isDark ? "#141C2B" : "#F8FAFC",
                borderColor: isDark ? "rgba(216, 178, 130, 0.25)" : "#E2E8F0",
              },
            ]}
          >
            {community.logoUrl ? (
              <Image
                source={{ uri: resolveMediaUrl(community.logoUrl) || community.logoUrl }}
                style={styles.communityLogo}
              />
            ) : (
              <View style={styles.logoFallback}>
                <Building2 size={24} color="#DFB76C" />
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[styles.communityName, { color: isDark ? "#FFFFFF" : "#0F172A" }]}
                numberOfLines={1}
              >
                {community.name}
              </Text>
              <Text style={styles.communitySub} numberOfLines={1}>
                {community.shortDescription || "Mạng lưới kết nối doanh nghiệp."}
              </Text>
              <View style={styles.metaRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    {isCompany ? "NỘI BỘ DOANH NGHIỆP" : "LIÊN MINH B2B"}
                  </Text>
                </View>
                <Text style={styles.memberCountText}>
                  {community.memberCount || 1} thành viên
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "friends" && styles.tabButtonActive,
                {
                  backgroundColor:
                    activeTab === "friends"
                      ? isDark
                        ? "rgba(216, 178, 130, 0.2)"
                        : "rgba(216, 178, 130, 0.25)"
                      : "transparent",
                },
              ]}
              onPress={() => setActiveTab("friends")}
            >
              <Users
                size={14}
                color={activeTab === "friends" ? "#DFB76C" : isDark ? "#94A3B8" : "#64748B"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "friends"
                        ? "#DFB76C"
                        : isDark
                        ? "#94A3B8"
                        : "#64748B",
                  },
                ]}
              >
                Bạn bè kết nối
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "qr" && styles.tabButtonActive,
                {
                  backgroundColor:
                    activeTab === "qr"
                      ? isDark
                        ? "rgba(216, 178, 130, 0.2)"
                        : "rgba(216, 178, 130, 0.25)"
                      : "transparent",
                },
              ]}
              onPress={() => setActiveTab("qr")}
            >
              <QrCode
                size={14}
                color={activeTab === "qr" ? "#DFB76C" : isDark ? "#94A3B8" : "#64748B"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "qr"
                        ? "#DFB76C"
                        : isDark
                        ? "#94A3B8"
                        : "#64748B",
                  },
                ]}
              >
                Mã QR & Link
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "friends" ? (
            <View style={{ flex: 1, minHeight: 300 }}>
              {/* Search Box */}
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDark ? "#141C2B" : "#F1F5F9",
                    borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "#E2E8F0",
                  },
                ]}
              >
                <Search size={16} color={isDark ? "#94A3B8" : "#64748B"} style={{ marginRight: 8 }} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Tìm bạn bè đã kết nối..."
                  placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                  style={[styles.searchInput, { color: isDark ? "#FFFFFF" : "#0F172A" }]}
                />
              </View>

              {loadingFriends ? (
                <View style={styles.centerLoading}>
                  <ActivityIndicator size="small" color="#DFB76C" />
                </View>
              ) : filteredFriends.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
                    {search.trim()
                      ? "Không tìm thấy bạn bè phù hợp."
                      : "Chưa có bạn bè nào trong danh sách kết nối. Hãy kết nối thêm ở mục Mạng Lưới để mời vào cộng đồng."}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.friendListScroll} showsVerticalScrollIndicator={false}>
                  {filteredFriends.map((friend: any) => {
                    const fid =
                      friend.peerId ||
                      friend.counterpartUserId ||
                      friend.userId ||
                      friend.id;
                    const isInvited = invitedMap[fid];
                    const isBusy = invitingId === fid;
                    const avatar = resolveMediaUrl(friend.avatarUrl || friend.avatar);

                    return (
                      <View
                        key={fid}
                        style={[
                          styles.friendItem,
                          {
                            backgroundColor: isDark ? "#141C2B" : "#F8FAFC",
                            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                          },
                        ]}
                      >
                        <View style={styles.friendLeft}>
                          {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.friendAvatar} />
                          ) : (
                            <View style={styles.friendAvatarFallback}>
                              <Text style={styles.avatarInitial}>
                                {((friend.fullName || friend.name || "U") as string).slice(0, 2).toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text
                              style={[styles.friendName, { color: isDark ? "#FFFFFF" : "#0F172A" }]}
                              numberOfLines={1}
                            >
                              {friend.fullName || friend.name || "Thành viên"}
                            </Text>
                            <Text style={styles.friendTitle} numberOfLines={1}>
                              {friend.professionalTitle || friend.title || friend.companyName || "Chưa cập nhật"}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          disabled={isInvited || isBusy}
                          onPress={() => handleInviteFriend(friend)}
                          style={[
                            styles.inviteBtn,
                            isInvited && styles.invitedBtn,
                          ]}
                        >
                          {isBusy ? (
                            <ActivityIndicator size="small" color="#050C15" />
                          ) : isInvited ? (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                              <Check size={12} color="#10B981" />
                              <Text style={styles.invitedBtnText}>Đã mời</Text>
                            </View>
                          ) : (
                            <LinearGradient
                              colors={["#F6E1C3", "#DFB76C", "#C99C47"]}
                              style={styles.inviteGrad}
                            >
                              <UserPlus size={12} color="#050C15" style={{ marginRight: 4 }} />
                              <Text style={styles.inviteBtnText}>Mời</Text>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  <View style={{ height: 20 }} />
                </ScrollView>
              )}
            </View>
          ) : (
            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* QR Code Container */}
              <View style={styles.qrContainer}>
                <View
                  style={[
                    styles.qrWhiteBox,
                    { borderColor: isDark ? "#DFB76C" : "rgba(216, 178, 130, 0.6)" },
                  ]}
                >
                  <View style={styles.qrInner}>
                    <QrCode size={150} color="#050C15" strokeWidth={1.5} />
                    <View style={styles.qrCenterBadge}>
                      <Text style={styles.qrCenterV}>V</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.qrInstruction}>
                  Quét mã QR bằng Camera điện thoại hoặc Zalo để tham gia
                </Text>
              </View>

              {/* Invite Link Box */}
              <Text style={[styles.fieldLabel, { color: isDark ? "#DFB76C" : "#8C653B" }]}>
                LIÊN KẾT MỜI GIA NHẬP
              </Text>
              <View
                style={[
                  styles.linkBox,
                  {
                    backgroundColor: isDark ? "#141C2B" : "#F1F5F9",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
                  },
                ]}
              >
                <Text
                  style={[styles.linkText, { color: isDark ? "#E2E8F0" : "#334155" }]}
                  numberOfLines={1}
                >
                  {inviteUrl}
                </Text>
                <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                  {copied ? (
                    <Check size={16} color="#10B981" />
                  ) : (
                    <Copy size={16} color="#DFB76C" />
                  )}
                  <Text style={[styles.copyBtnText, copied && { color: "#10B981" }]}>
                    {copied ? "Đã chép" : "Sao chép"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Information Policy */}
              <View
                style={[
                  styles.policyBox,
                  {
                    backgroundColor: isDark ? "rgba(216, 178, 130, 0.08)" : "#FDF6EC",
                    borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "rgba(216, 178, 130, 0.4)",
                  },
                ]}
              >
                <ShieldCheck size={16} color="#DFB76C" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.policyText}>
                  {isCompany
                    ? "Cộng đồng nội bộ: Người được mời sẽ gửi yêu cầu gia nhập và cần được Giám đốc / Quản trị viên duyệt để kích hoạt phân quyền giao việc."
                    : "Mạng lưới B2B: Mọi doanh nhân quét mã hoặc mở liên kết sẽ tham gia ngay để kết nối cơ hội kinh doanh và lịch họp 1-1."}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                  <LinearGradient
                    colors={["#F6E1C3", "#DFB76C", "#C99C47"]}
                    style={styles.shareGrad}
                  >
                    <Share2 size={16} color="#050C15" style={{ marginRight: 6 }} />
                    <Text style={styles.shareBtnText}>Chia sẻ qua Zalo / Tin nhắn</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ height: 20 }} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 178, 130, 0.15)",
    paddingBottom: 12,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  headerBadgeText: {
    color: "#DFB76C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  communityBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  communityLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#DFB76C",
  },
  logoFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    borderWidth: 1.5,
    borderColor: "#DFB76C",
    alignItems: "center",
    justifyContent: "center",
  },
  communityName: {
    fontSize: 14,
    fontWeight: "700",
  },
  communitySub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(216, 178, 130, 0.2)",
  },
  typeBadgeText: {
    color: "#DFB76C",
    fontSize: 8.5,
    fontWeight: "800",
  },
  memberCountText: {
    fontSize: 10.5,
    color: "#94A3B8",
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.25)",
  },
  tabButtonActive: {
    borderColor: "#DFB76C",
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  centerLoading: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 18,
  },
  friendListScroll: {
    flex: 1,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  friendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  friendAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  friendAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#DFB76C",
    fontSize: 13,
    fontWeight: "700",
  },
  friendName: {
    fontSize: 13,
    fontWeight: "700",
  },
  friendTitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  inviteBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  invitedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  invitedBtnText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  inviteGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inviteBtnText: {
    color: "#050C15",
    fontSize: 11.5,
    fontWeight: "800",
  },
  scrollBody: {
    flex: 1,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  qrWhiteBox: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  qrInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrCenterBadge: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DFB76C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  qrCenterV: {
    color: "#050C15",
    fontWeight: "900",
    fontSize: 14,
  },
  qrInstruction: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
  },
  copyBtnText: {
    color: "#DFB76C",
    fontSize: 11.5,
    fontWeight: "700",
  },
  policyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  policyText: {
    flex: 1,
    fontSize: 11.5,
    color: "#A3703C",
    lineHeight: 16,
  },
  bottomBar: {
    marginTop: 14,
  },
  shareBtn: {
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
  },
  shareGrad: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#050C15",
  },
});
