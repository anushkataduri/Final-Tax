import React from "react";
import { Stack } from "expo-router";

export function AuthNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="createprofile" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="passcode" />
    </Stack>
  );
}

export default AuthNavigator;
