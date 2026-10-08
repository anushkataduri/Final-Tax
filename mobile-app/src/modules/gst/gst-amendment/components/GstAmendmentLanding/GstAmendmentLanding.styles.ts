import { StyleSheet } from "react-native";
import { BrandColors, BorderRadius, Spacing, Typography } from "@/shared/theme";

export const getHeaderBarStyle = (topInset: number) => ({
  paddingTop: Math.max(topInset, 16),
});

export const getCardIconBoxStyle = (color: string) => ({
  backgroundColor: `${color}15`,
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
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EAF1FE",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 14,
    marginTop: 12,
    marginBottom: 18,
  },
  infoIconBox: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 0.5,
    lineHeight: 20,
    color: "#083B75",
    fontWeight: "500",
  },
  gstinBlock: {
    marginBottom: 20,
  },
  gstinLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  star: {
    color: "#EF4444",
  },
  gstinInput: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#EF4444",
    fontWeight: "600",
    marginTop: 6,
  },
  sectionGroupTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
    marginTop: 8,
  },
  sectionGroupSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 14,
  },
  cardGroup: {
    gap: 12,
    marginBottom: 24,
  },
  amendmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 16,
  },
  cardBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  cardBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
  },
  coreBadge: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FDBA74",
  },
  coreBadgeText: {
    color: BrandColors.PRIMARY_ORANGE,
  },
  nonCoreBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  nonCoreBadgeText: {
    color: BrandColors.PRIMARY_BLUE,
  },
});
