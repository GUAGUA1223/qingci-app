import React, { useState, useEffect, useRef } from 'react';
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
import { preschoolWords } from '../../src/data/preschoolWords';
import { wordImages, getWordImage, getAllWordKeys } from '../../src/data/wordImages';
import { speakPreschool, stopSpeaking } from '../../src/utils/speech';
import { foxImages } from '../../assets/images';

const { width, height } = Dimensions.get('window');

type LearnPhase = 'LISTENING' | 'CHOOSING' | 'CORRECT' | 'WRONG' | 'RESULT';
type FoxState = 'idle' | 'listen' | 'correct' | 'wrong' | 'celebrate' | 'think';

interface GameState {
  words: typeof preschoolWords;
  currentIndex: number;
  correctStreak: number;
  wrongStreak: number;
  phase: LearnPhase;
  isComplete: boolean;
  showResult: boolean;
  stars: number;
  foxState: FoxState;
  favorited: boolean;
  mastered: boolean;
  options: string[];
  selectedOption: string | null;
  correctCount: number;
}

function initGame(): GameState {
  // 随机选10个词
  const shuffled = [...preschoolWords].sort(() => Math.random() - 0.5);
  const words = shuffled.slice(0, Math.min(10, shuffled.length));
  return {
    words,
    currentIndex: 0,
    correctStreak: 0,
    wrongStreak: 0,
    phase: 'LISTENING',
    isComplete: false,
    showResult: false,
    stars: 0,
    foxState: 'idle',
    favorited: false,
    mastered: false,
    options: [],
    selectedOption: null,
    correctCount: 0,
  };
}

function generateOptions(correctKey: string): string[] {
  const options = [correctKey];
  const allKeys = getAllWordKeys();
  const otherKeys = allKeys.filter(k => k !== correctKey);

  while (options.length < 4 && otherKeys.length > 0) {
    const idx = Math.floor(Math.random() * otherKeys.length);
    const key = otherKeys.splice(idx, 1)[0];
    if (!options.includes(key)) options.push(key);
  }

  return options.sort(() => Math.random() - 0.5);
}

