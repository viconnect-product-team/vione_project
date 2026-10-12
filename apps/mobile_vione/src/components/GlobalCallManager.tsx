import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
} from "react-native";
import { Phone, PhoneOff, Video, Sparkles } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";
import { Avatar } from "./common/Avatar";
import { InAppCallModal } from "./InAppCallModal";

export interface ActiveCallData {
  callId: string;
  callerUserId: string;
  callerName: string;
  callerAvatar?: string;
  callerTitle?: string;
  callerCompany?: string;
  callType: "audio" | "video";
}

export const GlobalCallManager: React.FC = () => {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState<ActiveCallData | null>(null);
  const [inCallData, setInCallData] = useState<ActiveCallData | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isVibratingRef = useRef(false);

  // Hiệu ứng sóng rung nhịp thở của chuông gọi đến
  useEffect(() => {
    if (incomingCall) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();

      // Rung thiết bị di động
      try {
        isVibratingRef.current = true;
        Vibration.vibrate([600, 400, 600, 400, 600, 400], true);
      } catch {}

      return () => {
        loop.stop();
        pulseAnim.setValue(1);
        if (isVibratingRef.current) {
          Vibration.cancel();
          isVibratingRef.current = false;
        }
      };
    }
  }, [incomingCall]);

  // Kiểm tra cuộc gọi đang active từ máy chủ
  const checkActiveCall = useCallback(async () => {
    if (!user?.id || inCallData) return;
    try {
      const res = await apiRequest<{ ok: boolean; activeCall?: any }>("/connect-app/calls/active", {
        timeoutMs: 4000,
      });
      const call = res.data?.activeCall;
      if (
        call &&
        call.status === "ringing" &&
        call.recipientUserId === user.id &&
        call.callerUserId !== user.id
      ) {
        if (!incomingCall || incomingCall.callId !== call.callId) {
          setIncomingCall({
            callId: call.callId,
            callerUserId: call.callerUserId,
            callerName: call.callerName || "Đối tác ViOne",
            callerAvatar: call.callerAvatar,
            callerTitle: call.callerTitle,
            callerCompany: call.callerCompany,
            callType: call.callType === "video" ? "video" : "audio",
          });
        }
      } else {
        // Cuộc gọi đã kết thúc hoặc bị hủy bởi người gọi
        if (incomingCall) {
          setIncomingCall(null);
          if (isVibratingRef.current) {
            Vibration.cancel();
            isVibratingRef.current = false;
          }
        }
      }
    } catch {
      // ignore network errors
    }
  }, [user?.id, inCallData, incomingCall]);

  useEffect(() => {
    if (!user?.id) {
      setIncomingCall(null);
      setInCallData(null);
      return;
    }

    // Kiểm tra ngay khi mount / login
    checkActiveCall();

    // Polling định kỳ mỗi 3.5s để cập nhật ngay cuộc gọi đang xảy ra
    const interval = setInterval(checkActiveCall, 3500);
    return () => clearInterval(interval);
  }, [user?.id, checkActiveCall]);

  const handleDecline = () => {
    if (isVibratingRef.current) {
      Vibration.cancel();
      isVibratingRef.current = false;
    }
    setIncomingCall(null);
  };

  const handleAccept = () => {
    if (isVibratingRef.current) {
      Vibration.cancel();
      isVibratingRef.current = false;
    }
    if (incomingCall) {
      setInCallData(incomingCall);
      setIncomingCall(null);
    }
  };

  const handleEndCall = () => {
    setInCallData(null);
  };

  return (
    <>
      {/* Modal Cuộc gọi đến toàn cục */}
      {incomingCall && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <View style={styles.overlay}>
            <View style={styles.card}>
              {/* Badge loại cuộc gọi */}
              <View style={styles.badgeContainer}>
                {incomingCall.callType === "video" ? (
                  <Video size={14} color="#D4AF37" />
                ) : (
                  <Phone size={14} color="#D4AF37" />
                )}
                <Text style={styles.badgeText}>
                  {incomingCall.callType === "video"
                    ? "Cuộc gọi Video đến"
                    : "Cuộc gọi thoại đến"}
                </Text>
              </View>

              {/* Avatar với hiệu ứng pulsing ripple */}
              <Animated.View
                style={[
                  styles.avatarWrapper,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Avatar
                  url={incomingCall.callerAvatar}
                  name={incomingCall.callerName}
                  size={100}
                />
              </Animated.View>

              {/* Thông tin đối tác */}
              <Text style={styles.callerName}>{incomingCall.callerName}</Text>
              {(incomingCall.callerTitle || incomingCall.callerCompany) && (
                <Text style={styles.callerSubtitle}>
                  {incomingCall.callerTitle
                    ? `${incomingCall.callerTitle} · `
                    : ""}
                  {incomingCall.callerCompany || ""}
                </Text>
              )}

              <View style={styles.ringingIndicator}>
                <Sparkles size={14} color="#D4AF37" />
                <Text style={styles.ringingText}>
                  Đang đổ chuông mời bạn kết nối...
                </Text>
              </View>

              {/* Nút hành động */}
              <View style={styles.actionsRow}>
                {/* Nút Từ chối */}
                <View style={styles.actionCol}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={handleDecline}
                    activeOpacity={0.8}
                  >
                    <PhoneOff size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.declineLabel}>Từ chối</Text>
                </View>

                {/* Nút Trả lời */}
                <View style={styles.actionCol}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={handleAccept}
                    activeOpacity={0.8}
                  >
                    <Phone size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.acceptLabel}>Trả lời</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Màn hình đàm thoại khi đã chấp nhận cuộc gọi */}
      {inCallData && (
        <InAppCallModal
          visible={true}
          isVideo={inCallData.callType === "video"}
          partnerName={inCallData.callerName}
          partnerAvatar={inCallData.callerAvatar}
          partnerCompany={inCallData.callerCompany}
          onEndCall={handleEndCall}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 7, 14, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0D111A",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.45)",
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.35)",
    marginBottom: 20,
  },
  badgeText: {
    color: "#D4AF37",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  avatarWrapper: {
    marginBottom: 16,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  callerName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  callerSubtitle: {
    color: "#9DA3AE",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  ringingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 28,
  },
  ringingText: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  actionCol: {
    alignItems: "center",
    gap: 8,
  },
  declineBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  declineLabel: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },
  acceptBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  acceptLabel: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "700",
  },
});
