import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.WHITE,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BrandColors.WHITE,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnDisabled: {
    backgroundColor: "#FDBA74",
  },
  continueBtnText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
});
