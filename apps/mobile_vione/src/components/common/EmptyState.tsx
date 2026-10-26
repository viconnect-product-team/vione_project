import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import { GoldButton } from "./GoldButton";

interface EmptyStateProps {
  icon?: React.ReactNode | LucideIcon | React.ComponentType<any>;
  title: string;
  description?: string;
  subtitle?: string;
  actionTitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionTitle?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  isDark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  subtitle,
  actionTitle,
  actionLabel,
  onAction,
  secondaryActionTitle,
  onSecondaryAction,
  style,
  titleStyle,
  descriptionStyle,
  isDark = true,
}) => {
  const descText = description || subtitle;
  const primaryActionTitle = actionTitle || actionLabel;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function" || typeof icon === "object") {
      const IconComp = icon as any;
      return <IconComp size={28} color="#D8B282" strokeWidth={1.8} />;
    }
    return null;
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "rgba(14, 21, 34, 0.65)" : "rgba(248, 250, 252, 0.95)",
          borderColor: isDark ? "rgba(216, 178, 130, 0.2)" : "rgba(226, 232, 240, 0.8)",
        },
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={
              isDark
                ? ["rgba(216, 178, 130, 0.15)", "rgba(14, 21, 34, 0.8)"]
                : ["rgba(246, 225, 195, 0.4)", "rgba(255, 255, 255, 0.9)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            {renderIcon()}
          </LinearGradient>
        </View>
      )}

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFFFFF" : "#0F172A" },
          titleStyle,
        ]}
      >
        {title}
      </Text>

      {descText ? (
        <Text
          style={[
            styles.description,
            { color: isDark ? "#94A3B8" : "#64748B" },
            descriptionStyle,
          ]}
        >
          {descText}
        </Text>
      ) : null}

      {(primaryActionTitle || secondaryActionTitle) && (
        <View style={styles.actionsRow}>
          {secondaryActionTitle && onSecondaryAction && (
            <GoldButton
              title={secondaryActionTitle}
              onPress={onSecondaryAction}
              variant="secondary"
              style={styles.actionBtn}
            />
          )}
          {primaryActionTitle && onAction && (
            <GoldButton
              title={primaryActionTitle}
              onPress={onAction}
              variant="solid"
              style={styles.actionBtn}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  iconWrapper: {
    marginBottom: 14,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  actionBtn: {
    minWidth: 130,
  },
});
