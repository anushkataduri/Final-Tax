import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenLayout } from "../../../../shared/components/ScreenLayout/ScreenLayout";
import { useTheme } from "../../../../hooks/use-theme";
import { useAuthStore } from "../../../authentication/store/authStore";
import {
  styles,
  getCardThemedStyle,
  getInfoKeyThemedStyle,
  getInfoValueThemedStyle,
} from "./PersonalDetailsScreen.styles";

export function PersonalDetailsScreen() {
  const colors = useTheme();
  const customer = useAuthStore((state) => state.customer);

  const infoRow = (label: string, value: string) => (
    <View key={label} style={styles.infoRow}>
      <Text style={[styles.infoKey, getInfoKeyThemedStyle(colors.textSecondary)]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, getInfoValueThemedStyle(colors.text)]}>{value}</Text>
    </View>
  );

  return (
    <ScreenLayout title="Personal Details" showBack>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, getCardThemedStyle(colors.backgroundElement, colors.border)]}>
          {infoRow("Full Name", customer?.name || "N/A")}
          {infoRow("Mobile", customer?.mobile || "N/A")}
          {infoRow("Email", customer?.email || "N/A")}
          {infoRow("Date of Birth", customer?.dob || "N/A")}
          {infoRow("Customer Type", customer?.customerType || "N/A")}
          {infoRow("Address", customer?.address || "N/A")}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

export default PersonalDetailsScreen;
