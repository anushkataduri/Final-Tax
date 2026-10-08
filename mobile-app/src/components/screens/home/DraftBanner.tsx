/**
 * DraftBanner
 * Re-usable card that shows an in-progress (draft) application.
 * Used for GST Registration, GST Filing, and ITR Filing drafts.
 *
 * All three banners share identical layout — only colours, labels,
 * and the resume route differ. Those are passed in as props.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import {
  styles,
  getDraftCardThemedStyle,
} from "@/styles/app/(main)/home.styles";

interface DraftBannerProps {
  /** The draft object — must have optional `updatedAt` and `stepIndex` */
  updatedAt?: string;
  stepIndex?: number;
  /** Total steps label (e.g. "4" or "5") */
  totalSteps: string;
  accentColor: string;
  lightBg: string;
  lightBorder: string;
  /** Text shown on the tag chip (e.g. "INCOMPLETE APPLICATION") */
  tagLabel: string;
  title: string;
  subtitle: string;
  /** Text on the resume link (e.g. "Resume Application") */
  resumeLabel: string;
  isDark: boolean;
  colors: ReturnType<typeof useTheme>;
  onPress: () => void;
}

export function DraftBanner({
  updatedAt,
  stepIndex = 0,
  totalSteps,
  accentColor,
  lightBg,
  lightBorder,
  tagLabel,
  title,
  subtitle,
  resumeLabel,
  isDark,
  colors,
  onPress,
}: DraftBannerProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.draftBannerCard,
        getDraftCardThemedStyle(isDark, colors, accentColor, lightBg, lightBorder),
      ]}
    >
      <View style={styles.draftTopRow}>
        <View style={[styles.draftTag, { backgroundColor: accentColor }]}>
          <Ionicons name="time" size={13} color="#FFFFFF" />
          <Text style={styles.draftTagText}>{tagLabel}</Text>
        </View>
        <Text style={[styles.draftSavedTime, { color: colors.textSecondary }]}>
          {updatedAt ? `Saved ${updatedAt}` : "Saved as Draft"}
        </Text>
      </View>

      <Text style={[styles.draftTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.draftSubtitle, { color: colors.textSecondary }]}>
        Step {stepIndex + 1} of {totalSteps} • {subtitle}
      </Text>

      <View
        style={[
          styles.draftFooter,
          { borderTopColor: isDark ? colors.border : lightBorder },
        ]}
      >
        <Text style={[styles.draftResumeText, { color: accentColor }]}>
          {resumeLabel}
        </Text>
        <Ionicons name="arrow-forward-circle" size={20} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
}
