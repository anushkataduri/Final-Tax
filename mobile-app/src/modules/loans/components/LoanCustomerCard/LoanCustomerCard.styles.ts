import { StyleSheet } from "react-native";
import { BrandColors, Typography, Spacing, BorderRadius } from "../../../../shared/theme";

const VERIFIED_GREEN = "#16A34A";

export const customerCardColors = {
  titleIcon: "#0284C7",
  verifiedIcon: VERIFIED_GREEN,
} as const;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: BrandColors.BORDER,
    marginBottom: Spacing.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.PRIMARY_BLUE,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  verifiedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: VERIFIED_GREEN,
  },
  infoBanner: {
    backgroundColor: BrandColors.BACKGROUND,
    borderRadius: BorderRadius.sm,
    padding: 10,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.PRIMARY_BLUE,
  },
  infoBannerText: {
    fontSize: Typography.fontSize.xs,
    color: "#475569",
    lineHeight: 16,
  },
  detailsGrid: {
    rowGap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.BACKGROUND,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: BrandColors.TEXT_SECONDARY,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: BrandColors.TEXT_PRIMARY,
    fontWeight: Typography.fontWeight.semiBold,
    flex: 1.5,
    textAlign: "right",
  },
});
