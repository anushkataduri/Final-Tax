import { StyleSheet, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#083B75",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
});

export const getWrapSizeStyle = (size: number): ViewStyle => ({
  width: size,
  height: size,
});
