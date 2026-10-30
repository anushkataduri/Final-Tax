import { StyleSheet, Platform, ViewStyle, TextStyle } from "react-native";
import { SCREEN_BOTTOM_PADDING } from "../../../../shared/components/ScreenLayout/ScreenLayout";
import type { ThemeMode } from "../../../../design-system/theme/themeStore";
import type { ThemeColors } from "../../../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: SCREEN_BOTTOM_PADDING,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  themeHeaderRow: {
    marginBottom: 14,
  },
  segmentedContainer: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    gap: 6,
  },
  segmentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    position: "relative",
  },
  segmentOptionActive: {
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  segmentText: {
    fontSize: 14,
  },
  activeDot: {
    position: "absolute",
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  themeInfoFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(148, 163, 184, 0.2)",
  },
  themeInfoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  switchLabelGroup: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  subLabel: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  appInfoContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  backendStatusText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
});

export const getCardThemedStyle = (colors: ThemeColors): ViewStyle => ({
  backgroundColor: colors.backgroundElement,
  borderColor: colors.border,
});

export const getSegmentContainerStyle = (theme: ThemeMode, colors: ThemeColors): ViewStyle => ({
  backgroundColor: theme === "dark" ? "#0F172A" : "#F1F5F9",
  borderColor: colors.border,
});

export const getSegmentOptionActiveStyle = (mode: ThemeMode, isSelected: boolean): ViewStyle | null => {
  if (!isSelected) return null;
  if (mode === "light") {
    return {
      backgroundColor: "#FFFFFF",
      borderColor: "#E2E8F0",
      shadowColor: "#083B75",
    };
  }
  return {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    shadowColor: "#000000",
  };
};

export const getSegmentTextStyle = (mode: ThemeMode, currentTheme: ThemeMode, colors: ThemeColors): TextStyle => ({
  color:
    currentTheme === mode
      ? mode === "light"
        ? "#083B75"
        : "#F8FAFC"
      : colors.textSecondary,
  fontWeight: currentTheme === mode ? "700" : "500",
});

export const getActiveDotStyle = (mode: ThemeMode): ViewStyle => ({
  backgroundColor: mode === "light" ? "#FF7A00" : "#38BDF8",
});

export const getLinkRowThemedStyle = (border: string): ViewStyle => ({
  borderTopColor: border,
});
