import React, { useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Animated, Easing } from 'react-native';
import { ANIMATION_FRAMES, AnimationType, LOOP_ANIMATIONS } from '../data/animations';

interface AnimatedFoxProps {
  animation?: AnimationType;
  size?: number;
  onComplete?: () => void;
  loop?: boolean;
}

export default function AnimatedFox({ animation = 'idle', size = 120, onComplete, loop }: AnimatedFoxProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>(animation);
  const frameAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frames = ANIMATION_FRAMES[currentAnimation];
  const isLooping = loop !== undefined ? loop : LOOP_ANIMATIONS.includes(currentAnimation);
  const FRAME_DURATION = 300; // ms per frame

  useEffect(() => {
    setCurrentAnimation(animation);
    setFrameIndex(0);
    frameAnim.setValue(0);
  }, [animation]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const animateFrame = (index: number) => {
      // 用 Animated.timing 实现逐帧切换
      Animated.timing(frameAnim, {
        toValue: index,
        duration: FRAME_DURATION,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setFrameIndex(index);
        const next = index + 1;
        if (next < frames.length) {
          animateFrame(next);
        } else {
          if (isLooping) {
            animateFrame(0);
          } else {
            if (timerRef.current) clearTimeout(timerRef.current);
            setTimeout(() => {
              setCurrentAnimation('idle');
              setFrameIndex(0);
              frameAnim.setValue(0);
            }, 600);
            onComplete?.();
          }
        }
      });
    };

    animateFrame(0);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentAnimation, frames.length, isLooping]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={frames[frameIndex]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
