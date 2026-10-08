import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepContainer: {
    flexDirection: "row",
    minHeight: 60,
  },
  leftLineCol: {
    alignItems: "center",
    width: 32,
  },
  icon: {
    zIndex: 1,
    backgroundColor: "transparent",
  },
  line: {
    width: 2.5,
    flex: 1,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 15,
    flex: 1,
    flexShrink: 1,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    flexShrink: 0,
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
