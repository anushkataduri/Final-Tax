import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useApplicationStore } from "@/store/applicationStore";
import { applicationService } from "@/modules/applications/services/applicationService";
import type { Application } from "@/types/domain";
import { logger } from "@/core/logging/logger";
import { styles } from "@/styles/app/application/[id].styles";

import {
  ApplicationHeader,
  type DetailTab,
} from "@/components/screens/application/ApplicationHeader";
import { OverviewTab } from "@/components/screens/application/OverviewTab";
import { StatusTab } from "@/components/screens/application/StatusTab";
import { DocumentsTab } from "@/components/screens/application/DocumentsTab";
import { PaymentsTab } from "@/components/screens/application/PaymentsTab";
import { ChatTab } from "@/components/screens/application/ChatTab";
import { ApplicationBottomBar } from "@/components/screens/application/ApplicationBottomBar";
import { formatDisplayDate } from "@/components/screens/application/applicationDetailsUtils";
import { useApplicationDetails } from "./useApplicationDetails";

export default function ApplicationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const applications = useApplicationStore((state) => state.applications);
  const uploadDocument = useApplicationStore((state) => state.uploadDocument);
  const addChatMessage = useApplicationStore((state) => state.addChatMessage);
  const deleteApplication = useApplicationStore((state) => state.deleteApplication);

  const [remoteApp, setRemoteApp] = useState<Application | null>(null);
  const [isLoadingRemote, setIsLoadingRemote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("OVERVIEW");

  const app =
    applications.find((a) => a.id === id || a.formData?.arn === id) ||
    remoteApp;

  const details = useApplicationDetails(app!, activeTab);

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || !app) return;
    setChatInput("");
    setIsSendingChat(true);
    try {
      await addChatMessage(app.id, "user", text);
    } catch {
      // Handled in store
    } finally {
      setIsSendingChat(false);
    }
  };

  useEffect(() => {
    if (!app && id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingRemote(true);
      applicationService
        .getApplicationById(id)
        .then((fetched) => {
          if (fetched) setRemoteApp(fetched);
        })
        .finally(() => setIsLoadingRemote(false));
    }
  }, [id, app]);

  if (isLoadingRemote) {
    return (
      <View style={[styles.container, styles.loadingWrap, { paddingTop: insets.top + 20 }]}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading application details...</Text>
      </View>
    );
  }

  if (!app) {
    return (
      <View style={[styles.container, { backgroundColor: "#0A2346", paddingTop: insets.top + 20 }]}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />
        <View style={styles.topNavRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Not Found</Text>
          <View style={styles.navSpacer} />
        </View>
        <View style={styles.errorContent}>
          <Ionicons name="warning-outline" size={48} color="#EA580C" />
          <Text style={styles.errorText}>Application not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.actionBtnFilled}>
            <Text style={styles.actionBtnFilledText}>Return to Applications</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const {
    isGstAmendment, formData, displayId, assignedCA, isLoans,
    headerInfo, overviewRows, filingRows, estimateRows, registrationRows,
    paymentRows, timelineSteps, isPaid, totalAmount,
  } = details;

  const handleDocumentUpload = async (docName: string) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        uploadDocument(app.id, docName, res.assets[0].uri);
      }
    } catch (err) {
      logger.warn("[ApplicationDetail] Document picker cancelled or failed:", { appId: app.id, docName, error: err });
    }
  };

  const handleWithdraw = () => {
    deleteApplication(app.id);
    router.replace("/(main)/applications");
  };

  const handleReviewEdit = () => {
    router.push(`/service/gst-filing?appId=${app.id}&step=2`);
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />

      <ApplicationHeader
        topInset={insets.top}
        navTitle={headerInfo.nav}
        displayId={displayId}
        serviceTitle={headerInfo.title}
        serviceSubtitle={headerInfo.sub}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoans={isLoans}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "OVERVIEW" && (
          <OverviewTab
            isGstAmendment={isGstAmendment}
            displayId={displayId}
            appliedDate={details.appliedDate}
            formData={formData}
            overviewRows={overviewRows}
            assignedCA={assignedCA}
            isLoans={isLoans}
            onChatPress={() => setActiveTab("CHAT")}
            filingRows={filingRows}
            estimateRows={estimateRows}
            registrationRows={registrationRows}
            appId={app.id}
            onReviewEdit={handleReviewEdit}
            onSupportTicket={() => router.push("/chat/support")}
          />
        )}

        {activeTab === "STATUS" && (
          <StatusTab
            timelineSteps={timelineSteps}
            assignedCA={assignedCA}
            onChatPress={() => setActiveTab("CHAT")}
            onWithdraw={handleWithdraw}
          />
        )}

        {activeTab === "DOCUMENTS" && (
          <DocumentsTab
            isGstAmendment={isGstAmendment}
            formData={formData}
            documents={app.documents}
            onUploadDocument={handleDocumentUpload}
          />
        )}

        {activeTab === "PAYMENTS" && (
          <PaymentsTab
            paymentRows={paymentRows}
            isGstAmendment={isGstAmendment}
            isPaid={isPaid}
            totalAmount={totalAmount}
            paymentStatus={app.paymentStatus}
          />
        )}

        {activeTab === "CHAT" && (
          <ChatTab
            chatHistory={app.chatHistory}
            assignedCA={assignedCA}
            formatDisplayDate={formatDisplayDate}
          />
        )}
      </ScrollView>

      <ApplicationBottomBar
        activeTab={activeTab}
        bottomInset={insets.bottom}
        assignedCA={assignedCA}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingChat={isSendingChat}
        onSendMessage={handleSendMessage}
        isLoans={isLoans}
        onOpenChat={() => setActiveTab("CHAT")}
      />
    </View>
  );
}
