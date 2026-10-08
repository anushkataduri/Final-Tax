import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { SCREEN_BOTTOM_PADDING } from "../../../../shared/components/ScreenLayout/ScreenLayout";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: SCREEN_BOTTOM_PADDING,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoKey: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
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

export const getStatusTextThemedStyle = (color: string): TextStyle => ({
  color,
});
