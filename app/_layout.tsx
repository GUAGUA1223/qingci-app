import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="splash" options={{ animation: 'none' }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="book-setup" />
        <Stack.Screen name="fox-home" />
        <Stack.Screen name="review" />
        <Stack.Screen name="preschool" options={{ animation: 'fade' }} />
        <Stack.Screen name="primary" />
        <Stack.Screen name="middle" />
        <Stack.Screen name="high" />
      </Stack>
    </SafeAreaProvider>
  );
}
