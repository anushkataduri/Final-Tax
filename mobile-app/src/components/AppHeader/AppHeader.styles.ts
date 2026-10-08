import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
  },
  headerContainer: {
    height: Platform.OS === "ios" ? 44 : 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  miniLogo: {
    width: 26,
    height: 26,
    borderRadius: 6,
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
});
