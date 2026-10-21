import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
  Linking,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  X,
  Camera,
  ScanLine,
  CheckCircle,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  IdCard,
  Flame,
  Crown,
  Star,
  Clock,
  Briefcase,
  DollarSign,
  UserCheck,
  FileText,
  ExternalLink,
  Zap,
  RefreshCw,
  Download,
  MessageCircle,
} from "lucide-react-native";
import { ConnectionPerson } from "../types";
import { cardScanApi, customerApi, B2BCustomerData } from "../api/services";
import { useTheme } from "../context/ThemeContext";

export type CustomerLeadTier = "hot" | "vip" | "featured" | "care24h";

export interface ExtendedLeadInfo {
  tier: CustomerLeadTier;
  stage: "prospect" | "qualified" | "proposal" | "negotiation";
  dealValue: string;
  assignedStaff: string;
  needsNote: string;
  nextAction: string;
}

interface CardScanReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveContact: (contact: ConnectionPerson) => void;
  onSaveCustomerLead?: (lead: B2BCustomerData & { tier: CustomerLeadTier; assignedStaff: string }) => void;
}

export const CardScanReviewModal: React.FC<CardScanReviewModalProps> = ({
  visible,
  onClose,
  onSaveContact,
  onSaveCustomerLead,
}) => {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState<"capture" | "scanning" | "review">("capture");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef<any>(null);
  
  // OCR Extracted Fields (Khởi tạo rỗng, tự động điền từ ảnh quét OCR hoặc QR vCard)
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  // CRM Lead Pipeline Fields
  const [isLeadCare, setIsLeadCare] = useState(true);
  const [leadTier, setLeadTier] = useState<CustomerLeadTier>("hot");
  const [stage, setStage] = useState<"prospect" | "qualified" | "proposal" | "negotiation">("prospect");
  const [dealValue, setDealValue] = useState("500,000,000 VNĐ");
  const [assignedStaff, setAssignedStaff] = useState("Trần Minh Hoàng (Trưởng phòng Kinh Doanh)");
  const [needsNote, setNeedsNote] = useState("Quan tâm giải pháp số hóa doanh nghiệp & kết nối đối tác ViOne");
  const [nextAction, setNextAction] = useState("Gửi hồ sơ năng lực và liên hệ Zalo 1-1 trong 24h");
  const [isSaving, setIsSaving] = useState(false);
  const [qrDetected, setQrDetected] = useState(false);

  // Phân tích mã QR vCard trên danh thiếp (nếu có)
  const parseVCard = (data: string) => {
    let parsedName = "";
    let parsedPhone = "";
    let parsedEmail = "";
    let parsedOrg = "";
    let parsedTitle = "";
    let parsedUrl = "";
    let parsedAdr = "";

    const lines = data.split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("FN:")) parsedName = line.slice(3).trim();
      else if (line.startsWith("N:") && !parsedName) {
        const parts = line.slice(2).split(";").filter(Boolean);
        parsedName = parts.reverse().join(" ").trim();
      } else if (line.startsWith("ORG:")) parsedOrg = line.slice(4).trim();
      else if (line.startsWith("TITLE:")) parsedTitle = line.slice(6).trim();
      else if (line.startsWith("TEL") && !parsedPhone) {
        parsedPhone = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("EMAIL") && !parsedEmail) {
        parsedEmail = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("URL:") && !parsedUrl) {
        parsedUrl = line.slice(4).trim();
      } else if (line.startsWith("ADR") && !parsedAdr) {
        parsedAdr = (line.split(":")[1] || "").replace(/;/g, " ").trim();
      }
    }

    if (parsedName) setName(parsedName);
    if (parsedPhone) setPhone(parsedPhone);
    if (parsedEmail) setEmail(parsedEmail);
    if (parsedOrg) setCompany(parsedOrg);
    if (parsedTitle) setTitle(parsedTitle);
    if (parsedUrl) setWebsite(parsedUrl);
    if (parsedAdr) setAddress(parsedAdr);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (qrDetected || step !== "capture") return;
    if (data.includes("BEGIN:VCARD") || data.includes("FN:") || data.includes("TEL:")) {
      setQrDetected(true);
      parseVCard(data);
      Alert.alert(
        "Đã nhận diện QR Danh thiếp (vCard)",
        "Hệ thống đã tự động trích xuất thông tin đối tác từ mã QR trên danh thiếp!",
        [{ text: "Xem & Lưu ngay", onPress: () => setStep("review") }]
      );
    }
  };

  const handleSaveToDeviceContacts = async () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      name.trim() ? `FN:${name.trim()}` : "",
      title.trim() ? `TITLE:${title.trim()}` : "",
      company.trim() ? `ORG:${company.trim()}` : "",
      phone.trim() ? `TEL;TYPE=CELL:${phone.trim()}` : "",
      email.trim() ? `EMAIL:${email.trim()}` : "",
      address.trim() ? `ADR;TYPE=WORK:;;${address.trim()};;;;` : "",
      website.trim() ? `URL:${website.trim()}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n");

    try {
      await Share.share({
        title: `Danh bạ - ${name.trim() || "Đối tác"}`,
        message: vcard,
      });
    } catch {
      Alert.alert("Danh bạ", "Không thể xuất danh bạ điện thoại.");
    }
  };

  const handleCaptureAndScan = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Quyền Camera", "Vui lòng cấp quyền truy cập máy ảnh để chụp và quét danh thiếp.");
        return;
      }
    }

    setStep("scanning");
    try {
      let photoUri = "";
      let base64Data = "";
      if (cameraRef.current) {
        // Giảm quality xuống 0.4 để payload base64 chỉ ~300KB-400KB, tối ưu tốc độ và không bị vượt ngưỡng 1MB của OCR engine
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.4, base64: true });
        photoUri = photo?.uri || "";
        base64Data = photo?.base64 || "";
      }
      setCapturedPhotoUri(photoUri);

      // Gọi OCR API của backend để trích xuất trường danh thiếp từ hình ảnh
      if (base64Data) {
        try {
          const ocrRes = await cardScanApi.scanOcr(`data:image/jpeg;base64,${base64Data}`, `ocr-tok-${Date.now()}`);
          const respData = ocrRes?.data as any;
          const candidate = respData?.candidate || respData;
          const fields = candidate?.fields || respData?.fields;

          if (fields) {
            const extractText = (val: any): string => {
              if (!val) return "";
              if (typeof val === "string") return val.trim();
              if (typeof val === "object" && typeof val.text === "string") return val.text.trim();
              if (typeof val === "object" && typeof val.value === "string") return val.value.trim();
              return String(val || "").trim();
            };

            const isDummy = (str: string): boolean => {
              if (!str) return true;
              const lower = str.trim().toLowerCase();
              const digits = lower.replace(/\D/g, "");
              return (
                lower === "đối tác mới" ||
                lower === "doi tac moi" ||
                lower === "thông tin danh thiếp" ||
                lower === "thong tin danh thiep" ||
                lower === "đối tác liên hệ" ||
                lower === "doi tac lien he" ||
                digits === "0900000000" ||
                /^090{7,}$/.test(digits)
              );
            };

            const extractedName = extractText(fields.displayName) || extractText(fields.name);
            if (extractedName && !isDummy(extractedName)) setName(extractedName);

            const extractedTitle = extractText(fields.title) || extractText(fields.role);
            if (extractedTitle && !isDummy(extractedTitle)) setTitle(extractedTitle);

            const extractedCompany = extractText(fields.companyName) || extractText(fields.company);
            if (extractedCompany && !isDummy(extractedCompany)) setCompany(extractedCompany);

            let extractedPhone = "";
            if (Array.isArray(fields.phones) && fields.phones.length > 0) {
              extractedPhone = extractText(fields.phones[0]);
            } else {
              extractedPhone = extractText(fields.phone) || extractText(fields.mobile);
            }
            if (extractedPhone && !isDummy(extractedPhone)) setPhone(extractedPhone);

            let extractedEmail = "";
            if (Array.isArray(fields.emails) && fields.emails.length > 0) {
              extractedEmail = extractText(fields.emails[0]);
            } else {
              extractedEmail = extractText(fields.email);
            }
            if (extractedEmail && !isDummy(extractedEmail)) setEmail(extractedEmail);

            const extractedAddress = extractText(fields.address);
            if (extractedAddress && !isDummy(extractedAddress)) setAddress(extractedAddress);

            const extractedWebsite = extractText(fields.website);
            if (extractedWebsite && !isDummy(extractedWebsite)) setWebsite(extractedWebsite);
          }
        } catch (ocrErr) {
          console.warn("OCR API error, keeping recognized values:", ocrErr);
        }
      }
    } catch (err) {
      console.warn("Lỗi chụp danh thiếp:", err);
    }

    setStep("review");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập họ và tên trên danh thiếp.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập số điện thoại để lưu danh bạ và kết nối Zalo.");
      return;
    }

    setIsSaving(true);

    const cleanPhone = phone.replace(/\D/g, "");
    const isDummyPhone = cleanPhone === "0900000000" || /^090{7,}$/.test(cleanPhone);
    const zaloUrl = cleanPhone && !isDummyPhone ? `https://zalo.me/${cleanPhone}` : undefined;
    const contactId = "ocr-" + Date.now();

    const newContact: ConnectionPerson = {
      id: contactId,
      name: name.trim(),
      title: title.trim(),
      company: company.trim() || "Doanh nghiệp đối tác",
      phone: phone.trim(),
      email: email.trim(),
      industry: "Đầu Tư & Xây Dựng",
      status: "connected",
      zaloUrl,
    };

    let targetPersonId = `g:${contactId}`;

    try {
      // 1. Lưu danh thiếp vào danh bạ qua RESTful API
      const saveCardRes = await cardScanApi.saveCard({
        displayName: name.trim(),
        title: title.trim(),
        companyName: company.trim() || "Doanh nghiệp đối tác",
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        website: website.trim(),
        zaloUrl,
        clientToken: `ocr-token-${Date.now()}`,
      });

      if (saveCardRes && (saveCardRes as any).personId) {
        targetPersonId = (saveCardRes as any).personId;
      }
    } catch (err) {
      console.warn("Lỗi lưu card scan lên API:", err);
    }

    // 2. Nếu người dùng chọn lưu Khách hàng tiềm năng & Đối tác cần care
    if (isLeadCare) {
      try {
        const tierTag =
          leadTier === "hot"
            ? "⭐ Hot Lead"
            : leadTier === "vip"
            ? "💎 Đối tác VIP"
            : leadTier === "care24h"
            ? "🎯 Cần care 24h"
            : "🌟 Khách hàng nổi bật";

        const customerPayload: B2BCustomerData = {
          name: name.trim(),
          company: company.trim() || "Doanh nghiệp đối tác",
          phone: phone.trim(),
          email: email.trim(),
          dealValue: dealValue.trim(),
          stage: stage,
          contactPerson: name.trim(),
          tags: [tierTag, "Danh thiếp AI OCR", "Đang chăm sóc"],
          notes: `${needsNote.trim()} | PIC: ${assignedStaff.trim()} | Hành động tiếp: ${nextAction.trim()} | Zalo: ${zaloUrl || "N/A"}`,
        };

        await customerApi.createCustomer(customerPayload);

        if (onSaveCustomerLead) {
          onSaveCustomerLead({
            ...customerPayload,
            tier: leadTier,
            assignedStaff: assignedStaff.trim(),
          });
        }
      } catch (err) {
        console.warn("Lỗi lưu khách hàng tiềm năng lên CRM:", err);
      }
    }

    setIsSaving(false);
    onSaveContact(newContact);

    if (cleanPhone) {
      Alert.alert(
        "Lưu danh bạ thành công",
        `Đã lưu danh thiếp của ${name.trim()} (SĐT: ${phone.trim()}) vào danh bạ ViOne.\nBạn có muốn mở Zalo để liên hệ ngay không?`,
        [
          {
            text: "Nhắn tin Zalo ngay",
            onPress: () => {
              Linking.openURL(`https://zalo.me/${cleanPhone}`).catch(() => {});
              resetAndClose();
            },
          },
          {
            text: "Hoàn tất",
            onPress: () => resetAndClose(),
          },
        ]
      );
    } else {
      Alert.alert("Thành công", `Đã lưu danh thiếp của ${name.trim()} vào danh bạ đối tác ViOne.`);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setStep("capture");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheetContainer, { backgroundColor: colors.surface, borderColor: colors.surfaceBorderGold }]}>
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: colors.surfaceBorder }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IdCard size={20} color={colors.gold} style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Quét Danh Thiếp & Lưu Khách Hàng</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  AI OCR Copilot số hóa danh bạ & kết nối Zalo
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeBtn}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* STEP 1: CAPTURE VIEW */}
          {step === "capture" && (
            <View style={styles.captureContainer}>
              <View style={[styles.cardFrame, { backgroundColor: colors.surface2, borderColor: colors.surfaceBorder, overflow: "hidden" }]}>
                {permission?.granted ? (
                  <>
                    <CameraView
                      ref={cameraRef}
                      style={StyleSheet.absoluteFillObject}
                      facing={facing}
                      enableTorch={torch}
                      onBarcodeScanned={qrDetected ? undefined : handleBarcodeScanned}
                      barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                      }}
                    />
                    {/* Top camera controls */}
                    <View style={styles.cameraOverlayControls}>
                      <TouchableOpacity
                        onPress={() => setTorch((t) => !t)}
                        style={[styles.cameraMiniBtn, torch && styles.cameraMiniBtnActive]}
                        activeOpacity={0.8}
                      >
                        <Zap size={16} color={torch ? "#050C15" : "#DFB76C"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
                        style={styles.cameraMiniBtn}
                        activeOpacity={0.8}
                      >
                        <RefreshCw size={15} color="#DFB76C" />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={styles.framePlaceholder}>
                    <Camera size={44} color={colors.gold} strokeWidth={1.5} />
                    <Text style={[styles.frameText, { color: colors.textPrimary }]}>Căn chỉnh danh thiếp nằm gọn trong khung</Text>
                    <Text style={[styles.frameSubText, { color: colors.textMuted }]}>
                      Hệ thống AI sẽ tự động đọc tên, SĐT và chức vụ từ visit card
                    </Text>
                    <TouchableOpacity
                      onPress={requestPermission}
                      style={{ marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.gold }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#050C15" }}>Cấp quyền Camera</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* 4 Gold Framing Corners */}
                <View style={[styles.cornerTL, { borderColor: colors.gold, zIndex: 10 }]} />
                <View style={[styles.cornerTR, { borderColor: colors.gold, zIndex: 10 }]} />
                <View style={[styles.cornerBL, { borderColor: colors.gold, zIndex: 10 }]} />
                <View style={[styles.cornerBR, { borderColor: colors.gold, zIndex: 10 }]} />
              </View>

              <TouchableOpacity style={styles.captureBtn} onPress={handleCaptureAndScan} activeOpacity={0.85}>
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.captureGradient}
                >
                  <ScanLine size={18} color="#050C15" style={{ marginRight: 6 }} />
                  <Text style={styles.captureBtnText}>Chụp & Quét AI OCR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: SCANNING PROGRESS */}
          {step === "scanning" && (
            <View style={styles.scanningContainer}>
              <ActivityIndicator size="large" color={colors.gold} style={{ marginBottom: 16 }} />
              <Text style={[styles.scanningTitle, { color: colors.textPrimary }]}>Đang phân tích danh thiếp...</Text>
              <Text style={[styles.scanningSubtitle, { color: colors.textMuted }]}>
                AI OCR Copilot đang trích xuất tối thiểu: Họ tên, Chức vụ, Số điện thoại và liên kết Zalo
              </Text>
            </View>
          )}

          {/* STEP 3: REVIEW & EDIT FORM */}
          {step === "review" && (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 560 }}>
              {capturedPhotoUri ? (
                <View style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, height: 120, borderWidth: 1, borderColor: colors.gold }}>
                  <Image source={{ uri: capturedPhotoUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
              ) : null}

              <View style={[styles.successBadgeRow, { backgroundColor: colors.goldSoft, borderColor: colors.surfaceBorderGold }]}>
                <Sparkles size={16} color={colors.gold} style={{ marginRight: 6 }} />
                <Text style={[styles.successBadgeText, { color: colors.textGold }]}>
                  Đã nhận diện tối thiểu: Tên, Chức danh & Số điện thoại
                </Text>
              </View>

              {/* TÁC VỤ KẾT NỐI NHANH: KẾT BẠN ZALO & LƯU DANH BẠ */}
              <View
                style={{
                  marginVertical: 12,
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: isDark ? "rgba(216, 178, 130, 0.1)" : "#FEF3C7",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(216, 178, 130, 0.35)" : "#FDE68A",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: colors.gold, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Tác vụ kết nối nhanh
                  </Text>
                  {phone.trim() ? (
                    <Text style={{ fontSize: 12, fontWeight: "700", color: colors.textPrimary }}>
                      {phone.trim()}
                    </Text>
                  ) : null}
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  {phone.trim() ? (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: "#0068FF",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        const cleanPhone = phone.replace(/\D/g, "");
                        Linking.openURL(`https://zalo.me/${cleanPhone}`).catch(() => {
                          Alert.alert("Zalo", `Mở liên kết: https://zalo.me/${cleanPhone}`);
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <MessageCircle size={15} color="#FFFFFF" />
                      <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>
                        Kết bạn Zalo
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: "rgba(148, 163, 184, 0.2)",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: colors.textDisabled, fontSize: 12, fontWeight: "600" }}>
                        Chưa có SĐT
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      backgroundColor: colors.surface2,
                      borderWidth: 1,
                      borderColor: colors.gold,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                    }}
                    onPress={handleSaveToDeviceContacts}
                    activeOpacity={0.8}
                  >
                    <Download size={15} color={colors.gold} />
                    <Text style={{ color: colors.gold, fontSize: 12, fontWeight: "700" }}>
                      Lưu danh bạ máy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>


              {/* THÔNG TIN DANH BẠ CƠ BẢN */}
              <Text style={[styles.sectionHeading, { color: colors.gold }]}>THÔNG TIN DOANH NHÂN & DOANH NGHIỆP</Text>

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>HỌ VÀ TÊN DOANH NHÂN</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                value={name}
                onChangeText={setName}
                placeholder="Nhập họ và tên đối tác trên danh thiếp..."
                placeholderTextColor={colors.textDisabled}
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CHỨC VỤ / VỊ TRÍ</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Chức danh (VD: Tổng Giám Đốc)..."
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>SỐ ĐIỆN THOẠI</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Số điện thoại di động..."
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>DOANH NGHIỆP / TỔ CHỨC</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                value={company}
                onChangeText={setCompany}
                placeholder="Tên công ty / Tập đoàn đối tác..."
                placeholderTextColor={colors.textDisabled}
              />

              <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>EMAIL CÔNG VIỆC</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="email@doanhnghiep.vn..."
                placeholderTextColor={colors.textDisabled}
              />

              <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>ĐỊA CHỈ TRỤ SỞ DOANH NGHIỆP</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.surface2, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Địa chỉ văn phòng / trụ sở..."
                placeholderTextColor={colors.textDisabled}
              />

              {/* BẬT TÍNH NĂNG LƯU VÀO KHÁCH HÀNG TIỀM NĂNG & CHĂM SÓC */}
              <View style={[styles.leadToggleCard, { backgroundColor: isDark ? "#171B26" : "#F1F5F9", borderColor: colors.surfaceBorderGold }]}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Flame size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={[styles.leadToggleTitle, { color: colors.textPrimary }]}>
                      Lưu thành Khách Hàng Tiềm Năng (Lead)
                    </Text>
                  </View>
                  <Text style={[styles.leadToggleDesc, { color: colors.textMuted }]}>
                    Tự động đẩy vào CRM Pipeline để phân công nhân sự chăm sóc và theo dõi giá trị thương vụ.
                  </Text>
                </View>
                <Switch
                  value={isLeadCare}
                  onValueChange={setIsLeadCare}
                  trackColor={{ false: colors.surface2, true: colors.gold }}
                  thumbColor={isLeadCare ? "#050C15" : "#94A3B8"}
                />
              </View>

              {isLeadCare && (
                <View style={[styles.leadDetailsContainer, { backgroundColor: colors.surface2, borderColor: colors.surfaceBorder }]}>
                  {/* CHỌN HẠNG MỤC TIỀM NĂNG (TIER) */}
                  <Text style={[styles.inputLabel, { color: colors.gold }]}>PHÂN LOẠI MỨC ĐỘ TIỀM NĂNG & QUAN TÂM</Text>
                  <View style={styles.tierSelectorRow}>
                    {[
                      { id: "hot", label: "⭐ Hot Lead", icon: Flame, color: "#EF4444" },
                      { id: "vip", label: "💎 VIP Doanh Nhân", icon: Crown, color: "#F59E0B" },
                      { id: "featured", label: "🌟 Nổi bật", icon: Star, color: "#38BDF8" },
                      { id: "care24h", label: "🎯 Cần care 24h", icon: Clock, color: "#10B981" },
                    ].map((t) => {
                      const isSelected = leadTier === t.id;
                      return (
                        <TouchableOpacity
                          key={t.id}
                          style={[
                            styles.tierChip,
                            { borderColor: colors.surfaceBorder, backgroundColor: colors.surface },
                            isSelected && {
                              backgroundColor: isDark ? "rgba(216, 178, 130, 0.22)" : "#FEF3C7",
                              borderColor: colors.gold,
                            },
                          ]}
                          onPress={() => setLeadTier(t.id as CustomerLeadTier)}
                        >
                          <Text
                            style={[
                              styles.tierChipText,
                              { color: colors.textSecondary },
                              isSelected && {
                                color: isDark ? colors.textGold : "#92400E",
                                fontWeight: "800",
                              },
                            ]}
                          >
                            {t.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* GIÁ TRỊ THƯƠNG VỤ VÀ GIAI ĐOẠN */}
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                    <View style={{ flex: 1.2 }}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GIÁ TRỊ DỰ KIẾN (DEAL)</Text>
                      <TextInput
                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                        value={dealValue}
                        onChangeText={setDealValue}
                        placeholderTextColor={colors.textDisabled}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GIAI ĐOẠN</Text>
                      <TextInput
                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                        value={stage === "prospect" ? "Tiếp cận" : stage === "proposal" ? "Gửi báo giá" : "Đàm phán"}
                        editable={false}
                      />
                    </View>
                  </View>

                  {/* NHÂN VIÊN PHỤ TRÁCH CHĂM SÓC (PIC) */}
                  <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>NHÂN SỰ PHỤ TRÁCH CHĂM SÓC (PIC)</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                    value={assignedStaff}
                    onChangeText={setAssignedStaff}
                    placeholder="Tên nhân viên phụ trách care..."
                    placeholderTextColor={colors.textDisabled}
                  />

                  {/* NHU CẦU BAN ĐẦU */}
                  <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>NHU CẦU & KỲ VỌNG HỢP TÁC</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.surfaceBorder, height: 54 }]}
                    value={needsNote}
                    onChangeText={setNeedsNote}
                    multiline
                    placeholder="Mô tả nhu cầu sản phẩm / dịch vụ..."
                    placeholderTextColor={colors.textDisabled}
                  />

                  {/* HÀNH ĐỘNG TIẾP THEO */}
                  <Text style={[styles.inputLabel, { marginTop: 10, color: colors.textSecondary }]}>HÀNH ĐỘNG TIẾP THEO & HẠN CHÓT</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                    value={nextAction}
                    onChangeText={setNextAction}
                    placeholder="Hành động cần làm tiếp..."
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
              )}

              <View style={[styles.reviewFooterRow, { borderTopColor: colors.surfaceBorder }]}>
                <TouchableOpacity
                  style={[
                    styles.reScanBtn,
                    {
                      backgroundColor: colors.surface2,
                      borderColor: colors.surfaceBorderGold,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => setStep("capture")}
                  disabled={isSaving}
                >
                  <Text style={[styles.reScanBtnText, { color: colors.textPrimary }]}>Quét lại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveContactBtn}
                  onPress={handleSave}
                  activeOpacity={0.85}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveContactGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#050C15" style={{ marginRight: 6 }} />
                    ) : (
                      <CheckCircle size={16} color="#050C15" style={{ marginRight: 6 }} />
                    )}
                    <Text style={styles.saveContactBtnText}>
                      {isSaving ? "Đang lưu hệ thống..." : isLeadCare ? "Lưu Khách Hàng Tiềm Năng" : "Lưu Danh Bạ ViOne"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  captureContainer: {
    alignItems: "center",
    paddingVertical: 14,
  },
  cardFrame: {
    width: "100%",
    height: 190,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cornerTL: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerTR: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cornerBL: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 22,
    height: 22,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerBR: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 22,
    height: 22,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cameraOverlayControls: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 8,
    zIndex: 20,
  },
  cameraMiniBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(20, 28, 43, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraMiniBtnActive: {
    backgroundColor: "#D8B282",
    borderColor: "#D8B282",
  },
  framePlaceholder: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  frameText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  frameSubText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  captureBtn: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  captureGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  captureBtnText: {
    color: "#050C15",
    fontSize: 13,
    fontWeight: "800",
  },
  scanningContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  scanningTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  scanningSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 280,
    lineHeight: 18,
  },
  successBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  successBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  inputField: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    borderWidth: 1,
  },
  leadToggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  leadToggleTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  leadToggleDesc: {
    fontSize: 10.5,
    marginTop: 2,
  },
  leadDetailsContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  tierSelectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  tierChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tierChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  reviewFooterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  reScanBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  reScanBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  saveContactBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  saveContactGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  saveContactBtnText: {
    color: "#050C15",
    fontSize: 13,
    fontWeight: "800",
  },
});
