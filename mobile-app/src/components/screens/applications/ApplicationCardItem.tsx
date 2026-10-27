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
  if (!dateStr || typeof dateStr !== "string") return "";
  const trimmed = dateStr.trim();
  if (!trimmed) return "";
  if (MONTH_NAMES.some((m) => trimmed.includes(m))) return trimmed;
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = match[1];
    const monthIdx = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const month = MONTH_NAMES[monthIdx];
    if (month) {
      return `${day} ${month} ${year}`;
    }
  }
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch {
    // fallback
  }
  return trimmed;
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
      s.includes("approved") ||
      s.includes("sanctioned") ||
      s.includes("closed"),
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
    matcher: (s) =>
      s.includes("verification") || s.includes("review") || s.includes("scrutiny"),
    bg: "#E0F2FE",
    text: "#0284C7",
    label: "Under Verification",
  },
  {
    matcher: (s) => s.includes("progress") || s.includes("process"),
    bg: "#FFEDD5",
    text: "#EA580C",
    label: "In Progress",
  },
  {
    matcher: (s) => s.includes("reject") || s.includes("fail") || s.includes("cancel"),
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Rejected",
  },
];

export function getStatusBadgeStyle(status?: string) {
  if (!status || !status.trim()) {
    return {
      bg: "#DCFCE7",
      text: "#16A34A",
      label: "Submitted",
    };
  }
  const lower = status.trim().toLowerCase();
  const matched = STATUS_CONFIGS.find((cfg) => cfg.matcher(lower));
  return (
    matched ?? {
      bg: "#EFF6FF",
      text: "#083B75",
      label: status,
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

  const displayName =
    item.serviceId === "gst-cancellation"
      ? "GST Cancellation (REG-16)"
      : item.serviceId === "gst-amendment" && item.formData?.section
        ? `GST Amendment — ${item.formData.section}`
        : item.serviceId === "gst-compliance" &&
            item.formData?.requestType &&
            !item.serviceName?.includes(item.formData.requestType)
          ? `GST Compliance — ${item.formData.requestType}`
          : item.serviceName || "TaxEdge Service";

  const rawDate =
    item.formData?.submissionDate ||
    item.formData?.appliedDate ||
    item.createdAt ||
    "";
  const formattedDate = formatDisplayDate(rawDate);

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
        <Text style={[styles.serviceNameText, { color: textColor }]}>
          {displayName}
        </Text>

        {formattedDate ? (
          <Text style={[styles.appliedDateText, isDark && styles.appliedDateTextDark]}>
            {formattedDate}
          </Text>
        ) : null}

        <View style={styles.cardBadgeRow}>
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
        </View>
      </View>

      <View style={styles.cardChevronWrap}>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#94A3B8"
          style={styles.cardChevron}
        />
      </View>
    </TouchableOpacity>
  );
}
