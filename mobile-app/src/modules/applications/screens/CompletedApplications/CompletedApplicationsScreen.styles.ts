import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    fontWeight: "600",
  },
});

export const getCardThemedStyle = (bg: string): ViewStyle => ({
  backgroundColor: bg,
});

export const getTitleThemedStyle = (color: string): TextStyle => ({
  color,
});

export const getDescThemedStyle = (color: string): TextStyle => ({
  color,
});
