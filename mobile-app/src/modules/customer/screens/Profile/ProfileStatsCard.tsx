import React from "react";
import { View, Text } from "react-native";
import type { UseThemeResult } from "@/hooks/use-theme";
import { styles } from "./ProfileScreen.styles";

interface StatItem {
  value: string;
  label: string;
  color: string;
}

interface ProfileStatsCardProps {
  colors: UseThemeResult;
  statItems: StatItem[];
}

export function ProfileStatsCard({ colors, statItems }: ProfileStatsCardProps) {
  return (
    <View
      style={[
        styles.statsCard,
        { backgroundColor: colors.backgroundElement, borderColor: colors.border },
      ]}
    >
      {statItems.map((stat) => (
        <View key={stat.label} style={styles.statCell}>
          <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
