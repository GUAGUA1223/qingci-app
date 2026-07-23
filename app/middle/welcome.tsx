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
import { speakNormal, stopSpeaking } from '../../src/utils/speech';

const { width } = Dimensions.get('window');

// 主题色
const COLORS = {
  primary: '#5B7FFF',
  secondary: '#8B9DC3',
  background: '#F5F7FF',
  card: '#FFFFFF',
  text: '#333333',
  accent: '#FF9A5C',
};

// 欢迎关：3个最简单高频词
const welcomeWords = [
  {
    word: 'hello',
    phonetic: '/həˈloʊ/',
    meaning: 'int. 你好',
    sentence: 'Hello, how are you today?',
  },
  {
    word: 'student',
    phonetic: '/ˈstuːdnt/',
    meaning: 'n. 学生',
    sentence: 'She is a good student.',
  },
  {
    word: 'learn',
    phonetic: '/lɜːrn/',
    meaning: 'v. 学习',
    sentence: 'I want to learn English well.',
  },
];

// 干扰选项
const wrongOptions = [
  { word: 'abandon', phonetic: '/əˈbændən/' },
  { word: 'beautiful', phonetic: '/ˈbjuːtɪfl/' },
  { word: 'environment', phonetic: '/ɪnˈvaɪrənmənt/' },
  { word: 'knowledge', phonetic: '/ˈnɒlɪdʒ/' },
  { word: 'government', phonetic: '/ˈɡʌvənmənt/' },
  { word: 'experience', phonetic: '/ɪkˈspɪəriəns/' },
];

interface QuizOption {
  word: string;
  phonetic: string;
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
  const distractors = shuffleArray(wrongOptions).slice(0, 3);
  const options: QuizOption[] = [
    { word: correct.word, phonetic: correct.phonetic, isCorrect: true },
    ...distractors.map((d) => ({ word: d.word, phonetic: d.phonetic, isCorrect: false })),
  ];
  return shuffleArray(options);
}

export default function MiddleWelcome() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=intro, 1-3=words, 4=complete
  const [quiz, setQuiz] = useState<QuizOption[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [scaleAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (step >= 1 && step <= 3) {
      setQuiz(generateWelcomeQuiz(step - 1));
      setFeedback('none');
      setTimeout(() => {
        speakNormal(welcomeWords[step - 1].word);
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
    speakNormal('welcome');
    setStep(1);
  };

  const handleAnswer = (option: QuizOption) => {
    if (feedback !== 'none') return;

    if (option.isCorrect) {
      setFeedback('correct');
      speakNormal('great');

      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();

      // 显示例句1.5秒后进入下一关
      setTimeout(() => {
        if (step < 3) {
          setStep(step + 1);
        } else {
          setStep(4);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      // 选错后自动恢复
      setTimeout(() => {
        setFeedback('none');
      }, 1000);
    }
  };

  const handleComplete = () => {
    speakNormal('you are amazing');
    router.replace('/middle' as any);
  };

  // Intro screen
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <Animated.View style={{ transform: [{ translateY: bounceTranslateY }] }}>
            <Text style={styles.foxEmoji}>🦊</Text>
          </Animated.View>
          <Text style={styles.introTitle}>轻词</Text>
          <Text style={styles.introSub}>初中英语 · 轻松记单词</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startText}>开始挑战 ✨</Text>
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
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>挑战完成！</Text>
          <Text style={styles.completeSub}>🦊 你已经掌握了基础词汇</Text>
          <Text style={styles.stars}>⭐⭐⭐</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>开始正式学习 🚀</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz screen (steps 1-3)
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

      {/* Word display - show meaning, user picks the word */}
      <View style={styles.wordSection}>
        <Animated.View style={[styles.meaningContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.meaningText}>{currentWord.meaning}</Text>
          <TouchableOpacity
            style={styles.soundButton}
            onPress={() => speakNormal(currentWord.word)}
          >
            <Text style={styles.soundEmoji}>🔊</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.questionHint}>选出对应的英文单词 👇</Text>
      </View>

      {/* Feedback - show sentence on correct */}
      {feedback === 'correct' && (
        <View style={styles.sentenceCard}>
          <Text style={styles.sentenceLabel}>📖 例句</Text>
          <Text style={styles.sentenceText}>{currentWord.sentence}</Text>
        </View>
      )}

      {/* Quiz options - 4 options with word + phonetic */}
      <View style={styles.optionsContainer}>
        {quiz.map((option, index) => {
          const isCorrectOption = option.isCorrect;
          return (
            <TouchableOpacity
              key={`${option.word}-${index}`}
              style={[
                styles.optionButton,
                feedback === 'correct' && isCorrectOption && styles.optionCorrect,
                feedback === 'wrong' && !isCorrectOption && styles.optionDimmed,
              ]}
              onPress={() => handleAnswer(option)}
              activeOpacity={0.7}
              disabled={feedback !== 'none'}
            >
              <Text style={[
                styles.optionWord,
                feedback === 'correct' && isCorrectOption && styles.optionWordCorrect,
              ]}>
                {option.word}
              </Text>
              <Text style={styles.optionPhonetic}>{option.phonetic}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Fox encouragement */}
      <View style={styles.foxSection}>
        <Text style={styles.foxEmoji}>🦊</Text>
        <Text style={styles.foxMessage}>
          {step === 1 ? '试试看~' : step === 2 ? '再来一个~' : '最后一个~'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Intro styles
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  foxEmoji: {
    fontSize: 100,
    textAlign: 'center',
  },
  introTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  introSub: {
    fontSize: 18,
    color: COLORS.secondary,
    marginTop: 12,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  startText: {
    color: '#FFF',
    fontSize: 22,
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
    backgroundColor: '#E8EDFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressDots: {
    fontSize: 18,
  },

  // Word display
  wordSection: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  meaningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  meaningText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundEmoji: {
    fontSize: 22,
  },
  questionHint: {
    fontSize: 15,
    color: COLORS.secondary,
    marginTop: 16,
  },

  // Sentence card (shown on correct)
  sentenceCard: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: '#EBF0FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sentenceLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  sentenceText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },

  // Options
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  optionButton: {
    width: (width - 56) / 2,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCorrect: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FFF8',
  },
  optionDimmed: {
    opacity: 0.5,
  },
  optionWord: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  optionWordCorrect: {
    color: '#4ECDC4',
  },
  optionPhonetic: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: 'center',
  },

  // Fox
  foxSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 16,
  },
  foxMessage: {
    fontSize: 18,
    color: COLORS.primary,
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
  completeEmoji: {
    fontSize: 80,
  },
  completeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
  },
  completeSub: {
    fontSize: 18,
    color: COLORS.secondary,
    marginTop: 8,
  },
  stars: {
    fontSize: 40,
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 32,
    shadowColor: COLORS.primary,
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
