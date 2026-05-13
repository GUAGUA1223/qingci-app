import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

// 导入狐狸idle动画帧
const foxIdleFrames = [
  require('../assets/images/animation/fox_idle_1.jpg'),
  require('../assets/images/animation/fox_idle_2.jpg'),
  require('../assets/images/animation/fox_idle_3.jpg'),
  require('../assets/images/animation/fox_idle_4.jpg'),
];

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // 动画值
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const foxOpacity = useRef(new Animated.Value(0)).current;
  const foxTranslateY = useRef(new Animated.Value(50)).current;
  const foxWave = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const lizhiOpacity = useRef(new Animated.Value(0)).current;
  const lizhiTranslateX = useRef(new Animated.Value(-30)).current;
  
  // 动画帧控制
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(frameInterval);
  }, []);

  // 入场动画
  useEffect(() => {
    // Logo 放大淡入
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 狐狸淡入+下落
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(foxOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(foxTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // 狐狸挥手动画（左右旋转）
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(foxWave, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(foxWave, {
            toValue: -1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 800);

    // 副标题淡入
    setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 600);

    // 小荔枝淡入滑入
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(lizhiOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(lizhiTranslateX, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);
  }, []);

  // 6秒后跳转
  useEffect(() => {
    const timer = setTimeout(() => {
      // 根据登录状态跳转
      // TODO: 实际项目中需要检查登录状态
      // 目前默认跳转到首页
      router.replace('/');
    }, 6000);
    return () => clearTimeout(timer);
  }, [router]);

  // 狐狸旋转插值
  const foxRotate = foxWave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <View style={styles.container}>
      {/* 顶部装饰 - 小荔枝 */}
      <Animated.View
        style={[
          styles.lizhiContainer,
          {
            opacity: lizhiOpacity,
            transform: [{ translateX: lizhiTranslateX }],
          },
        ]}
      >
        <Text style={styles.lizhiEmoji}>🍒</Text>
        <Text style={styles.lizhiText}>小荔枝</Text>
      </Animated.View>

      {/* 中央内容区 */}
      <View style={styles.centerContent}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoMain}>轻词</Text>
          <Text style={styles.logoSub}>QingCi</Text>
        </Animated.View>

        {/* 小狐狸动画 */}
        <Animated.View
          style={[
            styles.foxContainer,
            {
              opacity: foxOpacity,
              transform: [
                { translateY: foxTranslateY },
                { rotate: foxRotate },
              ],
            },
          ]}
        >
          <Image
            source={foxIdleFrames[currentFrame]}
            style={styles.foxImage}
            resizeMode="contain"
          />
          {/* 挥手效果 - 添加一个小手emoji */}
          <Animated.View
            style={[
              styles.foxHand,
              {
                transform: [
                  {
                    rotate: foxWave.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: ['-30deg', '0deg', '30deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.handEmoji}>👋</Text>
          </Animated.View>
        </Animated.View>

        {/* 副标题 */}
        <Animated.Text
          style={[styles.sloganText, { opacity: subtitleOpacity }]}
        >
          跟课本走，轻松记
        </Animated.Text>

        {/* 版本号 */}
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>

      {/* 底部装饰 */}
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>✨</Text>
        <Text style={styles.decorEmoji}>🌟</Text>
        <Text style={styles.decorEmoji}>✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 小荔枝样式
  lizhiContainer: {
    position: 'absolute',
    top: 80,
    left: 30,
    alignItems: 'center',
  },
  lizhiEmoji: {
    fontSize: 50,
  },
  lizhiText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 4,
  },
  // 中央内容
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoMain: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4ECDC4',
    letterSpacing: 4,
  },
  logoSub: {
    fontSize: 16,
    color: '#999',
    letterSpacing: 6,
    marginTop: 4,
  },
  // 狐狸
  foxContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foxImage: {
    width: 180,
    height: 180,
  },
  foxHand: {
    position: 'absolute',
    right: 10,
    top: 60,
  },
  handEmoji: {
    fontSize: 36,
  },
  // 副标题
  sloganText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
    marginTop: 10,
  },
  // 版本号
  versionText: {
    position: 'absolute',
    bottom: -height * 0.25,
    fontSize: 12,
    color: '#CCC',
  },
  // 底部装饰
  bottomDecor: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 20,
  },
  decorEmoji: {
    fontSize: 24,
  },
});
