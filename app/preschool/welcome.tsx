import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { preschoolWords } from '../../src/data/preschoolWords';
import { speakPreschool } from '../../src/utils/speech';
import { FoxMascot } from '../../src/components/FoxMascot';

const { width } = Dimensions.get('window');

// 取前3个最简单的词作为欢迎体验
const welcomeWords = preschoolWords.slice(0, 3);

export default function PreschoolWelcome() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // 动画值
  const [starAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));

  const currentWord = welcomeWords[currentIndex];

  // 获取3个选项（正确答案+2个干扰项）
  const getOptions = () => {
    const correct = currentWord.image;
    const others = welcomeWords
      .filter(w => w.image !== correct)
      .map(w => w.image);
    const options = [correct, ...others.slice(0, 2)];
    // 打乱顺序
    return options.sort(() => Math.random() - 0.5);
  };

  const [options] = useState(getOptions);

  useEffect(() => {
    // 自动发音
    const timer = setTimeout(() => {
      speakPreschool(currentWord.word);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleOptionPress = (image: string) => {
    if (showHint || showSuccess) return;
    
    setSelectedOption(image);

    if (image === currentWord.image) {
      // 答对了
      playStarAnimation();
      speakPreschool('great');
      
      setTimeout(() => {
        setShowSuccess(true);
        setSelectedOption(null);
        setWrongCount(0);
        
        // 2秒后进入下一题或完成
        setTimeout(() => {
          setShowSuccess(false);
          if (currentIndex < welcomeWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            // 全部完成，展示大庆祝
            setShowCelebration(true);
            speakPreschool('wonderful');
          }
        }, 1500);
      }, 1000);
    } else {
      // 答错了，不给X，只给提示
      setWrongCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          // 连续3次答错，自动高亮正确答案
          setShowHint(true);
        }
        return newCount;
      });
      speakPreschool('try again');
      setTimeout(() => setSelectedOption(null), 800);
    }
  };

  const playStarAnimation = () => {
    Animated.sequence([
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(starAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEnterLearning = () => {
    router.push('/preschool/learn');
  };

  const starScale = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  if (showCelebration) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.celebrationContainer}>
          {/* 大庆祝动画 */}
          <Animated.Text style={[styles.bigStar, { transform: [{ scale: starScale }] }]}>
            ⭐
          </Animated.Text>
          
          {/* 跳舞的狐狸 */}
          <Animated.View style={[styles.dancingFox, { 
            transform: [{ 
              translateY: bounceAnim 
            }] 
          }]}>
            <FoxMascot size={150} mood="happy" animated />
          </Animated.View>
          
          {/* 庆祝文字（零文字风格，用emoji表示） */}
          <View style={styles.celebrationText}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationEmoji}>✨</Text>
            <Text style={styles.celebrationEmoji}>✨</Text>
            <Text style={styles.celebrationEmoji}>🎉</Text>
          </View>

          {/* 继续按钮 */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleEnterLearning}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>📚</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部进度点 */}
      <View style={styles.progressDots}>
        {welcomeWords.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              index < currentIndex && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      {/* 小狐狸 */}
      <View style={styles.foxContainer}>
        <FoxMascot size={60} mood={showHint ? 'thinking' : 'happy'} />
      </View>

      {/* 中央内容 */}
      <View style={styles.contentContainer}>
        {/* 大emoji */}
        <TouchableOpacity style={styles.imageContainer} activeOpacity={0.9}>
          <Text style={styles.wordEmoji}>{currentWord.image}</Text>
        </TouchableOpacity>

        {/* 星星动画覆盖层 */}
        {showSuccess && (
          <Animated.Text style={[styles.starOverlay, { transform: [{ scale: starScale }] }]}>
            ⭐
          </Animated.Text>
        )}

        {/* 提示文字 */}
        {showHint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintEmoji}>🤔</Text>
          </View>
        )}
      </View>

      {/* 选项按钮 */}
      <View style={styles.optionsContainer}>
        {options.map((image, index) => {
          const isCorrect = image === currentWord.image;
          const isHighlighted = showHint && isCorrect;
          const isSelected = selectedOption === image;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isHighlighted && styles.optionHighlighted,
                isSelected && !isCorrect && styles.optionSelected,
              ]}
              onPress={() => handleOptionPress(image)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionEmoji}>{image}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部小狐狸 */}
      <View style={styles.bottomFox}>
        <FoxMascot size={40} mood="happy" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preschool.background,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD93D',
    opacity: 0.5,
  },
  dotActive: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  dotCompleted: {
    backgroundColor: '#FF9ECD',
    opacity: 1,
  },
  foxContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: colors.preschool.card,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  wordEmoji: {
    fontSize: 100,
  },
  starOverlay: {
    position: 'absolute',
    fontSize: 80,
    top: -20,
    right: -20,
  },
  hintContainer: {
    position: 'absolute',
    bottom: -50,
  },
  hintEmoji: {
    fontSize: 50,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  optionButton: {
    width: 80,
    height: 80,
    backgroundColor: colors.preschool.card,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionHighlighted: {
    backgroundColor: '#FFD93D',
    transform: [{ scale: 1.1 }],
    borderWidth: 3,
    borderColor: colors.preschool.primary,
  },
  optionSelected: {
    opacity: 0.5,
  },
  optionEmoji: {
    fontSize: 45,
  },
  bottomFox: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.6,
  },
  // 庆祝页面样式
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.preschool.background,
  },
  bigStar: {
    fontSize: 80,
    marginBottom: 20,
  },
  dancingFox: {
    marginVertical: 20,
  },
  celebrationText: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 20,
  },
  celebrationEmoji: {
    fontSize: 40,
  },
  continueButton: {
    marginTop: 40,
    width: 120,
    height: 120,
    backgroundColor: colors.preschool.primary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.preschool.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 50,
  },
});
