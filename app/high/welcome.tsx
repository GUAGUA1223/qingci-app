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
import { highWords } from '../../src/data/highWords';
import { speakNormal, stopSpeaking } from '../../src/utils/speech';

const { width } = Dimensions.get('window');
const HIGH_COLORS = colors.high;

// 欢迎关：3个高频词快速体验速记模式
const welcomeWords = highWords
  .sort((a, b) => b.examFreq - a.examFreq)
  .slice(0, 3);

type WelcomeStep = 'INTRO' | 'DEMO_SPEED' | 'DEMO_FLIP' | 'DEMO_QUIZ' | 'COMPLETE';

interface QuizOption {
  meaning: string;
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

function generateQuiz(correctWord: typeof welcomeWords[0]): QuizOption[] {
  const correct = correctWord.meaning;
  const others = highWords
    .filter(w => w.word !== correctWord.word)
    .map(w => w.meaning);
  const shuffledOthers = shuffleArray(others).slice(0, 2);
  return shuffleArray([
    { meaning: correct, isCorrect: true },
    { meaning: shuffledOthers[0], isCorrect: false },
    { meaning: shuffledOthers[1], isCorrect: false },
  ]);
}

export default function HighWelcome() {
  const router = useRouter();
  const [step, setStep] = useState<WelcomeStep>('INTRO');
  const [wordIndex, setWordIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [bounceAnim] = useState(new Animated.Value(0));

  const currentWord = welcomeWords[wordIndex];

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
    outputRange: [0, -12],
  });

  useEffect(() => {
    if (step === 'DEMO_SPEED') {
      setTimeout(() => speakNormal(currentWord.word), 400);
    }
    if (step === 'DEMO_QUIZ') {
      setQuizOptions(generateQuiz(currentWord));
      setSelectedOption(null);
    }
    return () => stopSpeaking();
  }, [step, wordIndex]);

  const handleStart = () => {
    setStep('DEMO_SPEED');
  };

  // 速记展示：点击"认识"进入下一个
  const handleKnown = () => {
    if (wordIndex < 2) {
      setWordIndex(wordIndex + 1);
      setStep('DEMO_SPEED');
    } else {
      setStep('COMPLETE');
    }
  };

  // 点击"不认识"展示翻转
  const handleUnknown = () => {
    setStep('DEMO_FLIP');
  };

  // 翻转后进入选择题
  const handleFlip = () => {
    setStep('DEMO_QUIZ');
  };

  // 选择题回答
  const handleQuizAnswer = (option: QuizOption) => {
    if (selectedOption !== null) return;
    setSelectedOption(option.meaning);
    if (option.isCorrect) {
      speakNormal('correct');
    }

    setTimeout(() => {
      if (wordIndex < 2) {
        setWordIndex(wordIndex + 1);
        setStep('DEMO_SPEED');
      } else {
        setStep('COMPLETE');
      }
    }, 1200);
  };

  const handleComplete = () => {
    router.replace('/high');
  };

