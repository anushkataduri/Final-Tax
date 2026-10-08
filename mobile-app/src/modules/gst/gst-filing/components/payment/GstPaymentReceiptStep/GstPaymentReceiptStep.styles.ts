/**
 * Component: GstPaymentReceiptStep
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet, Platform } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  receiptCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 16,
  },
  companyBanner: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  teBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  teBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.WHITE,
  },
  companyTextCol: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.WHITE,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  companyGst: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 1,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  metaRightCol: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  paddedSection: {
    paddingHorizontal: 16,
  },
  customerName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    marginTop: 2,
  },
  customerGstin: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  customerPeriod: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  tableItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 4,
  },
  tableItemTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },
  itemSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 13.5,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },
  calcList: {
    paddingHorizontal: 16,
    gap: 6,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calcLabel: {
    fontSize: 12.5,
    color: "#64748B",
  },
  calcValue: {
    fontSize: 12.5,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
  },
  totalPaidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF0E6",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  totalPaidLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  totalPaidValue: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.PRIMARY_ORANGE,
  },
  txnFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  footerTxnValue: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
    marginTop: 2,
  },
  verifiedBanner: {
    flexDirection: "row",
    backgroundColor: "#FEF0E6",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#FFD8BF",
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  downloadBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.WHITE,
    borderWidth: 1.5,
    borderColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  shareBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
});
