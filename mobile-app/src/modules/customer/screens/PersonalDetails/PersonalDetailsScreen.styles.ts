import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { SCREEN_BOTTOM_PADDING } from "../../../../shared/components/ScreenLayout/ScreenLayout";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: SCREEN_BOTTOM_PADDING,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  infoKey: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export const getCardThemedStyle = (bg: string, border: string): ViewStyle => ({
  backgroundColor: bg,
  borderColor: border,
});

export const getInfoKeyThemedStyle = (color: string): TextStyle => ({
  color,
});

export const getInfoValueThemedStyle = (color: string): TextStyle => ({
  color,
});
