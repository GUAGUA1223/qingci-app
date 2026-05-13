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
import { preschoolWords } from '../../src/data/preschoolWords';
import { wordImages, getWordImage, getAllWordKeys } from '../../src/data/wordImages';
import { speakPreschool, stopSpeaking, playEncourage, playWrong } from '../../src/utils/speech';
import { foxImages } from '../../assets/images';
import {
  DifficultyEngine,
  PRESCHOOL_WORDS_PER_LEVEL,
  filterWordsByDifficulty,
  calculateStars,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
} from '../../src/utils/difficulty';

const { width } = Dimensions.get('window');

// 阶段类型
type LearnPhase = 'LISTENING' | 'CHOOSING' | 'CORRECT' | 'WRONG' | 'RESULT';

// 狐狸状态
type FoxState = 'idle' | 'listen' | 'correct' | 'wrong' | 'celebrate' | 'think';

interface GameState {
  words: typeof preschoolWords;
  currentIndex: number;
  correctStreak: number; // 当前单词连续正确次数
  wrongStreak: number;
  phase: LearnPhase;
  isComplete: boolean;
  showResult: boolean;
  stars: number;
  foxState: FoxState;
  favorited: boolean;
  options: string[]; // 4个选项的单词
  selectedOption: string | null;
  correctCount: number; // 总正确次数
}

function initGame(difficulty: number): GameState {
  const words = filterWordsByDifficulty(preschoolWords, difficulty, PRESCHOOL_WORDS_PER_LEVEL);
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
    options: [],
    selectedOption: null,
    correctCount: 0,
  };
}

// 生成4个选项：1个正确答案 + 3个干扰项
function generateOptions(correctWord: string, allWords: string[]): string[] {
  const options = [correctWord];
  const otherWords = allWords.filter(w => w !== correctWord);
  
  // 随机选3个干扰项
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length);
    const word = otherWords.splice(randomIndex, 1)[0];
    if (!options.includes(word)) {
      options.push(word);
    }
  }
  
  // 如果不够4个，再从所有key补充
  if (options.length < 4) {
    const allKeys = getAllWordKeys();
    for (const key of allKeys) {
      if (!options.includes(key)) {
        options.push(key);
        if (options.length >= 4) break;
      }
    }
  }
  
  // 打乱顺序
  return options.sort(() => Math.random() - 0.5);
}

