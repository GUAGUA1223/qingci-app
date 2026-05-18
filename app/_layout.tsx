import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoxProvider } from '../src/store/foxStore';
import { ReviewProvider } from '../src/store/reviewStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FoxProvider>
        <ReviewProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
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
        </ReviewProvider>
      </FoxProvider>
    </SafeAreaProvider>
  );
}
