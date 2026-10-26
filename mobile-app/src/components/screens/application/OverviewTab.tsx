import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { Application } from "@/types/domain";
import { resolveSubmittedDataRows } from "./overviewDataResolver";
import { getStatusBadgeStyle } from "@/components/screens/applications/ApplicationCardItem";

interface OverviewTabProps {
  app: Application;
  displayId: string;
  appliedDate: string;
}

export function OverviewTab({
  app,
  displayId,
  appliedDate,
}: OverviewTabProps) {
  // 1. Resolve submitted user details (real values from GST, ITR, Loans, Business)
  const submittedRows = resolveSubmittedDataRows(app);
  const statusBadge = getStatusBadgeStyle(app.status);

  // 2. Fixed Application Details rows matching Screen 2 reference
  const applicationDetailsRows = [
    {
      label: "Service",
      value: app.serviceName,
      icon: "document-text-outline" as const,
    },
    {
      label: "Application ID",
      value: displayId,
      icon: "person-outline" as const,
    },
    {
      label: "Submission Date",
      value: appliedDate,
      icon: "calendar-outline" as const,
    },
    {
      label: "Status",
      value: app.status || "Submitted",
      icon: "shield-checkmark-outline" as const,
      isStatus: true,
    },
  ];

  return (
    <>
      {/* ── Screen Heading: Overview ── */}
      <Text style={styles.screenHeading}>Overview</Text>

      {/* ── 1. Application Details Card (Screen 2 Reference) ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Application Details</Text>
        <View style={styles.cardRowsGap12}>
          {applicationDetailsRows.map((row) => (
            <View key={row.label} style={styles.itemRow}>
              <View style={styles.itemRowLeft}>
                <View style={styles.itemRowIconWrap}>
                  <Ionicons name={row.icon} size={15} color="#475569" />
                </View>
                <Text style={styles.itemRowLabel}>{row.label}</Text>
              </View>
              <Text
                style={[
                  styles.itemRowValue,
                  row.isStatus ? { color: statusBadge.text } : null,
                ]}
                numberOfLines={1}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── 2. Your Submitted Details Card (Screen 2 Reference) ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Submitted Details</Text>
        <Text style={styles.cardSubtitle}>
          Below are the details you filled during the application.
        </Text>
        <View style={styles.cardRowsGap12}>
          {submittedRows.length > 0 ? (
            submittedRows.map((row) => (
              <View key={row.label} style={styles.itemRow}>
                <View style={styles.itemRowLeft}>
                  <View style={styles.itemRowIconWrap}>
                    <Ionicons
                      name={(row.icon || "document-text-outline") as any}
                      size={15}
                      color="#475569"
                    />
                  </View>
                  <Text style={styles.itemRowLabel}>{row.label}</Text>
                </View>
                <Text style={styles.itemRowValue} numberOfLines={1}>
                  {row.value}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.cardSubtitle, { marginBottom: 0 }]}>
              No specific form fields recorded for this service.
            </Text>
          )}
        </View>
      </View>

      {/* ── 3. View-Only Info Banner (Screen 2 Reference) ── */}
      <View style={styles.infoNoteCard}>
        <Ionicons name="information-circle-outline" size={18} color="#0284C7" />
        <Text style={styles.infoNoteText}>
          This is a view-only summary of your submitted data.
        </Text>
      </View>
    </>
  );
}