export default function PreschoolLearn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [engine] = useState(() => new DifficultyEngine('preschool', MIN_DIFFICULTY));
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = initGame(engine.getDifficulty());
    return {
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    };
  });

  const [bounceAnim] = useState(new Animated.Value(0));
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

    // 1秒后自动播放发音
    timerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setGameState(prev => ({ ...prev, foxState: 'listen', phase: 'LISTENING' }));
        speakPreschool(currentWord.word);
      }
    }, 1000);

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

  // 处理选项点击
  const handleOptionPress = useCallback((word: string) => {
    if (gameState.phase !== 'CHOOSING' || !currentWord) return;

    const isCorrect = word === currentWord.image;

    if (isCorrect) {
      stopSpeaking();
      const newCorrectStreak = gameState.correctStreak + 1;
      const newCorrectCount = gameState.correctCount + 1;

      // 检查是否连续答对2次
      if (newCorrectStreak >= 2) {
        // 通过，进入下一个词
        const newIndex = gameState.currentIndex + 1;
        const isLevelComplete = newIndex >= gameState.words.length;

        if (isLevelComplete) {
          // 关卡完成
          const stars = calculateStars(newCorrectCount / gameState.words.length);
          engine.adjustDifficulty(newCorrectCount, gameState.words.length);
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
          // 进入下一个词
          const nextWord = gameState.words[newIndex];
          const nextOptions = generateOptions(nextWord?.image || '', getAllWordKeys());
          setGameState(prev => ({
            ...prev,
            currentIndex: newIndex,
            correctStreak: 0,
            wrongStreak: 0,
            correctCount: newCorrectCount,
            phase: 'LISTENING',
            foxState: 'idle',
            options: nextOptions,
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
          selectedOption: word,
        }));

        // 播放鼓励音
        playEncourage();

        // 2秒后再播一遍发音，进入下一轮
        setTimeout(() => {
          if (isMountedRef.current) {
            speakPreschool(currentWord.word);
            setTimeout(() => {
              if (isMountedRef.current) {
                setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'think', selectedOption: null }));
              }
            }, 1000);
          }
        }, 2000);
      }
    } else {
      // 选错了
      setGameState(prev => ({
        ...prev,
        wrongStreak: prev.wrongStreak + 1,
        correctStreak: 0,
        foxState: 'wrong',
        phase: 'WRONG',
        selectedOption: word,
      }));

      // 播放错误音
      playWrong();

      // 1.5秒后显示正确答案，再播发音
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
  }, [gameState.phase, currentWord, gameState.correctStreak, gameState.correctCount, gameState.currentIndex, gameState.words]);

  // 喇叭按钮 - 重播发音
  const handleReplay = useCallback(() => {
    if (!currentWord) return;
    stopSpeaking();
    setGameState(prev => ({ ...prev, foxState: 'listen' }));
    speakPreschool(currentWord.word);
  }, [currentWord]);

  // 收藏按钮
  const handleFavorite = useCallback(() => {
    setGameState(prev => ({ ...prev, favorited: !prev.favorited }));
  }, []);

  // 下一关
  const handleNextLevel = () => {
    const initial = initGame(engine.getDifficulty());
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    });
  };

  // 重来
  const handleRestart = () => {
    engine['currentDifficulty'] = MIN_DIFFICULTY;
    const initial = initGame(MIN_DIFFICULTY);
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    });
  };

  // 返回
  const handleBack = () => {
    isMountedRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    stopSpeaking();
    router.push('/preschool');
  };

  // 获取选项图片
  const getOptionImage = (word: string) => {
    return getWordImage(word);
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
            {[0, 1, 2].map(index => (
              <Animated.View
                key={index}
                style={[
                  styles.starContainer,
                  index >= gameState.stars && styles.starEmpty,
                  {
                    opacity: starAnims[index],
                    transform: [
                      { scale: starAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.2],
                      })}
                    ],
                  },
                ]}
              >
                <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.starImage} />
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
        <Image 
          source={getFoxImage()}
          style={styles.foxImage} 
          resizeMode="contain" 
        />
      </View>

      {/* 单词展示区 - 给家长看 */}
      <View style={styles.wordSection}>
        <View style={styles.wordCard}>
          <Text style={styles.wordText}>{currentWord?.word}</Text>
          <Text style={styles.meaningText}>{currentWord?.meaning}</Text>
        </View>
        
        {/* 喇叭按钮 */}
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={handleReplay}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/images/packs/pack_academic.jpg')} style={styles.speakerImage} />
        </TouchableOpacity>
      </View>

      {/* 状态提示 */}
      <View style={styles.statusContainer}>
        {gameState.phase === 'LISTENING' && (
          <Text style={styles.statusText}>听一听，是什么？</Text>
        )}
        {gameState.phase === 'CHOOSING' && (
          <Text style={styles.statusText}>选一选，哪个是{currentWord?.meaning}？</Text>
        )}
        {gameState.phase === 'CORRECT' && (
          <Text style={styles.statusTextCorrect}>答对了！再听一遍</Text>
        )}
        {gameState.phase === 'WRONG' && (
          <Text style={styles.statusTextWrong}>再试试哦</Text>
        )}
      </View>

      {/* 4个选项网格 2x2 */}
      <View style={styles.optionsGrid}>
        {gameState.options.slice(0, 4).map((word, index) => {
          const isSelected = gameState.selectedOption === word;
          const isCorrect = word === currentWord?.image;
          const showCorrect = gameState.phase === 'WRONG' && isCorrect;
          const image = getOptionImage(word);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                showCorrect && styles.optionHighlighted,
              ]}
              onPress={() => handleOptionPress(word)}
              activeOpacity={0.8}
              disabled={gameState.phase !== 'CHOOSING'}
            >
              {image ? (
                <Image source={image} style={styles.optionImage} resizeMode="contain" />
              ) : (
                <View style={styles.optionPlaceholder}>
                  <Text style={styles.optionPlaceholderText}>{word}</Text>
                </View>
              )}
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
          <Text style={styles.bottomButtonLabel}>{gameState.favorited ? '已收藏' : '收藏'}</Text>
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
    backgroundColor: '#FFE5EF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9ECD',
    borderRadius: 5,
  },
  progressBadge: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
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
  // 单词区
  wordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  wordCard: {
    alignItems: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9ECD',
  },
  meaningText: {
    fontSize: 16,
    color: '#999',
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
    color: '#4ECDC4',
    fontWeight: '600',
  },
  statusTextWrong: {
    fontSize: 18,
    color: '#FF9ECD',
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
    height: (width - 72) / 2,
    backgroundColor: '#fff',
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
    borderColor: '#4ECDC4',
  },
  optionHighlighted: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8FCFB',
  },
  optionImage: {
    width: '80%',
    height: '80%',
  },
  optionPlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: '#FFE5EF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionPlaceholderText: {
    fontSize: 14,
    color: '#FF9ECD',
    fontWeight: '600',
  },
  correctBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#4ECDC4',
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
    color: '#FF9ECD',
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
    backgroundColor: '#fff',
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
  resultButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
