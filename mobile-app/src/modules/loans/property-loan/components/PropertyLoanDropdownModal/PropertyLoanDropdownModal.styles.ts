import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    maxHeight: "75%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
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
    borderRadius: 8,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: "#334155",
  },
  optionTextActive: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: "700",
  },
});
