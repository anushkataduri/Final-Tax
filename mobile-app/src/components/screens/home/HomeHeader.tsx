/**
 * HomeHeader
 * Blue hero header at the top of the Home screen.
 * Contains: menu/profile button, logo + brand text, notification bell,
 * and the greeting text row.
 */

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/app/(main)/home.styles";
import { Spacing } from "@/shared/theme";

interface HomeHeaderProps {
  greetingTitle: string;
  unreadCount: number;
  colors: ReturnType<typeof useTheme>;
  topInset: number;
  onMenuPress: () => void;
  onNotificationsPress: () => void;
}

export function HomeHeader({
  greetingTitle,
  unreadCount,
  colors,
  topInset,
  onMenuPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <View
      style={[
        styles.heroHeader,
        { backgroundColor: colors.primaryDark, paddingTop: topInset + Spacing.sm },
      ]}
    >
      {/* Top row: menu | logo+brand | notification bell */}
      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onMenuPress}
          style={styles.menuBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Ionicons name="menu" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onMenuPress}
            style={styles.logoBox}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Image
              source={require("@/../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.brandText}>TAXEDGE</Text>
            <Text style={styles.brandSubText}>FIN SOLUTIONS</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={onNotificationsPress}
            style={styles.iconBtn}
            hitSlop={6}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.orange }]}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting row */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>{greetingTitle}</Text>
          <Text style={styles.welcomeSubText}>
            What can we help you with today?
          </Text>
        </View>
      </View>
    </View>
  );
}
