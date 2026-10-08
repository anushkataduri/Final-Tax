import React from 'react';
import { Stack } from 'expo-router';

export function InsuranceNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InsuranceHome" />
      <Stack.Screen name="InsuranceTypes" />
      <Stack.Screen name="InsuranceDetails" />
      <Stack.Screen name="MemberDetails" />
      <Stack.Screen name="NomineeDetails" />
      <Stack.Screen name="InsuranceDocuments" />
      <Stack.Screen name="InsuranceQuotes" />
      <Stack.Screen name="ReviewApplication" />
      <Stack.Screen name="Payment" />
      <Stack.Screen name="PolicyDetails" />
    </Stack>
  );
}
export default InsuranceNavigator;
