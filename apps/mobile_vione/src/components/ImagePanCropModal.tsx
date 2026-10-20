import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Animated,
} from "react-native";
import { X, Check, Move, ZoomIn, ZoomOut, RotateCw } from "lucide-react-native";
import { Colors } from "../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface ImagePanCropModalProps {
  visible: boolean;
  imageUri: string | null;
  aspectRatio?: "1:1" | "16:9";
  circular?: boolean;
  title?: string;
  onConfirm: (result: { uri: string; panX: number; panY: number; zoom: number }) => void;
  onCancel: () => void;
}

export const ImagePanCropModal: React.FC<ImagePanCropModalProps> = ({
  visible,
  imageUri,
  aspectRatio = "1:1",
  circular = true,
  title = "Căn chỉnh vùng hiển thị ảnh",
  onConfirm,
  onCancel,
}) => {
  const isOneToOne = aspectRatio === "1:1";
  const frameWidth = SCREEN_WIDTH * 0.75;
  const frameHeight = isOneToOne ? frameWidth : (frameWidth * 9) / 16;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const currentPan = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      currentPan.current = value;
    });
    return () => {
      pan.removeListener(listenerId);
    };
  }, [pan]);

  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
      currentPan.current = { x: 0, y: 0 };
      setZoom(1);
      setRotation(0);
    }
  }, [visible, imageUri]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPan.current.x,
          y: currentPan.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handleZoomIn = () => {
    setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)));
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleApply = () => {
    if (!imageUri) return;
    onConfirm({
      uri: imageUri,
      panX: currentPan.current.x,
      panY: currentPan.current.y,
      zoom,
    });
  };

  if (!visible || !imageUri) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Move size={16} color={Colors.gold} />
              </View>
              <View>
                <Text style={styles.headerTitle}>{title}</Text>
                <Text style={styles.headerSub}>Kéo ngón tay để căn chỉnh góc hiển thị</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Viewport Frame */}
          <View style={styles.viewportContainer}>
            <View
              style={[
                styles.cropFrame,
                {
                  width: frameWidth,
                  height: frameHeight,
                  borderRadius: isOneToOne && circular ? frameWidth / 2 : 16,
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View
                style={[
                  styles.imageWrapper,
                  {
                    transform: [
                      { translateX: pan.x },
                      { translateY: pan.y },
                      { scale: zoom },
                      { rotate: `${rotation}deg` },
                    ],
                  },
                ]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: frameWidth * 1.5,
                    height: frameHeight * 1.5,
                  }}
                  resizeMode="cover"
                />
              </Animated.View>

              {/* Grid Guides */}
              <View style={styles.gridOverlay} pointerEvents="none">
                <View style={styles.gridRow}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                </View>
              </View>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsBar}>
            <View style={styles.zoomRow}>
              <TouchableOpacity onPress={handleZoomOut} style={styles.toolBtn}>
                <ZoomOut size={16} color="#CBD5E1" />
              </TouchableOpacity>
              <View style={styles.zoomBadge}>
                <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
              </View>
              <TouchableOpacity onPress={handleZoomIn} style={styles.toolBtn}>
                <ZoomIn size={16} color="#CBD5E1" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRotate} style={styles.toolBtn}>
                <RotateCw size={16} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            {/* Bottom Actions */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApply} style={styles.confirmBtn} activeOpacity={0.8}>
                <Check size={16} color="#050C15" style={{ marginRight: 6 }} />
                <Text style={styles.confirmBtnText}>Áp dụng vùng chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0D1424",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(216, 178, 130, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  viewportContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#060912",
  },
  cropFrame: {
    borderWidth: 2,
    borderColor: "#D8B282",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
  },
  controlsBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "#0E1626",
    gap: 12,
  },
  zoomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  zoomBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(216, 178, 130, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.2)",
  },
  zoomText: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
    color: "#D8B282",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },
  confirmBtn: {
    flex: 1.5,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#050C15",
  },
});
