import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  star: {
    color: "#DC2626",
  },
  stackedBody: {
    gap: 10,
  },
  stackedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  fieldSubLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  originalValueText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#334155",
  },
  inputGroup: {
    marginTop: 2,
  },
  inputSubLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B1F3A",
    marginBottom: 6,
  },
  input: {
    height: 46,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0B1F3A",
    fontWeight: "600",
  },
  errorInput: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 11.5,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: "500",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  changeValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EA580C",
  },
  neutralChangeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
});
