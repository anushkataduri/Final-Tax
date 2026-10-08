import React from "react";
import { Text, type TextProps } from "react-native";

import type { ThemeColors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "./themed-text.styles";

export type ThemedTextType =
  | "default"
  | "title"
  | "small"
  | "smallBold"
  | "subtitle"
  | "link"
  | "linkPrimary"
  | "code";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  /** Key of the active theme palette to colour the text with. */
  themeColor?: keyof ThemeColors;
}

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}
