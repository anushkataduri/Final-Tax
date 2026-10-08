import { StyleSheet, ViewStyle } from "react-native";
import { SCREEN_BOTTOM_PADDING } from "../../../../components/ScreenLayout";
import { Spacing } from "../../../../shared/theme";

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SCREEN_BOTTOM_PADDING + Spacing.base + 100, // Added 100px to clear the custom bottom navigation bar
  },
  responsiveContainer: {
    paddingHorizontal: 16,
    width: "100%",
  },
});

export const getScrollContentBottomPadding = (bottomInset: number): ViewStyle => ({
  paddingBottom: SCREEN_BOTTOM_PADDING + Spacing.base + bottomInset,
});
