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
import { useApplicationStore } from "@/store/applicationStore";
import { applicationService } from "@/modules/applications/services/applicationService";
import type { Application, TimelineStep } from "@/types/domain";
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
import {
  formatDisplayDate,
  calculateExpectedDate,
  getServiceSpecificTimeline,
} from "@/components/screens/application/applicationDetailsUtils";
import { formatAmendmentSubmissionDate } from "@/modules/gst/gst-amendment/utils/gstAmendmentHelpers";

export default function ApplicationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const applications = useApplicationStore((state) => state.applications);
  const addChatMessage = useApplicationStore((state) => state.addChatMessage);

  const [remoteApp, setRemoteApp] = useState<Application | null>(null);
  const [isLoadingRemote, setIsLoadingRemote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("OVERVIEW");

  const app =
    applications.find(
      (a) =>
        a.id === id ||
        a.formData?.arn === id ||
        a.formData?.gstId === id ||
        a.formData?.applicationId === id
    ) || remoteApp;

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
      <View
        style={[
          styles.container,
          styles.loadingWrap,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading application details...</Text>
      </View>
    );
  }

  if (!app) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: "#0A2346", paddingTop: insets.top + 20 },
        ]}
      >
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Not Found</Text>
          <View style={styles.navSpacer} />
        </View>
        <View style={styles.errorContent}>
          <Ionicons name="warning-outline" size={48} color="#EA580C" />
          <Text style={styles.errorText}>Application not found.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.actionBtnFilled}
          >
            <Text style={styles.actionBtnFilledText}>
              Return to Applications
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Derived Application Metadata ──────────────────────────────────────────

  const isGstAmendment = app.serviceId === "gst-amendment";
  const formData = (app.formData || {}) as Record<string, any>;
  const isLoans =
    app.category === "LOANS" ||
    (app.serviceId || "").startsWith("loan") ||
    app.serviceId === "machinery-loan";

  const displayId =
    (isGstAmendment && formData.arn ? String(formData.arn) : null) ||
    formData.applicationId ||
    app.id;

  const displayName =
    isGstAmendment && formData.section
      ? `GST Amendment — ${formData.section}`
      : app.serviceName;

  const appliedDate =
    (formData.submissionDate ? formatAmendmentSubmissionDate(formData.submissionDate) : null) ||
    formData.appliedDate ||
    formatDisplayDate(app.createdAt);

  const assignedCA =
    app.assignedExecutive && app.assignedExecutive.trim() !== ""
      ? app.assignedExecutive.trim()
      : isLoans
        ? "Loan Processing Officer"
        : "CA not assigned yet";

  const expectedDate = calculateExpectedDate(app.createdAt);

  const timelineSteps: TimelineStep[] =
    app.timeline && app.timeline.length > 0
      ? app.timeline
      : getServiceSpecificTimeline(app, appliedDate);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />

      {/* Header and horizontal tabs (Screens 2–6 Reference) */}
      <ApplicationHeader
        topInset={insets.top}
        serviceId={app.serviceId || ""}
        serviceName={displayName}
        category={app.category}
        displayId={displayId}
        submittedOnText={appliedDate}
        status={app.status || "Submitted"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBack={() => router.back()}
      />

      {/* Main Tab Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "OVERVIEW" && (
          <OverviewTab
            app={app}
            displayId={displayId}
            appliedDate={appliedDate}
          />
        )}

        {activeTab === "STATUS" && (
          <StatusTab
            timelineSteps={timelineSteps}
            currentStatus={app.status || "Submitted"}
          />
        )}

        {activeTab === "DOCUMENTS" && (
          <DocumentsTab
            isGstAmendment={isGstAmendment}
            formData={formData}
            documents={app.documents}
            appliedDate={appliedDate}
          />
        )}

        {activeTab === "PAYMENTS" && (
          <PaymentsTab
            app={app}
            isGstAmendment={isGstAmendment}
            appliedDate={appliedDate}
          />
        )}

        {activeTab === "CHAT" && (
          <ChatTab
            chatHistory={app.chatHistory}
            assignedCA={assignedCA}
            isLoans={isLoans}
            appliedDate={appliedDate}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isSendingChat={isSendingChat}
            onSendMessage={handleSendMessage}
            formatDisplayDate={formatDisplayDate}
          />
        )}
      </ScrollView>
    </View>
  );
}
