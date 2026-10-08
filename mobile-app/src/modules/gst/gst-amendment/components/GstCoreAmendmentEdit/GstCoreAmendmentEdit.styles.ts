import { StyleSheet } from "react-native";
import { BrandColors, BorderRadius, Spacing, Typography } from "@/shared/theme";

export const getHeaderBarStyle = (topInset: number) => ({
  paddingTop: Math.max(topInset, 16),
});

export const getBottomBarStyle = (bottomInset: number) => ({
  paddingBottom: Math.max(bottomInset + 12, 20),
});

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  roundBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF1FE",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 14,
  },
  headerMainTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  placeholderBox: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 40,
  },
  editContainer: {
    gap: 18,
    marginTop: 4,
  },
  currentRegisteredCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  currentRegisteredHeader: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "800",
    color: "#0F172A",
  },
  currentRegisteredSubtitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "500",
    color: "#64748B",
  },
  currentFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 4,
  },
  currentFieldLabel: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  currentFieldValue: {
    fontSize: Typography.fontSize.sm + 0.5,
    color: "#0F172A",
    fontWeight: "700",
    flex: 1.5,
    textAlign: "right",
  },
  formSectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
    marginBottom: -6,
  },
  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: Spacing.base,
    paddingTop: 12,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    borderRadius: BorderRadius.base,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
