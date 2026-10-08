import React from 'react';
import { Stack } from 'expo-router';

export function CompanyRegistrationNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyRegistrationHome" />
      <Stack.Screen name="RegistrationType" />
      <Stack.Screen name="CompanyDetails" />
      <Stack.Screen name="BusinessDetails" />
      <Stack.Screen name="DirectorDetails" />
      <Stack.Screen name="PartnerDetails" />
      <Stack.Screen name="RegisteredAddress" />
      <Stack.Screen name="CapitalDetails" />
      <Stack.Screen name="CompanyDocuments" />
      <Stack.Screen name="ReviewApplication" />
      <Stack.Screen name="Payment" />
      <Stack.Screen name="RegistrationStatus" />
    </Stack>
  );
}
export default CompanyRegistrationNavigator;
