import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { middleWords } from '../../src/data/middleWords';
import { speakNormal, stopSpeaking, playEncourage, playWrong } from '../../src/utils/speech';
import { foxImages } from '../../assets/images';
import {
  DifficultyEngine,
  filterWordsByDifficulty,
  calculateStars,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
} from '../../src/utils/difficulty';

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

const WORDS_PER_LEVEL = 8;

// 阶段类型
type LearnPhase = 'QUESTION' | 'CORRECT' | 'SHOW_SENTENCE' | 'WRONG' | 'RESULT';

// 狐狸状态
type FoxState = 'idle' | 'correct' | 'wrong' | 'celebrate' | 'think';

interface GameState {
  words: typeof middleWords;
  currentIndex: number;
  phase: LearnPhase;
  isComplete: boolean;
  showResult: boolean;
  stars: number;
  foxState: FoxState;
  favorited: boolean;
  options: (typeof middleWords)[0][];
  selectedOption: string | null;
  correctCount: number;
}

function initGame(difficulty: number): GameState {
  const words = filterWordsByDifficulty(middleWords, difficulty, WORDS_PER_LEVEL);
  return {
    words,
    currentIndex: 0,
    phase: 'QUESTION',
    isComplete: false,
    showResult: false,
    stars: 0,
    foxState: 'idle',
    favorited: false,
    options: [],
    selectedOption: null,
    correctCount: 0,
  };
}

// 生成4个选项：1个正确 + 3个干扰
function generateOptions(
  correctWord: (typeof middleWords)[0],
  allWords: typeof middleWords,
): (typeof middleWords)[0][] {
  const options = [correctWord];
  const otherWords = allWords.filter((w) => w.word !== correctWord.word);

  // 随机选3个干扰项（优先同难度）
  const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
  for (const word of shuffled) {
    if (options.length >= 4) break;
    if (!options.find((o) => o.word === word.word)) {
      options.push(word);
    }
  }

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5);
}

