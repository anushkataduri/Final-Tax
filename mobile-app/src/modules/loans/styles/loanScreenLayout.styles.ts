import type { ViewStyle } from "react-native";

/** Safe-area-dependent padding shared by the loan application screens. */

export const getSafeAreaTopPadding = (insetTop: number): ViewStyle => ({
  paddingTop: insetTop,
});

/** `minPadding` defaults to 12; Project Finance's bar has always used 14. */
export const getBottomBarPadding = (insetBottom: number, minPadding = 12): ViewStyle => ({
  paddingBottom: Math.max(insetBottom, minPadding),
});

/** Keeps the last field reachable above the keyboard or the bottom inset, whichever is taller. */
export const getKeyboardAwareScrollPadding = (keyboardHeight: number, insetBottom: number): ViewStyle => ({
  paddingBottom: Math.max(keyboardHeight + 96, insetBottom + 40),
});

/** Width of a 0–100 progress fill. */
export const getProgressWidth = (percent: number): ViewStyle => ({
  width: `${Math.min(100, Math.max(0, percent))}%`,
});
