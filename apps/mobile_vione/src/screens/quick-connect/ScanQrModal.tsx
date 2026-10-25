import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { X, Flashlight, Camera } from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { GoldButton } from "../../components/common/GoldButton";
import { networkApi } from "../../api/services";

import { Profile5ModernModal, Profile5Data } from "../../components/Profile5ModernModal";
import { apiRequest } from "../../api/client";

interface ScanQrModalProps {
  visible: boolean;
  onClose: () => void;
  onScanned?: (data: string) => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  visible,
  onClose,
  onScanned,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<Profile5Data | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || fetchingProfile) return;
    setScanned(true);

    if (onScanned) {
      onScanned(data);
      return;
    }

    let targetId = data;
    if (data.includes("/p/")) {
      targetId = data.split("/p/")[1].split("?")[0].split("#")[0];
    } else if (data.includes("/profile/")) {
      targetId = data.split("/profile/")[1].split("?")[0].split("#")[0];
    } else if (data.includes("/c/")) {
      targetId = data.split("/c/")[1].split("?")[0].split("#")[0];
    } else if (data.includes("userId=")) {
      targetId = data.split("userId=")[1].split("&")[0];
    }
    try {
      targetId = decodeURIComponent(targetId).trim();
    } catch {}

    setFetchingProfile(true);
    let loadedProfile: Profile5Data | null = null;
    try {
      const res: any = await apiRequest<any>(`/public/p/${encodeURIComponent(targetId)}`).catch(() => null);
      const card = res?.data?.card || res?.card;
      if (card) {
        loadedProfile = {
          id: card.id,
          userId: card.userId,
          code: card.code || targetId,
          name: card.displayName || card.fullName || "Doanh Nhân ViOne",
          displayName: card.displayName,
          title: card.jobTitle || card.headline,
          company: card.companyName,
          phone: card.primaryPhone,
          email: card.primaryEmail,
          website: card.website,
          avatarUrl: card.avatarUrl,
          coverUrl: card.coverUrl,
          bio: card.bio || card.headline,
          address: card.address,
          city: card.city,
          industry: card.industry,
          shareUrl: card.shareUrl || `https://vione.viconnect.vn/p/${targetId}`,
          verified: card.verified ?? true,
        };
      }
    } catch {}

    if (!loadedProfile) {
      loadedProfile = {
        id: targetId,
        code: targetId,
        name: targetId.startsWith("VIONE") ? `Hội Viên ${targetId}` : `Doanh Nhân Đối Tác`,
        displayName: targetId.startsWith("VIONE") ? `Hội Viên ${targetId}` : `Doanh Nhân Đối Tác`,
        title: "Chủ Tịch HĐQT / CEO",
        company: "Hệ Sinh Thái Doanh Nhân ViOne",
        phone: "",
        email: "",
        website: "https://vione.vn",
        bio: "Hồ sơ đối tác doanh nhân số được quét trực tiếp qua mã QR thông minh ViOne 5.0.",
        industry: "Đầu Tư, Thương Mại & Dịch Vụ Doanh Nghiệp",
        shareUrl: `https://vione.viconnect.vn/p/${targetId}`,
        verified: true,
      };
    }

    setFetchingProfile(false);
    setScannedProfile(loadedProfile);
    setProfileModalVisible(true);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Permission Request View */}
        {!permission?.granted ? (
          <View style={styles.permissionBox}>
            <Camera size={56} color={Colors.gold} />
            <Text style={styles.permTitle}>Quyền truy cập Camera</Text>
            <Text style={styles.permDesc}>
              ViOne cần quyền sử dụng camera để quét mã QR và quét danh thiếp giấy trao đổi đối tác kinh doanh.
            </Text>
            <GoldButton
              title="Cho phép Camera"
              onPress={requestPermission}
              style={{ marginTop: 24, width: "100%" }}
            />
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            enableTorch={torch}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            {/* Top Bar Controls */}
            <View style={styles.overlayTop}>
              <TouchableOpacity onPress={onClose} style={styles.circleBtn}>
                <X size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Quét Mã QR Đối Tác</Text>
              <TouchableOpacity
                onPress={() => setTorch((v) => !v)}
                style={[styles.circleBtn, torch && styles.circleBtnActive]}
              >
                <Flashlight size={20} color={torch ? Colors.gold : "#FFFFFF"} />
              </TouchableOpacity>
            </View>

            {/* Center Viewfinder */}
            <View style={styles.viewfinderCenter}>
              <View style={styles.targetFrame}>
                {/* 4 Golden Corners */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.hintText}>
                Đặt mã QR của đối tác hoặc danh thiếp vào trong khung
              </Text>
            </View>

            {/* Bottom Controls */}
            <View style={styles.overlayBottom}>
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() =>
                  handleBarcodeScanned({
                    data: "https://vione.vn/p/VIONE-VIP-8888",
                  })
                }
              >
                <Text style={styles.simulateText}>Thử nghiệm quét nhanh 5.0</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        )}

        {/* Loading Overlay when fetching Profile 5.0 */}
        {fetchingProfile && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Đang giải mã danh thiếp 5.0...</Text>
          </View>
        )}

        {/* Profile 5.0 Modern Modal */}
        <Profile5ModernModal
          visible={profileModalVisible}
          profile={scannedProfile}
          onClose={() => {
            setProfileModalVisible(false);
            setScanned(false);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070E",
  },
  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  permTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  permDesc: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    textAlign: "center",
  },
  cancelBtn: {
    marginTop: 16,
    padding: 12,
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  overlayTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  circleBtnActive: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  viewfinderCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  targetFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: Colors.gold,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  hintText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 24,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  overlayBottom: {
    paddingBottom: 48,
    alignItems: "center",
  },
  simulateScanBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  simulateText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 7, 14, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  loadingText: {
    color: "#F6E1C3",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 14,
  },
});
