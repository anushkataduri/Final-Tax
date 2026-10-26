import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { styles } from "@/styles/app/application/[id].styles";
import { ApplicationCardAvatar } from "@/components/screens/applications/ApplicationIcons";
import { getStatusBadgeStyle } from "@/components/screens/applications/ApplicationCardItem";
import type { ServiceCategoryId } from "@/types/domain";

export type DetailTab = "OVERVIEW" | "STATUS" | "DOCUMENTS" | "PAYMENTS" | "CHAT";

export const TABS: { id: DetailTab; label: string }[] = [
  { id: "OVERVIEW", label: "Overview" },
  { id: "STATUS", label: "Status" },
  { id: "DOCUMENTS", label: "Documents" },
  { id: "PAYMENTS", label: "Payments" },
  { id: "CHAT", label: "Chat with CA" },
];

interface ApplicationHeaderProps {
  topInset: number;
  serviceId: string;
  serviceName: string;
  category: ServiceCategoryId;
  displayId: string;
  submittedOnText: string;
  status: string;
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
  onBack: () => void;
}

export function ApplicationHeader({
  topInset,
  serviceId,
  serviceName,
  category,
  displayId,
  submittedOnText,
  status,
  activeTab,
  setActiveTab,
  onBack,
}: ApplicationHeaderProps) {
  const badge = getStatusBadgeStyle(status);

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync(displayId);
      Alert.alert("Copied", `Application ID ${displayId} copied to clipboard.`);
    } catch {
      // fallback
    }
  };

  return (
    <>
      {/* ── Deep Navy Top Bar (Screens 2–6 Reference) ── */}
      <View style={[styles.navyHeader, { paddingTop: topInset + 8 }]}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Application Details</Text>
          <View style={styles.navSpacer} />
        </View>
      </View>

      {/* ── Floating Shared Application Header Card (Screens 2–6 Reference) ── */}
      <View style={styles.sharedHeaderCardWrapper}>
        <View style={styles.sharedHeaderCard}>
          <ApplicationCardAvatar
            category={category}
            serviceId={serviceId}
            serviceName={serviceName}
          />

          <View style={styles.sharedHeaderContent}>
            <Text style={styles.sharedHeaderTitle} numberOfLines={1}>
              {serviceName}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyId}
              style={styles.sharedHeaderIdRow}
            >
              <Text style={styles.sharedHeaderIdText}>{displayId}</Text>
              <Ionicons name="copy-outline" size={13} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.sharedHeaderDateRow}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <View>
                <Text style={styles.sharedHeaderDateSub}>Submitted on</Text>
                <Text style={styles.sharedHeaderDateText}>
                  {submittedOnText || "22 Oct 2025, 11:45 AM"}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.sharedHeaderStatusPill, { backgroundColor: badge.bg }]}>
            <Text style={[styles.sharedHeaderStatusText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>
      </View>

      {/* ── 5 Horizontal Tabs (Screens 2–6 Reference) ── */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.75}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tabItem}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? "#EA580C" : "#64748B",
                      fontWeight: isActive ? "700" : "500",
                    },
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={
                    isActive
                      ? styles.activeTabIndicator
                      : styles.inactiveTabIndicator
                  }
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}
