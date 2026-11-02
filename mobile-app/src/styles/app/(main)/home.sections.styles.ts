import { Platform } from "react-native";
import type { ThemeTokens } from "@/shared/constants/theme";
import {
  BrandColors,
  BorderRadius,
  Spacing,
  Typography,
} from "@/shared/theme";
import {
  CARD_WIDTH,
} from "./home.header.styles";

export const homeSectionStyles = {
  /* Generic card */
  card: {
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    paddingVertical: Spacing.base,
  },
  cardPadded: {
    paddingHorizontal: Spacing.base,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extraBold,
  },
  viewAllText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
  },

  /* Modern 3D Services Layout */
  servicesContainer: {
    gap: 12,
    marginBottom: Spacing.md,
  },
  servicesRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 12,
  },
  serviceCard2Col: {
    flex: 1,
    minHeight: 138,
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 12,
    justifyContent: "space-between" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  serviceCardFullWidth: {
    width: "100%" as const,
    minHeight: 114,
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  serviceCardContent2Col: {
    zIndex: 2,
    maxWidth: "58%" as const,
    justifyContent: "space-between" as const,
    flex: 1,
  },
  serviceCardContentFull: {
    zIndex: 2,
    maxWidth: "60%" as const,
  },
  serviceTitle: {
    fontSize: 15.5,
    fontWeight: "800" as const,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  serviceDesc: {
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 14.5,
    marginBottom: 10,
  },
  serviceArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  serviceIllustration2Col: {
    position: "absolute" as const,
    right: 0,
    bottom: 2,
    width: 78,
    height: 78,
    zIndex: 1,
  },
  serviceIllustrationFull: {
    position: "absolute" as const,
    right: 6,
    bottom: 2,
    width: 120,
    height: 88,
    zIndex: 1,
  },
  dotsRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 14,
  },
  pageDot: {
    borderRadius: 4,
  },

  /* List rows */
  emptyText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.medium,
    textAlign: "center" as const,
    paddingVertical: Spacing.md,
  },

  /* Stats grid */
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  statsCard: {
    width: (CARD_WIDTH - 12) / 2,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    padding: 14,
  },
  statsTop: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    justifyContent: "space-between" as const,
    gap: 8,
  },
  statsLabel: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: 16,
  },
  statsIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  statsNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.extraBold,
    marginTop: Spacing.md,
  },

  /* Recent application cards */
  appCard: {
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    padding: Spacing.base,
  },
  appCardTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: 10,
  },
  appId: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  statusPill: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    justifyContent: "center" as const,
  },
  statusPillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  appName: {
    fontSize: Typography.fontSize.lg + 1,
    fontWeight: Typography.fontWeight.extraBold,
    marginTop: 10,
  },
  appCardBottom: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginTop: 14,
  },
  appDate: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.medium,
  },
  linkRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 2,
  },

  /* Section headers */
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extraBold,
  },

  /* Need help */
  helpCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
    backgroundColor: "#0B5B41",
    borderRadius: 18,
    padding: Spacing.base,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extraBold,
  },
  helpDesc: {
    color: "#C7E5D8",
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: Typography.fontWeight.medium,
    marginTop: 3,
  },
  helpBtn: {
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center" as const,
  },
  helpBtnText: {
    color: BrandColors.WHITE,
    fontSize: Typography.fontSize.sm + 1.5,
    fontWeight: Typography.fontWeight.extraBold,
  },
  draftBannerCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  draftTopRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  draftTag: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  draftTagText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  draftSavedTime: {
    fontSize: 11.5,
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  draftSubtitle: {
    fontSize: 12.5,
    marginBottom: 12,
  },
  draftFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  draftResumeText: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
};

export type { ThemeTokens };

export const getServiceCardThemedStyle = (
  isDark: boolean,
  colors: ThemeTokens,
  bgColor: string,
  borderColor: string,
) => ({
  backgroundColor: isDark ? String(colors.backgroundElement) : bgColor,
  borderColor: isDark ? String(colors.border) : borderColor,
});

export const getServiceLabelThemedStyle = (isDark: boolean, colors: ThemeTokens) => ({
  color: isDark ? String(colors.text) : "#0F172A",
});

export const getServiceDescThemedStyle = (isDark: boolean, colors: ThemeTokens) => ({
  color: isDark ? String(colors.textSecondary) : "#64748B",
});

export const getServiceArrowBtnThemedStyle = (isDark: boolean, colors: ThemeTokens) => ({
  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
  borderColor: isDark ? String(colors.border) : "rgba(0,0,0,0.06)",
});

export const getDraftCardThemedStyle = (
  isDark: boolean,
  colors: ThemeTokens,
  accentColor: string,
  lightBg: string,
  lightBorder: string,
) => ({
  backgroundColor: isDark ? String(colors.backgroundElement) : lightBg,
  borderColor: accentColor,
  shadowColor: accentColor,
  borderTopColor: isDark ? String(colors.border) : lightBorder,
});

export const getHeroHeaderStyle = (colors: ThemeTokens, topInset: number) => ({
  backgroundColor: String(colors.primaryDark),
  paddingTop: topInset,
});

export const getThemedCardStyle = (colors: ThemeTokens) => ({
  backgroundColor: String(colors.backgroundElement),
  borderColor: String(colors.border),
});
