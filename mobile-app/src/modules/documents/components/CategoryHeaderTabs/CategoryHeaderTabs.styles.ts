import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  tabPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  tabPillActive: {
    backgroundColor: "#FFF1E6",
    borderColor: "#F97316",
  },
  tabPillInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#EA580C",
  },
  tabTextInactive: {
    color: "#64748B",
  },
});
