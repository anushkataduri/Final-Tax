import { StyleSheet } from "react-native";
import { BorderRadius, BrandColors, Spacing, Typography } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.PRIMARY_LIGHT_BLUE,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  textCol: { flex: 1 },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.PRIMARY_BLUE,
  },
  body: {
    marginTop: 2,
    fontSize: Typography.fontSize.sm,
    color: BrandColors.TEXT_SECONDARY,
    lineHeight: 17,
  },
});