export default function MiddleLearn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [engine] = useState(() => new DifficultyEngine('middle', MIN_DIFFICULTY));
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = initGame(engine.getDifficulty());
    return {
      ...initial,
      options: generateOptions(initial.words[0], initial.words),
    };
  });

  const [celebrateScale] = useState(new Animated.Value(1));
  const [starAnims] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  const isMountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = gameState.words[gameState.currentIndex];
  const totalWords = gameState.words.length;
  const progress = ((gameState.currentIndex + 1) / totalWords) * 100;
  const progressText = `${gameState.currentIndex + 1}/${totalWords}`;
  const accuracy = gameState.correctCount > 0
    ? Math.round((gameState.correctCount / (gameState.currentIndex + (gameState.phase !== 'QUESTION' ? 1 : 0))) * 100)
    : 0;

  // 自动播放发音
  useEffect(() => {
    if (!currentWord || gameState.isComplete) return;
    timerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        speakNormal(currentWord.word);
      }
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.currentIndex, currentWord?.word]);

  // 选对动画
  useEffect(() => {
    if (gameState.foxState === 'correct') {
      Animated.sequence([
        Animated.spring(celebrateScale, { toValue: 1.2, friction: 3, useNativeDriver: true }),
        Animated.spring(celebrateScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }
  }, [gameState.foxState]);

  // 星星动画
  useEffect(() => {
    if (gameState.showResult && gameState.stars > 0) {
      const animations = starAnims.slice(0, gameState.stars).map((anim, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.spring(anim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ])
      );
      Animated.parallel(animations).start();
    }
  }, [gameState.showResult]);

  // 处理选项点击
  const handleOptionPress = useCallback((selectedWord: (typeof middleWords)[0]) => {
    if (gameState.phase !== 'QUESTION' || !currentWord) return;

    const isCorrect = selectedWord.word === currentWord.word;

    if (isCorrect) {
      stopSpeaking();
      const newCorrectCount = gameState.correctCount + 1;
      const newIndex = gameState.currentIndex + 1;
      const isLevelComplete = newIndex >= gameState.words.length;

      // 先显示正确反馈
      setGameState((prev) => ({
        ...prev,
        correctCount: newCorrectCount,
        foxState: 'correct',
        phase: 'CORRECT',
        selectedOption: selectedWord.word,
      }));
      playEncourage();

      // 1.5秒后显示例句
      setTimeout(() => {
        if (isMountedRef.current) {
          setGameState((prev) => ({
            ...prev,
            phase: 'SHOW_SENTENCE',
          }));
        }
      }, 800);

      // 再过1.5秒进入下一个词
      setTimeout(() => {
        if (isMountedRef.current) {
          if (isLevelComplete) {
            const stars = calculateStars(newCorrectCount / gameState.words.length);
            engine.adjustDifficulty(newCorrectCount, gameState.words.length);
            setGameState((prev) => ({
              ...prev,
              isComplete: true,
              showResult: true,
              stars,
              foxState: 'celebrate',
              phase: 'RESULT',
            }));
          } else {
            const nextWord = gameState.words[newIndex];
            const nextOptions = generateOptions(nextWord, gameState.words);
            setGameState((prev) => ({
              ...prev,
              currentIndex: newIndex,
              correctCount: newCorrectCount,
              phase: 'QUESTION',
              foxState: 'idle',
              options: nextOptions,
              selectedOption: null,
            }));
          }
        }
      }, 2300);
    } else {
      // 选错了 - 显示记忆技巧
      setGameState((prev) => ({
        ...prev,
        foxState: 'wrong',
        phase: 'WRONG',
        selectedOption: selectedWord.word,
      }));
      playWrong();

      // 2秒后继续
      setTimeout(() => {
        if (isMountedRef.current) {
          speakNormal(currentWord.word);
          setTimeout(() => {
            if (isMountedRef.current) {
              setGameState((prev) => ({
                ...prev,
                phase: 'QUESTION',
                foxState: 'think',
                selectedOption: null,
              }));
            }
          }, 1000);
        }
      }, 2000);
    }
  }, [gameState.phase, currentWord, gameState.correctCount, gameState.currentIndex, gameState.words, engine]);

  const handleReplay = () => {
    if (currentWord) speakNormal(currentWord.word);
  };

  const handleFavorite = () => {
    setGameState((prev) => ({ ...prev, favorited: !prev.favorited }));
  };

  const handleBack = () => {
    stopSpeaking();
    router.push('/middle');
  };

  const handleNextLevel = () => {
    stopSpeaking();
    const nextDiff = engine.getDifficulty() + 1;
    const initial = initGame(nextDiff);
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0], initial.words),
    });
  };

  const handleRestart = () => {
    stopSpeaking();
    const initial = initGame(engine.getDifficulty());
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0], initial.words),
    });
  };

  // 获取狐狸图片
  const getFoxImage = () => {
    switch (gameState.foxState) {
      case 'correct':
        return foxImages.happy;
      case 'wrong':
        return foxImages.encouraging;
      case 'celebrate':
        return foxImages.excited;
      case 'think':
        return foxImages.stage1;
      default:
        return foxImages.stage0;
    }
  };

  // ========== 结果页 ==========
  if (gameState.showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          {/* 庆祝的狐狸 */}
          <Animated.View style={{ transform: [{ scale: celebrateScale }] }}>
            <Image source={foxImages.proud} style={styles.resultFoxImage} resizeMode="contain" />
          </Animated.View>

          {/* 星星 */}
          <View style={styles.starsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.starContainer,
                  index >= gameState.stars && styles.starEmpty,
                  {
                    opacity: starAnims[index],
                    transform: [
                      {
                        scale: starAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={require('../../assets/images/decorations/deco_star_lamp.jpg')}
                  style={styles.starImage}
                />
              </Animated.View>
            ))}
          </View>

          <Text style={styles.resultTitle}>
            {gameState.stars >= 2 ? '太棒了！' : '继续加油！'}
          </Text>
          
          {/* 正确率统计 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{gameState.correctCount}</Text>
              <Text style={styles.statLabel}>正确</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalWords}</Text>
              <Text style={styles.statLabel}>总题数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.accent }]}>
                {Math.round((gameState.correctCount / totalWords) * 100)}%
              </Text>
              <Text style={styles.statLabel}>正确率</Text>
            </View>
          </View>

          {/* 按钮组 */}
          <View style={styles.resultButtons}>
            {engine.getDifficulty() < MAX_DIFFICULTY && (
              <TouchableOpacity
                style={styles.resultButtonPrimary}
                onPress={handleNextLevel}
                activeOpacity={0.8}
              >
                <Text style={styles.resultButtonText}>下一关</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.resultButtonSecondary}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.resultButtonTextSecondary}>再来一次</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resultButtonHome}
              onPress={() => router.push('/middle')}
              activeOpacity={0.8}
            >
              <Text style={styles.resultButtonTextSecondary}>返回首页</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ========== 学习页 ==========
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部进度 */}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Image source={require('../../assets/images/decorations/deco_arrow_left.jpg')} style={styles.arrowImage} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: progress + '%' }]} />
        </View>

        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{progressText}</Text>
        </View>
      </View>

      {/* 小狐狸 */}
      <View style={styles.foxContainer}>
        <Image source={getFoxImage()} style={styles.foxImage} resizeMode="contain" />
      </View>

      {/* 中文释义（题目） */}
      <View style={styles.questionSection}>
        <Text style={styles.questionLabel}>请选择对应的英文单词：</Text>
        <View style={styles.meaningCard}>
          <Text style={styles.meaningText}>{currentWord?.meaning}</Text>
          {/* 喇叭按钮 */}
          <TouchableOpacity
            style={styles.speakerButton}
            onPress={handleReplay}
            activeOpacity={0.8}
          >
            <Text style={styles.speakerIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 状态提示 */}
      <View style={styles.statusContainer}>
        {gameState.phase === 'QUESTION' && (
          <Text style={styles.statusText}>选出正确的单词 👆</Text>
        )}
        {gameState.phase === 'CORRECT' && (
          <Text style={styles.statusTextCorrect}>✅ 答对了！</Text>
        )}
        {gameState.phase === 'SHOW_SENTENCE' && (
          <View style={styles.sentenceCard}>
            <Text style={styles.sentenceLabel}>📖 例句</Text>
            <Text style={styles.sentenceText}>{currentWord?.sentence}</Text>
          </View>
        )}
        {gameState.phase === 'WRONG' && currentWord?.memoryTip && (
          <View style={styles.tipCard}>
            <Text style={styles.tipLabel}>💡 记忆技巧</Text>
            <Text style={styles.tipText}>{currentWord.memoryTip}</Text>
          </View>
        )}
        {gameState.phase === 'WRONG' && !currentWord?.memoryTip && (
          <Text style={styles.statusTextWrong}>再想想哦~</Text>
        )}
      </View>

      {/* 4个选项：单词 + 音标 */}
      <View style={styles.optionsGrid}>
        {gameState.options.slice(0, 4).map((option, index) => {
          const isSelected = gameState.selectedOption === option.word;
          const isCorrect = option.word === currentWord?.word;
          const showCorrect = gameState.phase === 'WRONG' && isCorrect;
          const showWrong = isSelected && gameState.phase === 'WRONG' && !isCorrect;

          return (
            <TouchableOpacity
              key={`${option.word}-${index}`}
              style={[
                styles.optionCard,
                isSelected && gameState.phase === 'CORRECT' && styles.optionCorrect,
                isSelected && gameState.phase === 'SHOW_SENTENCE' && styles.optionCorrect,
                showCorrect && styles.optionHighlighted,
                showWrong && styles.optionWrong,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.8}
              disabled={gameState.phase !== 'QUESTION'}
            >
              <Text style={[
                styles.optionWord,
                (isSelected && (gameState.phase === 'CORRECT' || gameState.phase === 'SHOW_SENTENCE')) && styles.optionWordCorrect,
                showCorrect && styles.optionWordHighlighted,
                showWrong && styles.optionWordWrong,
              ]}>
                {option.word}
              </Text>
              <Text style={styles.optionPhonetic}>{option.phonetic}</Text>
              {showCorrect && (
                <View style={styles.correctBadge}>
                  <Text style={styles.correctBadgeText}>正确</Text>
                </View>
              )}
              {showWrong && (
                <View style={styles.wrongBadge}>
                  <Text style={styles.wrongBadgeText}>✗</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部按钮 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.bottomButton, gameState.favorited && styles.bottomButtonActive]}
          onPress={handleFavorite}
          activeOpacity={0.8}
        >
          <Image
            source={gameState.favorited ? foxImages.proud : foxImages.stage0}
            style={styles.bottomButtonIcon}
          />
          <Text style={styles.bottomButtonLabel}>
            {gameState.favorited ? '已收藏' : '收藏'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // 进度条
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  arrowImage: {
    width: 32,
    height: 32,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#E8EDFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  // 小狐狸
  foxContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  foxImage: {
    width: 80,
    height: 80,
  },
  // 题目区
  questionSection: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
  },
  questionLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  meaningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  meaningText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
  },
  speakerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerIcon: {
    fontSize: 20,
  },
  // 状态提示
  statusContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 24,
    minHeight: 50,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  statusTextCorrect: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  statusTextWrong: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  sentenceCard: {
    backgroundColor: '#EBF0FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
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
  tipCard: {
    backgroundColor: '#FFF5EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  tipLabel: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  // 选项网格
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  optionCard: {
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
  optionHighlighted: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FFF8',
  },
  optionWrong: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF0F0',
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
  optionWordHighlighted: {
    color: '#4ECDC4',
  },
  optionWordWrong: {
    color: '#FF6B6B',
  },
  optionPhonetic: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  correctBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  correctBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  wrongBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  wrongBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // 底部按钮
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 20,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    borderWidth: 2,
    borderColor: '#E8EDFF',
  },
  bottomButtonActive: {
    backgroundColor: '#FFD93D',
    borderColor: '#FFD93D',
  },
  bottomButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bottomButtonLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  // 结果页
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  resultFoxImage: {
    width: 160,
    height: 160,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  starContainer: {
    width: 50,
    height: 50,
  },
  starImage: {
    width: 50,
    height: 50,
  },
  starEmpty: {
    opacity: 0.3,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E8EDFF',
  },
  resultButtons: {
    marginTop: 30,
    gap: 12,
    width: '100%',
  },
  resultButtonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  resultButtonSecondary: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  resultButtonHome: {
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8EDFF',
  },
  resultButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  resultButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
});
