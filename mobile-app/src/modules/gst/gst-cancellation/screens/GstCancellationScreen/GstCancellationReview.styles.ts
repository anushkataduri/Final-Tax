import { StyleSheet } from "react-native";
import { BrandColors, Spacing } from "@/shared/theme";

const white = BrandColors.WHITE;

export const reviewStyles = StyleSheet.create({
  sectionCard: {
    backgroundColor: white,
    borderRadius: 16,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionMainTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  secondaryBtnDanger: {
    marginTop: 4,
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  secondaryBtnTextDanger: {
    color: "#EF4444",
  },
  successRowValPrimary: {
    color: BrandColors.PRIMARY_BLUE,
  },
  successRowValSuccess: {
    color: "#16A34A",
  },
  // Edit button used in Review screen
  reviewCardEditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1E8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  editOptionText: {
    fontSize: 12.5,
    fontWeight: "700" as const,
    color: BrandColors.PRIMARY_ORANGE,
  },
});
