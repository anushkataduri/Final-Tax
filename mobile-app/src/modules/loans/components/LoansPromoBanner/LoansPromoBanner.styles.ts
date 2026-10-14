import { StyleSheet } from "react-native";
import { BorderRadius, BrandColors, Shadows, Spacing, Typography } from "@/shared/theme";

export const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 120,
    overflow: "hidden",
    ...Shadows.md,
  },
  textCol: { flex: 1.2 },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.extraBold,
    color: BrandColors.PRIMARY_BLUE,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: BrandColors.TEXT_SECONDARY,
  },
  art: {
    flex: 1,
    height: 96,
  },
  chartIcon: { position: "absolute", top: 0, right: 8 },
  homeIcon: { position: "absolute", bottom: 4, right: 0 },
  carIcon: { position: "absolute", bottom: 0, left: 0 },
});
