import React from "react";
import { Stack } from "expo-router";

export function CustomerNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="personal-details" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

export default CustomerNavigator;
