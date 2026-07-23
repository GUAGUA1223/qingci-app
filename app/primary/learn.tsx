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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { primaryWords } from '../../src/data/primaryWords';
import { speakPrimary, stopSpeaking, playEncourage, playWrong } from '../../src/utils/speech';
import { foxImages } from '../../assets/images';

const { width } = Dimensions.get('window');

// 每关单词数
const WORDS_PER_LEVEL = 4;

// 看义选词阶段类型
type LearnPhase = 'READING' | 'CHOOSING' | 'CORRECT' | 'WRONG' | 'RESULT';

// 狐狸状态
type FoxState = 'idle' | 'listen' | 'correct' | 'wrong' | 'celebrate' | 'think';

interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  audio: string;
  category: string;
}

interface GameState {
  words: VocabWord[];
  currentIndex: number;
  correctStreak: number;
  wrongStreak: number;
  phase: LearnPhase;
  isComplete: boolean;
  showResult: boolean;
  stars: number;
  foxState: FoxState;
  favorited: boolean;
  options: VocabWord[];
  selectedOption: string | null;
  correctCount: number;
}

function initGame(): GameState {
  // 随机取 WORDS_PER_LEVEL 个单词
  const shuffled = [...primaryWords].sort(() => Math.random() - 0.5);
  const words = shuffled.slice(0, WORDS_PER_LEVEL);
  const options = generateOptions(words[0], primaryWords);
  return {
    words,
    currentIndex: 0,
    correctStreak: 0,
    wrongStreak: 0,
    phase: 'READING',
    isComplete: false,
    showResult: false,
    stars: 0,
    foxState: 'idle',
    favorited: false,
    options,
    selectedOption: null,
    correctCount: 0,
  };
}

// 生成4个选项：1个正确单词 + 3个干扰项
function generateOptions(correctWord: VocabWord, allWords: VocabWord[]): VocabWord[] {
  const options: VocabWord[] = [correctWord];
  const otherWords = allWords.filter(
    (w) => w.word !== correctWord.word && w.meaning !== correctWord.meaning
  );

  // 随机选3个干扰项
  const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
  for (const w of shuffledOthers) {
    if (options.length >= 4) break;
    options.push(w);
  }

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5);
}

// 计算星星
function calculateStars(correctRate: number): number {
  if (correctRate >= 0.9) return 3;
  if (correctRate >= 0.7) return 2;
  if (correctRate >= 0.5) return 1;
  return 0;
}

