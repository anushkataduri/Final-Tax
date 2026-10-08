import { useThemeStore } from "@/design-system/theme/themeStore";

export function useColorScheme(): "light" | "dark" {
  return useThemeStore((state) => state.theme);
}

export default useColorScheme;

