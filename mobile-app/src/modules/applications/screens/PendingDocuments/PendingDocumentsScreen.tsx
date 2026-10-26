import React, { useMemo } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { DocumentChecklist } from "../../../../shared/components/DocumentUploader/DocumentChecklist";
import { useApplicationStore } from "@/store/applicationStore";
import { BrandColors } from "../../../../shared/theme";
import type { ApplicationDocument } from "../../../../shared/types/domain";
import { styles } from "./PendingDocumentsScreen.styles";

export const PendingDocumentsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ appId?: string }>();
  const applications = useApplicationStore((s) => s.applications);
  const uploadDocument = useApplicationStore((s) => s.uploadDocument);

  const targetApp = useMemo(() => {
    if (!params.appId) return null;
    return applications.find((a) => a.id === params.appId) || null;
  }, [applications, params.appId]);

  // Aggregate pending documents from the target app or all applications
  const pendingItems = useMemo(() => {
    if (targetApp) {
      return targetApp.documents
        .filter((d) => d.status === "Pending")
        .map((doc) => ({
          ...doc,
          appId: targetApp.id,
          serviceName: targetApp.serviceName,
        }));
    }

    const allPending: Array<ApplicationDocument & { appId: string; serviceName: string }> = [];
    for (const app of applications) {
      if (app.status === "Draft") continue; // drafts handled in their own wizard
      for (const doc of app.documents) {
        if (doc.status === "Pending") {
          allPending.push({
            ...doc,
            appId: app.id,
            serviceName: app.serviceName,
          });
        }
      }
    }
    return allPending;
  }, [applications, targetApp]);

  const handleUpload = (docName: string, fileUri: string) => {
    const item = pendingItems.find((d) => d.name === docName);
    const appId = item?.appId || targetApp?.id;
    if (appId) {
      uploadDocument(appId, docName, fileUri);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={targetApp ? `${targetApp.serviceName} - Documents` : "Pending Documents"}
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(main)/applications");
          }
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {pendingItems.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 48, paddingHorizontal: 24 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#ECFDF5",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="checkmark-done-circle" size={36} color="#059669" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0F172A", textAlign: "center" }}>
              All Documents Uploaded
            </Text>
            <Text style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 8, lineHeight: 20 }}>
              There are no pending documents requiring your action at this time.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace("/(main)/applications")}
              style={{
                marginTop: 24,
                backgroundColor: BrandColors.PRIMARY_BLUE,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 14 }}>
                View My Applications
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <DocumentChecklist
            documents={pendingItems}
            onUpload={handleUpload}
            grouped={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default PendingDocumentsScreen;
