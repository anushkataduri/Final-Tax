import { StyleSheet, Platform, ViewStyle, TextStyle } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 16,
    width: "100%",
  },
  inputContainer: {
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    position: "relative",
  },
  floatingLabelWrapper: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    zIndex: 2,
    borderRadius: 4,
  },
  floatingLabelText: {
    letterSpacing: 0.1,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    minHeight: 48,
  },
  rightElementWrap: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtn: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
});

export const getInputContainerDynamicStyle = (
  bg: string,
  borderColor: string,
  isFocused: boolean,
  hasError: boolean,
  multiline: boolean,
  numberOfLines?: number
): ViewStyle => ({
  backgroundColor: bg,
  borderColor,
  borderWidth: isFocused || hasError ? 1.8 : 1.2,
  minHeight: multiline
    ? numberOfLines
      ? numberOfLines * 24 + 36
      : 96
    : 52,
  alignItems: multiline ? "flex-start" : "center",
});

export const getTextInputDynamicStyle = (
  isDark: boolean,
  multiline: boolean
): TextStyle => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
  paddingTop: multiline ? 12 : Platform.OS === "ios" ? 0 : 2,
  paddingBottom: multiline ? 12 : 0,
});
