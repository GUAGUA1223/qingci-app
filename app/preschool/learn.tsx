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
import { colors } from '../../src/theme/colors';
import { preschoolWords } from '../../src/data/preschoolWords';
import { getWordImage, getAllWordKeys } from '../../src/data/wordImages';
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
  options: string[];
  selectedOption: string | null;
  correctCount: number;
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
    options: [],
    selectedOption: null,
    correctCount: 0,
  };
}

function generateOptions(correctWord: string, allWords: string[]): string[] {
  const options = [correctWord];
  const otherWords = allWords.filter(w => w !== correctWord);
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length);
    const word = otherWords.splice(randomIndex, 1)[0];
    if (!options.includes(word)) {
      options.push(word);
    }
  }
  if (options.length < 4) {
    const allKeys = getAllWordKeys();
    for (const key of allKeys) {
      if (!options.includes(key)) {
        options.push(key);
        if (options.length >= 4) break;
      }
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

export default function PreschoolLearn() {
  const router = useRouter();
  const [engine] = useState(() => new DifficultyEngine('preschool', MIN_DIFFICULTY));
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = initGame(engine.getDifficulty());
    return {
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    };
  });
  const [celebrateScale] = useState(new Animated.Value(1));
  const [starAnims] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);
  const [shakeAnim] = useState(new Animated.Value(0));
  const isMountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playCountRef = useRef(0);

  const currentWord = gameState.words[gameState.currentIndex];
  const totalWords = gameState.words.length;
  const progress = ((gameState.currentIndex + 1) / totalWords) * 100;
  const progressText = `${gameState.currentIndex + 1}/${totalWords}`;
  const canSkip = gameState.wrongStreak >= 3;

  // 自动播放发音2遍
  useEffect(() => {
    if (!currentWord || gameState.isComplete) return;
    playCountRef.current = 0;
    
    const playTwice = () => {
      if (isMountedRef.current) {
        setGameState(prev => ({ ...prev, foxState: 'listen', phase: 'LISTENING' }));
        speakPreschool(currentWord.word);
        playCountRef.current++;
        
        if (playCountRef.current < 2) {
          timerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              speakPreschool(currentWord.word);
              playCountRef.current++;
              setTimeout(() => {
                if (isMountedRef.current) {
                  setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'idle' }));
                }
              }, 1500);
            }
          }, 1500);
        } else {
          setTimeout(() => {
            if (isMountedRef.current) {
              setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'idle' }));
            }
          }, 1500);
        }
      }
    };
    
    timerRef.current = setTimeout(playTwice, 800);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.currentIndex]);

  // 答对动画
  useEffect(() => {
    if (gameState.foxState === 'correct') {
      Animated.sequence([
        Animated.spring(celebrateScale, { toValue: 1.2, friction: 3, useNativeDriver: true }),
        Animated.spring(celebrateScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }
  }, [gameState.foxState]);

  // 答错抖动
  useEffect(() => {
    if (gameState.foxState === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 75, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 75, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 1, duration: 75, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 75, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 1, duration: 75, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 75, useNativeDriver: true }),
      ]).start();
    }
  }, [gameState.foxState]);

  // 星星动画
  useEffect(() => {
    if (gameState.showResult && gameState.stars > 0) {
      const animations = starAnims.slice(0, gameState.stars).map((anim, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.spring(anim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ])
      );
      Animated.parallel(animations).start();
    }
  }, [gameState.showResult]);

  const handleOptionPress = useCallback((word: string) => {
    if (gameState.phase !== 'CHOOSING' || !currentWord) return;
    const isCorrect = word === currentWord.image;
    
    if (isCorrect) {
      stopSpeaking();
      const newCorrectStreak = gameState.correctStreak + 1;
      const newCorrectCount = gameState.correctCount + 1;
      
      if (newCorrectStreak >= 2) {
        const newIndex = gameState.currentIndex + 1;
        const isLevelComplete = newIndex >= gameState.words.length;
        if (isLevelComplete) {
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
        setGameState(prev => ({
          ...prev,
          correctStreak: newCorrectStreak,
          correctCount: newCorrectCount,
          foxState: 'correct',
          phase: 'CORRECT',
          selectedOption: word,
        }));
        playEncourage();
        setTimeout(() => {
          if (isMountedRef.current) {
            speakPreschool(currentWord.word);
            setTimeout(() => {
              if (isMountedRef.current) {
                setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'idle', selectedOption: null }));
              }
            }, 1000);
          }
        }, 1500);
      }
    } else {
      setGameState(prev => ({
        ...prev,
        wrongStreak: prev.wrongStreak + 1,
        correctStreak: 0,
        foxState: 'wrong',
        phase: 'WRONG',
        selectedOption: word,
      }));
      playWrong();
      setTimeout(() => {
        if (isMountedRef.current) {
          speakPreschool(currentWord.word);
          setTimeout(() => {
            if (isMountedRef.current) {
              setGameState(prev => ({ ...prev, phase: 'CHOOSING', foxState: 'idle', selectedOption: null }));
            }
          }, 1000);
        }
      }, 2000);
    }
  }, [gameState.phase, currentWord, gameState.correctStreak, gameState.correctCount, gameState.currentIndex, gameState.words]);

  const handleReplay = useCallback(() => {
    if (!currentWord) return;
    stopSpeaking();
    setGameState(prev => ({ ...prev, foxState: 'listen' }));
    speakPreschool(currentWord.word);
    setTimeout(() => {
      if (isMountedRef.current) {
        setGameState(prev => ({ ...prev, foxState: 'idle' }));
      }
    }, 1500);
  }, [currentWord]);

  const handleSkip = useCallback(() => {
    if (!canSkip || !currentWord) return;
    const newIndex = gameState.currentIndex + 1;
    const isLevelComplete = newIndex >= gameState.words.length;
    if (isLevelComplete) {
      const stars = calculateStars(gameState.correctCount / gameState.words.length);
      engine.adjustDifficulty(gameState.correctCount, gameState.words.length);
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        showResult: true,
        stars,
        foxState: 'celebrate',
        phase: 'RESULT',
      }));
    } else {
      const nextWord = gameState.words[newIndex];
      const nextOptions = generateOptions(nextWord?.image || '', getAllWordKeys());
      setGameState(prev => ({
        ...prev,
        currentIndex: newIndex,
        correctStreak: 0,
        wrongStreak: 0,
        phase: 'LISTENING',
        foxState: 'idle',
        options: nextOptions,
        selectedOption: null,
      }));
    }
  }, [canSkip, gameState.currentIndex, gameState.words, gameState.correctCount]);

  const handleNextLevel = () => {
    const initial = initGame(engine.getDifficulty());
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    });
  };

  const handleRestart = () => {
    engine['currentDifficulty'] = MIN_DIFFICULTY;
    const initial = initGame(MIN_DIFFICULTY);
    setGameState({
      ...initial,
      options: generateOptions(initial.words[0]?.image || '', getAllWordKeys()),
    });
  };

  const handleBack = () => {
    isMountedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    stopSpeaking();
    router.push('/preschool');
  };

  const getFoxImage = () => {
    switch (gameState.foxState) {
      case 'correct': return foxImages.happy;
      case 'wrong': return foxImages.encouraging;
      case 'listen': return foxImages.excited;
      case 'celebrate': return foxImages.proud;
      default: return foxImages.stage0;
    }
  };

  // ========== 结果页 ==========
  if (gameState.showResult) {
    const titleText = gameState.stars >= 3 ? '太棒啦!' : gameState.stars >= 2 ? '完成啦!' : '继续加油!';
    const subtitleText = `${totalWords}`;
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          {/* 3D橙橙庆祝 */}
          <Animated.View style={{ transform: [{ scale: celebrateScale }] }}>
            <Image source={foxImages.main3d} style={styles.resultFoxImage} resizeMode="contain" />
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
                    transform: [{ scale: starAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    })}]
                  },
                ]}
              >
                <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.starImage} />
              </Animated.View>
            ))}
          </View>
          <Text style={styles.resultTitle}>{titleText}</Text>
          <Text style={styles.resultSubtitle}>{subtitleText}</Text>
          {/* 按钮 */}
          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.resultButtonPrimary} onPress={handleRestart} activeOpacity={0.8}>
              <Text style={styles.resultButtonText}>再来一次</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultButtonHome} onPress={handleBack} activeOpacity={0.8}>
              <Text style={styles.resultButtonTextSecondary}>回家</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ========== 学习页 ==========
  const feedbackText = gameState.phase === 'CORRECT' 
    ? (gameState.correctStreak >= 2 ? '完全掌握!' : '太棒了!')
    : gameState.phase === 'WRONG' ? '没关系' : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={handleBack} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Image source={require('../../assets/images/decorations/deco_arrow_left.jpg')} style={styles.topIcon} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: progress + '%' }]} />
        </View>
        <View style={styles.progressDots}>
          {Array.from({ length: totalWords }, (_, i) => (
            <View key={i} style={[styles.progressDot, i <= gameState.currentIndex && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity 
          style={[styles.topBtn, canSkip && styles.skipBtnActive]} 
          onPress={handleSkip}
          disabled={!canSkip}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Image 
            source={require('../../assets/images/decorations/deco_arrow_left.jpg')} 
            style={[styles.topIcon, canSkip ? {} : { opacity: 0.3 }]} 
          />
        </TouchableOpacity>
      </View>

      {/* 橙橙反馈区 */}
      <View style={styles.foxFeedbackSection}>
        <View style={styles.foxCard}>
          <Animated.View style={{
            transform: [{ scale: celebrateScale }, { translateX: shakeAnim.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [-4, 0, 4],
            })}]
          }}>
            <Image source={getFoxImage()} style={styles.foxFeedbackImage} resizeMode="contain" />
          </Animated.View>
          {feedbackText ? (
            <Text style={[
              styles.feedbackText,
              gameState.phase === 'CORRECT' && styles.feedbackCorrect,
              gameState.phase === 'WRONG' && styles.feedbackWrong,
            ]}>
              {feedbackText}
            </Text>
          ) : null}
        </View>
      </View>

      {/* 单词显示区 */}
      <View style={styles.wordSection}>
        <View style={styles.wordCard}>
          <Text style={styles.wordText}>{currentWord?.word}</Text>
          <TouchableOpacity style={styles.speakerButton} onPress={handleReplay} activeOpacity={0.8}>
            <Image source={require('../../assets/images/packs/pack_academic.jpg')} style={styles.speakerImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2x2选项网格 */}
      <View style={styles.optionsGrid}>
        {gameState.options.slice(0, 4).map((word, index) => {
          const isSelected = gameState.selectedOption === word;
          const isCorrect = word === currentWord?.image;
          const showCorrect = gameState.phase === 'WRONG' && isCorrect;
          const image = getWordImage(word);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                isSelected && gameState.phase === 'CORRECT' && styles.optionCorrect,
                isSelected && gameState.phase === 'WRONG' && styles.optionWrong,
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
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 本题答题进度圆点 */}
      <View style={styles.wordProgressDots}>
        {[0, 1].map(i => (
          <View
            key={i}
            style={[
              styles.wordDot,
              i < gameState.correctStreak ? styles.wordDotActive : styles.wordDotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 44,
    gap: 8,
  },
  topBtn: { padding: 4 },
  topIcon: { width: 24, height: 24 },
  skipBtnActive: { backgroundColor: '#FFE5EF', borderRadius: 12 },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#FFE0EC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#FF9ECD', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '600', color: '#FF9ECD', minWidth: 30, textAlign: 'right' },
  
  foxFeedbackSection: { alignItems: 'center', marginTop: 8 },
  foxCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  foxFeedbackImage: { width: 48, height: 48 },
  feedbackText: { fontSize: 14, marginTop: 4, fontWeight: '600' },
  feedbackCorrect: { color: '#FF9ECD' },
  feedbackWrong: { color: '#FF6B7A' },

  wordSection: { paddingHorizontal: 20, marginTop: 12 },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: 'rgba(255,158,205,0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  wordText: { fontSize: 28, fontWeight: 'bold', color: '#4A3236' },
  speakerButton: { marginTop: 8 },
  speakerImage: { width: 36, height: 36 },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    justifyContent: 'center',
  },
  optionCard: {
    width: (width - 52) / 2,
    height: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: 'rgba(255,158,205,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  optionCorrect: { borderColor: '#4ECDC4', backgroundColor: '#E8F8F7' },
  optionWrong: { borderColor: '#FF6B7A', backgroundColor: '#FFF0F2' },
  optionHighlighted: { borderColor: '#4ECDC4' },
  optionImage: { width: '80%', height: '80%' },
  optionPlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: '#FFE5EF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionPlaceholderText: { fontSize: 14, color: '#FF9ECD', fontWeight: '600' },

  wordProgressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  wordDot: { width: 8, height: 8, borderRadius: 4 },
  wordDotActive: { backgroundColor: '#FF9ECD' },
  wordDotInactive: { borderWidth: 1.5, borderColor: '#FFE0EC', backgroundColor: 'transparent' },

  // 结果页
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  resultFoxImage: { width: 120, height: 120 },
  starsContainer: { flexDirection: 'row', marginTop: 20, gap: 12 },
  starContainer: { width: 40, height: 40 },
  starImage: { width: 40, height: 40 },
  starEmpty: { opacity: 0.3 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#FF9ECD', marginTop: 20 },
  resultSubtitle: { fontSize: 14, color: '#8B7A7E', marginTop: 8 },
  resultButtons: { marginTop: 40, gap: 16, width: '100%' },
  resultButtonPrimary: {
    backgroundColor: '#FFD93D',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultButtonHome: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  resultButtonTextSecondary: { fontSize: 14, color: '#B8A9AD' },
});