export default function PrimaryLearn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [gameState, setGameState] = useState<GameState>(initGame);

  const [celebrateScale] = useState(new Animated.Value(1));
  const [starAnims] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  const isMountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = gameState.words[gameState.currentIndex];
  const totalWords = gameState.words.length;
  const progress = ((gameState.currentIndex + 1) / totalWords) * 100;
  const progressText = `${gameState.currentIndex + 1}/${totalWords}`;

  // 自动播放发音 - 进入页面后1秒播放
  useEffect(() => {
    if (!currentWord || gameState.isComplete) return;

    timerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setGameState((prev) => ({ ...prev, foxState: 'listen', phase: 'READING' }));
        speakPrimary(currentWord.word);
        // 播放完发音后进入选择阶段
        setTimeout(() => {
          if (isMountedRef.current) {
            setGameState((prev) => ({ ...prev, phase: 'CHOOSING', foxState: 'think' }));
          }
        }, 1500);
      }
    }, 800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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

  // 处理选项点击 - 看义选词：显示中文释义，选英文单词
  const handleOptionPress = useCallback(
    (optionWord: VocabWord) => {
      if (gameState.phase !== 'CHOOSING' || !currentWord) return;

      const isCorrect = optionWord.word === currentWord.word;

      if (isCorrect) {
        stopSpeaking();
        const newCorrectStreak = gameState.correctStreak + 1;
        const newCorrectCount = gameState.correctCount + 1;

        // 检查是否连续答对2次，通过一个词
        if (newCorrectStreak >= 2) {
          const newIndex = gameState.currentIndex + 1;
          const isLevelComplete = newIndex >= gameState.words.length;

          if (isLevelComplete) {
            // 关卡完成
            const stars = calculateStars(newCorrectCount / gameState.words.length);
            setGameState((prev) => ({
              ...prev,
              correctStreak: newCorrectStreak,
              correctCount: newCorrectCount,
              isComplete: true,
              showResult: true,
              stars,
              foxState: 'celebrate',
              phase: 'RESULT',
            }));
          } else {
            // 进入下一个词
            const nextWord = gameState.words[newIndex];
            const nextOptions = generateOptions(nextWord, primaryWords);
            setGameState((prev) => ({
              ...prev,
              currentIndex: newIndex,
              correctStreak: 0,
              wrongStreak: 0,
              correctCount: newCorrectCount,
              phase: 'READING',
              foxState: 'idle',
              options: nextOptions,
              selectedOption: null,
            }));
          }
        } else {
          // 还需要再答一次
          setGameState((prev) => ({
            ...prev,
            correctStreak: newCorrectStreak,
            correctCount: newCorrectCount,
            foxState: 'correct',
            phase: 'CORRECT',
            selectedOption: optionWord.word,
          }));

          playEncourage();

          // 2秒后再播一遍发音，进入下一轮
          setTimeout(() => {
            if (isMountedRef.current) {
              speakPrimary(currentWord.word);
              setTimeout(() => {
                if (isMountedRef.current) {
                  setGameState((prev) => ({
                    ...prev,
                    phase: 'CHOOSING',
                    foxState: 'think',
                    selectedOption: null,
                  }));
                }
              }, 1200);
            }
          }, 2000);
        }
      } else {
        // 选错了
        setGameState((prev) => ({
          ...prev,
          wrongStreak: prev.wrongStreak + 1,
          correctStreak: 0,
          foxState: 'wrong',
          phase: 'WRONG',
          selectedOption: optionWord.word,
        }));

        playWrong();

        // 1.5秒后显示正确答案，再播发音
        setTimeout(() => {
          if (isMountedRef.current) {
            speakPrimary(currentWord.word);
            setTimeout(() => {
              if (isMountedRef.current) {
                setGameState((prev) => ({
                  ...prev,
                  phase: 'CHOOSING',
                  foxState: 'think',
                  selectedOption: null,
                }));
              }
            }, 1200);
          }
        }, 1500);
      }
    },
    [gameState.phase, currentWord, gameState.correctStreak, gameState.correctCount, gameState.words]
  );

  // 重播发音
  const handleReplay = () => {
    if (!currentWord) return;
    stopSpeaking();
    speakPrimary(currentWord.word);
  };

  // 收藏
  const handleFavorite = () => {
    setGameState((prev) => ({ ...prev, favorited: !prev.favorited }));
  };

  // 下一关
  const handleNextLevel = () => {
    const newState = initGame();
    setGameState(newState);
  };

  // 再来一次
  const handleRestart = () => {
    const newState = initGame();
    setGameState(newState);
  };

  // 返回首页
  const handleBack = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    stopSpeaking();
    router.push('/primary');
  };

  // 获取狐狸图片
  const getFoxImage = () => {
    switch (gameState.foxState) {
      case 'correct':
        return foxImages.happy;
      case 'wrong':
        return foxImages.encouraging;
      case 'listen':
        return foxImages.excited;
      case 'think':
        return foxImages.stage1;
      case 'celebrate':
        return foxImages.excited;
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
            {gameState.stars >= 2 ? '太棒了' : '加油哦'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {gameState.stars >= 2 ? '你真是个小天才' : '继续努力吧'}
          </Text>

          {/* 按钮组 */}
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={styles.resultButtonPrimary}
              onPress={handleNextLevel}
              activeOpacity={0.8}
            >
              <Text style={styles.resultButtonText}>下一关</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resultButtonSecondary}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.resultButtonTextSecondary}>再来一次</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resultButtonHome}
              onPress={handleBack}
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
          <Image
            source={require('../../assets/images/decorations/deco_arrow_left.jpg')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: progress + '%' }]} />
        </View>

        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>{progressText}</Text>
        </View>
      </View>

      {/* 小狐狸 */}
      <View style={styles.foxContainer}>
        <Image source={getFoxImage()} style={styles.foxImage} resizeMode="contain" />
      </View>

      {/* 中文释义展示区 - 题目区 */}
      <View style={styles.meaningSection}>
        <View style={styles.meaningCard}>
          <Text style={styles.meaningText}>{currentWord?.meaning}</Text>
          <Text style={styles.meaningLabel}>这个词的意思是？</Text>
        </View>

        {/* 喇叭按钮 */}
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={handleReplay}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/packs/pack_academic.jpg')}
            style={styles.speakerImage}
          />
        </TouchableOpacity>
      </View>

      {/* 状态提示 */}
      <View style={styles.statusContainer}>
        {gameState.phase === 'READING' && (
          <Text style={styles.statusText}>听一听，这个词是什么意思？</Text>
        )}
        {gameState.phase === 'CHOOSING' && (
          <Text style={styles.statusText}>选一选，哪个是"{currentWord?.meaning}"？</Text>
        )}
        {gameState.phase === 'CORRECT' && (
          <Text style={styles.statusTextCorrect}>答对了！再听一遍</Text>
        )}
        {gameState.phase === 'WRONG' && (
          <Text style={styles.statusTextWrong}>再试试哦</Text>
        )}
      </View>

      {/* 4个英文单词选项 */}
      <View style={styles.optionsGrid}>
        {gameState.options.slice(0, 4).map((option, index) => {
          const isSelected = gameState.selectedOption === option.word;
          const isCorrect = option.word === currentWord?.word;
          const showCorrect = gameState.phase === 'WRONG' && isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                showCorrect && styles.optionHighlighted,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.8}
              disabled={gameState.phase !== 'CHOOSING'}
            >
              <Text style={styles.optionWordText}>{option.word}</Text>
              {showCorrect && (
                <View style={styles.correctBadge}>
                  <Text style={styles.correctBadgeText}>正确</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部按钮 */}
      <View style={styles.bottomButtons}>
        {/* 收藏 */}
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
    backgroundColor: colors.primary.background,
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
    backgroundColor: '#E0F5F3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.primary,
    borderRadius: 5,
  },
  progressBadge: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // 小狐狸
  foxContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  foxImage: {
    width: 100,
    height: 100,
  },
  // 中文释义区
  meaningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  meaningCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  meaningText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary.primary,
  },
  meaningLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
  },
  speakerButton: {
    width: 44,
    height: 44,
  },
  speakerImage: {
    width: 44,
    height: 44,
  },
  // 状态提示
  statusContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    color: '#666',
  },
  statusTextCorrect: {
    fontSize: 18,
    color: colors.primary.primary,
    fontWeight: '600',
  },
  statusTextWrong: {
    fontSize: 18,
    color: colors.primary.accent,
    fontWeight: '600',
  },
  // 选项网格
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
    justifyContent: 'center',
  },
  optionCard: {
    width: (width - 72) / 2,
    height: (width - 72) / 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary.primary,
  },
  optionHighlighted: {
    borderColor: colors.primary.primary,
    backgroundColor: '#E8FCFB',
  },
  optionWordText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary.text,
    textAlign: 'center',
  },
  correctBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: colors.primary.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  correctBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // 底部按钮
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  bottomButtonActive: {
    backgroundColor: '#FFD93D',
  },
  bottomButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bottomButtonLabel: {
    fontSize: 14,
    color: '#333',
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
    width: 180,
    height: 180,
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
    color: colors.primary.primary,
    marginTop: 20,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  resultButtons: {
    marginTop: 40,
    gap: 16,
    width: '100%',
  },
  resultButtonPrimary: {
    backgroundColor: colors.primary.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  resultButtonSecondary: {
    backgroundColor: '#FFD93D',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  resultButtonHome: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0F5F3',
  },
  resultButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  resultButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
