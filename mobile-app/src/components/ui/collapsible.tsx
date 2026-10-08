import { SymbolView } from "expo-symbols";
import { useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type CollapsibleProps = PropsWithChildren<{
  title: string;
}>;

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [
          styles.heading,
          pressed && styles.pressedHeading,
        ]}
        onPress={() => setIsOpen((value) => !value)}
      >
        <ThemedView type="backgroundElement" style={styles.button}>
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            size={14}
            weight="bold"
            tintColor={theme.text}
            style={isOpen ? styles.iconOpen : styles.iconClosed}
          />
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOpen: {
    transform: [{ rotate: "-90deg" }],
  },
  iconClosed: {
    transform: [{ rotate: "90deg" }],
  },
  content: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    marginLeft: Spacing.four,
    padding: Spacing.four,
  },
});