  // ========== INTRO ==========
  if (step === 'INTRO') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <Animated.View style={{ transform: [{ translateY: bounceTranslateY }] }}>
            <Text style={styles.foxEmoji}>🦊</Text>
          </Animated.View>
          <Text style={styles.introTitle}>轻词高中</Text>
          <Text style={styles.introSub}>高效速记 · 高考必备</Text>
          <View style={styles.introFeatures}>
            <Text style={styles.featureItem}>⚡ 速记模式 - 快速判断</Text>
            <Text style={styles.featureItem}>📝 选择题强化 - 深度记忆</Text>
            <Text style={styles.featureItem}>🔗 同义词反义词 - 举一反三</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startText}>开始体验</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========== COMPLETE ==========
  if (step === 'COMPLETE') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContent}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>体验完成！</Text>
          <Text style={styles.completeSub}>速记模式就是这样简单高效</Text>
          <Text style={styles.completeSub2}>坚持每天10分钟，轻松掌握高考词汇</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>开始正式学习</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========== SPEED (认识/不认识) ==========
  if (step === 'DEMO_SPEED') {
    const progress = ((wordIndex + 1) / 3) * 100;
    return (
      <SafeAreaView style={styles.container}>
        {/* 进度 */}
        <View style={styles.topBar}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{wordIndex + 1}/3</Text>
        </View>

        {/* 提示 */}
        <Text style={styles.stepHint}>判断一下，你认识这个词吗？</Text>

        {/* 单词卡片 */}
        <View style={styles.cardContainer}>
          <View style={styles.cardFront}>
            <Text style={styles.wordEmoji}>{currentWord.image}</Text>
            <Text style={styles.wordText}>{currentWord.word}</Text>
            <Text style={styles.phoneticText}>{currentWord.phonetic}</Text>
            <View style={styles.posTag}>
              <Text style={styles.posText}>{currentWord.partOfSpeech}</Text>
            </View>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.unknownBtn]} onPress={handleUnknown} activeOpacity={0.8}>
            <Text style={styles.unknownBtnText}>不认识</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.knownBtn]} onPress={handleKnown} activeOpacity={0.8}>
            <Text style={styles.knownBtnText}>认识 ✓</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========== FLIP (展示翻转效果) ==========
  if (step === 'DEMO_FLIP') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((wordIndex + 1) / 3) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{wordIndex + 1}/3</Text>
        </View>

        <Text style={styles.stepHint}>不认识？看看详细释义吧 👇</Text>

        <View style={styles.cardContainer}>
          <View style={styles.cardBackContent}>
            <Text style={styles.wordText}>{currentWord.word}</Text>
            <Text style={styles.meaningText}>{currentWord.meaning}</Text>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>例句</Text>
            <Text style={styles.sentenceText}>{currentWord.sentence}</Text>
            {currentWord.memoryTip && (
              <>
                <Text style={styles.sectionLabel}>记忆技巧</Text>
                <Text style={styles.tipText}>💡 {currentWord.memoryTip}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.quizBtn]} onPress={handleFlip} activeOpacity={0.8}>
            <Text style={styles.quizBtnText}>做选择题强化</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========== QUIZ ==========
  if (step === 'DEMO_QUIZ') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((wordIndex + 1) / 3) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{wordIndex + 1}/3</Text>
        </View>

        <Text style={styles.stepHint}>选择正确的释义：</Text>

        <View style={styles.quizContainer}>
          {quizOptions.map((option, index) => {
            const isSelected = selectedOption === option.meaning;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quizOption,
                  isSelected && option.isCorrect && styles.quizOptionCorrect,
                  isSelected && !option.isCorrect && styles.quizOptionWrong,
                ]}
                onPress={() => handleQuizAnswer(option)}
                activeOpacity={0.7}
                disabled={selectedOption !== null}
              >
                <Text style={[
                  styles.quizOptionText,
                  isSelected && option.isCorrect && styles.quizOptionTextCorrect,
                  isSelected && !option.isCorrect && styles.quizOptionTextWrong,
                ]}>
                  {option.meaning}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HIGH_COLORS.background,
  },
  // Intro
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  foxEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  introTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
  },
  introSub: {
    fontSize: 18,
    color: HIGH_COLORS.secondary,
    marginTop: 8,
    fontWeight: '500',
  },
  introFeatures: {
    marginTop: 32,
    gap: 12,
  },
  featureItem: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  startButton: {
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 40,
    shadowColor: HIGH_COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  stepHint: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  // Card
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: HIGH_COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 260,
  },
  cardFront: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 260,
  },
  cardBackContent: {
    padding: 24,
  },
  wordEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  wordText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  phoneticText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  posTag: {
    backgroundColor: 'rgba(30,144,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 10,
  },
  posText: {
    fontSize: 11,
    color: HIGH_COLORS.secondary,
    fontWeight: '600',
  },
  meaningText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sentenceText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
    marginTop: 4,
  },
  // Action buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  unknownBtn: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.4)',
  },
  unknownBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: HIGH_COLORS.accent,
  },
  knownBtn: {
    backgroundColor: 'rgba(30,144,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.4)',
  },
  knownBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: HIGH_COLORS.secondary,
  },
  quizBtn: {
    flex: 1,
    backgroundColor: HIGH_COLORS.secondary,
  },
  quizBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Quiz
  quizContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  quizOption: {
    backgroundColor: HIGH_COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  quizOptionCorrect: {
    backgroundColor: 'rgba(46,213,115,0.2)',
    borderColor: '#2ED573',
  },
  quizOptionWrong: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderColor: HIGH_COLORS.accent,
  },
  quizOptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  quizOptionTextCorrect: {
    color: '#2ED573',
    fontWeight: '600',
  },
  quizOptionTextWrong: {
    color: HIGH_COLORS.accent,
    fontWeight: '600',
  },
  // Complete
  completeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  completeEmoji: {
    fontSize: 72,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  completeSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  completeSub2: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 36,
    shadowColor: HIGH_COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
