import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { speakPreschool, stopSpeaking } from '../../src/utils/speech';

const { width } = Dimensions.get('window');

// 欢迎关：3个最简单的词，100%能答对
const welcomeWords = [
  { word: 'cat', image: '🐱', hint: '🐱' },
  { word: 'dog', image: '🐶', hint: '🐶' },
  { word: 'sun', image: '☀️', hint: '☀️' },
];

// 干扰选项用明显不相关的emoji
const wrongOptions = [
  { image: '🚗', word: 'car' },
  { image: '🐟', word: 'fish' },
  { image: '🍎', word: 'apple' },
  { image: '📚', word: 'book' },
  { image: '🎩', word: 'hat' },
  { image: '🥛', word: 'milk' },
];

interface QuizOption {
  word: string;
  image: string;
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
  // 选2个干扰项（和正确答案差别大的）
  const distractors = shuffleArray(wrongOptions).slice(0, 2);
  const options: QuizOption[] = [
    { word: correct.word, image: correct.image, isCorrect: true },
    { word: distractors[0].word, image: distractors[0].image, isCorrect: false },
    { word: distractors[1].word, image: distractors[1].image, isCorrect: false },
  ];
  return shuffleArray(options);
}

export default function PreschoolWelcome() {
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
      // Auto-play word pronunciation
      setTimeout(() => {
        speakPreschool(welcomeWords[step - 1].word);
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
    speakPreschool('let us play');
    setStep(1);
  };

  const handleAnswer = (option: QuizOption) => {
    if (feedback !== 'none') return;

    // In welcome mode, correct answer is always guaranteed
    if (option.isCorrect) {
      setFeedback('correct');
      speakPreschool('great');

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
      // Wrong answer in welcome mode: just highlight the correct one gently
      // No negative feedback at all
      speakPreschool(welcomeWords[step - 1].word);
    }
  };

  const handleComplete = () => {
    speakPreschool('you are amazing');
    router.replace('/preschool' as any);
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
          <Text style={styles.introSub}>跟我来，一起玩~</Text>
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
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>太棒啦！</Text>
          <Text style={styles.completeSub}>🦊 你真厉害~</Text>
          <Text style={styles.stars}>⭐⭐⭐</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>继续学习 🚀</Text>
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

      {/* Word display */}
      <View style={styles.wordSection}>
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.wordEmoji}>{currentWord.image}</Text>
        </Animated.View>

        <TouchableOpacity style={styles.soundButton} onPress={() => speakPreschool(currentWord.word)}>
          <Text style={styles.soundEmoji}>🔊</Text>
        </TouchableOpacity>

        <Text style={styles.wordText}>{currentWord.word}</Text>

        {/* Hint: show the correct emoji as a hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintEmoji}>{currentWord.hint}</Text>
          <Text style={styles.hintArrow}>👆</Text>
        </View>
      </View>

      {/* Feedback */}
      {feedback === 'correct' && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackEmoji}>✨🎉✨</Text>
        </View>
      )}

      {/* Quiz options */}
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
            <Text style={styles.optionEmoji}>{option.image}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fox encouragement */}
      <View style={styles.foxSection}>
        <Text style={styles.foxEmoji}>🦊</Text>
        <Text style={styles.foxMessage}>
          {step === 1 ? '找一找~' : step === 2 ? '再来一个~' : '最后一个~'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
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
    color: '#FF6B9D',
    marginTop: 20,
  },
  introSub: {
    fontSize: 22,
    color: '#FF9ECD',
    marginTop: 12,
  },
  startButton: {
    backgroundColor: '#FF9ECD',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 40,
    shadowColor: '#FF9ECD',
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
    backgroundColor: '#FFE4EC',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9ECD',
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
  imageContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#FFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  wordEmoji: {
    fontSize: 90,
  },
  soundButton: {
    marginTop: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF9ECD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundEmoji: {
    fontSize: 22,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginTop: 8,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  hintEmoji: {
    fontSize: 28,
  },
  hintArrow: {
    fontSize: 18,
  },

  // Feedback
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  feedbackEmoji: {
    fontSize: 36,
  },

  // Options
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  optionButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#FFE4EC',
  },
  optionEmoji: {
    fontSize: 44,
  },
  optionCorrect: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FFF8',
  },

  // Fox
  foxSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 16,
  },
  foxMessage: {
    fontSize: 18,
    color: '#FF6B9D',
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginTop: 16,
  },
  completeSub: {
    fontSize: 24,
    color: '#FF9ECD',
    marginTop: 8,
  },
  stars: {
    fontSize: 40,
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 32,
    shadowColor: '#4ECDC4',
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
