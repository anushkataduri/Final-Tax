/**
 * Component: GstPaymentSuccessStep
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet, Platform } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  heroCard: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: BrandColors.WHITE,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  amountCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  amountLabel: {
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  amountValue: {
    fontSize: 26,
    fontWeight: "800",
    color: BrandColors.WHITE,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  detailsCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 20,
  },
  detailsHeading: {
    fontSize: 14.5,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  receiptBtn: {
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
  receiptBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  applicationBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  applicationBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.WHITE,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  homeLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  homeLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
});
