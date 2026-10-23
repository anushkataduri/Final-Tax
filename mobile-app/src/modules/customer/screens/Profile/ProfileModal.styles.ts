import { StyleSheet } from "react-native";
import {
  BrandColors,
  BorderRadius,
  BorderWidth,
  Spacing,
  Typography,
} from "@/shared/theme";

export const modalStyles = StyleSheet.create({
  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,39,80,0.45)",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  modalContainer: {
    borderRadius: 18,
    padding: Spacing.base,
    maxHeight: "85%",
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extraBold,
    marginBottom: 6,
  },
  modalBody: {
    paddingVertical: Spacing.sm,
  },
  modalScroll: {
    flexGrow: 0,
  },
  readOnlyNote: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.sm,
  },
  editField: {
    marginBottom: Spacing.sm,
  },
  editLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: 5,
  },
  editInput: {
    minHeight: 44,
    borderWidth: BorderWidth.thin,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: Typography.fontSize.base,
    backgroundColor: BrandColors.WHITE,
  },
  fieldError: {
    color: "#DC2626",
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
  },
  formError: {
    color: "#DC2626",
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  personalActions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelEditButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelEditText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  saveEditButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveEditText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  modalNote: {
    fontSize: Typography.fontSize.xs - 0.5,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 17,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.base,
    paddingVertical: 9,
  },
  infoKey: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.medium,
  },
  infoValue: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "right",
  },
  statusLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusLabelText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.extraBold,
  },
  fetchingContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  fetchingText: {
    marginTop: 12,
    fontSize: 13,
  },
  profileScrollContent: {
    paddingBottom: 0,
  },

  /* Incomplete Profile Banner */
  completeProfileBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    borderWidth: BorderWidth.thin,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerHeaderText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 3,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSize.xs + 0.5,
    lineHeight: 18,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  bannerBtnText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },

  /* Incomplete Profile Modal View */
  incompleteModalBox: {
    width: "100%",
    alignItems: "center",
    paddingTop: Spacing.xs,
    paddingBottom: 0,
  },
  incompleteIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  incompleteTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
    textAlign: "center",
  },
  incompleteSubtitle: {
    fontSize: Typography.fontSize.xs + 1,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  /* Progress Bar for Incomplete Profile */
  progressContainer: {
    width: "100%",
    marginBottom: Spacing.sm,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  progressPercent: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  incompleteCard: {
    width: "100%",
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  incompleteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F5F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#059669",
    fontWeight: Typography.fontWeight.bold,
  },
  pendingBadge: {
    backgroundColor: "#FEF0E6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pendingText: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#EA580C",
    fontWeight: Typography.fontWeight.bold,
  },
  modalActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
  },
  completeActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  completeActionBtnText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
  },
});
