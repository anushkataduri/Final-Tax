import { StyleSheet, Platform, ViewStyle } from "react-native";
import {
  BrandColors,
  BorderRadius,
  BorderWidth,
  Spacing,
  Typography,
} from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.BACKGROUND,
  },
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    backgroundColor: BrandColors.WHITE,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#E5E7EB",
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  headerTitleGroup: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B1F3A",
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.medium,
    color: "#0B1F3A",
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },

  // Celebration Card
  celebrationCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  badgeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    width: 140,
    height: 90,
  },
  confettiSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  successOuterCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  successInnerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  celebrationTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B1F3A",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  celebrationSubtitle: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.regular,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  referenceIdCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#CBD5E1",
    gap: Spacing.xs,
  },
  referenceIdLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  referenceIdValue: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B1F3A",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  // Unconfirmed / Missing Submission Alert Card
  unconfirmedCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#FECACA",
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  unconfirmedTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#991B1B",
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  unconfirmedDescription: {
    fontSize: Typography.fontSize.sm,
    color: "#7F1D1D",
    textAlign: "center",
    lineHeight: 18,
  },

  // Summary Card ("What we have")
  summaryCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: "#F1F5F9",
  },
  cardIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B1F3A",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: "#F1F5F9",
  },
  summaryRowNoBorder: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    fontWeight: Typography.fontWeight.medium,
  },
  summaryValue: {
    fontSize: Typography.fontSize.sm,
    color: "#0B1F3A",
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: "right",
    maxWidth: "60%",
  },

  // What happens next card
  nextStepsCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
  },
  nextStepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  nextStepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    marginTop: 7,
  },
  nextStepText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: "#475569",
    lineHeight: 20,
  },

  // Sticky Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BrandColors.WHITE,
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: "#F1F5F9",
    gap: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  primaryButton: {
    height: 50,
    borderRadius: BorderRadius.base - 2,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: BrandColors.PRIMARY_ORANGE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  primaryButtonText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.md + 0.5,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    height: 48,
    borderRadius: BorderRadius.base - 2,
    backgroundColor: BrandColors.WHITE,
    borderWidth: BorderWidth.regular,
    borderColor: "#0B1F3A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    color: "#0B1F3A",
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  tertiaryButton: {
    height: 46,
    borderRadius: BorderRadius.base - 2,
    backgroundColor: BrandColors.WHITE,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  tertiaryButtonText: {
    color: BrandColors.PRIMARY_ORANGE,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export const getContainerInsetsStyle = (topInset: number): ViewStyle => ({
  paddingTop: topInset,
});

export const getScrollContentInsetsStyle = (bottomInset: number, hasTertiaryCta = true): ViewStyle => ({
  paddingBottom: bottomInset + (hasTertiaryCta ? 190 : 135),
});

export const getBottomBarInsetsStyle = (bottomInset: number): ViewStyle => ({
  paddingBottom: Math.max(bottomInset, 12),
});
