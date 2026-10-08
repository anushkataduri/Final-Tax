import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: BrandColors.WHITE,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
  },
  saveDraftButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  saveDraftText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#475569",
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
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: "#475569",
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: BrandColors.PRIMARY_BLUE,
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
    color: BrandColors.WHITE,
  },
});
