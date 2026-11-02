import { StyleSheet } from "react-native";
import { BrandColors, Typography, Spacing, BorderRadius } from "@/shared/theme";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11, 31, 58, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxHeight: "90%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  formContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inputLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#334155",
  },
  mandatoryStar: {
    color: "#DC2626",
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: Spacing.sm,
    height: 44,
    justifyContent: "center",
  },
  textInput: {
    fontSize: Typography.fontSize.xs,
    color: "#0F172A",
  },
  accountTypeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: 2,
  },
  accountTypePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  accountTypePillActive: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: "#FFFBF7",
  },
  accountTypePillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#64748B",
  },
  accountTypePillTextActive: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: Typography.fontWeight.bold,
  },
  saveBankBtn: {
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xs,
  },
  saveBankBtnText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
});
