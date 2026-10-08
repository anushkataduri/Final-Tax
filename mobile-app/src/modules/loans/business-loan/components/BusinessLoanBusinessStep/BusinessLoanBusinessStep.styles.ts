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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "700",
    color: "#0F172A",
  },
  requiredStar: {
    color: "#EF4444",
  },
  helperText: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
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
  // Dropdown Input Selector
  dropdownSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownSelectorActive: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: "#FFFBF7",
  },
  dropdownText: {
    fontSize: Typography.fontSize.sm,
    color: "#0F172A",
    fontWeight: Typography.fontWeight.medium,
  },
  dropdownPlaceholder: {
    fontSize: Typography.fontSize.sm,
    color: "#94A3B8",
  },
  customInputContainer: {
    marginTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#FEF0E6",
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#475569",
  },
  chipTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
    fontWeight: "700",
  },
  toggleSwitch: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  gridRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 3,
  },
  emailFieldWrapper: {
    marginTop: 2,
  },
  // Modal Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
    maxHeight: "75%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  optionItemActive: {
    backgroundColor: "#FEF0E6",
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: "#334155",
  },
  optionTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
    fontWeight: Typography.fontWeight.bold,
  },
});
