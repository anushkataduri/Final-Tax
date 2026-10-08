import { View, type ViewProps } from "react-native";

import type { ThemeColors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  /** Key of the active theme palette to use as the background colour. */
  type?: keyof ThemeColors;
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme[type ?? "background"] }, style]}
      {...otherProps}
    />
  );
}
