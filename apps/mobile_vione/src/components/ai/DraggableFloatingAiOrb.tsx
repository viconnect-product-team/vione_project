import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, X } from "lucide-react-native";

interface DraggableFloatingAiOrbProps {
  onPress: () => void;
  visible?: boolean;
}

const STORAGE_POS_KEY = "@vione_ai_orb_pos";
const STORAGE_HIDDEN_KEY = "@vione_ai_orb_hidden";
const ORB_SIZE = 56;

export const DraggableFloatingAiOrb: React.FC<DraggableFloatingAiOrbProps> = ({
  onPress,
  visible = true,
}) => {
  const windowDims = Dimensions.get("window");
  const [isHidden, setIsHidden] = useState(false);

  // Position state with Animated.ValueXY
  const defaultX = Math.max(16, windowDims.width - ORB_SIZE - 20);
  const defaultY = Math.max(80, windowDims.height - ORB_SIZE - 120);

  const pan = useRef(new Animated.ValueXY({ x: defaultX, y: defaultY })).current;
  const currentPos = useRef({ x: defaultX, y: defaultY });
  const touchStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedPos, savedHidden, savedFloatingVisible] = await Promise.all([
        AsyncStorage.getItem(STORAGE_POS_KEY),
        AsyncStorage.getItem(STORAGE_HIDDEN_KEY),
        AsyncStorage.getItem("vione_ai_floating_visible"),
      ]);

      if (savedHidden === "true" || savedFloatingVisible === "false") {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          const clampedX = Math.min(Math.max(12, parsed.x), windowDims.width - ORB_SIZE - 12);
          const clampedY = Math.min(Math.max(60, parsed.y), windowDims.height - ORB_SIZE - 80);
          pan.setValue({ x: clampedX, y: clampedY });
          currentPos.current = { x: clampedX, y: clampedY };
        }
      }
    } catch {}
  };

  const savePosition = async (x: number, y: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  };

  const handleHideOrb = async () => {
    setIsHidden(true);
    try {
      await AsyncStorage.setItem(STORAGE_HIDDEN_KEY, "true");
      await AsyncStorage.setItem("vione_ai_floating_visible", "false");
      await AsyncStorage.setItem("vione_ai_floating_closed", "true");
    } catch {}
    Alert.alert(
      "Đã tắt Trợ lý AI ViOne",
      "Quả cầu AI đã được ẩn hoàn toàn khỏi màn hình. Để bật lại bất cứ lúc nào, vui lòng vào màn hình 'Tôi' để kích hoạt.",
      [{ text: "Đã hiểu", style: "default" }]
    );
  };

  const handleRestoreOrb = async () => {
    setIsHidden(false);
    try {
      await AsyncStorage.removeItem(STORAGE_HIDDEN_KEY);
    } catch {}
  };

  // PanResponder to handle dragging vs tapping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: (evt) => {
        touchStartTime.current = Date.now();
        touchStartPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
        pan.setOffset({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const touchDuration = Date.now() - touchStartTime.current;
        const dist = Math.hypot(gestureState.dx, gestureState.dy);

        // Detect tap vs drag
        if (dist < 8 && touchDuration < 350) {
          onPress();
          return;
        }

        // Clamp to screen bounds
        const targetX = currentPos.current.x + gestureState.dx;
        const targetY = currentPos.current.y + gestureState.dy;

        const clampedX = Math.min(Math.max(12, targetX), windowDims.width - ORB_SIZE - 12);
        const clampedY = Math.min(Math.max(60, targetY), windowDims.height - ORB_SIZE - 80);

        currentPos.current = { x: clampedX, y: clampedY };

        Animated.spring(pan, {
          toValue: { x: clampedX, y: clampedY },
          friction: 6,
          tension: 40,
          useNativeDriver: false,
        }).start();

        savePosition(clampedX, clampedY);
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  if (!visible) return null;

  // Completely hidden when user disables AI: no edge tab, re-enable via Me screen
  if (isHidden) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.orbContainer,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Main Floating Orb */}
        <LinearGradient
          colors={["#F6E1C3", "#DFB76C", "#C29B69", "#8C653B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.orbGradient}
        >
          <View style={styles.orbInner}>
            <Sparkles size={24} color="#0B0F17" />
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>AI</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Close Badge (X) at Top-Right Corner */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleHideOrb}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.closeBadge}
          accessibilityLabel="Tắt nhanh quả cầu AI"
        >
          <X size={10} color="#DFB76C" strokeWidth={3} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  orbContainer: {
    position: "absolute",
    width: ORB_SIZE,
    height: ORB_SIZE,
    zIndex: 9999,
  },
  orbGradient: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    padding: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: "#DFB76C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  orbInner: {
    flex: 1,
    borderRadius: (ORB_SIZE - 5) / 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  liveBadge: {
    position: "absolute",
    bottom: -3,
    backgroundColor: "#0B0F17",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DFB76C",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#22C55E",
  },
  liveBadgeText: {
    fontSize: 8.5,
    fontWeight: "900",
    color: "#DFB76C",
    letterSpacing: 0.5,
  },
  closeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0B0F17",
    borderWidth: 1.5,
    borderColor: "#DFB76C",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  edgeTabContainer: {
    position: "absolute",
    right: 0,
    bottom: 120,
    zIndex: 9999,
  },
  edgeTabButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  edgeTabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 9,
    gap: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "rgba(246, 225, 195, 0.8)",
  },
  edgeTabText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#0B0F17",
  },
});
