import { StyleSheet, Platform } from "react-native";
import {
  BrandColors,
  BorderRadius,
  Spacing,
  Typography,
} from "../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.BACKGROUND,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  backBtn: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.base - 2,
    borderWidth: 1.2,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: BrandColors.PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  wrapper: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl + 6,
    fontWeight: Typography.fontWeight.extraBold,
    color: BrandColors.PRIMARY_BLUE,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  sub: {
    fontSize: Typography.fontSize.base,
    color: BrandColors.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 20,
  },
  phoneHighlight: {
    color: BrandColors.PRIMARY_BLUE,
    fontWeight: Typography.fontWeight.bold,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  dotsTouchable: {
    width: "100%",
    alignItems: "center",
    marginVertical: 18,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
  },
  dotBox: {
    width: 46,
    height: 56,
    borderRadius: BorderRadius.base - 2,
    justifyContent: "center",
    alignItems: "center",
  },
  secureDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BrandColors.PRIMARY_BLUE_DARK,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  loginBtn: {
    marginTop: Spacing.sm,
    height: 54,
    borderRadius: BorderRadius.base - 2,
  },
});

export const getBackBtnPosition = (topInset: number, headerOffset: number) => ({
  top: topInset + headerOffset,
});

export const getDynamicScrollStyle = (
  topInset: number,
  bottomInset: number,
  headerOffset: number,
  footerOffset: number,
  minScrollPadding: number
) => ({
  paddingTop: Math.max(topInset + headerOffset, minScrollPadding),
  paddingBottom: Math.max(bottomInset + footerOffset, minScrollPadding),
});

export const getDotBoxStyle = (isCurrent: boolean, hasError?: boolean | string | null) => ({
  borderColor: hasError
    ? "#DC2626"
    : isCurrent
    ? BrandColors.PRIMARY_BLUE_DARK
    : BrandColors.CARD_BORDER,
  borderWidth: isCurrent ? 2 : 1,
  backgroundColor: isCurrent ? BrandColors.WHITE : BrandColors.BACKGROUND,
});
