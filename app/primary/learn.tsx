import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { primaryWords } from '../../src/data/primaryWords';
import { speakPrimary, stopSpeaking } from '../../src/utils/speech';
import { BottomNav } from '../../src/components/BottomNav';
import {
  DifficultyEngine,
  PRIMARY_WORDS_PER_LEVEL,
  filterWordsByDifficulty,
  calculateStars,
  shouldShowHint,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
} from '../../src/utils/difficulty';
import { PrimaryWord } from '../../src/types';

type TabType = 'meaning' | 'memory' | 'sentence';

interface GameState {
  words: PrimaryWord[];
  currentIndex: number;
  correctCount: number;
  wrongStreak: number;
  showHint: boolean;
  isComplete: boolean;
  showResult: boolean;
  stars: number;
}

export default function PrimaryLearn() {
  const router = useRouter();
  const [engine] = useState(() => new DifficultyEngine('primary', MIN_DIFFICULTY));
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>(() => initGame());
  const [activeTab, setActiveTab] = useState<TabType>('meaning');
  const [bounceAnim] = useState(new Animated.Value(0));

  function initGame(): GameState {
    const words = filterWordsByDifficulty(primaryWords, engine.getDifficulty(), PRIMARY_WORDS_PER_LEVEL);
    return {
      words,
      currentIndex: 0,
      correctCount: 0,
      wrongStreak: 0,
      showHint: false,
      isComplete: false,
      showResult: false,
      stars: 0,
    };
  }

  const currentWord = gameState.words[gameState.currentIndex];
  const progress = ((gameState.currentIndex + 1) / gameState.words.length) * 100;

  useEffect(() => {
    if (currentWord && !gameState.isComplete && !gameState.showResult) {
      const timer = setTimeout(() => {
        speakPrimary(currentWord.word);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentIndex, currentWord]);

  const handleSpeak = useCallback(() => {
    if (currentWord) {
      speakPrimary(currentWord.word);
    }
  }, [currentWord]);

  const handleOptionPress = useCallback((meaning: string) => {
    if (gameState.showHint || gameState.showResult) return;

    const isCorrect = meaning === currentWord.meaning;

    if (isCorrect) {
      stopSpeaking();
      speakPrimary('great');
      playBounceAnimation();

      setGameState(prev => {
        const newCorrectCount = prev.correctCount + 1;
        const newIndex = prev.currentIndex + 1;
        const isLevelComplete = newIndex >= prev.words.length;

        if (isLevelComplete) {
          const stars = calculateStars(newCorrectCount / prev.words.length);
          engine.adjustDifficulty(newCorrectCount, prev.words.length);

          return {
            ...prev,
            correctCount: newCorrectCount,
            isComplete: true,
            showResult: true,
            stars,
          };
        }

        return {
          ...prev,
          correctCount: newCorrectCount,
          currentIndex: newIndex,
          wrongStreak: 0,
          showHint: false,
        };
      });
    } else {
      setGameState(prev => {
        const newWrongStreak = prev.wrongStreak + 1;
        const showHint = shouldShowHint(newWrongStreak);

        if (showHint) {
          speakPrimary('try again');
        }

        return {
          ...prev,
          wrongStreak: newWrongStreak,
          showHint,
        };
      });
    }
  }, [gameState, currentWord, engine]);

  const playBounceAnimation = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setGameState(initGame());
  };

  const handleRestart = () => {
    setLevel(1);
    engine['currentDifficulty'] = MIN_DIFFICULTY;
    setGameState(initGame());
  };

  const handleBack = () => {
    stopSpeaking();
    router.back();
  };

  const getOptions = useCallback(() => {
    if (!currentWord) return [];
    const correct = currentWord.meaning;
    const others = gameState.words
      .filter(w => w.meaning !== correct)
      .map(w => w.meaning);
    const options = [correct, ...others.slice(0, 2)];
    return options.sort(() => Math.random() - 0.5);
  }, [currentWord, gameState.words]);

  const options = getOptions();

  const bounceScale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const tabs: { key: TabType; label: string; emoji: string }[] = [
    { key: 'meaning', label: '释义', emoji: '📖' },
    { key: 'memory', label: '记忆', emoji: '🧠' },
    { key: 'sentence', label: '例句', emoji: '💬' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meaning':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.meaningText}>{currentWord.meaning}</Text>
            <Text style={styles.phoneticText}>{currentWord.phonetic}</Text>
          </View>
        );
      case 'memory':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.memoryEmoji}>{currentWord.image}</Text>
            <Text style={styles.memoryTip}>{currentWord.memoryTip || '暂无记忆技巧'}</Text>
          </View>
        );
      case 'sentence':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sentenceText}>{currentWord.sentence}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (gameState.showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              {gameState.stars >= 2 ? '太棒了！' : '做得不错！'}
            </Text>

            <View style={styles.starsContainer}>
              {[0, 1, 2].map(index => (
                <Text
                  key={index}
                  style={[
                    styles.star,
                    index >= gameState.stars && styles.starEmpty,
                  ]}
                >
                  ⭐
                </Text>
              ))}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>✅</Text>
                <Text style={styles.statValue}>{gameState.correctCount}</Text>
                <Text style={styles.statLabel}>正确</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>📚</Text>
                <Text style={styles.statValue}>{gameState.words.length}</Text>
                <Text style={styles.statLabel}>总词数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>
                  {engine.getDifficulty() === 1 ? '🌱' : engine.getDifficulty() === 2 ? '🌿' : '🌳'}
                </Text>
                <Text style={styles.statValue}>Lv.{engine.getDifficulty()}</Text>
                <Text style={styles.statLabel}>难度</Text>
              </View>
            </View>

            <View style={styles.resultButtons}>
              {engine.getDifficulty() < MAX_DIFFICULTY && (
                <TouchableOpacity
                  style={[styles.resultButton, styles.nextLevelButton]}
                  onPress={handleNextLevel}
                >
                  <Text style={styles.resultButtonText}>下一关</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.resultButton, styles.retryButton]}
                onPress={handleRestart}
              >
                <Text style={styles.resultButtonText}>再练一次</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resultButton, styles.homeButton]}
                onPress={handleBack}
              >
                <Text style={styles.resultButtonText}>返回</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backEmoji}>👈</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: progress + '%' },
              ]}
            />
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>关{level}</Text>
          </View>
        </View>

        <Animated.View style={[styles.wordCard, { transform: [{ scale: bounceScale }] }]}>
          <Text style={styles.wordText}>{currentWord?.word}</Text>
          <Text style={styles.phoneticSmall}>{currentWord?.phonetic}</Text>
          <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
            <Text style={styles.speakEmoji}>🔊</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.quizSection}>
          <Text style={styles.quizTitle}>选择正确释义</Text>
          <View style={styles.optionsGrid}>
            {options.map((option, index) => {
              const isHighlighted = gameState.showHint && option === currentWord?.meaning;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    isHighlighted && styles.optionHighlighted,
                  ]}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    isHighlighted && styles.optionTextHighlighted,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {gameState.showHint && (
          <View style={styles.hintBanner}>
            <Text style={styles.hintText}>🤔 再想想？</Text>
          </View>
        )}

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}

        <View style={styles.difficultyBar}>
          <Text style={styles.difficultyLabel}>当前难度</Text>
          <View style={styles.difficultyDots}>
            {[1, 2, 3].map(d => (
              <View
                key={d}
                style={[
                  styles.difficultyDot,
                  d <= engine.getDifficulty() && styles.difficultyDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.difficultyEmoji}>
            {engine.getDifficulty() === 1 ? '🌱' : engine.getDifficulty() === 2 ? '🌿' : '🌳'}
          </Text>
        </View>
      </ScrollView>

      <BottomNav stage="primary" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backEmoji: {
    fontSize: 28,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.primary,
    borderRadius: 4,
  },
  levelBadge: {
    backgroundColor: colors.primary.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  wordCard: {
    backgroundColor: colors.primary.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary.text,
  },
  phoneticSmall: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  speakButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    backgroundColor: colors.primary.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakEmoji: {
    fontSize: 22,
  },
  quizSection: {
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: colors.primary.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionHighlighted: {
    backgroundColor: '#E8FEF9',
    borderWidth: 2,
    borderColor: colors.primary.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.primary.text,
  },
  optionTextHighlighted: {
    color: colors.primary.primary,
    fontWeight: '600',
  },
  hintBanner: {
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  hintText: {
    fontSize: 16,
    color: '#996600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.primary.primary,
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabLabelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: colors.primary.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  meaningText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary.text,
  },
  phoneticText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  memoryEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  memoryTip: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  sentenceText: {
    fontSize: 18,
    color: colors.primary.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  difficultyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  difficultyLabel: {
    fontSize: 14,
    color: '#888',
  },
  difficultyDots: {
    flexDirection: 'row',
    gap: 6,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  difficultyDotActive: {
    backgroundColor: colors.primary.primary,
  },
  difficultyEmoji: {
    fontSize: 20,
  },
  resultScroll: {
    flexGrow: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary.text,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  star: {
    fontSize: 50,
  },
  starEmpty: {
    opacity: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.text,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  resultButtons: {
    gap: 12,
    width: '100%',
    maxWidth: 280,
  },
  resultButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextLevelButton: {
    backgroundColor: colors.primary.primary,
  },
  retryButton: {
    backgroundColor: colors.primary.secondary,
  },
  homeButton: {
    backgroundColor: '#E0E0E0',
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
