import { StyleSheet } from "react-native";
import { BrandColors, Colors, Typography, Spacing, BorderRadius } from "../../../../shared/theme";

export const amountInputColors = {
  placeholder: BrandColors.TEXT_MUTED,
} as const;

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_PRIMARY,
    marginBottom: Spacing.sm,
  },
  requiredStar: {
    color: Colors.error,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BrandColors.BORDER,
    borderRadius: BorderRadius.sm,
    backgroundColor: BrandColors.WHITE,
    paddingHorizontal: Spacing.md,
  },
  inputRowError: {
    borderColor: Colors.error,
  },
  currencySymbol: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_SECONDARY,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_PRIMARY,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.BACKGROUND,
  },
  chipActive: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: BrandColors.TEXT_SECONDARY,
  },
  chipTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: Typography.fontWeight.bold,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
