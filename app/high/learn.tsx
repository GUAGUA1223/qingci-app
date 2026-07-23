import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { highWords } from '../../src/data/highWords';
import { HighWord } from '../../src/types';
import { speakNormal, stopSpeaking, playEncourage, playWrong } from '../../src/utils/speech';

const { width } = Dimensions.get('window');
const HIGH_COLORS = colors.high;

// 每次速记的单词数
const BATCH_SIZE = 10;

type Phase = 'SPEED' | 'FLIPPED' | 'QUIZ' | 'RESULT';

interface LearnState {
  words: HighWord[];
  currentIndex: number;
  knownWords: string[];
  unknownWords: string[];
  phase: Phase;
  isFlipped: boolean;
  // quiz state
  quizOptions: string[];
  selectedOption: string | null;
  quizCorrect: number;
  quizTotal: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuizOptions(correctWord: HighWord, allWords: HighWord[]): string[] {
  const correct = correctWord.meaning;
  const others = allWords
    .filter(w => w.word !== correctWord.word)
    .map(w => w.meaning);
  const shuffledOthers = shuffleArray(others).slice(0, 3);
  return shuffleArray([correct, ...shuffledOthers]);
}

export default function HighLearn() {
  const router = useRouter();
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState<LearnState>(() => {
    const words = shuffleArray(highWords).slice(0, BATCH_SIZE);
    return {
      words,
      currentIndex: 0,
      knownWords: [],
      unknownWords: [],
      phase: 'SPEED',
      isFlipped: false,
      quizOptions: [],
      selectedOption: null,
      quizCorrect: 0,
      quizTotal: 0,
    };
  });

  const currentWord = state.words[state.currentIndex];
  const totalWords = state.words.length;
  const progress = ((state.currentIndex + 1) / totalWords) * 100;

  const handleBack = () => {
    stopSpeaking();
    router.push('/high');
  };

  // 点击"认识"
  const handleKnown = () => {
    if (!currentWord) return;
    playEncourage();
    speakNormal(currentWord.word);

    const newKnown = [...state.knownWords, currentWord.word];
    const nextIndex = state.currentIndex + 1;

    if (nextIndex >= totalWords) {
      // 全部完成，进入结果
      setState(prev => ({
        ...prev,
        knownWords: newKnown,
        phase: 'RESULT',
      }));
    } else {
      setState(prev => ({
        ...prev,
        knownWords: newKnown,
        currentIndex: nextIndex,
        isFlipped: false,
        phase: 'SPEED',
      }));
    }
  };

  // 点击"不认识"
  const handleUnknown = () => {
    if (!currentWord) return;
    playWrong();

    // 翻转卡片
    setState(prev => ({
      ...prev,
      isFlipped: true,
      phase: 'FLIPPED',
    }));

    // 播放发音
    speakNormal(currentWord.word);
  };

  // 翻转后点击"进入选择题"
  const handleGoToQuiz = () => {
    if (!currentWord) return;
    const options = generateQuizOptions(currentWord, state.words);
    setState(prev => ({
      ...prev,
      phase: 'QUIZ',
      quizOptions: options,
      selectedOption: null,
    }));
  };

  // 选择题回答
  const handleQuizAnswer = (option: string) => {
    if (state.selectedOption !== null) return;
    if (!currentWord) return;

    const isCorrect = option === currentWord.meaning;
    const newUnknown = [...state.unknownWords, currentWord.word];

    setState(prev => ({
      ...prev,
      selectedOption: option,
      quizCorrect: isCorrect ? prev.quizCorrect + 1 : prev.quizCorrect,
      quizTotal: prev.quizTotal + 1,
    }));

    if (isCorrect) {
      playEncourage();
    } else {
      playWrong();
    }

    // 1.5秒后进入下一个
    setTimeout(() => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= totalWords) {
        setState(prev => ({
          ...prev,
          unknownWords: newUnknown,
          phase: 'RESULT',
        }));
      } else {
        setState(prev => ({
          ...prev,
          unknownWords: newUnknown,
          currentIndex: nextIndex,
          isFlipped: false,
          phase: 'SPEED',
          selectedOption: null,
        }));
      }
    }, 1500);
  };

  // 返回首页
  const handleDone = () => {
    router.push('/high');
  };

  // 重新学习
  const handleRestart = () => {
    const words = shuffleArray(highWords).slice(0, BATCH_SIZE);
    setState({
      words,
      currentIndex: 0,
      knownWords: [],
      unknownWords: [],
      phase: 'SPEED',
      isFlipped: false,
      quizOptions: [],
      selectedOption: null,
      quizCorrect: 0,
      quizTotal: 0,
    });
  };

  // ========== 结果页 ==========
  if (state.phase === 'RESULT') {
    const knownCount = state.knownWords.length;
    const unknownCount = state.unknownWords.length;
    const reviewWords = state.words.filter(w => state.unknownWords.includes(w.word));

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.resultEmoji}>📊</Text>
          <Text style={styles.resultTitle}>本轮速记完成</Text>

          {/* 统计 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{knownCount}</Text>
              <Text style={styles.statLabel}>认识</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: 'rgba(255,107,107,0.2)' }]}>
              <Text style={[styles.statNumber, { color: HIGH_COLORS.accent }]}>{unknownCount}</Text>
              <Text style={styles.statLabel}>不认识</Text>
            </View>
          </View>

          {/* 建议复习 */}
          {reviewWords.length > 0 && (
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>📝 建议复习</Text>
              {reviewWords.map((w, i) => (
                <View key={w.word} style={styles.reviewItem}>
                  <Text style={styles.reviewWord}>{w.image} {w.word}</Text>
                  <Text style={styles.reviewMeaning}>{w.meaning}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 按钮 */}
          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.resultBtnPrimary} onPress={handleRestart} activeOpacity={0.8}>
              <Text style={styles.resultBtnText}>再来一轮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtnSecondary} onPress={handleDone} activeOpacity={0.8}>
              <Text style={styles.resultBtnTextSecondary}>返回首页</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ========== 学习页 ==========
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部进度 */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {state.currentIndex + 1}/{totalWords}
        </Text>
      </View>

      {/* 单词卡片 */}
      <View style={styles.cardContainer}>
        {!state.isFlipped ? (
          // 正面：单词 + 音标 + 词性
          <View style={styles.cardFront}>
            <Text style={styles.wordEmoji}>{currentWord?.image}</Text>
            <Text style={styles.wordText}>{currentWord?.word}</Text>
            <Text style={styles.phoneticText}>{currentWord?.phonetic}</Text>
            <View style={styles.posTag}>
              <Text style={styles.posText}>{currentWord?.partOfSpeech}</Text>
            </View>

            {/* 考试频率 */}
            <View style={styles.freqRow}>
              <Text style={styles.freqLabel}>考频</Text>
              {[1, 2, 3, 4, 5].map(i => (
                <Text key={i} style={[styles.freqStar, { opacity: i <= (currentWord?.examFreq || 0) ? 1 : 0.3 }]}>
                  ★
                </Text>
              ))}
            </View>
          </View>
        ) : (
          // 反面：释义 + 例句 + 同义词/反义词
          <ScrollView style={styles.cardBack} showsVerticalScrollIndicator={false}>
            <Text style={styles.wordText}>{currentWord?.word}</Text>
            <Text style={styles.meaningText}>{currentWord?.meaning}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>例句</Text>
            <Text style={styles.sentenceText}>{currentWord?.sentence}</Text>

            {currentWord?.memoryTip && (
              <>
                <Text style={styles.sectionLabel}>记忆技巧</Text>
                <Text style={styles.tipText}>💡 {currentWord.memoryTip}</Text>
              </>
            )}

            {currentWord?.synonyms && currentWord.synonyms.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>同义词</Text>
                <View style={styles.tagRow}>
                  {currentWord.synonyms.map((s, i) => (
                    <View key={i} style={styles.synTag}>
                      <Text style={styles.synTagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {currentWord?.antonyms && currentWord.antonyms.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>反义词</Text>
                <View style={styles.tagRow}>
                  {currentWord.antonyms.map((a, i) => (
                    <View key={i} style={[styles.synTag, styles.antTag]}>
                      <Text style={[styles.synTagText, { color: HIGH_COLORS.accent }]}>{a}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>

      {/* 操作按钮 */}
      {state.phase === 'SPEED' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.unknownBtn]}
            onPress={handleUnknown}
            activeOpacity={0.8}
          >
            <Text style={styles.unknownBtnText}>不认识</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.knownBtn]}
            onPress={handleKnown}
            activeOpacity={0.8}
          >
            <Text style={styles.knownBtnText}>认识 ✓</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.phase === 'FLIPPED' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.quizBtn]}
            onPress={handleGoToQuiz}
            activeOpacity={0.8}
          >
            <Text style={styles.quizBtnText}>做选择题强化</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.phase === 'QUIZ' && (
        <View style={styles.quizContainer}>
          <Text style={styles.quizPrompt}>选择正确的释义：</Text>
          <View style={styles.quizOptions}>
            {state.quizOptions.map((option, index) => {
              const isSelected = state.selectedOption === option;
              const isCorrect = option === currentWord?.meaning;
              const showResult = state.selectedOption !== null;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quizOption,
                    isSelected && isCorrect && styles.quizOptionCorrect,
                    isSelected && !isCorrect && styles.quizOptionWrong,
                    showResult && isCorrect && styles.quizOptionCorrectOutline,
                  ]}
                  onPress={() => handleQuizAnswer(option)}
                  activeOpacity={0.7}
                  disabled={state.selectedOption !== null}
                >
                  <Text style={[
                    styles.quizOptionText,
                    isSelected && isCorrect && styles.quizOptionTextCorrect,
                    isSelected && !isCorrect && styles.quizOptionTextWrong,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HIGH_COLORS.background,
  },
  // 顶部进度
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
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
    minWidth: 40,
    textAlign: 'right',
  },
  // 单词卡片
  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: HIGH_COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  cardFront: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardBack: {
    flex: 1,
    padding: 24,
  },
  wordEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  wordText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  phoneticText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  posTag: {
    backgroundColor: 'rgba(30,144,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 12,
  },
  posText: {
    fontSize: 12,
    color: HIGH_COLORS.secondary,
    fontWeight: '600',
  },
  freqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
  },
  freqLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginRight: 4,
  },
  freqStar: {
    fontSize: 14,
    color: '#FFD93D',
  },
  // 卡片反面
  meaningText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 12,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sentenceText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  synTag: {
    backgroundColor: 'rgba(30,144,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  antTag: {
    backgroundColor: 'rgba(255,107,107,0.15)',
  },
  synTagText: {
    fontSize: 13,
    color: HIGH_COLORS.secondary,
    fontWeight: '500',
  },
  // 操作按钮
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  unknownBtn: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.4)',
  },
  unknownBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: HIGH_COLORS.accent,
  },
  knownBtn: {
    backgroundColor: 'rgba(30,144,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.4)',
  },
  knownBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: HIGH_COLORS.secondary,
  },
  quizBtn: {
    flex: 1,
    backgroundColor: HIGH_COLORS.secondary,
  },
  quizBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // 选择题
  quizContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  quizPrompt: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizOptions: {
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
  quizOptionCorrectOutline: {
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
  // 结果页
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  resultEmoji: {
    fontSize: 60,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(30,144,255,0.2)',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: HIGH_COLORS.secondary,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  reviewSection: {
    width: '100%',
    marginTop: 24,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  reviewItem: {
    backgroundColor: HIGH_COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  reviewWord: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewMeaning: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  resultButtons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  resultBtnPrimary: {
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resultBtnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resultBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultBtnTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
});
