import { StyleSheet, Dimensions } from "react-native";
import { BrandColors, BorderRadius, BorderWidth, Spacing, Typography } from "@/shared/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* Blue Hero Header matching Home */
  heroHeader: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: "#083B75",
  },
  topHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 26,
    height: 26,
  },
  brandText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.extraBold,
    letterSpacing: 1,
  },
  brandSubText: {
    color: "#B9CBE4",
    fontSize: 9,
    fontWeight: Typography.fontWeight.semiBold,
    letterSpacing: 0.8,
  },
  screenTitle: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: BrandColors.WHITE,
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },

  /* Content Scroll */
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },

  /* Page Title & Subtitle */
  pageHeading: {
    marginBottom: Spacing.base,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: Typography.fontWeight.extraBold,
    color: "#0B2545",
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 20,
  },

  /* Overview Card */
  overviewCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.base,
  },
  overviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: Spacing.base,
  },
  overviewIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  overviewTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statColDivider: {
    borderLeftWidth: BorderWidth.thin,
    borderLeftColor: "#E2E8F0",
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.extraBold,
    color: "#0B2545",
  },

  /* No Payments Yet Card (Image 1 reference) */
  emptyDuesCard: {
    backgroundColor: "#FFFBF7",
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#FDE6D2",
    marginBottom: Spacing.lg,
  },
  emptyDuesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  receiptIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF0E6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDuesTextCol: {
    flex: 1,
  },
  emptyDuesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
    marginBottom: 4,
  },
  emptyDuesSubtitle: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: Spacing.sm + 2,
  },
  exploreServicesBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: "#0B2545",
    backgroundColor: BrandColors.WHITE,
  },
  exploreServicesBtnText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B2545",
  },

  /* Pending Application Payment Cards */
  pendingSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B2545",
  },
  pendingCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#FED7AA",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pendingCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  pendingServiceName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
    flex: 1,
  },
  dueBadge: {
    backgroundColor: "#FEF0E6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dueBadgeText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: "#EA580C",
  },
  pendingAppId: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginBottom: Spacing.sm,
  },
  pendingCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: BorderWidth.thin,
    borderTopColor: "#F1F5F9",
    paddingTop: Spacing.sm,
  },
  pendingAmountLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  pendingAmountValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extraBold,
    color: "#EA580C",
  },
  payNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FF5722",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  payNowBtnText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },

  /* Payment Activity */
  activitySection: {
    marginBottom: Spacing.lg,
  },
  emptyActivityBox: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    paddingVertical: 32,
    paddingHorizontal: Spacing.base,
    alignItems: "center",
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    marginTop: Spacing.sm,
  },
  emptyActivityIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm + 4,
  },
  emptyActivityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
    marginBottom: 4,
  },
  emptyActivitySubtitle: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#64748B",
    textAlign: "center",
  },

  /* Activity item */
  activityCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityLeft: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 11,
    color: "#64748B",
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#059669",
    marginBottom: 2,
  },
  activityStatus: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#059669",
  },

  /* Quick Links */
  quickLinksSection: {
    marginBottom: Spacing.lg,
  },
  quickLinksCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.lg,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  quickLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    gap: Spacing.md,
  },
  quickLinkIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#0F172A",
  },
  quickLinkDivider: {
    height: BorderWidth.thin,
    backgroundColor: "#F1F5F9",
    marginLeft: 64,
  },
});
