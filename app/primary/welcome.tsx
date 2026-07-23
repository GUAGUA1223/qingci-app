import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { speakPrimary, stopSpeaking } from '../../src/utils/speech';
import { foxImages } from '../../assets/images';

const { width } = Dimensions.get('window');

// 欢迎关：3个最简单的词，100%能答对
const welcomeWords = [
  { word: 'cat', meaning: '猫' },
  { word: 'book', meaning: '书' },
  { word: 'pen', meaning: '钢笔' },
];

// 干扰选项（和正确答案不同的英文单词）
const distractorWords = [
  { word: 'dog', meaning: '狗' },
  { word: 'bag', meaning: '包' },
  { word: 'ruler', meaning: '尺子' },
  { word: 'pig', meaning: '猪' },
  { word: 'bear', meaning: '熊' },
  { word: 'duck', meaning: '鸭子' },
];

interface QuizOption {
  word: string;
  isCorrect: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateWelcomeQuiz(wordIndex: number): QuizOption[] {
  const correct = welcomeWords[wordIndex];
  const distractors = shuffleArray(distractorWords).slice(0, 3);
  const options: QuizOption[] = [
    { word: correct.word, isCorrect: true },
    { word: distractors[0].word, isCorrect: false },
    { word: distractors[1].word, isCorrect: false },
    { word: distractors[2].word, isCorrect: false },
  ];
  return shuffleArray(options);
}

export default function PrimaryWelcome() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=intro, 1-3=words, 4=complete
  const [quiz, setQuiz] = useState<QuizOption[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct'>('none');
  const [scaleAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (step >= 1 && step <= 3) {
      setQuiz(generateWelcomeQuiz(step - 1));
      setFeedback('none');
      setTimeout(() => {
        speakPrimary(welcomeWords[step - 1].word);
      }, 500);
    }
    return () => stopSpeaking();
  }, [step]);

  // Intro bounce animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bounceTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const handleStart = () => {
    speakPrimary('let us play');
    setStep(1);
  };

  const handleAnswer = (option: QuizOption) => {
    if (feedback !== 'none') return;

    if (option.isCorrect) {
      setFeedback('correct');
      speakPrimary('great');

      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        if (step < 3) {
          setStep(step + 1);
        } else {
          setStep(4);
        }
      }, 1500);
    } else {
      // 选错：重新播放正确单词发音，不给出负面反馈
      speakPrimary(welcomeWords[step - 1].word);
    }
  };

  const handleComplete = () => {
    speakPrimary('you are amazing');
    router.replace('/primary' as any);
  };

  // Intro screen
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <Animated.View style={{ transform: [{ translateY: bounceTranslateY }] }}>
            <Image source={foxImages.excited} style={styles.introFoxImage} resizeMode="contain" />
          </Animated.View>
          <Text style={styles.introTitle}>轻词小学</Text>
          <Text style={styles.introSub}>跟我来，一起学单词~</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startText}>开始 ✨</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Complete screen
  if (step === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContent}>
          <Image source={foxImages.proud} style={styles.completeFoxImage} resizeMode="contain" />
          <Text style={styles.completeTitle}>太棒啦！</Text>
          <Text style={styles.completeSub}>你学会了3个单词~</Text>
          <Text style={styles.stars}>⭐⭐⭐</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>继续学习 🚀</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz screen (steps 1-3) - 看义选词模式
  const currentWord = welcomeWords[step - 1];
  const progress = (step / 3) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressDots}>
          {step >= 1 ? '⭐' : '☆'} {step >= 2 ? '⭐' : '☆'} {step >= 3 ? '⭐' : '☆'}
        </Text>
      </View>

      {/* 中文释义展示 - 题目区 */}
      <View style={styles.wordSection}>
        <View style={styles.meaningCard}>
          <Text style={styles.meaningEmoji}>{currentWord.meaning}</Text>
        </View>

        {/* 喇叭按钮 */}
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => speakPrimary(currentWord.word)}
        >
          <Image
            source={require('../../assets/images/packs/pack_academic.jpg')}
            style={styles.soundIcon}
          />
        </TouchableOpacity>

        {/* 提示文字 */}
        <Text style={styles.hintText}>选一个英文单词 👆</Text>
      </View>

      {/* Feedback */}
      {feedback === 'correct' && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>✨ 答对了 ✨</Text>
        </View>
      )}

      {/* 4个英文单词选项 */}
      <View style={styles.optionsContainer}>
        {quiz.map((option, index) => (
          <TouchableOpacity
            key={`${option.word}-${index}`}
            style={[
              styles.optionButton,
              feedback === 'correct' && option.isCorrect && styles.optionCorrect,
            ]}
            onPress={() => handleAnswer(option)}
            activeOpacity={0.7}
            disabled={feedback !== 'none'}
          >
            <Text style={styles.optionWordText}>{option.word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fox encouragement */}
      <View style={styles.foxSection}>
        <Image source={foxImages.happy} style={styles.foxSmallImage} resizeMode="contain" />
        <Text style={styles.foxMessage}>
          {step === 1
            ? '找一找~'
            : step === 2
            ? '再来一个~'
            : '最后一个~'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.background,
  },

  // Intro styles
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  introFoxImage: {
    width: 160,
    height: 160,
  },
  introTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary.primary,
    marginTop: 20,
  },
  introSub: {
    fontSize: 20,
    color: colors.primary.secondary,
    marginTop: 12,
  },
  startButton: {
    backgroundColor: colors.primary.primary,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 40,
    shadowColor: colors.primary.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  startText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Progress styles
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 16,
    gap: 16,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0F5F3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.primary,
    borderRadius: 5,
  },
  progressDots: {
    fontSize: 18,
  },

  // Word display
  wordSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  meaningCard: {
    width: 160,
    height: 160,
    backgroundColor: '#FFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  meaningEmoji: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary.primary,
  },
  soundButton: {
    marginTop: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundIcon: {
    width: 28,
    height: 28,
  },
  hintText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },

  // Feedback
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  feedbackText: {
    fontSize: 24,
    color: colors.primary.primary,
    fontWeight: 'bold',
  },

  // Options
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  optionButton: {
    width: (width - 72) / 2,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#E0F5F3',
  },
  optionWordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.text,
  },
  optionCorrect: {
    borderColor: colors.primary.primary,
    backgroundColor: '#E8FCFB',
  },

  // Fox
  foxSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 16,
  },
  foxSmallImage: {
    width: 60,
    height: 60,
  },
  foxMessage: {
    fontSize: 18,
    color: colors.primary.primary,
    fontWeight: '600',
    marginTop: 4,
  },

  // Complete styles
  completeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  completeFoxImage: {
    width: 160,
    height: 160,
  },
  completeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary.primary,
    marginTop: 16,
  },
  completeSub: {
    fontSize: 20,
    color: colors.primary.secondary,
    marginTop: 8,
  },
  stars: {
    fontSize: 40,
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: colors.primary.primary,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 32,
    shadowColor: colors.primary.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
