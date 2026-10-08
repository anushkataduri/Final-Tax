import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  nextButton: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  nextButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