export default function PreschoolLearn() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = initGame();
    return {
      ...initial,
      options: generateOptions(initial.words[0]?.image || ''),
    };
  });

  const [celebrateScale] = useState(new Animated.Value(1));
  const [targetGlow] = useState(new Animated.Value(0));
  const isMountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = gameState.words[gameState.currentIndex];
  const totalWords = gameState.words.length;
  const progress = ((gameState.currentIndex + 1) / totalWords) * 100;

  // 目标图片金色高亮动画
  useEffect(() => {
    if (gameState.phase === 'LISTENING' || gameState.phase === 'CHOOSING') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(targetGlow, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(targetGlow, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      targetGlow.stopAnimation();
      targetGlow.setValue(0);
    }
  }, [gameState.phase]);

  // 自动播放发音
  useEffect(() => {
    if (!currentWord || gameState.isComplete) return;

    timerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setGameState(prev => ({ ...prev, foxState: 'listen', phase: 'LISTENING' }));
        speakPreschool(currentWord.word);

        setTimeout(() => {
          if (isMountedRef.current) {
            setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'think' }));
          }
        }, 1500);
      }
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.currentIndex]);

  // 选对动画
  useEffect(() => {
    if (gameState.foxState === 'correct') {
      Animated.sequence([
        Animated.spring(celebrateScale, { toValue: 1.15, friction: 3, useNativeDriver: true }),
        Animated.spring(celebrateScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }
  }, [gameState.foxState]);

  const handleOptionPress = (wordKey: string) => {
    if (gameState.phase !== 'CHOOSING' || !currentWord) return;

    const isCorrect = wordKey === currentWord.image;

    if (isCorrect) {
      stopSpeaking();
      const newCorrectStreak = gameState.correctStreak + 1;
      const newCorrectCount = gameState.correctCount + 1;

      if (newCorrectStreak >= 2) {
        // 连续答对2次，进入下一个词
        const newIndex = gameState.currentIndex + 1;
        const isLevelComplete = newIndex >= gameState.words.length;

        if (isLevelComplete) {
          const stars = Math.min(3, Math.ceil((newCorrectCount / gameState.words.length) * 3));
          setGameState(prev => ({
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
          const nextWord = gameState.words[newIndex];
          setGameState(prev => ({
            ...prev,
            currentIndex: newIndex,
            correctStreak: 0,
            wrongStreak: 0,
            correctCount: newCorrectCount,
            phase: 'LISTENING',
            foxState: 'idle',
            favorited: false,
            mastered: false,
            options: generateOptions(nextWord?.image || ''),
            selectedOption: null,
          }));
        }
      } else {
        // 还需要再答一次
        setGameState(prev => ({
          ...prev,
          correctStreak: newCorrectStreak,
          correctCount: newCorrectCount,
          foxState: 'correct',
          phase: 'CORRECT',
          selectedOption: wordKey,
        }));

        setTimeout(() => {
          if (isMountedRef.current) {
            speakPreschool(currentWord.word);
            setTimeout(() => {
              if (isMountedRef.current) {
                setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'think', selectedOption: null }));
              }
            }, 1000);
          }
        }, 1500);
      }
    } else {
      // 选错了
      setGameState(prev => ({
        ...prev,
        wrongStreak: prev.wrongStreak + 1,
        correctStreak: 0,
        foxState: 'wrong',
        phase: 'WRONG',
        selectedOption: wordKey,
      }));

      setTimeout(() => {
        if (isMountedRef.current) {
          speakPreschool(currentWord.word);
          setTimeout(() => {
            if (isMountedRef.current) {
              setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'think', selectedOption: null }));
            }
          }, 1200);
        }
      }, 1500);
    }
  };

  const handleReplay = () => {
    if (currentWord) {
      speakPreschool(currentWord.word);
    }
  };

  const handleFavorite = () => {
    setGameState(prev => ({ ...prev, favorited: !prev.favorited }));
  };

  const handleMastered = () => {
    setGameState(prev => ({ ...prev, mastered: !prev.mastered }));
  };

  const handleBack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopSpeaking();
    router.push('/preschool');
  };

  const handleRestart = () => {
    const initial = initGame();
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0]?.image || ''),
    });
  };

  const handleNextLevel = () => {
    handleRestart();
  };

  const getFoxImage = () => {
    switch (gameState.foxState) {
      case 'correct': return foxImages.happy;
      case 'wrong': return foxImages.encouraging;
      case 'listen': return foxImages.excited;
      case 'think': return foxImages.stage1;
      case 'celebrate': return foxImages.excited;
      default: return foxImages.stage0;
    }
  };

  // ========== 结果页 ==========
  if (gameState.showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Animated.View style={{ transform: [{ scale: celebrateScale }] }}>
            <Image source={foxImages.proud} style={styles.resultFoxImage} resizeMode="contain" />
          </Animated.View>

          <Text style={styles.resultEmoji}>
            {gameState.stars >= 2 ? '🎉' : '💪'}
          </Text>

          <Text style={styles.resultTitle}>
            {gameState.stars >= 2 ? '太棒了' : '加油哦'}
          </Text>

          <View style={styles.starsRow}>
            {[0, 1, 2].map(i => (
              <Text key={i} style={[styles.starIcon, i >= gameState.stars && styles.starEmpty]}>⭐</Text>
            ))}
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.resultButtonPrimary} onPress={handleNextLevel} activeOpacity={0.8}>
              <Text style={styles.resultButtonText}>🎯 下一关</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultButtonSecondary} onPress={handleRestart} activeOpacity={0.8}>
              <Text style={styles.resultButtonTextDark}>🔄 再来一次</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultButtonHome} onPress={handleBack} activeOpacity={0.8}>
              <Text style={styles.resultButtonTextDark}>🏠 首页</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ========== 学习页 ==========
  const targetImage = currentWord ? getWordImage(currentWord.image) : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部进度条 */}
      <View style={styles.progressContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: progress + '%' }]} />
        </View>
        <Text style={styles.progressText}>{gameState.currentIndex + 1}/{totalWords}</Text>
      </View>

      {/* 小狐狸（小巧，右上区域） */}
      <View style={styles.foxContainer}>
        <Image source={getFoxImage()} style={styles.foxImage} resizeMode="contain" />
      </View>

      {/* 大图展示区 - 目标单词配图，占屏幕50% */}
      <View style={styles.mainImageSection}>
        <Animated.View style={[
          styles.mainImageWrapper,
          {
            shadowOpacity: targetGlow.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.5] }),
            shadowRadius: targetGlow.interpolate({ inputRange: [0, 1], outputRange: [8, 24] }),
            borderColor: targetGlow.interpolate({ inputRange: [0, 1], outputRange: ['#FFD93D', '#FFA500'] }),
          }
        ]}>
          {targetImage ? (
            <Image source={targetImage} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <View style={styles.mainImagePlaceholder}>
              <Text style={styles.mainImagePlaceholderText}>🦊</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* 4个选项 - 横排小图 */}
      <View style={styles.optionsRow}>
        {gameState.options.slice(0, 4).map((wordKey, index) => {
          const isSelected = gameState.selectedOption === wordKey;
          const isCorrect = wordKey === currentWord?.image;
          const showCorrect = gameState.phase === 'WRONG' && isCorrect;
          const image = getWordImage(wordKey);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                showCorrect && styles.optionCorrect,
                gameState.phase !== 'CHOOSING' && styles.optionDisabled,
              ]}
              onPress={() => handleOptionPress(wordKey)}
              activeOpacity={0.7}
              disabled={gameState.phase !== 'CHOOSING'}
            >
              {image ? (
                <Image source={image} style={styles.optionImage} resizeMode="contain" />
              ) : (
                <View style={styles.optionPlaceholder}>
                  <Text style={styles.optionPlaceholderText}>{wordKey}</Text>
                </View>
              )}
              {showCorrect && (
                <View style={styles.correctBadge}>
                  <Text style={styles.correctBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部3个操作按钮：🔊重播 ⭐我喜欢 ✅我学会了 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleReplay} activeOpacity={0.7}>
          <Text style={styles.actionEmoji}>🔊</Text>
          <Text style={styles.actionLabel}>重播</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, gameState.favorited && styles.actionButtonActive]}
          onPress={handleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>{gameState.favorited ? '⭐' : '☆'}</Text>
          <Text style={styles.actionLabel}>{gameState.favorited ? '我喜欢' : '喜欢'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, gameState.mastered && styles.actionButtonMastered]}
          onPress={handleMastered}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>{gameState.mastered ? '✅' : '○'}</Text>
          <Text style={styles.actionLabel}>{gameState.mastered ? '已学会' : '学会了'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  // 进度条
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9ECD',
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#FFE5EF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9ECD',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9ECD',
    minWidth: 40,
    textAlign: 'right',
  },
  // 小狐狸
  foxContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  foxImage: {
    width: 72,
    height: 72,
  },
  // 大图展示区（占屏50%）
  mainImageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  mainImageWrapper: {
    width: width * 0.7,
    height: height * 0.35,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD93D',
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  mainImage: {
    width: '90%',
    height: '90%',
  },
  mainImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
  },
  mainImagePlaceholderText: {
    fontSize: 64,
  },
  // 4个选项横排
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  optionCard: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  optionSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FCFB',
  },
  optionCorrect: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FCFB',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionImage: {
    width: '85%',
    height: '85%',
  },
  optionPlaceholder: {
    width: '85%',
    height: '85%',
    backgroundColor: '#FFE5EF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionPlaceholderText: {
    fontSize: 10,
    color: '#FF9ECD',
    fontWeight: '600',
  },
  correctBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4ECDC4',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // 底部3个操作按钮
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE5EF',
    gap: 4,
    minWidth: 80,
  },
  actionButtonActive: {
    backgroundColor: '#FFD93D',
    borderColor: '#FFD93D',
  },
  actionButtonMastered: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 12,
    color: '#666',
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
  resultEmoji: {
    fontSize: 48,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9ECD',
    marginTop: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  starIcon: {
    fontSize: 32,
  },
  starEmpty: {
    opacity: 0.3,
  },
  resultButtons: {
    marginTop: 32,
    gap: 12,
    width: '100%',
  },
  resultButtonPrimary: {
    backgroundColor: '#FF9ECD',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE5EF',
  },
  resultButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  resultButtonTextDark: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
