import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import type { Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import {
  Pressable,
  useColorScheme,
  View,
  type PressableProps,
  type ViewProps,
} from "react-native";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text/themed-text";
import { ThemedView } from "@/components/themed-view";

import {
  Colors,
  type ThemeName,
} from "@/constants/theme";
import { styles } from "./app-tabs.web.styles";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.tabSlot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          {/* Starter-template route: this app has no /explore screen, so the
              typed-routes union does not contain it. */}
          <TabTrigger name="explore" href={"/explore" as Href} asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export interface TabButtonProps
  extends Omit<PressableProps, "children" | "style"> {
  children?: ReactNode;
  /** Injected by `TabTrigger` when rendered with `asChild`. */
  isFocused?: boolean;
}

export function TabButton({ children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
        <ThemedText
          type="small"
          themeColor={isFocused ? "text" : "textSecondary"}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export interface CustomTabListProps extends Omit<ViewProps, "style"> {
  children?: ReactNode;
}

export function CustomTabList(props: CustomTabListProps) {
  const scheme = useColorScheme();
  const theme: ThemeName = scheme === "dark" ? "dark" : "light";
  const colors = Colors[theme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: "arrow.up.right.square", web: "link" }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}
