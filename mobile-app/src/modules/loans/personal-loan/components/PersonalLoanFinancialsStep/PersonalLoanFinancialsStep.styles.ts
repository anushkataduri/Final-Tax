import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "700",
    color: BrandColors.PRIMARY_BLUE_DARK,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#FEF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#0F172A",
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: BrandColors.PRIMARY_BLUE_DARK,
    marginBottom: 8,
  },
  requiredStar: {
    color: "#EF4444",
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginTop: 4,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: "#EF4444",
    marginTop: 4,
  },
  input: {
    backgroundColor: BrandColors.WHITE,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "500",
    color: "#475569",
  },
  chipTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: "700",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: BrandColors.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "500",
    color: "#64748B",
  },
  toggleTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: "700",
  },
  tenureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tenureBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tenureBoxActive: {
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  tenureText: {
    fontSize: Typography.fontSize.sm,
    color: "#475569",
  },
  tenureTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: "700",
  },
});
