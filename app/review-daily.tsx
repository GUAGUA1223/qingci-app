// 每日复习首页
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useReview } from '../src/store/reviewStore';
import { useFox, FOX_STAGES } from '../src/store/foxStore';
import { FoxMascot } from '../src/components/FoxMascot';
import { colors } from '../src/theme/colors';

export default function ReviewDaily() {
  const router = useRouter();
  const { getTodayReviewWords, getReviewCount, getAllReviewWords } = useReview();
  const { state: foxState } = useFox();
  const [celebration] = useState(new Animated.Value(0));
  const [reminderWords, setReminderWords] = useState<number>(0);

  const todayWords = getTodayReviewWords();
  const totalReviewCount = getReviewCount();
  const allReviewWords = getAllReviewWords();
  const currentStage = FOX_STAGES[foxState.stage as keyof typeof FOX_STAGES] || FOX_STAGES[0];

  useEffect(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const overdueWords = allReviewWords.filter(w => {
      const lastReview = new Date(w.lastReview);
      return lastReview < threeDaysAgo;
    });
    setReminderWords(overdueWords.length);
  }, [allReviewWords]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getStreakMessage = () => {
    if (foxState.consecutiveDays === 0) return '今天开始新的学习旅程~';
    if (foxState.consecutiveDays < 3) return `坚持第${foxState.consecutiveDays}天，继续加油！`;
    if (foxState.consecutiveDays < 7) return `已经坚持${foxState.consecutiveDays}天啦！`;
    return `太棒了！连续${foxState.consecutiveDays}天学习！`;
  };

  const handleStartReview = () => {
    router.push('/review');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>每日复习</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.greetingSection}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greeting}>{getGreeting()} ✨</Text>
            <Text style={styles.encouragement}>{getStreakMessage()}</Text>
          </View>
          <FoxMascot size={80} mood={foxState.mood} stage={foxState.stage} />
        </View>

        {reminderWords > 0 && (
          <View style={styles.reminderCard}>
            <Text style={styles.reminderIcon}>💡</Text>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>这些词好久没复习啦</Text>
              <Text style={styles.reminderSubtitle}>有{reminderWords}个词3天没复习了，快来巩固~</Text>
            </View>
          </View>
        )}

        {totalReviewCount > 0 ? (
          <TouchableOpacity style={styles.mainCard} onPress={handleStartReview} activeOpacity={0.9}>
            <View style={styles.mainCardHeader}>
              <Text style={styles.mainCardEmoji}>📚</Text>
              <View>
                <Text style={styles.mainCardTitle}>今日待复习</Text>
                <Text style={styles.mainCardSubtitle}>坚持复习记得更牢哦~</Text>
              </View>
            </View>
            <View style={styles.mainCardStats}>
              <View style={styles.statCircle}>
                <Text style={styles.statNumber}>{totalReviewCount}</Text>
                <Text style={styles.statLabel}>词</Text>
              </View>
            </View>
            <View style={styles.startReviewBtn}>
              <Text style={styles.startReviewBtnText}>开始复习 →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>太棒了！</Text>
            <Text style={styles.emptySubtitle}>今天没有待复习的词</Text>
            <View style={styles.emptyFox}>
              <FoxMascot size={120} mood="proud" stage={foxState.stage} animated={true} />
            </View>
            <Text style={styles.emptyEncouragement}>继续保持，小狐狸为你骄傲~</Text>
          </View>
        )}

        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>复习连续天数</Text>
              <Text style={styles.streakValue}>{foxState.consecutiveDays} 天</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakStage}>{currentStage.name}</Text>
            <FoxMascotMini stage={foxState.stage} mood={foxState.mood} />
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>📊 复习概览</Text>
          <View style={styles.historyGrid}>
            <View style={styles.historyItem}>
              <Text style={styles.historyNumber}>{allReviewWords.length}</Text>
              <Text style={styles.historyLabel}>已加入复习</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyNumber}>
                {allReviewWords.filter(w => {
                  const nextReview = new Date(w.nextReview);
                  const now = new Date();
                  return nextReview <= now;
                }).length}
              </Text>
              <Text style={styles.historyLabel}>今日到期</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyNumber}>
                {allReviewWords.filter(w => {
                  const nextReview = new Date(w.nextReview);
                  const now = new Date();
                  const weekLater = new Date();
                  weekLater.setDate(weekLater.getDate() + 7);
                  return nextReview > now && nextReview <= weekLater;
                }).length}
              </Text>
              <Text style={styles.historyLabel}>本周到期</Text>
            </View>
          </View>
        </View>

        <View style={styles.learnSection}>
          <Text style={styles.sectionTitle}>🎯 继续学习</Text>
          <TouchableOpacity style={styles.learnCard} onPress={() => router.push('/middle/learn')}>
            <Text style={styles.learnCardIcon}>📖</Text>
            <Text style={styles.learnCardText}>学习新词汇</Text>
            <Text style={styles.learnCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipTitle}>💡 复习小贴士</Text>
          <Text style={styles.tipText}>
            • 间隔重复是最有效的记忆方法{'\n'}
            • 每天复习比一次性大量复习更有效{'\n'}
            • 遇到模糊的词要多看几遍哦
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FoxMascotMini: React.FC<{ stage?: number; mood?: 'happy' | 'sleepy' | 'hungry' | 'proud' | 'excited' }> = ({ 
  stage = 0, 
  mood = 'happy' 
}) => {
  const stageConfig: Record<number, string> = {
    0: '🐾',
    1: '🦊',
    2: '🦊',
    3: '🦊👑',
    4: '🦊🌟',
  };
  
  const moodConfig: Record<string, string> = {
    happy: '😊',
    sleepy: '😴',
    hungry: '😋',
    proud: '😎',
    excited: '🤩',
  };

  return (
    <View style={miniStyles.container}>
      <Text style={miniStyles.fox}>{stageConfig[stage] || stageConfig[0]}</Text>
      <Text style={miniStyles.mood}>{moodConfig[mood] || moodConfig.happy}</Text>
    </View>
  );
};

const miniStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  fox: { fontSize: 24 },
  mood: { fontSize: 14, marginLeft: -5 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 16, color: '#FF9ECD', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FF9ECD' },
  greetingSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 16 },
  greetingLeft: { flex: 1 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  encouragement: { fontSize: 14, color: '#888', marginTop: 4 },
  reminderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E6', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FFE4B5' },
  reminderIcon: { fontSize: 32, marginRight: 12 },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  reminderSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  mainCard: { backgroundColor: '#FF9ECD', borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#FF9ECD', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  mainCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  mainCardEmoji: { fontSize: 40, marginRight: 16 },
  mainCardTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  mainCardSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  mainCardStats: { alignItems: 'center', marginBottom: 20 },
  statCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  statNumber: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: -4 },
  startReviewBtn: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center' },
  startReviewBtnText: { fontSize: 18, fontWeight: 'bold', color: '#FF9ECD' },
  emptyState: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#4ECDC4', marginTop: 16 },
  emptySubtitle: { fontSize: 16, color: '#888', marginTop: 8 },
  emptyFox: { marginVertical: 20 },
  emptyEncouragement: { fontSize: 14, color: '#FF9ECD', fontWeight: '600' },
  streakCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  streakLeft: { flexDirection: 'row', alignItems: 'center' },
  streakIcon: { fontSize: 40, marginRight: 12 },
  streakTitle: { fontSize: 14, color: '#888' },
  streakValue: { fontSize: 24, fontWeight: 'bold', color: '#FF9ECD', marginTop: 2 },
  streakRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakStage: { fontSize: 14, color: '#FFD93D', fontWeight: '600', backgroundColor: '#FFF5E6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  historySection: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  historyGrid: { flexDirection: 'row', gap: 12 },
  historyItem: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  historyNumber: { fontSize: 28, fontWeight: 'bold', color: '#4ECDC4' },
  historyLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  learnSection: { marginBottom: 16 },
  learnCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  learnCardIcon: { fontSize: 32, marginRight: 16 },
  learnCardText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  learnCardArrow: { fontSize: 20, color: '#4ECDC4' },
  tipsSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  tipText: { fontSize: 14, color: '#666', lineHeight: 24 },
});
