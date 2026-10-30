import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

export const navigationRef = createNavigationContainerRef<any>();

// Screens
import { LoginScreen } from "../screens/auth/LoginScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { NetworkScreen } from "../screens/network/NetworkScreen";
import { CommunityScreen } from "../screens/community/CommunityScreen";
import { ProfileScreen } from "../screens/me/ProfileScreen";
import { PlatformAppScreen } from "../screens/platform/PlatformAppScreen";

// Navigation & Modals
import { CustomBottomTabBar } from "./CustomBottomTabBar";
import { VActionSheet } from "../components/VActionSheet";
import { MyQrModal } from "../screens/quick-connect/MyQrModal";
import { ScanQrModal } from "../screens/quick-connect/ScanQrModal";
import { AttendanceModal } from "../components/AttendanceModal";
import { WorkflowModal } from "../components/WorkflowModal";
import { AssignTaskModal } from "../components/AssignTaskModal";
import { StaffDailyActivityModal } from "../components/StaffDailyActivityModal";
import { ViOneVoiceAssistantModal } from "../components/ai/ViOneVoiceAssistantModal";
import { DraggableFloatingAiOrb } from "../components/ai/DraggableFloatingAiOrb";
import { CardScanReviewModal } from "../components/CardScanReviewModal";
import { PostMomentModal } from "../components/PostMomentModal";
import { MemberCardBottomSheet } from "../components/MemberCardBottomSheet";
import { IdentityPrivacyModal } from "../components/IdentityPrivacyModal";
import {
  IncomingQrConnectionModal,
  QrRequesterProfile,
} from "../components/common/IncomingQrConnectionModal";
import { networkApi } from "../api/services";
import { Alert } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: "#0B0F17",
    card: "#0B0F17",
    text: "#F5F7FA",
    border: "rgba(216, 178, 130, 0.18)",
    primary: "#D8B282",
  },
};


