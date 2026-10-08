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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BrandColors.WHITE,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
  },
  prevBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#0F172A",
    backgroundColor: BrandColors.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  prevBtnText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#0F172A",
  },
  continueBtn: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnFlex: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnDisabled: {
    backgroundColor: "#94A3B8",
  },
  continueBtnText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
});
