import React from 'react';
import { Stack } from 'expo-router';

export function ApplicationNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActiveApplications" />
      <Stack.Screen name="ApplicationDetails" />
      <Stack.Screen name="PendingDocuments" />
      <Stack.Screen name="CompletedApplications" />
    </Stack>
  );
}
export default ApplicationNavigator;
