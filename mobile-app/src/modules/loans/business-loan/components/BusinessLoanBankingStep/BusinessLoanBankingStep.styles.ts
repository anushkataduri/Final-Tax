import { StyleSheet } from "react-native";
import { BrandColors, Typography, Spacing, BorderRadius } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginBottom: 10,
    lineHeight: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginBottom: 10,
    lineHeight: 15,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: "#334155",
    marginBottom: 4,
  },
  requiredStar: {
    color: "#EF4444",
  },
  optionalTag: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#94A3B8",
    fontWeight: "normal",
  },
  helperText: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#64748B",
    marginTop: 3,
  },
  errorText: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#EF4444",
    marginTop: 3,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: Typography.fontSize.sm,
    color: "#0F172A",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  ifscLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  ifscSuccessBox: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
  },
  ifscSuccessText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },
  subCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  subCardTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
});
