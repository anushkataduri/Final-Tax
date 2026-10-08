import React from 'react';
import { Stack } from 'expo-router';

export function DocumentNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DocumentsHome" />
      <Stack.Screen name="DocumentUpload" />
    </Stack>
  );
}
export default DocumentNavigator;
