import { BorderRadius, Spacing, Typography } from "@/shared/theme";

export const homeSheetStyles = {
  /* All services sheet */
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(5,39,80,0.45)",
    justifyContent: "flex-end" as const,
  },
  sheet: {
    height: "92%" as const,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingTop: 18,
  },
  sheetHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: Spacing.base - 2,
  },
  sheetTitle: {
    fontSize: Typography.fontSize.xxl - 1,
    fontWeight: Typography.fontWeight.extraBold,
  },
  sheetDone: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  sheetSearch: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.base - 2,
  },
  sheetSearchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    padding: 0,
  },
  sheetScrollContent: {
    paddingTop: 6,
    paddingBottom: Spacing.md,
  },

  /* Catalogue groups */
  catHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  catIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  catTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  serviceRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  serviceRowText: {
    fontSize: Typography.fontSize.md - 0.5,
    fontWeight: Typography.fontWeight.medium,
  },
  sheetEmpty: {
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 56,
  },
  sheetEmptyText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
};
