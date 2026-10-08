import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Colors } from "@/design-system/colors";
import { Typography } from "@/design-system/typography";
import { Spacing } from "@/design-system/spacing";
import { Shadows } from "@/design-system/shadows";
import { BorderRadius, BorderWidth } from "@/design-system/borders";
import { useThemeStore, type ThemeMode } from "./themeStore";

export interface Theme {
  colors: typeof Colors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  shadows: typeof Shadows;
  borderRadius: typeof BorderRadius;
  borderWidth: typeof BorderWidth;
  isDark: boolean;
  themeMode?: ThemeMode;
  setTheme?: (mode: ThemeMode) => Promise<void>;
  toggleTheme?: () => Promise<void>;
}

const defaultTheme: Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  shadows: Shadows,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth,
  isDark: false,
  themeMode: "light",
};

const ThemeContext = createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMode = useThemeStore((state) => state.theme);
  const isDark = themeMode === "dark";
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const activeColors = useMemo(() => {
    if (isDark) {
      return {
        ...Colors,
        background: "#0F172A",
        card: "#1E293B",
        cardBorder: "#334155",
        text: "#F8FAFC",
        textSecondary: "#94A3B8",
        textMuted: "#64748B",
        border: "#334155",
      };
    }
    return Colors;
  }, [isDark]);

  const theme = useMemo<Theme>(() => {
    return {
      colors: activeColors,
      typography: Typography,
      spacing: Spacing,
      shadows: Shadows,
      borderRadius: BorderRadius,
      borderWidth: BorderWidth,
      isDark,
      themeMode,
      setTheme,
      toggleTheme,
    };
  }, [activeColors, isDark, themeMode, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
