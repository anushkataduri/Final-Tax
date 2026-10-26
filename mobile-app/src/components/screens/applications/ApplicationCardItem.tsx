import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Application } from "@/types/domain";
import { styles } from "@/styles/app/(main)/applications.styles";
import { ApplicationCardAvatar } from "./ApplicationIcons";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "";
  if (MONTH_NAMES.some((m) => dateStr.includes(m))) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

interface StatusBadgeConfig {
  matcher: (lower: string) => boolean;
  bg: string;
  text: string;
  label: string;
}

const STATUS_CONFIGS: StatusBadgeConfig[] = [
  {
    matcher: (s) =>
      s.includes("complete") ||
      s.includes("disbursed") ||
      s.includes("active") ||
      s.includes("approved"),
    bg: "#DCFCE7",
    text: "#16A34A",
    label: "Completed",
  },
  {
    matcher: (s) => s.includes("submit"),
    bg: "#DCFCE7",
    text: "#16A34A",
    label: "Submitted",
  },
  {
    matcher: (s) => s.includes("progress") || s.includes("process"),
    bg: "#FFEDD5",
    text: "#EA580C",
    label: "In Progress",
  },
  {
    matcher: (s) => s.includes("verification") || s.includes("review"),
    bg: "#E0F2FE",
    text: "#0284C7",
    label: "Under Verification",
  },
];

export function getStatusBadgeStyle(status?: string) {
  const lower = (status || "").toLowerCase();
  const matched = STATUS_CONFIGS.find((cfg) => cfg.matcher(lower));
  return (
    matched ?? {
      bg: "#EFF6FF",
      text: "#083B75",
      label: status || "Submitted",
    }
  );
}

interface ApplicationCardItemProps {
  item: Application;
  isDark: boolean;
  textColor: string;
  borderColor: string;
  bgColor: string;
  onPress: (item: Application) => void;
}

export function ApplicationCardItem({
  item,
  isDark,
  textColor,
  borderColor,
  bgColor,
  onPress,
}: ApplicationCardItemProps) {
  const badge = getStatusBadgeStyle(item.status);
  const isDraft = item.status === "Draft" || Boolean(item.formData?.isDraft);

  const displayId =
    (item.formData?.arn ? String(item.formData.arn) : null) ||
    (item.formData?.applicationId ? String(item.formData.applicationId) : null) ||
    item.id;

  const displayName =
    item.serviceId === "gst-cancellation"
      ? "GST Cancellation (REG-16)"
      : item.serviceId === "gst-amendment" && item.formData?.section
        ? `GST Amendment — ${item.formData.section}`
        : item.serviceName || "TaxEdge Service";

  const formattedDate = formatDisplayDate(
    item.formData?.submissionDate || item.formData?.appliedDate || item.createdAt
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={[
        styles.appCard,
        {
          backgroundColor: bgColor,
          borderColor,
        },
      ]}
    >
      <ApplicationCardAvatar
        category={item.category}
        serviceId={item.serviceId}
        serviceName={item.serviceName}
      />

      <View style={styles.cardContent}>
        <Text
          style={[styles.serviceNameText, { color: textColor }]}
          numberOfLines={1}
        >
          {displayName}
        </Text>

        <Text style={styles.appIdText} numberOfLines={1}>
          {displayId}
        </Text>

        {formattedDate ? (
          <Text style={styles.dateText}>{formattedDate}</Text>
        ) : null}
      </View>

      <View style={styles.cardRightColumn}>
        <View style={styles.cardBadgeWithArrow}>
          {isDraft ? (
            <View style={styles.resumeBadge}>
              <Text style={styles.resumeBadgeText}>Draft</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                {badge.label}
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94A3B8"
            style={styles.cardChevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
