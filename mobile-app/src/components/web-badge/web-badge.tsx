import React from "react";
import { version } from "expo/package.json";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";

import { ThemedText } from "@/components/themed-text/themed-text";
import { ThemedView } from "@/components/themed-view";
import { styles } from "./web-badge.styles";

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        type="code"
        themeColor="textSecondary"
        style={styles.versionText}
      >
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === "dark"
            ? require("../../../assets/images/expo-badge-white.png")
            : require("../../../assets/images/expo-badge.png")
        }
        style={styles.badgeImage}
      />
    </ThemedView>
  );
}
