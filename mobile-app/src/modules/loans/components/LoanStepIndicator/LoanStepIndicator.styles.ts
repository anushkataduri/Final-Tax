import { StyleSheet, type ViewStyle } from "react-native";
import { BrandColors, Typography, Spacing } from "../../../../shared/theme";

const NAVY = "#0B1F3A";
const COMPLETED_GREEN = "#16A34A";
const NEUTRAL_BORDER = "#CBD5E1";

export const stepIndicatorColors = {
  backIcon: NAVY,
  settingsIcon: BrandColors.TEXT_SECONDARY,
  completedIcon: BrandColors.WHITE,
} as const;

export const styles = StyleSheet.create({
  // ── Linear variant ────────────────────────────────────────────────────
  linearContainer: {
    backgroundColor: BrandColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.CARD_BORDER,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BrandColors.BACKGROUND,
    borderWidth: 1,
    borderColor: BrandColors.BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  titleCenter: {
    alignItems: "center",
  },
  mainTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: NAVY,
  },
  subTitle: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: Typography.fontWeight.medium,
    marginTop: 2,
  },
  rightSpacer: {
    width: 40,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: BrandColors.BORDER,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: BrandColors.PRIMARY_ORANGE,
  },

  // ── Numbered variant ──────────────────────────────────────────────────
  numberedContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: BrandColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.CARD_BORDER,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BrandColors.CARD_BORDER,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: NEUTRAL_BORDER,
  },
  stepCircleActive: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    borderColor: BrandColors.PRIMARY_BLUE,
  },
  stepCircleCompleted: {
    backgroundColor: COMPLETED_GREEN,
    borderColor: COMPLETED_GREEN,
  },
  stepNumber: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.TEXT_SECONDARY,
  },
  stepNumberActive: {
    color: BrandColors.WHITE,
  },
  stepTitle: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.TEXT_SECONDARY,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
    textAlign: "center",
  },
  stepTitleActive: {
    color: BrandColors.PRIMARY_BLUE,
    fontWeight: Typography.fontWeight.bold,
  },
  stepLine: {
    position: "absolute",
    top: 14,
    left: "50%",
    right: "-50%",
    height: 2,
    backgroundColor: BrandColors.BORDER,
    zIndex: -1,
  },
  stepLineCompleted: {
    backgroundColor: COMPLETED_GREEN,
  },
});

/** Width of the linear progress fill; `percent` is clamped to 0–100. */
export const getProgressFillStyle = (percent: number): ViewStyle => ({
  width: `${Math.min(100, Math.max(0, percent))}%`,
});