const MainTabs: React.FC<{
  onVPress: () => void;
  onOpenPlatformTab: (tab: any) => void;
}> = ({ onVPress, onOpenPlatformTab }) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} onVPress={onVPress} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            onOpenV={onVPress}
            onOpenPlatformTab={onOpenPlatformTab}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Network" component={NetworkScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Me" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [vSheetVisible, setVSheetVisible] = useState(false);
  const [myQrVisible, setMyQrVisible] = useState(false);
  const [scanQrVisible, setScanQrVisible] = useState(false);
  const [cardScanVisible, setCardScanVisible] = useState(false);
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [assignTaskVisible, setAssignTaskVisible] = useState(false);
  const [staffActivityVisible, setStaffActivityVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [postMomentVisible, setPostMomentVisible] = useState(false);
  const [platformAppVisible, setPlatformAppVisible] = useState(false);
  const [platformTab, setPlatformTab] = useState<any>("overview");
  const [memberCardVisible, setMemberCardVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [incomingRequester, setIncomingRequester] = useState<QrRequesterProfile | null>(null);

  const handleOpenPlatformTab = (tab: any = "overview") => {
    setPlatformTab(tab);
    setPlatformAppVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main">
            {() => (
              <MainTabs
                onVPress={() => setVSheetVisible(true)}
                onOpenPlatformTab={handleOpenPlatformTab}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>

      {/* Global Quick Action Modals */}
      <VActionSheet
        visible={vSheetVisible}
        onClose={() => setVSheetVisible(false)}
        onOpenMyQr={() => setMyQrVisible(true)}
        onOpenScanQr={() => setScanQrVisible(true)}
        onOpenCardScan={() => setCardScanVisible(true)}
        onPostMoment={() => setPostMomentVisible(true)}
        onOpenAttendance={() => setAttendanceVisible(true)}
        onOpenWorkflow={() => setWorkflowVisible(true)}
        onOpenAssignTask={() => setAssignTaskVisible(true)}
        onOpenStaffActivity={() => setStaffActivityVisible(true)}
        onOpenAiAssistant={() => setAiAssistantVisible(true)}
        onOpenPlatformApp={() => handleOpenPlatformTab("overview")}
        onOpenMemberCard={() => setMemberCardVisible(true)}
        onOpenPrivacy={() => setPrivacyModalVisible(true)}
      />

      <MemberCardBottomSheet
        visible={memberCardVisible}
        onClose={() => setMemberCardVisible(false)}
        member={user ? {
          name: user.displayName || user.name || "Doanh nhân ViOne",
          title: user.title || "Tổng Giám Đốc",
          company: user.company || "ViOne Business Network",
          phone: user.phone || undefined,
          email: user.email || undefined,
          code: user.code || undefined,
          avatarUrl: user.avatarUrl || undefined,
          website: user.website || undefined,
        } : null}
        onOpenMyQr={() => {
          setMemberCardVisible(false);
          setMyQrVisible(true);
        }}
      />

      <IdentityPrivacyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />

      <Modal visible={platformAppVisible} animationType="slide">
        <PlatformAppScreen
          onBack={() => setPlatformAppVisible(false)}
          initialTab={platformTab}
        />
      </Modal>

      <MyQrModal visible={myQrVisible} onClose={() => setMyQrVisible(false)} />
      <ScanQrModal visible={scanQrVisible} onClose={() => setScanQrVisible(false)} />
      <CardScanReviewModal
        visible={cardScanVisible}
        onClose={() => setCardScanVisible(false)}
        onSaveContact={() => setCardScanVisible(false)}
      />
      <PostMomentModal
        visible={postMomentVisible}
        onClose={() => setPostMomentVisible(false)}
        onPostSuccess={() => setPostMomentVisible(false)}
      />
      <AttendanceModal visible={attendanceVisible} onClose={() => setAttendanceVisible(false)} />
      <WorkflowModal visible={workflowVisible} onClose={() => setWorkflowVisible(false)} />
      <AssignTaskModal
        visible={assignTaskVisible}
        onClose={() => setAssignTaskVisible(false)}
        communityId="c-vione-internal"
      />
      <StaffDailyActivityModal
        visible={staffActivityVisible}
        onClose={() => setStaffActivityVisible(false)}
      />
      <ViOneVoiceAssistantModal
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        onNavigateToTab={(tab) => {
          if (navigationRef.isReady()) {
            navigationRef.navigate(tab);
          }
        }}
        onOpenMyQr={() => setMyQrVisible(true)}
        onOpenScanQr={() => setScanQrVisible(true)}
        onOpenAssignTask={() => setAssignTaskVisible(true)}
        onOpenStaffActivity={() => setStaffActivityVisible(true)}
        onOpenAttendance={() => setAttendanceVisible(true)}
        onOpenWorkflow={() => setWorkflowVisible(true)}
      />

      {/* Bilateral QR Handshake Incoming Connection Modal */}
      <IncomingQrConnectionModal
        visible={Boolean(incomingRequester)}
        onClose={() => setIncomingRequester(null)}
        requester={incomingRequester}
        onAccept={async (req) => {
          try {
            if (req.connectionId) {
              await networkApi.updateConnection(req.connectionId, "accepted");
            }
          } catch {}
          Alert.alert(
            "Kết nối thành công",
            `Bạn và ${req.name} đã trở thành đối tác kết nối. Thông báo phản hồi đã được gửi tới đối tác.`
          );
        }}
        onDecline={async (req) => {
          try {
            if (req.connectionId) {
              await networkApi.updateConnection(req.connectionId, "declined");
            }
          } catch {}
          Alert.alert(
            "Đã từ chối kết nối",
            `Đã từ chối kết nối với ${req.name}. Thông báo phản hồi đã được gửi tới đối tác.`
          );
        }}
      />

      {/* Global Persistent Draggable Floating AI Orb */}
      <DraggableFloatingAiOrb
        visible={isAuthenticated && !aiAssistantVisible}
        onPress={() => setAiAssistantVisible(true)}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
