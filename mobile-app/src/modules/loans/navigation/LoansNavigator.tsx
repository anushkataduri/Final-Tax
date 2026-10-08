import React from "react";
import { Stack } from "expo-router";

export function LoansNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loans" />
      <Stack.Screen name="business-loan" />
      <Stack.Screen name="personal-loan" />
      <Stack.Screen name="home-loan" />
      <Stack.Screen name="property-loan" />
      <Stack.Screen name="vehicle-loan" />
      <Stack.Screen name="working-capital" />
      <Stack.Screen name="machinery-loan" />
      <Stack.Screen name="project-finance" />
      <Stack.Screen name="msme-loan" />
      <Stack.Screen name="loan-application" />
      <Stack.Screen name="loan-status" />
    </Stack>
  );
}

export default LoansNavigator;
