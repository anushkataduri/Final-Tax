import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  cardSelected: {
    borderColor: "#F97316",
    backgroundColor: "#FFFBF7",
  },
  cardUnselected: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconBoxSelected: {
    backgroundColor: "#FFF7ED",
  },
  iconBoxUnselected: {
    backgroundColor: "#F0F5FA",
  },
  textGroup: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  subtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2.5,
    lineHeight: 15.5,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#F97316",
  },
  radioOuterUnselected: {
    borderColor: "#CBD5E1",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F97316",
  },
});
