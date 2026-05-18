import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TreeMascot } from '../../src/components/FoxMascot';
import { useFox, FOX_STAGES, TREE_STAGES, getTreeInterruptState } from '../../src/store/foxStore';
import { ACHIEVEMENTS_LIST } from '../../src/data/mockReportData';

const STAGE_NAMES = ['小学徒', '入门小将', '词汇新星', '词汇达人', '飞狐学徒', '飞狐使者', '飞狐骑士', '飞狐领主', '神话飞狐', '传说存在'];

export default function FoxStatusPage() {
  const router = useRouter();
  const { state: foxState, getTreeState } = useFox();
  
  const { treeStage, treeInfo, interruptState } = getTreeState();
  const currentStage = foxState.stage;
  const nextStage = Math.min(currentStage + 1, 9);
  const currentFoxInfo = FOX_STAGES[currentStage as keyof typeof FOX_STAGES];
  const nextFoxInfo = FOX_STAGES[nextStage as keyof typeof FOX_STAGES];
  
  const wordsToNextStage = nextFoxInfo?.minWords ? nextFoxInfo.minWords - foxState.totalWords : 0;
  const progressToNextStage = nextFoxInfo ? (foxState.totalWords / nextFoxInfo.minWords) * 100 : 100;

  const unlockedAchievements = ACHIEVEMENTS_LIST.filter((a) => foxState.unlockedAchievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS_LIST.filter((a) => !foxState.unlockedAchievements.includes(a.id));

  // 中断提示
  const getInterruptMessage = () => {
    switch (interruptState) {
      case 'wilted1': return '🍃 有一天没学习了，树叶有点蔫哦~';
      case 'wilted3': return '🍂 已经3天没学习了，开始落叶了...';
      case 'wilted7': return '🥀 已经7天没学习了，树枝开始枯萎...';
      case 'dying': return '😢 已经14天没学习了，小树快枯死了！';
      default: return '💚 小树状态良好，继续保持！';
    }
  };

  const ENCOURAGEMENT = ['和孩子一起加油哦~', '每一点进步都值得鼓励~', '陪伴是最长情的告白~', '一起成长，一起进步~', '用心陪伴，静待花开~'];
  const randomEncouragement = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>成长树状态</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 树苗主卡片 */}
        <View style={styles.mainCard}>
          <View style={styles.treeContainer}>
            <TreeMascot size={140} stage={treeStage} interruptState={interruptState} />
          </View>
          <Text style={styles.treeName}>{treeInfo.emoji} {treeInfo.name}</Text>
          <Text style={styles.treeStage}>等级 {currentStage + 1} · {treeInfo.description}</Text>
          
          {/* 中断状态提示 */}
          <View style={[styles.interruptAlert, interruptState !== 'healthy' && styles.interruptAlertWarning]}>
            <Text style={[styles.interruptText, interruptState !== 'healthy' && styles.interruptTextWarning]}>
              {getInterruptMessage()}
            </Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{foxState.totalWords}</Text>
              <Text style={styles.miniStatLabel}>已学词汇</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{foxState.consecutiveDays}</Text>
              <Text style={styles.miniStatLabel}>连续天数</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>升级进度</Text>
              <Text style={styles.progressValue}>{foxState.totalWords} / {nextFoxInfo?.minWords || 2001} 词</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progressToNextStage, 100)}%` }]} />
            </View>
            {nextStage < 10 ? (
              <Text style={styles.progressHint}>再学 {wordsToNextStage} 词就能升级啦~</Text>
            ) : (
              <Text style={styles.progressHint}>已到达最高等级！🌟</Text>
            )}
          </View>
        </View>

        {/* 下一阶段预览 */}
        {nextStage < 10 && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>🌱 下一阶段预览</Text>
            <View style={styles.previewContent}>
              <TreeMascot size={60} stage={nextStage} interruptState="healthy" />
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{TREE_STAGES[nextStage as keyof typeof TREE_STAGES]?.emoji} {TREE_STAGES[nextStage as keyof typeof TREE_STAGES]?.name}</Text>
                <Text style={styles.previewDesc}>需要掌握 {nextFoxInfo?.minWords} 词汇</Text>
              </View>
            </View>
          </View>
        )}

        {/* 飞狐等级说明（对应孩子端显示） */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🦊 飞狐等级说明</Text>
          <View style={styles.foxLevelInfo}>
            <View style={styles.currentFoxRow}>
              <Text style={styles.currentFoxEmoji}>{currentFoxInfo?.emoji}</Text>
              <View style={styles.currentFoxInfo}>
                <Text style={[styles.currentFoxName, { color: currentFoxInfo?.color }]}>{currentFoxInfo?.name}</Text>
                <Text style={styles.currentFoxDesc}>{currentFoxInfo?.description}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.infoSubtitle}>📖 成长阶段一览</Text>
          {Object.entries(TREE_STAGES).map(([stage, info]) => {
            const foxInfo = FOX_STAGES[parseInt(stage) as keyof typeof FOX_STAGES];
            const isUnlocked = parseInt(stage) <= currentStage;
            return (
              <View key={stage} style={styles.stageRow}>
                <View style={[styles.stageIndicator, isUnlocked && { backgroundColor: foxInfo?.color || '#70AD47' }]}>
                  <Text style={styles.stageEmoji}>{info.emoji}</Text>
                </View>
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>
                    {info.name}
                    <Text style={styles.stageWords}> · {foxInfo?.minWords}+词</Text>
                  </Text>
                  <Text style={[styles.stageUnlock, isUnlocked && styles.stageUnlockActive]}>
                    {isUnlocked ? `✓ ${foxInfo?.name}` : `🔒 ${foxInfo?.name}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 已解锁成就 */}
        <View style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>🏅 已解锁成就</Text>
          {unlockedAchievements.length > 0 ? (
            <View style={styles.achievementGrid}>
              {unlockedAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDesc}>{achievement.description}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noAchievement}>还没有解锁成就，继续加油哦~</Text>
          )}
        </View>

        {/* 待解锁成就 */}
        <View style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>🔒 待解锁成就</Text>
          <View style={styles.achievementGrid}>
            {lockedAchievements.slice(0, 6).map((achievement) => (
              <View key={achievement.id} style={[styles.achievementItem, styles.achievementItemLocked]}>
                <Text style={styles.achievementEmojiLocked}>?</Text>
                <Text style={styles.achievementNameLocked}>{achievement.name}</Text>
                <Text style={styles.achievementDescLocked}>{achievement.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 鼓励语 */}
        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementText}>{randomEncouragement}</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backIcon: { fontSize: 28, color: '#70AD47' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20 },
  mainCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  treeContainer: { marginBottom: 16 },
  treeName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  treeStage: { fontSize: 14, color: '#70AD47', marginBottom: 12 },
  interruptAlert: { backgroundColor: '#E8F5E9', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 16 },
  interruptAlertWarning: { backgroundColor: '#FFF3E0' },
  interruptText: { fontSize: 13, color: '#70AD47' },
  interruptTextWarning: { color: '#FF9800' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  miniStat: { alignItems: 'center', paddingHorizontal: 30 },
  miniStatValue: { fontSize: 28, fontWeight: 'bold', color: '#70AD47' },
  miniStatLabel: { fontSize: 13, color: '#999', marginTop: 4 },
  progressSection: { width: '100%' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: '#666' },
  progressValue: { fontSize: 14, color: '#70AD47', fontWeight: '600' },
  progressBar: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#70AD47', borderRadius: 6 },
  progressHint: { fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' },
  previewCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  previewTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  previewContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16 },
  previewInfo: { marginLeft: 16, flex: 1 },
  previewName: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  previewDesc: { fontSize: 13, color: '#4CAF50', marginTop: 4 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  foxLevelInfo: { backgroundColor: '#FFF9E6', borderRadius: 12, padding: 16, marginBottom: 16 },
  currentFoxRow: { flexDirection: 'row', alignItems: 'center' },
  currentFoxEmoji: { fontSize: 48 },
  currentFoxInfo: { marginLeft: 16 },
  currentFoxName: { fontSize: 20, fontWeight: 'bold' },
  currentFoxDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  infoSubtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  stageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stageIndicator: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  stageEmoji: { fontSize: 18 },
  stageInfo: { marginLeft: 12, flex: 1 },
  stageName: { fontSize: 15, color: '#333', fontWeight: '600' },
  stageWords: { fontSize: 13, color: '#999', fontWeight: 'normal' },
  stageUnlock: { fontSize: 12, color: '#999', marginTop: 2 },
  stageUnlockActive: { color: '#70AD47' },
  achievementCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achievementItem: { width: '47%', backgroundColor: '#F0FFF0', borderRadius: 12, padding: 12, alignItems: 'center' },
  achievementItemLocked: { backgroundColor: '#F5F5F5' },
  achievementEmoji: { fontSize: 32, marginBottom: 8 },
  achievementEmojiLocked: { fontSize: 32, marginBottom: 8, color: '#CCC' },
  achievementName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  achievementNameLocked: { fontSize: 14, fontWeight: 'bold', color: '#999' },
  achievementDesc: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  achievementDescLocked: { fontSize: 11, color: '#AAA', marginTop: 4, textAlign: 'center' },
  noAchievement: { fontSize: 14, color: '#999', textAlign: 'center', paddingVertical: 20 },
  encouragementCard: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  encouragementText: { fontSize: 15, color: '#70AD47', textAlign: 'center', fontWeight: '600' },
});
