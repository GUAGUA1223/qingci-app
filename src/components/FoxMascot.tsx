import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FoxStage, FoxMood } from '../types';

interface FoxMascotProps {
  stage?: FoxStage;
  size?: number;
  mood?: FoxMood;
  animated?: boolean;
  showAccessory?: string;
}

export const FoxMascot: React.FC<FoxMascotProps> = ({
  stage = 0,
  size = 100,
  mood = 'happy',
  animated = true,
  showAccessory,
}) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // 呼吸动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 眨眼动画
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    // 阶段1+: 跳动动画
    if (stage >= 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // 阶段2+: 尾巴摇摆
    if (stage >= 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(swayAnim, {
            toValue: -1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // 阶段3+: 发光效果
    if (stage >= 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: { borderColor: true },
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: { borderColor: true },
          }),
        ])
      ).start();
    }

    // 阶段4: 翅膀扇动
    if (stage >= 4) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(wingAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wingAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => {
      clearInterval(blinkInterval);
    };
  }, [stage, animated]);

  const getMoodEmoji = (): string => {
    const emojis: Record<FoxMood, string> = {
      happy: '😊',
      sleepy: '😴',
      hungry: '🥺',
      proud: '😎',
      excited: '🤩',
    };
    return emojis[mood];
  };

  const getFoxEmoji = (): string => {
    if (stage === 4) return '🦊✨';
    if (stage === 3) return '🦊';
    return '🦊';
  };

  const renderFoxBody = () => {
    const foxSize = size * 0.6;
    
    return (
      <Animated.View
        style={[
          styles.foxContainer,
          {
            transform: [
              { scale: breatheAnim },
              { translateY: bounceAnim },
            ],
          },
        ]}
      >
        {/* 阶段4: 翅膀 */}
        {stage >= 4 && (
          <Animated.View
            style={[
              styles.wingLeft,
              {
                transform: [
                  { scale: 0.4 + wingAnim.value * 0.15 },
                  { rotate: '-15deg' },
                ],
              },
            ]}
          >
            <Text style={{ fontSize: foxSize * 0.6 }}>🪶</Text>
          </Animated.View>
        )}
        {stage >= 4 && (
          <Animated.View
            style={[
              styles.wingRight,
              {
                transform: [
                  { scale: 0.4 + wingAnim.value * 0.15 },
                  { rotate: '15deg' },
                ],
              },
            ]}
          >
            <Text style={{ fontSize: foxSize * 0.6 }}>🪶</Text>
          </Animated.View>
        )}

        {/* 主体 */}
        <View style={styles.foxBody}>
          {/* 耳朵 */}
          {stage >= 1 && (
            <View style={styles.ears}>
              <Text style={{ fontSize: foxSize * 0.3 }}>🐰</Text>
              <Text style={{ fontSize: foxSize * 0.3 }}>🐰</Text>
            </View>
          )}

          {/* 小狐狸脸 */}
          <Text style={[styles.fox, { fontSize: foxSize }]}>
            {getFoxEmoji()}
          </Text>

          {/* 尾巴 */}
          {stage >= 2 && (
            <Animated.View
              style={[
                styles.tail,
                {
                  transform: [{ rotate: `${swayAnim.value * 15}deg` }],
                },
              ]}
            >
              <Text style={{ fontSize: foxSize * 0.5 }}>
                {stage >= 3 ? '✨🧡✨' : '🧡'}
              </Text>
            </Animated.View>
          )}

          {/* 阶段3+: 金冠 */}
          {stage >= 3 && (
            <View style={styles.crown}>
              <Text style={{ fontSize: foxSize * 0.35 }}>👑</Text>
            </View>
          )}

          {/* 阶段4: 星空 */}
          {stage >= 4 && (
            <View style={styles.stars}>
              <Text style={{ fontSize: foxSize * 0.2 }}>⭐</Text>
              <Text style={{ fontSize: foxSize * 0.15 }}>✨</Text>
              <Text style={{ fontSize: foxSize * 0.2 }}>⭐</Text>
            </View>
          )}
        </View>

        {/* 心情表情 */}
        <Animated.View
          style={[
            styles.moodContainer,
            {
              opacity: blinkAnim,
            },
          ]}
        >
          <Text style={[styles.mood, { fontSize: size * 0.35 }]}>
            {getMoodEmoji()}
          </Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const glowStyle = stage >= 3 ? {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  } : {};

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size * 1.2 },
        glowStyle,
      ]}
    >
      {renderFoxBody()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foxBody: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fox: {
    textAlign: 'center',
  },
  ears: {
    position: 'absolute',
    top: -15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 10,
  },
  tail: {
    position: 'absolute',
    right: -20,
    top: '50%',
  },
  crown: {
    position: 'absolute',
    top: -25,
  },
  stars: {
    position: 'absolute',
    top: -10,
    left: -30,
    flexDirection: 'row',
    gap: 5,
  },
  wingLeft: {
    position: 'absolute',
    left: -15,
    top: '30%',
  },
  wingRight: {
    position: 'absolute',
    right: -15,
    top: '30%',
  },
  moodContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  mood: {
    textAlign: 'center',
  },
});
