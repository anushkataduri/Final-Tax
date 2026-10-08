import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";

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
  navTitle: string;
  displayId: string;
  serviceTitle: string;
  serviceSubtitle: string;
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
  isLoans: boolean;
  onBack: () => void;
}

export function ApplicationHeader({
  topInset,
  navTitle,
  displayId,
  serviceTitle,
  serviceSubtitle,
  activeTab,
  setActiveTab,
  isLoans,
  onBack,
}: ApplicationHeaderProps) {
  return (
    <>
      {/* ---------------- ROYAL NAVY HEADER ---------------- */}
      <View style={[styles.navyHeader, { paddingTop: topInset + 8 }]}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{navTitle}</Text>
          <View style={styles.navSpacer} />
        </View>

        <View style={styles.headerTextWrap}>
          <Text style={styles.appIdLabel}>{`APPLICATION #${displayId}`}</Text>
          <Text style={styles.serviceTitle}>{serviceTitle}</Text>
          <Text style={styles.serviceSubtitle}>{serviceSubtitle}</Text>
        </View>
      </View>

      {/* ---------------- 5 HORIZONTAL TABS ROW ---------------- */}
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
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tabItem}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? "#FF5722" : "#0A2346",
                      fontWeight: isActive ? "700" : "600",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tab.id === "CHAT" && isLoans
                    ? "Chat with Loan Agent"
                    : tab.label}
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
