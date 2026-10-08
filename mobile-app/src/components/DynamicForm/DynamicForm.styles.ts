import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  dropdownBox: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 320,
    maxHeight: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    padding: 16,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  optionsScroll: {
    flexGrow: 0,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 15,
  },
  closeBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
  closeBtnText: {
    fontWeight: "600",
    fontSize: 15,
  },
  requiredAsterisk: {
    fontWeight: "700",
  },
  dropdownValueText: {
    fontSize: 15,
  },
  optionsScrollContent: {
    paddingVertical: 8,
  },
});
