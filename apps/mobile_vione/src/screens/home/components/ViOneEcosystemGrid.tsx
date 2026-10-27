import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  UserCheck,
  Users,
  CalendarDays,
  Trophy,
  Flame,
  Radio,
  Landmark,
  Layers,
  Archive,
  Ticket,
  ChevronRight,
} from "lucide-react-native";
import { PlatformTab } from "../../platform/PlatformAppScreen";

interface ViOneEcosystemGridProps {
  isDark: boolean;
  navigation?: any;
  onOpenPlatformTab?: (tab: PlatformTab) => void;
  onOpenEventList?: () => void;
  onOpenCommunity?: () => void;
  onOpenMyCard?: () => void;
}

export const ViOneEcosystemGrid: React.FC<ViOneEcosystemGridProps> = ({
  isDark,
  navigation,
  onOpenPlatformTab,
  onOpenEventList,
  onOpenCommunity,
  onOpenMyCard,
}) => {
  const communityModules = [
    {
      id: "bc",
      title: "ViOne Business Connect",
      highlight: "Business Connect",
      sub: "Danh thiếp số & quản trị mối quan hệ",
      icon: UserCheck,
      onPress: () => {
        if (onOpenMyCard) onOpenMyCard();
        else navigation?.navigate("Me");
      },
    },
    {
      id: "assoc",
      title: "ViOne Association",
      highlight: "Association",
      sub: "Quản trị hiệp hội, câu lạc bộ",
      icon: Users,
      onPress: () => {
        if (onOpenCommunity) onOpenCommunity();
        else navigation?.navigate("Community");
      },
    },
    {
      id: "event",
      title: "ViOne Event",
      highlight: "Event",
      sub: "Sự kiện, hội nghị, triển lãm, check-in",
      icon: CalendarDays,
      onPress: () => {
        if (onOpenEventList) onOpenEventList();
        else if (onOpenPlatformTab) onOpenPlatformTab("overview");
      },
    },
    {
      id: "sport",
      title: "ViOne Sport",
      highlight: "Sport",
      sub: "Giải đấu, câu lạc bộ thể thao",
      icon: Trophy,
      onPress: () => onOpenPlatformTab?.("sport"),
    },
    {
      id: "run",
      title: "ViOne Run",
      highlight: "Run",
      sub: "Giải chạy, timing RFID, kết quả",
      icon: Flame,
      onPress: () => onOpenPlatformTab?.("run"),
    },
    {
      id: "review",
      title: "ViOne Review",
      highlight: "Review",
      sub: "Chạm NFC tăng đánh giá cho cửa hàng",
      icon: Radio,
      onPress: () => onOpenPlatformTab?.("review"),
    },
  ];

  const cultureModules = [
    {
      id: "heritage",
      title: "ViOne Heritage",
      highlight: "Heritage",
      sub: "Quản lý, số hóa di sản văn hóa",
      icon: Landmark,
      onPress: () => onOpenPlatformTab?.("heritage"),
    },
    {
      id: "museum",
      title: "ViOne Museum",
      highlight: "Museum",
      sub: "Bảo tàng số, trưng bày và thuyết minh",
      icon: Layers,
      onPress: () => onOpenPlatformTab?.("museum"),
    },
    {
      id: "archive",
      title: "ViOne Archive",
      highlight: "Archive",
      sub: "Lưu trữ số tư liệu, hiện vật",
      icon: Archive,
      onPress: () => onOpenPlatformTab?.("archive"),
    },
    {
      id: "ticket",
      title: "ViOne Ticket",
      highlight: "Ticket",
      sub: "Bán vé, soát vé điện tử",
      icon: Ticket,
      onPress: () => onOpenPlatformTab?.("tickets"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Banner */}
      <LinearGradient
        colors={["#1E40AF", "#2563EB", "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <View style={styles.logoBadge}>
            <Sparkles size={20} color="#F6E1C3" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={styles.bannerBrand}>ViOne</Text>
              <Text style={styles.bannerSubtitle}>Con người, cộng đồng & trải nghiệm</Text>
            </View>
            <Text style={styles.bannerDesc}>
              Hệ điều hành số hợp nhất: Doanh nghiệp, Thể thao và Văn hóa di sản
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* 2. Column 1: CỘNG ĐỒNG & DOANH NGHIỆP */}
      <View style={styles.pillarSection}>
        <View style={styles.pillarHeaderRow}>
          <View style={[styles.pillarDot, { backgroundColor: "#2563EB" }]} />
          <Text style={[styles.pillarTitle, { color: isDark ? "#60A5FA" : "#1D4ED8" }]}>
            CỘNG ĐỒNG & DOANH NGHIỆP
          </Text>
        </View>

        <View style={styles.cardsList}>
          {communityModules.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(37, 99, 235, 0.2)",
                  },
                ]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.iconWrap}>
                  <Icon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#F8FAFC" : "#0F172A" }]}>
                    ViOne <Text style={styles.highlightText}>{item.highlight}</Text>
                  </Text>
                  <Text
                    style={[styles.cardSub, { color: isDark ? "#94A3B8" : "#64748B" }]}
                    numberOfLines={1}
                  >
                    {item.sub}
                  </Text>
                </View>
                <ChevronRight size={16} color={isDark ? "#64748B" : "#94A3B8"} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Column 2: VĂN HÓA & DI SẢN */}
      <View style={[styles.pillarSection, { marginTop: 14 }]}>
        <View style={styles.pillarHeaderRow}>
          <View style={[styles.pillarDot, { backgroundColor: "#3B82F6" }]} />
          <Text style={[styles.pillarTitle, { color: isDark ? "#93C5FD" : "#1E40AF" }]}>
            VĂN HÓA & DI SẢN
          </Text>
        </View>

        <View style={styles.cardsList}>
          {cultureModules.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(37, 99, 235, 0.2)",
                  },
                ]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, { backgroundColor: "#1D4ED8" }]}>
                  <Icon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#F8FAFC" : "#0F172A" }]}>
                    ViOne <Text style={styles.highlightText}>{item.highlight}</Text>
                  </Text>
                  <Text
                    style={[styles.cardSub, { color: isDark ? "#94A3B8" : "#64748B" }]}
                    numberOfLines={1}
                  >
                    {item.sub}
                  </Text>
                </View>
                <ChevronRight size={16} color={isDark ? "#64748B" : "#94A3B8"} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  banner: {
    borderRadius: 20,
    padding: 14,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(147, 197, 253, 0.3)",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  bannerBrand: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DBEAFE",
  },
  bannerDesc: {
    fontSize: 10.5,
    color: "rgba(219, 234, 254, 0.9)",
    marginTop: 2,
  },
  pillarSection: {
    marginTop: 14,
  },
  pillarHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  pillarDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  cardsList: {
    gap: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTextWrap: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  highlightText: {
    color: "#2563EB",
    fontWeight: "800",
  },
  cardSub: {
    fontSize: 11,
    marginTop: 1.5,
  },
});
