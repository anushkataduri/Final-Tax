import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  fieldGroup: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  requiredStar: {
    color: "#EF4444",
  },
  dateContainer: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontSize: 13,
    color: "#0F172A",
    flex: 1,
  },
  placeholderText: {
    fontSize: 13,
    color: "#94A3B8",
    flex: 1,
  },
});
