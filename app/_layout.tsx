import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoxProvider } from '../src/store/foxStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <FoxProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* 启动页 - 初始页面 */}
          <Stack.Screen 
            name="splash" 
            options={{ 
              animation: 'fade',
              gestureEnabled: false, // 禁止手势返回
            }} 
          />
          {/* 首页 */}
          <Stack.Screen name="index" />
          {/* 登录页 */}
          <Stack.Screen name="login" />
          {/* 书本设置 */}
          <Stack.Screen name="book-setup" />
          {/* 小狐狸主页 */}
          <Stack.Screen 
            name="fox-home" 
            options={{ animation: 'slide_from_bottom' }} 
          />
          {/* 每日复习 */}
          <Stack.Screen name="review-daily" />
          {/* 学前 */}
          <Stack.Screen 
            name="preschool" 
            options={{ animation: 'fade' }} 
          />
          {/* 小学 */}
          <Stack.Screen name="primary" />
          {/* 初中 */}
          <Stack.Screen name="middle" />
          {/* 高中 */}
          <Stack.Screen name="high" />
        </Stack>
      </FoxProvider>
    </SafeAreaProvider>
  );
}
