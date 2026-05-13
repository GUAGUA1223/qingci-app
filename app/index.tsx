import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';

const stages = [
  {
    id: 'preschool',
    name: '学前',
    slogan: '点点玩玩，就会了',
    colors: ['#FF9ECD', '#FFD93D'],
    emoji: '🦊',
    age: '3-6岁',
    icon: '🌈',
  },
  {
    id: 'primary',
    name: '小学',
    slogan: '聪明如狐，轻松记词',
    colors: ['#4ECDC4', '#45B7AA'],
    emoji: '🦊',
    age: '6-12岁',
    icon: '🎒',
  },
  {
    id: 'middle',
    name: '初中',
    slogan: '我的节奏，我的词',
    colors: ['#5B7FFF', '#8B9DC3'],
    emoji: '📚',
    age: '12-15岁',
    icon: '📖',
  },
  {
    id: 'high',
    name: '高中',
    slogan: '一词不落，一秒不废',
    colors: ['#2D3561', '#1E90FF'],
    emoji: '🎯',
    age: '15-18岁',
    icon: '🚀',
  },
];

// 卡片入场动画组件
function AnimatedCard({
  children,
  delay,
  style,
}: {
  children: React.ReactNode;
  delay: number;
  style?: any;
}) {
  const translateY = useRef(new Animated.Value(60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  
  // Logo 动画
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  
  // 装饰动画
  const lizhiRotate = useRef(new Animated.Value(0)).current;
  const foxBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo 入场动画
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // 小荔枝旋转动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(lizhiRotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(lizhiRotate, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 小狐狸弹跳动画
    Animated.loop(
      Animated.sequence([
        Animated.spring(foxBounce, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(foxBounce, {
          toValue: 0,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 处理返回键 - 退出确认
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        '退出确认',
        '确定要退出轻词吗？',
        [
          { text: '取消', style: 'cancel' },
          { text: '确定', onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleSelect = (stageId: string) => {
    router.push(`/${stageId}` as any);
  };

  // 旋转插值
  const lizhiRotateInterpolate = lizhiRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  // 弹跳插值
  const foxBounceInterpolate = foxBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 顶部装饰 - 小荔枝 */}
        <Animated.View
          style={[
            styles.lizhiDecor,
            { transform: [{ rotate: lizhiRotateInterpolate }] },
          ]}
        >
          <Text style={styles.lizhiEmojiDecor}>🍒</Text>
        </Animated.View>

        {/* Logo 区域 */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🦊</Text>
          <Text style={styles.logoText}>轻词</Text>
          <Text style={styles.logoSubtext}>QingCi</Text>
          <Text style={styles.tagline}>跟课本走，轻松记</Text>
        </Animated.View>

        {/* 学段选择卡片 */}
        <View style={styles.cardsContainer}>
          {stages.map((stage, index) => (
            <AnimatedCard key={stage.id} delay={200 + index * 100}>
              <TouchableOpacity
                style={[
                  styles.stageCard,
                  { backgroundColor: stage.colors[0] },
                ]}
                onPress={() => handleSelect(stage.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.stageIcon}>{stage.icon}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.stageName}>{stage.name}</Text>
                    <Text style={styles.stageSlogan}>{stage.slogan}</Text>
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageText}>{stage.age}</Text>
                    </View>
                  </View>
                  <View style={styles.cardEmoji}>
                    <Animated.View
                      style={{ transform: [{ translateY: foxBounceInterpolate }] }}
                    >
                      <Text style={styles.cardFoxEmoji}>{stage.emoji}</Text>
                    </Animated.View>
                  </View>
                </View>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </View>

        {/* 登录按钮 */}
        <Animated.View
          style={[styles.loginContainer, { opacity: logoOpacity }]}
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginIcon}>👤</Text>
            <Text style={styles.loginText}>管理员登录</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 退出按钮 */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            Alert.alert(
              '退出确认',
              '确定要退出轻词吗？',
              [
                { text: '取消', style: 'cancel' },
                { text: '确定', onPress: () => BackHandler.exitApp() },
              ]
            );
          }}
        >
          <Text style={styles.exitText}>退出应用</Text>
        </TouchableOpacity>

        {/* 底部装饰 */}
        <View style={styles.bottomDecor}>
          <Text style={styles.decorText}>轻词 · 陪伴每一个学习阶段</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  // 小荔枝装饰
  lizhiDecor: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  lizhiEmojiDecor: {
    fontSize: 40,
  },
  // Logo 区域
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoEmoji: {
    fontSize: 70,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4ECDC4',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  // 卡片容器
  cardsContainer: {
    width: '100%',
    gap: 14,
  },
  // 学段卡片
  stageCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardLeft: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIcon: {
    fontSize: 28,
  },
  cardRight: {
    flex: 1,
  },
  cardEmoji: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFoxEmoji: {
    fontSize: 36,
  },
  stageName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stageSlogan: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  ageBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  ageText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  // 登录按钮
  loginContainer: {
    marginTop: 25,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  loginIcon: {
    fontSize: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  // 退出按钮
  exitButton: {
    marginTop: 15,
    paddingVertical: 8,
  },
  exitText: {
    fontSize: 13,
    color: '#999',
  },
  // 底部装饰
  bottomDecor: {
    marginTop: 20,
    alignItems: 'center',
  },
  decorText: {
    fontSize: 12,
    color: '#CCC',
  },
});
