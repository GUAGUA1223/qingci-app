import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { foxImages } from '../assets/images';

const { width, height } = Dimensions.get('window');

export default function SplashPage() {
  const router = useRouter();
  const flyAnim = useRef(new Animated.Value(-100)).current; // 从左侧飞入
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 飞行动画序列
    Animated.sequence([
      // 1. 小狐狸从左侧飞入（0-1.5秒）
      Animated.parallel([
        Animated.timing(flyAnim, {
          toValue: width * 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // 2. 文字淡入+缩放（1.5-3秒）
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 3. 停留展示（3-5秒）
      Animated.delay(2000),
      // 4. 淡出（5-6秒）
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 6秒后跳转首页
      router.replace('/');
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* 小狐狸飞行动画 */}
        <Animated.View style={{ transform: [{ translateX: flyAnim }] }}>
          <Image source={foxImages.excited} style={styles.foxImage} resizeMode="contain" />
        </Animated.View>

        {/* Logo + 品牌名 */}
        <Animated.View style={[styles.brandSection, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.brandName}>轻词</Text>
          <Text style={styles.brandSub}>点点玩玩，就会了</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  foxImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  brandSection: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  brandSub: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
});
