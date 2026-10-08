/**
 * Component: GstPaymentMethodStep
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    gap: 12,
    paddingBottom: 20,
  },
  topAmountCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  discountLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  discountValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  amountDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: BrandColors.PRIMARY_ORANGE,
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    marginTop: 4,
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.WHITE,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  methodCardSelected: {
    backgroundColor: "#FEF0E6",
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodTextCol: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },
  methodSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleActive: {
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  upiCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginTop: 2,
  },
  upiLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  upiInput: {
    height: 48,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: BrandColors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  upiInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 11.5,
    color: "#DC2626",
    marginBottom: 8,
    fontWeight: "500",
  },
  upiAppsRow: {
    flexDirection: "row",
    gap: 8,
  },
  appPill: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  appPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
  },
  securityBox: {
    flexDirection: "row",
    backgroundColor: "#EAF1FE",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 6,
  },
  securityText: {
    flex: 1,
    fontSize: 11.5,
    color: "#083B75",
    lineHeight: 16,
  },
});

export const getMethodIconBoxStyle = (backgroundColor: string) => ({
  backgroundColor,
});
