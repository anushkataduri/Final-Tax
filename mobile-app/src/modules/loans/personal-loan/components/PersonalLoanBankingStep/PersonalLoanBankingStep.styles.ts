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
  ifscLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  ifscSuccessBox: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  ifscSuccessText: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.PRIMARY_BLUE,
    fontWeight: "600",
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
  subCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  subCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },
});
