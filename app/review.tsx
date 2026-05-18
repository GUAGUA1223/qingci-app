// 复习页面
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useReview } from '../src/store/reviewStore';
import { findWordById } from '../src/data/textbooks';
import { VocabWord, ReviewQuality } from '../src/types/vocabulary';
import { getQualityEmoji } from '../src/utils/spacedRepetition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RatingButton = ({ quality, label, onPress, color }: { quality: ReviewQuality; label: string; onPress: () => void; color: string }) => (
  <TouchableOpacity style={[styles.ratingButton, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.ratingEmoji}>{getQualityEmoji(quality)}</Text>
    <Text style={styles.ratingLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function ReviewPage() {
  const router = useRouter();
  const { getTodayReviewWords, reviewWord, isLoading, isInitialized } = useReview();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, remembered: 0, forgot: 0 });
  const [flipAnim] = useState(new Animated.Value(0));

  const reviewWords = getTodayReviewWords();
  const currentWordRecord = reviewWords[currentIndex];
  const currentWord = currentWordRecord ? findWordById(currentWordRecord.wordId) : null;

  useEffect(() => {
    Animated.spring(flipAnim, { toValue: isFlipped ? 1 : 0, friction: 8, tension: 10, useNativeDriver: true }).start();
  }, [isFlipped]);

  const handleRating = useCallback((quality: ReviewQuality) => {
    if (!currentWordRecord) return;
    reviewWord(currentWordRecord.wordId, quality);
    const isRemembered = quality >= 3;
    setStats((prev) => ({ reviewed: prev.reviewed + 1, remembered: prev.remembered + (isRemembered ? 1 : 0), forgot: prev.forgot + (isRemembered ? 0 : 1) }));
    setIsFlipped(false);
    if (currentIndex < reviewWords.length - 1) { setTimeout(() => setCurrentIndex(currentIndex + 1), 300); }
    else { setTimeout(() => setIsComplete(true), 300); }
  }, [currentWordRecord, currentIndex, reviewWords.length, reviewWord]);

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  if (!isInitialized || isLoading) { return <SafeAreaView style={styles.container}><View style={styles.loadingContainer}><Text style={styles.loadingText}>加载中...</Text></View></SafeAreaView>; }
  if (reviewWords.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><TouchableOpacity onPress={() => router.push('/')}><Text style={styles.backIcon}>←</Text></TouchableOpacity><Text style={styles.headerTitle}>复习</Text><View style={styles.placeholder} /></View>
        <View style={styles.emptyContainer}><Text style={styles.emptyEmoji}>🎉</Text><Text style={styles.emptyTitle}>太棒了！</Text><Text style={styles.emptyText}>今天没有需要复习的词</Text><TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}><Text style={styles.backButtonText}>返回首页</Text></TouchableOpacity></View>
      </SafeAreaView>
    );
  }
  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><TouchableOpacity onPress={() => router.push('/')}><Text style={styles.backIcon}>←</Text></TouchableOpacity><Text style={styles.headerTitle}>复习</Text><View style={styles.placeholder} /></View>
        <View style={styles.completeContainer}><Text style={styles.completeEmoji}>🌟</Text><Text style={styles.completeTitle}>复习完成！</Text>
          <View style={styles.statsCard}><View style={styles.statItem}><Text style={styles.statValue}>{stats.reviewed}</Text><Text style={styles.statLabel}>复习词数</Text></View><View style={styles.statItem}><Text style={styles.statValue}>{stats.remembered}</Text><Text style={styles.statLabel}>记得</Text></View><View style={styles.statItem}><Text style={styles.statValue}>{stats.forgot}</Text><Text style={styles.statLabel}>需加强</Text></View></View>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.push('/')}><Text style={styles.doneButtonText}>返回首页</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><TouchableOpacity onPress={() => router.push('/')}><Text style={styles.backIcon}>←</Text></TouchableOpacity><Text style={styles.headerTitle}>复习</Text><View style={styles.progressInfo}><Text style={styles.progressText}>{currentIndex + 1}/{reviewWords.length}</Text></View></View>
      <View style={styles.progressBarContainer}><View style={[styles.progressBar, { width: `${((currentIndex + 1) / reviewWords.length) * 100}%` }]} /></View>
      <View style={styles.content}>
        {currentWord && (
          <>
            <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9}>
              <View style={styles.cardContainer}>
                <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
                  <Text style={styles.cardEmoji}>{currentWord.image}</Text><Text style={styles.cardWord}>{currentWord.word}</Text><Text style={styles.cardPhonetic}>{currentWord.phonetic}</Text><Text style={styles.cardHint}>点击查看释义</Text>
                </Animated.View>
                <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
                  <Text style={styles.cardEmoji}>{currentWord.image}</Text><Text style={styles.cardMeaning}>{currentWord.meaning}</Text><Text style={styles.cardPartOfSpeech}>{currentWord.partOfSpeech}</Text>
                  {currentWord.sentence && <Text style={styles.cardSentence}>"{currentWord.sentence}"</Text>}
                  {currentWord.memoryTip && <Text style={styles.cardMemoryTip}>💡 {currentWord.memoryTip}</Text>}
                </Animated.View>
              </View>
            </TouchableOpacity>
            {isFlipped && (
              <View style={styles.ratingContainer}><Text style={styles.ratingTitle}>你觉得这个词记得怎么样？</Text>
                <View style={styles.ratingRow}><RatingButton quality={0} label="不记得" onPress={() => handleRating(0)} color="#FF6B6B" /><RatingButton quality={3} label="模糊" onPress={() => handleRating(3)} color="#FFD93D" /><RatingButton quality={4} label="记得" onPress={() => handleRating(4)} color="#4ECDC4" /><RatingButton quality={5} label="很轻松" onPress={() => handleRating(5)} color="#45B7AA" /></View>
              </View>
            )}
            {!isFlipped && <Text style={styles.flipHint}>点击卡片查看释义</Text>}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backIcon: { fontSize: 28, color: '#4ECDC4' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  placeholder: { width: 40 },
  progressInfo: { backgroundColor: '#E8F8F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  progressText: { fontSize: 14, color: '#4ECDC4', fontWeight: '600' },
  progressBarContainer: { height: 4, backgroundColor: '#E8F8F5', marginHorizontal: 20, borderRadius: 2 },
  progressBar: { height: '100%', backgroundColor: '#4ECDC4', borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 30, alignItems: 'center' },
  cardContainer: { width: SCREEN_WIDTH - 60, height: 300 },
  card: { width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, padding: 20 },
  cardBack: { backgroundColor: '#F8FFFE', position: 'absolute', top: 0 },
  cardEmoji: { fontSize: 48, marginBottom: 16 },
  cardWord: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardPhonetic: { fontSize: 18, color: '#888', marginBottom: 20 },
  cardHint: { fontSize: 14, color: '#AAA' },
  cardMeaning: { fontSize: 28, fontWeight: 'bold', color: '#4ECDC4', marginBottom: 8 },
  cardPartOfSpeech: { fontSize: 14, color: '#888', marginBottom: 16 },
  cardSentence: { fontSize: 14, color: '#666', fontStyle: 'italic', textAlign: 'center', marginBottom: 12 },
  cardMemoryTip: { fontSize: 14, color: '#888', textAlign: 'center' },
  ratingContainer: { marginTop: 30, alignItems: 'center' },
  ratingTitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 8 },
  ratingButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  ratingEmoji: { fontSize: 24, marginBottom: 4 },
  ratingLabel: { fontSize: 12, color: '#FFF', fontWeight: '600' },
  flipHint: { marginTop: 40, fontSize: 14, color: '#AAA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 28, fontWeight: 'bold', color: '#4ECDC4', marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 8 },
  backButton: { marginTop: 30, backgroundColor: '#4ECDC4', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 },
  backButtonText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
  completeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  completeEmoji: { fontSize: 80, marginBottom: 20 },
  completeTitle: { fontSize: 28, fontWeight: 'bold', color: '#4ECDC4', marginBottom: 24 },
  statsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#4ECDC4' },
  statLabel: { fontSize: 14, color: '#888', marginTop: 4 },
  doneButton: { backgroundColor: '#4ECDC4', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 25 },
  doneButtonText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
});
