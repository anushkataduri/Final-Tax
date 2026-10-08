import { StyleSheet } from "react-native";
import { Typography, BorderRadius, Spacing } from "../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.medium,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    elevation: 1,
  },
  googleText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export const getThemedStyles = (colors: {
  border: string;
  textSecondary: string;
  backgroundElement: string;
  text: string;
}, disabled: boolean) => ({
  dividerLine: {
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
  },
  googleBtn: {
    backgroundColor: colors.backgroundElement,
    borderColor: colors.border,
    opacity: disabled ? 0.6 : 1,
  },
  googleText: {
    color: colors.text,
  },
});
