import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  QrCode,
  Copy,
  Layers,
  ArrowRight,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { apiRequest } from "../api/client";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface SubscriptionPackage {
  id: string;
  code: string;
  name: string;
  description: string | null;
  packageType: string;
  price: number;
  billingCycle: string;
  durationDays: number;
  maxSlots: number;
  maxDepartments: number;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  qrTemplate: string | null;
  features: string[];
  isActive: boolean;
}

interface PackageRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  prefillCompanyName?: string;
}

export const PackageRegistrationModal: React.FC<PackageRegistrationModalProps> = ({
  visible,
  onClose,
  onSuccess,
  prefillCompanyName = "",
}) => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<SubscriptionPackage | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Form states
  const [companyName, setCompanyName] = useState(prefillCompanyName);
  const [taxId, setTaxId] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPackages();
      if (prefillCompanyName && !companyName) {
        setCompanyName(prefillCompanyName);
      }
    }
  }, [visible, prefillCompanyName]);

  const loadPackages = async () => {
    setLoadingPackages(true);
    try {
      const res: any = await apiRequest<SubscriptionPackage[]>("/companies/packages");
      const list = Array.isArray(res) ? res : res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setPackages(list);
        const freePkg = list.find((p) => p.code === "FREE_30D" || p.price === 0);
        setSelectedPkg(freePkg || list[0]);
      } else {
        // Fallback default packages
        const defaults: SubscriptionPackage[] = [
          {
            id: "free-30d",
            code: "FREE_30D",
            name: "Gói Dùng Thử 30 Ngày",
            description: "Dành cho doanh nghiệp trải nghiệm toàn diện hệ sinh thái ViOne",
            packageType: "trial",
            price: 0,
            billingCycle: "monthly",
            durationDays: 30,
            maxSlots: 30,
            maxDepartments: 5,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["30 tài khoản nhân sự", "Quản lý công việc & phòng ban", "Cơ hội giao thương B2B"],
            isActive: true,
          },
          {
            id: "std-30",
            code: "VIONE_STANDARD_30",
            name: "Gói Chuẩn 30 Tài Khoản",
            description: "Tối ưu hóa quản trị & vận hành cho doanh nghiệp SME",
            packageType: "standard",
            price: 1500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 30,
            maxDepartments: 5,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["30 tài khoản nhân sự", "Phân quyền vai trò", "Chấm công & Tài chính", "Hỗ trợ 24/7"],
            isActive: true,
          },
          {
            id: "growth-50",
            code: "VIONE_GROWTH_50",
            name: "Gói Tăng Trưởng 50 Tài Khoản",
            description: "Mở rộng quy mô doanh nghiệp với đầy đủ công cụ quản trị nâng cao",
            packageType: "growth",
            price: 2500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 50,
            maxDepartments: 10,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["50 tài khoản nhân sự", "Quản lý đa phòng ban", "Tự động hóa báo cáo KPI", "CRM nâng cao"],
            isActive: true,
          },
          {
            id: "ent-100",
            code: "VIONE_ENTERPRISE_100",
            name: "Gói Doanh Nghiệp 100 Tài Khoản",
            description: "Giải pháp toàn diện chuyên biệt cho doanh nghiệp quy mô lớn",
            packageType: "enterprise",
            price: 4500000,
            billingCycle: "yearly",
            durationDays: 365,
            maxSlots: 100,
            maxDepartments: 20,
            bankName: "MB",
            bankAccount: "0333666999",
            bankAccountName: "CONG TY CP VICONNECT",
            qrTemplate: "compact2",
            features: ["100 tài khoản nhân sự", "Không giới hạn phòng ban", "Bảo mật Enterprise", "Hỗ trợ riêng 1-1"],
            isActive: true,
          },
        ];
        setPackages(defaults);
        setSelectedPkg(defaults[0]);
      }
    } catch (err) {
      console.warn("[PackageRegistrationModal] Failed to load packages:", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Đã sao chép", `Đã lưu ${label} vào bộ nhớ tạm.`);
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên doanh nghiệp / công ty.");
      return;
    }
    if (!representativeName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người đại diện pháp luật.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại liên hệ.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ để nhận thông tin gói.");
      return;
    }
    if (!selectedPkg) {
      Alert.alert("Lỗi", "Vui lòng chọn một gói cước ViOne Platform.");
      return;
    }

    setSubmitting(true);
    try {
      const res: any = await apiRequest<any>("/companies/package-orders", {
        method: "POST",
        data: {
          packageId: selectedPkg.id,
          packageCode: selectedPkg.code,
          packageName: selectedPkg.name,
          price: selectedPkg.price,
          maxSlots: selectedPkg.maxSlots,
          companyName: companyName.trim(),
          taxId: taxId.trim() || undefined,
          representativeName: representativeName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          industry: industry.trim() || undefined,
          address: address.trim() || undefined,
          paymentMethod: selectedPkg.price > 0 ? "vietqr" : "free_trial",
        },
      });

      const data = res?.data || res;
      if (data && (data.id || data.success || data.order)) {
        Alert.alert(
          "Gửi Hồ Sơ Thành Công! 🌟",
          `Hồ sơ đăng ký gói "${selectedPkg.name}" (${selectedPkg.maxSlots} tài khoản) của bạn đã được chuyển về CRM ViConnect.\n\nNhân viên sẽ kiểm tra và kích hoạt gói, đồng thời gửi thông tin chi tiết về email: ${email}`,
          [
            {
              text: "Đồng Ý",
              onPress: () => {
                if (onSuccess) onSuccess();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert("Thông báo", data?.message || "Không thể gửi hồ sơ đăng ký.");
      }
    } catch (err: any) {
      Alert.alert("Lỗi máy chủ", err?.message || "Vui lòng kiểm tra lại kết nối mạng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.headerBar}>
            <View style={modalStyles.headerLeft}>
              <View style={modalStyles.headerIconCircle}>
                <Sparkles size={18} color="#050C15" />
              </View>
              <View>
                <Text style={modalStyles.headerTitle}>ĐĂNG KÝ GÓI VIONE PLATFORM</Text>
                <Text style={modalStyles.headerSubtitle}>
                  Số tài khoản càng nhiều · Giá trị càng lớn
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.8 }}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* PHẦN 1: THÔNG TIN DOANH NGHIỆP */}
            <View style={modalStyles.section}>
              <View style={modalStyles.sectionHeader}>
                <Building2 size={16} color="#D8B282" />
                <Text style={modalStyles.sectionTitle}>1. THÔNG TIN DOANH NGHIỆP</Text>
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.label}>
                  Tên Doanh Nghiệp / Công Ty <Text style={modalStyles.req}>*</Text>
                </Text>
                <TextInput
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="VD: Công ty Cổ phần Công nghệ ViConnect"
                  placeholderTextColor="#64748B"
                  style={modalStyles.input}
                />
              </View>

              <View style={modalStyles.rowInputs}>
                <View style={[modalStyles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={modalStyles.label}>Mã Số Thuế (MST)</Text>
                  <TextInput
                    value={taxId}
                    onChangeText={setTaxId}
                    placeholder="VD: 0109988776"
                    placeholderTextColor="#64748B"
                    style={modalStyles.input}
                  />
                </View>

                <View style={[modalStyles.inputGroup, { flex: 1 }]}>
                  <Text style={modalStyles.label}>
                    Người Đại Diện <Text style={modalStyles.req}>*</Text>
                  </Text>
                  <TextInput
                    value={representativeName}
                    onChangeText={setRepresentativeName}
                    placeholder="VD: Nguyễn Văn A"
                    placeholderTextColor="#64748B"
                    style={modalStyles.input}
                  />
                </View>
              </View>

              <View style={modalStyles.rowInputs}>
                <View style={[modalStyles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={modalStyles.label}>
                    Số Điện Thoại <Text style={modalStyles.req}>*</Text>
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="VD: 0988889999"
                    placeholderTextColor="#64748B"
                    keyboardType="phone-pad"
                    style={modalStyles.input}
                  />
                </View>

                <View style={[modalStyles.inputGroup, { flex: 1 }]}>
                  <Text style={modalStyles.label}>
                    Email Nhận Gói <Text style={modalStyles.req}>*</Text>
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="VD: ceo@viconnect.vn"
                    placeholderTextColor="#64748B"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={modalStyles.input}
                  />
                </View>
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.label}>Lĩnh Vực Kinh Doanh</Text>
                <TextInput
                  value={industry}
                  onChangeText={setIndustry}
                  placeholder="VD: Bất Động Sản, Xây Dựng, CNTT"
                  placeholderTextColor="#64748B"
                  style={modalStyles.input}
                />
              </View>

              <View style={modalStyles.inputGroup}>
                <Text style={modalStyles.label}>Địa Chỉ Trụ Sở</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="VD: Cầu Giấy, Hà Nội"
                  placeholderTextColor="#64748B"
                  style={modalStyles.input}
                />
              </View>
            </View>

            {/* PHẦN 2: CHỌN GÓI VIONE */}
            <View style={modalStyles.section}>
              <View style={modalStyles.sectionHeader}>
                <Layers size={16} color="#D8B282" />
                <Text style={modalStyles.sectionTitle}>2. LỰA CHỌN GÓI DỊCH VỤ</Text>
              </View>

              {loadingPackages ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator color="#D8B282" />
                  <Text style={{ color: "#94A3B8", fontSize: 12, marginTop: 8 }}>
                    Đang tải danh mục gói cước...
                  </Text>
                </View>
              ) : (
                <View style={modalStyles.packageList}>
                  {packages.map((pkg) => {
                    const isSelected = selectedPkg?.id === pkg.id || selectedPkg?.code === pkg.code;
                    const isFree = pkg.price === 0;

                    return (
                      <TouchableOpacity
                        key={pkg.id || pkg.code}
                        onPress={() => setSelectedPkg(pkg)}
                        activeOpacity={0.8}
                        style={[
                          modalStyles.pkgCard,
                          isSelected && modalStyles.pkgCardSelected,
                        ]}
                      >
                        <View style={modalStyles.pkgCardHeader}>
                          <View
                            style={[
                              modalStyles.pkgBadge,
                              isFree ? modalStyles.pkgBadgeFree : modalStyles.pkgBadgePaid,
                            ]}
                          >
                            <Text
                              style={[
                                modalStyles.pkgBadgeText,
                                isFree ? { color: "#34D399" } : { color: "#F6E1C3" },
                              ]}
                            >
                              {isFree ? "Free 30 Ngày" : `${pkg.maxSlots} Tài Khoản`}
                            </Text>
                          </View>
                          {isSelected && (
                            <View style={modalStyles.checkIcon}>
                              <CheckCircle2 size={16} color="#D8B282" />
                            </View>
                          )}
                        </View>

                        <Text style={modalStyles.pkgName}>{pkg.name}</Text>
                        <Text style={modalStyles.pkgDesc} numberOfLines={2}>
                          {pkg.description || "Gói phần mềm ViOne Platform Enterprise"}
                        </Text>

                        <View style={modalStyles.pkgFooter}>
                          <Text style={modalStyles.pkgPrice}>
                            {isFree ? "0 VNĐ" : `${pkg.price.toLocaleString("vi-VN")} đ`}
                          </Text>
                          <View style={modalStyles.pkgSlotsRow}>
                            <Users size={12} color="#D8B282" />
                            <Text style={modalStyles.pkgSlotsText}>
                              Tối đa {pkg.maxSlots} slots
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* PHẦN 3: THANH TOÁN VIETQR NẾU GÓI CÓ PHÍ */}
            {selectedPkg && selectedPkg.price > 0 && (
              <View style={modalStyles.section}>
                <View style={modalStyles.sectionHeader}>
                  <QrCode size={16} color="#D8B282" />
                  <Text style={modalStyles.sectionTitle}>3. QUÉT MÃ VIETQR NAPAS 24/7</Text>
                </View>

                <View style={modalStyles.qrCard}>
                  <View style={modalStyles.qrImageWrap}>
                    <Image
                      source={{
                        uri: `https://img.vietqr.io/image/${selectedPkg.bankName || "MB"}-${
                          selectedPkg.bankAccount || "0333666999"
                        }-${selectedPkg.qrTemplate || "compact2"}.png?amount=${
                          selectedPkg.price
                        }&addInfo=${encodeURIComponent(
                          `VIONE ${selectedPkg.code} ${phone || "DK"}`
                        )}&accountName=${encodeURIComponent(
                          selectedPkg.bankAccountName || "CONG TY CP VICONNECT"
                        )}`,
                      }}
                      style={modalStyles.qrImage}
                      resizeMode="contain"
                    />
                    <Text style={modalStyles.qrSubText}>VIETQR NAPAS 24/7</Text>
                  </View>

                  <View style={modalStyles.bankInfoWrap}>
                    <View style={modalStyles.bankRow}>
                      <Text style={modalStyles.bankLabel}>Ngân hàng:</Text>
                      <Text style={modalStyles.bankVal}>
                        {selectedPkg.bankName || "MB (Quân Đội)"}
                      </Text>
                    </View>

                    <View style={modalStyles.bankRow}>
                      <Text style={modalStyles.bankLabel}>Số tài khoản:</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[modalStyles.bankVal, { color: "#F6E1C3", fontWeight: "800" }]}>
                          {selectedPkg.bankAccount || "0333666999"}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            copyToClipboard(selectedPkg.bankAccount || "0333666999", "Số tài khoản")
                          }
                        >
                          <Copy size={13} color="#D8B282" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={modalStyles.bankRow}>
                      <Text style={modalStyles.bankLabel}>Chủ tài khoản:</Text>
                      <Text style={modalStyles.bankVal}>
                        {selectedPkg.bankAccountName || "CONG TY CP VICONNECT"}
                      </Text>
                    </View>

                    <View style={modalStyles.bankRow}>
                      <Text style={modalStyles.bankLabel}>Số tiền:</Text>
                      <Text style={[modalStyles.bankVal, { color: "#D8B282", fontWeight: "900" }]}>
                        {selectedPkg.price.toLocaleString("vi-VN")} đ
                      </Text>
                    </View>

                    <View style={modalStyles.bankRow}>
                      <Text style={modalStyles.bankLabel}>Nội dung:</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[modalStyles.bankVal, { color: "#34D399", fontWeight: "800" }]}>
                          VIONE {selectedPkg.code} {phone || "DK"}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            copyToClipboard(
                              `VIONE ${selectedPkg.code} ${phone || "DK"}`,
                              "Nội dung chuyển khoản"
                            )
                          }
                        >
                          <Copy size={13} color="#D8B282" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Gói Free 30 ngày ghi chú */}
            {selectedPkg && selectedPkg.price === 0 && (
              <View style={modalStyles.freeNotice}>
                <Sparkles size={16} color="#34D399" />
                <Text style={modalStyles.freeNoticeText}>
                  Bạn đang chọn Gói Dùng Thử Miễn Phí 30 Ngày (30 tài khoản). Sau khi gửi, hồ sơ sẽ được duyệt trong vòng 24h và thông tin kích hoạt gửi tới email của bạn.
                </Text>
              </View>
            )}

            {/* Nút gửi đăng ký */}
            <View style={modalStyles.submitContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.85}
                style={{ borderRadius: 14, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["#F6E1C3", "#D8B282", "#C29B69", "#8C653B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={modalStyles.submitGrad}
                >
                  {submitting ? (
                    <ActivityIndicator color="#050C15" />
                  ) : (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={modalStyles.submitText}>
                        GỬI ĐĂNG KÝ VỀ VICONNECT CRM
                      </Text>
                      <ArrowRight size={16} color="#050C15" strokeWidth={2.5} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#050C15",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.35)",
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 178, 130, 0.2)",
    backgroundColor: "#0A101D",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#D8B282",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#F6E1C3",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  section: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#D8B282",
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  req: {
    color: "#F43F5E",
  },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: "#FFFFFF",
    fontSize: 12.5,
  },
  packageList: {
    gap: 10,
  },
  pkgCard: {
    backgroundColor: "#0A101D",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 12,
    gap: 4,
  },
  pkgCardSelected: {
    borderColor: "#D8B282",
    backgroundColor: "rgba(216, 178, 130, 0.12)",
  },
  pkgCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pkgBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pkgBadgeFree: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  pkgBadgePaid: {
    backgroundColor: "rgba(216, 178, 130, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.4)",
  },
  pkgBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  checkIcon: {
    marginLeft: "auto",
  },
  pkgName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  pkgDesc: {
    fontSize: 11,
    color: "#94A3B8",
  },
  pkgFooter: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  pkgPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: "#F6E1C3",
  },
  pkgSlotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pkgSlotsText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  qrCard: {
    backgroundColor: "#0A101D",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(216, 178, 130, 0.3)",
    padding: 12,
    alignItems: "center",
    gap: 12,
  },
  qrImageWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  qrImage: {
    width: 140,
    height: 140,
  },
  qrSubText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#050C15",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  bankInfoWrap: {
    width: "100%",
    gap: 6,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  bankLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  bankVal: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  freeNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
    borderRadius: 12,
    padding: 12,
  },
  freeNoticeText: {
    fontSize: 11.5,
    color: "#A7F3D0",
    flex: 1,
    lineHeight: 16,
  },
  submitContainer: {
    marginTop: 6,
  },
  submitGrad: {
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#050C15",
    fontSize: 12.5,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
