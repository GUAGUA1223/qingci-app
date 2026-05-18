import React from 'react';
import { Stack } from 'expo-router';
import { ParentSettingsProvider } from '../../src/store/parentStore';

export default function ParentLayout() {
  return (
    <ParentSettingsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="time-limit" />
        <Stack.Screen name="weekly-report" />
        <Stack.Screen name="fox-status" />
      </Stack>
    </ParentSettingsProvider>
  );
}
