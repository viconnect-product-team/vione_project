import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../theme/colors";

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "solid" | "primary" | "secondary" | "danger" | "success" | "outline";
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
  variant = "solid",
}) => {
  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.75}
        style={[styles.outlineBtn, disabled && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.gold} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconMargin}>{icon}</View>}
            <Text style={[styles.outlineText, textStyle]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.75}
        style={[styles.solidWrapper, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={["#1E293B", "#0F172A", "#080D1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles.secondaryGradientBorder]}
        >
          {loading ? (
            <ActivityIndicator color="#F6E1C3" size="small" />
          ) : (
            <View style={styles.contentRow}>
              {icon && <View style={styles.iconMargin}>{icon}</View>}
              <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "danger") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.75}
        style={[styles.solidWrapper, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={["#EF4444", "#DC2626", "#991B1B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.contentRow}>
              {icon && <View style={styles.iconMargin}>{icon}</View>}
              <Text style={[styles.whiteText, textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "success") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.75}
        style={[styles.solidWrapper, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={["#34D399", "#10B981", "#047857"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.contentRow}>
              {icon && <View style={styles.iconMargin}>{icon}</View>}
              <Text style={[styles.whiteText, textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.solidWrapper, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#05070E" size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconMargin}>{icon}</View>}
            <Text style={[styles.solidText, textStyle]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  solidWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconMargin: {
    marginRight: 8,
  },
  solidText: {
    color: "#05070E",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outlineText: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryGradientBorder: {
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.45)",
    borderRadius: 14,
  },
  secondaryText: {
    color: "#F6E1C3",
    fontSize: 15,
    fontWeight: "600",
  },
  whiteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
